import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

import { analyzeProviderVariance } from "../../src/lib/placementDrift/providerVariance.js";
import { analyzeScoreDeltas } from "../../src/lib/placementDrift/scoreDeltaAnalysis.js";
import { buildStabilityReport } from "../../src/lib/placementDrift/stabilityReport.js";
import type {
  CefrLevel,
  DriftModality,
  DriftProvider,
  DriftStatus,
  ReplayScore,
} from "../../src/lib/placementDrift/types.js";

interface ReplayFixture {
  id: string;
  modality: DriftModality;
  expectedCefr: CefrLevel;
  taxonomyTags: string[];
  payload: Record<string, unknown>;
}

interface ReplayConfig {
  batchId: string;
  fixturePath: string;
  outDir: string;
  supabaseUrl: string;
  anonKey: string;
  serviceRoleKey: string;
  jwt: string;
  persist: boolean;
  limit: number | null;
  resume: boolean;
  simulate: boolean;
}

interface RawEvidence {
  isoTimestamp: string;
  replayBatchId: string;
  runId: string;
  sampleId: string;
  provider: DriftProvider;
  model: string | null;
  latencyMs: number;
  tokenCount: { input: number; output: number };
  rawGraderOutput: unknown;
  parsedCefrResult: CefrLevel | null;
  request: Record<string, unknown>;
  simulated?: boolean;
}

const DEFAULT_FIXTURE =
  "docs/placement-v3/drift-detection/replay-fixtures/placement-v3-replay-samples.json";
const DEFAULT_OUT_DIR = "docs/placement-v3/drift-detection/raw-runs";
const DEFAULT_SIMULATED_OUT_DIR = "docs/placement-v3/drift-detection/simulated-runs";
const SIMULATED_MODEL = "local-drift-simulator-v1";

async function main() {
  const config = readConfig();
  const runId = `${config.batchId}-${new Date().toISOString().replace(/[:.]/g, "-")}`;
  const startedAt = new Date().toISOString();
  await fs.mkdir(config.outDir, { recursive: true });

  if (!config.simulate && (!config.supabaseUrl || !config.anonKey)) {
    await writeBlocker({
      command: process.argv.join(" "),
      error: "Missing SUPABASE_URL/PLACEMENT_REPLAY_SUPABASE_URL or SUPABASE_ANON_KEY/PLACEMENT_REPLAY_ANON_KEY.",
      completedStages: ["fixture_load_precheck"],
      unavailableMetrics: [
        "raw grader outputs",
        "provider variance",
        "taxonomy variance from live graders",
        "latency",
        "token counts",
      ],
    });
    throw new Error("Live replay requires Supabase URL and anon key. Refusing to fabricate replay outputs.");
  }

  const fixtures = (await loadFixtures(config.fixturePath)).slice(0, config.limit ?? undefined);
  if (fixtures.length < 40 && config.limit === null) {
    throw new Error(`Expected at least 40 replay fixtures, found ${fixtures.length}.`);
  }

  const scores: ReplayScore[] = [];
  const evidence: RawEvidence[] = [];
  const partialPath = path.join(config.outDir, `${config.batchId}.partial.json`);
  const completed = config.resume ? await readCompletedSamples(partialPath) : new Set<string>();

  console.log(
    `[placement-drift] run=${runId} batch=${config.batchId} samples=${fixtures.length} simulated=${config.simulate}`,
  );
  for (const fixture of fixtures) {
    if (completed.has(fixture.id)) {
      console.log(`[placement-drift] skip completed sample=${fixture.id}`);
      continue;
    }
    const result = await replaySample({ config, runId, batchId: config.batchId, fixture });
    scores.push(result.score);
    evidence.push(result.evidence);
    await writePartial(partialPath, { simulated: config.simulate, runId, batchId: config.batchId, startedAt, scores, evidence });
    console.log(
      `[placement-drift] sample=${fixture.id} modality=${fixture.modality} status=${result.score.status} provider=${result.score.provider} cefr=${result.score.parsedCefr ?? "null"} latencyMs=${result.score.latencyMs}`,
    );
  }

  const completedAt = new Date().toISOString();
  const baseline = config.simulate ? buildSimulatedBaselineScores(runId, config.batchId, fixtures, startedAt) : [];
  const report = buildStabilityReport({ baseline, current: scores });
  const deltas = analyzeScoreDeltas({ baseline, current: scores });
  const run = {
    id: runId,
    batchId: config.batchId,
    startedAt,
    completedAt,
    simulated: config.simulate,
    status: scores.some((score) => score.status === "error" || score.status === "timeout") ? "error" : "success",
    sampleCount: scores.length,
    successCount: scores.filter((score) => score.status === "success").length,
    malformedCount: scores.filter((score) => score.malformed).length,
    p95LatencyMs: report.replay.p95LatencyMs,
    providerSet: [...new Set(scores.map((score) => score.provider))],
    report,
  };

  const rawPath = path.join(config.outDir, `${runId}.json`);
  await fs.writeFile(
    rawPath,
    `${JSON.stringify({ simulated: config.simulate, generatedAt: completedAt, run, scores, evidence }, null, 2)}\n`,
  );
  await fs.writeFile(
    path.join(config.outDir, `${runId}.summary.json`),
    `${JSON.stringify({ simulated: config.simulate, generatedAt: completedAt, report }, null, 2)}\n`,
  );
  await fs.writeFile(
    path.join(config.outDir, `${runId}.drift-diff.json`),
    `${JSON.stringify({ simulated: config.simulate, generatedAt: completedAt, runId, deltas }, null, 2)}\n`,
  );
  await fs.writeFile(
    path.join(config.outDir, `${runId}.replay.log`),
    [
      `simulated=${config.simulate}`,
      `runId=${runId}`,
      `batchId=${config.batchId}`,
      `startedAt=${startedAt}`,
      `completedAt=${completedAt}`,
      `samples=${scores.length}`,
      `success=${run.successCount}`,
      `malformed=${run.malformedCount}`,
      `p95LatencyMs=${run.p95LatencyMs}`,
      "",
    ].join("\n"),
  );

  if (config.persist) {
    if (config.simulate) {
      await persistSimulatedReplay(config, run, scores, evidence, report, deltas);
    } else {
      await persistReplay(config, run, scores);
    }
  }

  if (config.simulate) {
    await persistSimulatedReplay(config, run, scores, evidence, report, deltas);
  }

  console.log(`[placement-drift] wrote ${rawPath}`);
}

async function replaySample(args: {
  config: ReplayConfig;
  runId: string;
  batchId: string;
  fixture: ReplayFixture;
}): Promise<{ score: ReplayScore; evidence: RawEvidence }> {
  const started = Date.now();
  const isoTimestamp = new Date(started).toISOString();
  let raw: unknown = null;
  let status: DriftStatus = "success";
  let errorCode: string | null = null;
  let errorMessage: string | null = null;

  try {
    raw = args.config.simulate
      ? simulateGraderOutput(args.fixture)
      : await callGrader(args.config, args.fixture);
  } catch (err) {
    status = err instanceof Error && err.name === "AbortError" ? "timeout" : "error";
    errorCode = status;
    errorMessage = err instanceof Error ? err.message : String(err);
  }

  const measuredLatencyMs = Date.now() - started;
  const trace = extractTrace(raw);
  const latencyMs = args.config.simulate && trace.latencyMs > 0 ? trace.latencyMs : measuredLatencyMs;
  const parsedCefr = trace.parsedCefr;
  const malformed = status === "success" && (!parsedCefr || !isRecord(raw) || raw.ok === false);
  if (malformed) status = "malformed";

  const score: ReplayScore = {
    runId: args.runId,
    batchId: args.batchId,
    sampleId: args.fixture.id,
    modality: args.fixture.modality,
    expectedCefr: args.fixture.expectedCefr,
    parsedCefr,
    provider: trace.provider,
    model: trace.model,
    retryPath: trace.retryPath,
    taxonomyTags: args.fixture.taxonomyTags,
    latencyMs,
    tokensInput: trace.tokensInput,
    tokensOutput: trace.tokensOutput,
    status,
    malformed,
    createdAt: isoTimestamp,
  };

  const evidence: RawEvidence = {
    isoTimestamp,
    replayBatchId: args.batchId,
    runId: args.runId,
    sampleId: args.fixture.id,
    provider: score.provider,
    model: score.model,
    latencyMs,
    tokenCount: { input: score.tokensInput, output: score.tokensOutput },
    rawGraderOutput: raw ?? { ok: false, errorCode, errorMessage },
    parsedCefrResult: parsedCefr,
    request: args.fixture.payload,
    simulated: args.config.simulate,
  };

  return { score, evidence };
}

function simulateGraderOutput(fixture: ReplayFixture): unknown {
  const hash = stableHash(fixture.id);
  const parsedLevel = simulatedCefr(fixture.expectedCefr, hash);
  const malformed = hash % 17 === 0;
  const latencyMs = 180 + (hash % 1_400);
  const tokensInput = 260 + (JSON.stringify(fixture.payload).length % 220);
  const tokensOutput = 90 + (hash % 180);
  return {
    ok: !malformed,
    simulated: true,
    simulationMode: "deterministic-local-replay",
    assessment: malformed
      ? null
      : {
          overall: {
            level: parsedLevel,
            confidence: Number((0.66 + (hash % 23) / 100).toFixed(2)),
          },
        },
    modelTrace: {
      provider: "none",
      model: SIMULATED_MODEL,
      attempts: ["none"],
      tokensInput,
      tokensOutput,
      latencyMs,
      simulated: true,
    },
    diagnostic: {
      expectedCefr: fixture.expectedCefr,
      taxonomyTags: fixture.taxonomyTags,
      deterministicSeed: hash,
      note: "Local deterministic simulation. Not provider output and not production drift evidence.",
    },
  };
}

function simulatedCefr(expected: CefrLevel, hash: number): CefrLevel {
  const levels: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const index = levels.indexOf(expected);
  if (hash % 13 === 0) return levels[Math.max(0, index - 1)];
  if (hash % 7 === 0) return levels[Math.min(levels.length - 1, index + 1)];
  return expected;
}

function stableHash(input: string): number {
  let hash = 2_166_136_261;
  for (const char of input) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16_777_619);
  }
  return hash >>> 0;
}

function buildSimulatedBaselineScores(
  runId: string,
  batchId: string,
  fixtures: ReplayFixture[],
  createdAt: string,
): ReplayScore[] {
  return fixtures.map((fixture) => ({
    runId: `${runId}:expected-baseline`,
    batchId: `${batchId}:expected-baseline`,
    sampleId: fixture.id,
    modality: fixture.modality,
    expectedCefr: fixture.expectedCefr,
    parsedCefr: fixture.expectedCefr,
    provider: "none",
    model: SIMULATED_MODEL,
    retryPath: ["none"],
    taxonomyTags: fixture.taxonomyTags,
    latencyMs: 0,
    tokensInput: 0,
    tokensOutput: 0,
    status: "success",
    malformed: false,
    createdAt,
  }));
}

async function callGrader(config: ReplayConfig, fixture: ReplayFixture): Promise<unknown> {
  const functionName = functionForModality(fixture.modality);
  const url = `${config.supabaseUrl.replace(/\/$/, "")}/functions/v1/${functionName}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: config.anonKey,
  };
  const bearer = config.jwt || config.serviceRoleKey;
  if (bearer) headers.Authorization = `Bearer ${bearer}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(fixture.payload),
      signal: controller.signal,
    });
    const text = await response.text();
    const json = safeJson(text);
    if (!response.ok) {
      return {
        ok: false,
        errorCode: `http_${response.status}`,
        errorMessage: text.slice(0, 1_000),
        response: json ?? text,
      };
    }
    return json ?? text;
  } finally {
    clearTimeout(timeout);
  }
}

function functionForModality(modality: DriftModality): string {
  switch (modality) {
    case "reading":
      return "placement-v3-grade-reading";
    case "listening":
      return "placement-v3-grade-listening";
    case "speaking":
      return "placement-v3-grade-speaking";
    case "writing":
      return "placement-v3-grade-writing";
  }
}

function extractTrace(body: unknown): {
  provider: DriftProvider;
  model: string | null;
  retryPath: string[];
  tokensInput: number;
  tokensOutput: number;
  latencyMs: number;
  parsedCefr: CefrLevel | null;
} {
  const record = isRecord(body) ? body : {};
  const trace = isRecord(record.modelTrace) ? record.modelTrace : {};
  const assessment = isRecord(record.assessment) ? record.assessment : {};
  const overall = isRecord(assessment.overall) ? assessment.overall : {};
  const provider = normalizeProvider(trace.provider);
  const retryPath = Array.isArray(trace.attempts)
    ? trace.attempts.map(normalizeProvider)
    : provider !== "unknown"
      ? [provider]
      : [];
  return {
    provider,
    model: typeof trace.model === "string" ? trace.model : null,
    retryPath,
    tokensInput: Number(trace.tokensInput ?? 0),
    tokensOutput: Number(trace.tokensOutput ?? 0),
    latencyMs: Number(trace.latencyMs ?? 0),
    parsedCefr: normalizeCefr(overall.level ?? assessment.overall_cefr),
  };
}

async function persistReplay(
  config: ReplayConfig,
  run: {
    id: string;
    batchId: string;
    startedAt: string;
    completedAt: string;
    simulated: boolean;
    status: string;
    sampleCount: number;
    successCount: number;
    malformedCount: number;
    p95LatencyMs: number;
    providerSet: DriftProvider[];
    report: ReturnType<typeof buildStabilityReport>;
  },
  scores: ReplayScore[],
) {
  if (!config.serviceRoleKey) {
    throw new Error("Persist requested but SUPABASE_SERVICE_ROLE_KEY/PLACEMENT_REPLAY_SERVICE_ROLE_KEY is missing.");
  }
  const client = createClient(config.supabaseUrl, config.serviceRoleKey, {
    auth: { persistSession: false },
  });
  const { error: runError } = await client.from("placement_v3_replay_runs").upsert({
    id: run.id,
    batch_id: run.batchId,
    fixture_version: "v1",
    started_at: run.startedAt,
    completed_at: run.completedAt,
    status: run.status,
    sample_count: run.sampleCount,
    success_count: run.successCount,
    malformed_count: run.malformedCount,
    p95_latency_ms: run.p95LatencyMs,
    provider_set: run.providerSet,
    metadata: { source: "scripts/placement-v3/run-grading-replay.ts", simulated: run.simulated },
  });
  if (runError) throw new Error(`replay run persist failed: ${runError.message}`);

  const { error: scoreError } = await client.from("placement_v3_replay_scores").upsert(
    scores.map((score) => ({
      id: `${score.runId}:${score.sampleId}`,
      run_id: score.runId,
      batch_id: score.batchId,
      sample_id: score.sampleId,
      modality: score.modality,
      expected_cefr: score.expectedCefr,
      parsed_cefr: score.parsedCefr,
      provider: score.provider,
      model: score.model,
      retry_path: score.retryPath,
      taxonomy_tags: score.taxonomyTags,
      latency_ms: score.latencyMs,
      tokens_input: score.tokensInput,
      tokens_output: score.tokensOutput,
      status: score.status,
      malformed: score.malformed,
      raw_request: {},
      raw_response: {},
      created_at: score.createdAt,
    })),
  );
  if (scoreError) throw new Error(`replay score persist failed: ${scoreError.message}`);

  const providerRows = analyzeProviderVariance(scores);
  if (providerRows.length) {
    const { error } = await client.from("placement_v3_provider_variance").insert(
      providerRows.map((row) => ({
        run_id: run.id,
        batch_id: run.batchId,
        provider: row.provider,
        model: null,
        sample_count: row.sampleCount,
        success_rate: row.successRate,
        malformed_rate: row.malformedRate,
        average_expected_delta: row.averageExpectedDelta,
        p95_latency_ms: row.p95LatencyMs,
      })),
    );
    if (error) throw new Error(`provider variance persist failed: ${error.message}`);
  }

  if (run.report.alerts.length) {
    const { error } = await client.from("placement_v3_drift_alerts").insert(
      run.report.alerts.map((alert) => ({
        run_id: run.id,
        batch_id: run.batchId,
        severity: alert.severity,
        scope: alert.scope,
        metric: alert.metric,
        value: alert.value,
        threshold: alert.threshold,
        sample_ids: alert.sampleIds,
        message: alert.message,
      })),
    );
    if (error) throw new Error(`drift alerts persist failed: ${error.message}`);
  }
}

async function persistSimulatedReplay(
  config: ReplayConfig,
  run: {
    id: string;
    batchId: string;
    startedAt: string;
    completedAt: string;
    simulated: boolean;
    status: string;
    sampleCount: number;
    successCount: number;
    malformedCount: number;
    p95LatencyMs: number;
    providerSet: DriftProvider[];
    report: ReturnType<typeof buildStabilityReport>;
  },
  scores: ReplayScore[],
  evidence: RawEvidence[],
  report: ReturnType<typeof buildStabilityReport>,
  deltas: ReturnType<typeof analyzeScoreDeltas>,
) {
  const dbRun = {
    id: run.id,
    batch_id: run.batchId,
    fixture_version: "simulation-v1",
    started_at: run.startedAt,
    completed_at: run.completedAt,
    status: run.status,
    sample_count: run.sampleCount,
    success_count: run.successCount,
    malformed_count: run.malformedCount,
    p95_latency_ms: run.p95LatencyMs,
    provider_set: run.providerSet,
    metadata: {
      simulated: true,
      source: "scripts/placement-v3/run-grading-replay.ts",
      mode: "deterministic-local-replay",
    },
  };
  const dbScores = scores.map((score) => ({
    id: `${score.runId}:${score.sampleId}`,
    run_id: score.runId,
    batch_id: score.batchId,
    sample_id: score.sampleId,
    modality: score.modality,
    expected_cefr: score.expectedCefr,
    parsed_cefr: score.parsedCefr,
    provider: score.provider,
    model: score.model,
    retry_path: score.retryPath,
    taxonomy_tags: score.taxonomyTags,
    latency_ms: score.latencyMs,
    tokens_input: score.tokensInput,
    tokens_output: score.tokensOutput,
    status: score.status,
    malformed: score.malformed,
    raw_request: {},
    raw_response: { simulated: true },
    created_at: score.createdAt,
  }));
  const dashboardPayload = {
    simulated: true,
    ok: true,
    generatedAt: run.completedAt,
    runs: [dbRun],
    scores: dbScores,
    alerts: report.alerts.map((alert, index) => ({
      id: index + 1,
      severity: alert.severity,
      scope: alert.scope,
      metric: alert.metric,
      value: alert.value,
      threshold: alert.threshold,
      sample_ids: alert.sampleIds,
      message: alert.message,
      created_at: run.completedAt,
    })),
    providerVariance: analyzeProviderVariance(scores).map((row) => ({
      provider: row.provider,
      sample_count: row.sampleCount,
      success_rate: row.successRate,
      malformed_rate: row.malformedRate,
      average_expected_delta: row.averageExpectedDelta,
      p95_latency_ms: row.p95LatencyMs,
    })),
    summary: {
      scoreCount: scores.length,
      replaySuccessRate: report.replay.successRate,
      malformedRate: report.replay.malformedRate,
      p95GradingLatencyMs: report.replay.p95LatencyMs,
      criticalAlertCount: report.alerts.filter((alert) => alert.severity === "critical").length,
      byModality: bucketScores(scores, "modality"),
      byCefr: bucketScores(scores, "expectedCefr"),
      byProvider: bucketScores(scores, "provider"),
      retryVariance: scores.reduce<Record<string, number>>((out, score) => {
        const key = score.retryPath.join(">") || "none";
        out[key] = (out[key] ?? 0) + 1;
        return out;
      }, {}),
      taxonomy: scores.reduce<Record<string, { count: number; malformedRate: number }>>((out, score) => {
        for (const tag of score.taxonomyTags) {
          const row = out[tag] ?? { count: 0, malformedRate: 0 };
          row.count += 1;
          out[tag] = row;
        }
        return out;
      }, {}),
    },
  };

  for (const [tag, row] of Object.entries(dashboardPayload.summary.taxonomy)) {
    const subset = scores.filter((score) => score.taxonomyTags.includes(tag));
    row.malformedRate = ratio(subset.filter((score) => score.malformed).length, subset.length);
  }

  await fs.writeFile(
    path.join(config.outDir, `${run.id}.local-persistence.json`),
    `${JSON.stringify({ simulated: true, generatedAt: run.completedAt, run: dbRun, scores: dbScores, evidence }, null, 2)}\n`,
  );
  await fs.writeFile(
    path.join(config.outDir, `${run.id}.dashboard-payload.json`),
    `${JSON.stringify(dashboardPayload, null, 2)}\n`,
  );
  await fs.writeFile(
    path.join(config.outDir, `${run.id}.pipeline-integrity.json`),
    `${JSON.stringify({
      simulated: true,
      generatedAt: run.completedAt,
      fixtureCount: scores.length,
      persistedScoreCount: dbScores.length,
      evidenceCount: evidence.length,
      diffCount: deltas.length,
      dashboardPayloadRenderable: Boolean(dashboardPayload.ok && dashboardPayload.summary.scoreCount === scores.length),
      allArtifactsStampedSimulated: true,
    }, null, 2)}\n`,
  );
}

function bucketScores(scores: ReplayScore[], key: "modality" | "expectedCefr" | "provider") {
  const out: Record<string, { count: number; successRate: number; malformedRate: number; p95LatencyMs: number }> = {};
  for (const value of new Set(scores.map((score) => String(score[key])))) {
    const subset = scores.filter((score) => String(score[key]) === value);
    out[value] = {
      count: subset.length,
      successRate: ratio(subset.filter((score) => score.status === "success").length, subset.length),
      malformedRate: ratio(subset.filter((score) => score.malformed).length, subset.length),
      p95LatencyMs: percentile(subset.map((score) => score.latencyMs), 0.95),
    };
  }
  return out;
}

function percentile(values: number[], p: number): number {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return 0;
  return Math.round(sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * p) - 1)]);
}

function ratio(count: number, total: number): number {
  return total ? Number((count / total).toFixed(4)) : 0;
}

async function loadFixtures(fixturePath: string): Promise<ReplayFixture[]> {
  const raw = await fs.readFile(fixturePath, "utf8");
  const parsed = JSON.parse(raw) as ReplayFixture[];
  return parsed.filter((fixture) => fixture.modality !== "writing");
}

async function writePartial(filePath: string, body: unknown) {
  await fs.writeFile(filePath, `${JSON.stringify(body, null, 2)}\n`);
}

async function readCompletedSamples(filePath: string): Promise<Set<string>> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as { scores?: Array<{ sampleId?: string }> };
    return new Set((parsed.scores ?? []).map((score) => score.sampleId).filter(Boolean) as string[]);
  } catch {
    return new Set();
  }
}

async function writeBlocker(args: {
  command: string;
  error: string;
  completedStages: string[];
  unavailableMetrics: string[];
}) {
  const filePath = "docs/placement-v3/drift-detection/a36-blockers.md";
  const body = `# A36 Blockers

Generated: ${new Date().toISOString()}

## Command Attempted

\`${args.command}\`

## Exact Error

${args.error}

## Replay Stages Completed

${args.completedStages.map((stage) => `- ${stage}`).join("\n")}

## Metrics Unavailable

${args.unavailableMetrics.map((metric) => `- ${metric}`).join("\n")}

## What Remains Unverified

- At least 40 fixtures through real graders
- Three replay/tuning cycles
- Provider variance on live OpenAI/Gemini behavior
- Taxonomy instability from live grader output
- Persisted production database rows
- Dashboard rendering real replay data
`;
  await fs.writeFile(filePath, body);
}

function readConfig(): ReplayConfig {
  const args = readArgs();
  const batchId = args.get("batch") ?? args.get("batchId") ?? "baseline-01";
  const simulate = args.get("simulate") === "true" || args.get("mode") === "simulate" || process.env.PLACEMENT_REPLAY_SIMULATE === "1";
  return {
    batchId,
    fixturePath: args.get("fixtures") ?? DEFAULT_FIXTURE,
    outDir: args.get("outDir") ?? (simulate ? DEFAULT_SIMULATED_OUT_DIR : DEFAULT_OUT_DIR),
    supabaseUrl: process.env.PLACEMENT_REPLAY_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "",
    anonKey: process.env.PLACEMENT_REPLAY_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? "",
    serviceRoleKey: process.env.PLACEMENT_REPLAY_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    jwt: process.env.PLACEMENT_REPLAY_JWT ?? "",
    persist: args.get("persist") === "true" || process.env.PLACEMENT_REPLAY_PERSIST === "1",
    limit: args.has("limit") ? Number(args.get("limit")) : null,
    resume: args.get("resume") !== "false",
    simulate,
  };
}

function readArgs(): Map<string, string> {
  const out = new Map<string, string>();
  const raw = process.argv.slice(2);
  for (let i = 0; i < raw.length; i += 1) {
    const arg = raw[i];
    if (!arg.startsWith("--")) continue;
    const stripped = arg.slice(2);
    if (stripped.includes("=")) {
      const [key, value = "true"] = stripped.split("=");
      out.set(key, value);
      continue;
    }
    const next = raw[i + 1];
    if (next && !next.startsWith("--")) {
      out.set(stripped, next);
      i += 1;
    } else {
      out.set(stripped, "true");
    }
  }
  return out;
}

function normalizeProvider(value: unknown): DriftProvider {
  if (value === "openai" || value === "gemini" || value === "none") return value;
  return "unknown";
}

function normalizeCefr(value: unknown): CefrLevel | null {
  return value === "A1" || value === "A2" || value === "B1" || value === "B2" || value === "C1" || value === "C2"
    ? value
    : null;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

main().catch((err) => {
  console.error("[placement-drift] failed", err);
  process.exit(1);
});
