import type {
  AggregatedBenchmarkMetrics,
  BenchmarkRunMetric,
  BenchmarkStepMetric,
} from "./types.js";

export function percentile(values: number[], p: number): number {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1);
  return Math.round(sorted[idx]);
}

export function aggregateBenchmarkRuns(
  runs: BenchmarkRunMetric[],
): AggregatedBenchmarkMetrics {
  const steps = runs.flatMap((run) => run.steps);
  const durations = steps.map((step) => step.durationMs);
  const byModality: AggregatedBenchmarkMetrics["byModality"] = {};

  for (const modality of new Set(steps.map((step) => step.modality))) {
    const subset = steps.filter((step) => step.modality === modality);
    byModality[modality] = summarizeSteps(subset);
  }

  return {
    runCount: runs.length,
    stepCount: steps.length,
    p50LatencyMs: percentile(durations, 0.5),
    p95LatencyMs: percentile(durations, 0.95),
    p99LatencyMs: percentile(durations, 0.99),
    averageCostUsd: average(runs.map((run) => run.estimatedCostUsd)),
    averageTokensInput: average(runs.map((run) => run.totalTokensInput)),
    averageTokensOutput: average(runs.map((run) => run.totalTokensOutput)),
    failoverRate: ratio(steps.filter((step) => step.failover).length, steps.length),
    errorRate: ratio(steps.filter((step) => step.status !== "success").length, steps.length),
    byModality,
  };
}

function summarizeSteps(steps: BenchmarkStepMetric[]) {
  return {
    count: steps.length,
    p50LatencyMs: percentile(steps.map((step) => step.durationMs), 0.5),
    p95LatencyMs: percentile(steps.map((step) => step.durationMs), 0.95),
    averageCostUsd: average(steps.map((step) => step.estimatedCostUsd)),
    errorRate: ratio(steps.filter((step) => step.status !== "success").length, steps.length),
  };
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(6));
}

function ratio(count: number, total: number): number {
  if (total === 0) return 0;
  return Number((count / total).toFixed(4));
}
