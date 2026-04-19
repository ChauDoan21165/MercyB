/**
 * MercyBlade Blue — Auth Provider (SINGLE SESSION SOURCE OF TRUTH)
 * Path: src/providers/AuthProvider.tsx
 *
 * HARDENING PATCH:
 * - Keep a single auth listener for the whole app.
 * - Attach listener BEFORE initial getSession() settles, to avoid startup/routing race.
 * - Prevent stale async writes after unmount.
 * - Keep session/loading transitions deterministic.
 * - Expose signOut() and refreshSession() as stable actions.
 * - signOut() increments refreshRequestIdRef so any in-flight refresh is discarded.
 *
 * EMAIL VERIFICATION PATCH:
 * - Treat unverified email sessions as not authenticated.
 * - Only expose session/user when session.user.email_confirmed_at exists.
 * - Prevent fake or unreachable email signups from getting app access before verification.
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
import { supabase } from "@/lib/supabaseClient";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getVerifiedSession(next: Session | null): Session | null {
  if (!next?.user) return null;
  if (!next.user.email_confirmed_at) return null;
  return next;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mountedRef = useRef(false);
  const unsubRef = useRef<null | (() => void)>(null);
  const refreshRequestIdRef = useRef(0);

  const safeSetSession = useCallback((next: Session | null) => {
    if (!mountedRef.current) return;
    setSession(next);
  }, []);

  const safeSetLoading = useCallback((next: boolean) => {
    if (!mountedRef.current) return;
    setIsLoading(next);
  }, []);

  const applySession = useCallback(
    (next: Session | null) => {
      safeSetSession(getVerifiedSession(next));
    },
    [safeSetSession],
  );

  const refreshSession = useCallback(async () => {
    const requestId = ++refreshRequestIdRef.current;

    safeSetLoading(true);

    try {
      const { data, error } = await supabase.auth.getSession();

      if (requestId !== refreshRequestIdRef.current) return;

      if (error && import.meta.env.DEV) {
        console.warn("[auth] getSession failed:", error.message);
      }

      applySession(data?.session ?? null);
    } catch (error) {
      if (requestId !== refreshRequestIdRef.current) return;

      if (import.meta.env.DEV) {
        console.warn("[auth] refreshSession crashed:", error);
      }

      safeSetSession(null);
    } finally {
      if (requestId === refreshRequestIdRef.current) {
        safeSetLoading(false);
      }
    }
  }, [applySession, safeSetLoading, safeSetSession]);

  const signOut = useCallback(async () => {
    // Increment request ID so any in-flight refreshSession calls are discarded
    // and cannot write a stale session back after we clear it here.
    refreshRequestIdRef.current += 1;

    safeSetLoading(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error && import.meta.env.DEV) {
        console.warn("[auth] signOut failed:", error.message);
      }

      safeSetSession(null);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("[auth] signOut crashed:", error);
      }

      safeSetSession(null);
    } finally {
      safeSetLoading(false);
    }
  }, [safeSetLoading, safeSetSession]);

  useEffect(() => {
    mountedRef.current = true;
    let localUnsub: null | (() => void) = null;

    async function boot() {
      safeSetLoading(true);

      try {
        if (!mountedRef.current) return;

        const { data: authListener } = supabase.auth.onAuthStateChange(
          (_event, nextSession) => {
            applySession(nextSession ?? null);
            safeSetLoading(false);
          },
        );

        localUnsub = () => {
          authListener.subscription.unsubscribe();
        };
        unsubRef.current = localUnsub;

        const { data, error } = await supabase.auth.getSession();
        if (!mountedRef.current) return;

        if (error && import.meta.env.DEV) {
          console.warn("[auth] initial getSession failed:", error.message);
        }

        applySession(data?.session ?? null);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("[auth] boot failed:", error);
        }

        safeSetSession(null);
      } finally {
        safeSetLoading(false);
      }
    }

    void boot();

    return () => {
      mountedRef.current = false;

      if (localUnsub) {
        localUnsub();
      } else if (unsubRef.current) {
        unsubRef.current();
      }

      unsubRef.current = null;
    };
  }, [applySession, safeSetLoading, safeSetSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      refreshSession,
      signOut,
    }),
    [session, isLoading, refreshSession, signOut],
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