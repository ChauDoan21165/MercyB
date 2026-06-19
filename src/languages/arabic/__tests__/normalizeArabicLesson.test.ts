import { describe, expect, it } from "vitest";

import {
  arabicAnswersMatch,
  foldArabicForMatching,
  normalizeArabicAlefHamza,
  normalizeArabicDigits,
  normalizeArabicLesson,
  normalizeArabicTaMarbuta,
  normalizeArabicYaAlifMaqsurah,
  stripArabicHarakat,
  stripTatweel,
  type ArabicLessonInput,
} from "../normalize";

const baseLesson: ArabicLessonInput = {
  id: "arabic_a1_greetings_intro",
  level: "A1",
  title_vi: "Chào hỏi tiếng Ả Rập",
  title_en: "Arabic greetings",
  intro_vi: "Bắt đầu với lời chào MSA phổ biến.",
  intro_en: "Start with common MSA greetings.",
  sentences: [
    {
      ar: "السَّلَامُ عَلَيْكُمْ.",
      romanization: "as-salaamu 'alaykum",
      en: "Peace be upon you.",
      vi: "Bình an đến với bạn.",
      pronunciation_focus: ["âm ع không có trong tiếng Việt"],
      pronunciation_focus_en: ["initial 'ayn is not an English sound"],
      note_vi: "Giữ nguyên chữ Ả Rập khi hiển thị.",
    },
  ],
  vocabulary: [
    {
      ar: "مَرْحَبًا",
      romanization: "marhaban",
      en: "hello",
      vi: "xin chào",
    },
  ],
  dialogue: [
    {
      speaker: "A",
      ar: "كَيْفَ حَالُكَ؟",
      romanization: "kayfa haaluka?",
      en: "How are you?",
      vi: "Bạn khỏe không?",
    },
  ],
  exercises: [
    {
      type: "fill-blank",
      question: "اكتب التحية: _____",
      answer: "مرحبا",
      hint_vi: "Có thể viết không dấu nguyên âm ngắn.",
      hint_en: "Short vowels are optional in typed answers.",
    },
    {
      type: "matching",
      instruction_vi: "Nối câu Ả Rập với nghĩa.",
      instruction_en: "Match the Arabic phrase to its meaning.",
      pairs: [{ ar: "شكرا", meaning_vi: "cảm ơn", meaning_en: "thank you" }],
    },
    {
      type: "translation",
      vi: "Tôi có ٣ quyển sách.",
      en: "I have 3 books.",
      ar: "عندي ٣ كتب",
      romanization: "'indii thalaathat kutub",
    },
  ],
  cultural_notes_vi: "MSA dùng được trong văn viết và bối cảnh trang trọng.",
  cultural_notes_en: "MSA works in writing and formal contexts.",
  tip_advice_vi: "Đừng bỏ qua hướng viết từ phải sang trái.",
  tip_advice_en: "Do not ignore right-to-left reading direction.",
  register_notes_vi: "Câu chào này lịch sự và trung tính.",
  register_notes_en: "This greeting is polite and neutral.",
};

describe("normalizeArabicLesson", () => {
  it("preserves displayed Arabic while mapping to NormalizedLesson", () => {
    const normalized = normalizeArabicLesson(baseLesson, 101);

    expect(normalized.id).toBe(101);
    expect(normalized.level).toBe("A1");
    expect(normalized.title).toEqual({
      vi: "Chào hỏi tiếng Ả Rập",
      en: "Arabic greetings",
    });
    expect(normalized.introVi).toBe(baseLesson.intro_vi);
    expect(normalized.introEn).toBe(baseLesson.intro_en);
    expect(normalized.sentences[0]).toMatchObject({
      native: "السَّلَامُ عَلَيْكُمْ.",
      romanization: "as-salaamu 'alaykum",
      en: "Peace be upon you.",
      vi: "Bình an đến với bạn.",
      pronunciationFocus: ["âm ع không có trong tiếng Việt"],
      pronunciationFocusEn: ["initial 'ayn is not an English sound"],
    });
    expect(normalized.vocabulary?.[0]).toMatchObject({
      native: "مَرْحَبًا",
      romanization: "marhaban",
      en: "hello",
      vi: "xin chào",
    });
    expect(normalized.dialogue?.[0]).toMatchObject({
      native: "كَيْفَ حَالُكَ؟",
      romanization: "kayfa haaluka?",
    });
    expect(normalized.culturalNotesVi).toBe(baseLesson.cultural_notes_vi);
    expect(normalized.culturalNotesEn).toBe(baseLesson.cultural_notes_en);
    expect(normalized.tipAdviceVi).toBe(baseLesson.tip_advice_vi);
    expect(normalized.tipAdviceEn).toBe(baseLesson.tip_advice_en);
    expect(normalized.registerNotesVi).toBe(baseLesson.register_notes_vi);
    expect(normalized.registerNotesEn).toBe(baseLesson.register_notes_en);
  });

  it("normalizes supported exercise shapes", () => {
    const normalized = normalizeArabicLesson(baseLesson);

    expect(normalized.exercises).toEqual([
      {
        kind: "fill-blank",
        question: "اكتب التحية: _____",
        answer: "مرحبا",
        hint: "Có thể viết không dấu nguyên âm ngắn.",
        hintEn: "Short vowels are optional in typed answers.",
      },
      {
        kind: "matching",
        instruction: "Nối câu Ả Rập với nghĩa.",
        instructionEn: "Match the Arabic phrase to its meaning.",
        pairs: [{ a: "شكرا", b: "cảm ơn" }],
      },
      {
        kind: "translation",
        vi: "Tôi có ٣ quyển sách.",
        en: "I have 3 books.",
        native: "عندي ٣ كتب",
        romanization: "'indii thalaathat kutub",
      },
    ]);
  });

  it("uses deterministic numeric ids and makes no audio promise", () => {
    const one = normalizeArabicLesson(baseLesson);
    const two = normalizeArabicLesson(baseLesson);

    expect(one.id).toEqual(expect.any(Number));
    expect(one.id).toBe(two.id);
    expect(one.audioBase).toBeUndefined();
    expect(one.audioKinds).toBeUndefined();
  });
});

describe("Arabic answer normalization helpers", () => {
  it("strips harakat without changing base Arabic letters", () => {
    expect(stripArabicHarakat("السَّلَامُ عَلَيْكُمْ")).toBe("السلام عليكم");
    expect(arabicAnswersMatch("مَرْحَبًا", "مرحبا")).toBe(true);
  });

  it("strips tatweel", () => {
    expect(stripTatweel("مرــــحبا")).toBe("مرحبا");
    expect(arabicAnswersMatch("الســــلام", "السلام")).toBe(true);
  });

  it("folds common alef and hamza variants", () => {
    expect(normalizeArabicAlefHamza("أهلا إلى آسف ٱسم")).toBe("اهلا الى اسف اسم");
    expect(arabicAnswersMatch("أهلاً وسهلاً", "اهلا وسهلا")).toBe(true);
    expect(arabicAnswersMatch("إلى البيت", "الى البيت")).toBe(true);
    expect(arabicAnswersMatch("آسف", "اسف")).toBe(true);
  });

  it("folds ya and alif maqsurah for matching", () => {
    expect(normalizeArabicYaAlifMaqsurah("على الطاولة")).toBe("علي الطاولة");
    expect(arabicAnswersMatch("على الطاولة", "علي الطاولة")).toBe(true);
  });

  it("keeps ta marbuta and ha distinct by default but allows final-only opt-in", () => {
    expect(normalizeArabicTaMarbuta("مدرسة كبيره")).toBe("مدرسة كبيره");
    expect(arabicAnswersMatch("مدرسة", "مدرسه")).toBe(false);
    expect(
      arabicAnswersMatch("مدرسة", "مدرسه", { allowFinalTaMarbutaHa: true }),
    ).toBe(true);
    expect(
      arabicAnswersMatch("هةا", "ةةا", { allowFinalTaMarbutaHa: true }),
    ).toBe(false);
  });

  it("folds Arabic-Indic and Persian/Urdu digits", () => {
    expect(normalizeArabicDigits("٠١٢٣٤٥٦٧٨٩ ۰۱۲۳۴۵۶۷۸۹")).toBe(
      "0123456789 0123456789",
    );
    expect(arabicAnswersMatch("٣ كتب", "3 كتب")).toBe(true);
    expect(arabicAnswersMatch("۲ تذاكر", "2 تذاكر")).toBe(true);
  });

  it("normalizes punctuation, Latin case, and whitespace for matching", () => {
    expect(arabicAnswersMatch("كيف حالك؟", "كيف حالك?")).toBe(true);
    expect(foldArabicForMatching("  “AHLAN” ، ٣  ")).toBe('"ahlan" , 3');
  });

  it("does not equate different Arabic words or Arabic script with romanization", () => {
    expect(arabicAnswersMatch("كتاب", "كتب")).toBe(false);
    expect(arabicAnswersMatch("سلام", "كلام")).toBe(false);
    expect(arabicAnswersMatch("مرحبا", "marhaban")).toBe(false);
  });
});
