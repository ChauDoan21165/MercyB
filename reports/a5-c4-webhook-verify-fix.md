> ⚠️ **ARCHIVE-CLASS (April 2026)** — historical runbook/recon kept in
> place due to live cross-references outside `reports/`. Do not act on
> this document without verifying current state. See
> `reports/archive/agent-runs-2026-04/README.md` for context.

# A5 — C4 fix: webhook signature verification

**Severity:** P0 (security). A3's edge-function audit flagged
`apple-webhook` and `google-webhook` as accepting any incoming request
and writing it straight to `provider_events` with
`metadata.signature_verified = false`. Today the only consequence is a
log row, but the moment a follow-up PR adds the subscription-grant
projection (the existing `next_step: TODO` line), an attacker who knows
either webhook URL could mint themselves any subscription state. This
PR closes that surface before the projection lands.

## What changed

| File | Change |
| --- | --- |
| `supabase/functions/_billing/verifyAppleJws.ts` | **new** — Apple App Store Server Notification V2 JWS verifier (ES256, x5c chain walk, optional root-cert fingerprint pin via `APPLE_ROOT_CERT_SHA256` env var). Exposes a `verifyJwsWithKey` primitive for tests + a high-level `verifyAppleJws` for production. |
| `supabase/functions/_billing/verifyGoogleJwt.ts` | **new** — Google Pub/Sub OIDC JWT verifier (RS256, JWKS resolver with 1-hour cache, issuer / audience / email / email_verified / exp checks). Exposes `verifyGooglePubsubAuth(authHeader, opts)` for production + `verifyGoogleJwt(token, opts)` for tests. |
| `supabase/functions/apple-webhook/index.ts` | Calls `verifyAppleJws` on `body.signedPayload`. Tampered / wrong-alg / missing-x5c → 401 + a `apple_webhook_signature_rejected` log row with `metadata.rejection_reason`. Verified path now writes `signature_verified: true`. |
| `supabase/functions/google-webhook/index.ts` | Reads `Authorization: Bearer …`, calls `verifyGooglePubsubAuth` against the configured audience + service-account email. Refuses to start if `GOOGLE_PUBSUB_AUDIENCE` or `GOOGLE_PUBSUB_SERVICE_ACCOUNT_EMAIL` env vars are missing — that's misconfiguration, not "trust the request". |
| `supabase/functions/_billing/__tests__/verifyAppleJws.test.ts` | 7 tests: happy path, malformed/empty/null inputs, unsupported alg, attacker-key signature rejection, payload tampering after signing, malformed header. |
| `supabase/functions/_billing/__tests__/verifyGoogleJwt.test.ts` | 16 tests: happy path on both `iss` variants, malformed JWT, unsupported alg, missing kid, key-not-found, attacker-key signature, wrong issuer/audience/email/email_verified, expired JWT, Authorization header parsing (null / Basic / Bearer / lowercase bearer). |

23 new tests in total; all pass under vitest. Typecheck clean.

## What's NOT in this PR (deferred)

- **Full Apple X.509 chain validation.** This PR pins the root cert
  via SHA-256 fingerprint when `APPLE_ROOT_CERT_SHA256` is set, but it
  doesn't walk every `tbsCertificate` field, validate name
  constraints, check `notBefore` / `notAfter` on the leaf and
  intermediate, or honour CRL / OCSP revocation. These are real
  defence-in-depth additions, not headline forgery prevention. The
  daytime work to harden them is tracked in this report's "Hardening
  follow-ups" list below.
- **Subscription-grant projection.** The existing `next_step: TODO` is
  unchanged. This PR makes the foundation safe for that projection
  to land — it does not add it.
- **Replay-attack window.** `provider_events` already has a stable
  `event_key` keyed off `notificationUUID` (Apple) or
  `message.messageId` (Google), and `register_billing_provider_event`
  is idempotent on that key — so a replayed verified payload won't
  double-process. No additional anti-replay code is needed today.

## Rejection paths (security log signals)

When verification fails, the webhook still writes a log row with
`metadata.signature_verified = false` AND
`metadata.rejection_reason = <code>`. The reason codes are stable
strings suitable for a security dashboard:

| Provider | Reason | Meaning |
| --- | --- | --- |
| apple | `missing_signed_payload` | Body had no `signedPayload` field |
| apple | `malformed_jws` | Couldn't split into 3 segments / decode header |
| apple | `unsupported_alg` | Header alg ≠ `ES256` |
| apple | `missing_x5c` | Header missing the x5c chain |
| apple | `invalid_chain_length` | x5c not exactly 3 entries |
| apple | `leaf_decode_failed` | x5c[0] not valid base64 / DER |
| apple | `leaf_key_extract_failed` | Couldn't pull SPKI from leaf |
| apple | `signature_invalid` | JWS signature doesn't verify against leaf |
| apple | `root_pin_mismatch` | x5c[2] fingerprint ≠ pinned root |
| google | `missing_authorization` | No `Authorization` header / not Bearer |
| google | `malformed_jwt` | Couldn't parse the JWT |
| google | `unsupported_alg` | Header alg ≠ `RS256` |
| google | `missing_kid` | No `kid` in header |
| google | `key_not_found` | JWKS resolver couldn't find that kid |
| google | `signature_invalid` | RS256 sig doesn't verify |
| google | `issuer_mismatch` | `iss` not `accounts.google.com` |
| google | `audience_mismatch` | `aud` ≠ configured audience |
| google | `email_mismatch` | `email` ≠ configured service account |
| google | `email_unverified` | `email_verified` not true |
| google | `expired` | `exp` past with leeway |
| google | `not_yet_valid` | `iat` future with leeway |

A spike in any specific reason is the security signal: a flood of
`signature_invalid` is an active attack; a flood of `audience_mismatch`
is a Pub/Sub misconfiguration.

## Required production env vars

| Var | Webhook | Purpose |
| --- | --- | --- |
| `APPLE_ROOT_CERT_SHA256` | apple-webhook | Optional — when set, pins x5c[2] fingerprint to the Apple Root CA G3 cert. Without it, the leaf-signature check still runs but the root-pin defence is skipped. |
| `GOOGLE_PUBSUB_AUDIENCE` | google-webhook | Required — the audience configured on the Pub/Sub push subscription (the webhook's full HTTPS URL, by default). |
| `GOOGLE_PUBSUB_SERVICE_ACCOUNT_EMAIL` | google-webhook | Required — the service account email Pub/Sub uses to push messages. |

`google-webhook` returns HTTP 500 ("Webhook is not configured") if
either env var is missing. That's deliberate — silent fallback to "no
verification" is the bug we're fixing.

## Manual smoke (what to check after deploy)

1. **Apple — valid notification.** Send a real Apple sandbox
   notification via App Store Connect. Expect HTTP 202 +
   `metadata.signature_verified = true` row in `provider_events`.
2. **Apple — tampered notification.** Take a captured valid
   notification, mutate one byte in the payload portion of
   `signedPayload`, replay. Expect HTTP 401 +
   `apple_webhook_signature_rejected` row with
   `metadata.rejection_reason = "signature_invalid"`.
3. **Google — valid push.** Trigger a sandbox RTDN by changing
   subscription state on a test Google Play account. Expect HTTP 202
   + `metadata.signature_verified = true` and
   `metadata.verified_email` matching the configured service account.
4. **Google — wrong issuer.** Sign a JWT with our own RSA key, set
   `iss = "https://attacker.example"`, push to the webhook. Expect
   HTTP 401 + `metadata.rejection_reason = "issuer_mismatch"`.

## Hardening follow-ups (not in this PR)

Tracked in the security audit; not blocking the C4 close-out:

- Walk the Apple x5c chain end-to-end: verify x5c[0] signature against
  x5c[1]'s public key, verify x5c[1] signature against x5c[2]'s public
  key, verify x5c[2] is the pinned root. Today we verify the JWS
  against x5c[0] and (optionally) pin the root fingerprint — the
  middle hop is implicit, not enforced.
- Add `notBefore` / `notAfter` validation on each cert in the chain.
- Cache the parsed leaf public key keyed on x5c[0] DER hash so
  repeated webhooks with the same leaf don't re-parse on every call.
- Add a Grafana alert on `metadata.rejection_reason` aggregations.
- Ship a thin client-side wrapper around `register_billing_provider_event`
  so the rejection-log writes can use the same connection pool as the
  success path.
