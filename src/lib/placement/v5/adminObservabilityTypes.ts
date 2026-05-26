/**
 * V5 Admin Observability Types — dashboard aggregate shapes.
 *
 * These types define the read-only dashboard surfaces exposed by
 * adminObservability.ts. All aggregates are derived from the V5-004
 * admin views (v4_admin_*). No direct table access.
 *
 * Design invariants:
 *   1. All timestamps are caller-supplied — deterministic, replay-safe.
 *   2. No PII — user-level data is aggregated; individual learner
 *      keys are never exposed in aggregate dashboards.
 *   3. All types are read-only — no mutation methods, no write paths.
 */

import type {
  PlacementV4ProviderCapability,
} from "@/lib/placement/v4";

import type {
  V5AdminLearnerMemorySummary,
  V5AdminTelemetryDaily,
  V5AdminProviderDecisionSummary,
  V5AdminCurriculumPlanSummary,
} from "./persistenceTypes";

// ─── Shared ───────────────────────────────────────────────────────────

export interface V5AdminDashboardHeader {
  /** Caller-supplied ISO-8601 timestamp. Deterministic, not Date.now(). */
  generatedAt: string;
  /** Schema version of the dashboard shape. */
  schemaVersion: string;
}

export const V5_ADMIN_DASHBOARD_SCHEMA_VERSION = "v5-admin-dashboard-v1";

// ─── Provider Health ──────────────────────────────────────────────────

export interface V5ProviderHealthDashboard extends V5AdminDashboardHeader {
  totalDecisions: number;
  byStatus: {
    selected: number;
    blocked: number;
  };
  byCapability: Record<
    PlacementV4ProviderCapability,
    {
      total: number;
      selected: number;
      blocked: number;
      avgTrustScore: number | null;
      topRejectionReasons: readonly string[];
    }
  >;
  byProvider: Record<
    string,
    {
      selections: number;
      avgTrustScore: number | null;
      lastSelectedAt: string | null;
    }
  >;
  recentDecisions: readonly V5AdminProviderDecisionSummary[];
}

// ─── Learner Memory ───────────────────────────────────────────────────

export interface V5LearnerMemoryDashboard extends V5AdminDashboardHeader {
  totalLearners: number;
  avgEventCount: number;
  bySchemaVersion: Record<string, number>;
  largestPayloads: readonly V5AdminLearnerMemorySummary[];
  recentlyUpdated: readonly V5AdminLearnerMemorySummary[];
}

// ─── Telemetry ────────────────────────────────────────────────────────

export interface V5TelemetryDashboard extends V5AdminDashboardHeader {
  totalEvents: number;
  byEventType: Record<string, number>;
  byDay: readonly V5AdminTelemetryDaily[];
  topEventTypes: readonly string[];
}

// ─── Curriculum Plans ─────────────────────────────────────────────────

export interface V5CurriculumPlanDashboard extends V5AdminDashboardHeader {
  totalPlans: number;
  activePlans: number;
  byPlanLength: Record<string, number>;
  avgFatigueScore: number;
  recentlyGenerated: readonly V5AdminCurriculumPlanSummary[];
}

// ─── Full admin snapshot ──────────────────────────────────────────────

export interface V5AdminFullSnapshot extends V5AdminDashboardHeader {
  providerHealth: V5ProviderHealthDashboard | null;
  learnerMemory: V5LearnerMemoryDashboard | null;
  telemetry: V5TelemetryDashboard | null;
  curriculumPlans: V5CurriculumPlanDashboard | null;
}

// ─── Query options ────────────────────────────────────────────────────

export interface V5AdminQueryOptions {
  /** Max rows for recent-decisions / recently-updated lists. Default 50. */
  limit?: number;
  /** If true, skip provider-health query. */
  skipProviderHealth?: boolean;
  /** If true, skip learner-memory query. */
  skipLearnerMemory?: boolean;
  /** If true, skip telemetry query. */
  skipTelemetry?: boolean;
  /** If true, skip curriculum-plans query. */
  skipCurriculumPlans?: boolean;
}
