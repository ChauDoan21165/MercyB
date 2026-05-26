import { logger } from './logger';

/**
 * Guarded Supabase call wrapper
 * Handles timeouts, network errors, and unexpected responses
 * Returns typed result: { ok: true, data } | { ok: false, error }
 * 
 * SECURITY NOTE: This is network error handling, not authentication/authorization
 */

export interface SupabaseSuccess<T> {
  ok: true;
  data: T;
}

export interface SupabaseError {
  ok: false;
  error: string;
  code?: string;
}

export type SupabaseResult<T> = SupabaseSuccess<T> | SupabaseError;

interface GuardedCallOptions {
  timeout?: number; // milliseconds
  scope?: string; // for logging
  operation?: string; // for logging
}

/**
 * Wraps a Supabase call with error handling and timeout
 * 
 * Usage:
 *   const result = await guardedCall(
 *     supabase.from('rooms').select('*').eq('id', roomId).maybeSingle(),
 *     { scope: 'RoomLoader', operation: 'fetchRoom', timeout: 5000 }
 *   );
 *   
 *   if (result.ok) {
 *     // use result.data
 *   } else {
 *     // handle result.error
 *   }
 */
export async function guardedCall<T>(
  promise: Promise<{ data: T | null; error: any }>,
  options: GuardedCallOptions = {}
): Promise<SupabaseResult<T>> {
  const { timeout = 10000, scope = 'Supabase', operation = 'call' } = options;

  try {
    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeout);
    });

    // Race between actual call and timeout
    const result = await Promise.race([promise, timeoutPromise]);

    if (result.error) {
      logger.error(scope, `${operation} failed`, {
        error: result.error,
        code: result.error?.code,
        message: result.error?.message,
      });

      return {
        ok: false,
        error: result.error?.message || 'Database operation failed',
        code: result.error?.code,
      };
    }

    return {
      ok: true,
      data: result.data as T,
    };
  } catch (err: any) {
    const isTimeout = err.message === 'Request timeout';
    const isNetworkError = err.message?.includes('fetch') || err.message?.includes('network');

    logger.error(scope, `${operation} exception`, {
      error: err,
      isTimeout,
      isNetworkError,
    });

    if (isTimeout) {
      return {
        ok: false,
        error: 'Request timed out. Please check your connection.',
        code: 'TIMEOUT',
      };
    }

    if (isNetworkError) {
      return {
        ok: false,
        error: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      };
    }

    return {
      ok: false,
      error: err.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    };
  }
}
