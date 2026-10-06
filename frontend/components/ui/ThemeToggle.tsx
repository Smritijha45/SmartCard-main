'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

interface ThemeToggleProps {
  compact?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({
  compact = false,
  showLabel = true,
  className = '',
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className={`h-9 px-3 rounded-lg border-2 border-black font-mono text-xs font-bold flex items-center gap-1.5 opacity-70 ${className}`}
        aria-label="Toggle theme"
      >
        <span className="w-3.5 h-3.5 rounded-full bg-gray-400"></span>
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`h-9.5 px-3 rounded-lg border-2 border-black font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none select-none ${
        isDark
          ? 'bg-[#15233f] text-yellow-300 hover:bg-[#1a2d52] shadow-[2px_2px_0px_#000000]'
          : 'bg-[#FFFDF5] text-amber-600 hover:bg-amber-100 shadow-[2px_2px_0px_#000000]'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <>
          <Moon size={15} className="text-cyan-300 fill-cyan-300/30 shrink-0 transition-transform hover:-rotate-12" />
          {showLabel && !compact && <span className="text-gray-200">Dark</span>}
        </>
      ) : (
        <>
          <Sun size={15} className="text-amber-500 fill-amber-400/40 shrink-0 transition-transform hover:rotate-45" />
          {showLabel && !compact && <span className="text-gray-900">Light</span>}
        </>
      )}
    </button>
  );
}
