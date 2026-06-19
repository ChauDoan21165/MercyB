import { describe, expect, it } from "vitest";

import {
  foldPortugueseDiacritics,
  normalizePortugueseLesson,
  portugueseAnswersMatch,
  type PortugueseLessonInput,
} from "../normalize";

const baseLesson: PortugueseLessonInput = {
  id: "portuguese_test_diacritics",
  level: "A1",
  title_vi: "Kiểm tra dấu tiếng Bồ Đào Nha",
  title_en: "Portuguese diacritics check",
  sentences: [
    {
      pt: "Não está no coração.",
      en: "It is not in the heart.",
      vi: "Nó không ở trong tim.",
      pronunciation_focus: ["não", "está", "coração"],
      pronunciation_focus_en: ["nasal ão", "final stress", "ç = s"],
    },
  ],
  cultural_notes_vi: "Giữ dấu khi hiển thị nội dung học.",
  tip_advice_vi: "Chỉ gập dấu khi chấm câu trả lời.",
};

describe("normalizePortugueseLesson", () => {
  it("preserves Portuguese diacritics for displayed lesson content", () => {
    const normalized = normalizePortugueseLesson(baseLesson, 123);

    expect(normalized.id).toBe(123);
    expect(normalized.sentences[0]).toMatchObject({
      native: "Não está no coração.",
      en: "It is not in the heart.",
      vi: "Nó không ở trong tim.",
      pronunciationFocus: ["não", "está", "coração"],
      pronunciationFocusEn: ["nasal ão", "final stress", "ç = s"],
    });
  });

  it("folds Portuguese diacritics only for lenient answer comparison", () => {
    expect(foldPortugueseDiacritics("Não está: ação, pão, você, maçã, ÓTIMO.")).toBe(
      "Nao esta: acao, pao, voce, maca, OTIMO.",
    );
    expect(portugueseAnswersMatch("  Não   está no coração ", "nao esta no coracao")).toBe(true);
    expect(portugueseAnswersMatch("pão", "pau")).toBe(false);
  });

  it("supports legacy sentence input where en carries the native text", () => {
    const normalized = normalizePortugueseLesson({
      ...baseLesson,
      sentences: [{ en: "Bom dia!", vi: "Chào buổi sáng.", pronunciation_focus: ["bom"] }],
    });

    expect(normalized.sentences[0]).toMatchObject({
      native: "Bom dia!",
      vi: "Chào buổi sáng.",
    });
    expect(normalized.sentences[0].en).toBeUndefined();
  });

  it("does not add audio metadata before Portuguese audio is wired", () => {
    const normalized = normalizePortugueseLesson(baseLesson);

    expect(normalized.audioBase).toBeUndefined();
    expect(normalized.audioKinds).toBeUndefined();
  });
});

