'use client';

import React from 'react';
import Link from 'next/link';
import { CreditCard, ArrowLeft, Shield, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#0B0F17] flex flex-col justify-between text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
            <CreditCard size={18} />
          </div>
          <span className="font-semibold text-lg tracking-tight text-slate-900 dark:text-slate-100">
            SmartCard
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle compact showLabel={false} />
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to home</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/60 dark:border-slate-800/60 text-center text-xs text-slate-400">
        <div className="flex items-center justify-center gap-4 mb-2">
          <span className="flex items-center gap-1">
            <Shield size={12} className="text-emerald-500" />
            256-bit SSL Encrypted
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles size={12} className="text-blue-500" />
            Zero Setup Needed
          </span>
        </div>
        <p>© {new Date().getFullYear()} SmartCard Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
