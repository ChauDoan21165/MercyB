// supabase/functions/trial-expiry-emails/__tests__/categorizeForTrialExpiry.test.ts
//
// Step 9 — pure-function tests for the trial-expiry funnel categorizer.
// Mirrors the categorizeUsers test pattern (vitest under Node, no Deno).

import { describe, it, expect } from "vitest";

import {
  FREE_TRIAL_DAYS,
  TRIAL_STAGE_TO_CAMPAIGN,
  campaignForStage,
  categorizeForTrialExpiry,
  daysUntilExpiry,
  stageFor,
  trialExpiresAt,
  type TrialUserRow,
} from "../categorizeForTrialExpiry";

const NOW = new Date("2026-04-25T12:00:00Z");
const DAY_MS = 24 * 60 * 60 * 1000;

const minusDays = (n: number, base: Date = NOW): string =>
  new Date(base.getTime() - n * DAY_MS).toISOString();

const row = (overrides: Partial<TrialUserRow> = {}): TrialUserRow => ({
  id: "00000000-0000-0000-0000-000000000001",
  email: "user@example.com",
  preferred_name: "Lan",
  created_at: minusDays(0),
  tier: 0,
  trial_extension_days: 0,
  trial_expires_at: null,
  trial_ends_at: null,
  trial_end: null,
  ...overrides,
});

describe("trialExpiresAt", () => {
  it("returns created_at + 3 days when no extension", () => {
    const r = row({ created_at: "2026-04-22T12:00:00Z", trial_extension_days: 0 });
    const expires = trialExpiresAt(r);
    expect(expires?.toISOString()).toBe("2026-04-25T12:00:00.000Z");
  });

  it("adds trial_extension_days to the base trial length", () => {
    const r = row({ created_at: "2026-04-22T12:00:00Z", trial_extension_days: 4 });
    // 3 + 4 = 7 days from 2026-04-22T12:00 → 2026-04-29T12:00
    expect(trialExpiresAt(r)?.toISOString()).toBe("2026-04-29T12:00:00.000Z");
  });

  it("treats negative extension_days as 0 (defensive)", () => {
    const r = row({ created_at: "2026-04-22T12:00:00Z", trial_extension_days: -10 });
    expect(trialExpiresAt(r)?.toISOString()).toBe("2026-04-25T12:00:00.000Z");
  });

  it("returns null for missing created_at", () => {
    expect(trialExpiresAt(row({ created_at: null }))).toBeNull();
  });

  it("returns null for unparseable created_at", () => {
    expect(trialExpiresAt(row({ created_at: "not-a-date" }))).toBeNull();
  });

  it("uses FREE_TRIAL_DAYS = 3 (mirrors ai-chat edge function)", () => {
    expect(FREE_TRIAL_DAYS).toBe(3);
  });
});

describe("daysUntilExpiry", () => {
  it("is positive while the trial is still active", () => {
    const r = row({ created_at: minusDays(0) }); // expires NOW + 3d
    expect(daysUntilExpiry(r, NOW)).toBeCloseTo(3, 5);
  });

  it("is negative once the trial has passed", () => {
    const r = row({ created_at: minusDays(5) }); // expired 2 days ago
    expect(daysUntilExpiry(r, NOW)).toBeCloseTo(-2, 5);
  });

  it("returns null for malformed rows", () => {
    expect(daysUntilExpiry(row({ created_at: null }), NOW)).toBeNull();
  });
});

describe("stageFor", () => {
  it("returns D_minus_1 when ~1 day remains", () => {
    // created 2 days ago → expires in 1 day
    expect(stageFor(row({ created_at: minusDays(2) }), NOW)).toBe("D_minus_1");
  });

  it("returns D_plus_1 when expired ~1 day ago", () => {
    // created 3.75 days ago → expired 0.75 days ago, in (-1.0, -0.5]
    expect(stageFor(row({ created_at: minusDays(3.75) }), NOW)).toBe("D_plus_1");
  });

  it("returns not_in_window for fresh signups (full trial ahead)", () => {
    // created exactly NOW → expires in 3 days. The D-3 stage was dropped
    // (3-day trial overlaps with welcome email), so this is not_in_window.
    expect(stageFor(row({ created_at: minusDays(0) }), NOW)).toBe("not_in_window");
  });

  it("returns not_in_window for users mid-trial (between stages)", () => {
    // created 1 day ago → expires in 2 days, neither D-3 nor D-1
    expect(stageFor(row({ created_at: minusDays(1) }), NOW)).toBe("not_in_window");
  });

  it("returns not_in_window for users 4+ days post-expiry", () => {
    expect(stageFor(row({ created_at: minusDays(10) }), NOW)).toBe("not_in_window");
  });

  it("never emails premium users (tier >= 1)", () => {
    const r = row({ created_at: minusDays(2), tier: 1 });
    expect(stageFor(r, NOW)).toBe("not_in_window");
  });

  it("treats tier as a string ('1') the same as the integer (DB types surface tier as string)", () => {
    const r = row({ created_at: minusDays(2), tier: "1" });
    expect(stageFor(r, NOW)).toBe("not_in_window");
  });

  it("treats tier 0 (default trial) as eligible for the funnel", () => {
    expect(stageFor(row({ created_at: minusDays(2), tier: 0 }), NOW)).toBe(
      "D_minus_1",
    );
  });

  it("treats null tier as eligible for the funnel", () => {
    expect(stageFor(row({ created_at: minusDays(2), tier: null }), NOW)).toBe(
      "D_minus_1",
    );
  });

  it("prefers an explicit trial_expires_at when set", () => {
    // created 0 days ago would normally yield not_in_window (no D-3 stage),
    // but if trial_expires_at says the trial already ended yesterday, the
    // user should land in D+1.
    const r = row({
      created_at: minusDays(0),
      trial_expires_at: minusDays(0.75), // 0.75d in the past
    });
    expect(stageFor(r, NOW)).toBe("D_plus_1");
  });

  it("falls through to trial_ends_at when trial_expires_at is null", () => {
    const r = row({
      created_at: minusDays(0),
      trial_expires_at: null,
      trial_ends_at: minusDays(0.75),
    });
    expect(stageFor(r, NOW)).toBe("D_plus_1");
  });

  it("never emails users with no email address", () => {
    const r = row({ created_at: minusDays(2), email: null });
    expect(stageFor(r, NOW)).toBe("not_in_window");
  });

  it("respects trial_extension_days when locating the window", () => {
    // created 2 days ago, extension 0 → expires in 1 day → D_minus_1
    // created 2 days ago, extension 4 → expires in 5 days → not_in_window
    const noExt = row({ created_at: minusDays(2), trial_extension_days: 0 });
    const withExt = row({ created_at: minusDays(2), trial_extension_days: 4 });
    expect(stageFor(noExt, NOW)).toBe("D_minus_1");
    expect(stageFor(withExt, NOW)).toBe("not_in_window");
  });
});

describe("campaignForStage / TRIAL_STAGE_TO_CAMPAIGN", () => {
  it("maps each stage to the matching email_sends_log campaign string", () => {
    expect(campaignForStage("D_minus_1")).toBe("trial_expiry_d_minus_1");
    expect(campaignForStage("D_plus_1")).toBe("trial_expiry_d_plus_1");
  });

  it("returns null for not_in_window", () => {
    expect(campaignForStage("not_in_window")).toBeNull();
  });

  it("TRIAL_STAGE_TO_CAMPAIGN is consistent with campaignForStage", () => {
    for (const stage of ["D_minus_1", "D_plus_1"] as const) {
      expect(TRIAL_STAGE_TO_CAMPAIGN[stage]).toBe(campaignForStage(stage));
    }
  });
});

describe("categorizeForTrialExpiry", () => {
  it("partitions a mixed batch into the correct buckets", () => {
    const rows: TrialUserRow[] = [
      row({ id: "u-d1", created_at: minusDays(2) }),
      row({ id: "u-plus1", created_at: minusDays(3.75) }),
      row({ id: "u-fresh", created_at: minusDays(0) }), // not_in_window (D-3 dropped)
      row({ id: "u-mid", created_at: minusDays(1) }), // not_in_window
      row({ id: "u-prem", created_at: minusDays(2), tier: 1 }),
      row({ id: "u-no-email", created_at: minusDays(2), email: null }),
      row({ id: "u-stale", created_at: minusDays(20) }),
    ];
    const result = categorizeForTrialExpiry(rows, NOW);
    expect(result.d_minus_1.map((r) => r.id)).toEqual(["u-d1"]);
    expect(result.d_plus_1.map((r) => r.id)).toEqual(["u-plus1"]);
    expect(result.skipped.map((r) => r.id).sort()).toEqual([
      "u-fresh",
      "u-mid",
      "u-no-email",
      "u-prem",
      "u-stale",
    ]);
  });

  it("handles an empty input list", () => {
    const result = categorizeForTrialExpiry([], NOW);
    expect(result.d_minus_1).toEqual([]);
    expect(result.d_plus_1).toEqual([]);
    expect(result.skipped).toEqual([]);
  });
});
