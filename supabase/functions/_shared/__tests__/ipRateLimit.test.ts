// supabase/functions/_shared/__tests__/ipRateLimit.test.ts
//
// Locks the per-IP rate-limit helper:
//   - extractClientIp header preference order
//   - hashIp determinism + privacy contract (never logs raw IP)
//   - IP_RATE_LIMITS constants match the brief
//   - buildRateLimitErrorBody bilingual + retry-after wiring
//   - checkIpRateLimit allows on admin bypass, no IP, RPC error
//     (fail-open), and on under-cap responses; rejects when minute or
//     hour window trips.
//
// DB stubbing: tests pass a fake `RateLimitSupabase` that just records
// every RPC call and returns whatever the test sets.

import { describe, it, expect, vi } from "vitest";

import {
  IP_RATE_LIMITS,
  buildRateLimitErrorBody,
  checkIpRateLimit,
  extractClientIp,
  hashIp,
  type RateLimitSupabase,
} from "../ipRateLimit";

function reqWith(headers: Record<string, string>): Request {
  return new Request("https://example.com/", { headers });
}

describe("extractClientIp", () => {
  it("prefers cf-connecting-ip when present", () => {
    const req = reqWith({
      "cf-connecting-ip": "203.0.113.7",
      "x-forwarded-for": "10.0.0.1",
      "x-real-ip": "192.168.1.1",
    });
    expect(extractClientIp(req)).toBe("203.0.113.7");
  });

  it("falls back to first hop of x-forwarded-for", () => {
    const req = reqWith({
      "x-forwarded-for": "203.0.113.7, 10.0.0.1, 172.16.0.1",
    });
    expect(extractClientIp(req)).toBe("203.0.113.7");
  });

  it("falls back to x-real-ip when xff missing", () => {
    const req = reqWith({ "x-real-ip": "192.0.2.5" });
    expect(extractClientIp(req)).toBe("192.0.2.5");
  });

  it("returns null when no header carries an IP", () => {
    expect(extractClientIp(reqWith({}))).toBeNull();
  });

  it("rejects literal 'unknown' values", () => {
    expect(extractClientIp(reqWith({ "x-real-ip": "unknown" }))).toBeNull();
    expect(
      extractClientIp(reqWith({ "x-forwarded-for": "unknown" })),
    ).toBeNull();
  });

  it("trims whitespace from header values", () => {
    expect(
      extractClientIp(reqWith({ "x-forwarded-for": "  203.0.113.9  ," })),
    ).toBe("203.0.113.9");
  });
});

describe("hashIp", () => {
  it("returns a 64-char lowercase hex SHA-256", async () => {
    const h = await hashIp("203.0.113.7");
    expect(h).toMatch(/^[0-9a-f]{64}$/);
  });

  it("is deterministic across calls", async () => {
    const a = await hashIp("203.0.113.7");
    const b = await hashIp("203.0.113.7");
    expect(a).toBe(b);
  });

  it("produces different hashes for different IPs", async () => {
    const a = await hashIp("203.0.113.7");
    const b = await hashIp("203.0.113.8");
    expect(a).not.toBe(b);
  });

  it("never includes the raw IP substring in the hash", async () => {
    const ip = "203.0.113.7";
    const h = await hashIp(ip);
    expect(h.includes(ip)).toBe(false);
  });
});

describe("IP_RATE_LIMITS catalog", () => {
  it("matches the brief — azure-phoneme: 100/hr, 20/min", () => {
    expect(IP_RATE_LIMITS["azure-phoneme"]).toEqual({
      surface: "azure-phoneme",
      maxPerMinute: 20,
      maxPerHour: 100,
    });
  });

  it("matches the brief — ai-chat: 50/hr, 10/min", () => {
    expect(IP_RATE_LIMITS["ai-chat"]).toEqual({
      surface: "ai-chat",
      maxPerMinute: 10,
      maxPerHour: 50,
    });
  });
});

describe("buildRateLimitErrorBody", () => {
  it("interpolates retry seconds into both VI and EN messages", () => {
    const body = buildRateLimitErrorBody(45);
    expect(body.error_code).toBe("IP_RATE_LIMIT_EXCEEDED");
    expect(body.error_message_vi).toContain("45 giây");
    expect(body.error_message_en).toContain("45 seconds");
    expect(body.retry_after_seconds).toBe(45);
    expect(body.ok).toBe(false);
  });
});

// ── checkIpRateLimit DB-touching path ───────────────────────────────────

function makeSupabase(
  resultsByBucket: Record<string, { allowed: boolean; retry_after_seconds?: number } | "error">,
): { client: RateLimitSupabase; calls: Array<Record<string, unknown>> } {
  const calls: Array<Record<string, unknown>> = [];
  return {
    calls,
    client: {
      rpc: vi.fn(async (_fn, args) => {
        calls.push(args);
        const bucket = String(args["p_bucket"] ?? "");
        const r = resultsByBucket[bucket];
        if (r === "error") {
          return { data: null, error: { message: "rpc failed" } };
        }
        if (!r) {
          return { data: [{ allowed: true, count: 1, retry_after_seconds: 60 }], error: null };
        }
        return {
          data: [
            { allowed: r.allowed, count: 1, retry_after_seconds: r.retry_after_seconds ?? 60 },
          ],
          error: null,
        };
      }),
    },
  };
}

describe("checkIpRateLimit", () => {
  const reqWithIp = () =>
    reqWith({ "cf-connecting-ip": "203.0.113.7" });

  it("admin bypass short-circuits with no RPC calls", async () => {
    const sb = makeSupabase({});
    const result = await checkIpRateLimit(reqWithIp(), {
      supabase: sb.client,
      surface: "azure-phoneme",
      isAdminBypass: true,
    });
    expect(result.allowed).toBe(true);
    expect(result.bypassReason).toBe("admin");
    expect(sb.calls.length).toBe(0);
  });

  it("fails open (allowed) when no IP can be extracted", async () => {
    const sb = makeSupabase({});
    const result = await checkIpRateLimit(reqWith({}), {
      supabase: sb.client,
      surface: "azure-phoneme",
    });
    expect(result.allowed).toBe(true);
    expect(result.bypassReason).toBe("no_ip");
    expect(sb.calls.length).toBe(0);
  });

  it("fails open (allowed) when surface config is missing", async () => {
    const sb = makeSupabase({});
    const result = await checkIpRateLimit(reqWithIp(), {
      supabase: sb.client,
      surface: "not-a-known-surface",
    });
    expect(result.allowed).toBe(true);
    expect(result.bypassReason).toBe("config_missing");
  });

  it("fails open when the RPC errors (never blocks legitimate traffic)", async () => {
    const sb = makeSupabase({ "azure-phoneme:minute": "error" });
    const result = await checkIpRateLimit(reqWithIp(), {
      supabase: sb.client,
      surface: "azure-phoneme",
    });
    expect(result.allowed).toBe(true);
    expect(result.bypassReason).toBe("rpc_error");
  });

  it("allows when both windows are under cap", async () => {
    const sb = makeSupabase({
      "azure-phoneme:minute": { allowed: true, retry_after_seconds: 60 },
      "azure-phoneme:hour":   { allowed: true, retry_after_seconds: 3600 },
    });
    const result = await checkIpRateLimit(reqWithIp(), {
      supabase: sb.client,
      surface: "azure-phoneme",
    });
    expect(result.allowed).toBe(true);
    // Two RPC calls — minute then hour.
    expect(sb.calls.length).toBe(2);
    expect(sb.calls[0]?.p_bucket).toBe("azure-phoneme:minute");
    expect(sb.calls[1]?.p_bucket).toBe("azure-phoneme:hour");
  });

  it("rejects when the per-minute window trips, never calling the hour RPC", async () => {
    const sb = makeSupabase({
      "azure-phoneme:minute": { allowed: false, retry_after_seconds: 30 },
    });
    const result = await checkIpRateLimit(reqWithIp(), {
      supabase: sb.client,
      surface: "azure-phoneme",
    });
    expect(result.allowed).toBe(false);
    expect(result.exceededWindow).toBe("minute");
    expect(result.retryAfterSeconds).toBe(30);
    expect(sb.calls.length).toBe(1);
  });

  it("rejects when the per-hour window trips after passing minute", async () => {
    const sb = makeSupabase({
      "azure-phoneme:minute": { allowed: true,  retry_after_seconds: 60 },
      "azure-phoneme:hour":   { allowed: false, retry_after_seconds: 1800 },
    });
    const result = await checkIpRateLimit(reqWithIp(), {
      supabase: sb.client,
      surface: "azure-phoneme",
    });
    expect(result.allowed).toBe(false);
    expect(result.exceededWindow).toBe("hour");
    expect(result.retryAfterSeconds).toBe(1800);
  });

  it("hashes the IP and passes the hex digest as p_ip_hash", async () => {
    const sb = makeSupabase({});
    await checkIpRateLimit(reqWithIp(), {
      supabase: sb.client,
      surface: "azure-phoneme",
    });
    const ipHash = sb.calls[0]?.p_ip_hash;
    expect(typeof ipHash).toBe("string");
    expect(ipHash).toMatch(/^[0-9a-f]{64}$/);
    // Must not contain the raw IP — privacy contract.
    expect(String(ipHash)).not.toContain("203.0.113.7");
  });
});
