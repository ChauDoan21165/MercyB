// src/components/ErrorBoundary.tsx — v2025-12-13-01
import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error: unknown;
  errorInfo?: React.ErrorInfo;
};

function safeStringify(x: unknown) {
  try {
    if (x instanceof Error) {
      return `${x.name}: ${x.message}\n${x.stack || ""}`;
    }
    if (typeof x === "string") return x;
    return JSON.stringify(x, null, 2);
  } catch {
    return String(x);
  }
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    // IMPORTANT: log the real error so you can see it in Vercel + browser
    // eslint-disable-next-line no-console
    console.error("❌ ErrorBoundary caught:", error);
    // eslint-disable-next-line no-console
    console.error("❌ Component stack:", errorInfo?.componentStack);

    this.setState({ error, errorInfo });
  }

  handleTryAgain = () => {
    this.setState({ hasError: false, error: null, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const errorText = safeStringify(this.state.error);
    const stack = this.state.errorInfo?.componentStack || "";

    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>

          <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
            <div className="text-sm text-slate-300 mb-2">Error:</div>
            <pre className="whitespace-pre-wrap text-sm text-slate-100">
              {errorText || "(empty error)"}
            </pre>

            {stack ? (
              <>
                <div className="text-sm text-slate-300 mt-4 mb-2">Component stack:</div>
                <pre className="whitespace-pre-wrap text-xs text-slate-200">
                  {stack}
                </pre>
              </>
            ) : null}
          </div>

          <div className="flex gap-3">
            <button
              className="px-4 py-2 rounded bg-slate-200 text-slate-900"
              onClick={this.handleTryAgain}
            >
              Try Again
            </button>
            <button
              className="px-4 py-2 rounded border border-slate-500"
              onClick={this.handleGoHome}
            >
              Go Home
            </button>
          </div>

          <p className="text-xs text-slate-400">
            ErrorBoundary version: v2025-12-13-01
          </p>
        </div>
      </div>
    );
  }
}
