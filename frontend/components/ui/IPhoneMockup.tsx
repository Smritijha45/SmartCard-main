'use client';

import React from 'react';
import { Wifi, Battery } from 'lucide-react';

interface IPhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  screenClassName?: string;
  themeColor?: string;
}

export function IPhoneMockup({ 
  children, 
  className = '', 
  screenClassName = '', 
}: IPhoneMockupProps) {
  return (
    <div className={`relative mx-auto w-full max-w-[310px] h-[590px] bg-slate-950/90 dark:bg-slate-900 rounded-[2.75rem] p-2.5 shadow-2xl border border-slate-800/80 dark:border-slate-700/60 select-none ${className}`}>
      {/* Subtle outer bezel rim */}
      <div className="absolute inset-0 rounded-[2.75rem] ring-1 ring-white/10 pointer-events-none"></div>

      {/* Dynamic Island */}
      <div className="w-24 h-5.5 bg-black rounded-full absolute top-4.5 left-1/2 transform -translate-x-1/2 z-40 flex items-center justify-between px-3">
        <div className="w-2 h-2 rounded-full bg-slate-900"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
      </div>

      {/* Screen Frame */}
      <div className={`w-full h-full bg-[#0B0F17] dark:bg-[#0B0F17] rounded-[2.25rem] overflow-hidden pt-9 pb-3.5 px-3 flex flex-col relative border border-white/5 ${screenClassName}`}>
        
        {/* iOS Status Bar */}
        <div className="absolute top-2 left-0 right-0 px-6 flex justify-between items-center text-[10px] font-medium text-slate-300 z-30 select-none pointer-events-none">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Wifi size={11} className="text-slate-300" />
            <Battery size={13} className="text-slate-300" />
          </div>
        </div>

        {/* Scrollable Viewport Content */}
        <div className="flex-1 overflow-y-auto iphone-viewport pr-0.5 space-y-3.5">
          {children}
        </div>

        {/* iOS Home Indicator Bar */}
        <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-white/20 rounded-full z-30 pointer-events-none"></div>
      </div>
      
      {/* Scrollbar Custom Webkit Styling */}
      <style jsx global>{`
        .iphone-viewport::-webkit-scrollbar {
          width: 4px !important;
        }
        .iphone-viewport::-webkit-scrollbar-track {
          background: transparent !important;
        }
        .iphone-viewport::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.2) !important;
          border-radius: 99px !important;
        }
      `}</style>
    </div>
  );
}
