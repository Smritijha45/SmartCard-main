export interface CardResponseDTO {
  id: string;
  userId: string;
  username: string;
  companyId?: string;
  name: string;
  title?: string;
  role?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  cardTheme?: string;
  cardLayout?: string;
  themeColor: string;
  template: string;
  profileImage?: string;
  employeeCode?: string;
  customBadge?: string;
  leadCaptureEnabled?: boolean;
  isSuspended?: boolean;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    x?: string;
    instagram?: string;
    github?: string;
  };
  resumeUrl?: string;
  calendarUrl?: string;
  bio?: string;
  projects?: Array<{
    title: string;
    description: string;
    link?: string;
  }>;
  speakingEvents?: Array<{
    title: string;
    date?: string;
    link?: string;
  }>;
  testimonials?: Array<{
    reviewer: string;
    text: string;
    company?: string;
  }>;
  qrCodeUrl?: string;
  isPublic: boolean;
  views: number;
  scans: number;
  createdAt: string;
  updatedAt: string;
}

export interface PublicCardDTO {
  id?: string;
  username: string;
  name: string;
  title?: string;
  role?: string;
  company?: string;
  bio?: string;
  profileImage?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  cardTheme?: string;
  cardLayout?: string;
  themeColor?: string;
  template?: string;
  customBadge?: string;
  leadCaptureEnabled?: boolean;
  isSuspended?: boolean;
  isPublic: boolean;
  qrCodeUrl?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    x?: string;
    instagram?: string;
    github?: string;
  };
  resumeUrl?: string;
  calendarUrl?: string;
  projects?: Array<{
    title: string;
    description: string;
    link?: string;
  }>;
  speakingEvents?: Array<{
    title: string;
    date?: string;
    link?: string;
  }>;
  testimonials?: Array<{
    reviewer: string;
    text: string;
    company?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export function toCardResponseDTO(card: any): CardResponseDTO {
  const username = card.username || (card.name ? card.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : card._id.toString());
  const title = card.title || card.role || '';
  const github = card.github || card.socialLinks?.github || '';
  const linkedin = card.linkedin || card.socialLinks?.linkedin || '';
  const instagram = card.instagram || card.socialLinks?.instagram || '';
  const twitter = card.twitter || card.socialLinks?.twitter || card.socialLinks?.x || '';

  return {
    id: card._id ? card._id.toString() : card.id,
    userId: card.userId ? card.userId.toString() : '',
    username,
    companyId: card.companyId ? card.companyId.toString() : undefined,
    name: card.name,
    title,
    role: card.role || card.title,
    company: card.company,
    email: card.email,
    phone: card.phone,
    website: card.website,
    location: card.location,
    github,
    linkedin,
    instagram,
    twitter,
    cardTheme: card.cardTheme || 'minimal-modern',
    cardLayout: card.cardLayout || 'vertical',
    themeColor: card.themeColor || '#3B82F6',
    template: card.template || 'modern',
    profileImage: card.profileImage,
    employeeCode: card.employeeCode,
    customBadge: card.customBadge,
    leadCaptureEnabled: card.leadCaptureEnabled !== undefined ? card.leadCaptureEnabled : true,
    isSuspended: card.isSuspended || false,
    socialLinks: {
      linkedin,
      twitter,
      x: twitter,
      instagram,
      github,
      ...(card.socialLinks || {})
    },
    resumeUrl: card.resumeUrl,
    calendarUrl: card.calendarUrl,
    bio: card.bio,
    projects: card.projects || [],
    speakingEvents: card.speakingEvents || [],
    testimonials: card.testimonials || [],
    qrCodeUrl: card.qrCodeUrl,
    isPublic: card.isPublic !== undefined ? card.isPublic : true,
    views: card.views || 0,
    scans: card.scans || 0,
    createdAt: card.createdAt ? card.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: card.updatedAt ? card.updatedAt.toISOString() : new Date().toISOString(),
  };
}

export function toPublicCardDTO(card: any): PublicCardDTO {
  const username = card.username || (card.name ? card.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : card._id.toString());
  const title = card.title || card.role || '';
  const github = card.github || card.socialLinks?.github || '';
  const linkedin = card.linkedin || card.socialLinks?.linkedin || '';
  const instagram = card.instagram || card.socialLinks?.instagram || '';
  const twitter = card.twitter || card.socialLinks?.twitter || card.socialLinks?.x || '';

  return {
    id: card._id ? card._id.toString() : card.id,
    username,
    name: card.name,
    title,
    role: card.role || card.title,
    company: card.company,
    bio: card.bio,
    profileImage: card.profileImage,
    email: card.email,
    phone: card.phone,
    website: card.website,
    location: card.location,
    github,
    linkedin,
    instagram,
    twitter,
    cardTheme: card.cardTheme || 'minimal-modern',
    cardLayout: card.cardLayout || 'vertical',
    themeColor: card.themeColor || '#3B82F6',
    template: card.template || 'modern',
    customBadge: card.customBadge,
    leadCaptureEnabled: card.leadCaptureEnabled !== undefined ? card.leadCaptureEnabled : true,
    isSuspended: card.isSuspended || false,
    isPublic: card.isPublic !== undefined ? card.isPublic : true,
    qrCodeUrl: card.qrCodeUrl,
    socialLinks: {
      linkedin,
      twitter,
      x: twitter,
      instagram,
      github,
      ...(card.socialLinks || {})
    },
    resumeUrl: card.resumeUrl,
    calendarUrl: card.calendarUrl,
    projects: card.projects || [],
    speakingEvents: card.speakingEvents || [],
    testimonials: card.testimonials || [],
    createdAt: card.createdAt ? card.createdAt.toISOString() : undefined,
    updatedAt: card.updatedAt ? card.updatedAt.toISOString() : undefined,
  };
}
