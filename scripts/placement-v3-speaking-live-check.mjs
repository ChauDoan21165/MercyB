#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..");

export const DEFAULT_FIXTURE = "tests/fixtures/audio/placement-v3-validation-sample.wav";
export const DEFAULT_REPORT = "reports/placement-v3/speaking-live-check/latest.json";
export const VALIDATION_TEXT = "I want to improve my pronunciation and speak clearly.";

export function validateLiveCheckEnvironment(env = process.env) {
  const errors = [];
  const productionMarkers = ["NODE_ENV", "VERCEL_ENV", "MB_ENV", "APP_ENV", "SUPABASE_ENV"]
    .filter((key) => String(env[key] ?? "").toLowerCase() === "production");
  if (productionMarkers.length) errors.push(`refusing production execution: ${productionMarkers.join(", ")}`);
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL || "";
  if (supabaseUrl && isProductionLikeSupabaseUrl(supabaseUrl)) {
    errors.push(`refusing production-like Supabase URL: ${redactUrl(supabaseUrl)}`);
  }
  if (env.PLACEMENT_V3_SPEAKING_LIVE_CHECK !== "1") errors.push("missing PLACEMENT_V3_SPEAKING_LIVE_CHECK=1");
  if (env.PLACEMENT_V3_SPEAKING_LIVE_PROVIDER !== "azure") errors.push("missing PLACEMENT_V3_SPEAKING_LIVE_PROVIDER=azure");
  if (env.PLACEMENT_V3_SPEAKING_LIVE_ACK_NON_PROD !== "1") errors.push("missing PLACEMENT_V3_SPEAKING_LIVE_ACK_NON_PROD=1");
  if (!String(env.AZURE_SPEECH_KEY ?? "").trim()) errors.push("missing AZURE_SPEECH_KEY");
  return { ok: errors.length === 0, errors };
}

export function isProductionLikeSupabaseUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) return false;
    if (/(dev|test|staging|stage|sandbox|local)/.test(host)) return false;
    return host.endsWith(".supabase.co") || host.includes("mercyblade");
  } catch {
    return true;
  }
}

export function redactUrl(value) {
  try {
    const url = new URL(value);
    return `${url.protocol}//${url.hostname}`;
  } catch {
    return "<invalid-url>";
  }
}

export function buildAzureUrl(region) {
  return `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed`;
}

function base64Json(value) {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
}

function fallbackReport({ reason, startedAt, latencyMs, fixture, runId }) {
  const timeout = reason === "timeout";
  return {
    ok: false,
    runId,
    provider: "azure",
    providerPath: "placement-v3-speaking",
    fixture,
    latencyMs,
    fallback: true,
    errorCode: reason,
    providerTimeout: timeout,
    retryable: true,
    recoverable: true,
    learnerVisibleRecoveryState: "degraded_safe_retry_available",
    persistedProviderMetadata: {
      provider: "azure",
      providerPath: "placement-v3-speaking",
      fallback: true,
      errorCode: reason,
      providerTimeout: timeout,
      retryable: true,
      recoverable: true,
    },
    startedAt,
    completedAt: new Date().toISOString(),
  };
}

function successReport({ body, startedAt, latencyMs, fixture, region, runId }) {
  const best = body?.NBest?.[0] ?? {};
  return {
    ok: true,
    runId,
    provider: "azure",
    providerPath: "placement-v3-speaking",
    fixture,
    region,
    latencyMs,
    fallback: false,
    timeout: false,
    retryable: false,
    recoverable: false,
    learnerVisibleRecoveryState: "not_needed",
    persistedProviderMetadata: {
      provider: "azure",
      providerPath: "placement-v3-speaking",
      recognitionStatus: body?.RecognitionStatus ?? "unknown",
      displayText: body?.DisplayText ?? "",
      pronunciationScore: best.PronScore ?? best.AccuracyScore ?? null,
      accuracyScore: best.AccuracyScore ?? null,
      fluencyScore: best.FluencyScore ?? null,
      completenessScore: best.CompletenessScore ?? null,
      wordCount: Array.isArray(best.Words) ? best.Words.length : 0,
      fallback: false,
    },
    debugMetadata: {
      targetText: VALIDATION_TEXT,
      azureEndpointHost: `${region}.stt.speech.microsoft.com`,
      audioBytes: fs.statSync(path.resolve(repoRoot, fixture)).size,
    },
    startedAt,
    completedAt: new Date().toISOString(),
  };
}

export async function runLiveCheck(options = {}, deps = {}) {
  const fixture = options.fixture ?? DEFAULT_FIXTURE;
  const fixturePath = path.resolve(repoRoot, fixture);
  if (!fs.existsSync(fixturePath)) throw new Error(`fixture not found: ${fixture}`);
  const audio = fs.readFileSync(fixturePath);
  const region = options.region ?? process.env.AZURE_SPEECH_REGION ?? "canadacentral";
  const timeoutMs = Number(options.timeoutMs ?? process.env.PLACEMENT_V3_SPEAKING_LIVE_TIMEOUT_MS ?? 15_000);
  const fetchImpl = deps.fetchImpl ?? fetch;
  const startedAt = new Date().toISOString();
  const startedMs = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(buildAzureUrl(region), {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": deps.azureKey ?? process.env.AZURE_SPEECH_KEY,
        "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
        "Pronunciation-Assessment": base64Json({
          ReferenceText: VALIDATION_TEXT,
          GradingSystem: "HundredMark",
          Granularity: "Phoneme",
          EnableMiscue: true,
        }),
        Accept: "application/json",
        "Accept-Language": "en-US",
      },
      body: audio,
      signal: controller.signal,
    });
    const latencyMs = Date.now() - startedMs;
    if (!response.ok) {
      return fallbackReport({
        reason: response.status === 401 || response.status === 403 ? "azure_auth_failed" : `azure_http_${response.status}`,
        startedAt,
        latencyMs,
        fixture,
        runId: options.runId,
      });
    }
    const body = await response.json().catch(() => null);
    if (body?.RecognitionStatus !== "Success") {
      return fallbackReport({
        reason: `azure_status_${String(body?.RecognitionStatus ?? "malformed").toLowerCase()}`,
        startedAt,
        latencyMs,
        fixture,
        runId: options.runId,
      });
    }
    return successReport({ body, startedAt, latencyMs, fixture, region, runId: options.runId });
  } catch (err) {
    return fallbackReport({
      reason: err instanceof Error && err.name === "AbortError" ? "timeout" : "network_error",
      startedAt,
      latencyMs: Date.now() - startedMs,
      fixture,
      runId: options.runId,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function parseArgs(argv) {
  const args = { fixture: DEFAULT_FIXTURE, report: DEFAULT_REPORT };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--fixture") args.fixture = argv[++i] ?? args.fixture;
    else if (argv[i] === "--report") args.report = argv[++i] ?? args.report;
    else if (argv[i] === "--timeout-ms") args.timeoutMs = Number(argv[++i]);
    else if (argv[i] === "--region") args.region = argv[++i];
  }
  return args;
}

async function main() {
  const guard = validateLiveCheckEnvironment();
  if (!guard.ok) {
    console.error("[placement:v3:speaking:live-check] refused");
    for (const error of guard.errors) console.error(`- ${error}`);
    process.exitCode = 2;
    return;
  }
  const options = parseArgs(process.argv.slice(2));
  const report = await runLiveCheck(options);
  const reportPath = path.resolve(repoRoot, options.report);
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({
    ok: report.ok,
    report: options.report,
    provider: report.provider,
    latencyMs: report.latencyMs,
    fallback: report.fallback,
    errorCode: report.errorCode ?? null,
    learnerVisibleRecoveryState: report.learnerVisibleRecoveryState,
  }, null, 2));
  if (!report.ok) process.exitCode = 1;
}

if (process.argv[1] === __filename) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  });
}
