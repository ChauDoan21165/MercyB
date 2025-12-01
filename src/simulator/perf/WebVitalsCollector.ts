// Web Vitals Collector - Collect Core Web Vitals metrics

import { onCLS, onFID, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';

export interface WebVitalsReport {
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay (deprecated)
  inp: number | null; // Interaction to Next Paint
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

let vitalsData: WebVitalsReport = {
  lcp: null,
  fid: null,
  inp: null,
  cls: null,
  ttfb: null,
};

let collecting = false;

export function startWebVitalsCollection(): void {
  if (collecting) return;
  collecting = true;

  // Reset data
  vitalsData = {
    lcp: null,
    fid: null,
    inp: null,
    cls: null,
    ttfb: null,
  };

  // Collect LCP
  onLCP((metric: Metric) => {
    vitalsData.lcp = metric.value;
    console.log('[WebVitals] LCP:', metric.value);
  });

  // Collect FID (deprecated but still measured)
  onFID((metric: Metric) => {
    vitalsData.fid = metric.value;
    console.log('[WebVitals] FID:', metric.value);
  });

  // Collect INP (new interaction metric)
  onINP((metric: Metric) => {
    vitalsData.inp = metric.value;
    console.log('[WebVitals] INP:', metric.value);
  });

  // Collect CLS
  onCLS((metric: Metric) => {
    vitalsData.cls = metric.value;
    console.log('[WebVitals] CLS:', metric.value);
  });

  // Collect TTFB
  onTTFB((metric: Metric) => {
    vitalsData.ttfb = metric.value;
    console.log('[WebVitals] TTFB:', metric.value);
  });

  console.log('[WebVitalsCollector] Started collecting web vitals');
}

export function stopAndGetWebVitals(): WebVitalsReport {
  collecting = false;
  const report = { ...vitalsData };

  console.log('[WebVitalsCollector] Stopped collecting. Final report:', report);

  return report;
}

export function getWebVitals(): WebVitalsReport {
  return { ...vitalsData };
}

export function evaluateWebVitals(vitals: WebVitalsReport): {
  lcp: 'good' | 'needs-improvement' | 'poor';
  fid: 'good' | 'needs-improvement' | 'poor';
  inp: 'good' | 'needs-improvement' | 'poor';
  cls: 'good' | 'needs-improvement' | 'poor';
  ttfb: 'good' | 'needs-improvement' | 'poor';
  overall: 'good' | 'needs-improvement' | 'poor';
} {
  const evaluation = {
    lcp: evaluateMetric(vitals.lcp, 2500, 4000),
    fid: evaluateMetric(vitals.fid, 100, 300),
    inp: evaluateMetric(vitals.inp, 200, 500),
    cls: evaluateMetric(vitals.cls, 0.1, 0.25),
    ttfb: evaluateMetric(vitals.ttfb, 800, 1800),
    overall: 'good' as 'good' | 'needs-improvement' | 'poor',
  };

  // Overall score: if any metric is poor, overall is poor
  const metrics = [evaluation.lcp, evaluation.inp, evaluation.cls, evaluation.ttfb];
  if (metrics.includes('poor')) {
    evaluation.overall = 'poor';
  } else if (metrics.includes('needs-improvement')) {
    evaluation.overall = 'needs-improvement';
  }

  return evaluation;
}

function evaluateMetric(
  value: number | null,
  goodThreshold: number,
  poorThreshold: number
): 'good' | 'needs-improvement' | 'poor' {
  if (value === null) return 'good'; // No data = assume good
  if (value <= goodThreshold) return 'good';
  if (value <= poorThreshold) return 'needs-improvement';
  return 'poor';
}
