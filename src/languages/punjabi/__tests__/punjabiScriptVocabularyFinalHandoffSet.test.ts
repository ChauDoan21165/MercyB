// src/languages/punjabi/__tests__/punjabiScriptVocabularyFinalHandoffSet.test.ts
//
// Structural tests for Punjabi script/vocabulary final handoff data.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_ITEMS,
  PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_SCOPE,
  PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_SET,
  type PunjabiFinalHandoffFocus,
} from "@/languages/punjabi/scriptVocabularyFinalHandoffSet";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_FOCUS: ReadonlyArray<PunjabiFinalHandoffFocus> = [
  "reading_ladder",
  "vocabulary_deck",
  "glossary",
  "script_drills",
  "romanization_boundaries",
  "survival_signage",
  "service_vocabulary",
  "shahmukhi_awareness",
  "final_readiness",
];

describe("Punjabi script vocabulary final handoff set", () => {
  it("is app-consumable sectioned TypeScript handoff data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_SET.length).toBe(REQUIRED_FOCUS.length);
    for (const section of PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_SET) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.handoffGoal_vi.trim().length).toBeGreaterThan(40);
      expect(section.handoffGoal_en.trim().length).toBeGreaterThan(40);
      expect(section.items.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 30 handoff focus areas", () => {
    const focus = new Set(PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_SET.map((section) => section.focus));
    for (const required of REQUIRED_FOCUS) {
      expect(focus.has(required), `missing ${required}`).toBe(true);
    }
  });

  it("has enough compact handoff entries to be useful", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_ITEMS.length).toBeGreaterThanOrEqual(20);
    expect(PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_ITEMS.length).toBeLessThanOrEqual(45);
  });

  it("uses Gurmukhi primary with Vietnamese and English handoff guidance", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.handoff_vi.trim().length, `handoff vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.handoff_en.trim().length, `handoff en for ${item.id}`).toBeGreaterThan(25);
      expect(item.includeWhen_vi.trim().length, `include vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.includeWhen_en.trim().length, `include en for ${item.id}`).toBeGreaterThan(25);
      expect(item.finalCheck_vi.trim().length, `final vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.finalCheck_en.trim().length, `final en for ${item.id}`).toBeGreaterThan(25);
    }
  });

  it("keeps ids unique and focus aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_SET) {
      for (const item of section.items) {
        expect(ids.has(item.id), `duplicate id: ${item.id}`).toBe(false);
        expect(item.focus).toBe(section.focus);
        ids.add(item.id);
      }
    }
  });

  it("includes romanization, traps, Canada examples, pre-integration, and final readiness", () => {
    const romanized = PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_ITEMS.filter((item) => item.romanization);
    const traps = PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_ITEMS.filter((item) => item.canadaPractical);
    const preIntegration = PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_ITEMS.filter((item) => item.preIntegration);
    const finalReady = PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_ITEMS.filter((item) => item.finalReady);
    expect(romanized.length).toBeGreaterThanOrEqual(20);
    expect(traps.length).toBeGreaterThanOrEqual(9);
    expect(canada.length).toBeGreaterThanOrEqual(9);
    expect(preIntegration.length).toBeGreaterThanOrEqual(7);
    expect(finalReady.length).toBeGreaterThanOrEqual(9);
  });

  it("covers ladder, deck, glossary, drills, boundaries, signs, service, and final handoff items", () => {
    const blob = PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_ITEMS
      .map((item) => `${item.focus} ${item.use} ${item.gurmukhi} ${item.romanization ?? ""} ${item.handoff_vi} ${item.handoff_en} ${item.includeWhen_vi} ${item.includeWhen_en}`)
      .join(" ");
    expect(blob).toMatch(/ਕ \/ ਖ|ਕਿ \/ ਕੀ|ਕੇ \/ ਕੈ \/ ਕੌ/);
    expect(blob).toMatch(/ਦਵਾਈ|ਕਿਰਾਇਆ|ਸਕੂਲ/);
    expect(blob).toMatch(/ਪੰਜਾਬੀ|ਵੱਡਾ/);
    expect(blob).toMatch(/ਬੱਸ ਅੱਡਾ|ਮਾਂ \/ ਪੰਜਾਬ/);
    expect(blob).toMatch(/ਫਲ|ਸ਼ਹਿਰ/);
    expect(blob).toMatch(/ਨਿਕਾਸ|ਐਮਰਜੈਂਸੀ|ਫਾਰਮੇਸੀ/);
    expect(blob).toMatch(/ਫਾਰਮ ਭਰਨਾ|ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ|ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ/);
    expect(blob).toMatch(/ਗੁਰਮੁਖੀ|ਅੰਤਿਮ ਹਵਾਲਗੀ|ਮੁੜ ਜਾਂਚ/);
  });

  it("uses final-handoff, pre-integration, final-readiness, and regression uses", () => {
    const uses = new Set(PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_ITEMS.map((item) => item.use));
    expect(uses.has("final_handoff")).toBe(true);
    expect(uses.has("pre_integration")).toBe(true);
    expect(uses.has("final_readiness")).toBe(true);
    expect(uses.has("regression")).toBe(true);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_ITEMS.filter((item) => item.focus === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_SCOPE.vi,
      PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_SCOPE.en,
      ...shahmukhi.map((item) => `${item.handoff_vi} ${item.handoff_en} ${item.finalCheck_vi} ${item.finalCheck_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/shahmukhi awareness|shahmukhi chỉ là awareness/);
    expect(blob).toMatch(/not become a full shahmukhi course|không biến thành khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts into handoff data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_SCOPE.handoffDataOnly).toBe(true);
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_SET).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio|a11|ci config/);
  });
});
