import { z } from 'zod';

export const createIntroductoryOrderSchema = z.object({
  body: z.object({}).optional()
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    orderId: z.string().optional(),
    razorpay_order_id: z.string().optional(),
    paymentId: z.string().optional(),
    razorpay_payment_id: z.string().optional(),
    signature: z.string().optional(),
    razorpay_signature: z.string().optional(),
  }).refine(
    (data) => !!(data.orderId || data.razorpay_order_id),
    { message: 'Order ID (orderId or razorpay_order_id) is required' }
  ).refine(
    (data) => !!(data.paymentId || data.razorpay_payment_id),
    { message: 'Payment ID (paymentId or razorpay_payment_id) is required' }
  ).refine(
    (data) => !!(data.signature || data.razorpay_signature),
    { message: 'Signature (signature or razorpay_signature) is required' }
  )
});

export const createSubscriptionOrderSchema = z.object({
  body: z.object({
    plan: z.enum(['professional', 'enterprise', 'pro', 'team']),
    billingFrequency: z.enum(['monthly', 'annual']).default('monthly')
  })
});

export const verifySubscriptionSchema = z.object({
  body: z.object({
    plan: z.enum(['professional', 'enterprise', 'pro', 'team']).optional(),
    orderId: z.string().optional(),
    razorpay_order_id: z.string().optional(),
    paymentId: z.string().optional(),
    razorpay_payment_id: z.string().optional(),
    signature: z.string().optional(),
    razorpay_signature: z.string().optional(),
  }).refine(
    (data) => !!(data.orderId || data.razorpay_order_id),
    { message: 'Order ID (orderId or razorpay_order_id) is required' }
  ).refine(
    (data) => !!(data.paymentId || data.razorpay_payment_id),
    { message: 'Payment ID (paymentId or razorpay_payment_id) is required' }
  ).refine(
    (data) => !!(data.signature || data.razorpay_signature),
    { message: 'Signature (signature or razorpay_signature) is required' }
  )
});

export const cancelSubscriptionSchema = z.object({
  body: z.object({
    reason: z.string().optional()
  }).optional()
});
