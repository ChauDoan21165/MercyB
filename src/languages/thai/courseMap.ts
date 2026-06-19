// src/languages/thai/courseMap.ts
//
// Compact, app-ready course map for the Thai track. PURE DATA ONLY — no logic,
// no imports beyond the shared level type, so it is safe to import anywhere
// (renderers, index pages, quiz pickers) without side effects.
//
// Bilingual by design: every learner-facing string has a Vietnamese (`*_vi`)
// and an English (`*_en`) sibling. They are authored per audience — same
// intent, audience-specific wording — NOT translations of each other.
//
// Honesty: this track is text-first. There is NO audio and NO pronunciation
// scoring yet, and native review is deferred. Those caveats are encoded in
// `THAI_COURSE_WARNINGS` so the UI can surface them instead of implying a
// completeness the content does not yet have.

import type { ThaiCefrLevel } from "./lessons";

// ── CEFR levels → learner goals ──────────────────────────────────────────

export type ThaiLevelGoal = {
  level: ThaiCefrLevel;
  /** Short label, e.g. "Foundation". */
  label_vi: string;
  label_en: string;
  /** What the learner can do by the end of this level. */
  goal_vi: string;
  goal_en: string;
  /** Rough CEFR "can-do" summary, kept compact. */
  cando_vi: string;
  cando_en: string;
};

export const THAI_LEVEL_GOALS: ThaiLevelGoal[] = [
  {
    level: "A1",
    label_vi: "Nền tảng",
    label_en: "Foundation",
    goal_vi:
      "Đọc bảng chữ Thái cơ bản, chào hỏi, dùng tiểu từ lịch sự ครับ/ค่ะ, số đếm.",
    goal_en:
      "Read basic Thai script, greet people, use the polite particles ครับ/ค่ะ, count.",
    cando_vi: "Giao tiếp tối thiểu trong tình huống quen thuộc, câu rất ngắn.",
    cando_en: "Handle very basic, predictable exchanges with short phrases.",
  },
  {
    level: "A2",
    label_vi: "Sơ cấp",
    label_en: "Elementary",
    goal_vi:
      "Mua sắm, gọi món, đi taxi, hỏi đường, nói về thói quen hằng ngày.",
    goal_en:
      "Shop, order food, take a taxi, ask directions, talk about daily routines.",
    cando_vi: "Trao đổi thông tin đơn giản trong sinh hoạt thường ngày.",
    cando_en: "Exchange simple information in routine everyday situations.",
  },
  {
    level: "B1",
    label_vi: "Trung cấp",
    label_en: "Intermediate",
    goal_vi:
      "Xử lý tình huống du lịch, gọi điện đặt chỗ, mô tả trải nghiệm, kể chuyện.",
    goal_en:
      "Manage travel situations, make phone bookings, describe experiences, tell stories.",
    cando_vi: "Tự xoay xở khi đi lại; diễn đạt ý kiến, kế hoạch ở mức cơ bản.",
    cando_en: "Cope while travelling; express opinions and plans at a basic level.",
  },
  {
    level: "B2",
    label_vi: "Trung cao cấp",
    label_en: "Upper-intermediate",
    goal_vi:
      "Làm việc, báo mất đồ với cảnh sát, khiếu nại, thảo luận chủ đề quen thuộc trôi chảy.",
    goal_en:
      "Work, report lost items to police, complain, discuss familiar topics fluently.",
    cando_vi: "Tương tác khá tự nhiên; trình bày lập luận trên nhiều chủ đề.",
    cando_en: "Interact fairly naturally; argue a viewpoint across many topics.",
  },
  {
    level: "C1",
    label_vi: "Cao cấp",
    label_en: "Advanced",
    goal_vi:
      "Họp trang trọng, bất đồng lịch sự, dùng ngôn ngữ linh hoạt trong công việc.",
    goal_en:
      "Run formal meetings, disagree politely, use flexible language at work.",
    cando_vi: "Sử dụng tiếng Thái linh hoạt, hiệu quả cho mục đích xã hội và nghề nghiệp.",
    cando_en: "Use Thai flexibly and effectively for social and professional purposes.",
  },
  {
    level: "C2",
    label_vi: "Thành thạo",
    label_en: "Mastery",
    goal_vi:
      "Tóm tắt, chốt quyết định, điều phối tranh luận, dùng sắc thái và văn phong trang trọng.",
    goal_en:
      "Summarize, conclude decisions, moderate debate, command nuance and register.",
    cando_vi: "Hiểu và diễn đạt gần như mọi điều với sự chính xác và sắc thái.",
    cando_en: "Understand and express almost anything with precision and nuance.",
  },
];

// ── Modules / sections of the track ──────────────────────────────────────

export type ThaiModuleKey =
  | "levels"
  | "survival"
  | "vocabulary"
  | "tones"
  | "review"
  | "reading"
  | "writing"
  | "speaking"
  | "quizzes";

export type ThaiModule = {
  key: ThaiModuleKey;
  /** Short Thai label where it reads naturally (else empty string). */
  title_th: string;
  title_vi: string;
  title_en: string;
  desc_vi: string;
  desc_en: string;
};

export const THAI_MODULES: ThaiModule[] = [
  {
    key: "levels",
    title_th: "บทเรียนตามระดับ",
    title_vi: "Bài học theo cấp độ",
    title_en: "Leveled lessons",
    desc_vi: "Lộ trình A1→C2: ngữ pháp, mẫu câu, hội thoại theo từng cấp.",
    desc_en: "The A1→C2 path: grammar, sentence patterns, dialogues by level.",
  },
  {
    key: "survival",
    title_th: "ภาษาเอาตัวรอด",
    title_vi: "Tiếng Thái sinh tồn",
    title_en: "Survival Thai",
    desc_vi: "Cụm từ cấp cứu: chào, hỏi giá, taxi, khách sạn, nhà thuốc, cảnh sát.",
    desc_en: "Emergency phrases: greetings, prices, taxi, hotel, pharmacy, police.",
  },
  {
    key: "vocabulary",
    title_th: "คำศัพท์",
    title_vi: "Từ vựng",
    title_en: "Vocabulary",
    desc_vi: "Từ vựng theo chủ đề, kèm chữ Thái, phiên âm, nghĩa Việt và Anh.",
    desc_en: "Themed vocabulary with Thai script, romanization, VI and EN meanings.",
  },
  {
    key: "tones",
    title_th: "วรรณยุกต์",
    title_vi: "Thanh điệu",
    title_en: "Tones",
    desc_vi:
      "5 thanh của tiếng Thái. Người Việt có lợi thế vì tiếng Việt cũng có thanh.",
    desc_en:
      "Thai's five tones. Vietnamese speakers have an edge since Vietnamese is tonal too.",
  },
  {
    key: "review",
    title_th: "ทบทวน",
    title_vi: "Ôn tập",
    title_en: "Review",
    desc_vi: "Ôn lại trọng tâm từng cấp trước khi sang cấp tiếp theo.",
    desc_en: "Revisit each level's core before moving to the next.",
  },
  {
    key: "reading",
    title_th: "การอ่าน",
    title_vi: "Đọc",
    title_en: "Reading",
    desc_vi: "Tập đọc chữ Thái: phụ âm, nguyên âm, ghép vần, đọc câu ngắn.",
    desc_en: "Learn to read Thai script: consonants, vowels, syllables, short sentences.",
  },
  {
    key: "writing",
    title_th: "การเขียน",
    title_vi: "Viết",
    title_en: "Writing",
    desc_vi: "Tập viết chữ Thái và soạn câu đơn giản đúng quy tắc.",
    desc_en: "Practice writing Thai characters and composing simple correct sentences.",
  },
  {
    key: "speaking",
    title_th: "การพูด",
    title_vi: "Nói",
    title_en: "Speaking",
    desc_vi:
      "Bài đóng vai và gợi ý luyện nói. Lưu ý: chưa có chấm điểm phát âm.",
    desc_en:
      "Roleplays and speaking prompts. Note: no pronunciation scoring yet.",
  },
  {
    key: "quizzes",
    title_th: "แบบทดสอบ",
    title_vi: "Bài kiểm tra",
    title_en: "Quizzes",
    desc_vi: "Câu hỏi tự kiểm tra: nối từ, điền khuyết, dịch câu.",
    desc_en: "Self-check questions: matching, fill-in-the-blank, translation.",
  },
];

// ── Suggested learning order, by audience ────────────────────────────────
// The two orders differ on purpose. Vietnamese speakers already use lexical
// tone, so tones come early as a transfer win; reading Thai script is the
// real bottleneck, so it is front-loaded. English speakers usually meet tone
// for the first time, so survival phrases + romanization come first and the
// script is introduced a little later to avoid overwhelm.

export type ThaiSuggestedOrder = {
  audience: "vi" | "en";
  note_vi: string;
  note_en: string;
  order: ThaiModuleKey[];
};

export const THAI_SUGGESTED_ORDERS: ThaiSuggestedOrder[] = [
  {
    audience: "vi",
    note_vi:
      "Người Việt: tận dụng thanh điệu sớm, ưu tiên đọc chữ Thái vì đó là rào cản lớn nhất.",
    note_en:
      "Vietnamese speakers: lean on tone early; front-load reading Thai script as the main hurdle.",
    order: [
      "tones",
      "reading",
      "survival",
      "levels",
      "vocabulary",
      "writing",
      "speaking",
      "review",
      "quizzes",
    ],
  },
  {
    audience: "en",
    note_vi:
      "Người nói tiếng Anh: bắt đầu với cụm từ sinh tồn và phiên âm, học thanh điệu và chữ viết dần dần.",
    note_en:
      "English speakers: start with survival phrases and romanization; ease into tones and script.",
    order: [
      "survival",
      "tones",
      "vocabulary",
      "levels",
      "reading",
      "speaking",
      "writing",
      "review",
      "quizzes",
    ],
  },
];

// ── Honest warnings ──────────────────────────────────────────────────────

export type ThaiCourseWarning = {
  key: "native_review" | "no_audio" | "no_pron_scoring" | "romanization_aid";
  text_vi: string;
  text_en: string;
};

export const THAI_COURSE_WARNINGS: ThaiCourseWarning[] = [
  {
    key: "native_review",
    text_vi:
      "Nội dung chưa được người bản xứ kiểm duyệt — việc rà soát bản ngữ được hoãn lại.",
    text_en:
      "Content has not been checked by a native speaker — native review is deferred.",
  },
  {
    key: "no_audio",
    text_vi: "Hiện chưa có âm thanh; hãy dùng phiên âm để tự đọc.",
    text_en: "There is no audio yet; use the romanization to sound words out.",
  },
  {
    key: "no_pron_scoring",
    text_vi: "Chưa có chấm điểm phát âm; phần nói chỉ là tự luyện.",
    text_en: "There is no pronunciation scoring; speaking practice is self-guided.",
  },
  {
    key: "romanization_aid",
    text_vi: "Phiên âm chỉ là công cụ hỗ trợ học, không phải chuẩn chính thức.",
    text_en: "Romanization is a learning aid, not an official standard.",
  },
];

// ── Top-level course map aggregate ───────────────────────────────────────

export const THAI_COURSE_MAP = {
  code: "th" as const,
  name_th: "ภาษาไทย",
  name_vi: "Tiếng Thái",
  name_en: "Thai",
  levels: THAI_LEVEL_GOALS,
  modules: THAI_MODULES,
  suggestedOrders: THAI_SUGGESTED_ORDERS,
  warnings: THAI_COURSE_WARNINGS,
};
