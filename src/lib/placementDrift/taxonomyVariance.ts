import { cefrDistance } from "./scoreDeltaAnalysis.js";
import type { DriftAlert, ReplayScore } from "./types.js";

export interface TaxonomyVarianceRow {
  taxonomyTag: string;
  sampleCount: number;
  malformedRate: number;
  averageExpectedDelta: number;
  unstableSampleIds: string[];
}

export function analyzeTaxonomyVariance(scores: ReplayScore[]): TaxonomyVarianceRow[] {
  const tags = [...new Set(scores.flatMap((score) => score.taxonomyTags))].sort();
  return tags.map((taxonomyTag) => {
    const subset = scores.filter((score) => score.taxonomyTags.includes(taxonomyTag));
    const deltas = subset
      .map((score) => cefrDistance(score.expectedCefr, score.parsedCefr))
      .filter((value): value is number => typeof value === "number");
    return {
      taxonomyTag,
      sampleCount: subset.length,
      malformedRate: ratio(subset.filter((score) => score.malformed).length, subset.length),
      averageExpectedDelta: average(deltas),
      unstableSampleIds: subset
        .filter((score) => (cefrDistance(score.expectedCefr, score.parsedCefr) ?? 0) >= 2)
        .map((score) => score.sampleId),
    };
  });
}

export function taxonomyVarianceAlerts(rows: TaxonomyVarianceRow[], thresholdBands = 1.25): DriftAlert[] {
  return rows
    .filter((row) => row.sampleCount >= 2 && row.averageExpectedDelta >= thresholdBands)
    .map((row) => ({
      scope: `taxonomy:${row.taxonomyTag}`,
      severity: row.averageExpectedDelta >= 2 ? "critical" : "warning",
      metric: "taxonomy_average_expected_delta",
      value: row.averageExpectedDelta,
      threshold: thresholdBands,
      sampleIds: row.unstableSampleIds,
      message: `${row.taxonomyTag} samples average ${row.averageExpectedDelta} CEFR bands from expected.`,
    }));
}

function average(values: number[]): number {
  return values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(4)) : 0;
}

function ratio(count: number, total: number): number {
  return total ? Number((count / total).toFixed(4)) : 0;
}
