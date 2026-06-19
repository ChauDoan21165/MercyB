import { describe, expect, it } from "vitest";

import {
  foldUrduForMatching,
  normalizeUrduAlefHamza,
  normalizeUrduDigits,
  normalizeUrduHehVariants,
  normalizeUrduLesson,
  normalizeUrduYehVariants,
  stripTatweel,
  stripUrduDiacritics,
  urduAnswersMatch,
  type UrduLessonInput,
} from "../normalize";

const baseLesson: UrduLessonInput = {
  id: "urdu_a1_greetings_intro",
  level: "A1",
  title_vi: "Chào hỏi tiếng Urdu",
  title_en: "Urdu greetings",
  intro_vi: "Bắt đầu với lời chào Urdu lịch sự.",
  intro_en: "Start with polite Urdu greetings.",
  sentences: [
    {
      ur: "السَّلَامُ عَلَیْکُمْ۔",
      romanization: "as-salaam alaikum",
      en: "Peace be upon you.",
      vi: "Bình an đến với bạn.",
      pronunciation_focus: ["Giữ hướng đọc phải sang trái cho chữ Urdu."],
      pronunciation_focus_en: ["Keep the Urdu script right-to-left."],
      note_vi: "Giữ nguyên chữ Urdu khi hiển thị.",
    },
  ],
  vocabulary: [
    {
      ur: "کِتاب",
      romanization: "kitaab",
      en: "book",
      vi: "quyển sách",
    },
    {
      ur: "بھائی",
      romanization: "bhaai",
      en: "brother",
      vi: "anh/em trai",
    },
  ],
  dialogue: [
    {
      speaker: "A",
      ur: "آپ کیسے ہیں؟",
      romanization: "aap kaise hain?",
      en: "How are you?",
      vi: "Bạn khỏe không?",
    },
  ],
  exercises: [
    {
      type: "fill-blank",
      question: "لفظ مکمل کریں: ک____ب",
      answer: "کتاب",
      hint_vi: "Từ chỉ quyển sách.",
      hint_en: "The word for book.",
    },
    {
      type: "matching",
      instruction_vi: "Nối từ Urdu với nghĩa.",
      instruction_en: "Match the Urdu word to its meaning.",
      pairs: [{ ur: "شکریہ", meaning_vi: "cảm ơn", meaning_en: "thank you" }],
    },
    {
      type: "translation",
      vi: "Tôi có ۳ quyển sách.",
      en: "I have 3 books.",
      ur: "میرے پاس ۳ کتابیں ہیں",
      romanization: "mere paas teen kitaaben hain",
    },
  ],
  cultural_notes_vi: "Urdu thường dùng công thức lịch sự trong chào hỏi.",
  cultural_notes_en: "Urdu often uses polite formulas in greetings.",
  tip_advice_vi: "Đừng thay chữ Urdu bằng romanization khi luyện đáp án chính.",
  tip_advice_en: "Do not replace Urdu script with romanization for the main answer.",
  register_notes_vi: "آپ là đại từ lịch sự, an toàn trong bài đầu.",
  register_notes_en: "آپ is a polite pronoun and safe in the first lesson.",
};

describe("normalizeUrduLesson", () => {
  it("preserves displayed Urdu while mapping to NormalizedLesson", () => {
    const normalized = normalizeUrduLesson(baseLesson, 202);

    expect(normalized.id).toBe(202);
    expect(normalized.level).toBe("A1");
    expect(normalized.title).toEqual({
      vi: "Chào hỏi tiếng Urdu",
      en: "Urdu greetings",
    });
    expect(normalized.introVi).toBe(baseLesson.intro_vi);
    expect(normalized.introEn).toBe(baseLesson.intro_en);
    expect(normalized.sentences[0]).toMatchObject({
      native: "السَّلَامُ عَلَیْکُمْ۔",
      romanization: "as-salaam alaikum",
      en: "Peace be upon you.",
      vi: "Bình an đến với bạn.",
      pronunciationFocus: ["Giữ hướng đọc phải sang trái cho chữ Urdu."],
      pronunciationFocusEn: ["Keep the Urdu script right-to-left."],
    });
    expect(normalized.vocabulary?.[0]).toMatchObject({
      native: "کِتاب",
      romanization: "kitaab",
      en: "book",
      vi: "quyển sách",
    });
    expect(normalized.dialogue?.[0]).toMatchObject({
      native: "آپ کیسے ہیں؟",
      romanization: "aap kaise hain?",
    });
    expect(normalized.culturalNotesVi).toBe(baseLesson.cultural_notes_vi);
    expect(normalized.culturalNotesEn).toBe(baseLesson.cultural_notes_en);
    expect(normalized.tipAdviceVi).toBe(baseLesson.tip_advice_vi);
    expect(normalized.tipAdviceEn).toBe(baseLesson.tip_advice_en);
    expect(normalized.registerNotesVi).toBe(baseLesson.register_notes_vi);
    expect(normalized.registerNotesEn).toBe(baseLesson.register_notes_en);
  });

  it("normalizes supported exercise shapes", () => {
    const normalized = normalizeUrduLesson(baseLesson);

    expect(normalized.exercises).toEqual([
      {
        kind: "fill-blank",
        question: "لفظ مکمل کریں: ک____ب",
        answer: "کتاب",
        hint: "Từ chỉ quyển sách.",
        hintEn: "The word for book.",
      },
      {
        kind: "matching",
        instruction: "Nối từ Urdu với nghĩa.",
        instructionEn: "Match the Urdu word to its meaning.",
        pairs: [{ a: "شکریہ", b: "cảm ơn" }],
      },
      {
        kind: "translation",
        vi: "Tôi có ۳ quyển sách.",
        en: "I have 3 books.",
        native: "میرے پاس ۳ کتابیں ہیں",
        romanization: "mere paas teen kitaaben hain",
      },
    ]);
  });

  it("uses deterministic numeric ids and makes no audio promise", () => {
    const one = normalizeUrduLesson(baseLesson);
    const two = normalizeUrduLesson(baseLesson);

    expect(one.id).toEqual(expect.any(Number));
    expect(one.id).toBe(two.id);
    expect(one.audioBase).toBeUndefined();
    expect(one.audioKinds).toBeUndefined();
  });
});

describe("Urdu answer normalization helpers", () => {
  it("strips zabar, zer, pesh, and related diacritics for matching", () => {
    expect(stripUrduDiacritics("سَلَام کِتاب مُحَبَّت")).toBe("سلام کتاب محبت");
    expect(urduAnswersMatch("کِتاب", "کتاب")).toBe(true);
    expect(urduAnswersMatch("مُحَبَّت", "محبت")).toBe(true);
  });

  it("strips tatweel", () => {
    expect(stripTatweel("ســــلام")).toBe("سلام");
    expect(urduAnswersMatch("کتــاب", "کتاب")).toBe(true);
  });

  it("folds cautious alef and hamza variants", () => {
    expect(normalizeUrduAlefHamza("أدب إسم آداب ٱسم")).toBe("ادب اسم اداب اسم");
    expect(urduAnswersMatch("آداب", "اداب")).toBe(true);
    expect(urduAnswersMatch("أدب", "ادب")).toBe(true);
  });

  it("folds yeh variants without collapsing bari ye by default", () => {
    expect(normalizeUrduYehVariants("ميری على")).toBe("میری علی");
    expect(urduAnswersMatch("ميری کتاب", "میری کتاب")).toBe(true);
    expect(urduAnswersMatch("بڑے", "بڑی")).toBe(false);
    expect(urduAnswersMatch("بڑے", "بڑی", { allowBariYeChotiYe: true })).toBe(true);
    expect(urduAnswersMatch("ہے", "ہی", { allowBariYeChotiYe: true })).toBe(false);
  });

  it("folds Arabic heh to Urdu heh but preserves do-chashmi heh distinctions", () => {
    expect(normalizeUrduHehVariants("يه")).toBe("يہ");
    expect(urduAnswersMatch("يه", "یہ")).toBe(true);
    expect(urduAnswersMatch("بھی", "بی")).toBe(false);
    expect(urduAnswersMatch("کھا", "کہا")).toBe(false);
    expect(urduAnswersMatch("پھول", "پول")).toBe(false);
  });

  it("folds Urdu, Persian, Arabic, and Latin digits", () => {
    expect(normalizeUrduDigits("۰۱۲۳۴۵۶۷۸۹ ٠١٢٣٤٥٦٧٨٩ 012")).toBe(
      "0123456789 0123456789 012",
    );
    expect(urduAnswersMatch("۳ کتابیں", "3 کتابیں")).toBe(true);
    expect(urduAnswersMatch("٣ بجے", "3 بجے")).toBe(true);
  });

  it("normalizes punctuation, Latin case, and whitespace for matching", () => {
    expect(urduAnswersMatch("کیا؟", "کیا?")).toBe(true);
    expect(foldUrduForMatching("  “SALAAM” ، ۳  ")).toBe('"salaam" , 3');
  });

  it("does not equate different Urdu words or Urdu script with romanization", () => {
    expect(urduAnswersMatch("سلام", "salaam")).toBe(false);
    expect(urduAnswersMatch("کل", "کال")).toBe(false);
    expect(urduAnswersMatch("ہے", "ہی")).toBe(false);
  });
});
