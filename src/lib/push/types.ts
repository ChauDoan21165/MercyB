// src/lib/push/types.ts
//
// TypeScript-side twin of supabase/functions/_shared/pushNotifications.ts.
// Keep the shape in sync — Vitest can't import the Deno module directly,
// so client-side code reads from this file and the edge function
// reads from the _shared one.

export type PushPlatform = "ios" | "android" | "web";

export type NotificationType =
  | "daily_practice"
  | "streak_grace"
  | "leaderboard_position_change"
  | "mercy_message"
  | "trial_expiring";

export const NOTIFICATION_TYPES: ReadonlyArray<NotificationType> = [
  "daily_practice",
  "streak_grace",
  "leaderboard_position_change",
  "mercy_message",
  "trial_expiring",
];

export type PushPreferences = {
  daily_practice_enabled: boolean;
  daily_practice_local_time: string; // "HH:MM"
  streak_grace_enabled: boolean;
  leaderboard_change_enabled: boolean;
  mercy_message_enabled: boolean;
  trial_expiring_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  timezone: string;
};

export const DEFAULT_PREFERENCES: PushPreferences = {
  daily_practice_enabled: false,
  daily_practice_local_time: "19:00",
  streak_grace_enabled: true,
  leaderboard_change_enabled: true,
  mercy_message_enabled: true,
  trial_expiring_enabled: true,
  quiet_hours_start: "22:00",
  quiet_hours_end: "07:00",
  timezone: "Asia/Ho_Chi_Minh",
};

/** Bilingual labels for the preferences UI. */
export const NOTIFICATION_LABELS: Record<
  NotificationType,
  { vi: string; en: string; description_vi: string }
> = {
  daily_practice: {
    vi: "Lời nhắc luyện hằng ngày",
    en: "Daily practice reminder",
    description_vi:
      "Mercy nhắc bạn luyện 5 phút mỗi ngày vào giờ bạn chọn. Mặc định tắt — cần bạn chủ động bật.",
  },
  streak_grace: {
    vi: "Cứu chuỗi sắp hết hạn",
    en: "Streak grace warning",
    description_vi:
      "Khi chuỗi của bạn sắp gãy, Mercy nhắc trong vài giờ cuối — không nhắc nửa đêm.",
  },
  leaderboard_position_change: {
    vi: "Thay đổi xếp hạng",
    en: "Leaderboard position change",
    description_vi:
      "Báo khi bạn lên hoặc xuống hạng đáng kể trên bảng xếp hạng tuần.",
  },
  mercy_message: {
    vi: "Tin nhắn từ Mercy",
    en: "Message from Mercy",
    description_vi:
      "Khi Mercy chủ động nhắn — góp ý sau bài luyện, hoặc một bài học gợi ý.",
  },
  trial_expiring: {
    vi: "Trial sắp hết hạn",
    en: "Trial expiring",
    description_vi:
      "Nhắc bạn 24 giờ trước khi trial Premium hết hạn. Để bạn không bị mất quyền truy cập đột ngột.",
  },
};
