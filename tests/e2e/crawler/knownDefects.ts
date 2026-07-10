/**
 * Seeded fixtures: the errors admin/agents already found BY HAND. The crawler
 * uses these to (a) prove it reproduces known breakage, and (b) separate a
 * "known-defect" reproduction from a genuinely NEW failure. A console message
 * matching a known defect is tagged, not ignored and not counted as new.
 *
 * Sources are real reports/known signatures in this repo:
 *  - reports/BUG-placement-v3-session-gateway-net-err-failed-2026-07-09.md
 *  - reports/BUG-placement-v3-session-cors-2026-07-09.md
 *  - tests/prod-smoke/placement-imitation-user.spec.ts (KNOWN_CONSOLE_NOISE)
 */
export interface KnownDefect {
  id: string;
  /** Console / pageerror signature. */
  pattern: RegExp;
  summary: string;
  source: string;
  /** True when observable in the console during a plain page load; false when
   * it only manifests as a stuck UI state a flow must reach (documented so the
   * crawler doesn't pretend to cover it via console alone). */
  consoleObservable: boolean;
}

export const KNOWN_DEFECTS: KnownDefect[] = [
  {
    id: "KD-PLACEMENT-GATEWAY-ERRFAILED",
    pattern:
      /placement-v3-session.*(blocked by CORS|No 'Access-Control-Allow-Origin')|Failed to load resource: net::ERR_FAILED/i,
    summary:
      "placement-v3-session intermittently returns net::ERR_FAILED with no HTTP response (cold-start/gateway drop), surfacing as a missing-ACAO CORS console error.",
    source: "reports/BUG-placement-v3-session-gateway-net-err-failed-2026-07-09.md",
    consoleObservable: true,
  },
  {
    id: "KD-CSP-BLOB-WORKER",
    pattern:
      /Creating a worker from 'blob:.*violates the following Content Security Policy/i,
    summary:
      "A Web Worker created from a blob: URL is blocked by the prod CSP script-src.",
    source: "tests/prod-smoke/placement-imitation-user.spec.ts (2026-07-09)",
    consoleObservable: true,
  },
  {
    id: "KD-LISTENING-AUDIO-000-HANG",
    pattern: /Loading audio\. Please wait|Đang tải âm thanh/i,
    summary:
      "Listening prompt can hang on 'Loading audio…' (0:00) instead of playing or degrading to the unavailable fallback.",
    source: "tests/prod-smoke/placement-imitation-user.spec.ts (audio assertion)",
    consoleObservable: false, // flow-level UI state, reached only inside placement
  },
];

/** Generic, non-defect console noise that is neither a known defect nor a new
 * failure — ignored entirely (matches prod-smoke's benign set). */
export const IGNORE_NOISE: RegExp[] = [
  /sentry/i,
  /\[vite\]/i,
  /Download the React DevTools/i,
  /favicon/i,
  /ERR_INTERNET_DISCONNECTED/i,
];

export function matchKnownDefect(text: string): KnownDefect | null {
  return KNOWN_DEFECTS.find((d) => d.pattern.test(text)) ?? null;
}

export function isIgnorableNoise(text: string): boolean {
  return IGNORE_NOISE.some((re) => re.test(text));
}
