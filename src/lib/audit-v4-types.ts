// Shared types for Audit v4 Safe Shield
// This is the SINGLE SOURCE OF TRUTH for all audit-related types

// ============================================================================
// ISSUE TYPES - All possible audit issue types
// ============================================================================

export type AuditIssueType =
  // Room identity issues
  | "duplicate_room"
  | "missing_tier"
  | "invalid_tier"
  | "missing_schema_id"
  | "missing_domain"
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
  // Copy issues
  | "missing_copy_en"
  | "missing_copy_vi"
  | "copy_word_count_extreme"
  | "copy_placeholder_detected"
  // Keywords issues
  | "missing_room_keywords"
  | "entry_keyword_missing_en"
  | "entry_keyword_missing_vi"
  | "entry_keyword_too_few"
  | "entry_keyword_duplicate_across_room"
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
  | "missing_db"
  | "mismatched_slug"
  | "registry_missing"
  // Essay issues
  | "missing_room_essay_en"
  | "missing_room_essay_vi"
  | "essay_placeholder_detected"
  | "essay_too_short"
  | "essay_too_long"
  // TTS safety issues
  | "tts_unstable_text"
  | "tts_length_exceeded"
  // Content safety issues
  | "crisis_content"
  | "medical_claims"
  | "emergency_phrasing"
  | "kids_crisis_blocker"
  // Deprecated fields
  | "deprecated_field_present"
  // Unknown entry keys
  | "unknown_entry_key";

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
  infos?: number;
  
  // Fix counts
  fixed: number;
  
  // Audio stats
  audioFilesInBucket?: number;
  audioBasenamesInBucket?: number;
  orphanAudioFiles?: number;
  referencedAudioFiles?: number;
  
  // Audio coverage metrics
  totalAudioSlots?: number;
  totalAudioPresent?: number;
  totalAudioMissing?: number;
  audioCoveragePercent?: number;
  
  // Intro audio stats
  roomsWithIntroEn?: number;
  roomsWithIntroVi?: number;
  roomsMissingIntroEn?: number;
  roomsMissingIntroVi?: number;
  roomsWithFullIntroAudio?: number;
  
  // Performance
  durationMs?: number;
}

// ============================================================================
// REQUEST OPTIONS
// ============================================================================

export type AuditMode = "dry-run" | "repair";

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
// RESPONSE STRUCTURE
// ============================================================================

export interface AuditResponse {
  ok: boolean;
  mode?: AuditMode;
  error?: string;
  summary: AuditSummary;
  issues: AuditIssue[];
  fixesApplied?: number;
  /** @deprecated Use fixesApplied instead */
  fixed?: number;
  logs?: string[];
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
  missing_schema_id: "Missing schema ID",
  missing_domain: "Missing domain",
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
  // Copy
  missing_copy_en: "Missing copy (EN)",
  missing_copy_vi: "Missing copy (VI)",
  copy_word_count_extreme: "Copy word count extreme",
  copy_placeholder_detected: "Copy has placeholder",
  // Keywords
  missing_room_keywords: "Missing room keywords",
  entry_keyword_missing_en: "Missing keywords (EN)",
  entry_keyword_missing_vi: "Missing keywords (VI)",
  entry_keyword_too_few: "Too few keywords",
  entry_keyword_duplicate_across_room: "Duplicate keyword in room",
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
  missing_db: "Missing database entry",
  mismatched_slug: "Mismatched slug",
  registry_missing: "Missing from registry",
  // Essays
  missing_room_essay_en: "Missing essay (EN)",
  missing_room_essay_vi: "Missing essay (VI)",
  essay_placeholder_detected: "Essay has placeholder",
  essay_too_short: "Essay too short",
  essay_too_long: "Essay too long",
  // TTS
  tts_unstable_text: "TTS-unsafe text",
  tts_length_exceeded: "TTS length exceeded",
  // Content safety
  crisis_content: "Crisis / self-harm content",
  medical_claims: "Medical over-claiming",
  emergency_phrasing: "Emergency phrasing",
  kids_crisis_blocker: "Kids crisis blocker",
  // Deprecated
  deprecated_field_present: "Deprecated field",
  unknown_entry_key: "Unknown entry key",
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
  | "entry_structure";
