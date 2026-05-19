// supabase/functions/billing-stripe-change-plan/__tests__/logic.test.ts
//
// The pure money-path decision logic of the Stripe plan-change function.
// Edge functions are excluded from tsconfig + eslint, so this is the only
// automated guard on these branches. The highest-stakes one is
// shouldForceCheckoutForLifecycle: if a canceled/expired Stripe
// subscription were treated as "updatable", the function would try to
// mutate a dead subscription instead of starting a fresh paid checkout —
// a silent revenue leak. inferChangeType drives upgrade-vs-downgrade
// proration; the id/url validators are the input-shape gate.

import { describe, expect, it } from "vitest";
import type Stripe from "npm:stripe@12.18.0";

import {
  asBooleanOrNull,
  asNonEmptyStringOrNull,
  asRecordOrNull,
  buildDefaultUrls,
  getBearerToken,
  getExistingRecurringItem,
  getRequestOrigin,
  getStringField,
  getSubscriptionLifecycleSnapshot,
  inferChangeType,
  isFreeTier,
  isStripeCustomerId,
  isStripePriceId,
  isStripeSubscriptionUpdatable,
  isValidHttpUrl,
  normalize,
  shouldForceCheckoutForLifecycle,
} from "../logic";

function sub(overrides: Partial<Stripe.Subscription>): Stripe.Subscription {
  return {
    id: "sub_1",
    status: "active",
    cancel_at_period_end: false,
    cancel_at: null,
    canceled_at: null,
    ended_at: null,
    current_period_end: 1_900_000_000,
    current_period_start: 1_800_000_000,
    collection_method: "charge_automatically",
    default_payment_method: null,
    items: { data: [] },
    ...overrides,
  } as unknown as Stripe.Subscription;
}

function price(unitAmount: number | null): Stripe.Price {
  return { unit_amount: unitAmount } as unknown as Stripe.Price;
}

describe("inferChangeType", () => {
  it("classifies a higher target price as an upgrade", () => {
    expect(
      inferChangeType({ currentPrice: price(1000), targetPrice: price(2500) }),
    ).toBe("upgrade");
  });

  it("classifies a lower target price as a downgrade", () => {
    expect(
      inferChangeType({ currentPrice: price(2500), targetPrice: price(1000) }),
    ).toBe("downgrade");
  });

  it("classifies an equal price as lateral", () => {
    expect(
      inferChangeType({ currentPrice: price(1000), targetPrice: price(1000) }),
    ).toBe("lateral");
  });

  it("treats a null unit_amount as 0 (free -> paid is an upgrade)", () => {
    expect(
      inferChangeType({ currentPrice: price(null), targetPrice: price(500) }),
    ).toBe("upgrade");
    expect(
      inferChangeType({ currentPrice: price(null), targetPrice: price(null) }),
    ).toBe("lateral");
  });
});

describe("isStripeSubscriptionUpdatable", () => {
  it.each(["active", "trialing", "past_due", "unpaid"])(
    "allows an in-place update for %s",
    (status) => {
      expect(isStripeSubscriptionUpdatable(sub({ status: status as Stripe.Subscription["status"] }))).toBe(true);
    },
  );

  it.each(["canceled", "incomplete", "incomplete_expired", "paused"])(
    "blocks an in-place update for %s",
    (status) => {
      expect(isStripeSubscriptionUpdatable(sub({ status: status as Stripe.Subscription["status"] }))).toBe(false);
    },
  );
});

describe("shouldForceCheckoutForLifecycle (revenue-leak guard)", () => {
  it("forces a fresh checkout for a canceled subscription", () => {
    expect(shouldForceCheckoutForLifecycle(sub({ status: "canceled" }))).toBe(true);
  });

  it("forces a fresh checkout for an incomplete_expired subscription", () => {
    expect(
      shouldForceCheckoutForLifecycle(sub({ status: "incomplete_expired" })),
    ).toBe(true);
  });

  it("forces a fresh checkout when canceled_at is set even if status looks active", () => {
    expect(
      shouldForceCheckoutForLifecycle(
        sub({ status: "active", canceled_at: 1_850_000_000 }),
      ),
    ).toBe(true);
  });

  it("forces a fresh checkout when ended_at is set", () => {
    expect(
      shouldForceCheckoutForLifecycle(sub({ ended_at: 1_850_000_000 })),
    ).toBe(true);
  });

  it("does NOT force checkout for a clean active subscription", () => {
    expect(shouldForceCheckoutForLifecycle(sub({ status: "active" }))).toBe(false);
  });
});

describe("Stripe id + url validators (input-shape gate)", () => {
  it("accepts well-formed and rejects malformed / missing price ids", () => {
    expect(isStripePriceId("price_1MoBy5LkdIwHu7ix")).toBe(true);
    expect(isStripePriceId("prod_123")).toBe(false);
    expect(isStripePriceId("")).toBe(false);
    expect(isStripePriceId(null)).toBe(false);
  });

  it("accepts well-formed and rejects malformed / missing customer ids", () => {
    expect(isStripeCustomerId("cus_NffrFeUfNV2Hib")).toBe(true);
    expect(isStripeCustomerId("customer_1")).toBe(false);
    expect(isStripeCustomerId(null)).toBe(false);
  });

  it("accepts only http/https urls", () => {
    expect(isValidHttpUrl("https://mercyblade.com/pricing")).toBe(true);
    expect(isValidHttpUrl("http://localhost:3107")).toBe(true);
    expect(isValidHttpUrl("ftp://x.com")).toBe(false);
    expect(isValidHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isValidHttpUrl("not a url")).toBe(false);
    expect(isValidHttpUrl(null)).toBe(false);
  });
});

describe("getStringField (missing required field)", () => {
  it("returns the first non-empty value across candidate keys", () => {
    expect(getStringField({ a: "", b: "  hit  " }, ["a", "b"])).toBe("hit");
    expect(getStringField({ priceId: "price_x" }, ["price_id", "priceId"])).toBe(
      "price_x",
    );
  });

  it("returns null when every candidate key is missing or blank", () => {
    expect(getStringField({}, ["price_id", "priceId"])).toBeNull();
    expect(getStringField({ price_id: "   ", priceId: 5 }, ["price_id", "priceId"])).toBeNull();
  });
});

describe("primitive coercers", () => {
  it("asNonEmptyStringOrNull trims and rejects blanks/non-strings", () => {
    expect(asNonEmptyStringOrNull("  x ")).toBe("x");
    expect(asNonEmptyStringOrNull("   ")).toBeNull();
    expect(asNonEmptyStringOrNull(42)).toBeNull();
    expect(asNonEmptyStringOrNull(null)).toBeNull();
  });

  it("asBooleanOrNull only passes real booleans", () => {
    expect(asBooleanOrNull(true)).toBe(true);
    expect(asBooleanOrNull(false)).toBe(false);
    expect(asBooleanOrNull("true")).toBeNull();
    expect(asBooleanOrNull(1)).toBeNull();
  });

  it("asRecordOrNull rejects arrays / primitives / null", () => {
    expect(asRecordOrNull({ a: 1 })).toEqual({ a: 1 });
    expect(asRecordOrNull([1, 2])).toBeNull();
    expect(asRecordOrNull("x")).toBeNull();
    expect(asRecordOrNull(null)).toBeNull();
  });

  it("normalize lowercases + collapses whitespace", () => {
    expect(normalize("  Level   0 ")).toBe("level 0");
    expect(normalize(null)).toBe("");
  });

  it("isFreeTier is true only for the level0 tier name", () => {
    expect(isFreeTier({ name: "level0" })).toBe(true);
    expect(isFreeTier({ name: "LEVEL0" })).toBe(true);
    expect(isFreeTier({ name: "level1" })).toBe(false);
    expect(isFreeTier({ name: null })).toBe(false);
  });
});

describe("getBearerToken", () => {
  function req(auth?: string): Request {
    return new Request("https://x/y", {
      method: "POST",
      headers: auth ? { authorization: auth } : {},
    });
  }

  it("extracts the token regardless of header casing", () => {
    expect(getBearerToken(req("Bearer abc.def"))).toBe("abc.def");
    expect(getBearerToken(req("bearer  xyz  "))).toBe("xyz");
  });

  it("returns empty string when missing or not a bearer scheme", () => {
    expect(getBearerToken(req())).toBe("");
    expect(getBearerToken(req("Basic abc"))).toBe("");
  });
});

describe("getRequestOrigin + buildDefaultUrls", () => {
  function req(headers: Record<string, string>): Request {
    return new Request("https://x/y", { method: "POST", headers });
  }

  it("prefers the Origin header and strips trailing slashes", () => {
    expect(getRequestOrigin(req({ origin: "https://mercyblade.com/" }))).toBe(
      "https://mercyblade.com",
    );
  });

  it("falls back to the referer's origin", () => {
    expect(
      getRequestOrigin(req({ referer: "https://mercyblade.com/pricing?x=1" })),
    ).toBe("https://mercyblade.com");
  });

  it("returns null when neither header is usable", () => {
    expect(getRequestOrigin(req({ referer: "not-a-url" }))).toBeNull();
    expect(getRequestOrigin(req({}))).toBeNull();
  });

  it("buildDefaultUrls derives success/cancel from origin, with a localhost default", () => {
    expect(buildDefaultUrls(req({ origin: "https://mercyblade.com" }))).toEqual({
      successUrl: "https://mercyblade.com/billing/success",
      cancelUrl: "https://mercyblade.com/pricing",
    });
    expect(buildDefaultUrls(req({}))).toEqual({
      successUrl: "http://127.0.0.1:3107/billing/success",
      cancelUrl: "http://127.0.0.1:3107/pricing",
    });
  });
});

describe("getSubscriptionLifecycleSnapshot", () => {
  it("captures the lifecycle fields and normalizes default_payment_method", () => {
    expect(
      getSubscriptionLifecycleSnapshot(
        sub({ status: "past_due", default_payment_method: "pm_123" }),
      ).default_payment_method,
    ).toBe("pm_123");

    expect(
      getSubscriptionLifecycleSnapshot(
        sub({
          default_payment_method: { id: "pm_obj" } as unknown as Stripe.PaymentMethod,
        }),
      ).default_payment_method,
    ).toBe("pm_obj");

    const snap = getSubscriptionLifecycleSnapshot(sub({ status: "canceled" }));
    expect(snap.status).toBe("canceled");
    expect(snap.default_payment_method).toBeNull();
  });
});

describe("getExistingRecurringItem", () => {
  it("returns the first recurring, non-deleted item", () => {
    const item = {
      id: "si_1",
      price: { deleted: false, recurring: { interval: "month" } },
    };
    const found = getExistingRecurringItem(
      sub({ items: { data: [item] } as unknown as Stripe.ApiList<Stripe.SubscriptionItem> }),
    );
    expect(found?.id).toBe("si_1");
  });

  it("returns null when no item has a recurring price", () => {
    const item = { id: "si_1", price: { deleted: false, recurring: null } };
    expect(
      getExistingRecurringItem(
        sub({ items: { data: [item] } as unknown as Stripe.ApiList<Stripe.SubscriptionItem> }),
      ),
    ).toBeNull();
    expect(getExistingRecurringItem(sub({}))).toBeNull();
  });
});
