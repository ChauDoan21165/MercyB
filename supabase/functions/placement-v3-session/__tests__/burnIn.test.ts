import { describe, expect, it } from "vitest";
import {
  runGradeSpeakingBurnIn,
  type GradeSpeakingBurnInReport,
} from "../burnIn.ts";

function stableJson(report: GradeSpeakingBurnInReport) {
  return JSON.stringify(report);
}

describe("placement v3 speaking burn-in runner", () => {
  it("runs a dry-run burn-in with injected failures and preserves sanitized metadata", async () => {
    const report = await runGradeSpeakingBurnIn({
      iterations: 4,
      concurrency: 3,
      injectFailure: ["partial-fallback", "duplicate-submit", "stale-session"],
      dryRun: true,
    });

    expect(report.dryRun).toBe(true);
    expect(report.iterationReports).toHaveLength(4);
    expect(report.summary.completedIterations).toBe(4);
    expect(report.summary.duplicateSubmitSuppressed).toBeGreaterThan(0);
    expect(report.summary.staleSessionRecovered).toBeGreaterThan(0);
    expect(report.summary.partialResultRecovered).toBeGreaterThan(0);
    expect(report.summary.redactionViolations).toBe(0);
    expect(report.summary.crossIterationContamination).toBe(false);
    expect(report.jsonStable).toBe(true);

    for (const iteration of report.iterationReports) {
      expect(iteration.providerSummary.redactionOk).toBe(true);
      expect(iteration.providerSummary.metadataRows).toBeGreaterThan(0);
      expect(iteration.responseCount).toBeGreaterThan(0);
      expect(iteration.jsonValid).toBe(true);
    }
  });

  it("keeps duplicate-submit suppression isolated per session", async () => {
    const report = await runGradeSpeakingBurnIn({
      iterations: 2,
      concurrency: 2,
      injectFailure: ["duplicate-submit"],
      dryRun: true,
    });

    expect(report.summary.duplicateSubmitSuppressed).toBeGreaterThan(0);
    expect(report.summary.crossIterationContamination).toBe(false);
    expect(report.iterationReports.every((iteration) => iteration.idempotencyBoundary.duplicateRows === 0)).toBe(true);
  });

  it("produces stable JSON for the same inputs", async () => {
    const first = await runGradeSpeakingBurnIn({
      iterations: 3,
      concurrency: 2,
      injectFailure: ["partial-fallback", "stale-session"],
      dryRun: true,
    });
    const second = await runGradeSpeakingBurnIn({
      iterations: 3,
      concurrency: 2,
      injectFailure: ["partial-fallback", "stale-session"],
      dryRun: true,
    });

    expect(stableJson(first)).toBe(stableJson(second));
  });
});
