/**
 * Public API — sliding-window rate limit math.
 *
 * Storage model: every successful request adds a row to
 * `api_request_logs` with `created_at = now()`. To check the limit
 * for a key, we count rows whose `created_at` falls inside the
 * `[now - windowMs, now)` interval. If count >= limit, the request
 * is rejected with HTTP 429.
 *
 * This module is the pure-math layer — no Supabase imports, no I/O.
 * The edge function reads the rows and feeds them into `evaluateRateLimit`,
 * keeping the test surface free of database dependencies.
 *
 * Why sliding window over fixed window: a fixed window (e.g. "max
 * 1000 per hour, reset at the top of the hour") lets a developer burst
 * 2000 requests across the boundary. Sliding window doesn't have that
 * pothole. The cost is one timestamp comparison per recorded request,
 * which Postgres handles in O(log n) on the (key_id, created_at) index.
 */

/** Default budget for an unscoped key — one request per ~3.6 seconds on average. */
export const DEFAULT_RATE_LIMIT_PER_HOUR = 1000;
/** Window length for the default bucket. */
export const DEFAULT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export type RateLimitConfig = {
  /** Maximum number of requests allowed inside the window. */
  limit: number;
  /** Window length in ms. */
  windowMs: number;
};

export const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  limit: DEFAULT_RATE_LIMIT_PER_HOUR,
  windowMs: DEFAULT_RATE_LIMIT_WINDOW_MS,
};

export type RateLimitVerdict =
  | {
      allowed: true;
      remaining: number;
      /** ms until the oldest request in the window expires — when the budget refreshes by 1. */
      resetMs: number;
    }
  | {
      allowed: false;
      remaining: 0;
      /** ms until the budget refreshes by 1 (= when the oldest in-window timestamp falls out). */
      retryAfterMs: number;
    };

/**
 * Evaluate whether a new request should be allowed, given the
 * timestamps (ms-since-epoch) of every prior request the caller has
 * made within the relevant window. The list is filtered against
 * `[now - windowMs, now)` here so callers can pass in the raw query
 * result without pre-filtering.
 *
 * @param requestTimestamps  Prior request times in any order.
 * @param now                "now" timestamp in ms-since-epoch.
 * @param config             Limit + window.
 */
export function evaluateRateLimit(
  requestTimestamps: readonly number[],
  now: number,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT,
): RateLimitVerdict {
  const cutoff = now - config.windowMs;
  // Filter to in-window only; the caller may have passed older rows.
  const inWindow = requestTimestamps.filter((t) => t >= cutoff && t < now);

  if (inWindow.length < config.limit) {
    const oldestInWindow = inWindow.length === 0 ? now : Math.min(...inWindow);
    const resetMs = Math.max(0, oldestInWindow + config.windowMs - now);
    return {
      allowed: true,
      remaining: config.limit - inWindow.length - 1,
      resetMs,
    };
  }

  // Over budget — compute when the oldest in-window request rolls off,
  // which is when one slot becomes available again.
  const oldestInWindow = Math.min(...inWindow);
  const retryAfterMs = Math.max(1, oldestInWindow + config.windowMs - now);
  return { allowed: false, remaining: 0, retryAfterMs };
}

/**
 * Convenience: shape the verdict into an `X-RateLimit-*` header bundle
 * matching the de-facto convention (Stripe, GitHub, Twitter all use the
 * same names). The edge-function caller spreads this into Response init.
 */
export function rateLimitHeaders(
  verdict: RateLimitVerdict,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT,
): Record<string, string> {
  const limitStr = String(config.limit);
  if (verdict.allowed) {
    return {
      "X-RateLimit-Limit": limitStr,
      "X-RateLimit-Remaining": String(verdict.remaining),
      "X-RateLimit-Reset": String(Math.ceil(verdict.resetMs / 1000)),
    };
  }
  return {
    "X-RateLimit-Limit": limitStr,
    "X-RateLimit-Remaining": "0",
    "X-RateLimit-Reset": String(Math.ceil(verdict.retryAfterMs / 1000)),
    "Retry-After": String(Math.ceil(verdict.retryAfterMs / 1000)),
  };
}
