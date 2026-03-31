'use client';
import { useState } from 'react';
import { 
  Camera, 
  Upload, 
  CheckCircle, 
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon,
  FileText,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function InspectionsPage() {
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState<string[]>([]);

  const simulateUpload = () => {
    setPhotos([...photos, 'base64_mock_photo']);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-count pb-24">
      <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase hover:text-[#1A365D] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
      </Link>

      <header>
        <h1 className="text-3xl font-black text-slate-900 leading-tight">Vistoria Digital</h1>
        <p className="text-slate-500 font-medium italic">Passo {step} de 3: {step === 1 ? 'Fotos do Imóvel' : step === 2 ? 'Conferência' : 'Assinatura'}</p>
      </header>

      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-4xl p-8 shadow-spatial">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl p-12 text-center hover:border-[#1A365D]/30 transition-all group">
              <div className="p-4 bg-slate-50 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-slate-400 group-hover:text-[#1A365D]" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tire ou envie fotos de cada cômodo</p>
              <button 
                onClick={simulateUpload}
                className="mt-6 flex items-center gap-2 bg-[#1A365D] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
              >
                <Upload className="w-4 h-4" /> Adicionar Fotos
              </button>
            </div>

            {/* Photo Gallery Grid */}
            <div className="mt-8 grid grid-cols-4 gap-3">
              {photos.map((_, i) => (
                <div key={i} className="aspect-square bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 relative group overflow-hidden">
                  <ImageIcon className="w-5 h-5 text-slate-300" />
                  <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex gap-4">
            <div className="p-2 bg-white rounded-xl h-fit">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">Dica do Especialista</p>
              <p className="text-xs text-amber-700/80 mt-1 leading-relaxed">Certifique-se de que as fotos mostram o estado da pintura e do piso sob luz natural. Isso evita atritos na devolução.</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-50">
        <div className="max-w-2xl mx-auto flex gap-4">
          <button 
            className="flex-1 bg-slate-50 text-slate-400 py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
            onClick={() => setStep(Math.max(1, step - 1))}
          >
            Anterior
          </button>
          <button 
            className="flex-[2] bg-[#1A365D] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/30 active:scale-95 transition-all flex items-center justify-center gap-2"
            onClick={() => setStep(Math.min(3, step + 1))}
          >
            {step < 3 ? 'Próximo Passo' : 'Finalizar Vistoria'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
