import { aggregateBenchmarkRuns } from "./aggregateMetrics.js";
import type { BenchmarkRunMetric } from "./types.js";

export interface RegressionWarning {
  metric: string;
  baseline: number;
  current: number;
  deltaPercent: number;
  severity: "warning" | "critical";
}

export function detectBenchmarkRegressions(args: {
  baseline: BenchmarkRunMetric[];
  current: BenchmarkRunMetric[];
  latencyThresholdPercent?: number;
  costThresholdPercent?: number;
}): RegressionWarning[] {
  const latencyThreshold = args.latencyThresholdPercent ?? 15;
  const costThreshold = args.costThresholdPercent ?? 10;
  const baseline = aggregateBenchmarkRuns(args.baseline);
  const current = aggregateBenchmarkRuns(args.current);
  const warnings: RegressionWarning[] = [];

  pushIfRegressed(warnings, "p95LatencyMs", baseline.p95LatencyMs, current.p95LatencyMs, latencyThreshold);
  pushIfRegressed(warnings, "averageCostUsd", baseline.averageCostUsd, current.averageCostUsd, costThreshold);
  pushIfRegressed(warnings, "errorRate", baseline.errorRate, current.errorRate, 0.01, true);
  pushIfRegressed(warnings, "failoverRate", baseline.failoverRate, current.failoverRate, 0.05, true);

  return warnings;
}

function pushIfRegressed(
  warnings: RegressionWarning[],
  metric: string,
  baseline: number,
  current: number,
  threshold: number,
  absolute = false,
) {
  const deltaPercent = baseline === 0
    ? current > 0 ? 100 : 0
    : ((current - baseline) / baseline) * 100;
  const failed = absolute ? current - baseline > threshold : deltaPercent > threshold;
  if (!failed) return;
  warnings.push({
    metric,
    baseline,
    current,
    deltaPercent: Number(deltaPercent.toFixed(2)),
    severity: deltaPercent > threshold * 2 ? "critical" : "warning",
  });
}
