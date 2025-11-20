import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface KidsEntry {
  slug: string;
  keywords_en?: string[];
  keywords_vi?: string[];
  copy: {
    en: string;
    vi: string;
  };
  tags?: string[];
  audio: string;
}

interface KidsRoomData {
  id: string;
  tier: string;
  title: {
    en: string;
    vi: string;
  };
  content: {
    en: string;
    vi: string;
    audio?: string;
  };
  entries: KidsEntry[];
  meta: {
    age_range: string;
    level: string;
    created_at?: string;
    updated_at?: string;
    entry_count: number;
    room_color: string;
  };
}

// Helper to extract level from tier
function extractLevelFromTier(tier: string): string {
  if (tier.includes('Level 1') || tier.includes('Cấp 1')) return 'level1';
  if (tier.includes('Level 2') || tier.includes('Cấp 2')) return 'level2';
  if (tier.includes('Level 3') || tier.includes('Cấp 3')) return 'level3';
  return 'level1';
}

// Helper to convert room ID
function convertRoomIdToDbFormat(id: string, tier: string): string {
  const level = extractLevelFromTier(tier);
  const cleanId = id.replace(/_kids_l[1-3]$/, '');
  const dashedId = cleanId.replace(/_/g, '-');
  return `${level}-${dashedId}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { roomData, mode = 'insert' } = await req.json() as {
      roomData: KidsRoomData;
      mode?: 'insert' | 'update' | 'upsert';
    };

    // Validate basic structure
    if (!roomData.id || !roomData.tier || !roomData.entries || roomData.entries.length !== 5) {
      throw new Error('Invalid room data structure');
    }

    // Convert ID format and extract level
    const dbRoomId = convertRoomIdToDbFormat(roomData.id, roomData.tier);
    const levelId = extractLevelFromTier(roomData.tier);

    // Check if user is admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      throw new Error('User is not an admin');
    }

    // Process room data
    let roomResult;

    if (mode === 'update' || mode === 'upsert') {
      // Check if room exists
      const { data: existingRoom } = await supabaseClient
        .from('kids_rooms')
        .select('id')
        .eq('id', dbRoomId)
        .single();

      if (existingRoom) {
        // Update room
        const { error: updateError } = await supabaseClient
          .from('kids_rooms')
          .update({
            title_en: roomData.title.en,
            title_vi: roomData.title.vi,
            description_en: roomData.content.en,
            description_vi: roomData.content.vi,
            updated_at: new Date().toISOString()
          })
          .eq('id', dbRoomId);

        if (updateError) throw updateError;

        // Delete existing entries
        await supabaseClient
          .from('kids_entries')
          .delete()
          .eq('room_id', dbRoomId);

        roomResult = { updated: true };
      } else if (mode === 'upsert') {
        // Insert new room (upsert mode)
        const { error: insertError } = await supabaseClient
          .from('kids_rooms')
          .insert({
            id: dbRoomId,
            level_id: levelId,
            title_en: roomData.title.en,
            title_vi: roomData.title.vi,
            description_en: roomData.content.en,
            description_vi: roomData.content.vi,
            display_order: 1,
            is_active: true
          });

        if (insertError) throw insertError;
        roomResult = { created: true };
      } else {
        throw new Error('Room not found and mode is update');
      }
    }

    // Process entries
    const entries = roomData.entries.map((entry, index) => ({
      id: `${dbRoomId}-entry-${index + 1}`,
      room_id: dbRoomId,
      content_en: entry.copy.en,
      content_vi: entry.copy.vi,
      audio_url: entry.audio ? `/audio/kids/${entry.audio}` : null,
      display_order: index + 1,
      is_active: true
    }));

    const { error: entriesError } = await supabaseClient
      .from('kids_entries')
      .insert(entries);

    if (entriesError) throw entriesError;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Room "${roomData.title.en}" processed successfully`,
        room_id: dbRoomId,
        original_id: roomData.id,
        entries_count: entries.length,
        result: roomResult
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error processing Kids room:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
