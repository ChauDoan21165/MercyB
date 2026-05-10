// src/components/ErrorBoundary.tsx — v2026-05-01-01
import React from "react";
import { captureError } from "@/lib/monitoring/captureException";

function safeStringify(x: unknown) {
  try {
    return JSON.stringify(x, null, 2);
  } catch {
    try {
      return String(x);
    } catch {
      return "[unstringifiable]";
    }
  }
}

function normalizeError(err: unknown) {
  if (err instanceof Error) {
    // IMPORTANT: some libraries throw Error("") (empty message)
    return {
      kind: "ErrorInstance" as const,
      name: err.name || "Error",
      message: err.message ?? "",
      stack: err.stack ?? "",
      raw: err,
      rawDump: {
        // sometimes extra fields exist
        ...Object.getOwnPropertyNames(err).reduce((acc: any, k) => {
          (acc as any)[k] = (err as any)[k];
          return acc;
        }, {}),
      },
    };
  }

  // thrown string/object/etc
  const asAny = err as any;

  return {
    kind: "NonErrorThrown" as const,
    name:
      typeof asAny?.name === "string"
        ? asAny.name
        : typeof err === "string"
          ? "StringThrown"
          : err == null
            ? "NullOrUndefinedThrown"
            : "NonErrorThrown",
    message:
      typeof asAny?.message === "string"
        ? asAny.message
        : typeof err === "string"
          ? err
          : "",
    stack: typeof asAny?.stack === "string" ? asAny.stack : "",
    raw: err,
    rawDump: err,
  };
}

function isAuthLockAbortError(err: unknown): boolean {
  return (
    err instanceof DOMException &&
    err.name === "AbortError" &&
    err.message.includes("Lock broken by another request with the 'steal' option")
  );
}

type Props = { children: React.ReactNode };

type State = {
  hasError: boolean;
  authLockRecovery: number;
  err?: ReturnType<typeof normalizeError>;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, authLockRecovery: 0 };

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, err: normalizeError(error) };
  }

  componentDidCatch(error: unknown, info: unknown) {
    const n = normalizeError(error);

    // Auth-lock AbortError is a legitimate cross-tab lock handoff from the
    // Web Locks API (Supabase auth internal lock). The newer tab/client
    // has taken over auth state — the older tab should silently recover
    // by re-rendering children rather than showing the white crash screen.
    // We force a clean remount via authLockRecovery key to avoid a
    // re-throw loop, and log to Sentry as a warning for frequency tracking.
    if (isAuthLockAbortError(error)) {
      console.warn(
        "[ErrorBoundary] auth-lock AbortError (silent recovery)",
        error,
      );
      this.setState((prev) => ({
        hasError: false,
        authLockRecovery: prev.authLockRecovery + 1,
      }));
      captureError(error instanceof Error ? error : new Error(n.message || n.name), {
        kind: "authLockAbort",
        name: n.name,
        level: "warning",
        componentStack:
          info && typeof info === "object" && "componentStack" in info
            ? String((info as { componentStack?: unknown }).componentStack ?? "")
            : undefined,
      });
      return;
    }

    // Log BOTH raw + normalized so we can see what the app really threw.
    console.group("❌ ErrorBoundary (v2025-12-14-01)");
    console.error("RAW thrown value:", error);
    console.error("Normalized:", n);
    console.error("Component stack info:", info);
    console.groupEnd();

    // Forward to Sentry. captureError is a no-op when Sentry is disabled,
    // so this stays safe before Chau provisions a DSN. Wrap non-Error
    // throws (string, plain object) so Sentry's grouping has something
    // sensible to fingerprint on.
    const forwarded = error instanceof Error ? error : new Error(n.message || n.name);
    captureError(forwarded, {
      kind: n.kind,
      name: n.name,
      // info is { componentStack: string } — keep just the component stack
      componentStack:
        info && typeof info === "object" && "componentStack" in info
          ? String((info as { componentStack?: unknown }).componentStack ?? "")
          : undefined,
    });
  }

  render() {
    if (!this.state.hasError) return (
      <React.Fragment key={`authLock-${this.state.authLockRecovery}`}>
        {this.props.children}
      </React.Fragment>
    );

    const e = this.state.err;
    const msg = e?.message?.trim() ? e?.message : "(empty message)";
    const rawPretty = safeStringify(e?.rawDump);

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
        <div className="max-w-5xl mx-auto rounded-2xl border border-slate-700 bg-slate-900/40 p-6 space-y-4">
          <h1 className="text-3xl font-semibold">Something went wrong</h1>

          <div className="rounded-xl bg-black/30 border border-slate-700 p-4 overflow-auto space-y-2">
            <p className="text-sm text-slate-300">
              <span className="font-semibold">Kind:</span> {e?.kind}
            </p>
            <p className="text-sm text-slate-300">
              <span className="font-semibold">Name:</span> {e?.name}
            </p>
            <p className="text-sm text-slate-300">
              <span className="font-semibold">Message:</span> {msg}
            </p>

            {e?.stack ? (
              <>
                <p className="text-sm text-slate-300 mt-3 font-semibold">
                  Stack:
                </p>
                <pre className="text-xs text-slate-200 whitespace-pre-wrap">
                  {e.stack}
                </pre>
              </>
            ) : null}

            <p className="text-sm text-slate-300 mt-3 font-semibold">
              Raw thrown value (dump):
            </p>
            <pre className="text-xs text-slate-200 whitespace-pre-wrap">
              {rawPretty}
            </pre>
          </div>

          <div className="flex gap-3">
            <button
              className="px-4 py-2 rounded-lg bg-slate-200 text-slate-900"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>

            {/* Plain anchor — ErrorBoundary mounts above BrowserRouter,
                so react-router-dom's Link would crash the fallback with
                "Cannot destructure property 'basename' from null". */}
            <a
              className="px-4 py-2 rounded-lg border border-slate-500"
              href="/"
            >
              Go Home
            </a>
          </div>

          <p className="text-xs text-slate-400">
            ErrorBoundary version: v2026-05-01-01
          </p>
        </div>
      </div>
    );
  }
}
