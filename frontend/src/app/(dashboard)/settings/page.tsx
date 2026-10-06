'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Shield, Sliders, AlertTriangle, Check, Camera, 
  Upload, KeyRound, Bell, Moon, Sun, Monitor, LogOut, 
  Trash2, ShieldCheck, RefreshCw
} from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function SettingsPage() {
  const router = useRouter();
  const { theme: globalTheme, setTheme: setGlobalTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'preferences' | 'danger'>('account');
  const [toast, setToast] = useState<string | null>(null);

  // Account State
  const [account, setAccount] = useState({
    name: 'Alex Morgan',
    email: 'alex.morgan@smartcard.id',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  });

  // Security State
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Preferences State
  const [preferences, setPreferences] = useState({
    scanAlerts: true,
    weeklyDigest: true,
    inboundLeads: true,
    marketingUpdates: false,
    theme: 'neo-dark' as 'neo-dark' | 'light' | 'cyber',
  });

  // Danger Zone State
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Load stored user on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('smartcard_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.name) setAccount(prev => ({ ...prev, name: parsed.name, email: parsed.email || prev.email }));
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
        name: account.name,
        email: account.email,
        avatar: account.profilePhoto,
        role: 'Principal Product Designer'
      };
      localStorage.setItem('smartcard_user', JSON.stringify(updatedUser));
    }
    showNotification('Account profile updated successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!security.newPassword) {
      showNotification('Please enter a new password');
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      showNotification('New passwords do not match!');
      return;
    }
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showNotification('Password updated successfully!');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') {
      showNotification('Please type DELETE to confirm');
      return;
    }
    setIsDeleting(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.clear();
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
        setAccount(prev => ({ ...prev, profilePhoto: reader.result as string }));
        showNotification('Profile photo updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-[#0e1628] p-5 sm:p-6 rounded-xl border-3 border-black shadow-[6px_6px_0px_#000]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] font-black uppercase bg-[#2563EB] text-white px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
              Account &amp; Security
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold">Workspace Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Settings &amp; Workspace
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-medium">
            Manage your credentials, change password, customize preferences, or manage your account.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 border-2 border-black rounded-lg text-emerald-400 font-mono text-xs font-bold shadow-[2px_2px_0px_#000]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Dummy Auth Mode Active
          </span>
        </div>
      </div>

      {/* Main Settings Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Navigation Tabs (Sidebar) */}
        <div className="md:col-span-4 space-y-2">
          <div className="bg-[#0e1628] p-2 rounded-xl border-3 border-black shadow-[5px_5px_0px_#000] space-y-1">
            
            <button
              type="button"
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-xs font-black uppercase tracking-wider transition-all text-left cursor-pointer border-2 ${
                activeTab === 'account'
                  ? 'bg-[#2563EB] text-white border-black shadow-[2px_2px_0px_#000] -translate-y-0.5'
                  : 'text-gray-300 hover:text-white hover:bg-slate-800 border-transparent'
              }`}
            >
              <User size={16} />
              <span>Account</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-xs font-black uppercase tracking-wider transition-all text-left cursor-pointer border-2 ${
                activeTab === 'security'
                  ? 'bg-[#2563EB] text-white border-black shadow-[2px_2px_0px_#000] -translate-y-0.5'
                  : 'text-gray-300 hover:text-white hover:bg-slate-800 border-transparent'
              }`}
            >
              <Shield size={16} />
              <span>Security</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preferences')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-xs font-black uppercase tracking-wider transition-all text-left cursor-pointer border-2 ${
                activeTab === 'preferences'
                  ? 'bg-[#2563EB] text-white border-black shadow-[2px_2px_0px_#000] -translate-y-0.5'
                  : 'text-gray-300 hover:text-white hover:bg-slate-800 border-transparent'
              }`}
            >
              <Sliders size={16} />
              <span>Preferences</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('danger')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-xs font-black uppercase tracking-wider transition-all text-left cursor-pointer border-2 ${
                activeTab === 'danger'
                  ? 'bg-red-600 text-white border-black shadow-[2px_2px_0px_#000] -translate-y-0.5'
                  : 'text-red-400 hover:text-white hover:bg-red-950/60 border-transparent'
              }`}
            >
              <AlertTriangle size={16} />
              <span>Danger Zone</span>
            </button>

          </div>

          {/* Quick Profile Summary Badge */}
          <div className="bg-[#0e1628] p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg border-2 border-black bg-white overflow-hidden shadow-[2px_2px_0px_#000] shrink-0">
              <img 
                src={account.profilePhoto} 
                alt={account.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-black text-white truncate">{account.name}</h4>
              <p className="text-[10px] font-mono text-gray-400 truncate">{account.email}</p>
              <p className="text-[10px] font-mono text-cyan-400 font-bold mt-0.5">Admin Workspace</p>
            </div>
          </div>
        </div>

        {/* Content Panel (md:col-span-8) */}
        <div className="md:col-span-8">
          
          {/* TAB 1: ACCOUNT (Section 20: Name, Email, Profile photo) */}
          {activeTab === 'account' && (
            <div className="bg-[#0e1628] rounded-xl border-3 border-black p-6 sm:p-7 shadow-[6px_6px_0px_#000] space-y-6">
              <div className="border-b-2 border-black pb-4">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <User size={20} className="text-[#2563EB]" />
                  <span>Account Profile</span>
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Update your personal credentials and avatar representation.
                </p>
              </div>

              {/* Profile Photo Uploader */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-gray-300">
                  Profile Photo
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#090D16] p-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000]">
                  <div className="w-16 h-16 rounded-xl border-2 border-black bg-white overflow-hidden shadow-[2px_2px_0px_#000] shrink-0">
                    <img 
                      src={account.profilePhoto} 
                      alt={account.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                      <label className="h-9 px-3.5 bg-[#2563EB] hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5">
                        <Upload size={14} />
                        <span>Change Photo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleAvatarUpload} 
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setAccount(p => ({ ...p, profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' }))}
                        className="h-9 px-2.5 bg-[#121c33] text-gray-300 hover:text-white font-mono text-[11px] font-bold rounded-lg border-2 border-black cursor-pointer"
                      >
                        Reset Avatar
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Or paste image URL"
                      value={account.profilePhoto}
                      onChange={(e) => setAccount({ ...account, profilePhoto: e.target.value })}
                      className="w-full h-9 bg-[#10192e] border-2 border-black px-3 rounded-lg text-xs font-mono text-gray-200 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Name & Email Fields */}
              <form onSubmit={handleSaveAccount} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={account.name}
                    onChange={(e) => setAccount({ ...account, name: e.target.value })}
                    className="w-full h-11 bg-[#090D16] border-2 border-black rounded-lg px-3.5 text-xs font-bold text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={account.email}
                    onChange={(e) => setAccount({ ...account, email: e.target.value })}
                    className="w-full h-11 bg-[#090D16] border-2 border-black rounded-lg px-3.5 text-xs font-bold text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="h-11 px-5 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-black uppercase rounded-lg border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check size={16} className="stroke-[3]" />
                    <span>Save Account Changes</span>
                  </button>
                </div>
              </form>

            </div>
          )}

          {/* TAB 2: SECURITY (Section 20: Change password) */}
          {activeTab === 'security' && (
            <div className="bg-[#0e1628] rounded-xl border-3 border-black p-6 sm:p-7 shadow-[6px_6px_0px_#000] space-y-6">
              <div className="border-b-2 border-black pb-4">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <KeyRound size={20} className="text-amber-400" />
                  <span>Security &amp; Password</span>
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Change your login password and manage session authentication.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={security.currentPassword}
                    onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                    className="w-full h-11 bg-[#090D16] border-2 border-black rounded-lg px-3.5 text-xs font-bold text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={security.newPassword}
                    onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                    className="w-full h-11 bg-[#090D16] border-2 border-black rounded-lg px-3.5 text-xs font-bold text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-gray-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                    className="w-full h-11 bg-[#090D16] border-2 border-black rounded-lg px-3.5 text-xs font-bold text-white shadow-[2px_2px_0px_#000] focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="h-11 px-5 bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase rounded-lg border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <KeyRound size={16} />
                    <span>Update Password</span>
                  </button>
                </div>
              </form>

              {/* Active Sessions */}
              <div className="pt-4 border-t-2 border-black space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase text-gray-300">Active Authorized Sessions</h4>
                <div className="p-3.5 bg-[#090D16] rounded-xl border-2 border-black flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Current Browser • Windows 11</p>
                    <p className="text-[10px] font-mono text-emerald-400">Active Now • LocalStorage Authenticated</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-emerald-400 text-black border border-black">
                    Current
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: PREFERENCES (Section 20: Notifications, Theme) */}
          {activeTab === 'preferences' && (
            <div className="bg-[#0e1628] rounded-xl border-3 border-black p-6 sm:p-7 shadow-[6px_6px_0px_#000] space-y-6">
              <div className="border-b-2 border-black pb-4">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Sliders size={20} className="text-cyan-400" />
                  <span>Workspace Preferences</span>
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Configure notification preferences and theme appearance.
                </p>
              </div>

              {/* Theme Selection (Section 28) */}
              <div className="space-y-3">
                <label className="text-xs font-mono font-bold uppercase text-gray-300">
                  Workspace Theme
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => { setGlobalTheme('dark'); showNotification('Global theme set to Neo Dark'); }}
                    className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${
                      globalTheme === 'dark'
                        ? 'bg-[#15233f] border-cyan-400 shadow-[3px_3px_0px_#06B6D4]'
                        : 'bg-[#090D16] border-black hover:border-gray-500 shadow-[2px_2px_0px_#000]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Moon size={20} className="text-cyan-400" />
                      {globalTheme === 'dark' && (
                        <span className="font-mono text-[10px] font-black uppercase bg-cyan-400 text-black px-1.5 py-0.2 rounded border border-black">Active</span>
                      )}
                    </div>
                    <div className="text-sm font-black text-white">Neo Dark</div>
                    <div className="text-[11px] font-mono text-gray-400 mt-0.5">High-contrast dark slate canvas</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setGlobalTheme('light'); showNotification('Global theme set to Contrast Light'); }}
                    className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${
                      globalTheme === 'light'
                        ? 'bg-[#15233f] border-cyan-400 shadow-[3px_3px_0px_#06B6D4]'
                        : 'bg-[#090D16] border-black hover:border-gray-500 shadow-[2px_2px_0px_#000]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Sun size={20} className="text-amber-400" />
                      {globalTheme === 'light' && (
                        <span className="font-mono text-[10px] font-black uppercase bg-cyan-400 text-black px-1.5 py-0.2 rounded border border-black">Active</span>
                      )}
                    </div>
                    <div className="text-sm font-black text-white">Contrast Light</div>
                    <div className="text-[11px] font-mono text-gray-400 mt-0.5">Crisp bright neo-brutalist canvas</div>
                  </button>
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="space-y-3 pt-3 border-t-2 border-black">
                <label className="text-xs font-mono font-bold uppercase text-gray-300 flex items-center gap-1.5">
                  <Bell size={14} className="text-cyan-400" />
                  <span>Notification Alerts</span>
                </label>

                <div className="space-y-2.5">
                  <label className="flex items-center justify-between p-3.5 bg-[#090D16] rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer">
                    <div>
                      <p className="text-xs font-bold text-white">Email alerts on QR code scan</p>
                      <p className="text-[10px] text-gray-400 font-mono">Receive instant email when someone scans your card.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.scanAlerts}
                      onChange={(e) => setPreferences({ ...preferences, scanAlerts: e.target.checked })}
                      className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 bg-[#090D16] rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer">
                    <div>
                      <p className="text-xs font-bold text-white">Weekly relationship &amp; leads digest</p>
                      <p className="text-[10px] text-gray-400 font-mono">Summary report sent every Monday morning.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.weeklyDigest}
                      onChange={(e) => setPreferences({ ...preferences, weeklyDigest: e.target.checked })}
                      className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 bg-[#090D16] rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer">
                    <div>
                      <p className="text-xs font-bold text-white">Instant inbound contact submission alerts</p>
                      <p className="text-[10px] text-gray-400 font-mono">Push alert whenever someone exchanges their details.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.inboundLeads}
                      onChange={(e) => setPreferences({ ...preferences, inboundLeads: e.target.checked })}
                      className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                    />
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => showNotification('Preferences saved!')}
                    className="h-10 px-4 bg-white hover:bg-gray-100 text-black font-mono text-xs font-black uppercase rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: DANGER ZONE (Section 20: Delete account) */}
          {activeTab === 'danger' && (
            <div className="bg-[#1c0d0d] rounded-xl border-3 border-red-600 p-6 sm:p-7 shadow-[6px_6px_0px_#ef4444] space-y-6">
              <div className="border-b-2 border-red-900/80 pb-4">
                <h3 className="text-xl font-black text-red-300 flex items-center gap-2">
                  <AlertTriangle size={20} className="text-red-500" />
                  <span>Danger Zone: Delete Account</span>
                </h3>
                <p className="text-xs text-red-200/80 font-mono mt-0.5">
                  Irreversible account termination and local storage purge.
                </p>
              </div>

              <div className="p-4 bg-red-950/80 rounded-xl border-2 border-red-700 text-xs text-red-100 space-y-2">
                <p className="font-bold">⚠️ Warning: This action cannot be reversed.</p>
                <p className="text-red-200/90 leading-relaxed font-medium">
                  Deleting your account will permanently wipe your digital business card configuration, 
                  all {86} saved relationship contacts, views analytics logs, and active session tokens 
                  from your device.
                </p>
              </div>

              <div className="space-y-3 max-w-md">
                <label className="text-xs font-mono font-bold uppercase text-red-300 block">
                  To confirm, type <span className="underline font-black text-white">DELETE</span> below:
                </label>
                <input
                  type="text"
                  placeholder="DELETE"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full h-11 bg-black border-2 border-red-600 rounded-lg px-3.5 text-xs font-mono font-black text-red-400 placeholder:text-red-900 focus:outline-none focus:border-red-400 shadow-[2px_2px_0px_#ef4444]"
                />

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                  className={`w-full h-12 font-mono text-xs font-black uppercase rounded-lg border-2 border-black transition-all flex items-center justify-center gap-2 ${
                    deleteConfirmText === 'DELETE'
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-[4px_4px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5'
                      : 'bg-red-950/60 text-red-500/50 border-red-900 cursor-not-allowed'
                  }`}
                >
                  <Trash2 size={16} />
                  <span>{isDeleting ? 'Deleting Account & Purging...' : 'Permanently Delete Account'}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Floating Success Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-cyan-400 text-black border-2 border-black px-5 py-2.5 rounded-lg text-xs font-mono font-black uppercase shadow-[4px_4px_0px_#000] flex items-center gap-2 animate-bounce">
          <Check size={16} className="stroke-[3]" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
