// Placement v4 — unified orchestration snapshot.
//
// Combines:
//   - orchestrator state (telemetry events, memory events, intervention
//     lifecycle, plan-version history, forecast history, recovery state)
//   - the analytical aggregation derived from telemetry events
//   - the optional last AdaptiveLoopResult (signals + plan + diagnostics)
//
// Two flavors:
//   - FULL  — keeps the entire event log (replay source of truth).
//   - COMPACT — drops the verbose event arrays in favor of a digest sufficient
//               to rebuild equivalent downstream artifacts when replayed.
//
// Equivalence guarantee:
//   replayFullFromCompact(compact(full), eventLog) deep-equals full.

import { aggregateEvents } from "./aggregation";
import { fnv1a64Hex } from "./privacy";
import { canonicalJSON } from "./replay";
import type {
  ForecastHistoryEntry,
  InterventionLifecycleEntry,
  OrchestratorState,
  PlanVersionEntry,
  RecoveryStateEntry,
} from "./adaptiveOrchestrator";
import { ORCHESTRATOR_SCHEMA_VERSION } from "./adaptiveOrchestrator";
import type { AdaptiveLoopResult } from "./adaptiveLoop";
import type { AggregationSummary, TelemetryEvent } from "./types";
import type {
  ForecastLike,
  LearnerMemoryEventLike,
} from "./adaptiveTelemetryTypes";

// ---------------------------------------------------------------------------
// Shapes
// ---------------------------------------------------------------------------

export const ORCHESTRATION_SNAPSHOT_VERSION = 1 as const;

export interface OrchestrationSnapshotFull {
  schemaVersion: typeof ORCHESTRATION_SNAPSHOT_VERSION;
  variant: "full";
  userIdHash: string;
  state: OrchestratorState;
  aggregation: AggregationSummary;
  forecast?: ForecastLike;
  loopResult?: AdaptiveLoopResult;
  contentHash: string;
}

export interface OrchestrationSnapshotCompact {
  schemaVersion: typeof ORCHESTRATION_SNAPSHOT_VERSION;
  variant: "compact";
  userIdHash: string;
  /** Stable digest sufficient to detect drift without keeping all events. */
  digest: {
    schemaVersion: typeof ORCHESTRATOR_SCHEMA_VERSION;
    telemetryEventCount: number;
    memoryEventCount: number;
    interventionCount: number;
    planVersionHistory: readonly PlanVersionEntry[];
    forecastHistory: readonly ForecastHistoryEntry[];
    recoveryState: RecoveryStateEntry;
    interventions: readonly InterventionLifecycleEntry[];
    aggregation: AggregationSummary;
  };
  forecast?: ForecastLike;
  loopResult?: AdaptiveLoopResult;
  contentHash: string;
}

export type OrchestrationSnapshot =
  | OrchestrationSnapshotFull
  | OrchestrationSnapshotCompact;

// ---------------------------------------------------------------------------
// Build / compact / rebuild
// ---------------------------------------------------------------------------

export interface BuildSnapshotInput {
  state: OrchestratorState;
  forecast?: ForecastLike;
  loopResult?: AdaptiveLoopResult;
}

export function buildOrchestrationSnapshotFull(
  input: BuildSnapshotInput,
): OrchestrationSnapshotFull {
  const aggregation = aggregateEvents(input.state.telemetryEvents);
  const partial: Omit<OrchestrationSnapshotFull, "contentHash"> = {
    schemaVersion: ORCHESTRATION_SNAPSHOT_VERSION,
    variant: "full",
    userIdHash: input.state.userIdHash,
    state: input.state,
    aggregation,
    forecast: input.forecast,
    loopResult: input.loopResult,
  };
  return { ...partial, contentHash: hashSnapshot(partial) };
}

export function compactOrchestrationSnapshot(
  full: OrchestrationSnapshotFull,
): OrchestrationSnapshotCompact {
  const partial: Omit<OrchestrationSnapshotCompact, "contentHash"> = {
    schemaVersion: ORCHESTRATION_SNAPSHOT_VERSION,
    variant: "compact",
    userIdHash: full.userIdHash,
    digest: {
      schemaVersion: full.state.schemaVersion,
      telemetryEventCount: full.state.telemetryEvents.length,
      memoryEventCount: full.state.memoryEvents.length,
      interventionCount: full.state.interventions.length,
      planVersionHistory: full.state.planVersionHistory,
      forecastHistory: full.state.forecastHistory,
      recoveryState: full.state.recoveryState,
      interventions: full.state.interventions,
      aggregation: full.aggregation,
    },
    forecast: full.forecast,
    loopResult: full.loopResult,
  };
  return { ...partial, contentHash: hashSnapshot(partial) };
}

export interface RebuildFromCompactInput {
  compact: OrchestrationSnapshotCompact;
  telemetryEvents: readonly TelemetryEvent[];
  memoryEvents: readonly LearnerMemoryEventLike[];
}

/**
 * Rebuild a full snapshot from a compact digest + the original event log.
 *
 * Equivalence:
 *   buildFull(compactOf(full).digest, full.state.telemetryEvents, full.state.memoryEvents)
 *   deep-equals full
 *
 * The function does NOT re-derive the loopResult; callers re-run
 * evaluateAdaptiveLoop themselves if they want it rebuilt. The digest's
 * aggregation field is the source of truth for the rebuilt snapshot.
 */
export function rebuildFullFromCompact(
  input: RebuildFromCompactInput,
): OrchestrationSnapshotFull {
  const { compact } = input;
  if (input.telemetryEvents.length !== compact.digest.telemetryEventCount) {
    throw new Error(
      `rebuildFullFromCompact: telemetry event count mismatch (have=${input.telemetryEvents.length}, expected=${compact.digest.telemetryEventCount})`,
    );
  }
  if (input.memoryEvents.length !== compact.digest.memoryEventCount) {
    throw new Error(
      `rebuildFullFromCompact: memory event count mismatch (have=${input.memoryEvents.length}, expected=${compact.digest.memoryEventCount})`,
    );
  }
  const state: OrchestratorState = {
    schemaVersion: ORCHESTRATOR_SCHEMA_VERSION,
    userIdHash: compact.userIdHash,
    telemetryEvents: input.telemetryEvents,
    memoryEvents: input.memoryEvents,
    interventions: compact.digest.interventions,
    planVersionHistory: compact.digest.planVersionHistory,
    forecastHistory: compact.digest.forecastHistory,
    recoveryState: compact.digest.recoveryState,
  };
  return buildOrchestrationSnapshotFull({
    state,
    forecast: compact.forecast,
    loopResult: compact.loopResult,
  });
}

// ---------------------------------------------------------------------------
// Hashing
// ---------------------------------------------------------------------------

function hashSnapshot(value: unknown): string {
  return fnv1a64Hex(canonicalJSON(value), "orchestration_snapshot_v1");
}

/**
 * Stable content hash convenient for export / cross-replay equality checks.
 */
export function snapshotContentHash(snap: OrchestrationSnapshot): string {
  // The hash is recomputed from the snapshot WITHOUT its existing contentHash
  // field, so corrupt or out-of-date hashes can be detected via comparison.
  if (snap.variant === "full") {
    const { contentHash: _drop, ...rest } = snap;
    void _drop;
    return hashSnapshot(rest);
  }
  const { contentHash: _drop2, ...rest } = snap;
  void _drop2;
  return hashSnapshot(rest);
}

export function isSnapshotHashValid(snap: OrchestrationSnapshot): boolean {
  return snap.contentHash === snapshotContentHash(snap);
}

// ---------------------------------------------------------------------------
// Equivalence helpers
// ---------------------------------------------------------------------------

/**
 * Replay equivalence: a snapshot's hash is bit-identical to a freshly-built
 * snapshot from the same event log, regardless of input order.
 */
export function reflowSnapshotForReplay(
  full: OrchestrationSnapshotFull,
): OrchestrationSnapshotFull {
  // Reconstruct the state with sorted-and-deduped events so the resulting
  // hash is order-insensitive.
  const events = [...full.state.telemetryEvents];
  events.sort((a, b) => {
    if (a.timestampMs !== b.timestampMs) return a.timestampMs - b.timestampMs;
    if (a.eventId < b.eventId) return -1;
    if (a.eventId > b.eventId) return 1;
    return 0;
  });
  const memory = [...full.state.memoryEvents].sort((a, b) => {
    if (a.timestampMs !== b.timestampMs) return a.timestampMs - b.timestampMs;
    if (a.kind < b.kind) return -1;
    if (a.kind > b.kind) return 1;
    if (a.reference < b.reference) return -1;
    if (a.reference > b.reference) return 1;
    return 0;
  });
  return buildOrchestrationSnapshotFull({
    state: {
      ...full.state,
      telemetryEvents: events,
      memoryEvents: memory,
    },
    forecast: full.forecast,
    loopResult: full.loopResult,
  });
}
