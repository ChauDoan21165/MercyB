/**
 * Sentry capture wrappers — gated by isSentryEnabled() so callers don't
 * have to check the activation state themselves.
 *
 * All three functions are no-ops when Sentry isn't initialized (DSN empty,
 * test mode, dynamic import not yet resolved, or initSentry hasn't been
 * called yet). That makes them safe to call eagerly from feature code
 * without worrying about boot-order races.
 *
 * Privacy:
 *   - tagWithUser ONLY accepts a userId. Never wire email / username /
 *     phone here — the user.* stripping in scrubEvent is the second line
 *     of defence, this function is the first.
 *   - captureError sanitizes string values in the optional context map
 *     through stripPII before forwarding to Sentry.
 */

import { isSentryEnabled, getSentryModule, classifyRlsTable } from "./sentryInit";
import { stripPII } from "@/lib/security/piiProtection";

// Narrow shape of the bits of @sentry/react we use. The actual module is
// loaded dynamically inside sentryInit.ts; this lets us call into it
// without a static import that would force the SDK into the bundle.
type SentryShape = {
  captureException: (error: unknown, hint?: { extra?: Record<string, unknown> }) => void;
  setUser: (user: { id: string } | null) => void;
  setTag: (key: string, value: string) => void;
  withScope: (cb: (scope: { setTag: (k: string, v: string) => void }) => void) => void;
  addBreadcrumb: (b: {
    category?: string;
    message?: string;
    level?: "info" | "warning" | "error" | "debug";
    data?: Record<string, unknown>;
  }) => void;
};

/** Account tier as exposed to Sentry — never PII, only coarse cohort. */
export type SentryTier = "anon" | "trial" | "trial_expired" | "free" | "premium" | "admin";

export function captureError(
  error: unknown,
  context?: Record<string, unknown>,
): void {
  if (!isSentryEnabled()) return;
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
export function captureRlsDenied(table: string, method: string): void {
  if (!isSentryEnabled()) return;
  const sdk = getSentryModule() as SentryShape | null;
  if (!sdk || typeof sdk.withScope !== "function") return;
  const area = classifyRlsTable(table);
  sdk.withScope((scope) => {
    scope.setTag("rls_denied", "true");
    scope.setTag("rls_table", table || "unknown");
    if (area) scope.setTag("featureArea", area);
    sdk.captureException(
      new Error(`PostgREST 403 (RLS denied): ${table} [${method}]`),
    );
  });
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
