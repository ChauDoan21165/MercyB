// src/languages/punjabi/__tests__/punjabiGurmukhiFluencyDrills.test.ts
//
// Structural guards for Punjabi Gurmukhi fluency drills.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_GURMUKHI_FLUENCY_DRILL_ITEMS,
  PUNJABI_GURMUKHI_FLUENCY_DRILLS,
  PUNJABI_GURMUKHI_FLUENCY_DRILLS_SCOPE,
  type PunjabiFluencyFocus,
} from "@/languages/punjabi/gurmukhiFluencyDrills";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_FOCUS: ReadonlyArray<PunjabiFluencyFocus> = [
  "quick_recognition",
  "word_chunks",
  "vowel_sign_contrast",
  "addak_tippi_bindi",
  "survival_signs",
  "service_words",
  "high_frequency_verbs",
  "romanization_reduction",
  "shahmukhi_awareness",
];

describe("Punjabi Gurmukhi fluency drills", () => {
  it("is app-consumable sectioned TypeScript data", () => {
    expect(PUNJABI_GURMUKHI_FLUENCY_DRILLS.length).toBe(REQUIRED_FOCUS.length);
    for (const section of PUNJABI_GURMUKHI_FLUENCY_DRILLS) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.fluencyGoal_vi.trim().length).toBeGreaterThan(30);
      expect(section.fluencyGoal_en.trim().length).toBeGreaterThan(30);
      expect(section.drills.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 17 fluency focus areas", () => {
    const focus = new Set(PUNJABI_GURMUKHI_FLUENCY_DRILLS.map((section) => section.focus));
    for (const required of REQUIRED_FOCUS) {
      expect(focus.has(required), `missing ${required}`).toBe(true);
    }
  });

  it("has enough compact fluency entries to be useful", () => {
    expect(PUNJABI_GURMUKHI_FLUENCY_DRILL_ITEMS.length).toBeGreaterThanOrEqual(24);
    expect(PUNJABI_GURMUKHI_FLUENCY_DRILL_ITEMS.length).toBeLessThanOrEqual(60);
  });

  it("uses Gurmukhi primary with bilingual prompts, targets, and remediation", () => {
    for (const item of PUNJABI_GURMUKHI_FLUENCY_DRILL_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.prompt_vi.trim().length, `prompt vi for ${item.id}`).toBeGreaterThan(20);
      expect(item.prompt_en.trim().length, `prompt en for ${item.id}`).toBeGreaterThan(20);
      expect(item.target_vi.trim().length, `target vi for ${item.id}`).toBeGreaterThan(15);
      expect(item.target_en.trim().length, `target en for ${item.id}`).toBeGreaterThan(15);
      expect(item.remediation_vi.trim().length, `remediation vi for ${item.id}`).toBeGreaterThan(20);
      expect(item.remediation_en.trim().length, `remediation en for ${item.id}`).toBeGreaterThan(20);
    }
  });

  it("keeps ids unique and focus aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_GURMUKHI_FLUENCY_DRILLS) {
      for (const drill of section.drills) {
        expect(ids.has(drill.id), `duplicate id: ${drill.id}`).toBe(false);
        expect(drill.focus).toBe(section.focus);
        ids.add(drill.id);
      }
    }
  });

  it("includes romanization, traps, Canada examples, readiness, final-quality, and reduction", () => {
    const romanized = PUNJABI_GURMUKHI_FLUENCY_DRILL_ITEMS.filter((item) => item.romanization);
    const traps = PUNJABI_GURMUKHI_FLUENCY_DRILL_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_GURMUKHI_FLUENCY_DRILL_ITEMS.filter((item) => item.canadaPractical);
    const readiness = PUNJABI_GURMUKHI_FLUENCY_DRILL_ITEMS.filter((item) => item.readiness);
    const finalQuality = PUNJABI_GURMUKHI_FLUENCY_DRILL_ITEMS.filter((item) => item.finalQuality);
    const reductions = PUNJABI_GURMUKHI_FLUENCY_DRILL_ITEMS.filter((item) => item.reduceRomanization);
    expect(romanized.length).toBeGreaterThanOrEqual(20);
    expect(traps.length).toBeGreaterThanOrEqual(12);
    expect(canada.length).toBeGreaterThanOrEqual(10);
    expect(readiness.length).toBeGreaterThanOrEqual(6);
    expect(finalQuality.length).toBeGreaterThanOrEqual(5);
    expect(reductions.length).toBeGreaterThanOrEqual(3);
  });

  it("covers quick recognition, chunks, vowel contrast, marks, signs, services, verbs, and reduction", () => {
    const blob = PUNJABI_GURMUKHI_FLUENCY_DRILL_ITEMS
      .map((item) => `${item.focus} ${item.gurmukhi} ${item.romanization ?? ""} ${item.prompt_vi} ${item.prompt_en} ${item.target_vi} ${item.target_en}`)
      .join(" ");
    expect(blob).toMatch(/ਕ \/ ਖ|ਤ \/ ਟ|ਸ \/ ਸ਼/);
    expect(blob).toMatch(/ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ|ਫਾਰਮ ਭਰਨਾ|ਗਲਤੀ ਠੀਕ ਕਰਨਾ/);
    expect(blob).toMatch(/ਕਿ \/ ਕੀ|ਕੁ \/ ਕੂ|ਕੇ \/ ਕੈ \/ ਕੌ/);
    expect(blob).toMatch(/ਬੱਸ ਅੱਡਾ|ਮਾਂ|ਪੰਜਾਬ/);
    expect(blob).toMatch(/ਨਿਕਾਸ|ਐਮਰਜੈਂਸੀ|ਫਾਰਮੇਸੀ/);
    expect(blob).toMatch(/ਦਵਾਈ|ਕਿਰਾਇਆ|ਸਕੂਲ/);
    expect(blob).toMatch(/ਕਰਨਾ|ਲੈਣਾ|ਸਮਝ ਨਹੀਂ ਆਈ/);
    expect(blob).toMatch(/phal\/fal|vadda\/wadda|shahir\/shehar/);
  });

  it("uses fluency paces for flash, guided, review, and readiness", () => {
    const paces = new Set(PUNJABI_GURMUKHI_FLUENCY_DRILL_ITEMS.map((item) => item.pace));
    expect(paces.has("flash")).toBe(true);
    expect(paces.has("guided")).toBe(true);
    expect(paces.has("review")).toBe(true);
    expect(paces.has("readiness")).toBe(true);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_GURMUKHI_FLUENCY_DRILL_ITEMS.filter((item) => item.focus === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_GURMUKHI_FLUENCY_DRILLS_SCOPE.vi,
      PUNJABI_GURMUKHI_FLUENCY_DRILLS_SCOPE.en,
      ...shahmukhi.map((item) => `${item.target_vi} ${item.target_en} ${item.remediation_vi} ${item.remediation_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not a full shahmukhi course|không phải khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts", () => {
    expect(PUNJABI_GURMUKHI_FLUENCY_DRILLS_SCOPE.noAudioScoringOrIntegration).toBe(true);
    const blob = JSON.stringify(PUNJABI_GURMUKHI_FLUENCY_DRILLS).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio/);
  });
});
