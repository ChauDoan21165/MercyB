import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface KidsEntry {
  display_order: number;
  content_en: string;
  content_vi: string;
  audio_filename?: string;
}

interface KidsRoomData {
  id: string;
  level_id: string;
  title_en: string;
  title_vi: string;
  description_en?: string;
  description_vi?: string;
  icon?: string;
  entries: KidsEntry[];
  meta: {
    tier: string;
    age_range: string;
    room_color: string;
  };
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
    if (!roomData.id || !roomData.level_id || !roomData.entries || roomData.entries.length !== 5) {
      throw new Error('Invalid room data structure');
    }

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
        .eq('id', roomData.id)
        .single();

      if (existingRoom) {
        // Update room
        const { error: updateError } = await supabaseClient
          .from('kids_rooms')
          .update({
            title_en: roomData.title_en,
            title_vi: roomData.title_vi,
            description_en: roomData.description_en,
            description_vi: roomData.description_vi,
            icon: roomData.icon,
            updated_at: new Date().toISOString()
          })
          .eq('id', roomData.id);

        if (updateError) throw updateError;

        // Delete existing entries
        await supabaseClient
          .from('kids_entries')
          .delete()
          .eq('room_id', roomData.id);

        roomResult = { updated: true };
      } else if (mode === 'upsert') {
        // Insert new room (upsert mode)
        const { error: insertError } = await supabaseClient
          .from('kids_rooms')
          .insert({
            id: roomData.id,
            level_id: roomData.level_id,
            title_en: roomData.title_en,
            title_vi: roomData.title_vi,
            description_en: roomData.description_en,
            description_vi: roomData.description_vi,
            icon: roomData.icon,
            display_order: roomData.entries.length,
            is_active: true
          });

        if (insertError) throw insertError;
        roomResult = { created: true };
      } else {
        throw new Error('Room not found and mode is update');
      }
    }

    // Process entries
    const entries = roomData.entries.map((entry) => ({
      id: `${roomData.id}-entry-${entry.display_order}`,
      room_id: roomData.id,
      content_en: entry.content_en,
      content_vi: entry.content_vi,
      audio_url: entry.audio_filename 
        ? `/audio/kids/${entry.audio_filename}` 
        : null,
      display_order: entry.display_order,
      is_active: true
    }));

    const { error: entriesError } = await supabaseClient
      .from('kids_entries')
      .insert(entries);

    if (entriesError) throw entriesError;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Room "${roomData.title_en}" processed successfully`,
        room_id: roomData.id,
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
