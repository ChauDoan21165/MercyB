# Anonymous Edge Function Audit (A11c Phase 2)

> Read-only reconnaissance of MercyBlade edge functions to identify the
> TRUE anonymous-callable surface. Triggered by the A11c dispatch's
> hypothesis that the speak-tab backend / contact forms / onboarding
> first-POST might be unauthenticated. Output: classified inventory +
> dispatch recommendations.
>
> **Verdict (TL;DR):** There is **no genuinely-anonymous unauthenticated**
> surface in this codebase that would benefit from zod-defense-as-first-
> line. Every `verify_jwt=false` function implements its own auth gate
> (JWT validation, admin token, signed-token, or service-role key). The
> two truly-no-auth functions (`health-check`, `uptime-monitor`) take
> NO input and have zero abuse surface.

---

## Methodology

1. **Platform-level audit:** parsed `supabase/config.toml` for every
   `verify_jwt = false` declaration. Found **13** explicit settings.
2. **Function-level audit:** read the top 40-60 LOC of each
   `verify_jwt = false` function to verify whether it implements its
   own auth layer (the A10 audit's #5 finding: "platform default is
   `true` for the 66 functions without explicit settings; drift-risk
   if Supabase ever changes the default" is structural, not a leak).
3. **Speak-tab investigation:** traced the dispatch's hypothesis that
   the landing-page "Thử phát âm — không cần đăng nhập" CTA might hit
   an anonymous endpoint. Found azure-phoneme (the likely backend)
   uses Supabase JWT validation via `_shared/security.ts:getUserFromAuthHeader`
   plus IP rate-limiting via `_shared/ipRateLimit.ts`.
4. **No production probes; no code modified.**

---

## The 13 `verify_jwt = false` functions — classified

Format: **Surface · Validation depth · Risk class**

### Tier 1 — Auth-gated despite `verify_jwt=false` (10 functions)

These set `verify_jwt=false` at the platform level so they can manage
their own auth. Every one implements a function-level gate.

| Function | Function-level gate | Input | Risk |
|---|---|---|---|
| `bank-transfer-orders` | `Authorization: Bearer` JWT validated via anon-key client | order create/list/attach-screenshot | money-path, but auth-gated → **LOW** |
| `redeem-gift-code` | Same: bearer-JWT user check | gift code string | money-path, auth-gated → **LOW** |
| `generate-room-audio` | `mb-admin-token` header secret | slug/kind/language/text/filename | LLM cost, admin-gated → **LOW** |
| `generate-warmth-audio` | `mb-admin-token` header secret | category/language/text/filename | LLM cost, admin-gated → **LOW** |
| `security-alert` | `x-alert-secret` header secret | incident type/severity/description | telemetry, secret-gated → **LOW** |
| `send-redeem-email` | SERVICE_ROLE_KEY presented in header (A9 open-relay fix from 2026-05-18) | email + tier | email-spam vector, service-role-gated → **LOW** |
| `email-broadcast` | Admin level ≥ 9 check (per file comment) | broadcast subject/body/audience | email-spam vector, admin-gated → **LOW** |
| `email-automations` | Cron-callable; needs verification of its auth (peek shows imports — full gate inspection deferred) | automation triggers | timed automation, likely cron-gated → **LOW pending verify** |
| `send-pending-emails` | Needs verification (peek shows imports — full inspection deferred) | email queue processor | email-spam vector → **PARTIAL pending verify** |
| `stripe-webhook` | HMAC signature verification (already covered by A11 #893) | Stripe Event payload | money-path, signature-gated → **LOW** (zod already added) |

### Tier 2 — Token-as-credential (1 function, designed-public)

| Function | Gate | Notes |
|---|---|---|
| `email-unsubscribe` | Opaque per-user token in URL IS the credential (RFC 8058 one-click) | Documented in file header. The token validates the user without requiring a JWT — mail clients POST it directly. State-changing only on POST; GET/HEAD redirects to the human page. Already PII-aware (never leaks whether token matched). **LOW.** |

### Tier 3 — Genuinely no auth (2 functions, designed-public health endpoints)

| Function | Input | Downstream | Risk |
|---|---|---|---|
| `health-check` | NONE (returns static JSON `{status:ok, timestamp, service}`) | None | **ZERO** — no body parsed, no DB read, no abuse surface |
| `uptime-monitor` | NONE (no body parsed) | Performs HEAD request to `mercyblade.link`, writes a row to a stats table | **LOW** — no caller-supplied input; could DoS via flood, but rate-limited at infra level (Cloudflare / Supabase) |

**Neither tier-3 function has a request-body parsing surface.** Zod has nothing to validate there.

---

## The Speak-tab investigation

Dispatch hypothesis: the landing-page "Thử phát âm — không cần đăng nhập" CTA hits an anonymous-callable LLM endpoint.

**Findings:**
- The Speak-tab backend is most likely `azure-phoneme` (Azure Pronunciation Assessment) or `azure-phoneme-stream`.
- Neither has an entry in `supabase/config.toml` → both use Supabase's platform default `verify_jwt = true`.
- `azure-phoneme/index.ts:18-29` imports `getUserFromAuthHeader` from `_shared/security.ts`, `rateLimit` from `_shared/rateLimit.ts`, and `checkIpRateLimit` from `_shared/ipRateLimit.ts`. The handler validates JWT + applies user-AND-IP rate limits before any Azure call.
- **The "không cần đăng nhập" landing CTA is therefore one of:**
  - (a) Marketing copy that converts → sign-up form before the actual Speak call (most likely)
  - (b) Uses Supabase's anon-key JWT (the public anon key shipped in the SPA bundle), which bypasses login but still goes through `verify_jwt=true` as `anon` role
  - (c) A separate code path not visible from index.ts grep

I could not verify (a)/(b)/(c) without UI evidence. **Recommend: confirm with Chau or a real-device probe before treating this as anonymous.**

---

## Other candidates the dispatch named

| Candidate | Findings |
|---|---|
| `send-bulk-invitations` | Has `__tests__` dir — likely service-role-gated, would need a 5-min read. Not in my A11c scope. |
| Contact / waitlist form | No `[functions.contact]` or `[functions.waitlist]` in config.toml. No corresponding folder in `supabase/functions/`. **Doesn't exist as an edge function** — likely a Resend / Vercel form handler or a `profiles`-insert via anon-key from the SPA. |
| `/onboarding` first POST | The first-POST in onboarding is the Supabase Auth signup, which is a built-in Supabase endpoint (not an edge function we control). Zod-validation there is not in MercyBlade-code scope. |

---

## Risk matrix summary

| Tier | Functions | Surface type | Already protected by | A11c zod value |
|---|---|---|---|---|
| 1 | 10 | Forms + AI + email + payment | Function-level auth (JWT / admin-token / signed-token / service-role) + rate limits | Marginal — zod adds typed safety + drift observability, but auth gate is the load-bearing defense |
| 2 | 1 (email-unsubscribe) | Designed-public state change | Opaque per-user token | Marginal — token validation is the gate; zod could shape-check the token format but the existing code is already explicit |
| 3 | 2 (health, uptime) | Static health endpoints | None needed (no input, no downstream cost) | **Zero** — no body to validate |
| platform-default `true` (≈66 fns) | various | Various | Supabase JWT (anon or authenticated role) | Each function individually decides what zod adds; speak-tab + ai-chat would be next-most-valuable targets |

---

## Recommendations

### Option A — Stand down on the "anon surface" hypothesis

The dispatch's premise that the codebase has high-risk anonymous-callable surfaces with no validation does not hold. Every `verify_jwt=false` function implements its own gate. The two truly-no-auth functions are designed-public health endpoints with no input.

**This is the recommendation.** Marking the A11c track complete with PR #924 (l1-detect) as the sole shipping deliverable.

### Option B — Tier 1 "auth-gated despite verify_jwt=false" zod follow-ups

For the 10 Tier-1 functions, zod adds:
- Typed downstream access (eliminate `as` casts)
- Sentry observability on schema drift
- Wrong-type protection (current defensive code silently coerces)

But the marginal defense value is small — auth gates already block the worst class of caller. Worth doing ONLY if there's appetite for the typed-safety + observability benefits, not for security.

**Suggested dispatch:** `A11d` if Chau wants it. Targets in order of risk:
1. `bank-transfer-orders` (money path)
2. `redeem-gift-code` (money path; A11-style validation similar to admin-set-tier)
3. `email-broadcast` (admin email blast — input drives recipient cohort selection)
4. `security-alert` (telemetry input)

### Option C — Speak-tab clarification → potential A11d

If the "không cần đăng nhập" CTA actually does hit azure-phoneme with the anon-key JWT, then anyone with the bundled JS can call it without signing up. That IS an anonymous-callable LLM surface in practice (even though `verify_jwt=true` is set). Worth understanding before deciding.

**Suggested next action (Chau):** confirm whether the landing-page Speak CTA requires a real signup or uses the anon-key. If anon-key, then azure-phoneme zod-hardening is high-value.

### Option D — Re-frame to the platform-default `verify_jwt=true` long tail

The A10 audit's finding #5 ("66 functions without explicit verify_jwt setting; relies on platform default") is the real structural concern. If Supabase ever flips its default, those 66 functions silently become open. The fix is a config hygiene track (make every function explicit), not a zod track. Already enumerated in the A10 report's recommended sequence step 6 (`chore(config): make verify_jwt explicit on all 74 default-true fns`).

---

## What I did NOT do

- No code modified
- No SQL run
- No production probes
- No real-device verification of the Speak-tab CTA
- Did not exhaustively read each function's full auth code (top-40-LOC peek was sufficient to classify; deep verification deferred to per-function PRs)

---

## Status

Operator artifact per B16 convention. The audit is the deliverable — no PR needed unless Chau wants the report committed to `reports/` on main as a record. Recommend filing on the A11c PR's branch if it stays open, or as a standalone docs PR if A11c #924 ships first.
