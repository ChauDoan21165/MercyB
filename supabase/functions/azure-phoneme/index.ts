// Path: supabase/functions/azure-phoneme/index.ts
//
// Day 1 Deno entry. Wires production `Deps` (Supabase admin client,
// real `fetch`, env-var reads) and delegates to `handleRequest` in
// `core.ts`. The split exists so vitest can import `core.ts` under
// Node and exercise the request handler with fake deps.
//
// Pattern mirrors the speech-analyze edge function — same JWT gate,
// same rate-limit helper, same audit log target — but the upstream
// call is Azure Pronunciation Assessment instead of Whisper. See
// reports/plan-phoneme-scoring-azure-2026-04-26.md § 2 for the full
// contract and reports/spike-azure-pronunciation-2026-04-26.md for
// the evidence base.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  createSupabaseAdminClient,
  getUserFromAuthHeader,
} from "../_shared/security.ts";
import { rateLimit } from "../_shared/rateLimit.ts";
import { wrapHandler } from "../_shared/sentry.ts";
import {
  buildRateLimitErrorBody,
  checkIpRateLimit,
} from "../_shared/ipRateLimit.ts";
import {
  trackLatency,
  trackLatencyMs,
  type LatencyStatus,
} from "../_shared/latencyTelemetry.ts";

import {
  handleRequest,
  localeForAccent,
  type Accent,
  type AiBudgetResult,
  type AuditParams,
  type Deps,
  type LogAttemptParams,
  type UserProfileRow,
} from "./core.ts";

// ── Singleton clients ────────────────────────────────────────────────────

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// ── Env config ───────────────────────────────────────────────────────────

const AZURE_REGION = Deno.env.get("AZURE_SPEECH_REGION") ?? "canadacentral";
const AZURE_KEY = Deno.env.get("AZURE_SPEECH_KEY") ?? "";
function buildAzureUrl(accent: Accent): string {
  return `https://${AZURE_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${localeForAccent(accent)}&format=detailed`;
}
const GLOBAL_DAILY_CAP_USD = Number(
  Deno.env.get("AZURE_SPEECH_DAILY_CAP_USD") || "25",
);
const USD_TO_VND = Number(Deno.env.get("USD_TO_VND") || "26000");

// ── Real-deps implementations ────────────────────────────────────────────

async function audit(params: AuditParams): Promise<void> {
  try {
    const { error } = await supabase.from("speech_analysis_logs").insert({
      user_id: params.userId,
      audio_seconds: params.audioSeconds ?? null,
      openai_cost_usd: params.openaiCostUsd ?? null,
      status: params.status,
      error_msg: params.errorMsg ?? null,
    });
    if (error) console.error("speech_analysis_logs insert error", error);
  } catch (err) {
    console.error("audit threw", err);
  }
}

async function logAttempt(params: LogAttemptParams): Promise<void> {
  try {
    const { error } = await supabase.from("speech_attempts").insert({
      user_id: params.userId,
      room_id: params.roomId,
      line_id: params.lineId,
      target_text: params.targetText,
      transcript: params.transcript,
      match_score: Number((params.overallScore / 100).toFixed(4)),
      overall_score: params.overallScore,
      word_scores: params.wordScores,
      provider: "cloud",
      provider_cost_usd: Number(params.providerCostUsd.toFixed(6)),
      phoneme_scores: params.phonemeScores,
    });
    if (error) console.error("speech_attempts insert error", error);
  } catch (err) {
    console.error("logAttempt threw", err);
  }
}

async function checkAiBudget(
  userId: string,
  reserveVnd: number,
): Promise<AiBudgetResult> {
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.rpc("check_ai_budget", {
      p_user_id: userId,
      p_request_reserve_vnd: reserveVnd,
    });
    if (error) {
      console.error("check_ai_budget error", error);
      return { allowed: true };
    }
    const budget = Array.isArray(data) ? data[0] : data;
    return {
      allowed: Boolean(budget?.allowed),
      message: budget?.message ?? null,
      reset_at: budget?.reset_at ?? null,
    };
  } catch (err) {
    console.error("check_ai_budget threw", err);
    return { allowed: true };
  }
}

/**
 * Fetch the trial / tier columns from `profiles` for the calling user.
 * Returns null on miss / error so `checkTrialAccess` can fail-open.
 *
 * Trial column name set is historical noise — the schema accumulated
 * three names (trial_end, trial_ends_at, trial_expires_at). Reading
 * all three lets the trial check walk them in priority order without
 * forcing a column rename migration.
 */
async function fetchUserProfile(userId: string): Promise<UserProfileRow | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("trial_expires_at, trial_ends_at, trial_end, tier")
      .eq("id", userId)
      .maybeSingle();
    if (error) {
      console.error("fetchUserProfile error", error);
      return null;
    }
    if (!data) return null;
    const row = data as Record<string, unknown>;
    return {
      trial_expires_at: toIsoOrNull(row.trial_expires_at),
      trial_ends_at: toIsoOrNull(row.trial_ends_at),
      trial_end: toIsoOrNull(row.trial_end),
      tier: typeof row.tier === "number" ? row.tier : null,
    };
  } catch (err) {
    console.error("fetchUserProfile threw", err);
    return null;
  }
}

function toIsoOrNull(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function sumGlobalCostToday(): Promise<number> {
  try {
    const since = startOfUtcDay();
    const { data, error } = await supabase
      .from("speech_analysis_logs")
      .select("openai_cost_usd")
      .gte("created_at", since)
      .eq("status", "ok");
    if (error) return 0;
    if (!Array.isArray(data)) return 0;
    return data.reduce(
      (acc, row) =>
        acc + Number((row as { openai_cost_usd?: number }).openai_cost_usd ?? 0),
      0,
    );
  } catch (err) {
    console.error("sumGlobalCostToday threw", err);
    return 0;
  }
}

function startOfUtcDay(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

// Tracked fetch: records the Azure REST call's latency on every request.
// Wrapping at this level (rather than inside core.ts) keeps the test
// contract clean — fake `Deps.fetch` in vitest won't trigger telemetry.
async function trackedAzureFetch(
  input: string,
  init: RequestInit,
): Promise<Response> {
  const startedAt = performance.now();
  let status: LatencyStatus = "success";
  try {
    const resp = await fetch(input, init);
    if (!resp.ok) status = "error";
    return resp;
  } catch (err) {
    status =
      err instanceof Error && err.name === "AbortError" ? "timeout" : "error";
    throw err;
  } finally {
    trackLatencyMs("azure-phoneme.azure-call", performance.now() - startedAt, {
      status,
    });
  }
}

// ── Wire deps and serve ──────────────────────────────────────────────────

async function resolveAdminLevel(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase.rpc("get_admin_level", {
      p_user_id: userId,
    });
    if (error || typeof data !== "number") return 0;
    return data;
  } catch {
    return 0;
  }
}

const productionDeps: Deps = {
  getUserFromAuthHeader: (req) => getUserFromAuthHeader(req),
  rateLimit: (key, max, windowMs) => rateLimit(key, max, windowMs),
  checkIpRateLimit: async (req, userId) => {
    const adminLevel = await resolveAdminLevel(userId);
    const result = await checkIpRateLimit(req, {
      supabase,
      surface: "azure-phoneme",
      isAdminBypass: adminLevel >= 9,
    });
    if (result.allowed) return { allowed: true };
    const retry = result.retryAfterSeconds ?? 60;
    return {
      allowed: false,
      response: new Response(JSON.stringify(buildRateLimitErrorBody(retry)), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retry),
        },
      }),
    };
  },
  fetch: trackedAzureFetch,
  checkAiBudget,
  fetchUserProfile,
  sumGlobalCostToday,
  audit,
  logAttempt,
  azureKey: AZURE_KEY,
  azureUrlForAccent: buildAzureUrl,
  globalDailyCapUsd: GLOBAL_DAILY_CAP_USD,
  usdToVnd: USD_TO_VND,
};

serve(
  wrapHandler("azure-phoneme", async (req) => {
    const startedAt = performance.now();
    let status: LatencyStatus = "success";
    try {
      const resp = await handleRequest(req, productionDeps);
      if (resp.status >= 500) status = "error";
      return resp;
    } catch (err) {
      status = "error";
      throw err;
    } finally {
      trackLatency({
        operation: "azure-phoneme.total",
        startedAt,
        status,
      });
    }
  }),
);
