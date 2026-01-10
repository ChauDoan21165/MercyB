/**
 * MercyBlade Blue — Auth Provider (SINGLE SESSION SOURCE OF TRUTH)
 * Path: src/providers/AuthProvider.tsx
 * Version: MB-BLUE-94.13.18 — 2026-01-04 (+0700)
 *
 * GOAL:
 * - One Supabase auth listener for the whole app.
 * - All UI reads session from ONE place.
 *
 * RULE:
 * - Must use canonical client: "@/lib/supabaseClient"
 * - DEV ONLY may log JWT for debugging
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error && import.meta.env.DEV) {
        console.warn("[auth] getSession failed:", error.message);
      }
      setSession(data?.session ?? null);

      // 🔑 DEV ONLY: explicit JWT visibility
      if (import.meta.env.DEV && data?.session?.access_token) {
        console.log("[JWT]", data.session.access_token);
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn("[auth] refreshSession crashed:", err);
      }
      setSession(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      await refreshSession();
      if (mounted) setIsLoading(false);
    };

    boot();

    const { data: sub } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (!mounted) return;

        if (import.meta.env.DEV) {
          console.log(
            "[auth] onAuthStateChange:",
            event,
            newSession?.user?.id ?? "(no-user)"
          );

          if (newSession?.access_token) {
            console.log("[JWT]", newSession.access_token);
          }
        }

        setSession(newSession ?? null);
      }
    );

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      refreshSession,
    }),
    [session, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
