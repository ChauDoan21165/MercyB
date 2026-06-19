// src/languages/thai/integrationAuditNotes.ts
//
// Integration audit notes for the Thai content pack (authored by A10), written
// for the FUTURE A11 integration agent. PURE DATA ONLY — no functions, no side
// effects, no imports. A11 should read this before wiring the Thai modules into
// the lesson registry / UI and before opening a merge request.
//
// Bilingual throughout: Vietnamese (`*_vi`) + English (`*_en`).
//
// NATIVE REVIEW DEFERRED — this is a teaching draft, not a vetted authority.

export type ThaiAuditSeverity = "low" | "medium" | "high";

export interface ThaiAuditBilingualItem {
  id: string;
  text_vi: string;
  text_en: string;
}

export interface ThaiAuditStatusItem {
  /** Machine-readable state. */
  value: boolean;
  text_vi: string;
  text_en: string;
}

export interface ThaiAuditCheck {
  id: string;
  /** Suggested severity / blocking weight of this check. */
  severity: ThaiAuditSeverity;
  check_vi: string;
  check_en: string;
}

export interface ThaiAuditRiskFlag {
  id: string;
  severity: ThaiAuditSeverity;
  flag_vi: string;
  flag_en: string;
}

export interface ThaiIntegrationAuditMeta {
  /** Who authored the pack and who consumes these notes. */
  authoredBy: string;
  intendedConsumer: string;
  scope_vi: string;
  scope_en: string;
  /** Honest status flags, machine-readable for gating. */
  nativeReviewed: boolean;
  audioSupported: boolean;
  officialCertification: boolean;
  bilingualSupport: { vi: boolean; en: boolean };
}

/** Required risk-flag ids the audit must surface (used by tests/UI). */
export const THAI_AUDIT_RISK_IDS = [
  "romanization-consistency",
  "duplicate-content",
  "unsupported-tone-scoring",
  "app-ready-not-native-certified",
] as const;

export const THAI_AUDIT_SEVERITIES: readonly ThaiAuditSeverity[] = [
  "low",
  "medium",
  "high",
] as const;

export const thaiIntegrationAuditMeta: ThaiIntegrationAuditMeta = {
  authoredBy: "A10 (Thai content pack)",
  intendedConsumer: "A11 (Thai integration)",
  scope_vi:
    "Bộ nội dung học tiếng Thái cho người nói tiếng Việt và tiếng Anh: ngân hàng lỗi, luyện thi A1–C2, prompt chẩn đoán, ghi chú chất lượng, và bài sửa lỗi. Sẵn sàng cho ứng dụng nhưng CHƯA được người bản ngữ chứng nhận.",
  scope_en:
    "A Thai learning pack for Vietnamese- and English-speaking users: error bank, A1–C2 exam practice, diagnostic prompts, quality notes, and repair drills. App-ready but NOT native-certified.",
  nativeReviewed: false,
  audioSupported: false,
  officialCertification: false,
  bilingualSupport: { vi: true, en: true },
};

/** The data modules A11 should expect to find and wire up. */
export const thaiExpectedModuleFiles: ThaiAuditBilingualItem[] = [
  {
    id: "errorPatterns",
    text_vi: "src/languages/thai/errorPatterns.ts — ngân hàng lỗi (thaiErrorPatterns).",
    text_en: "src/languages/thai/errorPatterns.ts — error bank (thaiErrorPatterns).",
  },
  {
    id: "examPractice",
    text_vi: "src/languages/thai/examPractice.ts — bài luyện thi A1–C2 (thaiExamTasks).",
    text_en: "src/languages/thai/examPractice.ts — A1–C2 exam tasks (thaiExamTasks).",
  },
  {
    id: "diagnosticPrompts",
    text_vi: "src/languages/thai/diagnosticPrompts.ts — prompt chẩn đoán (thaiDiagnosticPrompts).",
    text_en: "src/languages/thai/diagnosticPrompts.ts — diagnostic prompts (thaiDiagnosticPrompts).",
  },
  {
    id: "qualityNotes",
    text_vi: "src/languages/thai/qualityNotes.ts — siêu dữ liệu QA (thaiQualityMetadata).",
    text_en: "src/languages/thai/qualityNotes.ts — QA metadata (thaiQualityMetadata).",
  },
  {
    id: "mistakeRepairDrills",
    text_vi: "src/languages/thai/mistakeRepairDrills.ts — bài sửa lỗi (thaiMistakeRepairDrills).",
    text_en: "src/languages/thai/mistakeRepairDrills.ts — repair drills (thaiMistakeRepairDrills).",
  },
  {
    id: "integrationAuditNotes",
    text_vi: "src/languages/thai/integrationAuditNotes.ts — ghi chú tích hợp (tệp này).",
    text_en: "src/languages/thai/integrationAuditNotes.ts — integration notes (this file).",
  },
];

/** Claims the integrated product must NOT make about this pack. */
export const thaiForbiddenClaims: ThaiAuditBilingualItem[] = [
  {
    id: "no-native-review",
    text_vi: "Không tuyên bố nội dung đã được người bản ngữ tiếng Thái rà soát/chứng nhận.",
    text_en: "Do not claim the content was reviewed/certified by a native Thai speaker.",
  },
  {
    id: "no-certification",
    text_vi: "Không tuyên bố đây là bài thi xếp lớp chính thức hay cấp chứng chỉ.",
    text_en: "Do not claim this is an official placement test or grants certification.",
  },
  {
    id: "no-audio-scoring",
    text_vi: "Không tuyên bố có chấm điểm phát âm/âm thanh; mục nghe-nói chỉ là văn bản.",
    text_en: "Do not claim pronunciation/audio scoring; listening-speaking items are text-only.",
  },
  {
    id: "no-tone-guarantee",
    text_vi: "Không hứa hẹn dạy thanh điệu chính xác chỉ qua văn bản/phiên âm.",
    text_en: "Do not promise accurate tone mastery from text/romanization alone.",
  },
];

/** Known limitations A11 should keep visible to users. */
export const thaiKnownLimitations: ThaiAuditBilingualItem[] = [
  {
    id: "draft-content",
    text_vi: "Nội dung là bản nháp giảng dạy, có thể có lỗi chính tả/ngữ nghĩa chưa được bắt.",
    text_en: "Content is a teaching draft; spelling/meaning errors may remain uncaught.",
  },
  {
    id: "tone-via-text",
    text_vi: "Thanh điệu truyền qua văn bản không đáng tin; cần luyện nghe/nói riêng.",
    text_en: "Tone conveyed via text is unreliable; separate listening/speaking practice is needed.",
  },
  {
    id: "romanization-internal",
    text_vi: "Phiên âm dùng quy ước nội bộ, có thể khác RTGS/IPA và các tài liệu khác.",
    text_en: "Romanization uses an internal convention that may differ from RTGS/IPA and other materials.",
  },
  {
    id: "level-guidance-only",
    text_vi: "Nhãn A1–C2 chỉ mang tính hướng dẫn học tập, không phải kết quả xếp lớp.",
    text_en: "A1–C2 labels are study guidance only, not placement results.",
  },
];

/** Checks A11 should run before opening a merge request. */
export const thaiPreMrChecks: ThaiAuditCheck[] = [
  {
    id: "run-thai-tests",
    severity: "high",
    check_vi: "Chạy toàn bộ test trong src/languages/thai/__tests__/ và đảm bảo xanh.",
    check_en: "Run all tests under src/languages/thai/__tests__/ and confirm green.",
  },
  {
    id: "typecheck",
    severity: "high",
    check_vi: "Chạy typecheck:ci (tsc --noEmit) — không có lỗi kiểu khi import các module Thái.",
    check_en: "Run typecheck:ci (tsc --noEmit) — no type errors when importing the Thai modules.",
  },
  {
    id: "no-forbidden-claims-in-ui",
    severity: "high",
    check_vi: "Rà soát UI/chuỗi hiển thị: không có tuyên bố bị cấm (bản ngữ/chứng chỉ/chấm âm thanh).",
    check_en: "Audit UI strings: none of the forbidden claims (native review/certification/audio scoring) appear.",
  },
  {
    id: "bilingual-rendering",
    severity: "medium",
    check_vi: "Kiểm tra cả trường _vi và _en đều render cho người học Việt và Anh.",
    check_en: "Verify both _vi and _en fields render for Vietnamese and English learners.",
  },
  {
    id: "duplicate-id-scan",
    severity: "medium",
    check_vi: "Quét trùng id giữa các module (errorPatterns/examPractice/diagnostic/repair) khi gộp.",
    check_en: "Scan for duplicate ids across modules (errorPatterns/examPractice/diagnostic/repair) when merging.",
  },
  {
    id: "thai-script-integrity",
    severity: "medium",
    check_vi: "Xác nhận chữ Thái không bị hỏng mã hóa (mojibake) sau khi build/bundle.",
    check_en: "Confirm Thai script is not corrupted (mojibake) after build/bundle.",
  },
  {
    id: "romanization-consistency-spot-check",
    severity: "low",
    check_vi: "Đối chiếu mẫu phiên âm với quy ước đã ghi (thanh: à/â/á/ǎ; nguyên âm dài gấp đôi).",
    check_en: "Spot-check romanization against the documented convention (tones à/â/á/ǎ; doubled long vowels).",
  },
];

/** Risk register for the integration. Must cover THAI_AUDIT_RISK_IDS. */
export const thaiAuditRiskFlags: ThaiAuditRiskFlag[] = [
  {
    id: "romanization-consistency",
    severity: "medium",
    flag_vi:
      "Phiên âm có thể không nhất quán với hệ thống bên ngoài, gây nhầm khi đối chiếu tài liệu khác.",
    flag_en:
      "Romanization may be inconsistent with external systems, confusing cross-referencing.",
  },
  {
    id: "duplicate-content",
    severity: "medium",
    flag_vi:
      "Một số điểm ngữ pháp lặp lại giữa các module (ví dụ lượng từ, phủ định) — có thể trùng khi gộp danh sách.",
    flag_en:
      "Some grammar points repeat across modules (e.g. classifiers, negation) — possible duplication when lists are merged.",
  },
  {
    id: "unsupported-tone-scoring",
    severity: "high",
    flag_vi:
      "Không có chấm điểm thanh điệu/phát âm; đừng kết nối phần này với bất kỳ chỉ số phát âm nào.",
    flag_en:
      "No tone/pronunciation scoring exists; do not wire these into any pronunciation metric.",
  },
  {
    id: "app-ready-not-native-certified",
    severity: "high",
    flag_vi:
      "Nội dung sẵn sàng cho ứng dụng nhưng CHƯA được người bản ngữ chứng nhận; cần nhãn rõ ràng và rà soát sau.",
    flag_en:
      "Content is app-ready but NOT native-certified; surface a clear disclaimer and schedule review.",
  },
];

export default thaiIntegrationAuditMeta;
