/**
 * Mercy Engine Guard Wrapper
 * 
 * Wraps engine actions with error handling and retry logic.
 */

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 100;

export interface GuardResult<T> {
  success: boolean;
  result?: T;
  error?: Error;
  retries: number;
}

/**
 * Soft fallback messages when engine fails
 */
export const FALLBACK_MESSAGES = {
  en: "I'm here. Something didn't load, but I'll continue guiding you.",
  vi: "Mình ở đây. Có gì đó không tải được, nhưng mình sẽ tiếp tục hướng dẫn bạn."
};

/**
 * Wrap an async action with retry logic
 */
export async function guardAsync<T>(
  action: () => Promise<T>,
  actionName: string,
  maxRetries: number = MAX_RETRIES
): Promise<GuardResult<T>> {
  let lastError: Error | undefined;
  let retries = 0;

  while (retries <= maxRetries) {
    try {
      const result = await action();
      return { success: true, result, retries };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      retries++;

      if (retries <= maxRetries) {
        console.warn(`[MercyGuard] ${actionName} failed, retry ${retries}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * retries));
      }
    }
  }

  console.error(`[MercyGuard] ${actionName} failed after ${retries} attempts:`, lastError);
  return { success: false, error: lastError, retries };
}

/**
 * Wrap a sync action with error handling
 */
export function guard<T>(
  action: () => T,
  actionName: string,
  fallback?: T
): GuardResult<T> {
  try {
    const result = action();
    return { success: true, result, retries: 0 };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(`[MercyGuard] ${actionName} failed:`, err);
    
    if (fallback !== undefined) {
      return { success: true, result: fallback, retries: 0 };
    }
    
    return { success: false, error: err, retries: 0 };
  }
}

/**
 * Create a guarded version of an engine action
 */
export function createGuardedAction<Args extends unknown[], R>(
  actionName: string,
  action: (...args: Args) => R,
  fallback?: R
): (...args: Args) => R | undefined {
  return (...args: Args): R | undefined => {
    const result = guard(() => action(...args), actionName, fallback);
    return result.success ? result.result : fallback;
  };
}

/**
 * Log soft fallback when something fails
 */
export function logSoftFallback(
  actionName: string,
  language: 'en' | 'vi' = 'en'
): string {
  console.info(`[MercyGuard] Using soft fallback for ${actionName}`);
  return FALLBACK_MESSAGES[language];
}

/**
 * Check if window/document are available (SSR safety)
 */
export function isClientSide(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Safe localStorage access
 */
export function safeLocalStorage<T>(
  action: 'get' | 'set' | 'remove',
  key: string,
  value?: T
): T | null {
  if (!isClientSide()) return null;

  try {
    switch (action) {
      case 'get': {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : null;
      }
      case 'set': {
        if (value !== undefined) {
          localStorage.setItem(key, JSON.stringify(value));
        }
        return null;
      }
      case 'remove': {
        localStorage.removeItem(key);
        return null;
      }
    }
  } catch (error) {
    console.warn(`[MercyGuard] localStorage ${action} failed for ${key}:`, error);
    return null;
  }
}

/**
 * Safe sessionStorage access
 */
export function safeSessionStorage<T>(
  action: 'get' | 'set' | 'remove',
  key: string,
  value?: T
): T | null {
  if (!isClientSide()) return null;

  try {
    switch (action) {
      case 'get': {
        const stored = sessionStorage.getItem(key);
        return stored ? JSON.parse(stored) : null;
      }
      case 'set': {
        if (value !== undefined) {
          sessionStorage.setItem(key, JSON.stringify(value));
        }
        return null;
      }
      case 'remove': {
        sessionStorage.removeItem(key);
        return null;
      }
    }
  } catch (error) {
    console.warn(`[MercyGuard] sessionStorage ${action} failed for ${key}:`, error);
    return null;
  }
}
