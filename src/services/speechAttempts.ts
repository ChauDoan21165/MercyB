/**
 * Speech-attempt persistence service (Wave 2 Step 3, P1-1).
 *
 * Called from <SpeechDrill> after each successful scoring pass. Wraps a
 * single INSERT into public.speech_attempts.
 *
 * Contract:
 *   - Feature-flag gated by FEATURE_FLAGS.SPEECH_PERSISTENCE_ENABLED.
 *     When OFF, every call is a no-op and returns { ok: true, skipped: true }.
 *   - Fire-and-forget safe: callers should `void recordSpeechAttempt(...)`.
 *     The function never throws; network / RLS errors are logged to
 *     console.warn and returned as { ok: false, error }.
 *   - No-op when there's no authenticated user (anon, or signed-out tab).
 *   - INSERT only — the table is append-only by RLS design.
 *
 * The shape mirrors CC1's ScoreResult so persistence stays in lock-step
 * with whatever the scorer emits. We store the full word_scores jsonb
 * unchanged so future analytics can dig into per-word patterns.
 */

import { supabase } from "@/lib/supabaseClient";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import type { ScoreResult } from "@/lib/pronunciation/scorer";

// In-memory dedupe of recent inserts. The callers (SpeechDrillPage,
// PhonemeDrillPage) fire `recordSpeechAttempt` from event handlers, so
// in steady-state the same attempt is logged once. But several upstream
// re-render paths can fire the same scoring event twice in quick
// succession (React 18 StrictMode in dev, a parent re-mount during a
// route transition, an effect-deps churn that triggers the recognition
// callback again). The dedupe key is keyed on what the user-perceived
// "attempt" actually is — same target + same transcript + same elapsed
// time, fired inside a short window — so legitimate retries (same
// target, new transcript) still go through.
const RECENT_ATTEMPT_TTL_MS = 4_000;
type RecentEntry = { key: string; expiresAt: number };
const recentAttempts: RecentEntry[] = [];

function gcRecentAttempts(now: number): void {
  while (recentAttempts.length && recentAttempts[0].expiresAt <= now) {
    recentAttempts.shift();
  }
}

function isDuplicateAttempt(key: string, now: number): boolean {
  gcRecentAttempts(now);
  return recentAttempts.some((entry) => entry.key === key);
}

function rememberAttempt(key: string, now: number): void {
  recentAttempts.push({ key, expiresAt: now + RECENT_ATTEMPT_TTL_MS });
}

/** Test-only hook. */
export function __resetSpeechAttemptsDedupe(): void {
  recentAttempts.length = 0;
}

export type SpeechAttemptContext = {
  /** Non-null when the drill ran inside a specific room/lesson. */
  room_id?: string | null;
  /** Non-null when the target corresponds to a specific line/entry. */
  line_id?: string | null;
  /** Any additional jsonb payload useful for future analytics. */
  extra?: Record<string, unknown>;
};

export type RecordSpeechAttemptInput = {
  target: string;
  recognized: string;
  score: ScoreResult;
  elapsedMs: number;
  context?: SpeechAttemptContext;
};

export type RecordSpeechAttemptResult =
  | { ok: true; skipped: false; id: string }
  | {
      ok: true;
      skipped: true;
      reason: "flag_off" | "anon" | "empty_score" | "duplicate";
    }
  | { ok: false; error: string };

function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object") {
    const m = (err as Record<string, unknown>).message;
    if (typeof m === "string") return m;
  }
  return String(err);
}

export async function recordSpeechAttempt(
  input: RecordSpeechAttemptInput,
): Promise<RecordSpeechAttemptResult> {
  if (!FEATURE_FLAGS.SPEECH_PERSISTENCE_ENABLED) {
    return { ok: true, skipped: true, reason: "flag_off" };
  }

  // Defensive — don't insert empty-scored rows.
  if (!input || !input.score || !Array.isArray(input.score.wordScores)) {
    return { ok: true, skipped: true, reason: "empty_score" };
  }

  let userId: string | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id ?? null;
  } catch {
    userId = null;
  }
  if (!userId) return { ok: true, skipped: true, reason: "anon" };

  // Idempotency check: same {user, target, transcript, elapsedMs} fired
  // within RECENT_ATTEMPT_TTL_MS is treated as a re-fire of the same
  // attempt. See `recentAttempts` at module top.
  const now = Date.now();
  const elapsedKey =
    typeof input.elapsedMs === "number" && Number.isFinite(input.elapsedMs)
      ? Math.round(input.elapsedMs)
      : -1;
  const dedupeKey = `${userId}|${input.target}|${input.recognized}|${elapsedKey}`;
  if (isDuplicateAttempt(dedupeKey, now)) {
    return { ok: true, skipped: true, reason: "duplicate" };
  }
  rememberAttempt(dedupeKey, now);

  const ctx = input.context ?? {};
  const contextJson: Record<string, unknown> = {};
  if (ctx.extra && typeof ctx.extra === "object") {
    for (const [k, v] of Object.entries(ctx.extra)) contextJson[k] = v;
  }
  if (typeof input.elapsedMs === "number" && Number.isFinite(input.elapsedMs)) {
    // Also stash elapsedMs inside context for analytics convenience;
    // the dedicated column is the source of truth.
    contextJson.elapsed_ms = input.elapsedMs;
  }

  const row = {
    user_id: userId,
    room_id: ctx.room_id ?? null,
    line_id: ctx.line_id ?? null,
    target_text: input.target,
    transcript: input.recognized,
    overall_score: clampScore(input.score.overallScore),
    word_scores: input.score.wordScores,
    feedback_message:
      typeof input.score.feedback?.en === "string"
        ? input.score.feedback.en
        : null,
    elapsed_ms:
      typeof input.elapsedMs === "number" && Number.isFinite(input.elapsedMs)
        ? Math.max(0, Math.round(input.elapsedMs))
        : null,
    context: Object.keys(contextJson).length > 0 ? contextJson : null,
    attempted_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from("speech_attempts")
      .insert(row)
      .select("id")
      .single();

    if (error) {
      const message = extractErrorMessage(error);
      if (typeof console !== "undefined") {
        console.warn("[speechAttempts] insert failed:", message);
      }
      return { ok: false, error: message };
    }

    const id = String((data as { id: string } | null)?.id ?? "");
    return { ok: true, skipped: false, id };
  } catch (err) {
    const message = extractErrorMessage(err);
    if (typeof console !== "undefined") {
      console.warn("[speechAttempts] insert threw:", message);
    }
    return { ok: false, error: message };
  }
}

function clampScore(n: unknown): number | null {
  if (typeof n !== "number" || !Number.isFinite(n)) return null;
  if (n < 0) return 0;
  if (n > 100) return 100;
  return Math.round(n);
}
