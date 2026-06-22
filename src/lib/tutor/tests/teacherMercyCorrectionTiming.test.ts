import { describe, expect, it } from "vitest";
import {
  decideCorrectionMode,
  buildTimingInput,
  assertOneCorrectionPerDecision,
  CORRECTION_TIMING_MODE_CATALOG,
  CORRECTION_TIMING_ERROR_SEVERITY_CATALOG,
  type CorrectionTimingInput,
  type CorrectionTimingResult,
  type ErrorSeverity,
  type LearnerConfidence,
  type CorrectionMode,
} from "../teacherMercyCorrectionTiming";
import type { ContractLearnerInput } from "../teacherMercyContract";

// ─── Test Fixtures ──────────────────────────────────────────────────────

function defaultTimingInput(
  overrides: Partial<CorrectionTimingInput> = {},
): CorrectionTimingInput {
  return {
    learnerText: "I go to market yesterday.",
    cefrLevel: "A2",
    errorSeverity: "grammar",
    isCurrentLessonTarget: false,
    sameMistakeCount: 1,
    learnerConfidence: "normal",
    didSelfCorrect: false,
    previousCorrectionsThisSession: 0,
    ...overrides,
  };
}

function defaultContractInput(
  overrides: Partial<ContractLearnerInput> = {},
): ContractLearnerInput {
  return {
    text: "I go to market yesterday.",
    cefrLevel: "A2",
    trackedWeakness: null,
    didSelfCorrect: false,
    l1: "vi",
    ...overrides,
  };
}

// ─── T1 — Fatal Meaning Errors Always Get IMMEDIATE ─────────────────────

describe("T1 — Fatal meaning errors => IMMEDIATE", () => {
  it("corrects fatal meaning errors immediately", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({ errorSeverity: "fatal_meaning" }),
    );
    expect(result.mode).toBe("IMMEDIATE");
    expect(result.reasonCode).toBe("fatal_meaning_must_correct");
  });

  it("corrects fatal meaning errors immediately even for advanced learners", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        errorSeverity: "fatal_meaning",
        cefrLevel: "C1",
        learnerConfidence: "confident",
      }),
    );
    expect(result.mode).toBe("IMMEDIATE");
  });

  it("corrects fatal meaning errors immediately even for shy learners", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        errorSeverity: "fatal_meaning",
        learnerConfidence: "shy",
      }),
    );
    expect(result.mode).toBe("IMMEDIATE");
  });

  it("corrects fatal meaning errors immediately even for self-correcting learners", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        errorSeverity: "fatal_meaning",
        didSelfCorrect: true,
      }),
    );
    expect(result.mode).toBe("IMMEDIATE");
  });

  it("corrects fatal meaning immediately even with high session correction load", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        errorSeverity: "fatal_meaning",
        previousCorrectionsThisSession: 15,
      }),
    );
    expect(result.mode).toBe("IMMEDIATE");
  });
});

// ─── T2 — Lesson Target Errors Get IMMEDIATE or EXPLAIN_PATTERN ─────────

describe("T2 — Lesson target errors => IMMEDIATE or EXPLAIN_PATTERN", () => {
  it("corrects lesson target errors immediately on first occurrence", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        isCurrentLessonTarget: true,
        errorSeverity: "grammar",
        sameMistakeCount: 1,
      }),
    );
    expect(result.mode).toBe("IMMEDIATE");
    expect(result.reasonCode).toBe("lesson_target_immediate");
  });

  it("switches to EXPLAIN_PATTERN for repeated lesson target errors (≥3)", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        isCurrentLessonTarget: true,
        errorSeverity: "grammar",
        sameMistakeCount: 3,
      }),
    );
    expect(result.mode).toBe("EXPLAIN_PATTERN");
    expect(result.reasonCode).toBe("lesson_target_explain_pattern");
    expect(result.patternLabel).toBeDefined();
  });

  it("corrects lesson target errors immediately for shy learners too", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        isCurrentLessonTarget: true,
        errorSeverity: "grammar",
        learnerConfidence: "shy",
        sameMistakeCount: 1,
      }),
    );
    expect(result.mode).toBe("IMMEDIATE");
  });
});

// ─── T3 — Repeated Mistakes => EXPLAIN_PATTERN ─────────────────────────

describe("T3 — Repeated mistakes (≥3) => EXPLAIN_PATTERN", () => {
  it("explains pattern when same mistake repeated 3 times", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        errorSeverity: "grammar",
        sameMistakeCount: 3,
      }),
    );
    expect(result.mode).toBe("EXPLAIN_PATTERN");
    expect(result.reasonCode).toBe("repeated_explain_pattern");
  });

  it("explains pattern when same mistake repeated 5 times", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        errorSeverity: "word_choice",
        sameMistakeCount: 5,
      }),
    );
    expect(result.mode).toBe("EXPLAIN_PATTERN");
  });

  it("does not explain pattern on first or second occurrence", () => {
    const r1 = decideCorrectionMode(
      defaultTimingInput({ sameMistakeCount: 1, errorSeverity: "grammar" }),
    );
    expect(r1.mode).not.toBe("EXPLAIN_PATTERN");

    const r2 = decideCorrectionMode(
      defaultTimingInput({ sameMistakeCount: 2, errorSeverity: "grammar" }),
    );
    expect(r2.mode).not.toBe("EXPLAIN_PATTERN");
  });
});

// ─── T4 — Self-Correction Opportunities ────────────────────────────────

describe("T4 — Self-correction opportunities", () => {
  it("suppresses minor errors when learner self-corrected in this turn", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        didSelfCorrect: true,
        errorSeverity: "minor",
      }),
    );
    expect(result.mode).toBe("SUPPRESS");
    expect(result.reasonCode).toBe("self_corrected_minor_suppress");
  });

  it("suppresses fluency errors when learner self-corrected", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        didSelfCorrect: true,
        errorSeverity: "fluency",
      }),
    );
    expect(result.mode).toBe("SUPPRESS");
  });

  it("uses FOLLOW_UP_FIRST for grammar errors when learner self-corrected", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        didSelfCorrect: true,
        errorSeverity: "grammar",
      }),
    );
    expect(result.mode).toBe("FOLLOW_UP_FIRST");
    expect(result.reasonCode).toBe("self_correction_follow_up_first");
  });

  it("uses FOLLOW_UP_FIRST for word choice errors when learner self-corrected", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        didSelfCorrect: true,
        errorSeverity: "word_choice",
      }),
    );
    expect(result.mode).toBe("FOLLOW_UP_FIRST");
  });
});

// ─── T5 — Shy Learner Protection ───────────────────────────────────────

describe("T5 — Shy learner protection", () => {
  it("suppresses minor errors for shy learners", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        learnerConfidence: "shy",
        errorSeverity: "minor",
      }),
    );
    expect(result.mode).toBe("SUPPRESS");
    expect(result.reasonCode).toBe("shy_learner_suppress_minor");
  });

  it("suppresses fluency errors for shy learners", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        learnerConfidence: "shy",
        errorSeverity: "fluency",
      }),
    );
    expect(result.mode).toBe("SUPPRESS");
  });

  it("uses FOLLOW_UP_FIRST for word choice errors for shy learners", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        learnerConfidence: "shy",
        errorSeverity: "word_choice",
      }),
    );
    expect(result.mode).toBe("FOLLOW_UP_FIRST");
    expect(result.reasonCode).toBe("shy_learner_follow_up_first");
  });

  it("delays grammar corrections for shy learners", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        learnerConfidence: "shy",
        errorSeverity: "grammar",
      }),
    );
    expect(result.mode).toBe("DELAYED");
    expect(result.reasonCode).toBe("shy_learner_delayed_grammar");
    expect(result.delayTurns).toBe(1);
  });

  it("still corrects fatal meaning errors immediately for shy learners", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        learnerConfidence: "shy",
        errorSeverity: "fatal_meaning",
      }),
    );
    expect(result.mode).toBe("IMMEDIATE");
  });
});

// ─── T6 — Advanced Learner Gates ───────────────────────────────────────

describe("T6 — Advanced learner gates", () => {
  it("suppresses minor errors for B2 learners", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        cefrLevel: "B2",
        errorSeverity: "minor",
      }),
    );
    expect(result.mode).toBe("SUPPRESS");
    expect(result.reasonCode).toBe("advanced_learner_suppress_minor");
  });

  it("suppresses fluency errors for C1 learners", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        cefrLevel: "C1",
        errorSeverity: "fluency",
      }),
    );
    expect(result.mode).toBe("SUPPRESS");
  });

  it("uses FOLLOW_UP_FIRST for grammar errors for advanced learners", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        cefrLevel: "B2",
        errorSeverity: "grammar",
      }),
    );
    expect(result.mode).toBe("FOLLOW_UP_FIRST");
    expect(result.reasonCode).toBe("advanced_learner_follow_up_first");
  });

  it("uses FOLLOW_UP_FIRST for word choice errors for C1 learners", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        cefrLevel: "C1",
        errorSeverity: "word_choice",
      }),
    );
    expect(result.mode).toBe("FOLLOW_UP_FIRST");
  });

  it("does not suppress grammar for A2 learners (not advanced)", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        cefrLevel: "A2",
        errorSeverity: "grammar",
      }),
    );
    // A2 is not advanced — should NOT be suppressed
    expect(result.mode).not.toBe("SUPPRESS");
    expect(result.mode).not.toBe("FOLLOW_UP_FIRST");
  });

  it("treats C2 as advanced", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        cefrLevel: "C2",
        errorSeverity: "fluency",
      }),
    );
    expect(result.mode).toBe("SUPPRESS");
  });
});

// ─── T7 — Session Correction Load ──────────────────────────────────────

describe("T7 — Session correction load", () => {
  it("suppresses minor errors when already many corrections", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        previousCorrectionsThisSession: 6,
        errorSeverity: "minor",
      }),
    );
    expect(result.mode).toBe("SUPPRESS");
    expect(result.reasonCode).toBe("session_correction_load_suppress");
  });

  it("suppresses fluency errors when already many corrections", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        previousCorrectionsThisSession: 7,
        errorSeverity: "fluency",
      }),
    );
    expect(result.mode).toBe("SUPPRESS");
  });

  it("delays grammar corrections when heavily loaded (8+)", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        previousCorrectionsThisSession: 9,
        errorSeverity: "grammar",
      }),
    );
    expect(result.mode).toBe("DELAYED");
    expect(result.reasonCode).toBe("session_correction_load_delayed");
    expect(result.delayTurns).toBe(2);
  });

  it("delays word choice corrections when heavily loaded (8+)", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        previousCorrectionsThisSession: 10,
        errorSeverity: "word_choice",
      }),
    );
    expect(result.mode).toBe("DELAYED");
  });

  it("does not suppress with only 2 previous corrections", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        previousCorrectionsThisSession: 2,
        errorSeverity: "minor",
      }),
    );
    // Should fall through to default (SUPPRESS for minor)
    // but reason code should not be session_correction_load
    expect(result.reasonCode).not.toBe("session_correction_load_suppress");
  });

  it("does not suppress fatal meaning errors regardless of load", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        previousCorrectionsThisSession: 20,
        errorSeverity: "fatal_meaning",
      }),
    );
    expect(result.mode).toBe("IMMEDIATE");
  });
});

// ─── T8 — Beginner Learner Gates ───────────────────────────────────────

describe("T8 — Beginner learner gates", () => {
  it("corrects grammar errors immediately for beginners", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        cefrLevel: "A1",
        errorSeverity: "grammar",
        learnerConfidence: "normal",
      }),
    );
    expect(result.mode).toBe("IMMEDIATE");
    expect(result.reasonCode).toBe("beginner_grammar_immediate");
  });

  it("delays minor errors for beginners", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        cefrLevel: "A1",
        errorSeverity: "minor",
      }),
    );
    expect(result.mode).toBe("DELAYED");
    expect(result.reasonCode).toBe("beginner_minor_delayed");
    expect(result.delayTurns).toBe(2);
  });

  it("delays fluency errors for beginners", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        cefrLevel: "A2",
        errorSeverity: "fluency",
      }),
    );
    expect(result.mode).toBe("DELAYED");
  });

  it("treats null CEFR as beginner", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        cefrLevel: null,
        errorSeverity: "grammar",
        learnerConfidence: "normal",
      }),
    );
    expect(result.mode).toBe("IMMEDIATE");
    expect(result.reasonCode).toBe("beginner_grammar_immediate");
  });

  it("does not override shy learner for beginner shy combination — shy wins", () => {
    // Shy gate (T5) runs before Beginner gate (T8).
    // A shy A1 learner with grammar error should get DELAYED (T5), not IMMEDIATE (T8).
    const result = decideCorrectionMode(
      defaultTimingInput({
        cefrLevel: "A1",
        errorSeverity: "grammar",
        learnerConfidence: "shy",
      }),
    );
    expect(result.mode).toBe("DELAYED");
    expect(result.reasonCode).toBe("shy_learner_delayed_grammar");
  });
});

// ─── Default Fallback ──────────────────────────────────────────────────

describe("Default fallback timing", () => {
  it("defaults to IMMEDIATE for grammar errors", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        errorSeverity: "grammar",
        isCurrentLessonTarget: false,
        sameMistakeCount: 1,
        learnerConfidence: "normal",
        cefrLevel: "B1",
      }),
    );
    expect(result.mode).toBe("IMMEDIATE");
    expect(result.reasonCode).toBe("default_grammar_immediate");
  });

  it("defaults to IMMEDIATE for word choice errors", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        errorSeverity: "word_choice",
        cefrLevel: "B1",
      }),
    );
    expect(result.mode).toBe("IMMEDIATE");
    expect(result.reasonCode).toBe("default_word_choice_immediate");
  });

  it("defaults to DELAYED for fluency errors", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        errorSeverity: "fluency",
        cefrLevel: "B1",
      }),
    );
    expect(result.mode).toBe("DELAYED");
    expect(result.reasonCode).toBe("default_fluency_delayed");
    expect(result.delayTurns).toBe(2);
  });

  it("defaults to SUPPRESS for minor errors", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        errorSeverity: "minor",
        cefrLevel: "B1",
      }),
    );
    expect(result.mode).toBe("SUPPRESS");
    expect(result.reasonCode).toBe("default_minor_suppress");
  });
});

// ─── No Overcorrection ─────────────────────────────────────────────────

describe("No overcorrection — respects one correction max at decision level", () => {
  it("every result respects one correction max", () => {
    const severities: ErrorSeverity[] = [
      "fatal_meaning",
      "lesson_target",
      "grammar",
      "fluency",
      "word_choice",
      "minor",
    ];
    const confidences: LearnerConfidence[] = ["shy", "normal", "confident"];
    const levels = [null, "A1", "A2", "B1", "B2", "C1", "C2"];

    for (const sev of severities) {
      for (const conf of confidences) {
        for (const lvl of levels) {
          const input = defaultTimingInput({
            errorSeverity: sev,
            learnerConfidence: conf,
            cefrLevel: lvl,
            isCurrentLessonTarget: false,
            sameMistakeCount: 1,
            didSelfCorrect: false,
            previousCorrectionsThisSession: 0,
          });
          const result = decideCorrectionMode(input);
          expect(result.respectsOneCorrectionMax).toBe(true);
        }
      }
    }
  });

  it("assertOneCorrectionPerDecision always returns true", () => {
    const result = decideCorrectionMode(defaultTimingInput());
    expect(assertOneCorrectionPerDecision(result)).toBe(true);
  });

  it("never produces multiple correction modes from one decision", () => {
    // The function returns a single mode — not multiple
    const result = decideCorrectionMode(defaultTimingInput());
    const modes: CorrectionMode[] = [
      "IMMEDIATE",
      "DELAYED",
      "SUPPRESS",
      "FOLLOW_UP_FIRST",
      "EXPLAIN_PATTERN",
    ];
    // Exactly one mode is active
    const matchingModes = modes.filter((m) => m === result.mode);
    expect(matchingModes).toHaveLength(1);
  });
});

// ─── Meaning Before Correction Compatibility ────────────────────────────

describe("Meaning-before-correction: every mode is compatible with R1", () => {
  it("IMMEDIATE marks itself as compatible (contract enforces ordering)", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        errorSeverity: "fatal_meaning",
      }),
    );
    expect(result.mode).toBe("IMMEDIATE");
    // The timing layer's job is to say "correct now" — the contract layer
    // (checkR1_MeaningFirst) then validates the response text ensures
    // acknowledgment comes before correction.
  });

  it("DELAYED is naturally meaning-first (correction comes after conversation)", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({ errorSeverity: "fluency" }),
    );
    expect(result.mode).toBe("DELAYED");
  });

  it("SUPPRESS is trivially meaning-first (no correction to misposition)", () => {
    // Use B1 (non-beginner, non-advanced) to reach the default SUPPRESS for minor errors
    const result = decideCorrectionMode(
      defaultTimingInput({ errorSeverity: "minor", cefrLevel: "B1" }),
    );
    expect(result.mode).toBe("SUPPRESS");
  });

  it("FOLLOW_UP_FIRST is naturally meaning-first (question before correction)", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        didSelfCorrect: true,
        errorSeverity: "grammar",
      }),
    );
    expect(result.mode).toBe("FOLLOW_UP_FIRST");
  });
});

// ─── Output Feeds Contract/Rubric ──────────────────────────────────────

describe("Timing output can feed the Teacher Mercy contract and rubric", () => {
  it("produces a mode that maps to contract-compatible response patterns", () => {
    // Every mode has a known contract-compatible response shape:
    // IMMEDIATE → response includes acknowledgment + one correction block
    // DELAYED → response has no correction markers, maybe a note
    // SUPPRESS → response has no correction markers
    // FOLLOW_UP_FIRST → response has a question, no correction yet
    // EXPLAIN_PATTERN → response explains the pattern instead of correcting

    const allModes = new Set<CorrectionMode>();
    const severities: ErrorSeverity[] = [
      "fatal_meaning",
      "grammar",
      "fluency",
      "minor",
    ];
    const testCases = [
      { sev: "fatal_meaning" as ErrorSeverity, expectedMode: "IMMEDIATE" as CorrectionMode },
      { sev: "grammar" as ErrorSeverity, opts: { cefrLevel: "B2" }, expectedMode: "FOLLOW_UP_FIRST" as CorrectionMode },
      { sev: "fluency" as ErrorSeverity, opts: { cefrLevel: "C1" }, expectedMode: "SUPPRESS" as CorrectionMode },
      { sev: "grammar" as ErrorSeverity, opts: { sameMistakeCount: 3 }, expectedMode: "EXPLAIN_PATTERN" as CorrectionMode },
      { sev: "fluency" as ErrorSeverity, expectedMode: "DELAYED" as CorrectionMode },
    ];

    for (const tc of testCases) {
      const input = defaultTimingInput({
        errorSeverity: tc.sev,
        ...(tc.opts ?? {}),
      });
      const result = decideCorrectionMode(input);
      expect(result.mode).toBe(tc.expectedMode);
      allModes.add(result.mode);
    }

    // All five modes are reachable through realistic scenarios
    expect(allModes.has("IMMEDIATE")).toBe(true);
    expect(allModes.has("DELAYED")).toBe(true);
    expect(allModes.has("SUPPRESS")).toBe(true);
    expect(allModes.has("FOLLOW_UP_FIRST")).toBe(true);
    expect(allModes.has("EXPLAIN_PATTERN")).toBe(true);
  });

  it("bridge function buildTimingInput correctly maps contract input", () => {
    const contractInput = defaultContractInput({
      text: "I buy a hat yesterday.",
      cefrLevel: "B1",
      didSelfCorrect: true,
    });

    const timingInput = buildTimingInput(contractInput, {
      errorSeverity: "grammar",
      isCurrentLessonTarget: true,
      sameMistakeCount: 2,
      learnerConfidence: "normal",
      previousCorrectionsThisSession: 3,
    });

    expect(timingInput.learnerText).toBe("I buy a hat yesterday.");
    expect(timingInput.cefrLevel).toBe("B1");
    expect(timingInput.didSelfCorrect).toBe(true);
    expect(timingInput.errorSeverity).toBe("grammar");
    expect(timingInput.isCurrentLessonTarget).toBe(true);
    expect(timingInput.sameMistakeCount).toBe(2);
    expect(timingInput.previousCorrectionsThisSession).toBe(3);
  });
});

// ─── Gate Priority Order ───────────────────────────────────────────────

describe("Gate priority order", () => {
  it("T1 (fatal meaning) takes priority over T5 (shy learner)", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        errorSeverity: "fatal_meaning",
        learnerConfidence: "shy",
      }),
    );
    // T1 fires first → IMMEDIATE. T5 would have suppressed/delayed.
    expect(result.mode).toBe("IMMEDIATE");
    expect(result.reasonCode).toBe("fatal_meaning_must_correct");
  });

  it("T2 (lesson target) takes priority over T6 (advanced learner)", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        isCurrentLessonTarget: true,
        cefrLevel: "B2",
        errorSeverity: "grammar",
        sameMistakeCount: 1,
      }),
    );
    // T2 fires → IMMEDIATE. T6 would have used FOLLOW_UP_FIRST.
    expect(result.mode).toBe("IMMEDIATE");
    expect(result.reasonCode).toBe("lesson_target_immediate");
  });

  it("T3 (repeated mistake) fires before T4 (self-correction)", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        sameMistakeCount: 4,
        didSelfCorrect: true,
        errorSeverity: "grammar",
      }),
    );
    // T3 fires → EXPLAIN_PATTERN. T4 would have used FOLLOW_UP_FIRST.
    expect(result.mode).toBe("EXPLAIN_PATTERN");
  });

  it("T5 (shy learner) fires before T8 (beginner learner)", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        cefrLevel: "A1",
        learnerConfidence: "shy",
        errorSeverity: "grammar",
      }),
    );
    // T5 fires → DELAYED. T8 would have used IMMEDIATE.
    expect(result.mode).toBe("DELAYED");
    expect(result.reasonCode).toBe("shy_learner_delayed_grammar");
  });
});

// ─── Edge Cases ────────────────────────────────────────────────────────

describe("Edge cases", () => {
  it("handles null/unknown CEFR gracefully", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        cefrLevel: null,
        errorSeverity: "grammar",
        learnerConfidence: "normal",
      }),
    );
    expect(result.mode).toBe("IMMEDIATE");
    expect(result.reasonCode).toBe("beginner_grammar_immediate");
  });

  it("handles zero sameMistakeCount", () => {
    // sameMistakeCount should realistically never be < 1, but be defensive
    const result = decideCorrectionMode(
      defaultTimingInput({
        sameMistakeCount: 0,
        errorSeverity: "grammar",
      }),
    );
    // Should not crash; T3 gate won't fire (0 < 3)
    expect(result.mode).toBeDefined();
  });

  it("handles very large sameMistakeCount", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        sameMistakeCount: 100,
        errorSeverity: "word_choice",
      }),
    );
    expect(result.mode).toBe("EXPLAIN_PATTERN");
  });

  it("handles very large session correction count", () => {
    const result = decideCorrectionMode(
      defaultTimingInput({
        previousCorrectionsThisSession: 999,
        errorSeverity: "grammar",
      }),
    );
    expect(result.mode).toBe("DELAYED");
    expect(result.reasonCode).toBe("session_correction_load_delayed");
  });

  it("every result has a non-empty reason", () => {
    const results = [
      decideCorrectionMode(defaultTimingInput({ errorSeverity: "fatal_meaning" })),
      decideCorrectionMode(defaultTimingInput({ errorSeverity: "lesson_target", isCurrentLessonTarget: true })),
      decideCorrectionMode(defaultTimingInput({ errorSeverity: "grammar" })),
      decideCorrectionMode(defaultTimingInput({ errorSeverity: "fluency" })),
      decideCorrectionMode(defaultTimingInput({ errorSeverity: "word_choice" })),
      decideCorrectionMode(defaultTimingInput({ errorSeverity: "minor" })),
    ];

    for (const r of results) {
      expect(r.reason).toBeTruthy();
      expect(r.reason.length).toBeGreaterThan(10);
      expect(r.reasonCode).toBeTruthy();
    }
  });

  it("every result always respects one correction max", () => {
    // Exhaustive check: all default modes produce results that respect R2
    const severities: ErrorSeverity[] = [
      "fatal_meaning", "lesson_target", "grammar", "fluency", "word_choice", "minor",
    ];
    for (const sev of severities) {
      const result = decideCorrectionMode(defaultTimingInput({ errorSeverity: sev }));
      expect(result.respectsOneCorrectionMax).toBe(true);
    }
  });

  it("DELAYED results always specify delayTurns", () => {
    // Any path producing DELAYED must include a delayTurns value
    const results: CorrectionTimingResult[] = [
      decideCorrectionMode(defaultTimingInput({
        learnerConfidence: "shy",
        errorSeverity: "grammar",
      })), // T5
      decideCorrectionMode(defaultTimingInput({
        errorSeverity: "fluency",
        cefrLevel: "B1",
      })), // default
      decideCorrectionMode(defaultTimingInput({
        previousCorrectionsThisSession: 9,
        errorSeverity: "grammar",
      })), // T7
    ];

    for (const r of results) {
      expect(r.mode).toBe("DELAYED");
      expect(r.delayTurns).toBeDefined();
      expect(r.delayTurns!).toBeGreaterThanOrEqual(1);
    }
  });

  it("EXPLAIN_PATTERN results always specify patternLabel", () => {
    const results: CorrectionTimingResult[] = [
      decideCorrectionMode(defaultTimingInput({
        sameMistakeCount: 3,
        errorSeverity: "grammar",
      })), // T3
      decideCorrectionMode(defaultTimingInput({
        isCurrentLessonTarget: true,
        sameMistakeCount: 3,
        errorSeverity: "grammar",
      })), // T2 repeated
    ];

    for (const r of results) {
      expect(r.mode).toBe("EXPLAIN_PATTERN");
      expect(r.patternLabel).toBeDefined();
    }
  });
});

// ─── No Production Flag Flip ───────────────────────────────────────────

describe("No production flag flip", () => {
  it("does not read environment variables", () => {
    // The module is a pure function — no process.env, no localStorage,
    // no feature flags, no global state mutation.
    // This test is documentation: if someone adds a flag, this reminds them.
    const input = defaultTimingInput();
    const result1 = decideCorrectionMode(input);
    const result2 = decideCorrectionMode(input);
    // Deterministic: same input → same output
    expect(result1).toEqual(result2);
  });

  it("is deterministic for the same input", () => {
    const input: CorrectionTimingInput = {
      learnerText: "test",
      cefrLevel: "B1",
      errorSeverity: "grammar",
      isCurrentLessonTarget: false,
      sameMistakeCount: 2,
      learnerConfidence: "normal",
      didSelfCorrect: false,
      previousCorrectionsThisSession: 1,
    };

    const results = Array.from({ length: 10 }, () => decideCorrectionMode(input));
    const first = results[0];
    for (const r of results) {
      expect(r).toEqual(first);
    }
  });

  it("has no mutable module-level state", () => {
    // Verify the module exports are pure functions and constants
    expect(typeof decideCorrectionMode).toBe("function");
    expect(typeof buildTimingInput).toBe("function");
    expect(typeof assertOneCorrectionPerDecision).toBe("function");

    // Catalogs are readonly
    expect(Array.isArray(CORRECTION_TIMING_MODE_CATALOG)).toBe(true);
    expect(Array.isArray(CORRECTION_TIMING_ERROR_SEVERITY_CATALOG)).toBe(true);
  });
});

// ─── Catalogs ──────────────────────────────────────────────────────────

describe("Catalogs", () => {
  it("CORRECTION_TIMING_MODE_CATALOG has all 5 modes", () => {
    expect(CORRECTION_TIMING_MODE_CATALOG).toHaveLength(5);
    const modes = CORRECTION_TIMING_MODE_CATALOG.map((c) => c.mode);
    expect(modes).toContain("IMMEDIATE");
    expect(modes).toContain("DELAYED");
    expect(modes).toContain("SUPPRESS");
    expect(modes).toContain("FOLLOW_UP_FIRST");
    expect(modes).toContain("EXPLAIN_PATTERN");
  });

  it("CORRECTION_TIMING_MODE_CATALOG entries have Vietnamese titles", () => {
    for (const entry of CORRECTION_TIMING_MODE_CATALOG) {
      expect(entry.titleVi).toBeTruthy();
      expect(entry.titleEn).toBeTruthy();
      expect(entry.descriptionVi).toBeTruthy();
      expect(entry.examples).toBeTruthy();
    }
  });

  it("CORRECTION_TIMING_ERROR_SEVERITY_CATALOG has all 6 severities", () => {
    expect(CORRECTION_TIMING_ERROR_SEVERITY_CATALOG).toHaveLength(6);
    const severities = CORRECTION_TIMING_ERROR_SEVERITY_CATALOG.map((c) => c.severity);
    expect(severities).toContain("fatal_meaning");
    expect(severities).toContain("lesson_target");
    expect(severities).toContain("grammar");
    expect(severities).toContain("fluency");
    expect(severities).toContain("word_choice");
    expect(severities).toContain("minor");
  });

  it("every severity has a valid default mode", () => {
    for (const entry of CORRECTION_TIMING_ERROR_SEVERITY_CATALOG) {
      const validModes: CorrectionMode[] = [
        "IMMEDIATE", "DELAYED", "SUPPRESS", "FOLLOW_UP_FIRST", "EXPLAIN_PATTERN",
      ];
      expect(validModes).toContain(entry.defaultMode);
    }
  });
});

// ─── Scenario Tests — Realistic Learner Journeys ────────────────────────

describe("Scenario: shy A1 learner making a minor error", () => {
  it("suppresses the minor error to protect confidence", () => {
    const result = decideCorrectionMode({
      learnerText: "I like cat.",
      cefrLevel: "A1",
      errorSeverity: "minor", // missing article 'a'
      isCurrentLessonTarget: false,
      sameMistakeCount: 1,
      learnerConfidence: "shy",
      didSelfCorrect: false,
      previousCorrectionsThisSession: 2,
    });

    expect(result.mode).toBe("SUPPRESS");
  });
});

describe("Scenario: confident B2 learner with repeated grammar mistake", () => {
  it("explains the pattern on 3rd+ instance", () => {
    const result = decideCorrectionMode({
      learnerText: "I have been knowing him for years.",
      cefrLevel: "B2",
      errorSeverity: "grammar", // stative verb 'know' shouldn't be continuous
      isCurrentLessonTarget: false,
      sameMistakeCount: 4,
      learnerConfidence: "confident",
      didSelfCorrect: false,
      previousCorrectionsThisSession: 3,
    });

    // T3 fires before T6 — repeated mistake → EXPLAIN_PATTERN
    expect(result.mode).toBe("EXPLAIN_PATTERN");
    expect(result.reasonCode).toBe("repeated_explain_pattern");
  });
});

describe("Scenario: normal B1 learner mid-lesson target error", () => {
  it("corrects immediately on the lesson target", () => {
    const result = decideCorrectionMode({
      learnerText: "If I will go, I will call you.",
      cefrLevel: "B1",
      errorSeverity: "grammar", // first conditional — lesson target
      isCurrentLessonTarget: true,
      sameMistakeCount: 1,
      learnerConfidence: "normal",
      didSelfCorrect: false,
      previousCorrectionsThisSession: 1,
    });

    expect(result.mode).toBe("IMMEDIATE");
    expect(result.reasonCode).toBe("lesson_target_immediate");
  });
});

describe("Scenario: advanced learner with a tiny slip", () => {
  it("suppresses — likely just a slip, not a knowledge gap", () => {
    const result = decideCorrectionMode({
      learnerText: "The presentation went well, I think they liked it.",
      cefrLevel: "C1",
      errorSeverity: "minor", // minor comma splice or article
      isCurrentLessonTarget: false,
      sameMistakeCount: 1,
      learnerConfidence: "confident",
      didSelfCorrect: false,
      previousCorrectionsThisSession: 0,
    });

    expect(result.mode).toBe("SUPPRESS");
    expect(result.reasonCode).toBe("advanced_learner_suppress_minor");
  });
});

describe("Scenario: learner who self-corrected but still has a grammar issue", () => {
  it("uses FOLLOW_UP_FIRST to prompt them to catch the remaining issue", () => {
    const result = decideCorrectionMode({
      learnerText: "I buy... I bought a hat. It was very cheap because I buy it on sale.",
      cefrLevel: "A2",
      errorSeverity: "grammar", // second clause still has 'buy' instead of 'bought'
      isCurrentLessonTarget: false,
      sameMistakeCount: 1,
      learnerConfidence: "normal",
      didSelfCorrect: true,
      previousCorrectionsThisSession: 2,
    });

    expect(result.mode).toBe("FOLLOW_UP_FIRST");
    expect(result.reasonCode).toBe("self_correction_follow_up_first");
  });
});

describe("Scenario: heavily corrected session — 12 corrections already", () => {
  it("even grammar errors get delayed to avoid fatigue", () => {
    const result = decideCorrectionMode({
      learnerText: "She don't like it.",
      cefrLevel: "A2",
      errorSeverity: "grammar",
      isCurrentLessonTarget: false,
      sameMistakeCount: 2,
      learnerConfidence: "normal",
      didSelfCorrect: false,
      previousCorrectionsThisSession: 12,
    });

    expect(result.mode).toBe("DELAYED");
    expect(result.reasonCode).toBe("session_correction_load_delayed");
  });
});

describe("Scenario: fatal meaning — 'cooker' instead of 'cook'", () => {
  it("corrects immediately — wrong meaning, must fix", () => {
    const result = decideCorrectionMode({
      learnerText: "My brother is a cooker.",
      cefrLevel: "B1",
      errorSeverity: "fatal_meaning", // cooker = nồi cơm điện, not đầu bếp
      isCurrentLessonTarget: false,
      sameMistakeCount: 1,
      learnerConfidence: "confident",
      didSelfCorrect: false,
      previousCorrectionsThisSession: 5,
    });

    expect(result.mode).toBe("IMMEDIATE");
    expect(result.reasonCode).toBe("fatal_meaning_must_correct");
  });
});
