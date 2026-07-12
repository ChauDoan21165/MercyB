type FeatureFlagImportMeta = ImportMeta & {
  env?: Record<string, string | boolean | undefined>;
};

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
          : (import.meta as FeatureFlagImportMeta)?.env?.[key];
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
   * Teacher decision engine on the live grammar-correction turn (WP-000).
   *
   * OFF (default): the tutor turn uses the original `correctWithTimingAwareness`
   * path — byte-identical to pre-WP-000 main. ON: the turn routes through
   * `decideTeacherAction` (src/lib/tm-int/decisionEngineTurnAdapter) for
   * suppress/defer/show; deferred corrections still resurface via the same
   * deferred-correction queue (advanceTurn). Default OFF per the "default OFF for
   * any new visible system" rule; flip to true only after re-review.
   */
  TUTOR_DECISION_ENGINE_ENABLED: false,

  /**
   * Prediction-error capture, SHADOW MODE (WP-001).
   *
   * OFF (default): the live tutor turn is byte-identical to today — no prediction is
   * captured, no surprise is drained, nothing learner-facing changes. ON: on every turn
   * the decision pipeline records a lookup-table prediction of the learner outcome
   * BEFORE the outcome exists, then measures surprise once the outcome arrives
   * (src/lib/tm-int/pred). Strict side-channel: learner-facing output is identical
   * whether this is on or off (see pred/shadowRunner + wp001FlagOffByteIdentical test).
   * Default OFF per the "default OFF for any new system" rule.
   */
  TUTOR_PREDICTION_CAPTURE_ENABLED: readEnvBool("VITE_TUTOR_PREDICTION_CAPTURE_ENABLED", false),

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
   * Placement results — surface the already-computed runtime decision to the
   * learner. The placement runtime pipeline (applyPlacementRuntimeDecision)
   * already writes placementValidity / runtimeDecision / teacherContext and
   * per-skill scoreEligible onto the results object, but <ResultsProfile>
   * renders only cefr/confidence/summary and drops the rest. When ON, a
   * modest "How we assessed you" rationale section is rendered under the
   * summary — derived purely from those existing result fields (no new
   * fetches). It honestly surfaces reference/ineligible results (product
   * audio failure, blocked mic, rapid-guessing) rather than hiding them.
   * When OFF, <ResultsProfile> output is byte-identical to before.
   * Reads env `VITE_PLACEMENT_DECISION_VISIBLE`; defaults to OFF.
   */
  PLACEMENT_DECISION_VISIBLE: readEnvBool("VITE_PLACEMENT_DECISION_VISIBLE", false),

  /**
   * Shareable Interference Profile v1. When ON, the placement decision panel can
   * render a client-only share card from the already-computed placement result.
   * Default OFF; reads env `VITE_INTERFERENCE_PROFILE_SHARE`. The card is drawn
   * in-browser only and does not persist or send new data.
   */
  INTERFERENCE_PROFILE_SHARE: readEnvBool("VITE_INTERFERENCE_PROFILE_SHARE", false),

  /**
   * Two-price funnel test. Default OFF: the Pricing page uses the existing
   * display prices and Stripe price ids. When ON, a persisted 50/50 assignment
   * may show an alternate configured price variant, provided all alternate
   * display amounts and Stripe price ids are present in env.
   */
  PRICE_TEST_ENABLED: readEnvBool("VITE_PRICE_TEST_ENABLED", false),

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

  /**
   * Vietnamese tone pronunciation feedback MVP.
   * When ON: the Speak flow can show a small learner-facing tone card
   * for supported Vietnamese tones only. When OFF: no tone feedback is
   * rendered and no tone scoring call is attempted.
   */
  VIETNAMESE_TONE_FEEDBACK_MVP_ENABLED: readEnvBool("VITE_VIETNAMESE_TONE_FEEDBACK_MVP_ENABLED", false),

  /**
   * English pronunciation feedback MVP for Vietnamese learners.
   * When ON: the Speak flow can show a small learner-facing English
   * sound card using Azure phoneme detail. When OFF: no English
   * pronunciation feedback is rendered.
   */
  ENGLISH_PRONUNCIATION_FEEDBACK_MVP_ENABLED: false,

  /**
   * Premium/trial gate + per-session cap for Azure DETAILED pronunciation
   * scoring (per-word/per-phoneme). Azure assessment is cost-bearing, so the
   * detailed scorer is reserved for premium/trial users and capped per session.
   * When ON: free users get NO detailed score (and never a fake number); a
   * premium user who exhausts the cap sees a warm message and keeps the by-ear
   * self-compare. When OFF: legacy behavior (detailed scoring guarded only by
   * the Azure-batch env flag + session). The free by-ear self-compare loop is
   * unaffected either way. Reads env `VITE_AI_TUTOR_PRON_PREMIUM_GATE_ENABLED`;
   * default OFF.
   */
  AI_TUTOR_PRONUNCIATION_PREMIUM_GATE_ENABLED: readEnvBool("VITE_AI_TUTOR_PRON_PREMIUM_GATE_ENABLED", false),

  /**
   * Track 2 — anonymized learner-interaction capture pipeline.
   * When ON: correction-engine + pronunciation results are sent
   * (fire-and-forget) to the learner-capture edge function, which HMACs
   * the user id, scrubs PII, and inserts into learner_interaction_capture.
   * Gated additionally by per-user consent (public.learning_data_consent)
   * — both must pass before anything is captured.
   * When OFF: every captureCorrection/capturePronunciation call is a no-op.
   * Master kill switch. Reads env `VITE_LEARNING_CAPTURE_ENABLED`; default OFF.
   */
  LEARNING_CAPTURE_ENABLED: readEnvBool("VITE_LEARNING_CAPTURE_ENABLED", false),

  /** AI Tutor mock UI shell — behind feature flag, mock responses only. */
  AI_TUTOR_UI_ENABLED: true,

  /**
   * Lane F — client-first gamification module (streaks/XP/daily goals/
   * achievements) under src/features/gamification/. HIDDEN: default OFF,
   * no route or nav surface ships until this is flipped. State lives in
   * IndexedDB behind GamificationStore — no new tables/migrations, touches
   * nothing in A/B/C/D/billing/auth/audio. Reads env
   * `VITE_FEATURE_GAMIFICATION`; defaults to OFF.
   */
  FEATURE_GAMIFICATION: readEnvBool("VITE_FEATURE_GAMIFICATION", false),

  /**
   * Lane D — Spaced-repetition Review module (src/features/review/).
   * When ON: exposes the /review routes and the header nav entry.
   * When OFF: the module is fully dark (routes 404 to /, nav entry hidden).
   * Reads from env `VITE_REVIEW_ENABLED`; defaults to OFF. Isolated module;
   * ships as one deliberate release after review — see
   * src/features/review/README.md.
   */
  REVIEW_ENABLED: readEnvBool("VITE_REVIEW_ENABLED", false),

  /**
   * Notification engine (on-device local notifications: daily reminder,
   * evening streak-save, due-review). HIDDEN: default OFF. When OFF every
   * public API in src/notificationEngine no-ops — no permission checks,
   * prompts, scheduling, or listeners. The local-notifications adapter is
   * additionally guarded by Capacitor.isNativePlatform() so web/CI no-op
   * green. Reads env `VITE_FEATURE_NOTIFICATIONS`; defaults to OFF.
   */
  FEATURE_NOTIFICATIONS: readEnvBool("VITE_FEATURE_NOTIFICATIONS", false),

  /**
   * Lane D1 — conversation retention hooks. ON in local/dev so Lane A can
   * integrate and QA copy/XP quickly; OFF in production builds unless an
   * explicit deploy env opts in. The runtime DB flag with the same key can
   * further dark-launch visible surfaces.
   */
  CONVERSATION_RETENTION_HOOKS: readEnvBool(
    "VITE_CONVERSATION_RETENTION_HOOKS",
    Boolean(import.meta.env.DEV),
  ),

  /**
   * Web Vitals RUM → GA4. When ON (default), LCP/INP/CLS/TTFB are forwarded
   * to GA4 via window.gtag, behind the existing marketing-consent gate.
   * Set VITE_WEB_VITALS_GA4_ENABLED=false in the Netlify env panel to disable
   * this without a code change or rebuild (emergency kill switch).
   */
  WEB_VITALS_GA4_ENABLED: readEnvBool("VITE_WEB_VITALS_GA4_ENABLED", true),
};

/**
 * Phase B — VN→Chinese deterministic correction delivery.
 *
 * When ON: the AI Tutor turn loop routes `target === "zh"` learner input through
 * the real correction engine (`correctWithTutorRules(input, "zh")`, the
 * chineseCorrectionRules), so Chinese corrections actually execute for a learner.
 * When OFF (default): zh input keeps the legacy non-engine demo path — English
 * delivery is never affected either way (the `en` branch is untouched).
 *
 * Read at CALL TIME (not an import-time constant) so the acceptance E2E can flip
 * it per-test via vi.stubEnv without module-cache games. Reads env
 * `VITE_AI_TUTOR_ZH_CORRECTION_ENABLED`; default OFF ("default OFF for any new
 * visible system").
 */
export function isZhTutorCorrectionEnabled(): boolean {
  return readEnvBool("VITE_AI_TUTOR_ZH_CORRECTION_ENABLED", false);
}

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
