/**
 * Tests for Phase 2 client helpers in mfaClient.ts:
 *   - Backup codes: generate, regenerate, verify, status
 *   - Lockout coordinator: checkMfaLockout, reportTotpFailure,
 *     reportTotpSuccess
 *
 * These wrap fetch() to call the Supabase edge functions, so we mock
 * fetch + the supabaseClient.auth.getSession to provide a JWT.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      mfa: {
        listFactors: vi.fn(),
        enroll: vi.fn(),
        unenroll: vi.fn(),
        challenge: vi.fn(),
        verify: vi.fn(),
        getAuthenticatorAssuranceLevel: vi.fn(),
      },
    },
  },
}));

vi.mock("@/lib/monitoring/captureException", () => ({
  addBreadcrumb: vi.fn(),
  captureError: vi.fn(),
  setTag: vi.fn(),
}));

import { supabase } from "@/lib/supabaseClient";
import {
  checkMfaLockout,
  generateBackupCodes,
  getBackupCodeStatus,
  regenerateBackupCodes,
  reportTotpFailure,
  reportTotpSuccess,
  verifyBackupCode,
} from "../mfaClient";

const mockedSession = supabase.auth.getSession as unknown as ReturnType<typeof vi.fn>;
const fetchMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  // Default: signed in
  mockedSession.mockResolvedValue({
    data: { session: { access_token: "test-jwt" } },
    error: null,
  });
  // VITE_SUPABASE_URL stub via Vite-style import.meta.env. Tests run
  // through vitest which inlines this; we just need a non-empty value.
  vi.stubEnv("VITE_SUPABASE_URL", "https://test.supabase.co");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ─── Backup codes — generate ──────────────────────────────────────

describe("generateBackupCodes", () => {
  it("posts action='generate' to mfa-backup-codes and returns codes + generation_id", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        ok: true,
        codes: ["ABCD-1234", "EFGH-5678", "IJKL-9012", "MNOP-3456",
                "QRST-7890", "UVWX-1234", "YZAB-5678", "CDEF-9012"],
        generation_id: "gen-uuid-1",
      }),
    );
    const out = await generateBackupCodes();
    expect(out.codes).toHaveLength(8);
    expect(out.generation_id).toBe("gen-uuid-1");

    const call = fetchMock.mock.calls[0];
    expect(call[0]).toMatch(/\/mfa-backup-codes$/);
    expect(call[1].method).toBe("POST");
    expect(JSON.parse(call[1].body).action).toBe("generate");
  });

  it("includes the JWT in the Authorization header", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ codes: [], generation_id: "x" }),
    );
    await generateBackupCodes();
    const headers = fetchMock.mock.calls[0][1].headers;
    expect(headers.Authorization).toBe("Bearer test-jwt");
  });

  it("rejects with not_signed_in when no session", async () => {
    mockedSession.mockResolvedValueOnce({ data: { session: null }, error: null });
    await expect(generateBackupCodes()).rejects.toThrow("not_signed_in");
  });

  it("rejects when server returns 409 (codes already exist)", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: "backup_codes_already_exist", unused_count: 8 }, 409),
    );
    await expect(generateBackupCodes()).rejects.toThrow("backup_codes_already_exist");
  });

  it("rejects with aal2_required if server gates", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: "aal2_required" }, 403),
    );
    await expect(generateBackupCodes()).rejects.toThrow("aal2_required");
  });
});

// ─── Backup codes — regenerate ────────────────────────────────────

describe("regenerateBackupCodes", () => {
  it("posts action='regenerate' and returns fresh codes", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ codes: ["X1", "X2", "X3", "X4", "X5", "X6", "X7", "X8"], generation_id: "gen-2" }),
    );
    const out = await regenerateBackupCodes();
    expect(out.codes).toHaveLength(8);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).action).toBe("regenerate");
  });

  it("rejects with aal2_required if user hasn't entered TOTP recently", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: "aal2_required" }, 403));
    await expect(regenerateBackupCodes()).rejects.toThrow("aal2_required");
  });
});

// ─── Backup codes — verify (recovery) ─────────────────────────────

describe("verifyBackupCode", () => {
  it("posts action='verify' with the code", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ ok: true, mfa_disabled: true }),
    );
    const out = await verifyBackupCode("ABCD-1234");
    expect(out.ok).toBe(true);
    expect(out.mfa_disabled).toBe(true);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.action).toBe("verify");
    expect(body.code).toBe("ABCD-1234");
  });

  it("rejects with invalid_code on 401", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: "invalid_code", lockout_triggered: false }, 401),
    );
    await expect(verifyBackupCode("WXYZ-9999")).rejects.toThrow("invalid_code");
  });

  it("rejects with locked_out on 429", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: "locked_out", lockout_until: "2026-04-27T20:00:00Z" }, 429),
    );
    await expect(verifyBackupCode("ABCD-1234")).rejects.toThrow("locked_out");
  });

  it("rejects with invalid_format on malformed input", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: "invalid_format" }, 400),
    );
    await expect(verifyBackupCode("not-a-code")).rejects.toThrow("invalid_format");
  });
});

// ─── Backup codes — status ────────────────────────────────────────

describe("getBackupCodeStatus", () => {
  it("returns unused_count and total", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ ok: true, unused_count: 6, total: 8 }),
    );
    const out = await getBackupCodeStatus();
    expect(out.unused_count).toBe(6);
    expect(out.total).toBe(8);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).action).toBe("status");
  });

  it("rejects on 500 server error", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: "status_lookup_failed" }, 500),
    );
    await expect(getBackupCodeStatus()).rejects.toThrow("status_lookup_failed");
  });
});

// ─── Lockout coordinator — check ──────────────────────────────────

describe("checkMfaLockout", () => {
  it("returns locked_out:false and remaining when not locked", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ locked_out: false, remaining: 5 }),
    );
    const out = await checkMfaLockout();
    expect(out.locked_out).toBe(false);
    expect(out.remaining).toBe(5);
  });

  it("returns locked_out:true with lockout_until when locked", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ locked_out: true, lockout_until: "2026-04-27T20:00:00Z" }),
    );
    const out = await checkMfaLockout();
    expect(out.locked_out).toBe(true);
    expect(out.lockout_until).toBe("2026-04-27T20:00:00Z");
  });

  it("posts action='check' to the rate-limit endpoint", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ locked_out: false, remaining: 5 }));
    await checkMfaLockout();
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/mfa-challenge-rate-limit$/);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).action).toBe("check");
  });
});

// ─── Lockout coordinator — record_failure ─────────────────────────

describe("reportTotpFailure", () => {
  it("returns lockout_triggered:false and attempts when not yet locked", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ lockout_triggered: false, attempts: 2 }),
    );
    const out = await reportTotpFailure();
    expect(out.lockout_triggered).toBe(false);
    expect(out.attempts).toBe(2);
  });

  it("returns lockout_triggered:true with lockout_until on threshold cross", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        lockout_triggered: true,
        lockout_until: "2026-04-27T20:30:00Z",
        attempts: 5,
      }),
    );
    const out = await reportTotpFailure();
    expect(out.lockout_triggered).toBe(true);
    expect(out.lockout_until).toBe("2026-04-27T20:30:00Z");
    expect(out.attempts).toBe(5);
  });

  it("posts action='record_failure'", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ lockout_triggered: false, attempts: 1 }),
    );
    await reportTotpFailure();
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).action).toBe("record_failure");
  });
});

// ─── Lockout coordinator — record_success ─────────────────────────

describe("reportTotpSuccess", () => {
  it("returns ok:true on success", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));
    const out = await reportTotpSuccess();
    expect(out.ok).toBe(true);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).action).toBe("record_success");
  });

  it("rejects on server error", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: "server_error" }, 500));
    await expect(reportTotpSuccess()).rejects.toThrow("server_error");
  });
});

// ─── Cross-cutting auth and URL handling ──────────────────────────

describe("Phase 2 helpers — common preconditions", () => {
  it("all backup-code helpers throw not_signed_in when session is null", async () => {
    mockedSession.mockResolvedValue({ data: { session: null }, error: null });
    await expect(generateBackupCodes()).rejects.toThrow("not_signed_in");
    await expect(regenerateBackupCodes()).rejects.toThrow("not_signed_in");
    await expect(verifyBackupCode("X")).rejects.toThrow("not_signed_in");
    await expect(getBackupCodeStatus()).rejects.toThrow("not_signed_in");
  });

  it("all lockout helpers throw not_signed_in when session is null", async () => {
    mockedSession.mockResolvedValue({ data: { session: null }, error: null });
    await expect(checkMfaLockout()).rejects.toThrow("not_signed_in");
    await expect(reportTotpFailure()).rejects.toThrow("not_signed_in");
    await expect(reportTotpSuccess()).rejects.toThrow("not_signed_in");
  });

  it("all helpers send Content-Type: application/json", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true, codes: [], generation_id: "x", unused_count: 0, total: 8, locked_out: false, remaining: 5, lockout_triggered: false, attempts: 0, mfa_disabled: false }));
    await generateBackupCodes();
    await regenerateBackupCodes();
    await verifyBackupCode("X");
    await getBackupCodeStatus();
    await checkMfaLockout();
    await reportTotpFailure();
    await reportTotpSuccess();
    for (const call of fetchMock.mock.calls) {
      expect(call[1].headers["Content-Type"]).toBe("application/json");
    }
  });

  it("all helpers carry the JWT in the Authorization header", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true, codes: [], generation_id: "x", unused_count: 0, total: 8, locked_out: false, remaining: 5, lockout_triggered: false, attempts: 0, mfa_disabled: false }));
    await generateBackupCodes();
    await checkMfaLockout();
    await reportTotpSuccess();
    for (const call of fetchMock.mock.calls) {
      expect(call[1].headers.Authorization).toBe("Bearer test-jwt");
    }
  });

  it("preserves error.details on non-OK responses", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: "invalid_code", lockout_triggered: false, attempts: 3 }, 401),
    );
    try {
      await verifyBackupCode("X");
      throw new Error("should have rejected");
    } catch (err) {
      expect(err instanceof Error).toBe(true);
      const details = (err as Error & { details?: unknown }).details;
      expect((details as { lockout_triggered?: boolean })?.lockout_triggered).toBe(false);
      expect((details as { attempts?: number })?.attempts).toBe(3);
    }
  });

  it("falls back to http_<status> when response has no error field", async () => {
    fetchMock.mockResolvedValueOnce(new Response("not json", { status: 502 }));
    await expect(generateBackupCodes()).rejects.toThrow("http_502");
  });

  it("hits the correct edge-function URL based on VITE_SUPABASE_URL", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://different.supabase.co/");
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true, unused_count: 0, total: 8 }));
    await getBackupCodeStatus();
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://different.supabase.co/functions/v1/mfa-backup-codes",
    );
  });

  it("strips trailing slash from VITE_SUPABASE_URL", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://x.supabase.co/");
    fetchMock.mockResolvedValueOnce(jsonResponse({ locked_out: false, remaining: 5 }));
    await checkMfaLockout();
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://x.supabase.co/functions/v1/mfa-challenge-rate-limit",
    );
  });

  it("throws supabase_url_missing when VITE_SUPABASE_URL is empty", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");
    await expect(generateBackupCodes()).rejects.toThrow("supabase_url_missing");
  });

  it("propagates fetch network errors instead of swallowing them", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network down"));
    await expect(generateBackupCodes()).rejects.toThrow("network down");
  });

  it("treats non-JSON 4xx response body as an http_<status> error", async () => {
    fetchMock.mockResolvedValueOnce(new Response("plain text", { status: 403 }));
    await expect(verifyBackupCode("X")).rejects.toThrow("http_403");
  });

  it("error message never contains the JWT (no token leakage)", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: "boom" }, 500));
    try {
      await generateBackupCodes();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      expect(msg).not.toContain("test-jwt");
    }
  });

  it("error message never contains the user-submitted backup code", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: "invalid_code" }, 401));
    try {
      await verifyBackupCode("SECRET-CODE-XYZ");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      expect(msg).not.toContain("SECRET");
    }
  });

  it("does not retry on 4xx (caller decides)", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: "invalid_code" }, 401));
    try {
      await verifyBackupCode("X");
    } catch {
      /* expected */
    }
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
