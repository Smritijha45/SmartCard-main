'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CreditCard, QrCode, Share2, Users, Eye, ArrowRight, Check, X,
  Phone, Mail, Globe, Sparkles, Shield, ChevronDown, Download,
  ExternalLink, Calendar, Star, BarChart3, Smartphone, Zap,
  Menu, ChevronRight, Palette, Layers, Link2, Copy, CheckCircle2,
  ArrowUpRight, TrendingUp, Lock, Laptop, CheckCircle
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Button } from '@/components/ui/Button';
import { AuthModal } from '@/components/auth/AuthModal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

// Minimalist Social Icons
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

const TwitterIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const SAMPLE_CHART_DATA = [
  { name: 'Mon', views: 142, clicks: 48 },
  { name: 'Tue', views: 184, clicks: 62 },
  { name: 'Wed', views: 220, clicks: 76 },
  { name: 'Thu', views: 198, clicks: 65 },
  { name: 'Fri', views: 264, clicks: 92 },
  { name: 'Sat', views: 132, clicks: 41 },
  { name: 'Sun', views: 144, clicks: 54 },
];

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedContactToast, setSavedContactToast] = useState(false);
  const [copiedLinkToast, setCopiedLinkToast] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Authentication Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('signup');

  const openAuth = (selectedTab: 'login' | 'signup' = 'signup') => {
    setAuthModalTab(selectedTab);
    setAuthModalOpen(true);
  };

  // Section 11: Product Showcase (SmartCard Editor State)
  const [showcaseTab, setShowcaseTab] = useState<'profile' | 'links' | 'appearance' | 'socials'>('profile');
  const [showcaseCard, setShowcaseCard] = useState({
    name: 'Smriti Jha',
    role: 'Full Stack Developer',
    company: 'SmartCard Technologies',
    bio: 'Building modern digital experiences.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    email: 'smriti@smartcard.app',
    phone: '+1 (415) 555-0192',
    website: 'smritijha.dev',
    linkedin: 'linkedin.com/in/smritijha',
    github: 'github.com/smritijha',
    instagram: 'instagram.com/smriti.dev',
    x: 'x.com/smritijha',
    accentColor: '#2563EB',
    themePreset: 'light' as 'light' | 'dark',
  });

  useEffect(() => {
    const isAuth = typeof window !== 'undefined' && (
      localStorage.getItem('smartcard_authenticated') === 'true' || 
      !!localStorage.getItem('token')
    );
    if (isAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  const triggerSaveContact = () => {
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${showcaseCard.name}`,
      `TITLE:${showcaseCard.role}`,
      `ORG:${showcaseCard.company}`,
      `EMAIL;TYPE=PREF,INTERNET:${showcaseCard.email}`,
      `TEL;TYPE=CELL:${showcaseCard.phone}`,
      `URL:https://${showcaseCard.website}`,
      `NOTE:${showcaseCard.bio}`,
      'END:VCARD'
    ].join('\n');

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${showcaseCard.name.replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSavedContactToast(true);
    setTimeout(() => setSavedContactToast(false), 3200);
  };

  const handleCopyLink = (url: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard?.writeText(url);
    }
    setCopiedLinkToast(url);
    setTimeout(() => setCopiedLinkToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden transition-colors">
      
      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#FBFBFA]/85 dark:bg-[#0B0F17]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
              <CreditCard size={18} className="text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-slate-900 dark:text-slate-100">
              SmartCard
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link 
              href="#product" 
              className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md transition-colors"
            >
              Product
            </Link>
            <Link 
              href="#features" 
              className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md transition-colors"
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md transition-colors"
            >
              How It Works
            </Link>
            <Link 
              href="#pricing" 
              className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Right Side CTAs & Theme Toggle */}
          <div className="hidden sm:flex items-center space-x-3">
            <ThemeToggle compact showLabel={false} />
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button variant="primary" size="sm" className="font-medium text-xs">
                  Dashboard →
                </Button>
              </Link>
            ) : (
              <>
                <Button 
                  onClick={() => openAuth('login')}
                  variant="ghost" 
                  size="sm" 
                  className="font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Log in
                </Button>
                <Button 
                  onClick={() => openAuth('signup')}
                  variant="primary" 
                  size="sm" 
                  className="font-medium text-xs bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle compact showLabel={false} />
            <Button 
              onClick={() => openAuth('signup')}
              variant="primary" 
              size="sm" 
              className="text-xs font-medium sm:hidden bg-blue-600 text-white"
            >
              Start Free
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131924] rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={18} />
            </button>
          </div>

        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B0F17]/95 px-4 py-4 space-y-3">
            <Link 
              href="#product" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-slate-700 dark:text-slate-300 py-1.5 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Product
            </Link>
            <Link 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-slate-700 dark:text-slate-300 py-1.5 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-slate-700 dark:text-slate-300 py-1.5 hover:text-blue-600 dark:hover:text-blue-400"
            >
              How It Works
            </Link>
            <Link 
              href="#pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-slate-700 dark:text-slate-300 py-1.5 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Pricing
            </Link>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <Button 
                variant="outline" 
                onClick={() => { setMobileMenuOpen(false); openAuth('login'); }}
                className="w-full text-center text-xs"
              >
                Log in
              </Button>
              <Button 
                variant="primary" 
                onClick={() => { setMobileMenuOpen(false); openAuth('signup'); }}
                className="w-full text-center text-xs bg-blue-600 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section id="product" className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        
        {/* Soft Ambient Glow */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span>Zero NFC hardware required • Instant camera QR</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.12]">
                Your professional identity,<br />
                <span className="text-blue-600 dark:text-blue-500">
                  in one link.
                </span>
              </h1>

              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Create a beautiful digital business card, share it anywhere, and make every connection count.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                {isAuthenticated ? (
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="w-full sm:w-auto h-12 px-7 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                    >
                      <span>Create Your SmartCard</span>
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    onClick={() => openAuth('signup')}
                    variant="primary" 
                    size="lg" 
                    className="w-full sm:w-auto h-12 px-7 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                  >
                    <span>Create Your SmartCard</span>
                    <ArrowRight size={16} />
                  </Button>
                )}

                <Link href="/demo" className="w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto h-12 px-7 text-sm font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131924] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                  >
                    <Smartphone size={16} className="text-blue-600 dark:text-blue-400" />
                    <span>Explore Demo</span>
                  </Button>
                </Link>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-500" />
                  No app download needed
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-500" />
                  1-tap vCard phone save
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-500" />
                  Free forever tier
                </span>
              </div>

            </div>

            {/* Right Column: Hero Card Preview */}
            <div className="lg:col-span-6 flex flex-col items-center">
              
              <div className="w-full max-w-sm bg-white dark:bg-[#131924] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-md overflow-hidden relative transition-all duration-300">
                
                {/* Banner */}
                <div 
                  className="h-24 px-5 pt-4 pb-2 relative flex items-start justify-between text-white transition-colors duration-300 bg-blue-600"
                >
                  <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-black/25 backdrop-blur-xs">
                    PRO • VERIFIED
                  </span>
                  
                  <div className="flex items-center gap-1 text-[10px] bg-white/20 px-2 py-0.5 rounded backdrop-blur-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                    <span>ONLINE</span>
                  </div>
                </div>

                {/* Profile Avatar & Header Info */}
                <div className="px-5 pb-5 pt-0">
                  <div className="relative flex items-end justify-between -mt-10 mb-4">
                    <div className="w-20 h-20 rounded-2xl bg-white dark:bg-[#131924] p-1 border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden shrink-0">
                      <img 
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80" 
                        alt="Smriti Jha" 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={triggerSaveContact}
                        className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Download size={13} />
                        <span>Save Contact</span>
                      </button>
                    </div>
                  </div>

                  {/* Title & Organization */}
                  <div className="space-y-0.5 mb-3">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                      Smriti Jha
                    </h2>
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      Full Stack Developer
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      SmartCard Technologies
                    </p>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60">
                    &ldquo;Building modern digital experiences.&rdquo;
                  </p>

                  {/* Contact Info Rows */}
                  <div className="space-y-2 mb-4 text-xs">
                    <a 
                      href="mailto:smriti@smartcard.app"
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <Mail size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="truncate flex-1 font-medium">smriti@smartcard.app</span>
                      <ExternalLink size={12} className="text-slate-400 shrink-0" />
                    </a>

                    <a 
                      href="https://smritijha.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <Globe size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="truncate flex-1 font-medium">smritijha.dev</span>
                      <ExternalLink size={12} className="text-slate-400 shrink-0" />
                    </a>
                  </div>

                  {/* Social Pills */}
                  <div className="flex items-center gap-2 mb-4">
                    <a 
                      href="https://github.com/smritijha" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <GitHubIcon className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                    <a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <LinkedInIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>LinkedIn</span>
                    </a>
                  </div>

                  {/* QR Code & Share Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
                        Camera Scan
                      </span>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Scan to open directly
                      </p>
                    </div>

                    <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                      <QrCode size={36} className="text-slate-900 dark:text-slate-100" />
                    </div>
                  </div>

                </div>

              </div>

              {savedContactToast && (
                <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium shadow-sm">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>Contact (.vcf) downloaded to your address book!</span>
                </div>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* 9. FEATURES (Section Heading: Everything you need to be remembered.) */}
      <section id="features" className="py-20 md:py-28 bg-white dark:bg-[#0E1420] border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Everything you need to be remembered.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Designed with the restraint of premium SaaS products. No gimmicks, no proprietary hardware—just fast, elegant digital identity.
            </p>
          </div>

          {/* Clean 3-Column Feature Grid (6 Features) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl bg-[#FBFBFA] dark:bg-[#131924] border border-slate-200/90 dark:border-slate-800/90 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <CreditCard size={18} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Beautiful Profiles
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Create a professional digital identity that represents you.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl bg-[#FBFBFA] dark:bg-[#131924] border border-slate-200/90 dark:border-slate-800/90 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Link2 size={18} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                One Shareable Link
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Share your entire professional identity from one URL.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl bg-[#FBFBFA] dark:bg-[#131924] border border-slate-200/90 dark:border-slate-800/90 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <QrCode size={18} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                QR Code
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Let people connect instantly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-2xl bg-[#FBFBFA] dark:bg-[#131924] border border-slate-200/90 dark:border-slate-800/90 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Palette size={18} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Customization
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Make your card match your personal brand.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-2xl bg-[#FBFBFA] dark:bg-[#131924] border border-slate-200/90 dark:border-slate-800/90 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <BarChart3 size={18} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Analytics
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Understand profile views and interactions.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-2xl bg-[#FBFBFA] dark:bg-[#131924] border border-slate-200/90 dark:border-slate-800/90 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <Globe size={18} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Always Available
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Your professional identity is accessible anywhere.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 10. HOW IT WORKS (3 Simple Steps) */}
      <section id="how-it-works" className="py-20 md:py-28 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Simple 3-step process.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 01 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#131924] border border-slate-200/90 dark:border-slate-800/90 space-y-4 shadow-2xs">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                01
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Create
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Build your professional profile.
              </p>
            </div>

            {/* Step 02 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#131924] border border-slate-200/90 dark:border-slate-800/90 space-y-4 shadow-2xs">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                02
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Customize
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Make your SmartCard yours.
              </p>
            </div>

            {/* Step 03 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#131924] border border-slate-200/90 dark:border-slate-800/90 space-y-4 shadow-2xs">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                03
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Share
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Send your link or QR code.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 11. PRODUCT SHOWCASE (Section: Your card. Your identity.) */}
      <section className="py-20 md:py-28 bg-white dark:bg-[#0E1420] border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Product Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Your card. Your identity.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Show the SmartCard editor with live synchronization. When you change settings, the preview updates instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
            
            {/* Left side: Controls (Profile, Links, Appearance, Socials) */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-[#FBFBFA] dark:bg-[#131924] border border-slate-200 dark:border-slate-800 space-y-5">
              
              {/* Tab Selector */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-medium">
                {(['profile', 'links', 'appearance', 'socials'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setShowcaseTab(tab)}
                    className={`flex-1 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                      showcaseTab === tab
                        ? 'bg-white dark:bg-[#131924] text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Profile Tab */}
              {showcaseTab === 'profile' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Full Name</label>
                    <input
                      type="text"
                      value={showcaseCard.name}
                      onChange={(e) => setShowcaseCard({ ...showcaseCard, name: e.target.value })}
                      className="w-full h-9 px-3 bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Job Title</label>
                    <input
                      type="text"
                      value={showcaseCard.role}
                      onChange={(e) => setShowcaseCard({ ...showcaseCard, role: e.target.value })}
                      className="w-full h-9 px-3 bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Company</label>
                    <input
                      type="text"
                      value={showcaseCard.company}
                      onChange={(e) => setShowcaseCard({ ...showcaseCard, company: e.target.value })}
                      className="w-full h-9 px-3 bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Short Bio</label>
                    <textarea
                      rows={2}
                      value={showcaseCard.bio}
                      onChange={(e) => setShowcaseCard({ ...showcaseCard, bio: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Links Tab */}
              {showcaseTab === 'links' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Email Address</label>
                    <input
                      type="email"
                      value={showcaseCard.email}
                      onChange={(e) => setShowcaseCard({ ...showcaseCard, email: e.target.value })}
                      className="w-full h-9 px-3 bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Phone Number</label>
                    <input
                      type="tel"
                      value={showcaseCard.phone}
                      onChange={(e) => setShowcaseCard({ ...showcaseCard, phone: e.target.value })}
                      className="w-full h-9 px-3 bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Portfolio Website</label>
                    <input
                      type="text"
                      value={showcaseCard.website}
                      onChange={(e) => setShowcaseCard({ ...showcaseCard, website: e.target.value })}
                      className="w-full h-9 px-3 bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {showcaseTab === 'appearance' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">Card Appearance Preset</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setShowcaseCard({ ...showcaseCard, themePreset: 'light' })}
                        className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                          showcaseCard.themePreset === 'light'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <div className="font-semibold">Light Professional</div>
                        <div className="text-[10px] opacity-75">Clean white surface</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowcaseCard({ ...showcaseCard, themePreset: 'dark' })}
                        className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                          showcaseCard.themePreset === 'dark'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <div className="font-semibold">Executive Dark</div>
                        <div className="text-[10px] opacity-75">Deep charcoal surface</div>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">Brand Accent Color</label>
                    <div className="flex items-center gap-2.5 pt-1">
                      {['#2563EB', '#06B6D4', '#10B981', '#6366F1', '#EC4899', '#F59E0B'].map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          onClick={() => setShowcaseCard({ ...showcaseCard, accentColor: hex })}
                          className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                            showcaseCard.accentColor === hex ? 'border-slate-900 dark:border-white scale-110 shadow-xs' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Socials Tab */}
              {showcaseTab === 'socials' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">GitHub Profile</label>
                    <input
                      type="text"
                      value={showcaseCard.github}
                      onChange={(e) => setShowcaseCard({ ...showcaseCard, github: e.target.value })}
                      className="w-full h-9 px-3 bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">LinkedIn Handle</label>
                    <input
                      type="text"
                      value={showcaseCard.linkedin}
                      onChange={(e) => setShowcaseCard({ ...showcaseCard, linkedin: e.target.value })}
                      className="w-full h-9 px-3 bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Button 
                  onClick={() => openAuth('signup')}
                  variant="primary" 
                  size="sm" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-10"
                >
                  Create Your SmartCard Now →
                </Button>
              </div>

            </div>

            {/* Right side: Live SmartCard Preview */}
            <div className="lg:col-span-6 flex justify-center">
              {(() => {
                const isCardDark = showcaseCard.themePreset === 'dark';
                return (
                  <div className={`w-full max-w-sm rounded-2xl border shadow-md overflow-hidden transition-all duration-200 ${
                    isCardDark 
                      ? 'bg-[#0F172A] text-slate-100 border-slate-700/80 shadow-xl' 
                      : 'bg-white text-slate-900 border-slate-200/90 shadow-md'
                  }`}>
                    <div 
                      className="h-20 px-5 pt-3.5 relative flex items-start justify-between text-white transition-colors duration-200"
                      style={{ backgroundColor: showcaseCard.accentColor }}
                    >
                      <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-black/25">
                        LIVE CARD PREVIEW
                      </span>
                      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-medium">
                        {isCardDark ? 'Executive Dark' : 'Light Pro'}
                      </span>
                    </div>

                    <div className="p-5 pt-0">
                      <div className="relative flex items-end justify-between -mt-8 mb-3">
                        <div className={`w-16 h-16 rounded-xl p-1 border shadow-2xs overflow-hidden shrink-0 ${
                          isCardDark ? 'bg-[#0F172A] border-slate-700' : 'bg-white border-slate-200'
                        }`}>
                          <img src={showcaseCard.photo} alt={showcaseCard.name} className="w-full h-full object-cover rounded-lg" />
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                          smartcard.app/{showcaseCard.name.toLowerCase().replace(/\s+/g, '')}
                        </span>
                      </div>

                      <h4 className={`text-lg font-bold ${isCardDark ? 'text-white' : 'text-slate-900'}`}>
                        {showcaseCard.name || 'Your Name'}
                      </h4>
                      <p className="text-xs font-medium text-blue-500">
                        {showcaseCard.role || 'Your Title'}
                      </p>
                      <p className={`text-xs mb-3 ${isCardDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {showcaseCard.company || 'Your Company'}
                      </p>

                      <p className={`text-xs leading-relaxed mb-4 p-2.5 rounded-lg border ${
                        isCardDark 
                          ? 'bg-[#1E293B] border-slate-700/60 text-slate-300' 
                          : 'bg-slate-50 border-slate-100 text-slate-700'
                      }`}>
                        &ldquo;{showcaseCard.bio}&rdquo;
                      </p>

                      <div className={`p-3 rounded-xl border flex items-center justify-between ${
                        isCardDark 
                          ? 'bg-[#1E293B] border-slate-700/60 text-slate-200' 
                          : 'bg-slate-50 border-slate-100 text-slate-700'
                      }`}>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-medium">Action</span>
                          <p className={`text-xs font-medium ${isCardDark ? 'text-slate-200' : 'text-slate-800'}`}>Download vCard (.vcf)</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                          <Download size={14} />
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>

          </div>

        </div>
      </section>

      {/* 12. ANALYTICS SHOWCASE */}
      <section className="py-20 md:py-28 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Analytics Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Understand profile views and interactions.
            </h2>
          </div>

          <div className="max-w-4xl mx-auto bg-white dark:bg-[#131924] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-8 shadow-xs space-y-8">
            
            {/* 4 Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 space-y-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Profile Views</span>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">1,284</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 space-y-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Link Clicks</span>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">438</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 space-y-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Shares</span>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">126</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 space-y-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Contacts</span>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">84</div>
              </div>

            </div>

            {/* Clean Line Chart */}
            <div className="h-64 w-full pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SAMPLE_CHART_DATA} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1E293B', 
                      borderRadius: '8px', 
                      border: 'none', 
                      fontSize: '11px',
                      color: '#fff'
                    }} 
                  />
                  <Line type="monotone" dataKey="views" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} name="Views" />
                  <Line type="monotone" dataKey="clicks" stroke="#06B6D4" strokeWidth={2} dot={{ r: 3 }} name="Clicks" />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>
      </section>

      {/* PRICING SECTION (INR CURRENCY ₹) */}
      <section id="pricing" className="py-20 md:py-28 bg-white dark:bg-[#0E1420] border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Simple plans for individuals and teams
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Start completely free. Upgrade whenever you need advanced CRM integrations or custom domains.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <span className={`text-xs font-medium ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500'}`}>
                Monthly
              </span>
              <button
                type="button"
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded-full p-1 transition-colors relative cursor-pointer"
              >
                <div 
                  className={`w-4 h-4 bg-blue-600 rounded-full transition-transform ${
                    billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-xs font-medium flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500'}`}>
                <span>Annual</span>
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Free Plan */}
            <div className="p-8 rounded-2xl bg-[#FBFBFA] dark:bg-[#131924] border border-slate-200/90 dark:border-slate-800/90 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Starter
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">₹0</span>
                  <span className="text-xs text-slate-500">/ forever</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Ideal for students, freelancers, and individuals starting their digital networking.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 shrink-0" />
                    <span>1 Digital SmartCard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 shrink-0" />
                    <span>Standard Dynamic QR Code</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 shrink-0" />
                    <span>1-Tap vCard Phone Export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 shrink-0" />
                    <span>Unlimited Profile Scans</span>
                  </li>
                </ul>
              </div>

              <Button 
                onClick={() => openAuth('signup')}
                variant="outline"
                className="w-full text-xs font-medium h-10 border-slate-200 dark:border-slate-800"
              >
                Get Started Free
              </Button>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#131924] border border-blue-500/50 shadow-md ring-1 ring-blue-500/20 flex flex-col justify-between space-y-6 relative">
              <div className="absolute top-4 right-4 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full">
                MOST POPULAR
              </div>

              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Professional
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                    {billingCycle === 'annual' ? '₹199' : '₹249'}
                  </span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  For creators, executives, and consultants who need CRM leads and deep metrics.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 shrink-0" />
                    <span className="font-medium">Everything in Starter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 shrink-0" />
                    <span>Inbound Lead Capture CRM</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 shrink-0" />
                    <span>Real-Time Visitor &amp; Scan Analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 shrink-0" />
                    <span>Custom Brand Colors &amp; Badges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 shrink-0" />
                    <span>CSV &amp; JSON Lead Export</span>
                  </li>
                </ul>
              </div>

              <Button 
                onClick={() => openAuth('signup')}
                variant="primary"
                className="w-full text-xs font-medium h-10 bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
              >
                Upgrade to Pro
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 rounded-2xl bg-[#FBFBFA] dark:bg-[#131924] border border-slate-200/90 dark:border-slate-800/90 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Team &amp; Enterprise
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                    {billingCycle === 'annual' ? '₹799' : '₹999'}
                  </span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  For companies and sales forces standardizing team-wide digital cards.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 shrink-0" />
                    <span className="font-medium">Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 shrink-0" />
                    <span>Centralized Team Admin Console</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 shrink-0" />
                    <span>SSO &amp; Role-Based Access Control</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 shrink-0" />
                    <span>Custom Domain Integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-blue-600 shrink-0" />
                    <span>Dedicated Support Manager</span>
                  </li>
                </ul>
              </div>

              <Button 
                onClick={() => openAuth('signup')}
                variant="outline"
                className="w-full text-xs font-medium h-10 border-slate-200 dark:border-slate-800"
              >
                Contact Sales
              </Button>
            </div>

          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 md:py-28 bg-white dark:bg-[#0E1420] border-t border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium">
            <Sparkles size={14} />
            <span>Launch your modern digital identity</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            Elevate every first impression.<br />
            Start with SmartCard today.
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Join thousands of founders, engineers, and creative leads who replaced paper cards with a modern, elegant digital presence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button 
              onClick={() => openAuth('signup')}
              variant="primary" 
              size="lg" 
              className="w-full sm:w-auto h-12 px-8 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Create Your Free SmartCard</span>
              <ArrowRight size={16} />
            </Button>

            <Link href="/demo" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto h-12 px-7 text-sm font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131924] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Demo Card</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-200/80 dark:border-slate-800/80 bg-[#FBFBFA] dark:bg-[#0B0F17] text-slate-600 dark:text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-slate-200/60 dark:border-slate-800/60">
            
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <CreditCard size={15} />
              </div>
              <span className="font-semibold text-slate-900 dark:text-slate-100 text-base tracking-tight">
                SmartCard
              </span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="#product" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Product
              </Link>
              <Link href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/demo" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Live Demo
              </Link>
              <Link href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Pricing
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle compact showLabel={false} />
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} SmartCard Platform. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Security</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialTab={authModalTab} 
      />

    </div>
  );
}
