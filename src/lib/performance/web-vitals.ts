/**
 * Web Vitals Tracking
 * Measure and log Core Web Vitals in production
 */

import {
  onCLS,
  onINP,
  onLCP,
  onFCP,
  onTTFB,
  type Metric,
} from 'web-vitals';

// Vite-safe environment detection
const isDev = !import.meta.env.PROD;

interface VitalsData {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

const vitalsData: VitalsData[] = [];

/**
 * Get rating based on official thresholds
 */
function getRating(metric: Metric): 'good' | 'needs-improvement' | 'poor' {
  const { name, value } = metric;

  const thresholds: Record<string, [number, number]> = {
    CLS: [0.1, 0.25],
    INP: [200, 500],          // Replaces FID
    LCP: [2500, 4000],
    FCP: [1800, 3000],
    TTFB: [800, 1800],
  };

  const threshold = thresholds[name];

  if (!threshold) return 'good'; // unknown metric fallback

  const [good, poor] = threshold;

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

  // Log in development
  if (isDev) {
    console.log(
      `[Web Vitals] ${data.name}: ${data.value.toFixed(2)} (${data.rating})`
    );
  }

  // TODO: Send to analytics service in production
  // Example:
  // if (!isDev) analytics.track('web_vital', data);
}

/**
 * Initialize Web Vitals tracking
 */
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  onCLS(sendToAnalytics);
  onINP(sendToAnalytics); // Modern replacement for FID
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}

/**
 * Get current vitals data
 */
export function getVitalsData(): VitalsData[] {
  return [...vitalsData];
}

/**
 * Get vitals summary
 */
export function getVitalsSummary() {
  return {
    CLS: vitalsData.find(v => v.name === 'CLS'),
    INP: vitalsData.find(v => v.name === 'INP'),
    LCP: vitalsData.find(v => v.name === 'LCP'),
    FCP: vitalsData.find(v => v.name === 'FCP'),
    TTFB: vitalsData.find(v => v.name === 'TTFB'),
  };
}