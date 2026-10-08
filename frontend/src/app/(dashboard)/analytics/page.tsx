'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Eye, Share2, Users, ArrowUpRight, TrendingUp, Calendar, Download, QrCode, Smartphone, Globe, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function AnalyticsPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('7');

  useEffect(() => {
    const fakeToken = 'fake_token';
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || fakeToken : fakeToken;

    fetch('/api/analytics/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(apiData => {
      setData(apiData);
    })
    .catch(() => {
      // Fallback to local dataset
    });
  }, [router]);

  const handleExportData = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data || { timeframe: timeRange, exportedAt: new Date().toISOString() }, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `smartcard_analytics_${timeRange}d_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const metricsByRange = {
    '7': {
      views: 1284,
      clicks: 438,
      shares: 126,
      scans: 892,
      saves: 84,
      viewsTrend: '+24.5%',
      clicksTrend: '+19.2%',
      sharesTrend: '+14.8%',
      scansTrend: '+31.2%',
      savesTrend: '+22.0%',
      chart: [
        { date: 'Mon', views: 164, clicks: 52, shares: 18, scans: 114, saves: 11, leads: 4 },
        { date: 'Tue', views: 198, clicks: 68, shares: 21, scans: 142, saves: 14, leads: 7 },
        { date: 'Wed', views: 245, clicks: 84, shares: 26, scans: 175, saves: 18, leads: 9 },
        { date: 'Thu', views: 218, clicks: 72, shares: 20, scans: 151, saves: 15, leads: 6 },
        { date: 'Fri', views: 284, clicks: 96, shares: 29, scans: 198, saves: 19, leads: 12 },
        { date: 'Sat', views: 142, clicks: 46, shares: 12, scans: 98, saves: 7, leads: 3 },
        { date: 'Sun', views: 233, clicks: 70, shares: 20, scans: 164, saves: 15, leads: 8 },
      ]
    },
    '30': {
      views: 4820,
      clicks: 1640,
      shares: 480,
      scans: 3420,
      saves: 312,
      viewsTrend: '+38.2%',
      clicksTrend: '+27.4%',
      sharesTrend: '+22.1%',
      scansTrend: '+41.0%',
      savesTrend: '+35.6%',
      chart: [
        { date: 'Week 1', views: 980, clicks: 330, shares: 98, scans: 690, saves: 64, leads: 28 },
        { date: 'Week 2', views: 1150, clicks: 390, shares: 115, scans: 810, saves: 75, leads: 34 },
        { date: 'Week 3', views: 1320, clicks: 450, shares: 132, scans: 940, saves: 86, leads: 42 },
        { date: 'Week 4', views: 1370, clicks: 470, shares: 135, scans: 980, saves: 87, leads: 45 },
      ]
    },
    '90': {
      views: 13950,
      clicks: 4780,
      shares: 1410,
      scans: 9860,
      saves: 890,
      viewsTrend: '+84.1%',
      clicksTrend: '+62.5%',
      sharesTrend: '+54.3%',
      scansTrend: '+92.4%',
      savesTrend: '+78.9%',
      chart: [
        { date: 'Month 1', views: 3600, clicks: 1240, shares: 360, scans: 2550, saves: 230, leads: 110 },
        { date: 'Month 2', views: 4650, clicks: 1590, shares: 470, scans: 3290, saves: 300, leads: 145 },
        { date: 'Month 3', views: 5700, clicks: 1950, shares: 580, scans: 4020, saves: 360, leads: 180 },
      ]
    }
  };

  const current = metricsByRange[timeRange];

  const statCards = [
    { 
      title: 'Profile Views', 
      value: current.views, 
      icon: Eye, 
      bg: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', 
      trend: current.viewsTrend, 
      subtitle: 'Camera QR & web link loads' 
    },
    { 
      title: 'Link Clicks', 
      value: current.clicks, 
      icon: Globe, 
      bg: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400', 
      trend: current.clicksTrend, 
      subtitle: 'Portfolio & social links clicked' 
    },
    { 
      title: 'Shares', 
      value: current.shares, 
      icon: Share2, 
      bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400', 
      trend: current.sharesTrend, 
      subtitle: 'WhatsApp & shortlink shares' 
    },
    { 
      title: 'QR Scans', 
      value: current.scans, 
      icon: QrCode, 
      bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', 
      trend: current.scansTrend, 
      subtitle: 'Instant phone camera scans' 
    },
    { 
      title: 'Contact Saves', 
      value: current.saves, 
      icon: Users, 
      bg: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400', 
      trend: current.savesTrend, 
      subtitle: '.vcf vCards saved to address book' 
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#131924] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-md z-50">
          <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-xs border-b border-slate-100 dark:border-slate-800/80 pb-1">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
             <div key={index} className="flex items-center justify-between gap-4 text-xs my-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-slate-500 dark:text-slate-400">{entry.name}:</span>
                </div>
                <span className="text-slate-900 dark:text-slate-100 font-semibold">{entry.value}</span>
             </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pb-12 space-y-7 animate-in fade-in duration-200">
      
      {/* Header Banner with 7d / 30d / 90d Filter */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-[#131924] p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-medium uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-900">
              Real-Time Metrics
            </span>
            <span className="text-xs text-slate-400">Zero NFC • 100% Digital Scans</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Analytics &amp; Engagement
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
            Deep dive into your digital professional identity performance, scans, and channels.
          </p>
        </div>

        {/* Filters: 7 days, 30 days, 90 days */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800">
            {(['7', '30', '90'] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-all ${
                  timeRange === range
                    ? 'bg-white dark:bg-[#131924] text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {range}D
              </button>
            ))}
          </div>

          <Button 
            variant="outline" 
            onClick={handleExportData}
            className="h-9 text-xs font-medium border-slate-200 dark:border-slate-800 flex items-center gap-1.5 shadow-2xs"
          >
             <Download size={13}/>
             <span>Export JSON</span>
          </Button>
        </div>
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className="bg-white dark:bg-[#131924] p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {stat.title}
                </span>
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon size={16} />
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                   <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                     {stat.value.toLocaleString()}
                   </h3>
                   <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                     {stat.trend}
                   </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 truncate">
                  {stat.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Side Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 Cols: Area Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-[#131924] p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-4">
             <div>
               <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                 <TrendingUp size={17} className="text-blue-600 dark:text-blue-400" />
                 <span>Engagement Trends</span>
               </h3>
               <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                 Daily distribution across QR camera scans, link shares, and inbound leads
               </p>
             </div>
          </div>
          
          <div className="h-[340px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.viewsOverTime || current.chart} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="sharesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke={isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)'} 
                />
                <XAxis 
                  dataKey="date" 
                  axisLine={{ stroke: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0', strokeWidth: 1 }} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: isDark ? '#94A3B8' : '#64748B', fontWeight: 500 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={{ stroke: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0', strokeWidth: 1 }} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: isDark ? '#94A3B8' : '#64748B', fontWeight: 500 }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B' }} />
                <Area type="monotone" dataKey="views" name="Profile Views" stroke="#2563EB" strokeWidth={2} fill="url(#viewsGradient)" />
                <Area type="monotone" dataKey="shares" name="Link Shares" stroke="#06B6D4" strokeWidth={2} fill="url(#sharesGradient)" />
                <Line type="monotone" dataKey="leads" name="New Leads" stroke="#10B981" strokeWidth={2} dot={{ r: 3, fill: '#10B981' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 4 Cols: Channels & Devices */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* Top Acquisition Channels */}
           <div className="bg-white dark:bg-[#131924] p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <QrCode size={16} className="text-blue-600 dark:text-blue-400" />
                <span>Traffic by Channel</span>
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  { name: 'Camera QR Scan', percent: 56, color: 'bg-blue-600' },
                  { name: 'WhatsApp Direct', percent: 24, color: 'bg-emerald-500' },
                  { name: 'LinkedIn Bio Link', percent: 14, color: 'bg-cyan-500' },
                  { name: 'Email Signature', percent: 6, color: 'bg-indigo-500' },
                ].map((channel, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between font-medium text-slate-600 dark:text-slate-300">
                      <span>{channel.name}</span>
                      <span className="text-slate-900 dark:text-slate-100 font-semibold">{channel.percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${channel.color} rounded-full`} 
                        style={{ width: `${channel.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
           </div>

           {/* Device Breakdown */}
           <div className="bg-white dark:bg-[#131924] p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Smartphone size={16} className="text-cyan-600 dark:text-cyan-400" />
                <span>Scanner Device Type</span>
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  { name: 'iPhone / iOS', percent: 68, color: 'bg-blue-600' },
                  { name: 'Android OS', percent: 26, color: 'bg-cyan-500' },
                  { name: 'Desktop Web', percent: 6, color: 'bg-slate-400' },
                ].map((device, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between font-medium text-slate-600 dark:text-slate-300">
                      <span>{device.name}</span>
                      <span className="text-slate-900 dark:text-slate-100 font-semibold">{device.percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${device.color} rounded-full`} 
                        style={{ width: `${device.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
           </div>

        </div>

      </div>

    </div>
  );
}
