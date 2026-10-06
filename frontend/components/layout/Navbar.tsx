'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, ChevronDown, Loader2, Menu, X, CreditCard, Sparkles } from 'lucide-react';
import { cn } from '../ui/Button';
import { useState, useEffect, useRef } from 'react';

const links = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'My Cards', href: '/cards' },
  { name: 'Leads', href: '/leads' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'Settings', href: '/settings' },
];

export function Navbar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{cards: any[], leads: any[]}>({ cards: [], leads: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults({ cards: [], leads: [] });
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchSearchResults, 250);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <nav className="bg-[#090D16] border-b-2 border-black shadow-[0_4px_0_0_#000000] flex items-center justify-between px-4 sm:px-6 h-17 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-1.5 text-gray-300 hover:text-white rounded-lg bg-slate-900 border-2 border-black shadow-[2px_2px_0px_#000]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-[#2563EB] border-2 border-black flex items-center justify-center font-black text-white shadow-[2px_2px_0px_#000000] group-hover:-translate-y-0.5 transition-transform">
            <CreditCard size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl text-white tracking-tight leading-none">
              SmartCard
            </span>
            <span className="text-[9px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
              Dashboard
            </span>
          </div>
        </Link>
      </div>
      
      {/* Navigation links */}
      <div className="hidden md:flex items-center space-x-1.5">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
          return (
             <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-md transition-all duration-100",
                  isActive 
                    ? "bg-[#2563EB] text-white border-2 border-black shadow-[2px_2px_0px_#000]" 
                    : "text-gray-300 hover:text-white hover:bg-slate-800/80 border-2 border-transparent hover:border-black"
                )}
             >
                {link.name}
             </Link>
          );
        })}
      </div>

      <div className="flex items-center space-x-4">
        {/* Search Input */}
        <div className="relative group/search" ref={searchRef}>
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search cards, leads..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="pl-8.5 pr-4 py-1.5 w-28 sm:w-56 focus:w-44 sm:focus:w-64 bg-[#0d1424] border-2 border-black focus:border-blue-500 rounded-lg text-xs font-bold outline-none transition-all placeholder:text-gray-500 text-gray-100 shadow-[2px_2px_0px_#000] focus:shadow-[3px_3px_0px_#2563EB]"
            />
            {isSearching && (
              <Loader2 size={14} className="absolute right-3 text-gray-400 animate-spin" />
            )}
          </div>

          {/* Search Dropdown */}
          {showResults && searchQuery.trim() !== '' && (
            <div className="absolute top-full mt-2 w-full min-w-[300px] right-0 bg-[#0e1628] rounded-xl shadow-[6px_6px_0px_#000] border-2 border-black overflow-hidden z-50">
              <div className="p-2 max-h-96 overflow-y-auto">
                {searchResults.cards?.length === 0 && searchResults.leads?.length === 0 && !isSearching ? (
                  <div className="p-4 text-center text-xs font-mono text-gray-400">No results found</div>
                ) : (
                  <>
                    {searchResults.cards?.length > 0 && (
                      <div className="mb-2">
                        <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                          Digital Cards
                        </div>
                        {searchResults.cards.map((card) => (
                          <Link 
                            href={`/cards`} 
                            key={card._id} 
                            onClick={() => setShowResults(false)} 
                            className="flex items-center px-3 py-2 hover:bg-slate-800 rounded-lg group transition-colors border border-transparent hover:border-black"
                          >
                            <div className="w-7 h-7 rounded bg-blue-600 border border-black text-white flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                              {card.name.charAt(0)}
                            </div>
                            <div className="ml-2.5 overflow-hidden">
                              <p className="text-xs font-bold text-white truncate">{card.name}</p>
                              <p className="text-[10px] text-gray-400 truncate">{card.company || card.role}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchResults.leads?.length > 0 && (
                      <div>
                        <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                          Relationship Leads
                        </div>
                        {searchResults.leads.map((lead) => (
                          <Link 
                            href={`/leads`} 
                            key={lead._id} 
                            onClick={() => setShowResults(false)} 
                            className="flex items-center px-3 py-2 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-black"
                          >
                            <div className="w-7 h-7 rounded bg-cyan-400 border border-black text-black flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                              {lead.name.charAt(0)}
                            </div>
                            <div className="ml-2.5 overflow-hidden">
                              <p className="text-xs font-bold text-white truncate">{lead.name}</p>
                              <p className="text-[10px] text-gray-400 truncate">{lead.email || lead.phone}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <Link 
          href="/notifications" 
          className="relative p-1.5 rounded-lg bg-slate-900 border-2 border-black text-gray-300 hover:text-white shadow-[2px_2px_0px_#000] hidden sm:flex items-center justify-center active:translate-x-0.5 active:translate-y-0.5"
          title="Alerts"
        >
           <Bell size={17} />
           <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-black"></span>
        </Link>

        {/* Profile Pill */}
        <Link href="/profile" className="flex items-center gap-2 group cursor-pointer">
          <div className="h-8 w-8 rounded-lg bg-[#2563EB] border-2 border-black overflow-hidden shadow-[2px_2px_0px_#000] group-hover:-translate-y-0.5 transition-transform">
             <img 
               src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
               alt="Profile" 
               className="h-full w-full object-cover" 
             />
          </div>
          <span className="text-xs font-bold text-gray-200 hidden lg:inline font-mono">
            Alex M.
          </span>
          <ChevronDown size={14} className="text-gray-400 group-hover:text-white hidden sm:block" />
        </Link>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-17 left-0 w-full bg-[#090D16] border-b-2 border-black shadow-[0_6px_0_0_#000] md:hidden p-4 space-y-2 z-50">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
            return (
               <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block text-xs font-mono font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg border-2",
                    isActive 
                      ? "bg-[#2563EB] text-white border-black shadow-[2px_2px_0px_#000]" 
                      : "text-gray-200 border-slate-800 hover:border-black hover:bg-slate-800"
                  )}
               >
                  {link.name}
               </Link>
            );
          })}
          <Link 
            href="/notifications" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg border-2 border-slate-800 text-gray-200 hover:border-black hover:bg-slate-800"
          >
            <span>Alerts &amp; Notifications</span>
            <span className="w-2 h-2 bg-red-500 rounded-full border border-black"></span>
          </Link>
        </div>
      )}
    </nav>
  );
}
