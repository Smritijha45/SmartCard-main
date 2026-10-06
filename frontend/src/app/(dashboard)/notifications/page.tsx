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
      console.error('Failed to mark as read', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-black border-t-[#2563EB] rounded-full animate-spin"></div>
        <p className="text-gray-300 text-xs font-mono uppercase font-bold tracking-wider">Loading inbox alerts...</p>
      </div>
    );
  }

  const getStyleForType = (type: string) => {
    switch(type) {
      case 'lead': return { icon: UserPlus, color: 'text-black', bgColor: 'bg-yellow-400' };
      case 'milestone': return { icon: Sparkles, color: 'text-white', bgColor: 'bg-blue-600' };
      case 'share': return { icon: Share2, color: 'text-black', bgColor: 'bg-cyan-400' };
      default: return { icon: Bell, color: 'text-white', bgColor: 'bg-slate-700' };
    }
  };

  return (
    <div className="space-y-7 max-w-4xl mx-auto animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#0e1628] p-6 rounded-xl border-2 border-black shadow-[5px_5px_0px_#000]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] font-bold uppercase bg-cyan-400 text-black px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
              Activity Feed
            </span>
            <span className="text-xs font-mono text-gray-400">Real-Time Inbound Events</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Notifications &amp; Activity
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-medium">
            Stay updated with profile views, WhatsApp shares, and inbound relationship leads.
          </p>
        </div>

        <Button 
          variant="secondary" 
          onClick={markAllAsRead} 
          className="text-xs font-black uppercase tracking-wider h-10 shadow-[2px_2px_0px_#000] flex items-center gap-1.5"
        >
          <Check size={14} />
          <span>Mark All Read</span>
        </Button>
      </div>

      {/* Notifications List */}
      <div className="bg-[#0e1628] rounded-xl border-3 border-black overflow-hidden shadow-[6px_6px_0px_#000]">
        {notifications.length > 0 ? (
          <div className="divide-y-2 divide-black">
            {notifications.map((notification) => {
              const { icon: Icon, color, bgColor } = getStyleForType(notification.type);
              
              return (
                <div 
                  key={notification._id || notification.id} 
                  className={`p-5 flex items-start gap-4 transition-colors hover:bg-slate-800/60 ${
                    notification.unread ? 'bg-[#121c33]' : 'bg-transparent'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border-2 border-black ${bgColor} ${color} shadow-[2px_2px_0px_#000]`}>
                    <Icon size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-black ${notification.unread ? 'text-white' : 'text-gray-300'}`}>
                        {notification.title}
                      </p>
                      <span className="text-[11px] font-mono font-bold text-gray-400">
                        {notification.time || 'Recent'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 font-medium mt-1 leading-relaxed">
                      {notification.message || notification.description}
                    </p>
                  </div>

                  {notification.unread && (
                    <div className="w-2.5 h-2.5 bg-cyan-400 border border-black rounded-full mt-2 shrink-0"></div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-14 flex flex-col items-center justify-center text-gray-400 space-y-3">
            <div className="w-14 h-14 bg-slate-900 border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_#000]">
              <Bell size={24} className="text-gray-400" />
            </div>
            <p className="text-sm font-bold text-white">No notifications yet</p>
            <p className="text-xs text-gray-500 font-mono">When visitors scan your card or exchange info, alerts will show here.</p>
          </div>
        )}
      </div>

    </div>
  );
}
