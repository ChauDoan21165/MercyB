/**
 * Performance detection hook
 * Automatically reduces animations on low-performance devices
 */

import { useEffect, useState } from "react";
import { ANIMATION_CONFIG } from "@/config/animation";

export function usePerformanceMode() {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTime;

      // Measure every second
      if (elapsed >= 1000) {
        const currentFPS = Math.round((frameCount * 1000) / elapsed);
        setFps(currentFPS);
        
        // Enable low-performance mode if FPS drops below threshold
        if (currentFPS < ANIMATION_CONFIG.performance.fpsThreshold) {
          setIsLowPerformance(true);
        } else {
          setIsLowPerformance(false);
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    // Start measuring after 2 seconds to let app stabilize
    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(measureFPS);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return { isLowPerformance, fps };
}
