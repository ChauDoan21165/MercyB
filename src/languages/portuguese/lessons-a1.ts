// src/languages/portuguese/lessons-a1.ts
//
// Brazilian Portuguese A1 lessons for Vietnamese learners.
// Beginner survival pack: greetings, introductions, numbers, food, directions.
// Each lesson carries Vietnamese L1 notes (cultural_notes_vi, tip_advice_vi,
// pronunciation_vi) and English companions (pronunciation_focus_en, *_en).
//
// Shape mirrors the French pack (src/languages/french/lessons-a1.ts) so the
// page UI stays consistent across language verticals. The type is defined
// inline here because the Portuguese pack does not yet have a sibling
// lessons.ts registry — this file is self-contained on purpose.
//
// Variety: European vs. Brazilian Portuguese differ in pronunciation and some
// vocabulary; everything below is **Brazilian** (BR). Hand-crafted, no filler.

export type PortugueseCategoryId =
  | "greetings"
  | "introductions"
  | "numbers"
  | "food"
  | "directions";

export type LessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  // English-speaker companion to pronunciation_focus — same length + order.
  pronunciation_focus_en?: string[];
};

export type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  // Vietnamese-speaker pronunciation hint with stressed syllable in CAPS.
  pronunciation_vi: string;
  // English-speaker pronunciation hint with stressed syllable in CAPS.
  pronunciation_en?: string;
};

export type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (fill_blank, matching, translation) vary.
export type Exercise = Record<string, unknown>;

export type PortugueseCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type PortugueseLesson = {
  id: string;
  category: PortugueseCategoryId;
  level: PortugueseCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
  content?: string;
};

export const lessons: PortugueseLesson[] = [
  {
    id: "portuguese_greetings_intro",
    level: "A1",
    category: "greetings",
    title_vi: "Chào hỏi cơ bản",
    title_en: "Basic greetings",
    sentences: [
      {
        en: "Oi, tudo bem?",
        vi: "Chào, mọi chuyện ổn chứ?",
        pronunciation_focus: [
          "oi → oi",
          "tudo → TU-du",
          "o cuối → u",
          "bem → âm mũi 'beng'",
        ],
        pronunciation_focus_en: [
          "oi → 'oy' as in 'boy' — the all-purpose casual hello",
          "tudo → 'TOO-doo' — stress on the first syllable",
          "final unstressed -o → 'oo'; Brazilians reduce it (tudo sounds like 'TOO-doo')",
          "bem → nasal 'beng' — the 'm' nasalizes the vowel, it is not a hard 'm'",
        ],
      },
      {
        en: "Bom dia! Como vai você?",
        vi: "Chào buổi sáng! Bạn khỏe không?",
        pronunciation_focus: [
          "bom → âm mũi 'bong'",
          "dia → DJI-a",
          "vai → vai",
          "você → vô-XÊ",
        ],
        pronunciation_focus_en: [
          "bom → nasal 'bong'; 'om' is a nasal vowel, no hard 'm'",
          "dia → 'DJEE-ah' — 'di' palatalizes to 'dji' (like the 'j' in 'jeans') in Brazil",
          "vai → 'vy' rhymes with 'eye'",
          "você → 'voh-SEH' — stress the final syllable; 'ç/c' here is a soft 's'",
        ],
      },
      {
        en: "Boa tarde! Boa noite!",
        vi: "Chào buổi chiều! Chào buổi tối / Chúc ngủ ngon!",
        pronunciation_focus: [
          "boa → BÔ-a",
          "tarde → TAR-dji",
          "noite → NOI-tchi",
          "e cuối → i",
        ],
        pronunciation_focus_en: [
          "boa → 'BOH-ah' — two clear vowels, stress the first",
          "tarde → 'TAR-dji' — 'de' palatalizes to 'dji'; the 'r' is a soft tap",
          "noite → 'NOY-tchi' — 'te' palatalizes to 'tchi' (like 'ch' in 'cheese')",
          "final unstressed -e → 'i'; this is why tarde/noite end in a '-i' sound",
        ],
      },
      {
        en: "Tchau! Até logo!",
        vi: "Tạm biệt! Hẹn gặp lại!",
        pronunciation_focus: [
          "tchau → 'chao'",
          "até → a-TÉ",
          "logo → LÔ-gu",
          "g cứng",
        ],
        pronunciation_focus_en: [
          "tchau → 'chow' — identical to Italian 'ciao'; the spelling is Portuguese",
          "até → 'ah-TEH' — stress the final 'é' (open 'eh' as in 'bed')",
          "logo → 'LOH-goo' — final -o reduces to 'oo'",
          "the 'g' before 'o' is a hard 'g' as in 'go' (not the soft 'g' of 'gente')",
        ],
      },
      {
        en: "Muito obrigado! De nada.",
        vi: "Cảm ơn nhiều! Không có gì.",
        pronunciation_focus: [
          "muito → MUYN-tu (âm mũi)",
          "obrigado → o-bri-GA-du",
          "nada → NA-da",
          "obrigada (nữ)",
        ],
        pronunciation_focus_en: [
          "muito → 'MWEEN-too' — unexpectedly nasal; sounds like 'mwee(n)too'",
          "obrigado → 'oh-bree-GAH-doo' — stress the third syllable",
          "de nada → 'dji NAH-dah' — 'de' is 'dji'; means 'you're welcome'",
          "say obrigado if you are male, obrigada if female — it agrees with the SPEAKER",
        ],
      },
    ],
    cultural_notes_vi:
      "Người Brazil chào rất ấm áp và thân mật. 'Oi' dùng được mọi lúc, không trang trọng. 'Tudo bem?' vừa là câu chào vừa là câu hỏi — trả lời 'Tudo bem' hoặc 'Tudo bom' đều được. Quan trọng nhất: 'obrigado' (nam nói) khác 'obrigada' (nữ nói) — chia theo GIỚI TÍNH của người nói, không phải người nghe. Đây là lỗi phổ biến nhất của người mới học.",
    cultural_notes_en:
      "Brazilians greet warmly and informally — far less formal than European Portuguese. *Oi* works any time of day. *Tudo bem?* ('all good?') is both a greeting and a question; you can answer *Tudo bem* or *Tudo bom*, and often people just say it back without literally answering. The one rule beginners must internalize: *obrigado* (said by a male) vs. *obrigada* (said by a female) — it agrees with the gender of the SPEAKER, not the listener. A man always says *obrigado* even to a woman.",
    tip_advice_vi:
      "Học thuộc bộ ba theo thời gian: 'bom dia' (sáng), 'boa tarde' (chiều), 'boa noite' (tối + chúc ngủ ngon). Mẹo cho người Việt: âm 'di/de' đọc thành 'dji', âm 'ti/te' đọc thành 'tchi' — đây là đặc trưng tiếng Brazil mà tiếng Bồ Đào Nha không có. 'noite' nghe như 'NOI-tchi'.",
    tip_advice_en:
      "Lock in the time-of-day trio: *bom dia* (morning), *boa tarde* (afternoon), *boa noite* (evening AND goodnight). The signature Brazilian sound: 'di/de' becomes 'dji' and 'ti/te' becomes 'tchi' — so *dia* is 'DJEE-ah' and *noite* is 'NOY-tchi'. European Portuguese does not do this, so it's the fastest way to sound Brazilian.",
    vocabulary: [
      {
        word: "oi",
        en: "hi (informal)",
        vi: "chào (thân mật)",
        pos: "interjection",
        pronunciation_vi: "OI — như 'oi' trong 'coi'",
        pronunciation_en: "OY — like 'oy' in 'boy'",
      },
      {
        word: "olá",
        en: "hello",
        vi: "xin chào",
        pos: "interjection",
        pronunciation_vi: "o-LÁ — nhấn cuối",
        pronunciation_en: "oh-LAH — stress the final syllable",
      },
      {
        word: "bom dia",
        en: "good morning",
        vi: "chào buổi sáng",
        pos: "phrase",
        pronunciation_vi: "bong DJI-a — 'om' âm mũi",
        pronunciation_en: "bong DJEE-ah — nasal 'bong'",
      },
      {
        word: "boa tarde",
        en: "good afternoon",
        vi: "chào buổi chiều",
        pos: "phrase",
        pronunciation_vi: "BÔ-a TAR-dji",
        pronunciation_en: "BOH-ah TAR-dji",
      },
      {
        word: "boa noite",
        en: "good evening / goodnight",
        vi: "chào buổi tối / chúc ngủ ngon",
        pos: "phrase",
        pronunciation_vi: "BÔ-a NOI-tchi",
        pronunciation_en: "BOH-ah NOY-tchi",
      },
      {
        word: "tchau",
        en: "bye",
        vi: "tạm biệt",
        pos: "interjection",
        pronunciation_vi: "CHAU — như 'chào' không dấu",
        pronunciation_en: "chow — like Italian 'ciao'",
      },
      {
        word: "obrigado / obrigada",
        en: "thank you (male / female speaker)",
        vi: "cảm ơn (nam / nữ nói)",
        pos: "interjection",
        pronunciation_vi: "o-bri-GA-du / o-bri-GA-da",
        pronunciation_en: "oh-bree-GAH-doo / oh-bree-GAH-dah",
      },
      {
        word: "de nada",
        en: "you're welcome",
        vi: "không có gì",
        pos: "phrase",
        pronunciation_vi: "dji NA-da — 'de' đọc 'dji'",
        pronunciation_en: "dji NAH-dah",
      },
      {
        word: "por favor",
        en: "please",
        vi: "làm ơn / xin",
        pos: "phrase",
        pronunciation_vi: "por fa-VOR — 'r' cuối nhẹ",
        pronunciation_en: "por fah-VOR — soft final 'r'",
      },
      {
        word: "com licença",
        en: "excuse me",
        vi: "xin phép / xin lỗi (để đi qua)",
        pos: "phrase",
        pronunciation_vi: "com li-SEN-sa — 'ç' đọc 's'",
        pronunciation_en: "kong lee-SEN-sah — 'ç' is a soft 's'",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        text: "Oi! Bom dia! Tudo bem?",
        vi: "Chào! Buổi sáng tốt lành! Mọi chuyện ổn chứ?",
        en: "Hi! Good morning! All good?",
      },
      {
        speaker: "B",
        text: "Tudo bem, obrigada! E você?",
        vi: "Mọi chuyện ổn, cảm ơn! Còn bạn?",
        en: "All good, thank you! And you?",
      },
      {
        speaker: "A",
        text: "Tudo ótimo! Até logo!",
        vi: "Tuyệt vời! Hẹn gặp lại!",
        en: "Everything's great! See you soon!",
      },
      {
        speaker: "B",
        text: "Tchau, tchau!",
        vi: "Tạm biệt nhé!",
        en: "Bye bye!",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền lời chào đúng theo thời gian:",
        instruction_en: "Fill in the right greeting for the time of day:",
        pronunciation_focus: ["bom dia", "boa tarde", "boa noite"],
        pronunciation_focus_en: [
          "bom dia → 'bong DJEE-ah' (morning)",
          "boa tarde → 'BOH-ah TAR-dji' (afternoon)",
          "boa noite → 'BOH-ah NOY-tchi' (evening/night)",
        ],
        items: [
          {
            prompt: "(8h sáng) ___, professor!",
            answer: "Bom dia",
            options: ["Bom dia", "Boa tarde", "Boa noite"],
          },
          {
            prompt: "(15h chiều) ___, senhora!",
            answer: "Boa tarde",
            options: ["Bom dia", "Boa tarde", "Boa noite"],
          },
          {
            prompt: "(21h tối) ___, pessoal!",
            answer: "Boa noite",
            options: ["Bom dia", "Boa tarde", "Boa noite"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ tiếng Brazil với nghĩa tiếng Việt:",
        instruction_en: "Match each Portuguese word with its meaning:",
        pronunciation_focus: ["obrigado/obrigada"],
        pronunciation_focus_en: [
          "obrigado (male) / obrigada (female) — agrees with the speaker",
        ],
        items: [
          { prompt: "obrigado", answer: "cảm ơn (nam nói)" },
          { prompt: "por favor", answer: "làm ơn" },
          { prompt: "de nada", answer: "không có gì" },
          { prompt: "com licença", answer: "xin phép đi qua" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Brazil:",
        instruction_en: "Translate into Brazilian Portuguese:",
        pronunciation_focus: ["você", "tudo bem"],
        pronunciation_focus_en: [
          "você → 'voh-SEH' (you)",
          "tudo bem → 'TOO-doo beng' (all good)",
        ],
        items: [
          { prompt: "Chào, bạn khỏe không?", answer: "Oi, tudo bem?" },
          { prompt: "Cảm ơn nhiều! (nữ nói)", answer: "Muito obrigada!" },
          { prompt: "Chào buổi tối, hẹn gặp lại!", answer: "Boa noite, até logo!" },
        ],
      },
    ],
  },
  {
    id: "portuguese_introductions",
    level: "A1",
    category: "introductions",
    title_vi: "Tự giới thiệu bản thân",
    title_en: "Introducing yourself",
    sentences: [
      {
        en: "Meu nome é Ana. Como você se chama?",
        vi: "Tôi tên là Ana. Bạn tên gì?",
        pronunciation_focus: [
          "meu → MÊ-u",
          "nome → NÔ-mi",
          "é → 'é' mở",
          "chama → SHA-ma",
        ],
        pronunciation_focus_en: [
          "meu → 'MEH-oo' — a glide from 'eh' to 'oo'",
          "nome → 'NOH-mi' — final -e becomes 'i'",
          "é → open 'eh' as in 'bed' (this accented é means 'is')",
          "chama → 'SHAH-mah' — 'ch' is the English 'sh'",
        ],
      },
      {
        en: "Eu sou do Vietnã. E você, de onde é?",
        vi: "Tôi đến từ Việt Nam. Còn bạn, từ đâu đến?",
        pronunciation_focus: [
          "eu → ê-u",
          "sou → sô",
          "Vietnã → vi-et-NÃ (âm mũi)",
          "onde → ON-dji",
        ],
        pronunciation_focus_en: [
          "eu → 'eh-oo' — the word for 'I'",
          "sou → 'soh' — 'I am' (from ser); 'ou' is a clean 'oh'",
          "Vietnã → 'vee-et-NAH' with a strong nasal final 'ã'",
          "onde → 'OWN-dji' — 'on' nasal, 'de' palatalizes to 'dji'",
        ],
      },
      {
        en: "Muito prazer em conhecer você!",
        vi: "Rất hân hạnh được gặp bạn!",
        pronunciation_focus: [
          "prazer → pra-ZER",
          "em → âm mũi 'eng'",
          "conhecer → co-nhe-SER",
          "z → z (rung)",
        ],
        pronunciation_focus_en: [
          "prazer → 'prah-ZEHR' — the 'z' is a real buzzing 'z'; stress the end",
          "em → nasal 'eng'; the 'm' nasalizes, no hard 'm'",
          "conhecer → 'koh-nyeh-SEHR' — 'nh' is exactly Vietnamese 'nh' (= 'ny' in 'canyon')",
          "the two 'c' here: 'co' is hard 'k', 'cer' is soft 's'",
        ],
      },
      {
        en: "Eu tenho vinte anos e moro em São Paulo.",
        vi: "Tôi hai mươi tuổi và sống ở São Paulo.",
        pronunciation_focus: [
          "tenho → TE-nhu",
          "anos → A-nus",
          "moro → MÔ-ru",
          "São → SÃU (âm mũi)",
        ],
        pronunciation_focus_en: [
          "tenho → 'TEH-nyoo' — 'nh' = 'ny'; means 'I have'",
          "anos → 'AH-noos' — 'I have X anos' is how you say your age",
          "moro → 'MOH-roo' — single 'r' between vowels is a light tap (like the 'tt' in 'butter')",
          "São → 'SOWN' — 'ão' is a heavily nasal 'ow(n)'; the trickiest Portuguese sound",
        ],
      },
      {
        en: "Qual é a sua profissão? Eu sou estudante.",
        vi: "Nghề của bạn là gì? Tôi là sinh viên.",
        pronunciation_focus: [
          "qual → kual",
          "sua → SU-a",
          "profissão → pro-fi-SÃU",
          "estudante → es-tu-DAN-tchi",
        ],
        pronunciation_focus_en: [
          "qual → 'kwal' — 'qu' here keeps the 'w' (unlike Spanish)",
          "sua → 'SOO-ah' — 'your' (feminine, agreeing with profissão)",
          "profissão → 'proh-fee-SOWN' — another nasal '-ão' ending",
          "estudante → 'es-too-DAN-tchi' — final 'te' → 'tchi'",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi giới thiệu, người Brazil rất thoải mái và nhanh chóng dùng 'você' (bạn) thay vì xưng hô trang trọng. Tuổi tác được nói bằng động từ 'ter' (có): 'Eu tenho vinte anos' nghĩa đen là 'Tôi CÓ hai mươi tuổi' — khác tiếng Việt và tiếng Anh dùng 'là'. Hỏi nghề nghiệp, hỏi quê quán là chuyện bình thường, thân thiện, không bị coi là tò mò.",
    cultural_notes_en:
      "Brazilians introduce themselves casually and reach for *você* ('you') almost immediately — the formal *o senhor / a senhora* is reserved for elders or officials. Age uses the verb *ter* ('to have'): *Eu tenho vinte anos* literally means 'I HAVE twenty years' — same logic as French/Spanish, different from English 'I am'. Asking where someone is from or what they do is warm small talk, not nosy.",
    tip_advice_vi:
      "Bốn câu lõi để tự giới thiệu: 'Meu nome é...' (Tôi tên là...), 'Eu sou do/da...' (Tôi đến từ...), 'Eu tenho ... anos' (Tôi ... tuổi), 'Eu sou...' (Tôi là [nghề]). Lưu ý: 'do Vietnã' (giống đực) nhưng 'da França' (giống cái) — giới từ 'de + o/a' co lại thành 'do/da'. Âm '-ão' (São, profissão) là âm mũi khó nhất, tập riêng.",
    tip_advice_en:
      "Four core lines: *Meu nome é...* (My name is...), *Eu sou do/da...* (I'm from...), *Eu tenho ... anos* (I'm ... years old), *Eu sou...* (I am a [job]). Watch the 'from' contraction: *do Vietnã* (masculine country) but *da França* (feminine) — *de + o/a* fuses into *do/da*. The nasal '-ão' (São, profissão) is the hardest sound — drill it separately by humming the vowel through your nose.",
    vocabulary: [
      {
        word: "o nome",
        en: "name",
        vi: "tên",
        pos: "noun (m)",
        pronunciation_vi: "u NÔ-mi — 'e' cuối đọc 'i'",
        pronunciation_en: "oo NOH-mi",
      },
      {
        word: "eu sou",
        en: "I am",
        vi: "tôi là",
        pos: "verb phrase",
        pronunciation_vi: "ê-u SÔ",
        pronunciation_en: "eh-oo SOH",
      },
      {
        word: "você",
        en: "you",
        vi: "bạn",
        pos: "pronoun",
        pronunciation_vi: "vô-XÊ — nhấn cuối",
        pronunciation_en: "voh-SEH",
      },
      {
        word: "ter ... anos",
        en: "to be ... years old (lit. to have ... years)",
        vi: "... tuổi (nghĩa đen: có ... năm)",
        pos: "verb phrase",
        pronunciation_vi: "TER ... A-nus",
        pronunciation_en: "TEHR ... AH-noos",
      },
      {
        word: "morar",
        en: "to live (reside)",
        vi: "sống / cư trú",
        pos: "verb",
        pronunciation_vi: "mo-RAR — 'r' cuối nhẹ",
        pronunciation_en: "moh-RAR",
      },
      {
        word: "a profissão",
        en: "profession / job",
        vi: "nghề nghiệp",
        pos: "noun (f)",
        pronunciation_vi: "a pro-fi-SÃU — '-ão' âm mũi",
        pronunciation_en: "ah proh-fee-SOWN",
      },
      {
        word: "o estudante / a estudante",
        en: "student",
        vi: "sinh viên / học sinh",
        pos: "noun (m/f)",
        pronunciation_vi: "es-tu-DAN-tchi",
        pronunciation_en: "es-too-DAN-tchi",
      },
      {
        word: "prazer",
        en: "pleasure (nice to meet you)",
        vi: "hân hạnh",
        pos: "noun (m)",
        pronunciation_vi: "pra-ZER — 'z' rung",
        pronunciation_en: "prah-ZEHR — buzzing 'z'",
      },
      {
        word: "de onde",
        en: "from where",
        vi: "từ đâu",
        pos: "phrase",
        pronunciation_vi: "dji ON-dji",
        pronunciation_en: "dji OWN-dji",
      },
      {
        word: "o amigo / a amiga",
        en: "friend",
        vi: "bạn (nam / nữ)",
        pos: "noun (m/f)",
        pronunciation_vi: "a-MI-gu / a-MI-ga",
        pronunciation_en: "ah-MEE-goo / ah-MEE-gah",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        text: "Oi! Meu nome é Lucas. Como você se chama?",
        vi: "Chào! Tôi tên Lucas. Bạn tên gì?",
        en: "Hi! My name is Lucas. What's your name?",
      },
      {
        speaker: "B",
        text: "Eu me chamo Mai. Muito prazer!",
        vi: "Tôi tên Mai. Rất hân hạnh!",
        en: "I'm called Mai. Nice to meet you!",
      },
      {
        speaker: "A",
        text: "De onde você é, Mai?",
        vi: "Bạn từ đâu đến, Mai?",
        en: "Where are you from, Mai?",
      },
      {
        speaker: "B",
        text: "Eu sou do Vietnã, mas moro no Brasil agora.",
        vi: "Tôi đến từ Việt Nam, nhưng giờ sống ở Brazil.",
        en: "I'm from Vietnam, but I live in Brazil now.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng để tự giới thiệu:",
        instruction_en: "Fill in the blank to introduce yourself:",
        pronunciation_focus: ["sou", "tenho", "moro"],
        pronunciation_focus_en: [
          "sou → 'soh' (I am)",
          "tenho → 'TEH-nyoo' (I have)",
          "moro → 'MOH-roo' (I live)",
        ],
        items: [
          { prompt: "Meu ___ é Pedro. (tên)", answer: "nome" },
          { prompt: "Eu ___ trinta anos. (có — chỉ tuổi)", answer: "tenho" },
          { prompt: "Eu ___ em Hanói. (sống)", answer: "moro" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối câu hỏi với câu trả lời:",
        instruction_en: "Match each question with its answer:",
        pronunciation_focus: ["qual é", "de onde"],
        pronunciation_focus_en: [
          "qual é → 'kwal eh' (what is)",
          "de onde → 'dji OWN-dji' (from where)",
        ],
        items: [
          { prompt: "Como você se chama?", answer: "Meu nome é Ana." },
          { prompt: "De onde você é?", answer: "Eu sou do Vietnã." },
          { prompt: "Quantos anos você tem?", answer: "Eu tenho vinte anos." },
          { prompt: "Qual é a sua profissão?", answer: "Eu sou estudante." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Brazil:",
        instruction_en: "Translate into Brazilian Portuguese:",
        pronunciation_focus: ["prazer", "do Vietnã"],
        pronunciation_focus_en: [
          "prazer → 'prah-ZEHR'",
          "do Vietnã → 'doo vee-et-NAH'",
        ],
        items: [
          { prompt: "Tôi tên là Mai.", answer: "Meu nome é Mai." },
          { prompt: "Tôi đến từ Việt Nam.", answer: "Eu sou do Vietnã." },
          { prompt: "Rất hân hạnh được gặp bạn!", answer: "Muito prazer em conhecer você!" },
        ],
      },
    ],
  },
  {
    id: "portuguese_numbers_1_20",
    level: "A1",
    category: "numbers",
    title_vi: "Số đếm 1 đến 20",
    title_en: "Numbers 1 to 20",
    sentences: [
      {
        en: "Um, dois, três — um café, por favor.",
        vi: "Một, hai, ba — một ly cà phê, làm ơn.",
        pronunciation_focus: [
          "um → âm mũi 'ung'",
          "dois → DÔIS",
          "três → TRÊS",
          "café → ca-FÉ",
        ],
        pronunciation_focus_en: [
          "um → nasal 'oong'; means 'one' (masculine) and also 'a/an'",
          "dois → 'doh-ees' as one glide; the 's' is soft",
          "três → 'trehs' — open 'eh', the 'r' is a tap",
          "café → 'kah-FEH' — stress the final 'é' (open 'eh')",
        ],
      },
      {
        en: "Quatro, cinco, seis pães.",
        vi: "Bốn, năm, sáu cái bánh mì.",
        pronunciation_focus: [
          "quatro → KUA-tru",
          "cinco → SIN-cu (âm mũi)",
          "seis → seis",
          "pães → PÃES (âm mũi)",
        ],
        pronunciation_focus_en: [
          "quatro → 'KWAH-troo' — 'qu' keeps the 'w'",
          "cinco → 'SEEN-koo' — nasal 'in'; the first 'c' is soft 's', second is hard 'k'",
          "seis → 'sayss' — 'ei' is 'ay' as in 'say'",
          "pães → 'POWNGSH' — plural of pão (bread); nasal '-ães', very hard for beginners",
        ],
      },
      {
        en: "Sete, oito, nove reais.",
        vi: "Bảy, tám, chín real (tiền Brazil).",
        pronunciation_focus: [
          "sete → SE-tchi",
          "oito → OI-tu",
          "nove → NÔ-vi",
          "reais → he-AIS",
        ],
        pronunciation_focus_en: [
          "sete → 'SEH-tchi' — final 'te' → 'tchi'",
          "oito → 'OY-too' — 'oi' is 'oy', final -o is 'oo'",
          "nove → 'NOH-vi' — final 'e' → 'i'",
          "reais → 'heh-EYESS' — plural of real; the initial 'r' is a guttural 'h'",
        ],
      },
      {
        en: "Dez, onze, doze pessoas.",
        vi: "Mười, mười một, mười hai người.",
        pronunciation_focus: [
          "dez → DÉS",
          "onze → ON-zi (âm mũi)",
          "doze → DÔ-zi",
          "pessoas → pe-SÔ-as",
        ],
        pronunciation_focus_en: [
          "dez → 'dehss' — open 'eh', soft final 's'",
          "onze → 'OWN-zi' — nasal 'on', then a buzzing 'z'",
          "doze → 'DOH-zi' — clean 'oh', 'z', final 'e' → 'i'",
          "pessoas → 'peh-SOH-ahss' — double 's' stays a sharp 's'; means 'people'",
        ],
      },
      {
        en: "Treze, catorze, quinze... vinte!",
        vi: "Mười ba, mười bốn, mười lăm... hai mươi!",
        pronunciation_focus: [
          "treze → TRÊ-zi",
          "catorze → ca-TOR-zi",
          "quinze → KIN-zi (âm mũi)",
          "vinte → VIN-tchi (âm mũi)",
        ],
        pronunciation_focus_en: [
          "treze → 'TREH-zi' — 'z', final 'e' → 'i'",
          "catorze → 'kah-TOR-zi' — also spelled 'quatorze'",
          "quinze → 'KEEN-zi' — nasal 'in', buzzing 'z'",
          "vinte → 'VEEN-tchi' — nasal 'in', final 'te' → 'tchi'; means 'twenty'",
        ],
      },
    ],
    cultural_notes_vi:
      "Tiền Brazil là 'real' (số nhiều: 'reais'), viết tắt R$. Khác tiếng Pháp phức tạp, số đếm Brazil khá đều đặn và dễ. Lưu ý: chữ 'z' giữa các nguyên âm và cuối từ đọc rung như tiếng Anh 'zoo', không phải 's' nhẹ. Số 'um/uma' (một) và 'dois/duas' (hai) đổi theo giống: 'um livro' (một quyển sách - đực), 'uma casa' (một ngôi nhà - cái).",
    cultural_notes_en:
      "Brazil's currency is the *real* (plural *reais*), written R$. Unlike French's baroque number system, Portuguese counting is regular and easy. Note: 'z' between vowels and at word end buzzes like English 'zoo', not a soft 's'. And 'one' and 'two' agree with gender: *um/uma* (one) and *dois/duas* (two) — *um livro* (one book, masc.) but *uma casa* (one house, fem.), *dois carros* but *duas mesas*.",
    tip_advice_vi:
      "Đếm 1-20 mỗi ngày trước gương cho thuộc nhịp. Mẹo phát âm: từ kết thúc bằng '-e' (sete, nove, onze, vinte) đọc thành '-i' ở Brazil, và 'te' thành 'tchi'. Khi trả tiền, nghe số 'reais' và tập nói to giá tiền bằng tiếng Brazil — người bán sẽ quý bạn hơn.",
    tip_advice_en:
      "Count 1–20 out loud daily until the rhythm sticks. Pronunciation key: words ending in '-e' (sete, nove, onze, vinte) end in an '-i' sound in Brazil, and 'te' becomes 'tchi'. When you pay, listen for the number of *reais* and try saying the price aloud in Portuguese — vendors warm to the effort.",
    vocabulary: [
      { word: "um / uma", en: "one (m / f)", vi: "một (đực / cái)", pos: "number", pronunciation_vi: "UNG / U-ma", pronunciation_en: "oong / OO-mah" },
      { word: "dois / duas", en: "two (m / f)", vi: "hai (đực / cái)", pos: "number", pronunciation_vi: "DÔIS / DU-as", pronunciation_en: "doh-ees / DOO-ahss" },
      { word: "três", en: "three", vi: "ba", pos: "number", pronunciation_vi: "TRÊS", pronunciation_en: "trehs" },
      { word: "quatro", en: "four", vi: "bốn", pos: "number", pronunciation_vi: "KUA-tru", pronunciation_en: "KWAH-troo" },
      { word: "cinco", en: "five", vi: "năm", pos: "number", pronunciation_vi: "SIN-cu — 'in' âm mũi", pronunciation_en: "SEEN-koo" },
      { word: "dez", en: "ten", vi: "mười", pos: "number", pronunciation_vi: "DÉS — 'e' mở", pronunciation_en: "dehss" },
      { word: "vinte", en: "twenty", vi: "hai mươi", pos: "number", pronunciation_vi: "VIN-tchi", pronunciation_en: "VEEN-tchi" },
      { word: "o número", en: "number", vi: "con số", pos: "noun (m)", pronunciation_vi: "u NU-me-ru", pronunciation_en: "oo NOO-meh-roo" },
      { word: "quanto custa?", en: "how much is it?", vi: "bao nhiêu tiền?", pos: "phrase", pronunciation_vi: "KUAN-tu KUS-ta", pronunciation_en: "KWAN-too KOOS-tah" },
      { word: "o real / os reais", en: "real / reais (currency)", vi: "đồng real (tiền Brazil)", pos: "noun (m)", pronunciation_vi: "he-AL / he-AIS — 'r' đầu đọc 'h'", pronunciation_en: "heh-OW / heh-EYESS" },
    ],
    dialogue: [
      {
        speaker: "A",
        text: "Quanto custa o café?",
        vi: "Cà phê bao nhiêu tiền?",
        en: "How much is the coffee?",
      },
      {
        speaker: "B",
        text: "Cinco reais.",
        vi: "Năm real.",
        en: "Five reais.",
      },
      {
        speaker: "A",
        text: "E dois pães de queijo?",
        vi: "Còn hai cái bánh phô mai thì sao?",
        en: "And two cheese breads?",
      },
      {
        speaker: "B",
        text: "Mais seis reais. No total, onze reais.",
        vi: "Thêm sáu real. Tổng cộng, mười một real.",
        en: "Six more reais. In total, eleven reais.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền số tiếng Brazil đúng:",
        instruction_en: "Fill in the right Portuguese number:",
        pronunciation_focus: ["números"],
        pronunciation_focus_en: ["números → 'NOO-meh-roos' (numbers)"],
        items: [
          { prompt: "2 + 3 = ___ (cinco)", answer: "cinco" },
          { prompt: "10 + 1 = ___ (onze)", answer: "onze" },
          { prompt: "10 + 10 = ___ (vinte)", answer: "vinte" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối số với chữ:",
        instruction_en: "Match each numeral with its word:",
        pronunciation_focus: ["z rung"],
        pronunciation_focus_en: ["z between vowels buzzes like English 'zoo'"],
        items: [
          { prompt: "4", answer: "quatro" },
          { prompt: "7", answer: "sete" },
          { prompt: "12", answer: "doze" },
          { prompt: "15", answer: "quinze" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Brazil:",
        instruction_en: "Translate into Brazilian Portuguese:",
        pronunciation_focus: ["quanto custa", "reais"],
        pronunciation_focus_en: [
          "quanto custa → 'KWAN-too KOOS-tah'",
          "reais → 'heh-EYESS'",
        ],
        items: [
          { prompt: "Một ly cà phê, làm ơn.", answer: "Um café, por favor." },
          { prompt: "Bao nhiêu tiền?", answer: "Quanto custa?" },
          { prompt: "Tám real.", answer: "Oito reais." },
        ],
      },
    ],
  },
  {
    id: "portuguese_food_ordering",
    level: "A1",
    category: "food",
    title_vi: "Gọi món ăn và đồ uống",
    title_en: "Ordering food and drink",
    sentences: [
      {
        en: "Eu queria um pão de queijo, por favor.",
        vi: "Cho tôi một cái bánh phô mai ạ.",
        pronunciation_focus: [
          "queria → ke-RI-a",
          "pão → PÃU (âm mũi)",
          "de → dji",
          "queijo → KEI-ju",
        ],
        pronunciation_focus_en: [
          "queria → 'keh-REE-ah' — soft, polite 'I would like'; 'qu' is just 'k'",
          "pão → 'POWN' — nasal '-ão'; means 'bread'",
          "de → 'dji' — the linking word 'of'",
          "queijo → 'KAY-zhoo' — 'ei' is 'ay', 'j' is the soft 'zh' as in 'measure'",
        ],
      },
      {
        en: "Para beber, um suco de laranja.",
        vi: "Để uống, một ly nước cam.",
        pronunciation_focus: [
          "para → PA-ra",
          "beber → be-BER",
          "suco → SU-cu",
          "laranja → la-RAN-ja",
        ],
        pronunciation_focus_en: [
          "para → 'PAH-rah' (often shortened to 'pra' in speech); means 'for/to'",
          "beber → 'beh-BEHR' — 'to drink'; both 'b' are hard",
          "suco → 'SOO-koo' — 'juice'",
          "laranja → 'lah-RAHN-zhah' — 'j' is soft 'zh'; means 'orange'",
        ],
      },
      {
        en: "Está com fome? Vamos almoçar!",
        vi: "Đói bụng chưa? Mình đi ăn trưa đi!",
        pronunciation_focus: [
          "está → es-TÁ",
          "fome → FÔ-mi",
          "vamos → VA-mus",
          "almoçar → al-mo-SAR",
        ],
        pronunciation_focus_en: [
          "está → 'es-TAH' (often 'tá' in speech); 'is' (temporary state)",
          "fome → 'FOH-mi' — 'estar com fome' = 'to be hungry' (lit. 'be with hunger')",
          "vamos → 'VAH-moos' — 'let's' / 'we go'",
          "almoçar → 'ow-moh-SAR' — 'ç' is soft 's'; means 'to have lunch'",
        ],
      },
      {
        en: "A conta, por favor. Posso pagar com cartão?",
        vi: "Cho xin hóa đơn ạ. Tôi trả bằng thẻ được không?",
        pronunciation_focus: [
          "conta → CON-ta (âm mũi)",
          "posso → PÔ-su",
          "pagar → pa-GAR",
          "cartão → car-TÃU",
        ],
        pronunciation_focus_en: [
          "conta → 'KOWN-tah' — nasal 'on'; means 'the bill'",
          "posso → 'POH-soo' — double 's' is a sharp 's'; means 'can I'",
          "pagar → 'pah-GAR' — hard 'g'; means 'to pay'",
          "cartão → 'kar-TOWN' — nasal '-ão'; means 'card'",
        ],
      },
      {
        en: "Estava delicioso! Muito obrigado.",
        vi: "Ngon tuyệt! Cảm ơn nhiều.",
        pronunciation_focus: [
          "estava → es-TA-va",
          "delicioso → de-li-si-Ô-zu",
          "s giữa nguyên âm → z",
          "obrigado",
        ],
        pronunciation_focus_en: [
          "estava → 'es-TAH-vah' — 'it was'",
          "delicioso → 'deh-lee-see-OH-zoo' — note the single 's' before final 'o' buzzes to 'z'",
          "a single 's' between vowels → 'z' (so '-oso' endings sound like '-OH-zoo')",
          "obrigado (m) / obrigada (f) — agrees with the speaker",
        ],
      },
    ],
    cultural_notes_vi:
      "'Pão de queijo' (bánh phô mai) là món ăn vặt quốc dân của Brazil, ăn kèm cà phê. Người Brazil dùng 'Eu queria...' (Tôi muốn...) khi gọi món — lịch sự hơn 'Eu quero' (Tôi muốn - nghe như ra lệnh). Tiền tip ('gorjeta') thường 10% và thường đã tính sẵn trong hóa đơn ('serviço'). Bữa trưa ('almoço') là bữa chính trong ngày.",
    cultural_notes_en:
      "*Pão de queijo* (cheese bread) is Brazil's national snack, eaten with coffee. Brazilians order with *Eu queria...* ('I would like...') — softer and more polite than *Eu quero* ('I want', which sounds like an order). The tip (*gorjeta*) is usually 10% and often already added to the bill as *serviço*. Lunch (*almoço*) is the main meal of the day, not dinner.",
    tip_advice_vi:
      "Cấu trúc gọi món chuẩn: 'Eu queria + [món], por favor'. Để hỏi giá: 'Quanto custa?'. Để trả tiền: 'A conta, por favor'. Mẹo phát âm quan trọng cho người Việt: chữ 's' đứng GIỮA hai nguyên âm đọc thành 'z' (casa = CA-za, delicioso = ...Ô-zu), nhưng 'ss' giữ nguyên âm 's' (pessoa, posso).",
    tip_advice_en:
      "Ordering frame: *Eu queria + [item], por favor*. To ask the price: *Quanto custa?* To pay: *A conta, por favor*. Key pronunciation rule: a single 's' BETWEEN two vowels becomes 'z' (*casa* = 'KAH-zah', *delicioso* = '...OH-zoo'), but a double 'ss' stays a sharp 's' (*pessoa*, *posso*). Vietnamese speakers tend to keep it as 's' — train the 'z' buzz.",
    vocabulary: [
      { word: "eu queria", en: "I would like", vi: "tôi muốn (lịch sự)", pos: "verb phrase", pronunciation_vi: "ê-u ke-RI-a", pronunciation_en: "eh-oo keh-REE-ah" },
      { word: "o pão", en: "bread", vi: "bánh mì", pos: "noun (m)", pronunciation_vi: "u PÃU — '-ão' âm mũi", pronunciation_en: "oo POWN" },
      { word: "a água", en: "water", vi: "nước", pos: "noun (f)", pronunciation_vi: "a Á-gua", pronunciation_en: "AH-gwah" },
      { word: "o café", en: "coffee", vi: "cà phê", pos: "noun (m)", pronunciation_vi: "u ca-FÉ — nhấn cuối", pronunciation_en: "oo kah-FEH" },
      { word: "o suco", en: "juice", vi: "nước ép", pos: "noun (m)", pronunciation_vi: "u SU-cu", pronunciation_en: "oo SOO-koo" },
      { word: "a comida", en: "food", vi: "đồ ăn", pos: "noun (f)", pronunciation_vi: "a co-MI-da", pronunciation_en: "ah koh-MEE-dah" },
      { word: "almoçar", en: "to have lunch", vi: "ăn trưa", pos: "verb", pronunciation_vi: "al-mo-SAR — 'ç' đọc 's'", pronunciation_en: "ow-moh-SAR" },
      { word: "estar com fome", en: "to be hungry", vi: "đói bụng", pos: "verb phrase", pronunciation_vi: "es-TAR com FÔ-mi", pronunciation_en: "es-TAR kong FOH-mi" },
      { word: "a conta", en: "the bill", vi: "hóa đơn", pos: "noun (f)", pronunciation_vi: "a CON-ta — 'on' âm mũi", pronunciation_en: "ah KOWN-tah" },
      { word: "gostoso / delicioso", en: "tasty / delicious", vi: "ngon", pos: "adjective", pronunciation_vi: "gos-TÔ-zu / de-li-si-Ô-zu — 's' đọc 'z'", pronunciation_en: "gohs-TOH-zoo / deh-lee-see-OH-zoo" },
    ],
    dialogue: [
      {
        speaker: "Garçom",
        text: "Boa tarde! O que vocês vão querer?",
        vi: "Chào buổi chiều! Quý khách dùng gì ạ?",
        en: "Good afternoon! What would you like?",
      },
      {
        speaker: "Cliente",
        text: "Eu queria um pão de queijo e um café, por favor.",
        vi: "Cho tôi một bánh phô mai và một cà phê ạ.",
        en: "I'd like a cheese bread and a coffee, please.",
      },
      {
        speaker: "Garçom",
        text: "Mais alguma coisa?",
        vi: "Còn gì nữa không ạ?",
        en: "Anything else?",
      },
      {
        speaker: "Cliente",
        text: "Só isso. A conta, por favor.",
        vi: "Chỉ vậy thôi. Cho xin hóa đơn ạ.",
        en: "That's all. The bill, please.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng để gọi món:",
        instruction_en: "Fill in the blank to order:",
        pronunciation_focus: ["queria", "conta"],
        pronunciation_focus_en: [
          "queria → 'keh-REE-ah' (I'd like)",
          "conta → 'KOWN-tah' (bill)",
        ],
        items: [
          { prompt: "Eu ___ um café, por favor. (muốn)", answer: "queria" },
          { prompt: "A ___, por favor. (hóa đơn)", answer: "conta" },
          { prompt: "Estou com ___. (đói)", answer: "fome" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối món/đồ uống với nghĩa:",
        instruction_en: "Match each food/drink with its meaning:",
        pronunciation_focus: ["s → z giữa nguyên âm"],
        pronunciation_focus_en: ["single 's' between vowels → 'z'"],
        items: [
          { prompt: "o pão", answer: "bánh mì" },
          { prompt: "o suco", answer: "nước ép" },
          { prompt: "a água", answer: "nước" },
          { prompt: "o café", answer: "cà phê" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Brazil:",
        instruction_en: "Translate into Brazilian Portuguese:",
        pronunciation_focus: ["por favor", "delicioso"],
        pronunciation_focus_en: [
          "por favor → 'por fah-VOR'",
          "delicioso → 'deh-lee-see-OH-zoo'",
        ],
        items: [
          { prompt: "Cho tôi một ly nước, làm ơn.", answer: "Eu queria uma água, por favor." },
          { prompt: "Cho xin hóa đơn ạ.", answer: "A conta, por favor." },
          { prompt: "Ngon tuyệt!", answer: "Estava delicioso!" },
        ],
      },
    ],
  },
  {
    id: "portuguese_directions",
    level: "A1",
    category: "directions",
    title_vi: "Hỏi đường và chỉ đường",
    title_en: "Asking for and giving directions",
    sentences: [
      {
        en: "Com licença, onde fica o banheiro?",
        vi: "Xin lỗi, nhà vệ sinh ở đâu ạ?",
        pronunciation_focus: [
          "licença → li-SEN-sa",
          "onde → ON-dji",
          "fica → FI-ca",
          "banheiro → ba-NHEI-ru",
        ],
        pronunciation_focus_en: [
          "licença → 'lee-SEN-sah' — 'com licença' = 'excuse me'",
          "onde → 'OWN-dji' — nasal 'on', 'de' → 'dji'; means 'where'",
          "fica → 'FEE-kah' — 'onde fica?' = 'where is (located)?'",
          "banheiro → 'bah-NYAY-roo' — 'nh' = Vietnamese 'nh'; 'ei' is 'ay'; means 'bathroom'",
        ],
      },
      {
        en: "Vá em frente e vire à direita.",
        vi: "Đi thẳng rồi rẽ phải.",
        pronunciation_focus: [
          "vá → VÁ",
          "frente → FREN-tchi",
          "vire → VI-ri",
          "direita → di-REI-ta",
        ],
        pronunciation_focus_en: [
          "vá → 'vah' — command form of 'go'",
          "em frente → 'eng FREN-tchi' — 'straight ahead'; 'te' → 'tchi'",
          "vire → 'VEE-ri' — command form of 'turn'",
          "à direita → 'ah dee-RAY-tah' — 'to the right'",
        ],
      },
      {
        en: "Vire à esquerda na próxima rua.",
        vi: "Rẽ trái ở con phố tiếp theo.",
        pronunciation_focus: [
          "esquerda → es-KER-da",
          "próxima → PRÓ-si-ma",
          "rua → HU-a",
          "r đầu → h",
        ],
        pronunciation_focus_en: [
          "esquerda → 'es-KEHR-dah' — 'to the left' (à esquerda)",
          "próxima → 'PROH-see-mah' — here 'x' is 's'; means 'next'",
          "rua → 'HOO-ah' — initial 'r' is a guttural 'h' (like the 'h' in 'hat', but stronger); means 'street'",
          "an initial 'r' or double 'rr' → a throaty 'h' sound in Brazil, NEVER a rolled Spanish 'r'",
        ],
      },
      {
        en: "É perto ou longe daqui?",
        vi: "Có gần hay xa đây không?",
        pronunciation_focus: [
          "perto → PER-tu",
          "ou → ô",
          "longe → LON-ji (âm mũi)",
          "daqui → da-KI",
        ],
        pronunciation_focus_en: [
          "perto → 'PEHR-too' — means 'near/close'",
          "ou → 'oh' — means 'or'",
          "longe → 'LOWN-zhi' — nasal 'on', 'ge' is soft 'zh'; means 'far'",
          "daqui → 'dah-KEE' — 'de + aqui' = 'from here'",
        ],
      },
      {
        en: "Fica ao lado da estação de metrô.",
        vi: "Nó ở cạnh ga tàu điện ngầm.",
        pronunciation_focus: [
          "ao lado → au LA-du",
          "estação → es-ta-SÃU",
          "metrô → me-TRÔ",
          "ção → 'sãu' âm mũi",
        ],
        pronunciation_focus_en: [
          "ao lado de → 'ow LAH-doo dji' — 'next to / beside'",
          "estação → 'es-tah-SOWN' — nasal '-ão'; means 'station'",
          "metrô → 'meh-TROH' — stress the final 'ô'; means 'metro/subway'",
          "'-ção' → 'SOWN' — the very common '-tion' ending, always nasal",
        ],
      },
    ],
    cultural_notes_vi:
      "Người Brazil rất nhiệt tình chỉ đường, đôi khi còn dẫn bạn đi luôn. 'Com licença' (xin lỗi) là câu mở đầu lịch sự khi hỏi người lạ. Lưu ý văn hóa: người Brazil hay dùng cử chỉ tay và những từ áng chừng như 'logo ali' (ngay đằng kia), 'mais ou menos' (đại khái) — đừng mong chỉ dẫn chính xác từng mét. Ở thành phố lớn, dùng app bản đồ kèm theo cho chắc.",
    cultural_notes_en:
      "Brazilians are eager to give directions — sometimes they'll walk you there themselves. *Com licença* ('excuse me') is the polite opener for strangers. Cultural note: directions come with lots of hand gestures and vague phrases like *logo ali* ('right over there') and *mais ou menos* ('more or less') — don't expect meter-by-meter precision. In big cities, pair it with a map app to be safe.",
    tip_advice_vi:
      "Hai câu hỏi vàng: 'Onde fica...?' (... ở đâu?) và 'É perto daqui?' (Có gần đây không?). Học cặp đối: 'direita' (phải) ↔ 'esquerda' (trái), 'perto' (gần) ↔ 'longe' (xa), 'em frente' (thẳng) ↔ 'atrás' (sau). Mẹo phát âm khó nhất cho người Việt: chữ 'r' đầu từ ('rua', 'restaurante') đọc thành 'h' nặng — KHÔNG phải 'r' rung.",
    tip_advice_en:
      "Two golden questions: *Onde fica...?* ('Where is...?') and *É perto daqui?* ('Is it near here?'). Learn the opposites in pairs: *direita* (right) ↔ *esquerda* (left), *perto* (near) ↔ *longe* (far), *em frente* (straight) ↔ *atrás* (behind). The hardest sound for Vietnamese speakers: an initial 'r' (*rua*, *restaurante*) is a strong 'h', NOT a rolled or tapped 'r' — say 'HOO-ah', not 'ROO-ah'.",
    vocabulary: [
      { word: "onde fica?", en: "where is (it located)?", vi: "ở đâu?", pos: "phrase", pronunciation_vi: "ON-dji FI-ca", pronunciation_en: "OWN-dji FEE-kah" },
      { word: "à direita", en: "to the right", vi: "bên phải", pos: "phrase", pronunciation_vi: "a di-REI-ta", pronunciation_en: "ah dee-RAY-tah" },
      { word: "à esquerda", en: "to the left", vi: "bên trái", pos: "phrase", pronunciation_vi: "a es-KER-da", pronunciation_en: "ah es-KEHR-dah" },
      { word: "em frente", en: "straight ahead", vi: "đi thẳng", pos: "phrase", pronunciation_vi: "eng FREN-tchi", pronunciation_en: "eng FREN-tchi" },
      { word: "perto", en: "near", vi: "gần", pos: "adverb", pronunciation_vi: "PER-tu", pronunciation_en: "PEHR-too" },
      { word: "longe", en: "far", vi: "xa", pos: "adverb", pronunciation_vi: "LON-ji — 'on' âm mũi", pronunciation_en: "LOWN-zhi" },
      { word: "a rua", en: "street", vi: "con phố / đường", pos: "noun (f)", pronunciation_vi: "a HU-a — 'r' đầu đọc 'h'", pronunciation_en: "ah HOO-ah" },
      { word: "a esquina", en: "corner", vi: "góc đường", pos: "noun (f)", pronunciation_vi: "a es-KI-na", pronunciation_en: "ah es-KEE-nah" },
      { word: "o banheiro", en: "bathroom / toilet", vi: "nhà vệ sinh", pos: "noun (m)", pronunciation_vi: "u ba-NHEI-ru — 'nh' như tiếng Việt", pronunciation_en: "oo bah-NYAY-roo" },
      { word: "a estação", en: "station", vi: "nhà ga / trạm", pos: "noun (f)", pronunciation_vi: "a es-ta-SÃU — '-ão' âm mũi", pronunciation_en: "ah es-tah-SOWN" },
    ],
    dialogue: [
      {
        speaker: "Turista",
        text: "Com licença, onde fica a estação de metrô?",
        vi: "Xin lỗi, ga tàu điện ngầm ở đâu ạ?",
        en: "Excuse me, where is the metro station?",
      },
      {
        speaker: "Local",
        text: "Vá em frente e vire à direita na próxima rua.",
        vi: "Đi thẳng rồi rẽ phải ở con phố tiếp theo.",
        en: "Go straight and turn right at the next street.",
      },
      {
        speaker: "Turista",
        text: "É perto daqui?",
        vi: "Có gần đây không ạ?",
        en: "Is it near here?",
      },
      {
        speaker: "Local",
        text: "Sim, fica logo ali, ao lado do banco.",
        vi: "Có, ngay đằng kia, cạnh ngân hàng.",
        en: "Yes, it's right over there, next to the bank.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ chỉ hướng đúng:",
        instruction_en: "Fill in the right direction word:",
        pronunciation_focus: ["direita", "esquerda"],
        pronunciation_focus_en: [
          "direita → 'dee-RAY-tah' (right)",
          "esquerda → 'es-KEHR-dah' (left)",
        ],
        items: [
          { prompt: "Vire à ___ (phải).", answer: "direita" },
          { prompt: "Vire à ___ (trái).", answer: "esquerda" },
          { prompt: "Vá em ___ (thẳng).", answer: "frente" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        instruction_en: "Match each word with its meaning:",
        pronunciation_focus: ["r đầu → h"],
        pronunciation_focus_en: ["initial 'r' → guttural 'h'"],
        items: [
          { prompt: "perto", answer: "gần" },
          { prompt: "longe", answer: "xa" },
          { prompt: "a rua", answer: "con phố" },
          { prompt: "o banheiro", answer: "nhà vệ sinh" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Brazil:",
        instruction_en: "Translate into Brazilian Portuguese:",
        pronunciation_focus: ["onde fica", "com licença"],
        pronunciation_focus_en: [
          "onde fica → 'OWN-dji FEE-kah'",
          "com licença → 'kong lee-SEN-sah'",
        ],
        items: [
          { prompt: "Xin lỗi, nhà vệ sinh ở đâu?", answer: "Com licença, onde fica o banheiro?" },
          { prompt: "Đi thẳng rồi rẽ trái.", answer: "Vá em frente e vire à esquerda." },
          { prompt: "Có gần đây không?", answer: "É perto daqui?" },
        ],
      },
    ],
  },
];

export default lessons;
