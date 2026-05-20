import { detectOutliers, percentile } from "./detectOutliers.js";
import { analyzeProviderVariance, providerVarianceAlerts } from "./providerVariance.js";
import { analyzeScoreDeltas, catastrophicDisagreements, meanAbsoluteDelta } from "./scoreDeltaAnalysis.js";
import { analyzeTaxonomyVariance, taxonomyVarianceAlerts } from "./taxonomyVariance.js";
import type { DriftSummary, ReplayScore } from "./types.js";

export function calculateDrift(args: {
  baseline: ReplayScore[];
  current: ReplayScore[];
}): DriftSummary {
  const deltas = analyzeScoreDeltas(args);
  const scores = args.current;
  const alerts = [
    ...detectOutliers({ deltas, scores }),
    ...providerVarianceAlerts(analyzeProviderVariance(scores)),
    ...taxonomyVarianceAlerts(analyzeTaxonomyVariance(scores)),
  ];

  return {
    runCount: new Set(scores.map((score) => score.runId)).size,
    scoreCount: scores.length,
    successRate: ratio(scores.filter((score) => score.status === "success").length, scores.length),
    malformedRate: ratio(scores.filter((score) => score.malformed).length, scores.length),
    p95LatencyMs: percentile(scores.map((score) => score.latencyMs), 0.95),
    meanAbsoluteDelta: meanAbsoluteDelta(deltas),
    catastrophicDisagreements: catastrophicDisagreements(deltas).length,
    alerts,
  };
}

function ratio(count: number, total: number): number {
  return total ? Number((count / total).toFixed(4)) : 0;
}
