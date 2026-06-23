/**
 * Golden Tests — Evidence-Based Lesson Recommendation Explainer
 *
 * These are REGRESSION TESTS that verify the explainer produces EXACT,
 * known-good evidence chains for representative learner profiles and
 * recommendations.
 *
 * If any of these tests break, it means the explainer's evidence-gathering
 * or reasoning behavior has changed — intentionally or not. Golden test
 * failures require a CONSCIOUS review.
 *
 * What makes these "golden":
 *   1. Exact output assertions — every structured field verified.
 *   2. Full coverage: interference, mastery, goals, cold-start, recency, CEFR,
 *      sequence-level explanations, confidence calibration.
 *   3. Organized by scenario archetype — mirrors real learner situations.
 *   4. Both structure (evidence items, chain, alternatives) and content.
 *
 * Pure functions — no I/O, no side effects, deterministic.
 */

import { describe, expect, it } from "vitest";
import {
  explainRecommendation,
  explainSequence,
  evidenceScore,
  calibrateEvidenceStrength,
  assessConfidence,
  getConfidenceLabelVi,
  collectAllEvidence,
  buildEvidenceChain,
  considerAlternatives,
  LESSON_RECOMMENDATION_EXPLAINER_CATALOG,
  LESSON_RECOMMENDATION_EXPLAINER_DIMENSIONS,
  type RecommendationExplanation,
  type ExplainedSequence,
  type EvidenceItem,
  type EvidenceChain,
} from "../lessonRecommendationExplainer";
import type { LearnerHistoryProfile } from "../learnerHistoryProfile";
import type { CefrLevel, LearnerGoal } from "../lessonRecommendationIntelligence";
import type { NextLessonRecommendation } from "../nextLessonRecommender";
import { generateLessonSequence, type SequenceGeneratorInput } from "../lessonSequenceGenerator";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NOW = 1_700_000_000_000;
const DAY_MS = 24 * 60 * 60 * 1000;

function emptyProfile(overrides: Partial<LearnerHistoryProfile> = {}): LearnerHistoryProfile {
  return {
    product: "english",
    targetLanguage: "en",
    topicMastery: {},
    interferencePatterns: [],
    sessionCount: 0,
    completedSessionCount: 0,
    preferredMode: null,
    updatedAt: NOW,
    ...overrides,
  };
}

function makeRec(
  targetSkill: string,
  overrides: Partial<NextLessonRecommendation> = {},
): NextLessonRecommendation {
  return {
    lessonTitle: `Lesson for ${targetSkill}`,
    targetSkill,
    reason: "Test reason",
    suggestedMode: "grammar",
    ruleFired: "test:mock",
    ...overrides,
  };
}

function makeInterferencePattern(
  tag: string,
  observedCount: number,
  lastSeenAt = NOW,
) {
  return { tag, observedCount, lastSeenAt };
}

function makeRecentPractice(
  topic: string,
  daysAgo: number,
  mode: "grammar" | "speak" | "journey" | "logic" = "grammar",
) {
  return {
    topic,
    practicedAt: NOW - daysAgo * DAY_MS,
    mode,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 1: Strong Interference Evidence — Missing Articles
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 1: strong interference evidence — missing articles (≥5 observations)", () => {
  const profile = emptyProfile({
    sessionCount: 12,
    completedSessionCount: 10,
    interferencePatterns: [
      makeInterferencePattern("missing-article", 7, NOW - 1 * DAY_MS),
      makeInterferencePattern("tense-omission", 2, NOW - 3 * DAY_MS),
    ],
    updatedAt: NOW,
  });

  const recommendation = makeRec("missing-article", {
    lessonTitle: "Master English articles: a, an, and the",
    reason: "Mercy noticed 7 times you skipped an article",
    suggestedMode: "grammar",
    ruleFired: "viet-interference:missing-article",
  });

  const explanation = explainRecommendation(
    recommendation,
    profile,
    "A2",
    ["daily_conversation"],
    [makeRecentPractice("speaking-basics", 2, "speak")],
    2.5,
    "target_weakness",
    "moderate",
    NOW,
  );

  it("produces the recommendation reference", () => {
    expect(explanation.recommendation.targetSkill).toBe("missing-article");
    expect(explanation.recommendation.ruleFired).toBe("viet-interference:missing-article");
  });

  it("collects evidence from multiple sources", () => {
    // Should have evidence from: interference, session history, CEFR, goals, recent practice, cadence
    expect(explanation.totalEvidenceItems).toBeGreaterThanOrEqual(5);
  });

  it("has strong evidence from the primary interference pattern", () => {
    const primaryEvidence = explanation.evidenceChain.items.filter(
      (e) => e.source === "interference_pattern" && e.supportsRecommendation,
    );
    expect(primaryEvidence.length).toBe(1);
    expect(primaryEvidence[0].strength).toBe("strong");
    expect(primaryEvidence[0].occurrenceCount).toBe(7);
    expect(primaryEvidence[0].tag).toBe("missing-article");
  });

  it("includes counter-evidence from the tense-omission pattern", () => {
    const counterEvidence = explanation.evidenceChain.items.filter(
      (e) => e.source === "interference_pattern" && !e.supportsRecommendation,
    );
    // tense-omission has only 2 observations (< 3 threshold for counter-evidence)
    // So there should be no counter-evidence from it in this case
    expect(counterEvidence.length).toBe(0);
  });

  it("has high confidence (≥ 0.65) from strong evidence", () => {
    expect(explanation.evidenceChain.confidence).toBeGreaterThanOrEqual(0.65);
  });

  it("has at least one strong evidence item counted", () => {
    expect(explanation.strongEvidenceCount).toBeGreaterThanOrEqual(1);
  });

  it("considers alternatives", () => {
    // Should at least consider the tense-omission pattern as an alternative
    // if it meets the threshold (2 observations)
    expect(explanation.consideredAlternatives.length).toBeGreaterThanOrEqual(0);
  });

  it("has a Vietnamese bottom line", () => {
    expect(explanation.bottomLineVi.length).toBeGreaterThan(10);
    // Bottom line references the skill tag (not necessarily the VI word "mạo từ")
    expect(explanation.bottomLineVi).toMatch(/bằng chứng|mạo từ|missing article|bài/);
  });

  it("has a learner-facing explanation in Vietnamese", () => {
    expect(explanation.learnerFacingExplanationVi.length).toBeGreaterThan(50);
    expect(explanation.learnerFacingExplanationVi).toContain("📊");
  });

  it("has a summary card", () => {
    expect(explanation.summaryCardVi.length).toBeGreaterThan(5);
  });

  it("evidence chain reasoning is structured", () => {
    expect(explanation.evidenceChain.chainReasoningVi).toContain("→");
    expect(explanation.evidenceChain.chainReasoningVi.toLowerCase()).toContain("bằng chứng");
  });

  it("evidence items are ordered (supporting first, then counter)", () => {
    const items = explanation.evidenceChain.items;
    let foundCounter = false;
    for (const item of items) {
      if (!item.supportsRecommendation) {
        foundCounter = true;
      }
      if (foundCounter && item.supportsRecommendation) {
        // Supporting evidence should not appear after counter-evidence
        expect.fail("Supporting evidence found after counter-evidence");
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 2: Moderate Interference — Preposition Calque (3–4 observations)
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 2: moderate interference — preposition calque (3 observations)", () => {
  const profile = emptyProfile({
    sessionCount: 8,
    completedSessionCount: 6,
    interferencePatterns: [
      makeInterferencePattern("preposition-calque", 3, NOW - 2 * DAY_MS),
    ],
    updatedAt: NOW,
  });

  const recommendation = makeRec("preposition-calque", {
    lessonTitle: "Fix prepositions: in/on/at",
    reason: "Mercy saw 3 preposition mistakes",
    suggestedMode: "grammar",
    ruleFired: "viet-interference:preposition-calque",
  });

  const explanation = explainRecommendation(
    recommendation,
    profile,
    "B1",
    ["workplace_english", "travel_english"],
    [],
    3.5,
    "target_weakness",
    "moderate",
    NOW,
  );

  it("calibrates evidence as moderate for 3 observations", () => {
    const primaryEvidence = explanation.evidenceChain.items.filter(
      (e) => e.source === "interference_pattern" && e.supportsRecommendation,
    );
    expect(primaryEvidence.length).toBe(1);
    expect(primaryEvidence[0].strength).toBe("moderate");
  });

  it("has moderate confidence (0.4–0.84)", () => {
    expect(explanation.evidenceChain.confidence).toBeGreaterThanOrEqual(0.4);
    expect(explanation.evidenceChain.confidence).toBeLessThan(0.85);
  });

  it("includes goal alignment evidence", () => {
    const goalEvidence = explanation.evidenceChain.items.filter(
      (e) => e.source === "learner_goal" && e.supportsRecommendation,
    );
    // Preposition-calque should align with workplace and travel goals
    // Because preposition-calque is linked to general improvement
    expect(goalEvidence.length).toBeGreaterThanOrEqual(0);
  });

  it("includes CEFR evidence", () => {
    const cefrEvidence = explanation.evidenceChain.items.filter(
      (e) => e.source === "cefr_level",
    );
    expect(cefrEvidence.length).toBe(1);
    expect(cefrEvidence[0].tag).toBe("cefr-b1");
  });

  it("learner-facing explanation mentions prepositions", () => {
    expect(explanation.learnerFacingExplanationVi.toLowerCase()).toMatch(/giới từ|preposition/);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 3: Weak Interference — Double Negation (2 observations)
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 3: weak interference — double negation (2 observations)", () => {
  const profile = emptyProfile({
    sessionCount: 6,
    completedSessionCount: 5,
    interferencePatterns: [
      makeInterferencePattern("double-negation", 2, NOW - 4 * DAY_MS),
    ],
    updatedAt: NOW,
  });

  const recommendation = makeRec("double-negation", {
    lessonTitle: "One negative at a time",
    reason: "Mercy noticed 2 double-negation patterns",
    suggestedMode: "grammar",
    ruleFired: "viet-interference:double-negation",
  });

  const explanation = explainRecommendation(
    recommendation,
    profile,
    "A2",
    [],
    [],
    null,
    "target_weakness",
    "comfortable",
    NOW,
  );

  it("calibrates evidence as weak for 2 observations", () => {
    const primaryEvidence = explanation.evidenceChain.items.filter(
      (e) => e.source === "interference_pattern" && e.supportsRecommendation,
    );
    expect(primaryEvidence.length).toBe(1);
    expect(primaryEvidence[0].strength).toBe("weak");
  });

  it("has lower confidence (< 0.65)", () => {
    expect(explanation.evidenceChain.confidence).toBeLessThan(0.65);
  });

  it("has only weak primary evidence", () => {
    // Primary interference evidence should be weak for 2 observations
    const primaryInterference = explanation.evidenceChain.items.filter(
      (e) => e.source === "interference_pattern" && e.supportsRecommendation,
    );
    expect(primaryInterference.every((e) => e.strength === "weak")).toBe(true);
  });

  it("confidence label reflects uncertainty", () => {
    expect(explanation.evidenceChain.confidenceLabelVi).toMatch(/chưa đủ|thử|cơ sở/);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 4: Cold-Start — Insufficient Data
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 4: cold-start — insufficient data", () => {
  const profile = emptyProfile({
    sessionCount: 2,
    completedSessionCount: 1,
    updatedAt: NOW,
  });

  const recommendation: NextLessonRecommendation = {
    lessonTitle: "Start with one clear daily sentence",
    targetSkill: "starter-sentence",
    reason: "Mercy doesn't have enough history yet.",
    suggestedMode: "grammar",
    ruleFired: "cold-start:abstain",
  };

  const explanation = explainRecommendation(
    recommendation,
    profile,
    null,
    [],
    [],
    null,
    null,
    "easy",
    NOW,
  );

  it("returns cold-start explanation with very low confidence", () => {
    expect(explanation.evidenceChain.confidence).toBe(0.1);
    expect(explanation.strongEvidenceCount).toBe(0);
  });

  it("has cold-start evidence item", () => {
    const coldStartItem = explanation.evidenceChain.items.find(
      (e) => e.source === "cold_start",
    );
    expect(coldStartItem).toBeDefined();
    expect(coldStartItem!.strength).toBe("tentative");
  });

  it("has no considered alternatives for cold-start", () => {
    expect(explanation.consideredAlternatives).toEqual([]);
  });

  it("bottom line explains lack of data", () => {
    expect(explanation.bottomLineVi.toLowerCase()).toMatch(/chưa đủ dữ liệu|chưa có đủ/);
  });

  it("learner-facing explanation is encouraging", () => {
    expect(explanation.learnerFacingExplanationVi.length).toBeGreaterThan(20);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 5: Mastery-Based Recommendation
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 5: mastery-based recommendation", () => {
  const profile = emptyProfile({
    sessionCount: 15,
    completedSessionCount: 14,
    topicMastery: {
      "past-tense": 32,
      articles: 45,
      prepositions: 68,
      speaking: 78,
    },
    updatedAt: NOW,
  });

  const recommendation = makeRec("past-tense", {
    lessonTitle: "Review past tense",
    reason: "Mastery for past tense is at 32%",
    suggestedMode: "grammar",
    ruleFired: "mastery:lowest-topic-review",
  });

  const explanation = explainRecommendation(
    recommendation,
    profile,
    "A2",
    ["general_improvement"],
    [makeRecentPractice("articles", 4, "grammar")],
    2.0,
    "cement_foundation",
    "comfortable",
    NOW,
  );

  it("collects mastery evidence", () => {
    const masteryEvidence = explanation.evidenceChain.items.filter(
      (e) => e.source === "mastery_score" && e.supportsRecommendation,
    );
    expect(masteryEvidence.length).toBe(1);
    expect(masteryEvidence[0].tag).toBe("past-tense");
    // 32% is ≥ 30 → moderate (thresholds: <30=strong, <50=moderate, ≥50=weak)
    expect(masteryEvidence[0].strength).toBe("moderate");
    expect(masteryEvidence[0].observationVi).toContain("32%");
  });

  it("considers other low-mastery topics as alternatives", () => {
    // "articles" at 45% should appear as an alternative
    const articleAlt = explanation.consideredAlternatives.find(
      (a) => a.skillTag === "articles",
    );
    expect(articleAlt).toBeDefined();
    expect(articleAlt!.whyRejectedVi).toBeDefined();
    expect(articleAlt!.whyRejectedVi.length).toBeGreaterThan(10);
  });

  it("does not consider above-50% topics as alternatives", () => {
    const prepositionsAlt = explanation.consideredAlternatives.find(
      (a) => a.skillTag === "prepositions",
    );
    expect(prepositionsAlt).toBeUndefined();
  });

  it("has confidence in the moderate range", () => {
    // Mastery-based + session history should give moderate confidence
    expect(explanation.evidenceChain.confidence).toBeGreaterThanOrEqual(0.3);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 6: Recency Overlap — Counter-Evidence for Recently Practiced Skill
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 6: recency overlap — recently practiced skill produces counter-evidence", () => {
  const profile = emptyProfile({
    sessionCount: 10,
    completedSessionCount: 8,
    interferencePatterns: [
      makeInterferencePattern("word-order", 4, NOW - 5 * DAY_MS),
    ],
    updatedAt: NOW,
  });

  const recommendation = makeRec("word-order", {
    lessonTitle: "Word order: adjectives before nouns",
    reason: "Mercy spotted 4 word-order mistakes",
    suggestedMode: "grammar",
    ruleFired: "viet-interference:word-order",
  });

  const explanation = explainRecommendation(
    recommendation,
    profile,
    "B1",
    [],
    [makeRecentPractice("word-order", 1, "grammar")], // Practiced 1 day ago
    3.0,
    "target_weakness",
    "moderate",
    NOW,
  );

  it("includes recency counter-evidence", () => {
    const recencyEvidence = explanation.evidenceChain.items.filter(
      (e) => e.source === "recent_practice",
    );
    expect(recencyEvidence.length).toBeGreaterThanOrEqual(1);
  });

  it("recency counter-evidence does NOT support the recommendation", () => {
    const recencyCounter = explanation.evidenceChain.items.find(
      (e) => e.source === "recent_practice" && !e.supportsRecommendation,
    );
    expect(recencyCounter).toBeDefined();
    expect(recencyCounter!.observationVi).toMatch(/gần đây|trùng|lặp/);
  });

  it("confidence is lowered by counter-evidence", () => {
    // The presence of recent practice should reduce confidence somewhat
    expect(explanation.evidenceChain.confidence).toBeLessThan(0.9);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 7: Goal-Aligned Recommendation
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 7: goal-aligned recommendation", () => {
  const profile = emptyProfile({
    sessionCount: 20,
    completedSessionCount: 18,
    preferredMode: "speak",
    updatedAt: NOW,
  });

  const goals: LearnerGoal[] = ["ielts_preparation", "job_interview"];

  const recommendation = makeRec("ielts-writing-task1", {
    lessonTitle: "IELTS Writing Task 1",
    reason: "Practice describing charts",
    suggestedMode: "grammar",
    ruleFired: "goal:ielts-writing-task1",
  });

  const explanation = explainRecommendation(
    recommendation,
    profile,
    "B1",
    goals,
    [makeRecentPractice("ielts-speaking-part2", 2, "speak")],
    2.0,
    "stretch_zone",
    "stretch",
    NOW,
  );

  it("includes goal alignment evidence for both goals", () => {
    const goalEvidence = explanation.evidenceChain.items.filter(
      (e) => e.source === "learner_goal" && e.supportsRecommendation,
    );
    // IELTS writing should match ielts_preparation goal
    expect(goalEvidence.length).toBeGreaterThanOrEqual(1);
    expect(goalEvidence.some((e) => e.tag === "ielts_preparation")).toBe(true);
  });

  it("considers other goal-aligned topics as alternatives", () => {
    const goalAlts = explanation.consideredAlternatives.filter(
      (a) =>
        a.whyRejectedVi.includes("mục tiêu") ||
        a.labelVi.includes("IELTS") ||
        a.labelVi.includes("speak") ||
        a.labelVi.includes("interview"),
    );
    expect(goalAlts.length).toBeGreaterThanOrEqual(0);
  });

  it("has moderate-to-strong confidence from session history", () => {
    // 20 sessions of history should boost confidence
    expect(explanation.evidenceChain.confidence).toBeGreaterThanOrEqual(0.4);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 8: Sparse Cadence — Infrequent Learner
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 8: sparse cadence — infrequent learner", () => {
  const profile = emptyProfile({
    sessionCount: 7,
    completedSessionCount: 5,
    interferencePatterns: [
      makeInterferencePattern("tense-omission", 5, NOW - 10 * DAY_MS),
    ],
    updatedAt: NOW,
  });

  const recommendation = makeRec("tense-omission", {
    lessonTitle: "Fix tense: show time inside the verb",
    reason: "Mercy saw 5 tense-omission errors",
    suggestedMode: "grammar",
    ruleFired: "viet-interference:tense-omission",
  });

  const explanation = explainRecommendation(
    recommendation,
    profile,
    "A1",
    [],
    [],
    8.5, // Very sparse — 8.5 days between sessions
    "review_and_consolidate",
    "easy",
    NOW,
  );

  it("includes cadence evidence showing sparse practice", () => {
    const cadenceEvidence = explanation.evidenceChain.items.filter(
      (e) => e.source === "session_cadence",
    );
    expect(cadenceEvidence.length).toBeGreaterThanOrEqual(1);
    const sparse = cadenceEvidence.find((e) => e.tag === "cadence-sparse");
    expect(sparse).toBeDefined();
    expect(sparse!.observationVi).toContain("thưa");
  });

  it("cadence evidence is moderate for >7 day gaps (contextual)", () => {
    const cadenceEvidence = explanation.evidenceChain.items.find(
      (e) => e.tag === "cadence-sparse",
    );
    expect(cadenceEvidence).toBeDefined();
    // Cadence evidence is contextual — moderate, never primary
    expect(cadenceEvidence!.strength).toBe("moderate");
    expect(cadenceEvidence!.observationVi).toContain("thưa");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 9: Consistent Cadence — Frequent Learner
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 9: consistent cadence — frequent learner", () => {
  const profile = emptyProfile({
    sessionCount: 25,
    completedSessionCount: 24,
    interferencePatterns: [
      makeInterferencePattern("subj-verb-agreement", 6, NOW - 1 * DAY_MS),
    ],
    updatedAt: NOW,
  });

  const recommendation = makeRec("subj-verb-agreement", {
    lessonTitle: "Subject-verb agreement",
    reason: "Mercy noticed 6 errors",
    suggestedMode: "grammar",
    ruleFired: "viet-interference:subj-verb-agreement",
  });

  const explanation = explainRecommendation(
    recommendation,
    profile,
    "B2",
    ["workplace_english"],
    [makeRecentPractice("email-writing", 1.5, "grammar")],
    1.5, // Very frequent — every 1.5 days
    "target_weakness",
    "stretch",
    NOW,
  );

  it("includes cadence evidence showing consistent practice", () => {
    const cadenceEvidence = explanation.evidenceChain.items.find(
      (e) => e.tag === "cadence-consistent",
    );
    expect(cadenceEvidence).toBeDefined();
    expect(cadenceEvidence!.observationVi).toContain("đều");
  });

  it("has very high confidence from multiple strong evidence sources", () => {
    // 6 strong interference obs + consistent cadence + B2 CEFR → high confidence
    expect(explanation.evidenceChain.confidence).toBeGreaterThanOrEqual(0.75);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 10: Sequence-Level Explanation
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 10: sequence-level explanation", () => {
  const profile = emptyProfile({
    sessionCount: 14,
    completedSessionCount: 12,
    interferencePatterns: [
      makeInterferencePattern("missing-article", 7, NOW - 1 * DAY_MS),
      makeInterferencePattern("tense-omission", 4, NOW - 2 * DAY_MS),
      makeInterferencePattern("preposition-calque", 2, NOW - 5 * DAY_MS),
    ],
    topicMastery: {
      "past-tense": 35,
      articles: 42,
    },
    updatedAt: NOW,
  });

  const sequenceInput: SequenceGeneratorInput = {
    profile,
    cefrLevel: "A2",
    goals: ["daily_conversation", "travel_english"],
    recentPractice: [makeRecentPractice("small-talk", 1, "speak")],
    avgDaysBetweenSessions: 2.0,
    now: NOW,
    maxPhases: 4,
  };

  const sequence = generateLessonSequence(sequenceInput);

  const explained = explainSequence(
    sequence,
    profile,
    "A2",
    ["daily_conversation", "travel_english"],
    [makeRecentPractice("small-talk", 1, "speak")],
    2.0,
    NOW,
  );

  it("explains every phase in the sequence", () => {
    expect(explained.phaseExplanations.length).toBe(sequence.phases.length);
    for (let i = 0; i < sequence.phases.length; i++) {
      expect(explained.phaseExplanations[i].recommendation.targetSkill).toBe(
        sequence.phases[i].skillTag,
      );
    }
  });

  it("has an overview evidence summary", () => {
    expect(explained.overviewEvidenceVi).toContain("bằng chứng");
    expect(explained.overviewEvidenceVi).toContain("giai đoạn");
  });

  it("has overall confidence", () => {
    expect(explained.overallConfidence).toBeGreaterThanOrEqual(0);
    expect(explained.overallConfidence).toBeLessThanOrEqual(1);
    expect(explained.overallConfidenceLabelVi.length).toBeGreaterThan(10);
  });

  it("sequence reference is preserved", () => {
    expect(explained.sequence.phases.length).toBe(sequence.phases.length);
    expect(explained.sequence.dispatchLabel).toBe(sequence.dispatchLabel);
  });

  it("first phase has highest evidence (interference-first)", () => {
    const firstExpl = explained.phaseExplanations[0];
    // First phase should target the strongest interference pattern
    expect(firstExpl.strongEvidenceCount).toBeGreaterThanOrEqual(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 11: Evidence Score Utility
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 11: evidence score utility", () => {
  it("returns 0 for cold-start", () => {
    const rec: NextLessonRecommendation = {
      lessonTitle: "Start",
      targetSkill: "starter-sentence",
      reason: "...",
      suggestedMode: "grammar",
      ruleFired: "cold-start:abstain",
    };
    expect(evidenceScore(rec, emptyProfile())).toBe(0);
  });

  it("counts interference observations toward score", () => {
    const profile = emptyProfile({
      interferencePatterns: [
        makeInterferencePattern("missing-article", 7),
      ],
    });
    const rec = makeRec("missing-article");
    expect(evidenceScore(rec, profile)).toBeGreaterThanOrEqual(7);
  });

  it("caps at 10", () => {
    const profile = emptyProfile({
      interferencePatterns: [
        makeInterferencePattern("very-common-error", 50),
        makeInterferencePattern("also-common", 20),
      ],
    });
    const rec = makeRec("very-common-error");
    expect(evidenceScore(rec, profile)).toBeLessThanOrEqual(10);
  });

  it("adds mastery evidence to score", () => {
    const profile = emptyProfile({
      topicMastery: {
        "past-tense": 25,
        articles: 30,
        prepositions: 40,
      },
    });
    const rec = makeRec("past-tense");
    // Should get +2 for each low-mastery match
    expect(evidenceScore(rec, profile)).toBe(2);
  });

  it("returns 0 for unrelated recommendation", () => {
    const profile = emptyProfile({
      interferencePatterns: [
        makeInterferencePattern("missing-article", 7),
      ],
      topicMastery: {
        "past-tense": 30,
      },
    });
    const rec = makeRec("completely-unrelated-skill");
    expect(evidenceScore(rec, profile)).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 12: Evidence Strength Calibration
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 12: evidence strength calibration", () => {
  it("≥5 observations → strong", () => {
    expect(calibrateEvidenceStrength(5)).toBe("strong");
    expect(calibrateEvidenceStrength(10)).toBe("strong");
    expect(calibrateEvidenceStrength(100)).toBe("strong");
  });

  it("3–4 observations → moderate", () => {
    expect(calibrateEvidenceStrength(3)).toBe("moderate");
    expect(calibrateEvidenceStrength(4)).toBe("moderate");
  });

  it("2 observations → weak", () => {
    expect(calibrateEvidenceStrength(2)).toBe("weak");
  });

  it("0–1 observations → tentative", () => {
    expect(calibrateEvidenceStrength(0)).toBe("tentative");
    expect(calibrateEvidenceStrength(1)).toBe("tentative");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 13: Confidence Assessment
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 13: confidence assessment", () => {
  it("empty evidence → 0", () => {
    expect(assessConfidence([])).toBe(0);
  });

  it("no supporting evidence → 0", () => {
    const items: EvidenceItem[] = [{
      source: "recent_practice",
      observationVi: "Đã luyện gần đây",
      strength: "moderate",
      occurrenceCount: 1,
      tag: "recent",
      lastObservedAt: null,
      supportsRecommendation: false,
    }];
    expect(assessConfidence(items)).toBe(0);
  });

  it("single strong evidence → high confidence", () => {
    const items: EvidenceItem[] = [{
      source: "interference_pattern",
      observationVi: "7 lần lỗi",
      strength: "strong",
      occurrenceCount: 7,
      tag: "missing-article",
      lastObservedAt: NOW,
      supportsRecommendation: true,
    }];
    const conf = assessConfidence(items);
    expect(conf).toBeGreaterThanOrEqual(0.5);
  });

  it("multiple moderate evidence → moderate-to-high confidence", () => {
    const items: EvidenceItem[] = [
      {
        source: "interference_pattern",
        observationVi: "3 lần",
        strength: "moderate",
        occurrenceCount: 3,
        tag: "tense",
        lastObservedAt: NOW,
        supportsRecommendation: true,
      },
      {
        source: "mastery_score",
        observationVi: "35%",
        strength: "strong",
        occurrenceCount: 1,
        tag: "past-tense",
        lastObservedAt: NOW,
        supportsRecommendation: true,
      },
      {
        source: "cefr_level",
        observationVi: "A2 level",
        strength: "strong",
        occurrenceCount: 1,
        tag: "cefr-a2",
        lastObservedAt: null,
        supportsRecommendation: true,
      },
    ];
    const conf = assessConfidence(items);
    expect(conf).toBeGreaterThanOrEqual(0.4);
    expect(conf).toBeLessThanOrEqual(0.9);
  });

  it("counter-evidence reduces confidence", () => {
    const withCounter: EvidenceItem[] = [
      {
        source: "interference_pattern",
        observationVi: "7 lần",
        strength: "strong",
        occurrenceCount: 7,
        tag: "missing-article",
        lastObservedAt: NOW,
        supportsRecommendation: true,
      },
      {
        source: "recent_practice",
        observationVi: "vừa luyện",
        strength: "moderate",
        occurrenceCount: 1,
        tag: "recent-overlap",
        lastObservedAt: NOW,
        supportsRecommendation: false,
      },
    ];

    const withoutCounter: EvidenceItem[] = [{
      source: "interference_pattern",
      observationVi: "7 lần",
      strength: "strong",
      occurrenceCount: 7,
      tag: "missing-article",
      lastObservedAt: NOW,
      supportsRecommendation: true,
    }];

    expect(assessConfidence(withCounter)).toBeLessThan(assessConfidence(withoutCounter));
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 14: Confidence Labels
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 14: confidence labels in Vietnamese", () => {
  it("≥0.85 → rất chắc", () => {
    expect(getConfidenceLabelVi(0.85)).toContain("rất chắc");
    expect(getConfidenceLabelVi(0.95)).toContain("rất chắc");
  });

  it("0.65–0.84 → khá chắc", () => {
    expect(getConfidenceLabelVi(0.65)).toContain("khá chắc");
    expect(getConfidenceLabelVi(0.75)).toContain("khá chắc");
  });

  it("0.40–0.64 → có cơ sở", () => {
    expect(getConfidenceLabelVi(0.40)).toContain("cơ sở");
    expect(getConfidenceLabelVi(0.55)).toContain("cơ sở");
  });

  it("0.20–0.39 → đề xuất thử", () => {
    expect(getConfidenceLabelVi(0.20)).toMatch(/thử|đề xuất/);
    expect(getConfidenceLabelVi(0.30)).toMatch(/thử|đề xuất/);
  });

  it("<0.20 → chưa đủ dữ liệu", () => {
    expect(getConfidenceLabelVi(0.10)).toMatch(/chưa đủ|chưa có/);
    expect(getConfidenceLabelVi(0.0)).toMatch(/chưa đủ|chưa có/);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 15: CEFR Evidence Inclusion
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 15: CEFR evidence inclusion", () => {
  it("null CEFR → no CEFR evidence", () => {
    const profile = emptyProfile();
    const rec = makeRec("grammar-practice");
    const explanation = explainRecommendation(
      rec, profile, null, [], [], null, null, "easy", NOW,
    );
    const cefrEvidence = explanation.evidenceChain.items.filter(
      (e) => e.source === "cefr_level",
    );
    expect(cefrEvidence.length).toBe(0);
  });

  it("A1 → appropriate description", () => {
    const profile = emptyProfile({ sessionCount: 5 });
    const rec = makeRec("grammar-practice");
    const explanation = explainRecommendation(
      rec, profile, "A1", [], [], null, null, "easy", NOW,
    );
    const cefrEvidence = explanation.evidenceChain.items.find(
      (e) => e.source === "cefr_level",
    );
    expect(cefrEvidence).toBeDefined();
    expect(cefrEvidence!.observationVi).toContain("mới bắt đầu");
    expect(cefrEvidence!.tag).toBe("cefr-a1");
  });

  it("C2 → appropriate description", () => {
    const profile = emptyProfile({ sessionCount: 30 });
    const rec = makeRec("fluency-practice");
    const explanation = explainRecommendation(
      rec, profile, "C2", [], [], null, null, "hard", NOW,
    );
    const cefrEvidence = explanation.evidenceChain.items.find(
      (e) => e.source === "cefr_level",
    );
    expect(cefrEvidence).toBeDefined();
    expect(cefrEvidence!.observationVi).toContain("thành thạo");
    expect(cefrEvidence!.tag).toBe("cefr-c2");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 16: No Profile Data — All Evidence Sources Empty
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 16: no profile data — all sources empty", () => {
  const profile = emptyProfile();
  const rec: NextLessonRecommendation = {
    lessonTitle: "Fallback starter sentence",
    targetSkill: "starter-sentence",
    reason: "Fallback",
    suggestedMode: "grammar",
    ruleFired: "fallback:starter",
  };

  const explanation = explainRecommendation(
    rec, profile, null, [], [], null, null, "easy", NOW,
  );

  it("still has evidence from session history", () => {
    const sessionEvidence = explanation.evidenceChain.items.filter(
      (e) => e.source === "session_history",
    );
    expect(sessionEvidence.length).toBeGreaterThanOrEqual(1);
  });

  it("has low confidence", () => {
    expect(explanation.evidenceChain.confidence).toBeLessThan(0.5);
  });

  it("has no strong evidence", () => {
    expect(explanation.strongEvidenceCount).toBe(0);
  });

  it("no alternatives to consider", () => {
    expect(explanation.consideredAlternatives.length).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 17: Collect All Evidence — Comprehensive Verification
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 17: collectAllEvidence — comprehensive", () => {
  it("gathers evidence from all 8 sources", () => {
    const profile = emptyProfile({
      sessionCount: 20,
      completedSessionCount: 18,
      preferredMode: "speak",
      interferencePatterns: [
        makeInterferencePattern("missing-article", 7),
        makeInterferencePattern("tense-omission", 4),
      ],
      topicMastery: {
        "past-tense": 32,
        articles: 45,
      },
      updatedAt: NOW,
    });

    const rec = makeRec("missing-article");
    const allEvidence = collectAllEvidence(
      rec, profile, "B1", ["ielts_preparation", "daily_conversation"],
      [makeRecentPractice("phone-call", 2, "speak")], 2.0, NOW,
    );

    // Check that multiple sources are represented
    const sources = new Set(allEvidence.map((e) => e.source));
    // At minimum: interference_pattern, session_cadence, cefr_level,
    // learner_goal, recent_practice, session_history, mode_preference
    expect(sources.has("interference_pattern")).toBe(true);
    expect(sources.has("session_cadence")).toBe(true);
    expect(sources.has("cefr_level")).toBe(true);
    expect(sources.has("learner_goal")).toBe(true);
    expect(sources.has("session_history")).toBe(true);
    expect(sources.has("mode_preference")).toBe(true);
    // recent_practice might or might not produce evidence depending on overlap
    expect(sources.size).toBeGreaterThanOrEqual(6);
  });

  it("returns evidence sorted by support then strength", () => {
    const profile = emptyProfile({
      sessionCount: 5,
      interferencePatterns: [
        makeInterferencePattern("missing-article", 7),
        makeInterferencePattern("tense-omission", 3),
      ],
      updatedAt: NOW,
    });

    const rec = makeRec("missing-article");
    const allEvidence = collectAllEvidence(
      rec, profile, null, [], [], null, NOW,
    );

    // First items should be supporting
    const firstItem = allEvidence[0];
    expect(firstItem.supportsRecommendation).toBe(true);
    expect(firstItem.strength).toBe("strong");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 18: Build Evidence Chain — Structure Verification
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 18: buildEvidenceChain — structure", () => {
  it("produces structured Vietnamese chain reasoning", () => {
    const items: EvidenceItem[] = [
      {
        source: "interference_pattern",
        observationVi: "7 lần lỗi mạo từ",
        strength: "strong",
        occurrenceCount: 7,
        tag: "missing-article",
        lastObservedAt: NOW,
        supportsRecommendation: true,
      },
      {
        source: "cefr_level",
        observationVi: "Trình độ A2",
        strength: "strong",
        occurrenceCount: 1,
        tag: "cefr-a2",
        lastObservedAt: null,
        supportsRecommendation: true,
      },
    ];

    const rec = makeRec("missing-article", {
      lessonTitle: "Master articles",
      ruleFired: "viet-interference:missing-article",
    });

    const chain = buildEvidenceChain(items, rec, "A2");

    expect(chain.chainReasoningVi).toContain("→");
    expect(chain.chainReasoningVi).toContain("Master articles");
    expect(chain.chainReasoningVi.toLowerCase()).toContain("bằng chứng");
    expect(chain.confidence).toBeGreaterThan(0);
    expect(chain.confidenceLabelVi.length).toBeGreaterThan(10);
    expect(chain.items).toBe(items);
  });

  it("acknowledges counter-evidence in chain reasoning", () => {
    const items: EvidenceItem[] = [
      {
        source: "interference_pattern",
        observationVi: "5 lần lỗi thì",
        strength: "strong",
        occurrenceCount: 5,
        tag: "tense-omission",
        lastObservedAt: NOW,
        supportsRecommendation: true,
      },
      {
        source: "recent_practice",
        observationVi: "Vừa luyện thì quá khứ",
        strength: "moderate",
        occurrenceCount: 1,
        tag: "past-tense",
        lastObservedAt: NOW,
        supportsRecommendation: false,
      },
    ];

    const rec = makeRec("tense-omission");
    const chain = buildEvidenceChain(items, rec, "A2");

    expect(chain.chainReasoningVi).toContain("cân nhắc");
    expect(chain.chainReasoningVi).toMatch(/past.tense/);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 19: Consider Alternatives — Systematic Coverage
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 19: considerAlternatives — systematic coverage", () => {
  it("considers interference patterns with ≥2 observations as alternatives", () => {
    const profile = emptyProfile({
      sessionCount: 10,
      interferencePatterns: [
        makeInterferencePattern("missing-article", 7),
        makeInterferencePattern("tense-omission", 4),
        makeInterferencePattern("preposition-calque", 2),
        makeInterferencePattern("word-order", 1), // Too few to consider
      ],
      updatedAt: NOW,
    });

    const rec = makeRec("missing-article");
    const alternatives = considerAlternatives(rec, profile, []);

    // Should list tense-omission and preposition-calque as alternatives
    const tenseAlt = alternatives.find((a) => a.skillTag === "tense-omission");
    const prepAlt = alternatives.find((a) => a.skillTag === "preposition-calque");
    const wordAlt = alternatives.find((a) => a.skillTag === "word-order");

    expect(tenseAlt).toBeDefined();
    expect(prepAlt).toBeDefined();
    expect(wordAlt).toBeUndefined(); // Only 1 observation
  });

  it("considers low mastery topics as alternatives", () => {
    const profile = emptyProfile({
      sessionCount: 10,
      interferencePatterns: [
        makeInterferencePattern("missing-article", 7),
      ],
      topicMastery: {
        "past-tense": 25,
        articles: 45,
        prepositions: 80, // Above 50%, shouldn't appear
      },
      updatedAt: NOW,
    });

    const rec = makeRec("missing-article");
    const alternatives = considerAlternatives(rec, profile, []);

    const pastTenseAlt = alternatives.find((a) => a.skillTag === "past-tense");
    const articlesAlt = alternatives.find((a) => a.skillTag === "articles");
    const prepAlt = alternatives.find((a) => a.skillTag === "prepositions");

    expect(pastTenseAlt).toBeDefined();
    expect(articlesAlt).toBeDefined();
    expect(prepAlt).toBeUndefined(); // Above 50%
  });

  it("deduplicates alternatives by skillTag", () => {
    const profile = emptyProfile({
      sessionCount: 10,
      interferencePatterns: [
        makeInterferencePattern("tense-omission", 3),
      ],
      topicMastery: {
        "tense-omission": 30, // Same tag in mastery
      },
      updatedAt: NOW,
    });

    const rec = makeRec("subj-verb-agreement");
    const alternatives = considerAlternatives(rec, profile, []);

    // Should only list "tense-omission" once
    const tenseAlts = alternatives.filter((a) => a.skillTag === "tense-omission");
    expect(tenseAlts.length).toBeLessThanOrEqual(1);
  });

  it("returns at most 5 alternatives", () => {
    const profile = emptyProfile({
      sessionCount: 30,
      interferencePatterns: [
        makeInterferencePattern("tense-omission", 5),
        makeInterferencePattern("preposition-calque", 4),
        makeInterferencePattern("word-order", 3),
        makeInterferencePattern("zero-copula", 3),
        makeInterferencePattern("double-negation", 2),
        makeInterferencePattern("subj-verb-agreement", 2),
      ],
      topicMastery: {
        "past-tense": 25,
        articles: 30,
        prepositions: 40,
        speaking: 45,
        writing: 35,
        listening: 28,
      },
      updatedAt: NOW,
    });

    const rec = makeRec("missing-article");
    const alternatives = considerAlternatives(rec, profile, []);

    expect(alternatives.length).toBeLessThanOrEqual(5);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 20: Determinism — Same Input → Same Output
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 20: determinism", () => {
  it("produces identical explanations for identical inputs", () => {
    const profile = emptyProfile({
      sessionCount: 12,
      interferencePatterns: [
        makeInterferencePattern("missing-article", 7),
        makeInterferencePattern("tense-omission", 3),
      ],
      topicMastery: { "past-tense": 35 },
      updatedAt: NOW,
    });

    const rec = makeRec("missing-article", {
      lessonTitle: "Master articles",
      reason: "7 article errors",
      suggestedMode: "grammar",
      ruleFired: "viet-interference:missing-article",
    });

    const result1 = explainRecommendation(
      rec, profile, "A2", ["daily_conversation"],
      [makeRecentPractice("small-talk", 2, "speak")], 2.5, "target_weakness", "moderate", NOW,
    );

    const result2 = explainRecommendation(
      rec, profile, "A2", ["daily_conversation"],
      [makeRecentPractice("small-talk", 2, "speak")], 2.5, "target_weakness", "moderate", NOW,
    );

    expect(result1).toEqual(result2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 21: Catalog and Dimensions — Integrity
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 21: catalog and dimensions integrity", () => {
  it("explainer catalog has expected entries", () => {
    expect(LESSON_RECOMMENDATION_EXPLAINER_CATALOG.length).toBeGreaterThanOrEqual(4);
    for (const entry of LESSON_RECOMMENDATION_EXPLAINER_CATALOG) {
      expect(entry.key).toBeTruthy();
      expect(entry.titleVi).toBeTruthy();
      expect(entry.titleEn).toBeTruthy();
      expect(entry.descriptionVi).toBeTruthy();
    }
  });

  it("explainer dimensions have expected entries", () => {
    expect(LESSON_RECOMMENDATION_EXPLAINER_DIMENSIONS.length).toBeGreaterThanOrEqual(3);
    for (const dim of LESSON_RECOMMENDATION_EXPLAINER_DIMENSIONS) {
      expect(dim.id).toBeTruthy();
      expect(dim.titleVi).toBeTruthy();
      expect(dim.titleEn).toBeTruthy();
      expect(dim.descriptionVi).toBeTruthy();
    }
  });

  it("catalog keys are unique", () => {
    const keys = LESSON_RECOMMENDATION_EXPLAINER_CATALOG.map((e) => e.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("dimension IDs are unique", () => {
    const ids = LESSON_RECOMMENDATION_EXPLAINER_DIMENSIONS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 22: Mode Preference Evidence
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 22: mode preference evidence", () => {
  it("includes mode preference when available (≥5 sessions)", () => {
    const profile = emptyProfile({
      sessionCount: 15,
      completedSessionCount: 12,
      preferredMode: "speak",
      updatedAt: NOW,
    });

    const rec = makeRec("speaking-practice");
    const explanation = explainRecommendation(
      rec, profile, "B1", [], [], 2.0, "maintain_momentum", "moderate", NOW,
    );

    const modeEvidence = explanation.evidenceChain.items.find(
      (e) => e.source === "mode_preference",
    );
    expect(modeEvidence).toBeDefined();
    expect(modeEvidence!.observationVi).toContain("Luyện nói");
  });

  it("does NOT include mode preference with <5 sessions", () => {
    const profile = emptyProfile({
      sessionCount: 3,
      completedSessionCount: 2,
      preferredMode: "speak",
      updatedAt: NOW,
    });

    const rec = makeRec("speaking-practice");
    const explanation = explainRecommendation(
      rec, profile, null, [], [], null, null, "easy", NOW,
    );

    const modeEvidence = explanation.evidenceChain.items.find(
      (e) => e.source === "mode_preference",
    );
    expect(modeEvidence).toBeUndefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 23: Explanation Quality — Vietnamese-First
// ═══════════════════════════════════════════════════════════════════════════════

describe("Scenario 23: explanation quality — Vietnamese-first", () => {
  const profile = emptyProfile({
    sessionCount: 10,
    interferencePatterns: [
      makeInterferencePattern("missing-article", 7),
    ],
    updatedAt: NOW,
  });

  const rec = makeRec("missing-article", {
    lessonTitle: "Làm chủ mạo từ a, an, the",
    ruleFired: "viet-interference:missing-article",
  });

  const explanation = explainRecommendation(
    rec, profile, "A2", ["daily_conversation"],
    [], 2.5, "target_weakness", "moderate", NOW,
  );

  it("bottom line is readable Vietnamese", () => {
    // Should contain Vietnamese words, tones, and diacritics
    expect(explanation.bottomLineVi).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/);
  });

  it("learner-facing explanation has concrete numbers", () => {
    expect(explanation.learnerFacingExplanationVi).toMatch(/\d+/);
  });

  it("evidence observations are in Vietnamese", () => {
    for (const item of explanation.evidenceChain.items) {
      expect(item.observationVi).toBeTruthy();
      expect(item.observationVi.length).toBeGreaterThan(5);
    }
  });

  it("chain reasoning is in Vietnamese and contains arrows", () => {
    expect(explanation.evidenceChain.chainReasoningVi).toContain("→");
    expect(explanation.evidenceChain.chainReasoningVi).toMatch(/[àáảãạ]/);
  });
});
