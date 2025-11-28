import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MissingAudioEntry {
  roomId: string;
  roomTitle: string;
  entrySlug: string;
  field: string;
  filename: string;
  status: string;
  httpStatus?: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting missing audio scan...');

    // Fetch all rooms from database
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('id, title_en, title_vi, tier, entries');

    if (roomsError) {
      throw new Error(`Failed to fetch rooms: ${roomsError.message}`);
    }

    const missingAudioFiles: MissingAudioEntry[] = [];
    const existingAudioFiles: MissingAudioEntry[] = [];
    let totalChecked = 0;

    console.log(`Scanning ${rooms?.length || 0} rooms...`);

    // Collect all audio checks to perform
    const audioChecks: Array<{
      roomId: string;
      roomTitle: string;
      entrySlug: string;
      field: string;
      filename: string;
      url: string;
    }> = [];

    for (const room of rooms || []) {
      const entries = room.entries as any[] || [];
      
      for (const entry of entries) {
        const entrySlug = entry.slug || entry.artifact_id || entry.id || 'unknown';
        const roomTitle = room.title_en || room.title_vi || room.id;
        
        // Collect audio_en checks
        if (entry.audio_en) {
          const filename = entry.audio_en.split('/').pop();
          audioChecks.push({
            roomId: room.id,
            roomTitle,
            entrySlug,
            field: 'audio_en',
            filename,
            url: `${supabaseUrl}/storage/v1/object/public/room-audio/${filename}`
          });
        }
        
        // Collect audio checks (old format)
        if (entry.audio && typeof entry.audio === 'string') {
          const filename = entry.audio.split('/').pop();
          audioChecks.push({
            roomId: room.id,
            roomTitle,
            entrySlug,
            field: 'audio',
            filename,
            url: `${supabaseUrl}/storage/v1/object/public/room-audio/${filename}`
          });
        }
        
        // Collect audio.en checks (nested format)
        if (entry.audio && typeof entry.audio === 'object' && entry.audio.en) {
          const filename = entry.audio.en.split('/').pop();
          audioChecks.push({
            roomId: room.id,
            roomTitle,
            entrySlug,
            field: 'audio.en',
            filename,
            url: `${supabaseUrl}/storage/v1/object/public/room-audio/${filename}`
          });
        }
      }
    }

    totalChecked = audioChecks.length;
    console.log(`Checking ${totalChecked} audio files in parallel...`);

    // Process checks in parallel batches
    const BATCH_SIZE = 50;
    for (let i = 0; i < audioChecks.length; i += BATCH_SIZE) {
      const batch = audioChecks.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (check) => {
          try {
            const response = await fetch(check.url, { method: 'HEAD' });
            const status = response.ok ? 'Exists' : `${response.status} ${response.statusText}`;
            
            return {
              entry: {
                roomId: check.roomId,
                roomTitle: check.roomTitle,
                entrySlug: check.entrySlug,
                field: check.field,
                filename: check.filename,
                status,
                httpStatus: response.status
              },
              exists: response.ok
            };
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            return {
              entry: {
                roomId: check.roomId,
                roomTitle: check.roomTitle,
                entrySlug: check.entrySlug,
                field: check.field,
                filename: check.filename,
                status: `Error: ${errorMsg}`
              },
              exists: false
            };
          }
        })
      );

      // Categorize results
      for (const result of batchResults) {
        if (result.exists) {
          existingAudioFiles.push(result.entry);
        } else {
          missingAudioFiles.push(result.entry);
        }
      }

      console.log(`Processed ${Math.min(i + BATCH_SIZE, audioChecks.length)}/${audioChecks.length} files...`);
    }

    console.log(`Scan complete: ${totalChecked} audio files checked, ${missingAudioFiles.length} missing`);

    return new Response(
      JSON.stringify({
        success: true,
        totalChecked,
        missingCount: missingAudioFiles.length,
        existingCount: existingAudioFiles.length,
        missingFiles: missingAudioFiles,
        existingFiles: existingAudioFiles,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error scanning audio:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMsg }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
