/**
 * Retry with Exponential Backoff
 * Handles transient network errors gracefully
 */

import { logger } from '@/lib/logger';

interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  shouldRetry?: (error: any) => boolean;
}

/**
 * Retry a function with exponential backoff
 * @param fn - Async function to retry
 * @param options - Retry configuration
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    shouldRetry = () => true,
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if shouldRetry returns false
      if (!shouldRetry(error)) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxAttempts - 1) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      
      logger.warn('Retrying after error', {
        scope: 'retryWithBackoff',
        attempt: attempt + 1,
        maxAttempts,
        delayMs: delay,
        error: error instanceof Error ? error.message : String(error),
      });

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Determine if error is transient (should retry)
 */
export function isTransientError(error: any): boolean {
  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }

  // Supabase/HTTP errors
  if (error?.status) {
    const status = error.status;
    // Retry on 5xx (server errors) and 429 (rate limit)
    return status >= 500 || status === 429 || status === 408;
  }

  // Generic network errors
  if (error?.code === 'ECONNRESET' || error?.code === 'ETIMEDOUT') {
    return true;
  }

  return false;
}

/**
 * Retry wrapper for Supabase queries
 */
export async function retrySupabaseQuery<T>(
  queryFn: () => Promise<T>
): Promise<T> {
  return retryWithBackoff(queryFn, {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 5000,
    shouldRetry: isTransientError,
  });
}
