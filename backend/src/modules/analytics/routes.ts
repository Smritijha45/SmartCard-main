import { Router } from 'express';
import AnalyticsController from './controller';
import { authenticate } from '../../middlewares/auth';
import { rateLimiter } from '../../middlewares/rateLimiter';
import { validateRequest } from '../../middlewares/validateRequest';
import { trackEventSchema, queryAnalyticsSchema } from './validation';

const router = Router();
const controller = new AnalyticsController();

// Rate limit public event tracking endpoint to throttle QR / View spam attacks
router.post(
  '/track',
  rateLimiter(200, 60000), // 200 requests per minute max
  validateRequest(trackEventSchema),
  controller.track
);

// Protected stats query route
router.get(
  '/stats',
  authenticate,
  validateRequest(queryAnalyticsSchema),
  controller.getStats
);

export default router;
export { router as analyticsRoutes };
