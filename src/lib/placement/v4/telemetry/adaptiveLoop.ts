// Placement v4 telemetry — adaptive loop orchestration contract.
//
// This is the single function upstream agents (A1 sequencer, A4 observability,
// A6 adaptive curriculum) call to get a deterministic adaptive read on a
// learner. It composes:
//
//   1. Risk signals (burnout, churn, stagnation, speaking, review, L1, clusters)
//   2. Intervention recommendations (bilingual, prioritized, replayable)
//   3. Optional forecast-vs-actual deviation report
//   4. Optional learner-visible diagnostics
//
// Upstream then decides whether/when to act on the recommendations. This
// module never mutates plans, never persists state, and never calls vendors.

import { analyzeForecastVsActual } from "./forecastAnalysis";
import { buildLearnerDiagnostics } from "./diagnostics";
import {
  computeAdaptiveSignals,
  composeInterventionPlan,
} from "./interventionEngine";
import type {
  AdaptiveSignalBundle,
  ForecastDeviationReport,
  ForecastLike,
  IneffectiveClusterFlag,
  InterventionPlan,
  LearnerDiagnostic,
  LearnerMemorySummaryLike,
  ProgressionSnapshotLike,
} from "./adaptiveTelemetryTypes";
import type { InterventionThresholds } from "./interventionEngine";
import type { AggregationSummary } from "./types";

export interface AdaptiveLoopInput {
  snapshot: ProgressionSnapshotLike;
  aggregation: AggregationSummary;
  memory?: LearnerMemorySummaryLike;
  forecast?: ForecastLike;
  ineffectiveClusters?: readonly IneffectiveClusterFlag[];
  thresholds?: InterventionThresholds;
}

export interface AdaptiveLoopResult {
  signals: AdaptiveSignalBundle;
  plan: InterventionPlan;
  forecastReport?: ForecastDeviationReport;
  diagnostics: readonly LearnerDiagnostic[];
}

/**
 * Evaluate the full adaptive read for a learner.
 *
 * Determinism:
 *   - signals depend only on the snapshot/aggregation/memory inputs.
 *   - the intervention plan id is derived from the inputs via a fingerprint
 *     (see interventionEngine.composeInterventionPlan).
 *   - diagnostics order is sorted by kind.
 *   - if a forecast is provided, the deviation report sorts deviations
 *     deterministically by skill.
 */
export function evaluateAdaptiveLoop(
  input: AdaptiveLoopInput,
): AdaptiveLoopResult {
  const signals = computeAdaptiveSignals({
    snapshot: input.snapshot,
    aggregation: input.aggregation,
    memory: input.memory,
    ineffectiveClusters: input.ineffectiveClusters,
    thresholds: input.thresholds,
  });
  const plan = composeInterventionPlan({
    signals,
    snapshot: input.snapshot,
  });
  const forecastReport = input.forecast
    ? analyzeForecastVsActual(input.forecast, input.snapshot)
    : undefined;
  const diagnostics = buildLearnerDiagnostics({
    snapshot: input.snapshot,
    signals,
    plan,
  });
  return { signals, plan, forecastReport, diagnostics };
}

// Re-exports for callers that want to declare their own InterventionThresholds.
export type { InterventionThresholds };
