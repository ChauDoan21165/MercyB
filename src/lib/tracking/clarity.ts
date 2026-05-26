// src/lib/tracking/clarity.ts
//
// Microsoft Clarity wrapper — session replay + heatmaps. Loads the
// official `clarity.ms/tag` script programmatically when
// `VITE_CLARITY_PROJECT_ID` is set AND marketing tracking consent is
// granted (the consent gate lives in behaviorTrackingFlag.ts, exactly
// like pixel.ts / ga4.ts). Otherwise every call is a no-op.
//
// Why programmatic injection (not in index.html): Clarity must
// respect the same consent gate as Pixel/GA4, and consent isn't known
// at HTML render time. Single code path for dev (empty env → never
// load) and prod — identical rationale to pixel.ts / ga4.ts.
//
// Why no npm package: `@microsoft/clarity` wraps the same tag script
// we inject here while adding a build-size hit and an extra
// abstraction. Microsoft's official install is the `clarity` snippet
// — we mirror it, same decision the codebase already made for
// fbevents.js (pixel.ts) and gtag.js (ga4.ts).
//
// The script is `async` and injected post-boot (called from the
// deferred initMarketingTracking() at main.tsx), so it never blocks
// first paint and does not regress the Lighthouse Performance score.

declare global {
  interface Window {
    clarity?: ClarityFunction;
  }
}

type ClarityFunction = {
  (...args: unknown[]): void;
  q?: unknown[];
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

function projectId(): string {
  return readEnv("VITE_CLARITY_PROJECT_ID");
}

/**
 * Inject the Microsoft Clarity tag and seed its command queue.
 * Idempotent — calling twice is a no-op. Returns `false` when Clarity
 * is not configured (empty env var) or when called outside a browser.
 *
 * If the script fails to load (network error, ad blocker), the queued
 * `window.clarity` shim simply buffers calls that never flush — the
 * app is unaffected. Nothing here can throw into the caller.
 */
export function initClarity(): boolean {
  if (initialized) return true;
  if (!isBrowser()) return false;
  const id = projectId();
  if (!id) return false;

  try {
    // Official Microsoft Clarity snippet, ported to TS without
    // changing its semantics. Clarity's loader inspects `window.clarity`
    // and its `.q` queue — do not "tidy" these.
    const w = window as unknown as { clarity?: ClarityFunction };
    if (!w.clarity) {
      const c: ClarityFunction = function (...args: unknown[]) {
        (c.q ??= []).push(args);
      } as ClarityFunction;
      c.q = [];
      w.clarity = c;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${encodeURIComponent(id)}`;
    script.setAttribute("data-mb-clarity", "1");
    // Don't let a failed Clarity load surface as an unhandled error.
    script.addEventListener("error", () => {
      /* ad blocker / offline — Clarity simply never records; ignore */
    });
    document.head.appendChild(script);

    initialized = true;
    return true;
  } catch {
    // Never let analytics setup crash the app boot.
    return false;
  }
}

/**
 * Test-only: reset module state and remove the injected `<script>`
 * tag so tests can re-initialize from scratch.
 */
export function __resetClarityForTests(): void {
  initialized = false;
  if (!isBrowser()) return;
  try {
    const w = window as unknown as Record<string, unknown>;
    delete w.clarity;
    document
      .querySelectorAll('script[data-mb-clarity="1"]')
      .forEach((node) => node.parentNode?.removeChild(node));
  } catch {
    /* ignore */
  }
}

export function __clarityInitializedForTests(): boolean {
  return initialized;
}
