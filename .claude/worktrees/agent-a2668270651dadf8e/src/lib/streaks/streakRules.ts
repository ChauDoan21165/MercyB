/**
 * Streaks v2 — pure rules for forgiveness mechanisms.
 *
 * The base streak math (extend / grace / reset) lives in `src/lib/streakMath.ts`
 * and is mirrored in the SQL trigger. This module layers three opt-in
 * forgiveness mechanisms on top:
 *
 *   1. Freeze day  ❄️  — Pre-empts the reset on a planned skip day.
 *                        Limit: 2 per ISO week, ≤ 1 per local day.
 *   2. Vacation    🏖️  — Long planned break (Tết, travel). The streak is
 *                        held constant while `today <= vacation_until`.
 *   3. Insurance   🛡️  — Reactive one-shot per calendar month. Restores
 *                        the current streak after a reset within the last
 *                        7 days.
 *
 * VN: Ba cơ chế tha thứ này có một mục đích duy nhất — không trừng phạt
 * học viên vì một ngày tệ. Vietnamese diaspora users explicitly told us
 * shame around broken streaks pushes them out of the app entirely.
 *
 * All functions in this module are pure: same inputs → same output, no
 * I/O, no Date.now(). Today's local date is always passed in by the caller
 * so tests can pin the clock. Persistence + counter resets (weekly/monthly)
 * happen elsewhere.
 */

export type StreakV2State = {
  current: number;
  longest: number;
  /** Local YYYY-MM-DD of the last study event, or null for new users. */
  lastStudiedDate: string | null;

  /** Counter reset at the top of each ISO week (Mon 00:00 user-local). */
  freezesUsedThisWeek: number;
  /** ISO timestamp of the most recent freeze, or null if never used. */
  lastFreezeAt: string | null;

  /** Local YYYY-MM-DD of the last day of the user's planned break, or null. */
  vacationUntil: string | null;

  /** Counter reset at the top of each calendar month (user-local). */
  insuranceUsedThisMonth: number;
  /** ISO timestamp of the most recent insurance use, or null. */
  lastInsuranceAt: string | null;
};

export type RuleVerdict =
  | { allowed: true }
  | { allowed: false; reason: RuleDenialReason };

export type RuleDenialReason =
  | "weekly_limit_reached"   // 2 freezes already used this ISO week
  | "already_used_today"     // freeze used earlier today; one per day
  | "monthly_limit_reached"  // insurance already used this month
  | "no_streak_to_protect"   // current = 0; nothing to insure
  | "no_recent_study"        // no lastStudiedDate; can't reset what wasn't there
  | "gap_too_large"          // > 7 days since last study; insurance window closed
  | "no_gap"                 // ran within grace already; nothing to buy back
  | "on_vacation";           // vacation already covers the day; freeze redundant

export const FREEZES_PER_WEEK = 2;
export const INSURANCE_PER_MONTH = 1;
export const INSURANCE_WINDOW_DAYS = 7;

// ── Date helpers (UTC midpoints — caller passes user-local YYYY-MM-DD) ────
// We reuse the same UTC-midnight trick as streakMath.ts: parse the local
// date string to a UTC instant so day-diff math is DST-free. The caller
// already converted to user-local before formatting.

function parseDay(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

function diffDays(later: string, earlier: string): number {
  return Math.round((parseDay(later) - parseDay(earlier)) / 86_400_000);
}

/**
 * `canUseFreeze` — gate for the freeze action.
 *
 * Why per-day: without it, a user could spam two freezes in one rage-tap
 * and lose their weekly budget. Per-ISO-week instead of rolling-7d so the
 * counter is easy to reason about ("Mondays reset").
 *
 * If the user is already on vacation, freeze is redundant (vacation
 * already preserves the streak) — we deny with `on_vacation` so the UI
 * can hide the button rather than no-op.
 *
 * @param state       Current streak state (caller-provided counters).
 * @param todayLocal  YYYY-MM-DD in the user's timezone.
 */
export function canUseFreeze(
  state: StreakV2State,
  todayLocal: string,
): RuleVerdict {
  if (isOnVacation(state, todayLocal)) {
    return { allowed: false, reason: "on_vacation" };
  }
  if (state.freezesUsedThisWeek >= FREEZES_PER_WEEK) {
    return { allowed: false, reason: "weekly_limit_reached" };
  }
  if (state.lastFreezeAt) {
    const lastFreezeLocal = state.lastFreezeAt.slice(0, 10);
    if (lastFreezeLocal === todayLocal) {
      return { allowed: false, reason: "already_used_today" };
    }
  }
  return { allowed: true };
}

/**
 * `isOnVacation` — is the user inside their declared break window?
 *
 * `vacation_until` is a YYYY-MM-DD inclusive: a user setting "until 2026-04-30"
 * gets vacation through the entire 30th in their local timezone. Checked
 * via lexicographic compare since both sides are zero-padded.
 */
export function isOnVacation(
  state: Pick<StreakV2State, "vacationUntil">,
  todayLocal: string,
): boolean {
  if (!state.vacationUntil) return false;
  return todayLocal <= state.vacationUntil;
}

/**
 * `canUseInsurance` — gate for the post-reset buy-back.
 *
 * Triggers ONLY when the streak would otherwise be reset (gap > 2 days,
 * past the trigger's built-in grace). The window closes after 7 days
 * because resurrecting a 3-week-old streak feels fake to learners — they
 * stop trusting the counter.
 *
 * VN: nếu nghỉ quá 1 tuần thì khôi phục chuỗi cũ làm mất ý nghĩa của
 * "chuỗi" với người học — bảo hiểm chỉ áp dụng trong 7 ngày.
 *
 * @param state       Current streak state.
 * @param todayLocal  YYYY-MM-DD in the user's timezone.
 */
export function canUseInsurance(
  state: StreakV2State,
  todayLocal: string,
): RuleVerdict {
  if (state.insuranceUsedThisMonth >= INSURANCE_PER_MONTH) {
    return { allowed: false, reason: "monthly_limit_reached" };
  }
  if (state.current <= 0) {
    return { allowed: false, reason: "no_streak_to_protect" };
  }
  if (!state.lastStudiedDate) {
    return { allowed: false, reason: "no_recent_study" };
  }
  const days = diffDays(todayLocal, state.lastStudiedDate);
  // Same day or within grace (≤ 2 days): nothing to buy back yet.
  if (days <= 2) {
    return { allowed: false, reason: "no_gap" };
  }
  if (days > INSURANCE_WINDOW_DAYS) {
    return { allowed: false, reason: "gap_too_large" };
  }
  return { allowed: true };
}

// ── State transitions (also pure — return next state, do not mutate) ──────

/**
 * Apply a freeze to the state. Caller must check `canUseFreeze` first;
 * this function asserts the precondition for safety but otherwise trusts
 * the caller. Side-effect free.
 */
export function applyFreeze(
  state: StreakV2State,
  todayLocal: string,
  nowIso: string,
): StreakV2State {
  const verdict = canUseFreeze(state, todayLocal);
  if (!verdict.allowed) {
    throw new Error(`applyFreeze: precondition failed: ${verdict.reason}`);
  }
  return {
    ...state,
    freezesUsedThisWeek: state.freezesUsedThisWeek + 1,
    lastFreezeAt: nowIso,
    // A freeze counts as "studied" for streak purposes — the streak chain
    // continues. Caller's SQL trigger or sync logic should treat the day
    // as a study day; we model that here by stamping lastStudiedDate.
    lastStudiedDate: todayLocal,
  };
}

/**
 * Apply insurance — restores the streak after a reset would have happened.
 * The current value is preserved (i.e., no penalty), longest is unchanged,
 * and lastStudiedDate jumps to today.
 */
export function applyInsurance(
  state: StreakV2State,
  todayLocal: string,
  nowIso: string,
): StreakV2State {
  const verdict = canUseInsurance(state, todayLocal);
  if (!verdict.allowed) {
    throw new Error(`applyInsurance: precondition failed: ${verdict.reason}`);
  }
  const nextCurrent = state.current + 1;
  return {
    ...state,
    current: nextCurrent,
    longest: Math.max(state.longest, nextCurrent),
    lastStudiedDate: todayLocal,
    insuranceUsedThisMonth: state.insuranceUsedThisMonth + 1,
    lastInsuranceAt: nowIso,
  };
}

/**
 * Set or clear the vacation window. `vacationUntilLocal` of null clears it.
 * Note: this rule layer doesn't validate that `vacationUntilLocal >= today` —
 * the UI should prevent backdated vacations; the SQL constraint is the
 * final gate.
 */
export function setVacation(
  state: StreakV2State,
  vacationUntilLocal: string | null,
): StreakV2State {
  return { ...state, vacationUntil: vacationUntilLocal };
}
