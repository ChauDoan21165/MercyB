import { describe, it, expect } from "vitest";
import { sequenceInterferencePatterns } from "../interferenceSequencer";
import type { LearnerInterferenceProfile } from "../types";
import type { VNL1Pattern } from "../../../data/placement/vnL1Interference";

// ── fixture patterns ────────────────────────────────────────────────────────

const PATTERNS: VNL1Pattern[] = [
  {
    id: "final_consonant_cluster_reduction",
    category: "phonology",
    name: "Final cluster reduction",
    shortDescription: "Drops final consonant clusters.",
    longDescription: "",
    vietnameseRoot: "",
    examples: [],
    cefrLevelsObserved: ["A1", "A2"],
    severity: "high",
    remediation: "",
    ruleTags: [],
  },
  {
    id: "missing_articles",
    category: "syntax",
    name: "Article omission",
    shortDescription: "Omits a/an/the.",
    longDescription: "",
    vietnameseRoot: "",
    examples: [],
    cefrLevelsObserved: ["A1", "A2"],
    severity: "medium",
    remediation: "",
    ruleTags: [],
  },
  {
    id: "past_tense_unmarked",
    category: "morphology",
    name: "Unmarked past tense",
    shortDescription: "Base form used for past.",
    longDescription: "",
    vietnameseRoot: "",
    examples: [],
    cefrLevelsObserved: ["A1", "A2"],
    severity: "high",
    remediation: "",
    ruleTags: [],
  },
  {
    id: "phrasal_verb_avoidance",
    category: "lexicon",
    name: "Phrasal verb avoidance",
    shortDescription: "Avoids phrasal verbs.",
    longDescription: "",
    vietnameseRoot: "",
    examples: [],
    cefrLevelsObserved: ["A2", "B1"],
    severity: "low",
    remediation: "",
    ruleTags: [],
  },
];

// ── profile A — struggling with phonology, emerging on syntax ───────────────

const PROFILE_A: LearnerInterferenceProfile = {
  learnerId: "learner-a",
  profileUpdatedAt: 1_000_000,
  masteryByPattern: {
    final_consonant_cluster_reduction: {
      patternId: "final_consonant_cluster_reduction",
      level: "struggling",
      score: 0.20,
      attemptsCount: 5,
      confidenceWidth: 0.12,
      lastUpdatedAt: 1_000_000,
    },
    missing_articles: {
      patternId: "missing_articles",
      level: "emerging",
      score: 0.50,
      attemptsCount: 3,
      confidenceWidth: 0.15,
      lastUpdatedAt: 1_000_000,
    },
    past_tense_unmarked: {
      patternId: "past_tense_unmarked",
      level: "mastered",
      score: 0.88,
      attemptsCount: 8,
      confidenceWidth: 0.08,
      lastUpdatedAt: 1_000_000,
    },
    // phrasal_verb_avoidance absent → untested
  },
};

// ── profile B — struggling with morphology, consolidating on phonology ──────

const PROFILE_B: LearnerInterferenceProfile = {
  learnerId: "learner-b",
  profileUpdatedAt: 1_000_000,
  masteryByPattern: {
    past_tense_unmarked: {
      patternId: "past_tense_unmarked",
      level: "struggling",
      score: 0.18,
      attemptsCount: 6,
      confidenceWidth: 0.10,
      lastUpdatedAt: 1_000_000,
    },
    final_consonant_cluster_reduction: {
      patternId: "final_consonant_cluster_reduction",
      level: "consolidating",
      score: 0.72,
      attemptsCount: 7,
      confidenceWidth: 0.09,
      lastUpdatedAt: 1_000_000,
    },
    // missing_articles and phrasal_verb_avoidance absent → untested
  },
};

// ── helpers ─────────────────────────────────────────────────────────────────

function orderedIds(profile: LearnerInterferenceProfile): string[] {
  return sequenceInterferencePatterns(profile, PATTERNS).entries.map(
    (e) => e.patternId,
  );
}

// ── tests ────────────────────────────────────────────────────────────────────

describe("sequenceInterferencePatterns", () => {
  it("returns one entry per pattern", () => {
    const result = sequenceInterferencePatterns(PROFILE_A, PATTERNS);
    expect(result.entries).toHaveLength(PATTERNS.length);
    const ids = result.entries.map((e) => e.patternId);
    expect(new Set(ids).size).toBe(PATTERNS.length);
  });

  it("attaches the correct learnerId to the result", () => {
    expect(sequenceInterferencePatterns(PROFILE_A, PATTERNS).learnerId).toBe("learner-a");
    expect(sequenceInterferencePatterns(PROFILE_B, PATTERNS).learnerId).toBe("learner-b");
  });

  it("profile A: struggling phonology pattern comes first", () => {
    const ids = orderedIds(PROFILE_A);
    expect(ids[0]).toBe("final_consonant_cluster_reduction");
  });

  it("profile A: mastered pattern precedes untested in order (consolidating/mastered before untested)", () => {
    const ids = orderedIds(PROFILE_A);
    const masteredIdx = ids.indexOf("past_tense_unmarked");
    const untestedIdx = ids.indexOf("phrasal_verb_avoidance");
    expect(masteredIdx).toBeLessThan(untestedIdx);
  });

  it("profile B: struggling morphology pattern comes first", () => {
    const ids = orderedIds(PROFILE_B);
    expect(ids[0]).toBe("past_tense_unmarked");
  });

  it("profiles A and B produce different sequences", () => {
    const seqA = orderedIds(PROFILE_A);
    const seqB = orderedIds(PROFILE_B);
    expect(seqA).not.toEqual(seqB);
  });

  it("within same mastery level, high-severity patterns come before medium/low", () => {
    // Both missing_articles (medium) and final_consonant (high) are untested in a fresh profile.
    const blankProfile: LearnerInterferenceProfile = {
      learnerId: "blank",
      profileUpdatedAt: 0,
      masteryByPattern: {},
    };
    const ids = orderedIds(blankProfile);
    const highIdx1 = ids.indexOf("final_consonant_cluster_reduction");
    const highIdx2 = ids.indexOf("past_tense_unmarked");
    const medIdx = ids.indexOf("missing_articles");
    const lowIdx = ids.indexOf("phrasal_verb_avoidance");

    expect(highIdx1).toBeLessThan(medIdx);
    expect(highIdx2).toBeLessThan(medIdx);
    expect(medIdx).toBeLessThan(lowIdx);
  });

  it("is deterministic — same profile produces same sequence on repeated calls", () => {
    const first = orderedIds(PROFILE_A);
    const second = orderedIds(PROFILE_A);
    expect(first).toEqual(second);
  });

  it("each entry includes a non-empty rationale string", () => {
    const result = sequenceInterferencePatterns(PROFILE_A, PATTERNS);
    for (const entry of result.entries) {
      expect(typeof entry.rationale).toBe("string");
      expect(entry.rationale.length).toBeGreaterThan(0);
    }
  });

  it("handles an empty pattern list without throwing", () => {
    const result = sequenceInterferencePatterns(PROFILE_A, []);
    expect(result.entries).toHaveLength(0);
  });
});

// ── Spacing (spaced-repetition) tests ─────────────────────────────────────────

import { computeNextReviewDayForLevel } from "../interferenceSequencer";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

describe("computeNextReviewDayForLevel", () => {
  it("untested patterns are always due (interval = 0)", () => {
    expect(computeNextReviewDayForLevel("untested")).toBe(0);
  });

  it("struggling: interval = 1 day", () => {
    expect(computeNextReviewDayForLevel("struggling")).toBe(1);
  });

  it("emerging: interval = 3 days", () => {
    expect(computeNextReviewDayForLevel("emerging")).toBe(3);
  });

  it("consolidating: interval = 7 days", () => {
    expect(computeNextReviewDayForLevel("consolidating")).toBe(7);
  });

  it("mastered: interval = 21 days", () => {
    expect(computeNextReviewDayForLevel("mastered")).toBe(21);
  });

  it("interval increases monotonically with mastery level", () => {
    const levels: Array<import("../types").InterferenceMasteryLevel> = [
      "untested", "struggling", "emerging", "consolidating", "mastered",
    ];
    const intervals = levels.map(computeNextReviewDayForLevel);
    for (let i = 1; i < intervals.length; i++) {
      expect(intervals[i]).toBeGreaterThanOrEqual(intervals[i - 1]);
    }
  });
});

describe("sequenceInterferencePatterns — spacing (Tier 1 vs Tier 2)", () => {
  // Profile where struggling pattern was just drilled 0.5 days ago (not yet due)
  // and emerging pattern was last drilled 5 days ago (overdue).
  const RECENT_TS = 1_000_000_000;
  const HALF_DAY_AGO_TS = RECENT_TS - 0.5 * MS_PER_DAY;
  const FIVE_DAYS_AGO_TS = RECENT_TS - 5 * MS_PER_DAY;

  const SPACED_PROFILE: LearnerInterferenceProfile = {
    learnerId: "spacing-test",
    profileUpdatedAt: RECENT_TS,
    masteryByPattern: {
      // struggling, but drilled 0.5 days ago → NOT due yet (interval = 1 day)
      final_consonant_cluster_reduction: {
        patternId: "final_consonant_cluster_reduction",
        level: "struggling",
        score: 0.20,
        attemptsCount: 5,
        confidenceWidth: 0.12,
        lastUpdatedAt: HALF_DAY_AGO_TS,
      },
      // emerging, but drilled 5 days ago → overdue (interval = 3 days)
      missing_articles: {
        patternId: "missing_articles",
        level: "emerging",
        score: 0.45,
        attemptsCount: 3,
        confidenceWidth: 0.15,
        lastUpdatedAt: FIVE_DAYS_AGO_TS,
      },
    },
  };

  it("overdue emerging pattern comes before not-yet-due struggling pattern", () => {
    const ids = sequenceInterferencePatterns(SPACED_PROFILE, PATTERNS, RECENT_TS).entries.map(
      (e) => e.patternId,
    );
    const emergingIdx = ids.indexOf("missing_articles");
    const strugglingIdx = ids.indexOf("final_consonant_cluster_reduction");
    // The emerging pattern is in Tier 1 (due); struggling is in Tier 2 (not yet due)
    expect(emergingIdx).toBeLessThan(strugglingIdx);
  });

  it("rationale for not-yet-due pattern includes 'reviewed recently' note", () => {
    const entries = sequenceInterferencePatterns(SPACED_PROFILE, PATTERNS, RECENT_TS).entries;
    const struggling = entries.find((e) => e.patternId === "final_consonant_cluster_reduction");
    expect(struggling!.rationale).toContain("reviewed recently");
  });

  it("rationale for due pattern does NOT include 'reviewed recently' note", () => {
    const entries = sequenceInterferencePatterns(SPACED_PROFILE, PATTERNS, RECENT_TS).entries;
    const emerging = entries.find((e) => e.patternId === "missing_articles");
    expect(emerging!.rationale).not.toContain("reviewed recently");
  });

  it("when now=0 (default), all patterns are treated as due — ordering is pure level-based", () => {
    // now=0, all lastUpdatedAt > 0, so daysSince < 0 → isDue is true for all.
    const result = sequenceInterferencePatterns(SPACED_PROFILE, PATTERNS);
    const ids = result.entries.map((e) => e.patternId);
    // With spacing disabled (now=0), struggling comes first again
    const strugglingIdx = ids.indexOf("final_consonant_cluster_reduction");
    const emergingIdx = ids.indexOf("missing_articles");
    expect(strugglingIdx).toBeLessThan(emergingIdx);
  });
});
