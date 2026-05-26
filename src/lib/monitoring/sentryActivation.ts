// src/lib/monitoring/sentryActivation.ts
//
// ROUTE-GATE for the ~156 KB @sentry/react chunk.
//
// PR #655 deferred initSentry() into requestIdleCallback but it STILL ran
// unconditionally on every page — so a static legal/marketing visit
// (/privacy, /terms, landing) still fetched the whole Sentry chunk a
// moment after idle. This module makes the SDK load ONLY when one of
// three triggers proves monitoring is actually needed this session:
//
//   (1) a window 'error' / 'unhandledrejection' lands in the boot buffer
//       → bootErrorBuffer.onFirstCapture → activateSentry()
//   (2) auth transitions to an authenticated (email-verified) session
//       → AuthProvider.applySession → activateSentry()
//   (3) feature code makes an explicit captureError()/captureMessage()/…
//       call before Sentry is up → queueExplicitCapture() / activateSentry()
//
// An anonymous, error-free visit to a static page fires NONE of these, so
// Sentry is never fetched there.
//
// This module is intentionally dependency-free (no @sentry import, no
// React) so any layer — boot, auth, feature code — can pull the gate
// without dragging the SDK into its chunk.

type Activator = () => void;
type Enqueue = (error: unknown) => void;

let activate: Activator | null = null;
let enqueue: Enqueue | null = null;
let activated = false;
let activationPending = false;

/**
 * main.tsx registers what "init Sentry now" concretely does (call
 * initSentry, wire whenSentryReady → bootBuffer.flush, arm the 10 s
 * hard-cap flush) and how to enqueue a pre-init explicit capture into
 * the SAME bounded boot buffer. Called once, synchronously, immediately
 * after the boot buffer is installed and BEFORE any boot IIFE — so a
 * trigger can never out-race arming. The `activationPending` latch
 * covers the theoretical race anyway (defensive, near-free).
 */
export function armSentryActivation(opts: {
  activate: Activator;
  enqueue: Enqueue;
}): void {
  activate = opts.activate;
  enqueue = opts.enqueue;
  if (activationPending && !activated) runActivation();
}

function runActivation(): void {
  if (activated) return;
  activated = true;
  const fn = activate;
  // Release the activator closure; `enqueue` stays live until the boot
  // buffer flushes (a captureError in the activate→whenSentryReady gap
  // must still land in the buffer to be replayed).
  activate = null;
  try {
    fn?.();
  } catch {
    /* activation must never break the trigger's caller */
  }
}

/**
 * Triggers 1 & 2 (and the activate half of trigger 3). One-time: the
 * first call pulls Sentry init; every later call is a no-op. `reason`
 * is diagnostic only and deliberately not threaded anywhere hot.
 */
export function activateSentry(_reason: string): void {
  if (activated) return;
  if (activate) runActivation();
  else activationPending = true; // armed later → arm() will run it
}

/**
 * Trigger 3: feature code called captureError() before Sentry was up.
 * Enqueue the exception into the SAME bounded boot buffer (so it is
 * replayed through the real Sentry captureException — beforeSend scrub +
 * dedupe still apply — once init settles) and pull activation. Enqueue
 * is a no-op if the buffer isn't armed yet; activation is still latched.
 */
export function queueExplicitCapture(error: unknown): void {
  try {
    enqueue?.(error);
  } catch {
    /* best-effort: a queue failure must not break the caller */
  }
  activateSentry("explicit-capture");
}

/** True once any trigger has pulled Sentry init this session. */
export function isSentryActivated(): boolean {
  return activated;
}

/** Test-only: reset module state between cases. */
export function __resetSentryActivationForTest(): void {
  activate = null;
  enqueue = null;
  activated = false;
  activationPending = false;
}
