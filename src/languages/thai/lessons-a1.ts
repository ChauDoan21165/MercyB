// src/languages/thai/lessons-a1.ts
//
// Starter A1 Thai lesson: greetings + the politeness particles ครับ / ค่ะ.
//
// The single most important first lesson in Thai, because the polite particle
// is gendered by the *speaker*, not the listener: a man ends polite utterances
// with ครับ (khráp), a woman with ค่ะ (khâ). Vietnamese learners already use
// sentence-final politeness words (ạ, nhé, dạ), so the concept transfers — but
// the gender rule is new and is the focus of this lesson.
//
// Romanization uses a readable Latin transliteration with tone diacritics
// (à = low, á = high, â = falling, ǎ = rising, a = mid). It is a learning aid,
// not a claim of authoritative/native-reviewed transcription.

import type { ThaiLesson } from "./lessons";

const a1Lessons: ThaiLesson[] = [
  {
    id: 1,
    level: "A1",
    title_vi: "Chào hỏi và lịch sự (ครับ / ค่ะ)",
    title_en: "Greetings and politeness (ครับ / ค่ะ)",
    intro_vi:
      "Bài học đầu tiên: cách chào và hai tiểu từ lịch sự ครับ (khráp, nam nói) " +
      "và ค่ะ (khâ, nữ nói). Quan trọng: tiểu từ lịch sự phụ thuộc vào giới tính " +
      "của NGƯỜI NÓI, không phải người nghe — khác với tiếng Việt nơi ta chọn từ " +
      "theo người nghe (anh/chị/em).",
    intro_en:
      "Your first lesson: how to greet and the two politeness particles ครับ " +
      "(khráp, said by men) and ค่ะ (khâ, said by women). Key point: the " +
      "particle depends on the SPEAKER's gender, not the listener's.",
    vocabulary: [
      {
        thai: "สวัสดี",
        romanization: "sàwàtdii",
        en: "hello / goodbye",
        vi: "xin chào / tạm biệt",
        pos: "interjection",
      },
      {
        thai: "ครับ",
        romanization: "khráp",
        en: "polite final particle (male speaker)",
        vi: "tiểu từ lịch sự cuối câu (nam nói)",
        pos: "particle",
      },
      {
        thai: "ค่ะ",
        romanization: "khâ",
        en: "polite final particle (female speaker)",
        vi: "tiểu từ lịch sự cuối câu (nữ nói)",
        pos: "particle",
      },
      {
        thai: "ขอบคุณ",
        romanization: "khɔ̀ɔp khun",
        en: "thank you",
        vi: "cảm ơn",
        pos: "phrase",
      },
      {
        thai: "สบายดี",
        romanization: "sàbaai dii",
        en: "fine / well",
        vi: "khỏe / ổn",
        pos: "phrase",
      },
      {
        thai: "ไหม",
        romanization: "mǎi",
        en: "question particle (yes/no)",
        vi: "tiểu từ nghi vấn (có/không)",
        pos: "particle",
      },
    ],
    sentences: [
      {
        thai: "สวัสดีครับ",
        romanization: "sàwàtdii khráp",
        en: "Hello. (said by a man)",
        vi: "Xin chào. (nam nói)",
        pronunciation_focus: [
          "ครับ thường nói nhanh thành 'kháp', âm /r/ gần như biến mất.",
          "Thanh của ครับ là thanh cao — gần giống dấu sắc trong tiếng Việt.",
        ],
        pronunciation_focus_en: [
          "ครับ is usually said quickly as 'kháp'; the /r/ nearly disappears.",
          "It carries a high tone — let the voice rise and stay up.",
        ],
      },
      {
        thai: "สวัสดีค่ะ",
        romanization: "sàwàtdii khâ",
        en: "Hello. (said by a woman)",
        vi: "Xin chào. (nữ nói)",
        pronunciation_focus: [
          "ค่ะ là thanh xuống (falling) — giống dấu huyền kéo xuống, không phải dấu nặng.",
        ],
        pronunciation_focus_en: [
          "ค่ะ has a falling tone — start higher and drop, like a firm 'kâ'.",
        ],
      },
      {
        thai: "ขอบคุณครับ",
        romanization: "khɔ̀ɔp khun khráp",
        en: "Thank you. (said by a man)",
        vi: "Cảm ơn. (nam nói)",
      },
      {
        thai: "ขอบคุณค่ะ",
        romanization: "khɔ̀ɔp khun khâ",
        en: "Thank you. (said by a woman)",
        vi: "Cảm ơn. (nữ nói)",
      },
      {
        thai: "สบายดีไหมครับ",
        romanization: "sàbaai dii mǎi khráp",
        en: "How are you? (said by a man)",
        vi: "Bạn (có) khỏe không? (nam nói)",
        pronunciation_focus: [
          "ไหม (mǎi) là thanh hỏi (rising) — giọng đi lên ở cuối, giống dấu hỏi.",
        ],
        pronunciation_focus_en: [
          "ไหม (mǎi) is a rising tone — let the pitch climb, like asking a question.",
        ],
      },
    ],
    dialogue: [
      {
        speaker: "Anong (นง)",
        thai: "สวัสดีค่ะ สบายดีไหมคะ",
        romanization: "sàwàtdii khâ, sàbaai dii mǎi khá",
        en: "Hello. How are you?",
        vi: "Xin chào. Bạn khỏe không?",
      },
      {
        speaker: "Somchai (สมชาย)",
        thai: "สบายดีครับ ขอบคุณครับ",
        romanization: "sàbaai dii khráp, khɔ̀ɔp khun khráp",
        en: "I'm fine, thank you.",
        vi: "Tôi khỏe, cảm ơn.",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "A man greeting someone says: สวัสดี___",
        answer: "ครับ",
        hint_vi: "Người nói là nam → dùng tiểu từ lịch sự của nam.",
        hint_en: "The speaker is male → use the male politeness particle.",
      },
      {
        type: "matching",
        instruction_vi: "Nối từ tiếng Thái với nghĩa tiếng Việt.",
        instruction_en: "Match the Thai word with its English meaning.",
        pairs: [
          { thai: "สวัสดี", meaning: "hello" },
          { thai: "ขอบคุณ", meaning: "thank you" },
          { thai: "สบายดี", meaning: "fine / well" },
        ],
      },
      {
        type: "translation",
        vi: "Cảm ơn. (nữ nói)",
        en: "Thank you. (said by a woman)",
        thai: "ขอบคุณค่ะ",
      },
    ],
    cultural_notes_vi:
      "ครับ/ค่ะ chọn theo giới tính người nói, không theo người nghe. Một người " +
      "đàn ông luôn dùng ครับ dù nói với nam hay nữ; phụ nữ luôn dùng ค่ะ. Khi đặt " +
      "câu hỏi, phụ nữ thường đổi ค่ะ thành คะ (khá, thanh cao) ở cuối câu hỏi.",
    cultural_notes_en:
      "ครับ/ค่ะ are chosen by the speaker's gender, not the listener's. A man " +
      "always uses ครับ; a woman always uses ค่ะ. In questions, women often shift " +
      "ค่ะ to คะ (khá, high tone) at the end.",
    tip_advice_vi:
      "Tập gắn tiểu từ lịch sự vào MỌI câu ngay từ đầu — bỏ nó nghe cộc lốc. " +
      "Người Việt đã quen thêm 'ạ' cuối câu, nên thói quen này dễ chuyển sang.",
    tip_advice_en:
      "Add the politeness particle to EVERY sentence from day one — leaving it " +
      "off sounds blunt.",
  },
];

export default a1Lessons;
