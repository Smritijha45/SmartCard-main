import { Router } from 'express';
import BillingController from './controller';
import { authenticate } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { 
  verifyPaymentSchema, 
  createSubscriptionOrderSchema,
  cancelSubscriptionSchema 
} from './validation';

const router = Router();
const controller = new BillingController();

// Public / Catalog plans
router.get('/plans', controller.getPlans);

// Webhook endpoint (Raw body signature verification)
router.post('/webhook', controller.webhook);

// Protected Billing Endpoints
router.use(authenticate);

router.get('/subscription', controller.getSubscription);
router.get('/history', controller.getHistory);

// Introductory ₹20 24-Hour Pass Order & Verification
router.post('/introductory-order', controller.createIntroductoryOrder);
router.post('/verify-payment', validateRequest(verifyPaymentSchema), controller.verifyPayment);

// Monthly Subscription Order & Verification
router.post('/subscription-order', validateRequest(createSubscriptionOrderSchema), controller.createSubscriptionOrder);
router.post('/verify-subscription', controller.verifySubscription);
router.post('/cancel', validateRequest(cancelSubscriptionSchema), controller.cancelSubscription);

export default router;
export { router as billingRoutes };
