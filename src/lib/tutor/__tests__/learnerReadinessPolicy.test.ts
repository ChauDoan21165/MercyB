import { describe, expect, it } from "vitest";
import {
  decideLearnerReadiness,
  isLearnerReady,
  isPrerequisiteWorkNeeded,
  isRetryLater,
  isDifferentApproachNeeded,
  shouldSkipAhead,
  isReadinessDeferred,
  LEARNER_READINESS_DECISION_CATALOG,
  LEARNER_READINESS_REASON_CODE_CATALOG,
  type LearnerReadinessInput,
  type LearnerReadinessResult,
  type ReadinessDecision,
} from "../learnerReadinessPolicy";

// ─── Test Fixtures ──────────────────────────────────────────────────────────

function defaultInput(
  overrides: Partial<LearnerReadinessInput> = {},
): LearnerReadinessInput {
  return {
    cefrLevel: "B1",
    prerequisiteMasteryRatio: 0.85,
    prerequisiteErrorRate: 0.1,
    turnsSinceLastLessonAttempt: Infinity,
    lessonAttemptsThisSession: 0,
    lessonTargetMasteryEstimate: 0.3,
    consecutiveCorrectTurns: 4,
    recurringPrerequisiteStruggles: [],
    learnerConfidence: "normal",
    isShowingFrustration: false,
    totalTurnsInSession: 12,
    showedProgressOnLastAttempt: false,
    ...overrides,
  };
}

// ─── R1 — Prerequisite Deficiency Gate ──────────────────────────────────────

describe("R1 — Prerequisite deficiency => NOT_READY_PREREQUISITE", () => {
  it("blocks when prerequisite mastery is below 70% (severe, <50%)", () => {
    const result = decideLearnerReadiness(
      defaultInput({ prerequisiteMasteryRatio: 0.3 }),
    );
    expect(result.decision).toBe("NOT_READY_PREREQUISITE");
    expect(result.reasonCode).toBe("readiness_severe_prerequisite_gap");
    expect(result.suggestWaitTurns).toBe(6);
  });

  it("blocks when prerequisite mastery is below 70% (moderate, 50-69%)", () => {
    const result = decideLearnerReadiness(
      defaultInput({ prerequisiteMasteryRatio: 0.55 }),
    );
    expect(result.decision).toBe("NOT_READY_PREREQUISITE");
    expect(result.reasonCode).toBe("readiness_moderate_prerequisite_gap");
    expect(result.suggestWaitTurns).toBe(3);
  });

  it("passes through when prerequisite mastery is ≥70%", () => {
    const result = decideLearnerReadiness(
      defaultInput({ prerequisiteMasteryRatio: 0.72 }),
    );
    expect(result.reasonCode).not.toBe("readiness_severe_prerequisite_gap");
    expect(result.reasonCode).not.toBe("readiness_moderate_prerequisite_gap");
  });

  it("includes gap skills when recurring struggles are present", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        prerequisiteMasteryRatio: 0.4,
        recurringPrerequisiteStruggles: ["past-tense", "subject-verb-agreement"],
      }),
    );
    expect(result.prerequisiteGapSkills).toEqual([
      "past-tense",
      "subject-verb-agreement",
    ]);
  });

  it("does not include gap skills when struggles list is empty", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        prerequisiteMasteryRatio: 0.4,
        recurringPrerequisiteStruggles: [],
      }),
    );
    expect(result.prerequisiteGapSkills).toBeUndefined();
  });
});

// ─── R2 — Prerequisite Error Spike Gate ─────────────────────────────────────

describe("R2 — Prerequisite error spike => NOT_READY_PREREQUISITE", () => {
  it("blocks B1 learner when prerequisite error rate ≥50%", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        prerequisiteMasteryRatio: 0.8,
        prerequisiteErrorRate: 0.55,
        cefrLevel: "B1",
      }),
    );
    expect(result.decision).toBe("NOT_READY_PREREQUISITE");
    expect(result.reasonCode).toBe("readiness_prerequisite_error_spike");
  });

  it("blocks beginner (A2) at lower threshold (≥40%)", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        prerequisiteMasteryRatio: 0.75,
        prerequisiteErrorRate: 0.42,
        cefrLevel: "A2",
      }),
    );
    expect(result.decision).toBe("NOT_READY_PREREQUISITE");
    expect(result.reasonCode).toBe("readiness_prerequisite_error_spike");
  });

  it("blocks beginner (A1) at lower threshold (≥40%)", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        prerequisiteMasteryRatio: 0.75,
        prerequisiteErrorRate: 0.45,
        cefrLevel: "A1",
      }),
    );
    expect(result.decision).toBe("NOT_READY_PREREQUISITE");
    expect(result.reasonCode).toBe("readiness_prerequisite_error_spike");
  });

  it("passes through B1 learner at 49% error rate", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        prerequisiteMasteryRatio: 0.8,
        prerequisiteErrorRate: 0.49,
        cefrLevel: "B1",
      }),
    );
    expect(result.reasonCode).not.toBe("readiness_prerequisite_error_spike");
  });

  it("passes through beginner at 39% error rate", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        prerequisiteMasteryRatio: 0.75,
        prerequisiteErrorRate: 0.39,
        cefrLevel: "A1",
      }),
    );
    expect(result.reasonCode).not.toBe("readiness_prerequisite_error_spike");
  });

  it("passes through when error rate is well below threshold", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        prerequisiteMasteryRatio: 0.8,
        prerequisiteErrorRate: 0.15,
      }),
    );
    expect(result.reasonCode).not.toBe("readiness_prerequisite_error_spike");
  });

  it("includes gap skills from recurring struggles", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        prerequisiteMasteryRatio: 0.8,
        prerequisiteErrorRate: 0.6,
        recurringPrerequisiteStruggles: ["prepositions"],
      }),
    );
    expect(result.prerequisiteGapSkills).toEqual(["prepositions"]);
  });
});

// ─── R3 — Too Soon After Failed Attempt Gate ────────────────────────────────

describe("R3 — Too soon after failed attempt => NOT_READY_TOO_SOON", () => {
  it("blocks when <4 turns since last failed attempt (no progress)", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        turnsSinceLastLessonAttempt: 2,
        lessonAttemptsThisSession: 2,
        showedProgressOnLastAttempt: false,
      }),
    );
    expect(result.decision).toBe("NOT_READY_TOO_SOON");
    expect(result.reasonCode).toBe("readiness_too_soon_after_failure");
    expect(result.suggestWaitTurns).toBe(2);
  });

  it("blocks when <2 turns since last attempt with progress shown", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        turnsSinceLastLessonAttempt: 1,
        lessonAttemptsThisSession: 1,
        showedProgressOnLastAttempt: true,
      }),
    );
    expect(result.decision).toBe("NOT_READY_TOO_SOON");
    expect(result.reasonCode).toBe("readiness_too_soon_progressing");
    expect(result.suggestWaitTurns).toBe(1);
  });

  it("passes through at ≥4 turns without progress", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        turnsSinceLastLessonAttempt: 4,
        lessonAttemptsThisSession: 1,
        showedProgressOnLastAttempt: false,
      }),
    );
    expect(result.reasonCode).not.toBe("readiness_too_soon_after_failure");
  });

  it("passes through at ≥2 turns with progress", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        turnsSinceLastLessonAttempt: 2,
        lessonAttemptsThisSession: 1,
        showedProgressOnLastAttempt: true,
      }),
    );
    expect(result.reasonCode).not.toBe("readiness_too_soon_progressing");
  });

  it("passes through when lesson has never been attempted", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        turnsSinceLastLessonAttempt: Infinity,
        lessonAttemptsThisSession: 0,
      }),
    );
    expect(result.reasonCode).not.toBe("readiness_too_soon_after_failure");
    expect(result.reasonCode).not.toBe("readiness_too_soon_progressing");
  });

  it("blocks with correct wait suggestion when 3 turns remain", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        turnsSinceLastLessonAttempt: 1,
        lessonAttemptsThisSession: 1,
        showedProgressOnLastAttempt: false,
      }),
    );
    expect(result.suggestWaitTurns).toBe(3);
  });
});

// ─── R4 — Lesson Attempt Saturation Gate ────────────────────────────────────

describe("R4 — Lesson attempt saturation => NOT_READY_DIFFERENT_APPROACH", () => {
  it("blocks when ≥3 attempts without progress", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        lessonAttemptsThisSession: 3,
        showedProgressOnLastAttempt: false,
      }),
    );
    expect(result.decision).toBe("NOT_READY_DIFFERENT_APPROACH");
    expect(result.reasonCode).toBe("readiness_lesson_attempt_saturation");
    expect(result.suggestWaitTurns).toBe(8);
  });

  it("blocks at 5 attempts without progress", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        lessonAttemptsThisSession: 5,
        showedProgressOnLastAttempt: false,
      }),
    );
    expect(result.decision).toBe("NOT_READY_DIFFERENT_APPROACH");
    expect(result.reasonCode).toBe("readiness_lesson_attempt_saturation");
  });

  it("passes through at 3+ attempts WITH progress", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        lessonAttemptsThisSession: 4,
        showedProgressOnLastAttempt: true,
      }),
    );
    expect(result.reasonCode).not.toBe("readiness_lesson_attempt_saturation");
  });

  it("passes through at <3 attempts without progress", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        lessonAttemptsThisSession: 2,
        showedProgressOnLastAttempt: false,
      }),
    );
    expect(result.reasonCode).not.toBe("readiness_lesson_attempt_saturation");
  });

  it("passes through when no attempts made yet", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        lessonAttemptsThisSession: 0,
        showedProgressOnLastAttempt: false,
      }),
    );
    expect(result.reasonCode).not.toBe("readiness_lesson_attempt_saturation");
  });
});

// ─── R5 — Beginner Foundational Gate ─────────────────────────────────────────

describe("R5 — Beginner foundational => NOT_READY_PREREQUISITE / NOT_READY_TOO_SOON", () => {
  it("blocks beginner at 60% prerequisite mastery (60-69% gap zone)", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "A2",
        prerequisiteMasteryRatio: 0.6,
        prerequisiteErrorRate: 0.1,
      }),
    );
    expect(result.decision).toBe("NOT_READY_PREREQUISITE");
    expect(result.reasonCode).toBe("readiness_beginner_foundational_gap");
    expect(result.suggestWaitTurns).toBe(4);
  });

  it("blocks A1 beginner at 62% prerequisite mastery", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "A1",
        prerequisiteMasteryRatio: 0.62,
        prerequisiteErrorRate: 0.1,
      }),
    );
    expect(result.decision).toBe("NOT_READY_PREREQUISITE");
    expect(result.reasonCode).toBe("readiness_beginner_foundational_gap");
  });

  it("passes through beginner at ≥70% prerequisite mastery", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "A1",
        prerequisiteMasteryRatio: 0.72,
        prerequisiteErrorRate: 0.1,
      }),
    );
    expect(result.reasonCode).not.toBe("readiness_beginner_foundational_gap");
  });

  it("blocks beginner with <2 consecutive correct turns before first lesson attempt", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "A1",
        prerequisiteMasteryRatio: 0.75,
        consecutiveCorrectTurns: 1,
        totalTurnsInSession: 5,
        lessonAttemptsThisSession: 0,
      }),
    );
    expect(result.decision).toBe("NOT_READY_TOO_SOON");
    expect(result.reasonCode).toBe("readiness_beginner_need_stable_turns");
    expect(result.suggestWaitTurns).toBe(1);
  });

  it("blocks beginner with 0 consecutive correct turns before first lesson", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "A2",
        prerequisiteMasteryRatio: 0.8,
        consecutiveCorrectTurns: 0,
        totalTurnsInSession: 4,
        lessonAttemptsThisSession: 0,
      }),
    );
    expect(result.decision).toBe("NOT_READY_TOO_SOON");
    expect(result.reasonCode).toBe("readiness_beginner_need_stable_turns");
    expect(result.suggestWaitTurns).toBe(2);
  });

  it("passes beginner with ≥2 consecutive correct turns", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "A1",
        prerequisiteMasteryRatio: 0.75,
        consecutiveCorrectTurns: 2,
        totalTurnsInSession: 5,
        lessonAttemptsThisSession: 0,
      }),
    );
    expect(result.reasonCode).not.toBe("readiness_beginner_need_stable_turns");
  });

  it("does not check stable turns when session has <3 total turns", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "A1",
        prerequisiteMasteryRatio: 0.75,
        consecutiveCorrectTurns: 0,
        totalTurnsInSession: 1,
        lessonAttemptsThisSession: 0,
      }),
    );
    expect(result.reasonCode).not.toBe("readiness_beginner_need_stable_turns");
  });

  it("does not check stable turns when lesson already attempted", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "A1",
        prerequisiteMasteryRatio: 0.75,
        consecutiveCorrectTurns: 0,
        totalTurnsInSession: 5,
        lessonAttemptsThisSession: 1,
      }),
    );
    expect(result.reasonCode).not.toBe("readiness_beginner_need_stable_turns");
  });

  it("does not fire for non-beginner levels", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "B1",
        prerequisiteMasteryRatio: 0.55,
        consecutiveCorrectTurns: 0,
      }),
    );
    expect(result.reasonCode).not.toBe("readiness_beginner_foundational_gap");
    expect(result.reasonCode).not.toBe("readiness_beginner_need_stable_turns");
  });

  it("includes gap skills for beginner with recurring struggles", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "A1",
        prerequisiteMasteryRatio: 0.55,
        recurringPrerequisiteStruggles: ["be-verbs"],
      }),
    );
    expect(result.prerequisiteGapSkills).toEqual(["be-verbs"]);
  });
});

// ─── R6 — Struggle Pattern Gate ─────────────────────────────────────────────

describe("R6 — Struggle pattern => NOT_READY_PREREQUISITE", () => {
  it("blocks when ≥2 recurring prerequisite struggles", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        prerequisiteMasteryRatio: 0.8,
        recurringPrerequisiteStruggles: ["prepositions", "articles"],
      }),
    );
    expect(result.decision).toBe("NOT_READY_PREREQUISITE");
    expect(result.reasonCode).toBe("readiness_struggle_pattern_block");
    expect(result.prerequisiteGapSkills).toEqual([
      "prepositions",
      "articles",
    ]);
    expect(result.suggestWaitTurns).toBe(5);
  });

  it("blocks with 3+ recurring struggles", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        prerequisiteMasteryRatio: 0.8,
        recurringPrerequisiteStruggles: [
          "past-tense",
          "prepositions",
          "articles",
        ],
      }),
    );
    expect(result.decision).toBe("NOT_READY_PREREQUISITE");
    expect(result.reasonCode).toBe("readiness_struggle_pattern_block");
    expect(result.prerequisiteGapSkills).toHaveLength(3);
  });

  it("passes through with 0 recurring struggles", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        prerequisiteMasteryRatio: 0.8,
        recurringPrerequisiteStruggles: [],
      }),
    );
    expect(result.reasonCode).not.toBe("readiness_struggle_pattern_block");
  });

  it("passes through with 1 recurring struggle (default handles it)", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        prerequisiteMasteryRatio: 0.85,
        recurringPrerequisiteStruggles: ["prepositions"],
      }),
    );
    expect(result.reasonCode).not.toBe("readiness_struggle_pattern_block");
  });

  it("blocks with 2 struggles even when mastery is high", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        prerequisiteMasteryRatio: 0.9,
        recurringPrerequisiteStruggles: ["past-tense", "articles"],
      }),
    );
    expect(result.decision).toBe("NOT_READY_PREREQUISITE");
    expect(result.reasonCode).toBe("readiness_struggle_pattern_block");
  });
});

// ─── R7 — Frustration Gate ──────────────────────────────────────────────────

describe("R7 — Frustration => DEFER_READINESS_CHECK", () => {
  it("defers readiness check when learner is frustrated", () => {
    const result = decideLearnerReadiness(
      defaultInput({ isShowingFrustration: true }),
    );
    expect(result.decision).toBe("DEFER_READINESS_CHECK");
    expect(result.reasonCode).toBe("readiness_deferred_frustration");
    expect(result.deferTurns).toBe(4);
  });

  it("fires BEFORE R1 — frustration overrides prerequisite deficiency", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        isShowingFrustration: true,
        prerequisiteMasteryRatio: 0.2, // Severe gap, but frustration wins
      }),
    );
    expect(result.decision).toBe("DEFER_READINESS_CHECK");
    expect(result.reasonCode).toBe("readiness_deferred_frustration");
  });

  it("passes through when learner is not frustrated", () => {
    const result = decideLearnerReadiness(
      defaultInput({ isShowingFrustration: false }),
    );
    expect(result.reasonCode).not.toBe("readiness_deferred_frustration");
  });

  it("defers even for shy learners who are frustrated", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        isShowingFrustration: true,
        learnerConfidence: "shy",
      }),
    );
    expect(result.decision).toBe("DEFER_READINESS_CHECK");
  });

  it("defers even for confident learners who are frustrated", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        isShowingFrustration: true,
        learnerConfidence: "confident",
      }),
    );
    expect(result.decision).toBe("DEFER_READINESS_CHECK");
  });
});

// ─── R8 — Advanced Learner Acceleration Gate ────────────────────────────────

describe("R8 — Advanced learner acceleration => SKIP_AHEAD", () => {
  it("skips ahead for B2 learner with ≥85% mastery and ≥3 consecutive correct turns", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "B2",
        lessonTargetMasteryEstimate: 0.88,
        consecutiveCorrectTurns: 4,
      }),
    );
    expect(result.decision).toBe("SKIP_AHEAD");
    expect(result.reasonCode).toBe("readiness_advanced_accelerate");
    expect(result.suggestedNextTarget).toBe("next-lesson-in-sequence");
  });

  it("skips ahead for C1 learner with high mastery", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "C1",
        lessonTargetMasteryEstimate: 0.92,
        consecutiveCorrectTurns: 5,
      }),
    );
    expect(result.decision).toBe("SKIP_AHEAD");
    expect(result.reasonCode).toBe("readiness_advanced_accelerate");
  });

  it("skips ahead for C2 learner", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "C2",
        lessonTargetMasteryEstimate: 0.9,
        consecutiveCorrectTurns: 3,
      }),
    );
    expect(result.decision).toBe("SKIP_AHEAD");
    expect(result.reasonCode).toBe("readiness_advanced_accelerate");
  });

  it("does not skip B2 learner with <85% mastery", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "B2",
        lessonTargetMasteryEstimate: 0.7,
        consecutiveCorrectTurns: 5,
      }),
    );
    expect(result.reasonCode).not.toBe("readiness_advanced_accelerate");
  });

  it("does not skip B2 learner with <3 consecutive correct turns", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "B2",
        lessonTargetMasteryEstimate: 0.9,
        consecutiveCorrectTurns: 2,
      }),
    );
    expect(result.reasonCode).not.toBe("readiness_advanced_accelerate");
  });

  it("does not fire for B1 learners regardless of mastery", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "B1",
        lessonTargetMasteryEstimate: 0.95,
        consecutiveCorrectTurns: 10,
      }),
    );
    expect(result.reasonCode).not.toBe("readiness_advanced_accelerate");
  });

  it("does not fire for A2 learners with high mastery", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "A2",
        lessonTargetMasteryEstimate: 0.9,
        consecutiveCorrectTurns: 5,
      }),
    );
    expect(result.reasonCode).not.toBe("readiness_advanced_accelerate");
  });

  it("does not skip advanced learner who is frustrated (R7 fires first)", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "B2",
        lessonTargetMasteryEstimate: 0.9,
        consecutiveCorrectTurns: 5,
        isShowingFrustration: true,
      }),
    );
    expect(result.decision).toBe("DEFER_READINESS_CHECK");
    expect(result.reasonCode).not.toBe("readiness_advanced_accelerate");
  });
});

// ─── Default Fallback ───────────────────────────────────────────────────────

describe("Default — READY_NOW", () => {
  it("returns READY_NOW when all gates pass with no struggles", () => {
    const result = decideLearnerReadiness(defaultInput());
    expect(result.decision).toBe("READY_NOW");
    expect(result.reasonCode).toBe("readiness_ready");
  });

  it("returns READY_NOW with noted struggle when 1 recurring struggle + high mastery (≥80%)", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        prerequisiteMasteryRatio: 0.85,
        recurringPrerequisiteStruggles: ["prepositions"],
      }),
    );
    expect(result.decision).toBe("READY_NOW");
    expect(result.reasonCode).toBe("readiness_ready_noted_struggle");
    expect(result.prerequisiteGapSkills).toEqual(["prepositions"]);
  });

  it("uses noted-struggle code only when mastery ≥80%", () => {
    // At 79% mastery with 1 struggle, other gates may fire first.
    // If they don't, the default should still handle it cleanly.
    const result = decideLearnerReadiness(
      defaultInput({
        prerequisiteMasteryRatio: 0.79,
        recurringPrerequisiteStruggles: ["prepositions"],
      }),
    );
    // With 79% mastery > R1 threshold of 70%, and only 1 struggle < R6 threshold of 2,
    // we fall through to default. Default checks for ≥80% which fails.
    // So we get plain ready (no noted struggle).
    expect(result.decision).toBe("READY_NOW");
    expect(result.reasonCode).toBe("readiness_ready");
    expect(result.prerequisiteGapSkills).toBeUndefined();
  });

  it("returns READY_NOW for a well-prepared learner with all strong signals", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "B1",
        prerequisiteMasteryRatio: 0.95,
        prerequisiteErrorRate: 0.05,
        turnsSinceLastLessonAttempt: 20,
        lessonAttemptsThisSession: 0,
        lessonTargetMasteryEstimate: 0.2,
        consecutiveCorrectTurns: 6,
        recurringPrerequisiteStruggles: [],
        isShowingFrustration: false,
      }),
    );
    expect(result.decision).toBe("READY_NOW");
    expect(result.reasonCode).toBe("readiness_ready");
  });
});

// ─── Gate Ordering ──────────────────────────────────────────────────────────

describe("Gate ordering — first non-null result wins", () => {
  it("R7 (frustration) fires before R1 (prerequisite deficiency)", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        isShowingFrustration: true,
        prerequisiteMasteryRatio: 0.2,
      }),
    );
    expect(result.decision).toBe("DEFER_READINESS_CHECK");
    expect(result.reasonCode).toBe("readiness_deferred_frustration");
  });

  it("R7 fires before R3 (too soon after attempt)", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        isShowingFrustration: true,
        turnsSinceLastLessonAttempt: 1,
        lessonAttemptsThisSession: 1,
        showedProgressOnLastAttempt: false,
      }),
    );
    expect(result.decision).toBe("DEFER_READINESS_CHECK");
  });

  it("R1 fires before R3 when both conditions met (and no frustration)", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        prerequisiteMasteryRatio: 0.3,
        turnsSinceLastLessonAttempt: 1,
        lessonAttemptsThisSession: 1,
      }),
    );
    expect(result.decision).toBe("NOT_READY_PREREQUISITE");
    expect(result.reasonCode).toBe("readiness_severe_prerequisite_gap");
  });

  it("R5 fires before R2 when beginner in 50-69% gap zone with error spike", () => {
    // R5 is the more specific gate (beginners, 50-69% gap zone) and fires first.
    // R2 would also fire (error rate ≥40% for beginners) but R5 wins.
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "A2",
        prerequisiteMasteryRatio: 0.65,
        prerequisiteErrorRate: 0.45,
      }),
    );
    expect(result.reasonCode).toBe("readiness_beginner_foundational_gap");
  });

  it("R2 fires for beginner with error spike when mastery is ≥70% (R5 passes)", () => {
    // R5 passes (mastery ≥70%), R2 catches the error spike
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "A1",
        prerequisiteMasteryRatio: 0.75,
        prerequisiteErrorRate: 0.5,
      }),
    );
    expect(result.reasonCode).toBe("readiness_prerequisite_error_spike");
  });

  it("R3 fires before R4 when both conditions met", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        turnsSinceLastLessonAttempt: 1,
        lessonAttemptsThisSession: 3,
        showedProgressOnLastAttempt: false,
      }),
    );
    expect(result.decision).toBe("NOT_READY_TOO_SOON");
    expect(result.reasonCode).toBe("readiness_too_soon_after_failure");
  });

  it("R6 fires before R8 when advanced learner has struggle patterns", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "B2",
        lessonTargetMasteryEstimate: 0.9,
        consecutiveCorrectTurns: 5,
        recurringPrerequisiteStruggles: ["past-tense", "articles"],
      }),
    );
    // R6 blocks because ≥2 struggle patterns — acceleration shouldn't skip gaps
    expect(result.decision).toBe("NOT_READY_PREREQUISITE");
    expect(result.reasonCode).toBe("readiness_struggle_pattern_block");
  });

  it("R5 fires before R3 for beginner with <2 stable turns and recent attempt", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "A2",
        prerequisiteMasteryRatio: 0.75,
        consecutiveCorrectTurns: 0,
        totalTurnsInSession: 5,
        turnsSinceLastLessonAttempt: 2,
        lessonAttemptsThisSession: 0,
      }),
    );
    // R5 should fire because consecutiveCorrectTurns < 2 for beginner before first lesson
    expect(result.reasonCode).toBe("readiness_beginner_need_stable_turns");
  });
});

// ─── Convenience Helpers ────────────────────────────────────────────────────

describe("isLearnerReady", () => {
  it("returns true for READY_NOW", () => {
    expect(
      isLearnerReady({
        decision: "READY_NOW",
        reason: "",
        reasonCode: "readiness_ready",
      }),
    ).toBe(true);
  });

  it("returns true for SKIP_AHEAD", () => {
    expect(
      isLearnerReady({
        decision: "SKIP_AHEAD",
        reason: "",
        reasonCode: "readiness_advanced_accelerate",
      }),
    ).toBe(true);
  });

  it("returns false for NOT_READY_PREREQUISITE", () => {
    expect(
      isLearnerReady({
        decision: "NOT_READY_PREREQUISITE",
        reason: "",
        reasonCode: "readiness_moderate_prerequisite_gap",
      }),
    ).toBe(false);
  });

  it("returns false for NOT_READY_TOO_SOON", () => {
    expect(
      isLearnerReady({
        decision: "NOT_READY_TOO_SOON",
        reason: "",
        reasonCode: "readiness_too_soon_after_failure",
      }),
    ).toBe(false);
  });

  it("returns false for NOT_READY_DIFFERENT_APPROACH", () => {
    expect(
      isLearnerReady({
        decision: "NOT_READY_DIFFERENT_APPROACH",
        reason: "",
        reasonCode: "readiness_lesson_attempt_saturation",
      }),
    ).toBe(false);
  });

  it("returns false for DEFER_READINESS_CHECK", () => {
    expect(
      isLearnerReady({
        decision: "DEFER_READINESS_CHECK",
        reason: "",
        reasonCode: "readiness_deferred_frustration",
      }),
    ).toBe(false);
  });
});

describe("isPrerequisiteWorkNeeded", () => {
  it("returns true for NOT_READY_PREREQUISITE", () => {
    expect(
      isPrerequisiteWorkNeeded({
        decision: "NOT_READY_PREREQUISITE",
        reason: "",
        reasonCode: "readiness_severe_prerequisite_gap",
      }),
    ).toBe(true);
  });

  it("returns false for READY_NOW", () => {
    expect(
      isPrerequisiteWorkNeeded({
        decision: "READY_NOW",
        reason: "",
        reasonCode: "readiness_ready",
      }),
    ).toBe(false);
  });
});

describe("isRetryLater", () => {
  it("returns true for NOT_READY_TOO_SOON", () => {
    expect(
      isRetryLater({
        decision: "NOT_READY_TOO_SOON",
        reason: "",
        reasonCode: "readiness_too_soon_after_failure",
      }),
    ).toBe(true);
  });

  it("returns false for NOT_READY_PREREQUISITE", () => {
    expect(
      isRetryLater({
        decision: "NOT_READY_PREREQUISITE",
        reason: "",
        reasonCode: "readiness_moderate_prerequisite_gap",
      }),
    ).toBe(false);
  });
});

describe("isDifferentApproachNeeded", () => {
  it("returns true for NOT_READY_DIFFERENT_APPROACH", () => {
    expect(
      isDifferentApproachNeeded({
        decision: "NOT_READY_DIFFERENT_APPROACH",
        reason: "",
        reasonCode: "readiness_lesson_attempt_saturation",
      }),
    ).toBe(true);
  });

  it("returns false for NOT_READY_TOO_SOON", () => {
    expect(
      isDifferentApproachNeeded({
        decision: "NOT_READY_TOO_SOON",
        reason: "",
        reasonCode: "readiness_too_soon_after_failure",
      }),
    ).toBe(false);
  });
});

describe("shouldSkipAhead", () => {
  it("returns true for SKIP_AHEAD", () => {
    expect(
      shouldSkipAhead({
        decision: "SKIP_AHEAD",
        reason: "",
        reasonCode: "readiness_advanced_accelerate",
      }),
    ).toBe(true);
  });

  it("returns false for READY_NOW", () => {
    expect(
      shouldSkipAhead({
        decision: "READY_NOW",
        reason: "",
        reasonCode: "readiness_ready",
      }),
    ).toBe(false);
  });
});

describe("isReadinessDeferred", () => {
  it("returns true for DEFER_READINESS_CHECK", () => {
    expect(
      isReadinessDeferred({
        decision: "DEFER_READINESS_CHECK",
        reason: "",
        reasonCode: "readiness_deferred_frustration",
      }),
    ).toBe(true);
  });

  it("returns false for READY_NOW", () => {
    expect(
      isReadinessDeferred({
        decision: "READY_NOW",
        reason: "",
        reasonCode: "readiness_ready",
      }),
    ).toBe(false);
  });
});

// ─── Catalog Integrity ──────────────────────────────────────────────────────

describe("Catalog integrity", () => {
  it("every decision in the decision catalog has a corresponding reason code", () => {
    const decisionsInCatalog = new Set(
      LEARNER_READINESS_DECISION_CATALOG.map((c) => c.decision),
    );
    const decisionsInReasonCodes = new Set(
      LEARNER_READINESS_REASON_CODE_CATALOG.map((c) => c.decision),
    );

    for (const decision of decisionsInCatalog) {
      expect(decisionsInReasonCodes.has(decision)).toBe(true);
    }
  });

  it("every decision in the reason code catalog has a corresponding entry in the decision catalog", () => {
    const decisionsInCatalog = new Set(
      LEARNER_READINESS_DECISION_CATALOG.map((c) => c.decision),
    );
    const decisionsInReasonCodes = new Set(
      LEARNER_READINESS_REASON_CODE_CATALOG.map((c) => c.decision),
    );

    for (const decision of decisionsInReasonCodes) {
      expect(decisionsInCatalog.has(decision)).toBe(true);
    }
  });

  it("decision catalog has exactly 6 entries (one per ReadinessDecision)", () => {
    const allDecisions: ReadinessDecision[] = [
      "READY_NOW",
      "NOT_READY_PREREQUISITE",
      "NOT_READY_TOO_SOON",
      "NOT_READY_DIFFERENT_APPROACH",
      "SKIP_AHEAD",
      "DEFER_READINESS_CHECK",
    ];
    expect(LEARNER_READINESS_DECISION_CATALOG).toHaveLength(
      allDecisions.length,
    );
  });

  it("reason code catalog has entries covering all decision types", () => {
    const coveredDecisions = new Set(
      LEARNER_READINESS_REASON_CODE_CATALOG.map((c) => c.decision),
    );
    expect(coveredDecisions.has("READY_NOW")).toBe(true);
    expect(coveredDecisions.has("NOT_READY_PREREQUISITE")).toBe(true);
    expect(coveredDecisions.has("NOT_READY_TOO_SOON")).toBe(true);
    expect(coveredDecisions.has("NOT_READY_DIFFERENT_APPROACH")).toBe(true);
    expect(coveredDecisions.has("SKIP_AHEAD")).toBe(true);
    expect(coveredDecisions.has("DEFER_READINESS_CHECK")).toBe(true);
  });

  it("each catalog entry in decision catalog has required fields", () => {
    for (const entry of LEARNER_READINESS_DECISION_CATALOG) {
      expect(entry.decision).toBeTruthy();
      expect(entry.titleEn).toBeTruthy();
      expect(entry.titleVi).toBeTruthy();
      expect(entry.descriptionVi).toBeTruthy();
    }
  });

  it("each catalog entry in reason code catalog has required fields", () => {
    for (const entry of LEARNER_READINESS_REASON_CODE_CATALOG) {
      expect(entry.reasonCode).toBeTruthy();
      expect(entry.decision).toBeTruthy();
      expect(entry.descriptionVi).toBeTruthy();
    }
  });

  it("all reason codes are unique", () => {
    const codes = LEARNER_READINESS_REASON_CODE_CATALOG.map((c) => c.reasonCode);
    expect(new Set(codes).size).toBe(codes.length);
  });
});

// ─── Edge Cases ─────────────────────────────────────────────────────────────

describe("Edge cases", () => {
  it("handles null CEFR level (treated as beginner)", () => {
    // null CEFR → isBeginnerLevel returns true
    // With ≥40% prerequisite error rate, R2 should block
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: null,
        prerequisiteMasteryRatio: 0.75,
        prerequisiteErrorRate: 0.42,
      }),
    );
    expect(result.decision).toBe("NOT_READY_PREREQUISITE");
    expect(result.reasonCode).toBe("readiness_prerequisite_error_spike");
  });

  it("handles percentage boundary exactly at 70% mastery", () => {
    const result = decideLearnerReadiness(
      defaultInput({ prerequisiteMasteryRatio: 0.7 }),
    );
    // 0.7 is ≥ 0.7, so R1 passes
    expect(result.reasonCode).not.toBe("readiness_severe_prerequisite_gap");
    expect(result.reasonCode).not.toBe("readiness_moderate_prerequisite_gap");
  });

  it("handles percentage boundary exactly at 69% mastery", () => {
    const result = decideLearnerReadiness(
      defaultInput({ prerequisiteMasteryRatio: 0.69 }),
    );
    expect(result.decision).toBe("NOT_READY_PREREQUISITE");
  });

  it("handles exact 50% error rate for B1 learner (threshold)", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        prerequisiteMasteryRatio: 0.8,
        prerequisiteErrorRate: 0.5,
        cefrLevel: "B1",
      }),
    );
    expect(result.decision).toBe("NOT_READY_PREREQUISITE");
    expect(result.reasonCode).toBe("readiness_prerequisite_error_spike");
  });

  it("handles exact 40% error rate for beginner (threshold)", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "A2",
        prerequisiteMasteryRatio: 0.8,
        prerequisiteErrorRate: 0.4,
      }),
    );
    expect(result.decision).toBe("NOT_READY_PREREQUISITE");
    expect(result.reasonCode).toBe("readiness_prerequisite_error_spike");
  });

  it("handles exactly 85% lesson target mastery for B2", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "B2",
        lessonTargetMasteryEstimate: 0.85,
        consecutiveCorrectTurns: 3,
      }),
    );
    expect(result.decision).toBe("SKIP_AHEAD");
  });

  it("handles exactly 3 consecutive correct turns for B2 acceleration", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "B2",
        lessonTargetMasteryEstimate: 0.9,
        consecutiveCorrectTurns: 3,
      }),
    );
    expect(result.decision).toBe("SKIP_AHEAD");
  });

  it("handles exactly 2 consecutive correct turns at boundary", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "A1",
        prerequisiteMasteryRatio: 0.75,
        consecutiveCorrectTurns: 2,
        totalTurnsInSession: 5,
        lessonAttemptsThisSession: 0,
      }),
    );
    // 2 is ≥ 2, so should pass
    expect(result.reasonCode).not.toBe("readiness_beginner_need_stable_turns");
  });

  it("handles extreme values — 0% mastery, high error, frustrated", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        prerequisiteMasteryRatio: 0,
        prerequisiteErrorRate: 0.9,
        isShowingFrustration: true,
        recurringPrerequisiteStruggles: ["everything"],
      }),
    );
    // R7 frustration wins
    expect(result.decision).toBe("DEFER_READINESS_CHECK");
  });

  it("handles extreme values — 100% mastery, no errors, confident B2", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "B2",
        prerequisiteMasteryRatio: 1.0,
        prerequisiteErrorRate: 0,
        lessonTargetMasteryEstimate: 1.0,
        consecutiveCorrectTurns: 10,
        recurringPrerequisiteStruggles: [],
        isShowingFrustration: false,
      }),
    );
    expect(result.decision).toBe("SKIP_AHEAD");
  });

  it("handles Infinity turnsSinceLastLessonAttempt (never attempted)", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        turnsSinceLastLessonAttempt: Infinity,
        lessonAttemptsThisSession: 0,
      }),
    );
    // Should pass through R3 and reach default
    expect(result.decision).toBe("READY_NOW");
  });

  it("handles 0 total turns with beginner stable turns check", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        cefrLevel: "A1",
        prerequisiteMasteryRatio: 0.75,
        consecutiveCorrectTurns: 0,
        totalTurnsInSession: 0,
        lessonAttemptsThisSession: 0,
      }),
    );
    // totalTurnsInSession < 3, so beginner stable turns check is skipped
    expect(result.reasonCode).not.toBe("readiness_beginner_need_stable_turns");
  });

  it("shy learner with good prerequisites gets READY_NOW", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        learnerConfidence: "shy",
        prerequisiteMasteryRatio: 0.85,
      }),
    );
    expect(result.decision).toBe("READY_NOW");
  });

  it("confident learner with good prerequisites gets READY_NOW", () => {
    const result = decideLearnerReadiness(
      defaultInput({
        learnerConfidence: "confident",
        prerequisiteMasteryRatio: 0.85,
      }),
    );
    expect(result.decision).toBe("READY_NOW");
  });
});
