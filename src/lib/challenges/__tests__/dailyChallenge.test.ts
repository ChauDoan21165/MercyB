import { describe, it, expect } from "vitest";

import {
  DAILY_CHALLENGES,
  getChallengeById,
} from "@/data/pronunciation-challenges";
import {
  pickTodaysChallenge,
  todayLocalISO,
} from "@/lib/challenges/dailyChallenge";

describe("todayLocalISO", () => {
  it("formats as YYYY-MM-DD with zero-padded month and day", () => {
    expect(todayLocalISO(new Date("2026-04-06T03:00:00"))).toBe("2026-04-06");
    expect(todayLocalISO(new Date("2026-12-31T23:59:00"))).toBe("2026-12-31");
  });
});

describe("pickTodaysChallenge", () => {
  it("returns a known challenge from the corpus", () => {
    const c = pickTodaysChallenge("user-1", { now: new Date("2026-04-28T10:00:00") });
    expect(c).not.toBeNull();
    expect(getChallengeById(c!.id)).toBeDefined();
  });

  it("is deterministic for the same user + same day", () => {
    const day = new Date("2026-04-28T10:00:00");
    const a = pickTodaysChallenge("user-1", { now: day });
    const b = pickTodaysChallenge("user-1", { now: day });
    expect(a?.id).toBe(b?.id);
  });

  it("rotates across days for the same user", () => {
    const userId = "user-1";
    const seen = new Set<string>();
    for (let d = 1; d <= 21; d++) {
      const day = new Date(`2026-04-${String(d).padStart(2, "0")}T10:00:00`);
      const c = pickTodaysChallenge(userId, { now: day });
      if (c) seen.add(c.id);
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  it("returns different challenges for different users on the same day", () => {
    const day = new Date("2026-04-28T10:00:00");
    const seen = new Set<string>();
    for (let i = 0; i < 30; i++) {
      const c = pickTodaysChallenge(`user-${i}`, { now: day });
      if (c) seen.add(c.id);
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  it("scopes to weakest phoneme when provided", () => {
    const day = new Date("2026-04-28T10:00:00");
    for (const phoneme of ["th", "r", "v", "w"]) {
      const c = pickTodaysChallenge("user-1", { now: day, weakestPhoneme: phoneme });
      expect(c, phoneme).not.toBeNull();
      expect(
        c!.target_phonemes.map((p) => p.toLowerCase()),
        `expected ${phoneme} in target_phonemes for ${c!.id}`,
      ).toContain(phoneme);
    }
  });

  it("falls back to full corpus when weakestPhoneme has no matches", () => {
    const day = new Date("2026-04-28T10:00:00");
    const c = pickTodaysChallenge("user-1", { now: day, weakestPhoneme: "zzz" });
    expect(c).not.toBeNull();
    expect(getChallengeById(c!.id)).toBeDefined();
  });

  it("returns null when the corpus is empty", () => {
    const c = pickTodaysChallenge("user-1", { corpus: [] });
    expect(c).toBeNull();
  });

  it("returns a stable challenge for the anonymous user (null id)", () => {
    const day = new Date("2026-04-28T10:00:00");
    const a = pickTodaysChallenge(null, { now: day });
    const b = pickTodaysChallenge(undefined, { now: day });
    expect(a?.id).toBe(b?.id);
  });

  it("only ever returns ids from the canonical corpus", () => {
    const valid = new Set(DAILY_CHALLENGES.map((c) => c.id));
    const day = new Date("2026-04-28T10:00:00");
    for (let i = 0; i < 50; i++) {
      const c = pickTodaysChallenge(`user-${i}`, { now: day });
      expect(c).not.toBeNull();
      expect(valid.has(c!.id)).toBe(true);
    }
  });
});
