import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  renderCount: number;
  loadTime: number;
}

/**
 * Development-only performance profiler overlay
 * Shows FPS, memory usage, and render performance
 */
export function PerformanceProfiler() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: 0,
    renderCount: 0,
    loadTime: 0,
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (import.meta.env.PROD) return; // Dev only

    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const memory = (performance as any).memory?.usedJSHeapSize 
          ? Math.round((performance as any).memory.usedJSHeapSize / 1048576)
          : 0;

        setMetrics((prev) => ({
          ...prev,
          fps,
          memory,
          renderCount: prev.renderCount + 1,
        }));

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    // Keyboard shortcut: Ctrl+Shift+P
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setVisible((v) => !v);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (import.meta.env.PROD || !visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-black/90 text-white p-4 rounded-lg font-mono text-xs space-y-1 shadow-lg">
      <div className="flex items-center gap-2 mb-2 text-green-400">
        <Activity className="w-4 h-4" />
        <span className="font-semibold">Performance Monitor</span>
      </div>
      <div>FPS: <span className="text-green-400 font-bold">{metrics.fps}</span></div>
      <div>Memory: <span className="text-blue-400">{metrics.memory} MB</span></div>
      <div>Renders: <span className="text-yellow-400">{metrics.renderCount}</span></div>
      <div className="text-gray-400 text-[10px] mt-2 pt-2 border-t border-gray-700">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
}
