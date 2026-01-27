/**
 * Battery optimization utilities
 * Reduces CPU usage and battery drain
 */

import { useEffect, useState, useCallback } from "react";

/**
 * Detect if user is on low battery
 */
export function useBatteryStatus() {
  const [isLowBattery, setIsLowBattery] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(true);

  useEffect(() => {
    // SSR / non-browser guard
    if (typeof navigator === "undefined") return;

    // Battery API is not supported everywhere (Safari, etc.)
    if (!("getBattery" in navigator)) return;

    let cleanup: (() => void) | undefined;

    (navigator as any)
      .getBattery()
      .then((battery: any) => {
        const updateBatteryStatus = () => {
          setBatteryLevel(battery.level * 100);
          setIsCharging(battery.charging);
          setIsLowBattery(battery.level < 0.2 && !battery.charging);
        };

        updateBatteryStatus();
        battery.addEventListener("levelchange", updateBatteryStatus);
        battery.addEventListener("chargingchange", updateBatteryStatus);

        cleanup = () => {
          battery.removeEventListener("levelchange", updateBatteryStatus);
          battery.removeEventListener("chargingchange", updateBatteryStatus);
        };
      })
      .catch(() => {
        // ignore
      });

    return () => {
      cleanup?.();
    };
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
export const passiveEventOptions: AddEventListenerOptions = { passive: true };

/**
 * Pause timers when page is hidden
 */
export function useBackgroundPause() {
  // SSR guard
  const [isVisible, setIsVisible] = useState(() => (typeof document === "undefined" ? true : !document.hidden));

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
}

/**
 * Request idle callback polyfill
 */
export function requestIdleCallbackPolyfill(callback: () => void, timeout = 1000) {
  if (typeof window === "undefined") return 0 as any;

  if ("requestIdleCallback" in window) {
    return (window as any).requestIdleCallback(callback, { timeout });
  } else {
    return setTimeout(callback, 1) as any;
  }
}

/**
 * Cancel idle callback polyfill
 */
export function cancelIdleCallbackPolyfill(id: number) {
  if (typeof window === "undefined") return;

  if ("cancelIdleCallback" in window) {
    (window as any).cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Prefetch resources on idle
 */
export function prefetchOnIdle(urls: string[]) {
  if (typeof document === "undefined") return;

  requestIdleCallbackPolyfill(() => {
    urls.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
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
    const hc = typeof navigator !== "undefined" ? navigator.hardwareConcurrency : undefined;
    const isSlowDevice = Boolean(hc && hc <= 2); // <-- force boolean (fixes boolean | 0 issue)
    setIsLowPowerMode(Boolean(isLowBattery || isSlowDevice));
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
