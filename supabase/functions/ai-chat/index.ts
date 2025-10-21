import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Room data files mapping
const roomFiles: { [key: string]: string } = {
  'abdominal-pain': 'abdominal_pain.json',
  'addiction': 'addiction.json',
  'ai': 'AI.json',
  'autoimmune': 'autoimmune_diseases.json',
  'burnout': 'burnout.json',
  'career-burnout': 'career_burnout.json',
  'business-negotiation': 'business_negotiation_compass.json',
  'business-strategy': 'business_strategy.json',
  'cancer-support': 'cancer_support.json',
  'cardiovascular': 'cardiovascular.json',
  'child-health': 'child_health.json',
  'cholesterol': 'cholesterol.json',
  'chronic-fatigue': 'chronic_fatigue.json',
  'cough': 'cough.json',
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
  'user-profile-dashboard': 'user_profile_dashboard.json',
  'wife-dealing': 'wife_dealing.json',
  'womens-health': 'women_health.json',
  'habit-building': 'habit_building.json',
  'negotiation-mastery': 'negotiation_mastery.json',
  'diabetes-advanced': 'diabetes_advanced.json',
  'confidence-building': 'confidence_building.json',
  'financial-planning': 'financial_planning_101.json',
  'onboarding-free-users': 'onboarding_free_users.json',
  'parenting-toddlers': 'parenting_toddlers.json',
  'relationship-conflicts': 'relationship_conflicts.json',
'weight-loss': 'weight_loss_program.json',
  'anxiety-toolkit': 'anxiety_toolkit.json',
  'philosophy': 'philosophy.json',
};

// Minimal embedded fallback to guarantee a response if JSON isn't bundled
const embeddedFallbackData: Record<string, any> = {
  generic: {
    schema_version: '1.0',
    schema_id: 'generic_room',
    room_essay: {
      en: 'Welcome! I will provide concise, supportive guidance using general best practices for this topic.',
      vi: 'Chào bạn! Tôi sẽ hỗ trợ ngắn gọn, hữu ích dựa trên các thực hành tốt nhất về chủ đề này.'
    },
    safety_disclaimer: {
      en: 'Educational guidance only; not a substitute for professional advice or emergency care.',
      vi: 'Chỉ mang tính giáo dục; không thay thế tư vấn chuyên môn hoặc chăm sóc khẩn cấp.'
    },
    crisis_footer: {
      en: 'If symptoms are severe or worsening, seek local professional help immediately.',
      vi: 'Nếu triệu chứng nặng hoặc xấu đi, hãy tìm trợ giúp chuyên môn ngay.'
    },
    entries: []
  }
};

async function loadRoomData(roomId: string): Promise<any | null> {
  const fileName = roomFiles[roomId];
  if (!fileName) {
    console.log(`Room ${roomId} not found in mapping`);
    return embeddedFallbackData.generic;
  }

  // 1) Prefer module import (works when JSON is bundled)
  try {
    const url = new URL(`./data/${fileName}`, import.meta.url);
    const mod = await import(url.href, { with: { type: 'json' } } as any);
    const data = (mod as any).default || mod;
    console.log(`Successfully loaded room data (module) for ${roomId}`);
    return data;
  } catch (e) {
    console.warn(`Module import failed for ${fileName}, trying file read:`, e);
  }

  // 2) Fallback to reading the file at runtime
  try {
    const url = new URL(`./data/${fileName}`, import.meta.url);
    const text = await Deno.readTextFile(url);
    const data = JSON.parse(text);
    console.log(`Successfully loaded room data (file) for ${roomId}`);
    return data;
  } catch (error) {
    console.error(`Failed to load room data for ${roomId}:`, error);
    return embeddedFallbackData.generic;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { roomId, messages } = await req.json();
    const authHeader = req.headers.get('authorization');
    
    if (!roomId || !messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'roomId and messages array required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract user query
    const userQuery = messages[messages.length - 1]?.content?.toLowerCase() || '';

    // Step 1: Check cached response (24hr cache)
    try {
      const { data: cachedResponse } = await supabase
        .from('responses')
        .select('response_en, response_vi')
        .eq('query', userQuery)
        .eq('room_id', roomId)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (cachedResponse) {
        console.log(`Cache hit for query: ${userQuery}`);
        const response = `${cachedResponse.response_en}\n\n${cachedResponse.response_vi}`;
        return new Response(JSON.stringify({ content: response }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } catch (e) {
      console.log('Cache miss or error:', e);
    }

    // Step 2: Query Supabase room table for keyword match
    try {
      const { data: roomData } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (roomData) {
        // Check if query matches any keywords
        const matchedKeyword = roomData.keywords?.some((kw: string) => 
          userQuery.includes(kw.toLowerCase())
        );

        if (matchedKeyword && roomData.entries) {
          // Find matching entry
          const entries = Array.isArray(roomData.entries) ? roomData.entries : [];
          const matchedEntry = entries.find((entry: any) => 
            entry.keywords?.some((kw: string) => userQuery.includes(kw.toLowerCase()))
          );

          if (matchedEntry) {
            console.log(`Keyword match in Supabase room data for: ${roomId}`);
            const response = `${matchedEntry.copy?.en || roomData.room_essay_en}\n\n${matchedEntry.copy?.vi || roomData.room_essay_vi}`;
            return new Response(JSON.stringify({ content: response }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
        }

        // If no keyword match but room exists, use room essay
        if (roomData.room_essay_en) {
          console.log(`Using room essay for: ${roomId}`);
          const response = `${roomData.room_essay_en}\n\n${roomData.room_essay_vi}`;
          return new Response(JSON.stringify({ content: response }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }
    } catch (e) {
      console.warn('Supabase room lookup error:', e);
    }

    // Step 3: Fallback to JSON files (legacy support)
    const roomData = await loadRoomData(roomId);
    
    if (!roomData) {
      return new Response(
        JSON.stringify({ error: 'Room not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build context from room data
    let contextInfo = `You are an AI assistant in the "${roomData.schema_id}" room.\n\n`;
    
    if (roomData.room_essay) {
      contextInfo += `Room Description (English): ${roomData.room_essay.en}\n`;
      contextInfo += `Room Description (Vietnamese): ${roomData.room_essay.vi}\n\n`;
    }

    // Add available topics from entries
    if (roomData.entries && Array.isArray(roomData.entries)) {
      contextInfo += `Available Topics:\n`;
      roomData.entries.slice(0, 10).forEach((entry: any) => {
        if (entry.title?.en) {
          contextInfo += `- ${entry.title.en} (${entry.title.vi || ''})\n`;
        }
      });
      contextInfo += `\n`;
    }

    // Add safety and crisis info
    if (roomData.safety_disclaimer) {
      contextInfo += `Safety Disclaimer: ${roomData.safety_disclaimer.en}\n`;
    }
    if (roomData.crisis_footer) {
      contextInfo += `Crisis Info: ${roomData.crisis_footer.en}\n\n`;
    }

    const systemPrompt = `${contextInfo}
CRITICAL INSTRUCTIONS:
- You are Mercy Blade's AI assistant, NOT Lovable or any other AI
- ONLY use information from the room data provided above - do NOT make up answers
- You MUST respond in BOTH English and Vietnamese for every message
- Format: English response first, then Vietnamese response
- Separate languages with a blank line
- Keep responses concise and helpful (2-4 sentences per language)
- If the question cannot be answered with the room data, respond with:
  "I don't have information about that topic yet. Please come back later, and we will provide you with an answer. / Tôi chưa có thông tin về chủ đề đó. Vui lòng quay lại sau, chúng tôi sẽ cung cấp câu trả lời cho bạn."
- Never introduce yourself as Lovable or mention any other service
- Always be supportive and empathetic
- If asked who you are, say: "I'm Mercy Blade's AI assistant, here to help you with this topic. / Tôi là trợ lý AI của Mercy Blade, ở đây để giúp bạn về chủ đề này."

Example format:
[Your English response here about the topic.]

[Câu trả lời tiếng Việt của bạn ở đây về chủ đề.]`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Step 4: AI fallback with exponential backoff for 429
    let retries = 0;
    const maxRetries = 3;
    let aiResponse: Response | null = null;

    while (retries < maxRetries) {
      try {
        aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages
            ],
            stream: true,
          }),
        });

        if (aiResponse.status === 429) {
          const backoffMs = Math.pow(2, retries) * 1000; // 1s, 2s, 4s
          console.log(`Rate limited, retrying in ${backoffMs}ms (attempt ${retries + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          retries++;
          continue;
        }

        if (aiResponse.status === 402) {
          return new Response(
            JSON.stringify({ error: 'AI credits exhausted. Please contact support.' }),
            { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          console.error('AI Gateway error:', aiResponse.status, errorText);
          throw new Error('AI Gateway error');
        }

        break; // Success, exit retry loop
      } catch (e) {
        console.error('AI call error:', e);
        if (retries >= maxRetries - 1) throw e;
        retries++;
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
      }
    }

    if (!aiResponse || !aiResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded after retries. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Cache AI response for 24 hours (fire-and-forget)
    if (authHeader) {
      try {
        // Extract response content from stream for caching (simplified - would need full stream parsing)
        const clonedResponse = aiResponse.clone();
        const reader = clonedResponse.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '));
            for (const line of lines) {
              const json = line.replace('data: ', '');
              if (json === '[DONE]') break;
              try {
                const parsed = JSON.parse(json);
                fullContent += parsed.choices?.[0]?.delta?.content || '';
              } catch {}
            }
          }
        }

        if (fullContent) {
          await supabase.from('responses').insert({
            query: userQuery,
            room_id: roomId,
            response_en: fullContent,
            response_vi: fullContent, // In production, split by language
          });
        }
      } catch (e) {
        console.warn('Failed to cache AI response:', e);
      }
    }

    return new Response(aiResponse.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
