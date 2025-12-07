/**
 * Client-side rate limiting for chat, login, and API calls
 * Server-side enforcement happens in Edge Functions
 */

import { logger } from '@/lib/logger';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  burstLimit?: number;
}

interface RateLimitEntry {
  count: number;
  windowStart: number;
  burstCount: number;
}

const rateLimits = new Map<string, RateLimitEntry>();

/**
 * Check if action is rate limited
 */
export function isRateLimited(
  key: string,
  config: RateLimitConfig
): { limited: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimits.get(key);
  
  if (!entry) {
    rateLimits.set(key, {
      count: 1,
      windowStart: now,
      burstCount: 1,
    });
    return { limited: false };
  }
  
  const elapsed = now - entry.windowStart;
  
  // Reset window if expired
  if (elapsed >= config.windowMs) {
    rateLimits.set(key, {
      count: 1,
      windowStart: now,
      burstCount: 1,
    });
    return { limited: false };
  }
  
  // Check burst limit
  if (config.burstLimit && entry.burstCount >= config.burstLimit) {
    const retryAfter = Math.ceil((config.windowMs - elapsed) / 1000);
    return { limited: true, retryAfter };
  }
  
  // Check sustained limit
  if (entry.count >= config.maxRequests) {
    const retryAfter = Math.ceil((config.windowMs - elapsed) / 1000);
    return { limited: true, retryAfter };
  }
  
  // Increment counters
  entry.count++;
  entry.burstCount++;
  rateLimits.set(key, entry);
  
  return { limited: false };
}

/**
 * Chat message rate limiting
 */
export function checkChatRateLimit(userId: string): { 
  allowed: boolean; 
  retryAfter?: number;
  message?: string;
} {
  const result = isRateLimited(`chat:${userId}`, {
    maxRequests: 60, // 60 messages per minute
    windowMs: 60000,
    burstLimit: 10, // Max 10 rapid messages
  });
  
  if (result.limited) {
    logger.warn('Chat rate limit exceeded', { userId, retryAfter: result.retryAfter });
    return {
      allowed: false,
      retryAfter: result.retryAfter,
      message: 'You\'re sending messages too quickly. Please slow down.',
    };
  }
  
  return { allowed: true };
}

/**
 * Login attempt rate limiting
 */
export function checkLoginRateLimit(email: string): {
  allowed: boolean;
  retryAfter?: number;
  message?: string;
} {
  const result = isRateLimited(`login:${email}`, {
    maxRequests: 5, // 5 attempts per minute
    windowMs: 60000,
  });
  
  if (result.limited) {
    logger.warn('Login rate limit exceeded', { email, retryAfter: result.retryAfter });
    return {
      allowed: false,
      retryAfter: result.retryAfter,
      message: 'Too many login attempts. Please try again later.',
    };
  }
  
  return { allowed: true };
}

/**
 * API request rate limiting
 */
export function checkApiRateLimit(endpoint: string, userId?: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  const key = userId ? `api:${endpoint}:${userId}` : `api:${endpoint}:anon`;
  
  const result = isRateLimited(key, {
    maxRequests: 100, // 100 requests per minute
    windowMs: 60000,
  });
  
  if (result.limited) {
    logger.warn('API rate limit exceeded', { endpoint, userId, retryAfter: result.retryAfter });
  }
  
  return {
    allowed: !result.limited,
    retryAfter: result.retryAfter,
  };
}

/**
 * Reset rate limit for a key
 */
export function resetRateLimit(key: string): void {
  rateLimits.delete(key);
}

/**
 * Clean up expired rate limit entries
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  const maxAge = 3600000; // 1 hour
  
  for (const [key, entry] of rateLimits.entries()) {
    if (now - entry.windowStart > maxAge) {
      rateLimits.delete(key);
    }
  }
}

// Lazy cleanup - only starts when module is actively used
let cleanupIntervalStarted = false;
export function ensureRateLimitCleanup(): void {
  if (typeof window !== 'undefined' && !cleanupIntervalStarted) {
    cleanupIntervalStarted = true;
    setInterval(cleanupRateLimits, 300000);
  }
}
