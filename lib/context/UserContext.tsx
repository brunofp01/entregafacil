'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { getUserProfile } from '@/lib/supabase/queries';

type UserContextType = {
  user: any;
  profile: any;
  loading: boolean;
  role: 'tenant' | 'agency' | 'admin' | null;
};

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  loading: true,
  role: null,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    const fetchUser = async () => {
      if (!supabase) return;

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        const userProfile = await getUserProfile(session.user.id);
        setProfile(userProfile);
      }

      setLoading(false);
    };

    fetchUser();

    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const userProfile = await getUserProfile(session.user.id);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <UserContext.Provider value={{ user, profile, loading, role: profile?.role || null }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
