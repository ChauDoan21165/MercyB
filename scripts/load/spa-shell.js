/**
 * Breaking-point load test: SPA shell / signin page load
 *
 * Target: GET /  and  GET /signin  (both return index.html — SPA routing)
 * Simulates the "first byte" experience users see when opening the app.
 * No auth, no AI cost, no writes.
 *
 * Stages: 50 → 200 → 500 VUs
 * Run via:  ../load/run.sh  (defaults to localhost:4173)
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Injected by run.sh  (-e BASE_URL=http://...)
const BASE_URL = __ENV.BASE_URL || 'http://localhost:4173';

const errorRate = new Rate('shell_errors');
const ttfb = new Trend('shell_ttfb_ms', true);  // Time To First Byte

// SPA routes that all return index.html — tests CDN/host routing correctness too
const PAGES = ['/', '/signin', '/signup', '/pricing'];

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 50 },
    { duration: '2m', target: 200 },
    { duration: '3m', target: 200 },
    { duration: '2m', target: 500 },  // ← breaking-point zone
    { duration: '3m', target: 500 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_failed:     ['rate<0.01'],
    // SPA shell must be fast — it's the cold-start experience
    http_req_duration:   ['p(95)<600', 'p(99)<1500'],
    shell_errors:        ['rate<0.01'],
    shell_ttfb_ms:       ['p(95)<200'],  // TTFB under 200ms at p95
  },
};

export default function () {
  const page = PAGES[Math.floor(Math.random() * PAGES.length)];
  const url = `${BASE_URL}${page}`;

  const res = http.get(url, {
    headers: { Accept: 'text/html,application/xhtml+xml' },
    tags: { endpoint: 'spa_shell', page },
  });

  const ok = check(res, {
    'status 200':         (r) => r.status === 200,
    'is HTML':            (r) =>
      (r.headers['Content-Type'] || r.headers['content-type'] || '').includes('text/html'),
    'contains root div':  (r) => r.body !== null && r.body.includes('<div id="root"'),
    'TTFB under 200ms':   (r) => r.timings.waiting < 200,
  });

  errorRate.add(!ok);
  ttfb.add(res.timings.waiting);

  // Simulate user reading/navigating: 1–2s between page loads
  sleep(1 + Math.random());
}
