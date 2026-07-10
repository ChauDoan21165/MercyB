// WP-001 — prediction axes registry (report only).
//
// "Born observable" requires the feature to register its observation axes. These are a
// declarative report of what WP-001 can observe and which obs capability backs each
// axis. Registration is inert: it describes capabilities, it does not wire any runtime.

import type { ObservationCapabilityId } from "../obs/types";
import { PREDICTOR_VERSION } from "./types";

export type PredictionAxis = {
  axisId: "PRED-AXIS-000001" | "PRED-AXIS-000002" | "PRED-AXIS-000003";
  semanticKey: string;
  backingCapability: ObservationCapabilityId;
  predictorVersion: typeof PREDICTOR_VERSION;
  unit: "label+probability" | "distance" | "boolean";
  description: string;
};

export const PREDICTION_AXES = [
  {
    axisId: "PRED-AXIS-000001",
    semanticKey: "pred.axis.predicted_outcome",
    backingCapability: "OBS-PRED-000001",
    predictorVersion: PREDICTOR_VERSION,
    unit: "label+probability",
    description: "Predicted next-turn outcome (resolve/repeat) and resolution probability, captured pre-outcome.",
  },
  {
    axisId: "PRED-AXIS-000002",
    semanticKey: "pred.axis.surprise",
    backingCapability: "OBS-PRED-000002",
    predictorVersion: PREDICTOR_VERSION,
    unit: "distance",
    description: "Surprise: distance between predicted and actual outcome for accepted pairs.",
  },
  {
    axisId: "PRED-AXIS-000003",
    semanticKey: "pred.axis.hindsight_rejected",
    backingCapability: "OBS-PRED-000003",
    predictorVersion: PREDICTOR_VERSION,
    unit: "boolean",
    description: "Whether a pair was excluded for violating the no-hindsight invariant.",
  },
] as const satisfies readonly PredictionAxis[];

export function predictionAxisById(axisId: string): PredictionAxis | null {
  return PREDICTION_AXES.find((axis) => axis.axisId === axisId) ?? null;
}
