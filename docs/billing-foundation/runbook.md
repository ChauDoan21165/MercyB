# Local and hosted verification runbook

## 1) Apply migration locally

```bash
supabase db reset
```

Then run:

```bash
psql "$SUPABASE_DB_URL" -f scripts/verify_billing_foundation.sql
```

## 2) Regenerate DB types

```bash
./scripts/regenerate-db-types.sh             # regenerate both canonical files
./scripts/regenerate-db-types.sh --dry-run   # preview, no writes
```

The script reads `project_id` from `supabase/config.toml` and writes
both canonical generated-types files in lock-step:

- `src/integrations/supabase/types.ts` (browser/SPA)
- `supabase/functions/_shared/database.types.ts` (Deno edge functions)

It enforces the byte-identical invariant between the two and exits
non-zero if drift is detected. Operator runbook with prereqs and
verification: `reports/OPS-database-types-regen-runbook-A8g.md`.

Repository rule:

- never hand-edit generated DB types
- migrations land first
- regeneration runs second
- application code updates last

## 3) Serve scaffold functions locally

Webhook functions should be served without JWT verification.
Attach functions can stay on the default verified path.

```toml
[functions.apple-webhook]
verify_jwt = false

[functions.google-webhook]
verify_jwt = false
```

Run locally:

```bash
supabase functions serve apple-webhook --no-verify-jwt
supabase functions serve google-webhook --no-verify-jwt
supabase functions serve billing-apple-attach-transaction
supabase functions serve billing-google-attach-purchase
```

## 4) Local request checks

### Apple attach

```bash
curl -i -X POST http://127.0.0.1:54321/functions/v1/billing-apple-attach-transaction \
  -H 'Content-Type: application/json' \
  -d '{"appUserId":"user_123","transactionId":"tx_apple_1","environment":"sandbox"}'
```

Repeat the same request once more. Expect:

- first request: `isNew = true`
- second request: `isNew = false`
- `deliveryCount` increases to `2`

### Apple webhook

```bash
curl -i -X POST http://127.0.0.1:54321/functions/v1/apple-webhook \
  -H 'Content-Type: application/json' \
  -d '{"notificationUUID":"apple_evt_1","notificationType":"DID_RENEW","environment":"sandbox"}'
```

Repeat once. Expect dedupe.

### Google attach

```bash
curl -i -X POST http://127.0.0.1:54321/functions/v1/billing-google-attach-purchase \
  -H 'Content-Type: application/json' \
  -d '{"appUserId":"user_123","purchaseToken":"purchase_token_1","productId":"monthly_pro","environment":"sandbox"}'
```

Repeat once. Expect dedupe.

### Google webhook

```bash
PAYLOAD=$(printf '%s' '{"notificationType":"SUBSCRIPTION_PURCHASED","environment":"sandbox"}' | base64 -w0)
curl -i -X POST http://127.0.0.1:54321/functions/v1/google-webhook \
  -H 'Content-Type: application/json' \
  -d "{\"message\":{\"messageId\":\"google_msg_1\",\"data\":\"$PAYLOAD\"}}"
```

Repeat once. Expect dedupe.

## 5) Hosted verification

- deploy migration first
- regenerate and commit shared DB types second
- deploy Apple/Google scaffold functions third
- confirm webhook functions are deployed with JWT verification disabled
- invoke each scaffold once with a unique key and once again with the same key
- confirm one logical event row is stored and `delivery_count` increments
- confirm `public.subscriptions` remains untouched by scaffold routes
- confirm existing Stripe webhook flow still passes its smoke tests

## 6) Rollback notes

- function scaffolds can be undeployed independently
- additive columns on `public.subscriptions` are backward compatible with Stripe-first code
- new tables can remain in place even if Apple/Google work is delayed
