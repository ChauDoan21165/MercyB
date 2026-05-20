import { CEFR_LEVELS, type CefrLevel, type DriftDelta, type ReplayScore } from "./types.js";

export function cefrIndex(level: CefrLevel | null): number | null {
  if (!level) return null;
  const index = CEFR_LEVELS.indexOf(level);
  return index >= 0 ? index : null;
}

export function cefrDistance(a: CefrLevel | null, b: CefrLevel | null): number | null {
  const ai = cefrIndex(a);
  const bi = cefrIndex(b);
  if (ai === null || bi === null) return null;
  return Math.abs(ai - bi);
}

export function analyzeScoreDeltas(args: {
  baseline: ReplayScore[];
  current: ReplayScore[];
}): DriftDelta[] {
  const baselineBySample = newestBySample(args.baseline);
  return args.current.map((score) => {
    const baseline = baselineBySample.get(score.sampleId);
    const deltaBands = baseline
      ? signedDistance(baseline.parsedCefr, score.parsedCefr)
      : null;
    return {
      sampleId: score.sampleId,
      modality: score.modality,
      expectedCefr: score.expectedCefr,
      baselineCefr: baseline?.parsedCefr ?? null,
      currentCefr: score.parsedCefr,
      deltaBands,
      provider: score.provider,
      taxonomyTags: score.taxonomyTags,
      status: score.status,
    };
  });
}

export function meanAbsoluteDelta(deltas: DriftDelta[]): number {
  const values = deltas
    .map((delta) => delta.deltaBands)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value))
    .map(Math.abs);
  if (values.length === 0) return 0;
  return round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function catastrophicDisagreements(deltas: DriftDelta[], thresholdBands = 2): DriftDelta[] {
  return deltas.filter((delta) => Math.abs(delta.deltaBands ?? 0) >= thresholdBands);
}

function signedDistance(a: CefrLevel | null, b: CefrLevel | null): number | null {
  const ai = cefrIndex(a);
  const bi = cefrIndex(b);
  if (ai === null || bi === null) return null;
  return bi - ai;
}

function newestBySample(scores: ReplayScore[]): Map<string, ReplayScore> {
  const out = new Map<string, ReplayScore>();
  for (const score of scores) {
    const existing = out.get(score.sampleId);
    if (!existing || existing.createdAt.localeCompare(score.createdAt) < 0) {
      out.set(score.sampleId, score);
    }
  }
  return out;
}

function round(value: number): number {
  return Number(value.toFixed(4));
}
