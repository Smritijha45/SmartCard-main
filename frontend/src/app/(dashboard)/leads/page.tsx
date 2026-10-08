'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Search, Filter, ArrowUpDown, Plus, Download, 
  Mail, Phone, Calendar, Check, MoreVertical, 
  Trash2, MessageCircle, Building2, UserPlus, Grid, Table as TableIcon, X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  role: string;
  dateConnected: string;
  status: 'Active' | 'Follow-Up' | 'New Lead' | 'Partner' | 'Archived';
  notes: string;
  avatarColor: string;
}

const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c-1',
    name: 'Sarah Chen',
    company: 'Apex FinTech Solutions',
    email: 'sarah.chen@apexfin.io',
    phone: '+1 (415) 555-0192',
    role: 'VP of Product Engineering',
    dateConnected: '2026-10-04',
    status: 'New Lead',
    notes: 'Exchanged card at SaaS Summit 2026. Interested in 50 enterprise seat rollout.',
    avatarColor: '#2563EB',
  },
  {
    id: 'c-2',
    name: 'Michael Scott',
    company: 'Dunder Mifflin Paper Co.',
    email: 'michael.scott@dundermifflin.com',
    phone: '+1 (570) 555-0133',
    role: 'Regional Director',
    dateConnected: '2026-10-03',
    status: 'Active',
    notes: 'Met at regional business expo. Wants to replace all paper business cards.',
    avatarColor: '#F59E0B',
  },
  {
    id: 'c-3',
    name: 'Elena Rostova',
    company: 'Autonomous Neural Labs',
    email: 'elena@neurallabs.ai',
    phone: '+44 20 7946 0912',
    role: 'Lead AI Research Scientist',
    dateConnected: '2026-10-02',
    status: 'Follow-Up',
    notes: 'Discussed API integrations and biometric card security protocols.',
    avatarColor: '#10B981',
  },
  {
    id: 'c-4',
    name: 'David Kim',
    company: 'Benchmark Horizon Ventures',
    email: 'david.kim@horizonvc.com',
    phone: '+1 (650) 555-0177',
    role: 'Managing Partner',
    dateConnected: '2026-09-29',
    status: 'Partner',
    notes: 'Interested in leading upcoming Series A syndicate.',
    avatarColor: '#8B5CF6',
  },
  {
    id: 'c-5',
    name: 'Jessica Taylor',
    company: 'Stripe Studio',
    email: 'jessica.taylor@studio.design',
    phone: '+1 (212) 555-0144',
    role: 'Head of Brand & Interaction',
    dateConnected: '2026-09-27',
    status: 'Active',
    notes: 'Collaborating on co-marketing design system showcase.',
    avatarColor: '#EC4899',
  },
  {
    id: 'c-6',
    name: 'Marcus Aurelius',
    company: 'Stoic Cloud Infrastructure',
    email: 'marcus@stoiccloud.io',
    phone: '+1 (312) 555-0188',
    role: 'Chief Technology Officer',
    dateConnected: '2026-09-25',
    status: 'Follow-Up',
    notes: 'Requires SOC2 Type II compliance audit packet.',
    avatarColor: '#06B6D4',
  },
  {
    id: 'c-7',
    name: 'Priya Sharma',
    company: 'RazorPay Identity',
    email: 'priya.sharma@razoridentity.in',
    phone: '+91 98765 43210',
    role: 'Principal Architect',
    dateConnected: '2026-09-20',
    status: 'Active',
    notes: 'Zero NFC rollout partner for APAC operations.',
    avatarColor: '#10B981',
  }
];

export default function LeadsPage() {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'name-asc' | 'company-asc'>('date-desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [newContact, setNewContact] = useState<{
    name: string;
    company: string;
    email: string;
    phone: string;
    role: string;
    status: Contact['status'];
    notes: string;
  }>({
    name: '',
    company: '',
    email: '',
    phone: '',
    role: '',
    status: 'New Lead',
    notes: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smartcard_contacts');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setContacts(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const saveContactsState = (updated: Contact[]) => {
    setContacts(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('smartcard_contacts', JSON.stringify(updated));
    }
  };

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredAndSortedContacts = useMemo(() => {
    let result = [...contacts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(c => c.status === statusFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.dateConnected).getTime() - new Date(a.dateConnected).getTime();
        case 'date-asc':
          return new Date(a.dateConnected).getTime() - new Date(b.dateConnected).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'company-asc':
          return a.company.localeCompare(b.company);
        default:
          return 0;
      }
    });

    return result;
  }, [contacts, search, statusFilter, sortBy]);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.email) return;

    const colors = ['#2563EB', '#06B6D4', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const created: Contact = {
      id: `c-${Date.now()}`,
      name: newContact.name,
      company: newContact.company || 'Independent',
      email: newContact.email,
      phone: newContact.phone || '+1 (555) 000-0000',
      role: newContact.role || 'Contact',
      dateConnected: new Date().toISOString().slice(0, 10),
      status: newContact.status,
      notes: newContact.notes || 'Added to SmartCard contacts',
      avatarColor: randomColor,
    };

    const updated = [created, ...contacts];
    saveContactsState(updated);
    setShowAddModal(false);
    setNewContact({
      name: '',
      company: '',
      email: '',
      phone: '',
      role: '',
      status: 'New Lead',
      notes: '',
    });
    showNotification(`Contact added: ${created.name}`);
  };

  const handleDeleteContact = (id: string, name: string) => {
    if (confirm(`Remove ${name} from your contacts?`)) {
      const updated = contacts.filter(c => c.id !== id);
      saveContactsState(updated);
      showNotification(`Contact ${name} deleted.`);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: Contact['status']) => {
    const updated = contacts.map(c => c.id === id ? { ...c, status: newStatus } : c);
    saveContactsState(updated);
    showNotification('Contact status updated');
  };

  const handleExportCSV = () => {
    if (!contacts.length) return;
    const headers = ['Name', 'Company', 'Email', 'Phone', 'Role', 'Date Connected', 'Status', 'Notes'];
    const rows = contacts.map(c => [
      `"${c.name}"`,
      `"${c.company}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      `"${c.role}"`,
      `"${c.dateConnected}"`,
      `"${c.status}"`,
      `"${c.notes.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartcard_contacts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Contacts CSV downloaded successfully');
  };

  const getStatusBadge = (status: Contact['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40';
      case 'Follow-Up':
        return 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40';
      case 'New Lead':
        return 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40';
      case 'Partner':
        return 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/40';
      case 'Archived':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-subtle-fade">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white dark:bg-[#131924] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md">
              CRM &amp; Inbound Leads
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {contacts.length} Total Connections
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Contacts &amp; Leads
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            People who connected with you and exchanged details via your SmartCard profiles.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
          >
            <Download size={13} />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus size={14} />
            <span>Add Contact</span>
          </Button>
        </div>
      </div>

      {/* Control Bar: Search, Filter, Sort, View Toggle */}
      <div className="bg-white dark:bg-[#131924] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, company, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 h-9 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Controls: Filter, Sort, View Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Filter by Status */}
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-2 h-9">
              <Filter size={13} className="text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-white dark:bg-[#131924]">All Statuses</option>
                <option value="Active" className="bg-white dark:bg-[#131924]">Active</option>
                <option value="Follow-Up" className="bg-white dark:bg-[#131924]">Follow-Up</option>
                <option value="New Lead" className="bg-white dark:bg-[#131924]">New Lead</option>
                <option value="Partner" className="bg-white dark:bg-[#131924]">Partner</option>
                <option value="Archived" className="bg-white dark:bg-[#131924]">Archived</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-2 h-9">
              <ArrowUpDown size={13} className="text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="date-desc" className="bg-white dark:bg-[#131924]">Date (Newest)</option>
                <option value="date-asc" className="bg-white dark:bg-[#131924]">Date (Oldest)</option>
                <option value="name-asc" className="bg-white dark:bg-[#131924]">Name (A → Z)</option>
                <option value="company-asc" className="bg-white dark:bg-[#131924]">Company (A → Z)</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/60 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Table View"
              >
                <TableIcon size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'cards' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Cards View"
              >
                <Grid size={14} />
              </button>
            </div>

          </div>

        </div>

        {/* Quick Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-400 text-xs">Filter:</span>
          {['All', 'Active', 'Follow-Up', 'New Lead', 'Partner', 'Archived'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all border cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                  : 'bg-white dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
          <span className="text-slate-400 ml-auto text-xs">
            {filteredAndSortedContacts.length} of {contacts.length}
          </span>
        </div>

      </div>

      {/* EMPTY STATE */}
      {filteredAndSortedContacts.length === 0 ? (
        <div className="bg-white dark:bg-[#131924] rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs space-y-3">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl mx-auto flex items-center justify-center">
            <Users size={24} />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">No contacts found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            No contacts match &quot;{search || statusFilter}&quot;. Try adjusting your search query or reset your filter.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setSearch(''); setStatusFilter('All'); }}
          >
            Clear Filters
          </Button>
        </div>
      ) : viewMode === 'table' ? (
        
        /* TABLE VIEW */
        <div className="bg-white dark:bg-[#131924] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 dark:bg-slate-900/50 text-[11px] uppercase text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3 text-slate-700 dark:text-slate-300">Name &amp; Role</th>
                  <th className="px-5 py-3 text-slate-700 dark:text-slate-300">Company</th>
                  <th className="px-5 py-3 text-slate-700 dark:text-slate-300">Email &amp; Phone</th>
                  <th className="px-5 py-3 text-slate-700 dark:text-slate-300">Date Connected</th>
                  <th className="px-5 py-3 text-slate-700 dark:text-slate-300">Status</th>
                  <th className="px-5 py-3 text-right text-slate-700 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAndSortedContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* Name */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs text-white uppercase shrink-0"
                          style={{ backgroundColor: contact.avatarColor }}
                        >
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-xs text-slate-900 dark:text-slate-100">{contact.name}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{contact.role}</p>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{contact.company}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{contact.notes}</p>
                    </td>

                    {/* Email & Phone */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <a href={`mailto:${contact.email}`} className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 block transition-colors">
                        {contact.email}
                      </a>
                      <span className="text-[11px] text-slate-400">{contact.phone}</span>
                    </td>

                    {/* Date Connected */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-slate-400" />
                        <span>{new Date(contact.dateConnected).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <select
                        value={contact.status}
                        onChange={(e) => handleUpdateStatus(contact.id, e.target.value as any)}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border cursor-pointer focus:outline-none ${getStatusBadge(contact.status)}`}
                      >
                        <option value="Active" className="bg-white dark:bg-[#131924] text-slate-900 dark:text-slate-100">Active</option>
                        <option value="Follow-Up" className="bg-white dark:bg-[#131924] text-slate-900 dark:text-slate-100">Follow-Up</option>
                        <option value="New Lead" className="bg-white dark:bg-[#131924] text-slate-900 dark:text-slate-100">New Lead</option>
                        <option value="Partner" className="bg-white dark:bg-[#131924] text-slate-900 dark:text-slate-100">Partner</option>
                        <option value="Archived" className="bg-white dark:bg-[#131924] text-slate-900 dark:text-slate-100">Archived</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`mailto:${contact.email}`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Send Email"
                        >
                          <Mail size={13} />
                        </a>
                        <a
                          href={`https://api.whatsapp.com/send?phone=${contact.phone.replace(/\D/g, '')}&text=${encodeURIComponent(`Hi ${contact.name}, great connecting with you via SmartCard!`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="WhatsApp Chat"
                        >
                          <MessageCircle size={13} />
                        </a>
                        <button
                          onClick={() => handleDeleteContact(contact.id, contact.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete Contact"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      ) : (

        /* CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedContacts.map((contact) => (
            <div 
              key={contact.id}
              className="bg-white dark:bg-[#131924] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header with Avatar & Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm text-white uppercase shrink-0"
                      style={{ backgroundColor: contact.avatarColor }}
                    >
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                        {contact.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {contact.role}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadge(contact.status)}`}>
                    {contact.status}
                  </span>
                </div>

                {/* Company & Details */}
                <div className="space-y-1.5 mb-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800 dark:text-slate-200">
                    <Building2 size={13} className="text-slate-400 shrink-0" />
                    <span>{contact.company}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {contact.email}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {contact.phone}
                  </div>
                </div>

                {/* Notes */}
                {contact.notes && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed line-clamp-2">
                    &quot;{contact.notes}&quot;
                  </p>
                )}
              </div>

              {/* Bottom Footer: Date & Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  {contact.dateConnected}
                </span>

                <div className="flex items-center gap-1">
                  <a
                    href={`mailto:${contact.email}`}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Mail size={13} />
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?phone=${contact.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <MessageCircle size={13} />
                  </a>
                  <button
                    onClick={() => handleDeleteContact(contact.id, contact.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-subtle-fade">
          <div className="w-full max-w-md bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Add New Contact</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Record a connection in your workspace CRM.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Full Name *</label>
                <Input
                  required
                  placeholder="e.g. Jordan Lee"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Company</label>
                  <Input
                    placeholder="e.g. Acme Corp"
                    value={newContact.company}
                    onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Job Title</label>
                  <Input
                    placeholder="e.g. VP Sales"
                    value={newContact.role}
                    onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Email *</label>
                  <Input
                    type="email"
                    required
                    placeholder="jordan@acme.com"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Phone</label>
                  <Input
                    type="tel"
                    placeholder="+1 555 123 4567"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Status</label>
                <select
                  value={newContact.status}
                  onChange={(e) => setNewContact({ ...newContact, status: e.target.value as any })}
                  className="w-full h-10 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-xs text-slate-900 dark:text-slate-100"
                >
                  <option value="New Lead">New Lead</option>
                  <option value="Active">Active</option>
                  <option value="Follow-Up">Follow-Up</option>
                  <option value="Partner">Partner</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Where did you connect? Key takeaways..."
                  value={newContact.notes}
                  onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-9.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 h-9.5 text-xs font-medium"
                >
                  Save Contact
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Success Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl text-xs font-medium shadow-lg flex items-center gap-2 animate-subtle-fade">
          <Check size={14} className="text-emerald-400 dark:text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
