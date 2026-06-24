import { describe, expect, it } from "vitest";
import { getTutorCopy } from "@/lib/tutor/tutorCopy";

describe("getTutorCopy", () => {
  it("returns English copy by default", () => {
    const copy = getTutorCopy(undefined, undefined);

    expect(copy.targetLanguage).toBe("en");
    expect(copy.correctionTitle).toBe("English correction");
    expect(copy.ui.inputLabel).toBe("Gõ câu tiếng Anh của bạn");
  });

  it("returns French target copy without English-only sentence copy", () => {
    const copy = getTutorCopy("fr", "vi");

    expect(copy.targetLanguage).toBe("fr");
    expect(copy.placeholder).toMatch(/gõ câu tiếng Pháp/);
    expect(copy.ui.inputLabel).toBe("Gõ câu tiếng Pháp của bạn");
    expect(copy.ui.inputLabel).not.toMatch(/English sentence/i);
    expect(copy.starterQuestions[0]).toBe("Qu'est-ce que tu fais le matin ?");
    expect(copy.fallbackMessages.conversationNeedsAi).toMatch(/conversation en français/);
  });

  it("returns Chinese target copy", () => {
    const copy = getTutorCopy("zh", "vi");

    expect(copy.targetLanguage).toBe("zh");
    expect(copy.placeholder).toMatch(/gõ câu tiếng Trung/);
    expect(copy.starterQuestions[0]).toBe("你早上通常做什么？");
    expect(copy.nextQuestionTemplates[0]).toBe("然后你做什么？");
  });

  it("keeps UI explanation language separate from target language", () => {
    const copy = getTutorCopy("fr", "en");

    expect(copy.targetLanguage).toBe("fr");
    expect(copy.uiLanguage).toBe("en");
    expect(copy.ui.subtitle).toMatch(/Practice French with Mercy/);
    expect(copy.ui.inputLabel).toBe("Your French sentence");
    expect(copy.placeholder).toMatch(/gõ câu tiếng Pháp/);
    expect(copy.ui.conversationFallback).toMatch(/I can still help/);
  });

  it("returns Turkish target copy with Turkish names and starter prompts", () => {
    const copy = getTutorCopy("tr", "vi");

    expect(copy.targetLanguage).toBe("tr");
    expect(copy.nameEn).toBe("Turkish");
    expect(copy.nameVi).toBe("Tiếng Thổ Nhĩ Kỳ");
    expect(copy.placeholder).toMatch(/tiếng Thổ Nhĩ Kỳ/);
    expect(copy.ui.title).toBe("Teacher Mercy · Gia sư Tiếng Thổ Nhĩ Kỳ");
    expect(copy.starterQuestions[0]).toMatch(/Sabahları/);
    expect(copy.starterQuestions.join(" ")).toContain("Türkçe");
    expect(copy.starterQuestions.join(" ")).not.toMatch(/français|Deutsch|español/i);
  });

  it("falls back invalid target copy to English safely", () => {
    const copy = getTutorCopy("not-real", "en");

    expect(copy.targetLanguage).toBe("en");
    expect(copy.nameEn).toBe("English");
    expect(copy.ui.inputLabel).toBe("Your English sentence");
  });
});
