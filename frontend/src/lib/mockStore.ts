// SmartCard Mock Data & Local In-Memory Store
// Provides seamless dummy/local state for frontend standalone operation

export interface SmartCardData {
  _id: string;
  id: string;
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
  projects?: Array<{ title: string; description: string; link: string }>;
  testimonials?: Array<{ quote: string; author: string; role: string }>;
  totalViews: number;
  totalShares: number;
  uniqueViews: number;
  leadsCount: number;
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LeadData {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  notes?: string;
  cardId: string;
  cardName: string;
  eventTag?: string;
  score: number;
  status: 'Hot Lead' | 'In Discussion' | 'Follow Up' | 'Connected';
  createdAt: string;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'lead' | 'view' | 'share' | 'milestone';
  time: string;
  unread: boolean;
}

const INITIAL_USER = {
  id: 'usr_demo_101',
  name: 'Smriti Jha',
  email: 'smriti@smartcard.app',
  role: 'Full Stack Developer',
  company: 'SmartCard Technologies',
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
    username: 'smriti',
    name: 'Smriti Jha',
    title: 'Full Stack Developer',
    role: 'Full Stack Developer',
    company: 'SmartCard Technologies',
    bio: 'Building modern digital experiences.',
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
    totalViews: 320,
    totalShares: 85,
    uniqueViews: 240,
    leadsCount: 18,
    qrCodeUrl: 'https://smartcard.app/smriti',
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z'
  },
  {
    _id: 'card_alex',
    id: 'card_alex',
    username: 'alex-morgan',
    name: 'Alex Morgan',
    title: 'Founder & Head of Product',
    role: 'Founder & Head of Product',
    company: 'SmartCard Technologies',
    email: 'alex@smartcard.id',
    phone: '+1 415 555 0192',
    website: 'https://smartcard.id',
    location: 'San Francisco, CA',
    themeColor: '#2563EB',
    template: 'modern',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    employeeCode: 'SMART-001',
    bio: 'Building the next evolution of professional digital identity. No NFC cards, no paper waste — 100% web & instant QR networking.',
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
        quote: 'SmartCard helped our sales team generate 3x more qualified follow-ups at conferences than paper business cards ever did.',
        author: 'Sarah Lin',
        role: 'VP Sales @ Horizon Cloud'
      }
    ],
    totalViews: 1420,
    totalShares: 384,
    uniqueViews: 980,
    leadsCount: 48,
    qrCodeUrl: 'https://smartcard.app/alex-morgan',
    createdAt: '2026-01-20T10:00:00.000Z'
  },
  {
    _id: 'card_sarah',
    id: 'card_sarah',
    username: 'sarah-chen',
    name: 'Sarah Chen',
    role: 'VP of Strategic Partnerships',
    company: 'Apex Ventures',
    email: 'sarah.chen@apex.vc',
    phone: '+1 650 555 0831',
    website: 'https://apex.vc',
    themeColor: '#06B6D4',
    template: 'modern',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    employeeCode: 'APEX-772',
    bio: 'Investing in seed to Series A B2B software, developer tooling, and modern SaaS. Always looking for exceptional founders.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahchen',
      twitter: 'https://twitter.com/sarahchen_vc'
    },
    calendarUrl: 'https://cal.com/sarah-apex',
    projects: [
      {
        title: 'Apex Seed Fund III',
        description: '$120M fund dedicated to early-stage SaaS and cloud infrastructure startups.',
        link: 'https://apex.vc'
      }
    ],
    testimonials: [
      {
        quote: 'Sarah is the most founder-friendly partner we could have asked for on our cap table.',
        author: 'Marcus Vance',
        role: 'CEO @ Kinetic AI'
      }
    ],
    totalViews: 890,
    totalShares: 215,
    uniqueViews: 640,
    leadsCount: 29,
    qrCodeUrl: 'https://smartcard.app/sarah-chen',
    createdAt: '2026-02-01T12:00:00.000Z'
  },
  {
    _id: 'card_devon',
    id: 'card_devon',
    username: 'devon-vance',
    name: 'Devon Vance',
    role: 'Principal Design Architect',
    company: 'Studio Neon',
    email: 'devon@studioneon.design',
    phone: '+44 20 7946 0912',
    website: 'https://studioneon.design',
    themeColor: '#F59E0B',
    template: 'creative',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    employeeCode: 'NEON-104',
    bio: 'Crafting neo-brutalist digital design systems, bold brand identities, and memorable web interactions for startups.',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    projects: [
      {
        title: 'Neo-Brutalist Design Tokens',
        description: 'An open-source token collection for high-contrast, tactile UI interfaces.',
        link: 'https://studioneon.design'
      }
    ],
    totalViews: 540,
    totalShares: 132,
    uniqueViews: 410,
    leadsCount: 19,
    qrCodeUrl: 'https://smartcard.app/devon-vance',
    createdAt: '2026-02-15T15:00:00.000Z'
  }
];

const INITIAL_LEADS: LeadData[] = [
  {
    _id: 'lead_1',
    id: 'lead_1',
    name: 'Marcus Brody',
    email: 'marcus@andreessen.com',
    phone: '+1 415 889 1234',
    company: 'Andreessen Capital',
    role: 'Design Partner',
    notes: 'Met at SaaS Global Summit. Discussed rolling out SmartCard to 200 portfolio executives.',
    cardId: 'card_alex',
    cardName: 'Alex Morgan',
    eventTag: 'SaaS Global Summit 2026',
    score: 95,
    status: 'Hot Lead',
    createdAt: '2026-10-05T14:20:00Z'
  },
  {
    _id: 'lead_2',
    id: 'lead_2',
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
    status: 'In Discussion',
    createdAt: '2026-10-04T18:10:00Z'
  },
  {
    _id: 'lead_3',
    id: 'lead_3',
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
    status: 'Follow Up',
    createdAt: '2026-10-02T11:45:00Z'
  },
  {
    _id: 'lead_4',
    id: 'lead_4',
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
    status: 'Connected',
    createdAt: '2026-09-28T09:30:00Z'
  }
];

const INITIAL_NOTIFICATIONS: NotificationData[] = [
  {
    id: 'notif_1',
    title: 'New Lead Captured!',
    message: 'Marcus Brody from Andreessen Capital just exchanged contact details via your card.',
    type: 'lead',
    time: '12m ago',
    unread: true
  },
  {
    id: 'notif_2',
    title: 'Card Milestone: 1,000 Views',
    message: 'Your Alex Morgan digital card crossed 1,000 unique visitors!',
    type: 'milestone',
    time: '2h ago',
    unread: true
  },
  {
    id: 'notif_3',
    title: 'WhatsApp Contact Shared',
    message: 'Someone in San Francisco shared your digital card link via WhatsApp.',
    type: 'share',
    time: '5h ago',
    unread: false
  },
  {
    id: 'notif_4',
    title: 'QR Code Downloaded',
    message: 'Your high-resolution vector QR code was downloaded for print collateral.',
    type: 'view',
    time: '1d ago',
    unread: false
  }
];

// In-Memory store singletons
let mockUser = { ...INITIAL_USER };
let mockCards = [...INITIAL_CARDS];
let mockLeads = [...INITIAL_LEADS];
let mockNotifications = [...INITIAL_NOTIFICATIONS];

export const mockStore = {
  getUser: () => mockUser,
  
  updateUser: (updates: Partial<typeof mockUser>) => {
    mockUser = { ...mockUser, ...updates };
    return mockUser;
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
      username,
      name: data.name || 'New Profile',
      title: data.title || data.role || 'Professional',
      role: data.role || data.title || 'Professional',
      company: data.company || 'SmartCard User',
      email: data.email || 'user@example.com',
      phone: data.phone || '+1 555 000 0000',
      website: data.website || 'https://smartcard.app',
      location: data.location || '',
      themeColor: data.themeColor || '#2563EB',
      template: data.template || 'modern',
      cardTheme: data.cardTheme || 'minimal-modern',
      cardLayout: data.cardLayout || 'vertical',
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
      testimonials: data.testimonials || [],
      calendarUrl: data.calendarUrl || '',
      resumeUrl: data.resumeUrl || '',
      totalViews: 1,
      totalShares: 0,
      uniqueViews: 1,
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
      // If not found, create or update fallback
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

  getLeads: () => [...mockLeads],

  addLead: (lead: Partial<LeadData>) => {
    const newLead: LeadData = {
      _id: `lead_${Date.now()}`,
      id: `lead_${Date.now()}`,
      name: lead.name || 'Anonymous Contact',
      email: lead.email || '',
      phone: lead.phone || '',
      company: lead.company || 'Independent',
      role: lead.role || 'Contact',
      notes: lead.notes || '',
      cardId: lead.cardId || 'card_alex',
      cardName: lead.cardName || 'Alex Morgan',
      eventTag: lead.eventTag || 'Direct Connect',
      score: lead.score || Math.floor(75 + Math.random() * 24),
      status: 'Hot Lead',
      createdAt: new Date().toISOString()
    };
    mockLeads.unshift(newLead);
    
    // Also trigger notification
    mockNotifications.unshift({
      id: `notif_${Date.now()}`,
      title: 'New Lead Captured!',
      message: `${newLead.name} (${newLead.company}) shared contact info with you.`,
      type: 'lead',
      time: 'Just now',
      unread: true
    });

    return newLead;
  },

  getAnalytics: () => {
    const totalViews = mockCards.reduce((acc, c) => acc + (c.totalViews || 0), 0);
    const totalShares = mockCards.reduce((acc, c) => acc + (c.totalShares || 0), 0);
    const totalLeads = mockLeads.length;

    return {
      totalViews,
      totalShares,
      totalLeads,
      conversionRate: '12.4%',
      viewsOverTime: [
        { date: 'Mon', views: 240, shares: 55, leads: 9 },
        { date: 'Tue', views: 320, shares: 78, leads: 14 },
        { date: 'Wed', views: 440, shares: 112, leads: 21 },
        { date: 'Thu', views: 395, shares: 89, leads: 15 },
        { date: 'Fri', views: 560, shares: 148, leads: 26 },
        { date: 'Sat', views: 290, shares: 62, leads: 8 },
        { date: 'Sun', views: 380, shares: 92, leads: 13 }
      ],
      topCards: mockCards.map(c => ({
        id: c._id,
        name: c.name,
        role: c.role,
        views: c.totalViews,
        shares: c.totalShares,
        leads: c.leadsCount || 0
      })),
      devices: [
        { name: 'iPhone / iOS', percent: 64 },
        { name: 'Android', percent: 28 },
        { name: 'Desktop Web', percent: 8 }
      ],
      channels: [
        { name: 'Camera QR Scan', percent: 56 },
        { name: 'WhatsApp Direct', percent: 24 },
        { name: 'LinkedIn Bio Link', percent: 14 },
        { name: 'Email Signature', percent: 6 }
      ]
    };
  },

  trackActivity: (cardId: string, type: 'view' | 'share' | 'qr_scan' | 'click' | 'vcf_download', meta?: any) => {
    const card = mockCards.find(c => c._id === cardId || c.id === cardId || c.username === cardId);
    if (card) {
      if (type === 'view' || type === 'qr_scan') {
        card.totalViews += 1;
        card.uniqueViews += 1;
      } else if (type === 'share') {
        card.totalShares += 1;
      }
      return { success: true, totalViews: card.totalViews, totalShares: card.totalShares };
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
