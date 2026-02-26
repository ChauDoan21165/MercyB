// src/lib/performance/lazy-routes.tsx
// BUILD-SAFE FIX
// Several lazily imported pages do not exist in the repo, causing TS2307.
// We keep lazy-loading for existing pages and provide safe fallbacks for missing ones.

import React, { lazy } from "react";

/**
 * Simple placeholder used when a page does not exist yet.
 * Prevents build failure while preserving route structure.
 */
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-8 text-center text-muted-foreground">
      <h1 className="text-xl font-semibold mb-2">{title}</h1>
      <p>This page is not implemented yet.</p>
    </div>
  );
}

/* ===============================
   Admin pages (lazy if exist)
================================ */

export const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));

export const UnifiedHealthCheck = () => (
  <PlaceholderPage title="Unified Health Check" />
);

export const RoomSpecificationManager = () => (
  <PlaceholderPage title="Room Specification Manager" />
);

export const DeepScanPanel = () => <PlaceholderPage title="Deep Scan Panel" />;

/* ===============================
   Kids pages
================================ */

export const KidsChat = () => <PlaceholderPage title="Kids Chat" />;

export const KidsLevelSelector = () => (
  <PlaceholderPage title="Kids Level Selector" />
);

/* ===============================
   VIP9 Strategy Page
================================ */

export const VIP9Page = () => <PlaceholderPage title="VIP9 Page" />;

/* ===============================
   Payment pages
================================ */

export const PaymentTest = () => <PlaceholderPage title="Payment Test" />;

export const PaymentVerification = () => (
  <PlaceholderPage title="Payment Verification" />
);

/* ===============================
   Route loading fallback
================================ */

export const RouteLoadingFallback = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
  </div>
);