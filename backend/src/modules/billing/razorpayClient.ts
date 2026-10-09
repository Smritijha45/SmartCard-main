import crypto from 'crypto';
import Razorpay from 'razorpay';
import config from '../../config';
import logger from '../../lib/logger';

let razorpayInstance: Razorpay | null = null;

export function getRazorpayClient(): Razorpay {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: config.RAZORPAY_KEY_ID,
      key_secret: config.RAZORPAY_KEY_SECRET
    });
  }
  return razorpayInstance;
}

/**
 * Validates Razorpay Payment Signature for Orders
 * formula: hmac_sha256(order_id + "|" + payment_id, secret) == signature
 */
export function verifyRazorpayPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  try {
    const text = `${params.orderId}|${params.paymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature, 'utf-8'),
      Buffer.from(params.signature, 'utf-8')
    );
    return isValid;
  } catch (err) {
    logger.error({ err }, 'Error verifying Razorpay payment signature');
    return false;
  }
}

/**
 * Validates Razorpay Webhook Signature using raw request body
 * formula: hmac_sha256(rawBody, webhookSecret) == signature
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string | Buffer,
  signature: string
): boolean {
  try {
    const bodyStr = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf-8');
    const expectedSignature = crypto
      .createHmac('sha256', config.RAZORPAY_WEBHOOK_SECRET)
      .update(bodyStr)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'utf-8'),
      Buffer.from(signature, 'utf-8')
    );
    return isValid;
  } catch (err) {
    logger.error({ err }, 'Error verifying Razorpay webhook signature');
    return false;
  }
}
