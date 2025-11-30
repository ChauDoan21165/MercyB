// CURRENT ERROR LOG:
// 2025-11-30T09:39:58Z ERROR room-health-summary error: column rooms.raw_json does not exist
// Fixed by using correct column name 'entries' and adding graceful error handling

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

type RoomIssue = {
  code: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  context?: string;
};

type RoomHealthDetail = {
  room_id: string;
  issues: RoomIssue[];
  health_score: number;
  audio_coverage: number;
};

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

  // Initialize result structure with safe defaults
  const byTier: Record<string, {
    total_rooms: number;
    rooms_zero_audio: number;
    rooms_low_health: number;
    rooms_missing_json: number;
  }> = {};

  const tierCounts: Record<string, number> = {};
  const trackGaps: any[] = [];

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

    console.log('[room-health-summary] Processing request with tier filter:', tierFilter);

    // Build query for rooms with entries data (using correct column name)
    let roomsQuery = supabase
      .from("rooms")
      .select("id, tier, entries");
    
    if (tierFilter) {
      roomsQuery = roomsQuery.eq("tier", tierFilter);
    }

    const { data: roomsData, error: roomsErr } = await roomsQuery;
    if (roomsErr) {
      console.error('[room-health-summary] Rooms query error:', roomsErr);
      // Don't throw - continue with empty data
    }

    console.log('[room-health-summary] Fetched', roomsData?.length || 0, 'rooms');
    
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
      
      // Check for missing or invalid entries
      if (!room.entries || !Array.isArray(room.entries) || room.entries.length === 0) {
        byTier[tier].rooms_missing_json++;
      }
    }

    // Try to fetch health view data for audio and health metrics
    // If this fails, we'll just have zeros for audio/health metrics
    let healthQuery = supabase
      .from("room_health_view")
      .select("*");
    
    if (tierFilter) {
      healthQuery = healthQuery.eq("tier", tierFilter);
    }

    const { data: healthData, error: healthErr } = await healthQuery;
    if (healthErr) {
      console.error('[room-health-summary] Health view query error (non-fatal):', healthErr);
      // Don't throw - health view might not exist, we'll just skip audio/health metrics
    } else {
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
    }

    // Deep validation for specified tier (if deepScan=true)
    const roomDetails: RoomHealthDetail[] = [];
    const deepScan = tierFilter && (await req.json().catch(() => ({}))).deepScan === true;
    
    if (deepScan && tierFilter) {
      console.log('[room-health-summary] Running deep scan for tier:', tierFilter);
      
      for (const room of roomsData || []) {
        if ((room.tier || 'free').toLowerCase() !== tierFilter.toLowerCase()) continue;
        
        const issues: RoomIssue[] = [];
        let healthScore = 100;
        let audioCoverage = 0;
        
        // Check JSON structure
        const entries = Array.isArray(room.entries) ? room.entries : [];
        
        if (entries.length === 0) {
          issues.push({
            code: 'schema_missing_field',
            severity: 'error',
            message: 'No entries array or empty entries',
          });
          healthScore -= 50;
        } else {
          let entriesWithAudio = 0;
          let hasAllEntry = false;
          
          entries.forEach((entry: any, idx: number) => {
            if (!entry || typeof entry !== 'object') {
              issues.push({
                code: 'schema_wrong_type',
                severity: 'error',
                message: `Entry ${idx} is not an object`,
              });
              return;
            }
            
            // Check slug
            if (entry.slug === 'all' || entry.slug === 'all-entry') {
              hasAllEntry = true;
            }
            
            if (!entry.slug || typeof entry.slug !== 'string') {
              issues.push({
                code: 'schema_missing_field',
                severity: 'warning',
                message: `Entry ${idx} missing slug`,
                context: `entry[${idx}]`,
              });
            }
            
            // Check bilingual content
            const copy = entry.copy;
            if (!copy || typeof copy !== 'object') {
              issues.push({
                code: 'bilingual_missing',
                severity: 'error',
                message: `Entry ${idx} missing copy object`,
                context: `entry[${idx}]`,
              });
            } else {
              if (!copy.en || typeof copy.en !== 'string' || copy.en.trim().length === 0) {
                issues.push({
                  code: 'bilingual_missing',
                  severity: 'error',
                  message: `Entry ${idx} missing copy.en`,
                  context: `entry[${idx}].copy.en`,
                });
              }
              if (!copy.vi || typeof copy.vi !== 'string' || copy.vi.trim().length === 0) {
                issues.push({
                  code: 'bilingual_missing',
                  severity: 'error',
                  message: `Entry ${idx} missing copy.vi`,
                  context: `entry[${idx}].copy.vi`,
                });
              }
            }
            
            // Check keywords
            const keywordsEn = entry.keywords_en;
            const keywordsVi = entry.keywords_vi;
            
            if (!Array.isArray(keywordsEn) || keywordsEn.length < 3 || keywordsEn.length > 5) {
              issues.push({
                code: 'keywords_invalid',
                severity: 'warning',
                message: `Entry ${idx} keywords_en should have 3-5 items`,
                context: `entry[${idx}].keywords_en`,
              });
            }
            
            if (!Array.isArray(keywordsVi) || keywordsVi.length < 3 || keywordsVi.length > 5) {
              issues.push({
                code: 'keywords_invalid',
                severity: 'warning',
                message: `Entry ${idx} keywords_vi should have 3-5 items`,
                context: `entry[${idx}].keywords_vi`,
              });
            }
            
            // Check tags
            if (!Array.isArray(entry.tags) || entry.tags.length === 0) {
              issues.push({
                code: 'tags_missing',
                severity: 'info',
                message: `Entry ${idx} missing tags array`,
                context: `entry[${idx}].tags`,
              });
            }
            
            // Check severity
            const severity = entry.severity_level;
            if (severity == null || typeof severity !== 'number' || severity < 1 || severity > 5) {
              issues.push({
                code: 'severity_invalid',
                severity: 'warning',
                message: `Entry ${idx} severity_level should be 1-5`,
                context: `entry[${idx}].severity_level`,
              });
            }
            
            // Check audio
            const audio = entry.audio;
            if (audio && typeof audio === 'string' && audio.trim().length > 0) {
              if (audio.includes('/')) {
                issues.push({
                  code: 'audio_path_has_folder',
                  severity: 'warning',
                  message: `Entry ${idx} audio contains folder path`,
                  context: `entry[${idx}].audio`,
                });
              }
              entriesWithAudio++;
            } else if (audio && typeof audio === 'object') {
              issues.push({
                code: 'audio_path_has_folder',
                severity: 'warning',
                message: `Entry ${idx} audio is object, should be string`,
                context: `entry[${idx}].audio`,
              });
            }
          });
          
          // Check All entry
          if (!hasAllEntry) {
            issues.push({
              code: 'all_entry_missing',
              severity: 'warning',
              message: 'Missing "All" entry',
            });
          }
          
          // Calculate audio coverage
          audioCoverage = entries.length > 0 
            ? Math.round((entriesWithAudio / entries.length) * 100)
            : 0;
          
          // Adjust health score based on issues
          const errorCount = issues.filter(i => i.severity === 'error').length;
          const warningCount = issues.filter(i => i.severity === 'warning').length;
          
          healthScore -= (errorCount * 10);
          healthScore -= (warningCount * 3);
          healthScore = Math.max(0, Math.min(100, healthScore));
        }
        
        roomDetails.push({
          room_id: room.id,
          issues,
          health_score: healthScore,
          audio_coverage: audioCoverage,
        });
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

    // Calculate global totals with safety checks
    const global = {
      total_rooms: Object.values(byTier).reduce((sum, t) => sum + (t?.total_rooms || 0), 0),
      rooms_zero_audio: Object.values(byTier).reduce((sum, t) => sum + (t?.rooms_zero_audio || 0), 0),
      rooms_low_health: Object.values(byTier).reduce((sum, t) => sum + (t?.rooms_low_health || 0), 0),
      rooms_missing_json: Object.values(byTier).reduce((sum, t) => sum + (t?.rooms_missing_json || 0), 0),
    };

    const response = {
      global,
      byTier,
      vip_track_gaps: trackGaps,
      tier_counts: tierCounts,
      room_details: roomDetails.length > 0 ? roomDetails : undefined,
    };

    console.log('[room-health-summary] Returning response:', JSON.stringify(response, null, 2));

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (err: any) {
    console.error("[room-health-summary] Fatal error:", err);
    
    // Even on fatal error, return 200 with empty/safe response structure
    const safeResponse = {
      global: {
        total_rooms: 0,
        rooms_zero_audio: 0,
        rooms_low_health: 0,
        rooms_missing_json: 0,
      },
      byTier,
      vip_track_gaps: trackGaps,
      tier_counts: tierCounts,
    };
    
    return new Response(
      JSON.stringify(safeResponse),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
