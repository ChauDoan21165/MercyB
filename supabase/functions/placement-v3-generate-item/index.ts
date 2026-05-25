import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { chatJsonWithFailover } from "../_shared/aiProvider.ts";
import { wrapHandler } from "../_shared/sentry.ts";
import {
  buildAdaptiveGenerationPrompts,
  PLACEMENT_ADAPTIVE_PROMPT_VERSION,
  type PlacementAdaptiveCefrLevel,
  type PlacementAdaptiveModality,
} from "../_shared/placementAdaptivePrompts.ts";

const OPENAI_MODEL = "gpt-4o-mini";
const GEMINI_MODEL = "gemini-2.5-flash";
const MAX_TOKENS = 1_600;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type GenerateRequest = {
  modality: PlacementAdaptiveModality;
  targetCefr: PlacementAdaptiveCefrLevel;
  learnerL1: string;
  targetLanguage: string;
  skillFocus: string;
  difficultyConstraints?: string[];
  batchId?: string;
  cycle?: number;
  promptVersion?: string;
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function estimateTokens(text: string): number {
  const trimmed = text.replace(/\s+/g, " ").trim();
  return trimmed ? Math.max(1, Math.ceil(trimmed.length / 4)) : 0;
}

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function isModality(value: unknown): value is PlacementAdaptiveModality {
  return (
    value === "reading" ||
    value === "writing" ||
    value === "listening" ||
    value === "speaking"
  );
}

function isCefr(value: unknown): value is PlacementAdaptiveCefrLevel {
  return value === "A1" || value === "A2" || value === "B1" ||
    value === "B2" || value === "C1" || value === "C2";
}

function validateRequest(body: unknown): { ok: true; value: GenerateRequest } | {
  ok: false;
  status: number;
  error: string;
} {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, status: 400, error: "Request body must be an object." };
  }
  const record = body as Record<string, unknown>;
  if (!isModality(record.modality)) {
    return { ok: false, status: 400, error: "Invalid modality." };
  }
  if (!isCefr(record.targetCefr)) {
    return { ok: false, status: 400, error: "Invalid targetCefr." };
  }

  const learnerL1 = clean(record.learnerL1 || "vi");
  const targetLanguage = clean(record.targetLanguage || "en");
  const skillFocus = clean(record.skillFocus);
  if (!skillFocus) {
    return { ok: false, status: 400, error: "skillFocus is required." };
  }

  return {
    ok: true,
    value: {
      modality: record.modality,
      targetCefr: record.targetCefr,
      learnerL1,
      targetLanguage,
      skillFocus,
      difficultyConstraints: Array.isArray(record.difficultyConstraints)
        ? record.difficultyConstraints.map(clean).filter(Boolean).slice(0, 8)
        : [],
      batchId: clean(record.batchId) || "edge-single",
      cycle: typeof record.cycle === "number" && Number.isFinite(record.cycle)
        ? Math.max(0, Math.round(record.cycle))
        : 0,
      promptVersion: clean(record.promptVersion) || PLACEMENT_ADAPTIVE_PROMPT_VERSION,
    },
  };
}

serve(
  wrapHandler("placement-v3-generate-item", async (req) => {
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

    const prompts = buildAdaptiveGenerationPrompts(request.value);
    const ai = await chatJsonWithFailover({
      ...prompts,
      maxTokens: MAX_TOKENS,
      temperature: 0.45,
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
    const generatedAt = new Date().toISOString();

    if (!ai.ok || ai.provider === "none") {
      return json({
        ok: false,
        error: "ai_unavailable",
        provider: ai.provider,
        attempts: ai.attempts,
        latencyMs: ai.latencyMs,
      }, 503);
    }

    const id = crypto.randomUUID();
    return json({
      ok: true,
      item: {
        id,
        ...ai.json,
        metadata: {
          batchId: request.value.batchId,
          cycle: request.value.cycle,
          promptVersion: request.value.promptVersion,
          generatedAt,
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
