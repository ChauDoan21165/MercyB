// supabase/functions/_billing/__tests__/verifyGoogleJwt.test.ts
//
// C4 fix — locks the Google Pub/Sub OIDC JWT verifier behaviour. We
// inject a fake key resolver so tests don't hit the real Google JWKS
// endpoint; the verifier is otherwise exercised end-to-end (header
// parse, sig verify, claims check, expiry handling).

import { describe, it, expect } from "vitest";

import {
  verifyGoogleJwt,
  verifyGooglePubsubAuth,
  type VerifyGoogleJwtOptions,
} from "../verifyGoogleJwt";

const ENC = new TextEncoder();
const TEST_KID = "test-kid-1";
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
  publicKey: CryptoKey;
  privateKey: CryptoKey;
  baseClaims: () => Record<string, unknown>;
  options: () => VerifyGoogleJwtOptions;
}> {
  const pair = await generateRsaPair();
  const now = Math.floor(Date.now() / 1000);
  return {
    publicKey: pair.publicKey,
    privateKey: pair.privateKey,
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
      keyResolver: async (kid: string) => (kid === TEST_KID ? pair.publicKey : null),
    }),
  };
}

describe("verifyGoogleJwt — happy path", () => {
  it("accepts a correctly-signed JWT with all expected claims", async () => {
    const f = await fixture();
    const token = await signRs256Jwt(
      f.privateKey,
      { alg: "RS256", kid: TEST_KID },
      f.baseClaims(),
    );
    const r = await verifyGoogleJwt(token, f.options());
    expect(r.ok).toBe(true);
    expect(r.claims?.email).toBe(TEST_EMAIL);
    expect(r.claims?.aud).toBe(TEST_AUDIENCE);
  });

  it("accepts the alternate issuer 'accounts.google.com' (no scheme)", async () => {
    const f = await fixture();
    const token = await signRs256Jwt(
      f.privateKey,
      { alg: "RS256", kid: TEST_KID },
      { ...f.baseClaims(), iss: "accounts.google.com" },
    );
    const r = await verifyGoogleJwt(token, f.options());
    expect(r.ok).toBe(true);
  });
});

describe("verifyGoogleJwt — rejection paths", () => {
  it("rejects malformed JWT (wrong segment count)", async () => {
    const f = await fixture();
    const r = await verifyGoogleJwt("a.b", f.options());
    expect(r.reason).toBe("malformed_jwt");
  });

  it("rejects unsupported alg (e.g. HS256)", async () => {
    const f = await fixture();
    const token = await signRs256Jwt(
      f.privateKey,
      { alg: "HS256", kid: TEST_KID },
      f.baseClaims(),
    );
    const r = await verifyGoogleJwt(token, f.options());
    expect(r.reason).toBe("unsupported_alg");
  });

  it("rejects when kid is missing from header", async () => {
    const f = await fixture();
    const token = await signRs256Jwt(f.privateKey, { alg: "RS256" }, f.baseClaims());
    const r = await verifyGoogleJwt(token, f.options());
    expect(r.reason).toBe("missing_kid");
  });

  it("rejects when the resolver can't find the kid", async () => {
    const f = await fixture();
    const token = await signRs256Jwt(
      f.privateKey,
      { alg: "RS256", kid: "unknown-kid" },
      f.baseClaims(),
    );
    const r = await verifyGoogleJwt(token, f.options());
    expect(r.reason).toBe("key_not_found");
  });

  it("rejects a JWT signed by an attacker key (resolver returns honest key)", async () => {
    const honest = await fixture();
    const attacker = await generateRsaPair();
    const token = await signRs256Jwt(
      attacker.privateKey,
      { alg: "RS256", kid: TEST_KID },
      honest.baseClaims(),
    );
    const r = await verifyGoogleJwt(token, honest.options());
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("signature_invalid");
  });

  it("rejects a wrong issuer", async () => {
    const f = await fixture();
    const token = await signRs256Jwt(
      f.privateKey,
      { alg: "RS256", kid: TEST_KID },
      { ...f.baseClaims(), iss: "https://attacker.example" },
    );
    const r = await verifyGoogleJwt(token, f.options());
    expect(r.reason).toBe("issuer_mismatch");
  });

  it("rejects when audience doesn't match", async () => {
    const f = await fixture();
    const token = await signRs256Jwt(
      f.privateKey,
      { alg: "RS256", kid: TEST_KID },
      { ...f.baseClaims(), aud: "https://different.example" },
    );
    const r = await verifyGoogleJwt(token, f.options());
    expect(r.reason).toBe("audience_mismatch");
  });

  it("rejects when email doesn't match expected service account", async () => {
    const f = await fixture();
    const token = await signRs256Jwt(
      f.privateKey,
      { alg: "RS256", kid: TEST_KID },
      { ...f.baseClaims(), email: "different@example.com" },
    );
    const r = await verifyGoogleJwt(token, f.options());
    expect(r.reason).toBe("email_mismatch");
  });

  it("rejects when email_verified is false", async () => {
    const f = await fixture();
    const token = await signRs256Jwt(
      f.privateKey,
      { alg: "RS256", kid: TEST_KID },
      { ...f.baseClaims(), email_verified: false },
    );
    const r = await verifyGoogleJwt(token, f.options());
    expect(r.reason).toBe("email_unverified");
  });

  it("rejects an expired JWT", async () => {
    const f = await fixture();
    const past = Math.floor(Date.now() / 1000) - 24 * 3600;
    const token = await signRs256Jwt(
      f.privateKey,
      { alg: "RS256", kid: TEST_KID },
      { ...f.baseClaims(), iat: past - 60, exp: past },
    );
    const r = await verifyGoogleJwt(token, f.options());
    expect(r.reason).toBe("expired");
  });
});

describe("verifyGooglePubsubAuth — Authorization header parsing", () => {
  it("returns missing_authorization for null header", async () => {
    const f = await fixture();
    const r = await verifyGooglePubsubAuth(null, f.options());
    expect(r.reason).toBe("missing_authorization");
  });

  it("returns missing_authorization for header without 'Bearer ' prefix", async () => {
    const f = await fixture();
    const r = await verifyGooglePubsubAuth("Basic abc123", f.options());
    expect(r.reason).toBe("missing_authorization");
  });

  it("accepts 'Bearer <token>' format and verifies the token", async () => {
    const f = await fixture();
    const token = await signRs256Jwt(
      f.privateKey,
      { alg: "RS256", kid: TEST_KID },
      f.baseClaims(),
    );
    const r = await verifyGooglePubsubAuth(`Bearer ${token}`, f.options());
    expect(r.ok).toBe(true);
  });

  it("is case-insensitive on the 'Bearer' prefix", async () => {
    const f = await fixture();
    const token = await signRs256Jwt(
      f.privateKey,
      { alg: "RS256", kid: TEST_KID },
      f.baseClaims(),
    );
    const r = await verifyGooglePubsubAuth(`bearer ${token}`, f.options());
    expect(r.ok).toBe(true);
  });
});
