'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { 
  Mail, Phone, Globe, Briefcase, MessageCircle, Camera, 
  Bookmark, Share2, QrCode, Eye, User, Check, Link as LinkIcon,
  Download, Calendar, Sparkles, Send, ArrowLeft, ExternalLink,
  ShieldCheck, Star
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
        bio: 'Building modern web experiences.',
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
          // Track view
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
      <div className="min-h-screen bg-[#090D16] flex flex-col justify-center items-center text-white space-y-4">
        <div className="w-10 h-10 border-4 border-black border-t-[#2563EB] rounded-full animate-spin"></div>
        <p className="font-mono text-xs uppercase tracking-wider font-bold text-gray-400">Loading digital card profile...</p>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-[#090D16] flex flex-col justify-center items-center text-white p-6 text-center">
        <div className="bg-[#0e1628] border-2 border-black p-8 rounded-xl shadow-[5px_5px_0px_#000] max-w-sm space-y-4">
          <h2 className="text-xl font-black text-white">Card Not Found</h2>
          <p className="text-xs text-gray-400 font-mono">This digital card profile does not exist or has expired.</p>
          <Link href="/">
            <Button variant="primary" size="sm" className="font-bold">
              Return to SmartCard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const themeColor = card.themeColor || '#2563EB';

  return (
    <div className="min-h-screen bg-[#090D16] text-gray-100 font-sans flex flex-col justify-between items-center p-4 sm:p-6 bg-neo-dots relative selection:bg-[#2563EB] selection:text-white">
      
      {/* Top Banner Bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 z-10 gap-2">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-cyan-400 bg-black border-2 border-black px-2.5 py-1 rounded shadow-[2px_2px_0px_#000] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            SmartCard Digital ID
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle compact showLabel={false} />
          <span className="font-mono text-[10px] uppercase font-bold bg-[#121c33] border-2 border-black px-2.5 py-1 rounded text-gray-300 shadow-[2px_2px_0px_#000]">
            Zero NFC
          </span>
        </div>
      </div>

      {/* Main Neo-Brutalist Digital Business Card */}
      <div className="w-full max-w-md bg-[#0e1628] rounded-2xl border-3 border-black shadow-[8px_8px_0px_#000000] overflow-hidden relative z-10 my-auto">
        
        {/* Banner with Accent Background */}
        <div 
          className="p-6 border-b-3 border-black text-white relative transition-colors"
          style={{ backgroundColor: themeColor }}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1 max-w-[68%]">
              <span className="font-mono text-[10px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                {card.employeeCode || 'SMART-001'}
              </span>
              <h1 className="text-2xl font-black tracking-tight text-white mt-1 leading-tight">
                {card.name}
              </h1>
              <p className="text-xs font-bold text-white/95">
                {card.role}
              </p>
              <p className="text-[11px] font-mono text-white/85">
                {card.company}
              </p>
            </div>

            {/* Avatar Frame */}
            <div className="w-20 h-20 rounded-xl border-2 border-black bg-white overflow-hidden shadow-[3px_3px_0px_#000] shrink-0 flex items-center justify-center text-black font-black text-2xl uppercase">
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
        <div className="flex border-b-2 border-black bg-[#121c33] text-xs font-mono font-bold uppercase tracking-wider justify-around py-1">
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`py-2 px-4 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'contact' 
                ? 'border-cyan-400 text-white' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Contact
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('portfolio')}
            className={`py-2 px-4 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'portfolio' 
                ? 'border-cyan-400 text-white' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Portfolio &amp; Bio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('more')}
            className={`py-2 px-4 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'more' 
                ? 'border-cyan-400 text-white' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            More
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-5">
          
          {/* TAB 1: CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              
              {/* Bio Pill */}
              {card.bio && (
                <p className="text-xs text-gray-200 leading-relaxed bg-[#131d33] p-3 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] font-medium">
                  &quot;{card.bio}&quot;
                </p>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                {card.phone && (
                  <a 
                    href={`tel:${card.phone}`}
                    className="flex items-center gap-2.5 p-3 bg-[#17223b] hover:bg-[#1f2d4e] rounded-lg border-2 border-black text-gray-200 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-transform"
                  >
                    <Phone size={15} className="text-cyan-400 shrink-0" />
                    <span className="truncate">Call Phone</span>
                  </a>
                )}
                {card.email && (
                  <a 
                    href={`mailto:${card.email}`}
                    className="flex items-center gap-2.5 p-3 bg-[#17223b] hover:bg-[#1f2d4e] rounded-lg border-2 border-black text-gray-200 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-transform"
                  >
                    <Mail size={15} className="text-blue-400 shrink-0" />
                    <span className="truncate">Send Email</span>
                  </a>
                )}
                {card.website && (
                  <a 
                    href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2.5 p-3 bg-[#17223b] hover:bg-[#1f2d4e] rounded-lg border-2 border-black text-gray-200 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-transform col-span-2"
                  >
                    <Globe size={15} className="text-yellow-400 shrink-0" />
                    <span className="truncate">{card.website.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink size={12} className="ml-auto text-gray-400" />
                  </a>
                )}
              </div>

              {/* Primary Dual Actions: Save Contact & Exchange Info */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadVCard}
                  className="w-full h-12 bg-white hover:bg-gray-100 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download size={16} />
                  <span>Save Contact to Phone (.vcf)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLeadForm(true)}
                  className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={16} className="text-yellow-400" />
                  <span>Exchange Contact / Connect</span>
                </button>
              </div>

              {/* QR Code & Share Options */}
              <div className="pt-4 border-t-2 border-black flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    Live Camera QR
                  </span>
                  <p className="text-xs font-bold text-white">
                    Scan to view on any phone
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleShareWhatsAppOnly}
                      className="text-[11px] font-mono font-bold text-emerald-400 hover:underline cursor-pointer"
                    >
                      WhatsApp
                    </button>
                    <span className="text-gray-600">•</span>
                    <button
                      onClick={handleCopyLink}
                      className="text-[11px] font-mono font-bold text-gray-300 hover:underline cursor-pointer"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>

                <div className="bg-white p-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]">
                  <QrCode size={52} className="text-black" />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PORTFOLIO & BIO */}
          {activeTab === 'portfolio' && (
            <div className="space-y-4">
              {card.bio && (
                <div className="bg-[#131d33] p-4 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-cyan-400">About</span>
                  <p className="text-xs text-gray-200 leading-relaxed font-medium">{card.bio}</p>
                </div>
              )}

              {/* Quick links */}
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                {card.calendarUrl && (
                  <a 
                    href={card.calendarUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 bg-[#131d33] border-2 border-black rounded-lg text-cyan-400 flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000]"
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
                    className="p-3 bg-[#131d33] border-2 border-black rounded-lg text-blue-400 flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000]"
                  >
                    <Download size={14} />
                    <span>Download CV</span>
                  </a>
                )}
              </div>

              {/* Projects List */}
              {card.projects && card.projects.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-gray-400">Featured Work</span>
                  {card.projects.map((proj: any, idx: number) => (
                    <div key={idx} className="bg-[#131d33] p-3 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-white">{proj.title}</h4>
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-white">
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-300 font-medium leading-relaxed">{proj.description}</p>
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
                  <span className="text-[10px] font-mono font-bold uppercase text-yellow-400">Reviews &amp; Endorsements</span>
                  {card.testimonials.map((t: any, idx: number) => (
                    <div key={idx} className="bg-[#131d33] p-4 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] space-y-2">
                      <div className="flex items-center gap-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} className="fill-yellow-400" />
                        ))}
                      </div>
                      <p className="text-xs text-gray-200 italic font-medium leading-relaxed">&ldquo;{t.quote || t.text}&rdquo;</p>
                      <p className="text-[11px] font-mono font-bold text-cyan-400">— {t.author || t.reviewer} <span className="text-gray-400">{t.role ? `(${t.role})` : ''}</span></p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-gray-400 font-mono">
                  No testimonials or speaking events listed.
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Two-Way Lead Capture Modal */}
      {showLeadForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e1628] border-3 border-black rounded-xl p-6 sm:p-7 shadow-[8px_8px_0px_#000] relative space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white tracking-tight">Exchange Contact</h3>
                <button 
                  onClick={() => setShowLeadForm(false)}
                  className="p-1 hover:bg-slate-800 rounded font-bold text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-1">
                Share your details with {card.name}. They will receive your info in their SmartCard inbox.
              </p>
            </div>

            <form onSubmit={submitLead} className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-gray-300">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Lee"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full h-10 bg-[#090D16] border-2 border-black rounded-lg px-3 text-xs font-bold text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-gray-300">Your Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="jordan@company.com"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  className="w-full h-10 bg-[#090D16] border-2 border-black rounded-lg px-3 text-xs font-bold text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold uppercase text-gray-300">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 555 0192"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full h-10 bg-[#090D16] border-2 border-black rounded-lg px-3 text-xs font-bold text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold uppercase text-gray-300">Company</label>
                  <input
                    type="text"
                    placeholder="Acme Inc."
                    value={leadCompany}
                    onChange={(e) => setLeadCompany(e.target.value)}
                    className="w-full h-10 bg-[#090D16] border-2 border-black rounded-lg px-3 text-xs font-bold text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-gray-300">Quick Note</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Great meeting you at the conference! Let's follow up next week."
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  className="w-full p-2.5 bg-[#090D16] border-2 border-black rounded-lg text-xs font-medium text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLeadForm(false)}
                  className="flex-1 h-10 rounded-lg bg-slate-900 border-2 border-black text-gray-300 font-bold hover:bg-slate-800 text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingLead}
                  className="flex-1 h-10 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold border-2 border-black shadow-[2px_2px_0px_#000] text-xs uppercase flex items-center justify-center gap-1.5"
                >
                  <Send size={13} />
                  <span>{submittingLead ? 'Sending...' : 'Send Info'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-cyan-400 text-black border-2 border-black px-5 py-2.5 rounded-lg text-xs font-mono font-extrabold uppercase shadow-[4px_4px_0px_#000] flex items-center gap-2 animate-bounce">
          <Check size={16} className="stroke-[3]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Footer Branding */}
      <div className="mt-6 text-center text-[11px] font-mono text-gray-500 z-10">
        Powered by <Link href="/" className="text-gray-300 font-bold hover:underline">SmartCard</Link> • Zero-NFC Digital Business Cards
      </div>

    </div>
  );
}
