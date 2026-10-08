'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, Globe, Phone, Download, Share2, Copy, QrCode, 
  ExternalLink, Sparkles, Check, ArrowLeft, X, Send, CheckCircle2
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';

const LinkedInIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.75a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/>
  </svg>
);

const GitHubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

export default function SmritiProfilePage({ isDemo = false }: { isDemo?: boolean }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorNote, setVisitorNote] = useState('');
  const [submittingLead, setSubmittingLead] = useState(false);

  const profileUrl = typeof window !== 'undefined' ? window.location.href : 'https://smartcard.app/demo';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard?.writeText(profileUrl);
    }
    showToast('Profile link copied to clipboard!');
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'Smriti Jha — SmartCard Digital Profile',
        text: 'Connect with Smriti Jha, Full Stack Developer at SmartCard Platform.',
        url: profileUrl,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadVCard = () => {
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Smriti Jha',
      'TITLE:Full Stack Developer',
      'ORG:SmartCard Platform',
      'EMAIL;TYPE=PREF,INTERNET:smriti@smartcard.app',
      'TEL;TYPE=CELL:+1 (555) 234-5678',
      'URL:https://smritijha.dev',
      'NOTE:Building modern web experiences with Next.js and TypeScript.',
      'END:VCARD'
    ].join('\n');

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Smriti_Jha.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('vCard saved to phone contacts (.vcf)!');
  };

  const handleExchangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingLead(true);
    setTimeout(() => {
      setSubmittingLead(false);
      setExchangeModalOpen(false);
      setVisitorName('');
      setVisitorEmail('');
      setVisitorPhone('');
      setVisitorNote('');
      showToast('Contact info shared with Smriti Jha!');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col justify-between items-center p-4 sm:p-6 relative selection:bg-blue-600 selection:text-white transition-colors">
      
      {/* Top Bar: Brand, Zero-NFC Badge & Theme Toggle */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 z-10 gap-2">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5 hover:border-slate-300 transition-colors">
            <ArrowLeft size={13} className="text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>SmartCard</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {isDemo && (
            <span className="text-[11px] font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-full">
              Live Demo Mode
            </span>
          )}
          <ThemeToggle compact showLabel={false} />
        </div>
      </div>

      {/* Main Executive Digital Business Card */}
      <div className="w-full max-w-md bg-white dark:bg-[#131924] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-lg overflow-hidden relative z-10 my-auto transition-all">
        
        {/* Banner with Electric Blue Theme Accent */}
        <div className="p-6 bg-blue-600 text-white relative">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium bg-black/25 text-white/90 px-2 py-0.5 rounded backdrop-blur-xs">
                  PRO • VERIFIED
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-white/20 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  ONLINE
                </span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-white mt-1 leading-tight">
                Smriti Jha
              </h1>
              <p className="text-xs font-medium text-white/95">
                Full Stack Developer
              </p>
              <p className="text-[11px] text-blue-100">
                smartcard.app/smriti
              </p>
            </div>

            {/* Profile Photo */}
            <div className="w-20 h-20 rounded-full ring-2 ring-white/30 bg-white/10 overflow-hidden shadow-xs shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80" 
                alt="Smriti Jha" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-5">
          
          {/* Short Bio */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <p className="text-xs text-slate-700 dark:text-slate-300 font-normal leading-relaxed text-center">
              &ldquo;Building modern digital experiences.&rdquo;
            </p>
          </div>

          {/* Links Grid: GitHub, LinkedIn, Portfolio, Email */}
          <div className="space-y-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Links &amp; Profiles
            </span>

            <div className="grid grid-cols-1 gap-2">
              {/* GitHub */}
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 flex items-center justify-center shrink-0">
                  <GitHubIcon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate flex-1">
                  <span className="text-xs font-medium text-slate-900 dark:text-slate-100 block truncate">GitHub</span>
                  <span className="text-[11px] text-slate-400">github.com/smritijha</span>
                </div>
                <ExternalLink size={13} className="text-slate-400 shrink-0" />
              </a>

              {/* LinkedIn */}
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                  <LinkedInIcon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate flex-1">
                  <span className="text-xs font-medium text-slate-900 dark:text-slate-100 block truncate">LinkedIn</span>
                  <span className="text-[11px] text-slate-400">linkedin.com/in/smritijha</span>
                </div>
                <ExternalLink size={13} className="text-slate-400 shrink-0" />
              </a>

              {/* Portfolio */}
              <a 
                href="https://smritijha.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Globe size={15} />
                </div>
                <div className="truncate flex-1">
                  <span className="text-xs font-medium text-slate-900 dark:text-slate-100 block truncate">Portfolio</span>
                  <span className="text-[11px] text-slate-400">smritijha.dev</span>
                </div>
                <ExternalLink size={13} className="text-slate-400 shrink-0" />
              </a>

              {/* Email */}
              <a 
                href="mailto:smriti@smartcard.app" 
                className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Mail size={15} />
                </div>
                <div className="truncate flex-1">
                  <span className="text-xs font-medium text-slate-900 dark:text-slate-100 block truncate">Email</span>
                  <span className="text-[11px] text-slate-400">smriti@smartcard.app</span>
                </div>
                <ExternalLink size={13} className="text-slate-400 shrink-0" />
              </a>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleDownloadVCard}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-medium text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download size={15} />
              <span>Save Contact to Phone (.vcf)</span>
            </button>

            <button
              type="button"
              onClick={() => setExchangeModalOpen(true)}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={15} />
              <span>Exchange Contact / Connect</span>
            </button>
          </div>

          {/* Share & QR Code row */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Direct Sharing
              </span>
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                Instantly scan with phone camera
              </p>
              <div className="flex gap-2 pt-1 text-xs">
                <button
                  onClick={handleShare}
                  className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
                >
                  Share Card
                </button>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <button
                  onClick={handleCopyLink}
                  className="text-slate-600 dark:text-slate-400 hover:underline cursor-pointer"
                >
                  Copy Link
                </button>
              </div>
            </div>

            <button
              onClick={() => setQrModalOpen(true)}
              className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-blue-400 transition-colors cursor-pointer"
              title="Expand QR Code"
            >
              <QrCode size={44} className="text-slate-900 dark:text-slate-100" />
            </button>
          </div>

        </div>

      </div>

      {/* QR Code Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl text-center space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Scan SmartCard</h3>
              <button 
                onClick={() => setQrModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-4 bg-white rounded-xl border border-slate-200 inline-block mx-auto shadow-2xs">
              <QrCode size={180} className="text-slate-900" />
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Point your phone camera to open Smriti&apos;s digital profile instantly.
            </p>
          </div>
        </div>
      )}

      {/* Exchange Contact Modal */}
      {exchangeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl relative space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Exchange Contact</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Share your info with Smriti Jha</p>
              </div>
              <button 
                onClick={() => setExchangeModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleExchangeSubmit} className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full h-10 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Your Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="alex@company.com"
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  className="w-full h-10 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Your Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="w-full h-10 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Quick Note / Context</label>
                <textarea
                  rows={2}
                  placeholder="Met at Tech Summit, let's connect on developer tools..."
                  value={visitorNote}
                  onChange={(e) => setVisitorNote(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setExchangeModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={submittingLead}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
                >
                  {submittingLead ? 'Sending...' : 'Send My Info'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 z-50 flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-xs font-medium shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 size={15} className="text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Subtle Footer */}
      <div className="mt-8 text-center text-[11px] text-slate-400">
        Powered by <Link href="/" className="font-medium text-slate-600 dark:text-slate-300 hover:underline">SmartCard</Link> • Digital Business Cards
      </div>

    </div>
  );
}
