/**
 * Learning Gain Evidence Packet
 *
 * Packages learning gain measurement into structured, verifiable evidence
 * packets. Answers the question: "Did the learner actually get better, and
 * can we prove it?"
 *
 * This module sits ABOVE the learningGainRubric (which measures gain across
 * 7 dimensions) and BELOW the realProductProofGate (which validates gain
 * against product bars). It transforms raw rubric results into a structured
 * evidence packet suitable for:
 *   - Learner-facing progress reports ("con đã tiến bộ ở...")
 *   - Chau-facing review briefings
 *   - Proof gate submission
 *   - Failure taxonomy defense
 *   - Chatbot baseline comparison
 *
 * Architecture:
 *   1. Evidence Types Catalog (10 evidence types across 7 gain dimensions)
 *   2. Gain Claim Types (6 claim types from quantitative to no-claim)
 *   3. Evidence Strength Levels (5 levels from conclusive to insufficient)
 *   4. Evidence Packet Builder (main entry point)
 *   5. Claim Generator (from evidence → claim)
 *   6. Validators (packet and claim structure)
 *   7. Summaries (Vietnamese-first, learner + Chau variants)
 *   8. Integration Mappings (proof gates, failures, scenarios, baselines)
 *
 * All pure functions — no I/O, no side effects, deterministic.
 * Vietnamese-first in all user-facing labels and summaries.
 */

import type { LearningGainResult, LearningGainDimensionId } from "./learningGainRubric";
import {
  hasMeasurableGain,
  isReportableGain,
  LEARNING_GAIN_DIMENSION_CATALOG,
} from "./learningGainRubric";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Core Types
// ═══════════════════════════════════════════════════════════════════════════════

/** Evidence type identifier — one per kind of gain evidence we can produce. */
export type GainEvidenceTypeId =
  | "ev-error-reduction"
  | "ev-pronunciation-gain"
  | "ev-self-correction"
  | "ev-acknowledgment"
  | "ev-weakness-resolution"
  | "ev-retention"
  | "ev-autonomy"
  | "ev-cross-session-trend"
  | "ev-behavioral-change"
  | "ev-checklist-gain";

/** Claim type identifier — what kind of claim can we make? */
export type GainClaimTypeId =
  | "claim-quantitative"
  | "claim-qualitative"
  | "claim-trend"
  | "claim-mastery"
  | "claim-confidence"
  | "claim-none";

/** Evidence strength — how confident are we in this evidence? */
export type EvidenceStrength =
  | "conclusive"
  | "strong"
  | "moderate"
  | "tentative"
  | "insufficient";

/** The overall gain verdict from the evidence packet. */
export type GainEvidenceVerdict =
  | "proven_significant_gain"
  | "proven_moderate_gain"
  | "proven_minimal_gain"
  | "no_conclusive_evidence"
  | "evidence_of_regression";

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Evidence Item — a single piece of gain evidence
// ═══════════════════════════════════════════════════════════════════════════════

export interface GainEvidenceItem {
  /** Evidence type identifier. */
  evidenceTypeId: GainEvidenceTypeId;
  /** Vietnamese label for this evidence. */
  titleVi: string;
  /** English label for this evidence. */
  titleEn: string;
  /** Which LG dimension this evidence maps to (or null for cross-cutting). */
  mappedDimensionId: LearningGainDimensionId | null;
  /** Strength of this individual evidence item. */
  strength: EvidenceStrength;
  /** Numeric confidence 0–1. */
  confidence: number;
  /** The before value (from baseline). */
  baselineValue: number;
  /** The after value (from outcome). */
  outcomeValue: number;
  /** Signed delta. */
  delta: number;
  /** Vietnamese description of what the evidence shows. */
  descriptionVi: string;
  /** English description. */
  descriptionEn: string;
  /** Whether this evidence item is "active" (meets the threshold for reporting). */
  isActive: boolean;
  /** Minimum events required for this evidence type to be valid. */
  minEventsRequired: number;
  /** Actual events available for this evidence type. */
  eventsAvailable: number;
  /** Guarded failure IDs this evidence defends against. */
  guardedFailureIds: string[];
  /** Proof sub-gate IDs this evidence satisfies. */
  satisfiedSubGateIds: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. Gain Claim — what we can claim about learner improvement
// ═══════════════════════════════════════════════════════════════════════════════

export interface GainClaim {
  /** Claim type identifier. */
  claimTypeId: GainClaimTypeId;
  /** Vietnamese claim statement. */
  statementVi: string;
  /** English claim statement. */
  statementEn: string;
  /** Minimum evidence strength required for this claim. */
  requiredStrength: EvidenceStrength;
  /** Whether this claim is safe to show to the learner. */
  isLearnerSafe: boolean;
  /** Whether this claim is backed by enough data. */
  hasSufficientData: boolean;
  /** Evidence items supporting this claim. */
  supportingEvidenceIds: GainEvidenceTypeId[];
  /** Caveats / limitations of this claim. */
  caveatsVi: string[];
  /** Whether the claim is actionable (can drive next-lesson decisions). */
  isActionable: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. Learning Gain Evidence Packet — the full package
// ═══════════════════════════════════════════════════════════════════════════════

export interface LearningGainEvidencePacket {
  /** Unique packet identifier. */
  packetId: string;
  /** When this packet was generated (epoch ms). */
  generatedAt: number;
  /** The learning gain rubric result this packet is built from. */
  rubricResult: LearningGainResult | null;
  /** All evidence items (10 total, some may be inactive). */
  evidenceItems: GainEvidenceItem[];
  /** Active (reportable) evidence items. */
  activeEvidence: GainEvidenceItem[];
  /** The best claim we can make. */
  primaryClaim: GainClaim;
  /** All possible claims, ordered by strength. */
  allClaims: GainClaim[];
  /** Overall evidence strength. */
  overallStrength: EvidenceStrength;
  /** Overall gain verdict. */
  verdict: GainEvidenceVerdict;
  /** Number of active evidence items. */
  activeEvidenceCount: number;
  /** Total evidence items (always 10). */
  totalEvidenceCount: number;
  /** Vietnamese summary for the learner. */
  learnerSummaryVi: string;
  /** Vietnamese briefing for Chau. */
  chauBriefingVi: string;
  /** English summary for internal/debug use. */
  summaryEn: string;
  /** All guarded failure IDs across active evidence. */
  guardedFailureIds: string[];
  /** All satisfied proof sub-gates across active evidence. */
  satisfiedSubGateIds: string[];
  /** Whether this packet meets the product proof bar. */
  meetsProductProofBar: boolean;
  /** Session identifiers this packet draws from. */
  sessionIds: string[];
  /** Number of sessions compared. */
  sessionCount: number;
  /** Whether this is a cross-session comparison. */
  isCrossSession: boolean;
  /** Total events across all sessions. */
  totalEvents: number;
  /** Vietnamese action recommendations for Chau. */
  chauActionItems: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. Input Types
// ═══════════════════════════════════════════════════════════════════════════════

/** Input for building a learning gain evidence packet. */
export interface LearningGainEvidencePacketInput {
  /** The learning gain rubric result (required). */
  rubricResult: LearningGainResult;
  /** Session IDs (at least one). */
  sessionIds: string[];
  /** Whether this comparison crosses multiple sessions. */
  isCrossSession?: boolean;
  /** Total events across all compared sessions. */
  totalEvents: number;
  /** Whether the human learner testing checklist was passed. */
  checklistPassed?: boolean;
  /** Whether cross-session trend data is available. */
  hasCrossSessionData?: boolean;
  /** Previous session gain result (for trend analysis). */
  previousGainResult?: LearningGainResult | null;
  /** Behavioral change notes (qualitative observations). */
  behavioralNotes?: string[];
  /** Generated timestamp override (defaults to Date.now in non-test). */
  generatedAt?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. Evidence Types Catalog
// ═══════════════════════════════════════════════════════════════════════════════

export interface GainEvidenceTypeEntry {
  evidenceTypeId: GainEvidenceTypeId;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  mappedDimensionId: LearningGainDimensionId | null;
  minEventsRequired: number;
  guardedFailureIds: string[];
  satisfiedSubGateIds: string[];
  claimTypeIds: GainClaimTypeId[];
  direction: "higher_better" | "lower_better";
}

export const GAIN_EVIDENCE_TYPE_CATALOG: ReadonlyArray<GainEvidenceTypeEntry> = [
  {
    evidenceTypeId: "ev-error-reduction",
    titleVi: "Giảm tỉ lệ lỗi",
    titleEn: "Error rate reduction",
    descriptionVi:
      "Tỉ lệ câu bị sửa lỗi giảm từ nửa đầu sang nửa sau buổi học, " +
      "cho thấy người học đang mắc ít lỗi hơn.",
    mappedDimensionId: "lg_error_reduction",
    minEventsRequired: 4,
    guardedFailureIds: ["F-GAIN-01", "F-GAIN-02"],
    satisfiedSubGateIds: ["gain-measurement", "error-trend"],
    claimTypeIds: ["claim-quantitative", "claim-trend"],
    direction: "lower_better",
  },
  {
    evidenceTypeId: "ev-pronunciation-gain",
    titleVi: "Cải thiện phát âm",
    titleEn: "Pronunciation improvement",
    descriptionVi:
      "Điểm phát âm (match score) tăng từ nửa đầu sang nửa sau, " +
      "cho thấy người học phát âm chính xác hơn.",
    mappedDimensionId: "lg_pronunciation_gain",
    minEventsRequired: 4,
    guardedFailureIds: ["F-GAIN-01"],
    satisfiedSubGateIds: ["gain-measurement"],
    claimTypeIds: ["claim-quantitative", "claim-mastery"],
    direction: "higher_better",
  },
  {
    evidenceTypeId: "ev-self-correction",
    titleVi: "Tự sửa lỗi nhiều hơn",
    titleEn: "Self-correction growth",
    descriptionVi:
      "Người học bắt đầu tự phát hiện và sửa lỗi của mình nhiều hơn " +
      "về cuối buổi — dấu hiệu của sự tự chủ.",
    mappedDimensionId: "lg_self_correction",
    minEventsRequired: 4,
    guardedFailureIds: ["F-GAIN-01", "F-GAIN-03"],
    satisfiedSubGateIds: ["gain-measurement"],
    claimTypeIds: ["claim-quantitative", "claim-qualitative"],
    direction: "higher_better",
  },
  {
    evidenceTypeId: "ev-acknowledgment",
    titleVi: "Tiếp thu lời sửa tốt hơn",
    titleEn: "Correction acknowledgment improvement",
    descriptionVi:
      "Người học tiếp nhận và xác nhận lời sửa của Mercy nhiều hơn " +
      "về cuối buổi — dấu hiệu của sự tin tưởng và học hỏi.",
    mappedDimensionId: "lg_acknowledgment",
    minEventsRequired: 4,
    guardedFailureIds: ["F-GAIN-01"],
    satisfiedSubGateIds: ["gain-measurement"],
    claimTypeIds: ["claim-quantitative", "claim-qualitative"],
    direction: "higher_better",
  },
  {
    evidenceTypeId: "ev-weakness-resolution",
    titleVi: "Khắc phục điểm yếu",
    titleEn: "Weakness resolution",
    descriptionVi:
      "Số loại điểm yếu được phát hiện giảm — người học đang " +
      "khắc phục các lỗi hệ thống.",
    mappedDimensionId: "lg_weakness_resolution",
    minEventsRequired: 6,
    guardedFailureIds: ["F-GAIN-01", "F-GAIN-02"],
    satisfiedSubGateIds: ["gain-measurement", "gain-taxonomy"],
    claimTypeIds: ["claim-quantitative", "claim-mastery"],
    direction: "lower_better",
  },
  {
    evidenceTypeId: "ev-retention",
    titleVi: "Ghi nhớ bài sửa",
    titleEn: "Correction retention",
    descriptionVi:
      "Người học không lặp lại các lỗi đã được sửa trước đó — " +
      "bằng chứng của việc ghi nhớ và học tập thực sự.",
    mappedDimensionId: "lg_retention",
    minEventsRequired: 6,
    guardedFailureIds: ["F-GAIN-01", "F-GAIN-03", "F-GAIN-05"],
    satisfiedSubGateIds: ["gain-measurement", "gain-taxonomy"],
    claimTypeIds: ["claim-quantitative", "claim-mastery", "claim-confidence"],
    direction: "higher_better",
  },
  {
    evidenceTypeId: "ev-autonomy",
    titleVi: "Tự chủ hơn",
    titleEn: "Increased autonomy",
    descriptionVi:
      "Người học cần ít can thiệp sửa lỗi hơn về cuối buổi — " +
      "dấu hiệu của sự độc lập trong giao tiếp.",
    mappedDimensionId: "lg_autonomy",
    minEventsRequired: 4,
    guardedFailureIds: ["F-GAIN-01"],
    satisfiedSubGateIds: ["gain-measurement"],
    claimTypeIds: ["claim-quantitative", "claim-qualitative", "claim-confidence"],
    direction: "lower_better",
  },
  {
    evidenceTypeId: "ev-cross-session-trend",
    titleVi: "Xu hướng tiến bộ qua nhiều buổi",
    titleEn: "Cross-session improvement trend",
    descriptionVi:
      "So sánh dữ liệu giữa các buổi học cho thấy xu hướng " +
      "cải thiện liên tục — tiến bộ bền vững, không phải ngẫu nhiên.",
    mappedDimensionId: null,
    minEventsRequired: 12,
    guardedFailureIds: ["F-GAIN-01", "F-GAIN-03", "F-GAIN-04"],
    satisfiedSubGateIds: ["gain-measurement", "error-trend", "gain-taxonomy"],
    claimTypeIds: ["claim-trend", "claim-quantitative"],
    direction: "higher_better",
  },
  {
    evidenceTypeId: "ev-behavioral-change",
    titleVi: "Thay đổi hành vi học tập",
    titleEn: "Learning behavior change",
    descriptionVi:
      "Quan sát định tính: người học tự tin hơn, trả lời nhanh hơn, " +
      "chủ động đặt câu hỏi, hoặc tự sửa lỗi mà không cần nhắc.",
    mappedDimensionId: null,
    minEventsRequired: 0,
    guardedFailureIds: ["F-GAIN-03"],
    satisfiedSubGateIds: [],
    claimTypeIds: ["claim-qualitative", "claim-confidence"],
    direction: "higher_better",
  },
  {
    evidenceTypeId: "ev-checklist-gain",
    titleVi: "Checklist học viên đạt yêu cầu",
    titleEn: "Learner checklist passed",
    descriptionVi:
      "Human learner testing checklist cho thấy người học đạt " +
      "các chiều quan trọng — xác nhận độc lập về tiến bộ.",
    mappedDimensionId: null,
    minEventsRequired: 0,
    guardedFailureIds: ["F-GAIN-01", "F-GAIN-04"],
    satisfiedSubGateIds: ["checklist-gain"],
    claimTypeIds: ["claim-qualitative", "claim-mastery"],
    direction: "higher_better",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 7. Gain Claim Types Catalog
// ═══════════════════════════════════════════════════════════════════════════════

export interface GainClaimTypeEntry {
  claimTypeId: GainClaimTypeId;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  minStrength: EvidenceStrength;
  isLearnerSafe: boolean;
  isActionable: boolean;
}

export const GAIN_CLAIM_TYPE_CATALOG: ReadonlyArray<GainClaimTypeEntry> = [
  {
    claimTypeId: "claim-quantitative",
    titleVi: "Tiến bộ định lượng",
    titleEn: "Quantitative gain",
    descriptionVi:
      "Bằng chứng tiến bộ dựa trên số liệu đo lường được: " +
      "tỉ lệ lỗi giảm, điểm phát âm tăng, v.v.",
    minStrength: "moderate",
    isLearnerSafe: true,
    isActionable: true,
  },
  {
    claimTypeId: "claim-qualitative",
    titleVi: "Cải thiện định tính",
    titleEn: "Qualitative improvement",
    descriptionVi:
      "Bằng chứng dựa trên quan sát hành vi: tự tin hơn, " +
      "chủ động hơn, phản xạ nhanh hơn.",
    minStrength: "tentative",
    isLearnerSafe: true,
    isActionable: true,
  },
  {
    claimTypeId: "claim-trend",
    titleVi: "Xu hướng tiến bộ",
    titleEn: "Improvement trend",
    descriptionVi:
      "Dữ liệu qua nhiều buổi cho thấy đường xu hướng đi lên — " +
      "tiến bộ bền vững, không phải may mắn.",
    minStrength: "moderate",
    isLearnerSafe: true,
    isActionable: true,
  },
  {
    claimTypeId: "claim-mastery",
    titleVi: "Làm chủ kỹ năng",
    titleEn: "Skill mastery",
    descriptionVi:
      "Người học đã làm chủ một kỹ năng cụ thể — không còn " +
      "mắc lỗi ở kỹ năng đó nữa.",
    minStrength: "strong",
    isLearnerSafe: true,
    isActionable: true,
  },
  {
    claimTypeId: "claim-confidence",
    titleVi: "Tự tin hơn",
    titleEn: "Increased confidence",
    descriptionVi:
      "Người học thể hiện sự tự tin hơn trong giao tiếp — " +
      "nói nhiều hơn, ít ngập ngừng hơn.",
    minStrength: "tentative",
    isLearnerSafe: true,
    isActionable: false,
  },
  {
    claimTypeId: "claim-none",
    titleVi: "Chưa đủ bằng chứng",
    titleEn: "Insufficient evidence",
    descriptionVi:
      "Chưa có đủ dữ liệu để đưa ra bất kỳ tuyên bố nào " +
      "về tiến bộ của người học.",
    minStrength: "insufficient",
    isLearnerSafe: false,
    isActionable: false,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 8. Evidence Strength Catalog
// ═══════════════════════════════════════════════════════════════════════════════

export interface EvidenceStrengthEntry {
  level: EvidenceStrength;
  labelVi: string;
  labelEn: string;
  descriptionVi: string;
  minActiveEvidence: number;
  minConfidence: number;
}

const EVIDENCE_STRENGTH_LEVELS: ReadonlyArray<EvidenceStrengthEntry> = [
  {
    level: "conclusive",
    labelVi: "Kết luận chắc chắn",
    labelEn: "Conclusive",
    descriptionVi:
      "Nhiều nguồn dữ liệu độc lập, mẫu lớn, tất cả chiều đều cải thiện.",
    minActiveEvidence: 8,
    minConfidence: 0.8,
  },
  {
    level: "strong",
    labelVi: "Mạnh",
    labelEn: "Strong",
    descriptionVi:
      "Dữ liệu tốt, nhiều chiều cải thiện, kết quả nhất quán.",
    minActiveEvidence: 5,
    minConfidence: 0.55,
  },
  {
    level: "moderate",
    labelVi: "Trung bình",
    labelEn: "Moderate",
    descriptionVi:
      "Có một số dữ liệu, vài chiều cải thiện, một số không nhất quán.",
    minActiveEvidence: 3,
    minConfidence: 0.35,
  },
  {
    level: "tentative",
    labelVi: "Tạm thời",
    labelEn: "Tentative",
    descriptionVi:
      "Dữ liệu hạn chế, ít chiều cải thiện, chưa đủ để kết luận.",
    minActiveEvidence: 1,
    minConfidence: 0.15,
  },
  {
    level: "insufficient",
    labelVi: "Không đủ dữ liệu",
    labelEn: "Insufficient",
    descriptionVi:
      "Không đủ dữ liệu để đánh giá tiến bộ một cách có ý nghĩa.",
    minActiveEvidence: 0,
    minConfidence: 0,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 9. Evidence Item Builders
// ═══════════════════════════════════════════════════════════════════════════════

function buildGainEvidenceItem(
  entry: GainEvidenceTypeEntry,
  rubricResult: LearningGainResult,
  totalEvents: number,
): GainEvidenceItem {
  const dimResult = entry.mappedDimensionId
    ? rubricResult.dimensions.find((d) => d.dimensionId === entry.mappedDimensionId) ?? null
    : null;

  const eventsAvailable = totalEvents;
  const hasEnoughEvents = eventsAvailable >= entry.minEventsRequired;
  const hasDimensionData = dimResult !== null;

  let strength: EvidenceStrength;
  let confidence: number;
  let baselineValue: number;
  let outcomeValue: number;
  let delta: number;
  let descriptionVi: string;
  let descriptionEn: string;
  let isActive: boolean;

  if (!hasDimensionData && entry.mappedDimensionId !== null) {
    // No dimension data for a mapped evidence type
    strength = "insufficient";
    confidence = 0;
    baselineValue = 0;
    outcomeValue = 0;
    delta = 0;
    descriptionVi = `Không có dữ liệu cho chiều "${entry.titleVi}".`;
    descriptionEn = `No data for "${entry.titleEn}" dimension.`;
    isActive = false;
  } else if (!hasEnoughEvents && entry.minEventsRequired > 0) {
    // Not enough events
    strength = "insufficient";
    confidence = 0;
    baselineValue = dimResult?.baselineValue ?? 0;
    outcomeValue = dimResult?.outcomeValue ?? 0;
    delta = dimResult?.delta ?? 0;
    descriptionVi =
      `Chưa đủ dữ liệu (cần ${entry.minEventsRequired} sự kiện, hiện có ${eventsAvailable}).`;
    descriptionEn =
      `Insufficient data (need ${entry.minEventsRequired} events, have ${eventsAvailable}).`;
    isActive = false;
  } else if (dimResult) {
    baselineValue = dimResult.baselineValue;
    outcomeValue = dimResult.outcomeValue;
    delta = dimResult.delta;
    descriptionVi = dimResult.detailVi;
    descriptionEn = dimResult.detailEn;

    switch (dimResult.score) {
      case 3:
        strength = "strong";
        confidence = 0.85;
        isActive = true;
        break;
      case 2:
        strength = "moderate";
        confidence = 0.65;
        isActive = true;
        break;
      case 1:
        strength = "tentative";
        confidence = 0.35;
        isActive = true;
        break;
      default:
        strength = "insufficient";
        confidence = 0.1;
        isActive = false;
        break;
    }
  } else {
    // Cross-cutting evidence (no mapped dimension) — handled per type
    baselineValue = 0;
    outcomeValue = 0;
    delta = 0;
    strength = "insufficient";
    confidence = 0;
    isActive = false;
    descriptionVi = `Chưa có dữ liệu cho "${entry.titleVi}".`;
    descriptionEn = `No data for "${entry.titleEn}".`;
  }

  return {
    evidenceTypeId: entry.evidenceTypeId,
    titleVi: entry.titleVi,
    titleEn: entry.titleEn,
    mappedDimensionId: entry.mappedDimensionId,
    strength,
    confidence,
    baselineValue,
    outcomeValue,
    delta,
    descriptionVi,
    descriptionEn,
    isActive,
    minEventsRequired: entry.minEventsRequired,
    eventsAvailable,
    guardedFailureIds: [...entry.guardedFailureIds],
    satisfiedSubGateIds: [...entry.satisfiedSubGateIds],
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 10. Cross-Cutting Evidence Builder
// ═══════════════════════════════════════════════════════════════════════════════

function buildCrossSessionEvidence(
  entry: GainEvidenceTypeEntry,
  input: LearningGainEvidencePacketInput,
): GainEvidenceItem {
  const hasTrend = input.hasCrossSessionData === true;
  const hasPrevious = input.previousGainResult !== null && input.previousGainResult !== undefined;

  if (!hasTrend && !hasPrevious) {
    return {
      evidenceTypeId: entry.evidenceTypeId,
      titleVi: entry.titleVi,
      titleEn: entry.titleEn,
      mappedDimensionId: null,
      strength: "insufficient",
      confidence: 0,
      baselineValue: 0,
      outcomeValue: 0,
      delta: 0,
      descriptionVi: "Không có dữ liệu nhiều buổi để so sánh xu hướng.",
      descriptionEn: "No multi-session data available for trend comparison.",
      isActive: false,
      minEventsRequired: entry.minEventsRequired,
      eventsAvailable: input.totalEvents,
      guardedFailureIds: [...entry.guardedFailureIds],
      satisfiedSubGateIds: [...entry.satisfiedSubGateIds],
    };
  }

  // Cross-session trend: compare current vs previous gain classification
  const currentGain = input.rubricResult;
  const previousGain = input.previousGainResult;

  let strength: EvidenceStrength;
  let confidence: number;
  let descriptionVi: string;
  let descriptionEn: string;
  let isActive: boolean;

  if (previousGain && currentGain) {
    const currentImproving = currentGain.dimensions.filter((d) => d.score >= 2).length;
    const previousImproving = previousGain.dimensions.filter((d) => d.score >= 2).length;
    const deltaImproving = currentImproving - previousImproving;

    if (deltaImproving >= 2) {
      strength = "strong";
      confidence = 0.8;
      isActive = true;
      descriptionVi =
        `Xu hướng tích cực rõ rệt: số chiều cải thiện tăng từ ${previousImproving} lên ${currentImproving}/7.`;
      descriptionEn =
        `Clear positive trend: improving dimensions up from ${previousImproving} to ${currentImproving}/7.`;
    } else if (deltaImproving >= 1) {
      strength = "moderate";
      confidence = 0.6;
      isActive = true;
      descriptionVi =
        `Xu hướng tích cực: số chiều cải thiện tăng từ ${previousImproving} lên ${currentImproving}/7.`;
      descriptionEn =
        `Positive trend: improving dimensions up from ${previousImproving} to ${currentImproving}/7.`;
    } else if (deltaImproving === 0 && currentImproving >= 4) {
      strength = "moderate";
      confidence = 0.55;
      isActive = true;
      descriptionVi =
        `Duy trì mức cải thiện tốt (${currentImproving}/7 chiều) qua các buổi — ổn định.`;
      descriptionEn =
        `Maintaining good improvement level (${currentImproving}/7 dimensions) across sessions — stable.`;
    } else if (deltaImproving === 0) {
      strength = "tentative";
      confidence = 0.35;
      isActive = true;
      descriptionVi =
        `Mức cải thiện không đổi (${currentImproving}/7 chiều) qua các buổi.`;
      descriptionEn =
        `Improvement level unchanged (${currentImproving}/7 dimensions) across sessions.`;
    } else {
      strength = "tentative";
      confidence = 0.25;
      isActive = false;
      descriptionVi =
        `Số chiều cải thiện giảm từ ${previousImproving} xuống ${currentImproving} — cần theo dõi.`;
      descriptionEn =
        `Improving dimensions dropped from ${previousImproving} to ${currentImproving} — monitor.`;
    }
  } else {
    strength = "tentative";
    confidence = 0.3;
    isActive = false;
    descriptionVi = "Có dữ liệu xu hướng nhưng chưa đủ để kết luận chắc chắn.";
    descriptionEn = "Trend data available but not yet sufficient for firm conclusions.";
  }

  return {
    evidenceTypeId: entry.evidenceTypeId,
    titleVi: entry.titleVi,
    titleEn: entry.titleEn,
    mappedDimensionId: null,
    strength,
    confidence,
    baselineValue: previousGain?.improvingDimensions ?? 0,
    outcomeValue: currentGain.improvingDimensions,
    delta: (currentGain.improvingDimensions) - (previousGain?.improvingDimensions ?? 0),
    descriptionVi,
    descriptionEn,
    isActive,
    minEventsRequired: entry.minEventsRequired,
    eventsAvailable: input.totalEvents,
    guardedFailureIds: [...entry.guardedFailureIds],
    satisfiedSubGateIds: [...entry.satisfiedSubGateIds],
  };
}

function buildBehavioralEvidence(
  entry: GainEvidenceTypeEntry,
  input: LearningGainEvidencePacketInput,
): GainEvidenceItem {
  const notes = input.behavioralNotes ?? [];
  const hasNotes = notes.length > 0;

  return {
    evidenceTypeId: entry.evidenceTypeId,
    titleVi: entry.titleVi,
    titleEn: entry.titleEn,
    mappedDimensionId: null,
    strength: hasNotes ? "tentative" : "insufficient",
    confidence: hasNotes ? 0.4 : 0,
    baselineValue: 0,
    outcomeValue: notes.length,
    delta: notes.length,
    descriptionVi: hasNotes
      ? `Ghi nhận ${notes.length} quan sát định tính: ${notes.join("; ")}.`
      : "Không có ghi nhận định tính về thay đổi hành vi.",
    descriptionEn: hasNotes
      ? `Recorded ${notes.length} qualitative observations: ${notes.join("; ")}.`
      : "No qualitative behavioral change observations.",
    isActive: hasNotes,
    minEventsRequired: entry.minEventsRequired,
    eventsAvailable: input.totalEvents,
    guardedFailureIds: [...entry.guardedFailureIds],
    satisfiedSubGateIds: [...entry.satisfiedSubGateIds],
  };
}

function buildChecklistEvidence(
  entry: GainEvidenceTypeEntry,
  input: LearningGainEvidencePacketInput,
): GainEvidenceItem {
  const passed = input.checklistPassed === true;

  return {
    evidenceTypeId: entry.evidenceTypeId,
    titleVi: entry.titleVi,
    titleEn: entry.titleEn,
    mappedDimensionId: null,
    strength: passed ? "moderate" : "insufficient",
    confidence: passed ? 0.7 : 0,
    baselineValue: 0,
    outcomeValue: passed ? 1 : 0,
    delta: passed ? 1 : 0,
    descriptionVi: passed
      ? "Checklist học viên đạt yêu cầu — xác nhận độc lập về tiến bộ."
      : "Checklist học viên chưa đạt hoặc chưa có dữ liệu.",
    descriptionEn: passed
      ? "Learner checklist passed — independent confirmation of progress."
      : "Learner checklist not passed or no data available.",
    isActive: passed,
    minEventsRequired: entry.minEventsRequired,
    eventsAvailable: input.totalEvents,
    guardedFailureIds: [...entry.guardedFailureIds],
    satisfiedSubGateIds: [...entry.satisfiedSubGateIds],
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 11. Main Packet Builder
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Build a learning gain evidence packet from rubric results and session context.
 *
 * This is the main entry point. It produces a complete evidence packet with
 * all 10 evidence items, the best claim, verdict, summaries, and action items.
 *
 * Pure function — deterministic given the same input.
 */
export function buildLearningGainEvidencePacket(
  input: LearningGainEvidencePacketInput,
): LearningGainEvidencePacket {
  const rubricResult = input.rubricResult;
  const isCrossSession = input.isCrossSession === true;
  const sessionIds = [...input.sessionIds];
  const generatedAt = input.generatedAt ?? 0;

  // Build all 10 evidence items
  const evidenceItems: GainEvidenceItem[] = GAIN_EVIDENCE_TYPE_CATALOG.map((entry) => {
    if (entry.evidenceTypeId === "ev-cross-session-trend") {
      return buildCrossSessionEvidence(entry, input);
    }
    if (entry.evidenceTypeId === "ev-behavioral-change") {
      return buildBehavioralEvidence(entry, input);
    }
    if (entry.evidenceTypeId === "ev-checklist-gain") {
      return buildChecklistEvidence(entry, input);
    }
    return buildGainEvidenceItem(entry, rubricResult, input.totalEvents);
  });

  const activeEvidence = evidenceItems.filter((e) => e.isActive);
  const activeEvidenceCount = activeEvidence.length;

  // Compute overall strength
  const overallStrength = computeOverallStrength(activeEvidence);

  // Build claims
  const allClaims = buildAllClaims(evidenceItems, overallStrength, rubricResult);
  const primaryClaim = allClaims[0] ?? buildNoClaim();

  // Compute verdict
  const verdict = computeVerdict(rubricResult, activeEvidence, overallStrength);

  // Collect guarded failures and satisfied sub-gates
  const guardedFailureIds = collectUnique(activeEvidence.flatMap((e) => e.guardedFailureIds));
  const satisfiedSubGateIds = collectUnique(activeEvidence.flatMap((e) => e.satisfiedSubGateIds));

  // Determine if product proof bar is met
  const meetsProductProofBar = determineProductProofBar(verdict, activeEvidenceCount);

  // Build summaries
  const learnerSummaryVi = buildLearnerSummaryVi(verdict, activeEvidence, rubricResult);
  const chauBriefingVi = buildChauBriefingVi(verdict, activeEvidence, rubricResult, sessionIds, isCrossSession);
  const summaryEn = buildSummaryEn(verdict, activeEvidence, rubricResult);

  // Build action items
  const chauActionItems = buildChauActionItems(verdict, overallStrength, activeEvidence, rubricResult);

  // Packet ID — deterministic from input
  const packetId = buildPacketId(sessionIds, generatedAt);

  return {
    packetId,
    generatedAt,
    rubricResult,
    evidenceItems,
    activeEvidence,
    primaryClaim,
    allClaims,
    overallStrength,
    verdict,
    activeEvidenceCount,
    totalEvidenceCount: 10,
    learnerSummaryVi,
    chauBriefingVi,
    summaryEn,
    guardedFailureIds,
    satisfiedSubGateIds,
    meetsProductProofBar,
    sessionIds,
    sessionCount: sessionIds.length,
    isCrossSession,
    totalEvents: input.totalEvents,
    chauActionItems,
  };
}

/**
 * Convenience: build an evidence packet from a single-session rubric result.
 */
export function buildSingleSessionEvidencePacket(
  rubricResult: LearningGainResult,
  sessionId: string,
  totalEvents: number,
): LearningGainEvidencePacket {
  return buildLearningGainEvidencePacket({
    rubricResult,
    sessionIds: [sessionId],
    isCrossSession: false,
    totalEvents,
    checklistPassed: false,
    hasCrossSessionData: false,
  });
}

/**
 * Convenience: build a cross-session evidence packet comparing two sessions.
 */
export function buildCrossSessionEvidencePacket(
  currentResult: LearningGainResult,
  previousResult: LearningGainResult,
  currentSessionId: string,
  previousSessionId: string,
  totalEvents: number,
  opts?: {
    checklistPassed?: boolean;
    behavioralNotes?: string[];
  },
): LearningGainEvidencePacket {
  return buildLearningGainEvidencePacket({
    rubricResult: currentResult,
    sessionIds: [previousSessionId, currentSessionId],
    isCrossSession: true,
    totalEvents,
    hasCrossSessionData: true,
    previousGainResult: previousResult,
    checklistPassed: opts?.checklistPassed,
    behavioralNotes: opts?.behavioralNotes,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 12. Strength Computation
// ═══════════════════════════════════════════════════════════════════════════════

function computeOverallStrength(activeEvidence: GainEvidenceItem[]): EvidenceStrength {
  if (activeEvidence.length === 0) return "insufficient";

  const avgConfidence =
    activeEvidence.reduce((sum, e) => sum + e.confidence, 0) / activeEvidence.length;

  // Check levels from highest to lowest
  for (const level of EVIDENCE_STRENGTH_LEVELS) {
    if (
      activeEvidence.length >= level.minActiveEvidence &&
      avgConfidence >= level.minConfidence
    ) {
      return level.level;
    }
  }

  return "insufficient";
}

// ═══════════════════════════════════════════════════════════════════════════════
// 13. Claim Building
// ═══════════════════════════════════════════════════════════════════════════════

function buildAllClaims(
  evidenceItems: GainEvidenceItem[],
  overallStrength: EvidenceStrength,
  rubricResult: LearningGainResult,
): GainClaim[] {
  const activeEvidence = evidenceItems.filter((e) => e.isActive);
  const activeIds = new Set(activeEvidence.map((e) => e.evidenceTypeId));

  const claims: GainClaim[] = [];

  for (const claimType of GAIN_CLAIM_TYPE_CATALOG) {
    if (claimType.claimTypeId === "claim-none") continue;

    const supportingIds = getSupportingEvidenceIds(claimType.claimTypeId, activeIds);
    const hasSufficientData = supportingIds.length > 0;

    // Strength requirement: overall strength must meet or exceed min
    const strengthRanks: Record<EvidenceStrength, number> = {
      conclusive: 4,
      strong: 3,
      moderate: 2,
      tentative: 1,
      insufficient: 0,
    };
    const meetsStrength = strengthRanks[overallStrength] >= strengthRanks[claimType.minStrength];

    const isActive = meetsStrength && hasSufficientData;

    const claim: GainClaim = {
      claimTypeId: claimType.claimTypeId,
      statementVi: buildClaimStatementVi(claimType.claimTypeId, rubricResult, activeEvidence),
      statementEn: buildClaimStatementEn(claimType.claimTypeId, rubricResult, activeEvidence),
      requiredStrength: claimType.minStrength,
      isLearnerSafe: claimType.isLearnerSafe && isActive,
      hasSufficientData,
      supportingEvidenceIds: supportingIds,
      caveatsVi: buildClaimCaveatsVi(claimType.claimTypeId, overallStrength, activeEvidence.length),
      isActionable: claimType.isActionable && isActive,
    };

    claims.push(claim);
  }

  // Add no-claim if nothing is active
  if (claims.every((c) => !c.isLearnerSafe)) {
    claims.unshift(buildNoClaim());
  }

  // Sort: learner-safe first, then by strength requirement (highest first).
  // Exception: when nothing is learner-safe, put "claim-none" first.
  const hasAnySafe = claims.some((c) => c.isLearnerSafe);
  const ranks: Record<EvidenceStrength, number> = {
    conclusive: 4, strong: 3, moderate: 2, tentative: 1, insufficient: 0,
  };

  claims.sort((a, b) => {
    // No-claim gets top priority when nothing is safe to show
    if (!hasAnySafe) {
      if (a.claimTypeId === "claim-none") return -1;
      if (b.claimTypeId === "claim-none") return 1;
    }
    const aActive = a.isLearnerSafe ? 0 : 1;
    const bActive = b.isLearnerSafe ? 0 : 1;
    if (aActive !== bActive) return aActive - bActive;
    return ranks[b.requiredStrength] - ranks[a.requiredStrength];
  });

  return claims;
}

function buildNoClaim(): GainClaim {
  return {
    claimTypeId: "claim-none",
    statementVi: "Chưa có đủ dữ liệu để đánh giá tiến bộ của người học.",
    statementEn: "Insufficient data to assess learner progress.",
    requiredStrength: "insufficient",
    isLearnerSafe: false,
    hasSufficientData: false,
    supportingEvidenceIds: [],
    caveatsVi: ["Cần thêm dữ liệu từ các buổi học tiếp theo."],
    isActionable: false,
  };
}

function getSupportingEvidenceIds(
  claimTypeId: GainClaimTypeId,
  activeIds: Set<GainEvidenceTypeId>,
): GainEvidenceTypeId[] {
  const mapping: Record<GainClaimTypeId, GainEvidenceTypeId[]> = {
    "claim-quantitative": [
      "ev-error-reduction", "ev-pronunciation-gain", "ev-autonomy",
      "ev-self-correction", "ev-acknowledgment", "ev-weakness-resolution", "ev-retention",
    ],
    "claim-qualitative": ["ev-behavioral-change", "ev-self-correction", "ev-acknowledgment"],
    "claim-trend": ["ev-cross-session-trend", "ev-error-reduction", "ev-autonomy"],
    "claim-mastery": ["ev-retention", "ev-weakness-resolution", "ev-pronunciation-gain", "ev-checklist-gain"],
    "claim-confidence": ["ev-behavioral-change", "ev-autonomy", "ev-self-correction"],
    "claim-none": [],
  };
  return (mapping[claimTypeId] ?? []).filter((id) => activeIds.has(id));
}

// ═══════════════════════════════════════════════════════════════════════════════
// 14. Claim Statement Builders
// ═══════════════════════════════════════════════════════════════════════════════

function buildClaimStatementVi(
  claimTypeId: GainClaimTypeId,
  rubricResult: LearningGainResult,
  activeEvidence: GainEvidenceItem[],
): string {
  const improving = rubricResult.dimensions.filter((d) => d.score >= 2);
  const improvingNames = improving.map((d) => d.titleVi).join(", ");

  switch (claimTypeId) {
    case "claim-quantitative":
      if (improving.length >= 5) {
        return `Học viên tiến bộ rõ rệt ở ${improving.length}/7 chiều đo lường: ${improvingNames}.`;
      }
      if (improving.length >= 3) {
        return `Học viên có tiến bộ ở ${improving.length}/7 chiều: ${improvingNames}.`;
      }
      return `Học viên có tiến bộ nhẹ ở ${improving.length}/7 chiều: ${improvingNames}.`;
    case "claim-qualitative":
      if (activeEvidence.some((e) => e.evidenceTypeId === "ev-behavioral-change" && e.isActive)) {
        return "Học viên thể hiện thay đổi tích cực trong hành vi học tập — tự tin và chủ động hơn.";
      }
      return "Học viên bắt đầu có dấu hiệu cải thiện về mặt định tính.";
    case "claim-trend":
      if (activeEvidence.some((e) => e.evidenceTypeId === "ev-cross-session-trend" && e.strength === "strong")) {
        return "Xu hướng tiến bộ rõ rệt qua nhiều buổi học — đây là tiến bộ bền vững.";
      }
      return "Có xu hướng tiến bộ qua các buổi học, cần thêm dữ liệu để khẳng định.";
    case "claim-mastery":
      if (activeEvidence.some((e) => e.evidenceTypeId === "ev-retention" && e.strength === "strong")) {
        return "Học viên đã làm chủ một số kỹ năng — không còn lặp lại lỗi đã được sửa.";
      }
      return "Học viên đang trên đường làm chủ một số kỹ năng nhất định.";
    case "claim-confidence":
      return "Học viên tự tin hơn trong giao tiếp — nói nhiều hơn và ít ngập ngừng hơn.";
    default:
      return "Chưa đủ dữ liệu để đưa ra tuyên bố về tiến bộ.";
  }
}

function buildClaimStatementEn(
  claimTypeId: GainClaimTypeId,
  rubricResult: LearningGainResult,
  activeEvidence: GainEvidenceItem[],
): string {
  const improving = rubricResult.dimensions.filter((d) => d.score >= 2);
  const improvingNames = improving.map((d) => d.titleEn).join(", ");

  switch (claimTypeId) {
    case "claim-quantitative":
      return `Learner improved in ${improving.length}/7 measured dimensions: ${improvingNames}.`;
    case "claim-qualitative":
      return "Learner shows positive behavioral changes — more confident and proactive.";
    case "claim-trend":
      return "Improvement trend visible across multiple sessions — sustainable progress.";
    case "claim-mastery":
      return "Learner is mastering specific skills — no longer repeating corrected errors.";
    case "claim-confidence":
      return "Learner shows increased confidence — speaking more and hesitating less.";
    default:
      return "Insufficient data to make a progress claim.";
  }
}

function buildClaimCaveatsVi(
  claimTypeId: GainClaimTypeId,
  overallStrength: EvidenceStrength,
  activeCount: number,
): string[] {
  const caveats: string[] = [];

  if (overallStrength === "tentative") {
    caveats.push("Bằng chứng còn hạn chế — cần thêm dữ liệu để khẳng định chắc chắn.");
  }
  if (activeCount < 3) {
    caveats.push(`Chỉ có ${activeCount} loại bằng chứng đang hoạt động — chưa đủ để kết luận toàn diện.`);
  }
  if (claimTypeId === "claim-qualitative" || claimTypeId === "claim-confidence") {
    caveats.push("Đây là đánh giá định tính — có thể bị ảnh hưởng bởi yếu tố chủ quan.");
  }
  if (claimTypeId === "claim-trend") {
    caveats.push("Xu hướng cần ít nhất 3 buổi để có ý nghĩa thống kê.");
  }

  return caveats;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 15. Verdict Computation
// ═══════════════════════════════════════════════════════════════════════════════

function computeVerdict(
  rubricResult: LearningGainResult,
  activeEvidence: GainEvidenceItem[],
  overallStrength: EvidenceStrength,
): GainEvidenceVerdict {
  if (!rubricResult.sufficientData) {
    return "no_conclusive_evidence";
  }

  const classification = rubricResult.classification;

  switch (classification) {
    case "significant_gain":
      if (overallStrength === "conclusive" || overallStrength === "strong") {
        return "proven_significant_gain";
      }
      return "proven_moderate_gain";
    case "moderate_gain":
      if (overallStrength === "conclusive" || overallStrength === "strong") {
        return "proven_moderate_gain";
      }
      return "proven_minimal_gain";
    case "minimal_gain":
      return "proven_minimal_gain";
    case "regression":
      return "evidence_of_regression";
    case "no_measurable_gain":
    default:
      return "no_conclusive_evidence";
  }
}

function determineProductProofBar(
  verdict: GainEvidenceVerdict,
  activeEvidenceCount: number,
): boolean {
  return (
    (verdict === "proven_significant_gain" || verdict === "proven_moderate_gain") &&
    activeEvidenceCount >= 4
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 16. Summary Builders
// ═══════════════════════════════════════════════════════════════════════════════

function buildLearnerSummaryVi(
  verdict: GainEvidenceVerdict,
  activeEvidence: GainEvidenceItem[],
  rubricResult: LearningGainResult,
): string {
  if (!rubricResult.sufficientData) {
    return "Chưa có đủ dữ liệu để đánh giá tiến bộ của con trong buổi này. Hãy học thêm một vài buổi nữa để Mercy có thể theo dõi sự tiến bộ của con nhé!";
  }

  const improvingDims = activeEvidence
    .filter((e) => e.strength === "strong" || e.strength === "moderate")
    .map((e) => e.titleVi);

  const improvingList = improvingDims.length > 0
    ? improvingDims.join(", ")
    : "một số kỹ năng";

  switch (verdict) {
    case "proven_significant_gain":
      return `📈 Tuyệt vời! Con đã tiến bộ rõ rệt trong buổi học này. Con cải thiện ở: ${improvingList}. Hãy tiếp tục phát huy nhé!`;
    case "proven_moderate_gain":
      return `👍 Tốt lắm! Con có tiến bộ ở: ${improvingList}. Tiếp tục luyện tập để còn giỏi hơn nữa nha!`;
    case "proven_minimal_gain":
      return `🔍 Con đang có tiến bộ nhẹ ở ${improvingList}. Đừng nản — mỗi buổi học là một bước tiến nhỏ!`;
    case "evidence_of_regression":
      return `⚠️ Có vẻ buổi này hơi khó với con. Đừng lo — có những buổi mình học nhiều, có buổi mình ôn tập. Để Mercy điều chỉnh lại bài học cho phù hợp với con hơn nhé.`;
    case "no_conclusive_evidence":
    default:
      return `Chưa thấy tiến bộ rõ ràng trong buổi này. Nhưng không sao — học ngôn ngữ là một hành trình dài. Hãy tiếp tục học đều đặn nhé!`;
  }
}

function buildChauBriefingVi(
  verdict: GainEvidenceVerdict,
  activeEvidence: GainEvidenceItem[],
  rubricResult: LearningGainResult,
  sessionIds: string[],
  isCrossSession: boolean,
): string {
  const evidenceList = activeEvidence
    .map((e) => `  • ${e.titleVi}: ${e.descriptionVi}`)
    .join("\n");

  const sessionLabel = isCrossSession
    ? `${sessionIds.length} buổi (${sessionIds.join(", ")})`
    : `buổi ${sessionIds[0] ?? "?"}`;

  const improvingCount = rubricResult.dimensions.filter((d) => d.score >= 2).length;
  const decliningCount = rubricResult.dimensions.filter((d) => d.score === 0).length;

  const header = verdictLabelVi(verdict);

  return [
    `📊 BÁO CÁO TIẾN BỘ — ${sessionLabel}`,
    `Kết luận: ${header}`,
    `Số chiều cải thiện: ${improvingCount}/7 | Số chiều đi xuống: ${decliningCount}/7`,
    `Tổng sự kiện: ${rubricResult.totalEvents}`,
    ``,
    `Bằng chứng hoạt động (${activeEvidence.length}/10):`,
    evidenceList || "  (không có bằng chứng hoạt động)",
    ``,
    `CHAU ↓↓↓ COPY FROM HERE`,
    `Hành động đề xuất:`,
    ...buildChauActionItems(verdict, computeOverallStrength(activeEvidence), activeEvidence, rubricResult)
      .map((a) => `  • ${a}`),
  ].join("\n");
}

function buildSummaryEn(
  verdict: GainEvidenceVerdict,
  activeEvidence: GainEvidenceItem[],
  rubricResult: LearningGainResult,
): string {
  const improvingCount = rubricResult.dimensions.filter((d) => d.score >= 2).length;
  const verdictEn = verdictLabelEn(verdict);

  return [
    `Learning gain evidence packet — ${verdictEn}`,
    `Improving dimensions: ${improvingCount}/7`,
    `Active evidence items: ${activeEvidence.length}/10`,
    `Total events: ${rubricResult.totalEvents}`,
    `Sufficient data: ${rubricResult.sufficientData ? "yes" : "no"}`,
  ].join(" | ");
}

// ═══════════════════════════════════════════════════════════════════════════════
// 17. Chau Action Items
// ═══════════════════════════════════════════════════════════════════════════════

function buildChauActionItems(
  verdict: GainEvidenceVerdict,
  overallStrength: EvidenceStrength,
  activeEvidence: GainEvidenceItem[],
  rubricResult: LearningGainResult,
): string[] {
  const items: string[] = [];

  switch (verdict) {
    case "proven_significant_gain":
      items.push("🎉 Khen thưởng: tiến bộ rõ rệt — cân nhắc tăng độ khó bài tập.");
      items.push("📝 Ghi nhận pattern dạy hiệu quả để áp dụng cho learner khác.");
      break;
    case "proven_moderate_gain":
      items.push("👍 Tiếp tục pattern dạy hiện tại — đang hiệu quả.");
      items.push("🔍 Xem xét chiều chưa cải thiện để điều chỉnh.");
      break;
    case "proven_minimal_gain":
      items.push("🔍 Xem xét lại phương pháp dạy — tiến bộ chậm.");
      items.push("📊 Kiểm tra: có phải bài tập quá khó hoặc quá dễ?");
      break;
    case "evidence_of_regression":
      items.push("⚠️ CẢNH BÁO: học viên đang đi xuống — dừng pattern hiện tại.");
      items.push("🔄 Chuyển sang buổi 'chữa lành': ôn tập nhẹ nhàng.");
      items.push("📋 Kiểm tra: quá tải? Sửa quá nhiều? Ghost corrections?");
      break;
    case "no_conclusive_evidence":
      items.push("📊 Chưa đủ dữ liệu — cần thêm buổi học để đo lường.");
      items.push("⏱️ Khuyến khích learner học session dài hơn (tối thiểu 10 turn).");
      break;
  }

  // Add evidence-specific items
  const weakDims = rubricResult.dimensions.filter((d) => d.score === 0);
  if (weakDims.length > 0) {
    items.push(`⚠️ Chiều yếu: ${weakDims.map((d) => d.titleVi).join(", ")} — cần chú ý.`);
  }

  if (overallStrength === "tentative" || overallStrength === "insufficient") {
    items.push("📊 Bằng chứng chưa đủ mạnh — cân nhắc gom dữ liệu nhiều buổi.");
  }

  if (activeEvidence.length < 3) {
    items.push("🔍 Ít bằng chứng hoạt động — kiểm tra pipeline đo lường.");
  }

  return items;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 18. Verdict Labels
// ═══════════════════════════════════════════════════════════════════════════════

function verdictLabelVi(verdict: GainEvidenceVerdict): string {
  switch (verdict) {
    case "proven_significant_gain": return "📈 Tiến bộ rõ rệt (đã chứng minh)";
    case "proven_moderate_gain": return "👍 Có tiến bộ (đã chứng minh)";
    case "proven_minimal_gain": return "🔍 Tiến bộ nhẹ (có bằng chứng)";
    case "no_conclusive_evidence": return "❓ Chưa đủ bằng chứng";
    case "evidence_of_regression": return "⚠️ Có dấu hiệu thụt lùi";
  }
}

function verdictLabelEn(verdict: GainEvidenceVerdict): string {
  switch (verdict) {
    case "proven_significant_gain": return "Proven significant gain";
    case "proven_moderate_gain": return "Proven moderate gain";
    case "proven_minimal_gain": return "Proven minimal gain";
    case "no_conclusive_evidence": return "No conclusive evidence";
    case "evidence_of_regression": return "Evidence of regression";
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 19. Public Label Getters
// ═══════════════════════════════════════════════════════════════════════════════

/** Get Vietnamese label for a gain evidence verdict. */
export function getGainVerdictLabelVi(verdict: GainEvidenceVerdict): string {
  return verdictLabelVi(verdict);
}

/** Get English label for a gain evidence verdict. */
export function getGainVerdictLabelEn(verdict: GainEvidenceVerdict): string {
  return verdictLabelEn(verdict);
}

/** Get Vietnamese label for an evidence strength level. */
export function getEvidenceStrengthLabelVi(strength: EvidenceStrength): string {
  const entry = EVIDENCE_STRENGTH_LEVELS.find((e) => e.level === strength);
  return entry?.labelVi ?? "Không xác định";
}

/** Get English label for an evidence strength level. */
export function getEvidenceStrengthLabelEn(strength: EvidenceStrength): string {
  const entry = EVIDENCE_STRENGTH_LEVELS.find((e) => e.level === strength);
  return entry?.labelEn ?? "Unknown";
}

/** Get Vietnamese label for a gain claim type. */
export function getGainClaimTypeLabelVi(claimTypeId: GainClaimTypeId): string {
  const entry = GAIN_CLAIM_TYPE_CATALOG.find((c) => c.claimTypeId === claimTypeId);
  return entry?.titleVi ?? "Không xác định";
}

/** Get English label for a gain claim type. */
export function getGainClaimTypeLabelEn(claimTypeId: GainClaimTypeId): string {
  const entry = GAIN_CLAIM_TYPE_CATALOG.find((c) => c.claimTypeId === claimTypeId);
  return entry?.titleEn ?? "Unknown";
}

// ═══════════════════════════════════════════════════════════════════════════════
// 20. Validation
// ═══════════════════════════════════════════════════════════════════════════════

export interface GainEvidenceValidationError {
  field: string;
  messageVi: string;
  messageEn: string;
}

/**
 * Validate a gain evidence item structure.
 */
export function validateGainEvidenceItem(item: GainEvidenceItem): GainEvidenceValidationError[] {
  const errors: GainEvidenceValidationError[] = [];

  if (!item.evidenceTypeId) {
    errors.push({ field: "evidenceTypeId", messageVi: "Thiếu evidenceTypeId.", messageEn: "Missing evidenceTypeId." });
  }
  if (!item.titleVi) {
    errors.push({ field: "titleVi", messageVi: "Thiếu titleVi.", messageEn: "Missing titleVi." });
  }
  if (item.confidence < 0 || item.confidence > 1) {
    errors.push({
      field: "confidence",
      messageVi: `Confidence ${item.confidence} ngoài khoảng [0, 1].`,
      messageEn: `Confidence ${item.confidence} outside [0, 1].`,
    });
  }
  if (item.minEventsRequired < 0) {
    errors.push({
      field: "minEventsRequired",
      messageVi: `minEventsRequired ${item.minEventsRequired} < 0.`,
      messageEn: `minEventsRequired ${item.minEventsRequired} < 0.`,
    });
  }

  return errors;
}

/**
 * Validate a gain claim structure.
 */
export function validateGainClaim(claim: GainClaim): GainEvidenceValidationError[] {
  const errors: GainEvidenceValidationError[] = [];

  if (!claim.claimTypeId) {
    errors.push({ field: "claimTypeId", messageVi: "Thiếu claimTypeId.", messageEn: "Missing claimTypeId." });
  }
  if (!claim.statementVi) {
    errors.push({ field: "statementVi", messageVi: "Thiếu statementVi.", messageEn: "Missing statementVi." });
  }
  if (!claim.requiredStrength) {
    errors.push({ field: "requiredStrength", messageVi: "Thiếu requiredStrength.", messageEn: "Missing requiredStrength." });
  }

  return errors;
}

/**
 * Validate a complete evidence packet.
 */
export function validateGainEvidencePacket(
  packet: LearningGainEvidencePacket,
): GainEvidenceValidationError[] {
  const errors: GainEvidenceValidationError[] = [];

  if (!packet.packetId) {
    errors.push({ field: "packetId", messageVi: "Thiếu packetId.", messageEn: "Missing packetId." });
  }
  if (packet.evidenceItems.length !== 10) {
    errors.push({
      field: "evidenceItems",
      messageVi: `Cần đúng 10 evidence items, có ${packet.evidenceItems.length}.`,
      messageEn: `Expected 10 evidence items, got ${packet.evidenceItems.length}.`,
    });
  }
  if (packet.totalEvidenceCount !== 10) {
    errors.push({
      field: "totalEvidenceCount",
      messageVi: `totalEvidenceCount phải là 10, là ${packet.totalEvidenceCount}.`,
      messageEn: `totalEvidenceCount must be 10, got ${packet.totalEvidenceCount}.`,
    });
  }
  if (packet.activeEvidenceCount !== packet.activeEvidence.length) {
    errors.push({
      field: "activeEvidenceCount",
      messageVi: "activeEvidenceCount không khớp với activeEvidence.length.",
      messageEn: "activeEvidenceCount does not match activeEvidence.length.",
    });
  }
  if (packet.sessionIds.length === 0) {
    errors.push({ field: "sessionIds", messageVi: "Cần ít nhất 1 sessionId.", messageEn: "Need at least 1 sessionId." });
  }
  if (packet.totalEvents < 0) {
    errors.push({
      field: "totalEvents",
      messageVi: `totalEvents ${packet.totalEvents} < 0.`,
      messageEn: `totalEvents ${packet.totalEvents} < 0.`,
    });
  }

  // Validate each evidence item
  for (const item of packet.evidenceItems) {
    errors.push(...validateGainEvidenceItem(item));
  }

  // Validate claims
  for (const claim of packet.allClaims) {
    errors.push(...validateGainClaim(claim));
  }
  errors.push(...validateGainClaim(packet.primaryClaim));

  // Check that allClaims includes primaryClaim
  if (!packet.allClaims.some((c) => c.claimTypeId === packet.primaryClaim.claimTypeId)) {
    errors.push({
      field: "primaryClaim",
      messageVi: "primaryClaim không có trong allClaims.",
      messageEn: "primaryClaim not found in allClaims.",
    });
  }

  return errors;
}

/**
 * Validate the evidence type catalog itself.
 */
export function validateGainEvidenceTypeCatalog(): GainEvidenceValidationError[] {
  const errors: GainEvidenceValidationError[] = [];
  const ids = new Set<string>();

  for (const entry of GAIN_EVIDENCE_TYPE_CATALOG) {
    if (ids.has(entry.evidenceTypeId)) {
      errors.push({
        field: `catalog.${entry.evidenceTypeId}`,
        messageVi: `Trùng evidenceTypeId: ${entry.evidenceTypeId}.`,
        messageEn: `Duplicate evidenceTypeId: ${entry.evidenceTypeId}.`,
      });
    }
    ids.add(entry.evidenceTypeId);

    if (!entry.titleVi) {
      errors.push({
        field: `catalog.${entry.evidenceTypeId}.titleVi`,
        messageVi: "Thiếu titleVi.",
        messageEn: "Missing titleVi.",
      });
    }
    if (entry.minEventsRequired < 0) {
      errors.push({
        field: `catalog.${entry.evidenceTypeId}.minEventsRequired`,
        messageVi: `minEventsRequired < 0.`,
        messageEn: `minEventsRequired < 0.`,
      });
    }
  }

  return errors;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 21. Catalog Accessors
// ═══════════════════════════════════════════════════════════════════════════════

/** Get a copy of the evidence type catalog. */
export function getGainEvidenceTypeCatalog(): GainEvidenceTypeEntry[] {
  return GAIN_EVIDENCE_TYPE_CATALOG.map((e) => ({ ...e }));
}

/** Get a single evidence type entry by ID. */
export function getGainEvidenceTypeById(id: GainEvidenceTypeId): GainEvidenceTypeEntry | null {
  return GAIN_EVIDENCE_TYPE_CATALOG.find((e) => e.evidenceTypeId === id) ?? null;
}

/** Get evidence types by mapped dimension. */
export function getGainEvidenceTypesByDimension(
  dimId: LearningGainDimensionId,
): GainEvidenceTypeEntry[] {
  return GAIN_EVIDENCE_TYPE_CATALOG.filter((e) => e.mappedDimensionId === dimId);
}

/** Get a copy of the claim type catalog. */
export function getGainClaimTypeCatalog(): GainClaimTypeEntry[] {
  return GAIN_CLAIM_TYPE_CATALOG.map((c) => ({ ...c }));
}

/** Get a single claim type entry by ID. */
export function getGainClaimTypeById(id: GainClaimTypeId): GainClaimTypeEntry | null {
  return GAIN_CLAIM_TYPE_CATALOG.find((c) => c.claimTypeId === id) ?? null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 22. Statistics
// ═══════════════════════════════════════════════════════════════════════════════

export interface GainEvidenceStatistics {
  totalEvidenceTypes: number;
  totalClaimTypes: number;
  evidenceTypesByDimension: Record<string, number>;
  totalGuardedFailures: number;
  totalSubGates: number;
  dimensionsWithEvidence: number;
  dimensionsWithoutEvidence: number;
}

/**
 * Compute aggregate statistics about the evidence type catalog.
 */
export function getGainEvidenceStatistics(): GainEvidenceStatistics {
  const evidenceTypesByDimension: Record<string, number> = {};
  let totalGuardedFailures = 0;
  let totalSubGates = 0;
  const dimsWithEvidence = new Set<string>();

  for (const entry of GAIN_EVIDENCE_TYPE_CATALOG) {
    const dimKey = entry.mappedDimensionId ?? "cross-cutting";
    evidenceTypesByDimension[dimKey] = (evidenceTypesByDimension[dimKey] ?? 0) + 1;
    totalGuardedFailures += entry.guardedFailureIds.length;
    totalSubGates += entry.satisfiedSubGateIds.length;
    if (entry.mappedDimensionId) dimsWithEvidence.add(entry.mappedDimensionId);
  }

  const allDimIds = LEARNING_GAIN_DIMENSION_CATALOG.map((d) => d.id);
  const dimensionsWithoutEvidence = allDimIds.filter((id) => !dimsWithEvidence.has(id)).length;

  return {
    totalEvidenceTypes: GAIN_EVIDENCE_TYPE_CATALOG.length,
    totalClaimTypes: GAIN_CLAIM_TYPE_CATALOG.length,
    evidenceTypesByDimension,
    totalGuardedFailures,
    totalSubGates,
    dimensionsWithEvidence: dimsWithEvidence.size,
    dimensionsWithoutEvidence,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 23. Quick-Check Utilities
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if a packet has enough evidence to be shown to the learner.
 */
export function isPacketLearnerSafe(packet: LearningGainEvidencePacket): boolean {
  return packet.primaryClaim.isLearnerSafe && packet.activeEvidenceCount >= 2;
}

/**
 * Check if a packet represents actionable progress (can drive next-lesson decisions).
 */
export function isPacketActionable(packet: LearningGainEvidencePacket): boolean {
  return packet.primaryClaim.isActionable && packet.meetsProductProofBar;
}

/**
 * Get the strongest active evidence item in a packet.
 */
export function getStrongestEvidence(packet: LearningGainEvidencePacket): GainEvidenceItem | null {
  if (packet.activeEvidence.length === 0) return null;
  const ranks: Record<EvidenceStrength, number> = {
    conclusive: 5, strong: 4, moderate: 3, tentative: 2, insufficient: 1,
  };
  return packet.activeEvidence.reduce((best, curr) =>
    ranks[curr.strength] > ranks[best.strength] ? curr : best,
  );
}

/**
 * Get the weakest active evidence item in a packet.
 */
export function getWeakestEvidence(packet: LearningGainEvidencePacket): GainEvidenceItem | null {
  if (packet.activeEvidence.length === 0) return null;
  const ranks: Record<EvidenceStrength, number> = {
    conclusive: 5, strong: 4, moderate: 3, tentative: 2, insufficient: 1,
  };
  return packet.activeEvidence.reduce((worst, curr) =>
    ranks[curr.strength] < ranks[worst.strength] ? curr : worst,
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 24. Integration Getters
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get the baseline scenario IDs relevant to a gain evidence packet.
 * Maps to Step 111's humanQualityScenarioBank and Step 113's chatbotBaselineComparison.
 */
export function getRelevantGainScenarioIds(): string[] {
  return [
    "hq-gain-a2-pre-post-measurement",
    "bl-gain-a2-before-after",
    "bl-gain-b1-multi-session",
  ];
}

/**
 * Get all guarded failure IDs across the evidence type catalog.
 */
export function getAllGuardedGainFailureIds(): string[] {
  return collectUnique(GAIN_EVIDENCE_TYPE_CATALOG.flatMap((e) => e.guardedFailureIds));
}

/**
 * Get all satisfied sub-gate IDs across the evidence type catalog.
 */
export function getAllGainSubGateIds(): string[] {
  return collectUnique(GAIN_EVIDENCE_TYPE_CATALOG.flatMap((e) => e.satisfiedSubGateIds));
}

/**
 * Get the evaluator prompt IDs relevant to learning gain evidence.
 * Maps to Step 112's harshEvaluatorPrompts.
 */
export function getRelevantGainEvaluatorPromptIds(): string[] {
  return [
    "eval-judge-learningGain",
    "eval-adversary-learningGain",
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 25. Internal Utilities
// ═══════════════════════════════════════════════════════════════════════════════

function collectUnique<T>(items: T[]): T[] {
  return [...new Set(items)].sort();
}

function buildPacketId(sessionIds: string[], generatedAt: number): string {
  const sessionPart = sessionIds.join("-").slice(0, 40);
  return `gain-evidence-${sessionPart}-${generatedAt}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 26. Test Helpers
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create a minimal valid input for testing.
 */
export function createMinimalGainPacketInput(
  overrides?: Partial<LearningGainEvidencePacketInput>,
): LearningGainEvidencePacketInput {
  return {
    rubricResult: {
      classification: "moderate_gain",
      improvingDimensions: 3,
      decliningDimensions: 0,
      dimensions: [],
      summaryVi: "Có tiến bộ.",
      summaryEn: "Moderate gain.",
      baseline: {
        eventCount: 5,
        errorRate: 0.4,
        avgMatchScore: 60,
        selfCorrectionCount: 1,
        acknowledgmentCount: 2,
        totalCorrections: 8,
        weaknessCounts: { "article": 3, "tense": 2 },
        avgConfidence: 0.5,
        uniqueWeaknessCount: 2,
      },
      outcome: {
        eventCount: 5,
        errorRate: 0.2,
        avgMatchScore: 75,
        selfCorrectionCount: 3,
        acknowledgmentCount: 4,
        totalCorrections: 4,
        weaknessCounts: { "article": 1 },
        avgConfidence: 0.7,
        uniqueWeaknessCount: 1,
      },
      totalEvents: 10,
      sufficientData: true,
    },
    sessionIds: ["test-session-1"],
    isCrossSession: false,
    totalEvents: 10,
    checklistPassed: false,
    hasCrossSessionData: false,
    behavioralNotes: [],
    ...overrides,
  };
}
