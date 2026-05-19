/**
 * Shared Sentry capture for Supabase edge functions.
 *
 * Activation model mirrors the client (`src/lib/monitoring/sentryInit.ts`):
 *   - SENTRY_DSN env var is the single switch. Empty / unset ⇒ no-op.
 *   - The Sentry Deno SDK is loaded via dynamic ESM import only when a
 *     DSN is configured, so the cold-start cost is zero on functions
 *     that don't opt in.
 *   - On any Sentry SDK failure (network, ESM resolution, init throw)
 *     the helpers fall through to console-only logging. Crash visibility
 *     is a "nice to have" — the function's response path must never
 *     depend on Sentry being reachable.
 *
 * Privacy contract:
 *   - User context carries `{ id }` only. No email / username / IP.
 *   - Free-text fields (request bodies, params) are NOT auto-attached;
 *     callers pass an explicit `extra` map after their own scrubbing.
 *
 * Usage pattern (drop-in for `serve(...)`):
 *
 *     import { wrapHandler } from '../_shared/sentry.ts';
 *     serve(wrapHandler('azure-phoneme', async (req) => {
 *       // ... existing handler body
 *     }));
 *
 * `wrapHandler` catches anything thrown by the inner handler, ships it
 * to Sentry with `function_name` tag + `user_id` (when the JWT is
 * attached), and re-throws so the platform's normal error response
 * (500 + structured log) is unchanged.
 */

// deno-lint-ignore-file no-explicit-any

type SentryShape = {
  init: (cfg: Record<string, unknown>) => void;
  captureException: (err: unknown, hint?: { extra?: Record<string, unknown>; tags?: Record<string, string> }) => void;
  setUser: (user: { id: string } | null) => void;
  setTag: (key: string, value: string) => void;
  flush: (timeoutMs?: number) => Promise<boolean>;
  addBreadcrumb: (breadcrumb: {
    category?: string;
    message?: string;
    level?: "fatal" | "error" | "warning" | "info" | "debug";
    data?: Record<string, unknown>;
    type?: string;
    timestamp?: number;
  }) => void;
};

let sentryModule: SentryShape | null = null;
let initialized = false;
let initInFlight: Promise<void> | null = null;

function getDsn(): string {
  // Deno.env is the canonical edge-function env API.
  // deno-lint-ignore no-explicit-any
  const env = (globalThis as any).Deno?.env;
  if (!env) return '';
  return String(env.get?.('SENTRY_DSN') ?? '').trim();
}

function getEnv(): string {
  // deno-lint-ignore no-explicit-any
  const env = (globalThis as any).Deno?.env;
  if (!env) return 'production';
  return String(env.get?.('APP_ENV') ?? env.get?.('SUPABASE_ENV') ?? 'production').trim();
}

async function ensureInit(): Promise<SentryShape | null> {
  if (initialized) return sentryModule;
  if (initInFlight) {
    await initInFlight;
    return sentryModule;
  }

  const dsn = getDsn();
  if (!dsn) {
    initialized = true;
    return null;
  }

  initInFlight = (async () => {
    try {
      // Sentry's Deno SDK lives at https://deno.land/x/sentry. Pinned
      // version keeps cold-start ESM resolution deterministic.
      const sentry = (await import(
        'https://deno.land/x/sentry@7.119.0/index.mjs'
      )) as unknown as SentryShape;

      sentry.init({
        dsn,
        environment: getEnv(),
        // Edge functions are short-lived; performance traces would
        // multiply event volume without much insight. Errors only.
        tracesSampleRate: 0,
        // No replays in Deno.
      });
      sentryModule = sentry;
    } catch (err) {
      // Init failed — log and stay disabled for this isolate. Don't
      // retry on every invocation; the dynamic import is the expensive
      // part and a single failure usually means the URL is unreachable
      // from this region.
      console.warn('[sentry-edge] init failed; monitoring disabled', err);
      sentryModule = null;
    } finally {
      initialized = true;
    }
  })();

  await initInFlight;
  return sentryModule;
}

export interface CaptureOptions {
  functionName: string;
  userId?: string | null;
  extra?: Record<string, unknown>;
  /**
   * Low-cardinality, INDEXED Sentry tags for dashboard faceting. Sentry
   * indexes tags (filterable/aggregatable) but NOT `extra` — anything an
   * ops dashboard needs to group by (provider, event type, severity,
   * pipeline stage) belongs here, not in `extra`. Keep values bounded:
   * never a raw id, body, or free text. Merged on top of the always-set
   * `function_name` tag; callers must not override `function_name`.
   */
  tags?: Record<string, string>;
}

/**
 * Send an error to Sentry with function-name tag + optional user id.
 * Safe to call from anywhere; no-op when SENTRY_DSN is unset.
 */
export async function captureEdgeError(error: unknown, options: CaptureOptions): Promise<void> {
  const sdk = await ensureInit();
  if (!sdk) return;

  try {
    sdk.setTag('function_name', options.functionName);
    if (options.userId) {
      sdk.setUser({ id: options.userId });
    }
    // function_name is always pinned and wins over caller tags so a
    // dashboard can always attribute the event to its source function.
    const mergedTags: Record<string, string> = {
      ...(options.tags ?? {}),
      function_name: options.functionName,
    };
    // Also setTag each (scope-level) so the tags are present even if a
    // future SDK version ignores the per-call `tags` hint.
    for (const [k, v] of Object.entries(mergedTags)) {
      sdk.setTag(k, v);
    }
    sdk.captureException(error, {
      tags: mergedTags,
      extra: options.extra,
    });
    // Edge function isolates can be torn down before Sentry's batched
    // network call goes out — flush with a short ceiling so we don't
    // hold up the response.
    await sdk.flush(2000);
  } catch (err) {
    console.warn('[sentry-edge] capture failed', err);
  }
}

export interface BreadcrumbOptions {
  category: string;
  message: string;
  level?: "fatal" | "error" | "warning" | "info" | "debug";
  data?: Record<string, unknown>;
}

/**
 * Emit a Sentry breadcrumb. Used by the A18 downgrade beacon (and
 * future structured-event needs). Safe to call when SENTRY_DSN is
 * unset — returns without throwing.
 *
 * Breadcrumbs are batched on the Sentry scope and attached to the
 * next captured event. Until that event fires the breadcrumb is held
 * in-isolate; for downgrades that the caller wants observable
 * independently of any error, pair this with structured logging.
 */
export async function addEdgeBreadcrumb(options: BreadcrumbOptions): Promise<void> {
  const sdk = await ensureInit();
  if (!sdk) return;

  try {
    sdk.addBreadcrumb({
      category: options.category,
      message: options.message,
      level: options.level ?? "info",
      data: options.data,
    });
  } catch (err) {
    console.warn('[sentry-edge] breadcrumb failed', err);
  }
}

/** Best-effort user-id extraction from an Authorization header JWT
 * payload. Does NOT verify the signature — the function's own auth
 * check is the gate. We only need the `sub` claim to attribute crash
 * reports to a user cohort. Returns null on any malformed input. */
export function readUserIdFromAuthHeader(req: Request): string | null {
  const authHeader = req.headers.get('Authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = parts[1];
    // base64url → base64
    const padded = payload.replace(/-/g, '+').replace(/_/g, '/').padEnd(
      payload.length + ((4 - (payload.length % 4)) % 4),
      '=',
    );
    const json = JSON.parse(atob(padded));
    const sub = typeof json?.sub === 'string' ? json.sub : null;
    return sub;
  } catch {
    return null;
  }
}

/**
 * Drop-in wrapper for an edge-function handler. Catches throws and
 * unhandled rejections, attributes them to the function name, attaches
 * the user id (if present), and rethrows so the platform sees the
 * original error and produces its normal 500 / log line.
 */
export function wrapHandler(
  functionName: string,
  handler: (req: Request) => Response | Promise<Response>,
): (req: Request) => Promise<Response> {
  return async (req: Request): Promise<Response> => {
    try {
      return await handler(req);
    } catch (err) {
      const userId = readUserIdFromAuthHeader(req);
      // Fire-and-forget; we don't want the capture to block the error
      // response, but we do want it to start before we rethrow.
      void captureEdgeError(err, {
        functionName,
        userId,
        extra: { method: req.method, url: stripUrlPii(req.url) },
      });
      throw err;
    }
  };
}

/** Strip query strings entirely — they often carry tokens or PII. */
function stripUrlPii(url: string): string {
  try {
    const u = new URL(url);
    return `${u.origin}${u.pathname}`;
  } catch {
    return url;
  }
}
