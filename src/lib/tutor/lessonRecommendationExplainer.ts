/**
 * Teacher Mercy — Evidence-Based Lesson Recommendation Explainer
 *
 * A strong human teacher doesn't just say "do this lesson." She says:
 *   "Look — in our last 3 sessions, you dropped articles 7 times. Here are
 *    the patterns I noticed. This is why I recommend we fix articles first
 *    before moving to past tense. I'm confident about this because the evidence
 *    is consistent across multiple sessions."
 *
 * This module produces those evidence-backed explanations. It:
 *   1. Traces each recommendation back to its data — what specifically was observed
 *   2. Cites concrete numbers, frequencies, and patterns — not vague claims
 *   3. Calibrates confidence based on evidence strength (sample size, consistency)
 *   4. Shows what alternatives were considered and why this was chosen
 *   5. Displays the evidence chain: data → inference → recommendation
 *   6. Uses Vietnamese — because that's how Teacher Mercy talks to VN learners
 *
 * Pure functions — no I/O, no side effects, deterministic.
 * Vietnamese-first: all user-facing text is in Vietnamese.
 */

import type { LearnerHistoryProfile } from "./learnerHistoryProfile";
import type {
  CefrLevel,
  ChallengeLevel,
  LearnerGoal,
  RecommendationStrategy,
} from "./lessonRecommendationIntelligence";
import type { NextLessonRecommendation } from "./nextLessonRecommender";
import type {
  LessonSequencePhase,
  PersonalizedLessonSequence,
} from "./lessonSequenceGenerator";

// ─── Evidence Types ─────────────────────────────────────────────────────────

/**
 * Where a piece of evidence came from.
 */
export type EvidenceSource =
  | "interference_pattern"   // Detected VN→EN error pattern
  | "mastery_score"          // Topic mastery below threshold
  | "session_cadence"        // Practice frequency data
  | "recent_practice"        // Recently practiced topics
  | "cefr_level"             // Known proficiency level
  | "learner_goal"           // Stated learner goal
  | "session_history"        // Session count / completion history
  | "mode_preference"        // Inferred preferred study mode
  | "cold_start";            // Insufficient data

/**
 * How strongly a piece of evidence supports the recommendation.
 */
export type EvidenceStrength =
  | "strong"     // ≥5 observations, consistent across sessions
  | "moderate"   // 3–4 observations, or 2 observations with CEFR confirmation
  | "weak"       // 1–2 observations, suggestive but not conclusive
  | "tentative"; // Single observation or inferential — low confidence

/**
 * A single piece of evidence that supports (or weighs against) a recommendation.
 */
export type EvidenceItem = {
  /** What kind of evidence this is. */
  source: EvidenceSource;

  /** Vietnamese description of what was observed — concrete and specific. */
  observationVi: string;

  /** How strongly this evidence supports the recommendation. */
  strength: EvidenceStrength;

  /** How many times this evidence was observed (if countable). */
  occurrenceCount: number;

  /** The specific tag or topic this evidence is about. */
  tag: string;

  /**
   * When this evidence was last observed (Unix ms).
   * null for non-temporal evidence (goals, CEFR level).
   */
  lastObservedAt: number | null;

  /**
   * Whether this evidence supports the recommendation (true) or weighs against
   * it / suggests an alternative (false).
   */
  supportsRecommendation: boolean;
};

/**
 * The full evidence chain for a recommendation — all pieces of evidence
 * that collectively justify it, plus the logical reasoning connecting them.
 */
export type EvidenceChain = {
  /** Ordered pieces of evidence (strongest first). */
  items: EvidenceItem[];

  /**
   * Vietnamese explanation of how the evidence chain leads to this recommendation.
   * Reads like a teacher explaining her reasoning to a colleague or learner.
   */
  chainReasoningVi: string;

  /** Overall confidence in this recommendation (0.0–1.0). */
  confidence: number;

  /**
   * Vietnamese confidence label — how sure Mercy is about this.
   * "Mình rất chắc về đề xuất này" / "Mình khá chắc" / "Mình đề xuất thử"
   */
  confidenceLabelVi: string;
};

/**
 * An alternative recommendation that was considered but not chosen.
 * Shows the learner (and developers) that other options were evaluated.
 */
export type ConsideredAlternative = {
  /** The skill or topic that was considered. */
  skillTag: string;

  /** Vietnamese label for this alternative. */
  labelVi: string;

  /** Vietnamese reason why this alternative was NOT chosen. */
  whyRejectedVi: string;

  /** The evidence that supports this alternative (for transparency). */
  supportingEvidenceCount: number;
};

/**
 * A complete, evidence-backed explanation of a lesson recommendation.
 *
 * This is what Teacher Mercy would say if asked "Why this lesson?"
 */
export type RecommendationExplanation = {
  /** The recommendation being explained. */
  recommendation: NextLessonRecommendation;

  /** The full evidence chain. */
  evidenceChain: EvidenceChain;

  /** Number of distinct evidence items supporting this recommendation. */
  totalEvidenceItems: number;

  /** Number of strong evidence items. */
  strongEvidenceCount: number;

  /** Alternatives that were considered and why they were set aside. */
  consideredAlternatives: ConsideredAlternative[];

  /**
   * One-sentence Vietnamese takeaway — the "bottom line" Mercy would say.
   * Example: "Mình chọn bài này vì 7 lỗi mạo từ trong 3 buổi — đây là ưu tiên số 1."
   */
  bottomLineVi: string;

  /**
   * A longer Vietnamese explanation suitable for showing to the learner.
   * Includes concrete numbers, patterns, and the pedagogical reasoning.
   */
  learnerFacingExplanationVi: string;

  /**
   * A shorter Vietnamese summary suitable for a card or preview UI.
   */
  summaryCardVi: string;
};

// ─── Explained Sequence Type ────────────────────────────────────────────────

/**
 * An entire lesson sequence with evidence-backed explanations for each phase.
 */
export type ExplainedSequence = {
  /** The original sequence. */
  sequence: PersonalizedLessonSequence;

  /** Evidence-backed explanation for each phase. */
  phaseExplanations: RecommendationExplanation[];

  /**
   * Vietnamese overview of the entire sequence's evidence foundation.
   * Summarizes how all the evidence collectively supports this path.
   */
  overviewEvidenceVi: string;

  /**
   * Evidence quality assessment for the entire sequence.
   */
  overallConfidence: number;
  overallConfidenceLabelVi: string;
};

// ─── Strength Calibration ───────────────────────────────────────────────────

/**
 * Map observation count to evidence strength.
 *
 * Thresholds reflect how many observations are needed before Mercy
 * is confident that a pattern is systematic, not a slip.
 */
export function calibrateEvidenceStrength(occurrenceCount: number): EvidenceStrength {
  if (occurrenceCount >= 5) return "strong";
  if (occurrenceCount >= 3) return "moderate";
  if (occurrenceCount >= 2) return "weak";
  return "tentative";
}

/**
 * How confident is Mercy overall, given the evidence chain?
 * Returns 0.0–1.0.
 *
 * Algorithm (modeled after how a teacher calibrates confidence):
 *   1. The STRONGEST piece of evidence sets the baseline.
 *   2. Each additional supporting item from a different source adds a small bump.
 *   3. Source diversity (independent signals) raises confidence.
 *   4. Counter-evidence subtracts directly.
 *
 * Thresholds:
 *   ≥ 0.65 → confident enough to prioritize
 *   ≥ 0.40 → reasonable recommendation, needs more data to be sure
 *   < 0.20 → warm-up / cold-start territory
 */
export function assessConfidence(items: EvidenceItem[]): number {
  if (items.length === 0) return 0.0;

  const supporting = items.filter((e) => e.supportsRecommendation);
  if (supporting.length === 0) return 0.0;

  // Base confidence from the STRONGEST evidence item
  const strengthBase: Record<EvidenceStrength, number> = {
    strong: 0.65,
    moderate: 0.45,
    weak: 0.20,
    tentative: 0.08,
  };

  // Find best item and its boost from occurrence count
  const strengthRank: Record<EvidenceStrength, number> = {
    strong: 3,
    moderate: 2,
    weak: 1,
    tentative: 0,
  };

  let best = supporting[0];
  for (const item of supporting) {
    if (strengthRank[item.strength] > strengthRank[best.strength]) {
      best = item;
    } else if (
      strengthRank[item.strength] === strengthRank[best.strength] &&
      item.occurrenceCount > best.occurrenceCount
    ) {
      best = item;
    }
  }

  // Occurrence count scales the base within its band
  const occurrenceScale = Math.min(1.0, (best.occurrenceCount - 1) / 9); // 1→0, 5→0.44, 10→1.0
  const base = strengthBase[best.strength] + occurrenceScale * 0.10;

  let score = Math.min(0.80, base);

  // Additional supporting items from different sources → small bumps
  const seenSources = new Set<string>([best.source]);
  for (const item of supporting) {
    if (item === best) continue;
    if (seenSources.has(item.source)) continue;
    seenSources.add(item.source);

    // Contribution size depends on the additional item's strength
    const bump = item.strength === "strong" ? 0.06
      : item.strength === "moderate" ? 0.03
      : 0.01;
    score += bump;
  }

  // Source diversity bonus (independent signals = more reliable)
  if (seenSources.size >= 5) {
    score += 0.06;
  } else if (seenSources.size >= 3) {
    score += 0.03;
  }

  // Counter-evidence penalty — direct subtraction
  const counterCount = items.filter((e) => !e.supportsRecommendation).length;
  const counterPenalty = Math.min(0.30, counterCount * 0.10);

  return Math.max(0, Math.min(0.95, score - counterPenalty));
}

/**
 * Get a Vietnamese confidence label for a confidence score.
 */
export function getConfidenceLabelVi(confidence: number): string {
  if (confidence >= 0.85) return "Mình rất chắc về đề xuất này — dữ liệu rõ ràng và nhất quán.";
  if (confidence >= 0.65) return "Mình khá chắc — bằng chứng đủ mạnh để ưu tiên.";
  if (confidence >= 0.40) return "Mình có cơ sở để đề xuất — nhưng cần thêm buổi học để xác nhận.";
  if (confidence >= 0.20) return "Mình đề xuất thử — bằng chứng còn ít nhưng đây là hướng hợp lý.";
  return "Mình chưa đủ dữ liệu để chắc chắn — nhưng đây là khởi đầu tốt.";
}

// ─── Evidence Item Builders ─────────────────────────────────────────────────

/**
 * Build evidence items from interference patterns in the learner profile.
 */
function buildInterferenceEvidence(
  profile: LearnerHistoryProfile,
  recommendationSkill: string,
  now: number,
): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  const skillLower = recommendationSkill.toLowerCase();

  for (const pattern of profile.interferencePatterns) {
    const patternTagLower = pattern.tag.toLowerCase();
    // Match: exact tag match OR skill includes the pattern tag
    const matches =
      patternTagLower === skillLower ||
      skillLower.includes(patternTagLower) ||
      patternTagLower.includes(skillLower);

    if (!matches) continue;

    const strength = calibrateEvidenceStrength(pattern.observedCount);
    const tagDisplay = pattern.tag.replace(/-/g, " ");

    items.push({
      source: "interference_pattern",
      observationVi:
        pattern.observedCount >= 5
          ? `Phát hiện ${pattern.observedCount} lần lỗi "${tagDisplay}" — đây là lỗi hệ thống rõ rệt, không phải ngẫu nhiên.`
          : pattern.observedCount >= 3
            ? `Phát hiện ${pattern.observedCount} lần lỗi "${tagDisplay}" — đủ để xác nhận đây là một xu hướng.`
            : `Phát hiện ${pattern.observedCount} lần lỗi "${tagDisplay}" — dấu hiệu ban đầu, cần theo dõi thêm.`,
      strength,
      occurrenceCount: pattern.observedCount,
      tag: pattern.tag,
      lastObservedAt: pattern.lastSeenAt,
      supportsRecommendation: true,
    });
  }

  // For the main interference tags, also add non-matching patterns as counter-evidence
  // (evidence for why we're NOT prioritizing those other patterns)
  for (const pattern of profile.interferencePatterns) {
    const patternTagLower = pattern.tag.toLowerCase();
    if (skillLower.includes(patternTagLower) || patternTagLower.includes(skillLower)) {
      continue; // Already added above as supporting
    }

    // Only add as counter-evidence if it's a moderate+ pattern (≥3 observations)
    if (pattern.observedCount >= 3) {
      const tagDisplay = pattern.tag.replace(/-/g, " ");
      items.push({
        source: "interference_pattern",
        observationVi: `Cũng có ${pattern.observedCount} lần lỗi "${tagDisplay}", nhưng mức độ ít nghiêm trọng hơn hoặc ít ảnh hưởng hơn.`,
        strength: calibrateEvidenceStrength(pattern.observedCount),
        occurrenceCount: pattern.observedCount,
        tag: pattern.tag,
        lastObservedAt: pattern.lastSeenAt,
        supportsRecommendation: false,
      });
    }
  }

  return items;
}

/**
 * Build evidence items from topic mastery scores.
 */
function buildMasteryEvidence(
  profile: LearnerHistoryProfile,
  recommendationSkill: string,
): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  const skillLower = recommendationSkill.toLowerCase();

  for (const [topic, score] of Object.entries(profile.topicMastery)) {
    const topicLower = topic.toLowerCase();
    const matches =
      topicLower === skillLower ||
      skillLower.includes(topicLower) ||
      topicLower.includes(skillLower);

    if (!matches) continue;

    const topicDisplay = topic.replace(/-/g, " ");
    const strength: EvidenceStrength =
      score < 30 ? "strong" : score < 50 ? "moderate" : "weak";

    items.push({
      source: "mastery_score",
      observationVi:
        score < 30
          ? `Điểm mastery "${topicDisplay}" chỉ đạt ${score}% — rất thấp, cần ôn tập gấp.`
          : score < 50
            ? `Điểm mastery "${topicDisplay}" ở mức ${score}% — dưới ngưỡng 50%, cần củng cố.`
            : `Điểm mastery "${topicDisplay}" đạt ${score}% — đang tiến bộ nhưng chưa vững.`,
      strength,
      occurrenceCount: 1,
      tag: topic,
      lastObservedAt: profile.updatedAt,
      supportsRecommendation: true,
    });
  }

  return items;
}

/**
 * Build evidence from session cadence data.
 */
function buildCadenceEvidence(
  avgDaysBetweenSessions: number | null,
  profile: LearnerHistoryProfile,
): EvidenceItem[] {
  const items: EvidenceItem[] = [];

  if (avgDaysBetweenSessions === null) {
    if (profile.sessionCount <= 3) {
      items.push({
        source: "session_cadence",
        observationVi: `Mới có ${profile.sessionCount} buổi học — chưa đủ dữ liệu để đánh giá nhịp học.`,
        strength: "tentative",
        occurrenceCount: profile.sessionCount,
        tag: "session-count-low",
        lastObservedAt: profile.updatedAt,
        supportsRecommendation: true,
      });
    }
    return items;
  }

  const days = avgDaysBetweenSessions;

  if (days > 7) {
    items.push({
      source: "session_cadence",
      observationVi: `Nhịp học thưa — trung bình ${Math.round(days)} ngày giữa các buổi. Cần ưu tiên ôn tập để tránh quên.`,
      // Cadence is contextual — moderate, not primary
      strength: "moderate",
      occurrenceCount: profile.sessionCount,
      tag: "cadence-sparse",
      lastObservedAt: profile.updatedAt,
      supportsRecommendation: true,
    });
  } else if (days > 5) {
    items.push({
      source: "session_cadence",
      observationVi: `Nhịp học hơi thưa — trung bình ${Math.round(days)} ngày giữa các buổi. Nên ôn tập nhẹ trước khi học bài mới.`,
      strength: "moderate",
      occurrenceCount: profile.sessionCount,
      tag: "cadence-moderate-gap",
      lastObservedAt: profile.updatedAt,
      supportsRecommendation: true,
    });
  } else if (days <= 2) {
    items.push({
      source: "session_cadence",
      observationVi: `Nhịp học rất đều — trung bình ${Math.round(days)} ngày giữa các buổi. Có thể đẩy nhanh tiến độ.`,
      // Cadence is contextual — moderate, not primary
      strength: "moderate",
      occurrenceCount: profile.sessionCount,
      tag: "cadence-consistent",
      lastObservedAt: profile.updatedAt,
      supportsRecommendation: true,
    });
  } else {
    items.push({
      source: "session_cadence",
      observationVi: `Nhịp học ổn — trung bình ${Math.round(days)} ngày giữa các buổi.`,
      strength: "moderate",
      occurrenceCount: profile.sessionCount,
      tag: "cadence-normal",
      lastObservedAt: profile.updatedAt,
      supportsRecommendation: true,
    });
  }

  return items;
}

/**
 * Build evidence from the learner's CEFR level.
 */
function buildCefrEvidence(cefrLevel: CefrLevel | null): EvidenceItem[] {
  if (!cefrLevel) return [];

  const description: Record<CefrLevel, string> = {
    A1: "Trình độ A1 — mới bắt đầu, cần bài dễ và nhiều khích lệ.",
    A2: "Trình độ A2 — đã có nền cơ bản, sẵn sàng thử thách nhẹ.",
    B1: "Trình độ B1 — trung cấp, có thể xử lý hội thoại hằng ngày.",
    B2: "Trình độ B2 — khá vững, sẵn sàng cho nội dung phức tạp hơn.",
    C1: "Trình độ C1 — nâng cao, cần trau chuốt độ tự nhiên.",
    C2: "Trình độ C2 — thành thạo, tập trung vào sự tinh tế và chính xác.",
  };

  return [{
    source: "cefr_level",
    observationVi: description[cefrLevel],
    // CEFR is contextual evidence — always moderate, never the primary signal
    strength: "moderate",
    occurrenceCount: 1,
    tag: `cefr-${cefrLevel.toLowerCase()}`,
    lastObservedAt: null,
    supportsRecommendation: true,
  }];
}

/**
 * Build evidence from learner goals.
 */
function buildGoalEvidence(
  goals: LearnerGoal[],
  recommendationSkill: string,
): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  if (goals.length === 0) return items;

  // Goal label mapping (Vietnamese)
  const goalLabels: Record<string, string> = {
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

  // Goal → relevant skills
  const goalSkills: Record<string, string[]> = {
    ielts_preparation: [
      "missing-article", "tense-omission", "subj-verb-agreement",
      "preposition-calque", "word-order", "zero-copula", "double-negation",
      "grammar", "writing", "speaking", "ielts",
    ],
    daily_conversation: [
      "speak", "introductions", "food-ordering", "shopping",
      "daily-life", "family", "social", "daily-conversation",
    ],
    workplace_english: [
      "work-job", "phone-call", "email", "meeting",
      "customer-service", "presentation", "workplace",
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
      "health", "doctor", "pharmacy", "symptoms", "appointment",
    ],
    general_improvement: [
      "speak", "grammar", "journey", "logic", "general",
    ],
  };

  const skillLower = recommendationSkill.toLowerCase();

  for (const goal of goals) {
    const label = goalLabels[goal] ?? goal.replace(/_/g, " ");
    const skills = goalSkills[goal] ?? [];

    const isRelevant = skills.some((s) => skillLower.includes(s.toLowerCase()));
    if (isRelevant) {
      items.push({
        source: "learner_goal",
        observationVi: `Mục tiêu của bạn là "${label}" — bài học này phục vụ trực tiếp mục tiêu đó.`,
        strength: "moderate",
        occurrenceCount: 1,
        tag: goal,
        lastObservedAt: null,
        supportsRecommendation: true,
      });
    }
  }

  return items;
}

/**
 * Build evidence from recent practice history.
 */
function buildRecentPracticeEvidence(
  recentPractice: Array<{ topic: string; practicedAt: number; mode: string }>,
  recommendationSkill: string,
  now: number,
): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  const DAY_MS = 24 * 60 * 60 * 1000;
  const skillLower = recommendationSkill.toLowerCase();

  for (const entry of recentPractice.slice(0, 5)) {
    const age = (now - entry.practicedAt) / DAY_MS;
    const topicLower = entry.topic.toLowerCase();

    const overlaps =
      topicLower.includes(skillLower) || skillLower.includes(topicLower);

    if (overlaps && age <= 3) {
      // Recently practiced this skill — counter-evidence (shouldn't repeat)
      const topicDisplay = entry.topic.replace(/-/g, " ");
      items.push({
        source: "recent_practice",
        observationVi: `Đã luyện "${topicDisplay}" cách đây ${Math.round(age)} ngày — không nên lặp lại quá sớm.`,
        strength: "moderate",
        occurrenceCount: 1,
        tag: entry.topic,
        lastObservedAt: entry.practicedAt,
        supportsRecommendation: false,
      });
    }
  }

  // If no recent overlap — positive evidence for recency diversity
  if (recentPractice.length > 0 && items.length === 0) {
    items.push({
      source: "recent_practice",
      observationVi: "Bài học này không trùng với những gì bạn vừa luyện gần đây — đa dạng hóa tốt.",
      strength: "weak",
      occurrenceCount: recentPractice.length,
      tag: "recency-clear",
      lastObservedAt: recentPractice[0]?.practicedAt ?? now,
      supportsRecommendation: true,
    });
  }

  return items;
}

/**
 * Build evidence from session history.
 */
function buildSessionHistoryEvidence(profile: LearnerHistoryProfile): EvidenceItem[] {
  const items: EvidenceItem[] = [];

  if (profile.sessionCount === 0) {
    items.push({
      source: "session_history",
      observationVi: "Chưa có buổi học nào — đây là lần đầu tiên.",
      strength: "tentative",
      occurrenceCount: 0,
      tag: "no-sessions",
      lastObservedAt: null,
      supportsRecommendation: true,
    });
  } else if (profile.sessionCount <= 3) {
    items.push({
      source: "session_history",
      observationVi: `Mới có ${profile.sessionCount} buổi học — đang trong giai đoạn làm quen.`,
      strength: "tentative",
      occurrenceCount: profile.sessionCount,
      tag: "few-sessions",
      lastObservedAt: profile.updatedAt,
      supportsRecommendation: true,
    });
  } else {
    items.push({
      source: "session_history",
      observationVi: `Đã hoàn thành ${profile.completedSessionCount}/${profile.sessionCount} buổi học — đủ dữ liệu để cá nhân hóa.`,
      strength: "moderate",
      occurrenceCount: profile.sessionCount,
      tag: "established-learner",
      lastObservedAt: profile.updatedAt,
      supportsRecommendation: true,
    });
  }

  return items;
}

/**
 * Build evidence from mode preference.
 */
function buildModePreferenceEvidence(profile: LearnerHistoryProfile): EvidenceItem[] {
  if (!profile.preferredMode || profile.sessionCount < 5) return [];

  const modeLabels: Record<string, string> = {
    grammar: "Ngữ pháp",
    speak: "Luyện nói",
    journey: "Tình huống thực tế",
    logic: "Tư duy",
  };

  const label = modeLabels[profile.preferredMode] ?? profile.preferredMode;

  return [{
    source: "mode_preference",
    observationVi: `Bạn học tốt nhất ở chế độ "${label}" — dựa trên ${profile.sessionCount} buổi học.`,
    strength: "moderate",
    occurrenceCount: profile.sessionCount,
    tag: `mode-${profile.preferredMode}`,
    lastObservedAt: profile.updatedAt,
    supportsRecommendation: true,
  }];
}

// ─── Evidence Chain Builder ─────────────────────────────────────────────────

/**
 * Collect ALL evidence items relevant to a recommendation.
 *
 * Gathers evidence from every available source in the learner profile
 * and context, separating supporting from counter-evidence.
 */
export function collectAllEvidence(
  recommendation: NextLessonRecommendation,
  profile: LearnerHistoryProfile,
  cefrLevel: CefrLevel | null,
  goals: LearnerGoal[],
  recentPractice: Array<{ topic: string; practicedAt: number; mode: string }>,
  avgDaysBetweenSessions: number | null,
  now: number,
): EvidenceItem[] {
  const skill = recommendation.targetSkill;
  const allItems: EvidenceItem[] = [];

  // Source 1: Interference patterns (strongest evidence for correction-type recs)
  allItems.push(...buildInterferenceEvidence(profile, skill, now));

  // Source 2: Topic mastery scores
  allItems.push(...buildMasteryEvidence(profile, skill));

  // Source 3: Session cadence
  allItems.push(...buildCadenceEvidence(avgDaysBetweenSessions, profile));

  // Source 4: CEFR level
  allItems.push(...buildCefrEvidence(cefrLevel));

  // Source 5: Learner goals
  allItems.push(...buildGoalEvidence(goals, skill));

  // Source 6: Recent practice
  allItems.push(...buildRecentPracticeEvidence(recentPractice, skill, now));

  // Source 7: Session history
  allItems.push(...buildSessionHistoryEvidence(profile));

  // Source 8: Mode preference
  allItems.push(...buildModePreferenceEvidence(profile));

  // Sort: supporting first (strongest → weakest), then counter-evidence
  const strengthOrder: Record<EvidenceStrength, number> = {
    strong: 0,
    moderate: 1,
    weak: 2,
    tentative: 3,
  };

  allItems.sort((a, b) => {
    // Supporting evidence first
    if (a.supportsRecommendation && !b.supportsRecommendation) return -1;
    if (!a.supportsRecommendation && b.supportsRecommendation) return 1;
    // Within same category, stronger first
    return strengthOrder[a.strength] - strengthOrder[b.strength];
  });

  return allItems;
}

/**
 * Build the evidence chain — the logical pathway from raw data to recommendation.
 */
export function buildEvidenceChain(
  allEvidence: EvidenceItem[],
  recommendation: NextLessonRecommendation,
  cefrLevel: CefrLevel | null,
): EvidenceChain {
  const supporting = allEvidence.filter((e) => e.supportsRecommendation);
  const counter = allEvidence.filter((e) => !e.supportsRecommendation);
  const confidence = assessConfidence(allEvidence);

  // Build chain reasoning in Vietnamese
  const chainParts: string[] = [];

  // Start with what we're explaining
  const skillDisplay = recommendation.targetSkill.replace(/-/g, " ");
  chainParts.push(`Mình đề xuất bài "${recommendation.lessonTitle}" vì:`);

  // Summarize supporting evidence
  const interferenceEvidence = supporting.filter(
    (e) => e.source === "interference_pattern",
  );
  const masteryEvidence = supporting.filter((e) => e.source === "mastery_score");
  const otherEvidence = supporting.filter(
    (e) => e.source !== "interference_pattern" && e.source !== "mastery_score",
  );

  if (interferenceEvidence.length > 0) {
    const total = interferenceEvidence.reduce((s, e) => s + e.occurrenceCount, 0);
    chainParts.push(
      `→ Bằng chứng chính: ${total} lần phát hiện lỗi "${skillDisplay}" trong các buổi học — đây là lỗi hệ thống, không phải ngẫu nhiên.`,
    );
  }

  if (masteryEvidence.length > 0) {
    const scores = masteryEvidence.map(
      (e) => `${e.tag.replace(/-/g, " ")} (${e.occurrenceCount})`,
    );
    chainParts.push(
      `→ Điểm mastery thấp ở: ${scores.join(", ")} — cần củng cố trước khi tiến xa.`,
    );
  }

  if (otherEvidence.length > 0) {
    const cefrItem = otherEvidence.find((e) => e.source === "cefr_level");
    if (cefrItem) {
      const cefrLabel = cefrLevel ?? "chưa xác định";
      chainParts.push(
        `→ Trình độ ${cefrLabel}: bài học được điều chỉnh độ khó phù hợp.`,
      );
    }

    const goalItems = otherEvidence.filter((e) => e.source === "learner_goal");
    if (goalItems.length > 0) {
      chainParts.push(
        `→ Phục vụ ${goalItems.length} mục tiêu học tập của bạn.`,
      );
    }
  }

  // Acknowledge counter-evidence if present
  if (counter.length > 0) {
    const counterSummary = counter
      .map((e) => e.tag.replace(/-/g, " "))
      .join(", ");
    chainParts.push(
      `→ Mình cũng cân nhắc: ${counterSummary} — nhưng những điểm này ít nghiêm trọng hơn hoặc vừa được luyện gần đây.`,
    );
  }

  // Confidence wrap-up
  if (confidence >= 0.85) {
    chainParts.push("→ Kết luận: Bằng chứng rất rõ ràng — đây chắc chắn là ưu tiên hàng đầu.");
  } else if (confidence >= 0.65) {
    chainParts.push("→ Kết luận: Bằng chứng đủ mạnh để đề xuất — nhưng mình sẽ tiếp tục theo dõi thêm.");
  } else if (confidence >= 0.40) {
    chainParts.push("→ Kết luận: Có cơ sở để thử hướng này — mình sẽ điều chỉnh nếu cần sau vài buổi.");
  } else {
    chainParts.push("→ Kết luận: Dữ liệu còn ít — đây là đề xuất khởi đầu, mình sẽ cá nhân hóa tốt hơn khi có thêm buổi học.");
  }

  return {
    items: allEvidence,
    chainReasoningVi: chainParts.join("\n"),
    confidence,
    confidenceLabelVi: getConfidenceLabelVi(confidence),
  };
}

// ─── Alternative Consideration ──────────────────────────────────────────────

/**
 * Identify what alternative recommendations were considered and why they
 * were set aside.
 */
export function considerAlternatives(
  recommendation: NextLessonRecommendation,
  profile: LearnerHistoryProfile,
  goals: LearnerGoal[],
): ConsideredAlternative[] {
  const alternatives: ConsideredAlternative[] = [];
  const chosenSkill = recommendation.targetSkill.toLowerCase();

  // Consider other interference patterns
  for (const pattern of profile.interferencePatterns) {
    const patternLower = pattern.tag.toLowerCase();
    if (patternLower === chosenSkill || chosenSkill.includes(patternLower)) continue;
    if (pattern.observedCount < 2) continue;

    const tagDisplay = pattern.tag.replace(/-/g, " ");

    let whyRejectedVi: string;
    if (pattern.observedCount < 3) {
      whyRejectedVi = `Chỉ ${pattern.observedCount} lần — chưa đủ để xác nhận là lỗi hệ thống. Sẽ theo dõi thêm.`;
    } else {
      // Compare with chosen skill's observation count
      const chosenPattern = profile.interferencePatterns.find(
        (p) => p.tag.toLowerCase() === chosenSkill || chosenSkill.includes(p.tag.toLowerCase()),
      );
      const chosenCount = chosenPattern?.observedCount ?? 0;

      if (chosenCount > pattern.observedCount) {
        whyRejectedVi = `Có ${pattern.observedCount} lần — ít hơn lỗi được chọn (${chosenCount} lần). Ưu tiên lỗi nghiêm trọng hơn trước.`;
      } else {
        whyRejectedVi = `Có ${pattern.observedCount} lần — nhưng mức độ ảnh hưởng đến giao tiếp thấp hơn. Sẽ xử lý sau.`;
      }
    }

    alternatives.push({
      skillTag: pattern.tag,
      labelVi: `Sửa lỗi "${tagDisplay}"`,
      whyRejectedVi,
      supportingEvidenceCount: pattern.observedCount,
    });
  }

  // Consider low mastery topics as alternatives
  for (const [topic, score] of Object.entries(profile.topicMastery)) {
    const topicLower = topic.toLowerCase();
    if (topicLower === chosenSkill || chosenSkill.includes(topicLower)) continue;
    if (score >= 50) continue;

    const topicDisplay = topic.replace(/-/g, " ");
    alternatives.push({
      skillTag: topic,
      labelVi: `Ôn tập "${topicDisplay}"`,
      whyRejectedVi: `Điểm mastery ${score}% — thấp nhưng lỗi được chọn có mức độ ưu tiên cao hơn vì ảnh hưởng đến toàn bộ kỹ năng.`,
      supportingEvidenceCount: 1,
    });
  }

  // Consider goal-aligned alternatives
  if (goals.length > 0) {
    const goalAlternatives = new Set<string>();

    // Goal → skills mapping (same as goal evidence builder)
    const goalSkills: Record<string, string[]> = {
      ielts_preparation: ["missing-article", "tense-omission", "subj-verb-agreement", "writing", "speaking"],
      daily_conversation: ["speak", "introductions", "food-ordering", "shopping"],
      workplace_english: ["work-job", "phone-call", "email", "meeting"],
      travel_english: ["travel", "hotel", "airport", "transportation"],
      job_interview: ["job-interview", "introductions", "past-tense"],
      general_improvement: ["grammar-practice", "speaking-practice"],
    };

    for (const goal of goals) {
      const skills = goalSkills[goal] ?? [];
      for (const skill of skills) {
        if (skill === chosenSkill || chosenSkill.includes(skill)) continue;
        if (goalAlternatives.has(skill)) continue;
        if (recommendation.targetSkill.includes(skill)) continue;

        goalAlternatives.add(skill);
        const skillDisplay = skill.replace(/-/g, " ");

        alternatives.push({
          skillTag: skill,
          labelVi: `Luyện "${skillDisplay}"`,
          whyRejectedVi: `Cũng phục vụ mục tiêu của bạn — nhưng ưu tiên bài được chọn vì có bằng chứng lỗi rõ ràng hơn.`,
          supportingEvidenceCount: 0,
        });
      }
    }
  }

  // Deduplicate by skillTag, keep the one with more evidence
  const seen = new Map<string, ConsideredAlternative>();
  for (const alt of alternatives) {
    const existing = seen.get(alt.skillTag);
    if (!existing || alt.supportingEvidenceCount > existing.supportingEvidenceCount) {
      seen.set(alt.skillTag, alt);
    }
  }

  // Return top 5 most evidenced alternatives
  return Array.from(seen.values())
    .sort((a, b) => b.supportingEvidenceCount - a.supportingEvidenceCount)
    .slice(0, 5);
}

// ─── Bottom Line Builder ────────────────────────────────────────────────────

function buildBottomLine(
  recommendation: NextLessonRecommendation,
  evidenceChain: EvidenceChain,
  strategy: RecommendationStrategy | null,
): string {
  const supporting = evidenceChain.items.filter((e) => e.supportsRecommendation);
  const skillDisplay = recommendation.targetSkill.replace(/-/g, " ");

  // Count primary evidence
  const primaryEvidence = supporting.filter(
    (e) => e.source === "interference_pattern" || e.source === "mastery_score",
  );
  const totalObservations = primaryEvidence.reduce((s, e) => s + e.occurrenceCount, 0);

  if (recommendation.ruleFired === "cold-start:abstain") {
    return "Mình chưa có đủ dữ liệu về bạn — bắt đầu nhẹ nhàng với bài cơ bản để mình hiểu bạn hơn.";
  }

  if (totalObservations >= 5) {
    return `Mình chọn bài "${skillDisplay}" vì ${totalObservations} bằng chứng rõ ràng — đây là ưu tiên số 1 của bạn lúc này.`;
  }

  if (totalObservations >= 2) {
    return `Mình chọn bài "${skillDisplay}" dựa trên ${totalObservations} quan sát — đủ cơ sở để hành động.`;
  }

  if (strategy === "build_confidence") {
    return `Mình chọn bài dễ và vui để bạn tự tin trước — mình sẽ tăng độ khó khi bạn sẵn sàng.`;
  }

  if (evidenceChain.confidence >= 0.4) {
    return `Mình chọn bài "${skillDisplay}" — bằng chứng chưa nhiều nhưng đây là hướng hợp lý nhất lúc này.`;
  }

  return `Mình chọn bài "${skillDisplay}" để bắt đầu — mình sẽ cá nhân hóa tốt hơn sau vài buổi.`;
}

// ─── Learner-Facing Explanation Builder ─────────────────────────────────────

function buildLearnerFacingExplanation(
  recommendation: NextLessonRecommendation,
  evidenceChain: EvidenceChain,
  strategy: RecommendationStrategy | null,
  challengeLevel: ChallengeLevel,
  cefrLevel: CefrLevel | null,
): string {
  const skillDisplay = recommendation.targetSkill.replace(/-/g, " ");
  const supporting = evidenceChain.items.filter((e) => e.supportsRecommendation);
  const parts: string[] = [];

  // Opening based on strategy
  if (strategy === "target_weakness") {
    parts.push(
      `Mình đã để ý "${skillDisplay}" là điểm bạn cần cải thiện nhất. ` +
      `Đây không phải lỗi ngẫu nhiên — mình thấy nó lặp lại qua nhiều buổi, ` +
      `và đó là dấu hiệu của một thói quen từ tiếng Việt cần được luyện lại.`,
    );
  } else if (strategy === "cement_foundation") {
    parts.push(
      `"${skillDisplay}" là một kỹ năng nền tảng. Mình muốn bạn thật chắc ` +
      `phần này trước khi tiến xa hơn — giống như xây nhà phải có móng vững.`,
    );
  } else if (strategy === "build_confidence") {
    parts.push(
      `Mình muốn bạn bắt đầu với một bài dễ thành công — "${skillDisplay}". ` +
      `Không cần áp lực, mình chỉ cần bạn xuất hiện và luyện đều đặn.`,
    );
  } else if (strategy === "review_and_consolidate") {
    parts.push(
      `Đã một thời gian từ buổi trước, nên mình muốn ôn lại "${skillDisplay}" ` +
      `để bạn không quên. Ôn tập nhẹ nhàng trước, rồi mình tiến lên sau.`,
    );
  } else {
    parts.push(
      `Mình gợi ý bài "${recommendation.lessonTitle}" vì đây là bước tiếp theo ` +
      `hợp lý nhất cho bạn lúc này.`,
    );
  }

  // Evidence summary with concrete numbers
  parts.push(""); // Empty line separator
  parts.push("📊 Bằng chứng mình dựa vào:");

  for (const item of supporting.slice(0, 5)) {
    const icon =
      item.source === "interference_pattern" ? "🔍"
      : item.source === "mastery_score" ? "📉"
      : item.source === "session_cadence" ? "⏱️"
      : item.source === "learner_goal" ? "🎯"
      : item.source === "cefr_level" ? "📏"
      : item.source === "mode_preference" ? "⭐"
      : "📋";

    parts.push(`  ${icon} ${item.observationVi}`);
  }

  // Challenge level note
  parts.push("");
  const challengeNote: Record<ChallengeLevel, string> = {
    easy: "💪 Bài này ở mức dễ — bạn sẽ làm được ngay.",
    comfortable: "💪 Bài này vừa sức — bạn sẽ thấy thoải mái.",
    moderate: "💪 Bài này hơi thử thách — nhưng trong tầm tay bạn.",
    stretch: "💪 Bài này sẽ đẩy bạn lên một chút — mình tin bạn làm được.",
    hard: "💪 Bài này khó — nhưng bạn đã sẵn sàng.",
  };
  parts.push(challengeNote[challengeLevel]);

  // Confidence
  parts.push("");
  parts.push(`🔬 ${evidenceChain.confidenceLabelVi}`);

  return parts.join("\n");
}

// ─── Summary Card Builder ───────────────────────────────────────────────────

function buildSummaryCard(
  recommendation: NextLessonRecommendation,
  evidenceChain: EvidenceChain,
): string {
  const supporting = evidenceChain.items.filter((e) => e.supportsRecommendation);
  const primaryEvidence = supporting.filter(
    (e) => e.source === "interference_pattern" || e.source === "mastery_score",
  );
  const totalObs = primaryEvidence.reduce((s, e) => s + e.occurrenceCount, 0);

  if (recommendation.ruleFired === "cold-start:abstain") {
    return "🏁 Bắt đầu — chưa đủ dữ liệu cá nhân hóa.";
  }

  const confidenceIcon =
    evidenceChain.confidence >= 0.85 ? "🟢"
    : evidenceChain.confidence >= 0.65 ? "🟡"
    : evidenceChain.confidence >= 0.40 ? "🟠"
    : "🔴";

  const skillShort = recommendation.targetSkill.replace(/-/g, " ").slice(0, 20);

  return `${confidenceIcon} ${skillShort} — ${totalObs} bằng chứng`;
}

// ─── Main Entry Points ──────────────────────────────────────────────────────

/**
 * Produce a full evidence-backed explanation for a single lesson recommendation.
 *
 * This is the MAIN ENTRY POINT for explaining individual recommendations.
 *
 * @param recommendation — the recommendation to explain
 * @param profile — the learner's history profile
 * @param cefrLevel — known CEFR level
 * @param goals — stated learner goals
 * @param recentPractice — recently practiced topics
 * @param avgDaysBetweenSessions — average days between sessions
 * @param strategy — the teaching strategy being used (optional)
 * @param challengeLevel — how challenging the lesson is (optional)
 * @param now — timestamp for recency calculations (injectable for testing)
 * @returns Complete evidence-backed explanation
 */
export function explainRecommendation(
  recommendation: NextLessonRecommendation,
  profile: LearnerHistoryProfile,
  cefrLevel: CefrLevel | null,
  goals: LearnerGoal[],
  recentPractice: Array<{ topic: string; practicedAt: number; mode: string }>,
  avgDaysBetweenSessions: number | null,
  strategy: RecommendationStrategy | null = null,
  challengeLevel: ChallengeLevel = "moderate",
  now: number = Date.now(),
): RecommendationExplanation {
  // Handle cold-start specially
  if (recommendation.ruleFired === "cold-start:abstain") {
    const evidenceItems: EvidenceItem[] = [
      {
        source: "cold_start",
        observationVi: "Chưa có đủ dữ liệu học tập để đưa ra đề xuất cá nhân hóa.",
        strength: "tentative",
        occurrenceCount: 0,
        tag: "cold-start",
        lastObservedAt: null,
        supportsRecommendation: true,
      },
    ];

    // Add session count info if available
    if (profile.sessionCount > 0) {
      evidenceItems.push({
        source: "session_history",
        observationVi: `Mới có ${profile.sessionCount} buổi học — cần ít nhất 5 buổi để cá nhân hóa.`,
        strength: "tentative",
        occurrenceCount: profile.sessionCount,
        tag: "insufficient-sessions",
        lastObservedAt: profile.updatedAt,
        supportsRecommendation: true,
      });
    }

    return {
      recommendation,
      evidenceChain: {
        items: evidenceItems,
        chainReasoningVi:
          "Mình chưa có đủ dữ liệu về bạn để đưa ra đề xuất cụ thể. " +
          "Bắt đầu với bài cơ bản để mình hiểu trình độ và điểm mạnh/yếu của bạn.",
        confidence: 0.1,
        confidenceLabelVi: getConfidenceLabelVi(0.1),
      },
      totalEvidenceItems: evidenceItems.length,
      strongEvidenceCount: 0,
      consideredAlternatives: [],
      bottomLineVi: "Chưa đủ dữ liệu — bắt đầu nhẹ nhàng để mình hiểu bạn hơn.",
      learnerFacingExplanationVi:
        "Mình chưa có đủ dữ liệu để cá nhân hóa bài học cho bạn. " +
        "Đừng lo — mình bắt đầu với bài cơ bản, và sau vài buổi mình sẽ " +
        "hiểu bạn hơn và đề xuất bài học phù hợp với điểm mạnh, điểm yếu của bạn.",
      summaryCardVi: "🏁 Bắt đầu — chưa đủ dữ liệu cá nhân hóa.",
    };
  }

  // Collect all evidence
  const allEvidence = collectAllEvidence(
    recommendation,
    profile,
    cefrLevel,
    goals,
    recentPractice,
    avgDaysBetweenSessions,
    now,
  );

  // Build evidence chain
  const evidenceChain = buildEvidenceChain(allEvidence, recommendation, cefrLevel);

  // Consider alternatives
  const alternatives = considerAlternatives(recommendation, profile, goals);

  // Count strong evidence
  const strongCount = allEvidence.filter(
    (e) => e.strength === "strong" && e.supportsRecommendation,
  ).length;

  // Build messages
  const bottomLine = buildBottomLine(recommendation, evidenceChain, strategy);
  const learnerExplanation = buildLearnerFacingExplanation(
    recommendation,
    evidenceChain,
    strategy,
    challengeLevel,
    cefrLevel,
  );
  const summaryCard = buildSummaryCard(recommendation, evidenceChain);

  return {
    recommendation,
    evidenceChain,
    totalEvidenceItems: allEvidence.length,
    strongEvidenceCount: strongCount,
    consideredAlternatives: alternatives,
    bottomLineVi: bottomLine,
    learnerFacingExplanationVi: learnerExplanation,
    summaryCardVi: summaryCard,
  };
}

/**
 * Explain an entire personalized lesson sequence with evidence.
 *
 * Produces evidence-backed explanations for every phase, plus an
 * overarching sequence-level evidence summary.
 */
export function explainSequence(
  sequence: PersonalizedLessonSequence,
  profile: LearnerHistoryProfile,
  cefrLevel: CefrLevel | null,
  goals: LearnerGoal[],
  recentPractice: Array<{ topic: string; practicedAt: number; mode: string }>,
  avgDaysBetweenSessions: number | null,
  now: number = Date.now(),
): ExplainedSequence {
  const phaseExplanations: RecommendationExplanation[] = [];

  for (const phase of sequence.phases) {
    // Convert phase to a NextLessonRecommendation for the explainer
    const rec: NextLessonRecommendation = {
      lessonTitle: phase.titleVi,
      targetSkill: phase.skillTag,
      reason: phase.reasonVi,
      suggestedMode: phase.suggestedMode,
      ruleFired: `sequence:${sequence.dispatchLabel}`,
    };

    const explanation = explainRecommendation(
      rec,
      profile,
      cefrLevel,
      goals,
      recentPractice,
      avgDaysBetweenSessions,
      phase.strategy,
      phase.challengeLevel,
      now,
    );

    phaseExplanations.push(explanation);
  }

  // Calculate overall confidence (average of phase confidences)
  const overallConfidence =
    phaseExplanations.length > 0
      ? phaseExplanations.reduce((s, e) => s + e.evidenceChain.confidence, 0) /
        phaseExplanations.length
      : 0;

  // Build overview
  const overviewParts: string[] = [];
  overviewParts.push(
    `Lộ trình ${sequence.phases.length} giai đoạn này được xây dựng dựa trên ` +
    `bằng chứng từ ${profile.sessionCount} buổi học của bạn.`,
  );
  overviewParts.push("");

  const totalEvidence = phaseExplanations.reduce(
    (s, e) => s + e.totalEvidenceItems,
    0,
  );
  const totalStrong = phaseExplanations.reduce(
    (s, e) => s + e.strongEvidenceCount,
    0,
  );

  overviewParts.push(
    `📊 Tổng cộng ${totalEvidence} mảnh bằng chứng được sử dụng, ` +
    `trong đó có ${totalStrong} bằng chứng mạnh.`,
  );

  overviewParts.push(
    `🔬 Độ tin cậy tổng thể: ${Math.round(overallConfidence * 100)}% — ` +
    `${getConfidenceLabelVi(overallConfidence)}`,
  );

  overviewParts.push("");
  overviewParts.push("📋 Từng giai đoạn:");

  for (let i = 0; i < sequence.phases.length; i++) {
    const phase = sequence.phases[i];
    const expl = phaseExplanations[i];
    const confPct = Math.round(expl.evidenceChain.confidence * 100);
    overviewParts.push(
      `  Giai đoạn ${phase.position}: ${phase.titleVi} — ${expl.strongEvidenceCount} bằng chứng mạnh, độ tin cậy ${confPct}%`,
    );
  }

  return {
    sequence,
    phaseExplanations,
    overviewEvidenceVi: overviewParts.join("\n"),
    overallConfidence,
    overallConfidenceLabelVi: getConfidenceLabelVi(overallConfidence),
  };
}

/**
 * Get a quick evidence score — how much evidence supports this recommendation.
 *
 * Returns 0–10. Useful for sorting or filtering recommendations by evidence strength.
 */
export function evidenceScore(
  recommendation: NextLessonRecommendation,
  profile: LearnerHistoryProfile,
): number {
  if (recommendation.ruleFired === "cold-start:abstain") return 0;

  const interferenceEvidence = profile.interferencePatterns
    .filter((p) => {
      const tagLower = p.tag.toLowerCase();
      const skillLower = recommendation.targetSkill.toLowerCase();
      return tagLower === skillLower || skillLower.includes(tagLower) || tagLower.includes(skillLower);
    })
    .reduce((s, p) => s + p.observedCount, 0);

  const masteryEvidence = Object.entries(profile.topicMastery)
    .filter(([topic]) => {
      const topicLower = topic.toLowerCase();
      const skillLower = recommendation.targetSkill.toLowerCase();
      return topicLower === skillLower || skillLower.includes(topicLower) || topicLower.includes(skillLower);
    })
    .reduce((s, [, score]) => s + (score < 50 ? 1 : 0), 0);

  return Math.min(10, interferenceEvidence + masteryEvidence * 2);
}

// ─── Evidence Catalog (for documentation and UI) ────────────────────────────

export const LESSON_RECOMMENDATION_EXPLAINER_CATALOG: ReadonlyArray<{
  key: string;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
}> = [
  {
    key: "evidence-tracing",
    titleVi: "Truy vết bằng chứng",
    titleEn: "Evidence tracing",
    descriptionVi: "Mỗi đề xuất bài học đều được truy ngược về dữ liệu cụ thể — lỗi nào, bao nhiêu lần, trong buổi nào.",
  },
  {
    key: "confidence-calibration",
    titleVi: "Hiệu chỉnh độ tin cậy",
    titleEn: "Confidence calibration",
    descriptionVi: "Độ tin cậy của đề xuất dựa trên số lượng và chất lượng bằng chứng — không suy đoán.",
  },
  {
    key: "alternative-consideration",
    titleVi: "Cân nhắc lựa chọn khác",
    titleEn: "Alternative consideration",
    descriptionVi: "Minh bạch về những lựa chọn khác đã được cân nhắc và lý do không chọn.",
  },
  {
    key: "evidence-chain",
    titleVi: "Chuỗi bằng chứng",
    titleEn: "Evidence chain",
    descriptionVi: "Hiển thị toàn bộ chuỗi logic: dữ liệu → suy luận → đề xuất — như một giáo viên giải thích cho đồng nghiệp.",
  },
  {
    key: "learner-facing",
    titleVi: "Giải thích cho người học",
    titleEn: "Learner-facing explanation",
    descriptionVi: "Lời giải thích bằng tiếng Việt, dễ hiểu, có số liệu cụ thể — không phải output của thuật toán.",
  },
];

export const LESSON_RECOMMENDATION_EXPLAINER_DIMENSIONS = [
  {
    id: "evidence_coverage" as const,
    titleVi: "Độ phủ bằng chứng",
    titleEn: "Evidence coverage",
    descriptionVi: "Bao nhiêu nguồn dữ liệu khác nhau được dùng để đưa ra đề xuất (lỗi hệ thống, mastery, mục tiêu, nhịp học...).",
  },
  {
    id: "evidence_quality" as const,
    titleVi: "Chất lượng bằng chứng",
    titleEn: "Evidence quality",
    descriptionVi: "Bằng chứng mạnh (≥5 lần), trung bình (3–4 lần), yếu (2 lần), hay phỏng đoán (1 lần).",
  },
  {
    id: "counter_evidence_awareness" as const,
    titleVi: "Nhận diện bằng chứng ngược",
    titleEn: "Counter-evidence awareness",
    descriptionVi: "Không chỉ liệt kê bằng chứng ủng hộ — còn ghi nhận những dữ liệu không ủng hộ đề xuất.",
  },
  {
    id: "transparency" as const,
    titleVi: "Minh bạch trong suy luận",
    titleEn: "Reasoning transparency",
    descriptionVi: "Người học (và developer) có thể thấy toàn bộ chuỗi suy luận — không phải 'hộp đen'.",
  },
];
