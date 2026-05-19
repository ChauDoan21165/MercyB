// supabase/functions/email-unsubscribe/__tests__/decision.test.ts
//
// Pure routing/token logic for the email-unsubscribe Edge Function.
// Exercises the RFC 8058 contract without Deno or network:
//   - GET/HEAD are state-neutral (redirect), POST redeems, OPTIONS CORS
//   - the recipient token is read from the URL query, with a form-body
//     fallback, and rejected when too short to be a real token

import { describe, expect, it } from "vitest";

import { extractToken, normalizeToken, planResponse } from "../decision";

const ENDPOINT = "https://x.supabase.co/functions/v1/email-unsubscribe";
const REAL_TOKEN = "a".repeat(48); // 24 bytes hex, matches the migration

describe("normalizeToken", () => {
  it("trims surrounding whitespace", () => {
    expect(normalizeToken(`  ${REAL_TOKEN}  `)).toBe(REAL_TOKEN);
  });

  it("rejects null / empty / too-short tokens (mirrors the RPC >=16 guard)", () => {
    expect(normalizeToken(null)).toBeNull();
    expect(normalizeToken(undefined)).toBeNull();
    expect(normalizeToken("")).toBeNull();
    expect(normalizeToken("short")).toBeNull();
    expect(normalizeToken("0123456789abcde")).toBeNull(); // 15 chars
  });

  it("accepts a 16-char boundary token", () => {
    expect(normalizeToken("0123456789abcdef")).toBe("0123456789abcdef");
  });
});

describe("extractToken", () => {
  it("reads the token from the URL query string", () => {
    expect(
      extractToken({ url: `${ENDPOINT}?token=${REAL_TOKEN}` }),
    ).toBe(REAL_TOKEN);
  });

  it("URL-decodes the query token", () => {
    const encoded = encodeURIComponent(`${REAL_TOKEN}/x`);
    expect(extractToken({ url: `${ENDPOINT}?token=${encoded}` })).toBe(
      `${REAL_TOKEN}/x`,
    );
  });

  it("falls back to an x-www-form-urlencoded body", () => {
    expect(
      extractToken({
        url: ENDPOINT,
        formBody: `List-Unsubscribe=One-Click&token=${REAL_TOKEN}`,
      }),
    ).toBe(REAL_TOKEN);
  });

  it("prefers the query token over the body", () => {
    expect(
      extractToken({
        url: `${ENDPOINT}?token=${REAL_TOKEN}`,
        formBody: "token=bbbbbbbbbbbbbbbbbbbb",
      }),
    ).toBe(REAL_TOKEN);
  });

  it("returns null when no usable token is present", () => {
    expect(extractToken({ url: ENDPOINT })).toBeNull();
    expect(
      extractToken({ url: ENDPOINT, formBody: "List-Unsubscribe=One-Click" }),
    ).toBeNull();
    expect(extractToken({ url: `${ENDPOINT}?token=short` })).toBeNull();
  });
});

describe("planResponse", () => {
  it("POST → redeem (the RFC 8058 one-click)", () => {
    expect(planResponse("POST")).toEqual({ kind: "redeem" });
    expect(planResponse("post")).toEqual({ kind: "redeem" });
  });

  it("GET / HEAD → redirect (state-neutral; scanners must not unsubscribe)", () => {
    expect(planResponse("GET")).toEqual({ kind: "redirect" });
    expect(planResponse("HEAD")).toEqual({ kind: "redirect" });
  });

  it("OPTIONS → cors", () => {
    expect(planResponse("OPTIONS")).toEqual({ kind: "cors" });
  });

  it("anything else → 405", () => {
    expect(planResponse("DELETE")).toEqual({
      kind: "method_not_allowed",
      status: 405,
    });
    expect(planResponse("PUT")).toEqual({
      kind: "method_not_allowed",
      status: 405,
    });
  });
});
