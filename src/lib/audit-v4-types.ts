// Shared types for Audit v4 Safe Shield V5
// This is the SINGLE SOURCE OF TRUTH for all audit-related types

// ============================================================================
// ISSUE TYPES - All possible audit issue types (complete union)
// ============================================================================

export type AuditIssueType =
  // Room identity issues
  | "duplicate_room"
  | "missing_tier"
  | "invalid_tier"
  | "tier_incorrect"
  | "missing_schema_id"
  | "missing_schema"
  | "missing_domain"
  | "domain_incorrect"
  | "missing_title"
  | "missing_title_en"
  | "missing_title_vi"
  // Entry structure issues
  | "missing_entries"
  | "malformed_entries"
  | "entry_count_info"
  | "missing_slug"
  | "duplicate_slug"
  | "slug_format_info"
  | "invalid_slug"
  | "entry_copy_missing"
  | "entry_copy_structure_invalid"
  // Copy issues
  | "missing_copy_en"
  | "missing_copy_vi"
  | "copy_word_count_extreme"
  | "copy_placeholder_detected"
  | "room_content_missing"
  // Keywords issues
  | "missing_room_keywords"
  | "missing_keywords"
  | "missing_keywords_vi"
  | "entry_keyword_missing_en"
  | "entry_keyword_missing_vi"
  | "entry_keyword_too_few"
  | "entry_keyword_duplicate_across_room"
  | "keyword_display_label_wrong"
  | "keyword_too_few"
  | "keyword_duplicate"
  // Audio issues - entry level
  | "missing_audio"
  | "missing_audio_field"
  | "missing_audio_file"
  // Audio issues - room intro level
  | "missing_intro_audio_en"
  | "missing_intro_audio_vi"
  // Audio issues - orphan detection
  | "orphan_audio_files"
  // JSON/Registry issues
  | "missing_json"
  | "invalid_json"
  | "json_malformed"
  | "json_size_exceeded"
  | "missing_db"
  | "mismatched_slug"
  | "registry_missing"
  // Essay issues
  | "missing_room_essay_en"
  | "missing_room_essay_vi"
  | "essay_placeholder_detected"
  | "essay_placeholder"
  | "essay_too_short"
  | "essay_too_long"
  // TTS safety issues
  | "tts_unstable_text"
  | "tts_length_exceeded"
  // Content safety issues
  | "crisis_content"
  | "crisis_content_detected"
  | "medical_claims"
  | "unsafe_medical_claim"
  | "emergency_phrasing"
  | "kids_crisis_blocker"
  | "kids_blocker_detected"
  | "corrupt_characters_detected"
  // Deprecated fields
  | "deprecated_field_present"
  // Unknown entry keys
  | "unknown_entry_key"
  | "unknown_field_present"
  // Task/job notifications
  | "tts_job_generated"
  | "tts_intro_job_generated"
  | "general_warning"
  | "general_info";

// ============================================================================
// SEVERITY
// ============================================================================

export type AuditSeverity = "error" | "warning" | "info";

// ============================================================================
// ISSUE STRUCTURE
// ============================================================================

export interface AuditIssue {
  id: string;
  file: string;
  type: AuditIssueType | string; // Allow string for forward compatibility
  severity: AuditSeverity;
  message: string;
  fix?: string;
  autoFixable?: boolean;
  orphanList?: string[]; // For orphan audio files
  context?: Record<string, unknown>; // Additional context
}

// ============================================================================
// TASK SUGGESTION - Generated fix tasks
// ============================================================================

export type TaskType = 
  | "fix_json"
  | "fix_audio"
  | "create_intro_audio"
  | "fill_keywords"
  | "rewrite_essay"
  | "review_content"
  | "delete_orphan";

export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface AuditTaskSuggestion {
  room_id: string;
  priority: TaskPriority;
  task_type: TaskType;
  description: string;
  suggested_filename?: string;
  suggested_text?: string;
  language?: "en" | "vi";
}

// ============================================================================
// AUDIO JOB - TTS generation tasks
// ============================================================================

export interface AudioJob {
  room_id: string;
  entry_slug?: string;
  field: "intro" | "content";
  lang: "en" | "vi";
  text: string;
  filename: string;
}

// ============================================================================
// SUMMARY - Statistics from the audit
// ============================================================================

export interface AuditSummary {
  // Room counts
  totalRooms: number;
  scannedRooms: number;
  
  // Issue counts
  errors: number;
  warnings: number;
  infos: number;
  
  // Fix counts
  fixed: number;
  
  // Audio stats - bucket
  audioFilesInBucket: number;
  audioBasenamesInBucket: number;
  orphanAudioCount: number;
  orphanAudioFiles?: number; // Alias for backwards compat
  referencedAudioFiles: number;
  
  // Audio coverage metrics - entries
  totalAudioSlots: number;
  totalAudioPresent: number;
  totalAudioMissing: number;
  audioCoveragePercent: number;
  entriesMissingAudio: number;
  
  // Intro audio stats
  roomsWithIntroEn: number;
  roomsWithIntroVi: number;
  roomsMissingIntroEn: number;
  roomsMissingIntroVi: number;
  roomsWithFullIntroAudio: number;
  
  // Tasks generated
  tasksGenerated: number;
  audioJobsGenerated: number;
  
  // Performance
  durationMs: number;
}

// ============================================================================
// REQUEST OPTIONS
// ============================================================================

export type AuditMode = "dry-run" | "repair" | "scan";

export interface AuditRequestOptions {
  mode: AuditMode;
  /** Maximum rooms to scan (for debugging/performance) */
  limit?: number;
  /** Filter rooms by ID prefix (e.g., "english_foundation_") */
  roomIdPrefix?: string;
  /** Enable deep file existence checks in storage (slower) */
  checkFiles?: boolean;
}

// ============================================================================
// RESPONSE STRUCTURE - V5 with tasks and audioJobs
// ============================================================================

export interface AuditResponse {
  ok: boolean;
  mode: AuditMode;
  error?: string;
  // V5: renamed summary to stats but kept summary for backwards compat
  stats: AuditSummary;
  summary: AuditSummary; // Alias for backwards compat
  issues: AuditIssue[];
  // V5: New task and job arrays
  tasks: AuditTaskSuggestion[];
  audioJobs: AudioJob[];
  // Fix count
  fixesApplied: number;
  /** @deprecated Use fixesApplied instead */
  fixed?: number;
  logs: string[];
}

// ============================================================================
// ROOM HEALTH DETAIL (per-room metrics)
// ============================================================================

export interface RoomHealthDetail {
  roomId: string;
  tier: string;
  totalEntries: number;
  entriesWithAudio: number;
  entriesMissingAudio: number;
  audioCoverage: number; // 0-100 percentage
  hasIntroAudioEn: boolean;
  hasIntroAudioVi: boolean;
  issueCount: number;
}

// ============================================================================
// TYPE LABELS for UI display
// ============================================================================

export const ISSUE_TYPE_LABELS: Record<string, string> = {
  // Room identity
  duplicate_room: "Duplicate room ID",
  missing_tier: "Missing tier",
  invalid_tier: "Invalid tier",
  tier_incorrect: "Incorrect tier",
  missing_schema_id: "Missing schema ID",
  missing_schema: "Missing schema",
  missing_domain: "Missing domain",
  domain_incorrect: "Incorrect domain",
  missing_title: "Missing title",
  missing_title_en: "Missing title (EN)",
  missing_title_vi: "Missing title (VI)",
  // Entry structure
  missing_entries: "Missing entries",
  malformed_entries: "Malformed entries",
  entry_count_info: "Entry count info",
  missing_slug: "Missing slug",
  duplicate_slug: "Duplicate slug",
  slug_format_info: "Slug format info",
  invalid_slug: "Invalid slug",
  entry_copy_missing: "Entry copy missing",
  entry_copy_structure_invalid: "Entry copy structure invalid",
  // Copy
  missing_copy_en: "Missing copy (EN)",
  missing_copy_vi: "Missing copy (VI)",
  copy_word_count_extreme: "Copy word count extreme",
  copy_placeholder_detected: "Copy has placeholder",
  room_content_missing: "Room content missing",
  // Keywords
  missing_room_keywords: "Missing room keywords",
  missing_keywords: "Missing keywords",
  missing_keywords_vi: "Missing keywords (VI)",
  entry_keyword_missing_en: "Missing keywords (EN)",
  entry_keyword_missing_vi: "Missing keywords (VI)",
  entry_keyword_too_few: "Too few keywords",
  entry_keyword_duplicate_across_room: "Duplicate keyword in room",
  keyword_display_label_wrong: "Keyword display label wrong",
  keyword_too_few: "Too few keywords",
  keyword_duplicate: "Duplicate keyword",
  // Audio - entry
  missing_audio: "Missing audio",
  missing_audio_field: "Missing audio field",
  missing_audio_file: "Missing audio file",
  // Audio - intro
  missing_intro_audio_en: "Missing intro audio (EN)",
  missing_intro_audio_vi: "Missing intro audio (VI)",
  // Audio - orphan
  orphan_audio_files: "Orphan audio files",
  // JSON/Registry
  missing_json: "Missing JSON file",
  invalid_json: "Invalid JSON",
  json_malformed: "Malformed JSON",
  json_size_exceeded: "JSON size exceeded",
  missing_db: "Missing database entry",
  mismatched_slug: "Mismatched slug",
  registry_missing: "Missing from registry",
  // Essays
  missing_room_essay_en: "Missing essay (EN)",
  missing_room_essay_vi: "Missing essay (VI)",
  essay_placeholder_detected: "Essay has placeholder",
  essay_placeholder: "Essay has placeholder",
  essay_too_short: "Essay too short",
  essay_too_long: "Essay too long",
  // TTS
  tts_unstable_text: "TTS-unsafe text",
  tts_length_exceeded: "TTS length exceeded",
  // Content safety
  crisis_content: "Crisis / self-harm content",
  crisis_content_detected: "Crisis content detected",
  medical_claims: "Medical over-claiming",
  unsafe_medical_claim: "Unsafe medical claim",
  emergency_phrasing: "Emergency phrasing",
  kids_crisis_blocker: "Kids crisis blocker",
  kids_blocker_detected: "Kids blocker detected",
  corrupt_characters_detected: "Corrupt characters",
  // Deprecated
  deprecated_field_present: "Deprecated field",
  unknown_entry_key: "Unknown entry key",
  unknown_field_present: "Unknown field present",
  // Jobs
  tts_job_generated: "TTS job generated",
  tts_intro_job_generated: "Intro TTS job generated",
  general_warning: "General warning",
  general_info: "General info",
};

// ============================================================================
// TASK TYPE LABELS for UI
// ============================================================================

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  fix_json: "Fix JSON structure",
  fix_audio: "Generate entry audio",
  create_intro_audio: "Generate intro audio",
  fill_keywords: "Fill keywords",
  rewrite_essay: "Rewrite essay",
  review_content: "Review content",
  delete_orphan: "Delete orphan file",
};

// ============================================================================
// FILTER TYPES for UI
// ============================================================================

export type AuditFilterType =
  | "all"
  | "errors"
  | "warnings"
  | "infos"
  | "audio"
  | "intro_audio"
  | "orphan_audio"
  | "essays"
  | "keywords"
  | "tts"
  | "safety"
  | "deprecated"
  | "room_identity"
  | "entry_structure"
  | "tasks"
  | "audio_jobs";
