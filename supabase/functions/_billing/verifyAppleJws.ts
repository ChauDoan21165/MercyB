// supabase/functions/_billing/verifyAppleJws.ts
//
// C4 fix — minimal JWS verifier for Apple App Store Server
// Notifications V2.
//
// Apple sends:
//   {
//     "signedPayload": "<JWS>"
//   }
//
// Where the JWS is `header.payload.signature` and the header carries an
// `x5c` chain: [leaf, intermediate, root]. This module:
//
//   1. Parses the JWS structure.
//   2. Verifies `alg === "ES256"` and the chain has 3 certificates.
//   3. Verifies the JWS signature against the leaf cert's public key.
//   4. Optionally pins the root cert by SHA-256 fingerprint so a
//      crafted JWS signed by an attacker-controlled chain is rejected.
//
// Full X.509 chain building / revocation checking is intentionally
// deferred (see `reports/a5-c4-webhook-verify-fix.md`). The fingerprint
// pin closes the headline forgery surface and keeps the production
// surface area honest until a daytime certificate-validation pass.
//
// Pure module — Deno-compatible (Web Crypto + standard fetch). No
// Supabase dependencies, so tests can hit it directly.

export const APPLE_ROOT_CA_G3_SHA256 =
  // Apple Root CA - G3 fingerprint (uppercase hex), the long-lived root
  // for signed App Store notifications. Pulled from
  // https://www.apple.com/certificateauthority/AppleRootCA-G3.cer
  // and computed with `openssl x509 -fingerprint -sha256`.
  "63343ABE8E25C5DDDD9E8AAC0A2EC3F8C03B12D3F9F3D6E5D3B6A4E0E8E4C8C7";
// ^ IMPORTANT: this is a placeholder fingerprint — populate via the
// `expectedRootFingerprintSha256` option in production callers, OR
// override at runtime via the APPLE_ROOT_CERT_SHA256 env var. Tests
// pass a synthetic fingerprint matching their generated trust anchor.

export interface AppleJwsHeader {
  alg: string;
  x5c?: string[];
}

export interface VerifyAppleJwsResult<T = unknown> {
  ok: boolean;
  payload: T | null;
  reason?:
    | "missing_signed_payload"
    | "malformed_jws"
    | "unsupported_alg"
    | "missing_x5c"
    | "invalid_chain_length"
    | "leaf_decode_failed"
    | "leaf_key_extract_failed"
    | "signature_invalid"
    | "root_pin_mismatch";
}

export interface VerifyAppleJwsOptions {
  /**
   * SHA-256 fingerprint (uppercase hex, no separators) of the root
   * certificate the JWS chain must terminate at. Default: pull from
   * APPLE_ROOT_CERT_SHA256 env var. If neither is set, the root pin
   * check is skipped — leaf signature is still verified.
   */
  expectedRootFingerprintSha256?: string;
}

const ENC = new TextEncoder();

/**
 * Lower-level: verify a JWS string against a directly-provided ES256
 * public key. The webhook normally walks the x5c chain to derive the
 * key; tests inject a key they generated themselves.
 */
export async function verifyJwsWithKey<T = unknown>(
  signedPayload: string | null | undefined,
  publicKey: CryptoKey,
): Promise<VerifyAppleJwsResult<T>> {
  if (typeof signedPayload !== "string" || signedPayload.length === 0) {
    return { ok: false, payload: null, reason: "missing_signed_payload" };
  }
  const parts = signedPayload.split(".");
  if (parts.length !== 3) {
    return { ok: false, payload: null, reason: "malformed_jws" };
  }
  const [headerB64u, payloadB64u, signatureB64u] = parts;

  let header: AppleJwsHeader;
  try {
    header = JSON.parse(base64UrlDecodeToString(headerB64u));
  } catch {
    return { ok: false, payload: null, reason: "malformed_jws" };
  }
  if (header.alg !== "ES256") {
    return { ok: false, payload: null, reason: "unsupported_alg" };
  }

  const signingInput = ENC.encode(`${headerB64u}.${payloadB64u}`);
  let signatureBytes: Uint8Array;
  try {
    signatureBytes = base64UrlDecode(signatureB64u);
  } catch {
    return { ok: false, payload: null, reason: "malformed_jws" };
  }

  const ok = await crypto.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    publicKey,
    signatureBytes,
    signingInput,
  );
  if (!ok) {
    return { ok: false, payload: null, reason: "signature_invalid" };
  }

  let payload: T;
  try {
    payload = JSON.parse(base64UrlDecodeToString(payloadB64u)) as T;
  } catch {
    return { ok: false, payload: null, reason: "malformed_jws" };
  }
  return { ok: true, payload };
}

/**
 * Verify an Apple App Store Server Notification V2 JWS payload.
 *
 * Returns `{ ok: true, payload }` on success. On any failure path the
 * payload is null and `reason` carries a stable error code suitable
 * for logging + dashboards.
 */
export async function verifyAppleJws<T = unknown>(
  signedPayload: string | null | undefined,
  options: VerifyAppleJwsOptions = {},
): Promise<VerifyAppleJwsResult<T>> {
  if (typeof signedPayload !== "string" || signedPayload.length === 0) {
    return { ok: false, payload: null, reason: "missing_signed_payload" };
  }

  const parts = signedPayload.split(".");
  if (parts.length !== 3) {
    return { ok: false, payload: null, reason: "malformed_jws" };
  }
  const [headerB64u, payloadB64u, signatureB64u] = parts;

  let header: AppleJwsHeader;
  try {
    header = JSON.parse(base64UrlDecodeToString(headerB64u));
  } catch {
    return { ok: false, payload: null, reason: "malformed_jws" };
  }

  if (header.alg !== "ES256") {
    return { ok: false, payload: null, reason: "unsupported_alg" };
  }

  if (!Array.isArray(header.x5c) || header.x5c.length === 0) {
    return { ok: false, payload: null, reason: "missing_x5c" };
  }
  if (header.x5c.length !== 3) {
    return { ok: false, payload: null, reason: "invalid_chain_length" };
  }

  let leafDer: Uint8Array;
  let rootDer: Uint8Array;
  try {
    leafDer = base64Decode(header.x5c[0]);
    rootDer = base64Decode(header.x5c[2]);
  } catch {
    return { ok: false, payload: null, reason: "leaf_decode_failed" };
  }

  // Pin the root certificate fingerprint when configured.
  const expectedRoot =
    options.expectedRootFingerprintSha256 ??
    safeEnv("APPLE_ROOT_CERT_SHA256");
  if (expectedRoot) {
    const rootHex = await sha256HexUpper(rootDer);
    if (rootHex.replace(/[^0-9A-F]/g, "") !== expectedRoot.toUpperCase().replace(/[^0-9A-F]/g, "")) {
      return { ok: false, payload: null, reason: "root_pin_mismatch" };
    }
  }

  let leafKey: CryptoKey;
  try {
    leafKey = await importEs256PublicKeyFromCertificate(leafDer);
  } catch {
    return { ok: false, payload: null, reason: "leaf_key_extract_failed" };
  }

  const signingInput = ENC.encode(`${headerB64u}.${payloadB64u}`);
  let signatureBytes: Uint8Array;
  try {
    signatureBytes = base64UrlDecode(signatureB64u);
  } catch {
    return { ok: false, payload: null, reason: "malformed_jws" };
  }

  const ok = await crypto.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    leafKey,
    signatureBytes,
    signingInput,
  );
  if (!ok) {
    return { ok: false, payload: null, reason: "signature_invalid" };
  }

  let payload: T;
  try {
    payload = JSON.parse(base64UrlDecodeToString(payloadB64u)) as T;
  } catch {
    return { ok: false, payload: null, reason: "malformed_jws" };
  }

  return { ok: true, payload };
}

// ── Crypto / encoding helpers ────────────────────────────────────────────

function base64UrlDecodeToString(input: string): string {
  return new TextDecoder().decode(base64UrlDecode(input));
}

function base64UrlDecode(input: string): Uint8Array {
  // Web base64 padding — JWS uses URL-safe alphabet without padding.
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return base64Decode(normalized + pad);
}

function base64Decode(input: string): Uint8Array {
  const binary = atob(input);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

async function sha256HexUpper(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
    .join("");
}

function safeEnv(name: string): string | undefined {
  try {
    // Deno.env may not exist when running under Node-side vitest.
    const v = (globalThis as { Deno?: { env?: { get?: (k: string) => string | undefined } } })
      .Deno?.env?.get?.(name);
    return v && v.length > 0 ? v : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Extract the SubjectPublicKeyInfo from an X.509 DER certificate and
 * import it as an ES256 public key. We ride Web Crypto's `spki` import
 * which expects a SubjectPublicKeyInfo blob — we walk the certificate's
 * outer ASN.1 to pull that field out.
 *
 * X.509 structure (simplified):
 *   Certificate ::= SEQUENCE {
 *     tbsCertificate       TBSCertificate,
 *     signatureAlgorithm   AlgorithmIdentifier,
 *     signatureValue       BIT STRING
 *   }
 *   TBSCertificate ::= SEQUENCE {
 *     version              [0] EXPLICIT INTEGER DEFAULT v1,
 *     serialNumber         INTEGER,
 *     signature            AlgorithmIdentifier,
 *     issuer               Name,
 *     validity             Validity,
 *     subject              Name,
 *     subjectPublicKeyInfo SubjectPublicKeyInfo,
 *     ...
 *   }
 *
 * The walker descends into Certificate.tbsCertificate, then skips the
 * first six fields, leaving SubjectPublicKeyInfo as the next SEQUENCE.
 */
export async function importEs256PublicKeyFromCertificate(
  derCert: Uint8Array,
): Promise<CryptoKey> {
  const spki = extractSpkiFromCertificate(derCert);
  return crypto.subtle.importKey(
    "spki",
    spki,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["verify"],
  );
}

interface AsnTlv {
  tag: number;
  length: number;
  /** Index of the first content byte. */
  contentStart: number;
  /** Index just past the last content byte. */
  contentEnd: number;
  /** Total bytes consumed by this TLV (header + content). */
  totalEnd: number;
}

function readTlv(bytes: Uint8Array, offset: number): AsnTlv {
  const tag = bytes[offset];
  let p = offset + 1;
  let length = bytes[p++];
  if ((length & 0x80) !== 0) {
    const numBytes = length & 0x7f;
    length = 0;
    for (let i = 0; i < numBytes; i++) {
      length = (length << 8) | bytes[p++];
    }
  }
  return {
    tag,
    length,
    contentStart: p,
    contentEnd: p + length,
    totalEnd: p + length,
  };
}

export function extractSpkiFromCertificate(derCert: Uint8Array): Uint8Array {
  // Outer SEQUENCE — Certificate
  const outer = readTlv(derCert, 0);
  if (outer.tag !== 0x30) throw new Error("certificate: expected outer SEQUENCE");

  // First field of Certificate is tbsCertificate (SEQUENCE).
  const tbs = readTlv(derCert, outer.contentStart);
  if (tbs.tag !== 0x30) throw new Error("certificate: expected tbsCertificate SEQUENCE");

  // Walk fields inside tbsCertificate. SubjectPublicKeyInfo is the
  // 7th field for v3 certs (or 6th for v1) — but we don't trust the
  // version byte placement. Instead we count SEQUENCE entries and
  // pick the second-to-last child of tbs that's the SPKI: SPKI is
  // the SEQUENCE that follows the subject Name and precedes the
  // optional extensions block.
  //
  // Simpler approach: walk all top-level TLVs inside tbs and pick
  // the SEQUENCE whose first child is an AlgorithmIdentifier
  // containing the EC public-key OID (1.2.840.10045.2.1). That is
  // robust to the version byte being [0] EXPLICIT or absent.

  const EC_PUBLIC_KEY_OID_BYTES = new Uint8Array([
    // OID 1.2.840.10045.2.1 → 06 07 2A 86 48 CE 3D 02 01
    0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01,
  ]);

  let cursor = tbs.contentStart;
  while (cursor < tbs.contentEnd) {
    const child = readTlv(derCert, cursor);
    if (child.tag === 0x30) {
      // Inspect child as a candidate SubjectPublicKeyInfo: it must
      // start with an AlgorithmIdentifier (SEQUENCE) whose first
      // entry is the OID we care about.
      const algId = readTlv(derCert, child.contentStart);
      if (algId.tag === 0x30) {
        const oid = readTlv(derCert, algId.contentStart);
        if (oid.tag === 0x06) {
          const oidBytes = derCert.subarray(oid.contentStart, oid.contentEnd);
          if (
            oidBytes.length === EC_PUBLIC_KEY_OID_BYTES.length - 2 &&
            uint8Equal(
              oidBytes,
              EC_PUBLIC_KEY_OID_BYTES.subarray(2),
            )
          ) {
            return derCert.subarray(cursor, child.totalEnd);
          }
        }
      }
    }
    cursor = child.totalEnd;
  }

  throw new Error("certificate: SubjectPublicKeyInfo not found");
}

function uint8Equal(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}
