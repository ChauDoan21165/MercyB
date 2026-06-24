// src/languages/punjabi/__tests__/punjabiLearningPath.test.ts
//
// Guards the Punjabi Wave 4 learning path foundation.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_CANADA_PRACTICAL_PATH,
  PUNJABI_LEARNER_ROUTES,
  PUNJABI_LEARNING_PATH,
  PUNJABI_LEARNING_PATH_SCRIPT_NOTE,
  PUNJABI_LEARNING_PATH_WARNINGS,
  PUNJABI_PATH_STAGES,
} from "../learningPath";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const CANADA_DOMAINS = ["settlement", "work", "health", "public_service"];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(PUNJABI_LEARNING_PATH);
  return out;
}

describe("Punjabi learning path - A1-C2 stages", () => {
  it("covers A1-C2 in order", () => {
    expect(PUNJABI_PATH_STAGES.map((stage) => stage.level)).toEqual(ALL_LEVELS);
  });

  it("each stage is app-consumable bilingual data with Gurmukhi and romanization", () => {
    for (const stage of PUNJABI_PATH_STAGES) {
      expect(stage.id.length).toBeGreaterThan(0);
      expect(stage.title_pa).toMatch(GURMUKHI);
      expect(stage.romanization.length).toBeGreaterThan(0);
      expect(stage.title_vi.length).toBeGreaterThan(0);
      expect(stage.title_en.length).toBeGreaterThan(0);
      expect(stage.goal_vi.length).toBeGreaterThan(0);
      expect(stage.goal_en.length).toBeGreaterThan(0);
      expect(stage.can_do.length).toBeGreaterThanOrEqual(2);
      for (const item of stage.can_do) {
        expect(item.gurmukhi).toMatch(GURMUKHI);
        expect(item.romanization.length).toBeGreaterThan(0);
        expect(item.vi.length).toBeGreaterThan(0);
        expect(item.en.length).toBeGreaterThan(0);
      }
    }
  });

  it("includes common learner traps in Vietnamese and English", () => {
    for (const stage of PUNJABI_PATH_STAGES) {
      expect(stage.learner_traps_vi.length).toBeGreaterThan(0);
      expect(stage.learner_traps_en.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi learning path - learner routes", () => {
  it("has routes for Vietnamese-speaking and English-speaking learners", () => {
    const audiences = new Set(PUNJABI_LEARNER_ROUTES.map((route) => route.audience));
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
  });

  it("routes reference real stage ids and include bilingual notes", () => {
    const stageIds = new Set(PUNJABI_PATH_STAGES.map((stage) => stage.id));
    for (const route of PUNJABI_LEARNER_ROUTES) {
      expect(route.sequence.length).toBe(PUNJABI_PATH_STAGES.length);
      for (const id of route.sequence) expect(stageIds.has(id)).toBe(true);
      expect(route.route_vi.length).toBeGreaterThan(0);
      expect(route.route_en.length).toBeGreaterThan(0);
      expect(route.notes_vi.length).toBeGreaterThan(0);
      expect(route.notes_en.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi learning path - Canada practical path", () => {
  it("covers settlement, work, health, and public-service domains", () => {
    const domains = new Set(PUNJABI_CANADA_PRACTICAL_PATH.map((entry) => entry.domain));
    for (const domain of CANADA_DOMAINS) expect(domains.has(domain)).toBe(true);
  });

  it("includes Canada-practical Gurmukhi examples with romanization, VI, and EN", () => {
    for (const entry of PUNJABI_CANADA_PRACTICAL_PATH) {
      expect(entry.title_pa).toMatch(GURMUKHI);
      expect(entry.romanization.length).toBeGreaterThan(0);
      expect(entry.practical_goal_vi.length).toBeGreaterThan(0);
      expect(entry.practical_goal_en.length).toBeGreaterThan(0);
      expect(entry.examples.length).toBeGreaterThanOrEqual(2);
      for (const example of entry.examples) {
        expect(example.gurmukhi).toMatch(GURMUKHI);
        expect(example.romanization.length).toBeGreaterThan(0);
        expect(example.vi.length).toBeGreaterThan(0);
        expect(example.en.length).toBeGreaterThan(0);
      }
      expect(entry.common_trap_vi.length).toBeGreaterThan(0);
      expect(entry.common_trap_en.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi learning path - scope warnings", () => {
  it("declares Gurmukhi primary and Shahmukhi awareness only", () => {
    expect(PUNJABI_LEARNING_PATH.primary_script).toBe("Gurmukhi");
    expect(PUNJABI_LEARNING_PATH.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_LEARNING_PATH_SCRIPT_NOTE.vi.toLowerCase()).toContain("shahmukhi");
    expect(PUNJABI_LEARNING_PATH_SCRIPT_NOTE.en.toLowerCase()).toContain("awareness");
  });

  it("states native review is deferred and audio/scoring are out of scope", () => {
    expect(PUNJABI_LEARNING_PATH_WARNINGS.native_review.en.toLowerCase()).toContain("deferred");
    expect(PUNJABI_LEARNING_PATH_WARNINGS.native_review.en.toLowerCase()).not.toContain("native-reviewed");
    expect(PUNJABI_LEARNING_PATH_WARNINGS.audio.en.toLowerCase()).toContain("no audio");
    expect(PUNJABI_LEARNING_PATH_WARNINGS.audio.en.toLowerCase()).toContain("pronunciation scoring");
  });
});

describe("Punjabi learning path - no unrelated scripts", () => {
  const strings = allStrings();

  it("does not include Shahmukhi-script content", () => {
    for (const s of strings) expect(s).not.toMatch(SHAHMUKHI);
  });

  it("contains no CJK, Hangul, kana, or Cyrillic script", () => {
    for (const s of strings) {
      expect(s).not.toMatch(CJK);
      expect(s).not.toMatch(HANGUL);
      expect(s).not.toMatch(KANA);
      expect(s).not.toMatch(CYRILLIC);
    }
  });
});
