'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/lib/context/UserContext';
import { getTenantContract } from '@/lib/supabase/queries';
import { createBrowserClient } from '@/lib/supabase/client';
import { 
  FileText, 
  Download, 
  Camera, 
  ExternalLink, 
  CheckCircle,
  Clock,
  ChevronRight
} from 'lucide-react';

export default function ContractsPage() {
  const { user, profile, loading: userLoading, role } = useUser();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inspectionsRaw, setInspectionsRaw] = useState<any[]>([]);
  const supabase = createBrowserClient();

  useEffect(() => {
    async function fetchData() {
      if (user && role === 'tenant' && supabase) {
        try {
          const contract = await getTenantContract(user.id);
          setData(contract);

          // Fetch inspections for this contract
          if (contract?.id) {
            const { data: inspData } = await supabase
              .from('inspections')
              .select('*')
              .eq('contract_id', contract.id)
              .order('created_at', { ascending: false });
            
            setInspectionsRaw(inspData || []);
          }
        } catch (error) {
          console.error("Error fetching contracts page data:", error);
        }
      }
      setLoading(userLoading);
    }
    fetchData();
  }, [user, userLoading, role, supabase]);

  if (loading || userLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-[#1A365D] rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Carregando documentos...</p>
      </div>
    );
  }

  const documents = [
    {
      id: 1,
      title: 'Termo de Cobertura All-Inclusive',
      description: 'Detalhamento jurídico de todos os reparos inclusos no seu pacote.',
      type: 'PDF',
      updatedAt: 'Mar 2026',
      icon: <FileText className="w-6 h-6 text-[#1A365D]" />,
      iconBg: 'bg-blue-50'
    },
    {
      id: 2,
      title: 'Contrato de Locação',
      description: 'Cópia digital do seu contrato de locação principal com a imobiliária.',
      type: 'PDF',
      updatedAt: 'Mar 2026',
      icon: <FileText className="w-6 h-6 text-slate-400" />,
      iconBg: 'bg-slate-50'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-count">
      <header className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Documentação</h1>
        <p className="text-slate-500 font-medium">Contratos e laudos de vistoria vinculados ao seu imóvel.</p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Arquivos e Termos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white border border-slate-100 rounded-3xl p-8 shadow-soft flex flex-col justify-between group hover:shadow-spatial transition-all duration-300">
              <div>
                <div className={`w-14 h-14 ${doc.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {doc.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 leading-tight">{doc.title}</h3>
                <p className="text-sm text-slate-500 mt-3 font-medium">{doc.description}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 uppercase">{doc.type}</span>
                  <span className="text-[10px] font-bold text-slate-400 italic">Atualizado em {doc.updatedAt}</span>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                  Visualizar
                </button>
                <button className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-all">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Laudos de Vistoria</h2>
          <button className="text-[10px] font-black text-[#1A365D] uppercase tracking-widest hover:underline flex items-center gap-1">
            Entenda o Processo <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-4">
          {inspectionsRaw.length > 0 ? (
            inspectionsRaw.map((insp) => (
                <div key={insp.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-[#1A365D]/30 transition-all">
                <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 ${insp.type === 'entrada' ? 'bg-emerald-50' : 'bg-blue-50'} rounded-2xl flex items-center justify-center shrink-0`}>
                    <Camera className={`w-6 h-6 ${insp.type === 'entrada' ? 'text-emerald-500' : 'text-blue-500'}`} />
                    </div>
                    <div>
                    <h3 className="text-lg font-bold text-slate-800 leading-none capitalize">Vistoria de {insp.type}</h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {new Date(insp.created_at).toLocaleDateString('pt-BR')}
                        </span>
                        {insp.photo_urls?.length > 0 && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            {insp.photo_urls.length} FOTOS PROFISSIONAIS
                        </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-blue-600 bg-blue-50 border-blue-100">
                        CONCLUÍDA
                        </span>
                    </div>
                    </div>
                </div>
                <div className="flex flex-col md:items-end gap-2 shrink-0">
                    <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#1A365D] transition-all shadow-lg shadow-black/10">
                    Acessar Galeria <ExternalLink className="w-3 h-3" />
                    </button>
                    <p className="text-[10px] text-slate-400 font-medium italic text-right max-w-[200px]">
                    {insp.notes || 'Nenhuma observação técnica.'}
                    </p>
                </div>
                </div>
            ))
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-12 text-center">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Nenhuma vistoria registrada.</p>
            </div>
          )}
        </div>
      </section>

      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-white rounded-2xl shadow-soft">
          <CheckCircle className="w-8 h-8 text-[#10B981]" />
        </div>
        <div className="text-center md:text-left flex-1">
          <h4 className="text-lg font-bold text-slate-800 tracking-tight">Segurança nos Dados</h4>
          <p className="text-sm text-slate-500 font-medium">Todos os documentos são assinados digitalmente com valor jurídico e armazenados com criptografia de ponta.</p>
        </div>
        <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#1A365D] transition-colors">
          LGPD & Termos
        </button>
      </div>
    </div>
  );
}
