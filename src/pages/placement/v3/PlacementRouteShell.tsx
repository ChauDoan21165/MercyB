// src/pages/placement/v3/PlacementRouteShell.tsx
//
// Single top-level shell that owns the route-mount lifecycle for
// each /placement v3 page (Welcome / WhoFor / Test / Results /
// Resume / SkipConfirm). The shell mounts directly in each route so:
//
//   - /placement route availability matches Chau's June 12 product
//     decision: always reachable for everyone.
//   - Each placement route emits a single mount-perf breadcrumb via
//     `reportRouteMountPerf`.
//
// Observer-only contract: the shell renders its children verbatim
// (`<>{children}</>`) and adds exactly one `useEffect([routeName])`
// that calls `reportRouteMountPerf`. No state, no UI, no conditional
// rendering, no new network. Zero behavior change to the placement
// flow itself — this file is purely about getting a perf signal out
// of the multi-route flow without forcing every page to duplicate
// the same useRef + useEffect prologue.

import { useEffect, useRef, type ReactNode } from "react";

import { reportRouteMountPerf } from "@/lib/monitoring/routePerf";

export interface PlacementRouteShellProps {
  /**
   * Low-cardinality stable identifier for this route's mount signal.
   * One of: `placement_welcome`, `placement_who_for`, `placement_test`,
   * `placement_results`, `placement_resume`, `placement_skip_confirm`.
   * Never a dynamic route-param value, never user-content.
   */
  routeName: string;
  children: ReactNode;
}

export default function PlacementRouteShell({
  routeName,
  children,
}: PlacementRouteShellProps) {
  // Captured first so the elapsed time covers React's commit step
  // for this shell + the wrapped LazyPage's first paint.
  const mountStartRef = useRef<number>(performance.now());
  useEffect(() => {
    reportRouteMountPerf(routeName, performance.now() - mountStartRef.current);
    // routeName is the single mount-perf identifier; if it ever
    // changes (it shouldn't — each Route wraps a distinct one),
    // re-measuring is the safe default.
  }, [routeName]);

  return <>{children}</>;
}
