// src/languages/thai/thaiIndex.ts
//
// Compact, learner-facing index for the Thai track. PURE DATA ONLY — no UI
// wiring, no side effects. It enumerates every level, module, and learning
// path so an index page / picker can render the catalogue from one source.
//
// Bilingual by design: each entry has Vietnamese (`*_vi`) and English (`*_en`)
// descriptions, authored per audience (same intent, audience-specific wording)
// — NOT translations of each other. Thai script (`title_th`) is shown where it
// reads naturally, empty otherwise.
//
// Honesty: native review is DEFERRED, and the track is text-first (no audio,
// no pronunciation scoring). That caveat is carried in `THAI_INDEX_NOTE` so the
// UI can surface it rather than implying completeness.
//
// Level goal text is reused from the committed courseMap so the two stay in
// sync; this file only reads it.

import type { ThaiCefrLevel } from "./lessons";
import { THAI_LEVEL_GOALS } from "./courseMap";

export type ThaiIndexKind = "level" | "module" | "path";

export type ThaiIndexEntry = {
  /** Stable slug, unique across the whole index. */
  key: string;
  kind: ThaiIndexKind;
  /** CEFR level for `kind: "level"` entries; undefined otherwise. */
  level?: ThaiCefrLevel;
  /** Thai-script label where natural; empty string when not useful. */
  title_th: string;
  title_vi: string;
  title_en: string;
  desc_vi: string;
  desc_en: string;
};

// ── Levels (A1 … C2) ─────────────────────────────────────────────────────
// Derived from THAI_LEVEL_GOALS so the catalogue and the course map never
// drift. Each level's description reuses its can-do goal.

export const THAI_INDEX_LEVELS: ThaiIndexEntry[] = THAI_LEVEL_GOALS.map((g) => ({
  key: `level-${g.level.toLowerCase()}`,
  kind: "level" as const,
  level: g.level,
  title_th: "",
  title_vi: `${g.level} — ${g.label_vi}`,
  title_en: `${g.level} — ${g.label_en}`,
  desc_vi: g.goal_vi,
  desc_en: g.goal_en,
}));

// ── Modules ──────────────────────────────────────────────────────────────
// Covers the WAVE4 required set: survival, vocab, tones, review, scenarios,
// reading, writing, speaking, diagnostics.

export const THAI_INDEX_MODULES: ThaiIndexEntry[] = [
  {
    key: "survival",
    kind: "module",
    title_th: "ภาษาเอาตัวรอด",
    title_vi: "Tiếng Thái sinh tồn",
    title_en: "Survival Thai",
    desc_vi: "Cụm từ cấp tốc: chào hỏi, hỏi giá, taxi, khách sạn, nhà thuốc, cảnh sát.",
    desc_en: "Quick phrases: greetings, prices, taxi, hotel, pharmacy, police.",
  },
  {
    key: "vocab",
    kind: "module",
    title_th: "คำศัพท์",
    title_vi: "Từ vựng",
    title_en: "Vocabulary",
    desc_vi: "Từ theo chủ đề kèm chữ Thái, phiên âm, nghĩa Việt và Anh.",
    desc_en: "Themed words with Thai script, romanization, VI and EN meanings.",
  },
  {
    key: "tones",
    kind: "module",
    title_th: "วรรณยุกต์",
    title_vi: "Thanh điệu",
    title_en: "Tones",
    desc_vi: "5 thanh của tiếng Thái; người Việt có lợi thế vì tiếng Việt cũng có thanh.",
    desc_en: "Thai's five tones; Vietnamese speakers have a head start as Vietnamese is tonal.",
  },
  {
    key: "review",
    kind: "module",
    title_th: "ทบทวน",
    title_vi: "Ôn tập",
    title_en: "Review",
    desc_vi: "Ôn lại trọng tâm từng cấp trước khi lên cấp kế tiếp.",
    desc_en: "Revisit each level's core before moving up.",
  },
  {
    key: "scenarios",
    kind: "module",
    title_th: "สถานการณ์จำลอง",
    title_vi: "Tình huống / Đóng vai",
    title_en: "Scenarios / Roleplay",
    desc_vi: "Hội thoại và đóng vai thực tế: nhà hàng, sân bay, công sở, gọi điện.",
    desc_en: "Real-life dialogues and roleplay: restaurant, airport, office, phone calls.",
  },
  {
    key: "reading",
    kind: "module",
    title_th: "การอ่าน",
    title_vi: "Đọc",
    title_en: "Reading",
    desc_vi: "Tập đọc chữ Thái: phụ âm, nguyên âm, ghép vần, câu ngắn.",
    desc_en: "Learn to read Thai: consonants, vowels, syllables, short sentences.",
  },
  {
    key: "writing",
    kind: "module",
    title_th: "การเขียน",
    title_vi: "Viết",
    title_en: "Writing",
    desc_vi: "Tập viết chữ Thái và soạn câu đơn giản đúng quy tắc.",
    desc_en: "Practice writing Thai characters and simple correct sentences.",
  },
  {
    key: "speaking",
    kind: "module",
    title_th: "การพูด",
    title_vi: "Nói",
    title_en: "Speaking",
    desc_vi: "Gợi ý luyện nói và đóng vai. Lưu ý: chưa có chấm điểm phát âm.",
    desc_en: "Speaking prompts and roleplay. Note: no pronunciation scoring yet.",
  },
  {
    key: "diagnostics",
    kind: "module",
    title_th: "แบบทดสอบวัดระดับ",
    title_vi: "Bài kiểm tra / Chẩn đoán",
    title_en: "Diagnostics / Quizzes",
    desc_vi: "Tự kiểm tra để xác định trình độ: nối từ, điền khuyết, dịch câu.",
    desc_en: "Self-check to gauge your level: matching, fill-in-the-blank, translation.",
  },
];

// ── Learning paths ───────────────────────────────────────────────────────
// High-level routes a learner can pick. `steps` reference module/level keys.

export type ThaiLearningPath = {
  key: string;
  title_vi: string;
  title_en: string;
  desc_vi: string;
  desc_en: string;
  /** Ordered list of entry keys (levels or modules) to follow. */
  steps: string[];
};

export const THAI_INDEX_PATHS: ThaiLearningPath[] = [
  {
    key: "path-traveler",
    title_vi: "Du lịch nhanh",
    title_en: "Quick traveler",
    desc_vi: "Đủ tiếng Thái để đi du lịch trong vài tuần.",
    desc_en: "Just enough Thai to travel within a few weeks.",
    steps: ["survival", "tones", "vocab", "scenarios", "level-a1", "level-a2"],
  },
  {
    key: "path-foundation",
    title_vi: "Xây nền vững",
    title_en: "Solid foundation",
    desc_vi: "Học chữ viết và ngữ pháp bài bản từ A1.",
    desc_en: "Learn the script and grammar properly from A1.",
    steps: [
      "reading",
      "tones",
      "level-a1",
      "writing",
      "level-a2",
      "review",
      "diagnostics",
    ],
  },
  {
    key: "path-work",
    title_vi: "Tiếng Thái cho công việc",
    title_en: "Thai for work",
    desc_vi: "Hướng tới giao tiếp công sở và trang trọng (B2–C2).",
    desc_en: "Toward workplace and formal communication (B2–C2).",
    steps: ["level-b1", "scenarios", "level-b2", "speaking", "level-c1", "level-c2"],
  },
];

// ── Honest note ──────────────────────────────────────────────────────────

export const THAI_INDEX_NOTE = {
  text_vi:
    "Nội dung tiếng Thái chưa được người bản xứ kiểm duyệt (việc rà soát bản ngữ " +
    "được hoãn lại) và hiện chưa có âm thanh hay chấm điểm phát âm. Phiên âm chỉ " +
    "là công cụ hỗ trợ học.",
  text_en:
    "The Thai content has not been native-reviewed (native review is deferred) and " +
    "has no audio or pronunciation scoring yet. Romanization is a learning aid only.",
};

// ── Flat aggregate ───────────────────────────────────────────────────────

export const THAI_INDEX_ENTRIES: ThaiIndexEntry[] = [
  ...THAI_INDEX_LEVELS,
  ...THAI_INDEX_MODULES,
];

export const THAI_INDEX = {
  code: "th" as const,
  name_th: "ภาษาไทย",
  name_vi: "Tiếng Thái",
  name_en: "Thai",
  levels: THAI_INDEX_LEVELS,
  modules: THAI_INDEX_MODULES,
  paths: THAI_INDEX_PATHS,
  entries: THAI_INDEX_ENTRIES,
  note: THAI_INDEX_NOTE,
};
