// Placement v4 — cross-device adaptive convergence.
//
// Deterministic merge semantics for orchestration snapshots that travel
// across devices, browsers, and offline sessions. Properties guaranteed:
//
//   - Convergence: merging the same set of device snapshots in any order
//     yields a snapshot with the same contentHash.
//   - Idempotence: merge(merge(a, b), b) == merge(a, b).
//   - Corruption detection: schema mismatch / hash mismatch / required-field
//     loss is surfaced rather than silently propagated.
//
// No network calls. No Date.now. Vector clocks are simple monotonic seq
// counts per pseudonymous deviceId.

import {
  buildOrchestrationSnapshotFull,
  snapshotContentHash,
} from "./orchestrationSnapshot";
import type {
  OrchestrationSnapshot,
  OrchestrationSnapshotFull,
} from "./orchestrationSnapshot";
import {
  ORCHESTRATOR_SCHEMA_VERSION,
} from "./adaptiveOrchestrator";
import type {
  ForecastHistoryEntry,
  InterventionLifecycleEntry,
  OrchestratorState,
  PlanVersionEntry,
  RecoveryStateEntry,
} from "./adaptiveOrchestrator";
import type { LearnerMemoryEventLike } from "./adaptiveTelemetryTypes";
import type { TelemetryEvent } from "./types";

// ---------------------------------------------------------------------------
// Shapes
// ---------------------------------------------------------------------------

export type VectorClock = Readonly<Record<string, number>>;

export interface DeviceSnapshot {
  /** Pseudonymous device identifier (e.g. fnv1a64 of installation id + salt). */
  deviceId: string;
  /** Vector clock with deviceId → highest seq the snapshot has observed. */
  vectorClock: VectorClock;
  snapshot: OrchestrationSnapshotFull;
}

export type CorruptionReason =
  | "schema_version_mismatch"
  | "hash_mismatch"
  | "userid_mismatch"
  | "negative_clock"
  | "missing_required_field";

export interface CorruptionReport {
  isCorrupted: boolean;
  reasons: readonly CorruptionReason[];
}

// ---------------------------------------------------------------------------
// Corruption detection
// ---------------------------------------------------------------------------

export function detectCorruption(device: DeviceSnapshot): CorruptionReport {
  const reasons: CorruptionReason[] = [];
  if (device.snapshot.state.schemaVersion !== ORCHESTRATOR_SCHEMA_VERSION) {
    reasons.push("schema_version_mismatch");
  }
  if (snapshotContentHash(device.snapshot) !== device.snapshot.contentHash) {
    reasons.push("hash_mismatch");
  }
  if (device.snapshot.userIdHash !== device.snapshot.state.userIdHash) {
    reasons.push("userid_mismatch");
  }
  for (const v of Object.values(device.vectorClock)) {
    if (!Number.isInteger(v) || v < 0) {
      reasons.push("negative_clock");
      break;
    }
  }
  if (!device.snapshot.state.userIdHash) {
    reasons.push("missing_required_field");
  }
  return { isCorrupted: reasons.length > 0, reasons };
}

// ---------------------------------------------------------------------------
// Merge
// ---------------------------------------------------------------------------

export interface MergeOptions {
  /** When true (default), corrupt device snapshots are dropped from the merge. */
  dropCorrupt?: boolean;
}

export interface MergeResult {
  merged: DeviceSnapshot;
  /** Reports for any input device snapshot that was rejected. */
  rejected: readonly { deviceId: string; reasons: readonly CorruptionReason[] }[];
}

/**
 * Merge an arbitrary number of device snapshots deterministically.
 *
 * The merged snapshot's deviceId is the lexicographically-smallest contributing
 * deviceId — this is purely so the result is itself stable; callers should
 * treat it as a logical merge result, not a per-device id.
 */
export function mergeDeviceSnapshots(
  devices: readonly DeviceSnapshot[],
  opts: MergeOptions = {},
): MergeResult {
  if (devices.length === 0) {
    throw new Error("mergeDeviceSnapshots: at least one device snapshot required");
  }
  const dropCorrupt = opts.dropCorrupt ?? true;
  const rejected: { deviceId: string; reasons: readonly CorruptionReason[] }[] = [];
  const usable: DeviceSnapshot[] = [];
  for (const dev of devices) {
    const report = detectCorruption(dev);
    if (report.isCorrupted) {
      rejected.push({ deviceId: dev.deviceId, reasons: report.reasons });
      if (dropCorrupt) continue;
      throw new Error(
        `mergeDeviceSnapshots: corrupt snapshot from ${dev.deviceId}: ${report.reasons.join(",")}`,
      );
    }
    usable.push(dev);
  }
  if (usable.length === 0) {
    throw new Error("mergeDeviceSnapshots: no usable snapshots remain after corruption filter");
  }

  const userIdHash = usable[0].snapshot.state.userIdHash;
  for (const dev of usable) {
    if (dev.snapshot.state.userIdHash !== userIdHash) {
      throw new Error(
        `mergeDeviceSnapshots: cannot merge snapshots from different users (${userIdHash} vs ${dev.snapshot.state.userIdHash})`,
      );
    }
  }

  // Sort devices so the merge order is deterministic regardless of input order.
  const sorted = [...usable].sort((a, b) =>
    a.deviceId < b.deviceId ? -1 : a.deviceId > b.deviceId ? 1 : 0,
  );

  // 1. Merge vector clocks: max per deviceId.
  const mergedClock: Record<string, number> = {};
  for (const dev of sorted) {
    for (const [k, v] of Object.entries(dev.vectorClock)) {
      mergedClock[k] = Math.max(mergedClock[k] ?? 0, v);
    }
  }

  // 2. Merge telemetry events: union by eventId.
  const telemetryById = new Map<string, TelemetryEvent>();
  for (const dev of sorted) {
    for (const ev of dev.snapshot.state.telemetryEvents) {
      if (!telemetryById.has(ev.eventId)) telemetryById.set(ev.eventId, ev);
    }
  }
  const telemetryEvents = [...telemetryById.values()].sort((a, b) => {
    if (a.timestampMs !== b.timestampMs) return a.timestampMs - b.timestampMs;
    if (a.eventId < b.eventId) return -1;
    if (a.eventId > b.eventId) return 1;
    return 0;
  });

  // 3. Merge memory events: union by (timestamp, kind, reference).
  const memorySeen = new Set<string>();
  const memoryEvents: LearnerMemoryEventLike[] = [];
  for (const dev of sorted) {
    for (const ev of dev.snapshot.state.memoryEvents) {
      const key = `${ev.timestampMs}::${ev.kind}::${ev.reference}`;
      if (memorySeen.has(key)) continue;
      memorySeen.add(key);
      memoryEvents.push(ev);
    }
  }
  memoryEvents.sort((a, b) => {
    if (a.timestampMs !== b.timestampMs) return a.timestampMs - b.timestampMs;
    if (a.kind < b.kind) return -1;
    if (a.kind > b.kind) return 1;
    if (a.reference < b.reference) return -1;
    if (a.reference > b.reference) return 1;
    return 0;
  });

  // 4. Merge intervention lifecycle: highest status, latest timestamp wins.
  const interventionsById = new Map<string, InterventionLifecycleEntry>();
  for (const dev of sorted) {
    for (const iv of dev.snapshot.state.interventions) {
      const existing = interventionsById.get(iv.interventionId);
      if (!existing) {
        interventionsById.set(iv.interventionId, iv);
        continue;
      }
      interventionsById.set(iv.interventionId, mergeInterventionLifecycle(existing, iv));
    }
  }
  const interventions = [...interventionsById.values()].sort((a, b) =>
    a.interventionId < b.interventionId ? -1 : a.interventionId > b.interventionId ? 1 : 0,
  );

  // 5. Plan version history: union, ordered by (timestamp, version).
  const planSeen = new Set<string>();
  const planVersionHistory: PlanVersionEntry[] = [];
  for (const dev of sorted) {
    for (const entry of dev.snapshot.state.planVersionHistory) {
      const key = `${entry.planVersion}::${entry.generatedAtMs}`;
      if (planSeen.has(key)) continue;
      planSeen.add(key);
      planVersionHistory.push(entry);
    }
  }
  planVersionHistory.sort((a, b) => {
    if (a.generatedAtMs !== b.generatedAtMs) return a.generatedAtMs - b.generatedAtMs;
    return a.planVersion < b.planVersion ? -1 : 1;
  });

  // 6. Forecast history: union by forecastId.
  const forecastSeen = new Set<string>();
  const forecastHistory: ForecastHistoryEntry[] = [];
  for (const dev of sorted) {
    for (const entry of dev.snapshot.state.forecastHistory) {
      if (forecastSeen.has(entry.forecastId)) continue;
      forecastSeen.add(entry.forecastId);
      forecastHistory.push(entry);
    }
  }
  forecastHistory.sort((a, b) => {
    if (a.ingestedMs !== b.ingestedMs) return a.ingestedMs - b.ingestedMs;
    return a.forecastId < b.forecastId ? -1 : 1;
  });

  // 7. Recovery state: latest by (endedMs ?? startedMs ?? 0).
  const recoveryState: RecoveryStateEntry = sorted
    .map((d) => d.snapshot.state.recoveryState)
    .reduce((acc, candidate) => mergeRecoveryState(acc, candidate));

  const mergedState: OrchestratorState = {
    schemaVersion: ORCHESTRATOR_SCHEMA_VERSION,
    userIdHash,
    telemetryEvents,
    memoryEvents,
    interventions,
    planVersionHistory,
    forecastHistory,
    recoveryState,
  };

  const mergedSnapshot = buildOrchestrationSnapshotFull({
    state: mergedState,
  });

  return {
    merged: {
      deviceId: sorted[0].deviceId,
      vectorClock: mergedClock,
      snapshot: mergedSnapshot,
    },
    rejected,
  };
}

const STATUS_RANK: Record<InterventionLifecycleEntry["status"], number> = {
  issued: 0,
  acknowledged: 1,
  resolved: 2,
};

function mergeInterventionLifecycle(
  a: InterventionLifecycleEntry,
  b: InterventionLifecycleEntry,
): InterventionLifecycleEntry {
  // Highest status wins. If equal status, latest timestamp wins.
  if (STATUS_RANK[a.status] !== STATUS_RANK[b.status]) {
    return STATUS_RANK[a.status] > STATUS_RANK[b.status] ? a : b;
  }
  const aTs = a.resolvedMs ?? a.acknowledgedMs ?? a.issuedMs;
  const bTs = b.resolvedMs ?? b.acknowledgedMs ?? b.issuedMs;
  if (aTs === bTs) {
    // Deterministic tie-break: deep-merge fields with the larger of acknowledged/resolved.
    return {
      ...a,
      acknowledgedMs: Math.max(a.acknowledgedMs ?? 0, b.acknowledgedMs ?? 0) || undefined,
      resolvedMs: Math.max(a.resolvedMs ?? 0, b.resolvedMs ?? 0) || undefined,
      resolutionReason: a.resolutionReason ?? b.resolutionReason,
    };
  }
  return aTs > bTs ? a : b;
}

function mergeRecoveryState(
  a: RecoveryStateEntry,
  b: RecoveryStateEntry,
): RecoveryStateEntry {
  // Latest event wins. "Latest" = max of endedMs / startedMs / 0.
  const aTs = a.endedMs ?? a.startedMs ?? 0;
  const bTs = b.endedMs ?? b.startedMs ?? 0;
  if (aTs === bTs) {
    // Tie: prefer the "active" state if either is active.
    if (a.kind === "active" || b.kind === "active") {
      return {
        kind: "active",
        startedMs: Math.max(a.startedMs ?? 0, b.startedMs ?? 0) || undefined,
        reasonCode: a.reasonCode ?? b.reasonCode,
      };
    }
  }
  return aTs >= bTs ? a : b;
}

// ---------------------------------------------------------------------------
// Convergence diagnostics
// ---------------------------------------------------------------------------

/**
 * Helper for tests + tooling: produce a content hash for a (sorted) set of
 * device snapshots. Order-insensitive — the underlying merge already sorts.
 */
export function convergenceHash(devices: readonly DeviceSnapshot[]): string {
  return mergeDeviceSnapshots(devices).merged.snapshot.contentHash;
}

/**
 * Convergence check: two arbitrary orderings of the same device set must
 * produce the same merged contentHash.
 */
export function isConvergent(
  a: readonly DeviceSnapshot[],
  b: readonly DeviceSnapshot[],
): boolean {
  if (a.length !== b.length) return false;
  return convergenceHash(a) === convergenceHash(b);
}

// Re-export the public types for downstream consumers.
export type { OrchestrationSnapshot } from "./orchestrationSnapshot";
