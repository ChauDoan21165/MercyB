import { type DriftAlert, type DriftDelta, type ReplayScore } from "./types.js";

export function detectOutliers(args: {
  deltas: DriftDelta[];
  scores: ReplayScore[];
  catastrophicBandThreshold?: number;
  malformedThreshold?: number;
  latencyP95ThresholdMs?: number;
}): DriftAlert[] {
  const catastrophicThreshold = args.catastrophicBandThreshold ?? 2;
  const malformedThreshold = args.malformedThreshold ?? 0.03;
  const latencyThreshold = args.latencyP95ThresholdMs ?? 30_000;
  const alerts: DriftAlert[] = [];

  const catastrophic = args.deltas.filter(
    (delta) => Math.abs(delta.deltaBands ?? 0) >= catastrophicThreshold,
  );
  if (catastrophic.length > 0) {
    alerts.push({
      scope: "score_delta",
      severity: "critical",
      metric: "catastrophic_cefr_delta_count",
      value: catastrophic.length,
      threshold: 0,
      sampleIds: catastrophic.map((delta) => delta.sampleId),
      message: `${catastrophic.length} replay samples moved by ${catastrophicThreshold}+ CEFR bands.`,
    });
  }

  const malformedRate = ratio(args.scores.filter((score) => score.malformed).length, args.scores.length);
  if (malformedRate > malformedThreshold) {
    alerts.push({
      scope: "parser",
      severity: malformedRate > malformedThreshold * 2 ? "critical" : "warning",
      metric: "malformed_rate",
      value: malformedRate,
      threshold: malformedThreshold,
      sampleIds: args.scores.filter((score) => score.malformed).map((score) => score.sampleId),
      message: `Malformed grader output rate ${(malformedRate * 100).toFixed(1)}% exceeds threshold.`,
    });
  }

  const p95Latency = percentile(args.scores.map((score) => score.latencyMs), 0.95);
  if (p95Latency > latencyThreshold) {
    alerts.push({
      scope: "latency",
      severity: "warning",
      metric: "p95_latency_ms",
      value: p95Latency,
      threshold: latencyThreshold,
      sampleIds: slowest(args.scores, 5).map((score) => score.sampleId),
      message: `P95 grading latency ${p95Latency}ms exceeds ${latencyThreshold}ms.`,
    });
  }

  return alerts;
}

export function percentile(values: number[], p: number): number {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (sorted.length === 0) return 0;
  return Math.round(sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * p) - 1)]);
}

function slowest(scores: ReplayScore[], limit: number): ReplayScore[] {
  return [...scores].sort((a, b) => b.latencyMs - a.latencyMs).slice(0, limit);
}

function ratio(count: number, total: number): number {
  return total ? Number((count / total).toFixed(4)) : 0;
}
