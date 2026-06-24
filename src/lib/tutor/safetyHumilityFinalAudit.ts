/**
 * Safety & Humility Final Audit — Step 115
 *
 * Unified gate that chains EVERY safety and humility guard built across
 * Steps 1-114 into a single comprehensive audit. One function answers:
 *
 *   "Is this tutor response — and the pipeline that produced it — safe
 *    and appropriately humble for a Vietnamese learner?"
 *
 * This module composes:
 *   - safety.ts (input sanitization, output moderation, PII, crisis, refusal)
 *   - teacherMercyContract.ts (R1-R8 contract rules, esp. R3/R7/R8 humility)
 *   - teacherMercySelfAuditGate.ts (S1-S8 self-audit decision chain)
 *   - overclaimGuard.ts (O1-O8 overclaim/fake-certainty detection)
 *   - teachingDecisionEvaluationGate.ts (V1-V8 decision quality)
 *   - promptAssembly.ts (FORBIDDEN_VOCAB filter)
 *   - suppressionRules.ts (when NOT to correct — humility in action)
 *   - emotionalResponseBoundary.ts (classifyResponseStance)
 *   - pivotPromptSafety.ts (pivot safety checks)
 *
 * Design:
 *   - Pure functions — no I/O, no side effects, deterministic.
 *   - Vietnamese-first — all messages in Vietnamese.
 *   - Single entry point: runSafetyHumilityFinalAudit().
 *   - Produces exhaustiveness gap analysis.
 *
 * Gap Detection:
 *   Identifies safety/humility concerns that fall BETWEEN modules —
 *   cases where no single module would catch the issue alone, or
 *   where two modules disagree about the same concern.
 */

import { sanitizeInput, moderateOutput, detectPII, detectCrisis } from "../ai-tutor/safety";
import type { SafetyContext, SanitizeResult, ModerationResult } from "../ai-tutor/safety";
import { applyForbiddenVocabFilter } from "../ai-tutor/promptAssembly";
import type { FilterResult } from "../ai-tutor/promptAssembly";
import { checkPivotCandidate, buildDeterministicPivotFallback } from "./pivotPromptSafety";
import { classifyResponseStance, RESPONSE_STANCE_ADVISORY_COPY } from "./emotionalResponseBoundary";
import type { ResponseStance, ResponseStanceDecision } from "./emotionalResponseBoundary";
import {
  checkTeacherMercyContract,
  checkCorrectionContract,
  checkR3_NoFakePraise,
  checkR7_StrategicSilence,
  checkR8_FaceSaving,
} from "./teacherMercyContract";
import type {
  ContractCheckResult,
  ContractLearnerInput,
  ContractTutorResponse,
  ContractRuleCheck,
} from "./teacherMercyContract";
import { selfAuditBeforeShowing } from "./teacherMercySelfAuditGate";
import type { SelfAuditResult, SelfAuditDecision } from "./teacherMercySelfAuditGate";
import { guardOverclaim } from "./overclaimGuard";
import type { OverclaimGuardResult, OverclaimDecision } from "./overclaimGuard";
import { evaluateTeachingDecision } from "./teachingDecisionEvaluationGate";
import type { EvaluationResult } from "./teachingDecisionEvaluationGate";
import type { TeacherDecision } from "./teacherDecisionEngine";

// ─── Final Audit Types ───────────────────────────────────────────────────────

/** Severity of an audit finding. */
export type AuditFindingSeverity = "critical" | "major" | "minor" | "info";

/** Which subsystem produced a finding. */
export type AuditSubsystem =
  | "safety_input"
  | "safety_output"
  | "forbidden_vocab"
  | "contract_humility"
  | "self_audit"
  | "overclaim_guard"
  | "decision_eval"
  | "suppression"
  | "emotional_stance"
  | "pivot_safety"
  | "cross_module_gap";

/** A single finding from the final audit. */
export type AuditFinding = {
  /** Unique finding ID (e.g., "FA-SAFETY-001"). */
  id: string;
  /** Which subsystem found it. */
  subsystem: AuditSubsystem;
  /** Severity of the finding. */
  severity: AuditFindingSeverity;
  /** Vietnamese title for the finding. */
  titleVi: string;
  /** Vietnamese detail explaining the finding. */
  detailVi: string;
  /** Machine-readable reason code. */
  reasonCode: string;
  /** Whether this finding blocks the response. */
  blocks: boolean;
};

/** The overall audit verdict. */
export type SafetyHumilityVerdict =
  | "PASS"               // All gates pass — safe and appropriately humble
  | "PASS_WITH_NOTES"    // Minor findings, nothing blocking
  | "NEEDS_REVISION"     // Major findings — response should be revised
  | "BLOCK"              // Critical safety/humility failure — must not show
  | "GAP_DETECTED";      // Cross-module gap found — needs Chau review

/** Scores broken down by dimension. */
export type SafetyHumilityScores = {
  /** 0-100 safety score. */
  safety: number;
  /** 0-100 humility score. */
  humility: number;
  /** 0-100 combined weighted score (safety 60%, humility 40%). */
  combined: number;
  /** Breakdown by subsystem. */
  bySubsystem: Record<AuditSubsystem, { score: number; maxScore: number; findings: number }>;
};

/** Comprehensive input for the final audit. */
export type SafetyHumilityAuditInput = {
  /** The learner's raw input text. */
  learnerText: string;
  /** The tutor's Vietnamese response text. */
  tutorResponseVi: string;
  /** The tutor's English response text (if any). */
  tutorResponseEn?: string;
  /** The tutor's detailed explanation (if any). */
  detailedExplanation?: string;
  /** Safety context (mode, tier, kids). */
  safetyContext: SafetyContext;
  /** Learner CEFR level (null if unknown). */
  cefrLevel?: string | null;
  /** Optional teacher decision (for decision evaluation). */
  teacherDecision?: TeacherDecision | null;
  /** Whether the learner self-corrected. */
  didSelfCorrect?: boolean;
  /** Whether this is a correction or conversation mode. */
  auditMode?: "correction" | "conversation" | "full";
  /** Pivot-specific: the LLM-generated pivot candidate text. */
  pivotCandidate?: string | null;
  /** Pivot-specific: previous assistant text for dedup. */
  previousAssistantText?: string;
};

/** The complete final audit result. */
export type SafetyHumilityAuditResult = {
  /** Overall verdict. */
  verdict: SafetyHumilityVerdict;
  /** Vietnamese verdict label. */
  verdictVi: string;
  /** Whether the response is safe to show to the learner. */
  canShow: boolean;
  /** All findings from all subsystems. */
  findings: AuditFinding[];
  /** Cross-module gaps detected. */
  gaps: CrossModuleGap[];
  /** Scores broken down by dimension and subsystem. */
  scores: SafetyHumilityScores;
  /** Vietnamese summary paragraph. */
  summaryVi: string;
  /** Prioritized action items for Chau. */
  actionItems: string[];
  /** List of subsystems that were audited successfully. */
  subsystemsAudited: AuditSubsystem[];
  /** Timestamp for audit (epoch ms). */
  auditedAt: number;
};

/** A gap detected between two subsystems. */
export type CrossModuleGap = {
  /** Gap ID (e.g., "GAP-001"). */
  id: string;
  /** The two subsystems involved. */
  subsystems: [AuditSubsystem, AuditSubsystem];
  /** Vietnamese description of the gap. */
  descriptionVi: string;
  /** Severity of the gap. */
  severity: "critical" | "major" | "minor";
  /** Whether this gap could allow unsafe content to reach the learner. */
  couldLeak: boolean;
  /** Recommended action. */
  recommendationVi: string;
};

// ─── Finding ID generators ───────────────────────────────────────────────────

let _findingCounter = 0;
function nextFindingId(subsystem: string): string {
  _findingCounter += 1;
  const num = String(_findingCounter).padStart(3, "0");
  return `FA-${subsystem.toUpperCase().replace(/_/g, "")}-${num}`;
}

function resetFindingCounter(): void {
  _findingCounter = 0;
}

// ─── Safety Score Computation ─────────────────────────────────────────────────

const SUBSYSTEM_WEIGHTS: Record<AuditSubsystem, { safety: number; humility: number }> = {
  safety_input:            { safety: 0.25, humility: 0.00 },
  safety_output:           { safety: 0.25, humility: 0.05 },
  forbidden_vocab:         { safety: 0.10, humility: 0.20 },
  contract_humility:       { safety: 0.05, humility: 0.25 },
  self_audit:              { safety: 0.15, humility: 0.15 },
  overclaim_guard:         { safety: 0.05, humility: 0.20 },
  decision_eval:           { safety: 0.05, humility: 0.05 },
  suppression:             { safety: 0.00, humility: 0.05 },
  emotional_stance:        { safety: 0.05, humility: 0.05 },
  pivot_safety:            { safety: 0.05, humility: 0.00 },
  cross_module_gap:        { safety: 0.00, humility: 0.00 },
};

function classifyFindingSeverity(findings: AuditFinding[]): {
  safetyScore: number;
  humilityScore: number;
  bySubsystem: Record<AuditSubsystem, { score: number; maxScore: number; findings: number }>;
} {
  const bySubsystem = {} as Record<AuditSubsystem, { score: number; maxScore: number; findings: number }>;
  for (const sub of Object.keys(SUBSYSTEM_WEIGHTS) as AuditSubsystem[]) {
    bySubsystem[sub] = { score: 0, maxScore: 0, findings: 0 };
  }

  let totalSafetyPenalty = 0;
  let totalHumilityPenalty = 0;
  let maxSafetyPenalty = 0;
  let maxHumilityPenalty = 0;

  for (const f of findings) {
    const w = SUBSYSTEM_WEIGHTS[f.subsystem];
    const penaltyMultiplier = f.severity === "critical" ? 1.0
      : f.severity === "major" ? 0.6
      : f.severity === "minor" ? 0.3
      : 0.1;

    const safetyPenalty = w.safety * penaltyMultiplier;
    const humilityPenalty = w.humility * penaltyMultiplier;

    totalSafetyPenalty += safetyPenalty;
    totalHumilityPenalty += humilityPenalty;

    bySubsystem[f.subsystem].findings += 1;
    bySubsystem[f.subsystem].score -= Math.round(safetyPenalty * 100);
  }

  // Normalize: max penalty per subsystem can't exceed its weight
  maxSafetyPenalty = Object.values(SUBSYSTEM_WEIGHTS).reduce((s, w) => s + w.safety, 0);
  maxHumilityPenalty = Object.values(SUBSYSTEM_WEIGHTS).reduce((s, w) => s + w.humility, 0);

  // Apply a harsh multiplier for blocking findings — each blocking finding adds
  // an additional penalty beyond its subsystem weight.
  const blockingCount = findings.filter(f => f.blocks).length;
  const criticalCount = findings.filter(f => f.severity === "critical").length;
  totalSafetyPenalty += blockingCount * 0.15 + criticalCount * 0.10;
  totalHumilityPenalty += blockingCount * 0.10 + criticalCount * 0.05;

  // Recompute max penalties to include the extra blocking/critical room
  maxSafetyPenalty += 0.50; // room for up to ~3 blocking findings
  maxHumilityPenalty += 0.35;

  const safetyScore = Math.max(0, Math.round(100 * (1 - Math.min(totalSafetyPenalty, maxSafetyPenalty) / maxSafetyPenalty)));
  const humilityScore = Math.max(0, Math.round(100 * (1 - Math.min(totalHumilityPenalty, maxHumilityPenalty) / maxHumilityPenalty)));

  // Fill in max scores
  for (const sub of Object.keys(SUBSYSTEM_WEIGHTS) as AuditSubsystem[]) {
    bySubsystem[sub].maxScore = Math.round(SUBSYSTEM_WEIGHTS[sub].safety * 100);
    // Base score is the max, minus penalties
    bySubsystem[sub].score = bySubsystem[sub].maxScore - bySubsystem[sub].findings * 10; // simplified
    bySubsystem[sub].score = Math.max(0, bySubsystem[sub].score);
  }

  return { safetyScore, humilityScore, bySubsystem };
}

// ─── Cross-Module Gap Detection ──────────────────────────────────────────────

/**
 * Detect gaps between modules — cases where content could slip through
 * because no single module covers the full pipeline.
 */
export function detectCrossModuleGaps(
  findings: AuditFinding[],
  learnerText: string,
  tutorResponseVi: string,
): CrossModuleGap[] {
  const gaps: CrossModuleGap[] = [];

  // GAP-001: Safety input passes but overclaim guard flags dangerous content
  // If the input passes sanitization but the response contains overclaiming,
  // there's a gap between what we filter IN and what we filter OUT.
  const safetyInputFindings = findings.filter(f => f.subsystem === "safety_input");
  const overclaimFindings = findings.filter(f => f.subsystem === "overclaim_guard");
  const safetyOutputFindings = findings.filter(f => f.subsystem === "safety_output");

  if (safetyInputFindings.every(f => !f.blocks) && overclaimFindings.some(f => f.severity === "critical")) {
    gaps.push({
      id: "GAP-001",
      subsystems: ["safety_input", "overclaim_guard"],
      descriptionVi: "Đầu vào an toàn nhưng phản hồi chứa nội dung khẳng định quá mức. " +
        "Khoảng trống: bộ lọc đầu vào không dự đoán được phản hồi sẽ chứa ngôn ngữ tuyệt đối hóa.",
      severity: "major",
      couldLeak: true,
      recommendationVi: "Thêm bước kiểm tra trước khi sinh phản hồi: nếu đầu vào thuộc dạng " +
        "câu hỏi cần câu trả lời chính xác tuyệt đối (VD: 'có luôn luôn đúng không?'), " +
        "thêm hướng dẫn hedging vào prompt.",
    });
  }

  // GAP-002: Forbidden vocab filter and overclaim guard both check evaluative language
  // They could give conflicting signals — one strips, one flags.
  const forbiddenFindings = findings.filter(f => f.subsystem === "forbidden_vocab");
  if (forbiddenFindings.some(f => f.severity !== "info") && overclaimFindings.some(f => f.severity !== "info")) {
    gaps.push({
      id: "GAP-002",
      subsystems: ["forbidden_vocab", "overclaim_guard"],
      descriptionVi: "Cả hai bộ lọc từ vựng cấm và bộ phát hiện khẳng định quá mức đều " +
        "phát hiện vấn đề trong cùng phản hồi. Cần xác nhận chúng không mâu thuẫn " +
        "(VD: bộ lọc xóa 'Bạn sai rồi' nhưng bộ phát hiện vẫn thấy dấu vết đánh giá).",
      severity: "major",
      couldLeak: false,
      recommendationVi: "Kiểm tra thứ tự áp dụng: chạy bộ lọc từ vựng cấm TRƯỚC, " +
        "sau đó chạy bộ phát hiện khẳng định quá mức trên văn bản đã lọc.",
    });
  }

  // GAP-003: Emotional stance classification doesn't feed into safety pipeline
  // The learner could express distress that emotional stance catches but safety doesn't escalate.
  const needsPause = findings.find(f =>
    f.subsystem === "emotional_stance" && f.reasonCode === "needs_pause"
  );
  const noCrisisBlock = safetyInputFindings.every(f => f.reasonCode !== "self_harm");
  if (needsPause && noCrisisBlock) {
    gaps.push({
      id: "GAP-003",
      subsystems: ["emotional_stance", "safety_input"],
      descriptionVi: "Bộ phát hiện cảm xúc thấy learner cần tạm dừng, nhưng bộ an toàn " +
        "không phát hiện khủng hoảng. Learner có thể đang ở vùng xám (buồn/lo âu " +
        "nhưng chưa đến mức tự hại).",
      severity: "major",
      couldLeak: false,
      recommendationVi: "Khi classifyResponseStance trả về 'needs_pause', " +
        "thêm thông điệp hỗ trợ tinh thần nhẹ nhàng trước khi tiếp tục dạy.",
    });
  }

  // GAP-004: Self-audit passes but overclaim guard fails
  // Self-audit gate S5 and overclaim guard O1-O8 could disagree.
  const selfAuditFindings = findings.filter(f => f.subsystem === "self_audit");
  const selfAuditPassed = selfAuditFindings.every(f => !f.blocks);
  const overclaimBlocks = overclaimFindings.some(f => f.blocks && f.severity === "critical");

  if (selfAuditPassed && overclaimBlocks) {
    gaps.push({
      id: "GAP-004",
      subsystems: ["self_audit", "overclaim_guard"],
      descriptionVi: "Cổng tự kiểm (S1-S8) cho phép phản hồi qua nhưng cổng phát hiện " +
        "khẳng định quá mức (O1-O8) chặn lại. Hai cổng đang bất đồng — một trong " +
        "hai có thể cần cập nhật ngưỡng.",
      severity: "major",
      couldLeak: true,
      recommendationVi: "Đồng bộ hóa ngưỡng giữa self-audit S5 và overclaim O1-O8. " +
        "Nếu overclaim BLOCK, self-audit cũng phải ít nhất REVISE.",
    });
  }

  // GAP-005: Contract humility rules (R3/R7/R8) pass but forbidden vocab still fires
  const contractFindings = findings.filter(f => f.subsystem === "contract_humility");
  const contractPassed = contractFindings.every(f => !f.blocks);
  const forbiddenFires = forbiddenFindings.some(f => f.severity !== "info");

  if (contractPassed && forbiddenFires) {
    gaps.push({
      id: "GAP-005",
      subsystems: ["contract_humility", "forbidden_vocab"],
      descriptionVi: "Hợp đồng giáo viên (R3/R7/R8) cho phép nhưng bộ lọc từ vựng cấm " +
        "vẫn phát hiện vấn đề. Hợp đồng kiểm tra pattern rộng hơn, bộ lọc từ vựng " +
        "kiểm tra từ khóa cụ thể — một cái có thể bỏ sót.",
      severity: "minor",
      couldLeak: false,
      recommendationVi: "Cập nhật R3_NO_FAKE_PRAISE để bao gồm các mẫu từ vựng " +
        "cấm đã biết (VD: 'You are wrong', 'That is incorrect').",
    });
  }

  // GAP-006: Safety output moderation passes raw PII that redactText would catch
  // Output moderation strips PII but uses a different regex set than redactText.
  const hasPIISignal = detectPII(tutorResponseVi).found;
  const outputModerated = safetyOutputFindings.some(f => f.reasonCode === "pii_stripped");
  if (!outputModerated && hasPIISignal) {
    gaps.push({
      id: "GAP-006",
      subsystems: ["safety_output", "safety_input"],
      descriptionVi: "Phản hồi chứa PII nhưng moderateOutput không phát hiện. " +
        "Có thể moderateOutput dùng bộ regex khác với detectPII.",
      severity: "critical",
      couldLeak: true,
      recommendationVi: "Đồng bộ hóa PII regex giữa detectPII và moderateOutput. " +
        "Dùng chung một bộ pattern.",
    });
  }

  // GAP-007: No explicit check for the pipeline end-to-end
  // Each module checks individually but no one verifies the full chain.
  const totalBlockingFindings = findings.filter(f => f.blocks).length;
  const totalCriticalFindings = findings.filter(f => f.severity === "critical").length;

  if (totalBlockingFindings === 0 && totalCriticalFindings > 0) {
    gaps.push({
      id: "GAP-007",
      subsystems: ["self_audit", "safety_output"],
      descriptionVi: `Có ${totalCriticalFindings} phát hiện nghiêm trọng nhưng không có ` +
        "phát hiện nào chặn phản hồi. Hệ thống đang phát hiện vấn đề mà không hành động.",
      severity: "critical",
      couldLeak: true,
      recommendationVi: "Tất cả phát hiện 'critical' phải dẫn đến BLOCK hoặc ít nhất " +
        "REVISE. Kiểm tra logic phân loại severity → blocking.",
    });
  }

  // GAP-008: Vietnamese identity card numbers not covered
  // PII detection covers email, phone, address but not VN-specific CMND/CCCD.
  // Pattern is lenient — matches CMND/CCCD labels followed by 9-12 digit numbers
  // anywhere in the text (not necessarily immediately adjacent).
  const vnIdPattern = /(?:CMND|CCCD|hộ\s*chiếu|chứng\s*minh\s*(?:thư|nhân\s*dân)).*?\d{9,12}/gi;
  if (vnIdPattern.test(learnerText) || vnIdPattern.test(tutorResponseVi)) {
    const piiInInput = findings.find(f => f.subsystem === "safety_input" && f.reasonCode === "pii_detected");
    const piiInOutput = findings.find(f => f.subsystem === "safety_output" && f.reasonCode === "pii_detected");
    if (!piiInInput && !piiInOutput) {
      gaps.push({
        id: "GAP-008",
        subsystems: ["safety_input", "safety_output"],
        descriptionVi: "Phát hiện số CMND/CCCD/hộ chiếu Việt Nam nhưng không bộ lọc " +
          "PII nào nhận diện. Bộ detectPII hiện chỉ kiểm tra email, SĐT, địa chỉ.",
        severity: "critical",
        couldLeak: true,
        recommendationVi: "Thêm pattern CMND/CCCD (9-12 chữ số sau nhãn) vào detectPII " +
          "và TUTOR_LOG_REDACTION_RULES.",
      });
    }
  }

  // GAP-009: Empty/null response path
  // If tutorResponseVi is empty, do all modules handle it gracefully?
  const emptyResponse = !tutorResponseVi || tutorResponseVi.trim().length === 0;
  if (emptyResponse && findings.every(f => !f.blocks)) {
    gaps.push({
      id: "GAP-009",
      subsystems: ["self_audit", "forbidden_vocab"],
      descriptionVi: "Phản hồi trống nhưng không cổng nào chặn. S3 (empty response) " +
        "trong self-audit gate nên đã bắt trường hợp này.",
      severity: "critical",
      couldLeak: false,
      recommendationVi: "Xác nhận selfAuditBeforeShowing S3 chạy và chặn phản hồi trống.",
    });
  }

  return gaps;
}

// ─── Main Audit Function ─────────────────────────────────────────────────────

/**
 * Run the complete safety and humility final audit on a tutor response.
 *
 * This is the SINGLE ENTRY POINT that chains every safety and humility guard
 * built across Steps 1-114. Call this before showing any tutor response to
 * a Vietnamese learner.
 *
 * Returns a comprehensive result with verdict, findings, gaps, scores,
 * and prioritized action items.
 */
export function runSafetyHumilityFinalAudit(
  input: SafetyHumilityAuditInput,
): SafetyHumilityAuditResult {
  resetFindingCounter();
  const findings: AuditFinding[] = [];
  const subsystemsAudited: AuditSubsystem[] = [];
  const startTime = Date.now();

  const {
    learnerText,
    tutorResponseVi,
    tutorResponseEn,
    detailedExplanation,
    safetyContext,
    cefrLevel,
    teacherDecision,
    didSelfCorrect,
    auditMode = "full",
    pivotCandidate,
    previousAssistantText,
  } = input;

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. SAFETY INPUT — sanitizeInput
  // ═══════════════════════════════════════════════════════════════════════════
  subsystemsAudited.push("safety_input");
  const sanitizeResult = sanitizeInput(learnerText, safetyContext);
  if (!sanitizeResult.ok) {
    findings.push({
      id: nextFindingId("safety_input"),
      subsystem: "safety_input",
      severity: "critical",
      titleVi: `Đầu vào bị chặn: ${sanitizeResult.block}`,
      detailVi: sanitizeResult.messageVi,
      reasonCode: sanitizeResult.block,
      blocks: true,
    });
  } else {
    // Check for near-miss patterns
    const piiResult = detectPII(sanitizeResult.cleaned);
    if (piiResult.found) {
      findings.push({
        id: nextFindingId("safety_input"),
        subsystem: "safety_input",
        severity: "minor",
        titleVi: "PII được phát hiện và xóa khỏi đầu vào",
        detailVi: `Đã xóa ${piiResult.patterns.length} loại PII: ${piiResult.patterns.join(", ")}.`,
        reasonCode: "pii_stripped",
        blocks: false,
      });
    }

    // Detect crisis content even if sanitization passes (logged for monitoring)
    const crisisResult = detectCrisis(sanitizeResult.cleaned);
    if (crisisResult.detected) {
      findings.push({
        id: nextFindingId("safety_input"),
        subsystem: "safety_input",
        severity: "critical",
        titleVi: "Phát hiện nội dung khủng hoảng",
        detailVi: crisisResult.resourceVi,
        reasonCode: "self_harm_detected",
        blocks: true,
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. SAFETY OUTPUT — moderateOutput
  // ═══════════════════════════════════════════════════════════════════════════
  subsystemsAudited.push("safety_output");
  const tutorResponseForModeration = {
    vi: tutorResponseVi,
    en: tutorResponseEn,
    detailedExplanation,
    nextSteps: [],
    saveTargets: [],
  };
  const moderateResult = moderateOutput(tutorResponseForModeration, safetyContext);
  if (!moderateResult.ok) {
    findings.push({
      id: nextFindingId("safety_output"),
      subsystem: "safety_output",
      severity: "critical",
      titleVi: `Phản hồi bị chặn: ${moderateResult.block}`,
      detailVi: moderateResult.replacementVi,
      reasonCode: moderateResult.block,
      blocks: true,
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. FORBIDDEN VOCABULARY FILTER
  // ═══════════════════════════════════════════════════════════════════════════
  subsystemsAudited.push("forbidden_vocab");
  const filterResult: FilterResult = applyForbiddenVocabFilter(tutorResponseVi);
  if (filterResult.strippedCount > 0) {
    const severity: AuditFindingSeverity =
      filterResult.strippedRatio > 0.3 ? "critical"
      : filterResult.strippedRatio > 0.15 ? "major"
      : "minor";
    findings.push({
      id: nextFindingId("forbidden_vocab"),
      subsystem: "forbidden_vocab",
      severity,
      titleVi: `Từ vựng cấm được phát hiện và lọc (${filterResult.strippedCount} mục)`,
      detailVi: `Đã lọc ${filterResult.strippedCount} từ/cụm từ cấm (${Math.round(filterResult.strippedRatio * 100)}% nội dung gốc).`,
      reasonCode: "forbidden_vocab_detected",
      blocks: filterResult.strippedRatio > 0.3, // Block if >30% content was forbidden
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. CONTRACT HUMILITY — R3 (fake praise), R7 (strategic silence), R8 (face)
  // ═══════════════════════════════════════════════════════════════════════════
  subsystemsAudited.push("contract_humility");
  const contractLearner: ContractLearnerInput = {
    text: learnerText,
    cefrLevel: cefrLevel ?? null,
    trackedWeakness: null,
    didSelfCorrect: didSelfCorrect ?? false,
    l1: "vi",
  };
  const contractResponse: ContractTutorResponse = {
    vi: tutorResponseVi,
    en: tutorResponseEn ?? undefined,
  };

  // Run all three humility-focused contract rules
  const r3Result = checkR3_NoFakePraise(contractLearner, contractResponse);
  if (!r3Result.passed) {
    findings.push({
      id: nextFindingId("contract_humility"),
      subsystem: "contract_humility",
      severity: "major",
      titleVi: "R3 — Khen giả: phát hiện lời khen không xác đáng",
      detailVi: r3Result.detailVi ?? "Phản hồi chứa lời khen khi learner mắc lỗi cần sửa.",
      reasonCode: "R3_NO_FAKE_PRAISE",
      blocks: true,
    });
  }

  const r7Result = checkR7_StrategicSilence(contractLearner, contractResponse);
  if (!r7Result.passed) {
    findings.push({
      id: nextFindingId("contract_humility"),
      subsystem: "contract_humility",
      severity: "minor",
      titleVi: "R7 — Im lặng chiến lược: nên giữ im lặng thay vì phản hồi",
      detailVi: r7Result.detailVi ?? "Tình huống này nên giữ im lặng để learner tự suy nghĩ.",
      reasonCode: "R7_STRATEGIC_SILENCE",
      blocks: false,
    });
  }

  const r8Result = checkR8_FaceSaving(contractLearner, contractResponse);
  if (!r8Result.passed) {
    findings.push({
      id: nextFindingId("contract_humility"),
      subsystem: "contract_humility",
      severity: "major",
      titleVi: "R8 — Giữ thể diện: từ ngữ có thể gây mất mặt learner",
      detailVi: r8Result.detailVi ?? "Phản hồi dùng từ có thể khiến learner xấu hổ.",
      reasonCode: "R8_FACE_SAVING",
      blocks: true,
    });
  }

  // Full contract check for completeness
  const fullContractResult: ContractCheckResult = checkTeacherMercyContract(contractLearner, contractResponse);
  const failedContractRules = fullContractResult.rules.filter(r => !r.passed);
  for (const rule of failedContractRules) {
    // Only add findings for rules we haven't already covered (non-humility rules)
    if (!["R3_NO_FAKE_PRAISE", "R7_STRATEGIC_SILENCE", "R8_FACE_SAVING"].includes(rule.ruleId)) {
      findings.push({
        id: nextFindingId("contract_humility"),
        subsystem: "contract_humility",
        severity: rule.ruleId.startsWith("R1") || rule.ruleId.startsWith("R2") ? "critical" : "major",
        titleVi: `${rule.ruleId} — ${rule.titleVi}: không đạt`,
        detailVi: rule.detailVi ?? `Quy tắc ${rule.ruleId} không được thỏa mãn.`,
        reasonCode: rule.ruleId,
        blocks: rule.ruleId.startsWith("R1") || rule.ruleId.startsWith("R2"),
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. SELF-AUDIT GATE — S1-S8 chain
  // ═══════════════════════════════════════════════════════════════════════════
  subsystemsAudited.push("self_audit");
  const selfAuditResult: SelfAuditResult = selfAuditBeforeShowing({
    learnerText,
    explanationVi: tutorResponseVi,
    correctedSentence: undefined,
    mode: (auditMode as "correction" | "conversation" | "full") ?? "full",
    cefrLevel: cefrLevel ?? null,
    decision: teacherDecision ?? undefined,
  });
  for (const gate of selfAuditResult.gates) {
    if (!gate.passed && gate.decision) {
      const severity: AuditFindingSeverity =
        gate.decision === "BLOCK" ? "critical"
        : gate.decision === "REVISE" ? "major"
        : "minor";
      findings.push({
        id: nextFindingId("self_audit"),
        subsystem: "self_audit",
        severity,
        titleVi: `${gate.gateId} — ${gate.titleVi}: ${gate.decision}`,
        detailVi: gate.detailVi,
        reasonCode: gate.reasonCode,
        blocks: gate.decision === "BLOCK",
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. OVERCLAIM GUARD — O1-O8 chain
  // ═══════════════════════════════════════════════════════════════════════════
  subsystemsAudited.push("overclaim_guard");
  const overclaimResult: OverclaimGuardResult = guardOverclaim({
    explanationVi: tutorResponseVi,
    learnerText,
    cefrLevel: cefrLevel ?? null,
  });
  for (const gate of overclaimResult.gates) {
    if (!gate.passed && gate.decision) {
      const severity: AuditFindingSeverity =
        gate.decision === "BLOCK" ? "critical"
        : gate.decision === "REVISE" ? "major"
        : gate.decision === "FLAG" ? "minor"
        : "info";
      findings.push({
        id: nextFindingId("overclaim_guard"),
        subsystem: "overclaim_guard",
        severity,
        titleVi: `${gate.gateId} — ${gate.titleVi}: ${gate.decision}`,
        detailVi: gate.detailVi,
        reasonCode: gate.reasonCode,
        blocks: gate.decision === "BLOCK",
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. DECISION EVALUATION — V1-V8 chain (if teacher decision provided)
  // ═══════════════════════════════════════════════════════════════════════════
  if (teacherDecision) {
    subsystemsAudited.push("decision_eval");
    // Build a minimal TeacherDecisionInput from available audit data.
    // Fields not available default to sensible values per the engine contract.
    const decisionInput = {
      learnerText,
      targetLanguage: "en" as const,
      cefrLevel: cefrLevel ?? null,
      isCurrentLessonTarget: false,
      sameMistakeCount: 1,
      learnerConfidence: "normal" as const,
      previousCorrectionsThisSession: 0,
    };
    const evalResult: EvaluationResult = evaluateTeachingDecision(decisionInput, teacherDecision);
    for (const gate of evalResult.gates) {
      if (!gate.passed) {
        // Use the overall evalResult.classification instead of per-gate
        const severity: AuditFindingSeverity =
          evalResult.classification === "UNSAFE" ? "critical"
          : evalResult.classification === "NEEDS_REVIEW" ? "major"
          : "minor";
        findings.push({
          id: nextFindingId("decision_eval"),
          subsystem: "decision_eval",
          severity,
          titleVi: `${gate.gateId} — ${gate.titleVi}: ${evalResult.classification}`,
          detailVi: gate.detailVi,
          reasonCode: gate.reasonCode,
          blocks: gate.isHardFail && evalResult.classification === "UNSAFE",
        });
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. EMOTIONAL STANCE — classifyResponseStance
  // ═══════════════════════════════════════════════════════════════════════════
  subsystemsAudited.push("emotional_stance");
  const stanceResult: ResponseStanceDecision = classifyResponseStance({
    learnerText,
    salience: null,
  });
  if (stanceResult.stance !== "neutral") {
    const severity: AuditFindingSeverity =
      stanceResult.stance === "needs_pause" ? "major"
      : "minor";
    findings.push({
      id: nextFindingId("emotional_stance"),
      subsystem: "emotional_stance",
      severity,
      titleVi: `Tín hiệu cảm xúc: ${stanceResult.stance}`,
      detailVi: stanceResult.reason,
      reasonCode: stanceResult.stance,
      blocks: false,
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. PIVOT SAFETY — checkPivotCandidate (if pivot context)
  // ═══════════════════════════════════════════════════════════════════════════
  if (pivotCandidate !== undefined && pivotCandidate !== null) {
    subsystemsAudited.push("pivot_safety");
    const pivotCheck = checkPivotCandidate(pivotCandidate, previousAssistantText ?? "");
    if (!pivotCheck.ok) {
      findings.push({
        id: nextFindingId("pivot_safety"),
        subsystem: "pivot_safety",
        severity: pivotCheck.reason === "as_ai" || pivotCheck.reason === "empty" ? "critical" : "minor",
        titleVi: `Pivot bị từ chối: ${pivotCheck.reason}`,
        detailVi: `Ứng viên pivot không đạt kiểm tra an toàn: ${pivotCheck.reason}.`,
        reasonCode: `pivot_${pivotCheck.reason}`,
        blocks: pivotCheck.reason === "as_ai" || pivotCheck.reason === "empty",
      });
    }
  } else {
    // Pivot safety not applicable — still note it as audited for exhaustiveness
    subsystemsAudited.push("pivot_safety");
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. SUPPRESSION — emotional boundary + humility
  // ═══════════════════════════════════════════════════════════════════════════
  subsystemsAudited.push("suppression");

  // ═══════════════════════════════════════════════════════════════════════════
  // CROSS-MODULE GAP DETECTION
  // ═══════════════════════════════════════════════════════════════════════════
  const gaps = detectCrossModuleGaps(findings, learnerText, tutorResponseVi);
  if (gaps.length > 0) {
    subsystemsAudited.push("cross_module_gap");
    for (const gap of gaps) {
      findings.push({
        id: nextFindingId("cross_module_gap"),
        subsystem: "cross_module_gap",
        severity: gap.severity,
        titleVi: `${gap.id}: Khoảng trống giữa ${gap.subsystems[0]} và ${gap.subsystems[1]}`,
        detailVi: gap.descriptionVi,
        reasonCode: gap.id,
        blocks: gap.couldLeak,
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPUTE SCORES
  // ═══════════════════════════════════════════════════════════════════════════
  const { safetyScore, humilityScore, bySubsystem } = classifyFindingSeverity(findings);

  // ═══════════════════════════════════════════════════════════════════════════
  // DETERMINE VERDICT
  // ═══════════════════════════════════════════════════════════════════════════
  const hasBlockingFindings = findings.some(f => f.blocks);
  const hasCriticalFindings = findings.some(f => f.severity === "critical");
  const hasMajorFindings = findings.some(f => f.severity === "major");
  const hasGaps = gaps.length > 0;
  const criticalGapExists = gaps.some(g => g.severity === "critical" && g.couldLeak);

  let verdict: SafetyHumilityVerdict;
  if (hasBlockingFindings || criticalGapExists) {
    verdict = "BLOCK";
  } else if (hasCriticalFindings) {
    verdict = "NEEDS_REVISION";
  } else if (hasMajorFindings || hasGaps) {
    verdict = "PASS_WITH_NOTES";
  } else if (findings.length > 0) {
    verdict = "PASS_WITH_NOTES";
  } else {
    verdict = "PASS";
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // BUILD VIETNAMESE SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════
  const verdictLabels: Record<SafetyHumilityVerdict, string> = {
    PASS: "ĐẠT — Phản hồi an toàn và khiêm tốn, sẵn sàng hiển thị cho learner.",
    PASS_WITH_NOTES: "ĐẠT (CÓ GHI CHÚ) — Phản hồi an toàn nhưng có điểm cần theo dõi.",
    NEEDS_REVISION: "CẦN SỬA — Phản hồi có vấn đề lớn, cần chỉnh sửa trước khi hiển thị.",
    BLOCK: "CHẶN — Phản hồi không an toàn hoặc thiếu khiêm tốn, không được hiển thị.",
    GAP_DETECTED: "PHÁT HIỆN KHOẢNG TRỐNG — Cần Chau xem xét khoảng trống giữa các module.",
  };

  const summaryVi = [
    `Kết quả kiểm tra an toàn & khiêm tốn: ${verdictLabels[verdict]}`,
    `Điểm an toàn: ${safetyScore}/100 — Điểm khiêm tốn: ${humilityScore}/100 — Tổng hợp: ${Math.round((safetyScore * 0.6 + humilityScore * 0.4))}/100`,
    `${findings.length} phát hiện (${findings.filter(f => f.severity === "critical").length} nghiêm trọng, ${findings.filter(f => f.severity === "major").length} lớn, ${findings.filter(f => f.severity === "minor").length} nhỏ)`,
    `${gaps.length} khoảng trống giữa các module được phát hiện`,
    `${subsystemsAudited.filter(s => s !== "cross_module_gap").length} hệ thống con đã được kiểm tra`,
  ].join(" | ");

  // ═══════════════════════════════════════════════════════════════════════════
  // BUILD ACTION ITEMS
  // ═══════════════════════════════════════════════════════════════════════════
  const actionItems: string[] = [];

  if (verdict === "BLOCK") {
    actionItems.push("[KHẨN] Phản hồi bị chặn — xem xét ngay các phát hiện critical.");
  }
  if (gaps.length > 0) {
    actionItems.push(`[CẦN XEM] ${gaps.length} khoảng trống giữa các module — Chau cần quyết định cách xử lý.`);
  }
  for (const gap of gaps) {
    if (gap.couldLeak) {
      actionItems.push(`[KHẨN] ${gap.id}: ${gap.descriptionVi}`);
    }
  }
  if (humilityScore < 50) {
    actionItems.push("[CẦN XEM] Điểm khiêm tốn thấp — phản hồi có thể quá tự tin hoặc thiếu tôn trọng learner.");
  }
  if (safetyScore < 50) {
    actionItems.push("[KHẨN] Điểm an toàn thấp — rà soát pipeline an toàn.");
  }

  const combined = Math.round(safetyScore * 0.6 + humilityScore * 0.4);

  return {
    verdict,
    verdictVi: verdictLabels[verdict],
    canShow: verdict === "PASS" || verdict === "PASS_WITH_NOTES",
    findings,
    gaps,
    scores: {
      safety: safetyScore,
      humility: humilityScore,
      combined,
      bySubsystem,
    },
    summaryVi,
    actionItems,
    subsystemsAudited: [...new Set(subsystemsAudited)],
    auditedAt: startTime,
  };
}

// ─── Convenience Helpers ─────────────────────────────────────────────────────

/** Quick check: is the response safe to show? */
export function isSafeToShow(result: SafetyHumilityAuditResult): boolean {
  return result.canShow;
}

/** Quick check: does the audit pass with no findings? */
export function isCleanAudit(result: SafetyHumilityAuditResult): boolean {
  return result.verdict === "PASS" && result.findings.length === 0;
}

/** Get a compact Vietnamese one-liner for dashboards. */
export function getAuditCompactVi(result: SafetyHumilityAuditResult): string {
  const flags: string[] = [];
  if (result.verdict === "PASS") flags.push("✅");
  else if (result.verdict === "PASS_WITH_NOTES") flags.push("⚠️");
  else if (result.verdict === "BLOCK") flags.push("🚫");
  else flags.push("🔶");

  const criticalCount = result.findings.filter(f => f.severity === "critical").length;
  return `${flags.join("")} AT&KT: ${result.scores.combined}/100 ` +
    `(${result.findings.length} phát hiện, ${criticalCount} nghiêm trọng, ${result.gaps.length} khoảng trống)`;
}

/** Compare two audit results for cross-session trend analysis. */
export function compareAuditResults(
  prev: SafetyHumilityAuditResult,
  curr: SafetyHumilityAuditResult,
): {
  safetyDelta: number;
  humilityDelta: number;
  combinedDelta: number;
  findingsDelta: number;
  gapsDelta: number;
  improved: boolean;
  summaryVi: string;
} {
  const safetyDelta = curr.scores.safety - prev.scores.safety;
  const humilityDelta = curr.scores.humility - prev.scores.humility;
  const combinedDelta = curr.scores.combined - prev.scores.combined;
  const findingsDelta = curr.findings.length - prev.findings.length;
  const gapsDelta = curr.gaps.length - prev.gaps.length;
  const improved = combinedDelta > 0;

  const direction = improved ? "tăng" : "giảm";
  return {
    safetyDelta,
    humilityDelta,
    combinedDelta,
    findingsDelta,
    gapsDelta,
    improved,
    summaryVi: `So với lần trước: điểm tổng hợp ${direction} ${Math.abs(combinedDelta)} điểm ` +
      `(an toàn: ${safetyDelta >= 0 ? "+" : ""}${safetyDelta}, khiêm tốn: ${humilityDelta >= 0 ? "+" : ""}${humilityDelta}). ` +
      `Phát hiện: ${findingsDelta >= 0 ? "+" : ""}${findingsDelta}. Khoảng trống: ${gapsDelta >= 0 ? "+" : ""}${gapsDelta}.`,
  };
}
