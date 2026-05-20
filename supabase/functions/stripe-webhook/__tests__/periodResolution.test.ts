// supabase/functions/stripe-webhook/__tests__/periodResolution.test.ts
//
// B5 CLASS BUG regression lock — labels: silent-failure, money-path,
// fake-green-test.
//
// Root cause (B5 diagnostic, discovered via mylinh.nutrition's
// "paid but free" subscription, webhook event evt_1TV59K):
// getCurrentPeriodEnd read top-level `raw.period_end` BEFORE the invoice
// line period. On a `billing_reason: "subscription_cycle"` RENEWAL invoice,
// Stripe's top-level `period_end` is the boundary of the period that JUST
// ENDED, not the new one — a documented Stripe gotcha. So every monthly
// renewal advanced the freshness marker (billing.ts:deriveObjectTimeMs
// reads the LINE period, correctly) while writing the just-ended boundary
// as current_period_end. The entitlement then read the user as already
// expired → silent paid-but-free for EVERY monthly renewer.
//
// The pre-existing webhook tests stayed GREEN through all of this because
// none of them could import webhook-events.ts (it transitively pulls
// Deno-only billing.ts/core.ts) — the failure mode this suite exists to
// kill. period-resolution.ts is the extracted, dependency-free home so the
// real money-path function is finally exercised by a deterministic test.

import { describe, expect, it } from "vitest";

import {
  getCurrentPeriodEnd,
  getCurrentPeriodStart,
} from "../period-resolution";
import mylinhInvoice from "./__fixtures__/mylinh-invoice-subscription-cycle.json";

// Real prod epochs from mylinh's raw_payload (see fixture _provenance):
const NEW_PERIOD_END_ISO = "2026-06-09T06:16:41.000Z"; // lines[0].period.end 1780985801
const JUST_ENDED_BOUNDARY_ISO = "2026-05-09T06:16:41.000Z"; // top-level period_end 1778307401
const OLD_PERIOD_START_ISO = "2026-04-09T06:16:41.000Z"; // top-level period_start 1775715401
// lines[0].period.start 1778307401 — the LIVE period start. By Stripe's
// renewal contiguity it is the same epoch as the just-ended period_end
// boundary (the new period begins exactly when the previous one ended).
const NEW_PERIOD_START_ISO = "2026-05-09T06:16:41.000Z";

const invoiceRaw = mylinhInvoice as unknown as Record<string, unknown>;

describe("getCurrentPeriodEnd — B5 class bug (subscription_cycle invoice field order)", () => {
  it("returns the NEW period (lines[0].period.end), NOT the just-ended top-level period_end", () => {
    // The whole bug in one assertion: before the fix this returned
    // JUST_ENDED_BOUNDARY_ISO (2026-05-09, already in the past on the
    // 2026-05-19 day mylinh was found) → paid-but-free.
    expect(getCurrentPeriodEnd(invoiceRaw)).toBe(NEW_PERIOD_END_ISO);
    expect(getCurrentPeriodEnd(invoiceRaw)).not.toBe(JUST_ENDED_BOUNDARY_ISO);
  });

  it("the fixture is the REAL failure shape, so the test actually exercises the fixed branch (anti fake-green)", () => {
    // If the fixture ever gains a top-level current_period_end or items,
    // clause 1/2 of getCurrentPeriodEnd would short-circuit and this suite
    // would silently stop testing the lines-vs-period_end fix. Lock the
    // structural preconditions that make the bug reachable.
    expect(mylinhInvoice).not.toHaveProperty("current_period_end");
    expect(mylinhInvoice).not.toHaveProperty("current_period_start");
    expect(mylinhInvoice).not.toHaveProperty("items");
    expect(mylinhInvoice).toHaveProperty("billing_reason", "subscription_cycle");
    expect(mylinhInvoice).toHaveProperty("object", "invoice");
    expect((mylinhInvoice as Record<string, number>).period_end).toBe(
      1778307401,
    );
    expect(
      (
        mylinhInvoice as unknown as {
          lines: { data: Array<{ period: { end: number } }> };
        }
      ).lines.data[0].period.end,
    ).toBe(1780985801);
  });
});

describe("getCurrentPeriodEnd — regression-guard the guard (subscription-object behavior UNCHANGED)", () => {
  it("a subscription object still resolves to its canonical top-level current_period_end (clause 1 wins)", () => {
    const sub: Record<string, unknown> = {
      object: "subscription",
      status: "active",
      current_period_start: 1778307401,
      current_period_end: 1780985801,
      // A subscription object carries `items` (never `lines`). Give the
      // item a DIFFERENT, stale value to prove the canonical top-level
      // field still takes precedence — i.e. the fix did not demote it.
      items: { data: [{ current_period_end: 1 }] },
    };
    expect(getCurrentPeriodEnd(sub)).toBe(NEW_PERIOD_END_ISO);
  });

  it("subscription WITHOUT a top-level current_period_end falls to items current_period_end (subscription path intact)", () => {
    const sub: Record<string, unknown> = {
      object: "subscription",
      status: "active",
      items: { data: [{ current_period_end: 1780985801 }] },
    };
    expect(getCurrentPeriodEnd(sub)).toBe(NEW_PERIOD_END_ISO);
  });

  it("raw.period_end is still honored as a last-resort fallback when there is no line/item period", () => {
    // Demoted, not deleted: an object that only has top-level period_end
    // (no lines, no items, no current_period_end) must still resolve.
    expect(getCurrentPeriodEnd({ period_end: 1780985801 })).toBe(
      NEW_PERIOD_END_ISO,
    );
  });

  it("trial-only object still falls through to trial_end (unchanged tail)", () => {
    expect(getCurrentPeriodEnd({ trial_end: 1780985801 })).toBe(
      NEW_PERIOD_END_ISO,
    );
  });

  it("returns null for an object with no resolvable period", () => {
    expect(getCurrentPeriodEnd({ object: "invoice" })).toBeNull();
  });
});

describe("getCurrentPeriodStart — B5 class bug, symmetric fix (B11 follow-up, B26)", () => {
  it("returns the NEW period start (lines[0].period.start), NOT the just-ended top-level period_start", () => {
    // The symmetric half of the B5 bug. B11's PR (#770) fixed the END side
    // and deliberately scoped this OUT, documenting it as a "separate,
    // consciously-reviewed change" — this PR (b26/period-start-fix) is that
    // change. Before this fix getCurrentPeriodStart read top-level
    // `raw.period_start` (2026-04-09, the JUST-ENDED period's start) BEFORE
    // the invoice line, mirroring the end-side defect: every monthly renewal
    // wrote the previous period's start. The live period start on a
    // subscription_cycle renewal invoice is lines[0].period.start
    // (2026-05-09, contiguous with the just-ended boundary).
    expect(getCurrentPeriodStart(invoiceRaw)).toBe(NEW_PERIOD_START_ISO);
    expect(getCurrentPeriodStart(invoiceRaw)).not.toBe(OLD_PERIOD_START_ISO);
  });

  it("subscription object still resolves to its canonical top-level current_period_start (clause 1 wins) — precedence UNCHANGED", () => {
    // Regression-guard the guard: the fix demotes top-level `period_start`,
    // it must NOT demote the canonical `current_period_start`. A subscription
    // object carries `items` (never `lines`); give the item a DIFFERENT,
    // stale value to prove the top-level canonical field still short-circuits
    // at clause 1 exactly as before.
    const sub: Record<string, unknown> = {
      object: "subscription",
      status: "active",
      current_period_start: 1778307401,
      current_period_end: 1780985801,
      items: { data: [{ current_period_start: 1 }] },
    };
    expect(getCurrentPeriodStart(sub)).toBe(NEW_PERIOD_START_ISO);
  });

  it("raw.period_start is still honored as a last-resort fallback when there is no line/item period (demoted, not deleted)", () => {
    // Mirrors the end-side "raw.period_end still honored" guard: an object
    // that only has top-level period_start (no lines, no items, no
    // current_period_start) must still resolve.
    expect(getCurrentPeriodStart({ period_start: 1778307401 })).toBe(
      NEW_PERIOD_START_ISO,
    );
  });
});
