// src/languages/punjabi/__tests__/punjabiScriptVocabularyMergeReadinessSamples.test.ts
//
// Structural tests for Punjabi script/vocabulary merge-readiness samples.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLE_ITEMS,
  PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLES,
  PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SCOPE,
  type PunjabiMergeReadinessFocus,
} from "@/languages/punjabi/scriptVocabularyMergeReadinessSamples";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_FOCUS: ReadonlyArray<PunjabiMergeReadinessFocus> = [
  "gurmukhi_primary",
  "romanization_bridge",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "service_vocabulary",
  "high_frequency_verbs",
  "collocations",
  "shahmukhi_awareness",
  "merge_readiness",
];

describe("Punjabi script vocabulary merge-readiness samples", () => {
  it("is app-consumable sectioned TypeScript merge data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLES.length).toBe(REQUIRED_FOCUS.length);
    for (const section of PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLES) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.mergeGoal_vi.trim().length).toBeGreaterThan(40);
      expect(section.mergeGoal_en.trim().length).toBeGreaterThan(40);
      expect(section.samples.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 32 merge-readiness focus areas", () => {
    const focus = new Set(PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLES.map((section) => section.focus));
    for (const required of REQUIRED_FOCUS) {
      expect(focus.has(required), `missing ${required}`).toBe(true);
    }
  });

  it("has enough compact merge-readiness samples to be useful", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLE_ITEMS.length).toBeGreaterThanOrEqual(24);
    expect(PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLE_ITEMS.length).toBeLessThanOrEqual(55);
  });

  it("uses Gurmukhi primary with Vietnamese and English merge guidance", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLE_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.mergeUse_vi.trim().length, `merge use vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.mergeUse_en.trim().length, `merge use en for ${item.id}`).toBeGreaterThan(25);
      expect(item.expected_vi.trim().length, `expected vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.expected_en.trim().length, `expected en for ${item.id}`).toBeGreaterThan(25);
      expect(item.readinessCheck_vi.trim().length, `check vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.readinessCheck_en.trim().length, `check en for ${item.id}`).toBeGreaterThan(25);
    }
  });

  it("keeps ids unique and focus aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLES) {
      for (const sample of section.samples) {
        expect(ids.has(sample.id), `duplicate id: ${sample.id}`).toBe(false);
        expect(sample.focus).toBe(section.focus);
        ids.add(sample.id);
      }
    }
  });

  it("includes romanization, traps, Canada examples, pre-integration, and final regression markers", () => {
    const romanized = PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLE_ITEMS.filter((item) => item.romanization);
    const traps = PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLE_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLE_ITEMS.filter((item) => item.canadaPractical);
    const preIntegration = PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLE_ITEMS.filter((item) => item.preIntegration);
    const finalRegression = PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLE_ITEMS.filter((item) => item.finalRegression);
    expect(romanized.length).toBeGreaterThanOrEqual(24);
    expect(traps.length).toBeGreaterThanOrEqual(10);
    expect(canada.length).toBeGreaterThanOrEqual(10);
    expect(preIntegration.length).toBeGreaterThanOrEqual(7);
    expect(finalRegression.length).toBeGreaterThanOrEqual(10);
  });

  it("covers script, bridge, vowels, marks, signs, services, verbs, collocations, and merge sanity", () => {
    const blob = PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLE_ITEMS
      .map((item) => `${item.focus} ${item.stage} ${item.gurmukhi} ${item.romanization ?? ""} ${item.mergeUse_vi} ${item.mergeUse_en} ${item.expected_vi} ${item.expected_en}`)
      .join(" ");
    expect(blob).toMatch(/ਪੰਜਾਬੀ|ਪੜ੍ਹੋ/);
    expect(blob).toMatch(/ਫਲ|ਵੱਡਾ|ਸ਼ਹਿਰ/);
    expect(blob).toMatch(/ਕਿ \/ ਕੀ|ਕੁ \/ ਕੂ|ਕੇ \/ ਕੈ \/ ਕੌ/);
    expect(blob).toMatch(/ਬੱਸ ਅੱਡਾ|ਮਾਂ \/ ਪੰਜਾਬ/);
    expect(blob).toMatch(/ਨਿਕਾਸ|ਐਮਰਜੈਂਸੀ|ਫਾਰਮੇਸੀ/);
    expect(blob).toMatch(/ਦਵਾਈ|ਕਿਰਾਇਆ|ਪਛਾਣ ਪੱਤਰ/);
    expect(blob).toMatch(/ਕਰਨਾ|ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ|ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ/);
    expect(blob).toMatch(/ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ|ਫਾਰਮ ਭਰਨਾ|ਗਲਤੀ ਠੀਕ ਕਰਨਾ/);
    expect(blob).toMatch(/ਗੁਰਮੁਖੀ|ਮਿਲਾਣ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂਚ|ਅੰਤਿਮ ਮਿਲਾਣ ਤਿਆਰੀ/);
  });

  it("uses merge-readiness, final-regression, pre-integration, and sanity stages", () => {
    const stages = new Set(PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLE_ITEMS.map((item) => item.stage));
    expect(stages.has("merge_readiness")).toBe(true);
    expect(stages.has("final_regression")).toBe(true);
    expect(stages.has("pre_integration")).toBe(true);
    expect(stages.has("sanity")).toBe(true);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLE_ITEMS.filter((item) => item.focus === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SCOPE.vi,
      PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SCOPE.en,
      ...shahmukhi.map((item) => `${item.mergeUse_vi} ${item.mergeUse_en} ${item.expected_vi} ${item.expected_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/shahmukhi awareness|shahmukhi chỉ là awareness/);
    expect(blob).toMatch(/full shahmukhi course|khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts into merge data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SCOPE.mergeDataOnly).toBe(true);
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLES).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio|a11|ci config/);
  });
});
