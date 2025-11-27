import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExportRoomRequest {
  room_id: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify authentication and admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role
    const { data: adminRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!adminRole) {
      console.error('Admin access denied');
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { room_id }: ExportRoomRequest = await req.json();
    console.log(`Exporting room: ${room_id}`);

    // Get complete room data
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', room_id)
      .single();

    if (roomError || !room) {
      console.error('Room not found:', roomError);
      return new Response(
        JSON.stringify({ error: 'Room not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create export JSON with metadata
    const exportData = {
      export_date: new Date().toISOString(),
      exported_by: user.email,
      room: {
        ...room,
        entry_count: Array.isArray(room.entries) ? room.entries.length : 0,
      },
    };

    // Log admin action
    await supabase.rpc('log_admin_access', {
      _accessed_table: 'rooms',
      _action: 'export',
      _metadata: { room_id },
    });

    console.log(`Room ${room_id} exported successfully`);

    return new Response(
      JSON.stringify({
        success: true,
        export: exportData,
        filename: `${room_id}_export_${new Date().toISOString().split('T')[0]}.json`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in export-room:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
