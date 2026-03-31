'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { PricingEngine } from '@/lib/pricing';

export default function SimulatePage() {
  const [size, setSize] = useState(60);
  const [standard, setStandard] = useState<'economico' | 'standard' | 'premium'>('standard');
  const [result, setResult] = useState({ total: 0, monthly: 0 });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const MS = 0.15; // Margem de Segurança
  const CO = 0.10; // Custos Operacionais

  useEffect(() => {
    const Pp = PricingEngine.estimateProjectedRepair(size, standard);
    const pricing = PricingEngine.calculateFinalPrice(Pp, MS, CO, 12);
    setResult({ total: pricing.total, monthly: pricing.monthly });
  }, [size, standard]);

  const handleCheckout = async () => {
    if (!email) {
      setError('Por favor, informe seu e-mail para continuar.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: result.monthly,
          email,
          propertyAddress: 'Endereço Simulado', // Poderia ser capturado em outro input
          standard,
        }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Erro ao criar sessão de checkout');
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-count">
      <header className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Simulador de Assinatura</h1>
        <p className="text-slate-500 font-medium">Calcule o valor da sua tranquilidade na desocupação.</p>
      </header>

      <div className="bg-white border border-slate-100 rounded-4xl p-8 shadow-spatial space-y-8">
        {/* Tamanho */}
        <div className="space-y-4">
          <label className="flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-widest">
            Tamanho do Imóvel
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">m²</span>
          </label>
          <input 
            type="range" 
            min="30" 
            max="250" 
            value={size} 
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#1A365D]" 
          />
          <div className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
            <span className="text-xs font-bold text-slate-400">30m²</span>
            <span className="text-2xl font-black text-[#1A365D] animate-count">{size}m²</span>
            <span className="text-xs font-bold text-slate-400">250m²</span>
          </div>
        </div>

        {/* Padrão */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">Padrão de Acabamento</label>
          <div className="grid grid-cols-3 gap-3">
            {(['economico', 'standard', 'premium'] as const).map((std) => (
              <button
                key={std}
                onClick={() => setStandard(std)}
                className={`px-4 py-4 rounded-2xl border-2 transition-all text-xs font-black uppercase tracking-tight ${
                  standard === std 
                    ? 'border-[#1A365D] text-[#1A365D] bg-blue-50/50' 
                    : 'border-slate-50 text-slate-400 hover:border-slate-200'
                }`}
              >
                {std === 'economico' ? 'Econômico' : std.charAt(0).toUpperCase() + std.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 flex items-start gap-1.5 px-1 font-medium">
            <Info className="w-3 h-3 shrink-0" />
            {standard === 'premium' ? 'Pintura de alto padrão e reparos estruturais inclusos.' : 'Pintura padrão e pequenos reparos inclusos.'}
          </p>
        </div>

        {/* Resultado */}
        <div className="bg-[#1A365D] rounded-3xl p-10 text-center text-white shadow-2xl shadow-blue-900/30 relative overflow-hidden group">
          <div className="relative z-10 transition-transform group-hover:scale-105 duration-500">
            <p className="text-blue-100 font-bold text-xs uppercase tracking-widest mb-3 opacity-90">Mensalidade Estimada</p>
            <div className="flex items-baseline justify-center gap-2">
              <h2 className="text-6xl font-black text-white">
                R$ {result.monthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h2>
              <span className="text-blue-200 font-semibold text-xl">/mês</span>
            </div>
            <p className="text-[10px] text-blue-200/60 mt-6 font-bold uppercase tracking-tighter">Cálculo baseado em contrato de 12 meses</p>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all"></div>
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>
        </div>

        {/* Email Input */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">E-mail para Contrato</label>
          <input 
            type="email" 
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#1A365D] transition-colors font-medium"
          />
          {error && <p className="text-xs text-rose-500 font-bold px-2">{error}</p>}
        </div>

        {/* CTA */}
        <button 
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-[#10B981] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all hover:bg-[#0ea873] hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processando...' : 'Contratar Proteção Agora'}
          <ShieldCheck className="w-5 h-5" />
        </button>

        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Sem análise de crédito • Aprovação imediata
        </p>
      </div>
    </div>
  );
}
