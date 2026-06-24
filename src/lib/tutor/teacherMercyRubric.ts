/**
 * Teacher Mercy — Behavior Rubric
 *
 * Maps the 10 contract rules (teacherMercyContract.ts) into 7 human-evaluable
 * rubric dimensions. Each dimension produces a score 0–3 and a qualitative label.
 *
 * The rubric is designed to help future steps prove:
 *   - no fake praise
 *   - one question maximum
 *   - meaning before correction
 *   - one correction maximum
 *   - strategic silence / self-correction
 *   - Vietnamese interference explanation only when useful
 *   - next practice recommendation only when useful
 *
 * This file does NOT duplicate the contract. It consumes ContractCheckResult
 * (the output of checkTeacherMercyContract / checkCorrectionContract /
 * checkConversationContract) and maps individual rule checks to rubric dimensions.
 */

import {
  type ContractCheckResult,
  type ContractRuleCheck,
  type ContractLearnerInput,
  type ContractTutorResponse,
  checkTeacherMercyContract,
} from "./teacherMercyContract";

// ─── Rubric Dimensions ──────────────────────────────────────────────────

export type RubricDimensionId =
  | "warmth"
  | "accuracy"
  | "correction_timing"
  | "specificity"
  | "follow_up_quality"
  | "learner_memory_use"
  | "safety";

export type DimensionScore = 0 | 1 | 2 | 3;

export type DimensionLabel =
  | "excellent"
  | "good"
  | "needs_work"
  | "failing";

export type RubricDimensionResult = {
  /** Dimension identifier. */
  dimensionId: RubricDimensionId;
  /** Vietnamese label for the dimension. */
  titleVi: string;
  /** English label for the dimension. */
  titleEn: string;
  /** Numeric score 0–3. */
  score: DimensionScore;
  /** Qualitative label derived from the score. */
  label: DimensionLabel;
  /** The contract rules that feed into this dimension. */
  sourceRuleIds: string[];
  /** Individual rule results for this dimension. */
  ruleResults: ContractRuleCheck[];
  /** Explanation in Vietnamese of why this score was given. */
  detailVi: string;
};

export type RubricOverallClassification =
  | "exemplary"
  | "acceptable"
  | "needs_revision"
  | "failing";

export type RubricResult = {
  /** Overall classification. */
  classification: RubricOverallClassification;
  /** Whether all hard-safety rules passed. */
  safetyPassed: boolean;
  /** Per-dimension results. */
  dimensions: RubricDimensionResult[];
  /** Summary in Vietnamese suitable for display. */
  summaryVi: string;
  /** The raw contract result this rubric was built from. */
  contractResult: ContractCheckResult;
};

// ─── Dimension Definitions ──────────────────────────────────────────────

/**
 * Mapping of rubric dimensions to the contract rule IDs that inform them.
 * One rule can appear in multiple dimensions (e.g., R8 affects both warmth and safety).
 */
const DIMENSION_RULE_MAP: Record<RubricDimensionId, string[]> = {
  warmth: ["R3_NO_FAKE_PRAISE", "R8_FACE_SAVING"],
  accuracy: ["R2_ONE_CORRECTION_MAX", "R7_STRATEGIC_SILENCE"],
  correction_timing: ["R1_MEANING_FIRST", "R2_ONE_CORRECTION_MAX"],
  specificity: ["R6_VIETNAMESE_INTERFERENCE", "R8_FACE_SAVING"],
  follow_up_quality: ["R4_ONE_FOLLOW_UP", "R9_SELF_CORRECTION_SPACE", "R10_NEXT_PRACTICE_WHEN_HELPFUL"],
  learner_memory_use: ["R5_REMEMBER_WEAKNESS"],
  safety: ["R3_NO_FAKE_PRAISE", "R7_STRATEGIC_SILENCE", "R8_FACE_SAVING"],
};

/** Hard-safety rules — if any of these fail, the response is unsafe. */
const HARD_SAFETY_RULES = new Set([
  "R3_NO_FAKE_PRAISE",
  "R7_STRATEGIC_SILENCE",
  "R8_FACE_SAVING",
]);

const DIMENSION_TITLES: Record<RubricDimensionId, { vi: string; en: string }> = {
  warmth: { vi: "Ấm áp", en: "Warmth" },
  accuracy: { vi: "Chính xác", en: "Accuracy" },
  correction_timing: { vi: "Thời điểm sửa lỗi", en: "Correction timing" },
  specificity: { vi: "Cụ thể", en: "Specificity" },
  follow_up_quality: { vi: "Chất lượng câu hỏi tiếp nối", en: "Follow-up quality" },
  learner_memory_use: { vi: "Nhớ điểm yếu người học", en: "Learner-memory use" },
  safety: { vi: "An toàn", en: "Safety" },
};

// ─── Scoring Helpers ────────────────────────────────────────────────────

function scoreToLabel(score: DimensionScore): DimensionLabel {
  switch (score) {
    case 3: return "excellent";
    case 2: return "good";
    case 1: return "needs_work";
    case 0: return "failing";
  }
}

/**
 * Compute a dimension score from the subset of contract rules that belong to it.
 *
 * Scoring:
 *   - 3 = all rules passed
 *   - 2 = ≥ 67% passed
 *   - 1 = ≥ 1 passed, < 67%
 *   - 0 = none passed
 */
function computeDimensionScore(rules: ContractRuleCheck[]): DimensionScore {
  if (rules.length === 0) return 3; // no rules to check → trivially excellent
  const passed = rules.filter((r) => r.passed).length;
  const total = rules.length;
  // Use integer math to avoid 2/3 = 0.666... < 0.67 floating-point gotcha
  if (passed === total) return 3;
  if (passed * 3 >= total * 2) return 2; // ≥ 2/3
  if (passed > 0) return 1;
  return 0;
}

/**
 * Build the Vietnamese detail string for a dimension.
 */
function buildDimensionDetail(
  dimensionId: RubricDimensionId,
  rules: ContractRuleCheck[],
  score: DimensionScore,
): string {
  if (rules.length === 0) return "Không có quy tắc nào trong chiều này.";

  const failed = rules.filter((r) => !r.passed);
  const passed = rules.filter((r) => r.passed);

  if (score === 3) {
    return `Tất cả ${rules.length} quy tắc đều đạt.`;
  }
  if (score === 2) {
    const failedTitles = failed.map((r) => r.titleVi).join("; ");
    return `${passed.length}/${rules.length} quy tắc đạt. Không đạt: ${failedTitles}.`;
  }
  if (score === 1) {
    const failedTitles = failed.map((r) => r.titleVi).join("; ");
    return `Chỉ ${passed.length}/${rules.length} quy tắc đạt. Không đạt: ${failedTitles}.`;
  }
  return `Tất cả ${rules.length} quy tắc đều không đạt.`;
}

// ─── Classification ─────────────────────────────────────────────────────

/**
 * Classify the overall rubric result.
 *
 *   - "failing"  — any hard-safety rule failed (R3, R7, R8)
 *   - "needs_revision" — ≥ 3 dimensions at ≤ 1, or overall contract not passed
 *   - "acceptable" — ≤ 2 dimensions at ≤ 1, overall mostly passes
 *   - "exemplary" — all dimensions ≥ 2
 */
function classify(
  dimensions: RubricDimensionResult[],
  contractResult: ContractCheckResult,
): { classification: RubricOverallClassification; safetyPassed: boolean } {
  // Hard-safety gate: R3, R7, R8 must all pass
  const hardSafetyRules = contractResult.rules.filter((r) =>
    HARD_SAFETY_RULES.has(r.ruleId),
  );
  const safetyPassed = hardSafetyRules.every((r) => r.passed);

  if (!safetyPassed) {
    return { classification: "failing", safetyPassed: false };
  }

  const lowDimensions = dimensions.filter((d) => d.score <= 1).length;

  if (lowDimensions >= 3 || !contractResult.passed) {
    return { classification: "needs_revision", safetyPassed: true };
  }

  if (dimensions.every((d) => d.score >= 2)) {
    return { classification: "exemplary", safetyPassed: true };
  }

  return { classification: "acceptable", safetyPassed: true };
}

function buildSummaryVi(
  classification: RubricOverallClassification,
  dimensions: RubricDimensionResult[],
): string {
  const dimSummary = dimensions
    .map((d) => `${d.titleVi}: ${d.score}/3`)
    .join(", ");

  switch (classification) {
    case "exemplary":
      return `Xuất sắc — tất cả chiều đều tốt. (${dimSummary})`;
    case "acceptable":
      return `Đạt yêu cầu — phần lớn các chiều ổn. Cần cải thiện một số điểm nhỏ. (${dimSummary})`;
    case "needs_revision":
      return `Cần sửa lại — nhiều chiều chưa đạt. (${dimSummary})`;
    case "failing":
      return `Không an toàn — vi phạm quy tắc an toàn / thể diện. Phải sửa ngay. (${dimSummary})`;
  }
}

// ─── Public API ─────────────────────────────────────────────────────────

/**
 * Evaluate a Teacher Mercy response against the 7-dimension rubric.
 *
 * This is the main entry point. It runs the full contract check and then
 * maps the contract results into rubric dimensions.
 *
 * Pure function — no I/O, no side effects, deterministic.
 */
export function evaluateRubric(
  learnerInput: ContractLearnerInput,
  response: ContractTutorResponse,
): RubricResult {
  const contractResult = checkTeacherMercyContract(learnerInput, response);

  const dimensions: RubricDimensionResult[] = (
    Object.keys(DIMENSION_RULE_MAP) as RubricDimensionId[]
  ).map((dimId) => {
    const sourceRuleIds = DIMENSION_RULE_MAP[dimId];
    const ruleResults = contractResult.rules.filter((r) =>
      sourceRuleIds.includes(r.ruleId),
    );
    const score = computeDimensionScore(ruleResults);

    return {
      dimensionId: dimId,
      titleVi: DIMENSION_TITLES[dimId].vi,
      titleEn: DIMENSION_TITLES[dimId].en,
      score,
      label: scoreToLabel(score),
      sourceRuleIds,
      ruleResults,
      detailVi: buildDimensionDetail(dimId, ruleResults, score),
    };
  });

  const { classification, safetyPassed } = classify(dimensions, contractResult);

  return {
    classification,
    safetyPassed,
    dimensions,
    summaryVi: buildSummaryVi(classification, dimensions),
    contractResult,
  };
}

/**
 * Convenience: evaluate only the dimensions that are most relevant given a tutor mode.
 *
 * - "correction" mode → focuses on accuracy, correction_timing, specificity, safety
 * - "conversation" mode → focuses on warmth, follow_up_quality, learner_memory_use, safety
 * - "full" → all 7 dimensions
 */
export function evaluateRubricFocused(
  learnerInput: ContractLearnerInput,
  response: ContractTutorResponse,
  mode: "correction" | "conversation" | "full",
): RubricResult {
  const full = evaluateRubric(learnerInput, response);

  if (mode === "full") return full;

  const relevantDimensions: RubricDimensionId[] =
    mode === "correction"
      ? ["accuracy", "correction_timing", "specificity", "safety", "warmth"]
      : ["warmth", "follow_up_quality", "learner_memory_use", "safety", "specificity"];

  const filteredDimensions = full.dimensions.filter((d) =>
    relevantDimensions.includes(d.dimensionId),
  );

  const { classification, safetyPassed } = classify(
    filteredDimensions,
    full.contractResult,
  );

  return {
    ...full,
    classification,
    safetyPassed,
    dimensions: filteredDimensions,
    summaryVi: buildSummaryVi(classification, filteredDimensions),
  };
}

/**
 * Quick check: does this response pass the hard-safety gate?
 * Returns true only if R3, R7, R8 all pass.
 */
export function isResponseSafe(
  learnerInput: ContractLearnerInput,
  response: ContractTutorResponse,
): boolean {
  const contractResult = checkTeacherMercyContract(learnerInput, response);
  return contractResult.rules
    .filter((r) => HARD_SAFETY_RULES.has(r.ruleId))
    .every((r) => r.passed);
}

// ─── Dimension Catalog (for documentation and UI) ───────────────────────

export const TEACHER_MERCY_RUBRIC_CATALOG: ReadonlyArray<{
  id: RubricDimensionId;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  ruleCount: number;
}> = [
  {
    id: "warmth",
    titleVi: "Ấm áp",
    titleEn: "Warmth",
    descriptionVi: "Mercy khích lệ chân thật, không khen giả, không làm người học xấu hổ.",
    ruleCount: 2,
  },
  {
    id: "accuracy",
    titleEn: "Accuracy",
    titleVi: "Chính xác",
    descriptionVi: "Mercy chỉ sửa khi tự tin — một lỗi quan trọng nhất, không sửa tràn lan.",
    ruleCount: 2,
  },
  {
    id: "correction_timing",
    titleEn: "Correction timing",
    titleVi: "Thời điểm sửa lỗi",
    descriptionVi: "Mercy xác nhận ý người học trước khi sửa, và chỉ sửa một lỗi.",
    ruleCount: 2,
  },
  {
    id: "specificity",
    titleEn: "Specificity",
    titleVi: "Cụ thể",
    descriptionVi: "Mercy giải thích can thiệp tiếng Việt khi hữu ích, và dùng ngôn ngữ giữ thể diện cụ thể.",
    ruleCount: 2,
  },
  {
    id: "follow_up_quality",
    titleEn: "Follow-up quality",
    titleVi: "Chất lượng câu hỏi tiếp nối",
    descriptionVi: "Mercy hỏi đúng một câu nối tiếp tự nhiên, công nhận khi người học tự sửa, và chỉ gợi ý bước tiếp khi hữu ích.",
    ruleCount: 3,
  },
  {
    id: "learner_memory_use",
    titleEn: "Learner-memory use",
    titleVi: "Nhớ điểm yếu người học",
    descriptionVi: "Mercy theo dõi ít nhất một điểm yếu và nhắc đến khi liên quan đến lỗi hiện tại.",
    ruleCount: 1,
  },
  {
    id: "safety",
    titleEn: "Safety",
    titleVi: "An toàn",
    descriptionVi: "Mercy không khen giả, không sửa khi không chắc, không làm mất thể diện.",
    ruleCount: 3,
  },
];
