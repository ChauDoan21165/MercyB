// src/lib/platform.ts
//
// Thin wrapper around Capacitor's platform detection. Centralised so the
// iOS/Android/web switch used by IAP (and any future native-only code) is
// a single import, not scattered Capacitor calls.

import { Capacitor } from "@capacitor/core";

export type Platform = "ios" | "android" | "web";

/**
 * Returns the runtime platform.
 * - "ios" / "android" when the app runs inside a Capacitor native wrapper
 * - "web" everywhere else (desktop browser, mobile Safari/Chrome)
 */
export function getPlatform(): Platform {
  const raw = Capacitor.getPlatform();
  if (raw === "ios") return "ios";
  if (raw === "android") return "android";
  return "web";
}

/**
 * True when running inside a Capacitor native shell (iOS or Android).
 * Equivalent to `getPlatform() !== "web"` but uses Capacitor's own check
 * so future versions stay in sync.
 */
export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}
