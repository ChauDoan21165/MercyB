# Schema debt still remaining after this patch

1. **Entitlement engine not built yet**
   `billing_entitlement_events` is only the audit/log substrate.

2. **App-specific foreign keys are still unresolved**
   `subject_id` and `subscription_ref` are intentionally opaque strings because the actual app account key shape is unknown from this package alone.

3. **Provider verification is not implemented**
   Apple signed payload validation and Google RTDN authenticity checks are still TODOs.

4. **Canonical projection workers are not implemented**
   The patch stores replay-safe inbox events, but it does not yet add the processor that converts them into normalized `public.subscriptions` mutations.

5. **Stripe live path is not yet re-wired to the inbox table**
   This package makes that integration possible, but does not force it.

6. **No archival / retention strategy yet**
   `billing_provider_events` and `billing_entitlement_events` will eventually need retention, partitioning, or compaction rules.

7. **Provider enum strategy may need hardening**
   Today it is check constraints on text columns. A future dedicated enum type is reasonable once provider set stabilizes.

8. **Legacy Stripe-only columns may remain duplicated**
   This patch backfills provider-generic columns when legacy Stripe columns exist, but does not remove Stripe-shaped columns.

9. **No CI gate yet for generated type drift**
   The regeneration script exists, but CI should fail when migrations change and generated DB types are not refreshed.
