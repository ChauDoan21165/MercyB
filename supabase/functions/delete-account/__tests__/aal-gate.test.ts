// supabase/functions/delete-account/__tests__/aal-gate.test.ts
//
// Guards the issue #233 fix: an aal=1 session must NOT be able to
// trigger irreversible account deletion when the user has a verified
// second factor (the service-role path bypasses the RLS gate, so this
// is the only place the check holds). Pure logic — no Deno, no network.

import { describe, expect, it } from "vitest";

import { evaluateDeleteAccountAal, readAalFromJwt } from "../aal-gate";

/** Build a structurally valid JWT (header.payload.sig) carrying the
 * given claims. Signature is irrelevant — the token has already passed
 * auth.getUser() before readAalFromJwt sees it. */
function jwt(claims: Record<string, unknown>): string {
  const b64 = (o: unknown) =>
    Buffer.from(JSON.stringify(o)).toString("base64url");
  return `${b64({ alg: "HS256", typ: "JWT" })}.${b64(claims)}.sig`;
}

describe("readAalFromJwt", () => {
  it("reads aal2 from a fully-elevated session token", () => {
    expect(readAalFromJwt(jwt({ aal: "aal2", sub: "u1" }))).toBe("aal2");
  });

  it("reads aal1 from a password-only session token", () => {
    expect(readAalFromJwt(jwt({ aal: "aal1", sub: "u1" }))).toBe("aal1");
  });

  it("treats a token with no aal claim as aal1 (not elevated)", () => {
    expect(readAalFromJwt(jwt({ sub: "u1" }))).toBe("aal1");
  });

  it("returns null for a structurally invalid token", () => {
    expect(readAalFromJwt("not-a-jwt")).toBeNull();
    expect(readAalFromJwt("")).toBeNull();
    expect(readAalFromJwt("a.b")).toBeNull();
  });
});

describe("evaluateDeleteAccountAal", () => {
  it("BLOCKS the #233 gap: aal1 + verified factor → 403 aal2_required", () => {
    const denial = evaluateDeleteAccountAal({
      aal: "aal1",
      hasVerifiedFactor: true,
      factorLookupFailed: false,
    });
    expect(denial).not.toBeNull();
    expect(denial?.status).toBe(403);
    expect(denial?.payload.error).toBe("aal2_required");
    // Vietnamese-first (non-negotiable #1).
    expect(denial?.payload.message).toMatch(/2FA/);
    expect(denial?.payload.message).toContain("không thể hoàn tác");
  });

  it("BLOCKS when aal cannot be parsed but a verified factor exists", () => {
    const denial = evaluateDeleteAccountAal({
      aal: null,
      hasVerifiedFactor: true,
      factorLookupFailed: false,
    });
    expect(denial?.status).toBe(403);
    expect(denial?.payload.error).toBe("aal2_required");
  });

  it("fails CLOSED when the factor lookup itself failed", () => {
    const denial = evaluateDeleteAccountAal({
      aal: "aal1",
      hasVerifiedFactor: false,
      factorLookupFailed: true,
    });
    expect(denial?.status).toBe(503);
    expect(denial?.payload.error).toBe("aal_check_unavailable");
  });

  it("ALLOWS a fully-elevated aal2 session (factor present)", () => {
    expect(
      evaluateDeleteAccountAal({
        aal: "aal2",
        hasVerifiedFactor: true,
        factorLookupFailed: false,
      }),
    ).toBeNull();
  });

  it("ALLOWS a no-MFA user at aal1 (no path to aal2 — must stay deletable)", () => {
    expect(
      evaluateDeleteAccountAal({
        aal: "aal1",
        hasVerifiedFactor: false,
        factorLookupFailed: false,
      }),
    ).toBeNull();
  });

  it("ALLOWS aal2 even if the factor lookup is clean and empty", () => {
    expect(
      evaluateDeleteAccountAal({
        aal: "aal2",
        hasVerifiedFactor: false,
        factorLookupFailed: false,
      }),
    ).toBeNull();
  });
});
