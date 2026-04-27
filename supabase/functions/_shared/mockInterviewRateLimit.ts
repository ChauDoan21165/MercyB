// supabase/functions/_shared/mockInterviewRateLimit.ts
//
// Server-side weekly rate limit for mock interview sessions.
// Replaces the localStorage-only soft gate that shipped with PR #176.
//
// Tier rules (per the brief):
//   tier 0 (free)      → 1 session per ICT week
//   tier 1 (trialing)  → unlimited
//   tier 2+ (active)   → unlimited
//   admin level >= 9   → unlimited
//
// "Week" = Monday 00:00 ICT (Asia/Ho_Chi_Minh, UTC+7) through
// Sunday 23:59:59 ICT. The boundary recomputes for each call so a
// session counted on Sunday at 23:55 ICT does NOT carry into
// Monday's quota.
//
// Pure module — DI for both the row-count loader and `now`. The
// edge function wires real Postgres reads; tests inject deterministic
// counts and a fixed clock.

const FREE_TIER_WEEKLY_LIMIT = 1;
const ICT_OFFSET_MS = 7 * 60 * 60 * 1000; // UTC+7

export type Tier = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | number;

/** What the gate needs to know about the caller. */
export interface MockInterviewGateContext {
  userId: string;
  /** Numeric tier from `profiles.tier`. 0 = free, 1 = trial, ≥2 = paid. */
  tier: Tier;
  /** Trial state — when true the user is in their 3-day trial window. */
  isTrialing: boolean;
  /** Admin level from `get_admin_level`. ≥ 9 bypasses. */
  adminLevel: number;
}

export interface MockInterviewGateDeps {
  /**
   * Count this user's mock interview sessions started at-or-after
   * `weekStartIsoUtc`. The edge function implements this with a
   * `SELECT count(*) FROM mock_interview_sessions WHERE user_id = $1
   * AND started_at >= $2`.
   */
  countSessionsThisWeek: (userId: string, weekStartIsoUtc: string) => Promise<number>;
  /** Current time. Defaults to `new Date()` in production. */
  now?: () => Date;
}

export type GateAllowReason =
  | "admin_bypass"
  | "trialing"
  | "paid"
  | "within_free_limit";

export type GateBlockReason = "free_weekly_limit_reached";

export interface MockInterviewGateResult {
  allowed: boolean;
  reason: GateAllowReason | GateBlockReason;
  used_this_period: number;
  limit: number;
  /** Seconds until the start of next ICT week. Useful for `Retry-After`. */
  retry_after_seconds: number;
  /** ISO timestamp (UTC) of next Monday 00:00 ICT. Useful for UI countdowns. */
  resets_at: string;
}

/**
 * Resolve the rate-limit decision for a caller. No DB writes happen
 * here — that's the edge function's job after `allowed: true` returns.
 */
export async function checkMockInterviewRateLimit(
  ctx: MockInterviewGateContext,
  deps: MockInterviewGateDeps,
): Promise<MockInterviewGateResult> {
  const now = deps.now ? deps.now() : new Date();
  const weekStart = ictWeekStart(now);
  const nextWeekStart = ictWeekStart(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000));
  const retryAfterSeconds = Math.max(
    0,
    Math.ceil((nextWeekStart.getTime() - now.getTime()) / 1000),
  );

  // Admin level >= 9 bypasses regardless of tier.
  if (ctx.adminLevel >= 9) {
    return {
      allowed: true,
      reason: "admin_bypass",
      used_this_period: 0,
      limit: Number.POSITIVE_INFINITY,
      retry_after_seconds: 0,
      resets_at: nextWeekStart.toISOString(),
    };
  }

  // Trial + paid tiers are unlimited; we still don't read the DB so
  // those tiers cost zero per call.
  if (ctx.isTrialing) {
    return {
      allowed: true,
      reason: "trialing",
      used_this_period: 0,
      limit: Number.POSITIVE_INFINITY,
      retry_after_seconds: 0,
      resets_at: nextWeekStart.toISOString(),
    };
  }
  if (ctx.tier >= 2) {
    return {
      allowed: true,
      reason: "paid",
      used_this_period: 0,
      limit: Number.POSITIVE_INFINITY,
      retry_after_seconds: 0,
      resets_at: nextWeekStart.toISOString(),
    };
  }

  // Free tier — count this week's sessions and compare to the limit.
  const used = await deps.countSessionsThisWeek(ctx.userId, weekStart.toISOString());
  if (used < FREE_TIER_WEEKLY_LIMIT) {
    return {
      allowed: true,
      reason: "within_free_limit",
      used_this_period: used,
      limit: FREE_TIER_WEEKLY_LIMIT,
      retry_after_seconds: retryAfterSeconds,
      resets_at: nextWeekStart.toISOString(),
    };
  }

  return {
    allowed: false,
    reason: "free_weekly_limit_reached",
    used_this_period: used,
    limit: FREE_TIER_WEEKLY_LIMIT,
    retry_after_seconds: retryAfterSeconds,
    resets_at: nextWeekStart.toISOString(),
  };
}

/**
 * Compute the most-recent Monday 00:00 ICT as a UTC `Date`.
 *
 * Approach: shift `now` forward by the ICT offset so the date math
 * runs in "ICT-as-UTC" space, find the Monday-00:00 boundary there,
 * then shift back. This avoids any host-timezone surprises (the edge
 * function runs in UTC; tests on dev machines can be in any zone).
 */
export function ictWeekStart(now: Date): Date {
  const ictMs = now.getTime() + ICT_OFFSET_MS;
  const ictDate = new Date(ictMs);

  // ictDate.getUTCDay() in shifted space = the ICT weekday.
  // Sunday = 0, Monday = 1, ..., Saturday = 6. We want Monday-anchored
  // weeks: Sunday counts toward the previous Monday.
  const day = ictDate.getUTCDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;

  const ictMidnight = Date.UTC(
    ictDate.getUTCFullYear(),
    ictDate.getUTCMonth(),
    ictDate.getUTCDate() - daysSinceMonday,
  );

  return new Date(ictMidnight - ICT_OFFSET_MS);
}

/** Convenience for callers wiring the bilingual 429 body. */
export function buildMockInterviewLimitErrorBody(
  result: Pick<
    MockInterviewGateResult,
    "used_this_period" | "limit" | "retry_after_seconds" | "resets_at"
  >,
): {
  ok: false;
  error_code: "MOCK_INTERVIEW_FREE_LIMIT_REACHED";
  error_message_vi: string;
  error_message_en: string;
  used_this_period: number;
  limit: number;
  retry_after_seconds: number;
  resets_at: string;
} {
  return {
    ok: false,
    error_code: "MOCK_INTERVIEW_FREE_LIMIT_REACHED",
    error_message_vi:
      "Đã hết lượt mock interview tuần này. Free plan có 1 mock interview mỗi tuần. Trial dùng thử miễn phí 3 ngày — luyện không giới hạn.",
    error_message_en:
      "Out of mock interviews this week. Free plan includes 1 mock interview per week. Start a 3-day trial — unlimited practice.",
    used_this_period: result.used_this_period,
    limit: result.limit,
    retry_after_seconds: result.retry_after_seconds,
    resets_at: result.resets_at,
  };
}
