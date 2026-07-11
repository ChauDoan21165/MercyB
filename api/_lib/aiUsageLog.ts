// Cost telemetry for the Cloudflare Pages Function `/api/mercy-ai`.
//
// Writes VND-costed, language_pair-tagged AI-spend rows to `ai_usage_logs` —
// the table the admin CostMonitoring page reads. This is the CF/Workers-runtime
// counterpart of the Deno edge `_shared/aiUsage.ts#logAiUsageLog`; it cannot
// import that module (different runtime / esm.sh URL imports), so the pricing
// and language-pair derivation are duplicated here and kept in sync.
//
// Contract (identical to the edge instrumentation):
// - service-role insert; `ai_usage_logs.user_id` is NOT NULL, so a missing /
//   non-UUID userId SKIPS the row rather than fabricating a user.
// - FIRE-AND-FORGET: scheduled via the Pages event context `waitUntil`; never
//   blocks or fails the learner's response, and every failure is swallowed.
// - NO fabricated numbers: callers invoke this only when the provider returned
//   real OpenAI token usage. The DeepSeek path logs nothing (no multi-provider
//   VND pricing yet).

import { createClient } from "@supabase/supabase-js";
import { envValue, type PagesContext } from "../../src/pages-functions/http";

// USD price per 1K tokens — MUST match supabase/functions/_shared/aiUsage.ts#getPricePer1k.
function getPricePer1k(model: string): { input: number; output: number } {
  const m = model.toLowerCase();
  if (m.includes("gpt-5")) return { input: 0.005, output: 0.015 };
  if (m.includes("gpt-4.1")) return { input: 0.005, output: 0.015 };
  if (m.includes("gpt-4o-mini")) return { input: 0.00015, output: 0.0006 };
  if (m.includes("gpt-4o")) return { input: 0.0025, output: 0.01 };
  if (m.includes("whisper")) return { input: 0.006, output: 0 };
  return { input: 0.0015, output: 0.002 };
}

function normalizeTokenCount(value: unknown): number {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return n < 0 ? 0 : Math.round(n);
}

function estimateOpenAICostVnd(
  usdToVnd: number,
  model: string,
  inputTokens: number,
  outputTokens: number,
): number {
  const prices = getPricePer1k(model);
  const inputUsd = (normalizeTokenCount(inputTokens) / 1000) * prices.input;
  const outputUsd = (normalizeTokenCount(outputTokens) / 1000) * prices.output;
  return Number(((inputUsd + outputUsd) * usdToVnd).toFixed(2));
}

// "<native>-en", matching ai-chat's cost-per-language format. null when unknown.
function deriveLanguagePair(native: string | null | undefined, target = "en"): string | null {
  const n = String(native ?? "").trim().toLowerCase();
  return n ? `${n}-${target}` : null;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type WithWaitUntil = { waitUntil?: (promise: Promise<unknown>) => void };

/**
 * Fire-and-forget AI-spend log for the CF Pages runtime. Scheduled via
 * `context.waitUntil` when available (so it survives past the response) and
 * otherwise detached. Never throws, never blocks the response.
 *
 * Only call this for OpenAI-provider calls that returned real token usage.
 */
export function logMercyAiUsage(
  context: PagesContext,
  params: {
    userId: string | null;
    feature: string; // e.g. "mercy-ai:sentence-correction"
    model: string;
    inputTokens: number;
    outputTokens: number;
    meta?: Record<string, unknown>;
  },
): void {
  const env = context.env;
  const supabaseUrl = envValue(env, "SUPABASE_URL") || envValue(env, "VITE_SUPABASE_URL");
  const serviceKey = envValue(env, "SUPABASE_SERVICE_ROLE_KEY");
  const usdToVnd = Number(envValue(env, "USD_TO_VND") || "26000");

  const task = (async () => {
    if (!supabaseUrl || !serviceKey) {
      console.warn(`[${params.feature}] ai_usage_logs skipped: no service-role key`);
      return;
    }
    if (!params.userId || !UUID_RE.test(params.userId)) {
      console.warn(`[${params.feature}] ai_usage_logs skipped: missing/invalid userId`);
      return;
    }

    const client = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Best-effort language_pair (runs in the background, so the profiles read
    // never delays the learner's reply). null on any failure.
    let languagePair: string | null = null;
    try {
      const { data } = await client
        .from("profiles")
        .select("native_language")
        .eq("id", params.userId)
        .single();
      languagePair = deriveLanguagePair(
        (data as { native_language?: string | null } | null)?.native_language,
      );
    } catch {
      /* best-effort: leave languagePair null */
    }

    const estimatedCostVnd = estimateOpenAICostVnd(
      usdToVnd,
      params.model,
      params.inputTokens,
      params.outputTokens,
    );

    const { error } = await client.from("ai_usage_logs").insert({
      user_id: params.userId,
      feature: params.feature,
      model: params.model,
      input_tokens: normalizeTokenCount(params.inputTokens),
      output_tokens: normalizeTokenCount(params.outputTokens),
      estimated_cost_vnd: estimatedCostVnd,
      language_pair: languagePair,
      meta: params.meta ?? {},
    });
    if (error) {
      console.warn(`[${params.feature}] ai_usage_logs insert failed:`, error.message);
    }
  })().catch((e) => console.warn(`[${params.feature}] ai_usage_logs background failed:`, e));

  const waitUntil = (context as PagesContext & WithWaitUntil).waitUntil;
  if (typeof waitUntil === "function") waitUntil(task);
  else void task;
}
