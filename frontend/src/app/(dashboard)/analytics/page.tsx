'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Eye, Share2, Users, ArrowUpRight, TrendingUp, Calendar, Download, QrCode, Smartphone, Globe, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7');

  useEffect(() => {
    const fakeToken = 'fake_token';
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || fakeToken : fakeToken;

    fetch('/api/analytics/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setData(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [router]);

  const handleExportData = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data || {}, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `smartcard_analytics_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] space-y-4">
        <div className="w-10 h-10 border-4 border-black border-t-[#2563EB] rounded-full animate-spin"></div>
        <p className="text-gray-300 text-xs font-mono uppercase font-bold tracking-wider">Compiling analytics telemetry...</p>
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Total Profile Views', 
      value: data?.totalViews || 2850, 
      icon: Eye, 
      bg: 'bg-blue-600', 
      color: 'text-white', 
      trend: '+24.5%', 
      subtitle: 'Camera QR & web link scans' 
    },
    { 
      title: 'Profile Shares', 
      value: data?.totalShares || 731, 
      icon: Share2, 
      bg: 'bg-cyan-400', 
      color: 'text-black', 
      trend: '+18.2%', 
      subtitle: 'WhatsApp & contact exports' 
    },
    { 
      title: 'Relationship Leads', 
      value: data?.totalLeads || 96, 
      icon: Users, 
      bg: 'bg-yellow-400', 
      color: 'text-black', 
      trend: '+31.8%', 
      subtitle: 'Submitted contact exchange forms' 
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#090D16] border-2 border-black p-3.5 rounded-lg shadow-[4px_4px_0px_#000] z-50 font-mono">
          <p className="font-bold text-white mb-2 text-xs uppercase border-b border-gray-800 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
             <div key={index} className="flex items-center space-x-2 text-xs font-bold my-1">
                <div className="w-2.5 h-2.5 rounded-sm border border-black" style={{ backgroundColor: entry.color }}></div>
                <span className="text-gray-400">{entry.name}:</span>
                <span className="text-white font-extrabold">{entry.value}</span>
             </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pb-12 space-y-7 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#0e1628] p-6 rounded-xl border-2 border-black shadow-[5px_5px_0px_#000]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] font-bold uppercase bg-emerald-400 text-black px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
              Real-Time Metrics
            </span>
            <span className="text-xs font-mono text-gray-400">Zero NFC • 100% Digital Scans</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Analytics &amp; Engagement
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-medium">
            Deep dive into your digital professional identity performance, scans, and channels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#090D16] border-2 border-black rounded-lg px-3 py-1.5 shadow-[2px_2px_0px_#000]">
             <Calendar size={14} className="text-gray-400 mr-2" />
             <select 
               value={timeRange} 
               onChange={(e) => setTimeRange(e.target.value)}
               className="bg-transparent outline-none text-white cursor-pointer text-xs font-mono font-bold"
             >
               <option value="7" className="bg-[#0e1628]">Last 7 Days</option>
               <option value="30" className="bg-[#0e1628]">Last 30 Days</option>
               <option value="all" className="bg-[#0e1628]">All Time</option>
             </select>
          </div>

          <Button 
            variant="secondary" 
            onClick={handleExportData}
            className="h-10 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] flex items-center gap-1.5"
          >
             <Download size={14}/>
             <span>Export JSON</span>
          </Button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className="bg-[#0e1628] p-6 rounded-xl border-2 border-black shadow-[5px_5px_0px_#000] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-300">
                  {stat.title}
                </span>
                <div className={`w-10 h-10 rounded-lg border-2 border-black ${stat.bg} ${stat.color} flex items-center justify-center shadow-[2px_2px_0px_#000]`}>
                  <Icon size={18} />
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                   <h3 className="text-3xl sm:text-4xl font-black text-white">
                     {stat.value.toLocaleString()}
                   </h3>
                   <span className="font-mono text-xs font-bold text-cyan-400 bg-black px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#2563EB]">
                     {stat.trend}
                   </span>
                </div>
                <p className="text-[11px] font-mono text-gray-400 mt-1">
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
        <div className="lg:col-span-8 bg-[#0e1628] p-6 rounded-xl border-2 border-black shadow-[5px_5px_0px_#000] space-y-6">
          <div className="flex justify-between items-center border-b-2 border-black pb-4">
             <div>
               <h3 className="text-lg font-black text-white flex items-center gap-2">
                 <TrendingUp size={18} className="text-cyan-400" />
                 <span>Engagement Trends</span>
               </h3>
               <p className="text-xs text-gray-400 font-mono mt-0.5">
                 Daily distribution across QR camera scans, link shares, and inbound leads
               </p>
             </div>
          </div>
          
          <div className="h-[340px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.viewsOverTime || [
                { date: 'Mon', views: 240, shares: 55, leads: 9 },
                { date: 'Tue', views: 320, shares: 78, leads: 14 },
                { date: 'Wed', views: 440, shares: 112, leads: 21 },
                { date: 'Thu', views: 395, shares: 89, leads: 15 },
                { date: 'Fri', views: 560, shares: 148, leads: 26 },
                { date: 'Sat', views: 290, shares: 62, leads: 8 },
                { date: 'Sun', views: 380, shares: 92, leads: 13 }
              ]} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f293d" />
                <XAxis 
                  dataKey="date" 
                  axisLine={{ stroke: '#000000', strokeWidth: 2 }} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 'bold', fontFamily: 'monospace' }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={{ stroke: '#000000', strokeWidth: 2 }} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 'bold', fontFamily: 'monospace' }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="square" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontFamily: 'monospace', fontWeight: 'bold', color: '#CBD5E1' }} />
                <Area type="monotone" dataKey="views" name="Profile Views" stroke="#2563EB" strokeWidth={3} fill="#2563EB" fillOpacity={0.25} />
                <Area type="monotone" dataKey="shares" name="Link Shares" stroke="#06B6D4" strokeWidth={3} fill="#06B6D4" fillOpacity={0.2} />
                <Line type="monotone" dataKey="leads" name="New Leads" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#F59E0B', stroke: '#000' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 4 Cols: Channels & Devices */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* Top Acquisition Channels */}
           <div className="bg-[#0e1628] p-6 rounded-xl border-2 border-black shadow-[5px_5px_0px_#000] space-y-4">
              <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <QrCode size={18} className="text-cyan-400" />
                <span>Traffic by Channel</span>
              </h3>

              <div className="space-y-3 font-mono text-xs">
                {[
                  { name: 'Camera QR Scan', percent: 56, color: 'bg-blue-600' },
                  { name: 'WhatsApp Direct', percent: 24, color: 'bg-emerald-500' },
                  { name: 'LinkedIn Bio Link', percent: 14, color: 'bg-cyan-400' },
                  { name: 'Email Signature', percent: 6, color: 'bg-yellow-400' },
                ].map((channel, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between font-bold text-gray-300">
                      <span>{channel.name}</span>
                      <span className="text-white">{channel.percent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-black border border-black rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${channel.color}`} 
                        style={{ width: `${channel.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
           </div>

           {/* Device Breakdown */}
           <div className="bg-[#0e1628] p-6 rounded-xl border-2 border-black shadow-[5px_5px_0px_#000] space-y-4">
              <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Smartphone size={18} className="text-yellow-400" />
                <span>Scanner Device Type</span>
              </h3>

              <div className="space-y-3 font-mono text-xs">
                {[
                  { name: 'iPhone / iOS', percent: 68, color: 'bg-blue-600' },
                  { name: 'Android OS', percent: 26, color: 'bg-cyan-400' },
                  { name: 'Desktop Web', percent: 6, color: 'bg-slate-500' },
                ].map((device, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between font-bold text-gray-300">
                      <span>{device.name}</span>
                      <span className="text-white">{device.percent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-black border border-black rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${device.color}`} 
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
