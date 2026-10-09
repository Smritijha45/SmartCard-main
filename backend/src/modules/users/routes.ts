import { Router } from 'express';
import UserController from './controller';
import { authenticate } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { updateProfileSchema, changePasswordSchema, updateUserRoleSchema, updatePlanSchema } from './validation';

const router = Router();
const controller = new UserController();

router.use(authenticate);

router.get('/me', controller.getProfile);
router.patch('/me', validateRequest(updateProfileSchema), controller.updateProfile);
router.patch('/me/plan', validateRequest(updatePlanSchema), controller.updatePlan);
router.post('/me/pass-24h', controller.purchase24hPass);
router.post('/me/change-password', validateRequest(changePasswordSchema), controller.changePassword);

router.patch('/:id/role', validateRequest(updateUserRoleSchema), controller.changeUserRole);

export default router;
export { router as userRoutes };
