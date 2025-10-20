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

async function loadRoomData(roomId: string): Promise<any | null> {
  const fileName = roomFiles[roomId];
  if (!fileName) {
    console.log(`Room ${roomId} not found in mapping`);
    return null;
  }

  try {
    const url = new URL(`./data/${fileName}`, import.meta.url);
    const response = await fetch(url.href);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${fileName}: ${response.status}`);
    }
    const data = await response.json();
    console.log(`Successfully loaded room data for ${roomId}`);
    return data;
  } catch (error) {
    console.error(`Failed to load room data for ${roomId}:`, error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { roomId, messages } = await req.json();
    
    if (!roomId || !messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'roomId and messages array required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Load room data for context
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
- You MUST respond in BOTH English and Vietnamese for every message
- Format: English response first, then Vietnamese response
- Separate languages with a blank line
- Keep responses concise and helpful (2-4 sentences per language)
- Use the room context to provide relevant, specific advice
- Always be supportive and empathetic
- If asked about topics outside this room's scope, gently redirect to the room's focus area

Example format:
[Your English response here about the topic.]

[Câu trả lời tiếng Việt của bạn ở đây về chủ đề.]`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('AI Gateway error');
    }

    return new Response(response.body, {
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
