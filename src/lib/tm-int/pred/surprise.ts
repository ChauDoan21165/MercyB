// WP-001 — surprise metric.
//
// Surprise = distance between the predicted outcome and the actual outcome. We use the
// absolute error of the predicted resolution probability against the realised binary
// outcome (a Brier-style |p - y| in [0,1]). Larger = the predictor was more wrong.

import type { LearnerOutcome, PredictedOutcome } from "./types";

function round4(value: number): number {
  return Math.round(value * 10000) / 10000;
}

/** Distance between a predicted outcome and the actual learner outcome, in [0,1]. */
export function computeSurprise(predicted: PredictedOutcome, actual: LearnerOutcome): number {
  const y = actual.resolved ? 1 : 0;
  const p = Math.min(1, Math.max(0, predicted.pResolve));
  return round4(Math.abs(p - y));
}
