# Billing & Entitlement — Deep Dive

> **Sibling of** [system-overview.md §12](../system-overview.md#12-billing--entitlement)
> **and** [data-flow.md §3](../data-flow.md#3-entitlement-derivation-never-price_id-never-profilestier).
> This doc is the reference for everything that reads or writes
> entitlement state — Stripe / Apple / Google webhooks, family plans,
> gift stacking, corporate seats, the `me-entitlement` edge function,
> the `profiles.premium_*` projection.
>
> **Read first:** `src/billing/computeEntitlement.ts` (file-head
> comments) and `supabase/functions/_shared/entitlement.ts` (lines
> 1–50). Those two files are the source of truth; this doc explains
> *how they relate*.

---

## 1. What it does, and why it matters strategically

The billing layer answers one question for every premium gate in the
app: **is this user entitled right now?**

That question must produce the *same* answer in three places:

- The browser (gates, paywalls, "upgrade" CTAs).
- The Supabase edge functions that protect server-side features
  (premium AI Tutor turns, advanced phoneme scoring, admin
  surfaces).
- The recomputation job that runs on every subscription webhook.

If those three answers ever diverge, premium users see "upgrade" CTAs
when they shouldn't, free users see paid features when they shouldn't,
and the only way to discover the bug is a paying user opening a
support ticket. The entire billing layer exists to make divergence
mechanically impossible — by routing every reader through the same
pure derivation function on the same input shape.

Strategic anchors (`STRATEGY.md`):

- **§7 Step 9 Monetization Depth** — Phase A merged 2026-05-19 (#774,
  #802, #770). Gates now read derived entitlement, not stale
  `profiles.tier`. Phase B in flight: entitlements table (#789), T2
  trigger retirement (#792), monotonic raw_payload (#793), currency
  unit fix (#786).
- **CLAUDE.md non-negotiable #5** — There is no VIP tier. `profiles.tier
  = 0..N` (0 = free). Legacy `'vip'` audience strings in code are
  skipped.
- **`PRINCIPLES.md` §6** — Trust the working contract: legitimate
  paying users must not be locked out by a defensive guard. The
  expiry rule is *strict-future* (rule 3 in
  `_shared/entitlement.ts:31`), but the null-expiry rule is
  *entitling* (rule 2) precisely because lifetime / gift / null-period
  rows would otherwise lock out legitimate users.

---

## 2. Key files and their roles

### 2a. Browser (`src/billing/`)

| File                                                | Role                                                                                                                                  |
|-----------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `types.ts`                                          | `BillingProvider`, `SharedSubscriptionStatus`, `SubscriptionRow`, `EntitlementResult`. The shape contract. **Type-only**, no I/O.      |
| `computeEntitlement.ts`                             | Three pure entry points that wrap `deriveEntitlementFromSubscriptions`: `computeEntitlement` (base), `computeEntitlementForUser` (family flow-through, async loaders), `computeEntitlementWithGifts` (gift stacking). Plus `isFamilyMember`, `isCorporateSeat`, `getCorporateSeatEntitlement`, `effectiveGiftEnd`. |
| `subscriptionRepository.ts`                         | `deriveEntitlementFromSubscriptions` (the canonical derivation), `isEntitlingSubscription` predicate, plus the Supabase read/write helpers (`getSubscriptionsByUserId`, `upsertSubscription`, `hasProcessedEvent`, `insertEntitlementEvent`). Test-seam injectable. |
| `recomputeAndPersistEntitlement.ts`                 | Reads `subscriptions` for a user, derives, and writes `profiles.premium_status / premium_expires_at / premium_source`. The only function that *writes* the projection.            |
| `stripe/mapStripeSubscription.ts`                   | Stripe API shape → internal `SubscriptionRow`. Owned by Stripe's webhook handler — the **Supabase edge function** at `supabase/functions/stripe-webhook/` (NOT a Vercel `api/*` function; see §5d "Stripe webhook host — verified" for the verified request flow). |

### 2b. Server (`supabase/functions/_shared/`)

| File                                                   | Role                                                                                                                                  |
|--------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `entitlement.ts`                                       | THE canonical derive for **every edge-function reader** on the money path. `deriveEntitlement(rows, now)` reduces N rows to a single `EntitlementSnapshot`. Strict-future expiry rule (rule 3). Pure, esm.sh-free, `now`-injectable. |
| `entitlement/` (subdirectory)                          | The pre-_shared internal entitlement module used by the `me-entitlement` edge function before the consolidation in PR-A.              |
| `premiumEntitlement.ts`                                | Older helper retained for back-compat. New code calls `_shared/entitlement.ts`.                                                       |
| `billing.ts`                                           | Subscription read helpers used by multiple edge functions.                                                                            |
| `apple-api.ts`, `apple-billing.ts`                     | Apple-specific helpers (notification verification, transaction shape).                                                                |

### 2c. Per-provider edge functions

| Function                                                              | Trigger                              | Writes                                                  |
|-----------------------------------------------------------------------|--------------------------------------|---------------------------------------------------------|
| `supabase/functions/apple-webhook/`                                   | Apple subscription notification      | `subscriptions` (upsert) + `entitlement_events` + recompute |
| `supabase/functions/apple-server-notifications/`                      | Apple ASN v2 webhook                 | Same                                                    |
| `supabase/functions/apple-iap-sync/`                                  | Client-initiated reconciliation      | Same, idempotent                                        |
| `supabase/functions/billing-google-attach-purchase/`                  | Android Play purchase attach         | `subscriptions` + recompute                             |
| `supabase/functions/billing-stripe-change-plan/`                      | Stripe billing portal flow           | Same, plus Stripe API mutate                            |
| `supabase/functions/create-billing-portal-session/`                   | Open Stripe customer portal          | No DB write; returns portal URL                         |
| `supabase/functions/me-entitlement/`                                  | Client read path                     | No DB write; returns `EntitlementSnapshot`              |
| `supabase/functions/get-profile/`                                     | Client profile read                  | Returns `profiles.premium_*` projection                 |
| `supabase/functions/admin-billing-*` (several)                        | Admin tooling                        | Admin-gated mutations + reads                           |

Stripe's webhook itself is a **Supabase edge function** at
`supabase/functions/stripe-webhook/`, posted to directly by Stripe
at `https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/stripe-webhook`
— NOT routed through Netlify, Vercel, or Cloudflare DNS as an
origin. See §5d "Stripe webhook host — verified" below for the
verified request flow, secrets configuration, and debug procedure.

### 2d. Client-facing hooks + the cache

| File                                            | Role                                                                                                |
|-------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `src/lib/getMeEntitlement.ts`                   | Thin wrapper around `supabase.functions.invoke("me-entitlement")`. Throws on error.                 |
| `src/lib/queries/useEntitlementQuery.ts`        | `useEntitlementQuery(userId)` — TanStack Query hook. Disabled when `userId` is null/empty.          |
| `src/lib/queries/keys.ts`                       | `qk.entitlement(userId)` — the canonical cache key. Use this everywhere; never assemble arrays inline. |
| `src/lib/authService.ts`                        | `fetchCurrentEntitlement()`, `FAIL_CLOSED_ENTITLEMENT` sentinel.                                    |

---

## 3. Public API / surface contracts

### 3a. The pure derivation (browser-side base)

```ts
// src/billing/subscriptionRepository.ts
export function deriveEntitlementFromSubscriptions(
  subscriptions: Array<Pick<SubscriptionRow,
    "status" | "current_period_end" | "provider">>,
): EntitlementSnapshot;
```

**Inputs.** Only three fields per row. Pass extra fields → ignored.
**Output shape.**

```ts
{ status: "active" | "inactive";
  expires_at: string | null;       // ISO-8601
  source: BillingProvider | null;  // null when inactive
}
```

**Algorithm.**

1. Filter to *entitling* subscriptions (`isEntitlingSubscription`):
   `status ∈ { active, trialing, grace_period, past_due }`.
2. Pick the *winner*: the row with the latest `current_period_end`.
3. If no winner → `{ status: "inactive", expires_at: null, source: null }`.
4. Otherwise → `{ status: "active", expires_at: winner.current_period_end, source: winner.provider }`.

That is the entire base rule. Nothing else enters.

### 3b. The pure derivation (server-side canonical)

```ts
// supabase/functions/_shared/entitlement.ts
export function deriveEntitlement(
  rows: readonly EntitlementInput[],
  now: Date | number,
): EntitlementSnapshot;
```

The server-side function is intentionally **structural** — it accepts
both raw subscription rows AND persisted projection rows (the
`profiles.premium_*` columns) by being polymorphic on field names:

- Status field: `status`, `subscription_status`, or `state`.
- Expiry field: `expires_at`, `current_period_end`, `period_end`,
  `ends_at`, or `expired_at` (first match wins, in that order).
- Source field: `source`, `provider`, `platform`, or `store` (also
  first match wins).

It also handles raw status aliases (`trial` → `trialing`, `unpaid`
→ `past_due`, `paused` / `pause` / `on_hold` → `paused`, etc.). The
canonical mapping is in `normalizeStatus()`.

**Differences from the browser version:**

1. **More statuses** — server normalizes `paused`, `expired`,
   `revoked`, `inactive` explicitly (not just the 4 entitling
   statuses). Result `EntitlementStatus` is wider than the browser's
   `PremiumStatus`.
2. **Winner selection by `statusRank` + expiry + timestamp + id.**
   The server uses `compareRows` to deterministically order rows when
   the simple "latest expiry wins" rule has ties (see §6c).
3. **`gift_code` as a separate source.** The server can return
   `source: "gift_code"`; the browser version cannot.
4. **`is_premium` is a derived boolean** computed by `isEntitled` —
   the **expiry-aware** decision. `status` and `is_premium` can
   disagree intentionally: a `canceled` row with a **future** expiry
   normalizes to status `"active"` (back-compat) while `is_premium`
   correctly considers it entitled until that expiry passes.

### 3c. Read-path entry point

```ts
// Browser → edge function → derive
const ent = await getMeEntitlement();  // { is_premium, status, source, expires_at }
```

UI hooks call `useEntitlementQuery(userId)` instead, which collapses
N concurrent callers into one cache entry (`qk.entitlement(userId)`).

### 3d. Write paths (each writes `subscriptions` then recomputes)

```ts
// src/billing/subscriptionRepository.ts
export async function upsertSubscription(
  input: UpsertSubscriptionInput,
  client?: SupabaseLike,
): Promise<void>;

// src/billing/recomputeAndPersistEntitlement.ts
export async function recomputeAndPersistEntitlement(
  userId: string,
  client?: SupabaseLike,
): Promise<EntitlementResult>;
```

`upsertSubscription` is `onConflict`-keyed:

- If `provider_subscription_id` is non-null →
  `provider,provider_subscription_id`.
- Otherwise → `provider,provider_transaction_id`.

`recomputeAndPersistEntitlement` is a pure read→derive→write
pipeline. Idempotent on identical input.

### 3e. Idempotency contract

Every webhook handler **must** check `hasProcessedEvent(provider,
event_id)` before doing any work. The pair `(provider, event_id)` is
the dedup key against `entitlement_events`. Replays are silently
no-ops.

```ts
const already = await hasProcessedEvent("stripe", evt.id);
if (already) return new Response("ok", { status: 200 });
// …upsert subscription + recompute + insertEntitlementEvent
```

Forgetting this is how you race-condition Stripe into double-counting
a renewal.

### 3f. Three additive layers

The base rule above is the kernel. Three **additive** wrappers exist;
each lives in `src/billing/computeEntitlement.ts`, each is independent,
and each fails closed in a way that never penalises the caller's own
entitlement:

1. **Family-plan flow-through** — `computeEntitlementForUser`.
   ```ts
   { ...ownerEntitlement, via_family: true, family_plan_id }
   ```
2. **Gift stacking** — `computeEntitlementWithGifts`.
   ```ts
   { ...paidOrGiftWinner }
   ```
3. **Corporate seat** — `getCorporateSeatEntitlement`.
   ```ts
   { status: "active", source: "stripe", expires_at: null }
   ```

Compose order is the caller's choice. The typical compose is:
`own-subs → family → gift → corporate`, taking the most-favourable
outcome.

---

## 4. Invariants

These are **hard** invariants. Violating them produces a class of bug
that is invisible in CI and surfaces only after a user is charged
incorrectly.

### 4a. The "never" list

- **Never gate on `price_id`.** Pricing experiments change `price_id`;
  gating on it locks out paying users mid-experiment.
- **Never gate on `profiles.tier` in new code.** The column is
  retained for back-compat reads only. Browser writes are blocked
  by RLS (PR #578); the last write path was removed in
  `fix/profiles-rls-auth-backfill`. New code reads `premium_*` or
  goes through the edge function.
- **Never sum gift durations.** Two 3-month gifts redeemed today
  expire 3 months from now (max-end-wins), not 6.
- **Never let a loader failure downgrade entitlement.** Every
  cross-call in `computeEntitlementForUser` /
  `getCorporateSeatEntitlement` falls back to the caller's *own*
  entitlement on error.
- **Never introduce a clock-skew grace on expiry.** Rule 3 in
  `_shared/entitlement.ts:31` is strict-future
  (`expiresAtMs > nowMs`). A tolerance is itself a policy decision.
- **Never blanket `--no-verify-jwt`.** `config.toml` has 37
  `verify_jwt` blocks per function (memory:
  [[project_edge_function_drift_ci]]). Blanket-disabling breaks the
  per-function security model.

### 4b. The "always" list

- **Always check expiry against `now`.** Status alone does not decide
  premium; status + expiry does. The server's `isEntitled` is the
  single source of that truth.
- **Always upsert before recompute.** The recompute reads
  `subscriptions`; if you recompute first, you derive against the
  pre-event state.
- **Always log via the redacted helpers.** The redaction rules in
  `src/lib/ai-tutor/types.ts:TUTOR_LOG_REDACTION_RULES` are the
  canonical set — they also apply to billing logs (emails, JWTs,
  IPs).
- **Always set `provider_original_transaction_id`** for Apple. Apple's
  `originalTransactionId` is the stable chain id across renewals; the
  `provider_transaction_id` rotates each renewal.

### 4c. Storage / sync boundaries

| Where                          | Local?  | Server? | Notes                                                                              |
|--------------------------------|---------|---------|------------------------------------------------------------------------------------|
| Subscription rows              | —       | ✓       | `subscriptions` — webhook-fed, derive-once.                                        |
| Idempotency events             | —       | ✓       | `entitlement_events` — keyed `(provider, event_id)`.                               |
| Projected entitlement          | —       | ✓       | `profiles.premium_status / premium_expires_at / premium_source`. Written by `recomputeAndPersistEntitlement`. |
| Cached entitlement (client)    | ✓ (RAM) | —       | TanStack Query cache under `qk.entitlement(userId)`. No localStorage persistence.  |
| `mb.lang.pair`, marketing consent | ✓    | —       | Unrelated to entitlement, listed for completeness.                                 |

**The browser never derives entitlement from raw `subscriptions`
rows itself.** Always via the `me-entitlement` edge function (or the
in-process `recomputeAndPersistEntitlement` on the server). The
`src/billing/computeEntitlement.ts` wrappers exist for the **edge
function's** use (and recompute), not for the browser.

### 4d. RLS expectations

- `subscriptions` — service-role-only write; row-level read by `user_id`.
- `entitlement_events` — service-role-only read/write.
- `profiles.premium_*` — service-role-only write; row-level read.
- `gift_subscriptions` — service-role-only write; row-level read.
- `family_plans`, `family_plan_members` — owner read/write; member read.
- `corporate_seats`, `corporate_accounts` — admin / service-role write.

Memory: [[project_578_rls_applied]] confirms the profiles freeze landed
2026-05-18 and is verified in prod. Don't re-apply or re-flag.

---

## 5. Known gotchas / pitfalls

Each citation below is a real incident or a comment in code that
exists because of one.

### 5a. The `canceled + future expiry → "active"` rule

A Stripe `canceled` subscription with `current_period_end` in the
future is **still entitling until that date**. The server-side
`normalizeStatus` deliberately maps this case to status `"active"`
(see `_shared/entitlement.ts:237` and the long comment at line 184).

The status string preservation is for back-compat with downstream
readers; the access decision still goes through `is_premium` (which
correctly considers expiry). If you read the raw `subscription.status`
column you'll see `"canceled"` — that is correct. Don't "fix" it.

### 5b. Family-plan "owner-as-member" seed row

The schema includes a trigger that inserts the owner as a member of
their own family plan when the plan is created. This makes the
member-table query symmetric (members include the owner) but it would
also cause `computeEntitlementForUser` to infinitely loop if not
guarded — flow-through self→self → self→self → … The function
checks `membership.owner_user_id === userId` and returns the user's
own entitlement in that case (see `computeEntitlement.ts:123`).

### 5c. The dynamic-import shim

Several files use:

```ts
const dynamicImport = Function("path", "return import(path)") as
  (path: string) => Promise<unknown>;
const mod = await dynamicImport("@/integrations/supabase/client");
```

This is **not** for performance — it's a deliberate test seam. Vitest's
`vi.mock` cannot intercept `Function("path","return import(path)")` (it
runs at runtime, not parse time), so injecting a fake `SupabaseLike`
client is the **only** way to unit-test these functions without
hitting the real Supabase singleton. Don't "simplify" the dynamic
import — you'll lose the test coverage.

### 5d. Stripe webhook host — verified

**Correction over prior drafts:** earlier versions of this doc said
the Stripe webhook was a Vercel function under `api/*`. That was
wrong. The verified state, post-Netlify migration:

- **The Stripe webhook is a Supabase edge function** at
  `supabase/functions/stripe-webhook/index.ts` (`Deno.serve`,
  ~5,000 LOC across 14 supporting modules).
- Registered in `supabase/config.toml` `[functions.stripe-webhook]`
  with `verify_jwt = false` (Stripe deliveries carry no Supabase
  JWT — signature verification is done in
  `stripe-signature.ts` against `STRIPE_WEBHOOK_SECRET` /
  `SECRET_STRIPE_WEBHOOK_SECRET` / `STRIPE_SIGNING_SECRET` /
  `STRIPE_WEBHOOK_SIGNING_SECRET`; the helper accepts comma- or
  newline-separated values so rotated secrets continue verifying
  during cutover).
- **Live URL** (where Stripe is configured to POST):
  `https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/stripe-webhook`.
- **Not** routed through `mercyblade.com` (Netlify), not routed
  through Vercel, not routed through Cloudflare DNS as an
  origin. Stripe → directly to Supabase. Cloudflare is the DNS
  for `mercyblade.com` but does not proxy `*.supabase.co`.
- The Apple + Google webhooks (`apple-webhook`,
  `billing-google-attach-purchase`) are also Supabase edge
  functions — the entire billing-webhook surface is uniformly
  Supabase. There is no Vercel/Netlify function in the webhook
  path for any provider.

Why earlier docs got this wrong: the repo's root-level `api/`
directory (`api/mercy/grammar.ts`, `api/tts.ts`, `api/mercy-ai.ts`,
etc., registered in `vercel.json`) is a real Vercel-style
serverless-function surface, but **does not contain anything
Stripe-related**. The "Vercel function under `api/*`" claim
conflated the two surfaces.

**Known noise file:** a stray `upabase/functions/stripe-webhook.ts`
exists at the repo root (typo'd path — missing the leading `s`).
It is dead code: `supabase functions deploy` only scans
`supabase/functions/`, and the file is not registered in any
config. Flagged for cleanup, not edited.

When debugging "Stripe event didn't update my entitlement", check:

1. **Supabase edge function logs** for `stripe-webhook` (dashboard
   → Edge Functions → stripe-webhook → Logs). Sentry breadcrumbs
   under tag `webhook=stripe` if the function is wired to a
   `SENTRY_DSN`.
2. **Stripe dashboard webhook delivery log** (Developers → Webhooks
   → the configured endpoint → recent events). 4xx/5xx response
   codes there mean the signature failed or the function 500'd.
3. **`stripe_webhook_events` table** for idempotency state
   (`idempotency.ts` claims + releases the event id; a stuck
   `claimed` row means the function crashed mid-process).
4. `entitlement_events` table for `(provider='stripe',
   event_id=evt.id)`.
5. `subscriptions` for the user's latest row.
6. `profiles.premium_*` for the projected state.

### 5e. Two `audience_type` enums collide in email functions

Memory: this file documents a billing concern, but the related email
campaign functions have a known reconciliation issue
(`send-email-campaign` uses `'vip' | 'level0' | 'inactive'`,
`email-broadcast` uses `'level2' | 'level3' | 'all_vip' | 'manual'`).
Both mix legacy `vip` naming with the newer `level` system. Treat as
**broken** until reconciled — never use entitlement to drive a
marketing campaign without first sorting out which function and
which audience names you're targeting.

### 5f. Apple "original transaction id" vs "transaction id"

Apple renews a subscription by issuing a **new** transaction id while
keeping `originalTransactionId` stable. If you upsert by
`provider_transaction_id`, every renewal creates a new row instead of
updating the existing one. The `onConflict` logic in
`upsertSubscription` prefers `provider_subscription_id` (Stripe's
stable id) when present, falling back to
`provider_transaction_id` only when nothing better exists. Apple
populates both `provider_subscription_id` (set to
`originalTransactionId`) and `provider_transaction_id` (rotating);
the conflict resolver picks the right one.

### 5g. Currency unit fix (in flight)

Per `STRATEGY.md` §6 — PR #786 fixes a currency unit issue in Phase B.
Stripe represents amounts in the smallest currency unit (cents for
USD, đồng for VND, etc.). VND has no fractional unit, so a 99,000-VND
charge arrives as `99000` (not `99.00`). Until #786 lands, treat
amount reads as suspect.

### 5h. Free-tier guard fallback

The client-side `FAIL_CLOSED_ENTITLEMENT` sentinel in
`src/lib/authService.ts` is what the query resolves to when the edge
function returns no data. It means "treat as not-premium until proven
otherwise." Don't bypass it with a default like `{ is_premium: true }`
for testing — you will eventually ship that to prod.

---

## 6. Cross-references

- **[system-overview.md §12](../system-overview.md#12-billing--entitlement)** — the one-paragraph version.
- **[data-flow.md §3](../data-flow.md#3-entitlement-derivation-never-price_id-never-profilestier)** — read & write paths in flow diagram form.
- **`docs/billing/`** — provider-specific design notes (Apple
  notification lifecycle, canonical mapping, verification & iOS wiring,
  risks & blockers).
- **`docs/billing-foundation/`** — operational runbook,
  provider-event-matrix, schema-audit, schema-debt-after-patch.
- **`CLAUDE.md`** — non-negotiable #5 (no VIP tier); operating
  discipline (one owner per function, separate layers before fixing).
- **`STRATEGY.md`** — §7 Step 9 (Monetization Depth phases); §15 Axis
  rules (the flagship Definition of Done that pricing decisions
  reference).
- **Sibling deep-dives:**
  - [`study-os-stage-3.md`](./study-os-stage-3.md) — Stage 3 reads
    entitlement via the same hook; the suggested-practice surface
    must not gate by `profiles.tier`.
  - [`ai-tutor.md`](./ai-tutor.md) — tutor turn budgets per tier are
    driven from `TUTOR_TIER_LIMITS` (in `src/lib/ai-tutor/types.ts`),
    which keys on `'free' | 'paid'`, both derived from entitlement.

---

## 7. How to extend this — checklist

When you add a billing feature, walk this list **in order**. Stop at
the first item that doesn't fit; that's a sign the feature wants a
re-think.

- [ ] **Find the right layer.** Is this a new *base* rule (changes
      what counts as entitling), or a new *additive* layer (family /
      gift / corporate)? Additive layers go in
      `src/billing/computeEntitlement.ts` as a new function; the base
      rule lives once in `subscriptionRepository.ts`.
- [ ] **If you touched the base, update the server-side mirror.**
      `supabase/functions/_shared/entitlement.ts` must derive the same
      result for the same inputs. Add a parity test under
      `_shared/__tests__/`.
- [ ] **Add a `SubscriptionRow` field?** Update
      `src/billing/types.ts` (browser) AND
      `supabase/functions/_shared/database.types.ts` (server) AND the
      `subscriptions` table migration. They must move in lockstep.
- [ ] **Add an `EntitlementResult` field?** Same lockstep — and bump
      the cache key (`qk.entitlement`) ONLY if existing cached values
      become invalid. Otherwise leave the key; just extend the type.
- [ ] **New provider?** You need: (1) a provider-specific webhook
      function under `supabase/functions/<provider>-webhook/`,
      (2) a mapper in `src/billing/<provider>/`, (3) the provider
      added to the `BillingProvider` enum in `types.ts`, (4) a
      `normalizeSource` case in `_shared/entitlement.ts:144`, (5) a
      handler in `upsertSubscription`'s `onConflict` selection if the
      provider's id semantics differ, (6) tests against the
      derivation that confirm a provider-X-active row produces
      `source: "<provider>"`.
- [ ] **New gating point?** Route it through
      `useEntitlementQuery(userId)`. Do NOT add a fresh
      `supabase.functions.invoke("me-entitlement")` call site —
      collapsing all callers under one cache key is what keeps the
      function from being hit 14× per page.
- [ ] **Idempotency check.** If you added a write path, it must call
      `hasProcessedEvent` before mutating, and `insertEntitlementEvent`
      after. Otherwise webhook replays will double-write.
- [ ] **Test seam.** Use the optional `client?: SupabaseLike` second
      argument pattern from `subscriptionRepository.ts`. The
      production callers omit it and get the real client; tests
      inject a fake.
- [ ] **Tests against derivation.** Add cases under
      `src/billing/__tests__/`. Cover: (a) the happy path, (b)
      expired row + non-expired row → non-expired wins, (c) provider
      tie-breaking, (d) loader failure → caller's own entitlement
      preserved.
- [ ] **Parity test.** If you wrote a server-side change, add a
      parity test in `_shared/entitlement.ts.__tests__/` that asserts
      `deriveEntitlement(serverRows, now)` and
      `deriveEntitlementFromSubscriptions(browserRows)` agree for the
      same logical input.
- [ ] **Migration?** Hand-applied via SQL Editor by Chau, not by
      agents (memory:
      [[project_db_schema_drift_audit]]). Include the migration file
      in the PR, but expect Chau to apply it.
- [ ] **Document.** Update the relevant section of this doc *and*
      `data-flow.md` §3. If your change is a *new layer*, add a
      §3-style row to the layered-modifiers list.
- [ ] **Verify in prod, eventually.** Memory:
      [[project_agent_infra_access]] — Chau verifies via SQL Editor
      after migration apply.

If your change is **removing** a billing path:

- [ ] Don't delete `profiles.tier` reads in one go. Stage the
      deprecation: gate behind a feature flag → remove flag callers →
      remove flag → remove column reads → remove column. Each step is
      its own PR.
- [ ] Don't delete `entitlement_events` rows. Idempotency depends on
      them living forever for the provider+event_id pair.
- [ ] Don't delete the "owner-as-member" seed trigger without a
      replacement that maintains the symmetric-membership invariant —
      multiple callers depend on members-table queries returning the
      owner row.

---

## 8. The two-line summary

> Every entitlement decision flows through one of two pure
> functions: `deriveEntitlementFromSubscriptions` (browser) or
> `deriveEntitlement` (server). They take the same logical input and
> produce the same logical output. Family flow-through, gift
> stacking, and corporate seats are *additive* wrappers around the
> base; webhooks write `subscriptions` then trigger recompute;
> readers go through `me-entitlement` (cached by TanStack Query). No
> reader gates on `price_id`. No reader gates on `profiles.tier` in
> new code.

If you ever need to explain this system in two sentences, those are
the two.
