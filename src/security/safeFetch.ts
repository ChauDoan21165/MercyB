// Safe Fetch Wrapper - Hardened fetch with timeout, retry, and error handling

interface SafeFetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  csrfToken?: string;
}

interface SafeFetchResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  status?: number;
}

const DEFAULT_TIMEOUT = 10000; // 10 seconds
const DEFAULT_RETRIES = 2;
const DEFAULT_RETRY_DELAY = 1000; // 1 second

/**
 * Safe fetch with timeout, retry logic, and error handling
 */
export async function safeFetch<T = any>(
  url: string,
  options: SafeFetchOptions = {}
): Promise<SafeFetchResult<T>> {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    csrfToken,
    ...fetchOptions
  } = options;

  // Add CSRF token if provided
  const headers = new Headers(fetchOptions.headers);
  if (csrfToken) {
    headers.set('X-CSRF-Token', csrfToken);
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse JSON safely
      let data: T | undefined;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonError) {
          return {
            ok: false,
            error: 'Failed to parse JSON response',
            status: response.status,
          };
        }
      }

      if (!response.ok) {
        // Extract error message from response if available
        const errorMessage =
          (data as any)?.error ||
          (data as any)?.message ||
          `Request failed with status ${response.status}`;

        return {
          ok: false,
          error: errorMessage,
          status: response.status,
        };
      }

      return {
        ok: true,
        data,
        status: response.status,
      };
    } catch (error: any) {
      lastError = error;

      // Don't retry on abort (timeout)
      if (error.name === 'AbortError') {
        return {
          ok: false,
          error: 'Request timeout',
        };
      }

      // Retry on network errors
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        continue;
      }
    }
  }

  return {
    ok: false,
    error: lastError?.message || 'Request failed after retries',
  };
}

/**
 * Safe POST request
 */
export async function safePost<T = any>(
  url: string,
  body: any,
  options: SafeFetchOptions = {}
): Promise<SafeFetchResult<T>> {
  return safeFetch<T>(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(body),
  });
}

/**
 * Safe GET request
 */
export async function safeGet<T = any>(
  url: string,
  options: SafeFetchOptions = {}
): Promise<SafeFetchResult<T>> {
  return safeFetch<T>(url, {
    ...options,
    method: 'GET',
  });
}

/**
 * Safe PUT request
 */
export async function safePut<T = any>(
  url: string,
  body: any,
  options: SafeFetchOptions = {}
): Promise<SafeFetchResult<T>> {
  return safeFetch<T>(url, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(body),
  });
}

/**
 * Safe DELETE request
 */
export async function safeDelete<T = any>(
  url: string,
  options: SafeFetchOptions = {}
): Promise<SafeFetchResult<T>> {
  return safeFetch<T>(url, {
    ...options,
    method: 'DELETE',
  });
}
