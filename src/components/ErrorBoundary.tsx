// src/components/ErrorBoundary.tsx — v2026-05-18-01
import React from "react";
import { captureError } from "@/lib/monitoring/captureException";
import { looksLikeChunkLoadFailure } from "@/lib/chunkLoadError";
import {
  cacheBustingReload,
  hasErrorBoundaryReloaded,
  markErrorBoundaryReloaded,
} from "@/lib/chunkReload";
import { unregisterAllServiceWorkers } from "@/lib/swRecovery";

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
  // True when the caught error is a stale-deploy chunk-load failure. Only
  // these get the calm "updating" screen; every other render error keeps
  // the existing dark crash screen so real bugs stay visible.
  isChunkError?: boolean;
  // True only once Tier-2 (this boundary's) escalated cache-bust reload
  // has already been spent this session and the chunk STILL failed — i.e.
  // genuinely stuck (offline, chunk truly purged, CDN broken). We then
  // show a friendly manual-retry screen instead of auto-looping.
  chunkRecoveryStuck?: boolean;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, authLockRecovery: 0 };

  static getDerivedStateFromError(error: unknown) {
    // Detect chunk-ness here (sync, pre-paint) so the calm screen renders
    // immediately with no flash of the dark crash UI. Pure string check —
    // no side effects, safe in the render phase.
    return {
      hasError: true,
      err: normalizeError(error),
      isChunkError: looksLikeChunkLoadFailure(error),
    };
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

    // Stale-deploy chunk-load failure that fell THROUGH Tier-1 recovery
    // (lazyWithRetry's cache-busting reload) and rethrew into here. This
    // is exactly the Sentry signature MERCYBLADE-WEB-F / -W / -Z:
    // handled:yes + componentStack Lazy→Suspense. Don't show the dark
    // stack dump to a learner — escalate one cache-bust reload (with SW
    // unregister, in case an old cache-first SW is still serving stale
    // HTML) and render the calm "updating" screen. Loop-protected by a
    // distinct Tier-2 one-shot so a genuinely-gone chunk terminates
    // instead of looping.
    //
    // Read isChunkError from state (set by getDerivedStateFromError on
    // the SAME error reference) instead of re-running the matcher here.
    // Issue #1127: prod Sentry breadcrumbs proved the matcher could
    // diverge between the two lifecycle methods on the React.lazy +
    // Suspense + rejected-Promise path even though both methods receive
    // the same argument per React's lifecycle contract. The exact
    // mechanism wasn't reproducible in jsdom, but persisting the result
    // eliminates the divergence by construction — same boolean, no
    // re-evaluation. looksLikeChunkLoadFailure remains the single
    // source of truth; it runs once per caught error, in
    // getDerivedStateFromError, before paint.
    if (this.state.isChunkError === true) {
      const exhausted = hasErrorBoundaryReloaded();
      const componentStack =
        info && typeof info === "object" && "componentStack" in info
          ? String((info as { componentStack?: unknown }).componentStack ?? "")
          : undefined;

      // Report BEFORE marking so the first catch is tagged "attempted"
      // (→ warning in beforeSend) and the post-cache-bust residual is
      // tagged "exhausted" (→ stays error so the real tail is visible).
      captureError(
        error instanceof Error ? error : new Error(n.message || n.name),
        {
          kind: "ChunkLoadRecovered",
          name: n.name,
          chunkRecovery: exhausted ? "exhausted" : "attempted",
          chunkRecoveryAttempts: exhausted ? "2" : "1",
          componentStack,
        },
      );

      if (!exhausted) {
        markErrorBoundaryReloaded();
        this.setState({ chunkRecoveryStuck: false });
        // Defer so the calm screen paints and the Sentry beacon flushes
        // before we navigate away. Unregister a stale SW first (mirrors
        // scheduleOneTimeChunkReload) then cache-bust to origin.
        window.setTimeout(() => {
          void unregisterAllServiceWorkers()
            .catch(() => {})
            .then(() => {
              try {
                cacheBustingReload();
              } catch {
                /* ignore */
              }
            });
        }, 600);
      } else {
        // Tier-2 already spent and it STILL failed → don't auto-loop.
        this.setState({ chunkRecoveryStuck: true });
      }
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

  // Calm, Vietnamese-first stale-deploy screen. Router-free (this
  // boundary mounts ABOVE BrowserRouter) and light-themed so it reads as
  // "we're updating", not "the app crashed". Mobile-first at 375px.
  renderChunkRecoveryScreen() {
    const stuck = this.state.chunkRecoveryStuck === true;
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-sm p-6 text-center space-y-4">
          <h1 className="text-2xl font-extrabold">
            {stuck ? "Chưa cập nhật được" : "Đang cập nhật Mercy Blade"}
          </h1>
          <p className="text-slate-600 leading-relaxed">
            {stuck
              ? "Có vẻ mạng đang chập chờn. Kiểm tra kết nối rồi nhấn Tải lại để dùng phiên bản mới nhất."
              : "Mercy Blade vừa có bản mới. Trình duyệt đang giữ bản cũ — trang sẽ tự làm mới trong giây lát."}
          </p>
          <button
            type="button"
            className="w-full min-h-[46px] rounded-xl bg-slate-900 text-white font-bold px-4 py-3"
            onClick={() => cacheBustingReload()}
          >
            Tải lại
          </button>
        </div>
      </div>
    );
  }

  render() {
    if (!this.state.hasError) return (
      <React.Fragment key={`authLock-${this.state.authLockRecovery}`}>
        {this.props.children}
      </React.Fragment>
    );

    // Stale-deploy chunk failure → calm updating screen. Every OTHER
    // render error falls through to the dark crash screen below so real
    // bugs stay loud and visible.
    if (this.state.isChunkError) return this.renderChunkRecoveryScreen();

    const e = this.state.err;
    const msg = e?.message?.trim() ? e?.message : "(empty message)";
    const rawPretty = safeStringify(e?.rawDump);

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
        <div className="max-w-5xl mx-auto rounded-2xl border border-slate-700 bg-slate-900/40 p-6 space-y-4">
          <h1 className="text-3xl font-semibold">Đã xảy ra lỗi</h1>

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
              Thử lại
            </button>

            {/* Plain anchor — ErrorBoundary mounts above BrowserRouter,
                so react-router-dom's Link would crash the fallback with
                "Cannot destructure property 'basename' from null". */}
            <a
              className="px-4 py-2 rounded-lg border border-slate-500"
              href="/"
            >
              Về trang chủ
            </a>
          </div>

          <p className="text-xs text-slate-500">
            ErrorBoundary version: v2026-05-01-01
          </p>
        </div>
      </div>
    );
  }
}
