// src/languages/punjabi/__tests__/punjabiScriptReviewScheduler.test.ts
//
// Structural guards for the Punjabi script review scheduler.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_REVIEW_SCHEDULER,
  PUNJABI_SCRIPT_REVIEW_SCHEDULER_ITEMS,
  PUNJABI_SCRIPT_REVIEW_SCHEDULER_SCOPE,
  type PunjabiReviewFocus,
} from "@/languages/punjabi/scriptReviewScheduler";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_FOCUS: ReadonlyArray<PunjabiReviewFocus> = [
  "gurmukhi_letters",
  "vowel_signs",
  "addak_tippi_bindi",
  "romanization_bridge_reduction",
  "survival_signage",
  "vocabulary_script_reinforcement",
  "shahmukhi_awareness",
];

describe("Punjabi script review scheduler", () => {
  it("is app-consumable sectioned TypeScript data", () => {
    expect(PUNJABI_SCRIPT_REVIEW_SCHEDULER.length).toBe(REQUIRED_FOCUS.length);
    for (const section of PUNJABI_SCRIPT_REVIEW_SCHEDULER) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.schedulerGoal_vi.trim().length).toBeGreaterThan(30);
      expect(section.schedulerGoal_en.trim().length).toBeGreaterThan(30);
      expect(section.items.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 16 scheduler focus areas", () => {
    const focus = new Set(PUNJABI_SCRIPT_REVIEW_SCHEDULER.map((section) => section.focus));
    for (const required of REQUIRED_FOCUS) {
      expect(focus.has(required), `missing ${required}`).toBe(true);
    }
  });

  it("has enough compact scheduler entries to be useful", () => {
    expect(PUNJABI_SCRIPT_REVIEW_SCHEDULER_ITEMS.length).toBeGreaterThanOrEqual(18);
    expect(PUNJABI_SCRIPT_REVIEW_SCHEDULER_ITEMS.length).toBeLessThanOrEqual(50);
  });

  it("uses Gurmukhi primary with bilingual review, remediation, and readiness signals", () => {
    for (const item of PUNJABI_SCRIPT_REVIEW_SCHEDULER_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.reviewTask_vi.trim().length, `review vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.reviewTask_en.trim().length, `review en for ${item.id}`).toBeGreaterThan(25);
      expect(item.remediation_vi.trim().length, `remediation vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.remediation_en.trim().length, `remediation en for ${item.id}`).toBeGreaterThan(25);
      expect(item.readinessSignal_vi.trim().length, `readiness vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.readinessSignal_en.trim().length, `readiness en for ${item.id}`).toBeGreaterThan(25);
      expect(item.navigationTarget.trim().length, `navigation for ${item.id}`).toBeGreaterThan(10);
    }
  });

  it("keeps ids unique and focus aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_REVIEW_SCHEDULER) {
      for (const item of section.items) {
        expect(ids.has(item.id), `duplicate id: ${item.id}`).toBe(false);
        expect(item.focus).toBe(section.focus);
        ids.add(item.id);
      }
    }
  });

  it("includes romanization, traps, Canada examples, and romanization reduction", () => {
    const romanized = PUNJABI_SCRIPT_REVIEW_SCHEDULER_ITEMS.filter((item) => item.romanization);
    const traps = PUNJABI_SCRIPT_REVIEW_SCHEDULER_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_SCRIPT_REVIEW_SCHEDULER_ITEMS.filter((item) => item.canadaPractical);
    const reductions = PUNJABI_SCRIPT_REVIEW_SCHEDULER_ITEMS.filter((item) => item.reduceRomanization);
    expect(romanized.length).toBeGreaterThanOrEqual(15);
    expect(traps.length).toBeGreaterThanOrEqual(10);
    expect(canada.length).toBeGreaterThanOrEqual(8);
    expect(reductions.length).toBeGreaterThanOrEqual(3);
  });

  it("uses navigation, review, remediation, and readiness cadences", () => {
    const cadences = new Set(PUNJABI_SCRIPT_REVIEW_SCHEDULER_ITEMS.map((item) => item.cadence));
    expect(cadences.has("same_day")).toBe(true);
    expect(cadences.has("next_day")).toBe(true);
    expect(cadences.has("three_day")).toBe(true);
    expect(cadences.has("weekly")).toBe(true);
    expect(cadences.has("readiness_gate")).toBe(true);
    expect(PUNJABI_SCRIPT_REVIEW_SCHEDULER_ITEMS.some((item) => item.navigationTarget.includes("."))).toBe(true);
  });

  it("covers the requested script review and reinforcement loops", () => {
    const blob = PUNJABI_SCRIPT_REVIEW_SCHEDULER_ITEMS
      .map((item) => `${item.focus} ${item.gurmukhi} ${item.romanization ?? ""} ${item.reviewTask_vi} ${item.reviewTask_en} ${item.remediation_vi} ${item.remediation_en}`)
      .join(" ");
    expect(blob).toMatch(/ਕ \/ ਖ|ਤ \/ ਟ|ਸ \/ ਸ਼/);
    expect(blob).toMatch(/ਕਿ \/ ਕੀ|ਕੁ \/ ਕੂ|ਕੇ \/ ਕੈ \/ ਕੌ/);
    expect(blob).toMatch(/ਬੱਸ ਅੱਡਾ|ਮਾਂ \/ ਪੰਜਾਬ/);
    expect(blob).toMatch(/phal\/fal|vadda\/wadda|shahir\/shehar/);
    expect(blob).toMatch(/ਐਮਰਜੈਂਸੀ|ਨਿਕਾਸ|ਫਾਰਮੇਸੀ/);
    expect(blob).toMatch(/ਦਵਾਈ \/ ਫਾਰਮੇਸੀ|ਕਿਰਾਇਆ \/ ਫਾਰਮ ਭਰਨਾ|ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ/);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_REVIEW_SCHEDULER_ITEMS.filter((item) => item.focus === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_REVIEW_SCHEDULER_SCOPE.vi,
      PUNJABI_SCRIPT_REVIEW_SCHEDULER_SCOPE.en,
      ...shahmukhi.map((item) => `${item.reviewTask_vi} ${item.reviewTask_en} ${item.remediation_vi} ${item.remediation_en} ${item.readinessSignal_vi} ${item.readinessSignal_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not a full shahmukhi course|không phải khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts", () => {
    expect(PUNJABI_SCRIPT_REVIEW_SCHEDULER_SCOPE.noAudioScoringOrIntegration).toBe(true);
    const blob = JSON.stringify(PUNJABI_SCRIPT_REVIEW_SCHEDULER).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio/);
  });
});
