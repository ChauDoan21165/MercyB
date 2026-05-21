// Placement v4 telemetry — replay-safe summary reconstruction.
//
// "Replay-safe" means: given the same event sequence as input — regardless of
// the original order — the reconstructed summary is byte-for-byte identical.
//
// This module exists so we can store a compressed snapshot (the result of
// aggregation), then later regenerate the exact same downstream artifacts
// (effectiveness scores, retention signals) by re-running the analytical
// core. Replay verification is how we audit that V4 metric production has
// not silently drifted.

import { aggregateEvents } from "./aggregation";
import { clusterWeakLessons } from "./clustering";
import { buildCohortDriftReport } from "./cohort";
import { scoreAllLessons } from "./effectiveness";
import {
  extractRetentionSignals,
  retentionStabilityFingerprint,
} from "./retention";
import type {
  AggregationSummary,
  CohortAssignment,
  CohortDriftReport,
  EffectivenessScore,
  RetentionSignal,
  TelemetryEvent,
  WeakPatternCluster,
} from "./types";

export interface ReplaySafeSnapshot {
  /** Version stamp so future readers can detect schema drift. */
  schemaVersion: 1;
  /** The deterministic aggregate. */
  aggregation: AggregationSummary;
  /** Sorted effectiveness scores (lessonId asc). */
  effectiveness: readonly EffectivenessScore[];
  /** Sorted retention signals (userIdHash asc). */
  retention: readonly RetentionSignal[];
  /** Cohort drift, when assignments are supplied. */
  cohortDrift?: CohortDriftReport;
  /** Weak-pattern clusters. */
  clusters: readonly WeakPatternCluster[];
  /** Inputs that participated, so replay knows which horizon to use. */
  horizonMs: number;
}

export interface BuildSnapshotOptions {
  horizonMs: number;
  cohortAssignments?: readonly CohortAssignment[];
  kAnonThreshold?: number;
}

export function buildReplaySnapshot(
  events: readonly TelemetryEvent[],
  opts: BuildSnapshotOptions,
): ReplaySafeSnapshot {
  const aggregation = aggregateEvents(events);
  const effectiveness = scoreAllLessons(aggregation);
  const retention = extractRetentionSignals(aggregation, {
    horizonMs: opts.horizonMs,
  });
  const clusters = clusterWeakLessons(aggregation);
  const cohortDrift =
    opts.cohortAssignments && opts.cohortAssignments.length > 0
      ? buildCohortDriftReport(aggregation, opts.cohortAssignments, {
          horizonMs: opts.horizonMs,
          kAnonThreshold: opts.kAnonThreshold ?? 5,
        })
      : undefined;
  return {
    schemaVersion: 1,
    aggregation,
    effectiveness,
    retention,
    clusters,
    cohortDrift,
    horizonMs: opts.horizonMs,
  };
}

/**
 * Canonical JSON serialization used for cross-replay equality assertions.
 *
 * Object keys are emitted in alphabetical order at every depth so that two
 * snapshots derived from the same input produce identical strings. Array
 * order is preserved (the aggregation pipeline already sorts arrays
 * deterministically).
 */
export function canonicalJSON(value: unknown): string {
  return JSON.stringify(canonicalize(value));
}

function canonicalize(value: unknown): unknown {
  if (value === null) return null;
  if (Array.isArray(value)) return value.map(canonicalize);
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    const out: Record<string, unknown> = {};
    for (const k of keys) {
      out[k] = canonicalize(obj[k]);
    }
    return out;
  }
  return value;
}

/**
 * Light-weight fingerprint used by tests to assert metric stability across
 * shuffled-input replays without comparing entire snapshots.
 */
export function replayFingerprint(snapshot: ReplaySafeSnapshot): string {
  const retention = retentionStabilityFingerprint(snapshot.retention);
  const effectivenessSum = snapshot.effectiveness.reduce(
    (acc, e) => acc + Math.round(e.composite * 1_000_000),
    0,
  );
  const clusterSig = snapshot.clusters
    .map((c) => `${c.id}:${c.lessonIds.length}`)
    .join("|");
  return [
    `schema=${snapshot.schemaVersion}`,
    `eventCount=${snapshot.aggregation.eventCount}`,
    `lessons=${snapshot.aggregation.lessonCount}`,
    `users=${snapshot.aggregation.userCount}`,
    `effComp=${effectivenessSum}`,
    `bucketLow=${retention.bucketCounts.low}`,
    `bucketMed=${retention.bucketCounts.medium}`,
    `bucketHigh=${retention.bucketCounts.high}`,
    `bucketLost=${retention.bucketCounts.lost}`,
    `densitySumMicros=${retention.densitySumMicros}`,
    `clusters=${clusterSig}`,
    `horizon=${snapshot.horizonMs}`,
  ].join(";");
}
