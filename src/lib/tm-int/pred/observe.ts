// WP-001 — born observable.
//
// Predictions and their resolved surprise are emitted as STANDARD observation facts on
// the shared observationEventBus, and can be folded into the standard evidence packet
// digest (createObservationPacket) — no bespoke observation channel. The facts carry no
// learner text: only enum labels, scaled scalars, and a PII-free turn-address anchor.

import { createObservationPacket } from "../obs/evidencePacket";
import type { ObservationFact, ObservationPacket } from "../obs/types";
import {
  isAcceptedPair,
  type PredictionRow,
  type SurpriseResolution,
  type TurnAddress,
} from "./types";

/** PII-free, stable anchor string for a turn address, used as ObservationContext.taskId. */
export function turnAnchor(address: TurnAddress): string {
  return `pred::${address.sessionId}::${address.turnIndex}::${address.msgId}`;
}

function scaled(value: number): number {
  // Facts store integer metrics; keep 3 decimal places of a [0,1] scalar.
  return Math.round(value * 1000);
}

/** Observation fact for a prediction captured before the outcome exists. */
export function predictionRecordedFact(row: PredictionRow, observedAt?: string): ObservationFact {
  return {
    capabilityId: "OBS-PRED-000001",
    factType: "PredictionRecorded",
    severity: "info",
    observedAt: observedAt ?? new Date(row.predictedAtMs).toISOString(),
    context: { taskId: turnAnchor(row.turnAddress) },
    metrics: {
      pResolveMilli: scaled(row.prediction.outcome.pResolve),
      confidenceMilli: scaled(row.prediction.confidence),
      issueCount: row.features.issueCount,
      predictedAtMs: row.predictedAtMs,
    },
    message: `Predicted ${row.prediction.outcome.label} (p=${row.prediction.outcome.pResolve}) before outcome.`,
  };
}

/** Observation fact for a resolved (prediction, outcome) pair — accepted or rejected. */
export function surpriseResolvedFact(resolution: SurpriseResolution, observedAt?: string): ObservationFact {
  if (!isAcceptedPair(resolution)) {
    return {
      capabilityId: "OBS-PRED-000003",
      factType: "HindsightRejected",
      severity: "warning",
      observedAt: observedAt ?? new Date(resolution.outcomeAtMs).toISOString(),
      context: { taskId: turnAnchor(resolution.turnAddress) },
      metrics: { predictedAtMs: resolution.predictedAtMs, outcomeAtMs: resolution.outcomeAtMs },
      message: `Hindsight rejected: ${resolution.reason}. Excluded from surprise.`,
    };
  }

  return {
    capabilityId: "OBS-PRED-000002",
    factType: "SurpriseResolved",
    severity: "info",
    observedAt: observedAt ?? new Date(resolution.outcomeAtMs).toISOString(),
    context: { taskId: turnAnchor(resolution.turnAddress) },
    metrics: {
      surpriseMilli: scaled(resolution.surprise),
      resolved: resolution.actual.resolved ? 1 : 0,
      predictedAtMs: resolution.predictedAtMs,
      outcomeAtMs: resolution.outcomeAtMs,
    },
    message: `Surprise ${resolution.surprise} (predicted ${resolution.predicted.label}, resolved=${resolution.actual.resolved}).`,
  };
}

/**
 * Fold a batch of resolutions into the standard evidence-packet digest. Deterministic:
 * the same resolutions in the same order always yield the same packetId — this is the
 * "digest stable fixtures" surface reused verbatim from obs.
 */
export function predictionObservationPacket(
  rows: PredictionRow[],
  resolutions: SurpriseResolution[],
  observedAt = "2026-07-03T00:00:00.000Z",
): ObservationPacket {
  const facts: ObservationFact[] = [
    ...rows.map((row) => predictionRecordedFact(row, observedAt)),
    ...resolutions.map((resolution) => surpriseResolvedFact(resolution, observedAt)),
  ];
  return createObservationPacket(facts, observedAt);
}
