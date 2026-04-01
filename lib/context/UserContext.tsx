'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { getUserProfile } from '@/lib/supabase/queries';

type UserContextType = {
  user: any;
  profile: any;
  loading: boolean;
  role: 'tenant' | 'agency' | 'admin' | null;
  signOut: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  loading: true,
  role: null,
  signOut: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  const fetchDone = useRef(false);

  useEffect(() => {
    const syncProfile = async (sessionUser: any) => {
      if (!sessionUser || !supabase) return null;

      try {
        const { data: profileRow, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionUser.id)
          .single();

        if (profileError) {
          console.warn("Sincronizando perfil (Auto-Recovery)...");
          
          if (profileError.code === 'PGRST116' || profileError.message.includes('406')) {
            const email = sessionUser.email || '';
            let determinedRole = 'tenant';
            if (email.includes('admin')) determinedRole = 'admin';
            else if (email.includes('imobiliaria') || email.includes('agency')) determinedRole = 'agency';

            const newProfile = {
                id: sessionUser.id,
                full_name: sessionUser.user_metadata?.full_name || 'Usuário de Teste',
                role: determinedRole
            };
            
            await supabase.from('profiles').upsert(newProfile);
            return newProfile;
          }
          return null;
        }
        return profileRow;
      } catch (err) {
        console.error("Erro na sincronização:", err);
        return null;
      }
    };

    const initAuth = async () => {
      // Prevent duplicate runs in Strict Mode
      if (fetchDone.current) return;
      
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        if (session?.user) {
          const p = await syncProfile(session.user);
          setProfile(p);
        }
      } catch (err) {
        console.error('Error in initAuth:', err);
      } finally {
        fetchDone.current = true;
        setLoading(false);
      }
    };

    initAuth();

    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setLoading(true);
        setUser(session?.user || null);
        if (session?.user) {
          const p = await syncProfile(session.user);
          setProfile(p);
        }
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signOut = async () => {
    // 1. Clear local state
    setUser(null);
    setProfile(null);
    
    // 2. Call server route to clear cookies and redirect safely
    window.location.href = '/auth/signout';
  };

  return (
    <UserContext.Provider value={{ user, profile, loading, role: profile?.role || null, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
