// src/notificationEngine/lifecycle.ts
//
// Orchestration: build the snapshot + preferences + permission, compute a
// per-channel schedule plan (pure, testable), and apply it through the
// local-notifications adapter. Also owns app foreground/background listeners.
//
// Every public entry no-ops when FEATURE_NOTIFICATIONS is off.

import type { PluginListenerHandle } from "@capacitor/core";
import { App } from "@capacitor/app";

import { supabase } from "@/lib/supabaseClient";
import { FEATURE_FLAGS } from "@/lib/featureFlags";

import { NOTIFICATION_IDS } from "./types";
import type { HabitSnapshot, NotificationPreferences } from "./types";
import { renderCopy, type CopyLang } from "./copy";
import { loadNotificationPreferences } from "./preferences";
import { buildHabitSnapshot } from "./readModel";
import { checkNotificationPermission } from "./permissions";
import {
  scheduleRepeatingDaily,
  scheduleOneShotLocal,
  cancel,
} from "./localScheduler";
import { getLocalStudyDates } from "./dateMath";

/** Streak-save fires at 20:00 device-local. */
const STREAK_SAVE_HOUR = 20;
/** Due-review one-shot fires ~15 minutes after a refresh when cards are due. */
const DUE_REVIEW_DELAY_MS = 15 * 60 * 1000;
// Once the learner acts today, streak-save is suppressed for the rest of THIS
// local day — independent of when the server's streak_last_studied_date catches
// up. Without this, onFirstActionOfDay's own refresh (and any later foreground
// refresh) can re-arm the 20:00 reminder while the server snapshot still reads
// "at risk", nagging someone who already practiced. Stored as an ISO instant;
// compared on the snapshot's local-day grain.
const STREAK_SAVE_SUPPRESSED_AT_KEY = "mb.notif.streakSaveSuppressedAt.v1";

export type ScheduleDecision =
  | {
      kind: "scheduleDaily";
      id: number;
      hour: number;
      minute: number;
      title: string;
      body: string;
    }
  | {
      kind: "scheduleOneShot";
      id: number;
      at: Date;
      title: string;
      body: string;
    }
  | { kind: "cancel"; id: number };

function resolveCopyLang(): CopyLang {
  // Vietnamese-first product default. (Native-language read can be wired later;
  // kept deterministic here for the MVP.)
  return "vi";
}

function parseHhmm(value: string): { hour: number; minute: number } {
  const [h, m] = value.split(":");
  const hour = Number(h);
  const minute = Number(m);
  return {
    hour: Number.isFinite(hour) ? Math.min(23, Math.max(0, hour)) : 19,
    minute: Number.isFinite(minute) ? Math.min(59, Math.max(0, minute)) : 0,
  };
}

// ── Pure planners ──────────────────────────────────────────────────────────

export function planDailyReminder(
  prefs: NotificationPreferences,
  permissionGranted: boolean,
  featureOn: boolean,
  lang: CopyLang = "vi",
): ScheduleDecision {
  const id = NOTIFICATION_IDS.daily_reminder;
  if (!featureOn || !permissionGranted || !prefs.dailyReminderEnabled) {
    return { kind: "cancel", id };
  }
  const { hour, minute } = parseHhmm(prefs.dailyReminderLocalTime);
  const { title, body } = renderCopy("daily_reminder", lang);
  return { kind: "scheduleDaily", id, hour, minute, title, body };
}

export function planStreakSave(
  snapshot: HabitSnapshot,
  prefs: NotificationPreferences,
  permissionGranted: boolean,
  featureOn: boolean,
  now: Date = new Date(),
  lang: CopyLang = "vi",
  streakSaveSuppressedToday = false,
): ScheduleDecision {
  const id = NOTIFICATION_IDS.streak_save;
  // isAtRiskToday already encodes: serverStreaksEnabled && streakDays > 0 &&
  // lastStudied === yesterdayLocal && lastStudied !== todayLocal.
  // streakSaveSuppressedToday wins even when the server snapshot still reads
  // at-risk (propagation lag), so a learner who already practiced is not nagged.
  const eligible =
    featureOn &&
    permissionGranted &&
    snapshot.serverStreaksEnabled &&
    prefs.streakSaveEnabled &&
    snapshot.isAtRiskToday &&
    !streakSaveSuppressedToday;
  if (!eligible) return { kind: "cancel", id };

  const at = new Date(now);
  at.setHours(STREAK_SAVE_HOUR, 0, 0, 0);
  if (at.getTime() <= now.getTime()) return { kind: "cancel", id };

  const { title, body } = renderCopy("streak_save", lang, {
    streak: snapshot.streakDays,
  });
  return { kind: "scheduleOneShot", id, at, title, body };
}

export function planDueReview(
  snapshot: HabitSnapshot,
  permissionGranted: boolean,
  featureOn: boolean,
  now: Date = new Date(),
  lang: CopyLang = "vi",
): ScheduleDecision {
  const id = NOTIFICATION_IDS.due_review;
  if (!featureOn || !permissionGranted) return { kind: "cancel", id };

  if (snapshot.dueCount > 0) {
    const at = new Date(now.getTime() + DUE_REVIEW_DELAY_MS);
    const { title, body } = renderCopy("due_review_count", lang, {
      count: snapshot.dueCount,
    });
    return { kind: "scheduleOneShot", id, at, title, body };
  }
  if (snapshot.nextScheduledAt) {
    const at = new Date(snapshot.nextScheduledAt);
    if (!Number.isNaN(at.getTime()) && at.getTime() > now.getTime()) {
      const { title, body } = renderCopy("due_review_pending", lang);
      return { kind: "scheduleOneShot", id, at, title, body };
    }
  }
  return { kind: "cancel", id };
}

export function planAll(
  snapshot: HabitSnapshot,
  prefs: NotificationPreferences,
  permissionGranted: boolean,
  featureOn: boolean,
  now: Date = new Date(),
  lang: CopyLang = "vi",
): ScheduleDecision[] {
  const streakSaveSuppressedToday = isStreakSaveSuppressedForSnapshot(snapshot);
  return [
    planDailyReminder(prefs, permissionGranted, featureOn, lang),
    planStreakSave(
      snapshot,
      prefs,
      permissionGranted,
      featureOn,
      now,
      lang,
      streakSaveSuppressedToday,
    ),
    planDueReview(snapshot, permissionGranted, featureOn, now, lang),
  ];
}

/** Read the stored streak-save suppression instant, or null if unset/invalid. */
function readSuppressedAt(): Date | null {
  try {
    const value = localStorage.getItem(STREAK_SAVE_SUPPRESSED_AT_KEY);
    if (!value) return null;
    const at = new Date(value);
    return Number.isNaN(at.getTime()) ? null : at;
  } catch {
    return null;
  }
}

/**
 * True when streak-save was suppressed on the SAME local day as the snapshot
 * (computed in the snapshot's timezone). A suppression from a previous local
 * day does not carry over — streak-save can fire again the next day.
 */
function isStreakSaveSuppressedForSnapshot(snapshot: HabitSnapshot): boolean {
  const suppressedAt = readSuppressedAt();
  if (!suppressedAt) return false;
  return (
    getLocalStudyDates(snapshot.timezone, suppressedAt).todayLocal ===
    snapshot.todayLocal
  );
}

/**
 * Mark streak-save as handled for today (the learner has practiced). Called
 * from onFirstActionOfDay alongside the direct cancel; this is the durable
 * half — the cancel clears the pending one-shot, this stops any later refresh
 * from re-arming it before the server snapshot catches up.
 */
export function suppressStreakSaveForToday(now: Date = new Date()): void {
  try {
    localStorage.setItem(STREAK_SAVE_SUPPRESSED_AT_KEY, now.toISOString());
  } catch {
    /* storage unavailable — the direct cancel still runs */
  }
}

async function applyDecision(d: ScheduleDecision): Promise<void> {
  switch (d.kind) {
    case "scheduleDaily":
      await scheduleRepeatingDaily({
        id: d.id,
        hour: d.hour,
        minute: d.minute,
        title: d.title,
        body: d.body,
      });
      return;
    case "scheduleOneShot":
      await scheduleOneShotLocal({
        id: d.id,
        at: d.at,
        title: d.title,
        body: d.body,
      });
      return;
    case "cancel":
      await cancel([d.id]);
      return;
  }
}

async function currentUserId(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Recompute and apply the full schedule from live state. No-op when the
 * feature is off. Checks permission WITHOUT prompting; when not granted every
 * channel resolves to a cancel (safe idempotent teardown).
 */
export async function refreshNotificationSchedule(
  now: Date = new Date(),
): Promise<void> {
  if (!FEATURE_FLAGS.FEATURE_NOTIFICATIONS) return;
  const userId = await currentUserId();
  if (!userId) return;

  const permissionGranted = await checkNotificationPermission();
  const [prefs, snapshot] = await Promise.all([
    loadNotificationPreferences(userId),
    buildHabitSnapshot(userId, now),
  ]);

  const decisions = planAll(
    snapshot,
    prefs,
    permissionGranted,
    FEATURE_FLAGS.FEATURE_NOTIFICATIONS,
    now,
    resolveCopyLang(),
  );
  for (const d of decisions) {
    await applyDecision(d);
  }
}

// ── App lifecycle ────────────────────────────────────────────────────────────

let appStateHandle: PluginListenerHandle | null = null;

/**
 * Register foreground/background listeners and do an initial schedule refresh.
 * Never prompts for permission. No-op when the feature is off.
 */
export async function bootNotificationEngine(): Promise<void> {
  if (!FEATURE_FLAGS.FEATURE_NOTIFICATIONS) return;
  if (appStateHandle) return; // idempotent

  try {
    appStateHandle = await App.addListener("appStateChange", () => {
      // Both foreground and background converge on a permission-checked,
      // non-prompting refresh; the scheduler is idempotent.
      void refreshNotificationSchedule();
    });
  } catch {
    appStateHandle = null;
  }

  await refreshNotificationSchedule();
}

/** Remove app lifecycle listeners only. */
export async function shutdownNotificationEngine(): Promise<void> {
  if (!appStateHandle) return;
  try {
    await appStateHandle.remove();
  } catch {
    /* ignore */
  }
  appStateHandle = null;
}
