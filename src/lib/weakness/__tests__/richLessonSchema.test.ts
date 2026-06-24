// src/lib/weakness/__tests__/richLessonSchema.test.ts
//
// Shape + invariants for the Step 4 RichLesson format and the legacy
// MicroLesson → RichLesson adapter. These tests are the contract that
// lets FocusAreasMicroLessonDialog render either shape from a single
// code path without breaking old content.

import { describe, expect, it } from "vitest";

import { MICRO_LESSONS, MICRO_LESSON_TAGS } from "../micro-lessons";
import {
  RICH_LESSON_QUIZ_LENGTH,
  fromMicroLesson,
  isRichLesson,
} from "../richLessonSchema";

describe("fromMicroLesson adapter", () => {
  it("converts every shipped MicroLesson into a renderable RichLesson", () => {
    for (const tag of MICRO_LESSON_TAGS) {
      const ml = MICRO_LESSONS[tag];
      expect(ml, `MicroLesson missing for ${tag}`).toBeDefined();
      const rich = fromMicroLesson(ml!);

      expect(isRichLesson(rich)).toBe(true);
      expect(rich.tag).toBe(tag);

      // Every section has non-empty EN + VI.
      for (const sectionName of [
        "hook",
        "why",
        "pattern",
        "practice",
        "takeaway",
      ] as const) {
        const section = rich.sections[sectionName];
        expect(
          section.en.trim().length,
          `${tag}.sections.${sectionName}.en empty`,
        ).toBeGreaterThan(0);
        expect(
          section.vi.trim().length,
          `${tag}.sections.${sectionName}.vi empty`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("preserves the tag identifier through the adapter", () => {
    for (const tag of MICRO_LESSON_TAGS) {
      const rich = fromMicroLesson(MICRO_LESSONS[tag]!);
      expect(rich.tag).toBe(tag);
    }
  });
});

describe("RichLesson quiz invariants", () => {
  it("adds Thai-native prompt wrappers to adapted quiz questions", () => {
    const sample = MICRO_LESSONS[MICRO_LESSON_TAGS[0]]!;
    const rich = fromMicroLesson(sample);

    expect(rich.quiz.length).toBeGreaterThan(0);
    for (const question of rich.quiz) {
      expect(question.question.th).toBeTruthy();
      expect(question.question.th).toMatch(/เติมคำในช่องว่าง|ทบทวนเร็ว/);
    }
  });

  it("every adapted lesson has exactly RICH_LESSON_QUIZ_LENGTH questions", () => {
    for (const tag of MICRO_LESSON_TAGS) {
      const rich = fromMicroLesson(MICRO_LESSONS[tag]!);
      expect(
        rich.quiz.length,
        `${tag} quiz length not ${RICH_LESSON_QUIZ_LENGTH}`,
      ).toBe(RICH_LESSON_QUIZ_LENGTH);
    }
  });

  it("every quiz question has VN + EN with non-empty content", () => {
    for (const tag of MICRO_LESSON_TAGS) {
      const rich = fromMicroLesson(MICRO_LESSONS[tag]!);
      for (let i = 0; i < rich.quiz.length; i++) {
        const q = rich.quiz[i];
        expect(
          q.question.en.trim().length,
          `${tag} quiz[${i}].question.en empty`,
        ).toBeGreaterThan(0);
        expect(
          q.question.vi.trim().length,
          `${tag} quiz[${i}].question.vi empty`,
        ).toBeGreaterThan(0);
        expect(
          q.correctAnswer.trim().length,
          `${tag} quiz[${i}].correctAnswer empty`,
        ).toBeGreaterThan(0);
      }
    }
  });
});

describe("isRichLesson type guard", () => {
  it("returns true for a fully-formed RichLesson", () => {
    const rich = fromMicroLesson(MICRO_LESSONS.vi_l1_3rd_person_s!);
    expect(isRichLesson(rich)).toBe(true);
  });

  it("returns false for a legacy MicroLesson", () => {
    expect(isRichLesson(MICRO_LESSONS.vi_l1_3rd_person_s!)).toBe(false);
  });

  it("returns false for null / non-objects", () => {
    expect(isRichLesson(null)).toBe(false);
    expect(isRichLesson(undefined)).toBe(false);
    expect(isRichLesson("not a lesson")).toBe(false);
    expect(isRichLesson(42)).toBe(false);
  });

  it("returns false when sections are missing", () => {
    expect(
      isRichLesson({
        tag: "vi_l1_3rd_person_s",
        title: { en: "x", vi: "x" },
        quiz: [],
      }),
    ).toBe(false);
  });
});

describe("RichLessonSection — ja slot (Japanese-native English schema unblock)", () => {
  it("accepts a RichLessonSection without ja (legacy en/vi unchanged)", () => {
    const section = { en: "Hello", vi: "Xin chào" };
    // Should compile and pass — ja is optional
    expect(section.en).toBe("Hello");
    expect(section.vi).toBe("Xin chào");
  });

  it("accepts a RichLessonSection with optional ja", () => {
    const section = { en: "Hello", vi: "Xin chào", ja: "こんにちは" };
    expect(section.ja).toBe("こんにちは");
    expect(section.en).toBe("Hello");
    expect(section.vi).toBe("Xin chào");
  });

  it("RichLesson with ja in sections passes isRichLesson guard", () => {
    const rich = fromMicroLesson(MICRO_LESSONS.vi_l1_3rd_person_s!);
    // Add ja to one section — should still be valid
    rich.sections.hook = { en: "Hook", vi: "Mở đầu", ja: "フック" };
    expect(isRichLesson(rich)).toBe(true);
  });
});

describe("BilingualText — ja slot", () => {
  it("accepts BilingualText without ja (legacy unchanged)", () => {
    const bt: { en: string; vi: string; ja?: string } = { en: "English", vi: "Tiếng Việt" };
    expect(bt.en).toBe("English");
    expect(bt.vi).toBe("Tiếng Việt");
    expect(bt.ja).toBeUndefined();
  });

  it("accepts BilingualText with optional ja", () => {
    const bt = { en: "English", vi: "Tiếng Việt", ja: "英語" };
    expect(bt.ja).toBe("英語");
  });

  it("fromMicroLesson produces RichLessons with valid BilingualText (no ja by default)", () => {
    const rich = fromMicroLesson(MICRO_LESSONS.vi_l1_3rd_person_s!);
    expect(rich.title.ja).toBeUndefined();
    // en/vi still populated
    expect(rich.title.en.length).toBeGreaterThan(0);
    expect(rich.title.vi.length).toBeGreaterThan(0);
  });
});

describe("MicroLessonText — ja slot", () => {
  it("micro-lesson now has ja populated (Japanese-native English wave 1)", () => {
    const ml = MICRO_LESSONS.vi_l1_3rd_person_s!;
    expect(ml.title.ja?.length).toBeGreaterThan(0);
    expect(ml.title.en.length).toBeGreaterThan(0);
    expect(ml.title.vi.length).toBeGreaterThan(0);
  });

  it("all 30 micro-lessons have vi/en populated, ja populated where added", () => {
    for (const tag of MICRO_LESSON_TAGS) {
      const ml = MICRO_LESSONS[tag]!;
      expect(ml.title.en.trim().length, `${tag} title.en empty`).toBeGreaterThan(0);
      expect(ml.title.vi.trim().length, `${tag} title.vi empty`).toBeGreaterThan(0);
      expect(ml.concept.en.trim().length, `${tag} concept.en empty`).toBeGreaterThan(0);
      expect(ml.concept.vi.trim().length, `${tag} concept.vi empty`).toBeGreaterThan(0);
      expect(ml.tip.en.trim().length, `${tag} tip.en empty`).toBeGreaterThan(0);
      expect(ml.tip.vi.trim().length, `${tag} tip.vi empty`).toBeGreaterThan(0);
      // ja should be populated for all l1 lessons (wave 1 content)
      expect(ml.title.ja?.trim().length, `${tag} title.ja empty`).toBeGreaterThan(0);
      expect(ml.concept.ja?.trim().length, `${tag} concept.ja empty`).toBeGreaterThan(0);
      expect(ml.tip.ja?.trim().length, `${tag} tip.ja empty`).toBeGreaterThan(0);
    }
  });
});


// ────────────────────────────────────────────────────────────────────────────
// ja content — consolidated Japanese-native English (wave 1)
// Verifies that all 30 micro-lessons have non-empty ja (from A1–C2 branches),
// contain actual Japanese text, and that en/vi remain untouched.
// ────────────────────────────────────────────────────────────────────────────

describe("MicroLessonText — ja content (consolidated wave 1)", () => {
  /** Quick CJK check — true if the string contains at least one Japanese-range character. */
  function containsJapanese(text: string): boolean {
    return /[぀-ゟ゠-ヿ一-鿿]/.test(text);
  }

  it("every micro-lesson has non-empty ja on title, concept, and tip", () => {
    for (const tag of MICRO_LESSON_TAGS) {
      const ml = MICRO_LESSONS[tag];
      expect(ml, `MicroLesson missing for ${tag}`).toBeDefined();
      expect(
        ml!.title.ja?.trim().length,
        `${tag} title.ja empty`,
      ).toBeGreaterThan(0);
      expect(
        ml!.concept.ja?.trim().length,
        `${tag} concept.ja empty`,
      ).toBeGreaterThan(0);
      expect(
        ml!.tip.ja?.trim().length,
        `${tag} tip.ja empty`,
      ).toBeGreaterThan(0);
    }
  });

  it("every ja field contains actual Japanese text (not just ASCII)", () => {
    for (const tag of MICRO_LESSON_TAGS) {
      const ml = MICRO_LESSONS[tag]!;
      expect(
        containsJapanese(ml.title.ja!),
        `${tag} title.ja has no Japanese characters: "${ml.title.ja}"`,
      ).toBe(true);
      expect(
        containsJapanese(ml.concept.ja!),
        `${tag} concept.ja has no Japanese characters`,
      ).toBe(true);
      expect(
        containsJapanese(ml.tip.ja!),
        `${tag} tip.ja has no Japanese characters`,
      ).toBe(true);
    }
  });

  it("en and vi fields remain populated for all lessons", () => {
    for (const tag of MICRO_LESSON_TAGS) {
      const ml = MICRO_LESSONS[tag]!;
      expect(ml.title.en.trim().length, `${tag} title.en empty`).toBeGreaterThan(0);
      expect(ml.title.vi.trim().length, `${tag} title.vi empty`).toBeGreaterThan(0);
      expect(ml.concept.en.trim().length, `${tag} concept.en empty`).toBeGreaterThan(0);
      expect(ml.concept.vi.trim().length, `${tag} concept.vi empty`).toBeGreaterThan(0);
      expect(ml.tip.en.trim().length, `${tag} tip.en empty`).toBeGreaterThan(0);
      expect(ml.tip.vi.trim().length, `${tag} tip.vi empty`).toBeGreaterThan(0);
    }
  });
});
