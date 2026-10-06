import { Router } from 'express';
import CompanyController from './controller';
import { authenticate, requireRole } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { createCompanySchema, addMemberSchema } from './validation';
import { UserRole } from '../../constants/roles';

const router = Router();
const controller = new CompanyController();

router.use(authenticate);

// Provision workspace
router.post('/', validateRequest(createCompanySchema), controller.create);

// Team management (requires Manager or higher)
router.get('/members', requireRole(UserRole.MANAGER), controller.getMembers);
router.post('/members', requireRole(UserRole.MANAGER), validateRequest(addMemberSchema), controller.addMember);
router.delete('/members/:id', requireRole(UserRole.ADMIN), controller.removeMember);

export default router;
export { router as companyRoutes };
