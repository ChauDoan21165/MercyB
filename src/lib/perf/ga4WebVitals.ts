// GA4 Real-User-Monitoring sink for Web Vitals.
//
// The web-vitals collector (./webVitalsTracking.ts) already observes
// LCP/INP/CLS/TTFB (+FCP) and routes them to Sentry breadcrumbs and the
// web_vitals_events table. This module adds the GA4 destination requested for
// app-strength RUM: it forwards the four Core Web Vitals to the EXISTING GA4
// property via `window.gtag` events. It adds no new analytics provider and
// fails silent whenever GA4/gtag is unavailable, so telemetry never affects UX.
//
// Flag/env gating (OFF in dev, ON in prod) is enforced at the call site in
// webVitalsTracking.ts via `import.meta.env.PROD`; this function stays pure and
// side-effect-light so it is easy to unit-test.

import type { Metric } from "web-vitals";
import type { WebVitalName } from "@/config/perfBudget";

// Only the four Core Web Vitals the RUM dispatch asked for. FCP is collected by
// the pipeline for other sinks but intentionally not forwarded to GA4.
const GA4_REPORTED_VITALS: readonly WebVitalName[] = ["LCP", "INP", "CLS", "TTFB"];

type GtagFn = (...args: unknown[]) => void;

function getGtag(): GtagFn | null {
  if (typeof window === "undefined") return null;
  const candidate = (window as unknown as { gtag?: unknown }).gtag;
  return typeof candidate === "function" ? (candidate as GtagFn) : null;
}

/**
 * GA4's recommended value encoding: CLS is unitless (a small fraction) and is
 * multiplied by 1000 so it lands as a usable integer; the others are already in
 * milliseconds. Either way GA4 wants a rounded non-negative integer.
 */
function ga4Value(metric: Metric): number {
  const raw = metric.name === "CLS" ? metric.value * 1000 : metric.value;
  return Math.max(0, Math.round(raw));
}

/**
 * Forward one Web Vital to GA4 via gtag. No-ops (fail silent) when the metric is
 * not one of the four Core Web Vitals or when gtag is unavailable.
 */
export function sendWebVitalToGa4(metric: Metric): void {
  if (!GA4_REPORTED_VITALS.includes(metric.name as WebVitalName)) return;
  const gtag = getGtag();
  if (!gtag) return;

  try {
    gtag("event", metric.name, {
      event_category: "Web Vitals",
      // GA4's numeric metric field (integer); see ga4Value for CLS scaling.
      value: ga4Value(metric),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
      // RUM beacons are passive — do not count as user engagement.
      non_interaction: true,
    });
  } catch {
    // Telemetry must never throw into the page. Fail silent.
  }
}
