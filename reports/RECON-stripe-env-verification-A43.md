# RECON — Stripe environment verification (A43)

**Date:** 2026-05-19
**Branch:** `a43/stripe-env-verification` (operator artifact, no PR)
**Question:** Is MercyBlade production wired to Stripe **live** (`sk_live_`) or **test** (`sk_test_`)?
**Scope:** Pure code-side triage. No Supabase secrets read, no Stripe dashboard opened, no SQL executed.

---

## TL;DR — code-side verdict: **UNKNOWN from code alone (by design — correct)**

Every Stripe key is read from the Supabase Edge Function environment. **No key (live or test) is
hardcoded anywhere in the repo, and none was ever committed and later deleted** (git pickaxe clean).
So the source tree *cannot* tell you the mode — that is expected and good hygiene.

**But the code creates two runtime artifacts that resolve the question definitively without
guessing**, plus one direct dashboard check. See "What Chau should check" below.

---

## 1. Every Stripe key reference (file:line)

### Secret key — always from env, never hardcoded

| File:line | Read | Notes |
|---|---|---|
| `supabase/functions/stripe-webhook/core.ts:112-116` | `getStripeSecretKey()` = `env("STRIPE_SECRET_KEY") \|\| env("SECRET_STRIPE_KEY") \|\| env("STRIPE_API_KEY")` | Canonical webhook fn |
| `supabase/functions/billing-stripe-change-plan/index.ts:910` | `env("STRIPE_SECRET_KEY")` | + **mode self-detect**, see §3 |
| `supabase/functions/create-billing-portal-session/index.ts:34,42` | `env("STRIPE_SECRET_KEY")` | 500 if missing |
| `supabase/functions/create-billing-portal-session/functions:53,58` | `env("STRIPE_SECRET_KEY")` | bundled copy |
| `supabase/functions/admin-billing-cancel-subscription/index.ts:35` | `Deno.env.get("STRIPE_SECRET_KEY")` | |
| `supabase/functions/admin-billing-portal-session/index.ts:35` | `Deno.env.get("STRIPE_SECRET_KEY")` | |
| `upabase/functions/stripe-webhook.ts:9` | `mustGetEnv("STRIPE_SECRET_KEY")` | **STRAY TYPO DIR — dead, see §6** |

### Webhook signing secret — always from env, never hardcoded

| File:line | Read |
|---|---|
| `supabase/functions/stripe-webhook/core.ts:119-127` | `getStripeWebhookSecrets()` = `STRIPE_WEBHOOK_SECRET` → `SECRET_STRIPE_WEBHOOK_SECRET` → `STRIPE_SIGNING_SECRET` → `STRIPE_WEBHOOK_SIGNING_SECRET`; comma/newline-split + dedup (supports parallel live+test secrets during rollover) |
| `supabase/functions/stripe-webhook/stripe-signature.ts:79` | `env("STRIPE_WEBHOOK_TOLERANCE_SECONDS")` (HMAC tolerance only) |
| `upabase/functions/stripe-webhook.ts:77` | `mustGetEnv("STRIPE_WEBHOOK_SECRET")` (stray dir) |

### Publishable key — frontend, optional, not even prefix-checked

- `src/lib/configHealth.ts:50` — `import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY`, treated as
  **optional** ("skip if not defined"); only presence is checked, never the `pk_live_`/`pk_test_`
  prefix. Stripe flows are server-side (edge functions / billing portal), so the SPA may carry no
  publishable key at all. Not env-distinguishing.

**Hardcoded-key scan result:** the only `sk_live_`/`sk_test_` string literals in the entire repo
are the **mode-detection comparison** in `billing-stripe-change-plan/index.ts:931-934` (see §3).
The only `whsec_*` literals are in `stripe-webhook/__tests__/*` (test doubles:
`whsec_test_secret_abc123`, `whsec_attacker_guess`). No real key material in source or git history.

---

## 2. Env files

- Repo root: only `.env.example` (12 KB) — documents **only the Apple IAP subset**; contains
  **zero** `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `VITE_STRIPE_*` entries. No placeholder
  prefix hint.
- `supabase/`: **no** `.env*` file at all.
- No `.env`, `.env.local`, `.env.production`, `.env.development` anywhere (matches CLAUDE.md: both
  are gitignored, presence varies). Nothing to read; nothing leaked.
- `git log -S 'sk_live_'` / `-S 'pk_live_51'` / `-S 'sk_test'` (whole repo, all branches):
  the **only** hit is `81f0d888a "Fix Stripe billing checkout session handling"` — that is the
  commit that introduced the §3 mode-detection literals, **not** a real key. **No real key was
  ever committed.**

---

## 3. The decisive runtime tells (code points to them, can't read them)

### (a) `billing-stripe-change-plan` self-reports the mode to logs

`supabase/functions/billing-stripe-change-plan/index.ts:930-935`:

```ts
logInfo("billing-stripe-change-plan invoked", {
  stripe_mode: stripeSecretKey.startsWith("sk_live_")
    ? "live"
    : stripeSecretKey.startsWith("sk_test_")
      ? "test"
      : "unknown",
});
```

Every invocation writes a structured log line stating the actual mode of the secret currently
in Supabase — **without printing the secret**. This is the cleanest non-destructive read.

### (b) Every delivered webhook persists Stripe's own `livemode` flag

`supabase/functions/stripe-webhook/index.ts:66-67` and `core.ts:592`:

```ts
function getEnvironmentFromEvent(event): BillingEnvironment {
  return event.livemode ? "production" : "sandbox";
}
```

`stripe-webhook/index.ts:147-178` upserts **every** processed event into
**`public.stripe_webhook_events`** with:

```ts
livemode: typeof params.event.livemode === "boolean" ? params.event.livemode : null
```

`event.livemode` is set by **Stripe itself** on the signed payload — it cannot be spoofed by
config. So the `stripe_webhook_events` table is a historical ledger of which mode Stripe was
actually operating in for every real delivery. `livemode = true` ⟹ live keys; `false` ⟹ test.
Corroborated by the earlier `reports/RECON-stripe-idempotency.md` (lines 117/154/203 document the
same `livemode boolean` column and the security-baseline SQL defaults it `not null default false`).

This is the **single most authoritative code-side pointer** — it reflects what Stripe signed in
production, not what someone thinks is configured.

---

## 4. Webhook signature verification (step 9)

`stripe-webhook/core.ts:getStripeWebhookSecrets()` resolves the signing secret from four env
names (see §1) and `parseWebhookSecrets()` splits comma/newline lists → the verifier accepts
**multiple** secrets. `stripe-signature.ts` does HMAC-SHA256 over `t.payload` with a configurable
tolerance (`STRIPE_WEBHOOK_TOLERANCE_SECONDS`, default in code). No environment is implied by the
verification path — it is mode-agnostic and even supports running a live + test secret
simultaneously during a key rotation. Nothing here distinguishes the active env.

---

## 5. Test fixtures (steps 10–11) — neutral, do not over-read

- `src/components/admin/TestPurchasePanel.tsx:247` renders the Stripe test cards
  (`4242 4242 4242 4242`, `4000 0000 0000 0002`, `4000 0000 0000 9995`). **This panel has ZERO
  importers — it is dead/unmounted code** (`rg TestPurchasePanel` across the repo finds only its
  own definition). It is **NOT** evidence the app runs in test mode. Do not read it as a signal.
- `billing-stripe-change-plan/__tests__/logic.test.ts:133,140` uses Stripe **documentation
  example IDs** (`price_1MoBy5LkdIwHu7ix`, `cus_NffrFeUfNV2Hib`) purely to exercise the
  `isStripePriceId` / `isStripeCustomerId` shape validators. Not env-distinguishing.
- **Step 11 cross-reference is structurally impossible code-side and would be a dead end even
  with SQL:** modern Stripe subscription IDs are `sub_1XXXXXXX` in **both** live and test mode —
  the prefix carries no environment bit (the old `sub_test_` form is long retired). The *only*
  field that distinguishes a test sub from a live sub is `livemode` on the parent event
  (§3b). A8's "9 subscriptions" finding is not committed to any `reports/*` doc I could read
  (searched `reports/`; only an unrelated archived 2025 launch report mentions subscriptions), so
  there is nothing to cross-reference here — and even if there were, `sub_…` prefixes would not
  resolve it. Route the question to the `stripe_webhook_events.livemode` ledger instead.

---

## 6. Stray finding (cleanup, NOT env-determining) — typo'd `upabase/` dir

`upabase/functions/stripe-webhook.ts` (note: **`upabase`**, missing the leading `s`) is a
**git-tracked, 451-line pre-split monolithic** copy of the old stripe-webhook, committed in
`b7524cc7c "Split Stripe webhook and update billing flow"` — almost certainly an accidental
mis-pathed re-add during the split into `supabase/functions/stripe-webhook/`. It is **dead**:
the Supabase CLI only deploys from `supabase/functions/*`, so a `upabase/` path is never
deployed. It reads `STRIPE_SECRET_KEY` from env (not hardcoded) and hardcodes
`const APP_ENVIRONMENT = "production"` — that is an **app-level label, NOT the Stripe key mode**;
do not mistake it for proof of live keys. **Recommend a separate small cleanup PR to delete the
`upabase/` directory** (out of scope for A43).

---

## 7. Recommendation — what Chau should check (informed, not cold)

### In Supabase (pick whichever is fastest — any one is conclusive)

1. **Edge Function Secrets** → Dashboard → Project → Edge Functions → *Manage secrets* →
   look at `STRIPE_SECRET_KEY`. You only need the **first 8 characters**: `sk_live_` vs
   `sk_test_`. (Also confirm `STRIPE_WEBHOOK_SECRET` is set and is the matching mode's `whsec_`.)
2. **Edge Function logs** → invoke or find a recent `billing-stripe-change-plan` call → look for
   the log line `billing-stripe-change-plan invoked { stripe_mode: "live" | "test" | "unknown" }`.
   `unknown` would mean the key has neither prefix (custom/restricted key — investigate).
3. **`stripe_webhook_events` table** (most authoritative — reflects what Stripe actually signed):
   inspect the `livemode` column on recent rows. All `true` ⟹ live; all `false` ⟹ test; a mix
   ⟹ the endpoint received both (e.g., a test webhook fired against a live deployment).
   *(Read-only inspection — A43 did not run this; routed to Chau / the SQL track.)*

### In the Stripe dashboard (to confirm the other half of the pair)

- **Toggle the Test mode switch** (top-right). In **Developers → API keys**, confirm which
  secret key's last-4 / created date matches what's in Supabase secret #1 above.
- **Developers → Webhooks**: confirm an endpoint pointing at
  `…/functions/v1/stripe-webhook` exists **in the same mode** as the secret key, and that its
  signing secret matches `STRIPE_WEBHOOK_SECRET` in Supabase. A live key with only a *test*-mode
  webhook endpoint (or vice-versa) is the classic silent-failure config.
- **Payments / Subscriptions** list: in **live** mode, do the ~9 subscriptions A8 found appear?
  If they only show in **test** mode, production has been collecting test subscriptions.

### One-line summary for the dashboard session

> Code can't say the mode (all keys env-injected — correct). The truth lives in **(1)** the
> `STRIPE_SECRET_KEY` prefix in Supabase Edge Function secrets, **(2)** the `stripe_mode` line in
> `billing-stripe-change-plan` logs, and **(3)** the `livemode` column in `stripe_webhook_events`.
> Any one resolves it; #3 is authoritative because Stripe sets it. Ignore the `4242` admin panel
> (dead code) and the `upabase/` typo dir (dead, app-label only).

---

## Appendix — commands run (reproducible)

```
rg -n 'STRIPE_(SECRET|PUBLISHABLE|WEBHOOK)' --type ts --type js
rg -n 'sk_(live|test)_|pk_(live|test)_|whsec_|rk_(live|test)_' -g '!node_modules'
rg -n 'livemode' -g '!node_modules'
git log --oneline --all -S 'sk_live_'   # → only 81f0d888a (mode-detect literal)
git ls-files | grep stripe-webhook       # → upabase/functions/stripe-webhook.ts is TRACKED
find . -name '.env*'                      # → only ./.env.example (no STRIPE_* rows)
```
