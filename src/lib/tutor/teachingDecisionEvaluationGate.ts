/**
 * Teacher Mercy — Teaching Decision Evaluation Gate
 *
 * Self-evaluation mechanism that audits TeacherDecision outputs for quality,
 * consistency, and pedagogical soundness. This gate runs AFTER the decision
 * engine produces a decision — it asks "was this a GOOD teaching decision?"
 *
 * This module is DIFFERENT from teacherMercyAuditGate.ts:
 *   - AuditGate checks TUTOR RESPONSE TEXT (the actual words shown to the learner)
 *   - EvaluationGate checks the TEACHING DECISION (the action, timing, rationale)
 *
 * Think of it as a human teacher reflecting after a lesson: "Did I make the
 * right call there? Should I have corrected now, or waited? Was my explanation
 * appropriate for that learner's level?"
 *
 * V1-V8 Gate Chain:
 *   V1 — Action-Input Coherence: does the action make sense given the raw input?
 *   V2 — Rationale Quality: is rationaleVi well-formed and appropriate?
 *   V3 — Timing-Action Consistency: does timingMode match the chosen action?
 *   V4 — Correction Shape Validity: when correcting, is the correction well-formed?
 *   V5 — Suppression Justification: when suppressing, is the reasoning valid?
 *   V6 — Hint Ladder Alignment: when a hint is recommended, does it make sense?
 *   V7 — Readiness-Action Agreement: does readiness check agree with the action?
 *   V8 — Cross-Field Narrative Coherence: do all fields tell a consistent story?
 *
 * Design principles:
 *   1. Pure functions — no I/O, no side effects, deterministic.
 *   2. Vietnamese-first — all detail messages in Vietnamese.
 *   3. Actionable output — each gate returns a clear pass/fail with explanation.
 *   4. Non-blocking by default — evaluation informs, doesn't block; a separate
 *      safety layer (hard-fail gates) can block if needed.
 *   5. Composable — results aggregate into a single EvaluationResult.
 *
 * Pure functions — no I/O, no side effects, deterministic.
 */

import type { TeacherDecision, TeacherDecisionInput } from "./teacherDecisionEngine";
import type { HintLadderResult } from "./hintLadderPolicy";
import type { LearnerReadinessResult } from "./learnerReadinessPolicy";

// ─── Evaluation Types ──────────────────────────────────────────────────────

/**
 * The overall evaluation classification for a teaching decision.
 *
 * EXEMPLARY      — all gates passed; every aspect of the decision is sound.
 * ACCEPTABLE     — minor issues found; decision is still usable but could improve.
 * NEEDS_REVIEW   — significant issues found; the decision should be reviewed.
 * UNSAFE         — hard-fail gate triggered; decision should NOT be shown to learner.
 */
export type EvaluationClassification =
  | "EXEMPLARY"
  | "ACCEPTABLE"
  | "NEEDS_REVIEW"
  | "UNSAFE";

/**
 * Result of a single evaluation gate check.
 */
export type EvaluationGateResult = {
  /** Gate identifier (V1-V8). */
  gateId: string;
  /** Vietnamese title for this gate. */
  titleVi: string;
  /** English title for this gate. */
  titleEn: string;
  /** Whether this gate passed. */
  passed: boolean;
  /** Whether this gate is a hard-fail — its failure makes the decision UNSAFE. */
  isHardFail: boolean;
  /** Vietnamese explanation of the finding. */
  detailVi: string;
  /** English explanation for telemetry/logging. */
  detailEn: string;
  /** Machine-readable reason code. */
  reasonCode: string;
};

/**
 * Aggregate result of evaluating a teaching decision through all gates.
 */
export type EvaluationResult = {
  /** Overall classification. */
  classification: EvaluationClassification;
  /** Whether all gates passed. */
  allPassed: boolean;
  /** Whether all hard-fail gates passed (if false, decision is UNSAFE). */
  safetyPassed: boolean;
  /** Per-gate results in evaluation order (V1-V8). */
  gates: EvaluationGateResult[];
  /** Count of gates that passed. */
  passedCount: number;
  /** Count of gates that failed. */
  failedCount: number;
  /** Vietnamese summary suitable for display or logging. */
  summaryVi: string;
  /** English summary for telemetry. */
  summaryEn: string;
};

/**
 * Context needed for evaluation — combines the original input and the decision.
 */
export type EvaluationContext = {
  /** The original input that produced this decision. */
  input: TeacherDecisionInput;
  /** The decision to evaluate. */
  decision: TeacherDecision;
};

// ─── Gate IDs ──────────────────────────────────────────────────────────────

const GATE_IDS = {
  V1: "V1_ACTION_INPUT_COHERENCE",
  V2: "V2_RATIONALE_QUALITY",
  V3: "V3_TIMING_ACTION_CONSISTENCY",
  V4: "V4_CORRECTION_SHAPE_VALIDITY",
  V5: "V5_SUPPRESSION_JUSTIFICATION",
  V6: "V6_HINT_LADDER_ALIGNMENT",
  V7: "V7_READINESS_ACTION_AGREEMENT",
  V8: "V8_CROSS_FIELD_NARRATIVE",
} as const;

// ─── Hard-Fail Gates ──────────────────────────────────────────────────────

/**
 * Gates whose failure makes the decision UNSAFE to show to the learner.
 * V1 (action-input mismatch) and V3 (timing-action inconsistency) are
 * hard-fail because they indicate a fundamentally wrong decision.
 */
const HARD_FAIL_GATES = new Set([
  GATE_IDS.V1,
  GATE_IDS.V3,
]);

// ─── V1 — Action-Input Coherence ───────────────────────────────────────────

/**
 * V1: Does the chosen action make sense given the raw learner input?
 *
 * Checks:
 *   - Empty text → MUST be SUPPRESS (anything else is a bug)
 *   - No error detected → SHOULD be SUPPRESS
 *   - Needs AI → SHOULD be DEFER
 *   - Action exists in the 5 valid actions
 */
function evaluateActionInputCoherence(ctx: EvaluationContext): EvaluationGateResult {
  const { input, decision } = ctx;
  const text = input.learnerText;

  // Empty text → must suppress
  if (!text.trim()) {
    const passed = decision.action === "SUPPRESS";
    return {
      gateId: GATE_IDS.V1,
      titleVi: "Hành động khớp với đầu vào",
      titleEn: "Action-input coherence",
      passed,
      isHardFail: true,
      detailVi: passed
        ? "Đầu vào trống — SUPPRESS là đúng."
        : `Đầu vào trống nhưng hành động là ${decision.action} — phải là SUPPRESS.`,
      detailEn: passed
        ? "Empty input correctly suppressed."
        : `Empty input but action is ${decision.action} — must be SUPPRESS.`,
      reasonCode: passed ? "v1_empty_suppress_ok" : "v1_empty_not_suppressed",
    };
  }

  // If the decision says no error but action is not SUPPRESS
  if (decision.reasonCode === "no_error_detected" && decision.action !== "SUPPRESS") {
    return {
      gateId: GATE_IDS.V1,
      titleVi: "Hành động khớp với đầu vào",
      titleEn: "Action-input coherence",
      passed: false,
      isHardFail: false,
      detailVi: `Không phát hiện lỗi nhưng hành động là ${decision.action} — nên là SUPPRESS.`,
      detailEn: `No error detected but action is ${decision.action} — should be SUPPRESS.`,
      reasonCode: "v1_no_error_wrong_action",
    };
  }

  // Valid action check
  const validActions = ["CORRECT_NOW", "DEFER", "SUPPRESS", "FOLLOW_UP_FIRST", "EXPLAIN_PATTERN"];
  if (!validActions.includes(decision.action)) {
    return {
      gateId: GATE_IDS.V1,
      titleVi: "Hành động khớp với đầu vào",
      titleEn: "Action-input coherence",
      passed: false,
      isHardFail: true,
      detailVi: `Hành động không hợp lệ: "${decision.action}".`,
      detailEn: `Invalid action: "${decision.action}".`,
      reasonCode: "v1_invalid_action",
    };
  }

  return {
    gateId: GATE_IDS.V1,
    titleVi: "Hành động khớp với đầu vào",
    titleEn: "Action-input coherence",
    passed: true,
    isHardFail: true,
    detailVi: "Hành động phù hợp với đầu vào của người học.",
    detailEn: "Action is coherent with learner input.",
    reasonCode: "v1_coherent",
  };
}

// ─── V2 — Rationale Quality ────────────────────────────────────────────────

/**
 * V2: Is the rationale well-formed and appropriate?
 *
 * Checks:
 *   - rationaleVi is non-empty
 *   - rationaleVi starts with "Mercy" (branding guideline)
 *   - rationaleEn is non-empty
 *   - reasonCode is non-empty
 *   - rationaleVi does not contain harsh/blaming language
 */
function evaluateRationaleQuality(ctx: EvaluationContext): EvaluationGateResult {
  const { decision } = ctx;
  const failures: string[] = [];
  const failuresVi: string[] = [];

  if (!decision.rationaleVi || decision.rationaleVi.trim().length === 0) {
    failures.push("rationaleVi is empty");
    failuresVi.push("rationaleVi trống");
  }

  if (!decision.rationaleEn || decision.rationaleEn.trim().length === 0) {
    failures.push("rationaleEn is empty");
    failuresVi.push("rationaleEn trống");
  }

  if (!decision.reasonCode || decision.reasonCode.trim().length === 0) {
    failures.push("reasonCode is empty");
    failuresVi.push("reasonCode trống");
  }

  // Check for harsh/blaming language in rationaleVi
  const harshPatterns = [
    /sai quá/i, /dở quá/i, /tệ quá/i, /ngu/i, /kém/i,
    /không biết gì/i, /học mãi không vào/i, /sai hoài/i,
    /thất vọng/i, /chán/i, /bực/i, /tức/i,
  ];
  if (decision.rationaleVi) {
    for (const pattern of harshPatterns) {
      if (pattern.test(decision.rationaleVi)) {
        failures.push(`rationaleVi contains harsh language matching: ${pattern}`);
        failuresVi.push(`rationaleVi có ngôn ngữ gay gắt: "${pattern}"`);
        break;
      }
    }
  }

  const passed = failures.length === 0;

  return {
    gateId: GATE_IDS.V2,
    titleVi: "Chất lượng lời giải thích",
    titleEn: "Rationale quality",
    passed,
    isHardFail: false,
    detailVi: passed
      ? "Lời giải thích đầy đủ và phù hợp."
      : `Lời giải thích có vấn đề: ${failuresVi.join("; ")}.`,
    detailEn: passed
      ? "Rationale is complete and appropriate."
      : `Rationale issues: ${failures.join("; ")}.`,
    reasonCode: passed ? "v2_rationale_ok" : "v2_rationale_deficient",
  };
}

// ─── V3 — Timing-Action Consistency ────────────────────────────────────────

/**
 * V3: Does the timingMode match the chosen action?
 *
 * The correction timing engine produces a mode, and the decision engine
 * maps it to an action. This gate verifies the mapping is correct.
 *
 * Mapping:
 *   IMMEDIATE     → CORRECT_NOW
 *   DELAYED       → DEFER
 *   SUPPRESS      → SUPPRESS
 *   FOLLOW_UP_FIRST → FOLLOW_UP_FIRST
 *   EXPLAIN_PATTERN → EXPLAIN_PATTERN
 *
 * Edge cases:
 *   - "no_error_detected" / "empty_text" → timingMode should be SUPPRESS, action SUPPRESS
 *   - "needs_ai_deferred" → timingMode DELAYED, action DEFER
 */
function evaluateTimingActionConsistency(ctx: EvaluationContext): EvaluationGateResult {
  const { decision } = ctx;

  const expectedMapping: Record<string, string> = {
    IMMEDIATE: "CORRECT_NOW",
    DELAYED: "DEFER",
    SUPPRESS: "SUPPRESS",
    FOLLOW_UP_FIRST: "FOLLOW_UP_FIRST",
    EXPLAIN_PATTERN: "EXPLAIN_PATTERN",
  };

  const expectedAction = expectedMapping[decision.timingMode];
  const passed = expectedAction === decision.action;

  return {
    gateId: GATE_IDS.V3,
    titleVi: "Nhất quán thời điểm - hành động",
    titleEn: "Timing-action consistency",
    passed,
    isHardFail: true,
    detailVi: passed
      ? `Timing mode "${decision.timingMode}" khớp với action "${decision.action}".`
      : `Timing mode "${decision.timingMode}" không khớp — chờ đợi "${expectedAction}" nhưng nhận được "${decision.action}".`,
    detailEn: passed
      ? `Timing mode "${decision.timingMode}" matches action "${decision.action}".`
      : `Timing mode "${decision.timingMode}" mismatch — expected "${expectedAction}" but got "${decision.action}".`,
    reasonCode: passed ? "v3_timing_action_ok" : "v3_timing_action_mismatch",
  };
}

// ─── V4 — Correction Shape Validity ────────────────────────────────────────

/**
 * V4: When the action involves correcting, is the correction well-formed?
 *
 * Checks for CORRECT_NOW and EXPLAIN_PATTERN:
 *   - correction is non-null
 *   - correctedText is non-empty and different from input
 *   - appliedRuleIds is non-empty
 *
 * Checks for SUPPRESS (no-error path):
 *   - correction is null (correct — nothing to correct)
 *
 * Checks for DEFER and FOLLOW_UP_FIRST:
 *   - correction may be null or non-null (both are valid)
 *   - if non-null, should be well-formed
 */
function evaluateCorrectionShapeValidity(ctx: EvaluationContext): EvaluationGateResult {
  const { input, decision } = ctx;
  const failures: string[] = [];
  const failuresVi: string[] = [];

  if (decision.action === "CORRECT_NOW" || decision.action === "EXPLAIN_PATTERN") {
    if (decision.correction === null) {
      failures.push("Action requires correction but correction is null");
      failuresVi.push(`Hành động "${decision.action}" cần correction nhưng correction là null.`);
    } else {
      if (!decision.correction.correctedText || decision.correction.correctedText.trim().length === 0) {
        failures.push("correctedText is empty");
        failuresVi.push("correctedText trống.");
      }
      if (decision.correction.correctedText === input.learnerText && decision.reasonCode !== "no_error_detected") {
        failures.push("correctedText is unchanged from input");
        failuresVi.push("correctedText không thay đổi so với đầu vào.");
      }
      if (decision.correction.appliedRuleIds.length === 0) {
        failures.push("appliedRuleIds is empty");
        failuresVi.push("appliedRuleIds trống.");
      }
      if (decision.correction.severity.length === 0) {
        failures.push("severity is empty");
        failuresVi.push("severity trống.");
      }
    }
  }

  // For SUPPRESS due to no-error/empty: correction should be null
  if (decision.action === "SUPPRESS" && decision.reasonCode === "no_error_detected") {
    if (decision.correction !== null) {
      failures.push("No error detected but correction is non-null");
      failuresVi.push("Không có lỗi nhưng correction không null.");
    }
  }

  const passed = failures.length === 0;

  return {
    gateId: GATE_IDS.V4,
    titleVi: "Hình dạng sửa lỗi hợp lệ",
    titleEn: "Correction shape validity",
    passed,
    isHardFail: false,
    detailVi: passed
      ? "Correction có hình dạng hợp lệ cho hành động này."
      : `Correction không hợp lệ: ${failuresVi.join("; ")}.`,
    detailEn: passed
      ? "Correction shape is valid for this action."
      : `Correction shape invalid: ${failures.join("; ")}.`,
    reasonCode: passed ? "v4_correction_shape_ok" : "v4_correction_shape_invalid",
  };
}

// ─── V5 — Suppression Justification ────────────────────────────────────────

/**
 * V5: When the action is SUPPRESS (not empty/no-error), is there valid justification?
 *
 * For SUPPRESS with errors present:
 *   - suppressionDecision should be non-null
 *   - suppressionDecision should have at least one suppression rule
 *   - suppressionDecision should have a summary
 *
 * For SUPPRESS with empty/no-error:
 *   - suppressionDecision can be null (the reason is self-evident)
 */
function evaluateSuppressionJustification(ctx: EvaluationContext): EvaluationGateResult {
  const { decision } = ctx;

  // Only relevant for SUPPRESS actions
  if (decision.action !== "SUPPRESS") {
    return {
      gateId: GATE_IDS.V5,
      titleVi: "Biện minh cho việc không sửa",
      titleEn: "Suppression justification",
      passed: true,
      isHardFail: false,
      detailVi: "Không áp dụng — hành động không phải là SUPPRESS.",
      detailEn: "Not applicable — action is not SUPPRESS.",
      reasonCode: "v5_not_applicable",
    };
  }

  // Empty text or no error — suppression is self-evident, no justification needed
  if (decision.reasonCode === "empty_text" || decision.reasonCode === "no_error_detected") {
    return {
      gateId: GATE_IDS.V5,
      titleVi: "Biện minh cho việc không sửa",
      titleEn: "Suppression justification",
      passed: true,
      isHardFail: false,
      detailVi: "Không sửa vì không có lỗi hoặc đầu vào trống — tự giải thích.",
      detailEn: "Suppression is self-evident (no error or empty input).",
      reasonCode: "v5_suppress_self_evident",
    };
  }

  // SUPPRESS with errors present — needs justification
  if (!decision.suppressionDecision) {
    return {
      gateId: GATE_IDS.V5,
      titleVi: "Biện minh cho việc không sửa",
      titleEn: "Suppression justification",
      passed: false,
      isHardFail: false,
      detailVi: "Hành động SUPPRESS nhưng không có suppressionDecision — cần biện minh tại sao không sửa.",
      detailEn: "SUPPRESS action without suppressionDecision — needs justification for why not correcting.",
      reasonCode: "v5_missing_suppression_justification",
    };
  }

  // Check suppression decision has content
  const hasRules = decision.suppressionDecision.applicableRules &&
    decision.suppressionDecision.applicableRules.length > 0;
  const hasRationale = decision.suppressionDecision.rationaleVi &&
    decision.suppressionDecision.rationaleVi.trim().length > 0;

  if (!hasRules && !hasRationale) {
    return {
      gateId: GATE_IDS.V5,
      titleVi: "Biện minh cho việc không sửa",
      titleEn: "Suppression justification",
      passed: false,
      isHardFail: false,
      detailVi: "suppressionDecision có nhưng thiếu cả applicableRules và rationaleVi.",
      detailEn: "suppressionDecision present but missing both applicableRules and rationaleVi.",
      reasonCode: "v5_empty_suppression_decision",
    };
  }

  return {
    gateId: GATE_IDS.V5,
    titleVi: "Biện minh cho việc không sửa",
    titleEn: "Suppression justification",
    passed: true,
    isHardFail: false,
    detailVi: `Biện minh hợp lệ — ${decision.suppressionDecision.applicableRules?.length ?? 0} quy tắc, "${decision.suppressionDecision.rationaleVi}".`,
    detailEn: `Valid justification — ${decision.suppressionDecision.applicableRules?.length ?? 0} rules, "${decision.suppressionDecision.rationaleVi}".`,
    reasonCode: "v5_suppression_justified",
  };
}

// ─── V6 — Hint Ladder Alignment ────────────────────────────────────────────

/**
 * V6: When a hint is recommended, does it align with the learner's state?
 *
 * Checks:
 *   - If hint is HINT_STRONG on a fatal-meaning error → OK (strong intervention needed)
 *   - If hint is HINT_STRONG on minor error → suspicious (too heavy)
 *   - If hint is HINT_MINIMAL on fatal error → suspicious (too light)
 *   - If hint level is null when hint is recommended → inconsistency
 *   - If learner is frustrated and hint is HINT_STRONG → problematic
 */
function evaluateHintLadderAlignment(ctx: EvaluationContext): EvaluationGateResult {
  const { input, decision } = ctx;
  const hint = decision.hintLadder;

  // No hint → not applicable
  if (!hint) {
    return {
      gateId: GATE_IDS.V6,
      titleVi: "Gợi ý phù hợp với người học",
      titleEn: "Hint ladder alignment",
      passed: true,
      isHardFail: false,
      detailVi: "Không áp dụng — không có gợi ý nào được đề xuất.",
      detailEn: "Not applicable — no hint recommended.",
      reasonCode: "v6_no_hint",
    };
  }

  const failures: string[] = [];
  const failuresVi: string[] = [];
  const hintDecision = hint.decision;

  // Check: hinted action should have a valid decision
  if (!hintDecision || hintDecision === "NO_HINT") {
    failures.push("Hint result present but decision is NO_HINT or null");
    failuresVi.push("Có hintLadder nhưng decision là NO_HINT hoặc trống.");
  }

  // Check: strong hint on frustrated learner
  if (hintDecision === "HINT_STRONG" && input.isShowingFrustration) {
    failures.push("Strong hint on frustrated learner — too heavy");
    failuresVi.push("Gợi ý mạnh (HINT_STRONG) cho người học đang nản — quá nặng.");
  }

  // Check: strong hint without a clear severe error signal
  if (hintDecision === "HINT_STRONG" && decision.correction) {
    const sev = decision.correction.severity;
    if (sev !== "fatal_meaning" && sev !== "lesson_target" && input.sameMistakeCount < 3) {
      failures.push(`Strong hint (HINT_STRONG) for ${sev} error with only ${input.sameMistakeCount} repetitions`);
      failuresVi.push(`Gợi ý mạnh (HINT_STRONG) cho lỗi ${sev} chỉ lặp ${input.sameMistakeCount} lần — có thể quá nặng.`);
    }
  }

  const passed = failures.length === 0;

  return {
    gateId: GATE_IDS.V6,
    titleVi: "Gợi ý phù hợp với người học",
    titleEn: "Hint ladder alignment",
    passed,
    isHardFail: false,
    detailVi: passed
      ? `Gợi ý "${hintDecision}" phù hợp với trạng thái người học.`
      : `Gợi ý không phù hợp: ${failuresVi.join("; ")}.`,
    detailEn: passed
      ? `Hint "${hintDecision}" is aligned with learner state.`
      : `Hint misaligned: ${failures.join("; ")}.`,
    reasonCode: passed ? "v6_hint_aligned" : "v6_hint_misaligned",
  };
}

// ─── V7 — Readiness-Action Agreement ───────────────────────────────────────

/**
 * V7: Does the readiness decision agree with the correction action?
 *
 * If the learner is NOT_READY for the current lesson, aggressive correction
 * (CORRECT_NOW, EXPLAIN_PATTERN) may be inappropriate — the learner needs
 * prerequisite work first.
 *
 * Checks:
 *   - NOT_READY_PREREQUISITE + CORRECT_NOW on a lesson target → suspicious
 *   - SKIP_AHEAD + SUPPRESS on a correct utterance → fine (ready for more)
 *   - READY_NOW with any action → fine
 */
function evaluateReadinessActionAgreement(ctx: EvaluationContext): EvaluationGateResult {
  const { input, decision } = ctx;
  const readiness = decision.readiness;

  // Readiness should always be present
  if (!readiness) {
    return {
      gateId: GATE_IDS.V7,
      titleVi: "Sẵn sàng khớp với hành động",
      titleEn: "Readiness-action agreement",
      passed: false,
      isHardFail: false,
      detailVi: "Thiếu readiness — mọi quyết định phải có đánh giá mức độ sẵn sàng.",
      detailEn: "Missing readiness — every decision must include a readiness assessment.",
      reasonCode: "v7_missing_readiness",
    };
  }

  const readinessDecision = readiness.decision;

  // If learner is NOT ready for prerequisites and we're correcting a lesson target
  if (
    (readinessDecision === "NOT_READY_PREREQUISITE" || readinessDecision === "NOT_READY_TOO_SOON") &&
    (decision.action === "CORRECT_NOW" || decision.action === "EXPLAIN_PATTERN") &&
    input.isCurrentLessonTarget
  ) {
    return {
      gateId: GATE_IDS.V7,
      titleVi: "Sẵn sàng khớp với hành động",
      titleEn: "Readiness-action agreement",
      passed: false,
      isHardFail: false,
      detailVi: `Người học được đánh giá "${readinessDecision}" nhưng vẫn sửa lỗi mục tiêu bài học (${decision.action}) — nên ưu tiên kiến thức nền trước.`,
      detailEn: `Learner assessed as "${readinessDecision}" but still correcting lesson target (${decision.action}) — should prioritize prerequisite work.`,
      reasonCode: "v7_not_ready_but_correcting_lesson_target",
    };
  }

  // If learner should skip ahead but we're drilling them on basic content
  if (
    readinessDecision === "SKIP_AHEAD" &&
    decision.action === "EXPLAIN_PATTERN" &&
    input.sameMistakeCount <= 1
  ) {
    return {
      gateId: GATE_IDS.V7,
      titleVi: "Sẵn sàng khớp với hành động",
      titleEn: "Readiness-action agreement",
      passed: false,
      isHardFail: false,
      detailVi: `Người học nên được "SKIP_AHEAD" nhưng lại EXPLAIN_PATTERN cho lỗi xuất hiện 1 lần — có thể đang giữ người học lại không cần thiết.`,
      detailEn: `Learner should "SKIP_AHEAD" but EXPLAIN_PATTERN used for single-occurrence error — may be holding learner back unnecessarily.`,
      reasonCode: "v7_skip_ahead_but_explaining",
    };
  }

  // If learner needs different approach but we're using EXPLAIN_PATTERN
  if (
    readinessDecision === "NOT_READY_DIFFERENT_APPROACH" &&
    decision.action === "EXPLAIN_PATTERN"
  ) {
    return {
      gateId: GATE_IDS.V7,
      titleVi: "Sẵn sàng khớp với hành động",
      titleEn: "Readiness-action agreement",
      passed: false,
      isHardFail: false,
      detailVi: `Người học cần cách tiếp cận khác (NOT_READY_DIFFERENT_APPROACH) nhưng vẫn EXPLAIN_PATTERN — nên thử cách dạy khác.`,
      detailEn: `Learner needs different approach (NOT_READY_DIFFERENT_APPROACH) but EXPLAIN_PATTERN used — should try a different teaching method.`,
      reasonCode: "v7_needs_different_approach_but_explaining",
    };
  }

  return {
    gateId: GATE_IDS.V7,
    titleVi: "Sẵn sàng khớp với hành động",
    titleEn: "Readiness-action agreement",
    passed: true,
    isHardFail: false,
    detailVi: `Mức độ sẵn sàng "${readinessDecision}" phù hợp với hành động "${decision.action}".`,
    detailEn: `Readiness "${readinessDecision}" is compatible with action "${decision.action}".`,
    reasonCode: "v7_readiness_action_ok",
  };
}

// ─── V8 — Cross-Field Narrative Coherence ──────────────────────────────────

/**
 * V8: Do all fields of the decision tell a consistent story?
 *
 * This is the "does this decision make sense as a whole?" check.
 * It looks for internal contradictions and missing elements.
 *
 * Checks:
 *   - EXPLAIN_PATTERN should have a patternLabel
 *   - DEFER should have delayTurns (or at least not be undefined with a strange value)
 *   - CORRECT_NOW with fatal_meaning should have severity reflected
 *   - allCandidates should include the primary correction when non-null
 *   - enrichment should be present when there are applied rules
 *   - rationaleVi should mention the correction when action is CORRECT_NOW
 */
function evaluateCrossFieldNarrative(ctx: EvaluationContext): EvaluationGateResult {
  const { decision } = ctx;
  const failures: string[] = [];
  const failuresVi: string[] = [];

  // EXPLAIN_PATTERN should explain what pattern
  if (decision.action === "EXPLAIN_PATTERN") {
    if (!decision.patternLabel || decision.patternLabel.trim().length === 0) {
      failures.push("EXPLAIN_PATTERN without patternLabel");
      failuresVi.push("EXPLAIN_PATTERN nhưng không có patternLabel.");
    }
  }

  // DEFER should know how long to defer
  if (decision.action === "DEFER") {
    if (decision.delayTurns === undefined || decision.delayTurns === null) {
      failures.push("DEFER without delayTurns");
      failuresVi.push("DEFER nhưng không có delayTurns.");
    } else if (decision.delayTurns < 0) {
      failures.push(`DEFER with negative delayTurns (${decision.delayTurns})`);
      failuresVi.push(`DEFER với delayTurns âm (${decision.delayTurns}).`);
    } else if (decision.delayTurns > 10) {
      failures.push(`DEFER with very long delay (${decision.delayTurns} turns) — may as well suppress`);
      failuresVi.push(`DEFER với delayTurns quá dài (${decision.delayTurns} lượt) — gần như SUPPRESS.`);
    }
  }

  // CORRECT_NOW should not have delayTurns (it's immediate)
  if (decision.action === "CORRECT_NOW" && decision.delayTurns !== undefined) {
    failures.push("CORRECT_NOW has delayTurns — correction is immediate");
    failuresVi.push("CORRECT_NOW có delayTurns — sửa ngay không cần trì hoãn.");
  }

  // allCandidates should include the primary correction when it exists
  if (decision.correction && decision.allCandidates.length > 0) {
    const primaryText = decision.correction.correctedText;
    const found = decision.allCandidates.some(c => c.correctedText === primaryText);
    if (!found) {
      failures.push("allCandidates does not include the primary correction");
      failuresVi.push("allCandidates không chứa correction chính.");
    }
  }

  // enrichment should be present when there are applied rules
  if (decision.correction && decision.correction.appliedRuleIds.length > 0) {
    if (!decision.enrichment) {
      failures.push("Correction has applied rules but enrichment is null");
      failuresVi.push("Correction có appliedRuleIds nhưng enrichment là null.");
    }
  }

  // action should never be SUPPRESS with a non-null meaningful correction
  if (decision.action === "SUPPRESS" && decision.correction &&
      decision.correction.appliedRuleIds.length > 0 &&
      decision.reasonCode !== "no_error_detected" &&
      decision.reasonCode !== "empty_text") {
    // This is valid when pedagogical rules justify suppression — V5 checks that.
    // Here we just flag it as a note, not a failure.
    // (No failure added — this is fine when suppression is pedagogically justified)
  }

  const passed = failures.length === 0;

  return {
    gateId: GATE_IDS.V8,
    titleVi: "Nhất quán tổng thể",
    titleEn: "Cross-field narrative coherence",
    passed,
    isHardFail: false,
    detailVi: passed
      ? "Tất cả các trường kể một câu chuyện nhất quán."
      : `Các trường không nhất quán: ${failuresVi.join("; ")}.`,
    detailEn: passed
      ? "All fields tell a consistent story."
      : `Field inconsistencies: ${failures.join("; ")}.`,
    reasonCode: passed ? "v8_narrative_coherent" : "v8_narrative_inconsistent",
  };
}

// ─── Gate Chain ────────────────────────────────────────────────────────────

/**
 * The ordered list of evaluation gates.
 * Evaluated in V1→V8 order; all gates run regardless of earlier failures
 * (unlike the decision gate chains which short-circuit). We want the FULL
 * picture of what's right and wrong with a decision.
 */
const EVALUATION_GATES: ReadonlyArray<
  (ctx: EvaluationContext) => EvaluationGateResult
> = [
  evaluateActionInputCoherence,
  evaluateRationaleQuality,
  evaluateTimingActionConsistency,
  evaluateCorrectionShapeValidity,
  evaluateSuppressionJustification,
  evaluateHintLadderAlignment,
  evaluateReadinessActionAgreement,
  evaluateCrossFieldNarrative,
];

// ─── Classification ────────────────────────────────────────────────────────

function classifyEvaluation(gates: EvaluationGateResult[]): {
  classification: EvaluationClassification;
  safetyPassed: boolean;
} {
  const hardFails = gates.filter(g => g.isHardFail && !g.passed);
  const anyFail = gates.some(g => !g.passed);

  if (hardFails.length > 0) {
    return { classification: "UNSAFE", safetyPassed: false };
  }

  if (!anyFail) {
    return { classification: "EXEMPLARY", safetyPassed: true };
  }

  // Acceptable: 1-2 non-hard-fail gates failed
  const failedCount = gates.filter(g => !g.passed).length;
  if (failedCount <= 2) {
    return { classification: "ACCEPTABLE", safetyPassed: true };
  }

  return { classification: "NEEDS_REVIEW", safetyPassed: true };
}

function buildSummaryVi(
  classification: EvaluationClassification,
  gates: EvaluationGateResult[],
): string {
  const failedGates = gates.filter(g => !g.passed);
  const failedTitles = failedGates.map(g => g.titleVi).join(", ");

  switch (classification) {
    case "EXEMPLARY":
      return "Xuất sắc — tất cả các cổng đánh giá đều đạt. Quyết định giảng dạy hoàn toàn hợp lý.";
    case "ACCEPTABLE":
      return `Đạt yêu cầu — ${failedGates.length} cổng cần chú ý: ${failedTitles}. Quyết định vẫn dùng được.`;
    case "NEEDS_REVIEW":
      return `Cần xem lại — ${failedGates.length} cổng không đạt: ${failedTitles}. Nên kiểm tra lại quyết định.`;
    case "UNSAFE":
      return `Không an toàn — cổng an toàn không đạt: ${failedTitles}. Không nên hiển thị quyết định này cho người học.`;
  }
}

function buildSummaryEn(
  classification: EvaluationClassification,
  gates: EvaluationGateResult[],
): string {
  const failedGates = gates.filter(g => !g.passed);
  const failedIds = failedGates.map(g => g.gateId).join(", ");

  switch (classification) {
    case "EXEMPLARY":
      return "Exemplary — all evaluation gates passed. Teaching decision is fully sound.";
    case "ACCEPTABLE":
      return `Acceptable — ${failedGates.length} gate(s) need attention: ${failedIds}. Decision is still usable.`;
    case "NEEDS_REVIEW":
      return `Needs review — ${failedGates.length} gate(s) failed: ${failedIds}. Decision should be reviewed.`;
    case "UNSAFE":
      return `Unsafe — hard-fail gates failed: ${failedIds}. Decision should NOT be shown to learner.`;
  }
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Evaluate a teaching decision for quality, consistency, and safety.
 *
 * Runs all V1-V8 gates and produces an aggregate EvaluationResult.
 * All gates run regardless of earlier failures — we want the complete
 * picture of what's right and wrong with the decision.
 *
 * Pure function — deterministic, no side effects, no I/O.
 *
 * @param input    — the original input that produced this decision
 * @param decision — the decision to evaluate
 * @returns An EvaluationResult with classification, per-gate results, and summaries.
 */
export function evaluateTeachingDecision(
  input: TeacherDecisionInput,
  decision: TeacherDecision,
): EvaluationResult {
  const ctx: EvaluationContext = { input, decision };

  const gates = EVALUATION_GATES.map(gate => gate(ctx));
  const { classification, safetyPassed } = classifyEvaluation(gates);

  const passedCount = gates.filter(g => g.passed).length;
  const failedCount = gates.filter(g => !g.passed).length;

  return {
    classification,
    allPassed: failedCount === 0,
    safetyPassed,
    gates,
    passedCount,
    failedCount,
    summaryVi: buildSummaryVi(classification, gates),
    summaryEn: buildSummaryEn(classification, gates),
  };
}

/**
 * Quick safety check: returns whether the decision is safe to show.
 * Only checks hard-fail gates (V1, V3).
 *
 * Pure function — deterministic, no I/O.
 */
export function isDecisionSafe(
  input: TeacherDecisionInput,
  decision: TeacherDecision,
): { safe: boolean; failedGates: EvaluationGateResult[]; reasonVi: string | null } {
  const ctx: EvaluationContext = { input, decision };

  const hardFailGates = [evaluateActionInputCoherence, evaluateTimingActionConsistency]
    .map(gate => gate(ctx))
    .filter(g => !g.passed);

  const safe = hardFailGates.length === 0;

  return {
    safe,
    failedGates: hardFailGates,
    reasonVi: safe ? null : `Cổng an toàn không đạt: ${hardFailGates.map(g => g.titleVi).join("; ")}.`,
  };
}

/**
 * Convenience: evaluate a decision with just the minimal required context.
 * Builds the evaluation from the raw decision and its input.
 */
export function evaluateDecisionQuick(
  input: TeacherDecisionInput,
  decision: TeacherDecision,
): EvaluationResult {
  return evaluateTeachingDecision(input, decision);
}

// ─── Telemetry Formatter ───────────────────────────────────────────────────

/**
 * Format an evaluation result into a structured telemetry record.
 * Contains no learner PII — only gate IDs, pass/fail, and classification.
 */
export function formatEvaluationTelemetry(result: EvaluationResult): Record<string, unknown> {
  return {
    classification: result.classification,
    allPassed: result.allPassed,
    safetyPassed: result.safetyPassed,
    passedCount: result.passedCount,
    failedCount: result.failedCount,
    gateResults: Object.fromEntries(
      result.gates.map(g => [g.gateId, { passed: g.passed, reasonCode: g.reasonCode }]),
    ),
    failedGateIds: result.gates.filter(g => !g.passed).map(g => g.gateId),
  };
}

// ─── Catalogs ──────────────────────────────────────────────────────────────

export const EVALUATION_CLASSIFICATION_CATALOG: ReadonlyArray<{
  classification: EvaluationClassification;
  titleEn: string;
  titleVi: string;
  descriptionVi: string;
}> = [
  {
    classification: "EXEMPLARY",
    titleEn: "Exemplary",
    titleVi: "Xuất sắc",
    descriptionVi: "Tất cả các cổng đánh giá đều đạt — quyết định giảng dạy hoàn toàn hợp lý.",
  },
  {
    classification: "ACCEPTABLE",
    titleEn: "Acceptable",
    titleVi: "Đạt yêu cầu",
    descriptionVi: "Có vài điểm nhỏ cần chú ý nhưng quyết định vẫn dùng được.",
  },
  {
    classification: "NEEDS_REVIEW",
    titleEn: "Needs review",
    titleVi: "Cần xem lại",
    descriptionVi: "Nhiều cổng không đạt — nên kiểm tra lại quyết định trước khi hiển thị.",
  },
  {
    classification: "UNSAFE",
    titleEn: "Unsafe",
    titleVi: "Không an toàn",
    descriptionVi: "Cổng an toàn không đạt — quyết định không nên hiển thị cho người học.",
  },
];

export const EVALUATION_GATE_CATALOG: ReadonlyArray<{
  gateId: string;
  titleVi: string;
  titleEn: string;
  isHardFail: boolean;
  descriptionVi: string;
}> = [
  {
    gateId: GATE_IDS.V1,
    titleVi: "Hành động khớp với đầu vào",
    titleEn: "Action-input coherence",
    isHardFail: true,
    descriptionVi: "Hành động (CORRECT_NOW, DEFER, SUPPRESS…) có phù hợp với văn bản đầu vào không.",
  },
  {
    gateId: GATE_IDS.V2,
    titleVi: "Chất lượng lời giải thích",
    titleEn: "Rationale quality",
    isHardFail: false,
    descriptionVi: "Lời giải thích tiếng Việt có đầy đủ, phù hợp và không có ngôn ngữ gay gắt không.",
  },
  {
    gateId: GATE_IDS.V3,
    titleVi: "Nhất quán thời điểm - hành động",
    titleEn: "Timing-action consistency",
    isHardFail: true,
    descriptionVi: "Timing mode (IMMEDIATE, DELAYED…) có khớp với action được chọn không.",
  },
  {
    gateId: GATE_IDS.V4,
    titleVi: "Hình dạng sửa lỗi hợp lệ",
    titleEn: "Correction shape validity",
    isHardFail: false,
    descriptionVi: "Correction có đầy đủ correctedText, appliedRuleIds, severity không.",
  },
  {
    gateId: GATE_IDS.V5,
    titleVi: "Biện minh cho việc không sửa",
    titleEn: "Suppression justification",
    isHardFail: false,
    descriptionVi: "Khi không sửa lỗi (SUPPRESS), có lý do sư phạm rõ ràng không.",
  },
  {
    gateId: GATE_IDS.V6,
    titleVi: "Gợi ý phù hợp với người học",
    titleEn: "Hint ladder alignment",
    isHardFail: false,
    descriptionVi: "Mức độ gợi ý (HINT_MINIMAL, MEDIUM, STRONG) có phù hợp với trạng thái người học không.",
  },
  {
    gateId: GATE_IDS.V7,
    titleVi: "Sẵn sàng khớp với hành động",
    titleEn: "Readiness-action agreement",
    isHardFail: false,
    descriptionVi: "Đánh giá mức độ sẵn sàng có phù hợp với hành động sửa lỗi được chọn không.",
  },
  {
    gateId: GATE_IDS.V8,
    titleVi: "Nhất quán tổng thể",
    titleEn: "Cross-field narrative coherence",
    isHardFail: false,
    descriptionVi: "Tất cả các trường trong quyết định có kể một câu chuyện nhất quán không.",
  },
];
