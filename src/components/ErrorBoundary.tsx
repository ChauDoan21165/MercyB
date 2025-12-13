// src/components/ErrorBoundary.tsx — v2025-12-14-01
import React from "react";
import { Link } from "react-router-dom";

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

type Props = { children: React.ReactNode };

type State = {
  hasError: boolean;
  err?: ReturnType<typeof normalizeError>;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, err: normalizeError(error) };
  }

  componentDidCatch(error: unknown, info: unknown) {
    const n = normalizeError(error);

    // Log BOTH raw + normalized so we can see what the app really threw.
    console.group("❌ ErrorBoundary (v2025-12-14-01)");
    console.error("RAW thrown value:", error);
    console.error("Normalized:", n);
    console.error("Component stack info:", info);
    console.groupEnd();
  }

  render() {
    if (!this.state.hasError) return this.props.children;

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

            <Link
              className="px-4 py-2 rounded-lg border border-slate-500"
              to="/"
              onClick={() => this.setState({ hasError: false, err: undefined })}
            >
              Go Home
            </Link>
          </div>

          <p className="text-xs text-slate-400">
            ErrorBoundary version: v2025-12-14-01
          </p>
        </div>
      </div>
    );
  }
}
