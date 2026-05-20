import { detectOutliers } from "./detectOutliers.js";
import { analyzeProviderVariance, providerVarianceAlerts } from "./providerVariance.js";
import { analyzeScoreDeltas, catastrophicDisagreements, meanAbsoluteDelta } from "./scoreDeltaAnalysis.js";
import { analyzeTaxonomyVariance, taxonomyVarianceAlerts } from "./taxonomyVariance.js";
import type { DriftAlert, ReplayScore } from "./types.js";

export function buildStabilityReport(args: {
  baseline: ReplayScore[];
  current: ReplayScore[];
}) {
  const deltas = analyzeScoreDeltas(args);
  const providerVariance = analyzeProviderVariance(args.current);
  const taxonomyVariance = analyzeTaxonomyVariance(args.current);
  const alerts: DriftAlert[] = [
    ...detectOutliers({ deltas, scores: args.current }),
    ...providerVarianceAlerts(providerVariance),
    ...taxonomyVarianceAlerts(taxonomyVariance),
  ];
  const catastrophic = catastrophicDisagreements(deltas);

  return {
    generatedAt: new Date().toISOString(),
    replay: {
      baselineScores: args.baseline.length,
      currentScores: args.current.length,
      successRate: ratio(args.current.filter((score) => score.status === "success").length, args.current.length),
      malformedRate: ratio(args.current.filter((score) => score.malformed).length, args.current.length),
      p95LatencyMs: percentile(args.current.map((score) => score.latencyMs), 0.95),
    },
    scoreDelta: {
      meanAbsoluteDelta: meanAbsoluteDelta(deltas),
      catastrophicCount: catastrophic.length,
      topUnstableSamples: [...deltas]
        .sort((a, b) => Math.abs(b.deltaBands ?? 0) - Math.abs(a.deltaBands ?? 0))
        .slice(0, 10),
    },
    providerVariance,
    taxonomyVariance,
    alerts,
  };
}

function percentile(values: number[], p: number): number {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (sorted.length === 0) return 0;
  return Math.round(sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * p) - 1)]);
}

function ratio(count: number, total: number): number {
  return total ? Number((count / total).toFixed(4)) : 0;
}
