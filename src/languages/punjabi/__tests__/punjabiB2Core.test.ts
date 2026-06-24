import { describe, expect, it } from "vitest";

import {
  punjabiB2CoreLessons,
  type PunjabiB2Lesson,
} from "../lessons-b2-core";

const serialized = JSON.stringify(punjabiB2CoreLessons);

function lessonText(lesson: PunjabiB2Lesson): string {
  return JSON.stringify(lesson);
}

describe("Punjabi B2 core lesson batch", () => {
  it("exports 10-16 compact B2 lessons", () => {
    expect(punjabiB2CoreLessons.length).toBeGreaterThanOrEqual(10);
    expect(punjabiB2CoreLessons.length).toBeLessThanOrEqual(16);
    expect(punjabiB2CoreLessons.every((lesson) => lesson.level === "B2")).toBe(true);
  });

  it("uses unique ids and app-ready core fields", () => {
    const ids = punjabiB2CoreLessons.map((lesson) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const lesson of punjabiB2CoreLessons) {
      expect(lesson.title_vi.length).toBeGreaterThan(4);
      expect(lesson.title_en.length).toBeGreaterThan(4);
      expect(lesson.keySentences.length).toBeGreaterThanOrEqual(2);
      expect(lesson.vocabulary.length).toBeGreaterThanOrEqual(3);
      expect(lesson.commonMistakes.length).toBeGreaterThanOrEqual(1);
      expect(lesson.modelAnswers.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("keeps Gurmukhi primary with romanization bridges", () => {
    expect(/[ਗ-ੴ]/u.test(serialized)).toBe(true);

    for (const lesson of punjabiB2CoreLessons) {
      for (const sentence of lesson.keySentences) {
        expect(/[ਗ-ੴ]/u.test(sentence.gurmukhi)).toBe(true);
        expect(sentence.romanization.length).toBeGreaterThan(8);
      }
    }
  });

  it("supports Vietnamese-speaking and English-speaking learners", () => {
    for (const lesson of punjabiB2CoreLessons) {
      expect(lesson.objective_vi).toBeTruthy();
      expect(lesson.objective_en).toBeTruthy();
      expect(lesson.explanation_vi).toBeTruthy();
      expect(lesson.explanation_en).toBeTruthy();

      for (const sentence of lesson.keySentences) {
        expect(sentence.vi).toBeTruthy();
        expect(sentence.en).toBeTruthy();
      }
    }
  });

  it("covers the required B2 domains", () => {
    expect(serialized).toMatch(/quan điểm|opinion|ਵਿਚਾਰ/i);
    expect(serialized).toMatch(/không đồng ý|disagree|ਵੱਖਰੀ/i);
    expect(serialized).toMatch(/thương lượng|negotiate|deadline|ਤਰਜੀਹ/i);
    expect(serialized).toMatch(/customer|dịch vụ|ਆਰਡਰ|service/i);
    expect(serialized).toMatch(/healthcare|bác sĩ|ਦਵਾਈ|symptoms/i);
    expect(serialized).toMatch(/immigration|public office|cơ quan công|ਅਰਜ਼ੀ/i);
    expect(serialized).toMatch(/problem|vấn đề|ਸਮੱਸਿਆ/i);
    expect(serialized).toMatch(/formal|casual|trang trọng|ਤੁਸੀਂ|ਤੂੰ/i);
  });

  it("includes common mistakes and model answers", () => {
    const mistakeCount = punjabiB2CoreLessons.reduce(
      (sum, lesson) => sum + lesson.commonMistakes.length,
      0,
    );
    const modelAnswerCount = punjabiB2CoreLessons.reduce(
      (sum, lesson) => sum + lesson.modelAnswers.length,
      0,
    );

    expect(mistakeCount).toBeGreaterThanOrEqual(punjabiB2CoreLessons.length);
    expect(modelAnswerCount).toBeGreaterThanOrEqual(punjabiB2CoreLessons.length);
    expect(serialized).toMatch(/fix_vi|fix_en|answer_gurmukhi/);
  });

  it("mentions Shahmukhi only as awareness, not as a full course", () => {
    const shahmukhiMatches = serialized.match(/Shahmukhi/g) ?? [];
    expect(shahmukhiMatches.length).toBeLessThanOrEqual(2);
    expect(serialized).toMatch(/Gurmukhi only|chỉ dạy Gurmukhi/);
  });

  it("does not claim native review, pronunciation scoring, audio, or Azure coverage", () => {
    expect(serialized).not.toMatch(
      /native[- ](?:certified|verified|approved|reviewed)|verified by native|native speaker approved|pronunciation score|audio|Azure/i,
    );
  });
});
