// src/notificationEngine/index.ts
//
// Public surface of the notification engine. Consumers (boot wiring,
// pointsService, activity sites) import ONLY from here. Every export no-ops
// when FEATURE_NOTIFICATIONS is off.

export {
  bootNotificationEngine,
  shutdownNotificationEngine,
  refreshNotificationSchedule,
} from "./lifecycle";

export {
  onFirstActionOfDay,
  onFirstCompletedActivity,
  onReviewQueueChanged,
  type CompletedActivity,
} from "./activityIntegration";
