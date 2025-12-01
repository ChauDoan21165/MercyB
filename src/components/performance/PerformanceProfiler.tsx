/**
 * Performance Profiler Component
 * Dev-only performance monitoring with React Profiler API
 */

import { Profiler, ProfilerOnRenderCallback, ReactNode } from 'react';
import { logger } from '@/lib/logger';

interface PerformanceProfilerProps {
  id: string;
  children: ReactNode;
  enabled?: boolean;
}

/**
 * Wrapper component that profiles render performance
 * Only active in development mode
 */
export function PerformanceProfiler({ id, children, enabled = true }: PerformanceProfilerProps) {
  // Disable in production
  if (import.meta.env.PROD || !enabled) {
    return <>{children}</>;
  }

  const onRender: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    // Log slow renders (> 16ms = 60fps threshold)
    if (actualDuration > 16) {
      logger.warn('Slow render detected', {
        scope: 'PerformanceProfiler',
        component: id,
        phase,
        actualDuration: `${actualDuration.toFixed(2)}ms`,
        baseDuration: `${baseDuration.toFixed(2)}ms`,
      });
    }

    // Log to performance API for dev panel
    if (window.performance && window.performance.measure) {
      try {
        performance.mark(`${id}-${phase}-end`);
        performance.measure(
          `${id} ${phase}`,
          `${id}-${phase}-start`,
          `${id}-${phase}-end`
        );
      } catch (e) {
        // Ignore measurement errors
      }
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
  if (import.meta.env.PROD) {
    return 0;
  }

  const renderCountRef = React.useRef(0);
  
  React.useEffect(() => {
    renderCountRef.current += 1;
    if (renderCountRef.current > 10) {
      logger.warn('High render count', {
        scope: 'useRenderCount',
        component: componentName,
        count: renderCountRef.current,
      });
    }
  });

  return renderCountRef.current;
}

import * as React from 'react';
