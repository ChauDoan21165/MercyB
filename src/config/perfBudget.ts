// Frontend performance budget.
//
// Two flavours of budget here:
//   - Per-metric thresholds (LCP / FID / CLS / TTFB / FCP / INP) — Google's
//     Core Web Vitals "good" cut-offs, with a "warning" band before "poor".
//   - Bundle-size ceilings — total + per-page (per chunk) limits used by
//     scripts/track-bundle-size.ts as a build-time gate.
//
// Companion modules:
//   - src/lib/perf/webVitalsTracking.ts (collects + reports the metrics)
//   - src/pages/admin/FrontendPerformance.tsx (visualises trend)
//   - scripts/track-bundle-size.ts (build-time bundle gate)
//   - supabase/functions/perf-alert/ (slow-route alert cron)

export type WebVitalName = "LCP" | "FID" | "CLS" | "TTFB" | "FCP" | "INP";

export type VitalRating = "good" | "needs_improvement" | "poor" | "no_data";

export interface VitalThreshold {
  /** Below or equal → good. */
  good: number;
  /** Above good but ≤ this → needs_improvement. Above → poor. */
  needsImprovement: number;
  /** Display label for the dashboard. */
  label: string;
  labelVi: string;
  /** Unit shown to humans. CLS is unitless; others are ms. */
  unit: "ms" | "score";
}

/**
 * Google Core Web Vitals "good" / "needs improvement" cutoffs.
 * Sources: web.dev/vitals + 2024 INP replacing FID guidance.
 */
export const WEB_VITAL_THRESHOLDS: Record<WebVitalName, VitalThreshold> = {
  LCP: {
    good: 2500,
    needsImprovement: 4000,
    label: "Largest Contentful Paint",
    labelVi: "Tải nội dung lớn nhất (LCP)",
    unit: "ms",
  },
  FID: {
    good: 100,
    needsImprovement: 300,
    label: "First Input Delay",
    labelVi: "Độ trễ tương tác đầu tiên (FID)",
    unit: "ms",
  },
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
    label: "Cumulative Layout Shift",
    labelVi: "Dịch chuyển bố cục (CLS)",
    unit: "score",
  },
  TTFB: {
    good: 800,
    needsImprovement: 1800,
    label: "Time to First Byte",
    labelVi: "Thời gian đến byte đầu (TTFB)",
    unit: "ms",
  },
  FCP: {
    good: 1800,
    needsImprovement: 3000,
    label: "First Contentful Paint",
    labelVi: "Hiển thị nội dung đầu (FCP)",
    unit: "ms",
  },
  INP: {
    good: 200,
    needsImprovement: 500,
    label: "Interaction to Next Paint",
    labelVi: "Tương tác đến vẽ kế tiếp (INP)",
    unit: "ms",
  },
};

export function rateVital(name: WebVitalName, value: number): VitalRating {
  if (!Number.isFinite(value) || value < 0) return "no_data";
  const t = WEB_VITAL_THRESHOLDS[name];
  if (!t) return "no_data";
  if (value <= t.good) return "good";
  if (value <= t.needsImprovement) return "needs_improvement";
  return "poor";
}

// ── Bundle size budgets ──────────────────────────────────────────────

export interface BundleBudget {
  /** Total JS+CSS shipped in the production build (bytes). */
  totalBytes: number;
  /** Largest single chunk (bytes). */
  perChunkBytes: number;
  /** Allowed % growth vs last recorded baseline before the build script
   *  WARNS (not fails) by default. Pass --strict to fail. */
  warnGrowthPercent: number;
}

export const BUNDLE_BUDGET: BundleBudget = {
  totalBytes: 500 * 1024,
  perChunkBytes: 200 * 1024,
  warnGrowthPercent: 5,
};

// ── Slow-route alert ─────────────────────────────────────────────────

export const PERF_ALERT_RULES = {
  /** Alert when route P95 LCP exceeds this for the alert window. */
  LCP_ALERT_MS: 4000,
  /** Window over which we measure the route's P95. */
  ALERT_WINDOW_HOURS: 1,
  /** Min sample count required before any alert. */
  MIN_SAMPLES: 10,
  /** Dedup window per route. */
  DEDUP_HOURS: 4,
} as const;

/**
 * Roughly classify a viewport into 'mobile' / 'desktop'. We don't track
 * device model — only this coarse cohort. Bucketing on the dashboard
 * uses this label.
 */
export function classifyDevice(innerWidth: number): "mobile" | "desktop" {
  return innerWidth < 768 ? "mobile" : "desktop";
}
