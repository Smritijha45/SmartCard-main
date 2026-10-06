'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Search, Filter, ArrowUpDown, Plus, Download, 
  Mail, Phone, ExternalLink, Calendar, Check, MoreVertical, 
  Trash2, MessageCircle, Building2, UserPlus, Grid, Table as TableIcon, X
} from 'lucide-react';

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
    phone: '+91 98200 55123',
    role: 'Director of Partnerships',
    dateConnected: '2026-09-20',
    status: 'Partner',
    notes: 'Exploring APAC distribution and WhatsApp card sync.',
    avatarColor: '#10B981',
  },
  {
    id: 'c-8',
    name: 'Lucas Vance',
    company: 'Vance Refrigeration Systems',
    email: 'lucas@vancerefrig.com',
    phone: '+1 (570) 555-0199',
    role: 'Operations VP',
    dateConnected: '2026-09-14',
    status: 'Archived',
    notes: 'Initial evaluation completed. Follow up next fiscal quarter.',
    avatarColor: '#64748B',
  },
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'name-asc' | 'company-asc'>('date-desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New Contact Form State
  const [newContact, setNewContact] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    role: '',
    status: 'New Lead' as const,
    notes: '',
  });

  // Load from localStorage or API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('smartcard_contacts_data');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
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
      localStorage.setItem('smartcard_contacts_data', JSON.stringify(updated));
    }
  };

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Filter and Sort Pipeline
  const filteredAndSortedContacts = useMemo(() => {
    let result = [...contacts];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter(c => c.status === statusFilter);
    }

    // Sorting
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
      notes: newContact.notes || 'Manually added to SmartCard CRM',
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
        return 'bg-emerald-400 text-black border-black';
      case 'Follow-Up':
        return 'bg-amber-400 text-black border-black';
      case 'New Lead':
        return 'bg-cyan-400 text-black border-black';
      case 'Partner':
        return 'bg-purple-400 text-black border-black';
      case 'Archived':
        return 'bg-gray-400 text-black border-black';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-[#0e1628] p-5 sm:p-6 rounded-xl border-3 border-black shadow-[6px_6px_0px_#000]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] font-black uppercase bg-[#2563EB] text-white px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
              CRM &amp; Inbound Leads
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              {contacts.length} Total Connections
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Contacts Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-medium">
            People who connected with you and exchanged details via your SmartCard profiles.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="h-10 px-3.5 bg-[#121c33] hover:bg-slate-800 text-gray-200 font-mono text-xs font-bold uppercase rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="h-10 px-4 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-black uppercase rounded-lg border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus size={15} />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search, Filter, Sort, View Toggle */}
      <div className="bg-[#0e1628] p-4 sm:p-5 rounded-xl border-3 border-black shadow-[5px_5px_0px_#000] space-y-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, company, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 h-11 bg-[#090D16] border-2 border-black rounded-lg text-xs font-bold text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400 shadow-[2px_2px_0px_#000]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Controls: Filter, Sort, View Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Filter by Status */}
            <div className="flex items-center gap-1 bg-[#090D16] border-2 border-black rounded-lg px-2 h-11 shadow-[2px_2px_0px_#000]">
              <Filter size={14} className="text-gray-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#0e1628]">All Statuses</option>
                <option value="Active" className="bg-[#0e1628]">Active</option>
                <option value="Follow-Up" className="bg-[#0e1628]">Follow-Up</option>
                <option value="New Lead" className="bg-[#0e1628]">New Lead</option>
                <option value="Partner" className="bg-[#0e1628]">Partner</option>
                <option value="Archived" className="bg-[#0e1628]">Archived</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 bg-[#090D16] border-2 border-black rounded-lg px-2 h-11 shadow-[2px_2px_0px_#000]">
              <ArrowUpDown size={14} className="text-gray-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="date-desc" className="bg-[#0e1628]">Date (Newest)</option>
                <option value="date-asc" className="bg-[#0e1628]">Date (Oldest)</option>
                <option value="name-asc" className="bg-[#0e1628]">Name (A → Z)</option>
                <option value="company-asc" className="bg-[#0e1628]">Company (A → Z)</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex border-2 border-black rounded-lg bg-[#090D16] p-0.5 shadow-[2px_2px_0px_#000]">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#2563EB] text-white shadow-[1px_1px_0px_#000]' : 'text-gray-400 hover:text-white'
                }`}
                title="Table View"
              >
                <TableIcon size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'cards' ? 'bg-[#2563EB] text-white shadow-[1px_1px_0px_#000]' : 'text-gray-400 hover:text-white'
                }`}
                title="Cards View"
              >
                <Grid size={16} />
              </button>
            </div>

          </div>

        </div>

        {/* Quick Filter Status Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono font-bold uppercase text-gray-400">Quick Filter:</span>
          {['All', 'Active', 'Follow-Up', 'New Lead', 'Partner', 'Archived'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-black uppercase transition-all border cursor-pointer ${
                statusFilter === st
                  ? 'bg-white text-black border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-[#121c33] text-gray-300 border-black hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
          <span className="text-[11px] font-mono text-cyan-400 ml-auto font-bold">
            Showing {filteredAndSortedContacts.length} of {contacts.length}
          </span>
        </div>

      </div>

      {/* EMPTY STATE */}
      {filteredAndSortedContacts.length === 0 ? (
        <div className="bg-[#0e1628] rounded-xl border-3 border-black p-12 text-center shadow-[6px_6px_0px_#000] space-y-4">
          <div className="w-14 h-14 bg-blue-600 border-2 border-black text-white rounded-xl mx-auto flex items-center justify-center shadow-[3px_3px_0px_#000]">
            <Users size={28} />
          </div>
          <h3 className="text-xl font-black text-white">No contacts found</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto font-medium">
            No contacts match &quot;{search || statusFilter}&quot;. Try adjusting your search query or reset your status filter.
          </p>
          <button
            onClick={() => { setSearch(''); setStatusFilter('All'); }}
            className="h-10 px-4 bg-cyan-400 text-black font-mono text-xs font-bold uppercase rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        
        /* TABLE VIEW (Section 19: Name, Company, Email, Date connected, Status) */
        <div className="bg-[#0e1628] rounded-xl border-3 border-black shadow-[6px_6px_0px_#000] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black text-[11px] uppercase text-gray-400 font-black border-b-2 border-black">
                <tr>
                  <th className="px-5 py-3.5 text-white">Name &amp; Role</th>
                  <th className="px-5 py-3.5 text-white">Company</th>
                  <th className="px-5 py-3.5 text-white">Email &amp; Phone</th>
                  <th className="px-5 py-3.5 text-white">Date Connected</th>
                  <th className="px-5 py-3.5 text-white">Status</th>
                  <th className="px-5 py-3.5 text-right text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {filteredAndSortedContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-800/60 transition-colors">
                    
                    {/* Name */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-9 h-9 rounded-lg border-2 border-black flex items-center justify-center font-black text-sm text-white uppercase shadow-[2px_2px_0px_#000] shrink-0"
                          style={{ backgroundColor: contact.avatarColor }}
                        >
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-sans font-black text-sm text-white">{contact.name}</p>
                          <p className="text-[10px] text-cyan-400 font-bold">{contact.role}</p>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-bold text-white">{contact.company}</p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{contact.notes}</p>
                    </td>

                    {/* Email & Phone */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <a href={`mailto:${contact.email}`} className="text-gray-200 hover:text-cyan-400 font-bold block transition-colors">
                        {contact.email}
                      </a>
                      <span className="text-[11px] text-gray-400">{contact.phone}</span>
                    </td>

                    {/* Date Connected */}
                    <td className="px-5 py-4 whitespace-nowrap text-gray-300 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-500" />
                        <span>{new Date(contact.dateConnected).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <select
                        value={contact.status}
                        onChange={(e) => handleUpdateStatus(contact.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded text-[10px] font-black uppercase border-2 shadow-[1px_1px_0px_#000] cursor-pointer focus:outline-none ${getStatusBadge(contact.status)}`}
                      >
                        <option value="Active" className="bg-[#0e1628] text-white">Active</option>
                        <option value="Follow-Up" className="bg-[#0e1628] text-white">Follow-Up</option>
                        <option value="New Lead" className="bg-[#0e1628] text-white">New Lead</option>
                        <option value="Partner" className="bg-[#0e1628] text-white">Partner</option>
                        <option value="Archived" className="bg-[#0e1628] text-white">Archived</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`mailto:${contact.email}`}
                          className="p-1.5 bg-[#121c33] hover:bg-blue-600 text-gray-300 hover:text-white rounded border border-black transition-colors"
                          title="Send Email"
                        >
                          <Mail size={13} />
                        </a>
                        <a
                          href={`https://api.whatsapp.com/send?phone=${contact.phone.replace(/\D/g, '')}&text=${encodeURIComponent(`Hi ${contact.name}, great connecting with you via SmartCard!`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-[#121c33] hover:bg-emerald-600 text-emerald-400 hover:text-white rounded border border-black transition-colors"
                          title="WhatsApp Chat"
                        >
                          <MessageCircle size={13} />
                        </a>
                        <button
                          onClick={() => handleDeleteContact(contact.id, contact.name)}
                          className="p-1.5 bg-[#121c33] hover:bg-red-900/60 text-red-400 hover:text-red-200 rounded border border-black transition-colors cursor-pointer"
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

        /* CARDS VIEW (Section 19: Grid Layout) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAndSortedContacts.map((contact) => (
            <div 
              key={contact.id}
              className="bg-[#0e1628] rounded-xl border-3 border-black shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:-translate-y-0.5 transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header with Avatar & Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center font-black text-base text-white uppercase shadow-[2px_2px_0px_#000] shrink-0"
                      style={{ backgroundColor: contact.avatarColor }}
                    >
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-sans font-black text-base text-white leading-tight">
                        {contact.name}
                      </h4>
                      <p className="text-xs font-bold text-cyan-400 font-mono mt-0.5">
                        {contact.role}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase border-2 shadow-[1px_1px_0px_#000] ${getStatusBadge(contact.status)}`}>
                    {contact.status}
                  </span>
                </div>

                {/* Company & Details */}
                <div className="space-y-1.5 mb-3 bg-[#090D16] p-3 rounded-lg border-2 border-black">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Building2 size={13} className="text-amber-400 shrink-0" />
                    <span>{contact.company}</span>
                  </div>
                  <div className="text-[11px] font-mono text-gray-300 truncate">
                    ✉️ {contact.email}
                  </div>
                  <div className="text-[11px] font-mono text-gray-400">
                    📱 {contact.phone}
                  </div>
                </div>

                {/* Notes */}
                {contact.notes && (
                  <p className="text-xs text-gray-300 bg-[#121c33] p-2.5 rounded-lg border border-black mb-3 font-medium line-clamp-2">
                    &quot;{contact.notes}&quot;
                  </p>
                )}
              </div>

              {/* Bottom Footer: Date & Actions */}
              <div className="pt-3 border-t-2 border-black flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-gray-400 font-bold">
                  Connected: {contact.dateConnected}
                </span>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`mailto:${contact.email}`}
                    className="p-1.5 bg-[#121c33] hover:bg-blue-600 text-gray-300 hover:text-white rounded border border-black"
                  >
                    <Mail size={13} />
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?phone=${contact.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-[#121c33] hover:bg-emerald-600 text-emerald-400 hover:text-white rounded border border-black"
                  >
                    <MessageCircle size={13} />
                  </a>
                  <button
                    onClick={() => handleDeleteContact(contact.id, contact.name)}
                    className="p-1.5 bg-[#121c33] hover:bg-red-900/60 text-red-400 rounded border border-black cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e1628] border-3 border-black rounded-xl p-6 shadow-[8px_8px_0px_#000] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white">Add New Contact</h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">Record a connection in your SmartCard CRM.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-gray-400 hover:text-white font-bold"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase text-gray-300">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Lee"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="w-full h-10 bg-[#090D16] border-2 border-black rounded-lg px-3 text-xs font-bold text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300">Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={newContact.company}
                    onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                    className="w-full h-10 bg-[#090D16] border-2 border-black rounded-lg px-3 text-xs font-bold text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. VP Sales"
                    value={newContact.role}
                    onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                    className="w-full h-10 bg-[#090D16] border-2 border-black rounded-lg px-3 text-xs font-bold text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="jordan@acme.com"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    className="w-full h-10 bg-[#090D16] border-2 border-black rounded-lg px-3 text-xs font-bold text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 555 123 4567"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    className="w-full h-10 bg-[#090D16] border-2 border-black rounded-lg px-3 text-xs font-bold text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase text-gray-300">Status</label>
                <select
                  value={newContact.status}
                  onChange={(e) => setNewContact({ ...newContact, status: e.target.value as any })}
                  className="w-full h-10 bg-[#090D16] border-2 border-black rounded-lg px-3 text-xs font-mono font-bold text-white"
                >
                  <option value="New Lead">New Lead</option>
                  <option value="Active">Active</option>
                  <option value="Follow-Up">Follow-Up</option>
                  <option value="Partner">Partner</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase text-gray-300">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Where did you connect? Key takeaways..."
                  value={newContact.notes}
                  onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                  className="w-full p-2.5 bg-[#090D16] border-2 border-black rounded-lg text-xs text-white"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-10 bg-[#121c33] text-gray-300 font-mono text-xs font-bold uppercase rounded-lg border-2 border-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-black uppercase rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Success Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-cyan-400 text-black border-2 border-black px-5 py-2.5 rounded-lg text-xs font-mono font-black uppercase shadow-[4px_4px_0px_#000] flex items-center gap-2 animate-bounce">
          <Check size={16} className="stroke-[3]" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
