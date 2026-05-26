// src/components/exam-prep/toefl/TOEFLCopy.ts
//
// Bilingual copy for TOEFL surfaces. Vietnamese is primary;
// English is fallback. Keep all user-facing strings here so daytime
// copy edits don't fork across components.
//
// TODO(TOEFL): Expand copy as pages are built out (listening transcripts,
//   writing prompts, speaking cue cards, estimator labels).

export type BilingualText = { vi: string; en: string };

export const TOEFL_COPY = {
  pageTitle: { vi: "Luyện thi TOEFL iBT", en: "TOEFL iBT Practice" },
  premiumOnlyTitle: {
    vi: "Tính năng dành cho thành viên Premium",
    en: "Premium-only feature",
  },
  premiumOnlyBody: {
    vi:
      "Luyện thi TOEFL iBT đầy đủ chỉ có trong gói Premium. Nâng cấp để mở Reading, Listening, Speaking, Writing + ước lượng điểm.",
    en:
      "Full TOEFL iBT prep is part of the Premium plan. Upgrade to unlock Reading, Listening, Speaking, Writing + score estimator.",
  },
  upgradeCta: { vi: "Nâng cấp Premium", en: "Upgrade to Premium" },
  backToOverview: { vi: "Quay lại tổng quan", en: "Back to overview" },
  overviewLead: {
    vi:
      "Bốn kỹ năng — luyện từng phần một. Đề bài là mẫu nguyên gốc của MercyBlade, mô phỏng cấu trúc TOEFL iBT rút gọn (phiên bản từ tháng 7/2023).",
    en:
      "Four skills — practise one at a time. Prompts are MercyBlade originals; structure mirrors the shortened TOEFL iBT (post-July 2023 format).",
  },
  startCta: { vi: "Bắt đầu luyện", en: "Start practising" },
  estimatorCta: { vi: "Ước lượng điểm TOEFL", en: "Estimate your score" },

  // Section labels
  readingTitle: { vi: "Bài Đọc", en: "Reading" },
  listeningTitle: { vi: "Bài Nghe", en: "Listening" },
  speakingTitle: { vi: "Bài Nói", en: "Speaking" },
  writingTitle: { vi: "Bài Viết", en: "Writing" },

  // TODO(TOEFL): Add per-skill copy as pages are built
  //   - Listening transcript labels
  //   - Reading passage UI
  //   - Speaking task instructions + timer labels
  //   - Writing prompt labels + Integrated Writing source material UI
  //   - Estimator input labels + caveat text

  // Estimator
  estimatorTitle: { vi: "Ước lượng điểm TOEFL iBT", en: "TOEFL iBT score estimator" },
  estimatorIntro: {
    vi:
      "Nhập điểm bốn kỹ năng để xem tổng điểm (0–120). Reading/Listening dùng số câu đúng; Speaking/Writing dùng điểm ước lượng (0–30).",
    en:
      "Enter your four section scores to see your total (0–120). Reading/Listening use raw correct counts; Speaking/Writing use estimated scores (0–30).",
  },
  estimatorCaveat: {
    vi:
      "Đây là ước lượng dựa trên bảng quy đổi công khai của ETS. Điểm thi thật có thể khác tùy theo dạng đề.",
    en:
      "This is an estimate based on publicly available ETS conversion tables. Real scores vary by test form.",
  },
  estimatorReadingRaw: {
    vi: "Reading — số đáp án đúng (0–20)",
    en: "Reading — correct answers (0–20)",
  },
  estimatorListeningRaw: {
    vi: "Listening — số đáp án đúng (0–28)",
    en: "Listening — correct answers (0–28)",
  },
  estimatorSpeakingScaled: {
    vi: "Speaking — điểm ước lượng (0–30)",
    en: "Speaking — estimated score (0–30)",
  },
  estimatorWritingScaled: {
    vi: "Writing — điểm ước lượng (0–30)",
    en: "Writing — estimated score (0–30)",
  },
  estimatorTotalLabel: { vi: "Tổng điểm", en: "Total score" },
  estimatorBandLabel: { vi: "Trình độ CEFR", en: "CEFR level" },
} as const;
