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

  if (req.method !== "POST" && req.method !== "GET") {
    return new Response("Method not allowed", { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    // Parse request parameters - support both POST (body) and GET (query params)
    let tierFilter: string | null = null;
    
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      tierFilter = body.tier ?? null;
    } else if (req.method === "GET") {
      const url = new URL(req.url);
      tierFilter = url.searchParams.get("tier");
    }

    // Normalize tier filter to lowercase if provided
    if (tierFilter) {
      tierFilter = tierFilter.toLowerCase();
    }

    // Build base query for rooms with health view data
    let healthQuery = supabase
      .from("room_health_view")
      .select("*");
    
    if (tierFilter) {
      healthQuery = healthQuery.eq("tier", tierFilter);
    }

    const { data: healthData, error: healthErr } = await healthQuery;
    if (healthErr) throw healthErr;

    // Build query for rooms with raw_json data
    let roomsQuery = supabase
      .from("rooms")
      .select("id, tier, raw_json, entries");
    
    if (tierFilter) {
      roomsQuery = roomsQuery.eq("tier", tierFilter);
    }

    const { data: roomsData, error: roomsErr } = await roomsQuery;
    if (roomsErr) throw roomsErr;

    // Initialize result structure
    const byTier: Record<string, {
      total_rooms: number;
      rooms_zero_audio: number;
      rooms_low_health: number;
      rooms_missing_json: number;
    }> = {};

    const tierCounts: Record<string, number> = {};
    const trackGaps: any[] = [];
    
    // Process each room to build tier-specific metrics
    for (const room of roomsData || []) {
      const tier = (room.tier || 'free').toLowerCase();
      
      // Initialize tier object if not exists
      if (!byTier[tier]) {
        byTier[tier] = {
          total_rooms: 0,
          rooms_zero_audio: 0,
          rooms_low_health: 0,
          rooms_missing_json: 0,
        };
      }
      
      // Count total rooms per tier
      byTier[tier].total_rooms++;
      tierCounts[tier] = (tierCounts[tier] || 0) + 1;
      
      // Check for missing or invalid raw_json
      const hasValidRawJson = room.raw_json && typeof room.raw_json === 'object';
      const hasEntries = hasValidRawJson && 
        Array.isArray((room.raw_json as any).entries) && 
        ((room.raw_json as any).entries.length > 0);
      
      if (!room.raw_json) {
        byTier[tier].rooms_missing_json++;
      } else if (!hasEntries) {
        byTier[tier].rooms_missing_json++;
      }
    }

    // Process health view data for audio and health metrics
    for (const healthRow of healthData || []) {
      const tier = (healthRow.tier || 'free').toLowerCase();
      
      if (!byTier[tier]) {
        byTier[tier] = {
          total_rooms: 0,
          rooms_zero_audio: 0,
          rooms_low_health: 0,
          rooms_missing_json: 0,
        };
      }
      
      if (healthRow.has_zero_audio) {
        byTier[tier].rooms_zero_audio++;
      }
      
      if (healthRow.is_low_health) {
        byTier[tier].rooms_low_health++;
      }
    }

    // Check for VIP tiers with 0 rooms (only if not filtering by specific tier)
    if (!tierFilter) {
      const vipTiers = ['vip1', 'vip2', 'vip3', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9'];
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
    }

    // Calculate global totals
    const global = {
      total_rooms: Object.values(byTier).reduce((sum, t) => sum + t.total_rooms, 0),
      rooms_zero_audio: Object.values(byTier).reduce((sum, t) => sum + t.rooms_zero_audio, 0),
      rooms_low_health: Object.values(byTier).reduce((sum, t) => sum + t.rooms_low_health, 0),
      rooms_missing_json: Object.values(byTier).reduce((sum, t) => sum + t.rooms_missing_json, 0),
    };

    return new Response(
      JSON.stringify({
        global,
        byTier,
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
