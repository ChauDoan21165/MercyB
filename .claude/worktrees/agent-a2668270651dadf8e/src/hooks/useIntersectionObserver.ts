// src/hooks/useIntersectionObserver.ts — v2025-12-21-88.2-INTERSECTION-HARDENED
import { useEffect, useState, RefObject } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

/**
 * useIntersectionObserver
 *
 * Hardened:
 * - SSR safe
 * - No observer recreation loops
 * - Freeze-on-visible truly freezes
 * - Calm transitions (no flicker on scroll jitter)
 */
export const useIntersectionObserver = (
  elementRef: RefObject<Element>,
  options: UseIntersectionObserverOptions = {}
): boolean => {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = "0px",
    freezeOnceVisible = true,
  } = options;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // SSR guard
    if (typeof window === "undefined") return;

    const element = elementRef.current;
    if (!element) return;

    // If frozen and already visible → do nothing forever
    if (isVisible && freezeOnceVisible) return;

    let observer: IntersectionObserver | null = null;

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (freezeOnceVisible && observer) {
            observer.disconnect();
            observer = null;
          }
        } else if (!freezeOnceVisible) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    };
  }, [
    elementRef,
    threshold,
    root,
    rootMargin,
    freezeOnceVisible,
    isVisible,
  ]);

  return isVisible;
};
