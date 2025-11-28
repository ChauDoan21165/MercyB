import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get all rooms with entries
    const { data: rooms, error: fetchError } = await supabaseClient
      .from('rooms')
      .select('*');

    if (fetchError) throw fetchError;

    // Filter rooms with content
    const roomsWithContent = rooms?.filter(room => 
      room.entries && 
      (Array.isArray(room.entries) ? room.entries.length > 0 : Object.keys(room.entries).length > 0)
    ) || [];

    const jsonFiles: Record<string, any> = {};

    for (const room of roomsWithContent) {
      jsonFiles[room.id] = {
        id: room.id,
        tier: room.tier || "Free / Miễn phí",
        domain: room.domain || "",
        title: {
          en: room.title_en || "",
          vi: room.title_vi || ""
        },
        content: {
          en: room.room_essay_en || "",
          vi: room.room_essay_vi || ""
        },
        entries: Array.isArray(room.entries) ? room.entries.map((entry: any) => ({
          slug: entry.slug || entry.artifact_id || entry.id,
          keywords_en: entry.keywords_en || [],
          keywords_vi: entry.keywords_vi || [],
          copy: {
            en: entry.copy_en || entry.copy?.en || "",
            vi: entry.copy_vi || entry.copy?.vi || ""
          },
          audio: entry.audio || entry.audio_file || ""
        })) : []
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        count: Object.keys(jsonFiles).length,
        files: jsonFiles
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});