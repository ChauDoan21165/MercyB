/**
 * Console Replacement System
 * Replaces all console.log/warn/error calls with unified logger
 * 
 * Usage in development:
 *   import './lib/console-replacer' at top of main.tsx
 * 
 * This prevents scattered console statements and ensures all logging
 * goes through the unified logger with proper context and persistence.
 */

import { logger } from './logger';

// Store original console methods
const originalConsole = {
  log: console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  debug: console.debug.bind(console),
};

/**
 * Replace console methods with logger
 * Only in development mode
 */
export function replaceConsole() {
  if (import.meta.env.DEV) {
    console.log = (...args: any[]) => {
      logger.debug(String(args[0]), { args: args.slice(1) });
    };

    console.warn = (...args: any[]) => {
      logger.warn(String(args[0]), { args: args.slice(1) });
    };

    console.error = (...args: any[]) => {
      logger.error(String(args[0]), { args: args.slice(1) });
    };

    console.debug = (...args: any[]) => {
      logger.debug(String(args[0]), { args: args.slice(1) });
    };
  }
}

/**
 * Restore original console methods (for debugging)
 */
export function restoreConsole() {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  console.debug = originalConsole.debug;
}

// Global logger access for debugging
if (typeof window !== 'undefined') {
  (window as any).__MB_LOGGER = logger;
  (window as any).__MB_RESTORE_CONSOLE = restoreConsole;
}
