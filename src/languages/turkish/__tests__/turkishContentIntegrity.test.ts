import { describe, expect, it } from "vitest";

import {
  TURKISH_LESSONS_BY_LEVEL,
  TURKISH_TOTAL_LESSONS,
  allTurkishLessons,
  normalizeTurkishLesson,
  type TurkishLevel,
  type TurkishLessonInput,
} from "../index";

const levels: TurkishLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

function expectText(value: string | undefined, label: string) {
  expect(value?.trim(), label).toBeTruthy();
}

function expectCoreFields(lesson: TurkishLessonInput) {
  expectText(lesson.id, "id");
  expectText(lesson.title_vi, `${lesson.id} title_vi`);
  expectText(lesson.title_en, `${lesson.id} title_en`);
  expectText(lesson.cultural_notes_vi, `${lesson.id} cultural_notes_vi`);
  expectText(lesson.cultural_notes_en, `${lesson.id} cultural_notes_en`);
  expectText(lesson.tip_advice_vi, `${lesson.id} tip_advice_vi`);
  expectText(lesson.tip_advice_en, `${lesson.id} tip_advice_en`);
  expect(lesson.sentences.length, `${lesson.id} sentences`).toBeGreaterThan(0);
  expect(lesson.vocabulary.length, `${lesson.id} vocabulary`).toBeGreaterThan(0);

  for (const sentence of lesson.sentences) {
    expectText(sentence.tr, `${lesson.id} sentence tr`);
    expectText(sentence.en, `${lesson.id} sentence en`);
    expectText(sentence.vi, `${lesson.id} sentence vi`);
  }

  for (const entry of lesson.vocabulary) {
    expectText(entry.word, `${lesson.id} vocab word`);
    expectText(entry.en, `${lesson.id} vocab en`);
    expectText(entry.vi, `${lesson.id} vocab vi`);
    expectText(entry.pronunciation_vi, `${lesson.id} vocab pronunciation_vi`);
  }
}

describe("Turkish content integrity", () => {
  it("registers all six CEFR levels with five lessons each", () => {
    expect(Object.keys(TURKISH_LESSONS_BY_LEVEL)).toEqual(levels);
    expect(TURKISH_TOTAL_LESSONS).toBe(30);
    expect(allTurkishLessons).toHaveLength(30);

    for (const level of levels) {
      expect(TURKISH_LESSONS_BY_LEVEL[level], level).toHaveLength(5);
    }
  });

  it("keeps lesson ids unique and core fields populated", () => {
    const ids = new Set<string>();

    for (const lesson of allTurkishLessons) {
      expect(ids.has(lesson.id), lesson.id).toBe(false);
      ids.add(lesson.id);
      expectCoreFields(lesson);
    }
  });

  it("normalizes at least one lesson per level", () => {
    for (const level of levels) {
      const normalized = normalizeTurkishLesson(TURKISH_LESSONS_BY_LEVEL[level][0]);

      expect(normalized.level).toBe(level);
      expectText(normalized.title.vi, `${level} normalized title vi`);
      expectText(normalized.title.en, `${level} normalized title en`);
      expect(normalized.sentences.length, `${level} normalized sentences`).toBeGreaterThan(0);
      expect(normalized.vocabulary?.length, `${level} normalized vocabulary`).toBeGreaterThan(0);
    }
  });
});
