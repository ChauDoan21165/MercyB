/**
 * Memory optimization utilities
 * Reduces memory usage and prevents leaks
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Hook for throttled callbacks
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const throttledFn = useMemo(() => throttle(callback, delay), [callback, delay]);
  
  useEffect(() => {
    return () => {
      // Cleanup on unmount
    };
  }, []);

  return throttledFn;
}

/**
 * Hook for debounced callbacks
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const debouncedFn = useMemo(() => debounce(callback, delay), [callback, delay]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
    };
  }, []);

  return debouncedFn;
}

/**
 * Cleanup timers on unmount
 */
export function useCleanupTimers() {
  const timers = useRef<Set<number>>(new Set());

  const setTimeout = useCallback((callback: () => void, delay: number) => {
    const id = window.setTimeout(callback, delay);
    timers.current.add(id);
    return id;
  }, []);

  const setInterval = useCallback((callback: () => void, delay: number) => {
    const id = window.setInterval(callback, delay);
    timers.current.add(id);
    return id;
  }, []);

  const clearTimer = useCallback((id: number) => {
    window.clearTimeout(id);
    window.clearInterval(id);
    timers.current.delete(id);
  }, []);

  useEffect(() => {
    return () => {
      timers.current.forEach(id => {
        window.clearTimeout(id);
        window.clearInterval(id);
      });
      timers.current.clear();
    };
  }, []);

  return { setTimeout, setInterval, clearTimer };
}

/**
 * Pause effects when page is hidden
 */
export function useVisibilityPause(callback: (visible: boolean) => void) {
  useEffect(() => {
    const handleVisibilityChange = () => {
      callback(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [callback]);
}

/**
 * LRU Cache for memoization
 */
export class LRUCache<K, V> {
  private cache: Map<K, V>;
  private maxSize: number;

  constructor(maxSize: number = 50) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;
    
    // Move to end (most recently used)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    // Delete if exists (to reorder)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // Add to end
    this.cache.set(key, value);
    
    // Remove oldest if over limit
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}
