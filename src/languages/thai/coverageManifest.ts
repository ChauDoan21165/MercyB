// src/languages/thai/coverageManifest.ts
//
// Coverage manifest for the Thai track — a compact, machine-checkable list of
// every module integration/QA should expect, with its learning purpose. PURE
// DATA ONLY: no UI wiring, no side effects, safe to import in tests/tooling.
//
// Bilingual: each entry has a Vietnamese (`*_vi`) and English (`*_en`) purpose,
// authored per audience (same intent, audience-specific wording) — NOT
// translations of each other.
//
// `THAI_COVERAGE_FLAGS` carries the honest, track-wide limitations so QA can
// assert them rather than assume completeness: native review is deferred, there
// is no audio scoring, no pronunciation scoring, and no official certification.

export type ThaiCoverageKey =
  | "a1"
  | "a2"
  | "b1"
  | "b2"
  | "c1"
  | "c2"
  | "survival"
  | "vocabulary"
  | "tone_awareness"
  | "grammar"
  | "reading"
  | "writing"
  | "speaking_prompts"
  | "diagnostics"
  | "emergency"
  | "business"
  | "culture_register";

export type ThaiCoverageEntry = {
  key: ThaiCoverageKey;
  title_vi: string;
  title_en: string;
  /** Learning purpose for the Vietnamese-speaking audience. */
  purpose_vi: string;
  /** Learning purpose for the English-speaking audience. */
  purpose_en: string;
};

export const THAI_COVERAGE_MODULES: ThaiCoverageEntry[] = [
  {
    key: "a1",
    title_vi: "A1 — Nền tảng",
    title_en: "A1 — Foundation",
    purpose_vi: "Chào hỏi, tiểu từ lịch sự ครับ/ค่ะ, đọc chữ Thái và số đếm cơ bản.",
    purpose_en: "Greetings, polite particles ครับ/ค่ะ, basic Thai reading and numbers.",
  },
  {
    key: "a2",
    title_vi: "A2 — Sơ cấp",
    title_en: "A2 — Elementary",
    purpose_vi: "Mua sắm, gọi món, đi taxi, hỏi đường, nói về sinh hoạt hằng ngày.",
    purpose_en: "Shopping, ordering food, taxis, directions, daily-life talk.",
  },
  {
    key: "b1",
    title_vi: "B1 — Trung cấp",
    title_en: "B1 — Intermediate",
    purpose_vi: "Xử lý du lịch, gọi điện đặt chỗ, mô tả trải nghiệm và kế hoạch.",
    purpose_en: "Handle travel, phone bookings, describe experiences and plans.",
  },
  {
    key: "b2",
    title_vi: "B2 — Trung cao cấp",
    title_en: "B2 — Upper-intermediate",
    purpose_vi: "Làm việc, khiếu nại, báo cảnh sát, thảo luận chủ đề quen thuộc.",
    purpose_en: "Work, complaints, police reports, discussing familiar topics.",
  },
  {
    key: "c1",
    title_vi: "C1 — Cao cấp",
    title_en: "C1 — Advanced",
    purpose_vi: "Họp trang trọng, bất đồng lịch sự, dùng ngôn ngữ linh hoạt.",
    purpose_en: "Formal meetings, polite disagreement, flexible language use.",
  },
  {
    key: "c2",
    title_vi: "C2 — Thành thạo",
    title_en: "C2 — Mastery",
    purpose_vi: "Tóm tắt, chốt quyết định, điều phối tranh luận, làm chủ sắc thái.",
    purpose_en: "Summarize, conclude decisions, moderate debate, command nuance.",
  },
  {
    key: "survival",
    title_vi: "Tiếng Thái sinh tồn",
    title_en: "Survival Thai",
    purpose_vi: "Cụm từ cấp tốc cho người mới đến: chào, giá cả, đi lại, ăn uống.",
    purpose_en: "Quick phrases for newcomers: greetings, prices, transport, eating.",
  },
  {
    key: "vocabulary",
    title_vi: "Từ vựng",
    title_en: "Vocabulary",
    purpose_vi: "Mở rộng vốn từ theo chủ đề, kèm chữ Thái, phiên âm và nghĩa.",
    purpose_en: "Build themed vocabulary with Thai script, romanization, meanings.",
  },
  {
    key: "tone_awareness",
    title_vi: "Nhận biết thanh điệu",
    title_en: "Tone awareness",
    purpose_vi: "Phân biệt 5 thanh; tận dụng nền thanh điệu sẵn có của người Việt.",
    purpose_en: "Distinguish the five tones; leverage Vietnamese speakers' tonal base.",
  },
  {
    key: "grammar",
    title_vi: "Ngữ pháp",
    title_en: "Grammar",
    purpose_vi: "Trật tự từ, phân loại từ, thì và hạt ngữ pháp của tiếng Thái.",
    purpose_en: "Word order, classifiers, aspect, and Thai grammatical particles.",
  },
  {
    key: "reading",
    title_vi: "Đọc",
    title_en: "Reading",
    purpose_vi: "Đọc chữ Thái: phụ âm, nguyên âm, ghép vần, câu và đoạn ngắn.",
    purpose_en: "Read Thai script: consonants, vowels, syllables, sentences, short texts.",
  },
  {
    key: "writing",
    title_vi: "Viết",
    title_en: "Writing",
    purpose_vi: "Viết chữ Thái đúng nét và soạn câu đơn giản đúng quy tắc.",
    purpose_en: "Write Thai characters correctly and compose simple correct sentences.",
  },
  {
    key: "speaking_prompts",
    title_vi: "Gợi ý luyện nói",
    title_en: "Speaking prompts",
    purpose_vi: "Đóng vai và câu gợi ý để tự luyện nói (không chấm điểm phát âm).",
    purpose_en: "Roleplay and prompts for self-guided speaking (no pronunciation scoring).",
  },
  {
    key: "diagnostics",
    title_vi: "Chẩn đoán / Xếp lớp",
    title_en: "Diagnostics / Placement",
    purpose_vi: "Tự kiểm tra để ước lượng trình độ: nối từ, điền khuyết, dịch câu.",
    purpose_en: "Self-checks to estimate level: matching, fill-in-the-blank, translation.",
  },
  {
    key: "emergency",
    title_vi: "Khẩn cấp",
    title_en: "Emergency",
    purpose_vi: "Cụm từ khẩn: nhà thuốc, báo mất đồ/cảnh sát, gọi trợ giúp.",
    purpose_en: "Emergency phrases: pharmacy, lost-item/police report, calling for help.",
  },
  {
    key: "business",
    title_vi: "Công việc / Kinh doanh",
    title_en: "Business",
    purpose_vi: "Ngôn ngữ công sở: ngày đầu đi làm, họp, email, đàm phán cơ bản.",
    purpose_en: "Workplace language: first day, meetings, email, basic negotiation.",
  },
  {
    key: "culture_register",
    title_vi: "Văn hóa / Sắc thái lịch sự",
    title_en: "Culture / Register",
    purpose_vi: "Hiểu mức độ lịch sự, kính ngữ, và quy tắc giao tiếp văn hóa Thái.",
    purpose_en: "Understand politeness levels, honorifics, and Thai cultural norms.",
  },
];

// ── Honest track-wide flags (for QA assertions) ──────────────────────────

export type ThaiCoverageFlags = {
  /** Content has not been reviewed by a native speaker yet. */
  nativeReviewDeferred: boolean;
  /** No automated audio scoring. */
  noAudioScoring: boolean;
  /** No pronunciation scoring. */
  noPronunciationScoring: boolean;
  /** No official certification / accreditation is claimed. */
  noOfficialCertification: boolean;
  /** Bilingual explanations (VI + EN) for these flags. */
  notes_vi: string;
  notes_en: string;
};

export const THAI_COVERAGE_FLAGS: ThaiCoverageFlags = {
  nativeReviewDeferred: true,
  noAudioScoring: true,
  noPronunciationScoring: true,
  noOfficialCertification: true,
  notes_vi:
    "Nội dung chưa được người bản xứ kiểm duyệt (hoãn lại), không có chấm điểm âm thanh " +
    "hay phát âm, và không phải chứng chỉ chính thức.",
  notes_en:
    "Content is not native-reviewed (deferred), has no audio or pronunciation scoring, " +
    "and is not an official certification.",
};

// ── Top-level manifest aggregate ─────────────────────────────────────────

export const THAI_COVERAGE_MANIFEST = {
  code: "th" as const,
  name_th: "ภาษาไทย",
  name_vi: "Tiếng Thái",
  name_en: "Thai",
  modules: THAI_COVERAGE_MODULES,
  flags: THAI_COVERAGE_FLAGS,
};
