// src/notificationEngine/preferences.ts
//
// Read side of the engine's preferences. Reuses the existing push_preferences
// table and schema — NO new table. The write/upsert path stays in
// src/pages/account/PushPreferences.tsx (unchanged). Mapping:
//   daily_practice_enabled    → dailyReminderEnabled
//   daily_practice_local_time → dailyReminderLocalTime ("HH:MM")
//   streak_grace_enabled      → streakSaveEnabled
//   timezone                  → timezone (reference)
// Due-review has no DB preference in the MVP.

import { supabase } from "@/lib/supabaseClient";
import { DEFAULT_PREFERENCES } from "@/lib/push/types";
import type { NotificationPreferences } from "./types";

/** Defaults when the user has no push_preferences row yet. */
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  dailyReminderEnabled: DEFAULT_PREFERENCES.daily_practice_enabled,
  dailyReminderLocalTime: DEFAULT_PREFERENCES.daily_practice_local_time,
  streakSaveEnabled: DEFAULT_PREFERENCES.streak_grace_enabled,
  timezone: DEFAULT_PREFERENCES.timezone,
};

/** Load the engine's notification preferences for a user. Missing row → defaults. */
export async function loadNotificationPreferences(
  userId: string,
): Promise<NotificationPreferences> {
  const { data } = await supabase
    .from("push_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return { ...DEFAULT_NOTIFICATION_PREFERENCES };

  return {
    dailyReminderEnabled: !!data.daily_practice_enabled,
    dailyReminderLocalTime: String(
      data.daily_practice_local_time ??
        DEFAULT_NOTIFICATION_PREFERENCES.dailyReminderLocalTime,
    ).slice(0, 5),
    streakSaveEnabled: !!data.streak_grace_enabled,
    timezone: String(data.timezone ?? DEFAULT_NOTIFICATION_PREFERENCES.timezone),
  };
}
