import { Schema, model, Document } from 'mongoose';

export interface IAnalyticsEvent {
  cardId: Schema.Types.ObjectId;
  companyId?: Schema.Types.ObjectId;
  eventType: 'view' | 'scan' | 'click' | 'save';
  referrer?: string;
  buttonId?: string;
  device?: string;
  browser?: string;
  country?: string;
  city?: string;
  ip?: string;
  timestamp: Date;
}

export interface IAnalyticsDocument extends IAnalyticsEvent, Document {}

const AnalyticsEventSchema = new Schema<IAnalyticsDocument>({
  cardId: { type: Schema.Types.ObjectId, ref: 'Card', required: true, index: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', index: true },
  eventType: { type: String, enum: ['view', 'scan', 'click', 'save'], required: true, index: true },
  referrer: { type: String, trim: true },
  buttonId: { type: String, trim: true },
  device: { type: String, default: 'Desktop' },
  browser: { type: String },
  country: { type: String, default: 'Unknown' },
  city: { type: String, default: 'Unknown' },
  ip: { type: String },
  timestamp: { type: Date, default: Date.now, index: true }
});

// Compound index for optimizing range query statistics
AnalyticsEventSchema.index({ cardId: 1, eventType: 1, timestamp: -1 });
AnalyticsEventSchema.index({ companyId: 1, eventType: 1, timestamp: -1 });

export const AnalyticsModel = model<IAnalyticsDocument>('Analytics', AnalyticsEventSchema);
export default AnalyticsModel;
