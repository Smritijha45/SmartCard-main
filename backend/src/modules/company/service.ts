import { CompanyRepository } from './repository';
import { UserRepository } from '../users/repository';
import { CompanyResponseDTO, toCompanyResponseDTO, TeamMemberDTO } from './types';
import { NotFoundError, BadRequestError, ConflictError, ForbiddenError } from '../../errors/AppError';
import { UserRole } from '../../constants/roles';

export class CompanyService {
  private companyRepository: CompanyRepository;
  private userRepository: UserRepository;

  constructor(
    companyRepository = new CompanyRepository(),
    userRepository = new UserRepository()
  ) {
    this.companyRepository = companyRepository;
    this.userRepository = userRepository;
  }

  async createCompany(ownerId: string, companyData: { name: string; domain?: string }): Promise<CompanyResponseDTO> {
    const user = await this.userRepository.findById(ownerId);
    if (!user) {
      throw new NotFoundError('Owner user profile not found');
    }

    if (user.companyId) {
      throw new BadRequestError('User is already associated with a company workspace');
    }

    if (companyData.domain) {
      const existingDomain = await this.companyRepository.findByDomain(companyData.domain);
      if (existingDomain) {
        throw new ConflictError('Company domain is already registered');
      }
    }

    // Create company workspace
    const company = await this.companyRepository.create({
      name: companyData.name,
      domain: companyData.domain,
      ownerId: ownerId,
      subscriptionPlan: 'Free',
      isSuspended: false
    });

    // Update owner's company association and promote to OWNER role
    await this.userRepository.update(ownerId, {
      $set: {
        companyId: company.id,
        role: UserRole.OWNER
      }
    });

    return toCompanyResponseDTO(company);
  }

  async addTeamMember(companyId: string, actorId: string, memberData: { email: string; role: UserRole }): Promise<TeamMemberDTO> {
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError('Company workspace not found');
    }

    // Role safety check: only Owner/Admin of company can provision
    if (company.ownerId.toString() !== actorId) {
      // Allow general company admins too if user is mapped as company Admin
      const actor = await this.userRepository.findById(actorId);
      if (!actor || actor.role !== UserRole.ADMIN || actor.companyId?.toString() !== companyId) {
        throw new ForbiddenError('Only company owners and administrators can add members');
      }
    }

    const memberUser = await this.userRepository.findByEmail(memberData.email);
    if (!memberUser) {
      throw new NotFoundError('User with specified email address does not exist. Please have them register first.');
    }

    if (memberUser.companyId) {
      throw new BadRequestError('User is already member of a company workspace');
    }

    // Restriction: Cannot add OWNER role
    if (memberData.role === UserRole.OWNER) {
      throw new BadRequestError('Workspace can only contain one Owner. Use Admin or Manager instead.');
    }

    const updatedUser = await this.userRepository.update(memberUser.id, {
      $set: {
        companyId: companyId,
        role: memberData.role
      }
    });

    if (!updatedUser) {
      throw new NotFoundError('Failed to associate user to workspace');
    }

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    };
  }

  async removeTeamMember(companyId: string, actorId: string, memberUserId: string): Promise<void> {
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError('Company workspace not found');
    }

    // Authority check
    if (company.ownerId.toString() !== actorId) {
      throw new ForbiddenError('Only workspace Owner can remove members');
    }

    const memberUser = await this.userRepository.findById(memberUserId);
    if (!memberUser || memberUser.companyId?.toString() !== companyId) {
      throw new NotFoundError('Member not found in this workspace');
    }

    if (memberUser.role === UserRole.OWNER) {
      throw new BadRequestError('Cannot remove the workspace Owner');
    }

    // Reset member association
    await this.userRepository.update(memberUserId, {
      $unset: { companyId: 1 },
      $set: { role: UserRole.USER }
    });
  }

  async getTeamMembers(companyId: string): Promise<TeamMemberDTO[]> {
    const members = await this.userRepository.find({ companyId });
    return members.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      role: m.role
    }));
  }
}
export default CompanyService;
