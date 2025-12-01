/**
 * Performance Optimization Utilities
 * Central export for all performance features
 */

export * from './code-splitting';
export * from './memory-optimization';
export * from './battery-optimization';
export * from './virtualization';
export * from './bundle-optimization';
export * from './worker-utils';

// Re-export commonly used utilities
export {
  lazyLoad,
  preloadComponent,
  prefetchRoute,
  preloadCriticalRoutes,
} from './code-splitting';

export {
  throttle,
  debounce,
  useThrottle,
  useDebounce,
  useCleanupTimers,
  useVisibilityPause,
  LRUCache,
} from './memory-optimization';

export {
  useBatteryStatus,
  useBackgroundPause,
  useLowPowerMode,
  prefetchOnIdle,
  passiveEventOptions,
} from './battery-optimization';

export {
  shouldVirtualize,
  useListVirtualization,
  useGridVirtualization,
  VirtualScroll,
  VirtualGrid,
  VIRTUALIZATION_THRESHOLD,
} from './virtualization';

export {
  dynamicImport,
  preloadResource,
  preconnect,
  dnsPrefetch,
  optimizeImageUrl,
} from './bundle-optimization';

export {
  runInWorker,
  parseJSONInWorker,
  WorkerPool,
  validateLinksInWorker,
  deepScanInWorker,
} from './worker-utils';
