/**
 * Path: src/components/monitoring/SentryUserBinding.tsx
 *
 * Render-free component that binds the live auth + access state to the
 * Sentry scope. Mount inside the AuthProvider tree (in main.tsx) so
 * `tagWithUser` / clearUser fire on every session transition without
 * touching every caller.
 *
 * Also pushes a `route` tag and a `navigation` breadcrumb on every
 * pathname change. Route patterns are normalized (`:id` placeholders)
 * to keep tag cardinality bounded — raw pathnames would create one
 * Sentry tag value per room, blowing the index.
 */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";
import { useUserAccess } from "@/hooks/useUserAccess";
import {
  applySentryContext,
  applySentryRoute,
} from "@/lib/monitoring/sentryContext";
import { addBreadcrumb } from "@/lib/monitoring/captureException";

/**
 * Replace dynamic path segments with placeholders so tag cardinality
 * stays bounded. Tuned to the actual MercyBlade routes; falls through
 * unchanged for paths that don't match a known dynamic shape.
 */
export function normalizeRoutePattern(pathname: string): string {
  if (!pathname) return "/";
  // /room/<anything>     → /room/:roomId
  // /tiers/<anything>    → /tiers/:tierId
  // /blog/<anything>     → /blog/:slug
  // /seo/<anything>      → /seo/:slug
  // /placement/<anything>→ /placement/:step
  return pathname
    .replace(/^\/room\/[^/]+/, "/room/:roomId")
    .replace(/^\/tiers\/[^/]+/, "/tiers/:tierId")
    .replace(/^\/blog\/[^/]+/, "/blog/:slug")
    .replace(/^\/seo\/[^/]+/, "/seo/:slug")
    .replace(/^\/placement\/[^/]+/, "/placement/:step");
}

export function SentryUserBinding(): null {
  const { user } = useAuth();
  const access = useUserAccess();
  const location = useLocation();
  const lastRouteRef = useRef<string | null>(null);

  // Push user_id + tier whenever the live snapshot changes.
  useEffect(() => {
    applySentryContext({
      isAuthenticated: access.isAuthenticated,
      loading: access.loading,
      isHighAdmin: access.isHighAdmin,
      hasPremium: access.hasPremium,
      isTrialExpired: access.isTrialExpired,
      userId: user?.id ?? null,
    });
  }, [
    user?.id,
    access.isAuthenticated,
    access.loading,
    access.isHighAdmin,
    access.hasPremium,
    access.isTrialExpired,
  ]);

  // Route tag + navigation breadcrumb. Skip the first paint to avoid a
  // synthetic crumb on cold load (the page-load is already visible from
  // the captured event's URL).
  useEffect(() => {
    const pattern = normalizeRoutePattern(location.pathname);
    applySentryRoute(pattern);

    if (lastRouteRef.current && lastRouteRef.current !== pattern) {
      addBreadcrumb({
        category: "navigation",
        level: "info",
        message: `${lastRouteRef.current} → ${pattern}`,
        data: { from: lastRouteRef.current, to: pattern },
      });
    }
    lastRouteRef.current = pattern;
  }, [location.pathname]);

  return null;
}
