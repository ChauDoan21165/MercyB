// src/languages/punjabi/__tests__/punjabiScriptVocabularyIntegrationDryRunSet.test.ts
//
// Structural tests for Punjabi script/vocabulary integration dry-run data.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_ITEMS,
  PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_SCOPE,
  PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_SET,
  type PunjabiDryRunFocus,
} from "@/languages/punjabi/scriptVocabularyIntegrationDryRunSet";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_FOCUS: ReadonlyArray<PunjabiDryRunFocus> = [
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

describe("Punjabi script vocabulary integration dry run set", () => {
  it("is app-consumable sectioned TypeScript dry-run data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_SET.length).toBe(REQUIRED_FOCUS.length);
    for (const section of PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_SET) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.dryRunGoal_vi.trim().length).toBeGreaterThan(40);
      expect(section.dryRunGoal_en.trim().length).toBeGreaterThan(40);
      expect(section.items.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 29 dry-run focus areas", () => {
    const focus = new Set(PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_SET.map((section) => section.focus));
    for (const required of REQUIRED_FOCUS) {
      expect(focus.has(required), `missing ${required}`).toBe(true);
    }
  });

  it("has enough compact dry-run entries to be useful", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_ITEMS.length).toBeGreaterThanOrEqual(20);
    expect(PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_ITEMS.length).toBeLessThanOrEqual(45);
  });

  it("uses Gurmukhi primary with Vietnamese and English dry-run guidance", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.dryRun_vi.trim().length, `dry run vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.dryRun_en.trim().length, `dry run en for ${item.id}`).toBeGreaterThan(25);
      expect(item.selectWhen_vi.trim().length, `select vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.selectWhen_en.trim().length, `select en for ${item.id}`).toBeGreaterThan(25);
      expect(item.readiness_vi.trim().length, `readiness vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.readiness_en.trim().length, `readiness en for ${item.id}`).toBeGreaterThan(25);
    }
  });

  it("keeps ids unique and focus aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_SET) {
      for (const item of section.items) {
        expect(ids.has(item.id), `duplicate id: ${item.id}`).toBe(false);
        expect(item.focus).toBe(section.focus);
        ids.add(item.id);
      }
    }
  });

  it("includes romanization, traps, Canada examples, pre-integration, and final readiness", () => {
    const romanized = PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_ITEMS.filter((item) => item.romanization);
    const traps = PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_ITEMS.filter((item) => item.canadaPractical);
    const preIntegration = PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_ITEMS.filter((item) => item.preIntegration);
    const finalReady = PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_ITEMS.filter((item) => item.finalReady);
    expect(romanized.length).toBeGreaterThanOrEqual(20);
    expect(traps.length).toBeGreaterThanOrEqual(9);
    expect(canada.length).toBeGreaterThanOrEqual(9);
    expect(preIntegration.length).toBeGreaterThanOrEqual(7);
    expect(finalReady.length).toBeGreaterThanOrEqual(9);
  });

  it("covers ladder, deck, glossary, drills, boundaries, signs, service, and final items", () => {
    const blob = PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_ITEMS
      .map((item) => `${item.focus} ${item.use} ${item.gurmukhi} ${item.romanization ?? ""} ${item.dryRun_vi} ${item.dryRun_en} ${item.selectWhen_vi} ${item.selectWhen_en}`)
      .join(" ");
    expect(blob).toMatch(/ਕ \/ ਖ|ਕਿ \/ ਕੀ|ਕੇ \/ ਕੈ \/ ਕੌ/);
    expect(blob).toMatch(/ਦਵਾਈ|ਕਿਰਾਇਆ|ਸਕੂਲ/);
    expect(blob).toMatch(/ਪੰਜਾਬੀ|ਵੱਡਾ/);
    expect(blob).toMatch(/ਬੱਸ ਅੱਡਾ|ਮਾਂ \/ ਪੰਜਾਬ/);
    expect(blob).toMatch(/ਫਲ|ਸ਼ਹਿਰ/);
    expect(blob).toMatch(/ਨਿਕਾਸ|ਐਮਰਜੈਂਸੀ|ਫਾਰਮੇਸੀ/);
    expect(blob).toMatch(/ਫਾਰਮ ਭਰਨਾ|ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ|ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ/);
    expect(blob).toMatch(/ਗੁਰਮੁਖੀ|ਅੰਤਿਮ ਸੁੱਕਾ ਟੈਸਟ|ਮੁੜ ਜਾਂਚ/);
  });

  it("uses dry-run, pre-integration, final-readiness, and regression uses", () => {
    const uses = new Set(PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_ITEMS.map((item) => item.use));
    expect(uses.has("dry_run")).toBe(true);
    expect(uses.has("pre_integration")).toBe(true);
    expect(uses.has("final_readiness")).toBe(true);
    expect(uses.has("regression")).toBe(true);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_ITEMS.filter((item) => item.focus === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_SCOPE.vi,
      PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_SCOPE.en,
      ...shahmukhi.map((item) => `${item.dryRun_vi} ${item.dryRun_en} ${item.readiness_vi} ${item.readiness_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/shahmukhi awareness|shahmukhi chỉ awareness/);
    expect(blob).toMatch(/not become a full shahmukhi course|không biến thành khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts into dry-run data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_SCOPE.dryRunDataOnly).toBe(true);
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_SET).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio|a11|ci config/);
  });
});
