// src/languages/thai/publicRoadmap.ts
//
// Public-facing roadmap metadata for the Thai track. PURE DATA ONLY — no UI
// wiring, no side effects. Its job is HONESTY: it states, per module, what is
// usable today, what is study-support only, and what still needs native review,
// so the product never over-promises.
//
// Bilingual: every learner-facing string has a Vietnamese (`*_vi`) and English
// (`*_en`) sibling, authored per audience (same intent, audience-specific
// wording) — NOT translations of each other.
//
// Three honest, non-negotiable disclaimers are carried in `THAI_ROADMAP_DISCLAIMERS`
// and apply to the WHOLE track:
//   1. native review is deferred (content not checked by a native speaker),
//   2. there is no audio and no pronunciation scoring,
//   3. no official certification / CEFR accreditation is claimed.

// Status of a module on the public roadmap.
//   available           — usable now as learning material (still text-first).
//   study_support_only  — scaffolding/aids only; not a complete taught module yet.
//   needs_native_review — present but explicitly awaiting native-speaker review.
export type ThaiRoadmapStatus =
  | "available"
  | "study_support_only"
  | "needs_native_review";

export type ThaiRoadmapModuleKey =
  | "foundation"
  | "a1"
  | "a2"
  | "b1"
  | "b2"
  | "c1"
  | "c2"
  | "survival"
  | "vocab"
  | "tones"
  | "dialogues"
  | "reading"
  | "writing"
  | "speaking"
  | "placement"
  | "review"
  | "emergency";

export type ThaiRoadmapModule = {
  key: ThaiRoadmapModuleKey;
  title_vi: string;
  title_en: string;
  status: ThaiRoadmapStatus;
  /** What exists today and how to use it — Vietnamese audience. */
  desc_vi: string;
  /** What exists today and how to use it — English audience. */
  desc_en: string;
  /** True until a native speaker has reviewed the module's content. */
  needsNativeReview: boolean;
};

export const THAI_ROADMAP_MODULES: ThaiRoadmapModule[] = [
  {
    key: "foundation",
    title_vi: "Nền tảng",
    title_en: "Foundation",
    status: "available",
    desc_vi: "Khối nền: metadata, kiểu dữ liệu bài học, chuẩn hóa, bài A1 khởi đầu.",
    desc_en: "The base: metadata, lesson types, normalizer, and the starter A1 lesson.",
    needsNativeReview: true,
  },
  {
    key: "a1",
    title_vi: "A1 — Nền tảng",
    title_en: "A1 — Foundation",
    status: "available",
    desc_vi: "Chào hỏi, tiểu từ lịch sự ครับ/ค่ะ, từ vựng và mẫu câu cơ bản.",
    desc_en: "Greetings, polite particles ครับ/ค่ะ, basic vocabulary and patterns.",
    needsNativeReview: true,
  },
  {
    key: "a2",
    title_vi: "A2 — Sơ cấp",
    title_en: "A2 — Elementary",
    status: "study_support_only",
    desc_vi: "Có khung lộ trình và một số hội thoại; chưa đủ bài học hoàn chỉnh.",
    desc_en: "Roadmap scaffolding and some dialogues exist; not a full lesson set yet.",
    needsNativeReview: true,
  },
  {
    key: "b1",
    title_vi: "B1 — Trung cấp",
    title_en: "B1 — Intermediate",
    status: "study_support_only",
    desc_vi: "Có hội thoại tình huống du lịch/điện thoại; bài học hệ thống đang chờ.",
    desc_en: "Travel/phone scenario dialogues exist; systematic lessons pending.",
    needsNativeReview: true,
  },
  {
    key: "b2",
    title_vi: "B2 — Trung cao cấp",
    title_en: "B2 — Upper-intermediate",
    status: "study_support_only",
    desc_vi: "Có hội thoại công việc/cảnh sát; nội dung học chính thức đang chờ.",
    desc_en: "Work/police scenario dialogues exist; formal teaching content pending.",
    needsNativeReview: true,
  },
  {
    key: "c1",
    title_vi: "C1 — Cao cấp",
    title_en: "C1 — Advanced",
    status: "study_support_only",
    desc_vi: "Có hội thoại họp/bất đồng lịch sự; bài học chuyên sâu đang chờ.",
    desc_en: "Meeting/polite-disagreement dialogues exist; in-depth lessons pending.",
    needsNativeReview: true,
  },
  {
    key: "c2",
    title_vi: "C2 — Thành thạo",
    title_en: "C2 — Mastery",
    status: "study_support_only",
    desc_vi: "Có hội thoại trang trọng/chốt quyết định; nội dung đầy đủ đang chờ.",
    desc_en: "Formal/decision-closing dialogues exist; full content pending.",
    needsNativeReview: true,
  },
  {
    key: "survival",
    title_vi: "Tiếng Thái sinh tồn",
    title_en: "Survival Thai",
    status: "available",
    desc_vi: "Cụm từ cấp tốc: chào, hỏi giá, taxi, khách sạn, nhà thuốc, cảnh sát.",
    desc_en: "Quick phrases: greetings, prices, taxi, hotel, pharmacy, police.",
    needsNativeReview: true,
  },
  {
    key: "vocab",
    title_vi: "Từ vựng",
    title_en: "Vocabulary",
    status: "study_support_only",
    desc_vi: "Từ vựng nằm trong bài học; bộ từ vựng theo chủ đề riêng đang chờ.",
    desc_en: "Vocabulary lives inside lessons; a standalone themed set is pending.",
    needsNativeReview: true,
  },
  {
    key: "tones",
    title_vi: "Thanh điệu",
    title_en: "Tones",
    status: "study_support_only",
    desc_vi: "Có ghi chú thanh điệu trong bài; module luyện thanh riêng đang chờ.",
    desc_en: "Tone notes appear in lessons; a dedicated tone module is pending.",
    needsNativeReview: true,
  },
  {
    key: "dialogues",
    title_vi: "Hội thoại / Đóng vai",
    title_en: "Dialogues / Roleplay",
    status: "available",
    desc_vi: "Bộ hội thoại ngắn nhiều chủ đề, kèm gợi ý đóng vai và câu mẫu.",
    desc_en: "A multi-topic set of short dialogues with roleplay prompts and model answers.",
    needsNativeReview: true,
  },
  {
    key: "reading",
    title_vi: "Đọc",
    title_en: "Reading",
    status: "study_support_only",
    desc_vi: "Mỗi câu có chữ Thái + phiên âm; chương trình học đọc bài bản đang chờ.",
    desc_en: "Every line has Thai script + romanization; a structured reading course is pending.",
    needsNativeReview: true,
  },
  {
    key: "writing",
    title_vi: "Viết",
    title_en: "Writing",
    status: "study_support_only",
    desc_vi: "Chưa có module tập viết chữ Thái; hiện chỉ tham khảo qua bài học.",
    desc_en: "No Thai-handwriting module yet; only incidental exposure via lessons.",
    needsNativeReview: true,
  },
  {
    key: "speaking",
    title_vi: "Nói",
    title_en: "Speaking",
    status: "study_support_only",
    desc_vi: "Chỉ tự luyện qua gợi ý đóng vai. KHÔNG có chấm điểm phát âm.",
    desc_en: "Self-guided via roleplay prompts only. NO pronunciation scoring.",
    needsNativeReview: true,
  },
  {
    key: "placement",
    title_vi: "Xếp lớp / Chẩn đoán",
    title_en: "Placement / Diagnostics",
    status: "study_support_only",
    desc_vi: "Có câu tự kiểm tra trong bài; bài xếp lớp chính thức đang chờ.",
    desc_en: "Self-check questions exist in lessons; a formal placement test is pending.",
    needsNativeReview: true,
  },
  {
    key: "review",
    title_vi: "Ôn tập",
    title_en: "Review",
    status: "study_support_only",
    desc_vi: "Có cấu trúc ôn tập trong course map; bộ ôn tập riêng đang chờ.",
    desc_en: "Review structure exists in the course map; a dedicated review set is pending.",
    needsNativeReview: true,
  },
  {
    key: "emergency",
    title_vi: "Khẩn cấp",
    title_en: "Emergency",
    status: "available",
    desc_vi: "Cụm từ khẩn: nhà thuốc, báo mất đồ/cảnh sát, gọi trợ giúp.",
    desc_en: "Emergency phrases: pharmacy, lost-item/police report, calling for help.",
    needsNativeReview: true,
  },
];

// ── Track-wide honest disclaimers ────────────────────────────────────────

export type ThaiRoadmapDisclaimer = {
  key: "native_review_deferred" | "no_audio_or_scoring" | "no_certification";
  text_vi: string;
  text_en: string;
};

export const THAI_ROADMAP_DISCLAIMERS: ThaiRoadmapDisclaimer[] = [
  {
    key: "native_review_deferred",
    text_vi:
      "Toàn bộ nội dung tiếng Thái CHƯA được người bản xứ kiểm duyệt — việc rà soát bản ngữ được hoãn lại.",
    text_en:
      "All Thai content is NOT yet checked by a native speaker — native review is deferred.",
  },
  {
    key: "no_audio_or_scoring",
    text_vi:
      "Hiện KHÔNG có âm thanh và KHÔNG có chấm điểm phát âm; phiên âm chỉ là công cụ hỗ trợ.",
    text_en:
      "There is currently NO audio and NO pronunciation scoring; romanization is only an aid.",
  },
  {
    key: "no_certification",
    text_vi:
      "Đây KHÔNG phải chứng chỉ chính thức; nhãn cấp độ CEFR chỉ mang tính tham khảo, không phải kiểm định.",
    text_en:
      "This is NOT an official certification; CEFR level labels are indicative only, not accredited.",
  },
];

// ── Top-level roadmap aggregate ──────────────────────────────────────────

export const THAI_PUBLIC_ROADMAP = {
  code: "th" as const,
  name_th: "ภาษาไทย",
  name_vi: "Tiếng Thái",
  name_en: "Thai",
  modules: THAI_ROADMAP_MODULES,
  disclaimers: THAI_ROADMAP_DISCLAIMERS,
};
