import { SubscriptionPlanTier } from '../../config/plans';
import { ICompanyBranding, ICustomDomain, ISSOConfig } from './model';

export interface CompanyResponseDTO {
  id: string;
  name: string;
  domain?: string;
  ownerId: string;
  subscriptionPlan: SubscriptionPlanTier;
  memberLimit: number;
  cardLimit: number;
  branding: ICompanyBranding;
  customDomain?: ICustomDomain;
  ssoConfig?: ISSOConfig;
  memberCount?: number;
  cardCount?: number;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePhoto?: string;
  cardCount?: number;
  isSuspended?: boolean;
  joinedAt?: string;
}

export interface InvitationDTO {
  id: string;
  email: string;
  role: string;
  token: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'revoked';
  expiresAt: string;
  createdAt: string;
  invitedByName?: string;
}

export interface AuditLogDTO {
  id: string;
  actorId: string;
  actorEmail: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
  ip?: string;
  timestamp: string;
}

export interface SupportTicketDTO {
  id: string;
  ticketNumber: string;
  subject: string;
  category: 'technical' | 'billing' | 'sso' | 'domain' | 'feature_request' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  userName: string;
  userEmail: string;
  messages: Array<{
    id?: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    message: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export function toCompanyResponseDTO(company: any, memberCount = 1, cardCount = 0): CompanyResponseDTO {
  return {
    id: (company._id || company.id).toString(),
    name: company.name,
    domain: company.domain,
    ownerId: company.ownerId ? company.ownerId.toString() : '',
    subscriptionPlan: company.subscriptionPlan || 'enterprise',
    memberLimit: company.memberLimit || 25,
    cardLimit: company.cardLimit || 100,
    branding: company.branding || {
      primaryColor: '#2563EB',
      secondaryColor: '#1E293B',
      badgeText: 'Enterprise Verified',
      cardTheme: 'executive-dark'
    },
    customDomain: company.customDomain,
    ssoConfig: company.ssoConfig,
    memberCount,
    cardCount,
    isSuspended: company.isSuspended || false,
    createdAt: company.createdAt ? company.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: company.updatedAt ? company.updatedAt.toISOString() : new Date().toISOString(),
  };
}
