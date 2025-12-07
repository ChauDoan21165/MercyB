import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, getClientIP, rateLimitResponse } from "../_shared/rateLimit.ts";
import { logAiUsage, isAiEnabled, isUserAiEnabled, aiDisabledResponse } from "../_shared/aiUsage.ts";

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
  en: "I'm not able to help with medical or emergency situations. Please contact a local doctor, therapist, or emergency service in your area.",
  vi: "Mình không thể hỗ trợ các tình huống y khoa khẩn cấp. Bạn hãy liên hệ bác sĩ, chuyên gia trị liệu hoặc số khẩn cấp tại nơi bạn sống nhé."
};

// Static articles for context injection
const GUIDE_ARTICLES: Record<string, { title_en: string; title_vi: string; body_en: string; body_vi: string }> = {
  "what_is_room": {
    "title_en": "What is a room?",
    "title_vi": "Phòng là gì?",
    "body_en": "A room is a focused space around one topic: calm, self-worth, heartbreak, learning English and more. You can read, listen to audio, and write short reflections.",
    "body_vi": "Một phòng là một không gian tập trung vào một chủ đề: bình yên, giá trị bản thân, tan vỡ, học tiếng Anh và nhiều nữa."
  },
  "how_to_use_room": {
    "title_en": "How do I use a room?",
    "title_vi": "Sử dụng một phòng như thế nào?",
    "body_en": "Start by taking a breath. Listen to audio or read text. Scroll down to reflection and write one honest sentence.",
    "body_vi": "Hãy bắt đầu bằng một hơi thở. Nghe audio hoặc đọc chữ. Cuộn xuống ô reflection và viết một câu chân thật."
  },
  "how_to_use_paths": {
    "title_en": "What is a path?",
    "title_vi": "Path là gì?",
    "body_en": "A path is a gentle sequence of days around one healing theme. Each day has text, audio, reflection, and a dare.",
    "body_vi": "Path là một chuỗi ngày nhẹ nhàng xoay quanh một chủ đề hồi phục."
  },
  "language_switch": {
    "title_en": "How do English and Vietnamese work together?",
    "title_vi": "Tiếng Anh và tiếng Việt hoạt động cùng nhau thế nào?",
    "body_en": "Most rooms are bilingual. Switch to English for learning, Vietnamese for comfort.",
    "body_vi": "Hầu hết các phòng đều song ngữ."
  },
  "where_to_start": {
    "title_en": "Where should I start?",
    "title_vi": "Mình nên bắt đầu từ đâu?",
    "body_en": "If overwhelmed, start with Calm Mind 7 Days. For heartache, choose a healing room. For English, open a learning room.",
    "body_vi": "Nếu quá tải, hãy bắt đầu với Bình Tâm 7 Ngày."
  }
};

const SYSTEM_PROMPT = `You are Mercy Guide, a warm in-app assistant for the Mercy Blade application.
Your job:
- Help users understand how to use the app, rooms, paths, audio, reflections, languages, and progress.
- Be gentle, short, and clear.
- You may explain what a room is, how to move through a path, how to combine English and Vietnamese, how to build a habit, how to come back after a break.
- You can offer emotional validation in soft, general terms (e.g. "It is okay to go slowly."), but you MUST NOT:
  - give medical, diagnostic, or crisis advice,
  - tell people what treatment or medication they should use,
  - replace a doctor, therapist, or emergency service.
- If user asks for medical or crisis help, gently tell them that Mercy Blade cannot provide medical or emergency support and encourage them to contact local professionals or emergency services.
- Prefer bilingual answers when helpful: start in the user's selected language, then optionally add a short line in the other language.
- Keep answers under 150 words.`;

function containsCrisisKeywords(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => lower.includes(keyword));
}

function findRelevantArticle(question: string): string | null {
  const lower = question.toLowerCase();
  if (lower.includes('room') || lower.includes('phòng')) {
    if (lower.includes('how') || lower.includes('use') || lower.includes('cách') || lower.includes('sử dụng')) {
      return 'how_to_use_room';
    }
    return 'what_is_room';
  }
  if (lower.includes('path') || lower.includes('calm mind') || lower.includes('bình tâm') || lower.includes('7 day') || lower.includes('7 ngày')) {
    return 'how_to_use_paths';
  }
  if (lower.includes('english') || lower.includes('vietnamese') || lower.includes('tiếng') || lower.includes('language') || lower.includes('ngôn ngữ')) {
    return 'language_switch';
  }
  if (lower.includes('start') || lower.includes('begin') || lower.includes('bắt đầu') || lower.includes('where')) {
    return 'where_to_start';
  }
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting by IP
  const clientIP = getClientIP(req);
  const rateCheck = checkRateLimit(`guide-assistant:${clientIP}`, RATE_LIMIT_CONFIG);
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
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
        // Check per-user AI setting
        if (!await isUserAiEnabled(userId)) {
          return aiDisabledResponse('user', corsHeaders);
        }
      }
    }

    const { question, roomId, roomTitle, language = 'en', context } = await req.json();

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Question is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Safety check - return templated response for crisis keywords
    if (containsCrisisKeywords(question)) {
      const answer = language === 'vi' 
        ? `${SAFE_RESPONSE.vi}\n\n${SAFE_RESPONSE.en}`
        : `${SAFE_RESPONSE.en}\n\n${SAFE_RESPONSE.vi}`;
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

    // Build context for the AI
    let contextInfo = '';
    if (roomTitle) contextInfo += `Current room: ${roomTitle}\n`;
    if (context?.tier) contextInfo += `User tier: ${context.tier}\n`;
    if (context?.pathSlug) contextInfo += `Current path: ${context.pathSlug}\n`;
    if (context?.tags?.length) contextInfo += `Room tags: ${context.tags.join(', ')}\n`;

    // Find relevant article
    const articleKey = findRelevantArticle(question);
    if (articleKey && GUIDE_ARTICLES[articleKey]) {
      const article = GUIDE_ARTICLES[articleKey];
      contextInfo += `\nRelevant guide article:\nEN: ${article.body_en}\nVI: ${article.body_vi}\n`;
    }

    const userMessage = `User's preferred language: ${language === 'vi' ? 'Vietnamese' : 'English'}
${contextInfo}
User question: ${question}`;

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
        max_tokens: 300,
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
    const answer = data.choices?.[0]?.message?.content || 'I could not generate an answer. Please try again.';

    // Log AI usage
    const usage = data.usage;
    if (usage) {
      await logAiUsage({
        userId,
        model: 'gpt-4o-mini',
        tokensInput: usage.prompt_tokens || 0,
        tokensOutput: usage.completion_tokens || 0,
        endpoint: 'guide-assistant',
      });
    }

    return new Response(
      JSON.stringify({ ok: true, answer }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Guide assistant error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: 'An error occurred. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
