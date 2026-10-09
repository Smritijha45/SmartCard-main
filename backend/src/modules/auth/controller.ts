import { Request, Response, NextFunction } from 'express';
import AuthService from './service';
import UserService from '../users/service';
import config from '../../config';

const isProd = config.NODE_ENV === 'production';

export class AuthController {
  private authService: AuthService;
  private userService: UserService;

  constructor(authService = new AuthService(), userService = new UserService()) {
    this.authService = authService;
    this.userService = userService;
  }

  private setRefreshTokenCookie(res: Response, token: string): void {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.authService.register(req.body);
      this.setRefreshTokenCookie(res, response.tokens.refreshToken);

      res.status(201).json({
        success: true,
        message: 'Registration completed successfully',
        data: {
          user: response.user,
          accessToken: response.tokens.accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const credentials = {
        email: req.body.email,
        password: req.body.password,
        ip: req.ip,
        device: req.headers['user-agent']
      };

      const response = await this.authService.login(credentials);
      this.setRefreshTokenCookie(res, response.tokens.refreshToken);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: response.user,
          accessToken: response.tokens.accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const oldToken = req.cookies.refreshToken || req.body.refreshToken;
      const ip = req.ip;
      const device = req.headers['user-agent'];

      const tokens = await this.authService.rotateTokens(oldToken, ip, device);
      this.setRefreshTokenCookie(res, tokens.refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token rotated successfully',
        data: {
          accessToken: tokens.accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const token = req.cookies.refreshToken || req.body.refreshToken;

      if (token) {
        await this.authService.logout(userId, token);
      }

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProd,
        sameSite: 'strict'
      });

      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.forgotPassword(req.body.email);
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.resetToken ? { resetToken: result.resetToken } : undefined
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.resetPassword(req.body.token, req.body.newPassword);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.verifyEmail(req.body.token, req.body.email, req.body.code);
      res.status(200).json({
        success: true,
        message: result.message,
        data: { isVerified: result.isVerified }
      });
    } catch (error) {
      next(error);
    }
  };

  resendVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.resendVerification(req.body.email);
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.verificationToken ? { verificationToken: result.verificationToken } : undefined
      });
    } catch (error) {
      next(error);
    }
  };

  requestOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.authService.requestOtp(req.body.email);

      res.status(200).json({
        success: true,
        message: 'One-time passcode sent to registered email address'
      });
    } catch (error) {
      next(error);
    }
  };

  verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ip = req.ip;
      const device = req.headers['user-agent'];
      const response = await this.authService.verifyOtp(req.body.email, req.body.code, ip, device);

      this.setRefreshTokenCookie(res, response.tokens.refreshToken);

      res.status(200).json({
        success: true,
        message: 'OTP authentication successful',
        data: {
          user: response.user,
          accessToken: response.tokens.accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const profile = await this.userService.getUserProfile(userId);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };
}
export default AuthController;
