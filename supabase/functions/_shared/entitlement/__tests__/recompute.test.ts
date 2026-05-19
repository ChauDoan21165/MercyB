// supabase/functions/_shared/entitlement/__tests__/recompute.test.ts
//
// A18 PR1 unit suite for the server-side `recomputeEntitlement` writer.
//
// Mocked surface:
//   - supabase client: in-memory `.from(table)` returning a thenable
//     chain that resolves to `{data, error}`, and `.rpc(name, args)`
//     returning the same shape. No network, no Deno runtime.
//   - `captureEdgeError` from `../../sentry.ts`: spied via `vi.mock`
//     so we can assert (a) which `tags.phase` was emitted on a
//     failure path, (b) that a non-throwing inconsistency still emits
//     a warning, and (c) that the happy path emits ZERO calls.
//
// Coverage matrix (A18 §8 mandatory cases):
//   1. Idempotency           — same rows + same `opts.now` ⇒
//                              byte-identical row across N calls; one
//                              upsert payload per call (no append).
//   2. Injected clock         — frozen Date yields deterministic RPC
//                              `p_computed_at`; omitting `opts.now`
//                              uses a fresh Date read once.
//   3. Monotonic guard        — caller does NOT loop / retry on a
//                              stale-rejected RPC response; the RPC's
//                              own re-read returns the fresher row
//                              and the writer accepts it as truth.
//   4. Convergence            — out-of-order concurrent reasons
//                              (stripe-webhook → revenuecat-webhook)
//                              with the same input rows + frozen now
//                              produce the same final row.
//   5. Failure paths fail loud — R1 error, R2 error, RPC error each
//                              call captureEdgeError with the right
//                              `tags.phase` and THROW. No swallow.
//   6. Gift-inconsistency      — bad gift rows (`is_gift_redemption=
//                              false` or null period_end) capture a
//                              warning + are filtered, but DO NOT
//                              throw; the rest of derive still runs.
//   7. RPC-returned-null race — RPC reports success but data is null
//                              (concurrent profile delete) ⇒ throws.
//
// `deriveEntitlement` itself is B13 ph3's contract — we trust it (its
// 152-case suite lives in `_shared/__tests__/entitlement.test.ts`).
// These tests mock the *inputs* and assert what `recomputeEntitlement`
// PASSES THROUGH to the RPC, not the entitling/expiry rules.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  DEFAULT_APP_ID,
  type EntitlementRow,
  recomputeEntitlement,
  type RecomputeOptions,
  type SupabaseClientLike,
} from "../recompute";

const captureEdgeErrorMock = vi.fn().mockResolvedValue(undefined);
vi.mock("../../sentry.ts", () => ({
  captureEdgeError: (...args: unknown[]) => captureEdgeErrorMock(...args),
}));

const NOW = new Date("2026-05-19T22:30:00.000Z");
const NOW_ISO = NOW.toISOString();
const ONE_DAY = 24 * 60 * 60 * 1000;
const future = (ms: number) => new Date(NOW.getTime() + ms).toISOString();
const past = (ms: number) => new Date(NOW.getTime() - ms).toISOString();

const USER_ID = "00000000-0000-4000-8000-000000000001";

beforeEach(() => {
  captureEdgeErrorMock.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

/* ────────────────────────────────────────────────────────────────────
 * Fake supabase client
 *
 * Each `.from(table)` returns a chainable proxy whose terminal `await`
 * resolves to a pre-configured `{data, error}`. The chain accepts the
 * subset of methods recompute.ts uses: `select`, `eq`, `gt`, `order`,
 * `limit`. `.rpc(name, args)` records the call and resolves to a
 * pre-configured response.
 * ──────────────────────────────────────────────────────────────────── */

type ResolveWith = { data: unknown; error: unknown };

interface FakeClientOptions {
  subscriptions?: ResolveWith;
  gifts?: ResolveWith;
  rpc?: ResolveWith | ((args: Record<string, unknown>) => ResolveWith);
}

interface RecordedCalls {
  subscriptionsFilters: Array<[string, unknown]>;
  giftsFilters: Array<[string, unknown]>;
  giftsOrder: Array<[string, unknown]>;
  giftsLimit: number | null;
  rpcCalls: Array<{ fn: string; args: Record<string, unknown> }>;
}

function makeFakeClient(opts: FakeClientOptions = {}): {
  client: SupabaseClientLike;
  calls: RecordedCalls;
} {
  const calls: RecordedCalls = {
    subscriptionsFilters: [],
    giftsFilters: [],
    giftsOrder: [],
    giftsLimit: null,
    rpcCalls: [],
  };

  function buildSubscriptionsChain(): Record<string, unknown> {
    const chain: Record<string, unknown> = {};
    const select = () => chain;
    const eq = (col: string, val: unknown) => {
      calls.subscriptionsFilters.push([col, val]);
      return chain;
    };
    chain.select = select;
    chain.eq = eq;
    // terminal: thenable
    chain.then = (resolve: (r: ResolveWith) => void) =>
      resolve(opts.subscriptions ?? { data: [], error: null });
    return chain;
  }

  function buildGiftsChain(): Record<string, unknown> {
    const chain: Record<string, unknown> = {};
    chain.select = () => chain;
    chain.eq = (col: string, val: unknown) => {
      calls.giftsFilters.push([col, val]);
      return chain;
    };
    chain.gt = (col: string, val: unknown) => {
      calls.giftsFilters.push([col, val]);
      return chain;
    };
    chain.order = (col: string, options: unknown) => {
      calls.giftsOrder.push([col, options]);
      return chain;
    };
    chain.limit = (n: number) => {
      calls.giftsLimit = n;
      return chain;
    };
    chain.then = (resolve: (r: ResolveWith) => void) =>
      resolve(opts.gifts ?? { data: [], error: null });
    return chain;
  }

  const client: SupabaseClientLike = {
    from(table: string) {
      if (table === "subscriptions") return buildSubscriptionsChain();
      if (table === "user_subscriptions") return buildGiftsChain();
      throw new Error(`fakeClient: unexpected table ${table}`);
    },
    rpc(fn: string, args: Record<string, unknown>) {
      calls.rpcCalls.push({ fn, args });
      const r = typeof opts.rpc === "function" ? opts.rpc(args) : opts.rpc;
      return Promise.resolve(r ?? defaultRpcSuccess(args));
    },
  };

  return { client, calls };
}

function defaultRpcSuccess(args: Record<string, unknown>): ResolveWith {
  const row: EntitlementRow = {
    user_id: args.p_user_id as string,
    app_id: args.p_app_id as string,
    status: args.p_status as EntitlementRow["status"],
    source: args.p_source as EntitlementRow["source"],
    expires_at: args.p_expires_at as string | null,
    is_premium: ["active", "trialing", "grace_period", "past_due"].includes(
      args.p_status as string,
    ),
    computed_at: args.p_computed_at as string,
    updated_at: args.p_computed_at as string,
  };
  return { data: row, error: null };
}

function opts(reason: RecomputeOptions["reason"], overrides: Partial<RecomputeOptions> = {}): RecomputeOptions {
  return { reason, now: NOW, ...overrides };
}

/* ────────────────────────────────────────────────────────────────────
 * 1. Idempotency
 * ──────────────────────────────────────────────────────────────────── */

describe("recomputeEntitlement — idempotency (case 1)", () => {
  it("same rows + same opts.now ⇒ byte-identical EntitlementRow across calls", async () => {
    const subs = {
      data: [
        { status: "active", current_period_end: future(30 * ONE_DAY), provider: "stripe", id: "s1" },
      ],
      error: null,
    };

    const { client: c1, calls: calls1 } = makeFakeClient({ subscriptions: subs });
    const { client: c2, calls: calls2 } = makeFakeClient({ subscriptions: subs });
    const { client: c3, calls: calls3 } = makeFakeClient({ subscriptions: subs });

    const r1 = await recomputeEntitlement(c1, USER_ID, opts("stripe-webhook"));
    const r2 = await recomputeEntitlement(c2, USER_ID, opts("stripe-webhook"));
    const r3 = await recomputeEntitlement(c3, USER_ID, opts("stripe-webhook"));

    expect(r1).toEqual(r2);
    expect(r2).toEqual(r3);
    // Each call produced exactly one RPC invocation, never appended.
    expect(calls1.rpcCalls).toHaveLength(1);
    expect(calls2.rpcCalls).toHaveLength(1);
    expect(calls3.rpcCalls).toHaveLength(1);
    // The upsert payload is byte-identical too.
    expect(calls1.rpcCalls[0].args).toEqual(calls2.rpcCalls[0].args);
  });
});

/* ────────────────────────────────────────────────────────────────────
 * 2. Injected clock
 * ──────────────────────────────────────────────────────────────────── */

describe("recomputeEntitlement — injected clock (case 2)", () => {
  it("frozen Date in opts.now becomes the RPC p_computed_at", async () => {
    const { client, calls } = makeFakeClient();
    await recomputeEntitlement(client, USER_ID, opts("backfill"));
    expect(calls.rpcCalls[0].args.p_computed_at).toBe(NOW_ISO);
  });

  it("omitting opts.now uses a fresh Date — derived expiry/status are still consistent", async () => {
    const { client, calls } = makeFakeClient({
      subscriptions: {
        data: [{ status: "active", current_period_end: "2099-12-31T00:00:00.000Z", provider: "stripe", id: "s1" }],
        error: null,
      },
    });
    await recomputeEntitlement(client, USER_ID, { reason: "stripe-webhook" });
    expect(calls.rpcCalls[0].args.p_status).toBe("active");
    // No `now` was passed; we cannot assert the exact ISO, only that it
    // is an ISO string and is consistent with the row that won.
    expect(typeof calls.rpcCalls[0].args.p_computed_at).toBe("string");
    expect((calls.rpcCalls[0].args.p_computed_at as string)).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("uses the SAME nowIso for the gift `gt` filter and the RPC p_computed_at", async () => {
    const { client, calls } = makeFakeClient();
    await recomputeEntitlement(client, USER_ID, opts("stripe-webhook"));
    // The gifts chain `.gt("current_period_end", nowIso)` filter must
    // use the same ISO the RPC receives — both come from `now` captured
    // once at function entry.
    const gtFilter = calls.giftsFilters.find(([col]) => col === "current_period_end");
    expect(gtFilter).toBeDefined();
    expect(gtFilter![1]).toBe(NOW_ISO);
    expect(calls.rpcCalls[0].args.p_computed_at).toBe(NOW_ISO);
  });
});

/* ────────────────────────────────────────────────────────────────────
 * 3. Monotonic guard
 * ──────────────────────────────────────────────────────────────────── */

describe("recomputeEntitlement — monotonic guard (case 3)", () => {
  it("RPC re-read on stale-rejected upsert: writer accepts the fresher row as truth", async () => {
    // Simulate the WHERE excluded.computed_at >= entitlements.computed_at
    // path rejecting the upsert, RPC re-reading the fresher row, and
    // returning it. The JS writer must not retry or loop — it accepts
    // the returned row verbatim as the converged answer.
    const fresherRow: EntitlementRow = {
      user_id: USER_ID,
      app_id: DEFAULT_APP_ID,
      status: "active",
      source: "stripe",
      expires_at: future(60 * ONE_DAY),
      is_premium: true,
      computed_at: future(ONE_DAY), // fresher than our `now`
      updated_at: future(ONE_DAY),
    };

    const { client, calls } = makeFakeClient({
      subscriptions: {
        data: [{ status: "inactive", current_period_end: null, provider: null, id: "s1" }],
        error: null,
      },
      rpc: { data: fresherRow, error: null },
    });

    const result = await recomputeEntitlement(client, USER_ID, opts("stripe-webhook"));
    // We passed status=inactive but the RPC returned the fresher
    // active row — that is what the writer returns to the caller.
    expect(result).toEqual(fresherRow);
    // Exactly ONE RPC call — no JS-side retry loop.
    expect(calls.rpcCalls).toHaveLength(1);
  });
});

/* ────────────────────────────────────────────────────────────────────
 * 4. Convergence
 * ──────────────────────────────────────────────────────────────────── */

describe("recomputeEntitlement — convergence (case 4)", () => {
  it("two different reasons over the same input + frozen now produce the same row", async () => {
    const subs = {
      data: [{ status: "active", current_period_end: future(15 * ONE_DAY), provider: "stripe", id: "s1" }],
      error: null,
    };

    const { client: c1 } = makeFakeClient({ subscriptions: subs });
    const { client: c2 } = makeFakeClient({ subscriptions: subs });

    const r1 = await recomputeEntitlement(c1, USER_ID, opts("stripe-webhook"));
    const r2 = await recomputeEntitlement(c2, USER_ID, opts("revenuecat-webhook"));

    expect(r1).toEqual(r2);
  });
});

/* ────────────────────────────────────────────────────────────────────
 * 5. Failure paths fail loud
 * ──────────────────────────────────────────────────────────────────── */

describe("recomputeEntitlement — failure paths fail loud (case 5)", () => {
  it("R1 (subscriptions) read error ⇒ captureEdgeError + throw", async () => {
    const err = new Error("R1 boom");
    const { client } = makeFakeClient({
      subscriptions: { data: null, error: err },
    });
    await expect(recomputeEntitlement(client, USER_ID, opts("stripe-webhook"))).rejects.toThrow(err);
    expect(captureEdgeErrorMock).toHaveBeenCalledTimes(1);
    const [capturedErr, capturedOpts] = captureEdgeErrorMock.mock.calls[0];
    expect(capturedErr).toBe(err);
    expect(capturedOpts.functionName).toBe("recomputeEntitlement");
    expect(capturedOpts.userId).toBe(USER_ID);
    expect(capturedOpts.tags.phase).toBe("read-subscriptions");
    expect(capturedOpts.tags.reason).toBe("stripe-webhook");
  });

  it("R2 (gift) read error ⇒ captureEdgeError + throw, NOT silently degrade to no-gifts", async () => {
    const err = new Error("R2 boom");
    const { client } = makeFakeClient({
      gifts: { data: null, error: err },
    });
    await expect(recomputeEntitlement(client, USER_ID, opts("redeem-gift-code"))).rejects.toThrow(err);
    expect(captureEdgeErrorMock).toHaveBeenCalledTimes(1);
    const [, capturedOpts] = captureEdgeErrorMock.mock.calls[0];
    expect(capturedOpts.tags.phase).toBe("read-gifts");
    expect(capturedOpts.tags.reason).toBe("redeem-gift-code");
  });

  it("RPC (upsert) error ⇒ captureEdgeError + throw", async () => {
    const err = new Error("upsert boom");
    const { client } = makeFakeClient({
      rpc: { data: null, error: err },
    });
    await expect(recomputeEntitlement(client, USER_ID, opts("admin-manual-fix"))).rejects.toThrow(err);
    expect(captureEdgeErrorMock).toHaveBeenCalledTimes(1);
    const [, capturedOpts] = captureEdgeErrorMock.mock.calls[0];
    expect(capturedOpts.tags.phase).toBe("upsert-entitlements");
    expect(capturedOpts.tags.reason).toBe("admin-manual-fix");
  });

  it("happy path emits ZERO captureEdgeError calls", async () => {
    const { client } = makeFakeClient({
      subscriptions: {
        data: [{ status: "active", current_period_end: future(ONE_DAY), provider: "stripe", id: "s1" }],
        error: null,
      },
    });
    await recomputeEntitlement(client, USER_ID, opts("stripe-webhook"));
    expect(captureEdgeErrorMock).not.toHaveBeenCalled();
  });
});

/* ────────────────────────────────────────────────────────────────────
 * 6. Gift inconsistency
 * ──────────────────────────────────────────────────────────────────── */

describe("recomputeEntitlement — gift inconsistency surface (case 6)", () => {
  it("gift row with is_gift_redemption=false ⇒ captureEdgeError warning + filtered, function returns", async () => {
    // No subscriptions; the bad gift row is the only candidate. After
    // filtering, derive sees zero rows ⇒ inactive snapshot. The
    // function still completes successfully.
    const { client, calls } = makeFakeClient({
      gifts: {
        data: [
          {
            id: "g1",
            status: "active",
            is_gift_redemption: false,
            current_period_end: future(30 * ONE_DAY),
            source: "gift_code",
          },
        ],
        error: null,
      },
    });

    const result = await recomputeEntitlement(client, USER_ID, opts("backfill"));

    expect(result.status).toBe("inactive");
    expect(result.is_premium).toBe(false);
    expect(captureEdgeErrorMock).toHaveBeenCalledTimes(1);
    const [, capturedOpts] = captureEdgeErrorMock.mock.calls[0];
    expect(capturedOpts.tags.phase).toBe("gift-inconsistency");
    expect(capturedOpts.extra.giftRowId).toBe("g1");
    expect(capturedOpts.extra.isGiftRedemption).toBe(false);

    // The bad gift row did NOT make it into the RPC payload.
    expect(calls.rpcCalls[0].args.p_status).toBe("inactive");
    expect(calls.rpcCalls[0].args.p_expires_at).toBe(null);
  });

  it("gift row with null period_end ⇒ captureEdgeError warning + filtered", async () => {
    const { client } = makeFakeClient({
      gifts: {
        data: [
          {
            id: "g2",
            status: "active",
            is_gift_redemption: true,
            current_period_end: null,
            source: "gift_code",
          },
        ],
        error: null,
      },
    });

    const result = await recomputeEntitlement(client, USER_ID, opts("backfill"));

    expect(result.status).toBe("inactive");
    expect(captureEdgeErrorMock).toHaveBeenCalledTimes(1);
    const [, capturedOpts] = captureEdgeErrorMock.mock.calls[0];
    expect(capturedOpts.tags.phase).toBe("gift-inconsistency");
    expect(capturedOpts.extra.giftRowId).toBe("g2");
    expect(capturedOpts.extra.currentPeriodEnd).toBe(null);
  });

  it("valid gift row ⇒ entitlement.source='gift_code', is_premium=true", async () => {
    const { client, calls } = makeFakeClient({
      gifts: {
        data: [
          {
            id: "g3",
            status: "active",
            is_gift_redemption: true,
            current_period_end: future(30 * ONE_DAY),
            source: "gift_code",
          },
        ],
        error: null,
      },
    });

    const result = await recomputeEntitlement(client, USER_ID, opts("redeem-gift-code"));

    expect(result.status).toBe("active");
    expect(result.source).toBe("gift_code");
    expect(result.is_premium).toBe(true);
    expect(captureEdgeErrorMock).not.toHaveBeenCalled();
    expect(calls.rpcCalls[0].args.p_source).toBe("gift_code");
  });

  it("subscription row + bad gift row ⇒ subscription still wins, bad row captured", async () => {
    const { client } = makeFakeClient({
      subscriptions: {
        data: [
          { status: "active", current_period_end: future(60 * ONE_DAY), provider: "stripe", id: "s1" },
        ],
        error: null,
      },
      gifts: {
        data: [
          {
            id: "g4",
            status: "active",
            is_gift_redemption: false, // bad
            current_period_end: future(10 * ONE_DAY),
            source: "gift_code",
          },
        ],
        error: null,
      },
    });

    const result = await recomputeEntitlement(client, USER_ID, opts("admin-manual-fix"));

    expect(result.status).toBe("active");
    expect(result.source).toBe("stripe");
    expect(captureEdgeErrorMock).toHaveBeenCalledTimes(1);
    expect(captureEdgeErrorMock.mock.calls[0][1].tags.phase).toBe("gift-inconsistency");
  });
});

/* ────────────────────────────────────────────────────────────────────
 * 7. RPC-returned-null race
 * ──────────────────────────────────────────────────────────────────── */

describe("recomputeEntitlement — RPC null-data race (case 7)", () => {
  it("RPC returns success but data=null ⇒ throws + captureEdgeError", async () => {
    const { client } = makeFakeClient({
      rpc: { data: null, error: null },
    });

    await expect(
      recomputeEntitlement(client, USER_ID, opts("stripe-webhook")),
    ).rejects.toThrow(/RPC returned null/);

    expect(captureEdgeErrorMock).toHaveBeenCalledTimes(1);
    expect(captureEdgeErrorMock.mock.calls[0][1].tags.phase).toBe(
      "upsert-entitlements",
    );
  });

  it("RPC returns success but data=undefined ⇒ also throws", async () => {
    const { client } = makeFakeClient({
      rpc: { data: undefined, error: null },
    });

    await expect(
      recomputeEntitlement(client, USER_ID, opts("backfill")),
    ).rejects.toThrow(/RPC returned null/);
  });
});

/* ────────────────────────────────────────────────────────────────────
 * Misc — surface / wiring sanity
 * ──────────────────────────────────────────────────────────────────── */

describe("recomputeEntitlement — surface", () => {
  it("RPC is called by name 'recompute_entitlement_tx' with the 6 documented args", async () => {
    const { client, calls } = makeFakeClient();
    await recomputeEntitlement(client, USER_ID, opts("stripe-webhook"));
    expect(calls.rpcCalls).toHaveLength(1);
    expect(calls.rpcCalls[0].fn).toBe("recompute_entitlement_tx");
    expect(Object.keys(calls.rpcCalls[0].args).sort()).toEqual(
      ["p_app_id", "p_computed_at", "p_expires_at", "p_source", "p_status", "p_user_id"].sort(),
    );
    expect(calls.rpcCalls[0].args.p_user_id).toBe(USER_ID);
    expect(calls.rpcCalls[0].args.p_app_id).toBe(DEFAULT_APP_ID);
  });

  it("opts.appId overrides DEFAULT_APP_ID", async () => {
    const { client, calls } = makeFakeClient();
    await recomputeEntitlement(client, USER_ID, opts("backfill", { appId: "custom_app" }));
    expect(calls.rpcCalls[0].args.p_app_id).toBe("custom_app");
  });

  it("empty subscriptions + empty gifts ⇒ status='inactive', is_premium=false", async () => {
    const { client, calls } = makeFakeClient();
    const result = await recomputeEntitlement(client, USER_ID, opts("backfill"));
    expect(result.status).toBe("inactive");
    expect(result.is_premium).toBe(false);
    expect(result.expires_at).toBeNull();
    expect(calls.rpcCalls[0].args.p_status).toBe("inactive");
    expect(calls.rpcCalls[0].args.p_source).toBeNull();
    expect(calls.rpcCalls[0].args.p_expires_at).toBeNull();
  });

  it("filters subscriptions by user_id and app_id at the chain level", async () => {
    const { client, calls } = makeFakeClient();
    await recomputeEntitlement(client, USER_ID, opts("stripe-webhook"));

    const userFilter = calls.subscriptionsFilters.find(([col]) => col === "user_id");
    const appFilter = calls.subscriptionsFilters.find(([col]) => col === "app_id");
    expect(userFilter?.[1]).toBe(USER_ID);
    expect(appFilter?.[1]).toBe(DEFAULT_APP_ID);
  });

  it("filters gifts by user_id, status=active, is_gift_redemption=true, current_period_end>now", async () => {
    const { client, calls } = makeFakeClient();
    await recomputeEntitlement(client, USER_ID, opts("redeem-gift-code"));

    expect(calls.giftsFilters).toContainEqual(["user_id", USER_ID]);
    expect(calls.giftsFilters).toContainEqual(["status", "active"]);
    expect(calls.giftsFilters).toContainEqual(["is_gift_redemption", true]);
    expect(calls.giftsFilters).toContainEqual(["current_period_end", NOW_ISO]);
    expect(calls.giftsLimit).toBe(1);
  });
});
