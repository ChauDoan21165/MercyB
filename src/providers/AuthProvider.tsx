// src/providers/AuthProvider.tsx
/**
 * MercyBlade Blue — Auth Provider (SINGLE SESSION SOURCE OF TRUTH)
 * Path: src/providers/AuthProvider.tsx
 * Version: MB-BLUE-94.13.19 — 2026-01-11 (+0700)
 *
 * CHANGE (94.13.19):
 * - Add signOut() to the Auth context (still single listener).
 * - UI should call ctx.signOut(), not supabase.auth.signOut() directly.
 *
 * GOAL:
 * - One Supabase auth listener for the whole app.
 * - All UI reads session from ONE place.
 *
 * RULE:
 * - Must use canonical client: "@/lib/supabaseClient"
 * - DEV ONLY may log JWT for debugging
 *
 * PERF PATCH (2026-03-08):
 * - Remove eager module-scope Supabase import.
 * - Lazy-load Supabase client inside provider effects/actions.
 * - Keeps provider behavior the same while reducing top-level startup pressure.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";

type SupabaseClientType = typeof import("@/lib/supabaseClient")["supabase"];

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

let supabaseClientPromise: Promise<SupabaseClientType> | null = null;

async function getSupabaseClient(): Promise<SupabaseClientType> {
  if (!supabaseClientPromise) {
    supabaseClientPromise = import("@/lib/supabaseClient").then(
      (mod) => mod.supabase
    );
  }
  return supabaseClientPromise;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const unsubRef = useRef<null | (() => void)>(null);

  const refreshSession = useCallback(async () => {
    try {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase.auth.getSession();

      if (error && import.meta.env.DEV) {
        console.warn("[auth] getSession failed:", error.message);
      }

      setSession(data?.session ?? null);

      if (import.meta.env.DEV && data?.session?.access_token) {
        console.log("[JWT]", data.session.access_token);
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn("[auth] refreshSession crashed:", err);
      }
      setSession(null);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const supabase = await getSupabaseClient();
      await supabase.auth.signOut();
    } finally {
      setSession(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    void (async () => {
      try {
        const supabase = await getSupabaseClient();

        const { data, error } = await supabase.auth.getSession();
        if (!mounted) return;

        if (error && import.meta.env.DEV) {
          console.warn("[auth] getSession failed:", error.message);
        }

        setSession(data?.session ?? null);

        if (import.meta.env.DEV && data?.session?.access_token) {
          console.log("[JWT]", data.session.access_token);
        }

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

        unsubRef.current = () => {
          sub?.subscription?.unsubscribe();
        };
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn("[auth] boot crashed:", err);
        }
        if (mounted) {
          setSession(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
      unsubRef.current?.();
      unsubRef.current = null;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      refreshSession,
      signOut,
    }),
    [session, isLoading, refreshSession, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}