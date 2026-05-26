import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CHUNK_CACHE_BUST_PARAM,
  CHUNK_RELOAD_KEY,
  CHUNK_EB_RELOAD_KEY,
  cacheBustingReload,
  stripChunkCacheBustParam,
  hasErrorBoundaryReloaded,
  markErrorBoundaryReloaded,
  clearChunkRecoveryMarks,
} from "@/lib/chunkReload";

function mockLocation(href: string) {
  const replace = vi.fn();
  const reload = vi.fn();
  Object.defineProperty(window, "location", {
    configurable: true,
    writable: true,
    value: { href, replace, reload },
  });
  return { replace, reload };
}

describe("cacheBustingReload", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("navigates via location.replace with a fresh _cb param (not reload)", () => {
    const { replace, reload } = mockLocation("http://localhost/onboarding");

    cacheBustingReload(() => 1234567890);

    expect(reload).not.toHaveBeenCalled();
    expect(replace).toHaveBeenCalledTimes(1);
    const target = replace.mock.calls[0][0] as string;
    const u = new URL(target);
    expect(u.pathname).toBe("/onboarding");
    expect(u.searchParams.get(CHUNK_CACHE_BUST_PARAM)).toBe("1234567890");
  });

  it("preserves the existing path + query string", () => {
    const { replace } = mockLocation(
      "http://localhost/room/english_foundation_ef11?foo=1",
    );

    cacheBustingReload(() => 42);

    const u = new URL(replace.mock.calls[0][0] as string);
    expect(u.pathname).toBe("/room/english_foundation_ef11");
    expect(u.searchParams.get("foo")).toBe("1");
    expect(u.searchParams.get(CHUNK_CACHE_BUST_PARAM)).toBe("42");
  });

  it("falls back to a plain reload when replace throws (ancient webview)", () => {
    const reload = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: {
        href: "http://localhost/",
        replace: vi.fn(() => {
          throw new Error("navigation blocked");
        }),
        reload,
      },
    });

    cacheBustingReload();

    expect(reload).toHaveBeenCalledTimes(1);
  });
});

describe("stripChunkCacheBustParam", () => {
  let replaceState: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    replaceState = vi
      .spyOn(window.history, "replaceState")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("removes only the _cb param and keeps the rest of the URL", () => {
    mockLocation("http://localhost/onboarding?_cb=999&x=1#frag");

    stripChunkCacheBustParam();

    expect(replaceState).toHaveBeenCalledTimes(1);
    const next = replaceState.mock.calls[0][2] as string;
    expect(next).toBe("/onboarding?x=1#frag");
  });

  it("is a no-op when no _cb param is present", () => {
    mockLocation("http://localhost/room/x?y=2");

    stripChunkCacheBustParam();

    expect(replaceState).not.toHaveBeenCalled();
  });
});

describe("chunk recovery session marks", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });
  afterEach(() => {
    sessionStorage.clear();
  });

  it("ErrorBoundary (Tier-2) one-shot read/mark round-trips", () => {
    expect(hasErrorBoundaryReloaded()).toBe(false);
    markErrorBoundaryReloaded();
    expect(hasErrorBoundaryReloaded()).toBe(true);
    expect(sessionStorage.getItem(CHUNK_EB_RELOAD_KEY)).toBe("1");
  });

  it("clearChunkRecoveryMarks clears BOTH the Tier-1 and Tier-2 marks", () => {
    sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
    sessionStorage.setItem(CHUNK_EB_RELOAD_KEY, "1");

    clearChunkRecoveryMarks();

    expect(sessionStorage.getItem(CHUNK_RELOAD_KEY)).toBeNull();
    expect(sessionStorage.getItem(CHUNK_EB_RELOAD_KEY)).toBeNull();
  });
});
