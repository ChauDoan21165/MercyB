// src/languages/punjabi/__tests__/punjabiGurmukhiMasteryReview.test.ts
//
// Structural guards for Punjabi Gurmukhi mastery review data.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_GURMUKHI_MASTERY_REVIEW,
  PUNJABI_GURMUKHI_MASTERY_REVIEW_ITEMS,
  PUNJABI_GURMUKHI_MASTERY_REVIEW_SCOPE,
  type PunjabiMasteryFocus,
} from "@/languages/punjabi/gurmukhiMasteryReview";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_FOCUS: ReadonlyArray<PunjabiMasteryFocus> = [
  "letters",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "service_vocabulary",
  "high_frequency_verbs",
  "collocations",
  "romanization_bridge_reduction",
  "shahmukhi_awareness",
  "export_readiness",
];

describe("Punjabi Gurmukhi mastery review", () => {
  it("is app-consumable sectioned TypeScript data", () => {
    expect(PUNJABI_GURMUKHI_MASTERY_REVIEW.length).toBe(REQUIRED_FOCUS.length);
    for (const section of PUNJABI_GURMUKHI_MASTERY_REVIEW) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.reviewGoal_vi.trim().length).toBeGreaterThan(40);
      expect(section.reviewGoal_en.trim().length).toBeGreaterThan(40);
      expect(section.items.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 24 mastery review focus areas", () => {
    const focus = new Set(PUNJABI_GURMUKHI_MASTERY_REVIEW.map((section) => section.focus));
    for (const required of REQUIRED_FOCUS) {
      expect(focus.has(required), `missing ${required}`).toBe(true);
    }
  });

  it("has enough compact review entries to be useful", () => {
    expect(PUNJABI_GURMUKHI_MASTERY_REVIEW_ITEMS.length).toBeGreaterThanOrEqual(24);
    expect(PUNJABI_GURMUKHI_MASTERY_REVIEW_ITEMS.length).toBeLessThanOrEqual(60);
  });

  it("uses Gurmukhi primary with Vietnamese and English explanations", () => {
    for (const item of PUNJABI_GURMUKHI_MASTERY_REVIEW_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.meaning_vi.trim().length, `meaning vi for ${item.id}`).toBeGreaterThan(2);
      expect(item.meaning_en.trim().length, `meaning en for ${item.id}`).toBeGreaterThan(2);
      expect(item.task_vi.trim().length, `task vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.task_en.trim().length, `task en for ${item.id}`).toBeGreaterThan(25);
      expect(item.successCriteria_vi.trim().length, `criteria vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.successCriteria_en.trim().length, `criteria en for ${item.id}`).toBeGreaterThan(25);
    }
  });

  it("keeps ids unique and focus aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_GURMUKHI_MASTERY_REVIEW) {
      for (const item of section.items) {
        expect(ids.has(item.id), `duplicate id: ${item.id}`).toBe(false);
        expect(item.focus).toBe(section.focus);
        ids.add(item.id);
      }
    }
  });

  it("includes romanization, traps, Canada examples, reduction, and export readiness", () => {
    const romanized = PUNJABI_GURMUKHI_MASTERY_REVIEW_ITEMS.filter((item) => item.romanization);
    const traps = PUNJABI_GURMUKHI_MASTERY_REVIEW_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_GURMUKHI_MASTERY_REVIEW_ITEMS.filter((item) => item.canadaPractical);
    const reductions = PUNJABI_GURMUKHI_MASTERY_REVIEW_ITEMS.filter((item) => item.reduceRomanization);
    const exportReady = PUNJABI_GURMUKHI_MASTERY_REVIEW_ITEMS.filter((item) => item.exportReady);
    expect(romanized.length).toBeGreaterThanOrEqual(20);
    expect(traps.length).toBeGreaterThanOrEqual(10);
    expect(canada.length).toBeGreaterThanOrEqual(10);
    expect(reductions.length).toBeGreaterThanOrEqual(5);
    expect(exportReady.length).toBeGreaterThanOrEqual(10);
  });

  it("covers script, signs, services, verbs, collocations, and regression concepts", () => {
    const blob = PUNJABI_GURMUKHI_MASTERY_REVIEW_ITEMS
      .map((item) => `${item.focus} ${item.level} ${item.gurmukhi} ${item.romanization ?? ""} ${item.meaning_vi} ${item.meaning_en} ${item.task_vi} ${item.task_en}`)
      .join(" ");
    expect(blob).toMatch(/ਕ \/ ਖ|ਤ \/ ਟ|ਸ \/ ਸ਼/);
    expect(blob).toMatch(/ਕਿ \/ ਕੀ|ਕੁ \/ ਕੂ|ਕੇ \/ ਕੈ \/ ਕੌ/);
    expect(blob).toMatch(/ਬੱਸ ਅੱਡਾ|ਮਾਂ \/ ਪੰਜਾਬ/);
    expect(blob).toMatch(/ਨਿਕਾਸ|ਐਮਰਜੈਂਸੀ|ਫਾਰਮੇਸੀ/);
    expect(blob).toMatch(/ਦਵਾਈ|ਕਿਰਾਇਆ|ਸਕੂਲ/);
    expect(blob).toMatch(/ਕਰਨਾ|ਲੈਣਾ|ਸਮਝਣਾ/);
    expect(blob).toMatch(/ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ|ਫਾਰਮ ਭਰਨਾ|ਗਲਤੀ ਠੀਕ ਕਰਨਾ/);
    expect(blob).toMatch(/ਫਲ|ਵੱਡਾ|ਅੰਤਿਮ ਸਮੀਖਿਆ|ਮੁੜ ਜਾਂਚ/);
  });

  it("uses review, hardening, regression, and exit levels", () => {
    const levels = new Set(PUNJABI_GURMUKHI_MASTERY_REVIEW_ITEMS.map((item) => item.level));
    expect(levels.has("review")).toBe(true);
    expect(levels.has("hardening")).toBe(true);
    expect(levels.has("regression")).toBe(true);
    expect(levels.has("exit")).toBe(true);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_GURMUKHI_MASTERY_REVIEW_ITEMS.filter((item) => item.focus === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_GURMUKHI_MASTERY_REVIEW_SCOPE.vi,
      PUNJABI_GURMUKHI_MASTERY_REVIEW_SCOPE.en,
      ...shahmukhi.map((item) => `${item.task_vi} ${item.task_en} ${item.successCriteria_vi} ${item.successCriteria_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not a full shahmukhi course|không phải khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts", () => {
    expect(PUNJABI_GURMUKHI_MASTERY_REVIEW_SCOPE.noAudioScoringOrIntegration).toBe(true);
    const blob = JSON.stringify(PUNJABI_GURMUKHI_MASTERY_REVIEW).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio|a11/);
  });
});
