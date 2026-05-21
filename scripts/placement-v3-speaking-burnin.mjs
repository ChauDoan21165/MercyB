#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import {
  DEFAULT_FIXTURE,
  runLiveCheck,
  validateLiveCheckEnvironment,
} from "./placement-v3-speaking-live-check.mjs";

const __filename = fileURLToPath(import.meta.url);

const FAILURE_CLASSIFICATION_ORDER = [
  "timeout",
  "malformed_payload",
  "transient_network",
  "partial_metadata",
  "duplicate_delivery",
  "skipped_azure_validation",
  "concurrency_corruption",
  "retry_reconciliation_failure",
  "aggregation_drift",
  "duplicate_suppression_mismatch",
];

export function parseBurninArgs(argv) {
  const options = {
    iterations: 5,
    concurrency: 1,
    simulateTimeoutRate: 0,
    simulateMalformedRate: 0,
    dryRun: false,
    json: false,
    fixture: DEFAULT_FIXTURE,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const [rawKey, rawValue] = argv[i].split("=");
    const value = rawValue ?? argv[i + 1];
    const key = rawKey.replace(/^--/, "");
    if (rawValue === undefined && argv[i].startsWith("--") && argv[i + 1] && !argv[i + 1].startsWith("--")) i += 1;
    if (key === "iterations") options.iterations = Math.max(1, Number(value));
    else if (key === "concurrency") options.concurrency = Math.max(1, Number(value));
    else if (key === "simulate-timeout-rate") options.simulateTimeoutRate = clampRate(Number(value));
    else if (key === "simulate-malformed-rate") options.simulateMalformedRate = clampRate(Number(value));
    else if (key === "dry-run") options.dryRun = true;
    else if (key === "json") options.json = true;
    else if (key === "fixture") options.fixture = value || DEFAULT_FIXTURE;
  }
  return options;
}

function clampRate(value) {
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}

function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[index];
}

function orderedCountMap(keys, entries) {
  const counts = Object.fromEntries(keys.map((key) => [key, 0]));
  for (const entry of entries) {
    if (Object.hasOwn(counts, entry)) counts[entry] += 1;
  }
  return counts;
}

function scenarioForIteration(index, options) {
  if (options.dryRun) {
    if (options.simulateTimeoutRate > 0 || options.simulateMalformedRate > 0) {
      const bucket = ((index * 37) % 100) / 100;
      if (bucket < options.simulateTimeoutRate) return "timeout";
      if (bucket < options.simulateTimeoutRate + options.simulateMalformedRate) return "malformed";
      return "success";
    }
    const dryRunScenarios = ["success", "timeout", "malformed", "network", "duplicate", "partial_metadata"];
    return dryRunScenarios[index % dryRunScenarios.length];
  }
  const bucket = ((index * 37) % 100) / 100;
  if (bucket < options.simulateTimeoutRate) return "timeout";
  if (bucket < options.simulateTimeoutRate + options.simulateMalformedRate) return "malformed";
  return "live";
}

function successfulAzureBody(partial = false) {
  const best = {
    PronScore: 84,
    AccuracyScore: 86,
    FluencyScore: 81,
    CompletenessScore: 91,
    Words: [
      {
        Word: "pronunciation",
        AccuracyScore: 76,
        Phonemes: [{ Phoneme: "n", AccuracyScore: 74 }],
      },
    ],
  };
  if (partial) delete best.FluencyScore;
  return {
    RecognitionStatus: "Success",
    DisplayText: "I want to improve my pronunciation and speak clearly.",
    NBest: [best],
  };
}

export function createSimulatedProvider(scenario) {
  if (scenario === "timeout") {
    return async () => {
      const err = new Error("aborted");
      err.name = "AbortError";
      throw err;
    };
  }
  if (scenario === "malformed") {
    return async () => new Response(JSON.stringify({ bad: true }), { status: 200 });
  }
  if (scenario === "network") {
    return async () => {
      throw new Error("simulated transient network failure");
    };
  }
  if (scenario === "partial_metadata") {
    return async () => new Response(JSON.stringify(successfulAzureBody(true)), { status: 200 });
  }
  return async () => new Response(JSON.stringify(successfulAzureBody(false)), { status: 200 });
}

function deterministicDryRunLatency(index, scenario) {
  const base = {
    success: 34,
    timeout: 5,
    malformed: 17,
    network: 11,
    duplicate: 9,
    partial_metadata: 23,
    live: 31,
  }[scenario] ?? 13;
  return base + (index % 7);
}

function classifyResultFailure(result) {
  if (result.scenario === "duplicate") return "duplicate_delivery";
  if (result.errorCode === "timeout") return "timeout";
  if (String(result.errorCode ?? "").includes("malformed")) return "malformed_payload";
  if (result.errorCode === "network_error") return "transient_network";
  if (result.scenario === "partial_metadata") return "partial_metadata";
  return null;
}

function validateRunResult(result, seenRunIds) {
  const failures = [];
  if (typeof result.latencyMs !== "number" || !Number.isFinite(result.latencyMs) || result.latencyMs < 0) {
    failures.push("latency_invalid");
  }
  if (!result.persistedProviderMetadata || typeof result.persistedProviderMetadata !== "object") {
    failures.push("provider_metadata_missing");
  }
  if (result.persistedProviderMetadata && typeof result.persistedProviderMetadata === "object") {
    if (result.persistedProviderMetadata.provider !== "azure") failures.push("provider_metadata_provider_mismatch");
    if (result.persistedProviderMetadata.providerPath !== "placement-v3-speaking") {
      failures.push("provider_metadata_path_mismatch");
    }
    if (result.persistedProviderMetadata.fallback !== result.fallback) failures.push("provider_metadata_fallback_mismatch");
  }
  if (result.runId && seenRunIds.has(result.runId)) failures.push("duplicate_not_suppressed");
  if (result.fallback && result.errorCode === "timeout") {
    if (result.providerTimeout !== true) failures.push("timeout_provider_marker_missing");
    if (result.retryable !== true) failures.push("timeout_retryable_missing");
    if (result.recoverable !== true) failures.push("timeout_recoverable_missing");
  }
  return failures;
}

export function aggregateBurninResults(results, skippedValidations = []) {
  const seenRunIds = new Set();
  const accepted = [];
  const blockingFailures = [];
  const failureClassifications = [];
  let duplicateSuppressionCount = 0;
  for (const [index, result] of results.entries()) {
    if (!result) {
      blockingFailures.push({ runId: `missing-${index}`, failure: "concurrency_corruption" });
      failureClassifications.push("concurrency_corruption");
      continue;
    }
    const failures = validateRunResult(result, seenRunIds);
    if (result.runId && seenRunIds.has(result.runId)) {
      duplicateSuppressionCount += 1;
      failureClassifications.push("duplicate_delivery");
      continue;
    }
    const classification = classifyResultFailure(result);
    if (classification) failureClassifications.push(classification);
    if (result.runId) seenRunIds.add(result.runId);
    accepted.push(result);
    blockingFailures.push(...failures.map((failure) => ({ runId: result.runId, failure })));
  }
  const latencies = accepted.map((result) => result.latencyMs).filter((value) => typeof value === "number");
  const timeoutCount = accepted.filter((result) => result.errorCode === "timeout").length;
  const fallbackCount = accepted.filter((result) => result.fallback === true).length;
  const malformedPayloadCount = accepted.filter((result) => String(result.errorCode ?? "").includes("malformed")).length;
  const retryRecoveryCount = accepted.filter((result) => result.fallback && result.retryable && result.recoverable).length;
  const failureClassificationCounts = orderedCountMap(FAILURE_CLASSIFICATION_ORDER, [
    ...failureClassifications,
    ...skippedValidations.map((validation) =>
      validation === "live_provider_call" ? "skipped_azure_validation" : null
    ).filter(Boolean),
  ]);
  const integrityFailures = [];
  if (accepted.length + duplicateSuppressionCount !== results.length) integrityFailures.push("mismatched_iteration_totals");
  if (timeoutCount < 0 || fallbackCount < 0 || retryRecoveryCount < 0) integrityFailures.push("negative_counter");
  if (retryRecoveryCount > fallbackCount) integrityFailures.push("retry_count_exceeds_fallback_count");
  if (malformedPayloadCount > fallbackCount) integrityFailures.push("malformed_count_exceeds_fallback_count");
  if (latencies.length !== accepted.length) integrityFailures.push("latency_distribution_incomplete");
  if (duplicateSuppressionCount !== failureClassificationCounts.duplicate_delivery) {
    integrityFailures.push("duplicate_suppression_mismatch");
    failureClassificationCounts.duplicate_suppression_mismatch += 1;
  }
  blockingFailures.push(...integrityFailures.map((failure) => ({ runId: "aggregate", failure })));
  const summary = {
    mode: accepted.some((result) => result.mode === "dry_run") ? "dry_run" : "live_or_simulated",
    iterationsAttempted: results.length,
    iterationsAccepted: accepted.length,
    iterationsSucceeded: accepted.filter((result) => result.ok).length,
    timeoutCount,
    fallbackCount,
    malformedPayloadCount,
    retryRecoveryCount,
    duplicateSuppressionCount,
    failureClassificationCounts,
    p50LatencyMs: percentile(latencies, 50),
    p95LatencyMs: percentile(latencies, 95),
    skippedValidations,
    blockingFailures,
    providerMetadataShapeStable: accepted.every((result) =>
      result.persistedProviderMetadata?.provider === "azure" &&
      result.persistedProviderMetadata?.providerPath === "placement-v3-speaking"
    ),
    retryStateClean: accepted.every((result) =>
      result.ok ? result.persistedProviderMetadata?.fallback === false : result.persistedProviderMetadata?.fallback === true
    ),
    duplicateExecutionSuppressionStable: duplicateSuppressionCount >= 0,
  };
  return summary;
}

async function runWorker(queue, options, output) {
  while (queue.length) {
    const index = queue.shift();
    const scenario = scenarioForIteration(index, options);
    const runId = scenario === "duplicate" && index > 0 ? `burnin-${index - 1}` : `burnin-${index}`;
    const simulated = options.dryRun || scenario !== "live";
    const result = await runLiveCheck(
      { fixture: options.fixture, timeoutMs: scenario === "timeout" ? 5 : 15_000, runId },
      simulated
        ? {
            azureKey: "dry-run-key",
            fetchImpl: createSimulatedProvider(scenario),
          }
        : {},
    );
    output[index] = {
      ...result,
      latencyMs: options.dryRun ? deterministicDryRunLatency(index, scenario) : result.latencyMs,
      scenario,
      mode: options.dryRun ? "dry_run" : simulated ? "simulated_failure_injection" : "live",
    };
  }
}

export async function runBurnin(options) {
  const skippedValidations = [];
  if (!options.dryRun) {
    const guard = validateLiveCheckEnvironment();
    if (!guard.ok) {
      return {
        refused: true,
        exitCode: 2,
        errors: guard.errors,
      };
    }
  } else {
    skippedValidations.push("live_provider_call");
    skippedValidations.push("real_supabase_persistence");
  }

  const queue = Array.from({ length: options.iterations }, (_, index) => index);
  const output = new Array(options.iterations);
  const workers = Array.from(
    { length: Math.min(options.concurrency, options.iterations) },
    () => runWorker(queue, options, output),
  );
  await Promise.all(workers);
  return aggregateBurninResults(output, skippedValidations);
}

function printHuman(summary) {
  console.log(`iterations attempted: ${summary.iterationsAttempted}`);
  console.log(`iterations succeeded: ${summary.iterationsSucceeded}`);
  console.log(`timeout count: ${summary.timeoutCount}`);
  console.log(`fallback count: ${summary.fallbackCount}`);
  console.log(`malformed payload count: ${summary.malformedPayloadCount}`);
  console.log(`retry recovery count: ${summary.retryRecoveryCount}`);
  console.log(`duplicate suppression count: ${summary.duplicateSuppressionCount}`);
  console.log(`failure classifications: ${JSON.stringify(summary.failureClassificationCounts)}`);
  console.log(`p50 latency ms: ${summary.p50LatencyMs}`);
  console.log(`p95 latency ms: ${summary.p95LatencyMs}`);
  console.log(`skipped validations: ${summary.skippedValidations.join(", ") || "none"}`);
  console.log(`blocking failures: ${summary.blockingFailures.length}`);
}

async function main() {
  const options = parseBurninArgs(process.argv.slice(2));
  const summary = await runBurnin(options);
  if (summary.refused) {
    console.error("[placement:v3:speaking:burnin] refused");
    for (const error of summary.errors) console.error(`- ${error}`);
    process.exitCode = summary.exitCode;
    return;
  }
  if (options.json) console.log(JSON.stringify(summary, null, 2));
  else printHuman(summary);
  if (summary.blockingFailures.length) process.exitCode = 1;
}

if (process.argv[1] === __filename) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  });
}
