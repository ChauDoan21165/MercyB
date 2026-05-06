// src/components/writing/writingFeedbackCopy.ts
//
// Bilingual copy for the writing feedback surfaces. Vietnamese is the
// primary surface for Vietnamese learners; English is fallback.

export type BilingualText = { vi: string; en: string };

export const WRITING_COPY = {
  pageTitle: {
    vi: "Phản hồi bài viết",
    en: "Writing feedback",
  },
  pageIntro: {
    vi:
      "Dán bài luận tiếng Anh của bạn (tối đa 2000 từ). Mercy sẽ chấm theo 5 tiêu chí và chỉ ra lỗi thường gặp ở người Việt.",
    en:
      "Paste your English essay (up to 2000 words). Mercy scores 5 dimensions and surfaces common Vietnamese-learner errors.",
  },
  inputPlaceholder: {
    vi: "Bắt đầu viết, hoặc dán bài đã có…",
    en: "Start writing, or paste an existing essay…",
  },
  wordCount: (n: number, max: number): BilingualText => ({
    vi: `${n} / ${max} từ`,
    en: `${n} / ${max} words`,
  }),
  charCount: (n: number): BilingualText => ({
    vi: `${n} ký tự`,
    en: `${n} characters`,
  }),
  getFeedbackCta: {
    vi: "Nhận phản hồi",
    en: "Get feedback",
  },
  saveAttemptCta: {
    vi: "Lưu lại bài",
    en: "Save attempt",
  },
  saveDeferredHint: {
    vi: "(Tính năng lưu sẽ có trong bản cập nhật sắp tới.)",
    en: "(Saving will land in a daytime update.)",
  },
  emptyTextWarning: {
    vi: "Hãy nhập bài viết trước khi nhấn Nhận phản hồi.",
    en: "Enter some text before requesting feedback.",
  },
  tooLongWarning: {
    vi: "Bài quá dài. Vui lòng giới hạn dưới 2000 từ.",
    en: "Essay is too long. Please keep it under 2000 words.",
  },
  overallLabel: {
    vi: "Điểm tổng",
    en: "Overall",
  },
  dimensionLabels: {
    grammar: { vi: "Ngữ pháp", en: "Grammar" },
    vocabulary: { vi: "Từ vựng", en: "Vocabulary" },
    structure: { vi: "Bố cục", en: "Structure" },
    spelling_punctuation: { vi: "Chính tả & dấu câu", en: "Spelling & punctuation" },
    coherence: { vi: "Mạch lạc", en: "Coherence" },
  },
  noIssuesGood: {
    vi: "Không phát hiện lỗi ngữ pháp thường gặp ở người Việt — rất tốt!",
    en: "No Vietnamese-typical grammar issues detected — well done!",
  },
  issuesHeading: {
    vi: "Lỗi thường gặp đã phát hiện",
    en: "Issues detected",
  },
  microLessonCta: {
    vi: "Xem bài học ngắn",
    en: "Open micro-lesson",
  },
  spellingHeading: {
    vi: "Có thể là lỗi chính tả",
    en: "Possible spelling errors",
  },
  cefrEstimate: (level: string): BilingualText => ({
    vi: `Trình độ ước tính: ${level}`,
    en: `Estimated level: ${level}`,
  }),
  paragraphCount: (n: number): BilingualText => ({
    vi: `${n} đoạn văn`,
    en: `${n} paragraphs`,
  }),
  introYes: { vi: "Có mở bài", en: "Has intro" },
  introNo: { vi: "Chưa có mở bài rõ", en: "No clear intro" },
  conclusionYes: { vi: "Có kết bài", en: "Has conclusion" },
  conclusionNo: { vi: "Chưa có kết bài rõ", en: "No clear conclusion" },
  /**
   * Marketing copy for the VN-rubric path. Verifiable claim — does not
   * say "only app" / "duy nhất". The pattern dictionary in
   * vn-writing-patterns.ts is the evidence behind the claim.
   */
  vnFeedbackBanner: {
    vi: "Phản hồi bài viết theo lỗi thường gặp ở người Việt — không phải mẫu chung.",
    en: "Feedback tuned to Vietnamese-learner error patterns — not a generic template.",
  },
} as const;
