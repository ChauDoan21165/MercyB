import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RoomJson {
  id: string;
  tier: string;
  domain?: string;
  title: { en: string; vi: string };
  content: { en: string; vi: string };
  entries: Array<{
    slug?: string;
    id?: string;
    artifact_id?: string;
    keywords_en: string[];
    keywords_vi: string[];
    copy: { en: string; vi: string };
    tags: string[];
    audio: string;
  }>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { roomIds } = await req.json();

    if (!Array.isArray(roomIds) || roomIds.length === 0) {
      throw new Error('roomIds must be a non-empty array');
    }

    console.log(`📦 Processing ${roomIds.length} rooms...`);

    const results = [];
    const baseUrl = `https://${req.headers.get('host')}/data`;

    for (const roomId of roomIds) {
      try {
        // Fetch JSON file
        const jsonUrl = `${baseUrl}/${roomId}.json`;
        console.log(`Fetching: ${jsonUrl}`);
        
        const response = await fetch(jsonUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${jsonUrl}: ${response.status}`);
        }

        const roomData: RoomJson = await response.json();

        // Extract keywords from all entries
        const allKeywords = new Set<string>();
        roomData.entries.forEach(entry => {
          entry.keywords_en?.forEach(kw => allKeywords.add(kw.toLowerCase()));
          entry.keywords_vi?.forEach(kw => allKeywords.add(kw.toLowerCase()));
        });

        // Transform entries to database format
        const entries = roomData.entries.map(entry => ({
          id: entry.slug || entry.id || entry.artifact_id || '',
          keywords_en: entry.keywords_en || [],
          keywords_vi: entry.keywords_vi || [],
          copy_en: entry.copy?.en || '',
          copy_vi: entry.copy?.vi || '',
          tags: entry.tags || [],
          audio: entry.audio || ''
        }));

        // Prepare room record
        const roomRecord = {
          id: roomData.id,
          schema_id: roomData.id,
          title_en: roomData.title.en,
          title_vi: roomData.title.vi,
          tier: 'vip9', // Normalize to lowercase
          domain: roomData.domain || 'Strategy',
          entries: entries,
          keywords: Array.from(allKeywords),
          room_essay_en: roomData.content?.en || '',
          room_essay_vi: roomData.content?.vi || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Insert or update
        const { error } = await supabase
          .from('rooms')
          .upsert(roomRecord, { onConflict: 'id' });

        if (error) {
          console.error(`❌ Error for ${roomId}:`, error);
          results.push({ roomId, success: false, error: error.message });
        } else {
          console.log(`✅ Registered: ${roomId}`);
          results.push({ roomId, success: true });
        }
      } catch (err) {
        console.error(`❌ Failed ${roomId}:`, err);
        results.push({ 
          roomId, 
          success: false, 
          error: err instanceof Error ? err.message : String(err) 
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          total: roomIds.length,
          succeeded: successCount,
          failed: failCount
        },
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
