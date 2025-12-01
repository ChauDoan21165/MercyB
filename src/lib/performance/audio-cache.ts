/**
 * Audio Cache System
 * Reuse Audio instances and avoid duplicate fetches
 */

interface CachedAudio {
  audio: HTMLAudioElement;
  url: string;
  lastUsed: number;
  inUse: boolean;
}

class AudioCache {
  private cache = new Map<string, CachedAudio>();
  private maxCacheSize = 10; // Keep only 10 audio instances
  private cleanupInterval: number | null = null;

  constructor() {
    // Cleanup old unused audio instances every 2 minutes
    if (typeof window !== 'undefined') {
      this.cleanupInterval = window.setInterval(() => {
        this.cleanup();
      }, 2 * 60 * 1000);
    }
  }

  /**
   * Get or create audio instance
   */
  get(url: string): HTMLAudioElement {
    const cached = this.cache.get(url);

    if (cached) {
      cached.lastUsed = Date.now();
      cached.inUse = true;
      return cached.audio;
    }

    // Create new audio instance
    const audio = new Audio(url);
    audio.preload = 'metadata';

    const cachedAudio: CachedAudio = {
      audio,
      url,
      lastUsed: Date.now(),
      inUse: true,
    };

    this.cache.set(url, cachedAudio);

    // Enforce cache size limit
    if (this.cache.size > this.maxCacheSize) {
      this.evictOldest();
    }

    return audio;
  }

  /**
   * Release audio instance (mark as not in use)
   */
  release(url: string): void {
    const cached = this.cache.get(url);
    if (cached) {
      cached.inUse = false;
    }
  }

  /**
   * Preload next audio file
   */
  preload(url: string): void {
    if (this.cache.has(url)) return;

    const audio = new Audio(url);
    audio.preload = 'metadata';

    this.cache.set(url, {
      audio,
      url,
      lastUsed: Date.now(),
      inUse: false,
    });
  }

  /**
   * Clear specific audio from cache
   */
  clear(url: string): void {
    const cached = this.cache.get(url);
    if (cached) {
      cached.audio.pause();
      cached.audio.src = '';
      this.cache.delete(url);
    }
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    for (const [url, cached] of this.cache.entries()) {
      cached.audio.pause();
      cached.audio.src = '';
    }
    this.cache.clear();
  }

  /**
   * Cleanup old unused audio instances
   */
  private cleanup(): void {
    const now = Date.now();
    const maxAge = 10 * 60 * 1000; // 10 minutes

    for (const [url, cached] of this.cache.entries()) {
      if (!cached.inUse && now - cached.lastUsed > maxAge) {
        cached.audio.pause();
        cached.audio.src = '';
        this.cache.delete(url);
      }
    }
  }

  /**
   * Evict oldest unused audio instance
   */
  private evictOldest(): void {
    let oldestUrl: string | null = null;
    let oldestTime = Infinity;

    for (const [url, cached] of this.cache.entries()) {
      if (!cached.inUse && cached.lastUsed < oldestTime) {
        oldestTime = cached.lastUsed;
        oldestUrl = url;
      }
    }

    if (oldestUrl) {
      this.clear(oldestUrl);
    }
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      inUse: Array.from(this.cache.values()).filter(c => c.inUse).length,
      cached: Array.from(this.cache.keys()),
    };
  }

  /**
   * Cleanup on unmount
   */
  destroy(): void {
    if (this.cleanupInterval !== null) {
      clearInterval(this.cleanupInterval);
    }
    this.clearAll();
  }
}

export const audioCache = new AudioCache();
