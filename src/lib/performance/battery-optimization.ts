/**
 * Battery optimization utilities
 * Reduces CPU usage and battery drain
 */

import { useEffect, useState, useCallback } from "react";

type BatteryManager = EventTarget & {
  level: number;
  charging: boolean;
};

type NavigatorWithBattery = Navigator & {
  getBattery?: () => Promise<BatteryManager>;
};

type WindowWithIdleCallback = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

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

    let cleanup: (() => void) | undefined;

    const navigatorWithBattery = navigator as NavigatorWithBattery;

    if (typeof navigatorWithBattery.getBattery === "function") {
      navigatorWithBattery
        .getBattery()
        .then((battery: unknown) => {
          const typedBattery = battery as BatteryManager;
          const updateBatteryStatus = () => {
            setBatteryLevel(typedBattery.level * 100);
            setIsCharging(Boolean(typedBattery.charging));
            setIsLowBattery(typedBattery.level < 0.2 && !typedBattery.charging);
          };

          updateBatteryStatus();
          typedBattery.addEventListener("levelchange", updateBatteryStatus);
          typedBattery.addEventListener("chargingchange", updateBatteryStatus);

          cleanup = () => {
            typedBattery.removeEventListener("levelchange", updateBatteryStatus);
            typedBattery.removeEventListener("chargingchange", updateBatteryStatus);
          };
        })
        .catch(() => {
          // ignore: Battery API not available / permission denied
        });
    }

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
export const passiveEventOptions = { passive: true };

/**
 * Pause timers when page is hidden
 */
export function useBackgroundPause() {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof document === "undefined") return true;
    return !document.hidden;
  });

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
  if (typeof window === "undefined") {
    // SSR fallback
    return setTimeout(callback, 1) as unknown;
  }

  const windowWithIdleCallback = window as WindowWithIdleCallback;

  if (typeof windowWithIdleCallback.requestIdleCallback === "function") {
    return windowWithIdleCallback.requestIdleCallback(callback, { timeout });
  } else {
    return setTimeout(callback, 1) as unknown;
  }
}

/**
 * Cancel idle callback polyfill
 */
export function cancelIdleCallbackPolyfill(id: number) {
  if (typeof window === "undefined") {
    clearTimeout(id);
    return;
  }

  const windowWithIdleCallback = window as WindowWithIdleCallback;

  if (typeof windowWithIdleCallback.cancelIdleCallback === "function") {
    windowWithIdleCallback.cancelIdleCallback(id);
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
    if (typeof navigator === "undefined") {
      setIsLowPowerMode(isLowBattery);
      return;
    }

    // Enable low power mode if battery is low or device is slow
    const hc = navigator.hardwareConcurrency ?? 0;
    const isSlowDevice = hc > 0 && hc <= 2; // ✅ always boolean
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
