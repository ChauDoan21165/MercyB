import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Room data files mapping (cleaned - only new format rooms)
const roomFiles: { [key: string]: string } = {
  'stress-vip3': 'stress_vip3.json',
  'mental-health-free': 'mental_health_free.json',
  'autoimmune-diseases': 'autoimmune_diseases.json',
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
    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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
