/**
 * V5 Admin Observability — read-only admin dashboard queries.
 *
 * All functions query the V5-004 admin views (v4_admin_*). No writes,
 * no provider invocation, no runtime I/O beyond the existing Supabase
 * client singleton.
 *
 * Every function is gated behind V5_ENABLED and
 * V5_ADMIN_OBSERVABILITY_ENABLED. When either is false, all functions
 * return the inert no-op sentinel.
 *
 * Design invariants:
 *   1. SELECT only — no INSERT, UPDATE, DELETE, UPSERT, or RPC.
 *   2. Views only — queries target v4_admin_* views, never base tables.
 *   3. No side effects — pure data aggregation; no V4/V5 state mutation.
 *   4. RLS-enforced — admin access required (get_admin_level >= 9).
 *   5. Deterministic — all timestamps caller-supplied; no Date.now().
 *   6. No PII exposure — dashboard aggregates never include learner_key
 *      or user_id in the output surface.
 */

import { supabase } from "@/lib/supabaseClient";
import { isV5CapabilityEnabled } from "./v5FeatureFlag";
import { V5_ADMIN_DASHBOARD_SCHEMA_VERSION } from "./adminObservabilityTypes";
import type {
  V5ProviderHealthDashboard,
  V5LearnerMemoryDashboard,
  V5TelemetryDashboard,
  V5CurriculumPlanDashboard,
  V5AdminFullSnapshot,
  V5AdminQueryOptions,
} from "./adminObservabilityTypes";
import type {
  V5AdminLearnerMemorySummary,
  V5AdminTelemetryDaily,
  V5AdminProviderDecisionSummary,
  V5AdminCurriculumPlanSummary,
} from "./persistenceTypes";
import { v5NoOp, isV5NoOp, type V5NoOpResult } from "./persistence";

// ─── Guard ────────────────────────────────────────────────────────────

function guard(): boolean {
  return isV5CapabilityEnabled("admin_observability");
}

// ═══════════════════════════════════════════════════════════════════════
// Provider Health Dashboard
// ═══════════════════════════════════════════════════════════════════════

export async function getProviderHealthDashboard(
  generatedAt: string,
  options?: V5AdminQueryOptions,
): Promise<V5ProviderHealthDashboard | V5NoOpResult> {
  if (!guard()) return v5NoOp();

  const limit = options?.limit ?? 50;

  const { data, error } = await supabase
    .from("v4_admin_provider_decisions_summary")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(Math.max(limit, 200));

  if (error) throw error;

  const rows = (data ?? []) as V5AdminProviderDecisionSummary[];

  const totalDecisions = rows.length;
  let selected = 0;
  let blocked = 0;
  const byCapability: V5ProviderHealthDashboard["byCapability"] =
    {} as V5ProviderHealthDashboard["byCapability"];
  const byProvider: V5ProviderHealthDashboard["byProvider"] = {};
  const rejectionReasonCounts = new Map<string, number>();

  for (const row of rows) {
    if (row.status === "selected") selected += 1;
    else blocked += 1;

    const cap = row.capability as keyof typeof byCapability;
    if (!byCapability[cap]) {
      byCapability[cap] = {
        total: 0, selected: 0, blocked: 0,
        avgTrustScore: null, topRejectionReasons: [],
      };
    }
    const capBucket = byCapability[cap]!;
    capBucket.total += 1;
    if (row.status === "selected") capBucket.selected += 1;
    else capBucket.blocked += 1;
    if (row.trust_score !== null) {
      const prev = capBucket.avgTrustScore ?? 0;
      capBucket.avgTrustScore = Math.round(
        ((prev * (capBucket.total - 1) + row.trust_score) / capBucket.total) * 100,
      ) / 100;
    }

    const pid = row.selected_provider_id ?? "(none)";
    if (!byProvider[pid]) {
      byProvider[pid] = { selections: 0, avgTrustScore: null, lastSelectedAt: null };
    }
    const pBucket = byProvider[pid]!;
    if (row.status === "selected") {
      pBucket.selections += 1;
      if (row.trust_score !== null) {
        const prev = pBucket.avgTrustScore ?? 0;
        pBucket.avgTrustScore = Math.round(
          ((prev * (pBucket.selections - 1) + row.trust_score) / pBucket.selections) * 100,
        ) / 100;
      }
      if (!pBucket.lastSelectedAt || row.created_at > pBucket.lastSelectedAt) {
        pBucket.lastSelectedAt = row.created_at;
      }
    }

    if (row.status === "blocked") {
      const reason = "blocked";
      rejectionReasonCounts.set(reason, (rejectionReasonCounts.get(reason) ?? 0) + 1);
    }
  }

  for (const cap of Object.keys(byCapability) as (keyof typeof byCapability)[]) {
    const sorted = [...rejectionReasonCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([reason]) => reason);
    byCapability[cap]!.topRejectionReasons = sorted;
  }

  return {
    generatedAt,
    schemaVersion: V5_ADMIN_DASHBOARD_SCHEMA_VERSION,
    totalDecisions,
    byStatus: { selected, blocked },
    byCapability,
    byProvider,
    recentDecisions: rows.slice(0, limit),
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Learner Memory Dashboard
// ═══════════════════════════════════════════════════════════════════════

export async function getLearnerMemoryDashboard(
  generatedAt: string,
  options?: V5AdminQueryOptions,
): Promise<V5LearnerMemoryDashboard | V5NoOpResult> {
  if (!guard()) return v5NoOp();

  const limit = options?.limit ?? 50;

  const { data, error } = await supabase
    .from("v4_admin_learner_memory_summary")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(500);

  if (error) throw error;

  const rows = (data ?? []) as V5AdminLearnerMemorySummary[];

  const totalLearners = rows.length;
  const totalEvents = rows.reduce((sum, r) => sum + r.event_count, 0);
  const avgEventCount = totalLearners > 0 ? Math.round(totalEvents / totalLearners) : 0;
  const bySchemaVersion: Record<string, number> = {};
  for (const row of rows) {
    bySchemaVersion[row.schema_version] = (bySchemaVersion[row.schema_version] ?? 0) + 1;
  }
  const largestPayloads = [...rows]
    .sort((a, b) => (b.payload_bytes ?? 0) - (a.payload_bytes ?? 0))
    .slice(0, 10);

  return {
    generatedAt,
    schemaVersion: V5_ADMIN_DASHBOARD_SCHEMA_VERSION,
    totalLearners,
    avgEventCount,
    bySchemaVersion,
    largestPayloads,
    recentlyUpdated: rows.slice(0, limit),
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Telemetry Dashboard
// ═══════════════════════════════════════════════════════════════════════

export async function getTelemetryDashboard(
  generatedAt: string,
  options?: V5AdminQueryOptions,
): Promise<V5TelemetryDashboard | V5NoOpResult> {
  if (!guard()) return v5NoOp();

  const { data, error } = await supabase
    .from("v4_admin_telemetry_daily")
    .select("*")
    .order("event_date", { ascending: false })
    .limit(1000);

  if (error) throw error;

  const rows = (data ?? []) as V5AdminTelemetryDaily[];

  const totalEvents = rows.reduce((sum, r) => sum + r.event_count, 0);
  const byEventType: Record<string, number> = {};
  for (const row of rows) {
    byEventType[row.event_type] = (byEventType[row.event_type] ?? 0) + row.event_count;
  }
  const topEventTypes = Object.entries(byEventType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([type]) => type);

  return {
    generatedAt,
    schemaVersion: V5_ADMIN_DASHBOARD_SCHEMA_VERSION,
    totalEvents,
    byEventType,
    byDay: rows.slice(0, 30),
    topEventTypes,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Curriculum Plans Dashboard
// ═══════════════════════════════════════════════════════════════════════

export async function getCurriculumPlanDashboard(
  generatedAt: string,
  options?: V5AdminQueryOptions,
): Promise<V5CurriculumPlanDashboard | V5NoOpResult> {
  if (!guard()) return v5NoOp();

  const limit = options?.limit ?? 50;

  const { data, error } = await supabase
    .from("v4_admin_curriculum_plans_summary")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) throw error;

  const rows = (data ?? []) as V5AdminCurriculumPlanSummary[];

  const totalPlans = rows.length;
  const activePlans = rows.filter((r) => r.superseded_at === null).length;
  const byPlanLength: Record<string, number> = {};
  let fatigueSum = 0;
  for (const row of rows) {
    byPlanLength[String(row.plan_length_days)] = (byPlanLength[String(row.plan_length_days)] ?? 0) + 1;
    fatigueSum += row.fatigue_score ?? 0;
  }
  const avgFatigueScore = totalPlans > 0
    ? Math.round((fatigueSum / totalPlans) * 100) / 100
    : 0;

  return {
    generatedAt,
    schemaVersion: V5_ADMIN_DASHBOARD_SCHEMA_VERSION,
    totalPlans,
    activePlans,
    byPlanLength,
    avgFatigueScore,
    recentlyGenerated: rows.slice(0, limit),
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Full admin snapshot
// ═══════════════════════════════════════════════════════════════════════

export async function getAdminFullSnapshot(
  generatedAt: string,
  options?: V5AdminQueryOptions,
): Promise<V5AdminFullSnapshot | V5NoOpResult> {
  if (!guard()) return v5NoOp();

  const [providerHealth, learnerMemory, telemetry, curriculumPlans] =
    await Promise.all([
      options?.skipProviderHealth
        ? Promise.resolve(null)
        : getProviderHealthDashboard(generatedAt, options),
      options?.skipLearnerMemory
        ? Promise.resolve(null)
        : getLearnerMemoryDashboard(generatedAt, options),
      options?.skipTelemetry
        ? Promise.resolve(null)
        : getTelemetryDashboard(generatedAt, options),
      options?.skipCurriculumPlans
        ? Promise.resolve(null)
        : getCurriculumPlanDashboard(generatedAt, options),
    ]);

  return {
    generatedAt,
    schemaVersion: V5_ADMIN_DASHBOARD_SCHEMA_VERSION,
    providerHealth: isV5NoOp(providerHealth) ? null : providerHealth,
    learnerMemory: isV5NoOp(learnerMemory) ? null : learnerMemory,
    telemetry: isV5NoOp(telemetry) ? null : telemetry,
    curriculumPlans: isV5NoOp(curriculumPlans) ? null : curriculumPlans,
  };
}

export { isV5NoOp, v5NoOp };
export type { V5NoOpResult };
