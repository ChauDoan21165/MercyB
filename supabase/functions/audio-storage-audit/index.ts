import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 🔧 FIX: Use the correct bucket name - "audio" is the public bucket with mp3 files
const BUCKET_NAME = 'audio';

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
  debug?: {
    sanityTests: Record<string, { inStorage: boolean; inReferenced: boolean }>;
    bucketName: string;
  };
}

/**
 * Normalize audio filename to bare filename only (no folder prefix)
 */
function normalizeAudioName(name: string): string {
  if (!name) return '';
  // Trim whitespace, get last segment after any slashes, lowercase
  return (name.trim().split('/').pop() ?? '').toLowerCase();
}

/**
 * Recursively list all .mp3 files in a bucket folder
 */
async function listFolderRecursive(
  supabase: any,
  folderPath: string,
  allFiles: string[]
): Promise<void> {
  let offset = 0;
  const limit = 1000;

  while (true) {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folderPath, { limit, offset, sortBy: { column: 'name', order: 'asc' } });

    if (error) {
      console.error(`Error listing bucket folder '${folderPath}':`, error.message);
      break;
    }

    if (!data || data.length === 0) break;

    for (const obj of data) {
      if (!obj.name) continue;

      const fullPath = folderPath ? `${folderPath}/${obj.name}` : obj.name;

      // More robust folder detection: if it's not an mp3, treat as potential folder
      // This is more future-proof than relying on obj.id === null
      if (!obj.name.toLowerCase().endsWith('.mp3')) {
        // Assume it's a folder and recurse into it
        await listFolderRecursive(supabase, fullPath, allFiles);
      } else {
        // It's an mp3 file - normalize to bare filename
        const normalized = normalizeAudioName(obj.name);
        if (normalized) {
          allFiles.push(normalized);
        }
      }
    }

    if (data.length < limit) break;
    offset += limit;
  }
}

/**
 * List all .mp3 files in the bucket (including all subdirectories)
 */
async function listAllBucketFiles(supabase: any): Promise<string[]> {
  const allFiles: string[] = [];
  await listFolderRecursive(supabase, '', allFiles);
  return allFiles;
}

/**
 * Get all referenced audio filenames from database rooms
 */
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
      // Check audio field (can be string or object)
      if (entry.audio) {
        if (typeof entry.audio === 'string') {
          const normalized = normalizeAudioName(entry.audio);
          if (normalized.endsWith('.mp3')) {
            referencedAudio.add(normalized);
          }
        } else if (typeof entry.audio === 'object') {
          // Handle object format { en: "...", vi: "..." }
          for (const lang of ['en', 'vi']) {
            if (entry.audio[lang] && typeof entry.audio[lang] === 'string') {
              const normalized = normalizeAudioName(entry.audio[lang]);
              if (normalized.endsWith('.mp3')) {
                referencedAudio.add(normalized);
              }
            }
          }
        }
      }

      // Check audio_en and audio_vi fields
      if (entry.audio_en && typeof entry.audio_en === 'string') {
        const normalized = normalizeAudioName(entry.audio_en);
        if (normalized.endsWith('.mp3')) {
          referencedAudio.add(normalized);
        }
      }
      if (entry.audio_vi && typeof entry.audio_vi === 'string') {
        const normalized = normalizeAudioName(entry.audio_vi);
        if (normalized.endsWith('.mp3')) {
          referencedAudio.add(normalized);
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
    console.log(`Using bucket: ${BUCKET_NAME}`);

    // Get all files from storage bucket (recursively)
    console.log('Listing storage bucket files (recursive)...');
    const storageFiles = await listAllBucketFiles(supabase);
    console.log(`Found ${storageFiles.length} .mp3 files in storage bucket "${BUCKET_NAME}"`);

    // Get all referenced audio from database
    console.log('Getting referenced audio from database...');
    const referencedAudio = await getReferencedAudioFromDB(supabase);
    console.log(`Found ${referencedAudio.length} referenced audio files`);

    // Create sets for comparison (already normalized)
    const storageSet = new Set(storageFiles);
    const referencedSet = new Set(referencedAudio);

    // Find missing in storage (referenced but not in bucket)
    const missingInStorage = [...referencedSet].filter(file => !storageSet.has(file));

    // Find orphans (in bucket but not referenced)
    const orphans = [...storageSet].filter(file => !referencedSet.has(file));

    const coveragePercent = referencedSet.size > 0
      ? Math.round(((referencedSet.size - missingInStorage.length) / referencedSet.size) * 100)
      : 100;

    // Sanity tests with known files
    const sanityTestFiles = [
      'meaning-of-life-vip1-entry-1-en.mp3',
      'meaning_of_life_vip1_entry_1_en.mp3',
      'ef01_01_en.mp3',
      'english_foundation_ef01_01_en.mp3',
    ];

    const sanityTests: Record<string, { inStorage: boolean; inReferenced: boolean }> = {};
    for (const testFile of sanityTestFiles) {
      const normalized = normalizeAudioName(testFile);
      sanityTests[testFile] = {
        inStorage: storageSet.has(normalized),
        inReferenced: referencedSet.has(normalized),
      };
    }

    console.log('Sanity tests:', JSON.stringify(sanityTests, null, 2));

    const report: AudioSyncReport = {
      storageFiles: [...storageSet], // Return unique normalized filenames
      referencedAudio: [...referencedSet],
      missingInStorage,
      orphans,
      summary: {
        storageCount: storageSet.size,
        referencedCount: referencedSet.size,
        missingCount: missingInStorage.length,
        orphanCount: orphans.length,
        coveragePercent,
      },
      debug: {
        sanityTests,
        bucketName: BUCKET_NAME,
      },
    };

    console.log(`Audit complete: ${storageSet.size} in storage, ${referencedSet.size} referenced, ${missingInStorage.length} missing, ${orphans.length} orphans`);

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
