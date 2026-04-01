import { redirect } from 'next/navigation';
import { createClientServer } from '@/lib/supabase/server';
import TenantDashboard from '@/components/dashboard/TenantDashboard';
import { Info } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = createClientServer();
  
  // 1. Verificar Sessão no Servidor
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // 2. Buscar Perfil e Cargo no Servidor
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    // Caso o perfil não exista (raro), redirecionar ou mostrar erro amigável
    return (
      <div className="max-w-md mx-auto py-12 px-6 text-center space-y-6">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
           <Info className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Perfil Não Encontrado</h2>
        <p className="text-slate-500">Não conseguimos localizar seu perfil de usuário.</p>
        <Link href="/login?logout=true" className="inline-block bg-[#1A365D] text-white px-8 py-3 rounded-xl font-bold">
          Sair e Tentar Novamente
        </Link>
      </div>
    );
  }

  // 4. Redirecionamentos Instantâneos Baseados em Cargo (RBAC)
  if (profile.role === 'admin') {
    redirect('/admin/dashboard');
  }
  if (profile.role === 'agency') {
    redirect('/agency/dashboard');
  }

  // 5. Se for Inquilino, buscar contrato antes de renderizar
  const { data: contract } = await supabase
    .from('contracts')
    .select('*, properties(*)')
    .eq('tenant_id', user.id)
    .single();

  // 6. Renderizar Painel do Inquilino v2 (Já com dados prontos)
  return <TenantDashboard profile={profile} contract={contract} />;
}
