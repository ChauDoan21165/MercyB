/**
 * Global Companion Rate Limiting
 * Prevents companion from speaking too frequently across different routes/triggers
 */

let lastGlobalSpokenAt = 0;
const GLOBAL_MIN_INTERVAL_MS = 15_000; // 15 seconds between any bubbles globally

/**
 * Check if companion can speak globally (across all triggers)
 */
export function canCompanionSpeakGlobally(): boolean {
  return Date.now() - lastGlobalSpokenAt > GLOBAL_MIN_INTERVAL_MS;
}

/**
 * Mark that companion just spoke (call when bubble is shown)
 */
export function markCompanionSpoken(): void {
  lastGlobalSpokenAt = Date.now();
}

/**
 * Get time until companion can speak again (in ms)
 */
export function getTimeUntilCanSpeak(): number {
  const elapsed = Date.now() - lastGlobalSpokenAt;
  const remaining = GLOBAL_MIN_INTERVAL_MS - elapsed;
  return Math.max(0, remaining);
}

/**
 * Reset global rate limit (for testing or special cases)
 */
export function resetGlobalRateLimit(): void {
  lastGlobalSpokenAt = 0;
}
