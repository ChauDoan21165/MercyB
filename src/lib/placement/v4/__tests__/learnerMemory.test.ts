import { describe, expect, it } from "vitest";

import type {
  CEFRLevel,
  PlacementV3PerSkillProfile,
} from "../../../../types/placement-v3";
import {
  appendLessonMasteryEvent,
  appendPlacementSnapshotEvent,
  appendSkillTrendRecomputeEvent,
  buildCefrTimeline,
  buildPlacementSnapshot,
  cefrAt,
  cefrOrdinal,
  compareSnapshots,
  computeAllSkillTrends,
  computeSkillTrend,
  createLearnerMemory,
  DEFAULT_CONFIDENCE_HALF_LIFE_DAYS,
  decayConfidence,
  deserializeLearnerMemory,
  fingerprintLearnerMemory,
  LEARNER_MEMORY_SCHEMA_VERSION,
  mergeSnapshots,
  normalizeLearnerKey,
  pruneMemory,
  recordLessonAttempt,
  replayEvents,
  serializeLearnerMemory,
  snapshotId,
  type LearnerMemory,
  type LearnerMemoryEvent,
  type LearnerProgressionSnapshot,
} from "../learnerMemory";

const LEARNER = "learner_hash_abcdef";

function isoDaysAgo(reference: string, days: number): string {
  return new Date(new Date(reference).getTime() - days * 24 * 60 * 60 * 1000).toISOString();
}

function fullSkillProfile(level: CEFRLevel, confidence: number): PlacementV3PerSkillProfile {
  return {
    speaking: { level, confidence },
    listening: { level, confidence },
    reading: { level, confidence },
    writing: { level, confidence },
    conversation: { level, confidence },
  };
}

function placementSnapshot(input: {
  learnerKey?: string;
  recordedAt: string;
  sourceId: string;
  overallCefr: CEFRLevel;
  overallConfidence?: number;
  perSkill?: PlacementV3PerSkillProfile;
}): LearnerProgressionSnapshot {
  return buildPlacementSnapshot({
    learnerKey: input.learnerKey ?? LEARNER,
    recordedAt: input.recordedAt,
    sourceId: input.sourceId,
    overallCefr: input.overallCefr,
    overallConfidence: input.overallConfidence ?? 0.7,
    perSkill: input.perSkill ?? fullSkillProfile(input.overallCefr, input.overallConfidence ?? 0.7),
  });
}

describe("learnerMemory — normalization", () => {
  it("rejects empty / control-character / email-shaped learner keys", () => {
    expect(() => normalizeLearnerKey("")).toThrow(/non-empty/);
    expect(() => normalizeLearnerKey("ab")).toThrow(/control characters/);
    expect(() => normalizeLearnerKey("alice@example.com")).toThrow(/email/);
  });

  it("clamps and rounds confidence on snapshot build", () => {
    const snap = placementSnapshot({
      recordedAt: "2026-04-01T00:00:00.000Z",
      sourceId: "placement-v3-session:s1",
      overallCefr: "A2",
      overallConfidence: 1.23,
      perSkill: { reading: { level: "B1", confidence: -0.5 } },
    });
    expect(snap.overallConfidence).toBe(1);
    expect(snap.perSkill.reading?.confidence).toBe(0);
  });

  it("produces deterministic snapshotId for identical inputs", () => {
    const a = snapshotId(LEARNER, "2026-04-01T00:00:00.000Z", "src-1");
    const b = snapshotId(LEARNER, "2026-04-01T00:00:00.000Z", "src-1");
    expect(a).toBe(b);
    expect(a).toMatch(/^lms_[0-9a-f]{8}$/);
  });

  it("emits stable ISO timestamps regardless of input shape", () => {
    const fromNumber = buildPlacementSnapshot({
      learnerKey: LEARNER,
      recordedAt: 1_711_929_600_000,
      sourceId: "src",
      overallCefr: "A2",
      overallConfidence: 0.5,
      perSkill: {},
    });
    const fromString = buildPlacementSnapshot({
      learnerKey: LEARNER,
      recordedAt: "2024-04-01T00:00:00.000Z",
      sourceId: "src",
      overallCefr: "A2",
      overallConfidence: 0.5,
      perSkill: {},
    });
    expect(fromNumber.recordedAt).toBe(fromString.recordedAt);
    expect(fromNumber.snapshotId).toBe(fromString.snapshotId);
  });
});

describe("learnerMemory — merge conflicts", () => {
  it("keeps the higher-confidence snapshot when ids collide", () => {
    const low = placementSnapshot({
      recordedAt: "2026-04-01T00:00:00.000Z",
      sourceId: "src-a",
      overallCefr: "A2",
      overallConfidence: 0.4,
    });
    const high = placementSnapshot({
      recordedAt: "2026-04-01T00:00:00.000Z",
      sourceId: "src-a",
      overallCefr: "B1",
      overallConfidence: 0.9,
    });
    expect(low.snapshotId).toBe(high.snapshotId);
    const merged = mergeSnapshots([low], high);
    expect(merged).toHaveLength(1);
    expect(merged[0]!.overallConfidence).toBe(0.9);
    expect(merged[0]!.overallCefr).toBe("B1");
  });

  it("orders snapshots chronologically after merge", () => {
    const oldSnap = placementSnapshot({
      recordedAt: "2026-01-01T00:00:00.000Z",
      sourceId: "src-old",
      overallCefr: "A1",
    });
    const midSnap = placementSnapshot({
      recordedAt: "2026-03-01T00:00:00.000Z",
      sourceId: "src-mid",
      overallCefr: "A2",
    });
    const newSnap = placementSnapshot({
      recordedAt: "2026-05-01T00:00:00.000Z",
      sourceId: "src-new",
      overallCefr: "B1",
    });
    const out = [newSnap, oldSnap, midSnap].reduce(
      (acc, snap) => mergeSnapshots(acc, snap),
      [] as LearnerProgressionSnapshot[],
    );
    expect(out.map((s) => s.recordedAt)).toEqual([
      oldSnap.recordedAt,
      midSnap.recordedAt,
      newSnap.recordedAt,
    ]);
  });

  it("compareSnapshots tie-breaks deterministically by sourceId then snapshotId", () => {
    const a = placementSnapshot({
      recordedAt: "2026-04-01T00:00:00.000Z",
      sourceId: "src-aaa",
      overallCefr: "A2",
      overallConfidence: 0.5,
    });
    const b = placementSnapshot({
      recordedAt: "2026-04-01T00:00:00.000Z",
      sourceId: "src-bbb",
      overallCefr: "A2",
      overallConfidence: 0.5,
    });
    expect(compareSnapshots(a, b)).toBe(-1);
    expect(compareSnapshots(b, a)).toBe(1);
    expect(compareSnapshots(a, a)).toBe(0);
  });

  it("merge is idempotent — applying the same snapshot twice is a no-op", () => {
    const snap = placementSnapshot({
      recordedAt: "2026-04-01T00:00:00.000Z",
      sourceId: "src",
      overallCefr: "A2",
    });
    const once = mergeSnapshots([], snap);
    const twice = mergeSnapshots(once, snap);
    expect(twice).toEqual(once);
  });
});

describe("learnerMemory — confidence decay", () => {
  it("halves confidence at one half-life", () => {
    const at = "2026-05-01T00:00:00.000Z";
    const halfLifeAgo = isoDaysAgo(at, DEFAULT_CONFIDENCE_HALF_LIFE_DAYS);
    const decayed = decayConfidence(0.8, halfLifeAgo, at);
    expect(decayed).toBeCloseTo(0.4, 3);
  });

  it("never inflates confidence backward in time", () => {
    const observed = "2026-05-01T00:00:00.000Z";
    const before = "2026-04-01T00:00:00.000Z";
    expect(decayConfidence(0.6, observed, before)).toBe(0.6);
  });

  it("returns rounded values for replay byte-identity", () => {
    // 30 days at half-life of 30: factor=0.5
    const at = "2026-05-01T00:00:00.000Z";
    const ago = isoDaysAgo(at, 30);
    const value = decayConfidence(1 / 3, ago, at);
    // 0.3333 × 0.5 ≈ 0.16667 → rounded to 0.1667
    expect(value).toBe(0.1667);
  });
});

describe("learnerMemory — rolling skill trends", () => {
  const at = "2026-05-20T00:00:00.000Z";

  it("returns null when no in-window samples exist for a modality", () => {
    const snap = placementSnapshot({
      recordedAt: isoDaysAgo(at, 90),
      sourceId: "old",
      overallCefr: "A1",
    });
    expect(computeSkillTrend([snap], "speaking", at, { windowDays: 30 })).toBeNull();
  });

  it("recency-weights contradictory readings toward the most recent observation", () => {
    const old = placementSnapshot({
      recordedAt: isoDaysAgo(at, 25),
      sourceId: "src-old",
      overallCefr: "B1",
      overallConfidence: 0.8,
    });
    const fresh = placementSnapshot({
      recordedAt: isoDaysAgo(at, 1),
      sourceId: "src-new",
      overallCefr: "A1",
      overallConfidence: 0.8,
    });
    const trend = computeSkillTrend([old, fresh], "reading", at, { windowDays: 30 });
    expect(trend).not.toBeNull();
    // Recent A1 (ordinal 0) outweighs older B1 (ordinal 2). With a
    // 30-day half-life and the older sample 25d back vs the fresh one
    // 1d back, the weighted mean ordinal lands at ~0.73 — clearly
    // leaning to A1 but not erased of B1 history.
    expect(trend!.meanLevelOrdinal).toBeGreaterThan(0.5);
    expect(trend!.meanLevelOrdinal).toBeLessThan(1.0);
    expect(trend!.lastObservedCefr).toBe("A1");
    expect(trend!.lastObservedAt).toBe(fresh.recordedAt);
    expect(trend!.sampleCount).toBe(2);
  });

  it("computeAllSkillTrends emits only modalities that have samples", () => {
    const snap = buildPlacementSnapshot({
      learnerKey: LEARNER,
      recordedAt: at,
      sourceId: "src",
      overallCefr: "A2",
      overallConfidence: 0.6,
      perSkill: { speaking: { level: "A2", confidence: 0.6 } },
    });
    const trends = computeAllSkillTrends([snap], at);
    expect(trends.map((t) => t.modality)).toEqual(["speaking"]);
  });

  it("excludes stale samples outside the rolling window", () => {
    const stale = placementSnapshot({
      recordedAt: isoDaysAgo(at, 90),
      sourceId: "stale",
      overallCefr: "C1",
      overallConfidence: 0.95,
    });
    const recent = placementSnapshot({
      recordedAt: isoDaysAgo(at, 5),
      sourceId: "recent",
      overallCefr: "A1",
      overallConfidence: 0.5,
    });
    const trend = computeSkillTrend([stale, recent], "writing", at, { windowDays: 30 });
    expect(trend!.sampleCount).toBe(1);
    expect(trend!.lastObservedCefr).toBe("A1");
  });
});

describe("learnerMemory — lesson mastery persistence", () => {
  it("inserts a new room record at first attempt", () => {
    const result = recordLessonAttempt([], {
      roomId: "english_a1_room1",
      score: 0.7,
      attemptedAt: "2026-04-01T00:00:00.000Z",
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      roomId: "english_a1_room1",
      attempts: 1,
      bestScore: 0.7,
      masteryLevel: "competent",
    });
  });

  it("increments attempts and locks bestScore monotonically", () => {
    const after1 = recordLessonAttempt([], {
      roomId: "r",
      score: 0.9,
      attemptedAt: "2026-04-01T00:00:00.000Z",
    });
    const after2 = recordLessonAttempt(after1, {
      roomId: "r",
      score: 0.2,
      attemptedAt: "2026-04-02T00:00:00.000Z",
    });
    expect(after2[0]!.attempts).toBe(2);
    expect(after2[0]!.bestScore).toBe(0.9);
    expect(after2[0]!.masteryLevel).toBe("mastered");
  });

  it("never regresses lastAttemptAt for an out-of-order event", () => {
    const after1 = recordLessonAttempt([], {
      roomId: "r",
      score: 0.5,
      attemptedAt: "2026-04-05T00:00:00.000Z",
    });
    const lateArriving = recordLessonAttempt(after1, {
      roomId: "r",
      score: 0.5,
      attemptedAt: "2026-04-01T00:00:00.000Z",
    });
    expect(lateArriving[0]!.lastAttemptAt).toBe("2026-04-05T00:00:00.000Z");
    expect(lateArriving[0]!.attempts).toBe(2);
  });
});

describe("learnerMemory — longitudinal CEFR timeline", () => {
  const oldAt = "2026-02-01T00:00:00.000Z";
  const newAt = "2026-05-01T00:00:00.000Z";

  it("reconstructs the timeline in chronological order regardless of insertion order", () => {
    const newer = placementSnapshot({
      recordedAt: newAt,
      sourceId: "newer",
      overallCefr: "B1",
    });
    const older = placementSnapshot({
      recordedAt: oldAt,
      sourceId: "older",
      overallCefr: "A1",
    });
    const timeline = buildCefrTimeline([newer, older]);
    expect(timeline.map((p) => p.at)).toEqual([oldAt, newAt]);
    expect(timeline.map((p) => p.overallCefr)).toEqual(["A1", "B1"]);
  });

  it("cefrAt returns the most-recent observation at or before the query time, with decay", () => {
    const t = buildCefrTimeline([
      placementSnapshot({
        recordedAt: oldAt,
        sourceId: "older",
        overallCefr: "A1",
        overallConfidence: 0.8,
      }),
      placementSnapshot({
        recordedAt: newAt,
        sourceId: "newer",
        overallCefr: "B1",
        overallConfidence: 0.8,
      }),
    ]);
    const mid = "2026-03-15T00:00:00.000Z";
    const result = cefrAt(t, mid);
    expect(result).not.toBeNull();
    expect(result!.overallCefr).toBe("A1");
    expect(result!.observedAt).toBe(oldAt);
    // Confidence at +42 days from observation (Feb 1 → Mar 15) with
    // 30-day half-life: 0.8 × 0.5^(42/30) ≈ 0.302; allow small slack.
    expect(result!.overallConfidence).toBeGreaterThan(0.28);
    expect(result!.overallConfidence).toBeLessThan(0.32);
  });

  it("cefrAt returns null when no observation exists at or before the query", () => {
    const t = buildCefrTimeline([
      placementSnapshot({ recordedAt: newAt, sourceId: "n", overallCefr: "A1" }),
    ]);
    expect(cefrAt(t, oldAt)).toBeNull();
  });
});

describe("learnerMemory — pruning", () => {
  const now = "2026-05-20T00:00:00.000Z";

  it("prunes snapshots older than the age cutoff and emits a memory_pruned event", () => {
    const old = placementSnapshot({
      recordedAt: isoDaysAgo(now, 400),
      sourceId: "old",
      overallCefr: "A1",
    });
    const recent = placementSnapshot({
      recordedAt: isoDaysAgo(now, 10),
      sourceId: "recent",
      overallCefr: "A2",
    });
    let mem = createLearnerMemory({ learnerKey: LEARNER, createdAt: isoDaysAgo(now, 500) });
    mem = appendPlacementSnapshotEvent(mem, old);
    mem = appendPlacementSnapshotEvent(mem, recent);
    const pruned = pruneMemory(mem, now);
    expect(pruned.snapshots).toHaveLength(1);
    expect(pruned.snapshots[0]!.sourceId).toBe("recent");
    const pruneEvents = pruned.events.filter((e) => e.kind === "memory_pruned");
    expect(pruneEvents).toHaveLength(1);
    expect(pruneEvents[0]!.payload).toMatchObject({ kind: "memory_pruned", reason: "age", prunedCount: 1 });
  });

  it("enforces the snapshot count cap independently of age", () => {
    let mem = createLearnerMemory({ learnerKey: LEARNER, createdAt: isoDaysAgo(now, 30) });
    for (let i = 0; i < 5; i += 1) {
      mem = appendPlacementSnapshotEvent(
        mem,
        placementSnapshot({
          recordedAt: isoDaysAgo(now, 5 - i),
          sourceId: `src-${i}`,
          overallCefr: "A2",
        }),
      );
    }
    const pruned = pruneMemory(mem, now, {
      snapshotRetentionCount: 2,
      snapshotRetentionDays: 365,
    });
    expect(pruned.snapshots).toHaveLength(2);
    // Most-recent two retained, oldest three pruned.
    expect(pruned.snapshots.map((s) => s.sourceId)).toEqual(["src-3", "src-4"]);
    const pruneEvents = pruned.events.filter((e) => e.kind === "memory_pruned");
    expect(pruneEvents).toHaveLength(1);
    expect(pruneEvents[0]!.payload).toMatchObject({ kind: "memory_pruned", reason: "count", prunedCount: 3 });
  });

  it("does not emit a prune event when nothing was actually pruned", () => {
    let mem = createLearnerMemory({ learnerKey: LEARNER, createdAt: isoDaysAgo(now, 10) });
    mem = appendPlacementSnapshotEvent(
      mem,
      placementSnapshot({
        recordedAt: isoDaysAgo(now, 5),
        sourceId: "src",
        overallCefr: "A1",
      }),
    );
    const before = mem.events.length;
    const after = pruneMemory(mem, now);
    expect(after.events.length).toBe(before);
  });
});

describe("learnerMemory — deterministic serialization", () => {
  function buildMemoryAt(timestamp: string): LearnerMemory {
    let mem = createLearnerMemory({ learnerKey: LEARNER, createdAt: "2026-01-01T00:00:00.000Z" });
    mem = appendPlacementSnapshotEvent(
      mem,
      placementSnapshot({
        recordedAt: timestamp,
        sourceId: "placement-v3-session:s1",
        overallCefr: "A2",
        overallConfidence: 0.66,
      }),
    );
    mem = appendLessonMasteryEvent(mem, {
      roomId: "english_a1_room1",
      score: 0.72,
      attemptedAt: timestamp,
    });
    mem = appendSkillTrendRecomputeEvent(mem, timestamp);
    return mem;
  }

  it("produces byte-identical serializations for two memories built the same way", () => {
    const a = buildMemoryAt("2026-04-01T00:00:00.000Z");
    const b = buildMemoryAt("2026-04-01T00:00:00.000Z");
    expect(serializeLearnerMemory(a)).toBe(serializeLearnerMemory(b));
    expect(fingerprintLearnerMemory(a)).toBe(fingerprintLearnerMemory(b));
  });

  it("sorts object keys regardless of insertion order", () => {
    const ts = "2026-04-01T00:00:00.000Z";
    const mem = buildMemoryAt(ts);
    const serialized = serializeLearnerMemory(mem);
    expect(serialized.indexOf("\"createdAt\"")).toBeLessThan(
      serialized.indexOf("\"learnerKey\""),
    );
    expect(serialized.indexOf("\"events\"")).toBeLessThan(
      serialized.indexOf("\"learnerKey\""),
    );
  });

  it("roundtrips through deserialize without losing structure", () => {
    const mem = buildMemoryAt("2026-04-01T00:00:00.000Z");
    const raw = serializeLearnerMemory(mem);
    const back = deserializeLearnerMemory(raw);
    expect(back.schemaVersion).toBe(LEARNER_MEMORY_SCHEMA_VERSION);
    expect(back.learnerKey).toBe(LEARNER);
    expect(back.events).toHaveLength(mem.events.length);
    expect(serializeLearnerMemory(back)).toBe(raw);
  });

  it("deserialize rejects mismatched schema versions", () => {
    const stale = '{"schemaVersion":"placement-v4-learner-memory-v0","learnerKey":"x","createdAt":"2026-01-01T00:00:00.000Z","events":[],"snapshots":[],"cefrTimeline":[],"skillTrends":[],"lessonMastery":[]}';
    expect(() => deserializeLearnerMemory(stale)).toThrow(/schema version mismatch/);
  });
});

describe("learnerMemory — replay reconstruction", () => {
  function buildLiveMemory(): LearnerMemory {
    let mem = createLearnerMemory({ learnerKey: LEARNER, createdAt: "2026-01-01T00:00:00.000Z" });
    mem = appendPlacementSnapshotEvent(
      mem,
      placementSnapshot({
        recordedAt: "2026-02-01T00:00:00.000Z",
        sourceId: "src-a",
        overallCefr: "A1",
      }),
    );
    mem = appendLessonMasteryEvent(mem, {
      roomId: "r1",
      score: 0.55,
      attemptedAt: "2026-02-10T00:00:00.000Z",
    });
    mem = appendPlacementSnapshotEvent(
      mem,
      placementSnapshot({
        recordedAt: "2026-04-01T00:00:00.000Z",
        sourceId: "src-b",
        overallCefr: "A2",
      }),
    );
    mem = appendLessonMasteryEvent(mem, {
      roomId: "r1",
      score: 0.85,
      attemptedAt: "2026-04-05T00:00:00.000Z",
    });
    mem = appendSkillTrendRecomputeEvent(mem, "2026-04-10T00:00:00.000Z");
    return mem;
  }

  it("replay rebuilds snapshots, mastery, and timeline byte-identically", () => {
    const live = buildLiveMemory();
    const replayed = replayEvents(LEARNER, live.events, { createdAt: live.createdAt });
    expect(replayed.snapshots).toEqual(live.snapshots);
    expect(replayed.lessonMastery).toEqual(live.lessonMastery);
    expect(replayed.cefrTimeline).toEqual(live.cefrTimeline);
    expect(replayed.skillTrends).toEqual(live.skillTrends);
    expect(serializeLearnerMemory(replayed)).toBe(serializeLearnerMemory(live));
  });

  it("replay is order-insensitive — same events shuffled yield the same projections", () => {
    const live = buildLiveMemory();
    const shuffled = [...live.events].reverse();
    const replayed = replayEvents(LEARNER, shuffled, { createdAt: live.createdAt });
    expect(serializeLearnerMemory(replayed)).toBe(serializeLearnerMemory(live));
  });

  it("replay fails closed on duplicate sequence numbers", () => {
    const live = buildLiveMemory();
    const duplicated: LearnerMemoryEvent[] = [
      ...live.events,
      { ...live.events[0]! },
    ];
    expect(() => replayEvents(LEARNER, duplicated)).toThrow(/duplicate event sequence/);
  });

  it("replay handles a pruned log with gaps in the sequence numbers", () => {
    const live = buildLiveMemory();
    // Drop the first event to simulate a post-prune log.
    const pruned = live.events.slice(1);
    const replayed = replayEvents(LEARNER, pruned, { createdAt: live.createdAt });
    expect(replayed.events).toHaveLength(pruned.length);
    // The first snapshot is gone, so the timeline begins at src-b.
    expect(replayed.cefrTimeline[0]!.sourceId).toBe("src-b");
  });

  it("replay reconstructs lessonMastery exactly even when payload is the projected record", () => {
    const live = buildLiveMemory();
    const replayed = replayEvents(LEARNER, live.events, { createdAt: live.createdAt });
    const masteryR1 = replayed.lessonMastery.find((r) => r.roomId === "r1");
    expect(masteryR1).toMatchObject({
      attempts: 2,
      bestScore: 0.85,
      lastAttemptAt: "2026-04-05T00:00:00.000Z",
      masteryLevel: "mastered",
    });
  });
});

describe("learnerMemory — contradictory skill history", () => {
  const at = "2026-05-20T00:00:00.000Z";

  it("preserves both readings in the snapshot list (does not silently drop the older one)", () => {
    const older = placementSnapshot({
      recordedAt: isoDaysAgo(at, 20),
      sourceId: "src-old",
      overallCefr: "B2",
      overallConfidence: 0.9,
    });
    const newer = placementSnapshot({
      recordedAt: isoDaysAgo(at, 5),
      sourceId: "src-new",
      overallCefr: "A1",
      overallConfidence: 0.9,
    });
    let mem = createLearnerMemory({ learnerKey: LEARNER, createdAt: isoDaysAgo(at, 30) });
    mem = appendPlacementSnapshotEvent(mem, older);
    mem = appendPlacementSnapshotEvent(mem, newer);
    expect(mem.snapshots).toHaveLength(2);
    expect(mem.cefrTimeline.map((p) => p.overallCefr)).toEqual(["B2", "A1"]);
  });

  it("trend bucket leans toward the more recent contradictory reading", () => {
    const older = placementSnapshot({
      recordedAt: isoDaysAgo(at, 20),
      sourceId: "src-old",
      overallCefr: "B2",
      overallConfidence: 0.9,
    });
    const newer = placementSnapshot({
      recordedAt: isoDaysAgo(at, 2),
      sourceId: "src-new",
      overallCefr: "A1",
      overallConfidence: 0.9,
    });
    const trend = computeSkillTrend([older, newer], "speaking", at);
    expect(trend!.lastObservedCefr).toBe("A1");
    // B2 ordinal = 3, A1 ordinal = 0. Recent A1 has weight ~1, older
    // B2 has weight ~0.63. Weighted mean ≈ (3*0.63 + 0*1)/(1.63) ≈ 1.16
    // i.e., closer to A2 than B1; well below 1.5.
    expect(trend!.meanLevelOrdinal).toBeLessThan(1.5);
    expect(trend!.sampleCount).toBe(2);
  });
});

describe("learnerMemory — invariants", () => {
  it("cefrOrdinal maps each CEFR level to its index", () => {
    expect(cefrOrdinal("A1")).toBe(0);
    expect(cefrOrdinal("C2")).toBe(5);
  });

  it("fingerprint changes when the memory changes", () => {
    let mem = createLearnerMemory({ learnerKey: LEARNER, createdAt: "2026-01-01T00:00:00.000Z" });
    const empty = fingerprintLearnerMemory(mem);
    mem = appendPlacementSnapshotEvent(
      mem,
      placementSnapshot({
        recordedAt: "2026-03-01T00:00:00.000Z",
        sourceId: "src",
        overallCefr: "A2",
      }),
    );
    expect(fingerprintLearnerMemory(mem)).not.toBe(empty);
  });

  it("rejects email-shaped sourceIds at snapshot build time", () => {
    expect(() =>
      buildPlacementSnapshot({
        learnerKey: LEARNER,
        recordedAt: "2026-04-01T00:00:00.000Z",
        sourceId: "alice@example.com",
        overallCefr: "A2",
        overallConfidence: 0.5,
        perSkill: {},
      }),
    ).toThrow(/email/);
  });
});
