// src/lib/telemetry/signalCell.ts
//
// "Signal cell" — every user-facing placement action emits a coded signal on
// started / succeeded / failed{reason,code}, so a failure or a hang is visible
// in Sentry instead of reverse-engineered from network logs.
//
// Sinks (both EXISTING infra — no new backend):
//   - started / succeeded → Sentry breadcrumbs. Sentry keeps the last ~100 and
//     attaches them to the next captured event, which is exactly a flow trail:
//     when a failure lands, the breadcrumbs show what ran before it.
//   - failed              → Sentry event, with the action code as the INDEXED
//     `action_code` tag (see captureActionFailure) so alert rules can key on it.
//
//   The learning-event drain sink (src/lib/learning/eventSink.ts) was evaluated
//   as the started/succeeded sink and rejected: it is gated OFF by default, its
//   row schema models pedagogy (targetLanguage / safeTopicTag / ruleOrDetectorId)
//   not ops, and writing to it would couple placement telemetry to Lane A's
//   queue. Breadcrumbs give the same flow trail at zero schema cost.
//
// TWO INVARIANTS, both load-bearing:
//
//   1. Telemetry NEVER changes behavior. A timeout EMITS a signal; it does not
//      abort, reject, or cancel the underlying work. `track()` rethrows the
//      original error untouched. Removing this makes an observability tool into
//      a failure injector.
//
//   2. A cell emits AT MOST ONE terminal signal. An action that times out and
//      then throws reports `timeout` (the first terminal event) and nothing
//      else. Without this, a slow-then-failing action double-counts.

import { addBreadcrumb, captureActionFailure } from "@/lib/monitoring/captureException";
import {
  ACTION_TIMEOUT_MS,
  type ActionFailureReason,
  type PlacementActionCode,
} from "./actionCodes";

const BREADCRUMB_CATEGORY = "placement.action";

/**
 * Flag gate. Default ON — the telemetry is non-destructive (breadcrumbs plus
 * failure events) and its whole value is being on before a bug happens. Only
 * the exact string "false" disables it, so an unset var stays on.
 */
export function isPlacementTelemetryEnabled(): boolean {
  try {
    return import.meta.env?.VITE_PLACEMENT_TELEMETRY_ENABLED !== "false";
  } catch {
    return true;
  }
}

/** Context carried on every signal for this cell. Never raw learner text. */
export type SignalContext = Record<string, string | number | boolean | undefined>;

export type SignalCell = {
  /** Close the cell as succeeded. No-op if already closed. */
  succeeded: (context?: SignalContext) => void;
  /** Close the cell as failed. No-op if already closed. */
  failed: (reason: ActionFailureReason, context?: SignalContext) => void;
  /** Close the cell without emitting (e.g. React unmount / superseded). */
  cancel: () => void;
};

export type OpenSignalOptions = {
  /** Override the per-code budget from ACTION_TIMEOUT_MS. */
  timeoutMs?: number;
  context?: SignalContext;
  /** Injected for tests. */
  now?: () => number;
  setTimer?: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
  clearTimer?: (handle: ReturnType<typeof setTimeout>) => void;
};

/**
 * Open a signal cell for an action.
 *
 * This is the primitive, and it is imperative on purpose: the audio load path
 * is event-driven (`loadedmetadata` / `error` on an <audio> element), not a
 * promise, so a promise-only API could not instrument the very bug that
 * motivated this system. `track()` below is the promise wrapper.
 *
 * Emits `started` immediately and arms the timeout. The caller MUST eventually
 * call succeeded / failed / cancel — if it never does, the timer fires and the
 * hang becomes visible, which is the entire point.
 */
export function openSignal(
  code: PlacementActionCode,
  options: OpenSignalOptions = {},
): SignalCell {
  if (!isPlacementTelemetryEnabled()) return NOOP_CELL;

  const now = options.now ?? (() => Date.now());
  const setTimer = options.setTimer ?? ((fn, ms) => setTimeout(fn, ms));
  const clearTimer = options.clearTimer ?? ((handle) => clearTimeout(handle));
  const timeoutMs = options.timeoutMs ?? ACTION_TIMEOUT_MS[code];
  const startedAt = now();
  const baseContext = options.context ?? {};

  let closed = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const close = (): boolean => {
    if (closed) return false;
    closed = true;
    if (timer !== null) clearTimer(timer);
    timer = null;
    return true;
  };

  addBreadcrumb({
    category: BREADCRUMB_CATEGORY,
    message: `${code} started`,
    level: "info",
    data: { action_code: code, outcome: "started", ...baseContext },
  });

  timer = setTimer(() => {
    // The action never settled inside its budget. Emit, but leave the work
    // running — see invariant (1).
    if (!close()) return;
    captureActionFailure(code, "timeout", {
      ...baseContext,
      timeout_ms: timeoutMs,
      elapsed_ms: now() - startedAt,
    });
  }, timeoutMs);

  return {
    succeeded(context) {
      if (!close()) return;
      addBreadcrumb({
        category: BREADCRUMB_CATEGORY,
        message: `${code} succeeded`,
        level: "info",
        data: {
          action_code: code,
          outcome: "succeeded",
          duration_ms: now() - startedAt,
          ...baseContext,
          ...context,
        },
      });
    },
    failed(reason, context) {
      if (!close()) return;
      captureActionFailure(code, reason, {
        ...baseContext,
        ...context,
        duration_ms: now() - startedAt,
      });
    },
    cancel() {
      close();
    },
  };
}

const NOOP_CELL: SignalCell = {
  succeeded: () => {},
  failed: () => {},
  cancel: () => {},
};

/**
 * Promise wrapper around `openSignal`. Runs `fn` inside a cell.
 *
 * Rethrows whatever `fn` threw, unchanged — callers keep their existing error
 * handling. A timeout does not reject: if `fn` eventually resolves after the
 * budget, the caller still gets its value, and Sentry already holds the
 * `failed{timeout}` signal.
 */
export async function track<T>(
  code: PlacementActionCode,
  fn: () => Promise<T> | T,
  options: OpenSignalOptions = {},
): Promise<T> {
  const cell = openSignal(code, options);
  try {
    const value = await fn();
    cell.succeeded();
    return value;
  } catch (error) {
    cell.failed("exception", {
      error_name: error instanceof Error ? error.name : typeof error,
      error_message: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
