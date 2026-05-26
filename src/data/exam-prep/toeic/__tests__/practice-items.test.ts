import { describe, it, expect } from "vitest";

import {
  TOEIC_PRACTICE_ITEMS,
  TOEIC_LISTENING_ITEMS,
  TOEIC_READING_ITEMS,
  filterPracticeItems,
  getPracticeItemById,
  type TOEICPart,
} from "../practice-items";

describe("TOEIC_PRACTICE_ITEMS — counts", () => {
  it("ships exactly 30 items total (15 listening + 15 reading)", () => {
    expect(TOEIC_PRACTICE_ITEMS).toHaveLength(30);
    expect(TOEIC_LISTENING_ITEMS).toHaveLength(15);
    expect(TOEIC_READING_ITEMS).toHaveLength(15);
  });

  it("listening items are part 1-4 only", () => {
    for (const item of TOEIC_LISTENING_ITEMS) {
      expect(item.section).toBe("listening");
      expect([1, 2, 3, 4]).toContain(item.part);
    }
  });

  it("reading items are part 5-7 only", () => {
    for (const item of TOEIC_READING_ITEMS) {
      expect(item.section).toBe("reading");
      expect([5, 6, 7]).toContain(item.part);
    }
  });

  it("covers reading parts 5, 6, 7 with at least 5 items each", () => {
    for (const part of [5, 6, 7] as TOEICPart[]) {
      const count = TOEIC_READING_ITEMS.filter((i) => i.part === part).length;
      expect(count, `Reading part ${part}`).toBeGreaterThanOrEqual(5);
    }
  });

  it("covers listening parts 1, 2, 3, 4 with at least 3 items each", () => {
    for (const part of [1, 2, 3, 4] as TOEICPart[]) {
      const count = TOEIC_LISTENING_ITEMS.filter((i) => i.part === part).length;
      expect(count, `Listening part ${part}`).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("TOEIC_PRACTICE_ITEMS — schema invariants", () => {
  it("every id is unique and namespaced toeic_<section>_*", () => {
    const ids = TOEIC_PRACTICE_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^toeic_(listening|reading)_/);
    }
  });

  it("each question has 3 (Part 2) or 4 options and a valid correct_index", () => {
    for (const item of TOEIC_PRACTICE_ITEMS) {
      for (const q of item.questions) {
        const expected = item.part === 2 ? 3 : 4;
        expect(q.options_en.length, `${item.id}`).toBe(expected);
        expect(q.correct_index).toBeGreaterThanOrEqual(0);
        expect(q.correct_index).toBeLessThan(q.options_en.length);
        expect(q.question_en.length).toBeGreaterThan(0);
        expect(q.explanation_vi.length).toBeGreaterThan(0);
      }
    }
  });

  it("every item has bilingual title, traps, vocabulary, and a non-empty passage", () => {
    for (const item of TOEIC_PRACTICE_ITEMS) {
      expect(item.title_vi.length, item.id).toBeGreaterThan(0);
      expect(item.title_en.length, item.id).toBeGreaterThan(0);
      expect(item.passage_or_audio_script.length, item.id).toBeGreaterThan(20);
      expect(item.typical_traps.length, item.id).toBeGreaterThan(0);
      expect(item.vocabulary_focus.length, item.id).toBeGreaterThan(0);
      for (const v of item.vocabulary_focus) {
        expect(v.word).toBeTruthy();
        expect(v.vi_translation).toBeTruthy();
        expect(v.ipa).toMatch(/\//);
        expect(v.common_collocations.length).toBeGreaterThan(0);
      }
      expect(item.estimated_time_minutes).toBeGreaterThan(0);
    }
  });

  it("only uses canonical target bands", () => {
    const valid = new Set([405, 605, 785, 905]);
    for (const item of TOEIC_PRACTICE_ITEMS) {
      expect(valid.has(item.level), item.id).toBe(true);
    }
  });
});

describe("filterPracticeItems / getPracticeItemById", () => {
  it("filters by section", () => {
    expect(filterPracticeItems({ section: "listening" })).toHaveLength(15);
    expect(filterPracticeItems({ section: "reading" })).toHaveLength(15);
  });

  it("filters by part", () => {
    expect(filterPracticeItems({ part: 1 }).every((i) => i.part === 1)).toBe(true);
    expect(filterPracticeItems({ part: 7 }).every((i) => i.part === 7)).toBe(true);
  });

  it("filters by topic", () => {
    const r = filterPracticeItems({ topic: "business_meeting" });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((i) => i.topic === "business_meeting")).toBe(true);
  });

  it("combined filters narrow correctly", () => {
    const r = filterPracticeItems({ section: "reading", part: 5 });
    expect(r.length).toBeGreaterThanOrEqual(5);
    expect(r.every((i) => i.section === "reading" && i.part === 5)).toBe(true);
  });

  it("getPracticeItemById returns the item or null", () => {
    const first = TOEIC_PRACTICE_ITEMS[0];
    expect(getPracticeItemById(first.id)).toBe(first);
    expect(getPracticeItemById("toeic_does_not_exist")).toBeNull();
  });
});
