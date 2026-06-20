// src/languages/indonesian/lessons-a1.ts
//
// Indonesian (Bahasa Indonesia) A1 lessons for Vietnamese learners.
// Beginner survival pack: greetings, introductions, numbers 1-100, basic
// question words, food ordering, directions, and family.
//
// Each lesson carries Vietnamese L1 notes (cultural_notes_vi, tip_advice_vi,
// pronunciation_vi) and English companions (pronunciation_focus_en, *_en).
//
// Shape mirrors the Portuguese pack (src/languages/portuguese/lessons-a1.ts) so
// the page UI stays consistent across language verticals. The type is defined
// inline here on purpose — each wave authors its own slightly-divergent shape
// and the barrel re-types to a structural superset.
//
// Indonesian uses the Latin alphabet and is largely phonetic — no special
// script rendering needed. The big win for Vietnamese speakers: NO tones, NO
// verb conjugation, NO articles, NO grammatical gender, NO plurals by ending.
// Throughout, the L1 notes lean on what is EASIER for Vietnamese learners.

export type IndonesianCategoryId =
  | "greetings"
  | "introductions"
  | "numbers"
  | "questions"
  | "food"
  | "directions"
  | "family";

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
export type Exercise = Record<string, any>;

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IndonesianLesson = {
  id: string;
  category: IndonesianCategoryId;
  level: IndonesianCefrLevel;
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

export const lessons: IndonesianLesson[] = [
  // ───────────────────────────────────────────────────────────── greetings
  {
    id: "indonesian_greetings_intro",
    level: "A1",
    category: "greetings",
    title_vi: "Chào hỏi cơ bản",
    title_en: "Basic greetings",
    sentences: [
      {
        en: "Good morning! How are you?",
        vi: "Chào buổi sáng! Bạn khỏe không?",
        pronunciation_focus: [
          "selamat → se-LA-mat",
          "pagi → PA-gi (g cứng)",
          "apa → A-pa",
          "kabar → KA-bar",
        ],
        pronunciation_focus_en: [
          "selamat → 'se-LAH-mat' — the all-purpose 'safe/blessed' word that starts every greeting",
          "pagi → 'PAH-gee' — hard 'g' as in 'go', never soft",
          "apa → 'AH-pah' — means 'what', here it forms the phrase 'apa kabar'",
          "kabar → 'KAH-bar' — literally 'news'; 'apa kabar' = 'what's the news' = 'how are you'",
        ],
      },
      {
        en: "Good midday! Good afternoon!",
        vi: "Chào buổi trưa! Chào buổi chiều!",
        pronunciation_focus: [
          "siang → SI-ang ('ng' cuối mũi)",
          "sore → SO-re (e mở)",
          "không có thanh điệu",
          "đọc đều, phẳng",
        ],
        pronunciation_focus_en: [
          "siang → 'SEE-ahng' — final 'ng' is the soft nasal as in 'sing'",
          "sore → 'SOH-reh' — open 'e' (like 'eh'), not a schwa",
          "no tones at all — keep the pitch flat and even",
          "Indonesian has no rising/falling tones; resist adding any",
        ],
      },
      {
        en: "Good evening / good night!",
        vi: "Chào buổi tối / chúc ngủ ngon!",
        pronunciation_focus: [
          "malam → MA-lam",
          "selamat malam → chào buổi tối",
          "selamat tidur → chúc ngủ ngon",
          "tidur → TI-dur",
        ],
        pronunciation_focus_en: [
          "malam → 'MAH-lam' — 'selamat malam' covers both 'good evening' and 'good night' as a greeting",
          "selamat malam → use when arriving in the evening",
          "selamat tidur → 'good sleep' — say this when someone is going to bed",
          "tidur → 'TEE-door' — means 'sleep'",
        ],
      },
      {
        en: "Thank you. You're welcome.",
        vi: "Cảm ơn. Không có gì.",
        pronunciation_focus: [
          "terima → te-RI-ma",
          "kasih → KA-sih (h cuối nhẹ)",
          "sama-sama → SA-ma SA-ma",
          "không chia theo giới tính",
        ],
        pronunciation_focus_en: [
          "terima → 'te-REE-mah'",
          "kasih → 'KAH-see' — soft breathy final 'h'; together 'terima kasih' = thank you",
          "sama-sama → 'SAH-mah SAH-mah' — literally 'same-same' = you're welcome",
          "unlike Portuguese, thank-you does NOT change for male/female speakers",
        ],
      },
      {
        en: "Excuse me. Sorry. Goodbye!",
        vi: "Xin phép. Xin lỗi. Tạm biệt!",
        pronunciation_focus: [
          "permisi → per-MI-si",
          "maaf → ma-AF (hai âm 'a')",
          "sampai jumpa → SAM-pai JUM-pa",
          "selamat tinggal → tạm biệt",
        ],
        pronunciation_focus_en: [
          "permisi → 'per-MEE-see' — 'excuse me', e.g. squeezing past someone",
          "maaf → 'mah-AHF' — two separate 'a' vowels with a tiny gap, then soft 'f'",
          "sampai jumpa → 'SAM-pie JOOM-pah' — 'see you / until we meet'",
          "selamat tinggal → 'goodbye' said by the one leaving; 'selamat jalan' is said TO the one leaving",
        ],
      },
    ],
    cultural_notes_vi:
      "Mọi lời chào trong tiếng Indonesia bắt đầu bằng 'selamat' (an lành/may mắn) + thời gian: pagi (sáng, ~5–11h), siang (trưa, ~11–15h), sore (chiều, ~15–18h), malam (tối, sau 18h). Đây là điểm RẤT DỄ cho người Việt: không có thanh điệu, không chia động từ, không phân biệt 'lịch sự/thân mật' phức tạp như tiếng Việt. 'Apa kabar?' (Bạn khỏe không?) là câu hỏi thăm phổ biến nhất, trả lời 'Baik' hoặc 'Baik-baik saja' (Tôi khỏe).",
    cultural_notes_en:
      "Every Indonesian greeting starts with *selamat* ('safe/blessed') plus the time of day: *pagi* (morning, ~5–11), *siang* (midday, ~11–15), *sore* (late afternoon, ~15–18), *malam* (evening/night, after 18). For Vietnamese speakers this is unusually easy — there are no tones, no verb conjugation, and none of the elaborate politeness pronouns Vietnamese has. *Apa kabar?* ('how are you?') is the standard check-in; answer *Baik* or *Baik-baik saja* ('I'm fine').",
    tip_advice_vi:
      "Học thuộc bộ bốn theo thời gian: pagi / siang / sore / malam — chỉ cần đổi từ cuối, 'selamat' giữ nguyên. Mẹo cho người Việt: chữ 'c' đọc là 'ch' (cara = CHA-ra), chữ 'g' luôn cứng (như 'g' trong 'gà'), và TUYỆT ĐỐI không thêm thanh điệu — đọc phẳng đều. Đây là cái khó nhất với người Việt vì ta quen lên xuống giọng.",
    tip_advice_en:
      "Memorize the time-of-day set: pagi / siang / sore / malam — only the last word changes, *selamat* stays. Key sounds: 'c' is always 'ch' (cara = 'CHA-ra'), 'g' is always hard (as in 'go'), and there are absolutely no tones — keep your pitch flat. For Vietnamese learners the hardest habit is NOT adding a rising or falling tone.",
    vocabulary: [
      {
        word: "selamat pagi",
        en: "good morning",
        vi: "chào buổi sáng",
        pos: "phrase",
        pronunciation_vi: "se-LA-mat PA-gi — 'g' cứng",
        pronunciation_en: "se-LAH-mat PAH-gee — hard 'g'",
      },
      {
        word: "selamat siang",
        en: "good midday (11–15h)",
        vi: "chào buổi trưa",
        pos: "phrase",
        pronunciation_vi: "se-LA-mat SI-ang",
        pronunciation_en: "se-LAH-mat SEE-ahng",
      },
      {
        word: "selamat sore",
        en: "good afternoon (15–18h)",
        vi: "chào buổi chiều",
        pos: "phrase",
        pronunciation_vi: "se-LA-mat SO-re — 'e' mở",
        pronunciation_en: "se-LAH-mat SOH-reh — open 'e'",
      },
      {
        word: "selamat malam",
        en: "good evening / good night",
        vi: "chào buổi tối",
        pos: "phrase",
        pronunciation_vi: "se-LA-mat MA-lam",
        pronunciation_en: "se-LAH-mat MAH-lam",
      },
      {
        word: "apa kabar?",
        en: "how are you?",
        vi: "bạn khỏe không?",
        pos: "phrase",
        pronunciation_vi: "A-pa KA-bar",
        pronunciation_en: "AH-pah KAH-bar",
      },
      {
        word: "baik",
        en: "fine / good",
        vi: "khỏe / tốt",
        pos: "adjective",
        pronunciation_vi: "BA-ik — như 'ba-ích' nhanh",
        pronunciation_en: "BAH-ik — like 'bike' with two vowels",
      },
      {
        word: "terima kasih",
        en: "thank you",
        vi: "cảm ơn",
        pos: "phrase",
        pronunciation_vi: "te-RI-ma KA-sih",
        pronunciation_en: "te-REE-mah KAH-see",
      },
      {
        word: "sama-sama",
        en: "you're welcome",
        vi: "không có gì",
        pos: "phrase",
        pronunciation_vi: "SA-ma SA-ma",
        pronunciation_en: "SAH-mah SAH-mah",
      },
      {
        word: "permisi",
        en: "excuse me",
        vi: "xin phép / xin lỗi (để đi qua)",
        pos: "interjection",
        pronunciation_vi: "per-MI-si",
        pronunciation_en: "per-MEE-see",
      },
      {
        word: "maaf",
        en: "sorry",
        vi: "xin lỗi",
        pos: "interjection",
        pronunciation_vi: "ma-AF — hai âm 'a'",
        pronunciation_en: "mah-AHF — two 'a' vowels",
      },
      {
        word: "sampai jumpa",
        en: "see you / goodbye",
        vi: "hẹn gặp lại",
        pos: "phrase",
        pronunciation_vi: "SAM-pai JUM-pa",
        pronunciation_en: "SAM-pie JOOM-pah",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        text: "Selamat pagi! Apa kabar?",
        vi: "Chào buổi sáng! Bạn khỏe không?",
        en: "Good morning! How are you?",
      },
      {
        speaker: "B",
        text: "Baik-baik saja, terima kasih. Dan kamu?",
        vi: "Tôi khỏe, cảm ơn. Còn bạn?",
        en: "I'm fine, thank you. And you?",
      },
      {
        speaker: "A",
        text: "Saya juga baik. Sampai jumpa!",
        vi: "Tôi cũng khỏe. Hẹn gặp lại!",
        en: "I'm good too. See you!",
      },
      {
        speaker: "B",
        text: "Sampai jumpa! Selamat jalan.",
        vi: "Hẹn gặp lại! Đi đường bình an.",
        en: "See you! Safe travels.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền lời chào đúng theo thời gian:",
        instruction_en: "Fill in the right greeting for the time of day:",
        pronunciation_focus: ["selamat pagi", "selamat sore", "selamat malam"],
        pronunciation_focus_en: [
          "selamat pagi → 'se-LAH-mat PAH-gee' (morning)",
          "selamat sore → 'se-LAH-mat SOH-reh' (late afternoon)",
          "selamat malam → 'se-LAH-mat MAH-lam' (evening/night)",
        ],
        items: [
          {
            prompt: "(7h sáng) ___, Pak!",
            answer: "Selamat pagi",
            options: ["Selamat pagi", "Selamat sore", "Selamat malam"],
          },
          {
            prompt: "(16h chiều) ___, Bu!",
            answer: "Selamat sore",
            options: ["Selamat pagi", "Selamat sore", "Selamat malam"],
          },
          {
            prompt: "(20h tối) ___, semuanya!",
            answer: "Selamat malam",
            options: ["Selamat pagi", "Selamat sore", "Selamat malam"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ tiếng Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match each Indonesian word with its meaning:",
        pronunciation_focus: ["terima kasih", "sama-sama"],
        pronunciation_focus_en: [
          "terima kasih → 'te-REE-mah KAH-see' (thank you)",
          "sama-sama → 'SAH-mah SAH-mah' (you're welcome)",
        ],
        items: [
          { prompt: "terima kasih", answer: "cảm ơn" },
          { prompt: "sama-sama", answer: "không có gì" },
          { prompt: "permisi", answer: "xin phép đi qua" },
          { prompt: "maaf", answer: "xin lỗi" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        pronunciation_focus: ["apa kabar", "baik-baik saja"],
        pronunciation_focus_en: [
          "apa kabar → 'AH-pah KAH-bar' (how are you)",
          "baik-baik saja → 'BAH-ik BAH-ik SAH-jah' (I'm just fine)",
        ],
        items: [
          { prompt: "Chào buổi sáng, bạn khỏe không?", answer: "Selamat pagi, apa kabar?" },
          { prompt: "Cảm ơn nhiều!", answer: "Terima kasih banyak!" },
          { prompt: "Tôi khỏe. Hẹn gặp lại!", answer: "Saya baik. Sampai jumpa!" },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────── introductions
  {
    id: "indonesian_introductions",
    level: "A1",
    category: "introductions",
    title_vi: "Giới thiệu bản thân",
    title_en: "Introducing yourself",
    sentences: [
      {
        en: "My name is Linh.",
        vi: "Tên tôi là Linh.",
        pronunciation_focus: [
          "nama → NA-ma",
          "saya → SA-ya (tôi)",
          "không có động từ 'là'",
          "trật tự: Nama saya Linh",
        ],
        pronunciation_focus_en: [
          "nama → 'NAH-mah' — 'name'",
          "saya → 'SAH-yah' — the neutral, polite 'I/me'",
          "there is NO verb 'to be' — 'Nama saya Linh' is literally 'name my Linh'",
          "word order: Nama saya [name]; no 'is' needed",
        ],
      },
      {
        en: "What is your name?",
        vi: "Bạn tên là gì?",
        pronunciation_focus: [
          "siapa → si-A-pa (ai)",
          "nama Anda → tên của bạn",
          "Anda → AN-da (bạn, lịch sự)",
          "Siapa nama Anda?",
        ],
        pronunciation_focus_en: [
          "siapa → 'see-AH-pah' — 'who'; Indonesian asks a name with 'who', not 'what'",
          "nama Anda → 'your name' — possessor comes AFTER the noun",
          "Anda → 'AHN-dah' — polite 'you', capitalized as a courtesy",
          "full question: 'Siapa nama Anda?' = literally 'who is your name?'",
        ],
      },
      {
        en: "I am from Vietnam.",
        vi: "Tôi đến từ Việt Nam.",
        pronunciation_focus: [
          "saya dari → tôi từ",
          "dari → DA-ri",
          "Vietnam → vi-et-NAM",
          "không chia động từ",
        ],
        pronunciation_focus_en: [
          "saya dari → 'I from' — again no verb needed",
          "dari → 'DAH-ree' — 'from'",
          "Vietnam → 'vee-et-NAHM'",
          "no conjugation: 'saya dari', 'dia dari', 'kami dari' — the verb never changes",
        ],
      },
      {
        en: "Nice to meet you.",
        vi: "Rất vui được gặp bạn.",
        pronunciation_focus: [
          "senang → se-NANG",
          "bertemu → ber-te-MU (gặp)",
          "dengan → DE-ngan (với)",
          "senang bertemu dengan Anda",
        ],
        pronunciation_focus_en: [
          "senang → 'se-NAHNG' — 'happy/glad'",
          "bertemu → 'ber-te-MOO' — 'to meet'",
          "dengan → 'DENG-an' — 'with'",
          "'Senang bertemu dengan Anda' = 'glad to meet with you'",
        ],
      },
      {
        en: "I speak a little Indonesian.",
        vi: "Tôi nói được một chút tiếng Indonesia.",
        pronunciation_focus: [
          "saya bisa → tôi có thể",
          "berbahasa → ber-ba-HA-sa",
          "Indonesia → in-do-NE-sia",
          "sedikit → se-DI-kit (một chút)",
        ],
        pronunciation_focus_en: [
          "saya bisa → 'I can' — 'bisa' = can/able",
          "berbahasa → 'ber-bah-HAH-sah' — 'to speak a language' (ber- + bahasa)",
          "Indonesia → 'in-doh-NEH-see-ah'",
          "sedikit → 'se-DEE-kit' — 'a little'",
        ],
      },
    ],
    cultural_notes_vi:
      "Người Indonesia dùng 'saya' (tôi, lịch sự, an toàn nhất) và 'kamu' (bạn, thân mật) hoặc 'Anda' (bạn, lịch sự, viết hoa). ĐIỂM DỄ cho người Việt: KHÔNG chia động từ theo ngôi, KHÔNG có động từ 'là' (Nama saya Linh = 'tên tôi Linh'), và sở hữu đặt SAU danh từ (nama saya = 'tên của tôi'). Hỏi tên dùng 'siapa' (ai), không phải 'apa' (gì): 'Siapa nama Anda?'. Người lớn tuổi gọi 'Pak' (ông/anh) và 'Bu' (bà/chị) trước tên.",
    cultural_notes_en:
      "Indonesians use *saya* (polite, safest 'I'), and either *kamu* (casual 'you') or *Anda* (polite 'you', capitalized). The easy part for Vietnamese speakers: NO verb conjugation, NO verb 'to be' (*Nama saya Linh* = 'name my Linh'), and the possessor follows the noun (*nama saya* = 'my name'). You ask a name with *siapa* ('who'), not *apa* ('what'): *Siapa nama Anda?*. Address adults with *Pak* (Mr./sir) or *Bu* (Mrs./ma'am) before the name.",
    tip_advice_vi:
      "Khung câu vàng: 'Nama saya ___. Saya dari ___. Senang bertemu dengan Anda.' Chỉ cần thay tên và nơi chốn. Mẹo người Việt: nhớ sở hữu ngược (nama saya, bukan saya nama). 'ber-' đầu từ (bertemu, berbahasa) là tiền tố động từ — sẽ học kỹ ở A2, giờ học cả cụm.",
    tip_advice_en:
      "Golden frame: 'Nama saya ___. Saya dari ___. Senang bertemu dengan Anda.' Swap only the name and place. For Vietnamese learners, the trick is the reversed possessive (nama saya, not saya nama). The 'ber-' at the start of bertemu/berbahasa is a verb prefix — covered fully in A2; for now just learn the whole phrase.",
    vocabulary: [
      {
        word: "nama",
        en: "name",
        vi: "tên",
        pos: "noun",
        pronunciation_vi: "NA-ma",
        pronunciation_en: "NAH-mah",
      },
      {
        word: "saya",
        en: "I / me (polite)",
        vi: "tôi (lịch sự)",
        pos: "pronoun",
        pronunciation_vi: "SA-ya",
        pronunciation_en: "SAH-yah",
      },
      {
        word: "kamu",
        en: "you (casual)",
        vi: "bạn (thân mật)",
        pos: "pronoun",
        pronunciation_vi: "KA-mu",
        pronunciation_en: "KAH-moo",
      },
      {
        word: "Anda",
        en: "you (polite)",
        vi: "bạn / ông / bà (lịch sự)",
        pos: "pronoun",
        pronunciation_vi: "AN-da",
        pronunciation_en: "AHN-dah",
      },
      {
        word: "siapa",
        en: "who",
        vi: "ai",
        pos: "question word",
        pronunciation_vi: "si-A-pa",
        pronunciation_en: "see-AH-pah",
      },
      {
        word: "dari",
        en: "from",
        vi: "từ",
        pos: "preposition",
        pronunciation_vi: "DA-ri",
        pronunciation_en: "DAH-ree",
      },
      {
        word: "senang",
        en: "happy / glad",
        vi: "vui",
        pos: "adjective",
        pronunciation_vi: "se-NANG",
        pronunciation_en: "se-NAHNG",
      },
      {
        word: "bertemu",
        en: "to meet",
        vi: "gặp",
        pos: "verb",
        pronunciation_vi: "ber-te-MU",
        pronunciation_en: "ber-te-MOO",
      },
      {
        word: "bisa",
        en: "can / able to",
        vi: "có thể",
        pos: "verb",
        pronunciation_vi: "BI-sa",
        pronunciation_en: "BEE-sah",
      },
      {
        word: "sedikit",
        en: "a little",
        vi: "một chút",
        pos: "adverb",
        pronunciation_vi: "se-DI-kit",
        pronunciation_en: "se-DEE-kit",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        text: "Halo! Siapa nama Anda?",
        vi: "Xin chào! Bạn tên là gì?",
        en: "Hello! What is your name?",
      },
      {
        speaker: "B",
        text: "Nama saya Linh. Saya dari Vietnam. Dan Anda?",
        vi: "Tên tôi là Linh. Tôi đến từ Việt Nam. Còn bạn?",
        en: "My name is Linh. I'm from Vietnam. And you?",
      },
      {
        speaker: "A",
        text: "Saya Budi, dari Jakarta. Senang bertemu dengan Anda.",
        vi: "Tôi là Budi, đến từ Jakarta. Rất vui được gặp bạn.",
        en: "I'm Budi, from Jakarta. Nice to meet you.",
      },
      {
        speaker: "B",
        text: "Senang bertemu juga! Saya bisa berbahasa Indonesia sedikit.",
        vi: "Tôi cũng rất vui! Tôi nói được một chút tiếng Indonesia.",
        en: "Nice to meet you too! I speak a little Indonesian.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu:",
        instruction_en: "Fill in the missing word:",
        pronunciation_focus: ["nama", "dari", "siapa"],
        pronunciation_focus_en: [
          "nama → 'NAH-mah' (name)",
          "dari → 'DAH-ree' (from)",
          "siapa → 'see-AH-pah' (who)",
        ],
        items: [
          {
            prompt: "___ saya Linh. (Tên tôi là Linh)",
            answer: "Nama",
            options: ["Nama", "Dari", "Siapa"],
          },
          {
            prompt: "Saya ___ Vietnam. (Tôi từ Việt Nam)",
            answer: "dari",
            options: ["nama", "dari", "siapa"],
          },
          {
            prompt: "___ nama Anda? (Bạn tên gì?)",
            answer: "Siapa",
            options: ["Apa", "Siapa", "Dari"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối đại từ với nghĩa:",
        instruction_en: "Match the pronoun with its meaning:",
        pronunciation_focus: ["saya", "kamu", "Anda"],
        pronunciation_focus_en: [
          "saya → 'SAH-yah' (I, polite)",
          "kamu → 'KAH-moo' (you, casual)",
          "Anda → 'AHN-dah' (you, polite)",
        ],
        items: [
          { prompt: "saya", answer: "tôi (lịch sự)" },
          { prompt: "kamu", answer: "bạn (thân mật)" },
          { prompt: "Anda", answer: "bạn (lịch sự)" },
          { prompt: "dari", answer: "từ" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        pronunciation_focus: ["nama saya", "senang bertemu"],
        pronunciation_focus_en: [
          "nama saya → 'NAH-mah SAH-yah' (my name)",
          "senang bertemu → 'se-NAHNG ber-te-MOO' (nice to meet)",
        ],
        items: [
          { prompt: "Tên tôi là Budi.", answer: "Nama saya Budi." },
          { prompt: "Tôi đến từ Việt Nam.", answer: "Saya dari Vietnam." },
          { prompt: "Rất vui được gặp bạn.", answer: "Senang bertemu dengan Anda." },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────── numbers
  {
    id: "indonesian_numbers_1_100",
    level: "A1",
    category: "numbers",
    title_vi: "Số đếm 1–100",
    title_en: "Numbers 1–100",
    sentences: [
      {
        en: "One, two, three, four, five.",
        vi: "Một, hai, ba, bốn, năm.",
        pronunciation_focus: [
          "satu → SA-tu",
          "dua → DU-a",
          "tiga → TI-ga (g cứng)",
          "empat → EM-pat, lima → LI-ma",
        ],
        pronunciation_focus_en: [
          "satu → 'SAH-too' (1)",
          "dua → 'DOO-ah' (2)",
          "tiga → 'TEE-gah' (3) — hard 'g'",
          "empat → 'EM-pat' (4); lima → 'LEE-mah' (5)",
        ],
      },
      {
        en: "Six, seven, eight, nine, ten.",
        vi: "Sáu, bảy, tám, chín, mười.",
        pronunciation_focus: [
          "enam → e-NAM",
          "tujuh → TU-juh",
          "delapan → de-LA-pan",
          "sembilan → sem-BI-lan, sepuluh → se-PU-luh",
        ],
        pronunciation_focus_en: [
          "enam → 'e-NAHM' (6)",
          "tujuh → 'TOO-jooh' (7)",
          "delapan → 'de-LAH-pan' (8)",
          "sembilan → 'sem-BEE-lan' (9); sepuluh → 'se-POO-looh' (10)",
        ],
      },
      {
        en: "Eleven, twelve, fifteen.",
        vi: "Mười một, mười hai, mười lăm.",
        pronunciation_focus: [
          "sebelas → se-BE-las (11)",
          "dua belas → DU-a be-LAS (12)",
          "lima belas → LI-ma be-LAS (15)",
          "-belas = nhóm 'mười mấy'",
        ],
        pronunciation_focus_en: [
          "sebelas → 'se-BE-las' (11) — irregular, like English 'eleven'",
          "dua belas → 'DOO-ah be-LAS' (12) = 'two-teen'",
          "lima belas → 'LEE-mah be-LAS' (15) = 'five-teen'",
          "-belas is the '-teen' suffix for 11–19",
        ],
      },
      {
        en: "Twenty, twenty-one, fifty.",
        vi: "Hai mươi, hai mươi mốt, năm mươi.",
        pronunciation_focus: [
          "dua puluh → DU-a PU-luh (20)",
          "dua puluh satu → ...satu (21)",
          "lima puluh → LI-ma PU-luh (50)",
          "-puluh = nhóm 'mươi/chục'",
        ],
        pronunciation_focus_en: [
          "dua puluh → 'DOO-ah POO-looh' (20) = 'two-ten'",
          "dua puluh satu → add 'satu' for 21",
          "lima puluh → 'LEE-mah POO-looh' (50)",
          "-puluh is the '-ty' (tens) word",
        ],
      },
      {
        en: "One hundred.",
        vi: "Một trăm.",
        pronunciation_focus: [
          "seratus → se-RA-tus (100)",
          "se- = 'một' (một trăm)",
          "ratus = trăm",
          "logic: ghép số + đơn vị",
        ],
        pronunciation_focus_en: [
          "seratus → 'se-RAH-toos' (100)",
          "se- is the prefix for 'one' (one hundred)",
          "ratus = hundred",
          "logic: just stack number + unit, very regular",
        ],
      },
    ],
    cultural_notes_vi:
      "Hệ số Indonesia RẤT logic và dễ với người Việt — giống cách ta ghép số. Quy tắc: -belas = '-teen' (11–19), -puluh = chục/mươi (20, 30...), ratus = trăm, ribu = nghìn. 'se-' nghĩa là 'một': sepuluh (10), seratus (100), seribu (1000). Ghép thẳng: dua puluh tiga = 23 ('hai-chục-ba'). Chỉ 11 (sebelas) hơi bất quy tắc. Không có thanh điệu nên đọc số rất nhanh quen.",
    cultural_notes_en:
      "Indonesian numbers are extremely regular and feel natural to Vietnamese speakers because both languages just stack the parts. Rules: -belas = '-teen' (11–19), -puluh = tens (20, 30…), ratus = hundred, ribu = thousand. The prefix *se-* means 'one': sepuluh (10), seratus (100), seribu (1000). Build directly: dua puluh tiga = 23 ('two-ten-three'). Only sebelas (11) is mildly irregular. With no tones, counting out loud comes quickly.",
    tip_advice_vi:
      "Học 1–10 cho thuộc, rồi mọi số khác chỉ là ghép. 13 = tiga belas, 30 = tiga puluh, 33 = tiga puluh tiga. Mẹo: 'belas' = mười-mấy (nhỏ), 'puluh' = mấy-mươi (lớn) — đừng nhầm. 'se-' thay cho 'satu' khi đứng đầu đơn vị (seratus chứ không 'satu ratus').",
    tip_advice_en:
      "Master 1–10 cold; everything else is just assembly. 13 = tiga belas, 30 = tiga puluh, 33 = tiga puluh tiga. Tip: 'belas' = teens (small), 'puluh' = tens (big) — don't mix them up. Use 'se-' instead of 'satu' before a unit (seratus, not 'satu ratus').",
    vocabulary: [
      {
        word: "satu",
        en: "one (1)",
        vi: "một",
        pos: "number",
        pronunciation_vi: "SA-tu",
        pronunciation_en: "SAH-too",
      },
      {
        word: "lima",
        en: "five (5)",
        vi: "năm",
        pos: "number",
        pronunciation_vi: "LI-ma",
        pronunciation_en: "LEE-mah",
      },
      {
        word: "sepuluh",
        en: "ten (10)",
        vi: "mười",
        pos: "number",
        pronunciation_vi: "se-PU-luh",
        pronunciation_en: "se-POO-looh",
      },
      {
        word: "sebelas",
        en: "eleven (11)",
        vi: "mười một",
        pos: "number",
        pronunciation_vi: "se-BE-las",
        pronunciation_en: "se-BE-las",
      },
      {
        word: "dua belas",
        en: "twelve (12)",
        vi: "mười hai",
        pos: "number",
        pronunciation_vi: "DU-a be-LAS",
        pronunciation_en: "DOO-ah be-LAS",
      },
      {
        word: "dua puluh",
        en: "twenty (20)",
        vi: "hai mươi",
        pos: "number",
        pronunciation_vi: "DU-a PU-luh",
        pronunciation_en: "DOO-ah POO-looh",
      },
      {
        word: "lima puluh",
        en: "fifty (50)",
        vi: "năm mươi",
        pos: "number",
        pronunciation_vi: "LI-ma PU-luh",
        pronunciation_en: "LEE-mah POO-looh",
      },
      {
        word: "seratus",
        en: "one hundred (100)",
        vi: "một trăm",
        pos: "number",
        pronunciation_vi: "se-RA-tus",
        pronunciation_en: "se-RAH-toos",
      },
      {
        word: "puluh",
        en: "tens (suffix)",
        vi: "chục / mươi",
        pos: "suffix",
        pronunciation_vi: "PU-luh",
        pronunciation_en: "POO-looh",
      },
      {
        word: "belas",
        en: "-teen (suffix)",
        vi: "mười-mấy",
        pos: "suffix",
        pronunciation_vi: "be-LAS",
        pronunciation_en: "be-LAS",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        text: "Berapa umur kamu?",
        vi: "Bạn bao nhiêu tuổi?",
        en: "How old are you?",
      },
      {
        speaker: "B",
        text: "Umur saya dua puluh lima tahun.",
        vi: "Tôi hai mươi lăm tuổi.",
        en: "I'm twenty-five years old.",
      },
      {
        speaker: "A",
        text: "Berapa nomor teleponmu?",
        vi: "Số điện thoại của bạn là gì?",
        en: "What's your phone number?",
      },
      {
        speaker: "B",
        text: "Nol delapan satu dua, tiga empat lima...",
        vi: "Không tám một hai, ba bốn năm...",
        en: "Zero eight one two, three four five...",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Viết số bằng chữ:",
        instruction_en: "Write the number in words:",
        pronunciation_focus: ["tiga belas", "tiga puluh", "seratus"],
        pronunciation_focus_en: [
          "tiga belas → 'TEE-gah be-LAS' (13)",
          "tiga puluh → 'TEE-gah POO-looh' (30)",
          "seratus → 'se-RAH-toos' (100)",
        ],
        items: [
          {
            prompt: "13 = ___",
            answer: "tiga belas",
            options: ["tiga belas", "tiga puluh", "tiga"],
          },
          {
            prompt: "30 = ___",
            answer: "tiga puluh",
            options: ["tiga belas", "tiga puluh", "tiga ratus"],
          },
          {
            prompt: "100 = ___",
            answer: "seratus",
            options: ["sepuluh", "seratus", "seribu"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối số với chữ:",
        instruction_en: "Match the digit with its word:",
        pronunciation_focus: ["empat", "tujuh", "sembilan"],
        pronunciation_focus_en: [
          "empat → 'EM-pat' (4)",
          "tujuh → 'TOO-jooh' (7)",
          "sembilan → 'sem-BEE-lan' (9)",
        ],
        items: [
          { prompt: "4", answer: "empat" },
          { prompt: "7", answer: "tujuh" },
          { prompt: "9", answer: "sembilan" },
          { prompt: "20", answer: "dua puluh" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch số sang tiếng Indonesia:",
        instruction_en: "Translate the number into Indonesian:",
        pronunciation_focus: ["dua puluh lima", "lima puluh"],
        pronunciation_focus_en: [
          "dua puluh lima → 'DOO-ah POO-looh LEE-mah' (25)",
          "lima puluh → 'LEE-mah POO-looh' (50)",
        ],
        items: [
          { prompt: "25", answer: "dua puluh lima" },
          { prompt: "50", answer: "lima puluh" },
          { prompt: "100", answer: "seratus" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── questions
  {
    id: "indonesian_question_words",
    level: "A1",
    category: "questions",
    title_vi: "Từ để hỏi cơ bản",
    title_en: "Basic question words",
    sentences: [
      {
        en: "What is this?",
        vi: "Đây là cái gì?",
        pronunciation_focus: [
          "apa → A-pa (cái gì)",
          "ini → I-ni (này/đây)",
          "Apa ini? = Đây là gì?",
          "không cần động từ 'là'",
        ],
        pronunciation_focus_en: [
          "apa → 'AH-pah' — 'what'",
          "ini → 'EE-nee' — 'this/here'",
          "Apa ini? = 'what (is) this?' — no verb needed",
          "question word usually comes first",
        ],
      },
      {
        en: "Who is that?",
        vi: "Người kia là ai?",
        pronunciation_focus: [
          "siapa → si-A-pa (ai)",
          "itu → I-tu (kia/đó)",
          "Siapa itu? = Đó là ai?",
          "siapa dùng cho người",
        ],
        pronunciation_focus_en: [
          "siapa → 'see-AH-pah' — 'who'",
          "itu → 'EE-too' — 'that/there'",
          "Siapa itu? = 'who (is) that?'",
          "use siapa only for people",
        ],
      },
      {
        en: "Where is the toilet?",
        vi: "Nhà vệ sinh ở đâu?",
        pronunciation_focus: [
          "di mana → di MA-na (ở đâu)",
          "toilet → TOI-let",
          "Di mana toilet? ",
          "di = ở (vị trí)",
        ],
        pronunciation_focus_en: [
          "di mana → 'dee MAH-nah' — 'where'",
          "toilet → 'TOY-let' — borrowed word; 'kamar kecil' is the polite term",
          "Di mana toilet? = 'where (is the) toilet?'",
          "di = 'at/in' marks a location",
        ],
      },
      {
        en: "How much is this?",
        vi: "Cái này bao nhiêu tiền?",
        pronunciation_focus: [
          "berapa → be-RA-pa (bao nhiêu)",
          "harga → HAR-ga (giá)",
          "Berapa harganya? = Giá bao nhiêu?",
          "-nya = của nó / cái đó",
        ],
        pronunciation_focus_en: [
          "berapa → 'be-RAH-pah' — 'how much/how many'",
          "harga → 'HAR-gah' — 'price'",
          "Berapa harganya? = 'how much (is) its price?'",
          "-nya is a clitic = 'its/the'",
        ],
      },
      {
        en: "When and why?",
        vi: "Khi nào và tại sao?",
        pronunciation_focus: [
          "kapan → KA-pan (khi nào)",
          "kenapa → ke-NA-pa (tại sao)",
          "bagaimana → ba-gai-MA-na (như thế nào)",
          "mengapa = kenapa (tại sao)",
        ],
        pronunciation_focus_en: [
          "kapan → 'KAH-pan' — 'when'",
          "kenapa → 'ke-NAH-pah' — 'why' (casual)",
          "bagaimana → 'bah-guy-MAH-nah' — 'how'",
          "mengapa = formal 'why'; kenapa is the everyday form",
        ],
      },
    ],
    cultural_notes_vi:
      "Năm từ hỏi cốt lõi: apa (gì), siapa (ai), di mana (ở đâu), berapa (bao nhiêu), kapan (khi nào). ĐIỂM DỄ cho người Việt: cấu trúc câu hỏi gần giống tiếng Việt — chỉ cần đặt từ hỏi vào, KHÔNG đảo trợ động từ như tiếng Anh (không cần 'do/does'). 'Apa ini?' = 'Đây là gì?'. Lưu ý: 'di mana' (ở đâu, vị trí) khác 'ke mana' (đi đâu, hướng) và 'dari mana' (từ đâu). 'apa' cũng đặt đầu câu để biến câu kể thành câu hỏi có/không: 'Apa kamu lapar?' = 'Bạn có đói không?'.",
    cultural_notes_en:
      "The five core question words: apa (what), siapa (who), di mana (where), berapa (how much/many), kapan (when). Easy for Vietnamese speakers: question structure resembles Vietnamese — just drop in the question word, with NO auxiliary inversion like English 'do/does'. 'Apa ini?' = 'What is this?'. Note the trio: 'di mana' (where, location) vs 'ke mana' (where to, direction) vs 'dari mana' (where from). Sentence-initial 'apa' can also turn a statement into a yes/no question: 'Apa kamu lapar?' = 'Are you hungry?'.",
    tip_advice_vi:
      "Mẹo nhớ: berapa luôn đi với số/tiền (Berapa harganya? Berapa umur?). siapa chỉ dùng cho người, apa cho vật. Phân biệt bộ ba 'mana': di mana (ở đâu), ke mana (đi đâu), dari mana (từ đâu) — chỉ đổi giới từ phía trước. Không cần 'do/does' như tiếng Anh, đây là điểm cộng lớn.",
    tip_advice_en:
      "Memory hook: berapa always pairs with numbers/money (Berapa harganya? Berapa umur?). siapa is for people, apa for things. Master the 'mana' trio by swapping the preposition: di mana (where at), ke mana (where to), dari mana (where from). No 'do/does' is needed — a big bonus over English.",
    vocabulary: [
      {
        word: "apa",
        en: "what",
        vi: "gì / cái gì",
        pos: "question word",
        pronunciation_vi: "A-pa",
        pronunciation_en: "AH-pah",
      },
      {
        word: "siapa",
        en: "who",
        vi: "ai",
        pos: "question word",
        pronunciation_vi: "si-A-pa",
        pronunciation_en: "see-AH-pah",
      },
      {
        word: "di mana",
        en: "where",
        vi: "ở đâu",
        pos: "question phrase",
        pronunciation_vi: "di MA-na",
        pronunciation_en: "dee MAH-nah",
      },
      {
        word: "berapa",
        en: "how much / how many",
        vi: "bao nhiêu",
        pos: "question word",
        pronunciation_vi: "be-RA-pa",
        pronunciation_en: "be-RAH-pah",
      },
      {
        word: "kapan",
        en: "when",
        vi: "khi nào",
        pos: "question word",
        pronunciation_vi: "KA-pan",
        pronunciation_en: "KAH-pan",
      },
      {
        word: "kenapa",
        en: "why",
        vi: "tại sao",
        pos: "question word",
        pronunciation_vi: "ke-NA-pa",
        pronunciation_en: "ke-NAH-pah",
      },
      {
        word: "bagaimana",
        en: "how",
        vi: "như thế nào",
        pos: "question word",
        pronunciation_vi: "ba-gai-MA-na",
        pronunciation_en: "bah-guy-MAH-nah",
      },
      {
        word: "ini",
        en: "this",
        vi: "này / đây",
        pos: "demonstrative",
        pronunciation_vi: "I-ni",
        pronunciation_en: "EE-nee",
      },
      {
        word: "itu",
        en: "that",
        vi: "kia / đó",
        pos: "demonstrative",
        pronunciation_vi: "I-tu",
        pronunciation_en: "EE-too",
      },
      {
        word: "harga",
        en: "price",
        vi: "giá",
        pos: "noun",
        pronunciation_vi: "HAR-ga",
        pronunciation_en: "HAR-gah",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        text: "Apa ini?",
        vi: "Đây là cái gì?",
        en: "What is this?",
      },
      {
        speaker: "B",
        text: "Ini buku. Itu tas saya.",
        vi: "Đây là quyển sách. Kia là túi của tôi.",
        en: "This is a book. That is my bag.",
      },
      {
        speaker: "A",
        text: "Berapa harga buku ini?",
        vi: "Quyển sách này giá bao nhiêu?",
        en: "How much is this book?",
      },
      {
        speaker: "B",
        text: "Lima puluh ribu rupiah.",
        vi: "Năm mươi nghìn rupiah.",
        en: "Fifty thousand rupiah.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn từ để hỏi đúng:",
        instruction_en: "Choose the correct question word:",
        pronunciation_focus: ["apa", "siapa", "berapa"],
        pronunciation_focus_en: [
          "apa → 'AH-pah' (what)",
          "siapa → 'see-AH-pah' (who)",
          "berapa → 'be-RAH-pah' (how much)",
        ],
        items: [
          {
            prompt: "___ ini? (Đây là gì?)",
            answer: "Apa",
            options: ["Apa", "Siapa", "Berapa"],
          },
          {
            prompt: "___ nama Anda? (Bạn tên ai?)",
            answer: "Siapa",
            options: ["Apa", "Siapa", "Kapan"],
          },
          {
            prompt: "___ harganya? (Giá bao nhiêu?)",
            answer: "Berapa",
            options: ["Berapa", "Di mana", "Kenapa"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ hỏi với nghĩa:",
        instruction_en: "Match the question word with its meaning:",
        pronunciation_focus: ["di mana", "kapan", "kenapa"],
        pronunciation_focus_en: [
          "di mana → 'dee MAH-nah' (where)",
          "kapan → 'KAH-pan' (when)",
          "kenapa → 'ke-NAH-pah' (why)",
        ],
        items: [
          { prompt: "di mana", answer: "ở đâu" },
          { prompt: "kapan", answer: "khi nào" },
          { prompt: "kenapa", answer: "tại sao" },
          { prompt: "bagaimana", answer: "như thế nào" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        pronunciation_focus: ["di mana", "berapa harganya"],
        pronunciation_focus_en: [
          "di mana → 'dee MAH-nah' (where)",
          "berapa harganya → 'be-RAH-pah HAR-gah-nyah' (how much is it)",
        ],
        items: [
          { prompt: "Nhà vệ sinh ở đâu?", answer: "Di mana toilet?" },
          { prompt: "Đây là cái gì?", answer: "Apa ini?" },
          { prompt: "Cái này bao nhiêu tiền?", answer: "Berapa harganya?" },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────── food
  {
    id: "indonesian_food_ordering",
    level: "A1",
    category: "food",
    title_vi: "Gọi món ăn",
    title_en: "Ordering food",
    sentences: [
      {
        en: "I want fried rice, please.",
        vi: "Cho tôi cơm chiên.",
        pronunciation_focus: [
          "saya mau → SA-ya MAU (tôi muốn)",
          "nasi → NA-si (cơm)",
          "goreng → GO-reng (chiên)",
          "nasi goreng = cơm chiên",
        ],
        pronunciation_focus_en: [
          "saya mau → 'SAH-yah mau' — 'I want'; 'mau' rhymes with 'cow'",
          "nasi → 'NAH-see' — 'rice (cooked)'",
          "goreng → 'GO-reng' — 'fried'; hard 'g', nasal 'ng'",
          "nasi goreng = 'fried rice' — adjective comes AFTER the noun",
        ],
      },
      {
        en: "One fried noodle and one chicken noodle.",
        vi: "Một mì xào và một mì gà.",
        pronunciation_focus: [
          "mie → MI (mì)",
          "mie goreng → mì xào",
          "ayam → A-yam (gà)",
          "satu ... dan satu ...",
        ],
        pronunciation_focus_en: [
          "mie → 'MEE' — 'noodles' (also spelled 'mi')",
          "mie goreng → 'fried noodles'",
          "ayam → 'AH-yam' — 'chicken'; mie ayam = chicken noodle soup",
          "'satu … dan satu …' = 'one … and one …'",
        ],
      },
      {
        en: "A cup of coffee and a glass of tea.",
        vi: "Một ly cà phê và một ly trà.",
        pronunciation_focus: [
          "kopi → KO-pi (cà phê)",
          "teh → TEH (trà)",
          "es teh → ES TEH (trà đá)",
          "air putih → A-ir PU-tih (nước lọc)",
        ],
        pronunciation_focus_en: [
          "kopi → 'KO-pee' — 'coffee'",
          "teh → 'TEH' — 'tea'",
          "es teh → 'es TEH' — 'iced tea', the default cold drink",
          "air putih → 'AH-ir POO-tee' — 'plain water' (literally 'white water')",
        ],
      },
      {
        en: "Is it spicy? It's very delicious.",
        vi: "Có cay không? Ngon lắm.",
        pronunciation_focus: [
          "pedas → pe-DAS (cay)",
          "enak → E-nak (ngon)",
          "enak sekali → ngon lắm",
          "tidak pedas → không cay",
        ],
        pronunciation_focus_en: [
          "pedas → 'pe-DAS' — 'spicy'",
          "enak → 'E-nak' — 'delicious/tasty'",
          "enak sekali → 'very delicious' (sekali = very, after the adjective)",
          "tidak pedas → 'not spicy' (tidak = not)",
        ],
      },
      {
        en: "How much is the total? Here you go.",
        vi: "Tổng cộng bao nhiêu? Đây ạ.",
        pronunciation_focus: [
          "berapa semuanya → tổng bao nhiêu",
          "semuanya → se-MU-a-nya (tất cả)",
          "ini → I-ni (đây)",
          "tolong → TO-long (làm ơn)",
        ],
        pronunciation_focus_en: [
          "berapa semuanya → 'how much (is) everything' = the total",
          "semuanya → 'se-MOO-ah-nyah' — 'all of it'",
          "ini → 'EE-nee' — 'here/this'",
          "tolong → 'TO-long' — 'please' (when requesting a favor/action)",
        ],
      },
    ],
    cultural_notes_vi:
      "Khung gọi món: 'Saya mau ___' (Tôi muốn ___) hoặc lịch sự hơn 'Saya mau pesan ___' (Tôi muốn gọi ___). Món quốc dân: nasi goreng (cơm chiên), mie goreng (mì xào), mie ayam (mì gà), sate (xiên nướng), bakso (bò viên). Đồ uống: es teh (trà đá), kopi (cà phê), air putih (nước lọc). ĐIỂM DỄ cho người Việt: cấu trúc 'danh từ + tính từ' giống tiếng Việt (nasi goreng = 'cơm chiên', không phải 'chiên cơm' như tiếng Anh). Hỏi cay: 'Pedas tidak?' (Có cay không?). Đồ ăn Indonesia thường rất cay.",
    cultural_notes_en:
      "Ordering frame: 'Saya mau ___' ('I want ___') or more politely 'Saya mau pesan ___' ('I'd like to order ___'). National dishes: nasi goreng (fried rice), mie goreng (fried noodles), mie ayam (chicken noodles), sate (skewers), bakso (meatballs). Drinks: es teh (iced tea), kopi (coffee), air putih (plain water). Easy for Vietnamese speakers: the 'noun + adjective' order matches Vietnamese (nasi goreng = 'rice fried', like 'cơm chiên', not English 'fried rice'). Ask about heat: 'Pedas tidak?' ('Is it spicy?'). Indonesian food is often very spicy.",
    tip_advice_vi:
      "Ba câu sống còn ở quán: 'Saya mau ___' (gọi món), 'Berapa harganya?' (bao nhiêu tiền), 'Enak sekali!' (ngon lắm). Mẹo người Việt: 'sekali' (rất) đặt SAU tính từ — enak sekali, pedas sekali. Muốn 'không cay' nói 'tidak pedas'. 'Tolong' = làm ơn (nhờ làm gì), khác 'silakan' = mời (mời bạn làm).",
    tip_advice_en:
      "Three survival lines at any eatery: 'Saya mau ___' (to order), 'Berapa harganya?' (how much), 'Enak sekali!' (very tasty). For Vietnamese learners: 'sekali' (very) comes AFTER the adjective — enak sekali, pedas sekali. For 'not spicy' say 'tidak pedas'. 'Tolong' = please (asking a favor), distinct from 'silakan' = please/go ahead (inviting someone).",
    vocabulary: [
      {
        word: "saya mau",
        en: "I want",
        vi: "tôi muốn",
        pos: "phrase",
        pronunciation_vi: "SA-ya MAU",
        pronunciation_en: "SAH-yah mau",
      },
      {
        word: "nasi goreng",
        en: "fried rice",
        vi: "cơm chiên",
        pos: "noun",
        pronunciation_vi: "NA-si GO-reng",
        pronunciation_en: "NAH-see GO-reng",
      },
      {
        word: "mie goreng",
        en: "fried noodles",
        vi: "mì xào",
        pos: "noun",
        pronunciation_vi: "MI GO-reng",
        pronunciation_en: "MEE GO-reng",
      },
      {
        word: "ayam",
        en: "chicken",
        vi: "gà",
        pos: "noun",
        pronunciation_vi: "A-yam",
        pronunciation_en: "AH-yam",
      },
      {
        word: "teh",
        en: "tea",
        vi: "trà",
        pos: "noun",
        pronunciation_vi: "TEH",
        pronunciation_en: "TEH",
      },
      {
        word: "kopi",
        en: "coffee",
        vi: "cà phê",
        pos: "noun",
        pronunciation_vi: "KO-pi",
        pronunciation_en: "KO-pee",
      },
      {
        word: "air putih",
        en: "plain water",
        vi: "nước lọc",
        pos: "noun",
        pronunciation_vi: "A-ir PU-tih",
        pronunciation_en: "AH-ir POO-tee",
      },
      {
        word: "enak",
        en: "delicious",
        vi: "ngon",
        pos: "adjective",
        pronunciation_vi: "E-nak",
        pronunciation_en: "E-nak",
      },
      {
        word: "pedas",
        en: "spicy",
        vi: "cay",
        pos: "adjective",
        pronunciation_vi: "pe-DAS",
        pronunciation_en: "pe-DAS",
      },
      {
        word: "tolong",
        en: "please (asking a favor)",
        vi: "làm ơn",
        pos: "interjection",
        pronunciation_vi: "TO-long",
        pronunciation_en: "TO-long",
      },
    ],
    dialogue: [
      {
        speaker: "Pelayan",
        text: "Selamat siang! Mau pesan apa?",
        vi: "Chào buổi trưa! Anh/chị muốn gọi gì?",
        en: "Good afternoon! What would you like to order?",
      },
      {
        speaker: "Tamu",
        text: "Saya mau nasi goreng dan es teh, tolong.",
        vi: "Cho tôi cơm chiên và trà đá.",
        en: "I'd like fried rice and iced tea, please.",
      },
      {
        speaker: "Pelayan",
        text: "Mau pedas atau tidak?",
        vi: "Anh/chị muốn cay hay không cay?",
        en: "Do you want it spicy or not?",
      },
      {
        speaker: "Tamu",
        text: "Tidak pedas, terima kasih. Berapa semuanya?",
        vi: "Không cay, cảm ơn. Tổng cộng bao nhiêu?",
        en: "Not spicy, thank you. How much is the total?",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu khi gọi món:",
        instruction_en: "Fill in the missing ordering word:",
        pronunciation_focus: ["saya mau", "enak", "pedas"],
        pronunciation_focus_en: [
          "saya mau → 'SAH-yah mau' (I want)",
          "enak → 'E-nak' (delicious)",
          "pedas → 'pe-DAS' (spicy)",
        ],
        items: [
          {
            prompt: "___ nasi goreng. (Tôi muốn cơm chiên)",
            answer: "Saya mau",
            options: ["Saya mau", "Berapa", "Di mana"],
          },
          {
            prompt: "Tidak ___, tolong. (Không cay)",
            answer: "pedas",
            options: ["pedas", "enak", "kopi"],
          },
          {
            prompt: "Makanan ini ___ sekali! (Món này ngon lắm)",
            answer: "enak",
            options: ["enak", "pedas", "mau"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối món/đồ uống với nghĩa:",
        instruction_en: "Match the dish/drink with its meaning:",
        pronunciation_focus: ["nasi goreng", "es teh", "air putih"],
        pronunciation_focus_en: [
          "nasi goreng → 'NAH-see GO-reng' (fried rice)",
          "es teh → 'es TEH' (iced tea)",
          "air putih → 'AH-ir POO-tee' (plain water)",
        ],
        items: [
          { prompt: "nasi goreng", answer: "cơm chiên" },
          { prompt: "mie ayam", answer: "mì gà" },
          { prompt: "es teh", answer: "trà đá" },
          { prompt: "air putih", answer: "nước lọc" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        pronunciation_focus: ["saya mau", "berapa harganya"],
        pronunciation_focus_en: [
          "saya mau → 'SAH-yah mau' (I want)",
          "berapa harganya → 'be-RAH-pah HAR-gah-nyah' (how much is it)",
        ],
        items: [
          { prompt: "Cho tôi một ly cà phê.", answer: "Saya mau satu kopi." },
          { prompt: "Cái này có cay không?", answer: "Ini pedas tidak?" },
          { prompt: "Tổng cộng bao nhiêu tiền?", answer: "Berapa semuanya?" },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────── directions
  {
    id: "indonesian_directions",
    level: "A1",
    category: "directions",
    title_vi: "Hỏi đường",
    title_en: "Asking for directions",
    sentences: [
      {
        en: "Excuse me, where is the station?",
        vi: "Xin lỗi, nhà ga ở đâu?",
        pronunciation_focus: [
          "permisi → per-MI-si (xin lỗi)",
          "di mana → di MA-na (ở đâu)",
          "stasiun → sta-SI-un (nhà ga)",
          "Di mana stasiun?",
        ],
        pronunciation_focus_en: [
          "permisi → 'per-MEE-see' — 'excuse me' to open a question",
          "di mana → 'dee MAH-nah' — 'where'",
          "stasiun → 'stah-SEE-oon' — 'station'",
          "'Di mana stasiun?' = 'where (is the) station?'",
        ],
      },
      {
        en: "Go straight ahead.",
        vi: "Đi thẳng.",
        pronunciation_focus: [
          "lurus → LU-rus (thẳng)",
          "jalan → JA-lan (đi/đường)",
          "terus → te-RUS (tiếp tục)",
          "jalan lurus terus",
        ],
        pronunciation_focus_en: [
          "lurus → 'LOO-roos' — 'straight'",
          "jalan → 'JAH-lan' — 'walk/road'",
          "terus → 'te-ROOS' — 'keep going'",
          "'jalan lurus terus' = 'keep walking straight'",
        ],
      },
      {
        en: "Turn left, then turn right.",
        vi: "Rẽ trái, rồi rẽ phải.",
        pronunciation_focus: [
          "belok → BE-lok (rẽ)",
          "kiri → KI-ri (trái)",
          "kanan → KA-nan (phải)",
          "belok kiri / belok kanan",
        ],
        pronunciation_focus_en: [
          "belok → 'BE-lok' — 'turn'",
          "kiri → 'KEE-ree' — 'left'",
          "kanan → 'KAH-nan' — 'right'",
          "belok kiri = turn left; belok kanan = turn right",
        ],
      },
      {
        en: "It's near here. It's not far.",
        vi: "Gần đây thôi. Không xa.",
        pronunciation_focus: [
          "dekat → DE-kat (gần)",
          "jauh → JA-uh (xa)",
          "di sini → di SI-ni (ở đây)",
          "tidak jauh → không xa",
        ],
        pronunciation_focus_en: [
          "dekat → 'DE-kat' — 'near'",
          "jauh → 'JAH-ooh' — 'far'",
          "di sini → 'dee SEE-nee' — 'here'",
          "tidak jauh → 'not far'",
        ],
      },
      {
        en: "In front of the market, behind the mosque.",
        vi: "Trước chợ, sau nhà thờ Hồi giáo.",
        pronunciation_focus: [
          "depan → de-PAN (phía trước)",
          "belakang → be-la-KANG (phía sau)",
          "pasar → PA-sar (chợ)",
          "masjid → MAS-jid (nhà thờ Hồi giáo)",
        ],
        pronunciation_focus_en: [
          "depan → 'de-PAN' — 'in front'",
          "belakang → 'be-lah-KANG' — 'behind'",
          "pasar → 'PAH-sar' — 'market'",
          "masjid → 'MAS-jid' — 'mosque'",
        ],
      },
    ],
    cultural_notes_vi:
      "Mở đầu lịch sự: 'Permisi, di mana ___?' (Xin lỗi, ___ ở đâu?). Từ chỉ hướng cốt lõi: lurus (thẳng), belok kiri (rẽ trái), belok kanan (rẽ phải), dekat (gần), jauh (xa). Vị trí: di depan (trước), di belakang (sau), di samping (bên cạnh), di sebelah (kế bên). ĐIỂM DỄ cho người Việt: không chia động từ, không có giống đực/cái cho 'trái/phải' như nhiều tiếng châu Âu. Người Indonesia rất thân thiện chỉ đường; nếu họ chỉ tay và nói 'di sana' (đằng kia) thì cứ đi theo hướng đó.",
    cultural_notes_en:
      "Polite opener: 'Permisi, di mana ___?' ('Excuse me, where is ___?'). Core direction words: lurus (straight), belok kiri (turn left), belok kanan (turn right), dekat (near), jauh (far). Position words: di depan (in front), di belakang (behind), di samping (beside), di sebelah (next to). Easy for Vietnamese speakers: no verb conjugation and no masculine/feminine forms for 'left/right' like many European languages. Indonesians are very friendly with directions; if they point and say 'di sana' ('over there'), just follow the gesture.",
    tip_advice_vi:
      "Combo hỏi đường: 'Permisi, di mana ___?' → nghe 'lurus / belok kiri / belok kanan'. Mẹo người Việt: 'belok' (rẽ) luôn đi với kiri/kanan. Phân biệt 'di sini' (ở đây), 'di situ' (ở đó, gần), 'di sana' (đằng kia, xa). 'di' = ở (vị trí tĩnh), 'ke' = đến (hướng di chuyển): 'ke kiri' = về phía trái.",
    tip_advice_en:
      "Direction combo: 'Permisi, di mana ___?' → listen for 'lurus / belok kiri / belok kanan'. For Vietnamese learners: 'belok' (turn) always pairs with kiri/kanan. Distinguish 'di sini' (here), 'di situ' (there, nearby), 'di sana' (over there, far). 'di' = at (static), 'ke' = to (movement): 'ke kiri' = to the left.",
    vocabulary: [
      {
        word: "di mana",
        en: "where",
        vi: "ở đâu",
        pos: "question phrase",
        pronunciation_vi: "di MA-na",
        pronunciation_en: "dee MAH-nah",
      },
      {
        word: "lurus",
        en: "straight",
        vi: "thẳng",
        pos: "adverb",
        pronunciation_vi: "LU-rus",
        pronunciation_en: "LOO-roos",
      },
      {
        word: "belok kiri",
        en: "turn left",
        vi: "rẽ trái",
        pos: "phrase",
        pronunciation_vi: "BE-lok KI-ri",
        pronunciation_en: "BE-lok KEE-ree",
      },
      {
        word: "belok kanan",
        en: "turn right",
        vi: "rẽ phải",
        pos: "phrase",
        pronunciation_vi: "BE-lok KA-nan",
        pronunciation_en: "BE-lok KAH-nan",
      },
      {
        word: "dekat",
        en: "near",
        vi: "gần",
        pos: "adjective",
        pronunciation_vi: "DE-kat",
        pronunciation_en: "DE-kat",
      },
      {
        word: "jauh",
        en: "far",
        vi: "xa",
        pos: "adjective",
        pronunciation_vi: "JA-uh",
        pronunciation_en: "JAH-ooh",
      },
      {
        word: "depan",
        en: "front / in front",
        vi: "phía trước",
        pos: "noun",
        pronunciation_vi: "de-PAN",
        pronunciation_en: "de-PAN",
      },
      {
        word: "belakang",
        en: "back / behind",
        vi: "phía sau",
        pos: "noun",
        pronunciation_vi: "be-la-KANG",
        pronunciation_en: "be-lah-KANG",
      },
      {
        word: "pasar",
        en: "market",
        vi: "chợ",
        pos: "noun",
        pronunciation_vi: "PA-sar",
        pronunciation_en: "PAH-sar",
      },
      {
        word: "jalan",
        en: "road / to walk",
        vi: "đường / đi bộ",
        pos: "noun / verb",
        pronunciation_vi: "JA-lan",
        pronunciation_en: "JAH-lan",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        text: "Permisi, di mana pasar?",
        vi: "Xin lỗi, chợ ở đâu?",
        en: "Excuse me, where is the market?",
      },
      {
        speaker: "B",
        text: "Jalan lurus terus, lalu belok kanan.",
        vi: "Đi thẳng tiếp, rồi rẽ phải.",
        en: "Keep going straight, then turn right.",
      },
      {
        speaker: "A",
        text: "Apakah jauh dari sini?",
        vi: "Có xa đây không?",
        en: "Is it far from here?",
      },
      {
        speaker: "B",
        text: "Tidak, dekat. Di depan masjid.",
        vi: "Không, gần thôi. Ở trước nhà thờ Hồi giáo.",
        en: "No, it's near. In front of the mosque.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ chỉ hướng đúng:",
        instruction_en: "Fill in the correct direction word:",
        pronunciation_focus: ["lurus", "belok kiri", "belok kanan"],
        pronunciation_focus_en: [
          "lurus → 'LOO-roos' (straight)",
          "belok kiri → 'BE-lok KEE-ree' (turn left)",
          "belok kanan → 'BE-lok KAH-nan' (turn right)",
        ],
        items: [
          {
            prompt: "Jalan ___ terus. (Đi thẳng tiếp)",
            answer: "lurus",
            options: ["lurus", "dekat", "jauh"],
          },
          {
            prompt: "___ di lampu merah. (Rẽ trái ở đèn đỏ)",
            answer: "Belok kiri",
            options: ["Belok kiri", "Belok kanan", "Lurus"],
          },
          {
            prompt: "Pasar ada di ___ masjid. (Chợ ở trước nhà thờ)",
            answer: "depan",
            options: ["depan", "belakang", "jauh"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        instruction_en: "Match the word with its meaning:",
        pronunciation_focus: ["dekat", "jauh", "belakang"],
        pronunciation_focus_en: [
          "dekat → 'DE-kat' (near)",
          "jauh → 'JAH-ooh' (far)",
          "belakang → 'be-lah-KANG' (behind)",
        ],
        items: [
          { prompt: "dekat", answer: "gần" },
          { prompt: "jauh", answer: "xa" },
          { prompt: "depan", answer: "phía trước" },
          { prompt: "belakang", answer: "phía sau" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        pronunciation_focus: ["di mana", "belok kanan"],
        pronunciation_focus_en: [
          "di mana → 'dee MAH-nah' (where)",
          "belok kanan → 'BE-lok KAH-nan' (turn right)",
        ],
        items: [
          { prompt: "Xin lỗi, nhà ga ở đâu?", answer: "Permisi, di mana stasiun?" },
          { prompt: "Đi thẳng rồi rẽ trái.", answer: "Jalan lurus lalu belok kiri." },
          { prompt: "Có gần đây không?", answer: "Apakah dekat dari sini?" },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────── family
  {
    id: "indonesian_family",
    level: "A1",
    category: "family",
    title_vi: "Gia đình",
    title_en: "Family",
    sentences: [
      {
        en: "This is my father and my mother.",
        vi: "Đây là cha tôi và mẹ tôi.",
        pronunciation_focus: [
          "ini → I-ni (đây)",
          "ayah → A-yah (cha)",
          "ibu → I-bu (mẹ)",
          "ayah saya / ibu saya",
        ],
        pronunciation_focus_en: [
          "ini → 'EE-nee' — 'this'",
          "ayah → 'AH-yah' — 'father' (bapak/papa also used)",
          "ibu → 'EE-boo' — 'mother' (mama also used)",
          "ayah saya / ibu saya = 'my father / my mother' (possessor after)",
        ],
      },
      {
        en: "I have an older brother and a younger sister.",
        vi: "Tôi có anh trai và em gái.",
        pronunciation_focus: [
          "saya punya → tôi có",
          "kakak → KA-kak (anh/chị)",
          "adik → A-dik (em)",
          "không phân biệt giới trong 'kakak'",
        ],
        pronunciation_focus_en: [
          "saya punya → 'I have' (punya = to have/own)",
          "kakak → 'KAH-kak' — older sibling (brother OR sister)",
          "adik → 'AH-dik' — younger sibling (brother OR sister)",
          "kakak/adik mark AGE, not gender — add laki-laki/perempuan to specify sex",
        ],
      },
      {
        en: "My older brother, my younger sister.",
        vi: "Anh trai tôi, em gái tôi.",
        pronunciation_focus: [
          "laki-laki → LA-ki LA-ki (nam)",
          "perempuan → pe-rem-PU-an (nữ)",
          "kakak laki-laki → anh trai",
          "adik perempuan → em gái",
        ],
        pronunciation_focus_en: [
          "laki-laki → 'LAH-kee LAH-kee' — 'male'",
          "perempuan → 'pe-rem-POO-an' — 'female'",
          "kakak laki-laki → 'older brother'",
          "adik perempuan → 'younger sister'",
        ],
      },
      {
        en: "How many siblings do you have?",
        vi: "Bạn có mấy anh chị em?",
        pronunciation_focus: [
          "berapa → be-RA-pa (bao nhiêu)",
          "saudara → sau-DA-ra (anh chị em)",
          "punya → PU-nya (có)",
          "Berapa saudara kamu?",
        ],
        pronunciation_focus_en: [
          "berapa → 'be-RAH-pah' — 'how many'",
          "saudara → 'sau-DAH-rah' — sibling/relative",
          "punya → 'POO-nyah' — 'have'; 'nya' is one sound",
          "'Berapa saudara kamu?' = 'how many siblings (do) you (have)?'",
        ],
      },
      {
        en: "This is my child, and these are my grandparents.",
        vi: "Đây là con tôi, và đây là ông bà tôi.",
        pronunciation_focus: [
          "anak → A-nak (con)",
          "kakek → KA-kek (ông)",
          "nenek → NE-nek (bà)",
          "keluarga → ke-lu-AR-ga (gia đình)",
        ],
        pronunciation_focus_en: [
          "anak → 'AH-nak' — 'child'",
          "kakek → 'KAH-kek' — 'grandfather'",
          "nenek → 'NE-nek' — 'grandmother'",
          "keluarga → 'ke-loo-AR-gah' — 'family'",
        ],
      },
    ],
    cultural_notes_vi:
      "Từ gia đình Indonesia có điểm CỰC DỄ và một điểm khác với tiếng Việt. Dễ: 'kakak' = anh HOẶC chị (chỉ lớn hơn), 'adik' = em (em trai HOẶC em gái) — chỉ phân biệt TUỔI, không phân biệt giới như tiếng Việt phức tạp (anh/chị/em + trai/gái). Muốn rõ giới thì thêm 'laki-laki' (nam) hay 'perempuan' (nữ): kakak perempuan = chị gái. Cha mẹ: ayah/bapak (cha), ibu (mẹ). Ông bà: kakek (ông), nenek (bà). 'Bapak/Pak' và 'Ibu/Bu' cũng dùng để gọi người lớn lịch sự, không chỉ trong gia đình.",
    cultural_notes_en:
      "Indonesian family words have one big easy feature and one twist versus Vietnamese. Easy: 'kakak' = older sibling (brother OR sister) and 'adik' = younger sibling — they mark AGE only, not gender, unlike Vietnamese's elaborate anh/chị/em system. To specify sex, add 'laki-laki' (male) or 'perempuan' (female): kakak perempuan = older sister. Parents: ayah/bapak (father), ibu (mother). Grandparents: kakek (grandpa), nenek (grandma). 'Bapak/Pak' and 'Ibu/Bu' also serve as polite address for any adult, not just within the family.",
    tip_advice_vi:
      "Trục chính: kakak (lớn hơn) ↔ adik (nhỏ hơn), thêm laki-laki/perempuan khi cần rõ giới. Mẹo người Việt: đừng dịch máy móc 'anh/chị/em' — tiếng Indonesia gộp anh+chị = kakak, em trai+em gái = adik, đơn giản hơn nhiều. Sở hữu luôn đặt sau: 'ibu saya' (mẹ tôi), 'anak kamu' (con bạn). 'punya' = có (sở hữu).",
    tip_advice_en:
      "Main axis: kakak (older) ↔ adik (younger); add laki-laki/perempuan only when you must mark sex. For Vietnamese learners: don't map anh/chị/em one-to-one — Indonesian merges older-brother + older-sister into kakak, and younger-brother + younger-sister into adik, which is simpler. Possessor always follows: 'ibu saya' (my mother), 'anak kamu' (your child). 'punya' = to have/own.",
    vocabulary: [
      {
        word: "keluarga",
        en: "family",
        vi: "gia đình",
        pos: "noun",
        pronunciation_vi: "ke-lu-AR-ga",
        pronunciation_en: "ke-loo-AR-gah",
      },
      {
        word: "ayah",
        en: "father",
        vi: "cha / ba",
        pos: "noun",
        pronunciation_vi: "A-yah",
        pronunciation_en: "AH-yah",
      },
      {
        word: "ibu",
        en: "mother",
        vi: "mẹ",
        pos: "noun",
        pronunciation_vi: "I-bu",
        pronunciation_en: "EE-boo",
      },
      {
        word: "kakak",
        en: "older sibling",
        vi: "anh / chị",
        pos: "noun",
        pronunciation_vi: "KA-kak",
        pronunciation_en: "KAH-kak",
      },
      {
        word: "adik",
        en: "younger sibling",
        vi: "em",
        pos: "noun",
        pronunciation_vi: "A-dik",
        pronunciation_en: "AH-dik",
      },
      {
        word: "laki-laki",
        en: "male",
        vi: "nam / trai",
        pos: "adjective",
        pronunciation_vi: "LA-ki LA-ki",
        pronunciation_en: "LAH-kee LAH-kee",
      },
      {
        word: "perempuan",
        en: "female",
        vi: "nữ / gái",
        pos: "adjective",
        pronunciation_vi: "pe-rem-PU-an",
        pronunciation_en: "pe-rem-POO-an",
      },
      {
        word: "anak",
        en: "child",
        vi: "con",
        pos: "noun",
        pronunciation_vi: "A-nak",
        pronunciation_en: "AH-nak",
      },
      {
        word: "kakek",
        en: "grandfather",
        vi: "ông",
        pos: "noun",
        pronunciation_vi: "KA-kek",
        pronunciation_en: "KAH-kek",
      },
      {
        word: "nenek",
        en: "grandmother",
        vi: "bà",
        pos: "noun",
        pronunciation_vi: "NE-nek",
        pronunciation_en: "NE-nek",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        text: "Berapa saudara kamu?",
        vi: "Bạn có mấy anh chị em?",
        en: "How many siblings do you have?",
      },
      {
        speaker: "B",
        text: "Saya punya satu kakak dan satu adik.",
        vi: "Tôi có một anh/chị và một em.",
        en: "I have one older sibling and one younger sibling.",
      },
      {
        speaker: "A",
        text: "Kakak laki-laki atau perempuan?",
        vi: "Anh trai hay chị gái?",
        en: "Older brother or older sister?",
      },
      {
        speaker: "B",
        text: "Kakak perempuan. Ini foto keluarga saya.",
        vi: "Chị gái. Đây là ảnh gia đình tôi.",
        en: "Older sister. This is my family photo.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ gia đình đúng:",
        instruction_en: "Fill in the correct family word:",
        pronunciation_focus: ["ayah", "ibu", "kakak"],
        pronunciation_focus_en: [
          "ayah → 'AH-yah' (father)",
          "ibu → 'EE-boo' (mother)",
          "kakak → 'KAH-kak' (older sibling)",
        ],
        items: [
          {
            prompt: "___ saya guru. (Cha tôi là giáo viên)",
            answer: "Ayah",
            options: ["Ayah", "Ibu", "Adik"],
          },
          {
            prompt: "___ saya memasak. (Mẹ tôi nấu ăn)",
            answer: "Ibu",
            options: ["Ayah", "Ibu", "Anak"],
          },
          {
            prompt: "___ saya lebih muda. (Em tôi nhỏ hơn)",
            answer: "Adik",
            options: ["Kakak", "Adik", "Kakek"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ gia đình với nghĩa:",
        instruction_en: "Match the family word with its meaning:",
        pronunciation_focus: ["kakak", "adik", "kakek"],
        pronunciation_focus_en: [
          "kakak → 'KAH-kak' (older sibling)",
          "adik → 'AH-dik' (younger sibling)",
          "kakek → 'KAH-kek' (grandfather)",
        ],
        items: [
          { prompt: "kakak", answer: "anh / chị" },
          { prompt: "adik", answer: "em" },
          { prompt: "kakek", answer: "ông" },
          { prompt: "nenek", answer: "bà" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        pronunciation_focus: ["ibu saya", "kakak perempuan"],
        pronunciation_focus_en: [
          "ibu saya → 'EE-boo SAH-yah' (my mother)",
          "kakak perempuan → 'KAH-kak pe-rem-POO-an' (older sister)",
        ],
        items: [
          { prompt: "Đây là mẹ tôi.", answer: "Ini ibu saya." },
          { prompt: "Tôi có một em trai.", answer: "Saya punya satu adik laki-laki." },
          { prompt: "Bạn có mấy anh chị em?", answer: "Berapa saudara kamu?" },
        ],
      },
    ],
  },
];

export default lessons;
