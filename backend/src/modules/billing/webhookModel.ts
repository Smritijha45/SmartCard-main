import { Schema, model, Document } from 'mongoose';

export interface IPaymentWebhookEvent {
  eventId: string;
  event: string;
  status: 'received' | 'processed' | 'failed' | 'ignored';
  payload: Record<string, any>;
  error?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentWebhookEventDocument extends IPaymentWebhookEvent, Document {}

const PaymentWebhookEventSchema = new Schema<IPaymentWebhookEventDocument>({
  eventId: { type: String, required: true, unique: true, index: true },
  event: { type: String, required: true, index: true },
  status: {
    type: String,
    enum: ['received', 'processed', 'failed', 'ignored'],
    default: 'received',
    index: true
  },
  payload: { type: Schema.Types.Mixed, required: true },
  error: { type: String },
  processedAt: { type: Date }
}, {
  timestamps: true
});

export const PaymentWebhookEventModel = model<IPaymentWebhookEventDocument>('PaymentWebhookEvent', PaymentWebhookEventSchema);
export default PaymentWebhookEventModel;
