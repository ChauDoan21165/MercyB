/**
 * Tests for Teacher Mercy's learner weakness memory tags.
 *
 * Covers:
 *   - Classification of error signals into weakness categories
 *   - Tagging new observations into memory
 *   - Relevance ranking (recency × frequency)
 *   - Recalling the most relevant weakness for a current error
 *   - Reference phrase generation
 *   - Merge and prune operations
 *   - Edge cases (empty memory, unknown categories, stale tags)
 */

import { describe, expect, it } from "vitest";
import {
  classifyWeakness,
  tagWeakness,
  recallRelevantWeakness,
  getTopWeaknesses,
  computeRelevanceScore,
  getSuggestedReferencePhrase,
  createEmptyWeaknessMemory,
  mergeWeaknessMemories,
  pruneStaleWeaknesses,
  getTrackedWeaknessLabel,
  WEAKNESS_MEMORY_TAGS_CATALOG,
  WEAKNESS_MEMORY_DIMENSIONS,
  type WeaknessMemory,
  type WeaknessTag,
  type WeaknessTagInput,
  type WeaknessRecallResult,
} from "../weaknessMemoryTags";

// ─── Test Helpers ────────────────────────────────────────────────────────

const FIXED_NOW = 1719000000000; // 2024-06-22 in ms

function makeInput(overrides: Partial<WeaknessTagInput> = {}): WeaknessTagInput {
  return {
    errorCategory: "grammar",
    grammarPoint: "past_tense",
    l1: "vi",
    exemplarPattern: "I go → I went",
    ...overrides,
  };
}

function makeMemory(tags: WeaknessTag[] = [], overrides: Partial<WeaknessMemory> = {}): WeaknessMemory {
  return {
    tags,
    totalCorrectionsObserved: tags.reduce((sum, t) => sum + t.count, 0),
    updatedAt: FIXED_NOW,
    ...overrides,
  };
}

function makeTag(overrides: Partial<WeaknessTag> & { category: WeaknessTag["category"] }): WeaknessTag {
  return {
    labelVi: "label-vi",
    labelEn: "label-en",
    count: 1,
    firstSeenAt: FIXED_NOW - 86400000, // 1 day ago
    lastSeenAt: FIXED_NOW,
    exemplarPattern: "I go → I went",
    ...overrides,
  };
}

// ─── Classification Tests ────────────────────────────────────────────────

describe("classifyWeakness — error signal → weakness category", () => {
  it("classifies past_tense errors as tense-omission", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "grammar", grammarPoint: "past_tense" }),
    );
    expect(result).toBe("tense-omission");
  });

  it("classifies article errors as missing-article", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "grammar", grammarPoint: "articles" }),
    );
    expect(result).toBe("missing-article");
  });

  it("classifies subject-verb agreement errors", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "grammar", grammarPoint: "subject_verb_agreement" }),
    );
    expect(result).toBe("subj-verb-agreement");
  });

  it("classifies third person singular as subj-verb-agreement", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "grammar", grammarPoint: "third_person_s" }),
    );
    expect(result).toBe("subj-verb-agreement");
  });

  it("classifies preposition errors as preposition-calque", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "grammar", grammarPoint: "prepositions" }),
    );
    expect(result).toBe("preposition-calque");
  });

  it("classifies word order errors", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "grammar", grammarPoint: "word_order" }),
    );
    expect(result).toBe("word-order");
  });

  it("classifies adjective order as word-order", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "fluency", grammarPoint: "adjective_order" }),
    );
    expect(result).toBe("word-order");
  });

  it("classifies copula / to-be errors as zero-copula", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "grammar", grammarPoint: "copula" }),
    );
    expect(result).toBe("zero-copula");
  });

  it("classifies missing 'be' verb as zero-copula", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "grammar", grammarPoint: "missing_be" }),
    );
    expect(result).toBe("zero-copula");
  });

  it("classifies negation errors as double-negation", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "grammar", grammarPoint: "negation" }),
    );
    expect(result).toBe("double-negation");
  });

  it("classifies pronunciation errors", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "pronunciation", grammarPoint: "final_consonant" }),
    );
    expect(result).toBe("pronunciation");
  });

  it("classifies ending sound errors as pronunciation", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "pronunciation", grammarPoint: "ending_sound" }),
    );
    expect(result).toBe("pronunciation");
  });

  it("classifies sentence structure errors", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "fluency", grammarPoint: "awkward_structure" }),
    );
    expect(result).toBe("sentence_structure");
  });

  it("classifies word choice errors", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "vocabulary", grammarPoint: "word_choice" }),
    );
    expect(result).toBe("word_choice");
  });

  it("classifies unnatural phrasing as word_choice", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "fluency", grammarPoint: "unnatural" }),
    );
    expect(result).toBe("word_choice");
  });

  it("classifies politeness errors", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "pragmatics", grammarPoint: "register" }),
    );
    expect(result).toBe("politeness_register");
  });

  it("returns null for completely unknown error categories", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "unknown_xyz", grammarPoint: "mystery_point" }),
    );
    expect(result).toBeNull();
  });

  it("classifies from errorCategory even without grammarPoint", () => {
    const result = classifyWeakness(
      makeInput({
        errorCategory: "tense_error",
        grammarPoint: undefined,
        exemplarPattern: "I go → I went",
      }),
    );
    expect(result).toBe("tense-omission");
  });

  it("classifies present_tense as tense-omission", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "grammar", grammarPoint: "present_tense" }),
    );
    expect(result).toBe("tense-omission");
  });

  it("classifies future_tense as tense-omission", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "grammar", grammarPoint: "future_tense" }),
    );
    expect(result).toBe("tense-omission");
  });

  it("classifies irregular verbs as tense-omission", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "grammar", grammarPoint: "irregular_verbs" }),
    );
    expect(result).toBe("tense-omission");
  });

  it("classifies verb_form as tense-omission", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "grammar", grammarPoint: "verb_form" }),
    );
    expect(result).toBe("tense-omission");
  });

  it("matches Vietnamese error category labels (thì, quá khứ)", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "thì quá khứ", grammarPoint: undefined }),
    );
    expect(result).toBe("tense-omission");
  });

  it("matches giới từ as preposition-calque", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "giới từ", grammarPoint: undefined }),
    );
    expect(result).toBe("preposition-calque");
  });

  it("matches phủ định as double-negation", () => {
    const result = classifyWeakness(
      makeInput({ errorCategory: "phủ định kép", grammarPoint: undefined }),
    );
    expect(result).toBe("double-negation");
  });
});

// ─── Tagging Tests ───────────────────────────────────────────────────────

describe("tagWeakness — record observations into memory", () => {
  it("creates a new tag for a first-time weakness", () => {
    const memory = createEmptyWeaknessMemory(FIXED_NOW);
    const input = makeInput({
      errorCategory: "grammar",
      grammarPoint: "past_tense",
      exemplarPattern: "I go → I went",
    });

    const result = tagWeakness(memory, input, FIXED_NOW);

    expect(result.tags).toHaveLength(1);
    expect(result.tags[0].category).toBe("tense-omission");
    expect(result.tags[0].count).toBe(1);
    expect(result.tags[0].labelVi).toBe("thiếu thì (quá khứ / hiện tại / tương lai)");
    expect(result.tags[0].exemplarPattern).toBe("I go → I went");
    expect(result.totalCorrectionsObserved).toBe(1);
  });

  it("increments count for an existing weakness", () => {
    const existingTag = makeTag({
      category: "tense-omission",
      count: 2,
      exemplarPattern: "She go → She went",
    });
    const memory = makeMemory([existingTag]);

    const result = tagWeakness(
      memory,
      makeInput({ errorCategory: "grammar", grammarPoint: "past_tense" }),
      FIXED_NOW,
    );

    expect(result.tags).toHaveLength(1);
    expect(result.tags[0].count).toBe(3);
    expect(result.tags[0].firstSeenAt).toBe(existingTag.firstSeenAt); // unchanged
    expect(result.tags[0].lastSeenAt).toBe(FIXED_NOW); // updated
    expect(result.totalCorrectionsObserved).toBe(3); // 2 prev + 1 new
  });

  it("updates exemplar when a new pattern is provided", () => {
    const existingTag = makeTag({
      category: "tense-omission",
      count: 1,
      exemplarPattern: "She go → She went",
    });
    const memory = makeMemory([existingTag]);

    const result = tagWeakness(
      memory,
      makeInput({
        errorCategory: "grammar",
        grammarPoint: "past_tense",
        exemplarPattern: "He eat → He ate",
      }),
      FIXED_NOW,
    );

    expect(result.tags[0].exemplarPattern).toBe("He eat → He ate");
  });

  it("does not update exemplar when same pattern is provided", () => {
    const existingTag = makeTag({
      category: "tense-omission",
      count: 1,
      exemplarPattern: "I go → I went",
    });
    const memory = makeMemory([existingTag]);

    const result = tagWeakness(
      memory,
      makeInput({
        errorCategory: "grammar",
        grammarPoint: "past_tense",
        exemplarPattern: "I go → I went", // same as existing
      }),
      FIXED_NOW,
    );

    expect(result.tags[0].exemplarPattern).toBe("I go → I went");
  });

  it("still increments totalCorrectionsObserved even for uncategorized errors", () => {
    const memory = createEmptyWeaknessMemory(FIXED_NOW);

    const result = tagWeakness(
      memory,
      makeInput({ errorCategory: "mystery_error", grammarPoint: "unknown" }),
      FIXED_NOW,
    );

    expect(result.tags).toHaveLength(0);
    expect(result.totalCorrectionsObserved).toBe(1);
  });

  it("re-sorts tags by relevance after tagging", () => {
    // Create two tags: one old-and-infrequent, one fresh-and-frequent
    const oldTag = makeTag({
      category: "missing-article",
      count: 1,
      lastSeenAt: FIXED_NOW - 90 * 86400000, // 90 days ago
    });
    const recentTag = makeTag({
      category: "tense-omission",
      count: 4,
      lastSeenAt: FIXED_NOW - 86400000, // 1 day ago
    });
    const memory = makeMemory([oldTag, recentTag]);

    const result = tagWeakness(
      memory,
      makeInput({ errorCategory: "grammar", grammarPoint: "negation" }),
      FIXED_NOW,
    );

    // The recently-updated tense-omission tag should still be first,
    // then the new negation tag, then the stale old tag
    expect(result.tags).toHaveLength(3);
    expect(result.tags[0].category).toBe("tense-omission"); // most relevant
    expect(result.tags[1].category).toBe("double-negation"); // new
    expect(result.tags[2].category).toBe("missing-article"); // stale
  });
});

// ─── Relevance Score Tests ───────────────────────────────────────────────

describe("computeRelevanceScore — recency × frequency", () => {
  it("scores a freshly-seen frequent tag at maximum (~100)", () => {
    const tag = makeTag({
      category: "tense-omission",
      count: 10,
      lastSeenAt: FIXED_NOW,
    });
    const score = computeRelevanceScore(tag, FIXED_NOW);
    expect(score).toBe(100);
  });

  it("scores a single-occurrence tag lower", () => {
    const tag = makeTag({
      category: "tense-omission",
      count: 1,
      lastSeenAt: FIXED_NOW,
    });
    const score = computeRelevanceScore(tag, FIXED_NOW);
    // recency=1.0, freq=0.2 → 20
    expect(score).toBe(20);
  });

  it("decays score for old tags", () => {
    const tag = makeTag({
      category: "tense-omission",
      count: 5,
      lastSeenAt: FIXED_NOW - 45 * 86400000, // 45 days ago
    });
    const score = computeRelevanceScore(tag, FIXED_NOW);
    // recency=0.5, freq=1.0 → 50
    expect(score).toBe(50);
  });

  it("floors recency weight at 0.1 for very stale tags", () => {
    const tag = makeTag({
      category: "tense-omission",
      count: 5,
      lastSeenAt: FIXED_NOW - 120 * 86400000, // 120 days ago
    });
    const score = computeRelevanceScore(tag, FIXED_NOW);
    // recency=0.1, freq=1.0 → 10
    expect(score).toBe(10);
  });

  it("count of 2 gives frequency weight of 0.4", () => {
    const tag = makeTag({
      category: "tense-omission",
      count: 2,
      lastSeenAt: FIXED_NOW,
    });
    const score = computeRelevanceScore(tag, FIXED_NOW);
    // recency=1.0, freq=0.4 → 40
    expect(score).toBe(40);
  });

  it("count of 3 gives frequency weight of 0.6", () => {
    const tag = makeTag({
      category: "tense-omission",
      count: 3,
      lastSeenAt: FIXED_NOW,
    });
    const score = computeRelevanceScore(tag, FIXED_NOW);
    // recency=1.0, freq=0.6 → 60
    expect(score).toBe(60);
  });
});

// ─── Top Weaknesses Tests ────────────────────────────────────────────────

describe("getTopWeaknesses — ranked retrieval", () => {
  it("returns empty array for empty memory", () => {
    const memory = createEmptyWeaknessMemory(FIXED_NOW);
    const top = getTopWeaknesses(memory, 3, FIXED_NOW);
    expect(top).toHaveLength(0);
  });

  it("returns top N tags ordered by relevance", () => {
    const tag1 = makeTag({
      category: "tense-omission",
      count: 5,
      lastSeenAt: FIXED_NOW,
    });
    const tag2 = makeTag({
      category: "missing-article",
      count: 1,
      lastSeenAt: FIXED_NOW - 60 * 86400000,
    });
    const tag3 = makeTag({
      category: "preposition-calque",
      count: 3,
      lastSeenAt: FIXED_NOW - 86400000,
    });
    const memory = makeMemory([tag2, tag3, tag1]); // unsorted input

    const top = getTopWeaknesses(memory, 2, FIXED_NOW);
    expect(top).toHaveLength(2);
    expect(top[0].category).toBe("tense-omission"); // highest relevance
    expect(top[1].category).toBe("preposition-calque"); // second
  });

  it("returns fewer than N if memory has fewer tags", () => {
    const memory = makeMemory([
      makeTag({ category: "tense-omission" }),
    ]);
    const top = getTopWeaknesses(memory, 5, FIXED_NOW);
    expect(top).toHaveLength(1);
  });
});

// ─── Recall Tests ────────────────────────────────────────────────────────

describe("recallRelevantWeakness — find most relevant weakness for current error", () => {
  it("returns null when memory is empty", () => {
    const memory = createEmptyWeaknessMemory(FIXED_NOW);

    const result = recallRelevantWeakness(
      memory,
      { errorCategory: "grammar", grammarPoint: "past_tense", l1: "vi" },
      FIXED_NOW,
    );

    expect(result.recalled).toBeNull();
    expect(result.reasonCode).toBe("no_tags");
    expect(result.shouldMention).toBe(false);
  });

  it("recalls exact match when current error matches a tracked weakness", () => {
    const tag = makeTag({
      category: "tense-omission",
      count: 3,
      labelVi: "thiếu thì (quá khứ / hiện tại / tương lai)",
      labelEn: "tense omission",
    });
    const memory = makeMemory([tag]);

    const result = recallRelevantWeakness(
      memory,
      { errorCategory: "grammar", grammarPoint: "past_tense", l1: "vi" },
      FIXED_NOW,
    );

    expect(result.recalled).not.toBeNull();
    expect(result.recalled!.category).toBe("tense-omission");
    expect(result.reasonCode).toBe("exact_match");
    expect(result.shouldMention).toBe(true); // count >= 2
    expect(result.suggestedReferenceVi).toContain("thiếu thì");
  });

  it("sets shouldMention=false for exact match with count < 2", () => {
    const tag = makeTag({
      category: "tense-omission",
      count: 1,
    });
    const memory = makeMemory([tag]);

    const result = recallRelevantWeakness(
      memory,
      { errorCategory: "grammar", grammarPoint: "past_tense", l1: "vi" },
      FIXED_NOW,
    );

    expect(result.recalled).not.toBeNull();
    expect(result.shouldMention).toBe(false);
  });

  it("falls back to top-ranked weakness when no exact match", () => {
    const articleTag = makeTag({
      category: "missing-article",
      count: 5,
      lastSeenAt: FIXED_NOW,
    });
    const tenseTag = makeTag({
      category: "tense-omission",
      count: 2,
      lastSeenAt: FIXED_NOW - 30 * 86400000,
    });
    // memory.tags must be pre-sorted by relevance (the invariant that
    // tagWeakness / mergeWeaknessMemories / getTopWeaknesses maintain)
    const memory = makeMemory([articleTag, tenseTag]); // article (count=5, today) > tense (count=2, 30d ago)

    const result = recallRelevantWeakness(
      memory,
      { errorCategory: "grammar", grammarPoint: "prepositions", l1: "vi" },
      FIXED_NOW,
    );

    expect(result.recalled).not.toBeNull();
    expect(result.recalled!.category).toBe("missing-article");
    expect(result.reasonCode).toBe("top_ranked");
    expect(result.shouldMention).toBe(true); // frequent (count >= 3)
  });

  it("shouldMention=true for top-ranked weakness seen within 7 days", () => {
    const tag = makeTag({
      category: "tense-omission",
      count: 1,
      lastSeenAt: FIXED_NOW - 3 * 86400000, // 3 days ago — recent
    });
    const memory = makeMemory([tag]);

    const result = recallRelevantWeakness(
      memory,
      { errorCategory: "grammar", grammarPoint: "articles", l1: "vi" },
      FIXED_NOW,
    );

    expect(result.recalled).not.toBeNull();
    expect(result.shouldMention).toBe(true); // recent
  });

  it("shouldMention=false for stale, infrequent top weakness", () => {
    const tag = makeTag({
      category: "tense-omission",
      count: 1,
      lastSeenAt: FIXED_NOW - 14 * 86400000, // 14 days ago — not recent
    });
    const memory = makeMemory([tag]);

    const result = recallRelevantWeakness(
      memory,
      { errorCategory: "grammar", grammarPoint: "articles", l1: "vi" },
      FIXED_NOW,
    );

    expect(result.recalled).not.toBeNull();
    expect(result.shouldMention).toBe(false); // not recent, not frequent
  });

  it("generates varied reference phrases for repeat context by count", () => {
    const tag1 = makeTag({
      category: "tense-omission",
      count: 1,
      labelVi: "thiếu thì",
    });
    const tag5 = makeTag({
      category: "tense-omission",
      count: 5,
      labelVi: "thiếu thì",
    });

    const ref1 = getSuggestedReferencePhrase(tag1, "vi", "repeat");
    const ref5 = getSuggestedReferencePhrase(tag5, "vi", "repeat");

    // Different counts should produce different phrases
    expect(ref1.vi).not.toBe(ref5.vi);
    expect(ref1.vi).toContain("thiếu thì");
    expect(ref5.vi).toContain("thiếu thì");
  });

  it("generates general reference phrases for non-repeat context", () => {
    const tag = makeTag({
      category: "missing-article",
      count: 3,
      labelVi: "thiếu mạo từ (a/an/the)",
    });

    const ref = getSuggestedReferencePhrase(tag, "vi", "general");
    expect(ref.vi).toContain("thiếu mạo từ");
    expect(ref.en).not.toBe("");
  });
});

// ─── Reference Phrase Tests ──────────────────────────────────────────────

describe("getSuggestedReferencePhrase — natural teacher phrasing", () => {
  it("produces face-saving Vietnamese phrases for repeat context", () => {
    const tag = makeTag({
      category: "tense-omission",
      count: 2,
      labelVi: "thiếu thì (quá khứ / hiện tại / tương lai)",
    });

    const ref = getSuggestedReferencePhrase(tag, "vi", "repeat");

    // Must contain the weakness label
    expect(ref.vi).toContain("thiếu thì");
    // Must be face-saving — never say "sai", "tệ", "kém"
    expect(ref.vi).not.toMatch(/\b(sai|tệ|kém|dở)\b/);
    // Must have both vi and en
    expect(ref.en).toBeTruthy();
  });

  it("produces varied phrases for first vs fifth occurrence (repeat)", () => {
    const tag1 = makeTag({ category: "tense-omission", count: 1, labelVi: "X" });
    const tag5 = makeTag({ category: "tense-omission", count: 5, labelVi: "X" });

    const ref1 = getSuggestedReferencePhrase(tag1, "vi", "repeat");
    const ref5 = getSuggestedReferencePhrase(tag5, "vi", "repeat");

    expect(ref1.vi).not.toBe(ref5.vi);
  });

  it("produces different phrases for general vs repeat context", () => {
    const tag = makeTag({ category: "tense-omission", count: 3, labelVi: "X" });

    const refRepeat = getSuggestedReferencePhrase(tag, "vi", "repeat");
    const refGeneral = getSuggestedReferencePhrase(tag, "vi", "general");

    expect(refRepeat.vi).not.toBe(refGeneral.vi);
  });

  it("clamps phrase index for very high counts", () => {
    const tag = makeTag({ category: "tense-omission", count: 999, labelVi: "X" });

    const ref = getSuggestedReferencePhrase(tag, "vi", "repeat");
    expect(ref.vi).toBeTruthy();
    expect(ref.en).toBeTruthy();
  });
});

// ─── Merge Tests ─────────────────────────────────────────────────────────

describe("mergeWeaknessMemories — combine two memories", () => {
  it("combines counts for same-category tags", () => {
    const memA = makeMemory([
      makeTag({ category: "tense-omission", count: 3, firstSeenAt: FIXED_NOW - 86400000 * 30, lastSeenAt: FIXED_NOW - 86400000 }),
    ]);
    const memB = makeMemory([
      makeTag({ category: "tense-omission", count: 2, firstSeenAt: FIXED_NOW - 86400000 * 10, lastSeenAt: FIXED_NOW }),
    ]);

    const merged = mergeWeaknessMemories(memA, memB, FIXED_NOW);

    expect(merged.tags).toHaveLength(1);
    expect(merged.tags[0].count).toBe(5);
    expect(merged.tags[0].firstSeenAt).toBe(FIXED_NOW - 86400000 * 30); // min
    expect(merged.tags[0].lastSeenAt).toBe(FIXED_NOW); // max
    expect(merged.totalCorrectionsObserved).toBe(5);
  });

  it("preserves exemplar from the more recent tag", () => {
    const memA = makeMemory([
      makeTag({ category: "tense-omission", exemplarPattern: "OLD", lastSeenAt: FIXED_NOW - 86400000 * 10 }),
    ]);
    const memB = makeMemory([
      makeTag({ category: "tense-omission", exemplarPattern: "NEW", lastSeenAt: FIXED_NOW }),
    ]);

    const merged = mergeWeaknessMemories(memA, memB, FIXED_NOW);
    expect(merged.tags[0].exemplarPattern).toBe("NEW");
  });

  it("merges disjoint categories from both memories", () => {
    const memA = makeMemory([makeTag({ category: "tense-omission" })]);
    const memB = makeMemory([makeTag({ category: "missing-article" })]);

    const merged = mergeWeaknessMemories(memA, memB, FIXED_NOW);
    expect(merged.tags).toHaveLength(2);
  });

  it("sums totalCorrectionsObserved", () => {
    const memA = makeMemory([], { totalCorrectionsObserved: 10 });
    const memB = makeMemory([], { totalCorrectionsObserved: 7 });

    const merged = mergeWeaknessMemories(memA, memB, FIXED_NOW);
    expect(merged.totalCorrectionsObserved).toBe(17);
  });
});

// ─── Prune Tests ─────────────────────────────────────────────────────────

describe("pruneStaleWeaknesses — remove old, infrequent tags", () => {
  it("removes weaknesses not seen in 60+ days with count < 5", () => {
    const staleTag = makeTag({
      category: "tense-omission",
      count: 2,
      lastSeenAt: FIXED_NOW - 61 * 86400000,
    });
    const memory = makeMemory([staleTag]);

    const pruned = pruneStaleWeaknesses(memory, 60, FIXED_NOW);
    expect(pruned.tags).toHaveLength(0);
  });

  it("keeps weaknesses with count >= 5 even if stale", () => {
    const staleButFrequent = makeTag({
      category: "tense-omission",
      count: 5,
      lastSeenAt: FIXED_NOW - 61 * 86400000,
    });
    const memory = makeMemory([staleButFrequent]);

    const pruned = pruneStaleWeaknesses(memory, 60, FIXED_NOW);
    expect(pruned.tags).toHaveLength(1);
  });

  it("keeps recent weaknesses regardless of count", () => {
    const recentTag = makeTag({
      category: "tense-omission",
      count: 1,
      lastSeenAt: FIXED_NOW - 10 * 86400000,
    });
    const memory = makeMemory([recentTag]);

    const pruned = pruneStaleWeaknesses(memory, 60, FIXED_NOW);
    expect(pruned.tags).toHaveLength(1);
  });

  it("mixed: keeps recent + frequent-stale, removes infrequent-stale", () => {
    const recentTag = makeTag({ category: "tense-omission", count: 1, lastSeenAt: FIXED_NOW });
    const frequentStale = makeTag({ category: "missing-article", count: 6, lastSeenAt: FIXED_NOW - 70 * 86400000 });
    const infrequentStale = makeTag({ category: "preposition-calque", count: 2, lastSeenAt: FIXED_NOW - 70 * 86400000 });

    const memory = makeMemory([recentTag, frequentStale, infrequentStale]);
    const pruned = pruneStaleWeaknesses(memory, 60, FIXED_NOW);

    expect(pruned.tags).toHaveLength(2);
    const categories = pruned.tags.map((t) => t.category);
    expect(categories).toContain("tense-omission");
    expect(categories).toContain("missing-article");
    expect(categories).not.toContain("preposition-calque");
  });
});

// ─── Tracked Weakness Label Tests ────────────────────────────────────────

describe("getTrackedWeaknessLabel — bridge to contract layer", () => {
  it("returns the top-ranked weakness label", () => {
    const tag = makeTag({
      category: "tense-omission",
      count: 5,
      labelVi: "thiếu thì (quá khứ / hiện tại / tương lai)",
    });
    const memory = makeMemory([tag]);

    const label = getTrackedWeaknessLabel(memory);
    expect(label).toBe("thiếu thì (quá khứ / hiện tại / tương lai)");
  });

  it("returns null when memory has no tags", () => {
    const memory = createEmptyWeaknessMemory(FIXED_NOW);
    const label = getTrackedWeaknessLabel(memory);
    expect(label).toBeNull();
  });
});

// ─── Catalog Integrity Tests ──────────────────────────────────────────────

describe("WEAKNESS_MEMORY_TAGS_CATALOG — completeness and correctness", () => {
  it("has entries for all standard categories", () => {
    const categories = WEAKNESS_MEMORY_TAGS_CATALOG.map((c) => c.category);
    expect(categories).toContain("missing-article");
    expect(categories).toContain("tense-omission");
    expect(categories).toContain("subj-verb-agreement");
    expect(categories).toContain("preposition-calque");
    expect(categories).toContain("word-order");
    expect(categories).toContain("zero-copula");
    expect(categories).toContain("double-negation");
    expect(categories).toContain("word_choice");
    expect(categories).toContain("sentence_structure");
    expect(categories).toContain("pronunciation");
    expect(categories).toContain("politeness_register");
  });

  it("every catalog entry has all required fields", () => {
    for (const entry of WEAKNESS_MEMORY_TAGS_CATALOG) {
      expect(entry.category).toBeTruthy();
      expect(entry.labelVi).toBeTruthy();
      expect(entry.labelEn).toBeTruthy();
      expect(entry.whyVi).toBeTruthy();
      expect(entry.l1TransferNoteVi).toBeTruthy();
    }
  });
});

describe("WEAKNESS_MEMORY_DIMENSIONS — documentation integrity", () => {
  it("has all four dimension entries", () => {
    const ids = WEAKNESS_MEMORY_DIMENSIONS.map((d) => d.id);
    expect(ids).toContain("classification");
    expect(ids).toContain("ranking");
    expect(ids).toContain("recall");
    expect(ids).toContain("phrasing");
  });

  it("every dimension has Vietnamese and English fields", () => {
    for (const dim of WEAKNESS_MEMORY_DIMENSIONS) {
      expect(dim.titleVi).toBeTruthy();
      expect(dim.titleEn).toBeTruthy();
      expect(dim.descriptionVi).toBeTruthy();
    }
  });
});

// ─── End-to-End Scenario Tests ───────────────────────────────────────────

describe("Scenario: tracking a learner's article weakness over multiple sessions", () => {
  it("builds up a persistent weakness profile from repeated corrections", () => {
    let memory = createEmptyWeaknessMemory(FIXED_NOW);

    // Session 1: learner makes 3 article errors
    memory = tagWeakness(
      memory,
      makeInput({
        errorCategory: "grammar",
        grammarPoint: "articles",
        exemplarPattern: "I saw cat → I saw a cat",
      }),
      FIXED_NOW,
    );
    memory = tagWeakness(
      memory,
      makeInput({
        errorCategory: "grammar",
        grammarPoint: "articles",
        exemplarPattern: "She is teacher → She is a teacher",
      }),
      FIXED_NOW,
    );
    memory = tagWeakness(
      memory,
      makeInput({
        errorCategory: "grammar",
        grammarPoint: "articles",
        exemplarPattern: "He bought car → He bought a car",
      }),
      FIXED_NOW,
    );

    expect(memory.tags[0].category).toBe("missing-article");
    expect(memory.tags[0].count).toBe(3);

    // Session 2 (next day): learner makes a tense error
    memory = tagWeakness(
      memory,
      makeInput({
        errorCategory: "grammar",
        grammarPoint: "past_tense",
        exemplarPattern: "I go → I went",
      }),
      FIXED_NOW + 86400000,
    );

    // Now recall: if learner makes another article error, it should be recalled
    const recall = recallRelevantWeakness(
      memory,
      { errorCategory: "grammar", grammarPoint: "articles", l1: "vi" },
      FIXED_NOW + 86400000,
    );

    expect(recall.reasonCode).toBe("exact_match");
    expect(recall.recalled!.category).toBe("missing-article");
    expect(recall.shouldMention).toBe(true);
    expect(recall.suggestedReferenceVi).toContain("mạo từ");
  });
});

describe("Scenario: multiple weakness categories sorted correctly", () => {
  it("ranks a frequent recent weakness above an infrequent old one", () => {
    const frequentRecent = makeTag({
      category: "tense-omission",
      count: 5,
      lastSeenAt: FIXED_NOW,
    });
    const oldRare = makeTag({
      category: "missing-article",
      count: 1,
      lastSeenAt: FIXED_NOW - 89 * 86400000,
    });
    const memory = makeMemory([oldRare, frequentRecent]);

    const top = getTopWeaknesses(memory, 3, FIXED_NOW);
    expect(top[0].category).toBe("tense-omission");
    expect(top[1].category).toBe("missing-article");
  });

  it("a very frequent old weakness can outrank a once-seen recent one", () => {
    const frequentOld = makeTag({
      category: "tense-omission",
      count: 10,
      lastSeenAt: FIXED_NOW - 30 * 86400000, // 30 days ago
    });
    const recentOnce = makeTag({
      category: "missing-article",
      count: 1,
      lastSeenAt: FIXED_NOW, // today
    });
    const memory = makeMemory([recentOnce, frequentOld]);

    const top = getTopWeaknesses(memory, 3, FIXED_NOW);

    // 30-day-old x10: recency~0.67, freq=1.0 → score ~67
    // today x1: recency=1.0, freq=0.2 → score 20
    expect(top[0].category).toBe("tense-omission");
  });
});
