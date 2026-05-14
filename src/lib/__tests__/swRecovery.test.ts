// src/lib/__tests__/swRecovery.test.ts
//
// Unit tests for `unregisterAllServiceWorkers`. The function is the
// belt-and-suspenders called by main.tsx's `scheduleOneTimeChunkReload`
// before the recovery `window.location.reload()`; without it, a stale
// SW serves the same precached index.html and the recovery loop
// dead-ends. See reports/a9-route-recovery-diagnosis.md.

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { unregisterAllServiceWorkers } from "../swRecovery";

const realNavigator = globalThis.navigator;

function installMockNavigator(getRegistrations: () => Promise<unknown>) {
  Object.defineProperty(globalThis, "navigator", {
    value: { serviceWorker: { getRegistrations } },
    configurable: true,
    writable: true,
  });
}

function restoreNavigator() {
  Object.defineProperty(globalThis, "navigator", {
    value: realNavigator,
    configurable: true,
    writable: true,
  });
}

describe("unregisterAllServiceWorkers", () => {
  afterEach(() => {
    restoreNavigator();
  });

  it("calls unregister() on every registration and returns the count", async () => {
    const unregisterA = vi.fn(async () => true);
    const unregisterB = vi.fn(async () => true);
    installMockNavigator(async () => [
      { unregister: unregisterA },
      { unregister: unregisterB },
    ]);

    const count = await unregisterAllServiceWorkers();

    expect(unregisterA).toHaveBeenCalledTimes(1);
    expect(unregisterB).toHaveBeenCalledTimes(1);
    expect(count).toBe(2);
  });

  it("returns 0 when there are no active registrations", async () => {
    installMockNavigator(async () => []);
    expect(await unregisterAllServiceWorkers()).toBe(0);
  });

  it("swallows getRegistrations() rejection and returns 0", async () => {
    installMockNavigator(async () => {
      throw new Error("boom");
    });
    expect(await unregisterAllServiceWorkers()).toBe(0);
  });

  it("swallows an individual unregister() rejection and counts only successes", async () => {
    const goodUnregister = vi.fn(async () => true);
    const badUnregister = vi.fn(async () => {
      throw new Error("nope");
    });
    installMockNavigator(async () => [
      { unregister: goodUnregister },
      { unregister: badUnregister },
    ]);

    const count = await unregisterAllServiceWorkers();

    expect(goodUnregister).toHaveBeenCalledTimes(1);
    expect(badUnregister).toHaveBeenCalledTimes(1);
    // One success, one swallowed failure → count = 1.
    expect(count).toBe(1);
  });

  it("returns 0 when navigator.serviceWorker is unavailable", async () => {
    Object.defineProperty(globalThis, "navigator", {
      value: {},
      configurable: true,
      writable: true,
    });
    expect(await unregisterAllServiceWorkers()).toBe(0);
  });
});
