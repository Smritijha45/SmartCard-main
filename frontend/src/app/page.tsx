'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CreditCard, QrCode, Share2, Users, Eye, ArrowRight, Check, X,
  Phone, Mail, Globe, Sparkles, Shield, ChevronDown, Download,
  ExternalLink, Calendar, Star, BarChart3, Smartphone, Zap,
  Menu, ChevronRight, Palette, Layers, Link2, Copy, CheckCircle2,
  ArrowUpRight, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AuthModal } from '@/components/auth/AuthModal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

// Social Icon SVG Components for Neo-Brutalist integration
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

// Sample Hero Personas
const PERSONAS = [
  {
    id: 'founder',
    tabName: 'Founder & CEO',
    name: 'Alex Morgan',
    role: 'Founder & Head of Product',
    company: 'SmartCard Technologies',
    themeColor: '#2563EB',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: 'Scaling digital identity platforms. Replaced 5,000+ paper cards with zero-NFC instant QR profiles.',
    phone: '+1 (415) 555-0192',
    email: 'alex@smartcard.id',
    link: 'smartcard.id/c/alex',
    badge: 'SMART-001',
    leadScore: '96/100',
    views: '1,420',
  },
  {
    id: 'investor',
    tabName: 'Venture Partner',
    name: 'Sarah Chen',
    role: 'VP Strategic Partnerships',
    company: 'Apex Ventures',
    themeColor: '#06B6D4',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    bio: 'Backing early-stage B2B SaaS and developer tooling. Let’s connect on enterprise distribution.',
    phone: '+1 (650) 555-0831',
    email: 'sarah.chen@apex.vc',
    link: 'smartcard.id/c/sarah',
    badge: 'APEX-772',
    leadScore: '92/100',
    views: '890',
  },
  {
    id: 'designer',
    tabName: 'Creative Lead',
    name: 'Devon Vance',
    role: 'Principal Design Architect',
    company: 'Studio Neon',
    themeColor: '#F59E0B',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bio: 'Crafting bold neo-brutalist identities and tactile web experiences for hyper-growth teams.',
    phone: '+44 20 7946 0912',
    email: 'devon@studioneon.design',
    link: 'smartcard.id/c/devon',
    badge: 'NEON-104',
    leadScore: '89/100',
    views: '540',
  }
];

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePersona, setActivePersona] = useState(PERSONAS[0]);
  const [savedContactToast, setSavedContactToast] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Authentication Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('signup');

  const openAuth = (selectedTab: 'login' | 'signup' = 'signup') => {
    setAuthModalTab(selectedTab);
    setAuthModalOpen(true);
  };

  // Interactive How-It-Works & Features State
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedStyle, setSelectedStyle] = useState<'Minimal' | 'Professional' | 'Bold' | 'Dark' | 'Creative'>('Professional');
  const [copiedLinkToast, setCopiedLinkToast] = useState<string | null>(null);
  const [featureCustomTheme, setFeatureCustomTheme] = useState('#2563EB');
  const [step1Name, setStep1Name] = useState('Smriti Jha');
  const [step1Role, setStep1Role] = useState('Full Stack Developer');
  const [step2Theme, setStep2Theme] = useState('#2563EB');
  const [step4ExchangeSubmitted, setStep4ExchangeSubmitted] = useState(false);
  const [step2Socials, setStep2Socials] = useState({
    linkedin: true,
    github: true,
    twitter: true,
    website: true
  });

  // Playground State
  const [playName, setPlayName] = useState('Jordan Lee');
  const [playRole, setPlayRole] = useState('Growth Strategist');
  const [playCompany, setPlayCompany] = useState('Pulse Media');
  const [playColor, setPlayColor] = useState('#2563EB');

  useEffect(() => {
    const isAuth = typeof window !== 'undefined' && (localStorage.getItem('smartcard_authenticated') === 'true' || !!localStorage.getItem('token'));
    if (isAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  const triggerSaveContact = () => {
    setSavedContactToast(true);
    setTimeout(() => setSavedContactToast(false), 3500);
  };

  const handleCopyLink = (url: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard?.writeText(url);
    }
    setCopiedLinkToast(url);
    setTimeout(() => setCopiedLinkToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-gray-100 font-sans selection:bg-[#2563EB] selection:text-white relative overflow-x-hidden bg-neo-dots">
      
      {/* 1. NEO-BRUTALIST NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#090D16] border-b-2 border-black shadow-[0_4px_0_0_#000000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-[#2563EB] border-2 border-black flex items-center justify-center font-black text-white shadow-[3px_3px_0px_#000000] group-hover:-translate-y-0.5 transition-transform">
              <CreditCard size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl text-white tracking-tight leading-none">
                SmartCard
              </span>
              <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
                Digital Profile OS
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link 
              href="#home" 
              className="px-3.5 py-1.5 text-sm font-bold text-gray-300 hover:text-white hover:bg-slate-800/80 rounded-md border-2 border-transparent hover:border-black transition-all"
            >
              Product
            </Link>
            <Link 
              href="#features" 
              className="px-3.5 py-1.5 text-sm font-bold text-gray-300 hover:text-white hover:bg-slate-800/80 rounded-md border-2 border-transparent hover:border-black transition-all"
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className="px-3.5 py-1.5 text-sm font-bold text-gray-300 hover:text-white hover:bg-slate-800/80 rounded-md border-2 border-transparent hover:border-black transition-all"
            >
              How It Works
            </Link>
            <Link 
              href="#pricing" 
              className="px-3.5 py-1.5 text-sm font-bold text-gray-300 hover:text-white hover:bg-slate-800/80 rounded-md border-2 border-transparent hover:border-black transition-all"
            >
              Pricing
            </Link>
          </nav>

          {/* Right Side CTAs & Theme Toggle */}
          <div className="hidden sm:flex items-center space-x-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button variant="primary" size="sm" className="font-black uppercase tracking-wider text-xs">
                  Go to Dashboard →
                </Button>
              </Link>
            ) : (
              <>
                <Button 
                  onClick={() => openAuth('login')}
                  variant="outline" 
                  size="sm" 
                  className="font-bold border-2 border-black bg-slate-900/90 text-white hover:bg-slate-800 shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  Log in
                </Button>
                <Button 
                  onClick={() => openAuth('signup')}
                  variant="primary" 
                  size="sm" 
                  className="font-black uppercase tracking-wider text-xs bg-[#2563EB] hover:bg-[#1D4ED8] border-2 border-black shadow-[3px_3px_0px_#000000] cursor-pointer"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button & Theme toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle compact showLabel={false} />
            <Button 
              onClick={() => openAuth('signup')}
              variant="primary" 
              size="sm" 
              className="text-xs font-black sm:hidden"
            >
              Start Free
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border-2 border-black bg-slate-900 rounded-lg text-gray-300 hover:text-white shadow-[2px_2px_0px_#000]"
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
          </div>

        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-black bg-[#0d1322] px-4 py-4 space-y-3 shadow-[0_4px_0_0_#000]">
            <Link 
              href="#home" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold text-gray-200 py-1.5 hover:text-cyan-400"
            >
              Product
            </Link>
            <Link 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold text-gray-200 py-1.5 hover:text-cyan-400"
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold text-gray-200 py-1.5 hover:text-cyan-400"
            >
              How It Works
            </Link>
            <Link 
              href="#pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold text-gray-200 py-1.5 hover:text-cyan-400"
            >
              Pricing
            </Link>
            <div className="pt-2 border-t-2 border-slate-800 flex flex-col gap-2">
              <Button 
                variant="outline" 
                onClick={() => { setMobileMenuOpen(false); openAuth('login'); }}
                className="w-full text-center"
              >
                Log in
              </Button>
              <Button 
                variant="primary" 
                onClick={() => { setMobileMenuOpen(false); openAuth('signup'); }}
                className="w-full text-center"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION */}
      <section id="home" className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b-2 border-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline, Copy, and CTAs */}
            {/* Left Column: Headline, Copy, and CTAs */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              
              {/* Product Hunt & Zero-NFC Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-400 text-black border-2 border-black font-mono font-black text-xs uppercase shadow-[3px_3px_0px_#000000] -rotate-1">
                <Sparkles size={14} className="fill-black" />
                <span>PRODUCT HUNT READY • ZERO NFC HARDWARE REQUIRED</span>
              </div>

              {/* Main Headline (Section 1 Core Positioning) */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.04] tracking-tight">
                Your professional identity,<br />
                <span className="inline-block bg-[#2563EB] text-white px-3.5 py-1 my-1.5 border-3 border-black shadow-[5px_5px_0px_#000]">
                  in one link.
                </span>
              </h1>

              {/* Supporting Text (Section 1 Supporting Message) */}
              <p className="text-gray-300 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Create a beautiful digital business card, share it anywhere, and make every connection count.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                {isAuthenticated ? (
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="w-full sm:w-auto h-13 px-8 text-sm font-black uppercase tracking-wide bg-[#2563EB] hover:bg-[#1D4ED8] border-3 border-black shadow-[4px_4px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Go to Dashboard</span>
                      <span className="font-mono text-lg font-bold">→</span>
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    onClick={() => openAuth('signup')}
                    variant="primary" 
                    size="lg" 
                    className="w-full sm:w-auto h-13 px-8 text-sm font-black uppercase tracking-wide bg-[#2563EB] hover:bg-[#1D4ED8] border-3 border-black shadow-[4px_4px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Create Your SmartCard</span>
                    <span className="font-mono text-lg font-bold">→</span>
                  </Button>
                )}

                <Link href="/smriti" className="w-full sm:w-auto">
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    className="w-full sm:w-auto h-13 px-6 text-sm font-black bg-white text-black hover:bg-gray-100 border-3 border-black shadow-[4px_4px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Eye size={16} />
                    <span>Explore a Demo Card</span>
                  </Button>
                </Link>

                <a href="#how-it-works" className="w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto h-13 px-5 text-sm font-bold bg-[#121c33] text-gray-200 hover:text-white border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                  >
                    How It Works
                  </Button>
                </a>
              </div>

              {/* Value checklist (5-Second comprehension) */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 pt-2 text-xs font-mono font-bold text-gray-300">
                <span className="flex items-center gap-1.5 bg-[#0e1628] border-2 border-black px-2.5 py-1 rounded shadow-[2px_2px_0px_#000]">
                  <Check size={14} className="text-cyan-400 stroke-[3]" /> Instant Phone Camera Scan
                </span>
                <span className="flex items-center gap-1.5 bg-[#0e1628] border-2 border-black px-2.5 py-1 rounded shadow-[2px_2px_0px_#000]">
                  <Check size={14} className="text-cyan-400 stroke-[3]" /> Zero NFC Hardware
                </span>
                <span className="flex items-center gap-1.5 bg-[#0e1628] border-2 border-black px-2.5 py-1 rounded shadow-[2px_2px_0px_#000]">
                  <Check size={14} className="text-cyan-400 stroke-[3]" /> Real-Time Analytics
                </span>
              </div>

            </div>

            {/* Right Column: Refined Premium SmartCard Preview with Strategic Neo-Brutalist Depth */}
            <div className="lg:col-span-6 flex flex-col items-center relative py-6">
              
              {/* LAYERED CARDS CONTAINER (Refined Strategic Depth) */}
              <div className="relative w-full max-w-[390px]">
                
                {/* 4 Controlled Decorative Labels (Item 9: CREATE, CUSTOMIZE, SHARE, CONNECT) */}
                <div className="absolute -top-3.5 -left-3 z-30 bg-[#2563EB] text-white border-2 border-black px-2.5 py-0.5 rounded font-mono font-black text-[10px] uppercase shadow-[2px_2px_0px_#000] -rotate-3 pointer-events-none">
                  CREATE
                </div>
                <div className="absolute -top-3.5 -right-3 z-30 bg-cyan-400 text-black border-2 border-black px-2.5 py-0.5 rounded font-mono font-black text-[10px] uppercase shadow-[2px_2px_0px_#000] rotate-3 pointer-events-none">
                  CUSTOMIZE
                </div>
                <div className="absolute -bottom-3.5 -left-3 z-30 bg-emerald-400 text-black border-2 border-black px-2.5 py-0.5 rounded font-mono font-black text-[10px] uppercase shadow-[2px_2px_0px_#000] rotate-2 pointer-events-none">
                  SHARE
                </div>
                <div className="absolute -bottom-3.5 -right-3 z-30 bg-amber-400 text-black border-2 border-black px-2.5 py-0.5 rounded font-mono font-black text-[10px] uppercase shadow-[2px_2px_0px_#000] -rotate-2 pointer-events-none">
                  CONNECT
                </div>

                {/* Back Layer Card: Subtle Cyan Outline Card (-rotate-1.5) */}
                <div 
                  className="absolute inset-0 rounded-2xl border-3 border-black bg-[#06B6D4] shadow-[6px_6px_0px_#000] -rotate-2 -translate-y-2 -translate-x-2 pointer-events-none"
                  aria-hidden="true"
                >
                  <div className="p-3.5 flex items-center justify-between opacity-80">
                    <span className="font-mono text-[9px] font-black uppercase text-black bg-white px-2 py-0.5 rounded border border-black">
                      ALEX MORGAN • SMARTCARD PRO
                    </span>
                    <span className="font-mono text-xs font-black text-black">✦ 01</span>
                  </div>
                </div>

                {/* Main Foreground SmartCard (Center Stage) */}
                <div className="relative z-20 bg-[#0c1220] rounded-2xl border-3 border-black shadow-[8px_8px_0px_#000000] overflow-hidden">
                  
                  {/* Card Banner Header */}
                  <div className="p-5 border-b-3 border-black bg-[#2563EB] text-white relative">
                    <div className="flex items-start justify-between gap-3">
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded border border-white/20">
                            SMART-001
                          </span>
                          <span className="inline-flex items-center gap-1 font-mono text-[9px] font-extrabold uppercase bg-emerald-400 text-black px-1.5 py-0.5 rounded border border-black">
                            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
                            ACTIVE
                          </span>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight text-white mt-1">
                          Alex Morgan
                        </h3>
                        <p className="text-xs font-bold text-white/95">
                          Head of Product &amp; Partnerships
                        </p>
                        <p className="text-[11px] font-mono text-cyan-200 font-bold">
                          SmartCard Technologies
                        </p>
                      </div>

                      {/* Profile Photo Placeholder */}
                      <div className="w-18 h-18 rounded-xl border-3 border-black bg-white overflow-hidden shadow-[3px_3px_0px_#000] shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" 
                          alt="Alex Morgan" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4 bg-[#0c1220]">
                    
                    {/* Short Bio */}
                    <p className="text-xs text-gray-200 font-medium leading-relaxed bg-[#131d33] p-3 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]">
                      &ldquo;Building the modern standard for professional digital identities. 100% digital, zero NFC hardware required.&rdquo;
                    </p>

                    {/* Email, Phone & Website */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                        <a 
                          href="mailto:alex@smartcard.id"
                          className="flex items-center gap-2 p-2 bg-[#17223b] hover:bg-[#1f2d4e] rounded-lg border-2 border-black text-gray-200 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-transform truncate"
                        >
                          <Mail size={14} className="text-cyan-400 shrink-0" />
                          <span className="truncate">alex@smartcard.id</span>
                        </a>
                        <a 
                          href="tel:+14155550192"
                          className="flex items-center gap-2 p-2 bg-[#17223b] hover:bg-[#1f2d4e] rounded-lg border-2 border-black text-gray-200 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-transform truncate"
                        >
                          <Phone size={14} className="text-emerald-400 shrink-0" />
                          <span className="truncate">+1 (415) 555-0192</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-2 p-2 bg-[#17223b] rounded-lg border-2 border-black text-xs font-bold text-gray-200 shadow-[2px_2px_0px_#000]">
                        <Globe size={14} className="text-blue-400 shrink-0" />
                        <span className="text-gray-400 font-mono text-[11px]">Web:</span>
                        <span className="text-white truncate">smartcard.id/alex</span>
                      </div>
                    </div>

                    {/* LinkedIn, GitHub & Social Icons */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                        <span>Verified Profiles</span>
                        <span className="text-cyan-400 font-bold">LinkedIn • GitHub • X</span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2">
                        <a 
                          href="https://linkedin.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 p-2 bg-[#17223b] hover:bg-[#0077b5] hover:text-white rounded-lg border-2 border-black text-gray-200 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs font-bold cursor-pointer"
                          title="LinkedIn Profile"
                        >
                          <LinkedInIcon className="w-4 h-4 fill-current shrink-0" />
                          <span className="text-[10px] font-mono font-bold hidden sm:inline">LI</span>
                        </a>
                        <a 
                          href="https://github.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 p-2 bg-[#17223b] hover:bg-black hover:text-white rounded-lg border-2 border-black text-gray-200 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs font-bold cursor-pointer"
                          title="GitHub Profile"
                        >
                          <GitHubIcon className="w-4 h-4 fill-current shrink-0" />
                          <span className="text-[10px] font-mono font-bold hidden sm:inline">GH</span>
                        </a>
                        <a 
                          href="https://x.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 p-2 bg-[#17223b] hover:bg-black hover:text-white rounded-lg border-2 border-black text-gray-200 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs font-bold cursor-pointer"
                          title="X / Twitter"
                        >
                          <TwitterIcon className="w-4 h-4 fill-current shrink-0" />
                          <span className="text-[10px] font-mono font-bold hidden sm:inline">X</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCopyLink('https://smartcard.id/c/alex')}
                          className="flex items-center justify-center gap-1.5 p-2 bg-[#17223b] hover:bg-[#2563EB] hover:text-white rounded-lg border-2 border-black text-gray-200 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs font-bold cursor-pointer"
                          title="Share Link"
                        >
                          <Share2 size={14} className="shrink-0" />
                          <span className="text-[10px] font-mono font-bold hidden sm:inline">Share</span>
                        </button>
                      </div>
                    </div>

                    {/* QR Code & Direct Share Action */}
                    <div className="pt-2 border-t-2 border-black flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                          Instant Camera QR
                        </span>
                        <p className="text-xs font-bold text-white">
                          Scan to save contact directly
                        </p>
                        <button
                          type="button"
                          onClick={triggerSaveContact}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-gray-100 text-black font-mono font-black text-[10px] uppercase rounded border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                        >
                          <Download size={12} />
                          <span>Save Contact (.vcf)</span>
                        </button>
                      </div>

                      <div className="bg-white p-1.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] shrink-0">
                        <QrCode size={48} className="text-black" />
                      </div>
                    </div>

                  </div>

                </div>

                {/* Save Contact Toast */}
                {savedContactToast && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-emerald-400 text-black border-2 border-black px-4 py-2.5 rounded-lg font-mono font-extrabold text-xs uppercase shadow-[4px_4px_0px_#000] flex items-center gap-2 whitespace-nowrap animate-bounce">
                    <Check size={16} className="stroke-[3]" />
                    <span>vCard Saved to Contacts!</span>
                  </div>
                )}

                {/* Copy Link Toast */}
                {copiedLinkToast && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-cyan-400 text-black border-2 border-black px-4 py-2.5 rounded-lg font-mono font-extrabold text-xs uppercase shadow-[4px_4px_0px_#000] flex items-center gap-2 whitespace-nowrap animate-bounce">
                    <Check size={16} className="stroke-[3]" />
                    <span>Card Link Copied!</span>
                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. TRUST / SOCIAL PROOF */}
      <section className="py-14 bg-[#0d1424] border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="font-mono text-xs uppercase font-extrabold text-cyan-400 px-3 py-1 bg-black border-2 border-black rounded shadow-[2px_2px_0px_#2563EB] inline-block -rotate-1">
              PROVEN PERFORMANCE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              &ldquo;Everything you need to make a memorable professional identity.&rdquo;
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Stat 1: 10K+ Digital Cards */}
            <div className="bg-[#121b30] p-6 rounded-xl border-3 border-black shadow-[5px_5px_0px_#2563EB] -rotate-1 hover:rotate-0 transition-transform">
              <span className="font-mono text-xs uppercase font-extrabold text-blue-400 tracking-wider">
                Digital Cards
              </span>
              <p className="text-4xl sm:text-5xl font-black text-white mt-1">10K+</p>
              <p className="text-xs text-gray-400 mt-2 font-medium">Created by founders &amp; teams</p>
            </div>

            {/* Stat 2: 25K+ Connections */}
            <div className="bg-[#121b30] p-6 rounded-xl border-3 border-black shadow-[5px_5px_0px_#06B6D4] rotate-1 hover:rotate-0 transition-transform">
              <span className="font-mono text-xs uppercase font-extrabold text-cyan-400 tracking-wider">
                Connections
              </span>
              <p className="text-4xl sm:text-5xl font-black text-white mt-1">25K+</p>
              <p className="text-xs text-gray-400 mt-2 font-medium">Instant contact exchanges</p>
            </div>

            {/* Stat 3: 99% Uptime */}
            <div className="bg-[#121b30] p-6 rounded-xl border-3 border-black shadow-[5px_5px_0px_#10B981] -rotate-1 hover:rotate-0 transition-transform">
              <span className="font-mono text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
                Uptime
              </span>
              <p className="text-4xl sm:text-5xl font-black text-white mt-1">99%</p>
              <p className="text-xs text-gray-400 mt-2 font-medium">Reliable global cloud delivery</p>
            </div>

            {/* Stat 4: 24/7 Accessible */}
            <div className="bg-[#121b30] p-6 rounded-xl border-3 border-black shadow-[5px_5px_0px_#F59E0B] rotate-1 hover:rotate-0 transition-transform">
              <span className="font-mono text-xs uppercase font-extrabold text-yellow-400 tracking-wider">
                Accessible
              </span>
              <p className="text-4xl sm:text-5xl font-black text-white mt-1">24/7</p>
              <p className="text-xs text-gray-400 mt-2 font-medium">Scans anywhere, zero apps</p>
            </div>

          </div>
        </div>
      </section>

      {/* COMPARISON MATRIX: WHY DIGITAL BEATS NFC & PAPER */}
      <section className="py-20 border-b-2 border-black bg-[#090D16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="font-mono text-xs uppercase font-bold text-cyan-400 px-3 py-1 bg-[#10192e] border-2 border-black rounded shadow-[2px_2px_0px_#000] inline-block">
              Zero NFC Hardware • 100% Digital Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Why SmartCard Beats Paper &amp; Clunky NFC Cards
            </h2>
            <p className="text-gray-400 text-sm sm:text-base font-medium">
              We eliminated the hardware bottleneck. No physical chips to break, tap, or forget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Old Paper Cards */}
            <div className="bg-[#0e1526] p-7 rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] space-y-5 opacity-85">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-xl text-gray-300">Paper Business Cards</h3>
                <span className="text-xs font-mono font-bold bg-red-950/80 text-red-400 border border-red-500/50 px-2 py-0.5 rounded">
                  Outdated
                </span>
              </div>
              <ul className="space-y-3 text-xs text-gray-400 font-medium">
                <li className="flex items-start gap-2">
                  <X size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <span>88% get thrown away within 7 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <X size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <span>Outdated the instant a phone or title changes</span>
                </li>
                <li className="flex items-start gap-2">
                  <X size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <span>Continuous printing and shipping costs</span>
                </li>
                <li className="flex items-start gap-2">
                  <X size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <span>Zero links, zero portfolio, zero analytics</span>
                </li>
              </ul>
            </div>

            {/* Physical NFC Cards */}
            <div className="bg-[#0e1526] p-7 rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] space-y-5 opacity-85">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-xl text-gray-300">Physical NFC Plastic</h3>
                <span className="text-xs font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-500/50 px-2 py-0.5 rounded">
                  Hardware Friction
                </span>
              </div>
              <ul className="space-y-3 text-xs text-gray-400 font-medium">
                <li className="flex items-start gap-2">
                  <X size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>Requires carrying physical plastic hardware</span>
                </li>
                <li className="flex items-start gap-2">
                  <X size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>NFC reader fails through thick cases or awkward angles</span>
                </li>
                <li className="flex items-start gap-2">
                  <X size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>Cannot be shared over Zoom, LinkedIn or WhatsApp</span>
                </li>
                <li className="flex items-start gap-2">
                  <X size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>$30 - $50 replacement fee whenever lost</span>
                </li>
              </ul>
            </div>

            {/* SmartCard Platform (Winner) */}
            <div className="bg-[#121c33] p-7 rounded-xl border-3 border-black shadow-[8px_8px_0px_#2563EB] space-y-5 relative">
              <div className="absolute -top-3.5 right-6 bg-[#2563EB] text-white font-mono font-black text-xs uppercase px-3 py-0.5 rounded border-2 border-black shadow-[2px_2px_0px_#000]">
                Modern Standard
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-black text-2xl text-white">SmartCard Platform</h3>
              </div>
              <ul className="space-y-3 text-xs text-gray-200 font-bold">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-cyan-400 shrink-0 mt-0.5 stroke-[3]" />
                  <span>100% web-native: opens on any phone camera or link</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-cyan-400 shrink-0 mt-0.5 stroke-[3]" />
                  <span>Two-way contact exchange: visitors send info back</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-cyan-400 shrink-0 mt-0.5 stroke-[3]" />
                  <span>Instant real-time edits without reprinting</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-cyan-400 shrink-0 mt-0.5 stroke-[3]" />
                  <span>Full analytics: track views, shares, and lead scores</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 5. FEATURES SECTION (Item 13) */}
      <section id="features" className="py-20 border-b-2 border-black bg-[#0d1424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-xs uppercase font-extrabold text-cyan-400 px-3 py-1 bg-black border-2 border-black rounded shadow-[2px_2px_0px_#2563EB] inline-block -rotate-1">
              BUILT FOR HIGH IMPACT
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Everything you need to be unforgettable.
            </h2>
            <p className="text-gray-300 text-sm sm:text-base font-medium">
              Every tool to design, distribute, and track your digital business card with zero friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Feature 1: Beautiful Digital Identity */}
            <div className="bg-[#121c33] p-7 rounded-xl border-3 border-black shadow-[5px_5px_0px_#2563EB] -rotate-1 hover:rotate-0 hover:-translate-y-1 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-[#2563EB] border-2 border-black flex items-center justify-center text-white shadow-[3px_3px_0px_#000]">
                  <CreditCard size={24} />
                </div>
                <span className="font-mono text-[10px] font-black uppercase bg-black text-cyan-400 px-2 py-0.5 rounded border border-white/20">
                  ⚡ IDENTITY
                </span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Beautiful Digital Identity</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                Create a professional profile that looks better than a traditional business card.
              </p>
              
              {/* Visual Element: Mini Identity Card */}
              <div className="p-3 bg-[#0a0f1c] rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500 border-2 border-black flex items-center justify-center font-black text-white text-sm shrink-0">
                  SJ
                </div>
                <div className="truncate">
                  <div className="text-xs font-black text-white truncate">Smriti Jha</div>
                  <div className="text-[10px] font-mono text-cyan-400 truncate">smartcard.app/smriti</div>
                </div>
                <span className="ml-auto text-[10px] font-mono font-bold bg-emerald-400 text-black px-1.5 py-0.5 rounded border border-black">
                  READY
                </span>
              </div>
            </div>

            {/* Feature 2: Customize Your Card */}
            <div className="bg-[#121c33] p-7 rounded-xl border-3 border-black shadow-[5px_5px_0px_#06B6D4] rotate-1 hover:rotate-0 hover:-translate-y-1 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-[#06B6D4] border-2 border-black flex items-center justify-center text-black shadow-[3px_3px_0px_#000]">
                  <Palette size={24} />
                </div>
                <span className="font-mono text-[10px] font-black uppercase bg-black text-yellow-400 px-2 py-0.5 rounded border border-white/20">
                  THEMES
                </span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Customize Your Card</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                Control colors, layout, links and appearance.
              </p>

              {/* Visual Element: Interactive Theme Swatches & Toggles */}
              <div className="p-3 bg-[#0a0f1c] rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400 font-bold uppercase">Accent Color</span>
                  <div className="flex items-center gap-1.5">
                    {['#2563EB', '#06B6D4', '#F59E0B', '#10B981'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFeatureCustomTheme(c)}
                        className={`w-4 h-4 rounded-full border border-black cursor-pointer transition-transform ${
                          featureCustomTheme === c ? 'scale-125 ring-1 ring-white' : ''
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 text-[9px] font-mono font-bold">
                  <span className="bg-[#17223b] text-gray-300 px-1.5 py-0.5 rounded border border-black">+ LinkedIn</span>
                  <span className="bg-[#17223b] text-gray-300 px-1.5 py-0.5 rounded border border-black">+ GitHub</span>
                  <span className="bg-[#17223b] text-cyan-400 px-1.5 py-0.5 rounded border border-black">+ Portfolio</span>
                </div>
              </div>
            </div>

            {/* Feature 3: One Link */}
            <div className="bg-[#121c33] p-7 rounded-xl border-3 border-black shadow-[5px_5px_0px_#10B981] -rotate-0.5 hover:rotate-0 hover:-translate-y-1 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-[#10B981] border-2 border-black flex items-center justify-center text-black shadow-[3px_3px_0px_#000]">
                  <Link2 size={24} />
                </div>
                <span className="font-mono text-[10px] font-black uppercase bg-black text-emerald-400 px-2 py-0.5 rounded border border-white/20">
                  ONE URL
                </span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">One Link</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                Share your entire professional identity through one simple URL.
              </p>

              {/* Visual Element: Mini Vanity URL & Quick Copy Bar */}
              <div className="p-3 bg-[#0a0f1c] rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <div className="bg-white p-1 rounded border border-black shrink-0">
                    <Globe size={18} className="text-black" />
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 truncate font-bold">
                    smartcard.app/smriti
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyLink('https://smartcard.app/smriti')}
                  className="px-2 py-1 bg-white hover:bg-gray-100 text-black text-[10px] font-mono font-black uppercase rounded border border-black shadow-[1px_1px_0px_#000] shrink-0 cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Feature 4: QR Sharing */}
            <div className="bg-[#121c33] p-7 rounded-xl border-3 border-black shadow-[5px_5px_0px_#F59E0B] rotate-1 hover:rotate-0 hover:-translate-y-1 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-[#F59E0B] border-2 border-black flex items-center justify-center text-black shadow-[3px_3px_0px_#000]">
                  <QrCode size={24} />
                </div>
                <span className="font-mono text-[10px] font-black uppercase bg-black text-yellow-400 px-2 py-0.5 rounded border border-white/20">
                  INSTANT SCAN
                </span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">QR Sharing</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                Let people connect instantly by scanning your QR code.
              </p>

              {/* Visual Element: Mini QR Widget */}
              <div className="p-3 bg-[#0a0f1c] rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-bold text-white">Camera Scannable</div>
                  <div className="text-[10px] font-mono text-gray-400">Zero apps needed to view</div>
                </div>
                <div className="bg-white p-1 rounded border border-black shrink-0">
                  <QrCode size={30} className="text-black" />
                </div>
              </div>
            </div>

            {/* Feature 5: Analytics */}
            <div className="bg-[#121c33] p-7 rounded-xl border-3 border-black shadow-[5px_5px_0px_#8B5CF6] -rotate-1 hover:rotate-0 hover:-translate-y-1 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-[#8B5CF6] border-2 border-black flex items-center justify-center text-white shadow-[3px_3px_0px_#000]">
                  <BarChart3 size={24} />
                </div>
                <span className="font-mono text-[10px] font-black uppercase bg-black text-purple-300 px-2 py-0.5 rounded border border-white/20">
                  TELEMETRY
                </span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Analytics</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                See who is viewing and interacting with your profile.
              </p>

              {/* Visual Element: Mini Telemetry Widget */}
              <div className="p-3 bg-[#0a0f1c] rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-white">1,420 Profile Views</span>
                  <span className="font-mono text-emerald-400 font-extrabold">+84% this wk</span>
                </div>
                <div className="flex items-end gap-1.5 h-6 pt-1">
                  <div className="flex-1 bg-blue-500 rounded-t h-3 border border-black"></div>
                  <div className="flex-1 bg-blue-500 rounded-t h-4 border border-black"></div>
                  <div className="flex-1 bg-blue-500 rounded-t h-5 border border-black"></div>
                  <div className="flex-1 bg-cyan-400 rounded-t h-6 border border-black"></div>
                </div>
              </div>
            </div>

            {/* Feature 6: Always Available */}
            <div className="bg-[#121c33] p-7 rounded-xl border-3 border-black shadow-[5px_5px_0px_#06B6D4] rotate-0.5 hover:rotate-0 hover:-translate-y-1 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-cyan-400 border-2 border-black flex items-center justify-center text-black shadow-[3px_3px_0px_#000]">
                  <Smartphone size={24} />
                </div>
                <span className="font-mono text-[10px] font-black uppercase bg-black text-emerald-400 px-2 py-0.5 rounded border border-white/20">
                  UNIVERSAL
                </span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Always Available</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                Your professional identity is available anywhere, anytime.
              </p>

              {/* Visual Element: Multi-Device Matrix Pill */}
              <div className="p-3 bg-[#0a0f1c] rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-between">
                <div className="text-[11px] font-mono font-bold text-gray-200">
                  iOS • Android • Web
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-extrabold bg-emerald-400 text-black px-1.5 py-0.5 rounded border border-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
                  99.9% Uptime
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 14. HOW IT WORKS (SECTION 14: 4-STEP TIMELINE) */}
      <section id="how-it-works" className="py-20 border-b-2 border-black bg-[#090D16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="font-mono text-xs uppercase font-extrabold text-yellow-400 px-3 py-1 bg-black border-2 border-black rounded shadow-[2px_2px_0px_#000] inline-block rotate-1">
              STEP-BY-STEP PROCESS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              How It Works
            </h2>
            <p className="text-gray-300 text-sm sm:text-base font-medium">
              From zero to an active, scannable professional identity in four seamless steps.
            </p>
          </div>

          {/* DESKTOP HORIZONTAL TIMELINE */}
          <div className="hidden lg:block mb-12">
            <div className="relative">
              {/* Connecting Horizontal Line Behind Steps */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0 border-y border-black"></div>

              <div className="grid grid-cols-4 gap-6 relative z-10">
                
                {/* Step 01: Create */}
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className={`text-left p-5 rounded-xl border-3 border-black transition-all cursor-pointer ${
                    activeStep === 1
                      ? 'bg-[#121c33] shadow-[6px_6px_0px_#2563EB] -translate-y-1.5 ring-2 ring-[#2563EB]'
                      : 'bg-[#0d1424] opacity-80 hover:opacity-100 shadow-[3px_3px_0px_#000]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black font-mono text-blue-400">
                      01 — Create
                    </span>
                    <span className={`w-3 h-3 rounded-full border border-black ${activeStep === 1 ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'}`}></span>
                  </div>
                  <h3 className="text-sm font-black text-white">
                    Build your professional identity.
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 font-medium leading-relaxed">
                    Set up your name, job role, company, bio, and profile headshot in 45 seconds.
                  </p>
                </button>

                {/* Step 02: Customize */}
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className={`text-left p-5 rounded-xl border-3 border-black transition-all cursor-pointer ${
                    activeStep === 2
                      ? 'bg-[#121c33] shadow-[6px_6px_0px_#06B6D4] -translate-y-1.5 ring-2 ring-[#06B6D4]'
                      : 'bg-[#0d1424] opacity-80 hover:opacity-100 shadow-[3px_3px_0px_#000]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black font-mono text-cyan-400">
                      02 — Customize
                    </span>
                    <span className={`w-3 h-3 rounded-full border border-black ${activeStep === 2 ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'}`}></span>
                  </div>
                  <h3 className="text-sm font-black text-white">
                    Make your SmartCard yours.
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 font-medium leading-relaxed">
                    Personalize accent colors, brand aesthetics, verified social links, and layout styling.
                  </p>
                </button>

                {/* Step 03: Share */}
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className={`text-left p-5 rounded-xl border-3 border-black transition-all cursor-pointer ${
                    activeStep === 3
                      ? 'bg-[#121c33] shadow-[6px_6px_0px_#10B981] -translate-y-1.5 ring-2 ring-[#10B981]'
                      : 'bg-[#0d1424] opacity-80 hover:opacity-100 shadow-[3px_3px_0px_#000]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black font-mono text-emerald-400">
                      03 — Share
                    </span>
                    <span className={`w-3 h-3 rounded-full border border-black ${activeStep === 3 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'}`}></span>
                  </div>
                  <h3 className="text-sm font-black text-white">
                    Send your link or QR code.
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 font-medium leading-relaxed">
                    Hold up your instant camera QR code or text your personalized vanity web URL.
                  </p>
                </button>

                {/* Step 04: Connect */}
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className={`text-left p-5 rounded-xl border-3 border-black transition-all cursor-pointer ${
                    activeStep === 4
                      ? 'bg-[#121c33] shadow-[6px_6px_0px_#F59E0B] -translate-y-1.5 ring-2 ring-[#F59E0B]'
                      : 'bg-[#0d1424] opacity-80 hover:opacity-100 shadow-[3px_3px_0px_#000]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black font-mono text-yellow-400">
                      04 — Connect
                    </span>
                    <span className={`w-3 h-3 rounded-full border border-black ${activeStep === 4 ? 'bg-yellow-400 animate-pulse' : 'bg-slate-700'}`}></span>
                  </div>
                  <h3 className="text-sm font-black text-white">
                    Turn views into meaningful connections.
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 font-medium leading-relaxed">
                    Recipients save your vCard directly and can exchange their details back into your lead inbox.
                  </p>
                </button>

              </div>
            </div>
          </div>

          {/* MOBILE VERTICAL TIMELINE */}
          <div className="lg:hidden space-y-4 mb-10 pl-4 border-l-3 border-[#2563EB] ml-2">
            
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className={`w-full text-left p-4 rounded-xl border-2 border-black transition-all ${
                activeStep === 1 ? 'bg-[#121c33] shadow-[4px_4px_0px_#2563EB]' : 'bg-[#0d1424] opacity-80'
              }`}
            >
              <span className="text-xs font-mono font-black text-blue-400 block mb-0.5">01 — Create</span>
              <h4 className="text-sm font-black text-white">Build your professional identity.</h4>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className={`w-full text-left p-4 rounded-xl border-2 border-black transition-all ${
                activeStep === 2 ? 'bg-[#121c33] shadow-[4px_4px_0px_#06B6D4]' : 'bg-[#0d1424] opacity-80'
              }`}
            >
              <span className="text-xs font-mono font-black text-cyan-400 block mb-0.5">02 — Customize</span>
              <h4 className="text-sm font-black text-white">Make your SmartCard yours.</h4>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className={`w-full text-left p-4 rounded-xl border-2 border-black transition-all ${
                activeStep === 3 ? 'bg-[#121c33] shadow-[4px_4px_0px_#10B981]' : 'bg-[#0d1424] opacity-80'
              }`}
            >
              <span className="text-xs font-mono font-black text-emerald-400 block mb-0.5">03 — Share</span>
              <h4 className="text-sm font-black text-white">Send your link or QR code.</h4>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep(4)}
              className={`w-full text-left p-4 rounded-xl border-2 border-black transition-all ${
                activeStep === 4 ? 'bg-[#121c33] shadow-[4px_4px_0px_#F59E0B]' : 'bg-[#0d1424] opacity-80'
              }`}
            >
              <span className="text-xs font-mono font-black text-yellow-400 block mb-0.5">04 — Connect</span>
              <h4 className="text-sm font-black text-white">Turn views into meaningful connections.</h4>
            </button>

          </div>

          {/* INTERACTIVE STAGE FOR CURRENT STEP */}
          <div className="bg-[#121c33] p-6 sm:p-8 rounded-2xl border-3 border-black shadow-[8px_8px_0px_#000000] max-w-4xl mx-auto">
            
            {/* Stage Bar */}
            <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400 border border-black"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400 border border-black"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400 border border-black"></span>
                <span className="text-xs font-mono font-bold text-gray-400 uppercase ml-2">
                  Simulation Studio • Step 0{activeStep}
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-cyan-400 bg-black px-2.5 py-1 rounded border border-white/20">
                {activeStep === 1 ? 'CREATE MODE' : activeStep === 2 ? 'CUSTOMIZE STUDIO' : activeStep === 3 ? 'SHARE STATION' : 'CONNECT INBOX'}
              </span>
            </div>

            {/* Step 1: Create */}
            {activeStep === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-white">01 — Create Your Profile</h4>
                  <p className="text-xs text-gray-300">
                    Test typing below to see how fast a SmartCard initializes:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold uppercase text-gray-300">Your Full Name</label>
                    <input 
                      type="text" 
                      value={step1Name}
                      onChange={(e) => setStep1Name(e.target.value)}
                      className="w-full h-10 bg-[#090D16] border-2 border-black rounded-lg px-3 text-sm font-bold text-white shadow-[2px_2px_0px_#000]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold uppercase text-gray-300">Job Title</label>
                    <input 
                      type="text" 
                      value={step1Role}
                      onChange={(e) => setStep1Role(e.target.value)}
                      className="w-full h-10 bg-[#090D16] border-2 border-black rounded-lg px-3 text-sm font-bold text-white shadow-[2px_2px_0px_#000]"
                    />
                  </div>
                </div>

                {/* Genesis Preview Card */}
                <div className="p-4 bg-[#0a0f1c] rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-600 border-2 border-black flex items-center justify-center text-white font-black text-xl shadow-[2px_2px_0px_#000] shrink-0">
                    {step1Name.charAt(0) || 'S'}
                  </div>
                  <div className="truncate">
                    <div className="text-base font-black text-white truncate">{step1Name || 'Your Name'}</div>
                    <div className="text-xs font-bold text-gray-300 truncate">{step1Role || 'Your Title'}</div>
                    <div className="text-[10px] font-mono text-cyan-400 font-bold">smartcard.app/{step1Name.toLowerCase().replace(/\s+/g, '')}</div>
                  </div>
                  <div className="ml-auto text-right shrink-0">
                    <span className="font-mono text-[10px] font-extrabold uppercase bg-emerald-400 text-black px-2 py-0.5 rounded border border-black">
                      ✓ Profile Ready
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#0d1424] rounded-lg border border-black text-xs font-mono text-gray-300 flex items-center justify-between">
                  <span>✓ Zero app download needed</span>
                  <button 
                    onClick={() => setActiveStep(2)}
                    className="text-cyan-400 font-bold hover:underline cursor-pointer"
                  >
                    Next: Customize Style →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Customize */}
            {activeStep === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-white">02 — Customize Information &amp; Social Links</h4>
                  <p className="text-xs text-gray-300">
                    Pick accent colors and toggle verified social links:
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300">Select Accent Color</label>
                  <div className="flex items-center gap-3">
                    {[
                      { color: '#2563EB', name: 'Electric Blue' },
                      { color: '#06B6D4', name: 'Cyan' },
                      { color: '#F59E0B', name: 'Amber' },
                      { color: '#10B981', name: 'Emerald' }
                    ].map((c) => (
                      <button
                        key={c.color}
                        type="button"
                        onClick={() => setStep2Theme(c.color)}
                        className={`px-3 py-1.5 rounded-lg border-2 border-black font-mono text-xs font-bold shadow-[2px_2px_0px_#000] cursor-pointer transition-transform ${
                          step2Theme === c.color ? 'scale-105 ring-2 ring-white text-black' : 'text-black opacity-80'
                        }`}
                        style={{ backgroundColor: c.color }}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300">Active Profile Badges</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setStep2Socials(prev => ({ ...prev, linkedin: !prev.linkedin }))}
                      className={`px-3 py-1.5 rounded-lg border-2 border-black text-xs font-bold font-mono shadow-[2px_2px_0px_#000] cursor-pointer ${
                        step2Socials.linkedin ? 'bg-[#0077b5] text-white' : 'bg-slate-800 text-gray-400'
                      }`}
                    >
                      {step2Socials.linkedin ? '✓ LinkedIn Attached' : '+ Add LinkedIn'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep2Socials(prev => ({ ...prev, github: !prev.github }))}
                      className={`px-3 py-1.5 rounded-lg border-2 border-black text-xs font-bold font-mono shadow-[2px_2px_0px_#000] cursor-pointer ${
                        step2Socials.github ? 'bg-black text-white' : 'bg-slate-800 text-gray-400'
                      }`}
                    >
                      {step2Socials.github ? '✓ GitHub Attached' : '+ Add GitHub'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep2Socials(prev => ({ ...prev, twitter: !prev.twitter }))}
                      className={`px-3 py-1.5 rounded-lg border-2 border-black text-xs font-bold font-mono shadow-[2px_2px_0px_#000] cursor-pointer ${
                        step2Socials.twitter ? 'bg-black text-white' : 'bg-slate-800 text-gray-400'
                      }`}
                    >
                      {step2Socials.twitter ? '✓ X Profile Attached' : '+ Add X'}
                    </button>
                  </div>
                </div>

                <div 
                  className="p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] text-white flex items-center justify-between"
                  style={{ backgroundColor: step2Theme }}
                >
                  <div>
                    <div className="text-xs font-black uppercase">Live Theme Preview</div>
                    <div className="text-[11px] font-mono opacity-90">Custom styling applied in real time</div>
                  </div>
                  <button 
                    onClick={() => setActiveStep(3)}
                    className="px-3 py-1 bg-black text-white font-mono text-xs font-bold rounded border border-white/20 cursor-pointer"
                  >
                    Next: Share Station →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Share */}
            {activeStep === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-white">03 — Share Your Link or QR Code</h4>
                  <p className="text-xs text-gray-300">
                    Scan with any modern phone camera, copy your link, or send via messaging apps:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-[#0a0f1c] p-5 rounded-xl border-2 border-black shadow-[4px_4px_0px_#000]">
                  <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg border-2 border-black shadow-[3px_3px_0px_#000]">
                    <QrCode size={110} className="text-black" />
                    <span className="font-mono text-[10px] font-black text-black mt-2 uppercase">
                      Point Phone Camera Here
                    </span>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => handleCopyLink('https://smartcard.app/smriti')}
                      className="w-full py-2.5 px-3 bg-white hover:bg-gray-100 text-black font-mono font-black text-xs uppercase rounded-lg border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <Copy size={14} />
                      <span>Copy smartcard.app/smriti</span>
                    </button>

                    <button
                      type="button"
                      onClick={triggerSaveContact}
                      className="w-full py-2.5 px-3 bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-black text-xs uppercase rounded-lg border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <Download size={14} />
                      <span>Download .vcf Contact</span>
                    </button>

                    <div className="text-center font-mono text-[11px] text-emerald-400 font-bold">
                      ✓ Zero hardware needed. 100% digital.
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#0d1424] rounded-lg border border-black text-xs font-mono text-gray-300 flex items-center justify-between">
                  <span>Hold up card at conferences or meetings</span>
                  <button 
                    onClick={() => setActiveStep(4)}
                    className="text-cyan-400 font-bold hover:underline cursor-pointer"
                  >
                    Next: Connect &amp; Exchange →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Connect */}
            {activeStep === 4 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-white">04 — Turn Views Into Meaningful Connections</h4>
                  <p className="text-xs text-gray-300">
                    When someone scans your card, they can instantly exchange their contact details back to you:
                  </p>
                </div>

                <div className="p-5 bg-[#0a0f1c] rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                    <span className="font-mono text-xs font-bold uppercase text-yellow-400">
                      Two-Way Contact Exchange Simulator
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500">
                      Zero Friction
                    </span>
                  </div>

                  {!step4ExchangeSubmitted ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input 
                          type="text" 
                          placeholder="Visitor Name (e.g. Priya Sharma)"
                          defaultValue="Priya Sharma"
                          className="h-10 bg-[#121c33] border-2 border-black rounded-lg px-3 text-xs font-bold text-white shadow-[2px_2px_0px_#000]"
                        />
                        <input 
                          type="email" 
                          placeholder="Visitor Email (e.g. priya@apex.dev)"
                          defaultValue="priya@apex.dev"
                          className="h-10 bg-[#121c33] border-2 border-black rounded-lg px-3 text-xs font-bold text-white shadow-[2px_2px_0px_#000]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep4ExchangeSubmitted(true)}
                        className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-black text-xs uppercase rounded-lg border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
                      >
                        Simulate Visitor Sending Contact Back →
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-950/80 border-2 border-emerald-500 rounded-lg text-emerald-300 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <Check size={18} className="text-emerald-400 stroke-[3]" />
                        <span>Lead captured directly in your SmartCard inbox!</span>
                      </div>
                      <p className="text-xs text-gray-300 font-mono">
                        Priya Sharma &lt;priya@apex.dev&gt; logged into your Contacts tab with date stamp and intent score.
                      </p>
                      <button
                        type="button"
                        onClick={() => setStep4ExchangeSubmitted(false)}
                        className="text-xs font-mono font-bold text-cyan-400 underline cursor-pointer"
                      >
                        Reset simulation
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400">
                    Ready to build your SmartCard?
                  </span>
                  <Button 
                    onClick={() => openAuth('signup')}
                    variant="primary" 
                    size="sm" 
                    className="text-xs font-black uppercase tracking-wider bg-[#2563EB] border-2 border-black shadow-[2px_2px_0px_#000]"
                  >
                    Create Your SmartCard →
                  </Button>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 7. PRODUCT PREVIEW SECTION */}
      <section id="preview" className="py-24 border-b-2 border-black bg-[#090D16] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-xs uppercase font-extrabold text-cyan-400 px-3 py-1 bg-black border-2 border-black rounded shadow-[2px_2px_0px_#2563EB] inline-block -rotate-1">
              LIVE PRODUCT TOUR
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              The Command Center for Your Digital Identity
            </h2>
            <p className="text-gray-300 text-sm sm:text-base font-medium">
              A peek inside the SmartCard dashboard. Monitor real-time QR scans, capture two-way leads, and customize your cards.
            </p>
          </div>

          {/* Browser Window Frame */}
          <div className="max-w-6xl mx-auto rounded-2xl border-3 border-black shadow-[12px_12px_0px_#000000] bg-[#0c1322] overflow-hidden">
            
            {/* Browser Window Chrome Topbar */}
            <div className="bg-[#080d17] border-b-3 border-black px-4 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-black"></span>
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-400 border-2 border-black"></span>
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black"></span>
              </div>

              {/* Monospace URL Bar */}
              <div className="flex-1 max-w-md mx-auto bg-[#040711] border-2 border-black rounded-lg px-3.5 py-1 flex items-center justify-center gap-2 text-xs font-mono text-gray-300 shadow-[1px_1px_0px_#000]">
                <span className="text-emerald-400">🔒</span>
                <span className="text-gray-400">https://</span>
                <span className="text-white font-bold">smartcard.id/dashboard</span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] font-extrabold uppercase bg-cyan-400 text-black px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
                LIVE PREVIEW
              </div>
            </div>

            {/* Fake Dashboard UI */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
              
              {/* Sidebar */}
              <div className="md:col-span-3 bg-[#0a0f1c] border-b-3 md:border-b-0 md:border-r-3 border-black p-5 flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Brand Header */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#2563EB] border-2 border-black flex items-center justify-center font-black text-white shadow-[2px_2px_0px_#000]">
                      <CreditCard size={16} />
                    </div>
                    <div>
                      <span className="font-black text-base text-white tracking-tight">SmartCard</span>
                      <span className="block text-[9px] font-mono text-cyan-400 font-bold uppercase">Pro OS</span>
                    </div>
                  </div>

                  {/* Sidebar Navigation: Overview, My Card, Analytics, Contacts, Settings */}
                  <nav className="space-y-1.5">
                    <div className="px-3 py-2 bg-[#2563EB] text-white font-mono font-bold text-xs uppercase rounded-lg border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between">
                      <span>Overview</span>
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                    </div>
                    <div className="px-3 py-2 text-gray-400 hover:text-white font-mono font-bold text-xs uppercase rounded-lg border-2 border-transparent hover:border-black hover:bg-slate-800 transition-all cursor-pointer">
                      My Card
                    </div>
                    <div className="px-3 py-2 text-gray-400 hover:text-white font-mono font-bold text-xs uppercase rounded-lg border-2 border-transparent hover:border-black hover:bg-slate-800 transition-all cursor-pointer">
                      Analytics
                    </div>
                    <div className="px-3 py-2 text-gray-400 hover:text-white font-mono font-bold text-xs uppercase rounded-lg border-2 border-transparent hover:border-black hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between">
                      <span>Contacts</span>
                      <span className="bg-emerald-400 text-black px-1.5 py-0.2 rounded text-[10px] font-black border border-black">142</span>
                    </div>
                    <div className="px-3 py-2 text-gray-400 hover:text-white font-mono font-bold text-xs uppercase rounded-lg border-2 border-transparent hover:border-black hover:bg-slate-800 transition-all cursor-pointer">
                      Settings
                    </div>
                  </nav>
                </div>

                {/* Sidebar User Profile Pill */}
                <div className="pt-4 border-t-2 border-black flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg border-2 border-black bg-white overflow-hidden shadow-[2px_2px_0px_#000] shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                      alt="Alex Morgan" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-black text-white truncate">Alex Morgan</div>
                    <div className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Online • Pro
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Area */}
              <div className="md:col-span-9 p-5 sm:p-7 space-y-6 bg-[#090D16]">
                
                {/* Welcome Message & Quick Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-5">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Welcome back, Alex 👋
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 font-medium">
                      Your digital business card is active and collecting leads.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openAuth('signup')}
                      className="px-3.5 py-2 bg-white hover:bg-gray-100 text-black font-mono font-black text-xs uppercase rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                    >
                      + Share Card
                    </button>
                    <Link
                      href="/smriti"
                      target="_blank"
                      className="px-3.5 py-2 bg-[#2563EB] hover:bg-blue-600 text-white font-mono font-black text-xs uppercase rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      View Live ↗
                    </Link>
                  </div>
                </div>

                {/* Profile Completion Bar */}
                <div className="p-4 bg-[#121c33] rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <span className="text-white flex items-center gap-1.5">
                      <Sparkles size={14} className="text-cyan-400" />
                      Profile 94% Complete
                    </span>
                    <span className="text-cyan-400">smartcard.id/c/alex</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-3 bg-black rounded border-2 border-black overflow-hidden p-0.5">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-sm w-[94%]"></div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono font-bold text-gray-300 pt-1">
                    <span className="text-emerald-400">✓ Photo Verified</span>
                    <span className="text-emerald-400">✓ Bio &amp; Role</span>
                    <span className="text-emerald-400">✓ Social Links</span>
                    <span className="text-emerald-400">✓ vCard Sync</span>
                  </div>
                </div>

                {/* Total views, Total shares, Contacts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#10182c] p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_#2563EB]">
                    <span className="font-mono text-[10px] uppercase font-bold text-blue-400">Total Views</span>
                    <p className="text-2xl font-black text-white mt-0.5">1,420</p>
                    <p className="text-[10px] text-emerald-400 font-mono font-bold mt-1">↑ +28% this week</p>
                  </div>
                  <div className="bg-[#10182c] p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_#06B6D4]">
                    <span className="font-mono text-[10px] uppercase font-bold text-cyan-400">Total Shares</span>
                    <p className="text-2xl font-black text-white mt-0.5">384</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-1">Camera QR &amp; WhatsApp</p>
                  </div>
                  <div className="bg-[#10182c] p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_#10B981]">
                    <span className="font-mono text-[10px] uppercase font-bold text-emerald-400">Contacts</span>
                    <p className="text-2xl font-black text-white mt-0.5">142</p>
                    <p className="text-[10px] text-cyan-400 font-mono font-bold mt-1">Two-way lead capture</p>
                  </div>
                </div>

                {/* Split Lower Area: Card Preview & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  
                  {/* Card Preview */}
                  <div className="lg:col-span-5 bg-[#10182c] p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                      <span className="text-xs font-mono font-bold uppercase text-gray-300">Card Preview</span>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">SMART-001</span>
                    </div>

                    <div className="p-3 bg-[#090D16] rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg border-2 border-black bg-white overflow-hidden shadow-[1px_1px_0px_#000] shrink-0">
                          <img 
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                            alt="Alex Morgan" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="truncate">
                          <h5 className="text-xs font-black text-white truncate">Alex Morgan</h5>
                          <p className="text-[10px] font-bold text-blue-400 truncate">Head of Product</p>
                          <p className="text-[9px] font-mono text-gray-400 truncate">SmartCard Technologies</p>
                        </div>
                      </div>

                      <div className="p-2 bg-white rounded-lg border-2 border-black flex items-center justify-between gap-2">
                        <div className="text-[10px] font-mono font-bold text-black leading-tight">
                          SCAN TO CONNECT<br />
                          <span className="text-[9px] text-gray-600">Zero App Needed</span>
                        </div>
                        <QrCode size={36} className="text-black shrink-0" />
                      </div>

                      <div className="flex gap-1.5 text-[10px] font-mono font-bold">
                        <span className="flex-1 text-center p-1 bg-[#17223b] rounded border border-black text-gray-200">📱 Call</span>
                        <span className="flex-1 text-center p-1 bg-[#17223b] rounded border border-black text-gray-200">✉️ Mail</span>
                        <span className="flex-1 text-center p-1 bg-[#2563EB] rounded border border-black text-white">Save vCard</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="lg:col-span-7 bg-[#10182c] p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                      <span className="text-xs font-mono font-bold uppercase text-gray-300">Recent Activity</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">● Live Stream</span>
                    </div>

                    <div className="space-y-2">
                      <div className="p-2.5 bg-[#090D16] rounded-lg border border-black flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                          <span className="text-xs font-bold text-white truncate">Sarah Chen (Apex Ventures)</span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400 shrink-0">4m ago</span>
                      </div>

                      <div className="p-2.5 bg-[#090D16] rounded-lg border border-black flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span>
                          <span className="text-xs font-bold text-white truncate">Camera QR scan in San Francisco</span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400 shrink-0">22m ago</span>
                      </div>

                      <div className="p-2.5 bg-[#090D16] rounded-lg border border-black flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
                          <span className="text-xs font-bold text-white truncate">Michael Kline downloaded .vcf vCard</span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400 shrink-0">1h ago</span>
                      </div>

                      <div className="p-2.5 bg-[#090D16] rounded-lg border border-black flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0"></span>
                          <span className="text-xs font-bold text-white truncate">Profile shared on WhatsApp</span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400 shrink-0">3h ago</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 15. PRODUCT SHOWCASE (SECTION 15: YOUR SMARTCARD. YOUR WAY.) */}
      <section id="showcase" className="py-24 border-b-2 border-black bg-[#0d1424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-xs uppercase font-extrabold text-cyan-400 px-3 py-1 bg-black border-2 border-black rounded shadow-[2px_2px_0px_#06B6D4] inline-block -rotate-1">
              CUSTOMIZATION SHOWCASE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Your SmartCard. Your way.
            </h2>
            <p className="text-gray-300 text-sm sm:text-base font-medium">
              Switch between five signature card styles tailored for founders, creators, executives, and engineers.
            </p>

            {/* Style Selector Buttons */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-2.5">
              {(['Minimal', 'Professional', 'Bold', 'Dark', 'Creative'] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  className={`px-4 py-2 rounded-lg font-mono text-xs font-black uppercase transition-all cursor-pointer ${
                    selectedStyle === style
                      ? 'bg-yellow-400 text-black border-2 border-black shadow-[3px_3px_0px_#000] -translate-y-0.5'
                      : 'bg-[#121c33] text-gray-300 border-2 border-black hover:bg-[#1a2745] hover:text-white shadow-[2px_2px_0px_#000]'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Card Style Stage */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#090D16] p-6 sm:p-10 rounded-2xl border-3 border-black shadow-[8px_8px_0px_#000]">
            
            {/* Left Info Column */}
            <div className="md:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-black border border-white/20 font-mono text-xs text-yellow-400 font-bold uppercase">
                <span>Selected: {selectedStyle} Aesthetic</span>
              </div>

              <h3 className="text-2xl font-black text-white tracking-tight">
                {selectedStyle === 'Minimal' && 'Ultra-Clean Essentialist'}
                {selectedStyle === 'Professional' && 'Executive Enterprise'}
                {selectedStyle === 'Bold' && 'High-Voltage Neo-Brutalist'}
                {selectedStyle === 'Dark' && 'Midnight Neon Tech'}
                {selectedStyle === 'Creative' && 'Vibrant Creator Studio'}
              </h3>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                {selectedStyle === 'Minimal' && 'Stripped down to purest essentials with high readability, subtle hairline borders, and calm contrast.'}
                {selectedStyle === 'Professional' && 'Refined corporate navy tones, structured authority, and crisp verification tags tailored for client meetings.'}
                {selectedStyle === 'Bold' && 'Loud high-contrast cyber yellow and jet black, heavy offset shadows, and unmistakable tactile energy.'}
                {selectedStyle === 'Dark' && 'Sleek dark mode with electric cyan accents, obsidian panels, and ultra-crisp developer styling.'}
                {selectedStyle === 'Creative' && 'Rich gradient accents, vibrant social badges, and lively design aesthetics made for portfolio showreels.'}
              </p>

              <div className="pt-2 space-y-2 text-xs font-mono font-bold text-gray-300">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 stroke-[3]" />
                  <span>Instant camera QR scannable</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 stroke-[3]" />
                  <span>Two-way contact exchange included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 stroke-[3]" />
                  <span>Real-time persistence in localStorage</span>
                </div>
              </div>

              <div className="pt-3">
                <Button 
                  onClick={() => openAuth('signup')}
                  variant="primary" 
                  size="sm" 
                  className="font-black uppercase text-xs tracking-wider bg-[#2563EB] border-2 border-black shadow-[3px_3px_0px_#000]"
                >
                  Use This Style Now →
                </Button>
              </div>
            </div>

            {/* Right Interactive Mockup Column */}
            <div className="md:col-span-7 flex justify-center">
              <div className={`w-full max-w-[340px] rounded-2xl border-3 border-black transition-all duration-300 overflow-hidden ${
                selectedStyle === 'Minimal' ? 'bg-[#FAFAF9] text-black shadow-[6px_6px_0px_#D4D4D8]' :
                selectedStyle === 'Professional' ? 'bg-[#0E172A] text-white shadow-[6px_6px_0px_#2563EB]' :
                selectedStyle === 'Bold' ? 'bg-[#F59E0B] text-black shadow-[8px_8px_0px_#000000]' :
                selectedStyle === 'Dark' ? 'bg-[#090D16] text-white shadow-[6px_6px_0px_#06B6D4] ring-1 ring-cyan-500/50' :
                'bg-gradient-to-b from-[#2E1065] to-[#0c0a1f] text-white shadow-[6px_6px_0px_#8B5CF6]'
              }`}>
                
                {/* Header Banner */}
                <div className={`p-5 border-b-2 border-black ${
                  selectedStyle === 'Minimal' ? 'bg-white' :
                  selectedStyle === 'Professional' ? 'bg-[#1E3A8A]' :
                  selectedStyle === 'Bold' ? 'bg-black text-yellow-400' :
                  selectedStyle === 'Dark' ? 'bg-[#10192E]' :
                  'bg-gradient-to-r from-purple-600 to-pink-600'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded border border-black ${
                        selectedStyle === 'Minimal' ? 'bg-gray-100 text-gray-800' :
                        selectedStyle === 'Bold' ? 'bg-yellow-400 text-black' :
                        'bg-black text-cyan-300'
                      }`}>
                        {selectedStyle.toUpperCase()} • SMARTCARD
                      </span>
                      <h4 className="text-xl font-black mt-1">Smriti Jha</h4>
                      <p className={`text-xs font-bold ${selectedStyle === 'Minimal' ? 'text-gray-600' : 'text-blue-200'}`}>
                        Full Stack Developer
                      </p>
                      <p className={`text-[11px] font-mono ${selectedStyle === 'Minimal' ? 'text-gray-500' : 'text-cyan-300'}`}>
                        smritijha.dev
                      </p>
                    </div>

                    <div className="w-14 h-14 rounded-xl border-2 border-black bg-blue-600 overflow-hidden shadow-[2px_2px_0px_#000] flex items-center justify-center font-black text-xl text-white shrink-0">
                      SJ
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className={`p-5 space-y-3 ${
                  selectedStyle === 'Minimal' ? 'bg-white text-gray-800' :
                  selectedStyle === 'Bold' ? 'bg-yellow-50 text-black' :
                  'bg-[#0a0f1c] text-gray-200'
                }`}>
                  <p className={`text-xs font-medium p-2.5 rounded-lg border-2 border-black ${
                    selectedStyle === 'Minimal' ? 'bg-gray-50' :
                    selectedStyle === 'Bold' ? 'bg-white' :
                    'bg-[#121c33]'
                  }`}>
                    &ldquo;Building modern web experiences. High performance, zero NFC hardware.&rdquo;
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <div className={`p-2 rounded border-2 border-black text-center truncate ${
                      selectedStyle === 'Minimal' ? 'bg-gray-100 text-black' : 'bg-[#17223b] text-white'
                    }`}>
                      ✉️ Email Contact
                    </div>
                    <div className={`p-2 rounded border-2 border-black text-center truncate ${
                      selectedStyle === 'Minimal' ? 'bg-gray-100 text-black' : 'bg-[#17223b] text-white'
                    }`}>
                      💼 LinkedIn
                    </div>
                  </div>

                  <div className="pt-2 border-t-2 border-black flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono font-bold uppercase">Camera Scan</div>
                      <div className="text-[9px] text-gray-400">Zero apps needed</div>
                    </div>
                    <div className="bg-white p-1 rounded border-2 border-black shadow-[2px_2px_0px_#000]">
                      <QrCode size={34} className="text-black" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 16. ANALYTICS SHOWCASE (SECTION 16) */}
      <section id="analytics" className="py-24 border-b-2 border-black bg-[#090D16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-xs uppercase font-extrabold text-emerald-400 px-3 py-1 bg-black border-2 border-black rounded shadow-[2px_2px_0px_#10B981] inline-block rotate-1">
              REAL-TIME TELEMETRY
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Understand how the world interacts with your card.
            </h2>
            <p className="text-gray-300 text-sm sm:text-base font-medium">
              Every camera QR scan, WhatsApp share, and contact download tracked in real time.
            </p>
          </div>

          {/* SaaS Analytics Interface Frame */}
          <div className="max-w-5xl mx-auto bg-[#0c1322] rounded-2xl border-3 border-black shadow-[8px_8px_0px_#000] p-6 sm:p-8 space-y-8">
            
            {/* Top Stat Counters (Exact prompt metrics: 1284 views, 438 link clicks, 126 shares, 84 contacts) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-5 bg-[#121c33] rounded-xl border-2 border-black shadow-[4px_4px_0px_#2563EB]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-gray-400 uppercase">Profile Views</span>
                  <Eye size={16} className="text-blue-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white">1,284</div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold mt-1 block">↑ +24.8% this week</span>
              </div>

              <div className="p-5 bg-[#121c33] rounded-xl border-2 border-black shadow-[4px_4px_0px_#F59E0B]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-gray-400 uppercase">Link Clicks</span>
                  <Link2 size={16} className="text-yellow-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white">438</div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold mt-1 block">↑ Portfolio &amp; LinkedIn</span>
              </div>

              <div className="p-5 bg-[#121c33] rounded-xl border-2 border-black shadow-[4px_4px_0px_#06B6D4]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-gray-400 uppercase">Shares</span>
                  <Share2 size={16} className="text-cyan-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white">126</div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold mt-1 block">↑ WhatsApp &amp; vCard</span>
              </div>

              <div className="p-5 bg-[#121c33] rounded-xl border-2 border-black shadow-[4px_4px_0px_#10B981]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-gray-400 uppercase">Contacts</span>
                  <Users size={16} className="text-emerald-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white">84</div>
                <span className="text-[11px] font-mono text-yellow-400 font-bold mt-1 block">Two-way lead forms</span>
              </div>

            </div>

            {/* Visual SaaS Bar Chart & Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Engagement Trend Chart */}
              <div className="lg:col-span-8 bg-[#090D16] p-5 rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div>
                    <h4 className="text-sm font-black text-white">Weekly Profile Traffic &amp; Scans</h4>
                    <span className="text-[11px] font-mono text-gray-400">Total Views over the last 7 days</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-black px-2 py-0.5 rounded border border-black">
                    Live Stream
                  </span>
                </div>

                {/* Neo-Brutalist CSS Bar Chart */}
                <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
                  {[
                    { day: 'Mon', views: 140, pct: 45 },
                    { day: 'Tue', views: 185, pct: 60 },
                    { day: 'Wed', views: 240, pct: 80 },
                    { day: 'Thu', views: 210, pct: 70 },
                    { day: 'Fri', views: 290, pct: 95 },
                    { day: 'Sat', views: 120, pct: 40 },
                    { day: 'Sun', views: 199, pct: 65 },
                  ].map((bar) => (
                    <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[10px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                        {bar.views}
                      </span>
                      <div className="w-full bg-black/60 rounded-t h-32 flex items-end p-0.5">
                        <div 
                          className="w-full bg-[#2563EB] group-hover:bg-cyan-400 transition-all rounded-t border-t-2 border-x-2 border-black shadow-[1px_1px_0px_#000]"
                          style={{ height: `${bar.pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-gray-400">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Channels Breakdown */}
              <div className="lg:col-span-4 bg-[#090D16] p-5 rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] space-y-4">
                <h4 className="text-sm font-black text-white border-b border-gray-800 pb-2">
                  Acquisition Channel
                </h4>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-gray-300 mb-1">
                      <span>Camera QR Scans</span>
                      <span className="text-cyan-400">58%</span>
                    </div>
                    <div className="w-full h-2.5 bg-black rounded-full overflow-hidden border border-black">
                      <div className="h-full bg-cyan-400 w-[58%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-gray-300 mb-1">
                      <span>WhatsApp Direct</span>
                      <span className="text-emerald-400">24%</span>
                    </div>
                    <div className="w-full h-2.5 bg-black rounded-full overflow-hidden border border-black">
                      <div className="h-full bg-emerald-400 w-[24%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-gray-300 mb-1">
                      <span>LinkedIn Profile Link</span>
                      <span className="text-blue-400">18%</span>
                    </div>
                    <div className="w-full h-2.5 bg-black rounded-full overflow-hidden border border-black">
                      <div className="h-full bg-blue-500 w-[18%]"></div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[10px] font-mono text-gray-400 text-center">
                  Zero hardware dependencies • 100% digital
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 17. SOCIAL PROOF (SECTION 17: BUILT FOR PEOPLE WHO WANT TO STAND OUT) */}
      <section id="testimonials" className="py-24 border-b-2 border-black bg-[#0d1424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-xs uppercase font-extrabold text-yellow-400 px-3 py-1 bg-black border-2 border-black rounded shadow-[2px_2px_0px_#000] inline-block rotate-1">
              VERIFIED COMMUNITY
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Built for people who want to stand out.
            </h2>
            <p className="text-gray-300 text-sm sm:text-base font-medium">
              Join founders, developers, designers, and consultants replacing paper cards with one smart link.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Testimonial 1 */}
            <div className="bg-[#121c33] p-7 rounded-xl border-3 border-black shadow-[5px_5px_0px_#2563EB] space-y-4 -rotate-1 hover:rotate-0 transition-transform flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} className="fill-yellow-400" />
                    ))}
                  </div>
                  <span className="font-mono text-[9px] font-bold text-gray-400 bg-black px-2 py-0.5 rounded border border-white/10 uppercase">
                    DEMO TESTIMONIAL
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed">
                  &ldquo;I used to order 500 paper cards before every tech summit. Half got thrown away and my title changed twice. SmartCard replaced everything with one clean link and instant camera QR.&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t-2 border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-black bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                  MK
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Michael Kline</h4>
                  <p className="text-[11px] text-gray-400 font-mono">Founder @ Apex Cloud</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-[#121c33] p-7 rounded-xl border-3 border-black shadow-[5px_5px_0px_#06B6D4] space-y-4 rotate-1 hover:rotate-0 transition-transform flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} className="fill-yellow-400" />
                    ))}
                  </div>
                  <span className="font-mono text-[9px] font-bold text-gray-400 bg-black px-2 py-0.5 rounded border border-white/10 uppercase">
                    DEMO TESTIMONIAL
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed">
                  &ldquo;The two-way contact exchange is genius. When investors scan my SmartCard, they enter their email and it lands straight in my contacts inbox. Captured 140 leads during our launch week.&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t-2 border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-black bg-cyan-500 flex items-center justify-center font-bold text-black text-sm">
                  SL
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Sarah Lin</h4>
                  <p className="text-[11px] text-gray-400 font-mono">VP Growth @ Horizon Ventures</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-[#121c33] p-7 rounded-xl border-3 border-black shadow-[5px_5px_0px_#10B981] space-y-4 -rotate-0.5 hover:rotate-0 transition-transform flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} className="fill-yellow-400" />
                    ))}
                  </div>
                  <span className="font-mono text-[9px] font-bold text-gray-400 bg-black px-2 py-0.5 rounded border border-white/10 uppercase">
                    DEMO TESTIMONIAL
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed">
                  &ldquo;We looked at plastic NFC cards, but team members kept losing them and NFC is useless over Zoom calls! SmartCard works everywhere — on phone screens, slide decks, and WhatsApp.&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t-2 border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-black bg-amber-500 flex items-center justify-center font-bold text-black text-sm">
                  KP
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Kiran Patel</h4>
                  <p className="text-[11px] text-gray-400 font-mono">Head of Product @ Studio Veloce</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 18. PRICING (SECTION 18: INR CURRENCY ₹) */}
      <section id="pricing" className="py-24 border-b-2 border-black bg-[#090D16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-xs uppercase font-extrabold text-cyan-400 px-3 py-1 bg-black border-2 border-black rounded shadow-[2px_2px_0px_#000] inline-block">
              TRANSPARENT PRICING
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Start Free. Upgrade As You Scale.
            </h2>
            <p className="text-gray-300 text-sm sm:text-base font-medium">
              Zero hardware fees, zero hidden lock-in, and unlimited scans across all tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            
            {/* Free Tier */}
            <div className="bg-[#121c33] p-7 rounded-2xl border-3 border-black shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="font-mono text-xs font-black uppercase text-gray-400">Free Starter</span>
                <h3 className="text-4xl font-black text-white">
                  ₹0 <span className="text-sm font-normal text-gray-400">/ forever</span>
                </h3>
                <p className="text-xs text-gray-300 font-medium">
                  Ideal for individuals and students getting started with a clean digital card.
                </p>

                <ul className="space-y-3 text-xs text-gray-200 font-medium pt-3 border-t-2 border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-cyan-400 stroke-[3]" /> 1 SmartCard
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-cyan-400 stroke-[3]" /> Basic customization
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-cyan-400 stroke-[3]" /> Public profile
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-cyan-400 stroke-[3]" /> QR sharing
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => openAuth('signup')}
                className="w-full h-12 bg-white hover:bg-gray-100 text-black uppercase font-mono font-black text-xs rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
              >
                Create Free Card →
              </button>
            </div>

            {/* Pro Tier (VISUALLY PROMINENT) */}
            <div className="bg-[#18294e] p-8 rounded-2xl border-4 border-black shadow-[10px_10px_0px_#2563EB] flex flex-col justify-between space-y-6 relative -translate-y-3 ring-2 ring-yellow-400">
              <div className="absolute -top-4 right-6 bg-yellow-400 text-black font-mono font-black text-xs uppercase px-3 py-1 rounded border-2 border-black shadow-[2px_2px_0px_#000] -rotate-1">
                ★ MOST POPULAR
              </div>

              <div className="space-y-4">
                <span className="font-mono text-xs font-black uppercase text-yellow-400">Pro Identity</span>
                <h3 className="text-4xl font-black text-white">
                  ₹199 <span className="text-sm font-normal text-gray-300">/ month</span>
                </h3>
                <p className="text-xs text-gray-200 font-medium">
                  For active founders, developers, creators, and sales professionals.
                </p>

                <ul className="space-y-3 text-xs text-gray-100 font-bold pt-3 border-t-2 border-slate-700">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-yellow-400 stroke-[3]" /> Advanced customization
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-yellow-400 stroke-[3]" /> Analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-yellow-400 stroke-[3]" /> Multiple cards
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-yellow-400 stroke-[3]" /> Custom themes
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-yellow-400 stroke-[3]" /> Advanced sharing
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => openAuth('signup')}
                className="w-full h-12 bg-yellow-400 hover:bg-yellow-300 text-black uppercase font-mono font-black text-xs rounded-xl border-3 border-black shadow-[4px_4px_0px_#000] cursor-pointer"
              >
                Start Pro Trial →
              </button>
            </div>

            {/* Business Tier */}
            <div className="bg-[#121c33] p-7 rounded-2xl border-3 border-black shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="font-mono text-xs font-black uppercase text-gray-400">Business / Teams</span>
                <h3 className="text-3xl font-black text-white">
                  Contact us
                </h3>
                <p className="text-xs text-gray-300 font-medium">
                  For companies requiring organization-wide digital cards and unified branding.
                </p>

                <ul className="space-y-3 text-xs text-gray-200 font-medium pt-3 border-t-2 border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-cyan-400 stroke-[3]" /> Team cards
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-cyan-400 stroke-[3]" /> Organization management
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-cyan-400 stroke-[3]" /> Advanced analytics
                  </li>
                </ul>
              </div>

              <a href="mailto:sales@smartcard.app?subject=Business%20Inquiry">
                <Button variant="outline" className="w-full uppercase font-black text-xs bg-slate-900 border-2 border-black text-white">
                  Contact Us →
                </Button>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 border-b-2 border-black bg-[#0d1424]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-14 space-y-3">
            <span className="font-mono text-xs uppercase font-extrabold text-yellow-400 px-3 py-1 bg-black border-2 border-black rounded shadow-[2px_2px_0px_#000] inline-block -rotate-1">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Does SmartCard require any NFC chip or physical hardware?",
                a: "No! SmartCard is 100% web and digital native. You do NOT need to buy, carry, or program any NFC chips. You share your card via instant camera QR codes, personalized web URLs, or messaging channels like WhatsApp."
              },
              {
                q: "Does the person scanning my card need to install an app?",
                a: "Never. The recipient simply points their normal iPhone or Android camera at your QR code, and your SmartCard profile opens instantly in their native mobile browser. With one tap, they can save your full vCard to their contacts."
              },
              {
                q: "How does the two-way lead capture feature work?",
                a: "When someone views your SmartCard, they see a prominent 'Exchange Contact' button. They can submit their name, email, phone number, and a note which directly appears in your SmartCard inbox."
              },
              {
                q: "Can I update my details after sharing my card?",
                a: "Yes! Any update you make in your SmartCard dashboard is instantly live. If someone scans your QR code or clicks your link tomorrow, they will always see your most up-to-date information."
              }
            ].map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="bg-[#121c33] rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-black text-sm sm:text-base text-white hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-gray-300 font-medium leading-relaxed border-t border-gray-800 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 19. FINAL CTA (SECTION 19) */}
      <section className="py-24 bg-[#090D16] border-b-2 border-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#2563EB] rounded-2xl border-4 border-black p-8 sm:p-14 shadow-[12px_12px_0px_#000000] text-center space-y-6 relative overflow-hidden">
            
            <div className="inline-block bg-black text-yellow-400 font-mono font-black text-xs uppercase px-3.5 py-1 rounded border-2 border-black shadow-[2px_2px_0px_#000] rotate-1">
              ⚡ ZERO NFC HARDWARE • 100% DIGITAL
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] max-w-3xl mx-auto">
              Stop handing out boring business cards.
            </h2>

            <p className="text-blue-100 text-lg sm:text-xl font-medium max-w-xl mx-auto">
              Create your digital identity today.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => openAuth('signup')}
                className="w-full sm:w-auto h-14 px-9 bg-white hover:bg-gray-100 text-black font-mono font-black text-base uppercase tracking-wider rounded-xl border-3 border-black shadow-[5px_5px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>Create My SmartCard</span>
                <span className="font-mono text-xl font-bold">→</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 20. FOOTER (SECTION 20: WITH THEME TOGGLE) */}
      <footer className="py-14 bg-[#090D16] text-gray-400 text-xs border-t-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b-2 border-black pb-10">
            
            {/* Logo and Tagline */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#2563EB] border-2 border-black flex items-center justify-center font-black text-white shadow-[2px_2px_0px_#000]">
                  <CreditCard size={18} />
                </div>
                <span className="font-black text-2xl text-white tracking-tight">SmartCard</span>
              </div>
              <p className="text-sm font-bold text-gray-200">
                Your professional identity, in one link.
              </p>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                Create, customize, and share your digital business card. Zero NFC hardware, camera-scannable QR, real-time analytics.
              </p>
              <div className="pt-2">
                <ThemeToggle />
              </div>
            </div>

            {/* Links: Product, Features, Pricing, Demo, About, Contact, Privacy, Terms */}
            <div className="md:col-span-7 flex flex-wrap gap-8 sm:gap-14 md:justify-end">
              <div className="space-y-2">
                <span className="font-mono text-xs font-black uppercase text-white tracking-wider">Product</span>
                <ul className="space-y-1.5 text-xs font-mono font-bold">
                  <li><a href="#home" className="hover:text-cyan-400 transition-colors">Product</a></li>
                  <li><a href="#features" className="hover:text-cyan-400 transition-colors">Features</a></li>
                  <li><a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
                  <li><Link href="/smriti" className="hover:text-cyan-400 transition-colors text-yellow-400">Demo Card ↗</Link></li>
                </ul>
              </div>

              <div className="space-y-2">
                <span className="font-mono text-xs font-black uppercase text-white tracking-wider">Company</span>
                <ul className="space-y-1.5 text-xs font-mono font-bold">
                  <li><a href="#how-it-works" className="hover:text-cyan-400 transition-colors">About</a></li>
                  <li><a href="mailto:hello@smartcard.app" className="hover:text-cyan-400 transition-colors">Contact</a></li>
                </ul>
              </div>

              <div className="space-y-2">
                <span className="font-mono text-xs font-black uppercase text-white tracking-wider">Legal</span>
                <ul className="space-y-1.5 text-xs font-mono font-bold">
                  <li><a href="#privacy" className="hover:text-cyan-400 transition-colors">Privacy</a></li>
                  <li><a href="#terms" className="hover:text-cyan-400 transition-colors">Terms</a></li>
                </ul>
              </div>

              {/* Social icons: GitHub, LinkedIn, Instagram, X */}
              <div className="space-y-2">
                <span className="font-mono text-xs font-black uppercase text-white tracking-wider">Social</span>
                <div className="flex items-center gap-2 pt-1">
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#121c33] hover:bg-black text-gray-300 hover:text-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                    title="GitHub"
                  >
                    <GitHubIcon className="w-4 h-4 fill-current" />
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#121c33] hover:bg-[#0077b5] text-gray-300 hover:text-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                    title="LinkedIn"
                  >
                    <LinkedInIcon className="w-4 h-4 fill-current" />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#121c33] hover:bg-gradient-to-tr hover:from-amber-500 hover:to-rose-500 text-gray-300 hover:text-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                    title="Instagram"
                  >
                    <InstagramIcon className="w-4 h-4 fill-current" />
                  </a>
                  <a 
                    href="https://x.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#121c33] hover:bg-black text-gray-300 hover:text-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                    title="X"
                  >
                    <TwitterIcon className="w-4 h-4 fill-current" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left font-mono text-[11px]">
            <p>© {new Date().getFullYear()} SmartCard Platform. Zero NFC Hardware • 100% Digital Identity.</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-gray-300 font-bold">All Platform Services Operational</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 10. AUTHENTICATION MODAL */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />

    </div>
  );
}
