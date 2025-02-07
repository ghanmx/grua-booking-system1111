import { createContext, useContext, useEffect } from 'react';
import { supabase } from '../../config/supabase.config';
import { SupabaseAuthProvider, useSupabaseAuth } from './auth';

const SupabaseContext = createContext(null);

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        supabase.removeAllChannels();
      }
    });

    return () => {
      if (authListener && typeof authListener.subscription.unsubscribe === 'function') {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <SupabaseContext.Provider value={supabase as any}>
      {children}
    </SupabaseContext.Provider>
  );
};export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

export { useSupabaseAuth, SupabaseAuthProvider };
