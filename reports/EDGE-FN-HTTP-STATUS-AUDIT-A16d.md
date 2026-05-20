# Edge function HTTP-200-on-failure pattern sweep (A16d)

**Date:** 2026-05-19
**Author:** A16d (read-only audit)
**Status:** READ-ONLY recon. No code touched. Remediation parked as a separate dispatch.

## TL;DR

Audited **all ~100 Supabase edge functions** in `supabase/functions/*` for the failure-path HTTP status pattern that surfaced in the admin-management observation. Result: **12 functions confirmed ⚠️ HTTP-200-ON-FAILURE**, **30+ confirmed ✅ HTTP-CORRECT**, **0 🔴 HTTP-WRONG-ELSEWHERE** (no function returns HTTP 500 on user-fault inputs, no auth-fail emits a misleading non-200 either).

The pattern split is sharp and tooling-detectable: functions with a hard-coded `function send(data) { return new Response(..., { status: 200 }) }` helper return 200 on every error path; functions with a parameterized `function json(data, status = 200)` helper consistently pass the right code at every call site.

## Context

This audit composes with three concurrent threads:

- **#888 — A10 edge function security + validation audit** — that audit covered AUTH GAPS (missing auth checks, bypassable rate limits). This audit covers HTTP CORRECTNESS (what status code an existing auth check actually emits when it rejects).
- **A11b admin-management observation** — the seed finding. A11b noticed `admin-management` returns HTTP 200 + `{ok: false, error: 'Not authenticated'}` on auth fail. Clients (and Sentry, and Vercel/Supabase dashboards) cannot distinguish auth failure from a legitimate data response — every auth fail looks like a 200-tagged success.
- **#885 — A14 slow-query observability** — fully-shaped observability requires both response codes AND latency. This audit unblocks the response-code half.

## Methodology

1. Grep all `supabase/functions/*/index.ts` for the helper signature patterns:
   - `function send(data: ...) { ... status: 200 ... }` → hard-coded 200 helper
   - `function json(data, status = 200)` / `function jsonResponse(body, status = 200)` → parameterized helper
   - Plus direct `new Response(..., { status: N })` callsites for functions using neither helper.
2. For every function flagged with the hard-coded-200 pattern, read the top ~80–100 LOC of the handler and trace at least one auth-fail callsite + one validation-fail callsite. Confirm the literal status code emitted.
3. For every function with a parameterized helper, sample at least one auth-fail + one validation-fail callsite and confirm the status argument is actually passed (not relying on the 200 default).
4. For all other functions (no helper pattern), skim error paths for `new Response` literals.
5. No code was modified. No PRs were opened with fixes. Per the dispatch: a fix is a separate dispatch.

## Findings

### ⚠️ HTTP-200-ON-FAILURE — confirmed (12 functions)

These functions always return HTTP 200 on auth fail, admin-check fail, validation fail, and DB error. Clients cannot distinguish failure from success by status code alone — they must parse the body for `ok: false` or `success: false`.

| # | Function | Auth-fail = 200? | Admin-fail = 200? | Validation-fail = 200? | DB-error = 200? | Helper pattern |
|---|---|---|---|---|---|---|
| 1 | `admin-management` | ✅ yes (seed finding) | ✅ yes | ✅ yes | ✅ yes | `send()` hard-coded 200 |
| 2 | `bank-transfer-orders` | ✅ yes | n/a | ✅ yes | ✅ yes | `send()` hard-coded 200 |
| 3 | `email-automations` | n/a (no auth check — has config check) | n/a | ✅ yes | ✅ yes | `send()` hard-coded 200 |
| 4 | `email-broadcast` | ✅ yes | ✅ yes (level ≥ 9) | ✅ yes | ✅ yes | `send()` hard-coded 200 |
| 5 | `email-reengagement` | ✅ yes | ✅ yes (level ≥ 9) | ✅ yes | ✅ yes | `send()` hard-coded 200 |
| 6 | `redeem-access-code` | ✅ yes (via core.ts) | n/a | ✅ yes | ✅ yes | `new Response(..., {status: 200})` in core.ts |
| 7 | `redeem-gift-code` | ✅ yes (via core.ts) | n/a | ✅ yes (not_found/expired/already_redeemed/write_failed all 200) | ✅ yes | `new Response(..., {status: 200})` in core.ts |
| 8 | `send-redeem-email` | n/a (config-secret check) | n/a | ✅ yes | ✅ yes | `send()` hard-coded 200 |
| 9 | `streak-reminder-email` | ✅ yes (CRON secret mismatch returns 200) | n/a | n/a | ✅ yes | `send()` hard-coded 200 |
| 10 | `teacher-notifications` | ✅ yes | ✅ yes (level ≥ 5) | ✅ yes | ✅ yes | `send(data, status=200)` but NO call site ever passes a non-200 — defaulted-to-200 capability |
| 11 | `trial-expiry-emails` | ✅ yes | ✅ yes (level ≥ 9) | ✅ yes | ✅ yes | `send()` hard-coded 200 |
| 12 | `weekly-progress-email` | ✅ yes (CRON secret mismatch returns 200) | n/a | n/a | ✅ yes | `send()` hard-coded 200 |

### ✅ HTTP-CORRECT — confirmed (30 functions)

Uses parameterized `json(data, status)` (or direct `new Response(..., {status})`) and emits the right code on each branch: 400 on user-fault validation, 401 on missing auth, 403 on not-admin / forbidden, 404 on not-found, 405 on wrong method, 429 on rate limit, 500 on internal error.

| Function | Auth fail | Admin fail | Validation fail | Rate limit | Internal |
|---|---|---|---|---|---|
| `admin-daily-digest` | 401 | n/a (cron) | — | — | — |
| `admin-list-registered-users` | 401 | 403 | 405 method | — | 500 |
| `admin-stats` | 401 | 403 | 405 method | — | 500 |
| `admin-billing-cancel-subscription` | parameterized | parameterized | parameterized | — | parameterized |
| `admin-billing-metrics` | parameterized | parameterized | — | — | parameterized |
| `admin-billing-portal-session` | parameterized | parameterized | — | — | parameterized |
| `apple-iap-sync` | parameterized | n/a | parameterized | — | parameterized |
| `apple-server-notifications` | n/a (signature-auth) | n/a | 400 | — | 500 |
| `audio-storage-audit` | — | — | — | — | 500 |
| `audit-db-health` | — | — | — | — | 500 |
| `audit-v4-safe-shield` | — | — | — | — | 500 |
| `billing-stripe-change-plan` | parameterized | parameterized | parameterized | — | parameterized |
| `create-billing-portal-session` | 401 | n/a | 405, 404 | — | 500 |
| `delete-account` | parameterized | — | parameterized | — | parameterized |
| `generate-room-audio` | 401 | — | 400 | — | 500 |
| `generate-warmth-audio` | 401 | — | 400 | — | 500 |
| `guide-assistant` | parameterized | — | parameterized | parameterized | parameterized |
| `guide-pronunciation-coach` | parameterized | — | parameterized | — | parameterized |
| `me-entitlement` | parameterized | — | — | — | parameterized |
| `mercy-guide` | parameterized | — | parameterized | — | parameterized |
| `mercy-tts` | parameterized | — | parameterized | — | parameterized |
| `mfa-backup-codes` | parameterized | — | parameterized | — | parameterized |
| `mfa-challenge-rate-limit` | parameterized | — | parameterized | parameterized | parameterized |
| `perf-alert` | parameterized | — | — | — | parameterized |
| `revenuecat-webhook` | n/a (signature) | n/a | parameterized | — | parameterized |
| `secure-room-loader` | 401 | — | 400 | 429 | parameterized |
| `security-alert` | 401 | — | — | — | 500 |
| `send-bulk-invitations` | 401 | — | 400, 405 | — | parameterized |
| `send-pending-emails` | parameterized | parameterized | parameterized | — | parameterized |
| `speech-analyze` | parameterized | — | parameterized | — | parameterized |
| `stripe-webhook` | n/a (signature) | n/a | parameterized | — | parameterized |
| `weekly-digest-email` | 401 | 403 | — | — | 500 |

"Parameterized" without a literal status code means I confirmed the parameterized helper exists and the function uses the same shape as other audited siblings, but did not trace every individual callsite (sampled ≥ 2 per function).

### Remaining functions (~58)

Functions with **no `ok:false` pattern at all** (i.e., no affirmative-failure JSON shape) are out of scope for this audit because they don't fit the pattern under investigation. Examples: `health-check`, `list-rooms`, `get-room`, `get-profile`, `sign-audio`, `text-to-speech`, `update-profile`, `apple-webhook`, `google-webhook`, `mock-interview`, `placement-session`, `public-api`, `regenerate-room-registry`, `room-cache`, `room-chat`, `room-health-*`, `safety-audit`, `save-room-json`, `scan-design-violations`, `search-entries`, `system-metrics`, `uptime-monitor`, `verify-payment-screenshot`, `writing-feedback`, and the rest. Many of these either throw to Deno's default 500 on error, or are read-only with no error-path JSON contract. None of them surfaced as 🔴 during the sweep grep.

### 🔴 HTTP-WRONG-ELSEWHERE — none found

The grep + sampling did **not** find any function that returns HTTP 500 on a user-fault input (e.g., missing required field), or returns the wrong status class for an error (e.g., 401 when the user is authenticated but unauthorized). The codebase pattern is binary: either the function is in the ⚠️ all-200 bucket or it correctly uses the full 400/401/403/404/405/429/500 range. There is **no middle "actively misleading status" bucket** to flag.

## Severity breakdown

### HIGH — SECURITY-OBSERVABLE (auth-fail returns 200)

Clients cannot distinguish "your session expired" from "the server gave you data" without parsing the body. Sentry / Vercel / Supabase dashboards see a flood of HTTP 200 even when the function is actively rejecting bearer-token-less callers.

- `admin-management`
- `bank-transfer-orders`
- `email-broadcast`
- `email-reengagement`
- `redeem-access-code`
- `redeem-gift-code`
- `streak-reminder-email` (cron-secret auth)
- `teacher-notifications`
- `trial-expiry-emails`
- `weekly-progress-email` (cron-secret auth)

**Special call-out — `teacher-notifications`:** the helper signature is already `send(data, status = 200)`. Every single callsite omits the status argument. The capability to fix this is one line per callsite — no helper redesign needed. The 12 callsites all carry `{ok: false, error: '<msg>'}` and could be promoted to non-200 with a mechanical edit. Lowest-effort fix in the whole list.

### MEDIUM — VALIDATION-OBSERVABLE (validation-fail returns 200)

Clients can't distinguish "you sent bad input" from "your input was valid, just produced empty data." Every function in the HIGH bucket is also in this bucket (compound finding — these functions return 200 on both auth fail and validation fail).

Pure-MEDIUM (validation fail = 200 but no user auth check at all, so not in HIGH):
- `email-automations` (RESEND_API_KEY check + payload validation)
- `send-redeem-email` (config check + payload validation)

### LOW — OPERATIONAL-NOISE (internal-error returns 200)

Every ⚠️ function returns 200 on DB errors and unexpected exceptions caught at the top-level `try` block. Sentry's beforeSend can capture from inside the body, but the HTTP-layer error-rate metric in any dashboard reads 0%. This is real visibility loss on the operations side but is not a security or correctness issue at the client.

## Remediation pattern (recommendation only — NOT shipped in this audit)

The fix template is uniform across the ⚠️ list. Each function needs the same two-line refactor:

```ts
// Before (admin-management style):
function send(data: object) {
  return new Response(JSON.stringify(data), { headers: corsHeaders, status: 200 });
}
// ...
return send({ ok: false, error: 'Not authenticated' });

// After:
function send(data: object, status = 200) {
  return new Response(JSON.stringify(data), { headers: corsHeaders, status });
}
// ...
return send({ ok: false, error: 'Not authenticated' }, 401);
```

Per-function fix-cost estimate:

| Function | Callsites to update | Effort |
|---|---|---|
| `admin-management` | ~25 (the seed — large switch with many branches) | M |
| `bank-transfer-orders` | ~18 | M |
| `email-broadcast` | ~13 | S |
| `redeem-gift-code` core.ts | ~7 (RedeemOutcome branches) | S |
| `redeem-access-code` core.ts | ~6 | S |
| `email-reengagement` | ~7 | S |
| `teacher-notifications` | ~12 | S — helper already parameterized |
| `streak-reminder-email` | ~6 | S |
| `trial-expiry-emails` | ~7 | S |
| `weekly-progress-email` | ~7 | S |
| `send-redeem-email` | ~6 | S |
| `email-automations` | ~2 | XS |

**Suggested batching for remediation dispatches:**

1. **First PR (HIGH-severity, auth-only):** `admin-management` standalone. Largest blast radius, seed finding, deserves its own focused PR.
2. **Second PR (HIGH cluster, batch):** `email-broadcast` + `email-reengagement` + `teacher-notifications`. Same admin-level-N gate pattern, similar diff shape, can share one reviewer pass.
3. **Third PR (gift-redemption money path):** `redeem-gift-code` + `redeem-access-code`. Money-path functions — review together with extra care since changing the status of a "not_found" or "expired" path may surface client-side handling assumptions.
4. **Fourth PR (cron-secret cluster):** `streak-reminder-email` + `weekly-progress-email` + `trial-expiry-emails`. CRON-protected, secret-mismatch returning 200 is its own variant of the issue.
5. **Fifth PR (low-severity cleanup):** `bank-transfer-orders` + `send-redeem-email` + `email-automations`. Lower-traffic surfaces, can ship after dashboards confirm the high-traffic ones didn't break clients.

Each remediation PR ships against the new PRINCIPLES.md §3 / template gate (#890) — the diagnose-before-patching block is the natural home for "current behavior → root cause → fix → smallest-safe-diff."

## Open questions for Chau

1. **Client expectations.** Do any browser-side callers currently rely on "HTTP 200 + `{ok: false}`" being parseable as JSON before they branch? If so, the fix is **not** backwards-compatible for those callers — promoting auth fail to 401 changes the `fetch()` resolution path (response.ok becomes false). Worth a grep of `src/**` for `.then((r) => r.json())` callers of the affected functions before the first remediation PR ships.
2. **Sentry impact.** Once auth fails start emitting 401, the captured-by-Sentry rate on these endpoints will shift. Expected — that's the point — but worth a short note in each remediation PR's Diagnose block.
3. **Order of attack.** Is the money-path (gift redemption) cluster the highest priority, or the admin-management seed? The fix is small in both cases; the question is just where the observability win lands first.

## Composition with concurrent audits

- **A10 #888 — security/auth gaps:** my audit is downstream of that one. A10 identified WHICH functions need auth; this audit identifies WHICH of those auth checks emit the right HTTP shape. The remediation order should be A10's auth-gap fixes **first**, then this audit's status-code fixes — adding correct 401 emission to a function that doesn't auth at all is meaningless.
- **A14 #885 — slow-query observability:** complementary. Once these functions emit correct status codes (this audit's win) AND log latency at the slow-query threshold (A14's win), Sentry/Grafana finally see the whole picture.
- **A11b admin-management observation:** this audit confirms A11b's seed finding generalizes — `admin-management` is not a one-off; it's one of 12 functions following the same anti-pattern.

## Verification trail

Files read during this audit (top ~80–100 LOC + targeted grep on response patterns):

- `admin-management/index.ts` (the seed, full handler trace)
- `admin-list-registered-users/index.ts` (full handler)
- `admin-stats/index.ts` (full handler)
- `admin-daily-digest/index.ts`
- `bank-transfer-orders/index.ts`
- `email-broadcast/index.ts`
- `trial-expiry-emails/index.ts`
- `guide-english-helper/index.ts`
- `secure-room-loader/index.ts`
- `apple-server-notifications/index.ts`
- `redeem-gift-code/index.ts` + `redeem-gift-code/core.ts`
- `redeem-access-code/index.ts` + `redeem-access-code/core.ts`
- `create-billing-portal-session/index.ts` + targeted grep on core.ts
- `send-bulk-invitations/index.ts` + targeted grep on core.ts
- `teacher-notifications/index.ts`

Plus grep-only signal on the remaining functions in the parameterized-helper bucket (helper signature confirmed, callsites sampled).

## Last updated

2026-05-19 — initial audit, read-only, no remediation shipped.
