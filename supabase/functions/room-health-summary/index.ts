// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response("Method not allowed", { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    // Use room_health_view for health metrics
    const { count: roomsZeroAudio, error: zeroAudioErr } = await supabase
      .from("room_health_view")
      .select("*", { count: "exact", head: true })
      .eq("has_zero_audio", true);

    if (zeroAudioErr) throw zeroAudioErr;

    const { count: roomsLowHealth, error: lowHealthErr } = await supabase
      .from("room_health_view")
      .select("*", { count: "exact", head: true })
      .eq("is_low_health", true);

    if (lowHealthErr) throw lowHealthErr;

    // Check tier coverage by grouping rooms by tier
    const { data: tierData, error: tierErr } = await supabase
      .from("rooms")
      .select("tier");

    if (tierErr) throw tierErr;

    // Count rooms per tier
    const tierCounts = (tierData || []).reduce((acc: Record<string, number>, room: any) => {
      const tier = room.tier || 'unknown';
      acc[tier] = (acc[tier] || 0) + 1;
      return acc;
    }, {});

    // Check for VIP tiers with 0 rooms
    const vipTiers = ['vip1', 'vip2', 'vip3', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9'];
    const trackGaps: any[] = [];

    for (const tier of vipTiers) {
      const count = tierCounts[tier] || 0;
      if (count === 0) {
        trackGaps.push({
          tier,
          title: tier.toUpperCase(),
          total_rooms: 0,
          min_required: 1,
          issue: "no_rooms_found",
        });
      }
    }

    return new Response(
      JSON.stringify({
        rooms_zero_audio: roomsZeroAudio || 0,
        rooms_low_health: roomsLowHealth || 0,
        vip_track_gaps_count: trackGaps.length,
        vip_track_gaps: trackGaps,
        tier_counts: tierCounts,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (err: any) {
    console.error("room-health-summary error:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Unknown error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
