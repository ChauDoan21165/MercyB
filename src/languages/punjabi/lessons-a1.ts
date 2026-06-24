// src/languages/punjabi/lessons-a1.ts
//
// A1 Punjabi foundation lesson. Gurmukhi is primary; romanization is a support
// layer for first-pass reading. Native review is deferred.

import type { PunjabiLesson } from "./lessons";

export const lessons: PunjabiLesson[] = [
  {
    id: 1,
    level: "A1",
    title_vi: "Chào hỏi Punjabi cơ bản: ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
    title_en: "Basic Punjabi greetings: ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
    intro_vi:
      "Bài đầu tiên dùng chữ Gurmukhi làm chính. Hãy nhìn chữ Punjabi trước, rồi dùng romanization để đọc gần đúng. Punjabi có âm bật hơi như ਖ /kh/ và phụ âm quặt lưỡi; người Việt nên đọc chậm, không bỏ hơi ở các âm có h.",
    intro_en:
      "This first lesson is Gurmukhi-first. Look at the Punjabi script before using the romanization. Punjabi has aspirated consonants such as ਖ /kh/ and retroflex sounds; English speakers should avoid reducing every vowel to a schwa.",
    vocabulary: [
      {
        gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
        romanization: "sat sri akal",
        vi: "xin chào / lời chào trang trọng phổ biến",
        en: "hello / respectful common greeting",
        pos: "phrase",
      },
      {
        gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ",
        romanization: "sat sri akal ji",
        vi: "xin chào ạ / lời chào lịch sự hơn",
        en: "hello respectfully",
        pos: "phrase",
      },
      {
        gurmukhi: "ਜੀ",
        romanization: "ji",
        vi: "ạ / thưa, từ lịch sự đặt sau tên hoặc câu trả lời",
        en: "respect marker, like polite sir/ma'am or yes with respect",
        pos: "particle",
      },
      {
        gurmukhi: "ਧੰਨਵਾਦ",
        romanization: "dhannvaad",
        vi: "cảm ơn",
        en: "thank you",
        pos: "noun/phrase",
      },
      {
        gurmukhi: "ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
        romanization: "tuhada naam ki hai?",
        vi: "Tên của bạn là gì?",
        en: "What is your name?",
        pos: "question",
      },
      {
        gurmukhi: "ਮੇਰਾ ਨਾਮ ਆਨਾ ਹੈ",
        romanization: "mera naam Ana hai",
        vi: "Tên tôi là Ana.",
        en: "My name is Ana.",
        pos: "sentence frame",
      },
    ],
    sentences: [
      {
        gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
        romanization: "sat sri akal",
        vi: "Xin chào.",
        en: "Hello.",
        pronunciation_focus: [
          "ਸਤ đọc ngắn, không kéo dài nguyên âm như tiếng Việt có dấu sắc.",
          "ਕ trong ਅਕਾਲ là âm /k/ rõ; đừng đọc thành /g/.",
        ],
        pronunciation_focus_en: [
          "Keep sat short and clear; do not turn it into 'saat'.",
          "The k in akal stays unvoiced, closer to English k than g.",
        ],
      },
      {
        gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ।",
        romanization: "sat sri akal ji",
        vi: "Xin chào ạ.",
        en: "Hello, respectfully.",
        pronunciation_focus: [
          "ਜੀ giống 'ji', dùng để lịch sự như 'ạ' trong tiếng Việt.",
          "Giữ nhịp đều: sat sri a-kal ji.",
        ],
        pronunciation_focus_en: [
          "ji is a respect marker, not part of the greeting's core meaning.",
          "Say it as a light final syllable: sat sri a-kal ji.",
        ],
      },
      {
        gurmukhi: "ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
        romanization: "tuhada naam ki hai?",
        vi: "Tên của bạn là gì?",
        en: "What is your name?",
        pronunciation_focus: [
          "ਤੁਹਾਡਾ có hơi nhẹ ở ਹ; không bỏ h hoàn toàn.",
          "ਕੀ là câu hỏi 'gì', phát âm gần 'ki'.",
        ],
        pronunciation_focus_en: [
          "tuhada has a clear h in the middle; do not flatten it to 'tuada'.",
          "ki is a question word here: what.",
        ],
      },
      {
        gurmukhi: "ਮੇਰਾ ਨਾਮ ਆਨਾ ਹੈ।",
        romanization: "mera naam Ana hai",
        vi: "Tên tôi là Ana.",
        en: "My name is Ana.",
        pronunciation_focus: [
          "ਮੇਰਾ gần 'me-ra'; r bật nhẹ đầu lưỡi.",
          "ਹੈ là 'hai', không đọc như tiếng Anh 'hey' quá dài.",
        ],
        pronunciation_focus_en: [
          "The r in mera is a light tap, not a heavy English r.",
          "hai is short; avoid stretching it like 'hey'.",
        ],
      },
      {
        gurmukhi: "ਧੰਨਵਾਦ ਜੀ।",
        romanization: "dhannvaad ji",
        vi: "Cảm ơn ạ.",
        en: "Thank you respectfully.",
        pronunciation_focus: [
          "ਧ là âm bật hơi; thở nhẹ sau d.",
          "ੰ trong ਧੰਨਵਾਦ tạo âm mũi, không đọc thành một nguyên âm riêng.",
        ],
        pronunciation_focus_en: [
          "dh is breathy/aspirated; do not pronounce it like plain English d.",
          "The nasal mark in ਧੰਨ adds nasal color before the next consonant.",
        ],
      },
    ],
    dialogue: [
      {
        speaker: "A",
        gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ।",
        romanization: "sat sri akal ji",
        vi: "Xin chào ạ.",
        en: "Hello, respectfully.",
      },
      {
        speaker: "B",
        gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
        romanization: "sat sri akal. tuhada naam ki hai?",
        vi: "Xin chào. Tên của bạn là gì?",
        en: "Hello. What is your name?",
      },
      {
        speaker: "A",
        gurmukhi: "ਮੇਰਾ ਨਾਮ ਆਨਾ ਹੈ।",
        romanization: "mera naam Ana hai",
        vi: "Tên tôi là Ana.",
        en: "My name is Ana.",
      },
      {
        speaker: "B",
        gurmukhi: "ਧੰਨਵਾਦ ਜੀ।",
        romanization: "dhannvaad ji",
        vi: "Cảm ơn ạ.",
        en: "Thank you respectfully.",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ __।",
        answer: "ਜੀ",
        hint_vi: "Thêm từ lịch sự giống 'ạ'.",
        hint_en: "Add the respect marker.",
      },
      {
        type: "matching",
        instruction_vi: "Nối chữ Gurmukhi với nghĩa tiếng Việt/Anh.",
        instruction_en: "Match the Gurmukhi item with its meaning.",
        pairs: [
          { gurmukhi: "ਜੀ", meaning: "respect marker / từ lịch sự" },
          { gurmukhi: "ਧੰਨਵਾਦ", meaning: "thank you / cảm ơn" },
          { gurmukhi: "ਨਾਮ", meaning: "name / tên" },
        ],
      },
      {
        type: "translation",
        vi: "Tên tôi là Ana.",
        en: "My name is Ana.",
        gurmukhi: "ਮੇਰਾ ਨਾਮ ਆਨਾ ਹੈ।",
        romanization: "mera naam Ana hai",
      },
    ],
    cultural_notes_vi:
      "Punjabi được viết bằng chữ Gurmukhi trong ngữ cảnh Punjab Ấn Độ và cộng đồng Sikh. Shahmukhi cũng tồn tại trong ngữ cảnh Punjab Pakistan, nhưng khóa nền tảng này chỉ dạy Gurmukhi; Shahmukhi chỉ được nhắc để người học biết có hệ chữ khác.",
    cultural_notes_en:
      "Punjabi is written in Gurmukhi in Indian Punjab and many Sikh contexts. Shahmukhi is also used in Pakistani Punjab, but this foundation teaches Gurmukhi only; Shahmukhi is mentioned for awareness, not as a course track.",
    tip_advice_vi:
      "Mỗi thẻ hãy đọc theo thứ tự: Gurmukhi trước, romanization sau, rồi nghĩa tiếng Việt/Anh. Nếu nhìn romanization trước quá lâu, bạn sẽ khó nhớ chữ Gurmukhi.",
    tip_advice_en:
      "Read each item in this order: Gurmukhi first, romanization second, meaning third. If you lean on romanization too early, the script will stay passive.",
  },
];

export default lessons;
