// tests/crawler/knownDefects.reproduction.test.ts
//
// TIER-1 verification (deterministic, runs in the main vitest CI shards):
// prove the crawler REPRODUCES the errors admin/agents already found by hand.
// Each seeded defect's real signature must be detected, and benign console
// noise must be neither a defect nor a failure. If detection regresses, this
// goes red before the crawler can silently stop catching a known bug.

import { describe, expect, it } from "vitest";

import {
  KNOWN_DEFECTS,
  isIgnorableNoise,
  matchKnownDefect,
} from "../e2e/crawler/knownDefects";

// Representative REAL console signatures for each seeded defect, taken from the
// bug reports / prod-smoke KNOWN_CONSOLE_NOISE they were first observed in.
const REAL_SIGNATURES: Record<string, string> = {
  "KD-PLACEMENT-GATEWAY-ERRFAILED": "Failed to load resource: net::ERR_FAILED",
  "KD-CSP-BLOB-WORKER":
    "Creating a worker from 'blob:https://mercyblade.com/9f' violates the following Content Security Policy directive: \"script-src 'self'\".",
  "KD-LISTENING-AUDIO-000-HANG": "Loading audio. Please wait…",
};

describe("Tier-1 crawler reproduces admin's hand-found defects", () => {
  it("has a real signature fixture for every seeded defect", () => {
    for (const kd of KNOWN_DEFECTS) {
      expect(REAL_SIGNATURES[kd.id], `missing fixture signature for ${kd.id}`).toBeTruthy();
    }
  });

  for (const kd of KNOWN_DEFECTS) {
    it(`detects ${kd.id} from its real signature`, () => {
      const matched = matchKnownDefect(REAL_SIGNATURES[kd.id]);
      expect(matched?.id, `${kd.id} must be reproduced by the crawler's detector`).toBe(kd.id);
    });
  }

  it("also matches the placement CORS/ACAO variant", () => {
    const corsVariant =
      "Access to fetch at 'https://x.supabase.co/functions/v1/placement-v3-session' " +
      "blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present.";
    expect(matchKnownDefect(corsVariant)?.id).toBe("KD-PLACEMENT-GATEWAY-ERRFAILED");
  });

  it("does not flag benign console noise as a defect", () => {
    for (const noise of [
      "[vite] connected.",
      "Sentry DSN is not configured; monitoring disabled",
      "GET /favicon.ico 404 (Not Found)",
      "Download the React DevTools for a better development experience",
    ]) {
      expect(isIgnorableNoise(noise)).toBe(true);
      expect(matchKnownDefect(noise)).toBeNull();
    }
  });
});
