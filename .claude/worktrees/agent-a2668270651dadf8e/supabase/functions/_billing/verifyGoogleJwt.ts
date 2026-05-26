// supabase/functions/_billing/verifyGoogleJwt.ts
//
// C4 fix — verify the Google-signed OIDC JWT that accompanies a
// Pub/Sub push delivery (Google Play RTDN flow).
//
// Google sends:
//   POST /google-webhook
//   Authorization: Bearer <JWT>
//   Body: { message: { data: <base64>, ... }, subscription: ... }
//
// The JWT is signed by Google with RS256 and carries:
//   - `iss`   : "https://accounts.google.com" or "accounts.google.com"
//   - `aud`   : the audience configured on the Pub/Sub push subscription
//   - `email` : the service account that pushes the messages
//   - `email_verified`: true
//   - `exp`, `iat`, `azp`, `sub`
//
// To trust the request we must:
//   1. Fetch Google's current public keys (https://www.googleapis.com/oauth2/v3/certs)
//   2. Verify the JWT signature against the key whose `kid` matches the JWT header
//   3. Check `iss` is one of the two accepted strings
//   4. Check `aud` matches the configured audience
//   5. Check `email` matches the configured Pub/Sub service-account email
//   6. Check `exp` hasn't passed (with a small leeway)
//
// Pure module — Deno-compatible (Web Crypto + fetch). Tests inject
// fixtures via the `keyResolver` option so we don't hit the network.

const ENC = new TextEncoder();

const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
const ALLOWED_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];
const DEFAULT_LEEWAY_SECONDS = 60;

export interface GoogleJwtClaims {
  iss?: string;
  aud?: string | string[];
  email?: string;
  email_verified?: boolean;
  exp?: number;
  iat?: number;
  sub?: string;
  azp?: string;
}

export interface VerifyGoogleJwtOptions {
  /**
   * Audience the push subscription was configured to use. The JWT's
   * `aud` claim must equal this exactly. Pull from env var
   * GOOGLE_PUBSUB_AUDIENCE in production callers.
   */
  expectedAudience: string;
  /**
   * Service-account email that pushes the messages. The JWT's
   * `email` claim must equal this. Pull from env var
   * GOOGLE_PUBSUB_SERVICE_ACCOUNT_EMAIL.
   */
  expectedEmail: string;
  /**
   * Optional override for the JWKS resolver — tests inject a
   * deterministic resolver that returns a CryptoKey for a known kid.
   */
  keyResolver?: (kid: string) => Promise<CryptoKey | null>;
  /** Override "now" for tests. Default: Date.now() / 1000. */
  now?: number;
  /** Clock-skew leeway in seconds. Default 60s. */
  leewaySeconds?: number;
}

export interface VerifyGoogleJwtResult {
  ok: boolean;
  claims: GoogleJwtClaims | null;
  reason?:
    | "missing_authorization"
    | "malformed_jwt"
    | "unsupported_alg"
    | "missing_kid"
    | "key_not_found"
    | "signature_invalid"
    | "issuer_mismatch"
    | "audience_mismatch"
    | "email_mismatch"
    | "email_unverified"
    | "expired"
    | "not_yet_valid";
}

/**
 * Top-level: extract Bearer token from an Authorization header and
 * verify it. Returns ok+claims on success, or a reason code.
 */
export async function verifyGooglePubsubAuth(
  authorizationHeader: string | null | undefined,
  options: VerifyGoogleJwtOptions,
): Promise<VerifyGoogleJwtResult> {
  if (!authorizationHeader || !authorizationHeader.toLowerCase().startsWith("bearer ")) {
    return { ok: false, claims: null, reason: "missing_authorization" };
  }
  const token = authorizationHeader.slice("bearer ".length).trim();
  return verifyGoogleJwt(token, options);
}

/**
 * Verify a raw JWT string. Used by `verifyGooglePubsubAuth` and by tests.
 */
export async function verifyGoogleJwt(
  token: string,
  options: VerifyGoogleJwtOptions,
): Promise<VerifyGoogleJwtResult> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return { ok: false, claims: null, reason: "malformed_jwt" };
  }
  const [headerB64u, payloadB64u, signatureB64u] = parts;

  let header: { alg?: string; kid?: string };
  try {
    header = JSON.parse(base64UrlDecodeToString(headerB64u));
  } catch {
    return { ok: false, claims: null, reason: "malformed_jwt" };
  }
  if (header.alg !== "RS256") {
    return { ok: false, claims: null, reason: "unsupported_alg" };
  }
  if (!header.kid || typeof header.kid !== "string") {
    return { ok: false, claims: null, reason: "missing_kid" };
  }

  const resolver = options.keyResolver ?? defaultKeyResolver;
  const key = await resolver(header.kid);
  if (!key) {
    return { ok: false, claims: null, reason: "key_not_found" };
  }

  let signatureBytes: Uint8Array;
  try {
    signatureBytes = base64UrlDecode(signatureB64u);
  } catch {
    return { ok: false, claims: null, reason: "malformed_jwt" };
  }

  const signingInput = ENC.encode(`${headerB64u}.${payloadB64u}`);
  const sigOk = await crypto.subtle.verify(
    { name: "RSASSA-PKCS1-v1_5" },
    key,
    signatureBytes,
    signingInput,
  );
  if (!sigOk) {
    return { ok: false, claims: null, reason: "signature_invalid" };
  }

  let claims: GoogleJwtClaims;
  try {
    claims = JSON.parse(base64UrlDecodeToString(payloadB64u)) as GoogleJwtClaims;
  } catch {
    return { ok: false, claims: null, reason: "malformed_jwt" };
  }

  if (typeof claims.iss !== "string" || !ALLOWED_ISSUERS.includes(claims.iss)) {
    return { ok: false, claims: null, reason: "issuer_mismatch" };
  }

  const aud = claims.aud;
  const audOk =
    aud === options.expectedAudience ||
    (Array.isArray(aud) && aud.includes(options.expectedAudience));
  if (!audOk) {
    return { ok: false, claims: null, reason: "audience_mismatch" };
  }

  if (claims.email !== options.expectedEmail) {
    return { ok: false, claims: null, reason: "email_mismatch" };
  }
  if (claims.email_verified !== true) {
    return { ok: false, claims: null, reason: "email_unverified" };
  }

  const now = options.now ?? Math.floor(Date.now() / 1000);
  const leeway = options.leewaySeconds ?? DEFAULT_LEEWAY_SECONDS;
  if (typeof claims.exp === "number" && claims.exp + leeway < now) {
    return { ok: false, claims: null, reason: "expired" };
  }
  if (typeof claims.iat === "number" && claims.iat - leeway > now) {
    return { ok: false, claims: null, reason: "not_yet_valid" };
  }

  return { ok: true, claims };
}

// ── Default JWKS resolver ────────────────────────────────────────────────

interface JwksKey {
  kid: string;
  kty: string;
  alg?: string;
  use?: string;
  n: string;
  e: string;
}

interface JwksCache {
  fetchedAt: number;
  keys: Record<string, CryptoKey>;
}

let jwksCache: JwksCache | null = null;
const JWKS_TTL_MS = 60 * 60 * 1000; // 1 hour

async function defaultKeyResolver(kid: string): Promise<CryptoKey | null> {
  const now = Date.now();
  if (!jwksCache || now - jwksCache.fetchedAt > JWKS_TTL_MS) {
    try {
      const res = await fetch(GOOGLE_JWKS_URL, { cache: "no-store" });
      if (!res.ok) return null;
      const body = (await res.json()) as { keys: JwksKey[] };
      const out: Record<string, CryptoKey> = {};
      for (const k of body.keys) {
        if (k.kty !== "RSA") continue;
        try {
          out[k.kid] = await crypto.subtle.importKey(
            "jwk",
            { kty: "RSA", n: k.n, e: k.e, alg: "RS256", ext: true },
            { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
            false,
            ["verify"],
          );
        } catch {
          // Ignore malformed key entries.
        }
      }
      jwksCache = { fetchedAt: now, keys: out };
    } catch {
      return null;
    }
  }
  return jwksCache.keys[kid] ?? null;
}

// ── Helpers ─────────────────────────────────────────────────────────────

function base64UrlDecodeToString(input: string): string {
  return new TextDecoder().decode(base64UrlDecode(input));
}

function base64UrlDecode(input: string): Uint8Array {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  const binary = atob(normalized + pad);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}
