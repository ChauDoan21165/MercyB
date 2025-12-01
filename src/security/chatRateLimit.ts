// Chat Rate Limiting - Prevent message spam

interface RateLimitEntry {
  count: number;
  windowStart: number;
  warned: boolean;
}

const rateLimits = new Map<string, RateLimitEntry>();

const MAX_MESSAGES = 10;
const WINDOW_MS = 20000; // 20 seconds
const WARNING_THRESHOLD = 8;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  warning: boolean;
  message?: string;
}

/**
 * Check if user can send message (rate limit)
 */
export function checkChatRateLimit(userId: string): RateLimitResult {
  const now = Date.now();
  const entry = rateLimits.get(userId);

  // No entry yet - allow
  if (!entry) {
    rateLimits.set(userId, {
      count: 1,
      windowStart: now,
      warned: false,
    });

    return {
      allowed: true,
      remaining: MAX_MESSAGES - 1,
      warning: false,
    };
  }

  const elapsed = now - entry.windowStart;

  // Reset window if expired
  if (elapsed >= WINDOW_MS) {
    rateLimits.set(userId, {
      count: 1,
      windowStart: now,
      warned: false,
    });

    return {
      allowed: true,
      remaining: MAX_MESSAGES - 1,
      warning: false,
    };
  }

  // Check if at limit
  if (entry.count >= MAX_MESSAGES) {
    const retryAfter = Math.ceil((WINDOW_MS - elapsed) / 1000);

    return {
      allowed: false,
      remaining: 0,
      warning: false,
      message: `You're sending messages too quickly. Please wait ${retryAfter} seconds.`,
    };
  }

  // Increment count
  entry.count++;
  rateLimits.set(userId, entry);

  // Soft warning at threshold
  if (entry.count >= WARNING_THRESHOLD && !entry.warned) {
    entry.warned = true;
    rateLimits.set(userId, entry);

    return {
      allowed: true,
      remaining: MAX_MESSAGES - entry.count,
      warning: true,
      message: 'You are sending messages quickly. Please slow down to avoid being blocked.',
    };
  }

  return {
    allowed: true,
    remaining: MAX_MESSAGES - entry.count,
    warning: false,
  };
}

/**
 * Reset rate limit for user (admin override)
 */
export function resetChatRateLimit(userId: string): void {
  rateLimits.delete(userId);
}

/**
 * Clean up expired entries
 */
export function cleanupChatRateLimits(): void {
  const now = Date.now();
  const maxAge = WINDOW_MS * 2;

  for (const [userId, entry] of rateLimits.entries()) {
    if (now - entry.windowStart > maxAge) {
      rateLimits.delete(userId);
    }
  }
}

// Clean up every minute
if (typeof window !== 'undefined') {
  setInterval(cleanupChatRateLimits, 60000);
}
