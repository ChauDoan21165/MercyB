// src/languages/punjabi/__tests__/punjabiScriptVocabularyFinalReview.test.ts
//
// Structural guards for the Punjabi script vocabulary final review.
// These tests do not assert native-level linguistic review; that is deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW,
  PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW_ITEMS,
  PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW_SCOPE,
  type PunjabiFinalReviewArea,
} from "@/languages/punjabi/scriptVocabularyFinalReview";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_AREAS: ReadonlyArray<PunjabiFinalReviewArea> = [
  "gurmukhi_recognition",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "thematic_vocabulary",
  "high_frequency_verbs",
  "collocations",
  "romanization_bridge",
  "shahmukhi_awareness",
];

describe("Punjabi script vocabulary final review", () => {
  it("is app-consumable sectioned TypeScript data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW.length).toBe(REQUIRED_AREAS.length);
    for (const section of PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.reviewGoal_vi.trim().length).toBeGreaterThan(25);
      expect(section.reviewGoal_en.trim().length).toBeGreaterThan(25);
      expect(section.items.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 13 final-review areas", () => {
    const areas = new Set(PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW.map((section) => section.area));
    for (const area of REQUIRED_AREAS) {
      expect(areas.has(area), `missing ${area}`).toBe(true);
    }
  });

  it("has enough compact final-review entries to be useful", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW_ITEMS.length).toBeGreaterThanOrEqual(24);
    expect(PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW_ITEMS.length).toBeLessThanOrEqual(60);
  });

  it("uses Gurmukhi primary with bilingual QA and review notes", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.question_vi.trim().length, `question vi for ${item.id}`).toBeGreaterThan(20);
      expect(item.question_en.trim().length, `question en for ${item.id}`).toBeGreaterThan(20);
      expect(item.answer_vi.trim().length, `answer vi for ${item.id}`).toBeGreaterThan(20);
      expect(item.answer_en.trim().length, `answer en for ${item.id}`).toBeGreaterThan(20);
      expect(item.reviewNote_vi.trim().length, `note vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.reviewNote_en.trim().length, `note en for ${item.id}`).toBeGreaterThan(25);
    }
  });

  it("keeps ids unique and areas aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW) {
      for (const item of section.items) {
        expect(ids.has(item.id), `duplicate id: ${item.id}`).toBe(false);
        expect(item.area).toBe(section.area);
        ids.add(item.id);
      }
    }
  });

  it("includes romanization, traps, Canada examples, checkpoints, and final-review flags", () => {
    const romanized = PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW_ITEMS.filter((item) => item.romanization);
    const traps = PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW_ITEMS.filter((item) => item.canadaPractical);
    const checkpoints = PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW_ITEMS.filter((item) => item.checkpoint);
    const finalReview = PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW_ITEMS.filter((item) => item.finalReview);
    expect(romanized.length).toBeGreaterThanOrEqual(20);
    expect(traps.length).toBeGreaterThanOrEqual(10);
    expect(canada.length).toBeGreaterThanOrEqual(10);
    expect(checkpoints.length).toBeGreaterThanOrEqual(8);
    expect(finalReview.length).toBeGreaterThanOrEqual(5);
  });

  it("covers the requested final-review content domains", () => {
    const blob = PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW_ITEMS
      .map((item) => `${item.area} ${item.gurmukhi} ${item.romanization ?? ""} ${item.question_vi} ${item.question_en} ${item.answer_vi} ${item.answer_en} ${item.reviewNote_vi} ${item.reviewNote_en}`)
      .join(" ");
    expect(blob).toMatch(/ਕ \/ ਖ|ਤ \/ ਟ|ਸ਼ਹਿਰ/);
    expect(blob).toMatch(/ਕਿ \/ ਕੀ|ਕੁ \/ ਕੂ|ਕੇ \/ ਕੈ \/ ਕੌ/);
    expect(blob).toMatch(/addak|ੱ|tippi|ੰ|bindi|ਂ/i);
    expect(blob).toMatch(/ਐਮਰਜੈਂਸੀ|ਨਿਕਾਸ|ਫਾਰਮੇਸੀ/);
    expect(blob).toMatch(/ਪਰਿਵਾਰ|ਦਵਾਈ|ਕਿਰਾਇਆ/);
    expect(blob).toMatch(/ਕਰਨਾ|ਲੈਣਾ|ਸਮਝ ਨਹੀਂ ਆਈ/);
    expect(blob).toMatch(/ਮਦਦ ਚਾਹੀਦੀ ਹੈ|ਫਾਰਮ ਭਰਨਾ|ਗਲਤੀ ਠੀਕ ਕਰਨਾ/);
    expect(blob).toMatch(/phal\/fal|vadda\/wadda|shahir\/shehar/);
  });

  it("uses QA/checkpoint style modes", () => {
    const modes = new Set(PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW_ITEMS.map((item) => item.mode));
    expect(modes.has("identify")).toBe(true);
    expect(modes.has("explain")).toBe(true);
    expect(modes.has("apply")).toBe(true);
    expect(modes.has("qa_checkpoint")).toBe(true);
  });

  it("keeps Shahmukhi awareness only and avoids native-review claims", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW_ITEMS.filter((item) => item.area === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW_SCOPE.vi,
      PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW_SCOPE.en,
      ...shahmukhi.map((item) => `${item.answer_vi} ${item.answer_en} ${item.reviewNote_vi} ${item.reviewNote_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not a full shahmukhi course|không phải khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW_SCOPE.noAudioScoringOrIntegration).toBe(true);
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio/);
  });
});
