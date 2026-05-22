/**
 * V5 Persistence Client — typed Supabase helpers for V4-shaped data.
 *
 * All writes are gated behind V5_ENABLED. When V5 is disabled, every
 * write function returns an inert no-op result. Reads are also gated
 * because the tables may not exist in all environments.
 *
 * Design invariants:
 *   1. No edge functions, no network calls beyond the typed Supabase client.
 *   2. No runtime provider I/O.
 *   3. All V4 types imported from the V4 barrel, never redefined.
 *   4. Idempotent writes — duplicate inserts/upserts are safe.
 */

import { supabase } from "@/lib/supabaseClient";
import { V5_ENABLED } from "./v5FeatureFlag";
import type {
  V5LearnerMemoryRow,
  V5TelemetryEventRow,
  V5OrchestrationSnapshotRow,
  V5ProviderDecisionRow,
  V5CurriculumPlanRow,
} from "./persistenceTypes";

// ─── No-op sentinel ───────────────────────────────────────────────────

const V5_DISABLED = Symbol("V5_DISABLED");

type V5NoOpResult = { __v5_noop: typeof V5_DISABLED };

function v5NoOp(): V5NoOpResult {
  return { __v5_noop: V5_DISABLED };
}

function isV5NoOp<T>(result: T | V5NoOpResult): result is V5NoOpResult {
  return (
    typeof result === "object" &&
    result !== null &&
    "__v5_noop" in result &&
    (result as V5NoOpResult).__v5_noop === V5_DISABLED
  );
}

// ─── Learner Memory ───────────────────────────────────────────────────

export type SaveLearnerMemoryInput = {
  user_id: string;
  learner_key: string;
  schema_version: string;
  payload: Record<string, unknown>;
  content_hash: string;
  event_count: number;
};

export async function saveLearnerMemory(
  input: SaveLearnerMemoryInput,
): Promise<V5LearnerMemoryRow | V5NoOpResult> {
  if (!V5_ENABLED) return v5NoOp();

  const { data, error } = await supabase
    .from("v4_learner_memory")
    .upsert(
      {
        user_id: input.user_id,
        learner_key: input.learner_key,
        schema_version: input.schema_version,
        payload: input.payload,
        content_hash: input.content_hash,
        event_count: input.event_count,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
    .select()
    .single();

  if (error) throw error;
  return data as V5LearnerMemoryRow;
}

export async function loadLearnerMemory(
  user_id: string,
): Promise<V5LearnerMemoryRow | null | V5NoOpResult> {
  if (!V5_ENABLED) return v5NoOp();

  const { data, error } = await supabase
    .from("v4_learner_memory")
    .select("*")
    .eq("user_id", user_id)
    .maybeSingle();

  if (error) throw error;
  return data as V5LearnerMemoryRow | null;
}

// ─── Telemetry Events ─────────────────────────────────────────────────

export type InsertTelemetryEventInput = {
  user_id: string;
  event_id: string;
  event_type: string;
  occurred_at: string;
  session_id?: string | null;
  payload: Record<string, unknown>;
};

export async function insertTelemetryEvent(
  input: InsertTelemetryEventInput,
): Promise<V5TelemetryEventRow | V5NoOpResult> {
  if (!V5_ENABLED) return v5NoOp();

  const { data, error } = await supabase
    .from("v4_telemetry_events")
    .insert({
      user_id: input.user_id,
      event_id: input.event_id,
      event_type: input.event_type,
      occurred_at: input.occurred_at,
      session_id: input.session_id ?? null,
      payload: input.payload,
    })
    .select()
    .single();

  if (error) {
    // Idempotency: duplicate event_id → no-op, not an error
    if (error.code === "23505") return v5NoOp();
    throw error;
  }
  return data as V5TelemetryEventRow;
}

export async function loadTelemetryEvents(
  user_id: string,
  options?: { limit?: number; before?: string },
): Promise<V5TelemetryEventRow[] | V5NoOpResult> {
  if (!V5_ENABLED) return v5NoOp();

  let query = supabase
    .from("v4_telemetry_events")
    .select("*")
    .eq("user_id", user_id)
    .order("occurred_at", { ascending: false });

  if (options?.before) {
    query = query.lt("occurred_at", options.before);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as V5TelemetryEventRow[];
}

// ─── Orchestration Snapshots ──────────────────────────────────────────

export type SaveOrchestrationSnapshotInput = {
  user_id: string;
  snapshot_id: string;
  snapshot_type: "FULL" | "COMPACT";
  schema_version: string;
  content_hash: string;
  payload: Record<string, unknown>;
  device_id?: string | null;
  vector_clock?: Record<string, number> | null;
  event_count: number;
};

export async function saveOrchestrationSnapshot(
  input: SaveOrchestrationSnapshotInput,
): Promise<V5OrchestrationSnapshotRow | V5NoOpResult> {
  if (!V5_ENABLED) return v5NoOp();

  const { data, error } = await supabase
    .from("v4_orchestration_snapshots")
    .upsert(
      {
        user_id: input.user_id,
        snapshot_id: input.snapshot_id,
        snapshot_type: input.snapshot_type,
        schema_version: input.schema_version,
        content_hash: input.content_hash,
        payload: input.payload,
        device_id: input.device_id ?? null,
        vector_clock: input.vector_clock ?? null,
        event_count: input.event_count,
      },
      { onConflict: "user_id, snapshot_id" },
    )
    .select()
    .single();

  if (error) throw error;
  return data as V5OrchestrationSnapshotRow;
}

export async function loadOrchestrationSnapshot(
  user_id: string,
  snapshot_id: string,
): Promise<V5OrchestrationSnapshotRow | null | V5NoOpResult> {
  if (!V5_ENABLED) return v5NoOp();

  const { data, error } = await supabase
    .from("v4_orchestration_snapshots")
    .select("*")
    .eq("user_id", user_id)
    .eq("snapshot_id", snapshot_id)
    .maybeSingle();

  if (error) throw error;
  return data as V5OrchestrationSnapshotRow | null;
}

// ─── Provider Decisions ───────────────────────────────────────────────

export type InsertProviderDecisionInput = {
  user_id: string;
  decision_id: string;
  capability: string;
  status: "selected" | "blocked";
  selected_provider_id?: string | null;
  boundary_mode: string;
  trust_score?: number | null;
  cost_estimate_cents?: number | null;
  rejection_reasons?: readonly string[] | null;
  payload: Record<string, unknown>;
};

export async function insertProviderDecision(
  input: InsertProviderDecisionInput,
): Promise<V5ProviderDecisionRow | V5NoOpResult> {
  if (!V5_ENABLED) return v5NoOp();

  const { data, error } = await supabase
    .from("v4_provider_decisions")
    .insert({
      user_id: input.user_id,
      decision_id: input.decision_id,
      capability: input.capability,
      status: input.status,
      selected_provider_id: input.selected_provider_id ?? null,
      boundary_mode: input.boundary_mode,
      trust_score: input.trust_score ?? null,
      cost_estimate_cents: input.cost_estimate_cents ?? null,
      rejection_reasons: input.rejection_reasons ?? null,
      payload: input.payload,
    })
    .select()
    .single();

  if (error) {
    // Idempotency: duplicate decision_id → no-op
    if (error.code === "23505") return v5NoOp();
    throw error;
  }
  return data as V5ProviderDecisionRow;
}

// ─── Curriculum Plans ─────────────────────────────────────────────────

export type SaveCurriculumPlanInput = {
  user_id: string;
  plan_version: number;
  plan_length_days: 7 | 28 | 90;
  generated_at: string;
  deterministic_key: string;
  fatigue_score: number;
  focus_skills?: string[] | null;
  payload: Record<string, unknown>;
};

export async function saveCurriculumPlan(
  input: SaveCurriculumPlanInput,
): Promise<V5CurriculumPlanRow | V5NoOpResult> {
  if (!V5_ENABLED) return v5NoOp();

  // Supersede existing active plan for the same plan_length_days
  await supabase
    .from("v4_curriculum_plans")
    .update({ superseded_at: new Date().toISOString() })
    .eq("user_id", input.user_id)
    .eq("plan_length_days", input.plan_length_days)
    .is("superseded_at", null);

  const { data, error } = await supabase
    .from("v4_curriculum_plans")
    .upsert(
      {
        user_id: input.user_id,
        plan_version: input.plan_version,
        plan_length_days: input.plan_length_days,
        generated_at: input.generated_at,
        deterministic_key: input.deterministic_key,
        fatigue_score: input.fatigue_score,
        focus_skills: input.focus_skills ?? null,
        payload: input.payload,
      },
      { onConflict: "user_id, deterministic_key" },
    )
    .select()
    .single();

  if (error) throw error;
  return data as V5CurriculumPlanRow;
}

export async function loadActiveCurriculumPlan(
  user_id: string,
  plan_length_days?: 7 | 28 | 90,
): Promise<V5CurriculumPlanRow | null | V5NoOpResult> {
  if (!V5_ENABLED) return v5NoOp();

  let query = supabase
    .from("v4_curriculum_plans")
    .select("*")
    .eq("user_id", user_id)
    .is("superseded_at", null)
    .order("created_at", { ascending: false })
    .limit(1);

  if (plan_length_days) {
    query = query.eq("plan_length_days", plan_length_days);
  }

  const { data, error } = await query.maybeSingle();

  if (error) throw error;
  return data as V5CurriculumPlanRow | null;
}

// ─── Utility ──────────────────────────────────────────────────────────

export { isV5NoOp, v5NoOp };
export type { V5NoOpResult };
