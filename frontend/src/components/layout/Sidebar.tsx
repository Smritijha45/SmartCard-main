'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  CreditCard,
  LayoutDashboard,
  Users,
  TrendingUp,
  Settings,
  Sparkles,
  Building2,
  LogOut,
  X,
  Shield,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { PlanSwitcherModal } from '../PlanSwitcherModal';

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('smartcard_authenticated');
    }
    router.push('/login');
  };

  const plan = user?.subscriptionPlan || 'professional';
  const planName = plan === 'starter' ? 'Starter' : plan === 'professional' ? 'Professional' : 'Team & Enterprise';

  const navItems = [
    {
      label: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard' || pathname === '/dashboard/analytics',
    },
    {
      label: 'Digital Cards',
      href: '/cards',
      icon: CreditCard,
      active: pathname.startsWith('/cards') || pathname === '/dashboard/my-card',
    },
    {
      label: 'CRM Leads',
      href: '/leads',
      icon: Users,
      badge: plan === 'starter' ? 'Pro' : undefined,
      active: pathname.startsWith('/leads') || pathname === '/contacts' || pathname === '/dashboard/contacts',
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: TrendingUp,
      active: pathname === '/analytics',
    },
    {
      label: 'Team Workspace',
      href: '/team',
      icon: Building2,
      badge: plan !== 'enterprise' ? 'Team' : undefined,
      active: pathname.startsWith('/team'),
    },
    {
      label: 'Settings & Enterprise',
      href: '/settings',
      icon: Settings,
      active: pathname.startsWith('/settings') || pathname === '/dashboard/settings',
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#0B0F17] border-r border-slate-200/80 dark:border-slate-800/80 w-64 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <CreditCard size={18} />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100 block">
              SmartCard
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Identity Platform
            </span>
          </div>
        </Link>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Plan Pill & Quick Switcher */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            plan === 'enterprise' ? 'bg-purple-500 animate-pulse' : plan === 'professional' ? 'bg-blue-500' : 'bg-slate-400'
          }`} />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {planName}
          </span>
        </div>
        <button
          onClick={() => setIsPlanModalOpen(true)}
          className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
        >
          <span>Upgrade</span>
          <ChevronRight size={12} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (onMobileClose) onMobileClose();
              }}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                item.active
                  ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={17} className={item.active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-400'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-md ${
                  item.active
                    ? 'bg-white/20 text-white'
                    : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Plan Promo Banner (if on Starter) */}
      {plan === 'starter' && (
        <div className="mx-3 my-2 p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-100 mb-1">
            <Sparkles size={14} className="text-yellow-300" />
            <span>Unlock Pro Power</span>
          </div>
          <p className="text-[11px] text-blue-100/90 leading-tight mb-3">
            Get 10 cards, inbound CRM lead capture, & scan analytics for ₹199/mo.
          </p>
          <button
            onClick={() => setIsPlanModalOpen(true)}
            className="w-full py-1.5 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-xs transition-colors text-center"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      {/* User Footer & Theme Controls */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 border border-slate-300 dark:border-slate-600">
              {user?.profilePhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {user?.name || 'Smriti Jha'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.role || 'Full Stack Developer'}
              </p>
            </div>
          </div>
          <ThemeToggle compact showLabel={false} />
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut size={14} />
          <span>Log Out</span>
        </button>
      </div>

      {/* Plan Switcher Modal */}
      <PlanSwitcherModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        currentPlan={plan}
        onPlanChanged={(newPlan) => {
          setUser((prev: any) => ({ ...prev, subscriptionPlan: newPlan }));
          fetchUserData();
        }}
      />
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:block shrink-0 sticky top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onMobileClose}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
export default Sidebar;
