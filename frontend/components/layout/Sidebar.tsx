'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  CreditCard, LayoutDashboard, TrendingUp, Users, Settings, 
  LogOut, X, Sparkles, ChevronRight
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Smriti Jha');
  const [userRole, setUserRole] = useState('Full Stack Developer');
  const [userAvatar, setUserAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('smartcard_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name) setUserName(parsed.name);
          if (parsed.role) setUserRole(parsed.role);
          if (parsed.avatar) setUserAvatar(parsed.avatar);
        } catch (e) {
          console.error(e);
        }
      }

      const storedCard = localStorage.getItem('smartcard_current_card');
      if (storedCard) {
        try {
          const card = JSON.parse(storedCard);
          if (card.name) setUserName(card.name);
          if (card.role) setUserRole(card.role);
          if (card.profileImage) setUserAvatar(card.profileImage);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('smartcard_authenticated');
      localStorage.removeItem('token');
      localStorage.removeItem('smartcard_user');
    }
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My SmartCard', href: '/cards', icon: CreditCard },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
    { name: 'Contacts', href: '/contacts', icon: Users, badge: '86' },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 bg-white dark:bg-[#0E131F] border-r border-slate-200/80 dark:border-slate-800/80 transition-colors">
      {/* Top: Logo & Navigation */}
      <div className="space-y-5">
        
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-2 pt-1">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
              <CreditCard size={16} className="text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base text-slate-900 dark:text-slate-100 tracking-tight">
                SmartCard
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                Workspace
              </span>
            </div>
          </Link>

          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="md:hidden p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Global Theme Switcher Widget */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/60">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Theme</span>
          <ThemeToggle compact={false} />
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onMobileClose}
                className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all text-xs font-medium cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                    isActive 
                      ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: User Profile & Logout */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
        
        {/* User Profile Card */}
        <Link 
          href="/profile"
          onClick={onMobileClose}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors group"
        >
          <div className="w-9 h-9 rounded-full ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden shrink-0">
            <img 
              src={userAvatar} 
              alt={userName} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="truncate flex-1">
            <div className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
              {userName}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {userRole}
            </div>
          </div>
          <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
        </Link>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full h-8.5 px-3 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut size={14} />
          <span>Log out</span>
        </button>

      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:block w-60 shrink-0 min-h-screen sticky top-0 self-start z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/40 backdrop-blur-xs flex">
          <div className="w-68 max-w-[80vw] h-full shadow-2xl">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={onMobileClose} />
        </div>
      )}
    </>
  );
}
