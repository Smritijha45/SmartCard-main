import { Router } from 'express';
import CompanyController from './controller';
import { authenticate, requireRole } from '../../middlewares/auth';
import { UserRole } from '../../constants/roles';

const router = Router();
const controller = new CompanyController();

router.use(authenticate);

// Workspace base
router.get('/workspace', controller.getWorkspace);
router.post('/', controller.create);
router.patch('/branding', requireRole(UserRole.ADMIN), controller.updateBranding);

// Team Member Management
router.get('/members', controller.getMembers);
router.patch('/members/:id/role', requireRole(UserRole.ADMIN), controller.updateMemberRole);
router.delete('/members/:id', requireRole(UserRole.ADMIN), controller.removeMember);

// Invitations
router.get('/invitations', requireRole(UserRole.MANAGER), controller.getInvitations);
router.post('/invitations', requireRole(UserRole.MANAGER), controller.sendInvitation);
router.post('/invitations/:token/accept', controller.acceptInvitation);
router.post('/invitations/:token/reject', controller.rejectInvitation);
router.delete('/invitations/:id', requireRole(UserRole.ADMIN), controller.revokeInvitation);

// Team Cards Directory
router.get('/cards', controller.getCards);
router.patch('/cards/:id/suspend', requireRole(UserRole.MANAGER), controller.setCardSuspension);

// Custom Domains
router.post('/domain', requireRole(UserRole.ADMIN), controller.configureDomain);
router.post('/domain/verify', requireRole(UserRole.ADMIN), controller.verifyDomain);
router.delete('/domain', requireRole(UserRole.ADMIN), controller.removeDomain);

// SSO Configuration & Validation
router.post('/sso/validate', requireRole(UserRole.ADMIN), controller.validateSSO);
router.patch('/sso', requireRole(UserRole.ADMIN), controller.updateSSO);

// Audit Logs & Reports
router.get('/audit-logs', requireRole(UserRole.ADMIN), controller.getAuditLogs);
router.get('/reports/export', requireRole(UserRole.MANAGER), controller.exportReport);

// Enterprise Support Tickets
router.post('/support', controller.createSupportTicket);
router.get('/support', controller.getSupportTickets);
router.post('/support/:id/messages', controller.addSupportMessage);

export default router;
export { router as companyRoutes };
