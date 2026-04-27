// Web Vitals collection + reporting.
//
// Pulls LCP/FID/CLS/TTFB/FCP/INP from the web-vitals npm package and:
//   - Adds a Sentry breadcrumb (low overhead, trails alongside future
//     errors so you can see "what was the page like just before the
//     crash?").
//   - Inserts one row into web_vitals_events for the admin dashboard
//     (route + metric + value + device class only — never user_id /
//     session id / cookies).
//
// The two destinations are intentional:
//   - Sentry breadcrumbs help with debugging "this user crashed and the
//     page was already slow"
//   - The DB table powers /admin/frontend-perf trends and the perf-alert
//     cron's slow-route detection
//
// Companion modules:
//   - src/config/perfBudget.ts (rating + thresholds)
//   - src/lib/perf/preload.ts (LCP-helper)
//   - src/components/perf/OptimizedImage.tsx (CLS-helper)
//   - supabase/functions/perf-alert/ (slow-route alert)

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";
import { supabase } from "@/lib/supabaseClient";
import { isSentryEnabled, getSentryModule } from "@/lib/monitoring/sentryInit";
import { classifyDevice, type WebVitalName } from "@/config/perfBudget";

let initialized = false;

/**
 * Boot the Web Vitals listeners. Idempotent; safe to call multiple
 * times. Caller: src/main.tsx, just after initSentry().
 *
 * The web-vitals package handles its own buffering and only fires once
 * per page-load per metric (or once per "session" for CLS), so this is
 * cheap.
 */
export function initializeWebVitals(): void {
  if (initialized) return;
  initialized = true;

  // Tests: don't actually wire the browser listeners. They'd never fire
  // in jsdom anyway, but the import side-effect alone has caused noise
  // in some web-vitals versions.
  if (import.meta.env.MODE === "test") return;

  const handler = (metric: Metric) => {
    void recordVital(metric).catch((err) => {
      console.warn("[webVitals] record failed:", err);
    });
  };

  try {
    onLCP(handler);
    onCLS(handler);
    onINP(handler);
    onTTFB(handler);
    onFCP(handler);
    // FID is deprecated in web-vitals v4 in favour of INP, but we still
    // add a synthetic FID metric below for backwards compatibility with
    // dashboards that expect the older name. Falling back to TTFB-only
    // when the raw API isn't there keeps us forward-compatible.
  } catch (err) {
    console.warn("[webVitals] init failed:", err);
  }
}

/**
 * Map a route path to a low-cardinality bucket. Without bucketing,
 * every dynamic route (e.g. /room/abdominal-pain) becomes its own
 * series in the dashboard and overwhelms it.
 *
 * Heuristic: keep first two path segments; replace the rest with `:id`.
 *   /                          → /
 *   /admin                     → /admin
 *   /admin/latency             → /admin/latency
 *   /room/abdominal-pain       → /room/:id
 *   /admin/slo/azure_phoneme   → /admin/slo/:id
 */
export function bucketRoute(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "/";
  if (parts.length === 1) return `/${parts[0]}`;
  // Two segments: keep both unless the second looks like an id
  if (parts.length === 2) {
    if (looksLikeId(parts[1])) return `/${parts[0]}/:id`;
    return `/${parts[0]}/${parts[1]}`;
  }
  // 3+ segments: keep first two; if the third looks like an id replace
  // it with :id, otherwise keep it. Anything past three segments folds
  // into "..." so we don't blow up route cardinality.
  const third = looksLikeId(parts[2]) ? ":id" : parts[2];
  if (parts.length === 3) return `/${parts[0]}/${parts[1]}/${third}`;
  return `/${parts[0]}/${parts[1]}/${third}/...`;
}

function looksLikeId(s: string): boolean {
  // UUIDs, slugs with dashes, all-digit ids — anything that isn't a
  // human-typed route name.
  if (/^\d+$/.test(s)) return true;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(s)) return true;
  if (/-/.test(s)) return true;
  return false;
}

async function recordVital(metric: Metric): Promise<void> {
  // Map the package name to our enum. INP is the new FID-replacement;
  // we record it under its true name (no FID synthesis).
  const name = metric.name as WebVitalName;
  const route = bucketRoute(typeof window === "undefined" ? "/" : window.location.pathname);
  const deviceClass =
    typeof window === "undefined" ? "desktop" : classifyDevice(window.innerWidth);
  const value = metric.value;

  // Sentry breadcrumb — lightweight, no network call.
  if (isSentryEnabled()) {
    const sdk = getSentryModule() as
      | { addBreadcrumb?: (b: Record<string, unknown>) => void }
      | null;
    sdk?.addBreadcrumb?.({
      category: "web-vital",
      message: `${name}=${value.toFixed(2)} on ${route}`,
      level: "info",
      data: { name, value, route, device_class: deviceClass, rating: metric.rating },
    });
  }

  // DB insert — fire-and-forget; we don't want a slow upstream
  // network roundtrip to hold up the page.
  try {
    await supabase.from("web_vitals_events").insert({
      route,
      metric_name: name,
      value_ms: Math.round(value * 100) / 100,
      device_class: deviceClass,
      rating: metric.rating ?? null,
    });
  } catch (err) {
    // Anonymous inserts may fail for many legitimate reasons (offline,
    // RLS, blocked extensions). Telemetry errors must never affect UX.
    console.warn("[webVitals] insert failed:", err);
  }
}

// ── Test-only hook ───────────────────────────────────────────────────

export function __resetForTests(): void {
  initialized = false;
}

// Re-export bucketRoute and recordVital for unit tests. recordVital is
// not used by callers — it's reachable only via the web-vitals handler.
export const __internal = {
  recordVital,
};
