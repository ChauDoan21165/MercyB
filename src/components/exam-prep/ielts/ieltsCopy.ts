// src/components/exam-prep/ielts/ieltsCopy.ts
//
// Bilingual copy for the IELTS surfaces. Vietnamese is primary;
// English is fallback. Keep all user-facing strings here so daytime
// copy edits don't fork across components.

export type BilingualText = { vi: string; en: string };

export const IELTS_COPY = {
  pageTitle: { vi: "Luyện thi IELTS", en: "IELTS Practice" },
  premiumOnlyTitle: {
    vi: "Tính năng dành cho thành viên Premium",
    en: "Premium-only feature",
  },
  premiumOnlyBody: {
    vi:
      "Luyện thi IELTS đầy đủ chỉ có trong gói Premium. Nâng cấp để mở Speaking, Writing, Listening, Reading + ước lượng band điểm.",
    en:
      "Full IELTS prep is part of the Premium plan. Upgrade to unlock Speaking, Writing, Listening, Reading + band estimator.",
  },
  upgradeCta: { vi: "Nâng cấp Premium", en: "Upgrade to Premium" },
  backToOverview: { vi: "Quay lại tổng quan", en: "Back to overview" },
  overviewLead: {
    vi:
      "Bốn kỹ năng — luyện từng phần một. Đề bài là mẫu nguyên gốc của MercyBlade, giúp bạn quen với cấu trúc IELTS Academic.",
    en:
      "Four skills — practise one at a time. Prompts are MercyBlade originals; structure mirrors IELTS Academic.",
  },
  startCta: { vi: "Bắt đầu luyện", en: "Start practising" },
  estimatorCta: { vi: "Ước lượng band điểm", en: "Estimate your band" },
  // Writing
  writingTitle: { vi: "Bài Viết", en: "Writing" },
  writingTask1Heading: {
    vi: "Task 1 — Mô tả biểu đồ (≥ 150 từ, 20 phút)",
    en: "Task 1 — Describe a chart (≥ 150 words, 20 min)",
  },
  writingTask2Heading: {
    vi: "Task 2 — Bài luận (≥ 250 từ, 40 phút)",
    en: "Task 2 — Essay (≥ 250 words, 40 min)",
  },
  writingPrompt: { vi: "Đề bài", en: "Prompt" },
  writingInputPlaceholder: {
    vi: "Bắt đầu viết bài của bạn ở đây…",
    en: "Start writing your response here…",
  },
  writingSubmitCta: { vi: "Chấm điểm", en: "Score this response" },
  writingTimerLabel: {
    vi: "Thời gian còn lại",
    en: "Time remaining",
  },
  writingWordCount: (n: number, min: number): BilingualText => ({
    vi: `${n} / ${min}+ từ`,
    en: `${n} / ${min}+ words`,
  }),
  writingBandHeading: {
    vi: "Ước lượng band điểm",
    en: "Estimated band",
  },
  writingTooShort: {
    vi: "Bài chưa đủ số từ tối thiểu — band ước lượng có thể không chính xác.",
    en: "Your response is below the minimum word count — the estimated band may be inaccurate.",
  },
  // Speaking
  speakingTitle: { vi: "Bài Nói", en: "Speaking" },
  speakingPart1: { vi: "Part 1 — Giới thiệu", en: "Part 1 — Introduction" },
  speakingPart2: { vi: "Part 2 — Bài nói dài", en: "Part 2 — Long turn" },
  speakingPart3: { vi: "Part 3 — Thảo luận", en: "Part 3 — Discussion" },
  speakingMicShellHint: {
    vi:
      "Phần ghi âm và đánh giá tự động sẽ ra mắt trong cập nhật ban ngày. Hiện tại bạn có thể luyện tập bằng cách đọc to và bấm giờ.",
    en:
      "Microphone capture + automatic scoring will land in a daytime update. For now, practise by reading aloud and timing yourself.",
  },
  speakingStartTimerCta: {
    vi: "Bắt đầu hẹn giờ",
    en: "Start timer",
  },
  speakingStopTimerCta: {
    vi: "Dừng hẹn giờ",
    en: "Stop timer",
  },
  speakingPart2PrepLabel: {
    vi: "Thời gian chuẩn bị (1 phút)",
    en: "Preparation (1 minute)",
  },
  speakingPart2SpeakLabel: {
    vi: "Thời gian nói (1–2 phút)",
    en: "Speaking (1–2 minutes)",
  },
  // Listening
  listeningTitle: { vi: "Bài Nghe", en: "Listening" },

  // Reading
  readingTitle: { vi: "Bài Đọc", en: "Reading" },
  // Estimator
  estimatorTitle: { vi: "Ước lượng band IELTS", en: "IELTS band estimator" },
  estimatorIntro: {
    vi:
      "Nhập điểm bốn kỹ năng để xem band tổng. Quy đổi từ đáp án đúng (Listening/Reading) hoặc band ước lượng (Writing/Speaking).",
    en:
      "Enter your four section scores to see your overall band. Listening/Reading use raw correct counts; Writing/Speaking use estimated bands.",
  },
  estimatorListeningRaw: {
    vi: "Listening — số đáp án đúng (0–40)",
    en: "Listening — correct answers (0–40)",
  },
  estimatorReadingRaw: {
    vi: "Reading — số đáp án đúng (0–40)",
    en: "Reading — correct answers (0–40)",
  },
  estimatorWritingBand: {
    vi: "Writing — band ước lượng (0–9)",
    en: "Writing — estimated band (0–9)",
  },
  estimatorSpeakingBand: {
    vi: "Speaking — band ước lượng (0–9)",
    en: "Speaking — estimated band (0–9)",
  },
  estimatorOverallLabel: { vi: "Band tổng", en: "Overall band" },
  estimatorDescriptorLabel: {
    vi: "Mô tả band",
    en: "Band descriptor",
  },
} as const;
