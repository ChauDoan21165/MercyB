/**
 * Module-level cache holding the last known server-streak values.
 *
 * Why this exists: `pointsService.getStreakDays()` is synchronous
 * (read from localStorage) and has many call sites. Making it async
 * would be a large refactor. Instead, `useServerStreak()` populates
 * this cache on mount, and `pointsService.getStreakDays()` reads it
 * when the feature flag is on. If the cache isn't populated yet, we
 * fall back to the localStorage value to avoid a visible "0" flash.
 *
 * Consumers:
 *   - `useServerStreak` (the writer — pushes profile row updates here)
 *   - `pointsService.getStreakDays` (reads when SERVER_STREAKS_ENABLED)
 */

export type CachedStreak = {
  current: number;
  longest: number;
  lastStudiedDate: string | null;
  /** ms since epoch when this value was last written. */
  updatedAt: number;
};

let cached: CachedStreak | null = null;

export function getCachedStreak(): CachedStreak | null {
  return cached;
}

export function setCachedStreak(next: CachedStreak | null): void {
  cached = next;
}

/** Test-only reset. */
export function __resetStreakCacheForTests(): void {
  cached = null;
}
