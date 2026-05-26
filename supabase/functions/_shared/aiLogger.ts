import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface AIUsageEntry {
  user_id?: string;
  model: string;
  tokens_input: number;
  tokens_output: number;
  cost_usd: number;
  status?: 'success' | 'error' | 'timeout';
  endpoint?: string;
  request_duration_ms?: number;
  error_message?: string;
  metadata?: Record<string, any>;
}

/**
 * Log AI usage to ai_usage table
 * Use for tracking TTS, chat, embeddings, summarization, and all AI model calls
 */
export async function logAIUsage(
  client: SupabaseClient,
  entry: AIUsageEntry
): Promise<void> {
  try {
    const { error } = await client.from('ai_usage').insert({
      user_id: entry.user_id || null,
      model: entry.model,
      tokens_input: entry.tokens_input || 0,
      tokens_output: entry.tokens_output || 0,
      cost_usd: entry.cost_usd || 0,
      status: entry.status || 'success',
      endpoint: entry.endpoint || null,
      request_duration_ms: entry.request_duration_ms || null,
      error_message: entry.error_message || null,
      metadata: entry.metadata || {},
    });

    if (error) {
      console.error('Failed to write AI usage log:', error);
    }
  } catch (error) {
    console.error('AI usage log error:', error);
  }
}

/**
 * Calculate cost based on model and tokens
 * Prices as of 2024 (adjust as needed)
 */
export function calculateCost(
  model: string,
  tokensInput: number,
  tokensOutput: number
): number {
  const prices: Record<string, { input: number; output: number }> = {
    'gpt-4': { input: 0.03, output: 0.06 }, // per 1K tokens
    'gpt-4-turbo': { input: 0.01, output: 0.03 },
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
    'gpt-4o': { input: 0.005, output: 0.015 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'text-embedding-3-small': { input: 0.00002, output: 0 },
    'text-embedding-3-large': { input: 0.00013, output: 0 },
    'whisper-1': { input: 0.006, output: 0 }, // per minute
    'tts-1': { input: 0.015, output: 0 }, // per 1K chars
    'tts-1-hd': { input: 0.030, output: 0 },
  };

  const modelPricing = prices[model] || { input: 0.001, output: 0.002 }; // default fallback

  const inputCost = (tokensInput / 1000) * modelPricing.input;
  const outputCost = (tokensOutput / 1000) * modelPricing.output;

  return inputCost + outputCost;
}

/**
 * Common AI endpoints for consistency
 */
export const AI_ENDPOINTS = {
  CHAT_ROOM: 'chat-room',
  TTS_GENERATION: 'tts-generation',
  EMBEDDING_GENERATION: 'embedding-generation',
  SUMMARIZATION: 'summarization',
  TRANSLATION: 'translation',
  MODERATION_CHECK: 'moderation-check',
} as const;
