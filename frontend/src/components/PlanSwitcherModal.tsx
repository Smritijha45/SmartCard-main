'use client';

import React, { useState } from 'react';
import { Check, Sparkles, X, Shield, Users, CreditCard, ArrowRight, Zap, Building2 } from 'lucide-react';
import { Button } from './ui/Button';

export interface PlanSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
  onPlanChanged?: (newPlan: string) => void;
}

export function PlanSwitcherModal({
  isOpen,
  onClose,
  currentPlan = 'starter',
  onPlanChanged,
}: PlanSwitcherModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan.toLowerCase());
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = async (planKey: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/plan', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      });
      if (res.ok) {
        setSelectedPlan(planKey);
        setSuccessMsg(`Workspace updated to ${planKey.toUpperCase()} plan!`);
        if (onPlanChanged) onPlanChanged(planKey);
        setTimeout(() => {
          setSuccessMsg(null);
          onClose();
        }, 1200);
      }
    } catch {
      // Offline fallback
      setSelectedPlan(planKey);
      if (onPlanChanged) onPlanChanged(planKey);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '₹0',
      period: 'free forever',
      badge: 'No Payment Needed',
      badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
      desc: 'Personal digital profile for individual creators and professionals.',
      features: [
        '1 Active Digital Business Card',
        'Personal Dashboard & Profile Editor',
        'Contact Details & Social Links',
        'Profile Photo & Professional Bio',
        'Standard Minimal Theme',
        'Zero Payment Details Required'
      ],
      restrictions: [
        'No Multiple Active Cards',
        'No CRM Leads Capture / Export',
        'No Advanced Time-Range Analytics',
        'No Custom Brand Colors or Badges',
        'No Organization & Team Management',
        'No Custom Domain Verification',
        'No Enterprise SSO Integration'
      ],
      isPopular: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '₹199',
      period: 'per month',
      badge: 'Most Popular',
      badgeColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
      desc: 'Power tools for consultants, founders, and sales professionals.',
      features: [
        'Up to 10 Active Digital Cards',
        'Inbound Lead Capture Forms',
        'CRM Leads Dashboard (5 Statuses)',
        'Status Management: New, Contacted, Qualified, Converted, Lost',
        'Search, Filter & Lead Pagination',
        'Export Leads to CSV & JSON',
        'Visitor & QR Scan Analytics Charts',
        'Date-Range Filters (7d, 30d, 90d, All)',
        'Custom Brand Colors & Supported Badges',
        'Premium Card Themes & Styles'
      ],
      restrictions: [
        'No Centralized Team Administration',
        'No Custom Domain Verification',
        'No Enterprise SSO'
      ],
      isPopular: true,
    },
    {
      id: 'enterprise',
      name: 'Team & Enterprise',
      price: '₹799',
      period: 'per month',
      badge: 'Complete Suite',
      badgeColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
      desc: 'Centralized organization workspace for scaling teams and companies.',
      features: [
        'Everything in Professional',
        'Organization Workspace (25 Members)',
        'Centralized Team Admin Dashboard',
        'Invite Team Members by Email',
        'Accept / Reject Invitation Workflow',
        'Role-Based Access (Owner, Admin, Manager, Employee)',
        'Create, Edit, Suspend Team Member Cards',
        'Organization-Wide Card Directory',
        'Centralized Organization Leads & Team Analytics',
        'Export Team-Level Reports (CSV & JSON)',
        'Custom Domain Workflow with DNS Verification',
        'Organization Branding & Custom Badges',
        'MongoDB Audit Logs for Admin Actions',
        'Enterprise Support Requests & Ticket Workflow',
        'Real Enterprise SSO Setup & Validation'
      ],
      restrictions: [],
      isPopular: false,
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#101622] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
                <Zap size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
                SmartCard Subscription Plans
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select the plan that aligns with your networking and team requirements.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {successMsg && (
          <div className="mx-6 md:mx-8 mt-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm font-semibold flex items-center gap-2">
            <Check size={18} className="text-emerald-600 dark:text-emerald-400" />
            {successMsg}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-200 border ${
                  plan.isPopular
                    ? 'border-blue-500 dark:border-blue-600 shadow-lg bg-blue-50/20 dark:bg-blue-950/20 ring-2 ring-blue-500/20'
                    : isCurrent
                    ? 'border-slate-400 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131924]'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-full shadow-xs uppercase tracking-wider">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {plan.name}
                    </h3>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${plan.badgeColor}`}>
                      {isCurrent ? 'Active Plan' : plan.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 min-h-[36px]">
                    {plan.desc}
                  </p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      / {plan.period}
                    </span>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="font-semibold text-slate-900 dark:text-slate-200 mb-2">
                      Included Features:
                    </div>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                        <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}

                    {plan.restrictions.length > 0 && (
                      <div className="pt-3 mt-3 border-t border-dashed border-slate-200 dark:border-slate-800">
                        <div className="font-semibold text-slate-400 dark:text-slate-500 mb-2">
                          Restrictions:
                        </div>
                        {plan.restrictions.map((rest, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-slate-400 dark:text-slate-500 text-[11px]">
                            <X size={13} className="text-slate-400 shrink-0 mt-0.5" />
                            <span>{rest}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  {isCurrent ? (
                    <Button
                      variant="secondary"
                      className="w-full justify-center bg-slate-100 dark:bg-slate-800 font-semibold cursor-default"
                      disabled
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      variant={plan.isPopular ? 'primary' : 'outline'}
                      className="w-full justify-center"
                      loading={loading}
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      {plan.id === 'starter' ? 'Switch to Starter' : `Upgrade to ${plan.name}`}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default PlanSwitcherModal;
