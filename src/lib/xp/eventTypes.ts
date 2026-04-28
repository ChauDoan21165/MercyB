// src/lib/xp/eventTypes.ts
//
// Canonical XP event types and their default rewards (per A9 brief).
// Bilingual labels — VI primary — used by /xp history and the XPBadge
// toast. Keep this in sync with award_xp_event() if a new type is added.

export type XPEventType =
  | "lesson_complete"
  | "drill_complete"
  | "challenge_complete"
  | "vocabulary_review_5_words"
  | "streak_day_continued"
  | "streak_week_continued"
  | "first_time_in_category"
  | "perfect_score_lesson"
  | "listening_clip_complete";

export interface XPEventDef {
  type: XPEventType;
  default_xp: number;
  /** Whether the system passes a source_id to anchor idempotency.
   *  False for events whose natural cap is "once per day" (handled by
   *  the daily cap + cooldown alone, e.g., streak continuation). */
  requires_source_id: boolean;
  label_vi: string;
  label_en: string;
}

export const XP_EVENT_DEFS: ReadonlyArray<XPEventDef> = [
  {
    type: "lesson_complete",
    default_xp: 10,
    requires_source_id: true,
    label_vi: "Hoàn thành bài học",
    label_en: "Lesson completed",
  },
  {
    type: "drill_complete",
    default_xp: 5,
    requires_source_id: true,
    label_vi: "Luyện một drill",
    label_en: "Drill completed",
  },
  {
    type: "challenge_complete",
    default_xp: 15,
    requires_source_id: true,
    label_vi: "Hoàn thành thử thách",
    label_en: "Challenge completed",
  },
  {
    type: "vocabulary_review_5_words",
    default_xp: 5,
    requires_source_id: false,
    label_vi: "Ôn 5 từ",
    label_en: "Reviewed 5 words",
  },
  {
    type: "streak_day_continued",
    default_xp: 5,
    requires_source_id: true, // source_id = ISO date so each day awards once
    label_vi: "Giữ chuỗi học",
    label_en: "Streak day held",
  },
  {
    type: "streak_week_continued",
    default_xp: 25,
    requires_source_id: true, // source_id = ISO week
    label_vi: "Trọn tuần học",
    label_en: "Streak week held",
  },
  {
    type: "first_time_in_category",
    default_xp: 20,
    requires_source_id: true, // source_id = category key
    label_vi: "Lần đầu thử mục mới",
    label_en: "First time in category",
  },
  {
    type: "perfect_score_lesson",
    default_xp: 5, // bonus on top of lesson_complete
    requires_source_id: true,
    label_vi: "Điểm tuyệt đối",
    label_en: "Perfect score bonus",
  },
  {
    type: "listening_clip_complete",
    default_xp: 8,
    requires_source_id: true,
    label_vi: "Nghe xong một clip",
    label_en: "Listening clip done",
  },
];

const BY_TYPE: ReadonlyMap<XPEventType, XPEventDef> = new Map(
  XP_EVENT_DEFS.map((d) => [d.type, d]),
);

export function getXPEventDef(type: XPEventType): XPEventDef | null {
  return BY_TYPE.get(type) ?? null;
}

export function defaultXPFor(type: XPEventType): number {
  return BY_TYPE.get(type)?.default_xp ?? 0;
}

export function labelFor(
  type: XPEventType,
  locale: "vi" | "en" = "vi",
): string {
  const def = BY_TYPE.get(type);
  if (!def) return type;
  return locale === "vi" ? def.label_vi : def.label_en;
}
