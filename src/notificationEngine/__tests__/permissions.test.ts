import { vi, describe, it, expect, beforeEach } from "vitest";

type Display = "granted" | "denied" | "prompt" | "prompt-with-rationale";

const h = vi.hoisted(() => ({
  isNative: true,
  checkResult: { display: "prompt" as Display },
  requestResult: { display: "granted" as Display },
  requestCalls: 0,
  checkCalls: 0,
}));

vi.mock("@capacitor/core", () => ({
  Capacitor: { isNativePlatform: () => h.isNative },
}));
vi.mock("@capacitor/local-notifications", () => ({
  LocalNotifications: {
    checkPermissions: async () => {
      h.checkCalls++;
      return h.checkResult;
    },
    requestPermissions: async () => {
      h.requestCalls++;
      return h.requestResult;
    },
  },
}));

import {
  checkNotificationPermission,
  requestNotificationPermissionOnce,
  __resetPermissionStateForTests,
} from "../permissions";

beforeEach(() => {
  h.isNative = true;
  h.checkResult = { display: "prompt" };
  h.requestResult = { display: "granted" };
  h.requestCalls = 0;
  h.checkCalls = 0;
  __resetPermissionStateForTests();
});

describe("permissions gate", () => {
  it("no-ops on web (never touches the plugin request)", async () => {
    h.isNative = false;
    expect(await requestNotificationPermissionOnce()).toBe(false);
    expect(await checkNotificationPermission()).toBe(false);
    expect(h.requestCalls).toBe(0);
  });

  it("prompts at most once; a second call does not re-prompt", async () => {
    expect(await requestNotificationPermissionOnce()).toBe(true);
    expect(h.requestCalls).toBe(1);
    // Second call: OS still 'prompt' but the one-time key is set → no re-prompt.
    expect(await requestNotificationPermissionOnce()).toBe(false);
    expect(h.requestCalls).toBe(1);
  });

  it("a denied result suppresses repeat prompts for the session", async () => {
    h.requestResult = { display: "denied" };
    expect(await requestNotificationPermissionOnce()).toBe(false);
    expect(h.requestCalls).toBe(1);
    expect(await requestNotificationPermissionOnce()).toBe(false);
    expect(h.requestCalls).toBe(1); // session-denied short-circuits
  });

  it("returns granted without prompting when already granted", async () => {
    h.checkResult = { display: "granted" };
    expect(await requestNotificationPermissionOnce()).toBe(true);
    expect(h.requestCalls).toBe(0);
  });

  it("checkNotificationPermission never requests", async () => {
    await checkNotificationPermission();
    expect(h.requestCalls).toBe(0);
    expect(h.checkCalls).toBeGreaterThan(0);
  });
});
