// src/lib/push/__tests__/pushTokenRegistration.test.ts
//
// Test the pure / non-Capacitor pieces of the registration helper.
// Native plugin behavior is impossible to exercise in vitest — those
// paths get covered manually on simulator + device. What we lock here:
//   - localStorage / sessionStorage helpers
//   - platform mapping
//   - graceful behavior when Capacitor is absent (web build)

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  _internals,
  isPushPluginAvailable,
  registerPushNotifications,
} from "../pushTokenRegistration";

describe("platformFromCapacitor", () => {
  it("maps known native platforms", () => {
    expect(_internals.platformFromCapacitor("ios")).toBe("ios");
    expect(_internals.platformFromCapacitor("android")).toBe("android");
  });

  it("returns null for web / unknown platforms", () => {
    expect(_internals.platformFromCapacitor("web")).toBeNull();
    expect(_internals.platformFromCapacitor("electron")).toBeNull();
    expect(_internals.platformFromCapacitor("")).toBeNull();
  });
});

describe("token persistence helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it("returns null when no token has been persisted", () => {
    expect(_internals.readPersistedToken()).toBeNull();
  });

  it("round-trips through localStorage", () => {
    _internals.persistToken("abc-token");
    expect(_internals.readPersistedToken()).toBe("abc-token");
  });

  it("uses a stable storage key (cross-instance compat)", () => {
    expect(_internals.TOKEN_LS_KEY).toBe("mb:push:registered-token");
  });
});

describe("session denial helpers", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });
  afterEach(() => {
    sessionStorage.clear();
  });

  it("starts undenied", () => {
    expect(_internals.isDeniedThisSession()).toBe(false);
  });

  it("marks denied and reads it back", () => {
    _internals.markDeniedThisSession();
    expect(_internals.isDeniedThisSession()).toBe(true);
  });

  it("uses a stable session-storage key", () => {
    expect(_internals.DENY_SS_KEY).toBe("mb:push:denied-this-session");
  });
});

describe("registerPushNotifications — web build (no Capacitor)", () => {
  it("returns skipped_not_native when Capacitor is unavailable", async () => {
    // In the vitest jsdom env there is no @capacitor/core resolvable
    // module, so the dynamic import inside loadCapacitor rejects and
    // the helper returns the skipped result.
    const fakeSupabase = {
      rpc: async () => ({ data: null, error: null }),
    } as unknown as Parameters<typeof registerPushNotifications>[0];

    const result = await registerPushNotifications(fakeSupabase);

    expect(result.kind).toBe("skipped_not_native");
  });
});

describe("isPushPluginAvailable — web build (no Capacitor)", () => {
  it("is false when Capacitor/plugin cannot be resolved (no false CTA)", async () => {
    // Same env reasoning as above: @capacitor/core is unresolvable in
    // vitest, so loadCapacitor() → null and the probe is false. This is
    // the signal PushPreferences uses to hide the enroll button so it
    // never offers an action that can only return plugin_unavailable.
    // (Native true-path is device-only by design — see file header.)
    await expect(isPushPluginAvailable()).resolves.toBe(false);
  });
});
