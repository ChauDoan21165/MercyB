import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RoomJson {
  id: string;
  title?: { en: string; vi: string };
  description?: { en: string; vi: string };
  name?: string;
  name_vi?: string;
  content?: { en: string; vi: string };
  room_essay?: { en: string; vi: string };
  room_essay_en?: string;
  room_essay_vi?: string;
  tier?: string;
  domain?: string;
  entries: any[];
  keywords?: string[];
  schema_id?: string;
}

interface RoomSyncLog {
  roomId: string;
  sourceFieldUsed: 'title' | 'description' | 'name_fallback';
  status: 'updated' | 'inserted' | 'skipped' | 'error';
  errorMessage?: string;
}

interface SyncSummary {
  discovered: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: number;
  logs: RoomSyncLog[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🔄 Starting JSON file sync from public/data/...');

    // Fetch all JSON files from public/data/ directory
    const baseUrl = Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovableproject.com') || '';
    console.log('📂 Scanning directory:', `${baseUrl}/data/`);

    // Get list of existing rooms in database
    const { data: existingRooms, error: fetchError } = await supabase
      .from('rooms')
      .select('id, title_en, tier');

    if (fetchError) {
      throw new Error(`Failed to fetch existing rooms: ${fetchError.message}`);
    }

    const existingRoomIds = new Set(existingRooms?.map(r => r.id) || []);
    console.log('📊 Found', existingRoomIds.size, 'existing rooms in database');

    // Scan for JSON files by trying common room patterns
    const roomsToSync: RoomJson[] = [];
    const errors: string[] = [];
    
    // Try to discover JSON files by attempting to fetch known patterns
    // This is a workaround since we can't directly list directory contents in edge functions
    const potentialFiles: string[] = [];
    
    // Get all rooms from database to check their JSON files
    if (existingRooms) {
      for (const room of existingRooms) {
        potentialFiles.push(`${room.id}.json`);
      }
    }

    // Also scan for common patterns (this is limited but covers most cases)
    const commonPrefixes = [
      'strategic_', 'corporate_', 'national_', 'scipio_', 'napoleon_',
      'meaning-of-life', 'philosophy-', 'reading_comprehension_', 'science_for_',
      'space_astronomy_', 'simple_history_', 'geography_for_', 'digital_literacy_',
      'internet_vocabulary_'
    ];

    console.log('🔍 Attempting to discover JSON files...');
    const syncLogs: RoomSyncLog[] = [];
    let discoveredCount = 0;
    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const filename of potentialFiles) {
      try {
        const jsonUrl = `${baseUrl}/data/${filename}`;
        const response = await fetch(jsonUrl);
        
        if (!response.ok) {
          continue; // File doesn't exist, skip
        }

        const jsonData: RoomJson = await response.json();
        discoveredCount++;

        // Validate JSON structure
        if (!jsonData.id || !jsonData.entries || !Array.isArray(jsonData.entries)) {
          const log: RoomSyncLog = {
            roomId: jsonData.id || filename,
            sourceFieldUsed: 'title',
            status: 'error',
            errorMessage: 'Invalid JSON structure: missing id or entries array'
          };
          syncLogs.push(log);
          errorCount++;
          continue;
        }

        const roomId = jsonData.id;

        // EXPLICIT TITLE MAPPING RULES
        let titleEn: string;
        let titleVi: string;
        let sourceFieldUsed: 'title' | 'description' | 'name_fallback';

        if (jsonData.title?.en && jsonData.title?.vi) {
          // Rule 1: title.en/vi is canonical
          titleEn = jsonData.title.en;
          titleVi = jsonData.title.vi;
          sourceFieldUsed = 'title';
        } else if (jsonData.description?.en && jsonData.description?.vi) {
          // Rule 2: fallback to description.en/vi
          titleEn = jsonData.description.en;
          titleVi = jsonData.description.vi;
          sourceFieldUsed = 'description';
        } else if (jsonData.name || jsonData.name_vi) {
          // Rule 3: fallback to name/name_vi
          titleEn = jsonData.name || 'Untitled';
          titleVi = jsonData.name_vi || 'Chưa có tiêu đề';
          sourceFieldUsed = 'name_fallback';
        } else {
          // Rule 4: ERROR - no title source found
          const log: RoomSyncLog = {
            roomId,
            sourceFieldUsed: 'title',
            status: 'error',
            errorMessage: 'No title source found (checked title, description, name)'
          };
          syncLogs.push(log);
          errorCount++;
          console.error('❌ No title source for:', roomId);
          continue;
        }

        // Extract essay content (support multiple field names)
        const contentEn = jsonData.content?.en || jsonData.room_essay?.en || jsonData.room_essay_en || null;
        const contentVi = jsonData.content?.vi || jsonData.room_essay?.vi || jsonData.room_essay_vi || null;
        
        const tier = jsonData.tier || 'free';
        const domain = jsonData.domain || null;
        const entries = jsonData.entries || [];
        const keywords = jsonData.keywords || [];
        const schemaId = jsonData.schema_id || 'conversational';

        // Check if room exists in database
        if (existingRoomIds.has(roomId)) {
          // Update existing room
          const { error: updateError } = await supabase
            .from('rooms')
            .update({
              title_en: titleEn,
              title_vi: titleVi,
              room_essay_en: contentEn,
              room_essay_vi: contentVi,
              tier: tier,
              domain: domain,
              entries: entries,
              keywords: keywords,
              schema_id: schemaId,
              updated_at: new Date().toISOString()
            })
            .eq('id', roomId);

          if (updateError) {
            const log: RoomSyncLog = {
              roomId,
              sourceFieldUsed,
              status: 'error',
              errorMessage: updateError.message
            };
            syncLogs.push(log);
            errorCount++;
            console.error('❌ Update failed:', roomId, updateError.message);
          } else {
            const log: RoomSyncLog = {
              roomId,
              sourceFieldUsed,
              status: 'updated'
            };
            syncLogs.push(log);
            updatedCount++;
            console.log('✅ Updated:', roomId, `(source: ${sourceFieldUsed})`);
          }
        } else {
          // Insert new room
          const { error: insertError } = await supabase
            .from('rooms')
            .insert({
              id: roomId,
              title_en: titleEn,
              title_vi: titleVi,
              room_essay_en: contentEn,
              room_essay_vi: contentVi,
              tier: tier,
              domain: domain,
              entries: entries,
              keywords: keywords,
              schema_id: schemaId,
              is_demo: false,
              is_locked: false
            });

          if (insertError) {
            const log: RoomSyncLog = {
              roomId,
              sourceFieldUsed,
              status: 'error',
              errorMessage: insertError.message
            };
            syncLogs.push(log);
            errorCount++;
            console.error('❌ Insert failed:', roomId, insertError.message);
          } else {
            const log: RoomSyncLog = {
              roomId,
              sourceFieldUsed,
              status: 'inserted'
            };
            syncLogs.push(log);
            insertedCount++;
            console.log('✅ Inserted:', roomId, `(source: ${sourceFieldUsed})`);
          }
        }
      } catch (error) {
        console.error('❌ Error processing file:', error);
        errorCount++;
      }
    }

    const summary: SyncSummary = {
      discovered: discoveredCount,
      inserted: insertedCount,
      updated: updatedCount,
      skipped: skippedCount,
      errors: errorCount,
      logs: syncLogs
    };

    console.log('🎉 Sync complete!');
    console.log('📊 Summary:', summary);

    return new Response(
      JSON.stringify({
        success: errorCount === 0,
        ...summary
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('💥 Sync failed:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
