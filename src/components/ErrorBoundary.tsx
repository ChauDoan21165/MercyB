// src/components/ErrorBoundary.tsx — v2025-12-13-01
import React from "react";
import { Link } from "react-router-dom";

function normalizeError(err: unknown) {
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message || "(empty message)",
      stack: err.stack || "",
      raw: err,
    };
  }

  // handle thrown strings / objects
  try {
    return {
      name: "NonErrorThrown",
      message:
        typeof err === "string"
          ? err
          : err == null
            ? "(null/undefined thrown)"
            : JSON.stringify(err, null, 2),
      stack: "",
      raw: err,
    };
  } catch {
    return {
      name: "NonErrorThrown",
      message: String(err),
      stack: "",
      raw: err,
    };
  }
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
    const e = normalizeError(error);
    // Always log a real payload to console
    console.error("❌ ErrorBoundary caught:", e);
    console.error("❌ Component stack:", info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const e = this.state.err;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
        <div className="max-w-4xl mx-auto rounded-2xl border border-slate-700 bg-slate-900/40 p-6 space-y-4">
          <h1 className="text-3xl font-semibold">Something went wrong</h1>

          <div className="rounded-xl bg-black/30 border border-slate-700 p-4 overflow-auto">
            <p className="text-sm text-slate-300">
              <span className="font-semibold">Name:</span> {e?.name}
            </p>
            <p className="text-sm text-slate-300 mt-1">
              <span className="font-semibold">Message:</span> {e?.message}
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
            ErrorBoundary version: v2025-12-13-01
          </p>
        </div>
      </div>
    );
  }
}
