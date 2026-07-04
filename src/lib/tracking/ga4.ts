// src/lib/tracking/ga4.ts
//
// Google Analytics 4 wrapper. Loads `gtag.js` programmatically when
// `VITE_GA4_MEASUREMENT_ID` is set AND marketing consent is granted.
// Otherwise every call is a no-op.
//
// Same pattern as pixel.ts: official snippet, no npm package, single
// code path for dev (empty env → no-op) and prod.
//
// Coexistence with the existing `src/lib/analytics.ts` `trackEvent`
// router: that file calls `window.gtag(...)` if it's defined. Once
// `initGa4()` runs, `window.gtag` is defined and existing call sites
// (paywall_shown, checkout_started, etc.) start firing into GA4
// automatically — no changes needed at those call sites.

// `window.dataLayer` and `window.gtag` are declared centrally in
// `src/types/window.d.ts` so every typecheck shard shares the same shape.

let initialized = false;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function readEnv(name: string): string {
  try {
    return String((import.meta as ImportMeta | undefined)?.env?.[name] ?? "").trim();
  } catch {
    return "";
  }
}

function measurementId(): string {
  return readEnv("VITE_GA4_MEASUREMENT_ID");
}

/**
 * Inject `gtag.js` and seed the dataLayer. Idempotent. Returns false
 * when the GA4 ID is empty or we're not in a browser.
 */
export function initGa4(): boolean {
  if (initialized) return true;
  if (!isBrowser()) return false;
  const id = measurementId();
  if (!id) return false;

  window.dataLayer = window.dataLayer ?? [];
  // Native gtag preserves arguments; using rest+spread loses the
  // arguments object semantics so we keep a plain function here.
  const gtag = function gtag(...args: unknown[]) {
    (window.dataLayer ?? []).push(args);
  };
  window.gtag = gtag;
  gtag("js", new Date());
  // anonymize_ip is the default in GA4, but explicit is good.
  gtag("config", id, { anonymize_ip: true });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  script.setAttribute("data-mb-ga4", "1");
  document.head.appendChild(script);

  initialized = true;
  return true;
}

function safeGtag(...args: unknown[]): void {
  if (!isBrowser()) return;
  try {
    window.gtag?.(...args);
  } catch {
    /* never let analytics crash the app */
  }
}

export function gaPageView(path?: string): void {
  if (!initialized) return;
  safeGtag("event", "page_view", path ? { page_path: path } : {});
}

export function gaSignUp(method?: string): void {
  if (!initialized) return;
  safeGtag("event", "sign_up", method ? { method } : {});
}

export function gaTrialStart(payload?: Record<string, unknown>): void {
  if (!initialized) return;
  safeGtag("event", "begin_trial", payload ?? {});
}

export function gaPurchase(amount: number, currency = "USD"): void {
  if (!initialized) return;
  safeGtag("event", "purchase", { value: amount, currency });
}

/**
 * Test-only: reset module state and remove the script tag so tests
 * can re-initialize.
 */
export function __resetGa4ForTests(): void {
  initialized = false;
  if (!isBrowser()) return;
  try {
    const w = window as unknown as Record<string, unknown>;
    delete w.gtag;
    delete w.dataLayer;
    document
      .querySelectorAll('script[data-mb-ga4="1"]')
      .forEach((node) => node.parentNode?.removeChild(node));
  } catch {
    /* ignore */
  }
}

export function __ga4InitializedForTests(): boolean {
  return initialized;
}
