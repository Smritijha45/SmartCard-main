import { Schema, model, Document, Types } from 'mongoose';

export interface IPaymentTransaction {
  userId: Types.ObjectId;
  orderId: string;
  paymentId?: string;
  signature?: string;
  amount: number; // in INR
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';
  productType: 'pass_24h_pro' | 'plan_professional_monthly' | 'plan_enterprise_monthly';
  description: string;
  paymentMethod?: string;
  receipt?: string;
  invoiceUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentTransactionDocument extends IPaymentTransaction, Document {}

const PaymentTransactionSchema = new Schema<IPaymentTransactionDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  orderId: { type: String, required: true, unique: true, index: true },
  paymentId: { type: String, sparse: true, index: true },
  signature: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: {
    type: String,
    enum: ['created', 'authorized', 'captured', 'failed', 'refunded'],
    default: 'created',
    index: true
  },
  productType: {
    type: String,
    enum: ['pass_24h_pro', 'plan_professional_monthly', 'plan_enterprise_monthly'],
    required: true
  },
  description: { type: String, required: true },
  paymentMethod: { type: String },
  receipt: { type: String },
  invoiceUrl: { type: String },
  metadata: { type: Schema.Types.Mixed }
}, {
  timestamps: true
});

export const PaymentTransactionModel = model<IPaymentTransactionDocument>('PaymentTransaction', PaymentTransactionSchema);
export default PaymentTransactionModel;
