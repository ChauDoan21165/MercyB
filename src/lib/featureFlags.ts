// src/lib/featureFlags.ts — MB-BLUE-93.9 — 2025-12-24 (+0700)

/**
 * Two flag mechanisms coexist here:
 *
 * 1) Compile-time constants (FEATURE_FLAGS below) — flipped by editing the
 *    source and shipping a build. Good for visibility gates that must be
 *    guaranteed-off in production without a DB dependency.
 *
 * 2) Runtime DB-backed flags (public.feature_flags table) — flipped via
 *    SQL at any time, with optional per-user cohorts (enabled_user_ids[]).
 *    Use isFlagEnabledForUser() below for server-side code, or the React
 *    hook useFeatureFlag() for browser code.
 *
 * RULE: Default OFF for any new visible system.
 */

function readEnvBool(key: string, defaultValue: boolean): boolean {
  try {
    const raw =
      key === "VITE_PLACEMENT_TEST_ENABLED"
        ? import.meta.env.VITE_PLACEMENT_TEST_ENABLED
        : key === "VITE_PLACEMENT_V3_UI_ENABLED"
          ? import.meta.env.VITE_PLACEMENT_V3_UI_ENABLED
          : (import.meta as any)?.env?.[key];
    if (raw === undefined || raw === null || raw === "") return defaultValue;
    const s = String(raw).toLowerCase().trim();
    return s === "true" || s === "1" || s === "yes" || s === "on";
  } catch {
    return defaultValue;
  }
}

export const FEATURE_FLAGS = {
  MERCY_HOST_ENABLED: false, // flip to true when ready

  /**
   * Placement test — HIDDEN from every user-facing surface.
   *
   * WHY: the test inflates results for Vietnamese L1 learners — they
   * test as B1/B2/C1 when their real level is far lower. Root causes
   * (B1 starting anchor, 43-item bank, no listening, no real adaptive
   * logic) are documented in /private/tmp/placement-test-diagnostic.md.
   * PR #656 fixed the viRevealed-reading inflation bug but the
   * structural problems remain. Chau's call: hide the test rather than
   * ship a broken one, until a sophisticated version is built.
   *
   * This is a HIDE, not a delete. The engine, item bank, persistence,
   * test pages and unit tests are intentionally preserved intact under
   * src/lib/placement/** and src/pages/placement/** — nothing there was
   * touched. Every entry point (the 4 /placement* routes, the Home
   * "Placement test" card, the Account retake link, the StoryDetail
   * CTA, the FocusAreas no_placement CTA) is gated on this one constant.
   *
   * TO RE-ENABLE: flip this single line to `true`. That restores the
   * routes and every CTA. Before exposing it to users again, fix bug #1
   * (the B1 starting anchor) — see the diagnostic. Ref: this dispatch +
   * PR #656 + placement-test-diagnostic.md.
   */
  PLACEMENT_TEST_ENABLED: readEnvBool("VITE_PLACEMENT_TEST_ENABLED", false),

  /**
   * Placement v3 multimodal UI. Kept separate from the legacy placement gate
   * so the new surface can be reviewed without exposing it when the broader
   * placement system remains disabled.
   */
  PLACEMENT_V3_UI_ENABLED: readEnvBool("VITE_PLACEMENT_V3_UI_ENABLED", false),

  /**
   * Home page "Your focus areas" card that surfaces placement-test
   * weakness tags. Off until CC3's placement-test persistence lands
   * and manual QA passes.
   */
  FOCUS_AREAS_CARD_ENABLED: false,

  /**
   * Wave 2 Step 2 — server-side streaks (P0-2).
   * When ON: streak reads come from profiles.streak_current (server),
   * and the localStorage → server migration runs once per user.
   * When OFF: original localStorage-based streak remains.
   * Reads from env `VITE_SERVER_STREAKS_ENABLED`; defaults to OFF.
   */
  SERVER_STREAKS_ENABLED: readEnvBool("VITE_SERVER_STREAKS_ENABLED", false),

  /**
   * Wave 2 Step 3 — persist CC1's pronunciation scoring results into
   * speech_attempts so future analytics + weekly rollups have data.
   * When ON: each successful score in <SpeechDrill> fires an
   * INSERT into speech_attempts (fire-and-forget, non-blocking UI).
   * When OFF: scoring still runs and displays, but nothing is persisted.
   * Reads from env `VITE_SPEECH_PERSISTENCE_ENABLED`; defaults to OFF.
   */
  SPEECH_PERSISTENCE_ENABLED: readEnvBool("VITE_SPEECH_PERSISTENCE_ENABLED", false),

  /** AI Tutor mock UI shell — behind feature flag, mock responses only. */
  AI_TUTOR_UI_ENABLED: true,
};

/**
 * Minimal structural type for a Supabase client — accepts both the browser
 * singleton from `@/lib/supabaseClient` and a server-side client built with
 * the service-role key. We only need the `.from(...).select(...).eq(...)`
 * chain, so this avoids dragging the full @supabase/supabase-js types into
 * callers that don't already have them.
 */
type MinimalSupabaseClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (
        column: string,
        value: string,
      ) => {
        maybeSingle: () => Promise<{
          data:
            | { is_enabled: boolean | null; enabled_user_ids: string[] | null }
            | null;
          error: { message: string } | null;
        }>;
      };
    };
  };
};

/**
 * Server-side flag resolver. Resolution order (kept in sync with the
 * migration at supabase/migrations/20260424010000_feature_flags_per_user_cohort.sql
 * and the browser hook at src/hooks/useFeatureFlag.ts):
 *
 *   1. If enabled_user_ids contains userId             → ON
 *   2. Else if is_enabled = true                       → ON (global)
 *   3. Else (row missing, error, or null userId)       → OFF
 *
 * Safe to call with a null/undefined userId — unauthenticated callers fall
 * through to the global toggle only. Never throws; any error is logged and
 * the function returns false so a misconfigured flag always fails closed.
 */
export async function isFlagEnabledForUser(
  client: MinimalSupabaseClient,
  flagKey: string,
  userId: string | null | undefined,
): Promise<boolean> {
  try {
    // A15b-fix-1: route through feature_flags_public view (anon-safe).
    // service_role still hits the view fine; the view masks enabled_user_ids
    // to [auth.uid()] when the caller is in the cohort, [] otherwise.
    const { data, error } = await client
      .from("feature_flags_public")
      .select("is_enabled, enabled_user_ids")
      .eq("flag_key", flagKey)
      .maybeSingle();

    if (error) {
      console.warn(
        `[featureFlags] lookup failed for ${flagKey}:`,
        error.message,
      );
      return false;
    }
    if (!data) return false;

    const cohort = Array.isArray(data.enabled_user_ids)
      ? data.enabled_user_ids
      : [];
    if (userId && cohort.includes(userId)) return true;

    return !!data.is_enabled;
  } catch (err) {
    console.warn(`[featureFlags] unexpected error for ${flagKey}:`, err);
    return false;
  }
}
