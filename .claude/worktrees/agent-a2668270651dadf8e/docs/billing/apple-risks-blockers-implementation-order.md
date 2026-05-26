# Apple Risks, Blockers, Unknowns, and Recommended Implementation Order

This document captures the remaining Apple MVP planning items for Mercy Blade.

## Scope

This plan assumes the existing architecture remains unchanged:

- Stripe web billing already exists
- `public.subscriptions` remains canonical
- `me-entitlement` remains the only premium truth
- clients never decide premium locally
- Apple purchases must end in canonical backend writes with `provider = 'apple'`

---

## Risks

### 1. Weak Apple-to-user linkage if `appAccountToken` is not used consistently

Apple can carry an app-supplied account token with subscription transactions. If Mercy Blade does not consistently attach a stable user-linked `appAccountToken` during Apple purchase flows, then `provider_customer_id` will be absent or unreliable for some Apple rows.

Impact:
- harder support and debugging
- weaker provider-side user correlation
- more complexity during restore and reconciliation flows

Recommendation:
- require a stable Mercy Blade user UUID as the Apple `appAccountToken` for all eligible purchase and restore flows

### 2. Notification delays or missed delivery

Apple server notifications improve lifecycle correctness, but they are not guaranteed to be the first signal received for a subscription change. A renewal or revocation may arrive late or be retried.

Impact:
- stale canonical subscription state if notifications are the only write path
- entitlement drift if no repair path exists

Recommendation:
- keep both paths:
  - device-driven `apple-iap-sync` for immediate post-purchase writes
  - `apple-server-notifications` for lifecycle maintenance
- add event persistence and idempotent replay support

### 3. Out-of-order lifecycle events

Apple lifecycle events can arrive out of order relative to local purchase syncs or to one another.

Impact:
- older events may overwrite newer truth if projection logic is naive
- revoked states could be accidentally overwritten by older active events

Recommendation:
- use projection rules that compare effective timestamps and state authority
- treat revocation as terminal unless a newer verified event proves otherwise

### 4. Grace period and retry policy ambiguity

If Billing Grace Period is enabled in App Store Connect, entitlement policy changes for failed renewals. If it is not enabled, the same payment issue may need different canonical handling.

Impact:
- entitlement behavior can be inconsistent if product and backend assumptions diverge
- support confusion during billing failures

Recommendation:
- decide explicitly before implementation whether Billing Grace Period is enabled
- document exact `past_due` entitlement rules in backend code and product docs

### 5. Apple sandbox vs production behavior differences

Apple purchase testing environments can behave differently from production, especially around renewals, timing compression, restore behavior, and event delivery cadence.

Impact:
- false confidence from sandbox tests
- production edge cases may still appear after launch

Recommendation:
- keep Apple environment metadata on stored events and subscription rows
- validate both sandbox and production handling paths before release

### 6. Single-row canonical model needs disciplined updates

Using one canonical row per Apple subscription chain is the right fit for Mercy Blade, but it requires clean update rules. Every renewal, cancellation, revocation, and expiration must mutate the same row correctly.

Impact:
- subtle bugs if code mixes transaction-level identifiers and chain-level identifiers
- duplicate rows if the upsert key is inconsistent

Recommendation:
- standardize on:
  - `provider = 'apple'`
  - `provider_subscription_id = originalTransactionId`
- never use `transactionId` as the canonical subscription identity

### 7. Client unlock drift if local state leaks into UX

Even a well-meaning temporary local "premium" flag after native success can violate the architecture.

Impact:
- premium unlock without backend truth
- inconsistent entitlement across devices or after reinstall
- harder reasoning about access bugs

Recommendation:
- enforce a single client rule:
  - native Apple success means "proof received", not "premium granted"
- only `me-entitlement` unlocks premium

---

## Blockers

### 1. App Store Connect setup is required before full end-to-end testing

Needed items:
- app record configured correctly
- auto-renewable subscription group created
- Apple subscription products created
- notification endpoint configured
- signing / credential material available for server verification

Without these, implementation can begin but complete validation cannot finish.

### 2. Server-side Apple verification configuration is required

Needed items:
- Apple verification library or equivalent verification implementation
- environment configuration for Apple credentials / keys
- secure secret storage in deployment environment

Without this, `apple-iap-sync` and `apple-server-notifications` cannot be trusted.

### 3. Schema compatibility must be confirmed

Need to confirm that `public.subscriptions` can represent:
- `provider = 'apple'`
- Apple provider identifiers
- canonical statuses
- current period dates
- useful metadata storage

If the schema lacks metadata or supporting event storage, minimal migrations will be required.

### 4. Client purchase implementation details must support proof forwarding

Need to confirm the iOS client can:
- collect signed transaction proof after purchase
- attach or preserve `appAccountToken`
- call backend immediately after success
- refresh `me-entitlement`

Without this, the post-purchase user experience will be incomplete.

---

## Unknowns

### 1. Final SKU set at launch

Unknown:
- monthly only for MVP
- monthly plus yearly at launch
- free trial or no free trial

Why it matters:
- affects App Store Connect setup
- affects pricing copy and intro-offer behavior
- affects initial test matrix

### 2. Billing Grace Period product decision

Unknown:
- whether Mercy Blade wants service to continue during payment recovery windows

Why it matters:
- changes entitlement behavior for `past_due`
- affects support and retention expectations

### 3. Restore-purchase UX expectations

Unknown:
- how much user-facing restore guidance is needed
- what retry / pending UI should look like if backend verification is slow or unavailable

Why it matters:
- affects implementation polish and support load

### 4. Exact metadata retention needs

Unknown:
- how much Apple raw payload and derived metadata Mercy Blade wants to retain long term

Why it matters:
- affects schema design
- affects auditability and support tooling
- affects privacy / retention decisions

### 5. Whether a repair/reconcile endpoint is needed in MVP

Unknown:
- whether to ship only the primary purchase and notification paths
- or include an admin/support reconciliation tool in the first release

Why it matters:
- impacts operational resilience
- impacts launch complexity

---

## Recommended implementation order

### Phase 1 — Product and provider setup

1. Create the Apple subscription group in App Store Connect
2. Create the MVP Apple subscription SKU(s)
3. Decide on free trial policy
4. Decide on Billing Grace Period policy
5. configure App Store Server Notifications V2

Goal:
- freeze Apple product setup before coding deeper lifecycle logic

### Phase 2 — Canonical backend mapping primitives

1. implement Apple verification helpers
2. implement a shared Apple-to-canonical mapper
3. implement canonical status derivation rules
4. confirm `public.subscriptions` schema compatibility
5. add event log table for Apple idempotency if needed

Goal:
- establish one shared projection layer before writing endpoint logic

### Phase 3 — Immediate purchase write path

1. build `supabase/functions/apple-iap-sync/index.ts`
2. verify Apple proof server-side
3. upsert canonical Apple subscription rows into `public.subscriptions`
4. test that `me-entitlement` reflects the backend write correctly

Goal:
- make the purchase flow usable end-to-end without waiting on notifications

### Phase 4 — Lifecycle notification path

1. build `supabase/functions/apple-server-notifications/index.ts`
2. verify signed notification payloads
3. persist raw events with idempotency keys
4. project events into canonical subscription rows
5. add out-of-order protection rules

Goal:
- keep subscription state correct over time

### Phase 5 — iOS client integration

1. wire native StoreKit purchase flow
2. send signed transaction proof to `apple-iap-sync`
3. refresh `me-entitlement`
4. unlock premium only from backend truth
5. add restore flow with the same rule

Goal:
- preserve architecture while delivering good UX

### Phase 6 — Resilience and support tooling

1. add replay / repair support for stored Apple events
2. consider an admin reconciliation endpoint
3. add logs and dashboards for Apple sync failures
4. document support playbooks for purchase verification issues

Goal:
- improve launch safety and post-launch operations

---

## Recommended MVP cut line

For the first Apple MVP, Mercy Blade should ship:

- one Apple subscription group
- one monthly Apple SKU
- backend Apple verification
- `apple-iap-sync`
- `apple-server-notifications`
- canonical writes into `public.subscriptions`
- `me-entitlement` driven unlocks only
- basic idempotency event logging

Can be deferred until later if needed:

- yearly SKU
- advanced offer logic
- admin reconciliation endpoint
- richer analytics and support dashboards

---

## Planning-phase definition of done

Apple planning is complete when all of the following are explicit:

- Apple product setup is defined
- Apple backend write path is defined
- Apple canonical mapping is explicit
- Apple entitlement behavior is explicit
- Apple notification lifecycle handling is explicit
- client unlock rules are explicit
- top risks, blockers, and unknowns are documented
- implementation order is sequenced

At that point, Mercy Blade has a concrete Apple MVP plan without redesigning the current billing architecture.
