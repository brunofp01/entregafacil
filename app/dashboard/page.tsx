'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';
import { getTenantContract, requestVacancyInspection } from '@/lib/supabase/queries';
import { createBrowserClient } from '@/lib/supabase/client';
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

export default function Dashboard() {
  const { user, profile, loading: userLoading, role, signOut } = useUser();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isVacancyFlowOpen, setIsVacancyFlowOpen] = useState(false);
  const [vacancyStep, setVacancyStep] = useState(1);
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    // Turbo 2026: Parallel Data Fetching
    const initializeDashboard = async () => {
      if (!userLoading && user) {
        // 1. Instant Hub Redirection
        if (role === 'agency') {
          router.replace('/agency/dashboard');
          return;
        }
        if (role === 'admin') {
          router.replace('/admin/dashboard');
          return;
        }

        // 2. Parallel Fetching for Tenants
        if (role === 'tenant') {
          try {
            const contractPromise = getTenantContract(user.id);
            // We can add other parallel promises here (e.g. notifications, bills)
            const [contract] = await Promise.all([contractPromise]);
            
            setData({ profile, contract });
          } catch (error) {
            console.error("Turbo fetch error:", error);
          }
        }
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [user, profile, userLoading, role, router]);

  if (userLoading || (user && loading)) {
    return (
      <div className="max-w-md mx-auto py-12 px-6 space-y-8 animate-pulse">
        {/* Skeleton Hub */}
        <div className="w-20 h-20 bg-slate-100 rounded-[2.5rem] mx-auto" />
        <div className="h-8 w-48 bg-slate-100 rounded-full mx-auto" />
        <div className="space-y-4 pt-8">
            <div className="h-40 w-full bg-slate-100 rounded-4xl" />
            <div className="grid grid-cols-3 gap-3">
                <div className="h-24 bg-slate-50 rounded-3xl" />
                <div className="h-24 bg-slate-50 rounded-3xl" />
                <div className="h-24 bg-slate-50 rounded-3xl" />
            </div>
        </div>
      </div>
    );
  }

  // Safety break: If loaded but no role, the user might not have its profile correctly setup
  if (!role && !userLoading) {
    return (
      <div className="max-w-md mx-auto py-12 px-6 text-center space-y-6">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Acesso Restrito</h2>
        <p className="text-slate-500 font-medium tracking-tight">
          Não conseguimos identificar sua permissão de acesso. Verifique se seu Perfil foi criado no banco de dados.
        </p>
        <button 
          onClick={async () => {
            await signOut();
          }}
          className="inline-block bg-[#1A365D] text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs"
        >
          Sair e Tentar Novamente
        </button>
      </div>
    );
  }

  // State: Tenant without Contract (New User Experience)
  if (!data?.contract && role === 'tenant') {
    return (
      <div className="max-w-md mx-auto py-12 px-6 space-y-8 animate-count">
        <header className="text-center space-y-4">
            <div className="w-20 h-20 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-10 h-10 text-[#1A365D]" />
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quase tudo pronto!</h1>
                <p className="text-slate-500 font-medium">Bem-vindo à Entrega Facilitada, {profile?.full_name?.split(' ')[0] || 'Inquilino'}.</p>
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
                        Isso acontece geralmente em até 24h após a assinatura.
                    </p>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-50 opacity-40">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Prévia do Painel</p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                        <div className="w-6 h-6 bg-white rounded-lg mb-2" />
                        <div className="h-2 w-12 bg-slate-200 rounded-full" />
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                        <div className="w-6 h-6 bg-white rounded-lg mb-2" />
                        <div className="h-2 w-12 bg-slate-200 rounded-full" />
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-3">
            <button className="w-full bg-[#1A365D] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                <Zap className="w-5 h-5" /> Falar com Suporte
            </button>
            <Link 
                href="/login" 
                className="block text-center py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                onClick={async () => {
                   if (supabase) await supabase.auth.signOut();
                }}
            >
                Sair da Conta
            </Link>
        </div>
      </div>
    );
  }

  // State: Tenant with Active Contract (Full Dashboard)
  if (role === 'tenant' && data?.contract) {
    const { contract, profile } = data;
    const progress = (contract.months_paid / contract.total_months) * 100;

    return (
      <div className="max-w-md mx-auto pb-24 space-y-6 animate-count">
        <header className="flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1A365D]">Olá, {profile.full_name?.split(' ')[0] || 'Usuário'}</h1>
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
            
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-blue-200/80 uppercase tracking-tight">
              <MapPin className="w-3 h-3" /> {contract.properties?.address || 'Endereço não disponível'}
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl opacity-20" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl opacity-10" />
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

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-soft">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-[#1A365D]" /> Próxima Fatura
          </h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500 font-medium">Vencimento em 10/Abr</p>
              <p className="text-lg font-bold text-slate-800">R$ {Number(contract.monthly_fee).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
              Ver Boleto
            </button>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-50 flex justify-center">
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
                        {contract.properties?.address}
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
                        onClick={async () => {
                          try {
                            await requestVacancyInspection(data.contract.id);
                            setVacancyStep(3);
                          } catch (error) {
                            console.error("Error requesting vacancy:", error);
                            alert("Erro ao solicitar desocupação. Tente novamente.");
                          }
                        }}
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-amber-500 rounded-full animate-pulse"></div>
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Identificando acesso...</p>
    </div>
  );
}
