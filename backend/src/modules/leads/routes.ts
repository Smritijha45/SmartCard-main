import { Router } from 'express';
import LeadController from './controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();
const controller = new LeadController();

router.post('/', controller.create);
router.get('/', authenticate, controller.getMyLeads);
router.get('/export', authenticate, controller.exportLeads);
router.patch('/:id/status', authenticate, controller.updateStatus);
router.patch('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.delete);

export default router;
