// src/languages/punjabi/__tests__/punjabiGurmukhiReadingLadder.test.ts
//
// Structural guards for the Punjabi Gurmukhi reading ladder.
// These tests do not assert native-level linguistic review; that is deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_GURMUKHI_READING_LADDER,
  PUNJABI_GURMUKHI_READING_LADDER_ENTRIES,
  PUNJABI_GURMUKHI_READING_LADDER_SCOPE,
  type PunjabiReadingLadderStage,
} from "@/languages/punjabi/gurmukhiReadingLadder";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_STAGES: ReadonlyArray<PunjabiReadingLadderStage> = [
  "letters",
  "vowel_signs",
  "syllables",
  "addak",
  "nasal_marks",
  "word_reading",
  "short_phrases",
  "canada_survival",
  "romanization_bridge",
  "shahmukhi_awareness",
];

describe("Punjabi Gurmukhi reading ladder", () => {
  it("is app-consumable sectioned TypeScript data", () => {
    expect(PUNJABI_GURMUKHI_READING_LADDER.length).toBe(REQUIRED_STAGES.length);
    for (const section of PUNJABI_GURMUKHI_READING_LADDER) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.goal_vi.trim().length).toBeGreaterThan(20);
      expect(section.goal_en.trim().length).toBeGreaterThan(20);
      expect(section.entries.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 4 reading stages", () => {
    const stages = new Set(PUNJABI_GURMUKHI_READING_LADDER.map((section) => section.stage));
    for (const stage of REQUIRED_STAGES) {
      expect(stages.has(stage), `missing ${stage}`).toBe(true);
    }
  });

  it("has enough compact ladder entries to be useful", () => {
    expect(PUNJABI_GURMUKHI_READING_LADDER_ENTRIES.length).toBeGreaterThanOrEqual(70);
    expect(PUNJABI_GURMUKHI_READING_LADDER_ENTRIES.length).toBeLessThanOrEqual(120);
  });

  it("uses Gurmukhi primary with bilingual explanations", () => {
    for (const entry of PUNJABI_GURMUKHI_READING_LADDER_ENTRIES) {
      expect(GURMUKHI_RANGE.test(entry.gurmukhi), `Gurmukhi for ${entry.id}`).toBe(true);
      expect(entry.vi.trim().length, `vi for ${entry.id}`).toBeGreaterThan(10);
      expect(entry.en.trim().length, `en for ${entry.id}`).toBeGreaterThan(10);
    }
  });

  it("includes romanization where useful", () => {
    const romanized = PUNJABI_GURMUKHI_READING_LADDER_ENTRIES.filter((entry) => entry.romanization);
    expect(romanized.length).toBeGreaterThan(55);
  });

  it("includes learner traps and Canada-practical examples", () => {
    const traps = PUNJABI_GURMUKHI_READING_LADDER_ENTRIES.filter((entry) => entry.learnerTrap);
    const canada = PUNJABI_GURMUKHI_READING_LADDER_ENTRIES.filter((entry) => entry.canadaPractical);
    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(canada.length).toBeGreaterThanOrEqual(6);
    expect(canada.some((entry) => entry.gurmukhi === "ਕੈਨੇਡਾ")).toBe(true);
  });

  it("keeps ids unique", () => {
    const ids = new Set<string>();
    for (const entry of PUNJABI_GURMUKHI_READING_LADDER_ENTRIES) {
      expect(ids.has(entry.id), `duplicate id: ${entry.id}`).toBe(false);
      ids.add(entry.id);
    }
  });

  it("keeps Shahmukhi as awareness only and avoids native-review claims", () => {
    const shahmukhi = PUNJABI_GURMUKHI_READING_LADDER_ENTRIES.filter((entry) => entry.stage === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_GURMUKHI_READING_LADDER_SCOPE.vi,
      PUNJABI_GURMUKHI_READING_LADDER_SCOPE.en,
      ...shahmukhi.map((entry) => `${entry.vi} ${entry.en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not a full shahmukhi course|không phải khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native/);
  });

  it("states no pronunciation scoring", () => {
    const blob = [
      PUNJABI_GURMUKHI_READING_LADDER_SCOPE.vi,
      PUNJABI_GURMUKHI_READING_LADDER_SCOPE.en,
      ...PUNJABI_GURMUKHI_READING_LADDER_ENTRIES.flatMap((entry) => [
        entry.vi,
        entry.en,
        entry.learnerTrap?.vi ?? "",
        entry.learnerTrap?.en ?? "",
      ]),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not pronunciation scoring|không phải phát âm chấm điểm/);
  });
});
