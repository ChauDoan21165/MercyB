// Shared types for room health validation
// Used across room-health-summary, room-health-auto-fix, etc.

export type IssueSeverity = 'error' | 'warning' | 'info';

export type IssueCode =
  | 'invalid_json'
  | 'schema_missing_field'
  | 'schema_invalid_field'
  | 'schema_wrong_type'
  | 'missing_id'
  | 'missing_domain'
  | 'missing_content'
  | 'missing_meta'
  | 'missing_file'
  | 'bilingual_mismatch'
  | 'bilingual_missing'
  | 'keywords_invalid'
  | 'tags_invalid'
  | 'tags_missing'
  | 'severity_invalid'
  | 'all_entry_missing'
  | 'audio_object_invalid'
  | 'audio_path_has_folder'
  | 'audio_filename_invalid'
  | 'entry_missing_fields';

export interface RoomIssue {
  code: IssueCode;
  severity: IssueSeverity;
  message: string;
  context?: string;
}

export interface RoomValidationResult {
  room_id: string;
  tier: string;
  json_missing: boolean;
  json_invalid: boolean;
  health_score: number;
  audio_coverage: number;
  has_zero_audio: boolean;
  is_low_health: boolean;
  issues: RoomIssue[];
}

export interface RoomHealthSummary {
  global: {
    total_rooms: number;
    rooms_zero_audio: number;
    rooms_low_health: number;
    rooms_missing_json: number;
  };
  byTier: Record<string, {
    total_rooms: number;
    rooms_zero_audio: number;
    rooms_low_health: number;
    rooms_missing_json: number;
  }>;
  vip_track_gaps: Array<{
    tier: string;
    title: string;
    total_rooms: number;
    min_required: number;
    issue: string;
  }>;
  tier_counts: Record<string, number>;
  room_details?: RoomValidationResult[];
  fatal_error?: boolean;
  error_message?: string;
}

// Mercy Blade JSON standard interfaces
export interface MercyBladeEntry {
  slug?: string;
  identifier?: string;
  copy_en: string;
  copy_vi: string;
  keywords_en: string[];
  keywords_vi: string[];
  tags?: string[];
  severity_level?: string;
  audio_en?: string;
  audio_vi?: string;
  audio?: string;
}

export interface MercyBladeRoomJson {
  id: string;
  tier: string;
  domain?: string;
  title: {
    en: string;
    vi: string;
  };
  content?: {
    en: string;
    vi: string;
  };
  entries: MercyBladeEntry[];
  keywords_en?: string[];
  keywords_vi?: string[];
  meta?: {
    created_at?: string;
    updated_at?: string;
    entry_count?: number;
  };
}
