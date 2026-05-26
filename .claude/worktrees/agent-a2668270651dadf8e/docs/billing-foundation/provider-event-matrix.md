# Provider event matrix

## Canonical expectations

Every provider-facing ingress should:

1. derive a stable `event_key`
2. call `register_billing_provider_event(...)`
3. treat `is_new = false` as replay/duplicate delivery
4. only project into `public.subscriptions` from normalized code paths
5. optionally log downstream entitlement mutations into `billing_entitlement_events`

## Matrix

| Provider | Ingress | Example event type | Stable event key | Duplicate expectation | Canonical mutation now? |
|---|---|---|---|---|---|
| Stripe | existing live webhook | `customer.subscription.updated` | Stripe event id | second delivery increments `delivery_count`; no duplicate mutation | keep existing path |
| Apple | `apple-webhook` | notification / renewal / cancel | `notificationUUID` else body hash | second delivery increments `delivery_count`; no duplicate mutation | not yet |
| Apple | `billing-apple-attach-transaction` | attach request | `attach:apple:{appUserId}:{transactionId or originalTransactionId}` | repeated attach is accepted but deduped | not yet |
| Google | `google-webhook` | RTDN subscription update | Pub/Sub `messageId` else body hash | second delivery increments `delivery_count`; no duplicate mutation | not yet |
| Google | `billing-google-attach-purchase` | attach request | `attach:google:{appUserId}:{purchaseToken}` | repeated attach is accepted but deduped | not yet |

## Replay / idempotency expectations

- **First delivery**: `is_new = true`, `delivery_count = 1`
- **Replay of same key**: `is_new = false`, `delivery_count = N+1`
- **Processed event replay**: stays deduped; no second canonical subscription mutation
- **Malformed event without stable provider id**: accept only if a deterministic hash-based `event_key` can be derived
- **Attach endpoint retries**: dedupe by stable request identity, not by request timestamp
