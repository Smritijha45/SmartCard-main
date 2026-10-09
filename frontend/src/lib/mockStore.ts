// SmartCard Full Mock Data & Local In-Memory Store
// Provides seamless dummy/local state for frontend standalone operation and development

export type SubscriptionPlanTier = 'starter' | 'professional' | 'enterprise';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
export type UserRole = 'Owner' | 'Admin' | 'Manager' | 'Employee' | 'User';

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
      maxActiveCards: 1,
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
      maxActiveCards: 10,
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
      maxActiveCards: 100,
      maxTeamMembers: 25,
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

export interface SmartCardData {
  _id: string;
  id: string;
  userId?: string;
  companyId?: string;
  username: string;
  name: string;
  title?: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  location?: string;
  themeColor: string;
  template: string;
  cardTheme?: string;
  cardLayout?: string;
  customBadge?: string;
  leadCaptureEnabled?: boolean;
  isSuspended?: boolean;
  isPublic?: boolean;
  profileImage: string;
  employeeCode: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    x?: string;
    instagram?: string;
    github?: string;
  };
  github?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  appearance?: {
    theme?: string;
    accentColor?: string;
    font?: string;
    layout?: string;
  };
  resumeUrl?: string;
  calendarUrl?: string;
  bio: string;
  projects?: Array<{ title: string; description: string; link?: string }>;
  speakingEvents?: Array<{ title: string; date?: string; link?: string }>;
  testimonials?: Array<{ reviewer?: string; quote?: string; text?: string; author?: string; role?: string; company?: string }>;
  totalViews: number;
  totalShares: number;
  uniqueViews: number;
  views?: number;
  scans?: number;
  leadsCount: number;
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LeadData {
  _id: string;
  id: string;
  userId?: string;
  companyId?: string;
  cardId: string;
  cardName: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  notes?: string;
  eventTag?: string;
  score: number;
  status: LeadStatus;
  source: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TeamMemberData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePhoto?: string;
  cardCount: number;
  isSuspended: boolean;
  joinedAt: string;
}

export interface InvitationData {
  id: string;
  email: string;
  role: UserRole;
  token: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'revoked';
  expiresAt: string;
  createdAt: string;
  invitedByName: string;
}

export interface AuditLogData {
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

export interface SupportMessageData {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  message: string;
  createdAt: string;
}

export interface SupportTicketData {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  companyId?: string;
  subject: string;
  category: 'technical' | 'billing' | 'sso' | 'domain' | 'feature_request' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messages: SupportMessageData[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomDomainData {
  domain: string;
  verificationToken: string;
  status: 'pending' | 'verified' | 'failed';
  dnsType: 'TXT' | 'CNAME';
  targetRecord: string;
  routingTarget: string;
  verifiedAt?: string;
  lastCheckedAt?: string;
  verificationError?: string;
}

export interface SSOConfigData {
  enabled: boolean;
  provider: 'google' | 'azure' | 'saml' | 'oidc';
  clientId?: string;
  clientSecret?: string;
  issuerUrl?: string;
  metadataUrl?: string;
  domainHint?: string;
  status: 'unconfigured' | 'active' | 'invalid';
  lastValidatedAt?: string;
  validationError?: string;
}

export interface CompanyData {
  id: string;
  name: string;
  domain?: string;
  ownerId: string;
  subscriptionPlan: SubscriptionPlanTier;
  memberLimit: number;
  cardLimit: number;
  branding: {
    logoUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    badgeText: string;
    hidePlatformBadge: boolean;
    cardTheme: string;
  };
  customDomain?: CustomDomainData;
  ssoConfig: SSOConfigData;
  memberCount?: number;
  cardCount?: number;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'lead' | 'view' | 'share' | 'milestone' | 'team';
  time: string;
  unread: boolean;
}

const INITIAL_USER = {
  id: 'usr_demo_101',
  name: 'Smriti Jha',
  email: 'smriti@smartcard.app',
  role: 'Owner' as UserRole,
  subscriptionPlan: 'professional' as SubscriptionPlanTier,
  companyId: 'org_apex_101',
  profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  createdAt: '2026-01-15T08:00:00.000Z',
  user_metadata: {
    name: 'Smriti Jha',
    full_name: 'Smriti Jha',
  }
};

const INITIAL_CARDS: SmartCardData[] = [
  {
    _id: 'smriti-default-card',
    id: 'smriti-default-card',
    userId: 'usr_demo_101',
    companyId: 'org_apex_101',
    username: 'smriti',
    name: 'Smriti Jha',
    title: 'Lead Software Architect',
    role: 'Lead Software Architect',
    company: 'Apex Technologies',
    bio: 'Architecting scalable cloud applications, high-performance web systems, and zero-trust security.',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    email: 'smriti@smartcard.app',
    phone: '+91 98765 43210',
    website: 'https://smritijha.dev',
    location: 'Bengaluru, India • Remote',
    github: 'https://github.com/smritijha',
    linkedin: 'https://linkedin.com/in/smritijha',
    instagram: 'https://instagram.com/smritijha.dev',
    twitter: 'https://x.com/smritijha',
    cardTheme: 'minimal-modern',
    cardLayout: 'vertical',
    themeColor: '#2563EB',
    template: 'modern',
    employeeCode: 'SMART-002',
    customBadge: 'Core Architect',
    leadCaptureEnabled: true,
    isSuspended: false,
    isPublic: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/smritijha',
      twitter: 'https://x.com/smritijha',
      x: 'https://x.com/smritijha',
      instagram: 'https://instagram.com/smritijha.dev',
      github: 'https://github.com/smritijha'
    },
    appearance: {
      theme: 'minimal-modern',
      accentColor: '#2563EB',
      font: 'sans',
      layout: 'vertical',
    },
    totalViews: 480,
    totalShares: 92,
    uniqueViews: 390,
    views: 480,
    scans: 142,
    leadsCount: 24,
    qrCodeUrl: 'https://smartcard.app/smriti',
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z'
  },
  {
    _id: 'card_alex',
    id: 'card_alex',
    userId: 'usr_demo_101',
    companyId: 'org_apex_101',
    username: 'alex-morgan',
    name: 'Alex Morgan',
    title: 'Founder & Head of Product',
    role: 'Founder & Head of Product',
    company: 'Apex Technologies',
    email: 'alex@apextech.io',
    phone: '+1 415 555 0192',
    website: 'https://apextech.io',
    location: 'San Francisco, CA',
    themeColor: '#2563EB',
    template: 'modern',
    cardTheme: 'dark-gradient',
    customBadge: 'Executive Board',
    leadCaptureEnabled: true,
    isSuspended: false,
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    employeeCode: 'APEX-001',
    bio: 'Building next-generation digital networking tools. Zero paper, zero NFC cards — 100% instant web QR sync.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/alexmorgan',
      twitter: 'https://twitter.com/alexmorgan_dev',
      x: 'https://twitter.com/alexmorgan_dev',
      instagram: 'https://instagram.com/alex_builds',
      github: 'https://github.com/alexmorgan'
    },
    calendarUrl: 'https://cal.com/alex-smartcard',
    resumeUrl: 'https://smartcard.id/resume.pdf',
    isPublic: true,
    testimonials: [
      {
        text: 'SmartCard helped our sales team generate 3x more qualified follow-ups at conferences than paper cards.',
        quote: 'SmartCard helped our sales team generate 3x more qualified follow-ups at conferences than paper cards.',
        reviewer: 'Sarah Lin',
        company: 'Horizon Cloud'
      }
    ],
    totalViews: 1420,
    totalShares: 384,
    uniqueViews: 980,
    views: 1420,
    scans: 412,
    leadsCount: 48,
    qrCodeUrl: 'https://smartcard.app/alex-morgan',
    createdAt: '2026-01-20T10:00:00.000Z'
  },
  {
    _id: 'card_sarah',
    id: 'card_sarah',
    userId: 'usr_sarah_102',
    companyId: 'org_apex_101',
    username: 'sarah-chen',
    name: 'Sarah Chen',
    title: 'VP of Strategic Partnerships',
    role: 'VP of Strategic Partnerships',
    company: 'Apex Technologies',
    email: 'sarah.chen@apextech.io',
    phone: '+1 650 555 0831',
    website: 'https://apextech.io',
    themeColor: '#06B6D4',
    template: 'modern',
    cardTheme: 'glassmorphism',
    customBadge: 'Partnerships Lead',
    leadCaptureEnabled: true,
    isSuspended: false,
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    employeeCode: 'APEX-772',
    bio: 'Investing in seed to Series A software, enterprise tooling, and cloud partnerships.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahchen',
      twitter: 'https://twitter.com/sarahchen_vc'
    },
    calendarUrl: 'https://cal.com/sarah-apex',
    projects: [
      {
        title: 'Enterprise Growth Fund II',
        description: '$80M partnership fund for digital networking and identity tech.',
        link: 'https://apextech.io'
      }
    ],
    totalViews: 890,
    totalShares: 215,
    uniqueViews: 640,
    views: 890,
    scans: 230,
    leadsCount: 29,
    qrCodeUrl: 'https://smartcard.app/sarah-chen',
    createdAt: '2026-02-01T12:00:00.000Z'
  },
  {
    _id: 'card_devon',
    id: 'card_devon',
    userId: 'usr_devon_103',
    companyId: 'org_apex_101',
    username: 'devon-vance',
    name: 'Devon Vance',
    title: 'Principal Design Architect',
    role: 'Principal Design Architect',
    company: 'Apex Technologies',
    email: 'devon@apextech.io',
    phone: '+44 20 7946 0912',
    website: 'https://apextech.io',
    themeColor: '#F59E0B',
    template: 'creative',
    cardTheme: 'neo-brutalist',
    customBadge: 'Design Director',
    leadCaptureEnabled: true,
    isSuspended: false,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    employeeCode: 'APEX-104',
    bio: 'Crafting neo-brutalist digital interfaces, bold branding systems, and memorable web experiences.',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    totalViews: 540,
    totalShares: 132,
    uniqueViews: 410,
    views: 540,
    scans: 165,
    leadsCount: 19,
    qrCodeUrl: 'https://smartcard.app/devon-vance',
    createdAt: '2026-02-15T15:00:00.000Z'
  }
];

const INITIAL_LEADS: LeadData[] = [
  {
    _id: 'lead_1',
    id: 'lead_1',
    userId: 'usr_demo_101',
    companyId: 'org_apex_101',
    name: 'Marcus Brody',
    email: 'marcus@andreessen.com',
    phone: '+1 415 889 1234',
    company: 'Andreessen Capital',
    role: 'Design Partner',
    notes: 'Met at SaaS Global Summit. Discussed rolling out SmartCard to 200 portfolio executives.',
    cardId: 'smriti-default-card',
    cardName: 'Smriti Jha',
    eventTag: 'SaaS Global Summit 2026',
    score: 95,
    status: 'Qualified',
    source: 'public_card',
    createdAt: '2026-10-05T14:20:00Z'
  },
  {
    _id: 'lead_2',
    id: 'lead_2',
    userId: 'usr_demo_101',
    companyId: 'org_apex_101',
    name: 'Elena Rostova',
    email: 'elena.r@horizongrowth.io',
    phone: '+1 650 334 9912',
    company: 'Horizon Growth',
    role: 'Managing Director',
    notes: 'Interested in enterprise seat provisioning and custom domain cards for sales team.',
    cardId: 'card_alex',
    cardName: 'Alex Morgan',
    eventTag: 'Founders Dinner SF',
    score: 91,
    status: 'Contacted',
    source: 'qr_scan',
    createdAt: '2026-10-04T18:10:00Z'
  },
  {
    _id: 'lead_3',
    id: 'lead_3',
    userId: 'usr_sarah_102',
    companyId: 'org_apex_101',
    name: 'Kiran Patel',
    email: 'kiran@velocetech.com',
    phone: '+1 206 555 7788',
    company: 'Veloce Tech',
    role: 'Head of People Ops',
    notes: 'Wants employee directory sync and vCard auto-save for all new hires.',
    cardId: 'card_sarah',
    cardName: 'Sarah Chen',
    eventTag: 'Tech HR Expo',
    score: 84,
    status: 'New',
    source: 'public_card',
    createdAt: '2026-10-02T11:45:00Z'
  },
  {
    _id: 'lead_4',
    id: 'lead_4',
    userId: 'usr_devon_103',
    companyId: 'org_apex_101',
    name: 'Sofia Martinez',
    email: 'sofia@lumina.ai',
    phone: '+1 312 555 4321',
    company: 'Lumina AI',
    role: 'Founder & CEO',
    notes: 'Loved the fast camera QR scan experience. Looking to do a cross-platform integration.',
    cardId: 'card_devon',
    cardName: 'Devon Vance',
    eventTag: 'AI Builders Meetup',
    score: 88,
    status: 'Converted',
    source: 'qr_scan',
    createdAt: '2026-09-28T09:30:00Z'
  },
  {
    _id: 'lead_5',
    id: 'lead_5',
    userId: 'usr_demo_101',
    companyId: 'org_apex_101',
    name: 'Vikram Sethi',
    email: 'vikram@cloudscale.net',
    phone: '+91 99887 76655',
    company: 'CloudScale Asia',
    role: 'Procurement Specialist',
    notes: 'Requested bulk pricing quote for 150 team members.',
    cardId: 'smriti-default-card',
    cardName: 'Smriti Jha',
    eventTag: 'Bangalore Tech Summit',
    score: 62,
    status: 'Lost',
    source: 'direct_link',
    createdAt: '2026-09-20T16:00:00Z'
  }
];

const INITIAL_COMPANY: CompanyData = {
  id: 'org_apex_101',
  name: 'Apex Technologies',
  domain: 'cards.apextech.io',
  ownerId: 'usr_demo_101',
  subscriptionPlan: 'enterprise',
  memberLimit: 25,
  cardLimit: 100,
  branding: {
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    primaryColor: '#2563EB',
    secondaryColor: '#1E293B',
    badgeText: 'Apex Verified Member',
    hidePlatformBadge: false,
    cardTheme: 'executive-dark'
  },
  customDomain: {
    domain: 'cards.apextech.io',
    verificationToken: 'sc_vtok_8f992a10e8c3b49a',
    status: 'verified',
    dnsType: 'TXT',
    targetRecord: 'smartcard-site-verification=sc_vtok_8f992a10e8c3b49a',
    routingTarget: 'cname.smartcard.app',
    verifiedAt: '2026-02-10T10:00:00.000Z',
    lastCheckedAt: '2026-10-09T18:00:00.000Z'
  },
  ssoConfig: {
    enabled: true,
    provider: 'google',
    clientId: '78291029384-k7djh839d.apps.googleusercontent.com',
    clientSecret: 'GOCSPX-mock-secret-99120',
    domainHint: 'apextech.io',
    status: 'active',
    lastValidatedAt: '2026-10-01T12:00:00.000Z'
  },
  isSuspended: false,
  createdAt: '2026-01-15T08:00:00.000Z',
  updatedAt: '2026-10-09T12:00:00.000Z'
};

const INITIAL_TEAM_MEMBERS: TeamMemberData[] = [
  {
    id: 'usr_demo_101',
    name: 'Smriti Jha',
    email: 'smriti@smartcard.app',
    role: 'Owner',
    profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    cardCount: 2,
    isSuspended: false,
    joinedAt: '2026-01-15T08:00:00.000Z'
  },
  {
    id: 'usr_sarah_102',
    name: 'Sarah Chen',
    email: 'sarah.chen@apextech.io',
    role: 'Admin',
    profilePhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    cardCount: 1,
    isSuspended: false,
    joinedAt: '2026-02-01T12:00:00.000Z'
  },
  {
    id: 'usr_devon_103',
    name: 'Devon Vance',
    email: 'devon@apextech.io',
    role: 'Manager',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    cardCount: 1,
    isSuspended: false,
    joinedAt: '2026-02-15T15:00:00.000Z'
  },
  {
    id: 'usr_rachel_104',
    name: 'Rachel Greene',
    email: 'rachel.g@apextech.io',
    role: 'Employee',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    cardCount: 1,
    isSuspended: false,
    joinedAt: '2026-03-01T09:30:00.000Z'
  }
];

const INITIAL_INVITATIONS: InvitationData[] = [
  {
    id: 'inv_101',
    email: 'david.miller@apextech.io',
    role: 'Employee',
    token: 'inv_tok_david_99182',
    status: 'pending',
    expiresAt: '2026-10-16T23:59:59.000Z',
    createdAt: '2026-10-09T10:00:00.000Z',
    invitedByName: 'Smriti Jha'
  },
  {
    id: 'inv_102',
    email: 'aisha.khan@apextech.io',
    role: 'Manager',
    token: 'inv_tok_aisha_44211',
    status: 'pending',
    expiresAt: '2026-10-15T23:59:59.000Z',
    createdAt: '2026-10-08T14:30:00.000Z',
    invitedByName: 'Smriti Jha'
  }
];

const INITIAL_AUDIT_LOGS: AuditLogData[] = [
  {
    id: 'log_1',
    actorId: 'usr_demo_101',
    actorEmail: 'smriti@smartcard.app',
    actorName: 'Smriti Jha',
    action: 'DOMAIN_VERIFIED',
    entityType: 'domain',
    entityId: 'cards.apextech.io',
    details: { domain: 'cards.apextech.io', status: 'verified' },
    ip: '103.21.14.89',
    timestamp: '2026-10-09T18:00:00.000Z'
  },
  {
    id: 'log_2',
    actorId: 'usr_demo_101',
    actorEmail: 'smriti@smartcard.app',
    actorName: 'Smriti Jha',
    action: 'INVITATION_SENT',
    entityType: 'user',
    entityId: 'david.miller@apextech.io',
    details: { email: 'david.miller@apextech.io', role: 'Employee' },
    ip: '103.21.14.89',
    timestamp: '2026-10-09T10:00:00.000Z'
  },
  {
    id: 'log_3',
    actorId: 'usr_demo_101',
    actorEmail: 'smriti@smartcard.app',
    actorName: 'Smriti Jha',
    action: 'BRANDING_UPDATED',
    entityType: 'branding',
    details: { primaryColor: '#2563EB', badgeText: 'Apex Verified Member' },
    ip: '103.21.14.89',
    timestamp: '2026-10-07T11:20:00.000Z'
  },
  {
    id: 'log_4',
    actorId: 'usr_demo_101',
    actorEmail: 'smriti@smartcard.app',
    actorName: 'Smriti Jha',
    action: 'ROLE_UPDATED',
    entityType: 'user',
    entityId: 'usr_devon_103',
    details: { targetEmail: 'devon@apextech.io', previousRole: 'Employee', newRole: 'Manager' },
    ip: '103.21.14.89',
    timestamp: '2026-10-05T09:15:00.000Z'
  }
];

const INITIAL_SUPPORT_TICKETS: SupportTicketData[] = [
  {
    id: 'tkt_101',
    ticketNumber: 'SC-TKT-782190',
    userId: 'usr_demo_101',
    userName: 'Smriti Jha',
    userEmail: 'smriti@smartcard.app',
    companyId: 'org_apex_101',
    subject: 'Assistance with custom domain TLS certificate provisioning',
    category: 'domain',
    priority: 'high',
    status: 'in_progress',
    messages: [
      {
        id: 'msg_1',
        senderId: 'usr_demo_101',
        senderName: 'Smriti Jha',
        senderRole: 'Owner',
        message: 'We added the TXT verification record and CNAME to cards.apextech.io. Could you confirm automated SSL certificate generation?',
        createdAt: '2026-10-09T11:00:00.000Z'
      },
      {
        id: 'msg_2',
        senderId: 'sys_support_agent',
        senderName: 'SmartCard Support Engineer',
        senderRole: 'Support Team',
        message: 'Hello Smriti, our automated DNS verification worker has confirmed your TXT record. The Let’s Encrypt edge certificate is currently propagating across Cloudflare edges.',
        createdAt: '2026-10-09T11:30:00.000Z'
      }
    ],
    createdAt: '2026-10-09T11:00:00.000Z',
    updatedAt: '2026-10-09T11:30:00.000Z'
  }
];

const INITIAL_NOTIFICATIONS: NotificationData[] = [
  {
    id: 'notif_1',
    title: 'New Lead Captured!',
    message: 'Marcus Brody from Andreessen Capital exchanged contact info via your card.',
    type: 'lead',
    time: '12m ago',
    unread: true
  },
  {
    id: 'notif_2',
    title: 'Custom Domain Verified',
    message: 'cards.apextech.io was successfully verified on DNS servers.',
    type: 'milestone',
    time: '1h ago',
    unread: true
  },
  {
    id: 'notif_3',
    title: 'Team Invite Accepted',
    message: 'Devon Vance joined your Apex Technologies organization workspace.',
    type: 'team',
    time: '2d ago',
    unread: false
  }
];

// In-Memory store singletons
let mockUser = { ...INITIAL_USER };
let mockCards = [...INITIAL_CARDS];
let mockLeads = [...INITIAL_LEADS];
let mockCompany = { ...INITIAL_COMPANY };
let mockTeamMembers = [...INITIAL_TEAM_MEMBERS];
let mockInvitations = [...INITIAL_INVITATIONS];
let mockAuditLogs = [...INITIAL_AUDIT_LOGS];
let mockSupportTickets = [...INITIAL_SUPPORT_TICKETS];
let mockNotifications = [...INITIAL_NOTIFICATIONS];

export const mockStore = {
  getUser: () => {
    const plan = mockUser.subscriptionPlan || 'starter';
    const planConfig = PLAN_CONFIGS[plan];
    return {
      ...mockUser,
      planConfig
    };
  },
  
  updateUser: (updates: Partial<typeof mockUser>) => {
    mockUser = { ...mockUser, ...updates };
    return mockStore.getUser();
  },

  setPlan: (plan: SubscriptionPlanTier) => {
    mockUser.subscriptionPlan = plan;
    return mockStore.getUser();
  },

  getCards: () => [...mockCards],

  getCardById: (id: string) => {
    if (!id) return null;
    const clean = id.toLowerCase().trim();
    return mockCards.find(c => 
      c._id === id || 
      c.id === id || 
      c.username?.toLowerCase() === clean ||
      (clean === 'smriti' && (c.username === 'smriti' || c._id === 'smriti-default-card')) ||
      (clean === 'demo' && (c.username === 'smriti' || c._id === 'smriti-default-card'))
    ) || null;
  },

  createCard: (data: Partial<SmartCardData>) => {
    const plan = mockUser.subscriptionPlan || 'starter';
    const planConfig = PLAN_CONFIGS[plan];
    const userCards = mockCards.filter(c => c.userId === mockUser.id || !c.userId);

    if (userCards.length >= planConfig.limits.maxActiveCards) {
      if (plan === 'starter') {
        throw new Error(`Starter plan is limited to ${planConfig.limits.maxActiveCards} active card. Please upgrade to Professional (₹199/mo) to create more cards.`);
      } else {
        throw new Error(`Your ${planConfig.name} plan limit of ${planConfig.limits.maxActiveCards} cards has been reached.`);
      }
    }

    const newId = `card_${Date.now()}`;
    const baseUsername = (data.username || data.name || 'user')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9_-]/g, '') || 'card';
    
    let username = baseUsername;
    let counter = 1;
    while (mockCards.some(c => c.username === username)) {
      counter += 1;
      username = `${baseUsername}-${counter}`;
    }

    const newCard: SmartCardData = {
      _id: newId,
      id: newId,
      userId: mockUser.id,
      companyId: mockCompany.id,
      username,
      name: data.name || 'New Profile',
      title: data.title || data.role || 'Professional',
      role: data.role || data.title || 'Professional',
      company: data.company || mockCompany.name || 'SmartCard User',
      email: data.email || mockUser.email,
      phone: data.phone || '+1 555 000 0000',
      website: data.website || 'https://smartcard.app',
      location: data.location || '',
      themeColor: data.themeColor || '#2563EB',
      template: data.template || 'modern',
      cardTheme: data.cardTheme || 'minimal-modern',
      cardLayout: data.cardLayout || 'vertical',
      customBadge: data.customBadge,
      leadCaptureEnabled: data.leadCaptureEnabled !== undefined ? data.leadCaptureEnabled : true,
      isSuspended: false,
      isPublic: data.isPublic !== undefined ? data.isPublic : true,
      profileImage: data.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
      employeeCode: data.employeeCode || `SMART-${Math.floor(100 + Math.random() * 900)}`,
      bio: data.bio || '',
      socialLinks: {
        github: data.github || data.socialLinks?.github,
        linkedin: data.linkedin || data.socialLinks?.linkedin,
        instagram: data.instagram || data.socialLinks?.instagram,
        twitter: data.twitter || data.socialLinks?.twitter || data.socialLinks?.x,
        x: data.twitter || data.socialLinks?.twitter || data.socialLinks?.x,
        ...(data.socialLinks || {})
      },
      github: data.github || data.socialLinks?.github,
      linkedin: data.linkedin || data.socialLinks?.linkedin,
      instagram: data.instagram || data.socialLinks?.instagram,
      twitter: data.twitter || data.socialLinks?.twitter || data.socialLinks?.x,
      appearance: {
        theme: data.cardTheme || 'minimal-modern',
        accentColor: data.themeColor || '#2563EB',
        font: 'sans',
        layout: data.cardLayout || 'vertical',
        ...(data.appearance || {})
      },
      projects: data.projects || [],
      speakingEvents: data.speakingEvents || [],
      testimonials: data.testimonials || [],
      calendarUrl: data.calendarUrl || '',
      resumeUrl: data.resumeUrl || '',
      totalViews: 1,
      totalShares: 0,
      uniqueViews: 1,
      views: 1,
      scans: 0,
      leadsCount: 0,
      qrCodeUrl: `https://smartcard.app/${username}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockCards.unshift(newCard);
    return newCard;
  },

  updateCard: (id: string, updates: Partial<SmartCardData>) => {
    const index = mockCards.findIndex(c => 
      c._id === id || 
      c.id === id || 
      c.username?.toLowerCase() === id.toLowerCase()
    );
    if (index === -1) {
      return null;
    }

    let updatedUsername = mockCards[index].username;
    if (updates.username && updates.username.toLowerCase() !== updatedUsername) {
      const base = updates.username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
      let candidate = base;
      let counter = 1;
      while (mockCards.some((c, idx) => idx !== index && c.username === candidate)) {
        counter += 1;
        candidate = `${base}-${counter}`;
      }
      updatedUsername = candidate;
    }

    mockCards[index] = { 
      ...mockCards[index], 
      ...updates,
      username: updatedUsername,
      qrCodeUrl: `https://smartcard.app/${updatedUsername}`,
      updatedAt: new Date().toISOString()
    };
    return mockCards[index];
  },

  deleteCard: (id: string) => {
    mockCards = mockCards.filter(c => c._id !== id && c.id !== id);
    return true;
  },

  getLeads: (options?: { status?: string; search?: string; cardId?: string }) => {
    let filtered = [...mockLeads];
    if (options?.status && options.status !== 'All') {
      filtered = filtered.filter(l => l.status === options.status);
    }
    if (options?.cardId && options.cardId !== 'All') {
      filtered = filtered.filter(l => l.cardId === options.cardId);
    }
    if (options?.search && options.search.trim()) {
      const term = options.search.toLowerCase().trim();
      filtered = filtered.filter(l => 
        l.name.toLowerCase().includes(term) ||
        (l.email && l.email.toLowerCase().includes(term)) ||
        (l.company && l.company.toLowerCase().includes(term)) ||
        (l.eventTag && l.eventTag.toLowerCase().includes(term))
      );
    }
    return filtered;
  },

  addLead: (lead: Partial<LeadData>) => {
    const newLead: LeadData = {
      _id: `lead_${Date.now()}`,
      id: `lead_${Date.now()}`,
      userId: mockUser.id,
      companyId: mockCompany.id,
      name: lead.name || 'Anonymous Contact',
      email: lead.email || '',
      phone: lead.phone || '',
      company: lead.company || 'Independent',
      role: lead.role || 'Contact',
      notes: lead.notes || '',
      cardId: lead.cardId || 'smriti-default-card',
      cardName: lead.cardName || 'Smriti Jha',
      eventTag: lead.eventTag || 'Direct Connect',
      score: lead.score || Math.floor(75 + Math.random() * 24),
      status: (lead.status as LeadStatus) || 'New',
      source: lead.source || 'public_card',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockLeads.unshift(newLead);
    
    mockNotifications.unshift({
      id: `notif_${Date.now()}`,
      title: 'New Lead Captured!',
      message: `${newLead.name} (${newLead.company || 'Contact'}) submitted their details.`,
      type: 'lead',
      time: 'Just now',
      unread: true
    });

    return newLead;
  },

  updateLeadStatus: (id: string, status: LeadStatus) => {
    const lead = mockLeads.find(l => l.id === id || l._id === id);
    if (lead) {
      lead.status = status;
      lead.updatedAt = new Date().toISOString();
      return lead;
    }
    return null;
  },

  updateLead: (id: string, updates: Partial<LeadData>) => {
    const index = mockLeads.findIndex(l => l.id === id || l._id === id);
    if (index !== -1) {
      mockLeads[index] = { ...mockLeads[index], ...updates, updatedAt: new Date().toISOString() };
      return mockLeads[index];
    }
    return null;
  },

  deleteLead: (id: string) => {
    mockLeads = mockLeads.filter(l => l.id !== id && (l as any)._id !== id);
    return true;
  },

  // Company / Organization methods
  getCompany: () => ({
    ...mockCompany,
    memberCount: mockTeamMembers.length,
    cardCount: mockCards.length
  }),

  updateCompany: (updates: Partial<CompanyData>) => {
    mockCompany = { ...mockCompany, ...updates, updatedAt: new Date().toISOString() };
    return mockStore.getCompany();
  },

  updateBranding: (branding: Partial<CompanyData['branding']>) => {
    mockCompany.branding = { ...mockCompany.branding, ...branding };
    mockStore.addAuditLog('BRANDING_UPDATED', 'branding', branding);
    return mockStore.getCompany();
  },

  getTeamMembers: () => [...mockTeamMembers],

  updateMemberRole: (memberId: string, role: UserRole) => {
    const member = mockTeamMembers.find(m => m.id === memberId);
    if (member) {
      const prev = member.role;
      member.role = role;
      mockStore.addAuditLog('ROLE_UPDATED', 'user', { targetEmail: member.email, previousRole: prev, newRole: role });
      return member;
    }
    return null;
  },

  removeTeamMember: (memberId: string) => {
    const member = mockTeamMembers.find(m => m.id === memberId);
    if (member) {
      mockTeamMembers = mockTeamMembers.filter(m => m.id !== memberId);
      mockStore.addAuditLog('MEMBER_REMOVED', 'user', { targetEmail: member.email });
      return true;
    }
    return false;
  },

  getInvitations: () => [...mockInvitations],

  sendInvitation: (email: string, role: UserRole) => {
    const totalSeats = mockTeamMembers.length + mockInvitations.filter(i => i.status === 'pending').length;
    if (totalSeats >= mockCompany.memberLimit) {
      throw new Error(`Team member limit reached (${mockCompany.memberLimit} seats). Upgrade your limit to add more members.`);
    }

    const newInvite: InvitationData = {
      id: `inv_${Date.now()}`,
      email: email.toLowerCase().trim(),
      role: role || 'Employee',
      token: `inv_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      invitedByName: mockUser.name
    };
    mockInvitations.unshift(newInvite);
    mockStore.addAuditLog('INVITATION_SENT', 'user', { email, role });
    return newInvite;
  },

  revokeInvitation: (id: string) => {
    mockInvitations = mockInvitations.map(i => i.id === id ? { ...i, status: 'revoked' } : i);
    mockStore.addAuditLog('INVITATION_REVOKED', 'user', { invitationId: id });
    return true;
  },

  setCardSuspension: (cardId: string, isSuspended: boolean) => {
    const card = mockCards.find(c => c._id === cardId || c.id === cardId);
    if (card) {
      card.isSuspended = isSuspended;
      mockStore.addAuditLog(isSuspended ? 'CARD_SUSPENDED' : 'CARD_ACTIVATED', 'card', { cardName: card.name, username: card.username });
      return card;
    }
    return null;
  },

  configureDomain: (domain: string) => {
    const token = `sc_vtok_${Math.random().toString(36).substring(2, 12)}`;
    const domainData: CustomDomainData = {
      domain: domain.toLowerCase().trim(),
      verificationToken: token,
      status: 'pending',
      dnsType: 'TXT',
      targetRecord: `smartcard-site-verification=${token}`,
      routingTarget: 'cname.smartcard.app',
      lastCheckedAt: new Date().toISOString()
    };
    mockCompany.customDomain = domainData;
    mockCompany.domain = domainData.domain;
    mockStore.addAuditLog('DOMAIN_CONFIGURED', 'domain', { domain: domainData.domain });
    return domainData;
  },

  verifyDomain: () => {
    if (!mockCompany.customDomain) {
      throw new Error('No custom domain configured');
    }
    // Simulate real verification check
    mockCompany.customDomain.status = 'verified';
    mockCompany.customDomain.verifiedAt = new Date().toISOString();
    mockCompany.customDomain.lastCheckedAt = new Date().toISOString();
    mockCompany.customDomain.verificationError = undefined;
    mockStore.addAuditLog('DOMAIN_VERIFIED', 'domain', { domain: mockCompany.customDomain.domain, status: 'verified' });
    return mockCompany.customDomain;
  },

  removeDomain: () => {
    const domain = mockCompany.customDomain?.domain;
    mockCompany.customDomain = undefined;
    mockCompany.domain = undefined;
    mockStore.addAuditLog('DOMAIN_REMOVED', 'domain', { domain });
    return true;
  },

  validateSSO: (ssoData: Partial<SSOConfigData>) => {
    const { provider, clientId, clientSecret, issuerUrl, metadataUrl } = ssoData;
    if (!provider) return { valid: false, error: 'Provider is required' };
    if (provider === 'google') {
      if (!clientId || !clientId.endsWith('.apps.googleusercontent.com')) {
        return { valid: false, error: 'Google Client ID must end with .apps.googleusercontent.com' };
      }
      if (!clientSecret || clientSecret.length < 8) {
        return { valid: false, error: 'Valid Google Client Secret is required' };
      }
    } else if (provider === 'azure') {
      if (!issuerUrl || !issuerUrl.includes('login.microsoftonline.com')) {
        return { valid: false, error: 'Azure Issuer URL must contain login.microsoftonline.com/<Tenant-ID>' };
      }
      if (!clientId) return { valid: false, error: 'Azure Application ID is required' };
    } else if (provider === 'saml' && !metadataUrl && !issuerUrl) {
      return { valid: false, error: 'SAML IdP Metadata XML URL is required' };
    } else if (provider === 'oidc' && (!issuerUrl || !issuerUrl.startsWith('https://'))) {
      return { valid: false, error: 'OIDC Issuer URL must start with https://' };
    }
    return { valid: true };
  },

  updateSSO: (ssoData: Partial<SSOConfigData>) => {
    const validation = mockStore.validateSSO(ssoData);
    mockCompany.ssoConfig = {
      ...mockCompany.ssoConfig,
      ...ssoData,
      status: validation.valid ? 'active' : 'invalid',
      validationError: validation.error,
      lastValidatedAt: new Date().toISOString()
    };
    mockStore.addAuditLog('SSO_CONFIG_UPDATED', 'sso', { provider: ssoData.provider, status: mockCompany.ssoConfig.status });
    return mockCompany.ssoConfig;
  },

  getAuditLogs: () => [...mockAuditLogs],

  addAuditLog: (action: string, entityType: string, details?: Record<string, any>) => {
    const newLog: AuditLogData = {
      id: `log_${Date.now()}`,
      actorId: mockUser.id,
      actorEmail: mockUser.email,
      actorName: mockUser.name,
      action,
      entityType,
      details,
      ip: '103.21.14.89',
      timestamp: new Date().toISOString()
    };
    mockAuditLogs.unshift(newLog);
    return newLog;
  },

  getSupportTickets: () => [...mockSupportTickets],

  createSupportTicket: (ticket: { subject: string; category: any; priority: any; message: string }) => {
    const newTicket: SupportTicketData = {
      id: `tkt_${Date.now()}`,
      ticketNumber: `SC-TKT-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: mockUser.id,
      userName: mockUser.name,
      userEmail: mockUser.email,
      companyId: mockCompany.id,
      subject: ticket.subject,
      category: ticket.category || 'general',
      priority: ticket.priority || 'medium',
      status: 'open',
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: mockUser.id,
          senderName: mockUser.name,
          senderRole: mockUser.role,
          message: ticket.message,
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockSupportTickets.unshift(newTicket);
    mockStore.addAuditLog('SUPPORT_TICKET_CREATED', 'ticket', { ticketNumber: newTicket.ticketNumber, subject: newTicket.subject });
    return newTicket;
  },

  addSupportMessage: (ticketId: string, message: string) => {
    const ticket = mockSupportTickets.find(t => t.id === ticketId);
    if (ticket) {
      const newMsg: SupportMessageData = {
        id: `msg_${Date.now()}`,
        senderId: mockUser.id,
        senderName: mockUser.name,
        senderRole: mockUser.role,
        message,
        createdAt: new Date().toISOString()
      };
      ticket.messages.push(newMsg);
      if (ticket.status === 'resolved' || ticket.status === 'closed') {
        ticket.status = 'in_progress';
      }
      ticket.updatedAt = new Date().toISOString();
      return ticket;
    }
    return null;
  },

  getAnalytics: (rangeDays = 30) => {
    const totalViews = mockCards.reduce((acc, c) => acc + (c.totalViews || c.views || 0), 0);
    const totalShares = mockCards.reduce((acc, c) => acc + (c.totalShares || 0), 0);
    const totalScans = mockCards.reduce((acc, c) => acc + (c.scans || 0), 0);
    const totalLeads = mockLeads.length;

    const days = rangeDays > 0 ? rangeDays : 7;
    const viewsOverTime = [
      { date: 'Mon', views: Math.floor(totalViews * 0.12), shares: Math.floor(totalShares * 0.14), scans: Math.floor(totalScans * 0.13), leads: 4 },
      { date: 'Tue', views: Math.floor(totalViews * 0.18), shares: Math.floor(totalShares * 0.16), scans: Math.floor(totalScans * 0.17), leads: 7 },
      { date: 'Wed', views: Math.floor(totalViews * 0.22), shares: Math.floor(totalShares * 0.21), scans: Math.floor(totalScans * 0.24), leads: 11 },
      { date: 'Thu', views: Math.floor(totalViews * 0.16), shares: Math.floor(totalShares * 0.15), scans: Math.floor(totalScans * 0.14), leads: 8 },
      { date: 'Fri', views: Math.floor(totalViews * 0.20), shares: Math.floor(totalShares * 0.22), scans: Math.floor(totalScans * 0.21), leads: 12 },
      { date: 'Sat', views: Math.floor(totalViews * 0.06), shares: Math.floor(totalShares * 0.06), scans: Math.floor(totalScans * 0.05), leads: 3 },
      { date: 'Sun', views: Math.floor(totalViews * 0.06), shares: Math.floor(totalShares * 0.06), scans: Math.floor(totalScans * 0.06), leads: 3 }
    ];

    return {
      totalViews,
      totalShares,
      totalScans,
      totalLeads,
      conversionRate: totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) + '%' : '0.0%',
      viewsOverTime,
      topCards: mockCards.map(c => ({
        id: c._id,
        name: c.name,
        role: c.role,
        views: c.totalViews || c.views || 0,
        scans: c.scans || 0,
        shares: c.totalShares || 0,
        leads: c.leadsCount || 0
      })),
      devices: [
        { name: 'iPhone / iOS', percent: 62 },
        { name: 'Android OS', percent: 30 },
        { name: 'Desktop Web', percent: 8 }
      ],
      channels: [
        { name: 'Camera QR Scan', percent: 54 },
        { name: 'WhatsApp Direct', percent: 26 },
        { name: 'LinkedIn Bio Link', percent: 14 },
        { name: 'Email Signature', percent: 6 }
      ]
    };
  },

  trackActivity: (cardId: string, type: 'view' | 'share' | 'qr_scan' | 'click' | 'vcf_download', metadata?: { channel?: string; linkType?: string }) => {
    const card = mockCards.find(c => c._id === cardId || c.id === cardId || c.username === cardId);
    if (card) {
      if (type === 'view') {
        card.totalViews += 1;
        card.uniqueViews += 1;
        card.views = (card.views || 0) + 1;
      } else if (type === 'qr_scan') {
        card.totalViews += 1;
        card.uniqueViews += 1;
        card.views = (card.views || 0) + 1;
        card.scans = (card.scans || 0) + 1;
      } else if (type === 'share') {
        card.totalShares += 1;
      }
      return { success: true, totalViews: card.totalViews, totalShares: card.totalShares, scans: card.scans };
    }
    return { success: true };
  },

  getNotifications: () => [...mockNotifications],

  markAllNotificationsRead: () => {
    mockNotifications = mockNotifications.map(n => ({ ...n, unread: false }));
    return mockNotifications;
  }
};

export default mockStore;
