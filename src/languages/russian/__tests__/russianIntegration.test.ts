import { describe, expect, it } from "vitest";

// Everything below is imported through the Russian language module's public
// entrypoint (`@/languages/russian`) to prove the A1–C2 batches, survival
// content, vocabulary, and error patterns are discoverable post-integration.
import {
  RUSSIAN_CATEGORIES,
  RUSSIAN_LANGUAGE_META,
  RUSSIAN_LEVEL_COUNTS,
  RUSSIAN_TOTAL_LESSONS,
  loadAllLessons,
  loadLessonsForLevel,
  normalizeRussianLesson,
  russianA1CoreLessons,
  russianA2CoreLessons,
  russianB1CoreLessons,
  russianB2CoreLessons,
  russianC1ReadingListeningLessons,
  russianC1SpeakingWritingLessons,
  russianC2DiscourseLessons,
  russianC2DomainsLessons,
  russianSurvivalLessons,
  SURVIVAL_LESSON_COUNT,
  RUSSIAN_VOCABULARY,
  RUSSIAN_VOCABULARY_COUNT,
  getRussianVocabularyByLevel,
  RUSSIAN_ERROR_PATTERNS,
  RUSSIAN_ERROR_PATTERN_COUNT,
  getRussianErrorPatternsByBucket,
} from "@/languages/russian";
import type { RussianLesson } from "@/languages/russian";

const CYRILLIC_RE = /[Ѐ-ӿ]/;
const CJK_HANGUL_JAPANESE_RE = /[぀-ヿ㐀-鿿가-힯]/;

function lessonText(lesson: RussianLesson): string {
  return lesson.sentences.map((sentence) => sentence.russian).join(" ");
}

describe("Russian module integration (A1–C2 + survival + data)", () => {
  const batchesByLevel: Array<{
    level: RussianLesson["level"] | "C1" | "C2";
    expectLevels: string[];
    lessons: RussianLesson[];
  }> = [
    { level: "A1", expectLevels: ["A1"], lessons: russianA1CoreLessons },
    { level: "A2", expectLevels: ["A2"], lessons: russianA2CoreLessons },
    { level: "B1", expectLevels: ["B1"], lessons: russianB1CoreLessons },
    { level: "B2", expectLevels: ["B2"], lessons: russianB2CoreLessons },
    {
      level: "C1",
      expectLevels: ["C1"],
      lessons: russianC1ReadingListeningLessons,
    },
    {
      level: "C1",
      expectLevels: ["C1"],
      lessons: russianC1SpeakingWritingLessons,
    },
    { level: "C2", expectLevels: ["C2"], lessons: russianC2DiscourseLessons },
    { level: "C2", expectLevels: ["C2"], lessons: russianC2DomainsLessons },
  ];

  it("exposes every CEFR batch through the module entrypoint", () => {
    for (const batch of batchesByLevel) {
      expect(Array.isArray(batch.lessons)).toBe(true);
      expect(batch.lessons.length).toBeGreaterThan(0);
      for (const lesson of batch.lessons) {
        expect(batch.expectLevels).toContain(lesson.level);
        expect(lesson.id).toBeTruthy();
        expect(lesson.sentences.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps lesson ids unique across all integrated batches", () => {
    const allBatchLessons = batchesByLevel.flatMap((batch) => batch.lessons);
    const ids = allBatchLessons.map((lesson) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("exposes survival content with a consistent count", () => {
    expect(russianSurvivalLessons.length).toBeGreaterThan(0);
    expect(SURVIVAL_LESSON_COUNT).toBe(russianSurvivalLessons.length);
    for (const lesson of russianSurvivalLessons) {
      expect(lesson.id).toMatch(/^russian_survival_/);
    }
  });

  it("exposes vocabulary and error patterns through the module entrypoint", () => {
    expect(RUSSIAN_VOCABULARY.length).toBeGreaterThan(0);
    expect(RUSSIAN_VOCABULARY_COUNT).toBe(RUSSIAN_VOCABULARY.length);
    expect(getRussianVocabularyByLevel("A1").length).toBeGreaterThan(0);

    expect(RUSSIAN_ERROR_PATTERNS.length).toBeGreaterThan(0);
    expect(RUSSIAN_ERROR_PATTERN_COUNT).toBe(RUSSIAN_ERROR_PATTERNS.length);
    expect(getRussianErrorPatternsByBucket("cases").length).toBeGreaterThan(0);
  });

  it("normalizes integrated lessons through the shared renderer shape", () => {
    const sample = [
      russianA1CoreLessons[0],
      russianB2CoreLessons[0],
      russianC2DiscourseLessons[0],
      russianSurvivalLessons[0],
    ];
    for (const lesson of sample) {
      const normalized = normalizeRussianLesson(lesson);
      expect(normalized.title.native).toBe("Русский");
      expect(normalized.level).toBe(lesson.level);
      expect(normalized.sentences.length).toBeGreaterThan(0);
    }
  });

  it("preserves the foundation loader behavior (B2/C1/C2 stay unconverted)", async () => {
    expect(RUSSIAN_LANGUAGE_META.code).toBe("ru");
    expect(RUSSIAN_CATEGORIES.length).toBeGreaterThan(0);
    expect(RUSSIAN_LEVEL_COUNTS.B2).toBe(0);
    expect(RUSSIAN_LEVEL_COUNTS.C1).toBe(0);
    expect(RUSSIAN_LEVEL_COUNTS.C2).toBe(0);
    expect(RUSSIAN_TOTAL_LESSONS).toBe(
      RUSSIAN_LEVEL_COUNTS.A1 + RUSSIAN_LEVEL_COUNTS.A2 + RUSSIAN_LEVEL_COUNTS.B1,
    );

    await expect(loadLessonsForLevel("B2")).resolves.toEqual([]);
    await expect(loadLessonsForLevel("C1")).resolves.toEqual([]);
    await expect(loadLessonsForLevel("C2")).resolves.toEqual([]);
    await expect(loadAllLessons()).resolves.toHaveLength(RUSSIAN_TOTAL_LESSONS);
  });

  it("keeps integrated content Cyrillic and free of CJK/Hangul/Japanese", () => {
    const everyLesson = [
      ...batchesByLevel.flatMap((batch) => batch.lessons),
      ...russianSurvivalLessons,
    ];
    const corpus = everyLesson.map(lessonText).join(" ");
    expect(corpus).toMatch(CYRILLIC_RE);
    expect(corpus).not.toMatch(CJK_HANGUL_JAPANESE_RE);

    const vocabCorpus = RUSSIAN_VOCABULARY.map((item) => item.ru).join(" ");
    expect(vocabCorpus).toMatch(CYRILLIC_RE);
    expect(vocabCorpus).not.toMatch(CJK_HANGUL_JAPANESE_RE);
  });
});
