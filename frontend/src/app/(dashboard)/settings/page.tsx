'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Shield, Sliders, AlertTriangle, Check, Camera, 
  Moon, Sun, Monitor, LogOut, Trash2, CheckCircle2, Bell
} from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [toast, setToast] = useState<string | null>(null);

  // Account State
  const [name, setName] = useState('Smriti Jha');
  const [email, setEmail] = useState('smriti@smartcard.app');
  const [profilePhoto, setProfilePhoto] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80');

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
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('smartcard_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.name) setName(parsed.name);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.avatar) setProfilePhoto(parsed.avatar);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your account profile, appearance, notification preferences, and security.
        </p>
      </div>

      {/* Main Settings Form with subtle separators */}
      <div className="bg-white dark:bg-[#131924] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-8 shadow-xs space-y-8">
        
        {/* SECTION 1: ACCOUNT */}
        <section className="space-y-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Account
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Your personal information and public profile representation.
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
                <p className="text-[11px] text-slate-400">JPG, PNG, or GIF. Max 2MB.</p>
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

        {/* SECTION 2: APPEARANCE */}
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

        {/* SECTION 3: NOTIFICATIONS */}
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

        {/* SECTION 4: SECURITY */}
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

        {/* SECTION 5: DANGER ZONE */}
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

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-medium shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 size={15} className="text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
