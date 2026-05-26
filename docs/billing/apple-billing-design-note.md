# Apple billing design note — Mercy Blade

Owner: Apple IAP workstream  
Status: MVP proposal  
Scope: Step 1 only — Apple-side billing model

## Goals

Add Apple subscriptions without changing the current billing architecture:

- `public.subscriptions` remains canonical
- `me-entitlement` remains the only premium truth
- clients never decide premium locally
- Apple-backed rows must preserve `provider = 'apple'`

## Recommendation

Use **App Store auto-renewable subscriptions** for Mercy Blade premium.

Use **one subscription group** for all Mercy Blade premium products.

This keeps Apple subscription state simple and aligned with the backend model:
- one user can hold one active Mercy Blade Apple subscription at a time
- monthly/yearly can be added later without changing canonical mapping
- introductory offer eligibility stays scoped to one Mercy Blade premium group

## App Store Connect products

### Subscription group

- Display name: `Mercy Blade Premium`
- Internal note: all premium Apple SKUs live in this group

### MVP products

Create at least:

- `mb.premium.monthly`

Optional later:

- `mb.premium.yearly`

## Product ID naming scheme

Use stable reverse-DNS style IDs:

- `mb.premium.monthly`
- `mb.premium.yearly`

Rules:
- do not include environment in the product id
- do not include iOS versioning in the product id
- product id should map directly to canonical `provider_price_id`
- keep ids stable forever after release

## Free trial mapping

### MVP recommendation

Default recommendation: **no free trial for initial Apple MVP**.

Reason:
- reduces launch complexity
- avoids trial edge cases while Apple ingestion path is new
- makes first Apple backend rollout easier to validate against Stripe behavior

### If product wants a trial at launch

Allow **one introductory free trial on `mb.premium.monthly`**.

Canonical mapping if enabled:
- Apple introductory free trial active -> canonical status `trialing`
- entitlement still comes only from backend truth
- client still must not unlock locally

Do **not** create separate "trial" SKUs.
The trial should remain an Apple offer attached to the regular subscription product.

## Canonical Apple -> backend status mapping

Use these canonical statuses for Apple-backed subscription rows:

| Apple condition | Canonical status | Notes |
|---|---|---|
| active paid subscription | `active` | premium should be on |
| active introductory free trial | `trialing` | premium should be on |
| auto-renew turned off but current period still active | `canceled` | premium stays on until period end |
| billing retry / grace period while service window is still valid | `past_due` | premium stays on while current period remains valid |
| subscription period ended with no valid renewal | `expired` | premium off |
| refund / revocation | `revoked` | premium off immediately |

## Design constraints preserved

This Apple model does **not** change the Mercy Blade architecture:

- Apple purchase success on device is not entitlement
- Apple transactions must be validated by backend
- backend must write canonical rows to `public.subscriptions`
- `me-entitlement` must continue to read only backend truth
- premium unlock must happen only after backend sync + entitlement refresh

## MVP decision summary

For the first Apple release:

- billing type: **auto-renewable subscription**
- subscription group: **one** (`Mercy Blade Premium`)
- initial SKU: **`mb.premium.monthly`**
- yearly SKU: optional later (`mb.premium.yearly`)
- free trial: **off by default for MVP**
- Apple provider marker: **`provider = 'apple'`**
- canonical SKU mapping: **Apple `productId` -> `provider_price_id`**

## Out of scope for this file

This note does not define:
- backend function request/response contracts
- notification ingestion logic
- database field mapping details
- client purchase sync flow

Those belong to steps 2 through 5.
