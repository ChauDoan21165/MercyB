/**
 * Pure streak math — mirrors the SQL trigger in
 * `supabase/migrations/20260425000000_server_side_streaks.sql`
 * (function `public.update_user_streak_from_room_progress`).
 *
 * Two implementations exist so the logic can be unit-tested without a
 * running Postgres. The SQL is the source of truth in production; this
 * TypeScript helper MUST stay in lock-step.
 *
 * Rules (as approved by Chau):
 *   - First study ever        → current = 1
 *   - Same local day          → no-op (debounce)
 *   - Consecutive day (t-1)   → current + 1
 *   - 1-day grace  (t-2)      → current + 1  (Tết / illness / work late)
 *   - Gap of 3+ days          → reset to 1
 *   - prev > today (clock skew / timezone move backwards) → no-op
 *
 * Timezone handling is intentionally simple: callers pass an ISO-style
 * local date string for "today" (e.g., "2026-04-23") so this helper is
 * timezone-free. The SQL trigger uses `AT TIME ZONE profiles.timezone`
 * before passing into the equivalent of this function.
 */

export type StreakState = {
  /** Current unbroken streak in local-days. */
  current: number;
  /** All-time best. */
  longest: number;
  /** Most recent local-date the user studied, or null for brand-new users. */
  lastStudiedDate: string | null;
};

export type StreakComputation =
  | { action: "noop_same_day" }
  | { action: "noop_future_prev" }
  | { action: "increment"; next: StreakState; reason: "consecutive" | "grace" }
  | { action: "reset"; next: StreakState; reason: "gap" | "first_ever" };

/**
 * Parse a "YYYY-MM-DD" string into a UTC-midnight Date, purely for day-diff
 * math. We use UTC to avoid DST math inside the TS helper; the caller
 * already converted to the user's timezone before formatting.
 */
function parseDay(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

function diffDays(aDay: string, bDay: string): number {
  return Math.round((parseDay(aDay) - parseDay(bDay)) / 86_400_000);
}

/**
 * Given the user's prior streak state and the local date of a new
 * "engagement" event (progress_pct advanced), compute the new state.
 * Does NOT mutate its input.
 */
export function computeNewStreakState(
  prev: StreakState,
  todayLocal: string,
): StreakComputation {
  // Same-day debounce: the second keyword click of a day is a no-op.
  if (prev.lastStudiedDate === todayLocal) {
    return { action: "noop_same_day" };
  }

  // Defensive: prev is in the future (clock skew or timezone-backwards).
  if (prev.lastStudiedDate !== null && diffDays(prev.lastStudiedDate, todayLocal) > 0) {
    return { action: "noop_future_prev" };
  }

  // First study ever.
  if (prev.lastStudiedDate === null) {
    const next: StreakState = {
      current: 1,
      longest: Math.max(prev.longest, 1),
      lastStudiedDate: todayLocal,
    };
    return { action: "reset", next, reason: "first_ever" };
  }

  const daysSince = diffDays(todayLocal, prev.lastStudiedDate);

  // Consecutive day or 1-day grace → extend.
  if (daysSince === 1 || daysSince === 2) {
    const nextCurrent = prev.current + 1;
    const next: StreakState = {
      current: nextCurrent,
      longest: Math.max(prev.longest, nextCurrent),
      lastStudiedDate: todayLocal,
    };
    return {
      action: "increment",
      next,
      reason: daysSince === 1 ? "consecutive" : "grace",
    };
  }

  // Gap of 3+ days → reset. Longest is preserved.
  const next: StreakState = {
    current: 1,
    longest: Math.max(prev.longest, 1),
    lastStudiedDate: todayLocal,
  };
  return { action: "reset", next, reason: "gap" };
}

/**
 * Format a Date into the user's local YYYY-MM-DD. For client-side use
 * when computing `todayLocal`.
 */
export function formatLocalDate(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const y = parts.find((p) => p.type === "year")?.value ?? "1970";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${d}`;
}
