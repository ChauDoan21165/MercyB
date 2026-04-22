// src/lib/iap.ts
//
// RevenueCat wrapper for Apple In-App Purchase.
//
// Scope (Step 4 of IAP track): configure + offerings + purchase + restore
// + entitlement check + "manage subscription" helper. All helpers no-op
// on non-iOS platforms so the same module is safe to import from shared
// components.
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

/**
 * Apple's deep link to the user's subscriptions page. Works from a
 * Capacitor webview via the standard URL scheme; iOS routes it to the
 * App Store app.
 */
export const APPLE_MANAGE_SUBSCRIPTIONS_URL =
  "https://apps.apple.com/account/subscriptions";

// ── Init state ──────────────────────────────────────────────────────────────

let initialized = false;

/** Whether Purchases.configure() has completed successfully. */
export function isIapReady(): boolean {
  return initialized;
}

/** True when this runtime should show the IAP flow (iOS native + SDK ready). */
export function shouldShowIap(): boolean {
  return getPlatform() === "ios" && isNativePlatform();
}

// ── Configure ───────────────────────────────────────────────────────────────

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

// ── Types surfaced to UI layer ──────────────────────────────────────────────

/**
 * Minimal shape used by UI. We don't re-export RevenueCat's full types
 * so consumers aren't forced to import the plugin on web.
 */
export type IapPackageSummary = {
  /** Opaque identifier passed back into `purchasePackage()`. */
  packageId: string;
  /** App Store Connect product identifier. */
  productId: string;
  /** Localized price string ready for display ("199.000 ₫"). */
  priceString: string;
  /** Numeric price in the store currency (for analytics). */
  price: number;
  /** ISO currency code (VND, USD, ...). */
  currencyCode: string;
  /** Raw Package reference held by this module for later purchase calls. */
  _ref: unknown;
};

export type OfferingsResult =
  | { ok: true; monthly: IapPackageSummary | null; yearly: IapPackageSummary | null }
  | { ok: false; error: string };

export type PurchaseResult =
  | { ok: true; hasEntitlement: boolean }
  | { ok: false; cancelled: boolean; error: string };

export type RestoreResult =
  | { ok: true; hasEntitlement: boolean }
  | { ok: false; error: string };

export type EntitlementSnapshot = {
  hasEntitlement: boolean;
  productIdentifier?: string | null;
  expirationDateISO?: string | null;
};

// ── Internal package cache ──────────────────────────────────────────────────
// When we return IapPackageSummary objects to the UI we strip the raw plugin
// types, but we still need a handle to pass back into purchasePackage(). We
// cache the raw Package references keyed by our opaque packageId so the UI
// layer can stay plugin-agnostic.

type RawPackage = unknown;
const packageCache = new Map<string, RawPackage>();

// ── Offerings ───────────────────────────────────────────────────────────────

/**
 * Fetch the current offering from RevenueCat and extract the monthly +
 * yearly packages. Returns { ok: false } on web, missing SDK config, or
 * network errors — callers should render a disabled state.
 */
export async function getIapOfferings(): Promise<OfferingsResult> {
  if (!shouldShowIap()) return { ok: false, error: "IAP not available on this platform" };
  if (!initialized) return { ok: false, error: "IAP not configured" };

  try {
    const { Purchases } = await import("@revenuecat/purchases-capacitor");
    const result = await Purchases.getOfferings();
    const current = result.current;
    if (!current) {
      return { ok: false, error: "No offering is active in the RevenueCat dashboard" };
    }

    let monthly: IapPackageSummary | null = null;
    let yearly: IapPackageSummary | null = null;

    for (const pkg of current.availablePackages) {
      const productId = pkg.product?.identifier ?? "";
      const summary: IapPackageSummary = {
        packageId: pkg.identifier,
        productId,
        priceString: pkg.product?.priceString ?? pkg.product?.price?.toString() ?? "",
        price: Number(pkg.product?.price ?? 0),
        currencyCode: pkg.product?.currencyCode ?? "",
        _ref: pkg,
      };
      packageCache.set(pkg.identifier, pkg);

      if (productId === IAP_PRODUCT_MONTHLY) monthly = summary;
      else if (productId === IAP_PRODUCT_YEARLY) yearly = summary;
    }

    return { ok: true, monthly, yearly };
  } catch (err) {
    const message = errorMessage(err);
    console.error("[iap] getIapOfferings failed:", err);
    return { ok: false, error: message };
  }
}

// ── Purchase ────────────────────────────────────────────────────────────────

/**
 * Trigger the Apple purchase sheet for the given package. Resolves with a
 * typed result; never throws. `cancelled:true` distinguishes user dismissal
 * from real failures so the UI can stay silent on cancel (Apple UX norm).
 */
export async function purchasePackageById(
  packageId: string,
): Promise<PurchaseResult> {
  if (!shouldShowIap()) {
    return { ok: false, cancelled: false, error: "IAP not available" };
  }
  if (!initialized) {
    return { ok: false, cancelled: false, error: "IAP not configured" };
  }

  const raw = packageCache.get(packageId);
  if (!raw) {
    return { ok: false, cancelled: false, error: "Unknown package — reload pricing page" };
  }

  try {
    const { Purchases } = await import("@revenuecat/purchases-capacitor");
    const result = await Purchases.purchasePackage({ aPackage: raw as never });
    const has = hasActiveEntitlementInCustomerInfo(result.customerInfo);
    return { ok: true, hasEntitlement: has };
  } catch (err) {
    const cancelled = isUserCancelled(err);
    return {
      ok: false,
      cancelled,
      error: cancelled ? "cancelled" : mapPurchaseError(err),
    };
  }
}

// ── Restore ─────────────────────────────────────────────────────────────────

/** Restore purchases made under the current Apple ID. */
export async function restorePurchases(): Promise<RestoreResult> {
  if (!shouldShowIap()) return { ok: false, error: "IAP not available" };
  if (!initialized) return { ok: false, error: "IAP not configured" };

  try {
    const { Purchases } = await import("@revenuecat/purchases-capacitor");
    const result = await Purchases.restorePurchases();
    return { ok: true, hasEntitlement: hasActiveEntitlementInCustomerInfo(result.customerInfo) };
  } catch (err) {
    console.error("[iap] restorePurchases failed:", err);
    return { ok: false, error: errorMessage(err) };
  }
}

// ── Entitlement check ───────────────────────────────────────────────────────

/** Read current entitlement from RevenueCat's local cache. */
export async function getCurrentEntitlement(): Promise<EntitlementSnapshot> {
  if (!shouldShowIap()) return { hasEntitlement: false };
  if (!initialized) return { hasEntitlement: false };

  try {
    const { Purchases } = await import("@revenuecat/purchases-capacitor");
    const result = await Purchases.getCustomerInfo();
    const entitlement = result.customerInfo?.entitlements?.active?.[IAP_ENTITLEMENT_ID];
    if (!entitlement) return { hasEntitlement: false };
    return {
      hasEntitlement: true,
      productIdentifier: entitlement.productIdentifier ?? null,
      expirationDateISO: entitlement.expirationDate ?? null,
    };
  } catch (err) {
    console.warn("[iap] getCurrentEntitlement failed:", err);
    return { hasEntitlement: false };
  }
}

// ── Internal helpers ────────────────────────────────────────────────────────

function hasActiveEntitlementInCustomerInfo(info: unknown): boolean {
  try {
    const active = (info as { entitlements?: { active?: Record<string, unknown> } })
      ?.entitlements?.active;
    return Boolean(active && IAP_ENTITLEMENT_ID in active);
  } catch {
    return false;
  }
}

function isUserCancelled(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const anyErr = err as { userCancelled?: unknown; code?: unknown };
  if (anyErr.userCancelled === true) return true;
  // Fallback: PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR = "1"
  if (anyErr.code === "1" || anyErr.code === 1) return true;
  return false;
}

function errorMessage(err: unknown): string {
  if (!err) return "Unknown error";
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    const anyErr = err as { message?: unknown };
    if (typeof anyErr.message === "string") return anyErr.message;
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

/**
 * Map PURCHASES_ERROR_CODE to a short, user-safe string. The caller will
 * wrap this in Vietnamese-first copy as needed. We never leak internal
 * codes into the UI — this maps to a stable friendly token the UI can
 * switch on if it wants richer phrasing.
 */
function mapPurchaseError(err: unknown): string {
  if (!err || typeof err !== "object") return "unknown";
  const code = String((err as { code?: unknown }).code ?? "");
  switch (code) {
    case "1":  return "cancelled";
    case "2":  return "store_problem";
    case "3":  return "purchase_not_allowed";
    case "5":  return "product_not_available";
    case "6":  return "already_purchased";
    case "7":  return "receipt_in_use_other";
    case "10": return "network";
    case "15": return "operation_in_progress";
    case "20": return "payment_pending";
    case "35": return "offline";
    default:   return errorMessage(err);
  }
}
