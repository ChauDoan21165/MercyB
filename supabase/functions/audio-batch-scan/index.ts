import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, mb-admin-token',
};

type AudioKind = 'content' | 'reflection' | 'dare' | 'intro';
type AudioLang = 'en' | 'vi';

interface AudioTask {
  target: 'path_days';
  id: string;
  slug: string;
  day_index: number;
  lang: AudioLang;
  kind: AudioKind;
  text: string;
  suggestedFilename: string;
  field: string;
}

interface ScanRequest {
  scope: 'all' | 'calm-mind-only' | 'paths-only' | 'custom';
  slugPrefix?: string;
}

function generateFilename(slug: string, dayIndex: number, kind: AudioKind, lang: AudioLang): string {
  const normalizedSlug = slug.toLowerCase().replace(/-/g, '_');
  return `${normalizedSlug}_day${dayIndex}_${kind}_${lang}.mp3`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const adminToken = req.headers.get('mb-admin-token');
    const expectedToken = Deno.env.get('MB_ADMIN_TOKEN');
    
    if (!expectedToken) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Server misconfiguration: MB_ADMIN_TOKEN not set' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (adminToken !== expectedToken) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: ScanRequest = await req.json();
    const { scope, slugPrefix } = body;

    console.log(`[audio-batch-scan] Starting scan with scope=${scope}, slugPrefix=${slugPrefix || 'none'}`);

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Build query based on scope
    let query = supabase
      .from('path_days')
      .select(`
        id,
        day_index,
        content_en,
        content_vi,
        reflection_en,
        reflection_vi,
        dare_en,
        dare_vi,
        audio_content_en,
        audio_content_vi,
        audio_reflection_en,
        audio_reflection_vi,
        audio_dare_en,
        audio_dare_vi,
        paths!inner(slug)
      `);

    // Apply scope filter
    if (scope === 'calm-mind-only') {
      query = query.eq('paths.slug', 'calm-mind-7');
    } else if (scope === 'custom' && slugPrefix) {
      query = query.ilike('paths.slug', `${slugPrefix}%`);
    }
    // 'all' and 'paths-only' fetch everything

    const { data: pathDays, error } = await query;

    if (error) {
      console.error('[audio-batch-scan] Query error:', error);
      return new Response(
        JSON.stringify({ ok: false, error: `Database query failed: ${error.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build missing audio tasks
    const tasks: AudioTask[] = [];
    const byKind: Record<string, number> = {};
    const byLang: Record<string, number> = {};
    let totalChars = 0;

    const fieldMappings: { textField: string; audioField: string; kind: AudioKind; lang: AudioLang }[] = [
      { textField: 'content_en', audioField: 'audio_content_en', kind: 'content', lang: 'en' },
      { textField: 'content_vi', audioField: 'audio_content_vi', kind: 'content', lang: 'vi' },
      { textField: 'reflection_en', audioField: 'audio_reflection_en', kind: 'reflection', lang: 'en' },
      { textField: 'reflection_vi', audioField: 'audio_reflection_vi', kind: 'reflection', lang: 'vi' },
      { textField: 'dare_en', audioField: 'audio_dare_en', kind: 'dare', lang: 'en' },
      { textField: 'dare_vi', audioField: 'audio_dare_vi', kind: 'dare', lang: 'vi' },
    ];

    for (const day of pathDays || []) {
      const pathSlug = (day.paths as any)?.slug || 'unknown';

      for (const mapping of fieldMappings) {
        const text = (day as any)[mapping.textField];
        const audioValue = (day as any)[mapping.audioField];

        // Check if text exists and audio is missing
        if (text && text.trim() && (!audioValue || audioValue.trim() === '')) {
          const filename = generateFilename(pathSlug, day.day_index, mapping.kind, mapping.lang);
          
          tasks.push({
            target: 'path_days',
            id: day.id,
            slug: pathSlug,
            day_index: day.day_index,
            lang: mapping.lang,
            kind: mapping.kind,
            text: text.trim(),
            suggestedFilename: filename,
            field: mapping.audioField,
          });

          // Update counters
          const kindKey = `${mapping.kind}_${mapping.lang}`;
          byKind[kindKey] = (byKind[kindKey] || 0) + 1;
          byLang[mapping.lang] = (byLang[mapping.lang] || 0) + 1;
          totalChars += text.trim().length;
        }
      }
    }

    // Estimate cost ($0.015 per 1,000 chars for OpenAI TTS)
    const estimatedCostUsd = (totalChars / 1000) * 0.015;

    console.log(`[audio-batch-scan] Found ${tasks.length} missing audio tasks, ${totalChars} chars, ~$${estimatedCostUsd.toFixed(2)}`);

    return new Response(
      JSON.stringify({
        ok: true,
        tasks,
        summary: {
          total: tasks.length,
          byKind,
          byLang,
          estimatedChars: totalChars,
          estimatedCostUsd: Math.round(estimatedCostUsd * 100) / 100,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[audio-batch-scan] Error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
