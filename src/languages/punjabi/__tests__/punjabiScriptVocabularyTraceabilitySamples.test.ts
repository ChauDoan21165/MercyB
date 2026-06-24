// src/languages/punjabi/__tests__/punjabiScriptVocabularyTraceabilitySamples.test.ts
//
// Structural tests for Punjabi script/vocabulary traceability samples.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SAMPLE_ITEMS,
  PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SAMPLES,
  PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SCOPE,
  type PunjabiTraceabilityFocus,
} from "@/languages/punjabi/scriptVocabularyTraceabilitySamples";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_FOCUS: ReadonlyArray<PunjabiTraceabilityFocus> = [
  "gurmukhi_forms",
  "romanization_bridge",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "service_vocabulary",
  "high_frequency_verbs",
  "collocations",
  "shahmukhi_awareness",
  "pre_integration_verification",
];

describe("Punjabi script vocabulary traceability samples", () => {
  it("is app-consumable sectioned TypeScript traceability data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SAMPLES.length).toBe(REQUIRED_FOCUS.length);
    for (const section of PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SAMPLES) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.traceabilityGoal_vi.trim().length).toBeGreaterThan(40);
      expect(section.traceabilityGoal_en.trim().length).toBeGreaterThan(40);
      expect(section.samples.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 62 traceability focus areas", () => {
    const focus = new Set(PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SAMPLES.map((section) => section.focus));
    for (const required of REQUIRED_FOCUS) {
      expect(focus.has(required), `missing ${required}`).toBe(true);
    }
  });

  it("has enough compact traceability samples to be useful", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SAMPLE_ITEMS.length).toBeGreaterThanOrEqual(24);
    expect(PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SAMPLE_ITEMS.length).toBeLessThanOrEqual(55);
  });

  it("uses Gurmukhi primary with Vietnamese and English merge guidance", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SAMPLE_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.traceability_vi.trim().length, `traceability vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.traceability_en.trim().length, `traceability en for ${item.id}`).toBeGreaterThan(25);
      expect(item.expected_vi.trim().length, `expected vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.expected_en.trim().length, `expected en for ${item.id}`).toBeGreaterThan(25);
      expect(item.traceabilityGuard_vi.trim().length, `guard vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.traceabilityGuard_en.trim().length, `guard en for ${item.id}`).toBeGreaterThan(25);
    }
  });

  it("keeps ids unique and focus aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SAMPLES) {
      for (const sample of section.samples) {
        expect(ids.has(sample.id), `duplicate id: ${sample.id}`).toBe(false);
        expect(sample.focus).toBe(section.focus);
        ids.add(sample.id);
      }
    }
  });

  it("includes romanization, learner traps, Canada examples, merge candidates, and pre-integration markers", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SAMPLE_ITEMS.filter((item) => item.romanization).length).toBeGreaterThanOrEqual(24);
    expect(PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SAMPLE_ITEMS.filter((item) => item.learnerTrap).length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SAMPLE_ITEMS.filter((item) => item.canadaPractical).length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SAMPLE_ITEMS.filter((item) => item.traceabilityCandidate).length).toBeGreaterThanOrEqual(9);
    expect(PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SAMPLE_ITEMS.filter((item) => item.preIntegration).length).toBeGreaterThanOrEqual(7);
  });

  it("covers required script and vocabulary examples", () => {
    const blob = PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SAMPLE_ITEMS
      .map((item) => `${item.focus} ${item.stage} ${item.gurmukhi} ${item.romanization ?? ""} ${item.traceability_vi} ${item.traceability_en} ${item.expected_vi} ${item.expected_en}`)
      .join(" ");
    expect(blob).toMatch(/ਪੰਜਾਬੀ|ਪੜ੍ਹੋ/);
    expect(blob).toMatch(/ਫਲ|ਵੱਡਾ|ਸ਼ਹਿਰ/);
    expect(blob).toMatch(/ਕਿ \/ ਕੀ|ਕੁ \/ ਕੂ|ਕੇ \/ ਕੈ \/ ਕੌ/);
    expect(blob).toMatch(/ਬੱਸ ਅੱਡਾ|ਮਾਂ \/ ਪੰਜਾਬ/);
    expect(blob).toMatch(/ਨਿਕਾਸ|ਐਮਰਜੈਂਸੀ|ਫਾਰਮੇਸੀ/);
    expect(blob).toMatch(/ਦਵਾਈ|ਕਿਰਾਇਆ|ਪਛਾਣ ਪੱਤਰ/);
    expect(blob).toMatch(/ਕਰਨਾ|ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ|ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ/);
    expect(blob).toMatch(/ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ|ਫਾਰਮ ਭਰਨਾ|ਗਲਤੀ ਠੀਕ ਕਰਨਾ/);
    expect(blob).toMatch(/ਗੁਰਮੁਖੀ|ਅੰਤਿਮ ਤਾਲਾ|ਮੁੜ ਜਾਂਚ/);
  });

  it("uses traceability, traceability, runner-readiness, pre-integration, and sanity stages", () => {
    const stages = new Set(PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SAMPLE_ITEMS.map((item) => item.stage));
    expect(stages.has("pre_a11_traceability")).toBe(true);
    expect(stages.has("evidence_receipt")).toBe(true);
    expect(stages.has("completion_record")).toBe(true);
    expect(stages.has("pre_integration")).toBe(true);
    expect(stages.has("sanity")).toBe(true);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SAMPLE_ITEMS.filter((item) => item.focus === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SCOPE.vi,
      PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SCOPE.en,
      ...shahmukhi.map((item) => `${item.traceability_vi} ${item.traceability_en} ${item.expected_vi} ${item.expected_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/shahmukhi awareness|shahmukhi chỉ là awareness/);
    expect(blob).toMatch(/full shahmukhi course|khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts into traceability data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SCOPE.traceabilityDataOnly).toBe(true);
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_TRACEABILITY_SAMPLES).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio|a11 integration|ci config/);
  });
});
