import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { pickRecommendation } from "../RecommendedDrillCard";
import {
  __clearGraduationStateForTests,
  recordDrillSession,
} from "@/lib/pronunciation/drillGraduation";
import type { PhonemeAggregate } from "@/lib/analytics/speechProgress";

const TEST_USER = "user-rec-drill-1";

beforeEach(() => {
  if (typeof localStorage !== "undefined") localStorage.clear();
});

afterEach(() => {
  __clearGraduationStateForTests(TEST_USER);
});

function weak(phoneme: string, avg: number, count: number): PhonemeAggregate {
  return { phoneme, averageScore: avg, attemptCount: count };
}

describe("RecommendedDrillCard.pickRecommendation", () => {
  it("returns the lowest-scoring phoneme that has a drill pack", () => {
    const result = pickRecommendation(TEST_USER, [
      weak("th", 50, 8),
      weak("r", 65, 7),
    ]);
    expect(result?.pack.slug).toBe("th");
    expect(result?.weak.averageScore).toBe(50);
  });

  it("skips phonemes with fewer than 5 attempts", () => {
    const result = pickRecommendation(TEST_USER, [
      weak("th", 40, 2),
      weak("r", 65, 9),
    ]);
    expect(result?.pack.slug).toBe("r");
  });

  it("skips phonemes whose average is at or above the floor (70)", () => {
    const result = pickRecommendation(TEST_USER, [
      weak("th", 75, 8),
      weak("r", 50, 8),
    ]);
    expect(result?.pack.slug).toBe("r");
  });

  it("returns null when no weak phoneme qualifies", () => {
    const result = pickRecommendation(TEST_USER, [
      weak("th", 80, 8),
      weak("r", 75, 8),
    ]);
    expect(result).toBeNull();
  });

  it("respects the 24-hour cooldown after a drill session", () => {
    // Drill /th/ now, then ask for a recommendation 1 hour later.
    recordDrillSession({
      userId: TEST_USER,
      phonemeSlug: "th",
      sessionAvg: 50,
      now: 1_000_000,
    });
    const result = pickRecommendation(
      TEST_USER,
      [weak("th", 45, 8)],
      1_000_000 + 60 * 60 * 1000, // 1 hour later
    );
    expect(result).toBeNull();
  });

  it("unblocks the cooldown after 24+ hours", () => {
    recordDrillSession({
      userId: TEST_USER,
      phonemeSlug: "th",
      sessionAvg: 50,
      now: 1_000_000,
    });
    const result = pickRecommendation(
      TEST_USER,
      [weak("th", 45, 8)],
      1_000_000 + 25 * 60 * 60 * 1000, // 25 hours later
    );
    expect(result?.pack.slug).toBe("th");
  });

  it("falls through to the next eligible phoneme when the top one is on cooldown", () => {
    recordDrillSession({
      userId: TEST_USER,
      phonemeSlug: "th",
      sessionAvg: 50,
      now: 1_000_000,
    });
    const result = pickRecommendation(
      TEST_USER,
      [weak("th", 40, 8), weak("r", 55, 8)],
      1_000_000 + 60 * 60 * 1000,
    );
    expect(result?.pack.slug).toBe("r");
  });
});
