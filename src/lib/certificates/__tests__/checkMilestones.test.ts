// src/lib/certificates/__tests__/checkMilestones.test.ts

import { describe, it, expect } from "vitest";
import {
  MILESTONES,
  checkMilestones,
} from "../checkMilestones";
import type { CertificateType, MilestoneSnapshot } from "../types";

const ZERO: MilestoneSnapshot = {
  total_xp: 0,
  streak_days: 0,
  rooms_completed: 0,
  vocab_mastered: 0,
  pronunciation_drills: 0,
  writing_submissions: 0,
};

describe("MILESTONES table", () => {
  it("declares one rule per CertificateType (no duplicates)", () => {
    const types = MILESTONES.map((m) => m.type);
    const unique = new Set(types);
    expect(unique.size).toBe(types.length);
  });
});

describe("checkMilestones — empty state", () => {
  it("returns [] when nothing meets a threshold", () => {
    expect(checkMilestones(ZERO, [])).toEqual([]);
  });
});

describe("checkMilestones — single category", () => {
  it("xp_100 fires at exactly 100 XP", () => {
    const result = checkMilestones({ ...ZERO, total_xp: 100 }, []);
    expect(result).toEqual(["xp_100"]);
  });

  it("xp_100 + xp_500 both fire when XP crosses 500 in one event", () => {
    const result = checkMilestones({ ...ZERO, total_xp: 500 }, []);
    expect(result).toEqual(["xp_100", "xp_500"]);
  });

  it("xp_500 alone fires when xp_100 was already earned", () => {
    const result = checkMilestones({ ...ZERO, total_xp: 600 }, ["xp_100"]);
    expect(result).toEqual(["xp_500"]);
  });
});

describe("checkMilestones — already-earned exclusion", () => {
  it("never re-emits a cert in alreadyEarned (Set form)", () => {
    const earned: ReadonlySet<CertificateType> = new Set([
      "xp_100",
      "xp_500",
      "xp_1000",
    ]);
    const result = checkMilestones({ ...ZERO, total_xp: 1500 }, earned);
    expect(result).toEqual([]);
  });

  it("works with a plain array of already-earned types", () => {
    const result = checkMilestones({ ...ZERO, total_xp: 1500 }, [
      "xp_100",
      "xp_500",
    ]);
    expect(result).toEqual(["xp_1000"]);
  });
});

describe("checkMilestones — multiple categories at once", () => {
  it("fires across XP + streak + rooms in threshold order", () => {
    const result = checkMilestones(
      {
        total_xp: 100,
        streak_days: 7,
        rooms_completed: 10,
        vocab_mastered: 0,
        pronunciation_drills: 0,
        writing_submissions: 0,
      },
      [],
    );
    expect(result).toEqual(["xp_100", "streak_7", "rooms_10"]);
  });
});

describe("checkMilestones — bad input", () => {
  it("ignores non-finite snapshot values without throwing", () => {
    const bad: MilestoneSnapshot = {
      ...ZERO,
      total_xp: Number.NaN,
      streak_days: Infinity,
    };
    expect(() => checkMilestones(bad, [])).not.toThrow();
    expect(checkMilestones(bad, [])).toEqual([]);
  });
});

describe("checkMilestones — every documented milestone is reachable", () => {
  it("can earn every CertificateType from a maxed snapshot", () => {
    const maxed: MilestoneSnapshot = {
      total_xp: 99999,
      streak_days: 9999,
      rooms_completed: 9999,
      vocab_mastered: 9999,
      pronunciation_drills: 9999,
      writing_submissions: 9999,
    };
    const result = checkMilestones(maxed, []);
    expect(result.length).toBe(MILESTONES.length);
  });
});
