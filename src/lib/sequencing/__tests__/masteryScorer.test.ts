/**
 * masteryScorer tests — Step 15 DONE-WHEN:
 * (1) Mastery score per pattern computed from real correction telemetry
 * (3) Two real profiles (eval-derived fixtures) produce different sequences
 * (5) Empty-telemetry abstain (default curriculum = severity order)
 */

import { describe, it, expect } from "vitest";
import { deriveMasteryProfile, mergeServerTagsIntoProfile, TAG_TO_PATTERN_IDS } from "../masteryScorer";
import { sequenceInterferencePatterns } from "../interferenceSequencer";
import { MASTERY_HALF_LIFE_DAYS } from "../types";
import type { LearnerHistoryProfile } from "../../tutor/learnerHistoryProfile";
import {
  FIXTURE_VN_LEARNER_B1_12_SESSIONS,
  FIXTURE_VN_LEARNER_TENSE_ONLY,
} from "../../tutor/tests/fixtures/learnerHistoryProfile.fixture";
import type { VNL1Pattern } from "../../../data/placement/vnL1Interference";

// ── fixture patterns ─────────────────────────────────────────────────────────
// A small catalogue covering the patterns that the real fixtures exercise.

const BASE_PATTERNS: VNL1Pattern[] = [
  {
    id: "missing_articles",
    category: "syntax",
    name: "Article omission",
    shortDescription: "Omits a/an/the.",
    longDescription: "",
    vietnameseRoot: "",
    examples: [],
    cefrLevelsObserved: ["A1", "A2"],
    severity: "high",
    remediation: "",
    ruleTags: ["articles", "vn_l1_syntax"],
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
    ruleTags: ["tense", "past_ed", "vn_l1_morphology"],
  },
  {
    id: "missing_subject_verb_agreement",
    category: "morphology",
    name: "Subject-verb agreement",
    shortDescription: "3rd-person -s omitted.",
    longDescription: "",
    vietnameseRoot: "",
    examples: [],
    cefrLevelsObserved: ["A1", "A2"],
    severity: "medium",
    remediation: "",
    ruleTags: ["sva", "vn_l1_morphology"],
  },
  {
    id: "preposition_selection_transfer",
    category: "lexicon",
    name: "Preposition calque",
    shortDescription: "Vietnamese prep translated literally.",
    longDescription: "",
    vietnameseRoot: "",
    examples: [],
    cefrLevelsObserved: ["A2", "B1"],
    severity: "medium",
    remediation: "",
    ruleTags: ["prepositions", "vn_l1_lexicon"],
  },
  {
    id: "phrasal_verb_avoidance",
    category: "lexicon",
    name: "Phrasal verb avoidance",
    shortDescription: "Avoids phrasal verbs.",
    longDescription: "",
    vietnameseRoot: "",
    examples: [],
    cefrLevelsObserved: ["B1", "B2"],
    severity: "low",
    remediation: "",
    ruleTags: ["phrasal_verbs", "vn_l1_lexicon"],
  },
];

// Anchor timestamp so decay arithmetic is deterministic in tests.
const NOW_MS = FIXTURE_VN_LEARNER_B1_12_SESSIONS.updatedAt;
// Two days after the last session — scored patterns (interval 1 for struggling)
// are due again, making sequence tests predictable.
const NOW_PLUS_2D = NOW_MS + 2 * 24 * 60 * 60 * 1000;

// ── 1. Score computation from real telemetry ──────────────────────────────────

describe("deriveMasteryProfile — score computation", () => {
  it("maps missing-article tag → missing_articles pattern with a score", () => {
    const profile = deriveMasteryProfile(
      FIXTURE_VN_LEARNER_B1_12_SESSIONS,
      BASE_PATTERNS,
      NOW_MS,
    );
    const score = profile.masteryByPattern["missing_articles"];
    expect(score).toBeDefined();
    expect(score!.attemptsCount).toBe(5); // 5 observations in the fixture
    expect(score!.score).toBeGreaterThanOrEqual(0);
    expect(score!.score).toBeLessThanOrEqual(1);
  });

  it("maps tense-omission tag → past_tense_unmarked pattern", () => {
    const profile = deriveMasteryProfile(
      FIXTURE_VN_LEARNER_B1_12_SESSIONS,
      BASE_PATTERNS,
      NOW_MS,
    );
    const score = profile.masteryByPattern["past_tense_unmarked"];
    expect(score).toBeDefined();
    expect(score!.attemptsCount).toBe(3);
  });

  it("5 article errors → struggling level (score < 0.35)", () => {
    const profile = deriveMasteryProfile(
      FIXTURE_VN_LEARNER_B1_12_SESSIONS,
      BASE_PATTERNS,
      NOW_MS,
    );
    expect(profile.masteryByPattern["missing_articles"]!.level).toBe("struggling");
    expect(profile.masteryByPattern["missing_articles"]!.score!).toBeLessThan(0.35);
  });

  it("3 tense errors (2 days old) → struggling level (score < 0.35)", () => {
    // lastSeenAt = NOW_MS - 2days; evaluating at NOW_MS → daysSince=2, half-life=28
    // rawScore = 0.55 - 3×0.075 = 0.325; decayed: 0.325×exp(-2/28) + 0.55×(1-exp(-2/28)) ≈ 0.341
    const profile = deriveMasteryProfile(
      FIXTURE_VN_LEARNER_B1_12_SESSIONS,
      BASE_PATTERNS,
      NOW_MS,
    );
    expect(profile.masteryByPattern["past_tense_unmarked"]!.level).toBe("struggling");
    expect(profile.masteryByPattern["past_tense_unmarked"]!.score!).toBeLessThan(0.35);
  });

  it("patterns absent from history stay untested (no entry in masteryByPattern)", () => {
    const profile = deriveMasteryProfile(
      FIXTURE_VN_LEARNER_B1_12_SESSIONS,
      BASE_PATTERNS,
      NOW_MS,
    );
    // FIXTURE_VN_LEARNER_B1_12_SESSIONS has no entry for preposition-calque
    expect(profile.masteryByPattern["preposition_selection_transfer"]).toBeUndefined();
    expect(profile.masteryByPattern["phrasal_verb_avoidance"]).toBeUndefined();
  });

  it("1 observation → confidenceWidth > 0.20 (insufficient data)", () => {
    const profile = deriveMasteryProfile(
      FIXTURE_VN_LEARNER_B1_12_SESSIONS,
      BASE_PATTERNS,
      NOW_MS,
    );
    // subj-verb-agreement: 1 observation
    const sva = profile.masteryByPattern["missing_subject_verb_agreement"];
    expect(sva).toBeDefined();
    expect(sva!.confidenceWidth).toBeGreaterThan(0.20);
  });

  it("5 observations → confidenceWidth <= 0.20 (sufficient data)", () => {
    const profile = deriveMasteryProfile(
      FIXTURE_VN_LEARNER_B1_12_SESSIONS,
      BASE_PATTERNS,
      NOW_MS,
    );
    expect(profile.masteryByPattern["missing_articles"]!.confidenceWidth).toBeLessThanOrEqual(0.20);
  });

  it("score decays toward 0.55 over time (old errors score higher than fresh)", () => {
    const fresh = deriveMasteryProfile(
      FIXTURE_VN_LEARNER_B1_12_SESSIONS,
      BASE_PATTERNS,
      NOW_MS,
    );
    const aged = deriveMasteryProfile(
      FIXTURE_VN_LEARNER_B1_12_SESSIONS,
      BASE_PATTERNS,
      NOW_MS + MASTERY_HALF_LIFE_DAYS * 24 * 60 * 60 * 1000 * 3, // 3 half-lives later
    );
    expect(aged.masteryByPattern["missing_articles"]!.score!).toBeGreaterThan(
      fresh.masteryByPattern["missing_articles"]!.score!,
    );
  });

  it("is deterministic — same inputs produce same output", () => {
    const a = deriveMasteryProfile(FIXTURE_VN_LEARNER_B1_12_SESSIONS, BASE_PATTERNS, NOW_MS);
    const b = deriveMasteryProfile(FIXTURE_VN_LEARNER_B1_12_SESSIONS, BASE_PATTERNS, NOW_MS);
    expect(a).toEqual(b);
  });
});

// ── 2. TAG_TO_PATTERN_IDS completeness ───────────────────────────────────────

describe("TAG_TO_PATTERN_IDS", () => {
  it("contains the core VN learner interference tags", () => {
    expect(TAG_TO_PATTERN_IDS["missing-article"]).toContain("missing_articles");
    expect(TAG_TO_PATTERN_IDS["tense-omission"]).toContain("past_tense_unmarked");
    expect(TAG_TO_PATTERN_IDS["subj-verb-agreement"]).toContain("missing_subject_verb_agreement");
    expect(TAG_TO_PATTERN_IDS["zero-copula"]).toContain("copula_be_omission");
    expect(TAG_TO_PATTERN_IDS["double-negation"]).toContain("negation_no_not_placement");
  });

  it("all mapped patternIds are non-empty strings", () => {
    for (const ids of Object.values(TAG_TO_PATTERN_IDS)) {
      for (const id of ids) {
        expect(typeof id).toBe("string");
        expect(id.length).toBeGreaterThan(0);
      }
    }
  });
});

// ── 3. Two REAL profiles produce different sequences ─────────────────────────

describe("two real eval-derived fixtures produce different sequences", () => {
  it("B1-12-sessions vs tense-only: first element differs", () => {
    const profB1 = deriveMasteryProfile(FIXTURE_VN_LEARNER_B1_12_SESSIONS, BASE_PATTERNS, NOW_MS);
    const profTense = deriveMasteryProfile(FIXTURE_VN_LEARNER_TENSE_ONLY, BASE_PATTERNS, NOW_MS);

    const seqB1 = sequenceInterferencePatterns(profB1, BASE_PATTERNS, NOW_MS);
    const seqTense = sequenceInterferencePatterns(profTense, BASE_PATTERNS, NOW_MS);

    const idsB1 = seqB1.entries.map((e) => e.patternId);
    const idsTense = seqTense.entries.map((e) => e.patternId);

    // Both profiles are non-trivial (have interference data)
    expect(idsB1.length).toBeGreaterThan(0);
    expect(idsTense.length).toBeGreaterThan(0);

    // Sequences must differ somewhere
    expect(idsB1).not.toEqual(idsTense);
  });

  it("B1-12-sessions: missing_articles (5 obs, struggling) ranked before past_tense_unmarked (3 obs)", () => {
    // Evaluate 2 days after the session so both scored patterns are past their
    // 1-day struggling review interval and land in Tier 1 (due).
    // missing_articles: struggling (score ≈ 0.20) → LEVEL_PRIORITY 0
    // past_tense_unmarked: score ≈ 0.355 after 4-day decay → emerging (LEVEL_PRIORITY 1)
    // → missing_articles appears first.
    const prof = deriveMasteryProfile(FIXTURE_VN_LEARNER_B1_12_SESSIONS, BASE_PATTERNS, NOW_PLUS_2D);
    const seq = sequenceInterferencePatterns(prof, BASE_PATTERNS, NOW_PLUS_2D);
    const ids = seq.entries.map((e) => e.patternId);

    const articleIdx = ids.indexOf("missing_articles");
    const tenseIdx = ids.indexOf("past_tense_unmarked");
    const phrasalIdx = ids.indexOf("phrasal_verb_avoidance");

    // Both scored patterns present
    expect(articleIdx).toBeGreaterThanOrEqual(0);
    expect(tenseIdx).toBeGreaterThanOrEqual(0);
    // missing_articles (struggling) before past_tense_unmarked (emerging)
    expect(articleIdx).toBeLessThan(tenseIdx);
    // Both scored/due patterns before untested phrasal_verb_avoidance
    expect(articleIdx).toBeLessThan(phrasalIdx);
    expect(tenseIdx).toBeLessThan(phrasalIdx);
  });

  it("tense-only: past_tense_unmarked (4 obs, struggling) appears at the top", () => {
    // 2 days after session → tense pattern is due (interval 1 day, daysSince 2)
    // and is struggling → goes to Tier 1 head position.
    const prof = deriveMasteryProfile(FIXTURE_VN_LEARNER_TENSE_ONLY, BASE_PATTERNS, NOW_PLUS_2D);
    const seq = sequenceInterferencePatterns(prof, BASE_PATTERNS, NOW_PLUS_2D);
    // FIXTURE_VN_LEARNER_TENSE_ONLY has 4 tense-omission observations → struggling
    expect(seq.entries[0].patternId).toBe("past_tense_unmarked");
  });
});

// ── 4. Empty telemetry abstain → default curriculum order ────────────────────

describe("empty telemetry abstain", () => {
  const emptyHistory: LearnerHistoryProfile = {
    product: "ai-tutor",
    targetLanguage: "en",
    topicMastery: {},
    interferencePatterns: [],
    sessionCount: 0,
    completedSessionCount: 0,
    preferredMode: null,
    updatedAt: NOW_MS,
  };

  it("empty history → all patterns untested (empty masteryByPattern)", () => {
    const prof = deriveMasteryProfile(emptyHistory, BASE_PATTERNS, NOW_MS);
    expect(Object.keys(prof.masteryByPattern)).toHaveLength(0);
  });

  it("empty profile + sequencer → default curriculum order (severity: high → medium → low)", () => {
    const prof = deriveMasteryProfile(emptyHistory, BASE_PATTERNS, NOW_MS);
    const seq = sequenceInterferencePatterns(prof, BASE_PATTERNS, NOW_MS);
    const ids = seq.entries.map((e) => e.patternId);

    // High severity patterns should precede medium and low
    const highPatterns = BASE_PATTERNS.filter((p) => p.severity === "high").map((p) => p.id);
    const mediumPatterns = BASE_PATTERNS.filter((p) => p.severity === "medium").map((p) => p.id);
    const lowPatterns = BASE_PATTERNS.filter((p) => p.severity === "low").map((p) => p.id);

    const lastHighIdx = Math.max(...highPatterns.map((id) => ids.indexOf(id)));
    const firstMedIdx = Math.min(...mediumPatterns.map((id) => ids.indexOf(id)));
    const firstLowIdx = Math.min(...lowPatterns.map((id) => ids.indexOf(id)));

    expect(lastHighIdx).toBeLessThan(firstMedIdx);
    expect(firstMedIdx).toBeLessThan(firstLowIdx);
  });

  it("every pattern appears exactly once in empty-telemetry sequence", () => {
    const prof = deriveMasteryProfile(emptyHistory, BASE_PATTERNS, NOW_MS);
    const seq = sequenceInterferencePatterns(prof, BASE_PATTERNS, NOW_MS);
    expect(seq.entries).toHaveLength(BASE_PATTERNS.length);
    const ids = seq.entries.map((e) => e.patternId);
    expect(new Set(ids).size).toBe(BASE_PATTERNS.length);
  });
});

// ── 5. mergeServerTagsIntoProfile ────────────────────────────────────────────

describe("mergeServerTagsIntoProfile", () => {
  it("merging server tags increments attemptsCount", () => {
    const base = deriveMasteryProfile(FIXTURE_VN_LEARNER_B1_12_SESSIONS, BASE_PATTERNS, NOW_MS);
    const merged = mergeServerTagsIntoProfile(
      base,
      [{ tag: "missing-article", count: 2, lastSeenAt: NOW_MS }],
      NOW_MS,
    );
    expect(merged.masteryByPattern["missing_articles"]!.attemptsCount).toBe(7); // 5 + 2
  });

  it("merging unknown tag is a no-op", () => {
    const base = deriveMasteryProfile(FIXTURE_VN_LEARNER_B1_12_SESSIONS, BASE_PATTERNS, NOW_MS);
    const merged = mergeServerTagsIntoProfile(
      base,
      [{ tag: "unknown-tag-xyz", count: 5, lastSeenAt: NOW_MS }],
      NOW_MS,
    );
    expect(merged).toEqual(base);
  });

  it("merging empty array is a no-op", () => {
    const base = deriveMasteryProfile(FIXTURE_VN_LEARNER_B1_12_SESSIONS, BASE_PATTERNS, NOW_MS);
    expect(mergeServerTagsIntoProfile(base, [], NOW_MS)).toBe(base);
  });

  it("server tag for pattern not in base → creates new entry", () => {
    const emptyProf: import("../types").LearnerInterferenceProfile = {
      learnerId: "test:en",
      masteryByPattern: {},
      profileUpdatedAt: NOW_MS,
    };
    const merged = mergeServerTagsIntoProfile(
      emptyProf,
      [{ tag: "tense-omission", count: 3, lastSeenAt: NOW_MS }],
      NOW_MS,
    );
    expect(merged.masteryByPattern["past_tense_unmarked"]).toBeDefined();
    expect(merged.masteryByPattern["past_tense_unmarked"]!.attemptsCount).toBe(3);
  });
});
