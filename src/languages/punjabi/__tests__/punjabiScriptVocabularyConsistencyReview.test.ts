// src/languages/punjabi/__tests__/punjabiScriptVocabularyConsistencyReview.test.ts
//
// Structural tests for Punjabi script/vocabulary consistency review.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW,
  PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW_ITEMS,
  PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW_SCOPE,
  type PunjabiConsistencyReviewFocus,
} from "@/languages/punjabi/scriptVocabularyConsistencyReview";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_FOCUS: ReadonlyArray<PunjabiConsistencyReviewFocus> = [
  "gurmukhi_primary",
  "romanization_bridge_limits",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "service_words",
  "high_frequency_verbs",
  "collocations",
  "shahmukhi_awareness",
  "final_guardrails",
];

describe("Punjabi script vocabulary consistency review", () => {
  it("is app-consumable sectioned TypeScript data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW.length).toBe(REQUIRED_FOCUS.length);
    for (const section of PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.consistencyGoal_vi.trim().length).toBeGreaterThan(40);
      expect(section.consistencyGoal_en.trim().length).toBeGreaterThan(40);
      expect(section.items.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 27 consistency review focus areas", () => {
    const focus = new Set(PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW.map((section) => section.focus));
    for (const required of REQUIRED_FOCUS) {
      expect(focus.has(required), `missing ${required}`).toBe(true);
    }
  });

  it("has enough compact review entries to be useful", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW_ITEMS.length).toBeGreaterThanOrEqual(25);
    expect(PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW_ITEMS.length).toBeLessThanOrEqual(60);
  });

  it("uses Gurmukhi primary with Vietnamese and English guidance", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.review_vi.trim().length, `review vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.review_en.trim().length, `review en for ${item.id}`).toBeGreaterThan(25);
      expect(item.expected_vi.trim().length, `expected vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.expected_en.trim().length, `expected en for ${item.id}`).toBeGreaterThan(25);
      expect(item.fix_vi.trim().length, `fix vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.fix_en.trim().length, `fix en for ${item.id}`).toBeGreaterThan(25);
    }
  });

  it("keeps ids unique and focus aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW) {
      for (const item of section.items) {
        expect(ids.has(item.id), `duplicate id: ${item.id}`).toBe(false);
        expect(item.focus).toBe(section.focus);
        ids.add(item.id);
      }
    }
  });

  it("includes romanization, traps, Canada examples, app readiness, and final guardrails", () => {
    const romanized = PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW_ITEMS.filter((item) => item.romanization);
    const traps = PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW_ITEMS.filter((item) => item.canadaPractical);
    const appReady = PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW_ITEMS.filter((item) => item.appReady);
    const finalGuardrail = PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW_ITEMS.filter((item) => item.finalGuardrail);
    expect(romanized.length).toBeGreaterThanOrEqual(24);
    expect(traps.length).toBeGreaterThanOrEqual(10);
    expect(canada.length).toBeGreaterThanOrEqual(10);
    expect(appReady.length).toBeGreaterThanOrEqual(8);
    expect(finalGuardrail.length).toBeGreaterThanOrEqual(12);
  });

  it("covers script, bridge limits, signs, services, verbs, collocations, and final review", () => {
    const blob = PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW_ITEMS
      .map((item) => `${item.focus} ${item.mode} ${item.gurmukhi} ${item.romanization ?? ""} ${item.review_vi} ${item.review_en} ${item.expected_vi} ${item.expected_en}`)
      .join(" ");
    expect(blob).toMatch(/ਪੰਜਾਬੀ|ਪੜ੍ਹੋ|ਗੁਰਮੁਖੀ/);
    expect(blob).toMatch(/ਫਲ|ਵੱਡਾ|ਸ਼ਹਿਰ/);
    expect(blob).toMatch(/ਕਿ \/ ਕੀ|ਕੁ \/ ਕੂ|ਕੇ \/ ਕੈ \/ ਕੌ/);
    expect(blob).toMatch(/ਬੱਸ ਅੱਡਾ|ਮਾਂ \/ ਪੰਜਾਬ/);
    expect(blob).toMatch(/ਨਿਕਾਸ|ਐਮਰਜੈਂਸੀ|ਫਾਰਮੇਸੀ/);
    expect(blob).toMatch(/ਦਵਾਈ|ਕਿਰਾਇਆ|ਸਕੂਲ/);
    expect(blob).toMatch(/ਕਰਨਾ|ਲੈਣਾ|ਸਮਝਣਾ/);
    expect(blob).toMatch(/ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ|ਫਾਰਮ ਭਰਨਾ|ਗਲਤੀ ਠੀਕ ਕਰਨਾ/);
    expect(blob).toMatch(/ਅੰਤਿਮ ਜਾਂਚ|ਮੁੜ ਸਮੀਖਿਆ/);
  });

  it("uses consistency, guardrail, readiness, and regression modes", () => {
    const modes = new Set(PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW_ITEMS.map((item) => item.mode));
    expect(modes.has("consistency")).toBe(true);
    expect(modes.has("guardrail")).toBe(true);
    expect(modes.has("readiness")).toBe(true);
    expect(modes.has("regression")).toBe(true);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW_ITEMS.filter((item) => item.focus === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW_SCOPE.vi,
      PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW_SCOPE.en,
      ...shahmukhi.map((item) => `${item.review_vi} ${item.review_en} ${item.expected_vi} ${item.expected_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not a full course|không phải khóa đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts into app data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW_SCOPE.appDataOnly).toBe(true);
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio|a11|ci config/);
  });
});
