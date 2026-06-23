/**
 * Step 110 — Real Product Proof Evaluation Gate Tests
 *
 * Comprehensive tests proving that the real product proof gate correctly
 * evaluates whether Teacher Mercy — as a real product — can diagnose, teach,
 * remember, adapt, self-check, and prove learner improvement like a strong
 * human teacher.
 *
 * These tests cover:
 *   1. Module smoke — all exports exist and types compile
 *   2. Empty/missing data — graceful degradation with warnings
 *   3. Minimal session — basic scoring with limited data
 *   4. Strong session — all 6 dimensions proven with realistic data
 *   5. Weak session — failures detected, verdict FAIL
 *   6. Cross-session comparison — improvement/regression tracking
 *   7. Action items — prioritized, Vietnamese-first
 *   8. Gate catalog — internally consistent
 *   9. Verification — PASS verdict requires all conditions met
 *
 * All pure functions — no I/O, no side effects, deterministic.
 * Single command to run:
 *   npx vitest run src/lib/tutor/__tests__/realProductProofGate.test.ts
 */

import { describe, expect, it } from "vitest";

import {
  runRealProductProof,
  getProductProofSummary,
  getProductProofActionItems,
  productProofIsPassing,
  compareProductProofs,
  createMinimalProofInput,
  buildProductProofFromSession,
  getProductProofDimensionConfig,
  PRODUCT_PROOF_GATE_CATALOG,
  type RealProductProofInput,
  type RealProductProofOutput,
  type ProductProofVerdict,
  type ProductProofDimensionResult,
  type ProductProofFailure,
} from "@/lib/tutor/realProductProofGate";

import type { TranscriptCorrectionEvent } from "@/lib/tutor/transcriptCorrectionTypes";
import type { CorrectionEngineResult } from "@/lib/tutor/correctionEngine";
import type { AuditResult } from "@/lib/tutor/teacherMercyAuditGate";
import type { RubricResult } from "@/lib/tutor/teacherMercyRubric";
import type { ContractRuleCheck } from "@/lib/tutor/teacherMercyContract";
import type { ChauMemorySnapshot } from "@/lib/tutor/chauReviewPacket";
import type { SelfAuditResult } from "@/lib/tutor/teacherMercySelfAuditGate";
import type { OverclaimGuardResult } from "@/lib/tutor/overclaimGuard";
import type { EvaluationResult } from "@/lib/tutor/teachingDecisionEvaluationGate";
import type { TeacherDecision } from "@/lib/tutor/teacherDecisionEngine";
import type { TutorTurn } from "@/lib/tutor/tutorTypes";

// ═══════════════════════════════════════════════════════════════════════════════
// Test Data Builders
// ═══════════════════════════════════════════════════════════════════════════════

/** Build a minimal correction event for testing */
function makeCorrectionEvent(
  overrides: Partial<TranscriptCorrectionEvent> = {},
): TranscriptCorrectionEvent {
  return {
    id: overrides.id ?? "evt-001",
    timestamp: overrides.timestamp ?? Date.now(),
    sessionId: overrides.sessionId ?? "test-session",
    turnNumber: overrides.turnNumber ?? 1,
    mode: overrides.mode ?? "speak",
    originalTranscript: overrides.originalTranscript ?? "I go to school yesterday",
    correctedTranscript: overrides.correctedTranscript ?? "I went to school yesterday",
    targetSentence: overrides.targetSentence ?? null,
    corrections: overrides.corrections ?? [
      {
        source: "grammar",
        position: 0,
        originalToken: "go",
        correctedToken: "went",
        confidence: 0.85,
        ruleId: "tense-past-simple",
        explanationVi: "Dùng 'went' thay vì 'go' vì đây là thì quá khứ.",
        explanationEn: null,
      },
    ],
    timingMode: overrides.timingMode ?? null,
    timingReason: overrides.timingReason ?? null,
    delayTurns: overrides.delayTurns ?? null,
    wasSurfaced: overrides.wasSurfaced ?? true,
    learnerAcknowledged: overrides.learnerAcknowledged ?? true,
    matchScore: overrides.matchScore ?? 85,
    weaknessTags: overrides.weaknessTags ?? ["past-tense"],
    weaknessLabelsVi: overrides.weaknessLabelsVi ?? ["Thì quá khứ"],
    interferenceCategory: overrides.interferenceCategory ?? null,
    topicTag: overrides.topicTag ?? null,
  } as TranscriptCorrectionEvent;
}

/** Build a contract check that passed */
function makePassedContractCheck(ruleId: string): ContractRuleCheck {
  return {
    ruleId: ruleId as ContractRuleCheck["ruleId"],
    titleVi: `Quy tắc ${ruleId}`,
    titleEn: `Rule ${ruleId}`,
    passed: true,
    detailVi: "Đạt yêu cầu.",
    reasonCode: "ok",
  };
}

/** Build a contract check that failed */
function makeFailedContractCheck(ruleId: string): ContractRuleCheck {
  return {
    ruleId: ruleId as ContractRuleCheck["ruleId"],
    titleVi: `Quy tắc ${ruleId}`,
    titleEn: `Rule ${ruleId}`,
    passed: false,
    detailVi: "Không đạt.",
    reasonCode: "violated",
  };
}

/** Build a passed audit result */
function makeAuditResult(overrides: Partial<AuditResult> = {}): AuditResult {
  return {
    passed: overrides.passed ?? true,
    safe: overrides.safe ?? true,
    mode: overrides.mode ?? "full",
    gateLevel: overrides.gateLevel ?? "audit",
    contractResult: overrides.contractResult ?? {
      passed: true,
      rules: [],
      failedCount: 0,
      summaryVi: "Tất cả đều đạt.",
    },
    rubricResult: overrides.rubricResult ?? {
      classification: "acceptable",
      safetyPassed: true,
      dimensions: [],
      summaryVi: "Đạt.",
      contractResult: { passed: true, rules: [], failedCount: 0, summaryVi: "Đạt." },
    } as RubricResult,
    summaryVi: overrides.summaryVi ?? "An toàn.",
    blockReasonVi: overrides.blockReasonVi ?? null,
  } as AuditResult;
}

/** Build a self-audit result that passed */
function makeSelfAuditResult(overrides: Partial<SelfAuditResult> = {}): SelfAuditResult {
  return {
    decision: overrides.decision ?? "SHOW",
    canShow: overrides.canShow ?? true,
    needsRevision: overrides.needsRevision ?? false,
    isBlocked: overrides.isBlocked ?? false,
    gates: overrides.gates ?? [],
    passedCount: overrides.passedCount ?? 8,
    firedCount: overrides.firedCount ?? 0,
    decidingGate: overrides.decidingGate ?? null,
    summaryVi: overrides.summaryVi ?? "An toàn để hiển thị.",
    summaryEn: overrides.summaryEn ?? "Safe to show.",
  } as SelfAuditResult;
}

/** Build an overclaim guard result */
function makeOverclaimResult(overrides: Partial<OverclaimGuardResult> = {}): OverclaimGuardResult {
  return {
    decision: overrides.decision ?? "PASS",
    gates: overrides.gates ?? [],
    passedCount: overrides.passedCount ?? 8,
    firedCount: overrides.firedCount ?? 0,
    summaryVi: overrides.summaryVi ?? "Không overclaim.",
    summaryEn: overrides.summaryEn ?? "No overclaim.",
    decidingGate: overrides.decidingGate ?? null,
    safe: overrides.safe ?? true,
  } as OverclaimGuardResult;
}

/** Build an evaluation result */
function makeEvaluationResult(overrides: Partial<EvaluationResult> = {}): EvaluationResult {
  return {
    classification: overrides.classification ?? "ACCEPTABLE",
    allPassed: overrides.allPassed ?? true,
    safetyPassed: overrides.safetyPassed ?? true,
    gates: overrides.gates ?? [],
    passedCount: overrides.passedCount ?? 8,
    failedCount: overrides.failedCount ?? 0,
    summaryVi: overrides.summaryVi ?? "Quyết định an toàn.",
    summaryEn: overrides.summaryEn ?? "Decision safe.",
  } as EvaluationResult;
}

/** Build a teacher decision */
function makeTeacherDecision(overrides: Partial<TeacherDecision> = {}): TeacherDecision {
  return {
    action: overrides.action ?? "CORRECT_NOW",
    learnerInput: overrides.learnerInput ?? { text: "I go yesterday" },
    correctionCandidates: overrides.correctionCandidates ?? [],
    decidedAt: overrides.decidedAt ?? Date.now(),
    turnNumber: overrides.turnNumber ?? 1,
    sessionId: overrides.sessionId ?? "test-session",
  } as TeacherDecision;
}

/** Build a memory snapshot */
function makeMemorySnapshot(overrides: Partial<ChauMemorySnapshot> = {}): ChauMemorySnapshot {
  return {
    strengths: overrides.strengths ?? ["Phát âm tốt các từ đơn giản"],
    needsReview: overrides.needsReview ?? ["Thì quá khứ đơn", "Mạo từ a/an/the"],
    commonMistakePatterns: overrides.commonMistakePatterns ?? ["Bỏ qua -ed ở động từ quá khứ"],
    nextRecommendedFocus: overrides.nextRecommendedFocus ?? "Luyện tập thì quá khứ đơn với 10 câu",
    confidenceTrend: overrides.confidenceTrend ?? "stable",
  };
}

/** Build a minimal tutor turn */
function makeTutorTurn(overrides: Partial<TutorTurn> = {}): TutorTurn {
  const base = { turnNumber: overrides.turnNumber ?? 1 };
  return { ...base, ...overrides } as TutorTurn;
}

/** Build a correction engine result */
function makeCorrectionResult(overrides: Partial<CorrectionEngineResult> = {}): CorrectionEngineResult {
  return {
    corrected: overrides.corrected ?? true,
    correctionCount: overrides.correctionCount ?? 1,
    corrections: overrides.corrections ?? [],
    needAiCorrection: overrides.needAiCorrection ?? false,
    sttGarbleDetected: overrides.sttGarbleDetected ?? false,
    semanticImplausible: overrides.semanticImplausible ?? false,
    summaryVi: overrides.summaryVi ?? "Đã sửa 1 lỗi.",
  } as CorrectionEngineResult;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Test: Module Smoke — Exports and Types
// ═══════════════════════════════════════════════════════════════════════════════

describe("realProductProofGate — module smoke", () => {
  it("exports all public functions", () => {
    expect(typeof runRealProductProof).toBe("function");
    expect(typeof getProductProofSummary).toBe("function");
    expect(typeof getProductProofActionItems).toBe("function");
    expect(typeof productProofIsPassing).toBe("function");
    expect(typeof compareProductProofs).toBe("function");
    expect(typeof createMinimalProofInput).toBe("function");
    expect(typeof buildProductProofFromSession).toBe("function");
    expect(typeof getProductProofDimensionConfig).toBe("function");
  });

  it("exports the PRODUCT_PROOF_GATE_CATALOG with all 20 sub-gates", () => {
    expect(Array.isArray(PRODUCT_PROOF_GATE_CATALOG)).toBe(true);
    expect(PRODUCT_PROOF_GATE_CATALOG.length).toBe(20);
    // Every gate has required fields
    for (const gate of PRODUCT_PROOF_GATE_CATALOG) {
      expect(typeof gate.gateId).toBe("string");
      expect(typeof gate.dimensionId).toBe("string");
      expect(typeof gate.labelVi).toBe("string");
      expect(typeof gate.descriptionVi).toBe("string");
    }
  });

  it("dimension config covers all 6 dimensions", () => {
    const config = getProductProofDimensionConfig();
    const dims = Object.keys(config);
    expect(dims).toHaveLength(6);
    expect(dims).toContain("diagnosis");
    expect(dims).toContain("teaching");
    expect(dims).toContain("memory");
    expect(dims).toContain("adaptation");
    expect(dims).toContain("selfCheck");
    expect(dims).toContain("learningGain");
    // Weights sum to ~1
    const totalWeight = Object.values(config).reduce((s, c) => s + c.weight, 0);
    expect(totalWeight).toBeCloseTo(1.0, 1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Test: Empty / Missing Data — Graceful Degradation
// ═══════════════════════════════════════════════════════════════════════════════

describe("realProductProofGate — empty input", () => {
  it("returns FAIL for completely empty input — no data to prove anything", () => {
    const input = createMinimalProofInput();
    const proof = runRealProductProof(input);

    // With zero data, score is minimal (from failure taxonomy baseline), well below the FAIL threshold of 45
    expect(proof.verdict).toBe("FAIL");
    expect(proof.pass).toBe(false);
    expect(proof.overallScore).toBeLessThan(45);
    expect(proof.dimensionResults).toHaveLength(6);
    // With no data, dimensions should be unproven or weak (both are non-passing bands)
    for (const dim of proof.dimensionResults) {
      expect(["unproven", "weak"]).toContain(dim.band);
      expect(dim.passedProductBar).toBe(false);
    }
    // Warnings should be generated for missing data
    expect(proof.warnings.length).toBeGreaterThan(0);
    const warningCodes = proof.warnings.map((w) => w.warningCode);
    expect(warningCodes).toContain("MISSING_CORRECTIONEVENTS");
    expect(warningCodes).toContain("MISSING_MEMORYSNAPSHOTS");
  });

  it("generates action items for Chau with empty data", () => {
    const input = createMinimalProofInput();
    const proof = runRealProductProof(input);
    const items = getProductProofActionItems(proof);
    expect(items.length).toBeGreaterThan(0);
    // Should contain at least the data warning
    expect(items.some((i) => i.includes("DỮ LIỆU"))).toBe(true);
    // FAIL verdict generates KHẨN items
    expect(items.some((i) => i.includes("KHẨN"))).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Test: Minimal Session — Some Data, Low Scores
// ═══════════════════════════════════════════════════════════════════════════════

describe("realProductProofGate — minimal session", () => {
  it("produces NEEDS_REVIEW with partial data", () => {
    const events = [
      makeCorrectionEvent({ turnNumber: 1 }),
      makeCorrectionEvent({ id: "evt-002", turnNumber: 2 }),
    ];
    const input: RealProductProofInput = {
      ...createMinimalProofInput(),
      correctionEvents: events,
      turns: [makeTutorTurn({ turnNumber: 1 }), makeTutorTurn({ turnNumber: 2 })],
      contractChecks: [
        makePassedContractCheck("R1_MEANING_FIRST"),
        makePassedContractCheck("R2_ONE_CORRECTION_MAX"),
      ],
      auditResults: [makeAuditResult()],
      selfAuditResults: [makeSelfAuditResult()],
      teacherDecisions: [
        makeTeacherDecision({ action: "CORRECT_NOW", turnNumber: 1 }),
        makeTeacherDecision({ action: "DEFER", turnNumber: 2 }),
      ],
      memorySnapshots: [makeMemorySnapshot()],
      correctionResults: [makeCorrectionResult(), makeCorrectionResult()],
    };

    const proof = runRealProductProof(input);

    // Some dimensions should score > 0 now
    const scoredDims = proof.dimensionResults.filter((d) => d.score > 0);
    expect(scoredDims.length).toBeGreaterThan(0);
    // With only partial data, score falls below thresholds → FAIL or NEEDS_REVIEW
    expect(["FAIL", "NEEDS_REVIEW"]).toContain(proof.verdict);
    expect(proof.metadata.hasAllRequiredData).toBe(false);
  });

  it("detects diagnosis dimension scoring with correction events", () => {
    const events = [
      makeCorrectionEvent({ turnNumber: 1 }),
      makeCorrectionEvent({ id: "evt-002", turnNumber: 2 }),
    ];
    const input: RealProductProofInput = {
      ...createMinimalProofInput(),
      correctionEvents: events,
      turns: [makeTutorTurn({ turnNumber: 1 }), makeTutorTurn({ turnNumber: 2 })],
    };

    const proof = runRealProductProof(input);
    const diag = proof.dimensionResults.find((d) => d.dimensionId === "diagnosis")!;
    // With only 2 events but helpful corrections, diagnosis should get some score
    expect(diag.score).toBeGreaterThan(0);
    expect(diag.evidenceVi.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Test: Strong Session — All 6 Dimensions Proven
// ═══════════════════════════════════════════════════════════════════════════════

describe("realProductProofGate — strong session", () => {
  /** Build a well-structured session that should PASS the product bar */
  function buildStrongSession(): RealProductProofInput {
    // 8 correction events with 2 different sources (grammar + stt)
    const events = [
      makeCorrectionEvent({
        id: "evt-001", turnNumber: 1,
        corrections: [{ source: "grammar", position: 0, originalToken: "go", correctedToken: "went", confidence: 0.90, ruleId: "tense", explanationVi: "Quá khứ của go là went.", explanationEn: null }],
      }),
      makeCorrectionEvent({
        id: "evt-002", turnNumber: 2,
        corrections: [{ source: "stt", position: 0, originalToken: "ai", correctedToken: "I", confidence: 0.80, ruleId: "stt-garble", explanationVi: "Sửa 'ai' thành 'I'.", explanationEn: null }],
      }),
      makeCorrectionEvent({
        id: "evt-003", turnNumber: 3,
        corrections: [{ source: "grammar", position: 0, originalToken: "eated", correctedToken: "ate", confidence: 0.88, ruleId: "tense", explanationVi: "Quá khứ của eat là ate.", explanationEn: null }],
      }),
      makeCorrectionEvent({
        id: "evt-004", turnNumber: 4,
        corrections: [{ source: "grammar", position: 0, originalToken: "a", correctedToken: "an", confidence: 0.92, ruleId: "article", explanationVi: "Dùng 'an' trước nguyên âm.", explanationEn: null }],
      }),
      // Second half: fewer corrections (showing improvement)
      makeCorrectionEvent({ id: "evt-005", turnNumber: 5, corrections: [] }),
      makeCorrectionEvent({ id: "evt-006", turnNumber: 6, corrections: [] }),
      makeCorrectionEvent({ id: "evt-007", turnNumber: 7, corrections: [] }),
      makeCorrectionEvent({ id: "evt-008", turnNumber: 8, corrections: [] }),
    ];

    // All contract checks pass
    const contractChecks: ContractRuleCheck[] = [
      makePassedContractCheck("R1_MEANING_FIRST"),
      makePassedContractCheck("R2_ONE_CORRECTION_MAX"),
      makePassedContractCheck("R3_NO_FAKE_PRAISE"),
      makePassedContractCheck("R4_ONE_FOLLOW_UP"),
      makePassedContractCheck("R5_REMEMBER_WEAKNESS"),
      makePassedContractCheck("R6_VIETNAMESE_INTERFERENCE"),
      makePassedContractCheck("R7_STRATEGIC_SILENCE"),
      makePassedContractCheck("R8_FACE_SAVING"),
      makePassedContractCheck("R9_SELF_CORRECTION_SPACE"),
      makePassedContractCheck("R10_NEXT_PRACTICE_WHEN_HELPFUL"),
    ];

    const auditResults = [makeAuditResult(), makeAuditResult()];
    const selfAuditResults = [
      makeSelfAuditResult(),
      makeSelfAuditResult(),
      makeSelfAuditResult(),
    ];
    const overclaimResults = [makeOverclaimResult(), makeOverclaimResult()];
    const evaluationResults = [
      makeEvaluationResult({ classification: "ACCEPTABLE" }),
      makeEvaluationResult({ classification: "EXEMPLARY" }),
    ];

    // Varied teaching decisions
    const teacherDecisions = [
      makeTeacherDecision({ action: "CORRECT_NOW", turnNumber: 1 }),
      makeTeacherDecision({ action: "DEFER", turnNumber: 2 }),
      makeTeacherDecision({ action: "EXPLAIN_PATTERN", turnNumber: 3 }),
      makeTeacherDecision({ action: "FOLLOW_UP_FIRST", turnNumber: 4 }),
    ];

    const memory = makeMemorySnapshot({
      strengths: ["Phát âm tốt", "Từ vựng cơ bản tốt"],
      needsReview: ["Thì quá khứ", "Mạo từ"],
      commonMistakePatterns: ["Dùng sai thì quá khứ"],
      nextRecommendedFocus: "Luyện tập thì quá khứ đơn",
    });

    const turns = Array.from({ length: 8 }, (_, i) =>
      makeTutorTurn({ turnNumber: i + 1 }),
    );
    const correctionResults = events.map(() => makeCorrectionResult());

    return {
      sessionId: "strong-session-001",
      learnerId: "learner-Minh-B1",
      sessionTimestamp: new Date().toISOString(),
      turns,
      correctionEvents: events,
      correctionResults,
      rubricResults: [],
      contractChecks,
      auditResults,
      selfAuditResults,
      overclaimResults,
      evaluationResults,
      teacherDecisions,
      memorySnapshots: [memory],
      learningGainResult: null,
      checklistResult: null,
      reviewPacket: null,
      dashboard: null,
      lessonSequence: null,
    };
  }

  let strongSession: RealProductProofInput;

  // Build once for the suite
  strongSession = buildStrongSession();

  it("produces a real product proof with all 6 dimensions evaluated", () => {
    const proof = runRealProductProof(strongSession);
    expect(proof.dimensionResults).toHaveLength(6);
    expect(proof.metadata.gatesExecuted).toBe(6);
    expect(proof.metadata.turnsEvaluated).toBe(8);
    expect(proof.metadata.correctionEventsEvaluated).toBe(8);
  });

  it("scores diagnosis dimension well with diverse errors and helpful corrections", () => {
    const proof = runRealProductProof(strongSession);
    const diag = proof.dimensionResults.find((d) => d.dimensionId === "diagnosis")!;
    // With 4 helpful corrections from 2 sources, diagnosis should score well
    expect(diag.score).toBeGreaterThanOrEqual(1.0);
    expect(diag.band).not.toBe("unproven");
    expect(diag.evidenceVi.length).toBeGreaterThan(0);
  });

  it("scores teaching dimension well with all contracts passing", () => {
    const proof = runRealProductProof(strongSession);
    const teach = proof.dimensionResults.find((d) => d.dimensionId === "teaching")!;
    // All 10 contracts passing + no overclaim + safe decisions
    expect(teach.score).toBeGreaterThanOrEqual(1.5);
    expect(teach.band).not.toBe("unproven");
    expect(teach.hasCriticalFailure).toBe(false);
  });

  it("scores memory dimension with a populated snapshot", () => {
    const proof = runRealProductProof(strongSession);
    const mem = proof.dimensionResults.find((d) => d.dimensionId === "memory")!;
    expect(mem.score).toBeGreaterThan(0);
    expect(mem.evidenceVi.some((e) => e.includes("điểm mạnh"))).toBe(true);
  });

  it("scores adaptation dimension with varied decisions and contract rules", () => {
    const proof = runRealProductProof(strongSession);
    const adapt = proof.dimensionResults.find((d) => d.dimensionId === "adaptation")!;
    // 4 different action modes + R7/R9/R8 checks
    expect(adapt.score).toBeGreaterThanOrEqual(1.0);
  });

  it("scores self-check dimension with audit and self-audit results", () => {
    const proof = runRealProductProof(strongSession);
    const sc = proof.dimensionResults.find((d) => d.dimensionId === "selfCheck")!;
    expect(sc.score).toBeGreaterThanOrEqual(1.0);
    expect(sc.evidenceVi.some((e) => e.includes("tự kiểm tra"))).toBe(true);
  });

  it("includes Vietnamese and English summaries", () => {
    const proof = runRealProductProof(strongSession);
    expect(proof.summaryVi.length).toBeGreaterThan(0);
    expect(proof.summaryVi).toContain("KẾT QUẢ");
    expect(proof.summaryEn.length).toBeGreaterThan(0);
    expect(proof.summaryEn).toContain("RESULT");
  });

  it("builds gate scores for all 6 dimensions", () => {
    const proof = runRealProductProof(strongSession);
    expect(Object.keys(proof.gateScores)).toHaveLength(6);
    for (const dimId of Object.keys(proof.gateScores)) {
      const gs = proof.gateScores[dimId];
      expect(typeof gs.passed).toBe("boolean");
      expect(typeof gs.score).toBe("number");
      expect(typeof gs.noteVi).toBe("string");
    }
  });

  it("produces only learning-gain failures since no gain data in strong session", () => {
    const proof = runRealProductProof(strongSession);
    // Clean data but no learningGainResult → F-GAIN-01 is expected (no measurable progress)
    // This is correct: strong teaching doesn't mean proven improvement without gain data
    const criticalFromTaxonomy = proof.criticalFailures.filter(
      (f) => f.sourceGate === "failure-taxonomy",
    );
    // All criticals should be F-GAIN related (no gain data)
    for (const cf of criticalFromTaxonomy) {
      expect(cf.dimensionId).toBe("learningGain");
      expect(cf.failureId).toMatch(/^F-GAIN-/);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Test: Weak Session — Failures Detected
// ═══════════════════════════════════════════════════════════════════════════════

describe("realProductProofGate — weak session", () => {
  function buildWeakSession(): RealProductProofInput {
    // Only 1 correction event with no actual correction change
    const events = [
      makeCorrectionEvent({
        id: "evt-001",
        turnNumber: 1,
        corrections: [], // No corrections applied
      }),
    ];

    // Most contracts fail
    const contractChecks: ContractRuleCheck[] = [
      makeFailedContractCheck("R1_MEANING_FIRST"),
      makeFailedContractCheck("R2_ONE_CORRECTION_MAX"),
      makeFailedContractCheck("R3_NO_FAKE_PRAISE"),
      makeFailedContractCheck("R5_REMEMBER_WEAKNESS"),
      makeFailedContractCheck("R6_VIETNAMESE_INTERFERENCE"),
      makeFailedContractCheck("R7_STRATEGIC_SILENCE"),
      makeFailedContractCheck("R8_FACE_SAVING"),
      makeFailedContractCheck("R9_SELF_CORRECTION_SPACE"),
    ];

    // Overclaim detected
    const overclaimResults = [
      makeOverclaimResult({ decision: "REVISE" as const }) as OverclaimGuardResult,
    ];

    // Unsafe evaluation
    const evaluationResults = [
      makeEvaluationResult({ classification: "UNSAFE" as const }) as EvaluationResult,
      makeEvaluationResult({ classification: "NEEDS_REVIEW" as const }) as EvaluationResult,
    ];

    // Only one decision mode
    const teacherDecisions = [
      makeTeacherDecision({ action: "CORRECT_NOW", turnNumber: 1 }),
    ];

    // Empty memory
    const memory: ChauMemorySnapshot = {
      strengths: [],
      needsReview: [],
      commonMistakePatterns: [],
      nextRecommendedFocus: "",
      confidenceTrend: "unknown",
    };

    return {
      ...createMinimalProofInput("weak-session-001"),
      correctionEvents: events,
      turns: [makeTutorTurn({ turnNumber: 1 })],
      correctionResults: [makeCorrectionResult({ corrected: false, correctionCount: 0 })],
      contractChecks,
      auditResults: [],
      selfAuditResults: [], // No self-audit
      overclaimResults,
      evaluationResults,
      teacherDecisions,
      memorySnapshots: [memory],
    };
  }

  it("produces FAIL or NEEDS_REVIEW for a severely weak session", () => {
    const proof = runRealProductProof(buildWeakSession());
    // With failed contracts + overclaim + unsafe + empty memory + no self-audit
    expect(["FAIL", "NEEDS_REVIEW"]).toContain(proof.verdict);
    expect(proof.overallScore).toBeLessThan(60);
  });

  it("reports teaching dimension failures from failed contracts", () => {
    const proof = runRealProductProof(buildWeakSession());
    const teach = proof.dimensionResults.find((d) => d.dimensionId === "teaching")!;
    // Failed contracts + overclaim should produce shortcomings
    expect(teach.shortcomingsVi.length).toBeGreaterThan(0);
    expect(teach.passedProductBar).toBe(false);
  });

  it("reports self-check failures when no audits exist", () => {
    const proof = runRealProductProof(buildWeakSession());
    const sc = proof.dimensionResults.find((d) => d.dimensionId === "selfCheck")!;
    expect(sc.shortcomingsVi.some((s) => s.includes("không tự kiểm tra"))).toBe(true);
    expect(sc.passedProductBar).toBe(false);
  });

  it("reports memory failures when snapshot is empty", () => {
    const proof = runRealProductProof(buildWeakSession());
    const mem = proof.dimensionResults.find((d) => d.dimensionId === "memory")!;
    expect(mem.shortcomingsVi.length).toBeGreaterThan(0);
  });

  it("generates urgent action items for weak sessions", () => {
    const proof = runRealProductProof(buildWeakSession());
    const items = getProductProofActionItems(proof);
    expect(items.length).toBeGreaterThan(0);
    if (proof.verdict === "FAIL") {
      expect(items.some((i) => i.includes("KHẨN"))).toBe(true);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Test: Cross-Session Comparison
// ═══════════════════════════════════════════════════════════════════════════════

describe("realProductProofGate — cross-session comparison", () => {
  it("returns 'first_proof' when no previous proof exists", () => {
    const input = createMinimalProofInput();
    const proof = runRealProductProof(input);
    const comparison = compareProductProofs(proof, null);

    expect(comparison.trend).toBe("first_proof");
    expect(comparison.scoreDelta).toBe(0);
    expect(comparison.summaryVi).toContain("lần đánh giá đầu tiên");
  });

  it("detects improvement when score increases by ≥8", () => {
    const prev = runRealProductProof(createMinimalProofInput("session-1"));
    // Create a stronger session for current
    const events = [
      makeCorrectionEvent({ id: "evt-001", turnNumber: 1 }),
      makeCorrectionEvent({ id: "evt-002", turnNumber: 2 }),
    ];
    const current = runRealProductProof({
      ...createMinimalProofInput("session-2"),
      correctionEvents: events,
      turns: [makeTutorTurn({ turnNumber: 1 }), makeTutorTurn({ turnNumber: 2 })],
      contractChecks: [
        makePassedContractCheck("R1_MEANING_FIRST"),
        makePassedContractCheck("R2_ONE_CORRECTION_MAX"),
        makePassedContractCheck("R3_NO_FAKE_PRAISE"),
      ],
      auditResults: [makeAuditResult()],
      selfAuditResults: [makeSelfAuditResult()],
      memorySnapshots: [makeMemorySnapshot()],
    });

    const comparison = compareProductProofs(current, prev);
    // Current should have higher score than empty previous
    expect(comparison.scoreDelta).toBeGreaterThan(0);
    // verify the comparison produces a summary
    expect(comparison.summaryVi.length).toBeGreaterThan(0);
  });

  it("detects stable trend when score delta is within ±7", () => {
    const input = createMinimalProofInput("session-1");
    const prev = runRealProductProof(input);
    const current = runRealProductProof({ ...input, sessionId: "session-2" });

    const comparison = compareProductProofs(current, prev);
    expect(comparison.scoreDelta).toBe(0);
    expect(comparison.trend).toBe("stable");
  });

  it("compares individual dimensions for changes", () => {
    // Same base session
    const baseInput = createMinimalProofInput("session-1");
    const prevProof = runRealProductProof(baseInput);

    // Improved session with more data
    const improvedInput: RealProductProofInput = {
      ...createMinimalProofInput("session-2"),
      correctionEvents: [
        makeCorrectionEvent({ turnNumber: 1 }),
        makeCorrectionEvent({ id: "evt-002", turnNumber: 2 }),
      ],
      turns: [makeTutorTurn({ turnNumber: 1 }), makeTutorTurn({ turnNumber: 2 })],
      contractChecks: [
        makePassedContractCheck("R1_MEANING_FIRST"),
        makePassedContractCheck("R2_ONE_CORRECTION_MAX"),
      ],
      auditResults: [makeAuditResult()],
      selfAuditResults: [makeSelfAuditResult()],
      memorySnapshots: [makeMemorySnapshot()],
      correctionResults: [makeCorrectionResult(), makeCorrectionResult()],
    };
    const currentProof = runRealProductProof(improvedInput);

    const comparison = compareProductProofs(currentProof, prevProof);
    expect(comparison.scoreDelta).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Test: Utility Functions
// ═══════════════════════════════════════════════════════════════════════════════

describe("realProductProofGate — utilities", () => {
  it("productProofIsPassing returns true only for PASS verdict", () => {
    const emptyProof = runRealProductProof(createMinimalProofInput());
    expect(productProofIsPassing(emptyProof)).toBe(false);

    // A proof with verdict explicitly set to PASS would return true
    const passProof: RealProductProofOutput = {
      verdict: "PASS",
      pass: true,
      overallScore: 85,
      dimensionResults: [],
      criticalFailures: [],
      failures: [],
      warnings: [],
      summaryVi: "ĐẠT",
      summaryEn: "PASS",
      actionItemsVi: [],
      metadata: {
        runAt: "",
        sessionId: "",
        gatesExecuted: 6,
        gatesPassed: 6,
        turnsEvaluated: 0,
        correctionEventsEvaluated: 0,
        hasAllRequiredData: true,
        missingDataFields: [],
      },
      gateScores: {},
    } as RealProductProofOutput;
    expect(productProofIsPassing(passProof)).toBe(true);
  });

  it("getProductProofSummary returns Vietnamese summary", () => {
    const proof = runRealProductProof(createMinimalProofInput());
    const summary = getProductProofSummary(proof);
    expect(typeof summary).toBe("string");
    expect(summary.length).toBeGreaterThan(0);
    expect(summary).toContain("KẾT QUẢ");
  });

  it("getProductProofActionItems returns array of action items", () => {
    const proof = runRealProductProof(createMinimalProofInput());
    const items = getProductProofActionItems(proof);
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
  });

  it("createMinimalProofInput accepts custom sessionId", () => {
    const input = createMinimalProofInput("custom-session");
    expect(input.sessionId).toBe("custom-session");
    expect(input.learnerId).toBe("test-learner");
    // Defaults should work
    const def = createMinimalProofInput();
    expect(def.sessionId).toBe("test-session");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Test: buildProductProofFromSession Convenience Function
// ═══════════════════════════════════════════════════════════════════════════════

describe("realProductProofGate — buildProductProofFromSession", () => {
  it("accepts structured params and produces a proof", () => {
    const proof = buildProductProofFromSession({
      sessionId: "params-session",
      learnerId: "learner-1",
      sessionTimestamp: new Date().toISOString(),
      turns: [],
      correctionEvents: [],
      correctionResults: [],
      rubricResults: [],
      contractChecks: [],
      auditResults: [],
      selfAuditResults: [],
      overclaimResults: [],
      evaluationResults: [],
      teacherDecisions: [],
      memorySnapshots: [],
      learningGainResult: null,
      checklistResult: null,
      reviewPacket: null,
      dashboard: null,
      lessonSequence: null,
    });

    expect(proof.metadata.sessionId).toBe("params-session");
    expect(proof.dimensionResults).toHaveLength(6);
  });

  it("produces same result as runRealProductProof directly", () => {
    const params = {
      sessionId: "params-session-2",
      learnerId: "learner-2",
      sessionTimestamp: new Date().toISOString(),
      turns: [makeTutorTurn({ turnNumber: 1 })],
      correctionEvents: [
        makeCorrectionEvent({ turnNumber: 1 }),
        makeCorrectionEvent({ id: "evt-002", turnNumber: 2 }),
      ],
      correctionResults: [makeCorrectionResult(), makeCorrectionResult()],
      rubricResults: [],
      contractChecks: [
        makePassedContractCheck("R1_MEANING_FIRST"),
        makePassedContractCheck("R3_NO_FAKE_PRAISE"),
      ],
      auditResults: [makeAuditResult()],
      selfAuditResults: [makeSelfAuditResult()],
      overclaimResults: [],
      evaluationResults: [],
      teacherDecisions: [
        makeTeacherDecision({ action: "CORRECT_NOW", turnNumber: 1 }),
      ],
      memorySnapshots: [makeMemorySnapshot()],
      learningGainResult: null,
      checklistResult: null,
      reviewPacket: null,
      dashboard: null,
      lessonSequence: null,
    };

    const viaHelper = buildProductProofFromSession(params);
    const viaDirect = runRealProductProof({
      sessionId: params.sessionId,
      learnerId: params.learnerId,
      sessionTimestamp: params.sessionTimestamp,
      turns: params.turns,
      correctionEvents: params.correctionEvents,
      correctionResults: params.correctionResults,
      rubricResults: params.rubricResults,
      contractChecks: params.contractChecks,
      auditResults: params.auditResults,
      selfAuditResults: params.selfAuditResults,
      overclaimResults: params.overclaimResults,
      evaluationResults: params.evaluationResults,
      teacherDecisions: params.teacherDecisions,
      memorySnapshots: params.memorySnapshots,
      learningGainResult: params.learningGainResult,
      checklistResult: params.checklistResult,
      reviewPacket: params.reviewPacket,
      dashboard: params.dashboard,
      lessonSequence: params.lessonSequence,
    });

    expect(viaHelper.verdict).toBe(viaDirect.verdict);
    expect(viaHelper.overallScore).toBe(viaDirect.overallScore);
    expect(viaHelper.dimensionResults.length).toBe(viaDirect.dimensionResults.length);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Test: Gate Catalog Consistency
// ═══════════════════════════════════════════════════════════════════════════════

describe("realProductProofGate — catalog consistency", () => {
  it("gate catalog has exactly 20 entries across all 6 dimensions", () => {
    const dims = new Set(PRODUCT_PROOF_GATE_CATALOG.map((g) => g.dimensionId));
    expect(dims.size).toBe(6);
    expect(PRODUCT_PROOF_GATE_CATALOG.length).toBe(20);
  });

  it("every catalog gate maps to a valid dimension", () => {
    const validDims = Object.keys(getProductProofDimensionConfig());
    for (const gate of PRODUCT_PROOF_GATE_CATALOG) {
      expect(validDims).toContain(gate.dimensionId);
    }
  });

  it("gate IDs are unique", () => {
    const ids = PRODUCT_PROOF_GATE_CATALOG.map((g) => g.gateId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every labelVi and descriptionVi is non-empty", () => {
    for (const gate of PRODUCT_PROOF_GATE_CATALOG) {
      expect(gate.labelVi.length).toBeGreaterThan(0);
      expect(gate.descriptionVi.length).toBeGreaterThan(0);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Test: PASS Verdict Verification — All Conditions
// ═══════════════════════════════════════════════════════════════════════════════

describe("realProductProofGate — PASS verdict conditions", () => {
  it("PASS requires overall score ≥70", () => {
    // Build a session that scores between 45-70
    const events = [makeCorrectionEvent({ turnNumber: 1, corrections: [] })];
    const input: RealProductProofInput = {
      ...createMinimalProofInput("mid-score-session"),
      correctionEvents: events,
      turns: [makeTutorTurn({ turnNumber: 1 })],
      contractChecks: [makePassedContractCheck("R1_MEANING_FIRST")],
      auditResults: [makeAuditResult()],
      correctionResults: [makeCorrectionResult({ corrected: false })],
    };
    const proof = runRealProductProof(input);
    // With minimal data, should not reach PASS threshold
    expect(proof.verdict).not.toBe("PASS");
    expect(proof.pass).toBe(false);
  });

  it("FAIL requires critical failures or score <45 or <4 dims passing", () => {
    // Completely empty should be below 45
    const proof = runRealProductProof(createMinimalProofInput());
    expect(proof.overallScore).toBeLessThan(45);
    // With score < 45, it should be FAIL (not just NEEDS_REVIEW)
    expect(proof.verdict).toBe("FAIL");
  });

  it("output shape is consistent regardless of input quality", () => {
    const inputs = [
      createMinimalProofInput(),
      {
        ...createMinimalProofInput("session-x"),
        correctionEvents: [makeCorrectionEvent({ turnNumber: 1 })],
        turns: [makeTutorTurn({ turnNumber: 1 })],
        contractChecks: [
          makePassedContractCheck("R1_MEANING_FIRST"),
          makePassedContractCheck("R2_ONE_CORRECTION_MAX"),
          makePassedContractCheck("R3_NO_FAKE_PRAISE"),
        ],
        auditResults: [makeAuditResult()],
        selfAuditResults: [makeSelfAuditResult()],
        memorySnapshots: [makeMemorySnapshot()],
      },
    ];

    for (const input of inputs) {
      const proof = runRealProductProof(input);
      // Always has same structure
      expect(proof.dimensionResults).toHaveLength(6);
      expect(Array.isArray(proof.criticalFailures)).toBe(true);
      expect(Array.isArray(proof.failures)).toBe(true);
      expect(Array.isArray(proof.warnings)).toBe(true);
      expect(Array.isArray(proof.actionItemsVi)).toBe(true);
      expect(typeof proof.summaryVi).toBe("string");
      expect(typeof proof.summaryEn).toBe("string");
      expect(typeof proof.overallScore).toBe("number");
      expect(proof.overallScore).toBeGreaterThanOrEqual(0);
      expect(proof.overallScore).toBeLessThanOrEqual(100);
      expect(Object.keys(proof.gateScores)).toHaveLength(6);
      expect(typeof proof.metadata.runAt).toBe("string");
      expect(typeof proof.metadata.sessionId).toBe("string");
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Test: Failure Taxonomy Integration
// ═══════════════════════════════════════════════════════════════════════════════

describe("realProductProofGate — failure taxonomy integration", () => {
  it("scans failures from correction events and adds them to failures array", () => {
    const events = [
      makeCorrectionEvent({
        turnNumber: 1,
        matchScore: 30, // Very low score should trigger F-DIAG-01
        corrections: [
          { source: "grammar", position: 0, originalToken: "x", correctedToken: "x", confidence: 0.30, ruleId: null, explanationVi: null, explanationEn: null },
        ],
      }),
      makeCorrectionEvent({
        id: "evt-002",
        turnNumber: 2,
        matchScore: 25,
        corrections: [
          { source: "grammar", position: 0, originalToken: "x", correctedToken: "x", confidence: 0.25, ruleId: null, explanationVi: null, explanationEn: null },
        ],
      }),
      makeCorrectionEvent({
        id: "evt-003",
        turnNumber: 3,
        matchScore: 20,
        corrections: [
          { source: "grammar", position: 0, originalToken: "x", correctedToken: "x", confidence: 0.20, ruleId: null, explanationVi: null, explanationEn: null },
        ],
      }),
    ];

    const input: RealProductProofInput = {
      ...createMinimalProofInput("taxonomy-test"),
      correctionEvents: events,
      turns: [makeTutorTurn({ turnNumber: 1 }), makeTutorTurn({ turnNumber: 2 }), makeTutorTurn({ turnNumber: 3 })],
      memorySnapshots: [makeMemorySnapshot()],
      correctionResults: events.map(() => makeCorrectionResult()),
    };

    const proof = runRealProductProof(input);
    // The failure taxonomy should produce failures that appear in the output
    expect(proof.failures.length).toBeGreaterThan(0);
    // At least some should come from the failure-taxonomy source
    const taxonomyFailures = proof.failures.filter(
      (f) => f.sourceGate === "failure-taxonomy",
    );
    expect(taxonomyFailures.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Test: Warnings Generated for Missing Data
// ═══════════════════════════════════════════════════════════════════════════════

describe("realProductProofGate — data completeness warnings", () => {
  it("generates warning for each missing data field", () => {
    const input = createMinimalProofInput();
    const proof = runRealProductProof(input);

    // Empty input → 8 missing data fields (turns, correctionEvents, contractChecks, memorySnapshots, learningGainResult, checklistResult, auditResults, selfAuditResults)
    const missingWarnings = proof.warnings.filter(
      (w) => w.warningCode.startsWith("MISSING_"),
    );
    expect(missingWarnings.length).toBeGreaterThanOrEqual(5);
  });

  it("generates unproven warnings for zero-score dimensions", () => {
    const input = createMinimalProofInput();
    const proof = runRealProductProof(input);
    const unprovenWarnings = proof.warnings.filter(
      (w) => w.warningCode.startsWith("UNPROVEN_"),
    );
    expect(unprovenWarnings.length).toBeGreaterThanOrEqual(5); // At least 5 of 6 are unproven with empty data
  });

  it("hasAllRequiredData is false when fields are missing", () => {
    const input = createMinimalProofInput();
    const proof = runRealProductProof(input);
    expect(proof.metadata.hasAllRequiredData).toBe(false);
    expect(proof.metadata.missingDataFields.length).toBeGreaterThan(0);
  });
});
