// WP-001 — consumer: top-surprises report artifact.
//
// Descending surprise list for Chau review. Hindsight-rejected pairs are excluded by
// construction (they carry no surprise). Deterministic ordering: surprise desc, then a
// stable tiebreak on the turn anchor, so the artifact bytes are reproducible.

import { turnAnchor } from "./observe";
import {
  isAcceptedPair,
  type SurprisePair,
  type SurpriseResolution,
} from "./types";

export type TopSurpriseEntry = {
  rank: number;
  turnAnchor: string;
  surprise: number;
  predictedLabel: SurprisePair["predicted"]["label"];
  pResolve: number;
  resolved: boolean;
  predictedAtMs: number;
  outcomeAtMs: number;
};

export type TopSurprisesReport = {
  schemaVersion: "tm-int-pred-report-v1";
  predictorVersion: string;
  generatedAt: string;
  counts: {
    resolutionsSeen: number;
    accepted: number;
    hindsightRejected: number;
    reported: number;
  };
  meanSurprise: number;
  entries: TopSurpriseEntry[];
};

function round4(value: number): number {
  return Math.round(value * 10000) / 10000;
}

/** Build the descending-surprise report from a batch of resolutions. */
export function buildTopSurprisesReport(
  resolutions: SurpriseResolution[],
  options: { limit?: number; generatedAt?: string; predictorVersion?: string } = {},
): TopSurprisesReport {
  const limit = options.limit ?? 10;
  const accepted = resolutions.filter(isAcceptedPair);
  const hindsightRejected = resolutions.length - accepted.length;

  const ranked = [...accepted].sort((a, b) => {
    if (b.surprise !== a.surprise) return b.surprise - a.surprise;
    return turnAnchor(a.turnAddress).localeCompare(turnAnchor(b.turnAddress));
  });

  const entries: TopSurpriseEntry[] = ranked.slice(0, limit).map((pair, index) => ({
    rank: index + 1,
    turnAnchor: turnAnchor(pair.turnAddress),
    surprise: pair.surprise,
    predictedLabel: pair.predicted.label,
    pResolve: pair.predicted.pResolve,
    resolved: pair.actual.resolved,
    predictedAtMs: pair.predictedAtMs,
    outcomeAtMs: pair.outcomeAtMs,
  }));

  const meanSurprise = accepted.length
    ? round4(accepted.reduce((sum, pair) => sum + pair.surprise, 0) / accepted.length)
    : 0;

  return {
    schemaVersion: "tm-int-pred-report-v1",
    predictorVersion: options.predictorVersion ?? accepted[0]?.predictorVersion ?? "pred-lut-v1",
    generatedAt: options.generatedAt ?? "1970-01-01T00:00:00.000Z",
    counts: {
      resolutionsSeen: resolutions.length,
      accepted: accepted.length,
      hindsightRejected,
      reported: entries.length,
    },
    meanSurprise,
    entries,
  };
}

/** Human-readable Markdown rendering of the report for Chau review. */
export function renderTopSurprisesMarkdown(report: TopSurprisesReport): string {
  const lines: string[] = [];
  lines.push(`# WP-001 Top Surprises — ${report.predictorVersion}`);
  lines.push("");
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push(
    `Resolutions: ${report.counts.resolutionsSeen} · accepted: ${report.counts.accepted} · ` +
      `hindsight-rejected (excluded): ${report.counts.hindsightRejected} · mean surprise: ${report.meanSurprise}`,
  );
  lines.push("");
  lines.push("| # | surprise | predicted | p(resolve) | actual resolved | turn anchor |");
  lines.push("|--:|---------:|:----------|-----------:|:----------------|:------------|");
  for (const entry of report.entries) {
    lines.push(
      `| ${entry.rank} | ${entry.surprise} | ${entry.predictedLabel} | ${entry.pResolve} | ` +
        `${entry.resolved} | \`${entry.turnAnchor}\` |`,
    );
  }
  lines.push("");
  return lines.join("\n");
}
