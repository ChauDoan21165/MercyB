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
import { isNativePlatform } from "@/lib/platform";
import {
  migrateLocalStreakOnce,
  writeBrowserTimezoneOnce,
} from "@/lib/streakMigration";
import { heartbeatSession, logUserSession } from "@/services/userSessions";
import {
  applyPendingReferralOnAuth,
  retryReferralRewardOnAuth,
} from "@/lib/referral/referralClient";

const SESSION_HEARTBEAT_MS = 5 * 60 * 1000;

/**
 * Keep RevenueCat's App User ID in sync with the current Supabase user.
 * No-op on web; lazy-imports the plugin so the web bundle never loads
 * it. Called from AuthProvider on sign-in success and sign-out. Both
 * Purchases.logIn and Purchases.logOut are idempotent per RevenueCat's
 * docs — safe to call on repeated onAuthStateChange events (e.g. token
 * refresh) without extra cost. Errors are swallowed (dev-warn only) so
 * an IAP-side hiccup can never block auth UX.
 */
async function syncRevenueCatOnAuth(userId: string | null): Promise<void> {
  if (!isNativePlatform()) return;
  try {
    const { Purchases } = await import("@revenuecat/purchases-capacitor");
    if (userId) {
      await Purchases.logIn({ appUserID: userId });
    } else {
      await Purchases.logOut();
    }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[auth] RevenueCat identity sync failed:", err);
    }
  }
}

/**
 * V9 fix (audit-user-journey-v9 Path 1 R1): the `handle_new_user()`
 * SQL trigger inserts a `profiles` row on every new `auth.users`
 * insert, but has no error handler. If that insert silently fails
 * (constraint, permissions, transient outage) the user exists in
 * `auth.users` but no `profiles` row does — premium status, leaderboard,
 * streak, and Mercy memory all read blank for the rest of the session.
 *
 * Backfill on every verified-session event. Idempotent: the SELECT
 * short-circuits when the row already exists, so we add at most one
 * round-trip per sign-in. Errors are swallowed (dev-warn only) so a
 * Supabase hiccup never blocks auth UX.
 */
async function backfillProfileRowOnAuth(
  userId: string | null,
  email: string | null,
): Promise<void> {
  if (!userId) return;
  try {
    const { data: existing, error: selectError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    if (selectError) {
      if (import.meta.env.DEV) {
        console.warn("[auth] profile backfill check failed:", selectError.message);
      }
      return;
    }
    if (existing) return;
    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert(
        { id: userId, email: email ?? null },
        { onConflict: "id" },
      );
    if (upsertError && import.meta.env.DEV) {
      console.warn("[auth] profile backfill upsert failed:", upsertError.message);
    }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[auth] backfillProfileRowOnAuth crashed:", err);
    }
  }
}

/**
 * Fire-and-forget tasks tied to a verified session: push browser timezone
 * on first login, and run the one-time localStorage → server streak
 * migration. Both functions are internally idempotent and guarded by the
 * SERVER_STREAKS_ENABLED feature flag — this function is a no-op when the
 * flag is off.
 */
/**
 * A9 — Referral wiring. Two passes per verified auth event:
 *   1. apply: if a `?ref=` code was captured before signup, redeem it
 *      now (the redeem fires the immediate referred-user grant via the
 *      apply RPC).
 *   2. retry: re-attempt the owner-side reward, which is held until
 *      the referred user reaches Day 3. Idempotent — a no-op once
 *      both sides are granted or while still inside the gate.
 * Errors are swallowed (dev-warn) so a referral hiccup never blocks
 * auth UX.
 */
async function processReferralOnAuth(userId: string | null): Promise<void> {
  if (!userId) return;
  try {
    await applyPendingReferralOnAuth(userId);
  } catch (err) {
    if (import.meta.env.DEV) console.warn("[auth] applyPendingReferral:", err);
  }
  try {
    await retryReferralRewardOnAuth(userId);
  } catch (err) {
    if (import.meta.env.DEV) console.warn("[auth] retryReferralReward:", err);
  }
}

async function runStreakBootTasksOnAuth(userId: string | null): Promise<void> {
  if (!userId) return;
  try {
    await writeBrowserTimezoneOnce();
  } catch (err) {
    if (import.meta.env.DEV) console.warn("[auth] writeBrowserTimezone:", err);
  }
  try {
    await migrateLocalStreakOnce();
  } catch (err) {
    if (import.meta.env.DEV) console.warn("[auth] migrateLocalStreak:", err);
  }
}

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
      // Always sync RevenueCat to logged-out state. Matches the existing
      // safeSetSession(null) pattern that clears UI in both try + catch.
      // Fire-and-forget; no-op on web.
      void syncRevenueCatOnAuth(null);
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
            // Sync RevenueCat App User ID with the fresh Supabase session.
            // Uses verified-session filter so unverified emails do not get
            // identified to RevenueCat. Fire-and-forget; no-op on web.
            const verifiedSession = getVerifiedSession(nextSession ?? null);
            const verifiedId = verifiedSession?.user?.id ?? null;
            const verifiedEmail = verifiedSession?.user?.email ?? null;
            void syncRevenueCatOnAuth(verifiedId);
            // V9 fix: ensure a profiles row exists even if the
            // handle_new_user() trigger silently failed. Idempotent and
            // fire-and-forget. See backfillProfileRowOnAuth above.
            void backfillProfileRowOnAuth(verifiedId, verifiedEmail);
            // A9 referral: apply pending ?ref= code + retry owner-side
            // reward (Day-3 gated). Both calls are idempotent.
            void processReferralOnAuth(verifiedId);
            // Wave 2 Step 2: server-streaks boot tasks. No-op when the
            // feature flag is off. Runs per-session on verified sessions,
            // but each task is internally idempotent.
            void runStreakBootTasksOnAuth(verifiedId);
            // Log user_sessions row on every verified auth event.
            // Gated internally by behaviorTrackingEnabled flag.
            const verifiedToken =
              getVerifiedSession(nextSession ?? null)?.access_token ?? null;
            void logUserSession(verifiedId, verifiedToken);
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

  // Heartbeat: touch user_sessions.last_activity every 5 minutes while a
  // verified session is active. Ensures the admin "live users" view sees
  // fresh activity instead of just the sign-in timestamp.
  useEffect(() => {
    const verifiedUserId = getVerifiedSession(session)?.user?.id ?? null;
    if (!verifiedUserId) return;

    const intervalId = setInterval(() => {
      void heartbeatSession(verifiedUserId);
    }, SESSION_HEARTBEAT_MS);

    return () => clearInterval(intervalId);
  }, [session]);

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