export interface CardResponseDTO {
  id: string;
  userId: string;
  companyId?: string;
  name: string;
  role?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  themeColor: string;
  template: string;
  profileImage?: string;
  employeeCode?: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
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

export function toCardResponseDTO(card: any): CardResponseDTO {
  return {
    id: card._id.toString(),
    userId: card.userId.toString(),
    companyId: card.companyId ? card.companyId.toString() : undefined,
    name: card.name,
    role: card.role,
    company: card.company,
    email: card.email,
    phone: card.phone,
    website: card.website,
    themeColor: card.themeColor,
    template: card.template,
    profileImage: card.profileImage,
    employeeCode: card.employeeCode,
    socialLinks: {
      linkedin: card.socialLinks?.linkedin,
      twitter: card.socialLinks?.twitter,
      instagram: card.socialLinks?.instagram,
    },
    resumeUrl: card.resumeUrl,
    calendarUrl: card.calendarUrl,
    bio: card.bio,
    projects: card.projects || [],
    speakingEvents: card.speakingEvents || [],
    testimonials: card.testimonials || [],
    qrCodeUrl: card.qrCodeUrl,
    isPublic: card.isPublic,
    views: card.views,
    scans: card.scans,
    createdAt: card.createdAt.toISOString(),
    updatedAt: card.updatedAt.toISOString(),
  };
}
