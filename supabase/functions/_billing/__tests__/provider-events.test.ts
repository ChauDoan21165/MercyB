// supabase/functions/_billing/__tests__/provider-events.test.ts
//
// A12 coverage ratchet — lock registerProviderEvent's RPC wiring and
// the (internal) header-normalization helper. This is the function
// EVERY billing webhook calls to record an event on the ledger. If it
// silently drops fields, mis-routes idempotency keys, or swallows RPC
// errors, the money-path silently bleeds.
//
// We don't talk to a real Supabase here — pass a hand-built mock client
// whose `.rpc()` returns whatever shape the test needs.

import { describe, it, expect, vi } from "vitest";
import { registerProviderEvent } from "../provider-events";
import type { RegisterProviderEventInput } from "../types";

interface RpcCall {
  fn: string;
  args: Record<string, unknown>;
}

function mockClient(response: { data?: unknown; error?: { message: string } | null }) {
  const calls: RpcCall[] = [];
  const rpc = vi.fn(async (fn: string, args: Record<string, unknown>) => {
    calls.push({ fn, args });
    return response;
  });
  // Cast to the SupabaseClient surface — only `.rpc` is reached.
  return { client: { rpc } as unknown as Parameters<typeof registerProviderEvent>[0], calls, rpc };
}

const VALID_INPUT: RegisterProviderEventInput = {
  provider: "stripe",
  environment: "production",
  eventKey: "evt_test_001",
  providerEventId: "evt_provider_xyz",
  eventType: "invoice.paid",
  eventCreatedAt: "2026-05-20T01:00:00Z",
  payload: { id: "evt_provider_xyz", object: "event" },
  headers: { "X-Stripe-Signature": "v1=abcd" },
  metadata: { source: "test" },
};

describe("registerProviderEvent — happy path", () => {
  it("maps a single-row RPC response into the result", async () => {
    const { client } = mockClient({
      data: [
        {
          id: "uuid-1",
          is_new: true,
          delivery_count: 1,
          process_status: "pending",
        },
      ],
      error: null,
    });

    const result = await registerProviderEvent(client, VALID_INPUT);
    expect(result).toEqual({
      id: "uuid-1",
      isNew: true,
      deliveryCount: 1,
      processStatus: "pending",
    });
  });

  it("passes ALL of the input fields into the RPC as p_* params", async () => {
    const { client, calls } = mockClient({
      data: [{ id: "u", is_new: false, delivery_count: 2, process_status: "delivered" }],
      error: null,
    });

    await registerProviderEvent(client, VALID_INPUT);

    expect(calls).toHaveLength(1);
    expect(calls[0].fn).toBe("register_billing_provider_event");
    expect(calls[0].args).toMatchObject({
      p_provider: "stripe",
      p_environment: "production",
      p_event_key: "evt_test_001",
      p_provider_event_id: "evt_provider_xyz",
      p_event_type: "invoice.paid",
      p_event_created_at: "2026-05-20T01:00:00Z",
      p_payload: { id: "evt_provider_xyz", object: "event" },
      p_metadata: { source: "test" },
    });
  });

  it("lowercases header keys before passing to RPC (the silent bug surface)", async () => {
    const { client, calls } = mockClient({
      data: [{ id: "u", is_new: true, delivery_count: 1, process_status: "ok" }],
      error: null,
    });

    await registerProviderEvent(client, {
      ...VALID_INPUT,
      headers: {
        "X-Stripe-Signature": "v1=abcd",
        "USER-AGENT": "Stripe/1.0",
        "content-type": "application/json",
      },
    });

    expect(calls[0].args.p_headers).toEqual({
      "x-stripe-signature": "v1=abcd",
      "user-agent": "Stripe/1.0",
      "content-type": "application/json",
    });
  });

  it("defaults providerEventId, eventType, eventCreatedAt to null and payload/metadata to empty object", async () => {
    const { client, calls } = mockClient({
      data: [{ id: "u", is_new: true, delivery_count: 1, process_status: "ok" }],
      error: null,
    });

    await registerProviderEvent(client, {
      provider: "apple",
      environment: "sandbox",
      eventKey: "k1",
    });

    expect(calls[0].args).toMatchObject({
      p_provider: "apple",
      p_environment: "sandbox",
      p_event_key: "k1",
      p_provider_event_id: null,
      p_event_type: null,
      p_event_created_at: null,
      p_payload: {},
      p_headers: {},
      p_metadata: {},
    });
  });

  it("handles missing 'headers' input (undefined → {})", async () => {
    const { client, calls } = mockClient({
      data: [{ id: "u", is_new: true, delivery_count: 1, process_status: "ok" }],
      error: null,
    });

    const input: RegisterProviderEventInput = {
      provider: "google",
      environment: "production",
      eventKey: "k2",
      // headers omitted
    };

    await registerProviderEvent(client, input);
    expect(calls[0].args.p_headers).toEqual({});
  });
});

describe("registerProviderEvent — failure paths", () => {
  it("throws when the RPC returns an error", async () => {
    const { client } = mockClient({
      data: null,
      error: { message: "duplicate key value violates unique constraint" },
    });

    await expect(registerProviderEvent(client, VALID_INPUT)).rejects.toThrow(
      /register_billing_provider_event failed: duplicate key/,
    );
  });

  it("throws 'returned no rows' when data is empty array", async () => {
    const { client } = mockClient({ data: [], error: null });
    await expect(registerProviderEvent(client, VALID_INPUT)).rejects.toThrow(
      /returned no rows/,
    );
  });

  it("throws 'returned no rows' when data is null", async () => {
    const { client } = mockClient({ data: null, error: null });
    await expect(registerProviderEvent(client, VALID_INPUT)).rejects.toThrow(
      /returned no rows/,
    );
  });
});

describe("registerProviderEvent — false isNew + redelivery semantics", () => {
  it("maps is_new=false correctly (Postgres returned an existing row)", async () => {
    const { client } = mockClient({
      data: [{ id: "u-existing", is_new: false, delivery_count: 7, process_status: "delivered" }],
      error: null,
    });

    const result = await registerProviderEvent(client, VALID_INPUT);
    expect(result.isNew).toBe(false);
    expect(result.deliveryCount).toBe(7);
    expect(result.processStatus).toBe("delivered");
  });
});
