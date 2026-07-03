/**
 * Tests for Teaching Decision Evaluation Gate
 *
 * Covers:
 *   - V1 — Action-input coherence (empty text → SUPPRESS, no-error → SUPPRESS, valid actions)
 *   - V2 — Rationale quality (non-empty, no harsh language, reasonCode present)
 *   - V3 — Timing-action consistency (all 5 mappings, edge cases)
 *   - V4 — Correction shape validity (well-formed corrections, null handling)
 *   - V5 — Suppression justification (self-evident cases, missing justification, valid justification)
 *   - V6 — Hint ladder alignment (no hint, aligned, misaligned: frustrated + strong, minor + strong)
 *   - V7 — Readiness-action agreement (NOT_READY + CORRECT_NOW, SKIP_AHEAD + EXPLAIN_PATTERN, all compatibilities)
 *   - V8 — Cross-field narrative (EXPLAIN_PATTERN → patternLabel, DEFER → delayTurns, field completeness)
 *   - Full evaluation pipeline (EXEMPLARY, ACCEPTABLE, NEEDS_REVIEW, UNSAFE classifications)
 *   - Safety check (isDecisionSafe — only V1 and V3)
 *   - Telemetry formatter
 *   - Catalogs (8 gates, 4 classifications)
 *   - Edge cases: French input, whitespace-only, emoji, very long text
 *   - Real decisions from the decision engine pass evaluation
 *
 * Pure — no I/O, no side effects, deterministic.
 */

import { describe, expect, it } from "vitest";
import {
  evaluateTeachingDecision,
  isDecisionSafe,
  evaluateDecisionQuick,
  formatEvaluationTelemetry,
  EVALUATION_CLASSIFICATION_CATALOG,
  EVALUATION_GATE_CATALOG,
  type EvaluationResult,
  type EvaluationClassification,
} from "../teachingDecisionEvaluationGate";
import { decideTeacherAction, type TeacherDecision, type TeacherDecisionInput } from "../teacherDecisionEngine";

// ─── Helpers ──────────────────────────────────────────────────────────────

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

/** Build a decision from the real engine for a given input. */
function decide(overrides: Partial<TeacherDecisionInput> = {}) {
  return decideTeacherAction(input(overrides));
}

/** Assert all 8 gates are present in the result. */
function assertAllGatesPresent(result: EvaluationResult) {
  const gateIds = result.gates.map(g => g.gateId);
  expect(gateIds).toContain("V1_ACTION_INPUT_COHERENCE");
  expect(gateIds).toContain("V2_RATIONALE_QUALITY");
  expect(gateIds).toContain("V3_TIMING_ACTION_CONSISTENCY");
  expect(gateIds).toContain("V4_CORRECTION_SHAPE_VALIDITY");
  expect(gateIds).toContain("V5_SUPPRESSION_JUSTIFICATION");
  expect(gateIds).toContain("V6_HINT_LADDER_ALIGNMENT");
  expect(gateIds).toContain("V7_READINESS_ACTION_AGREEMENT");
  expect(gateIds).toContain("V8_CROSS_FIELD_NARRATIVE");
}

// ─── V1 — Action-Input Coherence ───────────────────────────────────────────

describe("V1 — Action-input coherence", () => {
  it("passes: empty text produces SUPPRESS", () => {
    const d = decide({ learnerText: "" });
    const result = evaluateTeachingDecision(input({ learnerText: "" }), d);
    const v1 = result.gates.find(g => g.gateId === "V1_ACTION_INPUT_COHERENCE")!;
    expect(v1.passed).toBe(true);
  });

  it("fails hard: empty text with non-SUPPRESS action (synthetic)", () => {
    const d = decide({ learnerText: "She happy." });
    // Synthetically create a bad decision — empty text but CORRECT_NOW
    const badDecision = { ...d, action: "CORRECT_NOW" as const };
    const result = evaluateTeachingDecision(input({ learnerText: "" }), badDecision);
    const v1 = result.gates.find(g => g.gateId === "V1_ACTION_INPUT_COHERENCE")!;
    expect(v1.passed).toBe(false);
    expect(v1.isHardFail).toBe(true);
    expect(result.classification).toBe("UNSAFE");
  });

  it("passes: whitespace-only text → SUPPRESS", () => {
    const d = decide({ learnerText: "   " });
    const result = evaluateTeachingDecision(input({ learnerText: "   " }), d);
    const v1 = result.gates.find(g => g.gateId === "V1_ACTION_INPUT_COHERENCE")!;
    expect(v1.passed).toBe(true);
  });

  it("passes: normal text with correction → CORRECT_NOW", () => {
    const d = decide({ learnerText: "She happy." });
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), d);
    const v1 = result.gates.find(g => g.gateId === "V1_ACTION_INPUT_COHERENCE")!;
    expect(v1.passed).toBe(true);
  });

  it("fails: invalid action string", () => {
    const d = decide({ learnerText: "She happy." });
    const badDecision = { ...d, action: "INVALID_ACTION" as unknown as TeacherDecision["action"] };
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), badDecision);
    const v1 = result.gates.find(g => g.gateId === "V1_ACTION_INPUT_COHERENCE")!;
    expect(v1.passed).toBe(false);
    expect(v1.isHardFail).toBe(true);
  });
});

// ─── V2 — Rationale Quality ────────────────────────────────────────────────

describe("V2 — Rationale quality", () => {
  it("passes: real decision has well-formed rationaleVi and rationaleEn", () => {
    const d = decide({ learnerText: "She happy." });
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), d);
    const v2 = result.gates.find(g => g.gateId === "V2_RATIONALE_QUALITY")!;
    expect(v2.passed).toBe(true);
  });

  it("passes: empty-text rationale is appropriate", () => {
    const d = decide({ learnerText: "" });
    const result = evaluateTeachingDecision(input({ learnerText: "" }), d);
    const v2 = result.gates.find(g => g.gateId === "V2_RATIONALE_QUALITY")!;
    expect(v2.passed).toBe(true);
  });

  it("fails: empty rationaleVi", () => {
    const d = decide({ learnerText: "She happy." });
    const badDecision = { ...d, rationaleVi: "" };
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), badDecision);
    const v2 = result.gates.find(g => g.gateId === "V2_RATIONALE_QUALITY")!;
    expect(v2.passed).toBe(false);
  });

  it("fails: empty rationaleEn", () => {
    const d = decide({ learnerText: "She happy." });
    const badDecision = { ...d, rationaleEn: "" };
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), badDecision);
    const v2 = result.gates.find(g => g.gateId === "V2_RATIONALE_QUALITY")!;
    expect(v2.passed).toBe(false);
  });

  it("fails: empty reasonCode", () => {
    const d = decide({ learnerText: "She happy." });
    const badDecision = { ...d, reasonCode: "" };
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), badDecision);
    const v2 = result.gates.find(g => g.gateId === "V2_RATIONALE_QUALITY")!;
    expect(v2.passed).toBe(false);
  });

  it("fails: rationaleVi contains harsh language", () => {
    const d = decide({ learnerText: "She happy." });
    const badDecision = { ...d, rationaleVi: "Mercy thấy bạn sai quá — học mãi không vào." };
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), badDecision);
    const v2 = result.gates.find(g => g.gateId === "V2_RATIONALE_QUALITY")!;
    expect(v2.passed).toBe(false);
  });

  it("is not a hard-fail gate", () => {
    const d = decide({ learnerText: "She happy." });
    const badDecision = { ...d, rationaleVi: "" };
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), badDecision);
    const v2 = result.gates.find(g => g.gateId === "V2_RATIONALE_QUALITY")!;
    expect(v2.isHardFail).toBe(false);
  });
});

// ─── V3 — Timing-Action Consistency ────────────────────────────────────────

describe("V3 — Timing-action consistency", () => {
  it("passes: IMMEDIATE → CORRECT_NOW", () => {
    const d = decide({ learnerText: "She happy." });
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), d);
    const v3 = result.gates.find(g => g.gateId === "V3_TIMING_ACTION_CONSISTENCY")!;
    expect(v3.passed).toBe(true);
  });

  it("passes: SUPPRESS timing → SUPPRESS action (empty text)", () => {
    const d = decide({ learnerText: "" });
    const result = evaluateTeachingDecision(input({ learnerText: "" }), d);
    const v3 = result.gates.find(g => g.gateId === "V3_TIMING_ACTION_CONSISTENCY")!;
    expect(v3.passed).toBe(true);
  });

  it("fails hard: timing-action mismatch (synthetic)", () => {
    const d = decide({ learnerText: "She happy." });
    const badDecision = { ...d, timingMode: "DELAYED" as const, action: "CORRECT_NOW" as const };
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), badDecision);
    const v3 = result.gates.find(g => g.gateId === "V3_TIMING_ACTION_CONSISTENCY")!;
    expect(v3.passed).toBe(false);
    expect(v3.isHardFail).toBe(true);
  });

  it("passes: DEFER timing → DEFER action (shy learner, grammar error)", () => {
    const d = decide({
      learnerText: "She happy.",
      learnerConfidence: "shy",
      previousCorrectionsThisSession: 5,
    });
    const result = evaluateTeachingDecision(
      input({ learnerText: "She happy.", learnerConfidence: "shy", previousCorrectionsThisSession: 5 }),
      d,
    );
    const v3 = result.gates.find(g => g.gateId === "V3_TIMING_ACTION_CONSISTENCY")!;
    expect(v3.passed).toBe(true);
  });

  it("fails: IMMEDIATE timing but SUPPRESS action", () => {
    const d = decide({ learnerText: "She happy." });
    const badDecision = { ...d, timingMode: "IMMEDIATE" as const, action: "SUPPRESS" as const };
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), badDecision);
    const v3 = result.gates.find(g => g.gateId === "V3_TIMING_ACTION_CONSISTENCY")!;
    expect(v3.passed).toBe(false);
  });
});

// ─── V4 — Correction Shape Validity ────────────────────────────────────────

describe("V4 — Correction shape validity", () => {
  it("passes: real correction has correctedText, appliedRuleIds, severity", () => {
    const d = decide({ learnerText: "She happy." });
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), d);
    const v4 = result.gates.find(g => g.gateId === "V4_CORRECTION_SHAPE_VALIDITY")!;
    expect(v4.passed).toBe(true);
  });

  it("fails: CORRECT_NOW with null correction (synthetic)", () => {
    const d = decide({ learnerText: "She happy." });
    const badDecision = { ...d, correction: null };
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), badDecision);
    const v4 = result.gates.find(g => g.gateId === "V4_CORRECTION_SHAPE_VALIDITY")!;
    expect(v4.passed).toBe(false);
  });

  it("fails: CORRECT_NOW with empty correctedText (synthetic)", () => {
    const d = decide({ learnerText: "She happy." });
    const badDecision = {
      ...d,
      correction: { ...d.correction!, correctedText: "" },
    };
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), badDecision);
    const v4 = result.gates.find(g => g.gateId === "V4_CORRECTION_SHAPE_VALIDITY")!;
    expect(v4.passed).toBe(false);
  });

  it("fails: CORRECT_NOW with empty appliedRuleIds (synthetic)", () => {
    const d = decide({ learnerText: "She happy." });
    const badDecision = {
      ...d,
      correction: { ...d.correction!, appliedRuleIds: [] },
    };
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), badDecision);
    const v4 = result.gates.find(g => g.gateId === "V4_CORRECTION_SHAPE_VALIDITY")!;
    expect(v4.passed).toBe(false);
  });

  it("passes: SUPPRESS due to no-error has null correction", () => {
    const d = decide({ learnerText: "I went to school yesterday." });
    const result = evaluateTeachingDecision(
      input({ learnerText: "I went to school yesterday." }),
      d,
    );
    const v4 = result.gates.find(g => g.gateId === "V4_CORRECTION_SHAPE_VALIDITY")!;
    expect(v4.passed).toBe(true);
  });

  it("is not a hard-fail gate", () => {
    const d = decide({ learnerText: "She happy." });
    const badDecision = { ...d, correction: null };
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), badDecision);
    const v4 = result.gates.find(g => g.gateId === "V4_CORRECTION_SHAPE_VALIDITY")!;
    expect(v4.isHardFail).toBe(false);
  });
});

// ─── V5 — Suppression Justification ────────────────────────────────────────

describe("V5 — Suppression justification", () => {
  it("passes: not applicable for CORRECT_NOW", () => {
    const d = decide({ learnerText: "She happy." });
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), d);
    const v5 = result.gates.find(g => g.gateId === "V5_SUPPRESSION_JUSTIFICATION")!;
    expect(v5.passed).toBe(true);
    expect(v5.reasonCode).toBe("v5_not_applicable");
  });

  it("passes: self-evident for empty text", () => {
    const d = decide({ learnerText: "" });
    const result = evaluateTeachingDecision(input({ learnerText: "" }), d);
    const v5 = result.gates.find(g => g.gateId === "V5_SUPPRESSION_JUSTIFICATION")!;
    expect(v5.passed).toBe(true);
    expect(v5.reasonCode).toBe("v5_suppress_self_evident");
  });

  it("passes: self-evident for no-error input", () => {
    const d = decide({ learnerText: "I went to school yesterday." });
    const result = evaluateTeachingDecision(
      input({ learnerText: "I went to school yesterday." }),
      d,
    );
    const v5 = result.gates.find(g => g.gateId === "V5_SUPPRESSION_JUSTIFICATION")!;
    expect(v5.passed).toBe(true);
  });

  it("fails: SUPPRESS with errors but no suppressionDecision (synthetic)", () => {
    const d = decide({ learnerText: "She happy." });
    const badDecision = {
      ...d,
      action: "SUPPRESS" as const,
      reasonCode: "shy_learner_suppress_minor",
      suppressionDecision: null,
    };
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), badDecision);
    const v5 = result.gates.find(g => g.gateId === "V5_SUPPRESSION_JUSTIFICATION")!;
    expect(v5.passed).toBe(false);
    expect(v5.reasonCode).toBe("v5_missing_suppression_justification");
  });
});

// ─── V6 — Hint Ladder Alignment ────────────────────────────────────────────

describe("V6 — Hint ladder alignment", () => {
  it("passes: no hint recommended → not applicable", () => {
    const d = decide({ learnerText: "" });
    const result = evaluateTeachingDecision(input({ learnerText: "" }), d);
    const v6 = result.gates.find(g => g.gateId === "V6_HINT_LADDER_ALIGNMENT")!;
    expect(v6.passed).toBe(true);
    expect(v6.reasonCode).toBe("v6_no_hint");
  });

  it("fails: strong hint on frustrated learner (synthetic)", () => {
    const d = decide({ learnerText: "She happy.", isShowingFrustration: true });
    const badDecision = {
      ...d,
      hintLadder: {
        decision: "HINT_STRONG" as const,
        reason: "test",
        reasonCode: "test_code",
      },
    };
    const result = evaluateTeachingDecision(
      input({ learnerText: "She happy.", isShowingFrustration: true }),
      badDecision,
    );
    const v6 = result.gates.find(g => g.gateId === "V6_HINT_LADDER_ALIGNMENT")!;
    expect(v6.passed).toBe(false);
  });

  it("fails: strong hint for minor error with single occurrence (synthetic)", () => {
    const d = decide({ learnerText: "She happy." });
    const badDecision = {
      ...d,
      hintLadder: {
        decision: "HINT_STRONG" as const,
        reason: "test",
        reasonCode: "test_code",
      },
    };
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), badDecision);
    const v6 = result.gates.find(g => g.gateId === "V6_HINT_LADDER_ALIGNMENT")!;
    expect(v6.passed).toBe(false);
  });

  it("passes: HINT_MINIMAL aligned with shy learner", () => {
    const d = decide({ learnerText: "She happy.", learnerConfidence: "shy" });
    const decision = {
      ...d,
      hintLadder: {
        decision: "HINT_MINIMAL" as const,
        reason: "Shy learner gets gentle hint",
        reasonCode: "hint_shy_minimal",
      },
    };
    const result = evaluateTeachingDecision(
      input({ learnerText: "She happy.", learnerConfidence: "shy" }),
      decision,
    );
    const v6 = result.gates.find(g => g.gateId === "V6_HINT_LADDER_ALIGNMENT")!;
    expect(v6.passed).toBe(true);
  });
});

// ─── V7 — Readiness-Action Agreement ───────────────────────────────────────

describe("V7 — Readiness-action agreement", () => {
  it("passes: READY_NOW with CORRECT_NOW", () => {
    const d = decide({ learnerText: "She happy." });
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), d);
    const v7 = result.gates.find(g => g.gateId === "V7_READINESS_ACTION_AGREEMENT")!;
    expect(v7.passed).toBe(true);
  });

  it("fails: NOT_READY_PREREQUISITE + CORRECT_NOW on lesson target (synthetic)", () => {
    const d = decide({ learnerText: "She go to school.", isCurrentLessonTarget: true });
    const badDecision = {
      ...d,
      readiness: {
        decision: "NOT_READY_PREREQUISITE" as const,
        reason: "Prerequisite mastery too low",
        reasonCode: "readiness_prerequisite_deficiency",
        suggestedPrerequisiteWork: ["subject-verb-agreement"],
      },
    };
    const result = evaluateTeachingDecision(
      input({ learnerText: "She go to school.", isCurrentLessonTarget: true }),
      badDecision,
    );
    const v7 = result.gates.find(g => g.gateId === "V7_READINESS_ACTION_AGREEMENT")!;
    expect(v7.passed).toBe(false);
  });

  it("fails: SKIP_AHEAD + EXPLAIN_PATTERN for single-occurrence error (synthetic)", () => {
    const d = decide({ learnerText: "She happy.", cefrLevel: "C1" });
    const badDecision = {
      ...d,
      action: "EXPLAIN_PATTERN" as const,
      patternLabel: "be-verb-omission",
      readiness: {
        decision: "SKIP_AHEAD" as const,
        reason: "Advanced learner, high mastery",
        reasonCode: "readiness_skip_ahead",
        suggestedNextTarget: "past-perfect",
      },
    };
    const result = evaluateTeachingDecision(
      input({ learnerText: "She happy.", cefrLevel: "C1" }),
      badDecision,
    );
    const v7 = result.gates.find(g => g.gateId === "V7_READINESS_ACTION_AGREEMENT")!;
    expect(v7.passed).toBe(false);
  });

  it("fails: missing readiness entirely (synthetic)", () => {
    const d = decide({ learnerText: "She happy." });
    const badDecision = { ...d, readiness: null as unknown as TeacherDecision["readiness"] };
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), badDecision);
    const v7 = result.gates.find(g => g.gateId === "V7_READINESS_ACTION_AGREEMENT")!;
    expect(v7.passed).toBe(false);
  });

  it("passes: NOT_READY_PREREQUISITE with SUPPRESS (not correcting lesson target)", () => {
    const d = decide({ learnerText: "" });
    const decision = {
      ...d,
      readiness: {
        decision: "NOT_READY_PREREQUISITE" as const,
        reason: "Prerequisite mastery too low",
        reasonCode: "readiness_prerequisite_deficiency",
        suggestedPrerequisiteWork: ["subject-verb-agreement"],
      },
    };
    const result = evaluateTeachingDecision(input({ learnerText: "" }), decision);
    const v7 = result.gates.find(g => g.gateId === "V7_READINESS_ACTION_AGREEMENT")!;
    expect(v7.passed).toBe(true);
  });
});

// ─── V8 — Cross-Field Narrative Coherence ──────────────────────────────────

describe("V8 — Cross-field narrative coherence", () => {
  it("passes: well-formed CORRECT_NOW decision is consistent", () => {
    const d = decide({ learnerText: "She happy." });
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), d);
    const v8 = result.gates.find(g => g.gateId === "V8_CROSS_FIELD_NARRATIVE")!;
    expect(v8.passed).toBe(true);
  });

  it("fails: EXPLAIN_PATTERN without patternLabel (synthetic)", () => {
    const d = decide({ learnerText: "She go to school every day.", sameMistakeCount: 4 });
    const badDecision = {
      ...d,
      action: "EXPLAIN_PATTERN" as const,
      patternLabel: undefined,
    };
    const result = evaluateTeachingDecision(
      input({ learnerText: "She go to school every day.", sameMistakeCount: 4 }),
      badDecision,
    );
    const v8 = result.gates.find(g => g.gateId === "V8_CROSS_FIELD_NARRATIVE")!;
    expect(v8.passed).toBe(false);
  });

  it("fails: DEFER without delayTurns (synthetic)", () => {
    const d = decide({ learnerText: "She happy." });
    const badDecision = {
      ...d,
      action: "DEFER" as const,
      delayTurns: undefined,
    };
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), badDecision);
    const v8 = result.gates.find(g => g.gateId === "V8_CROSS_FIELD_NARRATIVE")!;
    expect(v8.passed).toBe(false);
  });

  it("fails: DEFER with negative delayTurns (synthetic)", () => {
    const d = decide({ learnerText: "She happy." });
    const badDecision = {
      ...d,
      action: "DEFER" as const,
      delayTurns: -1,
    };
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), badDecision);
    const v8 = result.gates.find(g => g.gateId === "V8_CROSS_FIELD_NARRATIVE")!;
    expect(v8.passed).toBe(false);
  });

  it("fails: CORRECT_NOW should not have delayTurns (synthetic)", () => {
    const d = decide({ learnerText: "She happy." });
    const badDecision = { ...d, delayTurns: 3 };
    const result = evaluateTeachingDecision(input({ learnerText: "She happy." }), badDecision);
    const v8 = result.gates.find(g => g.gateId === "V8_CROSS_FIELD_NARRATIVE")!;
    expect(v8.passed).toBe(false);
  });
});

// ─── Full Evaluation Pipeline ──────────────────────────────────────────────

describe("evaluateTeachingDecision — full pipeline", () => {
  it("returns EXEMPLARY for a well-formed grammar correction decision", () => {
    const inp = input({ learnerText: "She happy." });
    const d = decideTeacherAction(inp);
    const result = evaluateTeachingDecision(inp, d);
    assertAllGatesPresent(result);
    expect(result.classification).toBe("EXEMPLARY");
    expect(result.allPassed).toBe(true);
    expect(result.safetyPassed).toBe(true);
    expect(result.passedCount).toBe(8);
    expect(result.failedCount).toBe(0);
  });

  it("returns EXEMPLARY for empty text decision", () => {
    const inp = input({ learnerText: "" });
    const d = decideTeacherAction(inp);
    const result = evaluateTeachingDecision(inp, d);
    assertAllGatesPresent(result);
    expect(result.classification).toBe("EXEMPLARY");
    expect(result.allPassed).toBe(true);
  });

  it("returns EXEMPLARY for no-error decision", () => {
    const inp = input({ learnerText: "I went to school yesterday." });
    const d = decideTeacherAction(inp);
    const result = evaluateTeachingDecision(inp, d);
    assertAllGatesPresent(result);
    expect(result.classification).toBe("EXEMPLARY");
  });

  it("returns ACCEPTABLE when 1-2 non-hard-fail gates fail", () => {
    const inp = input({ learnerText: "She happy." });
    const d = decideTeacherAction(inp);
    // Break V2 (rationale) — not hard-fail
    const badDecision = { ...d, rationaleVi: "", rationaleEn: "" };
    const result = evaluateTeachingDecision(inp, badDecision);
    expect(result.classification).toBe("ACCEPTABLE");
    expect(result.safetyPassed).toBe(true);
  });

  it("returns NEEDS_REVIEW when ≥3 non-hard-fail gates fail", () => {
    const inp = input({ learnerText: "She happy." });
    const d = decideTeacherAction(inp);
    // Break V2 (rationale), V4 (null correction for EXPLAIN_PATTERN), V8 (no patternLabel)
    const badDecision = {
      ...d,
      action: "EXPLAIN_PATTERN" as const,
      timingMode: "EXPLAIN_PATTERN" as const,
      rationaleVi: "",
      rationaleEn: "",
      reasonCode: "",
      correction: null,
      enrichment: null,
      patternLabel: undefined,
    };
    const result = evaluateTeachingDecision(inp, badDecision);
    // V2, V4, V8 should all fail → ≥3 failures → NEEDS_REVIEW
    const failedGates = result.gates.filter(g => !g.passed);
    expect(failedGates.length).toBeGreaterThanOrEqual(3);
    expect(result.classification).toBe("NEEDS_REVIEW");
    expect(result.safetyPassed).toBe(true);
  });

  it("returns UNSAFE when hard-fail gate (V1 or V3) fails", () => {
    const inp = input({ learnerText: "" });
    const d = decideTeacherAction(input({ learnerText: "She happy." }));
    // Empty input but CORRECT_NOW → V1 hard-fail
    const result = evaluateTeachingDecision(inp, d);
    expect(result.classification).toBe("UNSAFE");
    expect(result.safetyPassed).toBe(false);
    expect(result.summaryVi).toContain("Không an toàn");
  });

  it("summaryVi is non-empty and in Vietnamese", () => {
    const inp = input({ learnerText: "She happy." });
    const d = decideTeacherAction(inp);
    const result = evaluateTeachingDecision(inp, d);
    expect(result.summaryVi).toBeTruthy();
    expect(result.summaryVi.length).toBeGreaterThan(10);
  });

  it("summaryEn is non-empty", () => {
    const inp = input({ learnerText: "She happy." });
    const d = decideTeacherAction(inp);
    const result = evaluateTeachingDecision(inp, d);
    expect(result.summaryEn).toBeTruthy();
    expect(result.summaryEn.length).toBeGreaterThan(10);
  });
});

// ─── Safety Check ──────────────────────────────────────────────────────────

describe("isDecisionSafe", () => {
  it("returns safe=true for a well-formed decision", () => {
    const inp = input({ learnerText: "She happy." });
    const d = decideTeacherAction(inp);
    const safety = isDecisionSafe(inp, d);
    expect(safety.safe).toBe(true);
    expect(safety.reasonVi).toBeNull();
  });

  it("returns safe=false when V1 fails (empty text + non-SUPPRESS)", () => {
    const inp = input({ learnerText: "" });
    const d = decideTeacherAction(input({ learnerText: "She happy." }));
    const safety = isDecisionSafe(inp, d);
    expect(safety.safe).toBe(false);
    expect(safety.failedGates.length).toBeGreaterThan(0);
    expect(safety.reasonVi).toBeTruthy();
  });

  it("returns safe=false when V3 fails (timing-action mismatch)", () => {
    const inp = input({ learnerText: "She happy." });
    const d = decideTeacherAction(inp);
    const badDecision = { ...d, timingMode: "DELAYED" as const, action: "CORRECT_NOW" as const };
    const safety = isDecisionSafe(inp, badDecision);
    expect(safety.safe).toBe(false);
  });

  it("returns safe=true even when non-hard-fail gates fail", () => {
    const inp = input({ learnerText: "She happy." });
    const d = decideTeacherAction(inp);
    const badDecision = { ...d, rationaleVi: "", rationaleEn: "" }; // only V2 fails
    const safety = isDecisionSafe(inp, badDecision);
    expect(safety.safe).toBe(true);
  });
});

// ─── Telemetry Formatter ───────────────────────────────────────────────────

describe("formatEvaluationTelemetry", () => {
  it("produces a structured record with all expected keys", () => {
    const inp = input({ learnerText: "She happy." });
    const d = decideTeacherAction(inp);
    const result = evaluateTeachingDecision(inp, d);
    const telemetry = formatEvaluationTelemetry(result);

    expect(telemetry.classification).toBe("EXEMPLARY");
    expect(telemetry.allPassed).toBe(true);
    expect(telemetry.safetyPassed).toBe(true);
    expect(telemetry.passedCount).toBe(8);
    expect(telemetry.failedCount).toBe(0);
    expect(telemetry.gateResults).toBeDefined();
    expect(telemetry.failedGateIds).toEqual([]);

    // gateResults should have all 8 gates
    const gateResults = telemetry.gateResults as Record<string, unknown>;
    expect(Object.keys(gateResults).length).toBe(8);
    expect(gateResults["V1_ACTION_INPUT_COHERENCE"]).toBeDefined();
  });

  it("includes failed gate IDs when there are failures", () => {
    const inp = input({ learnerText: "" });
    const d = decideTeacherAction(input({ learnerText: "She happy." }));
    const result = evaluateTeachingDecision(inp, d);
    const telemetry = formatEvaluationTelemetry(result);

    expect(telemetry.failedGateIds).toContain("V1_ACTION_INPUT_COHERENCE");
    expect(telemetry.safetyPassed).toBe(false);
  });
});

// ─── evaluateDecisionQuick ─────────────────────────────────────────────────

describe("evaluateDecisionQuick", () => {
  it("returns the same result as evaluateTeachingDecision", () => {
    const inp = input({ learnerText: "She happy." });
    const d = decideTeacherAction(inp);
    const r1 = evaluateTeachingDecision(inp, d);
    const r2 = evaluateDecisionQuick(inp, d);
    expect(r1.classification).toBe(r2.classification);
    expect(r1.allPassed).toBe(r2.allPassed);
    expect(r1.passedCount).toBe(r2.passedCount);
  });
});

// ─── Edge Cases ────────────────────────────────────────────────────────────

describe("Edge cases", () => {
  it("handles French input gracefully", () => {
    const inp = input({ learnerText: "Je suis content.", targetLanguage: "fr" });
    const d = decideTeacherAction(inp);
    const result = evaluateTeachingDecision(inp, d);
    assertAllGatesPresent(result);
    // French text with no errors → should pass evaluation
    expect(result.safetyPassed).toBe(true);
  });

  it("handles whitespace-only text", () => {
    const inp = input({ learnerText: "   " });
    const d = decideTeacherAction(inp);
    const result = evaluateTeachingDecision(inp, d);
    expect(result.classification).toBe("EXEMPLARY");
    expect(result.safetyPassed).toBe(true);
  });

  it("handles 500+ character text", () => {
    const longText = "I go to school every day. ".repeat(30);
    const inp = input({ learnerText: longText });
    const d = decideTeacherAction(inp);
    const result = evaluateTeachingDecision(inp, d);
    assertAllGatesPresent(result);
    expect(result.safetyPassed).toBe(true);
  });

  it("handles emoji in text", () => {
    const inp = input({ learnerText: "I am happy 😊 today" });
    const d = decideTeacherAction(inp);
    const result = evaluateTeachingDecision(inp, d);
    assertAllGatesPresent(result);
    expect(result.safetyPassed).toBe(true);
  });

  it("handles mixed Vietnamese-English text", () => {
    const inp = input({ learnerText: "Tôi đi to school every day" });
    const d = decideTeacherAction(inp);
    const result = evaluateTeachingDecision(inp, d);
    assertAllGatesPresent(result);
    expect(result.safetyPassed).toBe(true);
  });

  it("handles punctuation-only text", () => {
    const inp = input({ learnerText: "!!!" });
    const d = decideTeacherAction(inp);
    const result = evaluateTeachingDecision(inp, d);
    assertAllGatesPresent(result);
    expect(result.safetyPassed).toBe(true);
  });

  it("all real decisions from decision engine are at least ACCEPTABLE", () => {
    const testCases: TeacherDecisionInput[] = [
      input({ learnerText: "She happy." }),
      input({ learnerText: "" }),
      input({ learnerText: "I went to school yesterday." }),
      input({ learnerText: "She go to school every day.", isCurrentLessonTarget: true }),
      input({ learnerText: "She go to school every day.", sameMistakeCount: 4 }),
      input({ learnerText: "She happy.", learnerConfidence: "shy" }),
      input({ learnerText: "She happy.", cefrLevel: "C1", learnerConfidence: "confident" }),
      input({ learnerText: "She happy.", previousCorrectionsThisSession: 10 }),
      input({ learnerText: "it's very Sunday in the summer" }),
      input({ learnerText: "I mean... she go to school." }),
    ];

    for (const tc of testCases) {
      const d = decideTeacherAction(tc);
      const result = evaluateTeachingDecision(tc, d);
      // Every real decision should be at least ACCEPTABLE
      expect(
        ["EXEMPLARY", "ACCEPTABLE"].includes(result.classification),
        `Decision for "${tc.learnerText}" classified as ${result.classification} — expected EXEMPLARY or ACCEPTABLE. Failed gates: ${result.gates.filter(g => !g.passed).map(g => g.gateId).join(", ")}`,
      ).toBe(true);
    }
  });
});

// ─── Catalogs ──────────────────────────────────────────────────────────────

describe("Catalogs", () => {
  it("EVALUATION_CLASSIFICATION_CATALOG has 4 entries", () => {
    expect(EVALUATION_CLASSIFICATION_CATALOG).toHaveLength(4);
    const classes = EVALUATION_CLASSIFICATION_CATALOG.map(c => c.classification);
    expect(classes).toContain("EXEMPLARY");
    expect(classes).toContain("ACCEPTABLE");
    expect(classes).toContain("NEEDS_REVIEW");
    expect(classes).toContain("UNSAFE");
  });

  it("EVALUATION_GATE_CATALOG has 8 entries with correct gate IDs", () => {
    expect(EVALUATION_GATE_CATALOG).toHaveLength(8);
    const gateIds = EVALUATION_GATE_CATALOG.map(g => g.gateId);
    expect(gateIds).toContain("V1_ACTION_INPUT_COHERENCE");
    expect(gateIds).toContain("V2_RATIONALE_QUALITY");
    expect(gateIds).toContain("V3_TIMING_ACTION_CONSISTENCY");
    expect(gateIds).toContain("V4_CORRECTION_SHAPE_VALIDITY");
    expect(gateIds).toContain("V5_SUPPRESSION_JUSTIFICATION");
    expect(gateIds).toContain("V6_HINT_LADDER_ALIGNMENT");
    expect(gateIds).toContain("V7_READINESS_ACTION_AGREEMENT");
    expect(gateIds).toContain("V8_CROSS_FIELD_NARRATIVE");
  });

  it("catalog entries have all required fields", () => {
    for (const entry of EVALUATION_GATE_CATALOG) {
      expect(entry.gateId).toBeTruthy();
      expect(entry.titleVi).toBeTruthy();
      expect(entry.titleEn).toBeTruthy();
      expect(entry.descriptionVi).toBeTruthy();
      expect(typeof entry.isHardFail).toBe("boolean");
    }
  });

  it("V1 and V3 are the only hard-fail gates in the catalog", () => {
    const hardFailGates = EVALUATION_GATE_CATALOG.filter(g => g.isHardFail);
    expect(hardFailGates.map(g => g.gateId)).toEqual([
      "V1_ACTION_INPUT_COHERENCE",
      "V3_TIMING_ACTION_CONSISTENCY",
    ]);
  });
});

// ─── Determinism ───────────────────────────────────────────────────────────

describe("Determinism", () => {
  it("produces identical results for identical inputs", () => {
    const inp = input({ learnerText: "She happy." });
    const d = decideTeacherAction(inp);
    const r1 = evaluateTeachingDecision(inp, d);
    const r2 = evaluateTeachingDecision(inp, d);

    expect(r1.classification).toBe(r2.classification);
    expect(r1.allPassed).toBe(r2.allPassed);
    expect(r1.passedCount).toBe(r2.passedCount);
    for (let i = 0; i < r1.gates.length; i++) {
      expect(r1.gates[i].passed).toBe(r2.gates[i].passed);
      expect(r1.gates[i].reasonCode).toBe(r2.gates[i].reasonCode);
    }
  });
});

// ─── No-throw Resilience ───────────────────────────────────────────────────

describe("No-throw resilience", () => {
  it("does not throw on 20 diverse input combinations", () => {
    const inputs: TeacherDecisionInput[] = [
      input({ learnerText: "She happy." }),
      input({ learnerText: "" }),
      input({ learnerText: "I went to school yesterday." }),
      input({ learnerText: "She go to school every day.", isCurrentLessonTarget: true }),
      input({ learnerText: "She happy.", cefrLevel: "A1" }),
      input({ learnerText: "She happy.", cefrLevel: "C2" }),
      input({ learnerText: "She happy.", learnerConfidence: "shy" }),
      input({ learnerText: "She happy.", learnerConfidence: "confident" }),
      input({ learnerText: "She happy.", previousCorrectionsThisSession: 15 }),
      input({ learnerText: "She happy.", sameMistakeCount: 5 }),
      input({ learnerText: "it's very Sunday in the summer" }),
      input({ learnerText: "I mean... she go to school." }),
      input({ learnerText: "She happy.", isShowingFrustration: true }),
      input({ learnerText: "She happy.", turnsSinceLastHint: 0 }),
      input({ learnerText: "She happy.", hintsThisSession: 5 }),
      input({ learnerText: "Je suis content.", targetLanguage: "fr" }),
      input({ learnerText: "   " }),
      input({ learnerText: "!!!..." }),
      input({ learnerText: "😊" }),
      input({ learnerText: "Tôi đi to school every day" }),
    ];

    for (const tc of inputs) {
      const d = decideTeacherAction(tc);
      expect(() => evaluateTeachingDecision(tc, d)).not.toThrow();
    }
  });
});
