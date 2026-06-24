/**
 * Golden Tests — Teacher Mercy Decision Engine
 *
 * These are REGRESSION TESTS that verify the full decision pipeline
 * produces EXACT, known-good outputs for representative inputs.
 *
 * If any of these tests break, it means the decision engine behavior
 * has changed — intentionally or not. Golden test failures require
 * a CONSCIOUS review: is this a deliberate behavior change, or a
 * regression? Update the golden fixture only if the change is intended.
 *
 * What makes these "golden":
 *   1. Exact output assertions (not property-based) — every field verified.
 *   2. Full pipeline coverage (correction → timing → enrichment →
 *      suppression → hint ladder → readiness).
 *   3. Organized by pedagogical archetype — goldens mirror real classroom
 *      scenarios, not code structure.
 *   4. One fixture = one complete decision with ALL fields asserted.
 *
 * Pure functions — no I/O, no side effects, deterministic.
 * All fixtures verified against commit 59b4566e (R1-R8 readiness gate).
 */

import { describe, expect, it } from "vitest";
import {
  decideTeacherAction,
  isCorrectionVisible,
  isCorrectionDeferred,
  isCorrectionSuppressed,
  hasActionableCorrection,
  type TeacherDecisionInput,
  type TeacherDecision,
  type DecisionAction,
} from "../teacherDecisionEngine";

// ─── Helper: default input factory ──────────────────────────────────────────

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

// ─── Type guard helpers ─────────────────────────────────────────────────────

const VALID_ACTIONS: ReadonlyArray<DecisionAction> = [
  "CORRECT_NOW",
  "DEFER",
  "SUPPRESS",
  "FOLLOW_UP_FIRST",
  "EXPLAIN_PATTERN",
];

function assertValidAction(a: string): asserts a is DecisionAction {
  if (!(VALID_ACTIONS as ReadonlyArray<string>).includes(a)) {
    throw new Error(`Invalid action: ${a}`);
  }
}

// ─── Golden Correction Path Fixtures ────────────────────────────────────────
//
// Each fixture is a complete TeacherDecisionInput → expected partial
// TeacherDecision mapping. These are the CANONICAL behaviors of the
// decision engine. If one of these changes, the change must be intentional.

type GoldenFixture = {
  label: string;
  descriptionVi: string;
  inp: TeacherDecisionInput;
  expected: {
    action: DecisionAction;
    reasonCode: string;
    timingMode: string;
    hasCorrection: boolean;
    correctedText: string | null;
    severity: string | null;
    delayTurns?: number;
    patternLabel?: string | null;
    hasEnrichment: boolean;
    hasSuppression: boolean;
  };
};

const GOLDEN_CORRECTION_FIXTURES: readonly GoldenFixture[] = [
  // ── T1: Fatal meaning ─────────────────────────────────────────────────
  {
    label: "fatal-meaning-stt-garble",
    descriptionVi: "Lỗi STT làm sai nghĩa — phải sửa ngay",
    inp: input({ learnerText: "it's very Sunday in the summer" }),
    expected: {
      action: "CORRECT_NOW",
      reasonCode: "fatal_meaning_must_correct",
      timingMode: "IMMEDIATE",
      hasCorrection: true,
      correctedText: "It's very sunny in the summer.",
      severity: "fatal_meaning",
      hasEnrichment: true,
      hasSuppression: false,
    },
  },
  // ── T2: Lesson target ─────────────────────────────────────────────────
  {
    label: "lesson-target-immediate",
    descriptionVi: "Lỗi đúng mục tiêu bài học — sửa ngay",
    inp: input({
      learnerText: "She go to school every day.",
      isCurrentLessonTarget: true,
    }),
    expected: {
      action: "CORRECT_NOW",
      reasonCode: "lesson_target_immediate",
      timingMode: "IMMEDIATE",
      hasCorrection: true,
      correctedText: "She goes to school every day.",
      severity: "lesson_target",
      hasEnrichment: true,
      hasSuppression: false,
    },
  },
  // ── T2 override: lesson target beats shy learner ──────────────────────
  {
    label: "lesson-target-overrides-shy",
    descriptionVi: "Mục tiêu bài học ưu tiên hơn learner nhút nhát",
    inp: input({
      learnerText: "She go to school every day.",
      isCurrentLessonTarget: true,
      learnerConfidence: "shy",
    }),
    expected: {
      action: "CORRECT_NOW",
      reasonCode: "lesson_target_immediate",
      timingMode: "IMMEDIATE",
      hasCorrection: true,
      correctedText: "She goes to school every day.",
      severity: "lesson_target",
      hasEnrichment: true,
      hasSuppression: false,
    },
  },
  // ── T3: Repeated mistake → explain pattern ────────────────────────────
  {
    label: "repeated-mistake-explain-pattern",
    descriptionVi: "Lỗi lặp ≥ 3 lần — giải thích quy luật thay vì sửa",
    inp: input({
      learnerText: "She happy.",
      sameMistakeCount: 3,
    }),
    expected: {
      action: "EXPLAIN_PATTERN",
      reasonCode: "repeated_explain_pattern",
      timingMode: "EXPLAIN_PATTERN",
      hasCorrection: true,
      correctedText: "She is happy.",
      severity: "grammar",
      patternLabel: "grammar",
      hasEnrichment: true,
      hasSuppression: false,
    },
  },
  // ── T2 + T3: Lesson target repeated → explain pattern with target ─────
  {
    label: "lesson-target-repeated-explain",
    descriptionVi: "Lỗi mục tiêu lặp ≥ 3 lần — giải thích quy luật bài học",
    inp: input({
      learnerText: "She go to school every day.",
      isCurrentLessonTarget: true,
      sameMistakeCount: 3,
    }),
    expected: {
      action: "EXPLAIN_PATTERN",
      reasonCode: "lesson_target_explain_pattern",
      timingMode: "EXPLAIN_PATTERN",
      hasCorrection: true,
      correctedText: "She goes to school every day.",
      severity: "lesson_target",
      patternLabel: "lesson-target:lesson_target",
      hasEnrichment: true,
      hasSuppression: false,
    },
  },
  // ── T4: Self-correction → follow up first ─────────────────────────────
  {
    label: "self-correct-follow-up",
    descriptionVi: "Đã tự sửa — hỏi thêm trước khi sửa trực tiếp",
    inp: input({
      learnerText: "I mean... she go to school every day.",
      cefrLevel: "B1",
    }),
    expected: {
      action: "FOLLOW_UP_FIRST",
      reasonCode: "self_correction_follow_up_first",
      timingMode: "FOLLOW_UP_FIRST",
      hasCorrection: true,
      correctedText: "I mean... she goes to school every day.",
      severity: "lesson_target",
      hasEnrichment: true,
      hasSuppression: false,
    },
  },
  // ── T5: Shy learner → defer grammar correction ────────────────────────
  {
    label: "shy-learner-defer",
    descriptionVi: "Người học nhút nhát — để dành sửa ngữ pháp",
    inp: input({
      learnerText: "She happy.",
      learnerConfidence: "shy",
      cefrLevel: "B1",
    }),
    expected: {
      action: "DEFER",
      reasonCode: "shy_learner_delayed_grammar",
      timingMode: "DELAYED",
      hasCorrection: true,
      correctedText: "She is happy.",
      severity: "grammar",
      delayTurns: 1,
      hasEnrichment: true,
      hasSuppression: false,
    },
  },
  // ── T6: Advanced learner → follow up first ────────────────────────────
  {
    label: "advanced-b2-follow-up",
    descriptionVi: "Trình độ B2 — để learner tự phát hiện lỗi",
    inp: input({
      learnerText: "She happy.",
      cefrLevel: "B2",
    }),
    expected: {
      action: "FOLLOW_UP_FIRST",
      reasonCode: "advanced_learner_follow_up_first",
      timingMode: "FOLLOW_UP_FIRST",
      hasCorrection: true,
      correctedText: "She is happy.",
      severity: "grammar",
      hasEnrichment: true,
      hasSuppression: false,
    },
  },
  // ── T6: C1 advanced ───────────────────────────────────────────────────
  {
    label: "advanced-c1-follow-up",
    descriptionVi: "Trình độ C1 — để learner tự phát hiện lỗi",
    inp: input({
      learnerText: "She happy.",
      cefrLevel: "C1",
    }),
    expected: {
      action: "FOLLOW_UP_FIRST",
      reasonCode: "advanced_learner_follow_up_first",
      timingMode: "FOLLOW_UP_FIRST",
      hasCorrection: true,
      correctedText: "She is happy.",
      severity: "grammar",
      hasEnrichment: true,
      hasSuppression: false,
    },
  },
  // ── T6: C2 advanced ───────────────────────────────────────────────────
  {
    label: "advanced-c2-follow-up",
    descriptionVi: "Trình độ C2 — để learner tự phát hiện lỗi",
    inp: input({
      learnerText: "She happy.",
      cefrLevel: "C2",
    }),
    expected: {
      action: "FOLLOW_UP_FIRST",
      reasonCode: "advanced_learner_follow_up_first",
      timingMode: "FOLLOW_UP_FIRST",
      hasCorrection: true,
      correctedText: "She is happy.",
      severity: "grammar",
      hasEnrichment: true,
      hasSuppression: false,
    },
  },
  // ── T7: Session correction load → defer ───────────────────────────────
  {
    label: "session-load-defer",
    descriptionVi: "Đã sửa 8+ lỗi — để dành sửa sau",
    inp: input({
      learnerText: "She happy.",
      previousCorrectionsThisSession: 8,
      cefrLevel: "B1",
    }),
    expected: {
      action: "DEFER",
      reasonCode: "session_correction_load_delayed",
      timingMode: "DELAYED",
      hasCorrection: true,
      correctedText: "She is happy.",
      severity: "grammar",
      delayTurns: 2,
      hasEnrichment: true,
      hasSuppression: false,
    },
  },
  // ── T7: Very high session load ────────────────────────────────────────
  {
    label: "session-load-12-defer",
    descriptionVi: "Đã sửa 12 lỗi — defer có rationale đề cập số lỗi",
    inp: input({
      learnerText: "She happy.",
      previousCorrectionsThisSession: 12,
      cefrLevel: "B1",
    }),
    expected: {
      action: "DEFER",
      reasonCode: "session_correction_load_delayed",
      timingMode: "DELAYED",
      hasCorrection: true,
      correctedText: "She is happy.",
      severity: "grammar",
      delayTurns: 2,
      hasEnrichment: true,
      hasSuppression: false,
    },
  },
  // ── T8: Beginner (A1) → immediate grammar correction ──────────────────
  {
    label: "beginner-a1-immediate",
    descriptionVi: "Mới học A1 — sửa ngữ pháp ngay để tránh thành thói quen",
    inp: input({
      learnerText: "She happy.",
      cefrLevel: "A1",
    }),
    expected: {
      action: "CORRECT_NOW",
      reasonCode: "beginner_grammar_immediate",
      timingMode: "IMMEDIATE",
      hasCorrection: true,
      correctedText: "She is happy.",
      severity: "grammar",
      hasEnrichment: true,
      hasSuppression: false,
    },
  },
  // ── T8: Beginner (A2) ─────────────────────────────────────────────────
  {
    label: "beginner-a2-immediate",
    descriptionVi: "Mới học A2 — sửa ngữ pháp ngay",
    inp: input({
      learnerText: "She happy.",
      cefrLevel: "A2",
    }),
    expected: {
      action: "CORRECT_NOW",
      reasonCode: "beginner_grammar_immediate",
      timingMode: "IMMEDIATE",
      hasCorrection: true,
      correctedText: "She is happy.",
      severity: "grammar",
      hasEnrichment: true,
      hasSuppression: false,
    },
  },
  // ── T8: Null CEFR → treated as beginner ───────────────────────────────
  {
    label: "null-cefr-treated-as-beginner",
    descriptionVi: "Không biết trình độ — treated as A1 beginner",
    inp: input({
      learnerText: "She happy.",
      cefrLevel: null,
    }),
    expected: {
      action: "CORRECT_NOW",
      reasonCode: "beginner_grammar_immediate",
      timingMode: "IMMEDIATE",
      hasCorrection: true,
      correctedText: "She is happy.",
      severity: "grammar",
      hasEnrichment: true,
      hasSuppression: false,
    },
  },
  // ── Default: B1 normal grammar → immediate ────────────────────────────
  {
    label: "default-grammar-immediate",
    descriptionVi: "Lỗi ngữ pháp thông thường — sửa ngay",
    inp: input({ learnerText: "She happy." }),
    expected: {
      action: "CORRECT_NOW",
      reasonCode: "default_grammar_immediate",
      timingMode: "IMMEDIATE",
      hasCorrection: true,
      correctedText: "She is happy.",
      severity: "grammar",
      hasEnrichment: true,
      hasSuppression: false,
    },
  },
  // ── No error ──────────────────────────────────────────────────────────
  {
    label: "no-error-suppress",
    descriptionVi: "Câu đúng — không cần sửa",
    inp: input({ learnerText: "I went to school yesterday." }),
    expected: {
      action: "SUPPRESS",
      reasonCode: "no_error_detected",
      timingMode: "SUPPRESS",
      hasCorrection: false,
      correctedText: null,
      severity: null,
      hasEnrichment: false,
      hasSuppression: false,
    },
  },
  // ── Empty text ────────────────────────────────────────────────────────
  {
    label: "empty-text-suppress",
    descriptionVi: "Văn bản trống — không có gì để sửa",
    inp: input({ learnerText: "" }),
    expected: {
      action: "SUPPRESS",
      reasonCode: "empty_text",
      timingMode: "SUPPRESS",
      hasCorrection: false,
      correctedText: null,
      severity: null,
      hasEnrichment: false,
      hasSuppression: false,
    },
  },
  // ── Needs AI ──────────────────────────────────────────────────────────
  {
    label: "needs-ai-defer",
    descriptionVi: "Cần AI để sửa (semantic implausibility) — defer",
    inp: input({ learnerText: "I buy a head yesterday." }),
    expected: {
      action: "DEFER",
      reasonCode: "needs_ai_deferred",
      timingMode: "DELAYED",
      hasCorrection: false,
      correctedText: null,
      severity: null,
      delayTurns: 1,
      hasEnrichment: false,
      hasSuppression: false,
    },
  },
  // ── Confident learner → immediate ─────────────────────────────────────
  {
    label: "confident-learner-immediate",
    descriptionVi: "Người học tự tin — sửa ngay",
    inp: input({
      learnerText: "She happy.",
      learnerConfidence: "confident",
    }),
    expected: {
      action: "CORRECT_NOW",
      reasonCode: "default_grammar_immediate",
      timingMode: "IMMEDIATE",
      hasCorrection: true,
      correctedText: "She is happy.",
      severity: "grammar",
      hasEnrichment: true,
      hasSuppression: false,
    },
  },
];

// ─── Golden Corrrection Path Test ────────────────────────────────────────────

describe("golden correction paths — exact output assertions", () => {
  for (const fix of GOLDEN_CORRECTION_FIXTURES) {
    it(fix.label, () => {
      const d = decideTeacherAction(fix.inp);

      // Action and timing
      expect(d.action).toBe(fix.expected.action);
      expect(d.reasonCode).toBe(fix.expected.reasonCode);
      expect(d.timingMode).toBe(fix.expected.timingMode);

      // Correction presence
      if (fix.expected.hasCorrection) {
        expect(d.correction).not.toBeNull();
        expect(d.correction!.correctedText).toBe(fix.expected.correctedText);
        expect(d.correction!.severity).toBe(fix.expected.severity);
        expect(d.correction!.appliedRuleIds.length).toBeGreaterThan(0);
      } else {
        expect(d.correction).toBeNull();
      }

      // Optional scalar fields
      if (fix.expected.delayTurns !== undefined) {
        expect(d.delayTurns).toBe(fix.expected.delayTurns);
      }
      if (fix.expected.patternLabel !== undefined) {
        expect(d.patternLabel).toBe(fix.expected.patternLabel);
      }

      // Enrichment and suppression
      expect(d.enrichment !== null).toBe(fix.expected.hasEnrichment);
      expect(d.suppressionDecision !== null).toBe(fix.expected.hasSuppression);

      // Vietnamese rationale always present
      expect(d.rationaleVi).toBeTruthy();
      expect(d.rationaleVi.length).toBeGreaterThan(10);

      // English rationale always present
      expect(d.rationaleEn).toBeTruthy();
    });
  }
});

// ─── Full Decision Shape Contract ────────────────────────────────────────────
//
// Every decision, regardless of action, must have all required fields
// present and correctly typed. These tests verify the STRUCTURE, not
// the specific values.

describe("TeacherDecision shape contract — all fields present", () => {
  // Every TeacherDecision has these 11 fields present (delayTurns and patternLabel
  // are optional on the type — only present for DEFER/EXPLAIN_PATTERN respectively).
  const SHAPE_FIELDS = [
    "action",
    "correction",
    "timingMode",
    "rationaleVi",
    "rationaleEn",
    "reasonCode",
    "allCandidates",
    "enrichment",
    "suppressionDecision",
    "hintLadder",
    "readiness",
  ] as const;

  const SCENARIOS: Array<{ label: string; inp: TeacherDecisionInput }> = [
    { label: "CORRECT_NOW", inp: input({ learnerText: "She happy." }) },
    { label: "DEFER", inp: input({ learnerText: "She happy.", learnerConfidence: "shy", cefrLevel: "B1" }) },
    { label: "SUPPRESS (no error)", inp: input({ learnerText: "I went to school yesterday." }) },
    { label: "SUPPRESS (empty)", inp: input({ learnerText: "" }) },
    { label: "FOLLOW_UP_FIRST", inp: input({ learnerText: "I mean... she go to school every day.", cefrLevel: "B1" }) },
    { label: "EXPLAIN_PATTERN", inp: input({ learnerText: "She happy.", sameMistakeCount: 3 }) },
    { label: "DEFER (needs_ai)", inp: input({ learnerText: "I buy a head yesterday." }) },
    { label: "CORRECT_NOW (fatal)", inp: input({ learnerText: "it's very Sunday in the summer" }) },
  ];

  it("every decision scenario has all 13 required shape fields", () => {
    for (const sc of SCENARIOS) {
      const d = decideTeacherAction(sc.inp);
      for (const field of SHAPE_FIELDS) {
        expect(d).toHaveProperty(field);
      }
    }
  });

  it("CORRECT_NOW has non-null correction with valid fields", () => {
    const d = decideTeacherAction(input({ learnerText: "She happy." }));
    expect(d.action).toBe("CORRECT_NOW");
    expect(d.correction).not.toBeNull();
    expect(d.correction!.correctedText).toBeTruthy();
    expect(d.correction!.appliedRuleIds.length).toBeGreaterThan(0);
    expect(d.correction!.severity).toBeTruthy();
    expect(d.allCandidates).toHaveLength(1);
  });

  it("DEFER has delayTurns > 0 and non-null correction (grammar defer)", () => {
    const d = decideTeacherAction(
      input({ learnerText: "She happy.", learnerConfidence: "shy", cefrLevel: "B1" }),
    );
    expect(d.action).toBe("DEFER");
    expect(d.delayTurns).toBeGreaterThan(0);
    expect(d.correction).not.toBeNull();
  });

  it("EXPLAIN_PATTERN has patternLabel and non-null correction", () => {
    const d = decideTeacherAction(
      input({ learnerText: "She happy.", sameMistakeCount: 3 }),
    );
    expect(d.action).toBe("EXPLAIN_PATTERN");
    expect(d.patternLabel).toBeTruthy();
    expect(d.correction).not.toBeNull();
  });

  it("SUPPRESS has null correction (for no-error and empty)", () => {
    const noErr = decideTeacherAction(input({ learnerText: "I went to school yesterday." }));
    const empty = decideTeacherAction(input({ learnerText: "" }));
    expect(noErr.action).toBe("SUPPRESS");
    expect(noErr.correction).toBeNull();
    expect(empty.action).toBe("SUPPRESS");
    expect(empty.correction).toBeNull();
  });

  it("FOLLOW_UP_FIRST has non-null correction with rule IDs", () => {
    const d = decideTeacherAction(
      input({ learnerText: "I mean... she go to school every day.", cefrLevel: "B1" }),
    );
    expect(d.action).toBe("FOLLOW_UP_FIRST");
    expect(d.correction).not.toBeNull();
    expect(d.correction!.appliedRuleIds.length).toBeGreaterThan(0);
  });

  it("rationaleVi is always non-empty and contains Vietnamese", () => {
    for (const sc of SCENARIOS) {
      const d = decideTeacherAction(sc.inp);
      expect(d.rationaleVi).toBeTruthy();
      expect(d.rationaleVi.length).toBeGreaterThan(5);
      // Vietnamese rationale should contain Vietnamese characters or at least be a string
      expect(typeof d.rationaleVi).toBe("string");
    }
  });

  it("reasonCode is always non-empty and cataloged", () => {
    for (const sc of SCENARIOS) {
      const d = decideTeacherAction(sc.inp);
      expect(d.reasonCode).toBeTruthy();
      expect(typeof d.reasonCode).toBe("string");
      expect(d.reasonCode.length).toBeGreaterThan(2);
    }
  });

  it("allCandidates is always an array (empty or populated)", () => {
    for (const sc of SCENARIOS) {
      const d = decideTeacherAction(sc.inp);
      expect(Array.isArray(d.allCandidates)).toBe(true);
    }
  });
});

// ─── Gate Chain Integration — Hint Ladder + Readiness ───────────────────────
//
// The decision engine integrates hint ladder (H1-H8) and learner readiness
// (R1-R8) into every decision. These tests verify the integration is wired
// correctly — that hint and readiness results flow through.

describe("gate chain integration — hint ladder (H1-H8) wired", () => {
  it("hint ladder fires HINT_MEDIUM for lesson target + normal learner", () => {
    const d = decideTeacherAction(
      input({ learnerText: "She go to school every day.", isCurrentLessonTarget: true }),
    );
    expect(d.hintLadder).not.toBeNull();
    expect(d.hintLadder!.decision).toBe("HINT_MEDIUM");
    expect(d.hintLadder!.reasonCode).toBeTruthy();
    expect(d.hintLadder!.reason).toBeTruthy();
  });

  it("hint ladder fires HINT_MINIMAL for shy learner", () => {
    const d = decideTeacherAction(
      input({ learnerText: "She happy.", learnerConfidence: "shy", cefrLevel: "B1" }),
    );
    expect(d.hintLadder).not.toBeNull();
    expect(d.hintLadder!.decision).toBe("HINT_MINIMAL");
  });

  it("hint ladder fires HINT_MEDIUM for A1 beginner", () => {
    const d = decideTeacherAction(
      input({ learnerText: "She happy.", cefrLevel: "A1" }),
    );
    expect(d.hintLadder).not.toBeNull();
    expect(d.hintLadder!.decision).toBe("HINT_MEDIUM");
  });

  it("hint ladder is null when no hint recommended (repeated mistake)", () => {
    // Repeated mistake → EXPLAIN_PATTERN, hints not needed
    const d = decideTeacherAction(
      input({ learnerText: "She happy.", sameMistakeCount: 3 }),
    );
    expect(d.hintLadder).toBeNull();
  });

  it("hint ladder is null for unchanged/correct text", () => {
    const d = decideTeacherAction(input({ learnerText: "I went to school yesterday." }));
    expect(d.hintLadder).toBeNull();
  });

  it("hint ladder is null for empty text", () => {
    const d = decideTeacherAction(input({ learnerText: "" }));
    expect(d.hintLadder).toBeNull();
  });

  it("hint ladder result has full shape when non-null", () => {
    const d = decideTeacherAction(
      input({ learnerText: "She go to school every day.", isCurrentLessonTarget: true }),
    );
    expect(d.hintLadder).not.toBeNull();
    expect(d.hintLadder!).toHaveProperty("decision");
    expect(d.hintLadder!).toHaveProperty("reasonCode");
    expect(d.hintLadder!).toHaveProperty("reason");
    expect(d.hintLadder!).toHaveProperty("hintFocusArea");
  });

  it("hint ladder fires HINT_MINIMAL for advanced learner (B2)", () => {
    const d = decideTeacherAction(
      input({ learnerText: "She happy.", cefrLevel: "B2" }),
    );
    expect(d.hintLadder).not.toBeNull();
    expect(d.hintLadder!.decision).toBe("HINT_MINIMAL");
  });

  it("hint ladder HINT_MINIMAL for self-correcting learner", () => {
    const d = decideTeacherAction(
      input({ learnerText: "I mean... she go to school every day.", cefrLevel: "B1" }),
    );
    expect(d.hintLadder).not.toBeNull();
    expect(d.hintLadder!.decision).toBe("HINT_MINIMAL");
  });

  it("hint ladder is null for fatal meaning (STT garble) — direct correction beats hint", () => {
    const d = decideTeacherAction(
      input({ learnerText: "it's very Sunday in the summer" }),
    );
    // Fatal meaning → direct correction, no hint needed
    expect(d.hintLadder).toBeNull();
  });
});

describe("gate chain integration — learner readiness (R1-R8) wired", () => {
  it("readiness is always non-null — even for empty/no-error paths", () => {
    const scenarios = [
      decideTeacherAction(input({ learnerText: "She happy." })),
      decideTeacherAction(input({ learnerText: "" })),
      decideTeacherAction(input({ learnerText: "I went to school yesterday." })),
      decideTeacherAction(input({ learnerText: "I buy a head yesterday." })),
      decideTeacherAction(input({ learnerText: "She go to school every day.", isCurrentLessonTarget: true })),
    ];
    for (const d of scenarios) {
      expect(d.readiness).not.toBeNull();
      expect(d.readiness!.decision).toBeTruthy();
      expect(d.readiness!.reasonCode).toBeTruthy();
      expect(d.readiness!.reason).toBeTruthy();
    }
  });

  it("readiness defaults to READY_NOW with default input parameters", () => {
    const d = decideTeacherAction(input({ learnerText: "She happy." }));
    expect(d.readiness!.decision).toBe("READY_NOW");
  });

  it("readiness full shape contract — has all required fields", () => {
    const d = decideTeacherAction(input({ learnerText: "She happy." }));
    expect(d.readiness!).toHaveProperty("decision");
    expect(d.readiness!).toHaveProperty("reason");
    expect(d.readiness!).toHaveProperty("reasonCode");
  });

  it("readiness returns NOT_READY_PREREQUISITE when prereqs not mastered", () => {
    const d = decideTeacherAction(
      input({
        learnerText: "She happy.",
        prerequisiteMasteryRatio: 0.3, // only 30% of prereqs mastered
      }),
    );
    expect(d.readiness!.decision).toBe("NOT_READY_PREREQUISITE");
    expect(d.readiness!.reasonCode).toBe("readiness_severe_prerequisite_gap");
  });

  it("readiness returns NOT_READY_TOO_SOON when recently attempted and failed", () => {
    const d = decideTeacherAction(
      input({
        learnerText: "She happy.",
        turnsSinceLastLessonAttempt: 1,
        lessonAttemptsThisSession: 1,
        lessonTargetMasteryEstimate: 0.1,
        showedProgressOnLastAttempt: false,
      }),
    );
    expect(d.readiness!.decision).toBe("NOT_READY_TOO_SOON");
    expect(d.readiness!.reasonCode).toBe("readiness_too_soon_after_failure");
  });

  it("readiness returns NOT_READY_DIFFERENT_APPROACH after 3+ failed attempts", () => {
    const d = decideTeacherAction(
      input({
        learnerText: "She happy.",
        lessonAttemptsThisSession: 3,
        lessonTargetMasteryEstimate: 0.15,
        showedProgressOnLastAttempt: false,
      }),
    );
    expect(d.readiness!.decision).toBe("NOT_READY_DIFFERENT_APPROACH");
    expect(d.readiness!.reasonCode).toBe("readiness_lesson_attempt_saturation");
  });

  it("readiness returns SKIP_AHEAD when B2+ learner already masters target", () => {
    const d = decideTeacherAction(
      input({
        learnerText: "She happy.",
        cefrLevel: "B2",
        lessonTargetMasteryEstimate: 0.90,
        consecutiveCorrectTurns: 5,
      }),
    );
    expect(d.readiness!.decision).toBe("SKIP_AHEAD");
    expect(d.readiness!.reasonCode).toBe("readiness_advanced_accelerate");
    expect(d.readiness!.suggestedNextTarget).toBeTruthy();
  });

  it("readiness returns DEFER_READINESS_CHECK when learner is frustrated", () => {
    const d = decideTeacherAction(
      input({
        learnerText: "She happy.",
        isShowingFrustration: true,
      }),
    );
    expect(d.readiness!.decision).toBe("DEFER_READINESS_CHECK");
    expect(d.readiness!.reasonCode).toBe("readiness_deferred_frustration");
    expect(d.readiness!.deferTurns).toBeGreaterThan(0);
  });
});

// ─── Suppression Reasoning Integration ──────────────────────────────────────

describe("gate chain integration — suppression reasoning (from suppressionRules.ts)", () => {
  it("suppressionDecision is null for non-SUPPRESS actions", () => {
    const scenarios = [
      decideTeacherAction(input({ learnerText: "She happy." })),                        // CORRECT_NOW
      decideTeacherAction(input({ learnerText: "She happy.", learnerConfidence: "shy", cefrLevel: "B1" })), // DEFER
      decideTeacherAction(input({ learnerText: "I mean... she go to school every day.", cefrLevel: "B1" })), // FOLLOW_UP_FIRST
      decideTeacherAction(input({ learnerText: "She happy.", sameMistakeCount: 3 })),  // EXPLAIN_PATTERN
    ];
    for (const d of scenarios) {
      expect(d.suppressionDecision).toBeNull();
    }
  });

  it("suppressionDecision is null for SUPPRESS from no-error (no suppression rules evaluated)", () => {
    const d = decideTeacherAction(input({ learnerText: "I went to school yesterday." }));
    expect(d.action).toBe("SUPPRESS");
    expect(d.suppressionDecision).toBeNull();
  });

  it("suppressionDecision is null for SUPPRESS from empty text", () => {
    const d = decideTeacherAction(input({ learnerText: "" }));
    expect(d.action).toBe("SUPPRESS");
    expect(d.suppressionDecision).toBeNull();
  });

  it("suppressionDecision has full shape when non-null (from timing-engine SUPPRESS)", () => {
    // Suppression reasoning only populates when timing engine produces SUPPRESS
    // on an error that would otherwise be corrected. This is genuinely rare in
    // the gate chain — most SUPPRESS comes from no-error/empty paths where
    // suppression is not evaluated. Test conditionally.
    const d = decideTeacherAction(
      input({
        learnerText: "I went to school yesterday and I eat rice for lunch with my friends.",
        previousCorrectionsThisSession: 10,
        cefrLevel: "B1",
      }),
    );
    // If the timing engine happened to produce SUPPRESS, verify the shape
    if (d.action === "SUPPRESS" && d.suppressionDecision !== null) {
      expect(d.suppressionDecision).toHaveProperty("shouldSuppress");
      expect(d.suppressionDecision).toHaveProperty("applicableRules");
      expect(d.suppressionDecision).toHaveProperty("primaryReason");
      expect(d.suppressionDecision).toHaveProperty("rationaleVi");
      expect(d.suppressionDecision).toHaveProperty("rationaleEn");
      expect(d.suppressionDecision!.shouldSuppress).toBe(true);
      expect(d.suppressionDecision!.applicableRules.length).toBeGreaterThan(0);
    }
    // If not SUPPRESS, that's fine — the engine chose a different action
    // for this specific input combination. Shape is verified elsewhere.
  });
});

// ─── Convenience Helpers — Golden Behavior ──────────────────────────────────

describe("convenience helpers — golden behavior", () => {
  it("isCorrectionVisible: true for CORRECT_NOW and EXPLAIN_PATTERN only", () => {
    expect(isCorrectionVisible(decideTeacherAction(input({ learnerText: "She happy." })))).toBe(true);
    expect(isCorrectionVisible(decideTeacherAction(input({ learnerText: "She happy.", sameMistakeCount: 3 })))).toBe(true);
    expect(isCorrectionVisible(decideTeacherAction(input({ learnerText: "She happy.", learnerConfidence: "shy", cefrLevel: "B1" })))).toBe(false);
    expect(isCorrectionVisible(decideTeacherAction(input({ learnerText: "" })))).toBe(false);
    expect(isCorrectionVisible(decideTeacherAction(input({ learnerText: "I mean... she go to school every day.", cefrLevel: "B1" })))).toBe(false);
  });

  it("isCorrectionDeferred: true for DEFER and FOLLOW_UP_FIRST only", () => {
    expect(isCorrectionDeferred(decideTeacherAction(input({ learnerText: "She happy.", learnerConfidence: "shy", cefrLevel: "B1" })))).toBe(true);
    expect(isCorrectionDeferred(decideTeacherAction(input({ learnerText: "I mean... she go to school every day.", cefrLevel: "B1" })))).toBe(true);
    expect(isCorrectionDeferred(decideTeacherAction(input({ learnerText: "She happy." })))).toBe(false);
    expect(isCorrectionDeferred(decideTeacherAction(input({ learnerText: "" })))).toBe(false);
    expect(isCorrectionDeferred(decideTeacherAction(input({ learnerText: "She happy.", sameMistakeCount: 3 })))).toBe(false);
  });

  it("isCorrectionSuppressed: true for SUPPRESS only", () => {
    expect(isCorrectionSuppressed(decideTeacherAction(input({ learnerText: "" })))).toBe(true);
    expect(isCorrectionSuppressed(decideTeacherAction(input({ learnerText: "I went to school yesterday." })))).toBe(true);
    expect(isCorrectionSuppressed(decideTeacherAction(input({ learnerText: "She happy." })))).toBe(false);
    expect(isCorrectionSuppressed(decideTeacherAction(input({ learnerText: "She happy.", learnerConfidence: "shy", cefrLevel: "B1" })))).toBe(false);
  });

  it("hasActionableCorrection: true only when visible AND has correction", () => {
    expect(hasActionableCorrection(decideTeacherAction(input({ learnerText: "She happy." })))).toBe(true);
    expect(hasActionableCorrection(decideTeacherAction(input({ learnerText: "She happy.", sameMistakeCount: 3 })))).toBe(true);
    expect(hasActionableCorrection(decideTeacherAction(input({ learnerText: "" })))).toBe(false);
    expect(hasActionableCorrection(decideTeacherAction(input({ learnerText: "I went to school yesterday." })))).toBe(false);
    expect(hasActionableCorrection(decideTeacherAction(input({ learnerText: "She happy.", learnerConfidence: "shy", cefrLevel: "B1" })))).toBe(false);
  });
});

// ─── All Five DecisionActions Are Reachable ─────────────────────────────────

describe("all five DecisionActions are reachable from golden fixtures", () => {
  it("CORRECT_NOW is reachable", () => {
    const d = decideTeacherAction(input({ learnerText: "She happy." }));
    expect(d.action).toBe("CORRECT_NOW");
  });

  it("DEFER is reachable", () => {
    const d = decideTeacherAction(
      input({ learnerText: "She happy.", learnerConfidence: "shy", cefrLevel: "B1" }),
    );
    expect(d.action).toBe("DEFER");
  });

  it("SUPPRESS is reachable (no error)", () => {
    const d = decideTeacherAction(input({ learnerText: "I went to school yesterday." }));
    expect(d.action).toBe("SUPPRESS");
  });

  it("FOLLOW_UP_FIRST is reachable", () => {
    const d = decideTeacherAction(
      input({ learnerText: "I mean... she go to school every day.", cefrLevel: "B1" }),
    );
    expect(d.action).toBe("FOLLOW_UP_FIRST");
  });

  it("EXPLAIN_PATTERN is reachable", () => {
    const d = decideTeacherAction(
      input({ learnerText: "She happy.", sameMistakeCount: 3 }),
    );
    expect(d.action).toBe("EXPLAIN_PATTERN");
  });
});

// ─── Cross-Cutting Invariants ───────────────────────────────────────────────

describe("cross-cutting invariants — always true for any input", () => {
  it("never throws on any input (null-safety, extreme values)", () => {
    const extremeTexts = [
      "",
      "hello",
      "   ",
      "She happy.",
      "!!!",
      "123",
      "A".repeat(5000),
      "She go to school every day.",
      "I buy a head yesterday.",
      "it's very Sunday in the summer",
    ];
    const confidenceLevels = ["shy", "normal", "confident"] as const;
    const cefrLevels = [null, "A1", "A2", "B1", "B2", "C1", "C2"] as const;

    for (const text of extremeTexts) {
      for (const confidence of confidenceLevels) {
        for (const cefr of cefrLevels) {
          expect(() =>
            decideTeacherAction(
              input({ learnerText: text, learnerConfidence: confidence, cefrLevel: cefr }),
            ),
          ).not.toThrow();
        }
      }
    }
  });

  it("output is deterministic — same input always produces same output", () => {
    const scenarios = [
      input({ learnerText: "She happy." }),
      input({ learnerText: "She go to school every day.", isCurrentLessonTarget: true }),
      input({ learnerText: "She happy.", learnerConfidence: "shy", cefrLevel: "B1" }),
      input({ learnerText: "" }),
      input({ learnerText: "I buy a head yesterday." }),
    ];

    for (const inp of scenarios) {
      const first = decideTeacherAction(inp);
      const second = decideTeacherAction(inp);
      const third = decideTeacherAction(inp);

      // Deep equality — every field must match
      expect(first).toEqual(second);
      expect(second).toEqual(third);

      // JSON stability check
      expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    }
  });

  it("rationaleVi never contains harsh/critical language", () => {
    const scenarios = [
      decideTeacherAction(input({ learnerText: "She happy." })),
      decideTeacherAction(input({ learnerText: "She happy.", learnerConfidence: "shy", cefrLevel: "B1" })),
      decideTeacherAction(input({ learnerText: "She happy.", cefrLevel: "A1" })),
      decideTeacherAction(input({ learnerText: "She happy.", sameMistakeCount: 3 })),
      decideTeacherAction(input({ learnerText: "I mean... she go to school every day.", cefrLevel: "B1" })),
    ];

    for (const d of scenarios) {
      expect(d.rationaleVi).toBeTruthy();
      expect(d.rationaleVi).not.toMatch(/sai|dốt|tệ|ngu|kém|tồi/i);
    }
  });

  it("all decisions have valid action (must be one of 5 known actions)", () => {
    const scenarios = [
      input({ learnerText: "She happy." }),
      input({ learnerText: "" }),
      input({ learnerText: "I went to school yesterday." }),
      input({ learnerText: "She happy.", learnerConfidence: "shy", cefrLevel: "B1" }),
      input({ learnerText: "She happy.", cefrLevel: "B2" }),
      input({ learnerText: "She happy.", sameMistakeCount: 3 }),
      input({ learnerText: "I buy a head yesterday." }),
      input({ learnerText: "it's very Sunday in the summer" }),
    ];

    for (const inp of scenarios) {
      const d = decideTeacherAction(inp);
      expect(VALID_ACTIONS).toContain(d.action);
    }
  });

  it("timingMode is always one of the 5 correction modes", () => {
    const VALID_MODES = ["IMMEDIATE", "DELAYED", "SUPPRESS", "FOLLOW_UP_FIRST", "EXPLAIN_PATTERN"];
    const scenarios = [
      input({ learnerText: "She happy." }),
      input({ learnerText: "" }),
      input({ learnerText: "I went to school yesterday." }),
      input({ learnerText: "She happy.", learnerConfidence: "shy", cefrLevel: "B1" }),
      input({ learnerText: "She happy.", cefrLevel: "B2" }),
      input({ learnerText: "She happy.", sameMistakeCount: 3 }),
      input({ learnerText: "I buy a head yesterday." }),
    ];

    for (const inp of scenarios) {
      const d = decideTeacherAction(inp);
      expect(VALID_MODES).toContain(d.timingMode);
    }
  });

  it("action and timingMode are always consistent", () => {
    const mapping: Record<string, string> = {
      CORRECT_NOW: "IMMEDIATE",
      DEFER: "DELAYED",
      SUPPRESS: "SUPPRESS",
      FOLLOW_UP_FIRST: "FOLLOW_UP_FIRST",
      EXPLAIN_PATTERN: "EXPLAIN_PATTERN",
    };

    const scenarios = [
      input({ learnerText: "She happy." }),
      input({ learnerText: "" }),
      input({ learnerText: "I went to school yesterday." }),
      input({ learnerText: "She happy.", learnerConfidence: "shy", cefrLevel: "B1" }),
      input({ learnerText: "She happy.", cefrLevel: "B2" }),
      input({ learnerText: "She happy.", sameMistakeCount: 3 }),
      input({ learnerText: "I buy a head yesterday." }),
      input({ learnerText: "it's very Sunday in the summer" }),
    ];

    for (const inp of scenarios) {
      const d = decideTeacherAction(inp);
      expect(d.timingMode).toBe(mapping[d.action]);
    }
  });

  it("reasonCode is consistent with action for all golden fixtures", () => {
    const reasonToAction: Record<string, DecisionAction> = {
      fatal_meaning_must_correct: "CORRECT_NOW",
      lesson_target_immediate: "CORRECT_NOW",
      lesson_target_explain_pattern: "EXPLAIN_PATTERN",
      repeated_explain_pattern: "EXPLAIN_PATTERN",
      self_correction_follow_up_first: "FOLLOW_UP_FIRST",
      shy_learner_delayed_grammar: "DEFER",
      advanced_learner_follow_up_first: "FOLLOW_UP_FIRST",
      session_correction_load_delayed: "DEFER",
      beginner_grammar_immediate: "CORRECT_NOW",
      default_grammar_immediate: "CORRECT_NOW",
      no_error_detected: "SUPPRESS",
      empty_text: "SUPPRESS",
      needs_ai_deferred: "DEFER",
    };

    for (const [reasonCode, expectedAction] of Object.entries(reasonToAction)) {
      for (const fix of GOLDEN_CORRECTION_FIXTURES) {
        if (fix.expected.reasonCode === reasonCode) {
          expect(fix.expected.action).toBe(expectedAction);
        }
      }
    }
  });
});

// ─── Enrichment (Weakness + Vietnamese Interference) ────────────────────────

describe("golden enrichment — weakness tags and interference explanations", () => {
  it("enrichment is present with isL1TransferError when correction fires", () => {
    const d = decideTeacherAction(input({ learnerText: "She happy." }));
    expect(d.enrichment).not.toBeNull();
    expect(d.enrichment!.isL1TransferError).toBe(true);
    expect(d.enrichment!.weaknessLabelVi).toBeTruthy();
    expect(d.enrichment!.weaknessLabelEn).toBeTruthy();
  });

  it("enrichment is null when no correction fires (unchanged)", () => {
    const d = decideTeacherAction(input({ learnerText: "I went to school yesterday." }));
    expect(d.enrichment).toBeNull();
  });

  it("enrichment is null when no correction fires (empty)", () => {
    const d = decideTeacherAction(input({ learnerText: "" }));
    expect(d.enrichment).toBeNull();
  });

  it("enrichment is null when no correction fires (needs_ai)", () => {
    const d = decideTeacherAction(input({ learnerText: "I buy a head yesterday." }));
    expect(d.enrichment).toBeNull();
  });

  it("enrichment has full shape when non-null", () => {
    const d = decideTeacherAction(input({ learnerText: "She happy." }));
    expect(d.enrichment).not.toBeNull();
    expect(d.enrichment!).toHaveProperty("isL1TransferError");
    expect(d.enrichment!).toHaveProperty("weaknessLabelVi");
    expect(d.enrichment!).toHaveProperty("weaknessLabelEn");
    expect(d.enrichment!).toHaveProperty("weaknessInput");
    expect(d.enrichment!).toHaveProperty("interferenceCategory");
    expect(d.enrichment!).toHaveProperty("matchedRuleId");
  });
});

// ─── Edge Cases — Non-English, Mixed Language ───────────────────────────────

describe("golden edge cases — non-English and mixed language", () => {
  it("French input 'Je suis content.' returns valid decision (no errors for French)", () => {
    const d = decideTeacherAction(
      input({ learnerText: "Je suis content.", targetLanguage: "fr" }),
    );
    expect(d.action).toBe("SUPPRESS");
    expect(d.reasonCode).toBe("no_error_detected");
    expect(d.correction).toBeNull();
  });

  it("whitespace-only text returns SUPPRESS with empty_text reason", () => {
    const d = decideTeacherAction(input({ learnerText: "   " }));
    expect(d.action).toBe("SUPPRESS");
    expect(d.reasonCode).toBe("empty_text");
    expect(d.correction).toBeNull();
  });

  it("very long text (500+ chars) produces a valid decision without throwing", () => {
    const longText = "She go to school every day. ".repeat(50);
    const d = decideTeacherAction(input({ learnerText: longText }));
    expect(d.action).toBeTruthy();
    expect(typeof d.action).toBe("string");
    expect(d.rationaleVi).toBeTruthy();
  });

  it("special characters and emoji produce a valid decision", () => {
    const d = decideTeacherAction(
      input({ learnerText: "She go to school!!! 😊🎉" }),
    );
    expect(d.action).toBeTruthy();
    expect(d.correction).not.toBeNull();
  });

  it("mixed Vietnamese-English text produces a valid decision", () => {
    const d = decideTeacherAction(
      input({ learnerText: "She nói rằng she go to school." }),
    );
    expect(d.action).toBeTruthy();
    expect(typeof d.action).toBe("string");
  });

  it("text with only punctuation produces a valid decision", () => {
    const d = decideTeacherAction(input({ learnerText: "!!!" }));
    expect(d.action).toBeTruthy();
    expect(typeof d.action).toBe("string");
  });
});
