// src/lib/certificates/catalog.ts
//
// Display catalog — bilingual labels + short blurbs for each
// CertificateType. Vietnamese-first per project rule. Used by the
// gallery cards, the toast, and the "what you can earn" explainer.

import type { CertificateType } from "./types";

export interface CertificateMeta {
  type: CertificateType;
  label_vi: string;
  label_en: string;
  blurb_vi: string;
  blurb_en: string;
  /** Single emoji used as a calm visual marker on the card. */
  icon: string;
  /** Display group on the gallery / explainer. */
  group: "xp" | "streak" | "rooms" | "vocab" | "pronunciation" | "writing";
}

export const CERTIFICATE_CATALOG: ReadonlyArray<CertificateMeta> = [
  // XP
  { type: "xp_100",  group: "xp", icon: "✨",
    label_vi: "100 XP đầu tiên",  label_en: "First 100 XP",
    blurb_vi: "Bắt đầu hành trình.",
    blurb_en: "You started the journey." },
  { type: "xp_500",  group: "xp", icon: "✨",
    label_vi: "500 XP",           label_en: "500 XP",
    blurb_vi: "Đã thành thói quen.",
    blurb_en: "It's becoming a habit." },
  { type: "xp_1000", group: "xp", icon: "✨",
    label_vi: "1.000 XP",         label_en: "1,000 XP",
    blurb_vi: "Đang đi đường dài.",
    blurb_en: "You're going the distance." },
  { type: "xp_5000", group: "xp", icon: "✨",
    label_vi: "5.000 XP",         label_en: "5,000 XP",
    blurb_vi: "Cột mốc lớn.",
    blurb_en: "A real milestone." },

  // Streak
  { type: "streak_7",   group: "streak", icon: "🔥",
    label_vi: "Chuỗi 7 ngày",    label_en: "7-day streak",
    blurb_vi: "Một tuần không bỏ.",
    blurb_en: "One week, no skips." },
  { type: "streak_30",  group: "streak", icon: "🔥",
    label_vi: "Chuỗi 30 ngày",   label_en: "30-day streak",
    blurb_vi: "Một tháng đều đặn.",
    blurb_en: "One month, steady." },
  { type: "streak_100", group: "streak", icon: "🔥",
    label_vi: "Chuỗi 100 ngày",  label_en: "100-day streak",
    blurb_vi: "Bền bỉ rất hiếm.",
    blurb_en: "Rare consistency." },

  // Rooms
  { type: "rooms_10",  group: "rooms", icon: "🏠",
    label_vi: "10 phòng học",    label_en: "10 rooms",
    blurb_vi: "10 bài học hoàn thành.",
    blurb_en: "Ten lessons completed." },
  { type: "rooms_50",  group: "rooms", icon: "🏠",
    label_vi: "50 phòng học",    label_en: "50 rooms",
    blurb_vi: "Đi sâu vào nội dung.",
    blurb_en: "Going deep into the content." },
  { type: "rooms_100", group: "rooms", icon: "🏠",
    label_vi: "100 phòng học",   label_en: "100 rooms",
    blurb_vi: "Cột mốc nội dung lớn.",
    blurb_en: "A major content milestone." },

  // Vocab
  { type: "vocab_50",  group: "vocab", icon: "📚",
    label_vi: "50 từ vững",      label_en: "50 words mastered",
    blurb_vi: "Nền tảng từ vựng.",
    blurb_en: "Vocabulary foundation." },
  { type: "vocab_200", group: "vocab", icon: "📚",
    label_vi: "200 từ vững",     label_en: "200 words mastered",
    blurb_vi: "Vốn từ chắc chắn.",
    blurb_en: "Solid vocabulary base." },
  { type: "vocab_500", group: "vocab", icon: "📚",
    label_vi: "500 từ vững",     label_en: "500 words mastered",
    blurb_vi: "Đã đủ giao tiếp tự tin.",
    blurb_en: "Enough to speak confidently." },

  // Pronunciation
  { type: "pronunciation_25",  group: "pronunciation", icon: "🎤",
    label_vi: "25 lần luyện nói", label_en: "25 pronunciation drills",
    blurb_vi: "Đã bắt đầu nói thành tiếng.",
    blurb_en: "You've started speaking out loud." },
  { type: "pronunciation_100", group: "pronunciation", icon: "🎤",
    label_vi: "100 lần luyện nói", label_en: "100 pronunciation drills",
    blurb_vi: "Phản xạ phát âm rõ rệt.",
    blurb_en: "Real pronunciation reflexes." },

  // Writing
  { type: "writing_10", group: "writing", icon: "✍️",
    label_vi: "10 bài viết",     label_en: "10 writing submissions",
    blurb_vi: "Đã đủ để Mercy thấy lối viết.",
    blurb_en: "Enough for Mercy to see your style." },
  { type: "writing_50", group: "writing", icon: "✍️",
    label_vi: "50 bài viết",     label_en: "50 writing submissions",
    blurb_vi: "Tay viết bền bỉ.",
    blurb_en: "A steady writing habit." },
];

const BY_TYPE: ReadonlyMap<CertificateType, CertificateMeta> = new Map(
  CERTIFICATE_CATALOG.map((m) => [m.type, m]),
);

export function certificateMeta(type: CertificateType): CertificateMeta | null {
  return BY_TYPE.get(type) ?? null;
}
