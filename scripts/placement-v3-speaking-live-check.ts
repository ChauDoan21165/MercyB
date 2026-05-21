#!/usr/bin/env tsx
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  handleRequest,
  localeForAccent,
  type Accent,
  type AuditParams,
  type LogAttemptParams,
  type UserProfileRow,
} from "../supabase/functions/azure-phoneme/core.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

export const DEFAULT_FIXTURE_PATH = "tests/fixtures/audio/placement-v3-validation-sample.wav";
export const DEFAULT_REPORT_PATH = "reports/placement-v3-speaking-live-check/latest.json";
export const LIVE_CHECK_MARKER = "PLACEMENT_V3_SPEAKING_LIVE_CHECK";
export const VALIDATION_ENV_MARKER = "PLACEMENT_V3_VALIDATION_ENV";
export const ALLOWED_VALIDATION_ENVS = new Set(["local", "staging", "validation"]);

type LiveCheckEnv = Record<string, string | undefined>;

export type SafetyCheckResult =
  | { ok: true }
  | { ok: false; reason: string };

export type LiveCheckSummary = {
  ok: boolean;
  provider: "azure";
  fixture_path: string;
  target_text: string;
  latency_ms: number;
  timeout_fallback_status: {
    fallback: boolean;
    errorCode: string | null;
    providerTimeout: boolean;
    retryable: boolean;
    recoverable: boolean;
    reason: string | null;
  };
  persisted_provider_metadata: {
    audit_events: AuditParams[];
    provider_attempts: LogAttemptParams[];
  };
  learner_visible_recovery_state: {
    can_retry: boolean;
    message: string;
    metadata: Record<string, unknown>;
  };
  provider_response: unknown;
};

export function assertSafeLiveCheckEnv(env: LiveCheckEnv): SafetyCheckResult {
  if (env.NODE_ENV === "production" || env.VERCEL_ENV === "production") {
    return { ok: false, reason: "Refusing Placement V3 speaking live-check in production env." };
  }
  if (env[LIVE_CHECK_MARKER] !== "1") {
    return { ok: false, reason: `Refusing live-check without ${LIVE_CHECK_MARKER}=1.` };
  }
  const validationEnv = env[VALIDATION_ENV_MARKER];
  if (!validationEnv || !ALLOWED_VALIDATION_ENVS.has(validationEnv)) {
    return {
      ok: false,
      reason: `Refusing live-check without ${VALIDATION_ENV_MARKER}=local|staging|validation.`,
    };
  }
  if (!env.AZURE_SPEECH_KEY) {
    return { ok: false, reason: "Refusing live-check without AZURE_SPEECH_KEY." };
  }
  if (isProductionLikeSupabaseUrl(env.SUPABASE_URL)) {
    return { ok: false, reason: "Refusing production-like Supabase URL for live-check." };
  }
  return { ok: true };
}

export function isProductionLikeSupabaseUrl(raw: string | undefined): boolean {
  if (!raw) return false;
  const value = raw.trim().toLowerCase();
  if (!value) return false;
  if (value.includes("localhost") || value.includes("127.0.0.1")) return false;
  return /^https:\/\/[a-z0-9-]+\.supabase\.co\b/.test(value);
}

export function recoveryStateFromProviderBody(body: unknown) {
  const record = isRecord(body) ? body : {};
  const reason = typeof record.reason === "string" ? record.reason : null;
  const ok = record.ok === true;
  const providerTimeout = reason === "azure_timeout";
  const fallback = !ok;
  const errorCode = fallback
    ? providerTimeout
      ? "timeout"
      : "provider_unavailable"
    : null;

  return {
    timeout_fallback_status: {
      fallback,
      errorCode,
      providerTimeout,
      retryable: fallback,
      recoverable: fallback,
      reason,
    },
    learner_visible_recovery_state: {
      can_retry: fallback,
      message: fallback
        ? "Pronunciation scoring did not complete. The learner can retry without losing the placement session."
        : "Pronunciation scoring completed with Azure provider evidence.",
      metadata: {
        fallback,
        errorCode,
        providerTimeout,
        retryable: fallback,
        recoverable: fallback,
        providerReason: reason,
      },
    },
  };
}

export async function runLiveCheck(env: LiveCheckEnv = process.env): Promise<LiveCheckSummary> {
  const safety = assertSafeLiveCheckEnv(env);
  if (!safety.ok) {
    throw new Error(safety.reason);
  }

  const fixturePath = env.PLACEMENT_V3_SPEAKING_FIXTURE_PATH ?? DEFAULT_FIXTURE_PATH;
  const targetText = env.PLACEMENT_V3_SPEAKING_TARGET_TEXT ?? "I think this is going to work";
  const reportPath = env.PLACEMENT_V3_SPEAKING_LIVE_REPORT_PATH ?? DEFAULT_REPORT_PATH;
  const accent = normalizeAccent(env.PLACEMENT_V3_SPEAKING_ACCENT);
  const audio = await readFile(path.resolve(repoRoot, fixturePath));
  const formData = new FormData();
  formData.append("audio", new Blob([audio], { type: "audio/wav" }), path.basename(fixturePath));
  formData.append("target_text", targetText);
  formData.append("roomId", "placement-v3-live-check");
  formData.append("lineId", "placement-v3-speaking-validation-sample");
  formData.append("accent", accent);

  const auditEvents: AuditParams[] = [];
  const providerAttempts: LogAttemptParams[] = [];
  const startedAt = performance.now();
  const response = await handleRequest(
    new Request("https://local.validation/azure-phoneme", {
      method: "POST",
      headers: { Authorization: "Bearer placement-v3-live-check" },
      body: formData,
    }),
    {
      getUserFromAuthHeader: async () => ({ id: "placement-v3-live-check-user" }),
      rateLimit: async () => undefined,
      checkIpRateLimit: async () => ({ allowed: true }),
      fetch,
      checkAiBudget: async () => ({ allowed: true }),
      fetchUserProfile: async () => activeValidationProfile(),
      sumGlobalCostToday: async () => 0,
      audit: async (params) => {
        auditEvents.push(params);
      },
      logAttempt: async (params) => {
        providerAttempts.push(params);
      },
      azureKey: env.AZURE_SPEECH_KEY ?? "",
      azureUrlForAccent: (inputAccent) =>
        `https://${env.AZURE_SPEECH_REGION ?? "canadacentral"}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${localeForAccent(inputAccent)}&format=detailed`,
      globalDailyCapUsd: 25,
      usdToVnd: 26000,
      azureTimeoutMs: Number(env.PLACEMENT_V3_SPEAKING_LIVE_TIMEOUT_MS ?? 15_000),
    },
  );
  const latencyMs = Math.round(performance.now() - startedAt);
  const body = await response.json();
  const recovery = recoveryStateFromProviderBody(body);
  const summary: LiveCheckSummary = {
    ok: response.ok && isRecord(body) && body.ok === true,
    provider: "azure",
    fixture_path: fixturePath,
    target_text: targetText,
    latency_ms: latencyMs,
    timeout_fallback_status: recovery.timeout_fallback_status,
    persisted_provider_metadata: {
      audit_events: auditEvents,
      provider_attempts: providerAttempts,
    },
    learner_visible_recovery_state: recovery.learner_visible_recovery_state,
    provider_response: body,
  };

  await mkdir(path.dirname(path.resolve(repoRoot, reportPath)), { recursive: true });
  await writeFile(path.resolve(repoRoot, reportPath), `${JSON.stringify(summary, null, 2)}\n`);
  return summary;
}

function activeValidationProfile(): UserProfileRow {
  return {
    trial_expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    trial_ends_at: null,
    trial_end: null,
    premium_status: null,
    premium_expires_at: null,
    tier: 0,
  };
}

function normalizeAccent(raw: string | undefined): Accent {
  return raw === "uk" || raw === "au" || raw === "ca" ? raw : "us";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runLiveCheck()
    .then((summary) => {
      console.log(JSON.stringify(summary, null, 2));
    })
    .catch((err) => {
      console.error(err instanceof Error ? err.message : String(err));
      process.exitCode = 1;
    });
}
