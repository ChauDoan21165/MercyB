// src/lib/__tests__/chunkLoadError.test.ts
//
// Direct unit coverage for the looksLikeChunkLoadFailure matcher. The
// matcher is consumed by both the React.lazy retry path
// (src/lib/lazyWithRetry.ts) and the global window.error /
// unhandledrejection handler in src/main.tsx, so missing a single
// browser/wording variant here means the user sees a fatal overlay
// instead of an automatic reload after a deploy.
//
// Each pattern below has its own test so a regression that drops one
// fails distinctly in the report rather than getting buried in a loop.

import { describe, expect, it } from "vitest";
import { looksLikeChunkLoadFailure } from "@/lib/chunkLoadError";

describe("looksLikeChunkLoadFailure", () => {
  it("matches Vite/Chrome: 'Failed to fetch dynamically imported module'", () => {
    const err = new TypeError(
      "Failed to fetch dynamically imported module: https://www.mercyblade.com/assets/MilestoneObserver-BVRJPM8U.js",
    );
    expect(looksLikeChunkLoadFailure(err)).toBe(true);
  });

  it("matches Safari/Firefox: 'Importing a module script failed'", () => {
    const err = new TypeError("Importing a module script failed.");
    expect(looksLikeChunkLoadFailure(err)).toBe(true);
  });

  it("matches webpack-style: 'Loading chunk N failed'", () => {
    const err = new Error("Loading chunk 42 failed.");
    expect(looksLikeChunkLoadFailure(err)).toBe(true);
  });

  it("matches webpack-style: ChunkLoadError name prefix", () => {
    const err = new Error("ChunkLoadError: Loading chunk vendor-abc failed.");
    expect(looksLikeChunkLoadFailure(err)).toBe(true);
  });

  it("matches the loose 'failed to import' wording", () => {
    const err = new Error("Failed to import script /assets/foo-XYZ.js");
    expect(looksLikeChunkLoadFailure(err)).toBe(true);
  });

  // WEB-A/F/W/P slipped through because the SPA fallback serves
  // index.html for a missing chunk URL and Safari refuses to execute
  // it as a module. The error text varies in punctuation ("'text/html'"
  // vs text/html) so we match on the canonical sub-phrase.
  it("matches Safari MIME-type fallback with quoted 'text/html'", () => {
    const err = new TypeError(
      "'text/html' is not a valid JavaScript MIME type.",
    );
    expect(looksLikeChunkLoadFailure(err)).toBe(true);
  });

  it("matches Safari MIME-type fallback without quoting", () => {
    const err = new TypeError(
      "text/html is not a valid JavaScript MIME type",
    );
    expect(looksLikeChunkLoadFailure(err)).toBe(true);
  });

  it("matches when the pattern arrives as a plain string (window.error e.message)", () => {
    expect(
      looksLikeChunkLoadFailure(
        "Uncaught (in promise) TypeError: Importing a module script failed.",
      ),
    ).toBe(true);
  });

  it("does NOT match unrelated application errors", () => {
    expect(looksLikeChunkLoadFailure(new Error("Cannot read property 'x' of undefined"))).toBe(false);
    expect(looksLikeChunkLoadFailure(new Error("Network request failed"))).toBe(false);
    expect(looksLikeChunkLoadFailure(new Error("RLS policy violated"))).toBe(false);
  });

  it("does NOT match null / undefined / empty payloads", () => {
    expect(looksLikeChunkLoadFailure(null)).toBe(false);
    expect(looksLikeChunkLoadFailure(undefined)).toBe(false);
    expect(looksLikeChunkLoadFailure("")).toBe(false);
    expect(looksLikeChunkLoadFailure({})).toBe(false);
  });
});
