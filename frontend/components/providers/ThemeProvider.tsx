'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  const getSystemTheme = (): Theme => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  };

  const applyThemeToDOM = (activeTheme: Theme, currentMode: ThemeMode) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(activeTheme);
      root.setAttribute('data-theme', activeTheme);
      root.setAttribute('data-theme-mode', currentMode);
      root.style.colorScheme = activeTheme;
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('smartcard_theme') as ThemeMode | null;
    let initialMode: ThemeMode = 'system';
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      initialMode = saved;
    }

    setModeState(initialMode);
    const resolved = initialMode === 'system' ? getSystemTheme() : initialMode;
    setThemeState(resolved);
    applyThemeToDOM(resolved, initialMode);
    setMounted(true);

    // Listen to OS theme changes if on system mode
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const currentSaved = localStorage.getItem('smartcard_theme');
        if (!currentSaved || currentSaved === 'system') {
          const sysTheme: Theme = e.matches ? 'dark' : 'light';
          setThemeState(sysTheme);
          applyThemeToDOM(sysTheme, 'system');
        }
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('smartcard_theme', newMode);
    }
    const resolved = newMode === 'system' ? getSystemTheme() : newMode;
    setThemeState(resolved);
    applyThemeToDOM(resolved, newMode);
  };

  const setTheme = (newTheme: Theme) => {
    setMode(newTheme);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setMode(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme, setTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
