// src/notificationEngine/localScheduler.ts
//
// Thin adapter over @capacitor/local-notifications. Device-local time only —
// no UTC computation, no server cron. Guarded by Capacitor.isNativePlatform()
// so web and CI no-op green even with the plugin installed. The repeating
// daily uses { on: { hour, minute }, allowWhileIdle: true } → INEXACT alarms
// (no SCHEDULE_EXACT_ALARM permission needed).

import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

export interface RepeatingDailyOptions {
  id: number;
  hour: number;
  minute: number;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export interface OneShotOptions {
  id: number;
  at: Date;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

function nativeActive(): boolean {
  return Capacitor.isNativePlatform();
}

/** Repeating daily reminder at a device-local hour:minute (inexact, Doze-safe). */
export async function scheduleRepeatingDaily(
  opts: RepeatingDailyOptions,
): Promise<void> {
  if (!nativeActive()) return;
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: opts.id,
          title: opts.title,
          body: opts.body,
          schedule: {
            on: { hour: opts.hour, minute: opts.minute },
            allowWhileIdle: true,
          },
          extra: opts.data ?? null,
        },
      ],
    });
  } catch {
    /* fail soft — a missed schedule must never break the app */
  }
}

/** One-shot local notification at a specific device-local instant. */
export async function scheduleOneShotLocal(opts: OneShotOptions): Promise<void> {
  if (!nativeActive()) return;
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: opts.id,
          title: opts.title,
          body: opts.body,
          schedule: { at: opts.at, allowWhileIdle: true },
          extra: opts.data ?? null,
        },
      ],
    });
  } catch {
    /* fail soft */
  }
}

/** Cancel scheduled notifications by id. */
export async function cancel(ids: number[]): Promise<void> {
  if (!nativeActive()) return;
  if (ids.length === 0) return;
  try {
    await LocalNotifications.cancel({
      notifications: ids.map((id) => ({ id })),
    });
  } catch {
    /* fail soft */
  }
}
