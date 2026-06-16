import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";

vi.mock("@/lib/monitoring/captureException", () => ({
  captureMessage: vi.fn(),
}));

import { captureMessage } from "@/lib/monitoring/captureException";

// import.meta.env.MODE === "test" inside vitest → isInstrumentationEnabled
// would return false. The module-under-test exposes that gate as an
// exported helper; for these tests we always force it ON via the env
// var (Vite exposes import.meta.env at build time, but we can also stub
// at runtime via `vi.stubEnv`).
vi.stubEnv("VITE_SUPABASE_QUERY_INSTRUMENTATION_ENABLED", "true");

import {
  instrumentSupabase,
  isInstrumentationEnabled,
  SLOW_QUERY_MS,
  VERY_SLOW_QUERY_MS,
} from "../instrumentSupabase";

const captureMessageMock = vi.mocked(captureMessage);

/**
 * Build a minimal fake Supabase client whose `.from(table)` returns a
 * thenable-with-filter-methods. Awaiting the chain resolves after
 * `latencyMs`. Captures arg values so the test can prove they DON'T
 * leak into Sentry.
 */
function makeFakeClient(latencyMs: number, opts?: {
  rejectWith?: unknown;
  capturedArgs?: unknown[];
}): SupabaseClient {
  const capturedArgs = opts?.capturedArgs ?? [];

  function makeBuilder(): {
    select: (...a: unknown[]) => unknown;
    insert: (...a: unknown[]) => unknown;
    update: (...a: unknown[]) => unknown;
    delete: (...a: unknown[]) => unknown;
    upsert: (...a: unknown[]) => unknown;
    eq: (...a: unknown[]) => unknown;
    match: (...a: unknown[]) => unknown;
    order: (...a: unknown[]) => unknown;
    limit: (...a: unknown[]) => unknown;
    then: <R>(onF?: (v: unknown) => R, onR?: (e: unknown) => R) => Promise<R>;
  } {
    const builder = {
      select: (...args: unknown[]) => {
        capturedArgs.push(...args);
        return builder;
      },
      insert: (...args: unknown[]) => {
        capturedArgs.push(...args);
        return builder;
      },
      update: (...args: unknown[]) => {
        capturedArgs.push(...args);
        return builder;
      },
      delete: (...args: unknown[]) => {
        capturedArgs.push(...args);
        return builder;
      },
      upsert: (...args: unknown[]) => {
        capturedArgs.push(...args);
        return builder;
      },
      eq: (...args: unknown[]) => {
        capturedArgs.push(...args);
        return builder;
      },
      match: (...args: unknown[]) => {
        capturedArgs.push(...args);
        return builder;
      },
      order: (...args: unknown[]) => {
        capturedArgs.push(...args);
        return builder;
      },
      limit: (...args: unknown[]) => {
        capturedArgs.push(...args);
        return builder;
      },
      then: <R,>(
        onFulfilled?: (v: unknown) => R,
        onRejected?: (e: unknown) => R,
      ) =>
        new Promise<R>((resolve, reject) => {
          setTimeout(() => {
            if (opts?.rejectWith !== undefined) {
              const r = opts.rejectWith;
              try {
                if (onRejected) {
                  resolve(onRejected(r));
                } else {
                  reject(r);
                }
              } catch (e) {
                reject(e);
              }
              return;
            }
            const value = { data: [], error: null };
            try {
              resolve(onFulfilled ? onFulfilled(value) : (value as unknown as R));
            } catch (e) {
              reject(e);
            }
          }, latencyMs);
        }),
    };
    return builder;
  }

  const fake = {
    from: (_table: string) => makeBuilder(),
    rpc: (_fn: string, _args?: unknown) => makeBuilder(),
  };
  return fake as unknown as SupabaseClient;
}

/** Drive performance.now() so duration is deterministic. */
function stubPerfNow(times: number[]): () => void {
  let i = 0;
  const orig = performance.now.bind(performance);
  const spy = vi.spyOn(performance, "now").mockImplementation(() => {
    const v = times[i] ?? times[times.length - 1] ?? 0;
    i = Math.min(i + 1, times.length - 1);
    return v;
  });
  return () => {
    spy.mockRestore();
    void orig;
  };
}

describe("instrumentSupabase", () => {
  beforeEach(() => {
    captureMessageMock.mockClear();
    vi.stubEnv("VITE_SUPABASE_QUERY_INSTRUMENTATION_ENABLED", "true");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("emits a slow-query warning when duration crosses SLOW_QUERY_MS (2000)", async () => {
    const restore = stubPerfNow([0, SLOW_QUERY_MS + 1]);
    const client = instrumentSupabase(makeFakeClient(1));

    await client.from("users").select("*");

    restore();
    expect(captureMessageMock).toHaveBeenCalledTimes(1);
    expect(captureMessageMock).toHaveBeenCalledWith(
      "slow-query",
      "warning",
      expect.objectContaining({
        table: "users",
        operation: "select",
        duration_ms: SLOW_QUERY_MS + 1,
      }),
    );
  });

  it("emits a very-slow-query error when duration crosses VERY_SLOW_QUERY_MS (5000)", async () => {
    const restore = stubPerfNow([0, VERY_SLOW_QUERY_MS + 42]);
    const client = instrumentSupabase(makeFakeClient(1));

    await client.from("audit_logs").insert({ id: "x" });

    restore();
    expect(captureMessageMock).toHaveBeenCalledTimes(1);
    expect(captureMessageMock).toHaveBeenCalledWith(
      "very-slow-query",
      "error",
      expect.objectContaining({
        table: "audit_logs",
        operation: "insert",
        duration_ms: VERY_SLOW_QUERY_MS + 42,
      }),
    );
  });

  it("does NOT emit for fast queries below the slow threshold", async () => {
    const restore = stubPerfNow([0, SLOW_QUERY_MS - 1]);
    const client = instrumentSupabase(makeFakeClient(1));

    await client.from("rooms").select("*");

    restore();
    expect(captureMessageMock).not.toHaveBeenCalled();
  });

  it("captures table + operation but NEVER the filter arg values (PII safety)", async () => {
    const restore = stubPerfNow([0, SLOW_QUERY_MS + 100]);
    const capturedArgs: unknown[] = [];
    const client = instrumentSupabase(makeFakeClient(1, { capturedArgs }));

    // These args contain pretend-PII that must NOT leak to Sentry.
    const userId = "user-id-deadbeef-1234";
    const email = "victim@example.com";
    await client
      .from("profiles")
      .select("id, name")
      .eq("id", userId)
      .match({ email })
      .order("created_at");

    restore();
    // The fake builder DID receive the arg values (proves the chain ran):
    expect(capturedArgs).toContain(userId);
    expect(capturedArgs).toContain("id, name");
    expect(capturedArgs.some((a) => a && typeof a === "object" && (a as { email?: string }).email === email)).toBe(true);

    // But the Sentry payload contains ONLY table/op/duration — no arg leakage.
    expect(captureMessageMock).toHaveBeenCalledTimes(1);
    const [, , payload] = captureMessageMock.mock.calls[0];
    expect(payload).toEqual({
      table: "profiles",
      operation: "select",
      duration_ms: SLOW_QUERY_MS + 100,
    });
    // Defence-in-depth: serialised payload contains no PII tokens.
    const serialized = JSON.stringify(payload);
    expect(serialized).not.toContain(userId);
    expect(serialized).not.toContain(email);
  });

  it("instruments .rpc() calls with rpc:<fn> as the operation", async () => {
    const restore = stubPerfNow([0, SLOW_QUERY_MS + 5]);
    const client = instrumentSupabase(makeFakeClient(1));

    await client.rpc("recompute_entitlement_tx", { user_id: "x" });

    restore();
    expect(captureMessageMock).toHaveBeenCalledWith(
      "slow-query",
      "warning",
      expect.objectContaining({
        table: "unknown",
        operation: "rpc:recompute_entitlement_tx",
      }),
    );
  });

  it("does nothing when the feature flag is off", async () => {
    vi.stubEnv("VITE_SUPABASE_QUERY_INSTRUMENTATION_ENABLED", "false");
    expect(isInstrumentationEnabled()).toBe(false);

    const restore = stubPerfNow([0, VERY_SLOW_QUERY_MS + 1000]);
    const fake = makeFakeClient(1);
    const originalFrom = fake.from;
    const result = instrumentSupabase(fake);

    expect(result).toBe(fake);
    // .from is the original function (no instrumentation wrap).
    expect(fake.from).toBe(originalFrom);

    await result.from("anything").select("*");
    restore();
    expect(captureMessageMock).not.toHaveBeenCalled();
  });

  it("records the correct operation even with intermediate filter methods after the terminal verb", async () => {
    const restore = stubPerfNow([0, SLOW_QUERY_MS + 50]);
    const client = instrumentSupabase(makeFakeClient(1));

    // .update sets operation, then .eq().match() chain hops, then await.
    await client
      .from("subscriptions")
      .update({ status: "active" })
      .eq("user_id", "u")
      .match({ tier: 1 });

    restore();
    expect(captureMessageMock).toHaveBeenCalledWith(
      "slow-query",
      "warning",
      expect.objectContaining({
        table: "subscriptions",
        operation: "update",
      }),
    );
  });

  it("still reports timing when the query rejects (not just on success)", async () => {
    const restore = stubPerfNow([0, SLOW_QUERY_MS + 200]);
    const client = instrumentSupabase(
      makeFakeClient(1, { rejectWith: new Error("boom") }),
    );

    await expect(client.from("users").select("*")).rejects.toThrow("boom");

    restore();
    expect(captureMessageMock).toHaveBeenCalledTimes(1);
    expect(captureMessageMock).toHaveBeenCalledWith(
      "slow-query",
      "warning",
      expect.objectContaining({ table: "users", operation: "select" }),
    );
  });
});
