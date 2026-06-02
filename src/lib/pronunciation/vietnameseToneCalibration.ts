import {
  type ExtractedPitchContour,
  type VietnameseToneTarget,
  classifyVietnameseToneContour,
  scoreVietnameseToneAttempt,
} from "./vietnameseToneScorer";

export type VietnameseToneCalibrationReferenceKind = "clean_supported" | "ambiguous_or_low_quality" | "unsupported";
export type SupportedVietnameseToneCalibrationContour = "rising" | "falling" | "level";

export interface VietnameseToneCalibrationReference {
  id: string;
  kind: VietnameseToneCalibrationReferenceKind;
  target: VietnameseToneTarget;
  contour: ExtractedPitchContour;
  expectedContour?: SupportedVietnameseToneCalibrationContour;
}

export interface VietnameseToneCalibrationPolicy {
  minCleanSupportedAccuracy: number;
  requireAmbiguousAbstention: boolean;
  requireUnsupportedAbstention: boolean;
}

export interface VietnameseToneCalibrationCaseResult {
  id: string;
  kind: VietnameseToneCalibrationReferenceKind;
  passed: boolean;
  observedContour: ReturnType<typeof classifyVietnameseToneContour>;
  bucket: ReturnType<typeof scoreVietnameseToneAttempt>["bucket"];
  reason: ReturnType<typeof scoreVietnameseToneAttempt>["reason"];
}

export interface VietnameseToneCalibrationReport {
  passed: boolean;
  policy: VietnameseToneCalibrationPolicy;
  cleanSupportedAccuracy: number | null;
  cleanSupportedTotal: number;
  cleanSupportedCorrect: number;
  ambiguousTotal: number;
  ambiguousAbstained: number;
  unsupportedTotal: number;
  unsupportedAbstained: number;
  caseResults: VietnameseToneCalibrationCaseResult[];
}

export const DEFAULT_VIETNAMESE_TONE_CALIBRATION_POLICY: VietnameseToneCalibrationPolicy = {
  minCleanSupportedAccuracy: 0.9,
  requireAmbiguousAbstention: true,
  requireUnsupportedAbstention: true,
};

export function runVietnameseToneCalibration(
  references: VietnameseToneCalibrationReference[],
  policy = DEFAULT_VIETNAMESE_TONE_CALIBRATION_POLICY,
): VietnameseToneCalibrationReport {
  const caseResults = references.map((reference) => evaluateCalibrationReference(reference));
  const cleanSupported = caseResults.filter((result) => result.kind === "clean_supported");
  const ambiguous = caseResults.filter((result) => result.kind === "ambiguous_or_low_quality");
  const unsupported = caseResults.filter((result) => result.kind === "unsupported");
  const cleanSupportedCorrect = cleanSupported.filter((result) => result.passed).length;
  const ambiguousAbstained = ambiguous.filter((result) => result.passed).length;
  const unsupportedAbstained = unsupported.filter((result) => result.passed).length;
  const cleanSupportedAccuracy =
    cleanSupported.length === 0 ? null : roundToTwoDecimals(cleanSupportedCorrect / cleanSupported.length);

  const cleanPassed =
    cleanSupportedAccuracy !== null && cleanSupportedAccuracy >= policy.minCleanSupportedAccuracy;
  const ambiguousPassed =
    !policy.requireAmbiguousAbstention || ambiguousAbstained === ambiguous.length;
  const unsupportedPassed =
    !policy.requireUnsupportedAbstention || unsupportedAbstained === unsupported.length;

  return {
    passed: cleanPassed && ambiguousPassed && unsupportedPassed,
    policy,
    cleanSupportedAccuracy,
    cleanSupportedTotal: cleanSupported.length,
    cleanSupportedCorrect,
    ambiguousTotal: ambiguous.length,
    ambiguousAbstained,
    unsupportedTotal: unsupported.length,
    unsupportedAbstained,
    caseResults,
  };
}

function evaluateCalibrationReference(
  reference: VietnameseToneCalibrationReference,
): VietnameseToneCalibrationCaseResult {
  const observedContour = classifyVietnameseToneContour(reference.contour);
  const score = scoreVietnameseToneAttempt({
    contour: reference.contour,
    target: reference.target,
  });

  return {
    id: reference.id,
    kind: reference.kind,
    passed: isPassingCalibrationReference(reference, observedContour, score),
    observedContour,
    bucket: score.bucket,
    reason: score.reason,
  };
}

function isPassingCalibrationReference(
  reference: VietnameseToneCalibrationReference,
  observedContour: ReturnType<typeof classifyVietnameseToneContour>,
  score: ReturnType<typeof scoreVietnameseToneAttempt>,
): boolean {
  if (reference.kind === "clean_supported") {
    return (
      reference.expectedContour !== undefined &&
      observedContour === reference.expectedContour &&
      score.bucket === "close" &&
      score.reason === "contour-match"
    );
  }

  if (reference.kind === "unsupported") {
    return score.bucket === "unclear" && score.reason === "unsupported-tone-for-mvp";
  }

  return score.bucket === "unclear" && score.score === null;
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}
