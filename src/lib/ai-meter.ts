// PATH: src/lib/ai-meter.ts

import { createClient } from "@supabase/supabase-js";

type Pricing = {
  inputUsdPer1M: number;
  outputUsdPer1M: number;
};

const USD_TO_VND = Number(process.env.USD_TO_VND ?? "26000");

const MODEL_PRICING: Record<string, Pricing> = {
  "gpt-4o-mini": {
    inputUsdPer1M: Number(process.env.GPT_4O_MINI_INPUT_USD_PER_1M ?? "0.15"),
    outputUsdPer1M: Number(process.env.GPT_4O_MINI_OUTPUT_USD_PER_1M ?? "0.60"),
  },
  "gpt-4.1-mini": {
    inputUsdPer1M: Number(process.env.GPT_41_MINI_INPUT_USD_PER_1M ?? "0.40"),
    outputUsdPer1M: Number(process.env.GPT_41_MINI_OUTPUT_USD_PER_1M ?? "1.60"),
  },
};

export function estimateOpenAICostVnd(params: {
  model: string;
  inputTokens: number;
  outputTokens: number;
}): number {
  const pricing = MODEL_PRICING[params.model];
  if (!pricing) return 0;

  const inputUsd = (params.inputTokens / 1_000_000) * pricing.inputUsdPer1M;
  const outputUsd = (params.outputTokens / 1_000_000) * pricing.outputUsdPer1M;
  const totalUsd = inputUsd + outputUsd;

  return Number((totalUsd * USD_TO_VND).toFixed(4));
}

export async function checkAiBudget(params: {
  supabaseAdmin: ReturnType<typeof createClient>;
  userId: string;
  requestReserveVnd?: number;
}) {
  const { data, error } = await (params.supabaseAdmin as any).rpc("check_ai_budget", {
    p_user_id: params.userId,
    p_request_reserve_vnd: params.requestReserveVnd ?? 0,
  });

  if (error) throw error;

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) {
    throw new Error("Could not read AI budget.");
  }

  return row as {
    allowed: boolean;
    message: string;
    plan_name: string | null;
    monthly_revenue_vnd: number;
    ai_cost_vnd: number;
    cutoff_vnd: number;
    remaining_vnd: number;
    usage_ratio: number;
    reset_at: string;
  };
}

export async function logAiUsage(params: {
  supabaseAdmin: ReturnType<typeof createClient>;
  userId: string;
  feature: string;
  model: string;
  requestId?: string | null;
  inputTokens: number;
  outputTokens: number;
  estimatedCostVnd: number;
  meta?: Record<string, unknown>;
}) {
  const { error } = await (params.supabaseAdmin as any)
    .from("ai_usage_logs")
    .insert({
      user_id: params.userId,
      feature: params.feature,
      model: params.model,
      request_id: params.requestId ?? null,
      input_tokens: params.inputTokens,
      output_tokens: params.outputTokens,
      estimated_cost_vnd: params.estimatedCostVnd,
      meta: params.meta ?? {},
    } as any);

  if (error) throw error;
}