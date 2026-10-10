import { CompanyService } from '../src/modules/company/service';
import { InvitationModel } from '../src/modules/company/invitationModel';
import { AuditLogModel } from '../src/modules/company/auditLogModel';
import { ForbiddenError, NotFoundError } from '../src/errors/AppError';
import { UserRole } from '../src/constants/roles';

jest.mock('../src/modules/company/invitationModel');
jest.mock('../src/modules/company/auditLogModel');
jest.mock('../src/modules/company/supportTicketModel');

describe('Organization & Team RBAC Test Suite', () => {
  let companyService: CompanyService;
  let mockCompanyRepo: any;
  let mockUserRepo: any;
  let mockCardRepo: any;
  let mockLeadRepo: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCompanyRepo = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    mockUserRepo = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
    };
    mockCardRepo = {
      find: jest.fn(),
    };
    mockLeadRepo = {};

    companyService = new CompanyService(
      mockCompanyRepo,
      mockUserRepo,
      mockCardRepo,
      mockLeadRepo as any
    );
  });

  describe('Invitations & Member Management', () => {
    it('should allow Owner to invite a new team member with role', async () => {
      const companyId = '507f1f77bcf86cd799439099';
      const actorId = '507f1f77bcf86cd799439001';
      const mockCompany = {
        _id: companyId,
        id: companyId,
        name: 'Apex Technologies',
        memberLimit: 25,
      };

      mockCompanyRepo.findById.mockResolvedValue(mockCompany);
      mockUserRepo.find.mockResolvedValue([{ id: actorId, role: UserRole.OWNER }]);
      (InvitationModel.countDocuments as jest.Mock).mockResolvedValue(0);
      mockUserRepo.findByEmail.mockResolvedValue(null);
      (InvitationModel.findOne as jest.Mock).mockResolvedValue(null);

      const mockInvitation = {
        _id: 'inv_101',
        id: 'inv_101',
        companyId,
        email: 'colleague@apextech.io',
        role: UserRole.MANAGER,
        token: 'invite_tok_123',
        status: 'pending',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      };
      (InvitationModel.create as jest.Mock).mockResolvedValue(mockInvitation);
      (AuditLogModel.create as jest.Mock).mockResolvedValue({ _id: 'audit_1' });

      const result = await companyService.sendInvitation(
        companyId,
        actorId,
        { email: 'colleague@apextech.io', role: UserRole.MANAGER }
      );

      expect(result).toBeDefined();
      expect(result.email).toBe('colleague@apextech.io');
      expect(result.role).toBe(UserRole.MANAGER);
      expect(AuditLogModel.create).toHaveBeenCalled();
    });

    it('should reject invitation if organization has reached 25-member limit', async () => {
      const companyId = '507f1f77bcf86cd799439099';
      const actorId = '507f1f77bcf86cd799439001';
      const mockCompany = {
        _id: companyId,
        id: companyId,
        name: 'Apex Technologies',
        memberLimit: 25,
      };

      const existingMembers = Array.from({ length: 25 }, (_, i) => ({
        id: `usr_${i}`,
        role: UserRole.EMPLOYEE,
      }));

      mockCompanyRepo.findById.mockResolvedValue(mockCompany);
      mockUserRepo.find.mockResolvedValue(existingMembers);
      (InvitationModel.countDocuments as jest.Mock).mockResolvedValue(0);

      await expect(
        companyService.sendInvitation(
          companyId,
          actorId,
          { email: 'extra@apextech.io', role: UserRole.EMPLOYEE }
        )
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe('Role-Based Access Control & Privilege Boundaries', () => {
    it('should allow Owner or Admin to update a member role and record audit log', async () => {
      const companyId = '507f1f77bcf86cd799439099';
      const actorId = 'usr_owner';
      const targetUserId = 'usr_target';

      mockCompanyRepo.findById.mockResolvedValue({
        _id: companyId,
        id: companyId,
      });

      mockUserRepo.findById.mockImplementation(async (id: string) => {
        if (id === targetUserId) {
          return { id: targetUserId, email: 'target@apextech.io', role: UserRole.EMPLOYEE, companyId };
        }
        return { id: actorId, email: 'owner@apextech.io', role: UserRole.OWNER, companyId };
      });

      mockUserRepo.update.mockResolvedValue(true);
      (AuditLogModel.create as jest.Mock).mockResolvedValue({ _id: 'audit_role_change' });

      await companyService.updateMemberRole(
        companyId,
        actorId,
        targetUserId,
        UserRole.MANAGER
      );

      expect(mockUserRepo.update).toHaveBeenCalledWith(targetUserId, {
        $set: { role: UserRole.MANAGER },
      });
      expect(AuditLogModel.create).toHaveBeenCalled();
    });
  });

  describe('Cross-Organization Boundary Isolation', () => {
    it('should reject operations across non-existent company IDs', async () => {
      mockCompanyRepo.findById.mockResolvedValue(null);

      await expect(
        companyService.getCompanyDetails('org_foreign_999')
      ).rejects.toThrow(NotFoundError);
    });
  });
});
