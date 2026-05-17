import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRetryLoader } from "@/lib/lazyWithRetry";

const RELOAD_KEY = "__mb_chunk_reload_once__";

function makeStaleChunkError(): Error {
  return new TypeError(
    "Failed to fetch dynamically imported module: https://www.mercyblade.com/assets/MilestoneObserver-BVRJPM8U.js",
  );
}

describe("createRetryLoader", () => {
  let reloadSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sessionStorage.clear();
    reloadSpy = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: { ...window.location, reload: reloadSpy },
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
    expect(reloadSpy).not.toHaveBeenCalled();
    expect(sessionStorage.getItem(RELOAD_KEY)).toBeNull();
  });

  it("reloads once and returns a never-resolving promise on stale-chunk failure", async () => {
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
    expect(reloadSpy).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem(RELOAD_KEY)).toBe("1");
  });

  it("does not reload a second time within the same session — rethrows instead", async () => {
    sessionStorage.setItem(RELOAD_KEY, "1");
    const importer = vi.fn(async () => {
      throw makeStaleChunkError();
    });
    const loader = createRetryLoader(importer);

    await expect(loader()).rejects.toThrow(/Failed to fetch dynamically/i);
    expect(reloadSpy).not.toHaveBeenCalled();
  });

  it("rethrows non-chunk errors without touching reload or sessionStorage", async () => {
    const importer = vi.fn(async () => {
      throw new Error("Some application bug, not a chunk load");
    });
    const loader = createRetryLoader(importer);

    await expect(loader()).rejects.toThrow(/application bug/);
    expect(reloadSpy).not.toHaveBeenCalled();
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
    expect(reloadSpy).not.toHaveBeenCalled();
  });

  it("re-arms recovery: success-then-stale-chunk reloads again (later deploy in same session)", async () => {
    // Session already spent its first reload on an earlier deploy.
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

    // Recovery is re-armed: it reloads again instead of crashing into the
    // ErrorBoundary, and re-sets the one-shot for loop protection.
    expect(reloadSpy).toHaveBeenCalledTimes(1);
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
    expect(reloadSpy).not.toHaveBeenCalled();
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
      reloadSpy.mockClear();
      const loader = createRetryLoader(async () => {
        throw new Error(message);
      });

      // Don't await — the loader returns a never-resolving promise on a
      // recognised chunk error. Yield once so the catch branch runs.
      void loader();
      await Promise.resolve();
      await Promise.resolve();

      expect(reloadSpy, `variant: ${message}`).toHaveBeenCalledTimes(1);
    }
  });
});
