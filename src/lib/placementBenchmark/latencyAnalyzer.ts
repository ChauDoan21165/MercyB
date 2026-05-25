import { percentile } from "./aggregateMetrics.js";
import type { BenchmarkStepMetric } from "./types.js";

export interface LatencyBottleneck {
  stepId: string;
  scenarioId: string;
  modality: string;
  provider: string;
  durationMs: number;
  status: string;
}

export function findWorstLatencySteps(
  steps: BenchmarkStepMetric[],
  limit = 10,
): LatencyBottleneck[] {
  return [...steps]
    .sort((a, b) => b.durationMs - a.durationMs)
    .slice(0, limit)
    .map((step) => ({
      stepId: step.stepId,
      scenarioId: step.scenarioId,
      modality: step.modality,
      provider: step.provider,
      durationMs: step.durationMs,
      status: step.status,
    }));
}

export function latencyByModality(steps: BenchmarkStepMetric[]) {
  const out: Record<string, { p50: number; p95: number; max: number; count: number }> = {};
  for (const modality of new Set(steps.map((step) => step.modality))) {
    const durations = steps
      .filter((step) => step.modality === modality)
      .map((step) => step.durationMs);
    out[modality] = {
      p50: percentile(durations, 0.5),
      p95: percentile(durations, 0.95),
      max: Math.max(0, ...durations),
      count: durations.length,
    };
  }
  return out;
}
