// Room Health Summary Edge Function
// Single source of truth: public/data/*.json files
// Reuses Deep Scan validation logic for consistency

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { normalizeTier, type TierId, VIP_TIER_IDS } from "../_shared/tier-utils.ts";
import type { RoomIssue, RoomValidationResult, RoomHealthSummary, MercyBladeRoomJson } from "../_shared/room-types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

// Types imported from shared module

// Helper: Validate JSON structure following Mercy Blade standard
function validateRoomJson(roomId: string, jsonData: Partial<MercyBladeRoomJson>): RoomIssue[] {
  const issues: RoomIssue[] = [];
  
  // Check root structure
  if (!jsonData || typeof jsonData !== 'object') {
    issues.push({
      code: 'invalid_json',
      severity: 'error',
      message: 'JSON is not a valid object',
    });
    return issues;
  }
  
  // Check required root fields - COMPLETE MERCY BLADE SPEC
  if (!jsonData.id) {
    issues.push({
      code: 'missing_id',
      severity: 'error',
      message: 'Missing root field: id',
    });
  }
  
  if (!jsonData.tier) {
    issues.push({
      code: 'schema_missing_field',
      severity: 'error',
      message: 'Missing root field: tier',
    });
  }
  
  if (!jsonData.domain) {
    issues.push({
      code: 'missing_domain',
      severity: 'warning',
      message: 'Missing root field: domain',
    });
  }
  
  if (!jsonData.title || typeof jsonData.title !== 'object') {
    issues.push({
      code: 'schema_missing_field',
      severity: 'error',
      message: 'Missing or invalid root field: title',
    });
  } else {
    if (!jsonData.title.en) {
      issues.push({
        code: 'schema_missing_field',
        severity: 'error',
        message: 'Missing title.en',
      });
    }
    if (!jsonData.title.vi) {
      issues.push({
        code: 'schema_missing_field',
        severity: 'error',
        message: 'Missing title.vi',
      });
    }
  }
  
  // Check entries array
  if (!Array.isArray(jsonData.entries)) {
    issues.push({
      code: 'schema_missing_field',
      severity: 'error',
      message: 'Missing or invalid entries array',
    });
    return issues;
  }
  
  if (jsonData.entries.length === 0) {
    issues.push({
      code: 'schema_missing_field',
      severity: 'error',
      message: 'Entries array is empty',
    });
    return issues;
  }
  
  // Validate each entry
  let hasAllEntry = false;
  jsonData.entries.forEach((entry: any, idx: number) => {
    if (!entry || typeof entry !== 'object') {
      issues.push({
        code: 'schema_wrong_type',
        severity: 'error',
        message: `Entry ${idx} is not an object`,
      });
      return;
    }
    
    // Check for All entry
    if (entry.slug === 'all' || entry.slug === 'all-entry') {
      hasAllEntry = true;
    }
    
    // Check required entry fields
    if (!entry.slug) {
      issues.push({
        code: 'schema_missing_field',
        severity: 'warning',
        message: `Entry ${idx} missing slug`,
        context: `entry[${idx}].slug`,
      });
    }
    
    // Check bilingual copy
    if (!entry.copy || typeof entry.copy !== 'object') {
      issues.push({
        code: 'bilingual_missing',
        severity: 'error',
        message: `Entry ${idx} missing copy object`,
        context: `entry[${idx}].copy`,
      });
    } else {
      if (!entry.copy.en || entry.copy.en.trim().length === 0) {
        issues.push({
          code: 'bilingual_missing',
          severity: 'error',
          message: `Entry ${idx} missing copy.en`,
          context: `entry[${idx}].copy.en`,
        });
      }
      if (!entry.copy.vi || entry.copy.vi.trim().length === 0) {
        issues.push({
          code: 'bilingual_missing',
          severity: 'error',
          message: `Entry ${idx} missing copy.vi`,
          context: `entry[${idx}].copy.vi`,
        });
      }
    }
    
    // Check keywords
    if (!Array.isArray(entry.keywords_en) || entry.keywords_en.length < 3 || entry.keywords_en.length > 5) {
      issues.push({
        code: 'keywords_invalid',
        severity: 'warning',
        message: `Entry ${idx} keywords_en should have 3-5 items`,
        context: `entry[${idx}].keywords_en`,
      });
    }
    
    if (!Array.isArray(entry.keywords_vi) || entry.keywords_vi.length < 3 || entry.keywords_vi.length > 5) {
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
    
    // Check audio format
    const audio = entry.audio;
    if (audio && typeof audio === 'object') {
      issues.push({
        code: 'audio_path_has_folder',
        severity: 'warning',
        message: `Entry ${idx} audio is object, should be string`,
        context: `entry[${idx}].audio`,
      });
    } else if (audio && typeof audio === 'string' && audio.includes('/')) {
      issues.push({
        code: 'audio_path_has_folder',
        severity: 'warning',
        message: `Entry ${idx} audio contains folder path`,
        context: `entry[${idx}].audio`,
      });
    }
  });
  
  // Check for All entry
  if (!hasAllEntry) {
    issues.push({
      code: 'all_entry_missing',
      severity: 'warning',
      message: 'Missing "All" entry (slug="all")',
    });
  }
  
  return issues;
}

// Helper: Compute health score and audio coverage from JSON
function computeHealthMetrics(jsonData: any, issues: RoomIssue[]): { health_score: number; audio_coverage: number } {
  let healthScore = 100;
  let audioCoverage = 0;
  
  // Deduct points based on issue severity
  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  
  healthScore -= (errorCount * 10);
  healthScore -= (warningCount * 3);
  healthScore = Math.max(0, Math.min(100, healthScore));
  
  // Calculate audio coverage
  if (Array.isArray(jsonData.entries) && jsonData.entries.length > 0) {
    let entriesWithAudio = 0;
    jsonData.entries.forEach((entry: any) => {
      const audio = entry.audio;
      if (audio && typeof audio === 'string' && audio.trim().length > 0) {
        entriesWithAudio++;
      }
    });
    audioCoverage = Math.round((entriesWithAudio / jsonData.entries.length) * 100);
  }
  
  return { health_score: healthScore, audio_coverage: audioCoverage };
}

// Helper: Validate a single room by fetching and parsing its JSON
async function validateRoom(roomId: string, tier: string): Promise<RoomValidationResult> {
  const result: RoomValidationResult = {
    room_id: roomId,
    tier,
    json_missing: false,
    json_invalid: false,
    health_score: 0,
    audio_coverage: 0,
    has_zero_audio: false,
    is_low_health: false,
    issues: [],
  };
  
  try {
    // Fetch JSON file from public/data/ (frontend deployment)
    // Try the primary deployment URL first
    const primaryUrl = `https://mercyblade.lovable.app/public/data/${roomId}.json`;
    let jsonResponse = await fetch(primaryUrl);
    
    // If primary fails, try alternative paths
    if (!jsonResponse.ok) {
      const altUrl = `https://mercyblade.lovable.app/data/${roomId}.json`;
      jsonResponse = await fetch(altUrl);
    }
    
    if (!jsonResponse.ok) {
      result.json_missing = true;
      result.issues.push({
        code: 'missing_file',
        severity: 'error',
        message: `Missing JSON file at public/data/${roomId}.json`,
      });
      return result;
    }
    
    // Parse JSON
    let jsonData: any;
    try {
      jsonData = await jsonResponse.json();
    } catch (parseErr) {
      result.json_invalid = true;
      result.issues.push({
        code: 'invalid_json',
        severity: 'error',
        message: 'JSON file cannot be parsed',
      });
      return result;
    }
    
    // Validate JSON structure
    const validationIssues = validateRoomJson(roomId, jsonData);
    result.issues = validationIssues;
    
    // Compute health metrics
    const metrics = computeHealthMetrics(jsonData, validationIssues);
    result.health_score = metrics.health_score;
    result.audio_coverage = metrics.audio_coverage;
    
    // Set flags
    result.has_zero_audio = metrics.audio_coverage === 0;
    result.is_low_health = metrics.health_score < 50;
    
  } catch (err: any) {
    console.error(`[room-health-summary] Error validating room ${roomId}:`, err.message);
    result.json_missing = true;
    result.issues.push({
      code: 'missing_file',
      severity: 'error',
      message: `Failed to fetch or validate JSON: ${err.message}`,
    });
  }
  
  return result;
}


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST" && req.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  // 🔹 Read body ONCE (POST only)
  let body: any = {};
  if (req.method === "POST") {
    body = await req.json().catch(() => ({}));
  }

  // 🔹 Tier filter from body or query string (normalized)
  let tierFilter: string | null = null;
  if (req.method === "POST") {
    if (typeof body.tier === "string" && body.tier.trim()) {
      tierFilter = body.tier.trim().toLowerCase();
    }
  } else if (req.method === "GET") {
    const url = new URL(req.url);
    const t = url.searchParams.get("tier");
    if (t && t.trim()) {
      tierFilter = t.trim().toLowerCase();
    }
  }

  // 🔹 Deep scan flag comes ONLY from body.deepScan
  const deepScan = body.deepScan === true;

  console.log("[room-health-summary] tierFilter:", tierFilter, "deepScan:", deepScan);

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
    // Fetch rooms from database - include slug for JSON filename matching
    // NOTE: Do NOT filter by tier in SQL - we need to normalize first
    const { data: roomsData, error: roomsErr } = await supabase
      .from("rooms")
      .select("id, tier, slug");
    
    if (roomsErr) {
      console.error('[room-health-summary] Rooms query error:', roomsErr);
      // Don't throw - continue with empty data
    }

    console.log('[room-health-summary] Fetched', roomsData?.length || 0, 'rooms from database');
    
    // Validate each room by fetching and parsing its JSON file
    const validationResults: RoomValidationResult[] = [];
    
    for (const room of roomsData || []) {
      // Normalize tier from DB format (e.g., "VIP1 / VIP1" -> "vip1")
      const normalizedRoomTier = normalizeTier(room.tier);
      
      // Skip if tier filter is set and doesn't match
      if (tierFilter && normalizedRoomTier !== tierFilter) {
        continue;
      }
      
      // CRITICAL: Use slug (which matches JSON filenames) instead of UUID id
      const jsonId = ((room as any).slug || room.id) as string;
      const result = await validateRoom(jsonId, room.tier || 'free');
      validationResults.push(result);
      
      // Use normalized tier for aggregation
      const tier = normalizedRoomTier;
      
      // Initialize tier object if not exists
      if (!byTier[tier]) {
        byTier[tier] = {
          total_rooms: 0,
          rooms_zero_audio: 0,
          rooms_low_health: 0,
          rooms_missing_json: 0,
        };
      }
      
      // Update tier metrics
      byTier[tier].total_rooms++;
      tierCounts[tier] = (tierCounts[tier] || 0) + 1;
      
      if (result.json_missing || result.json_invalid) {
        byTier[tier].rooms_missing_json++;
      }
      
      if (result.has_zero_audio) {
        byTier[tier].rooms_zero_audio++;
      }
      
      if (result.is_low_health) {
        byTier[tier].rooms_low_health++;
      }
    }

    console.log('[room-health-summary] Validation complete. Results by tier:', JSON.stringify(byTier, null, 2));

    // Check for VIP tiers with 0 rooms (only if not filtering by specific tier)
    if (!tierFilter) {
      for (const tier of VIP_TIER_IDS) {
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

    const response: RoomHealthSummary = {
      global,
      byTier,
      vip_track_gaps: trackGaps,
      tier_counts: tierCounts,
      room_details: validationResults, // Per-room health details for advanced UI panels
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
    
    // Return 200 but with fatal_error flag to distinguish from empty results
    const errorResponse: RoomHealthSummary = {
      global: {
        total_rooms: 0,
        rooms_zero_audio: 0,
        rooms_low_health: 0,
        rooms_missing_json: 0,
      },
      byTier: {},
      vip_track_gaps: [],
      tier_counts: {},
      fatal_error: true,
      error_message: err?.message || 'Unknown error occurred',
    };
    
    return new Response(
      JSON.stringify(errorResponse),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
