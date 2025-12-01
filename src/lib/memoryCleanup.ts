/**
 * Memory Cleanup Utilities
 * 
 * Provides utilities to prevent memory leaks in React components.
 * Use these helpers to ensure proper cleanup of event listeners, timers, and fetch requests.
 */

/**
 * Create an AbortController that auto-cleans on unmount
 * 
 * Usage in component:
 * const controller = useAbortController();
 * fetch(url, { signal: controller.signal });
 */
export function createAbortController(): AbortController {
  return new AbortController();
}

/**
 * Cleanup helper for audio elements
 */
export function cleanupAudio(audio: HTMLAudioElement | null) {
  if (!audio) return;
  
  audio.pause();
  audio.src = "";
  audio.load();
  // Remove all event listeners by cloning and replacing
  const parent = audio.parentNode;
  if (parent) {
    const clone = audio.cloneNode(false) as HTMLAudioElement;
    parent.replaceChild(clone, audio);
  }
}

/**
 * Cleanup helper for timers
 */
export class TimerManager {
  private timers: Set<number> = new Set();
  private intervals: Set<number> = new Set();

  setTimeout(callback: () => void, delay: number): number {
    const id = window.setTimeout(() => {
      callback();
      this.timers.delete(id);
    }, delay);
    this.timers.add(id);
    return id;
  }

  setInterval(callback: () => void, delay: number): number {
    const id = window.setInterval(callback, delay);
    this.intervals.add(id);
    return id;
  }

  clearTimeout(id: number) {
    window.clearTimeout(id);
    this.timers.delete(id);
  }

  clearInterval(id: number) {
    window.clearInterval(id);
    this.intervals.delete(id);
  }

  cleanup() {
    this.timers.forEach(id => window.clearTimeout(id));
    this.intervals.forEach(id => window.clearInterval(id));
    this.timers.clear();
    this.intervals.clear();
  }
}

/**
 * React hook for auto-cleanup timers
 */
import { useEffect, useRef } from 'react';

export function useTimerManager() {
  const manager = useRef(new TimerManager());

  useEffect(() => {
    return () => {
      manager.current.cleanup();
    };
  }, []);

  return manager.current;
}

/**
 * React hook for abort controller with auto-cleanup
 */
export function useAbortController() {
  const controller = useRef<AbortController>();

  useEffect(() => {
    controller.current = new AbortController();
    
    return () => {
      controller.current?.abort();
    };
  }, []);

  return controller.current!;
}

/**
 * Cleanup helper for event listeners
 */
export class EventListenerManager {
  private listeners: Array<{
    target: EventTarget;
    event: string;
    handler: EventListener;
    options?: AddEventListenerOptions;
  }> = [];

  addEventListener(
    target: EventTarget,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ) {
    target.addEventListener(event, handler, options);
    this.listeners.push({ target, event, handler, options });
  }

  removeEventListener(
    target: EventTarget,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ) {
    target.removeEventListener(event, handler, options);
    this.listeners = this.listeners.filter(
      l => !(l.target === target && l.event === event && l.handler === handler)
    );
  }

  cleanup() {
    this.listeners.forEach(({ target, event, handler, options }) => {
      target.removeEventListener(event, handler, options);
    });
    this.listeners = [];
  }
}

/**
 * React hook for event listener manager with auto-cleanup
 */
export function useEventListenerManager() {
  const manager = useRef(new EventListenerManager());

  useEffect(() => {
    return () => {
      manager.current.cleanup();
    };
  }, []);

  return manager.current;
}
