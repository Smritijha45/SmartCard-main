import React from 'react';
import Link from 'next/link';
import { CreditCard, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative selection:bg-blue-600 selection:text-white transition-colors">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle compact showLabel={false} />
      </div>

      {/* Subtle ambient lighting */}
      <div className="hero-glow"></div>

      {/* Brand Header */}
      <div className="mb-6 z-10 flex flex-col items-center gap-2.5 text-center">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
            <CreditCard size={20} className="text-white" />
          </div>
          <span className="font-semibold text-xl text-slate-900 dark:text-slate-100 tracking-tight">
            SmartCard
          </span>
        </Link>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
          The digital version of your professional identity.
        </p>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md z-10">
        {children}
      </div>
      
      {/* Footer link */}
      <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-200 inline-flex items-center gap-1.5 transition-colors">
          <ArrowLeft size={13} />
          <span>Return to SmartCard Home</span>
        </Link>
      </div>
    </div>
  );
}
