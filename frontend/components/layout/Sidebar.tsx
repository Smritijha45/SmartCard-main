'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  CreditCard, LayoutDashboard, TrendingUp, Users, Settings, 
  LogOut, Menu, X, Sparkles, ExternalLink 
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
    <div className="h-full flex flex-col justify-between p-5 bg-[#0c1322] border-r-3 border-black shadow-[4px_0_0_0_#000000]">
      {/* Top: Logo & Navigation */}
      <div className="space-y-6">
        
        {/* Brand Logo */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-[#2563EB] border-2 border-black flex items-center justify-center font-black text-white shadow-[2px_2px_0px_#000] group-hover:-translate-y-0.5 transition-transform">
              <CreditCard size={18} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-white tracking-tight leading-none">
                SmartCard
              </span>
              <span className="text-[9px] font-mono font-bold tracking-wider text-cyan-400 uppercase mt-0.5">
                Pro Workspace
              </span>
            </div>
          </Link>

          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="md:hidden p-1.5 bg-[#17223b] text-gray-300 rounded-lg border-2 border-black"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Global Theme Switcher Widget */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#10182c] border-2 border-black shadow-[2px_2px_0px_#000]">
          <span className="text-[10px] font-mono font-bold uppercase text-gray-400 pl-1.5">Theme Mode</span>
          <ThemeToggle />
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onMobileClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 transition-all font-mono font-bold text-xs uppercase cursor-pointer ${
                  isActive
                    ? 'bg-[#2563EB] text-white border-black shadow-[3px_3px_0px_#000000] -translate-y-0.5'
                    : 'text-gray-300 hover:text-white hover:bg-slate-800/80 border-transparent hover:border-black'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isActive ? 'text-white' : 'text-gray-400'} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-black border border-black ${
                    isActive ? 'bg-cyan-400 text-black' : 'bg-emerald-400 text-black'
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
      <div className="pt-5 border-t-2 border-black space-y-3">
        
        {/* User Profile Card */}
        <Link 
          href="/profile"
          onClick={onMobileClose}
          className="flex items-center gap-3 p-2.5 bg-[#10182c] hover:bg-[#14203a] rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] transition-colors"
        >
          <div className="w-10 h-10 rounded-lg border-2 border-black bg-white overflow-hidden shadow-[1px_1px_0px_#000] shrink-0">
            <img 
              src={userAvatar} 
              alt={userName} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="truncate flex-1">
            <div className="text-xs font-black text-white truncate leading-tight">
              {userName}
            </div>
            <div className="text-[10px] font-mono text-cyan-400 font-bold truncate">
              {userRole}
            </div>
            <div className="text-[9px] font-mono text-emerald-400 font-extrabold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live • Zero NFC
            </div>
          </div>
        </Link>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full h-10 px-3.5 bg-red-950/60 hover:bg-red-900/80 text-red-200 hover:text-white font-mono font-bold text-xs uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>

      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:block w-64 shrink-0 min-h-screen sticky top-0 self-start z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-xs flex">
          <div className="w-72 max-w-[80vw] h-full">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={onMobileClose} />
        </div>
      )}
    </>
  );
}
