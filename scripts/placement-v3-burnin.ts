#!/usr/bin/env tsx
import { randomUUID } from "node:crypto";
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
  | "interrupted-retry-flow"
  | "delayed-result-reload"
  | "simulated-supabase-transient-error";

export type BurnInOptions = {
  iterations: number;
  concurrency: number;
  cleanup: boolean;
  json: boolean;
  skipSpeaking: boolean;
  dryRun: boolean;
  injectFailure: FailureInjectionMode | null;
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
  skipped_validations: string[];
  blocking_failures: string[];
  injected_failure: FailureInjectionMode | null;
  recovered_from_injection: boolean;
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
  };
  iterations: BurnInIteration[];
  skipped_validations: string[];
  blocking_failures: string[];
};

const FAILURE_MODES = new Set<FailureInjectionMode>([
  "transient-persistence-failure",
  "delayed-persistence-write",
  "duplicate-submit-delivery",
  "stale-cached-session-state",
  "partial-result",
  "partial-persisted-result-state",
  "interrupted-retry-flow",
  "delayed-result-reload",
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
  const injectFailure = rawInject && FAILURE_MODES.has(rawInject as FailureInjectionMode)
    ? rawInject as FailureInjectionMode
    : null;
  return {
    iterations: getNumber("--iterations=", 3),
    concurrency: getNumber("--concurrency=", 1),
    cleanup: argv.includes("--cleanup"),
    json: argv.includes("--json"),
    skipSpeaking: argv.includes("--skip-speaking"),
    dryRun: argv.includes("--dry-run"),
    injectFailure,
  };
}

export async function runPlacementV3BurnIn(
  options: BurnInOptions,
  env: Env = process.env,
): Promise<BurnInSummary> {
  const concurrency = Math.max(1, Math.min(options.concurrency, options.iterations));
  const results: BurnInIteration[] = [];
  let nextIndex = 0;

  async function worker() {
    for (;;) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= options.iterations) return;
      results[index] = await runIteration(index, options, env);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return aggregateBurnIn(options, results);
}

async function runIteration(index: number, options: BurnInOptions, env: Env): Promise<BurnInIteration> {
  const learnerEmail = `placement-v3-test-${randomUUID()}@mercyblade.test`;
  const started = performance.now();
  const injected = options.injectFailure;
  if (injected === "delayed-persistence-write" || injected === "delayed-result-reload") {
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
    const latencyMs = Math.round(performance.now() - started);
    return iterationFromLiveSummary(index, learnerEmail, summary, latencyMs, injected);
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
): BurnInIteration {
  const recoveredFromInjection = Boolean(injected) && summary.ok
    && (summary.persistence_verification.result_retrieval || summary.dry_run)
    && (summary.retry_idempotency.duplicate_short_circuited || summary.dry_run || injected !== "duplicate-submit-delivery")
    && (summary.provider_metadata.timeout_fallback_persisted || summary.dry_run || !isPartialResultInjection(injected));
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
    skipped_validations: summary.skipped_validations,
    blocking_failures: summary.blocking_failures,
    injected_failure: injected,
    recovered_from_injection: recoveredFromInjection,
  };
}

export function aggregateBurnIn(options: BurnInOptions, iterations: BurnInIteration[]): BurnInSummary {
  const sorted = [...iterations].sort((a, b) => a.index - b.index);
  const latencies = sorted.map((iteration) => iteration.latency_ms).sort((a, b) => a - b);
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
  const blockingFailures = [
    ...failures,
    ...detectConsistencyFailures(sorted, options),
  ];

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
    },
    iterations: sorted,
    skipped_validations: [...new Set(skipped)].sort(),
    blocking_failures: [...new Set(blockingFailures)].sort(),
  };
}

function isPartialResultInjection(mode: FailureInjectionMode | null): boolean {
  return mode === "partial-result" || mode === "partial-persisted-result-state";
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

function formatSummary(summary: BurnInSummary): string {
  return JSON.stringify({
    ok: summary.ok,
    dry_run: summary.dry_run,
    metrics: summary.metrics,
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
