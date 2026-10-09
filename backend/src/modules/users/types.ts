import { UserRole } from '../../constants/roles';
import { SubscriptionPlanTier, getPlanConfig, PlanDefinition, normalizePlanTier } from '../../config/plans';

export interface UserResponseDTO {
  id: string;
  accountId: string;
  name: string;
  email: string;
  role: UserRole;
  subscriptionPlan: SubscriptionPlanTier;
  planConfig: PlanDefinition;
  subscription: {
    plan: SubscriptionPlanTier;
    status: string;
    is24hPass: boolean;
    passExpiryDate?: string;
    passRemainingSeconds?: number;
    trialStartDate?: string;
    trialExpiryDate?: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    paymentProvider?: string;
    paymentHistory: any[];
  };
  isEmailVerified: boolean;
  companyId?: string;
  profilePhoto?: string;
  isSuspended?: boolean;
  createdAt: string;
  updatedAt: string;
}

export function toUserResponseDTO(user: any): UserResponseDTO {
  let rawPlan = user.subscription?.plan || user.subscriptionPlan || 'starter';
  let plan = normalizePlanTier(rawPlan);
  const sub = user.subscription || {
    plan: 'starter',
    status: 'active',
    is24hPass: false,
    paymentHistory: []
  };

  // Check 24-hour pass expiration
  let is24hPass = sub.is24hPass || false;
  let passExpiryDate = sub.passExpiryDate ? new Date(sub.passExpiryDate) : undefined;
  let passRemainingSeconds = 0;

  if (is24hPass && passExpiryDate) {
    const diffMs = passExpiryDate.getTime() - Date.now();
    if (diffMs <= 0) {
      // Expired! Revert plan to starter
      plan = 'starter';
      is24hPass = false;
    } else {
      passRemainingSeconds = Math.floor(diffMs / 1000);
      plan = 'professional';
    }
  }

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

  const accountId = user.accountId || `ACC-${(user._id || user.id || 'USER').toString().slice(-6).toUpperCase()}`;

  return {
    id: (user._id || user.id).toString(),
    accountId,
    name: user.name,
    email: user.email,
    role: user.role || UserRole.USER,
    subscriptionPlan: plan,
    planConfig,
    subscription: {
      plan,
      status: sub.status || 'active',
      is24hPass,
      passExpiryDate: passExpiryDate ? passExpiryDate.toISOString() : undefined,
      passRemainingSeconds,
      trialStartDate: sub.trialStartDate ? new Date(sub.trialStartDate).toISOString() : undefined,
      trialExpiryDate: sub.trialExpiryDate ? new Date(sub.trialExpiryDate).toISOString() : undefined,
      currentPeriodStart: sub.currentPeriodStart ? new Date(sub.currentPeriodStart).toISOString() : new Date().toISOString(),
      currentPeriodEnd: sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toISOString() : undefined,
      paymentProvider: sub.paymentProvider || 'manual',
      paymentHistory: sub.paymentHistory || []
    },
    isEmailVerified: user.isEmailVerified || false,
    companyId: user.companyId ? user.companyId.toString() : undefined,
    profilePhoto: user.profilePhoto,
    isSuspended: user.isSuspended || false,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : new Date().toISOString(),
  };
}
