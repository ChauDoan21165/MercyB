/**
 * Mercy Engine Guard Wrapper
 *
 * Wraps engine actions with error handling and retry logic.
 *
 * Upgrade goals:
 * - preserve safety while improving tone control
 * - expose style dampening signals for teacher-like behavior
 * - keep fallbacks calm, brief, and reliable
 */

import { applyPersonality } from './personalityRules';

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 100;

export interface GuardResult<T> {
  success: boolean;
  result?: T;
  error?: Error;
  retries: number;
  softenTone?: boolean;
  suppressHumor?: boolean;
  requireDirectness?: boolean;
  usedFallback?: boolean;
}

export interface GuardToneSignals {
  softenTone: boolean;
  suppressHumor: boolean;
  requireDirectness: boolean;
}

/**
 * Soft fallback messages when engine fails
 */
export const FALLBACK_MESSAGES = {
  en: "I'm here. Something didn't load, but we'll keep going.",
  vi: 'Mình ở đây. Có gì đó chưa tải được, nhưng mình vẫn tiếp tục cùng bạn.',
};

const DEFAULT_TONE_SIGNALS: GuardToneSignals = {
  softenTone: false,
  suppressHumor: false,
  requireDirectness: false,
};

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeText(input: string): string {
  return String(input ?? '').toLowerCase().trim();
}

function includesAny(text: string, phrases: string[]): boolean {
  return phrases.some((phrase) => text.includes(phrase));
}

/**
 * Infer tone safety signals from learner text.
 * This helps Mercy feel more like a calm teacher under stress.
 */
export function inferGuardToneSignals(input?: string | null): GuardToneSignals {
  const text = normalizeText(input || '');

  if (!text) {
    return { ...DEFAULT_TONE_SIGNALS };
  }

  const confused = includesAny(text, [
    "i don't get it",
    'i dont get it',
    "i'm confused",
    'im confused',
    'this is hard',
    'this makes no sense',
    'why is this so hard',
    'not sure',
  ]);

  const frustrated = includesAny(text, [
    'i give up',
    'ugh',
    'annoying',
    'frustrated',
    'stuck',
    'this sucks',
  ]);

  const sensitive = includesAny(text, [
    'sad',
    'anxious',
    'panic',
    'overwhelmed',
    'crying',
    'upset',
  ]);

  return {
    softenTone: confused || frustrated || sensitive,
    suppressHumor: confused || frustrated || sensitive,
    requireDirectness: confused || frustrated,
  };
}

/**
 * Get a Mercy-styled soft fallback message
 */
export function getFallbackMessage(language: 'en' | 'vi' = 'en'): string {
  const styled = applyPersonality(
    FALLBACK_MESSAGES.en,
    FALLBACK_MESSAGES.vi,
    'gentle_authority'
  );

  return language === 'vi' ? styled.vi : styled.en;
}

/**
 * Build a fallback result with tone signals attached.
 */
function buildFallbackResult<T>(args: {
  result?: T;
  error?: Error;
  retries: number;
  toneSignals?: Partial<GuardToneSignals>;
  success: boolean;
  usedFallback?: boolean;
}): GuardResult<T> {
  return {
    success: args.success,
    result: args.result,
    error: args.error,
    retries: args.retries,
    softenTone: args.toneSignals?.softenTone ?? DEFAULT_TONE_SIGNALS.softenTone,
    suppressHumor: args.toneSignals?.suppressHumor ?? DEFAULT_TONE_SIGNALS.suppressHumor,
    requireDirectness:
      args.toneSignals?.requireDirectness ?? DEFAULT_TONE_SIGNALS.requireDirectness,
    usedFallback: args.usedFallback ?? false,
  };
}

/**
 * Wrap an async action with retry logic
 */
export async function guardAsync<T>(
  action: () => Promise<T>,
  actionName: string,
  maxRetries: number = MAX_RETRIES,
  toneSignals?: Partial<GuardToneSignals>
): Promise<GuardResult<T>> {
  let lastError: Error | undefined;
  let retries = 0;

  while (retries <= maxRetries) {
    try {
      const result = await action();
      return buildFallbackResult({
        success: true,
        result,
        retries,
        toneSignals,
      });
    } catch (error) {
      lastError = toError(error);
      retries++;

      if (retries <= maxRetries) {
        console.warn(`[MercyGuard] ${actionName} failed, retry ${retries}/${maxRetries}`);
        await wait(RETRY_DELAY_MS * retries);
      }
    }
  }

  console.error(`[MercyGuard] ${actionName} failed after ${retries} attempts:`, lastError);

  return buildFallbackResult({
    success: false,
    error: lastError,
    retries,
    toneSignals,
  });
}

/**
 * Wrap a sync action with error handling
 */
export function guard<T>(
  action: () => T,
  actionName: string,
  fallback?: T,
  toneSignals?: Partial<GuardToneSignals>
): GuardResult<T> {
  try {
    const result = action();

    return buildFallbackResult({
      success: true,
      result,
      retries: 0,
      toneSignals,
    });
  } catch (error) {
    const err = toError(error);
    console.error(`[MercyGuard] ${actionName} failed:`, err);

    if (fallback !== undefined) {
      return buildFallbackResult({
        success: true,
        result: fallback,
        error: err,
        retries: 0,
        toneSignals,
        usedFallback: true,
      });
    }

    return buildFallbackResult({
      success: false,
      error: err,
      retries: 0,
      toneSignals,
    });
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
 * Create a guarded version of an engine action with tone-awareness.
 * Useful when caller has learner text and wants Mercy to become calmer on failure.
 */
export function createToneAwareGuardedAction<Args extends unknown[], R>(
  actionName: string,
  action: (...args: Args) => R,
  options?: {
    fallback?: R;
    getLearnerText?: (...args: Args) => string | null | undefined;
  }
): (...args: Args) => GuardResult<R> {
  return (...args: Args): GuardResult<R> => {
    const learnerText = options?.getLearnerText?.(...args);
    const toneSignals = inferGuardToneSignals(learnerText);
    return guard(() => action(...args), actionName, options?.fallback, toneSignals);
  };
}

/**
 * Log soft fallback when something fails
 */
export function logSoftFallback(
  actionName: string,
  language: 'en' | 'vi' = 'en',
  toneSignals?: Partial<GuardToneSignals>
): string {
  console.info(`[MercyGuard] Using soft fallback for ${actionName}`, {
    softenTone: toneSignals?.softenTone ?? false,
    suppressHumor: toneSignals?.suppressHumor ?? false,
    requireDirectness: toneSignals?.requireDirectness ?? false,
  });

  return getFallbackMessage(language);
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
      default:
        return null;
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
      default:
        return null;
    }
  } catch (error) {
    console.warn(`[MercyGuard] sessionStorage ${action} failed for ${key}:`, error);
    return null;
  }
}