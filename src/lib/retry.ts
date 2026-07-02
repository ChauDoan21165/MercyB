/**
 * Global Retry Strategy with Exponential Backoff
 * Provides resilient error recovery for network requests
 */

interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  exponentialBase?: number;
  shouldRetry?: (error: unknown) => boolean;
  onRetry?: (attempt: number, error: unknown) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  exponentialBase: 2,
  shouldRetry: (error: unknown): boolean => {
    // Retry on network errors, 5xx, 429 (rate limit)
    if (error && typeof error === 'object' && 'status' in error) {
      const err = error as { status: number; statusText?: string };
      return err.status >= 500 || err.status === 429;
    }
    return true; // Retry on unknown errors
  },
  onRetry: () => {},
};

/**
 * Execute a function with automatic retry on failure
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if we should retry
      if (attempt >= opts.maxAttempts || !opts.shouldRetry(error)) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        opts.initialDelay * Math.pow(opts.exponentialBase, attempt - 1),
        opts.maxDelay
      );

      opts.onRetry(attempt, error);

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Retry helper specifically for fetch requests
 */
export async function retryFetch(
  url: string,
  options?: RequestInit,
  retryOptions?: RetryOptions
): Promise<Response> {
  return withRetry(
    async () => {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw { status: response.status, statusText: response.statusText };
      }
      return response;
    },
    {
      ...retryOptions,
      shouldRetry: (error: unknown): boolean => {
        // Retry on network errors and 5xx/429
        if (error && typeof error === 'object' && 'status' in error) {
          const err = error as { status: number; statusText?: string };
          return err.status >= 500 || err.status === 429;
        }
        return true;
      },
    }
  );
}
