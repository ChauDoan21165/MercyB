import process from "node:process";
import { pathToFileURL } from "node:url";

import {
  assertCleanupNamespace,
  resolveLiveCheckConfig,
  runPlacementV3SupabaseLiveCheck,
  type LiveCheckInject,
  type LiveCheckResult,
} from "./supabase-live-check.ts";

type Args = {
  iterations: number;
  concurrency: number;
  cleanup: boolean;
  json: boolean;
  dryRun: boolean;
  printLiveCommand: boolean;
  inject: LiveCheckInject[];
};

export type BurnInSummary = {
  ok: boolean;
  iterationsAttempted: number;
  iterationsSucceeded: number;
  iterationsFailed: number;
  concurrentWorkers: number;
  sessionsCreated: number;
  responsesPersisted: number;
  duplicateSubmitsSuppressed: number;
  retryRecoveries: number;
  fallbackMetadataRecoveries: number;
  staleSessionsCleaned: number;
  resultReloadRetries: number;
  cleanupRowsRemoved: number;
  p50PersistenceLatencyMs: number;
  p95PersistenceLatencyMs: number;
  skippedLiveSegments: string[];
  blockingFailures: string[];
};

export async function runBurnIn(args: Args, env = process.env): Promise<BurnInSummary> {
  if (args.cleanup) assertCleanupNamespace(env.PLACEMENT_V3_SUPABASE_VALIDATION_EMAIL ?? "placement-v3-test-validation@mercyblade.test");
  const results: LiveCheckResult[] = [];
  const failures: string[] = [];
  let next = 0;
  const workers = Array.from({ length: Math.max(1, args.concurrency) }, async (_, worker) => {
    while (next < args.iterations) {
      const index = next;
      next += 1;
      try {
        const config = resolveLiveCheckConfig(env, {
          dryRun: args.dryRun,
          cleanup: args.cleanup,
          inject: args.inject,
          runId: `placement-v3-burnin-w${worker}-i${index}-${Date.now()}`,
        });
        results.push(await runPlacementV3SupabaseLiveCheck(config));
      } catch (err) {
        failures.push(`iteration ${index}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  });
  await Promise.all(workers);

  const blockingFailures = [
    ...failures,
    ...results.flatMap((result) => result.blockingFailures.map((failure) => `${result.runId}: ${failure}`)),
  ];
  const latencies = results.flatMap((result) => result.persistenceLatencyMs).sort((a, b) => a - b);
  const skippedLiveSegments = [...new Set(results.flatMap((result) => result.skippedLiveSegments))];
  const succeeded = results.filter((result) => result.ok).length;
  const failed = args.iterations - succeeded;
  return {
    ok: failed === 0 && blockingFailures.length === 0,
    iterationsAttempted: args.iterations,
    iterationsSucceeded: succeeded,
    iterationsFailed: failed,
    concurrentWorkers: Math.max(1, args.concurrency),
    sessionsCreated: results.filter((result) => result.sessionCreated).length,
    responsesPersisted: sum(results, "responsesPersisted"),
    duplicateSubmitsSuppressed: sum(results, "duplicateSubmitsSuppressed"),
    retryRecoveries: sum(results, "retryRecoveries"),
    fallbackMetadataRecoveries: sum(results, "fallbackMetadataRecoveries"),
    staleSessionsCleaned: sum(results, "staleSessionsCleaned"),
    resultReloadRetries: sum(results, "resultReloadRetries"),
    cleanupRowsRemoved: sum(results, "cleanupRowsRemoved"),
    p50PersistenceLatencyMs: percentile(latencies, 0.5),
    p95PersistenceLatencyMs: percentile(latencies, 0.95),
    skippedLiveSegments,
    blockingFailures,
  };
}

export function parseBurnInArgs(argv: string[]): Args {
  const args: Args = { iterations: 1, concurrency: 1, cleanup: false, json: false, dryRun: false, printLiveCommand: false, inject: [] };
  for (const raw of argv.slice(2)) {
    if (raw.startsWith("--iterations=")) args.iterations = positiveInt(raw, "--iterations=");
    else if (raw.startsWith("--concurrency=")) args.concurrency = positiveInt(raw, "--concurrency=");
    else if (raw === "--cleanup") args.cleanup = true;
    else if (raw === "--json") args.json = true;
    else if (raw === "--dry-run") args.dryRun = true;
    else if (raw === "--print-live-command") args.printLiveCommand = true;
    else if (raw.startsWith("--inject=")) args.inject = parseInject(raw.slice("--inject=".length));
    else throw new Error(`Unknown argument: ${raw}`);
  }
  return args;
}

function parseInject(raw: string): LiveCheckInject[] {
  if (!raw.trim()) return [];
  return raw.split(",").map((item) => {
    const value = item.trim() as LiveCheckInject;
    if (![
      "duplicate-submit",
      "partial-response",
      "stale-session",
      "status-retry",
      "result-reload",
      "transient-db-error",
      "missing-provider-metadata",
      "partial-fallback-metadata",
    ].includes(value)) {
      throw new Error(`Unsupported injection: ${item}`);
    }
    return value;
  });
}

function positiveInt(raw: string, prefix: string): number {
  const n = Number.parseInt(raw.slice(prefix.length), 10);
  if (!Number.isFinite(n) || n < 1) throw new Error(`${prefix.slice(2, -1)} must be >= 1`);
  return n;
}

function sum<K extends keyof LiveCheckResult>(results: LiveCheckResult[], key: K): number {
  return results.reduce((total, result) => total + Number(result[key] ?? 0), 0);
}

function percentile(values: number[], p: number): number {
  if (!values.length) return 0;
  const index = Math.min(values.length - 1, Math.max(0, Math.ceil(values.length * p) - 1));
  return values[index];
}

function printSummary(summary: BurnInSummary, json: boolean) {
  if (json) {
    console.log(JSON.stringify(summary));
    return;
  }
  console.log(`Placement V3 Supabase burn-in: ${summary.iterationsSucceeded}/${summary.iterationsAttempted} succeeded`);
  console.log(`responses=${summary.responsesPersisted} duplicate_suppressed=${summary.duplicateSubmitsSuppressed} retry_recoveries=${summary.retryRecoveries}`);
  console.log(`fallback_metadata_recoveries=${summary.fallbackMetadataRecoveries} stale_cleaned=${summary.staleSessionsCleaned} result_reload_retries=${summary.resultReloadRetries}`);
  console.log(`p50=${summary.p50PersistenceLatencyMs}ms p95=${summary.p95PersistenceLatencyMs}ms cleanup_rows=${summary.cleanupRowsRemoved}`);
  if (summary.blockingFailures.length) {
    console.log("blocking_failures:");
    for (const failure of summary.blockingFailures) console.log(`- ${failure}`);
  }
}

async function main() {
  try {
    const args = parseBurnInArgs(process.argv);
    if (args.printLiveCommand) {
      console.log([
        "PLACEMENT_V3_SUPABASE_LIVE_CHECK=1",
        "PLACEMENT_V3_SUPABASE_VALIDATION_ENV=validation",
        "SUPABASE_URL=https://placement-validation.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY=...",
        "npm run placement:v3:supabase:burnin -- --iterations=10 --concurrency=2 --cleanup --json",
      ].join(" \\\n"));
      process.exit(0);
    }
    const summary = await runBurnIn(args);
    printSummary(summary, args.json);
    process.exit(summary.ok ? 0 : 1);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[placement:v3:supabase:burnin] ${message}`);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main();
}
