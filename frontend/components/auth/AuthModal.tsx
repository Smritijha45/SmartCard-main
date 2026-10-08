'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, X, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

const GoogleIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const GitHubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export function AuthModal({ isOpen, onClose, initialTab = 'signup' }: AuthModalProps) {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTab(initialTab);
    setError(null);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const completeAuth = (userData: { name: string; email: string }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('smartcard_authenticated', 'true');
      localStorage.setItem('token', 'dummy_token_' + Date.now());
      localStorage.setItem(
        'smartcard_user',
        JSON.stringify({
          name: userData.name || 'Smriti Jha',
          email: userData.email || 'smriti@smartcard.app',
          role: 'Full Stack Developer',
          company: 'SmartCard Technologies',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        })
      );
    }
    setLoading(true);
    setTimeout(() => {
      onClose();
      router.push('/dashboard');
      router.refresh();
    }, 400);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Please provide your email and password.');
      return;
    }

    completeAuth({
      name: loginEmail.split('@')[0] || 'Alex Morgan',
      email: loginEmail,
    });
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    if (signupConfirmPassword && signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    completeAuth({
      name: signupName,
      email: signupEmail,
    });
  };

  const handleSocialAuth = (provider: 'Google' | 'GitHub') => {
    setError(null);
    completeAuth({
      name: provider === 'Google' ? 'Google User' : 'GitHub Developer',
      email: provider === 'Google' ? 'user@gmail.com' : 'dev@github.com',
    });
  };

  const handleQuickDemoAccess = () => {
    completeAuth({
      name: 'Alex Morgan',
      email: 'alex@smartcard.id',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-subtle-fade">
      <div 
        className="bg-white dark:bg-[#131924] w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xl relative text-slate-900 dark:text-slate-100 my-8 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <CreditCard size={15} />
          </div>
          <span className="font-semibold text-lg text-slate-900 dark:text-slate-100 tracking-tight">SmartCard</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Your digital identity. Simple, elegant, unified.
        </p>

        {/* 1-Click Sandbox Shortcut */}
        <div className="mb-5 p-3 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
              <Sparkles size={12} className="text-blue-600 dark:text-blue-400" />
              1-Click Demo Access
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Sign in directly as Alex Morgan</p>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoAccess}
            disabled={loading}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1 shrink-0"
          >
            <span>Demo</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Segmented Control Tabs: Login | Sign Up */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-lg mb-5">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(null); }}
            className={`py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setError(null); }}
            className={`py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              tab === 'signup'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Sign up
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-2.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs rounded-lg">
            {error}
          </div>
        )}

        {/* Tab 1: LOGIN */}
        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <Input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="alex@smartcard.id"
                required
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">(Any password)</span>
              </div>
              <Input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full mt-2 h-10 text-xs font-medium"
            >
              {loading ? 'Authenticating...' : 'Sign in to SmartCard'}
            </Button>
          </form>
        ) : (
          /* Tab 2: SIGN UP */
          <form onSubmit={handleSignupSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <Input
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="Alex Morgan"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <Input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="alex@smartcard.id"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Confirm
                </label>
                <Input
                  type="password"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full mt-2 h-10 text-xs font-medium"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        )}

        {/* Divider */}
        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-3 text-slate-400 text-[11px]">
            Or continue with
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleSocialAuth('Google')}
            className="flex items-center justify-center gap-2 p-2 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium shadow-2xs transition-colors cursor-pointer"
          >
            <GoogleIcon className="w-3.5 h-3.5" />
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialAuth('GitHub')}
            className="flex items-center justify-center gap-2 p-2 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium shadow-2xs transition-colors cursor-pointer"
          >
            <GitHubIcon className="w-3.5 h-3.5 text-slate-900 dark:text-slate-100" />
            <span>GitHub</span>
          </button>
        </div>

      </div>
    </div>
  );
}
