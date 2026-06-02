// src/notificationEngine/permissions.ts
//
// Notification permission gate. Native-only (Capacitor.isNativePlatform()),
// so web/CI report "not granted" without ever touching the plugin. The prompt
// is fired ONLY after the first completed activity (see activityIntegration) —
// never on launch or boot. One-time persisted key + per-session denial memory
// prevent re-prompting.

import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

const ASKED_KEY = "mb.notif.permission.requested.v1";

let sessionDenied = false;

function readAsked(): boolean {
  try {
    return localStorage.getItem(ASKED_KEY) === "1";
  } catch {
    return false;
  }
}

function writeAsked(): void {
  try {
    localStorage.setItem(ASKED_KEY, "1");
  } catch {
    /* storage unavailable — best effort */
  }
}

/** Read the current permission WITHOUT prompting. False on web/CI. */
export async function checkNotificationPermission(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const status = await LocalNotifications.checkPermissions();
    return status.display === "granted";
  } catch {
    return false;
  }
}

/**
 * Prompt for permission AT MOST ONCE, native-only. Returns whether granted.
 * No-ops (returns false) on web, on prior session denial, on prior one-time
 * prompt, or on an OS-level "denied".
 */
export async function requestNotificationPermissionOnce(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  if (sessionDenied) return false;
  try {
    const current = await LocalNotifications.checkPermissions();
    if (current.display === "granted") return true;
    if (current.display === "denied") {
      sessionDenied = true;
      return false;
    }
    if (readAsked()) return false; // already prompted once on a prior run
    writeAsked();
    const res = await LocalNotifications.requestPermissions();
    const granted = res.display === "granted";
    if (!granted) sessionDenied = true;
    return granted;
  } catch {
    return false;
  }
}

/** Test seam: reset the in-memory session-denial flag. */
export function __resetPermissionStateForTests(): void {
  sessionDenied = false;
}
