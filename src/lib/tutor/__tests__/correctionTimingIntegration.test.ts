import { describe, expect, it } from "vitest";
import {
  correctWithTimingAwareness,
  createDeferredCorrectionQueue,
  detectSelfCorrectionInText,
  inferErrorSeverity,
  inferLearnerConfidence,
  buildSuppressMessage,
  buildDeferredSurfacingMessage,
  type DeferredCorrection,
  type TimingIntegrationInput,
} from "../correctionTimingIntegration";
import type { CorrectionEngineResult } from "../correctionEngine";

// ─── Helper ────────────────────────────────────────────────────────────────

function defaultInput(
  overrides: Partial<TimingIntegrationInput> = {},
): TimingIntegrationInput {
  return {
    learnerText: "I go to school yesterday.",
    targetLanguage: "en",
    cefrLevel: "A2",
    isCurrentLessonTarget: false,
    sameMistakeCount: 1,
    previousCorrectionsThisSession: 0,
    ...overrides,
  };
}

// ─── Severity Inference ────────────────────────────────────────────────────

describe("inferErrorSeverity", () => {
  it("infers fatal_meaning from needs_ai with semanticHint", () => {
    const result: CorrectionEngineResult = {
      status: "needs_ai",
      corrected: "",
      appliedRuleIds: [],
      message: "AI required",
      semanticHint: "Did you mean hat?",
    };
    expect(inferErrorSeverity(result)).toBe("fatal_meaning");
  });

  it("infers grammar from needs_ai without semanticHint", () => {
    const result: CorrectionEngineResult = {
      status: "needs_ai",
      corrected: "",
      appliedRuleIds: [],
      message: "AI required",
    };
    expect(inferErrorSeverity(result)).toBe("grammar");
  });

  it("infers minor from unchanged status", () => {
    const result: CorrectionEngineResult = {
      status: "unchanged",
      corrected: "I went to school.",
      appliedRuleIds: [],
    };
    expect(inferErrorSeverity(result)).toBe("minor");
  });

  it("infers lesson_target from past-tense rule", () => {
    const result: CorrectionEngineResult = {
      status: "corrected",
      corrected: "I went to school yesterday.",
      appliedRuleIds: ["en-yesterday-irregular-beginner-past"],
    };
    expect(inferErrorSeverity(result)).toBe("lesson_target");
  });

  it("infers lesson_target from subject-verb agreement rule", () => {
    const result: CorrectionEngineResult = {
      status: "corrected",
      corrected: "She goes to school.",
      appliedRuleIds: ["en-step5-subject-verb-agreement"],
    };
    expect(inferErrorSeverity(result)).toBe("lesson_target");
  });

  it("infers lesson_target from preposition rule", () => {
    const result: CorrectionEngineResult = {
      status: "corrected",
      corrected: "I go to school.",
      appliedRuleIds: ["en-step5-preposition-pattern"],
    };
    expect(inferErrorSeverity(result)).toBe("lesson_target");
  });

  it("infers word_choice from calque rule", () => {
    const result: CorrectionEngineResult = {
      status: "corrected",
      corrected: "Turn on the light.",
      appliedRuleIds: ["en-calque-open-turn-on-appliance"],
    };
    expect(inferErrorSeverity(result)).toBe("word_choice");
  });

  it("infers word_choice from collocation rule", () => {
    const result: CorrectionEngineResult = {
      status: "corrected",
      corrected: "I do homework every day.",
      appliedRuleIds: ["en-vietlish-collocation-do-homework"],
    };
    expect(inferErrorSeverity(result)).toBe("word_choice");
  });

  it("infers minor from punctuation rule", () => {
    const result: CorrectionEngineResult = {
      status: "corrected",
      corrected: "What is your name?",
      appliedRuleIds: ["en-question-form-final-mark"],
    };
    expect(inferErrorSeverity(result)).toBe("minor");
  });

  it("infers minor from run-on rule", () => {
    const result: CorrectionEngineResult = {
      status: "corrected",
      corrected: "I went. I ate.",
      appliedRuleIds: ["runon-segmented"],
    };
    expect(inferErrorSeverity(result)).toBe("minor");
  });

  it("infers grammar from article rule", () => {
    const result: CorrectionEngineResult = {
      status: "corrected",
      corrected: "I bought a hat.",
      appliedRuleIds: ["en-l4-missing-singular-article"],
    };
    expect(inferErrorSeverity(result)).toBe("grammar");
  });

  it("infers grammar from be-verb rule", () => {
    const result: CorrectionEngineResult = {
      status: "corrected",
      corrected: "She is very happy.",
      appliedRuleIds: ["en-be-verb-omission"],
    };
    expect(inferErrorSeverity(result)).toBe("grammar");
  });

  it("infers grammar from possessive rule", () => {
    const result: CorrectionEngineResult = {
      status: "corrected",
      corrected: "My mother's car.",
      appliedRuleIds: ["en-step6-possessive-s"],
    };
    expect(inferErrorSeverity(result)).toBe("grammar");
  });

  it("infers fatal_meaning from existential-have rule", () => {
    const result: CorrectionEngineResult = {
      status: "corrected",
      corrected: "There are many parks.",
      appliedRuleIds: ["en-existential-have-there-is"],
    };
    expect(inferErrorSeverity(result)).toBe("fatal_meaning");
  });

  it("infers fluency as default for corrected sentences without strong signals", () => {
    const result: CorrectionEngineResult = {
      status: "corrected",
      corrected: "Fixed text.",
      appliedRuleIds: ["some-unknown-rule"],
    };
    expect(inferErrorSeverity(result)).toBe("fluency");
  });
});

// ─── Confidence Inference ──────────────────────────────────────────────────

describe("inferLearnerConfidence", () => {
  it("identifies shy learners from very short input", () => {
    expect(inferLearnerConfidence("I go.")).toBe("shy");
  });

  it("identifies shy learners from hesitation markers", () => {
    expect(inferLearnerConfidence("I maybe go to school")).toBe("shy");
    expect(inferLearnerConfidence("perhaps I went")).toBe("shy");
  });

  it("identifies shy learners from ellipsis", () => {
    expect(inferLearnerConfidence("I went...")).toBe("shy");
  });

  it("identifies confident learners from longer flowing sentences", () => {
    expect(
      inferLearnerConfidence("I went to school yesterday and I learned many new things"),
    ).toBe("confident");
  });

  it("identifies normal confidence for typical sentences", () => {
    expect(inferLearnerConfidence("I went to school")).toBe("normal");
    expect(inferLearnerConfidence("She is a teacher")).toBe("normal");
  });

  it("returns normal for empty input", () => {
    expect(inferLearnerConfidence("")).toBe("normal");
  });
});

// ─── Self-Correction Detection ─────────────────────────────────────────────

describe("detectSelfCorrectionInText", () => {
  it("detects word repetition as self-correction", () => {
    expect(detectSelfCorrectionInText("I I bought a hat")).toBe(true);
  });

  it("detects ellipsis as self-correction pause", () => {
    expect(detectSelfCorrectionInText("I buy... I bought a hat")).toBe(true);
  });

  it("detects explicit 'I mean' as self-correction", () => {
    expect(detectSelfCorrectionInText("I buy, I mean I bought a hat")).toBe(true);
  });

  it("detects explicit 'sorry' as self-correction", () => {
    expect(detectSelfCorrectionInText("I buy, sorry, I bought a hat")).toBe(true);
  });

  it("detects 'no wait' as self-correction", () => {
    expect(detectSelfCorrectionInText("I buy, no wait, I bought a hat")).toBe(true);
  });

  it("detects 'actually' as self-correction", () => {
    expect(detectSelfCorrectionInText("I buy, actually I bought a hat")).toBe(true);
  });

  it("does not flag normal sentences", () => {
    expect(detectSelfCorrectionInText("I bought a hat yesterday")).toBe(false);
    expect(detectSelfCorrectionInText("She is a teacher")).toBe(false);
  });

  it("returns false for empty input", () => {
    expect(detectSelfCorrectionInText("")).toBe(false);
  });
});

// ─── Timing-Aware Correction ───────────────────────────────────────────────

describe("correctWithTimingAwareness", () => {
  // ── IMMEDIATE paths ────────────────────────────────────────────────

  it("returns shouldShowNow=true for past-tense errors (lesson target → IMMEDIATE)", () => {
    const result = correctWithTimingAwareness(
      defaultInput({ learnerText: "I buy a hat yesterday." }),
    );
    expect(result.correction.status).toBe("corrected");
    expect(result.timing.mode).toBe("IMMEDIATE");
    expect(result.shouldShowNow).toBe(true);
    expect(result.shouldDefer).toBe(false);
    expect(result.shouldSuppress).toBe(false);
  });

  it("returns shouldShowNow=true for subject-verb agreement (lesson target → IMMEDIATE)", () => {
    const result = correctWithTimingAwareness(
      defaultInput({
        learnerText: "She go to school.",
        cefrLevel: "A2",
      }),
    );
    expect(result.correction.status).toBe("corrected");
    expect(result.timing.mode).toBe("IMMEDIATE");
    expect(result.shouldShowNow).toBe(true);
  });

  it("returns shouldShowNow=true for fatal meaning errors even with high correction load", () => {
    const result = correctWithTimingAwareness(
      defaultInput({
        learnerText: "In my city have many parks.",
        previousCorrectionsThisSession: 15,
      }),
    );
    expect(result.timing.mode).toBe("IMMEDIATE");
    expect(result.shouldShowNow).toBe(true);
  });

  // ── SUPPRESS paths ─────────────────────────────────────────────────

  it("returns shouldSuppress=true for minor errors (punctuation fixes)", () => {
    const result = correctWithTimingAwareness(
      defaultInput({
        learnerText: "what do you usually do in the morning",
        cefrLevel: "B1",
      }),
    );
    expect(result.timing.mode).toBe("SUPPRESS");
    expect(result.shouldSuppress).toBe(true);
    expect(result.shouldShowNow).toBe(false);
  });

  it("returns shouldSuppress=true for run-on segmentation (minor)", () => {
    const result = correctWithTimingAwareness(
      defaultInput({
        learnerText:
          "I study English every day and I practice speaking every day and I listen to music every day.",
        cefrLevel: "B1",
      }),
    );
    // Run-on segmentation → minor → default SUPPRESS at B1
    expect(result.shouldSuppress).toBe(true);
  });

  it("returns shouldSuppress=true for advanced learner with minor slip", () => {
    const result = correctWithTimingAwareness(
      defaultInput({
        learnerText: "what do you usually do in the morning",
        cefrLevel: "C1",
      }),
    );
    expect(result.timing.mode).toBe("SUPPRESS");
    expect(result.timing.reasonCode).toBe("advanced_learner_suppress_minor");
  });

  // ── DELAYED paths ──────────────────────────────────────────────────

  it("returns shouldDefer=true for high session correction load", () => {
    // "he bought bicycle yesterday" → article rule corrects to "He bought a bicycle yesterday."
    // 5 words = not shy, grammar severity → T7: 8+ corrections + grammar → DELAYED
    const result = correctWithTimingAwareness(
      defaultInput({
        learnerText: "he bought bicycle yesterday",
        previousCorrectionsThisSession: 10,
      }),
    );
    expect(result.correction.status).toBe("corrected");
    expect(result.timing.mode).toBe("DELAYED");
    expect(result.timing.reasonCode).toBe("session_correction_load_delayed");
    expect(result.shouldDefer).toBe(true);
    expect(result.shouldShowNow).toBe(false);
  });

  it("returns shouldDefer=true for shy learner with grammar error", () => {
    // Short (3 words) input that gets corrected by the article rule → grammar severity
    // T5: shy + grammar → DELAYED (delayTurns=1)
    const result = correctWithTimingAwareness(
      defaultInput({
        learnerText: "I bought hat",
        cefrLevel: "A1",
      }),
    );
    expect(result.correction.status).toBe("corrected");
    expect(result.timing.mode).toBe("DELAYED");
    expect(result.timing.reasonCode).toBe("shy_learner_delayed_grammar");
    expect(result.shouldDefer).toBe(true);
  });

  // ── FOLLOW_UP_FIRST paths ──────────────────────────────────────────

  it("returns shouldDefer=true for advanced learner grammar via FOLLOW_UP_FIRST", () => {
    // "she bought bicycle yesterday" → article + past → grammar severity
    // 5 words = not shy, B2 level → T6: advanced + grammar → FOLLOW_UP_FIRST
    const result = correctWithTimingAwareness(
      defaultInput({
        learnerText: "she bought bicycle yesterday",
        cefrLevel: "B2",
      }),
    );
    expect(result.correction.status).toBe("corrected");
    expect(result.timing.mode).toBe("FOLLOW_UP_FIRST");
    expect(result.timing.reasonCode).toBe("advanced_learner_follow_up_first");
    expect(result.shouldDefer).toBe(true);
    expect(result.shouldShowNow).toBe(false);
  });

  it("returns shouldDefer=true for self-corrected learner", () => {
    // "I mean" triggers self-correction detection
    // Article rule corrects "bought hat" → grammar severity
    // T4: self-corrected + grammar → FOLLOW_UP_FIRST
    const result = correctWithTimingAwareness(
      defaultInput({
        learnerText: "I mean I bought hat",
        cefrLevel: "A2",
        previousCorrectionsThisSession: 2,
      }),
    );
    expect(result.correction.status).toBe("corrected");
    expect(result.timing.mode).toBe("FOLLOW_UP_FIRST");
    expect(result.shouldDefer).toBe(true);
  });

  // ── EXPLAIN_PATTERN paths ──────────────────────────────────────────

  it("returns shouldShowNow=true for EXPLAIN_PATTERN (treated like IMMEDIATE for display)", () => {
    const result = correctWithTimingAwareness(
      defaultInput({
        learnerText: "I buy a hat yesterday.",
        sameMistakeCount: 4,
      }),
    );
    // Repeated past-tense error ≥ 3 → T3: EXPLAIN_PATTERN
    expect(result.timing.mode).toBe("EXPLAIN_PATTERN");
    expect(result.shouldShowNow).toBe(true);
  });

  // ── Edge cases ─────────────────────────────────────────────────────

  it("handles unchanged sentences gracefully", () => {
    const result = correctWithTimingAwareness(
      defaultInput({
        learnerText: "I went to school yesterday.",
        cefrLevel: "B1",
      }),
    );
    // Unchanged → minor → default SUPPRESS at B1
    expect(result.correction.status).toBe("unchanged");
    expect(result.timing).toBeDefined();
    expect(result.timing.mode).toBeDefined();
  });

  it("handles empty input gracefully", () => {
    const result = correctWithTimingAwareness(
      defaultInput({ learnerText: "" }),
    );
    expect(result.correction.status).toBe("unchanged");
    expect(result.timing).toBeDefined();
  });

  it("every result has all three display flags", () => {
    const inputs: TimingIntegrationInput[] = [
      defaultInput({ learnerText: "I buy a hat yesterday." }),
      defaultInput({ learnerText: "what do you usually do", cefrLevel: "B1" }),
      defaultInput({ learnerText: "She don't like it.", previousCorrectionsThisSession: 10 }),
      defaultInput({ learnerText: "I buy... I bought a hat", cefrLevel: "A2" }),
    ];

    for (const input of inputs) {
      const result = correctWithTimingAwareness(input);
      expect(typeof result.shouldShowNow).toBe("boolean");
      expect(typeof result.shouldDefer).toBe("boolean");
      expect(typeof result.shouldSuppress).toBe("boolean");
      // Exactly one of the three should be true
      const flags = [result.shouldShowNow, result.shouldDefer, result.shouldSuppress];
      expect(flags.filter(Boolean).length).toBe(1);
    }
  });
});

// ─── Deferred Correction Queue ─────────────────────────────────────────────

describe("createDeferredCorrectionQueue", () => {
  function makeDeferred(
    overrides: Partial<DeferredCorrection> = {},
  ): DeferredCorrection {
    return {
      learnerText: "I go school.",
      correctedText: "I go to school.",
      timing: {
        mode: "DELAYED",
        reason: "Test deferral.",
        reasonCode: "test_deferral",
        delayTurns: 2,
        respectsOneCorrectionMax: true,
      },
      remainingTurns: overrides.remainingTurns ?? 2,
      ...overrides,
    };
  }

  it("enqueues and returns pending items", () => {
    const queue = createDeferredCorrectionQueue();
    expect(queue.size()).toBe(0);

    queue.enqueue(makeDeferred());
    expect(queue.size()).toBe(1);
    expect(queue.pending()).toHaveLength(1);
  });

  it("advances turns and surfaces due corrections", () => {
    const queue = createDeferredCorrectionQueue();

    queue.enqueue(makeDeferred({ remainingTurns: 2 }));
    queue.enqueue(makeDeferred({ remainingTurns: 1 }));

    // Advance once: turns decremented to 1 and 0
    const due1 = queue.advanceTurn();
    expect(due1).toHaveLength(1); // only the second one is due
    expect(due1[0].remainingTurns).toBe(0);
    expect(queue.size()).toBe(1); // one still pending

    // Advance again: remaining goes from 1 to 0
    const due2 = queue.advanceTurn();
    expect(due2).toHaveLength(1);
    expect(queue.size()).toBe(0);
  });

  it("returns empty array when no corrections are due", () => {
    const queue = createDeferredCorrectionQueue();
    queue.enqueue(makeDeferred({ remainingTurns: 3 }));

    const due = queue.advanceTurn();
    expect(due).toHaveLength(0);
    expect(queue.size()).toBe(1);
  });

  it("clears all deferred corrections", () => {
    const queue = createDeferredCorrectionQueue();
    queue.enqueue(makeDeferred());
    queue.enqueue(makeDeferred());
    expect(queue.size()).toBe(2);

    queue.clear();
    expect(queue.size()).toBe(0);
    expect(queue.pending()).toHaveLength(0);
  });

  it("handles multiple advances correctly", () => {
    const queue = createDeferredCorrectionQueue();

    queue.enqueue(makeDeferred({ remainingTurns: 2 }));
    queue.enqueue(makeDeferred({ remainingTurns: 2 }));
    queue.enqueue(makeDeferred({ remainingTurns: 1 }));

    // Advance 1: remainingTurns become 1, 1, 0 → 1 due
    expect(queue.advanceTurn()).toHaveLength(1);
    expect(queue.size()).toBe(2);

    // Advance 2: remainingTurns become 0, 0 → 2 due
    expect(queue.advanceTurn()).toHaveLength(2);
    expect(queue.size()).toBe(0);
  });

  it("pending returns a copy (not a live reference)", () => {
    const queue = createDeferredCorrectionQueue();
    queue.enqueue(makeDeferred());

    const snapshot = queue.pending();
    snapshot.pop(); // mutate the snapshot

    expect(queue.size()).toBe(1); // original unchanged
    expect(queue.pending()).toHaveLength(1);
  });

  it("handles delayTurns=1 correctly (due on next advance)", () => {
    const queue = createDeferredCorrectionQueue();
    queue.enqueue(makeDeferred({ remainingTurns: 1 }));

    const due = queue.advanceTurn();
    expect(due).toHaveLength(1);
  });
});

// ─── Deferred Queue + Timing Integration Scenario ──────────────────────────

describe("Timing integration scenario: immediate vs delayed vs suppress in a session", () => {
  it("IMMEDIATE correction is shown right away", () => {
    const result = correctWithTimingAwareness(
      defaultInput({
        learnerText: "I buy a hat yesterday.",
        previousCorrectionsThisSession: 0,
      }),
    );

    expect(result.shouldShowNow).toBe(true);
    expect(result.correction.status).toBe("corrected");
    expect(result.correction.corrected).toBe("I bought a hat yesterday.");
    expect(result.timing.mode).toBe("IMMEDIATE");
  });

  it("DELAYED correction is deferred to queue", () => {
    const queue = createDeferredCorrectionQueue();

    // high session load + grammar correction → DELAYED (delayTurns=2)
    const result = correctWithTimingAwareness(
      defaultInput({
        learnerText: "he bought bicycle yesterday",
        previousCorrectionsThisSession: 10,
      }),
    );

    expect(result.shouldDefer).toBe(true);
    expect(result.timing.mode).toBe("DELAYED");
    expect(result.timing.delayTurns).toBe(2);

    // Enqueue the deferred correction with the timing's delayTurns
    queue.enqueue({
      learnerText: "he bought bicycle yesterday",
      correctedText: result.correction.corrected,
      timing: result.timing,
      remainingTurns: result.timing.delayTurns ?? 2,
    });

    expect(queue.size()).toBe(1);

    // After 1 turn — still pending (2 turns remaining → 1)
    queue.advanceTurn();
    expect(queue.size()).toBe(1);

    // After 2 turns — surfaces (1 → 0)
    queue.advanceTurn();
    expect(queue.size()).toBe(0);
  });

  it("SUPPRESS correction is not shown at all", () => {
    const result = correctWithTimingAwareness(
      defaultInput({
        learnerText: "what do you usually do in the morning",
        cefrLevel: "C1",
      }),
    );

    expect(result.shouldSuppress).toBe(true);
    expect(result.timing.mode).toBe("SUPPRESS");
    expect(result.shouldShowNow).toBe(false);
    expect(result.shouldDefer).toBe(false);
  });

  it("multiple turns accumulate and surface deferred corrections", () => {
    const queue = createDeferredCorrectionQueue();

    // Turn 1: grammar correction with high session load → DELAYED (delayTurns=2)
    const r1 = correctWithTimingAwareness(
      defaultInput({
        learnerText: "he bought bicycle yesterday",
        previousCorrectionsThisSession: 9,
      }),
    );
    expect(r1.shouldDefer).toBe(true);
    queue.enqueue({
      learnerText: "he bought bicycle yesterday",
      correctedText: r1.correction.corrected,
      timing: r1.timing,
      remainingTurns: r1.timing.delayTurns ?? 2,
    });

    // Turn 2: another grammar correction with high load → DELAYED (delayTurns=2)
    const r2 = correctWithTimingAwareness(
      defaultInput({
        learnerText: "she bought bicycle yesterday",
        previousCorrectionsThisSession: 10,
      }),
    );
    expect(r2.shouldDefer).toBe(true);
    queue.enqueue({
      learnerText: "she bought bicycle yesterday",
      correctedText: r2.correction.corrected,
      timing: r2.timing,
      remainingTurns: r2.timing.delayTurns ?? 2,
    });

    expect(queue.size()).toBe(2);

    // Advance 1 turn: remainingTurns 2→1, none due yet
    const dueAfter1 = queue.advanceTurn();
    expect(dueAfter1).toHaveLength(0);
    expect(queue.size()).toBe(2);

    // Advance 2nd turn: remainingTurns 1→0, both due
    const dueAfter2 = queue.advanceTurn();
    expect(dueAfter2).toHaveLength(2);
    expect(queue.size()).toBe(0);
  });
});

// ─── Suppress / Deferred Messages ──────────────────────────────────────────

describe("buildSuppressMessage", () => {
  it("returns Vietnamese message for vi", () => {
    const timing = {
      mode: "SUPPRESS" as const,
      reason: "Minor error.",
      reasonCode: "default_minor_suppress",
      respectsOneCorrectionMax: true,
    };
    const msg = buildSuppressMessage(timing, "vi");
    expect(msg).toContain("Mercy");
    expect(msg).toContain("không đáng");
  });

  it("returns English message for en", () => {
    const timing = {
      mode: "SUPPRESS" as const,
      reason: "Minor error.",
      reasonCode: "default_minor_suppress",
      respectsOneCorrectionMax: true,
    };
    const msg = buildSuppressMessage(timing, "en");
    expect(msg).toContain("not important enough");
    expect(msg).toContain("right now");
  });
});

describe("buildDeferredSurfacingMessage", () => {
  it("returns Vietnamese message with corrected text", () => {
    const msg = buildDeferredSurfacingMessage("I go to school.", "vi");
    expect(msg).toContain("Mercy");
    expect(msg).toContain("I go to school.");
    expect(msg).toContain("tự nhiên hơn");
  });

  it("returns English message with corrected text", () => {
    const msg = buildDeferredSurfacingMessage("I go to school.", "en");
    expect(msg).toContain("quick note");
    expect(msg).toContain("I go to school.");
  });
});

// ─── Severity inference is exhaustive over all known rule prefixes ─────────

describe("inferErrorSeverity — covers all known rule ID families", () => {
  const RULE_ID_TO_EXPECTED: Array<[string, string]> = [
    ["en-yesterday-irregular-beginner-past", "lesson_target"],
    ["en-step5-subject-verb-agreement", "lesson_target"],
    ["en-step5-preposition-pattern", "lesson_target"],
    ["en-step6-past-marker-recall", "lesson_target"],
    ["en-calque-open-turn-on-appliance", "word_choice"],
    ["en-calque-take-medicine", "word_choice"],
    ["en-vietlish-collocation-do-homework", "word_choice"],
    ["en-question-form-final-mark", "minor"],
    ["runon-segmented", "minor"],
    ["en-l4-missing-singular-article", "grammar"],
    ["en-l4-quantity-plural-s", "grammar"],
    ["en-be-verb-omission", "grammar"],
    ["en-step6-possessive-s", "grammar"],
    ["en-step6-profession-article", "grammar"],
    ["en-l4-topic-comment-word-order", "grammar"],
    ["en-vn-yesno-do-support", "grammar"],
    ["en-vn-although-even-though-but", "grammar"],
    ["en-vn-because-so-doubling", "grammar"],
    ["en-third-person-daily-go-eat-have", "lesson_target"],
    ["en-existential-have-there-is", "fatal_meaning"],
  ];

  it.each(RULE_ID_TO_EXPECTED)(
    "maps %s to %s",
    (ruleId, expectedSeverity) => {
      const result: CorrectionEngineResult = {
        status: "corrected",
        corrected: "Fixed.",
        appliedRuleIds: [ruleId],
      };
      expect(inferErrorSeverity(result)).toBe(expectedSeverity);
    },
  );
});
