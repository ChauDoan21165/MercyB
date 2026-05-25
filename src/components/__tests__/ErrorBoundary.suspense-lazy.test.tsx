/**
 * Regression test for Issue #1127.
 *
 * Exercises the same React 18 lifecycle the prod chunk leak hit: a
 * React.lazy() whose loader's Promise rejects with a chunk-load
 * TypeError, mounted inside a Suspense + ErrorBoundary. Verifies the
 * boundary takes the chunk-recovery branch end-to-end (not the default
 * "RAW thrown value" dump).
 *
 * The companion `ErrorBoundary.test.tsx` already tests the SYNCHRONOUS
 * throw path. This file specifically covers the Promise-rejection path
 * — the one that fed Sentry MERCYBLADE-WEB-F.
 *
 * Note: the prod divergence between getDerivedStateFromError (matcher
 * → true) and componentDidCatch (matcher → false) is NOT reproducible
 * in jsdom — synthetic Suspense+lazy+rejection passes both
 * lifecycle methods cleanly on every variant tried. The fix (Issue
 * #1127) makes the boundary read its already-computed isChunkError
 * from state instead of re-running the matcher, eliminating the
 * divergence by construction regardless of the underlying React 18
 * mechanism. This test guards the post-fix behavior.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import React from "react";

import { ErrorBoundary } from "../ErrorBoundary";

const EB_KEY = "__mb_chunk_eb_reload_once__";

function makeChunkRejection(): TypeError {
  return new TypeError(
    "Failed to fetch dynamically imported module: https://mercyblade.com/assets/GlobalNavigationShortcuts-vsVtnjEg.js",
  );
}

describe("ErrorBoundary — Suspense + React.lazy() + rejected import (Issue #1127)", () => {
  let errSpy: ReturnType<typeof vi.spyOn>;
  let groupSpy: ReturnType<typeof vi.spyOn>;
  let groupEndSpy: ReturnType<typeof vi.spyOn>;
  let replaceSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sessionStorage.clear();
    errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    groupSpy = vi.spyOn(console, "group").mockImplementation(() => {});
    groupEndSpy = vi.spyOn(console, "groupEnd").mockImplementation(() => {});
    replaceSpy = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: {
        href: "http://localhost/tiers",
        replace: replaceSpy,
        reload: vi.fn(),
      },
    });
  });

  afterEach(() => {
    errSpy.mockRestore();
    groupSpy.mockRestore();
    groupEndSpy.mockRestore();
    sessionStorage.clear();
  });

  it("takes the chunk-recovery branch when a lazy() Promise rejects with a chunk-load TypeError", async () => {
    // React.lazy whose loader returns a Promise that rejects on the
    // next microtask — close to the prod failure mode (chunk URL 404 →
    // fetch fails → import() rejects → React.lazy rethrows on next
    // render attempt → boundary catches).
    const FailingLazy = React.lazy(
      () =>
        new Promise<{ default: React.ComponentType }>((_, reject) => {
          queueMicrotask(() => reject(makeChunkRejection()));
        }),
    );

    await act(async () => {
      render(
        <ErrorBoundary>
          <React.Suspense fallback={<div data-testid="loading">loading</div>}>
            <FailingLazy />
          </React.Suspense>
        </ErrorBoundary>,
      );
      // Flush the rejection + React's re-render cycle.
      await Promise.resolve();
      await Promise.resolve();
      await new Promise((r) => setTimeout(r, 0));
    });

    // BEHAVIORAL ASSERTION:
    // If componentDidCatch took the chunk-recovery branch, the calm VI
    // screen renders. If it took the default branch, the dark dump renders.
    // This assertion fails on `main` (Issue #1127) and passes on the fix.
    const calm = await screen.findByText("Đang cập nhật Mercy Blade");
    expect(calm).toBeInTheDocument();
    expect(screen.queryByText("Đã xảy ra lỗi")).not.toBeInTheDocument();
  });

  it("escalates the cache-bust reload once (Tier-2) on the lazy-rejection path", async () => {
    vi.useFakeTimers();
    try {
      const FailingLazy = React.lazy(
        () =>
          new Promise<{ default: React.ComponentType }>((_, reject) => {
            queueMicrotask(() => reject(makeChunkRejection()));
          }),
      );

      await act(async () => {
        render(
          <ErrorBoundary>
            <React.Suspense fallback={null}>
              <FailingLazy />
            </React.Suspense>
          </ErrorBoundary>,
        );
        await Promise.resolve();
        await Promise.resolve();
        await vi.advanceTimersByTimeAsync(0);
      });

      // Sanity: calm screen present (the chunk branch fired).
      expect(screen.queryByText("Đang cập nhật Mercy Blade")).toBeInTheDocument();

      // Tier-2 cache-bust deferred 600 ms.
      await act(async () => {
        await vi.advanceTimersByTimeAsync(700);
      });
      expect(replaceSpy).toHaveBeenCalledTimes(1);
      expect(sessionStorage.getItem(EB_KEY)).toBe("1");
    } finally {
      vi.useRealTimers();
    }
  });
});
