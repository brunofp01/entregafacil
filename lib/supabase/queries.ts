import { createClient } from '@supabase/supabase-js';

const getSupabase = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        // Retorna um mock ou null se for durante o build para não quebrar o prerender
        return null;
    }

    return createClient(supabaseUrl, supabaseAnonKey);
};

// Utility to get current user Profile
export const getUserProfile = async (userId: string) => {
    try {
        const supabase = getSupabase();
        if (!supabase) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) return null;
        return data;
    } catch (e) {
        return null;
    }
};

// Utility to get current user Role
export const getUserRole = async (userId: string) => {
    try {
        const supabase = getSupabase();
        if (!supabase) return 'tenant';

        const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();
        
        if (error) return 'tenant';
        return data.role as 'tenant' | 'agency' | 'admin';
    } catch (e) {
        return 'tenant';
    }
};

// Utility to get Property and Contract for a Tenant
export const getTenantContract = async (tenantId: string) => {
    try {
        const supabase = getSupabase();
        if (!supabase) return null;

        const { data, error } = await supabase
            .from('contracts')
            .select(`
                *,
                properties (*)
            `)
            .eq('tenant_id', tenantId)
            .single();

        if (error) return null;
        return data;
    } catch (e) {
        return null;
    }
};

// Utility to create a vacancy inspection request
export const requestVacancyInspection = async (contractId: string, notes: string = '') => {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('inspections')
    .insert([
      { 
        contract_id: contractId,
        type: 'saida',
        notes: notes || 'Solicitação de desocupação via dashboard.',
        photo_urls: []
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};
