import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '../../config/supabase.config';
import { SupabaseAuthProvider, useSupabaseAuth } from './auth';

const SupabaseContext = createContext();

// Proveedor de Supabase
export const SupabaseProvider = ({ children }) => {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        supabase.removeAllChannels();
      }
    });

    return () => {
      if (authListener && typeof authListener.unsubscribe === 'function') {
        authListener.unsubscribe();
      }
    };
  }, []);

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
};

// Hook para usar el contexto de Supabase
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

// Exportaciones adicionales
export { useSupabaseAuth, SupabaseAuthProvider };
