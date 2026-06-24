// src/languages/punjabi/__tests__/punjabiThematicVocabularyDeck.test.ts
//
// Structural guards for the Punjabi thematic vocabulary deck.
// These tests do not assert native-level linguistic review; that is deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_THEMATIC_VOCABULARY_DECK,
  PUNJABI_THEMATIC_VOCABULARY_ENTRIES,
  PUNJABI_THEMATIC_VOCABULARY_SCOPE,
  type PunjabiThematicVocabularyTheme,
} from "@/languages/punjabi/thematicVocabularyDeck";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_THEMES: ReadonlyArray<PunjabiThematicVocabularyTheme> = [
  "home",
  "family",
  "food",
  "work",
  "school",
  "health",
  "public_services",
  "transport",
  "housing",
  "money",
  "emotions",
  "common_verbs",
];

describe("Punjabi thematic vocabulary deck", () => {
  it("is app-consumable sectioned TypeScript data", () => {
    expect(PUNJABI_THEMATIC_VOCABULARY_DECK.length).toBe(REQUIRED_THEMES.length);
    for (const section of PUNJABI_THEMATIC_VOCABULARY_DECK) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.purpose_vi.trim().length).toBeGreaterThan(20);
      expect(section.purpose_en.trim().length).toBeGreaterThan(20);
      expect(section.entries.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("covers all Wave 5 themes", () => {
    const themes = new Set(PUNJABI_THEMATIC_VOCABULARY_DECK.map((section) => section.theme));
    for (const theme of REQUIRED_THEMES) {
      expect(themes.has(theme), `missing ${theme}`).toBe(true);
    }
  });

  it("has enough compact entries to be useful", () => {
    expect(PUNJABI_THEMATIC_VOCABULARY_ENTRIES.length).toBeGreaterThanOrEqual(70);
    expect(PUNJABI_THEMATIC_VOCABULARY_ENTRIES.length).toBeLessThanOrEqual(140);
  });

  it("uses Gurmukhi primary with romanization and bilingual glosses", () => {
    for (const entry of PUNJABI_THEMATIC_VOCABULARY_ENTRIES) {
      expect(GURMUKHI_RANGE.test(entry.gurmukhi), `Gurmukhi for ${entry.id}`).toBe(true);
      expect(entry.romanization.trim().length, `romanization for ${entry.id}`).toBeGreaterThan(0);
      expect(entry.vi.trim().length, `vi for ${entry.id}`).toBeGreaterThan(0);
      expect(entry.en.trim().length, `en for ${entry.id}`).toBeGreaterThan(0);
    }
  });

  it("keeps ids unique and themes aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_THEMATIC_VOCABULARY_DECK) {
      for (const entry of section.entries) {
        expect(ids.has(entry.id), `duplicate id: ${entry.id}`).toBe(false);
        expect(entry.theme).toBe(section.theme);
        ids.add(entry.id);
      }
    }
  });

  it("includes learner traps and Canada-practical examples", () => {
    const traps = PUNJABI_THEMATIC_VOCABULARY_ENTRIES.filter((entry) => entry.learnerTrap);
    const canada = PUNJABI_THEMATIC_VOCABULARY_ENTRIES.filter((entry) => entry.canadaPractical);
    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(canada.length).toBeGreaterThanOrEqual(14);
    expect(canada.some((entry) => entry.gurmukhi === "ਡਾਲਰ")).toBe(true);
    expect(canada.some((entry) => entry.gurmukhi === "ਫਾਰਮੇਸੀ")).toBe(true);
  });

  it("includes useful bilingual examples where practical", () => {
    const examples = PUNJABI_THEMATIC_VOCABULARY_ENTRIES.filter((entry) => entry.exampleGurmukhi);
    expect(examples.length).toBeGreaterThanOrEqual(4);
    for (const entry of examples) {
      expect(GURMUKHI_RANGE.test(entry.exampleGurmukhi ?? ""), `example for ${entry.id}`).toBe(true);
      expect(entry.exampleRomanization?.trim().length ?? 0).toBeGreaterThan(0);
      expect(entry.example_vi?.trim().length ?? 0).toBeGreaterThan(0);
      expect(entry.example_en?.trim().length ?? 0).toBeGreaterThan(0);
    }
  });

  it("keeps Shahmukhi as awareness only and avoids native-review claims", () => {
    const blob = `${PUNJABI_THEMATIC_VOCABULARY_SCOPE.vi} ${PUNJABI_THEMATIC_VOCABULARY_SCOPE.en}`.toLowerCase();
    expect(blob).toMatch(/shahmukhi/);
    expect(blob).toMatch(/not a full shahmukhi course|không phải khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native/);
  });

  it("states no pronunciation scoring", () => {
    const blob = [
      PUNJABI_THEMATIC_VOCABULARY_SCOPE.vi,
      PUNJABI_THEMATIC_VOCABULARY_SCOPE.en,
      ...PUNJABI_THEMATIC_VOCABULARY_ENTRIES.flatMap((entry) => [
        entry.learnerTrap?.vi ?? "",
        entry.learnerTrap?.en ?? "",
      ]),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not pronunciation scoring|không phải phát âm chấm điểm/);
  });
});
