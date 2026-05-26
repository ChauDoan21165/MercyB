# Apple Notification Lifecycle Plan

This document defines the Apple server-notification handling path for Mercy Blade.

## Scope

This plan preserves the current architecture:

- `public.subscriptions` remains canonical
- `me-entitlement` remains the only premium truth
- the client never decides premium locally
- Apple lifecycle events must end in canonical writes with `provider = 'apple'`

## Primary endpoint

Recommended function:

- `supabase/functions/apple-server-notifications/index.ts`

Primary purpose:

- receive App Store Server Notifications V2
- verify the signed payload
- map Apple lifecycle changes into canonical subscription fields
- write or update `public.subscriptions`
- preserve `provider = 'apple'`

## Notification handling model

Server notifications are the lifecycle convergence path.

They should handle:

- initial purchase
- renewal
- cancellation
- billing retry / grace period
- refund / revocation
- expiration

The device-initiated sync path may write the first subscription row immediately after purchase, but server notifications remain the durable background source for lifecycle maintenance.

## Event handling plan

### 1. Initial purchase

Typical Apple signal:
- initial transaction notification or a newly observed subscription transaction chain

Canonical action:
- verify the notification
- extract `originalTransactionId`, `transactionId`, `productId`, `purchaseDate`, `expiresDate`, and renewal state when available
- upsert a canonical row keyed by:
  - `provider = 'apple'`
  - `provider_subscription_id = originalTransactionId`
- set:
  - `provider_price_id = productId`
  - `current_period_start = purchaseDate`
  - `current_period_end = expiresDate`
  - `status = 'trialing'` if the active transaction is an introductory free trial
  - otherwise `status = 'active'`

Entitlement result:
- premium becomes true only through `me-entitlement` after the canonical write

### 2. Renewal

Typical Apple signal:
- successful renewal event for an existing subscription chain

Canonical action:
- find row by `(provider = 'apple', provider_subscription_id = originalTransactionId)`
- update:
  - `provider_price_id` if product changed inside the same group
  - `current_period_start` to the renewed transaction purchase date
  - `current_period_end` to the renewed transaction expires date
  - `status = 'active'`
  - latest transaction metadata

Entitlement result:
- premium remains true while the current period remains active

### 3. Cancellation

Typical Apple signal:
- auto-renew turned off, but the current paid or trial period has not ended yet

Canonical action:
- do not expire access immediately
- update:
  - `status = 'canceled'`
  - `cancel_at_period_end = true`
  - `canceled_at` to the first observed cancellation-intent time if tracked
- preserve the current active period window

Entitlement result:
- premium remains true until `current_period_end`

### 4. Billing retry / grace period

Typical Apple signal:
- billing issue, grace period, or retry state while the subscription chain is still within a serviceable window

Canonical action:
- update:
  - `status = 'past_due'`
  - current period dates to the latest Apple-known service window
- do not revoke access immediately if the service window remains valid

Entitlement result:
- premium stays true while:
  - `status = 'past_due'`
  - and `current_period_end > now()`

### 5. Refund / revocation

Typical Apple signal:
- revoked subscription or refunded transaction chain

Canonical action:
- update:
  - `status = 'revoked'`
  - latest Apple metadata showing refund/revocation
- keep prior period values for audit if helpful, but do not continue entitlement

Entitlement result:
- premium becomes false immediately

### 6. Expiration

Typical Apple signal:
- subscription reached end of service with no valid renewal
- or a notification indicates expired state

Canonical action:
- update:
  - `status = 'expired'`
- keep the last known current period for history/audit

Entitlement result:
- premium becomes false

## Idempotency plan

Apple notifications may be retried, duplicated, or arrive more than once.

Use an event log table such as:

- `billing.apple_events`

Recommended columns:

- `provider` = `'apple'`
- `event_source`
- `dedupe_key`
- `notification_type`
- `notification_subtype`
- `original_transaction_id`
- `transaction_id`
- `signed_date`
- `raw_payload`
- `processed_at`

### Dedupe rules

Recommended dedupe key priority:

1. Apple notification UUID if present
2. otherwise hash of the full `signedPayload`

Processing rule:

1. verify signature
2. insert raw event with unique dedupe key
3. if insert conflicts, treat as duplicate and return success
4. only after durable event persistence, project into `public.subscriptions`

This ensures retries do not generate duplicate subscription mutations.

## Out-of-order handling notes

Notifications can arrive out of order. The projection layer must not assume arrival order equals event order.

### Projection rule

Only apply an incoming event if it is newer or more authoritative than the current canonical row.

Recommended precedence:

1. `revoked` is terminal and should override active-style states
2. otherwise prefer the event with the later effective entitlement window end
3. if entitlement window end is equal, prefer the later Apple signed timestamp
4. if timestamps are equal, prefer the event that contains richer verified subscription state

### Practical examples

- a delayed renewal notification must not overwrite a newer revocation
- an old cancellation-intent event must not shorten a newer active renewal window
- a duplicate initial-purchase event must not create a second canonical row

## Canonical row mutation rules

Upsert key:

- `(provider = 'apple', provider_subscription_id = originalTransactionId)`

Mutation rules:

- preserve `provider = 'apple'`
- preserve a single canonical row per Apple subscription chain
- update `provider_price_id` only from verified Apple product data
- update period fields only from verified Apple transaction windows
- never let notification handling grant premium directly to the client
- premium remains a read from `me-entitlement`

## Failure handling

If verification fails:
- reject the notification
- do not mutate `public.subscriptions`

If raw event persistence fails:
- return non-success so delivery can be retried

If projection fails after raw event persistence:
- leave the raw event stored
- retry projection safely using idempotent processing

## Recommended MVP behavior

For MVP, the notification handler should:

1. verify signed payload
2. persist raw event with idempotency key
3. decode transaction and renewal data
4. map into canonical fields
5. upsert `public.subscriptions`
6. return success

This gives Mercy Blade a clear lifecycle path without changing the existing billing architecture.
