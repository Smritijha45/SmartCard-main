'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Calendar, Loader2, LogOut, CreditCard, ShieldCheck, ArrowRight, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/auth/me', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const user = await res.json();
        if (user?.id) {
          setProfile({
            name: user.name || 'Alex Morgan',
            email: user.email || 'alex.morgan@smartcard.id',
            profilePhoto: user.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
            createdAt: user.createdAt || new Date().toISOString()
          });
        } else {
          const stored = localStorage.getItem('smartcard_user');
          if (stored) {
            const parsed = JSON.parse(stored);
            setProfile({
              name: parsed.name || 'Alex Morgan',
              email: parsed.email || 'alex.morgan@smartcard.id',
              profilePhoto: parsed.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
              createdAt: new Date().toISOString()
            });
          }
        }
      } catch (error) {
        const stored = localStorage.getItem('smartcard_user');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setProfile({
              name: parsed.name || 'Alex Morgan',
              email: parsed.email || 'alex.morgan@smartcard.id',
              profilePhoto: parsed.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
              createdAt: new Date().toISOString()
            });
          } catch (e) {}
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    localStorage.removeItem('smartcard_authenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('smartcard_user');
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] space-y-3">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 text-xs font-medium">Loading profile...</p>
      </div>
    );
  }

  const joinDate = new Date(profile?.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#131924] p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-medium uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-900">
            Workspace Profile
          </span>
          <span className="text-xs text-slate-400">Zero NFC Account</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Account Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
          Manage your personal credentials, digital cards, and team associations.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white dark:bg-[#131924] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xs overflow-hidden">
        
        {/* Subtle Accent Banner */}
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-start text-white">
          <span className="text-[10px] font-medium uppercase tracking-wider bg-black/25 px-2 py-0.5 rounded backdrop-blur-xs">
            ADMIN USER
          </span>
          <span className="text-[10px] font-medium uppercase bg-white/20 px-2 py-0.5 rounded backdrop-blur-xs">
            PRO TIER
          </span>
        </div>

        <div className="px-6 pb-6">
          <div className="relative flex flex-col sm:flex-row sm:justify-between items-start sm:items-end -mt-10 mb-6 gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-[#131924] p-1 border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden flex items-center justify-center font-bold text-slate-900 dark:text-slate-100 text-2xl uppercase">
              {profile?.profilePhoto ? (
                <img src={profile.profilePhoto} alt={profile.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                profile?.name?.charAt(0) || 'A'
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Link href="/settings" className="flex-1 sm:flex-none">
                <Button variant="outline" size="sm" className="w-full text-xs font-medium border-slate-200 dark:border-slate-800 flex items-center gap-1.5 shadow-2xs">
                  <Settings size={13} />
                  <span>Settings</span>
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout} 
                className="flex-1 sm:flex-none text-xs font-medium text-red-600 dark:text-red-400 border-red-200/80 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1.5 shadow-2xs"
              >
                <LogOut size={13} />
                <span>Log Out</span>
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{profile?.name || 'Alex Morgan'}</h2>
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                SmartCard Team Lead • Zero NFC
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Mail size={15} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">Email Address</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100 truncate block">{profile?.email}</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Calendar size={15} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">Joined Platform</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{joinDate}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 rounded-xl text-xs space-y-1">
              <span className="font-semibold text-blue-700 dark:text-blue-300 block">Active Workspace Session</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                You are currently signed in with full administrative privileges. You can publish digital business cards, view scan telemetry, and export CRM leads.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
