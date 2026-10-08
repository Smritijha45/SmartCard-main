'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

interface ThemeToggleProps {
  compact?: boolean;
  showLabel?: boolean;
  className?: string;
  variant?: 'button' | 'segmented';
}

export function ThemeToggle({
  compact = false,
  showLabel = false,
  className = '',
  variant = 'segmented',
}: ThemeToggleProps) {
  const { theme, setTheme, toggleTheme, isDark } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`h-8 w-15 rounded-full bg-slate-200/60 dark:bg-slate-800/60 animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (variant === 'segmented' && !compact) {
    return (
      <div
        className={`inline-flex items-center p-0.5 rounded-full border border-slate-200/80 dark:border-slate-800/80 bg-slate-100 dark:bg-slate-900/90 shadow-2xs ${className}`}
        role="group"
        aria-label="Theme selection"
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            !isDark
              ? 'bg-white text-slate-900 shadow-2xs font-semibold'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
          aria-label="Light mode"
          title="Light mode"
        >
          <Sun size={13} className={!isDark ? 'text-amber-500' : 'text-slate-400'} />
          {showLabel && <span>Light</span>}
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            isDark
              ? 'bg-[#131924] text-white shadow-2xs font-semibold'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
          aria-label="Dark mode"
          title="Dark mode"
        >
          <Moon size={13} className={isDark ? 'text-blue-400' : 'text-slate-400'} />
          {showLabel && <span>Dark</span>}
        </button>
      </div>
    );
  }

  // Compact Single Button Variant
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`h-8.5 px-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131924] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-150 shadow-2xs select-none ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <>
          <Moon size={14} className="text-blue-400 shrink-0" />
          {showLabel && <span>Dark</span>}
        </>
      ) : (
        <>
          <Sun size={14} className="text-amber-500 shrink-0" />
          {showLabel && <span>Light</span>}
        </>
      )}
    </button>
  );
}
