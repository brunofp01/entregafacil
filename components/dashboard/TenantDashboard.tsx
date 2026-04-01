'use client';

import { useState } from 'react';
import { 
  ShieldCheck, 
  PaintBucket, 
  Hammer, 
  CheckCircle, 
  Calendar, 
  ArrowRight,
  MapPin,
  X,
  Info,
  Sparkles,
  Zap
} from 'lucide-react';
import { requestVacancyInspection } from '@/lib/supabase/queries';

export default function TenantDashboard({ profile, contract }: { profile: any, contract: any }) {
  const [isVacancyFlowOpen, setIsVacancyFlowOpen] = useState(false);
  const [vacancyStep, setVacancyStep] = useState(1);
  const progress = contract ? (contract.months_paid / contract.total_months) * 100 : 0;

  if (!contract) {
    return (
      <div className="max-w-md mx-auto py-12 px-6 space-y-8">
        <header className="text-center space-y-4">
            <div className="w-20 h-20 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-10 h-10 text-[#1A365D]" />
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quase tudo pronto!</h1>
                <p className="text-slate-500 font-medium">Bem-vindo, {profile?.full_name?.split(' ')[0] || 'Inquilino'}.</p>
            </div>
        </header>

        <div className="bg-white border border-slate-100 rounded-4xl p-8 shadow-soft space-y-6">
            <div className="flex gap-4">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Contrato Pendente</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                        Sua imobiliária ainda não vinculou seu contrato de locação a este e-mail. 
                    </p>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pb-24 space-y-6">
        <header className="flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1A365D]">Olá, {profile.full_name?.split(' ')[0]}</h1>
            <p className="text-slate-500 text-sm">Resumo da sua proteção.</p>
          </div>
          <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Contrato Protegido
          </span>
        </header>

        <div className="bg-[#1A365D] text-white rounded-4xl p-8 shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
          <div className="relative z-10 transition-transform group-hover:scale-[1.02] duration-500">
            <span className="text-blue-100 font-bold text-xs uppercase tracking-widest opacity-80">Pacote All-Inclusive</span>
            <div className="mt-2 flex items-baseline gap-2">
              <h2 className="text-4xl font-extrabold text-white">
                R$ {Number(contract.monthly_fee).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h2>
              <span className="text-blue-200 font-semibold italic text-lg">/ mês</span>
            </div>
            
            <div className="mt-8 space-y-2">
              <div className="flex justify-between text-xs font-bold text-blue-100">
                <span>Progresso da Quitação</span>
                <span>{contract.months_paid}/{contract.total_months} meses</span>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#10B981] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-slate-100 p-4 rounded-3xl flex flex-col items-center text-center shadow-soft">
            <div className="p-2 bg-blue-50 text-[#1A365D] rounded-xl mb-3">
              <PaintBucket className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Pintura</span>
            <span className="text-xs font-bold text-slate-800 leading-tight">Coberta</span>
          </div>
          <div className="bg-white border border-slate-100 p-4 rounded-3xl flex flex-col items-center text-center shadow-soft">
            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl mb-3">
              <Hammer className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Reparos</span>
            <span className="text-xs font-bold text-slate-800 leading-tight">Inclusos</span>
          </div>
          <div className="bg-white border border-slate-100 p-4 rounded-3xl flex flex-col items-center text-center shadow-soft">
            <div className="p-2 bg-amber-50 text-amber-500 rounded-xl mb-3">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Zero</span>
            <span className="text-xs font-bold text-slate-800 leading-tight">Surpresas</span>
          </div>
        </div>

        {/* Botão de Desocupação */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-40 flex justify-center">
            <div className="max-w-md w-full">
            <button 
                onClick={() => setIsVacancyFlowOpen(true)}
                className="w-full bg-[#1A365D] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-900/30 active:scale-95 transition-all"
            >
                Solicitar Desocupação Facilitada
                <ArrowRight className="w-5 h-5" />
            </button>
            </div>
        </div>

        {/* Modal de Fluxo de Desocupação */}
        {isVacancyFlowOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-4xl shadow-spatial overflow-hidden">
               {/* Lógica de passos do modal similar ao original... */}
               <div className="p-8 text-center space-y-4">
                  <h3 className="text-xl font-bold">Fluxo de Desocupação</h3>
                  <p className="text-sm text-slate-500">Iniciando processo para {contract.properties?.address}</p>
                  <button onClick={() => setIsVacancyFlowOpen(false)} className="bg-slate-100 px-6 py-2 rounded-xl">Fechar</button>
               </div>
            </div>
          </div>
        )}
    </div>
  );
}
