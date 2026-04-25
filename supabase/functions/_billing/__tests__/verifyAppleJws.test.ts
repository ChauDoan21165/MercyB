// supabase/functions/_billing/__tests__/verifyAppleJws.test.ts
//
// C4 fix — locks the JWS-with-key verifier behaviour. The full
// chain-walking path needs real Apple cert fixtures to exercise; the
// JWS-against-known-key primitive (which is what actually rejects a
// tampered signature) is fully tested here.

import { describe, it, expect } from "vitest";

import { verifyJwsWithKey } from "../verifyAppleJws";

const ENC = new TextEncoder();

function base64UrlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlEncodeString(s: string): string {
  return base64UrlEncode(ENC.encode(s));
}

async function generateP256Pair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign", "verify"],
  );
}

async function signEs256Jws(
  privateKey: CryptoKey,
  header: object,
  payload: object,
): Promise<string> {
  const headerB64 = base64UrlEncodeString(JSON.stringify(header));
  const payloadB64 = base64UrlEncodeString(JSON.stringify(payload));
  const signingInput = ENC.encode(`${headerB64}.${payloadB64}`);
  const sig = new Uint8Array(
    await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, privateKey, signingInput),
  );
  return `${headerB64}.${payloadB64}.${base64UrlEncode(sig)}`;
}

describe("verifyJwsWithKey — happy path", () => {
  it("returns ok with the decoded payload for a correctly-signed JWS", async () => {
    const pair = await generateP256Pair();
    const payload = {
      notificationType: "DID_RENEW",
      notificationUUID: "abc-123",
      data: { environment: "production" },
    };
    const jws = await signEs256Jws(pair.privateKey, { alg: "ES256" }, payload);
    const result = await verifyJwsWithKey(jws, pair.publicKey);
    expect(result.ok).toBe(true);
    expect(result.payload).toEqual(payload);
    expect(result.reason).toBeUndefined();
  });
});

describe("verifyJwsWithKey — rejection paths", () => {
  it("rejects an empty / null signedPayload", async () => {
    const pair = await generateP256Pair();
    expect((await verifyJwsWithKey("", pair.publicKey)).reason).toBe("missing_signed_payload");
    expect((await verifyJwsWithKey(null, pair.publicKey)).reason).toBe("missing_signed_payload");
    expect((await verifyJwsWithKey(undefined, pair.publicKey)).reason).toBe("missing_signed_payload");
  });

  it("rejects a malformed JWS (wrong number of segments)", async () => {
    const pair = await generateP256Pair();
    const r = await verifyJwsWithKey("just.two", pair.publicKey);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("malformed_jws");
  });

  it("rejects an unsupported alg in the header", async () => {
    const pair = await generateP256Pair();
    const jws = await signEs256Jws(pair.privateKey, { alg: "HS256" }, { ok: true });
    const r = await verifyJwsWithKey(jws, pair.publicKey);
    expect(r.reason).toBe("unsupported_alg");
  });

  it("rejects a JWS signed by a DIFFERENT key (forgery attempt)", async () => {
    const honestPair = await generateP256Pair();
    const attackerPair = await generateP256Pair();
    const jws = await signEs256Jws(attackerPair.privateKey, { alg: "ES256" }, { ok: true });
    const r = await verifyJwsWithKey(jws, honestPair.publicKey);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("signature_invalid");
  });

  it("rejects a JWS whose payload was tampered after signing", async () => {
    const pair = await generateP256Pair();
    const honest = await signEs256Jws(
      pair.privateKey,
      { alg: "ES256" },
      { notificationType: "DID_RENEW" },
    );
    const [headerB64, _payloadB64, sigB64] = honest.split(".");
    const tamperedPayloadB64 = base64UrlEncodeString(
      JSON.stringify({ notificationType: "REFUND" }),
    );
    const tampered = `${headerB64}.${tamperedPayloadB64}.${sigB64}`;
    const r = await verifyJwsWithKey(tampered, pair.publicKey);
    expect(r.reason).toBe("signature_invalid");
  });

  it("rejects when the header is not valid JSON", async () => {
    const pair = await generateP256Pair();
    const fakeHeader = base64UrlEncode(ENC.encode("not-json"));
    const fakePayload = base64UrlEncode(ENC.encode("{}"));
    const fakeSig = base64UrlEncode(new Uint8Array([1, 2, 3]));
    const r = await verifyJwsWithKey(`${fakeHeader}.${fakePayload}.${fakeSig}`, pair.publicKey);
    expect(r.reason).toBe("malformed_jws");
  });
});
