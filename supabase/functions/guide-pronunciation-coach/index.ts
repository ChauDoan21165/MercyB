import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.1";
import { checkRateLimit, getClientIP, rateLimitResponse } from "../_shared/rateLimit.ts";
import { logAiUsage, isAiEnabled, isUserAiEnabled, aiDisabledResponse } from "../_shared/aiUsage.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limit: 10 requests per minute per IP (lower since audio processing is expensive)
const RATE_LIMIT_CONFIG = { maxRequests: 10, windowMs: 60000 };

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

// Simple text similarity (word overlap)
function calculateSimilarity(target: string, transcribed: string): number {
  const normalize = (s: string) => s.toLowerCase().replace(/[^\w\s]/g, '').trim();
  const targetWords = normalize(target).split(/\s+/).filter(Boolean);
  const transcribedWords = normalize(transcribed).split(/\s+/).filter(Boolean);
  
  if (targetWords.length === 0) return 0;
  
  let matches = 0;
  for (const word of targetWords) {
    if (transcribedWords.includes(word)) matches++;
  }
  
  return Math.round((matches / targetWords.length) * 100);
}

// Safety check for crisis/medical content
function containsCrisisContent(text: string): boolean {
  const crisisPatterns = [
    /\b(suicide|suicidal|kill myself|end my life|want to die)\b/i,
    /\b(self.?harm|cut myself|hurt myself)\b/i,
    /\b(overdose|medication|prescription|diagnosis)\b/i,
  ];
  return crisisPatterns.some(p => p.test(text));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting by IP
  const clientIP = getClientIP(req);
  const rateCheck = checkRateLimit(`guide-pronunciation-coach:${clientIP}`, RATE_LIMIT_CONFIG);
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
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } }
      });
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
        if (!await isUserAiEnabled(userId)) {
          return aiDisabledResponse('user', corsHeaders);
        }
      }
    }

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Parse request body
    const body = await req.json();
    const { audioBase64, targetText, englishLevel = 'beginner', preferredName } = body;

    // Truncate target text if too long
    const truncatedTarget = (targetText || '').slice(0, 120);

    // Safety check
    if (containsCrisisContent(truncatedTarget)) {
      return new Response(
        JSON.stringify({
          ok: true,
          targetText: truncatedTarget,
          transcribedText: '',
          score: 0,
          feedback: {
            praise_en: "I'm here to help you practice speaking, but I can't safely support medical or emergency situations.",
            praise_vi: "Mình ở đây để giúp bạn luyện nói, nhưng mình không thể hỗ trợ an toàn cho các tình huống y khoa hoặc khẩn cấp.",
            focus_items: [],
            encouragement_en: "Please reach out to a local doctor, therapist, or emergency service for real human support.",
            encouragement_vi: "Bạn hãy tìm tới bác sĩ, chuyên gia trị liệu, hoặc số khẩn cấp để được hỗ trợ trực tiếp."
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert base64 to binary
    const audioData = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
    const audioBlob = new Blob([audioData], { type: 'audio/webm' });

    // Step 1: Transcribe using OpenAI Whisper
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      const errorText = await transcriptionResponse.text();
      console.error('Whisper API error:', errorText);
      throw new Error('Failed to transcribe audio');
    }

    const transcriptionResult = await transcriptionResponse.json();
    const transcribedText = transcriptionResult.text || '';

    // Step 2: Calculate similarity score
    const score = calculateSimilarity(truncatedTarget, transcribedText);

    // Step 3: Generate feedback using chat model
    const systemPrompt = `You are Mercy Guide, a very kind English pronunciation coach.
The user is practicing a short English phrase.
You are given:
- target_text: what they tried to say
- heard_text: what the speech recognizer heard
- level: their English level

Your goals:
- Be very gentle and supportive.
- Always begin with praise, even if accuracy is low.
- Then give 1–3 small tips, never more.
- Focus on sounds and words, not on complex phonetic theory.
- Use simple descriptions like "make the 'th' softer" or "open your mouth a bit more on 'a' in 'calm'".
- Adjust depth to level:
  - beginner → ultra simple, maybe just 1 focus word
  - lower_intermediate → 2 focus words or syllables
  - intermediate / advanced → can mention stress / linking softly
- Do NOT shame the user. Never say "bad" or "wrong". Use phrases like "can be softer", "can be clearer".
- Include a short encouragement line at the end.
- If accuracy is high, say so clearly and celebrate.

Reply ONLY in a JSON structure (no code fences) matching:
{
  "praise_en": string,
  "praise_vi": string,
  "focus_items": [
    {
      "word": string,
      "tip_en": string,
      "tip_vi": string
    }
  ],
  "encouragement_en": string,
  "encouragement_vi": string
}`;

    const userPrompt = `Target text: "${truncatedTarget}"
Heard text: "${transcribedText}"
English level: ${englishLevel}
${preferredName ? `User's name: ${preferredName}` : ''}
Similarity score: ${score}/100

Please provide gentle pronunciation feedback.`;

    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!chatResponse.ok) {
      const errorText = await chatResponse.text();
      console.error('Chat API error:', errorText);
      throw new Error('Failed to generate feedback');
    }

    const chatResult = await chatResponse.json();
    const feedbackText = chatResult.choices?.[0]?.message?.content || '';

    // Parse the feedback JSON
    let feedback;
    try {
      feedback = JSON.parse(feedbackText);
    } catch {
      // Fallback feedback if parsing fails
      feedback = {
        praise_en: "Thank you for trying. Speaking out loud is already a brave step.",
        praise_vi: "Cảm ơn bạn đã thử. Dám nói ra thành tiếng đã là một bước rất can đảm rồi.",
        focus_items: [],
        encouragement_en: "Keep practicing, you are doing great!",
        encouragement_vi: "Tiếp tục luyện tập nhé, bạn làm tốt lắm!"
      };
    }

    // Log AI usage
    const chatUsage = chatResult.usage;
    if (chatUsage) {
      await logAiUsage({
        userId,
        model: 'gpt-4o-mini',
        tokensInput: chatUsage.prompt_tokens || 0,
        tokensOutput: chatUsage.completion_tokens || 0,
        endpoint: 'guide-pronunciation-coach'
      });
    }

    // Update last_english_activity if user is authenticated
    if (userId) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          global: { headers: { Authorization: authHeader! } }
        });
        await supabase
          .from('companion_state')
          .upsert({
            user_id: userId,
            last_english_activity: new Date().toISOString(),
            last_active_at: new Date().toISOString(),
          });
      } catch (e) {
        console.error('Failed to update companion_state:', e);
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        targetText: truncatedTarget,
        transcribedText,
        score,
        feedback,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Pronunciation coach error:', error);
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
