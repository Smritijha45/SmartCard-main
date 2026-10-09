import { Router } from 'express';
import AuthController from './controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { authenticate } from '../../middlewares/auth';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  requestOtpSchema,
  verifyOtpSchema
} from './validation';

const router = Router();
const controller = new AuthController();

// Registration & Login
router.post('/register', validateRequest(registerSchema), controller.register);
router.post('/signup', validateRequest(registerSchema), controller.register);
router.post('/login', validateRequest(loginSchema), controller.login);
router.post('/refresh', controller.refresh);

// Password Recovery & Email Verification
router.post('/forgot-password', validateRequest(forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), controller.resetPassword);
router.post('/verify-email', validateRequest(verifyEmailSchema), controller.verifyEmail);
router.post('/resend-verification', validateRequest(resendVerificationSchema), controller.resendVerification);

// OTP Flows
router.post('/otp/request', validateRequest(requestOtpSchema), controller.requestOtp);
router.post('/otp/verify', validateRequest(verifyOtpSchema), controller.verifyOtp);

// Authenticated Session Endpoints
router.post('/logout', authenticate, controller.logout);
router.get('/me', authenticate, controller.me);

export default router;
export { router as authRoutes };
