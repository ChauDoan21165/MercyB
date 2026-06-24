// src/languages/punjabi/__tests__/punjabiScriptVocabularyFinalSelectors.test.ts
//
// Structural tests for Punjabi script/vocabulary final selectors.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTOR_ITEMS,
  PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTORS,
  PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTORS_SCOPE,
  type PunjabiFinalSelectorFocus,
} from "@/languages/punjabi/scriptVocabularyFinalSelectors";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_FOCUS: ReadonlyArray<PunjabiFinalSelectorFocus> = [
  "reading_ladder",
  "vocabulary_deck",
  "search_glossary",
  "script_drills",
  "romanization_boundaries",
  "survival_signage",
  "service_vocabulary",
  "shahmukhi_awareness",
  "final_readiness",
];

describe("Punjabi script vocabulary final selectors", () => {
  it("is app-consumable sectioned TypeScript selector data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTORS.length).toBe(REQUIRED_FOCUS.length);
    for (const section of PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTORS) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.selectorGoal_vi.trim().length).toBeGreaterThan(40);
      expect(section.selectorGoal_en.trim().length).toBeGreaterThan(40);
      expect(section.selectors.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 28 selector focus areas", () => {
    const focus = new Set(PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTORS.map((section) => section.focus));
    for (const required of REQUIRED_FOCUS) {
      expect(focus.has(required), `missing ${required}`).toBe(true);
    }
  });

  it("has enough compact selectors to be useful", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTOR_ITEMS.length).toBeGreaterThanOrEqual(20);
    expect(PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTOR_ITEMS.length).toBeLessThanOrEqual(45);
  });

  it("uses Gurmukhi primary with Vietnamese and English selector guidance", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTOR_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.selector_vi.trim().length, `selector vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.selector_en.trim().length, `selector en for ${item.id}`).toBeGreaterThan(25);
      expect(item.includeWhen_vi.trim().length, `include vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.includeWhen_en.trim().length, `include en for ${item.id}`).toBeGreaterThan(25);
      expect(item.readinessCheck_vi.trim().length, `readiness vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.readinessCheck_en.trim().length, `readiness en for ${item.id}`).toBeGreaterThan(25);
    }
  });

  it("keeps ids unique and focus aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTORS) {
      for (const selector of section.selectors) {
        expect(ids.has(selector.id), `duplicate id: ${selector.id}`).toBe(false);
        expect(selector.focus).toBe(section.focus);
        ids.add(selector.id);
      }
    }
  });

  it("includes romanization, traps, Canada examples, pre-integration, and final readiness", () => {
    const romanized = PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTOR_ITEMS.filter((item) => item.romanization);
    const traps = PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTOR_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTOR_ITEMS.filter((item) => item.canadaPractical);
    const preIntegration = PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTOR_ITEMS.filter((item) => item.preIntegration);
    const finalReady = PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTOR_ITEMS.filter((item) => item.finalReady);
    expect(romanized.length).toBeGreaterThanOrEqual(20);
    expect(traps.length).toBeGreaterThanOrEqual(9);
    expect(canada.length).toBeGreaterThanOrEqual(9);
    expect(preIntegration.length).toBeGreaterThanOrEqual(7);
    expect(finalReady.length).toBeGreaterThanOrEqual(9);
  });

  it("covers reading ladder, deck, glossary, drills, boundaries, signs, and service selectors", () => {
    const blob = PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTOR_ITEMS
      .map((item) => `${item.focus} ${item.use} ${item.gurmukhi} ${item.romanization ?? ""} ${item.selector_vi} ${item.selector_en} ${item.includeWhen_vi} ${item.includeWhen_en}`)
      .join(" ");
    expect(blob).toMatch(/ਕ \/ ਖ|ਕਿ \/ ਕੀ|ਕੇ \/ ਕੈ \/ ਕੌ/);
    expect(blob).toMatch(/ਦਵਾਈ|ਕਿਰਾਇਆ|ਸਕੂਲ/);
    expect(blob).toMatch(/ਪੰਜਾਬੀ|ਵੱਡਾ/);
    expect(blob).toMatch(/ਬੱਸ ਅੱਡਾ|ਮਾਂ \/ ਪੰਜਾਬ/);
    expect(blob).toMatch(/ਫਲ|ਸ਼ਹਿਰ/);
    expect(blob).toMatch(/ਨਿਕਾਸ|ਐਮਰਜੈਂਸੀ|ਫਾਰਮੇਸੀ/);
    expect(blob).toMatch(/ਫਾਰਮ ਭਰਨਾ|ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ|ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ/);
    expect(blob).toMatch(/ਗੁਰਮੁਖੀ|ਅੰਤਿਮ ਚੋਣ|ਮੁੜ ਜਾਂਚ/);
  });

  it("uses selector, pre-integration, final-readiness, and regression uses", () => {
    const uses = new Set(PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTOR_ITEMS.map((item) => item.use));
    expect(uses.has("selector")).toBe(true);
    expect(uses.has("pre_integration")).toBe(true);
    expect(uses.has("final_readiness")).toBe(true);
    expect(uses.has("regression")).toBe(true);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTOR_ITEMS.filter((item) => item.focus === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTORS_SCOPE.vi,
      PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTORS_SCOPE.en,
      ...shahmukhi.map((item) => `${item.selector_vi} ${item.selector_en} ${item.readinessCheck_vi} ${item.readinessCheck_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/shahmukhi awareness|shahmukhi chỉ awareness/);
    expect(blob).toMatch(/not become a full shahmukhi course|không biến thành khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts into selector data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTORS_SCOPE.selectorDataOnly).toBe(true);
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTORS).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio|a11|ci config/);
  });
});
