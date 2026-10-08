import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  link: z.string().optional()
});

const speakingEventSchema = z.object({
  title: z.string().min(1),
  date: z.string().optional(),
  link: z.string().optional()
});

const testimonialSchema = z.object({
  reviewer: z.string().min(1),
  text: z.string().min(1),
  company: z.string().optional()
});

export const createCardSchema = z.object({
  body: z.object({
    username: z.string().min(2).max(50).regex(/^[a-zA-Z0-9_-]+$/, 'Username must be alphanumeric and may contain hyphens/underscores').optional(),
    name: z.string().min(2).max(100),
    title: z.string().max(100).optional(),
    role: z.string().max(100).optional(),
    company: z.string().max(100).optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    website: z.string().optional(),
    location: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    cardTheme: z.string().optional(),
    cardLayout: z.string().optional(),
    themeColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color').default('#3B82F6'),
    template: z.string().default('modern'),
    profileImage: z.string().optional(),
    employeeCode: z.string().optional(),
    socialLinks: z.object({
      linkedin: z.string().optional(),
      twitter: z.string().optional(),
      x: z.string().optional(),
      instagram: z.string().optional(),
      github: z.string().optional(),
    }).optional(),
    resumeUrl: z.string().optional(),
    calendarUrl: z.string().optional(),
    bio: z.string().optional(),
    projects: z.array(projectSchema).optional(),
    speakingEvents: z.array(speakingEventSchema).optional(),
    testimonials: z.array(testimonialSchema).optional(),
    isPublic: z.boolean().default(true),
  })
});

export const updateCardSchema = z.object({
  body: z.object({
    username: z.string().min(2).max(50).regex(/^[a-zA-Z0-9_-]+$/, 'Username must be alphanumeric and may contain hyphens/underscores').optional(),
    name: z.string().min(2).max(100).optional(),
    title: z.string().max(100).optional(),
    role: z.string().max(100).optional(),
    company: z.string().max(100).optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    website: z.string().optional(),
    location: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    cardTheme: z.string().optional(),
    cardLayout: z.string().optional(),
    themeColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color').optional(),
    template: z.string().optional(),
    profileImage: z.string().optional(),
    employeeCode: z.string().optional(),
    socialLinks: z.object({
      linkedin: z.string().optional(),
      twitter: z.string().optional(),
      x: z.string().optional(),
      instagram: z.string().optional(),
      github: z.string().optional(),
    }).optional(),
    resumeUrl: z.string().optional(),
    calendarUrl: z.string().optional(),
    bio: z.string().optional(),
    projects: z.array(projectSchema).optional(),
    speakingEvents: z.array(speakingEventSchema).optional(),
    testimonials: z.array(testimonialSchema).optional(),
    isPublic: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Card ID or username is required')
  })
});
