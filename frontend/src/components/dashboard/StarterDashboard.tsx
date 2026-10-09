'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CreditCard, QrCode, Share2, Eye, Download, Sparkles, User, 
  Mail, Phone, Globe, CheckCircle2, ArrowRight, Copy, Check,
  ExternalLink, ShieldCheck, Zap, Sliders, ChevronRight, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { QRCodeComponent } from '@/components/QRCode';
import { ShareCard } from '@/components/ShareCard';

interface StarterDashboardProps {
  user: any;
  card: any;
  onUpdateCard: (updated: any) => void;
  onOpenPlanSwitcher: () => void;
  onActivatePass24h: () => void;
  isActivatingPass?: boolean;
}

export function StarterDashboard({
  user,
  card,
  onUpdateCard,
  onOpenPlanSwitcher,
  onActivatePass24h,
  isActivatingPass = false,
}: StarterDashboardProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const username = card?.username || 'smriti';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://smartcard.app';
  const cardPublicUrl = `${origin}/${username}`;

  const copyUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cardPublicUrl);
    }
    setCopiedLink(true);
    showToast('SmartCard URL copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const downloadVCard = () => {
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${card?.name || user?.name || 'User'}`,
      `TITLE:${card?.role || card?.title || ''}`,
      `ORG:${card?.company || ''}`,
      `TEL;TYPE=CELL:${card?.phone || ''}`,
      `EMAIL;TYPE=PREF,INTERNET:${card?.email || user?.email || ''}`,
      `URL:${card?.website || cardPublicUrl}`,
      `NOTE:${card?.bio || ''}`,
      'END:VCARD'
    ].filter(Boolean).join('\n');

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${(card?.name || 'SmartCard').replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('vCard contact downloaded to address book!');
  };

  // Calculate profile completeness score
  const checks = [
    { label: 'Full name & job title', completed: Boolean(card?.name && card?.role) },
    { label: 'Profile picture avatar', completed: Boolean(card?.profileImage) },
    { label: 'Short professional bio', completed: Boolean(card?.bio) },
    { label: 'Direct email & phone', completed: Boolean(card?.email && card?.phone) },
    { label: 'Social profile links', completed: Boolean(card?.socialLinks?.linkedin || card?.socialLinks?.github) },
  ];
  const completedCount = checks.filter(c => c.completed).length;
  const completionPercentage = Math.round((completedCount / checks.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. WELCOME SECTION */}
      <div className="bg-white dark:bg-[#131924] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs relative overflow-hidden transition-colors">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md shrink-0">
              <img
                src={card?.profileImage || user?.profilePhoto || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'}
                alt={card?.name || user?.name}
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-md">
                  Starter Tier
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  ID: {user?.accountId || 'ACC-883192'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Welcome, {card?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Member'} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Your personal digital business card is active, scannable, and ready to share anywhere.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <Link href="/cards" className="flex-1 sm:flex-initial">
              <Button variant="primary" size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-10 px-4 shadow-xs flex items-center justify-center gap-2">
                <CreditCard size={14} />
                <span>Edit My SmartCard</span>
              </Button>
            </Link>

            <button
              onClick={() => setShowShareModal(true)}
              className="flex-1 sm:flex-initial h-10 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 size={14} />
              <span>Share Profile</span>
            </button>
          </div>

        </div>

        {/* Profile Completion Meter */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-blue-600 dark:text-blue-400" />
              Profile Completion: {completionPercentage}%
            </span>
            <span className="text-slate-400">{completedCount} of {checks.length} completed</span>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3">
            {checks.map((chk, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                <span className={`w-1.5 h-1.5 rounded-full ${chk.completed ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                <span className={chk.completed ? 'text-slate-800 dark:text-slate-200 font-medium' : 'opacity-70'}>
                  {chk.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. SPECIAL ₹20 24-HOUR PRO PASS & UPGRADE HERO BANNER */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold">
              <Zap size={14} className="text-amber-300" />
              <span>Introductory Offer • ₹20 Only</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Test Drive Professional for 24 Hours for ₹20
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Unlock CRM lead capture forms, lead status tracking (New, Contacted, Qualified, Converted, Lost), time-range analytics, and multi-card capacity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <Button
              onClick={onActivatePass24h}
              disabled={isActivatingPass}
              variant="secondary"
              className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs h-11 px-6 shadow-md cursor-pointer border-0"
            >
              {isActivatingPass ? 'Activating...' : 'Activate ₹20 24-Hour Pass'}
            </Button>

            <button
              onClick={onOpenPlanSwitcher}
              className="text-xs text-blue-100 hover:text-white underline font-medium cursor-pointer"
            >
              View Monthly Plans →
            </button>
          </div>
        </div>
      </div>

      {/* 3. CORE STARTER WORKSPACE: MY SMARTCARD HUB & LIVE PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Cols: Sharing & Quick Controls */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card Link & Instant Sharing Box */}
          <div className="bg-white dark:bg-[#131924] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Globe size={16} className="text-blue-600" />
                  <span>Public SmartCard Link</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Your live web address that anyone can visit without downloading an app.
                </p>
              </div>

              <a
                href={cardPublicUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View live</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* URL Display + Copy Button */}
            <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs font-mono text-slate-700 dark:text-slate-300 px-2 truncate flex-1 select-all">
                {cardPublicUrl}
              </span>
              <button
                onClick={copyUrl}
                className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-2xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {copiedLink ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* 1-Click Social Shares */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Quick Share Targets
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Here is my SmartCard: ${cardPublicUrl}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-emerald-100 transition-colors"
                >
                  <MessageSquare size={13} />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cardPublicUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors"
                >
                  <Share2 size={13} />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Connect with me on SmartCard: ${cardPublicUrl}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-slate-200 transition-colors"
                >
                  <span>𝕏 Post</span>
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(`${card?.name || 'My'} SmartCard Profile`)}&body=${encodeURIComponent(`Hi,\n\nHere is my professional digital business card: ${cardPublicUrl}\n\nBest regards,\n${card?.name || ''}`)}`}
                  className="h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-slate-200 transition-colors"
                >
                  <Mail size={13} />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>

          {/* Dynamic QR Code Box */}
          <div className="bg-white dark:bg-[#131924] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                <QrCode size={13} />
                <span>Standard Dynamic QR</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Instant Camera QR Code
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                Point any smartphone camera to instantly open your profile. You can print this QR code or save it to your camera roll.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setShowQrModal(true)}
                  className="h-8.5 px-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye size={13} />
                  <span>Expand QR</span>
                </button>
                <button
                  onClick={downloadVCard}
                  className="h-8.5 px-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Export vCard (.vcf)</span>
                </button>
              </div>
            </div>

            <div 
              onClick={() => setShowQrModal(true)}
              className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-blue-400 transition-colors shrink-0"
            >
              <QrCode size={110} className="text-slate-900 dark:text-slate-100" />
              <span className="text-[10px] text-center block text-slate-400 mt-1 font-mono">
                Click to expand
              </span>
            </div>
          </div>

          {/* Basic Analytics Counter (Starter Minimal) */}
          <div className="bg-white dark:bg-[#131924] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Basic Card Activity
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Lifetime views and interaction counters.
                </p>
              </div>

              <button
                onClick={onOpenPlanSwitcher}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Unlock In-Depth Charts →
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center space-y-1">
                <span className="text-xs text-slate-500">Total Views</span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                  {card?.views || card?.totalViews || 142}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center space-y-1">
                <span className="text-xs text-slate-500">QR Scans</span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                  {card?.scans || 58}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center space-y-1">
                <span className="text-xs text-slate-500">vCard Exports</span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                  {card?.shares || 24}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right 5 Cols: Live Card Interactive Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Live Card Preview
            </span>
            <span className="text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Online • Live
            </span>
          </div>

          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-md overflow-hidden">
            {/* Banner */}
            <div className="h-20 bg-blue-600 px-5 pt-3 relative flex items-start justify-between text-white">
              <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-black/25">
                SMARTCARD
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-medium">
                Standard Minimal
              </span>
            </div>

            {/* Profile Content */}
            <div className="p-5 pt-0">
              <div className="relative flex items-end justify-between -mt-8 mb-3">
                <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden shrink-0">
                  <img
                    src={card?.profileImage || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'}
                    alt={card?.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  /{username}
                </span>
              </div>

              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {card?.name || 'Smriti Jha'}
              </h4>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {card?.role || card?.title || 'Full Stack Developer'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                {card?.company || 'SmartCard Technologies'}
              </p>

              {card?.bio && (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  &ldquo;{card.bio}&rdquo;
                </p>
              )}

              <div className="space-y-2 mb-4 text-xs">
                {card?.email && (
                  <a
                    href={`mailto:${card.email}`}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800"
                  >
                    <Mail size={13} className="text-blue-600" />
                    <span className="truncate">{card.email}</span>
                  </a>
                )}
                {card?.phone && (
                  <a
                    href={`tel:${card.phone}`}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800"
                  >
                    <Phone size={13} className="text-emerald-600" />
                    <span className="truncate">{card.phone}</span>
                  </a>
                )}
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={downloadVCard}
                className="w-full h-9 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 font-medium text-xs rounded-xl shadow-xs transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download size={13} />
                <span>Save Contact (.vcf)</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <span className="font-semibold text-blue-900 dark:text-blue-200 block">Starter Plan Status</span>
            <p>1 active card limit. To create multiple cards or capture CRM leads, upgrade to Professional.</p>
          </div>
        </div>

      </div>

      {/* Share Modal */}
      <ShareCard
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        username={username}
        name={card?.name}
        title={card?.role || card?.title}
        company={card?.company}
        profileImage={card?.profileImage}
        onOpenQR={() => setShowQrModal(true)}
        onToast={showToast}
      />

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#131924] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">SmartCard Dynamic QR Code</h4>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <QRCodeComponent
              value={cardPublicUrl}
              username={username}
              name={card?.name}
              size={220}
              showDownload={true}
              showShare={true}
              showCopy={true}
            />
          </div>
        </div>
      )}

      {/* Toast message */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 rounded-xl text-xs font-medium shadow-xl flex items-center gap-2">
          <CheckCircle2 size={15} className="text-emerald-400 dark:text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
export default StarterDashboard;
