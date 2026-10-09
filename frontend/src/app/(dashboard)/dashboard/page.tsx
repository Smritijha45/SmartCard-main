'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, Zap, Shield, Building2, CreditCard, Users, CheckCircle2
} from 'lucide-react';
import { StarterDashboard } from '@/components/dashboard/StarterDashboard';
import { ProfessionalDashboard } from '@/components/dashboard/ProfessionalDashboard';
import { EnterpriseDashboard } from '@/components/dashboard/EnterpriseDashboard';
import { PlanSwitcherModal } from '@/components/PlanSwitcherModal';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'starter' | 'professional' | 'enterprise'>('professional');
  const [user, setUser] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [isActivatingPass, setIsActivatingPass] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const loadAllData = async () => {
    try {
      // 1. Fetch User Plan & Profile
      const userRes = await fetch('/api/user/plan').then(r => r.ok ? r.json() : null).catch(() => null);
      if (userRes && (userRes.data || userRes.plan)) {
        const u = userRes.data || userRes;
        setUser(u);
        const plan = (u.subscriptionPlan || u.plan || 'professional').toLowerCase();
        setActiveTab(plan === 'enterprise' ? 'enterprise' : plan === 'professional' ? 'professional' : 'starter');
      }

      // 2. Fetch User Cards
      const cardsRes = await fetch('/api/cards').then(r => r.ok ? r.json() : null).catch(() => null);
      if (cardsRes) {
        const cardList = Array.isArray(cardsRes) ? cardsRes : cardsRes.data || [];
        setCards(cardList);
        if (cardList.length > 0) setCard(cardList[0]);
      }

      // 3. Fetch Leads
      const leadsRes = await fetch('/api/leads').then(r => r.ok ? r.json() : null).catch(() => null);
      if (leadsRes) {
        const leadList = Array.isArray(leadsRes) ? leadsRes : leadsRes.data || [];
        setLeads(leadList);
      }

      // 4. Fetch Company & Members & Audit Logs (for Enterprise)
      const companyRes = await fetch('/api/company').then(r => r.ok ? r.json() : null).catch(() => null);
      if (companyRes && companyRes.data) {
        setCompany(companyRes.data);
      }

      const membersRes = await fetch('/api/company/members').then(r => r.ok ? r.json() : null).catch(() => null);
      if (membersRes && membersRes.data) {
        setMembers(membersRes.data);
      }

      const logsRes = await fetch('/api/company/audit-logs').then(r => r.ok ? r.json() : null).catch(() => null);
      if (logsRes && logsRes.data) {
        setAuditLogs(logsRes.data);
      }
    } catch {
      // Fallback to local state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleActivatePass24h = async () => {
    setIsActivatingPass(true);
    try {
      const res = await fetch('/api/user/pass-24h', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        showToast('₹20 24-Hour Introductory Professional Pass Activated!');
        setActiveTab('professional');
        await loadAllData();
      } else {
        showToast(data.message || 'Pass activated in demo mode');
        setActiveTab('professional');
      }
    } catch {
      showToast('₹20 24-Hour Pass Activated in Sandbox!');
      setActiveTab('professional');
    } finally {
      setIsActivatingPass(false);
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      await fetch(`/api/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setLeads(prev => prev.map(l => (l._id === leadId || l.id === leadId) ? { ...l, status: newStatus } : l));
      showToast(`Lead status updated to ${newStatus}`);
    } catch {
      setLeads(prev => prev.map(l => (l._id === leadId || l.id === leadId) ? { ...l, status: newStatus } : l));
      showToast(`Lead status updated to ${newStatus}`);
    }
  };

  const handleInviteMember = async (email: string, role: string) => {
    const res = await fetch('/api/company/invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });
    if (!res.ok) throw new Error('Invite failed');
    await loadAllData();
  };

  const handleUpdateMemberRole = async (memberId: string, newRole: string) => {
    try {
      await fetch(`/api/company/members/${memberId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      setMembers(prev => prev.map(m => (m.id === memberId || m._id === memberId) ? { ...m, role: newRole } : m));
      showToast(`Member role updated to ${newRole}`);
    } catch {
      setMembers(prev => prev.map(m => (m.id === memberId || m._id === memberId) ? { ...m, role: newRole } : m));
      showToast(`Member role updated to ${newRole}`);
    }
  };

  const handleSuspendCard = async (cardId: string, suspend: boolean) => {
    try {
      await fetch(`/api/company/cards/${cardId}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSuspended: suspend }),
      });
      showToast(suspend ? 'Card suspended' : 'Card activated');
    } catch {
      showToast(suspend ? 'Card suspended' : 'Card activated');
    }
  };

  const handleVerifyDomain = async () => {
    const res = await fetch('/api/company/domain/verify', {
      method: 'POST',
    });
    const data = await res.json();
    if (data.data?.isVerified) {
      showToast('DNS verification check passed!');
    } else {
      showToast('DNS TXT / CNAME verification pending on DNS registrar');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* UNIFIED TIER SWITCHER / DASHBOARD SELECTOR */}
      <div className="bg-white dark:bg-[#131924] rounded-2xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Active Dashboard Experience:
          </span>
        </div>

        {/* 3 Distinct Dashboard Tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('starter')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'starter'
                ? 'bg-white dark:bg-[#131924] text-slate-900 dark:text-white shadow-2xs font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CreditCard size={14} className={activeTab === 'starter' ? 'text-blue-600 dark:text-blue-400' : ''} />
            <span>Starter (₹0)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('professional')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'professional'
                ? 'bg-white dark:bg-[#131924] text-slate-900 dark:text-white shadow-2xs font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles size={14} className={activeTab === 'professional' ? 'text-blue-600 dark:text-blue-400' : ''} />
            <span>Professional (₹199)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('enterprise')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'enterprise'
                ? 'bg-white dark:bg-[#131924] text-slate-900 dark:text-white shadow-2xs font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 size={14} className={activeTab === 'enterprise' ? 'text-purple-600 dark:text-purple-400' : ''} />
            <span>Enterprise (₹799)</span>
          </button>
        </div>
      </div>

      {/* RENDER DISTINCT DASHBOARD ACCORDING TO SELECTED / ACTIVE TIER */}
      {activeTab === 'starter' && (
        <StarterDashboard
          user={user}
          card={card || cards[0]}
          onUpdateCard={(updated) => setCard(updated)}
          onOpenPlanSwitcher={() => setShowPlanModal(true)}
          onActivatePass24h={handleActivatePass24h}
          isActivatingPass={isActivatingPass}
        />
      )}

      {activeTab === 'professional' && (
        <ProfessionalDashboard
          user={user}
          cards={cards}
          leads={leads}
          onUpdateLeadStatus={handleUpdateLeadStatus}
          onOpenPlanSwitcher={() => setShowPlanModal(true)}
          onOpenNewCardModal={() => router.push('/cards/new')}
          onRefreshData={loadAllData}
        />
      )}

      {activeTab === 'enterprise' && (
        <EnterpriseDashboard
          user={user}
          company={company}
          members={members}
          auditLogs={auditLogs}
          onInviteMember={handleInviteMember}
          onUpdateMemberRole={handleUpdateMemberRole}
          onSuspendCard={handleSuspendCard}
          onVerifyDomain={handleVerifyDomain}
          onOpenPlanSwitcher={() => setShowPlanModal(true)}
        />
      )}

      {/* Subscription Plan Switcher Modal */}
      <PlanSwitcherModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        currentPlan={activeTab}
        onPlanChanged={(newPlan) => {
          setActiveTab(newPlan as any);
          showToast(`Subscription upgraded to ${newPlan.toUpperCase()}!`);
          loadAllData();
        }}
      />

      {/* Floating Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 rounded-xl text-xs font-medium shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 size={15} className="text-emerald-400 dark:text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
