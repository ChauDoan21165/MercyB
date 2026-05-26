/**
 * Centralized Console Logging Guard
 * 
 * Prevents stray console.log in production while keeping useful logs in dev.
 * Use these instead of direct console.* calls.
 */

const isDev = import.meta.env.DEV;

export const logDebug = (...args: any[]) => {
  if (isDev) {
    console.log('[DEBUG]', ...args);
  }
};

export const logWarn = (...args: any[]) => {
  if (isDev) {
    console.warn('[WARN]', ...args);
  } else {
    // In production, only log critical warnings
    console.warn('[WARN]', args[0]); // Just the first arg to reduce noise
  }
};

export const logError = (...args: any[]) => {
  console.error('[ERROR]', ...args);
};

export const logInfo = (...args: any[]) => {
  if (isDev) {
    console.info('[INFO]', ...args);
  }
};
