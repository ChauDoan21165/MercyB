// User testimonial eligibility — the gate that stops us asking new
// or struggling users for a "success story" they don't have yet.
//
// Eligibility = ALL of:
//   1. Paid user (profiles.tier >= 1)
//   2. Account age >= 21 days (room to actually progress)
//   3. >= 50 speech_attempts (real practice, not just signup)
//   4. Sustained week-over-week-over-week improvement on match_score
//      (3 trailing weeks; later week's avg > earlier week's avg, and
//      cumulative gain >= +0.05 on the 0..1 scale = +5 pts on a 100 scale)
//
// Reasons are returned bilingual so the UI can show `reasonVi` directly
// without an extra translation step.
//
// If `speech_attempts` doesn't exist or returns < 3 weeks of data, we
// fall through to `not enough speech data` rather than guessing.

import { supabase } from "@/lib/supabaseClient";

export type EligibilityResult =
  | { eligible: true }
  | { eligible: false; reason: string; reasonVi: string };

const MIN_TIER = 1;
const MIN_ACCOUNT_AGE_DAYS = 21;
const MIN_ATTEMPTS = 50;
const MIN_CUMULATIVE_GAIN = 0.05; // +5 on a 100-pt scale, on 0..1 match_score
const TRAILING_WEEKS = 3;
const DAY_MS = 86_400_000;

interface ProfileRow {
  tier: number | null;
  created_at: string | null;
}

interface AttemptRow {
  match_score: number | null;
  created_at: string;
}

/**
 * Bucket attempts into N trailing weekly windows ending at `now`. Returns
 * an array of length `weeks`, oldest first. Each entry is the average of
 * `match_score` for that window, or null when the window has no data.
 *
 * Bucket boundaries: [now - 7*(i+1) days, now - 7*i days). Index 0 is the
 * oldest window, index weeks-1 is the most recent.
 */
export function bucketAttemptScoresByWeek(
  attempts: ReadonlyArray<AttemptRow>,
  now: Date,
  weeks: number,
): Array<number | null> {
  const buckets: Array<{ sum: number; n: number }> = [];
  for (let i = 0; i < weeks; i++) buckets.push({ sum: 0, n: 0 });

  const nowMs = now.getTime();
  for (const a of attempts) {
    if (a.match_score == null) continue;
    const t = new Date(a.created_at).getTime();
    if (Number.isNaN(t)) continue;
    const ageDays = (nowMs - t) / DAY_MS;
    if (ageDays < 0 || ageDays >= weeks * 7) continue;
    // Most-recent window is `weeks-1`, oldest is `0`.
    const idx = weeks - 1 - Math.floor(ageDays / 7);
    if (idx < 0 || idx >= weeks) continue;
    buckets[idx].sum += a.match_score;
    buckets[idx].n += 1;
  }

  return buckets.map((b) => (b.n === 0 ? null : b.sum / b.n));
}

/**
 * Pure check: given 3 weekly averages, decide whether improvement was
 * sustained. Rule:
 *   - All 3 windows must have data
 *   - Each later window's avg must be >= earlier window's avg
 *   - Cumulative gain (last - first) must be >= MIN_CUMULATIVE_GAIN
 *
 * Pure so it's trivially testable without Supabase mocks.
 */
export function hasSustainedImprovement(
  weeklyAverages: ReadonlyArray<number | null>,
): boolean {
  if (weeklyAverages.length < TRAILING_WEEKS) return false;
  for (const v of weeklyAverages) {
    if (v == null) return false;
  }
  const nums = weeklyAverages as number[];
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < nums[i - 1]) return false;
  }
  const cumulativeGain = nums[nums.length - 1] - nums[0];
  return cumulativeGain >= MIN_CUMULATIVE_GAIN;
}

/**
 * The full eligibility check. Returns `{ eligible: true }` or
 * `{ eligible: false, reason, reasonVi }`. UIs should display `reasonVi`.
 *
 * Order of checks is the cheapest-first / most-likely-fail-first:
 *   tier → age → attempt count → score trend.
 */
export async function isUserEligibleToShareStory(
  userId: string,
): Promise<EligibilityResult> {
  if (!userId) {
    return {
      eligible: false,
      reason: "missing user id",
      reasonVi: "Vui lòng đăng nhập để chia sẻ câu chuyện.",
    };
  }

  // 1. Profile: tier and created_at
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("tier, created_at")
    .eq("id", userId)
    .maybeSingle<ProfileRow>();

  if (profileError) {
    return {
      eligible: false,
      reason: `profile lookup failed: ${profileError.message}`,
      reasonVi: "Không tải được thông tin tài khoản. Vui lòng thử lại sau.",
    };
  }
  if (!profile) {
    return {
      eligible: false,
      reason: "profile not found",
      reasonVi: "Không tìm thấy tài khoản của bạn.",
    };
  }

  const tier = profile.tier ?? 0;
  if (tier < MIN_TIER) {
    return {
      eligible: false,
      reason: `tier < ${MIN_TIER}`,
      reasonVi:
        "Tính năng chia sẻ câu chuyện hiện dành cho người dùng đã đăng ký gói trả phí.",
    };
  }

  // 2. Account age
  if (!profile.created_at) {
    return {
      eligible: false,
      reason: "profile created_at missing",
      reasonVi: "Tài khoản của bạn chưa đủ thời gian để chia sẻ.",
    };
  }
  const ageDays =
    (Date.now() - new Date(profile.created_at).getTime()) / DAY_MS;
  if (ageDays < MIN_ACCOUNT_AGE_DAYS) {
    const remaining = Math.ceil(MIN_ACCOUNT_AGE_DAYS - ageDays);
    return {
      eligible: false,
      reason: `account age < ${MIN_ACCOUNT_AGE_DAYS} days`,
      reasonVi: `Hãy luyện tập thêm ${remaining} ngày nữa rồi quay lại chia sẻ nhé.`,
    };
  }

  // 3. Attempt count (head:true keeps the row payload empty — we only
  // need the count).
  const { count: attemptCount, error: countError } = await supabase
    .from("speech_attempts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError) {
    return {
      eligible: false,
      reason: `speech_attempts count failed: ${countError.message}`,
      reasonVi: "Chưa đủ dữ liệu phát âm",
    };
  }
  if ((attemptCount ?? 0) < MIN_ATTEMPTS) {
    return {
      eligible: false,
      reason: `speech_attempts < ${MIN_ATTEMPTS}`,
      reasonVi: `Hãy luyện ít nhất ${MIN_ATTEMPTS} lần phát âm để có đủ chất liệu cho câu chuyện.`,
    };
  }

  // 4. Score trend: pull last 21 days of (match_score, created_at) and
  // bucket into 3 trailing weeks.
  const since = new Date(Date.now() - TRAILING_WEEKS * 7 * DAY_MS).toISOString();
  const { data: attempts, error: attemptsError } = await supabase
    .from("speech_attempts")
    .select("match_score, created_at")
    .eq("user_id", userId)
    .gte("created_at", since)
    .order("created_at", { ascending: true });

  if (attemptsError) {
    return {
      eligible: false,
      reason: `speech_attempts query failed: ${attemptsError.message}`,
      reasonVi: "Chưa đủ dữ liệu phát âm",
    };
  }

  const weekly = bucketAttemptScoresByWeek(
    (attempts ?? []) as AttemptRow[],
    new Date(),
    TRAILING_WEEKS,
  );

  if (!hasSustainedImprovement(weekly)) {
    return {
      eligible: false,
      reason: "score trend not sustained",
      reasonVi:
        "Điểm số chưa thể hiện sự tiến bộ bền vững. Hãy tiếp tục luyện tập rồi quay lại nhé.",
    };
  }

  return { eligible: true };
}

// Exported constants for tests + UI copy. Keeping these here means the
// thresholds live in exactly one place.
export const STORY_ELIGIBILITY_THRESHOLDS = {
  MIN_TIER,
  MIN_ACCOUNT_AGE_DAYS,
  MIN_ATTEMPTS,
  MIN_CUMULATIVE_GAIN,
  TRAILING_WEEKS,
} as const;
