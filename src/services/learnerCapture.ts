/**
 * Track 2 — Learner interaction capture (client service).
 *
 * Two public entry points — `captureCorrection` and `capturePronunciation`
 * — called from page-level handlers (AiTutor, SpeechDrillPage,
 * PhonemeDrillPage) right next to the existing telemetry calls. NEVER
 * called from inside src/lib/tutor or src/lib/pronunciation engines.
 *
 * Contract (mirrors services/speechAttempts.ts):
 *   - Master kill switch: FEATURE_FLAGS.LEARNING_CAPTURE_ENABLED. OFF →
 *     every call is a no-op returning { ok:true, skipped:true,
 *     reason:'flag_off' }.
 *   - No-op for anon / signed-out (no user id to capture).
 *   - No-op unless the user has opted in (public.learning_data_consent,
 *     cached per-user with a short TTL so the gate stays off the hot path).
 *   - Fire-and-forget safe: callers `void captureCorrection(...)`. Never
 *     throws; network / RLS errors are logged and returned as { ok:false }.
 *   - The browser sends NO raw user_id and holds NO HMAC pepper. The
 *     learner-capture edge function derives the user from the JWT, applies
 *     HMAC(user_id, pepper), scrubs PII, and performs the insert.
 *
 * Anonymization, PII scrubbing, and the actual INSERT all happen
 * server-side in supabase/functions/learner-capture. This service is only
 * the gate + the fire-and-forget dispatch.
 */

import { supabase } from "@/lib/supabaseClient";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import type { ScoreResult } from "@/lib/pronunciation/scorer";

/** Version string stamped on captured rows + matched against consent. */
export const LEARNING_CAPTURE_CONSENT_VERSION = "2026-07-03";

const EDGE_FUNCTION = "learner-capture";

// ── Consent cache ─────────────────────────────────────────────────────────
// Same posture as services/behaviorTrackingFlag.ts: cache the per-user
// consent decision in-memory for a short TTL so we don't issue a Supabase
// read on every correction / scored attempt.
const CONSENT_TTL_MS = 5 * 60 * 1000;
type ConsentCacheEntry = { consented: boolean; expiresAt: number };
const consentCache = new Map<string, ConsentCacheEntry>();

/** Test-only hook. */
export function __resetLearnerCaptureConsentCache(): void {
  consentCache.clear();
}

async function hasLearningConsent(userId: string): Promise<boolean> {
  const cached = consentCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) return cached.consented;

  try {
    const { data, error } = await supabase
      .from("learning_data_consent")
      .select("consented")
      .eq("user_id", userId)
      .maybeSingle();

    const consented = !error && !!data && data.consented === true;
    consentCache.set(userId, { consented, expiresAt: Date.now() + CONSENT_TTL_MS });
    return consented;
  } catch {
    consentCache.set(userId, { consented: false, expiresAt: Date.now() + CONSENT_TTL_MS });
    return false;
  }
}

// ── Public types ────────────────────────────────────────────────────────
export type CaptureResult =
  | { ok: true; skipped: false; id: string | null }
  | { ok: true; skipped: true; reason: "flag_off" | "anon" | "no_consent" | "empty" }
  | { ok: false; error: string };

export type CaptureCorrectionInput = {
  /** Learner's raw input (scrubbed server-side before storage). */
  userText: string;
  /** Engine output; omit/empty when the engine abstained. */
  correctedText?: string | null;
  /** correctionEngine status; mapped to 'abstained' when nothing fired. */
  status: "corrected" | "unchanged" | "needs_ai" | "abstained";
  /** Rule ids the engine fired (empty = abstain). */
  appliedRuleIds: string[];
  targetLanguage?: string | null;
  explainLanguage?: string | null;
  /** 'correction' (grammar tab) or 'conversation' (chat). */
  interactionType?: "correction" | "conversation";
  sessionId?: string | null;
};

export type CapturePronunciationInput = {
  target: string;
  recognized: string;
  score: ScoreResult;
  /** Optional VN tone-contour result, stored as-is. */
  toneScores?: unknown;
  targetLanguage?: string | null;
  sessionId?: string | null;
};

// ── Internal dispatch ─────────────────────────────────────────────────────
type CapturePayload = Record<string, unknown>;

function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object") {
    const m = (err as Record<string, unknown>).message;
    if (typeof m === "string") return m;
  }
  return String(err);
}

async function dispatch(payload: CapturePayload): Promise<CaptureResult> {
  if (!FEATURE_FLAGS.LEARNING_CAPTURE_ENABLED) {
    return { ok: true, skipped: true, reason: "flag_off" };
  }

  let userId: string | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id ?? null;
  } catch {
    userId = null;
  }
  if (!userId) return { ok: true, skipped: true, reason: "anon" };

  if (!(await hasLearningConsent(userId))) {
    return { ok: true, skipped: true, reason: "no_consent" };
  }

  const body: CapturePayload = {
    ...payload,
    consent_version: LEARNING_CAPTURE_CONSENT_VERSION,
    client_ts: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase.functions.invoke<{
      ok?: boolean;
      skipped?: boolean;
      reason?: string;
      id?: string | null;
      error?: string;
    }>(EDGE_FUNCTION, { body });

    if (error) {
      const message = extractErrorMessage(error);
      console.warn("[learnerCapture] invoke failed:", message);
      return { ok: false, error: message };
    }
    if (data?.skipped) {
      return {
        ok: true,
        skipped: true,
        reason: (data.reason as "anon" | "no_consent") ?? "no_consent",
      };
    }
    return { ok: true, skipped: false, id: data?.id ?? null };
  } catch (err) {
    const message = extractErrorMessage(err);
    console.warn("[learnerCapture] invoke threw:", message);
    return { ok: false, error: message };
  }
}

// ── Public API ──────────────────────────────────────────────────────────
export async function captureCorrection(input: CaptureCorrectionInput): Promise<CaptureResult> {
  if (!input || typeof input.userText !== "string" || !input.userText.trim()) {
    return { ok: true, skipped: true, reason: "empty" };
  }
  const status =
    Array.isArray(input.appliedRuleIds) && input.appliedRuleIds.length === 0 && input.status === "unchanged"
      ? "abstained"
      : input.status;

  return dispatch({
    interaction_type: input.interactionType ?? "correction",
    target_language: input.targetLanguage ?? null,
    explain_language: input.explainLanguage ?? null,
    input_text: input.userText,
    correction_status: status,
    applied_rule_ids: Array.isArray(input.appliedRuleIds) ? input.appliedRuleIds : [],
    corrected_text: input.correctedText ?? null,
    session_id: input.sessionId ?? null,
  });
}

export async function capturePronunciation(input: CapturePronunciationInput): Promise<CaptureResult> {
  if (!input || !input.score || !Array.isArray(input.score.wordScores)) {
    return { ok: true, skipped: true, reason: "empty" };
  }
  return dispatch({
    interaction_type: "pronunciation",
    target_language: input.targetLanguage ?? null,
    input_text: input.recognized,
    corrected_text: input.target,
    pron_overall_score: input.score.overallScore,
    pron_word_scores: input.score.wordScores,
    pron_tone_scores: input.toneScores ?? null,
    session_id: input.sessionId ?? null,
  });
}
