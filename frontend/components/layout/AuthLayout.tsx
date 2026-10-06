import React from 'react';
import Link from 'next/link';
import { CreditCard } from 'lucide-react';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#090D16] text-gray-100 font-sans flex flex-col justify-center items-center p-4 sm:p-6 bg-neo-dots relative selection:bg-blue-600 selection:text-white">
      {/* Brand Header */}
      <div className="mb-6 z-10 flex flex-col items-center gap-2">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-lg bg-[#2563EB] border-2 border-black flex items-center justify-center font-black text-white shadow-[3px_3px_0px_#000000] group-hover:-translate-y-0.5 transition-transform">
            <CreditCard size={22} className="text-white" />
          </div>
          <span className="font-black text-2xl text-white tracking-tight">
            SmartCard
          </span>
        </Link>
        <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold border-2 border-black bg-black px-2.5 py-0.5 rounded shadow-[2px_2px_0px_#2563EB] -rotate-1">
          Zero NFC • 100% Digital Identity
        </span>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md z-10">
        {children}
      </div>
      
      {/* Footer link */}
      <div className="mt-8 text-center text-xs font-mono text-gray-400">
        <Link href="/" className="hover:text-white underline underline-offset-4 decoration-blue-500">
          ← Return to SmartCard Home
        </Link>
      </div>
    </div>
  );
}
