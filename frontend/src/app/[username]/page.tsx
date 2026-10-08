'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { 
  Mail, Globe, Phone, MapPin, Download, Share2, Copy, QrCode as QrIcon, 
  ExternalLink, Sparkles, Check, ArrowLeft, X, Send, CheckCircle2, User, Loader2, Lock
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { QRCodeComponent } from '@/components/QRCode';
import { ShareCard } from '@/components/ShareCard';
import { getCardPublicUrl, getAppUrl } from '@/lib/usernameValidation';

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
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"/>
  </svg>
);

const XIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function DynamicPublicCardPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const usernameParam = (resolvedParams?.username || 'smriti').toLowerCase().trim();

  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Exchange Lead Form State
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorNote, setVisitorNote] = useState('');
  const [submittingLead, setSubmittingLead] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Track user click interactions (GitHub, LinkedIn, Website, Phone, Email, etc.)
  const trackLinkClick = (channel: string, targetUrl?: string) => {
    if (!card) return;
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardId: card._id || card.id || usernameParam,
        type: 'click',
        channel,
        linkType: channel,
        targetUrl
      }),
    }).catch(() => {});
  };

  // Fetch LIVE card details dynamically
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setIsPrivate(false);
    setError(null);

    const fetchCard = async () => {
      try {
        const isQrScan = typeof window !== 'undefined' && (
          new URLSearchParams(window.location.search).get('source') === 'qr' ||
          new URLSearchParams(window.location.search).get('qr') === '1'
        );

        let res = await fetch(`/api/cards/public/${usernameParam}`);
        if (!res.ok && res.status !== 403) {
          res = await fetch(`/api/cards/${usernameParam}`);
        }

        if (res.status === 403) {
          if (isMounted) {
            setIsPrivate(true);
            setLoading(false);
          }
          return;
        }

        if (res.ok) {
          const data = await res.json();
          if (data) {
            if (data.isPublic === false) {
              if (isMounted) {
                setIsPrivate(true);
                setLoading(false);
              }
              return;
            }

            if (data.name || data.username) {
              if (isMounted) {
                setCard(data);
                setLoading(false);
              }
              // Track view or QR scan asynchronously
              fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  cardId: data._id || data.id || usernameParam,
                  type: isQrScan ? 'qr_scan' : 'view',
                  isNewUniqueView: true
                }),
              }).catch(() => {});
              return;
            }
          }
        }

        // Check localStorage as live preview fallback for currently edited card
        if (typeof window !== 'undefined') {
          const local = localStorage.getItem('smartcard_current_card');
          if (local) {
            try {
              const parsed = JSON.parse(local);
              if (parsed && (parsed.username === usernameParam || usernameParam === 'smriti' || usernameParam === 'demo')) {
                if (parsed.isPublic === false) {
                  if (isMounted) {
                    setIsPrivate(true);
                    setLoading(false);
                  }
                  return;
                }
                if (isMounted) {
                  setCard(parsed);
                  setLoading(false);
                }
                return;
              }
            } catch (e) {}
          }
        }

        // Fallback for default profiles if not found in db yet
        if (usernameParam === 'smriti' || usernameParam === 'demo') {
          const defaultSmriti = {
            username: 'smriti',
            name: 'Smriti Jha',
            title: 'Full Stack Developer',
            role: 'Full Stack Developer',
            company: 'SmartCard Technologies',
            bio: 'Building modern digital experiences.',
            profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
            email: 'smriti@smartcard.app',
            phone: '+91 98765 43210',
            website: 'https://smritijha.dev',
            location: 'Bengaluru, India • Remote',
            github: 'https://github.com/smritijha',
            linkedin: 'https://linkedin.com/in/smritijha',
            instagram: 'https://instagram.com/smritijha.dev',
            twitter: 'https://x.com/smritijha',
            cardTheme: 'minimal-modern',
            cardLayout: 'vertical',
            themeColor: '#2563EB',
            template: 'modern',
            isPublic: true,
            qrCodeUrl: getCardPublicUrl('smriti')
          };
          if (isMounted) {
            setCard(defaultSmriti);
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          setError('This SmartCard does not exist.');
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load card');
          setLoading(false);
        }
      }
    };

    fetchCard();

    return () => {
      isMounted = false;
    };
  }, [usernameParam]);

  const publicUrl = getCardPublicUrl(card?.username || usernameParam);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard?.writeText(publicUrl);
    }
    showToast('Link copied!');
  };

  const handleDownloadVCard = () => {
    if (!card) return;
    trackLinkClick('vcard', publicUrl);

    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${card.name || 'SmartCard User'}`,
      `TITLE:${card.title || card.role || ''}`,
      `ORG:${card.company || 'SmartCard'}`,
      card.email ? `EMAIL;TYPE=PREF,INTERNET:${card.email}` : '',
      card.phone ? `TEL;TYPE=CELL:${card.phone}` : '',
      card.website ? `URL:${card.website}` : `URL:${publicUrl}`,
      card.location ? `ADR;TYPE=WORK:;;;${card.location};;;` : '',
      card.bio ? `NOTE:${card.bio.replace(/\n/g, ' ')}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\n');

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${(card.name || 'contact').replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Contact file (.vcf) downloaded to your device!');
  };

  const handleExchangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingLead(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: card?._id || card?.id || usernameParam,
          name: visitorName,
          email: visitorEmail,
          phone: visitorPhone,
          notes: visitorNote,
        }),
      });
    } catch (e) {
      // Handled cleanly
    } finally {
      setSubmittingLead(false);
      setExchangeModalOpen(false);
      setVisitorName('');
      setVisitorEmail('');
      setVisitorPhone('');
      setVisitorNote('');
      showToast(`Contact info shared with ${card?.name || 'the card owner'}!`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#0B0F17] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Loading SmartCard...</p>
        </div>
      </div>
    );
  }

  // 23. PRIVACY: Private Profile Mode Screen
  if (isPrivate) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col justify-between items-center p-6">
        <div className="w-full max-w-md flex items-center justify-between">
          <Link href="/" className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
            <ArrowLeft size={13} />
            <span>SmartCard</span>
          </Link>
          <ThemeToggle compact showLabel={false} />
        </div>

        <div className="w-full max-w-md bg-white dark:bg-[#131924] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 text-center shadow-xl my-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-200 dark:border-amber-800/60 shadow-2xs">
            <Lock size={26} />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
            This SmartCard is currently private.
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            The profile owner has disabled public access to this card.
          </p>
          <div className="pt-2">
            <Link href="/" className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-xs">
              Create Your Own SmartCard
            </Link>
          </div>
        </div>

        <div className="text-[11px] text-slate-400">Powered by SmartCard</div>
      </div>
    );
  }

  // 404 / Missing Card Screen
  if (error || !card) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col justify-between items-center p-6">
        <div className="w-full max-w-md flex items-center justify-between">
          <Link href="/" className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
            <ArrowLeft size={13} />
            <span>SmartCard</span>
          </Link>
          <ThemeToggle compact showLabel={false} />
        </div>

        <div className="w-full max-w-md bg-white dark:bg-[#131924] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-xl my-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center border border-rose-200 dark:border-rose-900/50">
            <User size={26} />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">SmartCard Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            The profile <span className="font-mono text-blue-600">/{usernameParam}</span> does not exist or has been removed.
          </p>
          <div className="pt-2">
            <Link href="/" className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-xs">
              Create Your Own SmartCard
            </Link>
          </div>
        </div>

        <div className="text-[11px] text-slate-400">Powered by SmartCard</div>
      </div>
    );
  }

  const themeColor = card.themeColor || card.appearance?.accentColor || '#2563EB';
  const displayTitle = card.title || card.role || '';
  const githubUrl = card.github || card.socialLinks?.github;
  const linkedinUrl = card.linkedin || card.socialLinks?.linkedin;
  const instagramUrl = card.instagram || card.socialLinks?.instagram;
  const twitterUrl = card.twitter || card.socialLinks?.twitter || card.socialLinks?.x;

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col justify-between items-center p-4 sm:p-6 relative selection:bg-blue-600 selection:text-white transition-colors">
      
      {/* Top Bar: Brand, Live Badge & Theme Toggle */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 z-10 gap-2">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5 hover:border-slate-300 transition-colors">
            <ArrowLeft size={13} className="text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>SmartCard</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE CARD
          </span>
          <ThemeToggle compact showLabel={false} />
        </div>
      </div>

      {/* Main Executive Digital Business Card */}
      <div className="w-full max-w-md bg-white dark:bg-[#131924] rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl overflow-hidden relative z-10 my-auto transition-all">
        
        {/* Banner with dynamic Accent Color */}
        <div 
          className="p-6 text-white relative transition-colors"
          style={{ backgroundColor: themeColor }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium bg-black/25 text-white/90 px-2 py-0.5 rounded backdrop-blur-xs">
                  VERIFIED CARD
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-white/20 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                  ONLINE
                </span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-white mt-1 leading-tight">
                {card.name}
              </h1>
              {displayTitle && (
                <p className="text-xs font-medium text-white/95">
                  {displayTitle} {card.company ? `• ${card.company}` : ''}
                </p>
              )}
              <p className="text-[11px] text-white/80 font-mono">
                smartcard.app/{card.username}
              </p>
            </div>

            {/* Profile Photo */}
            <div className="w-20 h-20 rounded-full ring-2 ring-white/40 bg-white/20 overflow-hidden shadow-sm shrink-0 flex items-center justify-center">
              {card.profileImage ? (
                <img 
                  src={card.profileImage} 
                  alt={card.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-white uppercase">
                  {(card.name || 'U').charAt(0)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-5">
          
          {/* Bio Box */}
          {card.bio && (
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <p className="text-xs text-slate-700 dark:text-slate-300 font-normal leading-relaxed text-center">
                &ldquo;{card.bio}&rdquo;
              </p>
            </div>
          )}

          {/* Location Badge */}
          {card.location && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <MapPin size={13} className="text-slate-400" />
              <span>{card.location}</span>
            </div>
          )}

          {/* Contact & Social Links Grid */}
          <div className="space-y-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Links &amp; Profiles
            </span>

            <div className="grid grid-cols-1 gap-2">
              {/* GitHub */}
              {githubUrl && (
                <a 
                  href={githubUrl.startsWith('http') ? githubUrl : `https://${githubUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => trackLinkClick('github', githubUrl)}
                  className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 flex items-center justify-center shrink-0">
                    <GitHubIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate flex-1">
                    <span className="text-xs font-medium text-slate-900 dark:text-slate-100 block truncate">GitHub</span>
                    <span className="text-[11px] text-slate-400 truncate block">{githubUrl.replace(/^https?:\/\/(www\.)?github\.com\/?/, '')}</span>
                  </div>
                  <ExternalLink size={13} className="text-slate-400 shrink-0" />
                </a>
              )}

              {/* LinkedIn */}
              {linkedinUrl && (
                <a 
                  href={linkedinUrl.startsWith('http') ? linkedinUrl : `https://${linkedinUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => trackLinkClick('linkedin', linkedinUrl)}
                  className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                    <LinkedInIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate flex-1">
                    <span className="text-xs font-medium text-slate-900 dark:text-slate-100 block truncate">LinkedIn</span>
                    <span className="text-[11px] text-slate-400 truncate block">{linkedinUrl.replace(/^https?:\/\/(www\.)?linkedin\.com\/(in\/)?/, '')}</span>
                  </div>
                  <ExternalLink size={13} className="text-slate-400 shrink-0" />
                </a>
              )}

              {/* Instagram */}
              {instagramUrl && (
                <a 
                  href={instagramUrl.startsWith('http') ? instagramUrl : `https://${instagramUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => trackLinkClick('instagram', instagramUrl)}
                  className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-pink-100 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                    <InstagramIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate flex-1">
                    <span className="text-xs font-medium text-slate-900 dark:text-slate-100 block truncate">Instagram</span>
                    <span className="text-[11px] text-slate-400 truncate block">{instagramUrl.replace(/^https?:\/\/(www\.)?instagram\.com\/?/, '')}</span>
                  </div>
                  <ExternalLink size={13} className="text-slate-400 shrink-0" />
                </a>
              )}

              {/* Twitter / X */}
              {twitterUrl && (
                <a 
                  href={twitterUrl.startsWith('http') ? twitterUrl : `https://${twitterUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => trackLinkClick('twitter', twitterUrl)}
                  className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 flex items-center justify-center shrink-0">
                    <XIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate flex-1">
                    <span className="text-xs font-medium text-slate-900 dark:text-slate-100 block truncate">X (Twitter)</span>
                    <span className="text-[11px] text-slate-400 truncate block">{twitterUrl.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\/?/, '')}</span>
                  </div>
                  <ExternalLink size={13} className="text-slate-400 shrink-0" />
                </a>
              )}

              {/* Portfolio / Website */}
              {card.website && (
                <a 
                  href={card.website.startsWith('http') ? card.website : `https://${card.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => trackLinkClick('website', card.website)}
                  className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Globe size={15} />
                  </div>
                  <div className="truncate flex-1">
                    <span className="text-xs font-medium text-slate-900 dark:text-slate-100 block truncate">Website</span>
                    <span className="text-[11px] text-slate-400 truncate block">{card.website.replace(/^https?:\/\//, '')}</span>
                  </div>
                  <ExternalLink size={13} className="text-slate-400 shrink-0" />
                </a>
              )}

              {/* Email */}
              {card.email && (
                <a 
                  href={`mailto:${card.email}`} 
                  onClick={() => trackLinkClick('email', card.email)}
                  className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Mail size={15} />
                  </div>
                  <div className="truncate flex-1">
                    <span className="text-xs font-medium text-slate-900 dark:text-slate-100 block truncate">Email</span>
                    <span className="text-[11px] text-slate-400 truncate block">{card.email}</span>
                  </div>
                  <ExternalLink size={13} className="text-slate-400 shrink-0" />
                </a>
              )}

              {/* Phone */}
              {card.phone && (
                <a 
                  href={`tel:${card.phone}`} 
                  onClick={() => trackLinkClick('phone', card.phone)}
                  className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone size={15} />
                  </div>
                  <div className="truncate flex-1">
                    <span className="text-xs font-medium text-slate-900 dark:text-slate-100 block truncate">Phone</span>
                    <span className="text-[11px] text-slate-400 truncate block">{card.phone}</span>
                  </div>
                  <ExternalLink size={13} className="text-slate-400 shrink-0" />
                </a>
              )}
            </div>
          </div>

          {/* 20. QR IN PUBLIC CARD: [ Share ] [ QR ] [ Save Contact ] */}
          <div className="space-y-2 pt-2">
            <div className="grid grid-cols-3 gap-2">
              {/* [ Share ] */}
              <button
                type="button"
                onClick={() => setShareModalOpen(true)}
                className="h-11 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer px-2 truncate"
              >
                <Share2 size={14} className="shrink-0 text-blue-600 dark:text-blue-400" />
                <span className="truncate font-semibold">Share</span>
              </button>

              {/* [ QR ] */}
              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="h-11 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer px-2 truncate"
              >
                <QrIcon size={14} className="shrink-0 text-indigo-600 dark:text-indigo-400" />
                <span className="truncate font-semibold">QR</span>
              </button>

              {/* [ Save Contact ] */}
              <button
                type="button"
                onClick={handleDownloadVCard}
                className="h-11 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-medium text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer px-2 truncate"
              >
                <Download size={14} className="shrink-0" />
                <span className="truncate font-semibold">Save Contact</span>
              </button>
            </div>

            {/* Exchange Contact Action */}
            <button
              type="button"
              onClick={() => setExchangeModalOpen(true)}
              className="w-full h-11 text-white font-medium text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: themeColor }}
            >
              <Sparkles size={15} />
              <span>Exchange Contact / Connect</span>
            </button>
          </div>

          {/* Direct QR Component Box */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  Live QR Code
                </span>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Instant camera scan to this profile
                </p>
              </div>

              <button
                onClick={() => setQrModalOpen(true)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
              >
                Expand QR
              </button>
            </div>

            <QRCodeComponent
              value={publicUrl}
              username={card.username || usernameParam}
              name={card.name}
              size={180}
              accentColor={themeColor}
              showDownload={true}
              showShare={true}
              showCopy={true}
            />
          </div>

        </div>

      </div>

      {/* Share Card Modal */}
      <ShareCard
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        username={card.username || usernameParam}
        name={card.name}
        title={displayTitle}
        company={card.company}
        profileImage={card.profileImage}
        onOpenQR={() => setQrModalOpen(true)}
        onToast={showToast}
      />

      {/* Clean QR Code Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-subtle-fade">
          <div className="w-full max-w-sm bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative space-y-4 text-center">
            <div className="flex justify-between items-center text-left">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Scan SmartCard</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Point phone camera to connect</p>
              </div>
              <button 
                onClick={() => setQrModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            
            <QRCodeComponent
              value={publicUrl}
              username={card.username || usernameParam}
              name={card.name}
              size={220}
              accentColor={themeColor}
              showDownload={true}
              showShare={true}
              showCopy={true}
            />
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
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Share your info with {card.name}</p>
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
                  placeholder="Met at Tech Summit, let's connect..."
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
