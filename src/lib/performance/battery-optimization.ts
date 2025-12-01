/**
 * Battery optimization utilities
 * Reduces CPU usage and battery drain
 */

import { useEffect, useState, useCallback } from 'react';

/**
 * Detect if user is on low battery
 */
export function useBatteryStatus() {
  const [isLowBattery, setIsLowBattery] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(true);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryStatus = () => {
          setBatteryLevel(battery.level * 100);
          setIsCharging(battery.charging);
          setIsLowBattery(battery.level < 0.2 && !battery.charging);
        };

        updateBatteryStatus();
        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', updateBatteryStatus);

        return () => {
          battery.removeEventListener('levelchange', updateBatteryStatus);
          battery.removeEventListener('chargingchange', updateBatteryStatus);
        };
      });
    }
  }, []);

  return { isLowBattery, batteryLevel, isCharging };
}

/**
 * Reduce animation framerates on low battery
 */
export function getAnimationDuration(baseMs: number, isLowBattery: boolean): number {
  if (isLowBattery) {
    return baseMs * 2; // Double duration = half framerate
  }
  return baseMs;
}

/**
 * Passive event listener options
 */
export const passiveEventOptions = { passive: true };

/**
 * Pause timers when page is hidden
 */
export function useBackgroundPause() {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isVisible;
}

/**
 * Request idle callback polyfill
 */
export function requestIdleCallbackPolyfill(callback: () => void, timeout = 1000) {
  if ('requestIdleCallback' in window) {
    return requestIdleCallback(callback, { timeout });
  } else {
    return setTimeout(callback, 1) as any;
  }
}

/**
 * Cancel idle callback polyfill
 */
export function cancelIdleCallbackPolyfill(id: number) {
  if ('cancelIdleCallback' in window) {
    cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Prefetch resources on idle
 */
export function prefetchOnIdle(urls: string[]) {
  requestIdleCallbackPolyfill(() => {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  });
}

/**
 * Low power mode detection
 */
export function useLowPowerMode() {
  const { isLowBattery } = useBatteryStatus();
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);

  useEffect(() => {
    // Enable low power mode if battery is low or device is slow
    const isSlowDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
    setIsLowPowerMode(isLowBattery || isSlowDevice);
  }, [isLowBattery]);

  return isLowPowerMode;
}

/**
 * Reduce render frequency on low power
 */
export function useAdaptiveRendering() {
  const isLowPowerMode = useLowPowerMode();
  const [shouldSkipRender, setShouldSkipRender] = useState(false);
  const renderCount = useCallback(() => {
    let count = 0;
    return () => {
      count++;
      if (isLowPowerMode && count % 2 === 0) {
        setShouldSkipRender(true);
      } else {
        setShouldSkipRender(false);
      }
    };
  }, [isLowPowerMode])();

  return { shouldSkipRender, renderCount };
}
