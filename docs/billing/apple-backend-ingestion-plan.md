# Apple backend ingestion plan

Owner: C  
Scope: Apple subscription ingestion only  
Architecture constraints:
- `public.subscriptions` remains canonical
- `me-entitlement` remains the only premium truth
- clients never decide premium locally
- Apple rows must preserve `provider = 'apple'`

## Goal

Add the Apple purchase path without changing the existing billing architecture.

The Apple path has two backend entry points:
1. a device-initiated sync endpoint after native purchase / restore
2. an Apple server notification endpoint for lifecycle updates

Both paths must validate Apple data, map it into canonical subscription fields, and write to `public.subscriptions`.

---

## Proposed functions

### 1) `supabase/functions/apple-iap-sync/index.ts`

Purpose:
- ingest Apple purchase proof sent by the iOS app
- validate transaction server-side
- project the result into `public.subscriptions`
- return success so the client can refresh `me-entitlement`

When called:
- after native purchase success
- after restore purchases
- on app startup / foreground if the client has a new Apple transaction to sync

### 2) `supabase/functions/apple-server-notifications/index.ts`

Purpose:
- receive App Store Server Notifications
- validate notification payload server-side
- project lifecycle changes into `public.subscriptions`
- keep canonical subscription state converged over time

When called:
- initial purchase notification
- renewal
- cancellation / renewal status change
- grace / billing retry change
- refund / revocation
- expiration

### Optional later: `supabase/functions/apple-subscription-reconcile/index.ts`

Purpose:
- admin/support repair path
- refetch current Apple state for a known transaction chain
- recover from missed notifications or historical inconsistencies

Not required for MVP.

---

## Shared ingestion rules

Both Apple functions must:
- authenticate or identify the Mercy Blade user where applicable
- validate Apple-signed input server-side
- derive canonical subscription state from Apple truth
- upsert the canonical row in `public.subscriptions`
- preserve `provider = 'apple'`
- never tell the client to unlock premium directly

Client premium unlock continues to happen only after a fresh `me-entitlement` read.

---

## Function 1: `apple-iap-sync`

### Request shape

```json
{
  "signedTransactionInfo": "<apple-jws>",
  "appAccountToken": "<uuid-optional-but-recommended>",
  "environmentHint": "Production"
}
```

### Fallback request shape

```json
{
  "transactionId": "<apple-transaction-id>",
  "appAccountToken": "<uuid-optional-but-recommended>",
  "environmentHint": "Production"
}
```

### Response shape

```json
{
  "ok": true,
  "subscription": {
    "provider": "apple",
    "provider_subscription_id": "1000001234567890",
    "provider_price_id": "mb.premium.monthly",
    "status": "active",
    "current_period_start": "2026-03-21T16:24:10.000Z",
    "current_period_end": "2026-04-21T16:24:10.000Z"
  },
  "entitlement_refresh_required": true
}
```

### Failure response

```json
{
  "ok": false,
  "error": "invalid_apple_transaction"
}
```

### Required behavior

1. Read the authenticated Mercy Blade user from the session.
2. Verify and decode the Apple transaction payload.
3. Extract the Apple fields needed for canonical mapping.
4. Determine the canonical status.
5. Upsert the corresponding `public.subscriptions` row.
6. Return success.
7. Do not grant premium in the response.

### Apple fields consumed

From the verified Apple transaction, the mapper should extract at minimum:
- `originalTransactionId`
- `transactionId`
- `productId`
- `purchaseDate`
- `expiresDate`
- `appAccountToken`
- `environment`
- revocation / refund indicators if present

### Canonical write rule

Upsert by:
- `provider = 'apple'`
- `provider_subscription_id = originalTransactionId`

Write:
- `provider_customer_id = appAccountToken` when present
- `provider_price_id = productId`
- `status = <derived canonical status>`
- `current_period_start = purchaseDate`
- `current_period_end = expiresDate`

Store latest Apple transaction details in metadata for debugging and reconciliation.

---

## Function 2: `apple-server-notifications`

### Request shape

```json
{
  "signedPayload": "<apple-server-notification-jws>"
}
```

### Response shape

```json
{
  "ok": true
}
```

### Duplicate response shape

```json
{
  "ok": true,
  "duplicate": true
}
```

### Failure response

```json
{
  "ok": false,
  "error": "invalid_apple_notification"
}
```

### Required behavior

1. Verify the notification signature.
2. Decode the top-level notification payload.
3. Decode included transaction / renewal payloads if present.
4. Insert the raw event into an idempotency / audit table.
5. Derive canonical subscription state.
6. Upsert the matching `public.subscriptions` row.
7. Return success quickly after durable persistence.

### Apple fields consumed

From the verified notification payload, the mapper should extract at minimum:
- `notificationType`
- `subtype`
- `originalTransactionId`
- `transactionId`
- `productId`
- `purchaseDate`
- `expiresDate`
- `appAccountToken`
- revocation / refund indicators
- environment

### Canonical write rule

Same canonical upsert key as device sync:
- `provider = 'apple'`
- `provider_subscription_id = originalTransactionId`

This keeps all Apple lifecycle changes on the same canonical subscription row.

---

## Canonical field mapping for ingestion

| Canonical field | Apple source | Rule |
|---|---|---|
| `provider` | constant | `'apple'` |
| `provider_customer_id` | `appAccountToken` | write when present |
| `provider_subscription_id` | `originalTransactionId` | stable subscription-chain id |
| `provider_price_id` | `productId` | Apple SKU |
| `status` | derived | map from verified Apple state |
| `current_period_start` | `purchaseDate` | start of active entitlement window |
| `current_period_end` | `expiresDate` | end of active entitlement window |
| `metadata.apple_transaction_id` | `transactionId` | latest seen transaction |
| `metadata.apple_environment` | environment | sandbox / production / xcode |
| `metadata.apple_notification_type` | `notificationType` | notification path only |
| `metadata.apple_notification_subtype` | `subtype` | notification path only |

---

## Canonical status derivation

| Verified Apple condition | Canonical status |
|---|---|
| active paid period | `active` |
| active free trial | `trialing` |
| auto-renew off, period still active | `canceled` |
| billing issue or grace, current period still serviceable | `past_due` |
| subscription ended | `expired` |
| refunded / revoked | `revoked` |

Status should be derived only from verified Apple data, not from client assumptions.

---

## Idempotency plan

Add an audit table such as `billing.apple_events`.

Suggested fields:
- `id`
- `event_source` (`device_sync` or `server_notification`)
- `dedupe_key`
- `original_transaction_id`
- `transaction_id`
- `signed_date`
- `raw_payload`
- `processed_at`

Suggested dedupe keys:
- device sync: hash of `signedTransactionInfo`
- server notification: hash of `signedPayload`

Processing order:
1. verify payload
2. insert event row with unique `dedupe_key`
3. if duplicate, return success
4. otherwise project into `public.subscriptions`

---

## Out-of-order handling

Apple events may arrive late or out of order.

Projection rule:
- never overwrite a newer canonical period with an older one
- prefer the record with the later effective `current_period_end`
- if period end is equal, prefer the record with the later Apple signed timestamp
- `revoked` beats any active-style state for entitlement

This prevents an older device sync from overwriting a newer renewal, expiration, or revocation.

---

## MVP end-to-end flow

### Device purchase flow

1. user completes native purchase in iOS
2. iOS receives Apple purchase success
3. client sends Apple proof to `apple-iap-sync`
4. backend validates and writes `public.subscriptions`
5. client calls `me-entitlement`
6. client unlocks only if `me-entitlement` says premium

### Server lifecycle flow

1. Apple sends a server notification
2. backend verifies the notification
3. backend records the event idempotently
4. backend updates `public.subscriptions`
5. future `me-entitlement` reads reflect the new backend truth

---

## MVP implementation order

1. create Apple verification helpers
2. create canonical Apple-to-subscription mapper
3. implement `supabase/functions/apple-iap-sync/index.ts`
4. implement `public.subscriptions` Apple upsert path
5. implement `supabase/functions/apple-server-notifications/index.ts`
6. add `billing.apple_events` idempotency table
7. wire iOS client to sync then refresh `me-entitlement`

---

## Done criteria for step 2

Step 2 is done when:
- the Apple backend entry points are named and scoped
- request / response shapes are defined
- canonical write behavior is defined
- Apple canonical field mapping is explicit
- idempotency and out-of-order handling rules are explicit
- the client-to-backend purchase sync path is clear
