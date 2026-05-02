/**
 * Sentry initialization (Capacitor SDK wrap — web + iOS + Android).
 *
 * Activation model:
 *   - VITE_SENTRY_DSN is the single switch. Empty string ⇒ full no-op:
 *     - the @sentry/capacitor + @sentry/react modules are NEVER imported
 *       (dynamic imports are gated behind the DSN check), so Vite splits
 *       them into their own chunks that simply aren't fetched in the
 *       no-DSN deployment.
 *     - captureError / tagWithUser / clearUser become no-ops via
 *       isSentryEnabled().
 *   - During tests (vitest sets import.meta.env.MODE === 'test') we
 *     hard-skip init even if a DSN is somehow present, so suites stay
 *     deterministic and never ship breadcrumbs to a real Sentry project.
 *
 * Why @sentry/capacitor (not @sentry/react alone):
 *   The Capacitor SDK wraps the React SDK and adds native crash reporting
 *   on iOS (Swift/Obj-C) and Android (Java/Kotlin). On web it degrades to
 *   the React SDK behavior. One project, one DSN, three platforms.
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
 *   - Session Replay is currently OFF on all platforms. If we re-enable it
 *     for web, wire it via SentryReact.replayIntegration() — the Capacitor
 *     SDK options surface doesn't expose replay sample rates directly.
 *
 * Activation requires Chau's daytime DSN setup — see
 * reports/a6-sentry-runbook.md.
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
  // the real SDK even if a DSN slips into the test env.
  if (import.meta.env.MODE === "test") return;

  // Build-time check: Vite inlines import.meta.env.VITE_SENTRY_DSN as a
  // literal string at build time. With an empty DSN (today's default),
  // this becomes `if (!"")` → always-true → the dynamic import below is
  // unreachable, so Vite tree-shakes @sentry/react out of the bundle
  // entirely. With a DSN set at build time, the import survives and
  // ships as a separate chunk.
  if (!import.meta.env.VITE_SENTRY_DSN) {
    if (!disabledReasonLogged) {
      console.info("[sentry] disabled — VITE_SENTRY_DSN not set");
      disabledReasonLogged = true;
    }
    return;
  }

  const dsn = String(import.meta.env.VITE_SENTRY_DSN).trim();
  const env = String(
    import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE ?? "development",
  ).trim();
  const isProd = env === "production" || env === "prod";
  // Vercel injects VERCEL_GIT_COMMIT_SHA at build time; vite.config.ts
  // re-exports it as VITE_VERCEL_GIT_COMMIT_SHA via `define`. Empty in
  // local builds → undefined release (Sentry's auto-detect default).
  const release =
    String(import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA ?? "").trim() || undefined;

  void Promise.all([
    import("@sentry/capacitor"),
    import("@sentry/react"),
  ])
    .then(([SentryCap, SentryReact]) => {
      SentryCap.init(
        {
          dsn,
          release,
          environment: env,
          tracesSampleRate: isProd ? 0.1 : 1.0,
          // Replay is web-only (and not in CapacitorOptions surface). If
          // we ever want session-replay on web, wire it as a React-side
          // integration via the sibling init below — keep it off by
          // default so we don't double-bill on native crashes.
          beforeSend(event) {
            // scrubEvent mutates the event in place; return Sentry's own
            // typed object so the SDK's strict ErrorEvent type is preserved.
            scrubEvent(event as unknown as SentryEventLike);
            return event;
          },
          beforeBreadcrumb(breadcrumb) {
            const result = scrubBreadcrumb(breadcrumb as unknown as SentryBreadcrumbLike);
            return result === null ? null : breadcrumb;
          },
        },
        // Sibling init — Capacitor SDK wraps the React SDK on web and
        // delegates native error capture to its Cocoa / Android plugins.
        SentryReact.init,
      );

      // Tag every event with the runtime platform so the dashboard can
      // filter web vs ios vs android. We avoid a static import of
      // @capacitor/core here because vitest's jsdom env can't resolve
      // it; @sentry/capacitor itself depends on it transitively, so
      // checking window.Capacitor at runtime is sufficient and safe.
      let platform: string = "web";
      try {
        const w = window as { Capacitor?: { getPlatform?: () => string } };
        platform = w.Capacitor?.getPlatform?.() ?? "web";
      } catch {
        platform = "web";
      }
      try {
        SentryCap.setTag("platform", platform);
      } catch {
        // never block init on a tag write
      }

      sentryModule = SentryCap;
      dsnConfigured = true;
      console.info(`[sentry] initialized (env=${env}, platform=${platform})`);
    })
    .catch((err) => {
      // A dynamic-import failure (offline first load, server hiccup) must
      // not break the app. Log and continue with Sentry disabled.
      console.warn("[sentry] dynamic import failed; monitoring disabled this session", err);
    });
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
