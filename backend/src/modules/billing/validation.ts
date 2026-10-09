import { z } from 'zod';

export const createIntroductoryOrderSchema = z.object({
  body: z.object({}).optional()
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    orderId: z.string().min(1, 'Order ID is required'),
    paymentId: z.string().min(1, 'Payment ID is required'),
    signature: z.string().min(1, 'Signature is required'),
  })
});

export const createSubscriptionOrderSchema = z.object({
  body: z.object({
    plan: z.enum(['professional', 'enterprise', 'pro', 'team']),
    billingFrequency: z.enum(['monthly', 'annual']).default('monthly')
  })
});

export const cancelSubscriptionSchema = z.object({
  body: z.object({
    reason: z.string().optional()
  }).optional()
});
