import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { chatJsonWithFailover } from "../_shared/aiProvider.ts";
import { wrapHandler } from "../_shared/sentry.ts";
import {
  buildAdaptiveValidationPrompts,
  PLACEMENT_ADAPTIVE_PROMPT_VERSION,
} from "../_shared/placementAdaptivePrompts.ts";

const OPENAI_MODEL = "gpt-4o-mini";
const GEMINI_MODEL = "gemini-2.5-flash";
const MAX_TOKENS = 1_800;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ValidateRequest = {
  item: Record<string, unknown>;
  existingItems: Array<{ id: string; title?: string; promptText?: string }>;
  batchId: string;
  cycle: number;
  promptVersion: string;
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function estimateTokens(text: string): number {
  const trimmed = text.replace(/\s+/g, " ").trim();
  return trimmed ? Math.max(1, Math.ceil(trimmed.length / 4)) : 0;
}

function validateRequest(body: unknown): { ok: true; value: ValidateRequest } | {
  ok: false;
  status: number;
  error: string;
} {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, status: 400, error: "Request body must be an object." };
  }
  const record = body as Record<string, unknown>;
  if (!record.item || typeof record.item !== "object" || Array.isArray(record.item)) {
    return { ok: false, status: 400, error: "item is required." };
  }
  const existingItems = Array.isArray(record.existingItems)
    ? record.existingItems.flatMap((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return [];
      const itemRecord = item as Record<string, unknown>;
      const id = clean(itemRecord.id);
      if (!id) return [];
      return [{
        id,
        title: clean(itemRecord.title) || undefined,
        promptText: clean(itemRecord.promptText) || undefined,
      }];
    })
    : [];

  return {
    ok: true,
    value: {
      item: record.item as Record<string, unknown>,
      existingItems,
      batchId: clean(record.batchId) || "edge-validation",
      cycle: typeof record.cycle === "number" && Number.isFinite(record.cycle)
        ? Math.max(0, Math.round(record.cycle))
        : 0,
      promptVersion: clean(record.promptVersion) || PLACEMENT_ADAPTIVE_PROMPT_VERSION,
    },
  };
}

serve(
  wrapHandler("placement-v3-validate-item", async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return json({ ok: false, error: "invalid_json" }, 400);
    }

    const request = validateRequest(body);
    if (!request.ok) return json({ ok: false, error: request.error }, request.status);

    const prompts = buildAdaptiveValidationPrompts(request.value);
    const ai = await chatJsonWithFailover({
      ...prompts,
      maxTokens: MAX_TOKENS,
      temperature: 0.05,
      openaiModel: OPENAI_MODEL,
      geminiModel: GEMINI_MODEL,
      timeoutMs: 30_000,
    });

    const model = ai.provider === "gemini"
      ? GEMINI_MODEL
      : ai.provider === "openai"
        ? OPENAI_MODEL
        : "";
    const tokensInput = estimateTokens(`${prompts.systemPrompt}\n${prompts.userMessage}`);
    const tokensOutput = estimateTokens(ai.raw || JSON.stringify(ai.json));
    const validatedAt = new Date().toISOString();

    if (!ai.ok || ai.provider === "none") {
      return json({
        ok: false,
        error: "ai_unavailable",
        provider: ai.provider,
        attempts: ai.attempts,
        latencyMs: ai.latencyMs,
      }, 503);
    }

    const itemId = clean(request.value.item.id) || "unknown";
    const finalDecision = ai.json.finalDecision === "accepted" ? "accepted" : "rejected";
    return json({
      ok: true,
      validation: {
        id: crypto.randomUUID(),
        generatedItemId: itemId,
        validatedAt,
        ...ai.json,
        finalDecision,
        metadata: {
          batchId: request.value.batchId,
          cycle: request.value.cycle,
          promptVersion: request.value.promptVersion,
          generatedAt: validatedAt,
          provider: ai.provider,
          model,
          latencyMs: Math.max(0, Math.round(ai.latencyMs)),
          tokensInput,
          tokensOutput,
          estimatedCostUsd: estimateCost(model, tokensInput, tokensOutput),
        },
      },
      raw: ai.raw,
      modelTrace: {
        provider: ai.provider,
        model,
        latencyMs: Math.max(0, Math.round(ai.latencyMs)),
        tokensInput,
        tokensOutput,
      },
    });
  }),
);

function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const prices: Record<string, { input: number; output: number }> = {
    "gpt-4o-mini": { input: 0.00015, output: 0.0006 },
    "gemini-2.5-flash": { input: 0.0003, output: 0.0025 },
  };
  const price = prices[model] ?? { input: 0.001, output: 0.002 };
  return Number(((inputTokens / 1000) * price.input + (outputTokens / 1000) * price.output).toFixed(6));
}
