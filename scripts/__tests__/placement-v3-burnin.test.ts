import { describe, expect, it } from "vitest";

import {
  aggregateBurnIn,
  parseBurnInArgs,
  runPlacementV3BurnIn,
  type BurnInIteration,
} from "../placement-v3-burnin";

const safeEnv = {
  PLACEMENT_V3_VALIDATION_ENV: "validation",
  PLACEMENT_V3_LIVE_VALIDATION: "1",
};

function iteration(overrides: Partial<BurnInIteration> = {}): BurnInIteration {
  return {
    index: 0,
    ok: true,
    latency_ms: 10,
    learner_email: "placement-v3-test-123e4567-e89b-12d3-a456-426614174000@mercyblade.test",
    session_id: "session-1",
    persistence_mode: "memory",
    session_persisted: true,
    response_count: 8,
    profile_persisted: true,
    result_retrieval: true,
    duplicate_suppressed: true,
    timeout_fallback_persisted: true,
    azure_status: "skipped",
    skipped_validations: ["azure_speaking_live_check_missing_key"],
    blocking_failures: [],
    injected_failure: null,
    recovered_from_injection: false,
    ...overrides,
  };
}

describe("placement v3 burn-in runner", () => {
  it("parses burn-in execution flags", () => {
    expect(parseBurnInArgs([
      "--iterations=7",
      "--concurrency=3",
      "--cleanup",
      "--json",
      "--skip-speaking",
      "--dry-run",
      "--inject-failure=duplicate-submit-delivery",
    ])).toEqual({
      iterations: 7,
      concurrency: 3,
      cleanup: true,
      json: true,
      skipSpeaking: true,
      dryRun: true,
      injectFailure: "duplicate-submit-delivery",
    });
  });

  it("executes dry-run iterations without writes", async () => {
    const summary = await runPlacementV3BurnIn({
      iterations: 2,
      concurrency: 1,
      cleanup: false,
      json: false,
      skipSpeaking: false,
      dryRun: true,
      injectFailure: null,
    }, safeEnv);

    expect(summary.ok).toBe(true);
    expect(summary.dry_run).toBe(true);
    expect(summary.metrics.iterations_attempted).toBe(2);
    expect(summary.metrics.iterations_succeeded).toBe(2);
    expect(summary.iterations.every((row) => row.persistence_mode === "dry_run")).toBe(true);
    expect(summary.iterations.every((row) => !row.session_persisted)).toBe(true);
    expect(summary.skipped_validations).toContain("azure_speaking_live_check_missing_key");
  });

  it("keeps concurrent memory validation isolated", async () => {
    const summary = await runPlacementV3BurnIn({
      iterations: 3,
      concurrency: 3,
      cleanup: false,
      json: false,
      skipSpeaking: true,
      dryRun: false,
      injectFailure: null,
    }, safeEnv);

    expect(summary.ok).toBe(true);
    expect(summary.metrics.iterations_succeeded).toBe(3);
    expect(new Set(summary.iterations.map((row) => row.learner_email)).size).toBe(3);
    expect(new Set(summary.iterations.map((row) => row.session_id)).size).toBe(3);
    expect(summary.metrics.duplicate_submits_suppressed).toBe(3);
  });

  it("tracks duplicate submit delivery as a recovered injected failure", async () => {
    const summary = await runPlacementV3BurnIn({
      iterations: 2,
      concurrency: 1,
      cleanup: false,
      json: false,
      skipSpeaking: true,
      dryRun: false,
      injectFailure: "duplicate-submit-delivery",
    }, safeEnv);

    expect(summary.ok).toBe(true);
    expect(summary.metrics.persistence_failures_recovered).toBe(2);
    expect(summary.metrics.duplicate_submits_suppressed).toBe(2);
  });

  it("tracks stale cache cleanup and interrupted flow recovery modes", async () => {
    const stale = await runPlacementV3BurnIn({
      iterations: 1,
      concurrency: 1,
      cleanup: true,
      json: false,
      skipSpeaking: true,
      dryRun: false,
      injectFailure: "stale-cached-session-state",
    }, safeEnv);
    const interrupted = await runPlacementV3BurnIn({
      iterations: 1,
      concurrency: 1,
      cleanup: false,
      json: false,
      skipSpeaking: true,
      dryRun: false,
      injectFailure: "interrupted-retry-flow",
    }, safeEnv);

    expect(stale.ok).toBe(true);
    expect(stale.metrics.stale_cache_recoveries).toBe(1);
    expect(interrupted.ok).toBe(true);
    expect(interrupted.metrics.persistence_failures_recovered).toBe(1);
  });

  it("tracks partial result and delayed reload recovery modes", async () => {
    const partial = await runPlacementV3BurnIn({
      iterations: 1,
      concurrency: 1,
      cleanup: false,
      json: false,
      skipSpeaking: true,
      dryRun: false,
      injectFailure: "partial-result",
    }, safeEnv);
    const delayed = await runPlacementV3BurnIn({
      iterations: 1,
      concurrency: 1,
      cleanup: false,
      json: false,
      skipSpeaking: true,
      dryRun: false,
      injectFailure: "delayed-result-reload",
    }, safeEnv);

    expect(partial.ok).toBe(true);
    expect(partial.metrics.partial_result_recoveries).toBe(1);
    expect(delayed.ok).toBe(true);
    expect(delayed.metrics.persistence_failures_recovered).toBe(1);
  });

  it("reports consistency failures for duplicate sessions and missing persistence", () => {
    const summary = aggregateBurnIn({
      iterations: 2,
      concurrency: 1,
      cleanup: false,
      json: true,
      skipSpeaking: true,
      dryRun: false,
      injectFailure: null,
    }, [
      iteration(),
      iteration({
        index: 1,
        learner_email: "placement-v3-test-223e4567-e89b-12d3-a456-426614174000@mercyblade.test",
        session_persisted: false,
      }),
    ]);

    expect(summary.ok).toBe(false);
    expect(summary.blocking_failures).toContain("iteration_1:session_not_persisted");
    expect(summary.blocking_failures).toContain("iteration_1:duplicate_session_id");
  });

  it("keeps JSON output stable and compact for operational consumers", () => {
    const summary = aggregateBurnIn({
      iterations: 1,
      concurrency: 1,
      cleanup: false,
      json: true,
      skipSpeaking: true,
      dryRun: false,
      injectFailure: null,
    }, [iteration()]);

    const encoded = JSON.stringify(summary);
    const decoded = JSON.parse(encoded);
    expect(decoded.metrics).toMatchObject({
      iterations_attempted: 1,
      iterations_succeeded: 1,
      duplicate_submits_suppressed: 1,
      timeout_fallback_count: 1,
    });
    expect(decoded.blocking_failures).toEqual([]);
  });
});
