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

// Load room data from JSON embedded or bundled with this function
async function loadRoomData(roomId: string) {
  try {
    const fileName = roomFiles[roomId];
    if (!fileName) {
      console.log(`Room ${roomId} not found in mapping`);
      return null;
    }

    // Prefer dynamic import so the bundler includes the JSON
    const primaryUrl = new URL(`./data/${fileName}`, import.meta.url);
    console.log(`Attempting to load (import): ${primaryUrl.href}`);
    try {
      // Deno supports JSON module import with assertions
      const mod = await import(primaryUrl.href, { with: { type: 'json' } } as any);
      return (mod as any).default ?? mod;
    } catch (e) {
      console.warn('Import failed, trying file read...', e);
    }

    // Fallback 1: Read from the embedded file path
    try {
      const fileText = await Deno.readTextFile(primaryUrl);
      return JSON.parse(fileText);
    } catch (e) {
      console.warn('ReadTextFile primary failed, trying legacy path...', e);
    }

    // Fallback 2: Legacy relative path some builds used previously
    const legacyUrl = new URL(`../../data/rooms/${fileName}`, import.meta.url);
    console.log(`Attempting to load (legacy): ${legacyUrl.href}`);
    try {
      const modLegacy = await import(legacyUrl.href, { with: { type: 'json' } } as any);
      return (modLegacy as any).default ?? modLegacy;
    } catch (_) {}

    try {
      const legacyText = await Deno.readTextFile(legacyUrl);
      return JSON.parse(legacyText);
    } catch (error) {
      console.error('Error loading room data:', error);
      return null;
    }
  } catch (error) {
    console.error('Error loading room data (outer):', error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { roomId, message } = await req.json();
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

    // Helpers
    const normalize = (t: unknown) =>
      String(t || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // strip diacritics
        .replace(/[\s\-]+/g, '_')
        .trim();

    const getBilingual = (
      obj: any,
      base: string
    ): { en: string; vi: string } => {
      const val = obj?.[base];
      if (val && typeof val === 'object') {
        return { en: String(val.en || ''), vi: String(val.vi || '') };
      }
      // support split fields like description + description_vi
      return {
        en: String(obj?.[base] || ''),
        vi: String(obj?.[`${base}_vi`] || ''),
      };
    };

    // Keyword matching across all groups (en/vi)
    function findMatchingGroup(userMessage: string, keywords: any): string | null {
      if (!keywords || typeof keywords !== 'object') return null;
      const msg = normalize(userMessage);

      for (const [groupKey, groupVal] of Object.entries(keywords)) {
        const g: any = groupVal;
        const list: string[] = [
          ...(Array.isArray(g.en) ? g.en : []),
          ...(Array.isArray(g.vi) ? g.vi : []),
          ...(Array.isArray(g.slug_vi) ? g.slug_vi : []),
        ];
        for (const k of list) {
          if (msg.includes(normalize(k))) {
            console.log(`Matched keyword '${k}' in group '${groupKey}'`);
            return groupKey;
          }
        }
      }
      return null;
    }

    function findEntryByGroup(groupKey: string | null, entries: any[]): any | null {
      if (!groupKey || !Array.isArray(entries)) return null;
      return (
        entries.find((e: any) => e?.slug === groupKey) ||
        entries.find((e: any) => e?.id === groupKey) ||
        entries.find((e: any) => e?.keyword_group === groupKey) ||
        null
      );
    }

    // Try to find a matching entry
    const groupKey = findMatchingGroup(message, roomData.keywords);
    const matchedEntry = findEntryByGroup(groupKey, roomData.entries || []);

    // Build bilingual strings from entry
    const buildEntryResponse = (entry: any) => {
      const titleEn = String(entry?.title?.en || entry?.title_en || '');
      const titleVi = String(entry?.title?.vi || entry?.title_vi || '');

      const copyEn = typeof entry?.copy === 'string'
        ? entry.copy
        : String(entry?.copy?.en || entry?.content?.en || entry?.body?.en || entry?.copy_en || '');
      const copyVi = typeof entry?.copy === 'string'
        ? ''
        : String(entry?.copy?.vi || entry?.content?.vi || entry?.body?.vi || entry?.copy_vi || '');

      const parts: string[] = [];
      if (titleEn) parts.push(titleEn);
      if (copyEn) parts.push(copyEn);
      const en = parts.filter(Boolean).join('\n\n');

      const partsVi: string[] = [];
      if (titleVi) partsVi.push(titleVi);
      if (copyVi) partsVi.push(copyVi);
      const vi = partsVi.filter(Boolean).join('\n\n');

      return { en, vi };
    };

    // Decide response
    if (matchedEntry) {
      console.log('Returning matched entry content');
      const { en, vi } = buildEntryResponse(matchedEntry);

      // Safety and crisis footers from data only
      const safety = getBilingual(roomData, 'safety_disclaimer');
      const crisis = getBilingual(roomData, 'crisis_footer');

      const response = [
        en,
        vi,
        safety.en,
        safety.vi,
        crisis.en,
        crisis.vi,
      ]
        .map((s) => (s || '').trim())
        .filter(Boolean)
        .join('\n\n');

      return new Response(
        JSON.stringify({
          response,
          roomId,
          matched: true,
          groupKey,
          timestamp: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // No match: show room description and a hint of available keywords (data-only)
    console.log('No keyword match found, returning default data-only response');
    const desc = getBilingual(roomData, 'room_essay');
    const fallDesc = getBilingual(roomData, 'description');
    const safety = getBilingual(roomData, 'safety_disclaimer');

    const enDesc = desc.en || fallDesc.en;
    const viDesc = desc.vi || fallDesc.vi;

    // Suggest first few keywords from data (still from user's data)
    const firstGroup = Object.values(roomData.keywords || {})[0] as any;
    const hintEn = Array.isArray(firstGroup?.en) ? firstGroup.en.slice(0, 6).join(', ') : '';
    const hintVi = Array.isArray(firstGroup?.vi) ? firstGroup.vi.slice(0, 6).join(', ') : '';

    const response = [
      enDesc,
      viDesc,
      hintEn,
      hintVi,
      safety.en,
      safety.vi,
    ]
      .map((s) => (s || '').trim())
      .filter(Boolean)
      .join('\n\n');

    return new Response(
      JSON.stringify({
        response,
        roomId,
        matched: false,
        timestamp: new Date().toISOString(),
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
