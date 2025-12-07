import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, getClientIP, rateLimitResponse } from "../_shared/rateLimit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limit: 20 requests per minute per IP
const RATE_LIMIT_CONFIG = { maxRequests: 20, windowMs: 60000 };

// Safety keywords that trigger templated response
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'want to die', 'end my life', 'self-harm', 'hurt myself',
  'tự tử', 'muốn chết', 'kết thúc cuộc sống', 'tự làm hại',
  'medication', 'diagnosis', 'prescribe', 'thuốc', 'chẩn đoán', 'kê đơn'
];

const SAFE_RESPONSE = {
  en: "I'm here to help you use the app and learn language, but I can't safely support medical or emergency situations. Please reach out to a local doctor, therapist, trusted person, or emergency service in your area. You deserve real, human support with this.",
  vi: "Mình ở đây để giúp bạn dùng ứng dụng và học ngôn ngữ, nhưng mình không thể hỗ trợ an toàn cho các tình huống y khoa hoặc khẩn cấp. Bạn hãy tìm tới bác sĩ, chuyên gia trị liệu, người mà bạn tin tưởng, hoặc số khẩn cấp tại nơi bạn sống. Bạn xứng đáng nhận được sự hỗ trợ trực tiếp, thật sự."
};

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
    const { 
      roomId, 
      roomTitle, 
      language = 'en', 
      englishLevel = 'beginner',
      sourceText,
      userQuestion 
    } = await req.json();

    if (!sourceText || typeof sourceText !== 'string' || sourceText.trim().length === 0) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Source text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Safety check
    if (containsCrisisKeywords(userQuestion || '') || containsCrisisKeywords(sourceText)) {
      const answer = JSON.stringify({
        intro_en: SAFE_RESPONSE.en,
        intro_vi: SAFE_RESPONSE.vi,
        items: [],
        encouragement_en: "Please take care of yourself.",
        encouragement_vi: "Hãy chăm sóc bản thân bạn nhé."
      });
      return new Response(
        JSON.stringify({ ok: true, answer }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      return new Response(
        JSON.stringify({ ok: false, error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to get AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || '{}';

    // Update last_english_activity for the user if authenticated
    try {
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const supabaseAdmin = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );
        
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabaseAdmin.auth.getUser(token);
        
        if (user) {
          await supabaseAdmin
            .from('companion_state')
            .upsert({
              user_id: user.id,
              last_english_activity: new Date().toISOString(),
              last_active_at: new Date().toISOString(),
            });
        }
      }
    } catch (updateError) {
      console.error('Failed to update last_english_activity:', updateError);
      // Don't fail the request for this
    }

    return new Response(
      JSON.stringify({ ok: true, answer }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('English helper error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
