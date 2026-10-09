import { Schema, model, Document } from 'mongoose';

export interface IAuditLog {
  companyId: Schema.Types.ObjectId;
  actorId: Schema.Types.ObjectId;
  actorEmail: string;
  actorName: string;
  action: string;
  entityType: 'user' | 'card' | 'domain' | 'sso' | 'branding' | 'workspace' | 'lead' | 'ticket';
  entityId?: string;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface IAuditLogDocument extends IAuditLog, Document {}

const AuditLogSchema = new Schema<IAuditLogDocument>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  actorEmail: { type: String, required: true },
  actorName: { type: String, required: true },
  action: { type: String, required: true, index: true },
  entityType: {
    type: String,
    enum: ['user', 'card', 'domain', 'sso', 'branding', 'workspace', 'lead', 'ticket'],
    required: true,
    index: true
  },
  entityId: { type: String },
  details: { type: Schema.Types.Mixed, default: () => ({}) },
  ip: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now, index: true }
}, {
  timestamps: { createdAt: 'timestamp', updatedAt: false }
});

AuditLogSchema.index({ companyId: 1, timestamp: -1 });

export const AuditLogModel = model<IAuditLogDocument>('AuditLog', AuditLogSchema);
export default AuditLogModel;
