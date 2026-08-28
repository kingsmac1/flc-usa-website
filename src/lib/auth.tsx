import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { isSupabaseConfigured, supabase } from "./supabase";

export type Role = "member" | "admin" | "pastor";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  /** True only while the initial session check is in flight. */
  loading: boolean;
  /** The signed-in user's role — "member" if signed out or not yet loaded. */
  role: Role;
  /** True for both "admin" and "pastor" roles. */
  isAdmin: boolean;
  /** True only for the "pastor" role — gates sensitive things like offerings. */
  isPastor: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Wrap the app in this once (e.g. in your root layout / __root.tsx) so
 * every page can call useAuth() to know who's signed in and their role.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Role>("member");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Whenever the signed-in user changes, look up their role.
  useEffect(() => {
    if (!isSupabaseConfigured || !session?.user) {
      setRole("member");
      return;
    }
    let cancelled = false;
    supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()
      .then(({ data }) => {
        if (!cancelled) setRole((data?.role as Role | undefined) ?? "member");
      });
    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  const signUp: AuthContextValue["signUp"] = async (email, password, fullName) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { error: error?.message ?? null };
  };

  const signIn: AuthContextValue["signIn"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        role,
        isAdmin: role === "admin" || role === "pastor",
        isPastor: role === "pastor",
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an <AuthProvider>");
  return ctx;
}