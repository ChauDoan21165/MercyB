// src/lib/__tests__/authRedirect.test.ts
//
// Coverage for the auth-redirect error parser + bilingual mapper that
// power the /signin error notice. Targets the exact prod failure modes
// from the magic-link / OTP flow:
//
//   - ?error_code=otp_expired  (Supabase email-link expiry)
//   - ?error=access_denied     (provider rejection)
//   - errors arriving in the URL fragment instead of the query string
//
// Vietnamese-first copy is part of the contract — assertions check
// VI text appears before EN text in the mapper output.

import { describe, it, expect } from "vitest";
import {
  mapAuthRedirectError,
  readAuthRedirectError,
  readOAuthErrorFromSearch,
  type AuthRedirectError,
} from "@/lib/authRedirect";

describe("readAuthRedirectError", () => {
  it("returns null when no error params present", () => {
    expect(readAuthRedirectError("")).toBeNull();
    expect(readAuthRedirectError("?returnTo=/")).toBeNull();
    expect(readAuthRedirectError("", "")).toBeNull();
  });

  it("captures error, error_code, and error_description from query string", () => {
    const search =
      "?error=access_denied" +
      "&error_code=otp_expired" +
      "&error_description=Email+link+is+invalid+or+has+expired";
    const got = readAuthRedirectError(search);
    expect(got).toEqual({
      error: "access_denied",
      code: "otp_expired",
      desc: "Email link is invalid or has expired",
    } satisfies AuthRedirectError);
  });

  it("falls back to URL fragment when query string is empty", () => {
    const search = "";
    const hash =
      "#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired";
    const got = readAuthRedirectError(search, hash);
    expect(got?.code).toBe("otp_expired");
    expect(got?.error).toBe("access_denied");
  });

  it("prefers query string over fragment if both present", () => {
    const got = readAuthRedirectError(
      "?error_code=invalid_request",
      "#error_code=otp_expired",
    );
    expect(got?.code).toBe("invalid_request");
  });

  it("captures error_code without an error category (Supabase OTP expiry pattern)", () => {
    const got = readAuthRedirectError("?error_code=otp_expired");
    expect(got).toEqual({ error: "", code: "otp_expired", desc: "" });
  });

  it("legacy readOAuthErrorFromSearch still returns the two old fields", () => {
    const got = readOAuthErrorFromSearch(
      "?error=access_denied&error_description=Email+link+expired",
    );
    expect(got).toEqual({ error: "access_denied", desc: "Email link expired" });
  });
});

describe("mapAuthRedirectError — bilingual mapping (VI-first)", () => {
  it("returns null for null input", () => {
    expect(mapAuthRedirectError(null)).toBeNull();
  });

  it("maps otp_expired to expired-or-used copy with VI before EN", () => {
    const got = mapAuthRedirectError({
      error: "access_denied",
      code: "otp_expired",
      desc: "Email link is invalid or has expired",
    });
    expect(got).not.toBeNull();
    expect(got!.vi).toContain("hết hạn");
    expect(got!.vi).toContain("Hãy yêu cầu mã mới");
    expect(got!.en).toContain("expired");
    expect(got!.en).toContain("Request a new code");
  });

  it("recognises 'invalid or has expired' description even without error_code", () => {
    const got = mapAuthRedirectError({
      error: "",
      code: "",
      desc: "Email link is invalid or has expired",
    });
    expect(got).not.toBeNull();
    expect(got!.vi).toContain("hết hạn");
  });

  it("maps access_denied (without otp_expired) to 'didn't complete' copy", () => {
    const got = mapAuthRedirectError({
      error: "access_denied",
      code: "",
      desc: "User denied access",
    });
    expect(got).not.toBeNull();
    expect(got!.vi).toContain("Đăng nhập chưa hoàn tất");
    expect(got!.en).toContain("Sign-in didn't complete");
  });

  it("falls back to a generic non-OAuth message that surfaces the provider detail", () => {
    const got = mapAuthRedirectError({
      error: "server_error",
      code: "",
      desc: "Database is on fire",
    });
    expect(got).not.toBeNull();
    // Must NOT use the legacy "OAuth" wording for non-OAuth flows.
    expect(got!.vi).not.toMatch(/OAuth/i);
    expect(got!.en).not.toMatch(/OAuth/i);
    // Should pass through the provider-supplied detail.
    expect(got!.vi).toContain("Database is on fire");
    expect(got!.en).toContain("Database is on fire");
  });
});
