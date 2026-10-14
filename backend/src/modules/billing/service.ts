import { Types } from 'mongoose';
import { getRazorpayClient, verifyRazorpayPaymentSignature, verifyRazorpayWebhookSignature } from './razorpayClient';
import { PaymentTransactionModel } from './transactionModel';
import { PaymentWebhookEventModel } from './webhookModel';
import { SubscriptionModel } from './subscriptionModel';
import UserModel from '../users/model';
import { toUserResponseDTO } from '../users/types';
import config from '../../config';
import logger from '../../lib/logger';
import { 
  PLAN_CONFIGS, 
  INTRODUCTORY_PASS_24H, 
  normalizePlanTier 
} from '../../config/plans';
import { 
  NotFoundError, 
  BadRequestError, 
  ConflictError, 
  UnauthorizedError 
} from '../../errors/AppError';

export class BillingService {
  /**
   * Retrieves all subscription plans and introductory pass details
   */
  async getPlans() {
    return {
      plans: Object.values(PLAN_CONFIGS),
      introductoryPass: INTRODUCTORY_PASS_24H,
      currency: 'INR'
    };
  }

  /**
   * Retrieves verified database subscription and entitlement for a user
   */
  async getSubscription(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const userDto = toUserResponseDTO(user);
    const transactions = await PaymentTransactionModel.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return {
      subscription: userDto.subscription,
      subscriptionPlan: userDto.subscriptionPlan,
      planConfig: userDto.planConfig,
      accountId: userDto.accountId,
      transactions: transactions.map(t => ({
        id: (t._id as Types.ObjectId).toString(),
        orderId: t.orderId,
        paymentId: t.paymentId,
        amount: t.amount,
        currency: t.currency,
        status: t.status,
        productType: t.productType,
        description: t.description,
        date: t.createdAt.toISOString(),
        paymentMethod: t.paymentMethod || 'UPI / Card'
      }))
    };
  }

  /**
   * Creates a Razorpay Order for the ₹20, 24-Hour Introductory Pass
   */
  async createIntroductoryOrder(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Eligibility check: Prevent overlapping access
    const sub = user.subscription;
    if (sub?.is24hPass && sub.passExpiryDate && new Date(sub.passExpiryDate) > new Date()) {
      throw new ConflictError('You currently have an active 24-Hour Professional Pass in effect.');
    }
    if (user.subscriptionPlan === 'professional' && !sub?.is24hPass && sub?.status === 'active') {
      throw new ConflictError('You already have an active Professional subscription.');
    }
    if (user.subscriptionPlan === 'enterprise' && sub?.status === 'active') {
      throw new ConflictError('You already have an active Team & Enterprise subscription.');
    }

    const amountInPaise = INTRODUCTORY_PASS_24H.priceInr * 100; // ₹20 = 2000 paise
    const receipt = `rcpt_pass_${Date.now().toString().slice(-8)}`;

    let orderId: string;
    try {
      const razorpay = getRazorpayClient();
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        notes: {
          userId: user.id,
          email: user.email,
          productType: 'pass_24h_pro'
        }
      });
      orderId = order.id;
      logger.info({ orderId, userId: user.id, amountInPaise }, 'Razorpay introductory pass order created');
    } catch (err: any) {
      logger.error(
        { 
          err: err.message, 
          statusCode: err.statusCode,
          code: err.error?.code,
          description: err.error?.description 
        }, 
        'Razorpay API create introductory order failed'
      );
      throw new BadRequestError(`Payment gateway order creation failed: ${err.error?.description || err.message || 'Gateway error'}`);
    }

    // Persist transaction record in MongoDB
    await PaymentTransactionModel.create({
      userId: user._id,
      orderId,
      amount: INTRODUCTORY_PASS_24H.priceInr,
      currency: 'INR',
      status: 'created',
      productType: 'pass_24h_pro',
      description: 'Try Professional for ₹20 — full access for 24 hours.',
      receipt
    });

    return {
      orderId,
      amount: amountInPaise,
      amountInr: INTRODUCTORY_PASS_24H.priceInr,
      currency: 'INR',
      keyId: config.RAZORPAY_KEY_ID,
      productName: INTRODUCTORY_PASS_24H.name,
      description: 'Try Professional for ₹20 — full access for 24 hours.',
      user: {
        name: user.name,
        email: user.email
      }
    };
  }

  /**
   * Verifies Razorpay payment signature & activates 24-Hour Professional Entitlement
   */
  async verifyIntroductoryPayment(userId: string, data: { 
    orderId?: string; 
    razorpay_order_id?: string;
    paymentId?: string; 
    razorpay_payment_id?: string;
    signature?: string; 
    razorpay_signature?: string;
  }) {
    const orderId = data.orderId || data.razorpay_order_id;
    const paymentId = data.paymentId || data.razorpay_payment_id;
    const signature = data.signature || data.razorpay_signature;

    if (!orderId || !paymentId || !signature) {
      throw new BadRequestError('Missing required payment verification parameters: orderId, paymentId, and signature are required');
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const transaction = await PaymentTransactionModel.findOne({ orderId });
    if (!transaction) {
      throw new NotFoundError('Payment order not found in records');
    }

    // Ensure order belongs to authenticated user
    if (transaction.userId && user._id && transaction.userId.toString() !== user._id.toString()) {
      logger.warn({ orderUserId: transaction.userId, authUserId: user._id, orderId }, 'User mismatch during payment verification');
      throw new UnauthorizedError('Payment order does not belong to the authenticated user');
    }

    // Idempotent safeguard: If already captured, return current user state without re-activating
    if (transaction.status === 'captured') {
      logger.info({ orderId, userId }, 'Introductory payment already verified and captured (idempotent replay)');
      return toUserResponseDTO(user);
    }

    // Verify cryptographic HMAC-SHA256 signature
    const isValidSignature = verifyRazorpayPaymentSignature({
      orderId,
      paymentId,
      signature
    });

    if (!isValidSignature) {
      transaction.status = 'failed';
      await transaction.save();
      logger.warn({ orderId, paymentId }, 'Razorpay payment signature verification failed');
      throw new BadRequestError('Payment signature verification failed. Transaction was not authorized.');
    }

    const now = new Date();
    const passExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); // exactly 24 hours

    // Atomic transaction update
    transaction.status = 'captured';
    transaction.paymentId = paymentId;
    transaction.signature = signature;
    transaction.paymentMethod = 'UPI / Card (Razorpay Verified)';
    await transaction.save();

    const paymentLedgerRecord = {
      id: paymentId,
      amount: transaction.amount,
      currency: 'INR',
      status: 'completed' as const,
      description: '24-Hour Introductory Professional Pass (₹20)',
      date: now,
      paymentMethod: 'UPI / Card'
    };

    // Update User Entitlement in MongoDB
    user.subscriptionPlan = 'professional';
    user.subscription = {
      plan: 'professional',
      status: 'active',
      is24hPass: true,
      passExpiryDate: passExpiry,
      currentPeriodStart: now,
      currentPeriodEnd: passExpiry,
      paymentProvider: 'razorpay',
      paymentProviderId: paymentId,
      cancelAtPeriodEnd: false,
      paymentHistory: [paymentLedgerRecord, ...(user.subscription?.paymentHistory || [])]
    };
    await user.save();

    // Upsert standalone Subscription record
    await SubscriptionModel.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        plan: 'professional',
        status: 'active',
        is24hPass: true,
        passExpiryDate: passExpiry,
        currentPeriodStart: now,
        currentPeriodEnd: passExpiry,
        cancelAtPeriodEnd: false
      },
      { upsert: true, new: true }
    );

    logger.info({ userId: user.id, orderId, passExpiry }, '₹20 24-Hour Professional Pass Entitlement Activated');

    return toUserResponseDTO(user);
  }

  /**
   * Creates Razorpay order for recurring monthly subscription
   */
  async createSubscriptionOrder(userId: string, planTier: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const tier = normalizePlanTier(planTier);
    if (tier === 'starter') {
      throw new BadRequestError('Starter plan does not require checkout');
    }

    const planDef = PLAN_CONFIGS[tier];
    const amountInPaise = planDef.priceMonthlyInr * 100;
    const receipt = `rcpt_${tier}_${Date.now().toString().slice(-8)}`;

    let orderId: string;
    try {
      const razorpay = getRazorpayClient();
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        notes: {
          userId: user.id,
          email: user.email,
          productType: tier === 'enterprise' ? 'plan_enterprise_monthly' : 'plan_professional_monthly'
        }
      });
      orderId = order.id;
      logger.info({ orderId, userId: user.id, plan: tier, amountInPaise }, 'Razorpay subscription order created');
    } catch (err: any) {
      logger.error(
        { 
          err: err.message, 
          statusCode: err.statusCode,
          code: err.error?.code,
          description: err.error?.description 
        }, 
        'Razorpay API create subscription order failed'
      );
      throw new BadRequestError(`Payment gateway subscription order creation failed: ${err.error?.description || err.message || 'Gateway error'}`);
    }

    await PaymentTransactionModel.create({
      userId: user._id,
      orderId,
      amount: planDef.priceMonthlyInr,
      currency: 'INR',
      status: 'created',
      productType: tier === 'enterprise' ? 'plan_enterprise_monthly' : 'plan_professional_monthly',
      description: `${planDef.name} Subscription (Monthly Recurring - ₹${planDef.priceMonthlyInr}/mo)`,
      receipt
    });

    return {
      orderId,
      amount: amountInPaise,
      amountInr: planDef.priceMonthlyInr,
      currency: 'INR',
      keyId: config.RAZORPAY_KEY_ID,
      plan: tier,
      productName: `${planDef.name} Plan`,
      description: `${planDef.name} Monthly Subscription — ₹${planDef.priceMonthlyInr}/month`,
      user: {
        name: user.name,
        email: user.email
      }
    };
  }

  /**
   * Verifies monthly subscription payment & activates recurring entitlement
   */
  async verifySubscriptionPayment(userId: string, data: { 
    orderId?: string; 
    razorpay_order_id?: string;
    paymentId?: string; 
    razorpay_payment_id?: string;
    signature?: string; 
    razorpay_signature?: string;
    plan?: string;
  }) {
    const orderId = data.orderId || data.razorpay_order_id;
    const paymentId = data.paymentId || data.razorpay_payment_id;
    const signature = data.signature || data.razorpay_signature;

    if (!orderId || !paymentId || !signature) {
      throw new BadRequestError('Missing required payment verification parameters: orderId, paymentId, and signature are required');
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const transaction = await PaymentTransactionModel.findOne({ orderId });
    if (!transaction) {
      throw new NotFoundError('Order transaction not found in records');
    }

    // Ensure order belongs to authenticated user
    if (transaction.userId && user._id && transaction.userId.toString() !== user._id.toString()) {
      logger.warn({ orderUserId: transaction.userId, authUserId: user._id, orderId }, 'User mismatch during subscription payment verification');
      throw new UnauthorizedError('Payment order does not belong to the authenticated user');
    }

    // Idempotent safeguard: If already captured, return current user state without re-activating
    if (transaction.status === 'captured') {
      logger.info({ orderId, userId }, 'Subscription payment already verified and captured (idempotent replay)');
      return toUserResponseDTO(user);
    }

    // Strictly verify cryptographic HMAC-SHA256 signature
    const isValidSignature = verifyRazorpayPaymentSignature({
      orderId,
      paymentId,
      signature
    });

    if (!isValidSignature) {
      transaction.status = 'failed';
      await transaction.save();
      logger.warn({ orderId, paymentId }, 'Razorpay subscription payment signature verification failed');
      throw new BadRequestError('Payment signature verification failed. Transaction was not authorized.');
    }

    // Determine tier from transaction record or fallback to validated plan in request
    const tierFromTx = transaction.productType === 'plan_enterprise_monthly' ? 'enterprise' : 'professional';
    const tier = data.plan ? normalizePlanTier(data.plan) : tierFromTx;
    const planDef = PLAN_CONFIGS[tier];

    const now = new Date();
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    transaction.status = 'captured';
    transaction.paymentId = paymentId;
    transaction.signature = signature;
    transaction.paymentMethod = 'UPI / Card (Razorpay Verified)';
    await transaction.save();

    const paymentLedgerRecord = {
      id: paymentId,
      amount: planDef.priceMonthlyInr,
      currency: 'INR',
      status: 'completed' as const,
      description: `${planDef.name} Subscription (Monthly Recurring)`,
      date: now,
      paymentMethod: 'UPI / Card'
    };

    user.subscriptionPlan = tier;
    user.subscription = {
      plan: tier,
      status: 'active',
      is24hPass: false,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      paymentProvider: 'razorpay',
      paymentProviderId: paymentId,
      cancelAtPeriodEnd: false,
      paymentHistory: [paymentLedgerRecord, ...(user.subscription?.paymentHistory || [])]
    };
    await user.save();

    await SubscriptionModel.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        plan: tier,
        status: 'active',
        is24hPass: false,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false
      },
      { upsert: true, new: true }
    );

    logger.info({ userId: user.id, plan: tier, orderId }, 'Monthly Subscription Entitlement Activated');

    return toUserResponseDTO(user);
  }

  /**
   * Cancels recurring subscription (takes effect at currentPeriodEnd)
   */
  async cancelSubscription(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const now = new Date();
    user.subscription.cancelAtPeriodEnd = true;
    user.subscription.canceledAt = now;
    await user.save();

    await SubscriptionModel.findOneAndUpdate(
      { userId: user._id },
      {
        cancelAtPeriodEnd: true,
        canceledAt: now
      }
    );

    return {
      message: 'Subscription cancellation scheduled. Access will remain active until the end of the billing period.',
      currentPeriodEnd: user.subscription.currentPeriodEnd,
      cancelAtPeriodEnd: true
    };
  }

  /**
   * Processes Razorpay Webhook Event idempotently
   */
  async processWebhook(rawBody: Buffer | string, signature: string) {
    // 1. Verify Webhook Signature
    const isValid = verifyRazorpayWebhookSignature(rawBody, signature);
    if (!isValid && config.NODE_ENV === 'production') {
      throw new UnauthorizedError('Invalid webhook signature');
    }

    const payload = typeof rawBody === 'string' ? JSON.parse(rawBody) : JSON.parse(rawBody.toString('utf-8'));
    const eventId = payload.event_id || payload.id || `evt_${Date.now()}`;
    const eventType = payload.event;

    // 2. Idempotency Check
    const existingEvent = await PaymentWebhookEventModel.findOne({ eventId });
    if (existingEvent && existingEvent.status === 'processed') {
      logger.info({ eventId, eventType }, 'Webhook event already processed (idempotent skip)');
      return { received: true, idempotent: true };
    }

    const webhookRecord = await PaymentWebhookEventModel.create({
      eventId,
      event: eventType,
      status: 'received',
      payload
    });

    try {
      // 3. Process Event Types
      if (eventType === 'payment.captured' || eventType === 'order.paid') {
        const payment = payload.payload?.payment?.entity || payload.payload?.order?.entity;
        const orderId = payment?.order_id || payment?.id;
        if (orderId) {
          const transaction = await PaymentTransactionModel.findOne({ orderId });
          if (transaction && transaction.status !== 'captured') {
            transaction.status = 'captured';
            transaction.paymentId = payment.id;
            await transaction.save();

            // Reconcile user entitlement if needed
            const user = await UserModel.findById(transaction.userId);
            if (user) {
              if (transaction.productType === 'pass_24h_pro') {
                const now = new Date();
                user.subscriptionPlan = 'professional';
                user.subscription.is24hPass = true;
                user.subscription.passExpiryDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                await user.save();
              }
            }
          }
        }
      } else if (eventType === 'subscription.cancelled' || eventType === 'subscription.halted') {
        const subEntity = payload.payload?.subscription?.entity;
        const subId = subEntity?.id;
        if (subId) {
          await SubscriptionModel.findOneAndUpdate(
            { razorpaySubscriptionId: subId },
            { status: 'canceled', cancelAtPeriodEnd: true }
          );
        }
      }

      webhookRecord.status = 'processed';
      webhookRecord.processedAt = new Date();
      await webhookRecord.save();

      return { received: true, success: true };
    } catch (err: any) {
      webhookRecord.status = 'failed';
      webhookRecord.error = err.message;
      await webhookRecord.save();
      throw err;
    }
  }
}
export default BillingService;
