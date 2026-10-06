'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, Globe, Phone, Download, Share2, Copy, QrCode, 
  ExternalLink, Sparkles, Check, ArrowLeft, Heart, ShieldCheck,
  Send, UserCheck, X
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

// Custom Neo-Brutalist Social SVGs
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

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default function SmritiProfilePage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);

  // Form State for Exchange Contact
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorNote, setVisitorNote] = useState('');
  const [submittingLead, setSubmittingLead] = useState(false);

  const profileUrl = typeof window !== 'undefined' ? window.location.href : 'https://smartcard.app/smriti';

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
        text: 'Connect with Smriti Jha, Full Stack Developer.',
        url: profileUrl,
      }).catch(() => {});
    } else {
      const msg = `Connect with Smriti Jha 👋\nDigital Business Card: ${profileUrl}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
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
      'URL:https://smritijha.dev',
      'NOTE:Building modern web experiences.',
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
    <div className="min-h-screen bg-[#090D16] text-gray-100 font-sans flex flex-col justify-between items-center p-4 sm:p-6 bg-neo-dots relative selection:bg-[#2563EB] selection:text-white">
      
      {/* Top Bar: Brand, Zero-NFC Badge & Theme Toggle */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 z-10 gap-2">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-cyan-400 bg-black border-2 border-black px-2.5 py-1 rounded shadow-[2px_2px_0px_#000] flex items-center gap-1.5 hover:-translate-y-0.5 transition-transform">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            SmartCard Demo
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle compact showLabel={false} />
          <span className="font-mono text-[10px] uppercase font-bold bg-[#121c33] border-2 border-black px-2.5 py-1 rounded text-gray-300 shadow-[2px_2px_0px_#000]">
            Zero NFC • 100% Web
          </span>
        </div>
      </div>

      {/* Main Neo-Brutalist Digital Business Card (Mobile-First) */}
      <div className="w-full max-w-md bg-[#0e1628] rounded-2xl border-3 border-black shadow-[8px_8px_0px_#000000] overflow-hidden relative z-10 my-auto">
        
        {/* Banner with Electric Blue Theme Accent */}
        <div className="p-6 border-b-3 border-black bg-[#2563EB] text-white relative">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                  PRO • VERIFIED
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[9px] font-extrabold uppercase bg-emerald-400 text-black px-1.5 py-0.5 rounded border border-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
                  ONLINE
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white mt-1 leading-tight">
                Smriti Jha
              </h1>
              <p className="text-sm font-bold text-white/95">
                Full Stack Developer
              </p>
              <p className="text-xs font-mono text-cyan-200 font-bold">
                smartcard.app/smriti
              </p>
            </div>

            {/* Profile Photo */}
            <div className="w-22 h-22 rounded-2xl border-3 border-black bg-white overflow-hidden shadow-[4px_4px_0px_#000] shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80" 
                alt="Smriti Jha" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-5 bg-[#0c1220]">
          
          {/* Short Bio */}
          <div className="bg-[#131d33] p-3.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000]">
            <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed">
              &ldquo;Building modern web experiences.&rdquo;
            </p>
          </div>

          {/* Social & Contact Links Grid: GitHub, LinkedIn, Email, Portfolio, Instagram */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
              Verified Links &amp; Profiles
            </span>

            <div className="grid grid-cols-1 gap-2">
              
              {/* Portfolio */}
              <a 
                href="https://smritijha.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 bg-[#17223b] hover:bg-[#1f2d4e] rounded-xl border-2 border-black text-gray-200 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-transform"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-400 text-black border border-black flex items-center justify-center shrink-0">
                  <Globe size={15} />
                </div>
                <div className="truncate flex-1">
                  <span className="text-xs font-bold text-white block truncate">smritijha.dev</span>
                  <span className="text-[10px] font-mono text-cyan-400">Portfolio &amp; Projects</span>
                </div>
                <ExternalLink size={13} className="text-gray-400 shrink-0" />
              </a>

              {/* GitHub */}
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 bg-[#17223b] hover:bg-black rounded-xl border-2 border-black text-gray-200 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-black text-white border border-black flex items-center justify-center shrink-0">
                  <GitHubIcon className="w-4 h-4 fill-white" />
                </div>
                <div className="truncate flex-1">
                  <span className="text-xs font-bold text-white block truncate">github.com/smritijha</span>
                  <span className="text-[10px] font-mono text-gray-400">Open Source &amp; Code</span>
                </div>
                <ExternalLink size={13} className="text-gray-400 shrink-0" />
              </a>

              {/* LinkedIn */}
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 bg-[#17223b] hover:bg-[#0077b5] rounded-xl border-2 border-black text-gray-200 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-[#0077b5] text-white border border-black flex items-center justify-center shrink-0">
                  <LinkedInIcon className="w-4 h-4 fill-white" />
                </div>
                <div className="truncate flex-1">
                  <span className="text-xs font-bold text-white block truncate">linkedin.com/in/smritijha</span>
                  <span className="text-[10px] font-mono text-blue-300">Professional Network</span>
                </div>
                <ExternalLink size={13} className="text-gray-400 shrink-0" />
              </a>

              {/* Email */}
              <a 
                href="mailto:smriti@smartcard.app"
                className="flex items-center gap-3 p-2.5 bg-[#17223b] hover:bg-[#1f2d4e] rounded-xl border-2 border-black text-gray-200 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-transform"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-400 text-black border border-black flex items-center justify-center shrink-0">
                  <Mail size={15} />
                </div>
                <div className="truncate flex-1">
                  <span className="text-xs font-bold text-white block truncate">smriti@smartcard.app</span>
                  <span className="text-[10px] font-mono text-amber-300">Direct Inquiries</span>
                </div>
                <ExternalLink size={13} className="text-gray-400 shrink-0" />
              </a>

              {/* Instagram */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 bg-[#17223b] hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 rounded-xl border-2 border-black text-gray-200 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-pink-500 text-white border border-black flex items-center justify-center shrink-0">
                  <InstagramIcon className="w-4 h-4 fill-white" />
                </div>
                <div className="truncate flex-1">
                  <span className="text-xs font-bold text-white block truncate">instagram.com/smriti.codes</span>
                  <span className="text-[10px] font-mono text-pink-300">Developer Journey</span>
                </div>
                <ExternalLink size={13} className="text-gray-400 shrink-0" />
              </a>

            </div>
          </div>

          {/* Core Action Buttons: Save Contact & Exchange Info */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleDownloadVCard}
              className="w-full h-12 bg-white hover:bg-gray-100 text-black font-mono font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download size={16} />
              <span>Save Contact to Phone (.vcf)</span>
            </button>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="h-11 bg-[#17223b] hover:bg-[#1f2d4e] text-white font-mono font-bold text-xs uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="Share profile"
              >
                <Share2 size={14} className="text-cyan-400" />
                <span>Share</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="h-11 bg-[#17223b] hover:bg-[#1f2d4e] text-white font-mono font-bold text-xs uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="Copy Link"
              >
                <Copy size={14} className="text-emerald-400" />
                <span>Copy</span>
              </button>

              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="h-11 bg-[#17223b] hover:bg-[#1f2d4e] text-white font-mono font-bold text-xs uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="View QR Code"
              >
                <QrCode size={14} className="text-yellow-400" />
                <span>View QR</span>
              </button>
            </div>
          </div>

          {/* 12. QR CODE SECTION: "Scan to connect" */}
          <div className="pt-4 border-t-2 border-black flex items-center justify-between gap-4 bg-[#121c33] p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000]">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-400 text-black font-mono font-black text-[9px] uppercase border border-black">
                <QrCode size={11} />
                <span>Scan to connect</span>
              </div>
              <p className="text-xs font-bold text-white">
                Point any phone camera to save
              </p>
              <p className="text-[10px] font-mono text-cyan-300 font-bold">
                smartcard.app/smriti
              </p>
            </div>

            <div 
              onClick={() => setQrModalOpen(true)}
              className="bg-white p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] shrink-0 cursor-pointer hover:scale-105 transition-transform"
              title="Click to expand QR Code"
            >
              <QrCode size={56} className="text-black" />
            </div>
          </div>

          {/* Two-Way Exchange Prompt */}
          <button
            type="button"
            onClick={() => setExchangeModalOpen(true)}
            className="w-full h-11 bg-[#06B6D4] hover:bg-cyan-300 text-black font-mono font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles size={15} />
            <span>Exchange Contact with Smriti</span>
          </button>

        </div>

      </div>

      {/* Footer Powered By SmartCard Badge */}
      <div className="mt-6 mb-2 text-center space-y-2 z-10">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121c33] hover:bg-slate-800 rounded-lg border-2 border-black text-xs font-mono font-bold text-gray-300 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-transform"
        >
          <span>Powered by SmartCard</span>
          <span className="text-cyan-400 font-bold">Create Yours Free →</span>
        </Link>
        <p className="text-[10px] font-mono text-gray-500">
          Zero NFC Hardware • 100% Web-Native Digital Cards
        </p>
      </div>

      {/* QR Code Enlarged Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0e1628] border-3 border-black rounded-2xl p-6 shadow-[8px_8px_0px_#000] text-center space-y-4 relative">
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-[#17223b] hover:bg-slate-700 text-gray-300 rounded-lg border-2 border-black cursor-pointer"
            >
              <X size={16} />
            </button>

            <div>
              <span className="font-mono text-[10px] font-black uppercase text-cyan-400 bg-black px-2.5 py-1 rounded border border-white/20 inline-block mb-1">
                Camera QR Code
              </span>
              <h3 className="text-xl font-black text-white">Scan to Connect</h3>
              <p className="text-xs text-gray-400 font-mono">smartcard.app/smriti</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border-3 border-black shadow-[4px_4px_0px_#000] inline-block mx-auto">
              <QrCode size={180} className="text-black" />
            </div>

            <p className="text-xs text-gray-300 font-medium">
              Open your camera app on iPhone or Android to open Smriti Jha&apos;s digital profile instantly.
            </p>

            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full py-2.5 bg-cyan-400 text-black font-mono font-black text-xs uppercase rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              Copy Profile Link
            </button>
          </div>
        </div>
      )}

      {/* Exchange Contact Modal */}
      {exchangeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e1628] border-3 border-black rounded-2xl p-6 shadow-[8px_8px_0px_#000] space-y-4 relative">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div>
                <h3 className="text-xl font-black text-white">Exchange Contact</h3>
                <p className="text-xs text-gray-400 font-mono">Send your information to Smriti Jha</p>
              </div>
              <button
                onClick={() => setExchangeModalOpen(false)}
                className="p-1.5 bg-[#17223b] hover:bg-slate-700 text-gray-300 rounded-lg border-2 border-black cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleExchangeSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-gray-300">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full h-10 bg-[#090D16] border-2 border-black rounded-lg px-3 text-xs font-bold text-white shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-gray-300">Your Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="alex@company.com"
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  className="w-full h-10 bg-[#090D16] border-2 border-black rounded-lg px-3 text-xs font-bold text-white shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-gray-300">Phone (Optional)</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="w-full h-10 bg-[#090D16] border-2 border-black rounded-lg px-3 text-xs font-bold text-white shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-gray-300">Short Note / Message</label>
                <textarea
                  rows={2}
                  placeholder="Great connecting with you!"
                  value={visitorNote}
                  onChange={(e) => setVisitorNote(e.target.value)}
                  className="w-full bg-[#090D16] border-2 border-black rounded-lg p-2.5 text-xs font-medium text-white shadow-[2px_2px_0px_#000]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingLead}
                className="w-full h-11 bg-[#2563EB] hover:bg-blue-600 text-white font-mono font-black text-xs uppercase tracking-wider rounded-lg border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
              >
                {submittingLead ? 'Sending...' : 'Send Contact Info →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-400 text-black border-2 border-black px-4 py-2.5 rounded-lg font-mono font-extrabold text-xs uppercase shadow-[4px_4px_0px_#000] flex items-center gap-2 whitespace-nowrap animate-bounce">
          <Check size={16} className="stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
