// FILE: src/simulator/perf/WebVitalsCollector.ts
// Web Vitals Collector — Collect Core Web Vitals metrics in the simulator
// harness. Mirrors the live emitter's subscription set (LCP / INP / CLS /
// TTFB / FCP) but writes into a private report object that the simulator
// reads at the end of a run.
//
// FID was removed in `chore/simulator-drop-fid` — the live `WebVitalName`
// dropped it in `fix/web-vitals-drop-fid`, and the `web-vitals` package's
// `Metric["name"]` union no longer includes it. INP has been the Core
// Web Vital for interactivity since March 2024.

import * as webVitals from "web-vitals";
import type { Metric } from "web-vitals";

export interface WebVitalsReport {
  lcp: number | null; // Largest Contentful Paint
  inp: number | null; // Interaction to Next Paint
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

let vitalsData: WebVitalsReport = {
  lcp: null,
  inp: null,
  cls: null,
  ttfb: null,
};

let collecting = false;

// Some versions/builds of web-vitals return an "unsubscribe" function from onX().
// If present, we store it so stop() actually detaches observers.
let unsubscribers: Array<() => void> = [];

function resetVitalsData() {
  vitalsData = {
    lcp: null,
    inp: null,
    cls: null,
    ttfb: null,
  };
}

function safeRegister(registerFn: () => void | (() => void)) {
  const maybeUnsub = registerFn();
  if (typeof maybeUnsub === "function") {
    unsubscribers.push(maybeUnsub);
  }
}

function cleanupSubscriptions() {
  for (const unsub of unsubscribers) {
    try {
      unsub();
    } catch {
      // ignore unsubscribe errors
    }
  }
  unsubscribers = [];
}

export function startWebVitalsCollection(): void {
  if (collecting) return;
  collecting = true;

  // If start is called again after a stop, ensure we don't leak old listeners.
  cleanupSubscriptions();

  // Reset data
  resetVitalsData();

  // Collect LCP
  safeRegister(() =>
    webVitals.onLCP((metric: Metric) => {
      if (!collecting) return;
      vitalsData.lcp = metric.value;
      // eslint-disable-next-line no-console
      console.log("[WebVitals] LCP:", metric.value);
    }),
  );

  // Collect INP (the Core Web Vital for interactivity; replaced FID in March 2024)
  safeRegister(() =>
    webVitals.onINP((metric: Metric) => {
      if (!collecting) return;
      vitalsData.inp = metric.value;
      // eslint-disable-next-line no-console
      console.log("[WebVitals] INP:", metric.value);
    }),
  );

  // Collect CLS
  safeRegister(() =>
    webVitals.onCLS((metric: Metric) => {
      if (!collecting) return;
      vitalsData.cls = metric.value;
      // eslint-disable-next-line no-console
      console.log("[WebVitals] CLS:", metric.value);
    }),
  );

  // Collect TTFB
  safeRegister(() =>
    webVitals.onTTFB((metric: Metric) => {
      if (!collecting) return;
      vitalsData.ttfb = metric.value;
      // eslint-disable-next-line no-console
      console.log("[WebVitals] TTFB:", metric.value);
    }),
  );

  // eslint-disable-next-line no-console
  console.log("[WebVitalsCollector] Started collecting web vitals");
}

export function stopAndGetWebVitals(): WebVitalsReport {
  collecting = false;

  // Actually detach observers if supported by the installed web-vitals build.
  cleanupSubscriptions();

  const report = { ...vitalsData };

  // eslint-disable-next-line no-console
  console.log("[WebVitalsCollector] Stopped collecting. Final report:", report);

  return report;
}

export function getWebVitals(): WebVitalsReport {
  return { ...vitalsData };
}

export function evaluateWebVitals(vitals: WebVitalsReport): {
  lcp: "good" | "needs-improvement" | "poor";
  inp: "good" | "needs-improvement" | "poor";
  cls: "good" | "needs-improvement" | "poor";
  ttfb: "good" | "needs-improvement" | "poor";
  overall: "good" | "needs-improvement" | "poor";
} {
  const evaluation = {
    lcp: evaluateMetric(vitals.lcp, 2500, 4000),
    inp: evaluateMetric(vitals.inp, 200, 500),
    cls: evaluateMetric(vitals.cls, 0.1, 0.25),
    ttfb: evaluateMetric(vitals.ttfb, 800, 1800),
    overall: "good" as "good" | "needs-improvement" | "poor",
  };

  // Overall score: if any metric is poor, overall is poor.
  const metrics = [evaluation.lcp, evaluation.inp, evaluation.cls, evaluation.ttfb];
  if (metrics.includes("poor")) {
    evaluation.overall = "poor";
  } else if (metrics.includes("needs-improvement")) {
    evaluation.overall = "needs-improvement";
  }

  return evaluation;
}

function evaluateMetric(
  value: number | null,
  goodThreshold: number,
  poorThreshold: number,
): "good" | "needs-improvement" | "poor" {
  if (value === null) return "good"; // No data = assume good (keeps your original behavior)
  if (value <= goodThreshold) return "good";
  if (value <= poorThreshold) return "needs-improvement";
  return "poor";
}
