import { describe, expect, it } from "vitest";
import { getTutorCopy } from "@/lib/tutor/tutorCopy";

describe("getTutorCopy", () => {
  it("returns English copy by default", () => {
    const copy = getTutorCopy(undefined, undefined);

    expect(copy.targetLanguage).toBe("en");
    expect(copy.correctionTitle).toBe("English correction");
    expect(copy.ui.inputLabel).toBe("Câu tiếng Anh của bạn");
  });

  it("returns French target copy without English-only sentence copy", () => {
    const copy = getTutorCopy("fr", "vi");

    expect(copy.targetLanguage).toBe("fr");
    expect(copy.placeholder).toMatch(/gõ câu tiếng Pháp/);
    expect(copy.ui.inputLabel).toBe("Câu tiếng Pháp của bạn");
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
});
