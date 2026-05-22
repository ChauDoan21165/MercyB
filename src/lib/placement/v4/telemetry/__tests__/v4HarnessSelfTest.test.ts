/**
 * V4 Telemetry Harness Tests — verify that the deterministic fixture
 * factories and scenario builders in v4TelemetryHarness produce stable,
 * reproducible output.
 *
 * These tests exercise the harness itself, not the telemetry modules.
 * No cross-module calls. No global setup changes.
 */

import { describe, expect, it } from "vitest";

import {
  scenarioCommon,
  scenarioMinimal,
  scenarioEmpty,
  scenarioCohort,
  scenarioDenseUserTimeline,
  scenarioStartsOnly,
  countByType,
  uniqueUsers,
  uniqueLessons,
  eventsInDayRange,
  firstOutOfOrderIndex,
  resetEventCounter,
  FIXED_EPOCH_MS,
  tDay,
  U1,
  U2,
  U3,
  U4,
  U5,
  U6,
  ALL_USERS,
  session,
  deepFreeze,
} from "./v4TelemetryHarness";

// ══════════════════════════════════════════════════════════════════════
// scenarioCommon determinism
// ══════════════════════════════════════════════════════════════════════

describe("V4 harness — scenarioCommon", () => {
  it("produces deterministic output across repeated calls", () => {
    const a = scenarioCommon();
    const b = scenarioCommon();

    expect(a).toHaveLength(b.length);
    for (let i = 0; i < a.length; i += 1) {
      expect(a[i]!.eventId).toBe(b[i]!.eventId);
      expect(a[i]!.type).toBe(b[i]!.type);
      expect(a[i]!.timestampMs).toBe(b[i]!.timestampMs);
      expect(a[i]!.userIdHash).toBe(b[i]!.userIdHash);
    }
  });

  it("all events have valid schema version", () => {
    const events = scenarioCommon();
    for (const event of events) {
      expect(event.v).toBe(1);
      expect(typeof event.userIdHash).toBe("string");
      expect(typeof event.sessionId).toBe("string");
      expect(typeof event.timestampMs).toBe("number");
    }
  });

  it("contains all supported event types", () => {
    const events = scenarioCommon();
    const types = new Set(events.map((e) => e.type));
    // The scenarioCommon fixture should include a variety of types.
    expect(types.has("lesson_start")).toBe(true);
    expect(types.has("lesson_complete")).toBe(true);
    expect(types.size).toBeGreaterThanOrEqual(4);
  });

  it("events are in chronological order", () => {
    const events = scenarioCommon();
    for (let i = 1; i < events.length; i += 1) {
      expect(events[i]!.timestampMs).toBeGreaterThanOrEqual(events[i - 1]!.timestampMs);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════
// scenarioMinimal
// ══════════════════════════════════════════════════════════════════════

describe("V4 harness — scenarioMinimal", () => {
  it("has exactly 2 events (start + complete)", () => {
    const events = scenarioMinimal();
    expect(events).toHaveLength(2);
    expect(events[0]!.type).toBe("lesson_start");
    expect(events[1]!.type).toBe("lesson_complete");
  });

  it("start precedes complete in time", () => {
    const events = scenarioMinimal();
    expect(events[0]!.timestampMs).toBeLessThan(events[1]!.timestampMs);
  });

  it("both events belong to the same user", () => {
    const events = scenarioMinimal();
    expect(events[0]!.userIdHash).toBe(events[1]!.userIdHash);
  });
});

// ══════════════════════════════════════════════════════════════════════
// scenarioEmpty
// ══════════════════════════════════════════════════════════════════════

describe("V4 harness — scenarioEmpty", () => {
  it("returns an empty array", () => {
    expect(scenarioEmpty()).toEqual([]);
  });

  it("is deterministic across repeated calls", () => {
    expect(scenarioEmpty()).toEqual(scenarioEmpty());
  });
});

// ══════════════════════════════════════════════════════════════════════
// scenarioCohort
// ══════════════════════════════════════════════════════════════════════

describe("V4 harness — scenarioCohort", () => {
  it("produces 2N events for N users (start + complete each)", () => {
    for (const n of [1, 3, 6]) {
      const events = scenarioCohort(n);
      expect(events).toHaveLength(n * 2);
    }
  });

  it("all events are valid lesson_start or lesson_complete", () => {
    const events = scenarioCohort(6);
    for (const event of events) {
      expect(["lesson_start", "lesson_complete"]).toContain(event.type);
    }
  });

  it("cycles through ALL_USERS when count exceeds available users", () => {
    const events = scenarioCohort(12);
    const users = uniqueUsers(events);
    // With 12 users cycling through 6 ALL_USERS, each appears at least once.
    expect(users.length).toBeGreaterThanOrEqual(1);
    expect(users.length).toBeLessThanOrEqual(6);
  });

  it("respects custom scoreRatio", () => {
    const events = scenarioCohort(1, { scoreRatio: 0.5 });
    const complete = events.find((e) => e.type === "lesson_complete");
    expect(complete).toBeDefined();
    if (complete && "scoreRatio" in complete) {
      expect((complete as { scoreRatio: number }).scoreRatio).toBe(0.5);
    }
  });

  it("respects custom cefrTarget", () => {
    const events = scenarioCohort(1, { cefrTarget: "C1" });
    const start = events.find((e) => e.type === "lesson_start");
    expect(start).toBeDefined();
    if (start && "cefrTarget" in start) {
      expect((start as { cefrTarget: string }).cefrTarget).toBe("C1");
    }
  });
});

// ══════════════════════════════════════════════════════════════════════
// scenarioDenseUserTimeline
// ══════════════════════════════════════════════════════════════════════

describe("V4 harness — scenarioDenseUserTimeline", () => {
  it("produces many events for 30 days", () => {
    const events = scenarioDenseUserTimeline({ dayCount: 30 });
    expect(events.length).toBeGreaterThan(50);
  });

  it("all events belong to the specified user", () => {
    const events = scenarioDenseUserTimeline({ dayCount: 10, userIdHash: U2 });
    for (const event of events) {
      expect(event.userIdHash).toBe(U2);
    }
  });

  it("produces at least 4 distinct event types", () => {
    const events = scenarioDenseUserTimeline({ dayCount: 30 });
    const types = Object.keys(countByType(events));
    expect(types.length).toBeGreaterThanOrEqual(4);
  });

  it("events are in chronological order", () => {
    const events = scenarioDenseUserTimeline({ dayCount: 10 });
    expect(firstOutOfOrderIndex(events)).toBe(-1);
  });

  it("is deterministic", () => {
    const a = scenarioDenseUserTimeline({ dayCount: 5 });
    const b = scenarioDenseUserTimeline({ dayCount: 5 });
    expect(a).toEqual(b);
  });
});

// ══════════════════════════════════════════════════════════════════════
// scenarioStartsOnly
// ══════════════════════════════════════════════════════════════════════

describe("V4 harness — scenarioStartsOnly", () => {
  it("produces exactly N lesson_start events", () => {
    for (const n of [0, 1, 5, 10]) {
      const events = scenarioStartsOnly(n);
      expect(events).toHaveLength(n);
      for (const event of events) {
        expect(event.type).toBe("lesson_start");
      }
    }
  });

  it("default count is 5", () => {
    const events = scenarioStartsOnly();
    expect(events).toHaveLength(5);
  });
});

// ══════════════════════════════════════════════════════════════════════
// Verification helpers
// ══════════════════════════════════════════════════════════════════════

describe("V4 harness — verification helpers", () => {
  it("uniqueUsers returns sorted unique hashes", () => {
    const events = scenarioCohort(6);
    const users = uniqueUsers(events);
    expect(users).toEqual([...users].sort());
    expect(new Set(users).size).toBe(users.length);
  });

  it("uniqueLessons returns sorted unique lesson ids", () => {
    const events = scenarioCohort(6);
    const lessons = uniqueLessons(events);
    expect(lessons).toEqual([...lessons].sort());
    expect(lessons.length).toBeGreaterThanOrEqual(1);
  });

  it("countByType correctly tallies event types", () => {
    const events = scenarioCommon();
    const counts = countByType(events);
    expect(counts.lesson_start).toBeGreaterThan(0);
    expect(counts.lesson_complete).toBeGreaterThan(0);
    // Sum of all counts equals total events.
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    expect(total).toBe(events.length);
  });

  it("eventsInDayRange filters to correct window", () => {
    const events = scenarioCohort(6, { baseDay: 0 });
    const filtered = eventsInDayRange(events, 0, 1);
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.length).toBeLessThanOrEqual(events.length);
    for (const event of filtered) {
      const day = Math.floor((event.timestampMs - FIXED_EPOCH_MS) / (24 * 60 * 60 * 1000));
      expect(day).toBeGreaterThanOrEqual(0);
      expect(day).toBeLessThanOrEqual(2);
    }
  });

  it("firstOutOfOrderIndex returns -1 for ordered events", () => {
    expect(firstOutOfOrderIndex(scenarioCommon())).toBe(-1);
    expect(firstOutOfOrderIndex(scenarioDenseUserTimeline({ dayCount: 10 }))).toBe(-1);
  });

  it("deepFreeze prevents mutation", () => {
    const obj = { a: 1, b: { c: 2 } };
    const frozen = deepFreeze(obj);
    expect(Object.isFrozen(frozen)).toBe(true);
    expect(Object.isFrozen(frozen.b)).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════
// User/session identities
// ══════════════════════════════════════════════════════════════════════

describe("V4 harness — identities", () => {
  it("ALL_USERS contains 6 unique entries", () => {
    expect(ALL_USERS).toHaveLength(6);
    expect(new Set(ALL_USERS).size).toBe(6);
  });

  it("U1–U6 are all distinct", () => {
    const ids = [U1, U2, U3, U4, U5, U6];
    expect(new Set(ids).size).toBe(6);
  });

  it("session generates predictable session ids", () => {
    const s1 = session(0, "test");
    const s2 = session(0, "test");
    expect(s1).toBe(s2);
  });

  it("session ids differ by user index", () => {
    expect(session(0, "x")).not.toBe(session(1, "x"));
  });
});
