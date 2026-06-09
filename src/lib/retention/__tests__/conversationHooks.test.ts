import { describe, expect, it, vi } from "vitest";

import {
  awardConversationTurnXP,
  getEncouragementForTurn,
} from "@/lib/retention/conversationHooks";

const awardXPEventBackground = vi.fn();

vi.mock("@/lib/xp/awardXPEvent", () => ({
  awardXPEventBackground: (...args: unknown[]) => awardXPEventBackground(...args),
}));

vi.mock("@/lib/streak/canonicalStreak", () => ({
  getCanonicalStreak: () => ({
    current: 4,
    longest: 4,
    lastStudiedDate: "2026-06-09",
    source: "local",
  }),
}));

describe("conversationHooks encouragement copy", () => {
  it("starts with a low-pressure first-turn message", () => {
    const copy = getEncouragementForTurn(1, 0, 0);
    expect(copy.tone).toBe("first_turn");
    expect(copy.vi).toContain("bắt đầu");
    expect(copy.en).toContain("Short answers count");
  });

  it("frames errors as repairs, not failure", () => {
    const copy = getEncouragementForTurn(3, 2, 0);
    expect(copy.tone).toBe("repair");
    expect(copy.vi).toContain("bắt được 2");
    expect(copy.en).toContain("caught 2");
  });

  it("uses a milestone line every five turns", () => {
    const copy = getEncouragementForTurn(10, 0, 0);
    expect(copy.tone).toBe("milestone");
    expect(copy.vi).toContain("10 lượt");
  });

  it("can reference the existing general streak", () => {
    const copy = getEncouragementForTurn(4, 0, 3);
    expect(copy.tone).toBe("streak");
    expect(copy.vi).toContain("Chuỗi 3 ngày");
  });
});

describe("awardConversationTurnXP", () => {
  it("awards baseline conversation-turn XP", () => {
    awardXPEventBackground.mockClear();
    awardConversationTurnXP(2, false);
    expect(awardXPEventBackground).toHaveBeenCalledWith({
      event_type: "conversation_turn",
      xp_amount: 2,
      multiplier: 1,
    });
  });

  it("bumps accepted corrections and milestones", () => {
    awardXPEventBackground.mockClear();
    awardConversationTurnXP(5, true);
    expect(awardXPEventBackground).toHaveBeenCalledWith({
      event_type: "conversation_turn",
      xp_amount: 4,
      multiplier: 1.5,
    });
  });
});
