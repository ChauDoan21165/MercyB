import { describe, it, expect, beforeEach } from "vitest";

import {
  recordConversationSession,
  getConversationStreak,
  __resetConversationStreakForTests,
  MIN_TURNS_FOR_SESSION,
} from "@/lib/conversationRetention/conversationStreak";

const TZ = "UTC"; // deterministic local-day bucketing
const at = (iso: string) => new Date(iso);

beforeEach(() => {
  __resetConversationStreakForTests();
});

describe("conversationStreak — 5+ turn sessions, reusing streak math", () => {
  it("does not count a session shorter than 5 turns", () => {
    const r = recordConversationSession({ turnCount: 4, timeZone: TZ, now: at("2026-06-08T10:00:00Z") });
    expect(r).toMatchObject({ counted: false, reason: "too_short" });
    expect(getConversationStreak().current).toBe(0);
  });

  it("starts the streak at 1 on the first qualifying session", () => {
    const r = recordConversationSession({ turnCount: MIN_TURNS_FOR_SESSION, timeZone: TZ, now: at("2026-06-08T10:00:00Z") });
    expect(r.reason).toBe("reset"); // first_ever maps to reset→1
    expect(r.streak.current).toBe(1);
    expect(getConversationStreak().current).toBe(1);
  });

  it("does not double-count a second session on the same local day", () => {
    recordConversationSession({ turnCount: 6, timeZone: TZ, now: at("2026-06-08T08:00:00Z") });
    const r2 = recordConversationSession({ turnCount: 9, timeZone: TZ, now: at("2026-06-08T20:00:00Z") });
    expect(r2.reason).toBe("already_counted_today");
    expect(r2.counted).toBe(true);
    expect(getConversationStreak().current).toBe(1);
  });

  it("increments on the next consecutive local day", () => {
    recordConversationSession({ turnCount: 5, timeZone: TZ, now: at("2026-06-08T10:00:00Z") });
    const r = recordConversationSession({ turnCount: 5, timeZone: TZ, now: at("2026-06-09T10:00:00Z") });
    expect(r.reason).toBe("incremented");
    expect(r.streak.current).toBe(2);
    expect(r.streak.longest).toBe(2);
  });

  it("extends across a single missed day (built-in grace)", () => {
    recordConversationSession({ turnCount: 5, timeZone: TZ, now: at("2026-06-08T10:00:00Z") });
    // skip the 9th; act on the 10th (2-day gap = grace)
    const r = recordConversationSession({ turnCount: 5, timeZone: TZ, now: at("2026-06-10T10:00:00Z") });
    expect(r.reason).toBe("incremented");
    expect(r.streak.current).toBe(2);
  });

  it("resets to 1 after a 3+ day gap, preserving longest", () => {
    recordConversationSession({ turnCount: 5, timeZone: TZ, now: at("2026-06-08T10:00:00Z") });
    recordConversationSession({ turnCount: 5, timeZone: TZ, now: at("2026-06-09T10:00:00Z") }); // current 2, longest 2
    const r = recordConversationSession({ turnCount: 5, timeZone: TZ, now: at("2026-06-14T10:00:00Z") }); // 5-day gap
    expect(r.reason).toBe("reset");
    expect(r.streak.current).toBe(1);
    expect(r.streak.longest).toBe(2);
  });

  it("never throws and returns prior state for bad input", () => {
    expect(() => recordConversationSession({ turnCount: NaN as unknown as number, timeZone: TZ })).not.toThrow();
    expect(recordConversationSession({ turnCount: NaN as unknown as number }).counted).toBe(false);
  });
});
