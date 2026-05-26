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