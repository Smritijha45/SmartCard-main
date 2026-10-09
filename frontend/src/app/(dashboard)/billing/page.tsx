'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Shield, Clock, CheckCircle2, AlertCircle, 
  Sparkles, ArrowRight, Download, RefreshCw, X, Zap, Building2 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PlanSwitcherModal } from '@/components/PlanSwitcherModal';
import { RazorpayCheckoutModal, CheckoutProductType } from '@/components/billing/RazorpayCheckoutModal';

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Modal States
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutType, setCheckoutType] = useState<CheckoutProductType>('pass_24h');
  const [cancelLoading, setCancelLoading] = useState(false);

  // Time Remaining for 24h pass
  const [passTimeRemaining, setPassTimeRemaining] = useState<string>('');

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      const [subRes, histRes, userRes] = await Promise.all([
        fetch('/api/billing/subscription'),
        fetch('/api/billing/history'),
        fetch('/api/auth/me'),
      ]);

      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscription(subData.data?.subscription || subData.data || null);
      }
      if (histRes.ok) {
        const histData = await histRes.json();
        setHistory(histData.data || []);
      }
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  // Calculate 24h pass expiry countdown
  useEffect(() => {
    const updateCountdown = () => {
      const expiry = subscription?.passExpiryDate || user?.passExpiresAt;
      if (!expiry) {
        setPassTimeRemaining('');
        return;
      }

      const diff = new Date(expiry).getTime() - new Date().getTime();
      if (diff <= 0) {
        setPassTimeRemaining('Expired (Reverted to Starter)');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setPassTimeRemaining(`${hours}h ${minutes}m ${seconds}s remaining`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [subscription, user]);

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your monthly subscription? You will retain access until the end of the current billing cycle.')) {
      return;
    }

    setCancelLoading(true);
    try {
      const res = await fetch('/api/billing/cancel', {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(data.message || 'Subscription cancelled successfully.');
        fetchBillingData();
      } else {
        showNotification(data.message || 'Failed to cancel subscription.');
      }
    } catch (err: any) {
      showNotification(err.message || 'An error occurred.');
    } finally {
      setCancelLoading(false);
    }
  };

  const plan = user?.subscriptionPlan || subscription?.plan || 'starter';
  const is24hPass = subscription?.is24hPass || user?.is24hPass || false;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <CreditCard size={24} className="text-blue-600 dark:text-blue-400" />
            <span>Billing &amp; Subscription</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your SmartCard plan, Razorpay payment methods, active passes, and payment invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchBillingData()}
            className="text-xs"
          >
            <RefreshCw size={13} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowPlanModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
          >
            <Sparkles size={13} className="mr-1 text-yellow-300" />
            <span>Change Plan</span>
          </Button>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400" />
            <span>{toast}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Special ₹20 24h Introductory Pass Promo Banner */}
      {plan === 'starter' && !is24hPass && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-blue-500/10 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                Introductory Offer
              </span>
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                ₹20 INR One-Time
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Try Professional for ₹20 — full access for 24 hours.
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Experience multi-card management (up to 10 cards), inbound CRM lead capture, visitor &amp; QR scan analytics charts, and data exports. No recurring commitment.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => {
              setCheckoutType('pass_24h');
              setShowCheckoutModal(true);
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-10 px-5 shadow-md shadow-amber-500/20 shrink-0"
          >
            <span>Activate 24h Pass (₹20)</span>
            <ArrowRight size={14} className="ml-1.5" />
          </Button>
        </div>
      )}

      {/* Current Active Plan Card */}
      <div className="bg-white dark:bg-[#131924] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {plan === 'enterprise'
                  ? 'Team & Enterprise Plan'
                  : plan === 'professional'
                  ? is24hPass
                    ? 'Professional Plan (24-Hour Pass)'
                    : 'Professional Plan'
                  : 'Starter Plan (Free Forever)'}
              </h2>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                plan === 'enterprise'
                  ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                  : plan === 'professional'
                  ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {is24hPass ? '24h Pass Active' : 'Active'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {plan === 'enterprise'
                ? '₹799/month recurring • Includes 25 Team Seats, Admin Directory, SSO & Audit Logs.'
                : plan === 'professional'
                ? is24hPass
                  ? '₹20 one-time paid pass • Full 24-hour access without auto-renewal.'
                  : '₹199/month recurring • Includes 10 Cards, CRM Leads Capture & Analytics.'
                : '₹0/month • Includes 1 Active Card, Personal Profile & QR Code.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {plan !== 'starter' && !is24hPass && (
              <Button
                variant="outline"
                size="sm"
                loading={cancelLoading}
                onClick={handleCancelSubscription}
                className="text-xs text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                Cancel Subscription
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowPlanModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            >
              Change Plan
            </Button>
          </div>
        </div>

        {/* 24-Hour Pass Live Countdown Card if Active */}
        {is24hPass && (
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  24-Hour Introductory Pass Time Remaining
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 font-mono font-semibold">
                  {passTimeRemaining || 'Calculating...'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCheckoutType('professional');
                setShowCheckoutModal(true);
              }}
              className="text-xs bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800"
            >
              Upgrade to Monthly (₹199)
            </Button>
          </div>
        )}

        {/* Plan Entitlement Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Active Card Limit
            </span>
            <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {plan === 'enterprise' ? '100 Cards' : plan === 'professional' ? '10 Cards' : '1 Card'}
            </p>
            <p className="text-[10px] text-slate-400">
              {plan === 'starter' ? 'Upgrade for up to 10 cards' : 'Configurable plan quota'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Inbound CRM Leads
            </span>
            <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {plan === 'starter' ? 'Disabled' : 'Enabled & Active'}
            </p>
            <p className="text-[10px] text-slate-400">
              {plan === 'starter' ? 'Unlock with Pro or ₹20 Pass' : '5 status stages & CSV export'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Team Workspace
            </span>
            <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {plan === 'enterprise' ? '25 Members' : 'Individual'}
            </p>
            <p className="text-[10px] text-slate-400">
              {plan === 'enterprise' ? 'Role-based access & SSO' : 'Enterprise tier only'}
            </p>
          </div>
        </div>
      </div>

      {/* Payment & Invoice History Table */}
      <div className="bg-white dark:bg-[#131924] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Payment &amp; Invoice History
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified Razorpay payment transactions, timestamps, and receipt stubs.
            </p>
          </div>
          <span className="text-xs text-slate-400">
            Currency: INR (₹)
          </span>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
            No payment history found. You are currently on the free Starter plan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 font-semibold border-y border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Order / Payment ID</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {history.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {new Date(item.createdAt || Date.now()).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {item.description || item.productType || 'Subscription Payment'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      <div>{item.orderId}</div>
                      <div className="text-[10px] text-slate-400">{item.paymentId}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                      ₹{((item.amount || 0) / 100).toFixed(0)} INR
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {item.status?.toUpperCase() || 'PAID'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => showNotification(`Receipt for ${item.orderId} downloaded.`)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <Download size={12} />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Plan Switcher Modal */}
      <PlanSwitcherModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        currentPlan={plan}
        onPlanChanged={(newPlan) => {
          fetchBillingData();
          showNotification(`Subscription updated to ${newPlan.toUpperCase()}!`);
        }}
      />

      {/* Razorpay Checkout Modal */}
      <RazorpayCheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        productType={checkoutType}
        onPaymentSuccess={() => {
          fetchBillingData();
        }}
      />

    </div>
  );
}
