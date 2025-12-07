import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
 * Log AI usage to database
 */
export async function logAiUsage(params: {
  userId: string | null;
  model: string;
  tokensInput: number;
  tokensOutput: number;
  endpoint?: string;
}): Promise<number> {
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const prices = getPricePer1k(params.model);
  const cost =
    (params.tokensInput / 1000) * prices.input +
    (params.tokensOutput / 1000) * prices.output;

  try {
    await supabaseAdmin.from('ai_usage_events').insert({
      user_id: params.userId,
      model: params.model,
      tokens_input: params.tokensInput,
      tokens_output: params.tokensOutput,
      cost_usd: cost,
      endpoint: params.endpoint,
    });
  } catch (error) {
    console.error('Failed to log AI usage:', error);
  }

  return cost;
}

/**
 * Check if AI is globally enabled
 */
export async function isAiEnabled(): Promise<boolean> {
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data } = await supabaseAdmin
    .from('ai_settings')
    .select('is_ai_enabled')
    .single();

  return data?.is_ai_enabled ?? true;
}

/**
 * Check if AI is enabled for a specific user
 */
export async function isUserAiEnabled(userId: string): Promise<boolean> {
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data } = await supabaseAdmin
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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}
