import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  canonical: {
    current: 1,
    longest: 1,
    lastStudiedDate: null as string | null,
    source: "local" as const,
  },
  recordActiveDay: vi.fn(),
}));

vi.mock("@/lib/streak/canonicalStreak", () => ({
  getCanonicalStreak: () => mocks.canonical,
}));

vi.mock("@/lib/retention/recordActiveDay", () => ({
  recordActiveDay: () => mocks.recordActiveDay(),
}));

import {
  recordConversationSession,
  getConversationStreak,
  __resetConversationStreakForTests,
  MIN_TURNS_FOR_SESSION,
} from "@/lib/conversationRetention/conversationStreak";

const TZ = "UTC";
const at = (iso: string) => new Date(iso);

function setCanonical(current: number, longest: number, lastStudiedDate: string | null) {
  mocks.canonical.current = current;
  mocks.canonical.longest = longest;
  mocks.canonical.lastStudiedDate = lastStudiedDate;
}

beforeEach(() => {
  mocks.recordActiveDay.mockClear();
  setCanonical(1, 1, null);
  __resetConversationStreakForTests();
});

describe("conversationStreak — 5+ turn sessions feed the general streak", () => {
  it("does not count a session shorter than 5 turns", () => {
    const r = recordConversationSession({
      turnCount: 4,
      timeZone: TZ,
      now: at("2026-06-08T10:00:00Z"),
    });
    expect(r).toMatchObject({ counted: false, reason: "too_short" });
    expect(getConversationStreak().current).toBe(1);
    expect(mocks.recordActiveDay).not.toHaveBeenCalled();
  });

  it("computes first qualifying session through shared streak math", () => {
    setCanonical(0, 0, null);
    const r = recordConversationSession({
      turnCount: MIN_TURNS_FOR_SESSION,
      timeZone: TZ,
      now: at("2026-06-08T10:00:00Z"),
    });
    expect(r.reason).toBe("reset");
    expect(r.streak.current).toBe(1);
    expect(mocks.recordActiveDay).toHaveBeenCalledTimes(1);
  });

  it("does not double-count a second session on the same local day", () => {
    setCanonical(3, 5, "2026-06-08");
    const r = recordConversationSession({
      turnCount: 9,
      timeZone: TZ,
      now: at("2026-06-08T20:00:00Z"),
    });
    expect(r.reason).toBe("already_counted_today");
    expect(r.counted).toBe(true);
    expect(r.streak.current).toBe(3);
    expect(mocks.recordActiveDay).toHaveBeenCalledTimes(1);
  });

  it("increments on the next consecutive local day", () => {
    setCanonical(1, 1, "2026-06-08");
    const r = recordConversationSession({
      turnCount: 5,
      timeZone: TZ,
      now: at("2026-06-09T10:00:00Z"),
    });
    expect(r.reason).toBe("incremented");
    expect(r.streak.current).toBe(2);
    expect(r.streak.longest).toBe(2);
    expect(mocks.recordActiveDay).toHaveBeenCalledTimes(1);
  });

  it("extends across a single missed day using the shared grace rule", () => {
    setCanonical(1, 1, "2026-06-08");
    const r = recordConversationSession({
      turnCount: 5,
      timeZone: TZ,
      now: at("2026-06-10T10:00:00Z"),
    });
    expect(r.reason).toBe("incremented");
    expect(r.streak.current).toBe(2);
  });

  it("resets after a 3+ day gap, preserving general longest", () => {
    setCanonical(2, 4, "2026-06-09");
    const r = recordConversationSession({
      turnCount: 5,
      timeZone: TZ,
      now: at("2026-06-14T10:00:00Z"),
    });
    expect(r.reason).toBe("reset");
    expect(r.streak.current).toBe(1);
    expect(r.streak.longest).toBe(4);
  });

  it("never throws and returns prior state for bad input", () => {
    expect(() =>
      recordConversationSession({ turnCount: NaN as unknown as number, timeZone: TZ }),
    ).not.toThrow();
    expect(recordConversationSession({ turnCount: NaN as unknown as number }).counted).toBe(false);
    expect(mocks.recordActiveDay).not.toHaveBeenCalled();
  });
});
