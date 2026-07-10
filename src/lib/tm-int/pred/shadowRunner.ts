// WP-001 — SHADOW MODE runner.
//
// The learner-facing decision is computed by the caller's own `decide()` and returned
// VERBATIM. Prediction capture is a strict read-only side-channel layered on top: it
// reads features off the decision, records a prediction, drains it, and emits an
// observation fact — but it never touches the returned decision. Therefore the
// learner-facing output is byte-identical whether capture is on or off. The keystone
// regression test (wp001FlagOffByteIdentical) proves exactly this.

import { observationEventBus } from "../obs/eventBus";
import { capturePrediction, resolveSurprise } from "./capture";
import { drainPrediction, drainSurprise, type EventRecorder } from "./sink";
import { isPredictionCaptureEnabled } from "./flag";
import { predictOutcome } from "./predictor";
import { predictionRecordedFact, surpriseResolvedFact } from "./observe";
import type {
  LearnerOutcome,
  PredictionRow,
  SurpriseResolution,
  TurnAddress,
  TurnFeatures,
} from "./types";

/** Pure read of a turn address + features from a learner-facing decision. */
export type FeatureExtractor<D> = (decision: D) => { turnAddress: TurnAddress; features: TurnFeatures } | null;

export type ShadowCaptureOptions = {
  /** Override the flag (used by the byte-identical keystone test). */
  enabled?: boolean;
  /** Decision-time stamp; defaults to Date.now() at the edge. */
  predictedAtMs?: number;
  /** Injected recorder for tests; defaults to the real learning-events sink. */
  recorder?: EventRecorder;
  /** Emit onto the shared observation bus (born observable). Default true. */
  emitObservation?: boolean;
};

export type ShadowTurnResult<D> = {
  /** The learner-facing decision — returned verbatim, byte-identical to `decide()`. */
  decision: D;
  /** The captured prediction, or null when capture is off / no features. Side-channel only. */
  prediction: PredictionRow | null;
};

/**
 * Run a live tutor turn with prediction capture in SHADOW MODE.
 *
 * `decide()` produces the learner-facing decision; its result is returned unchanged.
 * When capture is enabled we additionally record a prediction of the learner outcome
 * BEFORE that outcome exists. Nothing here can alter `decision`.
 */
export function runTurnWithPredictionCapture<D>(
  decide: () => D,
  extract: FeatureExtractor<D>,
  options: ShadowCaptureOptions = {},
): ShadowTurnResult<D> {
  const decision = decide(); // learner-facing output, computed by the unchanged path

  const enabled = options.enabled ?? isPredictionCaptureEnabled();
  if (!enabled) return { decision, prediction: null };

  const extracted = extract(decision);
  if (!extracted) return { decision, prediction: null };

  const predictedAtMs = options.predictedAtMs ?? Date.now();
  const prediction = capturePrediction(
    extracted.turnAddress,
    extracted.features,
    predictOutcome(extracted.features),
    predictedAtMs,
  );

  drainPrediction(prediction, options.recorder);
  if (options.emitObservation ?? true) {
    observationEventBus.publish(predictionRecordedFact(prediction));
  }

  return { decision, prediction };
}

export type ResolveTurnOptions = {
  enabled?: boolean;
  recorder?: EventRecorder;
  emitObservation?: boolean;
};

/**
 * Resolve a captured prediction against the learner outcome once it arrives. Enforces the
 * no-hindsight invariant via resolveSurprise. Pure side-channel — no learner-facing value.
 */
export function resolveTurnPrediction(
  row: PredictionRow,
  outcome: LearnerOutcome,
  options: ResolveTurnOptions = {},
): SurpriseResolution | null {
  const enabled = options.enabled ?? isPredictionCaptureEnabled();
  if (!enabled) return null;

  const resolution = resolveSurprise(row, outcome);
  drainSurprise(resolution, options.recorder); // no-op for hindsight-rejected pairs
  if (options.emitObservation ?? true) {
    observationEventBus.publish(surpriseResolvedFact(resolution));
  }
  return resolution;
}
