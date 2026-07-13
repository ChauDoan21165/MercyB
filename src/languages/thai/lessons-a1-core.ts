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
  cell_id?: string;
  /** Thai word. */
  word: string;
  rtgs: string;
  vi: string;
  en: string;
  pos: string;
};

export type ThaiDialogueLine = {
  cell_id?: string;
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
      { cell_id: "eeebb791-d989-496e-9261-72af7bb9f3cf", word: "สวัสดี", rtgs: "sà-wàt-dii", vi: "xin chào", en: "hello", pos: "interjection" },
      { cell_id: "38192dac-684f-4b08-9d4d-5835241926a6", word: "สบายดี", rtgs: "sà-baai-dii", vi: "khỏe / ổn", en: "fine, well", pos: "adjective" },
      { cell_id: "e9412485-952a-4eba-b721-9b9d6c16633d", word: "ไหม", rtgs: "mǎi", vi: "không? (từ hỏi)", en: "yes/no question word", pos: "particle" },
      { cell_id: "a20b25b9-2eb9-41c4-967f-9da875ae12d7", word: "ขอบคุณ", rtgs: "khɔ̀ɔp-khun", vi: "cảm ơn", en: "thank you", pos: "phrase" },
      { cell_id: "ef35aa7f-5e76-481d-bace-d7cc4e4535e5", word: "ลาก่อน", rtgs: "laa-gɔ̀ɔn", vi: "tạm biệt", en: "goodbye", pos: "phrase" },
    ],
    dialogue: [
      { cell_id: "70672dd6-5c3b-469f-bd8f-112055edd5a5", speaker: "A", th: "สวัสดีครับ สบายดีไหมครับ", rtgs: "sà-wàt-dii khráp, sà-baai-dii mǎi khráp", vi: "Xin chào, bạn khỏe không?", en: "Hello, how are you?" },
      { cell_id: "b86c8a35-db8f-41b8-b548-3e72e833bf69", speaker: "B", th: "สบายดีค่ะ ขอบคุณค่ะ แล้วคุณล่ะคะ", rtgs: "sà-baai-dii khâ, khɔ̀ɔp-khun khâ, lɛ́ɛo khun lâ khá", vi: "Khỏe, cảm ơn. Còn bạn?", en: "I'm fine, thank you. And you?" },
      { cell_id: "1717d59f-934b-46fd-b2ad-4ef4d3d57f2e", speaker: "A", th: "สบายดีครับ", rtgs: "sà-baai-dii khráp", vi: "Tôi khỏe.", en: "I'm fine." },
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
      { cell_id: "8bf51176-6255-449f-8c4a-6804eab471e5", word: "ครับ", rtgs: "khráp", vi: "tiểu từ lịch sự (nam)", en: "polite particle (male)", pos: "particle" },
      { cell_id: "2ee3d629-35a6-4180-8d5f-0ce6ae3c2cee", word: "ค่ะ", rtgs: "khâ", vi: "tiểu từ lịch sự (nữ, câu kể)", en: "polite particle (female, statement)", pos: "particle" },
      { cell_id: "fbeb5341-87dc-4274-b77b-9a8f9986e7cc", word: "คะ", rtgs: "khá", vi: "tiểu từ lịch sự (nữ, câu hỏi)", en: "polite particle (female, question)", pos: "particle" },
      { cell_id: "9bba0a12-cbfb-427d-b62e-6303c677fe0c", word: "ขอโทษ", rtgs: "khɔ̌ɔ-thôot", vi: "xin lỗi / xin phép", en: "sorry / excuse me", pos: "phrase" },
      { cell_id: "4cb379af-08e1-4d26-ad40-6c7a77be7c4f", word: "ไม่เป็นไร", rtgs: "mâi pen rai", vi: "không sao", en: "no problem", pos: "phrase" },
    ],
    dialogue: [
      { cell_id: "51a69cb1-82c2-482c-acb4-b240abc62590", speaker: "A", th: "ขอโทษค่ะ", rtgs: "khɔ̌ɔ-thôot khâ", vi: "Xin lỗi.", en: "Sorry / Excuse me." },
      { cell_id: "e07ed48a-e1ac-422d-a4c5-3ce6b1ceb379", speaker: "B", th: "ไม่เป็นไรครับ", rtgs: "mâi pen rai khráp", vi: "Không sao.", en: "No problem." },
      { cell_id: "4db929dd-7d15-47b3-a5b1-05a466c3babc", speaker: "A", th: "ขอบคุณค่ะ", rtgs: "khɔ̀ɔp-khun khâ", vi: "Cảm ơn.", en: "Thank you." },
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
      { cell_id: "af8fb049-2483-44a1-983c-7e1fbd2d4bf5", word: "ผม", rtgs: "phǒm", vi: "tôi (nam)", en: "I (male)", pos: "pronoun" },
      { cell_id: "aca7a551-7ac3-4818-a979-334723c76a8e", word: "ดิฉัน", rtgs: "dì-chǎn", vi: "tôi (nữ, trang trọng)", en: "I (female, formal)", pos: "pronoun" },
      { cell_id: "4a1d7444-8305-4c5e-9d27-3355dc550730", word: "คุณ", rtgs: "khun", vi: "bạn (lịch sự)", en: "you (polite)", pos: "pronoun" },
      { cell_id: "4b56142e-4e67-4d39-a720-efc697c6d073", word: "เขา", rtgs: "kháo", vi: "anh ấy / cô ấy", en: "he / she", pos: "pronoun" },
      { cell_id: "20e3fed6-49cd-4aa9-9d0f-bc09d7516b82", word: "เรา", rtgs: "rao", vi: "chúng tôi / chúng ta", en: "we", pos: "pronoun" },
      { cell_id: "5535c8e5-e076-4ad1-85bf-0d550b74877f", word: "พวกเขา", rtgs: "phûak-kháo", vi: "họ", en: "they", pos: "pronoun" },
    ],
    dialogue: [
      { cell_id: "fd3e077e-0d05-4d8c-afdc-5ee66610ccbc", speaker: "A", th: "คุณสบายดีไหมครับ", rtgs: "khun sà-baai-dii mǎi khráp", vi: "Bạn khỏe không?", en: "Are you well?" },
      { cell_id: "bc018928-12c5-4a16-8cd2-c049926a6e1c", speaker: "B", th: "ผมสบายดีครับ เขาก็สบายดี", rtgs: "phǒm sà-baai-dii khráp, kháo gɔ̂ɔ sà-baai-dii", vi: "Tôi khỏe. Anh ấy cũng khỏe.", en: "I'm fine. He's fine too." },
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
      { cell_id: "5674bc8f-aab7-4f12-8a62-86d546109770", word: "ใช่", rtgs: "châi", vi: "đúng / phải", en: "yes, correct", pos: "verb" },
      { cell_id: "12eeeb1c-d5fd-4006-9beb-77abba489e03", word: "ไม่ใช่", rtgs: "mâi châi", vi: "không phải", en: "no, not correct", pos: "phrase" },
      { cell_id: "43c82c45-998f-48da-86da-6ef37d625963", word: "มี", rtgs: "mii", vi: "có", en: "to have", pos: "verb" },
      { cell_id: "e71efef0-d097-4624-9cf8-6d7181da8622", word: "ไม่", rtgs: "mâi", vi: "không (phủ định)", en: "not (negator)", pos: "adverb" },
      { cell_id: "34d007af-e9f8-4ec0-b7fb-f251271d44f0", word: "ใช่ไหม", rtgs: "châi mǎi", vi: "đúng không?", en: "right? (tag)", pos: "phrase" },
    ],
    dialogue: [
      { cell_id: "39971d4b-9fcd-4555-b780-5102f20093b9", speaker: "A", th: "คุณมีน้ำไหมครับ", rtgs: "khun mii náam mǎi khráp", vi: "Bạn có nước không?", en: "Do you have water?" },
      { cell_id: "6f20d552-e70b-4695-941e-b695571b38e9", speaker: "B", th: "มีค่ะ", rtgs: "mii khâ", vi: "Có.", en: "Yes, I do." },
      { cell_id: "ef7de70d-def5-43e6-a582-1b41e368bb8e", speaker: "A", th: "คุณเป็นคนไทยใช่ไหมครับ", rtgs: "khun pen khon thai châi mǎi khráp", vi: "Bạn là người Thái đúng không?", en: "You're Thai, right?" },
      { cell_id: "96093e53-08df-4152-9e51-df7957899b0f", speaker: "B", th: "ไม่ใช่ค่ะ ดิฉันเป็นคนเวียดนาม", rtgs: "mâi châi khâ, dì-chǎn pen khon wîat-naam", vi: "Không, tôi là người Việt Nam.", en: "No, I'm Vietnamese." },
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
      { cell_id: "4c0e1b08-2b22-44c1-8bb2-b05eac7f068f", word: "หนึ่ง", rtgs: "nʉ̀ng", vi: "một", en: "one", pos: "number" },
      { cell_id: "579933c2-0882-40fe-b315-b0197665d3aa", word: "ห้า", rtgs: "hâa", vi: "năm", en: "five", pos: "number" },
      { cell_id: "c6e92c6d-e2fc-4a3f-96be-f2e8e9b98aa7", word: "สิบ", rtgs: "sìp", vi: "mười", en: "ten", pos: "number" },
      { cell_id: "f2153f92-e58a-4a3b-943d-6a9dce849e1e", word: "ยี่สิบ", rtgs: "yîi-sìp", vi: "hai mươi", en: "twenty", pos: "number" },
      { cell_id: "bc5a52ae-835a-4223-8f74-97ebee5ed074", word: "ร้อย", rtgs: "rɔ́ɔy", vi: "trăm", en: "hundred", pos: "number" },
      { cell_id: "8a7b4e34-bc03-4bcc-bfba-b320c311f712", word: "เอ็ด", rtgs: "èt", vi: "một (ở hàng đơn vị)", en: "one (in the ones place)", pos: "number" },
    ],
    dialogue: [
      { cell_id: "31a50c82-8151-4f5e-9694-87751ca4bdff", speaker: "A", th: "อันนี้เท่าไหร่ครับ", rtgs: "an-níi thâo-rài khráp", vi: "Cái này bao nhiêu?", en: "How much is this?" },
      { cell_id: "eb680c9d-5e5c-4210-8e8f-87831d72a18d", speaker: "B", th: "ยี่สิบห้าบาทค่ะ", rtgs: "yîi-sìp-hâa bàat khâ", vi: "Hai mươi lăm baht.", en: "Twenty-five baht." },
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
      { cell_id: "4a5536b6-d507-46ec-a80f-1fd83b48c24a", word: "ข้าว", rtgs: "khâao", vi: "cơm", en: "rice", pos: "noun" },
      { cell_id: "21dbdbc8-8712-455b-ab42-bc18629d9639", word: "น้ำ", rtgs: "náam", vi: "nước", en: "water", pos: "noun" },
      { cell_id: "37ed7c38-c518-4ec8-823b-51b3bc641f6d", word: "กาแฟ", rtgs: "gaa-fɛɛ", vi: "cà phê", en: "coffee", pos: "noun" },
      { cell_id: "2231effe-28f4-4bc3-9072-04e827dd5f2d", word: "เผ็ด", rtgs: "phèt", vi: "cay", en: "spicy", pos: "adjective" },
      { cell_id: "b0187cf6-5f3f-4780-bb5c-44196f59a329", word: "อร่อย", rtgs: "à-rɔ̀i", vi: "ngon", en: "delicious", pos: "adjective" },
      { cell_id: "3c0185eb-f0fd-4327-86ab-85fd8e1b4607", word: "หิว", rtgs: "hǐu", vi: "đói", en: "hungry", pos: "adjective" },
    ],
    dialogue: [
      { cell_id: "532beec2-f152-4e4a-85af-4f70e52b1506", speaker: "ลูกค้า / Khách", th: "ขอผัดไทยหนึ่งจาน ไม่เผ็ดค่ะ", rtgs: "khɔ̌ɔ phàt-thai nʉ̀ng jaan, mâi phèt khâ", vi: "Cho một đĩa pad thai, không cay.", en: "One pad thai, not spicy please." },
      { cell_id: "8e5c324f-73ef-4c9e-934a-ce7366b85342", speaker: "พนักงาน / Nhân viên", th: "ได้ค่ะ ดื่มอะไรไหมคะ", rtgs: "dâi khâ, dʉ̀ʉm à-rai mǎi khá", vi: "Được. Uống gì không?", en: "Sure. Anything to drink?" },
      { cell_id: "a2970804-535f-4ad0-8c0d-def53679ee49", speaker: "ลูกค้า / Khách", th: "ขอน้ำเปล่าค่ะ", rtgs: "khɔ̌ɔ náam-plàao khâ", vi: "Cho nước lọc.", en: "Just plain water, please." },
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
      { cell_id: "3e7184ff-c69b-4ea8-9dca-751d88d6bc75", word: "เท่าไหร่", rtgs: "thâo-rài", vi: "bao nhiêu", en: "how much", pos: "phrase" },
      { cell_id: "290ea0ad-2327-40a9-82ad-ccc9a027b313", word: "บาท", rtgs: "bàat", vi: "baht (tiền Thái)", en: "baht (Thai currency)", pos: "noun" },
      { cell_id: "e09f1fff-b106-4e28-b4a0-62b0613691b7", word: "แพง", rtgs: "phɛɛng", vi: "đắt", en: "expensive", pos: "adjective" },
      { cell_id: "105029fa-b6bb-4952-b2f8-93cd0ada1034", word: "ถูก", rtgs: "thùuk", vi: "rẻ", en: "cheap", pos: "adjective" },
      { cell_id: "827016bf-0d8f-4687-a480-af34fae900f3", word: "ลด", rtgs: "lót", vi: "giảm (giá)", en: "to reduce (price)", pos: "verb" },
      { cell_id: "2786c7e7-a9ae-4afe-ae2d-e9f493aab7af", word: "เอา", rtgs: "ao", vi: "lấy / muốn", en: "to take / want", pos: "verb" },
    ],
    dialogue: [
      { cell_id: "da666b53-205a-4756-9f64-3534686e0001", speaker: "A", th: "เสื้อตัวนี้เท่าไหร่คะ", rtgs: "sʉ̂a tua-níi thâo-rài khá", vi: "Cái áo này bao nhiêu?", en: "How much is this shirt?" },
      { cell_id: "a7b0a8dc-0822-49ff-b596-9fd3fcb43b67", speaker: "B", th: "สามร้อยบาทครับ", rtgs: "sǎam-rɔ́ɔy bàat khráp", vi: "Ba trăm baht.", en: "Three hundred baht." },
      { cell_id: "e44603d4-08e8-4680-8806-c6af690c353b", speaker: "A", th: "แพงไป ลดได้ไหมคะ", rtgs: "phɛɛng pai, lót dâi mǎi khá", vi: "Đắt quá, giảm được không?", en: "Too expensive, can you lower it?" },
      { cell_id: "c9b07508-f03c-447c-a942-9f42af5d6d77", speaker: "B", th: "สองร้อยห้าสิบ เอาไหมครับ", rtgs: "sɔ̌ɔng-rɔ́ɔy-hâa-sìp, ao mǎi khráp", vi: "Hai trăm năm mươi, lấy không?", en: "Two hundred fifty, will you take it?" },
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
      { cell_id: "e12dfe8f-44a5-458b-8131-6c5e241893ed", word: "ที่ไหน", rtgs: "thîi-nǎi", vi: "ở đâu", en: "where", pos: "phrase" },
      { cell_id: "a2992172-4de0-44d7-9f76-c05f37e1b1c3", word: "ซ้าย", rtgs: "sáai", vi: "trái", en: "left", pos: "noun" },
      { cell_id: "8f53c55b-8710-4994-a572-a40c48fcb28b", word: "ขวา", rtgs: "khwǎa", vi: "phải", en: "right", pos: "noun" },
      { cell_id: "eb425465-218e-47ef-bc0f-bd4a6af9b4e3", word: "ตรงไป", rtgs: "trong-pai", vi: "đi thẳng", en: "go straight", pos: "verb phrase" },
      { cell_id: "5730a7ce-a1b9-49ba-996f-187def189827", word: "ใกล้", rtgs: "glâi", vi: "gần", en: "near", pos: "adjective" },
      { cell_id: "c56518d5-0d11-47c3-a75b-57d69802d42e", word: "ไกล", rtgs: "glai", vi: "xa", en: "far", pos: "adjective" },
    ],
    dialogue: [
      { cell_id: "38ec29e3-0a49-4660-9373-cb32aeeec8bb", speaker: "A", th: "ขอโทษครับ สถานีรถไฟอยู่ที่ไหนครับ", rtgs: "khɔ̌ɔ-thôot khráp, sà-thǎa-nii rót-fai yùu thîi-nǎi khráp", vi: "Xin lỗi, ga tàu ở đâu?", en: "Excuse me, where is the train station?" },
      { cell_id: "83ce2cbf-01bb-4147-8d54-0a1ecb1d5a38", speaker: "B", th: "ตรงไปแล้วเลี้ยวขวาค่ะ ใกล้ๆ", rtgs: "trong-pai lɛ́ɛo líao khwǎa khâ, glâi-glâi", vi: "Đi thẳng rồi rẽ phải. Gần thôi.", en: "Go straight then turn right. It's nearby." },
      { cell_id: "efbb7805-3347-469d-a806-89f1b7a9ce9e", speaker: "A", th: "ขอบคุณครับ", rtgs: "khɔ̀ɔp-khun khráp", vi: "Cảm ơn.", en: "Thank you." },
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
      { cell_id: "a32912ab-5f61-43e6-8f8e-644456a4f7c0", word: "กี่โมง", rtgs: "gìi moong", vi: "mấy giờ", en: "what time", pos: "phrase" },
      { cell_id: "cc7af348-6061-4c72-9c31-2e02d56509c3", word: "ตอนเช้า", rtgs: "tɔɔn-cháao", vi: "buổi sáng", en: "morning", pos: "noun" },
      { cell_id: "ec80b07c-1ef4-48a8-bd42-e38416bf00c6", word: "วันนี้", rtgs: "wan-níi", vi: "hôm nay", en: "today", pos: "noun" },
      { cell_id: "f0ee64ed-a9ab-47e1-bf34-b00c3c0e31e9", word: "พรุ่งนี้", rtgs: "phrûng-níi", vi: "ngày mai", en: "tomorrow", pos: "noun" },
      { cell_id: "1a0d144d-9212-4408-ab06-d9b5e4c215f8", word: "เมื่อวาน", rtgs: "mʉ̂a-waan", vi: "hôm qua", en: "yesterday", pos: "noun" },
      { cell_id: "cc2d50fa-1897-4856-8ad8-9ca9572afb0b", word: "วันจันทร์", rtgs: "wan-jan", vi: "thứ Hai", en: "Monday", pos: "noun" },
    ],
    dialogue: [
      { cell_id: "4bf4e5b7-77d8-44d0-9200-56e34e1bf3be", speaker: "A", th: "วันนี้วันอะไรครับ", rtgs: "wan-níi wan à-rai khráp", vi: "Hôm nay là thứ mấy?", en: "What day is it today?" },
      { cell_id: "92584f0c-d7d0-4695-8680-f2d8bce1f259", speaker: "B", th: "วันจันทร์ค่ะ", rtgs: "wan-jan khâ", vi: "Thứ Hai.", en: "Monday." },
      { cell_id: "7f3bc32a-55f7-487c-8db1-f5bc659b41bc", speaker: "A", th: "ตอนนี้กี่โมงครับ", rtgs: "tɔɔn-níi gìi moong khráp", vi: "Bây giờ mấy giờ?", en: "What time is it now?" },
      { cell_id: "aecffed7-00f5-447d-b88a-d36f8d9d5269", speaker: "B", th: "บ่ายสองค่ะ", rtgs: "bàai sɔ̌ɔng khâ", vi: "Hai giờ chiều.", en: "Two in the afternoon." },
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
      { cell_id: "8c23fe03-d762-4731-b41f-cf4374f9edb5", word: "กิน", rtgs: "gin", vi: "ăn", en: "to eat", pos: "verb" },
      { cell_id: "12acb1e4-1992-4f76-9f70-7c2160460960", word: "ดื่ม", rtgs: "dʉ̀ʉm", vi: "uống", en: "to drink", pos: "verb" },
      { cell_id: "05127e2e-3d14-400b-adf2-a5a5bc011043", word: "ไป", rtgs: "pai", vi: "đi", en: "to go", pos: "verb" },
      { cell_id: "9286daa7-7b6a-4846-ad81-c2177c880c02", word: "มา", rtgs: "maa", vi: "đến / lại", en: "to come", pos: "verb" },
      { cell_id: "29003445-f90d-4c19-9fed-5cc857b19fd1", word: "พูด", rtgs: "phûut", vi: "nói", en: "to speak", pos: "verb" },
      { cell_id: "94a27fe8-6f3a-43fe-bb50-01a0734f88de", word: "เข้าใจ", rtgs: "khâo-jai", vi: "hiểu", en: "to understand", pos: "verb" },
      { cell_id: "916ee1a2-48e4-472d-803e-425d1c689fbe", word: "ชอบ", rtgs: "chɔ̂ɔp", vi: "thích", en: "to like", pos: "verb" },
    ],
    dialogue: [
      { cell_id: "1be03c1c-6920-488d-b3fd-bb1d3b8ef5af", speaker: "A", th: "คุณชอบกินอะไรครับ", rtgs: "khun chɔ̂ɔp gin à-rai khráp", vi: "Bạn thích ăn gì?", en: "What do you like to eat?" },
      { cell_id: "12bf3b32-8ea9-47ac-b6e8-2948ed3c8a37", speaker: "B", th: "ฉันชอบกินผัดไทยค่ะ", rtgs: "chǎn chɔ̂ɔp gin phàt-thai khâ", vi: "Tôi thích ăn pad thai.", en: "I like to eat pad thai." },
      { cell_id: "42b145f5-e3d3-43e1-8c20-3087ac0ac164", speaker: "A", th: "ไปกินด้วยกันไหมครับ", rtgs: "pai gin dûay-gan mǎi khráp", vi: "Đi ăn cùng nhau không?", en: "Shall we go eat together?" },
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
      { cell_id: "96213b76-e488-4151-bf4b-7f9c881b7f27", word: "ขอ", rtgs: "khɔ̌ɔ", vi: "xin / cho (yêu cầu vật)", en: "may I have (request a thing)", pos: "verb" },
      { cell_id: "4bd4e6e9-e870-41c1-b650-1f021584b930", word: "ช่วย", rtgs: "chûay", vi: "giúp (nhờ làm việc)", en: "help / please (request an action)", pos: "verb" },
      { cell_id: "c7738c8b-fdf2-4dd1-8473-751c23060330", word: "หน่อย", rtgs: "nɔ̀i", vi: "một chút (làm mềm yêu cầu)", en: "a bit (softener)", pos: "particle" },
      { cell_id: "98a2bf6e-9a18-446c-816b-d63626f22511", word: "ได้ไหม", rtgs: "dâi mǎi", vi: "được không?", en: "can you? / may I?", pos: "phrase" },
      { cell_id: "b701b78f-9cb5-4661-9591-25e282746f9e", word: "กรุณา", rtgs: "gà-rú-naa", vi: "xin vui lòng (trang trọng)", en: "please (formal)", pos: "adverb" },
    ],
    dialogue: [
      { cell_id: "494efdaa-87cd-477f-8b90-01606eb0b86a", speaker: "A", th: "ขอเมนูหน่อยครับ", rtgs: "khɔ̌ɔ mee-nuu nɔ̀i khráp", vi: "Cho tôi xin thực đơn.", en: "May I have the menu, please." },
      { cell_id: "947876ba-8634-44da-b869-72ec5d19e25f", speaker: "B", th: "ได้ค่ะ สักครู่นะคะ", rtgs: "dâi khâ, sàk-khrûu ná khá", vi: "Được. Đợi một chút nhé.", en: "Sure. One moment, please." },
      { cell_id: "d8905d89-e6a9-482d-9f62-4b6d546f48cb", speaker: "A", th: "ช่วยคิดเงินด้วยครับ", rtgs: "chûay khít-ngən dûay khráp", vi: "Tính tiền giúp tôi với.", en: "Please bring the bill." },
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
      { cell_id: "f546a079-f632-417f-8572-69eb2e6b96df", word: "ชื่อ", rtgs: "chʉ̂ʉ", vi: "tên", en: "name", pos: "noun" },
      { cell_id: "d1475707-7a6c-4312-9377-43c569385fb9", word: "อะไร", rtgs: "à-rai", vi: "gì / cái gì", en: "what", pos: "pronoun" },
      { cell_id: "e543a354-2730-407e-88ca-bef57dace8a5", word: "มาจาก", rtgs: "maa jàak", vi: "đến từ", en: "to come from", pos: "verb phrase" },
      { cell_id: "4006b8f2-9d03-4d05-89ab-a4662f354621", word: "เวียดนาม", rtgs: "wîat-naam", vi: "Việt Nam", en: "Vietnam", pos: "noun" },
      { cell_id: "dd749e13-341c-4ac7-a2a6-e305911aa2c2", word: "ยินดีที่ได้รู้จัก", rtgs: "yin-dii thîi dâi rúu-jàk", vi: "rất vui được làm quen", en: "nice to meet you", pos: "phrase" },
    ],
    dialogue: [
      { cell_id: "2b74b9fc-3fce-49d0-9812-e2cdd86f8302", speaker: "A", th: "สวัสดีครับ ผมชื่อนาม คุณชื่ออะไรครับ", rtgs: "sà-wàt-dii khráp, phǒm chʉ̂ʉ Naam, khun chʉ̂ʉ à-rai khráp", vi: "Xin chào, tôi tên Nam. Bạn tên gì?", en: "Hello, my name is Nam. What's your name?" },
      { cell_id: "9c2c61c8-aa23-4a1e-8fd5-2fd4349beaeb", speaker: "B", th: "ดิฉันชื่อมาลีค่ะ ยินดีที่ได้รู้จักค่ะ", rtgs: "dì-chǎn chʉ̂ʉ Maalii khâ, yin-dii thîi dâi rúu-jàk khâ", vi: "Tôi tên Mali. Rất vui được làm quen.", en: "My name is Mali. Nice to meet you." },
      { cell_id: "6e320ec2-a7c2-4558-b28a-aec0aba27e96", speaker: "A", th: "ผมมาจากเวียดนามครับ", rtgs: "phǒm maa jàak wîat-naam khráp", vi: "Tôi đến từ Việt Nam.", en: "I'm from Vietnam." },
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
