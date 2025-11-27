// In-memory cache for room data with TTL

interface CacheEntry {
  data: any;
  timestamp: number;
}

class RoomCache {
  private cache = new Map<string, CacheEntry>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_ENTRIES = 100; // Prevent memory bloat
  
  /**
   * Get cached room data if valid
   */
  get(roomId: string): any | null {
    const entry = this.cache.get(roomId);
    
    if (!entry) return null;
    
    // Check if expired
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(roomId);
      return null;
    }
    
    return entry.data;
  }
  
  /**
   * Store room data in cache
   */
  set(roomId: string, data: any): void {
    // Prevent cache from growing unbounded
    if (this.cache.size >= this.MAX_ENTRIES) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    
    this.cache.set(roomId, {
      data,
      timestamp: Date.now()
    });
  }
  
  /**
   * Invalidate specific room
   */
  invalidate(roomId: string): void {
    this.cache.delete(roomId);
  }
  
  /**
   * Clear all cached data
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.MAX_ENTRIES,
      ttl: this.TTL
    };
  }
}

// Singleton instance
export const roomCache = new RoomCache();