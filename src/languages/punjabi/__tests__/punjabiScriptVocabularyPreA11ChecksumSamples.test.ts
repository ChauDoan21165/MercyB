// src/languages/punjabi/__tests__/punjabiScriptVocabularyPreA11ChecksumSamples.test.ts
//
// Structural tests for Punjabi script/vocabulary pre-A11-checksum samples.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLE_ITEMS,
  PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLES,
  PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SCOPE,
  type PunjabiPreA11ChecksumFocus,
} from "@/languages/punjabi/scriptVocabularyPreA11ChecksumSamples";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_FOCUS: ReadonlyArray<PunjabiPreA11ChecksumFocus> = [
  "gurmukhi_primary",
  "romanization_bridge_limits",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "service_vocabulary",
  "high_frequency_verbs",
  "collocations",
  "shahmukhi_awareness",
  "pre_integration_readiness",
];

describe("Punjabi script vocabulary pre A11 checksum samples", () => {
  it("is app-consumable sectioned TypeScript pre-A11 checksum data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLES.length).toBe(REQUIRED_FOCUS.length);
    for (const section of PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLES) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.checksumGoal_vi.trim().length).toBeGreaterThan(40);
      expect(section.checksumGoal_en.trim().length).toBeGreaterThan(40);
      expect(section.samples.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 48 pre-A11-checksum focus areas", () => {
    const focus = new Set(PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLES.map((section) => section.focus));
    for (const required of REQUIRED_FOCUS) {
      expect(focus.has(required), `missing ${required}`).toBe(true);
    }
  });

  it("has enough compact pre-A11 checksum samples to be useful", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLE_ITEMS.length).toBeGreaterThanOrEqual(24);
    expect(PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLE_ITEMS.length).toBeLessThanOrEqual(55);
  });

  it("uses Gurmukhi primary with Vietnamese and English pre-A11 checksum guidance", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLE_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.checksumCheck_vi.trim().length, `pre-A11 checksum vi for ${item.id}`).toBeGreaterThan(20);
      expect(item.checksumCheck_en.trim().length, `pre-A11 checksum en for ${item.id}`).toBeGreaterThan(20);
      expect(item.passIf_vi.trim().length, `pass vi for ${item.id}`).toBeGreaterThan(20);
      expect(item.passIf_en.trim().length, `pass en for ${item.id}`).toBeGreaterThan(20);
      expect(item.guardrail_vi.trim().length, `guard vi for ${item.id}`).toBeGreaterThan(20);
      expect(item.guardrail_en.trim().length, `guard en for ${item.id}`).toBeGreaterThan(20);
    }
  });

  it("keeps ids unique and focus aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLES) {
      for (const sample of section.samples) {
        expect(ids.has(sample.id), `duplicate id: ${sample.id}`).toBe(false);
        expect(sample.focus).toBe(section.focus);
        ids.add(sample.id);
      }
    }
  });

  it("includes romanization, traps, Canada examples, pre A11 checksum, and pre-integration markers", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLE_ITEMS.filter((item) => item.romanization).length).toBeGreaterThanOrEqual(24);
    expect(PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLE_ITEMS.filter((item) => item.learnerTrap).length).toBeGreaterThanOrEqual(8);
    expect(PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLE_ITEMS.filter((item) => item.canadaPractical).length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLE_ITEMS.filter((item) => item.checksumReady).length).toBeGreaterThanOrEqual(8);
    expect(PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLE_ITEMS.filter((item) => item.preIntegration).length).toBeGreaterThanOrEqual(7);
  });

  it("covers the required script and vocabulary pre-A11 checksum content", () => {
    const blob = PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLE_ITEMS
      .map((item) => `${item.focus} ${item.stage} ${item.gurmukhi} ${item.romanization ?? ""} ${item.checksumCheck_vi} ${item.checksumCheck_en} ${item.passIf_vi} ${item.passIf_en}`)
      .join(" ");
    expect(blob).toMatch(/ਪੰਜਾਬੀ|ਲਿਖੋ/);
    expect(blob).toMatch(/ਫਲ|ਵੱਡਾ|ਸ਼ਹਿਰ/);
    expect(blob).toMatch(/ਕਿ \/ ਕੀ|ਕੁ \/ ਕੂ|ਕੇ \/ ਕੈ \/ ਕੌ/);
    expect(blob).toMatch(/ਬੱਸ ਅੱਡਾ|ਮਾਂ \/ ਪੰਜਾਬ/);
    expect(blob).toMatch(/ਨਿਕਾਸ|ਐਮਰਜੈਂਸੀ|ਫਾਰਮੇਸੀ/);
    expect(blob).toMatch(/ਦਵਾਈ|ਕਿਰਾਇਆ|ਪਛਾਣ ਪੱਤਰ/);
    expect(blob).toMatch(/ਕਰਨਾ|ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ|ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ/);
    expect(blob).toMatch(/ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ|ਫਾਰਮ ਭਰਨਾ|ਗਲਤੀ ਠੀਕ ਕਰਨਾ/);
  });

  it("uses pre-A11-checksum, pipeline-readiness, CI-readiness, pre-integration, and sanity stages", () => {
    const stages = new Set(PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLE_ITEMS.map((item) => item.stage));
    expect(stages.has("pre_a11_checksum")).toBe(true);
    expect(stages.has("pipeline_readiness")).toBe(true);
    expect(stages.has("ci_readiness")).toBe(true);
    expect(stages.has("pre_integration")).toBe(true);
    expect(stages.has("sanity")).toBe(true);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLE_ITEMS.filter((item) => item.focus === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SCOPE.vi,
      PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SCOPE.en,
      ...shahmukhi.map((item) => `${item.checksumCheck_vi} ${item.checksumCheck_en} ${item.passIf_vi} ${item.passIf_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/shahmukhi awareness|shahmukhi chỉ là awareness/);
    expect(blob).toMatch(/full shahmukhi lesson|lesson shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SCOPE.preA11ChecksumDataOnly).toBe(true);
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLES).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio|a11 integration|ci config/);
  });
});
