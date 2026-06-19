// src/languages/thai/qualityNotes.ts
//
// Final-QA metadata for the Thai learning content pack (A10). PURE DATA ONLY —
// no functions, no side effects, no imports. This module documents the scope,
// limitations, review state, and safety notes for the sibling Thai data files
// so any consumer (UI, audit, export) can surface honest disclaimers.
//
// Bilingual throughout: Vietnamese (`*_vi`) + English (`*_en`).

export type ThaiReviewState = "draft-native-review-deferred";

export type ThaiRiskSeverity = "low" | "medium" | "high";

export interface ThaiBilingualNote {
  /** Stable id from THAI_QUALITY_NOTE_IDS. */
  id: string;
  title_vi: string;
  title_en: string;
  detail_vi: string;
  detail_en: string;
}

export interface ThaiModuleEntry {
  /** Source file path, repo-relative. */
  file: string;
  /** Primary named export of that module. */
  export: string;
  summary_vi: string;
  summary_en: string;
}

export interface ThaiRiskFlag {
  id: string;
  severity: ThaiRiskSeverity;
  flag_vi: string;
  flag_en: string;
}

export interface ThaiQualityMetadata {
  /** Plain-language scope of the whole Thai pack. */
  scope_vi: string;
  scope_en: string;
  /** Where the content sits in the review lifecycle. */
  reviewState: ThaiReviewState;
  /** Has a native Thai speaker signed off? Always false until reviewed. */
  nativeReviewClaimed: boolean;
  /** Does the pack do audio / pronunciation scoring? It does not. */
  audioPronunciationScoring: boolean;
  /** Is this an official placement test / certification? It is not. */
  officialCertification: boolean;
  /** Bilingual learner support promise. */
  bilingualSupport: { vi: boolean; en: boolean };
}

/** Canonical ids the QA notes must cover (used by tests/UI). */
export const THAI_QUALITY_NOTE_IDS = [
  "no-native-review",
  "no-audio-scoring",
  "tone-limitations",
  "romanization-consistency",
  "bilingual-support",
] as const;

export const THAI_RISK_SEVERITIES: readonly ThaiRiskSeverity[] = [
  "low",
  "medium",
  "high",
] as const;

export const thaiQualityMetadata: ThaiQualityMetadata = {
  scope_vi:
    "Gói nội dung học tiếng Thái cho người nói tiếng Việt và tiếng Anh: ngân hàng lỗi, bài luyện thi A1–C2, và prompt chẩn đoán điểm yếu. Dùng để hỗ trợ tự học trong ứng dụng.",
  scope_en:
    "A Thai learning pack for Vietnamese- and English-speaking users: an error-pattern bank, A1–C2 exam-style practice, and diagnostic prompts. Intended as in-app self-study support.",
  reviewState: "draft-native-review-deferred",
  nativeReviewClaimed: false,
  audioPronunciationScoring: false,
  officialCertification: false,
  bilingualSupport: { vi: true, en: true },
};

export const thaiModules: ThaiModuleEntry[] = [
  {
    file: "src/languages/thai/errorPatterns.ts",
    export: "thaiErrorPatterns",
    summary_vi:
      "Ngân hàng lỗi thường gặp (tiểu từ, trật tự từ, lượng từ, thanh điệu, lịch sự, đại từ, thì/thể, phủ định, dịch máy).",
    summary_en:
      "Common-mistake bank (particles, word order, classifiers, tone, politeness, pronouns, tense/aspect, negation, over-literal translation).",
  },
  {
    file: "src/languages/thai/examPractice.ts",
    export: "thaiExamTasks",
    summary_vi:
      "Bài luyện theo dạng đề A1–C2: đọc, ngữ pháp, từ vựng, viết, nói (chỉ văn bản), nghe (kịch bản, chỉ văn bản); kèm đáp án, rubric, lỗi thường gặp.",
    summary_en:
      "A1–C2 exam-style tasks: reading, grammar, vocabulary, writing, speaking (text-only), listening (script, text-only); with answer key, rubric, and common-mistake notes.",
  },
  {
    file: "src/languages/thai/diagnosticPrompts.ts",
    export: "thaiDiagnosticPrompts",
    summary_vi:
      "Prompt chẩn đoán điểm yếu (tiểu từ, trật tự từ, lượng từ, thanh điệu, lịch sự, đại từ, từ chỉ thời gian, phủ định, đọc, viết, sinh tồn) kèm dạng đáp án mong đợi và gợi ý chấm.",
    summary_en:
      "Diagnostic prompts mapping to likely weaknesses (particles, word order, classifier, tone, politeness, pronouns, time markers, negation, reading, writing, survival) with expected answer shape and scoring hints.",
  },
  {
    file: "src/languages/thai/qualityNotes.ts",
    export: "thaiQualityMetadata",
    summary_vi:
      "Siêu dữ liệu QA: phạm vi, giới hạn, trạng thái rà soát, lưu ý an toàn (tệp này).",
    summary_en:
      "QA metadata: scope, limitations, review state, and safety notes (this file).",
  },
];

export const thaiQualityNotes: ThaiBilingualNote[] = [
  {
    id: "no-native-review",
    title_vi: "Chưa có người bản ngữ rà soát",
    title_en: "No native review",
    detail_vi:
      "Toàn bộ nội dung là bản nháp giảng dạy, CHƯA được người bản ngữ tiếng Thái kiểm tra. Việc rà soát bản ngữ được hoãn lại; đừng coi đây là chuẩn cuối cùng.",
    detail_en:
      "All content is a teaching draft and has NOT been checked by a native Thai speaker. Native review is deferred; do not treat it as a final authority.",
  },
  {
    id: "no-audio-scoring",
    title_vi: "Không có chấm điểm âm thanh/phát âm",
    title_en: "No audio / pronunciation scoring",
    detail_vi:
      "Gói này không bao gồm phát âm tự động, chấm điểm phát âm, hay tệp âm thanh. Các phần 'nghe/nói' chỉ là văn bản (kịch bản và prompt).",
    detail_en:
      "This pack includes no audio assets, no automated pronunciation, and no pronunciation scoring. 'Listening/speaking' items are text-only (scripts and prompts).",
  },
  {
    id: "tone-limitations",
    title_vi: "Giới hạn về thanh điệu",
    title_en: "Tone limitations",
    detail_vi:
      "Tiếng Thái có thanh điệu; sai thanh có thể đổi nghĩa hoàn toàn. Văn bản không thể truyền tải thanh điệu thực; dấu thanh trong phiên âm chỉ là gợi ý, cần luyện nghe/nói riêng.",
    detail_en:
      "Thai is tonal; a wrong tone can change meaning entirely. Text cannot convey real tone — the romanization tone marks are hints only, and learners still need separate listening/speaking practice.",
  },
  {
    id: "romanization-consistency",
    title_vi: "Cảnh báo nhất quán phiên âm",
    title_en: "Romanization consistency warning",
    detail_vi:
      "Phiên âm dùng quy ước nội bộ (thanh: à/â/á/ǎ; nguyên âm dài gấp đôi) và CÓ THỂ khác với RTGS, IPA hay các giáo trình khác. Hãy ưu tiên chữ Thái khi cần độ chính xác; phiên âm chỉ để hỗ trợ.",
    detail_en:
      "Romanization follows an internal convention (tones à/â/á/ǎ; long vowels doubled) and MAY differ from RTGS, IPA, or other textbooks. Prefer Thai script for accuracy; treat romanization as a support aid.",
  },
  {
    id: "bilingual-support",
    title_vi: "Cam kết song ngữ",
    title_en: "Bilingual support promise",
    detail_vi:
      "Mọi mục đều có giải thích bằng tiếng Việt VÀ tiếng Anh, phục vụ cả người học nói tiếng Việt lẫn tiếng Anh. Tiếng Việt là ngôn ngữ ưu tiên cho người học Việt.",
    detail_en:
      "Every item carries BOTH Vietnamese and English explanations, serving Vietnamese- and English-speaking learners. Vietnamese is the priority language for Vietnamese learners.",
  },
];

export const thaiRiskFlags: ThaiRiskFlag[] = [
  {
    id: "risk-unreviewed-thai",
    severity: "high",
    flag_vi:
      "Chữ Thái và bản dịch chưa được người bản ngữ kiểm tra — có thể có lỗi chính tả/thanh điệu/ngữ nghĩa.",
    flag_en:
      "Thai script and glosses are unreviewed by a native speaker — possible spelling/tone/meaning errors.",
  },
  {
    id: "risk-tone-via-text",
    severity: "medium",
    flag_vi:
      "Thanh điệu truyền qua văn bản không đáng tin; người học có thể nội hoá phát âm sai nếu không luyện nghe.",
    flag_en:
      "Tone conveyed through text is unreliable; learners may internalize wrong pronunciation without listening practice.",
  },
  {
    id: "risk-romanization-drift",
    severity: "medium",
    flag_vi:
      "Phiên âm có thể không khớp với hệ thống bên ngoài, gây nhầm lẫn khi đối chiếu tài liệu khác.",
    flag_en:
      "Romanization may not match external systems, causing confusion when cross-referencing other materials.",
  },
  {
    id: "risk-not-placement",
    severity: "low",
    flag_vi:
      "Nhãn cấp độ A1–C2 chỉ mang tính hướng dẫn học tập, KHÔNG phải kết quả xếp lớp hay chứng chỉ chính thức.",
    flag_en:
      "A1–C2 level labels are study guidance only — NOT an official placement result or certification.",
  },
];

export default thaiQualityMetadata;
