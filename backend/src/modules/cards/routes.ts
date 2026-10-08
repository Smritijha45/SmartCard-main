import { Router } from 'express';
import CardController from './controller';
import { authenticate } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { createCardSchema, updateCardSchema } from './validation';

const router = Router();
const controller = new CardController();

// Publicly accessible view endpoints
router.get('/public/:username', controller.getPublicCard);
router.get('/:id', controller.getOne);

// Protected routes (require auth)
router.use(authenticate);

router.post('/', validateRequest(createCardSchema), controller.create);
router.get('/', controller.getMyCards);
router.put('/:id', validateRequest(updateCardSchema), controller.update);
router.patch('/:id', validateRequest(updateCardSchema), controller.update);
router.delete('/:id', controller.delete);
router.post('/:id/send-whatsapp', controller.sendWhatsApp);

export default router;
export { router as cardRoutes };
