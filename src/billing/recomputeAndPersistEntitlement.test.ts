import { describe, expect, it } from "vitest";
import {
  recomputeAndPersistEntitlement,
  type SupabaseLike,
} from "./recomputeAndPersistEntitlement";

/**
 * Hot-path coverage for the read→derive→write orchestration in
 * recomputeAndPersistEntitlement. The dangerous failure mode is
 * "paid-but-locked-out": a valid paying user whose entitlement fails to
 * persist as active. These tests exercise the injectable `client` seam
 * (see the doc comment on recomputeAndPersistEntitlement) — the default
 * path uses a runtime-constructed dynamic import that vi.mock cannot
 * intercept, so injection is the only way to unit-test the orchestration.
 */

const FUTURE_END = "2099-01-01T00:00:00.000Z";
const PAST_END = "2000-01-01T00:00:00.000Z";

type SubRow = Record<string, unknown>;

interface FakeState {
  /** Rows returned for `subscriptions` select. */
  subscriptions: SubRow[];
  /** If set, the `subscriptions` select rejects with this error. */
  selectError?: { message: string };
  /** If set, the `profiles` update rejects with this error. */
  updateError?: { message: string };
}

/**
 * Minimal SupabaseLike double. Records every `profiles.update(...)`
 * payload and the user id each query filtered on so tests can assert
 * both the derived entitlement and exactly what got persisted.
 */
function makeClient(state: FakeState): {
  client: SupabaseLike;
  updates: Array<Record<string, unknown>>;
  filtered: { subscriptions: string[]; profiles: string[] };
} {
  const updates: Array<Record<string, unknown>> = [];
  const filtered = { subscriptions: [] as string[], profiles: [] as string[] };

  const client: SupabaseLike = {
    from(table: string) {
      return {
        select(_columns: string) {
          return {
            eq(_column: string, value: string) {
              if (table === "subscriptions") {
                filtered.subscriptions.push(value);
                if (state.selectError) {
                  return Promise.resolve({ error: state.selectError });
                }
                return Promise.resolve({
                  data: state.subscriptions,
                  error: null,
                });
              }
              return Promise.resolve({ data: [], error: null });
            },
          };
        },
        update(values: unknown) {
          return {
            eq(_column: string, value: string) {
              if (table === "profiles") {
                filtered.profiles.push(value);
                updates.push(values as Record<string, unknown>);
                if (state.updateError) {
                  return Promise.resolve({ error: state.updateError });
                }
                return Promise.resolve({ data: null, error: null });
              }
              return Promise.resolve({ data: null, error: null });
            },
          };
        },
      };
    },
  };

  return { client, updates, filtered };
}

describe("recomputeAndPersistEntitlement", () => {
  it("(a) valid paid sub → grants tier and persists active premium_*", async () => {
    const { client, updates, filtered } = makeClient({
      subscriptions: [
        { provider: "stripe", status: "active", current_period_end: FUTURE_END },
      ],
    });

    const result = await recomputeAndPersistEntitlement("user-1", client);

    expect(result).toEqual({
      status: "active",
      expires_at: FUTURE_END,
      source: "stripe",
    });
    expect(updates).toEqual([
      {
        premium_status: "active",
        premium_expires_at: FUTURE_END,
        premium_source: "stripe",
      },
    ]);
    // Both queries scoped to the requested user.
    expect(filtered.subscriptions).toEqual(["user-1"]);
    expect(filtered.profiles).toEqual(["user-1"]);
  });

  it("(b) expired sub → revokes: persists inactive premium_*", async () => {
    const { client, updates } = makeClient({
      subscriptions: [
        // Past period_end AND a non-entitling status — the canonical
        // "subscription lapsed" shape. Must clear premium, not linger.
        { provider: "stripe", status: "expired", current_period_end: PAST_END },
      ],
    });

    const result = await recomputeAndPersistEntitlement("user-2", client);

    expect(result).toEqual({
      status: "inactive",
      expires_at: null,
      source: null,
    });
    expect(updates).toEqual([
      {
        premium_status: "inactive",
        premium_expires_at: null,
        premium_source: null,
      },
    ]);
  });

  it("(c) Stripe price_id mismatch but status/period_end valid → still grants (PR #700 invariant)", async () => {
    // PR #700: a stale/wrong price_id in billing_price_map must NOT lock a
    // paying user out. Entitlement derives from status + current_period_end
    // + provider ONLY — never the price/product id. This row carries a
    // bogus product_id on purpose; entitlement must ignore it entirely.
    const { client, updates } = makeClient({
      subscriptions: [
        {
          provider: "stripe",
          status: "active",
          current_period_end: FUTURE_END,
          product_id: "price_STALE_DOES_NOT_MATCH_billing_price_map",
        },
      ],
    });

    const result = await recomputeAndPersistEntitlement("user-3", client);

    expect(result).toEqual({
      status: "active",
      expires_at: FUTURE_END,
      source: "stripe",
    });
    expect(updates[0]).toMatchObject({ premium_status: "active" });
  });

  describe("(d) DB failure → error surfaces (no silent paid-but-locked-out)", () => {
    it("profiles write failure rejects with a persist error", async () => {
      const { client, updates } = makeClient({
        subscriptions: [
          {
            provider: "stripe",
            status: "active",
            current_period_end: FUTURE_END,
          },
        ],
        updateError: { message: "deadlock detected" },
      });

      await expect(
        recomputeAndPersistEntitlement("user-4", client),
      ).rejects.toThrow("Failed to persist entitlement: deadlock detected");
      // The write was attempted (so the failure is loud, not skipped).
      expect(updates).toHaveLength(1);
    });

    it("subscriptions read failure rejects with a load error and never writes", async () => {
      const { client, updates } = makeClient({
        subscriptions: [],
        selectError: { message: "connection reset" },
      });

      await expect(
        recomputeAndPersistEntitlement("user-5", client),
      ).rejects.toThrow("Failed to load subscriptions: connection reset");
      // Must NOT have touched profiles when the read failed.
      expect(updates).toHaveLength(0);
    });
  });

  it("(e) idempotent re-run → identical result and identical persisted payload", async () => {
    const { client, updates } = makeClient({
      subscriptions: [
        { provider: "stripe", status: "active", current_period_end: FUTURE_END },
      ],
    });

    const first = await recomputeAndPersistEntitlement("user-6", client);
    const second = await recomputeAndPersistEntitlement("user-6", client);

    expect(second).toEqual(first);
    // Two runs, two writes, byte-identical — no drift / no accumulation.
    expect(updates).toHaveLength(2);
    expect(updates[1]).toEqual(updates[0]);
  });
});
