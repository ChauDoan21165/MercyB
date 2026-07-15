/**
 * Teacher Mercy — Self-Audit Gate (Before Showing Answers)
 *
 * S1-S8 gate chain that runs BEFORE a tutor response reaches the learner.
 * Teacher Mercy self-audits her own answer: "Is this response safe, accurate,
 * and pedagogically sound enough to show?"
 *
 * This is DIFFERENT from teacherMercyAuditGate.ts:
 *   - AuditGate runs AFTER the response is shown (non-blocking, fire-and-forget).
 *   - SelfAuditGate runs BEFORE — it DECIDES whether to show, revise, or block.
 *
 * This is DIFFERENT from teachingDecisionEvaluationGate.ts:
 *   - EvaluationGate checks the TEACHING DECISION (action, timing, rationale).
 *   - SelfAuditGate checks the RESPONSE TEXT + cross-references with the decision.
 *
 * Think of it as a human teacher pausing before speaking: "Wait — is what I'm
 * about to say actually helpful? Am I about to give fake praise? Did I
 * acknowledge what they meant? Is this the right level?"
 *
 * S1-S8 Gate Chain (short-circuits on first non-null decision):
 *   S1 — Hard Safety: R3 (no fake praise), R7 (strategic silence), R8 (face saving)
 *   S2 — Decision Safety: V1 (action-input coherence), V3 (timing-action consistency)
 *   S3 — Empty Response: response must be non-empty
 *   S4 — Contract Integrity: full contract check, failedCount >= 3 → REVISE
 *   S5 — Decision Quality: V1-V8 evaluation, UNSAFE → BLOCK, NEEDS_REVIEW → REVISE
 *   S6 — Correction-Text Coherence: correcting action must have correction in response
 *   S7 — Action-Response Alignment: SUPPRESS must not contain explicit correction
 *   S8 — Rubric Minimum: rubric classification "failing" → REVISE
 *
 * Default: SHOW (all gates passed or only minor issues)
 *
 * Design principles:
 *   1. Pure functions — no I/O, no side effects, deterministic.
 *   2. Vietnamese-first — all detail messages in Vietnamese.
 *   3. Short-circuit — first blocking decision wins; no wasted computation.
 *   4. Composable — works with or without a teaching decision from the engine.
 *   5. Non-destructive by default — only curated R8 face-saving substitutions may repair
 *      the deliverable response text before the gate chain continues.
 *
 * Pure functions — no I/O, no side effects, deterministic.
 */

import {
  checkCorrectionContract,
  checkConversationContract,
  checkTeacherMercyContract,
  type ContractCheckResult,
  type ContractLearnerInput,
  type ContractRuleCheck,
  type ContractTutorResponse,
} from "./teacherMercyContract";

import {
  evaluateRubricFocused,
  type RubricResult,
} from "./teacherMercyRubric";

import {
  evaluateTeachingDecision,
  isDecisionSafe,
  type EvaluationResult,
} from "./teachingDecisionEvaluationGate";

import type { TeacherDecision, TeacherDecisionInput } from "./teacherDecisionEngine";

// ─── Self-Audit Types ───────────────────────────────────────────────────────

/**
 * What the self-audit gate decides to do with the response.
 *
 * SHOW              — response passes all checks; safe to show as-is.
 * SHOW_WITH_CAUTION — minor issues found; show but log for monitoring.
 * REVISE            — significant issues found; response should be revised before showing.
 * BLOCK             — hard failures; response must NOT be shown to the learner.
 */
export type SelfAuditDecision = "SHOW" | "SHOW_WITH_CAUTION" | "REVISE" | "BLOCK";

export type SelfAuditRepairOutcome = "none" | "repaired-delivered" | "blocked-unrepairable";

/**
 * The audit mode — which contract subset to check.
 */
export type SelfAuditMode = "correction" | "conversation" | "full";

/**
 * Result of a single self-audit gate check.
 */
export type SelfAuditGateResult = {
  /** Gate identifier (S1-S8). */
  gateId: string;
  /** Vietnamese title for this gate. */
  titleVi: string;
  /** English title for this gate. */
  titleEn: string;
  /** Whether this gate passed (no issues found). */
  passed: boolean;
  /** The decision from this gate, if it fired. null = pass through. */
  decision: SelfAuditDecision | null;
  /** Vietnamese explanation of the finding. */
  detailVi: string;
  /** English explanation for telemetry/logging. */
  detailEn: string;
  /** Machine-readable reason code. */
  reasonCode: string;
};

/**
 * Input for the self-audit gate.
 */
export type SelfAuditInput = {
  /** The learner's raw text. */
  learnerText: string;
  /** The tutor's Vietnamese explanation / response text. */
  explanationVi: string;
  /** The corrected sentence (if this is a correction turn). */
  correctedSentence?: string;
  /** The audit mode — which contract subset to check. */
  mode: SelfAuditMode;
  /** The learner's CEFR level (null if unknown). */
  cefrLevel?: string | null;
  /** Optional: the teaching decision from the decision engine.
   *  When provided, S2 and S5 run. When omitted, they pass through. */
  decision?: TeacherDecision;
  /** Optional: the decision engine input (needed with decision for V1-V8 eval). */
  decisionInput?: TeacherDecisionInput;
};

/**
 * Aggregate result of the self-audit gate chain.
 */
export type SelfAuditResult = {
  /** The final decision: SHOW, SHOW_WITH_CAUTION, REVISE, or BLOCK. */
  decision: SelfAuditDecision;
  /** Whether the response is safe to show (SHOW or SHOW_WITH_CAUTION). */
  canShow: boolean;
  /** Whether the response needs revision before showing. */
  needsRevision: boolean;
  /** Whether the response is blocked (must not show). */
  isBlocked: boolean;
  /** Per-gate results in evaluation order (S1-S8). */
  gates: SelfAuditGateResult[];
  /** Count of gates that passed. */
  passedCount: number;
  /** Count of gates that fired (returned a non-null decision). */
  firedCount: number;
  /** The gate that made the final decision (S1-S8), or null if defaulted. */
  decidingGate: string | null;
  /** Vietnamese summary suitable for display or logging. */
  summaryVi: string;
  /** English summary for telemetry. */
  summaryEn: string;
  /** The contract audit result (null if contract wasn't checked). */
  contractResult: ContractCheckResult | null;
  /** The teaching decision evaluation result (null if decision wasn't provided). */
  evaluationResult: EvaluationResult | null;
  /** Whether a deterministic R8 repair was applied or failed. */
  repairOutcome: SelfAuditRepairOutcome;
  /** The repaired Vietnamese explanation when a curated R8 repair succeeds. */
  repairedExplanationVi: string | null;
  /** The explanation text the caller should deliver. */
  deliverableExplanationVi: string;
};

// ─── Gate IDs ──────────────────────────────────────────────────────────────

const GATE_IDS = {
  S1: "S1_HARD_SAFETY",
  S2: "S2_DECISION_SAFETY",
  S3: "S3_EMPTY_RESPONSE",
  S4: "S4_CONTRACT_INTEGRITY",
  S5: "S5_DECISION_QUALITY",
  S6: "S6_CORRECTION_TEXT_COHERENCE",
  S7: "S7_ACTION_RESPONSE_ALIGNMENT",
  S8: "S8_RUBRIC_MINIMUM",
} as const;

// ─── Hard-Safety Contract Rules ────────────────────────────────────────────

/** Rules whose failure makes a response unsafe to show. */
const HARD_SAFETY_RULES = new Set([
  "R3_NO_FAKE_PRAISE",
  "R7_STRATEGIC_SILENCE",
  "R8_FACE_SAVING",
]);

type FaceSavingRepairEntry = {
  readonly search: string;
  readonly replacement: string;
  readonly pattern: RegExp;
  readonly rationale: string;
};

const FACE_SAVING_REPAIR_MAP: readonly FaceSavingRepairEntry[] = [
  {
    search: "không đúng",
    replacement: "chưa đúng",
    pattern: /(?<![\p{L}\p{N}_])không đúng(?![\p{L}\p{N}_])/giu,
    // Rationale: in correction explanations, this preserves the "needs correction"
    // meaning while softening a final-sounding face threat into a growth-framed
    // phrase. The Unicode boundary guard prevents substring edits inside a larger
    // token or fused phrase.
    rationale: "Softens a correction verdict without changing the grammatical point.",
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Build a ContractLearnerInput from self-audit input fields.
 */
function buildLearnerInput(input: SelfAuditInput): ContractLearnerInput {
  return {
    text: input.learnerText,
    cefrLevel: input.cefrLevel ?? null,
    trackedWeakness: null,
    didSelfCorrect: false,
    l1: "vi",
  };
}

/**
 * Build a ContractTutorResponse from self-audit input fields.
 */
function buildTutorResponse(input: SelfAuditInput): ContractTutorResponse {
  return {
    vi: input.explanationVi,
    correctedSentence: input.correctedSentence,
    correctionCount: input.correctedSentence ? 1 : 0,
  };
}

/**
 * Run the appropriate contract check for the given mode.
 */
function runContractCheck(
  learnerInput: ContractLearnerInput,
  response: ContractTutorResponse,
  mode: SelfAuditMode,
): ContractCheckResult {
  switch (mode) {
    case "correction":
      return checkCorrectionContract(learnerInput, response);
    case "conversation":
      return checkConversationContract(learnerInput, response);
    case "full":
      return checkTeacherMercyContract(learnerInput, response);
  }
}

/**
 * Check whether hard-safety rules all passed.
 */
function checkHardSafety(contractResult: ContractCheckResult): { safe: boolean; failedRules: ContractRuleCheck[] } {
  const failedRules = contractResult.rules.filter(
    (r) => HARD_SAFETY_RULES.has(r.ruleId) && !r.passed,
  );
  return { safe: failedRules.length === 0, failedRules };
}

function hasOnlyRepairableR8HardSafetyFailure(failedRules: ContractRuleCheck[]): boolean {
  return failedRules.length > 0 && failedRules.every((rule) => rule.ruleId === "R8_FACE_SAVING");
}

function applyCuratedFaceSavingRepairs(explanationVi: string): {
  repaired: string;
  applied: readonly string[];
} {
  let repaired = explanationVi;
  const applied: string[] = [];

  for (const entry of FACE_SAVING_REPAIR_MAP) {
    const next = repaired.replace(entry.pattern, entry.replacement);
    if (next !== repaired) {
      repaired = next;
      applied.push(`${entry.search}->${entry.replacement}`);
    }
  }

  return { repaired, applied };
}

function prepareR8Repair(
  input: SelfAuditInput,
  learnerInput: ContractLearnerInput,
  tutorResponse: ContractTutorResponse,
  contractResult: ContractCheckResult,
): {
  input: SelfAuditInput;
  tutorResponse: ContractTutorResponse;
  contractResult: ContractCheckResult;
  repairOutcome: SelfAuditRepairOutcome;
  repairedExplanationVi: string | null;
} {
  const { failedRules } = checkHardSafety(contractResult);
  if (!hasOnlyRepairableR8HardSafetyFailure(failedRules)) {
    return {
      input,
      tutorResponse,
      contractResult,
      repairOutcome: "none",
      repairedExplanationVi: null,
    };
  }

  const { repaired, applied } = applyCuratedFaceSavingRepairs(input.explanationVi);
  if (applied.length === 0 || repaired === input.explanationVi) {
    return {
      input,
      tutorResponse,
      contractResult,
      repairOutcome: "blocked-unrepairable",
      repairedExplanationVi: null,
    };
  }

  const repairedInput: SelfAuditInput = { ...input, explanationVi: repaired };
  const repairedTutorResponse = buildTutorResponse(repairedInput);
  const repairedContractResult = runContractCheck(learnerInput, repairedTutorResponse, repairedInput.mode);
  const repairedR8 = repairedContractResult.rules.find((rule) => rule.ruleId === "R8_FACE_SAVING");

  if (!repairedR8?.passed) {
    return {
      input,
      tutorResponse,
      contractResult,
      repairOutcome: "blocked-unrepairable",
      repairedExplanationVi: null,
    };
  }

  return {
    input: repairedInput,
    tutorResponse: repairedTutorResponse,
    contractResult: repairedContractResult,
    repairOutcome: "repaired-delivered",
    repairedExplanationVi: repaired,
  };
}

// ─── S1 — Hard Safety Gate ────────────────────────────────────────────────

/**
 * S1: Do all hard-safety rules (R3, R7, R8) pass?
 *
 * These are the non-negotiable safety rules. If any fail, the response
 * is unsafe for the learner — block immediately.
 *
 * R3_NO_FAKE_PRAISE  — no "Hoàn hảo!", "Xuất sắc!" for wrong answers
 * R7_STRATEGIC_SILENCE — don't correct when uncertain
 * R8_FACE_SAVING      — preserve learner dignity, no shaming language
 */
function evaluateHardSafety(
  contractResult: ContractCheckResult,
): SelfAuditGateResult {
  const { safe, failedRules } = checkHardSafety(contractResult);

  if (!safe) {
    const ruleNames = failedRules.map((r) => r.titleVi).join(", ");
    return {
      gateId: GATE_IDS.S1,
      titleVi: "An toàn cơ bản",
      titleEn: "Hard safety",
      passed: false,
      decision: "BLOCK",
      detailVi: `Vi phạm quy tắc an toàn: ${ruleNames}. Không được hiển thị cho người học.`,
      detailEn: `Hard-safety violation: ${failedRules.map((r) => r.ruleId).join(", ")}. Response blocked.`,
      reasonCode: "s1_hard_safety_failed",
    };
  }

  return {
    gateId: GATE_IDS.S1,
    titleVi: "An toàn cơ bản",
    titleEn: "Hard safety",
    passed: true,
    decision: null,
    detailVi: "Tất cả quy tắc an toàn cơ bản đều đạt.",
    detailEn: "All hard-safety rules passed.",
    reasonCode: "s1_hard_safety_ok",
  };
}

// ─── S2 — Decision Safety Gate ────────────────────────────────────────────

/**
 * S2: Does the teaching decision pass hard-fail gates (V1, V3)?
 *
 * V1 — Action-input coherence: does the action make sense for the input?
 * V3 — Timing-action consistency: does timingMode match the chosen action?
 *
 * If the decision itself is fundamentally wrong (action doesn't match input,
 * timing doesn't match action), the response should not be shown.
 *
 * Skipped when no teaching decision is provided.
 */
function evaluateDecisionSafety(
  decision: TeacherDecision | undefined,
  decisionInput: TeacherDecisionInput | undefined,
): SelfAuditGateResult {
  if (!decision || !decisionInput) {
    return {
      gateId: GATE_IDS.S2,
      titleVi: "An toàn quyết định",
      titleEn: "Decision safety",
      passed: true,
      decision: null,
      detailVi: "Không áp dụng — không có teaching decision để đánh giá.",
      detailEn: "Not applicable — no teaching decision provided.",
      reasonCode: "s2_no_decision",
    };
  }

  const safetyCheck = isDecisionSafe(decisionInput, decision);

  if (!safetyCheck.safe) {
    return {
      gateId: GATE_IDS.S2,
      titleVi: "An toàn quyết định",
      titleEn: "Decision safety",
      passed: false,
      decision: "BLOCK",
      detailVi: safetyCheck.reasonVi!,
      detailEn: `Decision safety failed: ${safetyCheck.failedGates.map((g) => g.gateId).join(", ")}.`,
      reasonCode: "s2_decision_safety_failed",
    };
  }

  return {
    gateId: GATE_IDS.S2,
    titleVi: "An toàn quyết định",
    titleEn: "Decision safety",
    passed: true,
    decision: null,
    detailVi: "Quyết định giảng dạy an toàn — V1 và V3 đều đạt.",
    detailEn: "Teaching decision is safe — V1 and V3 passed.",
    reasonCode: "s2_decision_safety_ok",
  };
}

// ─── S3 — Empty Response Gate ─────────────────────────────────────────────

/**
 * S3: Is the response text non-empty?
 *
 * An empty or whitespace-only explanation should never reach the learner.
 * This catches the case where the response builder produces an empty string.
 */
function evaluateEmptyResponse(explanationVi: string): SelfAuditGateResult {
  if (!explanationVi || explanationVi.trim().length === 0) {
    return {
      gateId: GATE_IDS.S3,
      titleVi: "Phản hồi không rỗng",
      titleEn: "Non-empty response",
      passed: false,
      decision: "BLOCK",
      detailVi: "Phản hồi trống — không có nội dung để hiển thị cho người học.",
      detailEn: "Response is empty — nothing to show to the learner.",
      reasonCode: "s3_empty_response",
    };
  }

  return {
    gateId: GATE_IDS.S3,
    titleVi: "Phản hồi không rỗng",
    titleEn: "Non-empty response",
    passed: true,
    decision: null,
    detailVi: "Phản hồi có nội dung.",
    detailEn: "Response is non-empty.",
    reasonCode: "s3_non_empty",
  };
}

// ─── S4 — Contract Integrity Gate ─────────────────────────────────────────

/**
 * S4: Does the response pass the full contract check?
 *
 * Runs all applicable contract rules for the mode. If 3+ rules fail,
 * the response has significant quality issues and should be revised.
 *
 * This gate also catches 1-2 failures — they pass through to S8 for
 * rubric evaluation, which provides a more nuanced quality assessment.
 */
function evaluateContractIntegrity(
  contractResult: ContractCheckResult,
): SelfAuditGateResult {
  if (contractResult.failedCount >= 3) {
    const failedTitles = contractResult.rules
      .filter((r) => !r.passed)
      .map((r) => r.titleVi)
      .join(", ");
    return {
      gateId: GATE_IDS.S4,
      titleVi: "Tính toàn vẹn hợp đồng",
      titleEn: "Contract integrity",
      passed: false,
      decision: "REVISE",
      detailVi: `${contractResult.failedCount} quy tắc không đạt: ${failedTitles}. Cần chỉnh sửa phản hồi.`,
      detailEn: `${contractResult.failedCount} contract rules failed: ${contractResult.rules.filter((r) => !r.passed).map((r) => r.ruleId).join(", ")}. Response needs revision.`,
      reasonCode: "s4_contract_major_violation",
    };
  }

  if (contractResult.failedCount > 0) {
    return {
      gateId: GATE_IDS.S4,
      titleVi: "Tính toàn vẹn hợp đồng",
      titleEn: "Contract integrity",
      passed: true,
      decision: null,
      detailVi: `${contractResult.failedCount} quy tắc nhỏ không đạt — cho phép hiển thị, sẽ được rubric đánh giá thêm.`,
      detailEn: `${contractResult.failedCount} minor rule(s) failed — allowing display, will be further assessed by rubric.`,
      reasonCode: "s4_contract_minor_issues",
    };
  }

  return {
    gateId: GATE_IDS.S4,
    titleVi: "Tính toàn vẹn hợp đồng",
    titleEn: "Contract integrity",
    passed: true,
    decision: null,
    detailVi: "Tất cả quy tắc hợp đồng đều đạt.",
    detailEn: "All contract rules passed.",
    reasonCode: "s4_contract_clean",
  };
}

// ─── S5 — Decision Quality Gate ───────────────────────────────────────────

/**
 * S5: Does the teaching decision pass all V1-V8 evaluation gates?
 *
 * Runs the full teaching decision evaluation. UNSAFE decisions are blocked;
 * NEEDS_REVIEW decisions should be revised before showing.
 *
 * Skipped when no teaching decision is provided.
 */
function evaluateDecisionQuality(
  decision: TeacherDecision | undefined,
  decisionInput: TeacherDecisionInput | undefined,
): SelfAuditGateResult {
  if (!decision || !decisionInput) {
    return {
      gateId: GATE_IDS.S5,
      titleVi: "Chất lượng quyết định",
      titleEn: "Decision quality",
      passed: true,
      decision: null,
      detailVi: "Không áp dụng — không có teaching decision để đánh giá.",
      detailEn: "Not applicable — no teaching decision provided.",
      reasonCode: "s5_no_decision",
    };
  }

  const evaluation = evaluateTeachingDecision(decisionInput, decision);

  if (evaluation.classification === "UNSAFE") {
    return {
      gateId: GATE_IDS.S5,
      titleVi: "Chất lượng quyết định",
      titleEn: "Decision quality",
      passed: false,
      decision: "BLOCK",
      detailVi: evaluation.summaryVi,
      detailEn: evaluation.summaryEn,
      reasonCode: "s5_decision_unsafe",
    };
  }

  if (evaluation.classification === "NEEDS_REVIEW") {
    return {
      gateId: GATE_IDS.S5,
      titleVi: "Chất lượng quyết định",
      titleEn: "Decision quality",
      passed: false,
      decision: "REVISE",
      detailVi: evaluation.summaryVi,
      detailEn: evaluation.summaryEn,
      reasonCode: "s5_decision_needs_review",
    };
  }

  return {
    gateId: GATE_IDS.S5,
    titleVi: "Chất lượng quyết định",
    titleEn: "Decision quality",
    passed: true,
    decision: null,
    detailVi: `Quyết định giảng dạy đạt chất lượng: ${evaluation.classification}.`,
    detailEn: `Teaching decision quality: ${evaluation.classification}.`,
    reasonCode: "s5_decision_quality_ok",
  };
}

// ─── S6 — Correction-Text Coherence Gate ──────────────────────────────────

/**
 * S6: When the action involves correcting, does the response actually
 * contain the corrected text?
 *
 * This gate only fires when a teaching decision is provided AND the action
 * is CORRECT_NOW or EXPLAIN_PATTERN. It checks that:
 *   - The corrected sentence is provided (non-empty)
 *   - The response text is long enough to plausibly contain a correction
 *
 * Without a teaching decision, this gate checks the correctedSentence field
 * directly — if it's provided, the correction text exists.
 */
function evaluateCorrectionTextCoherence(
  input: SelfAuditInput,
): SelfAuditGateResult {
  const hasDecision = !!input.decision;
  const isCorrectingAction =
    hasDecision &&
    (input.decision!.action === "CORRECT_NOW" || input.decision!.action === "EXPLAIN_PATTERN");

  // Only relevant for correction turns
  if (!isCorrectingAction && !input.correctedSentence) {
    return {
      gateId: GATE_IDS.S6,
      titleVi: "Gắn kết văn bản sửa lỗi",
      titleEn: "Correction-text coherence",
      passed: true,
      decision: null,
      detailVi: "Không áp dụng — đây không phải là lượt sửa lỗi.",
      detailEn: "Not applicable — this is not a correction turn.",
      reasonCode: "s6_not_correction",
    };
  }

  // Check: corrected sentence is provided
  if (!input.correctedSentence || input.correctedSentence.trim().length === 0) {
    return {
      gateId: GATE_IDS.S6,
      titleVi: "Gắn kết văn bản sửa lỗi",
      titleEn: "Correction-text coherence",
      passed: false,
      decision: "REVISE",
      detailVi: "Hành động sửa lỗi nhưng không có correctedSentence — cần bổ sung câu đã sửa.",
      detailEn: "Correcting action but correctedSentence is missing — must provide the corrected text.",
      reasonCode: "s6_missing_corrected_sentence",
    };
  }

  // Check: response text is long enough to plausibly contain a correction explanation
  if (input.explanationVi.trim().length < 10) {
    return {
      gateId: GATE_IDS.S6,
      titleVi: "Gắn kết văn bản sửa lỗi",
      titleEn: "Correction-text coherence",
      passed: false,
      decision: "REVISE",
      detailVi: "Phản hồi sửa lỗi quá ngắn (< 10 ký tự) — cần giải thích đầy đủ hơn.",
      detailEn: "Correction response too short (< 10 chars) — needs fuller explanation.",
      reasonCode: "s6_response_too_short",
    };
  }

  return {
    gateId: GATE_IDS.S6,
    titleVi: "Gắn kết văn bản sửa lỗi",
    titleEn: "Correction-text coherence",
    passed: true,
    decision: null,
    detailVi: "Phản hồi sửa lỗi có đầy đủ correctedSentence và giải thích.",
    detailEn: "Correction response includes correctedSentence and adequate explanation.",
    reasonCode: "s6_correction_text_coherent",
  };
}

// ─── S7 — Action-Response Alignment Gate ──────────────────────────────────

/**
 * S7: Does the response content align with the decision action?
 *
 * When the action is SUPPRESS, the response should NOT contain explicit
 * correction language (like "sửa" / "correct" / "🔍"). A suppression
 * response should acknowledge, encourage, or redirect — not correct.
 *
 * When the action is CORRECT_NOW, the response SHOULD contain correction
 * markers (like the corrected sentence or explanation).
 *
 * Without a teaching decision, this gate is skipped.
 */
function evaluateActionResponseAlignment(
  input: SelfAuditInput,
): SelfAuditGateResult {
  if (!input.decision) {
    return {
      gateId: GATE_IDS.S7,
      titleVi: "Hành động khớp phản hồi",
      titleEn: "Action-response alignment",
      passed: true,
      decision: null,
      detailVi: "Không áp dụng — không có teaching decision để đối chiếu.",
      detailEn: "Not applicable — no teaching decision to cross-reference.",
      reasonCode: "s7_no_decision",
    };
  }

  const action = input.decision.action;
  const text = input.explanationVi;

  // SUPPRESS: response should NOT contain explicit correction markers
  if (action === "SUPPRESS") {
    const correctionMarkers = [
      /🔍.*viết/i,
      /💡.*gợi ý/i,
      /📝.*giải thích/i,
      /sửa lại/i,
      /correct(ed)?\s+(version|sentence|form)/i,
      /nên (viết|nói|dùng) là/i,
      /câu đúng (là|sẽ là)/i,
    ];

    for (const marker of correctionMarkers) {
      if (marker.test(text)) {
        return {
          gateId: GATE_IDS.S7,
          titleVi: "Hành động khớp phản hồi",
          titleEn: "Action-response alignment",
          passed: false,
          decision: "REVISE",
          detailVi: `Hành động SUPPRESS nhưng phản hồi chứa ngôn ngữ sửa lỗi (khớp mẫu: ${marker}). Nên bỏ phần sửa lỗi hoặc đổi action.`,
          detailEn: `Action is SUPPRESS but response contains correction language (pattern: ${marker}). Should remove correction or change action.`,
          reasonCode: "s7_suppress_with_correction_text",
        };
      }
    }
  }

  // CORRECT_NOW / EXPLAIN_PATTERN: response should contain correction-related content
  if (action === "CORRECT_NOW" || action === "EXPLAIN_PATTERN") {
    const hasCorrectionContent =
      /🔍/.test(text) ||
      /💡/.test(text) ||
      /sửa/i.test(text) ||
      /correct/i.test(text) ||
      (input.correctedSentence && text.includes(input.correctedSentence));

    if (!hasCorrectionContent) {
      return {
        gateId: GATE_IDS.S7,
        titleVi: "Hành động khớp phản hồi",
        titleEn: "Action-response alignment",
        passed: false,
        decision: "REVISE",
        detailVi: `Hành động ${action} nhưng phản hồi không chứa nội dung sửa lỗi rõ ràng. Cần thêm giải thích hoặc câu đã sửa.`,
        detailEn: `Action is ${action} but response lacks clear correction content. Should add explanation or corrected text.`,
        reasonCode: "s7_correct_without_correction_text",
      };
    }
  }

  return {
    gateId: GATE_IDS.S7,
    titleVi: "Hành động khớp phản hồi",
    titleEn: "Action-response alignment",
    passed: true,
    decision: null,
    detailVi: `Phản hồi phù hợp với hành động "${action}".`,
    detailEn: `Response content aligns with action "${action}".`,
    reasonCode: "s7_action_response_aligned",
  };
}

// ─── S8 — Rubric Minimum Gate ─────────────────────────────────────────────

/**
 * S8: Does the rubric score meet the minimum quality threshold?
 *
 * Runs the focused rubric evaluation. If the overall classification is
 * "failing", the response needs revision. If "needs_work", show with caution.
 *
 * This is the last gate — it catches quality issues that the contract
 * check (S4) might have let through (e.g., 1-2 minor rule failures that
 * still produce a subpar learner experience).
 */
function evaluateRubricMinimum(
  learnerInput: ContractLearnerInput,
  response: ContractTutorResponse,
  mode: SelfAuditMode,
): SelfAuditGateResult {
  const rubricResult = evaluateRubricFocused(learnerInput, response, mode);

  if (rubricResult.classification === "failing") {
    const dimSummary = rubricResult.dimensions
      .filter((d) => d.score <= 1)
      .map((d) => `${d.titleVi}: ${d.score}/3`)
      .join(", ");
    return {
      gateId: GATE_IDS.S8,
      titleVi: "Ngưỡng chất lượng",
      titleEn: "Rubric minimum",
      passed: false,
      decision: "REVISE",
      detailVi: `Chất lượng phản hồi dưới ngưỡng — rubric đánh giá "failing". Điểm thấp: ${dimSummary}. Cần chỉnh sửa.`,
      detailEn: `Response quality below threshold — rubric classification "failing". Low scores: ${dimSummary}. Needs revision.`,
      reasonCode: "s8_rubric_failing",
    };
  }

  if (rubricResult.classification === "needs_revision") {
    return {
      gateId: GATE_IDS.S8,
      titleVi: "Ngưỡng chất lượng",
      titleEn: "Rubric minimum",
      passed: true,
      decision: "SHOW_WITH_CAUTION",
      detailVi: `Chất lượng phản hồi ở mức "needs_revision" — hiển thị được nhưng cần theo dõi.`,
      detailEn: `Response quality at "needs_revision" level — can show but should monitor.`,
      reasonCode: "s8_rubric_needs_revision",
    };
  }

  return {
    gateId: GATE_IDS.S8,
    titleVi: "Ngưỡng chất lượng",
    titleEn: "Rubric minimum",
    passed: true,
    decision: null,
    detailVi: `Chất lượng phản hồi đạt yêu cầu: "${rubricResult.classification}".`,
    detailEn: `Response quality acceptable: "${rubricResult.classification}".`,
    reasonCode: "s8_rubric_ok",
  };
}

// ─── Gate Chain ────────────────────────────────────────────────────────────

/**
 * The ordered list of self-audit gates.
 * Evaluated in S1→S8 order with short-circuit: the first gate that returns
 * a non-null decision ends the chain. Earlier gates (S1-S3) can BLOCK;
 * later gates (S4-S8) can REVISE or SHOW_WITH_CAUTION.
 */
function buildGateChain(
  input: SelfAuditInput,
  contractResult: ContractCheckResult,
  learnerInput: ContractLearnerInput,
  tutorResponse: ContractTutorResponse,
): ReadonlyArray<() => SelfAuditGateResult> {
  return [
    // S1 — Hard safety (must run first — uses pre-computed contract result)
    () => evaluateHardSafety(contractResult),
    // S2 — Decision safety (hard-fail gates V1, V3)
    () => evaluateDecisionSafety(input.decision, input.decisionInput),
    // S3 — Empty response
    () => evaluateEmptyResponse(input.explanationVi),
    // S4 — Contract integrity
    () => evaluateContractIntegrity(contractResult),
    // S5 — Decision quality (V1-V8 full)
    () => evaluateDecisionQuality(input.decision, input.decisionInput),
    // S6 — Correction-text coherence
    () => evaluateCorrectionTextCoherence(input),
    // S7 — Action-response alignment
    () => evaluateActionResponseAlignment(input),
    // S8 — Rubric minimum
    () => evaluateRubricMinimum(learnerInput, tutorResponse, input.mode),
  ];
}

// ─── Summary Builders ─────────────────────────────────────────────────────

function buildSummaryVi(
  decision: SelfAuditDecision,
  decidingGate: string | null,
  gates: SelfAuditGateResult[],
): string {
  const gateLabel = decidingGate ? ` (cổng ${decidingGate})` : "";

  switch (decision) {
    case "SHOW":
      return `Đạt — phản hồi an toàn để hiển thị${gateLabel}. Tất cả các cổng tự kiểm tra đều thông qua.`;
    case "SHOW_WITH_CAUTION":
      return `Hiển thị có lưu ý${gateLabel} — có vấn đề nhỏ, nên theo dõi chất lượng.`;
    case "REVISE":
      return `Cần chỉnh sửa${gateLabel} — phản hồi có vấn đề cần khắc phục trước khi hiển thị.`;
    case "BLOCK":
      return `Chặn${gateLabel} — phản hồi không an toàn, không được hiển thị cho người học.`;
  }
}

function buildSummaryEn(
  decision: SelfAuditDecision,
  decidingGate: string | null,
  gates: SelfAuditGateResult[],
): string {
  const gateLabel = decidingGate ? ` (gate ${decidingGate})` : "";

  switch (decision) {
    case "SHOW":
      return `Passed — response is safe to show${gateLabel}. All self-audit gates passed.`;
    case "SHOW_WITH_CAUTION":
      return `Show with caution${gateLabel} — minor issues found, monitor quality.`;
    case "REVISE":
      return `Needs revision${gateLabel} — response has issues to fix before showing.`;
    case "BLOCK":
      return `Blocked${gateLabel} — response is unsafe, must not be shown to learner.`;
  }
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Run the self-audit gate chain on a tutor response BEFORE showing it to the learner.
 *
 * This is the main entry point. It runs the S1-S8 gate chain and returns a
 * clear decision: SHOW, SHOW_WITH_CAUTION, REVISE, or BLOCK.
 *
 * The gate chain short-circuits: the first gate that fires (returns a non-null
 * decision) ends the chain. Earlier gates (S1-S3) can BLOCK; later gates
 * (S4-S8) can REVISE or SHOW_WITH_CAUTION. If no gate fires, the default
 * is SHOW.
 *
 * Pure function — deterministic, no I/O, no side effects.
 *
 * @param input — the learner text, tutor response, and optional decision context
 * @returns A SelfAuditResult with the final decision and per-gate details.
 */
export function selfAuditBeforeShowing(input: SelfAuditInput): SelfAuditResult {
  // Build contract input/response early — needed by multiple gates
  const learnerInput = buildLearnerInput(input);
  const tutorResponse = buildTutorResponse(input);

  // Run the contract check once — shared between S1 and S4
  const contractResult = runContractCheck(learnerInput, tutorResponse, input.mode);
  const repair = prepareR8Repair(input, learnerInput, tutorResponse, contractResult);

  // Build the gate chain
  const gateFns = buildGateChain(repair.input, repair.contractResult, learnerInput, repair.tutorResponse);

  // Run gates in order, short-circuit on first non-null decision
  const gates: SelfAuditGateResult[] = [];
  let finalDecision: SelfAuditDecision = "SHOW";
  let decidingGate: string | null = null;

  for (const gateFn of gateFns) {
    const result = gateFn();
    gates.push(result);

    if (result.decision !== null) {
      finalDecision = result.decision;
      decidingGate = result.gateId;
      break;
    }
  }

  // Run decision evaluation if decision context is provided (for telemetry)
  let evaluationResult: EvaluationResult | null = null;
  if (input.decision && input.decisionInput) {
    evaluationResult = evaluateTeachingDecision(input.decisionInput, input.decision);
  }

  const passedCount = gates.filter((g) => g.passed).length;
  const firedCount = gates.filter((g) => g.decision !== null).length;

  return {
    decision: finalDecision,
    canShow: finalDecision === "SHOW" || finalDecision === "SHOW_WITH_CAUTION",
    needsRevision: finalDecision === "REVISE",
    isBlocked: finalDecision === "BLOCK",
    gates,
    passedCount,
    firedCount,
    decidingGate,
    summaryVi: buildSummaryVi(finalDecision, decidingGate, gates),
    summaryEn: buildSummaryEn(finalDecision, decidingGate, gates),
    contractResult: repair.contractResult,
    evaluationResult,
    repairOutcome: repair.repairOutcome,
    repairedExplanationVi: repair.repairedExplanationVi,
    deliverableExplanationVi: repair.input.explanationVi,
  };
}

/**
 * Quick self-audit for a correction response with minimal input assembly.
 *
 * Convenience wrapper that builds the SelfAuditInput from raw strings,
 * then runs the full self-audit.
 *
 * @param learnerText       — what the learner typed
 * @param explanationVi     — Mercy's Vietnamese explanation / reply
 * @param correctedSentence — the corrected version (if any)
 * @param cefrLevel         — learner's CEFR level (null if unknown)
 */
export function selfAuditCorrectionQuick(
  learnerText: string,
  explanationVi: string,
  correctedSentence: string | undefined,
  cefrLevel: string | null = null,
): SelfAuditResult {
  return selfAuditBeforeShowing({
    learnerText,
    explanationVi,
    correctedSentence,
    mode: "correction",
    cefrLevel,
  });
}

/**
 * Quick self-audit for a conversation response with minimal input assembly.
 */
export function selfAuditConversationQuick(
  learnerText: string,
  replyVi: string,
  cefrLevel: string | null = null,
): SelfAuditResult {
  return selfAuditBeforeShowing({
    learnerText,
    explanationVi: replyVi,
    mode: "conversation",
    cefrLevel,
  });
}

// ─── Telemetry Formatter ───────────────────────────────────────────────────

/**
 * Format a self-audit result into a structured telemetry record.
 * Contains no learner PII — only gate IDs, decisions, and reason codes.
 */
export function formatSelfAuditTelemetry(result: SelfAuditResult): Record<string, unknown> {
  return {
    decision: result.decision,
    canShow: result.canShow,
    needsRevision: result.needsRevision,
    isBlocked: result.isBlocked,
    decidingGate: result.decidingGate,
    passedCount: result.passedCount,
    firedCount: result.firedCount,
    repairOutcome: result.repairOutcome,
    gateResults: Object.fromEntries(
      result.gates.map((g) => [g.gateId, { passed: g.passed, decision: g.decision, reasonCode: g.reasonCode }]),
    ),
    contractFailedCount: result.contractResult?.failedCount ?? null,
    evaluationClassification: result.evaluationResult?.classification ?? null,
  };
}

// ─── Catalogs ──────────────────────────────────────────────────────────────

export const SELF_AUDIT_DECISION_CATALOG: ReadonlyArray<{
  decision: SelfAuditDecision;
  titleEn: string;
  titleVi: string;
  descriptionVi: string;
}> = [
  {
    decision: "SHOW",
    titleEn: "Show",
    titleVi: "Hiển thị",
    descriptionVi: "Phản hồi an toàn và đạt chất lượng — hiển thị cho người học.",
  },
  {
    decision: "SHOW_WITH_CAUTION",
    titleEn: "Show with caution",
    titleVi: "Hiển thị có lưu ý",
    descriptionVi: "Phản hồi có vấn đề nhỏ — hiển thị được nhưng nên theo dõi chất lượng.",
  },
  {
    decision: "REVISE",
    titleEn: "Revise",
    titleVi: "Cần chỉnh sửa",
    descriptionVi: "Phản hồi có vấn đề đáng kể — cần chỉnh sửa trước khi hiển thị.",
  },
  {
    decision: "BLOCK",
    titleEn: "Block",
    titleVi: "Chặn",
    descriptionVi: "Phản hồi không an toàn — không được hiển thị cho người học.",
  },
];

export const SELF_AUDIT_GATE_CATALOG: ReadonlyArray<{
  gateId: string;
  titleVi: string;
  titleEn: string;
  canBlock: boolean;
  descriptionVi: string;
}> = [
  {
    gateId: GATE_IDS.S1,
    titleVi: "An toàn cơ bản",
    titleEn: "Hard safety",
    canBlock: true,
    descriptionVi: "Kiểm tra quy tắc an toàn cơ bản (R3 không khen giả, R7 im lặng chiến lược, R8 giữ thể diện).",
  },
  {
    gateId: GATE_IDS.S2,
    titleVi: "An toàn quyết định",
    titleEn: "Decision safety",
    canBlock: true,
    descriptionVi: "Kiểm tra quyết định giảng dạy có an toàn không (V1 hành động khớp đầu vào, V3 thời điểm khớp hành động).",
  },
  {
    gateId: GATE_IDS.S3,
    titleVi: "Phản hồi không rỗng",
    titleEn: "Non-empty response",
    canBlock: true,
    descriptionVi: "Phản hồi phải có nội dung — không được trống.",
  },
  {
    gateId: GATE_IDS.S4,
    titleVi: "Tính toàn vẹn hợp đồng",
    titleEn: "Contract integrity",
    canBlock: false,
    descriptionVi: "Kiểm tra toàn bộ quy tắc hợp đồng (R1-R10). Nếu ≥3 quy tắc không đạt → cần chỉnh sửa.",
  },
  {
    gateId: GATE_IDS.S5,
    titleVi: "Chất lượng quyết định",
    titleEn: "Decision quality",
    canBlock: true,
    descriptionVi: "Đánh giá toàn bộ V1-V8. UNSAFE → chặn; NEEDS_REVIEW → cần chỉnh sửa.",
  },
  {
    gateId: GATE_IDS.S6,
    titleVi: "Gắn kết văn bản sửa lỗi",
    titleEn: "Correction-text coherence",
    canBlock: false,
    descriptionVi: "Khi sửa lỗi, phản hồi phải chứa câu đã sửa và giải thích đầy đủ.",
  },
  {
    gateId: GATE_IDS.S7,
    titleVi: "Hành động khớp phản hồi",
    titleEn: "Action-response alignment",
    canBlock: false,
    descriptionVi: "Nội dung phản hồi phải phù hợp với hành động (SUPPRESS không được chứa sửa lỗi, CORRECT_NOW phải có sửa lỗi).",
  },
  {
    gateId: GATE_IDS.S8,
    titleVi: "Ngưỡng chất lượng",
    titleEn: "Rubric minimum",
    canBlock: false,
    descriptionVi: "Điểm rubric phải đạt ngưỡng tối thiểu. \"failing\" → cần chỉnh sửa; \"needs_work\" → hiển thị có lưu ý.",
  },
];
