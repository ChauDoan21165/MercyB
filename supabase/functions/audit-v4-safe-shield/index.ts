// supabase/functions/audit-v4-safe-shield/index.ts
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

type AuditMode = "dry-run" | "repair";

type AuditIssue = {
  id: string;
  file: string;
  type: string;
  severity: "error" | "warning" | "info";
  message: string;
  fix?: string;
  autoFixable?: boolean;
};

type AuditSummary = {
  totalRooms: number;
  scannedRooms: number;
  errors: number;
  warnings: number;
  fixed: number;
};

type AuditResult = {
  issues: AuditIssue[];
  summary: AuditSummary;
  fixesApplied: number;
  logs: string[];
};

type AuditResponse = {
  ok: boolean;
  error?: string;
  issues: AuditIssue[];
  fixesApplied: number;
  fixed?: number;
  logs: string[];
  summary: AuditSummary;
};

type DbRoom = {
  id: string;
  tier?: string | null;
  schema_id?: string | null;
  domain?: string | null;
  title_en?: string | null;
  title_vi?: string | null;
  room_essay_en?: string | null;
  room_essay_vi?: string | null;
  keywords?: string[] | null;
  entries?: unknown;
};

// CANONICAL TIERS - only these are valid
const CANONICAL_TIERS: Record<string, string> = {
  free: "Free / Miễn phí",
  vip1: "VIP1 / VIP1",
  vip2: "VIP2 / VIP2",
  vip3: "VIP3 / VIP3",
  vip3ii: "VIP3 II / VIP3 II",
  vip4: "VIP4 / VIP4",
  vip5: "VIP5 / VIP5",
  vip6: "VIP6 / VIP6",
  vip7: "VIP7 / VIP7",
  vip8: "VIP8 / VIP8",
  vip9: "VIP9 / VIP9",
  kids_1: "Kids Level 1 / Trẻ em cấp 1",
  kids_2: "Kids Level 2 / Trẻ em cấp 2",
  kids_3: "Kids Level 3 / Trẻ em cấp 3",
};

const VALID_CANONICAL_TIER_VALUES = Object.values(CANONICAL_TIERS);

// Valid entry keys
const VALID_ENTRY_KEYS = new Set([
  "slug", "artifact_id", "id", "identifier",
  "keywords_en", "keywords_vi",
  "copy", "copy_en", "copy_vi",
  "tags", "audio", "audio_en", "audio_vi",
  "severity_level", "title", "title_en", "title_vi",
]);

// Helper: count words
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

// Helper: validate kebab-case
function isKebabCase(str: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);
}

// Helper: infer canonical tier from room ID
function inferTierFromRoomId(roomId: string): string {
  const idLower = roomId.toLowerCase();
  
  // Check for tier suffix patterns
  if (idLower.includes("_vip9") || idLower.endsWith("-vip9")) return CANONICAL_TIERS.vip9;
  if (idLower.includes("_vip8") || idLower.endsWith("-vip8")) return CANONICAL_TIERS.vip8;
  if (idLower.includes("_vip7") || idLower.endsWith("-vip7")) return CANONICAL_TIERS.vip7;
  if (idLower.includes("_vip6") || idLower.endsWith("-vip6")) return CANONICAL_TIERS.vip6;
  if (idLower.includes("_vip5") || idLower.endsWith("-vip5")) return CANONICAL_TIERS.vip5;
  if (idLower.includes("_vip4") || idLower.endsWith("-vip4")) return CANONICAL_TIERS.vip4;
  if (idLower.includes("_vip3ii") || idLower.endsWith("-vip3ii")) return CANONICAL_TIERS.vip3ii;
  if (idLower.includes("_vip3") || idLower.endsWith("-vip3")) return CANONICAL_TIERS.vip3;
  if (idLower.includes("_vip2") || idLower.endsWith("-vip2")) return CANONICAL_TIERS.vip2;
  if (idLower.includes("_vip1") || idLower.endsWith("-vip1")) return CANONICAL_TIERS.vip1;
  if (idLower.includes("kids_3") || idLower.includes("kids-3") || idLower.includes("kids_l3")) return CANONICAL_TIERS.kids_3;
  if (idLower.includes("kids_2") || idLower.includes("kids-2") || idLower.includes("kids_l2")) return CANONICAL_TIERS.kids_2;
  if (idLower.includes("kids_1") || idLower.includes("kids-1") || idLower.includes("kids_l1")) return CANONICAL_TIERS.kids_1;
  if (idLower.includes("_free") || idLower.endsWith("-free")) return CANONICAL_TIERS.free;
  
  // Default to free
  return CANONICAL_TIERS.free;
}

// Helper: infer domain from tier
function inferDomainFromTier(tier: string): string {
  const tierLower = tier.toLowerCase();
  if (tierLower.includes("vip9")) return "Strategic Intelligence";
  if (tierLower.includes("vip")) return "VIP Learning";
  if (tierLower.includes("free") || tierLower.includes("miễn phí")) return "English Foundation";
  if (tierLower.includes("kids") || tierLower.includes("trẻ em")) return "Kids English";
  return "General";
}

// Helper: check if tier is canonical
function isCanonicalTier(tier: string): boolean {
  return VALID_CANONICAL_TIER_VALUES.includes(tier);
}

// MAIN AUDIT - Simplified rules
async function runSafeShieldAudit(mode: AuditMode): Promise<AuditResult> {
  const logs: string[] = [];
  const issues: AuditIssue[] = [];
  let fixesApplied = 0;

  const log = (msg: string) => {
    logs.push(msg);
    console.log(`[SafeShield] ${msg}`);
  };

  log(`Starting Safe Shield audit in ${mode} mode`);

  // Phase 1 – load rooms
  const { data: dbRooms, error: dbError } = await supabase
    .from("rooms")
    .select("id, tier, schema_id, domain, title_en, title_vi, room_essay_en, room_essay_vi, keywords, entries");

  if (dbError) {
    throw new Error(`Database error: ${dbError.message}`);
  }

  const rooms: DbRoom[] = (dbRooms ?? []) as DbRoom[];
  const totalRooms = rooms.length;
  let scannedRooms = 0;
  const seenIds = new Set<string>();

  // Track rooms needing fixes
  const roomFixes: Map<string, Record<string, any>> = new Map();
  // Track which issues were auto-fixed (to exclude from final list)
  const fixedIssueIds: Set<string> = new Set();

  const addFix = (roomId: string, field: string, value: any, issueId: string) => {
    if (!roomFixes.has(roomId)) roomFixes.set(roomId, {});
    roomFixes.get(roomId)![field] = value;
    fixedIssueIds.add(issueId);
  };

  // Phase 2 – Run checks per room
  for (const room of rooms) {
    const roomId = room.id;
    const file = `${roomId}.json`;
    scannedRooms++;

    // ERROR: Duplicate room IDs
    if (seenIds.has(roomId)) {
      issues.push({ id: `dup-${roomId}`, file, type: "duplicate_room", severity: "error", message: `Duplicate room id: ${roomId}`, autoFixable: false });
      continue;
    }
    seenIds.add(roomId);

    // Check tier - auto-fix if missing or invalid
    const tierIssueId = `tier-${roomId}`;
    if (!room.tier) {
      const inferredTier = inferTierFromRoomId(roomId);
      issues.push({ id: tierIssueId, file, type: "missing_tier", severity: "warning", message: `Missing tier`, fix: `Set to "${inferredTier}"`, autoFixable: true });
      addFix(roomId, "tier", inferredTier, tierIssueId);
    } else if (!isCanonicalTier(room.tier)) {
      const inferredTier = inferTierFromRoomId(roomId);
      issues.push({ id: tierIssueId, file, type: "invalid_tier", severity: "warning", message: `Invalid tier: "${room.tier}"`, fix: `Set to "${inferredTier}"`, autoFixable: true });
      addFix(roomId, "tier", inferredTier, tierIssueId);
    }

    // Check schema_id - auto-fix if missing
    const schemaIssueId = `schema-${roomId}`;
    if (!room.schema_id) {
      issues.push({ id: schemaIssueId, file, type: "missing_schema_id", severity: "warning", message: `Missing schema_id`, fix: `Set to "mercy-blade-v1"`, autoFixable: true });
      addFix(roomId, "schema_id", "mercy-blade-v1", schemaIssueId);
    }

    // Check domain - auto-fix if missing
    const domainIssueId = `domain-${roomId}`;
    if (!room.domain) {
      const currentTier = room.tier || inferTierFromRoomId(roomId);
      const inferredDomain = inferDomainFromTier(currentTier);
      issues.push({ id: domainIssueId, file, type: "missing_domain", severity: "warning", message: `Missing domain`, fix: `Set to "${inferredDomain}"`, autoFixable: true });
      addFix(roomId, "domain", inferredDomain, domainIssueId);
    }

    // Check titles (warning only, not error)
    if (!room.title_en) {
      issues.push({ id: `title_en-${roomId}`, file, type: "missing_title_en", severity: "warning", message: `Missing title_en`, autoFixable: false });
    }
    if (!room.title_vi) {
      issues.push({ id: `title_vi-${roomId}`, file, type: "missing_title_vi", severity: "warning", message: `Missing title_vi`, autoFixable: false });
    }

    // Get entries
    const entries = Array.isArray(room.entries) ? (room.entries as any[]) : [];

    // ERROR: Missing entries array
    if (!Array.isArray(room.entries)) {
      issues.push({ id: `entries-${roomId}`, file, type: "missing_entries", severity: "error", message: `Missing entries array`, autoFixable: false });
      continue;
    }

    // ERROR: Empty entries (truly broken)
    if (entries.length === 0) {
      issues.push({ id: `empty-entries-${roomId}`, file, type: "missing_entries", severity: "error", message: `Entries array is empty`, autoFixable: false });
      continue;
    }

    // Entry count outside 2-8 is just informational
    if (entries.length < 2 || entries.length > 8) {
      issues.push({ id: `count-${roomId}`, file, type: "entry_count_info", severity: "info", message: `Has ${entries.length} entries (typical: 2-8)`, autoFixable: false });
    }

    const slugs = new Set<string>();

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i] as Record<string, any>;
      const entrySlug = entry.slug || entry.artifact_id || entry.id || `entry-${i}`;
      const entryPrefix = `${roomId}-e${i}`;

      // Check entry identifier
      const slug = entry.slug || entry.artifact_id || entry.id;
      if (!slug) {
        issues.push({ id: `slug-${entryPrefix}`, file, type: "missing_slug", severity: "warning", message: `Entry ${i} missing identifier`, autoFixable: false });
      } else {
        // Duplicate slug is an error
        if (slugs.has(slug)) {
          issues.push({ id: `dup-slug-${entryPrefix}`, file, type: "duplicate_slug", severity: "error", message: `Duplicate slug "${slug}" in room`, autoFixable: false });
        }
        slugs.add(slug);
        
        // Slug format is just info
        if (!isKebabCase(slug)) {
          issues.push({ id: `slug-fmt-${entryPrefix}`, file, type: "slug_format_info", severity: "info", message: `Entry slug "${slug}" is not kebab-case`, autoFixable: false });
        }
      }

      // Check copy exists
      const copyEn = entry.copy?.en || entry.copy_en;
      const copyVi = entry.copy?.vi || entry.copy_vi;
      
      if (!copyEn) {
        issues.push({ id: `copy_en-${entryPrefix}`, file, type: "missing_copy_en", severity: "error", message: `Entry "${entrySlug}" missing copy.en`, autoFixable: false });
      }
      if (!copyVi) {
        issues.push({ id: `copy_vi-${entryPrefix}`, file, type: "missing_copy_vi", severity: "error", message: `Entry "${entrySlug}" missing copy.vi`, autoFixable: false });
      }

      // Copy word count - ONLY flag extreme values (<30 or >260)
      if (copyEn) {
        const wc = countWords(copyEn);
        if (wc < 30 || wc > 260) {
          issues.push({ id: `wc_en-${entryPrefix}`, file, type: "copy_word_count_extreme", severity: "warning", message: `Entry "${entrySlug}" copy.en has ${wc} words (outside 30-260 range)`, autoFixable: false });
        }
      }
      if (copyVi) {
        const wc = countWords(copyVi);
        if (wc < 30 || wc > 260) {
          issues.push({ id: `wc_vi-${entryPrefix}`, file, type: "copy_word_count_extreme", severity: "warning", message: `Entry "${entrySlug}" copy.vi has ${wc} words (outside 30-260 range)`, autoFixable: false });
        }
      }

      // Audio - ONLY flag if truly missing (empty or undefined)
      const audio = entry.audio || entry.audio_en;
      if (!audio || (typeof audio === "string" && audio.trim() === "")) {
        issues.push({ id: `audio-${entryPrefix}`, file, type: "missing_audio", severity: "error", message: `Entry "${entrySlug}" missing audio`, fix: "Generate TTS", autoFixable: false });
      }
      // If audio exists (non-empty string), no issue - we don't check format anymore
    }

    // Check for malformed entries
    const hasValidStructure = entries.every((e: any) => typeof e === "object" && e !== null);
    if (!hasValidStructure) {
      issues.push({ id: `malformed-${roomId}`, file, type: "malformed_entries", severity: "error", message: `Entries array contains non-object elements`, autoFixable: false });
    }

    // Check room-level keywords - auto-fix if missing
    const kwIssueId = `kw-${roomId}`;
    if (!room.keywords || room.keywords.length === 0) {
      const keywordSet = new Set<string>();
      for (const e of entries) {
        const kwEn = (e as any).keywords_en as string[] | undefined;
        const kwVi = (e as any).keywords_vi as string[] | undefined;
        if (Array.isArray(kwEn)) kwEn.forEach(k => keywordSet.add(k));
        if (Array.isArray(kwVi)) kwVi.forEach(k => keywordSet.add(k));
      }
      if (keywordSet.size > 0) {
        issues.push({ id: kwIssueId, file, type: "missing_room_keywords", severity: "warning", message: `Missing room-level keywords`, fix: `Extract ${keywordSet.size} keywords from entries`, autoFixable: true });
        addFix(roomId, "keywords", Array.from(keywordSet), kwIssueId);
      }
    }
  }

  // Phase 3 – Apply fixes in repair mode
  if (mode === "repair" && roomFixes.size > 0) {
    log(`Applying fixes to ${roomFixes.size} rooms`);

    for (const [roomId, fixes] of roomFixes.entries()) {
      const { error } = await supabase
        .from("rooms")
        .update(fixes)
        .eq("id", roomId);

      if (!error) {
        fixesApplied += Object.keys(fixes).length;
        log(`Fixed ${Object.keys(fixes).join(", ")} for room: ${roomId}`);
      } else {
        log(`Failed to fix room ${roomId}: ${error.message}`);
        // Remove from fixed set if failed
        for (const key of Object.keys(fixes)) {
          fixedIssueIds.delete(`${key === "tier" ? "tier" : key === "schema_id" ? "schema" : key === "domain" ? "domain" : "kw"}-${roomId}`);
        }
      }
    }

    log(`Repairs complete: ${fixesApplied} field fixes applied`);
  }

  // Filter out fixed issues in repair mode
  const finalIssues = mode === "repair" 
    ? issues.filter(issue => !fixedIssueIds.has(issue.id))
    : issues;

  // Count errors and warnings from final issues
  const errors = finalIssues.filter(i => i.severity === "error").length;
  const warnings = finalIssues.filter(i => i.severity === "warning").length;

  const summary: AuditSummary = {
    totalRooms,
    scannedRooms,
    errors,
    warnings,
    fixed: fixesApplied,
  };

  log(`Summary: ${totalRooms} total, ${scannedRooms} scanned, ${errors} errors, ${warnings} warnings, ${fixesApplied} fixed`);

  return { issues: finalIssues, summary, fixesApplied, logs };
}

// HTTP HANDLER
serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    let body: any = {};
    if (contentType.includes("application/json")) {
      body = await req.json();
    }

    const mode: AuditMode = body.mode === "repair" ? "repair" : "dry-run";
    const result = await runSafeShieldAudit(mode);

    const response: AuditResponse = {
      ok: true,
      issues: result.issues,
      fixesApplied: result.fixesApplied,
      fixed: result.fixesApplied,
      logs: result.logs,
      summary: result.summary,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[audit-v4-safe-shield] Error:", err);

    const errorResponse: AuditResponse = {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      issues: [],
      fixesApplied: 0,
      fixed: 0,
      logs: [],
      summary: { totalRooms: 0, scannedRooms: 0, errors: 0, warnings: 0, fixed: 0 },
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
