import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Cache-Control': 'public, max-age=300, s-maxage=300', // Cache for 5 minutes
};

const getRoomSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required').max(100),
});

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

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const validation = getRoomSchema.safeParse(body);
    
    if (!validation.success) {
      console.error('Validation failed:', validation.error);
      return new Response(
        JSON.stringify({ error: 'Invalid request', details: validation.error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { roomId } = validation.data;
    console.log(`User ${user.id} requesting room: ${roomId}`);

    // Get user's tier
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select(`
        tier_id,
        status,
        subscription_tiers!inner (
          name
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    // Check if user is admin
    const { data: adminRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    const isAdmin = !!adminRole;
    const tierData = subscription?.subscription_tiers as any;
    const userTier = tierData?.name?.toLowerCase() || 'free';
    console.log(`User tier: ${userTier}, isAdmin: ${isAdmin}`);

    // Get room data
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .maybeSingle();

    if (roomError || !room) {
      console.error('Room not found:', roomError);
      return new Response(
        JSON.stringify({ error: 'Room not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check tier access
    const roomTier = room.tier?.toLowerCase() || 'free';
    const tierMap: Record<string, number> = {
      free: 0,
      vip1: 1,
      vip2: 2,
      vip3: 3,
      vip4: 4,
      vip5: 5,
      vip6: 6,
      vip7: 7,
      vip8: 8,
      vip9: 9,
    };

    const userTierLevel = tierMap[userTier] ?? 0;
    const roomTierLevel = tierMap[roomTier] ?? 0;

    if (!isAdmin && userTierLevel < roomTierLevel) {
      console.log(`Access denied: user tier ${userTierLevel} < room tier ${roomTierLevel}`);
      return new Response(
        JSON.stringify({
          error: 'Insufficient tier access',
          requiredTier: roomTier,
          userTier: userTier,
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log access
    await supabase.from('room_usage_analytics').insert({
      user_id: user.id,
      room_id: roomId,
      session_start: new Date().toISOString(),
    });

    console.log(`Access granted to room ${roomId}`);
    return new Response(
      JSON.stringify({
        success: true,
        room: room,
        access: {
          granted: true,
          userTier: userTier,
          roomTier: roomTier,
          isAdmin: isAdmin,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in get-room:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
