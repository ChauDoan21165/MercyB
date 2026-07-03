/**
 * Real Product Proof Evaluation Gate — Step 110
 *
 * The CULMINATION gate. Composes EVERY existing tutor evaluation subsystem
 * into a single unified real-product verification pipeline that answers:
 *
 *   "Does Teacher Mercy — as a real product — diagnose, teach, remember,
 *    adapt, self-check, and prove learner improvement like a strong
 *    human teacher?"
 *
 * This gate is NOT another dimension-scorer. It is the product-level gate
 * that runs ALL evaluations end-to-end and produces a SINGLE verdict:
 *
 *   PASS  — The product works for this session. Proven.
 *   FAIL  — Concrete evidence that the product failed. Fix before ship.
 *   NEEDS_REVIEW  — Evidence is ambiguous. Chau must review.
 *
 * Unlike individual gates that validate one dimension, this gate validates
 * the ENTIRE product chain: from learner input → correction → teaching →
 * memory → adaptation → self-audit → improvement measurement.
 *
 * All pure functions — no I/O, no side effects, deterministic.
 * Vietnamese-first in all user-facing labels and summaries.
 *
 * Key APIs:
 *   runRealProductProof(input)       — run EVERY gate, produce unified verdict
 *   getProductProofSummary(proof)     — one-paragraph Vietnamese summary
 *   getProductProofActionItems(proof) — prioritized Chau action items
 *   productProofIsPassing(proof)     — quick boolean check
 *   compareProductProofs(prev, curr) — cross-session proof comparison
 *
 * Integrates with:
 *   - tutorFailureTaxonomy (Step 109) — failure detection
 *   - teacherIntelligenceDashboard (Step 108) — intelligence scoring
 *   - humanLearnerTestingChecklist (Step 107) — learner testing
 *   - chauReviewPacket (Step 106) — session review
 *   - learningGainRubric (Step 105) — gain measurement
 *   - teacherMercyContract — contract validation
 *   - teacherMercyRubric — quality evaluation
 *   - teacherMercySelfAuditGate — self-audit
 *   - teachingDecisionEvaluationGate — decision evaluation
 *   - overclaimGuard — overclaim prevention
 *   - transcriptCorrectionCollector — correction proof
 *   - lessonSequenceGenerator — lesson planning
 *   - correctionEngine — correction quality
 *   - conversationWarmth — warmth and tone
 *   - teacherDecisionEngine — decision quality
 *
 * Single command to run:
 *   npx vitest run src/lib/tutor/__tests__/realProductProofGate.test.ts
 */

import type { TranscriptCorrectionEvent } from "./transcriptCorrectionTypes";
import type { CorrectionEngineResult } from "./correctionEngine";
import type { AuditResult } from "./teacherMercyAuditGate";
import type { RubricResult, RubricDimensionResult } from "./teacherMercyRubric";
import type { ContractRuleCheck } from "./teacherMercyContract";
import type { ChauMemorySnapshot, ChauReviewPacket } from "./chauReviewPacket";
import type { LearningGainResult } from "./learningGainRubric";
import type { HumanLearnerChecklistResult } from "./humanLearnerTestingChecklist";
import type { SelfAuditResult } from "./teacherMercySelfAuditGate";
import type { OverclaimGuardResult } from "./overclaimGuard";
import type { EvaluationResult } from "./teachingDecisionEvaluationGate";
import type { TeacherDecision } from "./teacherDecisionEngine";
import type {
  TeacherIntelligenceDimensionId,
  TeacherIntelligenceDashboard,
} from "./teacherIntelligenceDashboard";
import type { PersonalizedLessonSequence } from "./lessonSequenceGenerator";
import type { TutorTurn } from "./tutorTypes";

import {
  scanSessionForFailures,
  classifySessionFailureProfile,
  computeSessionFailureScore,
  hasCriticalFailures,
  isSessionClean,
  getFailureTaxonomyCatalog,
  type FailureDetectionContext,
  type SessionFailureScan,
} from "./tutorFailureTaxonomy";
import {
  buildChauReviewPacket,
  CHAU_REVIEW_DIMENSION_CATALOG,
} from "./chauReviewPacket";
import {
  assessLearningGain,
  hasMeasurableGain,
  isReportableGain,
  LEARNING_GAIN_DIMENSION_CATALOG,
} from "./learningGainRubric";
import {
  buildHumanLearnerChecklistResult,
  isChecklistReportable,
  checklistCriticalDimensionsPassed,
} from "./humanLearnerTestingChecklist";
import {
  buildTeacherIntelligenceDashboard,
  getDashboardActionItems,
  isDashboardReportable,
  getDimensionTrend,
} from "./teacherIntelligenceDashboard";
import {
  checkTeacherMercyContract,
  checkCorrectionContract,
  checkConversationContract,
  TEACHER_MERCY_CONTRACT_CATALOG,
} from "./teacherMercyContract";
import { evaluateRubric, TEACHER_MERCY_RUBRIC_CATALOG } from "./teacherMercyRubric";

// ─── Product Proof Types ─────────────────────────────────────────────────────

/** Overall product proof verdict */
export type ProductProofVerdict = "PASS" | "FAIL" | "NEEDS_REVIEW";

/** Score band for a product proof dimension */
export type ProductProofBand = "proven" | "adequate" | "weak" | "unproven";

/** Per-dimension result within the product proof */
export interface ProductProofDimensionResult {
  /** Dimension identifier */
  dimensionId: TeacherIntelligenceDimensionId;
  /** Vietnamese label */
  labelVi: string;
  /** English label */
  labelEn: string;
  /** Proof band */
  band: ProductProofBand;
  /** Score 0-3 for this dimension */
  score: number;
  /** Weight of this dimension in overall score (0-1) */
  weight: number;
  /** What was proven — Vietnamese */
  evidenceVi: string[];
  /** What went wrong — Vietnamese */
  shortcomingsVi: string[];
  /** Gate check: did this dimension pass the product bar? */
  passedProductBar: boolean;
  /** Gate check: are there critical failures in this dimension? */
  hasCriticalFailure: boolean;
  /** Sub-gate results this dimension depended on */
  subGateResults: string[];
}

/** A failure that blocks the product from passing */
export interface ProductProofFailure {
  /** Failure ID (from failure taxonomy if applicable) */
  failureId: string;
  /** Which dimension */
  dimensionId: TeacherIntelligenceDimensionId;
  /** Severity */
  severity: "critical" | "major" | "minor";
  /** Vietnamese description */
  descriptionVi: string;
  /** English description */
  descriptionEn: string;
  /** Source gate that detected this */
  sourceGate: string;
}

/** A non-blocking warning */
export interface ProductProofWarning {
  /** Warning code */
  warningCode: string;
  /** Vietnamese description */
  descriptionVi: string;
  /** Source gate */
  sourceGate: string;
}

/** Metadata about the proof run */
export interface ProductProofMetadata {
  /** ISO timestamp of proof run */
  runAt: string;
  /** Session identifier */
  sessionId: string;
  /** Number of gates executed */
  gatesExecuted: number;
  /** Number of gates that passed */
  gatesPassed: number;
  /** Total turns evaluated */
  turnsEvaluated: number;
  /** Total correction events evaluated */
  correctionEventsEvaluated: number;
  /** Whether all required data was present */
  hasAllRequiredData: boolean;
  /** Missing data fields if any */
  missingDataFields: string[];
}

/**
 * Complete input to the real product proof gate.
 * Bundles ALL evaluation-relevant data from a tutoring session.
 */
export interface RealProductProofInput {
  /** Session identifier */
  sessionId: string;
  /** Learner identifier */
  learnerId: string;
  /** ISO session timestamp */
  sessionTimestamp: string;
  /** Tutor turns (conversation + correction + teaching decisions) */
  turns: TutorTurn[];
  /** Correction events captured during session */
  correctionEvents: TranscriptCorrectionEvent[];
  /** Correction engine results for each correction */
  correctionResults: CorrectionEngineResult[];
  /** Rubric evaluation results */
  rubricResults: RubricResult[];
  /** Contract rule checks */
  contractChecks: ContractRuleCheck[];
  /** Audit results from self-audit gates */
  auditResults: AuditResult[];
  /** Self-audit gate results */
  selfAuditResults: SelfAuditResult[];
  /** Overclaim guard results */
  overclaimResults: OverclaimGuardResult[];
  /** Decision evaluation results */
  evaluationResults: EvaluationResult[];
  /** Teacher decisions per turn */
  teacherDecisions: TeacherDecision[];
  /** Memory snapshots (before and after session) */
  memorySnapshots: ChauMemorySnapshot[];
  /** Learning gain result if available */
  learningGainResult: LearningGainResult | null;
  /** Human learner checklist result if available */
  checklistResult: HumanLearnerChecklistResult | null;
  /** Chau review packet if available */
  reviewPacket: ChauReviewPacket | null;
  /** Teacher intelligence dashboard if available */
  dashboard: TeacherIntelligenceDashboard | null;
  /** Lesson sequence if session followed a planned sequence */
  lessonSequence: PersonalizedLessonSequence | null;
}

/**
 * Complete output of the real product proof gate.
 * The single source of truth for "does the product work for this session?"
 */
export interface RealProductProofOutput {
  /** Overall pass/fail/needs_review verdict */
  verdict: ProductProofVerdict;
  /** Whether the product bar is met */
  pass: boolean;
  /** Overall score 0-100 (weighted across all dimensions) */
  overallScore: number;
  /** Per-dimension results */
  dimensionResults: ProductProofDimensionResult[];
  /** Critical failures — product CANNOT ship with these */
  criticalFailures: ProductProofFailure[];
  /** Non-critical failures — product SHOULD fix these */
  failures: ProductProofFailure[];
  /** Warnings — product COULD improve these */
  warnings: ProductProofWarning[];
  /** Vietnamese summary for Chau */
  summaryVi: string;
  /** English summary */
  summaryEn: string;
  /** Action items for Chau (Vietnamese, prioritized) */
  actionItemsVi: string[];
  /** Proof metadata */
  metadata: ProductProofMetadata;
  /** Gate-by-gate score breakdown */
  gateScores: Record<string, { passed: boolean; score: number; noteVi: string }>;
}

// ─── Dimension Config ─────────────────────────────────────────────────────────

const DIMENSION_PROOF_CONFIG: Record<
  TeacherIntelligenceDimensionId,
  { labelVi: string; labelEn: string; weight: number; passThreshold: number }
> = {
  diagnosis:    { labelVi: "Chẩn đoán",      labelEn: "Diagnose",       weight: 0.20, passThreshold: 2.0 },
  teaching:     { labelVi: "Giảng dạy",       labelEn: "Teach",          weight: 0.22, passThreshold: 2.0 },
  memory:       { labelVi: "Ghi nhớ",          labelEn: "Remember",       weight: 0.13, passThreshold: 1.5 },
  adaptation:   { labelVi: "Thích ứng",       labelEn: "Adapt",          weight: 0.15, passThreshold: 1.5 },
  selfCheck:    { labelVi: "Tự kiểm tra",     labelEn: "Self-Check",     weight: 0.18, passThreshold: 2.0 },
  learningGain: { labelVi: "Tiến bộ học viên", labelEn: "Prove Improvement", weight: 0.12, passThreshold: 1.5 },
};

// ─── Product Bar Thresholds ───────────────────────────────────────────────────

/** Overall score must be ≥ this to PASS */
const OVERALL_PASS_THRESHOLD = 70;
/** Overall score below this is an automatic FAIL */
const OVERALL_FAIL_THRESHOLD = 45;
/** Maximum critical failures allowed before auto-FAIL */
const MAX_CRITICAL_FAILURES = 0;
/** Maximum total failures before verdict drops to NEEDS_REVIEW */
const MAX_FAILURES_FOR_PASS = 3;
/** Minimum dimensions that must individually pass */
const MIN_DIMENSIONS_PASSING = 4;

// ─── Failure Taxonomy Helpers ─────────────────────────────────────────────────

/** Build a FailureDetectionContext from the proof input */
function buildFailureContext(input: RealProductProofInput): FailureDetectionContext {
  return {
    events: input.correctionEvents,
    auditResults: input.auditResults,
    rubricResult: input.rubricResults.length > 0 ? input.rubricResults[0] : null,
    memorySnapshot: input.memorySnapshots.length > 0 ? input.memorySnapshots[0] : null,
    sessionId: input.sessionId,
  };
}

/** Map a failure taxonomy ID prefix to a teacher intelligence dimension */
function mapFailureIdToDimension(failureId: string): TeacherIntelligenceDimensionId {
  if (failureId.startsWith("F-DIAG-")) return "diagnosis";
  if (failureId.startsWith("F-TEACH-")) return "teaching";
  if (failureId.startsWith("F-MEM-")) return "memory";
  if (failureId.startsWith("F-ADAPT-")) return "adaptation";
  if (failureId.startsWith("F-SELF-")) return "selfCheck";
  if (failureId.startsWith("F-GAIN-")) return "learningGain";
  return "teaching"; // fallback
}

/** Convert a SessionFailureScan's detected failures into ProductProofFailures */
function taxonomyScanToProofFailures(scan: SessionFailureScan): ProductProofFailure[] {
  return scan.detectedFailures.map((f) => ({
    failureId: f.failureMode.failureId,
    dimensionId: f.failureMode.dimensionId,
    severity: f.failureMode.severity,
    descriptionVi: f.failureMode.descriptionVi,
    descriptionEn: f.failureMode.descriptionVi,
    sourceGate: "failure-taxonomy",
  }));
}

/** Get taxonomy scan failures filtered by dimension prefix */
function getTaxonomyFailuresByPrefix(
  scan: SessionFailureScan,
  prefix: string,
): ProductProofFailure[] {
  return scan.detectedFailures
    .filter((f) => f.failureMode.failureId.startsWith(prefix))
    .map((f) => ({
      failureId: f.failureMode.failureId,
      dimensionId: f.failureMode.dimensionId,
      severity: f.failureMode.severity,
      descriptionVi: f.failureMode.descriptionVi,
      descriptionEn: f.failureMode.descriptionVi,
      sourceGate: "failure-taxonomy",
    }));
}

// ─── Correction Stats Helper ──────────────────────────────────────────────────

/** Compute simple correction stats from events (avoids TranscriptCorrectionSession dependency) */
function computeCorrectionStatsFromEvents(events: TranscriptCorrectionEvent[]): {
  totalEvents: number;
  eventsWithCorrections: number;
  totalCorrections: number;
  helpfulCorrections: number;
} {
  const totalEvents = events.length;
  const eventsWithCorrections = events.filter((e) => e.corrections.length > 0).length;
  const totalCorrections = events.reduce((sum, e) => sum + e.corrections.length, 0);
  const helpfulCorrections = events.filter(
    (e) => e.corrections.some((c) => c.correctedToken && c.correctedToken !== c.originalToken),
  ).length;
  return { totalEvents, eventsWithCorrections, totalCorrections, helpfulCorrections };
}

// ─── Dimension Proofs ─────────────────────────────────────────────────────────

/**
 * Prove the DIAGNOSIS dimension — can Mercy find and classify learner errors?
 *
 * Evidence sources:
 *   - Correction events present (exists, variety, accuracy)
 *   - Failure taxonomy scan (F-DIAG-* failures)
 *   - Contract check R6 (Vietnamese interference diagnosis)
 *   - Multiple error sources detected
 */
function proveDiagnosis(input: RealProductProofInput): ProductProofDimensionResult {
  const config = DIMENSION_PROOF_CONFIG.diagnosis;
  const evidence: string[] = [];
  const shortcomings: string[] = [];
  const subGates: string[] = [];
  let score = 0;

  const ctx = buildFailureContext(input);
  const scan = scanSessionForFailures(ctx);
  const diagFailures = getTaxonomyFailuresByPrefix(scan, "F-DIAG-");

  // Gate 1: Correction events exist
  if (input.correctionEvents.length > 0) {
    score += 0.6;
    evidence.push(`Phát hiện ${input.correctionEvents.length} lỗi cần sửa trong phiên.`);
    subGates.push("correction-events: pass");
  } else {
    shortcomings.push("Không phát hiện lỗi nào — có thể Mercy bỏ sót lỗi.");
    subGates.push("correction-events: fail");
  }

  // Gate 2: Multiple correction sources diagnosed
  const sourceSet = new Set(input.correctionEvents.flatMap((e) =>
    e.corrections.map((c) => c.source),
  ));
  if (sourceSet.size >= 2) {
    score += 0.4;
    evidence.push(`Chẩn đoán đa dạng: ${sourceSet.size} loại lỗi khác nhau.`);
    subGates.push("error-diversity: pass");
  } else if (sourceSet.size === 1) {
    score += 0.2;
    evidence.push(`Chỉ chẩn đoán 1 loại lỗi (${[...sourceSet][0]}).`);
    shortcomings.push("Chỉ phát hiện 1 loại lỗi — có thể bỏ sót các loại lỗi khác.");
    subGates.push("error-diversity: weak");
  } else {
    subGates.push("error-diversity: no-data");
  }

  // Gate 3: Vietlish-specific diagnosis (R6 contract)
  const r6Check = input.contractChecks.find((c) => c.ruleId === "R6_VIETNAMESE_INTERFERENCE");
  if (r6Check && r6Check.passed) {
    score += 0.4;
    evidence.push("Có chẩn đoán lỗi do ảnh hưởng tiếng Việt (R6).");
    subGates.push("r6-vietlish: pass");
  } else if (input.contractChecks.length > 0) {
    shortcomings.push("Thiếu chẩn đoán lỗi do ảnh hưởng tiếng Việt (R6).");
    subGates.push("r6-vietlish: fail-or-missing");
  } else {
    subGates.push("r6-vietlish: no-contract-data");
  }

  // Gate 4: Helpful corrections (actual text changed)
  const stats = computeCorrectionStatsFromEvents(input.correctionEvents);
  if (stats.helpfulCorrections > 0) {
    score += 0.4;
    evidence.push(`${stats.helpfulCorrections}/${stats.totalEvents} lượt có sửa lỗi thực tế.`);
    subGates.push("correction-accuracy: pass");
  } else if (stats.totalEvents > 0) {
    shortcomings.push("Không có sửa lỗi nào thay đổi nội dung thực tế.");
    subGates.push("correction-accuracy: fail");
  } else {
    subGates.push("correction-accuracy: no-events");
  }

  // Gate 5: No critical diagnosis failures
  const criticalDiag = diagFailures.filter((f) => f.severity === "critical");
  if (criticalDiag.length === 0 && diagFailures.length <= 1) {
    score += 0.4;
    evidence.push("Không có lỗi chẩn đoán nghiêm trọng trong failure taxonomy.");
    subGates.push("failure-taxonomy: pass");
  } else if (criticalDiag.length > 0) {
    shortcomings.push(`${criticalDiag.length} lỗi chẩn đoán NGHIÊM TRỌNG.`);
    subGates.push("failure-taxonomy: critical-fail");
  } else if (diagFailures.length > 1) {
    shortcomings.push(`${diagFailures.length} lỗi chẩn đoán được phát hiện.`);
    subGates.push("failure-taxonomy: minor-issues");
  } else {
    subGates.push("failure-taxonomy: clean");
  }

  const band: ProductProofBand =
    score >= 2.5 ? "proven" : score >= 1.8 ? "adequate" : score >= 0.8 ? "weak" : "unproven";
  const passedProductBar = score >= config.passThreshold;

  return {
    dimensionId: "diagnosis",
    labelVi: config.labelVi,
    labelEn: config.labelEn,
    band,
    score: parseFloat(score.toFixed(1)),
    weight: config.weight,
    evidenceVi: evidence,
    shortcomingsVi: shortcomings,
    passedProductBar,
    hasCriticalFailure: criticalDiag.length > 0,
    subGateResults: subGates,
  };
}

/**
 * Prove the TEACHING dimension — did Mercy teach effectively?
 */
function proveTeaching(input: RealProductProofInput): ProductProofDimensionResult {
  const config = DIMENSION_PROOF_CONFIG.teaching;
  const evidence: string[] = [];
  const shortcomings: string[] = [];
  const subGates: string[] = [];
  let score = 0;

  const ctx = buildFailureContext(input);
  const scan = scanSessionForFailures(ctx);
  const teachFailures = getTaxonomyFailuresByPrefix(scan, "F-TEACH-");

  // Gate 1: Contract rule compliance
  const passedContractChecks = input.contractChecks.filter((c) => c.passed).length;
  const totalContractChecks = input.contractChecks.length;
  if (totalContractChecks === 0) {
    subGates.push("contract-compliance: no-data");
  } else if (passedContractChecks === totalContractChecks) {
    score += 0.8;
    evidence.push(`Tất cả ${totalContractChecks} quy tắc giảng dạy được tuân thủ (100%).`);
    subGates.push("contract-compliance: pass");
  } else if (passedContractChecks >= totalContractChecks * 0.7) {
    score += 0.5;
    evidence.push(`${passedContractChecks}/${totalContractChecks} quy tắc được tuân thủ.`);
    shortcomings.push(`${totalContractChecks - passedContractChecks} quy tắc giảng dạy bị vi phạm.`);
    subGates.push("contract-compliance: partial");
  } else if (passedContractChecks > 0) {
    score += 0.2;
    shortcomings.push(`Chỉ ${passedContractChecks}/${totalContractChecks} quy tắc được tuân thủ — dưới ngưỡng.`);
    subGates.push("contract-compliance: fail");
  } else {
    shortcomings.push("Tất cả quy tắc giảng dạy bị vi phạm.");
    subGates.push("contract-compliance: all-failed");
  }

  // Gate 2: No overclaim
  const overclaimFailures = input.overclaimResults.filter(
    (r) => r.decision === "REVISE" || r.decision === "BLOCK",
  );
  if (overclaimFailures.length === 0) {
    score += 0.5;
    evidence.push("Không có overclaim — Mercy không khẳng định sai.");
    subGates.push("overclaim: pass");
  } else {
    shortcomings.push(`${overclaimFailures.length} lần overclaim bị phát hiện.`);
    subGates.push("overclaim: fail");
  }

  // Gate 3: Decision evaluation — safe decisions
  const unsafeDecisions = input.evaluationResults.filter(
    (r) => r.classification === "UNSAFE" || r.classification === "NEEDS_REVIEW",
  );
  if (unsafeDecisions.length === 0 && input.evaluationResults.length > 0) {
    score += 0.4;
    evidence.push("Tất cả quyết định giảng dạy đều an toàn.");
    subGates.push("decision-evaluation: pass");
  } else if (unsafeDecisions.length <= 2) {
    score += 0.2;
    shortcomings.push(`${unsafeDecisions.length} quyết định giảng dạy không an toàn.`);
    subGates.push("decision-evaluation: minor-issues");
  } else if (unsafeDecisions.length > 2) {
    shortcomings.push(`${unsafeDecisions.length} quyết định không an toàn — số lượng lớn.`);
    subGates.push("decision-evaluation: fail");
  } else {
    subGates.push("decision-evaluation: no-data");
  }

  // Gate 4: Correction helpfulness
  const stats = computeCorrectionStatsFromEvents(input.correctionEvents);
  if (stats.helpfulCorrections > 0) {
    score += 0.5;
    evidence.push(`${stats.helpfulCorrections} lần sửa lỗi thực sự hữu ích.`);
    subGates.push("correction-quality: pass");
  } else if (stats.totalEvents > 0) {
    shortcomings.push("Có sửa lỗi nhưng không có sửa lỗi nào thay đổi nội dung.");
    subGates.push("correction-quality: weak");
  } else {
    subGates.push("correction-quality: no-corrections");
  }

  // Gate 5: No critical teaching failures
  const criticalTeach = teachFailures.filter((f) => f.severity === "critical");
  if (criticalTeach.length === 0 && teachFailures.length <= 2) {
    score += 0.4;
    evidence.push("Không có lỗi giảng dạy nghiêm trọng.");
    subGates.push("failure-taxonomy: pass");
  } else if (criticalTeach.length > 0) {
    shortcomings.push(`${criticalTeach.length} lỗi giảng dạy NGHIÊM TRỌNG.`);
    subGates.push("failure-taxonomy: critical-fail");
  } else {
    shortcomings.push(`${teachFailures.length} lỗi giảng dạy được phát hiện.`);
    subGates.push("failure-taxonomy: minor-issues");
  }

  const band: ProductProofBand =
    score >= 2.5 ? "proven" : score >= 1.8 ? "adequate" : score >= 0.8 ? "weak" : "unproven";
  const passedProductBar = score >= config.passThreshold;

  return {
    dimensionId: "teaching",
    labelVi: config.labelVi,
    labelEn: config.labelEn,
    band,
    score: parseFloat(score.toFixed(1)),
    weight: config.weight,
    evidenceVi: evidence,
    shortcomingsVi: shortcomings,
    passedProductBar,
    hasCriticalFailure: criticalTeach.length > 0 || overclaimFailures.length > 3,
    subGateResults: subGates,
  };
}

/**
 * Prove the MEMORY dimension — does Mercy remember the learner?
 */
function proveMemory(input: RealProductProofInput): ProductProofDimensionResult {
  const config = DIMENSION_PROOF_CONFIG.memory;
  const evidence: string[] = [];
  const shortcomings: string[] = [];
  const subGates: string[] = [];
  let score = 0;

  const ctx = buildFailureContext(input);
  const scan = scanSessionForFailures(ctx);
  const memFailures = getTaxonomyFailuresByPrefix(scan, "F-MEM-");

  // Gate 1: Memory snapshot exists and is non-empty
  const latestMemory = input.memorySnapshots.length > 0
    ? input.memorySnapshots[input.memorySnapshots.length - 1]
    : null;
  if (
    latestMemory &&
    (latestMemory.strengths.length > 0 ||
      latestMemory.needsReview.length > 0 ||
      latestMemory.commonMistakePatterns.length > 0)
  ) {
    score += 0.8;
    evidence.push(
      `Ghi nhớ: ${latestMemory.strengths.length} điểm mạnh, ${latestMemory.needsReview.length} điểm cần ôn, ${latestMemory.commonMistakePatterns.length} mẫu lỗi.`,
    );
    subGates.push("memory-content: pass");
  } else if (latestMemory) {
    shortcomings.push("Memory snapshot tồn tại nhưng trống — Mercy không ghi nhớ gì.");
    subGates.push("memory-content: empty");
  } else {
    shortcomings.push("Mercy không có memory snapshot nào về học viên.");
    subGates.push("memory-content: fail");
  }

  // Gate 2: Weakness memory used in contract (R5)
  const r5Check = input.contractChecks.find((c) => c.ruleId === "R5_REMEMBER_WEAKNESS");
  if (r5Check && r5Check.passed) {
    score += 0.5;
    evidence.push("Mercy nhớ và áp dụng điểm yếu của học viên (R5).");
    subGates.push("r5-weakness-memory: pass");
  } else if (input.contractChecks.length > 0) {
    score += 0.2;
    shortcomings.push("Mercy chưa áp dụng ghi nhớ điểm yếu vào giảng dạy (R5).");
    subGates.push("r5-weakness-memory: missing");
  } else {
    subGates.push("r5-weakness-memory: no-contract-data");
  }

  // Gate 3: No memory-related failures from taxonomy
  if (memFailures.length === 0) {
    score += 0.5;
    evidence.push("Không có lỗi ghi nhớ nào trong failure taxonomy.");
    subGates.push("memory-taxonomy: pass");
  } else {
    shortcomings.push(
      `${memFailures.length} lỗi ghi nhớ: ${memFailures.map((f) => f.failureId).join(", ")}.`,
    );
    subGates.push("memory-taxonomy: fail");
  }

  // Gate 4: Memory has recommended next focus
  if (latestMemory && latestMemory.nextRecommendedFocus) {
    score += 0.4;
    evidence.push(`Đề xuất tập trung tiếp theo: "${latestMemory.nextRecommendedFocus}".`);
    subGates.push("memory-focus: pass");
  } else if (latestMemory) {
    shortcomings.push("Mercy ghi nhớ nhưng không đề xuất hướng tập trung tiếp theo.");
    subGates.push("memory-focus: missing");
  } else {
    subGates.push("memory-focus: no-data");
  }

  const band: ProductProofBand =
    score >= 2.0 ? "proven" : score >= 1.5 ? "adequate" : score >= 0.8 ? "weak" : "unproven";
  const passedProductBar = score >= config.passThreshold;

  return {
    dimensionId: "memory",
    labelVi: config.labelVi,
    labelEn: config.labelEn,
    band,
    score: parseFloat(score.toFixed(1)),
    weight: config.weight,
    evidenceVi: evidence,
    shortcomingsVi: shortcomings,
    passedProductBar,
    hasCriticalFailure: memFailures.some((f) => f.severity === "critical"),
    subGateResults: subGates,
  };
}

/**
 * Prove the ADAPTATION dimension — does Mercy adapt to the learner?
 */
function proveAdaptation(input: RealProductProofInput): ProductProofDimensionResult {
  const config = DIMENSION_PROOF_CONFIG.adaptation;
  const evidence: string[] = [];
  const shortcomings: string[] = [];
  const subGates: string[] = [];
  let score = 0;

  // Gate 1: Varied correction modes (not always the same)
  const correctionModes = input.teacherDecisions.map((d) => d.action).filter(Boolean);
  const uniqueModes = new Set(correctionModes);
  if (uniqueModes.size >= 2) {
    score += 0.6;
    evidence.push(
      `${uniqueModes.size} chế độ giảng dạy khác nhau được sử dụng: ${[...uniqueModes].join(", ")}.`,
    );
    subGates.push("mode-variety: pass");
  } else if (uniqueModes.size === 1) {
    score += 0.3;
    evidence.push(`1 chế độ giảng dạy duy nhất (${[...uniqueModes][0]}) — có thể thiếu thích ứng.`);
    shortcomings.push("Chỉ dùng 1 chế độ giảng dạy — Mercy không thích ứng với từng tình huống.");
    subGates.push("mode-variety: weak");
  } else {
    subGates.push("mode-variety: no-data");
  }

  // Gate 2: Strategic silence and self-correction space (R7, R9)
  const r7Check = input.contractChecks.find((c) => c.ruleId === "R7_STRATEGIC_SILENCE");
  const r9Check = input.contractChecks.find((c) => c.ruleId === "R9_SELF_CORRECTION_SPACE");
  const adaptChecksPassed = [r7Check, r9Check].filter((c) => c && c.passed).length;
  if (adaptChecksPassed >= 2) {
    score += 0.5;
    evidence.push("Mercy cho học viên thời gian tự sửa lỗi và khoảng lặng chiến lược (R7, R9).");
    subGates.push("adapt-contracts: pass");
  } else if (adaptChecksPassed === 1) {
    score += 0.3;
    shortcomings.push("Thiếu 1 trong 2 quy tắc: khoảng lặng chiến lược hoặc không gian tự sửa.");
    subGates.push("adapt-contracts: partial");
  } else if (input.contractChecks.length > 0) {
    shortcomings.push("Mercy không cho học viên không gian tự sửa lỗi (R7, R9).");
    subGates.push("adapt-contracts: fail");
  } else {
    subGates.push("adapt-contracts: no-data");
  }

  // Gate 3: Face-saving used (R8)
  const r8Check = input.contractChecks.find((c) => c.ruleId === "R8_FACE_SAVING");
  if (r8Check && r8Check.passed) {
    score += 0.4;
    evidence.push("Mercy áp dụng chiến lược giữ thể diện cho học viên Việt (R8).");
    subGates.push("r8-face-saving: pass");
  } else if (input.contractChecks.length > 0) {
    shortcomings.push(
      "Mercy chưa áp dụng chiến lược giữ thể diện (R8) — quan trọng với học viên Việt.",
    );
    subGates.push("r8-face-saving: missing");
  } else {
    subGates.push("r8-face-saving: no-data");
  }

  // Gate 4: Checklist-based adaptation evidence
  if (input.checklistResult && isChecklistReportable(input.checklistResult)) {
    score += 0.4;
    evidence.push("Checklist học viên cho thấy Mercy thích ứng với persona học viên.");
    subGates.push("checklist-adaptation: pass");
  } else if (input.checklistResult) {
    score += 0.2;
    subGates.push("checklist-adaptation: insufficient-data");
  } else {
    subGates.push("checklist-adaptation: no-data");
  }

  // Gate 5: Adaptive decisions (non-immediate corrections)
  const adaptDecisions = input.teacherDecisions.filter((d) => d.action !== "CORRECT_NOW");
  if (adaptDecisions.length >= 2) {
    score += 0.4;
    evidence.push(`${adaptDecisions.length} quyết định thích ứng (không phải sửa ngay lập tức).`);
    subGates.push("adaptive-decisions: pass");
  } else if (adaptDecisions.length === 1) {
    score += 0.2;
    subGates.push("adaptive-decisions: minimal");
  } else if (input.teacherDecisions.length > 0) {
    shortcomings.push("Tất cả quyết định đều là sửa ngay — không có thích ứng.");
    subGates.push("adaptive-decisions: fail");
  } else {
    subGates.push("adaptive-decisions: no-data");
  }

  const band: ProductProofBand =
    score >= 2.0 ? "proven" : score >= 1.5 ? "adequate" : score >= 0.8 ? "weak" : "unproven";
  const passedProductBar = score >= config.passThreshold;

  return {
    dimensionId: "adaptation",
    labelVi: config.labelVi,
    labelEn: config.labelEn,
    band,
    score: parseFloat(score.toFixed(1)),
    weight: config.weight,
    evidenceVi: evidence,
    shortcomingsVi: shortcomings,
    passedProductBar,
    hasCriticalFailure: adaptChecksPassed === 0 && input.turns.length > 3,
    subGateResults: subGates,
  };
}

/**
 * Prove the SELF-CHECK dimension — does Mercy validate its own decisions?
 */
function proveSelfCheck(input: RealProductProofInput): ProductProofDimensionResult {
  const config = DIMENSION_PROOF_CONFIG.selfCheck;
  const evidence: string[] = [];
  const shortcomings: string[] = [];
  const subGates: string[] = [];
  let score = 0;

  const ctx = buildFailureContext(input);
  const scan = scanSessionForFailures(ctx);
  const selfFailures = getTaxonomyFailuresByPrefix(scan, "F-SELF-");

  // Gate 1: Self-audit results exist
  if (input.selfAuditResults.length > 0) {
    score += 0.8;
    evidence.push(
      `${input.selfAuditResults.length} lần tự kiểm tra quyết định trước khi hiển thị.`,
    );
    subGates.push("self-audit-exists: pass");
  } else {
    shortcomings.push("Mercy không tự kiểm tra quyết định nào trước khi hiển thị.");
    subGates.push("self-audit-exists: fail");
  }

  // Gate 2: Self-audit results are safe
  const blockedCount = input.selfAuditResults.filter(
    (r) => r.decision === "BLOCK" || r.decision === "REVISE",
  ).length;
  const showCount = input.selfAuditResults.filter(
    (r) => r.decision === "SHOW" || r.decision === "SHOW_WITH_CAUTION",
  ).length;
  if (blockedCount === 0 && showCount > 0) {
    score += 0.5;
    evidence.push(`Tất cả ${showCount} lần tự kiểm tra đều an toàn để hiển thị.`);
    subGates.push("self-audit-safety: pass");
  } else if (blockedCount <= 1) {
    score += 0.3;
    evidence.push(`${showCount} an toàn, ${blockedCount} bị chặn — Mercy tự bảo vệ đúng lúc.`);
    subGates.push("self-audit-safety: acceptable");
  } else {
    shortcomings.push(`${blockedCount} lần tự kiểm tra phát hiện vấn đề — quá nhiều.`);
    subGates.push("self-audit-safety: high-block-rate");
  }

  // Gate 3: Audit results exist and are safe
  if (input.auditResults.length > 0) {
    const safeAudits = input.auditResults.filter((a) => a.safe === true);
    if (safeAudits.length === input.auditResults.length) {
      score += 0.4;
      evidence.push(`${input.auditResults.length} lần audit — tất cả đều an toàn.`);
      subGates.push("audit-gate: pass");
    } else {
      score += 0.2;
      shortcomings.push("Có audit nhưng phát hiện vấn đề an toàn.");
      subGates.push("audit-gate: issues-found");
    }
  } else if (input.turns.length > 0) {
    shortcomings.push("Không có audit nào được thực hiện.");
    subGates.push("audit-gate: no-audits");
  } else {
    subGates.push("audit-gate: no-turns");
  }

  // Gate 4: No self-check failures in taxonomy
  if (selfFailures.length === 0) {
    score += 0.4;
    evidence.push("Không có lỗi tự kiểm tra nào trong failure taxonomy.");
    subGates.push("self-taxonomy: pass");
  } else {
    shortcomings.push(
      `${selfFailures.length} lỗi tự kiểm tra: ${selfFailures.map((f) => f.failureId).join(", ")}.`,
    );
    subGates.push("self-taxonomy: fail");
  }

  const band: ProductProofBand =
    score >= 2.0 ? "proven" : score >= 1.5 ? "adequate" : score >= 0.8 ? "weak" : "unproven";
  const passedProductBar = score >= config.passThreshold;

  return {
    dimensionId: "selfCheck",
    labelVi: config.labelVi,
    labelEn: config.labelEn,
    band,
    score: parseFloat(score.toFixed(1)),
    weight: config.weight,
    evidenceVi: evidence,
    shortcomingsVi: shortcomings,
    passedProductBar,
    hasCriticalFailure: blockedCount > 3 || selfFailures.some((f) => f.severity === "critical"),
    subGateResults: subGates,
  };
}

/**
 * Prove the LEARNING GAIN dimension — can we measure learner improvement?
 */
function proveLearningGain(input: RealProductProofInput): ProductProofDimensionResult {
  const config = DIMENSION_PROOF_CONFIG.learningGain;
  const evidence: string[] = [];
  const shortcomings: string[] = [];
  const subGates: string[] = [];
  let score = 0;

  const ctx = buildFailureContext(input);
  const scan = scanSessionForFailures(ctx);
  const gainFailures = getTaxonomyFailuresByPrefix(scan, "F-GAIN-");

  // Gate 1: Learning gain result exists and is measurable
  if (input.learningGainResult && isReportableGain(input.learningGainResult)) {
    score += 0.8;
    const dimsWithScores = input.learningGainResult.dimensions || [];
    const dimsPassed = dimsWithScores.filter(
      (d) => d.score >= 2,
    ).length;
    evidence.push(
      `Đo lường tiến bộ: ${dimsPassed}/${dimsWithScores.length} chiều đạt yêu cầu. ${input.learningGainResult.classification || ""}.`,
    );
    subGates.push("gain-measurement: pass");
  } else if (input.learningGainResult && hasMeasurableGain(input.learningGainResult)) {
    score += 0.5;
    evidence.push("Có đo lường tiến bộ cơ bản.");
    shortcomings.push("Tiến bộ có thể đo nhưng chưa đủ dữ liệu để báo cáo đầy đủ.");
    subGates.push("gain-measurement: partial");
  } else if (input.learningGainResult) {
    score += 0.2;
    shortcomings.push("Có dữ liệu gain nhưng chưa đủ để đo lường.");
    subGates.push("gain-measurement: insufficient");
  } else {
    shortcomings.push("Không có dữ liệu đo lường tiến bộ học viên.");
    subGates.push("gain-measurement: no-data");
  }

  // Gate 2: Session-level improvement visible in correction data
  if (input.correctionEvents.length >= 4) {
    const mid = Math.floor(input.correctionEvents.length / 2);
    const firstHalf = input.correctionEvents.slice(0, mid);
    const secondHalf = input.correctionEvents.slice(mid);
    const firstStats = computeCorrectionStatsFromEvents(firstHalf);
    const secondStats = computeCorrectionStatsFromEvents(secondHalf);
    if (secondStats.helpfulCorrections < firstStats.helpfulCorrections) {
      score += 0.5;
      evidence.push(
        `Số lỗi cần sửa giảm từ ${firstStats.helpfulCorrections} (nửa đầu) xuống ${secondStats.helpfulCorrections} (nửa sau) — xu hướng tốt.`,
      );
      subGates.push("error-trend: improving");
    } else if (secondStats.helpfulCorrections === firstStats.helpfulCorrections) {
      score += 0.3;
      evidence.push("Số lỗi ổn định trong suốt phiên.");
      subGates.push("error-trend: stable");
    } else {
      shortcomings.push(
        `Số lỗi tăng từ ${firstStats.helpfulCorrections} lên ${secondStats.helpfulCorrections} — xu hướng xấu.`,
      );
      subGates.push("error-trend: worsening");
    }
  } else if (input.correctionEvents.length > 0) {
    score += 0.2;
    shortcomings.push("Chưa đủ dữ liệu để phân tích xu hướng lỗi (cần ≥4 events).");
    subGates.push("error-trend: insufficient-data");
  } else {
    subGates.push("error-trend: no-corrections");
  }

  // Gate 3: Checklist shows improvement
  if (input.checklistResult && checklistCriticalDimensionsPassed(input.checklistResult)) {
    score += 0.4;
    evidence.push("Checklist học viên: tất cả chiều quan trọng đều đạt.");
    subGates.push("checklist-gain: pass");
  } else if (input.checklistResult && isChecklistReportable(input.checklistResult)) {
    score += 0.2;
    evidence.push("Checklist học viên có thể báo cáo.");
    subGates.push("checklist-gain: reportable");
  } else {
    subGates.push("checklist-gain: no-data");
  }

  // Gate 4: No learning gain failures in taxonomy
  if (gainFailures.length === 0) {
    score += 0.3;
    evidence.push("Không có lỗi tiến bộ nào trong failure taxonomy.");
    subGates.push("gain-taxonomy: pass");
  } else {
    shortcomings.push(
      `${gainFailures.length} lỗi tiến bộ: ${gainFailures.map((f) => f.failureId).join(", ")}.`,
    );
    subGates.push("gain-taxonomy: fail");
  }

  const band: ProductProofBand =
    score >= 2.0 ? "proven" : score >= 1.5 ? "adequate" : score >= 0.8 ? "weak" : "unproven";
  const passedProductBar = score >= config.passThreshold;

  return {
    dimensionId: "learningGain",
    labelVi: config.labelVi,
    labelEn: config.labelEn,
    band,
    score: parseFloat(score.toFixed(1)),
    weight: config.weight,
    evidenceVi: evidence,
    shortcomingsVi: shortcomings,
    passedProductBar,
    hasCriticalFailure: gainFailures.some((f) => f.severity === "critical"),
    subGateResults: subGates,
  };
}

// ─── Unified Product Proof Orchestrator ──────────────────────────────────────

/**
 * Run the COMPLETE real product proof evaluation gate.
 *
 * This orchestrates ALL six dimension proofs, collects failures from
 * the failure taxonomy, validates against all existing gates, and
 * produces a single unified verdict: PASS, FAIL, or NEEDS_REVIEW.
 *
 * This is the single function Chau calls to answer:
 *   "Does the product work for this session?"
 */
export function runRealProductProof(input: RealProductProofInput): RealProductProofOutput {
  const startTime = new Date().toISOString();

  // ─── Step 1: Run all six dimension proofs ───────────────────────────────
  const dimensionResults: ProductProofDimensionResult[] = [
    proveDiagnosis(input),
    proveTeaching(input),
    proveMemory(input),
    proveAdaptation(input),
    proveSelfCheck(input),
    proveLearningGain(input),
  ];

  // ─── Step 2: Collect failures from taxonomy ──────────────────────────────
  const ctx = buildFailureContext(input);
  const scan = scanSessionForFailures(ctx);
  const productFailures: ProductProofFailure[] = taxonomyScanToProofFailures(scan);

  // Add dimension-level failures from shortcomings
  for (const dim of dimensionResults) {
    for (const shortcoming of dim.shortcomingsVi) {
      productFailures.push({
        failureId: `PROOF-${dim.dimensionId}-shortcoming`,
        dimensionId: dim.dimensionId,
        severity: dim.hasCriticalFailure ? "major" : "minor",
        descriptionVi: shortcoming,
        descriptionEn: shortcoming,
        sourceGate: `dimension-proof-${dim.dimensionId}`,
      });
    }
  }

  const criticalFailures = productFailures.filter(
    (f) => f.severity === "critical",
  );

  // ─── Step 3: Collect warnings ────────────────────────────────────────────
  const warnings: ProductProofWarning[] = [];

  // Warn if any required data is missing
  const missingFields: string[] = [];
  if (input.correctionEvents.length === 0) missingFields.push("correctionEvents");
  if (input.contractChecks.length === 0) missingFields.push("contractChecks");
  if (input.memorySnapshots.length === 0) missingFields.push("memorySnapshots");
  if (!input.learningGainResult) missingFields.push("learningGainResult");
  if (!input.checklistResult) missingFields.push("checklistResult");
  if (input.auditResults.length === 0) missingFields.push("auditResults");
  if (input.selfAuditResults.length === 0) missingFields.push("selfAuditResults");
  if (input.turns.length === 0) missingFields.push("turns");

  for (const field of missingFields) {
    warnings.push({
      warningCode: `MISSING_${field.toUpperCase()}`,
      descriptionVi: `Thiếu dữ liệu: ${field}. Kết quả proof có thể không đầy đủ.`,
      sourceGate: "data-completeness",
    });
  }

  // Warn if any dimension is unproven
  for (const dim of dimensionResults) {
    if (dim.band === "unproven") {
      warnings.push({
        warningCode: `UNPROVEN_${dim.dimensionId.toUpperCase()}`,
        descriptionVi: `Chiều "${dim.labelVi}" chưa được chứng minh (điểm: ${dim.score}/3).`,
        sourceGate: "dimension-proof",
      });
    }
  }

  // ─── Step 4: Compute overall score ───────────────────────────────────────
  let overallScore = 0;
  let totalWeight = 0;
  for (const dim of dimensionResults) {
    overallScore += (dim.score / 3) * 100 * dim.weight;
    totalWeight += dim.weight;
  }
  if (totalWeight > 0) {
    overallScore = overallScore / totalWeight;
  }
  overallScore = Math.round(overallScore);

  // ─── Step 5: Determine verdict ───────────────────────────────────────────
  const dimensionsPassing = dimensionResults.filter((d) => d.passedProductBar).length;

  let verdict: ProductProofVerdict;
  if (criticalFailures.length > MAX_CRITICAL_FAILURES) {
    verdict = "FAIL";
  } else if (overallScore < OVERALL_FAIL_THRESHOLD) {
    verdict = "FAIL";
  } else if (dimensionsPassing < MIN_DIMENSIONS_PASSING) {
    verdict = "FAIL";
  } else if (overallScore >= OVERALL_PASS_THRESHOLD) {
    if (productFailures.length <= MAX_FAILURES_FOR_PASS) {
      verdict = "PASS";
    } else {
      verdict = "NEEDS_REVIEW";
    }
  } else {
    verdict = "NEEDS_REVIEW";
  }

  // ─── Step 6: Build gate scores ───────────────────────────────────────────
  const gateScores: Record<string, { passed: boolean; score: number; noteVi: string }> =
    {};
  for (const dim of dimensionResults) {
    gateScores[dim.dimensionId] = {
      passed: dim.passedProductBar,
      score: dim.score,
      noteVi:
        dim.band === "proven"
          ? "Đã chứng minh"
          : dim.band === "adequate"
            ? "Đạt yêu cầu"
            : dim.band === "weak"
              ? "Còn yếu"
              : "Chưa chứng minh được",
    };
  }

  // ─── Step 7: Build summaries ─────────────────────────────────────────────
  const provenDims = dimensionResults.filter(
    (d) => d.band === "proven" || d.band === "adequate",
  );
  const weakDims = dimensionResults.filter(
    (d) => d.band === "weak" || d.band === "unproven",
  );

  const summaryVi = buildVietnameseSummary(
    verdict,
    overallScore,
    provenDims,
    weakDims,
    criticalFailures,
  );
  const summaryEn = buildEnglishSummary(
    verdict,
    overallScore,
    provenDims,
    weakDims,
    criticalFailures,
  );

  // ─── Step 8: Build action items ──────────────────────────────────────────
  const actionItemsVi: string[] = [];

  if (verdict === "FAIL") {
    actionItemsVi.push(
      "[KHẨN] Sản phẩm KHÔNG ĐẠT — xem xét các lỗi nghiêm trọng bên dưới trước khi tiếp tục.",
    );
  } else if (verdict === "NEEDS_REVIEW") {
    actionItemsVi.push(
      "[CẦN XEM] Sản phẩm cần Chau xem xét — không đủ tự tin để tự động PASS.",
    );
  }

  for (const dim of dimensionResults) {
    if (!dim.passedProductBar) {
      actionItemsVi.push(
        `[${dim.labelVi}] Cần cải thiện (điểm: ${dim.score}/3). ${dim.shortcomingsVi.slice(0, 2).join(" ")}`,
      );
    }
  }

  for (const cf of criticalFailures.slice(0, 5)) {
    actionItemsVi.push(`[${cf.severity.toUpperCase()}] ${cf.descriptionVi}`);
  }

  if (missingFields.length > 0) {
    actionItemsVi.push(
      `[DỮ LIỆU] Thiếu ${missingFields.length} trường dữ liệu: ${missingFields.join(", ")}.`,
    );
  }

  // ─── Step 9: Build metadata ──────────────────────────────────────────────
  const metadata: ProductProofMetadata = {
    runAt: startTime,
    sessionId: input.sessionId,
    gatesExecuted: 6,
    gatesPassed: dimensionsPassing,
    turnsEvaluated: input.turns.length,
    correctionEventsEvaluated: input.correctionEvents.length,
    hasAllRequiredData: missingFields.length === 0,
    missingDataFields: missingFields,
  };

  return {
    verdict,
    pass: verdict === "PASS",
    overallScore,
    dimensionResults,
    criticalFailures,
    failures: productFailures,
    warnings,
    summaryVi,
    summaryEn,
    actionItemsVi,
    metadata,
    gateScores,
  };
}

// ─── Summary Builders ─────────────────────────────────────────────────────────

function buildVietnameseSummary(
  verdict: ProductProofVerdict,
  score: number,
  provenDims: ProductProofDimensionResult[],
  weakDims: ProductProofDimensionResult[],
  criticals: ProductProofFailure[],
): string {
  const verdictLabel =
    verdict === "PASS" ? "ĐẠT" : verdict === "FAIL" ? "KHÔNG ĐẠT" : "CẦN XEM XÉT";

  const parts: string[] = [];
  parts.push(`KẾT QUẢ: ${verdictLabel} (${score}/100).`);

  if (provenDims.length > 0) {
    parts.push(
      `Các chiều đạt yêu cầu: ${provenDims.map((d) => d.labelVi).join(", ")}.`,
    );
  }
  if (weakDims.length > 0) {
    parts.push(
      `Các chiều còn yếu: ${weakDims.map((d) => d.labelVi).join(", ")}.`,
    );
  }
  if (criticals.length > 0) {
    parts.push(`${criticals.length} lỗi nghiêm trọng cần xử lý ngay.`);
  }
  parts.push(
    `Tổng cộng ${provenDims.length + weakDims.length} chiều được đánh giá.`,
  );

  return parts.join(" ");
}

function buildEnglishSummary(
  verdict: ProductProofVerdict,
  score: number,
  provenDims: ProductProofDimensionResult[],
  weakDims: ProductProofDimensionResult[],
  criticals: ProductProofFailure[],
): string {
  const verdictLabel =
    verdict === "PASS" ? "PASS" : verdict === "FAIL" ? "FAIL" : "NEEDS REVIEW";

  const parts: string[] = [];
  parts.push(`RESULT: ${verdictLabel} (${score}/100).`);

  if (provenDims.length > 0) {
    parts.push(
      `Dimensions passing: ${provenDims.map((d) => d.labelEn).join(", ")}.`,
    );
  }
  if (weakDims.length > 0) {
    parts.push(
      `Dimensions weak: ${weakDims.map((d) => d.labelEn).join(", ")}.`,
    );
  }
  if (criticals.length > 0) {
    parts.push(`${criticals.length} critical failures.`);
  }
  parts.push(
    `${provenDims.length + weakDims.length} dimensions evaluated total.`,
  );

  return parts.join(" ");
}

// ─── Public Utility Functions ─────────────────────────────────────────────────

/**
 * Return a one-paragraph Vietnamese summary of the product proof.
 */
export function getProductProofSummary(proof: RealProductProofOutput): string {
  return proof.summaryVi;
}

/**
 * Return prioritized action items for Chau.
 */
export function getProductProofActionItems(
  proof: RealProductProofOutput,
): string[] {
  return proof.actionItemsVi;
}

/**
 * Quick boolean check: did this session pass the product bar?
 */
export function productProofIsPassing(
  proof: RealProductProofOutput,
): boolean {
  return proof.pass;
}

/**
 * Compare two product proofs across sessions to detect improvement or regression.
 */
export function compareProductProofs(
  current: RealProductProofOutput,
  previous: RealProductProofOutput | null,
): {
  scoreDelta: number;
  trend: "improving" | "stable" | "declining" | "first_proof";
  improvedDimensionsVi: string[];
  declinedDimensionsVi: string[];
  summaryVi: string;
} {
  if (!previous) {
    return {
      scoreDelta: 0,
      trend: "first_proof",
      improvedDimensionsVi: [],
      declinedDimensionsVi: [],
      summaryVi:
        "Đây là lần đánh giá đầu tiên — chưa có dữ liệu so sánh.",
    };
  }

  const scoreDelta = current.overallScore - previous.overallScore;
  const improvedDimensionsVi: string[] = [];
  const declinedDimensionsVi: string[] = [];

  for (const dim of current.dimensionResults) {
    const prevDim = previous.dimensionResults.find(
      (d) => d.dimensionId === dim.dimensionId,
    );
    if (prevDim) {
      const dimDelta = dim.score - prevDim.score;
      if (dimDelta >= 0.5) {
        improvedDimensionsVi.push(`${dim.labelVi} (+${dimDelta.toFixed(1)})`);
      } else if (dimDelta <= -0.5) {
        declinedDimensionsVi.push(`${dim.labelVi} (${dimDelta.toFixed(1)})`);
      }
    }
  }

  let trend: "improving" | "stable" | "declining";
  if (scoreDelta >= 8) {
    trend = "improving";
  } else if (scoreDelta <= -8) {
    trend = "declining";
  } else {
    trend = "stable";
  }

  let summaryVi = `Điểm thay đổi: ${scoreDelta >= 0 ? "+" : ""}${scoreDelta}. `;
  if (trend === "improving") {
    summaryVi += "Xu hướng: CẢI THIỆN. ";
  } else if (trend === "declining") {
    summaryVi += "Xu hướng: GIẢM. ";
  } else {
    summaryVi += "Xu hướng: ỔN ĐỊNH. ";
  }
  if (improvedDimensionsVi.length > 0) {
    summaryVi += `Cải thiện: ${improvedDimensionsVi.join(", ")}. `;
  }
  if (declinedDimensionsVi.length > 0) {
    summaryVi += `Giảm: ${declinedDimensionsVi.join(", ")}. `;
  }

  return {
    scoreDelta,
    trend,
    improvedDimensionsVi,
    declinedDimensionsVi,
    summaryVi,
  };
}

/**
 * Build a full product proof from structured session params — the most
 * common entry point for real product sessions.
 */
export function buildProductProofFromSession(params: {
  sessionId: string;
  learnerId: string;
  sessionTimestamp: string;
  turns: TutorTurn[];
  correctionEvents: TranscriptCorrectionEvent[];
  correctionResults: CorrectionEngineResult[];
  rubricResults: RubricResult[];
  contractChecks: ContractRuleCheck[];
  auditResults: AuditResult[];
  selfAuditResults: SelfAuditResult[];
  overclaimResults: OverclaimGuardResult[];
  evaluationResults: EvaluationResult[];
  teacherDecisions: TeacherDecision[];
  memorySnapshots: ChauMemorySnapshot[];
  learningGainResult: LearningGainResult | null;
  checklistResult: HumanLearnerChecklistResult | null;
  reviewPacket: ChauReviewPacket | null;
  dashboard: TeacherIntelligenceDashboard | null;
  lessonSequence: PersonalizedLessonSequence | null;
}): RealProductProofOutput {
  return runRealProductProof({
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
}

/**
 * Create a minimal empty proof input for quick smoke testing.
 */
export function createMinimalProofInput(
  sessionId: string = "test-session",
): RealProductProofInput {
  return {
    sessionId,
    learnerId: "test-learner",
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
  };
}

/**
 * Get the dimension proof configurations for display purposes.
 */
export function getProductProofDimensionConfig(): Record<
  TeacherIntelligenceDimensionId,
  { labelVi: string; labelEn: string; weight: number; passThreshold: number }
> {
  return { ...DIMENSION_PROOF_CONFIG };
}

/**
 * Catalog of all product proof sub-gates for documentation.
 */
export const PRODUCT_PROOF_GATE_CATALOG: ReadonlyArray<{
  gateId: string;
  dimensionId: TeacherIntelligenceDimensionId;
  labelVi: string;
  descriptionVi: string;
}> = [
  // Diagnosis gates
  {
    gateId: "correction-events",
    dimensionId: "diagnosis",
    labelVi: "Sự kiện sửa lỗi",
    descriptionVi: "Mercy có phát hiện lỗi không?",
  },
  {
    gateId: "error-diversity",
    dimensionId: "diagnosis",
    labelVi: "Đa dạng lỗi",
    descriptionVi: "Mercy có chẩn đoán nhiều loại lỗi khác nhau không?",
  },
  {
    gateId: "r6-vietlish",
    dimensionId: "diagnosis",
    labelVi: "Chẩn đoán Vietlish",
    descriptionVi:
      "Mercy có chẩn đoán lỗi do ảnh hưởng tiếng Việt không?",
  },
  {
    gateId: "correction-accuracy",
    dimensionId: "diagnosis",
    labelVi: "Độ chính xác sửa lỗi",
    descriptionVi: "Mercy có sửa lỗi thực sự thay đổi nội dung không?",
  },
  // Teaching gates
  {
    gateId: "contract-compliance",
    dimensionId: "teaching",
    labelVi: "Tuân thủ quy tắc",
    descriptionVi: "Mercy có tuân thủ các quy tắc giảng dạy không?",
  },
  {
    gateId: "overclaim",
    dimensionId: "teaching",
    labelVi: "Không overclaim",
    descriptionVi: "Mercy có khẳng định sai kiến thức không?",
  },
  {
    gateId: "decision-evaluation",
    dimensionId: "teaching",
    labelVi: "Quyết định an toàn",
    descriptionVi: "Các quyết định giảng dạy có an toàn không?",
  },
  {
    gateId: "correction-quality",
    dimensionId: "teaching",
    labelVi: "Chất lượng sửa lỗi",
    descriptionVi: "Sửa lỗi có hữu ích cho học viên không?",
  },
  // Memory gates
  {
    gateId: "memory-content",
    dimensionId: "memory",
    labelVi: "Nội dung ghi nhớ",
    descriptionVi: "Mercy có ghi nhớ thông tin về học viên không?",
  },
  {
    gateId: "r5-weakness-memory",
    dimensionId: "memory",
    labelVi: "Ghi nhớ điểm yếu",
    descriptionVi:
      "Mercy có nhớ và áp dụng điểm yếu của học viên không?",
  },
  {
    gateId: "memory-focus",
    dimensionId: "memory",
    labelVi: "Đề xuất tập trung",
    descriptionVi: "Mercy có đề xuất hướng học tiếp theo không?",
  },
  // Adaptation gates
  {
    gateId: "mode-variety",
    dimensionId: "adaptation",
    labelVi: "Đa dạng chế độ",
    descriptionVi: "Mercy có sử dụng nhiều chế độ giảng dạy không?",
  },
  {
    gateId: "adapt-contracts",
    dimensionId: "adaptation",
    labelVi: "Thích ứng quy tắc",
    descriptionVi:
      "Mercy có không gian tự sửa và khoảng lặng không?",
  },
  {
    gateId: "r8-face-saving",
    dimensionId: "adaptation",
    labelVi: "Giữ thể diện",
    descriptionVi:
      "Mercy có áp dụng chiến lược giữ thể diện không?",
  },
  // Self-check gates
  {
    gateId: "self-audit-exists",
    dimensionId: "selfCheck",
    labelVi: "Tự kiểm tra tồn tại",
    descriptionVi:
      "Mercy có tự kiểm tra trước khi hiển thị không?",
  },
  {
    gateId: "self-audit-safety",
    dimensionId: "selfCheck",
    labelVi: "Tự kiểm tra an toàn",
    descriptionVi: "Kết quả tự kiểm tra có an toàn không?",
  },
  {
    gateId: "audit-gate",
    dimensionId: "selfCheck",
    labelVi: "Audit gate",
    descriptionVi: "Có audit nào phát hiện vấn đề không?",
  },
  // Learning gain gates
  {
    gateId: "gain-measurement",
    dimensionId: "learningGain",
    labelVi: "Đo lường tiến bộ",
    descriptionVi: "Có đo lường được tiến bộ học viên không?",
  },
  {
    gateId: "error-trend",
    dimensionId: "learningGain",
    labelVi: "Xu hướng lỗi",
    descriptionVi: "Số lỗi có xu hướng giảm trong phiên không?",
  },
  {
    gateId: "checklist-gain",
    dimensionId: "learningGain",
    labelVi: "Checklist tiến bộ",
    descriptionVi:
      "Checklist học viên có cho thấy tiến bộ không?",
  },
];
