/**
 * Stale-While-Revalidate (SWR) Cache Strategy
 * Returns cached data immediately, refreshes in background
 */

import { globalCache } from './globalCache';

interface SWROptions<T> {
  key: string;
  fetcher: () => Promise<T>;
  onUpdate?: (data: T) => void;
  revalidateOnMount?: boolean;
  ttl?: number;
}

export async function useSWR<T>(options: SWROptions<T>): Promise<T> {
  const { key, fetcher, onUpdate, revalidateOnMount = true, ttl } = options;

  // 1. Return cached data immediately if available
  const cached = globalCache.get<T>(key);
  if (cached) {
    // Schedule background revalidation
    if (revalidateOnMount) {
      setTimeout(() => revalidate(options), 0);
    }
    return cached;
  }

  // 2. No cache available - fetch fresh
  const fresh = await fetcher();
  globalCache.set(key, fresh, ttl);
  return fresh;
}

async function revalidate<T>(options: SWROptions<T>): Promise<void> {
  const { key, fetcher, onUpdate, ttl } = options;

  try {
    const fresh = await fetcher();
    globalCache.set(key, fresh, ttl);
    onUpdate?.(fresh);
  } catch (e) {
    console.warn(`[SWR] Revalidation failed for ${key}:`, e);
  }
}
