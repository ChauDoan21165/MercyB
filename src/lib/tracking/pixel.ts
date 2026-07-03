// src/lib/tracking/pixel.ts
//
// Facebook Pixel wrapper. Loads the official `fbevents.js` script tag
// programmatically when `VITE_FB_PIXEL_ID` is set AND marketing
// tracking consent is granted. Otherwise every call is a no-op.
//
// Why programmatic injection (not in index.html): the pixel must
// respect consent, and consent isn't known at HTML render time. We
// also want a single code path that's identical between dev (where
// the env var is empty → never load) and prod.
//
// Why no npm package: `react-facebook-pixel` and similar wrap the
// same script tag we'd inject by hand, but add a build-size hit and
// extra abstraction. Meta's official docs use the `fbq` snippet
// directly — we mirror that snippet here.

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

type FbqFunction = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: (...args: unknown[]) => unknown;
  loaded?: boolean;
  version?: string;
};

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

function pixelId(): string {
  return readEnv("VITE_FB_PIXEL_ID");
}

/**
 * Inject the Meta Pixel base script. Idempotent — calling twice is
 * a no-op. Returns `false` when the pixel is not configured (empty
 * env var) or when called outside a browser.
 */
export function initPixel(): boolean {
  if (initialized) return true;
  if (!isBrowser()) return false;
  const id = pixelId();
  if (!id) return false;

  // Official Meta Pixel snippet, ported to TypeScript without
  // touching its semantics. Do not "tidy" — Meta's loader inspects
  // these exact properties.
  const w = window as unknown as { fbq?: FbqFunction; _fbq?: FbqFunction };
  if (!w.fbq) {
    const n: FbqFunction = function (...args: unknown[]) {
      if (typeof n.callMethod === "function") {
        n.callMethod(...args);
      } else {
        (n.queue ??= []).push(args);
      }
    } as FbqFunction;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    w.fbq = n;
    if (!w._fbq) w._fbq = n;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  script.setAttribute("data-mb-pixel", "1");
  document.head.appendChild(script);

  window.fbq?.("init", id);
  initialized = true;
  return true;
}

function safeFbq(...args: unknown[]): void {
  if (!isBrowser()) return;
  try {
    window.fbq?.(...args);
  } catch {
    /* never let analytics crash the app */
  }
}

export function pixelTrackPageView(): void {
  if (!initialized) return;
  safeFbq("track", "PageView");
}

export function pixelTrackSignUp(payload?: Record<string, unknown>): void {
  if (!initialized) return;
  safeFbq("track", "CompleteRegistration", payload ?? {});
}

export function pixelTrackTrialStart(payload?: Record<string, unknown>): void {
  if (!initialized) return;
  safeFbq("track", "StartTrial", payload ?? {});
}

export function pixelTrackPurchase(amount: number, currency = "USD"): void {
  if (!initialized) return;
  safeFbq("track", "Purchase", { value: amount, currency });
}

/**
 * Test-only: reset module state and any injected `<script>` tag so
 * tests can re-initialize from scratch.
 */
export function __resetPixelForTests(): void {
  initialized = false;
  if (!isBrowser()) return;
  try {
    const w = window as unknown as Record<string, unknown>;
    delete w.fbq;
    delete w._fbq;
    document
      .querySelectorAll('script[data-mb-pixel="1"]')
      .forEach((node) => node.parentNode?.removeChild(node));
  } catch {
    /* ignore */
  }
}

export function __pixelInitializedForTests(): boolean {
  return initialized;
}
