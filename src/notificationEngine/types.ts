// src/notificationEngine/types.ts
//
// Shared types for the notification engine. Leaf module — no runtime deps.

/** Stable local-notification ids (one per channel). */
export const NOTIFICATION_IDS = {
  daily_reminder: 1001,
  streak_save: 1002,
  due_review: 1003,
} as const;

export type NotificationKind = keyof typeof NOTIFICATION_IDS;
export type NotificationId =
  (typeof NOTIFICATION_IDS)[keyof typeof NOTIFICATION_IDS];

/**
 * The single read-model the scheduler reasons over. Built once per
 * foreground/background pass from the live read seams (see readModel.ts).
 * All dates are local `YYYY-MM-DD` computed in the user's IANA timezone.
 */
export interface HabitSnapshot {
  /** Local calendar day today, `YYYY-MM-DD`, in `timezone`. */
  todayLocal: string;
  /** Local calendar day yesterday, `YYYY-MM-DD`, in `timezone`. */
  yesterdayLocal: string;
  /** Resolved IANA timezone used for the date math. */
  timezone: string;
  /** Current study streak (flag-agnostic via canonicalStreak.getCanonicalStreak). */
  streakDays: number;
  /** Whether SERVER_STREAKS_ENABLED is on (gates streak-save entirely). */
  serverStreaksEnabled: boolean;
  /** profiles.streak_last_studied_date (`YYYY-MM-DD`) or null. */
  serverLastStudiedDate: string | null;
  /**
   * True ONLY when: serverStreaksEnabled && streakDays > 0 &&
   * serverLastStudiedDate === yesterdayLocal && serverLastStudiedDate !== todayLocal.
   */
  isAtRiskToday: boolean;
  /** Vocabulary cards due now (SM-2, repository.fetchDueCount). */
  dueCount: number;
  /** Soonest upcoming review ISO timestamp, or null. */
  nextScheduledAt: string | null;
}

/** Resolved local-notification preferences (subset of push_preferences). */
export interface NotificationPreferences {
  /** daily_practice_enabled → daily reminder on/off. */
  dailyReminderEnabled: boolean;
  /** daily_practice_local_time → "HH:MM" repeating local reminder time. */
  dailyReminderLocalTime: string;
  /** streak_grace_enabled → streak-save on/off. */
  streakSaveEnabled: boolean;
  /** timezone reference (IANA). */
  timezone: string;
}

/** A single notification to schedule. */
export interface ScheduledNotification {
  id: NotificationId;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}
