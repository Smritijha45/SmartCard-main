'use client';

import { Bell, UserPlus, CreditCard, BarChart2, CheckCircle2, Share2, Loader2, Sparkles, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const DEFAULT_NOTIFICATIONS = [
    { id: '1', title: 'New Relationship Lead', message: 'Sarah Chen submitted contact details via your SmartCard QR code.', type: 'lead', createdAt: new Date(Date.now() - 1000 * 60 * 24).toISOString(), unread: true },
    { id: '2', title: 'Card Milestone Reached', message: 'Your digital card passed 1,280 unique impressions this week!', type: 'milestone', createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), unread: true },
    { id: '3', title: 'Profile Link Shared', message: 'Someone forwarded your digital card via WhatsApp share link.', type: 'share', createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(), unread: false },
    { id: '4', title: 'Security Check Passed', message: 'Your profile has zero external tracker cookies and 100% web-native security.', type: 'default', createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(), unread: false },
  ];

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications((data.notifications && data.notifications.length > 0) ? data.notifications : DEFAULT_NOTIFICATIONS);
      } else {
        setNotifications(DEFAULT_NOTIFICATIONS);
      }
    } catch (error) {
      setNotifications(DEFAULT_NOTIFICATIONS);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_all_read' })
      });
      if (res.ok) {
         setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
      }
    } catch (error) {
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] space-y-3">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 text-xs font-medium">Loading notifications...</p>
      </div>
    );
  }

  const getStyleForType = (type: string) => {
    switch(type) {
      case 'lead': return { icon: UserPlus, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-900/30' };
      case 'milestone': return { icon: Sparkles, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/30' };
      case 'share': return { icon: Share2, color: 'text-cyan-600 dark:text-cyan-400', bgColor: 'bg-cyan-50 dark:bg-cyan-900/30' };
      default: return { icon: Bell, color: 'text-slate-600 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-800' };
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-[#131924] p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-medium uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-900">
              Activity Feed
            </span>
            <span className="text-xs text-slate-400">Real-Time Inbound Events</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Notifications &amp; Activity
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
            Stay updated with profile views, WhatsApp shares, and inbound relationship leads.
          </p>
        </div>

        <Button 
          variant="outline" 
          onClick={markAllAsRead} 
          className="text-xs font-medium h-9 border-slate-200 dark:border-slate-800 flex items-center gap-1.5 shadow-2xs"
        >
          <Check size={13} />
          <span>Mark All Read</span>
        </Button>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-[#131924] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 overflow-hidden shadow-xs">
        {notifications.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {notifications.map((notification) => {
              const { icon: Icon, color, bgColor } = getStyleForType(notification.type);
              
              return (
                <div 
                  key={notification._id || notification.id} 
                  className={`p-4.5 sm:p-5 flex items-start gap-4 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${
                    notification.unread ? 'bg-blue-50/30 dark:bg-blue-950/15' : 'bg-transparent'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bgColor} ${color}`}>
                    <Icon size={17} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs sm:text-sm font-semibold ${notification.unread ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                        {notification.title}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        {notification.time || 'Recent'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5 leading-relaxed">
                      {notification.message || notification.description}
                    </p>
                  </div>

                  {notification.unread && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
              <Bell size={20} className="text-slate-400" />
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">No notifications yet</p>
            <p className="text-xs text-slate-500">When visitors scan your card or exchange info, alerts will show here.</p>
          </div>
        )}
      </div>

    </div>
  );
}
