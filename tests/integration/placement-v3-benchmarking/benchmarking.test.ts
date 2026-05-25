import { describe, expect, it } from "vitest";

import { aggregateBenchmarkRuns, percentile } from "../../../src/lib/placementBenchmark/aggregateMetrics";
import { estimateTokenCostUsd, summarizeCost } from "../../../src/lib/placementBenchmark/costEstimator";
import { findWorstLatencySteps, latencyByModality } from "../../../src/lib/placementBenchmark/latencyAnalyzer";
import { analyzeProviderUsage } from "../../../src/lib/placementBenchmark/providerAnalysis";
import { detectBenchmarkRegressions } from "../../../src/lib/placementBenchmark/regressionDetector";
import type { BenchmarkRunMetric } from "../../../src/lib/placementBenchmark/types";

function run(overrides: Partial<BenchmarkRunMetric> = {}): BenchmarkRunMetric {
  const base: BenchmarkRunMetric = {
    runId: "run-1",
    suiteId: "suite-1",
    scenarioId: "beginner-a1",
    startedAt: "2026-05-20T10:00:00.000Z",
    completedAt: "2026-05-20T10:01:00.000Z",
    status: "success",
    totalDurationMs: 60_000,
    totalTokensInput: 1000,
    totalTokensOutput: 300,
    estimatedCostUsd: 0.001,
    steps: [
      {
        runId: "run-1",
        scenarioId: "beginner-a1",
        stepId: "reading",
        modality: "reading",
        provider: "openai",
        model: "gpt-4o-mini",
        startedAt: "2026-05-20T10:00:00.000Z",
        completedAt: "2026-05-20T10:00:02.000Z",
        durationMs: 2000,
        status: "success",
        tokensInput: 600,
        tokensOutput: 120,
        estimatedCostUsd: 0.000162,
        attempts: ["openai"],
        failover: false,
      },
      {
        runId: "run-1",
        scenarioId: "beginner-a1",
        stepId: "speaking",
        modality: "speaking",
        provider: "gemini",
        model: "gemini-2.5-flash",
        startedAt: "2026-05-20T10:00:02.000Z",
        completedAt: "2026-05-20T10:00:08.000Z",
        durationMs: 6000,
        status: "success",
        tokensInput: 400,
        tokensOutput: 180,
        estimatedCostUsd: 0.00057,
        attempts: ["openai", "gemini"],
        failover: true,
      },
    ],
  };
  return { ...base, ...overrides };
}

describe("placement v3 benchmark integration utilities", () => {
  it("1 aggregates run and step counts", () => {
    const metrics = aggregateBenchmarkRuns([run()]);
    expect(metrics.runCount).toBe(1);
    expect(metrics.stepCount).toBe(2);
  });

  it("2 calculates percentile latency", () => {
    expect(percentile([100, 200, 300, 400], 0.95)).toBe(400);
    expect(percentile([400, 100, 300, 200], 0.5)).toBe(200);
  });

  it("3 aggregates modality-level p95 latency", () => {
    const metrics = aggregateBenchmarkRuns([run()]);
    expect(metrics.byModality.speaking.p95LatencyMs).toBe(6000);
  });

  it("4 estimates OpenAI token cost", () => {
    expect(estimateTokenCostUsd({
      provider: "openai",
      model: "gpt-4o-mini",
      tokensInput: 1_000_000,
      tokensOutput: 1_000_000,
    })).toBe(0.75);
  });

  it("5 summarizes cost by provider", () => {
    const summary = summarizeCost([
      { provider: "openai", model: "gpt-4o-mini", tokensInput: 1, tokensOutput: 1, estimatedCostUsd: 0.1 },
      { provider: "gemini", model: "gemini-2.5-flash", tokensInput: 1, tokensOutput: 1, estimatedCostUsd: 0.2 },
    ]);
    expect(summary.totalUsd).toBe(0.3);
    expect(summary.byProvider.gemini).toBe(0.2);
  });

  it("6 identifies worst latency steps", () => {
    const worst = findWorstLatencySteps(run().steps, 1);
    expect(worst[0].stepId).toBe("speaking");
  });

  it("7 groups latency by modality", () => {
    const grouped = latencyByModality(run().steps);
    expect(grouped.reading.count).toBe(1);
    expect(grouped.speaking.max).toBe(6000);
  });

  it("8 analyzes provider failover", () => {
    const provider = analyzeProviderUsage(run().steps);
    expect(provider.providerCounts.openai).toBe(1);
    expect(provider.failoverRecoverySuccessRate).toBe(1);
  });

  it("9 detects latency regression", () => {
    const baseline = run({ runId: "base", totalDurationMs: 10_000 });
    const current = run({
      runId: "current",
      totalDurationMs: 20_000,
      steps: run().steps.map((step) => ({ ...step, durationMs: step.durationMs * 3 })),
    });
    const warnings = detectBenchmarkRegressions({ baseline: [baseline], current: [current] });
    expect(warnings.some((warning) => warning.metric === "p95LatencyMs")).toBe(true);
  });

  it("10 detects cost regression", () => {
    const warnings = detectBenchmarkRegressions({
      baseline: [run({ estimatedCostUsd: 0.01 })],
      current: [run({ runId: "current", estimatedCostUsd: 0.02 })],
    });
    expect(warnings.some((warning) => warning.metric === "averageCostUsd")).toBe(true);
  });
});
