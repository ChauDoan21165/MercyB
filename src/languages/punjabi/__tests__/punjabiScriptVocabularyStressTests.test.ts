import { describe, expect, it } from "vitest";

import scriptVocabularyStressTests, {
  PUNJABI_SCRIPT_VOCABULARY_STRESS_SCOPE,
  PUNJABI_SCRIPT_VOCABULARY_STRESS_TESTS,
  type PunjabiScriptVocabularyStressCategory,
  punjabiScriptVocabularyStressTestsByCategory,
} from "@/languages/punjabi/scriptVocabularyStressTests";

const GURMUKHI = /[਀-੿]/;
const REQUIRED_CATEGORIES: PunjabiScriptVocabularyStressCategory[] = [
  "similar_letters",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "service_words",
  "high_frequency_verbs",
  "collocations",
  "romanization_reduction",
];

describe("Punjabi script vocabulary stress tests", () => {
  it("exports compact app-consumable stress-test data", () => {
    expect(scriptVocabularyStressTests).toBe(PUNJABI_SCRIPT_VOCABULARY_STRESS_TESTS);
    expect(PUNJABI_SCRIPT_VOCABULARY_STRESS_TESTS.length).toBeGreaterThanOrEqual(REQUIRED_CATEGORIES.length);
    expect(PUNJABI_SCRIPT_VOCABULARY_STRESS_TESTS.length).toBeLessThanOrEqual(12);
    expect(PUNJABI_SCRIPT_VOCABULARY_STRESS_SCOPE.name).toBe("Punjabi Script Vocabulary Stress Tests");
  });

  it("covers the required final-risk categories", () => {
    const categories = new Set(PUNJABI_SCRIPT_VOCABULARY_STRESS_TESTS.map((item) => item.category));
    for (const category of REQUIRED_CATEGORIES) {
      expect(categories.has(category), `missing category: ${category}`).toBe(true);
      expect(punjabiScriptVocabularyStressTestsByCategory(category).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("keeps Gurmukhi primary with Vietnamese and English explanations", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_STRESS_TESTS) {
      expect(item.id).toMatch(/^pa-script-stress-/);
      expect(item.prompt_pa).toMatch(GURMUKHI);
      expect(item.answer_pa).toMatch(GURMUKHI);
      expect(item.meaning_vi.length).toBeGreaterThan(6);
      expect(item.meaning_en.length).toBeGreaterThan(6);
      expect(item.explanation_vi.length).toBeGreaterThan(20);
      expect(item.explanation_en.length).toBeGreaterThan(20);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada/u);
      expect(item.canada_example_en).toMatch(/Canada|Canadian/u);
      expect(item.learner_trap_vi.length).toBeGreaterThan(20);
      expect(item.learner_trap_en.length).toBeGreaterThan(20);
    }
  });

  it("includes final QA styles and romanization reduction", () => {
    const riskLevels = new Set(PUNJABI_SCRIPT_VOCABULARY_STRESS_TESTS.map((item) => item.riskLevel));
    expect(riskLevels.has("stress_test")).toBe(true);
    expect(riskLevels.has("final_risk")).toBe(true);
    expect(riskLevels.has("final_qa")).toBe(true);
    expect(PUNJABI_SCRIPT_VOCABULARY_STRESS_TESTS.some((item) => item.romanization === undefined)).toBe(true);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_STRESS_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_SCRIPT_VOCABULARY_STRESS_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_SCRIPT_VOCABULARY_STRESS_SCOPE,
      tests: PUNJABI_SCRIPT_VOCABULARY_STRESS_TESTS,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });

  it("keeps restricted integration concepts out", () => {
    const allContent = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_STRESS_TESTS);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
