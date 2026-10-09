'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2, Users, CreditCard, Shield, Globe, Lock,
  Plus, Download, CheckCircle2, XCircle, AlertCircle,
  Copy, RefreshCw, Trash2, Mail, ExternalLink, Sparkles,
  ChevronRight, ArrowRight, MessageSquare, Clock, Send, Eye, ShieldAlert, Key
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PlanSwitcherModal } from '@/components/PlanSwitcherModal';

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Manager' | 'Employee';
  profilePhoto?: string;
  cardCount: number;
  isSuspended: boolean;
  joinedAt?: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Employee';
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'revoked';
  expiresAt: string;
  createdAt: string;
  invitedByName: string;
}

export interface TeamCard {
  id: string;
  userId: string;
  username: string;
  name: string;
  role: string;
  company: string;
  views: number;
  scans: number;
  isSuspended: boolean;
  isPublic: boolean;
  qrCodeUrl?: string;
}

export interface AuditLog {
  id: string;
  actorName: string;
  actorEmail: string;
  action: string;
  entityType: string;
  details?: any;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messages: Array<{
    id?: string;
    senderName: string;
    senderRole: string;
    message: string;
    createdAt: string;
  }>;
  createdAt: string;
}

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'cards' | 'domain' | 'sso' | 'branding' | 'audit' | 'support'>('members');
  const [userPlan, setUserPlan] = useState<string>('enterprise');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Workspace Data
  const [company, setCompany] = useState<any>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [teamCards, setTeamCards] = useState<TeamCard[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  // Modals & Inputs
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Manager' | 'Employee'>('Employee');

  // Domain configuration state
  const [customDomainInput, setCustomDomainInput] = useState('');
  const [verifyingDomain, setVerifyingDomain] = useState(false);

  // SSO configuration state
  const [ssoProvider, setSsoProvider] = useState<'google' | 'azure' | 'saml' | 'oidc'>('google');
  const [ssoClientId, setSsoClientId] = useState('');
  const [ssoClientSecret, setSsoClientSecret] = useState('');
  const [ssoIssuerUrl, setSsoIssuerUrl] = useState('');
  const [ssoDomainHint, setSsoDomainHint] = useState('');
  const [ssoValidating, setSsoValidating] = useState(false);
  const [ssoValidationResult, setSsoValidationResult] = useState<{ valid?: boolean; error?: string } | null>(null);

  // Support ticket state
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'technical' | 'billing' | 'sso' | 'domain' | 'general'>('technical');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [ticketMessage, setTicketMessage] = useState('');
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Branding state
  const [primaryColor, setPrimaryColor] = useState('#2563EB');
  const [badgeText, setBadgeText] = useState('Apex Verified Member');

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const userRes = await fetch('/api/auth/me');
      if (userRes.ok) {
        const u = await userRes.json();
        setUserPlan(u.subscriptionPlan || 'enterprise');
      }

      const [compRes, membRes, invRes, cardRes, logRes, tktRes] = await Promise.all([
        fetch('/api/company'),
        fetch('/api/company/members'),
        fetch('/api/company/invitations'),
        fetch('/api/company/cards'),
        fetch('/api/company/audit-logs'),
        fetch('/api/company/support'),
      ]);

      if (compRes.ok) {
        const c = await compRes.json();
        const data = c.data || c;
        setCompany(data);
        if (data.branding) {
          setPrimaryColor(data.branding.primaryColor || '#2563EB');
          setBadgeText(data.branding.badgeText || 'Enterprise Verified');
        }
        if (data.customDomain) {
          setCustomDomainInput(data.customDomain.domain || '');
        }
        if (data.ssoConfig) {
          setSsoProvider(data.ssoConfig.provider || 'google');
          setSsoClientId(data.ssoConfig.clientId || '');
          setSsoIssuerUrl(data.ssoConfig.issuerUrl || '');
          setSsoDomainHint(data.ssoConfig.domainHint || '');
        }
      }

      if (membRes.ok) {
        const m = await membRes.json();
        setMembers(m.data || m || []);
      }
      if (invRes.ok) {
        const i = await invRes.json();
        setInvitations(i.data || i || []);
      }
      if (cardRes.ok) {
        const cd = await cardRes.json();
        setTeamCards(cd.data || cd || []);
      }
      if (logRes.ok) {
        const l = await logRes.json();
        setAuditLogs(l.data || l || []);
      }
      if (tktRes.ok) {
        const t = await tktRes.json();
        setTickets(t.data || t || []);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    try {
      const res = await fetch('/api/company/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      if (res.ok) {
        showNotification(`Invitation sent to ${inviteEmail}`);
        setShowInviteModal(false);
        setInviteEmail('');
        loadAllData();
      } else {
        const err = await res.json();
        showNotification(err.message || 'Failed to send invitation');
      }
    } catch {
      showNotification('Failed to send invitation');
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    try {
      await fetch(`/api/company/invitations/${inviteId}`, { method: 'DELETE' });
      showNotification('Invitation revoked');
      loadAllData();
    } catch {
      // Ignore
    }
  };

  const handleUpdateRole = async (memberId: string, role: string) => {
    try {
      await fetch(`/api/company/members/${memberId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      showNotification(`Member role changed to ${role}`);
      loadAllData();
    } catch {
      // Ignore
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member from the organization workspace?')) return;
    try {
      await fetch(`/api/company/members/${memberId}`, { method: 'DELETE' });
      showNotification('Member removed from workspace');
      loadAllData();
    } catch {
      // Ignore
    }
  };

  const handleToggleCardSuspension = async (cardId: string, currentSuspended: boolean) => {
    try {
      await fetch(`/api/company/cards/${cardId}/suspend`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSuspended: !currentSuspended }),
      });
      showNotification(`Card ${!currentSuspended ? 'suspended' : 'activated'}`);
      loadAllData();
    } catch {
      // Ignore
    }
  };

  const handleConfigureDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDomainInput) return;
    try {
      const res = await fetch('/api/company/domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: customDomainInput }),
      });
      if (res.ok) {
        showNotification('Domain registered. Please complete DNS TXT verification.');
        loadAllData();
      } else {
        const err = await res.json();
        showNotification(err.message || 'Failed to configure domain');
      }
    } catch {
      showNotification('Failed to configure domain');
    }
  };

  const handleVerifyDomain = async () => {
    setVerifyingDomain(true);
    try {
      const res = await fetch('/api/company/domain/verify', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showNotification('Domain verified and connected successfully!');
      } else {
        showNotification(data.data?.error || data.message || 'DNS verification failed');
      }
      loadAllData();
    } catch {
      showNotification('Verification request failed');
    } finally {
      setVerifyingDomain(false);
    }
  };

  const handleRemoveDomain = async () => {
    if (!confirm('Remove custom domain from workspace?')) return;
    try {
      await fetch('/api/company/domain', { method: 'DELETE' });
      showNotification('Custom domain removed');
      setCustomDomainInput('');
      loadAllData();
    } catch {
      // Ignore
    }
  };

  const handleValidateSSO = async () => {
    setSsoValidating(true);
    setSsoValidationResult(null);
    try {
      const payload = {
        provider: ssoProvider,
        clientId: ssoClientId,
        clientSecret: ssoClientSecret,
        issuerUrl: ssoIssuerUrl,
        domainHint: ssoDomainHint,
      };

      const res = await fetch('/api/company/sso/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setSsoValidationResult(data.data || { valid: data.success });

      if (data.success) {
        showNotification('SSO configuration validated successfully!');
      } else {
        showNotification(data.data?.error || 'Validation error');
      }
    } catch {
      setSsoValidationResult({ valid: false, error: 'Validation service unreachable' });
    } finally {
      setSsoValidating(false);
    }
  };

  const handleSaveSSO = async () => {
    try {
      const res = await fetch('/api/company/sso', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: ssoProvider,
          clientId: ssoClientId,
          clientSecret: ssoClientSecret,
          issuerUrl: ssoIssuerUrl,
          domainHint: ssoDomainHint,
          enabled: true
        }),
      });
      if (res.ok) {
        showNotification('SSO settings saved in MongoDB');
        loadAllData();
      }
    } catch {
      showNotification('Failed to save SSO');
    }
  };

  const handleSaveBranding = async () => {
    try {
      await fetch('/api/company/branding', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primaryColor, badgeText }),
      });
      showNotification('Organization branding saved');
      loadAllData();
    } catch {
      // Ignore
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    try {
      const res = await fetch('/api/company/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: ticketSubject,
          category: ticketCategory,
          priority: ticketPriority,
          message: ticketMessage,
        }),
      });

      if (res.ok) {
        showNotification('Support ticket submitted to engineering queue!');
        setShowTicketModal(false);
        setTicketSubject('');
        setTicketMessage('');
        loadAllData();
      }
    } catch {
      showNotification('Failed to submit ticket');
    }
  };

  const handleSendReply = async () => {
    if (!activeTicket || !replyMessage.trim()) return;
    try {
      const res = await fetch(`/api/company/support/${activeTicket.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage }),
      });
      if (res.ok) {
        const updated = await res.json();
        setActiveTicket(updated.data || updated);
        setReplyMessage('');
        loadAllData();
      }
    } catch {
      // Ignore
    }
  };

  const handleExportTeamReport = async (format: 'csv' | 'json') => {
    showNotification(`Exporting team report to ${format.toUpperCase()}...`);
    try {
      const res = await fetch(`/api/company/reports/export?format=${format}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartcard-team-report-${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showNotification('Downloaded team report file!');
      }
    } catch {
      // Ignore
    }
  };

  const memberLimit = company?.memberLimit || 25;
  const isNotEnterprise = userPlan !== 'enterprise';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold shadow-2xl flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400 dark:text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20">
              <Building2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {company?.name || 'Apex Technologies Workspace'}
                </h1>
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Team & Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Centralized administration, seat provisioning, team directory, custom domain, and SSO control.
              </p>
            </div>
          </div>
        </div>

        {/* Global Team Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportTeamReport('csv')}
            icon={<Download size={14} />}
          >
            Export Team CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowInviteModal(true)}
            icon={<Plus size={14} />}
          >
            Invite Member
          </Button>
        </div>
      </div>

      {/* Enterprise Upgrade Banner (if on Starter or Pro) */}
      {isNotEnterprise && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md shrink-0">
              <Shield size={24} className="text-yellow-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                Unlock Organization Workspace & Centralized Administration
              </h3>
              <p className="text-xs text-purple-100/90 mt-1 max-w-xl">
                Team & Enterprise (₹799/mo) includes 25 active team seats, role-based access, card directory control, custom domain verification, audit logs, and verified SSO authentication.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            className="bg-white text-purple-900 hover:bg-purple-50 font-bold shrink-0 shadow-lg shadow-black/20"
            onClick={() => setShowPlanModal(true)}
          >
            Upgrade Workspace (₹799/mo)
          </Button>
        </div>
      )}

      {/* Workspace Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'members', label: `Team Members (${members.length}/${memberLimit})`, icon: Users },
          { id: 'cards', label: `Team Cards (${teamCards.length})`, icon: CreditCard },
          { id: 'domain', label: 'Custom Domain', icon: Globe },
          { id: 'sso', label: 'Enterprise SSO', icon: Key },
          { id: 'branding', label: 'Org Branding', icon: Sparkles },
          { id: 'audit', label: 'Audit Logs', icon: Clock },
          { id: 'support', label: `Support Tickets (${tickets.length})`, icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MEMBERS & INVITATIONS */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          {/* Seat Capacity Gauge */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 w-full sm:w-auto">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Configurable Seat Allocation
              </span>
              <div className="text-xl font-black text-slate-900 dark:text-slate-100">
                {members.length + invitations.filter(i => i.status === 'pending').length} / {memberLimit} Active Seats Provisioned
              </div>
            </div>
            <div className="w-full sm:w-64 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ((members.length + invitations.filter(i => i.status === 'pending').length) / memberLimit) * 100)}%` }}
              />
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Active Organization Members
              </h3>
              <span className="text-xs text-slate-400">
                {members.length} members
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-semibold">
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Workspace Role</th>
                    <th className="py-3 px-4">Cards</th>
                    <th className="py-3 px-4">Joined</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {m.name.charAt(0)}
                          </div>
                          <span>{m.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {m.email}
                      </td>
                      <td className="py-3.5 px-4">
                        {m.role === 'Owner' ? (
                          <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            Owner
                          </span>
                        ) : (
                          <select
                            value={m.role}
                            onChange={(e) => handleUpdateRole(m.id, e.target.value)}
                            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden"
                          >
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Employee">Employee</option>
                          </select>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {m.cardCount} Cards
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {m.joinedAt ? m.joinedAt.split('T')[0] : '2026-01-15'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {m.role !== 'Owner' && (
                          <button
                            onClick={() => handleRemoveMember(m.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg"
                            title="Remove Member"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Invitations Table */}
          {invitations.length > 0 && (
            <div className="bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Pending Invitations
                </h3>
                <span className="text-xs text-amber-600 font-semibold">
                  {invitations.filter(i => i.status === 'pending').length} pending
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-slate-500 font-semibold">
                      <th className="py-3 px-4">Invited Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Invited By</th>
                      <th className="py-3 px-4">Expires</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {invitations.map((inv) => (
                      <tr key={inv.id}>
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                          {inv.email}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                          {inv.role}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            inv.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                            inv.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {inv.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {inv.invitedByName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {inv.expiresAt.split('T')[0]}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {inv.status === 'pending' && (
                            <button
                              onClick={() => handleRevokeInvite(inv.id)}
                              className="text-xs text-red-600 font-semibold hover:underline"
                            >
                              Revoke
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TEAM CARDS DIRECTORY */}
      {activeTab === 'cards' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamCards.map((c) => (
              <div
                key={c.id}
                className={`p-5 rounded-3xl bg-white dark:bg-[#131924] border transition-all ${
                  c.isSuspended ? 'border-red-300 dark:border-red-900/50 bg-red-50/10' : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {c.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {c.role} • {c.company}
                    </p>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">
                      smartcard.app/{c.username}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.isSuspended
                      ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {c.isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span>{c.views || 0} Views</span>
                    <span>{c.scans || 0} Scans</span>
                  </div>
                  <Button
                    variant={c.isSuspended ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleCardSuspension(c.id, c.isSuspended)}
                  >
                    {c.isSuspended ? 'Activate Card' : 'Suspend Card'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOM DOMAIN CONFIGURATION */}
      {activeTab === 'domain' && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Custom Domain Connection & Verification
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Host your team's SmartCards directly on your organization's domain (e.g. <code>cards.apextech.io/alex</code>).
              </p>
            </div>
            {company?.customDomain?.status === 'verified' && (
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 shrink-0">
                <CheckCircle2 size={14} />
                <span>Verified & Connected</span>
              </span>
            )}
          </div>

          <form onSubmit={handleConfigureDomain} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                label="Custom Domain Host"
                placeholder="cards.yourcompany.com"
                value={customDomainInput}
                onChange={(e) => setCustomDomainInput(e.target.value)}
                className="font-mono text-xs"
              />
              <div className="flex items-end gap-2">
                <Button type="submit" variant="primary">
                  Save Domain
                </Button>
                {company?.customDomain && (
                  <Button type="button" variant="outline" onClick={handleRemoveDomain}>
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </form>

          {company?.customDomain && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                DNS Configuration Records Required
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-[#101622] rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Record 1: TXT (Ownership Verification)
                  </span>
                  <div className="font-mono text-[11px] text-slate-800 dark:text-slate-200 break-all">
                    {company.customDomain.targetRecord || `smartcard-site-verification=${company.customDomain.verificationToken}`}
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-[#101622] rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Record 2: CNAME (Traffic Routing)
                  </span>
                  <div className="font-mono text-[11px] text-slate-800 dark:text-slate-200">
                    cname.smartcard.app
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-500">
                  Status: <strong className="text-slate-900 dark:text-slate-100 uppercase">{company.customDomain.status}</strong>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  loading={verifyingDomain}
                  onClick={handleVerifyDomain}
                  icon={<RefreshCw size={14} />}
                >
                  Verify DNS Now
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ENTERPRISE SSO SETUP & VALIDATION */}
      {activeTab === 'sso' && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Single Sign-On (SSO) Authentication
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Enforce centralized corporate login via Google Workspace, Azure AD (Microsoft Entra), SAML 2.0, or OIDC.
              </p>
            </div>
            <span className={`px-3 py-1 font-bold text-xs rounded-full border ${
              company?.ssoConfig?.status === 'active'
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                : 'bg-amber-100 text-amber-700 border-amber-200'
            }`}>
              {company?.ssoConfig?.status === 'active' ? 'SSO ACTIVE' : 'UNCONFIGURED / SETUP'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {(['google', 'azure', 'saml', 'oidc'] as const).map((prov) => (
              <button
                key={prov}
                onClick={() => setSsoProvider(prov)}
                className={`p-3 rounded-xl border text-xs font-bold uppercase transition-all ${
                  ssoProvider === prov
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {prov === 'google' ? 'Google Workspace' : prov === 'azure' ? 'Azure AD / Entra' : prov === 'saml' ? 'SAML 2.0' : 'OpenID Connect'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <Input
              label={ssoProvider === 'google' ? 'Google OAuth Client ID (*.apps.googleusercontent.com)' : 'Application (Client) ID'}
              placeholder="e.g. 78291029384-k7djh839d.apps.googleusercontent.com"
              value={ssoClientId}
              onChange={(e) => setSsoClientId(e.target.value)}
            />
            <Input
              label="Client Secret / Signing Key"
              type="password"
              placeholder="••••••••••••••••••••"
              value={ssoClientSecret}
              onChange={(e) => setSsoClientSecret(e.target.value)}
            />
            {(ssoProvider === 'azure' || ssoProvider === 'saml' || ssoProvider === 'oidc') && (
              <Input
                label={ssoProvider === 'azure' ? 'Tenant / Issuer URL' : 'IdP Metadata URL / Issuer Endpoint'}
                placeholder="https://login.microsoftonline.com/<Tenant-ID>/v2.0"
                value={ssoIssuerUrl}
                onChange={(e) => setSsoIssuerUrl(e.target.value)}
              />
            )}
            <Input
              label="Domain Hint / Allowed Email Domain"
              placeholder="e.g. yourcompany.com"
              value={ssoDomainHint}
              onChange={(e) => setSsoDomainHint(e.target.value)}
            />
          </div>

          {ssoValidationResult && (
            <div className={`p-4 rounded-2xl text-xs font-semibold ${
              ssoValidationResult.valid
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 dark:bg-red-950/40 text-red-700 border border-red-200'
            }`}>
              {ssoValidationResult.valid ? 'Server validation passed: Provider parameters conform to standard specifications.' : ssoValidationResult.error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              loading={ssoValidating}
              onClick={handleValidateSSO}
            >
              Validate Server-Side
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveSSO}
            >
              Save SSO Settings
            </Button>
          </div>
        </div>
      )}

      {/* TAB 5: BRANDING */}
      {activeTab === 'branding' && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Organization Branding & Unified Identity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enforce corporate color schemes, verified member badges, and footer signatures across all employee cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Primary Brand Color (Hex)"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
            />
            <Input
              label="Unified Member Badge Text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
            />
          </div>

          <Button variant="primary" onClick={handleSaveBranding}>
            Save Organization Branding
          </Button>
        </div>
      )}

      {/* TAB 6: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Security & Administrative Audit Logs (MongoDB)
            </h3>
            <span className="text-xs text-slate-400">{auditLogs.length} events logged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-slate-500 font-semibold">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Administrator</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="font-mono text-[11px]">
                    <td className="py-3 px-4 text-slate-400">{log.timestamp.replace('T', ' ').substring(0, 19)}</td>
                    <td className="py-3 px-4 font-bold text-blue-600 dark:text-blue-400">{log.action}</td>
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200">{log.actorEmail}</td>
                    <td className="py-3 px-4 text-slate-500">{log.entityType}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 truncate max-w-xs">{JSON.stringify(log.details || {})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: SUPPORT TICKETS */}
      {activeTab === 'support' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Enterprise Support Request Workflow
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Submit and track support cases directly in MongoDB with priority escalation.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowTicketModal(true)}
              icon={<Plus size={14} />}
            >
              New Support Case
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((tkt) => (
              <div
                key={tkt.id}
                onClick={() => setActiveTicket(tkt)}
                className="p-5 rounded-3xl bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer transition-all space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">
                      {tkt.ticketNumber}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                      {tkt.subject}
                    </h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    tkt.status === 'open' ? 'bg-amber-100 text-amber-700' :
                    tkt.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {tkt.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Category: {tkt.category}</span>
                  <span>{tkt.messages.length} messages</span>
                </div>
              </div>
            ))}
          </div>

          {/* Active Ticket Thread View */}
          {activeTicket && (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#101622] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-600">{activeTicket.ticketNumber}</span>
                  <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">{activeTicket.subject}</h4>
                </div>
                <button onClick={() => setActiveTicket(null)} className="text-slate-400 hover:text-slate-600">
                  <XCircle size={18} />
                </button>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                {activeTicket.messages.map((m, idx) => (
                  <div key={idx} className="p-3 bg-white dark:bg-[#131924] rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span>{m.senderName} ({m.senderRole})</span>
                      <span>{m.createdAt.replace('T', ' ').substring(0, 16)}</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200">{m.message}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Input
                  placeholder="Type follow-up reply..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
                <Button variant="primary" onClick={handleSendReply} icon={<Send size={14} />}>
                  Reply
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#101622] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Invite Team Member
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400">
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <Input
                label="Member Work Email *"
                type="email"
                placeholder="colleague@yourcompany.com"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Assigned Workspace Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-hidden"
                >
                  <option value="Employee">Employee (View own cards and leads)</option>
                  <option value="Manager">Manager (View team cards and directory)</option>
                  <option value="Admin">Admin (Full administrative & domain permissions)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <Button type="button" variant="outline" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Support Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#101622] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Create Support Case
              </h3>
              <button onClick={() => setShowTicketModal(false)} className="text-slate-400">
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <Input
                label="Case Subject *"
                placeholder="Brief summary of issue"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                    className="w-full bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100"
                  >
                    <option value="technical">Technical</option>
                    <option value="sso">Enterprise SSO</option>
                    <option value="domain">Custom Domain</option>
                    <option value="billing">Billing & Seats</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as any)}
                    className="w-full bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-100"
                  placeholder="Provide complete steps, error messages, or requirements..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <Button type="button" variant="outline" onClick={() => setShowTicketModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Submit Support Ticket
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plan Switcher Modal */}
      <PlanSwitcherModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        currentPlan={userPlan}
        onPlanChanged={(p) => {
          setUserPlan(p);
          loadAllData();
        }}
      />
    </div>
  );
}
