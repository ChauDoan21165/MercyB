// src/lib/push/pushTokenRegistration.ts
//
// A9 — Capacitor push token registration.
//
// This module is safe to import when @capacitor/push-notifications is
// NOT installed (web build, dev server, CI). Native plugin loading is
// done lazily via dynamic import and falls back to a non-op result so
// the rest of the app keeps working.
//
// Flow:
//   1. registerPushNotifications() — call from a post-login effect.
//      - Detects native runtime (Capacitor).
//      - Lazy-imports the plugin (returns silently if absent).
//      - Calls plugin.requestPermissions(); if denied, records the
//        denial in sessionStorage so we don't re-prompt this session.
//      - On grant + token, persists the token via the
//        register_push_token RPC and remembers it in localStorage so
//        we don't churn the DB on every app open.
//
//   2. unregisterPushNotifications() — best-effort removal of plugin
//      listeners. Does not delete the server-side token row; that's
//      a manual /account/push-preferences action.

import type { SupabaseClient } from "@supabase/supabase-js";

import type { PushPlatform } from "./types";

type Capacitor = {
  isNativePlatform: () => boolean;
  getPlatform: () => string;
};

type PushPluginToken = { value: string };

type PushPlugin = {
  requestPermissions: () => Promise<{ receive: "granted" | "denied" | "prompt" }>;
  register: () => Promise<void>;
  removeAllListeners: () => Promise<void>;
  addListener: (
    event: "registration" | "registrationError" | "pushNotificationReceived",
    handler: (data: unknown) => void,
  ) => Promise<{ remove: () => Promise<void> }> | { remove: () => Promise<void> };
};

const TOKEN_LS_KEY = "mb:push:registered-token";
const DENY_SS_KEY = "mb:push:denied-this-session";

// ── Lazy plugin loading ──────────────────────────────────────────────-

// Indirect specifiers so TypeScript doesn't try to resolve the
// optional native plugins at build time. The packages are only
// installed in the iOS / Android bundle (see docs/push-notification-setup.md).
const CAPACITOR_CORE_PKG = "@capacitor/core";
const CAPACITOR_PUSH_PKG = "@capacitor/push-notifications";

async function loadCapacitor(): Promise<Capacitor | null> {
  try {
    const mod = (await import(/* @vite-ignore */ CAPACITOR_CORE_PKG)) as {
      Capacitor?: Capacitor;
    };
    return mod.Capacitor ?? null;
  } catch {
    return null;
  }
}

async function loadPushPlugin(): Promise<PushPlugin | null> {
  try {
    const mod = (await import(/* @vite-ignore */ CAPACITOR_PUSH_PKG)) as {
      PushNotifications?: PushPlugin;
    };
    return mod.PushNotifications ?? null;
  } catch {
    return null;
  }
}

function platformFromCapacitor(name: string): PushPlatform | null {
  if (name === "ios") return "ios";
  if (name === "android") return "android";
  return null;
}

function readPersistedToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_LS_KEY);
  } catch {
    return null;
  }
}

function persistToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_LS_KEY, token);
  } catch {
    // Ignore — the RPC will be hit on every cold start, which is fine.
  }
}

function isDeniedThisSession(): boolean {
  try {
    return sessionStorage.getItem(DENY_SS_KEY) === "1";
  } catch {
    return false;
  }
}

function markDeniedThisSession(): void {
  try {
    sessionStorage.setItem(DENY_SS_KEY, "1");
  } catch {
    // ignore
  }
}

// ── Public surface ───────────────────────────────────────────────────-

export type RegisterResult =
  | { kind: "skipped_not_native"; reason: string }
  | { kind: "skipped_denied_recently" }
  | { kind: "permission_denied" }
  | { kind: "plugin_unavailable" }
  | { kind: "registered"; token: string; platform: PushPlatform; reused: boolean }
  | { kind: "error"; message: string };

export async function registerPushNotifications(
  supabase: SupabaseClient,
): Promise<RegisterResult> {
  const capacitor = await loadCapacitor();
  if (!capacitor || !capacitor.isNativePlatform?.()) {
    return {
      kind: "skipped_not_native",
      reason: capacitor ? capacitor.getPlatform?.() ?? "web" : "no_capacitor",
    };
  }

  const platform = platformFromCapacitor(capacitor.getPlatform());
  if (!platform) {
    return { kind: "skipped_not_native", reason: capacitor.getPlatform() };
  }

  if (isDeniedThisSession()) {
    return { kind: "skipped_denied_recently" };
  }

  const plugin = await loadPushPlugin();
  if (!plugin) return { kind: "plugin_unavailable" };

  let perm: { receive: "granted" | "denied" | "prompt" };
  try {
    perm = await plugin.requestPermissions();
  } catch (e) {
    return {
      kind: "error",
      message: e instanceof Error ? e.message : String(e),
    };
  }

  if (perm.receive !== "granted") {
    markDeniedThisSession();
    return { kind: "permission_denied" };
  }

  // Wait for the registration callback to fire with the token.
  const token = await new Promise<string | null>((resolve) => {
    let settled = false;
    const finish = (value: string | null) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    const handle = plugin.addListener(
      "registration",
      (data: unknown) => finish((data as PushPluginToken)?.value ?? null),
    );
    const errorHandle = plugin.addListener(
      "registrationError",
      () => finish(null),
    );

    plugin.register().catch(() => finish(null));

    setTimeout(() => finish(null), 10000);

    void Promise.resolve(handle);
    void Promise.resolve(errorHandle);
  });

  if (!token) {
    return { kind: "error", message: "no_token_returned" };
  }

  // Skip the RPC when the token hasn't changed since last cold start.
  const previous = readPersistedToken();
  if (previous === token) {
    return { kind: "registered", token, platform, reused: true };
  }

  const { error } = await supabase.rpc("register_push_token", {
    p_token: token,
    p_platform: platform,
    p_device_id: null,
  });
  if (error) {
    return { kind: "error", message: error.message };
  }

  persistToken(token);
  return { kind: "registered", token, platform, reused: false };
}

export async function unregisterPushNotifications(): Promise<void> {
  const plugin = await loadPushPlugin();
  if (!plugin) return;
  try {
    await plugin.removeAllListeners();
  } catch {
    // Best-effort.
  }
}

// ── Test seams ──────────────────────────────────────────────────────-

export const _internals = {
  TOKEN_LS_KEY,
  DENY_SS_KEY,
  readPersistedToken,
  persistToken,
  isDeniedThisSession,
  markDeniedThisSession,
  platformFromCapacitor,
};
