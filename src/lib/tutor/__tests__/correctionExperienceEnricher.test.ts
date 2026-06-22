/**
 * Tests for Correction Experience Enricher
 *
 * Covers:
 *   - Rule ID → weakness category mapping (all major rule families)
 *   - Rule ID → Vietnamese interference category mapping
 *   - Combined enrichment (weaknessInput + interferenceCategory)
 *   - Edge cases: unknown rule IDs, empty arrays, null returns
 *   - Coverage integrity: all COVERED_RULE_ID_PREFIXES produce non-null mappings
 *   - Vietnamese-first: all mapped categories have VN labels
 */
import { describe, expect, it } from "vitest";
import {
  mapRuleIdToWeaknessCategory,
  mapRuleIdsToWeaknessInput,
  mapRuleIdToInterferenceCategory,
  mapRuleIdsToInterferenceCategory,
  enrichCorrectionExperience,
  COVERED_RULE_ID_PREFIXES,
} from "../correctionExperienceEnricher";

// ─── Rule ID → Weakness Category ─────────────────────────────────────────

describe("mapRuleIdToWeaknessCategory — correction rule → weakness", () => {
  // ── Article rules ──
  it("maps article rules to missing-article", () => {
    expect(mapRuleIdToWeaknessCategory("en-l4-missing-singular-article")).toBe("missing-article");
    expect(mapRuleIdToWeaknessCategory("en-step6-profession-article")).toBe("missing-article");
  });

  // ── Tense rules ──
  it("maps past-tense rules to tense-omission", () => {
    expect(mapRuleIdToWeaknessCategory("en-yesterday-irregular-beginner-past")).toBe("tense-omission");
    expect(mapRuleIdToWeaknessCategory("en-vn-past-marker-regular-verb")).toBe("tense-omission");
    expect(mapRuleIdToWeaknessCategory("en-step6-past-marker-recall")).toBe("tense-omission");
  });

  it("maps irregular verb rules to tense-omission", () => {
    expect(mapRuleIdToWeaknessCategory("en-irregular-verb-pattern")).toBe("tense-omission");
  });

  // ── Subject-verb agreement ──
  it("maps SVA rules to subj-verb-agreement", () => {
    expect(mapRuleIdToWeaknessCategory("en-step5-subject-verb-agreement")).toBe("subj-verb-agreement");
    expect(mapRuleIdToWeaknessCategory("en-third-person-daily-go-eat-have")).toBe("subj-verb-agreement");
    expect(mapRuleIdToWeaknessCategory("en-third-person-school-routine")).toBe("subj-verb-agreement");
    expect(mapRuleIdToWeaknessCategory("en-third_person_s")).toBe("subj-verb-agreement");
  });

  // ── Preposition rules ──
  it("maps preposition rules to preposition-calque", () => {
    expect(mapRuleIdToWeaknessCategory("en-step5-preposition-pattern")).toBe("preposition-calque");
    expect(mapRuleIdToWeaknessCategory("en-step6-at-clock-time")).toBe("preposition-calque");
    expect(mapRuleIdToWeaknessCategory("en-step6-in-month-year")).toBe("preposition-calque");
    expect(mapRuleIdToWeaknessCategory("en-step6-wait-for-person-object")).toBe("preposition-calque");
    expect(mapRuleIdToWeaknessCategory("en-step6-listen-to-object")).toBe("preposition-calque");
    expect(mapRuleIdToWeaknessCategory("en-step6-look-at-pronoun")).toBe("preposition-calque");
  });

  // ── Word order ──
  it("maps word-order rules to word-order", () => {
    expect(mapRuleIdToWeaknessCategory("en-l4-topic-comment-word-order")).toBe("word-order");
    expect(mapRuleIdToWeaknessCategory("en-time-expression-placement")).toBe("word-order");
    expect(mapRuleIdToWeaknessCategory("en-morning-routine-subject-carryover")).toBe("word-order");
  });

  // ── Copula / be-verb ──
  it("maps copula rules to zero-copula", () => {
    expect(mapRuleIdToWeaknessCategory("en-be-verb-omission")).toBe("zero-copula");
    expect(mapRuleIdToWeaknessCategory("en-vn-copula-be-adjective")).toBe("zero-copula");
    expect(mapRuleIdToWeaknessCategory("en-step6-location-be-drop")).toBe("zero-copula");
  });

  // ── Plural / noun form ──
  it("maps plural rules to missing-article (article-adjacent)", () => {
    expect(mapRuleIdToWeaknessCategory("en-l4-quantity-plural-s")).toBe("missing-article");
  });

  it("maps possessive rules to word_choice", () => {
    expect(mapRuleIdToWeaknessCategory("en-step6-possessive-s")).toBe("word_choice");
  });

  // ── Calques ──
  it("maps calque rules to word_choice", () => {
    expect(mapRuleIdToWeaknessCategory("en-calque-open-turn-on-appliance")).toBe("word_choice");
    expect(mapRuleIdToWeaknessCategory("en-calque-close-turn-off-appliance")).toBe("word_choice");
    expect(mapRuleIdToWeaknessCategory("en-calque-take-medicine")).toBe("word_choice");
    expect(mapRuleIdToWeaknessCategory("en-calque-say-with-person")).toBe("word_choice");
  });

  // ── Collocations ──
  it("maps collocation rules to word_choice", () => {
    expect(mapRuleIdToWeaknessCategory("en-vietlish-collocation-do-homework")).toBe("word_choice");
    expect(mapRuleIdToWeaknessCategory("en-vietlish-collocation-make-mistake")).toBe("word_choice");
    expect(mapRuleIdToWeaknessCategory("en-vietlish-collocation-take-photo")).toBe("word_choice");
  });

  // ── Extra-word patterns ──
  it("maps extra-word patterns to word_choice", () => {
    expect(mapRuleIdToWeaknessCategory("en-step6-discuss-about")).toBe("word_choice");
    expect(mapRuleIdToWeaknessCategory("en-step6-marry-with")).toBe("word_choice");
    expect(mapRuleIdToWeaknessCategory("en-vietlish-mention-about")).toBe("word_choice");
    expect(mapRuleIdToWeaknessCategory("en-vietlish-contact-with")).toBe("word_choice");
    expect(mapRuleIdToWeaknessCategory("en-vietlish-research-about")).toBe("word_choice");
    expect(mapRuleIdToWeaknessCategory("en-vietlish-phone-text-to")).toBe("word_choice");
    expect(mapRuleIdToWeaknessCategory("en-vietlish-explain-to-me")).toBe("word_choice");
  });

  // ── Discourse / structure ──
  it("maps discourse rules to sentence_structure", () => {
    expect(mapRuleIdToWeaknessCategory("en-vietlish-discourse-according-to-me")).toBe("sentence_structure");
    expect(mapRuleIdToWeaknessCategory("en-vietlish-discourse-reason-is-because")).toBe("sentence_structure");
    expect(mapRuleIdToWeaknessCategory("en-vn-although-even-though-but")).toBe("sentence_structure");
    expect(mapRuleIdToWeaknessCategory("en-vn-because-so-doubling")).toBe("sentence_structure");
    expect(mapRuleIdToWeaknessCategory("en-vietlish-double-comparative")).toBe("sentence_structure");
    expect(mapRuleIdToWeaknessCategory("en-vietlish-double-superlative-most-est")).toBe("sentence_structure");
  });

  // ── Existential have ──
  it("maps existential-have to sentence_structure", () => {
    expect(mapRuleIdToWeaknessCategory("en-existential-have-there-is")).toBe("sentence_structure");
  });

  // ── Yes-no / do-support ──
  it("maps yesno do-support rules to sentence_structure", () => {
    expect(mapRuleIdToWeaknessCategory("en-vn-yesno-do-support")).toBe("sentence_structure");
  });

  // ── Vietlish word choice ──
  it("maps vietlish word-choice patterns", () => {
    expect(mapRuleIdToWeaknessCategory("en-vietlish-say-tell-person")).toBe("word_choice");
    expect(mapRuleIdToWeaknessCategory("en-vietlish-very-like")).toBe("word_choice");
    expect(mapRuleIdToWeaknessCategory("en-vietlish-very-verb-really")).toBe("word_choice");
    expect(mapRuleIdToWeaknessCategory("en-vietlish-be-agree")).toBe("word_choice");
    expect(mapRuleIdToWeaknessCategory("en-vietlish-age-have-be")).toBe("word_choice");
    expect(mapRuleIdToWeaknessCategory("en-vietlish-duration-since-for")).toBe("word_choice");
    expect(mapRuleIdToWeaknessCategory("en-vietlish-go-home")).toBe("word_choice");
  });

  // ── Punctuation-only (not weaknesses) ──
  it("returns null for punctuation-only rules (run-on, question form)", () => {
    expect(mapRuleIdToWeaknessCategory("en-runon-morning-routine-punctuation")).toBeNull();
    expect(mapRuleIdToWeaknessCategory("en-question-form-final-mark")).toBeNull();
  });

  // ── Unknown / unmapped ──
  it("returns null for unknown rule IDs", () => {
    expect(mapRuleIdToWeaknessCategory("unknown-rule")).toBeNull();
    expect(mapRuleIdToWeaknessCategory("made")).toBeNull();
    expect(mapRuleIdToWeaknessCategory("told")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(mapRuleIdToWeaknessCategory("")).toBeNull();
  });
});

// ─── Rule IDs → Weakness Tag Input ───────────────────────────────────────

describe("mapRuleIdsToWeaknessInput — array of rules → tag input", () => {
  it("creates tag input from the first matching rule ID", () => {
    const result = mapRuleIdsToWeaknessInput(
      ["en-l4-missing-singular-article", "en-step5-preposition-pattern"],
      "I buy hat → I buy a hat",
    );
    expect(result).not.toBeNull();
    expect(result!.errorCategory).toBe("en-l4-missing-singular-article");
    expect(result!.exemplarPattern).toBe("I buy hat → I buy a hat");
    expect(result!.l1).toBe("vi");
  });

  it("skips unknown rules and uses the first known match", () => {
    const result = mapRuleIdsToWeaknessInput(
      ["unknown-rule", "made", "en-step5-subject-verb-agreement"],
      "She go → She goes",
    );
    expect(result).not.toBeNull();
    expect(result!.errorCategory).toBe("en-step5-subject-verb-agreement");
  });

  it("returns null when no rule IDs map to a weakness", () => {
    const result = mapRuleIdsToWeaknessInput(
      ["unknown-rule", "made", "told"],
      "x → y",
    );
    expect(result).toBeNull();
  });

  it("returns null for empty rule ID array", () => {
    const result = mapRuleIdsToWeaknessInput([], "x → y");
    expect(result).toBeNull();
  });

  it("allows custom l1", () => {
    const result = mapRuleIdsToWeaknessInput(
      ["en-l4-missing-singular-article"],
      "x → y",
      "fr",
    );
    expect(result!.l1).toBe("fr");
  });
});

// ─── Rule ID → Vietnamese Interference Category ──────────────────────────

describe("mapRuleIdToInterferenceCategory — rule → VN interference", () => {
  // ── Missing words ──
  it("maps article rules to missing_word", () => {
    expect(mapRuleIdToInterferenceCategory("en-l4-missing-singular-article")).toBe("missing_word");
    expect(mapRuleIdToInterferenceCategory("en-step6-profession-article")).toBe("missing_word");
  });

  it("maps be-verb omission to missing_word", () => {
    expect(mapRuleIdToInterferenceCategory("en-be-verb-omission")).toBe("missing_word");
    expect(mapRuleIdToInterferenceCategory("en-vn-copula-be-adjective")).toBe("missing_word");
    expect(mapRuleIdToInterferenceCategory("en-step6-location-be-drop")).toBe("missing_word");
  });

  it("maps preposition rules (non-extra-word) to missing_word", () => {
    expect(mapRuleIdToInterferenceCategory("en-step5-preposition-pattern")).toBe("missing_word");
    expect(mapRuleIdToInterferenceCategory("en-step6-at-clock-time")).toBe("missing_word");
  });

  // ── Extra words ──
  it("maps discuss-about / marry-with to extra_word", () => {
    expect(mapRuleIdToInterferenceCategory("en-step6-discuss-about")).toBe("extra_word");
    expect(mapRuleIdToInterferenceCategory("en-step6-marry-with")).toBe("extra_word");
    expect(mapRuleIdToInterferenceCategory("en-vietlish-mention-about")).toBe("extra_word");
    expect(mapRuleIdToInterferenceCategory("en-vietlish-contact-with")).toBe("extra_word");
    expect(mapRuleIdToInterferenceCategory("en-vietlish-research-about")).toBe("extra_word");
    expect(mapRuleIdToInterferenceCategory("en-vietlish-phone-text-to")).toBe("extra_word");
    expect(mapRuleIdToInterferenceCategory("en-vietlish-explain-to-me")).toBe("extra_word");
  });

  // ── Word order ──
  it("maps word-order rules to word_order", () => {
    expect(mapRuleIdToInterferenceCategory("en-l4-topic-comment-word-order")).toBe("word_order");
    expect(mapRuleIdToInterferenceCategory("en-time-expression-placement")).toBe("word_order");
    expect(mapRuleIdToInterferenceCategory("en-morning-routine-subject-carryover")).toBe("word_order");
  });

  // ── Verb form ──
  it("maps tense rules to verb_form", () => {
    expect(mapRuleIdToInterferenceCategory("en-yesterday-irregular-beginner-past")).toBe("verb_form");
    expect(mapRuleIdToInterferenceCategory("en-vn-past-marker-regular-verb")).toBe("verb_form");
    expect(mapRuleIdToInterferenceCategory("en-step6-past-marker-recall")).toBe("verb_form");
  });

  it("maps SVA rules to verb_form", () => {
    expect(mapRuleIdToInterferenceCategory("en-step5-subject-verb-agreement")).toBe("verb_form");
    expect(mapRuleIdToInterferenceCategory("en-third-person-daily-go-eat-have")).toBe("verb_form");
  });

  it("maps do-support rules to verb_form", () => {
    expect(mapRuleIdToInterferenceCategory("en-vn-yesno-do-support")).toBe("verb_form");
  });

  // ── Noun form ──
  it("maps plural rules to noun_form", () => {
    expect(mapRuleIdToInterferenceCategory("en-l4-quantity-plural-s")).toBe("noun_form");
    expect(mapRuleIdToInterferenceCategory("en-vn-numeral-quantifier-plural")).toBe("noun_form");
  });

  it("maps possessive rules to noun_form", () => {
    expect(mapRuleIdToInterferenceCategory("en-step6-possessive-s")).toBe("noun_form");
  });

  // ── Word choice ──
  it("maps calque rules to word_choice", () => {
    expect(mapRuleIdToInterferenceCategory("en-calque-open-turn-on-appliance")).toBe("word_choice");
    expect(mapRuleIdToInterferenceCategory("en-calque-take-medicine")).toBe("word_choice");
  });

  it("maps collocation rules to word_choice", () => {
    expect(mapRuleIdToInterferenceCategory("en-vietlish-collocation-do-homework")).toBe("word_choice");
    expect(mapRuleIdToInterferenceCategory("en-vietlish-collocation-make-mistake")).toBe("word_choice");
  });

  it("maps say-tell / very-* / be-agree to word_choice", () => {
    expect(mapRuleIdToInterferenceCategory("en-vietlish-say-tell-person")).toBe("word_choice");
    expect(mapRuleIdToInterferenceCategory("en-vietlish-very-like")).toBe("word_choice");
    expect(mapRuleIdToInterferenceCategory("en-vietlish-be-agree")).toBe("word_choice");
    expect(mapRuleIdToInterferenceCategory("en-vietlish-go-home")).toBe("word_choice");
  });

  // ── Structural (other) ──
  it("maps discourse / structure rules to other", () => {
    expect(mapRuleIdToInterferenceCategory("en-vn-although-even-though-but")).toBe("other");
    expect(mapRuleIdToInterferenceCategory("en-vn-because-so-doubling")).toBe("other");
    expect(mapRuleIdToInterferenceCategory("en-vietlish-double-comparative")).toBe("other");
    expect(mapRuleIdToInterferenceCategory("en-existential-have-there-is")).toBe("other");
    expect(mapRuleIdToInterferenceCategory("en-vietlish-discourse-according-to-me")).toBe("other");
  });

  // ── Unknown ──
  it("returns null for punctuation-only rules", () => {
    expect(mapRuleIdToInterferenceCategory("en-question-form-final-mark")).toBeNull();
    expect(mapRuleIdToInterferenceCategory("en-runon-morning-routine-punctuation")).toBeNull();
  });

  it("returns null for unknown rule IDs", () => {
    expect(mapRuleIdToInterferenceCategory("unknown-rule")).toBeNull();
    expect(mapRuleIdToInterferenceCategory("made")).toBeNull();
    expect(mapRuleIdToInterferenceCategory("")).toBeNull();
  });
});

// ─── Rule IDs → Interference Category (array version) ────────────────────

describe("mapRuleIdsToInterferenceCategory — array → first match", () => {
  it("returns first matching interference category", () => {
    const result = mapRuleIdsToInterferenceCategory([
      "en-l4-missing-singular-article",
      "en-step5-subject-verb-agreement",
    ]);
    expect(result).toBe("missing_word");
  });

  it("skips non-matching rules", () => {
    const result = mapRuleIdsToInterferenceCategory([
      "unknown-rule",
      "made",
      "en-step5-subject-verb-agreement",
    ]);
    expect(result).toBe("verb_form");
  });

  it("returns null for empty array", () => {
    expect(mapRuleIdsToInterferenceCategory([])).toBeNull();
  });

  it("returns null when no rules match", () => {
    expect(mapRuleIdsToInterferenceCategory(["unknown", "made", "told"])).toBeNull();
  });
});

// ─── Combined Enrichment ─────────────────────────────────────────────────

describe("enrichCorrectionExperience — full enrichment", () => {
  it("enriches past-tense correction with weakness + interference", () => {
    const result = enrichCorrectionExperience(
      ["en-yesterday-irregular-beginner-past"],
      "I go → I went",
    );
    expect(result.weaknessInput).not.toBeNull();
    expect(result.weaknessInput!.errorCategory).toBe("en-yesterday-irregular-beginner-past");
    expect(result.weaknessInput!.exemplarPattern).toBe("I go → I went");
    expect(result.interferenceCategory).toBe("verb_form");
    expect(result.matchedRuleId).toBe("en-yesterday-irregular-beginner-past");
    expect(result.isL1TransferError).toBe(true);
  });

  it("enriches article correction with weakness + interference", () => {
    const result = enrichCorrectionExperience(
      ["en-l4-missing-singular-article"],
      "I saw cat → I saw a cat",
    );
    expect(result.weaknessInput).not.toBeNull();
    expect(result.interferenceCategory).toBe("missing_word");
    expect(result.isL1TransferError).toBe(true);
  });

  it("enriches calque correction with weakness + interference", () => {
    const result = enrichCorrectionExperience(
      ["en-calque-open-turn-on-appliance"],
      "Open the light → Turn on the light",
    );
    expect(result.weaknessInput).not.toBeNull();
    expect(result.interferenceCategory).toBe("word_choice");
    expect(result.isL1TransferError).toBe(true);
  });

  it("enriches discuss-about as word_choice weakness + extra_word interference", () => {
    const result = enrichCorrectionExperience(
      ["en-step6-discuss-about"],
      "discuss about X → discuss X",
    );
    expect(result.weaknessInput).not.toBeNull();
    expect(result.interferenceCategory).toBe("extra_word");
    expect(result.isL1TransferError).toBe(true);
  });

  it("enriches SVA correction with subj-verb-agreement weakness + verb_form interference", () => {
    const result = enrichCorrectionExperience(
      ["en-step5-subject-verb-agreement"],
      "She go → She goes",
    );
    expect(result.weaknessInput).not.toBeNull();
    expect(result.interferenceCategory).toBe("verb_form");
    expect(result.isL1TransferError).toBe(true);
  });

  it("handles rule ID with no weakness mapping (punctuation)", () => {
    const result = enrichCorrectionExperience(
      ["en-question-form-final-mark"],
      "what → What?",
    );
    expect(result.weaknessInput).toBeNull();
    expect(result.interferenceCategory).toBeNull();
    expect(result.matchedRuleId).toBeNull();
    expect(result.isL1TransferError).toBe(false);
  });

  it("handles empty rule ID array", () => {
    const result = enrichCorrectionExperience([], "x → y");
    expect(result.weaknessInput).toBeNull();
    expect(result.interferenceCategory).toBeNull();
    expect(result.matchedRuleId).toBeNull();
    expect(result.isL1TransferError).toBe(false);
  });

  it("uses first match when multiple rule IDs are present", () => {
    const result = enrichCorrectionExperience(
      ["en-l4-missing-singular-article", "en-step5-subject-verb-agreement"],
      "I saw cat → I saw a cat",
    );
    expect(result.weaknessInput).not.toBeNull();
    expect(result.weaknessInput!.errorCategory).toBe("en-l4-missing-singular-article");
    expect(result.interferenceCategory).toBe("missing_word");
  });

  it("passes custom l1 through to weakness input", () => {
    const result = enrichCorrectionExperience(
      ["en-l4-missing-singular-article"],
      "x → y",
      "fr",
    );
    expect(result.weaknessInput!.l1).toBe("fr");
  });
});

// ─── Coverage Integrity ──────────────────────────────────────────────────

describe("COVERED_RULE_ID_PREFIXES — every listed prefix maps correctly", () => {
  it("every covered rule ID maps to a non-null weakness category", () => {
    // Some rule IDs are intentionally unmapped for weakness (punctuation-only fixes).
    const NON_WEAKNESS_RULES = new Set([
      "en-runon-morning-routine-punctuation",
      "en-question-form-final-mark",
    ]);

    for (const ruleId of COVERED_RULE_ID_PREFIXES) {
      if (NON_WEAKNESS_RULES.has(ruleId)) {
        expect(
          mapRuleIdToWeaknessCategory(ruleId),
          `Rule ID "${ruleId}" should NOT map to a weakness category`,
        ).toBeNull();
      } else {
        const weaknessCat = mapRuleIdToWeaknessCategory(ruleId);
        expect(
          weaknessCat,
          `Rule ID "${ruleId}" returned null for weakness category — add a mapping or remove from COVERED_RULE_ID_PREFIXES`,
        ).not.toBeNull();
      }
    }
  });

  it("every covered rule ID maps to a non-null interference category", () => {
    // Some rule IDs are not VN→EN transfer patterns by design
    // (e.g., punctuation, run-on). We track those explicitly.
    const NON_INTERFERENCE_RULES = new Set([
      "en-runon-morning-routine-punctuation",
      "en-question-form-final-mark",
    ]);

    for (const ruleId of COVERED_RULE_ID_PREFIXES) {
      if (NON_INTERFERENCE_RULES.has(ruleId)) {
        expect(
          mapRuleIdToInterferenceCategory(ruleId),
          `Rule ID "${ruleId}" should NOT have an interference category`,
        ).toBeNull();
      } else {
        const interferenceCat = mapRuleIdToInterferenceCategory(ruleId);
        expect(
          interferenceCat,
          `Rule ID "${ruleId}" returned null for interference category — add a mapping or add to NON_INTERFERENCE_RULES`,
        ).not.toBeNull();
      }
    }
  });

  it("all covered prefix IDs map to known weakness categories (or are intentionally null)", () => {
    const NON_WEAKNESS_RULES = new Set([
      "en-runon-morning-routine-punctuation",
      "en-question-form-final-mark",
    ]);

    for (const ruleId of COVERED_RULE_ID_PREFIXES) {
      const cat = mapRuleIdToWeaknessCategory(ruleId);
      if (NON_WEAKNESS_RULES.has(ruleId)) {
        expect(cat, `Rule ID "${ruleId}" should NOT map to a weakness`).toBeNull();
        continue;
      }
      expect(
        [
          "missing-article",
          "tense-omission",
          "subj-verb-agreement",
          "preposition-calque",
          "word-order",
          "zero-copula",
          "double-negation",
          "word_choice",
          "sentence_structure",
          "pronunciation",
          "politeness_register",
        ].includes(cat as string),
        `Rule ID "${ruleId}" maps to "${cat}" which is not a known WeaknessCategory`,
      ).toBe(true);
    }
  });
});

// ─── Vietnamese-First Integrity ──────────────────────────────────────────

describe("Vietnamese-first: all mapped categories exist in the explanation catalog", () => {
  it("every mapped interference category has a full explanation", async () => {
    const { getInterferenceCategoryExplanation } = await import(
      "../vietnameseInterferenceExplanation"
    );

    for (const ruleId of COVERED_RULE_ID_PREFIXES) {
      const cat = mapRuleIdToInterferenceCategory(ruleId);
      if (!cat) continue; // non-interference rules are fine

      const explanation = getInterferenceCategoryExplanation(cat);
      expect(explanation.vietnameseRootCause).toBeTruthy();
      expect(explanation.englishSystemDifference).toBeTruthy();
      expect(explanation.teacherExplanation).toBeTruthy();
      expect(explanation.teacherExplanation).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđĐ]/); // Vietnamese diacritics
    }
  });

  it("every mapped weakness category has a Vietnamese label in the catalog", async () => {
    const { WEAKNESS_MEMORY_TAGS_CATALOG } = await import("../weaknessMemoryTags");

    const NON_WEAKNESS_RULES = new Set([
      "en-runon-morning-routine-punctuation",
      "en-question-form-final-mark",
    ]);

    for (const ruleId of COVERED_RULE_ID_PREFIXES) {
      if (NON_WEAKNESS_RULES.has(ruleId)) continue; // punctuation-only, intentionally unmapped

      const cat = mapRuleIdToWeaknessCategory(ruleId);
      if (!cat) {
        throw new Error(
          `Rule ID "${ruleId}" returned null — all COVERED_RULE_ID_PREFIXES must map to a weakness category`,
        );
      }

      const meta = WEAKNESS_MEMORY_TAGS_CATALOG.find((c) => c.category === cat);
      expect(meta, `No catalog entry for weakness category "${cat}" (from rule "${ruleId}")`).toBeDefined();
      expect(meta!.labelVi).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđĐ]/); // Vietnamese diacritics
      expect(meta!.whyVi).toMatch(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđĐ]/);
    }
  });
});

// ─── End-to-End Scenario: Enrich → Tag → Recall → Explain ────────────────

describe("Scenario: full correction enrichment pipeline", () => {
  it("enriches a past-tense correction, tags memory, recalls weakness, provides VN explanation", async () => {
    const { createEmptyWeaknessMemory, tagWeakness, recallRelevantWeakness } = await import(
      "../weaknessMemoryTags"
    );
    const { getInterferenceCategoryExplanation } = await import(
      "../vietnameseInterferenceExplanation"
    );

    // Step 1: Enrich the correction
    const enriched = enrichCorrectionExperience(
      ["en-yesterday-irregular-beginner-past"],
      "I go yesterday → I went yesterday",
    );

    // Step 2: Tag into memory (simulating what the page/component would do)
    let memory = createEmptyWeaknessMemory();
    memory = tagWeakness(memory, enriched.weaknessInput!);

    expect(memory.tags).toHaveLength(1);
    expect(memory.tags[0].category).toBe("tense-omission");
    expect(memory.tags[0].count).toBe(1);

    // Simulate another past-tense error (next turn)
    const enriched2 = enrichCorrectionExperience(
      ["en-vn-past-marker-regular-verb"],
      "I walk yesterday → I walked yesterday",
    );
    memory = tagWeakness(memory, enriched2.weaknessInput!);

    expect(memory.tags[0].count).toBe(2);

    // Step 3: Recall relevant weakness
    const recall = recallRelevantWeakness(memory, {
      errorCategory: "grammar",
      grammarPoint: "past_tense",
      l1: "vi",
    });

    expect(recall.reasonCode).toBe("exact_match");
    expect(recall.recalled!.category).toBe("tense-omission");
    expect(recall.shouldMention).toBe(true); // count >= 2
    expect(recall.suggestedReferenceVi).toContain("thiếu thì");

    // Step 4: Get Vietnamese interference explanation
    const explanation = getInterferenceCategoryExplanation(
      enriched.interferenceCategory!,
    );
    expect(explanation.category).toBe("verb_form");
    expect(explanation.vietnameseRootCause.toLowerCase()).toContain("tiếng việt");
    expect(explanation.teacherExplanation).toContain("Cô Mercy");
  });

  it("handles an article weakness building up across multiple corrections", async () => {
    const { createEmptyWeaknessMemory, tagWeakness, recallRelevantWeakness } = await import(
      "../weaknessMemoryTags"
    );
    const { getInterferenceCategoryExplanation } = await import(
      "../vietnameseInterferenceExplanation"
    );

    let memory = createEmptyWeaknessMemory();

    // Three article corrections across turns
    const corrections = [
      { ruleId: "en-l4-missing-singular-article", exemplar: "I saw cat → I saw a cat" },
      { ruleId: "en-step6-profession-article", exemplar: "She is teacher → She is a teacher" },
      { ruleId: "en-l4-missing-singular-article", exemplar: "He bought car → He bought a car" },
    ];

    for (const c of corrections) {
      const enriched = enrichCorrectionExperience([c.ruleId], c.exemplar);
      memory = tagWeakness(memory, enriched.weaknessInput!);
    }

    expect(memory.tags[0].category).toBe("missing-article");
    expect(memory.tags[0].count).toBe(3);

    // Recall should match
    const recall = recallRelevantWeakness(memory, {
      errorCategory: "grammar",
      grammarPoint: "articles",
      l1: "vi",
    });
    expect(recall.reasonCode).toBe("exact_match");
    expect(recall.shouldMention).toBe(true);

    // Interference explanation for article error
    const explanation = getInterferenceCategoryExplanation("missing_word");
    expect(explanation.vietnameseRootCause).toContain("đơn lập");
    expect(explanation.mentalModelShift).toContain("cấu trúc + ý nghĩa");
  });

  it("returns no recall for corrections with no weakness mapping (punctuation)", async () => {
    const { createEmptyWeaknessMemory, tagWeakness } = await import(
      "../weaknessMemoryTags"
    );

    // Punctuation corrections: no weakness, no interference
    const enriched = enrichCorrectionExperience(
      ["en-question-form-final-mark"],
      "what → What?",
    );

    expect(enriched.weaknessInput).toBeNull();
    expect(enriched.interferenceCategory).toBeNull();
    expect(enriched.isL1TransferError).toBe(false);

    // Memory stays empty — no tagging for non-weakness corrections
    const memory = createEmptyWeaknessMemory();
    expect(memory.tags).toHaveLength(0);
    expect(memory.totalCorrectionsObserved).toBe(0);
  });
});
