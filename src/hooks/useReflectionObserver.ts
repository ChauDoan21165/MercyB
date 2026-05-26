import { useEffect, useRef, useCallback } from 'react';

interface UseReflectionObserverOptions {
  onVisible: () => void;
  threshold?: number;
}

/**
 * Hook to detect when reflection section becomes visible
 * Uses IntersectionObserver for efficient scroll detection
 */
export function useReflectionObserver(options: UseReflectionObserverOptions) {
  const { onVisible, threshold = 0.5 } = options;
  const elementRef = useRef<HTMLElement | null>(null);
  const hasTriggeredRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setRef = useCallback((element: HTMLElement | null) => {
    // Cleanup previous observer
    if (observerRef.current && elementRef.current) {
      observerRef.current.unobserve(elementRef.current);
    }

    elementRef.current = element;

    if (!element) return;

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            onVisible();
          }
        });
      },
      { threshold }
    );

    observerRef.current.observe(element);
  }, [onVisible, threshold]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Reset trigger state
  const reset = useCallback(() => {
    hasTriggeredRef.current = false;
  }, []);

  return { ref: setRef, reset };
}
