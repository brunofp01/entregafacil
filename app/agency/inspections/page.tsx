'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/lib/context/UserContext';
import { createBrowserClient } from '@/lib/supabase/client';
import { 
  Camera, 
  Calendar, 
  User, 
  MapPin, 
  CheckCircle, 
  Clock,
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';

export default function AgencyInspections() {
  const { profile, loading: userLoading } = useUser();
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    async function fetchInspections() {
      if (profile?.id && supabase) {
        try {
          const { data } = await supabase
            .from('inspections')
            .select(`
                *,
                contracts (
                    id,
                    months_paid,
                    total_months,
                    profiles:tenant_id (full_name),
                    properties (address)
                )
            `)
            .order('created_at', { ascending: false });
          
          setInspections(data || []);
        } catch (error) {
          console.error("Error fetching agency inspections:", error);
        }
      }
      setLoading(false);
    }
    fetchInspections();
  }, [profile, supabase]);

  if (loading || userLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-[#1A365D] rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Carregando fila de vistorias...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-count">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#1A365D] tracking-tight">Fila de Vistorias</h1>
          <p className="text-slate-500 font-medium">Controle de entradas e saídas facilitadas.</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-soft">
          <Info className="w-5 h-5 text-blue-500" />
          <p className="text-xs font-bold text-blue-700 uppercase tracking-tight">
            Você tem {inspections.filter(i => i.photo_urls?.length === 0).length} pedidos pendentes
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {inspections.length > 0 ? (
          inspections.map((insp) => (
            <div key={insp.id} className="bg-white border border-slate-100 rounded-4xl p-8 shadow-soft flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:shadow-spatial transition-all">
              <div className="flex flex-col md:flex-row gap-8 flex-1">
                {/* Visual indicator of Type */}
                <div className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center shrink-0 border uppercase tracking-tighter font-black ${
                  insp.type === 'entrada' 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  <Camera className="w-8 h-8 mb-1" />
                  <span className="text-[10px]">{insp.type}</span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-800 leading-tight">
                      {insp.contracts?.profiles?.full_name || 'Usuário'}
                    </h3>
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" /> {insp.contracts?.properties?.address}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl text-[10px] font-black border border-slate-100 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" /> SOLICITADO EM {new Date(insp.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-[10px] font-black border border-emerald-100 flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5" /> {insp.contracts?.months_paid}/{insp.contracts?.total_months} QUITAÇÃO
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row lg:flex-col items-center lg:items-end gap-3 shrink-0">
                <button className="w-full sm:w-auto bg-[#1A365D] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#1a365df0] transition-all shadow-xl shadow-blue-900/20 active:scale-95">
                  Analisar Pedido <ArrowRight className="w-5 h-5" />
                </button>
                <Link href={`/agency/contracts?id=${insp.contract_id}`} className="p-4 text-slate-400 hover:text-[#1A365D] transition-all flex items-center gap-2 text-[10px] font-black uppercase">
                  Ver Contrato <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center space-y-6 bg-slate-50 border border-dashed border-slate-200 rounded-4xl">
            <div className="w-20 h-20 bg-white rounded-3xl mx-auto flex items-center justify-center text-slate-200 shadow-soft">
              <Camera className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">Tudo em dia por aqui!</h3>
              <p className="text-sm text-slate-500 font-medium italic">Nenhuma vistoria pendente de análise no momento.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
