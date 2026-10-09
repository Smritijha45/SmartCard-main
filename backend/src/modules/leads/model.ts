import { Schema, model, Document } from 'mongoose';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';

export interface ILead {
  cardId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  companyId?: Schema.Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  notes?: string;
  status: LeadStatus;
  score?: number;
  source: string;
  eventTag?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadDocument extends ILead, Document {}

const LeadSchema = new Schema<ILeadDocument>({
  cardId: { type: Schema.Types.ObjectId, ref: 'Card', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  company: { type: String, trim: true },
  role: { type: String, trim: true },
  notes: { type: String, trim: true },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'],
    default: 'New',
    index: true
  },
  score: { type: Number, default: 75 },
  source: { type: String, default: 'public_card' },
  eventTag: { type: String, trim: true, index: true }
}, {
  timestamps: true
});

LeadSchema.index({ userId: 1, status: 1, createdAt: -1 });
LeadSchema.index({ companyId: 1, status: 1, createdAt: -1 });

export const LeadModel = model<ILeadDocument>('Lead', LeadSchema);
export default LeadModel;
