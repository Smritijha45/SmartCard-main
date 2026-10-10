import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthService } from '../src/modules/auth/service';
import config from '../src/config';
import { UnauthorizedError, ConflictError } from '../src/errors/AppError';
import { UserRole } from '../src/constants/roles';

describe('Authentication & Account Security Test Suite', () => {
  let authService: AuthService;
  let mockUserRepo: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUserRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findByResetToken: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findActiveSession: jest.fn(),
      revokeRefreshToken: jest.fn(),
      addRefreshToken: jest.fn(),
    };
    authService = new AuthService(mockUserRepo);
  });

  describe('Registration Flow', () => {
    it('should successfully register a new user with accountId and hashed password', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      const mockCreatedUser = {
        id: '507f1f77bcf86cd799439011',
        accountId: 'ACC-000043',
        name: 'Smriti Jha',
        email: 'smriti@smartcard.app',
        role: UserRole.USER,
        subscriptionPlan: 'starter',
        subscription: { plan: 'starter', status: 'active', is24hPass: false },
      };

      mockUserRepo.create.mockResolvedValue(mockCreatedUser);

      const result = await authService.register({
        name: 'Smriti Jha',
        email: 'smriti@smartcard.app',
        password: 'SecurePassword123!',
      });

      expect(result).toBeDefined();
      expect(result.user.email).toBe('smriti@smartcard.app');
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });

    it('should reject registration if email is already registered', async () => {
      mockUserRepo.findByEmail.mockResolvedValue({
        id: 'user_existing_1',
        email: 'smriti@smartcard.app',
      });

      await expect(
        authService.register({
          name: 'Smriti Jha',
          email: 'smriti@smartcard.app',
          password: 'SecurePassword123!',
        })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('Login Flow', () => {
    it('should successfully log in with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('CorrectPassword123!', 10);
      const mockUser = {
        id: '507f1f77bcf86cd799439011',
        accountId: 'ACC-000043',
        name: 'Smriti Jha',
        email: 'smriti@smartcard.app',
        passwordHash: hashedPassword,
        role: UserRole.USER,
        subscriptionPlan: 'starter',
      };

      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      mockUserRepo.addRefreshToken.mockResolvedValue(true);

      const result = await authService.login({
        email: 'smriti@smartcard.app',
        password: 'CorrectPassword123!',
      });

      expect(result.user.email).toBe('smriti@smartcard.app');
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });

    it('should reject login with incorrect password', async () => {
      const hashedPassword = await bcrypt.hash('CorrectPassword123!', 10);
      const mockUser = {
        id: '507f1f77bcf86cd799439011',
        email: 'smriti@smartcard.app',
        passwordHash: hashedPassword,
      };

      mockUserRepo.findByEmail.mockResolvedValue(mockUser);

      await expect(
        authService.login({
          email: 'smriti@smartcard.app',
          password: 'WrongPassword!',
        })
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should reject login for non-existent email', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'nonexistent@smartcard.app',
          password: 'Password123!',
        })
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('Token Security & Authorization', () => {
    it('should reject invalid or tampered access tokens', () => {
      const tamperedToken = 'invalid.jwt.token';
      expect(() => {
        jwt.verify(tamperedToken, config.JWT_ACCESS_SECRET);
      }).toThrow();
    });

    it('should reject expired access tokens', () => {
      const expiredToken = jwt.sign(
        { id: 'usr_123', email: 'test@smartcard.app', role: 'user' },
        config.JWT_ACCESS_SECRET,
        { expiresIn: '-1s' }
      );

      expect(() => {
        jwt.verify(expiredToken, config.JWT_ACCESS_SECRET);
      }).toThrow();
    });

    it('should detect and prevent refresh token reuse breach', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const validToken = jwt.sign({ id: userId }, config.JWT_REFRESH_SECRET);

      mockUserRepo.findById.mockResolvedValue({
        id: userId,
        email: 'smriti@smartcard.app',
        role: UserRole.USER,
      });

      // Session already revoked or rotated previously -> findActiveSession returns false
      mockUserRepo.findActiveSession.mockResolvedValue(false);
      mockUserRepo.update.mockResolvedValue(true);

      // Attempting to rotate stale token triggers reuse breach detection
      await expect(authService.rotateTokens(validToken)).rejects.toThrow('Session revoked due to security violation');
      expect(mockUserRepo.update).toHaveBeenCalledWith(userId, { $set: { refreshTokens: [] } });
    });
  });
});
