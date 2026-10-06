import { Schema, model, Document } from 'mongoose';

export interface ICardSocialLinks {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

export interface ICardProject {
  title: string;
  description: string;
  link?: string;
}

export interface ICardSpeakingEvent {
  title: string;
  date?: string;
  link?: string;
}

export interface ICardTestimonial {
  reviewer: string;
  text: string;
  company?: string;
}

export interface ICard {
  userId: Schema.Types.ObjectId;
  companyId?: Schema.Types.ObjectId;
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
  socialLinks: ICardSocialLinks;
  resumeUrl?: string;
  calendarUrl?: string;
  bio?: string;
  projects?: ICardProject[];
  speakingEvents?: ICardSpeakingEvent[];
  testimonials?: ICardTestimonial[];
  qrCodeUrl?: string;
  isPublic: boolean;
  views: number;
  scans: number;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICardDocument extends ICard, Document {}

const CardProjectSchema = new Schema<ICardProject>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  link: { type: String, trim: true }
}, { _id: false });

const CardSpeakingEventSchema = new Schema<ICardSpeakingEvent>({
  title: { type: String, required: true, trim: true },
  date: { type: String, trim: true },
  link: { type: String, trim: true }
}, { _id: false });

const CardTestimonialSchema = new Schema<ICardTestimonial>({
  reviewer: { type: String, required: true, trim: true },
  text: { type: String, required: true, trim: true },
  company: { type: String, trim: true }
}, { _id: false });

const CardSchema = new Schema<ICardDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', index: true },
  name: { type: String, required: true, trim: true },
  role: { type: String, trim: true },
  company: { type: String, trim: true },
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  website: { type: String, trim: true },
  themeColor: { type: String, default: '#3B82F6' },
  template: { type: String, default: 'modern' },
  profileImage: { type: String },
  employeeCode: { type: String, trim: true },
  socialLinks: {
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    instagram: { type: String, trim: true }
  },
  resumeUrl: { type: String, trim: true },
  calendarUrl: { type: String, trim: true },
  bio: { type: String, trim: true },
  projects: [CardProjectSchema],
  speakingEvents: [CardSpeakingEventSchema],
  testimonials: [CardTestimonialSchema],
  qrCodeUrl: { type: String },
  isPublic: { type: Boolean, default: true, index: true },
  views: { type: Number, default: 0 },
  scans: { type: Number, default: 0 },
  deletedAt: { type: Date, default: null, index: true }
}, {
  timestamps: true
});

export const CardModel = model<ICardDocument>('Card', CardSchema);
export default CardModel;
