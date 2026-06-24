/**
 * Teacher Mercy — Contract & Rubric Audit Gate
 *
 * Lightweight runtime quality guard that uses the Teacher Mercy behavior
 * contract (teacherMercyContract.ts) and rubric (teacherMercyRubric.ts)
 * to audit tutor responses before they reach the learner.
 *
 * This is an offline guard — all checks are deterministic string/pattern
 * matching with zero I/O, zero network calls, zero LLM tokens. It runs in
 * under 1ms per response, so it can be called on every tutor turn.
 *
 * Two audit levels:
 *   - AUDIT (default): runs the contract, logs violations via console.warn,
 *     returns structured audit result, never blocks.
 *   - BLOCK_UNSAFE: additionally blocks responses that fail hard-safety
 *     rules (R3_NO_FAKE_PRAISE, R7_STRATEGIC_SILENCE, R8_FACE_SAVING).
 *
 * Usage:
 *   import { auditResponse, auditResponseSafety } from "./teacherMercyAuditGate";
 *
 *   // Non-blocking audit (for telemetry, monitoring, debugging):
 *   const audit = auditResponse(learnerText, tutorResponse, "correction");
 *   if (!audit.passed) console.warn("[MercyAudit]", audit.summaryVi);
 *
 *   // Blocking safety gate:
 *   const safe = auditResponseSafety(learnerText, tutorResponse);
 *   if (!safe.passed) return; // don't show response to learner
 *
 * Design:
 *   - Pure functions — no I/O, no side effects, deterministic.
 *   - Vietnamese-first — all detail messages in Vietnamese.
 *   - Composable — audit functions return the same AuditResult shape.
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
  type RubricDimensionResult,
  type RubricOverallClassification,
  type RubricResult,
} from "./teacherMercyRubric";

// ─── Audit Types ──────────────────────────────────────────────────────────

export type AuditMode = "correction" | "conversation" | "full";

export type AuditGateLevel = "audit" | "block_unsafe";

export type AuditResult = {
  /** Whether the response passed the relevant contract rules. */
  passed: boolean;
  /** Whether hard-safety rules (R3, R7, R8) all passed. */
  safe: boolean;
  /** The audit mode used. */
  mode: AuditMode;
  /** The gate level — "audit" logs but doesn't block; "block_unsafe" rejects on safety failure. */
  gateLevel: AuditGateLevel;
  /** Individual rule checks from the contract. */
  contractResult: ContractCheckResult;
  /** Per-dimension rubric results (focused by mode). */
  rubricResult: RubricResult;
  /** Summary message in Vietnamese. */
  summaryVi: string;
  /** If gateLevel is "block_unsafe" and safe is false, this is the blocking reason. */
  blockReasonVi: string | null;
};

// ─── Input Builders ───────────────────────────────────────────────────────

/**
 * Build a ContractLearnerInput from the minimal fields available at runtime.
 * Defaults are safe — missing data degrades gracefully to permissive checks.
 */
export function buildContractLearnerInput(opts: {
  text: string;
  cefrLevel?: string | null;
  trackedWeakness?: string | null;
  didSelfCorrect?: boolean;
  l1?: string;
}): ContractLearnerInput {
  return {
    text: opts.text,
    cefrLevel: opts.cefrLevel ?? null,
    trackedWeakness: opts.trackedWeakness ?? null,
    didSelfCorrect: opts.didSelfCorrect ?? false,
    l1: opts.l1 ?? "vi",
  };
}

/**
 * Build a ContractTutorResponse from the fields available in a tutor turn.
 */
export function buildContractTutorResponse(opts: {
  vi: string;
  en?: string;
  correctedSentence?: string;
  grammarPoints?: string[];
  transferErrorNote?: string;
  nextSteps?: Array<{ labelVi: string }>;
  correctionCount?: number;
  followUpQuestionCount?: number;
}): ContractTutorResponse {
  return {
    vi: opts.vi,
    en: opts.en,
    correctedSentence: opts.correctedSentence,
    grammarPoints: opts.grammarPoints,
    transferErrorNote: opts.transferErrorNote,
    nextSteps: opts.nextSteps,
    correctionCount: opts.correctionCount,
    followUpQuestionCount: opts.followUpQuestionCount,
  };
}

// ─── Audit Helpers ────────────────────────────────────────────────────────

/** Hard-safety rules: if any of these fail, the response is unsafe. */
const HARD_SAFETY_RULES = new Set([
  "R3_NO_FAKE_PRAISE",
  "R7_STRATEGIC_SILENCE",
  "R8_FACE_SAVING",
]);

function checkSafety(contractResult: ContractCheckResult): boolean {
  return contractResult.rules
    .filter((r) => HARD_SAFETY_RULES.has(r.ruleId))
    .every((r) => r.passed);
}

function buildBlockReasonVi(contractResult: ContractCheckResult): string | null {
  const failedSafety = contractResult.rules.filter(
    (r) => HARD_SAFETY_RULES.has(r.ruleId) && !r.passed,
  );
  if (failedSafety.length === 0) return null;
  const titles = failedSafety.map((r) => r.titleVi).join("; ");
  return `Phản hồi bị chặn vì vi phạm quy tắc an toàn: ${titles}.`;
}

// ─── Audit Functions ──────────────────────────────────────────────────────

/**
 * Run a contract check appropriate for the given audit mode.
 */
function runContractCheck(
  learnerInput: ContractLearnerInput,
  response: ContractTutorResponse,
  mode: AuditMode,
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
 * Audit a tutor response against the Teacher Mercy contract and rubric.
 *
 * This is the main entry point. Given a learner's text and the tutor's
 * response, it runs the contract check and rubric evaluation, then returns
 * a structured audit result.
 *
 * Audit level (default: "audit"):
 *   - "audit": Runs the contract + rubric, logs violations via console.warn,
 *     but NEVER blocks. The caller decides what to do with the result.
 *   - "block_unsafe": Same as audit, but additionally sets `safe: false` and
 *     `blockReasonVi` when hard-safety rules fail. The caller SHOULD block
 *     the response from reaching the learner.
 *
 * @param learnerInput — the learner's text and context
 * @param response     — the tutor's reply
 * @param mode         — which contract subset to check
 * @param gateLevel    — "audit" (non-blocking) or "block_unsafe" (block on safety failures)
 */
export function auditResponse(
  learnerInput: ContractLearnerInput,
  response: ContractTutorResponse,
  mode: AuditMode = "correction",
  gateLevel: AuditGateLevel = "audit",
): AuditResult {
  const contractResult = runContractCheck(learnerInput, response, mode);
  const rubricResult = evaluateRubricFocused(learnerInput, response, mode);
  const safe = checkSafety(contractResult);

  const result: AuditResult = {
    passed: contractResult.passed,
    safe,
    mode,
    gateLevel,
    contractResult,
    rubricResult,
    summaryVi: contractResult.summaryVi,
    blockReasonVi: null,
  };

  // In "audit" mode, log violations but never block.
  if (gateLevel === "audit") {
    if (!contractResult.passed) {
      console.warn(
        `[MercyAuditGate] Contract violation (${mode}): ${contractResult.summaryVi}`,
        { contractResult, rubricResult },
      );
    }
    if (!safe) {
      console.warn(
        `[MercyAuditGate] Safety violation (${mode}): hard-safety rules failed.`,
        {
          failedRules: contractResult.rules
            .filter((r) => HARD_SAFETY_RULES.has(r.ruleId) && !r.passed)
            .map((r) => r.ruleId),
        },
      );
    }
    return result;
  }

  // In "block_unsafe" mode, surface the block reason when unsafe.
  if (!safe) {
    result.blockReasonVi = buildBlockReasonVi(contractResult);
  }

  return result;
}

/**
 * Quick hard-safety gate: returns whether the response is safe to show.
 *
 * This is the minimum blocking guard — checks only R3, R7, R8.
 * Use this when you need a fast yes/no answer without the full audit.
 *
 * Pure function — deterministic, no I/O.
 */
export function auditResponseSafety(
  learnerInput: ContractLearnerInput,
  response: ContractTutorResponse,
  mode: AuditMode = "correction",
): { safe: boolean; failedRules: ContractRuleCheck[]; reasonVi: string | null } {
  const contractResult = runContractCheck(learnerInput, response, mode);
  const failedRules = contractResult.rules.filter(
    (r) => HARD_SAFETY_RULES.has(r.ruleId) && !r.passed,
  );
  const safe = failedRules.length === 0;

  return {
    safe,
    failedRules,
    reasonVi: safe ? null : buildBlockReasonVi(contractResult),
  };
}

/**
 * Convenience: audit a correction response with minimal input assembly.
 *
 * Builds the ContractLearnerInput and ContractTutorResponse from raw strings,
 * then runs the full audit.
 *
 * @param learnerText       — what the learner typed
 * @param explanationVi     — Mercy's Vietnamese explanation / reply
 * @param correctedSentence — the corrected version of the learner's sentence (if any)
 * @param cefrLevel         — learner's CEFR level (null if unknown)
 * @param gateLevel         — audit level
 */
export function auditCorrectionQuick(
  learnerText: string,
  explanationVi: string,
  correctedSentence: string | undefined,
  cefrLevel: string | null = null,
  gateLevel: AuditGateLevel = "audit",
): AuditResult {
  const learnerInput = buildContractLearnerInput({
    text: learnerText,
    cefrLevel,
  });
  const response = buildContractTutorResponse({
    vi: explanationVi,
    correctedSentence,
    correctionCount: correctedSentence ? 1 : 0,
  });
  return auditResponse(learnerInput, response, "correction", gateLevel);
}

/**
 * Convenience: audit a conversation response with minimal input assembly.
 */
export function auditConversationQuick(
  learnerText: string,
  replyVi: string,
  followUpQuestionCount: number = 0,
  cefrLevel: string | null = null,
  gateLevel: AuditGateLevel = "audit",
): AuditResult {
  const learnerInput = buildContractLearnerInput({
    text: learnerText,
    cefrLevel,
  });
  const response = buildContractTutorResponse({
    vi: replyVi,
    followUpQuestionCount,
  });
  return auditResponse(learnerInput, response, "conversation", gateLevel);
}

// ─── Audit Summary Formatter ──────────────────────────────────────────────

/**
 * Format an audit result into a compact Vietnamese one-line summary
 * suitable for telemetry or debug logging.
 */
export function formatAuditSummary(result: AuditResult): string {
  const dimScores = result.rubricResult.dimensions
    .map((d) => `${d.titleVi}: ${d.score}/3`)
    .join(", ");
  return `[${result.rubricResult.classification}] ${result.summaryVi} (${dimScores})`;
}

/**
 * Format an audit result into a structured telemetry record.
 * Contains no learner PII — only rule IDs, dimension scores, and classification.
 */
export function formatAuditTelemetry(result: AuditResult): Record<string, unknown> {
  return {
    classification: result.rubricResult.classification,
    passed: result.passed,
    safe: result.safe,
    mode: result.mode,
    gateLevel: result.gateLevel,
    failedRuleIds: result.contractResult.rules
      .filter((r) => !r.passed)
      .map((r) => r.ruleId),
    failedCount: result.contractResult.failedCount,
    dimensionScores: Object.fromEntries(
      result.rubricResult.dimensions.map((d) => [d.dimensionId, d.score]),
    ),
  };
}
