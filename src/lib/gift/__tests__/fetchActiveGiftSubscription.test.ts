// src/lib/gift/__tests__/fetchActiveGiftSubscription.test.ts
//
// Unit tests for the read-side gift-subscription helper. Builds a
// tiny ad-hoc mock client so we can assert the exact PostgREST chain
// the helper composes (eq + or + order + limit + maybeSingle), and so
// we can drive the response shape into the helper without touching the
// project-wide supabaseMock.

import { describe, it, expect, vi } from "vitest";

import {
  fetchActiveGiftSubscription,
  type ActiveGiftSubscription,
} from "../fetchActiveGiftSubscription";

type MockResolver = () => Promise<{ data: unknown; error: unknown }>;

function makeClient(resolver: MockResolver) {
  // Each method returns the same chain; maybeSingle is the terminal.
  const chain: Record<string, unknown> = {};
  for (const m of [
    "select",
    "eq",
    "or",
    "order",
    "limit",
  ] as const) {
    chain[m] = vi.fn(() => chain);
  }
  chain.maybeSingle = vi.fn(() => resolver());
  const from = vi.fn(() => chain);
  return { client: { from } as never, chain, from };
}

const USER_ID = "5171545f-d9c9-435b-bb5f-f944314f099e";

describe("fetchActiveGiftSubscription", () => {
  it("returns null without querying when userId is empty", async () => {
    const { client, from } = makeClient(() =>
      Promise.resolve({ data: null, error: null }),
    );
    const result = await fetchActiveGiftSubscription(client, "");
    expect(result).toBeNull();
    expect(from).not.toHaveBeenCalled();
  });

  it("returns null when no row matches", async () => {
    const { client } = makeClient(() =>
      Promise.resolve({ data: null, error: null }),
    );
    const result = await fetchActiveGiftSubscription(client, USER_ID);
    expect(result).toBeNull();
  });

  it("composes the expected PostgREST chain (table + filters + order + limit)", async () => {
    const { client, chain, from } = makeClient(() =>
      Promise.resolve({ data: null, error: null }),
    );
    await fetchActiveGiftSubscription(client, USER_ID);

    expect(from).toHaveBeenCalledWith("user_subscriptions");
    expect(chain.select).toHaveBeenCalledWith(
      "tier_id, current_period_end, subscription_tiers ( vip_key, name )",
    );
    expect(chain.eq).toHaveBeenCalledWith("user_id", USER_ID);
    expect(chain.eq).toHaveBeenCalledWith("status", "active");
    expect(chain.eq).toHaveBeenCalledWith("is_gift_redemption", true);
    // current_period_end must allow null OR future timestamp.
    const orArg = (chain.or as ReturnType<typeof vi.fn>).mock.calls[0]?.[0];
    expect(orArg).toMatch(/^current_period_end\.is\.null,current_period_end\.gt\./);
    expect(chain.order).toHaveBeenCalledWith("current_period_end", {
      ascending: false,
      nullsFirst: false,
    });
    expect(chain.limit).toHaveBeenCalledWith(1);
  });

  it("returns shaped object when subscription_tiers comes back as an object", async () => {
    const { client } = makeClient(() =>
      Promise.resolve({
        data: {
          tier_id: "a2863250-1798-443e-b1d3-d20e3db06281",
          current_period_end: "2027-05-10T15:58:10.285802+00:00",
          subscription_tiers: { vip_key: "vip9", name: "One Year" },
        },
        error: null,
      }),
    );
    const result = await fetchActiveGiftSubscription(client, USER_ID);
    expect(result).toEqual({
      tier_id: "a2863250-1798-443e-b1d3-d20e3db06281",
      current_period_end: "2027-05-10T15:58:10.285802+00:00",
      vip_key: "vip9",
      plan_name: "One Year",
    } satisfies ActiveGiftSubscription);
  });

  it("handles subscription_tiers coming back as a single-element array", async () => {
    const { client } = makeClient(() =>
      Promise.resolve({
        data: {
          tier_id: "a2863250-1798-443e-b1d3-d20e3db06281",
          current_period_end: "2027-05-10T15:58:10.285802+00:00",
          subscription_tiers: [{ vip_key: "vip9", name: "One Year" }],
        },
        error: null,
      }),
    );
    const result = await fetchActiveGiftSubscription(client, USER_ID);
    expect(result?.vip_key).toBe("vip9");
    expect(result?.plan_name).toBe("One Year");
  });

  it("returns null on query error and does not throw", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { client } = makeClient(() =>
      Promise.resolve({
        data: null,
        error: { message: "rls denied" },
      }),
    );
    const result = await fetchActiveGiftSubscription(client, USER_ID);
    expect(result).toBeNull();
    expect(warn).toHaveBeenCalledWith(
      "[fetchActiveGiftSubscription] query failed:",
      "rls denied",
    );
    warn.mockRestore();
  });

  it("returns null fields when subscription_tiers is missing", async () => {
    const { client } = makeClient(() =>
      Promise.resolve({
        data: {
          tier_id: "a2863250-1798-443e-b1d3-d20e3db06281",
          current_period_end: null,
          subscription_tiers: null,
        },
        error: null,
      }),
    );
    const result = await fetchActiveGiftSubscription(client, USER_ID);
    expect(result).toEqual({
      tier_id: "a2863250-1798-443e-b1d3-d20e3db06281",
      current_period_end: null,
      vip_key: null,
      plan_name: null,
    });
  });
});
