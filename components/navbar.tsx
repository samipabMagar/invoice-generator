'use client';

import Link from 'next/link';
import { UserCircle, LogOut, FileText, Menu, X, User } from 'lucide-react';
import { supabase } from '@/lib/supabase/supabase';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsProfileOpen(false);
  };

  if (pathname === '/auth') return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-slate-900 hover:opacity-80 transition-opacity">
          <div className="bg-sky-500 rounded-md p-1.5 flex items-center justify-center hidden sm:flex">
            <FileText className="w-4 h-4 text-white" />
          </div>
          InvoiceGen
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className={`transition-colors hover:text-sky-600 ${pathname === '/' ? 'text-sky-600' : 'text-slate-600'}`}>Generator</Link>
            {user && (
              <Link href="/dashboard" className={`transition-colors hover:text-sky-600 ${pathname === '/dashboard' ? 'text-sky-600' : 'text-slate-600'}`}>Dashboard</Link>
            )}
          </nav>
          
          <div className="h-4 w-px bg-slate-200" />
          
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
              >
                <div className="bg-slate-100 rounded-full p-1.5 border border-slate-200">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">{user.email?.split('@')[0]}</span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-3 border-b border-slate-100 mb-1">
                    <p className="text-xs text-slate-500 font-medium mb-0.5">Signed in as</p>
                    <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
                  </div>
                  <div className="px-1 py-1">
                    <Link 
                      href="/dashboard" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex w-full items-center px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-600 rounded-md transition-colors"
                    >
                      Your Dashboard
                    </Link>
                  </div>
                  <div className="px-1 py-1 border-t border-slate-100 mt-1">
                    <button 
                      onClick={handleSignOut}
                      className="flex w-full items-center px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-md transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-slate-900 text-white hover:bg-slate-800 h-9 px-4 shadow-sm cursor-pointer">
              <UserCircle className="w-4 h-4 mr-2" /> Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button 
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="flex flex-col p-4 space-y-4 shadow-xl">
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/" className={`text-sm font-medium ${pathname === '/' ? 'text-sky-600' : 'text-slate-600'}`}>Generator</Link>
            {user && (
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/dashboard" className={`text-sm font-medium ${pathname === '/dashboard' ? 'text-sky-600' : 'text-slate-600'}`}>Dashboard</Link>
            )}
            <hr className="border-slate-100" />
            {user ? (
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-slate-500">{user.email}</span>
                <button onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }} className="inline-flex items-center justify-start rounded-md text-sm font-medium transition-colors hover:bg-rose-50 text-rose-600 h-10 px-4 border border-rose-100 bg-rose-50/50 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </button>
              </div>
            ) : (
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/auth" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-slate-900 text-white hover:bg-slate-800 h-10 px-4 cursor-pointer">
                <UserCircle className="w-4 h-4 mr-2" /> Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
