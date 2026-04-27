// supabase/functions/account-convert/__tests__/core.test.ts
//
// Handler-level tests via injected Deps. Covers:
//   - 401 on missing/invalid JWT
//   - 409 on non-anonymous caller
//   - /email route: validation pass-through, success shape, error shapes
//   - /oauth-merge route: validation, success shape, error shapes
//   - 404 on unknown subpath, 405 on non-POST

import { describe, it, expect, vi } from "vitest";

import { handleRequest, type AnonUserContext, type Deps } from "../core";

const URL_BASE = "https://x.functions.supabase.co/account-convert";

function makeDeps(overrides: Partial<Deps> = {}): Deps {
  const ctx: AnonUserContext = {
    userId: "anon-1",
    isAnonymous: true,
    sessionAgeSeconds: 1800,
  };
  return {
    resolveAnonContext: vi.fn().mockResolvedValue(ctx),
    admin: {
      getUserById: vi.fn().mockResolvedValue({
        data: { user: { id: "anon-1", is_anonymous: true } },
        error: null,
      }),
      updateUserById: vi.fn().mockResolvedValue({
        data: { user: { id: "anon-1" } },
        error: null,
      }),
    },
    rpc: {
      mergeAnonIntoPermanent: vi.fn().mockResolvedValue({
        data: { rows_migrated_total: 5 },
        error: null,
      }),
    },
    telemetry: {
      recordConversion: vi.fn().mockResolvedValue(undefined),
    },
    ...overrides,
  };
}

function emailReq(body: unknown): Request {
  return new Request(`${URL_BASE}/email`, {
    method: "POST",
    headers: { Authorization: "Bearer x" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function oauthMergeReq(body: unknown): Request {
  return new Request(`${URL_BASE}/oauth-merge`, {
    method: "POST",
    headers: { Authorization: "Bearer x" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

// ── auth ─────────────────────────────────────────────────────────────

describe("handleRequest — auth", () => {
  it("401 on missing JWT (resolveAnonContext returns null)", async () => {
    const deps = makeDeps({ resolveAnonContext: vi.fn().mockResolvedValue(null) });
    const res = await handleRequest(emailReq({}), deps);
    expect(res.status).toBe(401);
  });

  it("409 when caller is NOT anonymous", async () => {
    const deps = makeDeps({
      resolveAnonContext: vi.fn().mockResolvedValue({
        userId: "perm-1",
        isAnonymous: false,
        sessionAgeSeconds: 0,
      }),
    });
    const res = await handleRequest(emailReq({ email: "a@b.com", password: "valid-pw1" }), deps);
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error_code).toBe("not_anonymous");
    expect(body.message_vi).toContain("không phải tài khoản ẩn danh");
  });

  it("OPTIONS preflight returns 200 with CORS", async () => {
    const res = await handleRequest(
      new Request(`${URL_BASE}/email`, { method: "OPTIONS" }),
      makeDeps(),
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("GET / non-POST returns 405", async () => {
    const res = await handleRequest(
      new Request(`${URL_BASE}/email`, { method: "GET", headers: { Authorization: "Bearer x" } }),
      makeDeps(),
    );
    expect(res.status).toBe(405);
  });
});

// ── /email ───────────────────────────────────────────────────────────

describe("handleRequest — /email happy path", () => {
  it("returns ok=true with the same user_id (FK preservation)", async () => {
    const deps = makeDeps();
    const res = await handleRequest(
      emailReq({ email: "user@example.com", password: "valid-pw1" }),
      deps,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.user_id).toBe("anon-1");
    expect(body.status).toBe("success");
    expect(deps.admin.updateUserById).toHaveBeenCalledWith("anon-1", {
      email: "user@example.com",
      password: "valid-pw1",
    });
  });
});

describe("handleRequest — /email validation", () => {
  it("returns 400 on malformed JSON", async () => {
    const res = await handleRequest(emailReq("{not json"), makeDeps());
    expect(res.status).toBe(400);
  });

  it("returns ok=false email_invalid for bad email", async () => {
    const deps = makeDeps();
    const res = await handleRequest(
      emailReq({ email: "not-an-email", password: "valid-pw1" }),
      deps,
    );
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error_code).toBe("email_invalid");
    expect(body.message_vi).toContain("Email không hợp lệ");
    expect(deps.admin.updateUserById).not.toHaveBeenCalled();
  });

  it("returns ok=false password_invalid for weak password", async () => {
    const deps = makeDeps();
    const res = await handleRequest(
      emailReq({ email: "user@example.com", password: "abc" }),
      deps,
    );
    const body = await res.json();
    expect(body.error_code).toBe("password_invalid");
    expect(body.message_vi).toContain("ít nhất 8 ký tự");
  });

  it("returns ok=false email_in_use when admin says email exists", async () => {
    const deps = makeDeps({
      admin: {
        getUserById: vi.fn().mockResolvedValue({
          data: { user: { id: "anon-1", is_anonymous: true } },
          error: null,
        }),
        updateUserById: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: "User already registered", code: "email_exists" },
        }),
      },
    });
    const res = await handleRequest(
      emailReq({ email: "taken@example.com", password: "valid-pw1" }),
      deps,
    );
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.status).toBe("failed_email_in_use");
    expect(body.error_code).toBe("email_in_use");
    expect(body.message_vi).toContain("đã được dùng");
    expect(body.message_en).toContain("already in use");
  });
});

// ── /oauth-merge ─────────────────────────────────────────────────────

describe("handleRequest — /oauth-merge happy path", () => {
  it("returns ok=true with rows_migrated_total from RPC", async () => {
    const deps = makeDeps();
    const res = await handleRequest(
      oauthMergeReq({ permanentUserId: "perm-1", source: "google" }),
      deps,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.user_id).toBe("perm-1");
    expect(body.rows_migrated_total).toBe(5);
    expect(deps.rpc.mergeAnonIntoPermanent).toHaveBeenCalledWith("anon-1", "perm-1");
  });
});

describe("handleRequest — /oauth-merge validation", () => {
  it("400 when permanentUserId is missing", async () => {
    const res = await handleRequest(oauthMergeReq({ source: "google" }), makeDeps());
    expect(res.status).toBe(400);
  });

  it("400 on malformed JSON", async () => {
    const res = await handleRequest(oauthMergeReq("{not json"), makeDeps());
    expect(res.status).toBe(400);
  });

  it("ok=false same_id when permanent matches anon", async () => {
    const deps = makeDeps();
    const res = await handleRequest(
      oauthMergeReq({ permanentUserId: "anon-1", source: "google" }),
      deps,
    );
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error_code).toBe("same_id");
    expect(deps.rpc.mergeAnonIntoPermanent).not.toHaveBeenCalled();
  });

  it("ok=false anon_required when SQL says source isn't anonymous", async () => {
    const deps = makeDeps({
      rpc: {
        mergeAnonIntoPermanent: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "merge_anon: source user xx is not anonymous" },
        }),
      },
    });
    const res = await handleRequest(
      oauthMergeReq({ permanentUserId: "perm-1", source: "google" }),
      deps,
    );
    const body = await res.json();
    expect(body.error_code).toBe("anon_required");
  });

  it("normalises unknown source values to 'other'", async () => {
    const deps = makeDeps();
    const res = await handleRequest(
      oauthMergeReq({ permanentUserId: "perm-1", source: "bogus" }),
      deps,
    );
    expect(res.status).toBe(200);
    // Telemetry should be invoked with source = 'other'.
    const recordCalls = (deps.telemetry.recordConversion as ReturnType<typeof vi.fn>).mock.calls;
    expect(recordCalls[0][0].source).toBe("other");
  });
});

// ── unknown path ─────────────────────────────────────────────────────

describe("handleRequest — unknown path", () => {
  it("returns 404 for paths that aren't /email or /oauth-merge", async () => {
    const res = await handleRequest(
      new Request(`${URL_BASE}/something-else`, {
        method: "POST",
        headers: { Authorization: "Bearer x" },
      }),
      makeDeps(),
    );
    expect(res.status).toBe(404);
  });
});
