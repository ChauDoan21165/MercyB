// Placement v4 telemetry — privacy primitives.
//
// Three guarantees:
//   1. k-anonymity gating: aggregate buckets with fewer than k contributing
//      users are suppressed (or merged into a residual bucket).
//   2. Pseudonymous user IDs: this module never accepts a raw user id; the
//      caller hashes upstream. We provide a deterministic browser-safe FNV-1a
//      helper for analytical pseudonymization. It is NOT cryptographically
//      secure — production-secure hashing must be HMAC-SHA-256 server-side
//      using a high-entropy secret salt before persistence.
//   3. Field redaction: optional free-text fields (none present today;
//      this is a forward-compatibility surface) is stripped before export.

import { aggregateEvents } from "./aggregation";
import type {
  AggregationSummary,
  LessonAggregate,
  TelemetryEvent,
  UserAggregate,
} from "./types";

export interface PrivacyOptions {
  /**
   * Minimum unique users a lesson aggregate needs before it is exposed.
   * Aggregates below the threshold are removed. Default 5.
   */
  kAnonThreshold?: number;
  /**
   * Whether the redacted summary should still expose user-level rows.
   * When false (default), the users array is replaced with an empty list
   * and counts are preserved only in lesson aggregates.
   */
  includeUserRows?: boolean;
  /**
   * If true, user-row exposure additionally strips the per-user
   * `cefrTransitions` and `activeDays` arrays (which can fingerprint a
   * user). Default true.
   */
  stripUserFingerprintingFields?: boolean;
}

/**
 * Produce a privacy-preserving aggregate view suitable for sharing across
 * trust boundaries (e.g. with a recommender component or stored as a
 * snapshot). The original AggregationSummary is left unmodified.
 */
export function redactForRelease(
  summary: AggregationSummary,
  opts: PrivacyOptions = {},
): AggregationSummary {
  const k = opts.kAnonThreshold ?? 5;
  if (!Number.isInteger(k) || k < 1) {
    throw new Error("kAnonThreshold must be a positive integer");
  }
  const includeUserRows = opts.includeUserRows ?? false;
  const stripFingerprinting = opts.stripUserFingerprintingFields ?? true;

  const lessons: LessonAggregate[] = summary.lessons
    .filter((l) => l.uniqueUsers >= k)
    .map(stripLessonIdentifiers);

  let users: UserAggregate[] = [];
  if (includeUserRows) {
    users = summary.users.map((u) =>
      stripFingerprinting ? stripUserFingerprintingFieldsFn(u) : u,
    );
  }

  return {
    eventCount: summary.eventCount,
    lessonCount: lessons.length,
    userCount: users.length,
    earliestMs: summary.earliestMs,
    latestMs: summary.latestMs,
    lessons,
    users,
  };
}

function stripLessonIdentifiers(l: LessonAggregate): LessonAggregate {
  // Strip the per-lesson userIdHashes array — even pseudonymous IDs become
  // a fingerprint when crossed with cohort labels.
  return {
    lessonId: l.lessonId,
    starts: l.starts,
    completions: l.completions,
    retries: l.retries,
    dropoffs: l.dropoffs,
    speakingRetries: l.speakingRetries,
    hesitationLoops: l.hesitationLoops,
    totalScoreRatio: l.totalScoreRatio,
    totalScoreSamples: l.totalScoreSamples,
    totalDurationMs: l.totalDurationMs,
    durationSamples: l.durationSamples,
    uniqueUsers: l.uniqueUsers,
    userIdHashes: [],
  };
}

function stripUserFingerprintingFieldsFn(u: UserAggregate): UserAggregate {
  return {
    userIdHash: u.userIdHash,
    sessions: u.sessions,
    sessionIdHashes: [],
    lessonsStarted: u.lessonsStarted,
    lessonsCompleted: u.lessonsCompleted,
    lessonsDroppedOff: u.lessonsDroppedOff,
    totalRetries: u.totalRetries,
    totalSpeakingRetries: u.totalSpeakingRetries,
    totalHesitationLoops: u.totalHesitationLoops,
    maxStreakDays: u.maxStreakDays,
    activeDays: [],
    firstSeenMs: u.firstSeenMs,
    lastSeenMs: u.lastSeenMs,
    cefrTransitions: [],
  };
}

/**
 * Deterministic, browser-safe FNV-1a 64-bit hash, returned as a 16-char
 * lowercase hex string. The salt is mixed in via prefix.
 *
 * WARNING: not cryptographically secure. Use only for client-side
 * pseudonymization of identifiers that have already been HMAC-SHA-256-salted
 * server-side. The point of this helper is making analytical replay
 * deterministic across environments without dragging in WebCrypto async APIs.
 */
export function fnv1a64Hex(input: string, salt: string): string {
  const buffer = `${salt}::${input}`;
  // FNV-1a 64-bit constants as BigInt to avoid 53-bit float truncation.
  const FNV_OFFSET = 0xcbf29ce484222325n;
  const FNV_PRIME = 0x100000001b3n;
  const MASK = 0xffffffffffffffffn;
  let hash = FNV_OFFSET;
  for (let i = 0; i < buffer.length; i++) {
    hash ^= BigInt(buffer.charCodeAt(i) & 0xff);
    hash = (hash * FNV_PRIME) & MASK;
  }
  return hash.toString(16).padStart(16, "0");
}

/**
 * One-call pipeline: validate-and-aggregate events, then return the
 * release-redacted summary. Useful for tests asserting end-to-end privacy.
 */
export function aggregateForRelease(
  events: readonly TelemetryEvent[],
  opts: PrivacyOptions = {},
): AggregationSummary {
  const raw = aggregateEvents(events);
  return redactForRelease(raw, opts);
}
