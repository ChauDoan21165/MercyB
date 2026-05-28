// Regression test for the /admin Security Health anon-bearer 401
// behavior. The fix shipped pre-b53bac466 (see
// supabase/functions/admin-security-health/index.ts lines 40–63 and
// src/pages/admin/adminSecurityHealthAuth.ts) but no test guarded the
// contract — it could silently regress if someone:
//
//   1. Changed `getAdminSecurityHealthAuthHeaders` to fall back to the
//      anon key when no session exists, or
//   2. Removed the `missing_session` short-circuit and let the call
//      proceed with an empty / anon bearer (which the edge function
//      correctly 401s, but the silent failure would only surface as a
//      red console — not a test failure).
//
// This file documents the contract end-to-end:
//
//   - Anonymous (no session) → helper refuses to build headers → a
//     would-be request to `/functions/v1/admin-security-health` would
//     be rejected with 401 by the edge function's auth gate (we
//     model the server gate as an in-test oracle so the assertion
//     stays self-contained).
//   - Authenticated (valid admin session) → helper builds
//     `Authorization: Bearer <user-jwt>` (NOT `Bearer <anonKey>`),
//     `apikey: <anonKey>` — and the same in-test oracle accepts.
//
// "Test only" per the dispatch — no source files touched. The oracle
// is a fixture inside this test file; it mirrors the relevant lines
// of `supabase/functions/admin-security-health/index.ts` so the
// dependency is one-directional: a future edge-function change that
// loosens the gate would NOT be caught here, but a future client
// regression (the bug class this MR is locking) WOULD be caught.

import { describe, expect, it, vi } from "vitest";
import { getAdminSecurityHealthAuthHeaders } from "../adminSecurityHealthAuth";

// ── Test oracle ──────────────────────────────────────────────────────
// Mirrors `supabase/functions/admin-security-health/index.ts` lines
// 40–63 (the Authorization-bearer branch only — the x-admin-secret
// branch is irrelevant to the anon-bearer regression). If the edge
// function's gate ever changes, this oracle has to change too — but
// the regression we're locking is on the CLIENT side, so the oracle
// here is a documentation aid, not a server-side guarantee.

const ADMIN_USER_ID = "admin-user-id-fixture";
const ANON_KEY = "fixture-anon-key";

interface OracleResponse {
  status: 200 | 401;
  body: { error?: string };
}

function runAdminSecurityHealthOracle(headers: Record<string, string>): OracleResponse {
  const auth = headers["Authorization"] ?? "";
  if (!auth.startsWith("Bearer ")) {
    return { status: 401, body: { error: "Unauthorized" } };
  }
  const token = auth.slice("Bearer ".length).trim();
  // The bug we're locking: token === ANON_KEY would always 401 because
  // the anon key is not a user JWT. Even if it were accepted, it
  // wouldn't match ADMIN_USER_ID.
  if (token === ANON_KEY) {
    return { status: 401, body: { error: "Unauthorized" } };
  }
  // Real flow: look up user by JWT; only admin user passes.
  if (token === `valid-admin-jwt`) {
    return { status: 200, body: {} };
  }
  return { status: 401, body: { error: "Unauthorized" } };
}

// ── Supabase session fixtures ────────────────────────────────────────

function clientWithSession(accessToken: string | null) {
  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: accessToken ? { access_token: accessToken } : null,
        },
        error: null,
      }),
    },
  };
}

// ── Regression tests ─────────────────────────────────────────────────

describe("admin Security Health — anon-bearer 401 regression (b53bac466 fix)", () => {
  it("anonymous request: helper refuses → oracle would 401 if the call proceeded", async () => {
    // Anonymous = no Supabase session at all. The helper must refuse
    // to build headers; the consumer (AdminDashboard) reads `ok: false`
    // and skips the fetch entirely. We additionally model the oracle
    // path: even if some future refactor leaked the call through with
    // empty headers, the server would 401.
    const result = await getAdminSecurityHealthAuthHeaders(
      clientWithSession(null),
      ANON_KEY,
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("missing_session");
    }

    // Belt-and-braces: if a caller somehow ignored ok=false and sent
    // empty headers, the server would reject.
    const oracleResponse = runAdminSecurityHealthOracle({});
    expect(oracleResponse.status).toBe(401);
    expect(oracleResponse.body.error).toBe("Unauthorized");
  });

  it("regression guard: helper MUST NEVER use the anon key as the bearer value", async () => {
    // The bug class: an earlier draft fell back to `Bearer <anonKey>`
    // when no session existed. The edge function correctly 401s on
    // such a request, but the silent failure surfaced only as a red
    // console line — not a test failure. This assertion makes the
    // failure mode load-bearing.
    const result = await getAdminSecurityHealthAuthHeaders(
      clientWithSession(null),
      ANON_KEY,
    );

    if (result.ok) {
      // Compile-time-defensive: the contract says ok=false here.
      // If a future refactor flips this to ok=true, the assertion
      // below catches the regression even before the oracle runs.
      expect(result.headers["Authorization"]).not.toBe(`Bearer ${ANON_KEY}`);
    } else {
      // No headers were built — the regression cannot occur.
      expect(result).toMatchObject({ ok: false, reason: "missing_session" });
    }
  });

  it("authenticated request: helper builds Bearer <user-jwt> → oracle accepts (200)", async () => {
    const result = await getAdminSecurityHealthAuthHeaders(
      clientWithSession("valid-admin-jwt"),
      ANON_KEY,
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      // The bearer is the USER JWT, not the anon key.
      expect(result.headers["Authorization"]).toBe("Bearer valid-admin-jwt");
      expect(result.headers["Authorization"]).not.toContain(ANON_KEY);
      // The anon key flows on the `apikey` header — that's the
      // separate Supabase convention; never on Authorization.
      expect(result.headers["apikey"]).toBe(ANON_KEY);

      // Oracle: this header set is accepted.
      const oracleResponse = runAdminSecurityHealthOracle(result.headers);
      expect(oracleResponse.status).toBe(200);
    }
  });

  it("session error path: helper refuses (no fallback to anon-bearer) → oracle would 401", async () => {
    // Sibling regression: an earlier draft also leaked the anon key
    // on the `session_error` branch. The fix forbids that — when
    // session lookup errors, the helper still refuses to build
    // bearer headers. This locks both branches of the `ok: false`
    // shape against an anon-key fallback.
    const result = await getAdminSecurityHealthAuthHeaders(
      {
        auth: {
          getSession: vi.fn().mockResolvedValue({
            data: null,
            error: { message: "storage unavailable" },
          }),
        },
      },
      ANON_KEY,
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("session_error");
    }
    // Oracle: empty headers would 401.
    expect(runAdminSecurityHealthOracle({}).status).toBe(401);
  });

  it("oracle sanity: Bearer <anon-key> still 401s (documents server-side gate)", () => {
    // Pure oracle check. If a future regression in the CLIENT puts
    // the anon key into Authorization, the SERVER will 401 — this
    // documents that the defense-in-depth holds. Mirrors lines
    // 40-63 of supabase/functions/admin-security-health/index.ts.
    const oracleResponse = runAdminSecurityHealthOracle({
      Authorization: `Bearer ${ANON_KEY}`,
      apikey: ANON_KEY,
    });
    expect(oracleResponse.status).toBe(401);
    expect(oracleResponse.body.error).toBe("Unauthorized");
  });

  it("oracle sanity: a non-admin user JWT still 401s (admin-only gate)", () => {
    const oracleResponse = runAdminSecurityHealthOracle({
      Authorization: "Bearer some-other-user-jwt",
      apikey: ANON_KEY,
    });
    expect(oracleResponse.status).toBe(401);
    // ADMIN_USER_ID is referenced via the fixture; this also documents
    // the gate isn't just "any logged-in user."
    expect(ADMIN_USER_ID).toBeTruthy();
  });
});
