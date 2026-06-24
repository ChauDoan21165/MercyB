// src/languages/punjabi/__tests__/punjabiScriptVocabularySealSamples.test.ts
//
// Structural tests for Punjabi script/vocabulary seal samples.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_SEAL_ITEMS,
  PUNJABI_SCRIPT_VOCABULARY_SEAL_SAMPLES,
  PUNJABI_SCRIPT_VOCABULARY_SEAL_SCOPE,
  type PunjabiSealFocus,
} from "@/languages/punjabi/scriptVocabularySealSamples";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_FOCUS: ReadonlyArray<PunjabiSealFocus> = [
  "gurmukhi_primary",
  "romanization_bridge",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "service_vocabulary",
  "high_frequency_verbs",
  "collocations",
  "shahmukhi_awareness",
  "seal_closure",
];

describe("Punjabi script vocabulary seal samples", () => {
  it("is app-consumable sectioned TypeScript seal data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_SEAL_SAMPLES.length).toBe(REQUIRED_FOCUS.length);
    for (const section of PUNJABI_SCRIPT_VOCABULARY_SEAL_SAMPLES) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.sealGoal_vi.trim().length).toBeGreaterThan(40);
      expect(section.sealGoal_en.trim().length).toBeGreaterThan(40);
      expect(section.samples.length).toBeGreaterThan(0);
    }
  });

  it("covers all WAVE52 seal focus areas", () => {
    const focus = new Set(PUNJABI_SCRIPT_VOCABULARY_SEAL_SAMPLES.map((section) => section.focus));
    for (const required of REQUIRED_FOCUS) {
      expect(focus.has(required), `missing ${required}`).toBe(true);
    }
  });

  it("has enough compact seal samples to be useful", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_SEAL_ITEMS.length).toBeGreaterThanOrEqual(19);
    expect(PUNJABI_SCRIPT_VOCABULARY_SEAL_ITEMS.length).toBeLessThanOrEqual(40);
  });

  it("uses Gurmukhi primary with Vietnamese and English seal guidance", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_SEAL_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.seal_vi.trim().length, `seal vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.seal_en.trim().length, `seal en for ${item.id}`).toBeGreaterThan(25);
      expect(item.expected_vi.trim().length, `expected vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.expected_en.trim().length, `expected en for ${item.id}`).toBeGreaterThan(25);
    }
  });

  it("keeps ids unique and focus aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_VOCABULARY_SEAL_SAMPLES) {
      for (const item of section.samples) {
        expect(ids.has(item.id), `duplicate id: ${item.id}`).toBe(false);
        expect(item.focus).toBe(section.focus);
        ids.add(item.id);
      }
    }
  });

  it("includes romanization, traps, Canada examples, and ship-candidate flags", () => {
    const romanized = PUNJABI_SCRIPT_VOCABULARY_SEAL_ITEMS.filter((item) => item.romanization);
    const traps = PUNJABI_SCRIPT_VOCABULARY_SEAL_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_SCRIPT_VOCABULARY_SEAL_ITEMS.filter((item) => item.canadaPractical);
    const shipCandidate = PUNJABI_SCRIPT_VOCABULARY_SEAL_ITEMS.filter((item) => item.shipCandidate);
    expect(romanized.length).toBeGreaterThanOrEqual(18);
    expect(traps.length).toBeGreaterThanOrEqual(7);
    expect(canada.length).toBeGreaterThanOrEqual(7);
    expect(shipCandidate.length).toBeGreaterThanOrEqual(6);
  });

  it("covers bridge limits, signs, services, verbs, collocations, and closure items", () => {
    const blob = PUNJABI_SCRIPT_VOCABULARY_SEAL_ITEMS
      .map((item) => `${item.focus} ${item.stage} ${item.gurmukhi} ${item.romanization ?? ""} ${item.seal_vi} ${item.seal_en} ${item.expected_vi} ${item.expected_en}`)
      .join(" ");
    expect(blob).toMatch(/ਪੰਜਾਬੀ|ਗੁਰਮੁਖੀ ਪੜ੍ਹੋ/);
    expect(blob).toMatch(/ਫਲ|ਵੱਡਾ/);
    expect(blob).toMatch(/ਕਿ \/ ਕੀ|ਕੇ \/ ਕੈ \/ ਕੌ/);
    expect(blob).toMatch(/ਬੱਸ ਅੱਡਾ|ਮਾਂ \/ ਪੰਜਾਬ/);
    expect(blob).toMatch(/ਨਿਕਾਸ|ਐਮਰਜੈਂਸੀ/);
    expect(blob).toMatch(/ਫਾਰਮ ਭਰਨਾ|ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ/);
    expect(blob).toMatch(/ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ|ਮੈਂ ਜਾਂਦਾ ਹਾਂ/);
    expect(blob).toMatch(/ਦਵਾਈ ਲੈਣਾ|ਕਿਰਾਇਆ ਦੇਣਾ/);
    expect(blob).toMatch(/ਮੁਹਰ ਲਗਾਉਣਾ|ਅੰਤਿਮ ਜਾਂਚ/);
  });

  it("uses pre-A11-seal, snapshot, closure-packet, pre-integration, and regression stages", () => {
    const stages = new Set(PUNJABI_SCRIPT_VOCABULARY_SEAL_ITEMS.map((item) => item.stage));
    expect(stages.has("pre_a11_seal")).toBe(true);
    expect(stages.has("snapshot")).toBe(true);
    expect(stages.has("closure_packet")).toBe(true);
    expect(stages.has("pre_integration")).toBe(true);
    expect(stages.has("regression")).toBe(true);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_SEAL_ITEMS.filter((item) => item.focus === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_VOCABULARY_SEAL_SCOPE.vi,
      PUNJABI_SCRIPT_VOCABULARY_SEAL_SCOPE.en,
      ...shahmukhi.map((item) => `${item.seal_vi} ${item.seal_en} ${item.expected_vi} ${item.expected_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/shahmukhi awareness|shahmukhi chỉ là awareness/);
    expect(blob).toMatch(/not become a full shahmukhi course|không biến thành khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts into seal data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_SEAL_SCOPE.sealDataOnly).toBe(true);
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_SEAL_SAMPLES).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio|ci config/);
  });
});
