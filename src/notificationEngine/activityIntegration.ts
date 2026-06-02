// src/notificationEngine/activityIntegration.ts
//
// The seams the app calls when the learner does things. All no-op when
// FEATURE_NOTIFICATIONS is off. The permission prompt fires ONLY here, from
// onFirstCompletedActivity — never on launch/boot.

import { FEATURE_FLAGS } from "@/lib/featureFlags";

import { NOTIFICATION_IDS } from "./types";
import { cancel } from "./localScheduler";
import { requestNotificationPermissionOnce } from "./permissions";
import { refreshNotificationSchedule } from "./lifecycle";

export interface CompletedActivity {
  /** Where the completion came from, e.g. "room", "vocabulary", "reflection". */
  source: string;
  /** A more specific event label. */
  event: string;
}

/**
 * Called from pointsService on the first points-earning action of the local
 * day. Cancels the pending streak-save warning (the streak is now safe) and
 * recomputes the schedule.
 */
export function onFirstActionOfDay(): void {
  if (!FEATURE_FLAGS.FEATURE_NOTIFICATIONS) return;
  void cancel([NOTIFICATION_IDS.streak_save]);
  void refreshNotificationSchedule();
}

/**
 * Called after the FIRST completed activity (room completed, vocabulary review
 * completed, reflection saved). This is the only place a permission prompt is
 * allowed. On grant, refresh the schedule.
 */
export function onFirstCompletedActivity(_activity: CompletedActivity): void {
  if (!FEATURE_FLAGS.FEATURE_NOTIFICATIONS) return;
  void (async () => {
    const granted = await requestNotificationPermissionOnce();
    if (granted) await refreshNotificationSchedule();
  })();
}

/** Called when the vocabulary due queue changes; recomputes due-review. */
export function onReviewQueueChanged(): void {
  if (!FEATURE_FLAGS.FEATURE_NOTIFICATIONS) return;
  void refreshNotificationSchedule();
}
