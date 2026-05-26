// supabase/functions/stripe-webhook/__tests__/idempotencyClaim.test.ts
//
// Locks the atomic claim-before-process idempotency fix (audit N4, HIGH —
// see reports/RECON-stripe-idempotency.md). The pre-fix handler did a
// read-then-much-later-mark, so two concurrent deliveries of the same
// event_id both passed the check and the subscription grant / tier recompute
// ran twice. If this regresses, duplicate Stripe deliveries double-process
// money-path side-effects.

import { describe, expect, it, vi } from "vitest";
import {
  claimStripeWebhookEvent,
  releaseStripeWebhookEventClaim,
} from "../idempotency";

type UpsertResult = { data: unknown; error: unknown };
type DeleteResult = { error: unknown };

const EVENT = { id: "evt_1", type: "checkout.session.completed", livemode: true };

/**
 * Minimal fake of the supabase-js query builder for the two call chains the
 * idempotency module uses:
 *   .from(t).upsert(payload, opts).select(cols)   -> { data, error }
 *   .from(t).delete().eq(col, val)                -> { error }
 * Records the upsert options so we can assert ON CONFLICT DO NOTHING semantics.
 */
function fakeClient(opts: {
  upsert?: UpsertResult;
  del?: DeleteResult;
  onUpsert?: (payload: unknown, options: unknown) => void;
}) {
  const upsertSpy = vi.fn(
    (payload: unknown, options: unknown) => {
      opts.onUpsert?.(payload, options);
      return {
        select: vi.fn(() =>
          Promise.resolve(opts.upsert ?? { data: [], error: null }),
        ),
      };
    },
  );
  const eqSpy = vi.fn(() =>
    Promise.resolve(opts.del ?? { error: null }),
  );
  const client = {
    from: vi.fn(() => ({
      upsert: upsertSpy,
      delete: vi.fn(() => ({ eq: eqSpy })),
    })),
    // deno-lint-ignore no-explicit-any
  } as any;
  return { client, upsertSpy, eqSpy };
}

describe("claimStripeWebhookEvent", () => {
  it("returns 'claimed' when this delivery inserts the row (first delivery wins)", async () => {
    const { client } = fakeClient({
      upsert: { data: [{ event_id: "evt_1" }], error: null },
    });

    const result = await claimStripeWebhookEvent(client, EVENT);

    expect(result).toEqual({ status: "claimed" });
  });

  it("returns 'duplicate' when the row already exists (ON CONFLICT DO NOTHING → empty insert set)", async () => {
    const { client } = fakeClient({
      upsert: { data: [], error: null },
    });

    const result = await claimStripeWebhookEvent(client, EVENT);

    expect(result).toEqual({ status: "duplicate" });
  });

  it("claims with ON CONFLICT DO NOTHING semantics (onConflict + ignoreDuplicates)", async () => {
    let seenOptions: unknown = null;
    const { client, upsertSpy } = fakeClient({
      upsert: { data: [{ event_id: "evt_1" }], error: null },
      onUpsert: (_payload, options) => {
        seenOptions = options;
      },
    });

    await claimStripeWebhookEvent(client, EVENT);

    expect(upsertSpy).toHaveBeenCalledOnce();
    expect(seenOptions).toEqual({
      onConflict: "event_id",
      ignoreDuplicates: true,
    });
  });

  it("inserts the claim row unprocessed (processed_at null) before any side-effect", async () => {
    let seenPayload: Record<string, unknown> = {};
    const { client } = fakeClient({
      upsert: { data: [{ event_id: "evt_1" }], error: null },
      onUpsert: (payload) => {
        seenPayload = payload as Record<string, unknown>;
      },
    });

    await claimStripeWebhookEvent(client, EVENT);

    expect(seenPayload.event_id).toBe("evt_1");
    expect(seenPayload.processed_at).toBeNull();
    expect(seenPayload.error).toBeNull();
  });

  it("fails open ('table-missing') when stripe_webhook_events is absent (PGRST205)", async () => {
    const { client } = fakeClient({
      upsert: {
        data: null,
        error: {
          code: "PGRST205",
          message: "Could not find the table 'public.stripe_webhook_events'",
        },
      },
    });

    const result = await claimStripeWebhookEvent(client, EVENT);

    expect(result).toEqual({ status: "table-missing" });
  });

  it("rethrows a genuine DB error (not a conflict, not missing-table) so Stripe redelivers", async () => {
    const { client } = fakeClient({
      upsert: {
        data: null,
        error: { code: "08006", message: "connection failure" },
      },
    });

    await expect(claimStripeWebhookEvent(client, EVENT)).rejects.toMatchObject({
      code: "08006",
    });
  });

  it("concurrent-delivery proxy: exactly one of two same-event_id claims wins", async () => {
    // Deterministic stand-in for two simultaneous Stripe deliveries: a single
    // shared row store. The first claim inserts; the second observes the
    // ON CONFLICT DO NOTHING empty set. Only the winner may process.
    const store = new Set<string>();
    const racingClient = {
      from: () => ({
        upsert: (payload: { event_id: string }) => ({
          select: () => {
            if (store.has(payload.event_id)) {
              return Promise.resolve({ data: [], error: null });
            }
            store.add(payload.event_id);
            return Promise.resolve({
              data: [{ event_id: payload.event_id }],
              error: null,
            });
          },
        }),
      }),
      // deno-lint-ignore no-explicit-any
    } as any;

    const a = await claimStripeWebhookEvent(racingClient, EVENT);
    const b = await claimStripeWebhookEvent(racingClient, EVENT);

    const outcomes = [a.status, b.status].sort();
    expect(outcomes).toEqual(["claimed", "duplicate"]);
  });
});

describe("releaseStripeWebhookEventClaim", () => {
  it("deletes the claim row by event_id (lets Stripe's retry re-claim)", async () => {
    const { client, eqSpy } = fakeClient({ del: { error: null } });

    await expect(
      releaseStripeWebhookEventClaim(client, "evt_1"),
    ).resolves.toBeUndefined();
    expect(eqSpy).toHaveBeenCalledWith("event_id", "evt_1");
  });

  it("swallows a missing-table error (never throws on the error path)", async () => {
    const { client } = fakeClient({
      del: {
        error: {
          code: "PGRST205",
          message: "Could not find the table 'public.stripe_webhook_events'",
        },
      },
    });

    await expect(
      releaseStripeWebhookEventClaim(client, "evt_1"),
    ).resolves.toBeUndefined();
  });

  it("logs but does not throw when the delete itself fails", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { client } = fakeClient({
      del: { error: { code: "08006", message: "connection failure" } },
    });

    await expect(
      releaseStripeWebhookEventClaim(client, "evt_1"),
    ).resolves.toBeUndefined();
    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });
});
