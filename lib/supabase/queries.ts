import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Utility to get current user Profile
export const getUserProfile = async (userId: string) => {
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
