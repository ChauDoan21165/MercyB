# Team C schema audit against the canonical billing model

This audit is written against the truths provided, not against a checked-out repo snapshot.

## Canonical rules preserved

- `public.subscriptions` remains the single canonical subscription store.
- Stripe stays the first live provider.
- Apple and Google are prepared as additive providers, not parallel subscription sources.
- Replay-safe event intake and future entitlement projection are added around the canonical model instead of replacing it.

## Additive schema expectations for a clean canonical model

A normalized multi-provider `public.subscriptions` table needs, at minimum:

- provider identity: `provider`, `environment`
- provider object mapping: `provider_subscription_id`, `provider_customer_id`, `provider_product_id`, `provider_price_id`
- normalized billing shape: `currency_code`, `billing_interval`, `billing_interval_count`, `quantity`
- lifecycle timestamps: `trial_started_at`, `trial_ends_at`, `current_period_start_at`, `current_period_end_at`, `cancel_at`, `canceled_at`, `ended_at`
- provider-specific escape hatch: `provider_metadata jsonb`

## Gaps this patch closes

1. **Provider normalization gap**
   Existing Stripe-first schemas often only carry Stripe-shaped foreign IDs. The patch adds provider-generic columns and backfills from legacy Stripe columns when they exist.

2. **Replay-safe webhook gap**
   The patch adds `public.billing_provider_events` with a unique `(provider, environment, event_key)` key, delivery counting, process status, and helper registration RPC.

3. **Entitlement logging gap**
   The patch adds `public.billing_entitlement_events` as an append-style support table for a future entitlement engine.

4. **Generated type drift gap**
   The patch adds a concrete regeneration script and a runbook step that treats the generated database types as derived artifacts from the live schema.

## Intentional non-goals in this patch

- No Stripe rewrite.
- No Apple verification logic.
- No Google verification logic.
- No entitlement engine yet.
- No secondary canonical subscription table.
- No provider-specific “source of truth” tables for active subscriptions.
