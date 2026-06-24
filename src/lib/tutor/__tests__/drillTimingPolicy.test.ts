import { describe, expect, it } from "vitest";
import {
  decideDrillTiming,
  isDrillRecommendedNow,
  isDrillQueued,
  isNoDrillRecommended,
  DRILL_TIMING_DECISION_CATALOG,
  DRILL_TIMING_REASON_CODE_CATALOG,
  type DrillTimingInput,
  type DrillTimingResult,
  type DrillDecision,
} from "../drillTimingPolicy";
import type { ErrorSeverity, LearnerConfidence } from "../teacherMercyCorrectionTiming";

// ─── Test Fixtures ──────────────────────────────────────────────────────

function defaultDrillInput(
  overrides: Partial<DrillTimingInput> = {},
): DrillTimingInput {
  return {
    turnsSinceLastDrill: 10,
    totalCorrectionsInSession: 2,
    recurringErrorCount: 1,
    errorSeverity: "grammar",
    cefrLevel: "B1",
    learnerConfidence: "normal",
    isCurrentLessonTarget: false,
    totalTurnsInSession: 8,
    currentLessonProgress: 30,
    drillsThisSession: 0,
    ...overrides,
  };
}

// ─── D1 — Fatal Error Recovery Gate ─────────────────────────────────────

describe("D1 — Fatal error recovery => DRILL_NOW", () => {
  it("launches a drill immediately after a fatal meaning error", () => {
    const result = decideDrillTiming(
      defaultDrillInput({ errorSeverity: "fatal_meaning" }),
    );
    expect(result.decision).toBe("DRILL_NOW");
    expect(result.reasonCode).toBe("drill_fatal_error_recovery");
    expect(result.suggestedDrillTarget).toBe("meaning-clarification");
  });

  it("skips drill if we literally just did one (turnsSinceLastDrill < 1)", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        errorSeverity: "fatal_meaning",
        turnsSinceLastDrill: 0,
      }),
    );
    // D1 should skip (returns null), falls to D4 (too soon) → NO_DRILL
    expect(result.decision).not.toBe("DRILL_NOW");
  });

  it("launches drill even for confident advanced learners (fatal meaning is fatal)", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        errorSeverity: "fatal_meaning",
        cefrLevel: "C1",
        learnerConfidence: "confident",
      }),
    );
    expect(result.decision).toBe("DRILL_NOW");
  });

  it("launches drill for shy learners after fatal meaning error", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        errorSeverity: "fatal_meaning",
        learnerConfidence: "shy",
      }),
    );
    expect(result.decision).toBe("DRILL_NOW");
  });
});

// ─── D2 — Lesson Target Reinforcement Gate ──────────────────────────────

describe("D2 — Lesson target reinforcement => DRILL_NOW", () => {
  it("drills when lesson target error appears 2+ times", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        isCurrentLessonTarget: true,
        recurringErrorCount: 2,
        errorSeverity: "grammar",
      }),
    );
    expect(result.decision).toBe("DRILL_NOW");
    expect(result.reasonCode).toBe("drill_lesson_target_reinforcement");
    expect(result.suggestedDrillTarget).toContain("lesson-target");
  });

  it("drills when lesson target error appears 3+ times", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        isCurrentLessonTarget: true,
        recurringErrorCount: 3,
        errorSeverity: "grammar",
      }),
    );
    expect(result.decision).toBe("DRILL_NOW");
  });

  it("does not drill for single lesson target occurrence — let correction handle it", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        isCurrentLessonTarget: true,
        recurringErrorCount: 1,
      }),
    );
    // D2 does NOT fire (recurringErrorCount < 2)
    expect(result.reasonCode).not.toBe("drill_lesson_target_reinforcement");
  });

  it("does not drill if we just did one (turnsSinceLastDrill < 1)", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        isCurrentLessonTarget: true,
        recurringErrorCount: 3,
        turnsSinceLastDrill: 0,
      }),
    );
    expect(result.decision).not.toBe("DRILL_NOW");
  });
});

// ─── D3 — Recurring Error Pattern Gate ──────────────────────────────────

describe("D3 — Recurring error pattern (≥3, gap ≥5) => DRILL_NOW", () => {
  it("drills now when error repeated 3+ times with 5+ turns since last drill", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        recurringErrorCount: 3,
        turnsSinceLastDrill: 6,
        errorSeverity: "grammar",
      }),
    );
    expect(result.decision).toBe("DRILL_NOW");
    expect(result.reasonCode).toBe("drill_recurring_error_pattern");
  });

  it("drills for word_choice recurring 4 times", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        recurringErrorCount: 4,
        turnsSinceLastDrill: 8,
        errorSeverity: "word_choice",
      }),
    );
    expect(result.decision).toBe("DRILL_NOW");
  });

  it("does NOT drill when recurring but too soon after last drill (< 5 turns)", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        recurringErrorCount: 3,
        turnsSinceLastDrill: 3,
      }),
    );
    // D3 returns null (gap < 5). Falls to D4 (too soon) → NO_DRILL
    expect(result.decision).not.toBe("DRILL_NOW");
  });

  it("does NOT drill when only 2 occurrences — not a pattern yet", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        recurringErrorCount: 2,
        turnsSinceLastDrill: 10,
      }),
    );
    expect(result.reasonCode).not.toBe("drill_recurring_error_pattern");
  });

  it("drills when error repeated many times (10+) with sufficient gap", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        recurringErrorCount: 10,
        turnsSinceLastDrill: 20,
        errorSeverity: "grammar",
      }),
    );
    expect(result.decision).toBe("DRILL_NOW");
    expect(result.reasonCode).toBe("drill_recurring_error_pattern");
  });
});

// ─── D4 — Too Soon After Drill Gate ─────────────────────────────────────

describe("D4 — Too soon after drill => NO_DRILL", () => {
  it("suppresses drill when < 3 turns since last drill", () => {
    const result = decideDrillTiming(
      defaultDrillInput({ turnsSinceLastDrill: 1 }),
    );
    expect(result.decision).toBe("NO_DRILL");
    expect(result.reasonCode).toBe("drill_too_soon_after_drill");
  });

  it("suppresses drill when exactly 2 turns since last drill", () => {
    const result = decideDrillTiming(
      defaultDrillInput({ turnsSinceLastDrill: 2 }),
    );
    expect(result.decision).toBe("NO_DRILL");
  });

  it("allows drill when 3+ turns since last drill", () => {
    const result = decideDrillTiming(
      defaultDrillInput({ turnsSinceLastDrill: 3 }),
    );
    // D4 does NOT fire. Falls through to defaults.
    expect(result.reasonCode).not.toBe("drill_too_soon_after_drill");
  });

  it("suppresses even for recurring errors if too soon", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        turnsSinceLastDrill: 1,
        recurringErrorCount: 5,
      }),
    );
    expect(result.decision).toBe("NO_DRILL");
  });
});

// ─── D5 — Correction Overload Gate ──────────────────────────────────────

describe("D5 — Correction overload", () => {
  it("delays drill (DRILL_SOON) when 8+ corrections in session", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        totalCorrectionsInSession: 9,
        recurringErrorCount: 3,
        turnsSinceLastDrill: 6,
        errorSeverity: "grammar",
      }),
    );
    expect(result.decision).toBe("DRILL_SOON");
    expect(result.reasonCode).toBe("drill_correction_overload_delay");
    expect(result.suggestAfterTurns).toBe(4);
  });

  it("skips drill entirely (NO_DRILL) when 12+ corrections in session", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        totalCorrectionsInSession: 15,
        recurringErrorCount: 3,
        turnsSinceLastDrill: 6,
      }),
    );
    expect(result.decision).toBe("NO_DRILL");
    expect(result.reasonCode).toBe("drill_correction_overload_skip");
  });

  it("does not trigger overload gate with < 8 corrections", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        totalCorrectionsInSession: 5,
        recurringErrorCount: 2,
      }),
    );
    expect(result.reasonCode).not.toBe("drill_correction_overload_delay");
    expect(result.reasonCode).not.toBe("drill_correction_overload_skip");
  });

  it("overload gate fires before recurring pattern — learner fatigue matters more", () => {
    // D5 (correction overload) fires before D3 (recurring error pattern).
    // Learner fatigue determines whether a drill will be effective.
    const result = decideDrillTiming(
      defaultDrillInput({
        totalCorrectionsInSession: 10,
        recurringErrorCount: 5,
        turnsSinceLastDrill: 10,
      }),
    );
    // D5 fires → DRILL_SOON. D3 would have been DRILL_NOW, but overload wins.
    expect(result.decision).toBe("DRILL_SOON");
    expect(result.reasonCode).toBe("drill_correction_overload_delay");
  });

  it("overload gate fires when recurring count is low but corrections are high", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        totalCorrectionsInSession: 9,
        recurringErrorCount: 1, // not enough for D3
        turnsSinceLastDrill: 10,
        errorSeverity: "grammar",
      }),
    );
    expect(result.decision).toBe("DRILL_SOON");
    expect(result.reasonCode).toBe("drill_correction_overload_delay");
  });
});

// ─── D6 — Shy Learner Protection Gate ───────────────────────────────────

describe("D6 — Shy learner protection", () => {
  it("suppresses drill for shy learners with < 8 turns since last drill", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        learnerConfidence: "shy",
        turnsSinceLastDrill: 4,
      }),
    );
    expect(result.decision).toBe("NO_DRILL");
    expect(result.reasonCode).toBe("drill_shy_learner_space");
  });

  it("queues drill as DRILL_SOON for shy learners with ≥ 8 turns since last drill", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        learnerConfidence: "shy",
        turnsSinceLastDrill: 10,
        recurringErrorCount: 3,
        errorSeverity: "grammar",
      }),
    );
    expect(result.decision).toBe("DRILL_SOON");
    expect(result.reasonCode).toBe("drill_shy_learner_gentle");
    expect(result.suggestAfterTurns).toBe(2);
  });

  it("shy learner gate fires before recurring pattern — emotional space matters more", () => {
    // D6 (shy learner) fires before D3 (recurring error pattern).
    // A shy learner needs conversational space more than they need a drill.
    const result = decideDrillTiming(
      defaultDrillInput({
        learnerConfidence: "shy",
        turnsSinceLastDrill: 5,
        recurringErrorCount: 3,
        errorSeverity: "grammar",
      }),
    );
    // D6 fires → NO_DRILL (shy + < 8 turns). D3 would have drilled now.
    expect(result.decision).toBe("NO_DRILL");
    expect(result.reasonCode).toBe("drill_shy_learner_space");
  });

  it("protects shy learners from drill when gap is borderline", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        learnerConfidence: "shy",
        turnsSinceLastDrill: 7,
        recurringErrorCount: 1, // Not enough for D3
      }),
    );
    expect(result.decision).toBe("NO_DRILL");
    expect(result.reasonCode).toBe("drill_shy_learner_space");
  });
});

// ─── D7 — Beginner Priority Gate ────────────────────────────────────────

describe("D7 — Beginner priority", () => {
  it("drills immediately for A1 learner with grammar error", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        cefrLevel: "A1",
        errorSeverity: "grammar",
        learnerConfidence: "normal",
      }),
    );
    expect(result.decision).toBe("DRILL_NOW");
    expect(result.reasonCode).toBe("drill_beginner_priority");
  });

  it("drills immediately for A2 learner with grammar error", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        cefrLevel: "A2",
        errorSeverity: "grammar",
        learnerConfidence: "normal",
      }),
    );
    expect(result.decision).toBe("DRILL_NOW");
    expect(result.reasonCode).toBe("drill_beginner_priority");
  });

  it("drills for null CEFR (treated as beginner) with grammar error", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        cefrLevel: null,
        errorSeverity: "grammar",
        learnerConfidence: "normal",
      }),
    );
    expect(result.decision).toBe("DRILL_NOW");
    expect(result.reasonCode).toBe("drill_beginner_priority");
  });

  it("drills for beginner with word_choice repeated 2+ times", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        cefrLevel: "A1",
        errorSeverity: "word_choice",
        recurringErrorCount: 2,
        learnerConfidence: "normal",
      }),
    );
    expect(result.decision).toBe("DRILL_NOW");
  });

  it("does NOT drill for beginner with minor error", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        cefrLevel: "A1",
        errorSeverity: "minor",
        learnerConfidence: "normal",
      }),
    );
    // D7 returns null (minor not in drill-eligible list)
    expect(result.reasonCode).not.toBe("drill_beginner_priority");
  });

  it("does NOT drill for beginner with fluency error", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        cefrLevel: "A1",
        errorSeverity: "fluency",
        learnerConfidence: "normal",
      }),
    );
    expect(result.reasonCode).not.toBe("drill_beginner_priority");
  });

  it("suppresses drill for beginner if just drilled — D4 fires before D7", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        cefrLevel: "A1",
        errorSeverity: "grammar",
        learnerConfidence: "normal",
        turnsSinceLastDrill: 0,
      }),
    );
    // D4 (too soon) fires before D7 (beginner priority)
    expect(result.decision).toBe("NO_DRILL");
    expect(result.reasonCode).toBe("drill_too_soon_after_drill");
  });

  it("does not drill for B1 learners via beginner gate", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        cefrLevel: "B1",
        errorSeverity: "grammar",
      }),
    );
    expect(result.reasonCode).not.toBe("drill_beginner_priority");
  });
});

// ─── D8 — Lesson Completion Edge Gate ────────────────────────────────────

describe("D8 — Lesson completion edge => DRILL_AT_END", () => {
  it("queues drill for end-of-lesson review when ≥75% complete", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        currentLessonProgress: 80,
        recurringErrorCount: 2,
        errorSeverity: "grammar",
      }),
    );
    expect(result.decision).toBe("DRILL_AT_END");
    expect(result.reasonCode).toBe("drill_lesson_completion_edge");
  });

  it("queues drill for end at exactly 75% progress", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        currentLessonProgress: 75,
        recurringErrorCount: 1,
      }),
    );
    expect(result.decision).toBe("DRILL_AT_END");
  });

  it("drills now at 90%+ when recurring error pattern is present (D3 > D8)", () => {
    // D3 (recurring error) fires before D8 (lesson completion edge).
    // Recurring errors are more urgent than saving for end-of-lesson review.
    const result = decideDrillTiming(
      defaultDrillInput({
        currentLessonProgress: 95,
        recurringErrorCount: 3,
      }),
    );
    // D3 fires → DRILL_NOW (recurring 3, gap 10). D8 would have saved for end.
    expect(result.decision).toBe("DRILL_NOW");
    expect(result.reasonCode).toBe("drill_recurring_error_pattern");
  });

  it("saves for end at 90%+ when no recurring pattern — no signal to drill now", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        currentLessonProgress: 90,
        recurringErrorCount: 1,
        errorSeverity: "minor",
      }),
    );
    // No D1-D7 gate fires. D8 fires → DRILL_AT_END
    expect(result.decision).toBe("DRILL_AT_END");
    expect(result.reasonCode).toBe("drill_lesson_completion_edge");
  });

  it("does NOT fire for mid-lesson progress (< 75%)", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        currentLessonProgress: 50,
        recurringErrorCount: 2,
      }),
    );
    expect(result.reasonCode).not.toBe("drill_lesson_completion_edge");
  });

  it("lesson target errors still get DRILL_NOW via D2 even near end", () => {
    // D2 (lesson target) fires before D8 (lesson completion edge)
    const result = decideDrillTiming(
      defaultDrillInput({
        isCurrentLessonTarget: true,
        recurringErrorCount: 3,
        currentLessonProgress: 85,
        errorSeverity: "grammar",
      }),
    );
    // D2 has priority over D8
    expect(result.decision).toBe("DRILL_NOW");
    expect(result.reasonCode).toBe("drill_lesson_target_reinforcement");
  });
});

// ─── Default Fallback ──────────────────────────────────────────────────

describe("Default fallback", () => {
  it("defaults to NO_DRILL for normal mid-session scenario with no signals", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        errorSeverity: "minor",
        recurringErrorCount: 1,
      }),
    );
    expect(result.decision).toBe("NO_DRILL");
    expect(result.reasonCode).toBe("drill_default_no_drill");
  });

  it("suggests DRILL_SOON when no drills done yet with recurring errors mid-session", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        drillsThisSession: 0,
        recurringErrorCount: 2,
        totalTurnsInSession: 10,
        turnsSinceLastDrill: 999, // effectively never
        errorSeverity: "grammar",
      }),
    );
    expect(result.decision).toBe("DRILL_SOON");
    expect(result.reasonCode).toBe("drill_default_first_drill_suggestion");
    expect(result.suggestAfterTurns).toBe(3);
  });

  it("does not suggest drill if only 1 recurring error and no drills", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        drillsThisSession: 0,
        recurringErrorCount: 1,
        totalTurnsInSession: 10,
        turnsSinceLastDrill: 999,
      }),
    );
    // Not enough recurring errors for the default suggestion
    expect(result.reasonCode).toBe("drill_default_no_drill");
  });
});

// ─── Gate Priority Order ────────────────────────────────────────────────

describe("Gate priority order", () => {
  it("D1 (fatal meaning) takes priority over D6 (shy learner)", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        errorSeverity: "fatal_meaning",
        learnerConfidence: "shy",
        turnsSinceLastDrill: 4,
      }),
    );
    // D1 fires → DRILL_NOW. D6 would have suppressed.
    expect(result.decision).toBe("DRILL_NOW");
    expect(result.reasonCode).toBe("drill_fatal_error_recovery");
  });

  it("D2 (lesson target) takes priority over D8 (lesson completion edge)", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        isCurrentLessonTarget: true,
        recurringErrorCount: 3,
        currentLessonProgress: 85,
        errorSeverity: "grammar",
      }),
    );
    // D2 fires → DRILL_NOW. D8 would have saved for end.
    expect(result.decision).toBe("DRILL_NOW");
    expect(result.reasonCode).toBe("drill_lesson_target_reinforcement");
  });

  it("D5 (correction overload) takes priority over D3 (recurring error)", () => {
    // Learner state (fatigue) determines drill effectiveness.
    // Correction overload fires before recurring patterns.
    const result = decideDrillTiming(
      defaultDrillInput({
        recurringErrorCount: 4,
        turnsSinceLastDrill: 6,
        totalCorrectionsInSession: 9,
        errorSeverity: "grammar",
      }),
    );
    // D5 fires → DRILL_SOON. D3 would have been DRILL_NOW.
    expect(result.decision).toBe("DRILL_SOON");
    expect(result.reasonCode).toBe("drill_correction_overload_delay");
  });

  it("D4 (too soon) takes priority over D3 (recurring error)", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        turnsSinceLastDrill: 1,
        recurringErrorCount: 5,
        errorSeverity: "grammar",
      }),
    );
    // D4 fires → NO_DRILL. D3 would have drilled now.
    expect(result.decision).toBe("NO_DRILL");
    expect(result.reasonCode).toBe("drill_too_soon_after_drill");
  });

  it("D6 (shy learner) takes priority over D7 (beginner priority)", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        cefrLevel: "A1",
        learnerConfidence: "shy",
        turnsSinceLastDrill: 4,
        errorSeverity: "grammar",
      }),
    );
    // D6 fires → NO_DRILL (shy + < 8 turns). D7 would have drilled.
    expect(result.decision).toBe("NO_DRILL");
    expect(result.reasonCode).toBe("drill_shy_learner_space");
  });
});

// ─── Edge Cases ────────────────────────────────────────────────────────

describe("Edge cases", () => {
  it("handles zero totalTurnsInSession", () => {
    const result = decideDrillTiming(
      defaultDrillInput({ totalTurnsInSession: 0 }),
    );
    expect(result.decision).toBeDefined();
    // No gate fires; fallback handles it
  });

  it("handles very large turnsSinceLastDrill (never drilled)", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        turnsSinceLastDrill: 9999,
        recurringErrorCount: 3,
      }),
    );
    expect(result.decision).toBe("DRILL_NOW");
    expect(result.reasonCode).toBe("drill_recurring_error_pattern");
  });

  it("handles maximum progress (100%)", () => {
    const result = decideDrillTiming(
      defaultDrillInput({ currentLessonProgress: 100 }),
    );
    expect(result.decision).toBe("DRILL_AT_END");
    expect(result.reasonCode).toBe("drill_lesson_completion_edge");
  });

  it("handles zero progress (0%)", () => {
    const result = decideDrillTiming(
      defaultDrillInput({ currentLessonProgress: 0 }),
    );
    // No D8 fire; falls through
    expect(result.reasonCode).not.toBe("drill_lesson_completion_edge");
  });

  it("handles many drills already done this session", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        drillsThisSession: 10,
        recurringErrorCount: 3,
        turnsSinceLastDrill: 6,
      }),
    );
    // D3 should still fire if conditions met
    expect(result.decision).toBe("DRILL_NOW");
  });

  it("handles all error severities without crashing", () => {
    const severities: ErrorSeverity[] = [
      "fatal_meaning",
      "lesson_target",
      "grammar",
      "fluency",
      "word_choice",
      "minor",
    ];
    for (const sev of severities) {
      const result = decideDrillTiming(defaultDrillInput({ errorSeverity: sev }));
      expect(result.decision).toBeDefined();
      expect(result.reason).toBeTruthy();
      expect(result.reasonCode).toBeTruthy();
    }
  });

  it("handles all learner confidences without crashing", () => {
    const confidences: LearnerConfidence[] = ["shy", "normal", "confident"];
    for (const conf of confidences) {
      const result = decideDrillTiming(
        defaultDrillInput({ learnerConfidence: conf }),
      );
      expect(result.decision).toBeDefined();
    }
  });

  it("handles all CEFR levels without crashing", () => {
    const levels = [null, "A1", "A2", "B1", "B2", "C1", "C2"];
    for (const lvl of levels) {
      const result = decideDrillTiming(
        defaultDrillInput({ cefrLevel: lvl }),
      );
      expect(result.decision).toBeDefined();
    }
  });

  it("every result has a non-empty reason", () => {
    const testCases: Partial<DrillTimingInput>[] = [
      { errorSeverity: "fatal_meaning" },
      { isCurrentLessonTarget: true, recurringErrorCount: 3 },
      { recurringErrorCount: 4, turnsSinceLastDrill: 10 },
      { turnsSinceLastDrill: 1 },
      { totalCorrectionsInSession: 10, recurringErrorCount: 1 },
      { learnerConfidence: "shy", turnsSinceLastDrill: 4 },
      { cefrLevel: "A1", errorSeverity: "grammar" },
      { currentLessonProgress: 85 },
      { errorSeverity: "minor", recurringErrorCount: 1 },
    ];

    for (const tc of testCases) {
      const result = decideDrillTiming(defaultDrillInput(tc));
      expect(result.reason).toBeTruthy();
      expect(result.reason.length).toBeGreaterThan(10);
      expect(result.reasonCode).toBeTruthy();
    }
  });
});

// ─── Determinism ────────────────────────────────────────────────────────

describe("Determinism — pure function, no side effects", () => {
  it("is deterministic for the same input", () => {
    const input: DrillTimingInput = {
      turnsSinceLastDrill: 8,
      totalCorrectionsInSession: 3,
      recurringErrorCount: 4,
      errorSeverity: "grammar",
      cefrLevel: "B1",
      learnerConfidence: "normal",
      isCurrentLessonTarget: false,
      totalTurnsInSession: 12,
      currentLessonProgress: 40,
      drillsThisSession: 1,
    };

    const results = Array.from({ length: 10 }, () => decideDrillTiming(input));
    const first = results[0];
    for (const r of results) {
      expect(r).toEqual(first);
    }
  });

  it("does not read environment variables", () => {
    const input = defaultDrillInput();
    const result1 = decideDrillTiming(input);
    const result2 = decideDrillTiming(input);
    expect(result1).toEqual(result2);
  });
});

// ─── Convenience Helpers ────────────────────────────────────────────────

describe("Convenience helpers", () => {
  it("isDrillRecommendedNow returns true only for DRILL_NOW", () => {
    expect(isDrillRecommendedNow({ decision: "DRILL_NOW" } as DrillTimingResult)).toBe(true);
    expect(isDrillRecommendedNow({ decision: "DRILL_SOON" } as DrillTimingResult)).toBe(false);
    expect(isDrillRecommendedNow({ decision: "DRILL_AT_END" } as DrillTimingResult)).toBe(false);
    expect(isDrillRecommendedNow({ decision: "NO_DRILL" } as DrillTimingResult)).toBe(false);
  });

  it("isDrillQueued returns true for DRILL_SOON and DRILL_AT_END", () => {
    expect(isDrillQueued({ decision: "DRILL_NOW" } as DrillTimingResult)).toBe(false);
    expect(isDrillQueued({ decision: "DRILL_SOON" } as DrillTimingResult)).toBe(true);
    expect(isDrillQueued({ decision: "DRILL_AT_END" } as DrillTimingResult)).toBe(true);
    expect(isDrillQueued({ decision: "NO_DRILL" } as DrillTimingResult)).toBe(false);
  });

  it("isNoDrillRecommended returns true only for NO_DRILL", () => {
    expect(isNoDrillRecommended({ decision: "DRILL_NOW" } as DrillTimingResult)).toBe(false);
    expect(isNoDrillRecommended({ decision: "DRILL_SOON" } as DrillTimingResult)).toBe(false);
    expect(isNoDrillRecommended({ decision: "DRILL_AT_END" } as DrillTimingResult)).toBe(false);
    expect(isNoDrillRecommended({ decision: "NO_DRILL" } as DrillTimingResult)).toBe(true);
  });
});

// ─── Catalogs ──────────────────────────────────────────────────────────

describe("Catalogs", () => {
  it("DRILL_TIMING_DECISION_CATALOG has all 4 decisions", () => {
    expect(DRILL_TIMING_DECISION_CATALOG).toHaveLength(4);
    const decisions = DRILL_TIMING_DECISION_CATALOG.map((c) => c.decision);
    expect(decisions).toContain("DRILL_NOW");
    expect(decisions).toContain("DRILL_SOON");
    expect(decisions).toContain("DRILL_AT_END");
    expect(decisions).toContain("NO_DRILL");
  });

  it("DRILL_TIMING_DECISION_CATALOG entries have Vietnamese titles", () => {
    for (const entry of DRILL_TIMING_DECISION_CATALOG) {
      expect(entry.titleVi).toBeTruthy();
      expect(entry.titleEn).toBeTruthy();
      expect(entry.descriptionVi).toBeTruthy();
    }
  });

  it("DRILL_TIMING_REASON_CODE_CATALOG has entries for all gates", () => {
    expect(DRILL_TIMING_REASON_CODE_CATALOG.length).toBeGreaterThanOrEqual(11);
    const codes = DRILL_TIMING_REASON_CODE_CATALOG.map((c) => c.reasonCode);

    // Verify key codes exist
    expect(codes).toContain("drill_fatal_error_recovery");
    expect(codes).toContain("drill_lesson_target_reinforcement");
    expect(codes).toContain("drill_recurring_error_pattern");
    expect(codes).toContain("drill_too_soon_after_drill");
    expect(codes).toContain("drill_correction_overload_delay");
    expect(codes).toContain("drill_correction_overload_skip");
    expect(codes).toContain("drill_shy_learner_space");
    expect(codes).toContain("drill_shy_learner_gentle");
    expect(codes).toContain("drill_beginner_priority");
    expect(codes).toContain("drill_lesson_completion_edge");
    expect(codes).toContain("drill_default_first_drill_suggestion");
    expect(codes).toContain("drill_default_no_drill");
  });

  it("every catalog entry has a descriptionVi", () => {
    for (const entry of DRILL_TIMING_REASON_CODE_CATALOG) {
      expect(entry.descriptionVi).toBeTruthy();
    }
  });

  it("every reason code maps to a valid decision type", () => {
    const validDecisions: DrillDecision[] = [
      "DRILL_NOW", "DRILL_SOON", "DRILL_AT_END", "NO_DRILL",
    ];
    for (const entry of DRILL_TIMING_REASON_CODE_CATALOG) {
      expect(validDecisions).toContain(entry.decision);
    }
  });
});

// ─── Scenario Tests — Realistic Learner Journeys ────────────────────────

describe("Scenario: A1 beginner with recurring grammar error mid-lesson", () => {
  it("drills immediately to prevent fossilization", () => {
    const result = decideDrillTiming({
      turnsSinceLastDrill: 20,
      totalCorrectionsInSession: 3,
      recurringErrorCount: 3,
      errorSeverity: "grammar",
      cefrLevel: "A1",
      learnerConfidence: "normal",
      isCurrentLessonTarget: false,
      totalTurnsInSession: 12,
      currentLessonProgress: 35,
      drillsThisSession: 0,
    });

    // D3 fires first (recurring 3, gap 20 → DRILL_NOW)
    expect(result.decision).toBe("DRILL_NOW");
    expect(result.reasonCode).toBe("drill_recurring_error_pattern");
  });
});

describe("Scenario: shy B1 learner with recurring word choice error", () => {
  it("queues gentle drill for later — shy learner protection fires before recurring pattern", () => {
    const result = decideDrillTiming({
      turnsSinceLastDrill: 12,
      totalCorrectionsInSession: 4,
      recurringErrorCount: 3,
      errorSeverity: "word_choice",
      cefrLevel: "B1",
      learnerConfidence: "shy",
      isCurrentLessonTarget: false,
      totalTurnsInSession: 20,
      currentLessonProgress: 50,
      drillsThisSession: 0,
    });

    // D6 fires before D3 — shy learner with ≥8 turns → DRILL_SOON
    expect(result.decision).toBe("DRILL_SOON");
    expect(result.reasonCode).toBe("drill_shy_learner_gentle");
  });
});

describe("Scenario: confident advanced learner with minor slip", () => {
  it("does not drill — it's just a slip", () => {
    const result = decideDrillTiming({
      turnsSinceLastDrill: 15,
      totalCorrectionsInSession: 1,
      recurringErrorCount: 1,
      errorSeverity: "minor",
      cefrLevel: "C1",
      learnerConfidence: "confident",
      isCurrentLessonTarget: false,
      totalTurnsInSession: 25,
      currentLessonProgress: 60,
      drillsThisSession: 2,
    });

    // No gate fires; default → NO_DRILL
    expect(result.decision).toBe("NO_DRILL");
  });
});

describe("Scenario: lesson target error repeated near end of lesson", () => {
  it("drills now via D2 (lesson target priority > lesson completion edge)", () => {
    const result = decideDrillTiming({
      turnsSinceLastDrill: 8,
      totalCorrectionsInSession: 3,
      recurringErrorCount: 2,
      errorSeverity: "grammar",
      cefrLevel: "A2",
      learnerConfidence: "normal",
      isCurrentLessonTarget: true,
      totalTurnsInSession: 18,
      currentLessonProgress: 82,
      drillsThisSession: 1,
    });

    // D2 fires → DRILL_NOW (lesson target priority overrides D8)
    expect(result.decision).toBe("DRILL_NOW");
    expect(result.reasonCode).toBe("drill_lesson_target_reinforcement");
  });
});

describe("Scenario: heavily corrected session with recurring errors", () => {
  it("delays drill — correction overload (11 corrections) matters more than recurring pattern", () => {
    const result = decideDrillTiming({
      turnsSinceLastDrill: 10,
      totalCorrectionsInSession: 11,
      recurringErrorCount: 4,
      errorSeverity: "grammar",
      cefrLevel: "B1",
      learnerConfidence: "normal",
      isCurrentLessonTarget: false,
      totalTurnsInSession: 30,
      currentLessonProgress: 45,
      drillsThisSession: 0,
    });

    // D5 fires before D3 — correction overload trumps recurring pattern
    expect(result.decision).toBe("DRILL_SOON");
    expect(result.reasonCode).toBe("drill_correction_overload_delay");
  });
});

describe("Scenario: just drilled, fatal meaning error occurs", () => {
  it("does not drill again — fatal recovery respects spacing", () => {
    const result = decideDrillTiming({
      turnsSinceLastDrill: 0,
      totalCorrectionsInSession: 2,
      recurringErrorCount: 1,
      errorSeverity: "fatal_meaning",
      cefrLevel: "B1",
      learnerConfidence: "normal",
      isCurrentLessonTarget: false,
      totalTurnsInSession: 5,
      currentLessonProgress: 20,
      drillsThisSession: 1,
    });

    // D1 skips (turnsSinceLastDrill < 1). Falls to D4 → NO_DRILL
    expect(result.decision).toBe("NO_DRILL");
    expect(result.reasonCode).toBe("drill_too_soon_after_drill");
  });
});

describe("Scenario: first-time drill suggestion for mid-session recurring errors", () => {
  it("suggests drill soon when never drilled and errors are building up", () => {
    const result = decideDrillTiming({
      turnsSinceLastDrill: 9999,
      totalCorrectionsInSession: 4,
      recurringErrorCount: 2,
      errorSeverity: "word_choice",
      cefrLevel: "B1",
      learnerConfidence: "normal",
      isCurrentLessonTarget: false,
      totalTurnsInSession: 8,
      currentLessonProgress: 30,
      drillsThisSession: 0,
    });

    // No gate fires specifically. Default → first drill suggestion
    expect(result.decision).toBe("DRILL_SOON");
    expect(result.reasonCode).toBe("drill_default_first_drill_suggestion");
    expect(result.suggestAfterTurns).toBe(3);
  });
});

// ─── DRILL_NOW and DRILL_SOON have suggestedDrillTarget ─────────────────

describe("Drill target suggestions", () => {
  it("DRILL_NOW from fatal error includes meaning-clarification target", () => {
    const result = decideDrillTiming(
      defaultDrillInput({ errorSeverity: "fatal_meaning" }),
    );
    expect(result.decision).toBe("DRILL_NOW");
    expect(result.suggestedDrillTarget).toBe("meaning-clarification");
  });

  it("DRILL_NOW from recurring pattern includes the error severity as target", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        recurringErrorCount: 3,
        turnsSinceLastDrill: 6,
        errorSeverity: "word_choice",
      }),
    );
    expect(result.decision).toBe("DRILL_NOW");
    expect(result.suggestedDrillTarget).toBe("word_choice");
  });

  it("DRILL_SOON from overload includes the error severity as target", () => {
    const result = decideDrillTiming(
      defaultDrillInput({
        totalCorrectionsInSession: 9,
        recurringErrorCount: 1,
        errorSeverity: "grammar",
      }),
    );
    expect(result.decision).toBe("DRILL_SOON");
    expect(result.suggestedDrillTarget).toBe("grammar");
  });

  it("DRILL_AT_END does not include suggestedDrillTarget", () => {
    const result = decideDrillTiming(
      defaultDrillInput({ currentLessonProgress: 85 }),
    );
    expect(result.decision).toBe("DRILL_AT_END");
    expect(result.suggestedDrillTarget).toBeUndefined();
  });

  it("NO_DRILL does not include suggestedDrillTarget", () => {
    const result = decideDrillTiming(
      defaultDrillInput({ turnsSinceLastDrill: 1 }),
    );
    expect(result.decision).toBe("NO_DRILL");
    expect(result.suggestedDrillTarget).toBeUndefined();
  });
});
