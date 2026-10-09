'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, Check, AlertCircle, X, CreditCard, Sparkles, 
  Lock, ArrowRight, Clock, Building2, CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export type CheckoutProductType = 'pass_24h' | 'professional' | 'enterprise';

export interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  productType: CheckoutProductType;
  onPaymentSuccess?: (result: any) => void;
}

export function RazorpayCheckoutModal({
  isOpen,
  onClose,
  productType,
  onPaymentSuccess,
}: RazorpayCheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);
  const [user, setUser] = useState<any>(null);

  // Load user data for prefilling Razorpay checkout
  useEffect(() => {
    if (isOpen) {
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data && (data._id || data.id || data.email)) {
            setUser(data);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // Dynamically load Razorpay SDK
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const productDetails = {
    pass_24h: {
      title: '24-Hour Introductory Professional Pass',
      badge: 'Introductory Offer',
      badgeColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-300',
      headline: 'Try Professional for ₹20 — full access for 24 hours.',
      amount: '₹20',
      amountPaise: 2000,
      period: 'one-time (24 hours)',
      billingType: 'One-Time Payment',
      recurringNote: 'No recurring payment consent. Does NOT automatically renew.',
      features: [
        'Full 24-Hour Professional tier access',
        'Up to 10 active digital business cards',
        'Inbound CRM lead capture forms & management',
        'Visitor & QR scan tracking analytics',
        'CSV & JSON lead exports',
        'Custom brand badges & premium themes',
        'Automatic expiry after 24 hours with all data preserved'
      ],
    },
    professional: {
      title: 'Professional Plan Monthly Subscription',
      badge: 'Monthly Plan',
      badgeColor: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border-blue-300',
      headline: 'Power tools for consultants, founders, and sales teams.',
      amount: '₹199',
      amountPaise: 19900,
      period: 'per month',
      billingType: 'Monthly Recurring Subscription',
      recurringNote: 'Renews automatically at ₹199/month. Cancel anytime in Settings.',
      features: [
        'Up to 10 active digital cards',
        'Inbound lead capture forms & CRM dashboard',
        '5-stage lead management pipeline',
        'Visitor and QR scan analytics charts',
        'Date-range filters (7d, 30d, 90d, All)',
        'CSV & JSON data exports',
        'Custom brand colors & badges'
      ],
    },
    enterprise: {
      title: 'Team & Enterprise Monthly Subscription',
      badge: 'Organization Plan',
      badgeColor: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 border-purple-300',
      headline: 'Complete identity, analytics & card platform for organizations.',
      amount: '₹799',
      amountPaise: 79900,
      period: 'per month',
      billingType: 'Monthly Recurring Subscription',
      recurringNote: 'Renews automatically at ₹799/month. Cancel anytime in Settings.',
      features: [
        'Everything in Professional',
        '25 Team Member seats allocation',
        'Centralized administration & member directory',
        'Role-Based Access (Owner, Admin, Manager, Employee)',
        'Custom domain DNS verification',
        'MongoDB Admin audit logs',
        'Enterprise SSO setup & support requests'
      ],
    },
  }[productType];

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      // Step 1: Create Order on Backend
      let orderRes;
      if (productType === 'pass_24h') {
        orderRes = await fetch('/api/billing/introductory-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        orderRes = await fetch('/api/billing/subscription-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: productType }),
        });
      }

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || 'Failed to initiate payment order.');
      }

      const { orderId, amount, currency, keyId } = orderData.data;

      // Step 2: Configure Razorpay Checkout Options
      const options = {
        key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mockkey12345',
        amount: amount,
        currency: currency || 'INR',
        name: 'SmartCard Identity Platform',
        description: productDetails.title,
        order_id: orderId,
        image: 'https://smartcard.app/logo.png',
        prefill: {
          name: user?.name || 'SmartCard User',
          email: user?.email || 'user@example.com',
          contact: user?.phone || '',
        },
        theme: {
          color: '#2563EB',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async (response: any) => {
          try {
            setLoading(true);
            // Step 3: Verify Payment Signature on Backend
            let verifyRes;
            if (productType === 'pass_24h') {
              verifyRes = await fetch('/api/billing/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
            } else {
              verifyRes = await fetch('/api/billing/verify-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  plan: productType,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
            }

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setSuccessData(verifyData.data);
              if (onPaymentSuccess) {
                onPaymentSuccess(verifyData.data);
              }
            } else {
              setErrorMsg(verifyData.message || 'Payment signature verification failed.');
            }
          } catch (err: any) {
            setErrorMsg(err.message || 'Verification request failed.');
          } finally {
            setLoading(false);
          }
        },
      };

      // Step 4: Open Razorpay Modal
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp: any) => {
        setErrorMsg(`Payment failed: ${resp.error?.description || 'Transaction declined'}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected checkout error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#101622] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
              <CreditCard size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Razorpay Secure Checkout
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                100% Encrypted &amp; Verified Indian Payment Gateway
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success View */}
        {successData ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                Payment Verified &amp; Activated!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                {productType === 'pass_24h'
                  ? 'Your ₹20 24-Hour Introductory Professional Pass is now active. Enjoy full access!'
                  : `Your ${productType.toUpperCase()} Monthly Subscription is active.`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {successData?.transaction?.orderId || 'Verified'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment ID:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {successData?.transaction?.paymentId || 'Verified'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {productDetails.amount} INR
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              onClick={() => {
                onClose();
                window.location.reload();
              }}
            >
              Go to Dashboard
            </Button>
          </div>
        ) : (
          /* Checkout View */
          <div className="p-6 space-y-6">
            
            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Product Summary Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${productDetails.badgeColor}`}>
                    {productDetails.badge}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1.5">
                    {productDetails.title}
                  </h4>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                    {productDetails.amount}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {productDetails.period}
                  </div>
                </div>
              </div>

              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
                {productDetails.headline}
              </p>

              {/* Feature Highlights */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  What&apos;s Included:
                </div>
                {productDetails.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recurring / Expiry Billing Clarity Note */}
            <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/60 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-300">
                <Clock size={13} />
                <span>Billing Terms</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {productDetails.recurringNote}
              </p>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
              <div className="flex items-center gap-1.5">
                <Shield size={14} className="text-emerald-500" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock size={14} className="text-blue-500" />
                <span>Official Razorpay Gateway</span>
              </div>
            </div>

            {/* Pay Button */}
            <Button
              variant="primary"
              className="w-full justify-center h-11 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
              loading={loading}
              onClick={handleCheckout}
            >
              <span>Pay {productDetails.amount} with Razorpay</span>
              <ArrowRight size={16} className="ml-1.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
export default RazorpayCheckoutModal;
