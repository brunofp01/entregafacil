'use client';

import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { KeyRound, Mail, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!supabase) {
      setError('Configuração do servidor incompleta. Verifique as variáveis de ambiente.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Credenciais inválidas ou erro no servidor.');
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-slate-100 rounded-4xl shadow-spatial space-y-8 animate-count">
      <header className="text-center space-y-2">
        <div className="w-16 h-16 bg-[#1A365D] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-900/20">
          <KeyRound className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Entrega Facilitada</h1>
        <p className="text-slate-500 font-medium">Acesse seu painel exclusivo.</p>
      </header>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#1A365D] transition-colors font-medium"
              placeholder="seu@email.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Senha</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#1A365D] transition-colors font-medium"
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && <p className="text-xs text-rose-500 font-bold text-center">{error}</p>}

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-[#1A365D] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 active:scale-95 transition-all hover:bg-[#1a365df0]"
        >
          {loading ? 'Entrando...' : 'Acessar Painel'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      <div className="text-center space-y-4 pt-4">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Ainda não tem conta? <span className="text-[#1A365D] cursor-pointer hover:underline">Fale com sua imobiliária</span>
        </p>
      </div>
    </div>
  );
}
