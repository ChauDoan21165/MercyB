/**
 * Placement V4 — Learner Memory and Longitudinal Profile
 *
 * Deterministic persistence layer that V4 uses to remember how a learner
 * evolves over months, not just a single placement session. The shape is
 * an append-only event log plus derived projections (snapshots, CEFR
 * timeline, rolling skill trends, lesson mastery) that can be fully
 * reconstructed from the log alone — see `replayEvents`.
 *
 * Design invariants:
 *   1. No PII expansion. The learner is identified only by an opaque
 *      `learnerKey` chosen upstream (e.g., FNV/SHA hash of profile id).
 *      We never accept or store email/name/handle here.
 *   2. No hidden identifiers. Every id is derived from declared inputs
 *      via the local `stableFnv1a` so replay produces byte-identical ids.
 *   3. Deterministic merge. When two snapshots collide on snapshotId, the
 *      `compareSnapshots` tie-breaker chain decides the winner; ties at
 *      every level fall back to lexicographic order.
 *   4. Replay-safe serialization. `serializeLearnerMemory` produces a
 *      key-sorted canonical JSON whose hash is the memory fingerprint.
 *   5. Confidence decay. Old observations lose weight exponentially with
 *      a configurable half-life; nothing in this module reads wall-clock
 *      time — callers pass `atIso`.
 *
 * Schema details and replay invariants live in
 * `src/lib/placement/v4/learnerMemory.SCHEMA.md`.
 */

// Relative import: `@/types/placement-v3` is intercepted by an ambient
// `declare module` augmentation in `../v3/placement-v3-types.d.ts` that
// only exposes the legacy v3 surface. The placement-v4 modules use the
// direct relative path to reach the full type set in
// `src/types/placement-v3.ts`. progressionSimulator.ts follows the same
// convention.
import type {
  CEFRLevel,
  PlacementV3L1InterferenceFlag,
  PlacementV3Modality,
  PlacementV3PerSkillProfile,
} from "../../../types/placement-v3";

// ─── Schema version ───────────────────────────────────────────────────

export const LEARNER_MEMORY_SCHEMA_VERSION = "placement-v4-learner-memory-v1";

// ─── Constants ────────────────────────────────────────────────────────

const DAY_MS = 24 * 60 * 60 * 1000;

/** Confidence halves after this many days without fresh evidence. */
export const DEFAULT_CONFIDENCE_HALF_LIFE_DAYS = 30;

/** Rolling window for skill-trend aggregation. */
export const DEFAULT_TREND_WINDOW_DAYS = 30;

/** Snapshot retention. Oldest snapshots prune first when either bound is hit. */
export const DEFAULT_SNAPSHOT_RETENTION_DAYS = 365;
export const DEFAULT_SNAPSHOT_RETENTION_COUNT = 200;

/** Event-log retention. Wider than snapshots: the log is the source of truth. */
export const DEFAULT_EVENT_RETENTION_DAYS = 365 * 2;
export const DEFAULT_EVENT_RETENTION_COUNT = 1000;

const MASTERY_LEVELS = ["none", "exposed", "practicing", "competent", "mastered"] as const;
export type LessonMasteryLevel = (typeof MASTERY_LEVELS)[number];

const MODALITIES: readonly PlacementV3Modality[] = [
  "speaking",
  "listening",
  "reading",
  "writing",
  "conversation",
] as const;

const CEFR_ORDER: readonly CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

const MAX_LEARNER_KEY_LEN = 128;
const MAX_SOURCE_ID_LEN = 128;
const MAX_ROOM_ID_LEN = 256;
const MAX_PATTERN_ID_LEN = 64;
const MAX_EVIDENCE_LEN = 512;

// ─── Public types ─────────────────────────────────────────────────────

export type LearnerKey = string;

export interface LearnerProgressionSnapshot {
  /** Stable id derived from (learnerKey, recordedAt, sourceId). */
  snapshotId: string;
  /** ISO-8601 UTC timestamp at which the placement evidence was captured. */
  recordedAt: string;
  /** Opaque source identifier (e.g., `placement-v3-session:<id>`). */
  sourceId: string;
  overallCefr: CEFRLevel;
  overallConfidence: number;
  perSkill: PlacementV3PerSkillProfile;
  l1Flags: PlacementV3L1InterferenceFlag[];
}

export interface SkillTrendBucket {
  modality: PlacementV3Modality;
  windowDays: number;
  /** Recency-weighted mean of CEFR ordinals in the window. */
  meanLevelOrdinal: number;
  meanConfidence: number;
  sampleCount: number;
  lastObservedCefr: CEFRLevel;
  lastObservedAt: string;
}

export interface LessonMasteryRecord {
  roomId: string;
  attempts: number;
  bestScore: number;
  lastAttemptAt: string;
  masteryLevel: LessonMasteryLevel;
}

export interface CefrTimelinePoint {
  at: string;
  overallCefr: CEFRLevel;
  overallConfidence: number;
  sourceId: string;
}

export type LearnerMemoryEventKind =
  | "placement_snapshot"
  | "lesson_mastery"
  | "skill_trend_recompute"
  | "memory_pruned";

export type LearnerMemoryEventPayload =
  | { kind: "placement_snapshot"; snapshot: LearnerProgressionSnapshot }
  | { kind: "lesson_mastery"; record: LessonMasteryRecord }
  | { kind: "skill_trend_recompute"; trends: SkillTrendBucket[] }
  | { kind: "memory_pruned"; reason: "age" | "count"; prunedCount: number };

export interface LearnerMemoryEvent {
  eventId: string;
  /** Monotonically increasing per learner. */
  sequence: number;
  occurredAt: string;
  kind: LearnerMemoryEventKind;
  payload: LearnerMemoryEventPayload;
}

export interface LearnerMemory {
  schemaVersion: typeof LEARNER_MEMORY_SCHEMA_VERSION;
  learnerKey: LearnerKey;
  createdAt: string;
  events: LearnerMemoryEvent[];
  snapshots: LearnerProgressionSnapshot[];
  cefrTimeline: CefrTimelinePoint[];
  skillTrends: SkillTrendBucket[];
  lessonMastery: LessonMasteryRecord[];
}

// ─── Stable id derivation (FNV-1a 32-bit) ─────────────────────────────

function stableFnv1a(value: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

// ─── Normalization rules ──────────────────────────────────────────────

function assertNonEmptyIdentifier(value: string, field: string, maxLen: number): string {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) throw new Error(`learnerMemory: ${field} must be non-empty`);
  if (trimmed.length > maxLen) {
    throw new Error(`learnerMemory: ${field} exceeds ${maxLen} chars`);
  }
  for (let i = 0; i < trimmed.length; i += 1) {
    const code = trimmed.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) {
      throw new Error(`learnerMemory: ${field} contains control characters`);
    }
  }
  // Reject anything that looks like an email — the brief forbids PII
  // expansion. learnerKey/sourceId/roomId must be opaque identifiers.
  if (/@/.test(trimmed) && /\.[a-z]{2,}$/i.test(trimmed)) {
    throw new Error(`learnerMemory: ${field} looks like an email — use an opaque identifier instead`);
  }
  return trimmed;
}

export function normalizeLearnerKey(value: string): LearnerKey {
  return assertNonEmptyIdentifier(value, "learnerKey", MAX_LEARNER_KEY_LEN);
}

export function normalizeSourceId(value: string): string {
  return assertNonEmptyIdentifier(value, "sourceId", MAX_SOURCE_ID_LEN);
}

export function normalizeRoomId(value: string): string {
  return assertNonEmptyIdentifier(value, "roomId", MAX_ROOM_ID_LEN);
}

function normalizeConfidence(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  // Round to 4 decimals so floating-point churn never breaks replay.
  return Math.round(n * 10_000) / 10_000;
}

function normalizeScoreUnit(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return Math.round(n * 10_000) / 10_000;
}

export function normalizeIsoTimestamp(value: string | number | Date): string {
  const d = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(d.getTime())) {
    throw new Error("learnerMemory: invalid timestamp");
  }
  return d.toISOString();
}

export function normalizeCefr(value: unknown): CEFRLevel {
  if (typeof value === "string" && (CEFR_ORDER as readonly string[]).includes(value)) {
    return value as CEFRLevel;
  }
  throw new Error(`learnerMemory: invalid CEFR level: ${String(value)}`);
}

export function cefrOrdinal(level: CEFRLevel): number {
  return CEFR_ORDER.indexOf(level);
}

export function ordinalToCefr(ordinal: number): CEFRLevel {
  const clamped = Math.max(0, Math.min(CEFR_ORDER.length - 1, Math.round(ordinal)));
  return CEFR_ORDER[clamped]!;
}

// ─── Construction ─────────────────────────────────────────────────────

export function createLearnerMemory(input: {
  learnerKey: string;
  createdAt: string | number | Date;
}): LearnerMemory {
  const learnerKey = normalizeLearnerKey(input.learnerKey);
  const createdAt = normalizeIsoTimestamp(input.createdAt);
  return {
    schemaVersion: LEARNER_MEMORY_SCHEMA_VERSION,
    learnerKey,
    createdAt,
    events: [],
    snapshots: [],
    cefrTimeline: [],
    skillTrends: [],
    lessonMastery: [],
  };
}

// ─── Snapshot id + build ──────────────────────────────────────────────

export function snapshotId(learnerKey: string, recordedAt: string, sourceId: string): string {
  return `lms_${stableFnv1a(`${learnerKey}|${recordedAt}|${sourceId}`)}`;
}

export function buildPlacementSnapshot(input: {
  learnerKey: string;
  recordedAt: string | number | Date;
  sourceId: string;
  overallCefr: CEFRLevel;
  overallConfidence: number;
  perSkill: PlacementV3PerSkillProfile;
  l1Flags?: PlacementV3L1InterferenceFlag[];
}): LearnerProgressionSnapshot {
  const learnerKey = normalizeLearnerKey(input.learnerKey);
  const recordedAt = normalizeIsoTimestamp(input.recordedAt);
  const sourceId = normalizeSourceId(input.sourceId);
  const overallCefr = normalizeCefr(input.overallCefr);
  const overallConfidence = normalizeConfidence(input.overallConfidence);

  const perSkill: PlacementV3PerSkillProfile = {};
  for (const modality of MODALITIES) {
    const skill = input.perSkill?.[modality];
    if (!skill) continue;
    perSkill[modality] = {
      level: normalizeCefr(skill.level),
      confidence: normalizeConfidence(skill.confidence),
    };
  }

  const l1Flags = (input.l1Flags ?? []).map((flag) => {
    const patternId = assertNonEmptyIdentifier(flag.patternId, "l1Flag.patternId", MAX_PATTERN_ID_LEN);
    const severity: PlacementV3L1InterferenceFlag["severity"] =
      flag.severity === "low" || flag.severity === "medium" || flag.severity === "high"
        ? flag.severity
        : "low";
    const out: PlacementV3L1InterferenceFlag = { patternId, severity };
    if (flag.evidence) out.evidence = String(flag.evidence).slice(0, MAX_EVIDENCE_LEN);
    return out;
  });

  return {
    snapshotId: snapshotId(learnerKey, recordedAt, sourceId),
    recordedAt,
    sourceId,
    overallCefr,
    overallConfidence,
    perSkill,
    l1Flags,
  };
}

// ─── Deterministic merge semantics ────────────────────────────────────

/**
 * Returns -1 if `a` should win over `b`, +1 if `b` should win, 0 if both
 * are byte-identical. Tie-breakers (in order):
 *   1. later `recordedAt` wins
 *   2. higher `overallConfidence` wins
 *   3. lexicographically smaller `sourceId` wins
 *   4. lexicographically smaller `snapshotId` wins
 *
 * "Smaller wins" on the trailing tie-breakers keeps replay deterministic
 * regardless of arrival order.
 */
export function compareSnapshots(
  a: LearnerProgressionSnapshot,
  b: LearnerProgressionSnapshot,
): -1 | 0 | 1 {
  if (a.recordedAt !== b.recordedAt) return a.recordedAt > b.recordedAt ? -1 : 1;
  if (a.overallConfidence !== b.overallConfidence) {
    return a.overallConfidence > b.overallConfidence ? -1 : 1;
  }
  if (a.sourceId !== b.sourceId) return a.sourceId < b.sourceId ? -1 : 1;
  if (a.snapshotId !== b.snapshotId) return a.snapshotId < b.snapshotId ? -1 : 1;
  return 0;
}

export function mergeSnapshots(
  existing: LearnerProgressionSnapshot[],
  incoming: LearnerProgressionSnapshot,
): LearnerProgressionSnapshot[] {
  const sameId = existing.findIndex((snap) => snap.snapshotId === incoming.snapshotId);
  let merged: LearnerProgressionSnapshot[];
  if (sameId >= 0) {
    const current = existing[sameId]!;
    const cmp = compareSnapshots(current, incoming);
    merged = cmp <= 0 ? existing.slice() : existing.map((snap, i) => (i === sameId ? incoming : snap));
  } else {
    merged = [...existing, incoming];
  }
  return merged.slice().sort(snapshotChronologicalOrder);
}

function snapshotChronologicalOrder(
  a: LearnerProgressionSnapshot,
  b: LearnerProgressionSnapshot,
): -1 | 0 | 1 {
  if (a.recordedAt !== b.recordedAt) return a.recordedAt < b.recordedAt ? -1 : 1;
  if (a.snapshotId !== b.snapshotId) return a.snapshotId < b.snapshotId ? -1 : 1;
  return 0;
}

// ─── Confidence decay ─────────────────────────────────────────────────

/**
 * Exponential decay: `confidence(at) = original * (1/2) ^ (elapsedDays / halfLife)`.
 * If `at` is before `from`, returns the original confidence unchanged.
 */
export function decayConfidence(
  originalConfidence: number,
  fromIso: string,
  atIso: string,
  halfLifeDays: number = DEFAULT_CONFIDENCE_HALF_LIFE_DAYS,
): number {
  const from = new Date(fromIso).getTime();
  const at = new Date(atIso).getTime();
  if (!Number.isFinite(from) || !Number.isFinite(at)) {
    return normalizeConfidence(originalConfidence);
  }
  const elapsedDays = (at - from) / DAY_MS;
  if (elapsedDays <= 0) return normalizeConfidence(originalConfidence);
  const factor = Math.pow(0.5, elapsedDays / Math.max(0.0001, halfLifeDays));
  return normalizeConfidence(originalConfidence * factor);
}

// ─── Rolling skill trend aggregation ──────────────────────────────────

export function computeSkillTrend(
  snapshots: LearnerProgressionSnapshot[],
  modality: PlacementV3Modality,
  atIso: string,
  options?: { windowDays?: number; halfLifeDays?: number },
): SkillTrendBucket | null {
  const windowDays = options?.windowDays ?? DEFAULT_TREND_WINDOW_DAYS;
  const halfLifeDays = options?.halfLifeDays ?? DEFAULT_CONFIDENCE_HALF_LIFE_DAYS;
  const at = new Date(atIso).getTime();
  if (!Number.isFinite(at)) return null;
  const windowStart = at - windowDays * DAY_MS;

  type Sample = { recordedAt: string; level: CEFRLevel; confidence: number };
  const samples: Sample[] = [];
  for (const snap of snapshots) {
    const ts = new Date(snap.recordedAt).getTime();
    if (!Number.isFinite(ts) || ts < windowStart || ts > at) continue;
    const skill = snap.perSkill[modality];
    if (!skill) continue;
    samples.push({
      recordedAt: snap.recordedAt,
      level: skill.level,
      confidence: skill.confidence,
    });
  }
  if (samples.length === 0) return null;

  let weightSum = 0;
  let ordinalWeightedSum = 0;
  let confidenceWeightedSum = 0;
  for (const sample of samples) {
    const days = (at - new Date(sample.recordedAt).getTime()) / DAY_MS;
    const weight = Math.pow(0.5, days / Math.max(0.0001, halfLifeDays));
    weightSum += weight;
    ordinalWeightedSum += cefrOrdinal(sample.level) * weight;
    confidenceWeightedSum += sample.confidence * weight;
  }

  samples.sort((a, b) => (a.recordedAt < b.recordedAt ? -1 : a.recordedAt > b.recordedAt ? 1 : 0));
  const last = samples[samples.length - 1]!;

  return {
    modality,
    windowDays,
    meanLevelOrdinal: Math.round((ordinalWeightedSum / weightSum) * 10_000) / 10_000,
    meanConfidence: normalizeConfidence(confidenceWeightedSum / weightSum),
    sampleCount: samples.length,
    lastObservedCefr: last.level,
    lastObservedAt: last.recordedAt,
  };
}

export function computeAllSkillTrends(
  snapshots: LearnerProgressionSnapshot[],
  atIso: string,
  options?: { windowDays?: number; halfLifeDays?: number },
): SkillTrendBucket[] {
  const trends: SkillTrendBucket[] = [];
  for (const modality of MODALITIES) {
    const bucket = computeSkillTrend(snapshots, modality, atIso, options);
    if (bucket) trends.push(bucket);
  }
  return trends;
}

// ─── Lesson mastery persistence ───────────────────────────────────────

function deriveMasteryLevel(attempts: number, bestScore: number): LessonMasteryLevel {
  if (attempts <= 0) return "none";
  if (bestScore >= 0.85) return "mastered";
  if (bestScore >= 0.6) return "competent";
  if (attempts === 1 && bestScore < 0.4) return "exposed";
  return "practicing";
}

export function recordLessonAttempt(
  existing: LessonMasteryRecord[],
  input: { roomId: string; score: number; attemptedAt: string | number | Date },
): LessonMasteryRecord[] {
  const roomId = normalizeRoomId(input.roomId);
  const attemptedAt = normalizeIsoTimestamp(input.attemptedAt);
  const score = normalizeScoreUnit(input.score);
  const idx = existing.findIndex((rec) => rec.roomId === roomId);
  if (idx < 0) {
    const record: LessonMasteryRecord = {
      roomId,
      attempts: 1,
      bestScore: score,
      lastAttemptAt: attemptedAt,
      masteryLevel: deriveMasteryLevel(1, score),
    };
    return [...existing, record].sort((a, b) => (a.roomId < b.roomId ? -1 : 1));
  }
  const current = existing[idx]!;
  // lastAttemptAt only ever advances; never regresses on late events.
  const lastAttemptAt = current.lastAttemptAt < attemptedAt ? attemptedAt : current.lastAttemptAt;
  const attempts = current.attempts + 1;
  const bestScore = Math.max(current.bestScore, score);
  const updated: LessonMasteryRecord = {
    roomId,
    attempts,
    bestScore,
    lastAttemptAt,
    masteryLevel: deriveMasteryLevel(attempts, bestScore),
  };
  return existing.map((rec, i) => (i === idx ? updated : rec));
}

// ─── Longitudinal CEFR timeline ───────────────────────────────────────

export function buildCefrTimeline(snapshots: LearnerProgressionSnapshot[]): CefrTimelinePoint[] {
  return snapshots
    .slice()
    .sort(snapshotChronologicalOrder)
    .map((snap) => ({
      at: snap.recordedAt,
      overallCefr: snap.overallCefr,
      overallConfidence: snap.overallConfidence,
      sourceId: snap.sourceId,
    }));
}

/**
 * Return the most-recent timeline point at or before `atIso`, with its
 * confidence decayed from that observation to `atIso`. Returns null when
 * no observation has been recorded yet.
 */
export function cefrAt(
  timeline: CefrTimelinePoint[],
  atIso: string,
  halfLifeDays: number = DEFAULT_CONFIDENCE_HALF_LIFE_DAYS,
): { overallCefr: CEFRLevel; overallConfidence: number; observedAt: string } | null {
  const at = new Date(atIso).getTime();
  if (!Number.isFinite(at)) return null;
  let best: CefrTimelinePoint | null = null;
  for (const point of timeline) {
    const ts = new Date(point.at).getTime();
    if (!Number.isFinite(ts) || ts > at) continue;
    if (!best || best.at < point.at) best = point;
  }
  if (!best) return null;
  return {
    overallCefr: best.overallCefr,
    overallConfidence: decayConfidence(best.overallConfidence, best.at, atIso, halfLifeDays),
    observedAt: best.at,
  };
}

// ─── Event log (append-only, monotonically sequenced) ─────────────────

export function nextEventSequence(memory: LearnerMemory): number {
  if (memory.events.length === 0) return 1;
  let max = 0;
  for (const event of memory.events) {
    if (event.sequence > max) max = event.sequence;
  }
  return max + 1;
}

function buildEventId(learnerKey: string, sequence: number, payloadDigest: string): string {
  return `evt_${stableFnv1a(`${learnerKey}|${sequence}|${payloadDigest}`)}`;
}

export function appendPlacementSnapshotEvent(
  memory: LearnerMemory,
  snapshot: LearnerProgressionSnapshot,
  options?: { occurredAt?: string | number | Date },
): LearnerMemory {
  const sequence = nextEventSequence(memory);
  const occurredAt = options?.occurredAt
    ? normalizeIsoTimestamp(options.occurredAt)
    : snapshot.recordedAt;
  const event: LearnerMemoryEvent = {
    eventId: buildEventId(memory.learnerKey, sequence, snapshot.snapshotId),
    sequence,
    occurredAt,
    kind: "placement_snapshot",
    payload: { kind: "placement_snapshot", snapshot },
  };
  const snapshots = mergeSnapshots(memory.snapshots, snapshot);
  return {
    ...memory,
    events: [...memory.events, event],
    snapshots,
    cefrTimeline: buildCefrTimeline(snapshots),
    skillTrends: computeAllSkillTrends(snapshots, snapshot.recordedAt),
  };
}

export function appendLessonMasteryEvent(
  memory: LearnerMemory,
  input: { roomId: string; score: number; attemptedAt: string | number | Date },
): LearnerMemory {
  const sequence = nextEventSequence(memory);
  const attemptedAt = normalizeIsoTimestamp(input.attemptedAt);
  const score = normalizeScoreUnit(input.score);
  const roomId = normalizeRoomId(input.roomId);
  const lessonMastery = recordLessonAttempt(memory.lessonMastery, {
    roomId,
    score,
    attemptedAt,
  });
  const updated = lessonMastery.find((rec) => rec.roomId === roomId)!;
  const event: LearnerMemoryEvent = {
    eventId: buildEventId(memory.learnerKey, sequence, `${roomId}|${attemptedAt}|${score}`),
    sequence,
    occurredAt: attemptedAt,
    kind: "lesson_mastery",
    payload: { kind: "lesson_mastery", record: updated },
  };
  return {
    ...memory,
    events: [...memory.events, event],
    lessonMastery,
  };
}

export function appendSkillTrendRecomputeEvent(
  memory: LearnerMemory,
  atIso: string,
  options?: { windowDays?: number; halfLifeDays?: number },
): LearnerMemory {
  const at = normalizeIsoTimestamp(atIso);
  const trends = computeAllSkillTrends(memory.snapshots, at, options);
  const sequence = nextEventSequence(memory);
  const event: LearnerMemoryEvent = {
    eventId: buildEventId(memory.learnerKey, sequence, `trends|${at}`),
    sequence,
    occurredAt: at,
    kind: "skill_trend_recompute",
    payload: { kind: "skill_trend_recompute", trends },
  };
  return { ...memory, events: [...memory.events, event], skillTrends: trends };
}

// ─── Pruning ──────────────────────────────────────────────────────────

export function pruneMemory(
  memory: LearnerMemory,
  atIso: string,
  options?: {
    snapshotRetentionDays?: number;
    snapshotRetentionCount?: number;
    eventRetentionDays?: number;
    eventRetentionCount?: number;
  },
): LearnerMemory {
  const snapshotRetentionDays = options?.snapshotRetentionDays ?? DEFAULT_SNAPSHOT_RETENTION_DAYS;
  const snapshotRetentionCount = options?.snapshotRetentionCount ?? DEFAULT_SNAPSHOT_RETENTION_COUNT;
  const eventRetentionDays = options?.eventRetentionDays ?? DEFAULT_EVENT_RETENTION_DAYS;
  const eventRetentionCount = options?.eventRetentionCount ?? DEFAULT_EVENT_RETENTION_COUNT;
  const at = new Date(atIso).getTime();
  if (!Number.isFinite(at)) return memory;
  const atIsoNormalized = new Date(at).toISOString();

  const snapshotCutoff = at - snapshotRetentionDays * DAY_MS;
  const orderedSnapshots = memory.snapshots.slice().sort(snapshotChronologicalOrder);
  let snapshots = orderedSnapshots.filter(
    (snap) => new Date(snap.recordedAt).getTime() >= snapshotCutoff,
  );
  let prunedByAge = orderedSnapshots.length - snapshots.length;
  let prunedByCount = 0;
  while (snapshots.length > snapshotRetentionCount) {
    snapshots.shift();
    prunedByCount += 1;
  }

  const eventCutoff = at - eventRetentionDays * DAY_MS;
  let events = memory.events
    .slice()
    .sort((a, b) => a.sequence - b.sequence)
    .filter((e) => new Date(e.occurredAt).getTime() >= eventCutoff);
  while (events.length > eventRetentionCount) {
    events.shift();
  }

  // Emit at most one prune event with the combined count and the reason
  // that drove the largest fraction. Keeps the audit trail terse but
  // honest about whether age or cap pressure was the dominant cause.
  if (prunedByAge > 0 || prunedByCount > 0) {
    const sequence =
      events.length === 0 ? nextEventSequence({ ...memory, events }) : Math.max(...events.map((e) => e.sequence)) + 1;
    const reason: "age" | "count" = prunedByAge >= prunedByCount ? "age" : "count";
    const prunedCount = prunedByAge + prunedByCount;
    const event: LearnerMemoryEvent = {
      eventId: buildEventId(memory.learnerKey, sequence, `prune|${reason}|${prunedCount}`),
      sequence,
      occurredAt: atIsoNormalized,
      kind: "memory_pruned",
      payload: { kind: "memory_pruned", reason, prunedCount },
    };
    events = [...events, event];
  }

  return {
    ...memory,
    events,
    snapshots,
    cefrTimeline: buildCefrTimeline(snapshots),
  };
}

// ─── Replay reconstruction ────────────────────────────────────────────

/**
 * Reconstruct a `LearnerMemory` from a raw event stream. Sequences must
 * be unique; gaps are allowed (older events may have been pruned), but
 * duplicates fail closed.
 */
export function replayEvents(
  learnerKey: string,
  events: LearnerMemoryEvent[],
  options?: { createdAt?: string | number | Date },
): LearnerMemory {
  const sorted = events.slice().sort((a, b) => a.sequence - b.sequence);
  const createdAtSource = options?.createdAt ?? sorted[0]?.occurredAt ?? new Date(0).toISOString();
  let memory = createLearnerMemory({ learnerKey, createdAt: createdAtSource });
  const seenSequences = new Set<number>();

  for (const event of sorted) {
    if (seenSequences.has(event.sequence)) {
      throw new Error(`learnerMemory: duplicate event sequence ${event.sequence}`);
    }
    seenSequences.add(event.sequence);

    switch (event.payload.kind) {
      case "placement_snapshot": {
        const next = mergeSnapshots(memory.snapshots, event.payload.snapshot);
        memory = {
          ...memory,
          events: [...memory.events, event],
          snapshots: next,
        };
        break;
      }
      case "lesson_mastery": {
        const rec = event.payload.record;
        const idx = memory.lessonMastery.findIndex((r) => r.roomId === rec.roomId);
        const lessonMastery =
          idx >= 0
            ? memory.lessonMastery.map((r, i) => (i === idx ? rec : r))
            : [...memory.lessonMastery, rec].sort((a, b) => (a.roomId < b.roomId ? -1 : 1));
        memory = { ...memory, events: [...memory.events, event], lessonMastery };
        break;
      }
      case "skill_trend_recompute": {
        memory = {
          ...memory,
          events: [...memory.events, event],
          skillTrends: event.payload.trends,
        };
        break;
      }
      case "memory_pruned": {
        memory = { ...memory, events: [...memory.events, event] };
        break;
      }
    }
  }

  // Re-derive projections that depend on the full snapshot set.
  return {
    ...memory,
    cefrTimeline: buildCefrTimeline(memory.snapshots),
  };
}

// ─── Replay-safe canonical serialization ──────────────────────────────

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${(value as unknown[]).map((item) => stableStringify(item)).join(",")}]`;
  }
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(",")}}`;
}

export function serializeLearnerMemory(memory: LearnerMemory): string {
  return stableStringify(memory);
}

export function deserializeLearnerMemory(raw: string): LearnerMemory {
  const parsed = JSON.parse(raw) as unknown;
  if (!parsed || typeof parsed !== "object") {
    throw new Error("learnerMemory: serialized memory is not an object");
  }
  const candidate = parsed as Partial<LearnerMemory>;
  if (candidate.schemaVersion !== LEARNER_MEMORY_SCHEMA_VERSION) {
    throw new Error(
      `learnerMemory: schema version mismatch (got ${String(candidate.schemaVersion)}, expected ${LEARNER_MEMORY_SCHEMA_VERSION})`,
    );
  }
  if (typeof candidate.learnerKey !== "string") {
    throw new Error("learnerMemory: missing learnerKey");
  }
  if (!Array.isArray(candidate.events)) {
    throw new Error("learnerMemory: events must be an array");
  }
  if (!Array.isArray(candidate.snapshots)) {
    throw new Error("learnerMemory: snapshots must be an array");
  }
  if (!Array.isArray(candidate.lessonMastery)) {
    throw new Error("learnerMemory: lessonMastery must be an array");
  }
  return parsed as LearnerMemory;
}

/** Stable fingerprint of the memory; useful for cache invalidation. */
export function fingerprintLearnerMemory(memory: LearnerMemory): string {
  return stableFnv1a(serializeLearnerMemory(memory));
}
