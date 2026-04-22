/**
 * Mercy Event Limiter
 * 
 * Global throttling for Mercy events.
 * Prevents spam and queues excess events.
 */

import type { MercyEventType } from './eventMap';

interface QueuedEvent {
  event: MercyEventType;
  timestamp: number;
  data?: Record<string, unknown>;
}

const THROTTLE_MS = 300;
const MAX_QUEUE_SIZE = 10;
const EVENT_EXPIRY_MS = 3000;

class EventLimiter {
  private lastEventTime = 0;
  private queue: QueuedEvent[] = [];
  private isProcessing = false;
  private processCallback: ((event: MercyEventType, data?: Record<string, unknown>) => void) | null = null;

  /**
   * Set the event processor callback
   */
  setProcessor(callback: (event: MercyEventType, data?: Record<string, unknown>) => void): void {
    this.processCallback = callback;
  }

  /**
   * Submit an event (will be throttled/queued)
   */
  submit(event: MercyEventType, data?: Record<string, unknown>): boolean {
    const now = Date.now();

    // Clean expired events from queue
    this.cleanExpiredEvents(now);

    // Check if we can process immediately
    if (now - this.lastEventTime >= THROTTLE_MS && !this.isProcessing) {
      this.processEvent(event, data);
      return true;
    }

    // Queue the event if not at capacity
    if (this.queue.length < MAX_QUEUE_SIZE) {
      this.queue.push({ event, timestamp: now, data });
      this.scheduleProcessing();
      return true;
    }

    // Queue full - event dropped
    console.debug('[EventLimiter] Event dropped (queue full):', event);
    return false;
  }

  /**
   * Process an event immediately
   */
  private processEvent(event: MercyEventType, data?: Record<string, unknown>): void {
    this.lastEventTime = Date.now();
    this.isProcessing = true;

    try {
      if (this.processCallback) {
        this.processCallback(event, data);
      }
    } catch (error) {
      console.error('[EventLimiter] Event processing error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Schedule processing of queued events
   */
  private scheduleProcessing(): void {
    const timeUntilNext = Math.max(0, THROTTLE_MS - (Date.now() - this.lastEventTime));

    setTimeout(() => {
      this.processQueue();
    }, timeUntilNext);
  }

  /**
   * Process next event in queue
   */
  private processQueue(): void {
    if (this.queue.length === 0 || this.isProcessing) return;

    const now = Date.now();
    
    // Clean expired events first
    this.cleanExpiredEvents(now);

    // Get oldest valid event
    const nextEvent = this.queue.shift();
    if (nextEvent) {
      this.processEvent(nextEvent.event, nextEvent.data);
    }

    // Continue processing if more in queue
    if (this.queue.length > 0) {
      this.scheduleProcessing();
    }
  }

  /**
   * Remove events older than expiry threshold
   */
  private cleanExpiredEvents(now: number): void {
    this.queue = this.queue.filter(e => now - e.timestamp < EVENT_EXPIRY_MS);
  }

  /**
   * Clear all queued events
   */
  clearQueue(): void {
    this.queue = [];
  }

  /**
   * Get queue status
   */
  getStatus(): { queueLength: number; lastEventTime: number; isProcessing: boolean } {
    return {
      queueLength: this.queue.length,
      lastEventTime: this.lastEventTime,
      isProcessing: this.isProcessing
    };
  }

  /**
   * Check if an event would be immediately processed
   */
  wouldProcessImmediately(): boolean {
    return Date.now() - this.lastEventTime >= THROTTLE_MS && !this.isProcessing;
  }
}

// Singleton instance
export const eventLimiter = new EventLimiter();

/**
 * Throttled event submission helper
 */
export function submitThrottledEvent(
  event: MercyEventType,
  data?: Record<string, unknown>
): boolean {
  return eventLimiter.submit(event, data);
}
