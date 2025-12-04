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

// 🔊 Audio bucket name - using the public "audio" bucket
const AUDIO_BUCKET = "audio";

type AudioIndex = {
  /** Full paths, e.g. "free/english/ef01_intro_en.mp3" */
  allKeys: Set<string>;
  /** Basenames, e.g. "ef01_intro_en.mp3" */
  basenames: Set<string>;
};

type AuditMode = "dry-run" | "repair";

type AuditIssue = {
  id: string;
  file: string;
  type: string;
  severity: "error" | "warning" | "info";
  message: string;
  fix?: string;
  autoFixable?: boolean;
  orphanList?: string[];
};

type AuditSummary = {
  totalRooms: number;
  scannedRooms: number;
  errors: number;
  warnings: number;
  fixed: number;
  // 🔊 Audio stats
  audioFilesInBucket?: number;
  audioBasenamesInBucket?: number;
  orphanAudioFiles?: number;
  referencedAudioFiles?: number;
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

// --- Content safety patterns ---

// Self-harm / crisis (EN + VI)
const CRISIS_PATTERNS: RegExp[] = [
  /\bsuicid(e|al)\b/i,
  /\bkill myself\b/i,
  /\bhurt myself\b/i,
  /\b(end|ending) it all\b/i,
  /\bcan't go on\b/i,
  /\bno reason to live\b/i,
  /\bi want to die\b/i,
  /tự tử/i,
  /muốn chết/i,
  /không muốn sống nữa/i,
  /kết thúc cuộc đời/i,
];

// Strong medical claims (EN + VI)
const MEDICAL_PATTERNS: RegExp[] = [
  /\bcure(s|d)?\b/i,
  /\bpermanent(ly)? cure\b/i,
  /\bguaranteed (healing|recovery|results)\b/i,
  /\b100% (healing|recovery|hiệu quả)\b/i,
  /\bchữa khỏi hoàn toàn\b/i,
  /\bđiều trị dứt điểm\b/i,
  /\bkhỏi hẳn\b/i,
];

// Generic emergency instructions that MUST be careful
const EMERGENCY_PATTERNS: RegExp[] = [
  /\bcall 911\b/i,
  /\bgo to the emergency room\b/i,
  /gọi 115\b/i,
  /tới phòng cấp cứu/i,
];

type CrisisCheck = {
  hasCrisis: boolean;
  patterns: string[];
};

type MedicalCheck = {
  hasClaims: boolean;
  patterns: string[];
};

type EmergencyCheck = {
  hasEmergency: boolean;
  patterns: string[];
};

function detectCrisisContent(text: string): CrisisCheck {
  const patterns: string[] = [];
  CRISIS_PATTERNS.forEach((re) => {
    if (re.test(text)) patterns.push(re.source);
  });
  return { hasCrisis: patterns.length > 0, patterns };
}

function detectMedicalClaims(text: string): MedicalCheck {
  const patterns: string[] = [];
  MEDICAL_PATTERNS.forEach((re) => {
    if (re.test(text)) patterns.push(re.source);
  });
  return { hasClaims: patterns.length > 0, patterns };
}

function detectEmergencyPhrasing(text: string): EmergencyCheck {
  const patterns: string[] = [];
  EMERGENCY_PATTERNS.forEach((re) => {
    if (re.test(text)) patterns.push(re.source);
  });
  return { hasEmergency: patterns.length > 0, patterns };
}

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

// Helper: infer domain from tier (expanded for VIP4/5/6/Kids)
function inferDomainFromTier(tier: string): string {
  const tierLower = tier.toLowerCase();
  if (tierLower.includes("vip9")) return "Strategic Intelligence";
  if (tierLower.includes("vip8")) return "Advanced Mastery";
  if (tierLower.includes("vip7")) return "Professional Growth";
  if (tierLower.includes("vip6")) return "Deep Psychology";
  if (tierLower.includes("vip5")) return "Creative Writing";
  if (tierLower.includes("vip4")) return "CareerZ";
  if (tierLower.includes("vip3")) return "Intermediate English";
  if (tierLower.includes("vip2")) return "Pre-Intermediate English";
  if (tierLower.includes("vip1")) return "Beginner English";
  if (tierLower.includes("free") || tierLower.includes("miễn phí")) return "English Foundation";
  if (tierLower.includes("kids") || tierLower.includes("trẻ em")) return "Kids English";
  return "General";
}

// Deprecated field names that should be migrated
const DEPRECATED_FIELDS = new Set([
  "artifact_id",
  "identifier", 
  "copy_en",
  "copy_vi",
  "audio_en",
  "audio_vi",
]);

// Placeholder patterns to detect unfinished content
const PLACEHOLDER_PATTERNS: RegExp[] = [
  /\bTODO\b/i,
  /\bTBD\b/i,
  /\bplaceholder\b/i,
  /\bLorem ipsum\b/i,
  /^\.{3,}$/,
  /^_{3,}$/,
  /^\[.*\]$/,
  /^<.*>$/,
];

// TTS-unsafe patterns (symbols that break audio generation)
const TTS_UNSAFE_PATTERNS: RegExp[] = [
  /["""][^"""]*$/,  // Unclosed quotes
  /[\u{1F300}-\u{1F9FF}]/u,  // Emojis
  /[<>{}[\]\\|]/,  // Programming symbols
  /\${.*}/,  // Template literals
];

// Check for placeholders in text
function detectPlaceholder(text: string): boolean {
  return PLACEHOLDER_PATTERNS.some(re => re.test(text));
}

// Check for TTS-unsafe content
function detectTtsUnsafe(text: string): { unsafe: boolean; reasons: string[] } {
  const reasons: string[] = [];
  
  // Check unclosed quotes
  const doubleQuotes = (text.match(/"/g) || []).length;
  const singleQuotes = (text.match(/'/g) || []).length;
  if (doubleQuotes % 2 !== 0) reasons.push("unclosed double quotes");
  if (singleQuotes % 2 !== 0) reasons.push("unclosed single quotes");
  
  // Check emojis
  if (/[\u{1F300}-\u{1F9FF}]/u.test(text)) reasons.push("contains emojis");
  
  // Check programming symbols
  if (/[<>{}[\]\\|]/.test(text)) reasons.push("contains programming symbols");
  
  // Check template literals
  if (/\${.*}/.test(text)) reasons.push("contains template literals");
  
  return { unsafe: reasons.length > 0, reasons };
}

// Helper: check if tier is canonical
function isCanonicalTier(tier: string): boolean {
  return VALID_CANONICAL_TIER_VALUES.includes(tier);
}

// 🔊 Build audio index from Supabase Storage
async function buildAudioIndex(): Promise<AudioIndex> {
  const allKeys: string[] = [];

  try {
    // List files from root of audio bucket
    const { data, error } = await supabase.storage
      .from(AUDIO_BUCKET)
      .list("", { limit: 10000, offset: 0 });

    if (error) {
      console.error("[SafeShield] Audio index error:", error.message);
      return { allKeys: new Set(), basenames: new Set() };
    }

    // Process root-level files and folders
    for (const obj of data ?? []) {
      if (!obj.name) continue;
      
      // If it's a folder (no metadata), recursively list its contents
      if (obj.metadata === null) {
        const folderContents = await listFolderRecursive(obj.name);
        allKeys.push(...folderContents);
      } else {
        // It's a file at root level
        allKeys.push(obj.name);
      }
    }
  } catch (err) {
    console.error("[SafeShield] Audio index exception:", err);
    return { allKeys: new Set(), basenames: new Set() };
  }

  const keySet = new Set(allKeys);
  const basenameSet = new Set(allKeys.map((k) => k.split("/").pop() || k));

  return { allKeys: keySet, basenames: basenameSet };
}

// Helper: recursively list folder contents
async function listFolderRecursive(folderPath: string): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const { data, error } = await supabase.storage
      .from(AUDIO_BUCKET)
      .list(folderPath, { limit: 10000, offset: 0 });

    if (error || !data) return files;

    for (const obj of data) {
      if (!obj.name) continue;
      const fullPath = `${folderPath}/${obj.name}`;
      
      if (obj.metadata === null) {
        // It's a subfolder, recurse
        const subFiles = await listFolderRecursive(fullPath);
        files.push(...subFiles);
      } else {
        // It's a file
        files.push(fullPath);
      }
    }
  } catch (err) {
    console.error(`[SafeShield] Error listing folder ${folderPath}:`, err);
  }

  return files;
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

  // 🔊 Build audio index once
  const audioIndex = await buildAudioIndex();
  log(`Audio index: ${audioIndex.allKeys.size} files, ${audioIndex.basenames.size} unique basenames`);

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

  // 🔊 Track all audio filenames that rooms refer to
  const referencedAudioBasenames = new Set<string>();

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

    // 📝 Essay checks (word count + placeholder detection)
    const essayEn = room.room_essay_en?.trim() || "";
    const essayVi = room.room_essay_vi?.trim() || "";
    
    // Missing essays
    if (!essayEn) {
      issues.push({ id: `essay_en-${roomId}`, file, type: "missing_room_essay_en", severity: "warning", message: `Missing room_essay_en`, autoFixable: false });
    } else {
      const essayWc = countWords(essayEn);
      // Essay too short (less than 20 words)
      if (essayWc < 20) {
        issues.push({ id: `essay_short_en-${roomId}`, file, type: "essay_too_short", severity: "warning", message: `room_essay_en has only ${essayWc} words (minimum 20)`, autoFixable: false });
      }
      // Essay too long (more than 500 words)
      if (essayWc > 500) {
        issues.push({ id: `essay_long_en-${roomId}`, file, type: "essay_too_long", severity: "warning", message: `room_essay_en has ${essayWc} words (maximum 500)`, autoFixable: false });
      }
      // Placeholder detection
      if (detectPlaceholder(essayEn)) {
        issues.push({ id: `essay_placeholder_en-${roomId}`, file, type: "essay_placeholder_detected", severity: "error", message: `room_essay_en contains placeholder text (TODO, TBD, etc.)`, autoFixable: false });
      }
    }
    
    if (!essayVi) {
      issues.push({ id: `essay_vi-${roomId}`, file, type: "missing_room_essay_vi", severity: "warning", message: `Missing room_essay_vi`, autoFixable: false });
    } else {
      const essayWc = countWords(essayVi);
      if (essayWc < 20) {
        issues.push({ id: `essay_short_vi-${roomId}`, file, type: "essay_too_short", severity: "warning", message: `room_essay_vi has only ${essayWc} words (minimum 20)`, autoFixable: false });
      }
      if (essayWc > 500) {
        issues.push({ id: `essay_long_vi-${roomId}`, file, type: "essay_too_long", severity: "warning", message: `room_essay_vi has ${essayWc} words (maximum 500)`, autoFixable: false });
      }
      if (detectPlaceholder(essayVi)) {
        issues.push({ id: `essay_placeholder_vi-${roomId}`, file, type: "essay_placeholder_detected", severity: "error", message: `room_essay_vi contains placeholder text (TODO, TBD, etc.)`, autoFixable: false });
      }
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

    // Track all keywords for duplicate detection
    const allKeywordsInRoom = new Map<string, number[]>();

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i] as Record<string, any>;
      const entrySlug = entry.slug || entry.artifact_id || entry.id || `entry-${i}`;
      const entryPrefix = `${roomId}-e${i}`;

      // 🔄 Deprecated field detection
      for (const key of Object.keys(entry)) {
        if (DEPRECATED_FIELDS.has(key)) {
          issues.push({ 
            id: `deprecated-${entryPrefix}-${key}`, 
            file, 
            type: "deprecated_field_present", 
            severity: "info", 
            message: `Entry "${entrySlug}" uses deprecated field "${key}"`, 
            fix: key === "artifact_id" || key === "identifier" ? "Rename to 'slug'" : 
                 key === "copy_en" || key === "copy_vi" ? "Use copy: { en, vi } structure" :
                 key === "audio_en" || key === "audio_vi" ? "Use 'audio' field only" : undefined,
            autoFixable: false 
          });
        }
      }

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

      // 🏷️ Per-entry keyword validation
      const kwEn = entry.keywords_en;
      const kwVi = entry.keywords_vi;
      
      // Check keywords_en
      if (!Array.isArray(kwEn) || kwEn.length === 0) {
        issues.push({ id: `kw_missing_en-${entryPrefix}`, file, type: "entry_keyword_missing_en", severity: "warning", message: `Entry "${entrySlug}" missing keywords_en`, autoFixable: false });
      } else {
        // Too few keywords
        if (kwEn.length < 3) {
          issues.push({ id: `kw_few_en-${entryPrefix}`, file, type: "entry_keyword_too_few", severity: "info", message: `Entry "${entrySlug}" has only ${kwEn.length} keywords_en (recommended: 3+)`, autoFixable: false });
        }
        // Track for duplicate detection
        for (const kw of kwEn) {
          if (typeof kw === "string") {
            const kwLower = kw.toLowerCase();
            if (!allKeywordsInRoom.has(kwLower)) allKeywordsInRoom.set(kwLower, []);
            allKeywordsInRoom.get(kwLower)!.push(i);
          }
        }
      }
      
      // Check keywords_vi
      if (!Array.isArray(kwVi) || kwVi.length === 0) {
        issues.push({ id: `kw_missing_vi-${entryPrefix}`, file, type: "entry_keyword_missing_vi", severity: "warning", message: `Entry "${entrySlug}" missing keywords_vi`, autoFixable: false });
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
        
        // 🎤 TTS safety check for English copy
        if (wc > 300) {
          issues.push({ id: `tts_long_en-${entryPrefix}`, file, type: "tts_length_exceeded", severity: "warning", message: `Entry "${entrySlug}" copy.en has ${wc} words - may cause TTS issues (max 300)`, autoFixable: false });
        }
        const ttsCheck = detectTtsUnsafe(copyEn);
        if (ttsCheck.unsafe) {
          issues.push({ id: `tts_unsafe_en-${entryPrefix}`, file, type: "tts_unstable_text", severity: "warning", message: `Entry "${entrySlug}" copy.en has TTS-unsafe content: ${ttsCheck.reasons.join(", ")}`, autoFixable: false });
        }
        // Placeholder detection in copy
        if (detectPlaceholder(copyEn)) {
          issues.push({ id: `placeholder_en-${entryPrefix}`, file, type: "copy_placeholder_detected", severity: "error", message: `Entry "${entrySlug}" copy.en contains placeholder text`, autoFixable: false });
        }
      }
      if (copyVi) {
        const wc = countWords(copyVi);
        if (wc < 30 || wc > 260) {
          issues.push({ id: `wc_vi-${entryPrefix}`, file, type: "copy_word_count_extreme", severity: "warning", message: `Entry "${entrySlug}" copy.vi has ${wc} words (outside 30-260 range)`, autoFixable: false });
        }
        
        // 🎤 TTS safety check for Vietnamese copy
        if (wc > 300) {
          issues.push({ id: `tts_long_vi-${entryPrefix}`, file, type: "tts_length_exceeded", severity: "warning", message: `Entry "${entrySlug}" copy.vi has ${wc} words - may cause TTS issues (max 300)`, autoFixable: false });
        }
        const ttsCheck = detectTtsUnsafe(copyVi);
        if (ttsCheck.unsafe) {
          issues.push({ id: `tts_unsafe_vi-${entryPrefix}`, file, type: "tts_unstable_text", severity: "warning", message: `Entry "${entrySlug}" copy.vi has TTS-unsafe content: ${ttsCheck.reasons.join(", ")}`, autoFixable: false });
        }
        if (detectPlaceholder(copyVi)) {
          issues.push({ id: `placeholder_vi-${entryPrefix}`, file, type: "copy_placeholder_detected", severity: "error", message: `Entry "${entrySlug}" copy.vi contains placeholder text`, autoFixable: false });
        }
      }

      // 🔊 Audio deep check
      const audio = entry.audio || entry.audio_en;
      if (!audio || (typeof audio === "string" && audio.trim() === "")) {
        issues.push({
          id: `audio-${entryPrefix}`,
          file,
          type: "missing_audio_field",
          severity: "error",
          message: `Entry "${entrySlug}" missing audio field`,
          fix: "Add or generate TTS filename",
          autoFixable: false,
        });
      } else if (typeof audio === "string") {
        const trimmed = audio.trim();

        // Register as referenced (by basename)
        const basename = trimmed.split("/").pop() || trimmed;
        referencedAudioBasenames.add(basename);

        // 🔍 Check if file actually exists in storage
        const existsByKey = audioIndex.allKeys.has(trimmed);
        const existsByBasename = audioIndex.basenames.has(basename);

        if (!existsByKey && !existsByBasename) {
          issues.push({
            id: `audio-file-${entryPrefix}`,
            file,
            type: "missing_audio_file",
            severity: "error",
            message: `Entry "${entrySlug}" points to audio "${trimmed}", but no matching file found in "${AUDIO_BUCKET}"`,
            fix: "Generate TTS and upload with this filename",
            autoFixable: false,
          });
        }
      }
    }

    // 🏷️ Check for duplicate keywords across entries in this room
    for (const [keyword, entryIndices] of allKeywordsInRoom.entries()) {
      if (entryIndices.length > 1) {
        issues.push({ 
          id: `kw_dup-${roomId}-${keyword.substring(0, 20)}`, 
          file, 
          type: "entry_keyword_duplicate_across_room", 
          severity: "info", 
          message: `Keyword "${keyword}" appears in ${entryIndices.length} entries (indices: ${entryIndices.join(", ")})`, 
          autoFixable: false 
        });
      }
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

    // 🔊 Room-level intro audio (based on room_essay_en / room_essay_vi)
    const hasIntroEn = typeof room.room_essay_en === "string" && room.room_essay_en.trim().length > 0;
    const hasIntroVi = typeof room.room_essay_vi === "string" && room.room_essay_vi.trim().length > 0;

    // Convention: <roomId>_intro_en.mp3 / _intro_vi.mp3
    const introEnName = `${roomId}_intro_en.mp3`;
    const introViName = `${roomId}_intro_vi.mp3`;

    if (hasIntroEn) {
      const exists = audioIndex.basenames.has(introEnName);
      if (!exists) {
        issues.push({
          id: `intro-audio-en-${roomId}`,
          file,
          type: "missing_intro_audio_en",
          severity: "warning",
          message: `Room has room_essay_en but no intro audio file "${introEnName}" in "${AUDIO_BUCKET}"`,
          fix: `Generate TTS and store as "${introEnName}"`,
          autoFixable: false,
        });
      } else {
        referencedAudioBasenames.add(introEnName);
      }
    }

    if (hasIntroVi) {
      const exists = audioIndex.basenames.has(introViName);
      if (!exists) {
        issues.push({
          id: `intro-audio-vi-${roomId}`,
          file,
          type: "missing_intro_audio_vi",
          severity: "warning",
          message: `Room has room_essay_vi but no intro audio file "${introViName}" in "${AUDIO_BUCKET}"`,
          fix: `Generate TTS and store as "${introViName}"`,
          autoFixable: false,
        });
      } else {
        referencedAudioBasenames.add(introViName);
      }
    }

    // --- Content safety aggregation (titles + essays + entries copy) ---
    const roomTextParts: string[] = [];

    // Room essays (if present)
    if (room.room_essay_en) roomTextParts.push(String(room.room_essay_en));
    if (room.room_essay_vi) roomTextParts.push(String(room.room_essay_vi));

    // Titles
    if (room.title_en) roomTextParts.push(String(room.title_en));
    if (room.title_vi) roomTextParts.push(String(room.title_vi));

    // Entries copy
    for (const e of entries as any[]) {
      const cEn = e.copy?.en ?? e.copy_en;
      const cVi = e.copy?.vi ?? e.copy_vi;
      if (cEn) roomTextParts.push(String(cEn));
      if (cVi) roomTextParts.push(String(cVi));
    }

    const allText = roomTextParts.join("\n").toLowerCase();

    // --- Content safety checks ---
    const crisisCheck = detectCrisisContent(allText);
    const medicalCheck = detectMedicalClaims(allText);
    const emergencyCheck = detectEmergencyPhrasing(allText);

    // 1) Crisis / self-harm content (global)
    if (crisisCheck.hasCrisis) {
      issues.push({
        id: `crisis-${roomId}`,
        file,
        type: "crisis_content",
        severity: "error",
        message: `Potential crisis / self-harm content detected: ${crisisCheck.patterns.join(", ")}`,
        autoFixable: false,
      });
    }

    // 2) Medical over-claiming
    if (medicalCheck.hasClaims) {
      issues.push({
        id: `medical-${roomId}`,
        file,
        type: "medical_claims",
        severity: "warning",
        message: `Strong medical / cure-like claims detected: ${medicalCheck.patterns.join(", ")}`,
        autoFixable: false,
      });
    }

    // 3) Emergency phrasing that must be framed correctly
    if (emergencyCheck.hasEmergency) {
      issues.push({
        id: `emergency-${roomId}`,
        file,
        type: "emergency_phrasing",
        severity: "warning",
        message: 'Emergency instructions detected (e.g. "call 115" / "go to ER"). Make sure they are framed as: "If you are in immediate danger, contact local emergency services / 115 / 911."',
        autoFixable: false,
      });
    }

    // 4) Extra strict rule for Kids tiers: any crisis content = hard blocker
    const effectiveTier = room.tier || inferTierFromRoomId(roomId);
    if (effectiveTier.toLowerCase().includes("kids") && crisisCheck.hasCrisis) {
      issues.push({
        id: `kids-crisis-${roomId}`,
        file,
        type: "kids_crisis_blocker",
        severity: "error",
        message: "Crisis / self-harm content detected in a Kids room. This must be removed or heavily reframed; kids content cannot contain self-harm narratives.",
        autoFixable: false,
      });
    }
  }

  // 🔎 Orphan audio detection: files in bucket that no room references
  const orphanBasenames: string[] = [];
  for (const fullKey of audioIndex.allKeys) {
    const basename = fullKey.split("/").pop() || fullKey;
    if (!referencedAudioBasenames.has(basename)) {
      orphanBasenames.push(fullKey);
    }
  }

  // Report orphan files as info issue
  if (orphanBasenames.length > 0) {
    issues.push({
      id: "orphan-audio",
      file: "(storage)",
      type: "orphan_audio_files",
      severity: "info",
      message: `Found ${orphanBasenames.length} audio files in "${AUDIO_BUCKET}" that are not referenced by any room`,
      fix: "Consider deleting or relinking these files",
      autoFixable: false,
      orphanList: orphanBasenames.slice(0, 200),
    });
  }

  log(`Audio analysis: ${referencedAudioBasenames.size} referenced, ${orphanBasenames.length} orphans`);

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
    // 🔊 Audio stats
    audioFilesInBucket: audioIndex.allKeys.size,
    audioBasenamesInBucket: audioIndex.basenames.size,
    orphanAudioFiles: orphanBasenames.length,
    referencedAudioFiles: referencedAudioBasenames.size,
  };

  log(`Summary: ${totalRooms} total, ${scannedRooms} scanned, ${errors} errors, ${warnings} warnings, ${fixesApplied} fixed`);
  log(`Audio: ${audioIndex.allKeys.size} in bucket, ${referencedAudioBasenames.size} referenced, ${orphanBasenames.length} orphans`);

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
