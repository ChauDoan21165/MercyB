/**
 * Code-splitting utilities for lazy loading heavy components
 * Reduces initial bundle size and improves app boot speed
 */

import { lazy, Suspense, ComponentType } from 'react';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

/**
 * Lazy load component with custom fallback
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback || <LoadingSkeleton variant="page" />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Preload component for route preloading
 */
export function preloadComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  const LazyComponent = lazy(importFunc);
  // Trigger preload
  void importFunc();
  return LazyComponent;
}

/**
 * Lazy load with retry logic
 */
export function lazyLoadWithRetry<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  retries = 3,
  fallback?: React.ReactNode
) {
  const retry = (fn: () => Promise<any>, retriesLeft: number): Promise<any> => {
    return fn().catch((error) => {
      if (retriesLeft === 0) {
        throw error;
      }
      console.warn(`Component load failed, retrying... (${retriesLeft} attempts left)`);
      return retry(fn, retriesLeft - 1);
    });
  };

  const LazyComponent = lazy(() => retry(importFunc, retries));

  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback || <LoadingSkeleton variant="page" />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Prefetch route data
 */
export function prefetchRoute(path: string) {
  // Use link prefetch
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = path;
  document.head.appendChild(link);
}

/**
 * Preload critical routes on idle
 */
export function preloadCriticalRoutes(routes: string[]) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      routes.forEach(route => prefetchRoute(route));
    });
  } else {
    setTimeout(() => {
      routes.forEach(route => prefetchRoute(route));
    }, 1000);
  }
}
