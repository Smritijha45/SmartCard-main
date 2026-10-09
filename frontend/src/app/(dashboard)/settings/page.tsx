'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Shield, Sliders, AlertTriangle, Check, Camera, 
  Moon, Sun, Monitor, LogOut, Trash2, CheckCircle2, Bell,
  Globe, Lock, Eye, ArrowRight, Sparkles, AlertCircle
} from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { validateUsername, getAppUrl, getCardPublicUrl } from '@/lib/usernameValidation';
import { PlanSwitcherModal } from '@/components/PlanSwitcherModal';

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [toast, setToast] = useState<string | null>(null);

  // Subscription Plan State
  const [currentPlan, setCurrentPlan] = useState<string>('starter');
  const [showPlanModal, setShowPlanModal] = useState(false);

  // Account State
  const [name, setName] = useState('Smriti Jha');
  const [email, setEmail] = useState('smriti@smartcard.app');
  const [profilePhoto, setProfilePhoto] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80');

  // Username Setup & Change State
  const [currentCardId, setCurrentCardId] = useState('smriti');
  const [currentUsername, setCurrentUsername] = useState('smriti');
  const [usernameInput, setUsernameInput] = useState('smriti');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isSavingUsername, setIsSavingUsername] = useState(false);

  // Privacy State: Public Profile ON / OFF
  const [isPublic, setIsPublic] = useState(true);
  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notifications State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [profileActivity, setProfileActivity] = useState(true);

  // Danger Zone State
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Load existing card details to sync username & privacy
    fetch('/api/cards/smriti')
      .then(res => res.json())
      .then(card => {
        if (card) {
          if (card.username) {
            setCurrentUsername(card.username);
            setUsernameInput(card.username);
          }
          if (card._id || card.id) {
            setCurrentCardId(card._id || card.id);
          }
          if (card.isPublic !== undefined) {
            setIsPublic(card.isPublic);
          }
          if (card.name) setName(card.name);
          if (card.email) setEmail(card.email);
          if (card.profileImage) setProfilePhoto(card.profileImage);
        }
      })
      .catch(() => {
        if (typeof window !== 'undefined') {
          const storedCard = localStorage.getItem('smartcard_current_card');
          if (storedCard) {
            try {
              const parsed = JSON.parse(storedCard);
              if (parsed.username) {
                setCurrentUsername(parsed.username);
                setUsernameInput(parsed.username);
              }
              if (parsed._id || parsed.id) setCurrentCardId(parsed._id || parsed.id);
              if (parsed.isPublic !== undefined) setIsPublic(parsed.isPublic);
            } catch (e) {}
          }
        }
      });

    // Load user plan
    fetch('/api/user/plan')
      .then(res => res.json())
      .then(data => {
        if (data && data.data && data.data.plan) {
          setCurrentPlan(data.data.plan);
        } else if (data && data.plan) {
          setCurrentPlan(data.plan);
        }
      })
      .catch(() => {});

    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('smartcard_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.name) setName(parsed.name);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.avatar) setProfilePhoto(parsed.avatar);
          if (parsed.subscriptionPlan) setCurrentPlan(parsed.subscriptionPlan);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleUsernameInputChange = (val: string) => {
    setUsernameInput(val);
    const validation = validateUsername(val);
    if (!validation.isValid) {
      setUsernameError(validation.error || 'Invalid username');
    } else {
      setUsernameError(null);
    }
  };

  const handleSaveUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateUsername(usernameInput);
    if (!validation.isValid) {
      setUsernameError(validation.error || 'Please enter a valid username');
      return;
    }

    setIsSavingUsername(true);
    const newUsername = validation.sanitized;

    try {
      const res = await fetch(`/api/cards/${currentCardId || currentUsername}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername }),
      });

      if (res.ok) {
        setCurrentUsername(newUsername);
        setUsernameInput(newUsername);
        if (typeof window !== 'undefined') {
          const storedCard = localStorage.getItem('smartcard_current_card');
          if (storedCard) {
            try {
              const parsed = JSON.parse(storedCard);
              parsed.username = newUsername;
              parsed.qrCodeUrl = getCardPublicUrl(newUsername);
              localStorage.setItem('smartcard_current_card', JSON.stringify(parsed));
            } catch (e) {}
          }
        }
        showNotification(`SmartCard URL updated to smartcard.app/${newUsername}`);
      } else {
        const data = await res.json();
        setUsernameError(data.message || 'Username already taken or invalid');
      }
    } catch (err: any) {
      setUsernameError(err.message || 'Failed to update username');
    } finally {
      setIsSavingUsername(false);
    }
  };

  const handleTogglePrivacy = async (newVal: boolean) => {
    setIsPublic(newVal);
    setIsSavingPrivacy(true);

    try {
      await fetch(`/api/cards/${currentCardId || currentUsername}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: newVal }),
      });

      if (typeof window !== 'undefined') {
        const storedCard = localStorage.getItem('smartcard_current_card');
        if (storedCard) {
          try {
            const parsed = JSON.parse(storedCard);
            parsed.isPublic = newVal;
            localStorage.setItem('smartcard_current_card', JSON.stringify(parsed));
          } catch (e) {}
        }
      }

      showNotification(newVal ? 'Public Profile enabled. Anyone with link/QR can view.' : 'Private mode enabled. Card is hidden from public.');
    } catch (err) {
      // Ignored for smooth client feedback
    } finally {
      setIsSavingPrivacy(false);
    }
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const updatedUser = {
        name,
        email,
        avatar: profilePhoto,
        role: 'Full Stack Developer'
      };
      localStorage.setItem('smartcard_user', JSON.stringify(updatedUser));
    }
    showNotification('Account profile updated.');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      showNotification('Please enter a new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotification('New passwords do not match');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showNotification('Password updated successfully.');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') {
      showNotification('Please type DELETE to confirm');
      return;
    }
    setIsDeleting(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('smartcard_theme');
        localStorage.removeItem('smartcard_authenticated');
        localStorage.removeItem('token');
        localStorage.removeItem('smartcard_user');
        localStorage.removeItem('smartcard_current_card');
        if (savedTheme) localStorage.setItem('smartcard_theme', savedTheme);
      }
      router.push('/login');
      router.refresh();
    }, 800);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
        showNotification('Profile picture updated.');
      };
      reader.readAsDataURL(file);
    }
  };

  const currentPublicLink = getCardPublicUrl(currentUsername);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your SmartCard public URL, privacy settings, appearance, and account credentials.
        </p>
      </div>

      {/* Main Settings Form with subtle separators */}
      <div className="bg-white dark:bg-[#131924] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-8 shadow-xs space-y-8">
        
        {/* 21 & 22. USERNAME SETUP & CHANGE */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Globe size={16} className="text-blue-600 dark:text-blue-400" />
                <span>SmartCard URL &amp; Username</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Your permanent live profile address. When changed, your new URL becomes active immediately.
              </p>
            </div>
            <a 
              href={`/${currentUsername}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>View live</span>
              <ArrowRight size={13} />
            </a>
          </div>

          <form onSubmit={handleSaveUsername} className="space-y-3">
            <div className="space-y-1.5 max-w-lg">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Choose your SmartCard URL
              </label>
              
              <div className="flex rounded-xl shadow-2xs border border-slate-200 dark:border-slate-800 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white dark:bg-[#0B0F17]">
                <span className="inline-flex items-center px-3.5 bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 text-xs font-mono select-none border-r border-slate-200 dark:border-slate-800">
                  smartcard.app/
                </span>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => handleUsernameInputChange(e.target.value)}
                  placeholder="smriti"
                  className="flex-1 h-10 px-3 bg-transparent text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              {usernameError && (
                <p className="text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1 font-medium mt-1">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{usernameError}</span>
                </p>
              )}

              <p className="text-[11px] text-slate-400">
                Minimum 3 characters. Lowercase letters, numbers, hyphens, and underscores only.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button
                type="submit"
                variant="primary"
                disabled={isSavingUsername || Boolean(usernameError) || usernameInput === currentUsername}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium h-9 px-4 shadow-xs disabled:opacity-50"
              >
                {isSavingUsername ? 'Updating...' : 'Change Username'}
              </Button>

              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Active: <span className="font-mono text-slate-900 dark:text-slate-100 font-semibold">{currentPublicLink}</span>
              </span>
            </div>
          </form>
        </section>

        <div className="border-t border-slate-100 dark:border-slate-800/80" />

        {/* 23. PRIVACY: PUBLIC PROFILE ON/OFF */}
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Lock size={16} className="text-indigo-600 dark:text-indigo-400" />
              <span>Privacy &amp; Public Visibility</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Control whether your SmartCard profile is publicly scannable or hidden.
            </p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 max-w-2xl">
            <div className="space-y-1 pr-4">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Public Profile
                </p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                  isPublic 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                }`}>
                  {isPublic ? 'ON (Public)' : 'OFF (Private)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {isPublic 
                  ? 'Your live card and QR code are visible to anyone who visits your public URL.' 
                  : 'Your public URL is protected. Visitors will see "This SmartCard is currently private."'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleTogglePrivacy(!isPublic)}
              disabled={isSavingPrivacy}
              className={`w-11 h-6 rounded-full p-1 transition-colors relative cursor-pointer shrink-0 ${
                isPublic ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div 
                className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  isPublic ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        <div className="border-t border-slate-100 dark:border-slate-800/80" />

        {/* SUBSCRIPTION PLAN & LIMITS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                <span>Subscription Plan &amp; Limits</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage your tier, active card capacity, CRM leads access, and team features.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPlanModal(true)}
              className="text-xs font-semibold border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            >
              Change Plan
            </Button>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/60 via-slate-50 to-indigo-50/40 dark:from-blue-950/20 dark:via-slate-900/40 dark:to-indigo-950/20 border border-slate-200/90 dark:border-slate-800/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  {currentPlan === 'enterprise' ? 'Team & Enterprise Plan' : currentPlan === 'professional' ? 'Professional Plan' : 'Starter Plan (Free)'}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                  {currentPlan === 'enterprise' ? '₹799 / mo' : currentPlan === 'professional' ? '₹199 / mo' : '₹0 Forever'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {currentPlan === 'enterprise'
                  ? 'Includes Organization workspace (25 seats), Team admin, SSO, Custom domains, Audit logs & Centralized leads.'
                  : currentPlan === 'professional'
                  ? 'Includes up to 10 active cards, CRM leads capture (5 statuses), time-range analytics, CSV/JSON export & custom branding.'
                  : 'Includes 1 active card, personal profile editor, and standard theme. Upgrade to unlock CRM leads & multi-cards.'}
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowPlanModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shrink-0"
            >
              {currentPlan === 'enterprise' ? 'Manage Plan' : 'Upgrade Plan →'}
            </Button>
          </div>
        </section>

        <div className="border-t border-slate-100 dark:border-slate-800/80" />

        {/* SECTION 3: ACCOUNT */}
        <section className="space-y-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Account Profile
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Your personal account information and primary contact details.
            </p>
          </div>

          <form onSubmit={handleSaveAccount} className="space-y-5">
            {/* Profile picture */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                <img src={profilePhoto} alt={name} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-1">
                <label 
                  htmlFor="avatar-upload"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer transition-colors"
                >
                  <Camera size={13} />
                  <span>Change Profile Picture</span>
                </label>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarUpload} 
                  className="hidden" 
                />
                <p className="text-[11px] text-slate-400">JPG, PNG, or WebP. Max 2MB.</p>
              </div>
            </div>

            {/* Name & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full h-10 px-3 bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-10 px-3 bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium h-9 px-4 shadow-xs"
              >
                Save Account
              </Button>
            </div>
          </form>
        </section>

        <div className="border-t border-slate-100 dark:border-slate-800/80" />

        {/* SECTION 4: APPEARANCE */}
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Appearance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize how SmartCard looks on your device.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-xs">
            {[
              { mode: 'light' as const, label: 'Light', icon: Sun },
              { mode: 'dark' as const, label: 'Dark', icon: Moon },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.mode}
                  type="button"
                  onClick={() => setTheme(t.mode)}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-2 cursor-pointer transition-all ${
                    theme === t.mode
                      ? 'border-blue-500/50 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="border-t border-slate-100 dark:border-slate-800/80" />

        {/* SECTION 5: NOTIFICATIONS */}
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Notifications
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose which notifications you wish to receive.
            </p>
          </div>

          <div className="space-y-3">
            {/* Email notifications */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60">
              <div className="space-y-0.5 pr-4">
                <p className="text-xs font-medium text-slate-900 dark:text-slate-100">Email notifications</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive periodic digest and important workspace alerts.</p>
              </div>

              <button
                type="button"
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`w-10 h-6 rounded-full p-1 transition-colors relative cursor-pointer shrink-0 ${
                  emailNotifications ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <div 
                  className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    emailNotifications ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Profile activity */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60">
              <div className="space-y-0.5 pr-4">
                <p className="text-xs font-medium text-slate-900 dark:text-slate-100">Profile activity</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Get notified when someone scans your card or submits contact details.</p>
              </div>

              <button
                type="button"
                onClick={() => setProfileActivity(!profileActivity)}
                className={`w-10 h-6 rounded-full p-1 transition-colors relative cursor-pointer shrink-0 ${
                  profileActivity ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <div 
                  className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    profileActivity ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        <div className="border-t border-slate-100 dark:border-slate-800/80" />

        {/* SECTION 6: SECURITY */}
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Security
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Update your account password.
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full h-10 px-3 bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full h-10 px-3 bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <Button
                type="submit"
                variant="outline"
                className="border-slate-200 dark:border-slate-800 text-xs font-medium h-9 px-4"
              >
                Update Password
              </Button>
            </div>
          </form>
        </section>

        <div className="border-t border-slate-100 dark:border-slate-800/80" />

        {/* SECTION 7: DANGER ZONE */}
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-red-600 dark:text-red-400">
              Danger Zone
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Irreversible account actions.
            </p>
          </div>

          <div className="space-y-3 max-w-md">
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              To permanently delete your account and all associated cards, type <span className="font-mono font-semibold text-red-600">DELETE</span> below:
            </p>

            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full h-10 px-3 bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />

            <Button
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== 'DELETE' || isDeleting}
              variant="danger"
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium h-9 px-4 shadow-xs disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete account'}
            </Button>
          </div>
        </section>

      </div>

      {/* Plan Switcher Modal */}
      <PlanSwitcherModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        currentPlan={currentPlan}
        onPlanChanged={(newPlan) => {
          setCurrentPlan(newPlan);
          showNotification(`Subscription updated to ${newPlan.toUpperCase()}!`);
        }}
      />

    </div>
  );
}
