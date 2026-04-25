// src/lib/offline/__tests__/offlineDetector.test.ts
//
// Step 8 (Performance) — covers the offline detector's three surfaces:
//   1. isOnline() — `navigator.onLine` wrapper with safe fallbacks
//   2. subscribeOnlineStatus() — initial-state callback + transition flow
//   3. pingOnline() — HEAD probe with timeout

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import {
  isOnline,
  pingOnline,
  subscribeOnlineStatus,
} from "../offlineDetector";

const originalOnLine = Object.getOwnPropertyDescriptor(
  window.navigator,
  "onLine",
);

function setOnLine(value: boolean): void {
  Object.defineProperty(window.navigator, "onLine", {
    configurable: true,
    get: () => value,
  });
}

afterEach(() => {
  if (originalOnLine) {
    Object.defineProperty(window.navigator, "onLine", originalOnLine);
  }
  vi.restoreAllMocks();
});

describe("isOnline", () => {
  it("returns true when navigator.onLine is true", () => {
    setOnLine(true);
    expect(isOnline()).toBe(true);
  });

  it("returns false when navigator.onLine is false", () => {
    setOnLine(false);
    expect(isOnline()).toBe(false);
  });
});

describe("subscribeOnlineStatus", () => {
  beforeEach(() => {
    setOnLine(true);
  });

  it("invokes the callback synchronously with the current state", () => {
    const cb = vi.fn();
    const unsubscribe = subscribeOnlineStatus(cb);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith(true);
    unsubscribe();
  });

  it("notifies on offline → online and online → offline transitions", () => {
    const cb = vi.fn();
    const unsubscribe = subscribeOnlineStatus(cb);
    cb.mockClear();

    window.dispatchEvent(new Event("offline"));
    expect(cb).toHaveBeenLastCalledWith(false);

    window.dispatchEvent(new Event("online"));
    expect(cb).toHaveBeenLastCalledWith(true);

    expect(cb).toHaveBeenCalledTimes(2);
    unsubscribe();
  });

  it("ignores duplicate transitions in the same direction", () => {
    const cb = vi.fn();
    const unsubscribe = subscribeOnlineStatus(cb);
    cb.mockClear();

    window.dispatchEvent(new Event("online"));
    window.dispatchEvent(new Event("online"));
    expect(cb).not.toHaveBeenCalled();

    window.dispatchEvent(new Event("offline"));
    window.dispatchEvent(new Event("offline"));
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenLastCalledWith(false);

    unsubscribe();
  });

  it("stops firing after unsubscribe", () => {
    const cb = vi.fn();
    const unsubscribe = subscribeOnlineStatus(cb);
    cb.mockClear();
    unsubscribe();

    window.dispatchEvent(new Event("offline"));
    window.dispatchEvent(new Event("online"));
    expect(cb).not.toHaveBeenCalled();
  });
});

describe("pingOnline", () => {
  beforeEach(() => {
    setOnLine(true);
  });

  it("returns false when navigator says offline (no network call)", async () => {
    setOnLine(false);
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const result = await pingOnline();
    expect(result).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns true when the HEAD request succeeds", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchSpy);
    const result = await pingOnline("/probe");
    expect(result).toBe(true);
    expect(fetchSpy).toHaveBeenCalledWith(
      "/probe",
      expect.objectContaining({ method: "HEAD", cache: "no-store" }),
    );
  });

  it("returns false when the HEAD request throws", async () => {
    const fetchSpy = vi.fn().mockRejectedValue(new Error("network down"));
    vi.stubGlobal("fetch", fetchSpy);
    expect(await pingOnline("/probe")).toBe(false);
  });

  it("returns false on non-2xx response", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 500 }));
    vi.stubGlobal("fetch", fetchSpy);
    expect(await pingOnline("/probe")).toBe(false);
  });
});
