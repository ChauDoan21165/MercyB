import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RoomJson {
  id: string;
  title?: { en: string; vi: string };
  name?: string;
  name_vi?: string;
  content?: { en: string; vi: string };
  room_essay_en?: string;
  room_essay_vi?: string;
  tier?: string;
  domain?: string;
  entries: any[];
  keywords?: string[];
  schema_id?: string;
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
    let discoveredCount = 0;
    let syncedCount = 0;
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
          errors.push(`Invalid JSON structure in ${filename}`);
          errorCount++;
          continue;
        }

        // Extract room data
        const roomId = jsonData.id;
        const titleEn = jsonData.title?.en || jsonData.name || 'Untitled';
        const titleVi = jsonData.title?.vi || jsonData.name_vi || 'Chưa có tiêu đề';
        const contentEn = jsonData.content?.en || jsonData.room_essay_en || null;
        const contentVi = jsonData.content?.vi || jsonData.room_essay_vi || null;
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
            errors.push(`Failed to update ${roomId}: ${updateError.message}`);
            errorCount++;
          } else {
            syncedCount++;
            console.log('✅ Updated:', roomId);
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
            errors.push(`Failed to insert ${roomId}: ${insertError.message}`);
            errorCount++;
          } else {
            syncedCount++;
            console.log('✅ Inserted:', roomId);
          }
        }
      } catch (error) {
        console.error('❌ Error processing file:', error);
        errorCount++;
      }
    }

    console.log('🎉 Sync complete!');
    console.log('📊 Stats:', {
      discovered: discoveredCount,
      synced: syncedCount,
      errors: errorCount
    });

    return new Response(
      JSON.stringify({
        success: true,
        discovered: discoveredCount,
        synced: syncedCount,
        errors: errorCount,
        errorDetails: errors.length > 0 ? errors : undefined
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
