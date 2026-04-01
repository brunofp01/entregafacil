'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';

export default function DebugPage() {
  const [status, setStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  const addLog = (msg: string, data?: any) => {
    setStatus(prev => [...prev, { msg, data, time: new Date().toLocaleTimeString() }]);
  };

  useEffect(() => {
    async function runDiagnostics() {
      if (!supabase) {
        addLog("❌ Supabase Client: NULO (Verifique variáveis de ambiente)");
        setLoading(false);
        return;
      }

      addLog("✅ Supabase Client: Inicializado");

      // 1. Verificar Sessão
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) addLog("❌ Erro de Sessão", sessionError);
      else addLog("👤 Usuário Logado:", session?.user?.email || "Nenhum");

      // 2. Testar Leitura da Tabela Profiles
      if (session?.user) {
        addLog("🔍 Testando leitura da tabela 'profiles'...");
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id);
        
        if (profileError) {
          addLog(`❌ ERRO NA LEITURA (Código ${profileError.code}):`, profileError.message);
          addLog("💡 Dica: Se for 406, o cache do PostgREST está travado ou a tabela sumiu.");
        } else {
          addLog("✅ Leitura OK! Perfil:", profile);
        }

        // 3. Testar Escrita
        addLog("✍️ Testando escrita (UPSERT) na tabela 'profiles'...");
        const { error: upsertError } = await supabase.from('profiles').upsert({
          id: session.user.id,
          full_name: "Teste Debug",
          role: 'admin'
        });

        if (upsertError) addLog("❌ ERRO NA ESCRITA:", upsertError.message);
        else addLog("✅ Escrita OK!");
      }

      setLoading(false);
    }

    runDiagnostics();
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-4 font-mono text-xs">
      <h1 className="text-xl font-bold">Painel de Diagnóstico 🛠️</h1>
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-950 text-emerald-400 p-4 space-y-2 h-[500px] overflow-y-auto">
        {status.map((log, i) => (
          <div key={i} className="border-b border-slate-800 pb-2">
            <span className="text-slate-500">[{log.time}]</span> {log.msg}
            {log.data && <pre className="text-blue-300 mt-1">{JSON.stringify(log.data, null, 2)}</pre>}
          </div>
        ))}
        {loading && <div className="animate-pulse">Analisando conexão...</div>}
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="w-full bg-[#1A365D] text-white py-4 rounded-xl font-bold uppercase tracking-widest"
      >
        Repetir Teste
      </button>
    </div>
  );
}
