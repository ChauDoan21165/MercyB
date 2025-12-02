// Room Health Summary Edge Function
// Single source of truth: public/data/*.json files
// Reuses Deep Scan validation logic for consistency

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import type { RoomIssue, RoomValidationResult, RoomHealthSummary, VipTierCoverage, MercyBladeRoomJson } from "../_shared/room-types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// ============= CANONICAL TIER TYPES =============

export type TierKey =
  | "free"
  | "vip1"
  | "vip2"
  | "vip3"
  | "vip4"
  | "vip5"
  | "vip6"
  | "vip7"
  | "vip8"
  | "vip9";

function normalizeTier(tierRaw: string | null | undefined): TierKey | null {
  if (!tierRaw) return null;
  const t = tierRaw.toLowerCase().trim();

  // Common DB formats, e.g. "Free / Miễn phí", "VIP1 / VIP1"
  if (t.startsWith("free") || t.includes("miễn phí")) return "free";
  if (t.startsWith("vip1") || t.includes("vip1")) return "vip1";
  if (t.startsWith("vip2") || t.includes("vip2")) return "vip2";
  if (t.startsWith("vip3") || t.includes("vip3")) return "vip3";
  if (t.startsWith("vip4") || t.includes("vip4")) return "vip4";
  if (t.startsWith("vip5") || t.includes("vip5")) return "vip5";
  if (t.startsWith("vip6") || t.includes("vip6")) return "vip6";
  if (t.startsWith("vip7") || t.includes("vip7")) return "vip7";
  if (t.startsWith("vip8") || t.includes("vip8")) return "vip8";
  if (t.startsWith("vip9") || t.includes("vip9")) return "vip9";

  // Fallback: already like "vip1", "free"
  if (
    [
      "free",
      "vip1",
      "vip2",
      "vip3",
      "vip4",
      "vip5",
      "vip6",
      "vip7",
      "vip8",
      "vip9",
    ].includes(t)
  ) {
    return t as TierKey;
  }

  return null;
}

function tierKeyToLabel(tier: TierKey): string {
  switch (tier) {
    case "free":
      return "Free / Miễn phí";
    case "vip1":
      return "VIP1 / VIP1";
    case "vip2":
      return "VIP2 / VIP2";
    case "vip3":
      return "VIP3 / VIP3";
    case "vip4":
      return "VIP4 / VIP4";
    case "vip5":
      return "VIP5 / VIP5";
    case "vip6":
      return "VIP6 / VIP6";
    case "vip7":
      return "VIP7 / VIP7";
    case "vip8":
      return "VIP8 / VIP8";
    case "vip9":
      return "VIP9 / VIP9";
  }
}

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

// ============= MERCY BLADE JSON TYPES (ENHANCED) =============

interface BilingualText {
  en: string;
  vi: string;
}

interface RoomEntry {
  slug: string;
  keywords_en: string[];
  keywords_vi: string[];
  copy: BilingualText;
  tags: string[];
  severity_level: number;
  audio?: string;  // Optional for some entries
}

interface RoomJson {
  id: string;
  tier: string;
  domain: string;
  title: BilingualText;
  content?: BilingualText;  // Optional intro/description
  entries: RoomEntry[];
  keywords_en?: string[];
  keywords_vi?: string[];
  meta?: {
    created_at?: string;
    updated_at?: string;
    entry_count?: number;
  };
}

// Helper: Validate bilingual text structure
function validateBilingualText(field: string, value: any, issues: RoomIssue[]): void {
  if (!value || typeof value !== 'object') {
    issues.push({
      code: 'bilingual_missing',
      severity: 'error',
      message: `${field} must be an object with {en, vi} fields`,
      context: field,
    });
    return;
  }
  
  if (!value.en || typeof value.en !== 'string' || value.en.trim().length === 0) {
    issues.push({
      code: 'bilingual_missing',
      severity: 'error',
      message: `${field}.en is missing or empty`,
      context: `${field}.en`,
    });
  }
  
  if (!value.vi || typeof value.vi !== 'string' || value.vi.trim().length === 0) {
    issues.push({
      code: 'bilingual_missing',
      severity: 'error',
      message: `${field}.vi is missing or empty`,
      context: `${field}.vi`,
    });
  }
}

// Helper: Validate audio filename pattern
function validateAudioFilename(roomId: string, filename: string, entryIndex: number, issues: RoomIssue[]): void {
  // Audio should be a simple filename, not a path
  if (filename.includes('/')) {
    issues.push({
      code: 'audio_path_has_folder',
      severity: 'warning',
      message: `Entry ${entryIndex} audio contains folder path (should be filename only)`,
      context: `entries[${entryIndex}].audio`,
    });
    return;
  }
  
  // Expected pattern: {room_id}_{number}_{lang}.mp3 or {room_id}_all_{lang}.mp3
  const expectedPatterns = [
    new RegExp(`^${roomId.replace(/_/g, '_')}_(\\d+|all)_(en|vi)\\.mp3$`),
    new RegExp(`^[a-z0-9_]+_(\\d+|all)_(en|vi)\\.mp3$`), // More lenient pattern
  ];
  
  const matchesPattern = expectedPatterns.some(pattern => pattern.test(filename));
  
  if (!matchesPattern) {
    issues.push({
      code: 'audio_filename_invalid',
      severity: 'info',
      message: `Entry ${entryIndex} audio filename doesn't match expected pattern: {room_id}_{number|all}_{en|vi}.mp3`,
      context: `entries[${entryIndex}].audio = "${filename}"`,
    });
  }
}

// Helper: Validate JSON structure following Mercy Blade standard
function validateRoomJson(roomId: string, jsonData: any): RoomIssue[] {
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
  
  // ============= ROOT FIELD VALIDATION =============
  
  // 1. ID field (required, should match filename)
  if (!jsonData.id || typeof jsonData.id !== 'string' || jsonData.id.trim().length === 0) {
    issues.push({
      code: 'missing_id',
      severity: 'error',
      message: 'Missing or invalid root field: id',
      context: 'id',
    });
  } else if (jsonData.id !== roomId) {
    issues.push({
      code: 'schema_invalid_field',
      severity: 'warning',
      message: `JSON id "${jsonData.id}" does not match filename "${roomId}"`,
      context: 'id',
    });
  }
  
  // 2. Tier field (required)
  if (!jsonData.tier || typeof jsonData.tier !== 'string' || jsonData.tier.trim().length === 0) {
    issues.push({
      code: 'schema_missing_field',
      severity: 'error',
      message: 'Missing or invalid root field: tier',
      context: 'tier',
    });
  }
  
  // 3. Domain field (recommended)
  if (!jsonData.domain || typeof jsonData.domain !== 'string' || jsonData.domain.trim().length === 0) {
    issues.push({
      code: 'missing_domain',
      severity: 'warning',
      message: 'Missing or invalid root field: domain',
      context: 'domain',
    });
  }
  
  // 4. Title field (required bilingual)
  validateBilingualText('title', jsonData.title, issues);
  
  // 5. Content field (optional bilingual intro/description)
  if (jsonData.content) {
    validateBilingualText('content', jsonData.content, issues);
  }
  
  // ============= ENTRIES ARRAY VALIDATION =============
  
  if (!Array.isArray(jsonData.entries)) {
    issues.push({
      code: 'schema_missing_field',
      severity: 'error',
      message: 'Missing or invalid entries array',
      context: 'entries',
    });
    return issues;
  }
  
  if (jsonData.entries.length === 0) {
    issues.push({
      code: 'schema_missing_field',
      severity: 'error',
      message: 'Entries array is empty (must have at least 1 entry)',
      context: 'entries',
    });
    return issues;
  }
  
  // Typical entry count is 6-8, warn if unusual
  if (jsonData.entries.length < 3) {
    issues.push({
      code: 'schema_invalid_field',
      severity: 'info',
      message: `Only ${jsonData.entries.length} entries (typical rooms have 6-8)`,
      context: 'entries.length',
    });
  } else if (jsonData.entries.length > 12) {
    issues.push({
      code: 'schema_invalid_field',
      severity: 'info',
      message: `${jsonData.entries.length} entries (typical rooms have 6-8)`,
      context: 'entries.length',
    });
  }
  
  // ============= INDIVIDUAL ENTRY VALIDATION =============
  
  let hasAllEntry = false;
  let allEntryIndex = -1;
  
  jsonData.entries.forEach((entry: any, idx: number) => {
    if (!entry || typeof entry !== 'object') {
      issues.push({
        code: 'schema_wrong_type',
        severity: 'error',
        message: `Entry ${idx} is not an object`,
        context: `entries[${idx}]`,
      });
      return;
    }
    
    // 1. Slug field (required, should be kebab-case or special "all")
    if (!entry.slug || typeof entry.slug !== 'string' || entry.slug.trim().length === 0) {
      issues.push({
        code: 'schema_missing_field',
        severity: 'error',
        message: `Entry ${idx} missing slug`,
        context: `entries[${idx}].slug`,
      });
    } else {
      // Check for All entry
      if (entry.slug === 'all' || entry.slug === 'all-entry') {
        hasAllEntry = true;
        allEntryIndex = idx;
      }
      
      // Slug should be lowercase with hyphens or underscores
      if (!/^[a-z0-9_-]+$/.test(entry.slug)) {
        issues.push({
          code: 'schema_invalid_field',
          severity: 'info',
          message: `Entry ${idx} slug "${entry.slug}" contains uppercase or special chars`,
          context: `entries[${idx}].slug`,
        });
      }
    }
    
    // 2. Bilingual copy (required)
    validateBilingualText(`entries[${idx}].copy`, entry.copy, issues);
    
    // 3. Keywords EN (required, 3-5 items)
    if (!Array.isArray(entry.keywords_en)) {
      issues.push({
        code: 'keywords_invalid',
        severity: 'error',
        message: `Entry ${idx} keywords_en must be an array`,
        context: `entries[${idx}].keywords_en`,
      });
    } else if (entry.keywords_en.length < 3) {
      issues.push({
        code: 'keywords_invalid',
        severity: 'warning',
        message: `Entry ${idx} keywords_en has only ${entry.keywords_en.length} items (should be 3-5)`,
        context: `entries[${idx}].keywords_en`,
      });
    } else if (entry.keywords_en.length > 5) {
      issues.push({
        code: 'keywords_invalid',
        severity: 'info',
        message: `Entry ${idx} keywords_en has ${entry.keywords_en.length} items (recommended 3-5)`,
        context: `entries[${idx}].keywords_en`,
      });
    }
    
    // 4. Keywords VI (required, 3-5 items)
    if (!Array.isArray(entry.keywords_vi)) {
      issues.push({
        code: 'keywords_invalid',
        severity: 'error',
        message: `Entry ${idx} keywords_vi must be an array`,
        context: `entries[${idx}].keywords_vi`,
      });
    } else if (entry.keywords_vi.length < 3) {
      issues.push({
        code: 'keywords_invalid',
        severity: 'warning',
        message: `Entry ${idx} keywords_vi has only ${entry.keywords_vi.length} items (should be 3-5)`,
        context: `entries[${idx}].keywords_vi`,
      });
    } else if (entry.keywords_vi.length > 5) {
      issues.push({
        code: 'keywords_invalid',
        severity: 'info',
        message: `Entry ${idx} keywords_vi has ${entry.keywords_vi.length} items (recommended 3-5)`,
        context: `entries[${idx}].keywords_vi`,
      });
    }
    
    // 5. Tags (recommended)
    if (!Array.isArray(entry.tags)) {
      issues.push({
        code: 'tags_missing',
        severity: 'info',
        message: `Entry ${idx} tags should be an array`,
        context: `entries[${idx}].tags`,
      });
    } else if (entry.tags.length === 0) {
      issues.push({
        code: 'tags_missing',
        severity: 'info',
        message: `Entry ${idx} has empty tags array`,
        context: `entries[${idx}].tags`,
      });
    }
    
    // 6. Severity level (required, 1-5)
    const severity = entry.severity_level;
    if (severity == null) {
      issues.push({
        code: 'severity_invalid',
        severity: 'warning',
        message: `Entry ${idx} missing severity_level`,
        context: `entries[${idx}].severity_level`,
      });
    } else if (typeof severity !== 'number' || !Number.isInteger(severity)) {
      issues.push({
        code: 'severity_invalid',
        severity: 'warning',
        message: `Entry ${idx} severity_level must be an integer`,
        context: `entries[${idx}].severity_level`,
      });
    } else if (severity < 1 || severity > 5) {
      issues.push({
        code: 'severity_invalid',
        severity: 'warning',
        message: `Entry ${idx} severity_level is ${severity} (should be 1-5)`,
        context: `entries[${idx}].severity_level`,
      });
    }
    
    // 7. Audio field (optional, but recommended)
    const audio = entry.audio;
    if (!audio) {
      // Missing audio is tracked separately for audio coverage metric
      // Don't add an issue here
    } else if (typeof audio === 'object') {
      issues.push({
        code: 'audio_object_invalid',
        severity: 'error',
        message: `Entry ${idx} audio is an object (should be string filename)`,
        context: `entries[${idx}].audio`,
      });
    } else if (typeof audio === 'string') {
      // Validate audio filename pattern
      validateAudioFilename(roomId, audio, idx, issues);
    }
  });
  
  // ============= SPECIAL ENTRY CHECKS =============
  
  // Check for "All" entry (recommended for most rooms)
  if (!hasAllEntry) {
    issues.push({
      code: 'all_entry_missing',
      severity: 'warning',
      message: 'Missing "All" entry (slug="all" or "all-entry")',
      context: 'entries',
    });
  } else if (allEntryIndex >= 0) {
    // Validate that All entry has proper structure
    const allEntry = jsonData.entries[allEntryIndex];
    
    if (Array.isArray(allEntry.keywords_en) && allEntry.keywords_en.length > 0) {
      const firstKeyword = allEntry.keywords_en[0].toLowerCase();
      if (firstKeyword !== 'all' && firstKeyword !== 'summary' && firstKeyword !== 'overview') {
        issues.push({
          code: 'schema_invalid_field',
          severity: 'info',
          message: `"All" entry keywords_en[0] should be "All", "summary", or "overview" (found "${allEntry.keywords_en[0]}")`,
          context: `entries[${allEntryIndex}].keywords_en[0]`,
        });
      }
    }
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

// Helper: Validate a room using its entries from the database
function validateRoomFromDb(roomId: string, tier: string, entries: any[]): RoomValidationResult {
  const result: RoomValidationResult = {
    room_id: roomId,
    tier,
    json_missing: false,
    json_invalid: false,
    health_score: 100,
    audio_coverage: 0,
    has_zero_audio: false,
    is_low_health: false,
    issues: [],
  };
  
  // Check if entries exist
  if (!entries || !Array.isArray(entries)) {
    result.json_missing = true;
    result.issues.push({
      code: 'missing_entries',
      severity: 'error',
      message: `Room ${roomId} has no entries array in database`,
    });
    result.health_score = 0;
    return result;
  }
  
  if (entries.length === 0) {
    result.issues.push({
      code: 'empty_entries',
      severity: 'error',
      message: `Room ${roomId} has empty entries array`,
    });
    result.health_score = 50;
    result.has_zero_audio = true;
    return result;
  }
  
  // Calculate audio coverage
  let entriesWithAudio = 0;
  for (const entry of entries) {
    const audio = entry?.audio || entry?.audio_en || entry?.audioEn;
    if (audio && typeof audio === 'string' && audio.trim().length > 0) {
      entriesWithAudio++;
    }
  }
  
  result.audio_coverage = Math.round((entriesWithAudio / entries.length) * 100);
  result.has_zero_audio = result.audio_coverage === 0;
  
  // Calculate health score based on audio coverage and entry count
  let healthScore = 100;
  
  // Deduct for missing audio
  if (result.audio_coverage === 0) {
    healthScore -= 30;
    result.issues.push({
      code: 'no_audio',
      severity: 'warning',
      message: `Room ${roomId} has 0% audio coverage`,
    });
  } else if (result.audio_coverage < 50) {
    healthScore -= 15;
    result.issues.push({
      code: 'low_audio',
      severity: 'info',
      message: `Room ${roomId} has only ${result.audio_coverage}% audio coverage`,
    });
  }
  
  // Check entry count
  if (entries.length < 3) {
    healthScore -= 10;
    result.issues.push({
      code: 'few_entries',
      severity: 'info',
      message: `Room ${roomId} has only ${entries.length} entries`,
    });
  }
  
  result.health_score = Math.max(0, Math.min(100, healthScore));
  result.is_low_health = result.health_score < 50;
  
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
  let tierFilterKey: TierKey | null = null;
  if (req.method === "POST") {
    if (typeof body.tier === "string" && body.tier.trim()) {
      tierFilterKey = normalizeTier(body.tier);
    }
  } else if (req.method === "GET") {
    const url = new URL(req.url);
    const rawTierFilter = url.searchParams.get("tier");
    tierFilterKey = rawTierFilter ? normalizeTier(rawTierFilter) : null;
  }

  // 🔹 Deep scan flag comes ONLY from body.deepScan
  const deepScan = body.deepScan === true;

  console.log("[room-health-summary] tierFilterKey:", tierFilterKey, "deepScan:", deepScan);

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
    // Fetch rooms from database - include entries for validation
    const { data: roomsData, error: roomsErr } = await supabase
      .from("rooms")
      .select("id, tier, entries, is_locked, is_demo");
    
    if (roomsErr) {
      console.error('[room-health-summary] Rooms query error:', roomsErr);
      // Don't throw - continue with empty data
    }

    console.log('[room-health-summary] Fetched', roomsData?.length || 0, 'rooms from database');
    
    // Validate each room using database entries
    const validationResults: RoomValidationResult[] = [];
    
    for (const room of roomsData || []) {
      // Normalize tier from DB format (e.g., "VIP1 / VIP1" -> "vip1")
      const normalizedRoomTier = normalizeTier(room.tier);
      
      // Skip if tier filter is set and doesn't match
      if (tierFilterKey && normalizedRoomTier !== tierFilterKey) {
        continue;
      }
      
      // Validate using entries from database
      const entries = Array.isArray(room.entries) ? room.entries : [];
      const result = validateRoomFromDb(room.id, room.tier || 'free', entries);
      validationResults.push(result);
      
      // Use normalized tier for aggregation (use "free" if normalization fails)
      const tier = normalizedRoomTier || "free";
      
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

    // ============= NEW: Build VIP tier coverage analysis =============
    const vipTierCoverage: VipTierCoverage[] = [];
    const allVipTierKeys: TierKey[] = ["vip1", "vip2", "vip3", "vip4", "vip5", "vip6", "vip7", "vip8", "vip9"];
    
    for (const tierId of allVipTierKeys) {
      const label = tierKeyToLabel(tierId);
      
      // Build expected rooms for this tier from room IDs
      // Expected pattern: room IDs ending in _{tierId} or containing _{tierId}_ or -{tierId}
      const expectedIds: string[] = [];
      const dbActiveIds: string[] = [];
      const dbInactiveIds: string[] = [];
      
      // Scan all DB rooms to build expected and actual lists
      for (const room of roomsData || []) {
        const roomId = room.id as string;
        const roomTier = room.tier as string | null;
        const isActive = !room.is_locked && !room.is_demo;
        
        // Check if this room belongs to this tier based on ID pattern
        const idLower = roomId.toLowerCase();
        const tierPattern = tierId.toLowerCase();
        const belongsToTier = 
          idLower.endsWith(`_${tierPattern}`) ||
          idLower.includes(`_${tierPattern}_`) ||
          idLower.endsWith(`-${tierPattern}`) ||
          idLower.includes(`-${tierPattern}-`);
        
        if (belongsToTier) {
          expectedIds.push(roomId);
          
          // Check if it's actually in DB with correct tier
          const normalizedRoomTier = normalizeTier(roomTier);
          if (normalizedRoomTier === tierId) {
            if (isActive) {
              dbActiveIds.push(roomId);
            } else {
              dbInactiveIds.push(roomId);
            }
          }
        }
      }
      
      // Find missing rooms (expected but not active in DB)
      const missingRoomIds = expectedIds.filter(id => !dbActiveIds.includes(id) && !dbInactiveIds.includes(id));
      
      // Find wrong-tier rooms (in DB with this tier but not in expected)
      const wrongTierRoomIds: string[] = [];
      for (const room of roomsData || []) {
        const roomId = room.id as string;
        const roomTier = room.tier as string | null;
        const normalizedRoomTier = normalizeTier(roomTier);
        const isActive = !room.is_locked && !room.is_demo;
        
        if (normalizedRoomTier === tierId && isActive) {
          if (!expectedIds.includes(roomId)) {
            wrongTierRoomIds.push(roomId);
          }
        }
      }
      
      vipTierCoverage.push({
        tierId,
        label,
        expectedCount: expectedIds.length,
        dbActiveCount: dbActiveIds.length,
        missingRoomIds,
        inactiveRoomIds: dbInactiveIds,
        wrongTierRoomIds,
      });
    }
    
    console.log('[room-health-summary] VIP tier coverage:', JSON.stringify(vipTierCoverage, null, 2));

    // Check for VIP tiers with 0 rooms (only if not filtering by specific tier)
    if (!tierFilterKey) {
      // Build set of existing VIP tiers using normalization
      const existingVipTiers = new Set<TierKey>();
      
      for (const result of validationResults) {
        const tierKey = normalizeTier(result.tier);
        if (tierKey && (tierKey as string).startsWith("vip")) {
          existingVipTiers.add(tierKey);
        }
      }
      
      // Check all VIP tiers for gaps
      const allVipTiers: TierKey[] = [
        "vip1",
        "vip2",
        "vip3",
        "vip4",
        "vip5",
        "vip6",
        "vip7",
        "vip8",
        "vip9",
      ];
      
      const missingVipTiers = allVipTiers.filter(
        (tier) => !existingVipTiers.has(tier)
      );
      
      // Add missing tiers to track gaps
      for (const tier of missingVipTiers) {
        trackGaps.push({
          tier,
          title: tier.toUpperCase(),
          total_rooms: 0,
          min_required: 1,
          issue: "no_rooms_found",
        });
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
      vipTierCoverage,  // NEW: VIP tier coverage analysis
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
