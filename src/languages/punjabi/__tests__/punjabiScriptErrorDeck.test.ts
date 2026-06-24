// src/languages/punjabi/__tests__/punjabiScriptErrorDeck.test.ts
//
// Structural guards for the Punjabi Gurmukhi script error deck.
// These tests do not assert native-level linguistic review; that is deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_ERROR_DECK,
  PUNJABI_SCRIPT_ERROR_ENTRIES,
  PUNJABI_SCRIPT_ERROR_SCOPE,
  type PunjabiScriptErrorCategory,
} from "@/languages/punjabi/scriptErrorDeck";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_CATEGORIES: ReadonlyArray<PunjabiScriptErrorCategory> = [
  "look_alike_letters",
  "vowel_signs",
  "addak",
  "tippi_bindi",
  "romanization_traps",
  "word_boundary",
  "reading_repair",
  "shahmukhi_awareness",
];

describe("Punjabi script error deck", () => {
  it("is app-consumable sectioned TypeScript data", () => {
    expect(PUNJABI_SCRIPT_ERROR_DECK.length).toBe(REQUIRED_CATEGORIES.length);
    for (const section of PUNJABI_SCRIPT_ERROR_DECK) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.focus_vi.trim().length).toBeGreaterThan(20);
      expect(section.focus_en.trim().length).toBeGreaterThan(20);
      expect(section.entries.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 6 error categories", () => {
    const categories = new Set(PUNJABI_SCRIPT_ERROR_DECK.map((section) => section.category));
    for (const category of REQUIRED_CATEGORIES) {
      expect(categories.has(category), `missing ${category}`).toBe(true);
    }
  });

  it("has enough compact entries to be useful", () => {
    expect(PUNJABI_SCRIPT_ERROR_ENTRIES.length).toBeGreaterThanOrEqual(35);
    expect(PUNJABI_SCRIPT_ERROR_ENTRIES.length).toBeLessThanOrEqual(90);
  });

  it("uses Gurmukhi primary with bilingual error and repair text", () => {
    for (const entry of PUNJABI_SCRIPT_ERROR_ENTRIES) {
      expect(GURMUKHI_RANGE.test(entry.gurmukhi), `Gurmukhi for ${entry.id}`).toBe(true);
      expect(entry.errorPattern_vi.trim().length, `error vi for ${entry.id}`).toBeGreaterThan(20);
      expect(entry.errorPattern_en.trim().length, `error en for ${entry.id}`).toBeGreaterThan(20);
      expect(entry.repair_vi.trim().length, `repair vi for ${entry.id}`).toBeGreaterThan(20);
      expect(entry.repair_en.trim().length, `repair en for ${entry.id}`).toBeGreaterThan(20);
      expect(entry.drillPrompt_vi.trim().length, `prompt vi for ${entry.id}`).toBeGreaterThan(10);
      expect(entry.drillPrompt_en.trim().length, `prompt en for ${entry.id}`).toBeGreaterThan(10);
    }
  });

  it("includes romanization where useful", () => {
    const romanized = PUNJABI_SCRIPT_ERROR_ENTRIES.filter((entry) => entry.romanization);
    expect(romanized.length).toBeGreaterThan(30);
  });

  it("keeps ids unique and category fields aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_ERROR_DECK) {
      for (const entry of section.entries) {
        expect(ids.has(entry.id), `duplicate id: ${entry.id}`).toBe(false);
        expect(entry.category).toBe(section.category);
        ids.add(entry.id);
      }
    }
  });

  it("includes Canada-practical repair examples", () => {
    const canada = PUNJABI_SCRIPT_ERROR_ENTRIES.filter((entry) => entry.canadaPractical);
    expect(canada.length).toBeGreaterThanOrEqual(14);
    expect(canada.some((entry) => entry.gurmukhi === "ਫਾਰਮੇਸੀ")).toBe(true);
    expect(canada.some((entry) => entry.gurmukhi === "ਰੇਲਵੇ ਸਟੇਸ਼ਨ")).toBe(true);
    expect(canada.some((entry) => entry.gurmukhi === "ਕਿਰਾਇਆ")).toBe(true);
  });

  it("keeps Shahmukhi as awareness only and avoids native-review claims", () => {
    const shahmukhi = PUNJABI_SCRIPT_ERROR_ENTRIES.filter((entry) => entry.category === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_ERROR_SCOPE.vi,
      PUNJABI_SCRIPT_ERROR_SCOPE.en,
      ...shahmukhi.flatMap((entry) => [entry.repair_vi, entry.repair_en]),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not a full shahmukhi course|không phải khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native/);
  });

  it("states no pronunciation scoring", () => {
    const blob = [
      PUNJABI_SCRIPT_ERROR_SCOPE.vi,
      PUNJABI_SCRIPT_ERROR_SCOPE.en,
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not pronunciation scoring|không phải phát âm chấm điểm/);
  });
});
