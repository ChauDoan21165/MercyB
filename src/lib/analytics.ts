// src/lib/analytics.ts

import { supabase } from "@/lib/supabaseClient";
import { isFlagEnabledForUser } from "@/lib/featureFlags";

export type AnalyticsEventName =
  | "pricing_viewed"
  | "checkout_started"
  | "checkout_completed"
  | "price_test_variant_exposure"
  | "price_test_checkout_start"
  | "price_test_checkout_complete"
  | "entitlement_success"
  | "l1_hint_learn_more_clicked"
  | "register_correction_shown"
  | "room_pronunciation_practice_opened"
  | "room_pronunciation_practice_closed"
  | "pronunciation_scored"
  | `paywall_shown_${string}`
  // Onboarding funnel — `onboarding_step_complete`,
  // `onboarding_complete`, `onboarding_skipped`. Template-literal
  // scoped (same pattern as `paywall_shown_*`) so the funnel can grow
  // without re-touching this union.
  | `onboarding_${string}`;

export type AnalyticsPayload = Record<string, unknown>;

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

export function trackPriceTestVariantExposure(payload?: AnalyticsPayload): void {
  trackEvent("price_test_variant_exposure", payload);
}

export function trackPriceTestCheckoutStart(payload?: AnalyticsPayload): void {
  trackEvent("price_test_checkout_start", payload);
}

export function trackPriceTestCheckoutComplete(payload?: AnalyticsPayload): void {
  trackEvent("price_test_checkout_complete", payload);
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

export type FeatureOutcomeEvent = "shown" | "engaged" | "completed";

/**
 * First-party feature-outcome telemetry for the D1/D7/D30 success gate.
 * Inserts one row into public.feature_outcome_events (read by the
 * get_feature_outcome RPC). Distinct from trackEvent: this is product
 * telemetry, NOT marketing — it is independent of setMarketingConsent.
 *
 * Gated per-user behind the DB-backed `RETENTION_OUTCOME_EVENTS` feature flag
 * (public.feature_flags / feature_flags_public). It ships dark: with no flag
 * row the gate returns false and nothing is emitted — flip it on per launch.
 * Fire-and-forget; never throws (telemetry must not break a feature path).
 */
export async function emitFeatureOutcome(
  featureKey: string,
  event: FeatureOutcomeEvent,
  payload?: AnalyticsPayload,
): Promise<void> {
  if (!isBrowser()) return;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return; // authenticated-only emit (RLS: user_id = auth.uid())

    // isFlagEnabledForUser takes a hand-rolled MinimalSupabaseClient (server
    // shape); the real browser client is structurally wider, so cast through
    // the parameter type. Runtime-identical — same .from().select().eq().maybeSingle().
    const enabled = await isFlagEnabledForUser(
      supabase as unknown as Parameters<typeof isFlagEnabledForUser>[0],
      "RETENTION_OUTCOME_EVENTS",
      user.id,
    );
    if (!enabled) return;

    await supabase.from("feature_outcome_events").insert({
      user_id: user.id,
      feature_key: featureKey,
      event,
      payload: cleanPayload(payload) ?? {},
      occurred_at: nowIso(),
    });
  } catch {
    // fire-and-forget
  }
}
