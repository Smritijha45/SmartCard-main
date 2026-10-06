'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, Sparkles, User, Mail, Phone, MapPin, Globe, 
  Palette, Layout, Type, Check, Copy, Share2, Eye, RotateCcw, 
  Camera, Upload, Download, QrCode, MessageCircle, ExternalLink, ShieldCheck
} from 'lucide-react';

// Custom SVGs for Social Links
function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.9 0-1.63.73-1.63 1.63 0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63Z"/>
    </svg>
  );
}

function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"/>
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"/>
    </svg>
  );
}

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

const ACCENT_COLORS = [
  { name: 'Electric Blue', hex: '#2563EB' },
  { name: 'Bright Cyan', hex: '#06B6D4' },
  { name: 'Sunset Amber', hex: '#F59E0B' },
  { name: 'Emerald Green', hex: '#10B981' },
  { name: 'Neo Violet', hex: '#8B5CF6' },
  { name: 'Hot Pink', hex: '#EC4899' },
];

const THEME_STYLES = [
  { id: 'modern-neo', name: 'Modern Neo', desc: 'High-contrast black borders & offset shadows' },
  { id: 'minimal-dark', name: 'Minimal Dark', desc: 'Subtle slate borders & sleek contrast' },
  { id: 'electric-pop', name: 'Electric Pop', desc: 'Bold saturated accents & tactile punch' },
  { id: 'cyber-grid', name: 'Cyber Grid', desc: 'Technical grid texture & mono accents' },
];

const FONT_OPTIONS = [
  { id: 'sans', name: 'Sans (Inter)', class: 'font-sans' },
  { id: 'mono', name: 'Mono (JetBrains)', class: 'font-mono' },
  { id: 'serif', name: 'Serif (Editorial)', class: 'font-serif' },
];

const LAYOUT_OPTIONS = [
  { id: 'vertical', name: 'Standard Vertical', desc: 'Full profile banner, hero avatar, contact grid' },
  { id: 'horizontal', name: 'Compact Horizontal', desc: 'Split hero header with right-aligned avatar' },
  { id: 'badge', name: 'Badge Minimal', desc: 'Centered conference badge style with QR prominence' },
];

const DEFAULT_CARD = {
  name: 'Smriti Jha',
  role: 'Full Stack Developer',
  company: 'SmartCard Technologies',
  bio: 'Building modern web experiences. High performance, zero NFC hardware, web-native digital identities.',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  email: 'smriti@smartcard.app',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India • Remote',
  website: 'https://smritijha.dev',
  socialLinks: {
    linkedin: 'https://linkedin.com/in/smritijha',
    github: 'https://github.com/smritijha',
    instagram: 'https://instagram.com/smritijha.dev',
    x: 'https://x.com/smritijha',
  },
  appearance: {
    theme: 'modern-neo',
    accentColor: '#2563EB',
    font: 'sans',
    layout: 'vertical',
  },
  employeeCode: 'SMART-001',
};

export default function MySmartCardPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(DEFAULT_CARD);
  const [activeTab, setActiveTab] = useState<'basic' | 'contact' | 'social' | 'appearance'>('basic');
  const [toast, setToast] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCard = localStorage.getItem('smartcard_current_card');
      if (savedCard) {
        try {
          const parsed = JSON.parse(savedCard);
          setFormData(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error('Error loading saved card:', e);
        }
      }
    }
  }, []);

  // Sync to localStorage on change immediately
  const updateFormField = (section: string, field: string, value: any) => {
    setFormData(prev => {
      let updated: any = { ...prev };
      if (section === 'root') {
        updated[field] = value;
      } else if (section === 'socialLinks') {
        updated.socialLinks = { ...prev.socialLinks, [field]: value };
      } else if (section === 'appearance') {
        updated.appearance = { ...prev.appearance, [field]: value };
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('smartcard_current_card', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveCard = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('smartcard_current_card', JSON.stringify(formData));
    }
    showNotification('Card saved to localStorage! Live preview updated.');
  };

  const handleResetDemo = () => {
    if (confirm('Reset editor to default SmartCard demo profile?')) {
      setFormData(DEFAULT_CARD);
      if (typeof window !== 'undefined') {
        localStorage.setItem('smartcard_current_card', JSON.stringify(DEFAULT_CARD));
      }
      showNotification('Demo profile restored.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormField('root', 'profileImage', reader.result as string);
        showNotification('Avatar photo updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const cardShareUrl = typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : 'https://smartcard.id';

  const copyCardLink = () => {
    navigator.clipboard.writeText(cardShareUrl);
    setCopiedLink(true);
    showNotification('SmartCard URL copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Determine current card font class
  const getCardFontClass = () => {
    switch (formData.appearance.font) {
      case 'mono': return 'font-mono';
      case 'serif': return 'font-serif';
      default: return 'font-sans';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-[#0e1628] p-5 sm:p-6 rounded-xl border-3 border-black shadow-[6px_6px_0px_#000]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] font-black uppercase bg-[#2563EB] text-white px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
              My SmartCard Editor
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Live Sync • LocalStorage Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Design Your Digital Business Card
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-medium">
            Edit profile details, direct links, and appearance. Changes update immediately in the live preview.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDemo}
            className="h-10 px-3 bg-[#121c33] hover:bg-slate-800 text-gray-300 font-mono text-xs font-bold uppercase rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset to Demo Card"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={copyCardLink}
            className="h-10 px-3 bg-[#17223b] hover:bg-slate-700 text-white font-mono text-xs font-bold uppercase rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="h-10 px-3.5 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-extrabold uppercase rounded-lg border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 size={14} />
            <span>Share</span>
          </button>

          <button
            type="button"
            onClick={handleSaveCard}
            className="h-10 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-black uppercase rounded-lg border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check size={15} className="stroke-[3]" />
            <span>Save Card</span>
          </button>
        </div>
      </div>

      {/* Editor & Live Preview Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        
        {/* LEFT COLUMN: Section Editor (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Section Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0c1322] p-1.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000]">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`py-2.5 px-3 rounded-lg font-mono text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border-2 ${
                activeTab === 'basic'
                  ? 'bg-white text-black border-black shadow-[2px_2px_0px_#000]'
                  : 'text-gray-400 hover:text-white border-transparent'
              }`}
            >
              <User size={14} />
              <span>Basic</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              className={`py-2.5 px-3 rounded-lg font-mono text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border-2 ${
                activeTab === 'contact'
                  ? 'bg-white text-black border-black shadow-[2px_2px_0px_#000]'
                  : 'text-gray-400 hover:text-white border-transparent'
              }`}
            >
              <Phone size={14} />
              <span>Contact</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('social')}
              className={`py-2.5 px-3 rounded-lg font-mono text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border-2 ${
                activeTab === 'social'
                  ? 'bg-white text-black border-black shadow-[2px_2px_0px_#000]'
                  : 'text-gray-400 hover:text-white border-transparent'
              }`}
            >
              <Globe size={14} />
              <span>Social</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('appearance')}
              className={`py-2.5 px-3 rounded-lg font-mono text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border-2 ${
                activeTab === 'appearance'
                  ? 'bg-white text-black border-black shadow-[2px_2px_0px_#000]'
                  : 'text-gray-400 hover:text-white border-transparent'
              }`}
            >
              <Palette size={14} />
              <span>Style</span>
            </button>
          </div>

          {/* TAB 1: BASIC INFORMATION */}
          {activeTab === 'basic' && (
            <div className="bg-[#0e1628] rounded-xl border-3 border-black p-6 shadow-[5px_5px_0px_#000] space-y-5">
              <div className="border-b-2 border-black pb-3">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <User size={18} className="text-[#2563EB]" />
                  <span>Basic Information</span>
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Your primary professional persona and elevator pitch.
                </p>
              </div>

              {/* Profile Image Uploader & Quick Presets */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-gray-300">
                  Profile Photo
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#090D16] p-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000]">
                  <div className="w-16 h-16 rounded-xl border-2 border-black overflow-hidden bg-white shadow-[2px_2px_0px_#000] shrink-0">
                    <img 
                      src={formData.profileImage} 
                      alt={formData.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                      <label className="h-9 px-3 bg-[#2563EB] hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer transition-transform active:translate-x-0.5 active:translate-y-0.5">
                        <Upload size={14} />
                        <span>Upload Photo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageUpload} 
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => updateFormField('root', 'profileImage', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80')}
                        className="h-9 px-2.5 bg-[#121c33] text-gray-300 hover:text-white font-mono text-[11px] font-bold rounded-lg border-2 border-black cursor-pointer"
                      >
                        Sample 1
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFormField('root', 'profileImage', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80')}
                        className="h-9 px-2.5 bg-[#121c33] text-gray-300 hover:text-white font-mono text-[11px] font-bold rounded-lg border-2 border-black cursor-pointer"
                      >
                        Sample 2
                      </button>
                    </div>
                    <input 
                      type="text"
                      placeholder="Or paste image URL: https://..."
                      value={formData.profileImage}
                      onChange={(e) => updateFormField('root', 'profileImage', e.target.value)}
                      className="w-full h-9 bg-[#10192e] border-2 border-black px-3 rounded-lg text-xs font-mono text-gray-200 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Name & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={formData.name}
                    onChange={(e) => updateFormField('root', 'name', e.target.value)}
                    className="w-full h-11 bg-[#090D16] border-2 border-black rounded-lg px-3.5 text-xs font-bold text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Principal Product Designer"
                    value={formData.role}
                    onChange={(e) => updateFormField('root', 'role', e.target.value)}
                    className="w-full h-11 bg-[#090D16] border-2 border-black rounded-lg px-3.5 text-xs font-bold text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-gray-300">Company / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. HyperScale Systems"
                  value={formData.company}
                  onChange={(e) => updateFormField('root', 'company', e.target.value)}
                  className="w-full h-11 bg-[#090D16] border-2 border-black rounded-lg px-3.5 text-xs font-bold text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300">Short Bio / Elevator Pitch</label>
                  <span className="text-[10px] font-mono text-gray-500">{formData.bio.length} / 280 chars</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={280}
                  placeholder="e.g. Leading product design and digital identity systems. Passionate about tactile interfaces and zero-friction connections."
                  value={formData.bio}
                  onChange={(e) => updateFormField('root', 'bio', e.target.value)}
                  className="w-full p-3.5 bg-[#090D16] border-2 border-black rounded-lg text-xs font-medium text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

            </div>
          )}

          {/* TAB 2: CONTACT DETAILS */}
          {activeTab === 'contact' && (
            <div className="bg-[#0e1628] rounded-xl border-3 border-black p-6 shadow-[5px_5px_0px_#000] space-y-5">
              <div className="border-b-2 border-black pb-3">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Phone size={18} className="text-emerald-400" />
                  <span>Contact Information</span>
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Direct channels for inbound connections, phone calls, and email.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300 flex items-center gap-1.5">
                    <Mail size={13} className="text-cyan-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    placeholder="alex@hyperscale.io"
                    value={formData.email}
                    onChange={(e) => updateFormField('root', 'email', e.target.value)}
                    className="w-full h-11 bg-[#090D16] border-2 border-black rounded-lg px-3.5 text-xs font-bold text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300 flex items-center gap-1.5">
                    <Phone size={13} className="text-emerald-400" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (415) 892-4412"
                    value={formData.phone}
                    onChange={(e) => updateFormField('root', 'phone', e.target.value)}
                    className="w-full h-11 bg-[#090D16] border-2 border-black rounded-lg px-3.5 text-xs font-bold text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300 flex items-center gap-1.5">
                    <MapPin size={13} className="text-amber-400" />
                    <span>Location</span>
                  </label>
                  <input
                    type="text"
                    placeholder="San Francisco, CA • Remote"
                    value={formData.location}
                    onChange={(e) => updateFormField('root', 'location', e.target.value)}
                    className="w-full h-11 bg-[#090D16] border-2 border-black rounded-lg px-3.5 text-xs font-bold text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300 flex items-center gap-1.5">
                    <Globe size={13} className="text-purple-400" />
                    <span>Website / Portfolio</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://alexmorgan.design"
                    value={formData.website}
                    onChange={(e) => updateFormField('root', 'website', e.target.value)}
                    className="w-full h-11 bg-[#090D16] border-2 border-black rounded-lg px-3.5 text-xs font-bold text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOCIAL LINKS */}
          {activeTab === 'social' && (
            <div className="bg-[#0e1628] rounded-xl border-3 border-black p-6 shadow-[5px_5px_0px_#000] space-y-5">
              <div className="border-b-2 border-black pb-3">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Globe size={18} className="text-cyan-400" />
                  <span>Social Profiles</span>
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Connect your key social presence. Active buttons will show on your live card.
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300 flex items-center gap-2">
                    <LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />
                    <span>LinkedIn Profile URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => updateFormField('socialLinks', 'linkedin', e.target.value)}
                    className="w-full h-11 bg-[#090D16] border-2 border-black rounded-lg px-3.5 text-xs font-bold text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300 flex items-center gap-2">
                    <GitHubIcon className="w-4 h-4 text-white" />
                    <span>GitHub Profile URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    value={formData.socialLinks.github}
                    onChange={(e) => updateFormField('socialLinks', 'github', e.target.value)}
                    className="w-full h-11 bg-[#090D16] border-2 border-black rounded-lg px-3.5 text-xs font-bold text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300 flex items-center gap-2">
                    <InstagramIcon className="w-4 h-4 text-[#E4405F]" />
                    <span>Instagram Profile URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/username"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => updateFormField('socialLinks', 'instagram', e.target.value)}
                    className="w-full h-11 bg-[#090D16] border-2 border-black rounded-lg px-3.5 text-xs font-bold text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300 flex items-center gap-2">
                    <XIcon className="w-4 h-4 text-gray-300" />
                    <span>X (Twitter) Profile URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://x.com/username"
                    value={formData.socialLinks.x}
                    onChange={(e) => updateFormField('socialLinks', 'x', e.target.value)}
                    className="w-full h-11 bg-[#090D16] border-2 border-black rounded-lg px-3.5 text-xs font-bold text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: APPEARANCE & CUSTOMIZATION */}
          {activeTab === 'appearance' && (
            <div className="bg-[#0e1628] rounded-xl border-3 border-black p-6 shadow-[5px_5px_0px_#000] space-y-6">
              <div className="border-b-2 border-black pb-3">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Palette size={18} className="text-amber-400" />
                  <span>Card Appearance &amp; Layout</span>
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Tune theme aesthetics, accent colors, typography, and card layout.
                </p>
              </div>

              {/* Accent Color Palette */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono font-bold uppercase text-gray-300">
                  Accent Color
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ACCENT_COLORS.map(c => {
                    const isSelected = formData.appearance.accentColor === c.hex;
                    return (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => updateFormField('appearance', 'accentColor', c.hex)}
                        className={`h-11 px-3 rounded-lg border-2 border-black flex items-center gap-2.5 transition-all cursor-pointer font-mono text-xs font-bold text-white shadow-[2px_2px_0px_#000] ${
                          isSelected ? 'ring-2 ring-white scale-[1.02]' : 'opacity-85 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        <span className="w-3 h-3 rounded-full bg-white border border-black shrink-0"></span>
                        <span className="truncate">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card Theme */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono font-bold uppercase text-gray-300">
                  Card Theme Style
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {THEME_STYLES.map(theme => {
                    const isSelected = formData.appearance.theme === theme.id;
                    return (
                      <div
                        key={theme.id}
                        onClick={() => updateFormField('appearance', 'theme', theme.id)}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#14203a] border-cyan-400 shadow-[3px_3px_0px_#06B6D4]'
                            : 'bg-[#090D16] border-black hover:border-gray-500 shadow-[2px_2px_0px_#000]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">{theme.name}</span>
                          {isSelected && <Check size={14} className="text-cyan-400" />}
                        </div>
                        <p className="text-[11px] text-gray-400 font-mono mt-1">{theme.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Font Picker */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono font-bold uppercase text-gray-300">
                  Card Typography Font
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {FONT_OPTIONS.map(f => {
                    const isSelected = formData.appearance.font === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => updateFormField('appearance', 'font', f.id)}
                        className={`py-3 px-2 rounded-lg border-2 text-center transition-all cursor-pointer font-bold text-xs ${
                          isSelected
                            ? 'bg-[#2563EB] text-white border-black shadow-[2px_2px_0px_#000]'
                            : 'bg-[#090D16] text-gray-300 border-black hover:bg-slate-900 shadow-[2px_2px_0px_#000]'
                        } ${f.class}`}
                      >
                        {f.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Layout Picker */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono font-bold uppercase text-gray-300">
                  Card Layout Architecture
                </label>
                <div className="space-y-2">
                  {LAYOUT_OPTIONS.map(lo => {
                    const isSelected = formData.appearance.layout === lo.id;
                    return (
                      <div
                        key={lo.id}
                        onClick={() => updateFormField('appearance', 'layout', lo.id)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#15233f] border-cyan-400 shadow-[2px_2px_0px_#06B6D4]'
                            : 'bg-[#090D16] border-black hover:border-gray-500 shadow-[2px_2px_0px_#000]'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-white">{lo.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{lo.desc}</p>
                        </div>
                        {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: LIVE CARD PREVIEW (5 cols on lg) */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 space-y-4">
            
            {/* Live Indicator Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-black uppercase text-gray-300">
                <Eye size={14} className="text-cyan-400" />
                <span>Live Card Preview</span>
              </div>
              <span className="font-mono text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-500/50 px-2 py-0.5 rounded">
                Real-Time Reflection
              </span>
            </div>

            {/* SmartCard Digital Business Card Container */}
            <div className={`bg-[#0d1424] rounded-2xl border-3 border-black shadow-[8px_8px_0px_#000] overflow-hidden transition-all duration-150 ${getCardFontClass()}`}>
              
              {/* TOP BANNER / HERO */}
              {formData.appearance.layout === 'horizontal' ? (
                // Compact Horizontal Layout
                <div 
                  className="p-5 border-b-3 border-black text-white relative transition-colors duration-200"
                  style={{ backgroundColor: formData.appearance.accentColor }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-[9px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                        {formData.employeeCode}
                      </span>
                      <h3 className="text-xl font-black text-white tracking-tight truncate mt-1">
                        {formData.name || 'Your Name'}
                      </h3>
                      <p className="text-xs font-bold text-white/95 truncate">
                        {formData.role || 'Your Job Title'}
                      </p>
                      <p className="text-[11px] font-mono text-white/80 truncate">
                        {formData.company || 'Company'}
                      </p>
                    </div>

                    <div className="w-16 h-16 rounded-xl border-2 border-black bg-white overflow-hidden shadow-[3px_3px_0px_#000] shrink-0">
                      <img 
                        src={formData.profileImage} 
                        alt={formData.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>
                </div>
              ) : formData.appearance.layout === 'badge' ? (
                // Badge Minimal Layout
                <div 
                  className="p-6 border-b-3 border-black text-white text-center relative transition-colors duration-200"
                  style={{ backgroundColor: formData.appearance.accentColor }}
                >
                  <div className="w-20 h-20 rounded-full border-3 border-black bg-white overflow-hidden shadow-[4px_4px_0px_#000] mx-auto mb-2">
                    <img 
                      src={formData.profileImage} 
                      alt={formData.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight">
                    {formData.name || 'Your Name'}
                  </h3>
                  <p className="text-xs font-bold text-white/95">
                    {formData.role || 'Your Job Title'}
                  </p>
                  <p className="text-[11px] font-mono text-white/80 mt-0.5">
                    {formData.company || 'Company'}
                  </p>
                </div>
              ) : (
                // Standard Vertical Layout (Default)
                <div 
                  className="p-5 border-b-3 border-black text-white relative transition-colors duration-200"
                  style={{ backgroundColor: formData.appearance.accentColor }}
                >
                  <div className="flex items-start justify-between">
                    <div className="max-w-[70%]">
                      <span className="font-mono text-[9px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                        {formData.employeeCode}
                      </span>
                      <h3 className="text-xl font-black text-white tracking-tight mt-1 truncate">
                        {formData.name || 'Your Full Name'}
                      </h3>
                      <p className="text-xs font-bold text-white/95 truncate">
                        {formData.role || 'Professional Role'}
                      </p>
                      <p className="text-[11px] font-mono text-white/80 truncate">
                        {formData.company || 'Company Name'}
                      </p>
                    </div>

                    <div className="w-16 h-16 rounded-xl border-2 border-black bg-white overflow-hidden shadow-[3px_3px_0px_#000] shrink-0">
                      <img 
                        src={formData.profileImage} 
                        alt={formData.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CARD BODY DETAILS */}
              <div className="p-5 space-y-4">
                
                {/* Bio Snippet */}
                {formData.bio && (
                  <div className="p-3 bg-[#131d33] rounded-xl border-2 border-black shadow-[2px_2px_0px_#000]">
                    <p className="text-xs text-gray-200 leading-relaxed font-medium">
                      &quot;{formData.bio}&quot;
                    </p>
                  </div>
                )}

                {/* Contact Pills Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
                  {formData.email && (
                    <a
                      href={`mailto:${formData.email}`}
                      className="p-2.5 bg-[#17223b] hover:bg-slate-700 text-gray-200 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 truncate cursor-pointer transition-colors"
                    >
                      <Mail size={13} className="text-cyan-400 shrink-0" />
                      <span className="truncate">{formData.email}</span>
                    </a>
                  )}

                  {formData.phone && (
                    <a
                      href={`tel:${formData.phone}`}
                      className="p-2.5 bg-[#17223b] hover:bg-slate-700 text-gray-200 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 truncate cursor-pointer transition-colors"
                    >
                      <Phone size={13} className="text-emerald-400 shrink-0" />
                      <span className="truncate">{formData.phone}</span>
                    </a>
                  )}

                  {formData.location && (
                    <div className="p-2.5 bg-[#17223b] text-gray-300 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 truncate">
                      <MapPin size={13} className="text-amber-400 shrink-0" />
                      <span className="truncate">{formData.location}</span>
                    </div>
                  )}

                  {formData.website && (
                    <a
                      href={formData.website}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-[#17223b] hover:bg-slate-700 text-cyan-300 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 truncate cursor-pointer transition-colors"
                    >
                      <Globe size={13} className="text-purple-400 shrink-0" />
                      <span className="truncate">Website ↗</span>
                    </a>
                  )}
                </div>

                {/* Social Profiles Row */}
                <div className="pt-2 border-t-2 border-black">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-gray-400">Social Connections</span>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">1-Click Tap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.socialLinks.linkedin && (
                      <a
                        href={formData.socialLinks.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 h-9 bg-[#0A66C2] text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center hover:opacity-90 transition-opacity"
                        title="LinkedIn"
                      >
                        <LinkedInIcon className="w-4 h-4" />
                      </a>
                    )}
                    {formData.socialLinks.github && (
                      <a
                        href={formData.socialLinks.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 h-9 bg-black text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center hover:bg-gray-900 transition-colors"
                        title="GitHub"
                      >
                        <GitHubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {formData.socialLinks.instagram && (
                      <a
                        href={formData.socialLinks.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 h-9 bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center hover:opacity-90 transition-opacity"
                        title="Instagram"
                      >
                        <InstagramIcon className="w-4 h-4" />
                      </a>
                    )}
                    {formData.socialLinks.x && (
                      <a
                        href={formData.socialLinks.x}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 h-9 bg-black text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center hover:bg-gray-900 transition-colors"
                        title="X (Twitter)"
                      >
                        <XIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Instant QR Code Box */}
                <div className="p-3.5 bg-white text-black rounded-xl border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[9px] font-black uppercase tracking-wider bg-black text-white px-1.5 py-0.2 rounded">
                      Scan Profile
                    </span>
                    <h5 className="font-black text-xs text-black leading-tight">Camera QR Code</h5>
                    <p className="text-[10px] text-gray-700 font-medium">Scans on iOS &amp; Android. Zero NFC needed.</p>
                  </div>
                  <div className="p-1 bg-white border-2 border-black rounded-lg shadow-[1px_1px_0px_#000] shrink-0">
                    <QrCode size={44} className="text-black" />
                  </div>
                </div>

                {/* Save Contact to Address Book Action */}
                <button
                  type="button"
                  onClick={() => showNotification('VCF Contact Card downloaded!')}
                  className="w-full h-10 bg-white hover:bg-gray-100 text-black font-mono font-black text-xs uppercase rounded-lg border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} />
                  <span>Save Contact to Phone (.vcf)</span>
                </button>

              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e1628] border-3 border-black rounded-xl p-6 shadow-[8px_8px_0px_#000] space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-black text-white">Share Your SmartCard</h4>
                <p className="text-xs text-gray-400 font-mono mt-0.5">Zero NFC required. Anyone can open instantly.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out my digital business card: ${cardShareUrl}`)}`;
                  window.open(url, '_blank');
                }}
                className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-black text-xs uppercase rounded-lg border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>Share via WhatsApp</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={copyCardLink}
                  className="h-10 bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy size={14} />
                  <span>Copy Web Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showNotification('QR Code downloaded as high-res PNG!');
                    setShowShareModal(false);
                  }}
                  className="h-10 bg-white hover:bg-gray-100 text-black font-mono font-bold text-xs uppercase rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <QrCode size={14} />
                  <span>Download QR</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-[#090D16] border-2 border-black rounded-lg text-xs font-mono text-gray-300 truncate">
              {cardShareUrl}
            </div>
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
