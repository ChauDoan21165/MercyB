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
  checkedUrl: string; // Show the exact URL that was checked for debugging
  httpStatus?: number;
}

/**
 * Normalize audio path to canonical format
 * - Strips leading slashes
 * - Removes "public/" prefix
 * - Removes redundant "audio/" or "audio/en/" prefixes
 * - Returns just the filename
 */
function normalizeAudioFilename(raw: string | null | undefined): string | null {
  if (!raw) return null;
  
  let p = raw.trim();
  if (!p) return null;
  
  // Remove any leading slashes
  p = p.replace(/^\/+/, '');
  
  // Remove "public/" prefix if present
  p = p.replace(/^public\//, '');
  
  // Remove "audio/en/" or "audio/vi/" prefixes
  p = p.replace(/^audio\/(en|vi)\//, '');
  
  // Remove "audio/" prefix if present
  p = p.replace(/^audio\//, '');
  
  // Extract just the filename (last segment after any remaining slashes)
  const lastSlash = Math.max(p.lastIndexOf('/'), p.lastIndexOf('\\'));
  if (lastSlash >= 0) {
    p = p.substring(lastSlash + 1);
  }
  
  // Remove any query params
  const queryIndex = p.indexOf('?');
  if (queryIndex >= 0) {
    p = p.substring(0, queryIndex);
  }
  
  return p || null;
}

/**
 * Build the full audio URL for checking
 * Files are served from /audio/{filename} in the deployed app
 */
function buildAudioCheckUrl(baseUrl: string, filename: string): string {
  return `${baseUrl}/audio/${filename}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the app base URL from request or use a fallback
    // The audio files are served from the deployed app, not Supabase storage
    const requestUrl = new URL(req.url);
    const origin = req.headers.get('origin') || req.headers.get('referer');
    
    // Extract base URL from origin/referer, or use a fallback pattern
    let appBaseUrl: string;
    if (origin) {
      const originUrl = new URL(origin);
      appBaseUrl = `${originUrl.protocol}//${originUrl.host}`;
    } else {
      // Fallback: derive from the function URL pattern
      // Lovable preview URLs follow pattern: https://{project-id}.lovableproject.com
      const projectId = supabaseUrl.match(/https:\/\/([^.]+)/)?.[1];
      appBaseUrl = projectId 
        ? `https://${projectId}.lovableproject.com`
        : 'https://localhost:8080'; // Local dev fallback
    }

    console.log(`Starting missing audio scan... Checking against: ${appBaseUrl}`);

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
      rawValue: string;
      filename: string;
      url: string;
    }> = [];

    for (const room of rooms || []) {
      const entries = room.entries as any[] || [];
      
      for (const entry of entries) {
        const entrySlug = entry.slug || entry.artifact_id || entry.id || 'unknown';
        const roomTitle = room.title_en || room.title_vi || room.id;
        
        // Check all possible audio field formats
        const audioFields: Array<{ field: string; value: string | undefined }> = [
          { field: 'audio', value: typeof entry.audio === 'string' ? entry.audio : undefined },
          { field: 'audio.en', value: entry.audio?.en },
          { field: 'audio.vi', value: entry.audio?.vi },
          { field: 'audio_en', value: entry.audio_en },
          { field: 'audio_vi', value: entry.audio_vi },
          { field: 'audioEn', value: entry.audioEn },
        ];

        for (const { field, value } of audioFields) {
          if (!value) continue;
          
          const filename = normalizeAudioFilename(value);
          if (!filename) continue;
          
          // Avoid duplicate checks for the same filename in the same entry
          const existingCheck = audioChecks.find(
            c => c.roomId === room.id && c.entrySlug === entrySlug && c.filename === filename
          );
          if (existingCheck) continue;
          
          const url = buildAudioCheckUrl(appBaseUrl, filename);
          
          audioChecks.push({
            roomId: room.id,
            roomTitle,
            entrySlug,
            field,
            rawValue: value,
            filename,
            url
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
                checkedUrl: check.url,
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
                status: `Error: ${errorMsg}`,
                checkedUrl: check.url
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
        appBaseUrl, // Include for debugging
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
