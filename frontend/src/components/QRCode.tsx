'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCodeLib from 'qrcode';
import { Download, Share2, Copy, Check, QrCode as QrIcon, Smartphone } from 'lucide-react';

export interface QRCodeProps {
  /** The full public URL encoded into the QR code */
  value: string;
  /** Username for filename and header */
  username?: string;
  /** Name of the card owner for share dialog */
  name?: string;
  /** Size in pixels (default: 240) */
  size?: number;
  /** Optional theme accent color for borders or subtle highlights */
  accentColor?: string;
  /** Dark mode flag or auto-detect */
  isDark?: boolean;
  /** Show download button (default: true) */
  showDownload?: boolean;
  /** Show share button (default: true) */
  showShare?: boolean;
  /** Show copy URL button (default: true) */
  showCopy?: boolean;
  /** Compact card style vs full card style */
  compact?: boolean;
  /** Custom class name */
  className?: string;
}

export function QRCodeComponent({
  value,
  username = 'profile',
  name = 'SmartCard',
  size = 220,
  accentColor = '#2563EB',
  showDownload = true,
  showShare = true,
  showCopy = true,
  compact = false,
  className = '',
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Generate crisp QR code on canvas whenever value or size changes
  useEffect(() => {
    if (!value) return;

    // High error correction ('M' or 'H') with clear margin for maximum scanner readability
    QRCodeLib.toDataURL(
      value,
      {
        width: size * 2, // 2x resolution for ultra-sharp retina scanning & downloading
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#0F172A', // Slate 900 for high optical contrast
          light: '#FFFFFF', // Pure white background
        },
      },
      (err, url) => {
        if (!err && url) {
          setDataUrl(url);
        }
      }
    );

    if (canvasRef.current) {
      QRCodeLib.toCanvas(
        canvasRef.current,
        value,
        {
          width: size,
          margin: 2,
          errorCorrectionLevel: 'M',
          color: {
            dark: '#0F172A',
            light: '#FFFFFF',
          },
        },
        (err) => {
          if (err) console.error('Error rendering QR canvas:', err);
        }
      );
    }
  }, [value, size]);

  const handleDownload = () => {
    setDownloading(true);
    try {
      const filename = `smartcard-${username.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}-qr.png`;
      
      // If we have dataUrl, download it directly
      if (dataUrl) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (canvasRef.current) {
        const url = canvasRef.current.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  const handleCopyUrl = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(value);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy QR URL:', err);
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${name} — SmartCard`,
          text: `Connect with ${name} on SmartCard:`,
          url: value,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } catch (err) {
        // User cancelled or share failed
        handleCopyUrl();
      }
    } else {
      handleCopyUrl();
    }
  };

  if (compact) {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-sm inline-block">
          <canvas ref={canvasRef} className="block rounded-lg mx-auto" />
        </div>
        <div className="flex items-center gap-2">
          {showDownload && (
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <Download size={13} />
              <span>{downloading ? 'Downloading...' : 'Download QR'}</span>
            </button>
          )}
          {showCopy && (
            <button
              type="button"
              onClick={handleCopyUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              <span>{copied ? 'Copied!' : 'Copy URL'}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-white dark:bg-[#131924] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 sm:p-6 shadow-sm flex flex-col items-center text-center ${className}`}>
      {/* Header */}
      <div className="space-y-1 mb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-[11px] font-medium text-blue-700 dark:text-blue-300">
          <QrIcon size={12} />
          <span>Your SmartCard QR</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Scan with any phone camera to open live card
        </p>
      </div>

      {/* QR Canvas Box */}
      <div className="p-4 bg-white rounded-2xl border-2 border-slate-100 dark:border-slate-700/50 shadow-md inline-block relative group">
        <canvas ref={canvasRef} className="block rounded-lg mx-auto" />
      </div>

      {/* Scannable Target Notice */}
      <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <Smartphone size={13} className="text-blue-500" />
        <span>Scan to connect • Android / iOS / Lens</span>
      </div>

      {/* Public URL Display & Copy */}
      <div className="w-full mt-4 p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 text-left">
        <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300 truncate pl-1">
          {value}
        </span>
        {showCopy && (
          <button
            type="button"
            onClick={handleCopyUrl}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors shrink-0 cursor-pointer"
            title="Copy URL"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="w-full grid grid-cols-2 gap-2 mt-4">
        {showDownload && (
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="h-10 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Download size={14} />
            <span>{downloading ? 'Saving...' : 'Download QR'}</span>
          </button>
        )}

        {showShare && (
          <button
            type="button"
            onClick={handleShare}
            className="h-10 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            {shareSuccess ? <Check size={14} /> : <Share2 size={14} />}
            <span>{shareSuccess ? 'Shared!' : 'Share'}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export const QRCode = QRCodeComponent;
export default QRCodeComponent;
