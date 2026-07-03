/**
 * Local UI Smoke Checklist — Step 117 (Final)
 *
 * Comprehensive UI smoke-test checklist for Teacher Mercy's tutor surfaces.
 * Defines what MUST be verified locally before a deploy to ensure the AI tutor
 * UI is intact, Vietnamese-first, mobile-responsive, and crash-free.
 *
 * Covers all 6 teacher capabilities at the UI level:
 *
 *   1. Diagnose  — Error detection / correction UI renders correctly
 *   2. Teach     — Teaching interaction (chat, speak, grammar, kids) works
 *   3. Remember  — Memory cards, history, progress indicators display
 *   4. Adapt     — Support-mode picker, difficulty, kids/adult modes
 *   5. Self-check — Safety warnings, overclaim guards, debug gating
 *   6. Prove     — Progress tracking, certificates, before/after comparison
 *
 * Plus cross-cutting checks: Vietnamese-first, mobile, no-crash, tabs.
 *
 * All pure functions — no I/O, no side effects, deterministic.
 * Vietnamese-first in all user-facing labels, summaries, and action items.
 *
 * Single command to validate the checklist itself:
 *   npx vitest run src/lib/tutor/__tests__/localUiSmokeChecklist.test.ts
 */

// ─── UI Surface Types ────────────────────────────────────────────────────────

/** UI surface IDs — the major UI pages/components a smoke run must verify. */
export type UiSmokeSurfaceId =
  | "aiTutorPage"
  | "mercyUnifiedPage"
  | "kidsTutorPage"
  | "mercyGuideHome"
  | "mercyGuideRoom"
  | "mercyTeacherTab"
  | "mercySpeakTab"
  | "mercyGuideTab"
  | "mercySuggestTab"
  | "mercyEnglishTab"
  | "tutorMemoryCard"
  | "todayLessonPlanner"
  | "learningShell"
  | "learningSupportMode"
  | "unifiedMercyChat"
  | "pronunciationRecorder"
  | "certificateView"
  | "shareProgressPage";

/** All UI surfaces in catalog order. */
export const UI_SMOKE_SURFACE_IDS: UiSmokeSurfaceId[] = [
  "aiTutorPage",
  "mercyUnifiedPage",
  "kidsTutorPage",
  "mercyGuideHome",
  "mercyGuideRoom",
  "mercyTeacherTab",
  "mercySpeakTab",
  "mercyGuideTab",
  "mercySuggestTab",
  "mercyEnglishTab",
  "tutorMemoryCard",
  "todayLessonPlanner",
  "learningShell",
  "learningSupportMode",
  "unifiedMercyChat",
  "pronunciationRecorder",
  "certificateView",
  "shareProgressPage",
];

/** Labels for UI surfaces in Vietnamese. */
export const UI_SMOKE_SURFACE_LABELS_VI: Record<UiSmokeSurfaceId, string> = {
  aiTutorPage: "Trang AI Tutor (/ai-tutor)",
  mercyUnifiedPage: "Trang Mercy hợp nhất (/mercy/chat)",
  kidsTutorPage: "Trang Gia sư trẻ em (/kids/tutor)",
  mercyGuideHome: "Mercy Guide trên Trang chủ",
  mercyGuideRoom: "Mercy Guide trong phòng học",
  mercyTeacherTab: "Tab Giáo viên (MercyTeacherTab)",
  mercySpeakTab: "Tab Nói (MercySpeakTab)",
  mercyGuideTab: "Tab Hướng dẫn (MercyGuideTab)",
  mercySuggestTab: "Tab Gợi ý (MercySuggestTab)",
  mercyEnglishTab: "Tab Tiếng Anh (MercyEnglishTab)",
  tutorMemoryCard: "Thẻ Ghi nhớ (TutorMemoryCard)",
  todayLessonPlanner: "Kế hoạch bài hôm nay (TodayLesson)",
  learningShell: "Vỏ giao diện học tập (TeacherMercyLearningShell)",
  learningSupportMode: "Bộ chọn Chế độ hỗ trợ (LearningSupportMode)",
  unifiedMercyChat: "Chat hợp nhất (UnifiedMercyChat)",
  pronunciationRecorder: "Máy ghi âm phát âm (PronunciationRecorder)",
  certificateView: "Trang Chứng chỉ",
  shareProgressPage: "Trang Chia sẻ tiến bộ",
};

// ─── Checklist Dimension Types ──────────────────────────────────────────────

/** Six UI smoke checklist dimensions + one cross-cutting. */
export type UiSmokeDimensionId =
  | "UI_DIAGNOSE"
  | "UI_TEACH"
  | "UI_REMEMBER"
  | "UI_ADAPT"
  | "UI_SELFCHECK"
  | "UI_PROVE"
  | "UI_CROSS";

/** Dimension metadata. */
export interface UiSmokeDimension {
  id: UiSmokeDimensionId;
  /** Vietnamese display name */
  labelVi: string;
  /** English label */
  labelEn: string;
  /** Teacher capability this maps to */
  capabilityVi: string;
  /** Description in Vietnamese */
  descriptionVi: string;
}

/** All 7 dimensions in catalog order. */
export const UI_SMOKE_DIMENSIONS: UiSmokeDimension[] = [
  {
    id: "UI_DIAGNOSE",
    labelVi: "Chẩn đoán lỗi",
    labelEn: "Diagnose",
    capabilityVi: "Chẩn đoán lỗi",
    descriptionVi: "Giao diện phát hiện và hiển thị lỗi của học viên",
  },
  {
    id: "UI_TEACH",
    labelVi: "Giảng dạy",
    labelEn: "Teach",
    capabilityVi: "Giảng dạy",
    descriptionVi: "Giao diện tương tác giảng dạy (chat, nói, ngữ pháp, trẻ em)",
  },
  {
    id: "UI_REMEMBER",
    labelVi: "Ghi nhớ",
    labelEn: "Remember",
    capabilityVi: "Ghi nhớ",
    descriptionVi: "Giao diện hiển thị bộ nhớ, lịch sử, và tiến bộ của học viên",
  },
  {
    id: "UI_ADAPT",
    labelVi: "Thích ứng",
    labelEn: "Adapt",
    capabilityVi: "Thích ứng",
    descriptionVi: "Giao diện cá nhân hóa (chế độ, độ khó, ngôn ngữ, thiết bị)",
  },
  {
    id: "UI_SELFCHECK",
    labelVi: "Tự kiểm tra",
    labelEn: "Self-check",
    capabilityVi: "Tự kiểm tra",
    descriptionVi: "Giao diện cảnh báo an toàn, kiểm tra nội dung, và bảo vệ người dùng",
  },
  {
    id: "UI_PROVE",
    labelVi: "Chứng minh tiến bộ",
    labelEn: "Prove",
    capabilityVi: "Chứng minh tiến bộ",
    descriptionVi: "Giao diện theo dõi tiến bộ, chứng chỉ, và so sánh trước/sau",
  },
  {
    id: "UI_CROSS",
    labelVi: "Xuyên suốt",
    labelEn: "Cross-cutting",
    capabilityVi: "Tổng thể",
    descriptionVi: "Kiểm tra xuyên suốt tất cả giao diện (tiếng Việt, di động, không crash)",
  },
];

// ─── Checklist Item Types ────────────────────────────────────────────────────

/** Checklist item status. */
export type UiSmokeItemStatus =
  | "pass"
  | "pass_with_notes"
  | "fail"
  | "not_applicable"
  | "not_tested";

/** Checklist item severity. */
export type UiSmokeSeverity = "critical" | "major" | "minor";

/** A single checklist item definition. */
export interface UiSmokeChecklistItem {
  /** Unique ID, e.g. "UI-DIAGNOSE-01" */
  id: string;
  /** Dimension this item belongs to */
  dimension: UiSmokeDimensionId;
  /** Item number within dimension (1-based) */
  itemNumber: number;
  /** Vietnamese description — what to check */
  descriptionVi: string;
  /** English description */
  descriptionEn: string;
  /** What UI surface(s) this item checks */
  surfaces: UiSmokeSurfaceId[];
  /** How to verify this item in Vietnamese */
  howToVerifyVi: string;
  /** Severity if this item fails */
  severity: UiSmokeSeverity;
  /** Whether this item gates a deploy */
  deployGate: boolean;
}

/** Evidence for evaluating a single checklist item. */
export interface UiSmokeItemEvidence {
  /** Does the component/page render without crash? */
  rendersWithoutCrash: boolean;
  /** Expected text/element present on the page? */
  expectedElementsPresent: boolean;
  /** Is Vietnamese text used (not just English fallback)? */
  vietnameseFirst: boolean;
  /** Does it work at 375px viewport? */
  mobileResponsive: boolean;
  /** Are all tabs/buttons accessible? */
  interactivityWorking: boolean;
  /** Are empty states handled gracefully? */
  emptyStateHandled: boolean;
  /** Are error states handled gracefully? */
  errorStateHandled: boolean;
  /** Optional specific failure note in Vietnamese */
  failureNoteVi?: string;
}

/** Result of evaluating a single checklist item. */
export interface UiSmokeItemResult {
  itemId: string;
  dimension: UiSmokeDimensionId;
  status: UiSmokeItemStatus;
  evidence: UiSmokeItemEvidence;
  /** Vietnamese explanation of the result */
  reasonVi: string;
}

// ─── Checklist Input ────────────────────────────────────────────────────────

/** Evidence collected across all surfaces for a smoke run. */
export interface UiSmokeChecklistInput {
  /** Which surfaces were successfully reached (page loaded, no crash) */
  surfacesReached: UiSmokeSurfaceId[];
  /** Which surfaces had expected content present */
  surfacesWithContent: UiSmokeSurfaceId[];
  /** Which surfaces are Vietnamese-first in their labels */
  surfacesVietnameseFirst: UiSmokeSurfaceId[];
  /** Which surfaces work at 375px viewport width */
  surfacesMobileResponsive: UiSmokeSurfaceId[];
  /** Which surfaces have all interactive elements working */
  surfacesInteractive: UiSmokeSurfaceId[];
  /** Which surfaces handle empty state gracefully */
  surfacesEmptyStateOk: UiSmokeSurfaceId[];
  /** Which surfaces handle error state gracefully */
  surfacesErrorStateOk: UiSmokeSurfaceId[];
  /** Any specific notes per surface (surfaceId → note in Vietnamese) */
  surfaceNotes?: Partial<Record<UiSmokeSurfaceId, string>>;
  /** Whether the smoke run was local (localhost) or remote */
  runMode: "local" | "remote";
  /** Optional: base URL of the app */
  baseUrl?: string;
  /** Optional: timestamp of the smoke run */
  timestamp?: string;
}

// ─── Checklist Result ────────────────────────────────────────────────────────

/** Verdict levels for the overall UI smoke checklist. */
export type UiSmokeVerdict =
  | "PASS"
  | "PASS_WITH_NOTES"
  | "NEEDS_FIX"
  | "BLOCKED";

/** Overall result of running the UI smoke checklist. */
export interface UiSmokeChecklistResult {
  /** Overall verdict */
  verdict: UiSmokeVerdict;
  /** Vietnamese one-line summary */
  verdictLabelVi: string;
  /** All item results */
  items: UiSmokeItemResult[];
  /** Counts per status */
  counts: {
    pass: number;
    passWithNotes: number;
    fail: number;
    notApplicable: number;
    notTested: number;
    total: number;
  };
  /** Dimension-level summaries */
  dimensionResults: UiSmokeDimensionResult[];
  /** Deploy gate pass/fail */
  deployBlocked: boolean;
  /** Deploy-blocking item IDs */
  deployBlockers: string[];
  /** Vietnamese summary paragraph */
  summaryVi: string;
  /** Action items for Chau (Vietnamese, with priority markers) */
  actionItems: string[];
}

/** Per-dimension result summary. */
export interface UiSmokeDimensionResult {
  dimensionId: UiSmokeDimensionId;
  labelVi: string;
  passCount: number;
  failCount: number;
  totalCount: number;
  /** Dimension-level verdict */
  dimVerdict: "CLEAN" | "NOTES" | "ISSUES" | "BROKEN";
  dimLabelVi: string;
}

// ─── The Checklist Catalog ───────────────────────────────────────────────────

/** The complete UI smoke checklist — 37 items across 7 dimensions. */
export const UI_SMOKE_CHECKLIST_CATALOG: UiSmokeChecklistItem[] = [
  // ─── UI_DIAGNOSE (5 items) ───────────────────────────────────────────────
  {
    id: "UI-DIAGNOSE-01",
    dimension: "UI_DIAGNOSE",
    itemNumber: 1,
    descriptionVi: "Trang AI Tutor (/ai-tutor) hiển thị không lỗi",
    descriptionEn: "AI Tutor page renders without crash",
    surfaces: ["aiTutorPage", "learningShell"],
    howToVerifyVi:
      "Mở /ai-tutor trên trình duyệt, xác nhận trang hiển thị đầy đủ, không có lỗi JavaScript trên console",
    severity: "critical",
    deployGate: true,
  },
  {
    id: "UI-DIAGNOSE-02",
    dimension: "UI_DIAGNOSE",
    itemNumber: 2,
    descriptionVi:
      "Tab Giáo viên hiển thị giao diện sửa lỗi ngữ pháp/viết",
    descriptionEn: "Teacher tab renders grammar/writing correction UI",
    surfaces: ["mercyTeacherTab"],
    howToVerifyVi:
      "Trong Mercy Guide, mở tab Giáo viên, nhập một câu sai, xác nhận giao diện sửa lỗi hiển thị",
    severity: "critical",
    deployGate: true,
  },
  {
    id: "UI-DIAGNOSE-03",
    dimension: "UI_DIAGNOSE",
    itemNumber: 3,
    descriptionVi:
      "Dấu hiệu lỗi (error badges) hiển thị rõ ràng trên câu sai",
    descriptionEn: "Error indicators are clearly visible on incorrect text",
    surfaces: ["mercyTeacherTab", "unifiedMercyChat"],
    howToVerifyVi:
      "Nhập câu có lỗi, xác nhận từ/cụm từ sai được đánh dấu rõ ràng (gạch chân, màu sắc, hoặc biểu tượng)",
    severity: "major",
    deployGate: false,
  },
  {
    id: "UI-DIAGNOSE-04",
    dimension: "UI_DIAGNOSE",
    itemNumber: 4,
    descriptionVi: "Giao diện luyện viết hiển thị kết quả sửa lỗi đầy đủ",
    descriptionEn: "Writing practice session shows full correction results",
    surfaces: ["mercyTeacherTab", "aiTutorPage"],
    howToVerifyVi:
      "Hoàn thành một bài luyện viết, xác nhận kết quả sửa lỗi hiển thị đầy đủ (câu gốc, câu đã sửa, giải thích)",
    severity: "major",
    deployGate: false,
  },
  {
    id: "UI-DIAGNOSE-05",
    dimension: "UI_DIAGNOSE",
    itemNumber: 5,
    descriptionVi:
      "Phát hiện lỗi do ảnh hưởng tiếng Việt (Vietlish) được đánh dấu",
    descriptionEn: "Vietlish interference errors are flagged",
    surfaces: ["mercyTeacherTab", "unifiedMercyChat"],
    howToVerifyVi:
      "Nhập câu có lỗi do ảnh hưởng tiếng Việt (vd: 'I go to school yesterday'), xác nhận giải thích đề cập đến ảnh hưởng tiếng Việt",
    severity: "minor",
    deployGate: false,
  },

  // ─── UI_TEACH (6 items) ──────────────────────────────────────────────────
  {
    id: "UI-TEACH-01",
    dimension: "UI_TEACH",
    itemNumber: 1,
    descriptionVi:
      "Mercy Guide trả lời hiển thị đúng định dạng (tiếng Việt, thân thiện)",
    descriptionEn: "Mercy replies render in correct format (Vietnamese, warm)",
    surfaces: ["mercyGuideHome", "mercyGuideRoom", "unifiedMercyChat"],
    howToVerifyVi:
      "Gửi tin nhắn cho Mercy Guide, xác nhận câu trả lời bằng tiếng Việt, có giọng điệu thân thiện, không có lỗi font",
    severity: "critical",
    deployGate: true,
  },
  {
    id: "UI-TEACH-02",
    dimension: "UI_TEACH",
    itemNumber: 2,
    descriptionVi:
      "Tab Nói hiển thị giao diện ghi âm và phản hồi phát âm",
    descriptionEn: "Speak tab shows recording UI and pronunciation feedback",
    surfaces: ["mercySpeakTab", "pronunciationRecorder"],
    howToVerifyVi:
      "Mở tab Nói, xác nhận nút ghi âm hiển thị, bấm ghi âm và nói một câu, xác nhận phản hồi phát âm hiển thị",
    severity: "critical",
    deployGate: true,
  },
  {
    id: "UI-TEACH-03",
    dimension: "UI_TEACH",
    itemNumber: 3,
    descriptionVi:
      "Giao diện Gia sư trẻ em hiển thị an toàn, không có nút mua hàng",
    descriptionEn: "Kids tutor interface is safe with no purchase CTAs",
    surfaces: ["kidsTutorPage"],
    howToVerifyVi:
      "Mở /kids/tutor, xác nhận giao diện phù hợp trẻ em, KHÔNG có nút mua hàng, KHÔNG có liên kết ra ngoài không phù hợp",
    severity: "critical",
    deployGate: true,
  },
  {
    id: "UI-TEACH-04",
    dimension: "UI_TEACH",
    itemNumber: 4,
    descriptionVi:
      "Chat hợp nhất (UnifiedMercyChat) hoạt động bình thường",
    descriptionEn: "Unified chat works correctly",
    surfaces: ["unifiedMercyChat", "mercyUnifiedPage"],
    howToVerifyVi:
      "Mở /mercy/chat, gửi tin nhắn, xác nhận chat hoạt động, tin nhắn hiển thị đúng, không bị mất ký tự tiếng Việt",
    severity: "critical",
    deployGate: true,
  },
  {
    id: "UI-TEACH-05",
    dimension: "UI_TEACH",
    itemNumber: 5,
    descriptionVi:
      "Vỏ giao diện học tập (TeacherMercyLearningShell) hiển thị đầy đủ",
    descriptionEn: "Learning shell renders completely",
    surfaces: ["learningShell", "aiTutorPage"],
    howToVerifyVi:
      "Mở /ai-tutor, xác nhận vỏ giao diện hiển thị: avatar Mercy, lời chào, tab chế độ, khe bộ nhớ, khe nhắc nhở, footer",
    severity: "major",
    deployGate: false,
  },
  {
    id: "UI-TEACH-06",
    dimension: "UI_TEACH",
    itemNumber: 6,
    descriptionVi:
      "Chỉ báo lượt hội thoại (turn indicator) hiển thị đúng",
    descriptionEn: "Conversation turn indicator displays correctly",
    surfaces: ["unifiedMercyChat", "mercyGuideHome"],
    howToVerifyVi:
      "Trong chat, xác nhận mỗi lượt hội thoại được phân tách rõ ràng, có chỉ báo ai đang nói (Mercy hay học viên)",
    severity: "minor",
    deployGate: false,
  },

  // ─── UI_REMEMBER (5 items) ───────────────────────────────────────────────
  {
    id: "UI-REMEMBER-01",
    dimension: "UI_REMEMBER",
    itemNumber: 1,
    descriptionVi: "Thẻ Ghi nhớ (TutorMemoryCard) hiển thị dữ liệu đầy đủ",
    descriptionEn: "TutorMemoryCard renders with full data",
    surfaces: ["tutorMemoryCard", "aiTutorPage"],
    howToVerifyVi:
      "Trên trang /ai-tutor, xác nhận Thẻ Ghi nhớ hiển thị: số lỗi đã sửa, chủ đề đã thuần thục, chủ đề cần ôn tập",
    severity: "major",
    deployGate: false,
  },
  {
    id: "UI-REMEMBER-02",
    dimension: "UI_REMEMBER",
    itemNumber: 2,
    descriptionVi:
      "Kế hoạch bài hôm nay (TodayLesson) hiển thị đúng",
    descriptionEn: "Today's lesson planner displays correctly",
    surfaces: ["todayLessonPlanner", "aiTutorPage"],
    howToVerifyVi:
      "Trên trang /ai-tutor, xác nhận kế hoạch bài hôm nay hiển thị với danh sách hoạt động được đề xuất",
    severity: "major",
    deployGate: false,
  },
  {
    id: "UI-REMEMBER-03",
    dimension: "UI_REMEMBER",
    itemNumber: 3,
    descriptionVi: "Lịch sử sửa lỗi có thể xem được",
    descriptionEn: "Correction history is accessible",
    surfaces: ["mercyTeacherTab", "tutorMemoryCard"],
    howToVerifyVi:
      "Sau vài lần sửa lỗi, xác nhận lịch sử sửa lỗi hiển thị các lần sửa trước đó",
    severity: "minor",
    deployGate: false,
  },
  {
    id: "UI-REMEMBER-04",
    dimension: "UI_REMEMBER",
    itemNumber: 4,
    descriptionVi: "Thẻ điểm yếu (weakness tags) hiển thị cho học viên",
    descriptionEn: "Weakness tags are visible to the learner",
    surfaces: ["tutorMemoryCard", "aiTutorPage"],
    howToVerifyVi:
      "Xác nhận các điểm yếu được gắn thẻ (vd: 'Thiếu thì quá khứ') hiển thị trong giao diện bộ nhớ",
    severity: "minor",
    deployGate: false,
  },
  {
    id: "UI-REMEMBER-05",
    dimension: "UI_REMEMBER",
    itemNumber: 5,
    descriptionVi:
      "Chỉ báo tiến bộ phiên học (session progress) hiển thị",
    descriptionEn: "Session progress indicators display",
    surfaces: ["learningShell", "aiTutorPage", "unifiedMercyChat"],
    howToVerifyVi:
      "Trong phiên học, xác nhận chỉ báo tiến bộ hiển thị (số câu đã học, số lỗi đã sửa, thời gian học)",
    severity: "minor",
    deployGate: false,
  },

  // ─── UI_ADAPT (5 items) ──────────────────────────────────────────────────
  {
    id: "UI-ADAPT-01",
    dimension: "UI_ADAPT",
    itemNumber: 1,
    descriptionVi:
      "Bộ chọn Chế độ hỗ trợ (LearningSupportMode) hoạt động",
    descriptionEn: "Support mode picker works (gentle/guided/immersion)",
    surfaces: ["learningSupportMode"],
    howToVerifyVi:
      "Xác nhận có thể chuyển đổi giữa 3 chế độ: Nhẹ nhàng, Hướng dẫn, và Đắm mình. Giao diện thay đổi tương ứng",
    severity: "major",
    deployGate: false,
  },
  {
    id: "UI-ADAPT-02",
    dimension: "UI_ADAPT",
    itemNumber: 2,
    descriptionVi: "Cấp độ CEFR hiển thị trong giao diện học tập",
    descriptionEn: "CEFR level is displayed in the learning UI",
    surfaces: ["learningShell", "aiTutorPage", "mercyUnifiedPage"],
    howToVerifyVi:
      "Xác nhận cấp độ CEFR hiện tại của học viên (vd: A2, B1) hiển thị ở đâu đó trong giao diện học tập",
    severity: "minor",
    deployGate: false,
  },
  {
    id: "UI-ADAPT-03",
    dimension: "UI_ADAPT",
    itemNumber: 3,
    descriptionVi:
      "Giao diện trẻ em và người lớn được phân biệt rõ ràng",
    descriptionEn: "Kids and adult mode UIs are clearly distinct",
    surfaces: ["kidsTutorPage", "aiTutorPage"],
    howToVerifyVi:
      "So sánh /kids/tutor và /ai-tutor, xác nhận giao diện khác biệt (trẻ em: đơn giản hơn, hình ảnh nhiều hơn, không có quảng cáo)",
    severity: "major",
    deployGate: false,
  },
  {
    id: "UI-ADAPT-04",
    dimension: "UI_ADAPT",
    itemNumber: 4,
    descriptionVi: "Giao diện tutor hoạt động trên màn hình điện thoại (375px)",
    descriptionEn: "Tutor UI works on mobile viewport (375px)",
    surfaces: [
      "aiTutorPage",
      "mercyUnifiedPage",
      "kidsTutorPage",
      "unifiedMercyChat",
    ],
    howToVerifyVi:
      "Mở Chrome DevTools, chọn iPhone SE (375x667), xác nhận tất cả giao diện tutor hiển thị đúng, không bị tràn, không bị che khuất",
    severity: "critical",
    deployGate: true,
  },
  {
    id: "UI-ADAPT-05",
    dimension: "UI_ADAPT",
    itemNumber: 5,
    descriptionVi:
      "Ngôn ngữ giao diện ưu tiên tiếng Việt, tiếng Anh là phụ",
    descriptionEn: "UI language is Vietnamese-first, English secondary",
    surfaces: [
      "aiTutorPage",
      "mercyGuideHome",
      "mercyUnifiedPage",
      "kidsTutorPage",
    ],
    howToVerifyVi:
      "Duyệt qua tất cả trang tutor, xác nhận văn bản chính bằng tiếng Việt, nhãn nút bằng tiếng Việt, thông báo lỗi bằng tiếng Việt",
    severity: "critical",
    deployGate: true,
  },

  // ─── UI_SELFCHECK (5 items) ──────────────────────────────────────────────
  {
    id: "UI-SELFCHECK-01",
    dimension: "UI_SELFCHECK",
    itemNumber: 1,
    descriptionVi: "Cảnh báo an toàn hiển thị khi nội dung không phù hợp",
    descriptionEn: "Safety warnings display for inappropriate content",
    surfaces: ["unifiedMercyChat", "mercyTeacherTab", "mercyGuideHome"],
    howToVerifyVi:
      "Nhập nội dung có thể gây tranh cãi, xác nhận hệ thống hiển thị cảnh báo an toàn hoặc từ chối trả lời một cách lịch sự",
    severity: "critical",
    deployGate: true,
  },
  {
    id: "UI-SELFCHECK-02",
    dimension: "UI_SELFCHECK",
    itemNumber: 2,
    descriptionVi:
      'Lời từ chối "không chắc chắn" (overclaim guard) hiển thị khi phù hợp',
    descriptionEn: "Uncertainty disclaimers show when appropriate",
    surfaces: ["unifiedMercyChat", "mercyTeacherTab"],
    howToVerifyVi:
      "Hỏi một câu rất khó về ngữ pháp nâng cao, xác nhận Mercy nói 'cô không chắc chắn lắm' hoặc từ chối khéo thay vì trả lời sai",
    severity: "major",
    deployGate: false,
  },
  {
    id: "UI-SELFCHECK-03",
    dimension: "UI_SELFCHECK",
    itemNumber: 3,
    descriptionVi:
      "Nút thích/không thích (thumbs up/down) hiển thị trên câu trả lời",
    descriptionEn: "Like/dislike buttons render on responses",
    surfaces: ["mercyGuideHome", "mercyGuideRoom", "unifiedMercyChat"],
    howToVerifyVi:
      "Xác nhận mỗi câu trả lời của Mercy có nút 👍👎 để học viên phản hồi",
    severity: "major",
    deployGate: false,
  },
  {
    id: "UI-SELFCHECK-04",
    dimension: "UI_SELFCHECK",
    itemNumber: 4,
    descriptionVi:
      "Không có lời khen giả (fake praise) — quy tắc R3 hiển thị trong UI",
    descriptionEn: "No fake praise — contract R3 visible in UI behavior",
    surfaces: ["mercyTeacherTab", "unifiedMercyChat"],
    howToVerifyVi:
      "Nhập câu đúng nhưng rất cơ bản (vd: 'I am a student'), xác nhận Mercy KHÔNG khen quá mức (vd: 'Tuyệt vời!'), chỉ xác nhận đúng một cách bình thường",
    severity: "major",
    deployGate: false,
  },
  {
    id: "UI-SELFCHECK-05",
    dimension: "UI_SELFCHECK",
    itemNumber: 5,
    descriptionVi:
      "Bảng debug (MercyDebugPanel) chỉ hiển thị cho admin",
    descriptionEn: "Debug panel is admin-gated",
    surfaces: ["mercyGuideHome"],
    howToVerifyVi:
      "Đăng nhập với tài khoản thường, xác nhận KHÔNG thấy bảng debug. Đăng nhập với tài khoản admin, xác nhận CÓ thể thấy bảng debug",
    severity: "minor",
    deployGate: false,
  },

  // ─── UI_PROVE (5 items) ──────────────────────────────────────────────────
  {
    id: "UI-PROVE-01",
    dimension: "UI_PROVE",
    itemNumber: 1,
    descriptionVi: "Chỉ báo tiến bộ học tập hiển thị trong giao diện",
    descriptionEn: "Learning progress indicators display in the UI",
    surfaces: ["aiTutorPage", "learningShell", "tutorMemoryCard"],
    howToVerifyVi:
      "Sau vài phiên học, xác nhận chỉ báo tiến bộ (số lỗi giảm, điểm số tăng, hoặc biểu đồ) hiển thị",
    severity: "major",
    deployGate: false,
  },
  {
    id: "UI-PROVE-02",
    dimension: "UI_PROVE",
    itemNumber: 2,
    descriptionVi: "Trang Chứng chỉ hiển thị đúng",
    descriptionEn: "Certificate page renders correctly",
    surfaces: ["certificateView"],
    howToVerifyVi:
      "Truy cập trang chứng chỉ, xác nhận chứng chỉ hiển thị đầy đủ thông tin (tên học viên, cấp độ, ngày hoàn thành)",
    severity: "major",
    deployGate: false,
  },
  {
    id: "UI-PROVE-03",
    dimension: "UI_PROVE",
    itemNumber: 3,
    descriptionVi: "Trang Chia sẻ tiến bộ hoạt động",
    descriptionEn: "Share progress page works",
    surfaces: ["shareProgressPage"],
    howToVerifyVi:
      "Truy cập trang chia sẻ tiến bộ, xác nhận có thể xem và chia sẻ tiến bộ học tập",
    severity: "minor",
    deployGate: false,
  },
  {
    id: "UI-PROVE-04",
    dimension: "UI_PROVE",
    itemNumber: 4,
    descriptionVi:
      "Huy hiệu/thành tích (achievement indicators) hiển thị",
    descriptionEn: "Achievement badges display correctly",
    surfaces: ["aiTutorPage", "tutorMemoryCard"],
    howToVerifyVi:
      "Xác nhận huy hiệu hoặc biểu tượng thành tích hiển thị khi học viên đạt mốc (vd: hoàn thành 10 bài, sửa 50 lỗi)",
    severity: "minor",
    deployGate: false,
  },
  {
    id: "UI-PROVE-05",
    dimension: "UI_PROVE",
    itemNumber: 5,
    descriptionVi:
      "So sánh trước/sau (before/after) hiển thị sự tiến bộ",
    descriptionEn: "Before/after comparison shows improvement",
    surfaces: ["tutorMemoryCard", "aiTutorPage"],
    howToVerifyVi:
      "Xác nhận có thể xem so sánh giữa trình độ ban đầu và hiện tại (số lỗi, điểm số, hoặc cấp độ)",
    severity: "minor",
    deployGate: false,
  },

  // ─── UI_CROSS (6 items) ──────────────────────────────────────────────────
  {
    id: "UI-CROSS-01",
    dimension: "UI_CROSS",
    itemNumber: 1,
    descriptionVi: "Tất cả nhãn, nút, thông báo đều ưu tiên tiếng Việt",
    descriptionEn: "All labels, buttons, notifications are Vietnamese-first",
    surfaces: [
      "aiTutorPage",
      "mercyUnifiedPage",
      "kidsTutorPage",
      "mercyGuideHome",
      "mercyGuideRoom",
      "mercyTeacherTab",
      "mercySpeakTab",
      "mercyGuideTab",
      "mercySuggestTab",
      "mercyEnglishTab",
      "tutorMemoryCard",
      "learningShell",
      "learningSupportMode",
      "unifiedMercyChat",
    ],
    howToVerifyVi:
      "Duyệt qua TẤT CẢ giao diện tutor, xác nhận mọi văn bản hướng đến người dùng đều bằng tiếng Việt (trừ các thuật ngữ tiếng Anh cần thiết)",
    severity: "critical",
    deployGate: true,
  },
  {
    id: "UI-CROSS-02",
    dimension: "UI_CROSS",
    itemNumber: 2,
    descriptionVi:
      "Không crash khi trạng thái rỗng (chưa có dữ liệu học tập)",
    descriptionEn: "No crash on empty state (no learning data yet)",
    surfaces: [
      "aiTutorPage",
      "tutorMemoryCard",
      "todayLessonPlanner",
      "mercyUnifiedPage",
    ],
    howToVerifyVi:
      "Tạo tài khoản mới, chưa có dữ liệu học tập, mở các trang tutor, xác nhận hiển thị trạng thái rỗng một cách lịch sự (vd: 'Bắt đầu học ngay!') thay vì crash hoặc màn hình trắng",
    severity: "critical",
    deployGate: true,
  },
  {
    id: "UI-CROSS-03",
    dimension: "UI_CROSS",
    itemNumber: 3,
    descriptionVi:
      "Không crash khi có lỗi mạng hoặc lỗi API",
    descriptionEn: "No crash on network/API errors",
    surfaces: [
      "aiTutorPage",
      "mercyUnifiedPage",
      "unifiedMercyChat",
      "mercyGuideHome",
    ],
    howToVerifyVi:
      "Ngắt kết nối mạng, thao tác trên giao diện tutor, xác nhận hiển thị thông báo lỗi thân thiện thay vì crash hoặc màn hình trắng",
    severity: "critical",
    deployGate: true,
  },
  {
    id: "UI-CROSS-04",
    dimension: "UI_CROSS",
    itemNumber: 4,
    descriptionVi:
      "Tất cả 5 tab của Mercy Guide đều có thể truy cập và hoạt động",
    descriptionEn: "All 5 Mercy Guide tabs are accessible and working",
    surfaces: [
      "mercyGuideHome",
      "mercyTeacherTab",
      "mercySpeakTab",
      "mercyGuideTab",
      "mercySuggestTab",
      "mercyEnglishTab",
    ],
    howToVerifyVi:
      "Mở Mercy Guide, bấm lần lượt từng tab (Nói, Hướng dẫn, Giáo viên, Gợi ý, Tiếng Anh), xác nhận mỗi tab hiển thị nội dung phù hợp, không bị crash",
    severity: "critical",
    deployGate: true,
  },
  {
    id: "UI-CROSS-05",
    dimension: "UI_CROSS",
    itemNumber: 5,
    descriptionVi:
      "Mercy Guide trong phòng học hiển thị và hoạt động đúng",
    descriptionEn: "Mercy Guide in room context renders and works",
    surfaces: ["mercyGuideRoom"],
    howToVerifyVi:
      "Mở một phòng học bất kỳ, xác nhận Mercy Guide hiển thị ở góc, có thể mở panel, nội dung liên quan đến phòng học hiện tại",
    severity: "major",
    deployGate: false,
  },
  {
    id: "UI-CROSS-06",
    dimension: "UI_CROSS",
    itemNumber: 6,
    descriptionVi:
      "Giao diện tutor không bể layout ở chế độ xoay ngang (landscape)",
    descriptionEn: "Tutor UI doesn't break in landscape orientation",
    surfaces: ["aiTutorPage", "mercyUnifiedPage", "kidsTutorPage"],
    howToVerifyVi:
      "Xoay ngang điện thoại, mở các trang tutor, xác nhận layout vẫn hoạt động bình thường, không bị tràn, không bị che khuất nội dung chính",
    severity: "minor",
    deployGate: false,
  },
];

// ─── Catalog Lookup Helpers ──────────────────────────────────────────────────

/** Get all dimension IDs. */
export function getUiSmokeDimensionIds(): UiSmokeDimensionId[] {
  return UI_SMOKE_DIMENSIONS.map((d) => d.id);
}

/** Get a dimension by ID. */
export function getUiSmokeDimension(
  id: UiSmokeDimensionId,
): UiSmokeDimension | undefined {
  return UI_SMOKE_DIMENSIONS.find((d) => d.id === id);
}

/** Get all checklist items. */
export function getUiSmokeChecklistCatalog(): UiSmokeChecklistItem[] {
  return [...UI_SMOKE_CHECKLIST_CATALOG];
}

/** Get a single checklist item by ID. */
export function getUiSmokeChecklistItem(
  id: string,
): UiSmokeChecklistItem | undefined {
  return UI_SMOKE_CHECKLIST_CATALOG.find((item) => item.id === id);
}

/** Get checklist items for a specific dimension. */
export function getUiSmokeItemsByDimension(
  dimensionId: UiSmokeDimensionId,
): UiSmokeChecklistItem[] {
  return UI_SMOKE_CHECKLIST_CATALOG.filter(
    (item) => item.dimension === dimensionId,
  );
}

/** Get checklist items that gate deploys. */
export function getUiSmokeDeployGateItems(): UiSmokeChecklistItem[] {
  return UI_SMOKE_CHECKLIST_CATALOG.filter((item) => item.deployGate);
}

// ─── Evidence Builders ──────────────────────────────────────────────────────

/** Build a "not tested yet" evidence object. */
export function createNotTestedEvidence(): UiSmokeItemEvidence {
  return {
    rendersWithoutCrash: false,
    expectedElementsPresent: false,
    vietnameseFirst: false,
    mobileResponsive: false,
    interactivityWorking: false,
    emptyStateHandled: false,
    errorStateHandled: false,
    failureNoteVi: "Chưa kiểm tra mục này",
  };
}

/** Build evidence from the input for a specific item. */
export function buildItemEvidence(
  item: UiSmokeChecklistItem,
  input: UiSmokeChecklistInput,
): UiSmokeItemEvidence {
  const surfaces = item.surfaces;

  // Determine whether ANY evidence was attempted for this item's surfaces.
  // If none of the item's surfaces appear in ANY evidence array, the item
  // was truly not tested (no evidence collected at all).
  const allEvidenceArrays = [
    input.surfacesReached,
    input.surfacesWithContent,
    input.surfacesVietnameseFirst,
    input.surfacesMobileResponsive,
    input.surfacesInteractive,
    input.surfacesEmptyStateOk,
    input.surfacesErrorStateOk,
  ];
  const anyEvidenceAttempted = surfaces.some((s) =>
    allEvidenceArrays.some((arr) => arr.includes(s)),
  );

  const allReached = surfaces.every((s) =>
    input.surfacesReached.includes(s),
  );
  const allContent = surfaces.every((s) =>
    input.surfacesWithContent.includes(s),
  );
  const allVnFirst = surfaces.every((s) =>
    input.surfacesVietnameseFirst.includes(s),
  );
  const allMobile = surfaces.every((s) =>
    input.surfacesMobileResponsive.includes(s),
  );
  const allInteractive = surfaces.every((s) =>
    input.surfacesInteractive.includes(s),
  );
  const allEmptyOk = surfaces.every((s) =>
    input.surfacesEmptyStateOk.includes(s),
  );
  const allErrorOk = surfaces.every((s) =>
    input.surfacesErrorStateOk.includes(s),
  );

  const surfaceNoteKey = surfaces.find((s) => input.surfaceNotes?.[s]);
  const failureNoteVi =
    surfaceNoteKey
      ? input.surfaceNotes![surfaceNoteKey]
      : anyEvidenceAttempted
        ? undefined
        : "Chưa kiểm tra mục này";

  return {
    rendersWithoutCrash: allReached,
    expectedElementsPresent: allContent,
    vietnameseFirst: allVnFirst,
    mobileResponsive: allMobile,
    interactivityWorking: allInteractive,
    emptyStateHandled: allEmptyOk,
    errorStateHandled: allErrorOk,
    failureNoteVi,
  };
}

// ─── Item Evaluation ─────────────────────────────────────────────────────────

/** Evaluate a single checklist item against evidence. */
export function evaluateUiSmokeItem(
  itemId: string,
  evidence: UiSmokeItemEvidence,
): UiSmokeItemResult {
  const item = getUiSmokeChecklistItem(itemId);
  if (!item) {
    return {
      itemId,
      dimension: "UI_CROSS",
      status: "not_applicable",
      evidence,
      reasonVi: `Mục "${itemId}" không tồn tại trong danh sách kiểm tra.`,
    };
  }

  const isDeployGate = item.deployGate;
  const severity = item.severity;

  // Determine status based on evidence
  let status: UiSmokeItemStatus;
  let reasonVi: string;

  // Only treat as "not_tested" if evidence was EXPLICITLY created via
  // createNotTestedEvidence() — i.e., has the sentinel failure note.
  // Evidence built from actual (even failing) input should show as "fail",
  // not "not_tested".
  const isExplicitNotTested =
    evidence.failureNoteVi === "Chưa kiểm tra mục này";
  if (isExplicitNotTested) {
    status = "not_tested";
    reasonVi = `Chưa kiểm tra: ${item.descriptionVi}`;
    return { itemId, dimension: item.dimension, status, evidence, reasonVi };
  }

  // Count failures
  const fails: string[] = [];
  if (!evidence.rendersWithoutCrash) {
    fails.push("không hiển thị / bị crash");
  }
  if (!evidence.expectedElementsPresent) {
    fails.push("thiếu nội dung mong đợi");
  }
  if (!evidence.vietnameseFirst) {
    fails.push("chưa ưu tiên tiếng Việt");
  }
  if (!evidence.mobileResponsive) {
    fails.push("không hoạt động trên điện thoại");
  }
  if (!evidence.interactivityWorking) {
    fails.push("tương tác không hoạt động");
  }
  if (!evidence.emptyStateHandled) {
    fails.push("xử lý trạng thái rỗng chưa tốt");
  }
  if (!evidence.errorStateHandled) {
    fails.push("xử lý lỗi chưa tốt");
  }

  if (fails.length === 0) {
    status = "pass";
    reasonVi = `✅ ĐẠT: ${item.descriptionVi}`;
  } else if (
    fails.length === 1 &&
    !isDeployGate &&
    (fails[0].includes("trạng thái rỗng") ||
      fails[0].includes("lỗi chưa tốt"))
  ) {
    status = "pass_with_notes";
    reasonVi =
      `⚠️ ĐẠT (có ghi chú): ${item.descriptionVi} — ${fails.join(", ")}`;
  } else if (isDeployGate || severity === "critical") {
    status = "fail";
    reasonVi =
      `❌ THẤT BẠI: ${item.descriptionVi} — Lý do: ${fails.join("; ")}`;
  } else if (severity === "major") {
    status = "fail";
    reasonVi =
      `⚠️ KHÔNG ĐẠT: ${item.descriptionVi} — Lý do: ${fails.join("; ")}`;
  } else {
    status = "pass_with_notes";
    reasonVi =
      `⚠️ ĐẠT (có ghi chú): ${item.descriptionVi} — ${fails.join(", ")}`;
  }

  if (evidence.failureNoteVi) {
    reasonVi += ` — Ghi chú: ${evidence.failureNoteVi}`;
  }

  return { itemId, dimension: item.dimension, status, evidence, reasonVi };
}

// ─── Full Checklist Runner ──────────────────────────────────────────────────

/** Create a default (empty) input for the smoke checklist. */
export function createEmptySmokeInput(
  runMode: "local" | "remote" = "local",
): UiSmokeChecklistInput {
  return {
    surfacesReached: [],
    surfacesWithContent: [],
    surfacesVietnameseFirst: [],
    surfacesMobileResponsive: [],
    surfacesInteractive: [],
    surfacesEmptyStateOk: [],
    surfacesErrorStateOk: [],
    runMode,
  };
}

/** Helper: determines dimension-level verdict from pass/fail counts. */
function dimVerdictFromCounts(
  pass: number,
  fail: number,
  total: number,
): { dimVerdict: UiSmokeDimensionResult["dimVerdict"]; dimLabelVi: string } {
  if (fail === 0 && pass === total) {
    return { dimVerdict: "CLEAN", dimLabelVi: "SẠCH — tất cả đạt" };
  }
  if (fail === 0) {
    return { dimVerdict: "NOTES", dimLabelVi: "ĐẠT (có ghi chú)" };
  }
  if (fail <= total / 3) {
    return { dimVerdict: "ISSUES", dimLabelVi: "CÓ VẤN ĐỀ — cần sửa" };
  }
  return { dimVerdict: "BROKEN", dimLabelVi: "HỎNG — cần sửa gấp" };
}

/** Run the full UI smoke checklist against collected evidence. */
export function runUiSmokeChecklist(
  input: UiSmokeChecklistInput,
): UiSmokeChecklistResult {
  const items = UI_SMOKE_CHECKLIST_CATALOG.map((item) => {
    const evidence = buildItemEvidence(item, input);
    return evaluateUiSmokeItem(item.id, evidence);
  });

  const passCount = items.filter((i) => i.status === "pass").length;
  const passWithNotesCount = items.filter(
    (i) => i.status === "pass_with_notes",
  ).length;
  const failCount = items.filter((i) => i.status === "fail").length;
  const naCount = items.filter((i) => i.status === "not_applicable").length;
  const notTestedCount = items.filter(
    (i) => i.status === "not_tested",
  ).length;

  // Dimension results
  const dimensionResults: UiSmokeDimensionResult[] =
    UI_SMOKE_DIMENSIONS.map((dim) => {
      const dimItems = items.filter((i) => i.dimension === dim.id);
      const dPass = dimItems.filter((i) => i.status === "pass").length;
      const dFail = dimItems.filter((i) => i.status === "fail").length;
      const dTotal = dimItems.length;
      const verdict = dimVerdictFromCounts(dPass, dFail, dTotal);
      return {
        dimensionId: dim.id,
        labelVi: dim.labelVi,
        passCount: dPass,
        failCount: dFail,
        totalCount: dTotal,
        dimVerdict: verdict.dimVerdict,
        dimLabelVi: verdict.dimLabelVi,
      };
    });

  // Deploy gate — any deployGate item that failed blocks the deploy
  const deployBlockers = items
    .filter(
      (i) =>
        i.status === "fail" &&
        UI_SMOKE_CHECKLIST_CATALOG.find((c) => c.id === i.itemId)
          ?.deployGate,
    )
    .map((i) => i.itemId);
  const deployBlocked = deployBlockers.length > 0;

  // Overall verdict
  let verdict: UiSmokeVerdict;
  let verdictLabelVi: string;
  if (deployBlocked) {
    verdict = "BLOCKED";
    verdictLabelVi = "CHẶN TRIỂN KHAI — có lỗi nghiêm trọng cần sửa";
  } else if (failCount > 0) {
    verdict = "NEEDS_FIX";
    verdictLabelVi = "CẦN SỬA — có lỗi không chặn triển khai nhưng cần khắc phục";
  } else if (passWithNotesCount > 0 || notTestedCount > 0) {
    verdict = "PASS_WITH_NOTES";
    verdictLabelVi =
      "ĐẠT (CÓ GHI CHÚ) — có mục cần lưu ý hoặc chưa được kiểm tra";
  } else {
    verdict = "PASS";
    verdictLabelVi = "ĐẠT — tất cả các mục kiểm tra đều thông qua";
  }

  // Vietnamese summary
  const summaryVi = buildSmokeSummaryVi(
    verdict,
    passCount,
    passWithNotesCount,
    failCount,
    notTestedCount,
    deployBlockers,
    dimensionResults,
  );

  // Action items
  const actionItems = buildSmokeActionItems(
    items,
    deployBlockers,
    dimensionResults,
  );

  return {
    verdict,
    verdictLabelVi,
    items,
    counts: {
      pass: passCount,
      passWithNotes: passWithNotesCount,
      fail: failCount,
      notApplicable: naCount,
      notTested: notTestedCount,
      total: items.length,
    },
    dimensionResults,
    deployBlocked,
    deployBlockers,
    summaryVi,
    actionItems,
  };
}

// ─── Summary and Action Item Builders ────────────────────────────────────────

function buildSmokeSummaryVi(
  verdict: UiSmokeVerdict,
  pass: number,
  passWithNotes: number,
  fail: number,
  notTested: number,
  deployBlockers: string[],
  dimensionResults: UiSmokeDimensionResult[],
): string {
  const lines: string[] = [];
  lines.push(`KẾT QUẢ KIỂM TRA GIAO DIỆN: ${verdictLabelViMap[verdict]}`);
  lines.push("");
  lines.push(`Tổng số mục: ${UI_SMOKE_CHECKLIST_CATALOG.length}`);
  lines.push(`✅ Đạt: ${pass}`);
  if (passWithNotes > 0) lines.push(`⚠️ Đạt (có ghi chú): ${passWithNotes}`);
  if (fail > 0) lines.push(`❌ Thất bại: ${fail}`);
  if (notTested > 0) lines.push(`⬜ Chưa kiểm tra: ${notTested}`);
  lines.push("");

  // Dimension breakdown
  lines.push("Theo khía cạnh:");
  for (const dr of dimensionResults) {
    const icon =
      dr.dimVerdict === "CLEAN"
        ? "✅"
        : dr.dimVerdict === "NOTES"
          ? "⚠️"
          : dr.dimVerdict === "ISSUES"
            ? "🔶"
            : "❌";
    lines.push(
      `  ${icon} ${dr.labelVi}: ${dr.passCount}/${dr.totalCount} đạt (${dr.dimLabelVi})`,
    );
  }

  // Deploy blockers
  if (deployBlockers.length > 0) {
    lines.push("");
    lines.push(
      `CHẶN TRIỂN KHAI — ${deployBlockers.length} mục chưa đạt yêu cầu:`,
    );
    for (const blocker of deployBlockers) {
      const item = getUiSmokeChecklistItem(blocker);
      lines.push(`  ❌ ${blocker}: ${item?.descriptionVi ?? "?"}`);
    }
  }

  return lines.join("\n");
}

const verdictLabelViMap: Record<UiSmokeVerdict, string> = {
  PASS: "ĐẠT — tất cả các mục kiểm tra đều thông qua",
  PASS_WITH_NOTES: "ĐẠT (CÓ GHI CHÚ) — có mục cần lưu ý hoặc chưa được kiểm tra",
  NEEDS_FIX: "CẦN SỬA — có lỗi không chặn triển khai nhưng cần khắc phục",
  BLOCKED: "CHẶN TRIỂN KHAI — có lỗi nghiêm trọng cần sửa",
};

function buildSmokeActionItems(
  items: UiSmokeItemResult[],
  deployBlockers: string[],
  dimensionResults: UiSmokeDimensionResult[],
): string[] {
  const actions: string[] = [];

  // Urgent: deploy blockers
  if (deployBlockers.length > 0) {
    actions.push(
      `[KHẨN] Sửa ${deployBlockers.length} lỗi chặn triển khai: ${deployBlockers.join(", ")}`,
    );
  }

  // Failed items (non-blocking)
  const nonBlockingFails = items.filter(
    (i) => i.status === "fail" && !deployBlockers.includes(i.itemId),
  );
  if (nonBlockingFails.length > 0) {
    actions.push(
      `[CẦN SỬA] ${nonBlockingFails.length} lỗi không chặn triển khai: ${nonBlockingFails.map((i) => i.itemId).join(", ")}`,
    );
  }

  // Broken dimensions
  const brokenDims = dimensionResults.filter(
    (d) => d.dimVerdict === "BROKEN",
  );
  if (brokenDims.length > 0) {
    actions.push(
      `[KHẨN] ${brokenDims.length} khía cạnh bị hỏng: ${brokenDims.map((d) => d.labelVi).join(", ")}`,
    );
  }

  // Dimensions with issues
  const issueDims = dimensionResults.filter(
    (d) => d.dimVerdict === "ISSUES",
  );
  if (issueDims.length > 0) {
    actions.push(
      `[CẦN XEM] ${issueDims.length} khía cạnh có vấn đề: ${issueDims.map((d) => d.labelVi).join(", ")}`,
    );
  }

  // Not tested items
  const notTestedItems = items.filter((i) => i.status === "not_tested");
  if (notTestedItems.length > 0) {
    actions.push(
      `[CẦN KIỂM TRA] ${notTestedItems.length} mục chưa được kiểm tra. Chạy lại smoke test đầy đủ.`,
    );
  }

  // Empty — all clean
  if (actions.length === 0) {
    actions.push(
      "[SẴN SÀNG] Tất cả mục kiểm tra đều đạt. Có thể triển khai.",
    );
  }

  return actions;
}

// ─── Quick-Check Helpers ─────────────────────────────────────────────────────

/** Quick check: is the smoke result deployable? */
export function isDeployable(result: UiSmokeChecklistResult): boolean {
  return !result.deployBlocked;
}

/** Quick check: is the smoke result fully clean (all pass, no notes)? */
export function isCleanSmoke(result: UiSmokeChecklistResult): boolean {
  return (
    result.verdict === "PASS" &&
    result.counts.fail === 0 &&
    result.counts.passWithNotes === 0 &&
    result.counts.notTested === 0
  );
}

/** Get a compact Vietnamese one-liner for dashboards. */
export function getSmokeCompactVi(result: UiSmokeChecklistResult): string {
  const icon =
    result.verdict === "PASS"
      ? "✅"
      : result.verdict === "PASS_WITH_NOTES"
        ? "⚠️"
        : result.verdict === "NEEDS_FIX"
          ? "🔶"
          : "❌";
  return `${icon} Smoke UI: ${result.counts.pass}/${result.counts.total} đạt — ${result.verdictLabelVi}`;
}

/** Get the deploy-blocking items as a string list. */
export function getDeployBlockerIds(
  result: UiSmokeChecklistResult,
): string[] {
  return result.deployBlockers;
}

/** Count items by dimension. */
export function countItemsByDimension(
  dimensionId: UiSmokeDimensionId,
): number {
  return UI_SMOKE_CHECKLIST_CATALOG.filter(
    (i) => i.dimension === dimensionId,
  ).length;
}

/** Count deploy-gate items. */
export function countDeployGateItems(): number {
  return UI_SMOKE_CHECKLIST_CATALOG.filter((i) => i.deployGate).length;
}

// ─── Validation ──────────────────────────────────────────────────────────────

/** Validation result for the catalog itself. */
export interface UiSmokeCatalogValidation {
  valid: boolean;
  totalItems: number;
  dimensionCount: number;
  duplicateIds: string[];
  missingDimensions: string[];
  deployGateCount: number;
  errors: string[];
}

/** Self-validate the checklist catalog for structural integrity. */
export function validateUiSmokeCatalog(): UiSmokeCatalogValidation {
  const errors: string[] = [];

  // Check for duplicate IDs
  const idSet = new Set<string>();
  const duplicateIds: string[] = [];
  for (const item of UI_SMOKE_CHECKLIST_CATALOG) {
    if (idSet.has(item.id)) {
      duplicateIds.push(item.id);
    }
    idSet.add(item.id);
  }
  if (duplicateIds.length > 0) {
    errors.push(`Trùng ID: ${duplicateIds.join(", ")}`);
  }

  // Check all dimensions referenced exist
  const validDimensions = new Set(UI_SMOKE_DIMENSIONS.map((d) => d.id));
  const missingDimensions: string[] = [];
  for (const item of UI_SMOKE_CHECKLIST_CATALOG) {
    if (!validDimensions.has(item.dimension)) {
      missingDimensions.push(
        `"${item.dimension}" (từ ${item.id})`,
      );
    }
  }
  if (missingDimensions.length > 0) {
    errors.push(
      `Chiều không tồn tại: ${missingDimensions.join(", ")}`,
    );
  }

  // Check item numbering within dimensions
  for (const dim of UI_SMOKE_DIMENSIONS) {
    const dimItems = UI_SMOKE_CHECKLIST_CATALOG.filter(
      (i) => i.dimension === dim.id,
    );
    const numbers = dimItems.map((i) => i.itemNumber).sort((a, b) => a - b);
    for (let idx = 0; idx < numbers.length; idx++) {
      if (numbers[idx] !== idx + 1) {
        errors.push(
          `${dim.id}: số thứ tự không liên tục ở vị trí ${idx + 1} (có ${numbers[idx]})`,
        );
        break;
      }
    }
  }

  // Check all surfaces referenced in items exist
  const validSurfaces = new Set(UI_SMOKE_SURFACE_IDS);
  for (const item of UI_SMOKE_CHECKLIST_CATALOG) {
    for (const surface of item.surfaces) {
      if (!validSurfaces.has(surface)) {
        errors.push(`${item.id}: surface "${surface}" không tồn tại`);
      }
    }
  }

  // Check deploy gate count
  const deployGateCount = UI_SMOKE_CHECKLIST_CATALOG.filter(
    (i) => i.deployGate,
  ).length;
  if (deployGateCount === 0) {
    errors.push("Không có mục deploy-gate nào — đáng ngờ");
  }

  return {
    valid: errors.length === 0,
    totalItems: UI_SMOKE_CHECKLIST_CATALOG.length,
    dimensionCount: UI_SMOKE_DIMENSIONS.length,
    duplicateIds,
    missingDimensions,
    deployGateCount,
    errors,
  };
}

// ─── Comparison ──────────────────────────────────────────────────────────────

/** Compare two smoke checklist results (e.g., before fix vs after fix). */
export interface UiSmokeComparison {
  /** Delta in pass count */
  passDelta: number;
  /** Delta in fail count */
  failDelta: number;
  /** Overall trend */
  trend: "improving" | "declining" | "stable";
  /** Vietnamese summary */
  comparisonVi: string;
  /** Items that changed status */
  changedItems: {
    itemId: string;
    from: UiSmokeItemStatus;
    to: UiSmokeItemStatus;
    descriptionVi: string;
  }[];
}

export function compareSmokeResults(
  before: UiSmokeChecklistResult,
  after: UiSmokeChecklistResult,
): UiSmokeComparison {
  const passDelta = after.counts.pass - before.counts.pass;
  const failDelta = after.counts.fail - before.counts.fail;

  let trend: "improving" | "declining" | "stable" = "stable";
  if (passDelta > 0 || failDelta < 0) trend = "improving";
  else if (passDelta < 0 || failDelta > 0) trend = "declining";

  const beforeStatuses = new Map(
    before.items.map((i) => [i.itemId, i.status]),
  );
  const changedItems: UiSmokeComparison["changedItems"] = [];
  for (const afterItem of after.items) {
    const beforeStatus = beforeStatuses.get(afterItem.itemId);
    if (beforeStatus && beforeStatus !== afterItem.status) {
      const catalogItem = getUiSmokeChecklistItem(afterItem.itemId);
      changedItems.push({
        itemId: afterItem.itemId,
        from: beforeStatus,
        to: afterItem.status,
        descriptionVi: catalogItem?.descriptionVi ?? afterItem.itemId,
      });
    }
  }

  const comparisonVi = buildComparisonVi(
    trend,
    passDelta,
    failDelta,
    changedItems,
  );

  return { passDelta, failDelta, trend, comparisonVi, changedItems };
}

function buildComparisonVi(
  trend: string,
  passDelta: number,
  failDelta: number,
  changedItems: UiSmokeComparison["changedItems"],
): string {
  const trendLabel =
    trend === "improving"
      ? "đang cải thiện"
      : trend === "declining"
        ? "đang giảm sút"
        : "không thay đổi";
  let text = `So sánh smoke test: ${trendLabel}. `;
  if (passDelta !== 0) {
    text +=
      passDelta > 0
        ? `Tăng ${passDelta} mục đạt. `
        : `Giảm ${Math.abs(passDelta)} mục đạt. `;
  }
  if (failDelta !== 0) {
    text +=
      failDelta < 0
        ? `Giảm ${Math.abs(failDelta)} lỗi. `
        : `Tăng ${failDelta} lỗi. `;
  }
  if (changedItems.length > 0) {
    text += `${changedItems.length} mục thay đổi trạng thái.`;
  }
  return text.trim();
}

// ─── Surface Coverage Report ─────────────────────────────────────────────────

/** Report which surfaces are covered by the checklist. */
export interface UiSmokeSurfaceCoverage {
  /** Surfaces with at least one checklist item */
  covered: UiSmokeSurfaceId[];
  /** Surfaces with zero checklist items (gaps) */
  uncovered: UiSmokeSurfaceId[];
  /** Surfaces that gate deploys */
  deployGate: UiSmokeSurfaceId[];
}

export function getSurfaceCoverage(): UiSmokeSurfaceCoverage {
  const covered = new Set<UiSmokeSurfaceId>();
  const deployGate = new Set<UiSmokeSurfaceId>();

  for (const item of UI_SMOKE_CHECKLIST_CATALOG) {
    for (const surface of item.surfaces) {
      covered.add(surface);
      if (item.deployGate) {
        deployGate.add(surface);
      }
    }
  }

  const uncovered = UI_SMOKE_SURFACE_IDS.filter(
    (s) => !covered.has(s),
  );

  return {
    covered: [...covered],
    uncovered,
    deployGate: [...deployGate],
  };
}

// ─── Label Getters ───────────────────────────────────────────────────────────

/** Get Vietnamese label for a verdict. */
export function getVerdictLabelVi(verdict: UiSmokeVerdict): string {
  return verdictLabelViMap[verdict];
}

/** Get Vietnamese label for a surface ID. */
export function getSurfaceLabelVi(surfaceId: UiSmokeSurfaceId): string {
  return (
    UI_SMOKE_SURFACE_LABELS_VI[surfaceId] ?? surfaceId
  );
}

/** Get Vietnamese label for a dimension. */
export function getDimensionLabelVi(
  dimId: UiSmokeDimensionId,
): string {
  const dim = getUiSmokeDimension(dimId);
  return dim?.labelVi ?? dimId;
}

/** Get Vietnamese label for an item status. */
export function getItemStatusLabelVi(status: UiSmokeItemStatus): string {
  const map: Record<UiSmokeItemStatus, string> = {
    pass: "Đạt",
    pass_with_notes: "Đạt (có ghi chú)",
    fail: "Thất bại",
    not_applicable: "Không áp dụng",
    not_tested: "Chưa kiểm tra",
  };
  return map[status];
}

// ─── Test-Friendly Factories ─────────────────────────────────────────────────

/** Create a minimal smoke input for tests (most surfaces passing). */
export function createMinimalSmokeInput(
  overrides?: Partial<UiSmokeChecklistInput>,
): UiSmokeChecklistInput {
  const allSurfaces = [...UI_SMOKE_SURFACE_IDS];
  return {
    surfacesReached: allSurfaces,
    surfacesWithContent: allSurfaces,
    surfacesVietnameseFirst: allSurfaces,
    surfacesMobileResponsive: allSurfaces,
    surfacesInteractive: allSurfaces,
    surfacesEmptyStateOk: allSurfaces,
    surfacesErrorStateOk: allSurfaces,
    runMode: "local",
    baseUrl: "http://localhost:3107",
    timestamp: "2026-06-23T00:00:00Z",
    ...overrides,
  };
}

/** Create a failing smoke input (most evidence fails) for negative testing. */
export function createFailingSmokeInput(): UiSmokeChecklistInput {
  // Only 3 surfaces managed to load at all — the rest are unreachable
  const reached: UiSmokeSurfaceId[] = [
    "mercyGuideHome",
    "mercyGuideTab",
    "learningSupportMode",
  ];
  // Only basic content visible on those surfaces
  const withContent: UiSmokeSurfaceId[] = ["mercyGuideHome"];
  return {
    surfacesReached: reached,
    surfacesWithContent: withContent,
    surfacesVietnameseFirst: [],
    surfacesMobileResponsive: [],
    surfacesInteractive: [],
    surfacesEmptyStateOk: [],
    surfacesErrorStateOk: [],
    runMode: "local",
    surfaceNotes: {
      aiTutorPage: "Trang trắng — JavaScript error trên console",
      mercyUnifiedPage: "Lỗi 500 từ server",
      kidsTutorPage: "Không tải được component",
    },
  };
}
