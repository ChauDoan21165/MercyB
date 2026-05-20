// supabase/functions/_billing/__tests__/verifyGoogleJwt-edge.test.ts
//
// A12 coverage ratchet — exercise the verifyGoogleJwt branches the
// existing verifyGoogleJwt.test.ts doesn't cover:
//   - `not_yet_valid` (iat > now + leeway)
//   - Array `aud` claim — happy + mismatch
//   - Custom `now` + `leewaySeconds` options
//   - Bearer header parsing with whitespace + uppercase prefix
//   - Malformed JWT via bad-base64 signature
//
// Existing file already covers: malformed_jwt (segment count), unsupported_alg,
// missing_kid, key_not_found, signature_invalid, issuer_mismatch,
// audience_mismatch, email_mismatch, email_unverified, expired,
// plus Bearer-prefix happy path. We do NOT re-test those.

import { describe, it, expect } from "vitest";
import {
  verifyGoogleJwt,
  verifyGooglePubsubAuth,
  type VerifyGoogleJwtOptions,
} from "../verifyGoogleJwt";

const ENC = new TextEncoder();
const TEST_KID = "test-kid-edge";
const TEST_AUDIENCE = "https://mercyblade.com/google-webhook";
const TEST_EMAIL = "pubsub@mercyblade-test.iam.gserviceaccount.com";

function base64UrlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlEncodeString(s: string): string {
  return base64UrlEncode(ENC.encode(s));
}

async function generateRsaPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: "SHA-256",
    },
    false,
    ["sign", "verify"],
  );
}

async function signRs256Jwt(
  privateKey: CryptoKey,
  header: object,
  payload: object,
): Promise<string> {
  const headerB64 = base64UrlEncodeString(JSON.stringify(header));
  const payloadB64 = base64UrlEncodeString(JSON.stringify(payload));
  const signingInput = ENC.encode(`${headerB64}.${payloadB64}`);
  const sig = new Uint8Array(
    await crypto.subtle.sign({ name: "RSASSA-PKCS1-v1_5" }, privateKey, signingInput),
  );
  return `${headerB64}.${payloadB64}.${base64UrlEncode(sig)}`;
}

async function fixture(): Promise<{
  pair: CryptoKeyPair;
  baseClaims: () => Record<string, unknown>;
  options: () => VerifyGoogleJwtOptions;
}> {
  const pair = await generateRsaPair();
  const now = Math.floor(Date.now() / 1000);
  return {
    pair,
    baseClaims: () => ({
      iss: "https://accounts.google.com",
      aud: TEST_AUDIENCE,
      email: TEST_EMAIL,
      email_verified: true,
      iat: now - 30,
      exp: now + 600,
      sub: "111111111111111111111",
    }),
    options: () => ({
      expectedAudience: TEST_AUDIENCE,
      expectedEmail: TEST_EMAIL,
      keyResolver: async (kid: string) =>
        kid === TEST_KID ? pair.publicKey : null,
    }),
  };
}

describe("verifyGoogleJwt — time-window edges", () => {
  it("rejects a JWT whose iat is in the future (not_yet_valid)", async () => {
    const f = await fixture();
    const now = Math.floor(Date.now() / 1000);
    // iat is 1 hour in the future — well outside the 60s leeway.
    const token = await signRs256Jwt(
      f.pair.privateKey,
      { alg: "RS256", kid: TEST_KID },
      { ...f.baseClaims(), iat: now + 3600, exp: now + 7200 },
    );
    const r = await verifyGoogleJwt(token, f.options());
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("not_yet_valid");
  });

  it("honors a custom `now` option for deterministic time testing", async () => {
    const f = await fixture();
    // Sign a token with exp at unix 1000. Use a deterministic now of 500
    // — the token would normally be way in the past, but `now=500` makes
    // it valid.
    const token = await signRs256Jwt(
      f.pair.privateKey,
      { alg: "RS256", kid: TEST_KID },
      { ...f.baseClaims(), iat: 100, exp: 1000 },
    );
    const r = await verifyGoogleJwt(token, { ...f.options(), now: 500 });
    expect(r.ok).toBe(true);
  });

  it("honors a custom `leewaySeconds` option (zero leeway → strict expiry)", async () => {
    const f = await fixture();
    const now = Math.floor(Date.now() / 1000);
    // Token expired 30 seconds ago — passes with default 60s leeway,
    // fails with 0s leeway.
    const token = await signRs256Jwt(
      f.pair.privateKey,
      { alg: "RS256", kid: TEST_KID },
      { ...f.baseClaims(), iat: now - 3600, exp: now - 30 },
    );
    const rWithLeeway = await verifyGoogleJwt(token, f.options());
    expect(rWithLeeway.ok).toBe(true); // 60s leeway saves it
    const rStrict = await verifyGoogleJwt(token, { ...f.options(), leewaySeconds: 0 });
    expect(rStrict.ok).toBe(false);
    expect(rStrict.reason).toBe("expired");
  });
});

describe("verifyGoogleJwt — audience as array", () => {
  it("accepts an array `aud` claim that contains expectedAudience", async () => {
    const f = await fixture();
    const token = await signRs256Jwt(
      f.pair.privateKey,
      { alg: "RS256", kid: TEST_KID },
      { ...f.baseClaims(), aud: ["https://other.example", TEST_AUDIENCE] },
    );
    const r = await verifyGoogleJwt(token, f.options());
    expect(r.ok).toBe(true);
  });

  it("rejects an array `aud` claim that does NOT contain expectedAudience", async () => {
    const f = await fixture();
    const token = await signRs256Jwt(
      f.pair.privateKey,
      { alg: "RS256", kid: TEST_KID },
      { ...f.baseClaims(), aud: ["https://other.example", "https://third.example"] },
    );
    const r = await verifyGoogleJwt(token, f.options());
    expect(r.reason).toBe("audience_mismatch");
  });
});

describe("verifyGoogleJwt — malformed body fragments", () => {
  it("rejects when the signature segment is bad base64", async () => {
    const f = await fixture();
    // Build a header + payload pair, but use an invalid base64 string
    // for the signature so base64UrlDecode throws inside the verifier.
    const header = base64UrlEncodeString(
      JSON.stringify({ alg: "RS256", kid: TEST_KID }),
    );
    const payload = base64UrlEncodeString(JSON.stringify(f.baseClaims()));
    // "!!!" is not valid base64 (atob throws on these characters).
    const r = await verifyGoogleJwt(`${header}.${payload}.!!!`, f.options());
    expect(r.reason).toBe("malformed_jwt");
  });
});

describe("verifyGooglePubsubAuth — Authorization header edge cases", () => {
  it("returns missing_authorization for empty string", async () => {
    const f = await fixture();
    const r = await verifyGooglePubsubAuth("", f.options());
    expect(r.reason).toBe("missing_authorization");
  });

  it("returns missing_authorization for undefined", async () => {
    const f = await fixture();
    const r = await verifyGooglePubsubAuth(undefined, f.options());
    expect(r.reason).toBe("missing_authorization");
  });

  it("accepts uppercase 'BEARER ' prefix (case-insensitive)", async () => {
    const f = await fixture();
    const token = await signRs256Jwt(
      f.pair.privateKey,
      { alg: "RS256", kid: TEST_KID },
      f.baseClaims(),
    );
    const r = await verifyGooglePubsubAuth(`BEARER ${token}`, f.options());
    expect(r.ok).toBe(true);
  });

  it("trims whitespace after the Bearer prefix", async () => {
    const f = await fixture();
    const token = await signRs256Jwt(
      f.pair.privateKey,
      { alg: "RS256", kid: TEST_KID },
      f.baseClaims(),
    );
    // Multiple spaces and a trailing space — the impl does `.trim()`
    // on the token after the prefix.
    const r = await verifyGooglePubsubAuth(`Bearer   ${token}   `, f.options());
    expect(r.ok).toBe(true);
  });
});
