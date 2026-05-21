import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  aggregateBurninResults,
  parseBurninArgs,
  runBurnin,
} from "../placement-v3-speaking-burnin.mjs";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "../..");

describe("placement-v3 speaking burn-in", () => {
  it("parses burn-in options", () => {
    expect(parseBurninArgs([
      "--iterations=7",
      "--concurrency=3",
      "--simulate-timeout-rate=0.2",
      "--simulate-malformed-rate=0.4",
      "--dry-run",
      "--json",
    ])).toMatchObject({
      iterations: 7,
      concurrency: 3,
      simulateTimeoutRate: 0.2,
      simulateMalformedRate: 0.4,
      dryRun: true,
      json: true,
    });
  });

  it("aggregates latency, fallback, malformed, retry, and duplicate metrics", () => {
    const summary = aggregateBurninResults([
      {
        runId: "a",
        ok: true,
        latencyMs: 20,
        fallback: false,
        persistedProviderMetadata: { provider: "azure", providerPath: "placement-v3-speaking", fallback: false },
      },
      {
        runId: "b",
        ok: false,
        latencyMs: 40,
        fallback: true,
        errorCode: "timeout",
        providerTimeout: true,
        retryable: true,
        recoverable: true,
        persistedProviderMetadata: {
          provider: "azure",
          providerPath: "placement-v3-speaking",
          fallback: true,
          errorCode: "timeout",
        },
      },
      {
        runId: "c",
        ok: false,
        latencyMs: 60,
        fallback: true,
        errorCode: "azure_status_malformed",
        retryable: true,
        recoverable: true,
        persistedProviderMetadata: {
          provider: "azure",
          providerPath: "placement-v3-speaking",
          fallback: true,
        },
      },
      {
        runId: "b",
        ok: false,
        latencyMs: 100,
        fallback: true,
        errorCode: "timeout",
        persistedProviderMetadata: {
          provider: "azure",
          providerPath: "placement-v3-speaking",
          fallback: true,
        },
      },
    ]);

    expect(summary.iterationsAttempted).toBe(4);
    expect(summary.iterationsAccepted).toBe(3);
    expect(summary.iterationsSucceeded).toBe(1);
    expect(summary.timeoutCount).toBe(1);
    expect(summary.fallbackCount).toBe(2);
    expect(summary.malformedPayloadCount).toBe(1);
    expect(summary.retryRecoveryCount).toBe(2);
    expect(summary.duplicateSuppressionCount).toBe(1);
    expect(summary.p50LatencyMs).toBe(40);
    expect(summary.p95LatencyMs).toBe(60);
    expect(summary.blockingFailures).toEqual([]);
  });

  it("dry-run exercises failure injection without live provider credentials", async () => {
    const summary = await runBurnin(parseBurninArgs(["--dry-run", "--iterations=6", "--concurrency=2"]));

    expect(summary.refused).toBeUndefined();
    expect(summary.iterationsAttempted).toBe(6);
    expect(summary.timeoutCount).toBe(1);
    expect(summary.malformedPayloadCount).toBe(1);
    expect(summary.duplicateSuppressionCount).toBe(1);
    expect(summary.skippedValidations).toContain("live_provider_call");
    expect(summary.skippedValidations).toContain("real_supabase_persistence");
    expect(summary.providerMetadataShapeStable).toBe(true);
    expect(summary.retryStateClean).toBe(true);
    expect(summary.blockingFailures).toEqual([]);
  });

  it("refuses non-dry-run burn-in without live validation env", async () => {
    const summary = await runBurnin(parseBurninArgs(["--iterations=1"]));

    expect(summary.refused).toBe(true);
    expect(summary.exitCode).toBe(2);
    expect(summary.errors).toContain("missing AZURE_SPEECH_KEY");
  });

  it("JSON output is stable for dry-run command execution", () => {
    const result = spawnSync(
      "node",
      ["scripts/placement-v3-speaking-burnin.mjs", "--dry-run", "--iterations=3", "--json"],
      { cwd: repoRoot, encoding: "utf8", env: { PATH: process.env.PATH ?? "" } },
    );

    expect(result.status).toBe(0);
    const json = JSON.parse(result.stdout);
    expect(json).toMatchObject({
      iterationsAttempted: 3,
      skippedValidations: ["live_provider_call", "real_supabase_persistence"],
      providerMetadataShapeStable: true,
      duplicateExecutionSuppressionStable: true,
    });
  });
});
