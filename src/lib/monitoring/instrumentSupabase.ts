/**
 * Supabase slow-query instrumentation.
 *
 * Wraps the canonical supabase singleton at construction so every
 * `.from(table).select/.insert/.update/.delete/.upsert/.eq/...` chain
 * and every `.rpc(fn, args)` invocation reports its wall-clock latency
 * to Sentry when it crosses a threshold. Observation-only: query
 * results are passed through unchanged.
 *
 * Why a single seam:
 *   PR-by-PR per-call timing would never converge across 200+ call
 *   sites and 30+ feature areas. Instrumenting at the singleton means
 *   any future code that imports `supabase` gets timing for free.
 *
 * Thresholds (gz-budget analog: a real regression fires, normal noise
 * does not — see A14 dispatch):
 *   - >= 5000ms  → captureMessage("very-slow-query", "error")
 *   - >= 2000ms  → captureMessage("slow-query",      "warning")
 *   -  < 2000ms  → NOT reported (Sentry would drown otherwise)
 *   - DEV only   → console.warn for any slow query, even tests
 *
 * PII contract:
 *   ZERO query arguments leave this module. `.eq("id", userId)` ships
 *   user IDs; `.match({ email })` ships emails. We capture ONLY:
 *     - table name (or "rpc:<fn>")
 *     - the terminal verb that was called (select/insert/update/...)
 *     - duration_ms
 *   Method arguments are never inspected. `captureMessage` further
 *   PII-strips string context values as a second line of defence.
 *
 * Feature flag:
 *   - VITE_SUPABASE_QUERY_INSTRUMENTATION_ENABLED="true"  → on
 *   - VITE_SUPABASE_QUERY_INSTRUMENTATION_ENABLED="false" → off
 *   - unset, MODE === "test"                              → off
 *   - unset, otherwise                                    → on
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { captureMessage } from "@/lib/monitoring/captureException";

/** Slow-query threshold in ms — warning level. */
export const SLOW_QUERY_MS = 2000;

/** Very-slow-query threshold in ms — error level. */
export const VERY_SLOW_QUERY_MS = 5000;

/**
 * Methods on the PostgREST query builder that select an "operation"
 * for the eventual round-trip. The chain may continue with filter
 * verbs after (eq/in/order/limit/...), but the terminal verb decides
 * what the request actually does and is the right thing to tag.
 */
const TERMINAL_VERBS = new Set([
  "select",
  "insert",
  "update",
  "delete",
  "upsert",
]);

type QueryContext = {
  /** Table name, or undefined for RPC calls. */
  table?: string;
  /** "select" | "insert" | "update" | "delete" | "upsert" | "rpc:<fn>" | "unknown" */
  operation: string;
};

/**
 * Whether instrumentation should attach. Reads the flag from both
 * `import.meta.env` (Vite-injected at build time, the production path)
 * and `process.env` (Node/vitest path — `vi.stubEnv` writes here too,
 * and unlike `import.meta.env` it propagates across module boundaries
 * in vitest, which is essential for the unit tests to be able to
 * toggle the flag).
 */
export function isInstrumentationEnabled(): boolean {
  let flag: unknown;
  let mode: unknown;
  try {
    const metaEnv = (import.meta as ImportMeta).env;
    if (metaEnv) {
      flag = metaEnv.VITE_SUPABASE_QUERY_INSTRUMENTATION_ENABLED;
      mode = metaEnv.MODE;
    }
  } catch {
    /* import.meta unavailable — fall through */
  }
  if (flag == null) {
    try {
      const proc =
        typeof process !== "undefined"
          ? (process as { env?: Record<string, string | undefined> })
          : undefined;
      if (proc?.env) {
        flag = proc.env.VITE_SUPABASE_QUERY_INSTRUMENTATION_ENABLED;
        if (mode == null) mode = proc.env.MODE ?? proc.env.NODE_ENV;
      }
    } catch {
      /* process.env unavailable — fall through */
    }
  }
  if (flag === "false" || flag === false) return false;
  if (flag === "true" || flag === true) return true;
  // Default: off in test, on everywhere else.
  if (mode === "test") return false;
  return true;
}

function reportTiming(durationMs: number, ctx: QueryContext): void {
  // PII-safe payload — only table/op/duration. Arg values never travel here.
  const payload = {
    table: ctx.table ?? "unknown",
    operation: ctx.operation,
    duration_ms: Math.round(durationMs),
  };

  // Always surface in dev so a slow query is visible without a Sentry trip.
  try {
    const env = (import.meta as ImportMeta).env;
    if (env?.DEV) {
      // eslint-disable-next-line no-console
      console.warn(
        `[supabase-slow-query] ${payload.operation} ${payload.table} ${payload.duration_ms}ms`,
      );
    }
  } catch {
    /* env access in non-Vite contexts is allowed to fail silently */
  }

  if (durationMs >= VERY_SLOW_QUERY_MS) {
    captureMessage("very-slow-query", "error", payload);
  } else if (durationMs >= SLOW_QUERY_MS) {
    captureMessage("slow-query", "warning", payload);
  }
}

function wrapBuilder<T extends object>(builder: T, ctx: QueryContext): T {
  // We mutate ctx.operation in-place when a method returns the same builder
  // (chain pattern). The Proxy below uses the latest ctx.operation at the
  // moment `.then` is invoked, so this is safe.
  const proxy = new Proxy(builder, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);

      // Terminal: the chain is being awaited. Time from .then() invocation
      // (when supabase-js dispatches the network request) to resolution.
      if (prop === "then") {
        if (typeof value !== "function") return value;
        return function (
          onFulfilled?: ((v: unknown) => unknown) | null,
          onRejected?: ((e: unknown) => unknown) | null,
        ) {
          const startedAt = performance.now();
          const settle = () => reportTiming(performance.now() - startedAt, ctx);
          return (value as (...args: unknown[]) => unknown).call(
            target,
            (result: unknown) => {
              settle();
              return onFulfilled ? onFulfilled(result) : result;
            },
            (err: unknown) => {
              settle();
              if (onRejected) return onRejected(err);
              throw err;
            },
          );
        };
      }

      if (typeof value !== "function") return value;

      // Method call on the builder. Update operation tag for terminal verbs
      // before invoking, then re-wrap whatever builder comes back so the
      // .then interception persists across chain hops.
      return function (...args: unknown[]) {
        if (typeof prop === "string" && TERMINAL_VERBS.has(prop)) {
          ctx.operation = prop;
        }
        const result = (value as (...args: unknown[]) => unknown).apply(
          target,
          args,
        );
        if (result === target) {
          // Builder returned `this`. Return the proxy receiver so the next
          // hop in the chain still goes through our get-trap.
          return receiver;
        }
        if (result && typeof result === "object") {
          return wrapBuilder(result as object, ctx);
        }
        return result;
      };
    },
  });
  return proxy as T;
}

/**
 * Wrap a Supabase client so every `.from()` and `.rpc()` chain reports
 * slow queries to Sentry. Returns the SAME client reference (mutated in
 * place) so existing imports of the singleton keep working unchanged.
 * No-op when the feature flag is disabled — returns the client untouched.
 */
export function instrumentSupabase(client: SupabaseClient): SupabaseClient {
  if (!isInstrumentationEnabled()) return client;

  type FromFn = SupabaseClient["from"];
  type RpcFn = SupabaseClient["rpc"];

  const origFrom: FromFn = client.from.bind(client);
  const origRpc: RpcFn = client.rpc.bind(client);

  // Mutate the singleton: rebind .from and .rpc to instrumented versions.
  // We cast to a writable shape because the SupabaseClient type marks both
  // methods as readonly; the runtime object permits assignment.
  const mutable = client as unknown as {
    from: FromFn;
    rpc: RpcFn;
  };

  mutable.from = ((table: string) => {
    const ctx: QueryContext = { table, operation: "unknown" };
    const builder = origFrom(table);
    return wrapBuilder(builder as unknown as object, ctx);
  }) as FromFn;

  mutable.rpc = ((fn: string, args?: unknown, options?: unknown) => {
    const ctx: QueryContext = { operation: `rpc:${fn}` };
    const builder = (origRpc as unknown as (
      f: string,
      a?: unknown,
      o?: unknown,
    ) => unknown)(fn, args, options);
    return wrapBuilder(builder as object, ctx);
  }) as RpcFn;

  return client;
}
