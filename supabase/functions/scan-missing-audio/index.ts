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

    // Loop through all rooms
    for (const room of rooms || []) {
      const entries = room.entries as any[] || [];
      
      for (const entry of entries) {
        // Get entry slug/id
        const entrySlug = entry.slug || entry.artifact_id || entry.id || 'unknown';
        
        // Check audio_en field
        if (entry.audio_en) {
          totalChecked++;
          const filename = entry.audio_en.split('/').pop();
          const audioUrl = `${supabaseUrl}/storage/v1/object/public/room-audio/${filename}`;
          
          try {
            const response = await fetch(audioUrl, { method: 'HEAD' });
            const status = response.ok ? 'Exists' : `${response.status} ${response.statusText}`;
            
            const audioEntry: MissingAudioEntry = {
              roomId: room.id,
              roomTitle: room.title_en || room.title_vi || room.id,
              entrySlug,
              field: 'audio_en',
              filename,
              status,
              httpStatus: response.status
            };
            
            if (!response.ok) {
              missingAudioFiles.push(audioEntry);
            } else {
              existingAudioFiles.push(audioEntry);
            }
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            missingAudioFiles.push({
              roomId: room.id,
              roomTitle: room.title_en || room.title_vi || room.id,
              entrySlug,
              field: 'audio_en',
              filename,
              status: `Error: ${errorMsg}`,
            });
          }
        }
        
        // Check audio field (old format)
        if (entry.audio && typeof entry.audio === 'string') {
          totalChecked++;
          const filename = entry.audio.split('/').pop();
          const audioUrl = `${supabaseUrl}/storage/v1/object/public/room-audio/${filename}`;
          
          try {
            const response = await fetch(audioUrl, { method: 'HEAD' });
            const status = response.ok ? 'Exists' : `${response.status} ${response.statusText}`;
            
            const audioEntry: MissingAudioEntry = {
              roomId: room.id,
              roomTitle: room.title_en || room.title_vi || room.id,
              entrySlug,
              field: 'audio',
              filename,
              status,
              httpStatus: response.status
            };
            
            if (!response.ok) {
              missingAudioFiles.push(audioEntry);
            } else {
              existingAudioFiles.push(audioEntry);
            }
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            missingAudioFiles.push({
              roomId: room.id,
              roomTitle: room.title_en || room.title_vi || room.id,
              entrySlug,
              field: 'audio',
              filename,
              status: `Error: ${errorMsg}`,
            });
          }
        }
        
        // Check audio.en field (nested format)
        if (entry.audio && typeof entry.audio === 'object' && entry.audio.en) {
          totalChecked++;
          const filename = entry.audio.en.split('/').pop();
          const audioUrl = `${supabaseUrl}/storage/v1/object/public/room-audio/${filename}`;
          
          try {
            const response = await fetch(audioUrl, { method: 'HEAD' });
            const status = response.ok ? 'Exists' : `${response.status} ${response.statusText}`;
            
            const audioEntry: MissingAudioEntry = {
              roomId: room.id,
              roomTitle: room.title_en || room.title_vi || room.id,
              entrySlug,
              field: 'audio.en',
              filename,
              status,
              httpStatus: response.status
            };
            
            if (!response.ok) {
              missingAudioFiles.push(audioEntry);
            } else {
              existingAudioFiles.push(audioEntry);
            }
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            missingAudioFiles.push({
              roomId: room.id,
              roomTitle: room.title_en || room.title_vi || room.id,
              entrySlug,
              field: 'audio.en',
              filename,
              status: `Error: ${errorMsg}`,
            });
          }
        }
      }
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
