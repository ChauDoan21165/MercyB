import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabaseAdmin = (supabaseUrl && supabaseServiceRoleKey)
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client is not configured');
  }

  return supabaseAdmin;
}

function normalizeTokenCount(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    .test(value);
}

/**
 * Cost per 1K tokens for different models
 */
export function getPricePer1k(model: string): { input: number; output: number } {
  const m = model.toLowerCase();

  // GPT-5 models
  if (m.includes('gpt-5')) return { input: 0.005, output: 0.015 };

  // GPT-4.1 models
  if (m.includes('gpt-4.1')) return { input: 0.005, output: 0.015 };

  // GPT-4o models
  if (m.includes('gpt-4o-mini')) return { input: 0.00015, output: 0.0006 };
  if (m.includes('gpt-4o')) return { input: 0.0025, output: 0.01 };

  // Whisper (audio transcription) - per second pricing converted to tokens estimate
  if (m.includes('whisper')) return { input: 0.006, output: 0 };

  // Default fallback
  return { input: 0.0015, output: 0.002 };
}

/**
 * Log AI usage to ai_usage_events.
 *
 * This is the raw event table that feeds rollups and summaries.
 * Keep the insert payload limited to columns that are known to exist
 * across environments: user_id, model, tokens_input, tokens_output, cost_usd.
 */
export async function logAiUsage(params: {
  userId: string | null;
  model: string;
  tokensInput: number;
  tokensOutput: number;
  endpoint?: string;
}): Promise<number> {
  const tokensInput = normalizeTokenCount(params.tokensInput);
  const tokensOutput = normalizeTokenCount(params.tokensOutput);

  const prices = getPricePer1k(params.model);
  const cost =
    (tokensInput / 1000) * prices.input +
    (tokensOutput / 1000) * prices.output;

  if (!params.userId || !isUuid(params.userId)) {
    console.warn('Skipping ai_usage_events insert because userId is missing or invalid', {
      userId: params.userId,
      model: params.model,
      endpoint: params.endpoint ?? null,
    });
    return cost;
  }

  const payload = {
    user_id: params.userId,
    model: params.model,
    tokens_input: tokensInput,
    tokens_output: tokensOutput,
    cost_usd: cost,
  };

  try {
    const { error } = await getSupabaseAdmin()
      .from('ai_usage_events')
      .insert(payload);

    if (error) {
      console.error('Failed to log AI usage event:', {
        error,
        payload,
        endpoint: params.endpoint ?? null,
      });
    }
  } catch (error) {
    console.error('Failed to log AI usage event:', {
      error,
      payload,
      endpoint: params.endpoint ?? null,
    });
  }

  return cost;
}

/**
 * Check if AI is globally enabled
 */
export async function isAiEnabled(): Promise<boolean> {
  const { data } = await getSupabaseAdmin()
    .from('ai_settings')
    .select('is_ai_enabled')
    .single();

  return data?.is_ai_enabled ?? true;
}

/**
 * Check if AI is enabled for a specific user
 */
export async function isUserAiEnabled(userId: string): Promise<boolean> {
  const { data } = await getSupabaseAdmin()
    .from('profiles')
    .select('ai_enabled')
    .eq('id', userId)
    .single();

  return data?.ai_enabled ?? true;
}

/**
 * Create AI disabled response
 */
export function aiDisabledResponse(
  reason: 'global' | 'user',
  corsHeaders: Record<string, string>
): Response {
  const message = reason === 'global'
    ? 'Mercy AI is temporarily offline for maintenance.'
    : 'AI features are disabled for your account.';

  return new Response(
    JSON.stringify({ ok: false, error: message }),
    {
      status: reason === 'global' ? 503 : 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

/**
 * VND cost for a call, using the same method as ai-chat (USD_TO_VND env, default 26000).
 */
export function estimateOpenAICostVnd(params: {
  model: string;
  inputTokens: number;
  outputTokens: number;
}): number {
  const usdToVnd = Number(Deno.env.get('USD_TO_VND') || '26000');
  const prices = getPricePer1k(params.model);
  const inputUsd = (normalizeTokenCount(params.inputTokens) / 1000) * prices.input;
  const outputUsd = (normalizeTokenCount(params.outputTokens) / 1000) * prices.output;
  return Number(((inputUsd + outputUsd) * usdToVnd).toFixed(2));
}

/**
 * "<native>-en" language-pair tag, matching ai-chat's cost-per-language format
 * (feat/cost-per-language / !2582). Returns null when native language is unknown.
 */
export function deriveLanguagePair(
  native: string | null | undefined,
  target = 'en',
): string | null {
  const n = String(native ?? '').trim().toLowerCase();
  if (!n) return null;
  return `${n}-${target}`;
}

/**
 * Resolve a user's language_pair from profiles.native_language. Best-effort:
 * returns null on any failure (missing profile, DB error). Never throws.
 */
export async function resolveLanguagePairForUser(userId: string): Promise<string | null> {
  try {
    const { data } = await getSupabaseAdmin()
      .from('profiles')
      .select('native_language')
      .eq('id', userId)
      .single();
    return deriveLanguagePair(
      (data as { native_language?: string | null } | null)?.native_language,
    );
  } catch {
    return null;
  }
}

/**
 * Log an AI-spend row to ai_usage_logs — the table the admin CostMonitoring page
 * reads and the ai-chat cost cap uses — VND-costed and language-tagged.
 *
 * Contract:
 * - ai_usage_logs.user_id is NOT NULL: a missing/invalid userId SKIPS the row
 *   (console.warn) rather than inserting a fabricated user.
 * - FIRE-AND-FORGET: never throws; a logging failure must not fail the caller.
 *   Callers should not await this on the response hot path (use it in the
 *   background) so a slow/failed insert can't delay the learner's reply.
 */
export async function logAiUsageLog(params: {
  userId: string | null;
  feature: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  languagePair?: string | null;
  conversationId?: string | null;
  requestId?: string | null;
  meta?: Record<string, unknown>;
}): Promise<void> {
  if (!params.userId || !isUuid(params.userId)) {
    console.warn('Skipping ai_usage_logs insert: missing/invalid userId', {
      feature: params.feature,
    });
    return;
  }

  const estimatedCostVnd = estimateOpenAICostVnd({
    model: params.model,
    inputTokens: params.inputTokens,
    outputTokens: params.outputTokens,
  });

  try {
    const { error } = await getSupabaseAdmin()
      .from('ai_usage_logs')
      .insert({
        user_id: params.userId,
        feature: params.feature,
        model: params.model,
        request_id: params.requestId ?? null,
        input_tokens: normalizeTokenCount(params.inputTokens),
        output_tokens: normalizeTokenCount(params.outputTokens),
        estimated_cost_vnd: estimatedCostVnd,
        language_pair: params.languagePair ?? null,
        meta: params.meta ?? {},
        conversation_id: params.conversationId ?? null,
      });

    if (error) {
      console.warn('Failed to log ai_usage_logs:', {
        error,
        feature: params.feature,
      });
    }
  } catch (error) {
    console.warn('Failed to log ai_usage_logs:', {
      error,
      feature: params.feature,
    });
  }
}

/**
 * Best-effort wrapper around logAiUsageLog for response paths.
 *
 * - Resolves language_pair (best-effort) when not supplied, then logs.
 * - NEVER fails the caller: every failure is swallowed with a console.warn.
 * - Returns the task so Supabase Edge callers can await it before responding.
 *   Where EdgeRuntime.waitUntil exists, it is also registered there.
 * - No fabricated numbers: callers should only invoke this when the provider
 *   returned real token usage (skip it entirely otherwise).
 */
export function logAiUsageLogBackground(params: {
  userId: string | null;
  feature: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  languagePair?: string | null;
  conversationId?: string | null;
  requestId?: string | null;
  meta?: Record<string, unknown>;
}): Promise<void> {
  const task = (async () => {
    if (!params.userId) {
      console.warn(`[${params.feature}] no user id; skipping ai_usage_logs row`);
      return;
    }
    const languagePair = params.languagePair ??
      (await resolveLanguagePairForUser(params.userId));
    await logAiUsageLog({ ...params, languagePair });
  })().catch((e) =>
    console.warn(`[${params.feature}] ai_usage_logs background logging failed:`, e)
  );

  try {
    const er = (globalThis as {
      EdgeRuntime?: { waitUntil?: (p: Promise<unknown>) => void };
    }).EdgeRuntime;
    if (er?.waitUntil) er.waitUntil(task);
    else void task;
  } catch {
    void task;
  }

  return task;
}
