// src/languages/italian/lessons-a1.ts
//
// Italian A1 lessons for Vietnamese learners.
//
// Shape mirrors the French pack (src/languages/french/lessons.ts) so the
// shared lesson page UI stays consistent across language verticals — but
// the type is declared INLINE here because the Italian vertical does not
// yet ship a `./lessons` registry file. This module is intentionally
// self-contained: it exports its own types plus the A1 data array.
//
// Source content: hand-derived from the local Vietnamese→Italian study
// track (.local/vietnamese-italian-study/A1-survival-basics.md and the
// A2/A3 grammar notes). Vietnamese-first: every lesson carries L1 notes —
// the specific mistakes a Vietnamese speaker makes — under `l1_notes_vi`.
// Hand-crafted; no AI-generated filler.

// ── Types (inline — Italian vertical has no shared ./lessons yet) ────────

export type ItalianCategoryId =
  | "greetings"
  | "introductions"
  | "numbers"
  | "common_phrases"
  | "basic_grammar"
  | "food"
  | "family"
  | "time"
  | "daily_routine"
  | "places";

export type ItalianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ItalianLessonSentence = {
  /** The Italian target sentence (this is the line the learner speaks). */
  it: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Literal English gloss, for the secondary EN audience. */
  en?: string;
  /** Pronunciation / grammar focus points, written for a Vietnamese ear. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
  pronunciation_focus_en?: string[];
};

export type ItalianVocabEntry = {
  /** Italian word, with article where gender matters (e.g. "la famiglia"). */
  word: string;
  en: string;
  vi: string;
  pos: string;
  /** Pronunciation respelled for a Vietnamese reader; stressed syllable CAPS. */
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type ItalianDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

/** A Vietnamese-speaker L1-interference note: the mistake + the fix. */
export type ItalianL1Note = {
  /** The wrong form a Vietnamese learner tends to produce. */
  mistake: string;
  /** Why it happens / what the correct form is, in Vietnamese. */
  fix_vi: string;
};

// Loosely typed so per-type exercise fields can vary (fill_blank / matching /
// translation), matching the French pack's Exercise contract.
export type ItalianExercise = Record<string, unknown>;

export type ItalianLesson = {
  id: string;
  category: ItalianCategoryId;
  level: ItalianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: ItalianLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  /** Vietnamese-first L1 interference notes — the heart of this pack. */
  l1_notes_vi?: ItalianL1Note[];
  vocabulary?: ItalianVocabEntry[];
  dialogue?: ItalianDialogueLine[];
  exercises?: ItalianExercise[];
};

// ── A1 lessons ───────────────────────────────────────────────────────────

export const lessons: ItalianLesson[] = [
  // ── 1. Greetings ───────────────────────────────────────────────────────
  {
    id: "italian_greetings_intro",
    level: "A1",
    category: "greetings",
    title_vi: "Chào hỏi cơ bản",
    title_en: "Basic greetings",
    sentences: [
      {
        it: "Ciao! Come stai?",
        vi: "Chào! Bạn khỏe không?",
        en: "Hi! How are you?",
        pronunciation_focus: [
          "ciao → 'chao'",
          "come → CÔ-mê",
          "stai → 'xtai'",
        ],
        pronunciation_focus_en: [
          "ciao → 'chow' — the 'ci' is the English 'ch' in 'chair'",
          "come → 'KOH-meh' — pronounce the final 'e' (NOT silent like French)",
          "stai → 'sty' — one syllable, 'ai' glides together",
        ],
      },
      {
        it: "Buongiorno, signora.",
        vi: "Chào buổi sáng, thưa bà.",
        en: "Good morning, madam.",
        pronunciation_focus: [
          "buon → 'buôn'",
          "giorno → 'JOR-nô'",
          "gn trong signora → 'nh'",
        ],
        pronunciation_focus_en: [
          "buongiorno flows as one word → 'bwon-JOR-noh'",
          "gior → 'jor' — 'gi' before a vowel is the soft 'j' in 'jam'",
          "gn in signora → 'ny' as in 'canyon' (si-NYO-rah)",
        ],
      },
      {
        it: "Buonasera! A domani.",
        vi: "Chào buổi tối! Hẹn gặp ngày mai.",
        en: "Good evening! See you tomorrow.",
        pronunciation_focus: [
          "sera → 'XÊ-ra'",
          "a domani → 'a đô-MA-ni'",
          "phát âm đủ nguyên âm cuối",
        ],
        pronunciation_focus_en: [
          "buonasera → 'bwoh-nah-SEH-rah' — every vowel is pronounced",
          "a domani → 'ah doh-MAH-nee' — 'a' here means 'see you at/until'",
          "stress lands on the second-to-last syllable in both words",
        ],
      },
      {
        it: "Grazie mille! Prego.",
        vi: "Cảm ơn nhiều! Không có gì.",
        en: "Thank you very much! You're welcome.",
        pronunciation_focus: [
          "grazie → 'GRA-tsiê'",
          "zie → 'tsiê', đọc 'e' cuối",
          "prego → 'PRÊ-gô'",
        ],
        pronunciation_focus_en: [
          "grazie → 'GRAH-tsyeh' — 'zie' is 'tsyeh', and the final 'e' IS said",
          "don't clip it to 'grazi' — Italian keeps every final vowel",
          "prego → 'PREH-goh' — hard 'g' as in 'go'",
        ],
      },
      {
        it: "Scusi, non capisco.",
        vi: "Xin lỗi, tôi không hiểu.",
        en: "Excuse me, I don't understand.",
        pronunciation_focus: [
          "scusi → 'XCU-ji'",
          "non đứng trước động từ",
          "capisco → 'ca-PI-xcô'",
        ],
        pronunciation_focus_en: [
          "scusi → 'SKOO-zee' — formal 'excuse me' (informal is 'scusa')",
          "non goes BEFORE the verb to make it negative",
          "capisco → 'kah-PEES-koh' — 'sc' before 'o' is a hard 'sk'",
        ],
      },
    ],
    cultural_notes_vi:
      "Người Ý phân biệt rõ trang trọng và thân mật. 'Ciao' chỉ dùng với bạn bè, người thân, người cùng tuổi — KHÔNG dùng với thầy cô, người lớn tuổi, hay người lạ trong tình huống trang trọng. Với người lạ hãy dùng 'Buongiorno' (ban ngày) hoặc 'Buonasera' (chiều tối). 'Buonanotte' chỉ nói khi đi ngủ, không phải lời chào buổi tối. Người Ý chào hỏi nồng nhiệt — bắt tay, đôi khi hôn hai má với người quen.",
    cultural_notes_en:
      "Italians draw a sharp line between formal and informal. 'Ciao' is for friends, family, and peers only — never for a teacher, an elder, or a stranger in a formal setting; use 'Buongiorno' (daytime) or 'Buonasera' (late afternoon/evening) instead. 'Buonanotte' is said only when leaving to sleep, not as an evening hello. Greetings are warm — a handshake, and among acquaintances often a kiss on each cheek.",
    tip_advice_vi:
      "Quy tắc an toàn: với người lạ luôn bắt đầu bằng 'Buongiorno' + 'Lei' (cách nói trang trọng). Khi đã thân mới chuyển sang 'Ciao' + 'tu'. Luôn phát âm ĐỦ nguyên âm cuối ('grazie', không phải 'grazi') — đây là lỗi lớn nhất của người Việt vì tiếng Việt hay nuốt âm cuối.",
    tip_advice_en:
      "Safe rule: with strangers, always open with 'Buongiorno' and the formal 'Lei'; switch to 'Ciao' and informal 'tu' only once you're familiar. Always pronounce the FINAL vowel fully ('grazie', not 'grazi') — dropping final vowels is the single most common Vietnamese-speaker error, because Vietnamese tends to swallow word-final sounds.",
    l1_notes_vi: [
      {
        mistake: "Dùng 'Ciao' với thầy cô hoặc người lớn tuổi.",
        fix_vi: "'Ciao' chỉ thân mật. Với người trang trọng dùng 'Buongiorno' / 'Buonasera'.",
      },
      {
        mistake: "Nói 'grazi' (nuốt âm cuối).",
        fix_vi: "Tiếng Ý đọc đủ mọi nguyên âm cuối: 'GRA-tsiê', nghe rõ chữ 'e'.",
      },
      {
        mistake: "Dùng 'Buonanotte' để chào lúc 7 giờ tối.",
        fix_vi: "'Buonanotte' chỉ nói khi đi ngủ. Chào buổi tối là 'Buonasera'.",
      },
    ],
    vocabulary: [
      { word: "ciao", en: "hi / bye (informal)", vi: "chào (thân mật)", pos: "interjection", pronunciation_vi: "'chao' — 'ci' đọc 'ch'", pronunciation_en: "'chow'" },
      { word: "buongiorno", en: "good morning / hello", vi: "chào buổi sáng", pos: "interjection", pronunciation_vi: "buôn-JOR-nô", pronunciation_en: "bwon-JOR-noh" },
      { word: "buonasera", en: "good evening", vi: "chào buổi tối", pos: "interjection", pronunciation_vi: "buô-na-XÊ-ra", pronunciation_en: "bwoh-nah-SEH-rah" },
      { word: "arrivederci", en: "goodbye (polite)", vi: "tạm biệt", pos: "interjection", pronunciation_vi: "a-ri-vê-ĐÊR-chi — 'rr' rung mạnh", pronunciation_en: "ah-ree-veh-DEHR-chee" },
      { word: "grazie", en: "thank you", vi: "cảm ơn", pos: "interjection", pronunciation_vi: "GRA-tsiê", pronunciation_en: "GRAH-tsyeh" },
      { word: "prego", en: "you're welcome / go ahead", vi: "không có gì / xin mời", pos: "interjection", pronunciation_vi: "PRÊ-gô", pronunciation_en: "PREH-goh" },
      { word: "per favore", en: "please", vi: "làm ơn", pos: "phrase", pronunciation_vi: "pêr fa-VÔ-rê", pronunciation_en: "pehr fah-VOH-reh" },
      { word: "scusi", en: "excuse me (formal)", vi: "xin lỗi (trang trọng)", pos: "phrase", pronunciation_vi: "XCU-ji", pronunciation_en: "SKOO-zee" },
    ],
    dialogue: [
      { speaker: "A", text: "Buongiorno! Come sta?", vi: "Chào buổi sáng! Anh/chị khỏe không?", en: "Good morning! How are you (formal)?" },
      { speaker: "B", text: "Bene, grazie. E Lei?", vi: "Khỏe, cảm ơn. Còn anh/chị?", en: "Fine, thanks. And you (formal)?" },
      { speaker: "A", text: "Molto bene. Arrivederci!", vi: "Rất khỏe. Tạm biệt!", en: "Very well. Goodbye!" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn lời chào đúng theo tình huống:",
        instruction_en: "Choose the right greeting for the situation:",
        items: [
          { prompt: "Gặp thầy giáo lúc 9 giờ sáng: ___", answer: "Buongiorno", options: ["Ciao", "Buongiorno", "Buonanotte"] },
          { prompt: "Gặp bạn thân: ___", answer: "Ciao", options: ["Ciao", "Buonasera", "Scusi"] },
          { prompt: "Trước khi đi ngủ: ___", answer: "Buonanotte", options: ["Buongiorno", "Buonanotte", "Prego"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý:",
        instruction_en: "Translate into Italian:",
        items: [
          { prompt: "Xin lỗi, tôi không hiểu.", answer: "Scusi, non capisco." },
          { prompt: "Cảm ơn nhiều!", answer: "Grazie mille!" },
          { prompt: "Chào buổi tối, thưa bà.", answer: "Buonasera, signora." },
        ],
      },
    ],
  },

  // ── 2. Introductions ───────────────────────────────────────────────────
  {
    id: "italian_introductions",
    level: "A1",
    category: "introductions",
    title_vi: "Giới thiệu bản thân",
    title_en: "Introducing yourself",
    sentences: [
      {
        it: "Mi chiamo Lan. E tu, come ti chiami?",
        vi: "Tôi tên là Lan. Còn bạn, bạn tên là gì?",
        en: "My name is Lan. And you, what's your name?",
        pronunciation_focus: [
          "chiamo → 'KIA-mô'",
          "ti chiami → 'ti KIA-mi'",
          "chi → 'ki' (âm cứng)",
        ],
        pronunciation_focus_en: [
          "mi chiamo → 'mee KYAH-moh' (literally 'I call myself')",
          "chi → hard 'k' (the 'h' makes 'ci' stay hard: 'kee')",
          "come ti chiami → 'KOH-meh tee KYAH-mee' (informal 'what's your name')",
        ],
      },
      {
        it: "Sono vietnamita. Sono di Hanoi.",
        vi: "Tôi là người Việt Nam. Tôi quê ở Hà Nội.",
        en: "I'm Vietnamese. I'm from Hanoi.",
        pronunciation_focus: [
          "sono → 'XÔ-nô'",
          "tính từ quốc tịch viết thường",
          "di → 'đi' = từ/của",
        ],
        pronunciation_focus_en: [
          "sono → 'SOH-noh' — means both 'I am' and 'they are'",
          "vietnamita is lowercase in Italian (nationalities aren't capitalised)",
          "di → 'dee' — 'from / of'",
        ],
      },
      {
        it: "Vivo a Roma, in Italia.",
        vi: "Tôi sống ở Rome, ở Ý.",
        en: "I live in Rome, in Italy.",
        pronunciation_focus: [
          "vivo → 'VI-vô'",
          "a + thành phố",
          "in + quốc gia",
        ],
        pronunciation_focus_en: [
          "vivo → 'VEE-voh'",
          "use 'a' before a city (a Roma)",
          "use 'in' before a country (in Italia)",
        ],
      },
      {
        it: "Studio italiano ogni giorno.",
        vi: "Tôi học tiếng Ý mỗi ngày.",
        en: "I study Italian every day.",
        pronunciation_focus: [
          "studio → 'XTU-điô'",
          "ogni → 'Ô-nhi' (gn = 'nh')",
          "giorno → 'JOR-nô'",
        ],
        pronunciation_focus_en: [
          "studio → 'STOO-dyoh'",
          "ogni → 'OH-nyee' — 'gn' is 'ny' as in 'canyon'",
          "giorno → 'JOR-noh' — soft 'j'",
        ],
      },
      {
        it: "Parlo un po' italiano. Piacere!",
        vi: "Tôi nói được một chút tiếng Ý. Rất vui được gặp!",
        en: "I speak a little Italian. Nice to meet you!",
        pronunciation_focus: [
          "parlo → 'PAR-lô'",
          "un po' → 'un pô' (poco rút gọn)",
          "piacere → 'pia-CHÊ-rê'",
        ],
        pronunciation_focus_en: [
          "parlo → 'PAR-loh'",
          "un po' → 'oon poh' — apostrophe marks shortened 'poco' (a little)",
          "piacere → 'pyah-CHEH-reh' — the standard 'pleased to meet you'",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi giới thiệu, người Ý thường nói 'Piacere' (hân hạnh) kèm bắt tay. Tính từ quốc tịch (vietnamita, italiano) KHÔNG viết hoa giữa câu — khác tiếng Anh. Có hai cách hỏi tên: 'Come ti chiami?' (thân mật, với bạn) và 'Come si chiama?' (trang trọng, với người lạ/lớn tuổi). Người Ý đánh giá cao việc bạn cố nói tiếng Ý dù chỉ một chút.",
    cultural_notes_en:
      "When introducing yourself, Italians say 'Piacere' ('a pleasure') with a handshake. Nationality adjectives (vietnamita, italiano) are NOT capitalised mid-sentence — unlike English. There are two ways to ask someone's name: 'Come ti chiami?' (informal, with peers) and 'Come si chiama?' (formal, with strangers/elders). Italians genuinely appreciate any attempt to speak their language.",
    tip_advice_vi:
      "Học thuộc khối câu: 'Mi chiamo ___. Sono vietnamita. Vivo a ___. Parlo un po' italiano. Piacere!' Đó là cả phần giới thiệu A1. Nhớ: 'a' cho thành phố, 'in' cho quốc gia — đừng nói 'in Roma' hay 'a Italia'.",
    tip_advice_en:
      "Memorise the block: 'Mi chiamo ___. Sono vietnamita. Vivo a ___. Parlo un po' italiano. Piacere!' — that's an entire A1 self-introduction. Remember: 'a' for cities, 'in' for countries — never 'in Roma' or 'a Italia'.",
    l1_notes_vi: [
      {
        mistake: "'Io nome Lan' (dịch thẳng từ 'Tôi tên Lan').",
        fix_vi: "Tiếng Ý nói 'Mi chiamo Lan' = 'Tôi tự gọi mình là Lan'. Không có cấu trúc 'tôi tên'.",
      },
      {
        mistake: "'Vivo in Roma' / 'Vado a Italia'.",
        fix_vi: "Dùng 'a' với thành phố (a Roma) và 'in' với quốc gia (in Italia). Đừng đảo lại.",
      },
      {
        mistake: "Viết 'Vietnamita' viết hoa giữa câu.",
        fix_vi: "Tính từ quốc tịch viết thường: 'Sono vietnamita.'",
      },
    ],
    vocabulary: [
      { word: "mi chiamo", en: "my name is", vi: "tôi tên là", pos: "phrase", pronunciation_vi: "mi KIA-mô", pronunciation_en: "mee KYAH-moh" },
      { word: "sono", en: "I am", vi: "tôi là", pos: "verb (essere)", pronunciation_vi: "XÔ-nô", pronunciation_en: "SOH-noh" },
      { word: "vietnamita", en: "Vietnamese", vi: "người Việt", pos: "adjective", pronunciation_vi: "viê-na-MI-ta", pronunciation_en: "vyeh-nah-MEE-tah" },
      { word: "piacere", en: "nice to meet you", vi: "rất vui được gặp", pos: "phrase", pronunciation_vi: "pia-CHÊ-rê", pronunciation_en: "pyah-CHEH-reh" },
      { word: "Di dove sei?", en: "Where are you from?", vi: "Bạn quê ở đâu?", pos: "phrase", pronunciation_vi: "đi ĐÔ-vê xei", pronunciation_en: "dee DOH-veh say" },
      { word: "vivo", en: "I live", vi: "tôi sống", pos: "verb (vivere)", pronunciation_vi: "VI-vô", pronunciation_en: "VEE-voh" },
    ],
    dialogue: [
      { speaker: "A", text: "Ciao! Come ti chiami?", vi: "Chào! Bạn tên là gì?", en: "Hi! What's your name?" },
      { speaker: "B", text: "Mi chiamo Minh. E tu?", vi: "Tôi tên Minh. Còn bạn?", en: "My name is Minh. And you?" },
      { speaker: "A", text: "Sono Giulia. Di dove sei?", vi: "Tôi là Giulia. Bạn quê ở đâu?", en: "I'm Giulia. Where are you from?" },
      { speaker: "B", text: "Sono del Vietnam, di Hanoi. Piacere!", vi: "Tôi đến từ Việt Nam, Hà Nội. Rất vui được gặp!", en: "I'm from Vietnam, from Hanoi. Nice to meet you!" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền 'a' hoặc 'in':",
        instruction_en: "Fill in 'a' or 'in':",
        items: [
          { prompt: "Vivo ___ Roma.", answer: "a" },
          { prompt: "Vado ___ Italia.", answer: "in" },
          { prompt: "Abito ___ Hanoi.", answer: "a" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý:",
        instruction_en: "Translate into Italian:",
        items: [
          { prompt: "Tôi tên là Lan.", answer: "Mi chiamo Lan." },
          { prompt: "Tôi là người Việt Nam.", answer: "Sono vietnamita." },
          { prompt: "Tôi nói được một chút tiếng Ý.", answer: "Parlo un po' italiano." },
        ],
      },
    ],
  },

  // ── 3. Numbers ─────────────────────────────────────────────────────────
  {
    id: "italian_numbers_1_20",
    level: "A1",
    category: "numbers",
    title_vi: "Số đếm 1 đến 20 và hơn",
    title_en: "Numbers 1 to 20 and beyond",
    sentences: [
      {
        it: "Uno, due, tre, quattro, cinque.",
        vi: "Một, hai, ba, bốn, năm.",
        en: "One, two, three, four, five.",
        pronunciation_focus: [
          "due → 'ĐU-ê' (2 âm tiết)",
          "quattro → 'qua-trô', 'tt' giữ lâu",
          "cinque → 'CHIN-quê'",
        ],
        pronunciation_focus_en: [
          "due → 'DOO-eh' — two syllables, not English 'do'",
          "quattro → 'KWAH-troh' — 'qu' is 'kw', double 't' held longer",
          "cinque → 'CHEEN-kweh' — 'ci' is 'ch', 'que' is 'kweh'",
        ],
      },
      {
        it: "Sei, sette, otto, nove, dieci.",
        vi: "Sáu, bảy, tám, chín, mười.",
        en: "Six, seven, eight, nine, ten.",
        pronunciation_focus: [
          "sette/otto → 'tt' đôi",
          "nove → đọc 'e' cuối",
          "dieci → 'điê-chi' (ci = 'chi')",
        ],
        pronunciation_focus_en: [
          "sette / otto → hold the double consonant audibly",
          "nove → 'NOH-veh' — say the final 'e'",
          "dieci → 'DYEH-chee' — 'ci' is 'chee'",
        ],
      },
      {
        it: "Undici, dodici, tredici, quattordici.",
        vi: "Mười một, mười hai, mười ba, mười bốn.",
        en: "Eleven, twelve, thirteen, fourteen.",
        pronunciation_focus: [
          "nhấn đầu: UN-đi-chi",
          "DÔ-đi-chi",
          "TRÊ-đi-chi",
        ],
        pronunciation_focus_en: [
          "stress falls early: UN-dee-chee, DOH-dee-chee, TREH-dee-chee",
          "the '-dici' ending repeats (= '-teen')",
          "don't build them as 'dieci uno' — they're single words",
        ],
      },
      {
        it: "Venti, trenta, quaranta, cento.",
        vi: "Hai mươi, ba mươi, bốn mươi, một trăm.",
        en: "Twenty, thirty, forty, one hundred.",
        pronunciation_focus: [
          "tens là một từ",
          "venti → 'VEN-ti'",
          "cento → 'CHEN-tô'",
        ],
        pronunciation_focus_en: [
          "tens are single words — never 'due dieci' for 20",
          "venti → 'VEN-tee'",
          "cento → 'CHEN-toh' — 'c' before 'e' is 'ch'",
        ],
      },
      {
        it: "Ho ventuno anni. Costa ventotto euro.",
        vi: "Tôi hai mươi mốt tuổi. Giá hai mươi tám euro.",
        en: "I'm twenty-one. It costs twenty-eight euros.",
        pronunciation_focus: [
          "venti bỏ 'i' trước uno/otto",
          "ventuno, ventotto",
          "euro → 'Ê-u-rô'",
        ],
        pronunciation_focus_en: [
          "venti drops its 'i' before 'uno' and 'otto' → ventuno, ventotto",
          "Italian uses 'avere' (ho ... anni) for age, not 'to be'",
          "euro → 'EH-oo-roh'",
        ],
      },
    ],
    cultural_notes_vi:
      "Số đếm tiếng Ý đều đặn và dễ hơn tiếng Pháp nhiều: hàng chục là một từ riêng (venti, trenta, quaranta...) chứ không phải '4 lần 20'. Tuổi tác dùng động từ 'avere' (có): 'Ho venti anni' = 'Tôi CÓ hai mươi tuổi', không phải 'tôi LÀ'. Giá tiền cũng đọc bằng số: 'Costa dieci euro'.",
    cultural_notes_en:
      "Italian numbers are far more regular than French: each ten is its own word (venti, trenta, quaranta...) rather than 'four-twenties'. Age uses the verb 'avere' (to have): 'Ho venti anni' = 'I HAVE twenty years', not 'I am'. Prices are read out as numbers too: 'Costa dieci euro'.",
    tip_advice_vi:
      "Tập đếm to mỗi ngày 1→20, rồi venti/trenta/quaranta. Nhớ luôn đọc đủ nguyên âm cuối ('sette', không 'set'). Khi trả tiền, đọc số tiền bằng tiếng Ý — người Ý rất quý điều đó.",
    tip_advice_en:
      "Count aloud 1→20 daily, then venti/trenta/quaranta. Always sound the final vowel ('sette', not 'set'). When you pay, say the amount in Italian — locals love the effort.",
    l1_notes_vi: [
      {
        mistake: "Đọc 'due' như tiếng Anh 'do'.",
        fix_vi: "'due' có hai âm tiết: 'ĐU-ê'. Phải nghe rõ chữ 'e'.",
      },
      {
        mistake: "Nói 'due dieci' cho số 20.",
        fix_vi: "20 là một từ riêng: 'venti'. Hàng chục đều có từ riêng.",
      },
      {
        mistake: "'Sono venti anni' cho tuổi.",
        fix_vi: "Tuổi dùng 'avere': 'Ho venti anni' (tôi CÓ hai mươi tuổi).",
      },
    ],
    vocabulary: [
      { word: "uno / una", en: "one", vi: "một", pos: "number", pronunciation_vi: "U-nô / U-na — 'un' trước danh từ đực", pronunciation_en: "OO-noh / OO-nah" },
      { word: "cinque", en: "five", vi: "năm", pos: "number", pronunciation_vi: "CHIN-quê", pronunciation_en: "CHEEN-kweh" },
      { word: "dieci", en: "ten", vi: "mười", pos: "number", pronunciation_vi: "ĐIÊ-chi", pronunciation_en: "DYEH-chee" },
      { word: "venti", en: "twenty", vi: "hai mươi", pos: "number", pronunciation_vi: "VEN-ti", pronunciation_en: "VEN-tee" },
      { word: "cento", en: "hundred", vi: "một trăm", pos: "number", pronunciation_vi: "CHEN-tô", pronunciation_en: "CHEN-toh" },
      { word: "mille", en: "thousand", vi: "một nghìn", pos: "number", pronunciation_vi: "MI-lê — 'll' đôi", pronunciation_en: "MEEL-leh" },
      { word: "anni", en: "years (of age)", vi: "tuổi / năm", pos: "noun (m pl)", pronunciation_vi: "A-ni — 'nn' đôi", pronunciation_en: "AH-nee" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Viết số bằng chữ tiếng Ý:",
        instruction_en: "Write the number in Italian words:",
        items: [
          { prompt: "5 = ___", answer: "cinque" },
          { prompt: "11 = ___", answer: "undici" },
          { prompt: "20 = ___", answer: "venti" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý:",
        instruction_en: "Translate into Italian:",
        items: [
          { prompt: "Tôi 21 tuổi.", answer: "Ho ventuno anni." },
          { prompt: "Giá mười euro.", answer: "Costa dieci euro." },
        ],
      },
    ],
  },

  // ── 4. Common survival phrases / questions ─────────────────────────────
  {
    id: "italian_survival_questions",
    level: "A1",
    category: "common_phrases",
    title_vi: "Câu hỏi và câu sinh tồn thiết yếu",
    title_en: "Essential questions and survival phrases",
    sentences: [
      {
        it: "Scusi, dov'è la stazione?",
        vi: "Xin lỗi, nhà ga ở đâu ạ?",
        en: "Excuse me, where is the station?",
        pronunciation_focus: [
          "dov'è → 'đô-VÊ'",
          "stazione → 'xta-TSIÔ-nê'",
          "zione → 'tsiô-nê'",
        ],
        pronunciation_focus_en: [
          "dov'è → 'doh-VEH' — contraction of 'dove è' (where is)",
          "stazione → 'stah-TSYOH-neh' — '-zione' is 'tsyoh-neh'",
          "stress on the second-to-last syllable",
        ],
      },
      {
        it: "Quanto costa?",
        vi: "Cái này giá bao nhiêu?",
        en: "How much does it cost?",
        pronunciation_focus: [
          "quanto → 'QUAN-tô' (kw)",
          "costa → 'CÔ-xta'",
          "đừng nhầm quanto/quando",
        ],
        pronunciation_focus_en: [
          "quanto → 'KWAN-toh' — 'how much'",
          "don't mix up quanto (how much) with quando (when)",
          "costa → 'KOH-stah'",
        ],
      },
      {
        it: "Può parlare lentamente, per favore?",
        vi: "Anh/chị nói chậm lại được không ạ?",
        en: "Can you speak slowly, please?",
        pronunciation_focus: [
          "può → 'puô' (trang trọng)",
          "lentamente → 'len-ta-MEN-tê'",
          "per favore → 'pêr fa-VÔ-rê'",
        ],
        pronunciation_focus_en: [
          "può → 'pwoh' — formal 'can you' (from potere)",
          "lentamente → 'len-tah-MEN-teh' — 'slowly'",
          "a high-value survival line — memorise it whole",
        ],
      },
      {
        it: "Dov'è il bagno?",
        vi: "Nhà vệ sinh ở đâu?",
        en: "Where is the toilet?",
        pronunciation_focus: [
          "bagno → 'BA-nhô' (gn = 'nh')",
          "il = mạo từ đực",
          "dov'è lặp lại",
        ],
        pronunciation_focus_en: [
          "bagno → 'BAH-nyoh' — 'gn' is 'ny' as in 'canyon'",
          "il is the masculine 'the'",
          "reuse 'dov'è ...?' for any 'where is...?'",
        ],
      },
      {
        it: "Non parlo bene italiano. Parla inglese?",
        vi: "Tôi không nói giỏi tiếng Ý. Anh/chị nói tiếng Anh không?",
        en: "I don't speak Italian well. Do you speak English?",
        pronunciation_focus: [
          "non trước động từ",
          "parla → 'PAR-la' (trang trọng)",
          "inglese → 'in-GLÊ-zê'",
        ],
        pronunciation_focus_en: [
          "non goes before the verb (Non parlo...)",
          "parla? → formal 'do you speak?' (informal: parli?)",
          "inglese → 'een-GLEH-zeh' — 's' between vowels is a soft 'z'",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Ý, mở đầu bằng 'Scusi' (xin lỗi) trước khi hỏi là phép lịch sự tối thiểu. Cấu trúc câu hỏi đơn giản: chỉ cần lên giọng cuối câu, không cần đảo trật tự như tiếng Anh ('Parli italiano?'). Từ để hỏi cốt lõi: Chi? (ai), Cosa? (gì), Dove? (đâu), Quando? (khi nào), Quanto? (bao nhiêu), Perché? (tại sao/vì). Lưu ý 'perché' vừa là 'tại sao' vừa là 'bởi vì'.",
    cultural_notes_en:
      "In Italy, opening with 'Scusi' before you ask is basic courtesy. Question structure is simple — just raise your intonation at the end, no word-order inversion like English ('Parli italiano?'). Core question words: Chi? (who), Cosa? (what), Dove? (where), Quando? (when), Quanto? (how much), Perché? (why). Note 'perché' means both 'why' and 'because'.",
    tip_advice_vi:
      "Năm câu này là bộ sinh tồn: 'Scusi, dov'è ___?', 'Quanto costa?', 'Non capisco', 'Può parlare lentamente?', 'Parla inglese?'. Học thuộc trước khi đi Ý. Đừng nhầm 'quanto' (bao nhiêu) với 'quando' (khi nào) — chỉ khác một chữ.",
    tip_advice_en:
      "These five are your survival kit: 'Scusi, dov'è ___?', 'Quanto costa?', 'Non capisco', 'Può parlare lentamente?', 'Parla inglese?'. Memorise them before you travel. Don't confuse 'quanto' (how much) with 'quando' (when) — one letter apart.",
    l1_notes_vi: [
      {
        mistake: "Đảo trật tự kiểu tiếng Anh để hỏi.",
        fix_vi: "Tiếng Ý chỉ lên giọng cuối câu: 'Parli italiano?' — không đảo 'do/does'.",
      },
      {
        mistake: "Nhầm 'quando' (khi nào) với 'quanto' (bao nhiêu).",
        fix_vi: "quanto costa? = giá bao nhiêu. quando vai? = khi nào bạn đi.",
      },
      {
        mistake: "Đặt 'non' sau động từ: 'capisco non'.",
        fix_vi: "Phủ định luôn đặt 'non' TRƯỚC động từ: 'Non capisco'.",
      },
    ],
    vocabulary: [
      { word: "dove", en: "where", vi: "ở đâu", pos: "question word", pronunciation_vi: "ĐÔ-vê", pronunciation_en: "DOH-veh" },
      { word: "quanto", en: "how much", vi: "bao nhiêu", pos: "question word", pronunciation_vi: "QUAN-tô", pronunciation_en: "KWAN-toh" },
      { word: "quando", en: "when", vi: "khi nào", pos: "question word", pronunciation_vi: "QUAN-đô", pronunciation_en: "KWAN-doh" },
      { word: "perché", en: "why / because", vi: "tại sao / bởi vì", pos: "question word", pronunciation_vi: "pêr-CHÊ", pronunciation_en: "pehr-KEH" },
      { word: "il bagno", en: "the toilet / bathroom", vi: "nhà vệ sinh", pos: "noun (m)", pronunciation_vi: "il BA-nhô", pronunciation_en: "eel BAH-nyoh" },
      { word: "la stazione", en: "the station", vi: "nhà ga", pos: "noun (f)", pronunciation_vi: "la xta-TSIÔ-nê", pronunciation_en: "lah stah-TSYOH-neh" },
    ],
    dialogue: [
      { speaker: "A", text: "Scusi, dov'è la stazione?", vi: "Xin lỗi, nhà ga ở đâu ạ?", en: "Excuse me, where is the station?" },
      { speaker: "B", text: "È lì, a sinistra.", vi: "Ở đằng kia, bên trái.", en: "It's over there, on the left." },
      { speaker: "A", text: "Grazie! Può ripetere, per favore?", vi: "Cảm ơn! Anh/chị nhắc lại được không ạ?", en: "Thanks! Can you repeat, please?" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ để hỏi với nghĩa:",
        instruction_en: "Match each question word with its meaning:",
        items: [
          { prompt: "Dove?", answer: "Ở đâu? (where)" },
          { prompt: "Quanto?", answer: "Bao nhiêu? (how much)" },
          { prompt: "Quando?", answer: "Khi nào? (when)" },
          { prompt: "Perché?", answer: "Tại sao? (why)" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý:",
        instruction_en: "Translate into Italian:",
        items: [
          { prompt: "Nhà vệ sinh ở đâu?", answer: "Dov'è il bagno?" },
          { prompt: "Cái này giá bao nhiêu?", answer: "Quanto costa?" },
          { prompt: "Anh/chị nói chậm lại được không?", answer: "Può parlare lentamente, per favore?" },
        ],
      },
    ],
  },

  // ── 5. Basic grammar: essere / avere / gender ──────────────────────────
  {
    id: "italian_grammar_essere_avere",
    level: "A1",
    category: "basic_grammar",
    title_vi: "Ngữ pháp cơ bản: essere, avere và giống",
    title_en: "Basic grammar: essere, avere and gender",
    sentences: [
      {
        it: "Sono stanco. / Sono stanca.",
        vi: "Tôi mệt. (nam / nữ)",
        en: "I'm tired. (male / female speaker)",
        pronunciation_focus: [
          "tính từ hợp giống người nói",
          "stanco (nam) / stanca (nữ)",
          "sono → 'XÔ-nô'",
        ],
        pronunciation_focus_en: [
          "the adjective agrees with the speaker's gender",
          "stanco (man speaking) / stanca (woman speaking)",
          "Vietnamese adjectives never change, so this is easy to forget",
        ],
      },
      {
        it: "Non sono italiano. Sono vietnamita.",
        vi: "Tôi không phải người Ý. Tôi là người Việt.",
        en: "I'm not Italian. I'm Vietnamese.",
        pronunciation_focus: [
          "non + động từ = phủ định",
          "italiano → 'i-ta-LIA-nô'",
          "vietnamita không đổi theo giống",
        ],
        pronunciation_focus_en: [
          "non + verb = negative (non sono = I'm not)",
          "italiano changes by gender; vietnamita does not",
          "put 'non' BEFORE the verb",
        ],
      },
      {
        it: "Ho fame e ho sete.",
        vi: "Tôi đói và khát.",
        en: "I'm hungry and thirsty.",
        pronunciation_focus: [
          "h câm: ho → 'ô'",
          "Ý nói 'có đói / có khát'",
          "fame → 'FA-mê', sete → 'XÊ-tê'",
        ],
        pronunciation_focus_en: [
          "h is silent: ho → 'oh'",
          "Italian literally says 'I have hunger / thirst' (avere, not essere)",
          "fame → 'FAH-meh', sete → 'SEH-teh'",
        ],
      },
      {
        it: "Il libro è nuovo. La casa è grande.",
        vi: "Quyển sách thì mới. Ngôi nhà thì lớn.",
        en: "The book is new. The house is big.",
        pronunciation_focus: [
          "il (đực) / la (cái)",
          "libro đực, casa cái",
          "è (có dấu) = thì/là",
        ],
        pronunciation_focus_en: [
          "il = masculine 'the', la = feminine 'the'",
          "most nouns ending -o are masculine, -a are feminine",
          "è (with accent) = 'is'; e (no accent) = 'and'",
        ],
      },
      {
        it: "Hai un fratello? No, ho una sorella.",
        vi: "Bạn có anh/em trai không? Không, tôi có một chị/em gái.",
        en: "Do you have a brother? No, I have a sister.",
        pronunciation_focus: [
          "hai → 'ai' (h câm)",
          "un (đực) / una (cái)",
          "no đứng đầu câu trả lời",
        ],
        pronunciation_focus_en: [
          "hai → 'eye' — silent h (you have)",
          "un + masculine noun, una + feminine noun",
          "the 'no' answer and the negative 'non' are different words",
        ],
      },
    ],
    cultural_notes_vi:
      "Hai động từ quan trọng nhất của A1 là 'essere' (là/thì) và 'avere' (có). Người Việt hay nhầm vì tiếng Ý dùng 'avere' ở nhiều chỗ tiếng Việt dùng 'là' hoặc trạng thái: tuổi (ho venti anni), đói (ho fame), khát (ho sete), nóng/lạnh (ho caldo/freddo). Mọi danh từ có giống đực (thường kết thúc -o) hoặc cái (thường -a), và mạo từ + tính từ phải hợp giống.",
    cultural_notes_en:
      "The two most important A1 verbs are 'essere' (to be) and 'avere' (to have). Vietnamese speakers mix them up because Italian uses 'avere' where Vietnamese (and English) use 'to be' or a state: age (ho venti anni), hunger (ho fame), thirst (ho sete), hot/cold (ho caldo/freddo). Every noun is masculine (usually ends -o) or feminine (usually -a), and the article + adjective must match its gender.",
    tip_advice_vi:
      "Học thuộc bảng chia essere (sono, sei, è, siamo, siete, sono) và avere (ho, hai, ha, abbiamo, avete, hanno). Nhớ quy tắc 'avere' cho cảm giác cơ thể: đói/khát/nóng/lạnh/tuổi đều là 'ho ...'. Tập học mỗi danh từ KÈM mạo từ: không học 'casa' mà học 'LA casa'.",
    tip_advice_en:
      "Memorise the essere (sono, sei, è, siamo, siete, sono) and avere (ho, hai, ha, abbiamo, avete, hanno) conjugations. Remember the 'avere' rule for bodily states: hungry/thirsty/hot/cold/age are all 'ho ...'. Learn every noun WITH its article — not 'casa' but 'LA casa'.",
    l1_notes_vi: [
      {
        mistake: "'Sono fame' / 'sono venti anni'.",
        fix_vi: "Đói, khát, tuổi dùng 'avere': 'Ho fame', 'Ho venti anni'.",
      },
      {
        mistake: "Dùng một dạng tính từ cho mọi người: 'sono stanco' khi người nói là nữ.",
        fix_vi: "Tính từ hợp giống: nữ nói 'sono stanca', nam nói 'sono stanco'.",
      },
      {
        mistake: "'uno casa' / 'mia padre'.",
        fix_vi: "Mạo từ và tính từ phải hợp giống: 'una casa', 'mio padre', 'mia madre'.",
      },
    ],
    vocabulary: [
      { word: "sono", en: "I am / they are", vi: "tôi là / họ là", pos: "verb (essere)", pronunciation_vi: "XÔ-nô", pronunciation_en: "SOH-noh" },
      { word: "sei", en: "you are (informal)", vi: "bạn là", pos: "verb (essere)", pronunciation_vi: "xei", pronunciation_en: "say" },
      { word: "è", en: "he/she/it is", vi: "anh ấy/cô ấy/nó là", pos: "verb (essere)", pronunciation_vi: "ê (có dấu huyền)", pronunciation_en: "eh" },
      { word: "ho", en: "I have", vi: "tôi có", pos: "verb (avere)", pronunciation_vi: "ô (h câm)", pronunciation_en: "oh (silent h)" },
      { word: "hai", en: "you have (informal)", vi: "bạn có", pos: "verb (avere)", pronunciation_vi: "ai (h câm)", pronunciation_en: "eye" },
      { word: "ha", en: "he/she/it has", vi: "anh ấy/cô ấy có", pos: "verb (avere)", pronunciation_vi: "a (h câm)", pronunciation_en: "ah" },
      { word: "Ho fame", en: "I'm hungry", vi: "tôi đói", pos: "phrase", pronunciation_vi: "ô FA-mê", pronunciation_en: "oh FAH-meh" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền 'sono', 'ho', 'hai' hoặc 'è':",
        instruction_en: "Fill in 'sono', 'ho', 'hai' or 'è':",
        items: [
          { prompt: "___ vietnamita. (tôi là)", answer: "sono" },
          { prompt: "___ fame. (tôi đói)", answer: "ho" },
          { prompt: "La casa ___ grande. (thì)", answer: "è" },
          { prompt: "___ un fratello? (bạn có)", answer: "hai" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý (chú ý giống):",
        instruction_en: "Translate into Italian (mind the gender):",
        items: [
          { prompt: "Tôi không phải người Ý.", answer: "Non sono italiano. / Non sono italiana." },
          { prompt: "Tôi đói và khát.", answer: "Ho fame e ho sete." },
          { prompt: "Tôi có một chị/em gái.", answer: "Ho una sorella." },
        ],
      },
    ],
  },

  // ── 6. Food & ordering ─────────────────────────────────────────────────
  {
    id: "italian_food_ordering",
    level: "A1",
    category: "food",
    title_vi: "Gọi món ở quán ăn",
    title_en: "Ordering food at a café",
    sentences: [
      {
        it: "Un caffè, per favore.",
        vi: "Cho một ly cà phê ạ.",
        en: "A coffee, please.",
        pronunciation_focus: [
          "caffè → 'ca-PHÊ', nhấn cuối",
          "'ff' đôi",
          "un = một (đực)",
        ],
        pronunciation_focus_en: [
          "caffè → 'kahf-FEH' — accent + stress on the last syllable; means espresso",
          "double 'ff' is held; the final è is stressed",
          "un = 'a/one' (masculine)",
        ],
      },
      {
        it: "Vorrei un cornetto e un cappuccino.",
        vi: "Tôi muốn một cái bánh sừng bò và một ly cappuccino.",
        en: "I'd like a croissant and a cappuccino.",
        pronunciation_focus: [
          "vorrei → 'vô-RÊI' (lịch sự)",
          "cornetto → 'cor-NÊT-tô'",
          "cappuccino → 'cap-pu-CHI-nô'",
        ],
        pronunciation_focus_en: [
          "vorrei → 'vor-RAY' — polite 'I would like' (softer than 'voglio')",
          "cornetto → 'kor-NET-toh' — the Italian breakfast croissant",
          "cappuccino → 'kap-poo-CHEE-noh' — 'cci' is 'chee'",
        ],
      },
      {
        it: "Quanto costa? Il conto, per favore.",
        vi: "Bao nhiêu tiền? Cho xin hóa đơn ạ.",
        en: "How much is it? The bill, please.",
        pronunciation_focus: [
          "conto → 'CÔN-tô'",
          "đừng nhầm conto/conte",
          "per favore lịch sự",
        ],
        pronunciation_focus_en: [
          "il conto → 'eel KOHN-toh' — 'the bill'",
          "quanto costa = how much does it cost",
          "Italians don't tip heavily; coperto (cover charge) is often included",
        ],
      },
      {
        it: "Per me, una pizza margherita.",
        vi: "Cho tôi một cái pizza margherita.",
        en: "For me, a margherita pizza.",
        pronunciation_focus: [
          "per me → 'pêr mê'",
          "gh = 'g' cứng",
          "margherita → 'mar-ghê-RI-ta'",
        ],
        pronunciation_focus_en: [
          "per me → 'pehr meh' — 'for me', a natural way to order",
          "gh keeps a HARD 'g' (mar-geh-REE-tah), the 'h' guards the hard sound",
          "margherita honours Queen Margherita — keep it lowercase as a dish",
        ],
      },
      {
        it: "È buonissimo! Grazie.",
        vi: "Ngon tuyệt! Cảm ơn.",
        en: "It's delicious! Thank you.",
        pronunciation_focus: [
          "buonissimo → 'buô-NIS-si-mô'",
          "-issimo = rất",
          "đọc đủ âm cuối -o",
        ],
        pronunciation_focus_en: [
          "buonissimo → 'bwoh-NEES-see-moh' — '-issimo' = 'very/extremely'",
          "from buono (good) → buonissimo (super good)",
          "Italians love this enthusiasm about food — use it",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Ý, 'un caffè' luôn là espresso. Cappuccino chỉ uống buổi sáng — gọi cappuccino sau bữa trưa bị coi là lạ. Đứng uống ở quầy (al banco) rẻ hơn ngồi bàn (al tavolo). 'Vorrei' (tôi muốn) lịch sự hơn 'voglio' (tôi muốn — nghe như ra lệnh). Bữa ăn là thời gian thư giãn; hóa đơn (il conto) chỉ mang ra khi bạn yêu cầu.",
    cultural_notes_en:
      "In Italy, 'un caffè' always means an espresso. Cappuccino is a morning-only drink — ordering one after lunch reads as odd. Drinking standing at the bar (al banco) is cheaper than sitting at a table (al tavolo). 'Vorrei' ('I'd like') is more polite than 'voglio' ('I want', which sounds like an order). The meal is relaxation time; the bill (il conto) only comes when you ask.",
    tip_advice_vi:
      "Kịch bản gọi món: 'Buongiorno' → 'Vorrei ___, per favore' → cuối cùng 'Il conto, per favore'. Dùng 'buonissimo!' khen món ăn — người Ý rất thích. Nhớ phát âm gh là 'g' cứng (spaghetti, margherita).",
    tip_advice_en:
      "Ordering script: 'Buongiorno' → 'Vorrei ___, per favore' → finally 'Il conto, per favore'. Use 'buonissimo!' to praise the food — Italians love it. Remember 'gh' is a hard 'g' (spaghetti, margherita).",
    l1_notes_vi: [
      {
        mistake: "'Voglio un caffè' với giọng cộc lốc.",
        fix_vi: "Dùng 'Vorrei un caffè, per favore' — lịch sự hơn nhiều.",
      },
      {
        mistake: "Đọc 'gh' trong spaghetti như 'g' mềm.",
        fix_vi: "'gh' luôn là 'g' cứng: spa-GHÊT-ti, mar-ghê-RI-ta.",
      },
      {
        mistake: "Nuốt âm cuối: 'buonissim'.",
        fix_vi: "Đọc đủ: 'buô-NIS-si-mô', nghe rõ chữ 'o' cuối.",
      },
    ],
    vocabulary: [
      { word: "il caffè", en: "coffee / espresso", vi: "cà phê", pos: "noun (m)", pronunciation_vi: "il ca-PHÊ", pronunciation_en: "eel kahf-FEH" },
      { word: "vorrei", en: "I would like", vi: "tôi muốn (lịch sự)", pos: "verb (volere)", pronunciation_vi: "vô-RÊI", pronunciation_en: "vor-RAY" },
      { word: "il cornetto", en: "croissant", vi: "bánh sừng bò", pos: "noun (m)", pronunciation_vi: "il cor-NÊT-tô", pronunciation_en: "eel kor-NET-toh" },
      { word: "il conto", en: "the bill", vi: "hóa đơn", pos: "noun (m)", pronunciation_vi: "il CÔN-tô", pronunciation_en: "eel KOHN-toh" },
      { word: "l'acqua", en: "water", vi: "nước", pos: "noun (f)", pronunciation_vi: "LA-qua", pronunciation_en: "LAH-kwah" },
      { word: "buonissimo", en: "delicious", vi: "rất ngon", pos: "adjective", pronunciation_vi: "buô-NIS-si-mô", pronunciation_en: "bwoh-NEES-see-moh" },
    ],
    dialogue: [
      { speaker: "Cameriere", text: "Buongiorno! Cosa prende?", vi: "Chào! Anh/chị dùng gì ạ?", en: "Good morning! What will you have?" },
      { speaker: "Cliente", text: "Vorrei un caffè e un cornetto, per favore.", vi: "Tôi muốn một cà phê và một bánh sừng bò ạ.", en: "I'd like a coffee and a croissant, please." },
      { speaker: "Cameriere", text: "Subito! Altro?", vi: "Ngay đây! Còn gì nữa không ạ?", en: "Right away! Anything else?" },
      { speaker: "Cliente", text: "No, grazie. Il conto, per favore.", vi: "Không, cảm ơn. Cho xin hóa đơn ạ.", en: "No, thanks. The bill, please." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu:",
        instruction_en: "Fill in the missing word:",
        items: [
          { prompt: "___ un caffè, per favore. (tôi muốn)", answer: "Vorrei" },
          { prompt: "Il ___, per favore. (hóa đơn)", answer: "conto" },
          { prompt: "È ___! (rất ngon)", answer: "buonissimo" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý:",
        instruction_en: "Translate into Italian:",
        items: [
          { prompt: "Cho một ly cà phê ạ.", answer: "Un caffè, per favore." },
          { prompt: "Bao nhiêu tiền?", answer: "Quanto costa?" },
          { prompt: "Cho xin hóa đơn ạ.", answer: "Il conto, per favore." },
        ],
      },
    ],
  },

  // ── 7. Family ──────────────────────────────────────────────────────────
  {
    id: "italian_family_intro",
    level: "A1",
    category: "family",
    title_vi: "Giới thiệu gia đình",
    title_en: "Introducing your family",
    sentences: [
      {
        it: "Questa è mia madre, questo è mio padre.",
        vi: "Đây là mẹ tôi, đây là bố tôi.",
        en: "This is my mother, this is my father.",
        pronunciation_focus: [
          "questa (cái) / questo (đực)",
          "madre → 'MA-đrê'",
          "không có mạo từ trước người thân số ít",
        ],
        pronunciation_focus_en: [
          "questa (feminine) / questo (masculine) = 'this'",
          "with singular family nouns the possessive usually has NO article: mia madre",
          "madre → 'MAH-dreh', padre → 'PAH-dreh'",
        ],
      },
      {
        it: "Ho un fratello e una sorella.",
        vi: "Tôi có một anh/em trai và một chị/em gái.",
        en: "I have a brother and a sister.",
        pronunciation_focus: [
          "fratello → 'fra-TÊL-lô' ('ll' đôi)",
          "sorella → 'xô-RÊL-la'",
          "un / una hợp giống",
        ],
        pronunciation_focus_en: [
          "fratello → 'frah-TEL-loh' — hold the double 'll'",
          "sorella → 'soh-REL-lah'",
          "un fratello (m), una sorella (f)",
        ],
      },
      {
        it: "I miei genitori vivono in Vietnam.",
        vi: "Bố mẹ tôi sống ở Việt Nam.",
        en: "My parents live in Vietnam.",
        pronunciation_focus: [
          "danh từ số nhiều có mạo từ: i miei",
          "genitori → 'jê-ni-TÔ-ri'",
          "vivono → 'VI-vô-nô'",
        ],
        pronunciation_focus_en: [
          "PLURAL family nouns DO take the article: i miei genitori",
          "genitori → 'jeh-nee-TOH-ree' (parents)",
          "vivono → 'VEE-voh-noh' (they live)",
        ],
      },
      {
        it: "Mia figlia ha otto anni.",
        vi: "Con gái tôi tám tuổi.",
        en: "My daughter is eight years old.",
        pronunciation_focus: [
          "figlia → 'FI-lia' (gli mềm)",
          "tuổi dùng 'ha ... anni'",
          "mia (cái)",
        ],
        pronunciation_focus_en: [
          "figlia → 'FEE-lyah' — 'gli' is a soft 'ly' sound",
          "age uses avere: ha otto anni = 'has eight years'",
          "mia figlia (no article, singular family noun)",
        ],
      },
      {
        it: "La mia famiglia è grande.",
        vi: "Gia đình tôi đông người.",
        en: "My family is big.",
        pronunciation_focus: [
          "famiglia → 'fa-MI-lia' (gl mềm)",
          "famiglia là ngoại lệ — có mạo từ 'la'",
          "grande → 'GRAN-đê'",
        ],
        pronunciation_focus_en: [
          "famiglia → 'fah-MEE-lyah' — 'gl' is soft 'ly'",
          "famiglia takes the article: 'la mia famiglia' (it's a collective noun)",
          "grande → 'GRAHN-deh' (big)",
        ],
      },
    ],
    cultural_notes_vi:
      "Gia đình rất quan trọng trong văn hóa Ý — nhiều người sống gần bố mẹ, ăn trưa Chủ Nhật cùng nhau. Quy tắc ngữ pháp khó: với người thân SỐ ÍT, sở hữu cách KHÔNG có mạo từ ('mia madre', 'mio fratello'); nhưng với SỐ NHIỀU thì CÓ ('i miei genitori', 'le mie sorelle'). 'Famiglia' là ngoại lệ — luôn có mạo từ ('la mia famiglia'). Tuổi dùng 'avere': 'ha otto anni'.",
    cultural_notes_en:
      "Family is central to Italian culture — many people live near their parents and gather for Sunday lunch. The tricky grammar rule: with SINGULAR family nouns the possessive takes NO article ('mia madre', 'mio fratello'); but with PLURALS it DOES ('i miei genitori', 'le mie sorelle'). 'Famiglia' is an exception — it always keeps the article ('la mia famiglia'). Age uses 'avere': 'ha otto anni'.",
    tip_advice_vi:
      "Nhớ quy tắc: số ít người thân = không mạo từ (mia madre); số nhiều = có mạo từ (i miei genitori). Học mỗi danh từ kèm mạo từ và sở hữu: 'mio padre', 'mia madre'. Tuổi luôn 'avere': 'Mio figlio HA cinque anni'.",
    tip_advice_en:
      "Remember: singular family member = no article (mia madre); plural = with article (i miei genitori). Learn each noun with its possessive: 'mio padre', 'mia madre'. Age is always 'avere': 'Mio figlio HA cinque anni'.",
    l1_notes_vi: [
      {
        mistake: "'la mia madre' (thêm mạo từ với người thân số ít).",
        fix_vi: "Số ít người thân không có mạo từ: 'mia madre', 'mio padre'.",
      },
      {
        mistake: "'mio sorella' / 'mia padre' (sai giống).",
        fix_vi: "Sở hữu hợp giống: 'mia sorella' (cái), 'mio padre' (đực).",
      },
      {
        mistake: "'Mia figlia è otto anni'.",
        fix_vi: "Tuổi dùng 'avere': 'Mia figlia HA otto anni'.",
      },
    ],
    vocabulary: [
      { word: "la madre", en: "mother", vi: "mẹ", pos: "noun (f)", pronunciation_vi: "la MA-đrê", pronunciation_en: "lah MAH-dreh" },
      { word: "il padre", en: "father", vi: "bố", pos: "noun (m)", pronunciation_vi: "il PA-đrê", pronunciation_en: "eel PAH-dreh" },
      { word: "il fratello", en: "brother", vi: "anh/em trai", pos: "noun (m)", pronunciation_vi: "il fra-TÊL-lô", pronunciation_en: "eel frah-TEL-loh" },
      { word: "la sorella", en: "sister", vi: "chị/em gái", pos: "noun (f)", pronunciation_vi: "la xô-RÊL-la", pronunciation_en: "lah soh-REL-lah" },
      { word: "i genitori", en: "parents", vi: "bố mẹ", pos: "noun (m pl)", pronunciation_vi: "i jê-ni-TÔ-ri", pronunciation_en: "ee jeh-nee-TOH-ree" },
      { word: "la famiglia", en: "family", vi: "gia đình", pos: "noun (f)", pronunciation_vi: "la fa-MI-lia", pronunciation_en: "lah fah-MEE-lyah" },
      { word: "il figlio / la figlia", en: "son / daughter", vi: "con trai / con gái", pos: "noun", pronunciation_vi: "FI-liô / FI-lia", pronunciation_en: "FEE-lyoh / FEE-lyah" },
    ],
    dialogue: [
      { speaker: "A", text: "Hai fratelli o sorelle?", vi: "Bạn có anh chị em không?", en: "Do you have brothers or sisters?" },
      { speaker: "B", text: "Sì, ho un fratello e una sorella.", vi: "Có, tôi có một anh trai và một em gái.", en: "Yes, I have a brother and a sister." },
      { speaker: "A", text: "E i tuoi genitori?", vi: "Còn bố mẹ bạn?", en: "And your parents?" },
      { speaker: "B", text: "I miei genitori vivono a Hanoi.", vi: "Bố mẹ tôi sống ở Hà Nội.", en: "My parents live in Hanoi." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền sở hữu đúng (mio / mia / i miei):",
        instruction_en: "Fill in the right possessive (mio / mia / i miei):",
        items: [
          { prompt: "___ madre è gentile.", answer: "mia" },
          { prompt: "___ padre lavora.", answer: "mio" },
          { prompt: "___ genitori vivono in Vietnam.", answer: "i miei" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý:",
        instruction_en: "Translate into Italian:",
        items: [
          { prompt: "Đây là mẹ tôi.", answer: "Questa è mia madre." },
          { prompt: "Tôi có một anh/em trai.", answer: "Ho un fratello." },
          { prompt: "Con gái tôi tám tuổi.", answer: "Mia figlia ha otto anni." },
        ],
      },
    ],
  },

  // ── 8. Time ────────────────────────────────────────────────────────────
  {
    id: "italian_telling_time",
    level: "A1",
    category: "time",
    title_vi: "Xem giờ và các ngày trong tuần",
    title_en: "Telling time and the days of the week",
    sentences: [
      {
        it: "Che ora è? Sono le otto.",
        vi: "Mấy giờ rồi? Bây giờ là 8 giờ.",
        en: "What time is it? It's eight o'clock.",
        pronunciation_focus: [
          "che ora è → 'kê Ô-ra ê'",
          "phần lớn giờ dùng 'sono le'",
          "otto → 'ÔT-tô'",
        ],
        pronunciation_focus_en: [
          "che ora è → 'keh OH-rah eh' (singular 'ora')",
          "most hours use the plural 'sono le ...' (sono le otto)",
          "stress: SO-no le OT-to",
        ],
      },
      {
        it: "È l'una. È mezzogiorno.",
        vi: "Bây giờ là 1 giờ. Bây giờ là 12 giờ trưa.",
        en: "It's one o'clock. It's midday.",
        pronunciation_focus: [
          "1 giờ là số ít: 'è l'una'",
          "mezzogiorno → 'mê-tsô-JOR-nô'",
          "zz → 'ts'",
        ],
        pronunciation_focus_en: [
          "one o'clock is singular: 'è l'una' (not 'sono le una')",
          "mezzogiorno → 'med-dzoh-JOR-noh' — midday",
          "'zz' is a sharp 'ts/dz' sound",
        ],
      },
      {
        it: "Sono le otto e dieci.",
        vi: "8 giờ 10 phút.",
        en: "It's ten past eight.",
        pronunciation_focus: [
          "e nối giờ + phút",
          "đọc thẳng giờ rồi phút",
          "dieci → 'điê-chi'",
        ],
        pronunciation_focus_en: [
          "'e' joins hour + minutes (le otto E dieci = 8 and 10)",
          "say hour first, then minutes — no 'past/to' word needed for early minutes",
          "dieci → 'DYEH-chee'",
        ],
      },
      {
        it: "Oggi è lunedì, domani è martedì.",
        vi: "Hôm nay là thứ Hai, ngày mai là thứ Ba.",
        en: "Today is Monday, tomorrow is Tuesday.",
        pronunciation_focus: [
          "thứ trong tuần viết thường",
          "lunedì nhấn cuối: lu-nê-ĐI",
          "đừng nhầm domani / domenica",
        ],
        pronunciation_focus_en: [
          "weekdays are lowercase in Italian",
          "lunedì → 'loo-neh-DEE' — final-syllable stress (the accent shows it)",
          "don't confuse domani (tomorrow) with domenica (Sunday)",
        ],
      },
      {
        it: "Il fine settimana riposo.",
        vi: "Cuối tuần tôi nghỉ ngơi.",
        en: "On the weekend I rest.",
        pronunciation_focus: [
          "settimana → 'xêt-ti-MA-na'",
          "fine settimana = cuối tuần",
          "riposo → 'ri-PÔ-zô'",
        ],
        pronunciation_focus_en: [
          "settimana → 'set-tee-MAH-nah' — week (double 'tt')",
          "il fine settimana = the weekend",
          "riposo → 'ree-POH-zoh' — 's' between vowels softens to 'z'",
        ],
      },
    ],
    cultural_notes_vi:
      "Người Ý dùng 'sono le ...' cho hầu hết các giờ (số nhiều), nhưng 1 giờ, 12 giờ trưa, 12 giờ đêm là số ít: 'è l'una', 'è mezzogiorno', 'è mezzanotte'. Lịch chính thức và giờ tàu xe thường dùng hệ 24 giờ (le quattordici = 14h). Thứ trong tuần và tháng viết THƯỜNG, không viết hoa như tiếng Anh. Tuần của người Ý bắt đầu từ thứ Hai.",
    cultural_notes_en:
      "Italians use 'sono le ...' for most hours (plural), but 1 o'clock, midday and midnight are singular: 'è l'una', 'è mezzogiorno', 'è mezzanotte'. Official schedules and transport use the 24-hour clock (le quattordici = 2 PM). Weekdays and months are LOWERCASE, unlike English. The Italian week starts on Monday.",
    tip_advice_vi:
      "Mẫu câu: hỏi 'Che ora è?', trả lời 'Sono le ___' (hoặc 'È l'una' cho 1 giờ). Nhớ thứ trong tuần nhấn âm cuối có dấu (lunedì, martedì...) trừ 'sabato' và 'domenica'. Đừng nhầm 'domani' (ngày mai) với 'domenica' (Chủ Nhật).",
    tip_advice_en:
      "Pattern: ask 'Che ora è?', answer 'Sono le ___' (or 'È l'una' for 1 o'clock). Most weekdays stress the accented final syllable (lunedì, martedì...) except 'sabato' and 'domenica'. Don't confuse 'domani' (tomorrow) with 'domenica' (Sunday).",
    l1_notes_vi: [
      {
        mistake: "'Sono le una' cho 1 giờ.",
        fix_vi: "1 giờ là số ít: 'È l'una'. Chỉ từ 2 giờ trở lên mới 'sono le'.",
      },
      {
        mistake: "Viết hoa 'Lunedì' giữa câu kiểu tiếng Anh.",
        fix_vi: "Thứ trong tuần viết thường: 'Oggi è lunedì'.",
      },
      {
        mistake: "Nhầm 'domani' (ngày mai) với 'domenica' (Chủ Nhật).",
        fix_vi: "domani = ngày mai; domenica = Chủ Nhật. Hai từ khác nhau.",
      },
    ],
    vocabulary: [
      { word: "Che ora è?", en: "What time is it?", vi: "Mấy giờ rồi?", pos: "phrase", pronunciation_vi: "kê Ô-ra ê", pronunciation_en: "keh OH-rah eh" },
      { word: "mezzogiorno", en: "midday", vi: "12 giờ trưa", pos: "noun (m)", pronunciation_vi: "mê-tsô-JOR-nô", pronunciation_en: "med-dzoh-JOR-noh" },
      { word: "mezzanotte", en: "midnight", vi: "12 giờ đêm", pos: "noun (f)", pronunciation_vi: "mê-tsa-NÔT-tê", pronunciation_en: "med-dzah-NOT-teh" },
      { word: "lunedì", en: "Monday", vi: "thứ Hai", pos: "noun (m)", pronunciation_vi: "lu-nê-ĐI", pronunciation_en: "loo-neh-DEE" },
      { word: "domenica", en: "Sunday", vi: "Chủ nhật", pos: "noun (f)", pronunciation_vi: "đô-MÊ-ni-ca", pronunciation_en: "doh-MEH-nee-kah" },
      { word: "oggi", en: "today", vi: "hôm nay", pos: "adverb", pronunciation_vi: "ÔD-ji ('gg' mạnh)", pronunciation_en: "OD-jee" },
      { word: "domani", en: "tomorrow", vi: "ngày mai", pos: "adverb", pronunciation_vi: "đô-MA-ni", pronunciation_en: "doh-MAH-nee" },
    ],
    dialogue: [
      { speaker: "A", text: "Scusi, che ora è?", vi: "Xin lỗi, mấy giờ rồi ạ?", en: "Excuse me, what time is it?" },
      { speaker: "B", text: "Sono le tre e mezza.", vi: "Ba giờ rưỡi.", en: "It's half past three." },
      { speaker: "A", text: "Grazie! Che giorno è oggi?", vi: "Cảm ơn! Hôm nay thứ mấy?", en: "Thanks! What day is it today?" },
      { speaker: "B", text: "Oggi è venerdì.", vi: "Hôm nay là thứ Sáu.", en: "Today is Friday." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền 'sono le' hoặc 'è':",
        instruction_en: "Fill in 'sono le' or 'è':",
        items: [
          { prompt: "___ otto.", answer: "sono le" },
          { prompt: "___ l'una.", answer: "è" },
          { prompt: "___ mezzogiorno.", answer: "è" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý:",
        instruction_en: "Translate into Italian:",
        items: [
          { prompt: "Mấy giờ rồi?", answer: "Che ora è?" },
          { prompt: "Bây giờ là 8 giờ 10.", answer: "Sono le otto e dieci." },
          { prompt: "Hôm nay là thứ Hai.", answer: "Oggi è lunedì." },
        ],
      },
    ],
  },

  // ── 9. Daily routine ───────────────────────────────────────────────────
  {
    id: "italian_daily_routine",
    level: "A1",
    category: "daily_routine",
    title_vi: "Sinh hoạt hàng ngày",
    title_en: "Daily routine",
    sentences: [
      {
        it: "Mi sveglio alle sei.",
        vi: "Tôi thức dậy lúc 6 giờ.",
        en: "I wake up at six.",
        pronunciation_focus: [
          "động từ phản thân: mi sveglio",
          "sveglio → 'ZVÊ-liô' (gli mềm)",
          "alle = a + le (lúc)",
        ],
        pronunciation_focus_en: [
          "reflexive verb: mi sveglio (I wake myself)",
          "sveglio → 'ZVEH-lyoh' — 'gli' is soft 'ly'",
          "alle = 'a + le' → 'at' (a time)",
        ],
      },
      {
        it: "Faccio colazione alle sette.",
        vi: "Tôi ăn sáng lúc 7 giờ.",
        en: "I have breakfast at seven.",
        pronunciation_focus: [
          "faccio → 'FA-chô' (cc trước i = 'ch')",
          "fare colazione = ăn sáng",
          "alle sette",
        ],
        pronunciation_focus_en: [
          "faccio → 'FAH-choh' — 'cci' is 'ch'",
          "'fare colazione' (literally 'make breakfast') = to have breakfast",
          "alle sette → 'at seven'",
        ],
      },
      {
        it: "Vado al lavoro alle otto.",
        vi: "Tôi đi làm lúc 8 giờ.",
        en: "I go to work at eight.",
        pronunciation_focus: [
          "vado → 'VA-đô' (bất quy tắc)",
          "al = a + il",
          "lavoro → 'la-VÔ-rô'",
        ],
        pronunciation_focus_en: [
          "vado → 'VAH-doh' — irregular 'I go' (not 'ando')",
          "al lavoro = 'a + il lavoro' → 'to work'",
          "lavoro → 'lah-VOH-roh'",
        ],
      },
      {
        it: "Pranzo a mezzogiorno e ceno la sera.",
        vi: "Tôi ăn trưa lúc 12 giờ và ăn tối vào buổi tối.",
        en: "I have lunch at midday and dinner in the evening.",
        pronunciation_focus: [
          "pranzo → 'PRAN-tsô'",
          "ceno → 'CHÊ-nô'",
          "la sera = buổi tối (có mạo từ)",
        ],
        pronunciation_focus_en: [
          "pranzo → 'PRAN-tsoh' — lunch (verb pranzare)",
          "ceno → 'CHEH-noh' — 'I dine' (cenare)",
          "time-of-day phrases take the article: la sera",
        ],
      },
      {
        it: "La sera mi riposo e vado a letto tardi.",
        vi: "Buổi tối tôi nghỉ ngơi và đi ngủ muộn.",
        en: "In the evening I rest and go to bed late.",
        pronunciation_focus: [
          "mi riposo (phản thân)",
          "vado a letto = đi ngủ",
          "tardi → 'TAR-đi'",
        ],
        pronunciation_focus_en: [
          "mi riposo → reflexive 'I rest myself'",
          "'andare a letto' = to go to bed",
          "tardi → 'TAR-dee' (late); presto = early",
        ],
      },
    ],
    cultural_notes_vi:
      "Người Ý ăn sáng nhẹ (cà phê + cornetto), ăn trưa (pranzo) là bữa chính khoảng 13h, và ăn tối (cena) muộn — thường sau 20h. Nhiều cửa hàng nhỏ đóng cửa nghỉ trưa (pausa pranzo) khoảng 13h–16h. Động từ phản thân (mi sveglio, mi riposo) rất quan trọng để nói về sinh hoạt — tiếng Việt không có 'tôi tự...' nên dễ quên đại từ 'mi/ti/si'.",
    cultural_notes_en:
      "Italians eat a light breakfast (coffee + cornetto), a main lunch (pranzo) around 1 PM, and a late dinner (cena) — often after 8 PM. Many small shops close for a lunch break (pausa pranzo) roughly 1–4 PM. Reflexive verbs (mi sveglio, mi riposo) are key for talking about your routine — Vietnamese has no 'I myself...' construction, so the 'mi/ti/si' pronoun is easy to drop.",
    tip_advice_vi:
      "Tập kể một ngày trước gương: 'Mi sveglio alle sei, faccio colazione, vado al lavoro...'. Nhớ đại từ phản thân 'mi' cho động từ như svegliarsi, riposarsi. Dùng 'alle + giờ' để nói 'lúc mấy giờ' (alle otto = lúc 8 giờ).",
    tip_advice_en:
      "Practise narrating your day in the mirror: 'Mi sveglio alle sei, faccio colazione, vado al lavoro...'. Keep the reflexive 'mi' for verbs like svegliarsi, riposarsi. Use 'alle + hour' for 'at (a time)' (alle otto = at eight).",
    l1_notes_vi: [
      {
        mistake: "Bỏ đại từ phản thân: 'sveglio alle sei'.",
        fix_vi: "Động từ phản thân cần 'mi': 'MI sveglio alle sei'.",
      },
      {
        mistake: "'a otto' thay vì 'alle otto'.",
        fix_vi: "Giờ dùng 'a + le = alle': 'alle otto', 'alle sette'.",
      },
      {
        mistake: "'vado a lavoro' bỏ mạo từ.",
        fix_vi: "Chuẩn A1: 'vado AL lavoro' (a + il = al).",
      },
    ],
    vocabulary: [
      { word: "svegliarsi", en: "to wake up", vi: "thức dậy", pos: "verb (reflexive)", pronunciation_vi: "zvê-LIAR-xi", pronunciation_en: "zveh-LYAR-see" },
      { word: "fare colazione", en: "to have breakfast", vi: "ăn sáng", pos: "phrase", pronunciation_vi: "FA-rê cô-la-TSIÔ-nê", pronunciation_en: "FAH-reh koh-lah-TSYOH-neh" },
      { word: "il lavoro", en: "work / job", vi: "công việc", pos: "noun (m)", pronunciation_vi: "il la-VÔ-rô", pronunciation_en: "eel lah-VOH-roh" },
      { word: "il pranzo", en: "lunch", vi: "bữa trưa", pos: "noun (m)", pronunciation_vi: "il PRAN-tsô", pronunciation_en: "eel PRAN-tsoh" },
      { word: "la cena", en: "dinner", vi: "bữa tối", pos: "noun (f)", pronunciation_vi: "la CHÊ-na", pronunciation_en: "lah CHEH-nah" },
      { word: "riposarsi", en: "to rest", vi: "nghỉ ngơi", pos: "verb (reflexive)", pronunciation_vi: "ri-pô-XAR-xi", pronunciation_en: "ree-poh-ZAR-see" },
    ],
    dialogue: [
      { speaker: "A", text: "A che ora ti svegli?", vi: "Bạn thức dậy lúc mấy giờ?", en: "What time do you wake up?" },
      { speaker: "B", text: "Mi sveglio alle sei e mezza.", vi: "Tôi dậy lúc sáu rưỡi.", en: "I wake up at half past six." },
      { speaker: "A", text: "E poi?", vi: "Rồi sao nữa?", en: "And then?" },
      { speaker: "B", text: "Faccio colazione e vado al lavoro.", vi: "Tôi ăn sáng và đi làm.", en: "I have breakfast and go to work." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền đại từ phản thân hoặc giới từ đúng:",
        instruction_en: "Fill in the right reflexive pronoun or preposition:",
        items: [
          { prompt: "___ sveglio alle sei. (tôi)", answer: "Mi" },
          { prompt: "Vado ___ lavoro. (a + il)", answer: "al" },
          { prompt: "Mi sveglio ___ sette. (a + le)", answer: "alle" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý:",
        instruction_en: "Translate into Italian:",
        items: [
          { prompt: "Tôi thức dậy lúc 6 giờ.", answer: "Mi sveglio alle sei." },
          { prompt: "Tôi đi làm lúc 8 giờ.", answer: "Vado al lavoro alle otto." },
          { prompt: "Buổi tối tôi nghỉ ngơi.", answer: "La sera mi riposo." },
        ],
      },
    ],
  },

  // ── 10. Places & getting around ────────────────────────────────────────
  {
    id: "italian_places_directions",
    level: "A1",
    category: "places",
    title_vi: "Địa điểm và đi lại",
    title_en: "Places and getting around",
    sentences: [
      {
        it: "Vado a scuola in autobus.",
        vi: "Tôi đi học bằng xe buýt.",
        en: "I go to school by bus.",
        pronunciation_focus: [
          "a scuola (a + thành phố/nơi)",
          "autobus → 'AU-tô-bus'",
          "in + phương tiện",
        ],
        pronunciation_focus_en: [
          "vado a scuola — 'a' before scuola",
          "autobus → 'OW-toh-boos'",
          "use 'in' for means of transport (in autobus, in treno)",
        ],
      },
      {
        it: "La banca è vicino al supermercato.",
        vi: "Ngân hàng ở gần siêu thị.",
        en: "The bank is near the supermarket.",
        pronunciation_focus: [
          "vicino a = gần",
          "al = a + il",
          "supermercato → 'su-pêr-mêr-CA-tô'",
        ],
        pronunciation_focus_en: [
          "vicino a = 'near to'",
          "al supermercato = 'a + il' → 'to/at the supermarket'",
          "banca → 'BAHN-kah' — 'c' before 'a' is hard 'k'",
        ],
      },
      {
        it: "Dov'è la fermata dell'autobus?",
        vi: "Trạm xe buýt ở đâu?",
        en: "Where is the bus stop?",
        pronunciation_focus: [
          "fermata → 'fêr-MA-ta'",
          "dell' = di + la (rút gọn)",
          "dov'è lặp lại",
        ],
        pronunciation_focus_en: [
          "fermata → 'fer-MAH-tah' — (bus) stop",
          "dell' = 'di + la' elided before a vowel",
          "reuse 'dov'è ...?' for any 'where is...'",
        ],
      },
      {
        it: "Giri a destra, poi vada dritto.",
        vi: "Rẽ phải, rồi đi thẳng.",
        en: "Turn right, then go straight.",
        pronunciation_focus: [
          "giri → 'JI-ri' (gi mềm)",
          "a destra / a sinistra",
          "dritto → 'ĐRIT-tô'",
        ],
        pronunciation_focus_en: [
          "giri → 'JEE-ree' — soft 'j' (formal command 'turn')",
          "a destra (right) / a sinistra (left)",
          "dritto → 'DREET-toh' — straight ahead",
        ],
      },
      {
        it: "È lontano? No, è qui vicino.",
        vi: "Có xa không? Không, ở gần đây thôi.",
        en: "Is it far? No, it's nearby.",
        pronunciation_focus: [
          "lontano → 'lôn-TA-nô'",
          "qui → 'qui' (kw)",
          "vicino → 'vi-CHI-nô'",
        ],
        pronunciation_focus_en: [
          "lontano → 'lon-TAH-noh' (far) ↔ vicino (near)",
          "qui → 'kwee' — here",
          "vicino → 'vee-CHEE-noh' — 'ci' is 'chee'",
        ],
      },
    ],
    cultural_notes_vi:
      "Để đi lại, nhớ hai quy tắc giới từ: 'a' + nơi chốn/thành phố (a scuola, a Roma), 'in' + phương tiện (in autobus, in treno, in macchina). Giới từ thường kết hợp với mạo từ: a+il=al, a+la=alla, di+la=della. Ở Ý nhiều thị trấn nhỏ đi bộ được; vé xe buýt phải bấm máy (timbrare) khi lên xe nếu không bị phạt. Hỏi đường: 'Scusi, dov'è ___?' là câu vạn năng.",
    cultural_notes_en:
      "For getting around, remember two preposition rules: 'a' + place/city (a scuola, a Roma), 'in' + means of transport (in autobus, in treno, in macchina). Prepositions fuse with the article: a+il=al, a+la=alla, di+la=della. Many Italian towns are walkable; you must validate (timbrare) your bus ticket when boarding or risk a fine. Asking directions: 'Scusi, dov'è ___?' is the all-purpose line.",
    tip_advice_vi:
      "Học bộ giới từ kết hợp: al (a+il), alla (a+la), della (di+la). Nhớ 'a' cho nơi chốn, 'in' cho phương tiện. Câu hỏi đường cốt lõi: 'Scusi, dov'è ___?' + 'a destra / a sinistra / dritto'. Cặp đối lập: vicino (gần) ↔ lontano (xa).",
    tip_advice_en:
      "Learn the fused prepositions: al (a+il), alla (a+la), della (di+la). Remember 'a' for places, 'in' for transport. Core direction question: 'Scusi, dov'è ___?' + 'a destra / a sinistra / dritto'. Opposite pair: vicino (near) ↔ lontano (far).",
    l1_notes_vi: [
      {
        mistake: "'vado in scuola' / 'vado a autobus'.",
        fix_vi: "Nơi chốn dùng 'a' (a scuola); phương tiện dùng 'in' (in autobus).",
      },
      {
        mistake: "'a il supermercato' không rút gọn.",
        fix_vi: "Bắt buộc rút gọn: a + il = 'al supermercato'.",
      },
      {
        mistake: "Đọc 'c' trong 'vicino' thành 'k'.",
        fix_vi: "'ci' luôn là 'chi': vi-CHI-nô. Nhưng 'banca' là 'BAN-ca' (k).",
      },
    ],
    vocabulary: [
      { word: "la scuola", en: "school", vi: "trường học", pos: "noun (f)", pronunciation_vi: "la XCUÔ-la", pronunciation_en: "lah SKWOH-lah" },
      { word: "l'autobus", en: "bus", vi: "xe buýt", pos: "noun (m)", pronunciation_vi: "LAU-tô-bus", pronunciation_en: "LOW-toh-boos" },
      { word: "la fermata", en: "(bus) stop", vi: "trạm xe", pos: "noun (f)", pronunciation_vi: "la fêr-MA-ta", pronunciation_en: "lah fer-MAH-tah" },
      { word: "a destra", en: "to the right", vi: "bên phải", pos: "phrase", pronunciation_vi: "a ĐÊ-xtra", pronunciation_en: "ah DEH-strah" },
      { word: "a sinistra", en: "to the left", vi: "bên trái", pos: "phrase", pronunciation_vi: "a xi-NI-xtra", pronunciation_en: "ah see-NEE-strah" },
      { word: "vicino", en: "near", vi: "gần", pos: "adjective/adverb", pronunciation_vi: "vi-CHI-nô", pronunciation_en: "vee-CHEE-noh" },
      { word: "lontano", en: "far", vi: "xa", pos: "adjective/adverb", pronunciation_vi: "lôn-TA-nô", pronunciation_en: "lon-TAH-noh" },
    ],
    dialogue: [
      { speaker: "A", text: "Scusi, dov'è la stazione?", vi: "Xin lỗi, nhà ga ở đâu ạ?", en: "Excuse me, where is the station?" },
      { speaker: "B", text: "Giri a destra e vada dritto.", vi: "Rẽ phải rồi đi thẳng.", en: "Turn right and go straight." },
      { speaker: "A", text: "È lontano?", vi: "Có xa không ạ?", en: "Is it far?" },
      { speaker: "B", text: "No, è qui vicino. Cinque minuti.", vi: "Không, gần đây thôi. Năm phút.", en: "No, it's nearby. Five minutes." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền 'a' hoặc 'in':",
        instruction_en: "Fill in 'a' or 'in':",
        items: [
          { prompt: "Vado ___ scuola.", answer: "a" },
          { prompt: "Vado ___ autobus.", answer: "in" },
          { prompt: "Vado ___ Roma.", answer: "a" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý:",
        instruction_en: "Translate into Italian:",
        items: [
          { prompt: "Trạm xe buýt ở đâu?", answer: "Dov'è la fermata dell'autobus?" },
          { prompt: "Rẽ phải, rồi đi thẳng.", answer: "Giri a destra, poi vada dritto." },
          { prompt: "Có xa không?", answer: "È lontano?" },
        ],
      },
    ],
  },
];

export default lessons;
