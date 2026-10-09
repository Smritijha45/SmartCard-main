import { Schema, model, Document } from 'mongoose';

export interface ISupportMessage {
  senderId: Schema.Types.ObjectId;
  senderName: string;
  senderRole: string;
  message: string;
  createdAt: Date;
}

export interface ISupportTicket {
  companyId?: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  userEmail: string;
  userName: string;
  ticketNumber: string;
  subject: string;
  category: 'technical' | 'billing' | 'sso' | 'domain' | 'feature_request' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messages: ISupportMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISupportTicketDocument extends ISupportTicket, Document {}

const SupportMessageSchema = new Schema<ISupportMessage>({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, default: 'Member' },
  message: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const SupportTicketSchema = new Schema<ISupportTicketDocument>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  userEmail: { type: String, required: true, lowercase: true, trim: true },
  userName: { type: String, required: true },
  ticketNumber: { type: String, required: true, unique: true, index: true },
  subject: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['technical', 'billing', 'sso', 'domain', 'feature_request', 'general'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open',
    index: true
  },
  messages: [SupportMessageSchema]
}, {
  timestamps: true
});

SupportTicketSchema.index({ companyId: 1, createdAt: -1 });

export const SupportTicketModel = model<ISupportTicketDocument>('SupportTicket', SupportTicketSchema);
export default SupportTicketModel;
