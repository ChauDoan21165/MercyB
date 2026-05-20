import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { calculateDrift } from "../../../src/lib/placementDrift/calculateDrift";
import { detectOutliers } from "../../../src/lib/placementDrift/detectOutliers";
import { analyzeProviderVariance } from "../../../src/lib/placementDrift/providerVariance";
import { analyzeScoreDeltas, cefrDistance, meanAbsoluteDelta } from "../../../src/lib/placementDrift/scoreDeltaAnalysis";
import { buildStabilityReport } from "../../../src/lib/placementDrift/stabilityReport";
import { analyzeTaxonomyVariance } from "../../../src/lib/placementDrift/taxonomyVariance";
import type { ReplayScore } from "../../../src/lib/placementDrift/types";

const baseline: ReplayScore[] = [
  score("s1", "baseline", "reading", "B1", "B1", "openai", ["missing-articles"]),
  score("s2", "baseline", "speaking", "A2", "A2", "openai", ["past-tense-unmarked"]),
  score("s3", "baseline", "listening", "C1", "C1", "openai", ["inference"]),
  score("s4", "baseline", "reading", "B2", "B2", "openai", ["hedging"]),
];

const current: ReplayScore[] = [
  score("s1", "current", "reading", "B1", "B2", "openai", ["missing-articles"]),
  score("s2", "current", "speaking", "A2", "B2", "gemini", ["past-tense-unmarked"], { retryPath: ["openai", "gemini"] }),
  score("s3", "current", "listening", "C1", null, "openai", ["inference"], { malformed: true, status: "malformed" }),
  score("s4", "current", "reading", "B2", "B2", "openai", ["hedging"], { latencyMs: 35_000 }),
];

describe("Placement V3 drift detection integration", () => {
  it("1 computes CEFR band distance", () => {
    expect(cefrDistance("A1", "B1")).toBe(2);
  });

  it("2 calculates signed score deltas against baseline samples", () => {
    const deltas = analyzeScoreDeltas({ baseline, current });
    expect(deltas.find((delta) => delta.sampleId === "s2")?.deltaBands).toBe(2);
  });

  it("3 computes mean absolute delta without malformed rows", () => {
    const deltas = analyzeScoreDeltas({ baseline, current });
    expect(meanAbsoluteDelta(deltas)).toBe(1);
  });

  it("4 raises catastrophic CEFR movement alerts", () => {
    const deltas = analyzeScoreDeltas({ baseline, current });
    const alerts = detectOutliers({ deltas, scores: current });
    expect(alerts.some((alert) => alert.metric === "catastrophic_cefr_delta_count")).toBe(true);
  });

  it("5 raises malformed-output alerts", () => {
    const alerts = detectOutliers({
      deltas: analyzeScoreDeltas({ baseline, current }),
      scores: current,
      malformedThreshold: 0.01,
    });
    expect(alerts.some((alert) => alert.metric === "malformed_rate")).toBe(true);
  });

  it("6 raises p95 latency alerts", () => {
    const alerts = detectOutliers({
      deltas: analyzeScoreDeltas({ baseline, current }),
      scores: current,
      latencyP95ThresholdMs: 10_000,
    });
    expect(alerts.some((alert) => alert.metric === "p95_latency_ms")).toBe(true);
  });

  it("7 aggregates provider variance", () => {
    const rows = analyzeProviderVariance(current);
    expect(rows.find((row) => row.provider === "gemini")?.sampleCount).toBe(1);
  });

  it("8 aggregates taxonomy variance", () => {
    const rows = analyzeTaxonomyVariance(current);
    expect(rows.find((row) => row.taxonomyTag === "past-tense-unmarked")?.averageExpectedDelta).toBe(2);
  });

  it("9 builds a stability report with top unstable samples", () => {
    const report = buildStabilityReport({ baseline, current });
    expect(report.scoreDelta.topUnstableSamples[0].sampleId).toBe("s2");
  });

  it("10 calculates replay success and malformed rates", () => {
    const summary = calculateDrift({ baseline, current });
    expect(summary.successRate).toBe(0.75);
    expect(summary.malformedRate).toBe(0.25);
  });

  it("11 preserves retry-path provider evidence", () => {
    expect(current.find((row) => row.sampleId === "s2")?.retryPath).toEqual(["openai", "gemini"]);
  });

  it("12 documents absence of drift when scores match baseline", () => {
    const deltas = analyzeScoreDeltas({ baseline, current: baseline });
    expect(meanAbsoluteDelta(deltas)).toBe(0);
  });

  it("13 runs deterministic local replay simulation without provider secrets", () => {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "placement-drift-sim-"));
    execFileSync(
      path.join("node_modules", ".bin", "tsx"),
      [
        "scripts/placement-v3/run-grading-replay.ts",
        "--simulate",
        "--batch",
        "vitest-sim",
        "--limit",
        "6",
        "--outDir",
        outDir,
        "--resume=false",
      ],
      { cwd: process.cwd(), stdio: "pipe" },
    );
    const files = fs.readdirSync(outDir);
    const runFile = files.find((file) => file.endsWith(".json") && !file.includes(".summary.") && !file.includes(".drift-diff.") && !file.includes(".local-persistence.") && !file.includes(".dashboard-payload.") && !file.includes(".pipeline-integrity."));
    expect(runFile).toBeTruthy();
    const raw = JSON.parse(fs.readFileSync(path.join(outDir, runFile!), "utf8")) as {
      simulated: boolean;
      scores: ReplayScore[];
      evidence: Array<{ simulated?: boolean; rawGraderOutput?: { simulated?: boolean } }>;
    };
    const dashboardFile = files.find((file) => file.endsWith(".dashboard-payload.json"));
    const integrityFile = files.find((file) => file.endsWith(".pipeline-integrity.json"));
    const diffFile = files.find((file) => file.endsWith(".drift-diff.json"));
    expect(raw.simulated).toBe(true);
    expect(raw.scores).toHaveLength(6);
    expect(raw.evidence.every((entry) => entry.simulated === true && entry.rawGraderOutput?.simulated === true)).toBe(true);
    expect(JSON.parse(fs.readFileSync(path.join(outDir, dashboardFile!), "utf8")).simulated).toBe(true);
    expect(JSON.parse(fs.readFileSync(path.join(outDir, integrityFile!), "utf8")).dashboardPayloadRenderable).toBe(true);
    expect(JSON.parse(fs.readFileSync(path.join(outDir, diffFile!), "utf8")).simulated).toBe(true);
  });
});

function score(
  sampleId: string,
  batchId: string,
  modality: ReplayScore["modality"],
  expectedCefr: ReplayScore["expectedCefr"],
  parsedCefr: ReplayScore["parsedCefr"],
  provider: ReplayScore["provider"],
  taxonomyTags: string[],
  overrides: Partial<ReplayScore> = {},
): ReplayScore {
  return {
    runId: `${batchId}-run`,
    batchId,
    sampleId,
    modality,
    expectedCefr,
    parsedCefr,
    provider,
    model: provider === "gemini" ? "gemini-2.5-flash" : "gpt-4o-mini",
    retryPath: [provider],
    taxonomyTags,
    latencyMs: 1200,
    tokensInput: 500,
    tokensOutput: 200,
    status: "success",
    malformed: false,
    createdAt: batchId === "baseline" ? "2026-05-20T10:00:00.000Z" : "2026-05-20T11:00:00.000Z",
    ...overrides,
  };
}
