// supabase/functions/audit-v4-safe-shield/index.ts
// Full System Sync Auditor - Safe Shield V5
// NON-DESTRUCTIVE: Only detects issues and generates fix tasks + audio jobs
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

// ============================================================================
// CORS & SUPABASE SETUP
// ============================================================================

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

// ============================================================================
// TYPES — Mirrored from src/lib/audit-v4-types.ts for Deno compatibility
// ============================================================================

const AUDIO_BUCKET = "audio";

type AuditMode = "dry-run" | "repair" | "scan";
type AuditSeverity = "error" | "warning" | "info";
type TaskType = "fix_json" | "fix_audio" | "create_intro_audio" | "fill_keywords" | "rewrite_essay" | "review_content" | "delete_orphan";
type TaskPriority = "low" | "medium" | "high" | "critical";

// Complete AuditIssueType union - keep in sync with src/lib/audit-v4-types.ts
type AuditIssueType =
  | "duplicate_room" | "missing_tier" | "invalid_tier" | "tier_incorrect"
  | "missing_schema_id" | "missing_schema" | "missing_domain" | "domain_incorrect"
  | "missing_title" | "missing_title_en" | "missing_title_vi"
  | "missing_entries" | "malformed_entries" | "entry_count_info"
  | "missing_slug" | "duplicate_slug" | "slug_format_info" | "invalid_slug"
  | "entry_copy_missing" | "entry_copy_structure_invalid"
  | "missing_copy_en" | "missing_copy_vi" | "copy_word_count_extreme" | "copy_placeholder_detected"
  | "room_content_missing"
  | "missing_room_keywords" | "missing_keywords" | "missing_keywords_vi"
  | "entry_keyword_missing_en" | "entry_keyword_missing_vi"
  | "entry_keyword_too_few" | "entry_keyword_duplicate_across_room"
  | "keyword_display_label_wrong" | "keyword_too_few" | "keyword_duplicate"
  | "missing_audio" | "missing_audio_field" | "missing_audio_file"
  | "missing_intro_audio_en" | "missing_intro_audio_vi"
  | "orphan_audio_files"
  | "missing_json" | "invalid_json" | "json_malformed" | "json_size_exceeded"
  | "missing_db" | "mismatched_slug" | "registry_missing"
  | "missing_room_essay_en" | "missing_room_essay_vi"
  | "essay_placeholder_detected" | "essay_placeholder" | "essay_too_short" | "essay_too_long"
  | "tts_unstable_text" | "tts_length_exceeded"
  | "crisis_content" | "crisis_content_detected" | "medical_claims" | "unsafe_medical_claim"
  | "emergency_phrasing" | "kids_crisis_blocker" | "kids_blocker_detected"
  | "corrupt_characters_detected"
  | "deprecated_field_present" | "unknown_entry_key" | "unknown_field_present"
  | "tts_job_generated" | "tts_intro_job_generated"
  | "general_warning" | "general_info";

interface AuditIssue {
  id: string;
  file: string;
  type: AuditIssueType | string;
  severity: AuditSeverity;
  message: string;
  fix?: string;
  autoFixable?: boolean;
  orphanList?: string[];
  context?: Record<string, unknown>;
}

interface AuditTaskSuggestion {
  room_id: string;
  priority: TaskPriority;
  task_type: TaskType;
  description: string;
  suggested_filename?: string;
  suggested_text?: string;
  language?: "en" | "vi";
}

interface AudioJob {
  room_id: string;
  entry_slug?: string;
  field: "intro" | "content";
  lang: "en" | "vi";
  text: string;
  filename: string;
}

interface AuditSummary {
  totalRooms: number;
  scannedRooms: number;
  errors: number;
  warnings: number;
  infos: number;
  fixed: number;
  audioFilesInBucket: number;
  audioBasenamesInBucket: number;
  orphanAudioCount: number;
  orphanAudioFiles: number;
  referencedAudioFiles: number;
  totalAudioSlots: number;
  totalAudioPresent: number;
  totalAudioMissing: number;
  entriesMissingAudio: number;
  audioCoveragePercent: number;
  roomsWithIntroEn: number;
  roomsWithIntroVi: number;
  roomsMissingIntroEn: number;
  roomsMissingIntroVi: number;
  roomsWithFullIntroAudio: number;
  tasksGenerated: number;
  audioJobsGenerated: number;
  durationMs: number;
}

interface AuditRequestOptions {
  mode: AuditMode;
  limit?: number;
  roomIdPrefix?: string;
  checkFiles?: boolean;
}

interface AuditResponse {
  ok: boolean;
  mode: AuditMode;
  error?: string;
  stats: AuditSummary;
  summary: AuditSummary;
  issues: AuditIssue[];
  tasks: AuditTaskSuggestion[];
  audioJobs: AudioJob[];
  fixesApplied: number;
  fixed: number;
  logs: string[];
}

type AudioIndex = {
  allKeys: Set<string>;
  basenames: Set<string>;
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

// ============================================================================
// CANONICAL TIERS - ordered for priority matching (vip3ii before vip3, etc.)
// ============================================================================

const TIER_PRIORITY: Array<{ pattern: string; tier: string; label: string }> = [
  { pattern: "vip9", tier: "vip9", label: "VIP9 / VIP9" },
  { pattern: "vip8", tier: "vip8", label: "VIP8 / VIP8" },
  { pattern: "vip7", tier: "vip7", label: "VIP7 / VIP7" },
  { pattern: "vip6", tier: "vip6", label: "VIP6 / VIP6" },
  { pattern: "vip5", tier: "vip5", label: "VIP5 / VIP5" },
  { pattern: "vip4", tier: "vip4", label: "VIP4 / VIP4" },
  { pattern: "vip3ii", tier: "vip3ii", label: "VIP3 II / VIP3 II" },
  { pattern: "vip3", tier: "vip3", label: "VIP3 / VIP3" },
  { pattern: "vip2", tier: "vip2", label: "VIP2 / VIP2" },
  { pattern: "vip1", tier: "vip1", label: "VIP1 / VIP1" },
  { pattern: "kids_3", tier: "kids_3", label: "Kids Level 3 / Trẻ em cấp 3" },
  { pattern: "kids-3", tier: "kids_3", label: "Kids Level 3 / Trẻ em cấp 3" },
  { pattern: "kids_l3", tier: "kids_3", label: "Kids Level 3 / Trẻ em cấp 3" },
  { pattern: "kids_2", tier: "kids_2", label: "Kids Level 2 / Trẻ em cấp 2" },
  { pattern: "kids-2", tier: "kids_2", label: "Kids Level 2 / Trẻ em cấp 2" },
  { pattern: "kids_l2", tier: "kids_2", label: "Kids Level 2 / Trẻ em cấp 2" },
  { pattern: "kids_1", tier: "kids_1", label: "Kids Level 1 / Trẻ em cấp 1" },
  { pattern: "kids-1", tier: "kids_1", label: "Kids Level 1 / Trẻ em cấp 1" },
  { pattern: "kids_l1", tier: "kids_1", label: "Kids Level 1 / Trẻ em cấp 1" },
  { pattern: "free", tier: "free", label: "Free / Miễn phí" },
];

const CANONICAL_TIER_LABELS = new Set(TIER_PRIORITY.map(t => t.label));

// Valid entry keys
const VALID_ENTRY_KEYS = new Set([
  "slug", "artifact_id", "id", "identifier",
  "keywords_en", "keywords_vi",
  "copy", "copy_en", "copy_vi",
  "tags", "audio", "audio_en", "audio_vi",
  "severity_level", "title", "title_en", "title_vi",
]);

// Deprecated field names
const DEPRECATED_FIELDS = new Set([
  "artifact_id", "identifier", "copy_en", "copy_vi", "audio_en", "audio_vi",
  "answers", "essay", "essay_en", "essay_vi",
]);

// ============================================================================
// CONTENT SAFETY PATTERNS
// ============================================================================

const CRISIS_PATTERNS: RegExp[] = [
  /\bsuicid(e|al)\b/i, /\bkill myself\b/i, /\bhurt myself\b/i,
  /\b(end|ending) it all\b/i, /\bcan't go on\b/i, /\bno reason to live\b/i,
  /\bi want to die\b/i, /tự tử/i, /muốn chết/i, /không muốn sống nữa/i,
  /kết thúc cuộc đời/i,
];

const MEDICAL_PATTERNS: RegExp[] = [
  /\bcure(s|d)?\b/i, /\bpermanent(ly)? cure\b/i,
  /\bguaranteed (healing|recovery|results)\b/i,
  /\b100% (healing|recovery|hiệu quả)\b/i,
  /\bchữa khỏi hoàn toàn\b/i, /\bđiều trị dứt điểm\b/i, /\bkhỏi hẳn\b/i,
];

const EMERGENCY_PATTERNS: RegExp[] = [
  /\bcall 911\b/i, /\bgo to the emergency room\b/i,
  /gọi 115\b/i, /tới phòng cấp cứu/i,
];

const PLACEHOLDER_PATTERNS: RegExp[] = [
  /\bTODO\b/i, /\bTBD\b/i, /\bplaceholder\b/i, /\bLorem ipsum\b/i,
  /^\.{3,}$/, /^_{3,}$/, /^\?{2,}$/, /^x{3,}$/i, /^\[.*\]$/, /^<.*>$/,
];

const CORRUPT_CHAR_PATTERNS: RegExp[] = [
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/, // Control characters
  /\uFFFD/, // Replacement character
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function isKebabCase(str: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);
}

function inferTierFromRoomId(roomId: string): string {
  const idLower = roomId.toLowerCase();
  for (const { pattern, label } of TIER_PRIORITY) {
    if (idLower.includes(`_${pattern}`) || idLower.includes(`-${pattern}`) || idLower.endsWith(pattern)) {
      return label;
    }
  }
  return "Free / Miễn phí";
}

function inferDomainFromTier(tier: string): string {
  const t = tier.toLowerCase();
  if (t.includes("vip9")) return "Strategic Intelligence";
  if (t.includes("vip8")) return "Advanced Mastery";
  if (t.includes("vip7")) return "Professional Growth";
  if (t.includes("vip6")) return "Deep Psychology";
  if (t.includes("vip5")) return "Creative Writing";
  if (t.includes("vip4")) return "CareerZ";
  if (t.includes("vip3ii")) return "VIP English Learning";
  if (t.includes("vip3")) return "VIP English Learning";
  if (t.includes("vip2")) return "VIP English Learning";
  if (t.includes("vip1")) return "VIP English Learning";
  if (t.includes("free") || t.includes("miễn phí")) return "English Foundation";
  if (t.includes("kids") || t.includes("trẻ em")) return "Kids English";
  return "General";
}

function isCanonicalTier(tier: string): boolean {
  return CANONICAL_TIER_LABELS.has(tier);
}

function detectCrisis(text: string): { found: boolean; patterns: string[] } {
  const patterns = CRISIS_PATTERNS.filter(re => re.test(text)).map(re => re.source);
  return { found: patterns.length > 0, patterns };
}

function detectMedical(text: string): { found: boolean; patterns: string[] } {
  const patterns = MEDICAL_PATTERNS.filter(re => re.test(text)).map(re => re.source);
  return { found: patterns.length > 0, patterns };
}

function detectEmergency(text: string): { found: boolean; patterns: string[] } {
  const patterns = EMERGENCY_PATTERNS.filter(re => re.test(text)).map(re => re.source);
  return { found: patterns.length > 0, patterns };
}

function detectPlaceholder(text: string): boolean {
  return PLACEHOLDER_PATTERNS.some(re => re.test(text));
}

function detectCorruptChars(text: string): boolean {
  return CORRUPT_CHAR_PATTERNS.some(re => re.test(text));
}

function detectTtsUnsafe(text: string): { unsafe: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if ((text.match(/"/g) || []).length % 2 !== 0) reasons.push("unclosed double quotes");
  if ((text.match(/'/g) || []).length % 2 !== 0) reasons.push("unclosed single quotes");
  if (/[\u{1F300}-\u{1F9FF}]/u.test(text)) reasons.push("contains emojis");
  if (/[<>{}[\]\\|]/.test(text)) reasons.push("programming symbols");
  if (/\${.*}/.test(text)) reasons.push("template literals");
  if (/&nbsp;|<br\s*\/?>|<br><br>/i.test(text)) reasons.push("HTML entities/tags");
  return { unsafe: reasons.length > 0, reasons };
}

function getPriority(severity: AuditSeverity): TaskPriority {
  if (severity === "error") return "high";
  if (severity === "warning") return "medium";
  return "low";
}

// ============================================================================
// AUDIO INDEX BUILDER
// ============================================================================

async function buildAudioIndex(log: (msg: string) => void): Promise<AudioIndex> {
  const allKeys: string[] = [];

  async function listFolder(path: string): Promise<void> {
    try {
      const { data, error } = await supabase.storage
        .from(AUDIO_BUCKET)
        .list(path, { limit: 10000, offset: 0 });

      if (error || !data) return;

      for (const obj of data) {
        if (!obj.name) continue;
        const fullPath = path ? `${path}/${obj.name}` : obj.name;
        if (obj.metadata === null) {
          await listFolder(fullPath);
        } else {
          allKeys.push(fullPath);
        }
      }
    } catch (err) {
      log(`Audio index error for ${path}: ${err}`);
    }
  }

  try {
    await listFolder("");
  } catch (err) {
    log(`Failed to build audio index: ${err}`);
  }

  return {
    allKeys: new Set(allKeys),
    basenames: new Set(allKeys.map(k => k.split("/").pop() || k)),
  };
}

// ============================================================================
// MAIN AUDIT FUNCTION - V5 with task generation
// ============================================================================

async function runSafeShieldAudit(options: AuditRequestOptions): Promise<{
  issues: AuditIssue[];
  tasks: AuditTaskSuggestion[];
  audioJobs: AudioJob[];
  summary: AuditSummary;
  fixesApplied: number;
  logs: string[];
}> {
  const startTime = performance.now();
  const { mode, limit, roomIdPrefix, checkFiles = true } = options;

  const logs: string[] = [];
  const issues: AuditIssue[] = [];
  const tasks: AuditTaskSuggestion[] = [];
  const audioJobs: AudioJob[] = [];
  let fixesApplied = 0;

  const log = (msg: string) => {
    const timestamp = new Date().toISOString().split("T")[1].slice(0, 12);
    const line = `[${timestamp}] ${msg}`;
    logs.push(line);
    console.log(`[SafeShield] ${msg}`);
  };

  log(`=== Safe Shield V5 Audit Started ===`);
  log(`Mode: ${mode}, Limit: ${limit || "all"}, Prefix: ${roomIdPrefix || "none"}, CheckFiles: ${checkFiles}`);

  // =========================================================================
  // PHASE 0: Build audio index (if checkFiles enabled)
  // =========================================================================
  let audioIndex: AudioIndex = { allKeys: new Set(), basenames: new Set() };
  if (checkFiles) {
    log("Phase 0: Building audio index from storage...");
    try {
      audioIndex = await buildAudioIndex(log);
      log(`Audio index ready: ${audioIndex.allKeys.size} files, ${audioIndex.basenames.size} basenames`);
    } catch (err) {
      log(`WARNING: Audio index build failed: ${err}`);
    }
  }

  // =========================================================================
  // PHASE 1: Load rooms from database
  // =========================================================================
  log("Phase 1: Loading rooms from database...");
  let query = supabase
    .from("rooms")
    .select("id, tier, schema_id, domain, title_en, title_vi, room_essay_en, room_essay_vi, keywords, entries");

  if (roomIdPrefix) {
    query = query.ilike("id", `${roomIdPrefix}%`);
  }
  if (limit) {
    query = query.limit(limit);
  }

  const { data: dbRooms, error: dbError } = await query;

  if (dbError) {
    throw new Error(`Database error: ${dbError.message}`);
  }

  const rooms: DbRoom[] = (dbRooms ?? []) as DbRoom[];
  const totalRooms = rooms.length;
  log(`Loaded ${totalRooms} rooms from database`);

  // Tracking
  const seenIds = new Set<string>();
  const roomFixes = new Map<string, Record<string, any>>();
  const fixedIssueIds = new Set<string>();
  const referencedAudioBasenames = new Set<string>();

  // Metrics
  let scannedRooms = 0;
  let totalAudioSlots = 0;
  let totalAudioPresent = 0;
  let entriesMissingAudio = 0;
  let roomsWithIntroEn = 0;
  let roomsWithIntroVi = 0;
  let roomsMissingIntroEn = 0;
  let roomsMissingIntroVi = 0;

  const addFix = (roomId: string, field: string, value: any, issueId: string) => {
    if (!roomFixes.has(roomId)) roomFixes.set(roomId, {});
    roomFixes.get(roomId)![field] = value;
    fixedIssueIds.add(issueId);
  };

  const addTask = (task: AuditTaskSuggestion) => {
    tasks.push(task);
  };

  const addAudioJob = (job: AudioJob) => {
    audioJobs.push(job);
  };

  // =========================================================================
  // PHASE 2: Validate each room
  // =========================================================================
  log("Phase 2: Validating rooms...");

  for (const room of rooms) {
    const roomId = room.id;
    const file = `${roomId}.json`;
    scannedRooms++;

    // --- PHASE 2A: Room identity validation ---
    
    // Duplicate check
    if (seenIds.has(roomId)) {
      issues.push({ id: `dup-${roomId}`, file, type: "duplicate_room", severity: "error", message: `Duplicate room id: ${roomId}`, autoFixable: false });
      continue;
    }
    seenIds.add(roomId);

    // Tier validation
    const tierIssueId = `tier-${roomId}`;
    if (!room.tier) {
      const inferredTier = inferTierFromRoomId(roomId);
      issues.push({ id: tierIssueId, file, type: "missing_tier", severity: "warning", message: `Missing tier`, fix: `Set to "${inferredTier}"`, autoFixable: true });
      addFix(roomId, "tier", inferredTier, tierIssueId);
      addTask({ room_id: roomId, priority: "medium", task_type: "fix_json", description: `Set tier to "${inferredTier}"` });
    } else if (!isCanonicalTier(room.tier)) {
      const inferredTier = inferTierFromRoomId(roomId);
      issues.push({ id: tierIssueId, file, type: "invalid_tier", severity: "warning", message: `Invalid tier: "${room.tier}"`, fix: `Set to "${inferredTier}"`, autoFixable: true });
      addFix(roomId, "tier", inferredTier, tierIssueId);
      addTask({ room_id: roomId, priority: "medium", task_type: "fix_json", description: `Fix invalid tier "${room.tier}" → "${inferredTier}"` });
    }

    // Schema ID
    const schemaIssueId = `schema-${roomId}`;
    if (!room.schema_id) {
      issues.push({ id: schemaIssueId, file, type: "missing_schema_id", severity: "warning", message: `Missing schema_id`, fix: `Set to "mercy-blade-v1"`, autoFixable: true });
      addFix(roomId, "schema_id", "mercy-blade-v1", schemaIssueId);
      addTask({ room_id: roomId, priority: "low", task_type: "fix_json", description: `Set schema_id to "mercy-blade-v1"` });
    }

    // Domain
    const domainIssueId = `domain-${roomId}`;
    if (!room.domain) {
      const currentTier = room.tier || inferTierFromRoomId(roomId);
      const inferredDomain = inferDomainFromTier(currentTier);
      issues.push({ id: domainIssueId, file, type: "missing_domain", severity: "warning", message: `Missing domain`, fix: `Set to "${inferredDomain}"`, autoFixable: true });
      addFix(roomId, "domain", inferredDomain, domainIssueId);
      addTask({ room_id: roomId, priority: "low", task_type: "fix_json", description: `Set domain to "${inferredDomain}"` });
    }

    // Titles (warning only, not auto-fixable)
    if (!room.title_en) {
      issues.push({ id: `title_en-${roomId}`, file, type: "missing_title_en", severity: "warning", message: `Missing title_en`, autoFixable: false });
      addTask({ room_id: roomId, priority: "high", task_type: "review_content", description: `Add English title`, language: "en" });
    }
    if (!room.title_vi) {
      issues.push({ id: `title_vi-${roomId}`, file, type: "missing_title_vi", severity: "warning", message: `Missing title_vi`, autoFixable: false });
      addTask({ room_id: roomId, priority: "high", task_type: "review_content", description: `Add Vietnamese title`, language: "vi" });
    }

    // --- PHASE 2B: Essay validation ---
    const essayEn = room.room_essay_en?.trim() || "";
    const essayVi = room.room_essay_vi?.trim() || "";

    if (!essayEn) {
      issues.push({ id: `essay_en-${roomId}`, file, type: "missing_room_essay_en", severity: "warning", message: `Missing room_essay_en`, autoFixable: false });
      addTask({ room_id: roomId, priority: "medium", task_type: "rewrite_essay", description: `Write English essay`, language: "en" });
    } else {
      const wc = countWords(essayEn);
      if (wc < 25) {
        issues.push({ id: `essay_short_en-${roomId}`, file, type: "essay_too_short", severity: "warning", message: `room_essay_en has ${wc} words (min 25)`, autoFixable: false });
        addTask({ room_id: roomId, priority: "medium", task_type: "rewrite_essay", description: `Expand English essay (${wc} → 25+ words)`, language: "en" });
      }
      if (wc > 300) {
        issues.push({ id: `essay_long_en-${roomId}`, file, type: "essay_too_long", severity: "warning", message: `room_essay_en has ${wc} words (max 300)`, autoFixable: false });
        addTask({ room_id: roomId, priority: "low", task_type: "rewrite_essay", description: `Trim English essay (${wc} → 300 words)`, language: "en" });
      }
      if (detectPlaceholder(essayEn)) {
        issues.push({ id: `essay_ph_en-${roomId}`, file, type: "essay_placeholder_detected", severity: "error", message: `room_essay_en contains placeholder`, autoFixable: false });
        addTask({ room_id: roomId, priority: "critical", task_type: "rewrite_essay", description: `Remove placeholder from English essay`, language: "en" });
      }
      if (detectCorruptChars(essayEn)) {
        issues.push({ id: `essay_corrupt_en-${roomId}`, file, type: "corrupt_characters_detected", severity: "error", message: `room_essay_en contains corrupt characters`, autoFixable: false });
        addTask({ room_id: roomId, priority: "high", task_type: "fix_json", description: `Fix corrupt characters in English essay`, language: "en" });
      }
    }

    if (!essayVi) {
      issues.push({ id: `essay_vi-${roomId}`, file, type: "missing_room_essay_vi", severity: "warning", message: `Missing room_essay_vi`, autoFixable: false });
      addTask({ room_id: roomId, priority: "medium", task_type: "rewrite_essay", description: `Write Vietnamese essay`, language: "vi" });
    } else {
      const wc = countWords(essayVi);
      if (wc < 25) {
        issues.push({ id: `essay_short_vi-${roomId}`, file, type: "essay_too_short", severity: "warning", message: `room_essay_vi has ${wc} words (min 25)`, autoFixable: false });
        addTask({ room_id: roomId, priority: "medium", task_type: "rewrite_essay", description: `Expand Vietnamese essay (${wc} → 25+ words)`, language: "vi" });
      }
      if (wc > 300) {
        issues.push({ id: `essay_long_vi-${roomId}`, file, type: "essay_too_long", severity: "warning", message: `room_essay_vi has ${wc} words (max 300)`, autoFixable: false });
        addTask({ room_id: roomId, priority: "low", task_type: "rewrite_essay", description: `Trim Vietnamese essay (${wc} → 300 words)`, language: "vi" });
      }
      if (detectPlaceholder(essayVi)) {
        issues.push({ id: `essay_ph_vi-${roomId}`, file, type: "essay_placeholder_detected", severity: "error", message: `room_essay_vi contains placeholder`, autoFixable: false });
        addTask({ room_id: roomId, priority: "critical", task_type: "rewrite_essay", description: `Remove placeholder from Vietnamese essay`, language: "vi" });
      }
      if (detectCorruptChars(essayVi)) {
        issues.push({ id: `essay_corrupt_vi-${roomId}`, file, type: "corrupt_characters_detected", severity: "error", message: `room_essay_vi contains corrupt characters`, autoFixable: false });
        addTask({ room_id: roomId, priority: "high", task_type: "fix_json", description: `Fix corrupt characters in Vietnamese essay`, language: "vi" });
      }
    }

    // --- PHASE 2C: Entries structure validation ---
    const entries = Array.isArray(room.entries) ? (room.entries as any[]) : [];

    if (!Array.isArray(room.entries)) {
      issues.push({ id: `entries-${roomId}`, file, type: "missing_entries", severity: "error", message: `Missing entries array`, autoFixable: false });
      addTask({ room_id: roomId, priority: "critical", task_type: "fix_json", description: `Add entries array` });
      continue;
    }

    if (entries.length === 0) {
      issues.push({ id: `empty-entries-${roomId}`, file, type: "missing_entries", severity: "error", message: `Entries array is empty`, autoFixable: false });
      addTask({ room_id: roomId, priority: "critical", task_type: "fix_json", description: `Add entries to empty room` });
      continue;
    }

    if (entries.length < 2 || entries.length > 8) {
      issues.push({ id: `count-${roomId}`, file, type: "entry_count_info", severity: "info", message: `Has ${entries.length} entries (typical: 2-8)`, autoFixable: false });
    }

    // Malformed entries check (early)
    if (!entries.every((e: any) => typeof e === "object" && e !== null)) {
      issues.push({ id: `malformed-${roomId}`, file, type: "malformed_entries", severity: "error", message: `Entries contains non-object elements`, autoFixable: false });
      addTask({ room_id: roomId, priority: "critical", task_type: "fix_json", description: `Fix malformed entries` });
      continue;
    }

    // Track slugs for duplicates
    const slugs = new Set<string>();
    const allKeywordsInRoom = new Map<string, number[]>();

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i] as Record<string, any>;
      const entrySlug = entry.slug || entry.artifact_id || entry.id || `entry-${i}`;
      const entryPrefix = `${roomId}-e${i}`;

      // Check for unknown keys
      for (const key of Object.keys(entry)) {
        if (!VALID_ENTRY_KEYS.has(key)) {
          issues.push({ id: `unk-${entryPrefix}-${key}`, file, type: "unknown_entry_key", severity: "info", message: `Entry "${entrySlug}" has unknown key "${key}"`, autoFixable: false });
        }
      }

      // Deprecated fields
      for (const key of Object.keys(entry)) {
        if (DEPRECATED_FIELDS.has(key)) {
          issues.push({
            id: `dep-${entryPrefix}-${key}`, file, type: "deprecated_field_present", severity: "info",
            message: `Entry "${entrySlug}" uses deprecated field "${key}"`,
            fix: key === "artifact_id" || key === "identifier" ? "Rename to 'slug'" :
              key === "copy_en" || key === "copy_vi" ? "Use copy: { en, vi } structure" :
              key === "audio_en" || key === "audio_vi" ? "Use 'audio' field only" : undefined,
            autoFixable: false
          });
          addTask({ room_id: roomId, priority: "low", task_type: "fix_json", description: `Replace deprecated field "${key}" in entry "${entrySlug}"` });
        }
      }

      // Slug validation
      const slug = entry.slug || entry.artifact_id || entry.id;
      if (!slug) {
        issues.push({ id: `slug-${entryPrefix}`, file, type: "missing_slug", severity: "warning", message: `Entry ${i} missing identifier`, autoFixable: false });
        addTask({ room_id: roomId, priority: "medium", task_type: "fix_json", description: `Add slug to entry ${i}` });
      } else {
        if (slugs.has(slug)) {
          issues.push({ id: `dup-slug-${entryPrefix}`, file, type: "duplicate_slug", severity: "error", message: `Duplicate slug "${slug}"`, autoFixable: false });
          addTask({ room_id: roomId, priority: "high", task_type: "fix_json", description: `Fix duplicate slug "${slug}"` });
        }
        slugs.add(slug);
        if (!isKebabCase(slug)) {
          issues.push({ id: `slug-fmt-${entryPrefix}`, file, type: "slug_format_info", severity: "info", message: `Slug "${slug}" is not kebab-case`, autoFixable: false });
        }
      }

      // --- PHASE 2D: Keywords validation ---
      const kwEn = entry.keywords_en;
      const kwVi = entry.keywords_vi;

      if (!Array.isArray(kwEn) || kwEn.length === 0) {
        issues.push({ id: `kw_en-${entryPrefix}`, file, type: "entry_keyword_missing_en", severity: "warning", message: `Entry "${entrySlug}" missing keywords_en`, autoFixable: false });
        addTask({ room_id: roomId, priority: "medium", task_type: "fill_keywords", description: `Add English keywords to entry "${entrySlug}"`, language: "en" });
      } else {
        if (kwEn.length < 3) {
          issues.push({ id: `kw_few-${entryPrefix}`, file, type: "entry_keyword_too_few", severity: "info", message: `Entry "${entrySlug}" has ${kwEn.length} keywords (3-5 recommended)`, autoFixable: false });
          addTask({ room_id: roomId, priority: "low", task_type: "fill_keywords", description: `Add more keywords to entry "${entrySlug}" (${kwEn.length} → 3-5)`, language: "en" });
        }
        if (kwEn.length > 5) {
          issues.push({ id: `kw_many-${entryPrefix}`, file, type: "keyword_too_few", severity: "info", message: `Entry "${entrySlug}" has ${kwEn.length} keywords (3-5 recommended)`, autoFixable: false });
        }
        for (const kw of kwEn) {
          if (typeof kw === "string") {
            const kwLower = kw.toLowerCase();
            if (!allKeywordsInRoom.has(kwLower)) allKeywordsInRoom.set(kwLower, []);
            allKeywordsInRoom.get(kwLower)!.push(i);
          }
        }
      }

      if (!Array.isArray(kwVi) || kwVi.length === 0) {
        issues.push({ id: `kw_vi-${entryPrefix}`, file, type: "entry_keyword_missing_vi", severity: "warning", message: `Entry "${entrySlug}" missing keywords_vi`, autoFixable: false });
        addTask({ room_id: roomId, priority: "medium", task_type: "fill_keywords", description: `Add Vietnamese keywords to entry "${entrySlug}"`, language: "vi" });
      }

      // --- PHASE 2E: Copy validation ---
      const copyEn = entry.copy?.en || entry.copy_en;
      const copyVi = entry.copy?.vi || entry.copy_vi;

      // Check copy structure
      if (!entry.copy && (entry.copy_en || entry.copy_vi)) {
        // Using deprecated structure - already flagged above
      } else if (entry.copy && (typeof entry.copy !== "object" || (!entry.copy.en && !entry.copy.vi))) {
        issues.push({ id: `copy_struct-${entryPrefix}`, file, type: "entry_copy_structure_invalid", severity: "error", message: `Entry "${entrySlug}" has invalid copy structure`, autoFixable: false });
        addTask({ room_id: roomId, priority: "high", task_type: "fix_json", description: `Fix copy structure in entry "${entrySlug}"` });
      }

      if (!copyEn) {
        issues.push({ id: `copy_en-${entryPrefix}`, file, type: "missing_copy_en", severity: "error", message: `Entry "${entrySlug}" missing copy.en`, autoFixable: false });
        addTask({ room_id: roomId, priority: "critical", task_type: "review_content", description: `Add English copy to entry "${entrySlug}"`, language: "en" });
      } else {
        const wc = countWords(copyEn);
        if (wc < 30 || wc > 260) {
          issues.push({ id: `wc_en-${entryPrefix}`, file, type: "copy_word_count_extreme", severity: "warning", message: `Entry "${entrySlug}" copy.en has ${wc} words (30-260 range)`, autoFixable: false });
        }
        if (wc > 300) {
          issues.push({ id: `tts_long-${entryPrefix}`, file, type: "tts_length_exceeded", severity: "warning", message: `Entry "${entrySlug}" copy.en has ${wc} words (TTS max 300)`, autoFixable: false });
          addTask({ room_id: roomId, priority: "medium", task_type: "review_content", description: `Trim English copy in entry "${entrySlug}" (${wc} → 300 words)`, language: "en" });
        }
        const tts = detectTtsUnsafe(copyEn);
        if (tts.unsafe) {
          issues.push({ id: `tts_en-${entryPrefix}`, file, type: "tts_unstable_text", severity: "warning", message: `Entry "${entrySlug}" TTS-unsafe: ${tts.reasons.join(", ")}`, autoFixable: false });
          addTask({ room_id: roomId, priority: "medium", task_type: "fix_json", description: `Fix TTS-unsafe text in entry "${entrySlug}": ${tts.reasons.join(", ")}`, language: "en" });
        }
        if (detectPlaceholder(copyEn)) {
          issues.push({ id: `ph_en-${entryPrefix}`, file, type: "copy_placeholder_detected", severity: "error", message: `Entry "${entrySlug}" copy.en contains placeholder`, autoFixable: false });
          addTask({ room_id: roomId, priority: "critical", task_type: "review_content", description: `Remove placeholder from English copy in entry "${entrySlug}"`, language: "en" });
        }
        if (detectCorruptChars(copyEn)) {
          issues.push({ id: `corrupt_en-${entryPrefix}`, file, type: "corrupt_characters_detected", severity: "error", message: `Entry "${entrySlug}" copy.en has corrupt characters`, autoFixable: false });
          addTask({ room_id: roomId, priority: "high", task_type: "fix_json", description: `Fix corrupt characters in entry "${entrySlug}"`, language: "en" });
        }
      }

      if (!copyVi) {
        issues.push({ id: `copy_vi-${entryPrefix}`, file, type: "missing_copy_vi", severity: "error", message: `Entry "${entrySlug}" missing copy.vi`, autoFixable: false });
        addTask({ room_id: roomId, priority: "critical", task_type: "review_content", description: `Add Vietnamese copy to entry "${entrySlug}"`, language: "vi" });
      } else {
        const wc = countWords(copyVi);
        if (wc < 30 || wc > 260) {
          issues.push({ id: `wc_vi-${entryPrefix}`, file, type: "copy_word_count_extreme", severity: "warning", message: `Entry "${entrySlug}" copy.vi has ${wc} words`, autoFixable: false });
        }
        if (wc > 300) {
          issues.push({ id: `tts_long_vi-${entryPrefix}`, file, type: "tts_length_exceeded", severity: "warning", message: `Entry "${entrySlug}" copy.vi TTS too long`, autoFixable: false });
        }
        const tts = detectTtsUnsafe(copyVi);
        if (tts.unsafe) {
          issues.push({ id: `tts_vi-${entryPrefix}`, file, type: "tts_unstable_text", severity: "warning", message: `Entry "${entrySlug}" TTS-unsafe: ${tts.reasons.join(", ")}`, autoFixable: false });
        }
        if (detectPlaceholder(copyVi)) {
          issues.push({ id: `ph_vi-${entryPrefix}`, file, type: "copy_placeholder_detected", severity: "error", message: `Entry "${entrySlug}" copy.vi contains placeholder`, autoFixable: false });
        }
        if (detectCorruptChars(copyVi)) {
          issues.push({ id: `corrupt_vi-${entryPrefix}`, file, type: "corrupt_characters_detected", severity: "error", message: `Entry "${entrySlug}" copy.vi has corrupt characters`, autoFixable: false });
        }
      }

      // --- PHASE 2F: Entry audio validation ---
      totalAudioSlots++;
      const audio = entry.audio || entry.audio_en;
      
      if (!audio || (typeof audio === "string" && audio.trim() === "")) {
        entriesMissingAudio++;
        issues.push({ id: `audio-${entryPrefix}`, file, type: "missing_audio_field", severity: "error", message: `Entry "${entrySlug}" missing audio`, fix: "Generate TTS", autoFixable: false });
        
        // Generate audio job if we have copy text
        if (copyEn) {
          const suggestedFilename = `${roomId}_${entrySlug}_en.mp3`.replace(/[^a-z0-9_.-]/gi, "_");
          addAudioJob({ room_id: roomId, entry_slug: entrySlug, field: "content", lang: "en", text: copyEn.slice(0, 4000), filename: suggestedFilename });
          addTask({ room_id: roomId, priority: "high", task_type: "fix_audio", description: `Generate TTS for entry "${entrySlug}"`, suggested_filename: suggestedFilename, language: "en" });
        }
      } else if (typeof audio === "string") {
        const trimmed = audio.trim().replace(/^\/+/, ""); // Remove leading slashes
        const basename = trimmed.split("/").pop() || trimmed;
        referencedAudioBasenames.add(basename);
        totalAudioPresent++;

        // Validate filename pattern (optional info)
        const expectedPattern = /^[a-z0-9_-]+\.(mp3|wav|m4a)$/i;
        if (!expectedPattern.test(basename)) {
          issues.push({ id: `audio-fmt-${entryPrefix}`, file, type: "general_info", severity: "info", message: `Entry "${entrySlug}" audio filename "${basename}" has non-standard format`, autoFixable: false });
        }

        if (checkFiles) {
          const existsByKey = audioIndex.allKeys.has(trimmed);
          const existsByBasename = audioIndex.basenames.has(basename);
          if (!existsByKey && !existsByBasename) {
            issues.push({ id: `audio-file-${entryPrefix}`, file, type: "missing_audio_file", severity: "error", message: `Entry "${entrySlug}" audio "${basename}" not in storage`, fix: "Generate TTS and upload", autoFixable: false });
            
            // Generate audio job
            if (copyEn) {
              addAudioJob({ room_id: roomId, entry_slug: entrySlug, field: "content", lang: "en", text: copyEn.slice(0, 4000), filename: basename });
              addTask({ room_id: roomId, priority: "high", task_type: "fix_audio", description: `Upload or generate "${basename}"`, suggested_filename: basename, language: "en" });
            }
          }
        }
      }
    }

    // Duplicate keywords across entries
    for (const [keyword, indices] of allKeywordsInRoom.entries()) {
      if (indices.length > 1) {
        issues.push({ id: `kw_dup-${roomId}-${keyword.slice(0, 20)}`, file, type: "entry_keyword_duplicate_across_room", severity: "info", message: `Keyword "${keyword}" in ${indices.length} entries`, autoFixable: false });
      }
    }

    // Room keywords auto-fix
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
        issues.push({ id: kwIssueId, file, type: "missing_room_keywords", severity: "warning", message: `Missing room keywords`, fix: `Extract ${keywordSet.size} keywords`, autoFixable: true });
        addFix(roomId, "keywords", Array.from(keywordSet), kwIssueId);
        addTask({ room_id: roomId, priority: "low", task_type: "fill_keywords", description: `Merge ${keywordSet.size} entry keywords to room level` });
      }
    }

    // --- PHASE 2G: Intro audio validation ---
    const hasIntroEn = !!essayEn;
    const hasIntroVi = !!essayVi;
    const introEnName = `${roomId}_intro_en.mp3`;
    const introViName = `${roomId}_intro_vi.mp3`;

    if (hasIntroEn) {
      referencedAudioBasenames.add(introEnName);
      const exists = checkFiles ? audioIndex.basenames.has(introEnName) : true;
      if (exists) {
        roomsWithIntroEn++;
      } else {
        roomsMissingIntroEn++;
        issues.push({ id: `intro-en-${roomId}`, file, type: "missing_intro_audio_en", severity: "warning", message: `Missing intro audio "${introEnName}"`, fix: `Generate TTS for room_essay_en`, autoFixable: false });
        addAudioJob({ room_id: roomId, field: "intro", lang: "en", text: essayEn.slice(0, 4000), filename: introEnName });
        addTask({ room_id: roomId, priority: "medium", task_type: "create_intro_audio", description: `Generate English intro audio`, suggested_filename: introEnName, language: "en" });
      }
    }

    if (hasIntroVi) {
      referencedAudioBasenames.add(introViName);
      const exists = checkFiles ? audioIndex.basenames.has(introViName) : true;
      if (exists) {
        roomsWithIntroVi++;
      } else {
        roomsMissingIntroVi++;
        issues.push({ id: `intro-vi-${roomId}`, file, type: "missing_intro_audio_vi", severity: "warning", message: `Missing intro audio "${introViName}"`, fix: `Generate TTS for room_essay_vi`, autoFixable: false });
        addAudioJob({ room_id: roomId, field: "intro", lang: "vi", text: essayVi.slice(0, 4000), filename: introViName });
        addTask({ room_id: roomId, priority: "medium", task_type: "create_intro_audio", description: `Generate Vietnamese intro audio`, suggested_filename: introViName, language: "vi" });
      }
    }

    // --- PHASE 2H: Content safety validation ---
    const roomTextParts: string[] = [];
    if (room.room_essay_en) roomTextParts.push(String(room.room_essay_en));
    if (room.room_essay_vi) roomTextParts.push(String(room.room_essay_vi));
    if (room.title_en) roomTextParts.push(String(room.title_en));
    if (room.title_vi) roomTextParts.push(String(room.title_vi));
    for (const e of entries as any[]) {
      const cEn = e.copy?.en ?? e.copy_en;
      const cVi = e.copy?.vi ?? e.copy_vi;
      if (cEn) roomTextParts.push(String(cEn));
      if (cVi) roomTextParts.push(String(cVi));
    }
    const allText = roomTextParts.join("\n").toLowerCase();

    const crisis = detectCrisis(allText);
    const medical = detectMedical(allText);
    const emergency = detectEmergency(allText);

    if (crisis.found) {
      issues.push({ id: `crisis-${roomId}`, file, type: "crisis_content", severity: "error", message: `Crisis content: ${crisis.patterns.join(", ")}`, autoFixable: false });
      addTask({ room_id: roomId, priority: "critical", task_type: "review_content", description: `Review crisis content patterns` });
    }
    if (medical.found) {
      issues.push({ id: `medical-${roomId}`, file, type: "medical_claims", severity: "warning", message: `Medical claims: ${medical.patterns.join(", ")}`, autoFixable: false });
      addTask({ room_id: roomId, priority: "high", task_type: "review_content", description: `Review medical claims` });
    }
    if (emergency.found) {
      issues.push({ id: `emergency-${roomId}`, file, type: "emergency_phrasing", severity: "warning", message: `Emergency phrasing detected - ensure proper framing`, autoFixable: false });
    }

    // Kids crisis blocker
    const effectiveTier = room.tier || inferTierFromRoomId(roomId);
    if (effectiveTier.toLowerCase().includes("kids") && crisis.found) {
      issues.push({ id: `kids-crisis-${roomId}`, file, type: "kids_crisis_blocker", severity: "error", message: `Kids room contains crisis content - must be removed`, autoFixable: false });
      addTask({ room_id: roomId, priority: "critical", task_type: "review_content", description: `URGENT: Remove crisis content from Kids room` });
    }
  }

  log(`Phase 2 complete: Scanned ${scannedRooms} rooms`);

  // =========================================================================
  // PHASE 3: Orphan audio detection
  // =========================================================================
  const orphanBasenames: string[] = [];
  if (checkFiles) {
    log("Phase 3: Detecting orphan audio files...");
    for (const fullKey of audioIndex.allKeys) {
      const basename = fullKey.split("/").pop() || fullKey;
      if (!referencedAudioBasenames.has(basename)) {
        orphanBasenames.push(fullKey);
      }
    }

    if (orphanBasenames.length > 0) {
      // Group by prefix for cleaner reporting
      const groups = new Map<string, string[]>();
      for (const path of orphanBasenames) {
        const parts = path.split("/");
        const prefix = parts.length > 1 ? parts.slice(0, -1).join("/") : "(root)";
        if (!groups.has(prefix)) groups.set(prefix, []);
        groups.get(prefix)!.push(path);
      }

      issues.push({
        id: "orphan-audio",
        file: "(storage)",
        type: "orphan_audio_files",
        severity: "info",
        message: `${orphanBasenames.length} orphan audio files in ${groups.size} folders`,
        fix: "Review and delete unused files",
        autoFixable: false,
        orphanList: orphanBasenames.slice(0, 200),
        context: { groupCount: groups.size, totalFiles: orphanBasenames.length },
      });

      // Create delete tasks for orphans (grouped)
      for (const [prefix, files] of groups.entries()) {
        addTask({ room_id: `orphans_${prefix}`, priority: "low", task_type: "delete_orphan", description: `Review ${files.length} orphan files in ${prefix}` });
      }
    }

    log(`Orphan detection complete: ${orphanBasenames.length} orphan files`);
  }

  // =========================================================================
  // PHASE 4: Apply fixes (repair mode only)
  // =========================================================================
  if (mode === "repair" && roomFixes.size > 0) {
    log("Phase 4: Applying safe fixes...");

    for (const [roomId, fixes] of roomFixes.entries()) {
      const { error } = await supabase.from("rooms").update(fixes).eq("id", roomId);

      if (!error) {
        fixesApplied += Object.keys(fixes).length;
        log(`Fixed ${Object.keys(fixes).join(", ")} for ${roomId}`);
      } else {
        log(`Failed to fix ${roomId}: ${error.message}`);
        for (const key of Object.keys(fixes)) {
          const issueId = key === "tier" ? `tier-${roomId}` : key === "schema_id" ? `schema-${roomId}` : key === "domain" ? `domain-${roomId}` : `kw-${roomId}`;
          fixedIssueIds.delete(issueId);
        }
      }
    }

    log(`Repairs complete: ${fixesApplied} fixes applied`);
  }

  // Filter out fixed issues
  const finalIssues = mode === "repair"
    ? issues.filter(issue => !fixedIssueIds.has(issue.id))
    : issues;

  const errors = finalIssues.filter(i => i.severity === "error").length;
  const warnings = finalIssues.filter(i => i.severity === "warning").length;
  const infos = finalIssues.filter(i => i.severity === "info").length;

  const durationMs = Math.round(performance.now() - startTime);

  const summary: AuditSummary = {
    totalRooms,
    scannedRooms,
    errors,
    warnings,
    infos,
    fixed: fixesApplied,
    audioFilesInBucket: audioIndex.allKeys.size,
    audioBasenamesInBucket: audioIndex.basenames.size,
    orphanAudioCount: orphanBasenames.length,
    orphanAudioFiles: orphanBasenames.length,
    referencedAudioFiles: referencedAudioBasenames.size,
    totalAudioSlots,
    totalAudioPresent,
    totalAudioMissing: entriesMissingAudio,
    entriesMissingAudio,
    audioCoveragePercent: totalAudioSlots > 0 ? Math.round((totalAudioPresent / totalAudioSlots) * 100) : 100,
    roomsWithIntroEn,
    roomsWithIntroVi,
    roomsMissingIntroEn,
    roomsMissingIntroVi,
    roomsWithFullIntroAudio: Math.min(roomsWithIntroEn, roomsWithIntroVi),
    tasksGenerated: tasks.length,
    audioJobsGenerated: audioJobs.length,
    durationMs,
  };

  log(`=== Safe Shield V5 Audit Complete ===`);
  log(`Duration: ${durationMs}ms | Errors: ${errors} | Warnings: ${warnings} | Infos: ${infos}`);
  log(`Tasks: ${tasks.length} | Audio Jobs: ${audioJobs.length} | Fixes: ${fixesApplied}`);

  return { issues: finalIssues, tasks, audioJobs, summary, fixesApplied, logs };
}

// ============================================================================
// HTTP HANDLER
// ============================================================================

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

    // Support both "scan" and legacy modes
    let effectiveMode: AuditMode = "scan";
    if (body.mode === "repair") effectiveMode = "repair";
    else if (body.mode === "dry-run") effectiveMode = "dry-run";

    const options: AuditRequestOptions = {
      mode: effectiveMode,
      limit: body.limit ? parseInt(body.limit, 10) : undefined,
      roomIdPrefix: body.roomIdPrefix || undefined,
      checkFiles: body.checkFiles !== false,
    };

    const result = await runSafeShieldAudit(options);

    const response: AuditResponse = {
      ok: true,
      mode: options.mode,
      stats: result.summary,
      summary: result.summary,
      issues: result.issues,
      tasks: result.tasks,
      audioJobs: result.audioJobs,
      fixesApplied: result.fixesApplied,
      fixed: result.fixesApplied,
      logs: result.logs,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[SafeShield] Error:", err);
    const errorResponse: Partial<AuditResponse> = {
      ok: false,
      mode: "scan",
      error: err instanceof Error ? err.message : String(err),
      stats: {
        totalRooms: 0, scannedRooms: 0, errors: 1, warnings: 0, infos: 0, fixed: 0,
        audioFilesInBucket: 0, audioBasenamesInBucket: 0, orphanAudioCount: 0, orphanAudioFiles: 0,
        referencedAudioFiles: 0, totalAudioSlots: 0, totalAudioPresent: 0, totalAudioMissing: 0,
        entriesMissingAudio: 0, audioCoveragePercent: 0, roomsWithIntroEn: 0, roomsWithIntroVi: 0,
        roomsMissingIntroEn: 0, roomsMissingIntroVi: 0, roomsWithFullIntroAudio: 0,
        tasksGenerated: 0, audioJobsGenerated: 0, durationMs: 0,
      },
      summary: {
        totalRooms: 0, scannedRooms: 0, errors: 1, warnings: 0, infos: 0, fixed: 0,
        audioFilesInBucket: 0, audioBasenamesInBucket: 0, orphanAudioCount: 0, orphanAudioFiles: 0,
        referencedAudioFiles: 0, totalAudioSlots: 0, totalAudioPresent: 0, totalAudioMissing: 0,
        entriesMissingAudio: 0, audioCoveragePercent: 0, roomsWithIntroEn: 0, roomsWithIntroVi: 0,
        roomsMissingIntroEn: 0, roomsMissingIntroVi: 0, roomsWithFullIntroAudio: 0,
        tasksGenerated: 0, audioJobsGenerated: 0, durationMs: 0,
      },
      issues: [],
      tasks: [],
      audioJobs: [],
      fixesApplied: 0,
      fixed: 0,
      logs: [`Error: ${err instanceof Error ? err.message : String(err)}`],
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
