import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/hr360-app/services/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Optional: Listen to auth state changes from Supabase (session persistence)
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          fetchAndSetUser(session.user).finally(() => setIsInitializing(false));
        } else {
          setIsInitializing(false);
        }
      });
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          fetchAndSetUser(session.user);
        } else {
          setUser(null);
        }
      });
      return () => subscription.unsubscribe();
    } else {
      setIsInitializing(false);
    }
  }, []);

  const fetchAndSetUser = async (supabaseUser) => {
    const { data: empData } = await supabase
      .from('employees')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    const role = empData?.role || 'Employee';

    if (role.toLowerCase() !== 'admin') {
      // Strictly enforce Admin-only access across the entire app
      await supabase.auth.signOut();
      setUser(null);
      return role;
    }

    if (empData) {
      setUser({
        id: empData.id,
        name: empData.name,
        email: empData.email,
        role: empData.role,
        avatar: empData.avatar_url,
      });
    } else {
      // Fallback for new admin accounts not yet fully populated in employees table
      setUser({
        id: supabaseUser.id,
        name: supabaseUser.email.split('@')[0],
        email: supabaseUser.email,
        role: 'Admin',
        avatar: null,
      });
    }
    return role;
  };

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error('Login error:', error.message);
        setIsLoading(false);
        return { success: false, message: error.message };
      }
      if (data.user) {
        const role = await fetchAndSetUser(data.user);
        if (role?.toLowerCase() !== 'admin') {
          setIsLoading(false);
          return { success: false, message: 'Access Denied: Only Admins can log into this dashboard.' };
        }
      }
      setIsLoading(false);
      return { success: true };
    }

    // Fallback if not configured
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    return { success: false, message: 'Supabase is not configured.' };
  }, []);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
  }, []);

  const updatePassword = useCallback(async (newPassword) => {
    setIsLoading(true);
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      setIsLoading(false);
      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true };
    }
    setIsLoading(false);
    return { success: false, message: 'Supabase is not configured.' };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isInitializing, login, logout, updatePassword, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export default AuthContext;
