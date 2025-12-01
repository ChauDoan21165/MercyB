import { supabase } from "@/integrations/supabase/client";
import { logger } from "./logger";

/**
 * Global Client-Side Rate Limiter
 * 
 * Provides rate limiting for API calls to prevent abuse and improve stability.
 * Uses localStorage for tracking request counts within time windows.
 * 
 * Usage:
 * const limiter = new RateLimiter({ maxRequests: 20, windowMs: 60000 });
 * 
 * if (await limiter.checkLimit("api-call")) {
 *   // Make API call
 * } else {
 *   // Show rate limit error
 * }
 */

interface RateLimitConfig {
  maxRequests: number; // Max requests allowed
  windowMs: number; // Time window in milliseconds
  storageKey?: string; // Optional custom storage key
}

interface RateLimitRecord {
  count: number;
  windowStart: number;
}

export class RateLimiter {
  private config: RateLimitConfig;
  private storagePrefix = "rate_limit:";

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Check if request is within rate limit
   * Returns true if request is allowed, false if limit exceeded
   */
  async checkLimit(identifier: string, userId?: string): Promise<boolean> {
    const key = this.getStorageKey(identifier, userId);
    const now = Date.now();

    try {
      // Get current record from localStorage
      const stored = localStorage.getItem(key);
      let record: RateLimitRecord = stored 
        ? JSON.parse(stored)
        : { count: 0, windowStart: now };

      // Check if we're in a new window
      if (now - record.windowStart >= this.config.windowMs) {
        // Start new window
        record = { count: 1, windowStart: now };
        localStorage.setItem(key, JSON.stringify(record));
        return true;
      }

      // Check if limit exceeded
      if (record.count >= this.config.maxRequests) {
        logger.warn("Rate limit exceeded", {
          scope: "RateLimiter",
          identifier,
          userId,
          count: record.count,
          maxRequests: this.config.maxRequests,
        });
        return false;
      }

      // Increment count
      record.count++;
      localStorage.setItem(key, JSON.stringify(record));
      return true;
    } catch (error) {
      // If localStorage fails, allow request (fail open)
      logger.error("Rate limiter storage error", {
        scope: "RateLimiter",
        error: error instanceof Error ? error.message : String(error),
      });
      return true;
    }
  }

  /**
   * Get remaining requests in current window
   */
  getRemaining(identifier: string, userId?: string): number {
    const key = this.getStorageKey(identifier, userId);
    const now = Date.now();

    try {
      const stored = localStorage.getItem(key);
      if (!stored) return this.config.maxRequests;

      const record: RateLimitRecord = JSON.parse(stored);

      // Check if window expired
      if (now - record.windowStart >= this.config.windowMs) {
        return this.config.maxRequests;
      }

      return Math.max(0, this.config.maxRequests - record.count);
    } catch {
      return this.config.maxRequests;
    }
  }

  /**
   * Reset rate limit for identifier
   */
  reset(identifier: string, userId?: string) {
    const key = this.getStorageKey(identifier, userId);
    localStorage.removeItem(key);
  }

  private getStorageKey(identifier: string, userId?: string): string {
    const userPart = userId || "anonymous";
    return `${this.storagePrefix}${identifier}:${userPart}`;
  }
}

// Pre-configured rate limiters for common use cases
export const publicApiLimiter = new RateLimiter({
  maxRequests: 20,
  windowMs: 60_000, // 20 requests per minute
});

export const authenticatedLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60_000, // 100 requests per minute
});

export const adminLimiter = new RateLimiter({
  maxRequests: 300,
  windowMs: 60_000, // 300 requests per minute
});

/**
 * Check rate limit for current user based on their authentication status
 */
export async function checkUserRateLimit(identifier: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Check if admin
    if (user) {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleData) {
        return await adminLimiter.checkLimit(identifier, user.id);
      }
    }

    // Authenticated user
    if (user) {
      return await authenticatedLimiter.checkLimit(identifier, user.id);
    }

    // Anonymous user
    return await publicApiLimiter.checkLimit(identifier);
  } catch (error) {
    // If auth check fails, use public limiter
    logger.error("Rate limit auth check failed", {
      scope: "RateLimiter",
      error: error instanceof Error ? error.message : String(error),
    });
    return await publicApiLimiter.checkLimit(identifier);
  }
}
