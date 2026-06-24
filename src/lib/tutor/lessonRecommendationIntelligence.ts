/**
 * Teacher Mercy — Lesson Recommendation Intelligence Layer
 *
 * Makes lesson recommendations feel like a skilled human teacher by layering:
 *   1. CEFR-aware scaffolding — different strategy per proficiency level
 *   2. Goal alignment — prioritizes recommendations that serve stated goals
 *   3. Recency-aware diversity — avoids repeating what was just practiced
 *   4. Challenge gradient — recommends at the zone of proximal development
 *   5. Session cadence awareness — adapts pacing to practice frequency
 *   6. Topic diversity scoring — ensures real-world scenario exposure
 *   7. Teacher-quality reasoning — natural, empathetic recommendation messages
 *
 * This module WRAPS (does not replace) nextLessonRecommender.ts and
 * todayLessonPlanner.ts. It takes their output and enriches it with
 * human-teacher judgment — the same way a real teacher doesn't just
 * assign the next page in the textbook but considers the whole learner.
 *
 * Pure functions — no I/O, no side effects, deterministic.
 * Vietnamese-first: all user-facing reason text is in Vietnamese.
 */

import type { LearnerHistoryProfile } from "./learnerHistoryProfile";
import type { TodayLessonMode } from "./todayLessonPlanner";
import {
  recommendNextLessons,
  type NextLessonRecommendation,
} from "./nextLessonRecommender";

// ─── Learner Goals ─────────────────────────────────────────────────────────

/**
 * Goals a learner might have stated or that Mercy can infer from behavior.
 *
 * These map to the real-world English use cases MercyBlade serves:
 * Vietnamese learners need English for specific life outcomes.
 */
export type LearnerGoal =
  | "ielts_preparation"
  | "daily_conversation"
  | "workplace_english"
  | "travel_english"
  | "customer_service"
  | "job_interview"
  | "study_abroad"
  | "parent_teacher_communication"
  | "healthcare_visits"
  | "general_improvement"
  | (string & {});

// ─── CEFR Level ────────────────────────────────────────────────────────────

/**
 * CEFR proficiency levels used for scaffolding decisions.
 */
export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

// ─── Recent Activity ───────────────────────────────────────────────────────

/**
 * What the learner has practiced recently — for recency-aware diversity.
 */
export type RecentPracticeEntry = {
  /** Topic or skill tag practiced (e.g., "past-tense", "food-ordering"). */
  topic: string;
  /** Unix ms of the practice session. */
  practicedAt: number;
  /** The mode used (grammar, speak, journey, logic). */
  mode: TodayLessonMode;
};

// ─── Input Types ───────────────────────────────────────────────────────────

/**
 * Full context for making an intelligent lesson recommendation.
 */
export type RecommendationIntelligenceInput = {
  /** The learner's history profile (from nextLessonRecommender). */
  profile: LearnerHistoryProfile;
  /** The learner's CEFR level, if known. */
  cefrLevel: CefrLevel | null;
  /** Stated or inferred learner goals (may be empty). */
  goals: LearnerGoal[];
  /** Recently practiced topics/skills (most recent first). */
  recentPractice: RecentPracticeEntry[];
  /** Average days between practice sessions (null if unknown). */
  avgDaysBetweenSessions: number | null;
  /** Current timestamp (injectable for testing). */
  now?: number;
};

// ─── Output Types ──────────────────────────────────────────────────────────

/**
 * Which teaching strategy Mercy chose for this recommendation.
 *
 * A human teacher doesn't always do the same thing — she picks a strategy
 * based on the learner's current state and recent history.
 */
export type RecommendationStrategy =
  | "cement_foundation"     // Learner is struggling with basics → drill fundamentals
  | "stretch_zone"          // Learner is ready for a challenge → push slightly beyond comfort
  | "polish_fluency"        // Learner is advanced → refine naturalness, not grammar
  | "real_world_practice"   // Learner needs to apply skills in realistic scenarios
  | "review_and_consolidate" // Learner hasn't practiced recently → review to prevent loss
  | "explore_new_topic"     // Learner is doing well → introduce variety to maintain interest
  | "target_weakness"       // A specific weakness pattern is holding the learner back
  | "build_confidence"      // Learner seems hesitant → success-oriented easy practice
  | "maintain_momentum";    // Learner is in a good rhythm → keep going, slight variety

/**
 * How challenging the recommended lesson should feel to the learner.
 */
export type ChallengeLevel = "easy" | "comfortable" | "moderate" | "stretch" | "hard";

/**
 * An enhanced lesson recommendation with human-teacher intelligence.
 */
export type IntelligentRecommendation = {
  /** The base recommendation from nextLessonRecommender (enriched). */
  base: NextLessonRecommendation;
  /** The teaching strategy Mercy chose. */
  strategy: RecommendationStrategy;
  /** How challenging this lesson should feel. */
  challengeLevel: ChallengeLevel;
  /** Whether this recommendation aligns with the learner's stated goals. */
  alignedWithGoals: boolean;
  /** Which goals this serves (empty if none). */
  servedGoals: LearnerGoal[];
  /** Whether this recommendation avoids recently-practiced topics. */
  respectsRecency: boolean;
  /** Recently practiced topics that overlap with this recommendation. */
  recencyOverlaps: string[];
  /**
   * Teacher-quality reason in Vietnamese — sounds like Mercy the human teacher,
   * not like a recommendation algorithm.
   */
  teacherReasonVi: string;
  /**
   * A natural preamble Mercy might say before suggesting this lesson.
   * Example: "Hôm nay mình thấy bạn đã sẵn sàng thử thách mới rồi."
   */
  preambleVi: string;
  /**
   * Diversity note — what kind of variety this adds to the learner's practice.
   */
  diversityNoteVi: string;
};

// ─── CEFR → Strategy Mapping ───────────────────────────────────────────────

/**
 * Which strategies make sense at each CEFR level.
 *
 * A1–A2: cement foundation, build confidence, target weakness
 * B1–B2: stretch zone, real-world practice, explore new topics
 * C1–C2: polish fluency, real-world practice, maintain momentum
 */
const CEFR_STRATEGY_PRIORITY: Record<CefrLevel, RecommendationStrategy[]> = {
  A1: ["cement_foundation", "build_confidence", "target_weakness", "review_and_consolidate"],
  A2: ["cement_foundation", "real_world_practice", "target_weakness", "stretch_zone"],
  B1: ["stretch_zone", "real_world_practice", "target_weakness", "explore_new_topic"],
  B2: ["stretch_zone", "real_world_practice", "polish_fluency", "explore_new_topic"],
  C1: ["polish_fluency", "real_world_practice", "explore_new_topic", "maintain_momentum"],
  C2: ["polish_fluency", "maintain_momentum", "explore_new_topic", "real_world_practice"],
};

// ─── Goal → Skill Mapping ──────────────────────────────────────────────────

/**
 * Maps learner goals to the skills/topics that serve them.
 * Used to check whether a recommendation aligns with stated goals.
 */
const GOAL_SKILL_MAP: Record<LearnerGoal, string[]> = {
  ielts_preparation: [
    "missing-article", "tense-omission", "subj-verb-agreement",
    "preposition-calque", "word-order", "zero-copula", "double-negation",
    "grammar", "writing", "speaking",
  ],
  daily_conversation: [
    "speak", "introductions", "food-ordering", "shopping",
    "daily-life", "family", "social",
  ],
  workplace_english: [
    "work-job", "phone-call", "email", "meeting",
    "customer-service", "presentation",
  ],
  travel_english: [
    "travel", "hotel", "airport", "transportation",
    "directions", "restaurant", "shopping",
  ],
  customer_service: [
    "customer-service", "phone-call", "politeness-register",
    "service", "complaints",
  ],
  job_interview: [
    "job-interview", "introductions", "work-job",
    "past-tense", "subj-verb-agreement",
  ],
  study_abroad: [
    "ielts", "writing", "speaking", "academic",
    "missing-article", "tense-omission",
  ],
  parent_teacher_communication: [
    "school", "childcare", "introductions", "phone-call",
    "daily-life",
  ],
  healthcare_visits: [
    "health", "doctor", "pharmacy", "symptoms",
    "appointment",
  ],
  general_improvement: [
    // All topics are relevant for general improvement
    "speak", "grammar", "journey", "logic",
  ],
};

// ─── CEFR → Challenge Calibration ──────────────────────────────────────────

/**
 * What challenge level is appropriate at each CEFR level
 * for each type of recommendation.
 *
 * A1 learners need "easy" to "comfortable" — too hard kills confidence.
 * C1 learners need "stretch" to "hard" — too easy is boring.
 */
export function calibrateChallengeLevel(
  cefrLevel: CefrLevel | null,
  strategy: RecommendationStrategy,
): ChallengeLevel {
  if (!cefrLevel) {
    // Unknown level — default to moderate (safe middle ground)
    return strategy === "build_confidence" ? "easy" : "moderate";
  }

  switch (cefrLevel) {
    case "A1":
      return strategy === "stretch_zone" ? "comfortable" : "easy";
    case "A2":
      return strategy === "stretch_zone" ? "moderate" : "comfortable";
    case "B1":
      return strategy === "cement_foundation" ? "comfortable"
        : strategy === "stretch_zone" ? "stretch"
        : "moderate";
    case "B2":
      return strategy === "stretch_zone" ? "hard"
        : strategy === "cement_foundation" ? "comfortable"
        : "moderate";
    case "C1":
      return strategy === "polish_fluency" ? "stretch"
        : strategy === "stretch_zone" ? "hard"
        : "moderate";
    case "C2":
      return strategy === "polish_fluency" ? "hard" : "stretch";
  }
}

// ─── Strategy Selection ────────────────────────────────────────────────────

/**
 * Choose the best teaching strategy given the learner's context.
 *
 * Logic (evaluated in order, first match wins):
 *   1. Low session count + beginner CEFR → build_confidence
 *   2. Long gap since last session → review_and_consolidate
 *   3. Clear interference patterns → target_weakness
 *   4. Advanced CEFR → polish_fluency
 *   5. Good cadence + intermediate → stretch_zone
 *   6. Recently practiced same topic → explore_new_topic
 *   7. Default based on CEFR → first viable strategy from CEFR_STRATEGY_PRIORITY
 */
export function chooseStrategy(input: RecommendationIntelligenceInput): RecommendationStrategy {
  const { profile, cefrLevel, recentPractice, avgDaysBetweenSessions, now } = input;
  const currentTime = now ?? Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;

  // ── 1. Build confidence for brand-new beginners ──
  if (
    profile.sessionCount <= 3 &&
    (cefrLevel === "A1" || cefrLevel === "A2" || cefrLevel === null)
  ) {
    return "build_confidence";
  }

  // ── 2. Long gap → review and consolidate ──
  if (recentPractice.length > 0) {
    const lastPracticeAge = currentTime - recentPractice[0].practicedAt;
    const gapDays = lastPracticeAge / DAY_MS;
    // If last practiced more than 7 days ago, or avg gap is > 5 days
    if (gapDays > 7 || (avgDaysBetweenSessions !== null && avgDaysBetweenSessions > 5)) {
      return "review_and_consolidate";
    }
  } else if (profile.sessionCount > 0 && avgDaysBetweenSessions !== null && avgDaysBetweenSessions > 7) {
    // No recent practice entries but we know the cadence is sparse
    return "review_and_consolidate";
  }

  // ── 3. Clear interference pattern → target weakness ──
  const strongPatterns = profile.interferencePatterns.filter(
    (p) => p.observedCount >= 3,
  );
  if (strongPatterns.length > 0) {
    return "target_weakness";
  }

  // ── 4. Advanced CEFR → polish fluency ──
  if (cefrLevel === "C1" || cefrLevel === "C2") {
    return "polish_fluency";
  }

  // ── 5. Good cadence + intermediate → stretch zone ──
  if (
    (cefrLevel === "B1" || cefrLevel === "B2") &&
    profile.sessionCount >= 5 &&
    (avgDaysBetweenSessions === null || avgDaysBetweenSessions <= 3)
  ) {
    return "stretch_zone";
  }

  // ── 6. Recent practice overlap → explore new topic ──
  if (recentPractice.length >= 2) {
    const recentTopics = new Set(
      recentPractice.slice(0, 3).map((e) => e.topic),
    );
    // If the last 3 sessions covered ≤ 2 distinct topics, add variety
    if (recentTopics.size <= 2 && profile.sessionCount >= 5) {
      return "explore_new_topic";
    }
  }

  // ── 7. Default by CEFR ──
  const strategies: RecommendationStrategy[] = cefrLevel
    ? CEFR_STRATEGY_PRIORITY[cefrLevel]
    : ["cement_foundation", "build_confidence", "real_world_practice"];
  return strategies[0];
}

// ─── Goal Alignment ────────────────────────────────────────────────────────

/**
 * Check whether a recommended lesson aligns with the learner's stated goals.
 *
 * Returns the set of goals this recommendation serves.
 */
export function checkGoalAlignment(
  recommendation: NextLessonRecommendation,
  goals: LearnerGoal[],
): { aligned: boolean; servedGoals: LearnerGoal[] } {
  if (goals.length === 0) {
    return { aligned: false, servedGoals: [] };
  }

  const skill = recommendation.targetSkill.toLowerCase();
  const servedGoals: LearnerGoal[] = [];

  for (const goal of goals) {
    const relevantSkills = GOAL_SKILL_MAP[goal] ?? [];
    if (relevantSkills.some((s) => skill.includes(s.toLowerCase()))) {
      servedGoals.push(goal);
    }
  }

  return {
    aligned: servedGoals.length > 0,
    servedGoals,
  };
}

// ─── Recency Check ─────────────────────────────────────────────────────────

/**
 * Check whether a recommendation overlaps with recently practiced topics.
 *
 * A human teacher avoids recommending the exact same thing the learner
 * just practiced — unless it needs repeated drilling.
 */
export function checkRecencyDiversity(
  recommendation: NextLessonRecommendation,
  recentPractice: RecentPracticeEntry[],
  now?: number,
): { respectsRecency: boolean; overlaps: string[] } {
  if (recentPractice.length === 0) {
    return { respectsRecency: true, overlaps: [] };
  }

  const DAY_MS = 24 * 60 * 60 * 1000;
  const currentTime = now ?? Date.now();
  const skill = recommendation.targetSkill.toLowerCase();

  const overlaps: string[] = [];
  for (const entry of recentPractice.slice(0, 5)) {
    const age = (currentTime - entry.practicedAt) / DAY_MS;
    // Only consider recent (within 3 days) as overlap
    if (age > 3) continue;

    const practicedTopic = entry.topic.toLowerCase();
    if (
      practicedTopic.includes(skill) ||
      skill.includes(practicedTopic)
    ) {
      overlaps.push(entry.topic);
    }
  }

  return {
    respectsRecency: overlaps.length === 0,
    overlaps,
  };
}

// ─── Teacher-Quality Reason Building ───────────────────────────────────────

/**
 * Build a natural, empathetic reason message — the kind a human teacher
 * would actually say, not what a recommendation algorithm outputs.
 *
 * Vietnamese-first: all messages are in Vietnamese because that's how
 * Teacher Mercy communicates with VN learners.
 */
export function buildTeacherReason(
  recommendation: NextLessonRecommendation,
  strategy: RecommendationStrategy,
  challengeLevel: ChallengeLevel,
  cefrLevel: CefrLevel | null,
  goalAligned: boolean,
  respectsRecency: boolean,
): { reasonVi: string; preambleVi: string; diversityNoteVi: string } {
  const skill = recommendation.targetSkill.replace(/-/g, " ");

  const preamble = pickPreamble(strategy);
  const reason = buildStrategyReason(strategy, skill, challengeLevel, cefrLevel);
  const diversityNote = buildDiversityNote(
    strategy,
    skill,
    goalAligned,
    respectsRecency,
  );

  return {
    reasonVi: reason,
    preambleVi: preamble,
    diversityNoteVi: diversityNote,
  };
}

// ─── Preamble Phrases ──────────────────────────────────────────────────────

const PREAMBLES: Record<RecommendationStrategy, string[]> = {
  cement_foundation: [
    "Mình thấy có một điểm nền tảng mình muốn bạn thật chắc —",
    "Trước khi tiến xa hơn, có một kỹ năng gốc mình muốn bạn nắm thật vững —",
    "Để nói tiếng Anh tự tin, mình nghĩ mình nên quay lại một điểm cơ bản —",
  ],
  stretch_zone: [
    "Hôm nay mình thấy bạn đã sẵn sàng thử thách mới rồi —",
    "Bạn đang tiến bộ tốt, mình nghĩ đã đến lúc đẩy lên một chút —",
    "Mình muốn bạn thử một bài khó hơn một chút hôm nay —",
  ],
  polish_fluency: [
    "Ngữ pháp của bạn đã rất tốt rồi — giờ mình tập trung vào độ tự nhiên nhé —",
    "Bạn viết đúng rồi, nhưng mình muốn giúp bạn nói tự nhiên như người bản xứ —",
    "Bây giờ mình không sửa lỗi nữa, mình giúp bạn trau chuốt cách diễn đạt —",
  ],
  real_world_practice: [
    "Mình nghĩ hôm nay mình nên luyện một tình huống thực tế —",
    "Thay vì học ngữ pháp khô, mình muốn bạn thực hành một tình huống đời thường —",
    "Mình chọn một tình huống bạn sẽ thực sự gặp ngoài đời —",
  ],
  review_and_consolidate: [
    "Đã lâu rồi mình chưa luyện cùng nhau — để mình giúp bạn ôn lại nhé —",
    "Mình thấy bạn đã nghỉ một thời gian — bắt đầu bằng ôn tập nhẹ nhàng nha —",
    "Trước khi học bài mới, mình muốn chắc là bạn vẫn nhớ bài cũ —",
  ],
  explore_new_topic: [
    "Bạn đã luyện chủ đề này khá nhiều rồi — hôm nay thử một chủ đề mới nha —",
    "Mình muốn mở rộng vốn tiếng Anh của bạn sang một lĩnh vực mới —",
    "Để bạn không thấy nhàm, hôm nay mình đổi gió một chút —",
  ],
  target_weakness: [
    "Mình đã để ý một điểm bạn cần cải thiện từ mấy buổi trước —",
    "Có một lỗi nhỏ mình thấy bạn lặp lại vài lần, mình muốn mình cùng sửa nó —",
    "Mình muốn mình dành buổi này để giải quyết dứt điểm một điểm yếu —",
  ],
  build_confidence: [
    "Mình biết mới bắt đầu có thể hơi ngợp — hôm nay mình làm bài dễ và vui trước nha —",
    "Mình không cần bạn nói hay ngay — mình chỉ cần bạn nói được một câu đơn giản hôm nay —",
    "Bắt đầu nhẹ nhàng thôi — mình chọn một bài ngắn và dễ thành công —",
  ],
  maintain_momentum: [
    "Bạn đang có đà rất tốt — mình tiếp tục giữ nhịp này nha —",
    "Mình thấy bạn đang tiến bộ đều — hôm nay mình luyện tiếp để giữ phong độ —",
    "Đà đang lên, mình không dừng — tiếp tục với một bài vừa sức nhé —",
  ],
};

function pickPreamble(strategy: RecommendationStrategy): string {
  const options = PREAMBLES[strategy];
  // Deterministic: use a hash of the strategy name to pick the same preamble
  const index = strategy.length % options.length;
  return options[index];
}

// ─── Strategy-Specific Reason Building ─────────────────────────────────────

function buildStrategyReason(
  strategy: RecommendationStrategy,
  skill: string,
  challengeLevel: ChallengeLevel,
  cefrLevel: CefrLevel | null,
): string {
  const cefrLabel = cefrLevel ? ` (trình độ ${cefrLevel})` : "";
  const challengeNote =
    challengeLevel === "easy"
      ? " — bài này khá dễ, phù hợp để bạn tự tin"
      : challengeLevel === "comfortable"
        ? " — vừa sức, bạn sẽ làm được"
        : challengeLevel === "moderate"
          ? " — hơi thử thách một chút nhưng trong tầm tay"
          : challengeLevel === "stretch"
            ? " — bài này sẽ đẩy bạn lên một chút, nhưng mình tin bạn làm được"
            : " — bài này khó, nhưng bạn đã sẵn sàng rồi";

  switch (strategy) {
    case "cement_foundation":
      return `Kỹ năng "${skill}" là nền tảng${cefrLabel}. Mình muốn bạn thật chắc điểm này trước khi tiến xa hơn${challengeNote}.`;

    case "stretch_zone":
      return `Bạn đã sẵn sàng thử thách với "${skill}"${cefrLabel}. Đây là bước tiến tự nhiên từ những gì bạn đã làm tốt${challengeNote}.`;

    case "polish_fluency":
      return `Ngữ pháp của bạn đã vững — giờ mình tập trung vào "${skill}" để bạn nói tự nhiên và trôi chảy hơn${challengeNote}.`;

    case "real_world_practice":
      return `Mình chọn "${skill}" vì đây là tình huống bạn sẽ thực sự gặp ngoài đời${cefrLabel}${challengeNote}.`;

    case "review_and_consolidate":
      return `Mình muốn ôn lại "${skill}" để bạn không quên những gì đã học${challengeNote}.`;

    case "explore_new_topic":
      return `Mình muốn bạn thử "${skill}" — một chủ đề mới để mở rộng vốn tiếng Anh${cefrLabel}${challengeNote}.`;

    case "target_weakness":
      return `Mình đã thấy "${skill}" là điểm bạn cần cải thiện nhất${cefrLabel}. Tập trung sửa điểm này sẽ giúp bạn tiến bộ rõ rệt${challengeNote}.`;

    case "build_confidence":
      return `Mình chọn "${skill}" vì bài này dễ thành công — mình muốn bạn cảm thấy tự tin trước đã${cefrLabel}${challengeNote}.`;

    case "maintain_momentum":
      return `Tiếp tục với "${skill}" để giữ đà tiến bộ của bạn${cefrLabel}${challengeNote}.`;

    default:
      return `Mình gợi ý luyện "${skill}" hôm nay${cefrLabel}${challengeNote}.`;
  }
}

// ─── Diversity Note Building ───────────────────────────────────────────────

function buildDiversityNote(
  strategy: RecommendationStrategy,
  skill: string,
  goalAligned: boolean,
  respectsRecency: boolean,
): string {
  const parts: string[] = [];

  if (strategy === "explore_new_topic") {
    parts.push(`Chủ đề "${skill}" khác với những gì bạn đã luyện gần đây — đây là cách để bạn không bị "đóng khung" trong một lĩnh vực.`);
  }

  if (goalAligned) {
    parts.push(`Bài này phục vụ trực tiếp mục tiêu bạn đã đặt ra — không phải học tràn lan.`);
  }

  if (respectsRecency && strategy !== "explore_new_topic") {
    parts.push(`Mình không lặp lại bài bạn vừa học — mỗi buổi một kỹ năng khác nhau để bạn tiến bộ toàn diện.`);
  }

  if (!respectsRecency && strategy === "target_weakness") {
    parts.push(`Mình biết bạn vừa luyện điểm này, nhưng nó cần thêm thời gian để thấm — một buổi nữa sẽ giúp bạn chắc hơn.`);
  }

  if (parts.length === 0) {
    parts.push("Mỗi buổi học là một viên gạch — hôm nay mình đặt thêm một viên cho vững.");
  }

  return parts.join(" ");
}

// ─── Goal Label Lookup ─────────────────────────────────────────────────────

const GOAL_LABELS_VI: Record<string, string> = {
  ielts_preparation: "luyện thi IELTS",
  daily_conversation: "giao tiếp hằng ngày",
  workplace_english: "tiếng Anh công sở",
  travel_english: "tiếng Anh du lịch",
  customer_service: "dịch vụ khách hàng",
  job_interview: "phỏng vấn xin việc",
  study_abroad: "du học",
  parent_teacher_communication: "giao tiếp với thầy cô",
  healthcare_visits: "khám sức khỏe",
  general_improvement: "cải thiện tổng quát",
};

/**
 * Get a Vietnamese label for a learner goal.
 */
export function getGoalLabelVi(goal: LearnerGoal): string {
  return GOAL_LABELS_VI[goal] ?? goal.replace(/_/g, " ");
}

// ─── Main Entry Point ──────────────────────────────────────────────────────

/**
 * Produce intelligent, human-teacher-quality lesson recommendations.
 *
 * This is the main entry point. It:
 *   1. Gets base recommendations from nextLessonRecommender
 *   2. Chooses a teaching strategy based on the learner's context
 *   3. Calibrates challenge level to CEFR
 *   4. Checks goal alignment
 *   5. Checks recency diversity
 *   6. Builds teacher-quality Vietnamese reasoning
 *
 * Pure function — deterministic, no I/O, no side effects.
 *
 * @param input — full learner context
 * @returns Ranked list of intelligent recommendations (best first)
 */
export function recommendWithIntelligence(
  input: RecommendationIntelligenceInput,
): IntelligentRecommendation[] {
  const { profile, goals, recentPractice } = input;

  // Get base recommendations from the rule engine
  const baseRecs = recommendNextLessons(profile);

  // If cold-start, return a single intelligent recommendation with
  // the build_confidence strategy (most appropriate for new learners)
  if (baseRecs.length === 1 && baseRecs[0].ruleFired === "cold-start:abstain") {
    const strategy: RecommendationStrategy = "build_confidence";
    const challengeLevel = calibrateChallengeLevel(input.cefrLevel, strategy);
    const teacherMessages = buildTeacherReason(
      baseRecs[0],
      strategy,
      challengeLevel,
      input.cefrLevel,
      false,
      true,
    );

    return [{
      base: baseRecs[0],
      strategy,
      challengeLevel,
      alignedWithGoals: false,
      servedGoals: [],
      respectsRecency: true,
      recencyOverlaps: [],
      teacherReasonVi: teacherMessages.reasonVi,
      preambleVi: teacherMessages.preambleVi,
      diversityNoteVi: teacherMessages.diversityNoteVi,
    }];
  }

  // Choose the teaching strategy
  const strategy = chooseStrategy(input);

  // Enhance each base recommendation
  return baseRecs.map((base) => {
    const challengeLevel = calibrateChallengeLevel(input.cefrLevel, strategy);
    const goalResult = checkGoalAlignment(base, goals);
    const recencyResult = checkRecencyDiversity(base, recentPractice, input.now);
    const teacherMessages = buildTeacherReason(
      base,
      strategy,
      challengeLevel,
      input.cefrLevel,
      goalResult.aligned,
      recencyResult.respectsRecency,
    );

    return {
      base,
      strategy,
      challengeLevel,
      alignedWithGoals: goalResult.aligned,
      servedGoals: goalResult.servedGoals,
      respectsRecency: recencyResult.respectsRecency,
      recencyOverlaps: recencyResult.overlaps,
      teacherReasonVi: teacherMessages.reasonVi,
      preambleVi: teacherMessages.preambleVi,
      diversityNoteVi: teacherMessages.diversityNoteVi,
    };
  });
}

/**
 * Get the single best recommendation with full intelligence.
 * Convenience wrapper for when you just need the top pick.
 */
export function recommendTopPick(
  input: RecommendationIntelligenceInput,
): IntelligentRecommendation {
  const recs = recommendWithIntelligence(input);
  return recs[0];
}

/**
 * Check whether the current practice cadence is healthy.
 *
 * A healthy cadence: 1–3 days between sessions for A1–B1,
 * 1–7 days for B2+, or any cadence that's consistent.
 *
 * Returns a human-readable assessment in Vietnamese.
 */
export function assessPracticeCadence(
  avgDaysBetweenSessions: number | null,
  cefrLevel: CefrLevel | null,
): { healthy: boolean; noteVi: string } {
  if (avgDaysBetweenSessions === null) {
    return {
      healthy: true,
      noteVi: "Mình chưa có đủ dữ liệu để đánh giá nhịp học của bạn — nhưng bạn đang ở đây là tốt rồi!",
    };
  }

  const days = avgDaysBetweenSessions;
  const isBeginner = cefrLevel === "A1" || cefrLevel === "A2" || cefrLevel === null;

  if (isBeginner && days > 5) {
    return {
      healthy: false,
      noteVi: `Bạn đang học cách nhau khoảng ${Math.round(days)} ngày — với trình độ này, học đều hơn (2–3 ngày một lần) sẽ giúp bạn tiến bộ nhanh hơn nhiều. Đừng lo, mình sẽ giúp bạn ôn lại những gì đã quên.`,
    };
  }

  if (days > 10) {
    return {
      healthy: false,
      noteVi: `Bạn đang học cách nhau khoảng ${Math.round(days)} ngày — hơi xa. Mỗi lần quay lại bạn sẽ mất thời gian ôn lại bài cũ. Nếu có thể, cố gắng dành 10–15 phút mỗi 2–3 ngày sẽ hiệu quả hơn.`,
    };
  }

  if (days <= 2) {
    return {
      healthy: true,
      noteVi: `Bạn đang học rất đều — khoảng ${Math.round(days)} ngày một lần. Nhịp độ này rất tốt, tiếp tục giữ vững nhé!`,
    };
  }

  return {
    healthy: true,
    noteVi: `Nhịp học của bạn ổn — khoảng ${Math.round(days)} ngày một lần. Đều đặn là chìa khóa, và bạn đang làm tốt điều đó.`,
  };
}

// ─── Strategy Catalog (for documentation and UI) ────────────────────────────

export const LESSON_RECOMMENDATION_STRATEGY_CATALOG: ReadonlyArray<{
  strategy: RecommendationStrategy;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  whenToUseVi: string;
}> = [
  {
    strategy: "cement_foundation",
    titleVi: "Củng cố nền tảng",
    titleEn: "Cement foundation",
    descriptionVi: "Tập trung vào kỹ năng ngữ pháp hoặc từ vựng cốt lõi mà người học còn yếu.",
    whenToUseVi: "Khi người học ở trình độ A1–A2 và còn thiếu kỹ năng nền tảng.",
  },
  {
    strategy: "stretch_zone",
    titleVi: "Vùng thử thách",
    titleEn: "Stretch zone",
    descriptionVi: "Đẩy người học lên một chút so với trình độ hiện tại — vừa đủ thử thách, không quá sức.",
    whenToUseVi: "Khi người học trình độ B1–B2, học đều, và sẵn sàng tiến lên.",
  },
  {
    strategy: "polish_fluency",
    titleVi: "Trau chuốt độ tự nhiên",
    titleEn: "Polish fluency",
    descriptionVi: "Tập trung vào cách diễn đạt tự nhiên, trôi chảy thay vì sửa lỗi ngữ pháp.",
    whenToUseVi: "Khi người học trình độ C1–C2 — ngữ pháp đã vững, cần độ tự nhiên.",
  },
  {
    strategy: "real_world_practice",
    titleVi: "Thực hành tình huống thật",
    titleEn: "Real-world practice",
    descriptionVi: "Luyện tập trong bối cảnh thực tế (gọi món, khám bệnh, phỏng vấn...) thay vì bài tập ngữ pháp.",
    whenToUseVi: "Khi người học cần áp dụng tiếng Anh vào đời sống — đặc biệt với mục tiêu cụ thể như du lịch, công việc.",
  },
  {
    strategy: "review_and_consolidate",
    titleVi: "Ôn tập củng cố",
    titleEn: "Review and consolidate",
    descriptionVi: "Ôn lại kiến thức đã học trước khi học bài mới — tránh tình trạng 'học trước quên sau'.",
    whenToUseVi: "Khi người học đã nghỉ một thời gian (>5 ngày) hoặc có dấu hiệu quên kiến thức cũ.",
  },
  {
    strategy: "explore_new_topic",
    titleVi: "Khám phá chủ đề mới",
    titleEn: "Explore new topic",
    descriptionVi: "Giới thiệu một chủ đề hoặc kỹ năng mới mà người học chưa từng luyện.",
    whenToUseVi: "Khi người học đã luyện cùng một chủ đề nhiều lần — cần đa dạng hóa để tránh nhàm chán.",
  },
  {
    strategy: "target_weakness",
    titleVi: "Nhắm vào điểm yếu",
    titleEn: "Target weakness",
    descriptionVi: "Tập trung giải quyết một điểm yếu cụ thể đã được phát hiện qua nhiều buổi học.",
    whenToUseVi: "Khi cùng một lỗi xuất hiện ≥3 lần — dấu hiệu của lỗi hệ thống, không phải lỗi ngẫu nhiên.",
  },
  {
    strategy: "build_confidence",
    titleVi: "Xây dựng tự tin",
    titleEn: "Build confidence",
    descriptionVi: "Chọn bài dễ, vui, đảm bảo thành công để người học cảm thấy tự tin trước khi thử thách.",
    whenToUseVi: "Khi người học mới bắt đầu (≤3 buổi) hoặc có dấu hiệu thiếu tự tin.",
  },
  {
    strategy: "maintain_momentum",
    titleVi: "Giữ đà tiến bộ",
    titleEn: "Maintain momentum",
    descriptionVi: "Tiếp tục với bài vừa sức, giữ nhịp học đều đặn, không thay đổi đột ngột.",
    whenToUseVi: "Khi người học đang có đà tốt — không cần thay đổi chiến lược, chỉ cần tiếp tục.",
  },
];

export const LESSON_RECOMMENDATION_INTELLIGENCE_DIMENSIONS = [
  {
    id: "cefr_scaffolding" as const,
    titleVi: "Điều chỉnh theo trình độ CEFR",
    titleEn: "CEFR-aware scaffolding",
    descriptionVi: "Chiến lược gợi ý bài học thay đổi theo trình độ — A1 cần củng cố, C1 cần trau chuốt.",
  },
  {
    id: "goal_alignment" as const,
    titleVi: "Phù hợp mục tiêu người học",
    titleEn: "Goal alignment",
    descriptionVi: "Ưu tiên bài học phục vụ trực tiếp mục tiêu người học đã đặt ra (IELTS, du lịch, công việc...).",
  },
  {
    id: "recency_diversity" as const,
    titleVi: "Đa dạng hóa — không lặp lại",
    titleEn: "Recency-aware diversity",
    descriptionVi: "Tránh gợi ý bài học vừa mới luyện — mỗi buổi một kỹ năng để tiến bộ toàn diện.",
  },
  {
    id: "challenge_gradient" as const,
    titleVi: "Độ khó phù hợp",
    titleEn: "Challenge gradient",
    descriptionVi: "Điều chỉnh độ khó theo trình độ — không quá dễ (nhàm chán), không quá khó (nản lòng).",
  },
  {
    id: "cadence_awareness" as const,
    titleVi: "Nhận biết nhịp học",
    titleEn: "Cadence awareness",
    descriptionVi: "Chiến lược khác nhau cho người học hằng ngày và người học thưa — ôn tập vs. tiến lên.",
  },
  {
    id: "teacher_language" as const,
    titleVi: "Ngôn ngữ giáo viên tự nhiên",
    titleEn: "Natural teacher language",
    descriptionVi: "Lời gợi ý nghe như một giáo viên thật — không phải output của thuật toán.",
  },
];
