/**
 * Global Retry Strategy with Exponential Backoff
 * Provides resilient error recovery for network requests
 */

interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  exponentialBase?: number;
  shouldRetry?: (error: any) => boolean;
  onRetry?: (attempt: number, error: any) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  exponentialBase: 2,
  shouldRetry: (error) => {
    // Retry on network errors, 5xx, 429 (rate limit)
    if (error?.status) {
      return error.status >= 500 || error.status === 429;
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
  let lastError: any;

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
      shouldRetry: (error) => {
        // Retry on network errors and 5xx/429
        if (error?.status) {
          return error.status >= 500 || error.status === 429;
        }
        return true;
      },
    }
  );
}
