import { Router } from 'express';
import NotificationController from './controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();
const controller = new NotificationController();

router.get('/', authenticate, controller.getNotifications);
router.patch('/', authenticate, controller.markAllRead);

export default router;
export { router as notificationRoutes };
