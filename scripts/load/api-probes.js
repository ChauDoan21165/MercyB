/**
 * Breaking-point load test: safe read-only API probes
 *
 * Endpoints tested (ALL zero AI/TTS cost, no writes):
 *   GET  /api/mercy-ai          → static hint JSON, no backend AI call
 *   OPTIONS /api/tts            → CORS preflight, no TTS synthesis
 *   OPTIONS /api/mercy/grammar  → CORS preflight, no grammar call
 *
 * Stages: 50 → 200 → 500 VUs
 * Run via:  ../load/run.sh  (defaults to localhost:4173)
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Counter } from 'k6/metrics';

// Injected by run.sh  (-e BASE_URL=http://...)
const BASE_URL = __ENV.BASE_URL || 'http://localhost:4173';

const errorRate = new Rate('api_probe_errors');
const optionsErrors = new Counter('options_preflight_failures');

// CORS origin that would appear in a real browser preflight from prod
const CORS_ORIGIN = 'https://mercyblade.com';

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
    http_req_duration:   ['p(95)<300', 'p(99)<800'],  // API hints should be fast
    api_probe_errors:    ['rate<0.01'],
  },
};

// Distribute load across the 3 probe types
const PROBES = [
  {
    label: 'GET /api/mercy-ai hint',
    fn: () => http.get(`${BASE_URL}/api/mercy-ai`, {
      headers: { Accept: 'application/json' },
      tags: { endpoint: 'api_mercy_ai_get' },
    }),
    checks: {
      'status 200':  (r) => r.status === 200,
      'body has ok': (r) => {
        try { return JSON.parse(r.body).ok === true; } catch { return false; }
      },
    },
  },
  {
    label: 'OPTIONS /api/tts (CORS preflight)',
    fn: () => http.options(`${BASE_URL}/api/tts`, null, {
      headers: {
        Origin: CORS_ORIGIN,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type',
      },
      tags: { endpoint: 'options_tts' },
    }),
    checks: {
      'CORS preflight accepted': (r) => r.status === 200 || r.status === 204,
      'has CORS header': (r) =>
        r.headers['Access-Control-Allow-Origin'] !== undefined ||
        r.headers['access-control-allow-origin'] !== undefined,
    },
    onFail: () => optionsErrors.add(1),
  },
  {
    label: 'OPTIONS /api/mercy/grammar (CORS preflight)',
    fn: () => http.options(`${BASE_URL}/api/mercy/grammar`, null, {
      headers: {
        Origin: CORS_ORIGIN,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type',
      },
      tags: { endpoint: 'options_grammar' },
    }),
    checks: {
      'CORS preflight accepted': (r) => r.status === 200 || r.status === 204,
      'has CORS header': (r) =>
        r.headers['Access-Control-Allow-Origin'] !== undefined ||
        r.headers['access-control-allow-origin'] !== undefined,
    },
    onFail: () => optionsErrors.add(1),
  },
];

export default function () {
  const probe = PROBES[Math.floor(Math.random() * PROBES.length)];
  const res = probe.fn();

  const ok = check(res, probe.checks);
  errorRate.add(!ok);
  if (!ok && probe.onFail) probe.onFail();

  sleep(0.2 + Math.random() * 0.4); // 0.2–0.6s think time
}
