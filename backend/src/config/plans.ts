/**
 * SmartCard Subscription Plans & Configurable Limits
 * 
 * Supports environment variable overrides for all tier limits:
 * - STARTER_MAX_CARDS (default: 1)
 * - PRO_MAX_CARDS (default: 10)
 * - ENTERPRISE_MAX_CARDS (default: 100)
 * - ENTERPRISE_MAX_MEMBERS (default: 25)
 */

export type SubscriptionPlanTier = 'starter' | 'professional' | 'enterprise';

export interface PlanLimits {
  maxActiveCards: number;
  maxTeamMembers: number;
  allowCrmLeads: boolean;
  allowAdvancedAnalytics: boolean;
  allowPremiumThemes: boolean;
  allowCustomBranding: boolean;
  allowCustomBadges: boolean;
  allowCustomDomains: boolean;
  allowEnterpriseSso: boolean;
  allowTeamAdministration: boolean;
  allowAuditLogs: boolean;
  allowSupportWorkflow: boolean;
  allowCsvJsonExport: boolean;
}

export interface PlanDefinition {
  id: SubscriptionPlanTier;
  name: string;
  priceMonthlyInr: number;
  description: string;
  limits: PlanLimits;
}

export const PLAN_CONFIGS: Record<SubscriptionPlanTier, PlanDefinition> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    priceMonthlyInr: 0,
    description: 'Personal digital identity for individuals. Free forever without payment details.',
    limits: {
      maxActiveCards: parseInt(process.env.STARTER_MAX_CARDS || '1', 10),
      maxTeamMembers: 0,
      allowCrmLeads: false,
      allowAdvancedAnalytics: false,
      allowPremiumThemes: false,
      allowCustomBranding: false,
      allowCustomBadges: false,
      allowCustomDomains: false,
      allowEnterpriseSso: false,
      allowTeamAdministration: false,
      allowAuditLogs: false,
      allowSupportWorkflow: false,
      allowCsvJsonExport: false,
    },
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    priceMonthlyInr: 199,
    description: 'For consultants, creators, and professionals needing lead capture, multiple cards, and analytics.',
    limits: {
      maxActiveCards: parseInt(process.env.PRO_MAX_CARDS || '10', 10),
      maxTeamMembers: 0,
      allowCrmLeads: true,
      allowAdvancedAnalytics: true,
      allowPremiumThemes: true,
      allowCustomBranding: true,
      allowCustomBadges: true,
      allowCustomDomains: false,
      allowEnterpriseSso: false,
      allowTeamAdministration: false,
      allowAuditLogs: false,
      allowSupportWorkflow: false,
      allowCsvJsonExport: true,
    },
  },
  enterprise: {
    id: 'enterprise',
    name: 'Team & Enterprise',
    priceMonthlyInr: 799,
    description: 'Centralized organization workspace, team directory, role management, custom domains, and SSO.',
    limits: {
      maxActiveCards: parseInt(process.env.ENTERPRISE_MAX_CARDS || '100', 10),
      maxTeamMembers: parseInt(process.env.ENTERPRISE_MAX_MEMBERS || '25', 10),
      allowCrmLeads: true,
      allowAdvancedAnalytics: true,
      allowPremiumThemes: true,
      allowCustomBranding: true,
      allowCustomBadges: true,
      allowCustomDomains: true,
      allowEnterpriseSso: true,
      allowTeamAdministration: true,
      allowAuditLogs: true,
      allowSupportWorkflow: true,
      allowCsvJsonExport: true,
    },
  },
};

/**
 * Normalizes plan tier string (handles legacy 'Free', 'Pro', 'Enterprise' or lowercase)
 */
export function normalizePlanTier(rawPlan?: string): SubscriptionPlanTier {
  if (!rawPlan) return 'starter';
  const clean = rawPlan.toLowerCase().trim();
  if (clean === 'pro' || clean === 'professional') return 'professional';
  if (clean === 'enterprise' || clean === 'team' || clean === 'team_enterprise') return 'enterprise';
  return 'starter';
}

/**
 * Retrieves the effective plan configuration
 */
export function getPlanConfig(plan?: string): PlanDefinition {
  const tier = normalizePlanTier(plan);
  return PLAN_CONFIGS[tier];
}

/**
 * Checks if a specific feature is enabled for a given plan
 */
export function isFeatureAllowed(plan: string | undefined, feature: keyof PlanLimits): boolean {
  const config = getPlanConfig(plan);
  const value = config.limits[feature];
  return typeof value === 'boolean' ? value : value > 0;
}
