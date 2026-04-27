// supabase/functions/_shared/familyInviteRateLimit.ts
//
// Per-user rate limit for family bulk invitations.
//   - 20 invites per rolling hour
//   - 100 invites per rolling day
// Brief: "Failed delivery (invalid email) doesn't count toward rate
// limit." The SQL helper `count_family_invitations_in_window`
// already excludes status = 'failed' + 'revoked' for that reason.
//
// The check returns the SMALLER of the two remaining-quotas so the
// UI can show "X invites left this hour" without confusing the
// user with two different numbers.

const HOUR_SECONDS = 60 * 60;
const DAY_SECONDS = 24 * 60 * 60;

export const FAMILY_INVITE_HOURLY_LIMIT = 20;
export const FAMILY_INVITE_DAILY_LIMIT = 100;

export type RateLimitWindow = "hour" | "day";

export interface FamilyInviteRateLimitResult {
  allowed: boolean;
  hourly_used: number;
  hourly_limit: number;
  hourly_remaining: number;
  daily_used: number;
  daily_limit: number;
  daily_remaining: number;
  /** Which window tripped (when allowed=false). */
  exceeded?: RateLimitWindow;
  /** Most-restrictive remaining slot — what the UI should display. */
  remaining: number;
}

export interface RateLimitDeps {
  /**
   * Calls `count_family_invitations_in_window` on Postgres. The SQL
   * function already excludes failed/revoked rows.
   */
  countInWindow: (userId: string, windowSeconds: number) => Promise<number>;
}

/**
 * Compute remaining quota and whether the next batch of N invites
 * would fit. The handler calls this BEFORE inserting any rows so a
 * partial-fit batch returns 429 cleanly without leaving orphan rows.
 */
export async function checkFamilyInviteRateLimit(
  userId: string,
  batchSize: number,
  deps: RateLimitDeps,
): Promise<FamilyInviteRateLimitResult> {
  const [hourlyUsed, dailyUsed] = await Promise.all([
    deps.countInWindow(userId, HOUR_SECONDS),
    deps.countInWindow(userId, DAY_SECONDS),
  ]);

  const hourlyRemaining = Math.max(0, FAMILY_INVITE_HOURLY_LIMIT - hourlyUsed);
  const dailyRemaining = Math.max(0, FAMILY_INVITE_DAILY_LIMIT - dailyUsed);
  const remaining = Math.min(hourlyRemaining, dailyRemaining);

  if (batchSize <= 0) {
    return {
      allowed: true,
      hourly_used: hourlyUsed,
      hourly_limit: FAMILY_INVITE_HOURLY_LIMIT,
      hourly_remaining: hourlyRemaining,
      daily_used: dailyUsed,
      daily_limit: FAMILY_INVITE_DAILY_LIMIT,
      daily_remaining: dailyRemaining,
      remaining,
    };
  }

  if (batchSize > hourlyRemaining || hourlyRemaining === 0) {
    return {
      allowed: false,
      hourly_used: hourlyUsed,
      hourly_limit: FAMILY_INVITE_HOURLY_LIMIT,
      hourly_remaining: hourlyRemaining,
      daily_used: dailyUsed,
      daily_limit: FAMILY_INVITE_DAILY_LIMIT,
      daily_remaining: dailyRemaining,
      exceeded: "hour",
      remaining,
    };
  }
  if (batchSize > dailyRemaining || dailyRemaining === 0) {
    return {
      allowed: false,
      hourly_used: hourlyUsed,
      hourly_limit: FAMILY_INVITE_HOURLY_LIMIT,
      hourly_remaining: hourlyRemaining,
      daily_used: dailyUsed,
      daily_limit: FAMILY_INVITE_DAILY_LIMIT,
      daily_remaining: dailyRemaining,
      exceeded: "day",
      remaining,
    };
  }

  return {
    allowed: true,
    hourly_used: hourlyUsed,
    hourly_limit: FAMILY_INVITE_HOURLY_LIMIT,
    hourly_remaining: hourlyRemaining,
    daily_used: dailyUsed,
    daily_limit: FAMILY_INVITE_DAILY_LIMIT,
    daily_remaining: dailyRemaining,
    remaining,
  };
}

/** Bilingual VI/EN error body for the 429 response. */
export function buildFamilyInviteRateLimitErrorBody(
  result: FamilyInviteRateLimitResult,
): {
  ok: false;
  error_code: "FAMILY_INVITE_RATE_LIMIT_EXCEEDED";
  error_message_vi: string;
  error_message_en: string;
  hourly_remaining: number;
  daily_remaining: number;
  exceeded?: RateLimitWindow;
} {
  const window = result.exceeded ?? "hour";
  return {
    ok: false,
    error_code: "FAMILY_INVITE_RATE_LIMIT_EXCEEDED",
    error_message_vi:
      window === "hour"
        ? `Bạn đã gửi ${result.hourly_used} lời mời trong giờ qua. Tối đa ${result.hourly_limit}/giờ — vui lòng đợi rồi mời tiếp.`
        : `Bạn đã gửi ${result.daily_used} lời mời hôm nay. Tối đa ${result.daily_limit}/ngày — quay lại ngày mai nhé.`,
    error_message_en:
      window === "hour"
        ? `You've sent ${result.hourly_used} invitations in the last hour (max ${result.hourly_limit}/hr). Please wait before inviting more.`
        : `You've sent ${result.daily_used} invitations today (max ${result.daily_limit}/day). Come back tomorrow.`,
    hourly_remaining: result.hourly_remaining,
    daily_remaining: result.daily_remaining,
    exceeded: window,
  };
}
