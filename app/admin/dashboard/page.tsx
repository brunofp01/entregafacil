'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/lib/context/UserContext';
import { createBrowserClient } from '@/lib/supabase/client';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  Users, 
  History,
  Activity,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { profile, loading: userLoading } = useUser();
  const [stats, setStats] = useState({
    totalMRR: 0,
    totalContracts: 0,
    totalAgencies: 0,
    activeStudents: 0
  });
  const [agencies, setAgencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    async function fetchAdminData() {
      if (profile?.id && supabase) {
        try {
          // Mocked Global Stats
          setStats({
            totalMRR: 125800.00,
            totalContracts: 482,
            totalAgencies: 12,
            activeStudents: 1560
          });

          // Fetch agencies (profiles with role='agency')
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'agency')
            .limit(5);
          
          setAgencies(data || []);
        } catch (error) {
          console.error("Error fetching admin stats:", error);
        }
      }
      setLoading(false);
    }
    fetchAdminData();
  }, [profile, supabase]);

  if (loading || userLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-[#1A365D] rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Carregando métricas globais...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-count">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <Activity className="w-8 h-8 text-[#1A365D]" /> Platform Overview
          </h1>
          <p className="text-slate-500 font-medium">Saúde global da plataforma Entrega Facilitada.</p>
        </div>
        <div className="flex gap-3">
            <button className="bg-white border border-slate-200 text-slate-600 px-6 py-3.5 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all">
                Configurações
            </button>
            <button className="bg-[#1A365D] text-white px-6 py-3.5 rounded-2xl text-xs font-bold shadow-xl shadow-blue-900/20 hover:bg-[#1a365df0] transition-all">
                Gerar Relatórios
            </button>
        </div>
      </header>

      {/* Global Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-soft">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Faturamento Mensal (MRR)</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-800">R$ {stats.totalMRR.toLocaleString('pt-BR')}</h3>
            <span className="text-emerald-500 text-xs font-bold">+5.2%</span>
          </div>
          <div className="mt-4 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[65%]" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-soft">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total de Contratos</p>
          <h3 className="text-3xl font-black text-slate-800">{stats.totalContracts}</h3>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Acumulado histórico</p>
        </div>

        <div className="bg-[#1A365D] text-white p-8 rounded-[40px] shadow-xl shadow-blue-900/20">
          <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-4">Imobiliárias Parceiras</p>
          <h3 className="text-3xl font-black">{stats.totalAgencies}</h3>
          <div className="mt-4 flex -space-x-3">
            {[1,2,3,4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1A365D] bg-blue-400/20" />
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-[#1A365D] bg-white text-[#1A365D] flex items-center justify-center text-[10px] font-bold">+{stats.totalAgencies - 4}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-soft">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Eventos de Reparo (Mês)</p>
          <h3 className="text-3xl font-black text-slate-800">42</h3>
          <p className="text-[10px] text-amber-500 font-bold mt-1 italic">Média de 1.4/dia</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Agencies Table */}
        <div className="bg-white border border-slate-100 rounded-4xl shadow-soft overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#1A365D]" /> Imobiliárias Ativas
                </h3>
                <button className="text-[10px] font-black text-[#1A365D] uppercase tracking-widest hover:underline">Ver Todas</button>
            </div>
            <div className="divide-y divide-slate-50">
                {agencies.length > 0 ? agencies.map((agency) => (
                    <div key={agency.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-800">{agency.full_name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Parceiro Nível Gold</p>
                            </div>
                        </div>
                        <button className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                            Gerenciar
                        </button>
                    </div>
                )) : (
                    <div className="p-12 text-center text-slate-400 font-medium italic text-sm">
                        Nenhuma imobiliária cadastrada ainda.
                    </div>
                )}
            </div>
        </div>

        {/* Growth Chart Placeholder */}
        <div className="bg-white border border-slate-100 rounded-4xl p-8 shadow-soft flex flex-col justify-between">
            <div className="space-y-2">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" /> Crescimento da Base
                </h3>
                <p className="text-xs text-slate-400 font-medium tracking-tight">Novos contratos assinados nos últimos 30 dias.</p>
            </div>
            <div className="h-48 flex items-end gap-3 px-4">
                {[4,7,5,8,4,9,2,6,8,5,7,9].map((h, i) => (
                    <div key={i} className="flex-1 bg-slate-50 rounded-t-xl relative group">
                        <div 
                            className="bg-[#1A365D] absolute bottom-0 left-0 right-0 rounded-t-xl group-hover:bg-[#10B981] transition-all" 
                            style={{ height: `${h * 10}%` }}
                        />
                    </div>
                ))}
            </div>
            <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                <div className="flex gap-4">
                    <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400"><div className="w-2 h-2 rounded-full bg-[#1A365D]"></div> Meta</span>
                    <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400"><div className="w-2 h-2 rounded-full bg-[#10B981]"></div> Realizado</span>
                </div>
                <button className="text-[10px] font-black text-[#1A365D] uppercase tracking-widest flex items-center gap-1">
                    Exportar CSV <ArrowUpRight className="w-3 h-3" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
