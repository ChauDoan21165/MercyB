export type PlacementDataQualitySeverity = "info" | "warning" | "error" | "blocker";

export type PlacementDataQualityCategory =
  | "duplicate_prompt"
  | "near_duplicate_prompt"
  | "malformed_calibration_entry"
  | "missing_cefr_label"
  | "invalid_modality_mapping"
  | "invalid_taxonomy_reference"
  | "invalid_recommendation_reference"
  | "orphaned_rubric_reference"
  | "malformed_json_schema"
  | "impossible_cefr_transition"
  | "missing_metadata"
  | "duplicate_taxonomy_id"
  | "taxonomy_conflict"
  | "unused_taxonomy_category"
  | "undefined_taxonomy_category"
  | "contradictory_learner_pattern"
  | "missing_remediation_link"
  | "orphan_recommendation_path"
  | "cyclic_recommendation_chain"
  | "unreachable_learning_path"
  | "broken_prerequisite_chain"
  | "prompt_modality_mismatch"
  | "rubric_category_mismatch"
  | "rubric_missing_scoring_dimension"
  | "prompt_level_mismatch"
  | "impossible_rubric_expectation"
  | "missing_required_surface";

export type PlacementDataQualityAuditKind =
  | "corpus_integrity"
  | "taxonomy_consistency"
  | "recommendation_graph"
  | "prompt_rubric_alignment";

export interface PlacementDataQualityIssue {
  id: string;
  auditKind: PlacementDataQualityAuditKind;
  category: PlacementDataQualityCategory;
  severity: PlacementDataQualitySeverity;
  file: string;
  message: string;
  evidence?: Record<string, unknown>;
}

export interface PlacementDataQualityIssueCounts {
  total: number;
  blockers: number;
  errors: number;
  warnings: number;
  info: number;
  byCategory: Partial<Record<PlacementDataQualityCategory, number>>;
}

export interface PlacementDataQualityRun {
  runId: string;
  timestamp: string;
  command: string;
  auditKinds: PlacementDataQualityAuditKind[];
  issues: PlacementDataQualityIssue[];
  counts: PlacementDataQualityIssueCounts;
  changedFilesSincePreviousRun: string[];
  auditedFiles: string[];
  missingRequiredSurfaces: string[];
}

export interface PlacementDataQualityDashboardRun {
  id: string;
  run_id: string;
  status: string;
  started_at: string;
  finished_at: string | null;
  total_issues: number;
  blocker_count: number;
  error_count: number;
  warning_count: number;
  info_count: number;
}

export interface PlacementDataQualityDashboardIssue {
  id: string;
  run_id: string;
  audit_kind: PlacementDataQualityAuditKind;
  category: PlacementDataQualityCategory;
  severity: PlacementDataQualitySeverity;
  file_path: string;
  message: string;
  resolved_at: string | null;
}
