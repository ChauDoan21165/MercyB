# Notification Engine — Build Plan

Build off origin/main 2f4191879 on a new isolated branch lane-d/notifications. Do not merge; open one MR for review.

## Global constraints
- FEATURE_NOTIFICATIONS default OFF. All public APIs no-op when off.
- Guard the local-notifications adapter with Capacitor.isNativePlatform() so web and CI no-op green with the plugin present but no native platform.
- Reuse the existing push_preferences table and schema. No new table.
- Single minimal edit to pointsService.awardPoints (see PR5).
- Apply only the web-safe parts of the D1 changeset (see below). Defer native config, cap sync, and device test.

## D1 changeset — web-safe parts to apply now
- package.json dependencies: add "@capacitor/local-notifications": "^8.2.0", then npm install (resolves types; web-safe).
- capacitor.config.ts plugins: add a LocalNotifications block with smallIcon "ic_stat_mercy" (drawable added later) and iconColor "#0B1E3F" (placeholder hex).
- DEFER (do NOT do now): iOS Info.plist (none required), AndroidManifest POST_NOTIFICATIONS and RECEIVE_BOOT_COMPLETED, npx cap sync, device test. Do not add SCHEDULE_EXACT_ALARM.

## Module layout: src/notificationEngine/
index.ts, types.ts, copy.ts, preferences.ts, readModel.ts, localScheduler.ts, permissions.ts, lifecycle.ts, activityIntegration.ts, dateMath.ts, __tests__/

## PR1 — flag + skeleton
- Add FEATURE_NOTIFICATIONS to src/lib/featureFlags.ts: readEnvBool("VITE_FEATURE_NOTIFICATIONS", false). Default OFF.
- index.ts public exports: bootNotificationEngine, shutdownNotificationEngine, refreshNotificationSchedule (from lifecycle); onFirstActionOfDay, onFirstCompletedActivity, onReviewQueueChanged (from activityIntegration).
- Every public function returns immediately when FEATURE_NOTIFICATIONS is false: no permission checks, no prompts, no scheduling, no listeners.

## PR2 — copy, types, dateMath, preferences
- Notification ids: daily_reminder 1001, streak_save 1002, due_review 1003.
- types.ts: HabitSnapshot type (see PR3), notification id/type enums.
- copy.ts: EN and VN copy for all four messages (see Copy section).
- dateMath.getLocalStudyDates(timezone, now = new Date()) returns { todayLocal, yesterdayLocal } as YYYY-MM-DD computed in the IANA timezone. Fallback order if timezone missing or invalid: device timezone, then Asia/Ho_Chi_Minh. Never use new Date().toISOString().slice(0,10) for streak-save eligibility.
- preferences.ts reuses push_preferences: daily_practice_enabled -> daily reminder on/off; daily_practice_local_time -> repeating local reminder time HH:MM; timezone -> reference; streak_grace_enabled -> streak-save on/off. Due-review has no DB preference in MVP. Keep the existing push_preferences.upsert save path.

## PR3 — readModel + SERVER_STREAKS gating
- HabitSnapshot: { todayLocal, yesterdayLocal, timezone, streakDays, serverStreaksEnabled, serverLastStudiedDate, isAtRiskToday, dueCount, nextScheduledAt }.
- Read sources: FEATURE_FLAGS.SERVER_STREAKS_ENABLED; profiles.timezone; pointsService.getStreakDays(); profiles.streak_last_studied_date; fetchDueCount(); fetchNextScheduledAt() (both from src/lib/vocabulary/repository.ts).
- isAtRiskToday is true only when: SERVER_STREAKS_ENABLED is true AND streakDays > 0 AND serverLastStudiedDate equals yesterdayLocal AND serverLastStudiedDate does not equal todayLocal.
- Do not read the legacy LAST_DAILY_KEY for streak-save eligibility. No UTC fallback.

## PR4 — localScheduler + lifecycle
- localScheduler over @capacitor/local-notifications: scheduleRepeatingDaily({ id, hour, minute, title, body, data }); scheduleOneShotLocal({ id, at, title, body, data }); cancel(ids). Device-local time only. No UTC computation. No server cron. For the repeating daily, use schedule { on: { hour, minute }, allowWhileIdle: true } (inexact alarms).
- Daily reminder (id 1001): repeating at daily_practice_local_time. Reschedule on time change. Cancel when daily_practice_enabled is false, permission revoked, or feature off. On first action of day, leave the repeating rule in place for future days.
- Streak-save (id 1002): schedule one-shot at 20:00 device-local ONLY when SERVER_STREAKS_ENABLED and streak_grace_enabled and permission granted and isAtRiskToday. Cancel 1002 when SERVER_STREAKS_ENABLED is false, on first action of day, when serverLastStudiedDate equals todayLocal, or when feature off / permission revoked / streak_grace_enabled false.
- Due-review (id 1003): if fetchDueCount() > 0 schedule one-shot about 15 minutes after a background or refresh; else if fetchNextScheduledAt() returns a value, schedule one-shot at that time (construct a local Date from the ISO value). Cancel when due count is zero and no soonest review, or feature off / permission revoked.
- Lifecycle foreground: if feature off no-op; check permission without prompting; load preferences; build snapshot; ensure the daily reminder matches preferences; recompute streak-save (cancel 1002 if SERVER_STREAKS_ENABLED false, else recompute from serverLastStudiedDate in profiles.timezone); recompute due-review.
- Lifecycle background: if feature off no-op; if permission granted run a fast schedule refresh; keep daily reminder repeating; recompute streak-save and due-review.
- shutdown removes app lifecycle listeners only.

## PR5 — activity integration + pointsService edit + permission gate
- activityIntegration.ts: onFirstActionOfDay(), onFirstCompletedActivity({ source, event }), onReviewQueueChanged().
- Permission gate: request notification permission only after the first completed activity (room completed, vocabulary review completed, reflection saved). Never prompt on launch or boot. One-time key mb.notif.permission.requested.v1. Native-only (Capacitor.isNativePlatform()). Store denied for the session; do not re-prompt.
- pointsService edit. In src/services/pointsService.ts inside awardPoints(), this existing block:
    if isFirstActionToday: set bonus = POINT_VALUES.daily_login; call updateStreak()
  becomes the same block with one added line after updateStreak(): call void onFirstActionOfDay().
  Add import of onFirstActionOfDay from "@/notificationEngine". No other pointsService behavior changes.
- onFirstActionOfDay() cancels id 1002 and calls refreshNotificationSchedule.

## PR6 — PushPreferences UI
- Reuse src/pages/account/PushPreferences.tsx and the push_preferences schema. Surface and edit daily_practice_enabled, daily_practice_local_time, streak_grace_enabled. Keep the existing push_preferences.upsert save path. Add copy noting the MVP uses on-device local notifications. Do not wire server send-push.

## PR7 — boot wiring
- Add notification engine boot in the app root or layout after the auth context is available. Guard with FEATURE_NOTIFICATIONS. Register foreground and background listeners; check permission without prompting; refresh schedule if permission granted. Never request permission during boot.

## PR8 — tests
- Feature flag OFF: all public APIs no-op; no permission check or request.
- Preferences: reads daily_practice_enabled, daily_practice_local_time, timezone, streak_grace_enabled; missing row falls back to defaults.
- dateMath: todayLocal and yesterdayLocal computed from the supplied IANA timezone; no UTC slicing for streak-save.
- Streak-save: suppressed when SERVER_STREAKS_ENABLED false; cancels 1002 when false; schedules only when serverLastStudiedDate equals yesterdayLocal; does not read the legacy key.
- Daily reminder: schedules repeating 1001; reschedules on time change; cancels when disabled.
- Due-review: schedules 1003 when due count over zero; schedules from soonest when none currently due; cancels when no due and no soonest.
- Activity hook: onFirstActionOfDay cancels 1002; pointsService calls the hook only in the first-action-of-day branch.
- Permission gate: first completed activity prompts once; launch/boot never prompts; denied suppresses repeat prompts.

## Copy (EN / VN)
- Daily reminder. EN title: Mercy is waiting - 5 minutes. EN body: One short drill keeps the habit alive. Open MercyBlade when you have a minute. VN title: Mercy doi ban 5 phut. VN body: Mot bai luyen ngan la du giu thoi quen. Mo MercyBlade khi ban ranh nhe.
- Streak-save. EN title: A few hours to save your {{streak}}-day streak. EN body: One sentence keeps it alive. Open MercyBlade before the day ends. VN title: Con vai gio de giu chuoi {{streak}} ngay. VN body: Lam mot cau la chuoi cua ban van nguyen ven. Mo MercyBlade truoc khi het ngay nhe.
- Due-review (count known). EN title: {{count}} words are ready to review. EN body: A quick review now will make them easier to remember tomorrow. VN title: Co {{count}} tu can on. VN body: On nhanh bay gio se giup ban nho de hon vao ngay mai.
- Due-review (pending). EN title: Review time. EN body: Your vocabulary queue is ready. Open MercyBlade for a quick round. VN title: Den gio on tu. VN body: Hang doi tu vung da san sang. Mo MercyBlade on nhanh mot vong nhe.

Note: VN copy above is written without diacritics for terminal safety; restore proper Vietnamese diacritics in copy.ts.

## Verify before opening the MR
lint, typecheck:ci, full vitest all green. Open ONE MR to main. Do not merge.
