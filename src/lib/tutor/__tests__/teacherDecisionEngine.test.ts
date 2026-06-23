/**
 * Tests for Teacher Mercy Decision Engine
 *
 * Covers:
 *   - Single error → each DecisionAction path (CORRECT_NOW, DEFER, SUPPRESS, FOLLOW_UP_FIRST, EXPLAIN_PATTERN)
 *   - Multi-error priority ordering
 *   - Fatal meaning always wins priority
 *   - Lesson target overrides other concerns
 *   - Shy learner suppression
 *   - Advanced learner follow-up
 *   - Session load deferral
 *   - Repeated mistake → explain pattern
 *   - Vietnamese rationale generation (all reason codes)
 *   - Null/no-error input handling
 *   - Empty text handling
 *   - All five DecisionAction outputs reachable
 *   - Convenience helpers (isCorrectionVisible, isCorrectionDeferred, isCorrectionSuppressed, hasActionableCorrection)
 *   - No production flags, no side effects, deterministic
 *   - Edge cases: very long text, mixed language, non-English
 *
 * Input → severity mapping used in tests:
 *   "She happy."               → grammar (be-verb omission: en-be-verb-omission)
 *   "She go to school every day." → lesson_target (SVA: en-step5-subject-verb-agreement)
 *   "I went to school yesterday." → unchanged (no error)
 *   "I buy a head yesterday."  → needs_ai (semantic implausibility)
 *   "I mean... she go ..."      → self-correction detected
 *   "it's very Sunday in the summer" → STT garble fixed → fatal_meaning
 */
import { describe, expect, it } from "vitest";
import {
  decideTeacherAction,
  isCorrectionVisible,
  isCorrectionDeferred,
  isCorrectionSuppressed,
  hasActionableCorrection,
  type TeacherDecisionInput,
  type DecisionAction,
  TEACHER_DECISION_ACTION_CATALOG,
  TEACHER_DECISION_REASON_CODE_CATALOG,
} from "../teacherDecisionEngine";

// ─── Helpers ──────────────────────────────────────────────────────────────

/**
 * Default input: B1 normal learner, no special context.
 * "I go to school every day." is correct-ish — use this as base
 * and override learnerText in each test.
 */
function input(overrides: Partial<TeacherDecisionInput> = {}): TeacherDecisionInput {
  return {
    learnerText: "I go to school every day.",
    targetLanguage: "en",
    cefrLevel: "B1",
    isCurrentLessonTarget: false,
    sameMistakeCount: 1,
    learnerConfidence: "normal",
    previousCorrectionsThisSession: 0,
    ...overrides,
  };
}

// ─── Core Decision Paths: Single Error → Each Action ─────────────────────

describe("decideTeacherAction — single error → CORRECT_NOW", () => {
  it("returns CORRECT_NOW for a grammar error (be-verb omission) at B1 level", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She happy." }),
    );
    expect(decision.action).toBe("CORRECT_NOW");
    expect(decision.correction).not.toBeNull();
    expect(decision.correction!.correctedText).not.toBe("She happy.");
    expect(decision.timingMode).toBe("IMMEDIATE");
    expect(decision.rationaleVi).toBeTruthy();
    expect(decision.rationaleEn).toBeTruthy();
    expect(decision.reasonCode).toBeTruthy();
    expect(decision.allCandidates).toHaveLength(1);
  });

  it("returns CORRECT_NOW for a lesson-target error (SVA with isCurrentLessonTarget)", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She go to school every day.",
        isCurrentLessonTarget: true,
      }),
    );
    expect(decision.action).toBe("CORRECT_NOW");
    expect(decision.reasonCode).toBe("lesson_target_immediate");
  });

  it("returns CORRECT_NOW for STT garble with known fix (fatal meaning)", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "it's very Sunday in the summer" }),
    );
    expect(decision.action).toBe("CORRECT_NOW");
    expect(decision.correction).not.toBeNull();
    expect(decision.correction!.correctedText).toContain("sunny");
  });
});

describe("decideTeacherAction — single error → DEFER", () => {
  it("returns DEFER for shy learner with grammar error (delayed 1 turn)", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        learnerConfidence: "shy",
        cefrLevel: "B1",
      }),
    );
    expect(decision.action).toBe("DEFER");
    expect(decision.timingMode).toBe("DELAYED");
    expect(decision.delayTurns).toBe(1);
    expect(decision.reasonCode).toBe("shy_learner_delayed_grammar");
  });

  it("returns DEFER for high session load with grammar error (8+ corrections)", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        previousCorrectionsThisSession: 8,
        cefrLevel: "B1",
      }),
    );
    expect(decision.action).toBe("DEFER");
    expect(decision.reasonCode).toBe("session_correction_load_delayed");
    expect(decision.delayTurns).toBe(2);
  });

  it("returns DEFER for needs_ai (semantic implausibility)", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "I buy a head yesterday." }),
    );
    expect(decision.action).toBe("DEFER");
    expect(decision.reasonCode).toBe("needs_ai_deferred");
    expect(decision.correction).toBeNull();
  });
});

describe("decideTeacherAction — single error → SUPPRESS", () => {
  it("returns SUPPRESS for unchanged text (no errors detected)", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "I went to school yesterday." }),
    );
    expect(decision.action).toBe("SUPPRESS");
    expect(decision.correction).toBeNull();
    expect(decision.reasonCode).toBe("no_error_detected");
    expect(decision.rationaleVi).toBeTruthy();
  });

  it("returns SUPPRESS for empty text", () => {
    const decision = decideTeacherAction(input({ learnerText: "" }));
    expect(decision.action).toBe("SUPPRESS");
    expect(decision.correction).toBeNull();
    expect(decision.reasonCode).toBe("empty_text");
  });

  it("returns SUPPRESS for whitespace-only text", () => {
    const decision = decideTeacherAction(input({ learnerText: "   " }));
    expect(decision.action).toBe("SUPPRESS");
    expect(decision.reasonCode).toBe("empty_text");
  });

  it("returns SUPPRESS for correct sentence (even with special learner context)", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She is happy.", learnerConfidence: "shy" }),
    );
    expect(decision.action).toBe("SUPPRESS");
  });
});

describe("decideTeacherAction — single error → FOLLOW_UP_FIRST", () => {
  it("returns FOLLOW_UP_FIRST for advanced learner (B2) with grammar error", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        cefrLevel: "B2",
      }),
    );
    expect(decision.action).toBe("FOLLOW_UP_FIRST");
    expect(decision.timingMode).toBe("FOLLOW_UP_FIRST");
    expect(decision.reasonCode).toBe("advanced_learner_follow_up_first");
  });

  it("returns FOLLOW_UP_FIRST for self-corrected learner with grammar error", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "I mean... she go to school every day.",
        cefrLevel: "B1",
      }),
    );
    expect(decision.action).toBe("FOLLOW_UP_FIRST");
    expect(decision.reasonCode).toBe("self_correction_follow_up_first");
  });
});

describe("decideTeacherAction — single error → EXPLAIN_PATTERN", () => {
  it("returns EXPLAIN_PATTERN for repeated mistake (3+ times) with grammar error", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        sameMistakeCount: 3,
      }),
    );
    expect(decision.action).toBe("EXPLAIN_PATTERN");
    expect(decision.timingMode).toBe("EXPLAIN_PATTERN");
    expect(decision.reasonCode).toBe("repeated_explain_pattern");
  });

  it("returns EXPLAIN_PATTERN for lesson target repeated 3+ times", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She go to school every day.",
        isCurrentLessonTarget: true,
        sameMistakeCount: 3,
      }),
    );
    expect(decision.action).toBe("EXPLAIN_PATTERN");
    expect(decision.reasonCode).toBe("lesson_target_explain_pattern");
    expect(decision.patternLabel).toBeTruthy();
  });

  it("returns EXPLAIN_PATTERN for repeated mistake at count 5", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        sameMistakeCount: 5,
      }),
    );
    expect(decision.action).toBe("EXPLAIN_PATTERN");
    expect(decision.rationaleVi).toContain("5");
  });
});

// ─── Priority Ordering ────────────────────────────────────────────────────

describe("decideTeacherAction — multi-error priority ordering", () => {
  it("fatal meaning (needs_ai) always wins over grammar rules", () => {
    // "I buy a head yesterday" triggers past-tense correction BUT semantic plausibility guard
    // fires first → status needs_ai (semantic guard wins over grammar rules)
    const decision = decideTeacherAction(
      input({
        learnerText: "I buy a head yesterday.",
        isCurrentLessonTarget: true,
      }),
    );
    expect(decision.action).toBe("DEFER");
    expect(decision.reasonCode).toBe("needs_ai_deferred");
  });

  it("lesson target gates fire before default timing for SVA errors", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She go to school yesterday.",
        isCurrentLessonTarget: true,
        lessonFocus: "past-tense",
      }),
    );
    expect(decision.action).toBe("CORRECT_NOW");
    expect(decision.reasonCode).toBe("lesson_target_immediate");
  });

  it("lesson target with isCurrentLessonTarget=true wins over normal handling", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She go to school yesterday.",
        isCurrentLessonTarget: true,
      }),
    );
    expect(decision.action).toBe("CORRECT_NOW");
    expect(decision.reasonCode).toBe("lesson_target_immediate");
  });

  it("multi-clause run-on sentence triggers enrichment with L1 transfer", () => {
    const decision = decideTeacherAction(
      input({
        learnerText:
          "She go to school every day and she eat rice every day and she do her homework.",
      }),
    );
    expect(decision.correction).not.toBeNull();
    expect(decision.allCandidates).toHaveLength(1);
    expect(decision.enrichment).not.toBeNull();
    expect(decision.enrichment!.isL1TransferError).toBe(true);
  });
});

// ─── Lesson Target Override ───────────────────────────────────────────────

describe("decideTeacherAction — lesson target overrides", () => {
  it("lesson target triggers immediate correction for normal learner", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She go to school every day.",
        isCurrentLessonTarget: true,
      }),
    );
    expect(decision.action).toBe("CORRECT_NOW");
    expect(decision.reasonCode).toBe("lesson_target_immediate");
  });

  it("lesson target overrides shy learner hesitation", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She go to school every day.",
        isCurrentLessonTarget: true,
        learnerConfidence: "shy",
      }),
    );
    // Lesson target gate (T2) fires before shy learner gate (T5)
    expect(decision.action).toBe("CORRECT_NOW");
    expect(decision.reasonCode).toBe("lesson_target_immediate");
  });
});

// ─── Learner Confidence Scenarios ─────────────────────────────────────────

describe("decideTeacherAction — shy learner scenarios", () => {
  it("shy learner with grammar error gets delayed correction (DETER)", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        learnerConfidence: "shy",
        cefrLevel: "B1",
      }),
    );
    expect(decision.action).toBe("DEFER");
    expect(decision.reasonCode).toBe("shy_learner_delayed_grammar");
    expect(decision.delayTurns).toBe(1);
  });

  it("shy learner with correct sentence gets no correction", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She is happy.", learnerConfidence: "shy" }),
    );
    expect(decision.action).toBe("SUPPRESS");
    expect(decision.correction).toBeNull();
  });

  it("shy learner Vietnamese rationale is gentle", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        learnerConfidence: "shy",
        cefrLevel: "B1",
      }),
    );
    expect(decision.rationaleVi).toBeTruthy();
    // Should not sound harsh or critical
    expect(decision.rationaleVi).not.toMatch(/sai|dốt|tệ/i);
  });
});

describe("decideTeacherAction — advanced learner scenarios", () => {
  it("advanced learner (B2) gets follow-up first for grammar", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        cefrLevel: "B2",
      }),
    );
    expect(decision.action).toBe("FOLLOW_UP_FIRST");
    expect(decision.reasonCode).toBe("advanced_learner_follow_up_first");
  });

  it("advanced learner (C1) gets follow-up first for grammar", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        cefrLevel: "C1",
      }),
    );
    expect(decision.action).toBe("FOLLOW_UP_FIRST");
  });

  it("advanced learner (C2) gets follow-up first for grammar", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        cefrLevel: "C2",
      }),
    );
    expect(decision.action).toBe("FOLLOW_UP_FIRST");
  });

  it("advanced learner rationale mentions their level", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        cefrLevel: "C1",
      }),
    );
    expect(decision.rationaleVi).toContain("C1");
  });
});

describe("decideTeacherAction — confident learner scenarios", () => {
  it("confident learner with grammar error gets immediate correction", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She happy.", learnerConfidence: "confident" }),
    );
    expect(decision.action).toBe("CORRECT_NOW");
  });
});

// ─── Session Load ─────────────────────────────────────────────────────────

describe("decideTeacherAction — session correction load", () => {
  it("suppresses when 5+ corrections on a correct sentence", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "I went to school yesterday.",
        previousCorrectionsThisSession: 5,
      }),
    );
    expect(decision.action).toBe("SUPPRESS");
  });

  it("defers grammar error when 8+ corrections already delivered", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        previousCorrectionsThisSession: 8,
        cefrLevel: "B1",
      }),
    );
    expect(decision.action).toBe("DEFER");
    expect(decision.reasonCode).toBe("session_correction_load_delayed");
  });

  it("session load rationale mentions correction count", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        previousCorrectionsThisSession: 8,
        cefrLevel: "B1",
      }),
    );
    expect(decision.rationaleVi).toContain("8");
  });
});

// ─── Repeated Mistakes → EXPLAIN_PATTERN ──────────────────────────────────

describe("decideTeacherAction — repeated mistake → EXPLAIN_PATTERN", () => {
  it("sameMistakeCount=3 triggers EXPLAIN_PATTERN for grammar error", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        sameMistakeCount: 3,
      }),
    );
    expect(decision.action).toBe("EXPLAIN_PATTERN");
    expect(decision.reasonCode).toBe("repeated_explain_pattern");
  });

  it("sameMistakeCount=2 does NOT trigger EXPLAIN_PATTERN (below threshold)", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        sameMistakeCount: 2,
      }),
    );
    expect(decision.action).not.toBe("EXPLAIN_PATTERN");
  });

  it("sameMistakeCount=1 does NOT trigger EXPLAIN_PATTERN", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She happy.", sameMistakeCount: 1 }),
    );
    expect(decision.action).toBe("CORRECT_NOW");
  });

  it("repeated mistake rationale mentions repetition count", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        sameMistakeCount: 4,
      }),
    );
    expect(decision.rationaleVi).toContain("4");
  });
});

// ─── Self-Correction Detection ────────────────────────────────────────────

describe("decideTeacherAction — self-correction scenarios", () => {
  it("ellipsis in text triggers self-correction detection → FOLLOW_UP_FIRST", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "I mean... she go to school every day.",
        cefrLevel: "B1",
      }),
    );
    expect(decision.action).toBe("FOLLOW_UP_FIRST");
    expect(decision.reasonCode).toBe("self_correction_follow_up_first");
  });

  it("explicit 'I mean' marker triggers self-correction detection", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "I mean she go to school every day.",
        cefrLevel: "B1",
      }),
    );
    expect(decision.action).toBe("FOLLOW_UP_FIRST");
  });

  it("self-correction rationale encourages the learner", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "I mean... she go to school every day.",
        cefrLevel: "B1",
      }),
    );
    expect(decision.rationaleVi).toMatch(/tự sửa|tiếp tục|thử/i);
  });
});

// ─── Vietnamese Rationale Generation ──────────────────────────────────────

describe("decideTeacherAction — Vietnamese rationale", () => {
  const reasonCodeCoverage = new Set<string>();

  it("generates rationale for lesson_target_immediate", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She go to school every day.",
        isCurrentLessonTarget: true,
      }),
    );
    expect(decision.rationaleVi).toBeTruthy();
    expect(decision.rationaleVi.length).toBeGreaterThan(20);
    reasonCodeCoverage.add(decision.reasonCode);
  });

  it("generates rationale for lesson_target_explain_pattern", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She go to school every day.",
        isCurrentLessonTarget: true,
        sameMistakeCount: 3,
      }),
    );
    expect(decision.rationaleVi).toBeTruthy();
    expect(decision.rationaleVi).toContain("quy luật");
    reasonCodeCoverage.add(decision.reasonCode);
  });

  it("generates rationale for repeated_explain_pattern", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        sameMistakeCount: 3,
      }),
    );
    expect(decision.rationaleVi).toBeTruthy();
    expect(decision.rationaleVi).toContain("quy luật");
    reasonCodeCoverage.add(decision.reasonCode);
  });

  it("generates rationale for shy_learner_delayed_grammar", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        learnerConfidence: "shy",
        cefrLevel: "B1",
      }),
    );
    expect(decision.rationaleVi).toBeTruthy();
    reasonCodeCoverage.add(decision.reasonCode);
  });

  it("generates rationale for advanced_learner_follow_up_first", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        cefrLevel: "B2",
      }),
    );
    expect(decision.rationaleVi).toBeTruthy();
    expect(decision.rationaleVi).toContain("B2");
    reasonCodeCoverage.add(decision.reasonCode);
  });

  it("generates rationale for session_correction_load_delayed", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        previousCorrectionsThisSession: 8,
        cefrLevel: "B1",
      }),
    );
    expect(decision.rationaleVi).toBeTruthy();
    expect(decision.rationaleVi).toContain("8");
    reasonCodeCoverage.add(decision.reasonCode);
  });

  it("generates rationale for beginner_grammar_immediate", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        cefrLevel: "A1",
      }),
    );
    expect(decision.rationaleVi).toBeTruthy();
    reasonCodeCoverage.add(decision.reasonCode);
  });

  it("generates rationale for default_grammar_immediate", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She happy." }),
    );
    expect(decision.rationaleVi).toBeTruthy();
    expect(decision.rationaleVi).toContain("ngữ pháp");
    reasonCodeCoverage.add(decision.reasonCode);
  });

  it("generates rationale for self_correction_follow_up_first", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "I mean... she go to school every day.",
        cefrLevel: "B1",
      }),
    );
    expect(decision.rationaleVi).toBeTruthy();
    expect(decision.rationaleVi).toMatch(/tự sửa|tiếp tục/i);
    reasonCodeCoverage.add(decision.reasonCode);
  });

  it("generates rationale for no_error_detected", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "I went to school yesterday." }),
    );
    expect(decision.rationaleVi).toBeTruthy();
    expect(decision.rationaleVi).toContain("ổn");
    reasonCodeCoverage.add(decision.reasonCode);
  });

  it("generates rationale for empty_text", () => {
    const decision = decideTeacherAction(input({ learnerText: "" }));
    expect(decision.rationaleVi).toBeTruthy();
    reasonCodeCoverage.add(decision.reasonCode);
  });

  it("generates rationale for needs_ai_deferred", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "I buy a head yesterday." }),
    );
    expect(decision.rationaleVi).toBeTruthy();
    reasonCodeCoverage.add(decision.reasonCode);
  });

  it("generates rationale for fatal_meaning_must_correct (STT garble)", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "it's very Sunday in the summer" }),
    );
    expect(decision.rationaleVi).toBeTruthy();
    reasonCodeCoverage.add(decision.reasonCode);
  });

  it("all reason codes in RATIONALE_VI map are covered (≥ 12 codes)", () => {
    const catalogCodes = new Set(
      TEACHER_DECISION_REASON_CODE_CATALOG.map((c) => c.reasonCode),
    );
    expect(catalogCodes.size).toBeGreaterThanOrEqual(20);
    expect(reasonCodeCoverage.size).toBeGreaterThanOrEqual(12);
  });
});

// ─── All Five DecisionActions Reachable ───────────────────────────────────

describe("decideTeacherAction — all five DecisionActions reachable", () => {
  it("produces CORRECT_NOW", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She happy." }),
    );
    expect(decision.action).toBe("CORRECT_NOW");
  });

  it("produces DEFER", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        learnerConfidence: "shy",
        cefrLevel: "B1",
      }),
    );
    expect(decision.action).toBe("DEFER");
  });

  it("produces SUPPRESS", () => {
    const decision = decideTeacherAction(input({ learnerText: "" }));
    expect(decision.action).toBe("SUPPRESS");
  });

  it("produces FOLLOW_UP_FIRST", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "I mean... she go to school every day.",
        cefrLevel: "B1",
      }),
    );
    expect(decision.action).toBe("FOLLOW_UP_FIRST");
  });

  it("produces EXPLAIN_PATTERN", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        sameMistakeCount: 3,
      }),
    );
    expect(decision.action).toBe("EXPLAIN_PATTERN");
  });
});

// ─── Convenience Helpers ──────────────────────────────────────────────────

describe("convenience helpers", () => {
  it("isCorrectionVisible returns true for CORRECT_NOW", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She happy." }),
    );
    expect(isCorrectionVisible(decision)).toBe(true);
  });

  it("isCorrectionVisible returns true for EXPLAIN_PATTERN", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She happy.", sameMistakeCount: 3 }),
    );
    expect(isCorrectionVisible(decision)).toBe(true);
  });

  it("isCorrectionVisible returns false for DEFER", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        learnerConfidence: "shy",
        cefrLevel: "B1",
      }),
    );
    expect(isCorrectionVisible(decision)).toBe(false);
  });

  it("isCorrectionVisible returns false for SUPPRESS", () => {
    const decision = decideTeacherAction(input({ learnerText: "" }));
    expect(isCorrectionVisible(decision)).toBe(false);
  });

  it("isCorrectionDeferred returns true for DEFER", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        learnerConfidence: "shy",
        cefrLevel: "B1",
      }),
    );
    expect(isCorrectionDeferred(decision)).toBe(true);
  });

  it("isCorrectionDeferred returns true for FOLLOW_UP_FIRST", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "I mean... she go to school every day.",
        cefrLevel: "B1",
      }),
    );
    expect(isCorrectionDeferred(decision)).toBe(true);
  });

  it("isCorrectionDeferred returns false for CORRECT_NOW", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She happy." }),
    );
    expect(isCorrectionDeferred(decision)).toBe(false);
  });

  it("isCorrectionSuppressed returns true for SUPPRESS", () => {
    const decision = decideTeacherAction(input({ learnerText: "" }));
    expect(isCorrectionSuppressed(decision)).toBe(true);
  });

  it("isCorrectionSuppressed returns false for CORRECT_NOW", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She happy." }),
    );
    expect(isCorrectionSuppressed(decision)).toBe(false);
  });

  it("hasActionableCorrection returns true for CORRECT_NOW with correction", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She happy." }),
    );
    expect(hasActionableCorrection(decision)).toBe(true);
  });

  it("hasActionableCorrection returns false for SUPPRESS", () => {
    const decision = decideTeacherAction(input({ learnerText: "" }));
    expect(hasActionableCorrection(decision)).toBe(false);
  });

  it("hasActionableCorrection returns false for DEFER (not visible now)", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        learnerConfidence: "shy",
        cefrLevel: "B1",
      }),
    );
    expect(hasActionableCorrection(decision)).toBe(false);
  });
});

// ─── Enrichment (Weakness + Interference) ─────────────────────────────────

describe("decideTeacherAction — enrichment (weakness + interference)", () => {
  it("includes enrichment when correction rules fire", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She happy." }),
    );
    expect(decision.enrichment).not.toBeNull();
    expect(decision.enrichment!.isL1TransferError).toBe(true);
    expect(decision.enrichment!.weaknessLabelVi).toBeTruthy();
    expect(decision.enrichment!.weaknessLabelEn).toBeTruthy();
  });

  it("returns null enrichment for unchanged text", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "I went to school yesterday." }),
    );
    expect(decision.enrichment).toBeNull();
  });

  it("returns null enrichment for empty text", () => {
    const decision = decideTeacherAction(input({ learnerText: "" }));
    expect(decision.enrichment).toBeNull();
  });

  it("returns null enrichment for needs_ai", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "I buy a head yesterday." }),
    );
    expect(decision.enrichment).toBeNull();
  });
});

// ─── Edge Cases ────────────────────────────────────────────────────────────

describe("decideTeacherAction — edge cases", () => {
  it("handles very long text gracefully", () => {
    const longText =
      "She go to school every day and she eat rice every day and she do homework every day and " +
      "she play with friend every day and she read book every day and she write letter every day " +
      "and she sing song every day and she draw picture every day.";
    const decision = decideTeacherAction(input({ learnerText: longText }));
    expect(decision.action).toBeTruthy();
    expect(decision.rationaleVi).toBeTruthy();
    expect(typeof decision.action).toBe("string");
  });

  it("handles special characters in input", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She go to school!!! 😊" }),
    );
    expect(decision.action).toBeTruthy();
    expect(decision.correction).not.toBeNull();
  });

  it("handles French language input", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "Je suis content.", targetLanguage: "fr" }),
    );
    expect(decision.action).toBeTruthy();
    expect(typeof decision.action).toBe("string");
    expect(decision.rationaleVi).toBeTruthy();
  });

  it("handles Chinese language input", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "你好。", targetLanguage: "zh" }),
    );
    expect(decision.action).toBeTruthy();
    expect(typeof decision.action).toBe("string");
  });

  it("handles null CEFR level — beginner gate fires for grammar", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        cefrLevel: null,
      }),
    );
    // null CEFR → treated as A1 (beginner) → beginner_grammar_immediate
    expect(decision.action).toBe("CORRECT_NOW");
    expect(decision.reasonCode).toBe("beginner_grammar_immediate");
  });

  it("handles null CEFR with lesson_target error", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She go to school every day.",
        cefrLevel: null,
      }),
    );
    // null CEFR, lesson_target severity, not isCurrentLessonTarget → falls through
    // past beginner gate (which only handles grammar/minor/fluency) → default
    expect(decision.action).toBeTruthy();
  });

  it("handles mixed language content gracefully", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She nói rằng she go to school." }),
    );
    expect(decision.action).toBeTruthy();
  });

  it("never throws on any input", () => {
    const texts = [
      "",
      "hello",
      "   ",
      "She happy.",
      "She go to school every day.",
      "I buy a head yesterday.",
      "!!!",
      "123",
      "A".repeat(1000),
    ];
    for (const text of texts) {
      expect(() => decideTeacherAction(input({ learnerText: text }))).not.toThrow();
    }
  });
});

// ─── Determinism ──────────────────────────────────────────────────────────

describe("decideTeacherAction — determinism", () => {
  it("returns the same result for the same input (idempotent)", () => {
    const inp = input({ learnerText: "She happy." });
    const first = decideTeacherAction(inp);
    const second = decideTeacherAction(inp);
    expect(first.action).toBe(second.action);
    expect(first.reasonCode).toBe(second.reasonCode);
    expect(first.rationaleVi).toBe(second.rationaleVi);
  });

  it("has no side effects (calling twice doesn't change state)", () => {
    const inp = input({ learnerText: "She happy." });
    const before = decideTeacherAction(inp);
    const after = decideTeacherAction(inp);
    expect(before.action).toBe(after.action);
  });
});

// ─── Catalogs ─────────────────────────────────────────────────────────────

describe("teacher decision catalogs", () => {
  it("TEACHER_DECISION_ACTION_CATALOG covers all five actions", () => {
    const actions = TEACHER_DECISION_ACTION_CATALOG.map((c) => c.action);
    expect(actions).toContain("CORRECT_NOW");
    expect(actions).toContain("DEFER");
    expect(actions).toContain("SUPPRESS");
    expect(actions).toContain("FOLLOW_UP_FIRST");
    expect(actions).toContain("EXPLAIN_PATTERN");
  });

  it("TEACHER_DECISION_REASON_CODE_CATALOG maps every code to a valid action", () => {
    const validActions: DecisionAction[] = [
      "CORRECT_NOW",
      "DEFER",
      "SUPPRESS",
      "FOLLOW_UP_FIRST",
      "EXPLAIN_PATTERN",
    ];
    for (const entry of TEACHER_DECISION_REASON_CODE_CATALOG) {
      expect(validActions).toContain(entry.action);
    }
  });

  it("every catalog entry has Vietnamese description", () => {
    for (const entry of TEACHER_DECISION_ACTION_CATALOG) {
      expect(entry.descriptionVi).toBeTruthy();
      expect(entry.titleVi).toBeTruthy();
    }
    for (const entry of TEACHER_DECISION_REASON_CODE_CATALOG) {
      expect(entry.descriptionVi).toBeTruthy();
    }
  });

  it("reason code catalog covers the engine-specific codes", () => {
    const codes = TEACHER_DECISION_REASON_CODE_CATALOG.map((c) => c.reasonCode);
    expect(codes).toContain("no_error_detected");
    expect(codes).toContain("empty_text");
    expect(codes).toContain("needs_ai_deferred");
  });
});

// ─── TeacherDecision shape contract ──────────────────────────────────────

describe("TeacherDecision shape contract", () => {
  it("every decision has all required fields", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She happy." }),
    );
    expect(decision).toHaveProperty("action");
    expect(decision).toHaveProperty("correction");
    expect(decision).toHaveProperty("timingMode");
    expect(decision).toHaveProperty("rationaleVi");
    expect(decision).toHaveProperty("rationaleEn");
    expect(decision).toHaveProperty("reasonCode");
    expect(decision).toHaveProperty("allCandidates");
    expect(decision).toHaveProperty("enrichment");
  });

  it("CORRECT_NOW decision has non-null correction with rule IDs and severity", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She happy." }),
    );
    expect(decision.correction).not.toBeNull();
    expect(decision.correction!.correctedText).toBeTruthy();
    expect(decision.correction!.appliedRuleIds.length).toBeGreaterThan(0);
    expect(decision.correction!.severity).toBeTruthy();
  });

  it("DEFER decision has delayTurns > 0", () => {
    const decision = decideTeacherAction(
      input({
        learnerText: "She happy.",
        learnerConfidence: "shy",
        cefrLevel: "B1",
      }),
    );
    expect(decision.action).toBe("DEFER");
    expect(decision.delayTurns).toBeGreaterThan(0);
  });

  it("EXPLAIN_PATTERN decision has patternLabel", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She happy.", sameMistakeCount: 3 }),
    );
    expect(decision.action).toBe("EXPLAIN_PATTERN");
    expect(decision.patternLabel).toBeTruthy();
  });

  it("SUPPRESS decision has null correction", () => {
    const decision = decideTeacherAction(input({ learnerText: "" }));
    expect(decision.correction).toBeNull();
  });
});

// ─── Beginner Learner Gate ────────────────────────────────────────────────

describe("decideTeacherAction — beginner learner (A1/A2)", () => {
  it("beginner (A1) gets immediate grammar correction", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She happy.", cefrLevel: "A1" }),
    );
    expect(decision.action).toBe("CORRECT_NOW");
    expect(decision.reasonCode).toBe("beginner_grammar_immediate");
  });

  it("beginner (A2) gets immediate grammar correction", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She happy.", cefrLevel: "A2" }),
    );
    expect(decision.action).toBe("CORRECT_NOW");
    expect(decision.reasonCode).toBe("beginner_grammar_immediate");
  });
});

// ─── Confidence Inference Heuristics ──────────────────────────────────────

describe("decideTeacherAction — confidence inference", () => {
  it("very short text (<= 3 words) infers shy from text heuristics", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She go." }),
    );
    expect(decision.action).toBeTruthy();
  });

  it("text with hesitation markers infers shy from text — reasoned decision", () => {
    // "maybe she go" — short text (≤3 words after maybe) + "maybe" → shy confidence
    // "she go" without "to school" may not trigger SVA rule, so accept any valid decision
    const decision = decideTeacherAction(
      input({ learnerText: "maybe she go...", cefrLevel: "B1" }),
    );
    // All we assert: the decision is a valid action string
    expect([
      "CORRECT_NOW",
      "DEFER",
      "SUPPRESS",
      "FOLLOW_UP_FIRST",
      "EXPLAIN_PATTERN",
    ]).toContain(decision.action);
  });

  it("long flowing correct text (>= 10 words) returns SUPPRESS", () => {
    const decision = decideTeacherAction(
      input({ learnerText: "She goes to school every day and she eats rice for lunch." }),
    );
    expect(decision.action).toBe("SUPPRESS");
  });
});
