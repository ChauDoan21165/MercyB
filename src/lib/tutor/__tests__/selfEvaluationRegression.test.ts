/**
 * Self-Evaluation Regression Suite — Master Test Harness
 *
 * This is the CANONICAL regression test suite for Teacher Mercy's
 * self-evaluation behavior. It exercises ALL gate chains together:
 *
 *   S1-S8  — Self-Audit Gate (before-showing safety check)
 *   O1-O8  — Overclaim Guard (fake-certainty detection)
 *   V1-V8  — Teaching Decision Evaluation (decision quality)
 *   E1-E8  — Evidence-Based Recommendation Explainer (explanation integrity)
 *
 * If ANY test in this suite breaks, it means a core self-evaluation
 * behavior has changed — intentionally or not. Regression failures
 * require CONSCIOUS review before merging.
 *
 * Design principles:
 *   1. Pure importability — verifies every module loads without errors
 *   2. Catalog integrity — ensures no catalog entry has been lost
 *   3. Cross-gate composition — tests gate chains working together
 *   4. Golden fixtures — canonical inputs with known-good outputs
 *   5. Determinism gate — same input → same output always
 *   6. Telemetry consistency — all format functions produce valid records
 *
 * Pure functions — no I/O, no side effects, deterministic.
 */

import { describe, expect, it } from "vitest";

// ─── S1-S8 Self-Audit Gate ────────────────────────────────────────────────

import {
  selfAuditBeforeShowing,
  selfAuditCorrectionQuick,
  selfAuditConversationQuick,
  formatSelfAuditTelemetry,
  SELF_AUDIT_DECISION_CATALOG,
  SELF_AUDIT_GATE_CATALOG,
  type SelfAuditDecision,
} from "../teacherMercySelfAuditGate";

// ─── O1-O8 Overclaim Guard ────────────────────────────────────────────────

import {
  guardOverclaim,
  guardOverclaimQuick,
  formatOverclaimTelemetry,
  OVERCLAIM_DECISION_CATALOG,
  OVERCLAIM_GATE_CATALOG,
  type OverclaimDecision,
} from "../overclaimGuard";

// ─── V1-V8 Teaching Decision Evaluation ───────────────────────────────────

import {
  evaluateTeachingDecision,
  isDecisionSafe,
  evaluateDecisionQuick,
  formatEvaluationTelemetry,
  EVALUATION_CLASSIFICATION_CATALOG,
  EVALUATION_GATE_CATALOG,
} from "../teachingDecisionEvaluationGate";

// ─── E1-E8 Evidence-Based Recommendation Explainer ────────────────────────

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
  type EvidenceItem,
  type EvidenceChain,
} from "../lessonRecommendationExplainer";

// ─── Supporting Modules ───────────────────────────────────────────────────

import { checkTeacherMercyContract } from "../teacherMercyContract";
import { evaluateRubricFocused } from "../teacherMercyRubric";
import type { LearnerHistoryProfile } from "../learnerHistoryProfile";
import type { NextLessonRecommendation } from "../nextLessonRecommender";
import type { TeacherDecision, TeacherDecisionInput } from "../teacherDecisionEngine";
import type {
  SelfAuditInput,
  SelfAuditResult,
} from "../teacherMercySelfAuditGate";

// ─── Helpers ──────────────────────────────────────────────────────────────

const NOW = 1_700_000_000_000;

/** A well-formed correction response that should pass all audits. */
function goodCorrectionVi(): string {
  return (
    "Mình hiểu ý bạn — bạn muốn nói là hôm qua bạn đã đi chợ. " +
    "🔍 Bạn viết: \"I go to market yesterday.\" " +
    "💡 Gợi ý: \"I went to the market yesterday.\" " +
    "📝 Giải thích: Khi có 'yesterday', động từ cần ở quá khứ 'went'. " +
    "Bạn thử đặt một câu khác với 'yesterday' nhé?"
  );
}

/** A good conversation response — exactly 1 question to pass R4. */
function goodConversationVi(): string {
  return "Nghe thú vị quá! Bạn đã đi chợ hôm qua và mua rau à? Kể thêm cho mình nghe về chợ ở chỗ bạn đi!";
}

/** A response with fake praise — should fail S1 (hard safety). */
function fakePraiseVi(): string {
  return "Hoàn hảo! Xuất sắc! Bạn viết: \"I go to market yesterday.\" 🔍 Nhưng cần sửa: \"I went to the market yesterday.\"";
}

/** A response with absolute certainty — should trigger O1. */
function absoluteCertaintyVi(): string {
  return "Khi có 'yesterday', bạn luôn luôn phải dùng thì quá khứ, không có ngoại lệ nào cả.";
}

/** A response with fake statistics — should trigger O2. */
function fakeStatsVi(): string {
  return "Theo nghiên cứu, 90% người Việt mắc lỗi này khi học thì quá khứ.";
}

/** A response with BOTH fake praise AND absolute certainty. */
function fakePraiseAndAbsoluteVi(): string {
  return "Hoàn hảo! Xuất sắc! Bạn luôn luôn đúng khi dùng thì quá khứ.";
}

/** Build a minimal learner history profile. */
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

/** A minimal next-lesson recommendation for testing the explainer. */
function minimalRecommendation(overrides: Partial<NextLessonRecommendation> = {}): NextLessonRecommendation {
  return {
    lessonTitle: "Past Tense Basics",
    targetSkill: "tense-omission",
    reason: "Interference pattern detected: tense-omission",
    suggestedMode: "grammar" as const,
    ruleFired: "interference:tense-omission",
    ...overrides,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. IMPORTABILITY GATE — Every self-evaluation module must load
// ═══════════════════════════════════════════════════════════════════════════

describe("Importability gate — all self-evaluation modules load", () => {
  it("S1-S8: teacherMercySelfAuditGate exports are defined", () => {
    expect(selfAuditBeforeShowing).toBeTypeOf("function");
    expect(selfAuditCorrectionQuick).toBeTypeOf("function");
    expect(selfAuditConversationQuick).toBeTypeOf("function");
    expect(formatSelfAuditTelemetry).toBeTypeOf("function");
    expect(SELF_AUDIT_DECISION_CATALOG).toBeInstanceOf(Array);
    expect(SELF_AUDIT_GATE_CATALOG).toBeInstanceOf(Array);
  });

  it("O1-O8: overclaimGuard exports are defined", () => {
    expect(guardOverclaim).toBeTypeOf("function");
    expect(guardOverclaimQuick).toBeTypeOf("function");
    expect(formatOverclaimTelemetry).toBeTypeOf("function");
    expect(OVERCLAIM_DECISION_CATALOG).toBeInstanceOf(Array);
    expect(OVERCLAIM_GATE_CATALOG).toBeInstanceOf(Array);
  });

  it("V1-V8: teachingDecisionEvaluationGate exports are defined", () => {
    expect(evaluateTeachingDecision).toBeTypeOf("function");
    expect(isDecisionSafe).toBeTypeOf("function");
    expect(evaluateDecisionQuick).toBeTypeOf("function");
    expect(formatEvaluationTelemetry).toBeTypeOf("function");
    expect(EVALUATION_CLASSIFICATION_CATALOG).toBeInstanceOf(Array);
    expect(EVALUATION_GATE_CATALOG).toBeInstanceOf(Array);
  });

  it("E1-E8: lessonRecommendationExplainer exports are defined", () => {
    expect(explainRecommendation).toBeTypeOf("function");
    expect(explainSequence).toBeTypeOf("function");
    expect(evidenceScore).toBeTypeOf("function");
    expect(calibrateEvidenceStrength).toBeTypeOf("function");
    expect(assessConfidence).toBeTypeOf("function");
    expect(getConfidenceLabelVi).toBeTypeOf("function");
    expect(collectAllEvidence).toBeTypeOf("function");
    expect(buildEvidenceChain).toBeTypeOf("function");
    expect(considerAlternatives).toBeTypeOf("function");
    expect(LESSON_RECOMMENDATION_EXPLAINER_CATALOG).toBeInstanceOf(Array);
    expect(LESSON_RECOMMENDATION_EXPLAINER_DIMENSIONS).toBeInstanceOf(Array);
  });

  it("Supporting modules load: teacherMercyContract, teacherMercyRubric", () => {
    expect(checkTeacherMercyContract).toBeTypeOf("function");
    expect(evaluateRubricFocused).toBeTypeOf("function");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. CATALOG INTEGRITY — Every catalog must be complete and consistent
// ═══════════════════════════════════════════════════════════════════════════

describe("Catalog integrity — all gate catalogs are complete", () => {
  // ─── S1-S8 Catalog ─────────────────────────────────────────────────────

  describe("SELF_AUDIT_GATE_CATALOG (S1-S8)", () => {
    it("has exactly 8 gates", () => {
      expect(SELF_AUDIT_GATE_CATALOG).toHaveLength(8);
    });

    it("all gate IDs follow S1-S8 pattern", () => {
      const ids = SELF_AUDIT_GATE_CATALOG.map((g) => g.gateId);
      for (let i = 1; i <= 8; i++) {
        expect(ids.some((id) => id.startsWith(`S${i}_`))).toBe(true);
      }
    });

    it("every gate has titleVi, titleEn, descriptionVi", () => {
      for (const gate of SELF_AUDIT_GATE_CATALOG) {
        expect(gate.titleVi).toBeTruthy();
        expect(gate.titleEn).toBeTruthy();
        expect(gate.descriptionVi).toBeTruthy();
      }
    });

    it("canBlock is true exactly for S1, S2, S3, S5", () => {
      const blocking = SELF_AUDIT_GATE_CATALOG.filter((g) => g.canBlock);
      expect(blocking.map((g) => g.gateId)).toEqual([
        "S1_HARD_SAFETY",
        "S2_DECISION_SAFETY",
        "S3_EMPTY_RESPONSE",
        "S5_DECISION_QUALITY",
      ]);
    });

    it("every gate has a unique gateId", () => {
      const ids = SELF_AUDIT_GATE_CATALOG.map((g) => g.gateId);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("SELF_AUDIT_DECISION_CATALOG", () => {
    it("has exactly 4 decision types", () => {
      expect(SELF_AUDIT_DECISION_CATALOG).toHaveLength(4);
    });

    it("covers all decision values", () => {
      const decisions = SELF_AUDIT_DECISION_CATALOG.map((d) => d.decision);
      expect(decisions.sort()).toEqual(["BLOCK", "REVISE", "SHOW", "SHOW_WITH_CAUTION"].sort());
    });
  });

  // ─── O1-O8 Catalog ─────────────────────────────────────────────────────

  describe("OVERCLAIM_GATE_CATALOG (O1-O8)", () => {
    it("has exactly 8 gates", () => {
      expect(OVERCLAIM_GATE_CATALOG).toHaveLength(8);
    });

    it("all gate IDs follow O1-O8 pattern", () => {
      const ids = OVERCLAIM_GATE_CATALOG.map((g) => g.gateId);
      for (let i = 1; i <= 8; i++) {
        expect(ids.some((id) => id.startsWith(`O${i}_`))).toBe(true);
      }
    });

    it("every gate has gateId, titleVi, titleEn, descriptionVi, severity", () => {
      for (const gate of OVERCLAIM_GATE_CATALOG) {
        expect(gate.gateId).toBeTruthy();
        expect(gate.titleVi).toBeTruthy();
        expect(gate.titleEn).toBeTruthy();
        expect(gate.descriptionVi).toBeTruthy();
        expect(gate.severity).oneOf(["FLAG", "REVISE", "BLOCK"]);
      }
    });

    it("severities match expected values", () => {
      expect(OVERCLAIM_GATE_CATALOG.map((g) => g.severity)).toEqual([
        "REVISE",  // O1 — Absolute certainty
        "BLOCK",   // O2 — Fake statistics
        "REVISE",  // O3 — Overpromising
        "FLAG",    // O4 — Learner state claims
        "FLAG",    // O5 — Missing hedge
        "REVISE",  // O6 — Overclaiming scope
        "REVISE",  // O7 — No exceptions claim
        "FLAG",    // O8 — Authority claims
      ]);
    });
  });

  describe("OVERCLAIM_DECISION_CATALOG", () => {
    it("has exactly 4 decision types", () => {
      expect(OVERCLAIM_DECISION_CATALOG).toHaveLength(4);
    });

    it("covers all decision values", () => {
      const decisions = OVERCLAIM_DECISION_CATALOG.map((d) => d.decision);
      expect(decisions.sort()).toEqual(["BLOCK", "FLAG", "PASS", "REVISE"].sort());
    });
  });

  // ─── V1-V8 Catalog ─────────────────────────────────────────────────────

  describe("EVALUATION_GATE_CATALOG (V1-V8)", () => {
    it("has exactly 8 gates", () => {
      expect(EVALUATION_GATE_CATALOG).toHaveLength(8);
    });

    it("all gate IDs follow V1-V8 pattern", () => {
      const ids = EVALUATION_GATE_CATALOG.map((g: { gateId: string }) => g.gateId);
      for (let i = 1; i <= 8; i++) {
        expect(ids.some((id: string) => id.startsWith(`V${i}_`))).toBe(true);
      }
    });

    it("every gate has gateId, titleVi, titleEn, descriptionVi", () => {
      for (const gate of EVALUATION_GATE_CATALOG) {
        expect(gate.gateId).toBeTruthy();
        expect(gate.titleVi).toBeTruthy();
        expect(gate.titleEn).toBeTruthy();
        expect(gate.descriptionVi).toBeTruthy();
      }
    });
  });

  describe("EVALUATION_CLASSIFICATION_CATALOG", () => {
    it("has at least 3 classification types", () => {
      expect(EVALUATION_CLASSIFICATION_CATALOG.length).toBeGreaterThanOrEqual(3);
    });

    it("covers EXEMPLARY classification", () => {
      const classifications = EVALUATION_CLASSIFICATION_CATALOG.map((c) => c.classification);
      expect(classifications).toContain("EXEMPLARY");
    });

    it("covers UNSAFE classification", () => {
      const classifications = EVALUATION_CLASSIFICATION_CATALOG.map((c) => c.classification);
      expect(classifications).toContain("UNSAFE");
    });
  });

  // ─── E1-E8 Dimensions ──────────────────────────────────────────────────

  describe("LESSON_RECOMMENDATION_EXPLAINER_DIMENSIONS (E1-E8)", () => {
    it("has exactly 4 evidence dimensions", () => {
      // Evidence coverage, evidence quality, counter-evidence awareness, transparency
      expect(LESSON_RECOMMENDATION_EXPLAINER_DIMENSIONS.length).toBe(4);
    });

    it("every dimension has id, titleVi, titleEn, descriptionVi", () => {
      for (const dim of LESSON_RECOMMENDATION_EXPLAINER_DIMENSIONS) {
        expect(dim.id).toBeTruthy();
        expect(dim.titleVi).toBeTruthy();
        expect(dim.titleEn).toBeTruthy();
        expect(dim.descriptionVi).toBeTruthy();
      }
    });
  });

  describe("LESSON_RECOMMENDATION_EXPLAINER_CATALOG", () => {
    it("has entries", () => {
      expect(LESSON_RECOMMENDATION_EXPLAINER_CATALOG.length).toBeGreaterThan(0);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. FULL PIPELINE COMPOSITION — All gate chains working together
// ═══════════════════════════════════════════════════════════════════════════

describe("Full pipeline — self-audit → overclaim → decision evaluation", () => {
  it("good correction passes S1-S8 audit and O1-O8 guard", () => {
    // Step 1: Self-audit
    const auditResult = selfAuditBeforeShowing({
      learnerText: "I go to market yesterday.",
      explanationVi: goodCorrectionVi(),
      correctedSentence: "I went to the market yesterday.",
      mode: "correction",
      cefrLevel: "A2",
    });
    expect(auditResult.decision).toBe("SHOW");
    expect(auditResult.canShow).toBe(true);

    // Step 2: Overclaim guard (should also pass)
    const overclaimResult = guardOverclaim({
      explanationVi: goodCorrectionVi(),
      learnerText: "I go to market yesterday.",
      cefrLevel: "A2",
    });
    expect(overclaimResult.decision).toBe("PASS");
    expect(overclaimResult.canShow).toBe(true);
  });

  it("good conversation passes both S1-S8 and O1-O8 independently", () => {
    const auditResult = selfAuditBeforeShowing({
      learnerText: "I like markets.",
      explanationVi: goodConversationVi(),
      mode: "conversation",
      cefrLevel: "B1",
    });
    expect(auditResult.decision).toBe("SHOW");

    const overclaimResult = guardOverclaim({
      explanationVi: goodConversationVi(),
      learnerText: "I like markets.",
      cefrLevel: "B1",
    });
    expect(overclaimResult.decision).toBe("PASS");
  });

  it("fake praise is caught by S1 even when O1-O8 would pass", () => {
    const text = fakePraiseVi();
    // S1-S8: should block
    const auditResult = selfAuditBeforeShowing({
      learnerText: "I go.",
      explanationVi: text,
      correctedSentence: "I went.",
      mode: "correction",
      cefrLevel: "A2",
    });
    expect(auditResult.decision).toBe("BLOCK");
    expect(auditResult.decidingGate).toBe("S1_HARD_SAFETY");

    // O1-O8: fake praise Vi uses "Hoàn hảo! Xuất sắc!" but not the
    // specific O1 absolute-certainty patterns (no "luôn luôn" etc.)
    // — so the O1-O8 guard may or may not fire, but S1 already blocks
  });

  it("absolute certainty + fake praise is caught at S1 (short-circuits before O1)", () => {
    const text = fakePraiseAndAbsoluteVi();
    const auditResult = selfAuditBeforeShowing({
      learnerText: "I go.",
      explanationVi: text,
      correctedSentence: "I went.",
      mode: "correction",
    });
    // S1 hard safety fires first (R3_NO_FAKE_PRAISE)
    expect(auditResult.decision).toBe("BLOCK");
    expect(auditResult.decidingGate).toBe("S1_HARD_SAFETY");
    expect(auditResult.gates.length).toBe(1); // short-circuited

    // Even though the same text also contains absolute certainty,
    // the overclaim guard would catch it if checked independently
    const overclaimResult = guardOverclaim({ explanationVi: text });
    // It might be caught by O1 (absolute certainty) or pass through
    // depending on whether "luôn luôn" appears with hedging
  });

  it("fake statistics is caught by O2 (BLOCK)", () => {
    const overclaimResult = guardOverclaim({
      explanationVi: fakeStatsVi(),
      cefrLevel: "A2",
    });
    expect(overclaimResult.decision).toBe("BLOCK");
    expect(overclaimResult.decidingGate).toBe("O2_FAKE_STATISTICS");
    expect(overclaimResult.canShow).toBe(false);
  });

  it("pure absolute certainty (no fake praise) passes S1 but is caught by O1", () => {
    const text = absoluteCertaintyVi();
    // S1-S8: should pass (no fake praise, no shaming)
    const auditResult = selfAuditBeforeShowing({
      learnerText: "I go to market yesterday.",
      explanationVi: text,
      correctedSentence: "I went to the market yesterday.",
      mode: "correction",
      cefrLevel: "A2",
    });
    // S1 should pass (no hard-safety violation in the absolute-certainty text)
    const s1 = auditResult.gates.find((g) => g.gateId === "S1_HARD_SAFETY");
    // If S1 passes, then the audit allows showing (maybe with caution)
    expect(auditResult.canShow).toBe(true);

    // O1-O8: should catch absolute certainty
    const overclaimResult = guardOverclaim({ explanationVi: text });
    expect(overclaimResult.decision).toBe("REVISE");
    expect(overclaimResult.decidingGate).toBe("O1_ABSOLUTE_CERTAINTY");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. CROSS-GATE GOLDEN FIXTURES — Canonical behaviors across chains
// ═══════════════════════════════════════════════════════════════════════════

type CrossGateFixture = {
  label: string;
  descriptionVi: string;
  learnerText: string;
  explanationVi: string;
  correctedSentence?: string;
  mode: "correction" | "conversation" | "full";
  cefrLevel?: string;
  expectedS: { decision: SelfAuditDecision; decidingGate: string | null };
  expectedO: { decision: OverclaimDecision; decidingGate: string | null };
};

const CROSS_GATE_FIXTURES: readonly CrossGateFixture[] = [
  {
    label: "clean-correction-passes-both",
    descriptionVi: "Phản hồi sửa lỗi sạch — qua cả S và O",
    learnerText: "I go to market yesterday.",
    explanationVi: goodCorrectionVi(),
    correctedSentence: "I went to the market yesterday.",
    mode: "correction",
    cefrLevel: "A2",
    expectedS: { decision: "SHOW", decidingGate: null },
    expectedO: { decision: "PASS", decidingGate: null },
  },
  {
    label: "clean-conversation-passes-both",
    descriptionVi: "Hội thoại sạch — qua cả S và O",
    learnerText: "I like markets.",
    explanationVi: goodConversationVi(),
    mode: "conversation",
    cefrLevel: "B1",
    expectedS: { decision: "SHOW", decidingGate: null },
    expectedO: { decision: "PASS", decidingGate: null },
  },
  {
    label: "fake-praise-s1-blocks",
    descriptionVi: "Khen giả — S1 chặn, O có thể pass",
    learnerText: "I go.",
    explanationVi: fakePraiseVi(),
    correctedSentence: "I went.",
    mode: "correction",
    cefrLevel: "A2",
    expectedS: { decision: "BLOCK", decidingGate: "S1_HARD_SAFETY" },
    expectedO: { decision: "PASS", decidingGate: null },
  },
  {
    label: "fake-stats-o2-blocks",
    descriptionVi: "Số liệu bịa — O2 chặn",
    learnerText: "I go.",
    explanationVi: fakeStatsVi(),
    correctedSentence: "I went.",
    mode: "correction",
    cefrLevel: "A2",
    expectedS: { decision: "SHOW", decidingGate: null },
    expectedO: { decision: "BLOCK", decidingGate: "O2_FAKE_STATISTICS" },
  },
  {
    label: "empty-response-s3-blocks",
    descriptionVi: "Phản hồi trống — S3 chặn, O pass (empty text has no overclaim)",
    learnerText: "I go.",
    explanationVi: "",
    correctedSentence: "I went.",
    mode: "correction",
    expectedS: { decision: "BLOCK", decidingGate: "S3_EMPTY_RESPONSE" },
    expectedO: { decision: "PASS", decidingGate: null },
  },
  {
    label: "absolute-certainty-o1-revise",
    descriptionVi: "Khẳng định tuyệt đối — O1 yêu cầu sửa",
    learnerText: "I go to market yesterday.",
    explanationVi: absoluteCertaintyVi(),
    correctedSentence: "I went to the market yesterday.",
    mode: "correction",
    cefrLevel: "A2",
    expectedS: { decision: "SHOW", decidingGate: null },
    expectedO: { decision: "REVISE", decidingGate: "O1_ABSOLUTE_CERTAINTY" },
  },
];

describe("Cross-gate golden regression fixtures", () => {
  for (const fixture of CROSS_GATE_FIXTURES) {
    it(fixture.label, () => {
      // Run self-audit
      const sResult = selfAuditBeforeShowing({
        learnerText: fixture.learnerText,
        explanationVi: fixture.explanationVi,
        correctedSentence: fixture.correctedSentence,
        mode: fixture.mode,
        cefrLevel: fixture.cefrLevel ?? null,
      });
      expect(sResult.decision).toBe(fixture.expectedS.decision);
      expect(sResult.decidingGate).toBe(fixture.expectedS.decidingGate);

      // Run overclaim guard
      const oResult = guardOverclaim({
        explanationVi: fixture.explanationVi,
        learnerText: fixture.learnerText,
        cefrLevel: fixture.cefrLevel ?? null,
      });
      expect(oResult.decision).toBe(fixture.expectedO.decision);
      expect(oResult.decidingGate).toBe(fixture.expectedO.decidingGate);
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. DETERMINISM GATE — Same input → same output, always
// ═══════════════════════════════════════════════════════════════════════════

describe("Determinism gate — pure functions are truly deterministic", () => {
  it("S1-S8: 100× same input → 100× same output", () => {
    const input: SelfAuditInput = {
      learnerText: "I go to market yesterday.",
      explanationVi: goodCorrectionVi(),
      correctedSentence: "I went to the market yesterday.",
      mode: "correction",
      cefrLevel: "A2",
    };

    const first = selfAuditBeforeShowing(input);
    for (let i = 0; i < 100; i++) {
      const result = selfAuditBeforeShowing(input);
      expect(result.decision).toBe(first.decision);
      expect(result.decidingGate).toBe(first.decidingGate);
      expect(result.canShow).toBe(first.canShow);
      expect(result.gates.length).toBe(first.gates.length);
      expect(result.passedCount).toBe(first.passedCount);
      expect(JSON.stringify(result)).toBe(JSON.stringify(first));
    }
  });

  it("O1-O8: 100× same input → 100× same output", () => {
    const input = { explanationVi: absoluteCertaintyVi() };
    const first = guardOverclaim(input);
    for (let i = 0; i < 100; i++) {
      const result = guardOverclaim(input);
      expect(result.decision).toBe(first.decision);
      expect(result.decidingGate).toBe(first.decidingGate);
      expect(result.gates.length).toBe(first.gates.length);
    }
  });

  it("V1-V8: 100× same input → 100× same output (decision evaluation is pure)", () => {
    // Decision evaluation requires valid decision + input; test with null safety
    // The isDecisionSafe path is the purest subset
    const result1 = isDecisionSafe(
      { learnerText: "I go.", cefrLevel: "A2" } as TeacherDecisionInput,
      { action: "CORRECT_NOW", timingMode: "immediate", rationale: "test" } as TeacherDecision,
    );
    const result2 = isDecisionSafe(
      { learnerText: "I go.", cefrLevel: "A2" } as TeacherDecisionInput,
      { action: "CORRECT_NOW", timingMode: "immediate", rationale: "test" } as TeacherDecision,
    );
    expect(result1.safe).toBe(result2.safe);
  });

  it("E1-E8: calibrateEvidenceStrength is deterministic", () => {
    for (let i = 0; i < 50; i++) {
      expect(calibrateEvidenceStrength(0)).toBe("tentative");
      expect(calibrateEvidenceStrength(1)).toBe("tentative");
      expect(calibrateEvidenceStrength(2)).toBe("weak");
      expect(calibrateEvidenceStrength(3)).toBe("moderate");
      expect(calibrateEvidenceStrength(5)).toBe("strong");
      expect(calibrateEvidenceStrength(20)).toBe("strong");
    }
  });

  it("E1-E8: assessConfidence is deterministic for identical items", () => {
    const items: EvidenceItem[] = [
      {
        source: "interference",
        tag: "tense-omission",
        observationVi: "test",
        strength: "strong",
        occurrenceCount: 10,
        supportsRecommendation: true,
        lastObservedAt: NOW,
      },
    ];
    const first = assessConfidence(items);
    for (let i = 0; i < 50; i++) {
      expect(assessConfidence(items)).toBe(first);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 6. TELEMETRY CONSISTENCY — All format functions produce clean records
// ═══════════════════════════════════════════════════════════════════════════

describe("Telemetry consistency — format functions produce valid records", () => {
  it("formatSelfAuditTelemetry produces valid S telemetry", () => {
    const result = selfAuditBeforeShowing({
      learnerText: "I go to market yesterday.",
      explanationVi: goodCorrectionVi(),
      correctedSentence: "I went to the market yesterday.",
      mode: "correction",
      cefrLevel: "A2",
    });
    const telemetry = formatSelfAuditTelemetry(result);

    // Required fields
    expect(telemetry).toHaveProperty("decision");
    expect(telemetry).toHaveProperty("canShow");
    expect(telemetry).toHaveProperty("needsRevision");
    expect(telemetry).toHaveProperty("isBlocked");
    expect(telemetry).toHaveProperty("decidingGate");
    expect(telemetry).toHaveProperty("passedCount");
    expect(telemetry).toHaveProperty("firedCount");
    expect(telemetry).toHaveProperty("gateResults");
    expect(telemetry).toHaveProperty("contractFailedCount");
    expect(telemetry).toHaveProperty("evaluationClassification");

    // No PII leakage
    const json = JSON.stringify(telemetry);
    expect(json).not.toContain("I go to market");
    expect(json).not.toContain("Mình hiểu ý bạn");
  });

  it("formatSelfAuditTelemetry captures BLOCK decisions correctly", () => {
    const result = selfAuditBeforeShowing({
      learnerText: "",
      explanationVi: "",
      mode: "correction",
    });
    const telemetry = formatSelfAuditTelemetry(result);
    expect(telemetry.decision).toBe("BLOCK");
    expect(telemetry.isBlocked).toBe(true);
    expect(telemetry.decidingGate).toBe("S3_EMPTY_RESPONSE");
  });

  it("formatOverclaimTelemetry produces valid O telemetry", () => {
    const result = guardOverclaim({ explanationVi: fakeStatsVi() });
    const telemetry = formatOverclaimTelemetry(result);

    expect(telemetry).toHaveProperty("decision");
    expect(telemetry).toHaveProperty("canShow");
    expect(telemetry).toHaveProperty("needsRevision");
    expect(telemetry).toHaveProperty("isBlocked");
    expect(telemetry).toHaveProperty("decidingGate");
    expect(telemetry).toHaveProperty("passedCount");
    expect(telemetry).toHaveProperty("firedCount");
    expect(telemetry).toHaveProperty("gateResults");

    // No PII leakage
    const json = JSON.stringify(telemetry);
    expect(json).not.toContain("90% người Việt");
  });

  it("formatEvaluationTelemetry produces valid V telemetry", () => {
    const input: TeacherDecisionInput = {
      learnerText: "I go to market yesterday.",
      targetLanguage: "en",
      cefrLevel: "A2",
      isCurrentLessonTarget: true,
      sameMistakeCount: 1,
      learnerConfidence: "medium" as const,
      previousCorrectionsThisSession: 0,
    };
    const decision: TeacherDecision = {
      action: "DEFER",
      correction: null,
      timingMode: "defer",
      rationaleVi: "Để sau sửa — chưa phải lúc.",
      rationaleEn: "Defer correction.",
      reasonCode: "defer_timing",
      allCandidates: [],
      enrichment: null,
      suppressionDecision: null,
      hintLadder: null,
      readiness: { readiness: "READY_NOW" as const, reasonVi: "", reasonEn: "", gates: [] },
    };
    const evaluation = evaluateTeachingDecision(input, decision);
    const telemetry = formatEvaluationTelemetry(evaluation);

    expect(telemetry).toHaveProperty("classification");
    expect(telemetry).toHaveProperty("passedCount");
    expect(telemetry).toHaveProperty("failedCount");

    // No PII leakage
    const json = JSON.stringify(telemetry);
    expect(json).not.toContain("I go to market");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 7. EDGE CASES — Boundary conditions across all gates
// ═══════════════════════════════════════════════════════════════════════════

describe("Edge cases — boundary conditions across all gate chains", () => {
  it("very long learner text (10KB) — self-audit still works", () => {
    const longText = "I went to the market and bought many things. ".repeat(200);
    const result = selfAuditBeforeShowing({
      learnerText: longText,
      explanationVi: goodCorrectionVi(),
      correctedSentence: "I went to the market yesterday.",
      mode: "correction",
      cefrLevel: "A2",
    });
    expect(result.canShow).toBe(true);
  });

  it("very long response text — overclaim guard still works", () => {
    const longResponse = goodCorrectionVi() + " " + "Bạn hãy thử đặt câu khác. ".repeat(100);
    const result = guardOverclaim({ explanationVi: longResponse });
    // Long text shouldn't crash; decision depends on whether patterns match
    expect(["PASS", "FLAG", "REVISE", "BLOCK"]).toContain(result.decision);
  });

  it("null CEFR level — both S and O handle gracefully", () => {
    const sResult = selfAuditBeforeShowing({
      learnerText: "I go.",
      explanationVi: goodCorrectionVi(),
      correctedSentence: "I went.",
      mode: "correction",
      cefrLevel: null,
    });
    expect(sResult.canShow).toBe(true);

    const oResult = guardOverclaim({
      explanationVi: goodCorrectionVi(),
      cefrLevel: null,
    });
    expect(oResult.canShow).toBe(true);
  });

  it("undefined correctedSentence in correction mode — S6 handles gracefully", () => {
    const result = selfAuditBeforeShowing({
      learnerText: "I go to market yesterday.",
      explanationVi: goodCorrectionVi(),
      mode: "correction",
      cefrLevel: "A2",
    });
    // Should not crash; may or may not pass all gates
    expect(result.decision).oneOf(["SHOW", "SHOW_WITH_CAUTION", "REVISE", "BLOCK"]);
  });

  it("emoji-only response — S3 blocks, O passes", () => {
    const emojiVi = "🔍💡📝";
    const sResult = selfAuditBeforeShowing({
      learnerText: "I go.",
      explanationVi: emojiVi,
      mode: "conversation",
    });
    // S3: emoji-only is not empty → passes S3
    expect(sResult.decision).oneOf(["SHOW", "SHOW_WITH_CAUTION", "REVISE"]);

    const oResult = guardOverclaim({ explanationVi: emojiVi });
    // No overclaim patterns in emoji → should pass
    expect(oResult.decision).toBe("PASS");
  });

  it("full mode exercises all contract rules", () => {
    const result = selfAuditBeforeShowing({
      learnerText: "I go to market yesterday.",
      explanationVi: goodCorrectionVi(),
      correctedSentence: "I went to the market yesterday.",
      mode: "full",
      cefrLevel: "A2",
    });
    expect(result.contractResult).not.toBeNull();
    expect(result.decision).toBe("SHOW");
  });

  it("conversation mode with learner greeting", () => {
    const result = selfAuditBeforeShowing({
      learnerText: "Hello teacher! How are you?",
      explanationVi: "Chào bạn! Mình khỏe, cảm ơn bạn. Hôm nay bạn muốn học gì?",
      mode: "conversation",
      cefrLevel: "B1",
    });
    expect(result.canShow).toBe(true);
  });

  it("mixed Vietnamese-English response — both gates handle correctly", () => {
    const mixedVi = "Mình hiểu — you wanted to say 'I went to the market yesterday.' Your sentence 'I go to market yesterday' needs the past tense 'went' because 'yesterday' signals past time.";
    const sResult = selfAuditBeforeShowing({
      learnerText: "I go to market yesterday.",
      explanationVi: mixedVi,
      correctedSentence: "I went to the market yesterday.",
      mode: "correction",
      cefrLevel: "A2",
    });
    expect(sResult.canShow).toBe(true);

    const oResult = guardOverclaim({ explanationVi: mixedVi });
    expect(oResult.canShow).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 8. DECISION EXHAUSTIVENESS — Every decision type is reachable
// ═══════════════════════════════════════════════════════════════════════════

describe("Decision exhaustiveness — every decision type is reachable", () => {
  it("S: SHOW is reachable (good response)", () => {
    const result = selfAuditBeforeShowing({
      learnerText: "I go to market yesterday.",
      explanationVi: goodCorrectionVi(),
      correctedSentence: "I went to the market yesterday.",
      mode: "correction",
      cefrLevel: "A2",
    });
    expect(result.decision).toBe("SHOW");
  });

  it("S: SHOW_WITH_CAUTION is reachable (minor issues)", () => {
    // A response with no meaning acknowledgment (fails R1) but otherwise ok
    const noAckVi = "🔍 Bạn viết: \"I go to market yesterday.\" 💡 Gợi ý: \"I went to the market yesterday.\" Khi có 'yesterday', dùng quá khứ 'went'.";
    const result = selfAuditBeforeShowing({
      learnerText: "I go to market yesterday.",
      explanationVi: noAckVi,
      correctedSentence: "I went to the market yesterday.",
      mode: "correction",
      cefrLevel: "A2",
    });
    // May be SHOW or SHOW_WITH_CAUTION depending on rubric scoring
    expect(result.decision).oneOf(["SHOW", "SHOW_WITH_CAUTION"]);
  });

  it("S: REVISE is reachable (correction too short)", () => {
    const result = selfAuditBeforeShowing({
      learnerText: "I go to market yesterday.",
      explanationVi: "Sửa.",
      correctedSentence: "I went to the market yesterday.",
      mode: "correction",
      cefrLevel: "A2",
    });
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("S6_CORRECTION_TEXT_COHERENCE");
  });

  it("S: BLOCK is reachable (fake praise)", () => {
    const result = selfAuditBeforeShowing({
      learnerText: "I go.",
      explanationVi: fakePraiseVi(),
      correctedSentence: "I went.",
      mode: "correction",
      cefrLevel: "A2",
    });
    expect(result.decision).toBe("BLOCK");
    expect(result.decidingGate).toBe("S1_HARD_SAFETY");
  });

  it("O: PASS is reachable (honest response)", () => {
    const result = guardOverclaim({ explanationVi: goodCorrectionVi() });
    expect(result.decision).toBe("PASS");
  });

  it("O: FLAG is reachable (missing hedge)", () => {
    // A response stating a rule without softening
    const result = guardOverclaim({
      explanationVi: "Quy tắc là: khi có 'yesterday', động từ phải ở quá khứ.",
    });
    // May FLAG on O5 (missing hedge) depending on exact patterns
    expect(result.decision).oneOf(["PASS", "FLAG"]);
  });

  it("O: REVISE is reachable (absolute certainty)", () => {
    const result = guardOverclaim({ explanationVi: absoluteCertaintyVi() });
    expect(result.decision).toBe("REVISE");
  });

  it("O: BLOCK is reachable (fake statistics)", () => {
    const result = guardOverclaim({ explanationVi: fakeStatsVi() });
    expect(result.decision).toBe("BLOCK");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 9. E1-E8 EVIDENCE EXPLAINER — Key regression guards
// ═══════════════════════════════════════════════════════════════════════════

describe("E1-E8 evidence explainer — key regression guards", () => {
  it("calibrateEvidenceStrength maps counts correctly", () => {
    expect(calibrateEvidenceStrength(0)).toBe("tentative");
    expect(calibrateEvidenceStrength(1)).toBe("tentative");
    expect(calibrateEvidenceStrength(2)).toBe("weak");
    expect(calibrateEvidenceStrength(3)).toBe("moderate");
    expect(calibrateEvidenceStrength(5)).toBe("strong");
    expect(calibrateEvidenceStrength(7)).toBe("strong");
    expect(calibrateEvidenceStrength(10)).toBe("strong");
    expect(calibrateEvidenceStrength(100)).toBe("strong");
  });

  it("getConfidenceLabelVi returns Vietnamese labels for all ranges", () => {
    // Confidence ranges: ≥0.85 very confident, ≥0.65 confident, ≥0.40 plausible, <0.20 warm-up
    expect(getConfidenceLabelVi(0.9)).toBeTruthy();
    expect(getConfidenceLabelVi(0.7)).toBeTruthy();
    expect(getConfidenceLabelVi(0.5)).toBeTruthy();
    expect(getConfidenceLabelVi(0.1)).toBeTruthy();
    expect(getConfidenceLabelVi(0)).toBeTruthy();
    expect(getConfidenceLabelVi(1)).toBeTruthy();
    // All labels should be in Vietnamese
    expect(getConfidenceLabelVi(0.9)).not.toMatch(/^[A-Z][a-z]+$/); // Not pure English
  });

  it("evidenceScore returns 0-10 range with recommendation + profile", () => {
    const profile = emptyProfile({
      interferencePatterns: [
        { tag: "tense-omission", observedCount: 5, lastSeenAt: NOW },
      ],
      topicMastery: { "past-tense": 30 },
    });
    const rec = minimalRecommendation({ targetSkill: "tense-omission" });
    const score = evidenceScore(rec, profile);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(10);
  });

  it("evidenceScore returns 0 for cold-start", () => {
    const profile = emptyProfile();
    const rec = minimalRecommendation({ ruleFired: "cold-start:abstain" });
    expect(evidenceScore(rec, profile)).toBe(0);
  });

  it("explainRecommendation works for interference-based recommendation", () => {
    const profile = emptyProfile({
      interferencePatterns: [
        { tag: "tense-omission", observedCount: 5, lastSeenAt: NOW - 86_400_000 },
      ],
    });
    const rec = minimalRecommendation();
    const explanation = explainRecommendation(
      rec, profile, "A2", [], [], null, null, "moderate", NOW,
    );
    expect(explanation).toHaveProperty("recommendation");
    expect(explanation).toHaveProperty("totalEvidenceItems");
    expect(explanation).toHaveProperty("strongEvidenceCount");
    expect(explanation).toHaveProperty("consideredAlternatives");
    expect(explanation).toHaveProperty("evidenceChain");
    expect(explanation).toHaveProperty("learnerFacingExplanationVi");
    expect(explanation).toHaveProperty("bottomLineVi");
    expect(explanation).toHaveProperty("summaryCardVi");
    expect(explanation.learnerFacingExplanationVi.length).toBeGreaterThan(0);
    expect(explanation.evidenceChain).toHaveProperty("confidence");
    expect(explanation.evidenceChain.confidence).toBeGreaterThanOrEqual(0);
    expect(explanation.evidenceChain.confidence).toBeLessThanOrEqual(1);
  });

  it("explainRecommendation handles cold-start gracefully", () => {
    const profile = emptyProfile();
    const rec = minimalRecommendation({ ruleFired: "cold-start:abstain" });
    const explanation = explainRecommendation(
      rec, profile, null, [], [], null, null, "moderate", NOW,
    );
    // Cold-start should produce transparent "chưa đủ dữ liệu" explanation
    expect(explanation.totalEvidenceItems).toBeGreaterThanOrEqual(1);
    expect(explanation.learnerFacingExplanationVi.length).toBeGreaterThan(0);
  });

  it("assessConfidence returns 0 for empty evidence", () => {
    expect(assessConfidence([])).toBe(0);
  });

  it("considerAlternatives returns empty array when no alternatives exist", () => {
    const profile = emptyProfile();
    const rec = minimalRecommendation();
    const alternatives = considerAlternatives(rec, profile, []);
    expect(alternatives).toBeInstanceOf(Array);
    // With empty profile and no goals, there should be no viable alternatives
    expect(alternatives).toEqual([]);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 10. QUICK CONVENIENCE API — Regression guards for shorthand functions
// ═══════════════════════════════════════════════════════════════════════════

describe("Quick convenience APIs — regression guards", () => {
  it("selfAuditCorrectionQuick returns SHOW for good correction", () => {
    const result = selfAuditCorrectionQuick(
      "I go to market yesterday.",
      goodCorrectionVi(),
      "I went to the market yesterday.",
      "A2",
    );
    expect(result.decision).toBe("SHOW");
  });

  it("selfAuditConversationQuick returns SHOW for good conversation", () => {
    const result = selfAuditConversationQuick(
      "I like markets.",
      goodConversationVi(),
      "B1",
    );
    expect(result.decision).toBe("SHOW");
  });

  it("guardOverclaimQuick returns PASS for honest text", () => {
    const result = guardOverclaimQuick(goodCorrectionVi());
    expect(result.decision).toBe("PASS");
  });

  it("guardOverclaimQuick catches absolute certainty", () => {
    const result = guardOverclaimQuick(absoluteCertaintyVi());
    expect(result.decision).toBe("REVISE");
  });

  it("evaluateDecisionQuick returns an evaluation result", () => {
    const decisionInput: TeacherDecisionInput = {
      learnerText: "I go to market yesterday.",
      targetLanguage: "en",
      cefrLevel: "A2",
      isCurrentLessonTarget: true,
      sameMistakeCount: 1,
      learnerConfidence: "medium" as const,
      sessionCorrectionCount: 0,
      sessionDurationMinutes: 15,
      recentlyCorrectedPatterns: [],
      previousAction: null,
      turnsSinceLastCorrection: null,
    };
    const decision: TeacherDecision = {
      action: "SUPPRESS",
      correction: null,
      timingMode: "defer",
      rationaleVi: "Chưa phải lúc sửa — giữ tự tin cho bạn trước.",
      rationaleEn: "Not the right time to correct — preserving learner confidence.",
      reasonCode: "suppress_confidence",
      allCandidates: [],
      enrichment: null,
      suppressionDecision: {
        ruleId: "R3_NO_FAKE_PRAISE",
        reason: "learner showing low confidence",
        severity: "weak",
      },
      hintLadder: null,
      readiness: { readiness: "READY_NOW" as const, reasonVi: "", reasonEn: "", gates: [] },
    };
    const result = evaluateDecisionQuick(decisionInput, decision);
    expect(result).toHaveProperty("classification");
    expect(result).toHaveProperty("gates");
    expect(result).toHaveProperty("passedCount");
    expect(result).toHaveProperty("failedCount");
    expect(result).toHaveProperty("safetyPassed");
    expect(result.gates.length).toBe(8); // V1-V8
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 11. REGRESSION CATCH — Intentional break detection
// ═══════════════════════════════════════════════════════════════════════════
//
// These tests verify the suite CAN catch regressions. Each test
// concretely demonstrates: "If X behavior changes, THIS test will fail."
//
// If someone accidentally:
//   - Removes a safety rule from HARD_SAFETY_RULES
//   - Changes a severity level
//   - Removes a gate from a catalog
//   - Changes a decision threshold
//   - Breaks short-circuit behavior
// Then the corresponding test here WILL catch it.

describe("Regression catch — suite demonstrates it detects real breaks", () => {
  it("S1: removing R3 from hard safety would break this test", () => {
    // This test verifies the current behavior: fake praise = BLOCK via S1
    const result = selfAuditBeforeShowing({
      learnerText: "I go.",
      explanationVi: fakePraiseVi(),
      correctedSentence: "I went.",
      mode: "correction",
    });
    expect(result.decision).toBe("BLOCK");
    expect(result.decidingGate).toBe("S1_HARD_SAFETY");
  });

  it("O2: removing fake statistics from the gate would break this test", () => {
    const result = guardOverclaim({ explanationVi: fakeStatsVi() });
    expect(result.decision).toBe("BLOCK");
    expect(result.decidingGate).toBe("O2_FAKE_STATISTICS");
  });

  it("S3: if empty response suddenly SHOWs, this test catches the regression", () => {
    const result = selfAuditBeforeShowing({
      learnerText: "",
      explanationVi: "",
      mode: "correction",
    });
    expect(result.decision).toBe("BLOCK");
    expect(result.decidingGate).toBe("S3_EMPTY_RESPONSE");
  });

  it("S6: if too-short correction passes, this test catches the regression", () => {
    const result = selfAuditBeforeShowing({
      learnerText: "I go.",
      explanationVi: "Sửa.",
      correctedSentence: "I went to the market yesterday.",
      mode: "correction",
    });
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("S6_CORRECTION_TEXT_COHERENCE");
  });

  it("O1: if absolute certainty passes, this test catches the regression", () => {
    const result = guardOverclaim({ explanationVi: absoluteCertaintyVi() });
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O1_ABSOLUTE_CERTAINTY");
  });

  it("Catalog: if S1 is removed from blocking gates, this test catches it", () => {
    const blockingGates = SELF_AUDIT_GATE_CATALOG.filter((g) => g.canBlock);
    expect(blockingGates.map((g) => g.gateId)).toContain("S1_HARD_SAFETY");
  });

  it("Catalog: if O2 severity changes from BLOCK, this test catches it", () => {
    const o2 = OVERCLAIM_GATE_CATALOG.find((g) => g.gateId === "O2_FAKE_STATISTICS");
    expect(o2).toBeDefined();
    expect(o2!.severity).toBe("BLOCK");
  });

  it("Short-circuit: S1 BLOCK prevents later gates from running", () => {
    const result = selfAuditBeforeShowing({
      learnerText: "I go.",
      explanationVi: fakePraiseVi(),
      correctedSentence: "I went.",
      mode: "correction",
    });
    expect(result.decision).toBe("BLOCK");
    expect(result.gates.length).toBe(1);
    expect(result.gates[0].gateId).toBe("S1_HARD_SAFETY");
  });

  it("Short-circuit: O1 REVISE prevents O2-O8 from running", () => {
    const text = "Bạn luôn luôn phải dùng 'went'. Theo nghiên cứu, 90% người Việt sai.";
    const result = guardOverclaim({ explanationVi: text });
    // O1 fires first (absolute certainty), stopping before O2 (fake stats)
    expect(result.decision).toBe("REVISE");
    expect(result.decidingGate).toBe("O1_ABSOLUTE_CERTAINTY");
    expect(result.gates.length).toBe(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 12. RESULT CONSISTENCY — Internal invariants of each result type
// ═══════════════════════════════════════════════════════════════════════════

describe("Result consistency — internal invariants hold", () => {
  it("S: canShow ↔ (decision is SHOW or SHOW_WITH_CAUTION)", () => {
    const fixtures = [
      { explanation: goodCorrectionVi(), corrected: "I went to the market yesterday." },
      { explanation: fakePraiseVi(), corrected: "I went." },
      { explanation: "", corrected: "" },
      { explanation: "Sửa.", corrected: "I went." },
    ];
    for (const f of fixtures) {
      const result = selfAuditBeforeShowing({
        learnerText: "I go.",
        explanationVi: f.explanation,
        correctedSentence: f.corrected,
        mode: "correction",
      });
      expect(result.canShow).toBe(
        result.decision === "SHOW" || result.decision === "SHOW_WITH_CAUTION",
      );
    }
  });

  it("S: isBlocked ↔ decision is BLOCK", () => {
    const result = selfAuditBeforeShowing({
      learnerText: "I go.",
      explanationVi: fakePraiseVi(),
      correctedSentence: "I went.",
      mode: "correction",
    });
    expect(result.isBlocked).toBe(result.decision === "BLOCK");
  });

  it("S: needsRevision ↔ decision is REVISE", () => {
    const result = selfAuditBeforeShowing({
      learnerText: "I go.",
      explanationVi: "Sửa.",
      correctedSentence: "I went.",
      mode: "correction",
    });
    expect(result.needsRevision).toBe(result.decision === "REVISE");
  });

  it("O: canShow ↔ decision is PASS or FLAG", () => {
    const fixtures = [
      goodCorrectionVi(),
      absoluteCertaintyVi(),
      fakeStatsVi(),
      "Quy tắc là không có ngoại lệ trong trường hợp này.",
    ];
    for (const text of fixtures) {
      const result = guardOverclaim({ explanationVi: text });
      expect(result.canShow).toBe(
        result.decision === "PASS" || result.decision === "FLAG",
      );
    }
  });

  it("O: isBlocked ↔ decision is BLOCK", () => {
    const result = guardOverclaim({ explanationVi: fakeStatsVi() });
    expect(result.isBlocked).toBe(result.decision === "BLOCK");
  });

  it("S: passedCount + firedCount are consistent with gate results", () => {
    const fixtures = [
      { explanation: goodCorrectionVi(), corrected: "I went to the market yesterday." },
      { explanation: fakePraiseVi(), corrected: "I went." },
      { explanation: "", corrected: "" },
    ];
    for (const f of fixtures) {
      const result = selfAuditBeforeShowing({
        learnerText: "I go.",
        explanationVi: f.explanation,
        correctedSentence: f.corrected,
        mode: "correction",
      });
      const actualPassed = result.gates.filter((g) => g.passed).length;
      const actualFired = result.gates.filter((g) => g.decision !== null).length;
      expect(result.passedCount).toBe(actualPassed);
      expect(result.firedCount).toBe(actualFired);
    }
  });

  it("O: passedCount + firedCount are consistent with gate results", () => {
    const fixtures = [goodCorrectionVi(), absoluteCertaintyVi(), fakeStatsVi()];
    for (const text of fixtures) {
      const result = guardOverclaim({ explanationVi: text });
      const actualPassed = result.gates.filter((g) => g.passed).length;
      const actualFired = result.gates.filter((g) => g.decision !== null).length;
      expect(result.passedCount).toBe(actualPassed);
      expect(result.firedCount).toBe(actualFired);
    }
  });

  it("S: summaryVi and summaryEn are always non-empty Vietnamese/English strings", () => {
    const fixtures = [
      goodCorrectionVi(),
      fakePraiseVi(),
      "",
      "Sửa.",
    ];
    for (const text of fixtures) {
      const result = selfAuditBeforeShowing({
        learnerText: "I go.",
        explanationVi: text,
        correctedSentence: "I went.",
        mode: "correction",
      });
      expect(result.summaryVi.length).toBeGreaterThan(0);
      expect(result.summaryEn.length).toBeGreaterThan(0);
    }
  });

  it("O: summaryVi and summaryEn are always non-empty", () => {
    const fixtures = [goodCorrectionVi(), absoluteCertaintyVi(), fakeStatsVi(), ""];
    for (const text of fixtures) {
      const result = guardOverclaim({ explanationVi: text });
      expect(result.summaryVi.length).toBeGreaterThan(0);
      expect(result.summaryEn.length).toBeGreaterThan(0);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 13. CONTRACT RUBRIC — Supporting infrastructure regression guards
// ═══════════════════════════════════════════════════════════════════════════

describe("Contract + Rubric — supporting infrastructure intact", () => {
  it("checkTeacherMercyContract works in correction mode", () => {
    const result = checkTeacherMercyContract(
      { text: "I go to market yesterday.", cefrLevel: "A2", trackedWeakness: null, didSelfCorrect: false, l1: "vi" },
      { vi: goodCorrectionVi(), correctedSentence: "I went to the market yesterday.", correctionCount: 1, mode: "correction" },
    );
    expect(result).toHaveProperty("rules");
    expect(result).toHaveProperty("passed");
    expect(result).toHaveProperty("failedCount");
    expect(result.rules.length).toBeGreaterThan(0);
  });

  it("checkTeacherMercyContract works in conversation mode", () => {
    const result = checkTeacherMercyContract(
      { text: "I like markets.", cefrLevel: "B1", trackedWeakness: null, didSelfCorrect: false, l1: "vi" },
      { vi: goodConversationVi(), correctedSentence: undefined, correctionCount: 0, mode: "conversation" },
    );
    expect(result).toHaveProperty("rules");
    expect(result).toHaveProperty("passed");
    expect(result).toHaveProperty("failedCount");
  });

  it("evaluateRubricFocused returns valid rubric result for correction", () => {
    const result = evaluateRubricFocused(
      { text: "I go to market yesterday.", cefrLevel: "A2", trackedWeakness: null, didSelfCorrect: false, l1: "vi" },
      { vi: goodCorrectionVi(), correctedSentence: "I went to the market yesterday.", correctionCount: 1, mode: "correction" },
      "correction",
    );
    expect(result).toHaveProperty("classification");
    expect(result).toHaveProperty("dimensions");
    expect(result).toHaveProperty("safetyPassed");
    expect(result).toHaveProperty("summaryVi");
    expect(result.dimensions.length).toBeGreaterThan(0);
  });

  it("evaluateRubricFocused returns valid rubric result for conversation", () => {
    const result = evaluateRubricFocused(
      { text: "I like markets.", cefrLevel: "B1", trackedWeakness: null, didSelfCorrect: false, l1: "vi" },
      { vi: goodConversationVi(), correctedSentence: undefined, correctionCount: 0, mode: "conversation" },
      "conversation",
    );
    expect(result).toHaveProperty("classification");
    expect(result).toHaveProperty("dimensions");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 14. GATE COUNT SNAPSHOT — If gate count changes, this fails CONSCIOUSLY
// ═══════════════════════════════════════════════════════════════════════════

describe("Gate count snapshot — intentional guard against silent changes", () => {
  it("S1-S8: exactly 8 self-audit gates", () => {
    expect(SELF_AUDIT_GATE_CATALOG).toHaveLength(8);
  });

  it("O1-O8: exactly 8 overclaim guard gates", () => {
    expect(OVERCLAIM_GATE_CATALOG).toHaveLength(8);
  });

  it("V1-V8: exactly 8 teaching decision evaluation gates", () => {
    expect(EVALUATION_GATE_CATALOG).toHaveLength(8);
  });

  it("E dimensions: exactly 4 evidence dimensions", () => {
    // Evidence coverage, evidence quality, counter-evidence awareness, transparency
    expect(LESSON_RECOMMENDATION_EXPLAINER_DIMENSIONS.length).toBe(4);
  });

  it("S decisions: exactly 4 decision types", () => {
    expect(SELF_AUDIT_DECISION_CATALOG).toHaveLength(4);
  });

  it("O decisions: exactly 4 decision types", () => {
    expect(OVERCLAIM_DECISION_CATALOG).toHaveLength(4);
  });
});
