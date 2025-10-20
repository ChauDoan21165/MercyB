import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Room data files mapping (kept for future file-based loading)
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

// Embedded minimal fallback data to guarantee responses even if JSON files are not bundled
const embeddedFallbackData: Record<string, any> = {
  'abdominal-pain': {
    schema_version: '1.0',
    schema_id: 'abdominal_pain',
    room_essay: {
      en: 'Welcome to the Abdominal Pain room. Evidence-based tips to understand and manage abdominal symptoms.',
      vi: 'Chào mừng đến phòng Đau bụng. Gợi ý dựa trên bằng chứng để hiểu và quản lý triệu chứng bụng.',
    },
    safety_disclaimer: {
      en: 'Educational guidance; not a substitute for professional medical advice or emergency care.',
      vi: 'Hướng dẫn mang tính giáo dục; không thay thế tư vấn y tế chuyên nghiệp hoặc chăm sóc khẩn cấp.',
    },
    crisis_footer: {
      en: 'If pain is severe or persistent, or with fever/vomiting, seek urgent medical care.',
      vi: 'Nếu đau dữ dội hoặc kéo dài, hoặc kèm sốt/nôn, hãy đi khám khẩn cấp.',
    },
    keywords: {
      severe_abdominal_pain: {
        en: ['severe_abdominal_pain', 'acute_stomach_pain', 'emergency_pain', 'critical_discomfort'],
        vi: ['đau bụng nặng', 'đau dạ dày cấp tính', 'đau khẩn cấp', 'khó chịu nguy kịch'],
      },
      abdominal_pain_relief: {
        en: ['abdominal_pain_relief', 'stomach_pain_management', 'pain_soothing', 'digestive_comfort'],
        vi: ['giảm đau bụng', 'quản lý đau dạ dày', 'làm dịu đau', 'thoải mái tiêu hóa'],
      },
    },
    entries: [
      {
        slug: 'severe_abdominal_pain',
        title: { en: 'Severe Abdominal Pain', vi: 'Đau bụng nặng' },
        copy: {
          en: 'Severe abdominal pain needs immediate medical attention. Do not delay care if intense, persistent, or with fever/vomiting.',
          vi: 'Đau bụng nặng cần chăm sóc y tế ngay. Đừng trì hoãn nếu đau dữ dội, kéo dài, hoặc kèm sốt/nôn.',
        },
      },
      {
        slug: 'abdominal_pain_relief',
        title: { en: 'Abdominal Pain Relief', vi: 'Giảm đau bụng' },
        copy: {
          en: 'For mild discomfort: gentle heat, hydration, simple foods. Consult a clinician if symptoms persist.',
          vi: 'Khó chịu nhẹ: chườm ấm, uống đủ nước, ăn nhẹ. Tham vấn bác sĩ nếu triệu chứng kéo dài.',
        },
      },
    ],
  },
};

// Load room data - reads from bundled JSON files
async function loadRoomData(roomId: string): Promise<any | null> {
  console.log(`Loading data for room: ${roomId}`);
  
  const fileName = roomFiles[roomId];
  if (!fileName) {
    console.error(`Room ${roomId} not found in mapping`);
    return embeddedFallbackData[roomId] || null;
  }

  // Try dynamic import with proper error handling
  try {
    const url = new URL(`./data/${fileName}`, import.meta.url);
    const module = await import(url.href, { with: { type: 'json' } } as any);
    const data = (module as any).default || module;
    if (data && typeof data === 'object') {
      (data as any).__source = 'file';
    }
    console.log(`Successfully loaded data for ${roomId}`);
    return data;
  } catch (e) {
    console.error(`Failed to load ${fileName}:`, e);
    const fallback = embeddedFallbackData[roomId];
    if (fallback) {
      console.log(`Using embedded fallback for ${roomId}`);
      if (fallback && typeof fallback === 'object') {
        (fallback as any).__source = 'fallback';
      }
      return fallback;
    }
    return null;
  }
}

// Utilities
const normalize = (t: unknown) =>
  String(t ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s\-]+/g, '_')
    .trim();

function getBilingual(obj: any, base: string): { en: string; vi: string } {
  // Support object form { en, vi } or split keys base and base_vi
  const val = obj?.[base];
  if (val && typeof val === 'object') {
    return { en: String(val.en || ''), vi: String(val.vi || '') };
  }
  return {
    en: String(obj?.[base] || ''),
    vi: String(obj?.[`${base}_vi`] || ''),
  };
}

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

    // Load data from bundled JSON
    const roomData = await loadRoomData(roomId);
    if (!roomData) {
      return new Response(
        JSON.stringify({ error: 'Room data not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const groupKey = findMatchingGroup(message, roomData.keywords);
    const matchedEntry = findEntryByGroup(groupKey, roomData.entries || []);

    const buildEntryResponse = (entry: any) => {
      const titleEn = String(entry?.title?.en || entry?.title_en || '');
      const titleVi = String(entry?.title?.vi || entry?.title_vi || '');

      const copyEn = typeof entry?.copy === 'string'
        ? entry.copy
        : String(entry?.copy?.en || entry?.content?.en || entry?.body?.en || entry?.copy_en || '');
      const copyVi = typeof entry?.copy === 'string'
        ? ''
        : String(entry?.copy?.vi || entry?.content?.vi || entry?.body?.vi || entry?.copy_vi || '');

      const en = [titleEn, copyEn].filter(Boolean).join('\n\n');
      const vi = [titleVi, copyVi].filter(Boolean).join('\n\n');
      return { en, vi };
    };

    if (matchedEntry) {
      console.log('Returning matched entry content');
      const { en, vi } = buildEntryResponse(matchedEntry);
      const safety = getBilingual(roomData, 'safety_disclaimer');
      const crisis = getBilingual(roomData, 'crisis_footer');

      const response = [en, vi, safety.en, safety.vi, crisis.en, crisis.vi]
        .map((s) => (s || '').trim())
        .filter(Boolean)
        .join('\n\n');

      return new Response(
        JSON.stringify({ response, roomId, matched: true, groupKey, dataSource: roomData.__source || 'unknown', timestamp: new Date().toISOString() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Default: show room essay/description + a hint of available keywords
    console.log('No keyword match found, returning default data-only response');
    const desc = getBilingual(roomData, 'room_essay');
    const fallDesc = getBilingual(roomData, 'description');
    const safety = getBilingual(roomData, 'safety_disclaimer');

    const enDesc = desc.en || fallDesc.en;
    const viDesc = desc.vi || fallDesc.vi;

    const firstGroup: any = Object.values(roomData.keywords || {})[0] || {};
    const hintEn = Array.isArray(firstGroup.en) ? firstGroup.en.slice(0, 6).join(', ') : '';
    const hintVi = Array.isArray(firstGroup.vi) ? firstGroup.vi.slice(0, 6).join(', ') : '';

    const response = [enDesc, viDesc, hintEn, hintVi, safety.en, safety.vi]
      .map((s) => (s || '').trim())
      .filter(Boolean)
      .join('\n\n');

    return new Response(
      JSON.stringify({ response, roomId, matched: false, timestamp: new Date().toISOString() }),
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
