import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
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

    // Stable Account ID: e.g. ACC-A7B8C9
    const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
    const accountId = `ACC-${randomHex}`;

    // Email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const newUser = await this.userRepository.create({
      accountId,
      name: data.name,
      email: data.email.toLowerCase().trim(),
      passwordHash,
      role: UserRole.USER,
      subscriptionPlan: 'starter',
      subscription: {
        plan: 'starter',
        status: 'active',
        is24hPass: false,
        currentPeriodStart: new Date(),
        paymentHistory: []
      },
      profilePhoto: data.profilePhoto,
      isSuspended: false,
      isEmailVerified: false,
      emailVerificationToken,
      emailVerificationExpires,
      refreshTokens: []
    });

    const tokens = this.generateTokens(
      newUser.id,
      newUser.email,
      newUser.role
    );

    // Persist refresh token session
    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
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

    if (user.isSuspended) {
      throw new ForbiddenError('Your account has been suspended. Please contact organization admin.');
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

  async forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // Return success message to prevent user enumeration
      return { message: 'If this email is registered, a password reset link has been dispatched.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.userRepository.update(user.id, {
      $set: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      }
    });

    logger.info({ email, resetToken }, 'Password reset token generated');

    return {
      message: 'Password reset link sent to your email address.',
      resetToken
    };
  }

  async resetPassword(token: string, newPass: string): Promise<{ message: string }> {
    const user = await this.userRepository.findByResetToken(token);
    if (!user) {
      throw new BadRequestError('Invalid or expired password reset token');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPass, salt);

    await this.userRepository.update(user.id, {
      $set: {
        passwordHash,
        refreshTokens: [] // Revoke all existing sessions for security
      },
      $unset: {
        resetPasswordToken: '',
        resetPasswordExpires: ''
      }
    });

    return { message: 'Password updated successfully. You can now log in.' };
  }

  async verifyEmail(token?: string, email?: string, code?: string): Promise<{ message: string; isVerified: boolean }> {
    if (token) {
      const user = await this.userRepository.findByVerificationToken(token);
      if (!user) {
        throw new BadRequestError('Invalid or expired email verification token');
      }

      await this.userRepository.update(user.id, {
        $set: { isEmailVerified: true },
        $unset: { emailVerificationToken: '', emailVerificationExpires: '' }
      });

      return { message: 'Email successfully verified!', isVerified: true };
    }

    if (email && code) {
      const redis = getRedisClient(config.REDIS_URI);
      const cached = await redis.get(`email_verify:${email.toLowerCase()}`);
      if (!cached || cached !== code) {
        throw new BadRequestError('Invalid or expired verification code');
      }

      const user = await this.userRepository.findByEmail(email);
      if (!user) throw new NotFoundError('User not found');

      await this.userRepository.update(user.id, {
        $set: { isEmailVerified: true }
      });
      await redis.del(`email_verify:${email.toLowerCase()}`);

      return { message: 'Email successfully verified!', isVerified: true };
    }

    throw new BadRequestError('Verification token or code required');
  }

  async resendVerification(email: string): Promise<{ message: string; verificationToken?: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return { message: 'Verification link sent if account exists.' };
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.userRepository.update(user.id, {
      $set: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires
      }
    });

    return {
      message: 'Verification link re-sent to your email.',
      verificationToken
    };
  }

  async requestOtp(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User not registered');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const redis = getRedisClient(config.REDIS_URI);

    const redisKey = `otp:${email.toLowerCase()}`;
    await redis.setex(redisKey, 300, otpCode);
  }

  async verifyOtp(email: string, code: string, ip?: string, device?: string): Promise<AuthResponse> {
    const redis = getRedisClient(config.REDIS_URI);
    const redisKey = `otp:${email.toLowerCase()}`;
    const cachedCode = await redis.get(redisKey);

    if (!cachedCode || cachedCode !== code) {
      throw new BadRequestError('Invalid or expired OTP code');
    }

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
}
export default AuthService;
