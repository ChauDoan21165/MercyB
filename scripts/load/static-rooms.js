/**
 * Breaking-point load test: static room JSON files
 * Target: GET /data/{roomId}.json  (487 files, publicly served, no auth, no AI cost)
 *
 * Stages: 50 → 200 → 500 VUs
 * Run via:  ../load/run.sh  (defaults to localhost:4173)
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Injected by run.sh  (-e BASE_URL=http://...)
// Default keeps mistakes safe — never prod.
const BASE_URL = __ENV.BASE_URL || 'http://localhost:4173';

const errorRate = new Rate('room_errors');
const roomDuration = new Trend('room_load_ms', true);

// Representative sample: free-tier (most traffic), kids (offline-critical), general
const ROOM_IDS = [
  // Free-tier adult rooms
  'addiction_support_free',
  'adhd_support_free',
  'anxiety_relief_free',
  'burnout_recovery_free',
  'career_consultant_free',
  'grammar_foundations_free',
  'social_anxiety_free',
  'relationship_healing_free',
  'meaning_of_life_free',
  'ptsd_support_free',
  // Kids rooms (offline-first, high service-worker demand)
  'alphabet_adventure_kids_l1',
  'animals_sounds_kids_l1',
  'adventure_discovery_words_kids_l2',
  'animals_around_world_kids_l2',
  'art_creativity_words_kids_l2',
];

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // ramp: 0 → 50 VUs
    { duration: '3m', target: 50 },   // hold at 50
    { duration: '2m', target: 200 },  // ramp: 50 → 200 VUs
    { duration: '3m', target: 200 },  // hold at 200
    { duration: '2m', target: 500 },  // ramp: 200 → 500 VUs  ← breaking-point zone
    { duration: '3m', target: 500 },  // hold at 500
    { duration: '1m', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_failed:        ['rate<0.01'],           // <1% HTTP failures
    http_req_duration:      ['p(95)<400', 'p(99)<1200'], // 95th < 400ms, 99th < 1.2s
    room_errors:            ['rate<0.01'],
    room_load_ms:           ['p(95)<400'],
  },
};

export default function () {
  const roomId = ROOM_IDS[Math.floor(Math.random() * ROOM_IDS.length)];
  const url = `${BASE_URL}/data/${roomId}.json`;

  const res = http.get(url, {
    headers: { Accept: 'application/json' },
    tags: { endpoint: 'room_static', room_id: roomId },
  });

  const ok = check(res, {
    'status 200':   (r) => r.status === 200,
    'has body':     (r) => r.body !== null && r.body.length > 10,
    'is valid JSON': (r) => {
      try { JSON.parse(r.body); return true; } catch { return false; }
    },
    'under 400ms':  (r) => r.timings.duration < 400,
  });

  errorRate.add(!ok);
  roomDuration.add(res.timings.duration);

  // Think time: 0.3–0.8s  (realistic page-read cadence)
  sleep(0.3 + Math.random() * 0.5);
}
