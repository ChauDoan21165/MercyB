import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Room data files mapping
const roomFiles: { [key: string]: string } = {
  'ai': 'AI.json',
  'autoimmune': 'autoimmune_diseases.json',
  'burnout': 'burnout.json',
  'business-strategy': 'business_strategy.json',
  'cancer-support': 'cancer_support.json',
  'cardiovascular': 'cardiovascular.json',
  'child-health': 'child_health.json',
  'cholesterol': 'cholesterol.json',
  'chronic-fatigue': 'chronic_fatigue.json',
  'cough': 'cough.json',
};

// Load room data from JSON
async function loadRoomData(roomId: string) {
  try {
    const fileName = roomFiles[roomId];
    if (!fileName) {
      console.log(`Room ${roomId} not found in mapping`);
      return null;
    }

    // Read the file from the project
    const dataPath = `../../data/rooms/${fileName}`;
    console.log(`Attempting to load: ${dataPath}`);
    
    // For now, return a placeholder - in production, we'd load from storage
    return {
      roomId,
      description: "Room data loaded",
      note: "Using AI with room context"
    };
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

    // Build system prompt with room context
    const systemPrompt = `You are a bilingual health and wellness consultant for the Mercy Blade app, specializing in the "${roomId}" topic.

CRITICAL INSTRUCTIONS:
- Always respond in BOTH Vietnamese and English
- Vietnamese text comes FIRST, then English
- Format: Vietnamese paragraph, then blank line, then English paragraph
- Be conversational, warm, and educational
- Focus on practical, actionable advice
- Include safety disclaimers when appropriate
- For health topics, always remind users to consult healthcare professionals
- Keep responses concise but informative (2-3 paragraphs max)

RESPONSE FORMAT EXAMPLE:
Cảm ơn bạn đã đặt câu hỏi về [topic]. [Vietnamese response paragraph]

Thank you for asking about [topic]. [English response paragraph]

Room Context: ${roomId}
Available Data: ${roomData ? 'Room-specific guidance available' : 'General guidance'}

Remember: You're helping Vietnamese speakers learn English while improving their health knowledge. Make it educational and supportive.`;

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
