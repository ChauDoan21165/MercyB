import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { rateLimit, getClientIP } from "../_shared/rateLimit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const requestSchema = z.object({
  roomId: z.string().min(1),
});

/**
 * Secure Room Loader Edge Function
 * 
 * Serves room JSON files with tier-based access control.
 * Replaces direct public/data/*.json access.
 */
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
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limit room loading (prevent abuse)
    try {
      const clientIP = getClientIP(req);
      await rateLimit(`secure-room-loader:${user.id}:${clientIP}`, 60, 60_000); // 60 calls per minute
    } catch (error) {
      if (error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') {
        return new Response(
          JSON.stringify({ success: false, error: 'Too many requests. Please slow down.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const body = await req.json();
    const validation = requestSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid request', details: validation.error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { roomId } = validation.data;

    // Get user's tier
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select(`
        tier_id,
        status,
        subscription_tiers!inner (
          name,
          display_order
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
    const userTierLevel = tierData?.display_order || 0;

    // Get room data
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .maybeSingle();

    if (roomError || !room) {
      return new Response(
        JSON.stringify({ success: false, error: 'Room not found' }),
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

    const roomTierLevel = tierMap[roomTier] ?? 0;

    if (!isAdmin && userTierLevel < roomTierLevel) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'ACCESS_DENIED: insufficient tier',
          requiredTier: roomTier,
          userTier: userTier,
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return room data
    return new Response(
      JSON.stringify({
        success: true,
        room: room,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in secure-room-loader:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
