import bcrypt from 'bcryptjs';
import { UserRepository, IUserRepository } from './repository';
import { UserResponseDTO, toUserResponseDTO } from './types';
import { NotFoundError, BadRequestError } from '../../errors/AppError';
import { UserRole } from '../../constants/roles';
import { normalizePlanTier } from '../../config/plans';

export class UserService {
  private userRepository: IUserRepository;

  constructor(userRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  async getUserProfile(userId: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }
    return toUserResponseDTO(user);
  }

  async updateUserProfile(userId: string, updateData: { name?: string; email?: string; profilePhoto?: string }): Promise<UserResponseDTO> {
    if (updateData.email) {
      const existingUser = await this.userRepository.findByEmail(updateData.email);
      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestError('Email is already taken by another account');
      }
    }

    const updatedUser = await this.userRepository.update(userId, { $set: updateData });
    if (!updatedUser) {
      throw new NotFoundError('User profile not found for updating');
    }

    return toUserResponseDTO(updatedUser);
  }

  async updateSubscriptionPlan(userId: string, plan: string): Promise<UserResponseDTO> {
    const normalized = normalizePlanTier(plan);
    const updatedUser = await this.userRepository.update(userId, {
      $set: { subscriptionPlan: normalized }
    });

    if (!updatedUser) {
      throw new NotFoundError('User profile not found');
    }

    return toUserResponseDTO(updatedUser);
  }

  async changePassword(userId: string, passwords: { oldPassword: string; newPassword: string }): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    const matches = await bcrypt.compare(passwords.oldPassword, user.passwordHash);
    if (!matches) {
      throw new BadRequestError('Incorrect current password provided');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwords.newPassword, salt);

    await this.userRepository.update(userId, { $set: { passwordHash } });
  }

  async updateRole(actorRole: UserRole, targetUserId: string, newRole: UserRole): Promise<UserResponseDTO> {
    // Only Owners or Admins can promote/demote
    if (actorRole !== UserRole.OWNER && actorRole !== UserRole.ADMIN) {
      throw new BadRequestError('Only admins and owners can modify roles');
    }

    const user = await this.userRepository.findById(targetUserId);
    if (!user) {
      throw new NotFoundError('Target user not found');
    }

    // Admins cannot change roles to OWNER or touch other OWNERS
    if (actorRole === UserRole.ADMIN && (newRole === UserRole.OWNER || user.role === UserRole.OWNER)) {
      throw new BadRequestError('Admins cannot grant or modify Owner permissions');
    }

    const updatedUser = await this.userRepository.update(targetUserId, { $set: { role: newRole } });
    if (!updatedUser) {
      throw new NotFoundError('User not found to update role');
    }

    return toUserResponseDTO(updatedUser);
  }
}
export default UserService;
