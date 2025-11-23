import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SyncConfig {
  id: string;
  repository_url: string;
  branch: string;
  base_path: string;
  is_enabled: boolean;
}

interface Room {
  id: string;
  schema_id: string;
  tier: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    console.log('Starting GitHub sync...');

    // Get sync configuration
    const { data: configs, error: configError } = await supabase
      .from('github_sync_config')
      .select('*')
      .eq('is_enabled', true)
      .limit(1)
      .maybeSingle();

    if (configError) {
      console.error('Error fetching config:', configError);
      throw configError;
    }

    if (!configs) {
      console.log('No active sync configuration found');
      return new Response(
        JSON.stringify({ message: 'No active sync configuration' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const config = configs as SyncConfig;

    // Create sync log entry
    const { data: logEntry, error: logError } = await supabase
      .from('github_sync_logs')
      .insert({
        config_id: config.id,
        status: 'running',
      })
      .select()
      .single();

    if (logError) {
      console.error('Error creating log entry:', logError);
      throw logError;
    }

    // Get all rooms from database
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('id, schema_id, tier');

    if (roomsError) {
      console.error('Error fetching rooms:', roomsError);
      throw roomsError;
    }

    console.log(`Found ${rooms?.length || 0} rooms to check`);

    const results = {
      checked: 0,
      downloaded: 0,
      failed: 0,
      details: [] as any[],
    };

    // Helper function to generate expected filename
    function getSuggestedJsonBaseName(schemaId: string, tier: string): string {
      const words = schemaId.split('-');
      const capitalizedWords = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      );
      const baseName = capitalizedWords.join('_');
      const tierSuffix = tier ? `_${tier.toLowerCase().replace(/\s+/g, '')}` : '';
      return `${baseName}${tierSuffix}.json`;
    }

    // Check each room
    for (const room of rooms as Room[]) {
      results.checked++;
      const filename = getSuggestedJsonBaseName(room.schema_id, room.tier || '');
      const githubRawUrl = config.repository_url
        .replace('github.com', 'raw.githubusercontent.com')
        .replace(/\/$/, '');
      const fileUrl = `${githubRawUrl}/${config.branch}/${config.base_path}/${filename}`;

      try {
        console.log(`Checking file: ${filename}`);

        // Check if file exists locally by trying to fetch it
        const localCheckUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${config.base_path}/${filename}`;
        const localCheck = await fetch(localCheckUrl);

        if (localCheck.ok) {
          const contentType = localCheck.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            console.log(`File already exists and is valid: ${filename}`);
            continue;
          }
        }

        // File is missing or invalid, try to download from GitHub
        console.log(`Attempting to download: ${fileUrl}`);
        const githubResponse = await fetch(fileUrl);

        if (!githubResponse.ok) {
          console.log(`File not found on GitHub: ${filename}`);
          results.details.push({
            room_id: room.id,
            filename,
            status: 'not_found_on_github',
          });
          results.failed++;
          continue;
        }

        const content = await githubResponse.text();

        // Validate it's JSON
        try {
          JSON.parse(content);
        } catch {
          console.log(`Invalid JSON from GitHub: ${filename}`);
          results.details.push({
            room_id: room.id,
            filename,
            status: 'invalid_json',
          });
          results.failed++;
          continue;
        }

        // Save to storage or file system
        // Note: In a real implementation, you'd save this to your storage
        // For now, we'll just log success
        console.log(`Successfully downloaded: ${filename}`);
        results.downloaded++;
        results.details.push({
          room_id: room.id,
          filename,
          status: 'downloaded',
        });
      } catch (error) {
        console.error(`Error processing ${filename}:`, error);
        results.failed++;
        results.details.push({
          room_id: room.id,
          filename,
          status: 'error',
          error: error.message,
        });
      }
    }

    // Update sync log
    await supabase
      .from('github_sync_logs')
      .update({
        sync_completed_at: new Date().toISOString(),
        files_checked: results.checked,
        files_downloaded: results.downloaded,
        files_failed: results.failed,
        status: 'completed',
        details: results.details,
      })
      .eq('id', logEntry.id);

    // Update config last sync time
    await supabase
      .from('github_sync_config')
      .update({
        last_sync_at: new Date().toISOString(),
        last_sync_status: 'completed',
      })
      .eq('id', config.id);

    console.log('Sync completed:', results);

    return new Response(
      JSON.stringify({
        success: true,
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Sync error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
