'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Menu, CreditCard, ShieldAlert, LayoutDashboard, Users, Settings } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = localStorage.getItem('smartcard_authenticated');
      if (isAuth !== 'true') {
        router.replace('/login');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#090D16] text-white flex flex-col items-center justify-center p-4 bg-neo-dots">
        <div className="bg-[#0e1628] border-3 border-black p-8 rounded-xl shadow-[6px_6px_0px_#000] text-center max-w-sm space-y-4">
          <div className="w-12 h-12 bg-blue-600 border-2 border-black rounded-lg flex items-center justify-center mx-auto text-white shadow-[2px_2px_0px_#000] animate-pulse">
            <CreditCard size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight">Authenticating Session</h3>
            <p className="text-xs text-gray-400 font-mono mt-1">Verifying SmartCard credentials...</p>
          </div>
          <div className="w-8 h-8 border-3 border-black border-t-cyan-400 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090D16] text-gray-100 flex flex-col md:flex-row relative bg-neo-dots overflow-x-hidden">
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0c1322] border-b-2 border-black px-4 py-3 flex items-center justify-between shadow-[0_2px_0_0_#000]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] border-2 border-black flex items-center justify-center font-black text-white shadow-[2px_2px_0px_#000]">
            <CreditCard size={16} />
          </div>
          <span className="font-black text-lg text-white">SmartCard</span>
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase bg-black px-1.5 py-0.2 rounded border border-white/20">Pro</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle compact showLabel={false} />
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 bg-[#17223b] hover:bg-slate-700 text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Sidebar Component (Desktop Permanent + Mobile Drawer) */}
      <Sidebar 
        mobileOpen={mobileSidebarOpen} 
        onMobileClose={() => setMobileSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 relative z-10 max-w-[1300px]">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar (Section 22) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c1322] border-t-2 border-black px-2 py-2 flex items-center justify-around shadow-[0_-2px_0_0_#000]">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 font-mono text-[9px] font-bold uppercase text-gray-300 hover:text-cyan-400">
          <LayoutDashboard size={18} />
          <span>Home</span>
        </Link>
        <Link href="/cards" className="flex flex-col items-center gap-1 font-mono text-[9px] font-bold uppercase text-gray-300 hover:text-cyan-400">
          <CreditCard size={18} />
          <span>My Card</span>
        </Link>
        <Link href="/contacts" className="flex flex-col items-center gap-1 font-mono text-[9px] font-bold uppercase text-gray-300 hover:text-cyan-400">
          <Users size={18} />
          <span>Contacts</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1 font-mono text-[9px] font-bold uppercase text-gray-300 hover:text-cyan-400">
          <Settings size={18} />
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );
}
