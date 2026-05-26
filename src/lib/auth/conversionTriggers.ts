// src/lib/auth/conversionTriggers.ts
//
// Decides WHEN to surface the "Save your progress" CTA to an anonymous
// session. Pure function so vitest can drive it deterministically;
// callers wrap it with sessionStorage / supabase reads.
//
// Trigger conditions per the brief:
//   - 3+ practice sessions in same anon session
//   - User attempts a paid feature
//   - 24+ hours of anon usage
//   - User attempts to share score (FB share path)
//
// "Don't prompt more than once per session" is enforced by the caller
// flipping the `alreadyShownThisSession` flag once the prompt renders.

const HOUR_MS = 60 * 60 * 1000;

export interface ConversionTriggerInput {
  /** Is the current user anonymous? (false → never trigger). */
  isAnonymous: boolean;
  /** Number of practice sessions completed in this anon session. */
  practiceSessionsThisSession: number;
  /** ms since the anonymous session was created (auth.users.created_at). */
  anonSessionAgeMs: number;
  /** Already shown the conversion prompt during THIS browser session? */
  alreadyShownThisSession: boolean;
  /** True if the user just attempted a feature gated to paid tiers. */
  paidFeatureAttempted: boolean;
  /** True if the user just clicked "Share to Facebook" / similar. */
  shareAttempted: boolean;
}

export type ConversionTriggerReason =
  | "practice_threshold"
  | "session_age_24h"
  | "paid_feature"
  | "share_intent";

export interface ConversionTriggerResult {
  shouldPrompt: boolean;
  reason?: ConversionTriggerReason;
}

export const PRACTICE_SESSION_THRESHOLD = 3;
export const SESSION_AGE_THRESHOLD_MS = 24 * HOUR_MS;

/**
 * Pure decision function. Returns shouldPrompt + the *first* reason
 * that triggered, in priority order:
 *   1. share_intent (highest — user is about to share publicly)
 *   2. paid_feature (user hit a wall)
 *   3. practice_threshold (engaged user)
 *   4. session_age_24h (slow burn)
 */
export function shouldShowConversionPrompt(
  input: ConversionTriggerInput,
): ConversionTriggerResult {
  if (!input.isAnonymous) return { shouldPrompt: false };
  if (input.alreadyShownThisSession) return { shouldPrompt: false };

  if (input.shareAttempted) {
    return { shouldPrompt: true, reason: "share_intent" };
  }
  if (input.paidFeatureAttempted) {
    return { shouldPrompt: true, reason: "paid_feature" };
  }
  if (input.practiceSessionsThisSession >= PRACTICE_SESSION_THRESHOLD) {
    return { shouldPrompt: true, reason: "practice_threshold" };
  }
  if (input.anonSessionAgeMs >= SESSION_AGE_THRESHOLD_MS) {
    return { shouldPrompt: true, reason: "session_age_24h" };
  }
  return { shouldPrompt: false };
}

/**
 * Loss-aversion message generator. Renders the bilingual VI/EN
 * "you'd lose this" line shown above the conversion form.
 */
export function buildLossAversionMessage(input: {
  practiceCount: number;
  streakCurrent: number;
  weeklyRank: number | null;
}): { vi: string; en: string } {
  const parts_vi: string[] = [];
  const parts_en: string[] = [];
  if (input.practiceCount > 0) {
    parts_vi.push(`${input.practiceCount} lượt luyện`);
    parts_en.push(`${input.practiceCount} practice attempts`);
  }
  if (input.streakCurrent > 0) {
    parts_vi.push(`streak ${input.streakCurrent} ngày`);
    parts_en.push(`${input.streakCurrent}-day streak`);
  }
  if (input.weeklyRank !== null && input.weeklyRank > 0) {
    parts_vi.push(`hạng #${input.weeklyRank} tuần này`);
    parts_en.push(`rank #${input.weeklyRank} this week`);
  }

  if (parts_vi.length === 0) {
    return {
      vi: "Đăng ký để giữ tiến độ học của bạn.",
      en: "Sign up to keep your learning progress.",
    };
  }
  return {
    vi: `Bạn có ${parts_vi.join(", ")}. Nếu mất phiên này, tất cả mất theo.`,
    en: `You have ${parts_en.join(", ")}. If this session ends, you lose all of it.`,
  };
}
