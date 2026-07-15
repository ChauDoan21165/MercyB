import { describe, it, expect } from "vitest";

import {
  L1_VN_EXPLANATIONS,
  L1_VN_EXPLANATION_MAX_CHARS,
  getL1VnExplanation,
  listCoveredVnTags,
  type L1VnExplanation,
} from "../l1-vn-explanations.js";

// The canonical list of tags the detector currently supports (v1.2 = 35).
// Kept inline on purpose so a missed tag in l1-error-detector.ts doesn't
// accidentally silence this coverage check.
const KNOWN_TAGS_V12 = [
  // v1.0
  "vi_l1_3rd_person_s",
  "vi_l1_past_ed",
  "vi_l1_plural_s",
  "vi_l1_missing_be",
  "vi_l1_question_no_aux",
  "vi_l1_missing_article",
  "vi_l1_possessive_gender",
  "vi_l1_preposition_transfer",
  "vi_l1_countable",
  // v1.1
  "vi_l1_to_verb_confusion",
  "vi_l1_can_no_infinitive",
  "vi_l1_double_past",
  "vi_l1_possessive_s_missing",
  "vi_l1_comparative_double",
  "vi_l1_adjective_order",
  "vi_l1_very_much_placement",
  "vi_l1_there_are_singular",
  "vi_l1_everyone_plural",
  "vi_l1_make_vs_do",
  "vi_l1_tag_question",
  // v1.2
  "vi_l1_past_perfect_missing",
  "vi_l1_reported_speech",
  "vi_l1_since_vs_for",
  "vi_l1_countable_much",
  "vi_l1_some_vs_any",
  "vi_l1_reflexive_missing",
  "vi_l1_conditional_mix",
  "vi_l1_to_infinitive_after_ing",
  "vi_l1_passive_missing_be",
  "vi_l1_relative_pronoun",
  "vi_l1_used_to_vs_be_used_to",
  "vi_l1_another_vs_other",
  "vi_l1_look_vs_see_vs_watch",
  "vi_l1_by_vs_with",
  "vi_l1_time_expressions",
] as const;

describe("L1_VN_EXPLANATIONS — coverage", () => {
  it("covers every known detector tag (35 today)", () => {
    const covered = new Set(listCoveredVnTags());
    const missing = KNOWN_TAGS_V12.filter((t) => !covered.has(t));
    expect(missing).toEqual([]);
  });

  it("has exactly 76 entries — flags drift if the count changes unexpectedly", () => {
    // 60 → 61: Round 6 added `vi_l1_no_aux_negation` (Bar #1 DoD flip).
    // 61 → 62: Round 6 added `vi_l1_co_transfer` (Bar #1 DoD flip).
    // 62 → 63: Round 6 added `vi_l1_topic_comment_fronting` (Bar #1 DoD flip).
    // 63 → 64: Round 6 added `vi_l1_future_adverb_bare` (Bar #1 DoD flip).
    // 64 → 65: Round 6 added `vi_l1_subject_gender` (Bar #1 DoD flip).
    // 65 → 76: Group B VI batch added 11 text detector explanations.
    expect(listCoveredVnTags()).toHaveLength(76);
  });
});

describe("L1_VN_EXPLANATIONS — field presence", () => {
  it.each(KNOWN_TAGS_V12)(
    "%s has non-empty name_vi, explanation_vi, example_wrong_vi_gloss",
    (tag) => {
      const entry = L1_VN_EXPLANATIONS[tag];
      expect(entry).toBeDefined();
      expect(typeof entry.name_vi).toBe("string");
      expect(entry.name_vi.trim().length).toBeGreaterThan(0);
      expect(typeof entry.explanation_vi).toBe("string");
      expect(entry.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(typeof entry.example_wrong_vi_gloss).toBe("string");
      expect(entry.example_wrong_vi_gloss.trim().length).toBeGreaterThan(0);
      expect(typeof entry.needs_review).toBe("boolean");
    },
  );
});

describe("L1_VN_EXPLANATIONS — mobile-length budget", () => {
  it.each(KNOWN_TAGS_V12)(
    "%s explanation_vi ≤ %i chars",
    (tag) => {
      const entry = L1_VN_EXPLANATIONS[tag];
      expect(entry.explanation_vi.length).toBeLessThanOrEqual(
        L1_VN_EXPLANATION_MAX_CHARS,
      );
    },
  );

  it("reports every entry within budget (manual-read summary)", () => {
    const over = listCoveredVnTags().filter(
      (tag) =>
        L1_VN_EXPLANATIONS[tag as keyof typeof L1_VN_EXPLANATIONS]
          .explanation_vi.length > L1_VN_EXPLANATION_MAX_CHARS,
    );
    expect(over).toEqual([]);
  });
});

describe("L1_VN_EXPLANATIONS — voice invariants", () => {
  // Each pattern must be matched as a standalone Vietnamese token —
  // not a substring of an innocent word. "ngu" is inside "nguyên" /
  // "ngữ"; "dốt" must be word-bounded; multi-word phrases are fine as
  // plain contains.
  const shamefulPatterns: Array<{ name: string; test: (s: string) => boolean }> = [
    { name: "sai lầm",   test: (s) => s.includes("sai lầm") },
    { name: "xấu hổ",    test: (s) => s.includes("xấu hổ") },
    {
      name: "ngu (standalone)",
      test: (s) => /(^|[^a-zà-ỹ])ngu([^a-zà-ỹ]|$)/i.test(s),
    },
    {
      name: "dốt (standalone)",
      test: (s) => /(^|[^a-zà-ỹ])dốt([^a-zà-ỹ]|$)/i.test(s),
    },
  ];

  it.each(KNOWN_TAGS_V12)(
    "%s explanation_vi avoids shameful framing",
    (tag) => {
      const e = L1_VN_EXPLANATIONS[tag].explanation_vi.toLowerCase();
      for (const { name, test } of shamefulPatterns) {
        if (test(e)) {
          throw new Error(`Shameful pattern "${name}" matched in ${tag}`);
        }
      }
    },
  );

  it.each(KNOWN_TAGS_V12)(
    "%s explanation_vi contains Vietnamese (non-ASCII) characters",
    (tag) => {
      const e = L1_VN_EXPLANATIONS[tag].explanation_vi;
      // Any non-ASCII char → almost certainly Vietnamese diacritic.
      // eslint-disable-next-line no-control-regex -- intentional ASCII-range check
      expect(/[^\x00-\x7F]/.test(e)).toBe(true);
    },
  );
});

describe("getL1VnExplanation", () => {
  it("returns the entry for a known tag", () => {
    const entry = getL1VnExplanation("vi_l1_3rd_person_s");
    expect(entry).not.toBeNull();
    expect(entry?.name_vi).toMatch(/he \/ she \/ it/i);
  });

  it("returns null for an unknown tag (forward-compat with CC3's 25 new rules)", () => {
    expect(getL1VnExplanation("vi_l1_not_yet_covered")).toBeNull();
    expect(getL1VnExplanation("")).toBeNull();
  });

  it("narrows the type correctly — all 4 fields are readable", () => {
    const entry = getL1VnExplanation("vi_l1_past_ed") as L1VnExplanation;
    expect(entry.name_vi).toBeDefined();
    expect(entry.explanation_vi).toBeDefined();
    expect(entry.example_wrong_vi_gloss).toBeDefined();
    expect(typeof entry.needs_review).toBe("boolean");
  });
});
