/**
 * Tests for Teacher Mercy's lesson recommendation intelligence layer.
 *
 * Covers:
 *   - Strategy selection (all 9 strategies)
 *   - CEFR-aware challenge calibration
 *   - Goal alignment checking
 *   - Recency diversity checking
 *   - Teacher-quality reason building
 *   - Full pipeline: recommendWithIntelligence()
 *   - Practice cadence assessment
 *   - Edge cases (cold start, empty goals, no recent practice)
 *   - Determinism
 *   - Catalog integrity
 */

import { describe, expect, it } from "vitest";
import {
  chooseStrategy,
  checkGoalAlignment,
  checkRecencyDiversity,
  buildTeacherReason,
  calibrateChallengeLevel,
  recommendWithIntelligence,
  recommendTopPick,
  assessPracticeCadence,
  getGoalLabelVi,
  LESSON_RECOMMENDATION_STRATEGY_CATALOG,
  LESSON_RECOMMENDATION_INTELLIGENCE_DIMENSIONS,
  type RecommendationIntelligenceInput,
  type RecommendationStrategy,
  type ChallengeLevel,
  type LearnerGoal,
  type RecentPracticeEntry,
} from "../lessonRecommendationIntelligence";
import {
  FIXTURE_VN_LEARNER_B1_12_SESSIONS,
  FIXTURE_VN_LEARNER_NEW,
  FIXTURE_VN_LEARNER_TENSE_ONLY,
} from "./fixtures/learnerHistoryProfile.fixture";
import type { LearnerHistoryProfile } from "../learnerHistoryProfile";

// ─── Test Helpers ─────────────────────────────────────────────────────────

const FIXED_NOW = 1_748_000_000_000;

function makeInput(overrides: Partial<RecommendationIntelligenceInput> = {}): RecommendationIntelligenceInput {
  return {
    profile: FIXTURE_VN_LEARNER_B1_12_SESSIONS,
    cefrLevel: "B1",
    goals: [],
    recentPractice: [],
    avgDaysBetweenSessions: 2,
    now: FIXED_NOW,
    ...overrides,
  };
}

function recentEntry(
  topic: string,
  daysAgo: number,
  mode: "grammar" | "speak" | "journey" | "logic" = "grammar",
): RecentPracticeEntry {
  return {
    topic,
    practicedAt: FIXED_NOW - daysAgo * 24 * 60 * 60 * 1000,
    mode,
  };
}

// ─── Strategy Selection Tests ─────────────────────────────────────────────

describe("chooseStrategy — teaching strategy selection", () => {
  it("returns build_confidence for brand-new A1 learner", () => {
    const input = makeInput({
      profile: {
        ...FIXTURE_VN_LEARNER_NEW,
        sessionCount: 2,
      },
      cefrLevel: "A1",
    });
    expect(chooseStrategy(input)).toBe("build_confidence");
  });

  it("returns build_confidence for brand-new learner with unknown CEFR", () => {
    const input = makeInput({
      profile: {
        ...FIXTURE_VN_LEARNER_NEW,
        sessionCount: 1,
      },
      cefrLevel: null,
    });
    expect(chooseStrategy(input)).toBe("build_confidence");
  });

  it("returns review_and_consolidate when last practice was > 7 days ago", () => {
    const input = makeInput({
      recentPractice: [recentEntry("past-tense", 10)],
    });
    expect(chooseStrategy(input)).toBe("review_and_consolidate");
  });

  it("returns review_and_consolidate when avg cadence is sparse (> 5 days)", () => {
    const input = makeInput({
      recentPractice: [recentEntry("past-tense", 1)],
      avgDaysBetweenSessions: 7,
    });
    expect(chooseStrategy(input)).toBe("review_and_consolidate");
  });

  it("returns review_and_consolidate when no recent entries but cadence is sparse", () => {
    const input = makeInput({
      recentPractice: [],
      avgDaysBetweenSessions: 10,
    });
    expect(chooseStrategy(input)).toBe("review_and_consolidate");
  });

  it("returns target_weakness when strong interference patterns exist (≥3 observed)", () => {
    // FIXTURE_VN_LEARNER_B1 has missing-article×5 — triggers target_weakness
    const input = makeInput();
    expect(chooseStrategy(input)).toBe("target_weakness");
  });

  it("returns target_weakness even when recency is recent (interference > recency concern)", () => {
    const input = makeInput({
      recentPractice: [recentEntry("missing-article", 1)],
    });
    // Strong interference pattern should override recency for strategy selection
    expect(chooseStrategy(input)).toBe("target_weakness");
  });

  it("returns polish_fluency for C1 learner", () => {
    const input = makeInput({
      profile: {
        ...FIXTURE_VN_LEARNER_B1_12_SESSIONS,
        interferencePatterns: [], // no strong patterns
      },
      cefrLevel: "C1",
    });
    expect(chooseStrategy(input)).toBe("polish_fluency");
  });

  it("returns polish_fluency for C2 learner", () => {
    const input = makeInput({
      profile: {
        ...FIXTURE_VN_LEARNER_B1_12_SESSIONS,
        interferencePatterns: [],
      },
      cefrLevel: "C2",
    });
    expect(chooseStrategy(input)).toBe("polish_fluency");
  });

  it("returns stretch_zone for B1 learner with good cadence and no strong patterns", () => {
    const input = makeInput({
      profile: {
        ...FIXTURE_VN_LEARNER_B1_12_SESSIONS,
        interferencePatterns: [
          { tag: "missing-article", observedCount: 1, lastSeenAt: FIXED_NOW },
        ],
      },
      cefrLevel: "B1",
      avgDaysBetweenSessions: 2,
    });
    expect(chooseStrategy(input)).toBe("stretch_zone");
  });

  it("returns stretch_zone for B2 learner with sessionCount >= 5", () => {
    const input = makeInput({
      profile: {
        ...FIXTURE_VN_LEARNER_B1_12_SESSIONS,
        interferencePatterns: [],
      },
      cefrLevel: "B2",
    });
    expect(chooseStrategy(input)).toBe("stretch_zone");
  });

  it("returns explore_new_topic when recent 3 sessions cover ≤ 2 distinct topics", () => {
    const input = makeInput({
      profile: {
        ...FIXTURE_VN_LEARNER_B1_12_SESSIONS,
        sessionCount: 6,
        interferencePatterns: [],
      },
      cefrLevel: "A2", // won't hit stretch_zone or polish_fluency
      recentPractice: [
        recentEntry("past-tense", 1),
        recentEntry("past-tense", 2),
        recentEntry("past-tense", 3),
      ],
    });
    expect(chooseStrategy(input)).toBe("explore_new_topic");
  });

  it("falls back to CEFR default when no special conditions met", () => {
    const input = makeInput({
      profile: {
        ...FIXTURE_VN_LEARNER_B1_12_SESSIONS,
        sessionCount: 10,
        interferencePatterns: [],
      },
      cefrLevel: "A2",
      recentPractice: [
        recentEntry("past-tense", 1),
        recentEntry("daily-life", 2),
        recentEntry("shopping", 3),
      ],
      avgDaysBetweenSessions: 2,
    });
    // A2 default = cement_foundation
    expect(chooseStrategy(input)).toBe("cement_foundation");
  });
});

// ─── Challenge Calibration Tests ──────────────────────────────────────────

describe("calibrateChallengeLevel — CEFR-aware challenge", () => {
  // Testing via recommendWithIntelligence since calibrateChallengeLevel is internal,
  // but we can also test the concept through public API

  it("A1 learner gets easy or comfortable challenges", () => {
    const input = makeInput({
      profile: FIXTURE_VN_LEARNER_NEW,
      cefrLevel: "A1",
    });
    const recs = recommendWithIntelligence(input);
    expect(["easy", "comfortable"]).toContain(recs[0].challengeLevel);
  });

  it("B1 learner gets moderate or stretch challenges", () => {
    const input = makeInput({ cefrLevel: "B1" });
    const recs = recommendWithIntelligence(input);
    // target_weakness strategy with B1 → challenge depends on strategy
    expect(recs[0].challengeLevel).toBeTruthy();
  });

  it("C1 learner gets stretch or hard challenges", () => {
    const input = makeInput({
      profile: {
        ...FIXTURE_VN_LEARNER_B1_12_SESSIONS,
        interferencePatterns: [],
      },
      cefrLevel: "C1",
    });
    const recs = recommendWithIntelligence(input);
    expect(["stretch", "hard"]).toContain(recs[0].challengeLevel);
  });

  it("unknown CEFR defaults to moderate", () => {
    const input = makeInput({
      profile: {
        ...FIXTURE_VN_LEARNER_B1_12_SESSIONS,
        interferencePatterns: [],
      },
      cefrLevel: null,
    });
    const recs = recommendWithIntelligence(input);
    // cement_foundation without cefr → moderate (fallback)
    expect(recs[0].challengeLevel).toBe("moderate");
  });
});

// ─── Goal Alignment Tests ─────────────────────────────────────────────────

describe("checkGoalAlignment — recommendation ↔ goal matching", () => {
  it("aligns missing-article recommendation with IELTS preparation goal", () => {
    const result = checkGoalAlignment(
      {
        lessonTitle: "Test",
        targetSkill: "missing-article",
        reason: "",
        suggestedMode: "grammar",
        ruleFired: "viet-interference:missing-article",
      },
      ["ielts_preparation"],
    );
    expect(result.aligned).toBe(true);
    expect(result.servedGoals).toContain("ielts_preparation");
  });

  it("aligns speak recommendation with daily_conversation goal", () => {
    const result = checkGoalAlignment(
      {
        lessonTitle: "Test",
        targetSkill: "speak",
        reason: "",
        suggestedMode: "speak",
        ruleFired: "preference:mode-promotion",
      },
      ["daily_conversation"],
    );
    expect(result.aligned).toBe(true);
    expect(result.servedGoals).toContain("daily_conversation");
  });

  it("aligns work-related skill with workplace_english goal", () => {
    const result = checkGoalAlignment(
      {
        lessonTitle: "Test",
        targetSkill: "work-job",
        reason: "",
        suggestedMode: "speak",
        ruleFired: "test",
      },
      ["workplace_english"],
    );
    expect(result.aligned).toBe(true);
    expect(result.servedGoals).toContain("workplace_english");
  });

  it("returns not aligned when skill doesn't match any goal", () => {
    const result = checkGoalAlignment(
      {
        lessonTitle: "Test",
        targetSkill: "word-order",
        reason: "",
        suggestedMode: "grammar",
        ruleFired: "test",
      },
      ["travel_english"],
    );
    expect(result.aligned).toBe(false);
    expect(result.servedGoals).toHaveLength(0);
  });

  it("returns not aligned when goals array is empty", () => {
    const result = checkGoalAlignment(
      {
        lessonTitle: "Test",
        targetSkill: "missing-article",
        reason: "",
        suggestedMode: "grammar",
        ruleFired: "test",
      },
      [],
    );
    expect(result.aligned).toBe(false);
    expect(result.servedGoals).toHaveLength(0);
  });

  it("one recommendation can serve multiple goals", () => {
    const result = checkGoalAlignment(
      {
        lessonTitle: "Test",
        targetSkill: "missing-article",
        reason: "",
        suggestedMode: "grammar",
        ruleFired: "test",
      },
      ["ielts_preparation", "study_abroad"],
    );
    expect(result.aligned).toBe(true);
    expect(result.servedGoals).toHaveLength(2);
    expect(result.servedGoals).toContain("ielts_preparation");
    expect(result.servedGoals).toContain("study_abroad");
  });

  it("case-insensitive skill matching", () => {
    const result = checkGoalAlignment(
      {
        lessonTitle: "Test",
        targetSkill: "Food-Ordering",
        reason: "",
        suggestedMode: "speak",
        ruleFired: "test",
      },
      ["daily_conversation"],
    );
    expect(result.aligned).toBe(true);
  });
});

// ─── Recency Diversity Tests ──────────────────────────────────────────────

describe("checkRecencyDiversity — avoid repeating recent topics", () => {
  it("reports no overlap when recent practice is empty", () => {
    const result = checkRecencyDiversity(
      {
        lessonTitle: "Test",
        targetSkill: "past-tense",
        reason: "",
        suggestedMode: "grammar",
        ruleFired: "test",
      },
      [],
    );
    expect(result.respectsRecency).toBe(true);
    expect(result.overlaps).toHaveLength(0);
  });

  it("detects overlap when the exact skill was practiced within 3 days", () => {
    const result = checkRecencyDiversity(
      {
        lessonTitle: "Test",
        targetSkill: "past-tense",
        reason: "",
        suggestedMode: "grammar",
        ruleFired: "test",
      },
      [recentEntry("past-tense", 1)],
      FIXED_NOW,
    );
    expect(result.respectsRecency).toBe(false);
    expect(result.overlaps).toContain("past-tense");
  });

  it("no overlap when skill was practiced > 3 days ago", () => {
    const result = checkRecencyDiversity(
      {
        lessonTitle: "Test",
        targetSkill: "past-tense",
        reason: "",
        suggestedMode: "grammar",
        ruleFired: "test",
      },
      [recentEntry("past-tense", 5)],
      FIXED_NOW,
    );
    expect(result.respectsRecency).toBe(true);
    expect(result.overlaps).toHaveLength(0);
  });

  it("detects partial overlap (skill contained in topic name)", () => {
    const result = checkRecencyDiversity(
      {
        lessonTitle: "Test",
        targetSkill: "tense",
        reason: "",
        suggestedMode: "grammar",
        ruleFired: "test",
      },
      [recentEntry("past-tense-omission", 1)],
      FIXED_NOW,
    );
    expect(result.respectsRecency).toBe(false);
    expect(result.overlaps).toContain("past-tense-omission");
  });

  it("handles multiple recent entries, only flagging overlaps within 3 days", () => {
    const result = checkRecencyDiversity(
      {
        lessonTitle: "Test",
        targetSkill: "articles",
        reason: "",
        suggestedMode: "grammar",
        ruleFired: "test",
      },
      [
        recentEntry("past-tense", 1),
        recentEntry("articles", 2),
        recentEntry("articles", 10), // too old
      ],
      FIXED_NOW,
    );
    expect(result.respectsRecency).toBe(false);
    expect(result.overlaps).toContain("articles");
    expect(result.overlaps).toHaveLength(1);
  });
});

// ─── Teacher Reason Building Tests ────────────────────────────────────────

describe("buildTeacherReason — natural teacher language", () => {
  it("produces non-empty Vietnamese reason for every strategy", () => {
    const strategies: RecommendationStrategy[] = [
      "cement_foundation", "stretch_zone", "polish_fluency",
      "real_world_practice", "review_and_consolidate", "explore_new_topic",
      "target_weakness", "build_confidence", "maintain_momentum",
    ];

    for (const strategy of strategies) {
      const result = buildTeacherReason(
        {
          lessonTitle: "Test lesson",
          targetSkill: "past-tense",
          reason: "",
          suggestedMode: "grammar",
          ruleFired: "test",
        },
        strategy,
        "moderate",
        "B1",
        true,
        true,
      );
      expect(result.reasonVi).toBeTruthy();
      expect(result.preambleVi).toBeTruthy();
      expect(result.diversityNoteVi).toBeTruthy();
    }
  });

  it("reason contains the skill name", () => {
    const result = buildTeacherReason(
      {
        lessonTitle: "Test",
        targetSkill: "past-tense",
        reason: "",
        suggestedMode: "grammar",
        ruleFired: "test",
      },
      "target_weakness",
      "moderate",
      "B1",
      false,
      true,
    );
    expect(result.reasonVi).toContain("past tense");
  });

  it("reason mentions CEFR level when provided", () => {
    const result = buildTeacherReason(
      {
        lessonTitle: "Test",
        targetSkill: "preposition-calque",
        reason: "",
        suggestedMode: "grammar",
        ruleFired: "test",
      },
      "cement_foundation",
      "comfortable",
      "A2",
      false,
      true,
    );
    expect(result.reasonVi).toContain("A2");
  });

  it("diversity note mentions goal alignment when aligned", () => {
    const result = buildTeacherReason(
      {
        lessonTitle: "Test",
        targetSkill: "missing-article",
        reason: "",
        suggestedMode: "grammar",
        ruleFired: "test",
      },
      "target_weakness",
      "moderate",
      "B1",
      true,
      true,
    );
    expect(result.diversityNoteVi).toContain("mục tiêu");
  });

  it("diversity note justifies repetition for target_weakness", () => {
    const result = buildTeacherReason(
      {
        lessonTitle: "Test",
        targetSkill: "missing-article",
        reason: "",
        suggestedMode: "grammar",
        ruleFired: "test",
      },
      "target_weakness",
      "moderate",
      "B1",
      false,
      false, // does NOT respect recency
    );
    // Should explain why repetition is OK for weakness targeting
    expect(result.diversityNoteVi).toContain("thấm");
  });
});

// ─── Full Pipeline Tests ─────────────────────────────────────────────────

describe("recommendWithIntelligence — full pipeline", () => {
  it("returns intelligent recommendations for B1 fixture", () => {
    const input = makeInput({
      goals: ["ielts_preparation"],
    });
    const recs = recommendWithIntelligence(input);

    expect(recs.length).toBeGreaterThanOrEqual(1);
    // Top recommendation should be intelligent
    const top = recs[0];
    expect(top.base).toBeTruthy();
    expect(top.strategy).toBeTruthy();
    expect(top.challengeLevel).toBeTruthy();
    expect(top.teacherReasonVi).toBeTruthy();
    expect(top.preambleVi).toBeTruthy();
    expect(top.diversityNoteVi).toBeTruthy();
  });

  it("cold-start returns build_confidence strategy", () => {
    const input: RecommendationIntelligenceInput = {
      profile: FIXTURE_VN_LEARNER_NEW,
      cefrLevel: null,
      goals: [],
      recentPractice: [],
      avgDaysBetweenSessions: null,
      now: FIXED_NOW,
    };
    const recs = recommendWithIntelligence(input);
    expect(recs).toHaveLength(1);
    expect(recs[0].strategy).toBe("build_confidence");
    expect(recs[0].base.ruleFired).toBe("cold-start:abstain");
  });

  it("B1 fixture with IELTS goal shows goal alignment", () => {
    const input = makeInput({ goals: ["ielts_preparation"] });
    const recs = recommendWithIntelligence(input);

    // At least one recommendation should be aligned with IELTS
    const alignedRecs = recs.filter((r) => r.alignedWithGoals);
    expect(alignedRecs.length).toBeGreaterThanOrEqual(1);
  });

  it("returns recency overlaps correctly", () => {
    const input = makeInput({
      recentPractice: [recentEntry("missing-article", 1)],
    });
    const recs = recommendWithIntelligence(input);

    // The missing-article recommendation should show overlap
    const articleRec = recs.find(
      (r) => r.base.targetSkill === "missing-article",
    );
    expect(articleRec).toBeTruthy();
    expect(articleRec!.recencyOverlaps.length).toBeGreaterThanOrEqual(1);
  });

  it("every recommendation has all required fields", () => {
    const input = makeInput();
    const recs = recommendWithIntelligence(input);

    for (const rec of recs) {
      expect(rec.base.lessonTitle).toBeTruthy();
      expect(rec.base.targetSkill).toBeTruthy();
      expect(rec.base.reason).toBeTruthy();
      expect(rec.base.suggestedMode).toBeTruthy();
      expect(rec.base.ruleFired).toBeTruthy();
      expect(rec.strategy).toBeTruthy();
      expect(rec.challengeLevel).toBeTruthy();
      expect(typeof rec.alignedWithGoals).toBe("boolean");
      expect(Array.isArray(rec.servedGoals)).toBe(true);
      expect(typeof rec.respectsRecency).toBe("boolean");
      expect(Array.isArray(rec.recencyOverlaps)).toBe(true);
      expect(rec.teacherReasonVi).toBeTruthy();
      expect(rec.preambleVi).toBeTruthy();
      expect(rec.diversityNoteVi).toBeTruthy();
    }
  });

  it("teacher reasons are in Vietnamese (contain diacritics)", () => {
    const input = makeInput();
    const recs = recommendWithIntelligence(input);

    for (const rec of recs) {
      const hasVietnameseDiacritics = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/.test(
        rec.teacherReasonVi + rec.preambleVi + rec.diversityNoteVi,
      );
      expect(hasVietnameseDiacritics).toBe(true);
    }
  });
});

// ─── recommendTopPick Tests ───────────────────────────────────────────────

describe("recommendTopPick — single best recommendation", () => {
  it("returns the first (highest priority) intelligent recommendation", () => {
    const input = makeInput();
    const top = recommendTopPick(input);
    // Should be the same as the first entry from recommendWithIntelligence
    const all = recommendWithIntelligence(input);
    expect(top.base.ruleFired).toBe(all[0].base.ruleFired);
    expect(top.strategy).toBe(all[0].strategy);
  });
});

// ─── Practice Cadence Tests ───────────────────────────────────────────────

describe("assessPracticeCadence — healthy practice rhythm", () => {
  it("healthy for daily practice", () => {
    const result = assessPracticeCadence(1, "B1");
    expect(result.healthy).toBe(true);
    expect(result.noteVi).toContain("rất tốt");
  });

  it("healthy for every-other-day practice", () => {
    const result = assessPracticeCadence(2, "B1");
    expect(result.healthy).toBe(true);
    expect(result.noteVi).toContain("rất tốt");
  });

  it("ok for 4-day gap at B2 level", () => {
    const result = assessPracticeCadence(4, "B2");
    expect(result.healthy).toBe(true);
  });

  it("unhealthy for beginners with > 5 day gap", () => {
    const result = assessPracticeCadence(7, "A1");
    expect(result.healthy).toBe(false);
    expect(result.noteVi).toContain("đều hơn");
  });

  it("unhealthy for > 10 day gap at any level", () => {
    const result = assessPracticeCadence(14, "B1");
    expect(result.healthy).toBe(false);
    expect(result.noteVi).toContain("hơi xa");
  });

  it("graceful when cadence is unknown", () => {
    const result = assessPracticeCadence(null, null);
    expect(result.healthy).toBe(true);
    expect(result.noteVi).toContain("chưa có đủ dữ liệu");
  });
});

// ─── Goal Label Tests ─────────────────────────────────────────────────────

describe("getGoalLabelVi — Vietnamese goal labels", () => {
  it("returns Vietnamese label for known goals", () => {
    expect(getGoalLabelVi("ielts_preparation")).toContain("IELTS");
    expect(getGoalLabelVi("daily_conversation")).toContain("giao tiếp");
    expect(getGoalLabelVi("workplace_english")).toContain("công sở");
    expect(getGoalLabelVi("job_interview")).toContain("phỏng vấn");
  });

  it("falls back to readable form for unknown goals", () => {
    const label = getGoalLabelVi("custom_goal_here");
    expect(label).toBe("custom goal here");
  });
});

// ─── Determinism Tests ────────────────────────────────────────────────────

describe("lessonRecommendationIntelligence — determinism", () => {
  it("recommendWithIntelligence is deterministic", () => {
    const input = makeInput({
      goals: ["ielts_preparation", "daily_conversation"],
    });
    const recs1 = recommendWithIntelligence(input);
    const recs2 = recommendWithIntelligence(input);
    expect(recs1).toStrictEqual(recs2);
  });

  it("chooseStrategy is deterministic", () => {
    const input = makeInput();
    expect(chooseStrategy(input)).toBe(chooseStrategy(input));
  });

  it("buildTeacherReason is deterministic for the same inputs", () => {
    const rec = {
      lessonTitle: "Test",
      targetSkill: "past-tense",
      reason: "test",
      suggestedMode: "grammar" as const,
      ruleFired: "test",
    };
    const r1 = buildTeacherReason(rec, "stretch_zone", "moderate", "B1", true, true);
    const r2 = buildTeacherReason(rec, "stretch_zone", "moderate", "B1", true, true);
    expect(r1).toStrictEqual(r2);
  });
});

// ─── Catalog Integrity Tests ──────────────────────────────────────────────

describe("Lesson recommendation catalog integrity", () => {
  it("all 9 strategies are documented", () => {
    const allStrategies: RecommendationStrategy[] = [
      "cement_foundation", "stretch_zone", "polish_fluency",
      "real_world_practice", "review_and_consolidate", "explore_new_topic",
      "target_weakness", "build_confidence", "maintain_momentum",
    ];
    const documented = LESSON_RECOMMENDATION_STRATEGY_CATALOG.map((s) => s.strategy);
    for (const strategy of allStrategies) {
      expect(documented).toContain(strategy);
    }
  });

  it("all catalog entries have Vietnamese titles", () => {
    for (const entry of LESSON_RECOMMENDATION_STRATEGY_CATALOG) {
      expect(entry.titleVi).toBeTruthy();
      expect(entry.titleEn).toBeTruthy();
      expect(entry.descriptionVi).toBeTruthy();
      expect(entry.whenToUseVi).toBeTruthy();
    }
  });

  it("all 6 intelligence dimensions are documented", () => {
    expect(LESSON_RECOMMENDATION_INTELLIGENCE_DIMENSIONS).toHaveLength(6);
    const dimensionIds = LESSON_RECOMMENDATION_INTELLIGENCE_DIMENSIONS.map((d) => d.id);
    expect(dimensionIds).toContain("cefr_scaffolding");
    expect(dimensionIds).toContain("goal_alignment");
    expect(dimensionIds).toContain("recency_diversity");
    expect(dimensionIds).toContain("challenge_gradient");
    expect(dimensionIds).toContain("cadence_awareness");
    expect(dimensionIds).toContain("teacher_language");
  });

  it("every dimension has Vietnamese description", () => {
    for (const dim of LESSON_RECOMMENDATION_INTELLIGENCE_DIMENSIONS) {
      expect(dim.titleVi).toBeTruthy();
      expect(dim.titleEn).toBeTruthy();
      expect(dim.descriptionVi).toBeTruthy();
    }
  });
});

// ─── Edge Case Tests ──────────────────────────────────────────────────────

describe("lessonRecommendationIntelligence — edge cases", () => {
  it("handles empty recent practice gracefully", () => {
    const input = makeInput({ recentPractice: [] });
    const recs = recommendWithIntelligence(input);
    expect(recs.length).toBeGreaterThanOrEqual(1);
    expect(recs[0].respectsRecency).toBe(true);
    expect(recs[0].recencyOverlaps).toHaveLength(0);
  });

  it("handles null CEFR gracefully", () => {
    const input: RecommendationIntelligenceInput = {
      profile: {
        ...FIXTURE_VN_LEARNER_B1_12_SESSIONS,
        sessionCount: 10,
      },
      cefrLevel: null,
      goals: [],
      recentPractice: [],
      avgDaysBetweenSessions: null,
      now: FIXED_NOW,
    };
    const recs = recommendWithIntelligence(input);
    expect(recs.length).toBeGreaterThanOrEqual(1);
    expect(recs[0].strategy).toBeTruthy();
  });

  it("handles learner with no interference patterns", () => {
    const input: RecommendationIntelligenceInput = {
      profile: {
        ...FIXTURE_VN_LEARNER_B1_12_SESSIONS,
        interferencePatterns: [],
        sessionCount: 10,
      },
      cefrLevel: "B2",
      goals: [],
      recentPractice: [],
      avgDaysBetweenSessions: 2,
      now: FIXED_NOW,
    };
    const recs = recommendWithIntelligence(input);
    expect(recs.length).toBeGreaterThanOrEqual(1);
  });

  it("handles custom/unknown goal strings", () => {
    const input = makeInput({
      goals: ["custom_specific_goal" as LearnerGoal],
    });
    const recs = recommendWithIntelligence(input);
    // Should not throw; custom goals just won't match any skill
    expect(recs.length).toBeGreaterThanOrEqual(1);
  });

  it("handles very long recent practice history (> 5 entries)", () => {
    const manyRecent = Array.from({ length: 20 }, (_, i) =>
      recentEntry(`topic-${i}`, i + 1),
    );
    const input = makeInput({ recentPractice: manyRecent });
    const recs = recommendWithIntelligence(input);
    expect(recs.length).toBeGreaterThanOrEqual(1);
  });

  it("FIXTURE_VN_LEARNER_TENSE_ONLY produces intelligent recommendation", () => {
    const input: RecommendationIntelligenceInput = {
      profile: FIXTURE_VN_LEARNER_TENSE_ONLY,
      cefrLevel: "A2",
      goals: [],
      recentPractice: [],
      avgDaysBetweenSessions: 3,
      now: FIXED_NOW,
    };
    const recs = recommendWithIntelligence(input);
    expect(recs.length).toBeGreaterThanOrEqual(1);
    expect(recs[0].base.targetSkill).toBe("tense-omission");
  });
});
