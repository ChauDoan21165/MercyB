import { describe, expect, it } from "vitest";

import {
  foldHindiForMatching,
  hindiAnswersMatch,
  normalizeHindiAnusvaraChandrabindu,
  normalizeHindiDigits,
  normalizeHindiLesson,
  normalizeHindiNukta,
  normalizeHindiVirama,
  normalizeHindiVisarga,
  stripHindiCombiningMarks,
  type HindiLessonInput,
} from "../normalize";

const baseLesson: HindiLessonInput = {
  id: "hindi_a1_greetings_intro",
  level: "A1",
  title_vi: "Chào hỏi tiếng Hindi",
  title_en: "Hindi greetings",
  intro_vi: "Bắt đầu bằng Devanagari và lời chào lịch sự.",
  intro_en: "Start with Devanagari and polite greetings.",
  sentences: [
    {
      hi: "नमस्ते, आप कैसे हैं?",
      romanization: "namaste, aap kaise hain?",
      en: "Hello, how are you?",
      vi: "Xin chào, bạn khỏe không?",
      pronunciation_focus: ["आ dài hơn अ", "retroflex cần phân biệt sau"],
      pronunciation_focus_en: ["आ is longer than अ", "retroflex sounds matter later"],
      note_vi: "Giữ nguyên chữ Devanagari khi hiển thị.",
    },
  ],
  vocabulary: [
    {
      hi: "क़िताब",
      romanization: "kitaab",
      en: "book",
      vi: "quyển sách",
    },
  ],
  dialogue: [
    {
      speaker: "A",
      hi: "मेरे पास ३ किताबें हैं।",
      romanization: "mere paas 3 kitaaben hain.",
      en: "I have three books.",
      vi: "Tôi có ba quyển sách.",
    },
  ],
  exercises: [
    {
      type: "fill-blank",
      question: "नमस्ते, आप कैसे ___?",
      answer: "हैं",
      hint_vi: "Dạng lịch sự với आप.",
      hint_en: "Polite form with आप.",
    },
    {
      type: "matching",
      instruction_vi: "Nối từ Hindi với nghĩa.",
      instruction_en: "Match the Hindi word to its meaning.",
      pairs: [{ hi: "किताब", meaning_vi: "sách", meaning_en: "book" }],
    },
    {
      type: "translation",
      vi: "Tôi có ३ quyển sách.",
      en: "I have 3 books.",
      hi: "मेरे पास ३ किताबें हैं।",
      romanization: "mere paas 3 kitaaben hain.",
    },
  ],
  cultural_notes_vi: "आप là lựa chọn lịch sự an toàn cho người mới học.",
  cultural_notes_en: "आप is the safest polite choice for beginners.",
  tip_advice_vi: "Romanization chỉ là hỗ trợ; đáp án chính là chữ Devanagari.",
  tip_advice_en: "Romanization is support; the main answer is Devanagari.",
  register_notes_vi: "नमस्ते trung tính và lịch sự.",
  register_notes_en: "नमस्ते is neutral and polite.",
};

describe("normalizeHindiLesson", () => {
  it("preserves displayed Devanagari while mapping to NormalizedLesson", () => {
    const normalized = normalizeHindiLesson(baseLesson, 201);

    expect(normalized.id).toBe(201);
    expect(normalized.level).toBe("A1");
    expect(normalized.title).toEqual({
      vi: "Chào hỏi tiếng Hindi",
      en: "Hindi greetings",
    });
    expect(normalized.introVi).toBe(baseLesson.intro_vi);
    expect(normalized.introEn).toBe(baseLesson.intro_en);
    expect(normalized.sentences[0]).toMatchObject({
      native: "नमस्ते, आप कैसे हैं?",
      romanization: "namaste, aap kaise hain?",
      en: "Hello, how are you?",
      vi: "Xin chào, bạn khỏe không?",
      pronunciationFocus: ["आ dài hơn अ", "retroflex cần phân biệt sau"],
      pronunciationFocusEn: ["आ is longer than अ", "retroflex sounds matter later"],
    });
    expect(normalized.vocabulary?.[0]).toMatchObject({
      native: "क़िताब",
      romanization: "kitaab",
      en: "book",
      vi: "quyển sách",
    });
    expect(normalized.dialogue?.[0]).toMatchObject({
      native: "मेरे पास ३ किताबें हैं।",
      romanization: "mere paas 3 kitaaben hain.",
    });
    expect(normalized.culturalNotesVi).toBe(baseLesson.cultural_notes_vi);
    expect(normalized.culturalNotesEn).toBe(baseLesson.cultural_notes_en);
    expect(normalized.tipAdviceVi).toBe(baseLesson.tip_advice_vi);
    expect(normalized.tipAdviceEn).toBe(baseLesson.tip_advice_en);
    expect(normalized.registerNotesVi).toBe(baseLesson.register_notes_vi);
    expect(normalized.registerNotesEn).toBe(baseLesson.register_notes_en);
  });

  it("normalizes supported exercise shapes", () => {
    const normalized = normalizeHindiLesson(baseLesson);

    expect(normalized.exercises).toEqual([
      {
        kind: "fill-blank",
        question: "नमस्ते, आप कैसे ___?",
        answer: "हैं",
        hint: "Dạng lịch sự với आप.",
        hintEn: "Polite form with आप.",
      },
      {
        kind: "matching",
        instruction: "Nối từ Hindi với nghĩa.",
        instructionEn: "Match the Hindi word to its meaning.",
        pairs: [{ a: "किताब", b: "sách" }],
      },
      {
        kind: "translation",
        vi: "Tôi có ३ quyển sách.",
        en: "I have 3 books.",
        native: "मेरे पास ३ किताबें हैं।",
        romanization: "mere paas 3 kitaaben hain.",
      },
    ]);
  });

  it("uses deterministic numeric ids and makes no audio promise", () => {
    const one = normalizeHindiLesson(baseLesson);
    const two = normalizeHindiLesson(baseLesson);

    expect(one.id).toEqual(expect.any(Number));
    expect(one.id).toBe(two.id);
    expect(one.audioBase).toBeUndefined();
    expect(one.audioKinds).toBeUndefined();
  });
});

describe("Hindi answer normalization helpers", () => {
  it("folds Devanagari digits and Latin digits for matching", () => {
    expect(normalizeHindiDigits("०१२३४५६७८९")).toBe("0123456789");
    expect(hindiAnswersMatch("३ किताबें", "3 किताबें")).toBe(true);
    expect(hindiAnswersMatch("१२ रुपये", "12 रुपये")).toBe(true);
  });

  it("keeps nukta significant by default and folds it only when enabled", () => {
    expect(normalizeHindiNukta("क़िताब")).toBe("क़िताब");
    expect(hindiAnswersMatch("क़िताब", "किताब")).toBe(false);
    expect(
      hindiAnswersMatch("क़िताब", "किताब", { allowNuktaFolding: true }),
    ).toBe(true);
    expect(normalizeHindiNukta("फ़िल्म", { allowNuktaFolding: true })).toBe(
      "फिल्म",
    );
  });

  it("keeps anusvara and chandrabindu significant by default", () => {
    expect(normalizeHindiAnusvaraChandrabindu("हूँ")).toBe("हूँ");
    expect(hindiAnswersMatch("हूँ", "हूं")).toBe(false);
    expect(
      hindiAnswersMatch("हूँ", "हूं", {
        allowAnusvaraChandrabinduFolding: true,
      }),
    ).toBe(true);
    expect(hindiAnswersMatch("है", "हैं")).toBe(false);
  });

  it("keeps visarga significant by default", () => {
    expect(normalizeHindiVisarga("दुःख")).toBe("दुःख");
    expect(hindiAnswersMatch("दुःख", "दुख")).toBe(false);
    expect(
      hindiAnswersMatch("दुःख", "दुख", { allowVisargaFolding: true }),
    ).toBe(true);
  });

  it("keeps virama and matras significant by default", () => {
    expect(normalizeHindiVirama("क्या")).toBe("क्या");
    expect(hindiAnswersMatch("क्या", "कया")).toBe(false);
    expect(hindiAnswersMatch("दिन", "दीन")).toBe(false);
    expect(hindiAnswersMatch("कल", "काल")).toBe(false);
    expect(
      hindiAnswersMatch("शब्द", "शबद", { allowViramaFolding: true }),
    ).toBe(true);
  });

  it("strips combining marks only when explicitly requested", () => {
    expect(stripHindiCombiningMarks("क़ हूँ दुःख शब्द")).toBe("क़ हूँ दुःख शब्द");
    expect(
      stripHindiCombiningMarks("क़ हूँ दुःख शब्द", {
        allowNuktaFolding: true,
        allowAnusvaraChandrabinduFolding: true,
        allowVisargaFolding: true,
        allowViramaFolding: true,
      }),
    ).toBe("क हू दुख शबद");
  });

  it("can ignore punctuation when an exercise allows it", () => {
    expect(hindiAnswersMatch("है।", "है")).toBe(false);
    expect(hindiAnswersMatch("है।", "है", { ignorePunctuation: true })).toBe(
      true,
    );
    expect(foldHindiForMatching(" “NAMASTE” ३ ")).toBe('"namaste" 3');
  });

  it("does not treat romanization as native Devanagari", () => {
    expect(hindiAnswersMatch("namaste", "नमस्ते")).toBe(false);
    expect(hindiAnswersMatch("hai", "है")).toBe(false);
  });
});
