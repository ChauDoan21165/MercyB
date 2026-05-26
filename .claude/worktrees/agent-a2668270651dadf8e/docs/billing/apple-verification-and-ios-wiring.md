# Apple verification + iOS wiring notes

## New backend env vars

Set these for the Supabase edge functions:

- `APPLE_IAP_ISSUER_ID`
- `APPLE_IAP_KEY_ID`
- `APPLE_IAP_PRIVATE_KEY`
- `APPLE_BUNDLE_ID`
- `APPLE_APP_ID` (optional but recommended)

## What changed

### Backend verification path

`apple-iap-sync` no longer trusts the device payload by itself.

It now:

1. decodes the incoming StoreKit JWS only far enough to read the transaction id
2. calls Apple App Store Server API `GET /inApps/v1/transactions/{transactionId}`
3. compares the Apple-returned transaction against the device-submitted payload
4. writes only the Apple-confirmed transaction into `public.subscriptions`

### Notification path

`apple-server-notifications` now:

1. decodes the outer notification payload
2. extracts the embedded transaction id
3. fetches the same transaction from App Store Server API
4. projects canonical subscription state from the Apple-confirmed transaction

This keeps backend truth authoritative even if a client retries or sends malformed data.

## iOS client flow

`AppleSubscriptionService.swift` uses StoreKit 2 and preserves the Mercy Blade rule set:

1. start native purchase
2. require `.verified` transaction locally
3. send `transaction.jwsRepresentation` to `apple-iap-sync`
4. call `me-entitlement`
5. unlock only if backend says premium

The client still never treats native purchase success as entitlement by itself.