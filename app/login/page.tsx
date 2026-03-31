'use client';

import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { KeyRound, Mail, Lock, ArrowRight, ShieldCheck, Building2, UserCog } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createBrowserClient();

  useEffect(() => {
    const isLogout = searchParams.get('logout') === 'true';
    if (isLogout && supabase) {
      supabase.auth.signOut().then(() => {
        // Clean refresh if needed, but the param is enough to stop middleware loop
      });
    }
  }, [searchParams, supabase]);

  const testUsers = [
    { label: 'Inquilino', email: 'inquilino@teste.com', role: 'tenant', icon: ShieldCheck },
    { label: 'Imobiliária', email: 'imobiliaria@teste.com', role: 'agency', icon: Building2 },
    { label: 'Admin', email: 'admin@teste.com', role: 'admin', icon: UserCog },
  ];

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    
    if (!supabase) {
      const missing = [];
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push('URL');
      if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push('Chave Anon');
      setError(`Configuração incompleta no Vercel: Falta ${missing.join(' e ')}. Adicione nas Settings e faça Redeploy.`);
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: password || '123456',
    });

    if (error) {
      setError('Credenciais inválidas. Verifique se o usuário foi criado no Supabase Auth.');
      setLoading(false);
    } else {
      router.replace('/dashboard');
    }
  };

  const fillAndLogin = (testEmail: string) => {
    setEmail(testEmail);
    setPassword('123456');
    // Pequeno delay para percepção visual do preenchimento
    setTimeout(() => handleLogin(), 100);
  };

  return (
    <div className="max-w-md mx-auto mt-12 pb-12 animate-count">
      <div className="p-8 bg-white border border-slate-100 rounded-4xl shadow-spatial space-y-8">
        <header className="text-center space-y-2">
            <div className="w-16 h-16 bg-[#1A365D] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-900/20">
            <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Entrega Facilitada</h1>
            <p className="text-slate-500 font-medium">Acesse seu painel exclusivo.</p>
        </header>

        <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">E-mail</label>
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#1A365D] transition-colors font-medium text-sm"
                placeholder="seu@email.com"
                />
            </div>
            </div>

            <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Senha</label>
            <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#1A365D] transition-colors font-medium text-sm"
                placeholder="••••••••"
                />
            </div>
            </div>

            {error && <p className="text-xs text-rose-500 font-bold text-center bg-rose-50 p-3 rounded-xl border border-rose-100">{error}</p>}

            <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A365D] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 active:scale-95 transition-all hover:bg-[#1a365df0]"
            >
            {loading ? 'Entrando...' : 'Acessar Painel'}
            <ArrowRight className="w-5 h-5" />
            </button>
        </form>

        {/* Test Mode Section */}
        <div className="pt-6 border-t border-slate-50 space-y-4">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-center">Acesso Rápido para Testes</p>
            <div className="grid grid-cols-3 gap-3">
                {testUsers.map((u) => (
                    <button
                        key={u.role}
                        onClick={() => fillAndLogin(u.email)}
                        className="flex flex-col items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:border-[#1A365D]/30 hover:bg-blue-50/30 transition-all group"
                    >
                        <u.icon className="w-5 h-5 text-slate-400 group-hover:text-[#1A365D]" />
                        <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800">{u.label}</span>
                    </button>
                ))}
            </div>
        </div>

        <div className="text-center pt-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            Problemas no acesso? <br/>
            <span className="text-[#1A365D] cursor-pointer hover:underline">Entre em contato com o suporte</span>
            </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-slate-100 border-t-[#1A365D] rounded-full animate-spin"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
