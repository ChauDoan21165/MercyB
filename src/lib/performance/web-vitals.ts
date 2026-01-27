/**
 * Web Vitals Tracking
 * Measure and log Core Web Vitals in production
 */

import { onCLS, onFID, onLCP, onFCP, onTTFB, Metric } from 'web-vitals';

const isDev = process.env.NODE_ENV !== 'production';

interface VitalsData {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

const vitalsData: VitalsData[] = [];

/**
 * Get rating based on thresholds
 */
function getRating(metric: Metric): 'good' | 'needs-improvement' | 'poor' {
  const { name, value } = metric;

  const thresholds: Record<string, [number, number]> = {
    CLS: [0.1, 0.25],
    FID: [100, 300],
    LCP: [2500, 4000],
    FCP: [1800, 3000],
    TTFB: [800, 1800],
  };

  const [good, poor] = thresholds[name] || [0, 0];

  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Send vitals data to analytics
 */
function sendToAnalytics(metric: Metric) {
  const data: VitalsData = {
    name: metric.name,
    value: metric.value,
    rating: getRating(metric),
    delta: metric.delta,
    id: metric.id,
  };

  vitalsData.push(data);

  // Log in dev
  if (isDev) {
    console.log(`[Web Vitals] ${data.name}: ${data.value.toFixed(2)}ms (${data.rating})`);
  }

  // TODO: Send to analytics service in production
  // Example: analytics.track('web_vital', data);
}

/**
 * Initialize Web Vitals tracking
 */
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}

/**
 * Get current vitals data
 */
export function getVitalsData(): VitalsData[] {
  return vitalsData;
}

/**
 * Get vitals summary
 */
export function getVitalsSummary() {
  const summary = {
    CLS: vitalsData.find(v => v.name === 'CLS'),
    FID: vitalsData.find(v => v.name === 'FID'),
    LCP: vitalsData.find(v => v.name === 'LCP'),
    FCP: vitalsData.find(v => v.name === 'FCP'),
    TTFB: vitalsData.find(v => v.name === 'TTFB'),
  };

  return summary;
}
