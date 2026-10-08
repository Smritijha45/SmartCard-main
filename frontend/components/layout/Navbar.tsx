'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, ChevronDown, Loader2, Menu, X, CreditCard } from 'lucide-react';
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
    <nav className="bg-white/80 dark:bg-[#0B0F17]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between px-4 sm:px-6 h-16 sticky top-0 z-50 transition-colors">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
            <CreditCard size={16} className="text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base text-slate-900 dark:text-slate-100 tracking-tight">
              SmartCard
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
              Pro
            </span>
          </div>
        </Link>
      </div>
      
      {/* Navigation links */}
      <div className="hidden md:flex items-center space-x-1">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
          return (
             <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-150",
                  isActive 
                    ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold" 
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
                )}
             >
                {link.name}
             </Link>
          );
        })}
      </div>

      <div className="flex items-center space-x-3">
        {/* Search Input */}
        <div className="relative group/search" ref={searchRef}>
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search cards, leads..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="pl-8.5 pr-4 py-1.5 w-32 sm:w-56 focus:w-48 sm:focus:w-64 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg text-xs font-normal outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
            />
            {isSearching && (
              <Loader2 size={13} className="absolute right-3 text-slate-400 animate-spin" />
            )}
          </div>

          {/* Search Dropdown */}
          {showResults && searchQuery.trim() !== '' && (
            <div className="absolute top-full mt-2 w-full min-w-[300px] right-0 bg-white dark:bg-[#131924] rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
              <div className="p-2 max-h-96 overflow-y-auto">
                {searchResults.cards?.length === 0 && searchResults.leads?.length === 0 && !isSearching ? (
                  <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">No results found</div>
                ) : (
                  <>
                    {searchResults.cards?.length > 0 && (
                      <div className="mb-2">
                        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Digital Cards
                        </div>
                        {searchResults.cards.map((card) => (
                          <Link 
                            href={`/cards`} 
                            key={card._id} 
                            onClick={() => setShowResults(false)} 
                            className="flex items-center px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg transition-colors"
                          >
                            <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-medium text-xs uppercase shrink-0">
                              {card.name.charAt(0)}
                            </div>
                            <div className="ml-2.5 overflow-hidden">
                              <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">{card.name}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{card.company || card.role}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchResults.leads?.length > 0 && (
                      <div>
                        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Relationship Leads
                        </div>
                        {searchResults.leads.map((lead) => (
                          <Link 
                            href={`/leads`} 
                            key={lead._id} 
                            onClick={() => setShowResults(false)} 
                            className="flex items-center px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg transition-colors"
                          >
                            <div className="w-7 h-7 rounded-md bg-cyan-600 text-white flex items-center justify-center font-medium text-xs uppercase shrink-0">
                              {lead.name.charAt(0)}
                            </div>
                            <div className="ml-2.5 overflow-hidden">
                              <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">{lead.name}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{lead.email || lead.phone}</p>
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
          className="relative p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex items-center justify-center"
          title="Alerts"
        >
           <Bell size={16} />
           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </Link>

        {/* Profile Pill */}
        <Link href="/profile" className="flex items-center gap-2 group cursor-pointer p-1 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-colors">
          <div className="h-7.5 w-7.5 rounded-full overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700">
             <img 
               src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
               alt="Profile" 
               className="h-full w-full object-cover" 
             />
          </div>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 hidden lg:inline">
            Alex M.
          </span>
          <ChevronDown size={13} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 hidden sm:block" />
        </Link>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-[#0B0F17] border-b border-slate-200 dark:border-slate-800 md:hidden p-4 space-y-1 shadow-lg z-50">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
            return (
               <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block text-xs font-medium px-3.5 py-2 rounded-lg transition-colors",
                    isActive 
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold" 
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
               >
                  {link.name}
               </Link>
            );
          })}
          <Link 
            href="/notifications" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between text-xs font-medium px-3.5 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span>Alerts &amp; Notifications</span>
            <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
          </Link>
        </div>
      )}
    </nav>
  );
}
