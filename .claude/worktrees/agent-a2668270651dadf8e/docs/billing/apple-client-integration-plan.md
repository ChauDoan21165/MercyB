# Apple Client Integration Plan

This document defines the iOS client flow for Apple subscriptions in Mercy Blade.

## Scope

This plan preserves the existing architecture:

- Stripe web billing already exists
- `public.subscriptions` remains canonical
- `me-entitlement` is the only premium truth
- clients must never decide premium locally
- Apple purchases must end in canonical backend writes with `provider = 'apple'`

## Core rule

A successful native Apple purchase on device is **not enough** to unlock premium.

The app must:

1. complete the native Apple purchase flow
2. send Apple purchase proof to the backend
3. wait for backend sync to write canonical subscription state
4. refresh entitlement from the backend
5. unlock premium only if `me-entitlement` says premium

## Short client flow

### 1. Purchase started

The user taps the Apple subscription purchase CTA in the iOS app.

Client behavior:

- launch the native StoreKit purchase flow
- attach a stable Mercy Blade user-linked `appAccountToken` if supported in the purchase path
- show loading / purchasing state in the UI
- do not pre-emptively unlock premium

### 2. Purchase success on device

The native purchase finishes successfully and the client receives a verified StoreKit transaction on device.

Client behavior:

- extract the Apple purchase proof needed by the backend
  - preferred: signed transaction payload / JWS
  - fallback: transaction id if the backend supports lookup by transaction id
- treat this as **purchase proof only**
- do not set local premium flags
- do not persist any local "isPremium = true" decision from native success

### 3. Backend sync

Immediately after native success, the client must call the Apple sync endpoint.

Recommended endpoint:

- `supabase/functions/apple-iap-sync/index.ts`

Recommended request body:

```json
{
  "signedTransactionInfo": "Apple signed transaction JWS",
  "appAccountToken": "stable-mercy-blade-user-uuid",
  "environmentHint": "Production"
}
```

Client behavior:

- send the proof to backend over the authenticated session
- wait for backend success
- handle retries safely if the network fails
- do not unlock premium just because the sync request returned 200 unless entitlement is refreshed and confirmed separately

## 4. Entitlement refresh

After backend sync completes, the client must refresh backend entitlement.

Recommended endpoint:

- `me-entitlement`

Client behavior:

- request current entitlement from backend
- replace any stale local entitlement cache with backend truth
- treat `me-entitlement` as the only source of premium state

## 5. Unlock

Only unlock premium when `me-entitlement` returns premium access.

Client behavior:

- unlock premium features only after backend-confirmed entitlement is true
- otherwise continue showing locked state, pending state, or retry UI
- if backend says not premium, the client must stay non-premium even if Apple purchase success was seen locally

## Client rules

### Allowed

The client may:

- show purchase progress
- show "verifying purchase" state after device success
- retry backend sync on transient failure
- refresh entitlement on foreground, restore, or account switch
- show backend-derived premium state from `me-entitlement`

### Not allowed

The client must not:

- unlock premium directly from StoreKit purchase success
- decide premium from local receipt validation alone
- write canonical subscription state locally
- treat Apple as the final entitlement source on device
- bypass backend sync

## Recommended UX states

Use explicit UI states so the flow is clear and safe:

- `idle`
- `purchasing`
- `verifying_with_backend`
- `premium_unlocked`
- `purchase_pending`
- `verification_failed`

### Suggested behavior

- after native success: move to `verifying_with_backend`
- after backend sync + positive entitlement: move to `premium_unlocked`
- after backend sync succeeds but entitlement is still false: stay locked and show retry / support path
- after network failure: show pending / retry state, not premium

## Restore purchases flow

The restore flow should follow the same backend-truth rule.

Client behavior:

1. start native restore using Apple APIs
2. obtain the restored transaction proof
3. send proof to `apple-iap-sync`
4. refresh `me-entitlement`
5. unlock only if backend entitlement is true

Do not unlock premium immediately from a successful restore response alone.

## App launch / foreground refresh

To reduce drift and converge quickly on backend truth, the client should refresh entitlement:

- on app launch
- on returning to foreground
- after account login
- after account switch
- after purchase / restore
- after billing-related UI returns from Apple subscription management

This refresh should read from `me-entitlement`, not from local purchase state.

## Error handling

### Purchase succeeds on device but backend sync fails

Client behavior:

- do not unlock premium
- show "Purchase received, verifying..." or equivalent
- allow retry of backend sync
- refresh entitlement again before concluding failure

### Backend sync succeeds but entitlement still false

Client behavior:

- do not unlock premium
- retry entitlement refresh once or twice if appropriate
- if still false, show support path and keep the account non-premium

### Duplicate sync attempts

Client behavior:

- safe to retry
- rely on backend idempotency
- do not create extra local state branches

## Minimal implementation contract

The iOS app implementation is correct only if all of the following are true:

- native Apple purchase success does not directly unlock premium
- the app sends Apple proof to backend immediately after success
- backend writes canonical Apple subscription data into `public.subscriptions`
- the app refreshes `me-entitlement`
- unlock happens only from backend entitlement

## MVP recommendation

For MVP, keep the client logic simple:

1. start purchase
2. on native success, collect signed transaction proof
3. call `apple-iap-sync`
4. call `me-entitlement`
5. unlock only if `me-entitlement` returns premium

That keeps the client thin and preserves Mercy Blade's current billing architecture.
