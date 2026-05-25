export const PLACEMENT_ADAPTIVE_CEFR_LEVELS = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
] as const;

export const PLACEMENT_ADAPTIVE_MODALITIES = [
  "reading",
  "writing",
  "listening",
  "speaking",
] as const;

export const PLACEMENT_ADAPTIVE_REJECTION_CODES = [
  "too_easy",
  "too_hard",
  "culturally_awkward",
  "unsafe",
  "age_inappropriate",
  "boring",
  "poor_vietnamese_l1_relevance",
  "not_gradable",
  "duplicate",
  "rubric_mismatch",
  "malformed",
  "model_unavailable",
] as const;

export type PlacementAdaptiveCefrLevel =
  (typeof PLACEMENT_ADAPTIVE_CEFR_LEVELS)[number];

export type PlacementAdaptiveModality =
  (typeof PLACEMENT_ADAPTIVE_MODALITIES)[number];

export type PlacementAdaptiveQuestionType =
  | "open_response"
  | "short_answer"
  | "mcq"
  | "true_false";

export type PlacementAdaptiveRejectionCode =
  (typeof PLACEMENT_ADAPTIVE_REJECTION_CODES)[number];

export type PlacementAdaptiveAuditMetadata = {
  batchId: string;
  cycle: number;
  promptVersion: string;
  generatedAt: string;
  provider: "openai" | "gemini" | "none" | string;
  model: string;
  latencyMs: number;
  tokensInput: number;
  tokensOutput: number;
  estimatedCostUsd: number;
  rawRunPath?: string;
};

export type PlacementGeneratedItem = {
  id: string;
  modality: PlacementAdaptiveModality;
  targetCefr: PlacementAdaptiveCefrLevel;
  learnerL1: string;
  targetLanguage: string;
  skillFocus: string;
  difficultyConstraints: string[];
  title: string;
  promptText: string;
  passageText?: string;
  audioTranscript?: string;
  questionText?: string;
  questionType: PlacementAdaptiveQuestionType;
  options?: string[];
  expectedAnswer?: string;
  rubricDimensions: string[];
  vietnameseL1Targets: string[];
  ageBand: "13+" | "16+" | "adult";
  estimatedResponseSeconds: number;
  metadata: PlacementAdaptiveAuditMetadata;
};

export type PlacementItemValidationScore = {
  score: number;
  pass: boolean;
  notes: string;
};

export type PlacementItemValidationResult = {
  id: string;
  generatedItemId: string;
  validatedAt: string;
  finalDecision: "accepted" | "rejected";
  cefrFit: PlacementItemValidationScore & {
    predictedCefr?: PlacementAdaptiveCefrLevel;
  };
  safety: PlacementItemValidationScore;
  ageAppropriateness: PlacementItemValidationScore;
  culturalNeutrality: PlacementItemValidationScore;
  vietnameseL1Relevance: PlacementItemValidationScore & {
    matchedPatterns: string[];
  };
  duplicateRisk: PlacementItemValidationScore & {
    nearestItemIds: string[];
  };
  rubricCompatibility: PlacementItemValidationScore & {
    supportedDimensions: string[];
  };
  learnerUsability: PlacementItemValidationScore;
  rejectionReasons: PlacementItemRejectionReason[];
  metadata: PlacementAdaptiveAuditMetadata;
};

export type PlacementItemRejectionReason = {
  code: PlacementAdaptiveRejectionCode;
  severity: "low" | "medium" | "high";
  message: string;
  evidence?: string;
};

export type PlacementAdaptiveGauntletReport = {
  batchId: string;
  startedAt: string;
  completedAt: string;
  cyclesCompleted: number;
  generatedCount: number;
  validatedCount: number;
  acceptedCount: number;
  rejectedCount: number;
  acceptanceRate: number;
  estimatedCostUsd: number;
  costPerAcceptedItem: number | null;
  averageGenerationLatencyMs: number;
  rejectionCounts: Record<string, number>;
};

export function isPlacementAdaptiveCefrLevel(
  value: unknown,
): value is PlacementAdaptiveCefrLevel {
  return (
    typeof value === "string" &&
    (PLACEMENT_ADAPTIVE_CEFR_LEVELS as readonly string[]).includes(value)
  );
}

export function isPlacementAdaptiveModality(
  value: unknown,
): value is PlacementAdaptiveModality {
  return (
    typeof value === "string" &&
    (PLACEMENT_ADAPTIVE_MODALITIES as readonly string[]).includes(value)
  );
}

export function isPlacementAdaptiveRejectionCode(
  value: unknown,
): value is PlacementAdaptiveRejectionCode {
  return (
    typeof value === "string" &&
    (PLACEMENT_ADAPTIVE_REJECTION_CODES as readonly string[]).includes(value)
  );
}

export function cefrOrdinal(level: PlacementAdaptiveCefrLevel): number {
  return PLACEMENT_ADAPTIVE_CEFR_LEVELS.indexOf(level);
}

export function cefrDistance(
  a: PlacementAdaptiveCefrLevel,
  b: PlacementAdaptiveCefrLevel,
): number {
  return Math.abs(cefrOrdinal(a) - cefrOrdinal(b));
}

export function clampValidationScore(value: unknown): number {
  const numberValue =
    typeof value === "number" && Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.min(1, Number(numberValue.toFixed(3))));
}

export function estimatePlacementTokens(text: string): number {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return 0;
  return Math.max(1, Math.ceil(trimmed.length / 4));
}

export function calculatePlacementAcceptanceRate(
  accepted: number,
  validated: number,
): number {
  if (validated <= 0) return 0;
  return Number((accepted / validated).toFixed(4));
}

export function normalizeRejectionReason(
  reason: Partial<PlacementItemRejectionReason>,
): PlacementItemRejectionReason {
  return {
    code: isPlacementAdaptiveRejectionCode(reason.code)
      ? reason.code
      : "malformed",
    severity:
      reason.severity === "low" ||
      reason.severity === "medium" ||
      reason.severity === "high"
        ? reason.severity
        : "medium",
    message: String(reason.message ?? "Rejected by adaptive item validation.").slice(
      0,
      500,
    ),
    evidence: reason.evidence ? String(reason.evidence).slice(0, 500) : undefined,
  };
}

export function validateGeneratedItemShape(
  item: Partial<PlacementGeneratedItem>,
): string[] {
  const errors: string[] = [];
  if (!item.id) errors.push("id is required");
  if (!isPlacementAdaptiveModality(item.modality)) {
    errors.push("modality must be reading, writing, listening, or speaking");
  }
  if (!isPlacementAdaptiveCefrLevel(item.targetCefr)) {
    errors.push("targetCefr must be A1-C2");
  }
  if (!item.learnerL1) errors.push("learnerL1 is required");
  if (!item.targetLanguage) errors.push("targetLanguage is required");
  if (!item.skillFocus) errors.push("skillFocus is required");
  if (!item.promptText) errors.push("promptText is required");
  if (!item.title) errors.push("title is required");
  if (!item.questionType) errors.push("questionType is required");
  if (!Array.isArray(item.rubricDimensions) || item.rubricDimensions.length === 0) {
    errors.push("rubricDimensions must not be empty");
  }
  if (
    !Array.isArray(item.vietnameseL1Targets) ||
    item.vietnameseL1Targets.length === 0
  ) {
    errors.push("vietnameseL1Targets must not be empty");
  }
  if (
    item.modality === "reading" &&
    (!item.passageText || !item.questionText || !item.expectedAnswer)
  ) {
    errors.push("reading items require passageText, questionText, and expectedAnswer");
  }
  if (
    item.modality === "listening" &&
    (!item.audioTranscript || !item.questionText || !item.expectedAnswer)
  ) {
    errors.push(
      "listening items require audioTranscript, questionText, and expectedAnswer",
    );
  }
  if (item.modality === "speaking" && item.questionType !== "open_response") {
    errors.push("speaking items must use open_response");
  }
  if (item.modality === "writing" && item.questionType !== "open_response") {
    errors.push("writing items must use open_response");
  }
  return errors;
}
