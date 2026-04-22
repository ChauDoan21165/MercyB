// src/lib/iap.ts
//
// RevenueCat wrapper for Apple In-App Purchase.
//
// Current scope (Step 2 of IAP track): SDK configuration only. The
// offerings / purchase / restore / customer-info methods land in Step 4
// when the IAP UI consumes them.
//
// Constants here are the single source of truth for:
//   - App Store Connect product IDs (must match ASC exactly)
//   - RevenueCat entitlement identifier (may be renamed in dashboard)
// Update these in one place, not scattered across components.

import { getPlatform, isNativePlatform } from "./platform";

// ── Product + entitlement identifiers ───────────────────────────────────────
// These MUST match the values configured in App Store Connect and the
// RevenueCat dashboard. Changing them here without matching the dashboards
// silently breaks purchases.

/** App Store Connect product ID — monthly subscription. */
export const IAP_PRODUCT_MONTHLY = "mercy.premium.monthly";

/** App Store Connect product ID — yearly subscription. */
export const IAP_PRODUCT_YEARLY = "mercy.premium.yearly";

/**
 * RevenueCat entitlement identifier. When this is "active" in
 * customerInfo.entitlements, the user has premium access.
 *
 * Chau may rename to "pro" in the RevenueCat dashboard later — update
 * this constant and any webhook mapping to match.
 */
export const IAP_ENTITLEMENT_ID = "MercyBlade Pro";

// ── Init state ──────────────────────────────────────────────────────────────
// Module-level flag so initRevenueCat() is safe to call multiple times
// (React StrictMode double-mount, AuthProvider re-renders, etc.).

let initialized = false;

/** Whether Purchases.configure() has completed successfully. */
export function isIapReady(): boolean {
  return initialized;
}

// ── Configure ───────────────────────────────────────────────────────────────

/**
 * Initialise the RevenueCat SDK. Idempotent.
 *
 * No-op on web or Android; IAP is iOS-only on this project (Android uses
 * Stripe/MoMo/etc. per NORTH_STAR). Lazy-imports the plugin so the web
 * bundle does not pull in the native bridge module.
 *
 * If VITE_REVENUECAT_APPLE_API_KEY is missing at runtime on iOS, logs a
 * clear warning and returns without throwing. Downstream UI should render
 * a disabled "IAP not configured" state in that case rather than crashing.
 */
export async function initRevenueCat(): Promise<void> {
  if (initialized) return;
  if (getPlatform() !== "ios") return;
  if (!isNativePlatform()) return;

  const apiKey = (import.meta.env as Record<string, string | undefined>)
    ?.VITE_REVENUECAT_APPLE_API_KEY;
  if (!apiKey) {
    console.warn(
      "[iap] VITE_REVENUECAT_APPLE_API_KEY is not set; RevenueCat init skipped. " +
        "IAP purchase UI will render a disabled state.",
    );
    return;
  }

  try {
    const { Purchases, LOG_LEVEL } = await import(
      "@revenuecat/purchases-capacitor"
    );
    await Purchases.setLogLevel({ level: LOG_LEVEL.WARN });
    await Purchases.configure({ apiKey });
    initialized = true;
    console.info("[iap] RevenueCat configured");
  } catch (err) {
    console.error("[iap] RevenueCat configure failed:", err);
  }
}
