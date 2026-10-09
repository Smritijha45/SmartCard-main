'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Search, Filter, ArrowUpDown, Plus, Download, 
  Mail, Phone, Calendar, Check, MoreVertical, 
  Trash2, MessageCircle, Building2, UserPlus, Grid, Table as TableIcon, X,
  Sparkles, FileText, ArrowRight, Shield, CheckCircle2, Clock, HelpCircle, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PlanSwitcherModal } from '@/components/PlanSwitcherModal';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';

export interface Lead {
  id: string;
  _id?: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  role?: string;
  cardId?: string;
  cardName?: string;
  dateConnected: string;
  status: LeadStatus;
  notes?: string;
  score?: number;
  eventTag?: string;
  source?: string;
  avatarColor?: string;
}

const STATUS_OPTIONS: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

const STATUS_BADGES: Record<LeadStatus, { label: string; color: string; bg: string; border: string }> = {
  New: {
    label: 'New Lead',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    border: 'border-blue-200 dark:border-blue-800'
  },
  Contacted: {
    label: 'Contacted',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    border: 'border-amber-200 dark:border-amber-800'
  },
  Qualified: {
    label: 'Qualified',
    color: 'text-purple-700 dark:text-purple-300',
    bg: 'bg-purple-50 dark:bg-purple-950/50',
    border: 'border-purple-200 dark:border-purple-800'
  },
  Converted: {
    label: 'Converted',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    border: 'border-emerald-200 dark:border-emerald-800'
  },
  Lost: {
    label: 'Lost',
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-800/60',
    border: 'border-slate-200 dark:border-slate-700'
  }
};

const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Marcus Brody',
    company: 'Andreessen Capital',
    email: 'marcus@andreessen.com',
    phone: '+1 415 889 1234',
    role: 'Design Partner',
    cardName: 'Smriti Jha',
    dateConnected: '2026-10-05',
    status: 'Qualified',
    notes: 'Met at SaaS Global Summit. Discussed rolling out SmartCard to 200 portfolio executives.',
    score: 95,
    eventTag: 'SaaS Global Summit 2026',
    source: 'public_card',
    avatarColor: '#2563EB'
  },
  {
    id: 'lead-2',
    name: 'Elena Rostova',
    company: 'Horizon Growth',
    email: 'elena.r@horizongrowth.io',
    phone: '+1 650 334 9912',
    role: 'Managing Director',
    cardName: 'Alex Morgan',
    dateConnected: '2026-10-04',
    status: 'Contacted',
    notes: 'Interested in enterprise seat provisioning and custom domain cards for sales team.',
    score: 91,
    eventTag: 'Founders Dinner SF',
    source: 'qr_scan',
    avatarColor: '#10B981'
  },
  {
    id: 'lead-3',
    name: 'Kiran Patel',
    company: 'Veloce Tech',
    email: 'kiran@velocetech.com',
    phone: '+1 206 555 7788',
    role: 'Head of People Ops',
    cardName: 'Sarah Chen',
    dateConnected: '2026-10-02',
    status: 'New',
    notes: 'Wants employee directory sync and vCard auto-save for all new hires.',
    score: 84,
    eventTag: 'Tech HR Expo',
    source: 'public_card',
    avatarColor: '#F59E0B'
  },
  {
    id: 'lead-4',
    name: 'Sofia Martinez',
    company: 'Lumina AI',
    email: 'sofia@lumina.ai',
    phone: '+1 312 555 4321',
    role: 'Founder & CEO',
    cardName: 'Devon Vance',
    dateConnected: '2026-09-28',
    status: 'Converted',
    notes: 'Loved the fast camera QR scan experience. Completed annual enterprise contract.',
    score: 88,
    eventTag: 'AI Builders Meetup',
    source: 'qr_scan',
    avatarColor: '#8B5CF6'
  },
  {
    id: 'lead-5',
    name: 'Vikram Sethi',
    company: 'CloudScale Asia',
    email: 'vikram@cloudscale.net',
    phone: '+91 99887 76655',
    role: 'Procurement Specialist',
    cardName: 'Smriti Jha',
    dateConnected: '2026-09-20',
    status: 'Lost',
    notes: 'Requested budget approval for next fiscal year.',
    score: 62,
    eventTag: 'Bangalore Tech Summit',
    source: 'direct_link',
    avatarColor: '#64748B'
  }
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [cardFilter, setCardFilter] = useState<string>('All');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'score-desc' | 'name-asc'>('date-desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [userPlan, setUserPlan] = useState<string>('professional');
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // New Lead Form
  const [newLead, setNewLead] = useState<{
    name: string;
    email: string;
    phone: string;
    company: string;
    role: string;
    notes: string;
    eventTag: string;
    status: LeadStatus;
  }>({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    notes: '',
    eventTag: '',
    status: 'New'
  });

  const fetchLeads = async () => {
    setLoading(true);
    try {
      // Check user plan
      const userRes = await fetch('/api/auth/me');
      if (userRes.ok) {
        const userData = await userRes.json();
        setUserPlan(userData.subscriptionPlan || 'professional');
      }

      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        if (list.length > 0) {
          const mapped: Lead[] = list.map((item: any, idx: number) => ({
            id: item._id || item.id || `lead-${idx}`,
            _id: item._id || item.id,
            name: item.name || 'Connection',
            company: item.company || 'Enterprise',
            email: item.email || '',
            phone: item.phone || '',
            role: item.role || 'Contact',
            cardName: item.cardId?.name || item.cardName || 'SmartCard Profile',
            cardId: item.cardId?._id || item.cardId || undefined,
            dateConnected: item.createdAt ? item.createdAt.split('T')[0] : '2026-10-01',
            status: (item.status as LeadStatus) || 'New',
            notes: item.notes || '',
            score: item.score || 80,
            eventTag: item.eventTag || '',
            source: item.source || 'public_card',
            avatarColor: item.avatarColor || ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6'][idx % 4]
          }));
          setLeads(mapped);
        }
      }
    } catch {
      // Use fallback leads
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    // Optimistic update
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    showNotification(`Lead moved to "${newStatus}"`);

    try {
      await fetch(`/api/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // Revert if error
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    setLeads(prev => prev.filter(l => l.id !== leadId));
    showNotification('Lead deleted successfully');

    try {
      await fetch(`/api/leads/${leadId}`, { method: 'DELETE' });
    } catch {
      // Ignore
    }
  };

  const handleCaptureLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name) return;

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newLead,
          cardId: 'smriti-default-card',
          source: 'manual_entry'
        }),
      });

      if (res.ok) {
        showNotification('Lead added to MongoDB & CRM dashboard!');
        setShowCaptureModal(false);
        setNewLead({
          name: '',
          email: '',
          phone: '',
          company: '',
          role: '',
          notes: '',
          eventTag: '',
          status: 'New'
        });
        fetchLeads();
      }
    } catch {
      showNotification('Failed to save lead');
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    showNotification(`Exporting leads to ${format.toUpperCase()}...`);
    try {
      const res = await fetch(`/api/leads/export?format=${format}&status=${statusFilter}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartcard-leads-${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showNotification(`Downloaded ${format.toUpperCase()} export file!`);
      }
    } catch {
      // Local fallback export
      if (format === 'json') {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredLeads, null, 2));
        const dl = document.createElement('a');
        dl.setAttribute("href", dataStr);
        dl.setAttribute("download", `smartcard-leads-${Date.now()}.json`);
        dl.click();
      } else {
        const headers = ['Name', 'Email', 'Phone', 'Company', 'Role', 'Status', 'Score', 'Date'];
        const rows = filteredLeads.map(l => [
          `"${l.name}"`, `"${l.email || ''}"`, `"${l.phone || ''}"`, `"${l.company || ''}"`,
          `"${l.role || ''}"`, `"${l.status}"`, l.score || 0, `"${l.dateConnected}"`
        ]);
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
        const dl = document.createElement('a');
        dl.setAttribute("href", dataStr);
        dl.setAttribute("download", `smartcard-leads-${Date.now()}.csv`);
        dl.click();
      }
    }
  };

  // Status Metrics
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { All: leads.length, New: 0, Contacted: 0, Qualified: 0, Converted: 0, Lost: 0 };
    leads.forEach(l => {
      if (counts[l.status] !== undefined) counts[l.status] += 1;
    });
    return counts;
  }, [leads]);

  // Filtering & Sorting
  const filteredLeads = useMemo(() => {
    let result = [...leads];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.name.toLowerCase().includes(q) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.company && l.company.toLowerCase().includes(q)) ||
        (l.role && l.role.toLowerCase().includes(q)) ||
        (l.eventTag && l.eventTag.toLowerCase().includes(q)) ||
        (l.notes && l.notes.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(l => l.status === statusFilter);
    }

    if (cardFilter !== 'All') {
      result = result.filter(l => l.cardName === cardFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.dateConnected).getTime() - new Date(a.dateConnected).getTime();
      if (sortBy === 'date-asc') return new Date(a.dateConnected).getTime() - new Date(b.dateConnected).getTime();
      if (sortBy === 'score-desc') return (b.score || 0) - (a.score || 0);
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [leads, search, statusFilter, cardFilter, sortBy]);

  // Paginated slice
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage]);

  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;

  const isStarter = userPlan === 'starter';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4">
          <CheckCircle2 size={16} className="text-emerald-400 dark:text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              CRM Leads Management
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {leads.length} Total Captured
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track, qualify, and convert inbound contacts captured via digital business card QR scans & forms.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('csv')}
            icon={<Download size={14} />}
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('json')}
            icon={<FileText size={14} />}
          >
            Export JSON
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCaptureModal(true)}
            icon={<Plus size={14} />}
          >
            Capture Lead
          </Button>
        </div>
      </div>

      {/* Starter Plan Warning Banner */}
      {isStarter && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                CRM Leads Feature is on Starter Preview Mode
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                On the Starter plan, inbound lead capture forms and lead export are locked. Upgrade to Professional (₹199/mo) to collect leads from all QR scans.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowPlanModal(true)}
            className="shrink-0 bg-amber-600 hover:bg-amber-700"
          >
            Upgrade for ₹199
          </Button>
        </div>
      )}

      {/* Status Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {(['All', 'New', 'Contacted', 'Qualified', 'Converted', 'Lost'] as const).map((st) => {
          const isSelected = statusFilter === st;
          const count = statusCounts[st] || 0;
          return (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`p-3.5 rounded-2xl text-left border transition-all duration-150 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131924] hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                <span>{st === 'All' ? 'All Leads' : st}</span>
                {st !== 'All' && (
                  <span className={`w-2 h-2 rounded-full ${
                    st === 'New' ? 'bg-blue-500' :
                    st === 'Contacted' ? 'bg-amber-500' :
                    st === 'Qualified' ? 'bg-purple-500' :
                    st === 'Converted' ? 'bg-emerald-500' : 'bg-slate-400'
                  }`} />
                )}
              </div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                {count}
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search by name, email, company, event..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            icon={<Search size={16} />}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap justify-end">
          {/* Card Filter */}
          <select
            value={cardFilter}
            onChange={(e) => {
              setCardFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="All">All Digital Cards</option>
            <option value="Smriti Jha">Smriti Jha Card</option>
            <option value="Alex Morgan">Alex Morgan Card</option>
            <option value="Sarah Chen">Sarah Chen Card</option>
            <option value="Devon Vance">Devon Vance Card</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="score-desc">Highest Lead Score</option>
            <option value="name-asc">Alphabetical (Name)</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl p-0.5 bg-slate-50 dark:bg-slate-800/80">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs ${
                viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs' : 'text-slate-400'
              }`}
            >
              <TableIcon size={15} />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs ${
                viewMode === 'cards' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs' : 'text-slate-400'
              }`}
            >
              <Grid size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Leads Content */}
      {filteredLeads.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 rounded-3xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
            <Users size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">No leads found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {search ? 'Try adjusting your search filters or status criteria.' : 'Share your digital card or scan QR code to capture inbound leads.'}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Organization & Role</th>
                  <th className="py-3.5 px-4">Card / Event Tag</th>
                  <th className="py-3.5 px-4">Lead Status</th>
                  <th className="py-3.5 px-4">Score</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {paginatedLeads.map((lead) => {
                  const badge = STATUS_BADGES[lead.status] || STATUS_BADGES.New;
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0"
                            style={{ backgroundColor: lead.avatarColor || '#2563EB' }}
                          >
                            {lead.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-slate-100 block">
                              {lead.name}
                            </span>
                            <span className="text-[11px] text-slate-400 block">
                              {lead.email || lead.phone || 'No direct email'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-800 dark:text-slate-200 block">
                          {lead.company || 'Individual'}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          {lead.role || 'Executive'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-700 dark:text-slate-300 font-medium block">
                          {lead.cardName}
                        </span>
                        {lead.eventTag && (
                          <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {lead.eventTag}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-hidden cursor-pointer ${badge.bg} ${badge.color} ${badge.border}`}
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                (lead.score || 0) > 85 ? 'bg-emerald-500' :
                                (lead.score || 0) > 70 ? 'bg-blue-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${lead.score || 75}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            {lead.score || 75}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                        {lead.dateConnected}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                              className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Send Email"
                            >
                              <Mail size={14} />
                            </a>
                          )}
                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone}`}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Call Phone"
                            >
                              <Phone size={14} />
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Delete Lead"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div>
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredLeads.length)} of {filteredLeads.length} leads
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                >
                  Previous
                </Button>
                <div className="px-3 py-1 font-semibold text-slate-900 dark:text-slate-100">
                  {currentPage} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedLeads.map((lead) => {
            const badge = STATUS_BADGES[lead.status] || STATUS_BADGES.New;
            return (
              <div
                key={lead.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-xs"
                      style={{ backgroundColor: lead.avatarColor || '#2563EB' }}
                    >
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {lead.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {lead.role} • {lead.company}
                      </p>
                    </div>
                  </div>
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border focus:outline-hidden ${badge.bg} ${badge.color} ${badge.border}`}
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {lead.notes && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 italic">
                    "{lead.notes}"
                  </p>
                )}

                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {lead.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-slate-400" />
                      <a href={`mailto:${lead.email}`} className="hover:text-blue-600 truncate">
                        {lead.email}
                      </a>
                    </div>
                  )}
                  {lead.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-slate-400" />
                      <a href={`tel:${lead.phone}`} className="hover:text-blue-600">
                        {lead.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Card: {lead.cardName}</span>
                    <span>{lead.dateConnected}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inbound Lead Capture Test Modal */}
      {showCaptureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#101622] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Capture Inbound Lead
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct lead capture simulation for your digital card.
                </p>
              </div>
              <button
                onClick={() => setShowCaptureModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCaptureLead} className="space-y-4">
              <Input
                label="Full Name *"
                placeholder="e.g. Maya Lin"
                required
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="maya@example.com"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                />
                <Input
                  label="Phone Number"
                  placeholder="+1 555 0192"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Company / Organization"
                  placeholder="Acme Corp"
                  value={newLead.company}
                  onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                />
                <Input
                  label="Job Title / Role"
                  placeholder="VP Product"
                  value={newLead.role}
                  onChange={(e) => setNewLead({ ...newLead, role: e.target.value })}
                />
              </div>
              <Input
                label="Event Tag / Source"
                placeholder="e.g. SaaS Summit 2026"
                value={newLead.eventTag}
                onChange={(e) => setNewLead({ ...newLead, eventTag: e.target.value })}
              />
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Meeting Notes / Context
                </label>
                <textarea
                  className="w-full bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  rows={3}
                  placeholder="Key talking points, deal size, or next steps..."
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCaptureModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Lead to MongoDB
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
          fetchLeads();
        }}
      />
    </div>
  );
}
