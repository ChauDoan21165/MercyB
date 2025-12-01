/**
 * Lazy-loaded route components
 * Code splitting for heavy pages to reduce initial bundle size
 */

import { lazy } from 'react';

// Admin pages (heavy - only load when needed)
export const AdminDashboard = lazy(() =>
  import('@/pages/admin/AdminDashboard').then(m => ({ default: m.default }))
);

export const UnifiedHealthCheck = lazy(() =>
  import('@/pages/admin/UnifiedHealthCheck').then(m => ({ default: m.default }))
);

export const RoomSpecificationManager = lazy(() =>
  import('@/pages/admin/RoomSpecificationManager').then(m => ({ default: m.default }))
);

export const DeepScanPanel = lazy(() =>
  import('@/pages/admin/DeepScanPanel').then(m => ({ default: m.default }))
);

// Kids pages
export const KidsChat = lazy(() =>
  import('@/pages/KidsChat').then(m => ({ default: m.default }))
);

export const KidsLevelSelector = lazy(() =>
  import('@/pages/KidsLevelSelector').then(m => ({ default: m.default }))
);

// VIP9 strategy rooms (heavy content)
export const VIP9Page = lazy(() =>
  import('@/pages/VIP9Page').then(m => ({ default: m.default }))
);

// Payment pages
export const PaymentTest = lazy(() =>
  import('@/pages/admin/PaymentTest').then(m => ({ default: m.default }))
);

export const PaymentVerification = lazy(() =>
  import('@/pages/admin/PaymentVerification').then(m => ({ default: m.default }))
);

/**
 * Loading fallback component
 */
export { LoadingSpinner as RouteLoadingFallback } from '@/components/ui/LoadingSpinner';
