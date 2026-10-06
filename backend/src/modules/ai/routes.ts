import { Router } from 'express';
import AIController from './controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();
const controller = new AIController();

router.get('/suggestions', authenticate, controller.getSuggestions);

export default router;
export { router as aiRoutes };
