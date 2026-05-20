/**
 * Client-side gate for the session + behavior tracking writers.
 *
 * Both user_sessions and user_behavior_tracking writes are gated by the
 * same feature flag (`behaviorTrackingEnabled`) so one SQL toggle kills
 * all telemetry writes if anything misbehaves in production.
 *
 * Resolution mirrors src/hooks/useFeatureFlag.ts:
 *   1. enabled_user_ids contains current user → ON
 *   2. is_enabled = true                      → ON (global)
 *   3. otherwise                              → OFF
 *
 * Result is cached in-memory per userId for TTL_MS to keep the flag
 * lookup off the hot path — behavior writes happen on every keyword
 * tap, so we must not issue a Supabase request per event.
 *
 * ── Marketing tracking ─────────────────────────────────────────────
 *
 * `isMarketingTrackingEnabled` and `setMarketingConsent` (below) gate
 * UTM capture, Facebook Pixel, and GA4. They run BEFORE auth (so they
 * can't depend on `userId`) and BEFORE the network is touched (so a
 * Supabase outage doesn't leak a tracker). They use localStorage
 * because consent is per-device, not per-session.
 *
 * Default posture: tracking is ON unless the user explicitly opts
 * out. MercyBlade currently markets only inside Vietnam and the US;
 * neither GDPR (EU) nor LGPD (Brazil) hard-applies. If we open EU
 * traffic, swap the default to OFF and gate behind a banner — see
 * the runbook (`reports/a4-tracking-runbook.md`).
 *
 * Native gate: marketing tracking is WEB-ONLY. `initMarketingTracking`
 * short-circuits on iOS/Android (Capacitor native shell) before any
 * consent read, tracker import, or script injection. The shipped
 * privacy policy promises this verbatim ("the iOS and Android apps do
 * not use Clarity"); the early-return is what makes that true in code
 * and keeps the App Store / Play store privacy declarations honest.
 * See `reports/AUDIT-appstore-readiness-2026-05-19-A41.md` Blocker 1.
 */
import { isNativePlatform } from "@/lib/platform";
import { supabase } from "@/lib/supabaseClient";

const FLAG_KEY = "behaviorTrackingEnabled";
const TTL_MS = 5 * 60 * 1000; // 5 min — short enough for flag flips to take effect fast

type CacheEntry = { enabled: boolean; expiresAt: number };

const cache = new Map<string, CacheEntry>();

/**
 * Reset cache — test-only.
 */
export function __resetTrackingFlagCacheForTests(): void {
  cache.clear();
}

export async function isTrackingEnabled(
  userId: string | null | undefined,
): Promise<boolean> {
  if (!userId) return false;

  const cached = cache.get(userId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.enabled;
  }

  try {
    const { data, error } = await supabase
      .from("feature_flags")
      .select("is_enabled, enabled_user_ids")
      .eq("flag_key", FLAG_KEY)
      .maybeSingle();

    if (error || !data) {
      cache.set(userId, { enabled: false, expiresAt: Date.now() + TTL_MS });
      return false;
    }

    const cohort = Array.isArray(data.enabled_user_ids)
      ? data.enabled_user_ids
      : [];
    const enabled = cohort.includes(userId) || !!data.is_enabled;

    cache.set(userId, { enabled, expiresAt: Date.now() + TTL_MS });
    return enabled;
  } catch {
    cache.set(userId, { enabled: false, expiresAt: Date.now() + TTL_MS });
    return false;
  }
}

// ── Marketing-tracking consent (UTM + Pixel + GA4) ─────────────────────────

const MARKETING_OPT_OUT_KEY = "mb_marketing_opt_out";

function safeLocalStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Synchronous consent check. Returns `true` unless the user has
 * explicitly opted out. Used by the tracking init path before auth
 * is resolved, so it can't be async.
 */
export function isMarketingTrackingEnabled(): boolean {
  const ls = safeLocalStorage();
  if (!ls) return false;
  try {
    return ls.getItem(MARKETING_OPT_OUT_KEY) !== "1";
  } catch {
    return false;
  }
}

/**
 * Store the user's consent decision. Pass `false` to opt out — the
 * loader will skip Pixel + GA4 script injection on next boot.
 *
 * Note: existing in-flight scripts already on the page won't unload
 * mid-session. Reload after toggling to fully stop tracking.
 */
export function setMarketingConsent(consent: boolean): void {
  const ls = safeLocalStorage();
  if (!ls) return;
  try {
    if (consent) {
      ls.removeItem(MARKETING_OPT_OUT_KEY);
    } else {
      ls.setItem(MARKETING_OPT_OUT_KEY, "1");
    }
  } catch {
    /* ignore */
  }
}

/**
 * One-shot initializer for marketing tracking. Capture UTM →
 * Pixel + GA4 → fire the initial pageview. Always safe to call
 * multiple times (each loader is idempotent) and from any boot
 * order.
 *
 * Returns a small status object that the runbook documents — useful
 * when debugging "did Pixel actually load on production?"
 *
 * WEB-ONLY: returns the all-false status immediately on a Capacitor
 * native platform (iOS/Android) — no consent read, no tracker import,
 * no script. This is the single chokepoint; `initPixel`/`initGa4`/
 * `initClarity` have no other callers, so this one guard kills all
 * three (+ UTM) on native and satisfies the privacy-policy promise.
 */
export async function initMarketingTracking(): Promise<{
  consent: boolean;
  utmCaptured: boolean;
  pixelLoaded: boolean;
  ga4Loaded: boolean;
  clarityLoaded: boolean;
}> {
  // App Store / Play compliance (A41 Blocker 1): marketing trackers
  // (Meta Pixel / GA4 / Microsoft Clarity) must never run inside the
  // native WebView. Short-circuit before the consent check so a native
  // build neither touches localStorage consent nor imports a tracker.
  if (isNativePlatform()) {
    return {
      consent: false,
      utmCaptured: false,
      pixelLoaded: false,
      ga4Loaded: false,
      clarityLoaded: false,
    };
  }

  const consent = isMarketingTrackingEnabled();
  if (!consent) {
    return {
      consent: false,
      utmCaptured: false,
      pixelLoaded: false,
      ga4Loaded: false,
      clarityLoaded: false,
    };
  }

  // Lazy-load the tracking modules so the consent-off branch never
  // even pulls in their script-injection code.
  const [
    { captureUtmFromCurrentUrl },
    { initPixel, pixelTrackPageView },
    { initGa4, gaPageView },
    { initClarity },
  ] = await Promise.all([
    import("@/lib/tracking/utm"),
    import("@/lib/tracking/pixel"),
    import("@/lib/tracking/ga4"),
    import("@/lib/tracking/clarity"),
  ]);

  const utm = captureUtmFromCurrentUrl();
  const pixelLoaded = initPixel();
  const ga4Loaded = initGa4();
  // Clarity is consent-gated by reaching this branch (same gate as
  // Pixel/GA4) and env-gated inside initClarity(); session replay +
  // heatmaps only when VITE_CLARITY_PROJECT_ID is set in prod.
  const clarityLoaded = initClarity();

  if (pixelLoaded) pixelTrackPageView();
  if (ga4Loaded) gaPageView();

  return {
    consent: true,
    utmCaptured: utm !== null,
    pixelLoaded,
    ga4Loaded,
    clarityLoaded,
  };
}

/**
 * Test-only: clear localStorage opt-out so tests are deterministic.
 */
export function __resetMarketingConsentForTests(): void {
  const ls = safeLocalStorage();
  if (!ls) return;
  try {
    ls.removeItem(MARKETING_OPT_OUT_KEY);
  } catch {
    /* ignore */
  }
}
