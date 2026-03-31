'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/lib/context/UserContext';
import { createBrowserClient } from '@/lib/supabase/client';
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin, 
  Maximize2, 
  Star, 
  CheckCircle2, 
  X,
  PlusCircle,
  Home
} from 'lucide-react';

export default function AgencyProperties() {
  const { profile, loading: userLoading } = useUser();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createBrowserClient();

  // New Property Form State
  const [newProperty, setNewProperty] = useState({
    address: '',
    size_m2: '',
    finish_standard: 'standard'
  });

  useEffect(() => {
    async function fetchProperties() {
      if (profile?.id && supabase) {
        try {
          const { data } = await supabase
            .from('properties')
            .select('*')
            .order('created_at', { ascending: false });
          
          setProperties(data || []);
        } catch (error) {
          console.error("Error fetching agency properties:", error);
        }
      }
      setLoading(false);
    }
    fetchProperties();
  }, [profile, supabase]);

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !profile) return;

    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([
          { 
            ...newProperty, 
            size_m2: parseInt(newProperty.size_m2),
            agency_id: profile.id
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      setProperties([data, ...properties]);
      setIsAddModalOpen(false);
      setNewProperty({ address: '', size_m2: '', finish_standard: 'standard' });
    } catch (error) {
      console.error("Error adding property:", error);
      alert("Erro ao cadastrar imóvel.");
    }
  };

  const filteredProperties = properties.filter(p => 
    p.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || userLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-[#1A365D] rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Carregando inventário...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-count">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#1A365D] tracking-tight">Inventário de Imóveis</h1>
          <p className="text-slate-500 font-medium">Você possui {properties.length} imóveis cadastrados na plataforma.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-[#1A365D] text-white rounded-2xl text-xs font-bold hover:bg-[#1a365df0] transition-all shadow-xl shadow-blue-900/20"
        >
          <PlusCircle className="w-4 h-4" /> Cadastrar Imóvel
        </button>
      </header>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-soft relative max-w-2xl">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
        <input 
          type="text" 
          placeholder="Buscar pelo endereço do imóvel..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent focus:border-[#1A365D] focus:bg-white rounded-2xl transition-all font-medium text-sm outline-none"
        />
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((prop) => (
            <div key={prop.id} className="bg-white border border-slate-100 rounded-4xl p-8 shadow-soft group hover:shadow-spatial transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="p-4 bg-blue-50 text-[#1A365D] rounded-2xl group-hover:scale-110 transition-transform">
                    <Home className="w-6 h-6" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase ${
                    prop.finish_standard === 'premium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    prop.finish_standard === 'standard' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    'bg-slate-50 text-slate-500 border-slate-100'
                  }`}>
                    {prop.finish_standard}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-800 leading-tight">{prop.address}</h3>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" /> {prop.size_m2} m²</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Lourdes, BH</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">P</div>
                  <div className="w-8 h-8 rounded-full bg-[#1A365D] border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">S</div>
                </div>
                <button className="text-[10px] font-black text-[#1A365D] uppercase tracking-widest hover:underline">
                  Gerenciar Unidade
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="p-4 bg-slate-50 w-20 h-20 rounded-4xl mx-auto flex items-center justify-center text-slate-200">
              <Building2 className="w-10 h-10" />
            </div>
            <p className="text-slate-400 font-medium italic">Nenhum imóvel encontrado.</p>
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <form onSubmit={handleAddProperty} className="bg-white w-full max-w-lg rounded-4xl shadow-spatial overflow-hidden animate-count">
                <header className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Novo Imóvel</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Painel de Cadastro</p>
                    </div>
                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-slate-300" />
                    </button>
                </header>

                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Endereço Completo</label>
                        <input 
                            required
                            type="text" 
                            value={newProperty.address}
                            onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#1A365D] focus:bg-white outline-none transition-all font-medium"
                            placeholder="Ex: Rua Alvarenga, 123 - Ap 402"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metragem (m²)</label>
                            <input 
                                required
                                type="number" 
                                value={newProperty.size_m2}
                                onChange={(e) => setNewProperty({...newProperty, size_m2: e.target.value})}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#1A365D] focus:bg-white outline-none transition-all font-medium"
                                placeholder="85"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Padrão de Acabamento</label>
                            <select 
                                value={newProperty.finish_standard}
                                onChange={(e) => setNewProperty({...newProperty, finish_standard: e.target.value})}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#1A365D] focus:bg-white outline-none transition-all font-medium appearance-none"
                            >
                                <option value="economico">Econômico</option>
                                <option value="standard">Standard</option>
                                <option value="premium">Premium</option>
                            </select>
                        </div>
                    </div>
                </div>

                <footer className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cancelar</button>
                    <button type="submit" className="flex-1 bg-[#1A365D] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all">Salvar Imóvel</button>
                </footer>
            </form>
        </div>
      )}
    </div>
  );
}
