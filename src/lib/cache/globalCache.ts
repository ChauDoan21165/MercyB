/**
 * Global Caching Layer with multi-tier storage cascade:
 * 1. In-memory (fastest, session-only)
 * 2. SessionStorage (fast, tab-scoped)
 * 3. LocalStorage (persistent, cross-tab)
 */

import { LRUCache } from './lruCache';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // milliseconds
}

class GlobalCache {
  private memoryCache: LRUCache<string, CacheEntry<any>>;
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.memoryCache = new LRUCache(200);
  }

  /**
   * Get cached data with cascade fallback
   */
  get<T>(key: string): T | null {
    // 1. Try memory first (fastest)
    const memEntry = this.memoryCache.get(key);
    if (memEntry && !this.isExpired(memEntry)) {
      return memEntry.data;
    }

    // 2. Try sessionStorage
    const sessionData = this.getFromStorage('session', key);
    if (sessionData) {
      this.memoryCache.set(key, sessionData); // Promote to memory
      return sessionData.data;
    }

    // 3. Try localStorage
    const localData = this.getFromStorage('local', key);
    if (localData) {
      this.memoryCache.set(key, localData); // Promote to memory
      return localData.data;
    }

    return null;
  }

  /**
   * Set cached data across all tiers
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    // Write to all tiers
    this.memoryCache.set(key, entry);
    this.setInStorage('session', key, entry);
    this.setInStorage('local', key, entry);
  }

  /**
   * Clear specific key from all tiers
   */
  delete(key: string): void {
    this.memoryCache.clear();
    this.removeFromStorage('session', key);
    this.removeFromStorage('local', key);
  }

  /**
   * Clear all cached data
   */
  clearAll(): void {
    this.memoryCache.clear();
    try {
      sessionStorage.clear();
      localStorage.clear();
    } catch (e) {
      console.warn('[GlobalCache] Storage clear failed:', e);
    }
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private getFromStorage(
    type: 'session' | 'local',
    key: string
  ): CacheEntry<any> | null {
    try {
      const storage = type === 'session' ? sessionStorage : localStorage;
      const raw = storage.getItem(key);
      if (!raw) return null;

      const entry = JSON.parse(raw) as CacheEntry<any>;
      if (this.isExpired(entry)) {
        this.removeFromStorage(type, key);
        return null;
      }

      return entry;
    } catch (e) {
      return null;
    }
  }

  private setInStorage(
    type: 'session' | 'local',
    key: string,
    entry: CacheEntry<any>
  ): void {
    try {
      const storage = type === 'session' ? sessionStorage : localStorage;
      storage.setItem(key, JSON.stringify(entry));
    } catch (e) {
      console.warn(`[GlobalCache] ${type}Storage write failed:`, e);
    }
  }

  private removeFromStorage(type: 'session' | 'local', key: string): void {
    try {
      const storage = type === 'session' ? sessionStorage : localStorage;
      storage.removeItem(key);
    } catch (e) {
      // Ignore
    }
  }
}

// Singleton instance
export const globalCache = new GlobalCache();
