import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { UserRepository, IUserRepository } from './repository';
import { UserResponseDTO, toUserResponseDTO } from './types';
import { NotFoundError, BadRequestError } from '../../errors/AppError';
import { UserRole } from '../../constants/roles';
import { normalizePlanTier, PLAN_CONFIGS } from '../../config/plans';

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
    const planDef = PLAN_CONFIGS[normalized];
    const now = new Date();
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const paymentRecord = planDef.priceMonthlyInr > 0 ? {
      id: `pay_${crypto.randomBytes(6).toString('hex')}`,
      amount: planDef.priceMonthlyInr,
      currency: 'INR',
      status: 'completed' as const,
      description: `${planDef.name} Subscription (Monthly)`,
      date: now,
      paymentMethod: 'UPI / Card'
    } : null;

    const updateOps: any = {
      $set: {
        subscriptionPlan: normalized,
        'subscription.plan': normalized,
        'subscription.status': 'active',
        'subscription.is24hPass': false,
        'subscription.currentPeriodStart': now,
        'subscription.currentPeriodEnd': periodEnd,
      }
    };

    if (paymentRecord) {
      updateOps.$push = { 'subscription.paymentHistory': paymentRecord };
    }

    const updatedUser = await this.userRepository.update(userId, updateOps);
    if (!updatedUser) {
      throw new NotFoundError('User profile not found');
    }

    return toUserResponseDTO(updatedUser);
  }

  async purchase24hPass(userId: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    const now = new Date();
    const passExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); // exactly 24 hours
    const paymentId = `pay_pass_${crypto.randomBytes(6).toString('hex')}`;

    const passPaymentRecord = {
      id: paymentId,
      amount: 20,
      currency: 'INR',
      status: 'completed' as const,
      description: '24-Hour Introductory Professional Pass (₹20)',
      date: now,
      paymentMethod: 'UPI Instant / Card'
    };

    const updatedUser = await this.userRepository.update(userId, {
      $set: {
        subscriptionPlan: 'professional',
        'subscription.plan': 'professional',
        'subscription.status': 'active',
        'subscription.is24hPass': true,
        'subscription.passExpiryDate': passExpiry,
        'subscription.currentPeriodStart': now,
        'subscription.currentPeriodEnd': passExpiry,
      },
      $push: {
        'subscription.paymentHistory': passPaymentRecord
      }
    });

    if (!updatedUser) {
      throw new NotFoundError('Failed to activate 24-hour pass');
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
    if (actorRole !== UserRole.OWNER && actorRole !== UserRole.ADMIN) {
      throw new BadRequestError('Only admins and owners can modify roles');
    }

    const user = await this.userRepository.findById(targetUserId);
    if (!user) {
      throw new NotFoundError('Target user not found');
    }

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
