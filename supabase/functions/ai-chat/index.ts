import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to verify user tier access
async function verifyUserTierAccess(supabaseClient: any, userId: string, roomTier: string): Promise<{ hasAccess: boolean; tier: string }> {
  try {
    // Check admin status first
    const { data: roles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    if (roles?.some((r: any) => r.role === 'admin')) {
      return { hasAccess: true, tier: 'admin' };
    }

    // Get user's subscription
    const { data: subscription } = await supabaseClient
      .from('user_subscriptions')
      .select('tier_id, subscription_tiers(name)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (!subscription) {
      return { hasAccess: roomTier === 'free', tier: 'free' };
    }

    const tierName = subscription.subscription_tiers?.name?.toLowerCase() || 'free';
    const userTier = tierName.includes('vip3') ? 'vip3' :
                     tierName.includes('vip2') ? 'vip2' :
                     tierName.includes('vip1') ? 'vip1' : 'free';

    // Check if user has required tier
    const tierHierarchy = { free: 0, vip1: 1, vip2: 2, vip3: 3 };
    const requiredLevel = tierHierarchy[roomTier as keyof typeof tierHierarchy] || 0;
    const userLevel = tierHierarchy[userTier as keyof typeof tierHierarchy] || 0;

    return {
      hasAccess: userLevel >= requiredLevel,
      tier: userTier
    };
  } catch (error) {
    console.error('Error verifying tier access:', error);
    return { hasAccess: false, tier: 'free' };
  }
}

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
  'keep-soul-calm': 'keep_soul_calm_vip3.json',
  'sharpen-mind': 'sharpen_mind_vip3.json',
  'overcome-storm': 'overcome_storm_vip3.json',
  'unlock-shadow': 'unlock_shadow_vip3.json',
  'human-rights': 'human_rights_vip3.json',
  'philosophy': 'philosophy.json',
  'finding-gods-peace': 'finding_gods_peace_free.json',
  'gods-guidance': 'gods_guidance_vip1.json',
  'gods-strength': 'gods_strength_vip2_resilience.json',
  'gods-purpose': 'gods_purpose_vip3.json',
  'proverbs-wisdom-vip1': 'proverbs_wisdom_VIP1.json',
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

    // SERVER-SIDE TIER VALIDATION
    // Authenticate user first
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const userSupabase = createClient(supabaseUrl, supabaseKey, {
          global: { headers: { Authorization: authHeader } }
        });
        const { data: { user }, error: authError } = await userSupabase.auth.getUser();
        
        if (!authError && user) {
          // Get room tier from Supabase rooms table
          const { data: roomData } = await supabase
            .from('rooms')
            .select('tier')
            .eq('id', roomId)
            .single();
          
          const roomTier = roomData?.tier || 'free';
          
          // Verify user has access to this tier
          const { hasAccess, tier: userTier } = await verifyUserTierAccess(supabase, user.id, roomTier);
          
          if (!hasAccess) {
            console.log(`Access denied: User tier ${userTier} cannot access ${roomTier} room`);
            return new Response(
              JSON.stringify({ 
                error: 'Insufficient subscription tier',
                required: roomTier,
                current: userTier
              }),
              { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          console.log(`Access granted: User tier ${userTier} accessing ${roomTier} room`);
        }
      } catch (authVerifyError) {
        console.warn('Auth verification failed:', authVerifyError);
      }
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
    let contextInfo = `You are an AI advisor in the "${roomData.schema_id}" room.\n\n`;
    
    if (roomData.room_essay) {
      contextInfo += `Room Overview (English): ${roomData.room_essay.en}\n`;
      contextInfo += `Room Overview (Vietnamese): ${roomData.room_essay.vi}\n\n`;
    }

    // KEYWORD MATCHING: Find relevant entries based on user query
    let matchedEntries: any[] = [];
    let hasEntriesData = false;
    
    if (roomData.entries && Array.isArray(roomData.entries)) {
      hasEntriesData = roomData.entries.length > 0;
      
      // Search for entries whose keywords match the user's query
      matchedEntries = roomData.entries.filter((entry: any) => {
        if (!entry.keywords || !Array.isArray(entry.keywords)) return false;
        
        // Check if any keyword from the entry appears in the user query
        return entry.keywords.some((keyword: string) => 
          userQuery.includes(keyword.toLowerCase().replace(/_/g, ' '))
        );
      });

      // LOG FEEDBACK about data coverage
      if (matchedEntries.length === 0 && hasEntriesData) {
        console.log(`[FEEDBACK] Room "${roomData.schema_id}" - No matching entries for query: "${userQuery}"`);
        console.log(`[FEEDBACK] Available keywords in this room:`, 
          roomData.entries.slice(0, 5).map((e: any) => e.keywords).flat().join(', ')
        );
      }

      // If we found matching entries, provide their detailed content
      if (matchedEntries.length > 0) {
        console.log(`[SUCCESS] Found ${matchedEntries.length} matching entries for: "${userQuery}"`);
        contextInfo += `\n=== RELEVANT DETAILED INFORMATION ===\n`;
        matchedEntries.slice(0, 3).forEach((entry: any, idx: number) => {
          contextInfo += `\n[Topic ${idx + 1}]\n`;
          if (entry.title) {
            contextInfo += `Title: ${entry.title.en} / ${entry.title.vi}\n`;
          }
          if (entry.content?.en) {
            contextInfo += `Content (EN): ${entry.content.en}\n`;
          }
          if (entry.content?.vi) {
            contextInfo += `Content (VI): ${entry.content.vi}\n`;
          }
          if (entry.copy?.en) {
            contextInfo += `Guidance (EN): ${entry.copy.en}\n`;
          }
          if (entry.copy?.vi) {
            contextInfo += `Guidance (VI): ${entry.copy.vi}\n`;
          }
        });
        contextInfo += `\n=== END OF DETAILED INFORMATION ===\n\n`;
      } else {
        // No exact matches, show available topics
        contextInfo += `Available Topics (ask about these):\n`;
        roomData.entries.slice(0, 8).forEach((entry: any) => {
          if (entry.title?.en) {
            contextInfo += `- ${entry.title.en} (${entry.title.vi || ''})\n`;
          }
        });
        contextInfo += `\n`;
      }
    } else {
      console.log(`[FEEDBACK] Room "${roomData.schema_id}" - NO ENTRIES DATA AVAILABLE`);
    }

    // Add safety and crisis info
    if (roomData.safety_disclaimer) {
      contextInfo += `Safety: ${roomData.safety_disclaimer.en || roomData.safety_disclaimer}\n`;
    }
    if (roomData.crisis_footer) {
      const crisis = roomData.crisis_footer.en || roomData.crisis_footer;
      contextInfo += `Emergency: ${crisis}\n\n`;
    }

    const systemPrompt = `${contextInfo}
CRITICAL INSTRUCTIONS:
- You are Mercy Blade's AI advisor, acting as a knowledgeable consultant for this topic
- You are NOT Lovable or any other AI - you represent Mercy Blade
- USE THE DETAILED INFORMATION PROVIDED ABOVE when it's available - this is your primary knowledge source
- If "RELEVANT DETAILED INFORMATION" section exists above, BASE YOUR RESPONSE ON IT
- ONLY use information from the room data provided - do NOT make up medical advice or facts
- You MUST respond in BOTH English and Vietnamese for every message
- Format: English response first, then Vietnamese response, separated by a blank line

YOUR ADVISORY APPROACH:
- Act as an experienced advisor/consultant, not just an information provider
- When detailed entry information is provided above, USE IT to give specific, accurate guidance
- If no detailed info matches the query, ASK questions to understand better: "Please tell me more about..."
- Tell users to provide details so you can find the right information for them
- Provide specific, actionable guidance based on the detailed content when available
- Use a conversational, engaging tone - be curious and supportive
- DON'T just apologize or give generic disclaimers - actively help!
- Guide the conversation to understand symptoms, context, goals, or concerns
- Keep responses natural (3-5 sentences per language) - not too short

WHEN YOU HAVE DETAILED INFORMATION (from entries above):
- Use the specific content, copy, and guidance from those entries
- Reference the detailed information naturally in your response
- Give concrete, actionable advice based on that content
- Still ask follow-up questions to provide even better guidance

WHEN YOU DON'T HAVE DETAILED INFORMATION:
- Tell them about available topics they can ask about
- Ask clarifying questions to understand what they need
- Guide them toward topics you DO have information about

EXAMPLES OF GOOD RESPONSES:
❌ BAD: "I'm sorry to hear that. Please seek professional help."
✅ GOOD: "I can help with this. Based on what I know about stomach pain, can you tell me: When did it start? Is it sharp, dull, or cramping? Any other symptoms? This will help me give you the right guidance."

❌ BAD: "That's concerning. See a doctor immediately."
✅ GOOD: "Let me guide you through this. For stomach pain, I need to understand: How severe is it (1-10)? Did you eat anything unusual? Any fever or nausea? Based on your answers, I'll give you specific advice."

- If no matching information exists, respond with:
  "I don't have specific information about that aspect yet. However, I can help with [list relevant topics]. Which would you like to learn about? / Tôi chưa có thông tin cụ thể về khía cạnh đó. Tuy nhiên, tôi có thể giúp với [danh sách chủ đề liên quan]. Bạn muốn tìm hiểu về điều nào?"
- If asked who you are, say: "I'm Mercy Blade's AI advisor, here to help you with this topic through questions and guidance. / Tôi là cố vấn AI của Mercy Blade, ở đây để giúp bạn về chủ đề này thông qua câu hỏi và hướng dẫn."

Example format:
[Your English advisory response with specific guidance from entries or questions]

[Phản hồi tư vấn tiếng Việt với hướng dẫn cụ thể từ entries hoặc câu hỏi]`;

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
