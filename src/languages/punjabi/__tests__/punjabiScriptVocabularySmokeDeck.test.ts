// src/languages/punjabi/__tests__/punjabiScriptVocabularySmokeDeck.test.ts
//
// Structural guards for Punjabi script vocabulary smoke deck.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK,
  PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK_ITEMS,
  PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK_SCOPE,
  type PunjabiSmokeDeckArea,
} from "@/languages/punjabi/scriptVocabularySmokeDeck";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_AREAS: ReadonlyArray<PunjabiSmokeDeckArea> = [
  "gurmukhi_recognition",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "service_words",
  "thematic_vocabulary",
  "high_frequency_verbs",
  "collocations",
  "romanization_bridge",
  "shahmukhi_awareness",
];

describe("Punjabi script vocabulary smoke deck", () => {
  it("is app-consumable sectioned TypeScript data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK.length).toBe(REQUIRED_AREAS.length);
    for (const section of PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.smokeGoal_vi.trim().length).toBeGreaterThan(30);
      expect(section.smokeGoal_en.trim().length).toBeGreaterThan(30);
      expect(section.items.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 19 smoke areas", () => {
    const areas = new Set(PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK.map((section) => section.area));
    for (const area of REQUIRED_AREAS) {
      expect(areas.has(area), `missing ${area}`).toBe(true);
    }
  });

  it("has enough compact smoke items to be useful", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK_ITEMS.length).toBeGreaterThanOrEqual(28);
    expect(PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK_ITEMS.length).toBeLessThanOrEqual(70);
  });

  it("uses Gurmukhi primary with bilingual prompts, pass signals, and repair paths", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.prompt_vi.trim().length, `prompt vi for ${item.id}`).toBeGreaterThan(15);
      expect(item.prompt_en.trim().length, `prompt en for ${item.id}`).toBeGreaterThan(15);
      expect(item.passSignal_vi.trim().length, `pass vi for ${item.id}`).toBeGreaterThan(20);
      expect(item.passSignal_en.trim().length, `pass en for ${item.id}`).toBeGreaterThan(20);
      expect(item.repairPath_vi.trim().length, `repair vi for ${item.id}`).toBeGreaterThan(20);
      expect(item.repairPath_en.trim().length, `repair en for ${item.id}`).toBeGreaterThan(20);
    }
  });

  it("keeps ids unique and areas aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK) {
      for (const item of section.items) {
        expect(ids.has(item.id), `duplicate id: ${item.id}`).toBe(false);
        expect(item.area).toBe(section.area);
        ids.add(item.id);
      }
    }
  });

  it("includes romanization, traps, Canada examples, final QA, and integration readiness", () => {
    const romanized = PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK_ITEMS.filter((item) => item.romanization);
    const traps = PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK_ITEMS.filter((item) => item.canadaPractical);
    const finalQA = PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK_ITEMS.filter((item) => item.finalQA);
    const integration = PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK_ITEMS.filter((item) => item.integrationReady);
    expect(romanized.length).toBeGreaterThanOrEqual(25);
    expect(traps.length).toBeGreaterThanOrEqual(12);
    expect(canada.length).toBeGreaterThanOrEqual(12);
    expect(finalQA.length).toBeGreaterThanOrEqual(8);
    expect(integration.length).toBeGreaterThanOrEqual(7);
  });

  it("covers the requested representative smoke domains", () => {
    const blob = PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK_ITEMS
      .map((item) => `${item.area} ${item.gurmukhi} ${item.romanization ?? ""} ${item.prompt_vi} ${item.prompt_en} ${item.passSignal_vi} ${item.passSignal_en}`)
      .join(" ");
    expect(blob).toMatch(/ਕ \/ ਖ|ਤ \/ ਟ|ਸ਼ਹਿਰ/);
    expect(blob).toMatch(/ਕਿ \/ ਕੀ|ਕੁ \/ ਕੂ|ਕੇ \/ ਕੈ \/ ਕੌ/);
    expect(blob).toMatch(/ਬੱਸ ਅੱਡਾ|ਮਾਂ|ਪੰਜਾਬ/);
    expect(blob).toMatch(/ਨਿਕਾਸ|ਐਮਰਜੈਂਸੀ|ਫਾਰਮੇਸੀ/);
    expect(blob).toMatch(/ਫਾਰਮ|ਐਪਾਇੰਟਮੈਂਟ|ਸਕੂਲ/);
    expect(blob).toMatch(/ਪਰਿਵਾਰ|ਦਵਾਈ|ਕਿਰਾਇਆ/);
    expect(blob).toMatch(/ਕਰਨਾ|ਲੈਣਾ|ਸਮਝ ਨਹੀਂ ਆਈ/);
    expect(blob).toMatch(/ਮਦਦ ਚਾਹੀਦੀ ਹੈ|ਫਾਰਮ ਭਰਨਾ|ਗਲਤੀ ਠੀਕ ਕਰਨਾ/);
    expect(blob).toMatch(/phal\/fal|vadda\/wadda|shahir\/shehar/);
  });

  it("uses smoke-check, final-QA, and integration-readiness item types", () => {
    const uses = new Set(PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK_ITEMS.map((item) => item.use));
    expect(uses.has("smoke_check")).toBe(true);
    expect(uses.has("final_qa")).toBe(true);
    expect(uses.has("integration_readiness")).toBe(true);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK_ITEMS.filter((item) => item.area === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK_SCOPE.vi,
      PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK_SCOPE.en,
      ...shahmukhi.map((item) => `${item.passSignal_vi} ${item.passSignal_en} ${item.repairPath_vi} ${item.repairPath_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not a full shahmukhi course|không phải khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK_SCOPE.noAudioScoringOrIntegration).toBe(true);
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio/);
  });
});
