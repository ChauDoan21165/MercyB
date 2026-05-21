import { spawnSync } from "node:child_process";
import fs from "node:fs";
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
      "--ci-stress",
      "--emit-debug-artifacts",
    ])).toMatchObject({
      iterations: 7,
      concurrency: 3,
      simulateTimeoutRate: 0.2,
      simulateMalformedRate: 0.4,
      dryRun: true,
      json: true,
      ciStress: true,
      emitDebugArtifacts: true,
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
    expect(summary.failureClassificationCounts).toMatchObject({
      timeout: 1,
      malformed_payload: 1,
      duplicate_delivery: 1,
      duplicate_suppression_mismatch: 0,
    });
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
    expect(summary.failureClassificationCounts).toMatchObject({
      timeout: 1,
      malformed_payload: 1,
      transient_network: 1,
      partial_metadata: 1,
      duplicate_delivery: 1,
      skipped_azure_validation: 1,
    });
    expect(summary.blockingFailures).toEqual([]);
  });

  it("honors targeted dry-run timeout and malformed simulation rates without Azure credentials", async () => {
    const timeoutSummary = await runBurnin(parseBurninArgs([
      "--dry-run",
      "--iterations=10",
      "--concurrency=3",
      "--simulate-timeout-rate=1",
    ]));
    const malformedSummary = await runBurnin(parseBurninArgs([
      "--dry-run",
      "--iterations=10",
      "--concurrency=3",
      "--simulate-malformed-rate=1",
    ]));

    expect(timeoutSummary).toMatchObject({
      iterationsAttempted: 10,
      timeoutCount: 10,
      malformedPayloadCount: 0,
      duplicateSuppressionCount: 0,
      blockingFailures: [],
    });
    expect(malformedSummary).toMatchObject({
      iterationsAttempted: 10,
      timeoutCount: 0,
      malformedPayloadCount: 10,
      duplicateSuppressionCount: 0,
      blockingFailures: [],
    });
  });

  it("produces deterministic repeated JSON summaries under concurrent dry-run pressure", async () => {
    const options = parseBurninArgs(["--dry-run", "--iterations=25", "--concurrency=5", "--json"]);

    const summaries = await Promise.all([
      runBurnin(options),
      runBurnin(options),
      runBurnin(options),
    ]);

    expect(summaries[0]).toEqual(summaries[1]);
    expect(summaries[1]).toEqual(summaries[2]);
    expect(summaries[0]).toMatchObject({
      iterationsAttempted: 25,
      iterationsAccepted: 21,
      timeoutCount: 4,
      malformedPayloadCount: 4,
      duplicateSuppressionCount: 4,
      p50LatencyMs: 19,
      p95LatencyMs: 39,
      providerMetadataShapeStable: true,
      retryStateClean: true,
      duplicateExecutionSuppressionStable: true,
      blockingFailures: [],
    });
    expect(summaries[0].deterministicSummaryHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("ci-stress mode replays concurrent dry-runs with stable hashes", async () => {
    const summary = await runBurnin(parseBurninArgs([
      "--dry-run",
      "--iterations=25",
      "--concurrency=5",
      "--ci-stress",
    ]));

    expect(summary.ciStress).toMatchObject({
      enabled: true,
      replayCount: 3,
      stable: true,
    });
    expect(new Set(summary.ciStress.replayHashes).size).toBe(1);
    expect(summary.blockingFailures).toEqual([]);
  });

  it("emits deterministic sanitized debug artifacts for local forensics", async () => {
    const debugDir = ".tmp/test-placement-v3-speaking-burnin";
    fs.rmSync(path.resolve(repoRoot, debugDir), { recursive: true, force: true });

    const first = await runBurnin(parseBurninArgs([
      "--dry-run",
      "--iterations=6",
      "--concurrency=2",
      "--ci-stress",
      "--emit-debug-artifacts",
      `--debug-dir=${debugDir}`,
    ]));
    const firstArtifact = fs.readFileSync(path.resolve(repoRoot, first.debugArtifact), "utf8");
    const second = await runBurnin(parseBurninArgs([
      "--dry-run",
      "--iterations=6",
      "--concurrency=2",
      "--ci-stress",
      "--emit-debug-artifacts",
      `--debug-dir=${debugDir}`,
    ]));
    const secondArtifact = fs.readFileSync(path.resolve(repoRoot, second.debugArtifact), "utf8");

    expect(first.debugArtifact).toBe(`${debugDir}/latest.json`);
    expect(firstArtifact).toBe(secondArtifact);
    const parsed = JSON.parse(firstArtifact);
    expect(parsed).toMatchObject({
      artifactType: "placement-v3-speaking-burnin-debug",
      sanitized: true,
      liveProviderEvidence: false,
      options: {
        dryRun: true,
        ciStress: true,
      },
    });
    expect(parsed.debugTrace).toHaveLength(6);
  });

  it("fails closed on impossible aggregation states", () => {
    const summary = aggregateBurninResults([
      {
        runId: "bad-latency",
        ok: false,
        latencyMs: -1,
        fallback: true,
        errorCode: "timeout",
        providerTimeout: false,
        retryable: false,
        recoverable: false,
        persistedProviderMetadata: {
          provider: "azure",
          providerPath: "placement-v3-speaking",
          fallback: false,
        },
      },
    ]);

    expect(summary.blockingFailures.map((item) => item.failure)).toEqual(expect.arrayContaining([
      "latency_invalid",
      "provider_metadata_fallback_mismatch",
      "timeout_provider_marker_missing",
      "timeout_retryable_missing",
      "timeout_recoverable_missing",
    ]));
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
      failureClassificationCounts: {
        timeout: 1,
        malformed_payload: 1,
        transient_network: 0,
        partial_metadata: 0,
        duplicate_delivery: 0,
        skipped_azure_validation: 1,
        concurrency_corruption: 0,
        retry_reconciliation_failure: 0,
        aggregation_drift: 0,
        duplicate_suppression_mismatch: 0,
      },
      skippedValidations: ["live_provider_call", "real_supabase_persistence"],
      providerMetadataShapeStable: true,
      duplicateExecutionSuppressionStable: true,
    });
  });
});
