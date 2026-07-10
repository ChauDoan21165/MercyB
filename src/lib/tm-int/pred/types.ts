// WP-001 — prediction-error capture (SHADOW MODE).
//
// The intelligence "north star" goes LIVE: on every live tutor turn the decision
// pipeline records what it PREDICTS the learner will do next, BEFORE the learner's
// outcome exists. After the learner responds we measure surprise = distance between
// predicted and actual, and keep the pair with provenance to the turn address.
//
// Everything in this module is capture-only. It is a strict side-channel: it never
// changes the learner-facing decision (SHADOW MODE — see shadowRunner.ts) and it is
// gated behind FEATURE_FLAGS.TUTOR_PREDICTION_CAPTURE_ENABLED (default OFF).

export const PRED_ROW_SCHEMA = "tm-int-pred-row-v1" as const;
export const PRED_SURPRISE_SCHEMA = "tm-int-pred-surprise-v1" as const;

// Lookup-table predictor version. Bump when the table or feature encoding changes so
// old and new predictions never get compared as if they came from the same predictor.
export const PREDICTOR_VERSION = "pred-lut-v1" as const;

/** Stable, PII-free provenance to a single tutor turn. */
export type TurnAddress = {
  /** Session identifier (already a synthetic local id, no PII). */
  sessionId: string;
  /** 0-based position of the turn within the session. */
  turnIndex: number;
  /** Stable per-turn message id. */
  msgId: string;
};

export type CorrectionStatus = "corrected" | "unchanged" | "needs_ai" | "abstained";
export type CefrBucket = "A" | "B" | "C" | "unknown";

/**
 * Features available at decision time — strictly BEFORE the learner's next outcome.
 * No learner text, only categorical/scalar signals the decision pipeline already has.
 */
export type TurnFeatures = {
  correctionStatus: CorrectionStatus;
  /** Count of detected issues on this turn (>= 0). */
  issueCount: number;
  /** Primary rule/detector id that fired, or null. */
  ruleId: string | null;
  cefrBucket: CefrBucket;
  isCurrentLessonTarget: boolean;
};

export type PredictedLabel = "resolve" | "repeat";

export type PredictedOutcome = {
  /** Discrete predicted next-turn behaviour. */
  label: PredictedLabel;
  /** Predicted probability [0,1] the learner resolves the flagged issue next turn. */
  pResolve: number;
};

export type Prediction = {
  predictorVersion: typeof PREDICTOR_VERSION;
  outcome: PredictedOutcome;
  /** Predictor's confidence in this prediction, [0,1]. */
  confidence: number;
};

/** A prediction captured BEFORE the outcome exists. Written at decision time. */
export type PredictionRow = {
  schemaVersion: typeof PRED_ROW_SCHEMA;
  /** Deterministic id derived from the turn address + predictor version. */
  rowId: string;
  turnAddress: TurnAddress;
  features: TurnFeatures;
  prediction: Prediction;
  /** Epoch ms at which the prediction was captured (decision time). */
  predictedAtMs: number;
};

/** The learner outcome, which only becomes known AFTER the prediction. */
export type LearnerOutcome = {
  /** Did the learner resolve the flagged issue on the next attempt? */
  resolved: boolean;
  /** Epoch ms at which the outcome became known. */
  outcomeAtMs: number;
};

/** An accepted (prediction, outcome) pair with its measured surprise. */
export type SurprisePair = {
  schemaVersion: typeof PRED_SURPRISE_SCHEMA;
  turnAddress: TurnAddress;
  predictorVersion: typeof PREDICTOR_VERSION;
  predicted: PredictedOutcome;
  actual: LearnerOutcome;
  /** Distance between predicted and actual outcome, [0,1]. */
  surprise: number;
  predictedAtMs: number;
  outcomeAtMs: number;
  hindsightRejected: false;
};

/**
 * NO-HINDSIGHT INVARIANT (hard): any pair whose prediction timestamp is not strictly
 * before its outcome timestamp is rejected and excluded from every surprise consumer.
 */
export type HindsightRejection = {
  schemaVersion: typeof PRED_SURPRISE_SCHEMA;
  turnAddress: TurnAddress;
  predictedAtMs: number;
  outcomeAtMs: number;
  hindsightRejected: true;
  reason: "prediction_not_strictly_before_outcome";
};

export type SurpriseResolution = SurprisePair | HindsightRejection;

export function isAcceptedPair(resolution: SurpriseResolution): resolution is SurprisePair {
  return resolution.hindsightRejected === false;
}

export function isHindsightRejected(resolution: SurpriseResolution): resolution is HindsightRejection {
  return resolution.hindsightRejected === true;
}
