// Priority-ordered practice recommendation rules.
//
// Each rule answers two questions:
//   1. Is this user eligible for this kind of recommendation right now?
//   2. If so, what specifically should they practice and why?
//
// The orchestrator (./practiceRecommendations) walks rules in array
// order and returns the first one whose eligibility passes AND whose
// recommendation isn't on cooldown. So order in this file IS the
// priority ladder — most specific signal first, gentlest re-prompt
// last.
//
// All rules read ONLY from the `RecommendationContext` they're given —
// no I/O, no side effects, deterministic on (ctx, rule). Easy to test.

import type { WeeklyProgress } from "@/lib/analytics/speechProgress";

export type RecommendationType =
  | "weak_phoneme_drill"
  | "build_consistency"
  | "new_territory"
  | "mock_interview_prep"
  | "reading_aloud_focus"
  | "warm_up";

export type Recommendation = {
  /**
   * Stable, deterministic identifier for cooldown matching. Format:
   * `{type}:{specifier}` — e.g. `weak_phoneme_drill:th`. Same target
   * = same id = subject to the 4-hour cooldown.
   */
  id: string;
  type: RecommendationType;
  title_vi: string;
  title_en: string;
  description_vi: string;
  description_en: string;
  /**
   * Where the "Bắt đầu" CTA lands. May be a roomId (for /room/<id>),
   * a route path (for /speak, /interview, etc.), or null when the
   * caller should pick a sensible default. Convention: roomId is
   * a bare string, routes start with `/`.
   */
  target: string | null;
  /** Estimated practice minutes — drives the "5 phút" pill. */
  estimated_minutes: number;
  /** "Why this?" expander copy. VI primary; EN paired below in UI. */
  why_this_matters_vi: string;
  why_this_matters_en: string;
};

export type RecommendationContext = {
  userId: string;
  weekly: WeeklyProgress;
  /** Caller-supplied "now" for deterministic testing. */
  now: number;
  /**
   * Optional. When the caller has the data, pass the most recent
   * room/path activity so consistency + new-territory rules can be
   * smarter. Keep tiny — full activity history is /progress's job.
   */
  recentActivity?: RecentPracticeActivity;
};

/**
 * Minimal practice-history slice for the rules. Caller fills what
 * it has; rules degrade gracefully when fields are missing.
 */
export type RecentPracticeActivity = {
  /** When the user last opened the Speak tab and recorded a real attempt. */
  lastSpeakAtMs?: number;
  /** Rooms practiced in the last 14 days, newest first. */
  recentRoomIds?: string[];
  /** True if the user has opened /interview at least once. */
  hasUsedMockInterview?: boolean;
  /** Estimated minutes the user spent on Speak this week. */
  speakMinutesThisWeek?: number;
  /** Optional level hint from placement / VSTEP tagging. */
  level?: string | null;
};

export interface RecommendationRule {
  /** Stable name for telemetry / debugging. */
  name: string;
  isEligible(ctx: RecommendationContext): boolean;
  /**
   * Return a Recommendation, or null when eligibility passed but the
   * underlying data couldn't produce a concrete suggestion (e.g.
   * mostImproved exists but no matching weak phoneme).
   */
  build(ctx: RecommendationContext): Recommendation | null;
}

// ── Tunables ────────────────────────────────────────────────────────────

const WEAK_PHONEME_SCORE_FLOOR = 60;
const WEAK_PHONEME_MIN_ATTEMPTS = 3;
const CONSISTENCY_DAYS_GAP = 7 * 24 * 60 * 60 * 1000;
const WARM_UP_DAYS_AWAY = 2 * 24 * 60 * 60 * 1000;
const READING_HIGH_SCORE = 75;
const READING_LOW_MINUTES = 10;

// ── Rule 1: Weak phoneme drill ──────────────────────────────────────────

const weakPhonemeDrill: RecommendationRule = {
  name: "weak_phoneme_drill",
  isEligible(ctx) {
    const weakest = ctx.weekly.weakest[0];
    if (!weakest) return false;
    if (weakest.attemptCount < WEAK_PHONEME_MIN_ATTEMPTS) return false;
    if (weakest.averageScore >= WEAK_PHONEME_SCORE_FLOOR) return false;
    return true;
  },
  build(ctx) {
    const weakest = ctx.weekly.weakest[0];
    if (!weakest) return null;
    const phoneme = weakest.phoneme;
    return {
      id: `weak_phoneme_drill:${phoneme}`,
      type: "weak_phoneme_drill",
      title_vi: `Luyện âm /${phoneme}/ — 5 phút`,
      title_en: `/${phoneme}/ drill — 5 minutes`,
      description_vi:
        `Tuần này âm /${phoneme}/ của bạn đang ở ${Math.round(weakest.averageScore)}/100. ` +
        `Vài lần đọc tập trung sẽ kéo điểm lên nhanh.`,
      description_en:
        `Your /${phoneme}/ is at ${Math.round(weakest.averageScore)}/100 this week. ` +
        `A few focused passes will pull it up quickly.`,
      target: "/speak",
      estimated_minutes: 5,
      why_this_matters_vi:
        `Đây là âm có điểm thấp nhất tuần này. Sửa một âm cụ thể trong 5 phút ` +
        `hiệu quả hơn việc lướt qua cả câu nhiều lần.`,
      why_this_matters_en:
        `This is your lowest-scoring phoneme this week. Five focused minutes ` +
        `on one sound beats running whole sentences over and over.`,
    };
  },
};

// ── Rule 2: Consistency / return to a room you practiced last week ──────

const buildConsistency: RecommendationRule = {
  name: "build_consistency",
  isEligible(ctx) {
    if (!ctx.recentActivity?.recentRoomIds?.length) return false;
    if (!ctx.recentActivity?.lastSpeakAtMs) return false;
    // Has practiced something AT LEAST 7 days ago and not yet returned.
    return ctx.now - ctx.recentActivity.lastSpeakAtMs >= CONSISTENCY_DAYS_GAP;
  },
  build(ctx) {
    const roomId = ctx.recentActivity?.recentRoomIds?.[0];
    if (!roomId) return null;
    return {
      id: `build_consistency:${roomId}`,
      type: "build_consistency",
      title_vi: `Quay lại bài cũ — 5 phút`,
      title_en: `Back to your last room — 5 minutes`,
      description_vi:
        `Bạn đã luyện phòng này tuần trước nhưng chưa quay lại tuần này. ` +
        `Tiếp tục để giữ chuỗi học đều.`,
      description_en:
        `You practised this room last week but haven't been back this week. ` +
        `Pick up where you left off to keep the streak alive.`,
      target: roomId,
      estimated_minutes: 5,
      why_this_matters_vi:
        `Tiến bộ thật đến từ việc quay lại đúng nội dung — không phải mỗi lần một bài mới.`,
      why_this_matters_en:
        `Real progress comes from returning to the same material — not from a new room every session.`,
    };
  },
};

// ── Rule 3: Mock interview prep — Speaking practice but no mock yet ─────

const mockInterviewPrep: RecommendationRule = {
  name: "mock_interview_prep",
  isEligible(ctx) {
    const a = ctx.recentActivity;
    if (!a) return false;
    if (a.hasUsedMockInterview === true) return false;
    return (a.speakMinutesThisWeek ?? 0) >= 5;
  },
  build() {
    return {
      id: `mock_interview_prep:default`,
      type: "mock_interview_prep",
      title_vi: `Thử phỏng vấn giả lập — 8 phút`,
      title_en: `Try a mock interview — 8 minutes`,
      description_vi:
        `Bạn đã luyện nói khá nhiều tuần này. Bước tiếp theo là kiểm tra ` +
        `dưới áp lực thật — phỏng vấn giả lập sẽ chỉ ra bạn vững ở đâu, ` +
        `bí ở đâu.`,
      description_en:
        `You've been practising speaking a lot this week. The next step is ` +
        `pressure-testing it — a mock interview shows where you're solid ` +
        `and where you freeze.`,
      target: "/interview",
      estimated_minutes: 8,
      why_this_matters_vi:
        `Đọc câu mẫu và trả lời phỏng vấn là hai kỹ năng khác nhau. ` +
        `Nếu chỉ luyện cái đầu, cái sau vẫn sẽ run.`,
      why_this_matters_en:
        `Reading sentences and answering interview questions are different skills. ` +
        `Practising one doesn't unlock the other.`,
    };
  },
};

// ── Rule 4: Reading-aloud focus ─────────────────────────────────────────

const readingAloudFocus: RecommendationRule = {
  name: "reading_aloud_focus",
  isEligible(ctx) {
    const overall = ctx.weekly.thisWeek.averageScore;
    if (overall === null || overall < READING_HIGH_SCORE) return false;
    const minutes = ctx.recentActivity?.speakMinutesThisWeek ?? 0;
    return minutes < READING_LOW_MINUTES;
  },
  build(ctx) {
    return {
      id: `reading_aloud_focus:default`,
      type: "reading_aloud_focus",
      title_vi: `Đọc to thêm chút nữa — 5 phút`,
      title_en: `A bit more reading aloud — 5 minutes`,
      description_vi:
        `Phát âm của bạn đã tốt (${ctx.weekly.thisWeek.averageScore}/100). ` +
        `Luyện đọc to thêm sẽ giúp giữ phong độ và làm âm trở nên tự nhiên.`,
      description_en:
        `Your pronunciation is solid (${ctx.weekly.thisWeek.averageScore}/100). ` +
        `More reading-aloud time keeps the score up and makes it feel natural.`,
      target: "/speak",
      estimated_minutes: 5,
      why_this_matters_vi:
        `Điểm cao thường đi trước "tự nhiên". Thời gian đọc to là cách rút ngắn khoảng cách đó.`,
      why_this_matters_en:
        `A high score comes before "fluent feel." Time on the page is what closes that gap.`,
    };
  },
};

// ── Rule 5: Warm-up after a 2+ day gap ──────────────────────────────────

const warmUp: RecommendationRule = {
  name: "warm_up",
  isEligible(ctx) {
    const last = ctx.recentActivity?.lastSpeakAtMs;
    if (!last) return false;
    return ctx.now - last >= WARM_UP_DAYS_AWAY;
  },
  build(ctx) {
    const days = Math.max(
      2,
      Math.floor((ctx.now - (ctx.recentActivity?.lastSpeakAtMs ?? ctx.now)) / (24 * 60 * 60 * 1000)),
    );
    return {
      id: `warm_up:default`,
      type: "warm_up",
      title_vi: `Khởi động nhanh — 3 phút`,
      title_en: `Quick warm-up — 3 minutes`,
      description_vi:
        `${days} ngày rồi bạn chưa luyện. Một câu ngắn là đủ để làm nóng lại.`,
      description_en:
        `You haven't practised in ${days} days. One short sentence is enough to warm up again.`,
      target: "/speak",
      estimated_minutes: 3,
      why_this_matters_vi:
        `Lùi quá lâu thì bắt đầu lại sẽ ngại. Ba phút phá vỡ rào cản đó.`,
      why_this_matters_en:
        `Long gaps make starting feel hard. Three minutes breaks that wall.`,
    };
  },
};

// ── Priority ladder ─────────────────────────────────────────────────────
//
// 1. Specific weakness wins (you have a problem, here's the fix)
// 2. Returning to in-progress material wins next (consistency > novelty)
// 3. New territory (mock interview) for users who've outgrown reading
// 4. Reading-aloud focus for high-pronunciation users with low minutes
// 5. Gentle re-prompt after a gap

export const RECOMMENDATION_RULES: readonly RecommendationRule[] = [
  weakPhonemeDrill,
  buildConsistency,
  mockInterviewPrep,
  readingAloudFocus,
  warmUp,
];

// Internal exports for tests.
export const __RULES_INTERNAL = {
  weakPhonemeDrill,
  buildConsistency,
  mockInterviewPrep,
  readingAloudFocus,
  warmUp,
};
