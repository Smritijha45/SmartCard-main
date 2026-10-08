'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip 
} from 'recharts';
import { 
  Eye, Share2, Users, Sparkles, QrCode, 
  Download, Mail, Phone, Globe, ExternalLink, Check, Copy, 
  Edit3, Palette, BarChart3, Clock, ArrowRight, X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/components/providers/ThemeProvider';
import { QRCodeComponent } from '@/components/QRCode';
import { ShareCard } from '@/components/ShareCard';

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

const ANALYTICS_DATA_7D = [
  { day: 'Mon', views: 164, shares: 42, clicks: 88 },
  { day: 'Tue', views: 198, shares: 51, clicks: 114 },
  { day: 'Wed', views: 245, shares: 68, clicks: 142 },
  { day: 'Thu', views: 218, shares: 58, clicks: 126 },
  { day: 'Fri', views: 284, shares: 82, clicks: 178 },
  { day: 'Sat', views: 142, shares: 35, clicks: 76 },
  { day: 'Sun', views: 233, shares: 56, clicks: 120 },
];

const ANALYTICS_DATA_30D = [
  { day: 'W1', views: 680, shares: 180, clicks: 390 },
  { day: 'W2', views: 820, shares: 210, clicks: 470 },
  { day: 'W3', views: 990, shares: 260, clicks: 580 },
  { day: 'W4', views: 1284, shares: 342, clicks: 720 },
];

export default function DashboardPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [userName, setUserName] = useState('Smriti Jha');
  const [userUsername, setUserUsername] = useState('smriti');
  const [userRole, setUserRole] = useState('Full Stack Developer');
  const [userCompany, setUserCompany] = useState('SmartCard Technologies');
  const [userBio, setUserBio] = useState('Building modern web experiences. 100% digital, zero NFC hardware needed.');
  const [userAvatar, setUserAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');
  const [userEmail, setUserEmail] = useState('smriti@smartcard.app');
  const [userPhone, setUserPhone] = useState('+91 98765 43210');
  const [userWebsite, setUserWebsite] = useState('smartcard.app/smriti');
  const [cardThemeColor, setCardThemeColor] = useState('#2563EB');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [chartTimeframe, setChartTimeframe] = useState<'7D' | '30D'>('7D');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('smartcard_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.name) setUserName(parsed.name);
          if (parsed.role) setUserRole(parsed.role);
          if (parsed.company) setUserCompany(parsed.company);
          if (parsed.email) setUserEmail(parsed.email);
          if (parsed.avatar) setUserAvatar(parsed.avatar);
          if (parsed.username) setUserUsername(parsed.username);
        } catch (e) {
          console.error(e);
        }
      }

      const storedCard = localStorage.getItem('smartcard_current_card');
      if (storedCard) {
        try {
          const card = JSON.parse(storedCard);
          if (card.name) setUserName(card.name);
          if (card.role || card.title) setUserRole(card.role || card.title);
          if (card.company) setUserCompany(card.company);
          if (card.bio) setUserBio(card.bio);
          if (card.profileImage) setUserAvatar(card.profileImage);
          if (card.email) setUserEmail(card.email);
          if (card.phone) setUserPhone(card.phone);
          if (card.website) setUserWebsite(card.website);
          if (card.username) setUserUsername(card.username);
          if (card.appearance?.accentColor || card.cardTheme) setCardThemeColor(card.appearance?.accentColor || card.cardTheme);
        } catch (e) {
          console.error(e);
        }
      }

      // Fetch live data from backend API
      fetch('/api/cards')
        .then((res) => res.json())
        .then((data) => {
          const list = Array.isArray(data) ? data : data.data || [];
          if (list.length > 0) {
            const card = list[0];
            if (card.name) setUserName(card.name);
            if (card.role || card.title) setUserRole(card.role || card.title);
            if (card.company) setUserCompany(card.company);
            if (card.bio) setUserBio(card.bio);
            if (card.profileImage) setUserAvatar(card.profileImage);
            if (card.email) setUserEmail(card.email);
            if (card.phone) setUserPhone(card.phone);
            if (card.website) setUserWebsite(card.website);
            if (card.username) setUserUsername(card.username);
            if (card.cardTheme || card.appearance?.accentColor) setCardThemeColor(card.cardTheme || card.appearance?.accentColor);
          }
        })
        .catch(() => {});
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/${userUsername}` : `https://smartcard.app/${userUsername}`;
    if (typeof navigator !== 'undefined') {
      navigator.clipboard?.writeText(url);
    }
    showToast('Card link copied to clipboard!');
  };

  const chartData = chartTimeframe === '7D' ? ANALYTICS_DATA_7D : ANALYTICS_DATA_30D;

  return (
    <div className="space-y-6 animate-subtle-fade">
      
      {/* 13. STATS & OVERVIEW BAR */}
      <div className="space-y-5">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-[#131924] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium mb-2">
              <Sparkles size={12} />
              <span>Digital Identity Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Good morning, Smriti 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              Here&apos;s how your SmartCard is performing.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              onClick={() => setShareModalOpen(true)}
              size="md"
            >
              <Share2 size={14} />
              <span>Share SmartCard</span>
            </Button>
            <Link href={`/${userUsername}`} target="_blank">
              <Button variant="primary" size="md">
                <span>View Live Card</span>
                <ExternalLink size={14} />
              </Button>
            </Link>
          </div>
        </div>

        {/* 5 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          
          {/* Stat 1: Profile Views */}
          <div className="p-4.5 bg-white dark:bg-[#131924] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Profile Views
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Eye size={14} />
              </div>
            </div>
            <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              1,284
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <span>+18.4%</span>
              <span className="text-slate-400 font-normal">vs last week</span>
            </div>
          </div>

          {/* Stat 2: Link Clicks */}
          <div className="p-4.5 bg-white dark:bg-[#131924] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Link Clicks
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Globe size={14} />
              </div>
            </div>
            <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              438
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              <span>+29.1%</span>
              <span className="text-slate-400 font-normal">vCard &amp; links</span>
            </div>
          </div>

          {/* Stat 3: Shares */}
          <div className="p-4.5 bg-white dark:bg-[#131924] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Shares
              </span>
              <div className="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Share2 size={14} />
              </div>
            </div>
            <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              126
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
              <span>+12.6%</span>
              <span className="text-slate-400 font-normal">QR &amp; direct</span>
            </div>
          </div>

          {/* Stat 4: Contacts */}
          <div className="p-4.5 bg-white dark:bg-[#131924] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Contacts
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Users size={14} />
              </div>
            </div>
            <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              84
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <span>+24 new</span>
              <span className="text-slate-400 font-normal">leads</span>
            </div>
          </div>

          {/* Stat 5: Profile Completion */}
          <div className="p-4.5 bg-white dark:bg-[#131924] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Profile Completion
              </span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Sparkles size={14} />
              </div>
            </div>
            <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              92%
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-blue-600 rounded-full w-[92%]"></div>
            </div>
          </div>

        </div>

      </div>

      {/* 14. SMARTCARD PREVIEW & 15. QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* 14. SMARTCARD PREVIEW (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#131924] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Live Preview
              </span>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                Your SmartCard
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Active • Public</span>
            </div>
          </div>

          {/* Minimalist Executive Card Component */}
          <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
            
            {/* Header Banner */}
            <div 
              className="p-5 text-white flex items-start justify-between gap-4 transition-colors duration-200"
              style={{ backgroundColor: cardThemeColor }}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-medium bg-black/25 text-white/90 px-2 py-0.5 rounded backdrop-blur-xs">
                  SMART-001
                </span>
                <h3 className="text-xl font-semibold text-white tracking-tight mt-1">
                  {userName}
                </h3>
                <p className="text-xs font-medium text-white/95">
                  {userRole}
                </p>
                <p className="text-[11px] text-white/80">
                  {userCompany}
                </p>
              </div>

              {/* Profile Image */}
              <div className="w-16 h-16 rounded-full ring-2 ring-white/30 bg-white/10 overflow-hidden shadow-xs shrink-0">
                <img 
                  src={userAvatar} 
                  alt={userName} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-4">
              
              {/* Bio */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                &ldquo;{userBio}&rdquo;
              </p>

              {/* Email, Phone, Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
                <a 
                  href={`mailto:${userEmail}`}
                  className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 truncate transition-colors"
                >
                  <Mail size={13} className="text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="truncate">{userEmail}</span>
                </a>
                <a 
                  href={`tel:${userPhone}`}
                  className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 truncate transition-colors"
                >
                  <Phone size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">{userPhone}</span>
                </a>
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                <Globe size={13} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-slate-400 text-[11px]">URL:</span>
                <span className="truncate text-slate-900 dark:text-slate-100">{userWebsite}</span>
              </div>

              {/* Socials */}
              <div className="grid grid-cols-2 gap-2">
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <LinkedInIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>LinkedIn</span>
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <GitHubIcon className="w-3.5 h-3.5 text-slate-900 dark:text-slate-100" />
                  <span>GitHub</span>
                </a>
              </div>

              {/* QR Code section: Your SmartCard QR */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      Your SmartCard
                    </span>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Scan to connect
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQrModalOpen(true)}
                    className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Expand
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex flex-col items-center gap-2.5">
                  <QRCodeComponent
                    value={typeof window !== 'undefined' ? `${window.location.origin}/${userUsername}` : `https://smartcard.app/${userUsername}`}
                    username={userUsername}
                    name={userName}
                    size={150}
                    accentColor={cardThemeColor}
                    compact={true}
                    showDownload={true}
                    showCopy={true}
                    showShare={true}
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Action Buttons: Edit, Share, View Public, QR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <Link href="/cards">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full text-xs"
              >
                <Edit3 size={13} />
                <span>Edit</span>
              </Button>
            </Link>

            <Button 
              onClick={() => setShareModalOpen(true)}
              variant="secondary" 
              size="sm"
              className="w-full text-xs"
            >
              <Share2 size={13} />
              <span>Share</span>
            </Button>

            <Link href={`/${userUsername}`} target="_blank">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full text-xs"
              >
                <ExternalLink size={13} />
                <span>Public</span>
              </Button>
            </Link>

            <Button 
              onClick={() => setQrModalOpen(true)}
              variant="secondary" 
              size="sm"
              className="w-full text-xs"
            >
              <QrCode size={13} />
              <span>QR Code</span>
            </Button>
          </div>

        </div>

        {/* 15. QUICK ACTIONS (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#131924] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-medium text-slate-400">
              Shortcuts
            </span>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            
            <Link 
              href="/profile"
              className="p-3.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800/80 transition-colors flex items-center gap-3.5 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <Edit3 size={16} />
              </div>
              <div className="truncate">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Edit Profile
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Update professional credentials
                </p>
              </div>
            </Link>

            <Link 
              href="/cards"
              className="p-3.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800/80 transition-colors flex items-center gap-3.5 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                <Palette size={16} />
              </div>
              <div className="truncate">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  Customize Design
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Change color, badges, and layout
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full text-left p-3.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800/80 transition-colors flex items-center gap-3.5 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Copy size={16} />
              </div>
              <div className="truncate">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Copy Share Link
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Instant smartcard.app link
                </p>
              </div>
            </button>

            <Link 
              href="/analytics"
              className="p-3.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800/80 transition-colors flex items-center gap-3.5 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <BarChart3 size={16} />
              </div>
              <div className="truncate">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Detailed Analytics
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Traffic channels and conversion rates
                </p>
              </div>
            </Link>

          </div>
        </div>

      </div>

      {/* 16. ANALYTICS PREVIEW & 17. RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* 16. ANALYTICS PREVIEW (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#131924] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Activity Trends
              </span>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                Analytics Overview
              </h2>
            </div>

            {/* Timeframe Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-lg">
              <button
                type="button"
                onClick={() => setChartTimeframe('7D')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  chartTimeframe === '7D'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => setChartTimeframe('30D')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  chartTimeframe === '30D'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          {/* Chart Display */}
          <div className="h-[260px] w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 5, left: -10 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorShares" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke={isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)'} 
                />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: isDark ? '#94A3B8' : '#64748B' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: isDark ? '#94A3B8' : '#64748B' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? 'rgba(19, 25, 36, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    color: isDark ? '#ffffff' : '#0F172A',
                    fontSize: '12px',
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#2563EB" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="shares" 
                  stroke="#06B6D4" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorShares)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#F59E0B" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorClicks)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                <span className="text-slate-600 dark:text-slate-400">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full"></span>
                <span className="text-slate-600 dark:text-slate-400">Shares</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                <span className="text-slate-600 dark:text-slate-400">Clicks</span>
              </div>
            </div>

            <Link href="/analytics" className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1">
              <span>Full Analytics Hub</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* 17. RECENT ACTIVITY (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#131924] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-xs font-medium text-slate-400">
                Live Audit
              </span>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                Recent Activity
              </h2>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>

          <div className="space-y-2.5">
            {[
              {
                text: "Your profile received 24 new views.",
                time: "12m ago",
                badge: "Views",
              },
              {
                text: "Someone shared your SmartCard link.",
                time: "45m ago",
                badge: "Shares",
              },
              {
                text: "Your LinkedIn link was clicked.",
                time: "2h ago",
                badge: "Clicks",
              },
              {
                text: "Profile completion reached 92%.",
                time: "5h ago",
                badge: "System",
              },
              {
                text: "New contact card exchanged: Sarah Chen",
                time: "1d ago",
                badge: "Leads",
              }
            ].map((act, index) => (
              <div 
                key={index}
                className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                    {act.badge}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock size={11} />
                    {act.time}
                  </span>
                </div>
                <p className="text-xs font-normal text-slate-800 dark:text-slate-200">
                  {act.text}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-1">
            <Link href="/notifications">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full text-xs font-medium"
              >
                View Full Audit History
              </Button>
            </Link>
          </div>
        </div>

      </div>

      {/* Share Card Modal */}
      <ShareCard
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        username={userUsername}
        name={userName}
        title={userRole}
        company={userCompany}
        profileImage={userAvatar}
        onOpenQR={() => setQrModalOpen(true)}
        onToast={showToast}
      />

      {/* QR Code Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-subtle-fade">
          <div className="bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 max-w-sm w-full space-y-4 text-center relative">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Live SmartCard QR Code
              </span>
              <button 
                onClick={() => setQrModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <QRCodeComponent
              value={typeof window !== 'undefined' ? `${window.location.origin}/${userUsername}` : `https://smartcard.app/${userUsername}`}
              username={userUsername}
              name={userName}
              size={200}
              accentColor={cardThemeColor}
              showDownload={true}
              showShare={true}
              showCopy={true}
            />
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl text-xs font-medium shadow-lg flex items-center gap-2 animate-subtle-fade">
          <Check size={14} className="text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
