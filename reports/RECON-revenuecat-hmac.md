# RECON — revenuecat-webhook signature hardening

**Agent:** revenuecat-hmac-agent
**Branch:** `revenuecat-hmac-verify` (off `origin/main` @ `68855a29`)
**Worktree:** `/private/tmp/MercyB-revenuecat-hmac`
**Date:** 2026-05-17
**Scope:** RECON ONLY — no code changes, no PR. Triggered by RECON-stripe-audit.md finding #4 / N3 (HIGH).

---

## 0. TL;DR — the brief's premise is wrong, and that changes Phase 2

> The task brief states: *"RevenueCat provides an HMAC signature on every webhook for exactly this protection — it's just not being verified."*

**This is factually incorrect.** RevenueCat does **not** sign webhooks with an HMAC. Verified against the official docs **and** RevenueCat's own community forum (3 independent confirmations, §3):

- RevenueCat's **only** webhook security mechanism is a configurable **Authorization header shared secret**.
- There is **no** `X-Webhook-Signature` / `X-RevenueCat-Signature` / `X-RevCat-Signature` header. A community thread is literally titled *"Is x-revenuecat-signature removed…"* — any historical signature header has been **removed**; the Authorization header is now the sole mechanism.
- **The function already implements that mechanism correctly** (index.ts:104–119). It is *not* unprotected.

**Consequence:** "Add HMAC signature verification" **cannot be implemented as specified** — there is no signature to verify. Rolling our own HMAC against a header RevenueCat never sends would be security theatre (false confidence, zero added protection) and risks breaking the live webhook. Per CLAUDE.md operating discipline: *"Don't solve uncertainty with more code… Get evidence first."*

**The audit finding is still partially valid** — but the *remediation* is different (§5). The real, implementable hardening is:
1. Make the existing token comparison **constant-time** (it currently uses `!==`, a timing side-channel — index.ts:116). This satisfies the brief's actual security intent and its "constant-time comparison required" ground rule.
2. Optional token-rotation support (accept N tokens, mirrors `stripe-signature.ts parseWebhookSecrets`).
3. Rotate the shared token (manual, Chau).

**Phase 2 needs re-scoping approval before any code** (locked #4 + scope deviation). Recommendation in §6.

---

## 1. Current function source summary

`supabase/functions/revenuecat-webhook/index.ts` (333 lines, single file; `deno.json` only imports `@supabase/functions-js`).

Flow:

| Step | Lines | Behaviour |
|------|-------|-----------|
| Method guard | 91–96 | OPTIONS→ok; non-POST→405 |
| Kill switch | 98–102 | `REVENUECAT_WEBHOOK_DISABLED==="true"` → 200 no-op |
| **Auth** | **104–119** | Reads `REVENUECAT_WEBHOOK_AUTH_TOKEN`; if unset→500. Reads `Authorization` header, strips optional `Bearer ` prefix, compares with **`bearerToken !== expectedToken`** (plain string `!==`). Mismatch→401. |
| Parse | 121–131 | `await req.json()` (no raw-body capture); bad JSON→400; missing `event`→400 |
| User resolve | 133–145 | `app_user_id`/`original_app_user_id`; non-UUID (incl. `$RCAnonymousID:…`) → 200 skipped |
| Service client | 147–156 | `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` |
| Orphan guard | 158–172 | Unknown `profiles.id` → 200 skipped (stops retry storm) |
| Dispatch | 174–326 | `INITIAL_PURCHASE/RENEWAL/PRODUCT_CHANGE/NON_RENEWING_PURCHASE` → upsert `subscriptions` active + `profiles` premium; `CANCELLATION`→`cancel_at_period_end`; `EXPIRATION/REFUND`→end sub + downgrade if no other active; `BILLING_ISSUE`→`past_due`; else→ignored 200 |

**Confirmed: no HMAC verification anywhere.** The only authentication is the shared-token equality check at line 116. This matches the audit's accurate observation ("only a shared bearer token, NO HMAC"). The audit's *added* claim — "RevenueCat supports HMAC-SHA256" (RECON-stripe-audit.md:159) — was an **unverified assumption**; this recon corrects it.

---

## 2. Secret storage location (locked #5 — verified, no code written)

| Env var | Where | Status |
|---------|-------|--------|
| `REVENUECAT_WEBHOOK_AUTH_TOKEN` | Supabase Edge **secrets** (server-only, never `VITE_`-prefixed) | **Already documented + in use.** README.md:83, README.md:101 (`npx supabase secrets set REVENUECAT_WEBHOOK_AUTH_TOKEN=…`), `.env.example:35–49`. Mirrored value lives in *RevenueCat Dashboard → Integrations → Webhook → Authorization header*. |
| `REVENUECAT_WEBHOOK_DISABLED` | Supabase Edge secrets | Optional kill switch (README.md:84/113). |
| `VITE_REVENUECAT_APPLE_API_KEY` | Client iOS bundle | Unrelated (SDK public key, `src/lib/iap.ts:67`). Not a webhook secret. |

- **No new secret is needed.** There is no "`REVENUECAT_WEBHOOK_SECRET`" anywhere (not configured-but-unused; it simply does not exist and is not needed — there is no HMAC). The existing `REVENUECAT_WEBHOOK_AUTH_TOKEN` is the one and only relevant secret and it is already wired (read at index.ts:105).
- **No `[functions.revenuecat-webhook]` block in `supabase/config.toml`.** Open question for Chau (not blocking, not this agent's scope): the function authenticates via a custom Authorization token, so it must be reachable without a Supabase JWT — confirm it was deployed `--no-verify-jwt` (or the platform gateway lets the custom header through). If `verify_jwt` were enforced, RevenueCat (which sends the shared token, not a Supabase JWT) would be 401'd at the gateway and the webhook would already be dead — so in practice it is effectively public-with-token. Worth a one-line confirmation, unrelated to the HMAC question.

---

## 3. RevenueCat's actual webhook security mechanism (evidence)

| Source | Finding |
|--------|---------|
| `revenuecat.com/docs/integrations/webhooks` | *"You can configure the authorization header used for webhook requests via the dashboard. Your server should verify the validity of the authorization header for every notification."* No HMAC, no signature header. |
| `revenuecat.com/docs/webhooks` | *"(Optional) Set authorization header that will be sent with each POST request."* Authorization header shared secret only. |
| RevenueCat Community (web search) | Multiple threads: *"Is x-revenuecat-signature removed, and where is webhook secret key?"*, *"X-RevCat-Signature not being received"*, *"How to secure RevenueCat webhooks with an api-key?"* — consensus: signature header **removed/never GA**; Authorization header is the only supported mechanism; transport security is HTTPS to `revenuecat.com`. |

- **Signature header:** none exists.
- **HMAC algorithm:** N/A — RevenueCat does not HMAC the payload.
- **Signing payload:** N/A.
- **Secret:** the configurable Authorization-header value = our `REVENUECAT_WEBHOOK_AUTH_TOKEN`. Already implemented.

There is a working, identical-shape HMAC reference in-repo (`supabase/functions/stripe-webhook/stripe-signature.ts`: `timingSafeEqual` :5–11, `computeHmacSha256` via Web Crypto `crypto.subtle` :52–76, `hexToBytes` :13–26). It is **correct for Stripe** (Stripe genuinely sends `Stripe-Signature`) and is the right *pattern* to reuse for the constant-time comparison in §5 — but its HMAC-of-payload logic is **not applicable to RevenueCat**.

---

## 4. Residual risk — is the audit finding still real?

Partially. Severity is **lower than the audit's HIGH**, because the premise ("HMAC exists, just unverified") is false — the function is *not* missing its intended protection; it implements RevenueCat's only mechanism.

What **is** real:

- **R1 — Non-constant-time token compare (index.ts:116, `!==`).** Theoretical timing side-channel on a high-entropy bearer token over jittered network — low practical exploitability, but the brief explicitly mandates constant-time comparison and we have a clean in-repo primitive. Cheap to fix; right thing to do. **This is the implementable core of Phase 2.**
- **R2 — Single static token, no rotation affordance.** If the token leaks (logs, env dump), the audit's "forge arbitrary `INITIAL_PURCHASE`" scenario is real until rotated. Mitigation is *rotation* (manual) + optionally accepting a comma/newline-separated token set so rotation has zero downtime (mirror `parseWebhookSecrets`).
- **R3 — Blast radius is already bounded** (good): non-UUID/anonymous IDs skipped (142–145), unknown-profile skipped (169–172) — a forger can only grant premium to a `profiles.id` that already exists, not invent users.
- **R4 (out of scope, pointer only):** the deeper money-loss primitive the audit flagged is **N1** (`payment_transactions` INSERT RLS `WITH CHECK (true)` + tier-sync trigger + untraced `me-entitlement` tier source), not this webhook. A forged RevenueCat event writes `subscriptions`/`profiles` via service role; the self-serve escalation primitive is the `payment_transactions` RLS hole. Flagging so this PR is not mistaken for closing N1.

---

## 5. Implementation plan (corrected — NOT HMAC)

> Phase 2 only, **after re-scoping approval** (§6). Documented here so the plan is reviewable now.

**Do NOT:** add an HMAC verifier, capture raw body before JSON parse (only needed for payload-HMAC schemes — irrelevant here), introduce `REVENUECAT_WEBHOOK_SECRET`, or roll any crypto.

**Do:** harden the existing Authorization-token check.

New file `supabase/functions/revenuecat-webhook/auth.ts`:

```ts
// timingSafeEqual: byte-wise, length-leak-free — copy the proven shape
// from stripe-webhook/stripe-signature.ts:5-11 (do NOT re-roll).
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean { … }

export function parseTokens(raw: string): string[] {
  return String(raw || "").split(/[\n,]+/g).map(t => t.trim()).filter(Boolean);
}

/** true iff `presented` constant-time-matches ANY configured token. */
export function isAuthorized(presented: string, configured: string[]): boolean {
  const enc = new TextEncoder();
  const p = enc.encode(presented);
  let ok = false;
  for (const c of configured) ok = timingSafeEqual(p, enc.encode(c)) || ok; // no early return
  return ok;
}
```

`index.ts` change (≈ lines 105–119, ~6 lines net):

```ts
const configured = parseTokens(Deno.env.get("REVENUECAT_WEBHOOK_AUTH_TOKEN") ?? "");
if (configured.length === 0) {
  console.error("[revenuecat-webhook] REVENUECAT_WEBHOOK_AUTH_TOKEN not set");
  return json({ error: "Webhook not configured" }, 500);
}
const authHeader = (req.headers.get("Authorization") ?? "").trim();
const presented = authHeader.startsWith("Bearer ")
  ? authHeader.slice(7).trim()
  : authHeader;
if (!isAuthorized(presented, configured)) {
  console.warn("[revenuecat-webhook] unauthorized");   // no token in logs
  return json({ error: "Unauthorized" }, 401);
}
```

Properties: constant-time (R1 closed); multi-token enables zero-downtime rotation (R2 mitigated); backward compatible (single token still works); no new secret; no crypto authored; smallest safe diff (CLAUDE.md). Header-name handling unchanged (`Authorization`, optional `Bearer`).

---

## 6. Manual steps for Chau

**Decision required first (Phase 2 is blocked on this):**
- The briefed task ("add HMAC verification") is **not possible** — RevenueCat sends no signature. Choose the corrected scope:
  - **(A) Recommended:** ship the constant-time token-compare + rotation hardening above (small, safe, real, satisfies the brief's intent + its constant-time ground rule).
  - **(B)** Close the finding as "already mitigated" (function implements RevenueCat's only mechanism) and do nothing in code.
  - **(C)** Defer; redirect effort to **N1** (the actual money-loss primitive — different agent/scope).

**If (A) approved — operational steps (no redeploy-blocking dependency):**
1. **Rotate the token** (addresses R2 / audit intent): generate a new high-entropy value, then
   `npx supabase secrets set REVENUECAT_WEBHOOK_AUTH_TOKEN="<new>,<old>"` (comma keeps the old valid during cutover), update *RevenueCat Dashboard → Integrations → Webhook → Authorization header* to `<new>`, confirm deliveries succeed, then re-set the secret to just `<new>`.
2. **No RevenueCat dashboard "webhook secret" exists** to configure — do not look for one; the Authorization header value *is* the secret.
3. (Optional, tangential) Confirm the function is deployed `--no-verify-jwt` (§2 open question).

---

## 7. Test plan (Phase 2)

Pure unit tests on `auth.ts` (no network, no Supabase) — Deno test, mirrors `_billing/__tests__` / `stripe-signature` style:

| Case | Expect |
|------|--------|
| Correct token, no `Bearer ` prefix | authorized |
| Correct token, `Bearer ` prefix | authorized |
| Wrong token (same length) | rejected (exercises constant-time path) |
| Wrong token (different length) | rejected, no length-based early exit |
| Empty presented vs configured | rejected |
| Multi-token set, presented = 2nd | authorized (rotation window) |
| Multi-token set, presented = none | rejected |
| Empty configured (`""`) | `parseTokens`→`[]` → handler returns 500 (covered via small handler-level test or asserted on `parseTokens`) |
| `timingSafeEqual` equal/unequal/diff-length | true / false / false |

Addresses RECON-stripe-audit.md §6 row *"Webhook signature verification … ❌"* for this function. Idempotency/refund/cancel coverage for revenuecat-webhook remains separate debt (not in this PR's scope; note in PR body).

---

## 8. Notes / limits

- No code modified. No PR opened. Phase 1 recon only.
- Premise correction (§0, §3) is the headline — verified 3 ways (2 doc pages + community forum). Recorded so Phase 2 is not implemented against a non-existent header.
- `stripe-signature.ts` is the constant-time *primitive* source; its payload-HMAC logic is deliberately **not** carried over.
- Branch is fresh off `origin/main@68855a29` (preflight: no prior `revenuecat`/`hmac` commits or branches; isolated worktree to avoid fleet collision).
- Standard gates (`typecheck:ci`, `lint`, `vitest`) not run in recon (no code changed); they gate the Phase 2 PR.
