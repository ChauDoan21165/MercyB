/**
 * Client-side Rate Limiting Middleware
 * Prevents abuse of API endpoints
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check if request is rate limited
 */
export const checkRateLimit = (
  key: string,
  config: RateLimitConfig
): { allowed: boolean; retryAfter?: number } => {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now >= entry.resetAt) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + config.windowMs,
    });
    return { allowed: true };
  }

  if (entry.count >= config.maxRequests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);
  return { allowed: true };
};

/**
 * Rate limit presets
 */
export const RATE_LIMITS = {
  CHAT_MESSAGE: { maxRequests: 30, windowMs: 60000 }, // 30 per minute
  ROOM_LOAD: { maxRequests: 60, windowMs: 60000 }, // 60 per minute
  SEARCH: { maxRequests: 100, windowMs: 60000 }, // 100 per minute
  ADMIN_ACTION: { maxRequests: 20, windowMs: 60000 }, // 20 per minute
  AUDIO_PLAY: { maxRequests: 50, windowMs: 60000 }, // 50 per minute
};

/**
 * Clean up expired entries
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

// Lazy cleanup - only starts when module is actively used
let cleanupIntervalStarted = false;
export function ensureRateLimiterCleanup(): void {
  if (typeof window !== 'undefined' && !cleanupIntervalStarted) {
    cleanupIntervalStarted = true;
    setInterval(cleanupExpiredEntries, 60000);
  }
}