import { UserRole } from '../../constants/roles';
import { SubscriptionPlanTier, getPlanConfig, PlanDefinition } from '../../config/plans';

export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subscriptionPlan: SubscriptionPlanTier;
  planConfig: PlanDefinition;
  companyId?: string;
  profilePhoto?: string;
  isSuspended?: boolean;
  createdAt: string;
  updatedAt: string;
}

export function toUserResponseDTO(user: any): UserResponseDTO {
  const plan = (user.subscriptionPlan || 'starter') as SubscriptionPlanTier;
  const planConfig = getPlanConfig(plan);

  // If user has custom limits overrides, merge them
  if (user.customLimits) {
    if (user.customLimits.maxActiveCards !== undefined) {
      planConfig.limits.maxActiveCards = user.customLimits.maxActiveCards;
    }
    if (user.customLimits.maxTeamMembers !== undefined) {
      planConfig.limits.maxTeamMembers = user.customLimits.maxTeamMembers;
    }
  }

  return {
    id: (user._id || user.id).toString(),
    name: user.name,
    email: user.email,
    role: user.role || UserRole.USER,
    subscriptionPlan: plan,
    planConfig,
    companyId: user.companyId ? user.companyId.toString() : undefined,
    profilePhoto: user.profilePhoto,
    isSuspended: user.isSuspended || false,
    createdAt: user.createdAt ? user.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: user.updatedAt ? user.updatedAt.toISOString() : new Date().toISOString(),
  };
}
