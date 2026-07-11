import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, getClientIP, rateLimitResponse } from "../_shared/rateLimit.ts";
import { logAiUsage, isAiEnabled, isUserAiEnabled, aiDisabledResponse, logAiUsageLogBackground } from "../_shared/aiUsage.ts";
import { SAFE_RESPONSE, SAFE_ENCOURAGEMENT } from "../_shared/crisisResponse.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limit: 20 requests per minute per IP
const RATE_LIMIT_CONFIG = { maxRequests: 20, windowMs: 60000 };
const OPENAI_TIMEOUT_MS = 15_000;

// Safety keywords that trigger templated response
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'want to die', 'end my life', 'self-harm', 'hurt myself',
  'tự tử', 'muốn chết', 'kết thúc cuộc sống', 'tự làm hại',
  'medication', 'diagnosis', 'prescribe', 'thuốc', 'chẩn đoán', 'kê đơn'
];

// SAFE_RESPONSE + SAFE_ENCOURAGEMENT now live in
// ../_shared/crisisResponse.ts (single source of truth, shared with
// guide-assistant). The crisis-keyword detection + gate below are
// unchanged; only the wording moved, and the VI is now native (not a
// translation) in Mercy's canonical informal register.

const SYSTEM_PROMPT = `You are Mercy Guide, an in-app English helper for Mercy Blade.
The user is reading emotional, healing content and wants to learn simple English from it.

Your goals:
- Teach tiny pieces: 3–5 words or phrases at a time.
- Always show: English → Vietnamese meaning → one simple example sentence.
- Match the user's English level:
  - beginner: ultra simple words and sentences
  - lower_intermediate: still simple but can use short phrases
  - intermediate: can use longer phrases and short explanations
  - advanced: can point out nuance but stay kind and clear
- Keep explanations short and warm, not like a textbook.
- You are NOT a therapist or doctor. Do not give medical or crisis advice. Stay in language learning and gentle encouragement.

IMPORTANT: Return your response as valid JSON with this exact structure:
{
  "intro_en": "short intro in English",
  "intro_vi": "short intro in Vietnamese",
  "items": [
    {
      "word": "English word/phrase",
      "meaning_vi": "Vietnamese meaning",
      "example_en": "Example sentence in English",
      "example_vi": "Example sentence in Vietnamese"
    }
  ],
  "encouragement_en": "short encouraging closing in English",
  "encouragement_vi": "short encouraging closing in Vietnamese"
}

Keep items to 3-5 entries. Be warm and supportive.`;

function containsCrisisKeywords(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => lower.includes(keyword));
}

const loggedMissingEnv = new Set<string>();

function getRequiredEnv(name: string): string | null {
  const value = Deno.env.get(name)?.trim() ?? "";
  if (value) return value;
  if (!loggedMissingEnv.has(name)) {
    console.error(`[guide-english-helper] Missing required env ${name}`);
    loggedMissingEnv.add(name);
  }
  return null;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(
    JSON.stringify(body),
    { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting by IP
  const clientIP = getClientIP(req);
  const rateCheck = checkRateLimit(`guide-english-helper:${clientIP}`, RATE_LIMIT_CONFIG);
  if (!rateCheck.allowed) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`);
    return rateLimitResponse(rateCheck.retryAfterSeconds!, corsHeaders);
  }

  try {
    // Check if AI is globally enabled
    if (!await isAiEnabled()) {
      return aiDisabledResponse('global', corsHeaders);
    }

    // Get user ID if authenticated
    let userId: string | null = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const supabaseUrl = getRequiredEnv('SUPABASE_URL');
      const supabaseAnonKey = getRequiredEnv('SUPABASE_ANON_KEY');
      if (!supabaseUrl || !supabaseAnonKey) {
        return jsonResponse(
          { ok: false, error: 'English helper is temporarily unavailable' },
          500,
        );
      }
      const supabase = createClient(
        supabaseUrl,
        supabaseAnonKey,
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
        if (!await isUserAiEnabled(userId)) {
          return aiDisabledResponse('user', corsHeaders);
        }
      }
    }

    const { 
      roomId, 
      roomTitle, 
      language = 'en', 
      englishLevel = 'beginner',
      sourceText,
      userQuestion 
    } = await req.json();

    if (!sourceText || typeof sourceText !== 'string' || sourceText.trim().length === 0) {
      return jsonResponse({ ok: false, error: 'Source text is required' }, 400);
    }

    // Safety check
    if (containsCrisisKeywords(userQuestion || '') || containsCrisisKeywords(sourceText)) {
      const answer = JSON.stringify({
        intro_en: SAFE_RESPONSE.en,
        intro_vi: SAFE_RESPONSE.vi,
        items: [],
        encouragement_en: SAFE_ENCOURAGEMENT.en,
        encouragement_vi: SAFE_ENCOURAGEMENT.vi
      });
      return jsonResponse({ ok: true, answer });
    }

    const openaiKey = getRequiredEnv('OPENAI_API_KEY');
    if (!openaiKey) {
      return jsonResponse({ ok: false, error: 'English helper is temporarily unavailable' }, 500);
    }

    // Truncate source text if too long
    const truncatedText = sourceText.slice(0, 1200);

    const userMessage = `User's English level: ${englishLevel}
User's preferred language for explanations: ${language === 'vi' ? 'Vietnamese' : 'English'}
${roomTitle ? `Current room: ${roomTitle}` : ''}

Source text from the room:
"""
${truncatedText}
"""

${userQuestion ? `User's question: ${userQuestion}` : 'Please teach me simple English words and phrases from this text.'}

Remember to return valid JSON only.`;

    // Call OpenAI
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });
    } catch (error) {
      const isAbort = error instanceof Error && error.name === 'AbortError';
      if (isAbort) {
        console.error('OpenAI API timed out for guide-english-helper');
        return jsonResponse({ ok: false, error: 'English helper timed out. Please try again.' }, 504);
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return jsonResponse({ ok: false, error: 'Failed to get AI response' }, 500);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || '{}';

    // Log AI usage
    const usage = data.usage;
    if (usage) {
      await logAiUsage({
        userId,
        model: 'gpt-4o-mini',
        tokensInput: usage.prompt_tokens || 0,
        tokensOutput: usage.completion_tokens || 0,
        endpoint: 'guide-english-helper',
      });
      // Additive: also record VND-costed, language-tagged spend to ai_usage_logs
      // (the CostMonitoring table). Fire-and-forget; never delays the reply.
      logAiUsageLogBackground({
        userId,
        feature: 'guide-english-helper',
        model: 'gpt-4o-mini',
        inputTokens: usage.prompt_tokens || 0,
        outputTokens: usage.completion_tokens || 0,
      });
    }

    // Update last_english_activity for the user if authenticated
    if (userId) {
      try {
        const supabaseUrl = getRequiredEnv('SUPABASE_URL');
        const supabaseServiceKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');
        if (!supabaseUrl || !supabaseServiceKey) {
          console.error('Skipping last_english_activity update because Supabase admin env is missing');
          return jsonResponse({ ok: true, answer });
        }
        const supabaseAdmin = createClient(
          supabaseUrl,
          supabaseServiceKey
        );
        await supabaseAdmin
          .from('companion_state')
          .upsert({
            user_id: userId,
            last_english_activity: new Date().toISOString(),
            last_active_at: new Date().toISOString(),
          });
      } catch (updateError) {
        console.error('Failed to update last_english_activity:', updateError);
      }
    }

    return jsonResponse({ ok: true, answer });

  } catch (error) {
    console.error('English helper error:', error);
    return jsonResponse({ ok: false, error: 'An error occurred. Please try again.' }, 500);
  }
});
