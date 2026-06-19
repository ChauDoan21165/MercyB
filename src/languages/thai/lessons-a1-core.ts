// src/languages/thai/lessons-a1-core.ts
//
// Thai CEFR A1 "core" lesson batch for Vietnamese-speaking and
// English-speaking learners.
//
// This module is intentionally SELF-CONTAINED: it declares its own types
// inline and exports the A1 data array. It deliberately does NOT wire into
// the Thai vertical's foundation/index/normalize layer (none exists yet for
// Thai, and editing those is out of scope for this batch).
//
// Vietnamese-first: every line carries a Vietnamese meaning (`vi`) and a
// Vietnamese-tuned pronunciation note. English explanations (`en`) ride
// alongside for the secondary EN audience. Thai script is the source of
// truth; `rtgs` is a practical romanization (loosely RTGS, with tone hints
// where they help a tonal-language speaker).
//
// NOTE: Content is hand-authored from standard A1 survival material.
// Native-speaker review is DEFERRED — this batch does NOT claim native
// review. Treat romanization/tone marks as a learning aid pending review.

// ── Types (inline — Thai vertical has no shared ./lessons registry yet) ────

export type ThaiCategoryId =
  | "greetings"
  | "particles"
  | "pronouns"
  | "yes_no"
  | "numbers"
  | "food_drink"
  | "buying"
  | "directions"
  | "time_day"
  | "basic_verbs"
  | "polite_requests"
  | "introductions";

export type ThaiCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ThaiLessonSentence = {
  /** Thai target sentence (the line the learner speaks). */
  th: string;
  /** Practical romanization (loose RTGS, tone hints where useful). */
  rtgs: string;
  /** Vietnamese meaning. */
  vi: string;
  /** English meaning, for the secondary EN audience. */
  en: string;
  /** Pronunciation / tone focus, written for a Vietnamese ear. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same intent. */
  pronunciation_focus_en?: string[];
};

export type ThaiVocabEntry = {
  /** Thai word. */
  word: string;
  rtgs: string;
  vi: string;
  en: string;
  pos: string;
};

export type ThaiDialogueLine = {
  speaker: string;
  th: string;
  rtgs: string;
  vi: string;
  en: string;
};

/** A Vietnamese-speaker L1-interference note: the mistake + the fix. */
export type ThaiL1Note = {
  /** The wrong form a Vietnamese learner tends to produce. */
  mistake: string;
  /** Why it happens / the correct form, in Vietnamese. */
  fix_vi: string;
  /** Same note for the English audience. */
  fix_en: string;
};

// Loosely typed so per-type practice fields can vary
// (fill_blank / matching / translation / speaking).
export type ThaiExercise = Record<string, unknown>;

export type ThaiLesson = {
  id: string;
  level: ThaiCefrLevel;
  category: ThaiCategoryId;
  title_vi: string;
  title_en: string;
  sentences: ThaiLessonSentence[];
  cultural_notes_vi?: string;
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
  l1_notes_vi?: ThaiL1Note[];
  vocabulary: ThaiVocabEntry[];
  dialogue: ThaiDialogueLine[];
  /** Practice prompts. */
  exercises: ThaiExercise[];
};

// ── A1 core lessons ────────────────────────────────────────────────────────

export const lessons: ThaiLesson[] = [
  // ── 1. Greetings ─────────────────────────────────────────────────────────
  {
    id: "thai_a1_greetings",
    level: "A1",
    category: "greetings",
    title_vi: "Chào hỏi cơ bản",
    title_en: "Basic greetings",
    sentences: [
      {
        th: "สวัสดีครับ / สวัสดีค่ะ",
        rtgs: "sà-wàt-dii khráp / sà-wàt-dii khâ",
        vi: "Xin chào (nam nói 'khráp', nữ nói 'khâ').",
        en: "Hello (men say 'khráp', women say 'khâ').",
        pronunciation_focus: [
          "สวัสดี → sà-wàt-dii, thường nói gọn thành 'sa-wat-dii'",
          "Người Việt: 'sà' và 'wàt' đọc thanh thấp như dấu huyền nhẹ",
        ],
        pronunciation_focus_en: [
          "สวัสดี → 'sa-wat-dee'; in fast speech the middle often drops",
          "Keep 'dii' long and level, not clipped",
        ],
      },
      {
        th: "สบายดีไหม",
        rtgs: "sà-baai-dii mǎi",
        vi: "Bạn khỏe không?",
        en: "How are you?",
        pronunciation_focus: [
          "ไหม (mǎi) là từ hỏi cuối câu, đọc thanh lên (như dấu hỏi)",
        ],
        pronunciation_focus_en: [
          "ไหม (mǎi) is the rising-tone yes/no question word at the end",
        ],
      },
      {
        th: "สบายดี ขอบคุณ",
        rtgs: "sà-baai-dii, khɔ̀ɔp-khun",
        vi: "Khỏe, cảm ơn.",
        en: "I'm fine, thank you.",
        pronunciation_focus: [
          "ขอบคุณ → 'khọp-khun', đừng đọc thành 'cọp'",
        ],
        pronunciation_focus_en: ["ขอบคุณ → 'kòp-kun', soft final 'p'"],
      },
      {
        th: "ลาก่อน / แล้วเจอกัน",
        rtgs: "laa-gɔ̀ɔn / lɛ́ɛo jəə gan",
        vi: "Tạm biệt / Hẹn gặp lại.",
        en: "Goodbye / See you later.",
        pronunciation_focus: ["แล้วเจอกัน thân mật hơn, dùng với bạn bè"],
        pronunciation_focus_en: ["แล้วเจอกัน is the casual 'see you'"],
      },
    ],
    vocabulary: [
      { word: "สวัสดี", rtgs: "sà-wàt-dii", vi: "xin chào", en: "hello", pos: "interjection" },
      { word: "สบายดี", rtgs: "sà-baai-dii", vi: "khỏe / ổn", en: "fine, well", pos: "adjective" },
      { word: "ไหม", rtgs: "mǎi", vi: "không? (từ hỏi)", en: "yes/no question word", pos: "particle" },
      { word: "ขอบคุณ", rtgs: "khɔ̀ɔp-khun", vi: "cảm ơn", en: "thank you", pos: "phrase" },
      { word: "ลาก่อน", rtgs: "laa-gɔ̀ɔn", vi: "tạm biệt", en: "goodbye", pos: "phrase" },
    ],
    dialogue: [
      { speaker: "A", th: "สวัสดีครับ สบายดีไหมครับ", rtgs: "sà-wàt-dii khráp, sà-baai-dii mǎi khráp", vi: "Xin chào, bạn khỏe không?", en: "Hello, how are you?" },
      { speaker: "B", th: "สบายดีค่ะ ขอบคุณค่ะ แล้วคุณล่ะคะ", rtgs: "sà-baai-dii khâ, khɔ̀ɔp-khun khâ, lɛ́ɛo khun lâ khá", vi: "Khỏe, cảm ơn. Còn bạn?", en: "I'm fine, thank you. And you?" },
      { speaker: "A", th: "สบายดีครับ", rtgs: "sà-baai-dii khráp", vi: "Tôi khỏe.", en: "I'm fine." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Thái:",
        instruction_en: "Translate into Thai:",
        items: [
          { prompt: "Xin chào (nữ nói)", answer: "สวัสดีค่ะ" },
          { prompt: "Bạn khỏe không?", answer: "สบายดีไหม" },
          { prompt: "Cảm ơn", answer: "ขอบคุณ" },
        ],
      },
      {
        type: "speaking",
        instruction_vi: "Chào một người, hỏi thăm, rồi tạm biệt — thêm ครับ/ค่ะ theo giới tính của bạn.",
        instruction_en: "Greet someone, ask how they are, then say goodbye — add ครับ/ค่ะ to match your gender.",
      },
    ],
  },

  // ── 2. Politeness particles ครับ / ค่ะ ─────────────────────────────────────
  {
    id: "thai_a1_particles",
    level: "A1",
    category: "particles",
    title_vi: "Tiểu từ lịch sự ครับ / ค่ะ",
    title_en: "Politeness particles ครับ / ค่ะ",
    sentences: [
      {
        th: "ผู้ชายพูด ครับ / ผู้หญิงพูด ค่ะ",
        rtgs: "phûu-chaai phûut khráp / phûu-yǐng phûut khâ",
        vi: "Nam dùng 'khráp', nữ dùng 'khâ' ở cuối câu để lịch sự.",
        en: "Men end sentences with 'khráp', women with 'khâ' to be polite.",
        pronunciation_focus: [
          "ค่ะ (khâ) cho câu khẳng định; คะ (khá) cho câu hỏi — nữ đổi thanh",
        ],
        pronunciation_focus_en: [
          "Women use ค่ะ (khâ, falling) for statements, คะ (khá, high) for questions",
        ],
      },
      {
        th: "ขอบคุณครับ / ขอบคุณค่ะ",
        rtgs: "khɔ̀ɔp-khun khráp / khɔ̀ɔp-khun khâ",
        vi: "Cảm ơn ạ.",
        en: "Thank you (polite).",
        pronunciation_focus: ["Thêm particle là cách nhanh nhất để nghe lịch sự"],
        pronunciation_focus_en: ["Adding the particle is the fastest way to sound polite"],
      },
      {
        th: "ขอโทษครับ",
        rtgs: "khɔ̌ɔ-thôot khráp",
        vi: "Xin lỗi / Xin phép (nam).",
        en: "Sorry / Excuse me (male).",
        pronunciation_focus: ["ขอโทษ dùng cả khi xin lỗi lẫn khi gọi để hỏi"],
        pronunciation_focus_en: ["ขอโทษ means both 'sorry' and 'excuse me'"],
      },
      {
        th: "ไม่เป็นไรค่ะ",
        rtgs: "mâi pen rai khâ",
        vi: "Không sao đâu.",
        en: "It's okay / No problem.",
        pronunciation_focus: ["ไม่เป็นไร là câu cửa miệng, dùng để đáp lại 'cảm ơn' hoặc 'xin lỗi'"],
        pronunciation_focus_en: ["ไม่เป็นไร answers both 'thank you' and 'sorry'"],
      },
    ],
    vocabulary: [
      { word: "ครับ", rtgs: "khráp", vi: "tiểu từ lịch sự (nam)", en: "polite particle (male)", pos: "particle" },
      { word: "ค่ะ", rtgs: "khâ", vi: "tiểu từ lịch sự (nữ, câu kể)", en: "polite particle (female, statement)", pos: "particle" },
      { word: "คะ", rtgs: "khá", vi: "tiểu từ lịch sự (nữ, câu hỏi)", en: "polite particle (female, question)", pos: "particle" },
      { word: "ขอโทษ", rtgs: "khɔ̌ɔ-thôot", vi: "xin lỗi / xin phép", en: "sorry / excuse me", pos: "phrase" },
      { word: "ไม่เป็นไร", rtgs: "mâi pen rai", vi: "không sao", en: "no problem", pos: "phrase" },
    ],
    dialogue: [
      { speaker: "A", th: "ขอโทษค่ะ", rtgs: "khɔ̌ɔ-thôot khâ", vi: "Xin lỗi.", en: "Sorry / Excuse me." },
      { speaker: "B", th: "ไม่เป็นไรครับ", rtgs: "mâi pen rai khráp", vi: "Không sao.", en: "No problem." },
      { speaker: "A", th: "ขอบคุณค่ะ", rtgs: "khɔ̀ɔp-khun khâ", vi: "Cảm ơn.", en: "Thank you." },
    ],
    l1_notes_vi: [
      {
        mistake: "Quên thêm ครับ/ค่ะ vì tiếng Việt không có tiểu từ lịch sự cố định.",
        fix_vi: "Trong tiếng Thái, thiếu particle nghe cộc lốc. Hãy thêm ครับ (nam) / ค่ะ (nữ) vào cuối hầu hết các câu khi nói chuyện lịch sự.",
        fix_en: "Vietnamese has no fixed politeness particle, so learners drop it. In Thai, leaving it off sounds blunt — add ครับ/ค่ะ to most polite sentences.",
      },
      {
        mistake: "Nữ dùng ค่ะ cho cả câu hỏi.",
        fix_vi: "Nữ phải đổi sang คะ (thanh cao) khi hỏi: 'สบายดีไหมคะ'.",
        fix_en: "Women switch to คะ (high tone) for questions: 'sà-baai-dii mǎi khá'.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền ครับ, ค่ะ hoặc คะ:",
        instruction_en: "Fill in ครับ, ค่ะ, or คะ:",
        items: [
          { prompt: "(nam, câu kể) สบายดี ___", answer: "ครับ" },
          { prompt: "(nữ, câu kể) ขอบคุณ ___", answer: "ค่ะ" },
          { prompt: "(nữ, câu hỏi) สบายดีไหม ___", answer: "คะ" },
        ],
      },
    ],
  },

  // ── 3. Pronouns ────────────────────────────────────────────────────────────
  {
    id: "thai_a1_pronouns",
    level: "A1",
    category: "pronouns",
    title_vi: "Đại từ nhân xưng",
    title_en: "Personal pronouns",
    sentences: [
      {
        th: "ผม / ดิฉัน",
        rtgs: "phǒm / dì-chǎn",
        vi: "Tôi — nam dùng 'phǒm', nữ dùng 'dì-chǎn' (trang trọng) hoặc 'chǎn'.",
        en: "I — men use 'phǒm', women use 'dì-chǎn' (formal) or 'chǎn'.",
        pronunciation_focus: ["ผม (phǒm) thanh lên; đừng nhầm với 'phom' không dấu"],
        pronunciation_focus_en: ["ผม (phǒm) has a rising tone"],
      },
      {
        th: "คุณ",
        rtgs: "khun",
        vi: "Bạn / anh / chị (lịch sự, an toàn cho mọi giới).",
        en: "You (polite, safe for everyone).",
        pronunciation_focus: ["คุณ cũng đặt trước tên để gọi lịch sự: 'คุณนา'"],
        pronunciation_focus_en: ["คุณ also goes before a name as a polite title: 'Khun Na'"],
      },
      {
        th: "เขา / เรา / พวกเขา",
        rtgs: "kháo / rao / phûak-kháo",
        vi: "Anh ấy/cô ấy — chúng tôi — họ.",
        en: "He/she — we — they.",
        pronunciation_focus: ["เขา (kháo) dùng cho cả nam lẫn nữ, không phân biệt giống"],
        pronunciation_focus_en: ["เขา (kháo) is gender-neutral: he OR she"],
      },
    ],
    vocabulary: [
      { word: "ผม", rtgs: "phǒm", vi: "tôi (nam)", en: "I (male)", pos: "pronoun" },
      { word: "ดิฉัน", rtgs: "dì-chǎn", vi: "tôi (nữ, trang trọng)", en: "I (female, formal)", pos: "pronoun" },
      { word: "คุณ", rtgs: "khun", vi: "bạn (lịch sự)", en: "you (polite)", pos: "pronoun" },
      { word: "เขา", rtgs: "kháo", vi: "anh ấy / cô ấy", en: "he / she", pos: "pronoun" },
      { word: "เรา", rtgs: "rao", vi: "chúng tôi / chúng ta", en: "we", pos: "pronoun" },
      { word: "พวกเขา", rtgs: "phûak-kháo", vi: "họ", en: "they", pos: "pronoun" },
    ],
    dialogue: [
      { speaker: "A", th: "คุณสบายดีไหมครับ", rtgs: "khun sà-baai-dii mǎi khráp", vi: "Bạn khỏe không?", en: "Are you well?" },
      { speaker: "B", th: "ผมสบายดีครับ เขาก็สบายดี", rtgs: "phǒm sà-baai-dii khráp, kháo gɔ̂ɔ sà-baai-dii", vi: "Tôi khỏe. Anh ấy cũng khỏe.", en: "I'm fine. He's fine too." },
    ],
    l1_notes_vi: [
      {
        mistake: "Dùng một đại từ 'tôi' chung như tiếng Việt.",
        fix_vi: "Tiếng Thái chọn đại từ theo giới tính người nói: nam = ผม, nữ = ดิฉัน/ฉัน. Chọn sai nghe rất lạ.",
        fix_en: "Thai picks 'I' by the speaker's gender: male = ผม, female = ดิฉัน/ฉัน. Mixing them sounds odd.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối đại từ với nghĩa:",
        instruction_en: "Match the pronoun to its meaning:",
        pairs: [
          { left: "ผม", right: "tôi (nam) / I (male)" },
          { left: "คุณ", right: "bạn / you" },
          { left: "เขา", right: "anh ấy, cô ấy / he, she" },
          { left: "พวกเขา", right: "họ / they" },
        ],
      },
    ],
  },

  // ── 4. Yes / No & question words ─────────────────────────────────────────────
  {
    id: "thai_a1_yes_no",
    level: "A1",
    category: "yes_no",
    title_vi: "Có / Không và câu hỏi",
    title_en: "Yes / No and questions",
    sentences: [
      {
        th: "ใช่ / ไม่ใช่",
        rtgs: "châi / mâi châi",
        vi: "Đúng / Không đúng (dùng để xác nhận danh tính, sự thật).",
        en: "Yes (correct) / No (not correct).",
        pronunciation_focus: ["ไม่ (mâi) thanh xuống là dấu phủ định, đặt trước động từ"],
        pronunciation_focus_en: ["ไม่ (mâi, falling) is the negator, placed before the verb"],
      },
      {
        th: "มี / ไม่มี",
        rtgs: "mii / mâi mii",
        vi: "Có / Không có.",
        en: "Have / Don't have.",
        pronunciation_focus: ["Trả lời câu hỏi 'มี...ไหม' bằng chính động từ: มี hoặc ไม่มี"],
        pronunciation_focus_en: ["Answer 'mii ... mǎi?' with the verb itself: มี or ไม่มี"],
      },
      {
        th: "คุณเป็นคนเวียดนามใช่ไหม",
        rtgs: "khun pen khon wîat-naam châi mǎi",
        vi: "Bạn là người Việt Nam, đúng không?",
        en: "You're Vietnamese, right?",
        pronunciation_focus: ["ใช่ไหม cuối câu = 'đúng không?', xin xác nhận"],
        pronunciation_focus_en: ["ใช่ไหม at the end = 'right?', a confirmation tag"],
      },
    ],
    vocabulary: [
      { word: "ใช่", rtgs: "châi", vi: "đúng / phải", en: "yes, correct", pos: "verb" },
      { word: "ไม่ใช่", rtgs: "mâi châi", vi: "không phải", en: "no, not correct", pos: "phrase" },
      { word: "มี", rtgs: "mii", vi: "có", en: "to have", pos: "verb" },
      { word: "ไม่", rtgs: "mâi", vi: "không (phủ định)", en: "not (negator)", pos: "adverb" },
      { word: "ใช่ไหม", rtgs: "châi mǎi", vi: "đúng không?", en: "right? (tag)", pos: "phrase" },
    ],
    dialogue: [
      { speaker: "A", th: "คุณมีน้ำไหมครับ", rtgs: "khun mii náam mǎi khráp", vi: "Bạn có nước không?", en: "Do you have water?" },
      { speaker: "B", th: "มีค่ะ", rtgs: "mii khâ", vi: "Có.", en: "Yes, I do." },
      { speaker: "A", th: "คุณเป็นคนไทยใช่ไหมครับ", rtgs: "khun pen khon thai châi mǎi khráp", vi: "Bạn là người Thái đúng không?", en: "You're Thai, right?" },
      { speaker: "B", th: "ไม่ใช่ค่ะ ดิฉันเป็นคนเวียดนาม", rtgs: "mâi châi khâ, dì-chǎn pen khon wîat-naam", vi: "Không, tôi là người Việt Nam.", en: "No, I'm Vietnamese." },
    ],
    l1_notes_vi: [
      {
        mistake: "Tìm một từ 'yes' / 'no' cố định như tiếng Anh.",
        fix_vi: "Tiếng Thái thường trả lời bằng cách lặp lại động từ: hỏi 'มีไหม' thì đáp 'มี' (có) hoặc 'ไม่มี' (không có). ใช่/ไม่ใช่ chỉ dùng để xác nhận 'đúng/sai'.",
        fix_en: "Thai answers by echoing the verb: 'mii mǎi?' → 'mii' / 'mâi mii'. Use ใช่/ไม่ใช่ only to confirm 'correct/incorrect'.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Thái:",
        instruction_en: "Translate into Thai:",
        items: [
          { prompt: "Bạn có cà phê không?", answer: "คุณมีกาแฟไหม" },
          { prompt: "Không có.", answer: "ไม่มี" },
          { prompt: "Đúng rồi.", answer: "ใช่" },
        ],
      },
    ],
  },

  // ── 5. Numbers ───────────────────────────────────────────────────────────────
  {
    id: "thai_a1_numbers",
    level: "A1",
    category: "numbers",
    title_vi: "Số đếm 0–100",
    title_en: "Numbers 0–100",
    sentences: [
      {
        th: "ศูนย์ หนึ่ง สอง สาม สี่ ห้า",
        rtgs: "sǔun, nʉ̀ng, sɔ̌ɔng, sǎam, sìi, hâa",
        vi: "0, 1, 2, 3, 4, 5.",
        en: "0, 1, 2, 3, 4, 5.",
        pronunciation_focus: ["ห้า (hâa) = 5, thanh xuống; trùng âm với cười 'haha' nên dễ nhớ"],
        pronunciation_focus_en: ["ห้า (hâa) = 5; sounds like laughing 'ha', easy to remember"],
      },
      {
        th: "หก เจ็ด แปด เก้า สิบ",
        rtgs: "hòk, jèt, pɛ̀ɛt, gâo, sìp",
        vi: "6, 7, 8, 9, 10.",
        en: "6, 7, 8, 9, 10.",
        pronunciation_focus: ["สิบ (sìp) = 10, là gốc để ghép số lớn"],
        pronunciation_focus_en: ["สิบ (sìp) = 10, the building block for bigger numbers"],
      },
      {
        th: "สิบเอ็ด ยี่สิบ ยี่สิบเอ็ด หนึ่งร้อย",
        rtgs: "sìp-èt, yîi-sìp, yîi-sìp-èt, nʉ̀ng-rɔ́ɔy",
        vi: "11, 20, 21, 100.",
        en: "11, 20, 21, 100.",
        pronunciation_focus: [
          "Số 1 hàng đơn vị (trừ chính 'หนึ่ง') đổi thành เอ็ด (èt): 11 = สิบเอ็ด",
          "20 dùng ยี่ (yîi) chứ không phải สอง: ยี่สิบ",
        ],
        pronunciation_focus_en: [
          "Final '1' becomes เอ็ด (èt): 11 = sìp-èt",
          "20 uses ยี่ (yîi), not สอง: yîi-sìp",
        ],
      },
    ],
    vocabulary: [
      { word: "หนึ่ง", rtgs: "nʉ̀ng", vi: "một", en: "one", pos: "number" },
      { word: "ห้า", rtgs: "hâa", vi: "năm", en: "five", pos: "number" },
      { word: "สิบ", rtgs: "sìp", vi: "mười", en: "ten", pos: "number" },
      { word: "ยี่สิบ", rtgs: "yîi-sìp", vi: "hai mươi", en: "twenty", pos: "number" },
      { word: "ร้อย", rtgs: "rɔ́ɔy", vi: "trăm", en: "hundred", pos: "number" },
      { word: "เอ็ด", rtgs: "èt", vi: "một (ở hàng đơn vị)", en: "one (in the ones place)", pos: "number" },
    ],
    dialogue: [
      { speaker: "A", th: "อันนี้เท่าไหร่ครับ", rtgs: "an-níi thâo-rài khráp", vi: "Cái này bao nhiêu?", en: "How much is this?" },
      { speaker: "B", th: "ยี่สิบห้าบาทค่ะ", rtgs: "yîi-sìp-hâa bàat khâ", vi: "Hai mươi lăm baht.", en: "Twenty-five baht." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Viết số bằng chữ Thái (romanization được chấp nhận):",
        instruction_en: "Write the number in Thai (romanization accepted):",
        items: [
          { prompt: "3", answer: "สาม / sǎam" },
          { prompt: "10", answer: "สิบ / sìp" },
          { prompt: "21", answer: "ยี่สิบเอ็ด / yîi-sìp-èt" },
        ],
      },
    ],
  },

  // ── 6. Food & drink ──────────────────────────────────────────────────────────
  {
    id: "thai_a1_food_drink",
    level: "A1",
    category: "food_drink",
    title_vi: "Đồ ăn & thức uống",
    title_en: "Food & drink",
    sentences: [
      {
        th: "ผมหิว / ดิฉันหิว",
        rtgs: "phǒm hǐu / dì-chǎn hǐu",
        vi: "Tôi đói.",
        en: "I'm hungry.",
        pronunciation_focus: ["หิว (hǐu) = đói; อิ่ม (ìm) = no"],
        pronunciation_focus_en: ["หิว (hǐu) = hungry; อิ่ม (ìm) = full"],
      },
      {
        th: "ขอข้าวกับน้ำหนึ่งแก้ว",
        rtgs: "khɔ̌ɔ khâao gàp náam nʉ̀ng gɛ̂ɛo",
        vi: "Cho tôi cơm và một ly nước.",
        en: "May I have rice and a glass of water.",
        pronunciation_focus: ["ข้าว (khâao) = cơm; náam (น้ำ) = nước"],
        pronunciation_focus_en: ["ข้าว (khâao) = rice; น้ำ (náam) = water"],
      },
      {
        th: "ไม่เผ็ดนะครับ",
        rtgs: "mâi phèt ná khráp",
        vi: "Đừng cay nhé.",
        en: "Not spicy, please.",
        pronunciation_focus: ["เผ็ด (phèt) = cay; câu sống còn ở Thái Lan!"],
        pronunciation_focus_en: ["เผ็ด (phèt) = spicy; a survival phrase in Thailand!"],
      },
      {
        th: "อร่อยมาก",
        rtgs: "à-rɔ̀i mâak",
        vi: "Rất ngon.",
        en: "Very delicious.",
        pronunciation_focus: ["มาก (mâak) = rất, đặt SAU tính từ"],
        pronunciation_focus_en: ["มาก (mâak) = very, comes AFTER the adjective"],
      },
    ],
    vocabulary: [
      { word: "ข้าว", rtgs: "khâao", vi: "cơm", en: "rice", pos: "noun" },
      { word: "น้ำ", rtgs: "náam", vi: "nước", en: "water", pos: "noun" },
      { word: "กาแฟ", rtgs: "gaa-fɛɛ", vi: "cà phê", en: "coffee", pos: "noun" },
      { word: "เผ็ด", rtgs: "phèt", vi: "cay", en: "spicy", pos: "adjective" },
      { word: "อร่อย", rtgs: "à-rɔ̀i", vi: "ngon", en: "delicious", pos: "adjective" },
      { word: "หิว", rtgs: "hǐu", vi: "đói", en: "hungry", pos: "adjective" },
    ],
    dialogue: [
      { speaker: "ลูกค้า / Khách", th: "ขอผัดไทยหนึ่งจาน ไม่เผ็ดค่ะ", rtgs: "khɔ̌ɔ phàt-thai nʉ̀ng jaan, mâi phèt khâ", vi: "Cho một đĩa pad thai, không cay.", en: "One pad thai, not spicy please." },
      { speaker: "พนักงาน / Nhân viên", th: "ได้ค่ะ ดื่มอะไรไหมคะ", rtgs: "dâi khâ, dʉ̀ʉm à-rai mǎi khá", vi: "Được. Uống gì không?", en: "Sure. Anything to drink?" },
      { speaker: "ลูกค้า / Khách", th: "ขอน้ำเปล่าค่ะ", rtgs: "khɔ̌ɔ náam-plàao khâ", vi: "Cho nước lọc.", en: "Just plain water, please." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Thái:",
        instruction_en: "Translate into Thai:",
        items: [
          { prompt: "Tôi đói.", answer: "ผมหิว / ดิฉันหิว" },
          { prompt: "Không cay nhé.", answer: "ไม่เผ็ดนะ" },
          { prompt: "Rất ngon.", answer: "อร่อยมาก" },
        ],
      },
    ],
  },

  // ── 7. Buying / shopping ───────────────────────────────────────────────────────
  {
    id: "thai_a1_buying",
    level: "A1",
    category: "buying",
    title_vi: "Mua sắm & trả giá",
    title_en: "Buying & bargaining",
    sentences: [
      {
        th: "อันนี้เท่าไหร่",
        rtgs: "an-níi thâo-rài",
        vi: "Cái này bao nhiêu (tiền)?",
        en: "How much is this?",
        pronunciation_focus: ["เท่าไหร่ (thâo-rài) = bao nhiêu; câu hỏi giá quan trọng nhất"],
        pronunciation_focus_en: ["เท่าไหร่ (thâo-rài) = how much; the key price question"],
      },
      {
        th: "แพงไป ลดได้ไหม",
        rtgs: "phɛɛng pai, lót dâi mǎi",
        vi: "Đắt quá, giảm được không?",
        en: "Too expensive, can you lower it?",
        pronunciation_focus: ["...ไป (pai) sau tính từ = 'quá': แพงไป = đắt quá"],
        pronunciation_focus_en: ["...ไป (pai) after an adjective = 'too': phɛɛng pai = too expensive"],
      },
      {
        th: "เอาอันนี้ครับ",
        rtgs: "ao an-níi khráp",
        vi: "Lấy cái này.",
        en: "I'll take this one.",
        pronunciation_focus: ["เอา (ao) = lấy/muốn, dùng khi quyết định mua"],
        pronunciation_focus_en: ["เอา (ao) = take/want, used when deciding to buy"],
      },
    ],
    vocabulary: [
      { word: "เท่าไหร่", rtgs: "thâo-rài", vi: "bao nhiêu", en: "how much", pos: "phrase" },
      { word: "บาท", rtgs: "bàat", vi: "baht (tiền Thái)", en: "baht (Thai currency)", pos: "noun" },
      { word: "แพง", rtgs: "phɛɛng", vi: "đắt", en: "expensive", pos: "adjective" },
      { word: "ถูก", rtgs: "thùuk", vi: "rẻ", en: "cheap", pos: "adjective" },
      { word: "ลด", rtgs: "lót", vi: "giảm (giá)", en: "to reduce (price)", pos: "verb" },
      { word: "เอา", rtgs: "ao", vi: "lấy / muốn", en: "to take / want", pos: "verb" },
    ],
    dialogue: [
      { speaker: "A", th: "เสื้อตัวนี้เท่าไหร่คะ", rtgs: "sʉ̂a tua-níi thâo-rài khá", vi: "Cái áo này bao nhiêu?", en: "How much is this shirt?" },
      { speaker: "B", th: "สามร้อยบาทครับ", rtgs: "sǎam-rɔ́ɔy bàat khráp", vi: "Ba trăm baht.", en: "Three hundred baht." },
      { speaker: "A", th: "แพงไป ลดได้ไหมคะ", rtgs: "phɛɛng pai, lót dâi mǎi khá", vi: "Đắt quá, giảm được không?", en: "Too expensive, can you lower it?" },
      { speaker: "B", th: "สองร้อยห้าสิบ เอาไหมครับ", rtgs: "sɔ̌ɔng-rɔ́ɔy-hâa-sìp, ao mǎi khráp", vi: "Hai trăm năm mươi, lấy không?", en: "Two hundred fifty, will you take it?" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Thái:",
        instruction_en: "Translate into Thai:",
        items: [
          { prompt: "Cái này bao nhiêu?", answer: "อันนี้เท่าไหร่" },
          { prompt: "Đắt quá.", answer: "แพงไป" },
          { prompt: "Lấy cái này.", answer: "เอาอันนี้" },
        ],
      },
    ],
  },

  // ── 8. Directions ────────────────────────────────────────────────────────────
  {
    id: "thai_a1_directions",
    level: "A1",
    category: "directions",
    title_vi: "Hỏi đường",
    title_en: "Asking for directions",
    sentences: [
      {
        th: "ห้องน้ำอยู่ที่ไหน",
        rtgs: "hɔ̂ng-náam yùu thîi-nǎi",
        vi: "Nhà vệ sinh ở đâu?",
        en: "Where is the toilet?",
        pronunciation_focus: ["ที่ไหน (thîi-nǎi) = ở đâu; อยู่ (yùu) = ở (vị trí)"],
        pronunciation_focus_en: ["ที่ไหน (thîi-nǎi) = where; อยู่ (yùu) = to be located"],
      },
      {
        th: "เลี้ยวซ้าย / เลี้ยวขวา",
        rtgs: "líao sáai / líao khwǎa",
        vi: "Rẽ trái / Rẽ phải.",
        en: "Turn left / Turn right.",
        pronunciation_focus: ["ซ้าย (sáai) = trái; ขวา (khwǎa) = phải"],
        pronunciation_focus_en: ["ซ้าย (sáai) = left; ขวา (khwǎa) = right"],
      },
      {
        th: "ตรงไป ใกล้ๆ",
        rtgs: "trong-pai, glâi-glâi",
        vi: "Đi thẳng, gần thôi.",
        en: "Go straight, it's nearby.",
        pronunciation_focus: ["ใกล้ (glâi, thanh xuống) = gần; ไกล (glai, ngang) = xa — chỉ khác thanh!"],
        pronunciation_focus_en: ["ใกล้ (glâi, falling) = near vs ไกล (glai, mid) = far — only the tone differs!"],
      },
    ],
    vocabulary: [
      { word: "ที่ไหน", rtgs: "thîi-nǎi", vi: "ở đâu", en: "where", pos: "phrase" },
      { word: "ซ้าย", rtgs: "sáai", vi: "trái", en: "left", pos: "noun" },
      { word: "ขวา", rtgs: "khwǎa", vi: "phải", en: "right", pos: "noun" },
      { word: "ตรงไป", rtgs: "trong-pai", vi: "đi thẳng", en: "go straight", pos: "verb phrase" },
      { word: "ใกล้", rtgs: "glâi", vi: "gần", en: "near", pos: "adjective" },
      { word: "ไกล", rtgs: "glai", vi: "xa", en: "far", pos: "adjective" },
    ],
    dialogue: [
      { speaker: "A", th: "ขอโทษครับ สถานีรถไฟอยู่ที่ไหนครับ", rtgs: "khɔ̌ɔ-thôot khráp, sà-thǎa-nii rót-fai yùu thîi-nǎi khráp", vi: "Xin lỗi, ga tàu ở đâu?", en: "Excuse me, where is the train station?" },
      { speaker: "B", th: "ตรงไปแล้วเลี้ยวขวาค่ะ ใกล้ๆ", rtgs: "trong-pai lɛ́ɛo líao khwǎa khâ, glâi-glâi", vi: "Đi thẳng rồi rẽ phải. Gần thôi.", en: "Go straight then turn right. It's nearby." },
      { speaker: "A", th: "ขอบคุณครับ", rtgs: "khɔ̀ɔp-khun khráp", vi: "Cảm ơn.", en: "Thank you." },
    ],
    l1_notes_vi: [
      {
        mistake: "Nhầm ใกล้ (gần) với ไกล (xa) vì viết và đọc gần giống nhau.",
        fix_vi: "Chỉ khác thanh điệu: ใกล้ thanh xuống = GẦN; ไกล thanh ngang = XA. Người Việt vốn quen thanh điệu nên hãy tận dụng điều này.",
        fix_en: "Only the tone differs: ใกล้ (falling) = NEAR, ไกล (mid) = FAR. Vietnamese speakers can use their tone instinct here.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền ซ้าย, ขวา hoặc ตรงไป:",
        instruction_en: "Fill in ซ้าย, ขวา, or ตรงไป:",
        items: [
          { prompt: "Rẽ trái = เลี้ยว ___", answer: "ซ้าย" },
          { prompt: "Rẽ phải = เลี้ยว ___", answer: "ขวา" },
          { prompt: "Đi thẳng = ___", answer: "ตรงไป" },
        ],
      },
    ],
  },

  // ── 9. Time & day ──────────────────────────────────────────────────────────────
  {
    id: "thai_a1_time_day",
    level: "A1",
    category: "time_day",
    title_vi: "Thời gian & ngày",
    title_en: "Time & days",
    sentences: [
      {
        th: "ตอนนี้กี่โมง",
        rtgs: "tɔɔn-níi gìi moong",
        vi: "Bây giờ mấy giờ?",
        en: "What time is it now?",
        pronunciation_focus: ["กี่ (gìi) = mấy/bao nhiêu (số đếm được); โมง (moong) = giờ"],
        pronunciation_focus_en: ["กี่ (gìi) = how many (countable); โมง (moong) = o'clock"],
      },
      {
        th: "ตอนเช้า ตอนบ่าย ตอนเย็น",
        rtgs: "tɔɔn-cháao, tɔɔn-bàai, tɔɔn-yen",
        vi: "Buổi sáng, buổi chiều, buổi tối (sớm).",
        en: "Morning, afternoon, early evening.",
        pronunciation_focus: ["ตอน (tɔɔn) = buổi/lúc, đặt trước các phần trong ngày"],
        pronunciation_focus_en: ["ตอน (tɔɔn) = part-of-day marker, before each period"],
      },
      {
        th: "วันนี้ พรุ่งนี้ เมื่อวาน",
        rtgs: "wan-níi, phrûng-níi, mʉ̂a-waan",
        vi: "Hôm nay, ngày mai, hôm qua.",
        en: "Today, tomorrow, yesterday.",
        pronunciation_focus: ["วัน (wan) = ngày, có trong cả tên các thứ trong tuần"],
        pronunciation_focus_en: ["วัน (wan) = day, also starts each weekday name"],
      },
      {
        th: "วันจันทร์ วันอังคาร วันอาทิตย์",
        rtgs: "wan-jan, wan-ang-khaan, wan-aa-thít",
        vi: "Thứ Hai, thứ Ba, Chủ nhật.",
        en: "Monday, Tuesday, Sunday.",
        pronunciation_focus: ["Mỗi thứ gắn với một hành tinh/màu; วันอาทิตย์ = ngày Mặt Trời = Chủ nhật"],
        pronunciation_focus_en: ["Each day links to a planet/colour; วันอาทิตย์ = 'sun day' = Sunday"],
      },
    ],
    vocabulary: [
      { word: "กี่โมง", rtgs: "gìi moong", vi: "mấy giờ", en: "what time", pos: "phrase" },
      { word: "ตอนเช้า", rtgs: "tɔɔn-cháao", vi: "buổi sáng", en: "morning", pos: "noun" },
      { word: "วันนี้", rtgs: "wan-níi", vi: "hôm nay", en: "today", pos: "noun" },
      { word: "พรุ่งนี้", rtgs: "phrûng-níi", vi: "ngày mai", en: "tomorrow", pos: "noun" },
      { word: "เมื่อวาน", rtgs: "mʉ̂a-waan", vi: "hôm qua", en: "yesterday", pos: "noun" },
      { word: "วันจันทร์", rtgs: "wan-jan", vi: "thứ Hai", en: "Monday", pos: "noun" },
    ],
    dialogue: [
      { speaker: "A", th: "วันนี้วันอะไรครับ", rtgs: "wan-níi wan à-rai khráp", vi: "Hôm nay là thứ mấy?", en: "What day is it today?" },
      { speaker: "B", th: "วันจันทร์ค่ะ", rtgs: "wan-jan khâ", vi: "Thứ Hai.", en: "Monday." },
      { speaker: "A", th: "ตอนนี้กี่โมงครับ", rtgs: "tɔɔn-níi gìi moong khráp", vi: "Bây giờ mấy giờ?", en: "What time is it now?" },
      { speaker: "B", th: "บ่ายสองค่ะ", rtgs: "bàai sɔ̌ɔng khâ", vi: "Hai giờ chiều.", en: "Two in the afternoon." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        instruction_en: "Match the word to its meaning:",
        pairs: [
          { left: "วันนี้", right: "hôm nay / today" },
          { left: "พรุ่งนี้", right: "ngày mai / tomorrow" },
          { left: "เมื่อวาน", right: "hôm qua / yesterday" },
          { left: "ตอนเช้า", right: "buổi sáng / morning" },
        ],
      },
    ],
  },

  // ── 10. Basic verbs ──────────────────────────────────────────────────────────────
  {
    id: "thai_a1_basic_verbs",
    level: "A1",
    category: "basic_verbs",
    title_vi: "Động từ cơ bản",
    title_en: "Basic verbs",
    sentences: [
      {
        th: "ผมกินข้าว",
        rtgs: "phǒm gin khâao",
        vi: "Tôi ăn cơm.",
        en: "I eat rice.",
        pronunciation_focus: ["Thứ tự câu giống tiếng Việt: Chủ ngữ + Động từ + Tân ngữ"],
        pronunciation_focus_en: ["Word order matches English: Subject + Verb + Object"],
      },
      {
        th: "เขาไปตลาด",
        rtgs: "kháo pai tà-làat",
        vi: "Anh ấy đi chợ.",
        en: "He goes to the market.",
        pronunciation_focus: ["ไป (pai) = đi (rời xa người nói); มา (maa) = đến (về phía người nói)"],
        pronunciation_focus_en: ["ไป (pai) = go (away); มา (maa) = come (toward speaker)"],
      },
      {
        th: "ผมไม่เข้าใจ พูดช้าๆ ได้ไหม",
        rtgs: "phǒm mâi khâo-jai, phûut cháa-cháa dâi mǎi",
        vi: "Tôi không hiểu, nói chậm chậm được không?",
        en: "I don't understand, can you speak slowly?",
        pronunciation_focus: ["Phủ định: ไม่ + động từ. เข้าใจ (khâo-jai) = hiểu"],
        pronunciation_focus_en: ["Negation: ไม่ + verb. เข้าใจ (khâo-jai) = understand"],
      },
    ],
    vocabulary: [
      { word: "กิน", rtgs: "gin", vi: "ăn", en: "to eat", pos: "verb" },
      { word: "ดื่ม", rtgs: "dʉ̀ʉm", vi: "uống", en: "to drink", pos: "verb" },
      { word: "ไป", rtgs: "pai", vi: "đi", en: "to go", pos: "verb" },
      { word: "มา", rtgs: "maa", vi: "đến / lại", en: "to come", pos: "verb" },
      { word: "พูด", rtgs: "phûut", vi: "nói", en: "to speak", pos: "verb" },
      { word: "เข้าใจ", rtgs: "khâo-jai", vi: "hiểu", en: "to understand", pos: "verb" },
      { word: "ชอบ", rtgs: "chɔ̂ɔp", vi: "thích", en: "to like", pos: "verb" },
    ],
    dialogue: [
      { speaker: "A", th: "คุณชอบกินอะไรครับ", rtgs: "khun chɔ̂ɔp gin à-rai khráp", vi: "Bạn thích ăn gì?", en: "What do you like to eat?" },
      { speaker: "B", th: "ฉันชอบกินผัดไทยค่ะ", rtgs: "chǎn chɔ̂ɔp gin phàt-thai khâ", vi: "Tôi thích ăn pad thai.", en: "I like to eat pad thai." },
      { speaker: "A", th: "ไปกินด้วยกันไหมครับ", rtgs: "pai gin dûay-gan mǎi khráp", vi: "Đi ăn cùng nhau không?", en: "Shall we go eat together?" },
    ],
    l1_notes_vi: [
      {
        mistake: "Chia động từ theo thì như tiếng Anh (ăn → ate → eaten).",
        fix_vi: "Động từ tiếng Thái KHÔNG đổi dạng. Thời gian thể hiện bằng từ chỉ thời điểm (เมื่อวาน, พรุ่งนี้) hoặc trợ từ — giống hệt tiếng Việt.",
        fix_en: "Thai verbs never conjugate. Tense comes from time words (yesterday/tomorrow) or markers — just like Vietnamese.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Thái:",
        instruction_en: "Translate into Thai:",
        items: [
          { prompt: "Tôi ăn cơm.", answer: "ผมกินข้าว / ฉันกินข้าว" },
          { prompt: "Anh ấy đi chợ.", answer: "เขาไปตลาด" },
          { prompt: "Tôi không hiểu.", answer: "ผมไม่เข้าใจ / ฉันไม่เข้าใจ" },
        ],
      },
    ],
  },

  // ── 11. Polite requests ────────────────────────────────────────────────────────
  {
    id: "thai_a1_polite_requests",
    level: "A1",
    category: "polite_requests",
    title_vi: "Yêu cầu lịch sự",
    title_en: "Polite requests",
    sentences: [
      {
        th: "ขอน้ำหน่อยครับ",
        rtgs: "khɔ̌ɔ náam nɔ̀i khráp",
        vi: "Cho tôi xin chút nước.",
        en: "May I have some water, please.",
        pronunciation_focus: ["ขอ (khɔ̌ɔ) = xin/cho... (khi yêu cầu một VẬT)"],
        pronunciation_focus_en: ["ขอ (khɔ̌ɔ) = 'may I have' (when asking for a THING)"],
      },
      {
        th: "ช่วยถ่ายรูปหน่อยได้ไหมครับ",
        rtgs: "chûay thàai-rûup nɔ̀i dâi mǎi khráp",
        vi: "Giúp tôi chụp ảnh được không?",
        en: "Could you help take a photo?",
        pronunciation_focus: ["ช่วย (chûay) = giúp (khi nhờ ai LÀM việc gì)"],
        pronunciation_focus_en: ["ช่วย (chûay) = help (when asking someone to DO something)"],
      },
      {
        th: "หน่อย ทำให้สุภาพขึ้น",
        rtgs: "nɔ̀i — tham hâi sù-phâap khʉ̂n",
        vi: "Thêm หน่อย làm câu mềm/lịch sự hơn (như 'một chút' / 'giúp với').",
        en: "Adding หน่อย softens the request (like 'a bit' / 'please').",
        pronunciation_focus: ["หน่อย (nɔ̀i) đứng cuối yêu cầu để nghe nhẹ nhàng"],
        pronunciation_focus_en: ["หน่อย (nɔ̀i) at the end of a request makes it gentle"],
      },
    ],
    vocabulary: [
      { word: "ขอ", rtgs: "khɔ̌ɔ", vi: "xin / cho (yêu cầu vật)", en: "may I have (request a thing)", pos: "verb" },
      { word: "ช่วย", rtgs: "chûay", vi: "giúp (nhờ làm việc)", en: "help / please (request an action)", pos: "verb" },
      { word: "หน่อย", rtgs: "nɔ̀i", vi: "một chút (làm mềm yêu cầu)", en: "a bit (softener)", pos: "particle" },
      { word: "ได้ไหม", rtgs: "dâi mǎi", vi: "được không?", en: "can you? / may I?", pos: "phrase" },
      { word: "กรุณา", rtgs: "gà-rú-naa", vi: "xin vui lòng (trang trọng)", en: "please (formal)", pos: "adverb" },
    ],
    dialogue: [
      { speaker: "A", th: "ขอเมนูหน่อยครับ", rtgs: "khɔ̌ɔ mee-nuu nɔ̀i khráp", vi: "Cho tôi xin thực đơn.", en: "May I have the menu, please." },
      { speaker: "B", th: "ได้ค่ะ สักครู่นะคะ", rtgs: "dâi khâ, sàk-khrûu ná khá", vi: "Được. Đợi một chút nhé.", en: "Sure. One moment, please." },
      { speaker: "A", th: "ช่วยคิดเงินด้วยครับ", rtgs: "chûay khít-ngən dûay khráp", vi: "Tính tiền giúp tôi với.", en: "Please bring the bill." },
    ],
    l1_notes_vi: [
      {
        mistake: "Dùng ขอ và ช่วย lẫn lộn.",
        fix_vi: "ขอ + DANH TỪ (xin một vật): 'ขอน้ำ'. ช่วย + ĐỘNG TỪ (nhờ làm việc): 'ช่วยถ่ายรูป'. Đừng nói 'ช่วยน้ำ'.",
        fix_en: "ขอ + NOUN (ask for a thing): 'khɔ̌ɔ náam'. ช่วย + VERB (ask for an action): 'chûay thàai-rûup'. Don't say 'chûay náam'.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền ขอ hoặc ช่วย:",
        instruction_en: "Fill in ขอ or ช่วย:",
        items: [
          { prompt: "___ กาแฟหน่อย (xin cà phê)", answer: "ขอ" },
          { prompt: "___ ถ่ายรูปหน่อย (nhờ chụp ảnh)", answer: "ช่วย" },
          { prompt: "___ เมนูหน่อย (xin thực đơn)", answer: "ขอ" },
        ],
      },
    ],
  },

  // ── 12. Introductions ─────────────────────────────────────────────────────────────
  {
    id: "thai_a1_introductions",
    level: "A1",
    category: "introductions",
    title_vi: "Giới thiệu bản thân",
    title_en: "Introducing yourself",
    sentences: [
      {
        th: "ผมชื่อนาม / ดิฉันชื่อมาลี",
        rtgs: "phǒm chʉ̂ʉ Naam / dì-chǎn chʉ̂ʉ Maalii",
        vi: "Tôi tên là Nam / Mali.",
        en: "My name is Nam / Mali.",
        pronunciation_focus: ["ชื่อ (chʉ̂ʉ) = tên; nguyên âm ʉ tròn môi, kéo dài"],
        pronunciation_focus_en: ["ชื่อ (chʉ̂ʉ) = name; the ʉ vowel is long, lips relaxed"],
      },
      {
        th: "คุณชื่ออะไร",
        rtgs: "khun chʉ̂ʉ à-rai",
        vi: "Bạn tên gì?",
        en: "What's your name?",
        pronunciation_focus: ["อะไร (à-rai) = gì/cái gì, từ hỏi rất hay dùng"],
        pronunciation_focus_en: ["อะไร (à-rai) = what, a very common question word"],
      },
      {
        th: "ผมมาจากเวียดนาม",
        rtgs: "phǒm maa jàak wîat-naam",
        vi: "Tôi đến từ Việt Nam.",
        en: "I'm from Vietnam.",
        pronunciation_focus: ["มาจาก (maa jàak) = đến từ; เวียดนาม = Việt Nam"],
        pronunciation_focus_en: ["มาจาก (maa jàak) = come from; เวียดนาม = Vietnam"],
      },
      {
        th: "ยินดีที่ได้รู้จัก",
        rtgs: "yin-dii thîi dâi rúu-jàk",
        vi: "Rất vui được làm quen.",
        en: "Nice to meet you.",
        pronunciation_focus: ["Câu nguyên khối — học thuộc cả cụm, đừng dịch từng từ"],
        pronunciation_focus_en: ["A fixed phrase — memorize it whole, don't translate word-by-word"],
      },
    ],
    vocabulary: [
      { word: "ชื่อ", rtgs: "chʉ̂ʉ", vi: "tên", en: "name", pos: "noun" },
      { word: "อะไร", rtgs: "à-rai", vi: "gì / cái gì", en: "what", pos: "pronoun" },
      { word: "มาจาก", rtgs: "maa jàak", vi: "đến từ", en: "to come from", pos: "verb phrase" },
      { word: "เวียดนาม", rtgs: "wîat-naam", vi: "Việt Nam", en: "Vietnam", pos: "noun" },
      { word: "ยินดีที่ได้รู้จัก", rtgs: "yin-dii thîi dâi rúu-jàk", vi: "rất vui được làm quen", en: "nice to meet you", pos: "phrase" },
    ],
    dialogue: [
      { speaker: "A", th: "สวัสดีครับ ผมชื่อนาม คุณชื่ออะไรครับ", rtgs: "sà-wàt-dii khráp, phǒm chʉ̂ʉ Naam, khun chʉ̂ʉ à-rai khráp", vi: "Xin chào, tôi tên Nam. Bạn tên gì?", en: "Hello, my name is Nam. What's your name?" },
      { speaker: "B", th: "ดิฉันชื่อมาลีค่ะ ยินดีที่ได้รู้จักค่ะ", rtgs: "dì-chǎn chʉ̂ʉ Maalii khâ, yin-dii thîi dâi rúu-jàk khâ", vi: "Tôi tên Mali. Rất vui được làm quen.", en: "My name is Mali. Nice to meet you." },
      { speaker: "A", th: "ผมมาจากเวียดนามครับ", rtgs: "phǒm maa jàak wîat-naam khráp", vi: "Tôi đến từ Việt Nam.", en: "I'm from Vietnam." },
    ],
    exercises: [
      {
        type: "speaking",
        instruction_vi: "Tự giới thiệu: tên, đến từ đâu, và nói 'rất vui được làm quen'. Thêm ครับ/ค่ะ.",
        instruction_en: "Introduce yourself: your name, where you're from, and say 'nice to meet you'. Add ครับ/ค่ะ.",
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Thái:",
        instruction_en: "Translate into Thai:",
        items: [
          { prompt: "Bạn tên gì?", answer: "คุณชื่ออะไร" },
          { prompt: "Tôi đến từ Việt Nam.", answer: "ผมมาจากเวียดนาม / ดิฉันมาจากเวียดนาม" },
          { prompt: "Rất vui được làm quen.", answer: "ยินดีที่ได้รู้จัก" },
        ],
      },
    ],
  },
];

export default lessons;
