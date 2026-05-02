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
 *   - Session Replay is currently OFF on all platforms.
 */

import { stripPII } from "@/lib/security/piiProtection";

// `unknown` instead of typeof import("@sentry/react") so a static-analysis
// pass over this file doesn't pull Sentry's types into the build graph.
// Cast inside getSentryModule callers when needed.
let sentryModule: unknown = null;

let initialized = false;
let dsnConfigured = false;
let disabledReasonLogged = false;

export function isSentryEnabled(): boolean {
  return dsnConfigured;
}

export function getSentryModule(): unknown {
  return sentryModule;
}

export function initSentry(): void {
  if (initialized) return;
  initialized = true;

  // Vitest sets MODE='test'. Belt-and-braces guard so tests never wire up
  // the real SDK even if a DSN slips into the test env. Kept BEFORE the
  // async IIFE so test runs never trigger the dynamic SDK import either.
  if (import.meta.env.MODE === "test") return;

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
          const scrubbed = scrubEvent(event as SentryEventLike);
          return scrubbed === null ? null : event;
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
        SentryCap.init(
          sharedOptions as Parameters<typeof SentryCap.init>[0],
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
        SentryReact.init(
          sharedOptions as Parameters<typeof SentryReact.init>[0],
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
    }
  })();
}

// ── PII scrubbers (exported for unit tests) ─────────────────────────────

type SentryEventLike = {
  message?: string;
  user?: { id?: string | number; email?: string; username?: string; ip_address?: string };
  request?: { data?: unknown; query_string?: string; cookies?: unknown };
  exception?: { values?: Array<{ value?: string; type?: string }> };
  breadcrumbs?: Array<SentryBreadcrumbLike>;
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

// ── Test-only helpers ────────────────────────────────────────────────────

export function __resetForTest(): void {
  initialized = false;
  dsnConfigured = false;
  disabledReasonLogged = false;
  sentryModule = null;
}