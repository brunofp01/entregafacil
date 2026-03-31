'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase/client';
import { 
  ShieldCheck, 
  PaintBucket, 
  Hammer, 
  CheckCircle, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  DollarSign,
  ClipboardCheck,
  AlertCircle,
  Users,
  FileText,
  Camera,
  LayoutGrid,
  MapPin,
  X,
  Info
} from 'lucide-react';
import { getUserProfile, getTenantContract } from '@/lib/supabase/queries';

export default function Dashboard() {
  const [role, setRole] = useState<'tenant' | 'agency'>('tenant');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [isVacancyFlowOpen, setIsVacancyFlowOpen] = useState(false);
  const [vacancyStep, setVacancyStep] = useState(1);

  // Mock data for development when Supabase is not seeded
  const mockData = {
    profile: { full_name: 'Bruno Pereira' },
    contract: {
      months_paid: 12,
      total_months: 30,
      monthly_fee: 250,
      properties: {
        address: 'Ed. Horizonte, 402 - Lourdes, BH',
        finish_standard: 'standard'
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // In a real app, we would get the ID from the auth session
        // const profile = await getUserProfile('some-uuid');
        // const contract = await getTenantContract('some-uuid');
        // setData({ profile, contract });
        
        // Simulating fetch delay
        setTimeout(() => {
          setData(mockData);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setData(mockData);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-[#1A365D] rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Carregando sua proteção...</p>
      </div>
    );
  }

  if (role === 'tenant') {
    const { contract, profile } = data;
    const progress = (contract.months_paid / contract.total_months) * 100;

    return (
      <div className="max-w-md mx-auto pb-24 space-y-6 animate-count">
        {/* Header */}
        <header className="flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1A365D]">Olá, {profile.full_name.split(' ')[0]}</h1>
            <p className="text-slate-500 text-sm">Resumo da sua proteção.</p>
          </div>
          <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Contrato Protegido
          </span>
        </header>

        {/* Hero Bento Card */}
        <div className="bg-[#1A365D] text-white rounded-4xl p-8 shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
          <div className="relative z-10 transition-transform group-hover:scale-[1.02] duration-500">
            <span className="text-blue-100 font-bold text-xs uppercase tracking-widest opacity-80">Pacote All-Inclusive</span>
            <div className="mt-2 flex items-baseline gap-2">
              <h2 className="text-4xl font-extrabold text-white">
                R$ {contract.monthly_fee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h2>
              <span className="text-blue-200 font-semibold italic text-lg">/ mês</span>
            </div>
            
            {/* Progress */}
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
            
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-blue-200/80 uppercase tracking-tight">
              <MapPin className="w-3 h-3" /> {contract.properties.address}
            </div>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl opacity-20" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl opacity-10" />
        </div>

        {/* Benefits Grid (Bento) */}
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

        {/* Secondary Info */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-soft">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-[#1A365D]" /> Próxima Fatura
          </h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500 font-medium">Vencimento em 10/Abr</p>
              <p className="text-lg font-bold text-slate-800">R$ {contract.monthly_fee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
              Ver Boleto
            </button>
          </div>
        </div>

        {/* Sticky Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-50">
          <button 
            onClick={() => setIsVacancyFlowOpen(true)}
            className="w-full bg-[#1A365D] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-900/30 active:scale-95 transition-all"
          >
            Solicitar Desocupação Facilitada
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Vacancy Flow Modal/Overlay */}
        {isVacancyFlowOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-4xl shadow-spatial overflow-hidden animate-count">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-[#F8FAFC]">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Desocupação Facilitada</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Passo {vacancyStep} de 3</p>
                </div>
                <button onClick={() => {setIsVacancyFlowOpen(false); setVacancyStep(1);}} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <div className="p-8">
                {vacancyStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-800">Confirme o Imóvel</h4>
                      <p className="text-sm p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 font-medium">
                        {contract.properties.address}
                      </p>
                    </div>
                    <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 space-y-2">
                      <h4 className="text-emerald-700 font-bold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Proteção Ativa
                      </h4>
                      <p className="text-xs text-emerald-600 font-medium leading-relaxed">
                        Identificamos que você possui {contract.months_paid} meses de quitação. 
                        Sua pintura e reparos básicos estão 100% cobertos para a entrega das chaves.
                      </p>
                    </div>
                    <button 
                      onClick={() => setVacancyStep(2)}
                      className="w-full bg-[#1A365D] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-900/20"
                    >
                      Continuar Agendamento
                    </button>
                  </div>
                )}
                
                {vacancyStep === 2 && (
                  <div className="space-y-6 text-center">
                    <div className="w-20 h-20 bg-blue-50 text-[#1A365D] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-xl">Agendamento de Vistoria</h4>
                    <p className="text-sm text-slate-500 font-medium">
                      O vistoriador entrará em contato em até 48h para confirmar a melhor data para você.
                    </p>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4 text-left">
                      <div className="flex gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-soft">
                          <Info className="w-5 h-5 text-amber-500" />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                          Lembre-se de retirar todos os objetos pessoais do imóvel antes da vistoria final.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setVacancyStep(1)} className="flex-1 py-4 text-slate-400 font-bold uppercase text-xs tracking-widest">Voltar</button>
                      <button 
                        onClick={() => setVacancyStep(3)}
                        className="flex-[2] bg-[#1A365D] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-900/20"
                      >
                        Finalizar Pedido
                      </button>
                    </div>
                  </div>
                )}

                {vacancyStep === 3 && (
                  <div className="space-y-8 text-center py-4">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                      <ShieldCheck className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-800 text-2xl">Pedido Solicitado!</h4>
                      <p className="text-sm text-slate-500 font-medium">
                        Protocolo: #EF-{Math.floor(1000 + Math.random() * 9000)}-2026
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 font-medium max-w-xs mx-auto">
                      Agora é com a gente. Fique de olho no seu WhatsApp para o agendamento da vistoria técnica.
                    </p>
                    <button 
                      onClick={() => {setIsVacancyFlowOpen(false); setVacancyStep(1);}}
                      className="w-full bg-[#1A365D] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-900/20"
                    >
                      Voltar ao Dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Agency Role (B2B Desktop Oriented)
  return (
    <div className="flex h-[calc(100vh-120px)] gap-6 animate-count">
      {/* Sidebar (Next.js Desktop version) */}
      <aside className="w-64 flex flex-col gap-2 shrink-0 hidden lg:flex">
        <button className="flex items-center gap-3 px-4 py-3 bg-[#1A365D]/5 text-[#1A365D] rounded-2xl font-bold transition-all text-left">
          <LayoutGrid className="w-5 h-5" /> Visão Geral
        </button>
        <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-[#1A365D] transition-all font-semibold text-left">
          <FileText className="w-5 h-5" /> Contratos Cobertos
        </button>
        <Link href="/inspections" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-[#1A365D] transition-all font-semibold text-left">
          <Camera className="w-5 h-5" /> Vistorias
        </Link>
        <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-[#1A365D] transition-all font-semibold text-left">
          <AlertCircle className="w-5 h-5" /> Inadimplência
        </button>
        
        <div className="mt-auto p-4 bg-slate-50 border border-slate-100 rounded-3xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Suporte B2B</p>
          <p className="text-xs text-slate-600 font-medium">Contate seu gerente de conta.</p>
          <button className="mt-3 w-full text-[10px] font-bold bg-white border border-slate-200 py-2 rounded-xl text-slate-800 uppercase tracking-widest hover:border-[#1A365D] transition-colors">Abrir Chamado</button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-4 space-y-6">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 leading-none">Painel Imobiliária</h1>
            <p className="text-slate-500 font-medium mt-2">Gestão consolidada do fundo de reparos.</p>
          </div>
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:border-[#1A365D] transition-all">
            Baixar Relatório (PDF)
          </button>
        </header>

        {/* Metrics Grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-soft">
            <Users className="w-6 h-6 text-[#1A365D] mb-3" />
            <p className="text-sm font-medium text-slate-500">Contratos</p>
            <p className="text-2xl font-black text-slate-900 mt-1">124</p>
            <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
              <TrendingUp className="w-2 h-2" /> +12%
            </p>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-soft">
            <DollarSign className="w-6 h-6 text-emerald-500 mb-3" />
            <p className="text-sm font-medium text-slate-500">Fundo Reserva</p>
            <p className="text-2xl font-black text-slate-900 mt-1">R$ 31k</p>
            <p className="text-[10px] text-slate-400 font-medium mt-2">Disponível p/ Reparos</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-soft">
            <ClipboardCheck className="w-6 h-6 text-amber-500 mb-3" />
            <p className="text-sm font-medium text-slate-500">Vistorias/Sem</p>
            <p className="text-2xl font-black text-slate-900 mt-1">08</p>
            <p className="text-[10px] text-slate-400 font-medium mt-2">Próximos 5 dias</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-soft">
            <AlertCircle className="w-6 h-6 text-rose-500 mb-3" />
            <p className="text-sm font-medium text-slate-500">Inadimplência</p>
            <p className="text-2xl font-black text-slate-900 mt-1">4.2%</p>
            <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
              -0.5% vs Fev
            </p>
          </div>
        </div>

        {/* Contract Table */}
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-soft">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Contratos Recentes</h3>
            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">96% em dia</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Inquilino</th>
                  <th>Imóvel</th>
                  <th>Pagamento</th>
                  <th className="pr-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">Ana Maria</td>
                  <td className="text-sm font-medium text-slate-500 italic">Rua das Flores, 123</td>
                  <td><span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black border border-emerald-100">PAGO</span></td>
                  <td className="pr-6 text-right">
                    <button className="text-xs font-bold text-[#1A365D] opacity-0 group-hover:opacity-100 transition-opacity">Ver Contrato</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
