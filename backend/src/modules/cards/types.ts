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
  isPublic: boolean;
  qrCodeUrl?: string;
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
    profileImage: card.profileImage || card.profile_image || '',
    employeeCode: card.employeeCode,
    socialLinks: {
      linkedin,
      twitter,
      x: twitter,
      instagram,
      github,
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
    createdAt: card.createdAt ? (typeof card.createdAt === 'string' ? card.createdAt : card.createdAt.toISOString()) : new Date().toISOString(),
    updatedAt: card.updatedAt ? (typeof card.updatedAt === 'string' ? card.updatedAt : card.updatedAt.toISOString()) : new Date().toISOString(),
  };
}

export function toPublicCardDTO(card: any): PublicCardDTO {
  const full = toCardResponseDTO(card);
  return {
    username: full.username,
    name: full.name,
    title: full.title || full.role,
    role: full.role || full.title,
    company: full.company,
    bio: full.bio,
    profileImage: full.profileImage,
    email: full.email,
    phone: full.phone,
    website: full.website,
    location: full.location,
    github: full.github,
    linkedin: full.linkedin,
    instagram: full.instagram,
    twitter: full.twitter,
    cardTheme: full.cardTheme,
    cardLayout: full.cardLayout,
    themeColor: full.themeColor,
    template: full.template,
    isPublic: full.isPublic,
    qrCodeUrl: full.qrCodeUrl,
    createdAt: full.createdAt,
    updatedAt: full.updatedAt,
  };
}
