'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/lib/context/UserContext';
import { createBrowserClient } from '@/lib/supabase/client';
import { 
  FileText, 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  Eye,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function AgencyContracts() {
  const { profile, loading: userLoading, role } = useUser();
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createBrowserClient();

  useEffect(() => {
    async function fetchContracts() {
      if (profile?.id && supabase) {
        try {
          // Fetch all contracts (Filter by agency_id if implemented in properties)
          const { data } = await supabase
            .from('contracts')
            .select(`
                *,
                profiles:tenant_id (full_name),
                properties (*)
            `)
            .order('created_at', { ascending: false });
          
          setContracts(data || []);
        } catch (error) {
          console.error("Error fetching agency contracts:", error);
        }
      }
      setLoading(false);
    }
    fetchContracts();
  }, [profile, supabase]);

  const filteredContracts = contracts.filter(c => 
    c.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.properties?.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || userLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-[#1A365D] rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Carregando carteira de contratos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-count">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Contratos</h1>
          <p className="text-slate-500 font-medium">Controle total dos seus {contracts.length} inquilinos protegidos.</p>
        </div>
        <div className="flex gap-3">
          <button className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[#1A365D] transition-all">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-soft">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
          <input 
            type="text" 
            placeholder="Buscar por nome do inquilino ou endereço..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent focus:border-[#1A365D] focus:bg-white rounded-2xl transition-all font-medium text-sm outline-none"
          />
        </div>
        <button className="px-6 py-3.5 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-200 transition-all">
          <Filter className="w-4 h-4" /> Filtros Avançados
        </button>
      </div>

      {/* Contracts Table */}
      <div className="bg-white border border-slate-100 rounded-4xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-5">Inquilino / Imóvel</th>
                <th className="px-8 py-5">Valor Mensal</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Quitação</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-[#1A365D] rounded-xl flex items-center justify-center font-bold text-lg">
                        {contract.profiles?.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">{contract.profiles?.full_name || 'Usuário'}</p>
                        <p className="text-[11px] font-medium text-slate-400 max-w-[200px] truncate">{contract.properties?.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-700">R$ {contract.monthly_fee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">BOLETO / MÊS</p>
                  </td>
                  <td className="px-8 py-6">
                    {contract.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-100">
                        <ShieldCheck className="w-3.5 h-3.5" /> PROTEGIDO
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black border border-amber-100">
                        <AlertCircle className="w-3.5 h-3.5" /> PENDENTE
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>{contract.months_paid}/{contract.total_months} meses</span>
                        <span>{Math.round((contract.months_paid / contract.total_months) * 100)}%</span>
                      </div>
                      <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${(contract.months_paid / contract.total_months) * 100}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-[#1A365D] hover:bg-slate-100 rounded-xl transition-all">
                            <Eye className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredContracts.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="p-4 bg-slate-50 w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-slate-300">
                <Search className="w-8 h-8" />
              </div>
              <p className="text-slate-400 font-medium italic">Nenhum contrato encontrado para os critérios de busca.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
