import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  resendVerification: (email: string) => Promise<{ error: Error | null }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[Auth] Event:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    if (error) {
      return { error };
    }
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { error };
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const forgotPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/auth`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    if (error) return { error };
    return { error: null };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) return { error };
    return { error: null };
  };

  const resendVerification = async (email: string) => {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) return { error };
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ user, session, signUp, signIn, signOut, forgotPassword, signInWithGoogle, resendVerification, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
