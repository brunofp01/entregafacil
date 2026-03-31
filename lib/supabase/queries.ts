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
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (error) throw error;
    return data;
};

// Utility to get Property and Contract for a Tenant
export const getTenantContract = async (tenantId: string) => {
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

    if (error) throw error;
    return data;
};
