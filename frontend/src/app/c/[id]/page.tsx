'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { 
  Mail, Phone, Globe, Download, Sparkles, Send, ArrowLeft, 
  ExternalLink, Calendar, Star, Check, QrCode, X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function PublicCardView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'contact' | 'portfolio' | 'more'>('contact');
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadNotes, setLeadNotes] = useState('');
  const [submittingLead, setSubmittingLead] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (resolvedParams.id === 'smriti' || resolvedParams.id === 'demo') {
      setCard({
        name: 'Smriti Jha',
        role: 'Full Stack Developer',
        company: 'SmartCard Platform',
        bio: 'Building modern web experiences. 100% digital, zero NFC hardware needed.',
        profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        email: 'smriti@smartcard.app',
        phone: '+1 (415) 555-0192',
        website: 'https://smritijha.dev',
        themeColor: '#2563EB',
        employeeCode: 'SMART-002',
      });
      setLoading(false);
      return;
    }

    fetch(`/api/cards/${resolvedParams.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Card not found' || !data.name) {
          if (typeof window !== 'undefined') {
            const localCard = localStorage.getItem('smartcard_current_card');
            if (localCard) {
              try {
                const parsed = JSON.parse(localCard);
                setCard(parsed);
                setLoading(false);
                return;
              } catch (e) {
                console.error(e);
              }
            }
          }
          setCard(false);
        } else {
          setCard(data);
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              cardId: resolvedParams.id, 
              type: 'view',
            })
          }).catch(() => {});
        }
        setLoading(false);
      })
      .catch(() => {
        if (typeof window !== 'undefined') {
          const localCard = localStorage.getItem('smartcard_current_card');
          if (localCard) {
            try {
              const parsed = JSON.parse(localCard);
              setCard(parsed);
              setLoading(false);
              return;
            } catch (e) {
              console.error(e);
            }
          }
        }
        setLoading(false);
      });
  }, [resolvedParams.id]);

  const handleShareWhatsAppOnly = () => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId: resolvedParams.id, type: 'share' })
    }).catch(() => {});

    const cardUrl = window.location.href;
    const message = `Hey! Here’s my digital business card 👋\nView my card: ${cardUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Card link copied to clipboard!');
  };

  const handleDownloadVCard = () => {
    if (!card) return;
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${card.name}`,
      `ORG:${card.company || ''}`,
      `TITLE:${card.role || ''}`,
      `TEL;TYPE=WORK,VOICE:${card.phone || ''}`,
      `EMAIL;TYPE=PREF,INTERNET:${card.email || ''}`,
      `URL:${card.website || window.location.href}`,
      `NOTE:${card.bio || ''}`,
      'END:VCARD'
    ].join('\n');

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${card.name.replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Contact saved to Phone (.vcf)!');
  };

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingLead(true);

    try {
      const data = {
        cardId: resolvedParams.id,
        cardName: card?.name,
        name: leadName,
        email: leadEmail,
        phone: leadPhone,
        company: leadCompany,
        notes: leadNotes,
        score: 92
      };

      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      showToast('Contact details exchanged! The owner was notified.');
      setShowLeadForm(false);
      setLeadName('');
      setLeadEmail('');
      setLeadPhone('');
      setLeadCompany('');
      setLeadNotes('');
    } catch {
      alert('Failed to send contact info');
    } finally {
      setSubmittingLead(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#0B0F17] flex flex-col justify-center items-center text-slate-900 dark:text-slate-100 space-y-4">
        <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Loading digital card...</p>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#0B0F17] flex flex-col justify-center items-center text-slate-900 dark:text-slate-100 p-6 text-center">
        <div className="bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm max-w-sm space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Card Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">This digital card profile does not exist or has expired.</p>
          <Link href="/">
            <Button variant="primary" size="sm">
              Return to SmartCard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const themeColor = card.themeColor || '#2563EB';

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col justify-between items-center p-4 sm:p-6 relative selection:bg-blue-600 selection:text-white transition-colors">
      
      {/* Top Banner Bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 z-10 gap-2">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5 hover:border-slate-300 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            SmartCard
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle compact showLabel={false} />
          <span className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-full shadow-2xs">
            Zero NFC
          </span>
        </div>
      </div>

      {/* Main Minimalist Executive Digital Business Card */}
      <div className="w-full max-w-md bg-white dark:bg-[#131924] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-lg overflow-hidden relative z-10 my-auto transition-all">
        
        {/* Banner with Accent Background */}
        <div 
          className="p-6 text-white relative transition-colors duration-200"
          style={{ backgroundColor: themeColor }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 max-w-[68%]">
              <span className="text-[10px] font-medium bg-black/25 text-white/90 px-2 py-0.5 rounded backdrop-blur-xs">
                {card.employeeCode || 'SMART-001'}
              </span>
              <h1 className="text-2xl font-semibold tracking-tight text-white mt-1 leading-tight">
                {card.name}
              </h1>
              <p className="text-xs font-medium text-white/95">
                {card.role}
              </p>
              <p className="text-[11px] text-white/80">
                {card.company}
              </p>
            </div>

            {/* Avatar Frame */}
            <div className="w-20 h-20 rounded-full ring-2 ring-white/30 bg-white/10 overflow-hidden shadow-xs shrink-0 flex items-center justify-center text-white font-semibold text-2xl uppercase">
              {card.profileImage ? (
                <img 
                  src={card.profileImage} 
                  alt={card.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                card.name.charAt(0)
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Contact | Portfolio | Reviews) */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-xs font-medium justify-around py-1">
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`py-2 px-4 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'contact' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Contact
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('portfolio')}
            className={`py-2 px-4 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'portfolio' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Portfolio &amp; Bio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('more')}
            className={`py-2 px-4 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'more' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Reviews
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-5">
          
          {/* TAB 1: CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              
              {/* Bio Pill */}
              {card.bio && (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  &quot;{card.bio}&quot;
                </p>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 text-xs font-medium">
                {card.phone && (
                  <a 
                    href={`tel:${card.phone}`}
                    className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 transition-colors shadow-2xs"
                  >
                    <Phone size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="truncate">Call</span>
                  </a>
                )}
                {card.email && (
                  <a 
                    href={`mailto:${card.email}`}
                    className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 transition-colors shadow-2xs"
                  >
                    <Mail size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="truncate">Email</span>
                  </a>
                )}
                {card.website && (
                  <a 
                    href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 transition-colors shadow-2xs col-span-2"
                  >
                    <Globe size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="truncate">{card.website.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink size={12} className="ml-auto text-slate-400" />
                  </a>
                )}
              </div>

              {/* Primary Dual Actions: Save Contact & Exchange Info */}
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
                  onClick={() => setShowLeadForm(true)}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={15} />
                  <span>Exchange Contact / Connect</span>
                </button>
              </div>

              {/* QR Code & Share Options */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    Camera QR Code
                  </span>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    Scan to open on any device
                  </p>
                  <div className="flex gap-2 pt-1 text-xs">
                    <button
                      onClick={handleShareWhatsAppOnly}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer font-medium"
                    >
                      WhatsApp
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

                <div className="bg-white p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                  <QrCode size={48} className="text-slate-900" />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PORTFOLIO & BIO */}
          {activeTab === 'portfolio' && (
            <div className="space-y-4">
              {card.bio && (
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">About</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">{card.bio}</p>
                </div>
              )}

              {/* Quick links */}
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                {card.calendarUrl && (
                  <a 
                    href={card.calendarUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 bg-blue-50/70 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl text-blue-700 dark:text-blue-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Calendar size={14} />
                    <span>Book Meeting</span>
                  </a>
                )}
                {card.resumeUrl && (
                  <a 
                    href={card.resumeUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download size={14} />
                    <span>View Resume</span>
                  </a>
                )}
              </div>

              {/* Projects List */}
              {card.projects && card.projects.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Featured Work</span>
                  {card.projects.map((proj: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">{proj.title}</h4>
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MORE (TESTIMONIALS & REVIEWS) */}
          {activeTab === 'more' && (
            <div className="space-y-4">
              {card.testimonials && card.testimonials.length > 0 ? (
                <div className="space-y-3">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Recommendations</span>
                  {card.testimonials.map((t: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-2">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">&ldquo;{t.quote || t.text}&rdquo;</p>
                      <p className="text-[11px] font-medium text-slate-900 dark:text-slate-100">— {t.author || t.reviewer} <span className="text-slate-400">{t.role ? `(${t.role})` : ''}</span></p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-slate-400">
                  No testimonials or speaking events listed.
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Two-Way Lead Capture Modal */}
      {showLeadForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-subtle-fade">
          <div className="w-full max-w-md bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl relative space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Exchange Contact</h3>
                <button 
                  onClick={() => setShowLeadForm(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Share your details with {card.name}. They will receive your info directly in their SmartCard inbox.
              </p>
            </div>

            <form onSubmit={submitLead} className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Lee"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full h-10 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Your Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="jordan@company.com"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  className="w-full h-10 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 555 0192"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full h-10 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Company</label>
                  <input
                    type="text"
                    placeholder="Acme Inc."
                    value={leadCompany}
                    onChange={(e) => setLeadCompany(e.target.value)}
                    className="w-full h-10 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Quick Note</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Great meeting you! Looking forward to following up."
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowLeadForm(false)}
                  className="flex-1 h-9.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 text-xs transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submittingLead}
                  className="flex-1 h-9.5 text-xs font-medium"
                >
                  <Send size={13} />
                  <span>{submittingLead ? 'Sending...' : 'Send Info'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl text-xs font-medium shadow-lg flex items-center gap-2 animate-subtle-fade">
          <Check size={14} className="text-emerald-400 dark:text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      {/* Footer Branding */}
      <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500 z-10">
        Powered by <Link href="/" className="text-slate-600 dark:text-slate-400 font-medium hover:underline">SmartCard</Link> • Digital Identity Platform
      </div>

    </div>
  );
}
