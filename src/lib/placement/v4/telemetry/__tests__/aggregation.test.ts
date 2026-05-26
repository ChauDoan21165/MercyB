import { describe, expect, it } from "vitest";

import {
  aggregateEvents,
  canonicalJSON,
  canonicalizeEvents,
  mergeAggregations,
} from "../index";
import { scenarioCommon, tDay } from "./fixtures";

function shuffle<T>(arr: readonly T[], seed: number): T[] {
  // Deterministic Fisher–Yates with a tiny LCG so the test stays replayable.
  const out = [...arr];
  let s = seed >>> 0;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1_664_525 + 1_013_904_223) >>> 0;
    const j = s % (i + 1);
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

describe("aggregation — determinism", () => {
  it("produces identical output for any permutation of the same event set", () => {
    const events = scenarioCommon();
    const base = aggregateEvents(events);
    const baseJson = canonicalJSON(base);

    for (let seed = 1; seed <= 16; seed++) {
      const permuted = shuffle(events, seed * 7919);
      const result = aggregateEvents(permuted);
      expect(canonicalJSON(result)).toBe(baseJson);
    }
  });

  it("canonicalizeEvents stably sorts by (timestamp, eventId)", () => {
    const events = scenarioCommon();
    const sorted = canonicalizeEvents(shuffle(events, 42));
    for (let i = 1; i < sorted.length; i++) {
      const a = sorted[i - 1];
      const b = sorted[i];
      if (a.timestampMs === b.timestampMs) {
        expect(a.eventId < b.eventId).toBe(true);
      } else {
        expect(a.timestampMs).toBeLessThan(b.timestampMs);
      }
    }
  });

  it("emits sorted lesson and user arrays", () => {
    const result = aggregateEvents(scenarioCommon());
    const lessonIds = result.lessons.map((l) => l.lessonId);
    expect([...lessonIds].sort()).toEqual(lessonIds);
    const userIds = result.users.map((u) => u.userIdHash);
    expect([...userIds].sort()).toEqual(userIds);
  });

  it("counts starts/completions/retries/dropoffs/speakingRetries correctly", () => {
    const result = aggregateEvents(scenarioCommon());
    const byId = new Map(result.lessons.map((l) => [l.lessonId, l] as const));

    const l1 = byId.get("lesson-1")!;
    expect(l1.starts).toBe(2);
    expect(l1.completions).toBe(1);
    expect(l1.retries).toBe(1);
    expect(l1.dropoffs).toBe(1);
    expect(l1.uniqueUsers).toBe(2);

    const l2 = byId.get("lesson-2")!;
    expect(l2.starts).toBe(1);
    expect(l2.completions).toBe(1);
    expect(l2.speakingRetries).toBe(2);
    expect(l2.hesitationLoops).toBe(1);

    const l3 = byId.get("lesson-3")!;
    expect(l3.starts).toBe(1);
    expect(l3.completions).toBe(1);
    expect(l3.dropoffs).toBe(0);
  });

  it("captures earliest and latest timestamps", () => {
    const events = scenarioCommon();
    const result = aggregateEvents(events);
    const ts = events.map((e) => e.timestampMs);
    expect(result.earliestMs).toBe(Math.min(...ts));
    expect(result.latestMs).toBe(Math.max(...ts));
  });

  it("returns empty summary for an empty input", () => {
    const result = aggregateEvents([]);
    expect(result.eventCount).toBe(0);
    expect(result.lessonCount).toBe(0);
    expect(result.userCount).toBe(0);
    expect(result.earliestMs).toBeNull();
    expect(result.latestMs).toBeNull();
  });

  it("never reads Date.now (replay-safe under clock skew)", () => {
    const events = scenarioCommon();
    const originalNow = Date.now;
    // Replace Date.now with a thrower; aggregation must NOT touch it.
    Date.now = () => {
      throw new Error("Date.now must not be called from telemetry aggregation");
    };
    try {
      expect(() => aggregateEvents(events)).not.toThrow();
    } finally {
      Date.now = originalNow;
    }
  });
});

describe("aggregation — mergeAggregations", () => {
  it("is associative across split inputs", () => {
    const all = scenarioCommon();
    const half = Math.floor(all.length / 2);
    const a = aggregateEvents(all.slice(0, half));
    const b = aggregateEvents(all.slice(half));
    const merged = mergeAggregations(a, b);
    const single = aggregateEvents(all);
    expect(canonicalJSON(merged)).toBe(canonicalJSON(single));
  });

  it("handles disjoint user/lesson sets", () => {
    const left = aggregateEvents([
      ...scenarioCommon().filter((e) =>
        "lessonId" in e ? e.lessonId === "lesson-1" : false,
      ),
    ]);
    const right = aggregateEvents([
      ...scenarioCommon().filter((e) =>
        "lessonId" in e ? e.lessonId === "lesson-3" : false,
      ),
    ]);
    const merged = mergeAggregations(left, right);
    const ids = merged.lessons.map((l) => l.lessonId);
    expect(ids).toEqual(["lesson-1", "lesson-3"]);
  });

  it("preserves day-ordinal precision after merge", () => {
    const a = aggregateEvents(
      scenarioCommon().filter((e) => e.timestampMs <= tDay(2)),
    );
    const b = aggregateEvents(
      scenarioCommon().filter((e) => e.timestampMs > tDay(2)),
    );
    const merged = mergeAggregations(a, b);
    const singleshot = aggregateEvents(scenarioCommon());
    for (const user of merged.users) {
      const expectedUser = singleshot.users.find(
        (u) => u.userIdHash === user.userIdHash,
      )!;
      expect(user.activeDays).toEqual(expectedUser.activeDays);
    }
  });
});
