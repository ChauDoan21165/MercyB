// src/lib/analytics.ts

export type AnalyticsEventName =
  | "pricing_viewed"
  | "checkout_started"
  | "checkout_completed"
  | "entitlement_success"
  | "l1_hint_learn_more_clicked"
  | "room_pronunciation_practice_opened"
  | "room_pronunciation_practice_closed"
  | `paywall_shown_${string}`
  // Onboarding funnel — `onboarding_step_complete`,
  // `onboarding_complete`, `onboarding_skipped`. Template-literal
  // scoped (same pattern as `paywall_shown_*`) so the funnel can grow
  // without re-touching this union.
  | `onboarding_${string}`;

export type AnalyticsPayload = Record<string, unknown>;

declare global {
  interface Window {
    // dataLayer accepts either gtag-style argument tuples (arrays) or
    // GTM-style event objects — `unknown` covers both. See
    // `src/lib/tracking/ga4.ts` for the gtag-tuple pattern.
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (
      eventName: string,
      options?: { props?: AnalyticsPayload },
    ) => void;
    analytics?: {
      track?: (eventName: string, payload?: AnalyticsPayload) => void;
    };
  }
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readEnv(name: string): string {
  try {
    return String((import.meta as ImportMeta | undefined)?.env?.[name] ?? "");
  } catch {
    return "";
  }
}

function isDebugEnabled(): boolean {
  const explicitDebug = readEnv("VITE_ANALYTICS_DEBUG").toLowerCase() === "true";
  const isDev = readEnv("DEV") === "true";

  return isDev || explicitDebug;
}

function nowIso(): string {
  return new Date().toISOString();
}

function isSerializableValue(value: unknown): boolean {
  if (value === undefined) return false;
  if (typeof value === "function") return false;
  if (typeof value === "symbol") return false;
  if (typeof value === "bigint") return false;
  return true;
}

function cleanPayload(payload?: AnalyticsPayload): AnalyticsPayload {
  if (!payload) return {};

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => isSerializableValue(value)),
  );
}

function normalizeSource(source: string): string {
  const normalized = String(source ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || "unknown";
}

function logDev(eventName: string, payload: AnalyticsPayload, timestamp: string): void {
  if (!isDebugEnabled()) return;

  console.info("[analytics]", {
    event: eventName,
    payload,
    timestamp,
  });
}

export function trackEvent(
  eventName: AnalyticsEventName,
  payload?: AnalyticsPayload,
): void {
  if (!isBrowser()) return;

  const safePayload = cleanPayload(payload);
  const timestamp = nowIso();

  logDev(eventName, safePayload, timestamp);

  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, safePayload);
    }
  } catch {
    // no-op
  }

  // Microsoft Clarity custom event. Clarity's `("event", name)` API
  // takes only the event name (payload is surfaced via `("set", k, v)`
  // tags, out of scope here). `window.clarity` is the queue shim seeded
  // by `src/lib/tracking/clarity.ts`; absent in dev / pre-consent →
  // skipped. Globally typed by clarity.ts (declaration merging).
  try {
    if (typeof window.clarity === "function") {
      window.clarity("event", eventName);
    }
  } catch {
    // no-op
  }

  try {
    if (typeof window.plausible === "function") {
      window.plausible(eventName, { props: safePayload });
    }
  } catch {
    // no-op
  }

  try {
    if (typeof window.analytics?.track === "function") {
      window.analytics.track(eventName, safePayload);
    }
  } catch {
    // no-op
  }

  try {
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...safePayload,
        timestamp,
      });
    }
  } catch {
    // no-op
  }
}

export function trackPricingViewed(payload?: AnalyticsPayload): void {
  trackEvent("pricing_viewed", payload);
}

export function trackCheckoutStarted(payload?: AnalyticsPayload): void {
  trackEvent("checkout_started", payload);
}

export function trackCheckoutCompleted(payload?: AnalyticsPayload): void {
  trackEvent("checkout_completed", payload);
}

export function trackEntitlementSuccess(payload?: AnalyticsPayload): void {
  trackEvent("entitlement_success", payload);
}

export function trackPaywallShown(
  source: string,
  payload?: AnalyticsPayload,
): void {
  const normalizedSource = normalizeSource(source);
  trackEvent(`paywall_shown_${normalizedSource}`, payload);
}

/**
 * Backward-compatible alias for callers using:
 * track("event_name", payload)
 */
export function track(
  eventName: AnalyticsEventName,
  payload?: AnalyticsPayload,
): void {
  trackEvent(eventName, payload);
}