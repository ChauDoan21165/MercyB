// supabase/functions/revenuecat-webhook/__tests__/auth.test.ts
//
// Locks the RevenueCat webhook authorization: constant-time token
// comparison + multi-token rotation parsing. RevenueCat sends no HMAC
// signature (verified — reports/RECON-revenuecat-hmac.md), so the
// Authorization-header token is the ONLY thing standing between the
// public internet and forged subscription grants. If this regresses,
// either the webhook 401s every real delivery, or it accepts forged
// ones. Triggered by RECON-stripe-audit.md finding #4 / N3 (HIGH).

import { describe, expect, it } from "vitest";
import { isAuthorized, parseTokens, timingSafeEqual } from "../auth";

const enc = (s: string) => new TextEncoder().encode(s);

describe("parseTokens", () => {
  it("returns an empty array for missing or whitespace input", () => {
    expect(parseTokens("")).toEqual([]);
    expect(parseTokens("   ")).toEqual([]);
    expect(parseTokens("\n\n")).toEqual([]);
  });

  it("returns a single-element array for a single token", () => {
    expect(parseTokens("rc_tok_abc")).toEqual(["rc_tok_abc"]);
  });

  it("supports comma-separated rotation pairs", () => {
    expect(parseTokens("rc_new_def,rc_old_abc")).toEqual([
      "rc_new_def",
      "rc_old_abc",
    ]);
  });

  it("supports newline-separated rotation pairs", () => {
    expect(parseTokens("rc_new_def\nrc_old_abc")).toEqual([
      "rc_new_def",
      "rc_old_abc",
    ]);
  });

  it("trims whitespace and ignores empty entries", () => {
    expect(parseTokens("  rc_a  ,  ,\n  rc_b\n,\n")).toEqual([
      "rc_a",
      "rc_b",
    ]);
  });
});

describe("timingSafeEqual", () => {
  it("is true for identical byte sequences", () => {
    expect(timingSafeEqual(enc("same-token"), enc("same-token"))).toBe(true);
  });

  it("is false for equal-length but different content", () => {
    expect(timingSafeEqual(enc("token-aaaa"), enc("token-bbbb"))).toBe(false);
  });

  it("is false for different lengths", () => {
    expect(timingSafeEqual(enc("short"), enc("longer-token"))).toBe(false);
  });

  it("is true for two empty arrays", () => {
    expect(timingSafeEqual(enc(""), enc(""))).toBe(true);
  });
});

describe("isAuthorized", () => {
  const configured = parseTokens("rc_new_def");

  it("accepts the exact configured token", () => {
    expect(isAuthorized("rc_new_def", configured)).toBe(true);
  });

  it("rejects a wrong token of the same length", () => {
    expect(isAuthorized("rc_new_xyz", configured)).toBe(false);
  });

  it("rejects a wrong token of a different length", () => {
    expect(isAuthorized("rc_new_def_extra", configured)).toBe(false);
    expect(isAuthorized("rc", configured)).toBe(false);
  });

  it("rejects an empty presented token", () => {
    expect(isAuthorized("", configured)).toBe(false);
  });

  it("accepts either token during a rotation window", () => {
    const rotating = parseTokens("rc_new_def,rc_old_abc");
    expect(isAuthorized("rc_new_def", rotating)).toBe(true);
    expect(isAuthorized("rc_old_abc", rotating)).toBe(true);
  });

  it("rejects a token absent from the rotation set", () => {
    const rotating = parseTokens("rc_new_def,rc_old_abc");
    expect(isAuthorized("rc_other_ghi", rotating)).toBe(false);
  });

  it("rejects everything when no tokens are configured", () => {
    // Mirrors the unset-secret path: parseTokens("") -> [] -> the
    // handler short-circuits with HTTP 500 before reaching dispatch.
    expect(parseTokens("")).toEqual([]);
    expect(isAuthorized("rc_new_def", parseTokens(""))).toBe(false);
    expect(isAuthorized("", [])).toBe(false);
  });
});
