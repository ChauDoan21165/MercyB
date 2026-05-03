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
          const e = event as SentryEventLike;
          // 1. Strip PII from message / exception / breadcrumbs / request.
          const scrubbed = scrubEvent(e);
          if (scrubbed === null) return null;
          // 2. Drop external-script noise (FB/IG/Zalo IAB injection,
          //    browser-extension stacks, third-party SDK CDNs). These
          //    crashes don't originate in our code and we can't fix them.
          if (looksLikeExternalNoise(scrubbed)) return null;
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

export type FeatureArea = "auth" | "billing" | "room" | "mercy" | "audio" | "other";
export type Priority = "P1" | "P3";

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

// P1 = core feature break (auth/billing/room/mercy/audio).
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
  if (area === "auth" && /supabase|jwt|\bsession\b/i.test(blob)) return "auth_session_or_rls";
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

export function enrichEventTags(event: SentryEventLike): void {
  event.tags = event.tags ?? {};
  const tags = event.tags;

  const route = safePathname();
  if (route) tags.route = route;

  const haystacks = collectNoiseHaystacks(event);
  const area: FeatureArea =
    classifyByPath(route) ?? classifyByContent(haystacks) ?? "other";
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
}