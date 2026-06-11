# V4 Payment Architecture — Verification & iOS IAP Config Prep

> A2 verification pass — 2026-06-11. Read-only evidence; no code changed.

---

## 1. Web Checkout (Stripe) — Verified ✅

**Checkout initiation trace:**

| Step | File:Line | What happens |
|------|-----------|--------------|
| User taps plan | `src/screens/Pricing.tsx:372` | `handlePaidPlan(plan)` called |
| → billing helper | `src/screens/Pricing.tsx:408` | `startCheckoutOrOpenPortal({ priceId })` |
| → HTTP call | `src/lib/billing.ts:220` | Invokes `billing-stripe-change-plan` edge function |
| → Stripe session | `supabase/functions/billing-stripe-change-plan/index.ts:729` | `stripe.checkout.sessions.create()` (mode: subscription) |
| → Redirect | `src/lib/billing.ts:284` | `window.location.assign(checkoutUrl)` → Stripe hosted checkout |
| → Webhook | `supabase/functions/stripe-webhook/webhook-events.ts:570` | `handleCheckoutSessionCompleted` fires on `checkout.session.completed` |
| → DB write | `supabase/functions/stripe-webhook/webhook-events.ts:392` | `processSubscriptionLikeEvent` upserts `subscriptions` row, updates `profiles` |
| → UI refresh | `src/pages/BillingSuccessPage.tsx:63` | Polls `refreshEntitlements()` at 0/1200/2500/4500 ms |

**Live Stripe Price IDs** (hardcoded at `src/screens/Pricing.tsx:70-71`, override via env vars):
- Monthly: `price_1TCKY02K1tPxy04uCHQNbvik`
- Yearly: `price_1TCKSF2K1tPxy04uNeKcQWp5`

**Display pricing** (`src/lib/pricing/displayPrices.ts:24,40,43-44`):
- Monthly: 200,000 VND / $7.99 USD
- Yearly: 2,000,000 VND / $79.99 USD (≈17% savings vs 12 × monthly)

**Vietnamese payment methods:** None configured explicitly. Stripe uses automatic payment methods for the customer's region — Vietnamese cards and local bank transfers may appear if Stripe supports them for the VN locale. No VNPAY, MoMo, or explicit `payment_method_types` override is set.

---

## 2. iOS/Android Build Consumes me-entitlement — Verified ✅

**Entitlement check path (all platforms):**

```
useEntitlements() [src/lib/useEntitlements.ts:145]
  └─ useEntitlementQuery(userId) [src/lib/queries/useEntitlementQuery.ts]
       └─ getMeEntitlement() [src/lib/getMeEntitlement.ts:3]
            └─ supabase.functions.invoke("me-entitlement") [GET]
                 └─ reads `subscriptions` table (provider-agnostic)
                      ├─ Stripe subs  → written by stripe-webhook
                      └─ Apple IAP    → written by revenuecat-webhook
```

**No IAP-only gate.** `shouldShowIap()` (`src/lib/iap.ts:55-56`) gates only the **purchase UI** — on iOS it renders `<IapPlanCard>` instead of Stripe card buttons. The entitlement check (`me-entitlement`) is called identically on all platforms.

**RevenueCat user identity sync** (`src/providers/AuthProvider.tsx:59-70`): `syncRevenueCatOnAuth(userId)` fires on every auth state change, calling `Purchases.logIn({ appUserID: userId })`. This ties the Supabase user ID to RevenueCat so server-side webhooks from Apple match the right `subscriptions` row.

**iOS IAP post-purchase flow:**
1. User taps plan in `IapPlanCard` → `purchasePackageById()` (`src/lib/iap.ts:190`) → Apple purchase sheet
2. Apple charges → RevenueCat receives StoreKit receipt → fires `revenuecat-webhook`
3. `supabase/functions/revenuecat-webhook/index.ts` upserts `subscriptions` row (provider = "apple")
4. `me-entitlement` now returns `is_premium: true` for the user — same function, same table

---

## 3. Gaps Where a Fresh Build Would NOT Recognize Web-Purchased Entitlement

### Gap A — "Manage subscription" misdirects Stripe subscribers on iOS ⚠️

**File:Line:** `src/screens/Pricing.tsx:796-800` (hasPremium block) and `src/screens/Pricing.tsx:852-855` (already-subscribed panel)

**The bug:** When `isIos === true`, the "Manage subscription" button **always** opens `APPLE_MANAGE_SUBSCRIPTIONS_URL` (`https://apps.apple.com/account/subscriptions`) — regardless of whether the subscription was purchased via Stripe (web) or Apple IAP. A web Stripe subscriber opening the iOS app will:
- ✅ See `hasPremium = true` (entitlement recognized correctly via `me-entitlement`)
- ✅ Have full access to premium content
- ⚠️ Get sent to Apple's subscription page when they tap "Manage in Apple" — Apple has no record of their Stripe subscription, so they see nothing to manage

**Severity:** Medium — does not break access, but creates a confusing dead end when a web subscriber tries to cancel or change plan from iOS. The correct destination for them is the Stripe Billing Portal.

**Fix (not implemented — flagged for follow-up):** Check `entitlement.source` inside the `isIos` branch:
```typescript
// In Pricing.tsx manage button onClick:
if (isIos) {
  if (entitlement?.source === "stripe") {
    void handleManageSubscription(); // opens Stripe portal
  } else {
    window.open(APPLE_MANAGE_SUBSCRIPTIONS_URL, ...);
  }
  return;
}
```

### Gap B — gift_code table not bridged to `subscriptions` in me-entitlement ⚠️ (known)

`me-entitlement` has a fallback to `user_subscriptions` for gift codes (`supabase/functions/me-entitlement/index.ts:42-63`) but the client-side `useEntitlements.ts` also has a parallel `fetchActiveGiftSubscription` call as a client-side overlay. The two paths are redundant but not harmful. Noted in code comment at `useEntitlements.ts:101-113`.

---

## 4. iOS IAP Product Config for App Store Connect

Chau creates these products in **App Store Connect → Apps → MercyBlade → Subscriptions**.

### Subscription Group

| Field | Value |
|-------|-------|
| Group name | MercyBlade Premium |
| Reference name | mercyblade_premium_group |

### Product 1 — Monthly

| Field | Value |
|-------|-------|
| **Product ID** | `mercy.premium.monthly` |
| Reference name | MercyBlade Premium Monthly |
| Duration | 1 month (auto-renewing) |
| Price (USD) | **$7.99 / month** |
| Price (VND) | 79,000 VND (App Store Tier — nearest to 200,000 ÷ ~29,000 FX ≈ $6.90; pick Tier 7 = $7.99 = ~229,000 VND, or confirm with ASC VND tier table) |
| Localization title (EN) | MercyBlade Premium — Monthly |
| Localization title (VI) | MercyBlade Premium — Hàng tháng |
| Free trial | Optional: 3-day (matches backend trial window in `me-entitlement`) |

### Product 2 — Yearly

| Field | Value |
|-------|-------|
| **Product ID** | `mercy.premium.yearly` |
| Reference name | MercyBlade Premium Yearly |
| Duration | 1 year (auto-renewing) |
| Price (USD) | **$79.99 / year** |
| Price (VND) | 799,000 VND (nearest App Store VND tier; confirm with ASC) |
| Localization title (EN) | MercyBlade Premium — Yearly (Save 17%) |
| Localization title (VI) | MercyBlade Premium — Hàng năm (Tiết kiệm 17%) |
| Free trial | Optional: same 3-day window |

> **App Store VND note:** Apple's VND price tiers are fixed (49k / 99k / 149k / 199k / 249k / …). The Stripe prices (200k/month, 2M/year) don't map cleanly to App Store tiers. Chau must pick the closest tier in ASC. Apple's in-app purchase price ≠ Stripe price is fine — they are independent billing channels.

### RevenueCat Dashboard — Required Config

After creating the products in ASC, configure RevenueCat:

1. **App → Products:** add `mercy.premium.monthly` and `mercy.premium.yearly`
2. **Entitlement:** create entitlement named **`MercyBlade Pro`** (must match `IAP_ENTITLEMENT_ID` at `src/lib/iap.ts:35`)
3. **Offering:** create a default offering named `default`; attach both products as Monthly and Annual packages
4. **Webhook:** `supabase/functions/revenuecat-webhook` must be registered in RevenueCat → Project Settings → Webhooks with the edge function URL and a shared secret set as `REVENUECAT_WEBHOOK_AUTH_TOKEN` in Supabase secrets

### Apple Small Business Program

- **What:** 15% commission instead of 30% on App Store revenue if annual App Store proceeds < $1M USD
- **Eligibility:** MercyBlade almost certainly qualifies in Year 1
- **Apply at:** https://developer.apple.com/app-store/small-business-program/
- **When to apply:** Before first IAP goes live. If already live, applies to subsequent fiscal years after enrollment
- **Effect on pricing:** No change to user-facing price; Apple just takes a smaller cut

---

## 5. Summary Table

| Check | Status | Evidence |
|-------|--------|---------|
| Web Stripe checkout wired | ✅ | `Pricing.tsx:408` → `billing.ts:220` → `billing-stripe-change-plan` edge fn |
| Stripe webhook writes to `subscriptions` | ✅ | `stripe-webhook/webhook-events.ts:392` |
| iOS build reads `me-entitlement` (not IAP-only) | ✅ | `useEntitlements.ts:154` + `iap.ts:55-56` only gates purchase UI |
| RevenueCat writes to same `subscriptions` table | ✅ | `revenuecat-webhook/index.ts` upserts `subscriptions` |
| Web-purchased Stripe sub recognized on iOS | ✅ | Same `me-entitlement` endpoint, provider-agnostic |
| "Manage" button correct for Stripe-on-iOS | ⚠️ **GAP** | `Pricing.tsx:796` always sends to Apple; Stripe sub = dead end |
| App Store product IDs defined | ✅ | `iap.ts:23,26` — products not yet created in ASC |
| RevenueCat entitlement name | ✅ | `iap.ts:35` = `"MercyBlade Pro"` |

---

*Generated by A2 verification pass. No code was modified. Gap A should be fixed before iOS launch.*
