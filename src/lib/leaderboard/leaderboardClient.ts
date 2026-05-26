// Client API for the weekly leaderboard. Wraps three RPCs defined in
// supabase/migrations/20260429000000_leaderboard_weekly.sql:
//
//   - leaderboard_weekly_top10()
//   - leaderboard_weekly_my_rank()
//   - award_leaderboard_points(p_points int, p_kind text)
//
// All three accept no caller-supplied user_id — auth.uid() is the only
// identity. The client layer therefore takes a userId parameter only as
// a guard rail (to bail early if the caller is not signed in) and not as
// an argument to the RPC.

import { supabase } from "@/lib/supabaseClient";

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  points: number;
  lessonsCompleted: number;
  streakDays: number;
};

export type LeaderboardNeighborEntry = LeaderboardEntry & { isMe: boolean };

export type AwardKind = "lesson" | "streak" | "challenge";

export type AwardResult = {
  weekStart: string;
  points: number;
  lessonsCompleted: number;
  streakDays: number;
};

/**
 * Top 10 of the current ISO week (UTC). Empty array on first week or when
 * RLS blocks the request — callers render an empty state.
 */
export async function getWeeklyTop10(): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase.rpc("leaderboard_weekly_top10");
  if (error) {
    console.warn("[leaderboard] top10 fetch failed:", error.message);
    return [];
  }
  return Array.isArray(data) ? data.map(toEntry) : [];
}

/**
 * Up to 5 rows centred on the user's rank: rank-2, rank-1, ME, rank+1,
 * rank+2. If the user has no row this week, returns a single synthetic
 * row with rank = total + 1 and zeroed stats — UI uses `isMe` to find
 * the caller and `points === 0 && rank > 10` as the "not on the board
 * yet" signal.
 *
 * `userId` is required so we can fail fast for unauth callers without a
 * round-trip; the RPC itself reads auth.uid().
 */
export async function getMyWeeklyRank(
  userId: string | null | undefined,
): Promise<LeaderboardNeighborEntry[]> {
  if (!userId) return [];
  const { data, error } = await supabase.rpc("leaderboard_weekly_my_rank");
  if (error) {
    console.warn("[leaderboard] my-rank fetch failed:", error.message);
    return [];
  }
  return Array.isArray(data) ? data.map(toNeighborEntry) : [];
}

/**
 * Award points to the current user for a specific event. Atomic and
 * idempotent in the sense that the underlying upsert + increment will
 * not lose concurrent writes from two devices.
 *
 * `kind` semantics (matched in the SQL function — keep both sides in
 * sync if you change them):
 *   - 'lesson'    → +1 to lessons_completed, +points to points
 *   - 'challenge' → +points to points
 *   - 'streak'    → streak_days = max(existing, points); points unchanged
 *
 * `userId` is required for the same fail-fast reason as getMyWeeklyRank.
 */
export async function awardPoints(
  userId: string | null | undefined,
  points: number,
  kind: AwardKind,
): Promise<AwardResult | null> {
  if (!userId) return null;
  if (!Number.isFinite(points) || points < 0) {
    console.warn("[leaderboard] awardPoints called with invalid points:", points);
    return null;
  }
  const { data, error } = await supabase.rpc("award_leaderboard_points", {
    p_points: Math.floor(points),
    p_kind: kind,
  });
  if (error) {
    console.warn("[leaderboard] awardPoints failed:", error.message);
    return null;
  }
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  return {
    weekStart: String(row.week_start ?? ""),
    points: Number(row.points ?? 0),
    lessonsCompleted: Number(row.lessons_completed ?? 0),
    streakDays: Number(row.streak_days ?? 0),
  };
}

// ── helpers ──────────────────────────────────────────────────────────────

function toEntry(raw: unknown): LeaderboardEntry {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    rank: Number(r.rank ?? 0),
    userId: String(r.user_id ?? ""),
    username: String(r.username ?? ""),
    points: Number(r.points ?? 0),
    lessonsCompleted: Number(r.lessons_completed ?? 0),
    streakDays: Number(r.streak_days ?? 0),
  };
}

function toNeighborEntry(raw: unknown): LeaderboardNeighborEntry {
  const base = toEntry(raw);
  const r = (raw ?? {}) as Record<string, unknown>;
  return { ...base, isMe: Boolean(r.is_me) };
}
