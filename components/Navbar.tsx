'use client';
import Link from 'next/link';
import { KeyRound, Bell, LogOut, User, LayoutDashboard, FileStack, Camera, Building2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';
import { createBrowserClient } from '@/lib/supabase/client';

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile, loading, role, signOut } = useUser();

  const isActive = (path: string) => pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  const navLinks = {
    tenant: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/contracts', label: 'Contratos', icon: FileStack },
      { href: '/simulate', label: 'Simular', icon: Camera },
    ],
    agency: [
      { href: '/agency/dashboard', label: 'Agency Dashboard', icon: LayoutDashboard },
      { href: '/agency/contracts', label: 'Gestão Contratos', icon: FileStack },
      { href: '/agency/inspections', label: 'Vistorias', icon: Camera },
      { href: '/agency/properties', label: 'Imóveis', icon: Building2 },
    ],
    admin: [
      { href: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
      { href: '/agency/contracts', label: 'Contratos Globais', icon: FileStack },
    ],
  };

  const activeLinks = role ? navLinks[role] : [];

  if (loading) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-slate-100 h-20 flex items-center px-6">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        {/* Logo */}
        <Link 
          href={role === 'agency' ? '/agency/dashboard' : role === 'admin' ? '/admin/dashboard' : '/dashboard'} 
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
        
        {/* Desktop Nav */}
        {user && role && (
          <div className="hidden md:flex gap-8">
            {activeLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`text-sm font-bold transition-colors flex items-center gap-2 ${isActive(link.href) ? 'text-[#1A365D] underline decoration-2 underline-offset-4' : 'text-slate-400 hover:text-[#1A365D]'}`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* User / Logout */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {role && (
                <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-600 capitalize">
                    {role === 'agency' ? 'Imobiliária' : role === 'admin' ? 'Admin' : 'Inquilino'}
                  </span>
                </div>
              )}
              <button 
                onClick={handleSignOut} 
                className="flex items-center gap-2 p-3 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-[#1A365D] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#1a365df0] transition-all">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
