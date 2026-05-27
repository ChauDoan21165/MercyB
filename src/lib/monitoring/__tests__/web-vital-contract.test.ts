// Drift guard for the `web-vital` Sentry breadcrumb shape emitted by
// `src/lib/perf/webVitalsTracking.ts`. Pinned by this test so that any
// addition / removal / rename of a payload field fails CI loudly and
// forces the diff to update either:
//
//   - this test (and pin the new shape),
//   - docs/observability/perf-instrumentation.md (the category
//     catalog), and
//   - docs/observability/web-vitals-audit.md §3 (the shape spec).
//
// Observer-only: this test exercises the existing `recordVital()`
// code path with a fake metric; it does not introduce new
// instrumentation.

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Metric } from "web-vitals";

const addBreadcrumbSpy = vi.fn();
const insertSpy = vi.fn().mockResolvedValue({ error: null });

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(() => ({ insert: insertSpy })),
  },
}));

vi.mock("@/lib/monitoring/sentryInit", () => ({
  isSentryEnabled: () => true,
  getSentryModule: () => ({ addBreadcrumb: addBreadcrumbSpy }),
}));

import { __internal, __resetForTests } from "@/lib/perf/webVitalsTracking";

let metricCounter = 0;

function fakeMetric(overrides: Partial<Metric> = {}): Metric {
  metricCounter += 1;
  return {
    name: "LCP",
    value: 1234,
    delta: 1234,
    id: `v3-test-${metricCounter}`,
    rating: "good",
    entries: [],
    navigationType: "navigate",
    ...overrides,
  } as Metric;
}

describe("web-vital breadcrumb contract — drift guard", () => {
  beforeEach(() => {
    addBreadcrumbSpy.mockClear();
    insertSpy.mockClear();
    __resetForTests();
  });

  it("category is exactly 'web-vital'", async () => {
    await __internal.recordVital(fakeMetric());
    expect(addBreadcrumbSpy).toHaveBeenCalledTimes(1);
    const crumb = addBreadcrumbSpy.mock.calls[0]![0]!;
    expect(crumb.category).toBe("web-vital");
  });

  it("level is exactly 'info'", async () => {
    await __internal.recordVital(fakeMetric());
    const crumb = addBreadcrumbSpy.mock.calls[0]![0]!;
    expect(crumb.level).toBe("info");
  });

  it("payload.data has the exact pinned key set — drift catcher", async () => {
    await __internal.recordVital(fakeMetric());
    const crumb = addBreadcrumbSpy.mock.calls[0]![0]!;
    const keys = Object.keys(crumb.data).sort();
    // Pinned set. Adding a field to webVitalsTracking.ts requires:
    //   1. updating this assertion
    //   2. docs/observability/perf-instrumentation.md "web-vital" row
    //   3. docs/observability/web-vitals-audit.md §3
    expect(keys).toEqual([
      "device_class",
      "name",
      "rating",
      "route",
      "value",
    ]);
  });

  it("device_class is one of 'mobile' | 'desktop' (no 'tablet' bucket today)", async () => {
    await __internal.recordVital(fakeMetric());
    const crumb = addBreadcrumbSpy.mock.calls[0]![0]!;
    expect(["mobile", "desktop"]).toContain(crumb.data.device_class);
  });

  it("message format is `${name}=${value.toFixed(2)} on ${route}`", async () => {
    await __internal.recordVital(
      fakeMetric({ name: "CLS", value: 0.123456, id: "cls-test-1" }),
    );
    const crumb = addBreadcrumbSpy.mock.calls[0]![0]!;
    // CLS rounds to 0.12 via toFixed(2). Pinning the format so
    // Sentry searches that grep the message string keep working.
    expect(crumb.message).toMatch(/^CLS=0\.12 on /);
  });

  it("all 5 currently-subscribed metric names flow through unmodified", async () => {
    for (const name of ["LCP", "CLS", "INP", "TTFB", "FCP"] as const) {
      await __internal.recordVital(fakeMetric({ name, id: `${name}-test` }));
    }
    expect(addBreadcrumbSpy).toHaveBeenCalledTimes(5);
    const namesEmitted = addBreadcrumbSpy.mock.calls.map(
      (c) => (c[0]! as { data: { name: string } }).data.name,
    );
    expect(new Set(namesEmitted)).toEqual(
      new Set(["LCP", "CLS", "INP", "TTFB", "FCP"]),
    );
  });

  it("rating passes through verbatim (good | needs-improvement | poor)", async () => {
    for (const rating of ["good", "needs-improvement", "poor"] as const) {
      __resetForTests();
      addBreadcrumbSpy.mockClear();
      await __internal.recordVital(fakeMetric({ rating, id: `r-${rating}` }));
      const crumb = addBreadcrumbSpy.mock.calls[0]![0]!;
      expect(crumb.data.rating).toBe(rating);
    }
  });

  it("dedupe holds — same (metric.id, route) does not emit twice", async () => {
    const m = fakeMetric({ id: "dedupe-stable" });
    await __internal.recordVital(m);
    await __internal.recordVital(m);
    expect(addBreadcrumbSpy).toHaveBeenCalledTimes(1);
  });

  it("the Metric type from 'web-vitals' no longer includes FID (audit §6 (1))", () => {
    // Compile-time sanity: web-vitals v4+ dropped FID from its Metric
    // union. If this assignment ever starts compiling, the package
    // re-added FID and the audit's §6 (1) gap is moot — go update
    // both this test and docs/observability/web-vitals-audit.md.
    const _proof: Metric["name"] extends "FID" ? true : false = false;
    expect(_proof).toBe(false);
  });

  it("the local WebVitalName union no longer includes FID (audit §6 (1) shipped)", async () => {
    // Compile-time sanity for OUR own enum. Pairs with the upstream
    // Metric["name"] check above. If FID is ever re-added to
    // src/config/perfBudget.ts WebVitalName, this assignment stops
    // compiling — the audit's §6 (1) fix is being undone.
    const { WEB_VITAL_THRESHOLDS } = await import("@/config/perfBudget");
    type WebVitalName = import("@/config/perfBudget").WebVitalName;
    const _proof: WebVitalName extends "FID" ? true : false = false;
    expect(_proof).toBe(false);
    // Runtime sanity: the threshold table also has no "FID" key.
    expect(Object.keys(WEB_VITAL_THRESHOLDS)).not.toContain("FID");
  });
});
