// supabase/functions/stripe-webhook/__tests__/rawPayloadObjectQuality.test.ts
//
// A14 CLASS BUG regression lock — labels: silent-failure, money-path,
// fake-green-test.
//
// Root cause (A14 recon, reports/RECON-webhook-payload-type-bug-A14.md,
// discovered via mylinh.nutrition's invoice-clobbered subscription, webhook
// event evt_1TV59K): the monotonic upsert in billing.ts orders writes by
// *time* only. For a renewing/new monthly sub the freshness-winning event
// is `invoice.paid`, whose Stripe body is an **invoice** object
// (`object:"invoice"`, has `lines`, never `items.data[0].price.unit_amount`).
// It overwrote the persisted **subscription** body → `amount_cents` = 0 on
// the admin dashboard for every monthly renewer, and the A15 raw_payload
// backfill is starved of an `items` shape.
//
// Fix: `resolveMonotonicRawPayload` makes raw_payload monotonic on object
// *quality* as well as time — a lower-quality incoming body never
// overwrites a higher-quality persisted body, while the freshness marker
// still advances so the status/period/price column ordering is unchanged.
//
// The pre-existing webhook tests stayed GREEN through all of this because
// none of them could import billing.ts (it transitively pulls Deno-only
// _shared/core.ts) — the failure mode this suite exists to kill.
// subscription-insert.ts is the extracted, dependency-free home so the real
// decision is finally exercised by a deterministic test (same pattern as
// period-resolution.ts for the B5 bug).

import { describe, expect, it } from "vitest";

import {
  classifyRawPayloadObject,
  mapStripeSubscription,
  resolveMonotonicRawPayload,
} from "../subscription-insert";
import mylinhInvoice from "./__fixtures__/mylinh-invoice-subscription-cycle.json";

// The REAL prod invoice body that did the clobbering (see fixture
// _provenance). This is the exact "bad" object the guard must reject.
const invoiceBody = mylinhInvoice as unknown as Record<string, unknown>;

// A representative persisted subscription body — the shape the admin
// dashboard's `amount_cents` reads (`items.data[0].price.unit_amount`).
// It carries an OLD __stripe_freshness, as a real persisted row would.
function subscriptionBody(): Record<string, unknown> {
  return {
    id: "sub_MYLINH",
    object: "subscription",
    status: "active",
    current_period_start: 1775715401,
    current_period_end: 1778307401,
    items: {
      object: "list",
      data: [
        {
          id: "si_X",
          object: "subscription_item",
          price: {
            id: "price_MONTHLY_VND",
            object: "price",
            unit_amount: 200000,
            currency: "vnd",
            recurring: { interval: "month" },
          },
        },
      ],
    },
    __stripe_freshness: {
      object_time_ms: 1778307401000,
      event_created: 1775715401,
      event_id: "evt_SUB_CREATED",
      event_type: "customer.subscription.created",
      event_priority: 50,
    },
  };
}

// The freshness the persisted row MUST carry after the invoice event so the
// monotonic ordering for status/period/price columns is byte-identical to
// pre-fix. Identity-checked below.
const INCOMING_INVOICE_FRESHNESS = {
  object_time_ms: 1780985801000, // lines[0].period.end — B5-correct
  event_created: 1775715500,
  event_id: "evt_1TV59K",
  event_type: "invoice.paid",
  event_priority: 40,
} as const;

// What attachStripeFreshnessToRawPayload(invoice, event) would produce.
function invoiceWithFreshness(): Record<string, unknown> {
  return { ...invoiceBody, __stripe_freshness: INCOMING_INVOICE_FRESHNESS };
}

describe("A14 anti fake-green — the fixture is the REAL failure shape", () => {
  it("is genuinely an invoice object with no `items` and a `lines` array", () => {
    // If the fixture ever gains top-level `items` or stops being an
    // invoice, every assertion below would pass vacuously.
    expect(invoiceBody.object).toBe("invoice");
    expect(invoiceBody.items).toBeUndefined();
    expect((invoiceBody.lines as { data?: unknown[] })?.data?.length)
      .toBeGreaterThan(0);
    expect(classifyRawPayloadObject(invoiceBody)).toBe("invoice");
    expect(classifyRawPayloadObject(subscriptionBody())).toBe("subscription");
  });

  it("documents the bug: the unguarded writer persists the invoice body", () => {
    // mapStripeSubscription is a pure passthrough (unchanged by this fix).
    // On origin/main billing.ts handed it the invoice body verbatim, so
    // `subscriptions.raw_payload.object` became "invoice" — the bug, in
    // one assertion. The fix is billing.ts choosing a better body to pass,
    // which `resolveMonotonicRawPayload` (below) computes.
    const row = mapStripeSubscription({
      nowIso: "2026-05-19T00:00:00.000Z",
      userId: "u1",
      appId: "mercyblade",
      providerCustomerId: "cus_A",
      providerSubscriptionId: "sub_MYLINH",
      environment: "production",
      rawPayload: invoiceWithFreshness(),
    });
    const persisted = row.raw_payload as Record<string, unknown>;
    expect(persisted.object).toBe("invoice"); // <- the damage, pre-fix
    expect(persisted.items).toBeUndefined();
  });
});

describe("resolveMonotonicRawPayload — invoice must NOT clobber a subscription", () => {
  it("keeps the persisted subscription body when an invoice arrives", () => {
    const result = resolveMonotonicRawPayload({
      incomingRawPayloadWithFreshness: invoiceWithFreshness(),
      incomingRawPayload: invoiceBody,
      existingRawPayload: subscriptionBody(),
      incomingFreshness: INCOMING_INVOICE_FRESHNESS,
    });

    expect(result.preserved).toBe(true);
    expect(result.existingKind).toBe("subscription");
    expect(result.incomingKind).toBe("invoice");

    const persisted = result.rawPayload as Record<string, unknown>;
    // The whole bug fixed in two assertions: body stays subscription-typed
    // and the dashboard's amount source survives.
    expect(persisted.object).toBe("subscription");
    expect(
      (persisted.items as { data: Array<{ price: { unit_amount: number } }> })
        .data[0].price.unit_amount,
    ).toBe(200000);
    // It is the persisted body, NOT a merge — no invoice fields leak in.
    expect(persisted.lines).toBeUndefined();
    expect(persisted.amount_paid).toBeUndefined();
  });

  it("advances the freshness marker so column ordering is unchanged", () => {
    const result = resolveMonotonicRawPayload({
      incomingRawPayloadWithFreshness: invoiceWithFreshness(),
      incomingRawPayload: invoiceBody,
      existingRawPayload: subscriptionBody(),
      incomingFreshness: INCOMING_INVOICE_FRESHNESS,
    });
    const persisted = result.rawPayload as Record<string, unknown>;
    // Must be the INCOMING invoice freshness, not the stale sub freshness —
    // otherwise the next event's monotonic comparison would regress.
    expect(persisted.__stripe_freshness).toBe(INCOMING_INVOICE_FRESHNESS);
  });

  it("simulated lifecycle: sub.created → invoice.paid keeps it subscription", () => {
    // 1) subscription.created persisted (no existing row).
    const created = resolveMonotonicRawPayload({
      incomingRawPayloadWithFreshness: subscriptionBody(),
      incomingRawPayload: subscriptionBody(),
      existingRawPayload: null,
      incomingFreshness: subscriptionBody().__stripe_freshness,
    });
    expect(created.preserved).toBe(false);
    expect((created.rawPayload as Record<string, unknown>).object)
      .toBe("subscription");

    // 2) invoice.paid arrives next, freshness-winning.
    const afterInvoice = resolveMonotonicRawPayload({
      incomingRawPayloadWithFreshness: invoiceWithFreshness(),
      incomingRawPayload: invoiceBody,
      existingRawPayload: created.rawPayload,
      incomingFreshness: INCOMING_INVOICE_FRESHNESS,
    });
    expect(afterInvoice.preserved).toBe(true);
    expect((afterInvoice.rawPayload as Record<string, unknown>).object)
      .toBe("subscription");
  });
});

describe("resolveMonotonicRawPayload — does not over-reach", () => {
  it("a real subscription update STILL overwrites the body (equal quality)", () => {
    const result = resolveMonotonicRawPayload({
      incomingRawPayloadWithFreshness: subscriptionBody(),
      incomingRawPayload: subscriptionBody(),
      existingRawPayload: subscriptionBody(),
      incomingFreshness: INCOMING_INVOICE_FRESHNESS,
    });
    expect(result.preserved).toBe(false);
  });

  it("subscription incoming over a persisted invoice wins normally", () => {
    const result = resolveMonotonicRawPayload({
      incomingRawPayloadWithFreshness: subscriptionBody(),
      incomingRawPayload: subscriptionBody(),
      existingRawPayload: invoiceBody,
      incomingFreshness: INCOMING_INVOICE_FRESHNESS,
    });
    expect(result.preserved).toBe(false);
    expect((result.rawPayload as Record<string, unknown>).object)
      .toBe("subscription");
  });

  it("invoice over an already-clobbered invoice row: no regression, no fix", () => {
    // Equal (low) quality — guard does not fire; historical repair is the
    // A15 raw_payload backfill's job, not this writer's.
    const result = resolveMonotonicRawPayload({
      incomingRawPayloadWithFreshness: invoiceWithFreshness(),
      incomingRawPayload: invoiceBody,
      existingRawPayload: invoiceBody,
      incomingFreshness: INCOMING_INVOICE_FRESHNESS,
    });
    expect(result.preserved).toBe(false);
  });

  it("first-ever event (no existing row) is never preserved", () => {
    const result = resolveMonotonicRawPayload({
      incomingRawPayloadWithFreshness: invoiceWithFreshness(),
      incomingRawPayload: invoiceBody,
      existingRawPayload: null,
      incomingFreshness: INCOMING_INVOICE_FRESHNESS,
    });
    expect(result.preserved).toBe(false);
    expect((result.rawPayload as Record<string, unknown>).object)
      .toBe("invoice");
  });
});
