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
    const fetchUser = async () => {
      // Prevent duplicate runs in Strict Mode
      if (fetchDone.current) return;
      
      const supabase = createBrowserClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        if (session?.user) {
          const { data: profileRow, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
             console.warn("Profile fetch error (406 or missing):", profileError.message);
             
             // Auto-recover for 406 or missing profiles
             if (profileError.code === 'PGRST116' || profileError.message.includes('406')) {
                const email = session.user.email || '';
                let determinedRole = 'tenant';
                if (email.includes('admin')) determinedRole = 'admin';
                else if (email.includes('imobiliaria') || email.includes('agency')) determinedRole = 'agency';

                const newProfile = {
                    id: session.user.id,
                    full_name: session.user.user_metadata?.full_name || 'Usuário de Teste',
                    role: determinedRole
                };
                
                await supabase.from('profiles').upsert(newProfile);
                setProfile(newProfile);
             } else {
                setProfile(null);
             }
          } else {
             setProfile(profileRow);
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setProfile(null);
      } finally {
        fetchDone.current = true;
        setLoading(false);
      }
    };

    fetchUser();

    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      if (session?.user) {
        setUser(session.user);
        try {
          const userProfile = await getUserProfile(session.user.id);
          setProfile(userProfile);
        } catch (err) {
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
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
