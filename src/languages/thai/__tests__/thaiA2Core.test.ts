// src/languages/thai/__tests__/thaiA2Core.test.ts
//
// Structural guards for the Thai A2 "core" lesson batch (A3 agent).
// These tests pin the contract the lesson UI relies on — they do NOT
// assert linguistic correctness (native review is deferred). They check
// that every lesson is A2, carries Thai script + romanization, and gives
// BOTH a Vietnamese and an English explanation.

import { describe, it, expect } from "vitest";

import { lessons } from "@/languages/thai/lessons-a2-core";

// Any character in the Thai Unicode block (U+0E00–U+0E7F).
const THAI_SCRIPT = /[฀-๿]/;
const hasThai = (s: string) => THAI_SCRIPT.test(s);
const nonEmpty = (s: unknown): s is string =>
  typeof s === "string" && s.trim().length > 0;

const FOCUS_CATEGORIES = [
  "daily_life",
  "past_future",
  "classifiers",
  "locations",
  "transport",
  "appointments",
  "shopping",
  "asking_help",
  "family",
  "opinions",
] as const;

describe("Thai A2 core — batch shape", () => {
  it("ships 10–15 compact lessons", () => {
    expect(lessons.length).toBeGreaterThanOrEqual(10);
    expect(lessons.length).toBeLessThanOrEqual(15);
  });

  it("every lesson is level A2", () => {
    for (const l of lessons) expect(l.level).toBe("A2");
  });

  it("lesson ids are unique and namespaced to thai_a2", () => {
    const ids = lessons.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.startsWith("thai_a2")).toBe(true);
  });

  it("covers every required A2 focus area at least once", () => {
    const present = new Set(lessons.map((l) => l.category));
    for (const cat of FOCUS_CATEGORIES) expect(present.has(cat)).toBe(true);
  });
});

describe("Thai A2 core — bilingual + script contract", () => {
  it("each lesson has VI and EN titles and word-order notes", () => {
    for (const l of lessons) {
      expect(nonEmpty(l.title_vi)).toBe(true);
      expect(nonEmpty(l.title_en)).toBe(true);
      expect(nonEmpty(l.word_order_note_vi)).toBe(true);
      expect(nonEmpty(l.word_order_note_en)).toBe(true);
      expect(nonEmpty(l.cultural_notes_vi)).toBe(true);
      expect(nonEmpty(l.cultural_notes_en)).toBe(true);
      expect(nonEmpty(l.tip_advice_vi)).toBe(true);
      expect(nonEmpty(l.tip_advice_en)).toBe(true);
    }
  });

  it("every lesson has 3+ sentences, each with Thai script, romanization, VI + EN", () => {
    for (const l of lessons) {
      expect(l.sentences.length).toBeGreaterThanOrEqual(3);
      for (const s of l.sentences) {
        expect(hasThai(s.th)).toBe(true);
        expect(nonEmpty(s.rtgs)).toBe(true);
        expect(nonEmpty(s.vi)).toBe(true);
        expect(nonEmpty(s.en)).toBe(true);
        expect(s.focus_vi.length).toBeGreaterThan(0);
        expect(s.focus_en.length).toBeGreaterThan(0);
      }
    }
  });

  it("vocabulary entries carry Thai script, romanization, EN + VI gloss", () => {
    for (const l of lessons) {
      expect(l.vocabulary && l.vocabulary.length).toBeTruthy();
      for (const v of l.vocabulary ?? []) {
        expect(hasThai(v.word)).toBe(true);
        expect(nonEmpty(v.rtgs)).toBe(true);
        expect(nonEmpty(v.en)).toBe(true);
        expect(nonEmpty(v.vi)).toBe(true);
      }
    }
  });

  it("dialogue lines are in Thai script with romanization", () => {
    for (const l of lessons) {
      for (const d of l.dialogue ?? []) {
        expect(hasThai(d.th)).toBe(true);
        expect(nonEmpty(d.rtgs)).toBe(true);
      }
    }
  });

  it("L1 notes give both a Vietnamese and an English fix", () => {
    for (const l of lessons) {
      for (const n of l.l1_notes_vi ?? []) {
        expect(nonEmpty(n.mistake)).toBe(true);
        expect(nonEmpty(n.fix_vi)).toBe(true);
        expect(nonEmpty(n.fix_en)).toBe(true);
      }
    }
  });
});
