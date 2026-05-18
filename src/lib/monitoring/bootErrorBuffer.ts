// src/lib/monitoring/bootErrorBuffer.ts
//
// Bounded pre-init error buffer for the deferred-Sentry boot path.
//
// WHY: initSentry() is deferred into requestIdleCallback (main.tsx) so the
// ~156 KB @sentry/react chunk stops competing with the LCP critical path
// on Slow 4G. That opens a window — from first script execution until
// Sentry's own global handlers attach — where a thrown error would never
// reach Sentry. Boot-window errors are the ones we MOST need (they explain
// white-screen crashes), so the JS-cost win must not cost that telemetry.
//
// Contracts (perf/defer-sentry-init):
//  - addEventListener with capture:true — NOT `window.onerror =`. Other
//    scripts (some monitoring tools) override or chain the window.onerror
//    PROPERTY; addEventListener listeners are independent and coexist, so
//    we can't be displaced that way. (The only thing that could suppress
//    us is a prior capture-phase listener calling stopImmediatePropagation
//    — rare; we register as early as possible to be ahead of it.)
//  - bounded (maxEntries) so a tight pre-init throw loop can't grow memory
//    without limit if Sentry never initializes.
//  - replay through the REAL Sentry captureException (so beforeSend
//    PII-scrub + noise filter + tag enrichment still run) when enabled;
//    console.error fallback when not — a boot error is NEVER silently
//    dropped.
//  - flush() is idempotent (whenSentryReady-vs-timeout race) and removes
//    its listeners BEFORE replay, so it cannot double-report from that
//    point on. The only residue is a sub-microtask gap between Sentry's
//    init attaching its global handler and flush() running; an error there
//    is collapsed by @sentry/react's default dedupeIntegration (same
//    exception → one event). So "removed before any error fires twice" is
//    deterministic for all but that gap, which cannot double-REPORT.

export interface BootErrorBufferOptions {
  /** Hard cap on buffered entries (default 50). Excess is discarded. */
  maxEntries?: number;
  /** True once Sentry is actually initialized (sentryInit.isSentryEnabled). */
  isEnabled: () => boolean;
  /** The Sentry captureException to replay through, or null if unavailable. */
  getCapture: () => ((error: unknown) => void) | null;
}

export interface BootErrorBufferHandle {
  /** Replay-or-drop + detach listeners. Idempotent; never throws. */
  flush: () => void;
  /** Current buffered count (test/diagnostic aid). */
  size: () => number;
}

export function installBootErrorBuffer(
  opts: BootErrorBufferOptions,
): BootErrorBufferHandle {
  const max = opts.maxEntries ?? 50;
  const buffer: unknown[] = [];
  let active = true;
  let flushed = false;

  const push = (value: unknown): void => {
    if (!active || buffer.length >= max) return;
    buffer.push(value);
  };
  const onError = (e: ErrorEvent): void => push(e.error ?? e.message);
  const onRejection = (e: PromiseRejectionEvent): void => push(e.reason);

  try {
    window.addEventListener("error", onError, true);
    window.addEventListener("unhandledrejection", onRejection, true);
  } catch {
    /* no window (SSR / non-browser) — handle stays an inert no-op */
  }

  const flush = (): void => {
    if (flushed) return;
    flushed = true;
    // Stop buffering and detach BEFORE replaying so we can't keep
    // capturing (and then re-replay) once Sentry owns the handlers.
    active = false;
    try {
      window.removeEventListener("error", onError, true);
      window.removeEventListener("unhandledrejection", onRejection, true);
    } catch {
      /* ignore */
    }

    if (buffer.length === 0) return;

    const capture = opts.isEnabled() ? opts.getCapture() : null;
    for (const value of buffer) {
      if (capture) {
        // Same-tick error that also hit Sentry's just-attached handler is
        // collapsed by dedupeIntegration → replaying cannot double-report.
        try {
          capture(value);
        } catch {
          /* flush must never throw — observability is best-effort */
        }
      } else {
        // Sentry disabled or never initialized within the wait cap.
        // Surface, never silently drop — a boot crash stays diagnosable
        // from the user's console / a screen-share.
        console.error("[boot-error: Sentry unavailable]", value);
      }
    }
    buffer.length = 0;
  };

  return { flush, size: () => buffer.length };
}
