'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, Users, CreditCard, Shield, Globe, Lock, FileText, 
  Plus, Check, AlertTriangle, Eye, ArrowRight, Download, Search, 
  Trash2, RefreshCw, Key, MessageSquare, CheckCircle2, ChevronRight, UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EnterpriseDashboardProps {
  user: any;
  company: any;
  members: any[];
  auditLogs: any[];
  onInviteMember: (email: string, role: string) => Promise<void>;
  onUpdateMemberRole: (memberId: string, newRole: string) => Promise<void>;
  onSuspendCard: (cardId: string, suspend: boolean) => Promise<void>;
  onVerifyDomain: () => Promise<void>;
  onOpenPlanSwitcher: () => void;
}

export function EnterpriseDashboard({
  user,
  company,
  members = [],
  auditLogs = [],
  onInviteMember,
  onUpdateMemberRole,
  onSuspendCard,
  onVerifyDomain,
  onOpenPlanSwitcher,
}: EnterpriseDashboardProps) {
  const [memberSearch, setMemberSearch] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Employee');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [domainInput, setDomainInput] = useState(company?.customDomain || 'cards.apex.io');
  const [isVerifyingDomain, setIsVerifyingDomain] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const memberLimit = company?.memberLimit || 25;
  const currentMembersCount = members.length || 14;
  const seatUtilization = Math.round((currentMembersCount / memberLimit) * 100);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setIsInviting(true);
    try {
      await onInviteMember(inviteEmail, inviteRole);
      setInviteEmail('');
      setShowInviteModal(false);
      showToast(`Invitation sent to ${inviteEmail}!`);
    } catch {
      showToast('Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleDomainVerifyClick = async () => {
    setIsVerifyingDomain(true);
    try {
      await onVerifyDomain();
      showToast('Domain verification check initiated');
    } catch {
      showToast('Domain verification failed');
    } finally {
      setIsVerifyingDomain(false);
    }
  };

  const filteredMembers = members.filter(m => 
    !memberSearch ||
    (m.name && m.name.toLowerCase().includes(memberSearch.toLowerCase())) ||
    (m.email && m.email.toLowerCase().includes(memberSearch.toLowerCase())) ||
    (m.role && m.role.toLowerCase().includes(memberSearch.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. ENTERPRISE WORKSPACE HEADER */}
      <div className="bg-white dark:bg-[#131924] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-900 flex items-center gap-1">
                <Building2 size={12} />
                Organization Workspace
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {company?.name || 'Apex Technologies Workspace'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Team &amp; Enterprise Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Centralized team card provisioning, role assignments, audit logs, and custom domain routing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowInviteModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-10 px-4 shadow-xs flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Invite Team Member</span>
            </Button>

            <Link href="/team">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 dark:border-slate-700 text-xs font-semibold h-10 px-4"
              >
                <Users size={14} />
                <span>Full Team Console</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Seat Utilization Gauge */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2 font-semibold">
            <span className="text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Users size={14} className="text-purple-600 dark:text-purple-400" />
              Member Seats Allocation: {currentMembersCount} of {memberLimit} Seats Used ({seatUtilization}%)
            </span>
            <span className="text-slate-400">{memberLimit - currentMembersCount} Available Seats</span>
          </div>

          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${seatUtilization}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. FOUR ORGANIZATION-WIDE KPIS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-[#131924] border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Team Members</span>
            <Users size={14} className="text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {currentMembersCount}
          </div>
          <span className="text-[11px] text-slate-400">{memberLimit} seat limit</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#131924] border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active Employee Cards</span>
            <CreditCard size={14} className="text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {currentMembersCount}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">100% Provisioned</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#131924] border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Org-Wide Views</span>
            <Eye size={14} className="text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            8,420
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">+32% vs last month</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#131924] border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Centralized Leads</span>
            <FileText size={14} className="text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            348
          </div>
          <span className="text-[11px] text-slate-400">Team-wide capture</span>
        </div>

      </div>

      {/* 3. TEAM DIRECTORY & ROLE MANAGEMENT TABLE */}
      <div className="bg-white dark:bg-[#131924] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <UserCheck size={18} className="text-purple-600" />
              <span>Team Member Directory &amp; RBAC</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Assign roles, manage cards, and control administrative access.
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="Search team members..."
              className="w-full h-9 pl-9 pr-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-semibold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-3.5 pl-4">Member Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">Card Status</th>
                <th className="p-3.5 pr-4 text-right">Role Mutation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMembers.slice(0, 6).map((m, i) => (
                <tr key={m.id || i} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40 transition-colors">
                  <td className="p-3.5 pl-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xs">
                      {m.name ? m.name.charAt(0) : 'U'}
                    </div>
                    <span>{m.name || 'Member'}</span>
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">{m.email}</td>
                  <td className="p-3.5">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {m.role || 'Employee'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Active Card
                    </span>
                  </td>
                  <td className="p-3.5 pr-4 text-right">
                    <select
                      value={m.role || 'Employee'}
                      onChange={(e) => onUpdateMemberRole(m.id, e.target.value)}
                      className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                    >
                      <option value="Employee">Employee</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">Admin</option>
                      <option value="Owner">Owner</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. CUSTOM DOMAIN & AUDIT LOGS DUAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 6 cols: Custom Domain Verification */}
        <div className="lg:col-span-6 bg-white dark:bg-[#131924] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Globe size={16} className="text-blue-600" />
              <span>Custom Domain DNS Routing</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Serve employee cards under your organization brand (e.g. cards.apex.io).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Custom Domain</span>
              <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200">
                {company?.domainStatus === 'verified' ? 'Verified' : 'Verification Required'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="cards.company.com"
                className="flex-1 h-9 px-3 bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-mono"
              />
              <Button
                variant="primary"
                size="sm"
                loading={isVerifyingDomain}
                onClick={handleDomainVerifyClick}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 px-4"
              >
                Verify DNS
              </Button>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] space-y-1 text-slate-500">
              <p className="font-semibold text-slate-700 dark:text-slate-300">Required DNS Records:</p>
              <div className="font-mono bg-white dark:bg-slate-950 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800">
                TXT: smartcard-verify=apex_org_token_9918<br />
                CNAME: cname.smartcard.app
              </div>
            </div>
          </div>
        </div>

        {/* Right 6 cols: Administrative Audit Logs */}
        <div className="lg:col-span-6 bg-white dark:bg-[#131924] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Shield size={16} className="text-emerald-600" />
              <span>MongoDB Administrative Audit Logs</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Immutable ledger of sensitive operations and role mutations.
            </p>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 text-xs">
            {auditLogs.slice(0, 4).map((log, i) => (
              <div
                key={log.id || i}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {log.action || 'Role Updated'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    By {log.actorName || 'Admin'} • IP: {log.ipAddress || '127.0.0.1'}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#131924] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">Invite Team Member</h4>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Work Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  required
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Initial Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  <option value="Employee">Employee (Card Only)</option>
                  <option value="Manager">Manager (Lead &amp; Analytics Access)</option>
                  <option value="Admin">Admin (Full Team Console)</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={isInviting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-10 mt-2"
              >
                Send Workspace Invitation
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 rounded-xl text-xs font-medium shadow-xl flex items-center gap-2">
          <CheckCircle2 size={15} className="text-emerald-400 dark:text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
export default EnterpriseDashboard;
