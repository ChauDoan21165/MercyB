// src/languages/punjabi/__tests__/punjabiScriptVocabularyCapstone.test.ts
//
// Structural guards for the Punjabi script and vocabulary capstone.
// These tests do not assert native-level linguistic review; that is deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_CAPSTONE,
  PUNJABI_SCRIPT_VOCABULARY_CAPSTONE_ITEMS,
  PUNJABI_SCRIPT_VOCABULARY_CAPSTONE_SCOPE,
  type PunjabiCapstoneSkill,
} from "@/languages/punjabi/scriptVocabularyCapstone";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_SKILLS: ReadonlyArray<PunjabiCapstoneSkill> = [
  "gurmukhi_recognition",
  "vowel_signs",
  "common_words",
  "survival_signage",
  "thematic_vocabulary",
  "high_frequency_verbs",
  "collocations",
  "romanization_bridge",
  "checkpoint",
  "shahmukhi_awareness",
];

describe("Punjabi script and vocabulary capstone", () => {
  it("is app-consumable sectioned TypeScript data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_CAPSTONE.length).toBe(REQUIRED_SKILLS.length);
    for (const section of PUNJABI_SCRIPT_VOCABULARY_CAPSTONE) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.goal_vi.trim().length).toBeGreaterThan(20);
      expect(section.goal_en.trim().length).toBeGreaterThan(20);
      expect(section.items.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 10 capstone skills", () => {
    const skills = new Set(PUNJABI_SCRIPT_VOCABULARY_CAPSTONE.map((section) => section.skill));
    for (const skill of REQUIRED_SKILLS) {
      expect(skills.has(skill), `missing ${skill}`).toBe(true);
    }
  });

  it("has enough compact capstone items to be useful", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_CAPSTONE_ITEMS.length).toBeGreaterThanOrEqual(35);
    expect(PUNJABI_SCRIPT_VOCABULARY_CAPSTONE_ITEMS.length).toBeLessThanOrEqual(80);
  });

  it("uses Gurmukhi primary with bilingual prompts and answers", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_CAPSTONE_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.prompt_vi.trim().length, `prompt vi for ${item.id}`).toBeGreaterThan(15);
      expect(item.prompt_en.trim().length, `prompt en for ${item.id}`).toBeGreaterThan(15);
      expect(item.expected_vi.trim().length, `expected vi for ${item.id}`).toBeGreaterThan(20);
      expect(item.expected_en.trim().length, `expected en for ${item.id}`).toBeGreaterThan(20);
    }
  });

  it("includes romanization where useful", () => {
    const romanized = PUNJABI_SCRIPT_VOCABULARY_CAPSTONE_ITEMS.filter((item) => item.romanization);
    expect(romanized.length).toBeGreaterThan(30);
  });

  it("keeps ids unique and skills aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_VOCABULARY_CAPSTONE) {
      for (const item of section.items) {
        expect(ids.has(item.id), `duplicate id: ${item.id}`).toBe(false);
        expect(item.skill).toBe(section.skill);
        ids.add(item.id);
      }
    }
  });

  it("includes learner traps, Canada-practical examples, and checkpoint items", () => {
    const traps = PUNJABI_SCRIPT_VOCABULARY_CAPSTONE_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_SCRIPT_VOCABULARY_CAPSTONE_ITEMS.filter((item) => item.canadaPractical);
    const checkpoints = PUNJABI_SCRIPT_VOCABULARY_CAPSTONE_ITEMS.filter((item) => item.checkpoint);
    expect(traps.length).toBeGreaterThanOrEqual(12);
    expect(canada.length).toBeGreaterThanOrEqual(18);
    expect(checkpoints.length).toBeGreaterThanOrEqual(5);
    expect(checkpoints.some((item) => item.gurmukhi === "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ")).toBe(true);
  });

  it("includes Gurmukhi and romanization bridge review", () => {
    const bridge = PUNJABI_SCRIPT_VOCABULARY_CAPSTONE_ITEMS.filter((item) => item.skill === "romanization_bridge");
    expect(bridge.length).toBeGreaterThanOrEqual(4);
    const blob = bridge.map((item) => `${item.gurmukhi} ${item.romanization} ${item.expected_vi} ${item.expected_en} ${item.learnerTrap?.vi ?? ""} ${item.learnerTrap?.en ?? ""}`).join(" ");
    expect(blob).toMatch(/phal\/fal|vadda\/wadda|shahir\/shehar/);
    expect(blob).toMatch(/Gurmukhi|romanization/);
  });

  it("keeps Shahmukhi as awareness only and avoids native-review claims", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_CAPSTONE_ITEMS.filter((item) => item.skill === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_VOCABULARY_CAPSTONE_SCOPE.vi,
      PUNJABI_SCRIPT_VOCABULARY_CAPSTONE_SCOPE.en,
      ...shahmukhi.map((item) => `${item.expected_vi} ${item.expected_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not a full shahmukhi course|không phải khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native/);
  });

  it("states no pronunciation scoring", () => {
    const blob = `${PUNJABI_SCRIPT_VOCABULARY_CAPSTONE_SCOPE.vi} ${PUNJABI_SCRIPT_VOCABULARY_CAPSTONE_SCOPE.en}`.toLowerCase();
    expect(blob).toMatch(/not pronunciation scoring|không phải phát âm chấm điểm/);
  });
});
