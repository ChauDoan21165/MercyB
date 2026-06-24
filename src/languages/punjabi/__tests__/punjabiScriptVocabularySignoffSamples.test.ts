// src/languages/punjabi/__tests__/punjabiScriptVocabularySignoffSamples.test.ts
//
// Structural tests for Punjabi script/vocabulary signoff samples.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_ITEMS,
  PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_SAMPLES,
  PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_SCOPE,
  type PunjabiSignoffFocus,
} from "@/languages/punjabi/scriptVocabularySignoffSamples";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_FOCUS: ReadonlyArray<PunjabiSignoffFocus> = [
  "gurmukhi_primary",
  "romanization_bridge",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "service_vocabulary",
  "high_frequency_verbs",
  "collocations",
  "shahmukhi_awareness",
  "signoff_closure",
];

describe("Punjabi script vocabulary signoff samples", () => {
  it("is app-consumable sectioned TypeScript signoff data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_SAMPLES.length).toBe(REQUIRED_FOCUS.length);
    for (const section of PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_SAMPLES) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.signoffGoal_vi.trim().length).toBeGreaterThan(40);
      expect(section.signoffGoal_en.trim().length).toBeGreaterThan(40);
      expect(section.samples.length).toBeGreaterThan(0);
    }
  });

  it("covers all WAVE53 signoff focus areas", () => {
    const focus = new Set(PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_SAMPLES.map((section) => section.focus));
    for (const required of REQUIRED_FOCUS) {
      expect(focus.has(required), `missing ${required}`).toBe(true);
    }
  });

  it("has enough compact signoff samples to be useful", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_ITEMS.length).toBeGreaterThanOrEqual(19);
    expect(PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_ITEMS.length).toBeLessThanOrEqual(40);
  });

  it("uses Gurmukhi primary with Vietnamese and English signoff guidance", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.signoff_vi.trim().length, `signoff vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.signoff_en.trim().length, `signoff en for ${item.id}`).toBeGreaterThan(25);
      expect(item.expected_vi.trim().length, `expected vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.expected_en.trim().length, `expected en for ${item.id}`).toBeGreaterThan(25);
    }
  });

  it("keeps ids unique and focus aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_SAMPLES) {
      for (const item of section.samples) {
        expect(ids.has(item.id), `duplicate id: ${item.id}`).toBe(false);
        expect(item.focus).toBe(section.focus);
        ids.add(item.id);
      }
    }
  });

  it("includes romanization, traps, Canada examples, and signoff flags", () => {
    const romanized = PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_ITEMS.filter((item) => item.romanization);
    const traps = PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_ITEMS.filter((item) => item.canadaPractical);
    const signedOff = PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_ITEMS.filter((item) => item.signedOff);
    expect(romanized.length).toBeGreaterThanOrEqual(18);
    expect(traps.length).toBeGreaterThanOrEqual(6);
    expect(canada.length).toBeGreaterThanOrEqual(7);
    expect(signedOff.length).toBeGreaterThanOrEqual(6);
  });

  it("covers bridge limits, signs, services, verbs, collocations, and closure items", () => {
    const blob = PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_ITEMS
      .map((item) => `${item.focus} ${item.stage} ${item.gurmukhi} ${item.romanization ?? ""} ${item.signoff_vi} ${item.signoff_en} ${item.expected_vi} ${item.expected_en}`)
      .join(" ");
    expect(blob).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ|ਕਿਰਪਾ ਕਰਕੇ ਪੜ੍ਹੋ/);
    expect(blob).toMatch(/ਘਰ|ਪਾਣੀ/);
    expect(blob).toMatch(/ਸਿ \/ ਸੀ|ਮੋੜ \/ ਮੌੜ/);
    expect(blob).toMatch(/ਚਿੱਠੀ|ਸਕੂਲਾਂ ਵਿੱਚ/);
    expect(blob).toMatch(/ਧੱਕੋ|ਖਿੱਚੋ/);
    expect(blob).toMatch(/ਸਿਹਤ ਕਾਰਡ|ਬੱਸ ਪਾਸ/);
    expect(blob).toMatch(/ਮੈਂ ਸਮਝਦਾ ਹਾਂ|ਮੈਨੂੰ ਪੁੱਛਣਾ ਹੈ/);
    expect(blob).toMatch(/ਫੋਨ ਕਰਨਾ|ਲਾਈਨ ਵਿੱਚ ਖੜ੍ਹਨਾ/);
    expect(blob).toMatch(/ਦਸਤਖ਼ਤ ਜਾਂਚ|ਅੰਤਿਮ ਮਨਜ਼ੂਰੀ/);
  });

  it("uses pre-A11-signoff, seal, snapshot, pre-integration, and regression stages", () => {
    const stages = new Set(PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_ITEMS.map((item) => item.stage));
    expect(stages.has("pre_a11_signoff")).toBe(true);
    expect(stages.has("seal")).toBe(true);
    expect(stages.has("snapshot")).toBe(true);
    expect(stages.has("pre_integration")).toBe(true);
    expect(stages.has("regression")).toBe(true);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_ITEMS.filter((item) => item.focus === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_SCOPE.vi,
      PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_SCOPE.en,
      ...shahmukhi.map((item) => `${item.signoff_vi} ${item.signoff_en} ${item.expected_vi} ${item.expected_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/shahmukhi awareness|shahmukhi chỉ là awareness/);
    expect(blob).toMatch(/does not create a full shahmukhi lesson|không tạo bài học shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts into signoff data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_SCOPE.signoffDataOnly).toBe(true);
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_SAMPLES).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio|ci config/);
  });
});
