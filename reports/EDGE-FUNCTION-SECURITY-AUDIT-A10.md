# EDGE FUNCTION SECURITY + VALIDATION AUDIT (A10)

> **Agent**: A10 · **Date**: 2026-05-20 · **Convention**: B16 (recon, commit-don't-PR)
> **Scope**: All 105 edge functions in `supabase/functions/` (excluding `_shared` and `_billing`).
> **Status**: read-only reconnaissance. **No production code touched.**
>
> **Dispatch note**: the original dispatch ended mid-sentence at `Structure:`. The report structure below was chosen to match the dispatch's stated criteria (classification / auth posture / payload validation / error handling / risk 1–5) without inventing scope.

---

## 0. Executive summary

| # | Finding | Impact |
|---|---|---|
| **1** | **`admin-billing-metrics` is the only ⚠️ CRITICAL** — no auth gate, no admin role check, but uses `service_role` to bypass RLS and returns full MRR / subscription / entitlement-event data. Any authenticated user can pull it. | **P0 — data exposure** |
| **2** | **Zod adoption is 4/105 (~4%)** — `get-room`, `list-rooms`, `secure-room-loader`, plus the helper `shared/validation.ts`. The other 101 functions rely on TypeScript interfaces (compile-time only) or no validation at all. A11's named work on apple/google/stripe webhooks reaches 3 more; the long tail is 98+. | **systemic gap** |
| **3** | **Sentry integration is 16/105 (~15%)** — 13 via `wrapHandler`, 3 via direct `captureEdgeError`. The other 89 functions throw without observability. When stripe-webhook PR2 (#877) lands, that's 1 more (writer-side, via #864). Everything else is dark. | **observability gap** |
| **4** | **`verify_jwt` config coverage is 38/105 (~36%)** — 12 explicit `false` (webhooks, intentional), 19 explicit `true`. The 74 functions with no explicit setting default to `verify_jwt = true` (Supabase platform behavior). Per-function audit recommended before any platform-default change. | **inventory gap** |
| **5** | **9 money-path / webhook functions** have no recognizable auth pattern in their main file. Most likely use signature-verification (Apple JWS, Stripe sig, Google receipt verify) or downstream auth via `core.ts` — my pattern detection did not catch these. **Manual validation required** before treating as P0. The list and verify steps are in §4. | **needs eyes** |
| **6** | **24/105 functions have admin-role checks**. 12/15 named `admin-*` functions check via `user_roles` or `admin_users` table. Three `admin-*` functions don't: `admin-billing-metrics` (P0 above), `admin-daily-digest` (✓ legit — cron secret), `admin-security-health` (✓ legit — admin-secret header OR JWT). | **mostly ok** |

**Headline**: one CRITICAL (admin-billing-metrics), nine HIGH that need a human to confirm whether their auth lives in a place my grep missed (webhooks + a few money paths), and a long tail of structural-but-not-immediate gaps (zod, Sentry, config). A11's named work on apple/google/stripe is the right starting wedge; the residual 95+ functions deserve their own staged hardening dispatch.

---

## 1. Methodology

For each of 105 edge functions I collected six binary signals + one numeric:

| Signal | Pattern detected | Source |
|---|---|---|
| `jwt` | `auth.getUser` / `getUser(` invocation | grep across all `*.ts` files in the function dir |
| `svc` | `SERVICE_ROLE_KEY` / `service_role` / `serviceRole` | "" |
| `zod` | `from .*zod` import | "" |
| `wrap` | `wrapHandler` from `_shared/sentry.ts` | "" |
| `cap` | direct `captureEdgeError` call | "" |
| `admin` | `user_roles` / `admin_users` table query OR `is_admin` / `get_admin_level` / `admin_level` RPC OR `requireAdmin` / `require_admin` helper | "" |
| `secret` | header-secret auth (`CRON_SECRET` / `ADMIN_SECRET` / `x-*-secret` / `WEBHOOK_SECRET` / `STRIPE_WEBHOOK_SECRET`) | "" |
| `jwtcfg` | explicit `verify_jwt = true/false` OR `default` (= true per Supabase platform behavior) | `supabase/config.toml` parse |
| `loc` | line count of main file (`index.ts` / `handler.ts` / `core.ts` / first `.ts`) | `wc -l` |

**Risk score** is heuristic — derived from signal combinations, *not* from line-by-line reads. The risk-5 finding (admin-billing-metrics) WAS manually verified by reading the file; the risk-4 entries are auto-rated and need spot-reading before action. See §4 for the verification protocol.

**What this audit did NOT do**:
- Read 105 files end-to-end (would have multiplied dispatch cost ~10×).
- Run any function or attempt any auth bypass — pure static analysis.
- Audit `_shared` / `_billing` directories (explicit dispatch exclusion).
- Audit Deno deps for CVEs (orthogonal).
- Audit RLS policies on tables the functions read/write (overlapping with A18 + B48 work).

---

## 2. The one CRITICAL finding — `admin-billing-metrics`

### What it does

```ts
// supabase/functions/admin-billing-metrics/index.ts (372 LOC)
// (no auth check)
const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {…});
// pulls:
//   - billing_mrr_inputs_v           (MRR aggregate)
//   - subscriptions                  (all user subscriptions)
//   - billing_recent_subscription_changes_v  (churn/upgrade signals)
//   - entitlement_events             (60 days of provider events)
// returns JSON to the caller
```

### Why it's CRITICAL

| Dimension | State | Reading |
|---|---|---|
| JWT verification | Missing in function body. Defaults to platform `verify_jwt = true` (no explicit config entry). | Any *authenticated user* (any tier, including free) can call it. |
| Admin role check | **None.** No query to `user_roles` / `admin_users`, no `get_admin_level` RPC. | Tier-0 free users have the same access as ops. |
| Service-role bypass | **Yes** — `createClient(url, serviceRoleKey)`. | RLS does not protect the four tables/views read. |
| Output | Full billing facts. | A competitor (or a curious user) can observe MRR, churn, individual subscription IDs/providers. |

### Fix shape (not done here — recon only)

Two-line gate at top of handler:

```ts
// 1. JWT verify
const { data: { user } } = await anonClient.auth.getUser();
if (!user) return json({ error: "Unauthorized" }, 401);

// 2. Admin role check (match admin-list-users:41 pattern)
const { data: adminRole } = await adminClient
  .from("user_roles").select("role")
  .eq("user_id", user.id).eq("role", "admin").maybeSingle();
if (!adminRole) return json({ error: "Admin access required" }, 403);
```

Suggested follow-up dispatch: **`fix(security): gate admin-billing-metrics behind admin role check`** — one-PR, ~10 LOC change, real-device verify by Chau hitting `/admin/billing` with both an admin and a non-admin account.

---

## 3. Risk-tier distribution

| Risk | Count | Definition | Notes |
|---|---|---|---|
| **5 — CRITICAL** | **1** | money-path or admin-data, no auth, no validation | `admin-billing-metrics` (§2) |
| **4 — HIGH** | **9** | money-path / webhook where auto-detection found no JWT/secret/admin signal | needs manual validation — see §4 |
| **3 — MEDIUM** | **9** | money-path with auth but no payload schema validation | structural; zod adoption work |
| **2 — LOW** | **86** | internal / user-facing with at least JWT + try/catch | the long tail; staged hardening |
| **1 — WELL-VALIDATED** | **1** | zod + wrapHandler + auth | `get-room` (likely candidate; verify) |

Distribution check: 1 + 9 + 9 + 86 + 1 = 106. (One row is the empty `account-conversion-welcome` folder — templates only, no `.ts`.)

---

## 4. Risk-4 (HIGH) — manual validation needed

Auto-rated risk-4 because the main `index.ts` had no detectable JWT / admin / secret pattern. All nine are money-path or webhook by name. **Likely false-positives** for the 4 named webhooks (signature verification is the contract auth, not JWT) but each needs a human spot-read to confirm.

| # | Function | LOC | Likely actual auth pattern | Action |
|---|---|---|---|---|
| 1 | `apple-webhook` | 176 | JWS signature verify on `signedPayload` (cited at the top of the file). | Read file: confirm signature verify is enforced before any downstream call. |
| 2 | `apple-server-notifications` | 273 | Same as above (Apple side). | Same. |
| 3 | `google-webhook` | 166 | Google JWT verification via receipt validation. | Read file: confirm receipt verification. |
| 4 | `revenuecat-webhook` | 247 | RevenueCat webhook secret in header. | Read file: confirm secret check. |
| 5 | `stripe-webhook` | 463 | Stripe-Signature header verify (`verifyStripeSignature` already shipped). | Already verified (B48/A18 work) — auto-rating false-positive. |
| 6 | `billing-google-attach-purchase` | 588 | Likely user-context via Google IAP attach flow; per-purchase receipt verify. | Read file. |
| 7 | `billing-stripe-change-plan` | 1256 | Likely behind `verify_jwt = true` default + Stripe customer-id ownership check. | Read file. |
| 8 | `create-billing-portal-session` | 145 | Should require JWT (creates a Stripe portal URL for *the calling user*). | Read file. |
| 9 | `redeem-access-code` | 86 | Uses `core.ts` for auth injection per existing pattern. | Read `core.ts` — auth likely lives there. |

**Verification protocol per function** (suggested follow-up A10b dispatch):

```bash
# 1. main file head
sed -n '1,80p' supabase/functions/<fn>/index.ts
# 2. all auth-shaped lines
grep -nE 'verif(y|ied)|signat|secret|jwt|getUser|x-.*-secret|auth' supabase/functions/<fn>/*.ts
# 3. config.toml entry
grep -A 1 "<fn>" supabase/config.toml
# 4. score: real risk 4 (no auth, money/webhook), 3 (auth but no validation),
#    2 (auth + signature), 1 (auth + signature + schema)
```

Recommended sequence: do the 4 webhooks first (highest blast radius), then the 4 billing-* functions, then `redeem-access-code`.

---

## 5. Cross-cutting findings

### 5.1 Zod adoption — 4/105 (~4%)

The four current zod consumers:
- `get-room/index.ts`
- `list-rooms/index.ts`
- `secure-room-loader/index.ts`
- `shared/validation.ts` (helper, sibling of `_shared`)

A11's named work adds zod schemas to `apple-webhook`, `google-webhook`, `stripe-webhook`. After A11 ships: 7/105.

The 98 remaining functions rely on TypeScript interfaces (compile-time only) or no validation. Concretely: a malformed JSON body, an unexpected field type, or a missing required field will either crash with a `TypeError` mid-handler or — worse — silently use `undefined` in a downstream query/insert.

**Suggested staged dispatch** (not in this PR — recon only):

| Stage | Scope | Target |
|---|---|---|
| **Z1** | All money-path functions (9 from §3 risk-4 + the 6 risk-3) | 15 fns ⇒ 22/105 (~21%) |
| **Z2** | All admin-* functions (15) | 30/105 (~29%) |
| **Z3** | All email/cron functions (~12) | 42/105 (~40%) |
| **Z4** | Remaining user-facing (~60+) | progressive; can be opportunistic-when-touched, not bulk |

### 5.2 Sentry observability — 16/105 (~15%)

13 functions use `wrapHandler` (the standard pattern), 3 call `captureEdgeError` directly. The other 89 throw without observability — failures are visible only in Supabase function logs (Vercel-style tail), not aggregated/dashboard'd.

**Suggested dispatch**: add `wrapHandler('<name>', async (req) => {…})` to the 9 risk-4 + 9 risk-3 functions (16 unique). One PR, ~50 LOC, low risk (the wrapper rethrows verbatim so behavior is unchanged).

### 5.3 `config.toml` `verify_jwt` coverage — 38/105 (~36%)

| Setting | Count | Notes |
|---|---|---|
| Explicit `verify_jwt = false` | 12 | webhooks (intentional), some cron / email |
| Explicit `verify_jwt = true` | 19 | admin / user-facing where the explicit-ness is documentation |
| **No entry (default `true`)** | **74** | Supabase platform default: JWT required. **But**: per-function auth-content check is what actually gates access. |

**Risk**: the implicit default is "secure-by-default" today, but if the Supabase platform ever changes that default, 74 functions silently flip to `verify_jwt = false`. **Recommend**: make the 74 explicit in a follow-up `chore(config): make all functions' verify_jwt setting explicit` PR.

### 5.4 Service-role usage — 79/105 (~75%)

The vast majority of functions use the service-role key for at least one operation. This is *expected* for edge functions that need to write across RLS-protected tables (admin tools, billing writers, audit logs). But it means **the application-layer auth check IS the entire security boundary** for those tables — RLS provides no defense-in-depth.

Implication for risk: any function that uses service-role AND lacks an in-function admin/ownership check IS a potential P0. `admin-billing-metrics` is the one I found; the §4 verification pass may find more.

---

## 6. Recommended dispatches (priority order)

| # | Dispatch | Why first |
|---|---|---|
| **1** | `fix(security): gate admin-billing-metrics behind admin role check` (A10c) | P0 — proven data exposure. ~10 LOC. |
| **2** | A10b verification pass — read each of the 9 §4 risk-4 functions, confirm/deny the false-positive theory | Tells us whether there are more P0s lurking. ~1 hour. |
| **3** | A11 finish: zod schemas on apple/google/stripe webhooks (already named work) | Highest-traffic money path. |
| **4** | Z1 expansion: zod schemas on the 6 risk-3 money paths + the 4 billing-* (after §4 verification) | Round out money-path validation. |
| **5** | `chore(observability): wrapHandler on top-15 risk fns` | One PR, ~50 LOC, behavior-preserving. |
| **6** | `chore(config): explicit verify_jwt on all 105 functions` | Closes the platform-default drift risk. |
| **7** | Z2/Z3/Z4 staged zod expansion | Long tail. |

---

## 7. Caveats — what this audit is NOT

- **Not a guarantee.** The signal-grep approach catches common patterns but misses:
  - Auth via dynamic imports (`await import('../auth')`)
  - Auth via Hono / itty-router middleware (not used in this repo today; check before assuming)
  - Header-secret patterns I didn't include in the grep set
  - Per-table RLS that the function inherits from `service_role`-bypassed reads (matters for some functions even with no in-function gate)
- **Not a code review.** Risk scores are auto-assigned from signals, not reasoning about behavior. Spot-reads (§4) and Chau / A11 / A18 domain knowledge override.
- **Not a CVE / dependency audit.** Deno deps + esm.sh pins are orthogonal.
- **Not real-device tested.** I cannot hit the endpoints. Risk-5 finding was confirmed by reading the file's auth surface — but production may have an upstream gate (CDN / Cloudflare / Vercel rule) I cannot see.
- **Methodology is reproducible**: the scripts in §1 + the TSVs at `/tmp/edge-final.tsv` + `/tmp/edge-risk-v2.tsv` (gitignored, recreated by the dispatch's preflight) are the full data set.

---

## 8. Full per-function risk table

105 functions, sorted by risk descending. Columns: `risk | category | function | LOC | jwt/admin/secret signals | verify_jwt config | other`.

| Risk | Cat | Function | LOC | J/A/S | jwtcfg | Other |
|---|---|---|---|---|---|---|
| 5 | admin | admin-billing-metrics | 372 | 0/0/0 | default | - |
| 4 | money | billing-google-attach-purchase | 588 | 0/0/0 | default | - |
| 4 | money | billing-stripe-change-plan | 1256 | 0/0/0 | default | - |
| 4 | money | create-billing-portal-session | 145 | 0/0/0 | default | - |
| 4 | money | redeem-access-code | 86 | 0/0/0 | default | - |
| 4 | webhook | apple-server-notifications | 273 | 0/0/0 | default | - |
| 4 | webhook | apple-webhook | 176 | 0/0/0 | default | cap |
| 4 | webhook | google-webhook | 166 | 0/0/0 | default | - |
| 4 | webhook | revenuecat-webhook | 247 | 0/0/0 | default | - |
| 4 | webhook | stripe-webhook | 463 | 0/0/0 | false | - |
| 3 | admin | admin-billing-cancel-subscription | 132 | 1/1/0 | default | - |
| 3 | admin | admin-set-tier | 157 | 1/1/0 | default | - |
| 3 | money | apple-iap-sync | 170 | 1/0/0 | default | - |
| 3 | money | bank-transfer-orders | 400 | 1/1/0 | false | - |
| 3 | money | redeem-gift-code | 252 | 1/0/0 | false | - |
| 3 | money | verify-payment-screenshot | 337 | 1/0/0 | true | - |
| 3 | user | generate-gift-code | 206 | 1/1/0 | true | - |
| 3 | user | get-subscription-status | 141 | 1/1/0 | default | - |
| 3 | user | me-entitlement | 179 | 0/0/0 | true | - |
| 2 | admin | admin-billing-portal-session | 116 | 1/1/0 | default | - |
| 2 | admin | admin-daily-digest | 210 | 0/0/1 | true | - |
| 2 | admin | admin-hide-room | 97 | 1/1/0 | default | - |
| 2 | admin | admin-list-registered-users | 270 | 1/1/0 | default | - |
| 2 | admin | admin-list-rooms | 90 | 1/1/0 | default | - |
| 2 | admin | admin-list-users | 133 | 1/1/0 | default | - |
| 2 | admin | admin-management | 322 | 1/1/0 | true | - |
| 2 | admin | admin-publish-room | 97 | 1/1/0 | default | - |
| 2 | admin | admin-security-health | 219 | 1/0/1 | default | - |
| 2 | admin | admin-stats | 157 | 1/1/0 | true | - |
| 2 | admin | manage-admins | 218 | 1/1/0 | true | - |
| 2 | cron-internal | audit-db-health | 251 | 1/0/0 | true | wrap |
| 2 | cron-internal | audit-v4-safe-shield | 184 | 1/0/0 | true | wrap |
| 2 | cron-internal | audio-storage-audit | 247 | 1/0/0 | true | - |
| 2 | cron-internal | health-check | 65 | 0/0/0 | false | - |
| 2 | cron-internal | perf-alert | 105 | 0/0/1 | default | - |
| 2 | cron-internal | safety-audit | 197 | 1/0/0 | default | - |
| 2 | cron-internal | security-alert | 261 | 0/0/1 | false | - |
| 2 | cron-internal | uptime-monitor | 89 | 0/0/0 | false | - |
| 2 | email | admin-list-rooms | (dup; see admin) | | | |
| 2 | email | email-automations | 295 | 0/0/0 | false | - |
| 2 | email | email-broadcast | 198 | 0/0/0 | false | - |
| 2 | email | email-reengagement | 154 | 0/0/0 | default | - |
| 2 | email | email-unsubscribe | 105 | 0/0/0 | false | - |
| 2 | email | referral-recognition-email | 159 | 0/0/1 | default | - |
| 2 | email | send-bulk-invitations | 116 | 1/1/0 | default | - |
| 2 | email | send-email-campaign | 119 | 0/0/0 | default | - |
| 2 | email | send-feedback-reply | 137 | 1/1/0 | default | - |
| 2 | email | send-pending-emails | 158 | 0/0/0 | false | - |
| 2 | email | send-redeem-email | 122 | 0/0/0 | false | - |
| 2 | email | streak-reminder-email | 175 | 0/0/1 | default | - |
| 2 | email | trial-expiry-emails | 153 | 0/0/0 | default | - |
| 2 | email | weekly-digest-email | 117 | 0/0/0 | default | - |
| 2 | email | weekly-progress-email | 167 | 0/0/1 | default | - |
| 2 | user | (remaining 53 risk-2 user-facing functions) | | | | |
| 1 | user | get-room | (verify) | (zod+wrap) | true | zod |

(Full row-for-row table embedded in source TSV at recon-time; trimmed here for readability — the top of the distribution + the actionable shortlists are above. To regenerate: run the script in §1 and `sort -k1,1nr`.)

---

## Sources

- `supabase/functions/` directory listing (105 functions, excl. `_shared` / `_billing` per dispatch)
- `supabase/config.toml` `verify_jwt` settings (38 explicit entries)
- Direct read: `supabase/functions/admin-billing-metrics/index.ts` (P0 confirmation)
- Direct read: `supabase/functions/admin-set-tier/index.ts` (auth pattern reference)
- Direct read: `supabase/functions/admin-management/index.ts` (alt auth pattern)
- Direct read: `supabase/functions/admin-daily-digest/index.ts` + `admin-security-health/index.ts` (header-secret auth confirmation)

## Status

- **No production code touched.** No edits to any `supabase/functions/` file. No SQL run.
- **No tests run.** Pure static signal analysis + 5 spot-reads.
- **Operator artifact per B16** — committed to `docs/edge-fn-security-audit-a10`, no PR needed for the report itself (but opened for visibility).

---

*A10 — read-only edge function security audit. One CRITICAL, nine HIGH-needing-validation, structural recommendations for staged zod / Sentry / config hardening.*
