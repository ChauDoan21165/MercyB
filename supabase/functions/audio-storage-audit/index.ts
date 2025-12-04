import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BUCKET_NAME = 'room-audio';

interface AudioSyncReport {
  storageFiles: string[];
  referencedAudio: string[];
  missingInStorage: string[];
  orphans: string[];
  summary: {
    storageCount: number;
    referencedCount: number;
    missingCount: number;
    orphanCount: number;
    coveragePercent: number;
  };
}

async function listAllBucketFiles(supabase: any): Promise<string[]> {
  const allFiles: string[] = [];
  let offset = 0;
  const limit = 1000;

  while (true) {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', { limit, offset, sortBy: { column: 'name', order: 'asc' } });

    if (error) {
      console.error('Error listing bucket:', error.message);
      break;
    }

    if (!data || data.length === 0) break;

    for (const obj of data) {
      if (obj.name?.toLowerCase().endsWith('.mp3')) {
        allFiles.push(obj.name.toLowerCase());
      }
    }

    if (data.length < limit) break;
    offset += limit;
  }

  return allFiles;
}

async function getReferencedAudioFromDB(supabase: any): Promise<string[]> {
  const referencedAudio: Set<string> = new Set();

  // Get all rooms with entries
  const { data: rooms, error } = await supabase
    .from('rooms')
    .select('id, entries');

  if (error) {
    console.error('Error fetching rooms:', error.message);
    return [];
  }

  for (const room of rooms || []) {
    if (!room.entries || !Array.isArray(room.entries)) continue;

    for (const entry of room.entries) {
      // Check audio field
      if (entry.audio && typeof entry.audio === 'string') {
        const filename = entry.audio.replace(/^\/?(audio\/)?/, '').toLowerCase();
        if (filename.endsWith('.mp3')) {
          referencedAudio.add(filename);
        }
      }
      // Check audio_en and audio_vi fields
      if (entry.audio_en && typeof entry.audio_en === 'string') {
        const filename = entry.audio_en.replace(/^\/?(audio\/)?/, '').toLowerCase();
        if (filename.endsWith('.mp3')) {
          referencedAudio.add(filename);
        }
      }
      if (entry.audio_vi && typeof entry.audio_vi === 'string') {
        const filename = entry.audio_vi.replace(/^\/?(audio\/)?/, '').toLowerCase();
        if (filename.endsWith('.mp3')) {
          referencedAudio.add(filename);
        }
      }
    }
  }

  return Array.from(referencedAudio);
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Missing Supabase credentials' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    console.log('Starting audio storage audit...');

    // Get all files from storage bucket
    console.log('Listing storage bucket files...');
    const storageFiles = await listAllBucketFiles(supabase);
    console.log(`Found ${storageFiles.length} files in storage`);

    // Get all referenced audio from database
    console.log('Getting referenced audio from database...');
    const referencedAudio = await getReferencedAudioFromDB(supabase);
    console.log(`Found ${referencedAudio.length} referenced audio files`);

    // Create sets for comparison
    const storageSet = new Set(storageFiles);
    const referencedSet = new Set(referencedAudio);

    // Find missing in storage (referenced but not in bucket)
    const missingInStorage = referencedAudio.filter(file => !storageSet.has(file));

    // Find orphans (in bucket but not referenced)
    const orphans = storageFiles.filter(file => !referencedSet.has(file));

    const coveragePercent = referencedAudio.length > 0
      ? Math.round(((referencedAudio.length - missingInStorage.length) / referencedAudio.length) * 100)
      : 100;

    const report: AudioSyncReport = {
      storageFiles,
      referencedAudio,
      missingInStorage,
      orphans,
      summary: {
        storageCount: storageFiles.length,
        referencedCount: referencedAudio.length,
        missingCount: missingInStorage.length,
        orphanCount: orphans.length,
        coveragePercent,
      },
    };

    console.log(`Audit complete: ${storageFiles.length} in storage, ${referencedAudio.length} referenced, ${missingInStorage.length} missing, ${orphans.length} orphans`);

    return new Response(
      JSON.stringify({ ok: true, ...report }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Audio storage audit error:', errMsg);
    return new Response(
      JSON.stringify({ ok: false, error: errMsg }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
