import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRetryLoader } from "@/lib/lazyWithRetry";

const RELOAD_KEY = "__mb_chunk_reload_once__";

function makeStaleChunkError(): Error {
  return new TypeError(
    "Failed to fetch dynamically imported module: https://www.mercyblade.com/assets/MilestoneObserver-BVRJPM8U.js",
  );
}

describe("createRetryLoader", () => {
  // Recovery is now a cache-busting navigation (location.replace with a
  // fresh _cb param), NOT a plain location.reload() — embedded webviews
  // (FB in-app browser, iOS Chrome) re-serve the stale document on
  // reload(). See src/lib/chunkReload.ts. The recovery still fires
  // exactly once per session via the same one-shot sessionStorage guard.
  let replaceSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sessionStorage.clear();
    replaceSpy = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: {
        href: "http://localhost/room/english_foundation_ef11",
        replace: replaceSpy,
        reload: vi.fn(),
      },
    });
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("returns the imported module on the success path", async () => {
    const fakeComponent = () => null;
    const loader = createRetryLoader(async () => ({ default: fakeComponent }));

    await expect(loader()).resolves.toEqual({ default: fakeComponent });
    expect(replaceSpy).not.toHaveBeenCalled();
    expect(sessionStorage.getItem(RELOAD_KEY)).toBeNull();
  });

  it("cache-bust navigates once and returns a never-resolving promise on stale-chunk failure", async () => {
    const importer = vi.fn(async () => {
      throw makeStaleChunkError();
    });
    const loader = createRetryLoader(importer);

    const pending = loader();
    const settled = await Promise.race([
      pending.then(() => "resolved" as const),
      new Promise<"pending">((resolve) => setTimeout(() => resolve("pending"), 20)),
    ]);

    expect(settled).toBe("pending");
    expect(importer).toHaveBeenCalledTimes(2);
    expect(replaceSpy).toHaveBeenCalledTimes(1);
    expect(replaceSpy.mock.calls[0][0]).toMatch(/[?&]_cb=\d+/);
    expect(sessionStorage.getItem(RELOAD_KEY)).toBe("1");
  });

  it("retries a stale-chunk import once before triggering recovery", async () => {
    const fakeComponent = () => null;
    const importer = vi
      .fn()
      .mockRejectedValueOnce(makeStaleChunkError())
      .mockResolvedValueOnce({ default: fakeComponent });
    const loader = createRetryLoader(importer);

    await expect(loader()).resolves.toEqual({ default: fakeComponent });
    expect(importer).toHaveBeenCalledTimes(2);
    expect(replaceSpy).not.toHaveBeenCalled();
    expect(sessionStorage.getItem(RELOAD_KEY)).toBeNull();
  });

  it("does not recover a second time within the same session — rethrows instead", async () => {
    sessionStorage.setItem(RELOAD_KEY, "1");
    const importer = vi.fn(async () => {
      throw makeStaleChunkError();
    });
    const loader = createRetryLoader(importer);

    await expect(loader()).rejects.toThrow(/Failed to fetch dynamically/i);
    expect(importer).toHaveBeenCalledTimes(2);
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("rethrows non-chunk errors without touching recovery or sessionStorage", async () => {
    const importer = vi.fn(async () => {
      throw new Error("Some application bug, not a chunk load");
    });
    const loader = createRetryLoader(importer);

    await expect(loader()).rejects.toThrow(/application bug/);
    expect(replaceSpy).not.toHaveBeenCalled();
    expect(sessionStorage.getItem(RELOAD_KEY)).toBeNull();
  });

  it("clears a previously-set reload mark on a successful chunk load", async () => {
    // A prior stale-chunk recovery this session left the one-shot set.
    sessionStorage.setItem(RELOAD_KEY, "1");
    const fakeComponent = () => null;
    const loader = createRetryLoader(async () => ({ default: fakeComponent }));

    await expect(loader()).resolves.toEqual({ default: fakeComponent });
    // Clean load proves HTML/chunk hashes are consistent again → reset the
    // one-shot so a later deploy in this session can recover too.
    expect(sessionStorage.getItem(RELOAD_KEY)).toBeNull();
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("also clears the Tier-2 (ErrorBoundary) mark on a successful chunk load", async () => {
    sessionStorage.setItem(RELOAD_KEY, "1");
    sessionStorage.setItem("__mb_chunk_eb_reload_once__", "1");
    const loader = createRetryLoader(async () => ({ default: () => null }));

    await expect(loader()).resolves.toBeTruthy();
    // A clean load re-arms the WHOLE ladder for a later deploy this session.
    expect(sessionStorage.getItem(RELOAD_KEY)).toBeNull();
    expect(sessionStorage.getItem("__mb_chunk_eb_reload_once__")).toBeNull();
  });

  it("re-arms recovery: success-then-stale-chunk recovers again (later deploy in same session)", async () => {
    // Session already spent its first recovery on an earlier deploy.
    sessionStorage.setItem(RELOAD_KEY, "1");

    // Post-reload boot: a chunk loads cleanly → mark is cleared.
    const ok = createRetryLoader(async () => ({ default: () => null }));
    await expect(ok()).resolves.toBeTruthy();
    expect(sessionStorage.getItem(RELOAD_KEY)).toBeNull();

    // A NEW deploy ships; the user navigates to a now-stale lazy route.
    const stale = createRetryLoader(async () => {
      throw makeStaleChunkError();
    });
    void stale();
    await Promise.resolve();
    await Promise.resolve();

    // Recovery is re-armed: it cache-bust navigates again instead of
    // crashing into the ErrorBoundary, and re-sets the one-shot.
    expect(replaceSpy).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem(RELOAD_KEY)).toBe("1");
  });

  it("supports the .then(m => ({ default: m.X })) factory shape (main.tsx toasters)", async () => {
    sessionStorage.setItem(RELOAD_KEY, "1");
    const Named = () => null;
    const loader = createRetryLoader(() =>
      Promise.resolve({ Toaster: Named }).then((m) => ({ default: m.Toaster })),
    );

    await expect(loader()).resolves.toEqual({ default: Named });
    expect(sessionStorage.getItem(RELOAD_KEY)).toBeNull();
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("matches all chunk-load error message variants Vite/browsers emit", async () => {
    const variants = [
      "Failed to fetch dynamically imported module",
      "Importing a module script failed",
      "Loading chunk 42 failed",
      "ChunkLoadError: something",
    ];

    for (const message of variants) {
      sessionStorage.clear();
      replaceSpy.mockClear();
      const loader = createRetryLoader(async () => {
        throw new Error(message);
      });

      // Don't await — the loader returns a never-resolving promise on a
      // recognised chunk error. Yield so both the retry and recovery
      // branches run.
      void loader();
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(replaceSpy, `variant: ${message}`).toHaveBeenCalledTimes(1);
    }
  });
});
