/**
 * Performance Profiler Component
 * Dev-only performance monitoring with React Profiler API
 *
 * FIXES:
 * - TS2774: use `typeof window !== 'undefined'` guard and use `window.performance?.measure` correctly
 * - Move `import * as React` to the top (imports must be top-level, not at bottom)
 * - Ensure start mark exists before measure (mark start inside callback)
 * - Keep dev-only behavior
 */

import * as React from "react";
import { Profiler, type ProfilerOnRenderCallback, type ReactNode } from "react";
import { logger } from "@/lib/logger";

interface PerformanceProfilerProps {
  id: string;
  children: ReactNode;
  enabled?: boolean;
}

/**
 * Wrapper component that profiles render performance
 * Only active in development mode
 */
export function PerformanceProfiler({
  id,
  children,
  enabled = true,
}: PerformanceProfilerProps) {
  // Disable in production
  if (import.meta.env.PROD || !enabled) {
    return <>{children}</>;
  }

  const onRender: ProfilerOnRenderCallback = (
    componentId,
    phase,
    actualDuration,
    baseDuration,
    _startTime,
    _commitTime,
  ) => {
    // Log slow renders (> 16ms = 60fps threshold)
    if (actualDuration > 16) {
      logger.warn("Slow render detected", {
        scope: "PerformanceProfiler",
        component: componentId,
        phase,
        actualDuration: `${actualDuration.toFixed(2)}ms`,
        baseDuration: `${baseDuration.toFixed(2)}ms`,
      });
    }

    // Log to performance API for dev panel
    if (typeof window === "undefined") return;

    const perf = window.performance;
    if (!perf?.mark || !perf?.measure) return;

    try {
      const startMark = `${componentId}-${phase}-start`;
      const endMark = `${componentId}-${phase}-end`;

      // Ensure marks exist for measure()
      perf.mark(startMark);
      perf.mark(endMark);

      perf.measure(`${componentId} ${phase}`, startMark, endMark);
    } catch {
      // Ignore measurement errors
    }
  };

  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  );
}

/**
 * Hook to access render count (dev only)
 */
export function useRenderCount(componentName: string) {
  if (import.meta.env.PROD) return 0;

  const renderCountRef = React.useRef(0);

  React.useEffect(() => {
    renderCountRef.current += 1;

    if (renderCountRef.current > 10) {
      logger.warn("High render count", {
        scope: "useRenderCount",
        component: componentName,
        count: renderCountRef.current,
      });
    }
  });

  return renderCountRef.current;
}