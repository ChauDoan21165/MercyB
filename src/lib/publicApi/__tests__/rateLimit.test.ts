import { describe, expect, it } from "vitest";

import {
  DEFAULT_RATE_LIMIT,
  evaluateRateLimit,
  rateLimitHeaders,
} from "../rateLimit";

const HOUR_MS = 60 * 60 * 1000;
const NOW = 1_700_000_000_000; // arbitrary fixed "now" for deterministic tests

describe("evaluateRateLimit — sliding window math", () => {
  it("allows the first request when no history exists", () => {
    const v = evaluateRateLimit([], NOW);
    expect(v.allowed).toBe(true);
    if (v.allowed) {
      expect(v.remaining).toBe(DEFAULT_RATE_LIMIT.limit - 1);
    }
  });

  it("allows the limit-th request and reports remaining = 0 then", () => {
    const config = { limit: 3, windowMs: HOUR_MS };
    const v = evaluateRateLimit([NOW - 1000, NOW - 2000], NOW, config);
    expect(v.allowed).toBe(true);
    if (v.allowed) {
      expect(v.remaining).toBe(0);
    }
  });

  it("blocks the (limit + 1)-th request", () => {
    const config = { limit: 3, windowMs: HOUR_MS };
    const v = evaluateRateLimit(
      [NOW - 1000, NOW - 2000, NOW - 3000],
      NOW,
      config,
    );
    expect(v.allowed).toBe(false);
    if (!v.allowed) {
      expect(v.remaining).toBe(0);
      expect(v.retryAfterMs).toBeGreaterThan(0);
    }
  });

  it("ignores timestamps older than the window — sliding behaviour", () => {
    const config = { limit: 2, windowMs: HOUR_MS };
    // 2 requests just outside the window + 1 inside → only 1 counts → allow.
    const v = evaluateRateLimit(
      [NOW - HOUR_MS - 1, NOW - HOUR_MS - 2, NOW - 60_000],
      NOW,
      config,
    );
    expect(v.allowed).toBe(true);
  });

  it("reset time = ms until the oldest in-window request rolls off", () => {
    const config = { limit: 5, windowMs: HOUR_MS };
    const oldest = NOW - 30 * 60 * 1000; // 30 minutes ago
    const v = evaluateRateLimit([oldest], NOW, config);
    expect(v.allowed).toBe(true);
    if (v.allowed) {
      // Window length 60 min, oldest was 30 min ago → reset in ~30 min.
      expect(v.resetMs).toBeCloseTo(30 * 60 * 1000, -3);
    }
  });

  it("retryAfter is at least 1 ms even at the boundary", () => {
    const config = { limit: 1, windowMs: HOUR_MS };
    // Exactly at-the-edge oldest request — retryAfter must be > 0.
    const v = evaluateRateLimit([NOW - HOUR_MS + 1], NOW, config);
    expect(v.allowed).toBe(false);
    if (!v.allowed) {
      expect(v.retryAfterMs).toBeGreaterThanOrEqual(1);
    }
  });

  it("treats timestamps exactly at `now` as future and excludes them", () => {
    // Pathological case — if a timestamp equals `now`, we exclude it
    // (the row hasn't been logged yet from this request's perspective).
    const config = { limit: 1, windowMs: HOUR_MS };
    const v = evaluateRateLimit([NOW], NOW, config);
    expect(v.allowed).toBe(true);
  });
});

describe("rateLimitHeaders", () => {
  it("returns X-RateLimit-* on allow", () => {
    const v = evaluateRateLimit([], NOW, { limit: 100, windowMs: HOUR_MS });
    const h = rateLimitHeaders(v, { limit: 100, windowMs: HOUR_MS });
    expect(h["X-RateLimit-Limit"]).toBe("100");
    expect(h["X-RateLimit-Remaining"]).toBe("99");
    expect(Number(h["X-RateLimit-Reset"])).toBeGreaterThanOrEqual(0);
    expect(h["Retry-After"]).toBeUndefined();
  });

  it("returns Retry-After on deny", () => {
    const config = { limit: 1, windowMs: HOUR_MS };
    const v = evaluateRateLimit([NOW - 60_000], NOW, config);
    const h = rateLimitHeaders(v, config);
    expect(h["X-RateLimit-Limit"]).toBe("1");
    expect(h["X-RateLimit-Remaining"]).toBe("0");
    expect(Number(h["Retry-After"])).toBeGreaterThan(0);
  });
});
