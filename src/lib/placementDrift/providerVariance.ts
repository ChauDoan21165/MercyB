import { cefrDistance } from "./scoreDeltaAnalysis.js";
import type { DriftAlert, DriftProvider, ReplayScore } from "./types.js";

export interface ProviderVarianceRow {
  provider: DriftProvider;
  sampleCount: number;
  successRate: number;
  malformedRate: number;
  averageExpectedDelta: number;
  p95LatencyMs: number;
}

export function analyzeProviderVariance(scores: ReplayScore[]): ProviderVarianceRow[] {
  const providers = [...new Set(scores.map((score) => score.provider))];
  return providers.map((provider) => {
    const subset = scores.filter((score) => score.provider === provider);
    const deltas = subset
      .map((score) => cefrDistance(score.expectedCefr, score.parsedCefr))
      .filter((value): value is number => typeof value === "number");
    return {
      provider,
      sampleCount: subset.length,
      successRate: ratio(subset.filter((score) => score.status === "success").length, subset.length),
      malformedRate: ratio(subset.filter((score) => score.malformed).length, subset.length),
      averageExpectedDelta: average(deltas),
      p95LatencyMs: percentile(subset.map((score) => score.latencyMs), 0.95),
    };
  });
}

export function providerVarianceAlerts(rows: ProviderVarianceRow[], thresholdBands = 1): DriftAlert[] {
  if (rows.length < 2) return [];
  const max = Math.max(...rows.map((row) => row.averageExpectedDelta));
  const min = Math.min(...rows.map((row) => row.averageExpectedDelta));
  if (max - min < thresholdBands) return [];
  return [{
    scope: "provider",
    severity: "warning",
    metric: "provider_average_delta_spread",
    value: Number((max - min).toFixed(4)),
    threshold: thresholdBands,
    sampleIds: [],
    message: `Provider average CEFR error spread is ${(max - min).toFixed(2)} bands.`,
  }];
}

function average(values: number[]): number {
  return values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(4)) : 0;
}

function percentile(values: number[], p: number): number {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (sorted.length === 0) return 0;
  return Math.round(sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * p) - 1)]);
}

function ratio(count: number, total: number): number {
  return total ? Number((count / total).toFixed(4)) : 0;
}
