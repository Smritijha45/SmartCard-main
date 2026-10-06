import { Router } from 'express';
import LeadController from './controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();
const controller = new LeadController();

router.post('/', controller.create);
router.get('/', authenticate, controller.getMyLeads);

export default router;
