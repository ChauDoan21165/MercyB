import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRetryLoader } from "@/lib/lazyWithRetry";
import { ChunkLoadRecoveryError } from "@/lib/chunkLoadError";

const RELOAD_KEY = "__mb_chunk_reload_once__";
const SCOPED_RELOAD_PREFIX = `${RELOAD_KEY}:`;

function makeStaleChunkError(): Error {
  return new TypeError(
    "Failed to fetch dynamically imported module: https://www.mercyblade.com/assets/MilestoneObserver-BVRJPM8U.js",
  );
}

function makeStalePricingChunkError(): Error {
  return new TypeError(
    "Failed to fetch dynamically imported module: https://www.mercyblade.com/assets/Pricing-CSa0EAu2.js",
  );
}

function makeStaleNamedExportError(): Error {
  return new TypeError("Cannot read properties of undefined (reading 'MilestoneObserver')");
}

function scopedReloadKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < sessionStorage.length; i += 1) {
    const key = sessionStorage.key(i);
    if (key?.startsWith(SCOPED_RELOAD_PREFIX)) keys.push(key);
  }
  return keys;
}

async function flushRecoveryNavigation(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
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
    expect(scopedReloadKeys()).toHaveLength(2);
    expect(scopedReloadKeys().some((key) => sessionStorage.getItem(key) === "1")).toBe(true);
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
    expect(scopedReloadKeys()).toHaveLength(0);
  });

  it("recovers when a stale lazy module resolves without the expected named export", async () => {
    const importer = vi.fn(async () => {
      throw makeStaleNamedExportError();
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
    expect(scopedReloadKeys()).toHaveLength(2);
    expect(scopedReloadKeys().some((key) => sessionStorage.getItem(key) === "1")).toBe(true);
  });

  it("retries named-export lazy module resolution once before triggering recovery", async () => {
    const fakeComponent = () => null;
    const importer = vi
      .fn()
      .mockRejectedValueOnce(makeStaleNamedExportError())
      .mockResolvedValueOnce({ default: fakeComponent });
    const loader = createRetryLoader(importer);

    await expect(loader()).resolves.toEqual({ default: fakeComponent });
    expect(importer).toHaveBeenCalledTimes(2);
    expect(replaceSpy).not.toHaveBeenCalled();
    expect(scopedReloadKeys()).toHaveLength(0);
  });

  it("does not recover a second time within the same session — throws typed chunk recovery error", async () => {
    const importer = vi.fn(async () => {
      throw makeStaleChunkError();
    });
    const loader = createRetryLoader(importer);

    void loader();
    await flushRecoveryNavigation();
    replaceSpy.mockClear();
    importer.mockClear();

    await expect(loader()).rejects.toMatchObject({
      name: "ChunkLoadRecoveryError",
      cause: expect.any(TypeError),
    });
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
    const fakeComponent = () => null;
    const importer = vi
      .fn()
      .mockRejectedValueOnce(makeStaleChunkError())
      .mockRejectedValueOnce(makeStaleChunkError())
      .mockResolvedValueOnce({ default: fakeComponent });
    const loader = createRetryLoader(importer);

    void loader();
    await flushRecoveryNavigation();
    expect(scopedReloadKeys()).toHaveLength(2);

    await expect(loader()).resolves.toEqual({ default: fakeComponent });
    expect(scopedReloadKeys()).toHaveLength(0);
    expect(replaceSpy).toHaveBeenCalledTimes(1);
  });

  it("also clears the Tier-2 (ErrorBoundary) mark on a successful chunk load", async () => {
    sessionStorage.setItem("__mb_chunk_eb_reload_once__", "1");
    const loader = createRetryLoader(async () => ({ default: () => null }));

    await expect(loader()).resolves.toBeTruthy();
    expect(sessionStorage.getItem("__mb_chunk_eb_reload_once__")).toBeNull();
  });

  it("re-arms recovery: success-then-stale-chunk recovers again (later deploy in same session)", async () => {
    const firstDeploy = createRetryLoader(async () => {
      throw makeStaleChunkError();
    });
    void firstDeploy();
    await flushRecoveryNavigation();
    expect(replaceSpy).toHaveBeenCalledTimes(1);

    replaceSpy.mockClear();

    // A later deploy ships a different chunk URL. It gets its own scoped
    // recovery even though the earlier failed chunk remains marked.
    const laterDeploy = createRetryLoader(async () => {
      throw makeStalePricingChunkError();
    });
    void laterDeploy();
    await flushRecoveryNavigation();

    expect(replaceSpy).toHaveBeenCalledTimes(1);
    expect(scopedReloadKeys().filter((key) => sessionStorage.getItem(key) === "1").length).toBeGreaterThanOrEqual(2);
  });

  it("does not re-arm a broken chunk after an unrelated lazy import succeeds", async () => {
    const pricingImporter = vi.fn(async () => {
      throw makeStalePricingChunkError();
    });
    const pricingLoader = createRetryLoader(pricingImporter);

    void pricingLoader();
    await flushRecoveryNavigation();
    expect(replaceSpy).toHaveBeenCalledTimes(1);

    const unrelatedLoader = createRetryLoader(async () => ({ default: () => null }));
    await expect(unrelatedLoader()).resolves.toBeTruthy();

    replaceSpy.mockClear();
    pricingImporter.mockClear();

    await expect(pricingLoader()).rejects.toMatchObject({
      name: "ChunkLoadRecoveryError",
      cause: expect.any(TypeError),
    });
    expect(pricingImporter).toHaveBeenCalledTimes(2);
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("supports the .then(m => ({ default: m.X })) factory shape (main.tsx toasters)", async () => {
    sessionStorage.setItem(RELOAD_KEY, "1");
    const Named = () => null;
    const loader = createRetryLoader(() =>
      Promise.resolve({ Toaster: Named }).then((m) => ({ default: m.Toaster })),
    );

    await expect(loader()).resolves.toEqual({ default: Named });
    expect(scopedReloadKeys()).toHaveLength(0);
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
      await flushRecoveryNavigation();

      expect(replaceSpy, `variant: ${message}`).toHaveBeenCalledTimes(1);
    }
  });
});
