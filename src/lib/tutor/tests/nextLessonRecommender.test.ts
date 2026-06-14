import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  recommendNextLessons,
  countDataPoints,
  COLD_START_THRESHOLD,
} from "@/lib/tutor/nextLessonRecommender";
import {
  buildProfileFromServerData,
  syncProfileWithServerData,
  type ServerProfileInput,
} from "@/lib/tutor/learnerProfileBuilder";
import {
  FIXTURE_VN_LEARNER_B1_12_SESSIONS,
  FIXTURE_VN_LEARNER_NEW,
  FIXTURE_VN_LEARNER_TENSE_ONLY,
} from "@/lib/tutor/tests/fixtures/learnerHistoryProfile.fixture";
import {
  getLearnerHistoryProfileKey,
  createEmptyLearnerHistoryProfile,
} from "@/lib/tutor/learnerHistoryProfile";
import type { LearnerHistoryProfile } from "@/lib/tutor/learnerHistoryProfile";

// ─── helpers ────────────────────────────────────────────────────────────────

/** Build a profile with exactly (threshold - 1) data points to trigger abstain. */
function coldStartProfile(): LearnerHistoryProfile {
  return {
    ...FIXTURE_VN_LEARNER_NEW,
    sessionCount: COLD_START_THRESHOLD - 1,
    interferencePatterns: [],
  };
}

/** Build a profile with exactly COLD_START_THRESHOLD data points — just enough. */
function minimalRecommendableProfile(): LearnerHistoryProfile {
  return {
    ...FIXTURE_VN_LEARNER_NEW,
    sessionCount: COLD_START_THRESHOLD,
    interferencePatterns: [],
    topicMastery: { "past-tense": 30 },
  };
}

// ─── cold-start / abstain ────────────────────────────────────────────────────

describe("recommendNextLessons — cold-start abstain", () => {
  it("returns a single cold-start:abstain entry when data points < threshold", () => {
    const profile = coldStartProfile();
    expect(countDataPoints(profile)).toBeLessThan(COLD_START_THRESHOLD);

    const recs = recommendNextLessons(profile);

    expect(recs).toHaveLength(1);
    expect(recs[0].ruleFired).toBe("cold-start:abstain");
    expect(recs[0].targetSkill).toBe("starter-sentence");
    expect(recs[0].suggestedMode).toBe("grammar");
  });

  it("does NOT abstain when data points reach the threshold", () => {
    const profile = minimalRecommendableProfile();
    expect(countDataPoints(profile)).toBeGreaterThanOrEqual(COLD_START_THRESHOLD);

    const recs = recommendNextLessons(profile);

    expect(recs[0].ruleFired).not.toBe("cold-start:abstain");
  });

  it("FIXTURE_VN_LEARNER_NEW triggers cold-start abstain (sessionCount=1, no observations)", () => {
    const recs = recommendNextLessons(FIXTURE_VN_LEARNER_NEW);

    expect(recs).toHaveLength(1);
    expect(recs[0].ruleFired).toBe("cold-start:abstain");
  });
});

// ─── ranked list ────────────────────────────────────────────────────────────

describe("recommendNextLessons — ranked list", () => {
  it("top recommendation fires missing-article rule on B1 learner fixture", () => {
    const recs = recommendNextLessons(FIXTURE_VN_LEARNER_B1_12_SESSIONS);

    expect(recs[0].ruleFired).toBe("viet-interference:missing-article");
    expect(recs[0].targetSkill).toBe("missing-article");
    expect(recs[0].suggestedMode).toBe("grammar");
    expect(recs[0].lessonTitle).toContain("article");
    expect(recs[0].reason).toContain("5 times");
  });

  it("B1 fixture produces multiple ranked recommendations in priority order", () => {
    const recs = recommendNextLessons(FIXTURE_VN_LEARNER_B1_12_SESSIONS);

    expect(recs.length).toBeGreaterThanOrEqual(3);

    const rulesFired = recs.map((r) => r.ruleFired);
    expect(rulesFired).toContain("viet-interference:missing-article");
    expect(rulesFired).toContain("viet-interference:tense-omission");
    // missing-article (priority 10) must come before tense-omission (priority 20)
    expect(rulesFired.indexOf("viet-interference:missing-article")).toBeLessThan(
      rulesFired.indexOf("viet-interference:tense-omission"),
    );
  });

  it("B1 fixture: no cold-start:abstain in the list (learner has 21 data points)", () => {
    const recs = recommendNextLessons(FIXTURE_VN_LEARNER_B1_12_SESSIONS);
    expect(recs.map((r) => r.ruleFired)).not.toContain("cold-start:abstain");
  });

  it("FIXTURE_VN_LEARNER_TENSE_ONLY: top recommendation is tense-omission", () => {
    const recs = recommendNextLessons(FIXTURE_VN_LEARNER_TENSE_ONLY);

    expect(recs[0].ruleFired).toBe("viet-interference:tense-omission");
    expect(recs[0].targetSkill).toBe("tense-omission");
    expect(recs[0].suggestedMode).toBe("grammar");
    expect(recs[0].reason).toContain("4 sentences");
  });

  it("fires mastery:lowest-topic-review when interference is below threshold but mastery is weak", () => {
    const profile: LearnerHistoryProfile = {
      ...FIXTURE_VN_LEARNER_NEW,
      sessionCount: 8,
      topicMastery: { "past-tense": 28, "daily-life": 80 },
      interferencePatterns: [
        { tag: "missing-article" as const, observedCount: 1, lastSeenAt: 0 },
      ],
    };
    const recs = recommendNextLessons(profile);

    const rulesFired = recs.map((r) => r.ruleFired);
    expect(rulesFired).toContain("mastery:lowest-topic-review");

    const masteryRec = recs.find((r) => r.ruleFired === "mastery:lowest-topic-review")!;
    expect(masteryRec.targetSkill).toBe("past-tense");
  });

  it("ranks interference before history preference before mastery review", () => {
    const profile: LearnerHistoryProfile = {
      ...FIXTURE_VN_LEARNER_NEW,
      sessionCount: 8,
      preferredMode: "speak",
      topicMastery: { "past-tense": 28 },
      interferencePatterns: [
        { tag: "tense-omission" as const, observedCount: 2, lastSeenAt: 0 },
      ],
    };

    expect(recommendNextLessons(profile).map((rec) => rec.ruleFired)).toEqual([
      "viet-interference:tense-omission",
      "preference:mode-promotion",
      "mastery:lowest-topic-review",
    ]);
  });

  it("breaks equal mastery ties by topic id for deterministic output", () => {
    const profile: LearnerHistoryProfile = {
      ...FIXTURE_VN_LEARNER_NEW,
      sessionCount: 6,
      topicMastery: { "word-order": 30, "past-tense": 30 },
      interferencePatterns: [],
    };

    const masteryRec = recommendNextLessons(profile).find(
      (rec) => rec.ruleFired === "mastery:lowest-topic-review",
    )!;

    expect(masteryRec.targetSkill).toBe("past-tense");
  });

  it("fires preference:mode-promotion when preferredMode is set and sessionCount >= 5", () => {
    const profile: LearnerHistoryProfile = {
      ...FIXTURE_VN_LEARNER_B1_12_SESSIONS,
      preferredMode: "speak",
    };
    const recs = recommendNextLessons(profile);

    const rulesFired = recs.map((r) => r.ruleFired);
    expect(rulesFired).toContain("preference:mode-promotion");

    const modeRec = recs.find((r) => r.ruleFired === "preference:mode-promotion")!;
    expect(modeRec.suggestedMode).toBe("speak");
    expect(modeRec.targetSkill).toBe("preferred-mode-speak");
  });

  it("every recommendation has all required fields", () => {
    const recs = recommendNextLessons(FIXTURE_VN_LEARNER_B1_12_SESSIONS);

    for (const rec of recs) {
      expect(rec.lessonTitle).toBeTruthy();
      expect(rec.targetSkill).toBeTruthy();
      expect(rec.reason).toBeTruthy();
      expect(["journey", "grammar", "speak", "logic"]).toContain(rec.suggestedMode);
      expect(rec.ruleFired).toBeTruthy();
    }
  });
});

// ─── determinism ────────────────────────────────────────────────────────────

describe("recommendNextLessons — determinism", () => {
  it("returns identical results on two consecutive calls with the same profile", () => {
    const recs1 = recommendNextLessons(FIXTURE_VN_LEARNER_B1_12_SESSIONS);
    const recs2 = recommendNextLessons(FIXTURE_VN_LEARNER_B1_12_SESSIONS);

    expect(recs1).toStrictEqual(recs2);
  });

  it("cold-start result is also deterministic", () => {
    const profile = coldStartProfile();
    expect(recommendNextLessons(profile)).toStrictEqual(recommendNextLessons(profile));
  });
});

// ─── countDataPoints ────────────────────────────────────────────────────────

describe("countDataPoints", () => {
  it("counts sessionCount + total interference observations", () => {
    const profile: LearnerHistoryProfile = {
      ...FIXTURE_VN_LEARNER_NEW,
      sessionCount: 3,
      interferencePatterns: [
        { tag: "missing-article" as const, observedCount: 2, lastSeenAt: 0 },
        { tag: "tense-omission" as const, observedCount: 1, lastSeenAt: 0 },
      ],
    };
    expect(countDataPoints(profile)).toBe(6); // 3 + 2 + 1
  });

  it("returns sessionCount when there are no interference patterns", () => {
    const profile: LearnerHistoryProfile = {
      ...FIXTURE_VN_LEARNER_NEW,
      sessionCount: 4,
      interferencePatterns: [],
    };
    expect(countDataPoints(profile)).toBe(4);
  });

  it("returns 0 for a completely empty profile", () => {
    const profile: LearnerHistoryProfile = {
      ...FIXTURE_VN_LEARNER_NEW,
      sessionCount: 0,
      interferencePatterns: [],
    };
    expect(countDataPoints(profile)).toBe(0);
  });
});

// ─── buildProfileFromServerData ─────────────────────────────────────────────

describe("buildProfileFromServerData — real fixture-grade server data", () => {
  const FIXED_NOW = 1_748_000_000_000;

  it("returns null when server input is empty", () => {
    const emptyInput: ServerProfileInput = { interferenceTagCounts: {}, sessionCount: 0 };
    const result = buildProfileFromServerData("ai-tutor", "en", emptyInput, FIXED_NOW);
    expect(result).toBeNull();
  });

  it("builds a profile with interference patterns from tag counts", () => {
    const input: ServerProfileInput = {
      interferenceTagCounts: {
        "missing-article": 5,
        "tense-omission": 3,
      },
      sessionCount: 12,
    };
    const profile = buildProfileFromServerData("ai-tutor", "en", input, FIXED_NOW);

    expect(profile).not.toBeNull();
    expect(profile!.sessionCount).toBe(12);

    const articlePattern = profile!.interferencePatterns.find(
      (p) => p.tag === "missing-article",
    );
    expect(articlePattern?.observedCount).toBe(5);

    const tensePattern = profile!.interferencePatterns.find(
      (p) => p.tag === "tense-omission",
    );
    expect(tensePattern?.observedCount).toBe(3);
  });

  it("produces a profile whose top recommendation is missing-article (B1-grade input)", () => {
    const input: ServerProfileInput = {
      interferenceTagCounts: {
        "missing-article": 5,
        "tense-omission": 3,
        "subj-verb-agreement": 1,
      },
      sessionCount: 12,
    };
    const profile = buildProfileFromServerData("ai-tutor", "en", input, FIXED_NOW)!;
    const recs = recommendNextLessons(profile);

    expect(recs[0].ruleFired).toBe("viet-interference:missing-article");
  });

  it("abstains when server data is below the cold-start threshold", () => {
    const input: ServerProfileInput = {
      interferenceTagCounts: {},
      sessionCount: 2,
    };
    const profile = buildProfileFromServerData("ai-tutor", "en", input, FIXED_NOW)!;
    const recs = recommendNextLessons(profile);

    expect(recs[0].ruleFired).toBe("cold-start:abstain");
  });
});

// ─── syncProfileWithServerData ───────────────────────────────────────────────

describe("syncProfileWithServerData — merge + persist", () => {
  const PRODUCT = "ai-tutor" as const;
  const LANG = "en";
  const FIXED_NOW = 1_748_100_000_000;

  let storageKey: string;
  let storageBackup: string | null;

  beforeEach(() => {
    storageKey = getLearnerHistoryProfileKey(PRODUCT, LANG);
    storageBackup = localStorage.getItem(storageKey);
    localStorage.removeItem(storageKey);
  });

  afterEach(() => {
    if (storageBackup !== null) {
      localStorage.setItem(storageKey, storageBackup);
    } else {
      localStorage.removeItem(storageKey);
    }
  });

  it("creates a fresh profile from server data when no local profile exists", () => {
    const input: ServerProfileInput = {
      interferenceTagCounts: { "missing-article": 5 },
      sessionCount: 12,
    };
    const profile = syncProfileWithServerData(PRODUCT, LANG, input, FIXED_NOW);

    expect(profile.sessionCount).toBe(12);
    expect(profile.interferencePatterns.find((p) => p.tag === "missing-article")?.observedCount).toBe(5);
    // Persisted to localStorage
    const stored = localStorage.getItem(storageKey);
    expect(stored).not.toBeNull();
  });

  it("preserves local topicMastery when merging with server data", () => {
    // Seed a local profile with mastery data (simulates engine-populated mastery)
    const localProfile: LearnerHistoryProfile = {
      ...createEmptyLearnerHistoryProfile(PRODUCT, LANG, FIXED_NOW),
      topicMastery: { "past-tense": 35, "daily-life": 75 },
      preferredMode: "grammar",
      sessionCount: 5,
    };
    localStorage.setItem(storageKey, JSON.stringify(localProfile));

    const serverInput: ServerProfileInput = {
      interferenceTagCounts: { "missing-article": 5 },
      sessionCount: 12,
    };
    const merged = syncProfileWithServerData(PRODUCT, LANG, serverInput, FIXED_NOW);

    // Server interference replaces local
    expect(merged.interferencePatterns.find((p) => p.tag === "missing-article")?.observedCount).toBe(5);
    // Local mastery is preserved
    expect(merged.topicMastery["past-tense"]).toBe(35);
    expect(merged.topicMastery["daily-life"]).toBe(75);
    // preferredMode preserved
    expect(merged.preferredMode).toBe("grammar");
    // sessionCount = max(local, server)
    expect(merged.sessionCount).toBe(12);
  });

  it("returns local profile unchanged when server input is empty", () => {
    const localProfile: LearnerHistoryProfile = {
      ...createEmptyLearnerHistoryProfile(PRODUCT, LANG, FIXED_NOW),
      sessionCount: 7,
      interferencePatterns: [
        { tag: "tense-omission" as const, observedCount: 3, lastSeenAt: FIXED_NOW },
      ],
    };
    localStorage.setItem(storageKey, JSON.stringify(localProfile));

    const emptyInput: ServerProfileInput = { interferenceTagCounts: {}, sessionCount: 0 };
    const result = syncProfileWithServerData(PRODUCT, LANG, emptyInput, FIXED_NOW);

    expect(result.sessionCount).toBe(7);
    expect(result.interferencePatterns[0].tag).toBe("tense-omission");
  });
});
