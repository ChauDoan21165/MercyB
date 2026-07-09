/**
 * Sentry capture wrappers — gated by isSentryEnabled() so callers don't
 * have to check the activation state themselves.
 *
 * Route-gate trigger (3): Sentry is no longer auto-initialized at boot
 * (sentryActivation.ts). So an explicit pre-init call is itself a signal
 * that monitoring is needed this session:
 *   - captureError(): the value is enqueued into the bounded boot buffer
 *     AND Sentry init is pulled, so the exception is replayed (beforeSend
 *     scrub + dedupe still apply) once init settles — never lost.
 *   - captureMessage() / captureRlsDenied(): pull Sentry init so this and
 *     every subsequent ops/RLS signal lands. The FIRST pre-init call's
 *     payload is not replayed (these aren't exceptions; the boot buffer
 *     only round-trips through captureException, and captureRlsDenied's
 *     rls_* tags can't survive a bare-exception replay). This keeps the
 *     security RLS alert (#578/#562) live for an anonymous user — it
 *     keys on SUSTAINED denials, which a regression always produces —
 *     while a one-off pre-init signal is the acceptable cost of the
 *     route-gate. A documented, deliberate trade-off.
 * The remaining scope-mutation wrappers (tagWithUser/setTag/addBreadcrumb)
 * stay pure no-ops pre-init: they carry no event, only scope state that
 * is meaningless until an event exists, so queuing them would be noise.
 * All wrappers remain safe to call eagerly without boot-order races.
 *
 * Privacy:
 *   - tagWithUser ONLY accepts a userId. Never wire email / username /
 *     phone here — the user.* stripping in scrubEvent is the second line
 *     of defence, this function is the first.
 *   - captureError sanitizes string values in the optional context map
 *     through stripPII before forwarding to Sentry.
 */

import { isSentryEnabled, getSentryModule, classifyRlsTable } from "./sentryInit";
import {
  queueExplicitCapture,
  activateSentry,
} from "./sentryActivation";
import { stripPII } from "@/lib/security/piiProtection";

// Narrow shape of the bits of @sentry/react we use. The actual module is
// loaded dynamically inside sentryInit.ts; this lets us call into it
// without a static import that would force the SDK into the bundle.
type SentryShape = {
  captureException: (error: unknown, hint?: { extra?: Record<string, unknown> }) => void;
  captureMessage: (
    message: string,
    levelOrHint?: "info" | "warning" | "error" | { level?: string; extra?: Record<string, unknown> },
  ) => void;
  setUser: (user: { id: string } | null) => void;
  setTag: (key: string, value: string) => void;
  getCurrentScope?: () => { getUser?: () => { id?: string } | null | undefined };
  withScope: (cb: (scope: { setTag: (k: string, v: string) => void }) => void) => void;
  addBreadcrumb: (b: {
    category?: string;
    message?: string;
    level?: "info" | "warning" | "error" | "debug";
    data?: Record<string, unknown>;
  }) => void;
};

type RlsSessionResult = {
  data?: {
    session?: {
      user?: { id?: string | null } | null;
    } | null;
  } | null;
} | null;

export type RlsDeniedCaptureContext = {
  authorizationHeader?: string | null;
  getSession?: () => Promise<RlsSessionResult>;
};

/** Account tier as exposed to Sentry — never PII, only coarse cohort. */
export type SentryTier = "anon" | "trial" | "trial_expired" | "free" | "premium" | "admin";

export function captureError(
  error: unknown,
  context?: Record<string, unknown>,
): void {
  if (!isSentryEnabled()) {
    // Trigger (3): queue into the boot buffer + pull Sentry init so the
    // exception is replayed once the SDK is up. `context` is dropped on
    // the pre-init path (the buffer round-trips bare exceptions only);
    // accepted cost — the exception itself is the signal that matters.
    queueExplicitCapture(error);
    return;
  }
  const sdk = getSentryModule() as SentryShape | null;
  if (!sdk) return;

  const safeContext: Record<string, unknown> = {};
  if (context) {
    for (const [k, v] of Object.entries(context)) {
      safeContext[k] = typeof v === "string" ? stripPII(v) : v;
    }
  }

  sdk.captureException(error, { extra: safeContext });
}

/**
 * Capture a non-exceptional ops signal as a `warning` (or chosen level)
 * Sentry event. Unlike captureError this is NOT a crash — use it for
 * "the app kept working but something is degraded" beacons that ops
 * needs visibility into (e.g. a content gap silently served the wrong
 * language). String values in `context` are PII-stripped, same as
 * captureError. No-op when Sentry is disabled (tests / SSR / no DSN).
 *
 * Callers MUST dedupe high-frequency signals themselves (a render path
 * that fires every mount would flood Sentry) — this wrapper does not.
 */
export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "warning",
  context?: Record<string, unknown>,
): void {
  if (!isSentryEnabled()) {
    // Pull Sentry init so this and every later ops signal lands. This
    // first message isn't replayed (non-exception; see file header).
    activateSentry("explicit-message");
    return;
  }
  const sdk = getSentryModule() as SentryShape | null;
  if (!sdk || typeof sdk.captureMessage !== "function") return;

  const safeContext: Record<string, unknown> = {};
  if (context) {
    for (const [k, v] of Object.entries(context)) {
      safeContext[k] = typeof v === "string" ? stripPII(v) : v;
    }
  }

  sdk.captureMessage(message, { level, extra: safeContext });
}

/**
 * Capture a PostgREST RLS denial (HTTP 403 on the /rest/v1/ data plane)
 * as a tagged Sentry event. `rls_denied=true` + `rls_table` are set as
 * INDEXED tags on THIS event only — `withScope` isolates them so they
 * never leak onto later events the way a global setTag would. A Sentry
 * alert rule keys on `rls_denied:true` to catch a silent
 * get_admin_level / RLS-predicate regression (#578, #562): supabase-js
 * returns a 403 as a value, never throws it, so without this it reaches
 * Sentry nowhere. No-op when Sentry is disabled (tests / SSR / no DSN).
 *
 * For admin/privileged tables we ALSO pin `featureArea=admin` here so
 * the low-volume `featureArea:admin` alert is reliable. enrichEventTags
 * (beforeSend) would otherwise overwrite featureArea by route/content;
 * it preserves a pinned value for rls_denied events. Non-admin tables
 * are left unpinned → normal route/content inference still runs.
 */
export function captureRlsDenied(
  table: string,
  method: string,
  context: RlsDeniedCaptureContext = {},
): void {
  if (!isSentryEnabled()) {
    // Pull Sentry init so a SUSTAINED RLS regression still reaches the
    // #578/#562 alert for an anonymous user. The first denial's rls_*
    // tags can't survive a bare-exception buffer replay, so it is not
    // queued — documented trade-off (see file header).
    activateSentry("explicit-rls");
    return;
  }
  const sdk = getSentryModule() as SentryShape | null;
  if (!sdk || typeof sdk.withScope !== "function") return;
  const area = classifyRlsTable(table);
  void captureRlsDeniedWithContext(sdk, table, method, area, context);
}

async function captureRlsDeniedWithContext(
  sdk: SentryShape,
  table: string,
  method: string,
  area: string | null,
  context: RlsDeniedCaptureContext,
): Promise<void> {
  const extra = await buildRlsDeniedContext(sdk, context);
  sdk.withScope((scope) => {
    scope.setTag("rls_denied", "true");
    scope.setTag("rls_table", table || "unknown");
    if (area) scope.setTag("featureArea", area);
    sdk.captureException(
      new Error(`PostgREST 403 (RLS denied): ${table} [${method}]`),
      { extra },
    );
  });
}

/**
 * Capture a placement "signal cell" failure as a tagged Sentry event.
 *
 * `action_code` + `failure_reason` are set as INDEXED tags on THIS event only
 * — `withScope` isolates them so they never leak onto later events the way a
 * global setTag would (same reasoning as captureRlsDenied). Dashboards and
 * alert rules key on `action_code`.
 *
 * The message is a stable, low-cardinality string so Sentry groups all
 * failures of one action+reason into a single issue; per-event detail rides in
 * `extra`. `failure_reason:timeout` is the one that makes a hang visible — an
 * action that never settles emits nothing else.
 *
 * No-op when Sentry is disabled (tests / SSR / no DSN), but still pulls init so
 * a sustained failure reaches Sentry once the SDK is up.
 */
export function captureActionFailure(
  actionCode: string,
  reason: string,
  context?: Record<string, unknown>,
): void {
  if (!isSentryEnabled()) {
    activateSentry("explicit-action-failure");
    return;
  }
  const sdk = getSentryModule() as SentryShape | null;
  if (!sdk || typeof sdk.withScope !== "function") return;

  const safeContext: Record<string, unknown> = {};
  if (context) {
    for (const [k, v] of Object.entries(context)) {
      safeContext[k] = typeof v === "string" ? stripPII(v) : v;
    }
  }

  sdk.withScope((scope) => {
    scope.setTag("action_code", actionCode);
    scope.setTag("failure_reason", reason);
    sdk.captureException(new Error(`${actionCode} failed: ${reason}`), {
      extra: safeContext,
    });
  });
}

async function buildRlsDeniedContext(
  sdk: SentryShape,
  context: RlsDeniedCaptureContext,
): Promise<Record<string, unknown>> {
  const session = await readRlsSession(context.getSession);

  return {
    route_pathname: getCurrentPathname(),
    sentry_scope_user_id: getSentryScopeUserId(sdk) ?? null,
    supabase_session_user_id: session.userId ?? null,
    supabase_session_lookup_error: session.lookupError,
    request_has_authorization_bearer: hasBearerAuthorization(context.authorizationHeader),
    request_token_expiry_status: getBearerExpiryStatus(context.authorizationHeader),
  };
}

async function readRlsSession(
  getSession: RlsDeniedCaptureContext["getSession"],
): Promise<{ userId: string | null; lookupError: boolean }> {
  if (!getSession) return { userId: null, lookupError: false };

  try {
    const result = await getSession();
    const id = result?.data?.session?.user?.id;
    return { userId: typeof id === "string" && id ? id : null, lookupError: false };
  } catch {
    return { userId: null, lookupError: true };
  }
}

function getCurrentPathname(): string | null {
  if (typeof window === "undefined") return null;
  return window.location?.pathname ?? null;
}

function getSentryScopeUserId(sdk: SentryShape): string | null {
  const user = sdk.getCurrentScope?.()?.getUser?.();
  return typeof user?.id === "string" && user.id ? user.id : null;
}

function hasBearerAuthorization(header: string | null | undefined): boolean {
  return getBearerToken(header) != null;
}

function getBearerExpiryStatus(
  header: string | null | undefined,
): "missing" | "valid" | "expired" | "unknown" {
  const token = getBearerToken(header);
  if (!token) return "missing";

  const exp = readJwtExp(token);
  if (typeof exp !== "number") return "unknown";

  return exp * 1000 <= Date.now() ? "expired" : "valid";
}

function getBearerToken(header: string | null | undefined): string | null {
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match?.[1] ? match[1] : null;
}

function readJwtExp(token: string): number | null {
  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    const decoded = JSON.parse(decodeBase64Url(payload)) as { exp?: unknown };
    return typeof decoded.exp === "number" ? decoded.exp : null;
  } catch {
    return null;
  }
}

function decodeBase64Url(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");

  if (typeof atob === "function") return atob(padded);
  return Buffer.from(padded, "base64").toString("utf8");
}

export function tagWithUser(userId: string | null | undefined): void {
  if (!isSentryEnabled()) return;
  if (!userId) return;
  const sdk = getSentryModule() as SentryShape | null;
  if (!sdk) return;
  // Deliberately {id: …} only — never email, username, or IP.
  sdk.setUser({ id: userId });
}

export function clearUser(): void {
  if (!isSentryEnabled()) return;
  const sdk = getSentryModule() as SentryShape | null;
  if (!sdk) return;
  sdk.setUser(null);
}

/**
 * Set a low-cardinality tag on the current scope. Sentry indexes tags for
 * search; never put per-request values (URLs, IDs) here — those go in
 * captureError's `context` extra. Common keys: `tier`, `route`,
 * `feature_flag.<name>`.
 *
 * Values are coerced to strings; null/undefined is a no-op (use a fresh
 * tag value to overwrite).
 */
export function setTag(key: string, value: string | null | undefined): void {
  if (!isSentryEnabled()) return;
  if (!key || value == null) return;
  const sdk = getSentryModule() as SentryShape | null;
  if (!sdk) return;
  sdk.setTag(key, String(value));
}

/**
 * Add a breadcrumb to the current scope. Sentry attaches the most recent
 * ~100 breadcrumbs to the next captured event, giving us a ring-buffer
 * timeline of "what was the user doing right before the crash."
 *
 * Use sparingly and never include raw user input — `scrubBreadcrumb` will
 * still PII-strip strings, but the cleanest path is to pass structured
 * data (room id, action name) instead of free text.
 */
export function addBreadcrumb(input: {
  category: string;
  message?: string;
  level?: "info" | "warning" | "error" | "debug";
  data?: Record<string, unknown>;
}): void {
  if (!isSentryEnabled()) return;
  const sdk = getSentryModule() as SentryShape | null;
  if (!sdk) return;
  sdk.addBreadcrumb(input);
}
