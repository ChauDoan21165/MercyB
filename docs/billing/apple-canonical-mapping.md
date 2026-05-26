# Apple → Canonical Mapping

This document defines exactly how Apple subscription data maps into Mercy Blade's canonical subscription model.

## Scope

This mapping preserves the current architecture:

- `public.subscriptions` remains canonical
- `me-entitlement` remains the only premium truth
- clients never decide premium locally
- Apple rows must preserve `provider = 'apple'`

## Canonical identifier rules

For Apple-backed subscriptions, use these identifiers:

- `provider = 'apple'`
- `provider_subscription_id = originalTransactionId`
- `provider_price_id = productId`
- `provider_customer_id = appAccountToken` when present, otherwise `NULL`

### Rationale

- `originalTransactionId` is the stable chain identifier for one Apple subscription lifecycle
- `productId` is the App Store Connect SKU and should map directly to the canonical price identifier
- `appAccountToken` is the best Apple-side customer linkage when the app supplies a stable Mercy Blade user UUID at purchase time

## Field mapping table

| Canonical field | Apple source | Mapping rule |
|---|---|---|
| `provider` | constant | `'apple'` |
| `provider_customer_id` | `appAccountToken` | store app-supplied Mercy Blade user linkage when present; otherwise `NULL` |
| `provider_subscription_id` | `originalTransactionId` | stable canonical subscription chain id |
| `provider_price_id` | `productId` | Apple product id / SKU |
| `status` | derived | map from verified Apple lifecycle state |
| `current_period_start` | active transaction `purchaseDate` | beginning of current entitlement window |
| `current_period_end` | active transaction `expiresDate` | end of current entitlement window |
| `cancel_at_period_end` | derived from renewal state | `true` when auto-renew is off but access still continues through the current period |
| `canceled_at` | derived | timestamp when cancel intent is first observed |
| `metadata.apple_transaction_id` | `transactionId` | latest known Apple transaction id |
| `metadata.apple_original_transaction_id` | `originalTransactionId` | redundant but useful for debugging |
| `metadata.apple_environment` | Apple environment | `Sandbox`, `Production`, or `Xcode` |
| `metadata.apple_web_order_line_item_id` | `webOrderLineItemId` | optional but recommended for lineage |
| `metadata.apple_subscription_group_id` | subscription group id | optional but recommended |
| `metadata.apple_offer_type` | offer data | optional |
| `metadata.apple_offer_identifier` | offer data | optional |

## Status mapping table

Use the following canonical status values for Apple provider rows.

| Apple state / condition | Canonical status | Premium in `me-entitlement` |
|---|---|---|
| active paid subscription | `active` | yes |
| active introductory free trial | `trialing` | yes |
| auto-renew disabled, current period still active | `canceled` | yes |
| billing retry / grace period, current entitlement window still valid | `past_due` | yes, while `current_period_end > now()` |
| subscription ended and no valid current period remains | `expired` | no |
| refund / revocation | `revoked` | no |

## current_period_start and current_period_end derivation

For Apple rows, derive the canonical period fields from the **currently effective transaction window**.

### Rules

- `current_period_start` = `purchaseDate` of the active transaction currently granting service
- `current_period_end` = `expiresDate` of that same active transaction
- if the user is in a free trial, the trial transaction still defines the active entitlement window
- if auto-renew is off but access has not ended, keep the same current period and set canonical status to `canceled`
- if the subscription is expired, keep the last known period window for audit/history, but entitlement becomes false
- if the subscription is revoked, entitlement becomes false immediately even if a previous period end exists

## Entitlement rule in me-entitlement

`me-entitlement` must continue to read only backend truth.

A user counts as premium for Apple when all of the following are true:

- latest canonical row has `provider = 'apple'`
- canonical `status` is one of:
  - `trialing`
  - `active`
  - `canceled`
  - `past_due`
- `current_period_end > now()`
- the row is not revoked

### Important client rule

A successful native Apple purchase on device is **not sufficient** to unlock premium.

The client must:

1. complete native purchase
2. send Apple proof to backend
3. backend writes canonical subscription data
4. client refreshes `me-entitlement`
5. unlock only if backend entitlement says premium

## Canonical row key

For Apple-backed subscriptions, the canonical upsert key should be:

- `(provider = 'apple', provider_subscription_id = originalTransactionId)`

This ensures one canonical subscription row per Apple subscription chain.

## Notes

- Do not use `transactionId` as the canonical subscription id; it changes every renewal
- Do not use local client purchase state as entitlement truth
- Do not infer premium directly from StoreKit success without backend confirmation
