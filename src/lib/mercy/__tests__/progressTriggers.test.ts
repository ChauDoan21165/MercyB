import { describe, expect, it, beforeEach } from "vitest";

import {
  classifyTrigger,
  incrementMessageCounter,
  isCooldownPassed,
  LOW_SCORE_THRESHOLD,
  PROGRESS_TRIGGERS_INTERNAL,
  readMentionState,
  recordProgressMention,
  shouldProactivelyMentionProgress,
  type ProgressMentionState,
} from "../progressTriggers";
import type { ProgressContext } from "../progressContext";

const TEST_USER = "user-test-1";

beforeEach(() => {
  if (typeof localStorage !== "undefined") {
    localStorage.clear();
  }
});

function ctx(overrides: Partial<ProgressContext> = {}): ProgressContext {
  return {
    attemptsThisWeek: 10,
    averageScoreThisWeek: 72,
    scoreDelta: 8,
    mostImprovedPhoneme: {
      phoneme: "th",
      previousScore: 60,
      currentScore: 85,
      delta: 25,
    },
    weakestPhoneme: { phoneme: "r", averageScore: 55 },
    streak: 3,
    builtAt: Date.now(),
    ...overrides,
  };
}

describe("classifyTrigger — frustration patterns (VN + EN)", () => {
  it.each([
    "khó quá",
    "hôm nay khó quá",
    "tôi tệ thật",
    "I can't do this",
    "I cant do this anymore",
    "this is not good enough",
    "tôi không thể",
    "muốn bỏ cuộc rồi",
    "so khó",
  ])("matches '%s' as frustration", (msg) => {
    expect(classifyTrigger(msg)).toBe("frustration");
  });
});

describe("classifyTrigger — self-check patterns", () => {
  it.each([
    "am I getting better?",
    "am I improving",
    "tôi giỏi không?",
    "tôi tiến bộ chưa?",
    "how am I doing today",
    "tôi học có tốt không",
  ])("matches '%s' as self_check", (msg) => {
    expect(classifyTrigger(msg)).toBe("self_check");
  });
});

describe("classifyTrigger — practice-ask patterns", () => {
  it.each([
    "what should I practice today",
    "hôm nay luyện gì",
    "hôm nay luyện cái gì hay nhất",
    "nên tập gì cho phát âm",
    "cho tôi bài tập đi",
    "suggest a drill",
  ])("matches '%s' as practice_ask", (msg) => {
    expect(classifyTrigger(msg)).toBe("practice_ask");
  });
});

describe("classifyTrigger — low-score signal", () => {
  it("falls back to low_score when message is empty + recent attempt < 60", () => {
    expect(classifyTrigger("", LOW_SCORE_THRESHOLD - 1)).toBe("low_score");
  });

  it("returns null when message is empty AND no low-score signal", () => {
    expect(classifyTrigger("")).toBeNull();
    expect(classifyTrigger("", 80)).toBeNull();
  });

  it("returns null for an unrelated message at any score", () => {
    expect(classifyTrigger("how do I say hello", 92)).toBeNull();
  });

  it("a triggering MESSAGE wins over score (frustration first)", () => {
    expect(classifyTrigger("khó quá", 95)).toBe("frustration");
  });
});

describe("isCooldownPassed", () => {
  const NOW = 1_000_000_000;
  const baseState: ProgressMentionState = {
    lastMentionAt: NOW,
    messagesSinceLastMention: 0,
  };

  it("passes immediately when there's never been a mention", () => {
    expect(isCooldownPassed({ lastMentionAt: 0, messagesSinceLastMention: 0 })).toBe(true);
  });

  it("blocks within the 30-minute window when message count low", () => {
    expect(isCooldownPassed(baseState, NOW + 60_000)).toBe(false);
  });

  it("unlocks after 30 minutes elapsed", () => {
    expect(isCooldownPassed(baseState, NOW + PROGRESS_TRIGGERS_INTERNAL.COOLDOWN_MS + 1)).toBe(true);
  });

  it("unlocks after N messages even within the time window", () => {
    expect(
      isCooldownPassed(
        { ...baseState, messagesSinceLastMention: PROGRESS_TRIGGERS_INTERNAL.COOLDOWN_MESSAGE_COUNT },
        NOW + 60_000,
      ),
    ).toBe(true);
  });
});

describe("shouldProactivelyMentionProgress — orchestrator", () => {
  const NOW = 1_000_000_000;

  it("returns false when context is null (no signal)", () => {
    expect(
      shouldProactivelyMentionProgress({
        userMessage: "khó quá",
        context: null,
        state: { lastMentionAt: 0, messagesSinceLastMention: 0 },
      }),
    ).toBe(false);
  });

  it("returns false when no trigger matches", () => {
    expect(
      shouldProactivelyMentionProgress({
        userMessage: "what does 'serendipity' mean",
        context: ctx(),
        state: { lastMentionAt: 0, messagesSinceLastMention: 0 },
      }),
    ).toBe(false);
  });

  it("returns false when cooldown blocks", () => {
    expect(
      shouldProactivelyMentionProgress({
        userMessage: "khó quá",
        context: ctx(),
        state: { lastMentionAt: NOW, messagesSinceLastMention: 0 },
        now: NOW + 60_000,
      }),
    ).toBe(false);
  });

  it("returns true on first-ever frustration trigger with context", () => {
    expect(
      shouldProactivelyMentionProgress({
        userMessage: "khó quá",
        context: ctx(),
        state: { lastMentionAt: 0, messagesSinceLastMention: 0 },
      }),
    ).toBe(true);
  });

  it("returns true after enough messages have passed since last mention", () => {
    expect(
      shouldProactivelyMentionProgress({
        userMessage: "tôi giỏi không?",
        context: ctx(),
        state: {
          lastMentionAt: NOW,
          messagesSinceLastMention: PROGRESS_TRIGGERS_INTERNAL.COOLDOWN_MESSAGE_COUNT,
        },
        now: NOW + 60_000,
      }),
    ).toBe(true);
  });

  it("low-score signal triggers when cooldown allows + message empty", () => {
    expect(
      shouldProactivelyMentionProgress({
        userMessage: "",
        recentAttemptScore: 45,
        context: ctx(),
        state: { lastMentionAt: 0, messagesSinceLastMention: 0 },
      }),
    ).toBe(true);
  });
});

describe("cooldown persistence (localStorage)", () => {
  it("recordProgressMention writes both fields atomically", () => {
    const NOW = 1_700_000_000_000;
    recordProgressMention(TEST_USER, NOW);
    const state = readMentionState(TEST_USER);
    expect(state.lastMentionAt).toBe(NOW);
    expect(state.messagesSinceLastMention).toBe(0);
  });

  it("incrementMessageCounter bumps without touching lastMentionAt", () => {
    const NOW = 1_700_000_000_000;
    recordProgressMention(TEST_USER, NOW);
    const a = incrementMessageCounter(TEST_USER);
    const b = incrementMessageCounter(TEST_USER);
    expect(a.messagesSinceLastMention).toBe(1);
    expect(b.messagesSinceLastMention).toBe(2);
    expect(b.lastMentionAt).toBe(NOW);
  });

  it("readMentionState returns empty defaults when never written", () => {
    const state = readMentionState("brand-new-user");
    expect(state).toEqual({ lastMentionAt: 0, messagesSinceLastMention: 0 });
  });

  it("readMentionState returns empty for empty userId (no key probe)", () => {
    expect(readMentionState("")).toEqual({ lastMentionAt: 0, messagesSinceLastMention: 0 });
  });

  it("readMentionState recovers gracefully from a corrupt JSON value", () => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem("mercy.progress.lastMention.v1." + TEST_USER, "{not json");
    expect(readMentionState(TEST_USER)).toEqual({
      lastMentionAt: 0,
      messagesSinceLastMention: 0,
    });
  });
});
