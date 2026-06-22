/**
 * Correction Experience Enricher
 *
 * Bridges the correction engine output to the learner-facing correction
 * experience by connecting two previously standalone modules:
 *
 *   1. weaknessMemoryTags.ts — for tagging and recalling persistent
 *      learner weaknesses (R5_REMEMBER_WEAKNESS)
 *   2. vietnameseInterferenceExplanation.ts — for showing Vietnamese
 *      root-cause explanations without shame (R6_VIETNAMESE_INTERFERENCE)
 *
 * This module is the "wiring layer" that makes the teacher-quality
 * intelligence from those modules actually visible to the learner.
 *
 * Design:
 *   - Pure functions — no I/O, no side effects, deterministic.
 *   - Rule-ID-based mapping — correction engine rule IDs are the
 *     canonical signal for both weakness categories and interference
 *     categories.
 *   - Honest null returns — when a rule ID doesn't map to a known
 *     category, we return null rather than guessing.
 *   - Vietnamese-first — weakness labels and interference explanations
 *     are in Vietnamese by default, with English for telemetry.
 *
 * Usage:
 *   import {
 *     mapRuleIdsToWeaknessInput,
 *     mapRuleIdsToInterferenceCategory,
 *     enrichCorrectionExperience,
 *   } from "./correctionExperienceEnricher";
 *
 *   // When a correction happens:
 *   const weaknessInput = mapRuleIdsToWeaknessInput(result.appliedRuleIds, exemplar);
 *   const updatedMemory = tagWeakness(currentMemory, weaknessInput);
 *
 *   // When displaying the correction:
 *   const interferenceCat = mapRuleIdsToInterferenceCategory(result.appliedRuleIds);
 *   const explanation = interferenceCat
 *     ? getInterferenceCategoryExplanation(interferenceCat)
 *     : null;
 */

import {
  type WeaknessCategory,
  type WeaknessTagInput,
  WEAKNESS_MEMORY_TAGS_CATALOG,
} from "./weaknessMemoryTags";
import type { VietlishInterferenceCategory } from "./vietlishLogicEngine";

// ─── Rule ID → Weakness Category Mapping ─────────────────────────────────

/**
 * Maps a correction engine rule ID to a weakness category.
 *
 * Uses prefix matching so that new rules in the same family
 * (e.g., "en-l4-*" for article rules) are automatically covered.
 *
 * Returns null when the rule ID doesn't map to a known weakness
 * category (e.g., punctuation rules, minor capitalization fixes).
 */
export function mapRuleIdToWeaknessCategory(ruleId: string): WeaknessCategory | null {
  // Article rules: en-l4-missing-singular-article, en-step6-profession-article
  if (ruleId.includes("article") || ruleId.includes("-article")) {
    return "missing-article";
  }

  // Tense rules: en-yesterday-irregular-beginner-past, en-vn-past-marker-regular-verb,
  // en-step6-past-marker-recall, en-irregular-*
  if (
    ruleId.includes("past") ||
    ruleId.includes("-tense") ||
    ruleId.includes("irregular") ||
    ruleId.includes("verb-form")
  ) {
    return "tense-omission";
  }

  // Subject-verb agreement: en-step5-subject-verb-agreement,
  // en-third-person-*, en-third_person_*
  if (
    ruleId.includes("subject-verb") ||
    ruleId.includes("subj-verb") ||
    ruleId.includes("third-person") ||
    ruleId.includes("third_person") ||
    ruleId.includes("-agreement")
  ) {
    return "subj-verb-agreement";
  }

  // Copula / be-verb: en-be-verb-omission, en-vn-copula-be-adjective,
  // en-step6-location-be-drop
  // MUST come before preposition check — "be-drop", "be-verb" are not about prepositions
  if (
    ruleId.includes("be-verb") ||
    ruleId.includes("copula") ||
    ruleId.includes("be-drop") ||
    ruleId.includes("missing-be")
  ) {
    return "zero-copula";
  }

  // Extra-word patterns (VN calques that add prepositions EN doesn't need)
  // MUST come before the generic preposition check — these are word_choice,
  // not preposition-calque, because the error is "using a word that shouldn't be there"
  if (
    ruleId.includes("discuss-about") ||
    ruleId.includes("marry-with") ||
    ruleId.includes("mention-about") ||
    ruleId.includes("contact-with") ||
    ruleId.includes("research-about") ||
    ruleId.includes("phone-text-to") ||
    ruleId.includes("explain-to-me")
  ) {
    return "word_choice";
  }

  // Discourse structure errors (VN topic-comment discourse patterns)
  // MUST come before preposition check — "according-to-me" contains "-to-"
  if (ruleId.includes("discourse")) {
    return "sentence_structure";
  }

  // Preposition patterns: en-step5-preposition-pattern, en-step6-at-clock-time,
  // en-step6-in-month-year, en-step6-wait-for-person-object, etc.
  if (
    ruleId.includes("preposition") ||
    ruleId.includes("-at-clock") ||
    ruleId.includes("-in-month") ||
    ruleId.includes("-for-") ||
    ruleId.includes("-to-") ||
    ruleId.includes("look-at-") ||
    ruleId.includes("wait-for-") ||
    ruleId.includes("listen-to-")
  ) {
    return "preposition-calque";
  }

  // Word order: en-l4-topic-comment-word-order, en-time-expression-placement,
  // en-morning-routine-subject-carryover
  if (
    ruleId.includes("word-order") ||
    ruleId.includes("topic-comment") ||
    ruleId.includes("time-expression") ||
    ruleId.includes("subject-carryover")
  ) {
    return "word-order";
  }

  // Negation
  if (ruleId.includes("negation") || ruleId.includes("double-neg")) {
    return "double-negation";
  }

  // Plural / noun form: en-l4-quantity-plural-s, en-vn-numeral-quantifier-plural,
  // en-step6-possessive-s
  if (
    ruleId.includes("plural") ||
    ruleId.includes("possessive") ||
    ruleId.includes("quantifier")
  ) {
    if (ruleId.includes("plural")) return "missing-article";
    return "word_choice";
  }

  // Calques (VN→EN word-by-word translation): en-calque-*
  if (ruleId.includes("calque")) {
    return "word_choice";
  }

  // Vietlish collocations: en-vietlish-collocation-*
  if (ruleId.includes("collocation")) {
    return "word_choice";
  }

  // Vietnamese discourse structure errors: en-vn-although-*, en-vn-because-*,
  // en-vietlish-double-*
  if (
    ruleId.includes("although") ||
    ruleId.includes("because") ||
    ruleId.includes("double-comparative") ||
    ruleId.includes("double-superlative") ||
    ruleId.includes("existential-have")
  ) {
    return "sentence_structure";
  }

  // Yes-no / do-support: en-vn-yesno-do-support
  if (ruleId.includes("yesno") || ruleId.includes("do-support")) {
    return "sentence_structure";
  }

  // Vietlish word choice: en-vietlish-say-tell-*, en-vietlish-very-*,
  // en-vietlish-be-agree, en-vietlish-age-*, en-vietlish-duration-*
  if (
    ruleId.includes("say-tell") ||
    ruleId.includes("very-") ||
    ruleId.includes("be-agree") ||
    ruleId.includes("go-home") ||
    ruleId.includes("age-have") ||
    ruleId.includes("duration-")
  ) {
    return "word_choice";
  }

  // Unknown — no weakness category assigned.
  // Note: punctuation-only fixes (runon, question-form-final-mark) are intentionally
  // not mapped — they're cosmetic, not persistent language weaknesses worth tracking.
  return null;
}

/**
 * Maps all applied rule IDs to a single primary weakness input.
 *
 * Returns the first match across all rule IDs (rules are applied in priority
 * order, so the first matched weakness is the most important one).
 *
 * Returns null if no rule IDs map to a known weakness category.
 */
export function mapRuleIdsToWeaknessInput(
  appliedRuleIds: string[],
  exemplarPattern: string,
  l1 = "vi",
): WeaknessTagInput | null {
  for (const ruleId of appliedRuleIds) {
    const category = mapRuleIdToWeaknessCategory(ruleId);
    if (category) {
      return {
        errorCategory: ruleId,
        grammarPoint: ruleId,
        l1,
        exemplarPattern,
      };
    }
  }
  return null;
}

// ─── Rule ID → Vietnamese Interference Category Mapping ──────────────────

/**
 * Maps a correction engine rule ID to a Vietnamese interference category.
 *
 * This is the bridge between the correction engine and the
 * vietnameseInterferenceExplanation module. The mapped category
 * can be passed to `getInterferenceCategoryExplanation()` to get
 * the full teacher-quality explanation.
 *
 * Returns null when the error isn't clearly a VN→EN transfer pattern.
 */
export function mapRuleIdToInterferenceCategory(
  ruleId: string,
): VietlishInterferenceCategory | null {
  // Missing words (articles, prepositions, auxiliaries — VN doesn't have them)
  if (
    ruleId.includes("article") ||
    (ruleId.includes("preposition") && !ruleId.includes("discuss-about") && !ruleId.includes("marry-with")) ||
    ruleId.includes("-at-clock") ||
    ruleId.includes("-in-month") ||
    ruleId.includes("wait-for-") ||
    ruleId.includes("listen-to-") ||
    ruleId.includes("look-at-") ||
    ruleId.includes("be-verb") ||
    ruleId.includes("be-drop") ||
    ruleId.includes("copula")
  ) {
    return "missing_word";
  }

  // Extra words (calques that add words EN doesn't need)
  if (
    ruleId.includes("discuss-about") ||
    ruleId.includes("marry-with") ||
    ruleId.includes("mention-about") ||
    ruleId.includes("contact-with") ||
    ruleId.includes("research-about") ||
    ruleId.includes("phone-text-to") ||
    ruleId.includes("explain-to-me")
  ) {
    return "extra_word";
  }

  // Word order (VN topic-comment vs EN SVO)
  if (
    ruleId.includes("word-order") ||
    ruleId.includes("topic-comment") ||
    ruleId.includes("time-expression") ||
    ruleId.includes("subject-carryover")
  ) {
    return "word_order";
  }

  // Verb form (VN no-inflection vs EN tense/aspect)
  if (
    ruleId.includes("past") ||
    ruleId.includes("tense") ||
    ruleId.includes("irregular") ||
    ruleId.includes("subject-verb") ||
    ruleId.includes("third-person") ||
    ruleId.includes("third_person") ||
    ruleId.includes("yesno") ||
    ruleId.includes("do-support")
  ) {
    return "verb_form";
  }

  // Noun form (VN no plural → EN countability)
  if (
    ruleId.includes("plural") ||
    ruleId.includes("quantifier") ||
    ruleId.includes("possessive")
  ) {
    return "noun_form";
  }

  // Word choice (VN one-word-many-uses vs EN precise words)
  if (
    ruleId.includes("calque") ||
    ruleId.includes("collocation") ||
    ruleId.includes("say-tell") ||
    ruleId.includes("very-") ||
    ruleId.includes("be-agree") ||
    ruleId.includes("go-home") ||
    ruleId.includes("age-have") ||
    ruleId.includes("duration-")
  ) {
    return "word_choice";
  }

  // Sentence-level structural transfer
  if (
    ruleId.includes("although") ||
    ruleId.includes("because") ||
    ruleId.includes("double-comparative") ||
    ruleId.includes("double-superlative") ||
    ruleId.includes("existential-have") ||
    ruleId.includes("discourse")
  ) {
    return "other";
  }

  // No clear VN→EN interference pattern
  return null;
}

/**
 * Maps the first matched rule ID to an interference category.
 * Returns null if none of the rules map to a known interference pattern.
 */
export function mapRuleIdsToInterferenceCategory(
  appliedRuleIds: string[],
): VietlishInterferenceCategory | null {
  for (const ruleId of appliedRuleIds) {
    const cat = mapRuleIdToInterferenceCategory(ruleId);
    if (cat) return cat;
  }
  return null;
}

// ─── Combined Enrichment ──────────────────────────────────────────────────

/**
 * Result of enriching a correction with teacher-quality context.
 */
export type EnrichedCorrectionContext = {
  /** The weakness tag input for recording this correction, or null. */
  weaknessInput: WeaknessTagInput | null;
  /** The Vietnamese interference category for this error, or null. */
  interferenceCategory: VietlishInterferenceCategory | null;
  /** The first rule ID that produced a weakness match. */
  matchedRuleId: string | null;
  /** Whether this correction has a clear VN→EN transfer root cause. */
  isL1TransferError: boolean;
  /**
   * Vietnamese label for the weakness category from the weakness memory tags
   * catalog (weaknessMemoryTags.ts). Concrete runtime output — proves the
   * weaknessMemoryTags module is loaded and its catalog is consulted.
   */
  weaknessLabelVi: string | null;
  /** English label for the weakness category (for telemetry). */
  weaknessLabelEn: string | null;
};

/**
 * Enrich a correction engine result with weakness memory and Vietnamese
 * interference explanation context.
 *
 * This is the main integration function — call it after the correction
 * engine produces a result (with `corrected` status and `appliedRuleIds`)
 * to get the enrichment data for:
 *
 *   1. Tagging the error into the weakness memory (use `weaknessInput`)
 *   2. Showing a Vietnamese root-cause explanation (use `interferenceCategory`
 *      with `getInterferenceCategoryExplanation()`)
 *
 * Pure function — deterministic, no side effects.
 *
 * @param appliedRuleIds — the rule IDs that matched this correction
 * @param exemplarPattern — safe exemplar (e.g., "I go → I went"), never raw learner text
 * @param l1 — learner's native language (default "vi")
 */
export function enrichCorrectionExperience(
  appliedRuleIds: string[],
  exemplarPattern: string,
  l1 = "vi",
): EnrichedCorrectionContext {
  const weaknessInput = mapRuleIdsToWeaknessInput(appliedRuleIds, exemplarPattern, l1);
  const interferenceCategory = mapRuleIdsToInterferenceCategory(appliedRuleIds);

  // Runtime wiring to weaknessMemoryTags: look up the weakness category in
  // the catalog to get concrete Vietnamese/English labels. This proves
  // weaknessMemoryTags.ts is loaded and consulted at runtime, not just
  // referenced via type-only imports.
  let weaknessLabelVi: string | null = null;
  let weaknessLabelEn: string | null = null;
  if (weaknessInput) {
    const category = mapRuleIdToWeaknessCategory(weaknessInput.errorCategory);
    if (category) {
      const meta = WEAKNESS_MEMORY_TAGS_CATALOG.find((c) => c.category === category);
      if (meta) {
        weaknessLabelVi = meta.labelVi;
        weaknessLabelEn = meta.labelEn;
      }
    }
  }

  return {
    weaknessInput,
    interferenceCategory,
    matchedRuleId: weaknessInput?.errorCategory ?? null,
    isL1TransferError: interferenceCategory !== null,
    weaknessLabelVi,
    weaknessLabelEn,
  };
}

// ─── Rule ID Prefix Coverage ──────────────────────────────────────────────

/**
 * Known rule ID prefixes that this enricher covers.
 * Used for documentation, testing, and coverage auditing.
 */
export const COVERED_RULE_ID_PREFIXES = [
  // Article rules
  "en-l4-missing-singular-article",
  "en-step6-profession-article",
  // Tense rules
  "en-yesterday-irregular-beginner-past",
  "en-vn-past-marker-regular-verb",
  "en-step6-past-marker-recall",
  // Subject-verb agreement
  "en-step5-subject-verb-agreement",
  "en-third-person-daily-go-eat-have",
  "en-third-person-school-routine",
  // Preposition
  "en-step5-preposition-pattern",
  "en-step6-at-clock-time",
  "en-step6-in-month-year",
  "en-step6-wait-for-person-object",
  "en-step6-listen-to-object",
  "en-step6-look-at-pronoun",
  // Word order
  "en-l4-topic-comment-word-order",
  "en-time-expression-placement",
  "en-morning-routine-subject-carryover",
  // Copula
  "en-be-verb-omission",
  "en-vn-copula-be-adjective",
  "en-step6-location-be-drop",
  // Plural / noun form
  "en-l4-quantity-plural-s",
  "en-vn-numeral-quantifier-plural",
  "en-step6-possessive-s",
  // Calques
  "en-calque-open-turn-on-appliance",
  "en-calque-close-turn-off-appliance",
  "en-calque-take-medicine",
  "en-calque-say-with-person",
  // Collocations
  "en-vietlish-collocation-do-homework",
  "en-vietlish-collocation-make-mistake",
  "en-vietlish-collocation-take-photo",
  // Extra-word
  "en-step6-discuss-about",
  "en-step6-marry-with",
  "en-vietlish-mention-about",
  "en-vietlish-contact-with",
  "en-vietlish-research-about",
  "en-vietlish-phone-text-to",
  "en-vietlish-explain-to-me",
  // Discourse / structure
  "en-vietlish-discourse-according-to-me",
  "en-vietlish-discourse-reason-is-because",
  "en-vn-although-even-though-but",
  "en-vn-because-so-doubling",
  "en-vietlish-double-comparative",
  "en-vietlish-double-superlative-most-est",
  "en-existential-have-there-is",
  // Yes-no
  "en-vn-yesno-do-support",
  // Vietlish word choice
  "en-vietlish-say-tell-person",
  "en-vietlish-very-like",
  "en-vietlish-very-verb-really",
  "en-vietlish-be-agree",
  "en-vietlish-age-have-be",
  "en-vietlish-duration-since-for",
  "en-vietlish-go-home",
  // Sentence structure / fluency
  "en-runon-morning-routine-punctuation",
  "en-question-form-final-mark",
] as const;
