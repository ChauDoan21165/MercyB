/**
 * Anonymous Supabase session bootstrap.
 *
 * When the `anonymous_auth_enabled` feature flag is ON and no session
 * exists in localStorage yet, calls `supabase.auth.signInAnonymously()`
 * so visitors get a real `auth.uid()` + JWT before they reach the
 * Speak tab. Without a JWT the cloud scorer (`cloudScorer.ts`) silently
 * falls back to the local Needleman-Wunsch scorer and the per-phoneme
 * detail (the launch differentiator) is lost — anon auth fixes that
 * without forcing signup.
 *
 * Strategic context: A7's onboarding audit measured the post-PR-#153
 * time-to-first-score at 12–18 seconds. With anon auth on, that 12s
 * lands the user inside the real Azure-powered experience instead of
 * a local-scored demo.
 *
 * Why a feature flag instead of unconditional bootstrap:
 *   1. Anonymous Sign-Ins must be enabled at the Supabase project level
 *      (Authentication → Providers). When disabled, signInAnonymously
 *      fails with `anonymous_provider_disabled` — the flag lets us ship
 *      the code dark and flip it on after the dashboard toggle.
 *   2. The `handle_new_user` DB trigger (migration
 *      20251208225203_*.sql) creates a profiles row on every auth.users
 *      INSERT, including anon. Until the 30-day cleanup migration ships
 *      we keep this off in case bot/scraper traffic spikes the table.
 *   3. Azure cost runaway — the per-user 30/h rate limit in
 *      azure-phoneme bounds individual abuse, but a bot cycling anon
 *      sessions could bypass it. The flag is the kill switch.
 *
 * Resilience: every error path silent-degrades. If the flag fetch
 * fails, the signInAnonymously call fails, or anything throws, the
 * function returns and the app continues without auth — the local
 * scorer keeps the Speak tab alive.
 */

import { supabase } from "@/lib/supabaseClient";

export type BootstrapResult =
  | { kind: "skipped"; reason: "session_exists" }
  | { kind: "skipped"; reason: "flag_off" }
  | { kind: "skipped"; reason: "flag_fetch_error" }
  | { kind: "anon_created"; userId: string }
  | { kind: "error"; message: string };

const FLAG_KEY = "anonymous_auth_enabled";

/**
 * Fetch the global toggle for the anonymous-auth flag. Cohort overrides
 * don't apply here — this runs before any session exists, so there's no
 * user_id to match. Returns false on any failure.
 */
async function isFlagEnabled(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("feature_flags")
      .select("is_enabled")
      .eq("flag_key", FLAG_KEY)
      .maybeSingle();
    if (error) return false;
    return Boolean(data?.is_enabled);
  } catch {
    return false;
  }
}

/**
 * Top-level bootstrap. Idempotent: if a session already exists (whether
 * anon or signed-in), returns without touching auth state. Designed to
 * be called once during AuthProvider boot, before initial getSession.
 */
export async function bootstrapAnonymousSession(): Promise<BootstrapResult> {
  try {
    const { data: existing } = await supabase.auth.getSession();
    if (existing?.session) {
      return { kind: "skipped", reason: "session_exists" };
    }

    const enabled = await isFlagEnabled();
    if (!enabled) {
      return { kind: "skipped", reason: "flag_off" };
    }

    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      // Most common: 'anonymous_provider_disabled' when the project-level
      // toggle is off. Don't crash the boot — just log and degrade.
      console.warn("[anonymousBootstrap] signInAnonymously failed:", error.message);
      return { kind: "error", message: error.message };
    }

    const userId = data?.user?.id;
    if (!userId) {
      return { kind: "error", message: "no_user_id_in_response" };
    }

    console.log("[anonymousBootstrap] anon session created", { userId });
    return { kind: "anon_created", userId };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    console.warn("[anonymousBootstrap] threw:", message);
    return { kind: "error", message };
  }
}
