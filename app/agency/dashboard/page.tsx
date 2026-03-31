'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/lib/context/UserContext';
import { createBrowserClient } from '@/lib/supabase/client';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight, 
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AgencyDashboard() {
  const { profile, loading: userLoading } = useUser();
  const [stats, setStats] = useState({
    activeContracts: 0,
    totalProperties: 0,
    pendingInspections: 0,
    reserveFund: 0
  });
  const [recentInspections, setRecentInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    async function fetchAgencyData() {
      if (profile?.id && supabase) {
        try {
          // Fetch stats (Mocked for now until properties are linked)
          setStats({
            activeContracts: 124,
            totalProperties: 156,
            pendingInspections: 5,
            reserveFund: 45200.00
          });

          // Fetch pending inspections
          const { data: inspections } = await supabase
            .from('inspections')
            .select(`
                *,
                contracts (
                    tenant_id,
                    properties (address)
                )
            `)
            .eq('type', 'saida')
            .order('created_at', { ascending: false })
            .limit(5);
          
          setRecentInspections(inspections || []);
        } catch (error) {
          console.error("Error fetching agency stats:", error);
        }
      }
      setLoading(false);
    }
    fetchAgencyData();
  }, [profile, supabase]);

  if (loading || userLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-[#1A365D] rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Carregando painel de gestão...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-count">
      {/* Header with Search and Actions */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#1A365D] tracking-tight">Gestão Imobiliária</h1>
          <p className="text-slate-500 font-medium">Bem-vindo, {profile?.full_name || 'Admin'}.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" /> Filtros
          </button>
          <Link 
            href="/agency/properties"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1A365D] text-white rounded-2xl text-xs font-bold hover:bg-[#1a365df0] transition-all shadow-xl shadow-blue-900/20"
          >
            <Plus className="w-4 h-4" /> Novo Imóvel
          </Link>
        </div>
      </header>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-soft">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-[#1A365D] rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+12%</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Imóveis Ativos</p>
          <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.totalProperties}</h3>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-soft">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contratos Protegidos</p>
          <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.activeContracts}</h3>
        </div>

        <div className="bg-[#1A365D] text-white p-6 rounded-3xl shadow-xl shadow-blue-900/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/10 rounded-xl text-white">
              <Plus className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">Fundo de Reserva</p>
          <h3 className="text-3xl font-black mt-1">R$ {stats.reserveFund.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-soft">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vistorias Pendentes</p>
          <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.pendingInspections}</h3>
        </div>
      </div>

      {/* Secondary Layout: Table and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Table Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-4xl shadow-soft overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Solicitações de Desocupação</h3>
              <Link href="/agency/inspections" className="text-xs font-bold text-[#1A365D] hover:underline flex items-center gap-1">
                Ver Todas <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">Imóvel</th>
                    <th className="px-6 py-4">Data Solicitação</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentInspections.length > 0 ? (
                    recentInspections.map((insp) => (
                      <tr key={insp.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800">{insp.contracts?.properties?.address || 'Imóvel Desconhecido'}</p>
                          <p className="text-[10px] font-medium text-slate-400">ID: #{insp.id}</p>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-500">
                          {new Date(insp.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-black border border-amber-100">
                            <AlertCircle className="w-3 h-3" /> AGUARDANDO VISTORIA
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-2 text-slate-300 hover:text-[#1A365D] transition-all">
                            <ArrowUpRight className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium text-sm">
                        Nenhuma solicitação pendente no momento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar/Alerts Area */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-4xl p-8 shadow-soft space-y-6">
            <h3 className="font-bold text-slate-800">Alertas de Manutenção</h3>
            <div className="space-y-4">
              {[
                { label: 'Pintura Necessária', property: 'Ed. Horizonte, 402', color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Reparo Hidráulico', property: 'Vila Madalena, 10', color: 'text-emerald-500', bg: 'bg-emerald-50' },
              ].map((alert, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className={`w-10 h-10 ${alert.bg} ${alert.color} rounded-xl flex items-center justify-center shrink-0`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{alert.label}</p>
                    <p className="text-xs font-bold text-slate-700">{alert.property}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 rounded-2xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#1A365D] hover:border-[#1A365D]/30 transition-all">
              Ver Histórico Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
