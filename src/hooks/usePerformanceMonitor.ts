import { useEffect, useRef } from "react";
import { logger } from "@/lib/logger";

/**
 * Performance Monitoring Hook
 * 
 * Monitors component render performance and reports slow renders.
 * 
 * Usage:
 * usePerformanceMonitor("ChatHub", { roomId });
 */

interface PerformanceContext {
  [key: string]: any;
}

export function usePerformanceMonitor(
  componentName: string,
  context?: PerformanceContext,
  slowThreshold = 100 // ms
) {
  const renderStart = useRef<number>();
  const renderCount = useRef(0);

  useEffect(() => {
    renderStart.current = performance.now();
  });

  useEffect(() => {
    if (renderStart.current) {
      const duration = performance.now() - renderStart.current;
      renderCount.current++;

      // Log slow renders
      if (duration > slowThreshold) {
        logger.warn(`Slow render detected: ${componentName}`, {
          ...context,
          component: componentName,
          render_duration_ms: duration,
          render_count: renderCount.current,
        });
      }

      // Log every 10th render in development
      if (import.meta.env.DEV && renderCount.current % 10 === 0) {
        logger.debug(`${componentName} render performance`, {
          ...context,
          component: componentName,
          render_duration_ms: duration,
          render_count: renderCount.current,
        });
      }
    }
  });

  return {
    renderCount: renderCount.current,
  };
}

/**
 * Measure async operation duration
 * 
 * Usage:
 * const { start, end } = useAsyncPerformance();
 * start("loadRoom");
 * await loadMergedRoom(roomId);
 * end("loadRoom", { roomId });
 */
export function useAsyncPerformance() {
  const timings = useRef<Map<string, number>>(new Map());

  const start = (operationName: string) => {
    timings.current.set(operationName, performance.now());
  };

  const end = (operationName: string, context?: PerformanceContext) => {
    const startTime = timings.current.get(operationName);
    if (startTime) {
      const duration = performance.now() - startTime;
      logger.performance(operationName, duration, context);
      timings.current.delete(operationName);
      return duration;
    }
    return 0;
  };

  return { start, end };
}
