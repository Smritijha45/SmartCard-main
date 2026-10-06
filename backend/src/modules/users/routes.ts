import { Router } from 'express';
import UserController from './controller';
import { authenticate, requireRole } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { updateUserSchema, changePasswordSchema, updateRoleSchema } from './validation';
import { UserRole } from '../../constants/roles';

const router = Router();
const controller = new UserController();

// All user routes require authentication
router.use(authenticate);

router.get('/me', controller.getProfile);
router.patch('/me', validateRequest(updateUserSchema), controller.updateProfile);
router.post('/me/change-password', validateRequest(changePasswordSchema), controller.changePassword);

// Role modification requires admin role or higher
router.patch(
  '/:id/role',
  requireRole(UserRole.ADMIN),
  validateRequest(updateRoleSchema),
  controller.changeUserRole
);

export default router;
// Named export
export { router as userRoutes };
