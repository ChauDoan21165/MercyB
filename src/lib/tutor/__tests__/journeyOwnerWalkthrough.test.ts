/**
 * Journey Owner Walkthrough Evidence — Tests
 *
 * Comprehensive test suite for the full journey walkthrough module.
 * Covers all 8 phases, edge cases, Vietnamese-first output,
 * cross-journey comparison, validation, and integration contracts.
 *
 * npx vitest run src/lib/tutor/__tests__/journeyOwnerWalkthrough.test.ts
 */

import { describe, expect, it } from "vitest";
import {
  buildFullJourneyWalkthrough,
  walkJourneyPhase,
  collectJourneyEvidence,
  generateJourneyWalkthroughVi,
  getJourneyWalkthroughActionItems,
  validateJourneyWalkthrough,
  compareJourneyWalkthroughs,
  isJourneyProven,
  isJourneyAdequate,
  getJourneyCompactVi,
  getCapabilityCoverageRatio,
  createMinimalJourneyInput,
  TEACHER_CAPABILITIES,
  JOURNEY_PHASES,
  type JourneyWalkthroughInput,
  type JourneyWalkthroughResult,
  type JourneyPhaseResult,
  type JourneyPhaseSessionData,
  type JourneyWalkthroughVerdict,
  type TeacherCapability,
  type JourneyPhaseId,
} from "../journeyOwnerWalkthrough";

import type { TutorTurn } from "../tutorTypes";
import type { TranscriptCorrectionEvent } from "../transcriptCorrectionTypes";
import type { CorrectionMode } from "../teacherMercyCorrectionTiming";
import type { AuditResult } from "../teacherMercyAuditGate";
import type { RubricResult } from "../teacherMercyRubric";
import type { ContractRuleCheck } from "../teacherMercyContract";
import type { SelfAuditResult } from "../teacherMercySelfAuditGate";
import type { OverclaimGuardResult } from "../overclaimGuard";
import type { EvaluationResult } from "../teachingDecisionEvaluationGate";
import type { TeacherDecision } from "../teacherDecisionEngine";
import type { LearningGainResult } from "../learningGainRubric";
import type { ChauMemorySnapshot, ChauReviewPacket } from "../chauReviewPacket";
import type { HumanLearnerChecklistResult } from "../humanLearnerTestingChecklist";

// ═══════════════════════════════════════════════════════════════════════════════
// Test Helpers
// ═══════════════════════════════════════════════════════════════════════════════

function makeCorrectionTurn(userText: string, correctedText: string, explanation?: string): TutorTurn {
  return {
    id: `turn-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    mode: "correction",
    targetLanguage: "en",
    explainLanguage: "vi",
    userText,
    correctedText,
    explanation: explanation || `Bạn nên dùng "${correctedText}" thay vì "${userText}".`,
    shouldReadAloudText: correctedText,
    createdAt: new Date().toISOString(),
  };
}

function makeConversationTurn(userText: string, correctedText: string, naturalReply: string, nextQuestion: string): TutorTurn {
  return {
    id: `turn-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    mode: "conversation",
    targetLanguage: "en",
    explainLanguage: "vi",
    userText,
    correctedText,
    explanation: "",
    naturalReply,
    nextQuestion,
    shouldReadAloudText: `${naturalReply} ${nextQuestion}`,
    createdAt: new Date().toISOString(),
  };
}

function makeCorrectionEvent(overrides?: Partial<TranscriptCorrectionEvent>): TranscriptCorrectionEvent {
  return {
    id: `ce-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    timestamp: Date.now(),
    sessionId: "session-001",
    turnNumber: 1,
    mode: "grammar",
    originalTranscript: "I go to school yesterday.",
    correctedTranscript: "I went to school yesterday.",
    targetSentence: null,
    corrections: [],
    timingMode: "immediate" as CorrectionMode,
    timingReason: "basic grammar error",
    delayTurns: null,
    wasSurfaced: true,
    learnerAcknowledged: true,
    matchScore: null,
    weaknessTags: ["tense-past"],
    weaknessLabelsVi: ["Thiếu thì quá khứ"],
    interferenceCategory: "tense-omission" as any,
    topicTag: null,
    ...overrides,
  };
}

function makeRubricResult(): RubricResult {
  return {
    dimensionId: "rb_correction_accuracy" as any,
    labelVi: "Độ chính xác sửa lỗi",
    labelEn: "Correction Accuracy",
    score: 3,
    evidenceVi: ["Sửa lỗi chính xác tất cả các trường hợp"],
    shortcomingsVi: [],
  } as unknown as RubricResult;
}

function makeContractCheck(): ContractRuleCheck {
  return {
    ruleId: "R1",
    ruleVi: "Luôn sửa lỗi chính xác",
    passed: true,
    evidenceVi: "Sửa lỗi chính xác",
  } as unknown as ContractRuleCheck;
}

function makeAuditResult(): AuditResult {
  return {
    passed: true,
    findings: [],
    score: 95,
  } as unknown as AuditResult;
}

function makeSelfAuditResult(): SelfAuditResult {
  return {
    passed: true,
    findings: [],
    gatesRun: 8,
    gatesPassed: 8,
  } as unknown as SelfAuditResult;
}

function makeOverclaimResult(): OverclaimGuardResult {
  return {
    blocked: false,
    findings: [],
    score: 100,
  } as unknown as OverclaimGuardResult;
}

function makeEvaluationResult(): EvaluationResult {
  return {
    passed: true,
    score: 90,
    dimensions: [],
  } as unknown as EvaluationResult;
}

function makeTeacherDecision(): TeacherDecision {
  return {
    action: "correct_immediately",
    confidence: 0.9,
    rationale: "error_clear",
  } as unknown as TeacherDecision;
}

function makeMemorySnapshot(): ChauMemorySnapshot {
  return {
    snapshotId: `snap-${Date.now()}`,
    timestamp: Date.now(),
    weaknesses: [],
    sessionCount: 5,
  } as unknown as ChauMemorySnapshot;
}

function makeReviewPacket(): ChauReviewPacket {
  return {
    sessionId: "session-001",
    learnerId: "learner-001",
    verdict: "reportable" as any,
    dimensions: [],
    summaryVi: "Buổi học tốt.",
    actionItems: [],
  } as unknown as ChauReviewPacket;
}

function makeLearningGainResult(
  classification: "significant_gain" | "moderate_gain" | "minimal_gain" | "no_measurable_gain" | "regression" = "moderate_gain",
): LearningGainResult {
  return {
    classification,
    improvingDimensions: classification === "significant_gain" ? 5 : classification === "moderate_gain" ? 3 : 0,
    decliningDimensions: 0,
    dimensions: [],
    summaryVi: "Có tiến bộ rõ rệt.",
    summaryEn: "Clear improvement.",
    baseline: {
      snapshotId: "base-001",
      eventsCaptured: 10,
      errorRate: 0.4,
    } as any,
    outcome: {
      snapshotId: "out-001",
      eventsCaptured: 10,
      errorRate: 0.1,
    } as any,
    totalEvents: 20,
    sufficientData: true,
  };
}

function makeChecklistResult(): HumanLearnerChecklistResult {
  return {
    passed: true,
    totalItems: 27,
    itemsPassed: 25,
    criticalDimensionsPassed: true,
  } as unknown as HumanLearnerChecklistResult;
}

function makeSessionData(
  phaseId: JourneyPhaseId,
  turns: TutorTurn[],
  extras?: {
    correctionEvents?: TranscriptCorrectionEvent[];
    correctionResults?: any[];
    rubricResults?: RubricResult[];
    contractChecks?: ContractRuleCheck[];
    auditResults?: AuditResult[];
    selfAuditResults?: SelfAuditResult[];
    overclaimResults?: OverclaimGuardResult[];
    evaluationResults?: EvaluationResult[];
    teacherDecisions?: TeacherDecision[];
    memorySnapshots?: ChauMemorySnapshot[];
    learningGainResult?: LearningGainResult | null;
    checklistResult?: HumanLearnerChecklistResult | null;
    reviewPacket?: ChauReviewPacket | null;
  },
): JourneyPhaseSessionData {
  return {
    sessionId: `session-${phaseId}-001`,
    sessionTimestamp: new Date().toISOString(),
    turns,
    correctionEvents: extras?.correctionEvents,
    correctionResults: extras?.correctionResults as any,
    rubricResults: extras?.rubricResults,
    contractChecks: extras?.contractChecks,
    auditResults: extras?.auditResults,
    selfAuditResults: extras?.selfAuditResults,
    overclaimResults: extras?.overclaimResults,
    evaluationResults: extras?.evaluationResults,
    teacherDecisions: extras?.teacherDecisions,
    memorySnapshots: extras?.memorySnapshots,
    learningGainResult: extras?.learningGainResult ?? null,
    checklistResult: extras?.checklistResult ?? null,
    reviewPacket: extras?.reviewPacket ?? null,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 1: Module Smoke Tests
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — module smoke", () => {
  it("exports buildFullJourneyWalkthrough", () => {
    expect(buildFullJourneyWalkthrough).toBeTypeOf("function");
  });

  it("exports walkJourneyPhase", () => {
    expect(walkJourneyPhase).toBeTypeOf("function");
  });

  it("exports collectJourneyEvidence", () => {
    expect(collectJourneyEvidence).toBeTypeOf("function");
  });

  it("exports generateJourneyWalkthroughVi", () => {
    expect(generateJourneyWalkthroughVi).toBeTypeOf("function");
  });

  it("exports getJourneyWalkthroughActionItems", () => {
    expect(getJourneyWalkthroughActionItems).toBeTypeOf("function");
  });

  it("exports validateJourneyWalkthrough", () => {
    expect(validateJourneyWalkthrough).toBeTypeOf("function");
  });

  it("exports compareJourneyWalkthroughs", () => {
    expect(compareJourneyWalkthroughs).toBeTypeOf("function");
  });

  it("exports convenience helpers", () => {
    expect(isJourneyProven).toBeTypeOf("function");
    expect(isJourneyAdequate).toBeTypeOf("function");
    expect(getJourneyCompactVi).toBeTypeOf("function");
    expect(getCapabilityCoverageRatio).toBeTypeOf("function");
    expect(createMinimalJourneyInput).toBeTypeOf("function");
  });

  it("TEACHER_CAPABILITIES has 6 items", () => {
    expect(TEACHER_CAPABILITIES).toHaveLength(6);
    expect(TEACHER_CAPABILITIES).toContain("diagnose");
    expect(TEACHER_CAPABILITIES).toContain("teach");
    expect(TEACHER_CAPABILITIES).toContain("remember");
    expect(TEACHER_CAPABILITIES).toContain("adapt");
    expect(TEACHER_CAPABILITIES).toContain("self_check");
    expect(TEACHER_CAPABILITIES).toContain("prove");
  });

  it("JOURNEY_PHASES has 8 items in correct order", () => {
    expect(JOURNEY_PHASES).toHaveLength(8);
    expect(JOURNEY_PHASES[0]).toBe("placement");
    expect(JOURNEY_PHASES[7]).toBe("exit_readiness");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 2: Minimal Empty Walkthrough
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — minimal empty walkthrough", () => {
  it("builds a walkthrough with no session data", () => {
    const input = createMinimalJourneyInput();
    const result = buildFullJourneyWalkthrough(input);

    expect(result.journeyId).toMatch(/^journey-/);
    expect(result.learnerId).toBe("learner-test-001");
    expect(result.startingCefrLevel).toBe("A1");
    expect(result.targetCefrLevel).toBe("B1");
    expect(result.phases).toHaveLength(8);
    expect(result.verdict).toBe("JOURNEY_FAILED");
    expect(result.overallScore).toBeLessThan(40);
  });

  it("has all 8 phases in order", () => {
    const input = createMinimalJourneyInput();
    const result = buildFullJourneyWalkthrough(input);

    expect(result.phases[0].phaseId).toBe("placement");
    expect(result.phases[1].phaseId).toBe("first_contact");
    expect(result.phases[2].phaseId).toBe("conversation_initiation");
    expect(result.phases[3].phaseId).toBe("pattern_building");
    expect(result.phases[4].phaseId).toBe("adaptation");
    expect(result.phases[5].phaseId).toBe("self_correction_growth");
    expect(result.phases[6].phaseId).toBe("mastery_evidence");
    expect(result.phases[7].phaseId).toBe("exit_readiness");
  });

  it("empty walkthrough has no sessions or turns", () => {
    const input = createMinimalJourneyInput();
    const result = buildFullJourneyWalkthrough(input);

    expect(result.progress.totalSessions).toBe(0);
    expect(result.progress.totalTurns).toBe(0);
    expect(result.progress.totalCorrections).toBe(0);
    expect(result.progress.totalSelfCorrections).toBe(0);
  });

  it("empty walkthrough generates Vietnamese summary", () => {
    const input = createMinimalJourneyInput();
    const result = buildFullJourneyWalkthrough(input);

    expect(result.walkthroughVi).toContain("HÀNH TRÌNH");
    expect(result.walkthroughVi).toContain("learner-test-001");
    expect(result.walkthroughVi).toContain("THẤT BẠI");
  });

  it("empty walkthrough has action items", () => {
    const input = createMinimalJourneyInput();
    const result = buildFullJourneyWalkthrough(input);

    expect(result.actionItems.length).toBeGreaterThan(0);
    expect(result.actionItems.some((a) => a.includes("KHẨN"))).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 3: Placement Phase
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — placement phase", () => {
  it("placement phase has diagnose capability visible", () => {
    const input = createMinimalJourneyInput({ phases: ["placement"] });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.phases).toHaveLength(1);
    const phase = result.phases[0];
    expect(phase.labelVi).toBe("Định vị trình độ");
    expect(phase.labelEn).toBe("Placement");
    // Placement gets a baseline score for diagnose even without sessions
    expect(phase.capabilities.diagnose.score).toBeGreaterThanOrEqual(1);
  });

  it("placement phase labelEn is English", () => {
    const input = createMinimalJourneyInput({ phases: ["placement"] });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.phases[0].labelEn).toBe("Placement");
  });

  it("placement with rubric data has higher diagnose score", () => {
    const sessionData = makeSessionData("placement", [], {
      rubricResults: [makeRubricResult()],
      contractChecks: [makeContractCheck()],
    });

    const input = createMinimalJourneyInput({
      phases: ["placement"],
      phaseSessions: { placement: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.phases[0].capabilities.diagnose.score).toBe(2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 4: Correction Sessions
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — correction sessions", () => {
  it("correction session enables diagnose and teach", () => {
    const turn = makeCorrectionTurn("I go to school.", "I went to school.");
    const sessionData = makeSessionData("first_contact", [turn], {
      rubricResults: [makeRubricResult()],
      contractChecks: [makeContractCheck()],
    });

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    const phase = result.phases[0];
    expect(phase.capabilities.diagnose.score).toBeGreaterThanOrEqual(2);
    expect(phase.capabilities.teach.score).toBeGreaterThanOrEqual(2);
  });

  it("counts corrections correctly", () => {
    const turns = [
      makeCorrectionTurn("I go.", "I went."),
      makeCorrectionTurn("He go.", "He goes."),
    ];
    const sessionData = makeSessionData("first_contact", turns);

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.progress.totalCorrections).toBe(2);
  });

  it("tracks self-corrections from learner acknowledgments", () => {
    const turn = makeCorrectionTurn("I go.", "I went.");
    const event = makeCorrectionEvent({
      originalTranscript: "I go.",
      correctedTranscript: "I went.",
      wasSurfaced: true,
      learnerAcknowledged: true,
    });
    const sessionData = makeSessionData("first_contact", [turn], {
      correctionEvents: [event],
    });

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.progress.totalSelfCorrections).toBe(1);
  });

  it("detects past-tense weakness from go→went correction", () => {
    const turn = makeCorrectionTurn("I go to school yesterday.", "I went to school yesterday.");
    const sessionData = makeSessionData("first_contact", [turn]);

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.phases[0].weaknessTags.length).toBeGreaterThanOrEqual(1);
    expect(result.phases[0].weaknessTags[0].category).toBe("tense-past");
  });

  it("detects missing-article weakness", () => {
    const turn = makeCorrectionTurn("I saw cat.", "I saw a cat.");
    const sessionData = makeSessionData("first_contact", [turn]);

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.phases[0].weaknessTags.some(
      (t) => t.category === "missing-article",
    )).toBe(true);
  });

  it("detects subj-verb-agreement weakness", () => {
    const turn = makeCorrectionTurn("He are happy.", "He is happy.");
    const sessionData = makeSessionData("first_contact", [turn]);

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.phases[0].weaknessTags.some(
      (t) => t.category === "subj-verb-agreement",
    )).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 5: Conversation Sessions
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — conversation sessions", () => {
  it("conversation session enables teach through natural replies", () => {
    const turn = makeConversationTurn(
      "I like pizza.",
      "I like pizza.",
      "That's great! I like pizza too.",
      "What toppings do you prefer?",
    );
    const sessionData = makeSessionData("conversation_initiation", [turn], {
      rubricResults: [makeRubricResult()],
      contractChecks: [makeContractCheck()],
    });

    const input = createMinimalJourneyInput({
      phases: ["conversation_initiation"],
      phaseSessions: { conversation_initiation: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.phases[0].capabilities.teach.score).toBeGreaterThanOrEqual(2);
  });

  it("conversation phase has correct Vietnamese label", () => {
    const turn = makeConversationTurn(
      "Hello.",
      "Hello.",
      "Hello! How are you?",
      "What did you do today?",
    );
    const sessionData = makeSessionData("conversation_initiation", [turn]);

    const input = createMinimalJourneyInput({
      phases: ["conversation_initiation"],
      phaseSessions: { conversation_initiation: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.phases[0].labelVi).toBe("Bắt đầu hội thoại");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 6: Capability Evidence
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — capability evidence", () => {
  it("each capability has correct shape", () => {
    const turn = makeCorrectionTurn("I go.", "I went.");
    const sessionData = makeSessionData("first_contact", [turn], {
      rubricResults: [makeRubricResult()],
      contractChecks: [makeContractCheck()],
    });

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    const cap = result.phases[0].capabilities.diagnose;
    expect(cap).toHaveProperty("capability");
    expect(cap).toHaveProperty("demonstrated");
    expect(cap).toHaveProperty("descriptionVi");
    expect(cap).toHaveProperty("descriptionEn");
    expect(cap).toHaveProperty("score");
    expect(cap).toHaveProperty("sources");
    expect(cap).toHaveProperty("hasFailure");
  });

  it("diagnose has sources from correctionEngine", () => {
    const turn = makeCorrectionTurn("I go.", "I went.");
    const sessionData = makeSessionData("first_contact", [turn], {
      rubricResults: [makeRubricResult()],
    });

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    const sources = result.phases[0].capabilities.diagnose.sources;
    expect(sources).toContain("correctionEngine");
    expect(sources).toContain("teacherMercyRubric");
  });

  it("teach has sources from correctionEngine and contract", () => {
    const turn = makeCorrectionTurn("I go.", "I went.");
    const sessionData = makeSessionData("first_contact", [turn], {
      rubricResults: [makeRubricResult()],
      contractChecks: [makeContractCheck()],
    });

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    const sources = result.phases[0].capabilities.teach.sources;
    expect(sources).toContain("correctionEngine");
    expect(sources).toContain("teacherMercyContract");
  });

  it("self_check sources include audit gates", () => {
    const turn = makeCorrectionTurn("I go.", "I went.");
    const sessionData = makeSessionData("first_contact", [turn], {
      auditResults: [makeAuditResult()],
      selfAuditResults: [makeSelfAuditResult()],
    });

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    const sources = result.phases[0].capabilities.self_check.sources;
    expect(sources).toContain("teacherMercySelfAuditGate");
    expect(sources).toContain("overclaimGuard");
  });

  it("prove sources include learning gain modules", () => {
    const turn = makeCorrectionTurn("I go.", "I went.");
    const sessionData = makeSessionData("first_contact", [turn], {
      learningGainResult: makeLearningGainResult("moderate_gain"),
    });

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    const sources = result.phases[0].capabilities.prove.sources;
    expect(sources).toContain("learningGainRubric");
    expect(sources).toContain("learningGainEvidencePacket");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 7: Full Journey with All Data
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — full journey with data", () => {
  function buildFullSessionData(phaseId: JourneyPhaseId): JourneyPhaseSessionData {
    const turns: TutorTurn[] = [
      makeCorrectionTurn("I go to school.", "I went to school."),
      makeCorrectionTurn("She don't like.", "She doesn't like."),
      makeConversationTurn(
        "I like reading books.",
        "I like reading books.",
        "Reading is wonderful! I enjoy books too.",
        "What kind of books do you read?",
      ),
    ];

    return makeSessionData(phaseId, turns, {
      correctionEvents: [
        makeCorrectionEvent({ originalTranscript: "I go to school.", correctedTranscript: "I went to school." }),
        makeCorrectionEvent({ originalTranscript: "She don't like.", correctedTranscript: "She doesn't like." }),
      ],
      rubricResults: [makeRubricResult(), makeRubricResult()],
      contractChecks: [makeContractCheck(), makeContractCheck()],
      auditResults: [makeAuditResult()],
      selfAuditResults: [makeSelfAuditResult()],
      overclaimResults: [makeOverclaimResult()],
      evaluationResults: [makeEvaluationResult()],
      teacherDecisions: [makeTeacherDecision()],
      memorySnapshots: [makeMemorySnapshot()],
      learningGainResult: makeLearningGainResult("significant_gain"),
      checklistResult: makeChecklistResult(),
      reviewPacket: makeReviewPacket(),
    });
  }

  it("passes with full data on all phases", () => {
    const phaseSessions: Partial<Record<JourneyPhaseId, JourneyPhaseSessionData[]>> = {};
    for (const phaseId of JOURNEY_PHASES) {
      phaseSessions[phaseId] = [buildFullSessionData(phaseId), buildFullSessionData(phaseId)];
    }

    const input = createMinimalJourneyInput({ phaseSessions });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.phases).toHaveLength(8);
    expect(result.verdict).toBe("JOURNEY_PROVEN");
    expect(result.overallScore).toBeGreaterThanOrEqual(80);
  });

  it("all capabilities demonstrated in full journey", () => {
    const phaseSessions: Partial<Record<JourneyPhaseId, JourneyPhaseSessionData[]>> = {};
    for (const phaseId of JOURNEY_PHASES) {
      phaseSessions[phaseId] = [buildFullSessionData(phaseId)];
    }

    const input = createMinimalJourneyInput({ phaseSessions });
    const result = buildFullJourneyWalkthrough(input);

    for (const cap of TEACHER_CAPABILITIES) {
      expect(result.evidence.capabilityCoverage[cap]).toBeGreaterThanOrEqual(4);
    }
  });

  it("full journey evidence has timeline", () => {
    const input = createMinimalJourneyInput({
      phaseSessions: {
        first_contact: [buildFullSessionData("first_contact")],
        mastery_evidence: [buildFullSessionData("mastery_evidence")],
      },
      phases: ["first_contact", "mastery_evidence"],
    });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.evidence.timeline).toHaveLength(2);
    expect(result.evidence.timeline[0].phaseId).toBe("first_contact");
    expect(result.evidence.timeline[1].phaseId).toBe("mastery_evidence");
  });

  it("full journey weakness tracking works", () => {
    const phaseSessions: Partial<Record<JourneyPhaseId, JourneyPhaseSessionData[]>> = {};
    for (const phaseId of JOURNEY_PHASES) {
      phaseSessions[phaseId] = [buildFullSessionData(phaseId)];
    }

    const input = createMinimalJourneyInput({ phaseSessions });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.evidence.weaknessTracking.totalIdentified).toBeGreaterThan(0);
    expect(result.evidence.weaknessTracking.summaryVi).toContain("phát hiện");
  });

  it("full journey gain trajectory has entries", () => {
    const phaseSessions: Partial<Record<JourneyPhaseId, JourneyPhaseSessionData[]>> = {};
    for (const phaseId of JOURNEY_PHASES) {
      phaseSessions[phaseId] = [buildFullSessionData(phaseId)];
    }

    const input = createMinimalJourneyInput({ phaseSessions });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.evidence.gainTrajectory).toHaveLength(8);
    expect(result.evidence.gainTrajectory[7].gainReportable).toBe(true);
  });

  it("full journey safety summary", () => {
    const phaseSessions: Partial<Record<JourneyPhaseId, JourneyPhaseSessionData[]>> = {};
    for (const phaseId of JOURNEY_PHASES) {
      phaseSessions[phaseId] = [buildFullSessionData(phaseId)];
    }

    const input = createMinimalJourneyInput({ phaseSessions });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.evidence.safetySummary.totalAudits).toBe(0); // safety audits not included in mock data
    expect(result.evidence.safetySummary.summaryVi).toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 8: Verdict Levels
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — verdict levels", () => {
  it("JOURNEY_FAILED for empty journey", () => {
    const input = createMinimalJourneyInput();
    const result = buildFullJourneyWalkthrough(input);
    expect(result.verdict).toBe("JOURNEY_FAILED");
  });

  it("partially filled journey returns FAILED or INCOMPLETE", () => {
    const turn = makeCorrectionTurn("I go.", "I went.");
    const phaseSessions: Partial<Record<JourneyPhaseId, JourneyPhaseSessionData[]>> = {
      first_contact: [
        makeSessionData("first_contact", [turn], {
          rubricResults: [makeRubricResult()],
          contractChecks: [makeContractCheck()],
        }),
      ],
      placement: [
        makeSessionData("placement", [], {
          rubricResults: [makeRubricResult()],
        }),
      ],
    };

    const input = createMinimalJourneyInput({ phaseSessions });
    const result = buildFullJourneyWalkthrough(input);

    // With limited data, should be FAILED or INCOMPLETE (not PROVEN)
    expect(result.verdict).not.toBe("JOURNEY_PROVEN");
    expect(result.verdict).not.toBe("JOURNEY_ADEQUATE");
  });

  it("JOURNEY_ADEQUATE for decent journey", () => {
    const buildData = (phaseId: JourneyPhaseId): JourneyPhaseSessionData => {
      const turn = makeCorrectionTurn("I go.", "I went.");
      return makeSessionData(phaseId, [turn, turn], {
        rubricResults: [makeRubricResult()],
        contractChecks: [makeContractCheck()],
        auditResults: [makeAuditResult()],
        selfAuditResults: [makeSelfAuditResult()],
        evaluationResults: [makeEvaluationResult()],
        teacherDecisions: [makeTeacherDecision()],
        learningGainResult: makeLearningGainResult("moderate_gain"),
      });
    };

    const phaseSessions: Partial<Record<JourneyPhaseId, JourneyPhaseSessionData[]>> = {};
    for (const phaseId of JOURNEY_PHASES) {
      phaseSessions[phaseId] = [buildData(phaseId)];
    }

    const input = createMinimalJourneyInput({ phaseSessions });
    const result = buildFullJourneyWalkthrough(input);

    // With all 8 phases filled moderately, should reach ADEQUATE
    expect(["JOURNEY_ADEQUATE", "JOURNEY_PROVEN"]).toContain(result.verdict);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 9: Vietnamese-First Output
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — Vietnamese-first output", () => {
  it("walkthrough summary contains Vietnamese text", () => {
    const input = createMinimalJourneyInput({
      phases: ["placement", "first_contact"],
      phaseSessions: {
        first_contact: [
          makeSessionData("first_contact", [
            makeCorrectionTurn("I go.", "I went."),
          ], {
            rubricResults: [makeRubricResult()],
            contractChecks: [makeContractCheck()],
          }),
        ],
      },
    });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.walkthroughVi).toContain("HÀNH TRÌNH HỌC TẬP");
    expect(result.walkthroughVi).toContain("TIẾN ĐỘ");
    expect(result.walkthroughVi).toContain("BẰNG CHỨNG");
  });

  it("phase labels are Vietnamese", () => {
    const input = createMinimalJourneyInput();
    const result = buildFullJourneyWalkthrough(input);

    expect(result.phases[0].labelVi).toBe("Định vị trình độ");
    expect(result.phases[1].labelVi).toBe("Tiếp xúc đầu tiên");
    expect(result.phases[2].labelVi).toBe("Bắt đầu hội thoại");
    expect(result.phases[3].labelVi).toBe("Xây dựng thói quen");
    expect(result.phases[4].labelVi).toBe("Thích ứng cá nhân");
    expect(result.phases[5].labelVi).toBe("Tự sửa lỗi");
    expect(result.phases[6].labelVi).toBe("Bằng chứng tiến bộ");
    expect(result.phases[7].labelVi).toBe("Sẵn sàng tốt nghiệp");
  });

  it("capability descriptions are Vietnamese", () => {
    const turn = makeCorrectionTurn("I go.", "I went.");
    const sessionData = makeSessionData("first_contact", [turn], {
      rubricResults: [makeRubricResult()],
      contractChecks: [makeContractCheck()],
    });

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    const cap = result.phases[0].capabilities.diagnose;
    // descriptionVi should contain Vietnamese characters or at least not be identical to English
    expect(cap.descriptionVi).toBeTruthy();
    expect(cap.descriptionEn).toBeTruthy();
    // They should differ for actual content
    if (cap.score >= 1) {
      expect(cap.descriptionVi).not.toBe(cap.descriptionEn);
    }
  });

  it("action items use Vietnamese markers", () => {
    const input = createMinimalJourneyInput();
    const result = buildFullJourneyWalkthrough(input);

    expect(result.actionItems.some(
      (a) => a.includes("KHẨN") || a.includes("CẦN XEM"),
    )).toBe(true);
  });

  it("evidence summary is Vietnamese", () => {
    const input = createMinimalJourneyInput();
    const result = buildFullJourneyWalkthrough(input);

    expect(result.evidence.evidenceSummaryVi).toBeTruthy();
    expect(result.evidence.weaknessTracking.summaryVi).toBeTruthy();
  });

  it("compact output contains Vietnamese verdict label", () => {
    const input = createMinimalJourneyInput();
    const result = buildFullJourneyWalkthrough(input);

    const compact = getJourneyCompactVi(result);
    expect(compact).toContain("learner-test-001");
    expect(compact).toMatch(/(ĐẠT|THIẾU|TRƯỢT)/);
  });

  it("generates Vietnamese walkthrough via public API", () => {
    const input = createMinimalJourneyInput({
      phases: ["placement"],
    });
    const result = buildFullJourneyWalkthrough(input);
    const summary = generateJourneyWalkthroughVi(result);

    expect(summary).toBe(result.walkthroughVi);
    expect(summary).toContain("Hành trình");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 10: Edge Cases
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — edge cases", () => {
  it("handles empty phases array", () => {
    const input = createMinimalJourneyInput({ phases: [] });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.phases).toHaveLength(0);
    expect(result.verdict).toBe("JOURNEY_FAILED");
    expect(result.overallScore).toBe(0);
  });

  it("handles single phase", () => {
    const input = createMinimalJourneyInput({ phases: ["placement"] });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.phases).toHaveLength(1);
  });

  it("handles custom learner ID with special characters", () => {
    const input = createMinimalJourneyInput({ learnerId: "người-học-việt-001" });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.learnerId).toBe("người-học-việt-001");
    expect(result.walkthroughVi).toContain("người-học-việt-001");
  });

  it("handles different CEFR levels", () => {
    const input = createMinimalJourneyInput({
      startingCefrLevel: "A2",
      targetCefrLevel: "C1",
    });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.startingCefrLevel).toBe("A2");
    expect(result.targetCefrLevel).toBe("C1");
  });

  it("handles different products", () => {
    const input = createMinimalJourneyInput({ productId: "mercyKids" });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.productId).toBe("mercyKids");
  });

  it("handles many sessions per phase", () => {
    const turns = [makeCorrectionTurn("I go.", "I went.")];
    const sessions: JourneyPhaseSessionData[] = Array.from({ length: 10 }, (_, i) =>
      makeSessionData("first_contact", turns, {
        rubricResults: [makeRubricResult()],
        contractChecks: [makeContractCheck()],
      }),
    );

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: sessions },
    });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.phases[0].sessionCount).toBe(10);
    expect(result.phases[0].turnCount).toBe(10);
    expect(result.progress.totalSessions).toBe(10);
  });

  it("handles correction events with null correctedTranscript", () => {
    const turn = makeCorrectionTurn("hello.", "hello.");
    const event = makeCorrectionEvent({
      originalTranscript: "hello.",
      correctedTranscript: null,
    });
    const sessionData = makeSessionData("first_contact", [turn], {
      correctionEvents: [event],
    });

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    // Should not throw
    expect(result.phases[0].phaseId).toBe("first_contact");
  });

  it("handles null learning gain results", () => {
    const turn = makeCorrectionTurn("I go.", "I went.");
    const sessionData = makeSessionData("first_contact", [turn], {
      learningGainResult: null,
    });

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.phases[0].learningGain).toBeNull();
    expect(result.evidence.gainTrajectory[0].gainScore).toBe(0);
    expect(result.evidence.gainTrajectory[0].gainReportable).toBe(false);
  });

  it("handles identical user and corrected text", () => {
    const turn = makeCorrectionTurn("Hello.", "Hello.");
    const sessionData = makeSessionData("first_contact", [turn]);

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    // No weakness tags should be generated when userText matches correctedText
    expect(result.phases[0].weaknessTags).toHaveLength(0);
  });

  it("handles very long text in turns", () => {
    const longText = "I think that ".repeat(50).trim();
    const turn = makeCorrectionTurn(longText, longText);
    const sessionData = makeSessionData("first_contact", [turn]);

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    // Should not throw
    expect(() => buildFullJourneyWalkthrough(input)).not.toThrow();
  });

  it("handles empty text", () => {
    const turn = makeCorrectionTurn("", "");
    const sessionData = makeSessionData("first_contact", [turn]);

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    // Should not throw
    expect(() => buildFullJourneyWalkthrough(input)).not.toThrow();
  });

  it("phase result has correct ordinal numbers", () => {
    const input = createMinimalJourneyInput();
    const result = buildFullJourneyWalkthrough(input);

    for (let i = 0; i < result.phases.length; i++) {
      expect(result.phases[i].phaseOrdinal).toBe(i + 1);
    }
  });

  it("turn count accumulates across sessions", () => {
    const turns1 = [
      makeCorrectionTurn("a.", "a."),
      makeCorrectionTurn("b.", "b."),
    ];
    const turns2 = [
      makeCorrectionTurn("c.", "c."),
      makeCorrectionTurn("d.", "d."),
      makeCorrectionTurn("e.", "e."),
    ];
    const sessions = [
      makeSessionData("first_contact", turns1),
      makeSessionData("first_contact", turns2),
    ];

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: sessions },
    });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.phases[0].turnCount).toBe(5);
    expect(result.progress.totalTurns).toBe(5);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 11: Validation
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — validation", () => {
  it("validates empty walkthrough as invalid", () => {
    const input = createMinimalJourneyInput();
    const result = buildFullJourneyWalkthrough(input);
    const validation = validateJourneyWalkthrough(result);

    expect(validation.valid).toBe(false);
    expect(validation.missingCapabilities.length).toBeGreaterThan(0);
  });

  it("validates full walkthrough as valid", () => {
    const turn = makeCorrectionTurn("I go.", "I went.");
    const phaseSessions: Partial<Record<JourneyPhaseId, JourneyPhaseSessionData[]>> = {};
    for (const phaseId of JOURNEY_PHASES) {
      phaseSessions[phaseId] = [
        makeSessionData(phaseId, [turn], {
          rubricResults: [makeRubricResult()],
          contractChecks: [makeContractCheck()],
          auditResults: [makeAuditResult()],
          selfAuditResults: [makeSelfAuditResult()],
          evaluationResults: [makeEvaluationResult()],
          teacherDecisions: [makeTeacherDecision()],
          learningGainResult: makeLearningGainResult("moderate_gain"),
        }),
      ];
    }

    const input = createMinimalJourneyInput({ phaseSessions });
    const result = buildFullJourneyWalkthrough(input);
    const validation = validateJourneyWalkthrough(result);

    expect(validation.phaseCount).toBe(8);
    expect(validation.missingPhases).toHaveLength(0);
    expect(validation.allCapabilitiesCovered).toBe(true);
    expect(validation.valid).toBe(true);
  });

  it("validation summary is Vietnamese", () => {
    const input = createMinimalJourneyInput();
    const result = buildFullJourneyWalkthrough(input);
    const validation = validateJourneyWalkthrough(result);

    expect(validation.summaryVi).toBeTruthy();
  });

  it("detects missing phases", () => {
    const input = createMinimalJourneyInput({ phases: ["placement", "first_contact"] });
    const result = buildFullJourneyWalkthrough(input);
    const validation = validateJourneyWalkthrough(result);

    expect(validation.phaseCount).toBe(2);
    expect(validation.missingPhases.length).toBe(6);
    expect(validation.valid).toBe(false);
  });

  it("reports missing capabilities in validation", () => {
    const input = createMinimalJourneyInput({ phases: ["placement"] });
    const result = buildFullJourneyWalkthrough(input);
    const validation = validateJourneyWalkthrough(result);

    expect(validation.missingCapabilities.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 12: Comparison
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — comparison", () => {
  it("compares two walkthroughs", () => {
    const prev = buildFullJourneyWalkthrough(
      createMinimalJourneyInput({ phases: ["placement"] }),
    );
    const curr = buildFullJourneyWalkthrough(
      createMinimalJourneyInput({
        phases: ["placement", "first_contact"],
        phaseSessions: {
          first_contact: [
            makeSessionData("first_contact", [
              makeCorrectionTurn("I go.", "I went."),
            ], {
              rubricResults: [makeRubricResult()],
              contractChecks: [makeContractCheck()],
            }),
          ],
        },
      }),
    );

    const comparison = compareJourneyWalkthroughs(prev, curr);

    expect(comparison.previousId).toBe(prev.journeyId);
    expect(comparison.currentId).toBe(curr.journeyId);
    expect(comparison.scoreDelta).toBeGreaterThan(0);
    expect(comparison.trend).toBe("improving");
  });

  it("detects declining trend", () => {
    const curr1 = buildFullJourneyWalkthrough(
      createMinimalJourneyInput({
        phases: ["placement", "first_contact"],
        phaseSessions: {
          first_contact: [
            makeSessionData("first_contact", [
              makeCorrectionTurn("I go.", "I went."),
            ], {
              rubricResults: [makeRubricResult()],
              contractChecks: [makeContractCheck()],
              auditResults: [makeAuditResult()],
              selfAuditResults: [makeSelfAuditResult()],
            }),
          ],
        },
      }),
    );
    const curr2 = buildFullJourneyWalkthrough(
      createMinimalJourneyInput({ phases: ["placement"] }),
    );

    const comparison = compareJourneyWalkthroughs(curr1, curr2);
    expect(comparison.scoreDelta).toBeLessThan(0);
    expect(comparison.trend).toBe("declining");
  });

  it("detects stable trend with small delta", () => {
    const walkthrough1 = buildFullJourneyWalkthrough(
      createMinimalJourneyInput({ phases: ["placement"] }),
    );
    const walkthrough2 = buildFullJourneyWalkthrough(
      createMinimalJourneyInput({ phases: ["placement"] }),
    );

    const comparison = compareJourneyWalkthroughs(walkthrough1, walkthrough2);
    expect(comparison.trend).toBe("stable");
    expect(comparison.scoreDelta).toBe(0);
  });

  it("comparison produces Vietnamese summary", () => {
    const prev = buildFullJourneyWalkthrough(
      createMinimalJourneyInput({ phases: ["placement"] }),
    );
    const curr = buildFullJourneyWalkthrough(
      createMinimalJourneyInput({
        phases: ["placement", "first_contact"],
        phaseSessions: {
          first_contact: [
            makeSessionData("first_contact", [
              makeCorrectionTurn("I go.", "I went."),
            ], {
              rubricResults: [makeRubricResult()],
              contractChecks: [makeContractCheck()],
            }),
          ],
        },
      }),
    );

    const comparison = compareJourneyWalkthroughs(prev, curr);
    expect(comparison.comparisonVi).toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 13: Convenience Helpers
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — convenience helpers", () => {
  it("isJourneyProven returns true for proven walks", () => {
    const turn = makeCorrectionTurn("I go.", "I went.");
    const phaseSessions: Partial<Record<JourneyPhaseId, JourneyPhaseSessionData[]>> = {};
    for (const phaseId of JOURNEY_PHASES) {
      phaseSessions[phaseId] = [
        makeSessionData(phaseId, [turn, makeCorrectionTurn("he go.", "he goes.")], {
          rubricResults: [makeRubricResult(), makeRubricResult()],
          contractChecks: [makeContractCheck(), makeContractCheck()],
          auditResults: [makeAuditResult(), makeAuditResult()],
          selfAuditResults: [makeSelfAuditResult(), makeSelfAuditResult()],
          evaluationResults: [makeEvaluationResult(), makeEvaluationResult()],
          teacherDecisions: [makeTeacherDecision(), makeTeacherDecision()],
          learningGainResult: makeLearningGainResult("significant_gain"),
        }),
      ];
    }

    const input = createMinimalJourneyInput({ phaseSessions });
    const result = buildFullJourneyWalkthrough(input);

    expect(isJourneyProven(result)).toBe(true);
  });

  it("isJourneyProven returns false for empty", () => {
    const result = buildFullJourneyWalkthrough(createMinimalJourneyInput());
    expect(isJourneyProven(result)).toBe(false);
  });

  it("isJourneyAdequate returns true for proven", () => {
    const turn = makeCorrectionTurn("I go.", "I went.");
    const phaseSessions: Partial<Record<JourneyPhaseId, JourneyPhaseSessionData[]>> = {};
    for (const phaseId of JOURNEY_PHASES) {
      phaseSessions[phaseId] = [
        makeSessionData(phaseId, [turn, turn], {
          rubricResults: [makeRubricResult(), makeRubricResult()],
          contractChecks: [makeContractCheck(), makeContractCheck()],
          auditResults: [makeAuditResult(), makeAuditResult()],
          selfAuditResults: [makeSelfAuditResult(), makeSelfAuditResult()],
          evaluationResults: [makeEvaluationResult(), makeEvaluationResult()],
          teacherDecisions: [makeTeacherDecision(), makeTeacherDecision()],
          learningGainResult: makeLearningGainResult("significant_gain"),
        }),
      ];
    }

    const input = createMinimalJourneyInput({ phaseSessions });
    const result = buildFullJourneyWalkthrough(input);
    expect(isJourneyAdequate(result)).toBe(true);
  });

  it("isJourneyAdequate returns false for failed", () => {
    const result = buildFullJourneyWalkthrough(createMinimalJourneyInput());
    expect(isJourneyAdequate(result)).toBe(false);
  });

  it("getJourneyCompactVi produces one-line output", () => {
    const result = buildFullJourneyWalkthrough(createMinimalJourneyInput());
    const compact = getJourneyCompactVi(result);

    expect(compact).not.toContain("\n");
    expect(compact).toContain("learner-test-001");
    expect(compact).toContain("/100");
  });

  it("getCapabilityCoverageRatio is low for empty", () => {
    const result = buildFullJourneyWalkthrough(createMinimalJourneyInput());
    const ratio = getCapabilityCoverageRatio(result, "diagnose");
    // Placement phase gives baseline diagnose, so ratio is small but non-zero
    expect(ratio).toBeLessThanOrEqual(0.25);
  });

  it("getCapabilityCoverageRatio returns 1 for full coverage", () => {
    const turn = makeCorrectionTurn("I go.", "I went.");
    const phaseSessions: Partial<Record<JourneyPhaseId, JourneyPhaseSessionData[]>> = {};
    for (const phaseId of JOURNEY_PHASES) {
      phaseSessions[phaseId] = [
        makeSessionData(phaseId, [turn, turn], {
          rubricResults: [makeRubricResult(), makeRubricResult()],
          contractChecks: [makeContractCheck(), makeContractCheck()],
          auditResults: [makeAuditResult(), makeAuditResult()],
          selfAuditResults: [makeSelfAuditResult(), makeSelfAuditResult()],
          evaluationResults: [makeEvaluationResult(), makeEvaluationResult()],
          teacherDecisions: [makeTeacherDecision(), makeTeacherDecision()],
          learningGainResult: makeLearningGainResult("significant_gain"),
        }),
      ];
    }

    const input = createMinimalJourneyInput({ phaseSessions });
    const result = buildFullJourneyWalkthrough(input);
    const ratio = getCapabilityCoverageRatio(result, "teach");
    expect(ratio).toBe(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 14: Action Items
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — action items", () => {
  it("action items for failed walkthrough have KHẨN", () => {
    const result = buildFullJourneyWalkthrough(createMinimalJourneyInput());
    const items = getJourneyWalkthroughActionItems(result);

    expect(items.some((a) => a.includes("KHẨN"))).toBe(true);
  });

  it("action items for well-populated walkthrough are returned", () => {
    const turn = makeCorrectionTurn("I go.", "I went.");
    const phaseSessions: Partial<Record<JourneyPhaseId, JourneyPhaseSessionData[]>> = {};
    for (const phaseId of JOURNEY_PHASES) {
      phaseSessions[phaseId] = [
        makeSessionData(phaseId, [turn, makeCorrectionTurn("he go.", "he goes.")], {
          rubricResults: [makeRubricResult(), makeRubricResult()],
          contractChecks: [makeContractCheck(), makeContractCheck()],
          auditResults: [makeAuditResult(), makeAuditResult()],
          selfAuditResults: [makeSelfAuditResult(), makeSelfAuditResult()],
          evaluationResults: [makeEvaluationResult(), makeEvaluationResult()],
          teacherDecisions: [makeTeacherDecision(), makeTeacherDecision()],
          learningGainResult: makeLearningGainResult("significant_gain"),
        }),
      ];
    }

    const input = createMinimalJourneyInput({ phaseSessions });
    const result = buildFullJourneyWalkthrough(input);
    const items = getJourneyWalkthroughActionItems(result);

    // Items should be an array (may be empty for perfect runs)
    expect(Array.isArray(items)).toBe(true);
  });

  it("action items list failed phases", () => {
    const turn = makeCorrectionTurn("I go.", "I went.");
    const phaseSessions: Partial<Record<JourneyPhaseId, JourneyPhaseSessionData[]>> = {
      first_contact: [
        makeSessionData("first_contact", [turn], {
          rubricResults: [makeRubricResult()],
          contractChecks: [makeContractCheck()],
        }),
      ],
    };

    const input = createMinimalJourneyInput({ phaseSessions });
    const result = buildFullJourneyWalkthrough(input);
    const items = getJourneyWalkthroughActionItems(result);

    // Should have items about phases that didn't pass
    expect(items.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 15: Walk Journey Phase Incrementally
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — walkJourneyPhase", () => {
  it("walks a single phase", () => {
    const turn = makeCorrectionTurn("I go.", "I went.");
    const sessionData = makeSessionData("first_contact", [turn], {
      rubricResults: [makeRubricResult()],
      contractChecks: [makeContractCheck()],
    });

    const input = createMinimalJourneyInput();
    const phase = walkJourneyPhase("first_contact", 1, [sessionData], input);

    expect(phase.phaseId).toBe("first_contact");
    expect(phase.phaseOrdinal).toBe(1);
    expect(phase.sessionCount).toBe(1);
    expect(phase.turnCount).toBe(1);
    expect(phase.capabilities.diagnose.demonstrated).toBe(true);
    expect(phase.capabilities.teach.demonstrated).toBe(true);
  });

  it("walks placement phase", () => {
    const input = createMinimalJourneyInput();
    const phase = walkJourneyPhase("placement", 1, [], input);

    expect(phase.phaseId).toBe("placement");
    expect(phase.sessionCount).toBe(0);
    // Placement gets baseline diagnose score even without sessions
    expect(phase.capabilities.diagnose.score).toBeGreaterThanOrEqual(1);
  });

  it("walks exit readiness phase", () => {
    const turn = makeCorrectionTurn("I have been studying for 6 months.", "I have been studying for 6 months.");
    const sessionData = makeSessionData("exit_readiness", [turn], {
      rubricResults: [makeRubricResult()],
      contractChecks: [makeContractCheck()],
      auditResults: [makeAuditResult()],
      selfAuditResults: [makeSelfAuditResult()],
      evaluationResults: [makeEvaluationResult()],
      teacherDecisions: [makeTeacherDecision()],
      learningGainResult: makeLearningGainResult("significant_gain"),
    });

    const input = createMinimalJourneyInput();
    const phase = walkJourneyPhase("exit_readiness", 8, [sessionData], input);

    expect(phase.labelVi).toBe("Sẵn sàng tốt nghiệp");
    expect(phase.capabilities.prove.score).toBe(3);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 16: Determinism
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — determinism", () => {
  it("produces identical results for identical input", () => {
    const input = createMinimalJourneyInput({
      phases: ["placement", "first_contact"],
      phaseSessions: {
        placement: [
          makeSessionData("placement", [], {
            rubricResults: [makeRubricResult()],
          }),
        ],
        first_contact: [
          makeSessionData("first_contact", [
            makeCorrectionTurn("I go.", "I went."),
          ], {
            rubricResults: [makeRubricResult()],
            contractChecks: [makeContractCheck()],
          }),
        ],
      },
    });

    const result1 = buildFullJourneyWalkthrough(input);
    const result2 = buildFullJourneyWalkthrough(input);

    // Scores and verdicts should be identical
    expect(result1.verdict).toBe(result2.verdict);
    expect(result1.overallScore).toBe(result2.overallScore);
    expect(result1.progress.totalSessions).toBe(result2.progress.totalSessions);
    expect(result1.phases.length).toBe(result2.phases.length);

    for (let i = 0; i < result1.phases.length; i++) {
      expect(result1.phases[i].phaseScore).toBe(result2.phases[i].phaseScore);
      expect(result1.phases[i].phasePassed).toBe(result2.phases[i].phasePassed);
    }
  });

  it("identical inputs across 10 runs have same verdict", () => {
    const input = createMinimalJourneyInput({
      phases: ["placement"],
      phaseSessions: {
        placement: [
          makeSessionData("placement", [], {
            rubricResults: [makeRubricResult()],
            contractChecks: [makeContractCheck()],
          }),
        ],
      },
    });

    const results: JourneyWalkthroughResult[] = [];
    for (let i = 0; i < 10; i++) {
      results.push(buildFullJourneyWalkthrough(input));
    }

    const firstVerdict = results[0].verdict;
    const firstScore = results[0].overallScore;
    for (const r of results) {
      expect(r.verdict).toBe(firstVerdict);
      expect(r.overallScore).toBe(firstScore);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 17: Weakness Tag Details
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — weakness tag details", () => {
  it("weakness tags have correct structure", () => {
    const turn = makeCorrectionTurn("I go to school.", "I went to school.");
    const sessionData = makeSessionData("first_contact", [turn]);

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    const tag = result.phases[0].weaknessTags.find(
      (t) => t.category === "tense-past",
    );
    expect(tag).toBeDefined();
    expect(tag!.labelVi).toBe("Thiếu thì quá khứ");
    expect(tag!.labelEn).toBe("Past tense omission");
    expect(tag!.count).toBe(1);
    expect(tag!.firstSeenAt).toBeGreaterThan(0);
    expect(tag!.lastSeenAt).toBeGreaterThan(0);
    expect(tag!.exemplarPattern).toContain("→");
  });

  it("duplicate weaknesses are not double-counted in same phase", () => {
    const turn1 = makeCorrectionTurn("I go to school.", "I went to school.");
    const turn2 = makeCorrectionTurn("I go home.", "I went home.");
    const sessionData = makeSessionData("first_contact", [turn1, turn2]);

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    // Same category "tense-past" should appear only once
    const tenseTags = result.phases[0].weaknessTags.filter(
      (t) => t.category === "tense-past",
    );
    expect(tenseTags).toHaveLength(1);
  });

  it("weakness tracking aggregates across phases", () => {
    const turn1 = makeCorrectionTurn("I go.", "I went.");
    const turn2 = makeCorrectionTurn("He are happy.", "He is happy.");

    const input = createMinimalJourneyInput({
      phases: ["first_contact", "pattern_building"],
      phaseSessions: {
        first_contact: [
          makeSessionData("first_contact", [turn1]),
        ],
        pattern_building: [
          makeSessionData("pattern_building", [turn2]),
        ],
      },
    });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.evidence.weaknessTracking.totalIdentified).toBeGreaterThanOrEqual(1);
    expect(result.evidence.weaknessTracking.tags.length).toBeGreaterThanOrEqual(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 18: Journey Evidence Packet
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — evidence packet", () => {
  it("collectJourneyEvidence extracts evidence", () => {
    const input = createMinimalJourneyInput({
      phases: ["placement"],
    });
    const result = buildFullJourneyWalkthrough(input);
    const evidence = collectJourneyEvidence(result);

    expect(evidence).toBe(result.evidence);
    expect(evidence.capabilityCoverage.diagnose).toBeDefined();
  });

  it("evidence timeline tracks capability progression", () => {
    const turn = makeCorrectionTurn("I go.", "I went.");
    const phaseSessions: Partial<Record<JourneyPhaseId, JourneyPhaseSessionData[]>> = {};
    for (const phaseId of JOURNEY_PHASES) {
      phaseSessions[phaseId] = [
        makeSessionData(phaseId, [turn], {
          rubricResults: [makeRubricResult()],
          contractChecks: [makeContractCheck()],
        }),
      ];
    }

    const input = createMinimalJourneyInput({ phaseSessions });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.evidence.timeline).toHaveLength(8);
    // Later phases should have more capabilities shown
    const lastEntry = result.evidence.timeline[7];
    expect(lastEntry.capabilitiesShown.length).toBeGreaterThanOrEqual(
      result.evidence.timeline[0].capabilitiesShown.length,
    );
  });

  it("evidence total items matches demonstrated capabilities", () => {
    const turn = makeCorrectionTurn("I go.", "I went.");
    const phaseSessions: Partial<Record<JourneyPhaseId, JourneyPhaseSessionData[]>> = {};
    for (const phaseId of JOURNEY_PHASES) {
      phaseSessions[phaseId] = [
        makeSessionData(phaseId, [turn, makeCorrectionTurn("he go.", "he goes.")], {
          rubricResults: [makeRubricResult(), makeRubricResult()],
          contractChecks: [makeContractCheck(), makeContractCheck()],
        }),
      ];
    }

    const input = createMinimalJourneyInput({ phaseSessions });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.evidence.totalEvidenceItems).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 19: Phase Score Computation
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — phase scores", () => {
  it("empty phase has low score", () => {
    const input = createMinimalJourneyInput({ phases: ["mastery_evidence"] });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.phases[0].phaseScore).toBeLessThan(50);
    expect(result.phases[0].phasePassed).toBe(false);
  });

  it("well-populated phase has high score", () => {
    const turn = makeCorrectionTurn("I go.", "I went.");
    const sessionData = makeSessionData("mastery_evidence", [
      turn,
      makeCorrectionTurn("he go.", "he goes."),
      makeConversationTurn("I like books.", "I like books.", "Great!", "What else?"),
    ], {
      rubricResults: [makeRubricResult(), makeRubricResult()],
      contractChecks: [makeContractCheck(), makeContractCheck()],
      auditResults: [makeAuditResult(), makeAuditResult()],
      selfAuditResults: [makeSelfAuditResult(), makeSelfAuditResult()],
      evaluationResults: [makeEvaluationResult(), makeEvaluationResult()],
      teacherDecisions: [makeTeacherDecision(), makeTeacherDecision()],
      learningGainResult: makeLearningGainResult("significant_gain"),
    });

    const input = createMinimalJourneyInput({
      phases: ["mastery_evidence"],
      phaseSessions: { mastery_evidence: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.phases[0].phaseScore).toBeGreaterThanOrEqual(70);
    expect(result.phases[0].phasePassed).toBe(true);
  });

  it("phase score scales with capability scores", () => {
    // Minimal: just turns, no extra data
    const minimal = buildFullJourneyWalkthrough(
      createMinimalJourneyInput({
        phases: ["first_contact"],
        phaseSessions: {
          first_contact: [
            makeSessionData("first_contact", [
              makeCorrectionTurn("I go.", "I went."),
            ]),
          ],
        },
      }),
    );

    // Rich: turns + all extras
    const rich = buildFullJourneyWalkthrough(
      createMinimalJourneyInput({
        phases: ["first_contact"],
        phaseSessions: {
          first_contact: [
            makeSessionData("first_contact", [
              makeCorrectionTurn("I go.", "I went."),
              makeCorrectionTurn("he go.", "he goes."),
            ], {
              rubricResults: [makeRubricResult(), makeRubricResult()],
              contractChecks: [makeContractCheck(), makeContractCheck()],
              auditResults: [makeAuditResult(), makeAuditResult()],
              selfAuditResults: [makeSelfAuditResult(), makeSelfAuditResult()],
              evaluationResults: [makeEvaluationResult(), makeEvaluationResult()],
              teacherDecisions: [makeTeacherDecision(), makeTeacherDecision()],
              learningGainResult: makeLearningGainResult("significant_gain"),
            }),
          ],
        },
      }),
    );

    expect(rich.phases[0].phaseScore).toBeGreaterThan(minimal.phases[0].phaseScore);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 20: Journey Progress Shape
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — progress shape", () => {
  it("progress has all required fields", () => {
    const result = buildFullJourneyWalkthrough(createMinimalJourneyInput());

    expect(result.progress).toHaveProperty("cefrLevel");
    expect(result.progress).toHaveProperty("targetCefrLevel");
    expect(result.progress).toHaveProperty("totalSessions");
    expect(result.progress).toHaveProperty("totalTurns");
    expect(result.progress).toHaveProperty("totalCorrections");
    expect(result.progress).toHaveProperty("totalSelfCorrections");
    expect(result.progress).toHaveProperty("totalWeaknessesTagged");
    expect(result.progress).toHaveProperty("totalWeaknessesResolved");
    expect(result.progress).toHaveProperty("cumulativeGainScore");
    expect(result.progress).toHaveProperty("progressVi");
  });

  it("result shape has all required fields", () => {
    const result = buildFullJourneyWalkthrough(createMinimalJourneyInput());

    expect(result).toHaveProperty("journeyId");
    expect(result).toHaveProperty("learnerId");
    expect(result).toHaveProperty("productId");
    expect(result).toHaveProperty("targetLanguage");
    expect(result).toHaveProperty("startTimestamp");
    expect(result).toHaveProperty("endTimestamp");
    expect(result).toHaveProperty("startingCefrLevel");
    expect(result).toHaveProperty("targetCefrLevel");
    expect(result).toHaveProperty("phases");
    expect(result).toHaveProperty("progress");
    expect(result).toHaveProperty("evidence");
    expect(result).toHaveProperty("verdict");
    expect(result).toHaveProperty("overallScore");
    expect(result).toHaveProperty("walkthroughVi");
    expect(result).toHaveProperty("actionItems");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 21: Learning Gain Score Mapping
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — learning gain score mapping", () => {
  it("significant_gain contributes high to trajectory", () => {
    const sessionData = makeSessionData("mastery_evidence", [
      makeCorrectionTurn("I go.", "I went."),
    ], {
      learningGainResult: makeLearningGainResult("significant_gain"),
    });

    const input = createMinimalJourneyInput({
      phases: ["mastery_evidence"],
      phaseSessions: { mastery_evidence: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    const point = result.evidence.gainTrajectory[0];
    expect(point.gainScore).toBe(90);
    expect(point.gainMeasurable).toBe(true);
    expect(point.gainReportable).toBe(true);
  });

  it("moderate_gain maps correctly", () => {
    const sessionData = makeSessionData("mastery_evidence", [
      makeCorrectionTurn("I go.", "I went."),
    ], {
      learningGainResult: makeLearningGainResult("moderate_gain"),
    });

    const input = createMinimalJourneyInput({
      phases: ["mastery_evidence"],
      phaseSessions: { mastery_evidence: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    const point = result.evidence.gainTrajectory[0];
    expect(point.gainScore).toBe(70);
    expect(point.gainReportable).toBe(true);
  });

  it("minimal_gain maps correctly", () => {
    const sessionData = makeSessionData("mastery_evidence", [
      makeCorrectionTurn("I go.", "I went."),
    ], {
      learningGainResult: makeLearningGainResult("minimal_gain"),
    });

    const input = createMinimalJourneyInput({
      phases: ["mastery_evidence"],
      phaseSessions: { mastery_evidence: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    const point = result.evidence.gainTrajectory[0];
    expect(point.gainScore).toBe(40);
    expect(point.gainReportable).toBe(false);
  });

  it("no_measurable_gain maps to 10", () => {
    const sessionData = makeSessionData("mastery_evidence", [
      makeCorrectionTurn("I go.", "I went."),
    ], {
      learningGainResult: makeLearningGainResult("no_measurable_gain"),
    });

    const input = createMinimalJourneyInput({
      phases: ["mastery_evidence"],
      phaseSessions: { mastery_evidence: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    const point = result.evidence.gainTrajectory[0];
    expect(point.gainScore).toBe(10);
    expect(point.gainMeasurable).toBe(false);
    expect(point.gainReportable).toBe(false);
  });

  it("null learningGain maps to 0", () => {
    const sessionData = makeSessionData("mastery_evidence", [
      makeCorrectionTurn("I go.", "I went."),
    ], {
      learningGainResult: null,
    });

    const input = createMinimalJourneyInput({
      phases: ["mastery_evidence"],
      phaseSessions: { mastery_evidence: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    const point = result.evidence.gainTrajectory[0];
    expect(point.gainScore).toBe(0);
    expect(point.gainMeasurable).toBe(false);
    expect(point.gainReportable).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 22: Preposition Calque Detection
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — preposition calque detection", () => {
  it("detects in→at morning calque", () => {
    const turn = makeCorrectionTurn("I wake up in the morning.", "I wake up at the morning.");
    const sessionData = makeSessionData("first_contact", [turn]);

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.phases[0].weaknessTags.some(
      (t) => t.category === "preposition-calque",
    )).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Suite 23: Double Negation Detection
// ═══════════════════════════════════════════════════════════════════════════════

describe("journeyOwnerWalkthrough — double negation detection", () => {
  it("detects double negation pattern", () => {
    const turn = makeCorrectionTurn(
      "I no don't like it.",
      "I don't like it.",
    );
    const sessionData = makeSessionData("first_contact", [turn]);

    const input = createMinimalJourneyInput({
      phases: ["first_contact"],
      phaseSessions: { first_contact: [sessionData] },
    });
    const result = buildFullJourneyWalkthrough(input);

    expect(result.phases[0].weaknessTags.some(
      (t) => t.category === "double-negation",
    )).toBe(true);
  });
});
