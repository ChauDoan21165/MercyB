/**
 * Performance Monitoring System
 * Tracks FPS, render times, network timing for rooms and audio
 */

import { logger } from '../logger';

interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  networkTime: number;
  memoryUsage?: number;
}

class PerformanceMonitor {
  private frameCount = 0;
  private lastFrameTime = performance.now();
  private fps = 60;
  private isMonitoring = false;

  // Global event log
  private eventLog: Array<{ type: string; timestamp: number; data?: any }> = [];

  /**
   * Start FPS monitoring
   */
  startFpsMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    const measureFps = () => {
      const now = performance.now();
      const delta = now - this.lastFrameTime;
      this.frameCount++;

      if (delta >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / delta);
        this.frameCount = 0;
        this.lastFrameTime = now;

        // Log if FPS drops below 30
        if (this.fps < 30) {
          logger.warn('Low FPS detected', { fps: this.fps });
        }
      }

      if (this.isMonitoring) {
        requestAnimationFrame(measureFps);
      }
    };

    requestAnimationFrame(measureFps);
  }

  /**
   * Stop FPS monitoring
   */
  stopFpsMonitoring() {
    this.isMonitoring = false;
  }

  /**
   * Get current FPS
   */
  getFps(): number {
    return this.fps;
  }

  /**
   * Measure render time for a component
   */
  measureRender(componentName: string, callback: () => void) {
    const start = performance.now();
    callback();
    const duration = performance.now() - start;

    if (duration > 16) { // Over 1 frame at 60fps
      logger.warn('Slow render detected', { component: componentName, duration });
    }

    return duration;
  }

  /**
   * Log global event
   */
  logEvent(type: string, data?: any) {
    this.eventLog.push({
      type,
      timestamp: Date.now(),
      data,
    });

    // Keep last 100 events
    if (this.eventLog.length > 100) {
      this.eventLog.shift();
    }
  }

  /**
   * Get event log
   */
  getEventLog() {
    return [...this.eventLog];
  }

  /**
   * Measure network timing
   */
  measureNetwork(url: string, callback: () => Promise<any>) {
    const start = performance.now();
    
    return callback().then((result) => {
      const duration = performance.now() - start;
      
      logger.performance('network', duration, { url });
      this.logEvent('network', { url, duration });

      return result;
    });
  }

  /**
   * Get memory usage (if available)
   */
  getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1048576; // Convert to MB
    }
    return undefined;
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetrics {
    return {
      fps: this.fps,
      renderTime: 0, // Calculated per component
      networkTime: 0, // Calculated per request
      memoryUsage: this.getMemoryUsage(),
    };
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Expose to window for debugging
if (typeof window !== 'undefined') {
  (window as any).__MB_PERF = performanceMonitor;
  (window as any).__MB_LOG = {
    events: () => performanceMonitor.getEventLog(),
    metrics: () => performanceMonitor.getMetrics(),
  };
}

/**
 * Auto-start FPS monitoring in development
 */
if (import.meta.env.DEV) {
  performanceMonitor.startFpsMonitoring();
}
