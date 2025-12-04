// supabase/functions/audit-v4-safe-shield/index.ts
// Full System Sync Auditor - Safe Shield V5.2
// NON-DESTRUCTIVE: Only detects issues and generates fix tasks + audio jobs
// NO DATABASE WRITES - read-only audit mode
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
// TYPES
// ============================================================================

const AUDIO_BUCKET = "audio";

type AuditMode = "dry-run" | "scan";
type AuditSeverity = "error" | "warning" | "info";
type TaskType = "generate_tts" | "generate_entry_tts" | "generate_intro_tts" | "fix_json" | "fix_audio" | "fill_keywords" | "rewrite_essay" | "review_content" | "delete_orphan";
type TaskPriority = "low" | "medium" | "high" | "critical";

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

interface TTSTask {
  taskId: string;
  taskType: "generate_tts" | "generate_entry_tts" | "generate_intro_tts";
  roomId: string;
  entrySlug: string | null;
  language: "en" | "vi";
  filename: string;
  text: string;
}

interface AuditTaskSuggestion {
  room_id: string;
  entry_slug?: string;
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

interface AudioFileStats {
  referenced: number;
  present: number;
  missing: number;
  coverage: number;
  missingFiles: string[];
}

interface IntroStats {
  withIntroEn: number;
  missingIntroEn: number;
  withIntroVi: number;
  missingIntroVi: number;
}

interface StorageScanResult {
  ok: boolean;
  error?: string;
  fileCount: number;
  filesInBucket: number;
  basenamesInBucket: number;
}

interface AuditSummary {
  totalRooms: number;
  totalEntries: number;
  scannedRooms: number;
  errors: number;
  warnings: number;
  infos: number;
  fixed: number;
  audio: AudioFileStats;
  intro: IntroStats;
  storageScan: StorageScanResult;
  orphanAudioCount: number;
  referencedAudioCount: number;
  // Legacy fields for backward compatibility
  audioFilesInBucket: number;
  audioBasenamesInBucket: number;
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
  tasks: TTSTask[];
  legacyTasks: AuditTaskSuggestion[];
  audioJobs: AudioJob[];
  orphanFiles: string[];
  fixesApplied: number;
  fixed: number;
  logs: string[];
  storageScan: StorageScanResult;
  audioFileStats: AudioFileStats;
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
  // Intro audio fields (canonical schema)
  room_intro_en?: string | null;
  room_intro_vi?: string | null;
  room_intro_audio_en?: string | null;
  room_intro_audio_vi?: string | null;
};

// ============================================================================
// CANONICAL TIERS
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

const VALID_ENTRY_KEYS = new Set([
  "slug", "artifact_id", "id", "identifier",
  "keywords_en", "keywords_vi",
  "copy", "copy_en", "copy_vi",
  "tags", "audio", "audio_en", "audio_vi",
  "severity_level", "title", "title_en", "title_vi",
]);

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
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/,
  /\uFFFD/,
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

function toSafeFilename(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9_-]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
}

/**
 * Normalize audio filename for consistent comparison:
 * - lowercase
 * - remove leading /audio/ or audio/
 * - remove querystrings
 * - convert spaces to underscores
 * - ensure .mp3 extension
 */
function normalizeAudioFilename(filename: string): string {
  if (!filename || typeof filename !== "string") return "";
  
  let normalized = filename.trim().toLowerCase();
  
  // Remove leading paths like /audio/, audio/, /
  normalized = normalized.replace(/^\/?(audio\/)?/, "");
  
  // Remove querystrings
  const qIndex = normalized.indexOf("?");
  if (qIndex > -1) normalized = normalized.slice(0, qIndex);
  
  // Convert spaces to underscores
  normalized = normalized.replace(/\s+/g, "_");
  
  // Ensure .mp3 extension
  if (!normalized.endsWith(".mp3")) {
    normalized = normalized.replace(/\.[^.]+$/, "") + ".mp3";
  }
  
  return normalized;
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

// ============================================================================
// AUDIO INDEX BUILDER - with pagination (handles 4000+ files)
// ============================================================================

async function buildAudioIndex(log: (msg: string) => void): Promise<{ index: AudioIndex; scanResult: StorageScanResult }> {
  const allKeys: string[] = [];
  let scanError: string | undefined;
  let scanOk = true;

  async function listFolderRecursive(path: string): Promise<void> {
    const BATCH_SIZE = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      try {
        const { data, error } = await supabase.storage
          .from(AUDIO_BUCKET)
          .list(path, { limit: BATCH_SIZE, offset });

        if (error) {
          scanOk = false;
          scanError = `Storage list error at ${path}: ${error.message}`;
          log(`ERROR: ${scanError}`);
          return;
        }

        if (!data || data.length === 0) {
          hasMore = false;
          break;
        }

        for (const obj of data) {
          if (!obj.name) continue;
          const fullPath = path ? `${path}/${obj.name}` : obj.name;
          
          // If metadata is null, it's a folder - recurse into it
          if (obj.metadata === null) {
            await listFolderRecursive(fullPath);
          } else {
            allKeys.push(fullPath);
          }
        }

        if (data.length < BATCH_SIZE) {
          hasMore = false;
        } else {
          offset += BATCH_SIZE;
        }
      } catch (err) {
        scanOk = false;
        scanError = `Exception listing ${path}: ${err}`;
        log(`ERROR: ${scanError}`);
        return;
      }
    }
  }

  try {
    log("Starting storage scan with pagination...");
    await listFolderRecursive("");
    log(`Storage scan complete: found ${allKeys.length} files`);
  } catch (err) {
    scanOk = false;
    scanError = `Failed to build audio index: ${err}`;
    log(`ERROR: ${scanError}`);
  }

  // Build basename index for fast lookup
  const basenames = new Set<string>();
  for (const key of allKeys) {
    const basename = (key.split("/").pop() || key).toLowerCase();
    basenames.add(basename);
  }

  const index: AudioIndex = {
    allKeys: new Set(allKeys),
    basenames,
  };

  const scanResult: StorageScanResult = {
    ok: scanOk,
    error: scanError,
    fileCount: allKeys.length,
    filesInBucket: allKeys.length,
    basenamesInBucket: basenames.size,
  };

  return { index, scanResult };
}

// ============================================================================
// MAIN AUDIT FUNCTION - V5.2 (Read-Only, Real Storage Check)
// ============================================================================

async function runSafeShieldAudit(options: AuditRequestOptions): Promise<{
  issues: AuditIssue[];
  tasks: TTSTask[];
  legacyTasks: AuditTaskSuggestion[];
  audioJobs: AudioJob[];
  orphanFiles: string[];
  summary: AuditSummary;
  logs: string[];
  storageScan: StorageScanResult;
  audioFileStats: AudioFileStats;
}> {
  const startTime = performance.now();
  const { limit, roomIdPrefix, checkFiles = true } = options;

  const logs: string[] = [];
  const issues: AuditIssue[] = [];
  const tasks: TTSTask[] = [];
  const legacyTasks: AuditTaskSuggestion[] = [];
  const audioJobs: AudioJob[] = [];
  let taskIdCounter = 0;

  const log = (msg: string) => {
    const timestamp = new Date().toISOString().split("T")[1].slice(0, 12);
    const line = `[${timestamp}] ${msg}`;
    logs.push(line);
    console.log(`[SafeShield] ${msg}`);
  };

  log(`=== Safe Shield V5.2 Audit Started (READ-ONLY) ===`);
  log(`Options: limit=${limit || "all"}, prefix=${roomIdPrefix || "none"}, checkFiles=${checkFiles}`);

  // =========================================================================
  // PHASE 0: Build audio index from storage
  // =========================================================================
  let audioIndex: AudioIndex = { allKeys: new Set(), basenames: new Set() };
  let storageScan: StorageScanResult = { ok: false, error: "Not scanned", fileCount: 0, filesInBucket: 0, basenamesInBucket: 0 };
  
  if (checkFiles) {
    log("Phase 0: Building audio index from Supabase storage...");
    const result = await buildAudioIndex(log);
    audioIndex = result.index;
    storageScan = result.scanResult;
    
    if (storageScan.ok) {
      log(`Audio index ready: ${storageScan.fileCount} files, ${storageScan.basenamesInBucket} unique basenames`);
    } else {
      log(`WARNING: Storage scan failed - ${storageScan.error}`);
    }
  } else {
    log("Phase 0: Skipping storage scan (checkFiles=false)");
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

  // Tracking sets for audio comparison
  const seenIds = new Set<string>();
  const referencedAudioFilenames = new Set<string>();
  const missingAudioFiles: string[] = [];

  // Metrics
  let scannedRooms = 0;
  let totalEntries = 0;
  let totalAudioSlots = 0;
  let totalAudioPresent = 0;
  let entriesMissingAudio = 0;
  let roomsWithIntroEn = 0;
  let roomsWithIntroVi = 0;
  let roomsMissingIntroEn = 0;
  let roomsMissingIntroVi = 0;

  // Add TTS task
  const addTask = (
    roomId: string,
    entrySlug: string | null,
    lang: "en" | "vi",
    filename: string,
    text: string,
    taskType: "generate_entry_tts" | "generate_intro_tts"
  ) => {
    tasks.push({
      taskId: `tts_${++taskIdCounter}`,
      taskType,
      roomId,
      entrySlug,
      language: lang,
      filename,
      text: text.slice(0, 4000), // Limit for TTS
    });
  };

  // Add legacy task (backward compatibility)
  const addLegacyTask = (task: AuditTaskSuggestion) => {
    legacyTasks.push(task);
  };

  const addAudioJob = (job: AudioJob) => {
    audioJobs.push(job);
  };

  // Check if audio file exists in storage
  const audioFileExists = (filename: string): boolean => {
    if (!storageScan.ok) return true; // Can't verify, assume exists
    const normalized = normalizeAudioFilename(filename);
    return audioIndex.basenames.has(normalized);
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
    
    if (seenIds.has(roomId)) {
      issues.push({ id: `dup-${roomId}`, file, type: "duplicate_room", severity: "error", message: `Duplicate room id: ${roomId}`, autoFixable: false });
      continue;
    }
    seenIds.add(roomId);

    // Tier validation
    if (!room.tier) {
      const inferredTier = inferTierFromRoomId(roomId);
      issues.push({ id: `tier-${roomId}`, file, type: "missing_tier", severity: "warning", message: `Missing tier`, fix: `Should be "${inferredTier}"`, autoFixable: false });
      addLegacyTask({ room_id: roomId, priority: "medium", task_type: "fix_json", description: `Set tier to "${inferredTier}"` });
    } else if (!isCanonicalTier(room.tier)) {
      const inferredTier = inferTierFromRoomId(roomId);
      issues.push({ id: `tier-${roomId}`, file, type: "invalid_tier", severity: "warning", message: `Invalid tier: "${room.tier}"`, fix: `Should be "${inferredTier}"`, autoFixable: false });
      addLegacyTask({ room_id: roomId, priority: "medium", task_type: "fix_json", description: `Fix invalid tier "${room.tier}" → "${inferredTier}"` });
    }

    // Schema ID
    if (!room.schema_id) {
      issues.push({ id: `schema-${roomId}`, file, type: "missing_schema_id", severity: "warning", message: `Missing schema_id`, fix: `Should be "mercy-blade-v1"`, autoFixable: false });
      addLegacyTask({ room_id: roomId, priority: "low", task_type: "fix_json", description: `Set schema_id to "mercy-blade-v1"` });
    }

    // Domain
    if (!room.domain) {
      const currentTier = room.tier || inferTierFromRoomId(roomId);
      const inferredDomain = inferDomainFromTier(currentTier);
      issues.push({ id: `domain-${roomId}`, file, type: "missing_domain", severity: "warning", message: `Missing domain`, fix: `Should be "${inferredDomain}"`, autoFixable: false });
      addLegacyTask({ room_id: roomId, priority: "low", task_type: "fix_json", description: `Set domain to "${inferredDomain}"` });
    }

    // Titles
    if (!room.title_en) {
      issues.push({ id: `title_en-${roomId}`, file, type: "missing_title_en", severity: "warning", message: `Missing title_en`, autoFixable: false });
      addLegacyTask({ room_id: roomId, priority: "high", task_type: "review_content", description: `Add English title`, language: "en" });
    }
    if (!room.title_vi) {
      issues.push({ id: `title_vi-${roomId}`, file, type: "missing_title_vi", severity: "warning", message: `Missing title_vi`, autoFixable: false });
      addLegacyTask({ room_id: roomId, priority: "high", task_type: "review_content", description: `Add Vietnamese title`, language: "vi" });
    }

    // --- PHASE 2B: Essay validation ---
    const essayEn = room.room_essay_en?.trim() || "";
    const essayVi = room.room_essay_vi?.trim() || "";

    if (!essayEn) {
      issues.push({ id: `essay_en-${roomId}`, file, type: "missing_room_essay_en", severity: "warning", message: `Missing room_essay_en`, autoFixable: false });
      addLegacyTask({ room_id: roomId, priority: "medium", task_type: "rewrite_essay", description: `Write English essay`, language: "en" });
    } else {
      const wc = countWords(essayEn);
      if (wc < 25) {
        issues.push({ id: `essay_short_en-${roomId}`, file, type: "essay_too_short", severity: "warning", message: `room_essay_en has ${wc} words (min 25)`, autoFixable: false });
      }
      if (wc > 300) {
        issues.push({ id: `essay_long_en-${roomId}`, file, type: "essay_too_long", severity: "warning", message: `room_essay_en has ${wc} words (max 300)`, autoFixable: false });
      }
      if (detectPlaceholder(essayEn)) {
        issues.push({ id: `essay_ph_en-${roomId}`, file, type: "essay_placeholder_detected", severity: "error", message: `room_essay_en contains placeholder`, autoFixable: false });
      }
      if (detectCorruptChars(essayEn)) {
        issues.push({ id: `essay_corrupt_en-${roomId}`, file, type: "corrupt_characters_detected", severity: "error", message: `room_essay_en contains corrupt characters`, autoFixable: false });
      }
    }

    if (!essayVi) {
      issues.push({ id: `essay_vi-${roomId}`, file, type: "missing_room_essay_vi", severity: "warning", message: `Missing room_essay_vi`, autoFixable: false });
      addLegacyTask({ room_id: roomId, priority: "medium", task_type: "rewrite_essay", description: `Write Vietnamese essay`, language: "vi" });
    } else {
      const wc = countWords(essayVi);
      if (wc < 25) {
        issues.push({ id: `essay_short_vi-${roomId}`, file, type: "essay_too_short", severity: "warning", message: `room_essay_vi has ${wc} words (min 25)`, autoFixable: false });
      }
      if (wc > 300) {
        issues.push({ id: `essay_long_vi-${roomId}`, file, type: "essay_too_long", severity: "warning", message: `room_essay_vi has ${wc} words (max 300)`, autoFixable: false });
      }
      if (detectPlaceholder(essayVi)) {
        issues.push({ id: `essay_ph_vi-${roomId}`, file, type: "essay_placeholder_detected", severity: "error", message: `room_essay_vi contains placeholder`, autoFixable: false });
      }
      if (detectCorruptChars(essayVi)) {
        issues.push({ id: `essay_corrupt_vi-${roomId}`, file, type: "corrupt_characters_detected", severity: "error", message: `room_essay_vi contains corrupt characters`, autoFixable: false });
      }
    }

    // --- PHASE 2C: Intro audio validation (canonical schema) ---
    // Use room_intro_en/vi if available, otherwise fall back to essay
    const introTextEn = (room as any).room_intro_en?.trim() || essayEn;
    const introTextVi = (room as any).room_intro_vi?.trim() || essayVi;
    
    // Check for existing intro audio fields or generate canonical filenames
    const introAudioEnField = (room as any).room_intro_audio_en?.trim() || "";
    const introAudioViField = (room as any).room_intro_audio_vi?.trim() || "";
    const introAudioEnFilename = introAudioEnField || `${roomId}_intro_en.mp3`;
    const introAudioViFilename = introAudioViField || `${roomId}_intro_vi.mp3`;

    // EN intro audio check - only if room has intro text
    if (introTextEn) {
      const normalizedFilename = normalizeAudioFilename(introAudioEnFilename);
      referencedAudioFilenames.add(normalizedFilename);
      
      const exists = checkFiles ? audioFileExists(normalizedFilename) : true;
      if (exists) {
        roomsWithIntroEn++;
      } else {
        roomsMissingIntroEn++;
        missingAudioFiles.push(normalizedFilename);
        issues.push({ 
          id: `intro-en-${roomId}`, 
          file, 
          type: "missing_intro_audio_en", 
          severity: "warning", 
          message: `Room has intro text but missing EN audio "${normalizedFilename}"`, 
          fix: `Generate TTS for room intro`, 
          autoFixable: false 
        });
        addAudioJob({ room_id: roomId, field: "intro", lang: "en", text: introTextEn.slice(0, 4000), filename: normalizedFilename });
        addTask(roomId, null, "en", normalizedFilename, introTextEn, "generate_intro_tts");
      }
    }

    // VI intro audio check - only if room has intro text
    if (introTextVi) {
      const normalizedFilename = normalizeAudioFilename(introAudioViFilename);
      referencedAudioFilenames.add(normalizedFilename);
      
      const exists = checkFiles ? audioFileExists(normalizedFilename) : true;
      if (exists) {
        roomsWithIntroVi++;
      } else {
        roomsMissingIntroVi++;
        missingAudioFiles.push(normalizedFilename);
        issues.push({ 
          id: `intro-vi-${roomId}`, 
          file, 
          type: "missing_intro_audio_vi", 
          severity: "warning", 
          message: `Room has intro text but missing VI audio "${normalizedFilename}"`, 
          fix: `Generate TTS for room intro`, 
          autoFixable: false 
        });
        addAudioJob({ room_id: roomId, field: "intro", lang: "vi", text: introTextVi.slice(0, 4000), filename: normalizedFilename });
        addTask(roomId, null, "vi", normalizedFilename, introTextVi, "generate_intro_tts");
      }
    }

    // --- PHASE 2D: Entries structure validation ---
    const entries = Array.isArray(room.entries) ? (room.entries as any[]) : [];
    totalEntries += entries.length;

    if (!Array.isArray(room.entries)) {
      issues.push({ id: `entries-${roomId}`, file, type: "missing_entries", severity: "error", message: `Missing entries array`, autoFixable: false });
      addLegacyTask({ room_id: roomId, priority: "critical", task_type: "fix_json", description: `Add entries array` });
      continue;
    }

    if (entries.length === 0) {
      issues.push({ id: `empty-entries-${roomId}`, file, type: "missing_entries", severity: "error", message: `Entries array is empty`, autoFixable: false });
      addLegacyTask({ room_id: roomId, priority: "critical", task_type: "fix_json", description: `Add entries to empty room` });
      continue;
    }

    if (entries.length < 2 || entries.length > 8) {
      issues.push({ id: `count-${roomId}`, file, type: "entry_count_info", severity: "info", message: `Has ${entries.length} entries (typical: 2-8)`, autoFixable: false });
    }

    if (!entries.every((e: any) => typeof e === "object" && e !== null)) {
      issues.push({ id: `malformed-${roomId}`, file, type: "malformed_entries", severity: "error", message: `Entries contains non-object elements`, autoFixable: false });
      addLegacyTask({ room_id: roomId, priority: "critical", task_type: "fix_json", description: `Fix malformed entries` });
      continue;
    }

    const slugs = new Set<string>();
    const allKeywordsInRoom = new Map<string, number[]>();

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i] as Record<string, any>;
      const entrySlug = entry.slug || entry.artifact_id || entry.id || `entry-${i}`;
      const entryPrefix = `${roomId}-e${i}`;

      // Unknown keys
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
            autoFixable: false
          });
        }
      }

      // Slug validation
      const slug = entry.slug || entry.artifact_id || entry.id;
      if (!slug) {
        issues.push({ id: `slug-${entryPrefix}`, file, type: "missing_slug", severity: "warning", message: `Entry ${i} missing identifier`, autoFixable: false });
        addLegacyTask({ room_id: roomId, priority: "medium", task_type: "fix_json", description: `Add slug to entry ${i}` });
      } else {
        if (slugs.has(slug)) {
          issues.push({ id: `dup-slug-${entryPrefix}`, file, type: "duplicate_slug", severity: "error", message: `Duplicate slug "${slug}"`, autoFixable: false });
        }
        slugs.add(slug);
        if (!isKebabCase(slug)) {
          issues.push({ id: `slug-fmt-${entryPrefix}`, file, type: "slug_format_info", severity: "info", message: `Slug "${slug}" is not kebab-case`, autoFixable: false });
        }
      }

      // --- PHASE 2E: Keywords validation ---
      const kwEn = entry.keywords_en;
      const kwVi = entry.keywords_vi;

      if (!Array.isArray(kwEn) || kwEn.length === 0) {
        issues.push({ id: `kw_en-${entryPrefix}`, file, type: "entry_keyword_missing_en", severity: "warning", message: `Entry "${entrySlug}" missing keywords_en`, autoFixable: false });
        addLegacyTask({ room_id: roomId, priority: "medium", task_type: "fill_keywords", description: `Add English keywords to entry "${entrySlug}"`, language: "en" });
      } else {
        if (kwEn.length < 3) {
          issues.push({ id: `kw_few-${entryPrefix}`, file, type: "entry_keyword_too_few", severity: "info", message: `Entry "${entrySlug}" has ${kwEn.length} keywords (3-5 recommended)`, autoFixable: false });
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
        addLegacyTask({ room_id: roomId, priority: "medium", task_type: "fill_keywords", description: `Add Vietnamese keywords to entry "${entrySlug}"`, language: "vi" });
      }

      // --- PHASE 2F: Copy validation ---
      const copyEn = entry.copy?.en || entry.copy_en;
      const copyVi = entry.copy?.vi || entry.copy_vi;

      if (entry.copy && (typeof entry.copy !== "object" || (!entry.copy.en && !entry.copy.vi))) {
        issues.push({ id: `copy_struct-${entryPrefix}`, file, type: "entry_copy_structure_invalid", severity: "error", message: `Entry "${entrySlug}" has invalid copy structure`, autoFixable: false });
      }

      if (!copyEn) {
        issues.push({ id: `copy_en-${entryPrefix}`, file, type: "missing_copy_en", severity: "error", message: `Entry "${entrySlug}" missing copy.en`, autoFixable: false });
        addLegacyTask({ room_id: roomId, priority: "critical", task_type: "review_content", description: `Add English copy to entry "${entrySlug}"`, language: "en" });
      } else {
        const wc = countWords(copyEn);
        if (wc < 30 || wc > 260) {
          issues.push({ id: `wc_en-${entryPrefix}`, file, type: "copy_word_count_extreme", severity: "warning", message: `Entry "${entrySlug}" copy.en has ${wc} words (30-260 range)`, autoFixable: false });
        }
        if (wc > 300) {
          issues.push({ id: `tts_long-${entryPrefix}`, file, type: "tts_length_exceeded", severity: "warning", message: `Entry "${entrySlug}" copy.en has ${wc} words (TTS max 300)`, autoFixable: false });
        }
        const tts = detectTtsUnsafe(copyEn);
        if (tts.unsafe) {
          issues.push({ id: `tts_en-${entryPrefix}`, file, type: "tts_unstable_text", severity: "warning", message: `Entry "${entrySlug}" TTS-unsafe: ${tts.reasons.join(", ")}`, autoFixable: false });
        }
        if (detectPlaceholder(copyEn)) {
          issues.push({ id: `ph_en-${entryPrefix}`, file, type: "copy_placeholder_detected", severity: "error", message: `Entry "${entrySlug}" copy.en contains placeholder`, autoFixable: false });
        }
        if (detectCorruptChars(copyEn)) {
          issues.push({ id: `corrupt_en-${entryPrefix}`, file, type: "corrupt_characters_detected", severity: "error", message: `Entry "${entrySlug}" copy.en has corrupt characters`, autoFixable: false });
        }
      }

      if (!copyVi) {
        issues.push({ id: `copy_vi-${entryPrefix}`, file, type: "missing_copy_vi", severity: "error", message: `Entry "${entrySlug}" missing copy.vi`, autoFixable: false });
        addLegacyTask({ room_id: roomId, priority: "critical", task_type: "review_content", description: `Add Vietnamese copy to entry "${entrySlug}"`, language: "vi" });
      } else {
        const wc = countWords(copyVi);
        if (wc < 30 || wc > 260) {
          issues.push({ id: `wc_vi-${entryPrefix}`, file, type: "copy_word_count_extreme", severity: "warning", message: `Entry "${entrySlug}" copy.vi has ${wc} words`, autoFixable: false });
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

      // --- PHASE 2G: Entry audio validation with REAL storage check ---
      totalAudioSlots++;
      
      // Collect all audio references from entry
      const audioRefs: string[] = [];
      if (entry.audio) audioRefs.push(String(entry.audio));
      if (entry.audio_en) audioRefs.push(String(entry.audio_en));
      if (entry.audio_vi) audioRefs.push(String(entry.audio_vi));

      if (audioRefs.length === 0) {
        entriesMissingAudio++;
        const suggestedFilename = `${toSafeFilename(roomId)}_${toSafeFilename(entrySlug)}_en.mp3`;
        missingAudioFiles.push(suggestedFilename);
        
        issues.push({ 
          id: `audio-${entryPrefix}`, 
          file, 
          type: "missing_audio_field", 
          severity: "error", 
          message: `Entry "${entrySlug}" missing audio field`, 
          fix: "Generate TTS", 
          autoFixable: false 
        });
        
        if (copyEn) {
          addAudioJob({ 
            room_id: roomId, 
            entry_slug: entrySlug, 
            field: "content", 
            lang: "en", 
            text: copyEn.slice(0, 4000), 
            filename: suggestedFilename 
          });
          addTask(roomId, entrySlug, "en", suggestedFilename, copyEn, "generate_entry_tts");
        }
      } else {
        // Check each referenced audio file against storage
        for (const audioRef of audioRefs) {
          const trimmed = audioRef.trim();
          if (!trimmed) continue;
          
          const normalized = normalizeAudioFilename(trimmed);
          referencedAudioFilenames.add(normalized);
          
          // Real storage existence check
          if (checkFiles && storageScan.ok) {
            const exists = audioFileExists(normalized);
            if (exists) {
              totalAudioPresent++;
            } else {
              entriesMissingAudio++;
              missingAudioFiles.push(normalized);
              issues.push({ 
                id: `audio-file-${entryPrefix}-${normalized}`, 
                file, 
                type: "missing_audio_file", 
                severity: "error", 
                message: `Entry "${entrySlug}" references "${normalized}" but file not found in storage`, 
                fix: "Upload or generate audio file", 
                autoFixable: false 
              });
              
              if (copyEn) {
                addTask(roomId, entrySlug, "en", normalized, copyEn, "generate_entry_tts");
              }
            }
          } else {
            // Can't verify, count as present
            totalAudioPresent++;
          }
        }
      }
    }

    // Duplicate keywords check
    for (const [kw, indices] of allKeywordsInRoom.entries()) {
      if (indices.length > 1) {
        issues.push({ 
          id: `kw-dup-${roomId}-${kw}`, 
          file, 
          type: "entry_keyword_duplicate_across_room", 
          severity: "info", 
          message: `Keyword "${kw}" used in entries ${indices.join(", ")}`, 
          autoFixable: false 
        });
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
      addLegacyTask({ room_id: roomId, priority: "critical", task_type: "review_content", description: `Review crisis content patterns` });
    }
    if (medical.found) {
      issues.push({ id: `medical-${roomId}`, file, type: "medical_claims", severity: "warning", message: `Medical claims: ${medical.patterns.join(", ")}`, autoFixable: false });
    }
    if (emergency.found) {
      issues.push({ id: `emergency-${roomId}`, file, type: "emergency_phrasing", severity: "warning", message: `Emergency phrasing detected`, autoFixable: false });
    }

    // Kids crisis blocker
    const effectiveTier = room.tier || inferTierFromRoomId(roomId);
    if (effectiveTier.toLowerCase().includes("kids") && crisis.found) {
      issues.push({ id: `kids-crisis-${roomId}`, file, type: "kids_crisis_blocker", severity: "error", message: `Kids room contains crisis content`, autoFixable: false });
      addLegacyTask({ room_id: roomId, priority: "critical", task_type: "review_content", description: `URGENT: Remove crisis content from Kids room` });
    }
  }

  log(`Phase 2 complete: Scanned ${scannedRooms} rooms with ${totalEntries} entries`);

  // =========================================================================
  // PHASE 3: Orphan audio detection
  // =========================================================================
  const orphanFiles: string[] = [];
  if (checkFiles && storageScan.ok) {
    log("Phase 3: Detecting orphan audio files...");
    for (const fullKey of audioIndex.allKeys) {
      const basename = (fullKey.split("/").pop() || fullKey).toLowerCase();
      if (!referencedAudioFilenames.has(basename)) {
        orphanFiles.push(fullKey);
      }
    }

    if (orphanFiles.length > 0) {
      const groups = new Map<string, string[]>();
      for (const path of orphanFiles) {
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
        message: `${orphanFiles.length} orphan audio files in ${groups.size} folders`,
        fix: "Review and delete unused files",
        autoFixable: false,
        orphanList: orphanFiles.slice(0, 200),
        context: { groupCount: groups.size, totalFiles: orphanFiles.length },
      });

      for (const [prefix, files] of groups.entries()) {
        addLegacyTask({ room_id: `orphans_${prefix}`, priority: "low", task_type: "delete_orphan", description: `Review ${files.length} orphan files in ${prefix}` });
      }
    }

    log(`Orphan detection complete: ${orphanFiles.length} orphan files found`);
  }

  // =========================================================================
  // Calculate final stats
  // =========================================================================
  const errors = issues.filter(i => i.severity === "error").length;
  const warnings = issues.filter(i => i.severity === "warning").length;
  const infos = issues.filter(i => i.severity === "info").length;

  const durationMs = Math.round(performance.now() - startTime);

  // Audio file stats - based on real storage checks
  const audioFileStats: AudioFileStats = {
    referenced: referencedAudioFilenames.size,
    present: totalAudioPresent + roomsWithIntroEn + roomsWithIntroVi,
    missing: missingAudioFiles.length,
    coverage: referencedAudioFilenames.size > 0 
      ? Math.round(((totalAudioPresent + roomsWithIntroEn + roomsWithIntroVi) / referencedAudioFilenames.size) * 100) 
      : 100,
    missingFiles: missingAudioFiles.slice(0, 100),
  };

  const introStats: IntroStats = {
    withIntroEn: roomsWithIntroEn,
    missingIntroEn: roomsMissingIntroEn,
    withIntroVi: roomsWithIntroVi,
    missingIntroVi: roomsMissingIntroVi,
  };

  const summary: AuditSummary = {
    totalRooms,
    totalEntries,
    scannedRooms,
    errors,
    warnings,
    infos,
    fixed: 0, // No fixes in read-only mode
    audio: audioFileStats,
    intro: introStats,
    storageScan,
    orphanAudioCount: orphanFiles.length,
    referencedAudioCount: referencedAudioFilenames.size,
    // Legacy fields for backward compatibility
    audioFilesInBucket: storageScan.fileCount,
    audioBasenamesInBucket: storageScan.basenamesInBucket,
    orphanAudioFiles: orphanFiles.length,
    referencedAudioFiles: referencedAudioFilenames.size,
    totalAudioSlots,
    totalAudioPresent,
    totalAudioMissing: entriesMissingAudio,
    entriesMissingAudio,
    audioCoveragePercent: audioFileStats.coverage,
    roomsWithIntroEn,
    roomsWithIntroVi,
    roomsMissingIntroEn,
    roomsMissingIntroVi,
    roomsWithFullIntroAudio: Math.min(roomsWithIntroEn, roomsWithIntroVi),
    tasksGenerated: tasks.length,
    audioJobsGenerated: audioJobs.length,
    durationMs,
  };

  log(`=== Safe Shield V5.2 Audit Complete (READ-ONLY) ===`);
  log(`Duration: ${durationMs}ms | Errors: ${errors} | Warnings: ${warnings} | Infos: ${infos}`);
  log(`Storage: ${storageScan.ok ? `${storageScan.fileCount} files` : `FAILED - ${storageScan.error}`}`);
  log(`Audio Coverage: ${audioFileStats.coverage}% (${audioFileStats.present}/${audioFileStats.referenced} present, ${audioFileStats.missing} missing)`);
  log(`Intro: EN ${roomsWithIntroEn}/${roomsWithIntroEn + roomsMissingIntroEn}, VI ${roomsWithIntroVi}/${roomsWithIntroVi + roomsMissingIntroVi}`);
  log(`Orphans: ${orphanFiles.length} files not referenced by any room`);
  log(`TTS Tasks: ${tasks.length} | Audio Jobs: ${audioJobs.length}`);

  return { issues, tasks, legacyTasks, audioJobs, orphanFiles, summary, logs, storageScan, audioFileStats };
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

    // V5.2: Only scan mode supported (read-only)
    const options: AuditRequestOptions = {
      mode: "scan",
      limit: body.limit ? parseInt(body.limit, 10) : undefined,
      roomIdPrefix: body.roomIdPrefix || undefined,
      checkFiles: body.checkFiles !== false,
    };

    const result = await runSafeShieldAudit(options);

    const response: AuditResponse = {
      ok: true,
      mode: "scan",
      stats: result.summary,
      summary: result.summary,
      issues: result.issues,
      tasks: result.tasks,
      legacyTasks: result.legacyTasks,
      audioJobs: result.audioJobs,
      orphanFiles: result.orphanFiles,
      fixesApplied: 0,
      fixed: 0,
      logs: result.logs,
      storageScan: result.storageScan,
      audioFileStats: result.audioFileStats,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[SafeShield] Error:", err);
    const emptyStats: AuditSummary = {
      totalRooms: 0, totalEntries: 0, scannedRooms: 0, errors: 1, warnings: 0, infos: 0, fixed: 0,
      audio: { referenced: 0, present: 0, missing: 0, coverage: 0, missingFiles: [] },
      intro: { withIntroEn: 0, missingIntroEn: 0, withIntroVi: 0, missingIntroVi: 0 },
      storageScan: { ok: false, error: err instanceof Error ? err.message : String(err), fileCount: 0, filesInBucket: 0, basenamesInBucket: 0 },
      orphanAudioCount: 0, referencedAudioCount: 0,
      audioFilesInBucket: 0, audioBasenamesInBucket: 0, orphanAudioFiles: 0,
      referencedAudioFiles: 0, totalAudioSlots: 0, totalAudioPresent: 0, totalAudioMissing: 0,
      entriesMissingAudio: 0, audioCoveragePercent: 0, roomsWithIntroEn: 0, roomsWithIntroVi: 0,
      roomsMissingIntroEn: 0, roomsMissingIntroVi: 0, roomsWithFullIntroAudio: 0,
      tasksGenerated: 0, audioJobsGenerated: 0, durationMs: 0,
    };
    const errorResponse: Partial<AuditResponse> = {
      ok: false,
      mode: "scan",
      error: err instanceof Error ? err.message : String(err),
      stats: emptyStats,
      summary: emptyStats,
      issues: [],
      tasks: [],
      legacyTasks: [],
      audioJobs: [],
      orphanFiles: [],
      fixesApplied: 0,
      fixed: 0,
      logs: [`Error: ${err instanceof Error ? err.message : String(err)}`],
      storageScan: { ok: false, error: err instanceof Error ? err.message : String(err), fileCount: 0, filesInBucket: 0, basenamesInBucket: 0 },
      audioFileStats: { referenced: 0, present: 0, missing: 0, coverage: 0, missingFiles: [] },
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
