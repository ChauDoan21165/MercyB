// src/lib/leaderboard/weeklyLeaderboardClient.ts
//
// Client wrapper for the public weekly pronunciation leaderboard.
//
// Distinct from `leaderboardClient.ts` which feeds the engagement-points
// leaderboard from PR #79; this surface aggregates speech_attempts
// match_score and surfaces an opt-in display name only.
//
// All reads go through SECURITY DEFINER RPCs (`weekly_leaderboard_top`,
// `weekly_leaderboard_my_rank`). Direct table reads also work for the
// owner thanks to RLS but the RPCs keep the rank computation server-
// side so the client doesn't have to re-rank rows.

import { supabase } from "@/lib/supabaseClient";

export type LeaderboardRow = {
  rank: number;
  user_id: string;
  display_name: string;
  total_score: number;
  attempts_count: number;
  week_starts_on: string;
};

export type MyRankRow =
  | {
      onBoard: true;
      rank: number | null; // null when opted-out — score exists but no public rank
      total_score: number;
      attempts_count: number;
      display_name: string | null;
      opted_in: boolean;
      week_starts_on: string;
    }
  | {
      onBoard: false;
      week_starts_on: string;
    };

// ── Read helpers ─────────────────────────────────────────────────────────

export async function getTopHundred(): Promise<LeaderboardRow[]> {
  return getTop(100);
}

export async function getTop(limit: number): Promise<LeaderboardRow[]> {
  type Resp = {
    data: Array<{
      rank: number | null;
      user_id: string | null;
      display_name: string | null;
      total_score: number | string | null;
      attempts_count: number | null;
      week_starts_on: string | null;
    }> | null;
    error: { message: string } | null;
  };
  const result = (await (supabase as unknown as {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<Resp>;
  }).rpc("weekly_leaderboard_top", {
    p_limit: Math.max(1, Math.min(500, Math.round(limit || 100))),
  })) as Resp;

  if (result.error || !Array.isArray(result.data)) return [];

  const out: LeaderboardRow[] = [];
  for (const row of result.data) {
    if (
      row.rank === null ||
      !row.user_id ||
      !row.display_name ||
      !row.week_starts_on
    ) {
      continue;
    }
    out.push({
      rank: Number(row.rank),
      user_id: row.user_id,
      display_name: row.display_name,
      total_score: Number(row.total_score ?? 0),
      attempts_count: Number(row.attempts_count ?? 0),
      week_starts_on: row.week_starts_on,
    });
  }
  return out;
}

export async function getMyRank(): Promise<MyRankRow> {
  type Resp = {
    data: Array<{
      rank: number | null;
      total_score: number | string | null;
      attempts_count: number | null;
      display_name: string | null;
      opted_in: boolean | null;
      week_starts_on: string | null;
    }> | null;
    error: { message: string } | null;
  };
  const result = (await (supabase as unknown as {
    rpc: (fn: string) => Promise<Resp>;
  }).rpc("weekly_leaderboard_my_rank")) as Resp;

  const fallbackWeek = new Date().toISOString().slice(0, 10);
  if (result.error || !Array.isArray(result.data) || result.data.length === 0) {
    return { onBoard: false, week_starts_on: fallbackWeek };
  }
  const row = result.data[0];
  if (row.total_score === null || row.total_score === undefined) {
    return {
      onBoard: false,
      week_starts_on: row.week_starts_on ?? fallbackWeek,
    };
  }
  return {
    onBoard: true,
    rank: row.rank,
    total_score: Number(row.total_score ?? 0),
    attempts_count: Number(row.attempts_count ?? 0),
    display_name: row.display_name,
    opted_in: Boolean(row.opted_in),
    week_starts_on: row.week_starts_on ?? fallbackWeek,
  };
}

// ── Write helpers (display name + opt-in toggle) ─────────────────────────

export type DisplayNameValidation =
  | { ok: true; value: string }
  | { ok: false; reason: "empty" | "too_long" | "disallowed_chars" };

const ALLOWED_EMOJIS = ["✨", "💎", "🏆"];
const ALLOWED_EMOJI_REGEX = /[\u{2728}\u{1F48E}\u{1F3C6}]/u;
const DISALLOWED_EMOJI_RANGE =
  /[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{1FA00}-\u{1FAFF}]/u;

/**
 * Validate a candidate display name.
 *
 * Rules:
 *   - 1 ≤ length ≤ 30 (matches the SQL CHECK constraint).
 *   - Letters / digits / spaces / a small punctuation set are fine.
 *   - The only emoji allowed are ✨ 💎 🏆 (SFW achievement set).
 *   - Anything else in the unicode-emoji ranges is rejected.
 */
export function validateDisplayName(input: string): DisplayNameValidation {
  const trimmed = (input ?? "").trim();
  if (!trimmed) return { ok: false, reason: "empty" };
  // Use Array.from so multi-byte emoji don't inflate the count.
  const codepointLength = Array.from(trimmed).length;
  if (codepointLength > 30) return { ok: false, reason: "too_long" };

  // Scan codepoints. If we see an emoji not in the allowlist → reject.
  for (const ch of trimmed) {
    if (DISALLOWED_EMOJI_RANGE.test(ch) && !ALLOWED_EMOJI_REGEX.test(ch)) {
      return { ok: false, reason: "disallowed_chars" };
    }
  }
  return { ok: true, value: trimmed };
}

export type OptInResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Set or clear the caller's display_name on their current-week row.
 * Passing `null` opts out (row keeps its score but disappears from
 * the public top list). Passing a string runs `validateDisplayName`
 * first; rejected names return ok:false without touching the DB.
 *
 * The current-week row may not exist yet (user hasn't recorded a
 * speech_attempt this week). In that case we INSERT a placeholder row
 * with score 0 so the toggle persists; the trigger will accumulate
 * attempts on top.
 */
export async function setDisplayName(
  userId: string,
  rawName: string | null,
): Promise<OptInResult> {
  let nameForDb: string | null = null;

  if (rawName !== null) {
    const validated = validateDisplayName(rawName);
    if (!validated.ok) {
      return { ok: false, error: validated.reason };
    }
    nameForDb = validated.value;
  }

  // Try to update the current-week row first; if no row exists, insert
  // a zero-score placeholder so the user's choice persists.
  type UpdResp = { error: { message: string } | null; data: unknown[] | null };
  type InsResp = { error: { message: string } | null };

  const update = (await (supabase
    .from("weekly_leaderboard") as unknown as {
      update: (row: Record<string, unknown>) => {
        eq: (col: string, val: string) => {
          eq: (col: string, val: string) => {
            select: (cols: string) => Promise<UpdResp>;
          };
        };
      };
    })
    .update({ display_name: nameForDb, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("week_starts_on", currentWeekStartIso())
    .select("id")) as UpdResp;

  if (update.error) return { ok: false, error: update.error.message };
  if (Array.isArray(update.data) && update.data.length > 0) return { ok: true };

  // No row to update → insert placeholder (only when opting IN; opting
  // out of nothing is a no-op).
  if (nameForDb === null) return { ok: true };

  const insert = (await (supabase
    .from("weekly_leaderboard") as unknown as {
      insert: (row: Record<string, unknown>) => Promise<InsResp>;
    })
    .insert({
      user_id: userId,
      week_starts_on: currentWeekStartIso(),
      total_score: 0,
      attempts_count: 0,
      display_name: nameForDb,
    })) as InsResp;

  if (insert.error) return { ok: false, error: insert.error.message };
  return { ok: true };
}

// ── Date math (exported for tests) ───────────────────────────────────────

/**
 * Monday (UTC) of the week containing `ref`, formatted as YYYY-MM-DD.
 * Mirrors the SQL helper `weekly_leaderboard_current_week_start()` so
 * the client and server agree on "this week" without a roundtrip.
 */
export function currentWeekStartIso(ref: Date = new Date()): string {
  const d = new Date(
    Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate()),
  );
  // getUTCDay: 0=Sun..6=Sat. Move back to Monday.
  const day = d.getUTCDay();
  const offset = day === 0 ? 6 : day - 1;
  d.setUTCDate(d.getUTCDate() - offset);
  return d.toISOString().slice(0, 10);
}
