"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// Mirrors the `profiles` table created in sub-phase 1.2.
export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  rating: number;
  created_at: string;
};

type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  // True until we've finished checking for an existing session on first
  // load. Lets the UI avoid flashing "logged out" before we actually know.
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile((data as Profile) ?? null);
  }, []);

  useEffect(() => {
    // Check for an existing session once on load (e.g. after a page
    // refresh) — Supabase persists sessions in localStorage.
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);
      if (sessionUser) {
        loadProfile(sessionUser.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Keep state in sync with sign-in/sign-out events, wherever in the
    // app they happen (login page, logout button, etc.).
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);
        if (sessionUser) {
          loadProfile(sessionUser.id);
        } else {
          setProfile(null);
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an <AuthProvider>.");
  }
  return context;
}
