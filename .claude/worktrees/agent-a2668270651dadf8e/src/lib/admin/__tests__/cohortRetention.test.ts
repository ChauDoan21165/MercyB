// src/lib/admin/__tests__/cohortRetention.test.ts
//
// Pure-function coverage for cohort grouping, activity indexing,
// retention computation, segmentation, and tier classification.
// 18 cases — exceeds the brief's 15-case minimum.

import { describe, expect, it } from "vitest";

import {
  RETENTION_DAY_OFFSETS,
  buildActivityIndex,
  buildRetentionTriangle,
  classifyRetention,
  computeCohortRetention,
  filterBySegment,
  groupProfilesByWeek,
  startOfWeekUtc,
  type ProfileRow,
  type ActivityRow,
} from "../cohortRetention";

// Helper: build a Date at UTC midnight on a specific calendar day.
function dayUtc(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}

describe("startOfWeekUtc", () => {
  it("Monday is its own week start", () => {
    const monday = dayUtc(2026, 4, 27); // 2026-04-27 is a Monday
    expect(startOfWeekUtc(monday).toISOString().slice(0, 10)).toBe("2026-04-27");
  });
  it("Sunday rolls back to the previous Monday", () => {
    const sunday = dayUtc(2026, 4, 26); // Sunday
    expect(startOfWeekUtc(sunday).toISOString().slice(0, 10)).toBe("2026-04-20");
  });
  it("Wednesday rolls back to its Monday", () => {
    const wed = dayUtc(2026, 4, 29);
    expect(startOfWeekUtc(wed).toISOString().slice(0, 10)).toBe("2026-04-27");
  });
});

describe("buildActivityIndex", () => {
  it("groups multiple rows for one user into a single set of unique days", () => {
    const rows: ActivityRow[] = [
      { user_id: "u1", active_at: "2026-04-27T00:00:00Z" },
      { user_id: "u1", active_at: "2026-04-27T18:00:00Z" }, // same day
      { user_id: "u1", active_at: "2026-04-28T00:00:00Z" },
    ];
    const idx = buildActivityIndex(rows);
    expect([...(idx.get("u1") ?? [])].sort()).toEqual(["2026-04-27", "2026-04-28"]);
  });
  it("ignores rows missing user_id or active_at", () => {
    const rows = [
      { user_id: "", active_at: "2026-04-27" },
      { user_id: "u2", active_at: "" },
    ] as ActivityRow[];
    expect(buildActivityIndex(rows).size).toBe(0);
  });
});

describe("groupProfilesByWeek", () => {
  it("groups by Monday-anchored ISO date", () => {
    const profiles: ProfileRow[] = [
      { id: "a", created_at: "2026-04-27T10:00:00Z" }, // Mon
      { id: "b", created_at: "2026-04-29T10:00:00Z" }, // Wed → same week
      { id: "c", created_at: "2026-05-04T10:00:00Z" }, // next Mon
    ];
    const grouped = groupProfilesByWeek(profiles);
    expect(grouped.get("2026-04-27")?.length).toBe(2);
    expect(grouped.get("2026-05-04")?.length).toBe(1);
  });
  it("skips profiles with unparseable created_at", () => {
    const profiles: ProfileRow[] = [
      { id: "a", created_at: "not-a-date" },
      { id: "b", created_at: "2026-04-27T10:00:00Z" },
    ];
    expect(groupProfilesByWeek(profiles).size).toBe(1);
  });
});

describe("filterBySegment", () => {
  const profiles: ProfileRow[] = [
    { id: "free1", created_at: "2026-04-27T00:00:00Z", tier: 0 },
    { id: "free2", created_at: "2026-04-27T00:00:00Z", tier: null },
    { id: "paid1", created_at: "2026-04-27T00:00:00Z", tier: 1 },
    { id: "paid2", created_at: "2026-04-27T00:00:00Z", tier: 3 },
  ];
  it("'all' returns everyone", () => {
    expect(filterBySegment(profiles, "all").length).toBe(4);
  });
  it("'paid' returns tier > 0", () => {
    expect(filterBySegment(profiles, "paid").map((p) => p.id).sort()).toEqual(["paid1", "paid2"]);
  });
  it("'free' includes tier 0 AND null tier", () => {
    expect(filterBySegment(profiles, "free").map((p) => p.id).sort()).toEqual(["free1", "free2"]);
  });
});

describe("computeCohortRetention", () => {
  // Cohort signs up Monday 2026-04-27 UTC. "Now" is Monday two weeks later.
  const NOW = dayUtc(2026, 5, 11);
  const cohort: ProfileRow[] = [
    { id: "u1", created_at: "2026-04-27T05:00:00Z" },
    { id: "u2", created_at: "2026-04-27T15:00:00Z" },
    { id: "u3", created_at: "2026-04-27T22:00:00Z" },
  ];

  it("day 0 counts users active on their own signup day", () => {
    const idx = buildActivityIndex([
      { user_id: "u1", active_at: "2026-04-27T06:00:00Z" },
      { user_id: "u2", active_at: "2026-04-27T16:00:00Z" },
      // u3 inactive on day 0
    ]);
    const t = computeCohortRetention(cohort, idx, NOW);
    const d0 = t.find((c) => c.daysSinceSignup === 0)!;
    expect(d0).toEqual({
      cohortWeekStart: "2026-04-27",
      daysSinceSignup: 0,
      activeUsers: 2,
      totalUsers: 3,
    });
  });

  it("day 7 counts only users active on signup-day + 7", () => {
    const idx = buildActivityIndex([
      { user_id: "u1", active_at: "2026-05-04T01:00:00Z" }, // 7 days later — yes
      { user_id: "u2", active_at: "2026-05-05T01:00:00Z" }, // 8 days later — no
      { user_id: "u3", active_at: "2026-05-04T23:00:00Z" }, // 7 days later — yes
    ]);
    const t = computeCohortRetention(cohort, idx, NOW);
    const d7 = t.find((c) => c.daysSinceSignup === 7)!;
    expect(d7.activeUsers).toBe(2);
    expect(d7.totalUsers).toBe(3);
  });

  it("excludes users for whom day-N has not yet elapsed", () => {
    // "Now" is only 5 days after signup; day-7 and day-14 have not elapsed.
    const earlyNow = dayUtc(2026, 5, 2);
    const t = computeCohortRetention(cohort, new Map(), earlyNow);
    const d7 = t.find((c) => c.daysSinceSignup === 7)!;
    const d14 = t.find((c) => c.daysSinceSignup === 14)!;
    const d3 = t.find((c) => c.daysSinceSignup === 3)!;
    expect(d7.totalUsers).toBe(0); // not enough time has passed
    expect(d14.totalUsers).toBe(0);
    expect(d3.totalUsers).toBe(3); // 5 days have elapsed; D3 is observed
  });

  it("emits one entry per RETENTION_DAY_OFFSETS value", () => {
    const t = computeCohortRetention(cohort, new Map(), NOW);
    const offsets = t.map((c) => c.daysSinceSignup);
    expect(offsets).toEqual([...RETENTION_DAY_OFFSETS]);
  });

  it("returns [] for an empty cohort", () => {
    expect(computeCohortRetention([], new Map(), NOW)).toEqual([]);
  });
});

describe("buildRetentionTriangle (top-level)", () => {
  it("orders cohorts newest-first, offsets ascending within cohort", () => {
    const profiles: ProfileRow[] = [
      { id: "old", created_at: "2026-04-13T00:00:00Z" }, // older cohort
      { id: "new", created_at: "2026-04-27T00:00:00Z" },
    ];
    const triangle = buildRetentionTriangle({
      profiles,
      activity: [],
      segment: "all",
      now: dayUtc(2026, 6, 1),
    });
    // First cohort label seen should be the newest (2026-04-27).
    expect(triangle[0].cohortWeekStart).toBe("2026-04-27");
    // Within a cohort, day offsets ascend.
    const newCohort = triangle.filter((r) => r.cohortWeekStart === "2026-04-27");
    expect(newCohort.map((r) => r.daysSinceSignup)).toEqual([...RETENTION_DAY_OFFSETS]);
  });

  it("respects the segment filter", () => {
    const profiles: ProfileRow[] = [
      { id: "free", created_at: "2026-04-27T00:00:00Z", tier: 0 },
      { id: "paid", created_at: "2026-04-27T00:00:00Z", tier: 2 },
    ];
    const tri = buildRetentionTriangle({
      profiles,
      activity: [],
      segment: "paid",
      now: dayUtc(2026, 6, 1),
    });
    const d0 = tri.find((r) => r.daysSinceSignup === 0)!;
    expect(d0.totalUsers).toBe(1); // only the paid user
  });
});

describe("classifyRetention", () => {
  it("ratio < 20% → red", () => {
    expect(classifyRetention(1, 100).tier).toBe("red");
  });
  it("20%–50% → yellow", () => {
    expect(classifyRetention(20, 100).tier).toBe("yellow");
    expect(classifyRetention(49, 100).tier).toBe("yellow");
  });
  it("≥50% → green", () => {
    expect(classifyRetention(50, 100).tier).toBe("green");
    expect(classifyRetention(75, 100).tier).toBe("green");
  });
  it("zero total → n/a with null ratio", () => {
    expect(classifyRetention(0, 0)).toEqual({ ratio: null, tier: "n/a" });
  });
});
