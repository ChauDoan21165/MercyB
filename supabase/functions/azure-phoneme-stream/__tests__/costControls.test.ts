// supabase/functions/azure-phoneme-stream/__tests__/costControls.test.ts
//
// Hard cost-control PROOF for the STREAMING pronunciation path
// (azure-phoneme-stream), closing the gap the C1 audit (invoice
// G163789098) flagged: streaming previously had no rate limit, no
// trial/premium gate, no global $ cap, and no telemetry, and ran many
// Azure passes per recording.
//
// These pin the invariants that keep streaming from silently burning
// Azure money:
//   1. A free / trial-expired user cannot open a scoring session.
//   2. A rate-limited user cannot open a scoring session.
//   3. The global daily $ cap blocks new sessions.
//   4. Empty / too-short audio never spends an Azure pass (no fake score).
//   5. An exhausted per-session pass cap stops further Azure passes.
//   6. Every gate fail returns a CLEAR reason (telemetry / skip reason).
//   7. The module reuses NO tone-scorer thresholds or imports.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

import {
  checkStreamTrialAccess,
  evaluateStreamGate,
  shouldRunStreamAzurePass,
  streamPassCostUsd,
  STREAM_MAX_PASSES_PER_SESSION,
  STREAM_MIN_PASS_AUDIO_SEC,
  STREAM_RATE_LIMIT_MAX_SESSIONS,
  STREAM_RATE_LIMIT_WINDOW_MS,
  type StreamGateDeps,
  type StreamProfileRow,
} from "../costControls.ts";

const NOW = Date.parse("2026-06-09T12:00:00Z");
const HOUR = 60 * 60 * 1000;

function profile(overrides: Partial<StreamProfileRow> = {}): StreamProfileRow {
  return {
    trial_expires_at: null,
    trial_ends_at: null,
    trial_end: null,
    premium_status: null,
    premium_expires_at: null,
    tier: null,
    ...overrides,
  };
}

/** A passing-gate dep set: rate limit OK, profile premium, $0 spent. */
function deps(overrides: Partial<StreamGateDeps> = {}): StreamGateDeps {
  return {
    rateLimit: vi.fn(async () => {}),
    fetchUserProfile: vi.fn(async () => profile({ premium_status: "active" })),
    sumGlobalCostToday: vi.fn(async () => 0),
    globalDailyCapUsd: 25,
    ...overrides,
  };
}

function rateLimitExceeded(): never {
  throw new Error("RATE_LIMIT_EXCEEDED");
}

describe("azure-phoneme-stream cost controls — hard proof", () => {
  // ── 1. Free / trial-expired gate ───────────────────────────────────────
  it("1. a free (trial-expired, non-premium) user CANNOT open a session", async () => {
    const rl = vi.fn(async () => {});
    const result = await evaluateStreamGate(
      deps({
        rateLimit: rl,
        fetchUserProfile: async () =>
          profile({ trial_expires_at: "2026-06-01T00:00:00Z" }), // expired
      }),
      "user-free",
      NOW,
    );
    expect(result).toEqual({ allowed: false, reason: "trial_expired" });
  });

  it("1b. a premium user with $0 spend IS allowed (control)", async () => {
    const result = await evaluateStreamGate(deps(), "user-premium", NOW);
    expect(result).toEqual({ allowed: true });
  });

  it("1c. trial gate: active premium / valid trial / dunning all pass; expired/none-premium fail", () => {
    // active premium, not expired
    expect(checkStreamTrialAccess(profile({ premium_status: "active", premium_expires_at: "2026-07-01T00:00:00Z" }), NOW)).toBe(true);
    // dunning entitles regardless of expiry
    expect(checkStreamTrialAccess(profile({ premium_status: "past_due", premium_expires_at: "2026-01-01T00:00:00Z" }), NOW)).toBe(true);
    // trial not yet expired
    expect(checkStreamTrialAccess(profile({ trial_expires_at: "2026-06-30T00:00:00Z" }), NOW)).toBe(true);
    // trial expired, no premium → blocked
    expect(checkStreamTrialAccess(profile({ trial_ends_at: "2026-06-01T00:00:00Z" }), NOW)).toBe(false);
    // fail-open on missing profile (rate limit + cap still guard)
    expect(checkStreamTrialAccess(null, NOW)).toBe(true);
  });

  // ── 2. Rate limit ───────────────────────────────────────────────────────
  it("2. a rate-limited user CANNOT open a session (checked before Azure)", async () => {
    const profileSpy = vi.fn(async () => profile({ premium_status: "active" }));
    const result = await evaluateStreamGate(
      deps({ rateLimit: async () => rateLimitExceeded(), fetchUserProfile: profileSpy }),
      "user-spammer",
      NOW,
    );
    expect(result).toEqual({ allowed: false, reason: "rate_limited" });
    // Short-circuits: a blocked session never even reads the profile.
    expect(profileSpy).not.toHaveBeenCalled();
  });

  it("2b. rate limit is keyed per-user with the documented ceiling", async () => {
    const rl = vi.fn(async () => {});
    await evaluateStreamGate(deps({ rateLimit: rl }), "user-x", NOW);
    expect(rl).toHaveBeenCalledWith(
      "azure-phoneme-stream:user-x",
      STREAM_RATE_LIMIT_MAX_SESSIONS,
      STREAM_RATE_LIMIT_WINDOW_MS,
    );
  });

  // ── 3. Global daily cap ─────────────────────────────────────────────────
  it("3. the global daily $ cap blocks a new session", async () => {
    const result = await evaluateStreamGate(
      deps({ sumGlobalCostToday: async () => 25, globalDailyCapUsd: 25 }),
      "user-premium",
      NOW,
    );
    expect(result).toEqual({ allowed: false, reason: "global_daily_cap_reached" });
  });

  // ── 4. Empty / poor audio never spends a pass ───────────────────────────
  it("4. empty (0s) / too-short audio skips the Azure pass with a clear reason", () => {
    expect(shouldRunStreamAzurePass({ accumulatedSec: 0, passesUsed: 0, inFlight: false }))
      .toEqual({ run: false, reason: "empty_or_short_audio" });
    expect(
      shouldRunStreamAzurePass({
        accumulatedSec: STREAM_MIN_PASS_AUDIO_SEC - 0.01,
        passesUsed: 0,
        inFlight: false,
      }),
    ).toEqual({ run: false, reason: "empty_or_short_audio" });
    // empty-audio guard holds even for the final pass — no fake score.
    expect(
      shouldRunStreamAzurePass({ accumulatedSec: 0, passesUsed: 0, inFlight: false, isFinal: true }),
    ).toEqual({ run: false, reason: "empty_or_short_audio" });
  });

  it("4b. real audio under the cap DOES run one pass (control)", () => {
    expect(shouldRunStreamAzurePass({ accumulatedSec: 3, passesUsed: 0, inFlight: false }))
      .toEqual({ run: true });
  });

  // ── 5. Per-session pass cap ─────────────────────────────────────────────
  it("5. an exhausted per-session pass cap stops further partial passes", () => {
    expect(
      shouldRunStreamAzurePass({
        accumulatedSec: 10,
        passesUsed: STREAM_MAX_PASSES_PER_SESSION,
        inFlight: false,
      }),
    ).toEqual({ run: false, reason: "session_pass_cap" });
  });

  it("5b. the final pass may use the last slot, but not beyond it", () => {
    // final allowed exactly at the cap (it is the last billable pass)
    expect(
      shouldRunStreamAzurePass({
        accumulatedSec: 10,
        passesUsed: STREAM_MAX_PASSES_PER_SESSION,
        inFlight: false,
        isFinal: true,
      }),
    ).toEqual({ run: true });
    // but a runaway session beyond cap+1 is still blocked
    expect(
      shouldRunStreamAzurePass({
        accumulatedSec: 10,
        passesUsed: STREAM_MAX_PASSES_PER_SESSION + 1,
        inFlight: false,
        isFinal: true,
      }),
    ).toEqual({ run: false, reason: "session_pass_cap" });
  });

  it("5c. an in-flight pass never double-fires (no double-billing)", () => {
    expect(shouldRunStreamAzurePass({ accumulatedSec: 10, passesUsed: 0, inFlight: true }))
      .toEqual({ run: false, reason: "in_flight" });
  });

  // ── 6. Cost accounting ──────────────────────────────────────────────────
  it("6. per-pass cost is non-zero for real audio and zero for empty", () => {
    expect(streamPassCostUsd(0)).toBe(0);
    expect(streamPassCostUsd(-5)).toBe(0);
    expect(streamPassCostUsd(60)).toBeCloseTo(1 / 60, 6); // 1 minute = 1/60 USD
    expect(streamPassCostUsd(6)).toBeGreaterThan(0);
  });

  it("6b. gate fails-open on a rate-limit SUBSYSTEM error (not a quota hit)", async () => {
    const result = await evaluateStreamGate(
      deps({
        rateLimit: async () => {
          throw new Error("redis_unreachable"); // infra blip, not RATE_LIMIT_EXCEEDED
        },
      }),
      "user-premium",
      NOW,
    );
    expect(result).toEqual({ allowed: true });
  });

  // ── 7. Tone-scorer isolation ────────────────────────────────────────────
  it("7. the cost-control module imports NO tone scorer / batch core", () => {
    // cwd is the repo root under vitest; resolve the module from there to
    // avoid import.meta.url scheme differences across runners.
    const src = readFileSync(
      join(process.cwd(), "supabase/functions/azure-phoneme-stream/costControls.ts"),
      "utf8",
    );
    // Scan only the IMPORT statements — prose comments may discuss tone
    // isolation by name; what matters is the dependency graph.
    const importLines = src
      .split("\n")
      .filter((l) => /^\s*import\b|from\s+["']/.test(l));
    const importBlob = importLines.join("\n");
    // The batch+tone module (azure-phoneme/core.ts holds SUPPORTED_TARGET_
    // LOCALES = ['vi-VN'] and the tone-drill context) must NOT be imported.
    expect(importBlob).not.toMatch(/azure-phoneme\/core/);
    expect(importBlob).not.toMatch(/tone/i);
    expect(importBlob).not.toMatch(/vi-VN/);
    // Only the pure premium-entitlement decision is shared infra.
    expect(importBlob).toMatch(/_shared\/premiumEntitlement\.ts/);
  });
});

// A streaming session is more expensive than a single batch call, so the
// per-session pass cap must keep total passes bounded well under the
// ~26 an ungated 30 s recording could otherwise fire.
describe("azure-phoneme-stream cost controls — bound sanity", () => {
  it("the per-session pass cap is a real, small ceiling", () => {
    expect(STREAM_MAX_PASSES_PER_SESSION).toBeGreaterThan(0);
    expect(STREAM_MAX_PASSES_PER_SESSION).toBeLessThanOrEqual(15);
    expect(HOUR).toBe(STREAM_RATE_LIMIT_WINDOW_MS);
  });
});
