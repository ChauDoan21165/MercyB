/**
 * Sentry initialization (Capacitor SDK on native — @sentry/react on web).
 *
 * Activation model:
 *   - VITE_SENTRY_DSN is the single switch. Empty string ⇒ full no-op:
 *     - the Sentry SDK modules are NEVER imported (dynamic imports are
 *       gated behind the DSN check), so Vite splits them into their own
 *       chunks that simply aren't fetched in the no-DSN deployment.
 *     - captureError / tagWithUser / clearUser become no-ops via
 *       isSentryEnabled().
 *   - During tests (vitest sets import.meta.env.MODE === 'test') we
 *     hard-skip init even if a DSN is somehow present, so suites stay
 *     deterministic and never ship breadcrumbs to a real Sentry project.
 *
 * Platform fork:
 *   The @sentry/capacitor SDK calls NATIVE.initNativeSdk() before binding
 *   a browser client. Inside a real Capacitor shell that promise resolves
 *   immediately and originalInit() runs. In a plain web browser there is
 *   no Capacitor bridge, so the native init promise can hang and
 *   originalInit() is never called — leaving the SDK with no client and
 *   silently dropping every captureException(). To avoid that, on web we
 *   call @sentry/react's init directly and skip the Capacitor wrapper
 *   entirely. On iOS/Android (where Capacitor.isNativePlatform() === true)
 *   we keep the wrapped form so native crash reporting still works.
 *
 *   Capacitor.getPlatform() is read at runtime and surfaced as a tag so
 *   the Sentry dashboard can filter web vs ios vs android.
 *
 * Privacy posture (deliberate defaults):
 *   - Sentry.setUser only ever carries `{ id }` — no email, no username,
 *     no IP. The single guard is `tagWithUser` in captureException.ts.
 *   - beforeSend (`scrubEvent`) runs the existing stripPII regex over
 *     event.message, exception messages, request body / query string, and
 *     breadcrumb messages. user.* is stripped down to id only.
 *   - beforeBreadcrumb (`scrubBreadcrumb`) drops `ui.input` breadcrumbs
 *     entirely — they capture raw text typed by the user, which is the
 *     single highest-risk source of PII leakage.
 *   - Session Replay (web only — @sentry/capacitor does not support
 *     Replay): 10% baseline session sampling, 100% on-error sampling.
 *     `maskAllText: true` and `blockAllMedia: true` are kept at the
 *     Sentry-recommended privacy defaults; loosening either requires
 *     an explicit privacy review.
 */

import { stripPII } from "@/lib/security/piiProtection";
import { looksLikeChunkLoadFailure } from "@/lib/chunkLoadError";
import { CHUNK_EB_RELOAD_KEY } from "@/lib/chunkReload";

// `unknown` instead of typeof import("@sentry/react") so a static-analysis
// pass over this file doesn't pull Sentry's types into the build graph.
// Cast inside getSentryModule callers when needed.
let sentryModule: unknown = null;

let initialized = false;
let dsnConfigured = false;
let disabledReasonLogged = false;

// Readiness contract for the deferred-boot error buffer (main.tsx).
// initSentry() is fire-and-forget; a caller that defers it needs a
// deterministic "Sentry has reached a TERMINAL state" signal so a
// pre-init error buffer knows when to replay-or-drop. This promise
// resolves once init has settled in ANY terminal state — SDK
// initialized, no-DSN/disabled, dynamic-import failed, or test-mode
// skip — NOT only on success. The buffer then checks isSentryEnabled()
// to decide replay (true) vs console-drop (false). Resolve-only (never
// rejects) so a `.then(flush)` can't itself throw.
let sentryReadyPromise: Promise<void> | null = null;
let resolveSentryReady: (() => void) | null = null;

/**
 * Resolves when initSentry() has reached a terminal state (ready OR
 * permanently disabled this session). Safe to call before, during, or
 * after initSentry(); idempotent; never rejects. Pair with isSentryEnabled()
 * after it resolves to know whether Sentry actually came up.
 */
export function whenSentryReady(): Promise<void> {
  if (!sentryReadyPromise) {
    sentryReadyPromise = new Promise<void>((resolve) => {
      resolveSentryReady = resolve;
    });
  }
  return sentryReadyPromise;
}

// Resolve the readiness promise exactly once. Lazily creates the promise
// first (so an early return that runs before any whenSentryReady() caller
// still leaves a resolved promise for a later caller to await).
function markSentryReady(): void {
  whenSentryReady();
  if (resolveSentryReady) {
    const resolve = resolveSentryReady;
    resolveSentryReady = null;
    resolve();
  }
}

export function isSentryEnabled(): boolean {
  return dsnConfigured;
}

export function getSentryModule(): unknown {
  return sentryModule;
}

export function initSentry(): void {
  // Idempotent: a second call must still leave whenSentryReady() resolvable
  // (the first call owns resolution; if it already settled this is a no-op,
  // if still in flight the original IIFE's finally will resolve it).
  if (initialized) {
    markSentryReady();
    return;
  }
  initialized = true;

  // Vitest sets MODE='test'. Belt-and-braces guard so tests never wire up
  // the real SDK even if a DSN slips into the test env. Kept BEFORE the
  // async IIFE so test runs never trigger the dynamic SDK import either.
  // Terminal state → resolve readiness (isSentryEnabled() stays false).
  if (import.meta.env.MODE === "test") {
    markSentryReady();
    return;
  }

  void (async () => {
    try {
      // Load the SDK FIRST, before any DSN check. This is load-bearing:
      // putting `await import("@sentry/react")` ahead of the DSN guard
      // forces Rollup to keep the @sentry/react chunk in the production
      // bundle even when Vite inlines VITE_SENTRY_DSN as an empty literal
      // at build time. Do NOT move the DSN check above this line — that
      // re-introduces the dead-strip failure mode that wiped Sentry
      // runtime out of prior production deploys.
      const SentryReact = await import("@sentry/react");

      const dsn = String(import.meta.env.VITE_SENTRY_DSN ?? "").trim();
      if (!dsn) {
        if (!disabledReasonLogged) {
          console.warn("[sentry] missing or empty DSN");
          disabledReasonLogged = true;
        }
        return;
      }

      const env = String(
        import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE ?? "development",
      ).trim();
      const isProd = env === "production" || env === "prod";
      // Vercel injects VERCEL_GIT_COMMIT_SHA at build time; vite.config.ts
      // re-exports it as VITE_VERCEL_GIT_COMMIT_SHA via `define`. Empty in
      // local builds → undefined release (Sentry's auto-detect default).
      const release =
        String(import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA ?? "").trim() ||
        undefined;

      const sharedOptions = {
        dsn,
        release,
        environment: env,
        tracesSampleRate: isProd ? 0.1 : 1.0,
        beforeSend(event: unknown) {
          const e = event as SentryEventLike;
          // 0. Drop EVERY event when the page is running inside the Zalo
          //    in-app browser. The Zalo IAB injects scripts whose errors
          //    look like ours but originate in their bridge — not fixable
          //    from our page, pure noise in Sentry. Drop wholesale rather
          //    than try to catch every variant in NOISE_PATTERNS.
          //    Done before PII scrubbing for efficiency.
          if (runsInsideZaloIab()) return null;
          // 1. Strip PII from message / exception / breadcrumbs / request.
          const scrubbed = scrubEvent(e);
          if (scrubbed === null) return null;
          // 2. Drop external-script noise (FB/IG/Zalo IAB injection,
          //    browser-extension stacks, third-party SDK CDNs). These
          //    crashes don't originate in our code and we can't fix them.
          if (looksLikeExternalNoise(scrubbed)) return null;
          // 2b. Drop DOM-mutation noise from Translate / Grammarly /
          //    similar extensions. AND-gated: top frame inside react-*.js
          //    AND message is the removeChild / NotFoundError family.
          if (looksLikeDomMutationExtensionNoise(scrubbed)) return null;
          // 2c. Drop anonymous-frame stack overflows captured by
          //    window.onerror. AND-gated: message is "Maximum call
          //    stack size exceeded" AND no stack frame names a real
          //    source. Real app recursion produces dozens of frames
          //    inside our bundle, never a single `undefined:30:70`.
          if (looksLikeAnonymousStackOverflow(scrubbed)) return null;
          // 3. Enrich with classification + context tags so the Sentry
          //    UI can sort and alert on what actually matters. Also
          //    sets event.level + event.fingerprint based on priority.
          //    No release-based dropping — we tag current_release and
          //    let Sentry's server-side rules decide what to filter.
          enrichEventTags(scrubbed);
          return event;
        },
        beforeBreadcrumb(breadcrumb: unknown) {
          const result = scrubBreadcrumb(breadcrumb as SentryBreadcrumbLike);
          return result === null ? null : breadcrumb;
        },
      };

      // Check if we're actually running inside a Capacitor native shell.
      // In a plain web browser this returns false (or Capacitor is
      // undefined), and we route to @sentry/react directly.
      const isNativeCapacitor = (() => {
        try {
          const w = window as { Capacitor?: { isNativePlatform?: () => boolean } };
          return w.Capacitor?.isNativePlatform?.() === true;
        } catch {
          return false;
        }
      })();

      let platform = "web";

      if (isNativeCapacitor) {
        const SentryCap = await import("@sentry/capacitor");
        const nativeOptions = buildSentryOptions({
          shared: sharedOptions,
          isNativeCapacitor: true,
          replayIntegrationFactory: undefined,
        });
        SentryCap.init(
          nativeOptions as Parameters<typeof SentryCap.init>[0],
          SentryReact.init,
        );
        sentryModule = SentryCap;
        try {
          const w = window as { Capacitor?: { getPlatform?: () => string } };
          platform = w.Capacitor?.getPlatform?.() ?? "native";
        } catch {
          platform = "native";
        }
        try {
          SentryCap.setTag("platform", platform);
        } catch {
          // never block init on a tag write
        }
      } else {
        // Web: skip the Capacitor wrapper entirely; its sdkInit awaits a
        // native bridge promise that doesn't resolve outside a Capacitor
        // shell, leaving no browser client bound.
        const webOptions = buildSentryOptions({
          shared: sharedOptions,
          isNativeCapacitor: false,
          replayIntegrationFactory: (
            SentryReact as { replayIntegration?: (opts: unknown) => unknown }
          ).replayIntegration,
        });
        SentryReact.init(
          webOptions as Parameters<typeof SentryReact.init>[0],
        );
        sentryModule = SentryReact;
        try {
          SentryReact.setTag("platform", "web");
        } catch {
          // never block init on a tag write
        }
      }

      dsnConfigured = true;
      console.info(`[sentry] initialized (env=${env}, platform=${platform})`);
    } catch (err) {
      // A dynamic-import failure (offline first load, server hiccup) must
      // not break the app. Log and continue with Sentry disabled.
      console.warn(
        "[sentry] dynamic import failed; monitoring disabled this session",
        err,
      );
    } finally {
      // Terminal state reached on EVERY path (init OK, no-DSN early
      // return, or import/init threw) → release the readiness promise so
      // the deferred-boot buffer flushes/drops deterministically. Runs
      // AFTER SentryReact.init() on the success path, so Sentry's own
      // global handlers are already attached before the buffer replays.
      markSentryReady();
    }
  })();
}

// ── Per-platform options builder (exported for unit tests) ─────────────
//
// Composes the per-platform Sentry init options so the replay wiring
// can be unit-tested without booting the SDK. The web branch adds
// Session Replay (10% baseline / 100% on-error sampling, all text
// masked, all media blocked); the native (Capacitor) branch leaves it
// off because @sentry/capacitor doesn't ship a replay integration.

export type ReplayIntegrationFactory =
  | ((opts: { maskAllText: boolean; blockAllMedia: boolean }) => unknown)
  | undefined;

export type SentryPlatformOptions = Record<string, unknown> & {
  integrations?: unknown[];
  replaysSessionSampleRate?: number;
  replaysOnErrorSampleRate?: number;
};

export function buildSentryOptions(args: {
  shared: Record<string, unknown>;
  isNativeCapacitor: boolean;
  replayIntegrationFactory: ReplayIntegrationFactory;
}): SentryPlatformOptions {
  const { shared, isNativeCapacitor, replayIntegrationFactory } = args;

  // Native: pass shared options through unchanged. Replay isn't
  // available on @sentry/capacitor and the sample-rate fields would be
  // inert anyway — keeping them off means the native init payload
  // stays small and there's no risk of confusion in the dashboard.
  if (isNativeCapacitor) {
    return { ...shared };
  }

  // Web: enable Replay if the SDK exposes the factory. (Defensive — if
  // a future @sentry/react drops or renames replayIntegration the init
  // still succeeds without it instead of throwing.)
  if (typeof replayIntegrationFactory !== "function") {
    return { ...shared };
  }

  return {
    ...shared,
    // 10% of regular sessions get a replay buffer; 100% of sessions
    // that hit an error do — that's the high-value sample. Conservative
    // baseline so we stay inside the Sentry free-tier replay quota.
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      replayIntegrationFactory({
        // Sentry-recommended privacy defaults. maskAllText hides every
        // text node (including user-entered text); blockAllMedia stops
        // images/video/audio from being recorded. Loosening either
        // requires a privacy review — Vietnamese learners are an
        // anonymous-heavy cohort but we still treat session content as
        // PII by default.
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  };
}

// ── PII scrubbers (exported for unit tests) ─────────────────────────────

type SentryEventLike = {
  message?: string;
  user?: { id?: string | number; email?: string; username?: string; ip_address?: string };
  request?: { data?: unknown; query_string?: string; cookies?: unknown };
  exception?: {
    values?: Array<{
      value?: string;
      type?: string;
      stacktrace?: { frames?: Array<{ filename?: string }> };
    }>;
  };
  breadcrumbs?: Array<SentryBreadcrumbLike>;
  tags?: Record<string, string>;
  release?: string;
  level?: string;
  fingerprint?: string[];
};

type SentryBreadcrumbLike = {
  category?: string;
  message?: string;
  data?: Record<string, unknown>;
  type?: string;
};

export function scrubEvent<E extends SentryEventLike>(event: E): E | null {
  // user.* — keep id only, drop email / username / ip
  if (event.user) {
    event.user = event.user.id ? { id: event.user.id } : undefined as never;
  }

  if (event.request) {
    if (typeof event.request.data === "string") {
      event.request.data = stripPII(event.request.data);
    }
    if (typeof event.request.query_string === "string") {
      event.request.query_string = stripPII(event.request.query_string);
    }
    // Cookies can contain session tokens — drop entirely.
    if (event.request.cookies !== undefined) {
      delete event.request.cookies;
    }
  }

  if (typeof event.message === "string") {
    event.message = stripPII(event.message);
  }

  if (event.exception?.values) {
    for (const v of event.exception.values) {
      if (typeof v.value === "string") v.value = stripPII(v.value);
    }
  }

  if (Array.isArray(event.breadcrumbs)) {
    const filtered: SentryBreadcrumbLike[] = [];
    for (const b of event.breadcrumbs) {
      const scrubbed = scrubBreadcrumb(b);
      if (scrubbed) filtered.push(scrubbed);
    }
    event.breadcrumbs = filtered as E["breadcrumbs"];
  }

  return event;
}

export function scrubBreadcrumb<B extends SentryBreadcrumbLike>(breadcrumb: B): B | null {
  // ui.input captures raw user keystrokes — almost always PII risk.
  if (breadcrumb.category === "ui.input") return null;

  if (typeof breadcrumb.message === "string") {
    breadcrumb.message = stripPII(breadcrumb.message);
  }

  if (breadcrumb.data && typeof breadcrumb.data === "object") {
    for (const [k, v] of Object.entries(breadcrumb.data)) {
      if (typeof v === "string") {
        breadcrumb.data[k] = stripPII(v);
      }
    }
  }

  return breadcrumb;
}

// ── Classification + tagging (exported for unit tests) ─────────────────

// Build-time release SHA. Compared against event.release so we can tag
// whether the event originated in the bundle we're currently running.
// Empty in local builds — in that case we tag current_release="unknown".
const BUILD_RELEASE = String(import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA ?? "").trim();

// Stack-frame URL patterns that mark events as "not our code". Anything
// that matches in the message, exception value, exception stack-frame
// filename, or request query string causes beforeSend to drop the event.
// Keep this list conservative — we'd rather under-filter than swallow a
// real bug. Add a new entry only when you've seen the substring in
// repeated noise issues.
const NOISE_PATTERNS: RegExp[] = [
  /iabjs:\/\//i,                       // Facebook / Instagram / Zalo in-app browser JS injection
  /chrome-extension:\/\//i,            // Chrome extensions (uBlock, password managers, etc.)
  /moz-extension:\/\//i,               // Firefox extensions
  /safari-(web-)?extension:\/\//i,     // Safari extensions
  /connect\.facebook\.net/i,           // Facebook Pixel SDK
  /googletagmanager\.com/i,            // Google Tag Manager
  /zaloJSV/i,                          // Zalo in-app browser SDK injection (zaloJSV2 ReferenceError)
  /zalojsv/i,                          // (lowercase variant, belt-and-suspenders)
  /webkit\.messageHandlers/i,          // FB/IG IAB injects scripts that call their native bridge;
                                       // outside the host app window.webkit is undefined and the
                                       // dereference throws TypeError. Not our code, not fixable.
];

function collectNoiseHaystacks(event: SentryEventLike): string[] {
  const out: string[] = [];
  if (typeof event.message === "string") out.push(event.message);
  if (event.exception?.values) {
    for (const v of event.exception.values) {
      if (typeof v.value === "string") out.push(v.value);
      const frames = v.stacktrace?.frames ?? [];
      for (const f of frames) {
        if (typeof f.filename === "string") out.push(f.filename);
      }
    }
  }
  if (typeof event.request?.query_string === "string") {
    out.push(event.request.query_string);
  }
  return out;
}

export function looksLikeExternalNoise(event: SentryEventLike): boolean {
  const haystacks = collectNoiseHaystacks(event);
  return haystacks.some((s) => NOISE_PATTERNS.some((re) => re.test(s)));
}


/** Quick string check against noise patterns — for use in global error handlers
 *  that don't have a structured Sentry event yet. */
export function stringLooksLikeExternalNoise(s: string): boolean {
  return NOISE_PATTERNS.some((re) => re.test(s));
}

// DOM-mutation extension noise. Google Translate, Grammarly, the Chrome
// translator, and a handful of accessibility extensions rewrite the DOM
// out-of-band; React then tries to remove a node it still believes it
// owns and the host browser throws `NotFoundError` / "The object can
// not be found" / `removeChild` errors that originate inside our React
// bundle. The bug is in the third-party extension, not our code — we
// can't fix it from inside our page and it's pure noise in Sentry.
//
// The drop is AND-gated to keep the surface tight:
//   1. The TOP frame (most recent call — the last entry in Sentry's
//      oldest→newest frame ordering) sits inside our react-*.js chunk,
//      AND
//   2. The error message matches one of the three known DOM-mutation
//      tells: removeChild, "The object can not be found", NotFoundError.
//
// Two conditions together mean we don't accidentally swallow a real
// React render bug whose message happens to contain "NotFoundError",
// nor a third-party extension crash whose frame is in our bundle for
// unrelated reasons.
const DOM_MUTATION_NOISE_MESSAGE_RE =
  /removeChild|The object can not be found|NotFoundError/i;
const REACT_BUNDLE_RE = /\breact-[^/\\]+\.js\b/i;

export function looksLikeDomMutationExtensionNoise(
  event: SentryEventLike,
): boolean {
  const ex = event.exception?.values?.[0];
  if (!ex) return false;

  const frames = ex.stacktrace?.frames;
  if (!Array.isArray(frames) || frames.length === 0) return false;

  // "Top frame" = most recent call. Sentry serializes stack frames in
  // oldest→newest order, so the top is the LAST entry.
  const topFrame = frames[frames.length - 1];
  const filename =
    typeof topFrame?.filename === "string" ? topFrame.filename : "";
  if (!REACT_BUNDLE_RE.test(filename)) return false;

  const message = typeof ex.value === "string" ? ex.value : "";
  return DOM_MUTATION_NOISE_MESSAGE_RE.test(message);
}

// Anonymous-frame stack overflow. Chrome Mobile iOS (and a couple of
// in-app browsers) inject scripts into the page that occasionally hit
// `RangeError: Maximum call stack size exceeded`. Because the injected
// script has no host-visible source, `window.onerror` reports the
// filename as null — Sentry serializes that single frame as
// `undefined:<line>:<col>`. There is no React or app frame anywhere
// in the stack. We can't fix code we can't see; the events are pure
// noise.
//
// The drop is AND-gated:
//   1. The exception value matches "Maximum call stack size exceeded",
//      AND
//   2. NO stack frame names a real source — either the frame list is
//      empty, or every frame's filename is missing / empty / the
//      literal string "undefined" / "<anonymous>".
//
// A genuine in-app recursion produces tens to hundreds of frames
// pointing at our react-*.js / app chunks; that case keeps reaching
// Sentry because at least one frame has a real filename.
const STACK_OVERFLOW_MESSAGE_RE = /Maximum call stack size exceeded/i;

function frameLooksAnonymous(frame: { filename?: string }): boolean {
  const fn = typeof frame?.filename === "string" ? frame.filename : "";
  return fn === "" || fn === "undefined" || fn === "<anonymous>";
}

export function looksLikeAnonymousStackOverflow(
  event: SentryEventLike,
): boolean {
  const ex = event.exception?.values?.[0];
  if (!ex) return false;

  const message = typeof ex.value === "string" ? ex.value : "";
  if (!STACK_OVERFLOW_MESSAGE_RE.test(message)) return false;

  const frames = ex.stacktrace?.frames;
  // No frames at all → top-level onerror catch with no caller info.
  // Always the injected-script shape.
  if (!Array.isArray(frames) || frames.length === 0) return true;

  // Every frame anonymous → same shape as the no-frames case but
  // Sentry surfaced a placeholder entry for the onerror line/col.
  return frames.every(frameLooksAnonymous);
}

/**
 * True when the page is running inside the Zalo in-app browser
 * (zalo.me / Zalo Android / iOS embed). The Zalo IAB injects scripts
 * whose runtime errors look like ours but originate in their bridge
 * code — we can't fix the host environment from inside our page, and
 * the resulting Sentry events are pure noise. Rather than try to
 * enumerate every Zalo-injected error in NOISE_PATTERNS, drop ALL
 * events from sessions running inside the IAB.
 *
 * Matches the canonical Zalo UA tokens — "Zalo/<version>" and
 * "ZaloTheme/<value>" — both of which appear in production Zalo IAB
 * user-agents, e.g.
 *   ".../Chrome/87.0... Mobile Safari/537.36
 *    Zalo/22.06.01 ZaloTheme/light ZaloLanguage/vi"
 *
 * Word-boundary anchored so "Zalopay-style" tokens or unrelated
 * substrings ("zaloft", "GazaLogistics") don't false-positive.
 */
const ZALO_IAB_UA_RE = /\bZalo(Theme)?\b/;

export function runsInsideZaloIab(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent ?? "";
  if (!ua) return false;
  return ZALO_IAB_UA_RE.test(ua);
}

export type FeatureArea =
  | "auth"
  | "billing"
  | "room"
  | "mercy"
  | "audio"
  | "admin"
  | "other";
export type Priority = "P1" | "P3";

const FEATURE_AREAS: readonly FeatureArea[] = [
  "auth",
  "billing",
  "room",
  "mercy",
  "audio",
  "admin",
  "other",
];

function isFeatureArea(v: unknown): v is FeatureArea {
  return (
    typeof v === "string" && (FEATURE_AREAS as readonly string[]).includes(v)
  );
}

function classifyByPath(pathname: string): FeatureArea | null {
  if (/^\/(signin|signup|signout|login|auth|reset-password|convert|accept-invite|invite)/i.test(pathname)) return "auth";
  if (/^\/(billing|pricing|upgrade|checkout)/i.test(pathname)) return "billing";
  if (/^\/room\//i.test(pathname)) return "room";
  return null;
}

function classifyByContent(haystacks: string[]): FeatureArea | null {
  const blob = haystacks.join(" ").toLowerCase();
  if (blob.includes("speechsynthesis") || blob.includes("mediaerror") || blob.includes("audiocontext")) return "audio";
  if (blob.includes("mercy") || blob.includes("grammar") || /\bteacher\b/.test(blob)) return "mercy";
  if (blob.includes("supabase") && blob.includes("auth")) return "auth";
  if (blob.includes("stripe") || blob.includes("subscription") || /\bbilling\b/.test(blob)) return "billing";
  if (blob.includes("room") && (blob.includes("load") || blob.includes("open"))) return "room";
  return null;
}

// Map selected PostgREST RLS-denied tables (the `rls_table` tag set by
// captureRlsDenied) to a FeatureArea. Admin/privileged surfaces get a
// definitive "admin" area. The auth-owned profiles table gets "auth" so
// profile/session RLS failures do not get reclassified as Mercy/Teacher AI
// by route/content inference.
// Conservative by design: an unrecognised table is never "admin".
const ADMIN_RLS_TABLES: ReadonlySet<string> = new Set([
  "access_codes",
  "email_campaigns",
  "email_events",
]);

const AUTH_RLS_TABLES: ReadonlySet<string> = new Set(["profiles"]);

export function classifyRlsTable(
  table: string | undefined | null,
): FeatureArea | null {
  if (!table) return null;
  const t = table.toLowerCase();
  if (t.startsWith("admin_")) return "admin";
  if (AUTH_RLS_TABLES.has(t)) return "auth";
  return ADMIN_RLS_TABLES.has(t) ? "admin" : null;
}

// P1 = core feature break (auth/billing/room/mercy/audio/admin).
// P3 = anything else app-internal. P2 (repeat-frequency) can't be
// computed client-side; let Sentry's server aggregation promote
// P3 → P2 via alert rules.
function priorityFor(area: FeatureArea): Priority {
  return area === "other" ? "P3" : "P1";
}

function safePathname(): string {
  try {
    return typeof window !== "undefined" ? window.location.pathname : "";
  } catch {
    return "";
  }
}

function safeIsOnline(): boolean | undefined {
  try {
    return typeof navigator !== "undefined" ? navigator.onLine : undefined;
  } catch {
    return undefined;
  }
}

function safeIsPwa(): boolean | undefined {
  try {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return undefined;
    return window.matchMedia("(display-mode: standalone)").matches;
  } catch {
    return undefined;
  }
}

function parseRoomId(pathname: string): string | undefined {
  const m = /^\/room\/([a-zA-Z0-9_.-]+)/.exec(pathname);
  return m ? m[1] : undefined;
}

// Build a stable, PII-free shape of the error message for fingerprint
// grouping. Strips numbers / hex hashes / UUIDs / quoted literals / URLs
// so different instances of the "same kind of error" group together.
// Conservative: NO roomId, NO query strings, NO URL paths, NO user data.
// Returns an empty string if no exception value or message is available.
function normalizeMessage(event: SentryEventLike): string {
  const raw =
    event.exception?.values?.[0]?.value ??
    (typeof event.message === "string" ? event.message : "") ??
    "";
  if (!raw) return "";
  let s = String(raw);
  s = s.replace(/https?:\/\/\S+/gi, "<url>");
  s = s.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "<uuid>");
  s = s.replace(/\b[0-9a-f]{16,}\b/gi, "<hash>");
  s = s.replace(/\b\d+\b/g, "<n>");
  s = s.replace(/(['"])(?:\\.|(?!\1).)*\1/g, "<str>");
  s = s.replace(/\s+/g, " ").trim();
  return s.length > 120 ? s.slice(0, 120) : s;
}

// Diagnose the rough cause from featureArea + message content. Tag
// values stay short and readable so Sentry's filter UI can group on
// them. No long text or stack traces — the raw event already ships
// those. Cross-area "offline_cache_or_indexeddb" is checked first
// because cache / SW failures can surface on any route.
function rootCauseHint(area: FeatureArea, haystacks: string[]): string {
  const blob = haystacks.join(" ").toLowerCase();
  if (/(\bcache\b|indexeddb|service worker|\bsw\.js\b)/i.test(blob)) {
    return "offline_cache_or_indexeddb";
  }
  if (area === "admin" && /rls denied/i.test(blob)) return "admin_rls_denied";
  if (area === "auth" && /supabase|jwt|\bsession\b|rls denied|profiles|postgrest/i.test(blob)) return "auth_session_or_rls";
  if (area === "billing" && /stripe|subscription|checkout/i.test(blob)) return "stripe_or_subscription";
  if (area === "room" && /(\bload\b|\bopen\b|not found)/i.test(blob)) return "room_load_or_registry";
  if (area === "mercy" && /teacher|grammar|openai/i.test(blob)) return "teacher_ai_or_api";
  if (area === "audio" && /mediaerror|audiocontext|speechsynthesis/i.test(blob)) return "audio_playback_or_browser";
  return "unknown";
}

// Coarse user-impact tag. Reads window.__MB_USER_TIER__ when an
// upstream provider has stashed it (writer lives outside this file's
// scope — typically AuthProvider on tier change). Falls back to
// "anon" when no user.id is present, "unknown" otherwise. Never
// includes email / name / id / subscription object — only the bucket.
function safeUserImpact(event: SentryEventLike): "paid" | "trial" | "anon" | "unknown" {
  try {
    if (typeof window !== "undefined") {
      const w = window as { __MB_USER_TIER__?: unknown };
      const t = w.__MB_USER_TIER__;
      if (t === "paid" || t === "trial" || t === "anon") return t;
    }
  } catch {
    /* ignore */
  }
  return event.user?.id ? "unknown" : "anon";
}

// True once the ErrorBoundary's Tier-2 escalated cache-bust reload has
// already been spent this session (chunkReload.ts sets CHUNK_EB_RELOAD_KEY
// just after capturing). Read defensively — sessionStorage throws in
// private mode / sandboxed iframes. When it's set and a chunk-load failure
// STILL reaches Sentry, recovery is genuinely exhausted (offline / chunk
// truly purged / CDN broken) and the event must stay at error severity.
function chunkRecoveryExhausted(): boolean {
  try {
    return sessionStorage.getItem(CHUNK_EB_RELOAD_KEY) === "1";
  } catch {
    return false;
  }
}

export function enrichEventTags(event: SentryEventLike): void {
  event.tags = event.tags ?? {};
  const tags = event.tags;

  const route = safePathname();
  if (route) tags.route = route;

  const haystacks = collectNoiseHaystacks(event);
  // captureRlsDenied pins `featureArea` (admin/privileged RLS tables
  // only) inside its withScope block. Honour that pre-set value for
  // rls_denied events so a low-volume admin RLS denial reliably matches
  // the `featureArea:admin` alert instead of being reclassified by
  // route/content here. Non-admin RLS denials don't pin it, so they
  // still flow through the normal inference below.
  const preset =
    tags.rls_denied === "true" && isFeatureArea(tags.featureArea)
      ? tags.featureArea
      : null;
  const area: FeatureArea =
    preset ?? classifyByPath(route) ?? classifyByContent(haystacks) ?? "other";
  tags.featureArea = area;
  tags.priority = priorityFor(area);
  tags.rootCauseHint = rootCauseHint(area, haystacks);

  // Dashboard marker — this code path runs only after noise filtering,
  // so every event reaching enrichEventTags is "real". Sentry filter:
  // `dashboard:real_problems` shows just MercyBlade-originating issues.
  tags.dashboard = "real_problems";

  const roomId = parseRoomId(route);
  if (roomId) tags.roomId = roomId;

  // is_anon — captureException only ever sets `user.id`. Missing id ⇒
  // not signed in. (No PII risk: this is a boolean, not the id itself.)
  tags.is_anon = event.user?.id ? "no" : "yes";

  // userImpact — coarse paid/trial/anon/unknown bucket so Sentry can
  // sort issues by who's affected. No PII (email/name/id/subscription
  // object) — only the bucket label.
  tags.userImpact = safeUserImpact(event);

  const online = safeIsOnline();
  if (typeof online === "boolean") tags.online = online ? "yes" : "no";

  const pwa = safeIsPwa();
  if (typeof pwa === "boolean") tags.pwa = pwa ? "yes" : "no";

  // Release awareness — tag whether the event came from the bundle
  // we're currently running. "yes" requires both a known build SHA and
  // a matching event.release. Anything else is "unknown" — never "no",
  // because we're not certain enough to drop or downrank these events
  // and we don't want to hide real bugs.
  if (typeof event.release === "string" && event.release.length > 0) {
    tags.current_release =
      BUILD_RELEASE && event.release === BUILD_RELEASE ? "yes" : "unknown";
  }

  // Level mapping — P1 (core-feature break) → "error" (Sentry's default
  // for unhandled exceptions, but we set it explicitly so Sentry-side
  // alert rules can filter on level). P3 (non-core) → "warning" so it
  // doesn't drown out P1 signal in the Issues feed. P2 is intentionally
  // not produced client-side — let Sentry alert rules promote frequent
  // P3 issues server-side.
  event.level = tags.priority === "P1" ? "error" : "warning";

  // Stale-deploy chunk-load failure handling. This is a deploy-timing
  // artefact, not a code bug — Tier-1 (lazyWithRetry) and Tier-2
  // (ErrorBoundary) cache-busting recovery in chunkReload.ts refetch the
  // new build. While recovery is still in play ("attempted") downgrade to
  // warning / P3 so a routine deploy doesn't masquerade as a P1 crash in
  // the real-problems dashboard. Once the ErrorBoundary's escalated
  // cache-bust reload has ALSO been spent and the chunk STILL fails
  // ("exhausted"), it is a genuine residual — keep it at error / P1 so
  // the visible tail isn't lost. Separate fingerprint so the small error
  // tail isn't drowned by recovered-warning volume. Done last so it
  // overrides the level/priority/fingerprint set above.
  const chunkHaystack = [
    event.exception?.values?.[0]?.value ?? "",
    typeof event.message === "string" ? event.message : "",
  ].join(" ");
  if (looksLikeChunkLoadFailure(chunkHaystack)) {
    const exhausted = chunkRecoveryExhausted();
    tags.chunkRecovery = exhausted ? "exhausted" : "attempted";
    tags.chunkRecoveryAttempts = exhausted ? "2" : "1";
    tags.priority = exhausted ? "P1" : "P3";
    event.level = exhausted ? "error" : "warning";
    event.fingerprint = [
      "mercyblade",
      "chunk-load",
      exhausted ? "exhausted" : "attempted",
    ];
    return;
  }

  // Fingerprint grouping — namespace everything from MercyBlade under a
  // shared root so our errors form their own grouping tree, then split
  // by featureArea + a PII-stripped error shape. Same-kind errors
  // group; user-specific data (roomId, query strings, IDs, URLs, quoted
  // literals) is stripped out by normalizeMessage so we don't fan out
  // into one Sentry issue per user.
  event.fingerprint = ["mercyblade", area, normalizeMessage(event)];
}

// ── Test-only helpers ────────────────────────────────────────────────────

export function __resetForTest(): void {
  initialized = false;
  dsnConfigured = false;
  disabledReasonLogged = false;
  sentryModule = null;
  sentryReadyPromise = null;
  resolveSentryReady = null;
}
