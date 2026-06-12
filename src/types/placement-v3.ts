// Placement v3 persistence contracts.
//
// Mirrors the additive placement_v3_* tables. Keep this browser-safe: only
// type-only imports from server-shared modules are allowed here.

import type { CEFRLevel } from "../../supabase/functions/_shared/cefr/types";

export type { CEFRLevel };

export type PlacementV3Modality =
  | "writing"
  | "speaking"
  | "reading"
  | "listening"
  | "conversation";

export type PlacementV3FlowState =
  | "in_progress"
  | "completed"
  | "abandoned"
  | "error";

export interface PlacementV3LanguagePair {
  /** Learner's native language code, e.g. "vi". */
  native: string;
  /** Learner's target language code, e.g. "en". */
  target: string;
}

export interface PlacementV3SkillProfile {
  /** CEFR level computed for this skill. */
  level: CEFRLevel;
  /** Model confidence for this skill, 0.00 through 1.00. */
  confidence: number;
}

export interface PlacementV3PerSkillProfile {
  /** Speaking placement result, if enough evidence was collected. */
  speaking?: PlacementV3SkillProfile;
  /** Listening placement result, if enough evidence was collected. */
  listening?: PlacementV3SkillProfile;
  /** Reading placement result, if enough evidence was collected. */
  reading?: PlacementV3SkillProfile;
  /** Writing placement result, if enough evidence was collected. */
  writing?: PlacementV3SkillProfile;
  /** Conversation placement result, if enough evidence was collected. */
  conversation?: PlacementV3SkillProfile;
}

export interface PlacementV3L1InterferenceFlag {
  /** Stable taxonomy pattern id from the Vietnamese L1 interference catalog. */
  patternId: string;
  /** Severity assigned by the grader/taxonomy layer. */
  severity: "low" | "medium" | "high";
  /** Optional human-readable evidence or note for explainability. */
  evidence?: string;
}

export interface PlacementV3RecommendedLesson {
  /** Target lesson or room id recommended after placement. */
  lessonId: string;
  /** Short explanation for why this lesson fits the learner. */
  reason: string;
  /** Recommendation order; lower numbers should be shown first. */
  priority: number;
}

export interface PlacementV3AssessmentCriterion {
  /** Criterion-specific CEFR level. */
  level: CEFRLevel;
  /** Criterion score on the grader-defined scale. */
  score?: number;
  /** Short evidence string from the grader. */
  evidence?: string;
}

export interface PlacementV3CEFRAssessment {
  /** Overall level produced by the grader for this response. */
  overallLevel: CEFRLevel;
  /** Overall confidence from 0.00 through 1.00. */
  confidence: number;
  /** Optional rubric details keyed by criterion name. */
  criteria?: Record<string, PlacementV3AssessmentCriterion>;
  /** Learner strengths detected in the response. */
  strengths?: string[];
  /** Learner gaps detected in the response. */
  gaps?: string[];
  /** Vietnamese L1 interference signals detected in the response. */
  l1InterferenceFlags?: PlacementV3L1InterferenceFlag[];
  /** Additional grader metadata not yet promoted to typed columns. */
  metadata?: Record<string, unknown>;
}

export type PlacementSkill =
  | "overall"
  | "grammar"
  | "vocabulary"
  | "pronunciation"
  | "listening"
  | "speaking"
  | "reading"
  | "writing";

export type PlacementCefrLevel = "pre_a1" | CEFRLevel;

export type L1InterferenceFlag =
  | string
  | {
      id?: string;
      patternId?: string;
      tag?: string;
      severity?: "low" | "medium" | "high" | "severe" | number;
    };

export type CEFRAssessment = {
  overallLevel?: PlacementCefrLevel;
  confidence?: number;
  overallCefr?: PlacementCefrLevel;
  overallCEFR?: PlacementCefrLevel;
  cefrLevel?: PlacementCefrLevel;
  level?: PlacementCefrLevel;
  skillCefr?: Partial<Record<PlacementSkill, PlacementCefrLevel>>;
  skillCEFR?: Partial<Record<PlacementSkill, PlacementCefrLevel>>;
  skillLevels?: Partial<Record<PlacementSkill, PlacementCefrLevel>>;
  strengths?: string[];
  gaps?: string[];
  l1InterferenceFlags?: L1InterferenceFlag[];
};

export interface PlacementV3SessionRow {
  /** Primary key for the placement session. */
  id: string;
  /** Auth user who owns this placement attempt. */
  user_id: string;
  /** Time the user started the placement attempt. */
  started_at: string;
  /** Time the attempt completed, or null while still open. */
  completed_at: string | null;
  /** Time the attempt was abandoned, or null when not abandoned. */
  abandoned_at: string | null;
  /** Modality currently being administered to the learner. */
  current_modality: PlacementV3Modality | null;
  /** Zero-based task index for resume/progress display. */
  current_task_index: number;
  /** Planned number of tasks in this placement flow, if known. */
  total_tasks: number | null;
  /** Native/target language pair for the placement. */
  language_pair: PlacementV3LanguagePair;
  /** Lifecycle state for the session. */
  flow_state: PlacementV3FlowState;
  /** Extra orchestration metadata that does not deserve a promoted column yet. */
  metadata: Record<string, unknown>;
  /** Row creation timestamp. */
  created_at: string;
  /** Row update timestamp, maintained by the application/edge function. */
  updated_at: string;
}

export interface PlacementV3SessionInsert {
  /** Optional primary key; generated by Postgres when omitted. */
  id?: string;
  /** Auth user who owns this placement attempt. */
  user_id: string;
  /** Optional start timestamp; defaults to now() when omitted. */
  started_at?: string;
  /** Completion timestamp, normally set when flow_state becomes completed. */
  completed_at?: string | null;
  /** Abandon timestamp, normally set when flow_state becomes abandoned. */
  abandoned_at?: string | null;
  /** Initial or current modality. */
  current_modality?: PlacementV3Modality | null;
  /** Zero-based task index; defaults to 0. */
  current_task_index?: number;
  /** Planned number of tasks in the flow, if known. */
  total_tasks?: number | null;
  /** Native/target language pair for the placement. */
  language_pair: PlacementV3LanguagePair;
  /** Lifecycle state; defaults to "in_progress". */
  flow_state?: PlacementV3FlowState;
  /** Extra orchestration metadata. */
  metadata?: Record<string, unknown>;
  /** Optional row creation timestamp; defaults to now(). */
  created_at?: string;
  /** Optional row update timestamp; defaults to now(). */
  updated_at?: string;
}

export interface PlacementV3SessionUpdate {
  /** Completion timestamp for a finished attempt. */
  completed_at?: string | null;
  /** Modality currently being administered to the learner. */
  current_modality?: PlacementV3Modality | null;
  /** Zero-based task index for resume/progress display. */
  current_task_index?: number;
  /** Lifecycle state for the session. */
  flow_state?: PlacementV3FlowState;
  /** Row update timestamp. */
  updated_at?: string;
}

export interface PlacementV3ResponseRow {
  /** Primary key for this response row. */
  id: string;
  /** Placement session this response belongs to. */
  session_id: string;
  /** Zero-based task index within the session. */
  task_index: number;
  /** Modality of the task that produced this response. */
  modality: PlacementV3Modality;
  /** Stable prompt id from the placement prompt catalog. */
  prompt_id: string;
  /** Prompt text shown to the learner for audit/debugging. */
  prompt_text: string;
  /** Written response or transcript of spoken response. */
  user_response_text: string | null;
  /** Storage bucket path for speaking audio, when captured. */
  audio_storage_path: string | null;
  /** Time spent responding, in milliseconds. */
  response_duration_ms: number | null;
  /** AI grader output for this response; service_role-owned. */
  ai_assessment: PlacementV3CEFRAssessment | null;
  /** Version string for the grader that produced ai_assessment. */
  ai_assessment_version: string | null;
  /** Timestamp when service_role grading completed. */
  graded_at: string | null;
  /** Row creation timestamp. */
  created_at: string;
}

export interface PlacementV3ResponseInsert {
  /** Optional primary key; generated by Postgres when omitted. */
  id?: string;
  /** Placement session this response belongs to. */
  session_id: string;
  /** Zero-based task index within the session. */
  task_index: number;
  /** Modality of the task that produced this response. */
  modality: PlacementV3Modality;
  /** Stable prompt id from the placement prompt catalog. */
  prompt_id: string;
  /** Prompt text shown to the learner for audit/debugging. */
  prompt_text: string;
  /** Written response or transcript of spoken response. */
  user_response_text?: string | null;
  /** Storage bucket path for speaking audio, when captured. */
  audio_storage_path?: string | null;
  /** Time spent responding, in milliseconds. */
  response_duration_ms?: number | null;
  /** AI grader output for this response; normally omitted by clients. */
  ai_assessment?: PlacementV3CEFRAssessment | null;
  /** Version string for the grader that produced ai_assessment. */
  ai_assessment_version?: string | null;
  /** Timestamp when service_role grading completed. */
  graded_at?: string | null;
  /** Optional row creation timestamp; defaults to now(). */
  created_at?: string;
}

export interface PlacementV3ResponseServiceUpdate {
  /** AI grader output for this response. */
  ai_assessment?: PlacementV3CEFRAssessment | null;
  /** Version string for the grader that produced ai_assessment. */
  ai_assessment_version?: string | null;
  /** Timestamp when grading completed. */
  graded_at?: string | null;
}

export interface PlacementV3ProfileRow {
  /** Primary key for this computed profile. */
  id: string;
  /** Auth user this profile belongs to. */
  user_id: string;
  /** Placement session this profile was computed from. */
  session_id: string;
  /** Overall CEFR level computed from the full placement. */
  cefr_overall: CEFRLevel;
  /** Overall confidence from 0.00 through 1.00. */
  cefr_overall_confidence: number;
  /** Per-skill CEFR levels and confidence values. */
  cefr_per_skill: PlacementV3PerSkillProfile;
  /** Vietnamese L1 transfer/interference findings. */
  l1_interference_flags: PlacementV3L1InterferenceFlag[];
  /** Learner strengths inferred from placement evidence. */
  strengths: string[];
  /** Learner gaps inferred from placement evidence. */
  gaps: string[];
  /** Lessons recommended from the computed profile. */
  recommended_lessons: PlacementV3RecommendedLesson[];
  /** Timestamp when this profile was computed. */
  computed_at: string;
  /** Whether this is the user's current active placement profile. */
  is_current: boolean;
  /** Row creation timestamp. */
  created_at: string;
}

export interface PlacementV3ProfileInsert {
  /** Optional primary key; generated by Postgres when omitted. */
  id?: string;
  /** Auth user this profile belongs to. */
  user_id: string;
  /** Placement session this profile was computed from. */
  session_id: string;
  /** Overall CEFR level computed from the full placement. */
  cefr_overall: CEFRLevel;
  /** Overall confidence from 0.00 through 1.00. */
  cefr_overall_confidence: number;
  /** Per-skill CEFR levels and confidence values. */
  cefr_per_skill: PlacementV3PerSkillProfile;
  /** Vietnamese L1 transfer/interference findings. */
  l1_interference_flags?: PlacementV3L1InterferenceFlag[];
  /** Learner strengths inferred from placement evidence. */
  strengths?: string[];
  /** Learner gaps inferred from placement evidence. */
  gaps?: string[];
  /** Lessons recommended from the computed profile. */
  recommended_lessons?: PlacementV3RecommendedLesson[];
  /** Timestamp when this profile was computed; defaults to now(). */
  computed_at?: string;
  /** Whether this is the user's current active placement profile. */
  is_current?: boolean;
  /** Optional row creation timestamp; defaults to now(). */
  created_at?: string;
}

export interface PlacementV3ProfileServiceUpdate {
  /** Whether this is the user's current active placement profile. */
  is_current?: boolean;
}
