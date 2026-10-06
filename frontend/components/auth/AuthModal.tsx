'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, X, ShieldCheck, Sparkles, ArrowRight, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

// Google and GitHub SVG Icons
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
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup fields
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

  // Complete Dummy Authentication
  const completeAuth = (userData: { name: string; email: string }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('smartcard_authenticated', 'true');
      localStorage.setItem('token', 'dummy_token_' + Date.now());
      localStorage.setItem(
        'smartcard_user',
        JSON.stringify({
          name: userData.name || 'Alex Morgan',
          email: userData.email || 'alex@smartcard.id',
          role: 'Head of Product',
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

    // Dummy Auth accepts any non-empty input
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-[#0e1526] w-full max-w-md rounded-2xl border-3 border-black p-6 sm:p-8 shadow-[10px_10px_0px_#000000] relative text-white my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-[#17223b] hover:bg-slate-700 text-gray-300 hover:text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Dummy Auth Pill */}
        <div className="inline-flex items-center gap-1.5 bg-cyan-400 text-black border-2 border-black px-2.5 py-0.5 rounded font-mono font-black text-[10px] uppercase shadow-[2px_2px_0px_#000] -rotate-1 mb-4">
          <ShieldCheck size={13} />
          <span>Dummy Auth • Local Only</span>
        </div>

        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] border-2 border-black flex items-center justify-center font-black text-white shadow-[2px_2px_0px_#000]">
            <CreditCard size={18} />
          </div>
          <span className="font-black text-2xl text-white tracking-tight">SmartCard</span>
        </div>
        <p className="text-xs font-mono font-bold text-gray-400 mb-5">
          Your identity. One smart card.
        </p>

        {/* 1-Click Sandbox Shortcut */}
        <div className="mb-5 p-3 bg-[#131d33] border-2 border-black rounded-xl shadow-[3px_3px_0px_#2563EB] flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
              <Sparkles size={13} className="text-yellow-400" />
              1-Click Instant Demo
            </span>
            <p className="text-[10px] text-gray-400 font-mono">Sign in directly as Alex Morgan</p>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoAccess}
            disabled={loading}
            className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-black text-xs uppercase rounded border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-transform cursor-pointer flex items-center gap-1 shrink-0"
          >
            <span>Demo</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Tabs: Login | Sign Up */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-black rounded-xl border-2 border-black mb-5 shadow-[2px_2px_0px_#000]">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(null); }}
            className={`py-2 text-xs font-mono font-black uppercase rounded-lg border-2 transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-white text-black border-black shadow-[2px_2px_0px_#000]'
                : 'bg-transparent text-gray-400 border-transparent hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setError(null); }}
            className={`py-2 text-xs font-mono font-black uppercase rounded-lg border-2 transition-all cursor-pointer ${
              tab === 'signup'
                ? 'bg-[#2563EB] text-white border-black shadow-[2px_2px_0px_#000]'
                : 'bg-transparent text-gray-400 border-transparent hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-2.5 bg-red-950/80 border-2 border-red-500 text-red-200 text-xs font-bold rounded-lg shadow-[2px_2px_0px_#000]">
            {error}
          </div>
        )}

        {/* Tab 1: LOGIN */}
        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold uppercase text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="alex@smartcard.id"
                required
                className="w-full h-11 bg-[#090D16] border-2 border-black rounded-lg px-3.5 text-sm font-bold text-white focus:outline-none focus:border-blue-500 shadow-[2px_2px_0px_#000]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono font-bold uppercase text-gray-300">
                  Password
                </label>
                <span className="text-[10px] text-gray-400 font-mono">(Any password)</span>
              </div>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 bg-[#090D16] border-2 border-black rounded-lg px-3.5 text-sm font-bold text-white focus:outline-none focus:border-blue-500 shadow-[2px_2px_0px_#000]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-mono font-black text-sm uppercase tracking-wider rounded-lg border-2 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer mt-2"
            >
              {loading ? 'Authenticating...' : 'Login to SmartCard →'}
            </button>
          </form>
        ) : (
          /* Tab 2: SIGN UP */
          <form onSubmit={handleSignupSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold uppercase text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="Alex Morgan"
                required
                className="w-full h-10 bg-[#090D16] border-2 border-black rounded-lg px-3.5 text-sm font-bold text-white focus:outline-none focus:border-blue-500 shadow-[2px_2px_0px_#000]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold uppercase text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="alex@smartcard.id"
                required
                className="w-full h-10 bg-[#090D16] border-2 border-black rounded-lg px-3.5 text-sm font-bold text-white focus:outline-none focus:border-blue-500 shadow-[2px_2px_0px_#000]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-10 bg-[#090D16] border-2 border-black rounded-lg px-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500 shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-gray-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 bg-[#090D16] border-2 border-black rounded-lg px-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500 shadow-[2px_2px_0px_#000]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-white hover:bg-gray-100 text-black font-mono font-black text-sm uppercase tracking-wider rounded-lg border-2 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer mt-2"
            >
              {loading ? 'Creating Account...' : 'Create SmartCard →'}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t-2 border-black"></div>
          <span className="flex-shrink mx-3 text-gray-500 font-mono text-[10px] uppercase font-bold">
            Or Continue With
          </span>
          <div className="flex-grow border-t-2 border-black"></div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleSocialAuth('Google')}
            className="flex items-center justify-center gap-2 p-2.5 bg-white hover:bg-gray-100 text-black rounded-lg border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
          >
            <GoogleIcon className="w-4 h-4" />
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialAuth('GitHub')}
            className="flex items-center justify-center gap-2 p-2.5 bg-[#17223b] hover:bg-black text-white rounded-lg border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
          >
            <GitHubIcon className="w-4 h-4 fill-white" />
            <span>GitHub</span>
          </button>
        </div>

      </div>
    </div>
  );
}
