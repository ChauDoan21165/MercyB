// WP-001 — capture + NO-HINDSIGHT resolution.
//
// capturePrediction() runs at decision time and produces a PredictionRow BEFORE any
// outcome exists. resolveSurprise() runs after the learner outcome arrives and pairs
// the two — but ONLY if the prediction strictly precedes the outcome in time.
//
// NO-HINDSIGHT INVARIANT (hard): a prediction that is not strictly earlier than its
// outcome cannot have been a real forecast — it is leakage. Such pairs are rejected
// and excluded from every consumer. resolveSurprise is the single chokepoint that
// enforces this; there is no other way to build a SurprisePair.

import { predictionRowId } from "./predictor";
import { computeSurprise } from "./surprise";
import {
  PRED_ROW_SCHEMA,
  PRED_SURPRISE_SCHEMA,
  type LearnerOutcome,
  type Prediction,
  type PredictionRow,
  type SurpriseResolution,
  type TurnAddress,
  type TurnFeatures,
} from "./types";

/**
 * Capture a prediction at decision time. The caller must invoke this BEFORE the
 * learner's outcome exists; `predictedAtMs` is stamped by the caller (or the sink edge)
 * so the pure core stays deterministic.
 */
export function capturePrediction(
  turnAddress: TurnAddress,
  features: TurnFeatures,
  prediction: Prediction,
  predictedAtMs: number,
): PredictionRow {
  return {
    schemaVersion: PRED_ROW_SCHEMA,
    rowId: predictionRowId(turnAddress, prediction.predictorVersion),
    turnAddress,
    features,
    prediction,
    predictedAtMs,
  };
}

/**
 * Pair a captured prediction with the learner outcome and measure surprise.
 *
 * Enforces the NO-HINDSIGHT INVARIANT: requires `row.predictedAtMs < outcome.outcomeAtMs`
 * STRICTLY. Equal timestamps are rejected too — simultaneity cannot prove foresight.
 */
export function resolveSurprise(row: PredictionRow, outcome: LearnerOutcome): SurpriseResolution {
  if (!(row.predictedAtMs < outcome.outcomeAtMs)) {
    return {
      schemaVersion: PRED_SURPRISE_SCHEMA,
      turnAddress: row.turnAddress,
      predictedAtMs: row.predictedAtMs,
      outcomeAtMs: outcome.outcomeAtMs,
      hindsightRejected: true,
      reason: "prediction_not_strictly_before_outcome",
    };
  }

  return {
    schemaVersion: PRED_SURPRISE_SCHEMA,
    turnAddress: row.turnAddress,
    predictorVersion: row.prediction.predictorVersion,
    predicted: row.prediction.outcome,
    actual: outcome,
    surprise: computeSurprise(row.prediction.outcome, outcome),
    predictedAtMs: row.predictedAtMs,
    outcomeAtMs: outcome.outcomeAtMs,
    hindsightRejected: false,
  };
}
