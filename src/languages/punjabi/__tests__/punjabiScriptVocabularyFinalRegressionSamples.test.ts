// src/languages/punjabi/__tests__/punjabiScriptVocabularyFinalRegressionSamples.test.ts
//
// Structural tests for Punjabi script/vocabulary final regression samples.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLE_ITEMS,
  PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLES,
  PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SCOPE,
  type PunjabiFinalRegressionFocus,
} from "@/languages/punjabi/scriptVocabularyFinalRegressionSamples";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_FOCUS: ReadonlyArray<PunjabiFinalRegressionFocus> = [
  "gurmukhi_primary",
  "romanization_bridge",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "service_vocabulary",
  "high_frequency_verbs",
  "collocations",
  "shahmukhi_awareness",
  "pre_integration_sanity",
];

describe("Punjabi script vocabulary final regression samples", () => {
  it("is app-consumable sectioned TypeScript regression data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLES.length).toBe(REQUIRED_FOCUS.length);
    for (const section of PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLES) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.regressionGoal_vi.trim().length).toBeGreaterThan(40);
      expect(section.regressionGoal_en.trim().length).toBeGreaterThan(40);
      expect(section.samples.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 31 regression focus areas", () => {
    const focus = new Set(PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLES.map((section) => section.focus));
    for (const required of REQUIRED_FOCUS) {
      expect(focus.has(required), `missing ${required}`).toBe(true);
    }
  });

  it("has enough compact regression samples to be useful", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLE_ITEMS.length).toBeGreaterThanOrEqual(24);
    expect(PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLE_ITEMS.length).toBeLessThanOrEqual(55);
  });

  it("uses Gurmukhi primary with Vietnamese and English regression guidance", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLE_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.scenario_vi.trim().length, `scenario vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.scenario_en.trim().length, `scenario en for ${item.id}`).toBeGreaterThan(25);
      expect(item.expected_vi.trim().length, `expected vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.expected_en.trim().length, `expected en for ${item.id}`).toBeGreaterThan(25);
      expect(item.regressionCheck_vi.trim().length, `check vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.regressionCheck_en.trim().length, `check en for ${item.id}`).toBeGreaterThan(25);
    }
  });

  it("keeps ids unique and focus aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLES) {
      for (const sample of section.samples) {
        expect(ids.has(sample.id), `duplicate id: ${sample.id}`).toBe(false);
        expect(sample.focus).toBe(section.focus);
        ids.add(sample.id);
      }
    }
  });

  it("includes romanization, traps, Canada examples, pre-integration, and final regression markers", () => {
    const romanized = PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLE_ITEMS.filter((item) => item.romanization);
    const traps = PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLE_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLE_ITEMS.filter((item) => item.canadaPractical);
    const preIntegration = PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLE_ITEMS.filter((item) => item.preIntegration);
    const finalRegression = PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLE_ITEMS.filter((item) => item.finalRegression);
    expect(romanized.length).toBeGreaterThanOrEqual(24);
    expect(traps.length).toBeGreaterThanOrEqual(10);
    expect(canada.length).toBeGreaterThanOrEqual(10);
    expect(preIntegration.length).toBeGreaterThanOrEqual(7);
    expect(finalRegression.length).toBeGreaterThanOrEqual(12);
  });

  it("covers script, bridge, vowels, marks, signs, services, verbs, collocations, and sanity", () => {
    const blob = PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLE_ITEMS
      .map((item) => `${item.focus} ${item.mode} ${item.gurmukhi} ${item.romanization ?? ""} ${item.scenario_vi} ${item.scenario_en} ${item.expected_vi} ${item.expected_en}`)
      .join(" ");
    expect(blob).toMatch(/ਪੰਜਾਬੀ|ਪੜ੍ਹੋ/);
    expect(blob).toMatch(/ਫਲ|ਵੱਡਾ|ਸ਼ਹਿਰ/);
    expect(blob).toMatch(/ਕਿ \/ ਕੀ|ਕੁ \/ ਕੂ|ਕੇ \/ ਕੈ \/ ਕੌ/);
    expect(blob).toMatch(/ਬੱਸ ਅੱਡਾ|ਮਾਂ \/ ਪੰਜਾਬ/);
    expect(blob).toMatch(/ਨਿਕਾਸ|ਐਮਰਜੈਂਸੀ|ਫਾਰਮੇਸੀ/);
    expect(blob).toMatch(/ਦਵਾਈ|ਕਿਰਾਇਆ/);
    expect(blob).toMatch(/ਕਰਨਾ|ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ|ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ/);
    expect(blob).toMatch(/ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ|ਫਾਰਮ ਭਰਨਾ|ਗਲਤੀ ਠੀਕ ਕਰਨਾ/);
    expect(blob).toMatch(/ਗੁਰਮੁਖੀ|ਅੰਤਿਮ ਜਾਂਚ|ਮੁੜ ਜਾਂਚ/);
  });

  it("uses final-regression, sanity, pre-integration, and readiness modes", () => {
    const modes = new Set(PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLE_ITEMS.map((item) => item.mode));
    expect(modes.has("final_regression")).toBe(true);
    expect(modes.has("sanity")).toBe(true);
    expect(modes.has("pre_integration")).toBe(true);
    expect(modes.has("readiness")).toBe(true);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLE_ITEMS.filter((item) => item.focus === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SCOPE.vi,
      PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SCOPE.en,
      ...shahmukhi.map((item) => `${item.scenario_vi} ${item.scenario_en} ${item.expected_vi} ${item.expected_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/shahmukhi awareness|shahmukhi chỉ là awareness/);
    expect(blob).toMatch(/not a full course|không phải khóa đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts into regression data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SCOPE.regressionDataOnly).toBe(true);
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLES).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio|a11|ci config/);
  });
});
