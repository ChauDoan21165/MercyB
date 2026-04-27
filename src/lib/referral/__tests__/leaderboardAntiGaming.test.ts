// @vitest-environment node
//
// Pure-helper tests that mirror the SQL anti-gaming logic.

import { describe, it, expect } from "vitest";

import {
  applyDailyCap,
  findFlaggableOwners,
  type SuccessfulRef,
  type ReferralEvent,
} from "../leaderboardAntiGaming";

const day = (d: string, hourOffset: number = 0) =>
  new Date(`${d}T${pad2(hourOffset)}:00:00Z`).toISOString();

function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

describe("applyDailyCap", () => {
  it("returns empty map for empty input", () => {
    const result = applyDailyCap([]);
    expect(result.size).toBe(0);
  });

  it("caps a single-day burst at 5", () => {
    const refs: SuccessfulRef[] = Array.from({ length: 12 }, (_, i) => ({
      ownerUserId: "owner-A",
      convertedAt: day("2026-04-26", i % 24),
    }));
    // Same calendar day → 5 cap.
    const result = applyDailyCap(refs);
    expect(result.get("owner-A")).toBe(5);
  });

  it("sums across multiple days, each day capped independently", () => {
    const refs: SuccessfulRef[] = [
      ...Array(8).fill(null).map(() => ({
        ownerUserId: "owner-A",
        convertedAt: day("2026-04-25", 10),
      })),
      ...Array(3).fill(null).map(() => ({
        ownerUserId: "owner-A",
        convertedAt: day("2026-04-26", 10),
      })),
    ];
    // Day 1: cap at 5, Day 2: 3 → total 8.
    const result = applyDailyCap(refs);
    expect(result.get("owner-A")).toBe(8);
  });

  it("does not cross owners — separate accounts each get their own cap", () => {
    const refs: SuccessfulRef[] = [
      ...Array(7).fill(null).map(() => ({
        ownerUserId: "owner-A",
        convertedAt: day("2026-04-26", 10),
      })),
      ...Array(7).fill(null).map(() => ({
        ownerUserId: "owner-B",
        convertedAt: day("2026-04-26", 10),
      })),
    ];
    const result = applyDailyCap(refs);
    expect(result.get("owner-A")).toBe(5);
    expect(result.get("owner-B")).toBe(5);
  });

  it("respects a custom cap argument", () => {
    const refs: SuccessfulRef[] = Array.from({ length: 7 }, () => ({
      ownerUserId: "owner-A",
      convertedAt: day("2026-04-26", 10),
    }));
    expect(applyDailyCap(refs, 3).get("owner-A")).toBe(3);
  });

  it("ignores entries with invalid timestamps", () => {
    const refs: SuccessfulRef[] = [
      { ownerUserId: "o", convertedAt: "not-a-date" },
      { ownerUserId: "o", convertedAt: day("2026-04-26", 1) },
    ];
    expect(applyDailyCap(refs).get("o")).toBe(1);
  });
});

describe("findFlaggableOwners", () => {
  it("flags owners with 10+ refs in 1h", () => {
    const events: ReferralEvent[] = Array.from({ length: 10 }, (_, i) => ({
      ownerUserId: "spammer",
      // 10 refs evenly spaced over 30 minutes → all in the same 1h window.
      usedAt: new Date(
        new Date("2026-04-26T10:00:00Z").getTime() + i * 60_000 * 3,
      ).toISOString(),
    }));
    const result = findFlaggableOwners(events);
    expect(result.has("spammer")).toBe(true);
  });

  it("does not flag owners with fewer than 10 refs in 1h", () => {
    const events: ReferralEvent[] = Array.from({ length: 9 }, (_, i) => ({
      ownerUserId: "borderline",
      usedAt: new Date(
        new Date("2026-04-26T10:00:00Z").getTime() + i * 60_000 * 3,
      ).toISOString(),
    }));
    expect(findFlaggableOwners(events).has("borderline")).toBe(false);
  });

  it("does not flag refs spread across more than 1h", () => {
    const events: ReferralEvent[] = Array.from({ length: 12 }, (_, i) => ({
      ownerUserId: "patient",
      // 12 refs spread over 12 hours → at most 1 per hour.
      usedAt: new Date(
        new Date("2026-04-26T00:00:00Z").getTime() + i * 60 * 60_000,
      ).toISOString(),
    }));
    expect(findFlaggableOwners(events).has("patient")).toBe(false);
  });

  it("flags one owner without flagging another in the same dataset", () => {
    const events: ReferralEvent[] = [
      ...Array.from({ length: 11 }, (_, i) => ({
        ownerUserId: "spammer",
        usedAt: new Date(
          new Date("2026-04-26T10:00:00Z").getTime() + i * 60_000,
        ).toISOString(),
      })),
      // Patient owner — only 3 refs total.
      ...Array.from({ length: 3 }, (_, i) => ({
        ownerUserId: "patient",
        usedAt: new Date(
          new Date("2026-04-26T10:00:00Z").getTime() + i * 60 * 60_000,
        ).toISOString(),
      })),
    ];
    const flagged = findFlaggableOwners(events);
    expect(flagged.has("spammer")).toBe(true);
    expect(flagged.has("patient")).toBe(false);
    expect(flagged.size).toBe(1);
  });

  it("respects a custom threshold + window", () => {
    const events: ReferralEvent[] = Array.from({ length: 5 }, (_, i) => ({
      ownerUserId: "boundary",
      usedAt: new Date(
        new Date("2026-04-26T10:00:00Z").getTime() + i * 60_000,
      ).toISOString(),
    }));
    // Threshold=5 → flagged.
    expect(findFlaggableOwners(events, 5).has("boundary")).toBe(true);
    // Threshold=6 → not.
    expect(findFlaggableOwners(events, 6).has("boundary")).toBe(false);
  });
});
