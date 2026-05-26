/**
 * Read-side companion to src/services/speechAttempts.ts. Powers the
 * /speech/history page:
 *
 *   - getUserStats()       → single row from v_user_pronunciation_stats
 *                            (7/30/90-day attempt counts + avg scores).
 *   - getAttempts(opts)    → paginated speech_attempts rows for the
 *                            signed-in user, newest first.
 *
 * RLS handles tenant isolation. Both calls run under the signed-in JWT —
 * the user sees only their own rows. Non-authenticated callers get an
 * empty result set (no rows match their filter), never a stranger's data.
 *
 * Errors are thrown so the page can catch + render an error state. This
 * matches the convention used by src/services/featureFlagsAdmin.ts.
 */

import { supabase } from "@/lib/supabaseClient";

/** One per-word entry inside `word_scores` jsonb (shape mirrors CC1's scorer). */
export type SpeechWordScore = {
  word: string;
  status?: string;
  score?: number;
};

/** A single speech_attempts row as the history page consumes it. */
export type SpeechAttemptRow = {
  id: string;
  target_text: string;
  transcript: string | null;
  overall_score: number | null;
  word_scores: SpeechWordScore[];
  attempted_at: string;
  elapsed_ms: number | null;
  context: Record<string, unknown> | null;
  room_id: string | null;
};

/** Per-user rollup row from v_user_pronunciation_stats. */
export type UserPronunciationStats = {
  attempts_7d: number;
  attempts_30d: number;
  attempts_90d: number;
  avg_score_7d: number | null;
  avg_score_30d: number | null;
  avg_score_90d: number | null;
  last_attempt_at: string | null;
  median_elapsed_ms_90d: number | null;
};

/** Empty stats, used when the user has no attempts yet. */
export const EMPTY_STATS: UserPronunciationStats = {
  attempts_7d: 0,
  attempts_30d: 0,
  attempts_90d: 0,
  avg_score_7d: null,
  avg_score_30d: null,
  avg_score_90d: null,
  last_attempt_at: null,
  median_elapsed_ms_90d: null,
};

function normalizeWordScores(raw: unknown): SpeechWordScore[] {
  if (!Array.isArray(raw)) return [];
  const out: SpeechWordScore[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const word = (entry as { word?: unknown }).word;
    if (typeof word !== "string" || !word.trim()) continue;
    const status = (entry as { status?: unknown }).status;
    const scoreRaw = (entry as { score?: unknown }).score;
    out.push({
      word,
      status: typeof status === "string" ? status : undefined,
      score:
        typeof scoreRaw === "number" && Number.isFinite(scoreRaw)
          ? scoreRaw
          : undefined,
    });
  }
  return out;
}

function normalizeContext(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  return raw as Record<string, unknown>;
}

/**
 * Per-user aggregates from v_user_pronunciation_stats. The view is
 * GROUP BY user_id, so at most one row per user. `.maybeSingle()` returns
 * null when the user has no attempts in the last 90 days — we surface that
 * as EMPTY_STATS.
 */
export async function getUserStats(): Promise<UserPronunciationStats> {
  const { data, error } = await supabase
    // v_user_pronunciation_stats is not in the generated types yet
    // (added by 20260426000000_speech_attempts_persistence.sql after the
    // last types.ts dump). Cast to the read-only helper type.
    .from("v_user_pronunciation_stats" as never)
    .select(
      "attempts_7d, attempts_30d, attempts_90d, avg_score_7d, avg_score_30d, avg_score_90d, last_attempt_at, median_elapsed_ms_90d",
    )
    .maybeSingle();
  if (error) throw error;
  if (!data) return { ...EMPTY_STATS };

  const row = data as Record<string, unknown>;
  const asInt = (v: unknown): number => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.round(n) : 0;
  };
  const asIntOrNull = (v: unknown): number | null => {
    if (v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? Math.round(n) : null;
  };
  const asStringOrNull = (v: unknown): string | null =>
    typeof v === "string" && v ? v : null;

  return {
    attempts_7d: asInt(row.attempts_7d),
    attempts_30d: asInt(row.attempts_30d),
    attempts_90d: asInt(row.attempts_90d),
    avg_score_7d: asIntOrNull(row.avg_score_7d),
    avg_score_30d: asIntOrNull(row.avg_score_30d),
    avg_score_90d: asIntOrNull(row.avg_score_90d),
    last_attempt_at: asStringOrNull(row.last_attempt_at),
    median_elapsed_ms_90d: asIntOrNull(row.median_elapsed_ms_90d),
  };
}

export type GetAttemptsOptions = {
  /** Page size. Defaults to 20. */
  limit?: number;
  /** Row offset from newest. Defaults to 0. */
  offset?: number;
};

/**
 * Paginated speech_attempts for the signed-in user, newest first.
 * Returns rows only — callers that need "hasMore" should request
 * limit+1 rows and truncate, or call again with the next offset.
 */
export async function getAttempts(
  options: GetAttemptsOptions = {},
): Promise<SpeechAttemptRow[]> {
  const limit = Math.max(1, Math.min(100, options.limit ?? 20));
  const offset = Math.max(0, options.offset ?? 0);

  const { data, error } = await supabase
    .from("speech_attempts")
    .select(
      "id, target_text, transcript, overall_score, word_scores, attempted_at, elapsed_ms, context, room_id",
    )
    // New column — not yet in generated types. Cast the order key.
    .order("attempted_at" as never, { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;

  const rows = Array.isArray(data) ? data : [];
  return rows.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: String(r.id ?? ""),
      target_text: String(r.target_text ?? ""),
      transcript: typeof r.transcript === "string" ? r.transcript : null,
      overall_score:
        typeof r.overall_score === "number" && Number.isFinite(r.overall_score)
          ? Math.round(r.overall_score)
          : null,
      word_scores: normalizeWordScores(r.word_scores),
      attempted_at:
        typeof r.attempted_at === "string"
          ? r.attempted_at
          : typeof r.created_at === "string"
            ? String(r.created_at)
            : new Date(0).toISOString(),
      elapsed_ms:
        typeof r.elapsed_ms === "number" && Number.isFinite(r.elapsed_ms)
          ? Math.round(r.elapsed_ms)
          : null,
      context: normalizeContext(r.context),
      room_id: typeof r.room_id === "string" ? r.room_id : null,
    };
  });
}
