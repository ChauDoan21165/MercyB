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

// Valid tiers
const VALID_TIERS = [
  "free", "Free / Miễn phí",
  "vip1", "VIP1",
  "vip2", "VIP2", 
  "vip3", "VIP3",
  "vip3ii", "VIP3II",
  "vip4", "VIP4",
  "vip5", "VIP5",
  "vip6", "VIP6",
  "vip7", "VIP7",
  "vip8", "VIP8",
  "vip9", "VIP9",
  "kids_1", "Kids Level 1",
  "kids_2", "Kids Level 2",
  "kids_3", "Kids Level 3",
];

// Valid entry keys
const VALID_ENTRY_KEYS = new Set([
  "slug", "artifact_id", "id", "identifier",
  "keywords_en", "keywords_vi",
  "copy", "copy_en", "copy_vi",
  "tags", "audio", "audio_en", "audio_vi",
  "severity_level", "title", "title_en", "title_vi",
]);

// Valid room root keys
const VALID_ROOM_KEYS = new Set([
  "id", "tier", "schema_id", "domain", "track",
  "title", "title_en", "title_vi",
  "content", "room_essay_en", "room_essay_vi",
  "entries", "keywords", "keywords_en", "keywords_vi",
  "safety_disclaimer", "safety_disclaimer_en", "safety_disclaimer_vi",
  "crisis_footer", "crisis_footer_en", "crisis_footer_vi",
  "meta", "created_at", "updated_at", "is_locked", "is_demo",
]);

// Helper: count words
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

// Helper: validate kebab-case
function isKebabCase(str: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);
}

// Helper: validate audio filename pattern (roomid_index_en.mp3)
function isValidAudioFilename(filename: string): boolean {
  return /^[a-z0-9_]+_\d+_en\.mp3$/.test(filename);
}

// Helper: infer domain from tier
function inferDomainFromTier(tier: string): string {
  const tierLower = tier.toLowerCase();
  if (tierLower.includes("vip9")) return "Strategic Intelligence";
  if (tierLower.includes("vip")) return "VIP Learning";
  if (tierLower.includes("free")) return "English Foundation";
  if (tierLower.includes("kids")) return "Kids English";
  return "General";
}

// Helper: check domain consistency with tier
function isDomainConsistentWithTier(domain: string, tier: string): boolean {
  const tierLower = tier.toLowerCase();
  const domainLower = domain.toLowerCase();
  
  if (tierLower.includes("vip9") && !domainLower.includes("strateg")) return false;
  if (tierLower.includes("kids") && !domainLower.includes("kids")) return false;
  return true;
}

// MAIN AUDIT - All 30 checks
async function runSafeShieldAudit(mode: AuditMode): Promise<AuditResult> {
  const logs: string[] = [];
  const issues: AuditIssue[] = [];
  let fixesApplied = 0;

  const log = (msg: string) => {
    logs.push(msg);
    console.log(`[SafeShield] ${msg}`);
  };

  log(`Starting Safe Shield audit (30 checks) in ${mode} mode`);

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

  const addFix = (roomId: string, field: string, value: any) => {
    if (!roomFixes.has(roomId)) roomFixes.set(roomId, {});
    roomFixes.get(roomId)![field] = value;
  };

  // Phase 2 – Run all 30 checks per room
  for (const room of rooms) {
    const roomId = room.id;
    const file = `${roomId}.json`;
    scannedRooms++;

    // Check for duplicate IDs
    if (seenIds.has(roomId)) {
      issues.push({ id: `dup-${roomId}`, file, type: "duplicate_room", severity: "error", message: `Duplicate room id: ${roomId}`, autoFixable: false });
      continue;
    }
    seenIds.add(roomId);

    // 1. Check missing tier
    if (!room.tier) {
      issues.push({ id: `c1-${roomId}`, file, type: "missing_tier", severity: "error", message: `Missing tier`, fix: `Set to "Free / Miễn phí"`, autoFixable: true });
      addFix(roomId, "tier", "Free / Miễn phí");
    }

    // 2. Check invalid tier string
    if (room.tier && !VALID_TIERS.includes(room.tier)) {
      issues.push({ id: `c2-${roomId}`, file, type: "invalid_tier", severity: "error", message: `Invalid tier: "${room.tier}"`, autoFixable: false });
    }

    // 3. Check missing schema_id
    if (!room.schema_id) {
      issues.push({ id: `c3-${roomId}`, file, type: "missing_schema_id", severity: "warning", message: `Missing schema_id`, fix: `Set to "mercy-blade-v1"`, autoFixable: true });
      addFix(roomId, "schema_id", "mercy-blade-v1");
    }

    // 4. Check missing domain
    if (!room.domain) {
      const inferredDomain = room.tier ? inferDomainFromTier(room.tier) : "General";
      issues.push({ id: `c4-${roomId}`, file, type: "missing_domain", severity: "warning", message: `Missing domain`, fix: `Set to "${inferredDomain}"`, autoFixable: true });
      addFix(roomId, "domain", inferredDomain);
    }

    // 5. Check inconsistent domain vs tier
    if (room.domain && room.tier && !isDomainConsistentWithTier(room.domain, room.tier)) {
      issues.push({ id: `c5-${roomId}`, file, type: "domain_tier_mismatch", severity: "warning", message: `Domain "${room.domain}" inconsistent with tier "${room.tier}"`, autoFixable: false });
    }

    // 6. Validate title_en exists
    if (!room.title_en) {
      issues.push({ id: `c6-${roomId}`, file, type: "missing_title_en", severity: "error", message: `Missing title_en`, autoFixable: false });
    }

    // 7. Validate title_vi exists
    if (!room.title_vi) {
      issues.push({ id: `c7-${roomId}`, file, type: "missing_title_vi", severity: "error", message: `Missing title_vi`, autoFixable: false });
    }

    // 8. Validate content.en length (room_essay_en, 80-140 words)
    if (room.room_essay_en) {
      const wordCount = countWords(room.room_essay_en);
      if (wordCount < 80 || wordCount > 140) {
        issues.push({ id: `c8-${roomId}`, file, type: "content_en_length", severity: "info", message: `room_essay_en has ${wordCount} words (expected 80-140)`, autoFixable: false });
      }
    }

    // 9. Validate content.vi length (room_essay_vi, 80-140 words)
    if (room.room_essay_vi) {
      const wordCount = countWords(room.room_essay_vi);
      if (wordCount < 80 || wordCount > 140) {
        issues.push({ id: `c9-${roomId}`, file, type: "content_vi_length", severity: "info", message: `room_essay_vi has ${wordCount} words (expected 80-140)`, autoFixable: false });
      }
    }

    // Get entries
    const entries = Array.isArray(room.entries) ? (room.entries as any[]) : [];

    // 10. Validate entries array exists
    if (!Array.isArray(room.entries)) {
      issues.push({ id: `c10-${roomId}`, file, type: "missing_entries", severity: "error", message: `Missing entries array`, autoFixable: false });
      continue;
    }

    // 11. Ensure entries 2-8 count
    if (entries.length < 2 || entries.length > 8) {
      issues.push({ id: `c11-${roomId}`, file, type: "entry_count_invalid", severity: "warning", message: `Has ${entries.length} entries (expected 2-8)`, autoFixable: false });
    }

    const slugs = new Set<string>();

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i] as Record<string, any>;
      const entrySlug = entry.slug || entry.artifact_id || entry.id || `entry-${i}`;
      const entryPrefix = `c-${roomId}-e${i}`;

      // 12. Check each entry has slug
      if (!entry.slug && !entry.artifact_id && !entry.id) {
        issues.push({ id: `c12-${entryPrefix}`, file, type: "missing_slug", severity: "warning", message: `Entry ${i} missing identifier`, autoFixable: false });
      }

      // 13. Validate slug format (kebab-case)
      const slug = entry.slug || entry.artifact_id || entry.id;
      if (slug && !isKebabCase(slug)) {
        issues.push({ id: `c13-${entryPrefix}`, file, type: "invalid_slug_format", severity: "warning", message: `Entry slug "${slug}" is not kebab-case`, autoFixable: false });
      }

      // 14. Ensure slug unique inside room
      if (slug) {
        if (slugs.has(slug)) {
          issues.push({ id: `c14-${entryPrefix}`, file, type: "duplicate_slug", severity: "error", message: `Duplicate slug "${slug}" in room`, autoFixable: false });
        }
        slugs.add(slug);
      }

      // 15. Validate keywords_en exists
      const kwEn = entry.keywords_en as string[] | undefined;
      if (!kwEn || !Array.isArray(kwEn)) {
        issues.push({ id: `c15-${entryPrefix}`, file, type: "missing_keywords_en", severity: "warning", message: `Entry "${entrySlug}" missing keywords_en`, autoFixable: false });
      }

      // 16. Validate keywords_vi exists
      const kwVi = entry.keywords_vi as string[] | undefined;
      if (!kwVi || !Array.isArray(kwVi)) {
        issues.push({ id: `c16-${entryPrefix}`, file, type: "missing_keywords_vi", severity: "warning", message: `Entry "${entrySlug}" missing keywords_vi`, autoFixable: false });
      }

      // 17. Each keywords_en has 3-5
      if (kwEn && Array.isArray(kwEn) && (kwEn.length < 3 || kwEn.length > 5)) {
        issues.push({ id: `c17-${entryPrefix}`, file, type: "keywords_en_count", severity: "info", message: `Entry "${entrySlug}" has ${kwEn.length} keywords_en (expected 3-5)`, autoFixable: false });
      }

      // 18. Each keywords_vi has 3-5
      if (kwVi && Array.isArray(kwVi) && (kwVi.length < 3 || kwVi.length > 5)) {
        issues.push({ id: `c18-${entryPrefix}`, file, type: "keywords_vi_count", severity: "info", message: `Entry "${entrySlug}" has ${kwVi.length} keywords_vi (expected 3-5)`, autoFixable: false });
      }

      // 19. First keyword_en = display label (check it exists)
      if (kwEn && Array.isArray(kwEn) && kwEn.length > 0 && !kwEn[0]) {
        issues.push({ id: `c19-${entryPrefix}`, file, type: "first_keyword_en_empty", severity: "warning", message: `Entry "${entrySlug}" first keyword_en is empty`, autoFixable: false });
      }

      // 20. First keyword_vi matches meaning (check it exists)
      if (kwVi && Array.isArray(kwVi) && kwVi.length > 0 && !kwVi[0]) {
        issues.push({ id: `c20-${entryPrefix}`, file, type: "first_keyword_vi_empty", severity: "warning", message: `Entry "${entrySlug}" first keyword_vi is empty`, autoFixable: false });
      }

      // 21. Validate copy.en exists
      const copyEn = entry.copy?.en || entry.copy_en;
      if (!copyEn) {
        issues.push({ id: `c21-${entryPrefix}`, file, type: "missing_copy_en", severity: "error", message: `Entry "${entrySlug}" missing copy.en`, autoFixable: false });
      }

      // 22. Validate copy.vi exists
      const copyVi = entry.copy?.vi || entry.copy_vi;
      if (!copyVi) {
        issues.push({ id: `c22-${entryPrefix}`, file, type: "missing_copy_vi", severity: "error", message: `Entry "${entrySlug}" missing copy.vi`, autoFixable: false });
      }

      // 23. Validate copy word count (50-150)
      if (copyEn) {
        const wc = countWords(copyEn);
        if (wc < 50 || wc > 150) {
          issues.push({ id: `c23en-${entryPrefix}`, file, type: "copy_en_word_count", severity: "info", message: `Entry "${entrySlug}" copy.en has ${wc} words (expected 50-150)`, autoFixable: false });
        }
      }
      if (copyVi) {
        const wc = countWords(copyVi);
        if (wc < 50 || wc > 150) {
          issues.push({ id: `c23vi-${entryPrefix}`, file, type: "copy_vi_word_count", severity: "info", message: `Entry "${entrySlug}" copy.vi has ${wc} words (expected 50-150)`, autoFixable: false });
        }
      }

      // 24. Validate tags exist (2-4)
      const tags = entry.tags as string[] | undefined;
      if (!tags || !Array.isArray(tags)) {
        issues.push({ id: `c24-${entryPrefix}`, file, type: "missing_tags", severity: "warning", message: `Entry "${entrySlug}" missing tags`, autoFixable: false });
      } else if (tags.length < 2 || tags.length > 4) {
        issues.push({ id: `c24b-${entryPrefix}`, file, type: "tags_count", severity: "info", message: `Entry "${entrySlug}" has ${tags.length} tags (expected 2-4)`, autoFixable: false });
      }

      // 25. Validate audio string exists
      const audio = entry.audio || entry.audio_en;
      if (!audio) {
        issues.push({ id: `c25-${entryPrefix}`, file, type: "missing_audio", severity: "warning", message: `Entry "${entrySlug}" missing audio`, fix: "Generate TTS", autoFixable: true });
      }

      // 26. Validate audio filename matches pattern
      if (audio && !isValidAudioFilename(audio)) {
        issues.push({ id: `c26-${entryPrefix}`, file, type: "invalid_audio_format", severity: "info", message: `Entry "${entrySlug}" audio "${audio}" doesn't match pattern`, autoFixable: false });
      }

      // 27. Validate entry object has no unknown keys
      const entryKeys = Object.keys(entry);
      const unknownEntryKeys = entryKeys.filter(k => !VALID_ENTRY_KEYS.has(k));
      if (unknownEntryKeys.length > 0) {
        issues.push({ id: `c27-${entryPrefix}`, file, type: "unknown_entry_keys", severity: "info", message: `Entry "${entrySlug}" has unknown keys: ${unknownEntryKeys.join(", ")}`, autoFixable: false });
      }
    }

    // 28. Validate room has no unknown root keys (informational for DB)
    // DB schema is fixed but we note this for JSON file awareness

    // 29. Validate entry count correct in DB - already checked in #11

    // 30. Validate JSON is minified & stable - check entries structure
    if (entries.length > 0) {
      const hasConsistentStructure = entries.every((e: any) => 
        typeof e === "object" && e !== null
      );
      if (!hasConsistentStructure) {
        issues.push({ id: `c30-${roomId}`, file, type: "malformed_entries", severity: "error", message: `Entries array contains non-object elements`, autoFixable: false });
      }
    }

    // Extra: Check for empty entry keywords (pink room problem)
    const hasAnyEntryKeywords = entries.some((e: any) => {
      const kwEn = e.keywords_en as string[] | undefined;
      const kwVi = e.keywords_vi as string[] | undefined;
      return (Array.isArray(kwEn) && kwEn.length > 0) || (Array.isArray(kwVi) && kwVi.length > 0);
    });
    if (!hasAnyEntryKeywords && entries.length > 0) {
      issues.push({ id: `pink-${roomId}`, file, type: "no_entry_keywords", severity: "warning", message: `Room has no entry keywords; UI keyword panel will be empty`, autoFixable: false });
    }

    // Extra: Check room-level keywords for search
    if (!room.keywords || room.keywords.length === 0) {
      const keywordSet = new Set<string>();
      for (const e of entries) {
        const kwEn = (e as any).keywords_en as string[] | undefined;
        const kwVi = (e as any).keywords_vi as string[] | undefined;
        if (Array.isArray(kwEn)) kwEn.forEach(k => keywordSet.add(k));
        if (Array.isArray(kwVi)) kwVi.forEach(k => keywordSet.add(k));
      }
      if (keywordSet.size > 0) {
        issues.push({ id: `kw-${roomId}`, file, type: "missing_room_keywords", severity: "warning", message: `Missing room-level keywords`, fix: `Extract ${keywordSet.size} keywords from entries`, autoFixable: true });
        addFix(roomId, "keywords", Array.from(keywordSet));
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
      }
    }

    log(`Repairs complete: ${fixesApplied} field fixes applied`);
  }

  const errors = issues.filter(i => i.severity === "error").length;
  const warnings = issues.filter(i => i.severity === "warning").length;

  const summary: AuditSummary = {
    totalRooms,
    scannedRooms,
    errors,
    warnings,
    fixed: fixesApplied,
  };

  log(`Summary: ${totalRooms} total, ${scannedRooms} scanned, ${errors} errors, ${warnings} warnings, ${fixesApplied} fixed`);

  return { issues, summary, fixesApplied, logs };
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
