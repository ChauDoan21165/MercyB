// Shared types for Audit v4 Safe Shield

export type AuditIssueType =
  | "missing_json"
  | "missing_audio"
  | "missing_audio_field"
  | "missing_audio_file"
  | "missing_intro_audio_en"
  | "missing_intro_audio_vi"
  | "orphan_audio_files"
  | "missing_entries"
  | "missing_db"
  | "mismatched_slug"
  | "duplicate_room"
  | "duplicate_slug"
  | "invalid_json"
  | "missing_tier"
  | "invalid_tier"
  | "missing_title"
  | "missing_title_en"
  | "missing_title_vi"
  | "missing_schema_id"
  | "missing_domain"
  | "missing_room_keywords"
  | "missing_slug"
  | "missing_copy_en"
  | "missing_copy_vi"
  | "copy_word_count_extreme"
  | "malformed_entries"
  | "entry_count_info"
  | "slug_format_info"
  | "registry_missing"
  // Content safety types
  | "crisis_content"
  | "medical_claims"
  | "emergency_phrasing"
  | "kids_crisis_blocker"
  // Essay checks
  | "missing_room_essay_en"
  | "missing_room_essay_vi"
  | "essay_placeholder_detected"
  | "essay_too_short"
  | "essay_too_long"
  // Entry keyword checks
  | "entry_keyword_missing_en"
  | "entry_keyword_missing_vi"
  | "entry_keyword_too_few"
  | "entry_keyword_duplicate_across_room"
  // TTS safety checks
  | "tts_unstable_text"
  | "tts_length_exceeded"
  // Copy placeholder
  | "copy_placeholder_detected"
  // Deprecated fields
  | "deprecated_field_present";

export type AuditSeverity = "error" | "warning" | "info";

export interface AuditIssue {
  id: string;
  file: string;
  type: AuditIssueType | string;
  severity: AuditSeverity;
  message: string;
  fix?: string;
  autoFixable?: boolean;
  orphanList?: string[];
}

export interface AuditSummary {
  totalRooms: number;
  scannedRooms: number;
  errors: number;
  warnings: number;
  fixed: number;
  // Audio stats
  audioFilesInBucket?: number;
  audioBasenamesInBucket?: number;
  orphanAudioFiles?: number;
  referencedAudioFiles?: number;
}

export type AuditMode = "dry-run" | "repair";

export interface AuditResponse {
  ok: boolean;
  mode?: AuditMode;
  summary: AuditSummary;
  issues: AuditIssue[];
  fixesApplied?: number;
  fixed?: number;
  logs?: string[];
  error?: string;
}
