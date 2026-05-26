import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  __clearRecommendationStateForTests,
  isCooldownPassed,
  RECOMMENDATION_COOLDOWN_MS,
  readRecommendationState,
  recordRecommendationShown,
  selectRecommendation,
} from "../practiceRecommendations";
import {
  __RULES_INTERNAL,
  RECOMMENDATION_RULES,
  type Recommendation,
  type RecommendationContext,
  type RecommendationRule,
} from "../recommendationRules";
import type { WeeklyProgress } from "@/lib/analytics/speechProgress";

const TEST_USER = "user-rec-1";

beforeEach(() => {
  if (typeof localStorage !== "undefined") localStorage.clear();
  if (typeof sessionStorage !== "undefined") sessionStorage.clear();
});

afterEach(() => {
  __clearRecommendationStateForTests(TEST_USER);
});

// ── Fixture builders ─────────────────────────────────────────────────────

function weekly(overrides: Partial<WeeklyProgress> = {}): WeeklyProgress {
  return {
    thisWeek: { startIso: "", endIso: "", attempts: 0, averageScore: null },
    lastWeek: { startIso: "", endIso: "", attempts: 0, averageScore: null },
    scoreDelta: null,
    attemptDelta: 0,
    mostImproved: [],
    weakest: [],
    phonemeAverages: [],
    streak: 0,
    totalMinutes: 0,
    ...overrides,
  };
}

function ctx(overrides: Partial<RecommendationContext> = {}): RecommendationContext {
  return {
    userId: TEST_USER,
    weekly: weekly(),
    now: 1_700_000_000_000,
    ...overrides,
  };
}

// ── isCooldownPassed: pure predicate ─────────────────────────────────────

describe("isCooldownPassed", () => {
  it("passes when state has never recorded a recommendation", () => {
    expect(
      isCooldownPassed("any:id", { lastRecommendationId: null, lastShownAt: 0 }, 1000),
    ).toBe(true);
  });

  it("passes when the candidate ID differs from the last shown ID", () => {
    expect(
      isCooldownPassed(
        "weak_phoneme_drill:th",
        { lastRecommendationId: "warm_up:default", lastShownAt: 999 },
        1000,
      ),
    ).toBe(true);
  });

  it("blocks the same ID within the 4-hour window", () => {
    const now = 10_000_000;
    expect(
      isCooldownPassed(
        "weak_phoneme_drill:th",
        {
          lastRecommendationId: "weak_phoneme_drill:th",
          lastShownAt: now - 60 * 60 * 1000,
        },
        now,
      ),
    ).toBe(false);
  });

  it("unblocks the same ID once 4 hours have passed", () => {
    const now = 10_000_000;
    expect(
      isCooldownPassed(
        "weak_phoneme_drill:th",
        {
          lastRecommendationId: "weak_phoneme_drill:th",
          lastShownAt: now - RECOMMENDATION_COOLDOWN_MS - 1,
        },
        now,
      ),
    ).toBe(true);
  });
});

// ── recordRecommendationShown / readRecommendationState round-trip ───────

describe("recordRecommendationShown", () => {
  it("persists ID and timestamp, readable back via readRecommendationState", () => {
    const rec: Recommendation = {
      id: "warm_up:default",
      type: "warm_up",
      title_vi: "x",
      title_en: "x",
      description_vi: "x",
      description_en: "x",
      target: "/speak",
      estimated_minutes: 3,
      why_this_matters_vi: "x",
      why_this_matters_en: "x",
    };
    recordRecommendationShown(TEST_USER, rec, 12345);
    const read = readRecommendationState(TEST_USER);
    expect(read.lastRecommendationId).toBe("warm_up:default");
    expect(read.lastShownAt).toBe(12345);
  });
});

// ── Individual rule eligibility ─────────────────────────────────────────

describe("weakPhonemeDrill rule", () => {
  it("fires when the weakest phoneme is below 60 with 3+ attempts", () => {
    const c = ctx({
      weekly: weekly({
        weakest: [{ phoneme: "th", averageScore: 42, attemptCount: 6 }],
      }),
    });
    expect(__RULES_INTERNAL.weakPhonemeDrill.isEligible(c)).toBe(true);
    const built = __RULES_INTERNAL.weakPhonemeDrill.build(c);
    expect(built?.id).toBe("weak_phoneme_drill:th");
    expect(built?.target).toBe("/speak");
  });

  it("declines when the score is high enough", () => {
    const c = ctx({
      weekly: weekly({
        weakest: [{ phoneme: "th", averageScore: 80, attemptCount: 6 }],
      }),
    });
    expect(__RULES_INTERNAL.weakPhonemeDrill.isEligible(c)).toBe(false);
  });

  it("declines when the user hasn't attempted the phoneme enough times", () => {
    const c = ctx({
      weekly: weekly({
        weakest: [{ phoneme: "th", averageScore: 40, attemptCount: 1 }],
      }),
    });
    expect(__RULES_INTERNAL.weakPhonemeDrill.isEligible(c)).toBe(false);
  });
});

describe("buildConsistency rule", () => {
  const NOW = 10_000_000_000;

  it("fires after 7+ days away from a previously practised room", () => {
    const c = ctx({
      now: NOW,
      recentActivity: {
        recentRoomIds: ["vip4_food"],
        lastSpeakAtMs: NOW - 8 * 24 * 60 * 60 * 1000,
      },
    });
    expect(__RULES_INTERNAL.buildConsistency.isEligible(c)).toBe(true);
    const built = __RULES_INTERNAL.buildConsistency.build(c);
    expect(built?.id).toBe("build_consistency:vip4_food");
    expect(built?.target).toBe("vip4_food");
  });

  it("declines when the user practised within the last week", () => {
    const c = ctx({
      now: NOW,
      recentActivity: {
        recentRoomIds: ["vip4_food"],
        lastSpeakAtMs: NOW - 2 * 24 * 60 * 60 * 1000,
      },
    });
    expect(__RULES_INTERNAL.buildConsistency.isEligible(c)).toBe(false);
  });
});

describe("mockInterviewPrep rule", () => {
  it("fires for users with 5+ Speak minutes who haven't tried mock interview", () => {
    const c = ctx({
      recentActivity: {
        speakMinutesThisWeek: 12,
        hasUsedMockInterview: false,
        lastSpeakAtMs: 1_000,
      },
    });
    expect(__RULES_INTERNAL.mockInterviewPrep.isEligible(c)).toBe(true);
    expect(__RULES_INTERNAL.mockInterviewPrep.build(c)?.target).toBe("/interview");
  });

  it("declines once the user has used mock interview", () => {
    const c = ctx({
      recentActivity: {
        speakMinutesThisWeek: 30,
        hasUsedMockInterview: true,
      },
    });
    expect(__RULES_INTERNAL.mockInterviewPrep.isEligible(c)).toBe(false);
  });
});

describe("readingAloudFocus rule", () => {
  it("fires for high-scoring users with low Speak minutes", () => {
    const c = ctx({
      weekly: weekly({
        thisWeek: { startIso: "", endIso: "", attempts: 8, averageScore: 86 },
      }),
      recentActivity: { speakMinutesThisWeek: 4 },
    });
    expect(__RULES_INTERNAL.readingAloudFocus.isEligible(c)).toBe(true);
  });

  it("declines when overall score is too low — weak_phoneme should win first anyway", () => {
    const c = ctx({
      weekly: weekly({
        thisWeek: { startIso: "", endIso: "", attempts: 8, averageScore: 55 },
      }),
      recentActivity: { speakMinutesThisWeek: 4 },
    });
    expect(__RULES_INTERNAL.readingAloudFocus.isEligible(c)).toBe(false);
  });
});

describe("warmUp rule", () => {
  const NOW = 10_000_000_000;
  it("fires when the user hasn't practised in 2+ days", () => {
    const c = ctx({
      now: NOW,
      recentActivity: { lastSpeakAtMs: NOW - 3 * 24 * 60 * 60 * 1000 },
    });
    expect(__RULES_INTERNAL.warmUp.isEligible(c)).toBe(true);
    expect(__RULES_INTERNAL.warmUp.build(c)?.target).toBe("/speak");
  });

  it("declines when the user practised yesterday", () => {
    const c = ctx({
      now: NOW,
      recentActivity: { lastSpeakAtMs: NOW - 12 * 60 * 60 * 1000 },
    });
    expect(__RULES_INTERNAL.warmUp.isEligible(c)).toBe(false);
  });
});

// ── Priority ladder via selectRecommendation ────────────────────────────

describe("selectRecommendation priority", () => {
  it("returns weak_phoneme_drill before consistency when both fire", () => {
    const NOW = 10_000_000_000;
    const c = ctx({
      now: NOW,
      weekly: weekly({
        weakest: [{ phoneme: "th", averageScore: 40, attemptCount: 5 }],
      }),
      recentActivity: {
        recentRoomIds: ["vip4_food"],
        lastSpeakAtMs: NOW - 8 * 24 * 60 * 60 * 1000,
      },
    });
    const rec = selectRecommendation(RECOMMENDATION_RULES, c, {
      lastRecommendationId: null,
      lastShownAt: 0,
    });
    expect(rec?.type).toBe("weak_phoneme_drill");
  });

  it("falls through to next eligible rule when the highest-priority rec is on cooldown", () => {
    const NOW = 10_000_000_000;
    const c = ctx({
      now: NOW,
      weekly: weekly({
        weakest: [{ phoneme: "th", averageScore: 40, attemptCount: 5 }],
      }),
      recentActivity: {
        recentRoomIds: ["vip4_food"],
        lastSpeakAtMs: NOW - 8 * 24 * 60 * 60 * 1000,
      },
    });
    const rec = selectRecommendation(RECOMMENDATION_RULES, c, {
      lastRecommendationId: "weak_phoneme_drill:th",
      lastShownAt: NOW - 1_000,
    });
    expect(rec?.type).toBe("build_consistency");
  });

  it("returns null when every eligible rule's recommendation is on cooldown", () => {
    const NOW = 10_000_000_000;
    const onlyWarmUp: readonly RecommendationRule[] = [__RULES_INTERNAL.warmUp];
    const c = ctx({
      now: NOW,
      recentActivity: { lastSpeakAtMs: NOW - 3 * 24 * 60 * 60 * 1000 },
    });
    const rec = selectRecommendation(onlyWarmUp, c, {
      lastRecommendationId: "warm_up:default",
      lastShownAt: NOW - 60 * 60 * 1000,
    });
    expect(rec).toBeNull();
  });

  it("returns null when no rule is eligible (zero signal)", () => {
    const c = ctx();
    const rec = selectRecommendation(RECOMMENDATION_RULES, c, {
      lastRecommendationId: null,
      lastShownAt: 0,
    });
    expect(rec).toBeNull();
  });

  it("recommendations include bilingual VI + EN copy", () => {
    const c = ctx({
      weekly: weekly({
        weakest: [{ phoneme: "θ", averageScore: 40, attemptCount: 5 }],
      }),
    });
    const rec = selectRecommendation(RECOMMENDATION_RULES, c, {
      lastRecommendationId: null,
      lastShownAt: 0,
    });
    expect(rec).not.toBeNull();
    expect(rec?.title_vi.length).toBeGreaterThan(0);
    expect(rec?.title_en.length).toBeGreaterThan(0);
    expect(rec?.description_vi.length).toBeGreaterThan(0);
    expect(rec?.description_en.length).toBeGreaterThan(0);
    expect(rec?.why_this_matters_vi.length).toBeGreaterThan(0);
    expect(rec?.why_this_matters_en.length).toBeGreaterThan(0);
  });
});

// ── End-to-end cooldown loop via record + select ────────────────────────

describe("record → cooldown → unblock loop", () => {
  it("first call returns rec; second call within 4h returns null; after 4h returns again", () => {
    const NOW = 10_000_000_000;
    const c = (now: number): RecommendationContext =>
      ctx({
        now,
        weekly: weekly({
          weakest: [{ phoneme: "th", averageScore: 40, attemptCount: 5 }],
        }),
      });

    const stateA: { lastRecommendationId: string | null; lastShownAt: number } = {
      lastRecommendationId: null,
      lastShownAt: 0,
    };

    const first = selectRecommendation(RECOMMENDATION_RULES, c(NOW), stateA);
    expect(first?.id).toBe("weak_phoneme_drill:th");

    const stateB = {
      lastRecommendationId: first!.id,
      lastShownAt: NOW,
    };
    // Same context, same ID — blocked.
    const second = selectRecommendation(RECOMMENDATION_RULES, c(NOW + 60 * 60 * 1000), stateB);
    expect(second).toBeNull();

    // 4h+1ms later — unblocked.
    const third = selectRecommendation(
      RECOMMENDATION_RULES,
      c(NOW + RECOMMENDATION_COOLDOWN_MS + 1),
      stateB,
    );
    expect(third?.id).toBe("weak_phoneme_drill:th");
  });
});
