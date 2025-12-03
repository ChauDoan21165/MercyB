// Shared types for Audit v4 Safe Shield

export type AuditIssueType =
  | "missing_json"
  | "missing_audio"
  | "missing_entries"
  | "missing_db"
  | "mismatched_slug"
  | "duplicate_room"
  | "invalid_json"
  | "missing_tier"
  | "missing_title"
  | "registry_missing";

export type AuditSeverity = "error" | "warning" | "info";

export interface AuditIssue {
  id: string;
  file: string;
  type: AuditIssueType;
  severity: AuditSeverity;
  message: string;
  fix?: string;
  autoFixable?: boolean;
}

export interface AuditSummary {
  totalRooms: number;
  scannedRooms: number;
  errors: number;
  warnings: number;
  fixed: number;
}

export type AuditMode = "dry-run" | "repair";

export interface AuditResponse {
  ok: boolean;
  mode: AuditMode;
  summary: AuditSummary;
  issues: AuditIssue[];
  fixesApplied?: number;
  logs?: string[];
  error?: string;
}
