'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Menu, CreditCard, LayoutDashboard, Users, Settings, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
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
      <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-lg text-center max-w-sm space-y-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mx-auto text-white shadow-xs animate-pulse">
            <CreditCard size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Verifying Session</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Connecting to your SmartCard workspace...</p>
          </div>
          <div className="w-6 h-6 border-2 border-slate-200 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row relative overflow-x-hidden transition-colors">
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-white/80 dark:bg-[#0B0F17]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <CreditCard size={15} />
          </div>
          <span className="font-semibold text-base text-slate-900 dark:text-slate-100">SmartCard</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle compact showLabel={false} />
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#0B0F17]/90 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-4 py-2 flex items-center justify-around shadow-sm">
        <Link 
          href="/dashboard" 
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            pathname === '/dashboard' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard size={17} />
          <span>Overview</span>
        </Link>
        <Link 
          href="/cards" 
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            pathname === '/cards' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <CreditCard size={17} />
          <span>My Card</span>
        </Link>
        <Link 
          href="/analytics" 
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            pathname === '/analytics' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <TrendingUp size={17} />
          <span>Analytics</span>
        </Link>
        <Link 
          href="/contacts" 
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            pathname === '/contacts' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Users size={17} />
          <span>Contacts</span>
        </Link>
        <Link 
          href="/settings" 
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            pathname === '/settings' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Settings size={17} />
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );
}
