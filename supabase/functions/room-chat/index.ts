import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Room data files mapping
const roomFiles: { [key: string]: string } = {
  'abdominal-pain': 'abdominal_pain.json',
  'addiction': 'addiction.json',
  'ai': 'AI-2.json',
  'autoimmune': 'autoimmune_diseases-2.json',
  'burnout': 'burnout-2.json',
  'business-negotiation': 'business_negotiation_compass.json',
  'business-strategy': 'business_strategy-2.json',
  'cancer-support': 'cancer_support-2.json',
  'cardiovascular': 'cardiovascular-2.json',
  'child-health': 'child_health-2.json',
  'cholesterol': 'cholesterol2.json',
  'chronic-fatigue': 'chronic_fatigue-2.json',
  'cough': 'cough-2.json',
  'crypto': 'crypto.json',
  'depression': 'depression.json',
  'diabetes': 'diabetes.json',
  'digestive': 'digestive_system.json',
  'elderly-care': 'elderly_care.json',
  'endocrine': 'endocrine_system.json',
  'exercise-medicine': 'exercise_medicine.json',
  'fever': 'fever.json',
  'finance': 'finance.json',
  'fitness': 'fitness_room.json',
  'food-nutrition': 'food_and_nutrition.json',
  'grief': 'grief.json',
  'gut-brain': 'gut_brain_axis.json',
  'headache': 'headache.json',
  'soul-mate': 'how_to_find_your_soul_mate.json',
  'husband-dealing': 'husband_dealing.json',
  'hypertension': 'hypertension.json',
  'immune-system': 'immune_system.json',
  'immunity-boost': 'immunity_boost.json',
  'injury-bleeding': 'injury_and_bleeding.json',
  'matchmaker': 'matchmaker_traits.json',
  'mens-health': 'men_health.json',
  'mental-health': 'mental_health.json',
  'mindful-movement': 'mindful_movement.json',
  'mindfulness-healing': 'mindfulness_and_healing.json',
  'nutrition-basics': 'nutrition_basics.json',
  'obesity': 'obesity.json',
  'office-survival': 'office_survival.json',
  'pain-management': 'pain_management.json',
  'philosophy': 'philosophy.json',
  'phobia': 'phobia.json',
  'rare-diseases': 'rare_diseases.json',
  'renal-health': 'renal_health.json',
  'reproductive': 'reproductive_health.json',
  'respiratory': 'respiratory_system.json',
  'screening': 'screening_and_prevention.json',
  'sexuality': 'sexuality_and_intimacy.json',
  'skin-health': 'skin_health.json',
  'sleep-health': 'sleep_health.json',
  'social-connection': 'social_connection.json',
  'speaking-crowd': 'speaking_crowd.json',
  'stoicism': 'stoicism.json',
  'stress-anxiety': 'stress_and_anxiety.json',
  'teen': 'teen.json',
  'toddler': 'toddler.json',
  'train-brain': 'train_brain_memory.json',
  'trauma': 'trauma.json',
  'wife-dealing': 'wife_dealing.json',
  'womens-health': 'women_health.json',
};

// Load room data from JSON embedded in this function's folder
async function loadRoomData(roomId: string) {
  try {
    const fileName = roomFiles[roomId];
    if (!fileName) {
      console.log(`Room ${roomId} not found in mapping`);
      return null;
    }

    // Read the JSON from ./data which is bundled with this function
    const fileUrl = new URL(`./data/${fileName}`, import.meta.url);
    console.log(`Attempting to load: ${fileUrl.href}`);

    const fileText = await Deno.readTextFile(fileUrl);
    const json = JSON.parse(fileText);
    return json;
  } catch (error) {
    console.error('Error loading room data:', error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { roomId, message, conversationHistory } = await req.json();
    console.log(`Processing message for room: ${roomId}`);

    if (!roomId || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing roomId or message' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Load room data
    const roomData = await loadRoomData(roomId);
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

// Prepare contextual snippets from room data (truncate to keep prompt small)
function truncate(text: string | undefined, max = 900) {
  return (text || '').toString().slice(0, max);
}

const contextEn = truncate(roomData?.room_essay?.en || roomData?.description?.en);
const contextVi = truncate(roomData?.room_essay?.vi || roomData?.description?.vi);
const crisisEn = truncate(roomData?.crisis_footer?.en);
const crisisVi = truncate(roomData?.crisis_footer?.vi);
const safetyEn = truncate(roomData?.safety_disclaimer?.en);
const safetyVi = truncate(roomData?.safety_disclaimer?.vi);

let keywordsEn = '';
let keywordsVi = '';
try {
  if (roomData?.keywords) {
    const groups = Object.values(roomData.keywords as Record<string, any>);
    if (groups.length > 0) {
      const first = groups[0] as any;
      if (Array.isArray(first?.en)) keywordsEn = first.en.slice(0, 12).join(', ');
      if (Array.isArray(first?.vi)) keywordsVi = first.vi.slice(0, 12).join(', ');
    }
  }
} catch (_) {}

const sampleTitlesEn = Array.isArray(roomData?.entries)
  ? (roomData!.entries as any[]).slice(0, 3).map(e => e?.title?.en).filter(Boolean).join(' | ')
  : '';
const sampleTitlesVi = Array.isArray(roomData?.entries)
  ? (roomData!.entries as any[]).slice(0, 3).map(e => e?.title?.vi).filter(Boolean).join(' | ')
  : '';

// Build system prompt with room context
const systemPrompt = `You are a bilingual health and wellness consultant for the Mercy Blade app, specializing in the "${roomId}" topic.

CRITICAL INSTRUCTIONS:
- ALWAYS respond in BOTH English and Vietnamese
- English text comes FIRST, then Vietnamese
- Format: English paragraph, then blank line, then Vietnamese paragraph
- Be conversational, warm, and educational
- Focus on practical, actionable advice
- Include safety disclaimers when appropriate
- For health topics, always remind users to consult healthcare professionals
- Keep responses concise but informative (2-3 paragraphs max)
- Help Vietnamese speakers improve their English while learning about health

DATA CONTEXT (English):
- Description: ${contextEn}
- Keywords: ${keywordsEn}
- Sample entries: ${sampleTitlesEn}
- Safety: ${safetyEn}
- Crisis: ${crisisEn}

NGỮ CẢNH DỮ LIỆU (Tiếng Việt):
- Mô tả: ${contextVi}
- Từ khóa: ${keywordsVi}
- Mục ví dụ: ${sampleTitlesVi}
- Lưu ý an toàn: ${safetyVi}
- Khẩn cấp: ${crisisVi}

RESPONSE FORMAT:
[English paragraph]

[Đoạn tiếng Việt]
`;

    // Prepare messages
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: message }
    ];

    console.log('Calling Lovable AI...');

    // Call Lovable AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'Đã vượt quá giới hạn yêu cầu. Vui lòng thử lại sau.\n\nRate limit exceeded. Please try again later.' 
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: 'Cần nạp thêm tín dụng. Vui lòng liên hệ quản trị viên.\n\nPayment required. Please contact administrator.' 
          }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'AI service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      console.error('No response from AI');
      return new Response(
        JSON.stringify({ error: 'No response generated' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AI response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        roomId,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in room-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Đã xảy ra lỗi. Vui lòng thử lại.\n\nAn error occurred. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
