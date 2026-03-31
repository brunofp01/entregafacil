'use client';
import Link from 'next/link';
import { KeyRound, Bell, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-slate-100 h-20 flex items-center px-6">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        {/* Logo */}
        <Link 
          href="/dashboard" 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="p-2 bg-[#1A365D] rounded-xl group-hover:rotate-6 transition-transform shadow-lg shadow-blue-900/20">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="block text-lg font-black text-[#1A365D] leading-none">Entrega Facilitada</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Proptech & Fintech</span>
          </div>
        </Link>
        
        {/* desktop Nav */}
        <div className="hidden md:flex gap-8">
          <Link 
            href="/dashboard" 
            className={`text-sm font-bold transition-colors ${isActive('/dashboard') ? 'text-[#1A365D] underline decoration-2 underline-offset-4' : 'text-slate-400 hover:text-[#1A365D]'}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/simulate" 
            className={`text-sm font-bold transition-colors ${isActive('/simulate') ? 'text-[#1A365D]' : 'text-slate-400 hover:text-[#1A365D]'}`}
          >
            Simular
          </Link>
          <Link 
            href="/contracts" 
            className={`text-sm font-bold transition-colors ${isActive('/contracts') ? 'text-[#1A365D]' : 'text-slate-400 hover:text-[#1A365D]'}`}
          >
            Contratos
          </Link>
        </div>

        {/* User / Notifications */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
            <span className="text-xs font-bold text-slate-600">Inquilino</span>
          </div>
          <button className="p-2 text-slate-400 hover:text-[#1A365D] transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
