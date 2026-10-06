'use client';

import React from 'react';
import { Wifi, Battery } from 'lucide-react';

interface IPhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  screenClassName?: string;
  themeColor?: string;
}

export function IPhoneMockup({ children, className = '', screenClassName = '', themeColor = '#2563EB' }: IPhoneMockupProps) {
  return (
    <div className={`relative mx-auto w-full max-w-[310px] h-[580px] bg-zinc-950 rounded-[3rem] p-3 shadow-2xl border-4 border-zinc-800 shadow-blue-500/5 relative select-none ${className}`}>
      
      {/* Volume Buttons (Left Side) */}
      <div className="absolute left-[-6px] top-28 w-[2px] h-10 bg-zinc-700 rounded-l-md"></div>
      <div className="absolute left-[-6px] top-40 w-[2px] h-12 bg-zinc-700 rounded-l-md"></div>
      <div className="absolute left-[-6px] top-56 w-[2px] h-12 bg-zinc-700 rounded-l-md"></div>
      
      {/* Power Button (Right Side) */}
      <div className="absolute right-[-6px] top-36 w-[2px] h-16 bg-zinc-700 rounded-r-md"></div>

      {/* Dynamic Island Notch */}
      <div className="w-28 h-6 bg-black rounded-full absolute top-5 left-1/2 transform -translate-x-1/2 z-40 flex items-center justify-between px-3.5">
        <div className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-800/50"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-900/80"></div>
      </div>

      {/* Screen Frame */}
      <div className={`w-full h-full bg-[#0b1220] rounded-[2.5rem] overflow-hidden pt-10 pb-4 px-3 flex flex-col relative ${screenClassName}`}>
        
        {/* iOS Status Bar */}
        <div className="absolute top-2.5 left-0 right-0 px-6 flex justify-between items-center text-[10px] font-bold text-white z-30 select-none pointer-events-none">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3 text-white fill-current" viewBox="0 0 24 24">
              <path d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm0-16.5c-4.14 0-7.5 3.36-7.5 7.5s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5zm-3 7.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm6 0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z" />
            </svg>
            <Wifi size={11} />
            <Battery size={13} className="ml-0.5" />
          </div>
        </div>

        {/* Scrollable Viewport Content */}
        <div className="flex-1 overflow-y-auto iphone-viewport pr-0.5 space-y-4">
          {children}
        </div>

        {/* iOS Home Indicator Bar */}
        <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/35 rounded-full z-30 pointer-events-none"></div>
      </div>
      
      {/* Scrollbar Custom Webkit Styling */}
      <style jsx global>{`
        .iphone-viewport::-webkit-scrollbar {
          width: 5px !important;
        }
        .iphone-viewport::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02) !important;
          border-radius: 99px !important;
        }
        .iphone-viewport::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2) !important;
          border-radius: 99px !important;
          border: 1px solid rgba(0, 0, 0, 0.1) !important;
        }
        .iphone-viewport::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3) !important;
        }
      `}</style>

    </div>
  );
}
