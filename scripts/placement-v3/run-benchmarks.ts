import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

import { aggregateBenchmarkRuns } from "../../src/lib/placementBenchmark/aggregateMetrics.js";
import { estimateAzurePronunciationCostUsd, estimateTokenCostUsd } from "../../src/lib/placementBenchmark/costEstimator.js";
import { findWorstLatencySteps, latencyByModality } from "../../src/lib/placementBenchmark/latencyAnalyzer.js";
import { analyzeProviderUsage } from "../../src/lib/placementBenchmark/providerAnalysis.js";
import type {
  BenchmarkProvider,
  BenchmarkRunMetric,
  BenchmarkStatus,
  BenchmarkStepMetric,
} from "../../src/lib/placementBenchmark/types.js";
import {
  placementBenchmarkScenarios,
  type PlacementBenchmarkScenario,
  type PlacementBenchmarkStep,
} from "./scenarios/index.js";

type RunnerMode = "live" | "dry-run";

interface RunnerConfig {
  mode: RunnerMode;
  runCount: number;
  scenarioFilter: Set<string> | null;
  outDir: string;
  supabaseUrl: string;
  anonKey: string;
  serviceRoleKey: string;
  jwt: string;
  persist: boolean;
}

interface RawStepEvidence {
  runId: string;
  scenarioId: string;
  stepId: string;
  request: Record<string, unknown>;
  response: unknown;
}

const DEFAULT_OUT_DIR = "docs/placement-v3/benchmarking/raw-runs";

async function main() {
  const config = readConfig();
  await fs.mkdir(config.outDir, { recursive: true });

  const suiteId = `placement-v3-${new Date().toISOString().replace(/[:.]/g, "-")}`;
  const selected = placementBenchmarkScenarios.filter((scenario) =>
    config.scenarioFilter ? config.scenarioFilter.has(scenario.id) : true,
  );
  if (selected.length === 0) {
    throw new Error("No benchmark scenarios selected.");
  }

  const runs: BenchmarkRunMetric[] = [];
  const evidence: RawStepEvidence[] = [];
  const startedAt = new Date().toISOString();

  console.log(`[placement-benchmark] suite=${suiteId} mode=${config.mode} scenarios=${selected.length} runCount=${config.runCount}`);

  for (let iteration = 0; iteration < config.runCount; iteration += 1) {
    for (const scenario of selected) {
      const run = await runScenario({ suiteId, scenario, config, evidence });
      runs.push(run);
      await writePartial(config.outDir, suiteId, runs, evidence);
      if (config.persist) {
        await persistRun(config, run);
      }
      console.log(
        `[placement-benchmark] run=${run.runId} scenario=${scenario.id} status=${run.status} durationMs=${run.totalDurationMs} costUsd=${run.estimatedCostUsd}`,
      );
    }
  }

  const summary = buildSummary({ suiteId, startedAt, completedAt: new Date().toISOString(), runs });
  const summaryPath = path.join(config.outDir, `${suiteId}.summary.json`);
  await fs.writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`[placement-benchmark] wrote ${summaryPath}`);
}

async function runScenario(args: {
  suiteId: string;
  scenario: PlacementBenchmarkScenario;
  config: RunnerConfig;
  evidence: RawStepEvidence[];
}): Promise<BenchmarkRunMetric> {
  const runId = `${args.scenario.id}-${crypto.randomUUID()}`;
  const started = Date.now();
  const startedAt = new Date(started).toISOString();
  const steps: BenchmarkStepMetric[] = [];

  for (const step of args.scenario.steps) {
    const metric = await runStep({
      runId,
      scenario: args.scenario,
      step,
      config: args.config,
      evidence: args.evidence,
    });
    steps.push(metric);
  }

  const completed = Date.now();
  const status: BenchmarkStatus = steps.some((step) => step.status === "error" || step.status === "timeout")
    ? "error"
    : "success";
  return {
    runId,
    suiteId: args.suiteId,
    scenarioId: args.scenario.id,
    startedAt,
    completedAt: new Date(completed).toISOString(),
    status,
    totalDurationMs: completed - started,
    totalTokensInput: steps.reduce((sum, step) => sum + step.tokensInput, 0),
    totalTokensOutput: steps.reduce((sum, step) => sum + step.tokensOutput, 0),
    estimatedCostUsd: Number(steps.reduce((sum, step) => sum + step.estimatedCostUsd, 0).toFixed(6)),
    steps,
  };
}

async function runStep(args: {
  runId: string;
  scenario: PlacementBenchmarkScenario;
  step: PlacementBenchmarkStep;
  config: RunnerConfig;
  evidence: RawStepEvidence[];
}): Promise<BenchmarkStepMetric> {
  const started = Date.now();
  const startedAt = new Date(started).toISOString();
  let responseBody: unknown = null;
  let status: BenchmarkStatus = "success";
  let provider: BenchmarkProvider = "none";
  let model = "";
  let tokensInput = 0;
  let tokensOutput = 0;
  let attempts: BenchmarkProvider[] = [];
  let traceLatencyMs: number | null = null;
  let errorCode: string | null = null;
  let errorMessage: string | null = null;
  let cefrEstimate: string | null = null;

  try {
    responseBody = args.config.mode === "dry-run"
      ? dryRunResponse(args.step)
      : await callLiveStep(args.config, args.step);
    const trace = extractTrace(responseBody);
    provider = trace.provider;
    model = trace.model;
    tokensInput = trace.tokensInput;
    tokensOutput = trace.tokensOutput;
    attempts = trace.attempts;
    traceLatencyMs = trace.latencyMs;
    cefrEstimate = trace.cefrEstimate;
    if (!trace.ok) {
      status = "error";
      errorCode = trace.errorCode;
      errorMessage = trace.errorMessage;
    }
  } catch (err) {
    status = err instanceof Error && err.name === "AbortError" ? "timeout" : "error";
    errorCode = status;
    errorMessage = err instanceof Error ? err.message : String(err);
  }

  const completed = args.config.mode === "dry-run" && traceLatencyMs !== null
    ? started + traceLatencyMs
    : Date.now();
  const durationMs = completed - started;
  const estimatedCostUsd = args.step.modality === "azure-phoneme"
    ? estimateAzurePronunciationCostUsd(Number(args.step.payload.audioSeconds ?? 0))
    : estimateTokenCostUsd({ provider, model, tokensInput, tokensOutput });
  const metric: BenchmarkStepMetric = {
    runId: args.runId,
    scenarioId: args.scenario.id,
    stepId: args.step.id,
    modality: args.step.modality === "azure-phoneme" ? "azure-phoneme" : args.step.modality,
    provider,
    model,
    startedAt,
    completedAt: new Date(completed).toISOString(),
    durationMs,
    status,
    tokensInput,
    tokensOutput,
    estimatedCostUsd,
    attempts,
    failover: attempts.length > 1 || provider === "gemini",
    errorCode,
    errorMessage,
    cefrEstimate,
  };

  args.evidence.push({
    runId: args.runId,
    scenarioId: args.scenario.id,
    stepId: args.step.id,
    request: sanitize(args.step.payload),
    response: sanitize(responseBody),
  });
  return metric;
}

async function callLiveStep(config: RunnerConfig, step: PlacementBenchmarkStep): Promise<unknown> {
  const functionName = functionForModality(step.modality);
  const url = `${config.supabaseUrl.replace(/\/$/, "")}/functions/v1/${functionName}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: config.anonKey,
  };
  const bearer = config.jwt || config.serviceRoleKey;
  if (bearer) headers.Authorization = `Bearer ${bearer}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), step.timeoutMs);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(step.payload),
      signal: controller.signal,
    });
    const text = await response.text();
    const json = safeJson(text);
    if (!response.ok) {
      return {
        ok: false,
        errorCode: `http_${response.status}`,
        errorMessage: text.slice(0, 500),
        response: json ?? text,
      };
    }
    return json ?? text;
  } finally {
    clearTimeout(timeout);
  }
}

function functionForModality(modality: PlacementBenchmarkStep["modality"]): string {
  switch (modality) {
    case "reading":
      return "placement-v3-grade-reading";
    case "listening":
      return "placement-v3-grade-listening";
    case "speaking":
      return "placement-v3-grade-speaking";
    case "azure-phoneme":
      return "azure-phoneme";
    case "mercy":
      return "mercy-guide";
    case "writing":
      return "placement-v3-grade-writing";
  }
}

function dryRunResponse(step: PlacementBenchmarkStep) {
  const provider: BenchmarkProvider = step.payload.forceOpenAiFailure ? "gemini" : "openai";
  const tokensInput = estimateTextTokens(JSON.stringify(step.payload));
  const tokensOutput = 190;
  return {
    ok: true,
    assessment: {
      overall_cefr: step.expectedCefr,
      confidence: 0.82,
    },
    modelTrace: {
      provider,
      model: provider === "gemini" ? "gemini-2.5-flash" : "gpt-4o-mini",
      latencyMs: 1200 + tokensInput * 3,
      tokensInput,
      tokensOutput,
      attempts: provider === "gemini" ? ["openai", "gemini"] : [provider],
    },
  };
}

function extractTrace(body: unknown): {
  ok: boolean;
  provider: BenchmarkProvider;
  model: string;
  tokensInput: number;
  tokensOutput: number;
  attempts: BenchmarkProvider[];
  latencyMs: number | null;
  cefrEstimate: string | null;
  errorCode: string | null;
  errorMessage: string | null;
} {
  const record = isRecord(body) ? body : {};
  const trace = isRecord(record.modelTrace) ? record.modelTrace : {};
  const assessment = isRecord(record.assessment) ? record.assessment : {};
  const provider = normalizeProvider(trace.provider ?? record.provider);
  const attemptsRaw = Array.isArray(trace.attempts) ? trace.attempts : provider !== "none" ? [provider] : [];
  return {
    ok: record.ok !== false,
    provider,
    model: typeof trace.model === "string" ? trace.model : "",
    tokensInput: Number(trace.tokensInput ?? 0),
    tokensOutput: Number(trace.tokensOutput ?? 0),
    attempts: attemptsRaw.map(normalizeProvider),
    latencyMs: typeof trace.latencyMs === "number" ? Math.max(0, Math.round(trace.latencyMs)) : null,
    cefrEstimate: typeof assessment.overall_cefr === "string" ? assessment.overall_cefr : null,
    errorCode: typeof record.errorCode === "string" ? record.errorCode : null,
    errorMessage: typeof record.errorMessage === "string" ? record.errorMessage : null,
  };
}

function buildSummary(args: {
  suiteId: string;
  startedAt: string;
  completedAt: string;
  runs: BenchmarkRunMetric[];
}) {
  const steps = args.runs.flatMap((run) => run.steps);
  return {
    suiteId: args.suiteId,
    startedAt: args.startedAt,
    completedAt: args.completedAt,
    runCount: args.runs.length,
    scenarioCount: new Set(args.runs.map((run) => run.scenarioId)).size,
    metrics: aggregateBenchmarkRuns(args.runs),
    provider: analyzeProviderUsage(steps),
    latencyByModality: latencyByModality(steps),
    worstSteps: findWorstLatencySteps(steps, 12),
    runs: args.runs,
  };
}

async function writePartial(
  outDir: string,
  suiteId: string,
  runs: BenchmarkRunMetric[],
  evidence: RawStepEvidence[],
) {
  await fs.writeFile(
    path.join(outDir, `${suiteId}.partial.json`),
    `${JSON.stringify({ suiteId, updatedAt: new Date().toISOString(), runs, evidence }, null, 2)}\n`,
  );
}

async function persistRun(config: RunnerConfig, run: BenchmarkRunMetric) {
  if (!config.serviceRoleKey) return;
  const client = createClient(config.supabaseUrl, config.serviceRoleKey, {
    auth: { persistSession: false },
  });
  const { error: runError } = await client.from("placement_v3_benchmark_runs").upsert({
    id: run.runId,
    suite_id: run.suiteId,
    scenario_id: run.scenarioId,
    started_at: run.startedAt,
    completed_at: run.completedAt,
    status: run.status,
    total_duration_ms: run.totalDurationMs,
    total_tokens_input: run.totalTokensInput,
    total_tokens_output: run.totalTokensOutput,
    estimated_cost_usd: run.estimatedCostUsd,
    metadata: { source: "scripts/placement-v3/run-benchmarks.ts" },
  });
  if (runError) throw new Error(`benchmark run persist failed: ${runError.message}`);

  const { error: stepError } = await client.from("placement_v3_benchmark_steps").upsert(
    run.steps.map((step) => ({
      id: `${step.runId}:${step.stepId}`,
      run_id: step.runId,
      scenario_id: step.scenarioId,
      step_id: step.stepId,
      modality: step.modality,
      provider: step.provider,
      model: step.model,
      started_at: step.startedAt,
      completed_at: step.completedAt,
      duration_ms: step.durationMs,
      status: step.status,
      tokens_input: step.tokensInput,
      tokens_output: step.tokensOutput,
      estimated_cost_usd: step.estimatedCostUsd,
      attempts: step.attempts,
      failover: step.failover,
      error_code: step.errorCode,
      error_message: step.errorMessage,
      cefr_estimate: step.cefrEstimate,
    })),
  );
  if (stepError) throw new Error(`benchmark step persist failed: ${stepError.message}`);

  await Promise.all([
    client.from("placement_v3_benchmark_provider_usage").delete().eq("run_id", run.runId),
    client.from("placement_v3_benchmark_failover_events").delete().eq("run_id", run.runId),
    client.from("placement_v3_benchmark_error_events").delete().eq("run_id", run.runId),
  ]);

  const providerRows = run.steps.map((step) => ({
    run_id: step.runId,
    step_row_id: `${step.runId}:${step.stepId}`,
    provider: step.provider,
    model: step.model,
    tokens_input: step.tokensInput,
    tokens_output: step.tokensOutput,
    estimated_cost_usd: step.estimatedCostUsd,
    latency_ms: step.durationMs,
  }));
  const { error: providerError } = await client
    .from("placement_v3_benchmark_provider_usage")
    .insert(providerRows);
  if (providerError) throw new Error(`benchmark provider persist failed: ${providerError.message}`);

  const failoverRows = run.steps
    .filter((step) => step.failover)
    .map((step) => ({
      run_id: step.runId,
      step_row_id: `${step.runId}:${step.stepId}`,
      scenario_id: step.scenarioId,
      step_id: step.stepId,
      from_provider: step.attempts[0] ?? null,
      to_provider: step.provider,
      attempts: step.attempts,
      recovered: step.status === "success",
      latency_ms: step.durationMs,
    }));
  if (failoverRows.length > 0) {
    const { error: failoverError } = await client
      .from("placement_v3_benchmark_failover_events")
      .insert(failoverRows);
    if (failoverError) throw new Error(`benchmark failover persist failed: ${failoverError.message}`);
  }

  const errorRows = run.steps
    .filter((step) => step.status !== "success")
    .map((step) => ({
      run_id: step.runId,
      step_row_id: `${step.runId}:${step.stepId}`,
      scenario_id: step.scenarioId,
      step_id: step.stepId,
      modality: step.modality,
      provider: step.provider,
      error_code: step.errorCode,
      error_message: step.errorMessage,
      latency_ms: step.durationMs,
    }));
  if (errorRows.length > 0) {
    const { error: errorEventError } = await client
      .from("placement_v3_benchmark_error_events")
      .insert(errorRows);
    if (errorEventError) throw new Error(`benchmark error persist failed: ${errorEventError.message}`);
  }
}

function readConfig(): RunnerConfig {
  const args = new Map<string, string>();
  for (const arg of process.argv.slice(2)) {
    const [key, value = "true"] = arg.replace(/^--/, "").split("=");
    args.set(key, value);
  }
  const mode = (args.get("mode") ?? process.env.PLACEMENT_BENCHMARK_MODE ?? "live") as RunnerMode;
  const supabaseUrl = process.env.PLACEMENT_BENCHMARK_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  const anonKey = process.env.PLACEMENT_BENCHMARK_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";
  const serviceRoleKey = process.env.PLACEMENT_BENCHMARK_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const jwt = process.env.PLACEMENT_BENCHMARK_JWT ?? "";
  if (mode === "live" && (!supabaseUrl || !anonKey)) {
    throw new Error(
      "Live benchmarks require PLACEMENT_BENCHMARK_SUPABASE_URL and PLACEMENT_BENCHMARK_ANON_KEY. Use --mode=dry-run for local harness validation.",
    );
  }
  const scenarioArg = args.get("scenario") ?? "";
  return {
    mode,
    runCount: Number(args.get("runs") ?? process.env.PLACEMENT_BENCHMARK_RUNS ?? 1),
    scenarioFilter: scenarioArg ? new Set(scenarioArg.split(",").map((s) => s.trim())) : null,
    outDir: args.get("outDir") ?? DEFAULT_OUT_DIR,
    supabaseUrl,
    anonKey,
    serviceRoleKey,
    jwt,
    persist: args.get("persist") === "true" || process.env.PLACEMENT_BENCHMARK_PERSIST === "1",
  };
}

function normalizeProvider(value: unknown): BenchmarkProvider {
  if (value === "openai" || value === "gemini" || value === "azure" || value === "local") return value;
  return "none";
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function sanitize<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (key, nested) => {
      if (/token|key|authorization|apikey|audio/i.test(key)) return "[redacted]";
      return nested;
    }),
  ) as T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function estimateTextTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

main().catch((err) => {
  console.error("[placement-benchmark] failed", err);
  process.exit(1);
});
