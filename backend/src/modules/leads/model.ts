import { Schema, model, Document } from 'mongoose';

export interface ILead {
  cardId: Schema.Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  source: string;
  eventTag?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadDocument extends ILead, Document {}

const LeadSchema = new Schema<ILeadDocument>({
  cardId: { type: Schema.Types.ObjectId, ref: 'Card', required: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  source: { type: String, default: 'public_card' },
  eventTag: { type: String, trim: true, index: true }
}, {
  timestamps: true
});

export const LeadModel = model<ILeadDocument>('Lead', LeadSchema);
export default LeadModel;
