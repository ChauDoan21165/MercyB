// src/routes/AppRoutes.tsx
// MB-BLUE-94.13.28 — 2025-12-26 (+0700)
/**
 * MercyBlade Blue — DEAD ROUTER (DO NOT USE)
 *
 * STATUS:
 * - OBSOLETE. This file MUST NOT be used for routing.
 * - Kept ONLY as a tripwire to detect accidental imports.
 *
 * RULES (LOCKED):
 * - ONLY active router is: src/router/AppRouter.tsx
 * - main.tsx owns <BrowserRouter> exactly once
 * - App.tsx delegates routing to AppRouter only
 *
 * Why this file is dangerous:
 * - If this renders, it overrides the real router and causes phantom 404/redirect bugs.
 *
 * Behavior:
 * - DEV: throw a hard error (fastest proof + forces fix)
 * - PROD: redirect to "/" (avoid trapping user)
 */

import { Navigate } from "react-router-dom";

export default function AppRoutes() {
  const msg =
    "❌ DEAD ROUTER RENDERED: src/routes/AppRoutes.tsx. " +
    "Fix imports to use ONLY src/router/AppRouter.tsx.";

  // Always visible signal
  console.error(msg);

  // HARD PROOF in dev (we WANT it to crash so we find the importer immediately)
  if (import.meta.env.DEV) {
    throw new Error(msg);
  }

  // Safety fallback in prod
  return <Navigate to="/" replace />;
}
