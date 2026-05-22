# Placement V4 — Learner Memory Schema Proposal

**Status:** draft (in-code module live; persistence storage TBD)
**Schema version constant:** `LEARNER_MEMORY_SCHEMA_VERSION = "placement-v4-learner-memory-v1"`
**Module:** `src/lib/placement/v4/learnerMemory.ts`

This document describes the on-the-wire / at-rest shape of a learner's
longitudinal placement memory. The V4 placement system reads and writes
this structure as a single value per learner; downstream consumers
(curriculum sequencer, progression simulator, recommender) treat the
projections as cached views and the event log as the ground truth.

## Identity model

| Field | Source | Privacy | Notes |
|---|---|---|---|
| `learnerKey` | opaque caller-supplied (e.g., FNV/SHA of `profiles.id`) | not PII | Rejected if the value looks like an email. No email/name/handle is ever accepted by this module. |
| `sourceId` | technical context for the event (e.g., `placement-v3-session:<uuid>`, `lesson-completion:<roomId>`) | not PII | Used in `snapshotId` derivation. |
| `roomId` | stable lesson/room id from the existing room registry | not PII | Used as the mastery key. |
| `snapshotId` | `lms_${fnv1a(learnerKey | recordedAt | sourceId)}` | derived | Deterministic; identical inputs always produce the same id. |
| `eventId` | `evt_${fnv1a(learnerKey | sequence | payloadDigest)}` | derived | Deterministic; collisions across learners are bounded by including `learnerKey`. |

No other identifiers are ever embedded. There are no hidden fields: every
serialized property comes from a declared type member; `serializeLearnerMemory`
filters `undefined` and sorts keys, so an unknown identifier could not be
introduced by accident without showing up in this file first.

## Top-level shape

```ts
interface LearnerMemory {
  schemaVersion: "placement-v4-learner-memory-v1";
  learnerKey: string;
  createdAt: string; // ISO-8601 UTC
  events: LearnerMemoryEvent[];           // append-only canonical log
  snapshots: LearnerProgressionSnapshot[]; // projection
  cefrTimeline: CefrTimelinePoint[];      // projection
  skillTrends: SkillTrendBucket[];        // projection
  lessonMastery: LessonMasteryRecord[];   // projection
}
```

The four projections are recomputable from `events` alone. `replayEvents`
reproduces them byte-for-byte. If any projection ever diverges from a
replay of the log, the log wins.

## Entity definitions

### `LearnerProgressionSnapshot`

A point-in-time placement record. Multiple snapshots per learner are
expected over time; long-term progression is the trajectory across them.

```ts
{
  snapshotId: string;          // lms_<fnv1a>
  recordedAt: string;          // ISO-8601 UTC
  sourceId: string;
  overallCefr: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  overallConfidence: number;   // 0..1, rounded to 4 decimals
  perSkill: {
    speaking?:    { level, confidence };
    listening?:   { level, confidence };
    reading?:     { level, confidence };
    writing?:     { level, confidence };
    conversation?:{ level, confidence };
  };
  l1Flags: { patternId, severity, evidence? }[];
}
```

### `SkillTrendBucket`

Rolling aggregation of one modality over a recency-weighted window.

```ts
{
  modality: PlacementV3Modality;
  windowDays: number;            // default 30
  meanLevelOrdinal: number;      // 0..5 (A1..C2), 4-decimal precision
  meanConfidence: number;
  sampleCount: number;
  lastObservedCefr: CEFRLevel;
  lastObservedAt: string;
}
```

The weighting function is **the same exponential half-life as confidence
decay** (default 30 d). Older observations still contribute, but with
proportionally less weight, so a single ancient snapshot cannot dominate
a fresh trajectory.

### `LessonMasteryRecord`

```ts
{
  roomId: string;
  attempts: number;            // monotonically non-decreasing
  bestScore: number;           // 0..1, monotonically non-decreasing
  lastAttemptAt: string;       // monotonically non-decreasing
  masteryLevel: "none" | "exposed" | "practicing" | "competent" | "mastered";
}
```

Mastery is **derived** from `(attempts, bestScore)` so a corrupted
`masteryLevel` on disk can always be rebuilt. Score and timestamp are
both clamped to monotonic-non-decreasing on update: a late-arriving
event with a lower score or older timestamp leaves the existing record
unchanged in those fields (but still increments `attempts`).

### `CefrTimelinePoint`

```ts
{
  at: string;
  overallCefr: CEFRLevel;
  overallConfidence: number;   // as-of `at`, NOT decayed
  sourceId: string;
}
```

The stored confidence is the value at observation time. `cefrAt(timeline, atIso)`
applies decay from the observation to the query timestamp; the timeline
itself never mutates with the passing of wall-clock time.

### `LearnerMemoryEvent`

```ts
{
  eventId: string;
  sequence: number;            // 1, 2, 3 ... per learner, gaps allowed after prune
  occurredAt: string;          // ISO-8601 UTC
  kind: "placement_snapshot" | "lesson_mastery"
      | "skill_trend_recompute" | "memory_pruned";
  payload: discriminated by `payload.kind`
}
```

## Normalization rules

| Field | Rule |
|---|---|
| Any identifier (learnerKey, sourceId, roomId, patternId) | Trimmed, non-empty, no control chars (<0x20 or 0x7f), bounded length, rejected if it matches `…@…\.[a-z]{2,}$` (looks like an email). |
| Confidence / score | Clamped to `[0, 1]`; rounded to 4 decimal places so floating-point drift cannot break replay byte-identity. |
| CEFR level | Must be exactly one of `A1, A2, B1, B2, C1, C2`. Anything else throws. |
| Timestamps | Always serialized as `Date.toISOString()`. Invalid inputs throw. |
| L1 flag severity | `low | medium | high`; anything else coerces to `low`. |
| L1 flag evidence | Truncated to 512 chars. |

## Confidence decay model

Exponential, half-life-driven:

```
confidence(at) = original × (1/2) ^ (elapsedDays / halfLifeDays)
```

- Default `halfLifeDays = 30`.
- `decayConfidence` is the single implementation; both `cefrAt` and the
  skill-trend weighting reuse it.
- If `at <= from`, the original is returned unchanged (we never inflate
  confidence backward in time).
- The decay function reads no wall-clock time. Callers always provide
  `atIso`. This is what makes replay deterministic — re-running the same
  event log with the same `atIso` always produces the same projections.

## Rolling skill trend aggregation

For each modality the aggregator:

1. Filters snapshots to those within `[atIso - windowDays, atIso]`.
2. Drops snapshots that don't carry the modality.
3. Computes a recency-weighted mean of `cefrOrdinal(level)` with the
   same half-life as confidence decay.
4. Computes a recency-weighted mean of `confidence`.
5. Stores `sampleCount` and the most recent `(level, recordedAt)` so
   consumers can show "trending up from A1 to A2" without re-running
   the aggregation.

A learner with **contradictory** skill history (e.g., a B1 reading
snapshot then an A2 reading snapshot a week later) gets a `meanLevelOrdinal`
between the two ordinals, leaning toward the more recent observation.
`lastObservedCefr` always reflects the most recent sample — the bucket
never silently picks the "better" reading.

## Deterministic merge semantics

`compareSnapshots(a, b)` returns the winner under these tie-breakers
(stop at the first inequality):

1. Later `recordedAt` wins.
2. Higher `overallConfidence` wins.
3. Lexicographically **smaller** `sourceId` wins.
4. Lexicographically **smaller** `snapshotId` wins.
5. Otherwise the snapshots are byte-identical and either may be kept.

`mergeSnapshots` is idempotent: applying the same incoming snapshot
twice always yields the same list.

## Pruning policy

`pruneMemory(memory, atIso, options?)` enforces two pressures simultaneously:

| Bound | Default | Acts on |
|---|---|---|
| `snapshotRetentionDays` | 365 | snapshots + cefrTimeline |
| `snapshotRetentionCount` | 200 | snapshots + cefrTimeline (oldest first) |
| `eventRetentionDays` | 730 | event log |
| `eventRetentionCount` | 1000 | event log (oldest first) |

When at least one snapshot is removed, a single `memory_pruned` event
is appended with `reason: "age" | "count"` (whichever dominated) and the
total `prunedCount`. The event log is the audit trail; the prune itself
is reproducible because callers pass `atIso`.

## Replay-safe serialization

`serializeLearnerMemory` produces a canonical JSON string:

- Object keys sorted lexicographically.
- `undefined` values dropped (never emitted as `"foo":null`).
- Numbers rounded at normalization time, not at serialization time.
- No wall-clock reads.

`fingerprintLearnerMemory` is `fnv1a(serializeLearnerMemory(memory))`
and is suitable for cache invalidation / change detection.

`deserializeLearnerMemory` validates `schemaVersion`, top-level shape,
and array bones, then casts. It is **not** a deep validator; replay is
the deep-validator path — if `replayEvents(memory.learnerKey, memory.events)`
disagrees with the deserialized projections, the log wins.

## Open questions (for downstream V4 storage work)

1. Storage layer. Two viable options: (a) a `placement_v4_learner_memory`
   JSONB column on `profiles`; (b) `placement_v4_events` table + on-read
   projection rebuild. Option (b) scales further but adds a migration.
2. Server-side replay. Edge functions that grade new placements should
   re-run `replayEvents` on the server to recompute projections in a
   single round-trip; the in-app projections become a hint cache.
3. Cross-device merging. Today the model assumes one writer per learner
   at a time. Multi-device append-only sync would need a sequence
   allocator (e.g., `(deviceId, deviceSequence)` instead of a single
   monotonic counter), and the tie-breakers in `compareSnapshots`
   should still be sufficient for the merge.
