'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, Sparkles, User, Mail, Phone, MapPin, Globe, 
  Palette, Layout, Check, Copy, Share2, Eye, RotateCcw, 
  Camera, Upload, Download, QrCode, MessageCircle, ExternalLink, X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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
  { name: 'Royal Blue', hex: '#2563EB' },
  { name: 'Cyan', hex: '#06B6D4' },
  { name: 'Sunset Amber', hex: '#F59E0B' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Violet', hex: '#8B5CF6' },
  { name: 'Rose', hex: '#F43F5E' },
];

const THEME_STYLES = [
  { id: 'minimal-modern', name: 'Minimal Modern', desc: 'Subtle borders and soft elevation' },
  { id: 'executive-dark', name: 'Executive Dark', desc: 'Deep charcoal contrast with crisp text' },
  { id: 'accent-glow', name: 'Accent Glow', desc: 'Refined brand highlight with subtle gradients' },
  { id: 'clean-slate', name: 'Clean Slate', desc: 'Pure neutral palette with large whitespace' },
];

const FONT_OPTIONS = [
  { id: 'sans', name: 'Sans (Geist)', class: 'font-sans' },
  { id: 'mono', name: 'Mono', class: 'font-mono' },
  { id: 'serif', name: 'Serif', class: 'font-serif' },
];

const LAYOUT_OPTIONS = [
  { id: 'vertical', name: 'Standard Vertical', desc: 'Executive banner, avatar, contact actions' },
  { id: 'horizontal', name: 'Compact Horizontal', desc: 'Split hero header with right-aligned avatar' },
  { id: 'badge', name: 'Minimal Badge', desc: 'Centered profile card with prominent QR' },
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
    theme: 'minimal-modern',
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCard = localStorage.getItem('smartcard_current_card');
      if (savedCard) {
        try {
          const parsed = JSON.parse(savedCard);
          setFormData(prev => ({
            ...prev,
            ...parsed,
            appearance: { ...prev.appearance, ...(parsed.appearance || {}) },
            socialLinks: { ...prev.socialLinks, ...(parsed.socialLinks || {}) },
          }));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const updateFormField = (section: string, field: string, value: any) => {
    setFormData(prev => {
      let updated;
      if (section === 'root') {
        updated = { ...prev, [field]: value };
      } else {
        updated = {
          ...prev,
          [section]: {
            ...(prev as any)[section],
            [field]: value
          }
        };
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('smartcard_current_card', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleSaveCard = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('smartcard_current_card', JSON.stringify(formData));
    }
    showNotification('SmartCard changes saved successfully!');
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

  const cardShareUrl = typeof window !== 'undefined' ? `${window.location.origin}/smriti` : 'https://smartcard.app/smriti';

  const copyCardLink = () => {
    navigator.clipboard.writeText(cardShareUrl);
    setCopiedLink(true);
    showNotification('SmartCard URL copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getCardFontClass = () => {
    switch (formData.appearance.font) {
      case 'mono': return 'font-mono';
      case 'serif': return 'font-serif';
      default: return 'font-sans';
    }
  };

  const getCardThemeClasses = () => {
    switch (formData.appearance.theme) {
      case 'executive-dark':
        return {
          container: 'bg-[#0F172A] text-slate-100 border border-slate-700/80 shadow-xl',
          bioBox: 'bg-[#1E293B] border border-slate-700/60 text-slate-300',
          channelPill: 'bg-[#1E293B] hover:bg-[#273549] text-slate-200 border border-slate-700/60',
          qrBox: 'bg-[#1E293B] border border-slate-700/60 text-slate-100',
          qrLabel: 'text-slate-100',
          qrSub: 'text-slate-400',
          vcfBtn: 'bg-white hover:bg-slate-100 text-slate-900',
          socialBtn: 'bg-[#1E293B] hover:bg-[#273549] text-slate-200 border border-slate-700/60',
          subtext: 'text-slate-400',
          divider: 'border-slate-800',
        };
      case 'clean-slate':
        return {
          container: 'bg-[#FAFAF9] text-stone-900 border border-stone-200 shadow-md',
          bioBox: 'bg-[#F5F5F4] border border-stone-200 text-stone-700',
          channelPill: 'bg-[#F5F5F4] hover:bg-[#E7E5E4] text-stone-800 border border-stone-200',
          qrBox: 'bg-[#F5F5F4] border border-stone-200 text-stone-900',
          qrLabel: 'text-stone-900',
          qrSub: 'text-stone-500',
          vcfBtn: 'bg-stone-900 hover:bg-stone-800 text-white',
          socialBtn: 'bg-[#F5F5F4] hover:bg-[#E7E5E4] text-stone-800 border border-stone-200',
          subtext: 'text-stone-400',
          divider: 'border-stone-200',
        };
      case 'accent-glow':
        return {
          container: 'bg-white text-slate-900 border border-blue-200/90 shadow-lg ring-1 ring-blue-500/20',
          bioBox: 'bg-blue-50/50 border border-blue-100 text-slate-700',
          channelPill: 'bg-slate-50 hover:bg-blue-50/60 text-slate-800 border border-slate-200/80',
          qrBox: 'bg-blue-50/50 border border-blue-100 text-slate-900',
          qrLabel: 'text-slate-900',
          qrSub: 'text-slate-500',
          vcfBtn: 'bg-blue-600 hover:bg-blue-700 text-white',
          socialBtn: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/80',
          subtext: 'text-slate-400',
          divider: 'border-slate-100',
        };
      case 'minimal-modern':
      default:
        return {
          container: 'bg-white text-slate-900 border border-slate-200/90 shadow-md',
          bioBox: 'bg-slate-50 border border-slate-100 text-slate-700',
          channelPill: 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80',
          qrBox: 'bg-slate-50 border border-slate-200/80 text-slate-900',
          qrLabel: 'text-slate-900',
          qrSub: 'text-slate-500',
          vcfBtn: 'bg-slate-900 hover:bg-slate-800 text-white',
          socialBtn: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/80',
          subtext: 'text-slate-400',
          divider: 'border-slate-100',
        };
    }
  };

  return (
    <div className="space-y-6 animate-subtle-fade">
      
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white dark:bg-[#131924] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md">
              Card Editor
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Live Sync Active</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Edit Your SmartCard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Edit profile details, links, and appearance. Updates reflect instantly in real-time.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDemo}
            title="Reset to Demo Card"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={copyCardLink}
          >
            {copiedLink ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
            <span>{copiedLink ? 'Copied' : 'Copy'}</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowShareModal(true)}
          >
            <Share2 size={13} />
            <span>Share</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveCard}
          >
            <Check size={14} />
            <span>Save Card</span>
          </Button>
        </div>
      </div>

      {/* Main Workspace Layout: 7 Cols Editor | 5 Cols Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: EDIT CONTROLS */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Segmented Tab Headers */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeTab === 'basic' 
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Basic Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              className={`py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeTab === 'contact' 
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Contact
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('social')}
              className={`py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeTab === 'social' 
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Social
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('appearance')}
              className={`py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeTab === 'appearance' 
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Design
            </button>
          </div>

          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="bg-white dark:bg-[#131924] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <User size={16} className="text-blue-600 dark:text-blue-400" />
                  <span>Profile Information</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Your core professional identity shown on the card header.
                </p>
              </div>

              {/* Avatar Uploader */}
              <div className="flex items-center gap-4 p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <div className="w-14 h-14 rounded-full ring-2 ring-slate-200 dark:ring-slate-700 overflow-hidden shrink-0">
                  <img src={formData.profileImage} alt={formData.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <label 
                    htmlFor="avatarInput" 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer transition-colors"
                  >
                    <Upload size={13} />
                    <span>Upload Avatar</span>
                  </label>
                  <input id="avatarInput" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <p className="text-[11px] text-slate-400">JPG, PNG, or WebP. Optimal 400x400.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => updateFormField('root', 'name', e.target.value)}
                    placeholder="Alex Morgan"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Badge Code</label>
                  <Input
                    value={formData.employeeCode}
                    onChange={(e) => updateFormField('root', 'employeeCode', e.target.value)}
                    placeholder="SMART-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Job Title / Role</label>
                  <Input
                    value={formData.role}
                    onChange={(e) => updateFormField('root', 'role', e.target.value)}
                    placeholder="Head of Product"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Company</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => updateFormField('root', 'company', e.target.value)}
                    placeholder="SmartCard Technologies"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Bio / Elevator Pitch</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => updateFormField('root', 'bio', e.target.value)}
                  placeholder="Short introduction..."
                  className="w-full p-3 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT DETAILS */}
          {activeTab === 'contact' && (
            <div className="bg-white dark:bg-[#131924] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Mail size={16} className="text-blue-600 dark:text-blue-400" />
                  <span>Contact Channels</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Direct channels for visitors to call, email, or visit your portfolio.
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormField('root', 'email', e.target.value)}
                    placeholder="you@company.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormField('root', 'phone', e.target.value)}
                    placeholder="+1 555 0192"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Location / Headquarters</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => updateFormField('root', 'location', e.target.value)}
                    placeholder="San Francisco, CA • Remote"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Personal Website / Portfolio</label>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateFormField('root', 'website', e.target.value)}
                    placeholder="https://yourname.design"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOCIAL LINKS */}
          {activeTab === 'social' && (
            <div className="bg-white dark:bg-[#131924] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Globe size={16} className="text-blue-600 dark:text-blue-400" />
                  <span>Social Profiles</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Active profiles appear as tap targets on your card.
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <LinkedInIcon className="w-3.5 h-3.5 text-[#0A66C2]" />
                    <span>LinkedIn URL</span>
                  </label>
                  <Input
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => updateFormField('socialLinks', 'linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <GitHubIcon className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200" />
                    <span>GitHub URL</span>
                  </label>
                  <Input
                    type="url"
                    value={formData.socialLinks.github}
                    onChange={(e) => updateFormField('socialLinks', 'github', e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <InstagramIcon className="w-3.5 h-3.5 text-[#E4405F]" />
                    <span>Instagram URL</span>
                  </label>
                  <Input
                    type="url"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => updateFormField('socialLinks', 'instagram', e.target.value)}
                    placeholder="https://instagram.com/username"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <XIcon className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200" />
                    <span>X (Twitter) URL</span>
                  </label>
                  <Input
                    type="url"
                    value={formData.socialLinks.x}
                    onChange={(e) => updateFormField('socialLinks', 'x', e.target.value)}
                    placeholder="https://x.com/username"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: APPEARANCE & CUSTOMIZATION */}
          {activeTab === 'appearance' && (
            <div className="bg-white dark:bg-[#131924] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Palette size={16} className="text-amber-500" />
                  <span>Card Appearance &amp; Layout</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Tune accent colors, typography, and card presentation style.
                </p>
              </div>

              {/* Accent Color Palette */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Accent Color
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {ACCENT_COLORS.map(c => {
                    const isSelected = formData.appearance.accentColor === c.hex;
                    return (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => updateFormField('appearance', 'accentColor', c.hex)}
                        className={`h-8 px-3 rounded-lg text-xs font-medium text-white flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-slate-900 scale-102' : 'opacity-85 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card Theme */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Theme Preset
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {THEME_STYLES.map(theme => {
                    const isSelected = formData.appearance.theme === theme.id;
                    return (
                      <div
                        key={theme.id}
                        onClick={() => updateFormField('appearance', 'theme', theme.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-50/70 dark:bg-blue-900/20 border-blue-500/70 shadow-2xs'
                            : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-900 dark:text-slate-100">{theme.name}</span>
                          {isSelected && <Check size={13} className="text-blue-600 dark:text-blue-400" />}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{theme.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Font Picker */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Typography
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {FONT_OPTIONS.map(f => {
                    const isSelected = formData.appearance.font === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => updateFormField('appearance', 'font', f.id)}
                        className={`py-2 px-2 rounded-lg border text-center transition-all cursor-pointer text-xs font-medium ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 font-semibold'
                            : 'bg-white dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                        } ${f.class}`}
                      >
                        {f.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Layout Picker */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Card Layout
                </label>
                <div className="space-y-2">
                  {LAYOUT_OPTIONS.map(lo => {
                    const isSelected = formData.appearance.layout === lo.id;
                    return (
                      <div
                        key={lo.id}
                        onClick={() => updateFormField('appearance', 'layout', lo.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50/70 dark:bg-blue-900/20 border-blue-500/70'
                            : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-medium text-slate-900 dark:text-slate-100">{lo.name}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{lo.desc}</p>
                        </div>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
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
          <div className="sticky top-20 space-y-3">
            
            {/* Live Indicator Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                <Eye size={13} className="text-blue-600 dark:text-blue-400" />
                <span>Live Card Preview</span>
              </div>
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md">
                Real-Time
              </span>
            </div>

            {/* SmartCard Minimalist Digital Business Card Container */}
            {(() => {
              const cardStyle = getCardThemeClasses();
              return (
                <div className={`rounded-2xl overflow-hidden transition-all duration-150 ${cardStyle.container} ${getCardFontClass()}`}>
                  
                  {/* TOP BANNER / HERO */}
                  {formData.appearance.layout === 'horizontal' ? (
                    <div 
                      className="p-5 text-white relative transition-colors duration-200"
                      style={{ backgroundColor: formData.appearance.accentColor }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-medium bg-black/25 text-white/90 px-2 py-0.5 rounded backdrop-blur-xs">
                            {formData.employeeCode}
                          </span>
                          <h3 className="text-lg font-semibold text-white tracking-tight truncate mt-1">
                            {formData.name || 'Your Name'}
                          </h3>
                          <p className="text-xs font-medium text-white/90 truncate">
                            {formData.role || 'Your Job Title'}
                          </p>
                          <p className="text-[11px] text-white/75 truncate">
                            {formData.company || 'Company'}
                          </p>
                        </div>

                        <div className="w-16 h-16 rounded-full ring-2 ring-white/30 bg-white/10 overflow-hidden shrink-0">
                          <img 
                            src={formData.profileImage} 
                            alt={formData.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </div>
                    </div>
                  ) : formData.appearance.layout === 'badge' ? (
                    <div 
                      className="p-5 text-white text-center relative transition-colors duration-200"
                      style={{ backgroundColor: formData.appearance.accentColor }}
                    >
                      <div className="w-16 h-16 rounded-full ring-2 ring-white/30 bg-white/10 mx-auto overflow-hidden shadow-xs">
                        <img 
                          src={formData.profileImage} 
                          alt={formData.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-white tracking-tight mt-2">
                        {formData.name || 'Your Name'}
                      </h3>
                      <p className="text-xs font-medium text-white/90">
                        {formData.role || 'Your Job Title'}
                      </p>
                      <p className="text-[11px] text-white/75">
                        {formData.company || 'Company'}
                      </p>
                    </div>
                  ) : (
                    <div 
                      className="p-5 text-white relative transition-colors duration-200"
                      style={{ backgroundColor: formData.appearance.accentColor }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <span className="text-[10px] font-medium bg-black/25 text-white/90 px-2 py-0.5 rounded backdrop-blur-xs">
                            {formData.employeeCode}
                          </span>
                          <h3 className="text-lg font-semibold text-white tracking-tight truncate pt-1">
                            {formData.name || 'Your Name'}
                          </h3>
                          <p className="text-xs font-medium text-white/90 truncate">
                            {formData.role || 'Job Title'}
                          </p>
                          <p className="text-[11px] text-white/75 truncate">
                            {formData.company || 'Company'}
                          </p>
                        </div>

                        <div className="w-16 h-16 rounded-full ring-2 ring-white/30 bg-white/10 overflow-hidden shrink-0">
                          <img 
                            src={formData.profileImage} 
                            alt={formData.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CARD DETAILS BODY */}
                  <div className="p-4 space-y-3.5">
                    
                    {formData.bio && (
                      <p className={`text-xs leading-relaxed p-3 rounded-xl border ${cardStyle.bioBox}`}>
                        &ldquo;{formData.bio}&rdquo;
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
                      {formData.email && (
                        <a 
                          href={`mailto:${formData.email}`} 
                          className={`p-2 rounded-lg flex items-center gap-1.5 truncate transition-colors ${cardStyle.channelPill}`}
                        >
                          <Mail size={13} className="text-blue-600 shrink-0" />
                          <span className="truncate">{formData.email}</span>
                        </a>
                      )}

                      {formData.phone && (
                        <a 
                          href={`tel:${formData.phone}`} 
                          className={`p-2 rounded-lg flex items-center gap-1.5 truncate transition-colors ${cardStyle.channelPill}`}
                        >
                          <Phone size={13} className="text-emerald-600 shrink-0" />
                          <span className="truncate">{formData.phone}</span>
                        </a>
                      )}

                      {formData.location && (
                        <div className={`p-2 rounded-lg flex items-center gap-1.5 truncate ${cardStyle.channelPill}`}>
                          <MapPin size={13} className="text-amber-500 shrink-0" />
                          <span className="truncate">{formData.location}</span>
                        </div>
                      )}

                      {formData.website && (
                        <a
                          href={formData.website}
                          target="_blank"
                          rel="noreferrer"
                          className={`p-2 rounded-lg flex items-center gap-1.5 truncate transition-colors ${cardStyle.channelPill}`}
                        >
                          <Globe size={13} className="text-blue-600 shrink-0" />
                          <span className="truncate">Website</span>
                        </a>
                      )}
                    </div>

                    {/* Social Profiles Row */}
                    <div className={`pt-2 border-t ${cardStyle.divider}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-medium uppercase tracking-wider ${cardStyle.subtext}`}>Social Links</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {formData.socialLinks.linkedin && (
                          <a
                            href={formData.socialLinks.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 h-8 bg-blue-500/10 text-blue-600 rounded-lg border border-blue-500/20 flex items-center justify-center hover:opacity-90 transition-opacity"
                            title="LinkedIn"
                          >
                            <LinkedInIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {formData.socialLinks.github && (
                          <a
                            href={formData.socialLinks.github}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex-1 h-8 rounded-lg flex items-center justify-center transition-colors ${cardStyle.socialBtn}`}
                            title="GitHub"
                          >
                            <GitHubIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {formData.socialLinks.instagram && (
                          <a
                            href={formData.socialLinks.instagram}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 h-8 bg-rose-500/10 text-rose-600 rounded-lg border border-rose-500/20 flex items-center justify-center hover:opacity-90 transition-opacity"
                            title="Instagram"
                          >
                            <InstagramIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {formData.socialLinks.x && (
                          <a
                            href={formData.socialLinks.x}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex-1 h-8 rounded-lg flex items-center justify-center transition-colors ${cardStyle.socialBtn}`}
                            title="X (Twitter)"
                          >
                            <XIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Instant QR Code Box */}
                    <div className={`p-3 rounded-xl flex items-center justify-between gap-3 ${cardStyle.qrBox}`}>
                      <div className="space-y-0.5">
                        <span className={`text-[10px] font-medium uppercase tracking-wider ${cardStyle.subtext}`}>
                          Scan Profile
                        </span>
                        <h5 className={`font-semibold text-xs ${cardStyle.qrLabel}`}>Camera QR Code</h5>
                        <p className={`text-[11px] ${cardStyle.qrSub}`}>Direct address book save on iOS &amp; Android</p>
                      </div>
                      <div className="p-1 bg-white rounded-lg border border-slate-200 shadow-2xs shrink-0">
                        <QrCode size={40} className="text-slate-900" />
                      </div>
                    </div>

                    {/* Save Contact to Address Book Action */}
                    <button
                      type="button"
                      onClick={() => showNotification('VCF Contact Card downloaded!')}
                      className={`w-full h-10 font-medium text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${cardStyle.vcfBtn}`}
                    >
                      <Download size={14} />
                      <span>Save Contact to Phone (.vcf)</span>
                    </button>

                  </div>

                </div>
              );
            })()}

          </div>
        </div>

      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-subtle-fade">
          <div className="w-full max-w-md bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">Share Your SmartCard</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Zero NFC required. Anyone can open instantly.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out my digital business card: ${cardShareUrl}`)}`;
                  window.open(url, '_blank');
                }}
                className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <MessageCircle size={15} />
                <span>Share via WhatsApp</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={copyCardLink}
                  className="w-full"
                >
                  <Copy size={13} />
                  <span>Copy Web Link</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    showNotification('QR Code downloaded!');
                    setShowShareModal(false);
                  }}
                  className="w-full"
                >
                  <QrCode size={13} />
                  <span>Download QR</span>
                </Button>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400 truncate">
              {cardShareUrl}
            </div>
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
