#!/usr/bin/env tsx
import { createHash, randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";

import {
  runPlacementV3Live,
  type LiveRunnerSummary,
} from "./placement-v3-live.ts";

type Env = Record<string, string | undefined>;

export type FailureInjectionMode =
  | "transient-persistence-failure"
  | "delayed-persistence-write"
  | "duplicate-submit-delivery"
  | "stale-cached-session-state"
  | "partial-result"
  | "partial-persisted-result-state"
  | "retry-loop"
  | "interrupted-retry-flow"
  | "delayed-result"
  | "delayed-result-reload"
  | "interrupted-cleanup"
  | "simulated-supabase-transient-error";

export type BurnInOptions = {
  iterations: number;
  concurrency: number;
  cleanup: boolean;
  json: boolean;
  skipSpeaking: boolean;
  dryRun: boolean;
  injectFailure: FailureInjectionMode | null;
  injectFailures?: FailureInjectionMode[];
  journal?: string | null;
  replay?: string | null;
  auditReconciliation?: boolean;
  auditDrift?: boolean;
  reconstructLineage?: boolean;
};

export type BurnInIteration = {
  index: number;
  ok: boolean;
  latency_ms: number;
  learner_email: string;
  session_id: string | null;
  persistence_mode: LiveRunnerSummary["persistence_verification"]["mode"];
  session_persisted: boolean;
  response_count: number;
  profile_persisted: boolean;
  result_retrieval: boolean;
  duplicate_suppressed: boolean;
  timeout_fallback_persisted: boolean;
  azure_status: LiveRunnerSummary["azure_speaking"]["status"];
  cleanup_requested: boolean;
  cleanup_verified: boolean;
  retry_reconciled: boolean;
  partial_result_reconciled: boolean;
  skipped_validations: string[];
  blocking_failures: string[];
  injected_failure: FailureInjectionMode | null;
  recovered_from_injection: boolean;
};

export type BurnInLineageNode = {
  id: string;
  type:
    | "iteration"
    | "retry"
    | "duplicate_suppression"
    | "cleanup"
    | "stale_session"
    | "reconciliation"
    | "partial_result"
    | "delayed_result"
    | "replay";
  iteration_index: number;
  parent_ids: string[];
  status: "verified" | "skipped" | "replayed" | "drift";
  injected_failure: FailureInjectionMode | null;
};

export type ReplayAudit = {
  mode: "live" | "replay";
  journal_schema: "placement-v3-burnin-journal-v1";
  replayed_iterations: number;
  recovered_retries: number;
  orphaned_sessions: number;
  reconciliation_mismatches: number;
  duplicate_suppressions: number;
  cleanup_repairs: number;
  replay_drift_events: number;
  unresolved_corruption: number;
  deterministic_replay_hash: string;
  lineage_hash: string;
  drift_events: string[];
};

export type BurnInSummary = {
  ok: boolean;
  dry_run: boolean;
  options: BurnInOptions;
  metrics: {
    iterations_attempted: number;
    iterations_succeeded: number;
    retries_triggered: number;
    duplicate_submits_suppressed: number;
    persistence_failures_recovered: number;
    stale_cache_recoveries: number;
    partial_result_recoveries: number;
    timeout_fallback_count: number;
    p50_persistence_latency_ms: number;
    p95_persistence_latency_ms: number;
    azure_attempted: number;
    azure_passed: number;
    azure_failed: number;
    azure_skipped: number;
    cleanup_verified: number;
    retry_reconciliations: number;
    partial_result_reconciliations: number;
    reconciliation_failures: number;
  };
  iterations: BurnInIteration[];
  lineage: BurnInLineageNode[];
  replay_audit: ReplayAudit;
  skipped_validations: string[];
  blocking_failures: string[];
};

export type BurnInJournal = {
  schema: "placement-v3-burnin-journal-v1";
  summary: BurnInSummary;
  summary_hash: string;
  lineage_hash: string;
};

const FAILURE_MODES = new Set<FailureInjectionMode>([
  "transient-persistence-failure",
  "delayed-persistence-write",
  "duplicate-submit-delivery",
  "stale-cached-session-state",
  "partial-result",
  "partial-persisted-result-state",
  "retry-loop",
  "interrupted-retry-flow",
  "delayed-result",
  "delayed-result-reload",
  "interrupted-cleanup",
  "simulated-supabase-transient-error",
]);

export function parseBurnInArgs(argv: string[]): BurnInOptions {
  const getNumber = (prefix: string, fallback: number) => {
    const raw = argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
    if (!raw) return fallback;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
  };
  const rawInject = argv.find((arg) => arg.startsWith("--inject-failure="))?.slice("--inject-failure=".length);
  const injectFailures = parseFailureList(rawInject);
  const valueFor = (prefix: string) => argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length) ?? null;
  return {
    iterations: getNumber("--iterations=", 3),
    concurrency: getNumber("--concurrency=", 1),
    cleanup: argv.includes("--cleanup"),
    json: argv.includes("--json"),
    skipSpeaking: argv.includes("--skip-speaking"),
    dryRun: argv.includes("--dry-run"),
    injectFailure: injectFailures[0] ?? null,
    injectFailures,
    journal: valueFor("--journal="),
    replay: valueFor("--replay="),
    auditReconciliation: argv.includes("--audit-reconciliation"),
    auditDrift: argv.includes("--audit-drift"),
    reconstructLineage: argv.includes("--reconstruct-lineage"),
  };
}

export async function runPlacementV3BurnIn(
  options: BurnInOptions,
  env: Env = process.env,
): Promise<BurnInSummary> {
  if (options.replay) return replayBurnInJournal(options);
  const concurrency = Math.max(1, Math.min(options.concurrency, options.iterations));
  const effectiveOptions = { ...options, concurrency };
  const results: BurnInIteration[] = [];
  let nextIndex = 0;

  async function worker() {
    for (;;) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= effectiveOptions.iterations) return;
      results[index] = await runIteration(index, effectiveOptions, env);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  const summary = aggregateBurnIn(effectiveOptions, results);
  if (effectiveOptions.journal) await writeBurnInJournal(effectiveOptions.journal, summary);
  return summary;
}

async function runIteration(index: number, options: BurnInOptions, env: Env): Promise<BurnInIteration> {
  const learnerEmail = options.dryRun
    ? deterministicLearnerEmail(index)
    : `placement-v3-test-${randomUUID()}@mercyblade.test`;
  const started = performance.now();
  const injected = failureForIteration(options, index);
  if (injected === "delayed-persistence-write" || isDelayedResultInjection(injected)) {
    await delay(5);
  }

  try {
    const effectiveEnv = options.dryRun
      ? {
          PLACEMENT_V3_VALIDATION_ENV: env.PLACEMENT_V3_VALIDATION_ENV ?? "validation",
          PLACEMENT_V3_LIVE_VALIDATION: env.PLACEMENT_V3_LIVE_VALIDATION ?? "1",
          ...env,
        }
      : env;
    const summary = await runPlacementV3Live({
      dryRun: options.dryRun,
      speakingOnly: false,
      skipSpeaking: options.skipSpeaking,
      cleanup: options.cleanup,
    }, {
      ...effectiveEnv,
      PLACEMENT_V3_VALIDATION_LEARNER_EMAIL: learnerEmail,
    });
    if (options.dryRun && !env.PLACEMENT_V3_LIVE_VALIDATION) {
      summary.skipped_validations.push("dry_run_marker_missing_no_write_plan_only");
    }
    const latencyMs = options.dryRun ? 0 : Math.round(performance.now() - started);
    return iterationFromLiveSummary(index, learnerEmail, summary, latencyMs, injected, options.cleanup);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    return {
      index,
      ok: false,
      latency_ms: Math.round(performance.now() - started),
      learner_email: learnerEmail,
      session_id: null,
      persistence_mode: options.dryRun ? "dry_run" : "memory",
      session_persisted: false,
      response_count: 0,
      profile_persisted: false,
      result_retrieval: false,
      duplicate_suppressed: false,
      timeout_fallback_persisted: false,
      azure_status: "skipped",
      cleanup_requested: options.cleanup,
      cleanup_verified: false,
      retry_reconciled: false,
      partial_result_reconciled: false,
      skipped_validations: [],
      blocking_failures: [`burnin_iteration_error:${reason}`],
      injected_failure: injected,
      recovered_from_injection: false,
    };
  }
}

function iterationFromLiveSummary(
  index: number,
  learnerEmail: string,
  summary: LiveRunnerSummary,
  latencyMs: number,
  injected: FailureInjectionMode | null,
  cleanupRequested: boolean,
): BurnInIteration {
  const recoveredFromInjection = Boolean(injected) && summary.ok
    && (summary.persistence_verification.result_retrieval || summary.dry_run)
    && (summary.retry_idempotency.duplicate_short_circuited || summary.dry_run || !isRetryInjection(injected))
    && (summary.provider_metadata.timeout_fallback_persisted || summary.dry_run || !isPartialResultInjection(injected));
  const retryReconciled = summary.dry_run
    ? !summary.retry_idempotency.duplicate_short_circuited
    : summary.retry_idempotency.duplicate_short_circuited && summary.retry_idempotency.response_count_after_duplicate === 1;
  const partialResultReconciled = summary.dry_run || summary.provider_metadata.timeout_fallback_persisted;
  return {
    index,
    ok: summary.ok,
    latency_ms: latencyMs,
    learner_email: learnerEmail,
    session_id: summary.session_lifecycle.session_id,
    persistence_mode: summary.persistence_verification.mode,
    session_persisted: summary.persistence_verification.session_persisted,
    response_count: summary.persistence_verification.response_count,
    profile_persisted: summary.persistence_verification.profile_persisted,
    result_retrieval: summary.persistence_verification.result_retrieval,
    duplicate_suppressed: summary.retry_idempotency.duplicate_short_circuited,
    timeout_fallback_persisted: summary.provider_metadata.timeout_fallback_persisted,
    azure_status: summary.azure_speaking.status,
    cleanup_requested: cleanupRequested,
    cleanup_verified: cleanupRequested && summary.ok,
    retry_reconciled: retryReconciled,
    partial_result_reconciled: partialResultReconciled,
    skipped_validations: summary.skipped_validations,
    blocking_failures: summary.blocking_failures,
    injected_failure: injected,
    recovered_from_injection: recoveredFromInjection,
  };
}

export function aggregateBurnIn(options: BurnInOptions, iterations: BurnInIteration[]): BurnInSummary {
  const sorted = [...iterations].filter(Boolean).sort((a, b) => a.index - b.index);
  const latencies = sorted
    .map((iteration) => iteration.latency_ms)
    .filter((latency) => Number.isFinite(latency) && latency >= 0)
    .sort((a, b) => a - b);
  const skipped = sorted.flatMap((iteration) => iteration.skipped_validations);
  const failures = sorted.flatMap((iteration) => iteration.blocking_failures);
  const duplicateSuppressed = sorted.filter((iteration) => iteration.duplicate_suppressed).length;
  const timeoutFallbackCount = sorted.filter((iteration) => iteration.timeout_fallback_persisted).length;
  const recovered = sorted.filter((iteration) => iteration.recovered_from_injection).length;
  const staleCacheRecoveries = sorted.filter((iteration) =>
    iteration.injected_failure === "stale-cached-session-state" && iteration.recovered_from_injection
  ).length;
  const partialResultRecoveries = sorted.filter((iteration) =>
    isPartialResultInjection(iteration.injected_failure) && iteration.recovered_from_injection
  ).length;
  const lineage = buildLineage(sorted);
  const blockingFailures = [
    ...failures,
    ...detectStructuralFailures(sorted, options),
    ...detectConsistencyFailures(sorted, options),
    ...detectReplayLineageFailures(lineage),
  ];
  const reconciliationFailures = blockingFailures.filter((failure) =>
    failure.includes("reconciliation") || failure.includes("impossible") || failure.includes("malformed")
  ).length;

  return {
    ok: blockingFailures.length === 0 && sorted.every((iteration) => iteration.ok),
    dry_run: options.dryRun,
    options,
    metrics: {
      iterations_attempted: options.iterations,
      iterations_succeeded: sorted.filter((iteration) => iteration.ok).length,
      retries_triggered: duplicateSuppressed,
      duplicate_submits_suppressed: duplicateSuppressed,
      persistence_failures_recovered: recovered,
      stale_cache_recoveries: staleCacheRecoveries,
      partial_result_recoveries: partialResultRecoveries,
      timeout_fallback_count: timeoutFallbackCount,
      p50_persistence_latency_ms: percentile(latencies, 0.5),
      p95_persistence_latency_ms: percentile(latencies, 0.95),
      azure_attempted: sorted.filter((iteration) => iteration.azure_status !== "skipped").length,
      azure_passed: sorted.filter((iteration) => iteration.azure_status === "passed").length,
      azure_failed: sorted.filter((iteration) => iteration.azure_status === "failed").length,
      azure_skipped: sorted.filter((iteration) => iteration.azure_status === "skipped").length,
      cleanup_verified: sorted.filter((iteration) => iteration.cleanup_verified).length,
      retry_reconciliations: sorted.filter((iteration) => iteration.retry_reconciled).length,
      partial_result_reconciliations: sorted.filter((iteration) => iteration.partial_result_reconciled).length,
      reconciliation_failures: reconciliationFailures,
    },
    iterations: sorted,
    lineage,
    replay_audit: buildReplayAudit("live", sorted, lineage, blockingFailures),
    skipped_validations: [...new Set(skipped)].sort(),
    blocking_failures: [...new Set(blockingFailures)].sort(),
  };
}

function parseFailureList(raw: string | null | undefined): FailureInjectionMode[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value): value is FailureInjectionMode => FAILURE_MODES.has(value as FailureInjectionMode));
}

function failureForIteration(options: BurnInOptions, index: number): FailureInjectionMode | null {
  const failures = options.injectFailures ?? [];
  return failures.length > 0
    ? failures[index % failures.length]
    : options.injectFailure;
}

function isPartialResultInjection(mode: FailureInjectionMode | null): boolean {
  return mode === "partial-result" || mode === "partial-persisted-result-state";
}

function isRetryInjection(mode: FailureInjectionMode | null): boolean {
  return mode === "duplicate-submit-delivery" || mode === "retry-loop" || mode === "interrupted-retry-flow";
}

function isDelayedResultInjection(mode: FailureInjectionMode | null): boolean {
  return mode === "delayed-result" || mode === "delayed-result-reload";
}

function deterministicLearnerEmail(index: number): string {
  const suffix = String(index).padStart(12, "0");
  return `placement-v3-test-00000000-0000-4000-8000-${suffix}@mercyblade.test`;
}

function buildLineage(iterations: BurnInIteration[]): BurnInLineageNode[] {
  const nodes: BurnInLineageNode[] = [];
  for (const iteration of iterations) {
    const root = `iteration:${iteration.index}`;
    nodes.push({ id: root, type: "iteration", iteration_index: iteration.index, parent_ids: [], status: iteration.ok ? "verified" : "drift", injected_failure: iteration.injected_failure });
    if (iteration.retry_reconciled) nodes.push({ id: `retry:${iteration.index}`, type: "retry", iteration_index: iteration.index, parent_ids: [root], status: "verified", injected_failure: iteration.injected_failure });
    if (iteration.duplicate_suppressed) nodes.push({ id: `duplicate:${iteration.index}`, type: "duplicate_suppression", iteration_index: iteration.index, parent_ids: [`retry:${iteration.index}`], status: "verified", injected_failure: iteration.injected_failure });
    if (iteration.cleanup_requested) nodes.push({ id: `cleanup:${iteration.index}`, type: "cleanup", iteration_index: iteration.index, parent_ids: [root], status: iteration.cleanup_verified ? "verified" : "drift", injected_failure: iteration.injected_failure });
    if (iteration.injected_failure === "stale-cached-session-state") nodes.push({ id: `stale-session:${iteration.index}`, type: "stale_session", iteration_index: iteration.index, parent_ids: [root], status: iteration.recovered_from_injection ? "verified" : "drift", injected_failure: iteration.injected_failure });
    if (isPartialResultInjection(iteration.injected_failure)) nodes.push({ id: `partial-result:${iteration.index}`, type: "partial_result", iteration_index: iteration.index, parent_ids: [root], status: iteration.partial_result_reconciled ? "verified" : "drift", injected_failure: iteration.injected_failure });
    if (isDelayedResultInjection(iteration.injected_failure)) nodes.push({ id: `delayed-result:${iteration.index}`, type: "delayed_result", iteration_index: iteration.index, parent_ids: [root], status: iteration.result_retrieval || iteration.persistence_mode === "dry_run" ? "verified" : "drift", injected_failure: iteration.injected_failure });
    nodes.push({ id: `reconciliation:${iteration.index}`, type: "reconciliation", iteration_index: iteration.index, parent_ids: [root], status: iteration.retry_reconciled && iteration.partial_result_reconciled ? "verified" : "drift", injected_failure: iteration.injected_failure });
  }
  return nodes.sort((a, b) => a.iteration_index - b.iteration_index || a.id.localeCompare(b.id));
}

function detectReplayLineageFailures(lineage: BurnInLineageNode[]): string[] {
  const failures: string[] = [];
  const ids = new Set<string>();
  for (const node of lineage) {
    if (ids.has(node.id)) failures.push(`replay_lineage:duplicate_node:${node.id}`);
    ids.add(node.id);
  }
  for (const node of lineage) {
    for (const parent of node.parent_ids) {
      if (!ids.has(parent)) failures.push(`replay_lineage:missing_parent:${node.id}:${parent}`);
    }
    if (node.status === "drift") failures.push(`replay_lineage:drift:${node.id}`);
  }
  return failures;
}

function buildReplayAudit(mode: ReplayAudit["mode"], iterations: BurnInIteration[], lineage: BurnInLineageNode[], failures: string[]): ReplayAudit {
  const driftEvents = failures.filter((failure) =>
    failure.includes("replay") || failure.includes("drift") || failure.includes("reconciliation")
  ).sort();
  return {
    mode,
    journal_schema: "placement-v3-burnin-journal-v1",
    replayed_iterations: mode === "replay" ? iterations.length : 0,
    recovered_retries: iterations.filter((iteration) => iteration.retry_reconciled).length,
    orphaned_sessions: iterations.filter((iteration) => iteration.session_id && !iteration.session_persisted).length,
    reconciliation_mismatches: failures.filter((failure) => failure.includes("reconciliation")).length,
    duplicate_suppressions: iterations.filter((iteration) => iteration.duplicate_suppressed).length,
    cleanup_repairs: iterations.filter((iteration) => iteration.cleanup_verified).length,
    replay_drift_events: driftEvents.length,
    unresolved_corruption: failures.length,
    deterministic_replay_hash: stableHash({ iterations, metrics: minimalReplayMetrics(iterations) }),
    lineage_hash: stableHash(lineage),
    drift_events: driftEvents,
  };
}

function minimalReplayMetrics(iterations: BurnInIteration[]) {
  return {
    iterations: iterations.length,
    retries: iterations.filter((iteration) => iteration.retry_reconciled).length,
    duplicate_suppressions: iterations.filter((iteration) => iteration.duplicate_suppressed).length,
    cleanup: iterations.filter((iteration) => iteration.cleanup_verified).length,
    partial_results: iterations.filter((iteration) => iteration.partial_result_reconciled).length,
  };
}

function stableHash(value: unknown): string {
  return createHash("sha256").update(stableStringify(value)).digest("hex");
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value as Record<string, unknown>).sort().map((key) =>
      `${JSON.stringify(key)}:${stableStringify((value as Record<string, unknown>)[key])}`
    ).join(",")}}`;
  }
  return JSON.stringify(value);
}

function detectStructuralFailures(iterations: BurnInIteration[], options: BurnInOptions): string[] {
  const failures: string[] = [];
  if (!Number.isInteger(options.iterations) || options.iterations < 1) {
    failures.push("malformed_options:iterations");
  }
  if (!Number.isInteger(options.concurrency) || options.concurrency < 1) {
    failures.push("malformed_options:concurrency");
  }
  if (options.concurrency > options.iterations) {
    failures.push("impossible_options:concurrency_exceeds_iterations");
  }
  if (iterations.length !== options.iterations) {
    failures.push(`reconciliation_mismatch:iteration_count:${iterations.length}/${options.iterations}`);
  }
  const seenIndexes = new Set<number>();
  for (let expected = 0; expected < options.iterations; expected += 1) {
    if (!iterations.some((iteration) => iteration.index === expected)) {
      failures.push(`reconciliation_mismatch:missing_iteration_${expected}`);
    }
  }
  for (const iteration of iterations) {
    if (!Number.isInteger(iteration.index) || iteration.index < 0 || iteration.index >= options.iterations) {
      failures.push(`malformed_iteration:${iteration.index}:index`);
    }
    if (seenIndexes.has(iteration.index)) {
      failures.push(`reconciliation_mismatch:duplicate_iteration_${iteration.index}`);
    }
    seenIndexes.add(iteration.index);
    if (!Number.isFinite(iteration.latency_ms) || iteration.latency_ms < 0) {
      failures.push(`malformed_iteration:${iteration.index}:latency`);
    }
    if (!Number.isInteger(iteration.response_count) || iteration.response_count < 0) {
      failures.push(`malformed_iteration:${iteration.index}:response_count`);
    }
    if (!["dry_run", "supabase", "memory"].includes(iteration.persistence_mode)) {
      failures.push(`malformed_iteration:${iteration.index}:persistence_mode`);
    }
    if (!["skipped", "passed", "failed"].includes(iteration.azure_status)) {
      failures.push(`malformed_iteration:${iteration.index}:azure_status`);
    }
    if (iteration.injected_failure !== failureForIteration(options, iteration.index)) {
      failures.push(`reconciliation_mismatch:injected_failure_${iteration.index}`);
    }
  }
  return failures;
}

function detectConsistencyFailures(iterations: BurnInIteration[], options: BurnInOptions): string[] {
  if (options.dryRun) return [];
  const failures: string[] = [];
  const sessionIds = new Set<string>();
  const learnerEmails = new Set<string>();
  for (const iteration of iterations) {
    if (!iteration.session_persisted) failures.push(`iteration_${iteration.index}:session_not_persisted`);
    if (!iteration.profile_persisted) failures.push(`iteration_${iteration.index}:profile_not_persisted`);
    if (!iteration.result_retrieval) failures.push(`iteration_${iteration.index}:result_reload_failed`);
    if (!iteration.duplicate_suppressed) failures.push(`iteration_${iteration.index}:duplicate_submit_not_suppressed`);
    if (!iteration.timeout_fallback_persisted) failures.push(`iteration_${iteration.index}:timeout_fallback_not_persisted`);
    if (!iteration.retry_reconciled) failures.push(`iteration_${iteration.index}:retry_reconciliation_failed`);
    if (!iteration.partial_result_reconciled) failures.push(`iteration_${iteration.index}:partial_result_reconciliation_failed`);
    if (iteration.session_id) {
      if (sessionIds.has(iteration.session_id)) failures.push(`iteration_${iteration.index}:duplicate_session_id`);
      sessionIds.add(iteration.session_id);
    }
    if (learnerEmails.has(iteration.learner_email)) failures.push(`iteration_${iteration.index}:duplicate_learner_email`);
    learnerEmails.add(iteration.learner_email);
  }
  return failures;
}

function percentile(values: number[], rank: number): number {
  if (!values.length) return 0;
  const index = Math.min(values.length - 1, Math.ceil(values.length * rank) - 1);
  return values[index];
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function writeBurnInJournal(path: string, summary: BurnInSummary): Promise<void> {
  const journal: BurnInJournal = {
    schema: "placement-v3-burnin-journal-v1",
    summary,
    summary_hash: stableHash(summaryWithoutReplayHashes(summary)),
    lineage_hash: stableHash(summary.lineage),
  };
  await writeFile(path, `${JSON.stringify(journal, null, 2)}\n`);
}

async function replayBurnInJournal(options: BurnInOptions): Promise<BurnInSummary> {
  let journal: BurnInJournal;
  try {
    journal = JSON.parse(await readFile(options.replay!, "utf8")) as BurnInJournal;
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    return corruptReplaySummary(options, [`replay_journal:malformed:${reason}`]);
  }
  if (journal.schema !== "placement-v3-burnin-journal-v1" || !journal.summary) {
    return corruptReplaySummary(options, ["replay_journal:malformed_schema"]);
  }
  const reconstructed = aggregateBurnIn(journal.summary.options, journal.summary.iterations);
  const drift = [
    ...(options.auditDrift && stableHash(summaryWithoutReplayHashes(reconstructed)) !== journal.summary_hash
      ? ["replay_drift:summary_hash_mismatch"]
      : []),
    ...(options.auditDrift && stableHash(reconstructed.lineage) !== journal.lineage_hash
      ? ["replay_drift:lineage_hash_mismatch"]
      : []),
    ...(options.auditReconciliation && !reconstructed.ok
      ? ["replay_audit:reconstructed_reconciliation_failed"]
      : []),
  ];
  const replayLineage = [
    ...reconstructed.lineage,
    ...(options.reconstructLineage
      ? reconstructed.iterations.map((iteration): BurnInLineageNode => ({
          id: `replay:${iteration.index}`,
          type: "replay",
          iteration_index: iteration.index,
          parent_ids: [`iteration:${iteration.index}`],
          status: "replayed",
          injected_failure: iteration.injected_failure,
        }))
      : []),
  ].sort((a, b) => a.iteration_index - b.iteration_index || a.id.localeCompare(b.id));
  const failures = [...reconstructed.blocking_failures, ...drift, ...detectReplayLineageFailures(replayLineage)];
  return {
    ...reconstructed,
    ok: reconstructed.ok && failures.length === 0,
    options: { ...options, iterations: reconstructed.options.iterations, concurrency: reconstructed.options.concurrency },
    lineage: replayLineage,
    replay_audit: buildReplayAudit("replay", reconstructed.iterations, replayLineage, failures),
    blocking_failures: [...new Set(failures)].sort(),
  };
}

function summaryWithoutReplayHashes(summary: BurnInSummary) {
  const { deterministic_replay_hash: _a, lineage_hash: _b, ...audit } = summary.replay_audit;
  return { ...summary, replay_audit: audit };
}

function corruptReplaySummary(options: BurnInOptions, failures: string[]): BurnInSummary {
  const lineage: BurnInLineageNode[] = [];
  return {
    ok: false,
    dry_run: true,
    options,
    metrics: {
      iterations_attempted: 0,
      iterations_succeeded: 0,
      retries_triggered: 0,
      duplicate_submits_suppressed: 0,
      persistence_failures_recovered: 0,
      stale_cache_recoveries: 0,
      partial_result_recoveries: 0,
      timeout_fallback_count: 0,
      p50_persistence_latency_ms: 0,
      p95_persistence_latency_ms: 0,
      azure_attempted: 0,
      azure_passed: 0,
      azure_failed: 0,
      azure_skipped: 0,
      cleanup_verified: 0,
      retry_reconciliations: 0,
      partial_result_reconciliations: 0,
      reconciliation_failures: failures.length,
    },
    iterations: [],
    lineage,
    replay_audit: buildReplayAudit("replay", [], lineage, failures),
    skipped_validations: [],
    blocking_failures: failures,
  };
}

function formatSummary(summary: BurnInSummary): string {
  return JSON.stringify({
    ok: summary.ok,
    dry_run: summary.dry_run,
    metrics: summary.metrics,
    replay_audit: summary.replay_audit,
    skipped_validations: summary.skipped_validations,
    blocking_failures: summary.blocking_failures,
  }, null, 2);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const options = parseBurnInArgs(process.argv.slice(2));
  runPlacementV3BurnIn(options)
    .then((summary) => {
      console.log(options.json ? JSON.stringify(summary, null, 2) : formatSummary(summary));
      if (!summary.ok) process.exitCode = 1;
    })
    .catch((err) => {
      console.error(err instanceof Error ? err.message : String(err));
      process.exitCode = 1;
    });
}
