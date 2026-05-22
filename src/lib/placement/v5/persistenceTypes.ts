/**
 * V5 Persistence Types — TypeScript row types mirroring Postgres schema.
 *
 * These are the application-layer types for reading/writing V4-shaped data
 * through the V5 Supabase persistence layer. All types are prefixed with
 * V5 to distinguish from V4 domain types.
 *
 * V4 types are imported from the V4 barrel, never redefined here.
 */

import type {
  LearnerMemory,
  PlacementV4ProviderDecisionRecord,
  PlacementV4ProviderCapability,
  PlacementV4FailoverReason,
  PlacementV4BoundaryMode,
} from "@/lib/placement/v4";
import type {
  OrchestrationSnapshotFull,
  OrchestrationSnapshotCompact,
} from "@/lib/placement/v4/telemetry";

// ─── Learner Memory ───────────────────────────────────────────────────

export interface V5LearnerMemoryRow {
  id: string;
  user_id: string;
  learner_key: string;
  schema_version: string;
  /** Serialized LearnerMemory (canonical JSON). Deserialize via V4's deserializeLearnerMemory. */
  payload: LearnerMemory;
  content_hash: string;
  event_count: number;
  created_at: string;
  updated_at: string;
}

// ─── Telemetry Events ─────────────────────────────────────────────────

export interface V5TelemetryEventRow {
  id: string;
  user_id: string;
  event_id: string;
  event_type: string;
  occurred_at: string;
  session_id: string | null;
  /** Full TelemetryEvent serialized via canonicalJSON. */
  payload: Record<string, unknown>;
  created_at: string;
}

// ─── Orchestration Snapshots ──────────────────────────────────────────

export type V5SnapshotType = "FULL" | "COMPACT";

export interface V5OrchestrationSnapshotRow {
  id: string;
  user_id: string;
  snapshot_id: string;
  snapshot_type: V5SnapshotType;
  schema_version: string;
  content_hash: string;
  /** Serialized OrchestrationSnapshotFull or OrchestrationSnapshotCompact. */
  payload: OrchestrationSnapshotFull | OrchestrationSnapshotCompact;
  device_id: string | null;
  vector_clock: Record<string, number> | null;
  event_count: number;
  created_at: string;
}

// ─── Provider Decisions ───────────────────────────────────────────────

export interface V5ProviderDecisionRow {
  id: string;
  user_id: string;
  decision_id: string;
  capability: PlacementV4ProviderCapability;
  status: "selected" | "blocked";
  selected_provider_id: string | null;
  boundary_mode: PlacementV4BoundaryMode;
  trust_score: number | null;
  cost_estimate_cents: number | null;
  rejection_reasons: readonly PlacementV4FailoverReason[] | null;
  /** Full PlacementV4ProviderDecisionRecord (secrets redacted). */
  payload: PlacementV4ProviderDecisionRecord;
  created_at: string;
}

// ─── Curriculum Plans ─────────────────────────────────────────────────

export interface V5CurriculumPlanRow {
  id: string;
  user_id: string;
  plan_version: number;
  plan_length_days: 7 | 28 | 90;
  generated_at: string;
  deterministic_key: string;
  fatigue_score: number;
  focus_skills: string[] | null;
  /** Serialized CurriculumPlan. */
  payload: Record<string, unknown>;
  superseded_at: string | null;
  created_at: string;
}

// ─── Admin View Types ─────────────────────────────────────────────────

export interface V5AdminLearnerMemorySummary {
  user_id: string;
  learner_key: string;
  schema_version: string;
  content_hash: string;
  event_count: number;
  created_at: string;
  updated_at: string;
  payload_bytes: number;
}

export interface V5AdminTelemetryDaily {
  user_id: string;
  event_type: string;
  event_date: string;
  event_count: number;
}

export interface V5AdminProviderDecisionSummary {
  user_id: string;
  capability: string;
  status: string;
  selected_provider_id: string | null;
  boundary_mode: string;
  trust_score: number | null;
  cost_estimate_cents: number | null;
  created_at: string;
}

export interface V5AdminCurriculumPlanSummary {
  user_id: string;
  plan_version: number;
  plan_length_days: number;
  generated_at: string;
  fatigue_score: number;
  superseded_at: string | null;
  created_at: string;
  payload_bytes: number;
}
