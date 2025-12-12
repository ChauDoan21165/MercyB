import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // This is the important part — it logs the REAL error
    console.error("[ErrorBoundary] caught:", error);
    console.error("[ErrorBoundary] component stack:", errorInfo?.componentStack);
    this.setState({ error, errorInfo });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const msg = this.state.error?.message || "(no error message)";
    const stack = this.state.error?.stack || "";
    const componentStack = this.state.errorInfo?.componentStack || "";

    return (
      <div style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
        <h1 style={{ fontSize: 22, marginBottom: 8 }}>Something went wrong</h1>
        <p style={{ marginBottom: 16 }}><b>Error:</b> {msg}</p>

        <details open style={{ marginBottom: 12 }}>
          <summary><b>Stack</b></summary>
          <pre style={{ whiteSpace: "pre-wrap" }}>{stack}</pre>
        </details>

        <details>
          <summary><b>Component stack</b></summary>
          <pre style={{ whiteSpace: "pre-wrap" }}>{componentStack}</pre>
        </details>

        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <button onClick={() => window.location.reload()}>Try Again</button>
          <button onClick={() => (window.location.href = "/")}>Go Home</button>
        </div>
      </div>
    );
  }
}
