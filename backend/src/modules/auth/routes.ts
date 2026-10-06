import { Router } from 'express';
import AuthController from './controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { authenticate } from '../../middlewares/auth';
import {
  registerSchema,
  loginSchema,
  requestOtpSchema,
  verifyOtpSchema
} from './validation';

const router = Router();
const controller = new AuthController();

router.post('/register', validateRequest(registerSchema), controller.register);
router.post('/signup', validateRequest(registerSchema), controller.register);
router.post('/login', validateRequest(loginSchema), controller.login);
router.post('/refresh', controller.refresh); // Reading cookie manually or from body

router.post('/otp/request', validateRequest(requestOtpSchema), controller.requestOtp);
router.post('/otp/verify', validateRequest(verifyOtpSchema), controller.verifyOtp);

router.post('/logout', authenticate, controller.logout);
router.get('/me', authenticate, controller.me);

export default router;
export { router as authRoutes };
