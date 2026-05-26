// supabase/functions/_shared/__tests__/accountConversionOAuth.test.ts
//
// Locks the OAuth merge path:
//   - empty / same-id pre-flight rejection (no RPC call)
//   - RPC error → maps to a stable status code
//   - RPC success → returns rows_migrated_total
//   - telemetry row written for every outcome

import { describe, it, expect, vi } from "vitest";

import {
  type MergeRpcSurface,
  mapMergeRpcError,
  mergeAnonIntoPermanent,
} from "../accountConversionOAuth";
import type { TelemetryWriter } from "../accountConversion";

function makeRpc(overrides: Partial<MergeRpcSurface> = {}): MergeRpcSurface {
  return {
    mergeAnonIntoPermanent: vi.fn().mockResolvedValue({
      data: { rows_migrated_total: 7 },
      error: null,
    }),
    ...overrides,
  };
}

function makeTelemetry(): TelemetryWriter & { calls: Array<Record<string, unknown>> } {
  const calls: Array<Record<string, unknown>> = [];
  return {
    calls,
    recordConversion: async (input) => {
      calls.push({ ...input });
    },
  };
}

// ── mapMergeRpcError ─────────────────────────────────────────────────

describe("mapMergeRpcError", () => {
  it("recognises the not-anonymous SQL exception", () => {
    expect(mapMergeRpcError("merge_anon: source user xx is not anonymous")).toBe("failed_anon_required");
  });

  it("recognises the same-id SQL exception", () => {
    expect(mapMergeRpcError("merge_anon: anon and permanent ids cannot match")).toBe("failed_same_id");
  });

  it("falls through to failed_other for other messages", () => {
    expect(mapMergeRpcError("connection refused")).toBe("failed_other");
    expect(mapMergeRpcError("")).toBe("failed_other");
  });
});

// ── pre-flight rejections ────────────────────────────────────────────

describe("mergeAnonIntoPermanent — pre-flight rejections", () => {
  it("rejects empty anon id without calling the RPC", async () => {
    const rpc = makeRpc();
    const tel = makeTelemetry();
    const result = await mergeAnonIntoPermanent(
      { anonUserId: "", permanentUserId: "perm-1", source: "google" },
      rpc,
      tel,
    );
    expect(result.ok).toBe(false);
    expect(rpc.mergeAnonIntoPermanent).not.toHaveBeenCalled();
    expect(tel.calls[0].errorCode).toBe("missing_id");
  });

  it("rejects empty permanent id", async () => {
    const rpc = makeRpc();
    const tel = makeTelemetry();
    const result = await mergeAnonIntoPermanent(
      { anonUserId: "anon-1", permanentUserId: "", source: "google" },
      rpc,
      tel,
    );
    expect(result.ok).toBe(false);
    expect(rpc.mergeAnonIntoPermanent).not.toHaveBeenCalled();
  });

  it("rejects identical ids without calling the RPC", async () => {
    const rpc = makeRpc();
    const tel = makeTelemetry();
    const result = await mergeAnonIntoPermanent(
      { anonUserId: "same-id", permanentUserId: "same-id", source: "google" },
      rpc,
      tel,
    );
    expect(result.ok).toBe(false);
    expect(result.status).toBe("failed_same_id");
    expect(result.error_code).toBe("same_id");
    expect(rpc.mergeAnonIntoPermanent).not.toHaveBeenCalled();
    expect(tel.calls[0].errorCode).toBe("same_id");
  });
});

// ── RPC interaction ──────────────────────────────────────────────────

describe("mergeAnonIntoPermanent — RPC interaction", () => {
  it("invokes the RPC with both ids", async () => {
    const rpc = makeRpc();
    const tel = makeTelemetry();
    await mergeAnonIntoPermanent(
      { anonUserId: "anon-1", permanentUserId: "perm-1", source: "apple" },
      rpc,
      tel,
    );
    expect(rpc.mergeAnonIntoPermanent).toHaveBeenCalledWith("anon-1", "perm-1");
  });

  it("returns the success result with rows_migrated_total from RPC", async () => {
    const rpc = makeRpc({
      mergeAnonIntoPermanent: vi.fn().mockResolvedValue({
        data: { rows_migrated_total: 42 },
        error: null,
      }),
    });
    const tel = makeTelemetry();
    const result = await mergeAnonIntoPermanent(
      { anonUserId: "anon-1", permanentUserId: "perm-1", source: "google" },
      rpc,
      tel,
    );
    expect(result.ok).toBe(true);
    expect(result.status).toBe("success");
    expect(result.rows_migrated_total).toBe(42);
    expect(tel.calls[0]).toMatchObject({
      status: "success",
      source: "google",
    });
  });

  it("maps not-anonymous RPC error to anon_required", async () => {
    const rpc = makeRpc({
      mergeAnonIntoPermanent: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "merge_anon: source user xx is not anonymous" },
      }),
    });
    const tel = makeTelemetry();
    const result = await mergeAnonIntoPermanent(
      { anonUserId: "anon-1", permanentUserId: "perm-1", source: "google" },
      rpc,
      tel,
    );
    expect(result.ok).toBe(false);
    expect(result.status).toBe("failed_anon_required");
    expect(result.error_code).toBe("anon_required");
  });

  it("maps unknown RPC error to rpc_error", async () => {
    const rpc = makeRpc({
      mergeAnonIntoPermanent: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "something blew up" },
      }),
    });
    const tel = makeTelemetry();
    const result = await mergeAnonIntoPermanent(
      { anonUserId: "anon-1", permanentUserId: "perm-1", source: "apple" },
      rpc,
      tel,
    );
    expect(result.ok).toBe(false);
    expect(result.error_code).toBe("rpc_error");
    expect(tel.calls[0].errorCode).toBe("rpc_error");
  });

  it("returns rows_migrated_total = 0 when RPC returns null data", async () => {
    const rpc = makeRpc({
      mergeAnonIntoPermanent: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    });
    const tel = makeTelemetry();
    const result = await mergeAnonIntoPermanent(
      { anonUserId: "anon-1", permanentUserId: "perm-1", source: "google" },
      rpc,
      tel,
    );
    expect(result.ok).toBe(true);
    expect(result.rows_migrated_total).toBe(0);
  });
});
