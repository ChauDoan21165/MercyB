/**
 * Daily challenge selection + completion API.
 *
 * Two seams:
 *   1. `pickTodaysChallenge(userId, opts)` — pure pick from the
 *      static corpus, used as a client-side fallback when the
 *      `pick_todays_challenge` RPC is unavailable. The math is the
 *      same shape as the SQL function so the two return identical
 *      ids for the same (userId, date, weakest phoneme) inputs.
 *   2. `fetchTodaysChallenge(supabase, userId)` — async, calls the
 *      RPC first and falls back to the local picker on RPC error so
 *      the page never breaks during database drift.
 *
 * Completion is one row per (user_id, completed_local_date). Calls
 * use the upsert form so a user who retakes the same day's challenge
 * gets the latest score persisted without duplicate-key errors.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  DAILY_CHALLENGES,
  type DailyChallenge,
  getChallengeById,
  getChallengesByPhoneme,
} from "@/data/pronunciation-challenges";

/** Local-time YYYY-MM-DD. Tests can pin the clock via the `now` arg. */
export function todayLocalISO(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Deterministic 32-bit hash. Mirrors the SQL hashtext shape. */
function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export interface PickOptions {
  /**
   * Lowercase canonical phoneme key the user is weakest on (from the
   * heatmap). When set, the picker prefers a challenge tagged with
   * that phoneme.
   */
  weakestPhoneme?: string | null;
  /** Override the date for testing. */
  now?: Date;
  /** Override the corpus for testing. */
  corpus?: ReadonlyArray<DailyChallenge>;
}

/**
 * Pick today's challenge for a user, deterministically.
 *
 * Same user + same local day = same challenge. Different days rotate
 * to a different challenge (modulo the corpus). When `weakestPhoneme`
 * is provided AND the corpus has at least one match, the rotation is
 * scoped to that phoneme's matching subset.
 */
export function pickTodaysChallenge(
  userId: string | null | undefined,
  opts: PickOptions = {},
): DailyChallenge | null {
  const corpus = opts.corpus ?? DAILY_CHALLENGES;
  if (corpus.length === 0) return null;

  const day = todayLocalISO(opts.now);
  const seed = hashSeed(`${userId ?? "anon"}|${day}`);

  if (opts.weakestPhoneme) {
    const subset = (
      opts.corpus
        ? corpus.filter((c) =>
            c.target_phonemes
              .map((p) => p.toLowerCase())
              .includes(opts.weakestPhoneme!.toLowerCase()),
          )
        : getChallengesByPhoneme(opts.weakestPhoneme)
    );
    if (subset.length > 0) {
      const ordered = [...subset].sort((a, b) => a.id.localeCompare(b.id));
      return ordered[seed % ordered.length];
    }
  }

  const ordered = [...corpus].sort((a, b) => a.id.localeCompare(b.id));
  return ordered[seed % ordered.length];
}

// ── Completion API ────────────────────────────────────────────────────

export interface CompletionRow {
  challenge_id: string;
  completed_at: string;
  completed_local_date: string;
  score: number;
  audio_url: string | null;
}

export interface RecordCompletionInput {
  userId: string;
  challengeId: string;
  score: number;
  audioUrl?: string | null;
  /** Override the local date for testing. */
  now?: Date;
}

/**
 * Upsert a completion row. The unique constraint on
 * (user_id, completed_local_date) means a user retaking the same
 * day's challenge updates the existing row instead of failing.
 */
export async function recordChallengeCompletion(
  client: SupabaseClient,
  input: RecordCompletionInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!input.userId) return { ok: false, error: "missing userId" };
  if (!input.challengeId) return { ok: false, error: "missing challengeId" };
  const score = Math.max(0, Math.min(100, Math.round(input.score)));
  const localDate = todayLocalISO(input.now);

  const { error } = await client
    .from("user_challenge_completion")
    .upsert(
      {
        user_id: input.userId,
        challenge_id: input.challengeId,
        completed_local_date: localDate,
        score,
        audio_url: input.audioUrl ?? null,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,completed_local_date" },
    );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/**
 * Look up today's completion for a user, if any. Returns null when
 * the user hasn't completed today's challenge yet.
 */
export async function fetchTodaysCompletion(
  client: SupabaseClient,
  userId: string,
  now: Date = new Date(),
): Promise<CompletionRow | null> {
  const localDate = todayLocalISO(now);
  const { data, error } = await client
    .from("user_challenge_completion")
    .select("challenge_id, completed_at, completed_local_date, score, audio_url")
    .eq("user_id", userId)
    .eq("completed_local_date", localDate)
    .maybeSingle();
  if (error || !data) return null;
  return data as CompletionRow;
}

/**
 * Last N days of completions for the history page. Sorted newest
 * first.
 */
export async function fetchCompletionHistory(
  client: SupabaseClient,
  userId: string,
  daysBack = 30,
): Promise<CompletionRow[]> {
  const since = new Date();
  since.setDate(since.getDate() - daysBack);
  const sinceISO = todayLocalISO(since);

  const { data, error } = await client
    .from("user_challenge_completion")
    .select("challenge_id, completed_at, completed_local_date, score, audio_url")
    .eq("user_id", userId)
    .gte("completed_local_date", sinceISO)
    .order("completed_local_date", { ascending: false });

  if (error || !data) return [];
  return data as CompletionRow[];
}

/**
 * Async wrapper that calls the SQL `pick_todays_challenge` RPC and
 * falls back to the pure local picker on error. The fallback runs
 * with no weakness signal — the page can still render a challenge
 * when the database is partially unavailable.
 */
export async function fetchTodaysChallenge(
  client: SupabaseClient,
  userId: string,
): Promise<DailyChallenge | null> {
  try {
    const { data, error } = await client.rpc("pick_todays_challenge", {
      p_user_id: userId,
    });
    if (error || !data) {
      return pickTodaysChallenge(userId);
    }
    const row = Array.isArray(data) ? data[0] : data;
    if (!row || typeof row.id !== "string") {
      return pickTodaysChallenge(userId);
    }
    // Prefer the canonical TS row to the RPC payload so the UI keeps
    // a stable shape even if a future migration changes the RPC's
    // returned columns.
    const local = getChallengeById(row.id);
    if (local) return local;
    return {
      id: String(row.id),
      type: (row.type as DailyChallenge["type"]) ?? "tongue_twister",
      content_en: String(row.content_en ?? ""),
      content_vi_explanation: String(row.content_vi_explanation ?? ""),
      target_phonemes: Array.isArray(row.target_phonemes)
        ? row.target_phonemes.map((p: unknown) => String(p))
        : [],
      difficulty:
        (row.difficulty as DailyChallenge["difficulty"]) ?? "medium",
    };
  } catch {
    return pickTodaysChallenge(userId);
  }
}
