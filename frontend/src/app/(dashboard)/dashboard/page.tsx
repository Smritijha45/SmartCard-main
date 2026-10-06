'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip 
} from 'recharts';
import { 
  Eye, Share2, Users, ArrowUpRight, Sparkles, QrCode, 
  Download, Mail, Phone, Globe, ExternalLink, Check, Copy, 
  Edit3, Palette, BarChart3, Clock, ArrowRight, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// SVG Icons for LinkedIn and GitHub
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

// Analytics Dummy Data for views, shares, and clicks
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
  const [userName, setUserName] = useState('Alex Morgan');
  const [userRole, setUserRole] = useState('Head of Product');
  const [userCompany, setUserCompany] = useState('SmartCard Technologies');
  const [userBio, setUserBio] = useState('Scaling digital identity platforms. 100% digital, zero NFC hardware needed.');
  const [userAvatar, setUserAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');
  const [userEmail, setUserEmail] = useState('alex@smartcard.id');
  const [userPhone, setUserPhone] = useState('+1 (415) 555-0192');
  const [userWebsite, setUserWebsite] = useState('smartcard.id/alex');
  const [cardThemeColor, setCardThemeColor] = useState('#2563EB');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [chartTimeframe, setChartTimeframe] = useState<'7D' | '30D'>('7D');
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
        } catch (e) {
          console.error(e);
        }
      }

      const storedCard = localStorage.getItem('smartcard_current_card');
      if (storedCard) {
        try {
          const card = JSON.parse(storedCard);
          if (card.name) setUserName(card.name);
          if (card.role) setUserRole(card.role);
          if (card.company) setUserCompany(card.company);
          if (card.bio) setUserBio(card.bio);
          if (card.profileImage) setUserAvatar(card.profileImage);
          if (card.email) setUserEmail(card.email);
          if (card.phone) setUserPhone(card.phone);
          if (card.website) setUserWebsite(card.website);
          if (card.appearance?.accentColor) setCardThemeColor(card.appearance.accentColor);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = () => {
    const url = 'https://smartcard.id/c/card_alex';
    if (typeof navigator !== 'undefined') {
      navigator.clipboard?.writeText(url);
    }
    showToast('SmartCard link copied to clipboard!');
  };

  const chartData = chartTimeframe === '7D' ? ANALYTICS_DATA_7D : ANALYTICS_DATA_30D;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 13. DASHBOARD OVERVIEW: HEADER & STATS CARDS */}
      <div className="space-y-6">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 bg-[#0c1322] rounded-2xl border-3 border-black shadow-[6px_6px_0px_#000000]">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-cyan-400 text-black border-2 border-black font-mono font-bold text-[11px] uppercase shadow-[2px_2px_0px_#000] -rotate-1 mb-2">
              <Sparkles size={12} />
              <span>DIGITAL IDENTITY OS • ZERO NFC</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Good morning, {userName} 👋
            </h1>
            <p className="text-gray-300 text-sm font-medium mt-1">
              &ldquo;Here&apos;s what&apos;s happening with your SmartCard.&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="h-11 px-4 bg-white hover:bg-gray-100 text-black font-mono font-black text-xs uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Share2 size={14} />
              <span>Share Card</span>
            </button>
            <Link
              href="/c/card_alex"
              target="_blank"
              className="h-11 px-4 bg-[#2563EB] hover:bg-blue-600 text-white font-mono font-black text-xs uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
            >
              <span>View Public</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Stat 1: Profile Views */}
          <div className="p-6 bg-[#0c1322] rounded-xl border-3 border-black shadow-[5px_5px_0px_#2563EB] -rotate-1 hover:rotate-0 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-black uppercase text-gray-400 tracking-wider">
                Profile Views
              </span>
              <div className="w-9 h-9 rounded-lg bg-[#2563EB] border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_#000]">
                <Eye size={18} />
              </div>
            </div>
            <div className="text-4xl font-black text-white tracking-tight">
              1,284
            </div>
            <div className="flex items-center gap-1.5 mt-2 font-mono text-[11px] font-bold text-emerald-400">
              <span>↑ +18.4%</span>
              <span className="text-gray-400 font-normal">vs last week</span>
            </div>
          </div>

          {/* Stat 2: Card Shares */}
          <div className="p-6 bg-[#0c1322] rounded-xl border-3 border-black shadow-[5px_5px_0px_#06B6D4] rotate-1 hover:rotate-0 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-black uppercase text-gray-400 tracking-wider">
                Card Shares
              </span>
              <div className="w-9 h-9 rounded-lg bg-[#06B6D4] border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000]">
                <Share2 size={18} />
              </div>
            </div>
            <div className="text-4xl font-black text-white tracking-tight">
              342
            </div>
            <div className="flex items-center gap-1.5 mt-2 font-mono text-[11px] font-bold text-cyan-400">
              <span>↑ +12.6%</span>
              <span className="text-gray-400 font-normal">QR &amp; links</span>
            </div>
          </div>

          {/* Stat 3: Contacts */}
          <div className="p-6 bg-[#0c1322] rounded-xl border-3 border-black shadow-[5px_5px_0px_#10B981] -rotate-1 hover:rotate-0 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-black uppercase text-gray-400 tracking-wider">
                Contacts
              </span>
              <div className="w-9 h-9 rounded-lg bg-[#10B981] border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000]">
                <Users size={18} />
              </div>
            </div>
            <div className="text-4xl font-black text-white tracking-tight">
              86
            </div>
            <div className="flex items-center gap-1.5 mt-2 font-mono text-[11px] font-bold text-emerald-400">
              <span>↑ +24 new</span>
              <span className="text-gray-400 font-normal">leads collected</span>
            </div>
          </div>

          {/* Stat 4: Profile Completion */}
          <div className="p-6 bg-[#0c1322] rounded-xl border-3 border-black shadow-[5px_5px_0px_#F59E0B] rotate-1 hover:rotate-0 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-black uppercase text-gray-400 tracking-wider">
                Profile Completion
              </span>
              <div className="w-9 h-9 rounded-lg bg-[#F59E0B] border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000]">
                <Sparkles size={18} />
              </div>
            </div>
            <div className="text-4xl font-black text-white tracking-tight">
              92%
            </div>
            <div className="w-full h-2.5 bg-black rounded border border-black overflow-hidden mt-2 p-0.5">
              <div className="h-full bg-yellow-400 rounded-sm w-[92%]"></div>
            </div>
          </div>

        </div>

      </div>

      {/* 14. SMARTCARD PREVIEW & 15. QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 14. SMARTCARD PREVIEW (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0c1322] p-6 sm:p-7 rounded-2xl border-3 border-black shadow-[6px_6px_0px_#000000] space-y-5">
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <div>
              <span className="font-mono text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                Live Card Mockup
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Your SmartCard
              </h2>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs font-black bg-emerald-400 text-black px-2.5 py-1 rounded border-2 border-black shadow-[2px_2px_0px_#000]">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
              <span>LIVE • SMART-001</span>
            </div>
          </div>

          {/* Realistic Digital Business Card Component */}
          <div className="bg-[#121c33] rounded-xl border-3 border-black shadow-[6px_6px_0px_#000] overflow-hidden">
            
            {/* Header Banner */}
            <div 
              className="p-5 border-b-3 border-black text-white flex items-start justify-between gap-4 transition-colors duration-200"
              style={{ backgroundColor: cardThemeColor }}
            >
              <div className="space-y-1">
                <span className="font-mono text-[10px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded border border-white/20">
                  SMARTCARD-001
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight mt-1">
                  {userName}
                </h3>
                <p className="text-xs font-bold text-blue-100">
                  {userRole}
                </p>
                <p className="text-[11px] font-mono text-cyan-200 font-bold">
                  {userCompany}
                </p>
              </div>

              {/* Profile Image */}
              <div className="w-18 h-18 rounded-xl border-3 border-black bg-white overflow-hidden shadow-[3px_3px_0px_#000] shrink-0">
                <img 
                  src={userAvatar} 
                  alt={userName} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-4 bg-[#0a0f1c]">
              
              {/* Bio */}
              <p className="text-xs text-gray-200 font-medium leading-relaxed bg-[#131d33] p-3 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]">
                &ldquo;{userBio}&rdquo;
              </p>

              {/* Email, Phone, Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
                <a 
                  href={`mailto:${userEmail}`}
                  className="flex items-center gap-2 p-2 bg-[#17223b] hover:bg-[#1f2d4e] rounded-lg border-2 border-black text-gray-200 shadow-[2px_2px_0px_#000] truncate"
                >
                  <Mail size={14} className="text-cyan-400 shrink-0" />
                  <span className="truncate">{userEmail}</span>
                </a>
                <a 
                  href={`tel:${userPhone}`}
                  className="flex items-center gap-2 p-2 bg-[#17223b] hover:bg-[#1f2d4e] rounded-lg border-2 border-black text-gray-200 shadow-[2px_2px_0px_#000] truncate"
                >
                  <Phone size={14} className="text-emerald-400 shrink-0" />
                  <span className="truncate">{userPhone}</span>
                </a>
              </div>

              <div className="flex items-center gap-2 p-2 bg-[#17223b] rounded-lg border-2 border-black text-xs font-bold text-gray-200 shadow-[2px_2px_0px_#000]">
                <Globe size={14} className="text-blue-400 shrink-0" />
                <span className="text-gray-400 font-mono text-[11px]">Website:</span>
                <span className="text-white truncate">{userWebsite}</span>
              </div>

              {/* LinkedIn & GitHub */}
              <div className="grid grid-cols-2 gap-2">
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-2 bg-[#17223b] hover:bg-[#0077b5] text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-bold font-mono transition-colors"
                >
                  <LinkedInIcon className="w-4 h-4 fill-current shrink-0" />
                  <span>LinkedIn</span>
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-2 bg-[#17223b] hover:bg-black text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-bold font-mono transition-colors"
                >
                  <GitHubIcon className="w-4 h-4 fill-current shrink-0" />
                  <span>GitHub</span>
                </a>
              </div>

              {/* QR Code Placeholder & Scan Action */}
              <div className="pt-2 border-t-2 border-black flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    Scannable Camera QR
                  </span>
                  <p className="text-xs font-bold text-white">
                    Scan with any phone camera
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono">
                    Direct .vcf vCard address book save
                  </p>
                </div>

                <div className="bg-white p-1.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] shrink-0">
                  <QrCode size={48} className="text-black" />
                </div>
              </div>

            </div>

          </div>

          {/* Buttons: Edit Card & Share Card */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <Link href="/cards">
              <Button 
                variant="outline" 
                className="w-full h-12 uppercase font-black text-xs tracking-wider border-2 border-black bg-slate-900 text-white hover:bg-slate-800 shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2"
              >
                <Edit3 size={15} />
                <span>Edit Card</span>
              </Button>
            </Link>

            <Button 
              onClick={handleCopyLink}
              variant="primary" 
              className="w-full h-12 uppercase font-black text-xs tracking-wider bg-[#2563EB] hover:bg-blue-600 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2"
            >
              <Share2 size={15} />
              <span>Share Card</span>
            </Button>
          </div>

        </div>

        {/* 15. QUICK ACTIONS (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0c1322] p-6 sm:p-7 rounded-2xl border-3 border-black shadow-[6px_6px_0px_#000000] space-y-5">
          <div className="border-b-2 border-black pb-4">
            <span className="font-mono text-[10px] font-black uppercase text-yellow-400 tracking-wider">
              Productivity Hub
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
            
            {/* Quick Action 1: Edit Profile */}
            <Link 
              href="/profile"
              className="p-4 bg-[#121c33] hover:bg-[#162340] rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#2563EB] transition-all flex items-start gap-3.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-[#2563EB] border-2 border-black flex items-center justify-center text-white shrink-0 shadow-[2px_2px_0px_#000] group-hover:scale-105 transition-transform">
                <Edit3 size={18} />
              </div>
              <div className="truncate">
                <h3 className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors">
                  Edit Profile
                </h3>
                <p className="text-xs text-gray-300 font-medium mt-0.5">
                  Update your professional information.
                </p>
              </div>
            </Link>

            {/* Quick Action 2: Customize Card */}
            <Link 
              href="/cards"
              className="p-4 bg-[#121c33] hover:bg-[#162340] rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#06B6D4] transition-all flex items-start gap-3.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-[#06B6D4] border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[2px_2px_0px_#000] group-hover:scale-105 transition-transform">
                <Palette size={18} />
              </div>
              <div className="truncate">
                <h3 className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors">
                  Customize Card
                </h3>
                <p className="text-xs text-gray-300 font-medium mt-0.5">
                  Change appearance and layout.
                </p>
              </div>
            </Link>

            {/* Quick Action 3: Share Card */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full text-left p-4 bg-[#121c33] hover:bg-[#162340] rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#10B981] transition-all flex items-start gap-3.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-[#10B981] border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[2px_2px_0px_#000] group-hover:scale-105 transition-transform">
                <Copy size={18} />
              </div>
              <div className="truncate">
                <h3 className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors">
                  Share Card
                </h3>
                <p className="text-xs text-gray-300 font-medium mt-0.5">
                  Copy your SmartCard link.
                </p>
              </div>
            </button>

            {/* Quick Action 4: View Analytics */}
            <Link 
              href="/analytics"
              className="p-4 bg-[#121c33] hover:bg-[#162340] rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#F59E0B] transition-all flex items-start gap-3.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-[#F59E0B] border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[2px_2px_0px_#000] group-hover:scale-105 transition-transform">
                <BarChart3 size={18} />
              </div>
              <div className="truncate">
                <h3 className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors">
                  View Analytics
                </h3>
                <p className="text-xs text-gray-300 font-medium mt-0.5">
                  See how people interact with your card.
                </p>
              </div>
            </Link>

          </div>
        </div>

      </div>

      {/* 16. ANALYTICS PREVIEW & 17. RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 16. ANALYTICS PREVIEW (8 Cols) */}
        <div className="lg:col-span-8 bg-[#0c1322] p-6 sm:p-7 rounded-2xl border-3 border-black shadow-[6px_6px_0px_#000000] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-4">
            <div>
              <span className="font-mono text-[10px] font-black uppercase text-blue-400 tracking-wider">
                Telemetry Preview
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Analytics Overview
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Daily telemetry across profile views, card shares, and link clicks
              </p>
            </div>

            {/* Timeframe Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-black rounded-lg border-2 border-black self-start sm:self-center">
              <button
                type="button"
                onClick={() => setChartTimeframe('7D')}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                  chartTimeframe === '7D'
                    ? 'bg-white text-black border border-black shadow-[1px_1px_0px_#000]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => setChartTimeframe('30D')}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                  chartTimeframe === '30D'
                    ? 'bg-white text-black border border-black shadow-[1px_1px_0px_#000]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          {/* Chart Display */}
          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 5, left: -10 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorShares" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1b2438" />
                <XAxis 
                  dataKey="day" 
                  axisLine={{ stroke: '#000000', strokeWidth: 2 }} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 'bold', fontFamily: 'monospace' }} 
                />
                <YAxis 
                  axisLine={{ stroke: '#000000', strokeWidth: 2 }} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 'bold', fontFamily: 'monospace' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#090D16', 
                    border: '2px solid #000000', 
                    borderRadius: '8px', 
                    boxShadow: '4px 4px 0px #000000',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    fontWeight: 'bold'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#2563EB" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="shares" 
                  stroke="#06B6D4" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorShares)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#F59E0B" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorClicks)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t-2 border-black font-mono text-xs font-bold">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#2563EB] border border-black rounded shadow-[1px_1px_0px_#000]"></span>
                <span className="text-gray-300">Profile Views</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#06B6D4] border border-black rounded shadow-[1px_1px_0px_#000]"></span>
                <span className="text-gray-300">Shares</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#F59E0B] border border-black rounded shadow-[1px_1px_0px_#000]"></span>
                <span className="text-gray-300">Clicks</span>
              </div>
            </div>

            <Link href="/analytics" className="text-cyan-400 hover:underline flex items-center gap-1">
              <span>Full Analytics Hub</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* 17. RECENT ACTIVITY (4 Cols) */}
        <div className="lg:col-span-4 bg-[#0c1322] p-6 sm:p-7 rounded-2xl border-3 border-black shadow-[6px_6px_0px_#000000] space-y-5">
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <div>
              <span className="font-mono text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                Live Audit Stream
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Recent Activity
              </h2>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          <div className="space-y-3">
            {[
              {
                text: "Your profile received 24 new views.",
                time: "12m ago",
                badge: "Views",
                color: "bg-blue-600 text-white"
              },
              {
                text: "Someone shared your SmartCard.",
                time: "45m ago",
                badge: "Shares",
                color: "bg-cyan-400 text-black"
              },
              {
                text: "Your LinkedIn link was clicked.",
                time: "2h ago",
                badge: "Clicks",
                color: "bg-amber-400 text-black"
              },
              {
                text: "Profile completion reached 92%.",
                time: "5h ago",
                badge: "System",
                color: "bg-emerald-400 text-black"
              },
              {
                text: "Inbound contact card received: Sarah Chen",
                time: "1d ago",
                badge: "Leads",
                color: "bg-purple-500 text-white"
              }
            ].map((act, index) => (
              <div 
                key={index}
                className="p-3.5 bg-[#121c33] rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase border border-black ${act.color}`}>
                    {act.badge}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                    <Clock size={11} />
                    {act.time}
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-200">
                  {act.text}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link href="/notifications">
              <Button 
                variant="outline" 
                className="w-full text-xs font-mono font-bold uppercase h-10 border-2 border-black bg-[#10182c] text-gray-300 hover:text-white shadow-[2px_2px_0px_#000]"
              >
                View Full Audit History →
              </Button>
            </Link>
          </div>
        </div>

      </div>

      {/* Floating Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-400 text-black border-3 border-black px-4 py-2.5 rounded-xl font-mono font-black text-xs uppercase shadow-[4px_4px_0px_#000] flex items-center gap-2 animate-bounce">
          <Check size={16} className="stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
