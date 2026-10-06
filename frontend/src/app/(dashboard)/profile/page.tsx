'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Calendar, Loader2, LogOut, CreditCard, ShieldCheck } from 'lucide-react';
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
      <div className="flex flex-col justify-center items-center h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-black border-t-[#2563EB] rounded-full animate-spin"></div>
        <p className="text-gray-300 text-xs font-mono uppercase font-bold tracking-wider">Loading profile info...</p>
      </div>
    );
  }

  const joinDate = new Date(profile?.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="max-w-3xl mx-auto space-y-7 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-[#0e1628] p-6 rounded-xl border-2 border-black shadow-[5px_5px_0px_#000]">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[10px] font-bold uppercase bg-cyan-400 text-black px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
            Workspace Profile
          </span>
          <span className="text-xs font-mono text-gray-400">Zero NFC Account</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Account Profile
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 font-medium">
          Manage your personal credentials, digital cards, and team associations.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-[#0e1628] rounded-xl border-3 border-black shadow-[8px_8px_0px_#000] overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-[#2563EB] border-b-2 border-black p-4 flex justify-between items-start">
          <span className="font-mono text-[10px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
            ADMIN USER
          </span>
        </div>

        <div className="px-6 pb-6">
          <div className="relative flex flex-col sm:flex-row sm:justify-between items-start sm:items-end -mt-10 mb-6 gap-4">
            <div className="w-20 h-20 rounded-xl bg-white border-2 border-black p-0.5 shadow-[3px_3px_0px_#000] overflow-hidden flex items-center justify-center text-black font-black text-2xl uppercase">
              {profile?.profilePhoto ? (
                <img src={profile.profilePhoto} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                profile?.name?.charAt(0) || 'A'
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link href="/settings" className="flex-1 sm:flex-none">
                <Button variant="secondary" size="sm" className="w-full text-xs uppercase font-black">
                  Settings
                </Button>
              </Link>
              <Button 
                variant="danger" 
                size="sm"
                onClick={handleLogout} 
                className="flex-1 sm:flex-none text-xs uppercase font-black flex items-center gap-1.5"
              >
                <LogOut size={13} />
                <span>Log Out</span>
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white">{profile?.name || 'Alex Morgan'}</h2>
              <p className="text-xs font-mono text-cyan-400 font-bold uppercase mt-0.5">
                SmartCard Team Lead • Zero NFC
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t-2 border-black font-mono text-xs">
              <div className="bg-[#121c33] p-4 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-blue-600 border border-black text-white flex items-center justify-center shrink-0">
                  <Mail size={16} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Email Address</span>
                  <span className="font-bold text-white truncate block">{profile?.email}</span>
                </div>
              </div>

              <div className="bg-[#121c33] p-4 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-emerald-500 border border-black text-black flex items-center justify-center shrink-0">
                  <Calendar size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Joined Platform</span>
                  <span className="font-bold text-white">{joinDate}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-cyan-950/40 border-2 border-cyan-500 rounded-lg text-xs font-mono space-y-1">
              <span className="font-bold text-cyan-400 block uppercase">Dummy Auth Session</span>
              <p className="text-gray-300">
                You are currently signed in with a local development session. You can create digital cards, 
                test QR codes, and export leads.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
