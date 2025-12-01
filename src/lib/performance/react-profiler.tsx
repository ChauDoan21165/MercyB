/**
 * React Performance Profiler
 * Dev-only performance monitoring for React components
 */

import { Profiler, ProfilerOnRenderCallback } from 'react';

const isDev = process.env.NODE_ENV !== 'production';

interface PerformanceData {
  componentName: string;
  renderTime: number;
  renderCount: number;
  lastRender: number;
}

const performanceMap = new Map<string, PerformanceData>();

const onRenderCallback: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  if (!isDev) return;

  const existing = performanceMap.get(id) || {
    componentName: id,
    renderTime: 0,
    renderCount: 0,
    lastRender: 0,
  };

  performanceMap.set(id, {
    ...existing,
    renderTime: existing.renderTime + actualDuration,
    renderCount: existing.renderCount + 1,
    lastRender: actualDuration,
  });

  // Log slow renders (> 16ms = 60fps threshold)
  if (actualDuration > 16) {
    console.warn(
      `[Perf] ${id} rendered slowly (${actualDuration.toFixed(2)}ms, ${phase})`,
      { baseDuration, startTime, commitTime }
    );
  }
};

export function PerformanceProfiler({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  if (!isDev) return <>{children}</>;

  return (
    <Profiler id={id} onRender={onRenderCallback}>
      {children}
    </Profiler>
  );
}

export function getPerformanceReport() {
  if (!isDev) return [];
  
  return Array.from(performanceMap.values())
    .sort((a, b) => b.renderTime - a.renderTime)
    .map(data => ({
      ...data,
      avgRenderTime: data.renderTime / data.renderCount,
    }));
}

export function clearPerformanceData() {
  performanceMap.clear();
}

// Dev-only performance panel
export function PerformanceDebugPanel() {
  if (!isDev) return null;

  const report = getPerformanceReport();

  return (
    <div
      className="fixed bottom-4 right-4 bg-card border border-border rounded-lg p-4 max-w-md max-h-96 overflow-auto z-[100]"
      data-performance-panel
    >
      <h3 className="font-bold mb-2">Component Performance</h3>
      <button
        onClick={clearPerformanceData}
        className="text-xs bg-muted px-2 py-1 rounded mb-2"
      >
        Clear Data
      </button>
      <div className="space-y-2 text-xs">
        {report.slice(0, 10).map((data) => (
          <div key={data.componentName} className="border-b border-border pb-1">
            <div className="font-medium">{data.componentName}</div>
            <div className="text-muted-foreground">
              Renders: {data.renderCount} | Avg: {data.avgRenderTime.toFixed(2)}ms | Last:{' '}
              {data.lastRender.toFixed(2)}ms
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
