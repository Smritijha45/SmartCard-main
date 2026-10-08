'use client';

import React, { useState } from 'react';
import { 
  X, Copy, Check, Share2, Mail, Globe, MessageCircle, ExternalLink, QrCode as QrIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const LinkedInIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.75a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/>
  </svg>
);

const XIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export interface ShareCardProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  name?: string;
  title?: string;
  company?: string;
  profileImage?: string;
  onOpenQR?: () => void;
  onToast?: (message: string) => void;
}

export function ShareCard({
  isOpen,
  onClose,
  username,
  name = 'SmartCard User',
  title = '',
  company = '',
  profileImage = '',
  onOpenQR,
  onToast,
}: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://smartcard.app';
  const cleanUsername = (username || 'user').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  const publicUrl = `${originUrl}/${cleanUsername}`;

  const notify = (msg: string) => {
    if (onToast) {
      onToast(msg);
    }
  };

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(publicUrl);
      }
      setCopied(true);
      notify('Link copied!');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Copy link failed:', err);
    }
  };

  const handleWhatsAppShare = () => {
    const message = `Check out my SmartCard:\n\n${publicUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleEmailShare = () => {
    const subject = `My SmartCard`;
    const body = `Hi,\n\nHere's my digital business card:\n\n${publicUrl}\n\nBest,\n${name}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleLinkedInShare = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    const text = `Connect with ${name} on SmartCard:`;
    const tweetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(text)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${name} — SmartCard`,
          text: `Check out my digital business card: ${name}${title ? ` | ${title}` : ''}`,
          url: publicUrl,
        });
        notify('SmartCard shared successfully!');
        onClose();
      } catch (err) {
        // Fallback to copying link if share dialog was dismissed or errored
      }
    } else {
      handleCopyLink();
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && Boolean(navigator.share);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-subtle-fade">
      <div className="w-full max-w-md bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Share SmartCard
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Share your digital business card with anyone
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Identity Summary Card */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 ring-2 ring-blue-500/20">
            {profileImage ? (
              <img src={profileImage} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span>{name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
              {name}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {title || 'Digital Card'} {company ? `• ${company}` : ''}
            </p>
            <p className="text-[10px] font-mono text-blue-600 dark:text-blue-400 truncate mt-0.5">
              smartcard.app/{cleanUsername}
            </p>
          </div>
        </div>

        {/* Share Channels Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="h-11 px-3 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 rounded-xl font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <MessageCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span>WhatsApp</span>
          </button>

          {/* Email / Gmail */}
          <button
            type="button"
            onClick={handleEmailShare}
            className="h-11 px-3 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800/80 text-blue-800 dark:text-blue-300 rounded-xl font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Mail size={16} className="text-blue-600 dark:text-blue-400" />
            <span>Email</span>
          </button>

          {/* LinkedIn */}
          <button
            type="button"
            onClick={handleLinkedInShare}
            className="h-11 px-3 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <LinkedInIcon className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <span>LinkedIn</span>
          </button>

          {/* X / Twitter */}
          <button
            type="button"
            onClick={handleTwitterShare}
            className="h-11 px-3 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <XIcon className="w-3.5 h-3.5 text-slate-900 dark:text-slate-100" />
            <span>X (Twitter)</span>
          </button>
        </div>

        {/* Copy Link Bar */}
        <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-2">
          <div className="truncate flex-1 pl-1">
            <span className="text-[10px] uppercase font-medium tracking-wider text-slate-400 block">Public Link</span>
            <span className="text-xs font-mono text-slate-800 dark:text-slate-200 truncate block">{publicUrl}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="h-8 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            {copied ? <Check size={13} className="text-emerald-400 dark:text-emerald-600" /> : <Copy size={13} />}
            <span>{copied ? 'Link copied!' : 'Copy Link'}</span>
          </button>
        </div>

        {/* Additional Actions: QR Expander & Web Share API */}
        <div className="flex items-center gap-2 pt-1">
          {onOpenQR && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenQR();
              }}
              className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <QrIcon size={14} />
              <span>Show QR Code</span>
            </button>
          )}

          {hasNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Share2 size={14} />
              <span>More Options...</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default ShareCard;
