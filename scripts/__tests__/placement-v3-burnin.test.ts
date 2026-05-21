import { describe, expect, it } from "vitest";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

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
    cleanup_requested: false,
    cleanup_verified: false,
    retry_reconciled: true,
    partial_result_reconciled: true,
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
      "--journal=.burnin.json",
      "--audit-reconciliation",
      "--audit-drift",
      "--reconstruct-lineage",
    ])).toEqual({
      iterations: 7,
      concurrency: 3,
      cleanup: true,
      json: true,
      skipSpeaking: true,
      dryRun: true,
      injectFailure: "duplicate-submit-delivery",
      injectFailures: ["duplicate-submit-delivery"],
      journal: ".burnin.json",
      replay: null,
      auditReconciliation: true,
      auditDrift: true,
      reconstructLineage: true,
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
      retry_reconciliations: 1,
      partial_result_reconciliations: 1,
      reconciliation_failures: 0,
    });
    expect(decoded.blocking_failures).toEqual([]);
  });

  it("keeps high-concurrency dry-run JSON deterministic across repeated runs", async () => {
    const options = {
      iterations: 30,
      concurrency: 6,
      cleanup: false,
      json: true,
      skipSpeaking: false,
      dryRun: true,
      injectFailure: "partial-result" as const,
    };

    const first = await runPlacementV3BurnIn(options, safeEnv);
    const second = await runPlacementV3BurnIn(options, safeEnv);

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    expect(first.metrics).toMatchObject({
      iterations_attempted: 30,
      iterations_succeeded: 30,
      partial_result_recoveries: 30,
      partial_result_reconciliations: 30,
      azure_skipped: 30,
      reconciliation_failures: 0,
    });
    expect(first.iterations.map((row) => row.index)).toEqual([...Array(30).keys()]);
  });

  it("normalizes excessive concurrency without corrupting totals", async () => {
    const summary = await runPlacementV3BurnIn({
      iterations: 2,
      concurrency: 8,
      cleanup: false,
      json: false,
      skipSpeaking: true,
      dryRun: true,
      injectFailure: null,
    }, safeEnv);

    expect(summary.ok).toBe(true);
    expect(summary.options.concurrency).toBe(2);
    expect(summary.metrics.iterations_attempted).toBe(2);
    expect(summary.blocking_failures).toEqual([]);
  });

  it("fails closed on malformed metrics and orphaned iteration summaries", () => {
    const summary = aggregateBurnIn({
      iterations: 2,
      concurrency: 1,
      cleanup: false,
      json: true,
      skipSpeaking: true,
      dryRun: false,
      injectFailure: "partial-result",
    }, [
      iteration({
        index: 0,
        latency_ms: Number.NaN,
        response_count: -1,
        injected_failure: "partial-result",
      }),
      iteration({
        index: 0,
        session_id: "session-2",
        learner_email: "placement-v3-test-323e4567-e89b-12d3-a456-426614174000@mercyblade.test",
        injected_failure: "partial-result",
        retry_reconciled: false,
      }),
    ]);

    expect(summary.ok).toBe(false);
    expect(summary.metrics.reconciliation_failures).toBeGreaterThan(0);
    expect(summary.blocking_failures).toContain("reconciliation_mismatch:duplicate_iteration_0");
    expect(summary.blocking_failures).toContain("reconciliation_mismatch:missing_iteration_1");
    expect(summary.blocking_failures).toContain("malformed_iteration:0:latency");
    expect(summary.blocking_failures).toContain("malformed_iteration:0:response_count");
    expect(summary.blocking_failures).toContain("iteration_0:retry_reconciliation_failed");
  });

  it("accounts for cleanup verification and retry-loop aliases", async () => {
    const summary = await runPlacementV3BurnIn({
      iterations: 2,
      concurrency: 2,
      cleanup: true,
      json: true,
      skipSpeaking: true,
      dryRun: false,
      injectFailure: "retry-loop",
    }, safeEnv);

    expect(summary.ok).toBe(true);
    expect(summary.metrics.cleanup_verified).toBe(2);
    expect(summary.metrics.retry_reconciliations).toBe(2);
    expect(summary.metrics.persistence_failures_recovered).toBe(2);
    expect(summary.iterations.every((row) => row.cleanup_requested && row.cleanup_verified)).toBe(true);
  });

  it("journals and replays deterministic lineage without mutating runtime state", async () => {
    const dir = await mkdtemp(join(tmpdir(), "placement-v3-burnin-"));
    const journal = join(dir, "journal.json");
    const options = {
      iterations: 6,
      concurrency: 3,
      cleanup: false,
      json: true,
      skipSpeaking: false,
      dryRun: true,
      injectFailure: "partial-result" as const,
      injectFailures: ["partial-result", "retry-loop", "delayed-result"] as const,
      journal,
      replay: null,
      auditReconciliation: false,
      auditDrift: false,
      reconstructLineage: false,
    };

    const written = await runPlacementV3BurnIn(options, safeEnv);
    const replayed = await runPlacementV3BurnIn({
      ...options,
      journal: null,
      replay: journal,
      auditReconciliation: true,
      auditDrift: true,
      reconstructLineage: true,
    }, safeEnv);

    expect(written.ok).toBe(true);
    expect(replayed.ok).toBe(true);
    expect(replayed.replay_audit.mode).toBe("replay");
    expect(replayed.replay_audit.replayed_iterations).toBe(6);
    expect(replayed.replay_audit.replay_drift_events).toBe(0);
    expect(replayed.lineage.some((node) => node.type === "replay")).toBe(true);
    expect(replayed.metrics.partial_result_recoveries).toBe(2);
    expect(replayed.metrics.persistence_failures_recovered).toBe(6);
  });

  it("fails closed when replay journal reconciliation drifts", async () => {
    const dir = await mkdtemp(join(tmpdir(), "placement-v3-burnin-drift-"));
    const journal = join(dir, "journal.json");
    const written = await runPlacementV3BurnIn({
      iterations: 2,
      concurrency: 1,
      cleanup: false,
      json: true,
      skipSpeaking: false,
      dryRun: true,
      injectFailure: "partial-result",
      injectFailures: ["partial-result"],
      journal,
      replay: null,
      auditReconciliation: false,
      auditDrift: false,
      reconstructLineage: false,
    }, safeEnv);
    const raw = JSON.parse(await readFile(journal, "utf8"));
    raw.summary.iterations[1].retry_reconciled = false;
    await writeFile(journal, `${JSON.stringify(raw, null, 2)}\n`);

    const replayed = await runPlacementV3BurnIn({
      ...written.options,
      journal: null,
      replay: journal,
      auditReconciliation: true,
      auditDrift: true,
      reconstructLineage: true,
    }, safeEnv);

    expect(replayed.ok).toBe(false);
    expect(replayed.blocking_failures).toContain("replay_drift:summary_hash_mismatch");
    expect(replayed.blocking_failures).toContain("replay_drift:lineage_hash_mismatch");
    expect(replayed.metrics.reconciliation_failures).toBeGreaterThan(0);
  });

  it("fails closed on malformed replay journal", async () => {
    const dir = await mkdtemp(join(tmpdir(), "placement-v3-burnin-bad-"));
    const journal = join(dir, "bad.json");
    await writeFile(journal, "{not-json");

    const replayed = await runPlacementV3BurnIn({
      iterations: 1,
      concurrency: 1,
      cleanup: false,
      json: true,
      skipSpeaking: false,
      dryRun: true,
      injectFailure: null,
      injectFailures: [],
      journal: null,
      replay: journal,
      auditReconciliation: true,
      auditDrift: true,
      reconstructLineage: true,
    }, safeEnv);

    expect(replayed.ok).toBe(false);
    expect(replayed.blocking_failures[0]).toContain("replay_journal:malformed");
  });
});
