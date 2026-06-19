// src/languages/thai/lessons-a2-core.ts
//
// Thai CEFR A2 "core" lesson batch for Vietnamese-speaking AND
// English-speaking learners.
//
// This module is intentionally SELF-CONTAINED: the Thai vertical does not yet
// ship a shared `./lessons` registry, a `./normalize` helper, or an `./index`
// barrel, so the types are declared inline here. When a shared Thai registry
// is added later, swap these to a type-only import. Nothing else in the Thai
// vertical is touched by this file.
//
// Audience: this is a "core" A2 batch, so every lesson carries BOTH a
// Vietnamese (`*_vi`) and an English (`*_en`) explanation side by side. Thai
// is written in Thai script first, then a learner-friendly romanization
// (`rtgs` — loosely Royal-Thai-General-System with tone/length hints in the
// focus notes). Romanization is a crutch, not the target: learners should aim
// to read the script.
//
// Word order is the heart of an A2 Thai pack for VI/EN speakers, so each
// lesson carries an explicit `word_order_note_vi` / `word_order_note_en`.
// Key facts both audiences need:
//   • Thai is SVO, like Vietnamese and English: Subject + Verb + Object.
//   • Verbs NEVER conjugate. Tense is carried by time words and the markers
//     จะ (jà, future) before the verb and แล้ว (láeo, completed) after it.
//   • Modifiers FOLLOW the noun, like Vietnamese: "big house" = บ้านใหญ่
//     (bâan yài, lit. "house big"), NOT "ใหญ่บ้าน". English speakers must flip.
//   • Counting uses Noun + Number + Classifier: รถสองคัน (rót sǎawng khan,
//     lit. "car two CL") = "two cars". Vietnamese has the same pattern
//     (hai chiếc xe ≈ "xe hai chiếc"); English speakers have to learn it fresh.
//
// Native review is DEFERRED — content is hand-derived from standard A2
// reference material; treat tone marks and register as provisional until a
// native speaker passes over it. No native-review claim is made.

// ── Types (inline — Thai vertical has no shared ./lessons yet) ──────────────

export type ThaiCategoryId =
  | "daily_life"
  | "past_future"
  | "classifiers"
  | "locations"
  | "transport"
  | "appointments"
  | "shopping"
  | "asking_help"
  | "family"
  | "opinions";

export type ThaiCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ThaiLessonSentence = {
  /** The Thai target sentence, in Thai script (the line the learner speaks). */
  th: string;
  /** Learner romanization (RTGS-ish; tone/length hints live in focus notes). */
  rtgs: string;
  /** Vietnamese meaning. */
  vi: string;
  /** English meaning. */
  en: string;
  /** Per-sentence word-order / grammar focus, written for a Vietnamese ear. */
  focus_vi: string[];
  /** English-speaker companion to focus_vi — same intent, EN-facing. */
  focus_en: string[];
};

export type ThaiVocabEntry = {
  /** Thai word in script. */
  word: string;
  /** Romanization. */
  rtgs: string;
  en: string;
  vi: string;
  pos: string;
  /** Classifier to use when counting this noun, where relevant (Thai script). */
  classifier?: string;
};

export type ThaiDialogueLine = {
  speaker: string;
  /** Thai line in script. */
  th: string;
  rtgs: string;
  vi?: string;
  en?: string;
};

/** An L1-interference note: the mistake a VI/EN learner makes + the fix. */
export type ThaiL1Note = {
  /** The wrong form a learner tends to produce. */
  mistake: string;
  /** The correct form / why, in Vietnamese. */
  fix_vi: string;
  /** The correct form / why, in English. */
  fix_en: string;
};

// Loosely typed so per-type exercise fields can vary (fill_blank / matching /
// translation), matching the other verticals' Exercise contract.
export type ThaiExercise = Record<string, unknown>;

export type ThaiLesson = {
  id: string;
  category: ThaiCategoryId;
  level: ThaiCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: ThaiLessonSentence[];
  /** Plain-language word-order explanation for Vietnamese speakers. */
  word_order_note_vi: string;
  /** Plain-language word-order explanation for English speakers. */
  word_order_note_en: string;
  cultural_notes_vi: string;
  cultural_notes_en: string;
  tip_advice_vi: string;
  tip_advice_en: string;
  l1_notes_vi?: ThaiL1Note[];
  vocabulary?: ThaiVocabEntry[];
  dialogue?: ThaiDialogueLine[];
  exercises?: ThaiExercise[];
};

// ── A2 core lessons ─────────────────────────────────────────────────────────

export const lessons: ThaiLesson[] = [
  // ── 1. Daily life & routine ───────────────────────────────────────────────
  {
    id: "thai_a2_daily_routine",
    level: "A2",
    category: "daily_life",
    title_vi: "Sinh hoạt hằng ngày",
    title_en: "Daily routine",
    sentences: [
      {
        th: "ฉันตื่นนอนตอนเจ็ดโมงเช้า",
        rtgs: "chǎn dtùen-naawn dtaawn jèt moong cháo",
        vi: "Tôi thức dậy lúc 7 giờ sáng.",
        en: "I wake up at 7 in the morning.",
        focus_vi: [
          "Trật tự: Chủ ngữ + động từ + 'ตอน (dtaawn) + giờ' — thời gian đứng sau.",
          "'โมงเช้า (moong cháo)' = giờ buổi sáng; 7 giờ sáng = 'เจ็ดโมงเช้า'.",
        ],
        focus_en: [
          "Order: Subject + verb + 'ตอน (dtaawn) + time' — the time phrase comes last.",
          "Thai tells morning hours with 'โมงเช้า (moong cháo)'; 7 a.m. = 'เจ็ดโมงเช้า'.",
        ],
      },
      {
        th: "ฉันกินข้าวเช้าแล้วไปทำงาน",
        rtgs: "chǎn gin khâao-cháo láeo bpai tham-ngaan",
        vi: "Tôi ăn sáng xong rồi đi làm.",
        en: "I eat breakfast, then go to work.",
        focus_vi: [
          "'แล้ว (láeo)' đứng SAU động từ nghĩa 'xong/rồi' — nối hai hành động.",
          "Không chia động từ: 'กิน (gin)' và 'ไป (bpai)' giữ nguyên.",
        ],
        focus_en: [
          "'แล้ว (láeo)' goes AFTER the verb = 'already / then', linking the two actions.",
          "No conjugation: 'กิน (gin)' and 'ไป (bpai)' never change form.",
        ],
      },
      {
        th: "ตอนเย็นฉันกลับบ้าน",
        rtgs: "dtaawn yen chǎn glàp bâan",
        vi: "Buổi chiều tối tôi về nhà.",
        en: "In the evening I go home.",
        focus_vi: [
          "Thời gian có thể đứng ĐẦU câu: 'ตอนเย็น (dtaawn yen)' = buổi chiều tối.",
          "'กลับบ้าน (glàp bâan)' = về nhà — một cụm cố định.",
        ],
        focus_en: [
          "The time phrase can also lead: 'ตอนเย็น (dtaawn yen)' = the evening.",
          "'กลับบ้าน (glàp bâan)' = 'return home' — learn it as one chunk.",
        ],
      },
      {
        th: "ทุกวันฉันออกกำลังกาย",
        rtgs: "thúk wan chǎn àawk-gam-lang-gaai",
        vi: "Mỗi ngày tôi tập thể dục.",
        en: "Every day I exercise.",
        focus_vi: [
          "'ทุกวัน (thúk wan)' = mỗi ngày, thường đứng đầu câu.",
          "'ออกกำลังกาย' là một động từ dài, đọc liền: àawk-gam-lang-gaai.",
        ],
        focus_en: [
          "'ทุกวัน (thúk wan)' = 'every day', usually fronted.",
          "'ออกกำลังกาย' is one long verb phrase: àawk-gam-lang-gaai.",
        ],
      },
      {
        th: "ฉันนอนตอนห้าทุ่ม",
        rtgs: "chǎn naawn dtaawn hâa thûm",
        vi: "Tôi đi ngủ lúc 11 giờ đêm.",
        en: "I go to bed at 11 p.m.",
        focus_vi: [
          "Giờ đêm dùng 'ทุ่ม (thûm)': ห้าทุ่ม (hâa thûm) = 11 giờ đêm (6+5).",
          "'นอน (naawn)' = ngủ; cùng từ cũng nghĩa 'nằm'.",
        ],
        focus_en: [
          "Night hours use 'ทุ่ม (thûm)': ห้าทุ่ม (hâa thûm) = 11 p.m. (6 + 5).",
          "'นอน (naawn)' = 'sleep' (also 'lie down').",
        ],
      },
    ],
    word_order_note_vi:
      "Thái là ngôn ngữ SVO giống tiếng Việt: Chủ ngữ + Động từ + Tân ngữ. Cụm thời gian linh hoạt — có thể đặt đầu câu ('ตอนเย็นฉันกลับบ้าน') hoặc cuối câu ('ฉันตื่นนอนตอนเจ็ดโมง'). Động từ KHÔNG bao giờ chia theo thì.",
    word_order_note_en:
      "Thai is SVO like English: Subject + Verb + Object. Time phrases are flexible — they can lead ('ตอนเย็นฉันกลับบ้าน') or trail ('ฉันตื่นนอนตอนเจ็ดโมง'). The verb NEVER conjugates for tense.",
    cultural_notes_vi:
      "Người Thái xem giờ theo nhiều 'hệ' trong ngày: เช้า (sáng), บ่าย (trưa-chiều), เย็น (chiều tối), ทุ่ม (tối đêm). Đây là phần khó nhất khi nói giờ — học theo từng buổi thay vì dịch thẳng từ 1–24.",
    cultural_notes_en:
      "Thai splits the day into spoken-clock zones: เช้า (morning), บ่าย (early afternoon), เย็น (evening), ทุ่ม (night). This zoned clock is the hardest part of telling time — learn it zone by zone instead of converting from a flat 1–24 clock.",
    tip_advice_vi:
      "Học 'แล้ว' (xong/rồi) và 'จะ' (sẽ) thật sớm — đây là hai 'công tắc thì' của tiếng Thái. Vì động từ không đổi, hai từ này gánh toàn bộ ý quá khứ/tương lai.",
    tip_advice_en:
      "Learn 'แล้ว' (completed) and 'จะ' (future) early — they are Thai's two 'tense switches'. Since verbs never change, these little words carry all the past/future meaning.",
    l1_notes_vi: [
      {
        mistake: "Cố chia động từ cho quá khứ (kiểu thêm đuôi).",
        fix_vi: "Thái không chia thì. Để chỉ quá khứ, dùng 'แล้ว' sau động từ hoặc từ thời gian như 'เมื่อวาน'.",
        fix_en: "Thai has no verb conjugation. Mark the past with 'แล้ว' after the verb or a time word like 'เมื่อวาน'.",
      },
      {
        mistake: "Dịch '7 giờ sáng' thành 'เจ็ดชั่วโมง'.",
        fix_vi: "'ชั่วโมง (chûa-moong)' là 'tiếng đồng hồ' (khoảng thời gian), không phải 'giờ trên đồng hồ'. Giờ sáng dùng 'โมงเช้า'.",
        fix_en: "'ชั่วโมง (chûa-moong)' means a duration ('hours'), not clock time. Clock hours in the morning use 'โมงเช้า'.",
      },
    ],
    vocabulary: [
      { word: "ตื่นนอน", rtgs: "dtùen-naawn", en: "to wake up", vi: "thức dậy", pos: "verb" },
      { word: "กิน", rtgs: "gin", en: "to eat", vi: "ăn", pos: "verb" },
      { word: "ทำงาน", rtgs: "tham-ngaan", en: "to work", vi: "làm việc", pos: "verb" },
      { word: "กลับบ้าน", rtgs: "glàp bâan", en: "to go home", vi: "về nhà", pos: "verb phrase" },
      { word: "ทุกวัน", rtgs: "thúk wan", en: "every day", vi: "mỗi ngày", pos: "adverb" },
      { word: "เช้า", rtgs: "cháo", en: "morning", vi: "buổi sáng", pos: "noun" },
    ],
    dialogue: [
      { speaker: "A", th: "ปกติคุณตื่นกี่โมง", rtgs: "bpòk-gà-dti khun dtùen gìi moong", vi: "Bình thường bạn dậy mấy giờ?", en: "What time do you usually wake up?" },
      { speaker: "B", th: "ตอนเจ็ดโมงเช้า แล้วคุณล่ะ", rtgs: "dtaawn jèt moong cháo, láeo khun lâ", vi: "Lúc 7 giờ sáng. Còn bạn?", en: "At 7 a.m. And you?" },
      { speaker: "A", th: "ผมตื่นหกโมง ผมไปทำงานเช้า", rtgs: "phǒm dtùen hòk moong, phǒm bpai tham-ngaan cháo", vi: "Tôi dậy 6 giờ, tôi đi làm sớm.", en: "I wake at six, I go to work early." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền 'แล้ว' hoặc 'จะ' cho đúng nghĩa:",
        instruction_en: "Fill in 'แล้ว' or 'จะ' to fit the meaning:",
        items: [
          { prompt: "ฉันกินข้าว ___ (đã ăn rồi)", answer: "แล้ว", options: ["แล้ว", "จะ"] },
          { prompt: "พรุ่งนี้ฉัน ___ ไปทำงาน (sẽ đi)", answer: "จะ", options: ["แล้ว", "จะ"] },
        ],
      },
    ],
  },

  // ── 2. Past & future markers ──────────────────────────────────────────────
  {
    id: "thai_a2_past_future_markers",
    level: "A2",
    category: "past_future",
    title_vi: "Dấu hiệu quá khứ và tương lai",
    title_en: "Past and future markers",
    sentences: [
      {
        th: "เมื่อวานฉันไปตลาด",
        rtgs: "mûea-waan chǎn bpai dtà-làat",
        vi: "Hôm qua tôi đi chợ.",
        en: "Yesterday I went to the market.",
        focus_vi: [
          "'เมื่อวาน (mûea-waan)' = hôm qua — chỉ riêng từ này đã đủ báo quá khứ.",
          "Không cần đổi 'ไป (bpai)' sang dạng quá khứ.",
        ],
        focus_en: [
          "'เมื่อวาน (mûea-waan)' = yesterday — this word alone signals the past.",
          "'ไป (bpai)' stays the same; no past form exists.",
        ],
      },
      {
        th: "ฉันกินข้าวแล้ว",
        rtgs: "chǎn gin khâao láeo",
        vi: "Tôi ăn cơm rồi.",
        en: "I have eaten already.",
        focus_vi: [
          "'แล้ว (láeo)' cuối câu = 'rồi/đã xong' — giống 'rồi' trong tiếng Việt.",
          "Đây là cách phổ biến nhất để nói hành động đã hoàn thành.",
        ],
        focus_en: [
          "Sentence-final 'แล้ว (láeo)' = 'already / done' — like a perfect tense.",
          "This is the most common way to say an action is completed.",
        ],
      },
      {
        th: "พรุ่งนี้ฉันจะไปเชียงใหม่",
        rtgs: "phrûng-níi chǎn jà bpai chiang-mài",
        vi: "Ngày mai tôi sẽ đi Chiang Mai.",
        en: "Tomorrow I will go to Chiang Mai.",
        focus_vi: [
          "'จะ (jà)' đứng TRƯỚC động từ = 'sẽ' — giống tiếng Việt đặt 'sẽ' trước.",
          "Trật tự: thời gian + chủ ngữ + จะ + động từ + nơi chốn.",
        ],
        focus_en: [
          "'จะ (jà)' goes BEFORE the verb = 'will'.",
          "Order: time + subject + จะ + verb + place.",
        ],
      },
      {
        th: "ฉันยังไม่ได้กินข้าว",
        rtgs: "chǎn yang mâi dâai gin khâao",
        vi: "Tôi vẫn chưa ăn cơm.",
        en: "I haven't eaten yet.",
        focus_vi: [
          "'ยังไม่ได้ (yang mâi dâai)' = 'vẫn chưa' — phủ định quá khứ.",
          "Đối lập với 'แล้ว': làm rồi ↔ chưa làm.",
        ],
        focus_en: [
          "'ยังไม่ได้ (yang mâi dâai)' = 'haven't … yet' — negates a past action.",
          "It is the opposite of 'แล้ว': done ↔ not yet.",
        ],
      },
      {
        th: "เขาจะมาตอนบ่ายสอง",
        rtgs: "kháo jà maa dtaawn bàai-sǎawng",
        vi: "Anh ấy sẽ đến lúc 2 giờ chiều.",
        en: "He will come at 2 p.m.",
        focus_vi: [
          "'เขา (kháo)' = anh/cô ấy (ngôi thứ ba chung).",
          "Giờ chiều đầu giờ dùng 'บ่าย (bàai)': บ่ายสอง = 2 giờ chiều.",
        ],
        focus_en: [
          "'เขา (kháo)' = he/she (a general third person).",
          "Early afternoon hours use 'บ่าย (bàai)': บ่ายสอง = 2 p.m.",
        ],
      },
    ],
    word_order_note_vi:
      "Quy tắc vàng: 'จะ' đứng TRƯỚC động từ (tương lai), 'แล้ว' đứng SAU động từ (đã xong). Từ thời gian (เมื่อวาน/พรุ่งนี้/วันนี้) thường ở đầu câu và một mình đã đủ chỉ thì — nhiều khi bỏ luôn cả 'จะ' và 'แล้ว'.",
    word_order_note_en:
      "Golden rule: 'จะ' comes BEFORE the verb (future), 'แล้ว' comes AFTER the verb (completed). Time words (เมื่อวาน/พรุ่งนี้/วันนี้) usually lead and can carry the tense on their own — often you can drop 'จะ' and 'แล้ว' entirely.",
    cultural_notes_vi:
      "Tiếng Thái rất thích 'ngữ cảnh là thì'. Trong hội thoại đời thường, người Thái dựa vào từ thời gian và bối cảnh hơn là đánh dấu mọi câu. Đừng nhồi 'จะ/แล้ว' vào mọi câu.",
    cultural_notes_en:
      "Thai leans hard on context for tense. In everyday talk, speakers rely on time words and shared context rather than marking every sentence. Don't sprinkle 'จะ/แล้ว' onto every line.",
    tip_advice_vi:
      "Tập một cặp tương phản mỗi ngày: 'กินแล้ว' (ăn rồi) ↔ 'ยังไม่ได้กิน' (chưa ăn) ↔ 'จะกิน' (sẽ ăn). Ba mẫu này phủ gần hết nhu cầu A2.",
    tip_advice_en:
      "Drill one contrast set a day: 'กินแล้ว' (ate) ↔ 'ยังไม่ได้กิน' (haven't eaten) ↔ 'จะกิน' (will eat). These three patterns cover most A2 needs.",
    l1_notes_vi: [
      {
        mistake: "Đặt 'แล้ว' trước động từ (kiểu 'แล้วกิน').",
        fix_vi: "'แล้ว' chỉ thì đứng SAU động từ: 'กินแล้ว'. ('แล้ว' đứng đầu là 'rồi thì…', nghĩa khác.)",
        fix_en: "Tense 'แล้ว' goes AFTER the verb: 'กินแล้ว'. (Sentence-initial 'แล้ว' means 'and then…', a different use.)",
      },
      {
        mistake: "Dùng 'ได้' ở mọi câu quá khứ.",
        fix_vi: "'ได้' không phải dấu quá khứ chung. Quá khứ đời thường dùng từ thời gian + 'แล้ว'. 'ได้' mang nghĩa 'được phép/làm được'.",
        fix_en: "'ได้' is not a general past marker. Everyday past uses a time word + 'แล้ว'. 'ได้' means 'can / was able to / got to'.",
      },
    ],
    vocabulary: [
      { word: "เมื่อวาน", rtgs: "mûea-waan", en: "yesterday", vi: "hôm qua", pos: "noun" },
      { word: "พรุ่งนี้", rtgs: "phrûng-níi", en: "tomorrow", vi: "ngày mai", pos: "noun" },
      { word: "วันนี้", rtgs: "wan-níi", en: "today", vi: "hôm nay", pos: "noun" },
      { word: "จะ", rtgs: "jà", en: "will (future)", vi: "sẽ", pos: "marker" },
      { word: "แล้ว", rtgs: "láeo", en: "already / completed", vi: "rồi / đã xong", pos: "marker" },
      { word: "ยัง", rtgs: "yang", en: "still / yet", vi: "vẫn / còn", pos: "marker" },
    ],
    dialogue: [
      { speaker: "A", th: "เมื่อวานคุณทำอะไร", rtgs: "mûea-waan khun tham à-rai", vi: "Hôm qua bạn làm gì?", en: "What did you do yesterday?" },
      { speaker: "B", th: "ผมไปตลาด แล้วคุณจะทำอะไรพรุ่งนี้", rtgs: "phǒm bpai dtà-làat, láeo khun jà tham à-rai phrûng-níi", vi: "Tôi đi chợ. Mai bạn sẽ làm gì?", en: "I went to the market. What will you do tomorrow?" },
      { speaker: "A", th: "ฉันจะไปเชียงใหม่", rtgs: "chǎn jà bpai chiang-mài", vi: "Tôi sẽ đi Chiang Mai.", en: "I'll go to Chiang Mai." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Thái (chú ý vị trí 'จะ' / 'แล้ว'):",
        instruction_en: "Translate into Thai (mind 'จะ' / 'แล้ว' placement):",
        items: [
          { prompt: "Ngày mai tôi sẽ đi làm.", answer: "พรุ่งนี้ฉันจะไปทำงาน" },
          { prompt: "Tôi ăn cơm rồi.", answer: "ฉันกินข้าวแล้ว" },
        ],
      },
    ],
  },

  // ── 3. Classifiers ────────────────────────────────────────────────────────
  {
    id: "thai_a2_classifiers",
    level: "A2",
    category: "classifiers",
    title_vi: "Loại từ (đơn vị đếm)",
    title_en: "Classifiers (counting words)",
    sentences: [
      {
        th: "ฉันมีพี่น้องสองคน",
        rtgs: "chǎn mii phîi-náawng sǎawng khon",
        vi: "Tôi có hai anh chị em.",
        en: "I have two siblings.",
        focus_vi: [
          "Mẫu: Danh từ + Số + Loại từ → 'พี่น้อง สอง คน'.",
          "'คน (khon)' là loại từ cho NGƯỜI — luôn dùng khi đếm người.",
        ],
        focus_en: [
          "Pattern: Noun + Number + Classifier → 'พี่น้อง สอง คน'.",
          "'คน (khon)' is the classifier for PEOPLE — always use it to count people.",
        ],
      },
      {
        th: "ขอน้ำหนึ่งขวด",
        rtgs: "khǎaw náam nùeng khùuat",
        vi: "Cho tôi một chai nước.",
        en: "One bottle of water, please.",
        focus_vi: [
          "'ขวด (khùuat)' = loại từ cho 'chai'.",
          "'ขอ (khǎaw)' = 'cho/xin' — mở đầu lịch sự khi yêu cầu.",
        ],
        focus_en: [
          "'ขวด (khùuat)' = the classifier 'bottle'.",
          "'ขอ (khǎaw)' = 'may I have' — a polite request opener.",
        ],
      },
      {
        th: "มีรถสามคัน",
        rtgs: "mii rót sǎam khan",
        vi: "Có ba chiếc xe.",
        en: "There are three cars.",
        focus_vi: [
          "'คัน (khan)' = loại từ cho XE CỘ và một số vật có tay cầm/cán.",
          "'มี (mii)' = 'có' — mở đầu câu tồn tại.",
        ],
        focus_en: [
          "'คัน (khan)' classifies VEHICLES (and some long-handled items).",
          "'มี (mii)' = 'there is/are' / 'to have'.",
        ],
      },
      {
        th: "ฉันซื้อหนังสือสองเล่ม",
        rtgs: "chǎn súe nǎng-sǔe sǎawng lêm",
        vi: "Tôi mua hai quyển sách.",
        en: "I bought two books.",
        focus_vi: [
          "'เล่ม (lêm)' = loại từ cho sách/vở.",
          "Vẫn giữ mẫu: หนังสือ (sách) + สอง (hai) + เล่ม (quyển).",
        ],
        focus_en: [
          "'เล่ม (lêm)' classifies books and notebooks.",
          "Same pattern: หนังสือ (book) + สอง (two) + เล่ม (CL).",
        ],
      },
      {
        th: "ที่บ้านมีแมวสี่ตัว",
        rtgs: "thîi-bâan mii maaeo sìi dtua",
        vi: "Ở nhà có bốn con mèo.",
        en: "At home there are four cats.",
        focus_vi: [
          "'ตัว (dtua)' = loại từ cho ĐỘNG VẬT và quần áo.",
          "'ที่บ้าน (thîi-bâan)' = 'ở nhà' đứng đầu làm trạng ngữ nơi chốn.",
        ],
        focus_en: [
          "'ตัว (dtua)' classifies ANIMALS and clothing.",
          "'ที่บ้าน (thîi-bâan)' = 'at home' leads as a place adverb.",
        ],
      },
    ],
    word_order_note_vi:
      "Loại từ Thái theo mẫu Danh từ + Số + Loại từ (รถ + สอง + คัน). Tiếng Việt cũng có loại từ (hai CHIẾC xe) nhưng đặt TRƯỚC danh từ; người Việt phải đảo thứ tự. Khi chỉ 'cái này/cái kia', dùng Danh từ + Loại từ + นี้/นั้น: 'รถคันนี้' = chiếc xe này.",
    word_order_note_en:
      "Thai classifiers follow Noun + Number + Classifier (รถ + สอง + คัน). English has no everyday classifiers, so this is brand-new — learn each noun's classifier as part of the word. For 'this/that', use Noun + Classifier + นี้/นั้น: 'รถคันนี้' = 'this car'.",
    cultural_notes_vi:
      "Mỗi danh từ có loại từ 'mặc định'. Nếu quên, người Thái thường tha thứ khi bạn lặp lại chính danh từ (รถสองรถ) hoặc dùng 'อัน (an)' chung cho vật nhỏ — nhưng dùng đúng loại từ nghe tự nhiên hơn nhiều.",
    cultural_notes_en:
      "Every noun has a default classifier. If you forget, Thais usually forgive repeating the noun (รถสองรถ) or the catch-all 'อัน (an)' for small objects — but the right classifier sounds far more natural.",
    tip_advice_vi:
      "Học loại từ KÈM danh từ ngay từ đầu: không học 'รถ' mà học 'รถ–คัน'. Năm loại từ cốt lõi A2: คน (người), ตัว (động vật/áo quần), คัน (xe), เล่ม (sách), ใบ (giấy/lá/đồ chứa).",
    tip_advice_en:
      "Memorize the classifier WITH the noun from day one: not 'รถ' but 'รถ–คัน'. Five core A2 classifiers: คน (people), ตัว (animals/clothes), คัน (vehicles), เล่ม (books), ใบ (paper/leaves/containers).",
    l1_notes_vi: [
      {
        mistake: "Bỏ loại từ: nói 'รถสอง' thay vì 'รถสองคัน'.",
        fix_vi: "Khi đếm phải có loại từ: Danh từ + Số + Loại từ. 'รถสองคัน'.",
        fix_en: "Counting requires a classifier: Noun + Number + Classifier. 'รถสองคัน'.",
      },
      {
        mistake: "(Người Việt) đặt loại từ trước danh từ: 'คันรถสอง'.",
        fix_vi: "Tiếng Thái đảo so với tiếng Việt: loại từ đứng SAU số, ở CUỐI: 'รถสองคัน'.",
        fix_en: "Order is Noun–Number–Classifier, with the classifier LAST: 'รถสองคัน'.",
      },
    ],
    vocabulary: [
      { word: "คน", rtgs: "khon", en: "classifier: people", vi: "loại từ: người", pos: "classifier" },
      { word: "ตัว", rtgs: "dtua", en: "classifier: animals/clothes", vi: "loại từ: động vật/quần áo", pos: "classifier" },
      { word: "คัน", rtgs: "khan", en: "classifier: vehicles", vi: "loại từ: xe", pos: "classifier" },
      { word: "เล่ม", rtgs: "lêm", en: "classifier: books", vi: "loại từ: sách", pos: "classifier" },
      { word: "ใบ", rtgs: "bai", en: "classifier: paper/containers", vi: "loại từ: giấy/đồ chứa", pos: "classifier" },
      { word: "อัน", rtgs: "an", en: "classifier: small objects (general)", vi: "loại từ chung: vật nhỏ", pos: "classifier" },
    ],
    dialogue: [
      { speaker: "A", th: "คุณมีพี่น้องกี่คน", rtgs: "khun mii phîi-náawng gìi khon", vi: "Bạn có mấy anh chị em?", en: "How many siblings do you have?" },
      { speaker: "B", th: "สามคนครับ คุณล่ะ", rtgs: "sǎam khon khráp, khun lâ", vi: "Ba người ạ. Còn bạn?", en: "Three. And you?" },
      { speaker: "A", th: "ฉันมีพี่สาวสองคน", rtgs: "chǎn mii phîi-sǎao sǎawng khon", vi: "Tôi có hai chị gái.", en: "I have two older sisters." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối danh từ với loại từ đúng:",
        instruction_en: "Match each noun to its classifier:",
        items: [
          { prompt: "หมา (chó)", answer: "ตัว" },
          { prompt: "หนังสือ (sách)", answer: "เล่ม" },
          { prompt: "รถ (xe)", answer: "คัน" },
        ],
      },
    ],
  },

  // ── 4. Locations & directions ─────────────────────────────────────────────
  {
    id: "thai_a2_locations",
    level: "A2",
    category: "locations",
    title_vi: "Địa điểm và phương hướng",
    title_en: "Locations and directions",
    sentences: [
      {
        th: "ห้องน้ำอยู่ที่ไหน",
        rtgs: "hâawng-náam yùu thîi-nǎi",
        vi: "Nhà vệ sinh ở đâu?",
        en: "Where is the toilet?",
        focus_vi: [
          "'อยู่ (yùu)' = 'ở' (vị trí); 'ที่ไหน (thîi-nǎi)' = 'ở đâu'.",
          "Mẫu hỏi vị trí: [Nơi] + อยู่ที่ไหน.",
        ],
        focus_en: [
          "'อยู่ (yùu)' = 'to be located'; 'ที่ไหน (thîi-nǎi)' = 'where'.",
          "Location question pattern: [Place] + อยู่ที่ไหน.",
        ],
      },
      {
        th: "ธนาคารอยู่ใกล้ตลาด",
        rtgs: "thá-naa-khaan yùu glâi dtà-làat",
        vi: "Ngân hàng ở gần chợ.",
        en: "The bank is near the market.",
        focus_vi: [
          "'ใกล้ (glâi)' = gần; 'ไกล (glai)' = xa — nghe rất giống, chú ý thanh.",
          "Mẫu: A + อยู่ + (giới từ) + B.",
        ],
        focus_en: [
          "'ใกล้ (glâi)' = near; 'ไกล (glai)' = far — nearly identical, mind the tone.",
          "Pattern: A + อยู่ + (preposition) + B.",
        ],
      },
      {
        th: "ร้านอาหารอยู่ตรงข้ามโรงแรม",
        rtgs: "ráan-aa-hǎan yùu dtrong-khâam roong-raaem",
        vi: "Nhà hàng ở đối diện khách sạn.",
        en: "The restaurant is opposite the hotel.",
        focus_vi: [
          "'ตรงข้าม (dtrong-khâam)' = đối diện.",
          "Giới từ vị trí đứng giữa 'อยู่' và danh từ mốc.",
        ],
        focus_en: [
          "'ตรงข้าม (dtrong-khâam)' = opposite / across from.",
          "The position word sits between 'อยู่' and the landmark noun.",
        ],
      },
      {
        th: "บ้านฉันอยู่หลังโรงเรียน",
        rtgs: "bâan chǎn yùu lǎng roong-rian",
        vi: "Nhà tôi ở phía sau trường học.",
        en: "My house is behind the school.",
        focus_vi: [
          "'หลัง (lǎng)' = phía sau; 'หน้า (nâa)' = phía trước.",
          "'บ้านฉัน' = nhà tôi: sở hữu đứng SAU (danh từ + người sở hữu).",
        ],
        focus_en: [
          "'หลัง (lǎng)' = behind; 'หน้า (nâa)' = in front of.",
          "'บ้านฉัน' = 'my house': possessor follows the noun (noun + owner).",
        ],
      },
      {
        th: "เลี้ยวซ้ายแล้วตรงไป",
        rtgs: "líao sáai láeo dtrong bpai",
        vi: "Rẽ trái rồi đi thẳng.",
        en: "Turn left, then go straight.",
        focus_vi: [
          "'เลี้ยวซ้าย (líao sáai)' = rẽ trái; 'เลี้ยวขวา (líao khwǎa)' = rẽ phải.",
          "'แล้ว' nối hai mệnh lệnh: rẽ trái RỒI đi thẳng.",
        ],
        focus_en: [
          "'เลี้ยวซ้าย (líao sáai)' = turn left; 'เลี้ยวขวา (líao khwǎa)' = turn right.",
          "'แล้ว' links the two commands: turn left, THEN go straight.",
        ],
      },
    ],
    word_order_note_vi:
      "Mẫu vị trí: [Vật A] + อยู่ + giới từ vị trí (ใกล้/ไกล/หน้า/หลัง/ตรงข้าม) + [Mốc B]. Sở hữu trong tiếng Thái đặt SAU danh từ: 'บ้านฉัน' = 'nhà' + 'tôi' — giống tiếng Việt, ngược với tiếng Anh ('my house').",
    word_order_note_en:
      "Location pattern: [Thing A] + อยู่ + position word (ใกล้/ไกล/หน้า/หลัง/ตรงข้าม) + [Landmark B]. Possession comes AFTER the noun: 'บ้านฉัน' = 'house' + 'I' = 'my house'. English speakers must flip from 'my house'.",
    cultural_notes_vi:
      "Người Thái hay chỉ đường theo MỐC (ร้านสะดวกซื้อ 7-11, วัด, ห้าง) thay vì tên đường hay số nhà. Học tên các mốc quen thuộc sẽ giúp bạn hiểu chỉ dẫn nhanh hơn nhiều.",
    cultural_notes_en:
      "Thais give directions by LANDMARK (a 7-Eleven, a temple วัด, a mall) far more than by street name or house number. Learning common landmark words helps you follow directions much faster.",
    tip_advice_vi:
      "Nắm cặp đối lập: ใกล้/ไกล, หน้า/หลัง, ซ้าย/ขวา. Và một câu thần chú: '...อยู่ที่ไหน' để hỏi mọi địa điểm.",
    tip_advice_en:
      "Lock in the opposites: ใกล้/ไกล, หน้า/หลัง, ซ้าย/ขวา. And one magic question: '…อยู่ที่ไหน' to ask where anything is.",
    l1_notes_vi: [
      {
        mistake: "Bỏ 'อยู่' khi nói vị trí: 'ห้องน้ำที่ไหน'.",
        fix_vi: "Câu vị trí cần 'อยู่': 'ห้องน้ำอยู่ที่ไหน'. 'อยู่' là động từ 'ở/tọa lạc'.",
        fix_en: "Location sentences need 'อยู่': 'ห้องน้ำอยู่ที่ไหน'. 'อยู่' is the verb 'to be located'.",
      },
      {
        mistake: "Lẫn 'ใกล้ (gần)' với 'ไกล (xa)'.",
        fix_vi: "Khác thanh điệu: ใกล้ (glâi, thanh xuống) = gần; ไกล (glai, thanh giữa) = xa. Nói sai là ngược nghĩa.",
        fix_en: "Tone matters: ใกล้ (glâi, falling) = near; ไกล (glai, mid) = far. The wrong tone reverses the meaning.",
      },
    ],
    vocabulary: [
      { word: "อยู่", rtgs: "yùu", en: "to be located / to live", vi: "ở / tọa lạc", pos: "verb" },
      { word: "ที่ไหน", rtgs: "thîi-nǎi", en: "where", vi: "ở đâu", pos: "question" },
      { word: "ใกล้", rtgs: "glâi", en: "near", vi: "gần", pos: "preposition" },
      { word: "ตรงข้าม", rtgs: "dtrong-khâam", en: "opposite", vi: "đối diện", pos: "preposition" },
      { word: "เลี้ยวซ้าย", rtgs: "líao sáai", en: "turn left", vi: "rẽ trái", pos: "verb phrase" },
      { word: "ตรงไป", rtgs: "dtrong bpai", en: "go straight", vi: "đi thẳng", pos: "verb phrase" },
    ],
    dialogue: [
      { speaker: "A", th: "ขอโทษ สถานีรถไฟฟ้าอยู่ที่ไหน", rtgs: "khǎaw-thôot, sà-thǎa-nii rót-fai-fáa yùu thîi-nǎi", vi: "Xin lỗi, ga tàu điện ở đâu?", en: "Excuse me, where is the skytrain station?" },
      { speaker: "B", th: "ตรงไปแล้วเลี้ยวขวา อยู่ใกล้ห้าง", rtgs: "dtrong bpai láeo líao khwǎa, yùu glâi hâang", vi: "Đi thẳng rồi rẽ phải, ở gần trung tâm thương mại.", en: "Go straight then turn right; it's near the mall." },
      { speaker: "A", th: "ขอบคุณมากครับ", rtgs: "khàawp-khun mâak khráp", vi: "Cảm ơn nhiều ạ.", en: "Thank you very much." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền giới từ vị trí đúng:",
        instruction_en: "Fill in the right position word:",
        items: [
          { prompt: "ธนาคาร ___ ตลาด (gần)", answer: "ใกล้", options: ["ใกล้", "ไกล", "หลัง"] },
          { prompt: "ร้าน ___ โรงแรม (đối diện)", answer: "ตรงข้าม", options: ["ตรงข้าม", "หน้า", "ใกล้"] },
        ],
      },
    ],
  },

  // ── 5. Transport ──────────────────────────────────────────────────────────
  {
    id: "thai_a2_transport",
    level: "A2",
    category: "transport",
    title_vi: "Phương tiện đi lại",
    title_en: "Transport",
    sentences: [
      {
        th: "ฉันไปทำงานโดยรถไฟฟ้า",
        rtgs: "chǎn bpai tham-ngaan dooy rót-fai-fáa",
        vi: "Tôi đi làm bằng tàu điện trên cao.",
        en: "I go to work by skytrain (BTS).",
        focus_vi: [
          "'โดย (dooy)' = 'bằng' (phương tiện): โดยรถไฟฟ้า = bằng tàu điện.",
          "'รถไฟฟ้า (rót-fai-fáa)' = tàu điện trên cao (BTS).",
        ],
        focus_en: [
          "'โดย (dooy)' = 'by' (means): โดยรถไฟฟ้า = by skytrain.",
          "'รถไฟฟ้า (rót-fai-fáa)' = the elevated train (BTS).",
        ],
      },
      {
        th: "ขึ้นรถเมล์สายไหน",
        rtgs: "khûen rót-mee sǎai nǎi",
        vi: "Đi xe buýt tuyến nào?",
        en: "Which bus do I take?",
        focus_vi: [
          "'ขึ้น (khûen)' = lên (xe/tàu); ngược lại 'ลง (long)' = xuống.",
          "'สายไหน (sǎai nǎi)' = tuyến nào — 'สาย' = tuyến/đường dây.",
        ],
        focus_en: [
          "'ขึ้น (khûen)' = to board / get on; opposite 'ลง (long)' = to get off.",
          "'สายไหน (sǎai nǎi)' = which line/route — 'สาย' = a route.",
        ],
      },
      {
        th: "ไปสนามบินเท่าไหร่",
        rtgs: "bpai sà-nǎam-bin thâo-rài",
        vi: "Đi ra sân bay bao nhiêu (tiền)?",
        en: "How much to the airport?",
        focus_vi: [
          "'เท่าไหร่ (thâo-rài)' = bao nhiêu — hỏi giá.",
          "Câu rút gọn: '(đi) đến X bao nhiêu' rất thông dụng với taxi/tuk-tuk.",
        ],
        focus_en: [
          "'เท่าไหร่ (thâo-rài)' = how much — asks price.",
          "The clipped '(go) to X how much' is standard with taxis/tuk-tuks.",
        ],
      },
      {
        th: "รถไฟออกกี่โมง",
        rtgs: "rót-fai àawk gìi moong",
        vi: "Tàu hỏa chạy lúc mấy giờ?",
        en: "What time does the train leave?",
        focus_vi: [
          "'ออก (àawk)' = khởi hành/ra; 'กี่โมง (gìi moong)' = mấy giờ.",
          "'รถไฟ (rót-fai)' = tàu hỏa, khác 'รถไฟฟ้า' (tàu điện).",
        ],
        focus_en: [
          "'ออก (àawk)' = to depart / leave; 'กี่โมง (gìi moong)' = what time.",
          "'รถไฟ (rót-fai)' = train, distinct from 'รถไฟฟ้า' (skytrain).",
        ],
      },
      {
        th: "ฉันจะนั่งแท็กซี่",
        rtgs: "chǎn jà nâng tháek-sîi",
        vi: "Tôi sẽ đi taxi.",
        en: "I'll take a taxi.",
        focus_vi: [
          "'นั่ง (nâng)' = ngồi → dùng cho 'đi (bằng) taxi/xe/tàu'.",
          "'จะ' báo tương lai: 'sẽ đi taxi'.",
        ],
        focus_en: [
          "'นั่ง (nâng)' = to sit → used for 'take/ride' a taxi/bus/train.",
          "'จะ' marks the future: 'will take a taxi'.",
        ],
      },
    ],
    word_order_note_vi:
      "Phương tiện diễn đạt bằng 'โดย (dooy) + xe' HOẶC bằng động từ 'นั่ง (ngồi)' / 'ขึ้น (lên)'. Trật tự cơ bản: Chủ ngữ + ไป (đi) + nơi đến + โดย + phương tiện. Hỏi giá đặt 'เท่าไหร่' ở CUỐI câu.",
    word_order_note_en:
      "Means of transport use 'โดย (dooy) + vehicle' OR the verbs 'นั่ง (sit/ride)' / 'ขึ้น (board)'. Basic order: Subject + ไป (go) + destination + โดย + vehicle. Price questions put 'เท่าไหร่' at the END.",
    cultural_notes_vi:
      "Bangkok có BTS (รถไฟฟ้า), MRT (รถไฟใต้ดิน), xe buýt (รถเมล์), taxi đồng hồ, và tuk-tuk/xe ôm trả giá. Với taxi luôn hỏi 'มิเตอร์ไหม' (đi đồng hồ không?). Tuk-tuk thì mặc cả trước khi lên.",
    cultural_notes_en:
      "Bangkok has the BTS (รถไฟฟ้า), MRT subway (รถไฟใต้ดิน), buses (รถเมล์), metered taxis, and bargain tuk-tuks/motorbike taxis. With taxis, ask 'มิเตอร์ไหม' (meter?). Agree a tuk-tuk price before boarding.",
    tip_advice_vi:
      "Thuộc cặp ขึ้น (lên) / ลง (xuống) và câu 'ไป...เท่าไหร่' để đi taxi. Phân biệt รถไฟ (tàu hỏa) với รถไฟฟ้า (tàu điện) — chỉ khác một chữ.",
    tip_advice_en:
      "Master ขึ้น (get on) / ลง (get off) and 'ไป…เท่าไหร่' for taxis. Don't confuse รถไฟ (train) with รถไฟฟ้า (skytrain) — one syllable apart.",
    l1_notes_vi: [
      {
        mistake: "Dùng 'ไป (đi)' cho 'đi bằng taxi': 'ไปแท็กซี่'.",
        fix_vi: "Đi bằng phương tiện dùng 'นั่ง' hoặc 'ขึ้น': 'นั่งแท็กซี่'. 'ไปแท็กซี่' nghe như 'đi tới (chỗ) taxi'.",
        fix_en: "Use 'นั่ง' or 'ขึ้น' for taking a vehicle: 'นั่งแท็กซี่'. 'ไปแท็กซี่' sounds like 'go to the taxi'.",
      },
      {
        mistake: "Đặt 'เท่าไหร่' đầu câu kiểu tiếng Anh ('how much…').",
        fix_vi: "Từ hỏi giá đứng CUỐI: 'ไปสนามบินเท่าไหร่', không phải 'เท่าไหร่ไปสนามบิน'.",
        fix_en: "The price word goes LAST: 'ไปสนามบินเท่าไหร่', not 'เท่าไหร่ไปสนามบิน'.",
      },
    ],
    vocabulary: [
      { word: "รถไฟฟ้า", rtgs: "rót-fai-fáa", en: "skytrain (BTS)", vi: "tàu điện trên cao", pos: "noun", classifier: "ขบวน" },
      { word: "รถเมล์", rtgs: "rót-mee", en: "city bus", vi: "xe buýt", pos: "noun", classifier: "คัน" },
      { word: "แท็กซี่", rtgs: "tháek-sîi", en: "taxi", vi: "taxi", pos: "noun", classifier: "คัน" },
      { word: "ขึ้น", rtgs: "khûen", en: "to board / get on", vi: "lên (xe)", pos: "verb" },
      { word: "ลง", rtgs: "long", en: "to get off", vi: "xuống (xe)", pos: "verb" },
      { word: "สนามบิน", rtgs: "sà-nǎam-bin", en: "airport", vi: "sân bay", pos: "noun" },
    ],
    dialogue: [
      { speaker: "A", th: "ไปสยามนั่งอะไรดี", rtgs: "bpai sà-yǎam nâng à-rai dii", vi: "Đi Siam nên đi bằng gì?", en: "What's the best way to get to Siam?" },
      { speaker: "B", th: "นั่งรถไฟฟ้าเร็วที่สุด", rtgs: "nâng rót-fai-fáa reo thîi-sùt", vi: "Đi tàu điện nhanh nhất.", en: "The skytrain is fastest." },
      { speaker: "A", th: "ขึ้นที่สถานีไหน", rtgs: "khûen thîi sà-thǎa-nii nǎi", vi: "Lên ở ga nào?", en: "Which station do I board at?" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền 'ขึ้น' hoặc 'ลง':",
        instruction_en: "Fill in 'ขึ้น' (board) or 'ลง' (get off):",
        items: [
          { prompt: "___ รถเมล์ที่ป้ายหน้า (lên)", answer: "ขึ้น", options: ["ขึ้น", "ลง"] },
          { prompt: "___ ที่สถานีต่อไป (xuống)", answer: "ลง", options: ["ขึ้น", "ลง"] },
        ],
      },
    ],
  },

  // ── 6. Appointments & time ────────────────────────────────────────────────
  {
    id: "thai_a2_appointments",
    level: "A2",
    category: "appointments",
    title_vi: "Hẹn gặp và thời gian",
    title_en: "Appointments and time",
    sentences: [
      {
        th: "ฉันมีนัดตอนบ่ายสามโมง",
        rtgs: "chǎn mii nát dtaawn bàai-sǎam moong",
        vi: "Tôi có hẹn lúc 3 giờ chiều.",
        en: "I have an appointment at 3 p.m.",
        focus_vi: [
          "'นัด (nát)' = cuộc hẹn (cả danh từ và động từ 'hẹn').",
          "'บ่ายสามโมง (bàai-sǎam moong)' = 3 giờ chiều (giờ chiều dùng 'บ่าย').",
        ],
        focus_en: [
          "'นัด (nát)' = an appointment (also the verb 'to arrange to meet').",
          "'บ่ายสามโมง (bàai-sǎam moong)' = 3 p.m. (afternoon hours use 'บ่าย').",
        ],
      },
      {
        th: "เราเจอกันพรุ่งนี้ได้ไหม",
        rtgs: "rao jeu gan phrûng-níi dâai mái",
        vi: "Ngày mai mình gặp nhau được không?",
        en: "Can we meet tomorrow?",
        focus_vi: [
          "'ได้ไหม (dâai mái)' cuối câu = '...được không?' — hỏi xin phép/khả năng.",
          "'เจอกัน (jeu gan)' = gặp nhau; 'กัน (gan)' = lẫn nhau.",
        ],
        focus_en: [
          "Sentence-final 'ได้ไหม (dâai mái)' = '…can we / is it OK?'.",
          "'เจอกัน (jeu gan)' = meet each other; 'กัน (gan)' = 'each other'.",
        ],
      },
      {
        th: "ขอเลื่อนนัดได้ไหม",
        rtgs: "khǎaw lûean nát dâai mái",
        vi: "Cho tôi dời lịch hẹn được không?",
        en: "Can I reschedule the appointment?",
        focus_vi: [
          "'เลื่อน (lûean)' = dời/hoãn (sang lúc khác).",
          "'ขอ...ได้ไหม' = mẫu xin phép lịch sự.",
        ],
        focus_en: [
          "'เลื่อน (lûean)' = to postpone / move (to another time).",
          "'ขอ…ได้ไหม' = a polite 'may I…?' frame.",
        ],
      },
      {
        th: "คุณว่างวันไหน",
        rtgs: "khun wâang wan nǎi",
        vi: "Bạn rảnh ngày nào?",
        en: "Which day are you free?",
        focus_vi: [
          "'ว่าง (wâang)' = rảnh, trống lịch.",
          "'วันไหน (wan nǎi)' = ngày nào — từ hỏi đứng cuối.",
        ],
        focus_en: [
          "'ว่าง (wâang)' = free / available.",
          "'วันไหน (wan nǎi)' = which day — the question word goes last.",
        ],
      },
      {
        th: "เจอกันที่หน้าร้านกาแฟ",
        rtgs: "jeu gan thîi nâa ráan-gaa-faae",
        vi: "Gặp nhau ở trước quán cà phê nhé.",
        en: "Let's meet in front of the coffee shop.",
        focus_vi: [
          "'ที่ (thîi)' = 'ở/tại' giới thiệu nơi chốn.",
          "'หน้า (nâa)' = phía trước; 'ร้านกาแฟ' = quán cà phê.",
        ],
        focus_en: [
          "'ที่ (thîi)' = 'at' introduces the place.",
          "'หน้า (nâa)' = in front of; 'ร้านกาแฟ' = coffee shop.",
        ],
      },
    ],
    word_order_note_vi:
      "Câu xin phép/đề nghị lịch sự dựng quanh đuôi '...ได้ไหม' (được không?) ở CUỐI câu, và mở đầu '..ขอ' (xin/cho). Từ hỏi (วันไหน, กี่โมง) cũng đứng cuối, khác hẳn tiếng Anh đưa 'which/what' lên đầu.",
    word_order_note_en:
      "Polite requests are built around final '…ได้ไหม' (…is that OK?) and an opening 'ขอ' (may I have). Question words (วันไหน 'which day', กี่โมง 'what time') also sit at the END — the reverse of English fronting 'which/what'.",
    cultural_notes_vi:
      "Người Thái coi trọng 'เกรงใจ' (kreng-jai, ngại làm phiền). Khi dời hẹn, nên xin lỗi nhẹ và dùng '...ได้ไหม' cho mềm mỏng, đừng ra lệnh. Đúng giờ được đánh giá cao trong công việc.",
    cultural_notes_en:
      "Thais value 'เกรงใจ' (kreng-jai, not wanting to impose). When rescheduling, soften with a light apology and '…ได้ไหม' rather than a command. Punctuality is respected in professional settings.",
    tip_advice_vi:
      "Một khung câu vạn năng: 'ขอ + [việc] + ได้ไหม' = 'cho tôi ... được không?'. Dùng để hỏi mượn, dời hẹn, xin thêm — cực kỳ hữu ích ở trình độ A2.",
    tip_advice_en:
      "One all-purpose frame: 'ขอ + [thing] + ได้ไหม' = 'may I … please?'. Use it to borrow, reschedule, ask for more — hugely useful at A2.",
    l1_notes_vi: [
      {
        mistake: "Đưa từ hỏi lên đầu kiểu tiếng Anh: 'วันไหนคุณว่าง'.",
        fix_vi: "Tự nhiên hơn: 'คุณว่างวันไหน' — từ hỏi ở cuối.",
        fix_en: "More natural: 'คุณว่างวันไหน' — question word last.",
      },
      {
        mistake: "Quên đuôi '...ไหม/...ได้ไหม' khiến câu thành ra lệnh.",
        fix_vi: "Thêm 'ได้ไหม' để thành câu hỏi lịch sự: 'เลื่อนนัดได้ไหม' thay vì 'เลื่อนนัด'.",
        fix_en: "Add 'ได้ไหม' to make it a polite question: 'เลื่อนนัดได้ไหม' instead of a bare 'เลื่อนนัด'.",
      },
    ],
    vocabulary: [
      { word: "นัด", rtgs: "nát", en: "appointment / to arrange", vi: "cuộc hẹn / hẹn", pos: "noun/verb" },
      { word: "ว่าง", rtgs: "wâang", en: "free / available", vi: "rảnh", pos: "adjective" },
      { word: "เลื่อน", rtgs: "lûean", en: "to postpone / reschedule", vi: "dời / hoãn", pos: "verb" },
      { word: "เจอ", rtgs: "jeu", en: "to meet / run into", vi: "gặp", pos: "verb" },
      { word: "กี่โมง", rtgs: "gìi moong", en: "what time", vi: "mấy giờ", pos: "question" },
      { word: "ได้ไหม", rtgs: "dâai mái", en: "is it OK? / can I?", vi: "được không?", pos: "phrase" },
    ],
    dialogue: [
      { speaker: "A", th: "พรุ่งนี้คุณว่างไหม", rtgs: "phrûng-níi khun wâang mái", vi: "Mai bạn rảnh không?", en: "Are you free tomorrow?" },
      { speaker: "B", th: "บ่ายว่างครับ เจอกันกี่โมง", rtgs: "bàai wâang khráp, jeu gan gìi moong", vi: "Chiều rảnh ạ. Gặp nhau mấy giờ?", en: "I'm free in the afternoon. What time shall we meet?" },
      { speaker: "A", th: "บ่ายสองที่หน้าร้านกาแฟ", rtgs: "bàai-sǎawng thîi nâa ráan-gaa-faae", vi: "2 giờ chiều ở trước quán cà phê.", en: "2 p.m. in front of the coffee shop." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Thái dùng mẫu 'ขอ...ได้ไหม':",
        instruction_en: "Translate into Thai using 'ขอ…ได้ไหม':",
        items: [
          { prompt: "Cho tôi dời lịch hẹn được không?", answer: "ขอเลื่อนนัดได้ไหม" },
          { prompt: "Mai mình gặp nhau được không?", answer: "พรุ่งนี้เจอกันได้ไหม" },
        ],
      },
    ],
  },

  // ── 7. Shopping ───────────────────────────────────────────────────────────
  {
    id: "thai_a2_shopping",
    level: "A2",
    category: "shopping",
    title_vi: "Mua sắm",
    title_en: "Shopping",
    sentences: [
      {
        th: "อันนี้เท่าไหร่",
        rtgs: "an níi thâo-rài",
        vi: "Cái này bao nhiêu?",
        en: "How much is this?",
        focus_vi: [
          "'อันนี้ (an níi)' = cái này (loại từ 'อัน' + 'นี้' = này).",
          "Mẫu chỉ trỏ: Loại từ + นี้/นั้น = cái này / cái kia.",
        ],
        focus_en: [
          "'อันนี้ (an níi)' = this one (classifier 'อัน' + 'นี้' = this).",
          "Demonstrative pattern: Classifier + นี้/นั้น = this one / that one.",
        ],
      },
      {
        th: "ลดราคาได้ไหม",
        rtgs: "lót raa-khaa dâai mái",
        vi: "Bớt giá được không?",
        en: "Can you lower the price?",
        focus_vi: [
          "'ลดราคา (lót raa-khaa)' = giảm giá; 'ลด' = giảm.",
          "Lại dùng đuôi '...ได้ไหm' để hỏi lịch sự khi mặc cả.",
        ],
        focus_en: [
          "'ลดราคา (lót raa-khaa)' = to lower the price; 'ลด' = to reduce.",
          "Again the '…ได้ไหม' tail for a polite bargaining question.",
        ],
      },
      {
        th: "ขอลองได้ไหม",
        rtgs: "khǎaw laawng dâai mái",
        vi: "Cho tôi thử được không?",
        en: "May I try it?",
        focus_vi: [
          "'ลอง (laawng)' = thử (mặc thử, nếm thử...).",
          "'ขอ...ได้ไหม' lặp lại — khung xin phép quen thuộc.",
        ],
        focus_en: [
          "'ลอง (laawng)' = to try (try on, taste, test).",
          "'ขอ…ได้ไหม' again — the familiar request frame.",
        ],
      },
      {
        th: "มีไซส์ใหญ่กว่านี้ไหม",
        rtgs: "mii sai yài gwàa níi mái",
        vi: "Có cỡ to hơn cái này không?",
        en: "Do you have a bigger size than this?",
        focus_vi: [
          "So sánh hơn: tính từ + 'กว่า (gwàa)': ใหญ่กว่า = to hơn.",
          "Tính từ đứng SAU danh từ: 'ไซส์ใหญ่' = cỡ to (cỡ + to).",
        ],
        focus_en: [
          "Comparative: adjective + 'กว่า (gwàa)': ใหญ่กว่า = bigger.",
          "Adjectives follow the noun: 'ไซส์ใหญ่' = size big = 'a big size'.",
        ],
      },
      {
        th: "ฉันเอาอันนี้",
        rtgs: "chǎn ao an níi",
        vi: "Tôi lấy cái này.",
        en: "I'll take this one.",
        focus_vi: [
          "'เอา (ao)' = lấy/muốn — dùng để 'chốt đơn'.",
          "'อันนี้' = cái này, nhắc lại loại từ chỉ trỏ.",
        ],
        focus_en: [
          "'เอา (ao)' = to take / want — used to seal the purchase.",
          "'อันนี้' = this one, the demonstrative again.",
        ],
      },
    ],
    word_order_note_vi:
      "Hai điểm chính: (1) so sánh hơn dùng 'tính từ + กว่า' (ใหญ่กว่า = to hơn) — KHÔNG có 'more' như tiếng Anh; (2) tính từ luôn đứng SAU danh từ ('ไซส์ใหญ่' = cỡ + to), giống tiếng Việt, ngược tiếng Anh ('big size').",
    word_order_note_en:
      "Two keys: (1) comparatives are 'adjective + กว่า' (ใหญ่กว่า = bigger) — no separate 'more'; (2) adjectives ALWAYS follow the noun ('ไซส์ใหญ่' = size + big = 'a big size'). English speakers must flip from 'big size'.",
    cultural_notes_vi:
      "Mặc cả là chuyện thường ở chợ và khu du lịch (ตลาดนัด, จตุจักร) nhưng KHÔNG mặc cả ở siêu thị/cửa hàng có niêm yết giá. Mỉm cười khi trả giá; đừng gắt. '50 บาทได้ไหม' (50 baht được không?) là câu kinh điển.",
    cultural_notes_en:
      "Bargaining is normal in markets and tourist areas (ตลาดนัด, Chatuchak) but NOT in supermarkets or fixed-price shops. Smile while you haggle; never get sharp. '50 บาทได้ไหม' (50 baht, OK?) is the classic line.",
    tip_advice_vi:
      "Nhớ chuỗi mua sắm: 'อันนี้เท่าไหร่' (bao nhiêu) → 'ลดได้ไหม' (bớt được không) → 'เอาอันนี้' (lấy cái này). Cộng thêm 'กว่า' để so sánh cỡ/giá.",
    tip_advice_en:
      "Memorize the shopping chain: 'อันนี้เท่าไหร่' (how much) → 'ลดได้ไหม' (any discount) → 'เอาอันนี้' (I'll take it). Add 'กว่า' to compare size/price.",
    l1_notes_vi: [
      {
        mistake: "(Người Anh) đặt tính từ trước danh từ: 'ใหญ่ไซส์'.",
        fix_vi: "Tiếng Thái: danh từ trước, tính từ sau — 'ไซส์ใหญ่'. Giống trật tự tiếng Việt.",
        fix_en: "Thai puts the noun first, adjective second — 'ไซส์ใหญ่', not 'ใหญ่ไซส์'.",
      },
      {
        mistake: "Tạo so sánh kiểu 'มาก...กว่า' thừa từ.",
        fix_vi: "Chỉ cần 'tính từ + กว่า': 'ถูกกว่า' = rẻ hơn. Không cần thêm 'มาก'.",
        fix_en: "Just 'adjective + กว่า': 'ถูกกว่า' = cheaper. No extra 'มาก' needed.",
      },
    ],
    vocabulary: [
      { word: "เท่าไหร่", rtgs: "thâo-rài", en: "how much", vi: "bao nhiêu", pos: "question" },
      { word: "ลดราคา", rtgs: "lót raa-khaa", en: "to discount", vi: "giảm giá", pos: "verb" },
      { word: "แพง", rtgs: "phaaeng", en: "expensive", vi: "đắt", pos: "adjective" },
      { word: "ถูก", rtgs: "thùuk", en: "cheap", vi: "rẻ", pos: "adjective" },
      { word: "ลอง", rtgs: "laawng", en: "to try (on)", vi: "thử", pos: "verb" },
      { word: "เอา", rtgs: "ao", en: "to take / want", vi: "lấy / muốn", pos: "verb" },
    ],
    dialogue: [
      { speaker: "A", th: "เสื้อตัวนี้เท่าไหร่", rtgs: "sûea dtua níi thâo-rài", vi: "Cái áo này bao nhiêu?", en: "How much is this shirt?" },
      { speaker: "B", th: "สามร้อยบาทค่ะ", rtgs: "sǎam-ráauy bàat khâ", vi: "Ba trăm baht ạ.", en: "Three hundred baht." },
      { speaker: "A", th: "ลดหน่อยได้ไหม สองร้อยห้าได้ไหม", rtgs: "lót nàauy dâai mái, sǎawng-ráauy-hâa dâai mái", vi: "Bớt chút được không? 250 được không?", en: "Any discount? Would 250 be OK?" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Sắp xếp đúng trật tự (danh từ + tính từ; so sánh + กว่า):",
        instruction_en: "Put it in the right order (noun + adjective; comparative + กว่า):",
        items: [
          { prompt: "'cỡ to' = ไซส์ ___", answer: "ใหญ่", options: ["ใหญ่", "ใหญ่ไซส์"] },
          { prompt: "'rẻ hơn' = ถูก ___", answer: "กว่า", options: ["กว่า", "มาก"] },
        ],
      },
    ],
  },

  // ── 8. Asking for help ────────────────────────────────────────────────────
  {
    id: "thai_a2_asking_help",
    level: "A2",
    category: "asking_help",
    title_vi: "Nhờ giúp đỡ",
    title_en: "Asking for help",
    sentences: [
      {
        th: "ช่วยด้วย",
        rtgs: "chûay dûay",
        vi: "Giúp với! / Cứu với!",
        en: "Help!",
        focus_vi: [
          "'ช่วย (chûay)' = giúp; 'ด้วย (dûay)' làm câu khẩn thiết hơn.",
          "Câu cấp cứu cố định — học thuộc.",
        ],
        focus_en: [
          "'ช่วย (chûay)' = help; 'ด้วย (dûay)' makes it an urgent plea.",
          "A fixed emergency phrase — memorize it.",
        ],
      },
      {
        th: "ช่วยพูดช้าๆได้ไหม",
        rtgs: "chûay phûut cháa-cháa dâai mái",
        vi: "Làm ơn nói chậm chậm được không?",
        en: "Could you speak slowly, please?",
        focus_vi: [
          "'ช่วย + động từ + ได้ไหม' = 'làm ơn ... được không?'.",
          "'ช้าๆ (cháa-cháa)' lặp = 'chậm chậm' (lặp để giảm nhẹ/nhấn).",
        ],
        focus_en: [
          "'ช่วย + verb + ได้ไหม' = 'could you … please?'.",
          "Reduplicated 'ช้าๆ (cháa-cháa)' = 'slowly' (doubling softens/intensifies).",
        ],
      },
      {
        th: "ฉันไม่เข้าใจ",
        rtgs: "chǎn mâi khâo-jai",
        vi: "Tôi không hiểu.",
        en: "I don't understand.",
        focus_vi: [
          "Phủ định: 'ไม่ (mâi)' đứng TRƯỚC động từ: 'ไม่เข้าใจ'.",
          "'เข้าใจ (khâo-jai)' = hiểu (nghĩa đen 'vào tim').",
        ],
        focus_en: [
          "Negation: 'ไม่ (mâi)' goes BEFORE the verb: 'ไม่เข้าใจ'.",
          "'เข้าใจ (khâo-jai)' = understand (literally 'enter heart').",
        ],
      },
      {
        th: "พูดอีกครั้งได้ไหม",
        rtgs: "phûut ìik khráng dâai mái",
        vi: "Nói lại lần nữa được không?",
        en: "Could you say it again?",
        focus_vi: [
          "'อีกครั้ง (ìik khráng)' = thêm một lần nữa.",
          "'ครั้ง (khráng)' = lần (loại từ chỉ số lần).",
        ],
        focus_en: [
          "'อีกครั้ง (ìik khráng)' = one more time.",
          "'ครั้ง (khráng)' = a time/occurrence (a counter for times).",
        ],
      },
      {
        th: "ขอโทษ ห้องน้ำไปทางไหน",
        rtgs: "khǎaw-thôot, hâawng-náam bpai thaang nǎi",
        vi: "Xin lỗi, nhà vệ sinh đi lối nào?",
        en: "Excuse me, which way to the toilet?",
        focus_vi: [
          "'ขอโทษ (khǎaw-thôot)' = xin lỗi/làm ơn — mở lời khi nhờ vả.",
          "'ทางไหน (thaang nǎi)' = lối/hướng nào.",
        ],
        focus_en: [
          "'ขอโทษ (khǎaw-thôot)' = excuse me / sorry — opens a request.",
          "'ทางไหน (thaang nǎi)' = which way / direction.",
        ],
      },
    ],
    word_order_note_vi:
      "Hai khung nhờ vả vàng: 'ช่วย + động từ + (ได้ไหม)' = 'làm ơn (giúp) ... được không'. Phủ định luôn là 'ไม่ + động từ' ('ไม่เข้าใจ' = không hiểu) — 'ไม่' đứng ngay trước động từ/tính từ, không bao giờ sau.",
    word_order_note_en:
      "Two golden help frames: 'ช่วย + verb + (ได้ไหม)' = 'please (help) … (could you)'. Negation is always 'ไม่ + verb' ('ไม่เข้าใจ' = don't understand) — 'ไม่' sits directly before the verb/adjective, never after.",
    cultural_notes_vi:
      "Mở đầu bằng 'ขอโทษ' (xin lỗi) khi bắt chuyện với người lạ là rất Thái và rất lịch sự. Thêm 'ครับ' (nam) / 'ค่ะ' (nữ) cuối câu để mềm mại. Người Thái rất sẵn lòng giúp nếu bạn lịch sự.",
    cultural_notes_en:
      "Opening with 'ขอโทษ' (excuse me) before approaching a stranger is very Thai and very polite. End with 'ครับ' (male) / 'ค่ะ' (female) to soften. Thais are happy to help when you're courteous.",
    tip_advice_vi:
      "Bốn câu sống còn: 'ช่วยด้วย' (cứu với), 'ไม่เข้าใจ' (không hiểu), 'พูดช้าๆได้ไหม' (nói chậm được không), 'พูดอีกครั้งได้ไหม' (nói lại được không). Thuộc lòng trước khi đến Thái Lan.",
    tip_advice_en:
      "Four survival lines: 'ช่วยด้วย' (help), 'ไม่เข้าใจ' (I don't understand), 'พูดช้าๆได้ไหม' (speak slowly?), 'พูดอีกครั้งได้ไหม' (say it again?). Memorize before you travel.",
    l1_notes_vi: [
      {
        mistake: "Đặt 'ไม่' sai chỗ: 'เข้าใจไม่'.",
        fix_vi: "'ไม่' luôn đứng TRƯỚC động từ: 'ไม่เข้าใจ'. Khác tiếng Việt đặt 'không' linh hoạt.",
        fix_en: "'ไม่' always comes BEFORE the verb: 'ไม่เข้าใจ', never after.",
      },
      {
        mistake: "Dùng 'ช่วย' như danh từ 'sự giúp đỡ'.",
        fix_vi: "'ช่วย' là ĐỘNG TỪ 'giúp' + động từ theo sau: 'ช่วยพูด...'. Đừng dịch thẳng 'help me' thành 'ช่วยฉัน' rồi dừng.",
        fix_en: "'ช่วย' is the VERB 'help' + a following verb: 'ช่วยพูด…'. Don't stop at a bare 'ช่วยฉัน'.",
      },
    ],
    vocabulary: [
      { word: "ช่วย", rtgs: "chûay", en: "to help", vi: "giúp", pos: "verb" },
      { word: "ไม่เข้าใจ", rtgs: "mâi khâo-jai", en: "don't understand", vi: "không hiểu", pos: "verb phrase" },
      { word: "พูด", rtgs: "phûut", en: "to speak", vi: "nói", pos: "verb" },
      { word: "ช้าๆ", rtgs: "cháa-cháa", en: "slowly", vi: "chậm chậm", pos: "adverb" },
      { word: "อีกครั้ง", rtgs: "ìik khráng", en: "again / once more", vi: "lần nữa", pos: "adverb" },
      { word: "ขอโทษ", rtgs: "khǎaw-thôot", en: "excuse me / sorry", vi: "xin lỗi", pos: "phrase" },
    ],
    dialogue: [
      { speaker: "A", th: "ขอโทษค่ะ พูดภาษาอังกฤษได้ไหม", rtgs: "khǎaw-thôot khâ, phûut phaa-sǎa ang-grìt dâai mái", vi: "Xin lỗi ạ, anh nói tiếng Anh được không?", en: "Excuse me, do you speak English?" },
      { speaker: "B", th: "ได้นิดหน่อย พูดช้าๆได้ไหมครับ", rtgs: "dâai nít-nàauy, phûut cháa-cháa dâai mái khráp", vi: "Được chút ít. Nói chậm chậm được không?", en: "A little. Could you speak slowly?" },
      { speaker: "A", th: "ได้ค่ะ ห้องน้ำไปทางไหน", rtgs: "dâai khâ, hâawng-náam bpai thaang nǎi", vi: "Được ạ. Nhà vệ sinh đi lối nào?", en: "Sure. Which way to the toilet?" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Thái (chú ý 'ไม่' trước động từ):",
        instruction_en: "Translate into Thai (mind 'ไม่' before the verb):",
        items: [
          { prompt: "Tôi không hiểu.", answer: "ฉันไม่เข้าใจ" },
          { prompt: "Nói lại lần nữa được không?", answer: "พูดอีกครั้งได้ไหม" },
        ],
      },
    ],
  },

  // ── 9. Family ─────────────────────────────────────────────────────────────
  {
    id: "thai_a2_family",
    level: "A2",
    category: "family",
    title_vi: "Gia đình",
    title_en: "Family",
    sentences: [
      {
        th: "ครอบครัวฉันมีสี่คน",
        rtgs: "khrâawp-khrua chǎn mii sìi khon",
        vi: "Gia đình tôi có bốn người.",
        en: "My family has four people.",
        focus_vi: [
          "'ครอบครัว (khrâawp-khrua)' = gia đình; sở hữu sau: 'ครอบครัวฉัน'.",
          "Đếm người: số + 'คน' → 'สี่คน' = bốn người.",
        ],
        focus_en: [
          "'ครอบครัว (khrâawp-khrua)' = family; possessor follows: 'ครอบครัวฉัน'.",
          "Counting people: number + 'คน' → 'สี่คน' = four people.",
        ],
      },
      {
        th: "พ่อฉันเป็นครู",
        rtgs: "phâaw chǎn bpen khruu",
        vi: "Bố tôi là giáo viên.",
        en: "My father is a teacher.",
        focus_vi: [
          "'เป็น (bpen)' = 'là' (nối với nghề nghiệp/vai trò).",
          "'พ่อ (phâaw)' = bố; 'แม่ (mâae)' = mẹ.",
        ],
        focus_en: [
          "'เป็น (bpen)' = 'to be' (links to a job/role).",
          "'พ่อ (phâaw)' = father; 'แม่ (mâae)' = mother.",
        ],
      },
      {
        th: "ฉันมีพี่สาวหนึ่งคน",
        rtgs: "chǎn mii phîi-sǎao nùeng khon",
        vi: "Tôi có một chị gái.",
        en: "I have one older sister.",
        focus_vi: [
          "Tiếng Thái phân biệt tuổi: 'พี่ (phîi)' = anh/chị (lớn hơn), 'น้อง (náawng)' = em (nhỏ hơn).",
          "'พี่สาว' = chị gái; 'พี่ชาย' = anh trai.",
        ],
        focus_en: [
          "Thai marks seniority: 'พี่ (phîi)' = older sibling, 'น้อง (náawng)' = younger.",
          "'พี่สาว' = older sister; 'พี่ชาย' = older brother.",
        ],
      },
      {
        th: "น้องชายฉันยังเรียนอยู่",
        rtgs: "náawng-chaai chǎn yang rian yùu",
        vi: "Em trai tôi vẫn còn đang đi học.",
        en: "My younger brother is still studying.",
        focus_vi: [
          "'ยัง...อยู่ (yang … yùu)' bao quanh động từ = 'vẫn đang ...'.",
          "'น้องชาย' = em trai; 'น้องสาว' = em gái.",
        ],
        focus_en: [
          "'ยัง…อยู่ (yang … yùu)' wraps the verb = 'still …ing'.",
          "'น้องชาย' = younger brother; 'น้องสาว' = younger sister.",
        ],
      },
      {
        th: "เราอยู่ด้วยกัน",
        rtgs: "rao yùu dûay-gan",
        vi: "Chúng tôi sống cùng nhau.",
        en: "We live together.",
        focus_vi: [
          "'อยู่ (yùu)' ở đây = sống/ở.",
          "'ด้วยกัน (dûay-gan)' = cùng nhau.",
        ],
        focus_en: [
          "'อยู่ (yùu)' here = to live / reside.",
          "'ด้วยกัน (dûay-gan)' = together.",
        ],
      },
    ],
    word_order_note_vi:
      "Sở hữu đặt SAU: 'พ่อฉัน' = bố + tôi = 'bố tôi' (giống tiếng Việt, ngược tiếng Anh 'my father'). 'เป็น' nối chủ ngữ với nghề/vai trò nhưng KHÔNG dùng với tính từ — 'tôi bận' là 'ฉันยุ่ง' (không có 'เป็น'). Khung 'ยัง...อยู่' kẹp động từ để chỉ 'vẫn đang'.",
    word_order_note_en:
      "Possession follows the noun: 'พ่อฉัน' = father + I = 'my father' (flip from English). 'เป็น' links a subject to a job/role but is NOT used with adjectives — 'I'm busy' is 'ฉันยุ่ง' (no 'เป็น'). The 'ยัง…อยู่' frame brackets a verb for 'still …ing'.",
    cultural_notes_vi:
      "Người Thái thường gọi nhau bằng 'พี่/น้อง' theo tuổi cả ngoài gia đình — gọi người lớn hơn là 'พี่' thể hiện sự tôn trọng. Đại gia đình sống chung khá phổ biến; con cái chăm cha mẹ già là giá trị được coi trọng.",
    cultural_notes_en:
      "Thais use 'พี่/น้อง' (older/younger) by age even outside the family — calling someone older 'พี่' shows respect. Multi-generation households are common, and caring for elderly parents is a valued duty.",
    tip_advice_vi:
      "Học theo cặp tuổi tác: พี่ชาย/น้องชาย (anh/em trai), พี่สาว/น้องสาว (chị/em gái). Tiếng Thái BẮT BUỘC phân biệt lớn–nhỏ, không có từ chung cho 'anh chị em' khi nói cụ thể.",
    tip_advice_en:
      "Learn the seniority pairs: พี่ชาย/น้องชาย (older/younger brother), พี่สาว/น้องสาว (older/younger sister). Thai REQUIRES the older/younger distinction — there's no neutral 'sibling' when being specific.",
    l1_notes_vi: [
      {
        mistake: "Dùng 'เป็น' với tính từ: 'ฉันเป็นยุ่ง'.",
        fix_vi: "Tính từ không cần 'เป็น': 'ฉันยุ่ง' (tôi bận). 'เป็น' chỉ dùng với danh từ/nghề: 'เป็นครู'.",
        fix_en: "Adjectives take no 'เป็น': 'ฉันยุ่ง' (I'm busy). Use 'เป็น' only with nouns/roles: 'เป็นครู'.",
      },
      {
        mistake: "Dịch 'em/anh' bằng một từ chung không phân biệt tuổi.",
        fix_vi: "Phải chọn พี่ (lớn) hay น้อง (nhỏ) + ชาย/สาว. Không có 'brother' trung tính trong lời nói cụ thể.",
        fix_en: "You must pick พี่ (older) or น้อง (younger) + ชาย/สาว. There's no age-neutral 'brother' in specific speech.",
      },
    ],
    vocabulary: [
      { word: "ครอบครัว", rtgs: "khrâawp-khrua", en: "family", vi: "gia đình", pos: "noun" },
      { word: "พ่อ", rtgs: "phâaw", en: "father", vi: "bố", pos: "noun", classifier: "คน" },
      { word: "แม่", rtgs: "mâae", en: "mother", vi: "mẹ", pos: "noun", classifier: "คน" },
      { word: "พี่สาว", rtgs: "phîi-sǎao", en: "older sister", vi: "chị gái", pos: "noun", classifier: "คน" },
      { word: "น้องชาย", rtgs: "náawng-chaai", en: "younger brother", vi: "em trai", pos: "noun", classifier: "คน" },
      { word: "เป็น", rtgs: "bpen", en: "to be (a role/job)", vi: "là", pos: "verb" },
    ],
    dialogue: [
      { speaker: "A", th: "ครอบครัวคุณมีกี่คน", rtgs: "khrâawp-khrua khun mii gìi khon", vi: "Gia đình bạn có mấy người?", en: "How many people are in your family?" },
      { speaker: "B", th: "ห้าคนครับ พ่อ แม่ พี่สาว น้องชาย และผม", rtgs: "hâa khon khráp, phâaw mâae phîi-sǎao náawng-chaai láe phǒm", vi: "Năm người ạ: bố, mẹ, chị gái, em trai và tôi.", en: "Five: father, mother, older sister, younger brother, and me." },
      { speaker: "A", th: "พ่อคุณทำงานอะไร", rtgs: "phâaw khun tham-ngaan à-rai", vi: "Bố bạn làm nghề gì?", en: "What does your father do?" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền 'เป็น' nếu cần, hoặc để trống nếu là tính từ:",
        instruction_en: "Add 'เป็น' if needed, leave blank if it's an adjective:",
        items: [
          { prompt: "พ่อฉัน ___ ครู (là giáo viên)", answer: "เป็น", options: ["เป็น", "(để trống)"] },
          { prompt: "ฉัน ___ ยุ่ง (bận)", answer: "(để trống)", options: ["เป็น", "(để trống)"] },
        ],
      },
    ],
  },

  // ── 10. Simple opinions ───────────────────────────────────────────────────
  {
    id: "thai_a2_opinions",
    level: "A2",
    category: "opinions",
    title_vi: "Ý kiến đơn giản",
    title_en: "Simple opinions",
    sentences: [
      {
        th: "ฉันคิดว่าอร่อย",
        rtgs: "chǎn khít wâa à-ràauy",
        vi: "Tôi nghĩ là ngon.",
        en: "I think it's delicious.",
        focus_vi: [
          "'คิดว่า (khít wâa)' = nghĩ rằng; 'ว่า (wâa)' = 'rằng' nối mệnh đề.",
          "'อร่อย (à-ràauy)' = ngon — không cần chủ ngữ 'nó', tiếng Thái lược bỏ thoải mái.",
        ],
        focus_en: [
          "'คิดว่า (khít wâa)' = think that; 'ว่า (wâa)' = 'that' links the clause.",
          "'อร่อย (à-ràauy)' = delicious — no dummy 'it' needed; Thai drops it freely.",
        ],
      },
      {
        th: "อาหารไทยเผ็ดมาก",
        rtgs: "aa-hǎan thai phèt mâak",
        vi: "Đồ ăn Thái rất cay.",
        en: "Thai food is very spicy.",
        focus_vi: [
          "'มาก (mâak)' = rất/nhiều, đứng SAU tính từ: 'เผ็ดมาก' = rất cay.",
          "Không cần động từ 'là' trước tính từ: 'อาหารไทยเผ็ด' đủ nghĩa.",
        ],
        focus_en: [
          "'มาก (mâak)' = very, goes AFTER the adjective: 'เผ็ดมาก' = very spicy.",
          "No 'to be' before an adjective: 'อาหารไทยเผ็ด' already means 'Thai food is spicy'.",
        ],
      },
      {
        th: "ฉันชอบเมืองนี้",
        rtgs: "chǎn châawp mueang níi",
        vi: "Tôi thích thành phố này.",
        en: "I like this city.",
        focus_vi: [
          "'ชอบ (châawp)' = thích; ngược lại 'ไม่ชอบ' = không thích.",
          "'เมืองนี้' = thành phố này ('นี้' chỉ trỏ đứng sau).",
        ],
        focus_en: [
          "'ชอบ (châawp)' = to like; negative 'ไม่ชอบ' = dislike.",
          "'เมืองนี้' = this city ('นี้' demonstrative comes after).",
        ],
      },
      {
        th: "หนังเรื่องนี้สนุก",
        rtgs: "nǎng rûeang níi sà-nùk",
        vi: "Bộ phim này hay/vui.",
        en: "This movie is fun.",
        focus_vi: [
          "'สนุก (sà-nùk)' = vui/thú vị — giá trị văn hóa quan trọng của Thái.",
          "'เรื่อง (rûeang)' = loại từ cho phim/truyện: 'หนังเรื่องนี้'.",
        ],
        focus_en: [
          "'สนุก (sà-nùk)' = fun/enjoyable — a core Thai cultural value.",
          "'เรื่อง (rûeang)' = classifier for films/stories: 'หนังเรื่องนี้'.",
        ],
      },
      {
        th: "ฉันว่าแพงไป",
        rtgs: "chǎn wâa phaaeng bpai",
        vi: "Tôi thấy đắt quá.",
        en: "I think it's too expensive.",
        focus_vi: [
          "'...ไป (bpai)' sau tính từ = 'quá/quá mức': 'แพงไป' = đắt quá.",
          "'ฉันว่า (chǎn wâa)' = 'tôi thấy/cho rằng' — rút gọn của 'ฉันคิดว่า'.",
        ],
        focus_en: [
          "Adjective + '...ไป (bpai)' = 'too …': 'แพงไป' = too expensive.",
          "'ฉันว่า (chǎn wâa)' = 'I'd say / I think' — short for 'ฉันคิดว่า'.",
        ],
      },
    ],
    word_order_note_vi:
      "Ba mẫu nêu ý kiến: (1) 'คิดว่า / ว่า + mệnh đề' = nghĩ rằng...; (2) mức độ 'มาก (rất)' và 'ไป (quá)' đứng SAU tính từ: เผ็ดมาก, แพงไป; (3) tính từ tự làm vị ngữ, KHÔNG cần 'là/thì' — 'อาหารเผ็ด' = đồ ăn (thì) cay.",
    word_order_note_en:
      "Three opinion patterns: (1) 'คิดว่า / ว่า + clause' = 'think that…'; (2) degree words 'มาก (very)' and 'ไป (too)' come AFTER the adjective: เผ็ดมาก, แพงไป; (3) adjectives are their own predicate — NO 'is/are' needed: 'อาหารเผ็ด' = 'the food is spicy'.",
    cultural_notes_vi:
      "'สนุก (sà-nùk)' — niềm vui — là giá trị sống cốt lõi của người Thái; khen điều gì 'สนุก' là lời khen cao. Người Thái thường nêu ý kiến nhẹ nhàng, tránh chê thẳng; dùng 'เฉยๆ' (bình thường thôi) để từ chối khéo thay vì nói 'không thích'.",
    cultural_notes_en:
      "'สนุก (sà-nùk)' — fun — is a core Thai life value; calling something 'สนุก' is high praise. Thais tend to give opinions gently and avoid blunt criticism; 'เฉยๆ' (just so-so) is a polite way to demur instead of 'I don't like it'.",
    tip_advice_vi:
      "Mở ý kiến bằng 'ฉันคิดว่า...' hoặc gọn hơn 'ฉันว่า...'. Nhớ vị trí mức độ: มาก/ไป LUÔN đứng sau tính từ, đừng đặt trước như 'very' tiếng Anh.",
    tip_advice_en:
      "Open opinions with 'ฉันคิดว่า…' or the shorter 'ฉันว่า…'. Remember degree placement: มาก/ไป ALWAYS follow the adjective — don't front them like English 'very'.",
    l1_notes_vi: [
      {
        mistake: "(Người Anh) đặt 'มาก' trước tính từ: 'มากเผ็ด'.",
        fix_vi: "'มาก' đứng SAU: 'เผ็ดมาก' = rất cay. Giống tiếng Việt 'cay lắm'.",
        fix_en: "'มาก' goes AFTER: 'เผ็ดมาก' = very spicy, not 'มากเผ็ด'.",
      },
      {
        mistake: "Thêm động từ 'là' trước tính từ: 'อาหารเป็นเผ็ด'.",
        fix_vi: "Tính từ không cần 'เป็น/là': nói thẳng 'อาหารเผ็ด'.",
        fix_en: "Adjectives need no copula: just say 'อาหารเผ็ด', not 'อาหารเป็นเผ็ด'.",
      },
    ],
    vocabulary: [
      { word: "คิดว่า", rtgs: "khít wâa", en: "to think that", vi: "nghĩ rằng", pos: "verb phrase" },
      { word: "ชอบ", rtgs: "châawp", en: "to like", vi: "thích", pos: "verb" },
      { word: "อร่อย", rtgs: "à-ràauy", en: "delicious", vi: "ngon", pos: "adjective" },
      { word: "เผ็ด", rtgs: "phèt", en: "spicy", vi: "cay", pos: "adjective" },
      { word: "สนุก", rtgs: "sà-nùk", en: "fun / enjoyable", vi: "vui / thú vị", pos: "adjective" },
      { word: "มาก", rtgs: "mâak", en: "very / a lot", vi: "rất / nhiều", pos: "adverb" },
    ],
    dialogue: [
      { speaker: "A", th: "อาหารร้านนี้เป็นยังไง", rtgs: "aa-hǎan ráan níi bpen yang-ngai", vi: "Đồ ăn quán này thế nào?", en: "How's the food at this place?" },
      { speaker: "B", th: "อร่อยมาก แต่เผ็ดไปหน่อย", rtgs: "à-ràauy mâak, dtàae phèt bpai nàauy", vi: "Rất ngon, nhưng hơi cay quá.", en: "Very tasty, but a bit too spicy." },
      { speaker: "A", th: "ฉันว่าราคาโอเค", rtgs: "chǎn wâa raa-khaa oo-kee", vi: "Tôi thấy giá ổn.", en: "I think the price is OK." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Đặt từ mức độ đúng chỗ (sau tính từ):",
        instruction_en: "Place the degree word correctly (after the adjective):",
        items: [
          { prompt: "'rất cay' = เผ็ด ___", answer: "มาก", options: ["มาก", "(trước: มากเผ็ด)"] },
          { prompt: "'đắt quá' = แพง ___", answer: "ไป", options: ["ไป", "(trước: ไปแพง)"] },
        ],
      },
    ],
  },

  // ── 11. Eating out (daily life) ───────────────────────────────────────────
  {
    id: "thai_a2_eating_out",
    level: "A2",
    category: "daily_life",
    title_vi: "Đi ăn ngoài",
    title_en: "Eating out",
    sentences: [
      {
        th: "ขอเมนูหน่อย",
        rtgs: "khǎaw mee-nuu nàauy",
        vi: "Cho tôi xem thực đơn chút.",
        en: "Menu, please.",
        focus_vi: [
          "'ขอ...หน่อย (khǎaw … nàauy)' = 'cho tôi ... chút' — yêu cầu nhẹ nhàng.",
          "'หน่อย (nàauy)' làm câu mềm hơn, lịch sự hơn.",
        ],
        focus_en: [
          "'ขอ…หน่อย (khǎaw … nàauy)' = 'may I have a little …' — a soft request.",
          "'หน่อย (nàauy)' softens the ask and makes it more polite.",
        ],
      },
      {
        th: "ขอผัดไทยหนึ่งจาน",
        rtgs: "khǎaw phàt-thai nùeng jaan",
        vi: "Cho tôi một đĩa pad thai.",
        en: "One plate of pad thai, please.",
        focus_vi: [
          "'จาน (jaan)' = đĩa, vừa là loại từ khi gọi món: 'หนึ่งจาน'.",
          "Mẫu gọi món: ขอ + món + số + loại từ.",
        ],
        focus_en: [
          "'จาน (jaan)' = plate, also the classifier when ordering: 'หนึ่งจาน'.",
          "Ordering pattern: ขอ + dish + number + classifier.",
        ],
      },
      {
        th: "ไม่เอาเผ็ด",
        rtgs: "mâi ao phèt",
        vi: "Không lấy cay (đừng cho cay).",
        en: "No spice, please.",
        focus_vi: [
          "'ไม่เอา (mâi ao)' = không lấy/không muốn.",
          "Câu cực ngắn nhưng đủ — tiếng Thái lược chủ ngữ thoải mái.",
        ],
        focus_en: [
          "'ไม่เอา (mâi ao)' = don't want / hold the…",
          "Very short but complete — Thai drops the subject freely.",
        ],
      },
      {
        th: "ขอน้ำเปล่าหนึ่งแก้ว",
        rtgs: "khǎaw náam-bplào nùeng gâaeo",
        vi: "Cho tôi một ly nước lọc.",
        en: "One glass of plain water, please.",
        focus_vi: [
          "'น้ำเปล่า (náam-bplào)' = nước lọc (nước trắng).",
          "'แก้ว (gâaeo)' = ly/cốc, loại từ cho đồ uống bằng ly.",
        ],
        focus_en: [
          "'น้ำเปล่า (náam-bplào)' = plain/still water.",
          "'แก้ว (gâaeo)' = glass, the classifier for a glassful.",
        ],
      },
      {
        th: "เก็บเงินด้วย",
        rtgs: "gèp ngern dûay",
        vi: "Tính tiền giúp với.",
        en: "Check, please.",
        focus_vi: [
          "'เก็บเงิน (gèp ngern)' = thu tiền/tính tiền.",
          "'ด้วย (dûay)' cuối câu = 'giúp/với' — lịch sự khi nhờ.",
        ],
        focus_en: [
          "'เก็บเงิน (gèp ngern)' = to collect the money / the bill.",
          "Final 'ด้วย (dûay)' = 'please / for me' — polite when asking.",
        ],
      },
    ],
    word_order_note_vi:
      "Gọi món theo mẫu: ขอ (cho tôi) + [món] + [số] + [loại từ] → 'ขอผัดไทยหนึ่งจาน'. Đây chính là quy tắc loại từ ở bài 3 áp dụng vào nhà hàng. Thêm 'หน่อย' hoặc 'ด้วย' cuối câu để lịch sự.",
    word_order_note_en:
      "Ordering follows: ขอ (may I have) + [dish] + [number] + [classifier] → 'ขอผัดไทยหนึ่งจาน'. It's the lesson-3 classifier rule applied at a restaurant. Add 'หน่อย' or 'ด้วย' at the end to be polite.",
    cultural_notes_vi:
      "Quán ăn Thái thường để gia vị tự nêm (น้ำปลา, พริก, น้ำตาล) trên bàn. Để gọi phục vụ, nói 'พี่' hoặc 'น้อง' (tùy tuổi) một cách lịch sự. Mức cay: 'เผ็ดน้อย' (ít cay) / 'ไม่เผ็ด' (không cay) — nói rõ vì mức 'bình thường' của Thái rất cay.",
    cultural_notes_en:
      "Thai eateries leave condiments (fish sauce น้ำปลา, chili, sugar) on the table to self-season. To call staff, a polite 'พี่' or 'น้อง' (by their age) works. Spice levels: 'เผ็ดน้อย' (mild) / 'ไม่เผ็ด' (not spicy) — say it clearly, as the default is genuinely hot.",
    tip_advice_vi:
      "Chuỗi ăn uống: 'ขอเมนูหน่อย' → 'ขอ[món][số][loại từ]' → 'ไม่เผ็ด' (nếu cần) → 'เก็บเงินด้วย'. Bốn câu này đủ dùng cho hầu hết bữa ăn.",
    tip_advice_en:
      "The dining chain: 'ขอเมนูหน่อย' → 'ขอ[dish][number][classifier]' → 'ไม่เผ็ด' (if needed) → 'เก็บเงินด้วย'. These four lines carry most meals.",
    l1_notes_vi: [
      {
        mistake: "Gọi món thiếu loại từ: 'ขอผัดไทยหนึ่ง'.",
        fix_vi: "Cần loại từ 'จาน': 'ขอผัดไทยหนึ่งจาน'. Quy tắc đếm vẫn áp dụng.",
        fix_en: "You still need the classifier 'จาน': 'ขอผัดไทยหนึ่งจาน'.",
      },
      {
        mistake: "Dịch 'tính tiền' bằng từ vay tiếng Anh.",
        fix_vi: "Câu tự nhiên là 'เก็บเงินด้วย' hoặc 'เช็คบิล' (mượn 'check bill'). Cả hai đều dùng được.",
        fix_en: "The natural line is 'เก็บเงินด้วย' or the borrowed 'เช็คบิล' (check bill). Both work.",
      },
    ],
    vocabulary: [
      { word: "เมนู", rtgs: "mee-nuu", en: "menu", vi: "thực đơn", pos: "noun", classifier: "เล่ม" },
      { word: "จาน", rtgs: "jaan", en: "plate (also classifier)", vi: "đĩa (cũng là loại từ)", pos: "noun/classifier" },
      { word: "แก้ว", rtgs: "gâaeo", en: "glass (also classifier)", vi: "ly/cốc (cũng là loại từ)", pos: "noun/classifier" },
      { word: "น้ำเปล่า", rtgs: "náam-bplào", en: "plain water", vi: "nước lọc", pos: "noun" },
      { word: "เผ็ด", rtgs: "phèt", en: "spicy", vi: "cay", pos: "adjective" },
      { word: "เก็บเงิน", rtgs: "gèp ngern", en: "to get the bill", vi: "tính tiền", pos: "verb phrase" },
    ],
    dialogue: [
      { speaker: "A", th: "ขอเมนูหน่อยครับ", rtgs: "khǎaw mee-nuu nàauy khráp", vi: "Cho tôi xem thực đơn ạ.", en: "May I see the menu?" },
      { speaker: "B", th: "ได้ค่ะ รับอะไรดีคะ", rtgs: "dâai khâ, ráp à-rai dii khá", vi: "Dạ. Anh dùng gì ạ?", en: "Sure. What would you like?" },
      { speaker: "A", th: "ขอผัดไทยหนึ่งจาน ไม่เผ็ดนะครับ", rtgs: "khǎaw phàt-thai nùeng jaan, mâi phèt ná khráp", vi: "Cho một đĩa pad thai, không cay nhé.", en: "One pad thai, not spicy, please." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Thái (mẫu ขอ + món + số + loại từ):",
        instruction_en: "Translate into Thai (ขอ + dish + number + classifier):",
        items: [
          { prompt: "Cho tôi một đĩa pad thai.", answer: "ขอผัดไทยหนึ่งจาน" },
          { prompt: "Cho tôi một ly nước lọc.", answer: "ขอน้ำเปล่าหนึ่งแก้ว" },
        ],
      },
    ],
  },

  // ── 12. Booking & making an appointment (appointments) ────────────────────
  {
    id: "thai_a2_booking",
    level: "A2",
    category: "appointments",
    title_vi: "Đặt lịch và đặt chỗ",
    title_en: "Booking and making appointments",
    sentences: [
      {
        th: "ฉันอยากนัดหมอ",
        rtgs: "chǎn yàak nát mǎaw",
        vi: "Tôi muốn đặt lịch khám bác sĩ.",
        en: "I'd like to make a doctor's appointment.",
        focus_vi: [
          "'อยาก (yàak)' = muốn (làm gì), đứng trước động từ: 'อยากนัด'.",
          "'หมอ (mǎaw)' = bác sĩ; 'นัดหมอ' = hẹn (gặp) bác sĩ.",
        ],
        focus_en: [
          "'อยาก (yàak)' = want to (do), before the verb: 'อยากนัด'.",
          "'หมอ (mǎaw)' = doctor; 'นัดหมอ' = book a doctor.",
        ],
      },
      {
        th: "ขอจองโต๊ะสองที่",
        rtgs: "khǎaw jaawng dtó sǎawng thîi",
        vi: "Cho tôi đặt bàn hai chỗ.",
        en: "I'd like to book a table for two.",
        focus_vi: [
          "'จอง (jaawng)' = đặt trước (bàn, vé, phòng).",
          "'ที่ (thîi)' ở đây = 'chỗ ngồi' (loại từ): สองที่ = hai chỗ.",
        ],
        focus_en: [
          "'จอง (jaawng)' = to reserve (table, ticket, room).",
          "'ที่ (thîi)' here = 'seat/place' (classifier): สองที่ = for two.",
        ],
      },
      {
        th: "วันจันทร์สะดวกไหม",
        rtgs: "wan-jan sà-dùak mái",
        vi: "Thứ Hai có tiện không?",
        en: "Is Monday convenient?",
        focus_vi: [
          "'สะดวก (sà-dùak)' = tiện/thuận tiện; '...ไหม' biến thành câu hỏi.",
          "'วันจันทร์ (wan-jan)' = thứ Hai (các thứ bắt đầu bằng 'วัน').",
        ],
        focus_en: [
          "'สะดวก (sà-dùak)' = convenient; '…ไหม' turns it into a question.",
          "'วันจันทร์ (wan-jan)' = Monday (weekdays start with 'วัน').",
        ],
      },
      {
        th: "ตอนสิบโมงได้ไหม",
        rtgs: "dtaawn sìp moong dâai mái",
        vi: "Lúc 10 giờ (sáng) được không?",
        en: "Would 10 a.m. work?",
        focus_vi: [
          "'สิบโมง (sìp moong)' = 10 giờ sáng (โมง dùng cho ban ngày).",
          "Đề xuất giờ + 'ได้ไหม' để hỏi sự đồng ý.",
        ],
        focus_en: [
          "'สิบโมง (sìp moong)' = 10 a.m. (โมง for daytime hours).",
          "Propose a time + 'ได้ไหม' to ask if it works.",
        ],
      },
      {
        th: "ขอเบอร์โทรด้วย",
        rtgs: "khǎaw beu thoo dûay",
        vi: "Cho xin số điện thoại với.",
        en: "Could I have a phone number, please?",
        focus_vi: [
          "'เบอร์โทร (beu thoo)' = số điện thoại (mượn 'number' + 'โทร').",
          "'ขอ...ด้วย' = mẫu xin lịch sự (như bài 6, 11).",
        ],
        focus_en: [
          "'เบอร์โทร (beu thoo)' = phone number (borrowed 'number' + 'โทร').",
          "'ขอ…ด้วย' = a polite 'may I have…' frame (as in lessons 6, 11).",
        ],
      },
    ],
    word_order_note_vi:
      "'อยาก (muốn)' và 'จอง/นัด (đặt/hẹn)' đều đứng trước tân ngữ theo SVO: 'อยาก + động từ', 'จอง + đồ vật'. Tên các thứ trong tuần đều mở đầu bằng 'วัน' (วันจันทร์, วันอังคาร...). Câu hỏi đồng ý vẫn kết bằng '...ไหม' hoặc '...ได้ไหม' ở cuối.",
    word_order_note_en:
      "'อยาก (want to)' and 'จอง/นัด (book/arrange)' precede their object in SVO order: 'อยาก + verb', 'จอง + thing'. Weekday names all begin with 'วัน' (วันจันทร์ Monday, วันอังคาร Tuesday…). Agreement questions still end in '…ไหม' or '…ได้ไหม'.",
    cultural_notes_vi:
      "Đặt chỗ qua điện thoại hay LINE rất phổ biến ở Thái Lan. Bệnh viện tư có quầy lễ tân nói tiếng Anh; bệnh viện công đông và cần đặt sớm. Khi đặt nhà hàng/khách sạn, nhân viên thường xin 'เบอร์โทร' (số điện thoại) để xác nhận.",
    cultural_notes_en:
      "Booking by phone or LINE is very common in Thailand. Private hospitals have English-speaking front desks; public ones are busy and need early booking. When you reserve a restaurant or hotel, staff usually ask for your 'เบอร์โทร' (phone number) to confirm.",
    tip_advice_vi:
      "Khung đặt lịch: 'อยาก/ขอ + [nัด/จอง] + [đối tượng]' → đề xuất ngày: '[thứ]สะดวกไหม' → đề xuất giờ: 'ตอน[giờ]ได้ไหม'. Học 7 ngày trong tuần (đều bắt đầu 'วัน').",
    tip_advice_en:
      "Booking frame: 'อยาก/ขอ + [นัด/จอง] + [thing]' → propose a day: '[weekday]สะดวกไหม' → propose a time: 'ตอน[hour]ได้ไหม'. Learn the 7 weekdays (all start with 'วัน').",
    l1_notes_vi: [
      {
        mistake: "Bỏ 'วัน' khi nói thứ: 'จันทร์' đứng một mình trong câu trang trọng.",
        fix_vi: "Các thứ chuẩn có 'วัน': 'วันจันทร์'. (Văn nói thân mật đôi khi lược, nhưng học dạng đầy đủ trước.)",
        fix_en: "Weekdays carry 'วัน': 'วันจันทร์'. (Casual speech sometimes drops it, but learn the full form first.)",
      },
      {
        mistake: "Đặt 'อยาก' sau động từ: 'นัดอยาก'.",
        fix_vi: "'อยาก' đứng TRƯỚC động từ chính: 'อยากนัด' = muốn hẹn.",
        fix_en: "'อยาก' goes BEFORE the main verb: 'อยากนัด' = want to book.",
      },
    ],
    vocabulary: [
      { word: "อยาก", rtgs: "yàak", en: "to want to (do)", vi: "muốn (làm)", pos: "verb" },
      { word: "จอง", rtgs: "jaawng", en: "to reserve / book", vi: "đặt trước", pos: "verb" },
      { word: "หมอ", rtgs: "mǎaw", en: "doctor", vi: "bác sĩ", pos: "noun", classifier: "คน" },
      { word: "สะดวก", rtgs: "sà-dùak", en: "convenient", vi: "thuận tiện", pos: "adjective" },
      { word: "วันจันทร์", rtgs: "wan-jan", en: "Monday", vi: "thứ Hai", pos: "noun" },
      { word: "เบอร์โทร", rtgs: "beu thoo", en: "phone number", vi: "số điện thoại", pos: "noun" },
    ],
    dialogue: [
      { speaker: "A", th: "ขอจองโต๊ะสองที่ วันเสาร์ได้ไหมคะ", rtgs: "khǎaw jaawng dtó sǎawng thîi, wan-sǎo dâai mái khá", vi: "Cho tôi đặt bàn hai chỗ, thứ Bảy được không ạ?", en: "I'd like a table for two on Saturday, is that OK?" },
      { speaker: "B", th: "ได้ครับ กี่โมงดีครับ", rtgs: "dâai khráp, gìi moong dii khráp", vi: "Được ạ. Mấy giờ ạ?", en: "Yes. What time?" },
      { speaker: "A", th: "ตอนหกโมงเย็น ขอเบอร์โทรร้านด้วยค่ะ", rtgs: "dtaawn hòk moong yen, khǎaw beu thoo ráan dûay khâ", vi: "Lúc 6 giờ tối. Cho xin số điện thoại quán với ạ.", en: "At 6 p.m. And could I have the restaurant's number?" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền 'อยาก' hoặc 'จอง' cho đúng:",
        instruction_en: "Fill in 'อยาก' (want to) or 'จอง' (reserve):",
        items: [
          { prompt: "ฉัน ___ นัดหมอ (muốn hẹn)", answer: "อยาก", options: ["อยาก", "จอง"] },
          { prompt: "ขอ ___ โต๊ะสองที่ (đặt bàn)", answer: "จอง", options: ["อยาก", "จอง"] },
        ],
      },
    ],
  },
];

export default lessons;
