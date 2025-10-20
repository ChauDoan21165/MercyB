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

    if (!roomData) {
      return new Response(
        JSON.stringify({ error: 'Room data not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Keyword matching function
    function findMatchingEntry(userMessage: string, roomData: any) {
      const messageLower = userMessage.toLowerCase();
      
      // Check all keyword groups
      if (roomData.keywords) {
        const keywordGroups = Object.entries(roomData.keywords as Record<string, any>);
        
        for (const [groupKey, group] of keywordGroups) {
          const groupData = group as any;
          
          // Check English keywords
          if (Array.isArray(groupData.en)) {
            for (const keyword of groupData.en) {
              if (messageLower.includes(keyword.toLowerCase())) {
                console.log(`Matched keyword: ${keyword} in group: ${groupKey}`);
                // Find corresponding entry
                const entry = (roomData.entries || []).find((e: any) => 
                  e.id === groupKey || e.keyword_group === groupKey
                );
                if (entry) return entry;
              }
            }
          }
          
          // Check Vietnamese keywords
          if (Array.isArray(groupData.vi)) {
            for (const keyword of groupData.vi) {
              if (messageLower.includes(keyword.toLowerCase())) {
                console.log(`Matched keyword: ${keyword} in group: ${groupKey}`);
                const entry = (roomData.entries || []).find((e: any) => 
                  e.id === groupKey || e.keyword_group === groupKey
                );
                if (entry) return entry;
              }
            }
          }
        }
      }
      
      return null;
    }

    // Try to find matching entry
    const matchedEntry = findMatchingEntry(message, roomData);

    if (matchedEntry) {
      console.log('Found matching entry, returning pre-written content');
      
      // Build response from entry data
      let response = '';
      
      // Add title if available
      if (matchedEntry.title?.en || matchedEntry.title?.vi) {
        response += `${matchedEntry.title?.en || ''}\n\n`;
        response += `${matchedEntry.title?.vi || ''}\n\n`;
      }
      
      // Add body content
      if (matchedEntry.body?.en || matchedEntry.body?.vi) {
        response += `${matchedEntry.body?.en || ''}\n\n`;
        response += `${matchedEntry.body?.vi || ''}\n\n`;
      }
      
      // Add recommendations if available
      if (matchedEntry.recommendations) {
        if (matchedEntry.recommendations.en && matchedEntry.recommendations.en.length > 0) {
          response += `Recommendations:\n${matchedEntry.recommendations.en.join('\n')}\n\n`;
        }
        if (matchedEntry.recommendations.vi && matchedEntry.recommendations.vi.length > 0) {
          response += `Khuyến nghị:\n${matchedEntry.recommendations.vi.join('\n')}\n\n`;
        }
      }
      
      // Add safety disclaimer if available
      if (roomData.safety_disclaimer?.en || roomData.safety_disclaimer?.vi) {
        response += `\n${roomData.safety_disclaimer?.en || ''}\n\n`;
        response += `${roomData.safety_disclaimer?.vi || ''}\n`;
      }

      return new Response(
        JSON.stringify({ 
          response: response.trim(),
          roomId,
          matched: true,
          timestamp: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // No keyword match - return a default response
    console.log('No keyword match found, returning default response');
    
    let defaultResponse = '';
    
    if (roomData.room_essay?.en || roomData.room_essay?.vi) {
      defaultResponse += `${roomData.room_essay?.en || ''}\n\n`;
      defaultResponse += `${roomData.room_essay?.vi || ''}\n\n`;
    }
    
    defaultResponse += `Please use specific keywords related to this topic for more detailed information.\n\n`;
    defaultResponse += `Vui lòng sử dụng các từ khóa cụ thể liên quan đến chủ đề này để biết thêm thông tin chi tiết.`;

    return new Response(
      JSON.stringify({ 
        response: defaultResponse.trim(),
        roomId,
        matched: false,
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
