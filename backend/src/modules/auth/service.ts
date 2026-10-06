import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../users/repository';
import { getRedisClient } from '../../lib/redis';
import config from '../../config';
import { UnauthorizedError, BadRequestError, ForbiddenError, ConflictError, NotFoundError } from '../../errors/AppError';
import { AuthResponse, AuthTokens } from './types';
import { toUserResponseDTO } from '../users/types';
import { UserRole } from '../../constants/roles';
import logger from '../../lib/logger';

export class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  private generateTokens(userId: string, email: string, role: UserRole, companyId?: string): AuthTokens {
    const accessToken = jwt.sign(
      { id: userId, email, role, companyId },
      config.JWT_ACCESS_SECRET,
      { expiresIn: config.JWT_ACCESS_EXPIRY as any }
    );

    const refreshToken = jwt.sign(
      { id: userId },
      config.JWT_REFRESH_SECRET,
      { expiresIn: config.JWT_REFRESH_EXPIRY as any }
    );

    return { accessToken, refreshToken };
  }

  async register(data: { name: string; email: string; password: string; profilePhoto?: string }): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('User with this email address already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const newUser = await this.userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: UserRole.USER,
      profilePhoto: data.profilePhoto,
      refreshTokens: []
    });

    const tokens = this.generateTokens(
      newUser.id,
      newUser.email,
      newUser.role
    );

    // Persist refresh token session
    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days matching config
    await this.userRepository.addRefreshToken(newUser.id, tokens.refreshToken, refreshExpiry);

    return {
      user: toUserResponseDTO(newUser),
      tokens
    };
  }

  async login(credentials: { email: string; password?: string; ip?: string; device?: string }): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!credentials.password) {
      throw new BadRequestError('Password is required for traditional login');
    }

    const matches = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = this.generateTokens(
      user.id,
      user.email,
      user.role,
      user.companyId?.toString()
    );

    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.userRepository.addRefreshToken(user.id, tokens.refreshToken, refreshExpiry, credentials.ip, credentials.device);

    return {
      user: toUserResponseDTO(user),
      tokens
    };
  }

  async rotateTokens(oldRefreshToken: string, ip?: string, device?: string): Promise<AuthTokens> {
    let payload: any;
    try {
      payload = jwt.verify(oldRefreshToken, config.JWT_REFRESH_SECRET);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const userId = payload.id;
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User session not found');
    }

    // Refresh Token Rotation & Reuse Detection
    const isActiveSession = await this.userRepository.findActiveSession(userId, oldRefreshToken);
    if (!isActiveSession) {
      // Possible token reuse attack! Log breach alert, invalidate all sessions
      logger.error({ userId, oldRefreshToken }, 'REFRESH TOKEN REUSE DETECTED. Revoking all user sessions.');
      await this.userRepository.update(userId, { $set: { refreshTokens: [] } });
      throw new ForbiddenError('Session revoked due to security violation');
    }

    // Revoke old token
    await this.userRepository.revokeRefreshToken(userId, oldRefreshToken);

    // Generate new pair
    const tokens = this.generateTokens(
      user.id,
      user.email,
      user.role,
      user.companyId?.toString()
    );

    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.userRepository.addRefreshToken(user.id, tokens.refreshToken, refreshExpiry, ip, device);

    return tokens;
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.userRepository.revokeRefreshToken(userId, refreshToken);
  }

  async requestOtp(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User not registered');
    }

    // Generate 6-digit code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const redis = getRedisClient(config.REDIS_URI);

    // Cache in Redis for 5 minutes (300 seconds)
    const redisKey = `otp:${email.toLowerCase()}`;
    await redis.setex(redisKey, 300, otpCode);

    // Enqueue background email delivery task via BullMQ
    try {
      const { createQueue } = require('../../lib/queue');
      const emailQueue = createQueue('email-queue', config.REDIS_URI);
      await emailQueue.add('send-otp', { email, code: otpCode });
      logger.info({ email }, 'OTP task enqueued in background email-queue');
    } catch (err) {
      logger.error({ err }, 'Failed to enqueue OTP email task');
    }
  }

  async verifyOtp(email: string, code: string, ip?: string, device?: string): Promise<AuthResponse> {
    const redis = getRedisClient(config.REDIS_URI);
    const redisKey = `otp:${email.toLowerCase()}`;
    const cachedCode = await redis.get(redisKey);

    if (!cachedCode || cachedCode !== code) {
      throw new BadRequestError('Invalid or expired OTP code');
    }

    // Remove OTP once verified
    await redis.del(redisKey);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const tokens = this.generateTokens(
      user.id,
      user.email,
      user.role,
      user.companyId?.toString()
    );

    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.userRepository.addRefreshToken(user.id, tokens.refreshToken, refreshExpiry, ip, device);

    return {
      user: toUserResponseDTO(user),
      tokens
    };
  }

  async googleOAuthReady(): Promise<string> {
    // Boilerplate setup for Google OAuth redirection
    return 'https://accounts.google.com/o/oauth2/v2/auth?...';
  }
}
export default AuthService;
