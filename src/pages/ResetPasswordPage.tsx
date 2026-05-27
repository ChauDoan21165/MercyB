// src/pages/ResetPasswordPage.tsx

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useChromeLanguage, pickChrome } from "@/lib/i18n/chromeLanguage";

const DANGEROUS_PROTOCOLS = /^(data|javascript|vbscript|file|about):/i;

type StatusTone = "success" | "error" | "info";
type Status = { tone: StatusTone; message: string } | null;

function stripControlChars(value: string): string {
  if (!value) return "";
  return Array.from(value)
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code >= 32 && code !== 127;
    })
    .join("");
}

function sanitizeParam(value: string): string {
  if (!value) return "";
  const cleaned = stripControlChars(value).trim();
  if (!cleaned) return "";
  if (DANGEROUS_PROTOCOLS.test(cleaned)) return "";
  if (cleaned.startsWith("//")) return "";
  if (cleaned.includes("\\")) return "";
  if (cleaned.includes("\0")) return "";
  return cleaned;
}

function isSafeRelativePath(path: string): boolean {
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes("\\")) return false;
  if (path.includes("/../") || path.endsWith("/..") || path.includes("/./")) return false;
  return true;
}

function safeParseReturnTo(search: string): string | null {
  try {
    const sp = new URLSearchParams(search || "");
    const raw = sp.get("returnTo");
    if (!raw) return null;

    const trimmed = sanitizeParam(raw);
    if (!trimmed) return null;

    if (isSafeRelativePath(trimmed)) return trimmed;

    const u = new URL(trimmed, window.location.origin);
    if (u.origin !== window.location.origin) return null;

    const path = `${u.pathname}${u.search}${u.hash}`;
    return isSafeRelativePath(path) ? path : null;
  } catch {
    return null;
  }
}

function parseHashParams(hash: string) {
  const h = (hash || "").replace(/^#/, "").trim();
  const params = new URLSearchParams(h);
  return {
    type: params.get("type") || "",
    access_token: params.get("access_token") || "",
    refresh_token: params.get("refresh_token") || "",
    error: params.get("error") || "",
    error_description: params.get("error_description") || "",
  };
}

function clearRecoveryTokensFromUrl() {
  try {
    const u = new URL(window.location.href);
    u.searchParams.delete("code");
    u.searchParams.delete("recovery");
    u.hash = "";
    window.history.replaceState({}, document.title, u.pathname + u.search);
  } catch {
    // silent
  }
}

async function ensureSessionOrThrow() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!data?.session) throw new Error("No active session for password recovery.");
  return data.session;
}

async function fetchAdminFlagsSafe(userId: string): Promise<{ isAdmin: boolean }> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin, admin_level")
      .eq("id", userId)
      .maybeSingle();

    if (error) return { isAdmin: false };

    const profile = data as { is_admin?: boolean | null; admin_level?: number | null } | null;
    const rawAdminLevel = Number(profile?.admin_level ?? 0);
    const adminLevel = Number.isFinite(rawAdminLevel) ? rawAdminLevel : 0;

    const isAdmin = Boolean(profile?.is_admin) || adminLevel >= 1;

    return { isAdmin };
  } catch {
    return { isAdmin: false };
  }
}

function humanizeError(e: unknown) {
  const raw = String(
    e instanceof Error
      ? e.message
      : typeof e === "object" && e !== null && "message" in e
        ? (e as { message?: unknown }).message ?? ""
        : "",
  ).trim();
  if (!raw) return "Something went wrong. Please try the reset link again.";

  const msg = raw.toLowerCase();
  if (msg.includes("expired") || msg.includes("invalid") || msg.includes("otp")) {
    return "This reset link is invalid or expired. Please request a new password reset email.";
  }

  return raw;
}

const UI = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "32px 16px",
    background: "#f8f9fa",
  } as React.CSSProperties,
  card: {
    width: "100%",
    maxWidth: 460,
    background: "white",
    borderRadius: 24,
    boxShadow: "0 18px 60px rgba(0,0,0,0.08)",
    padding: 24,
  } as React.CSSProperties,
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 900,
    lineHeight: 1.1,
  } as React.CSSProperties,
  subtitle: {
    margin: "10px 0 0",
    color: "#666",
    fontSize: 15,
    lineHeight: 1.5,
  } as React.CSSProperties,
  label: {
    display: "block",
    marginBottom: 6,
    fontSize: 13,
    fontWeight: 700,
    color: "#444",
  } as React.CSSProperties,
  input: (disabled: boolean): React.CSSProperties => ({
    width: "100%",
    minHeight: 46,
    padding: "11px 14px",
    fontSize: 16,
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.14)",
    background: disabled ? "#f9f9f9" : "white",
    opacity: disabled ? 0.75 : 1,
    boxSizing: "border-box",
    outline: "none",
  }),
  primaryBtn: (disabled: boolean): React.CSSProperties => ({
    width: "100%",
    minHeight: 48,
    padding: "12px 24px",
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 14,
    border: "none",
    background: disabled ? "#a1a1aa" : "#000",
    color: "white",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.75 : 1,
  }),
  ghostBtn: (disabled: boolean): React.CSSProperties => ({
    minHeight: 44,
    padding: "10px 16px",
    fontSize: 15,
    fontWeight: 600,
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.15)",
    background: "transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.75 : 1,
  }),
  status: (tone: StatusTone): React.CSSProperties => ({
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    fontSize: 14,
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
    background:
      tone === "success"
        ? "rgba(236,253,245,0.92)"
        : tone === "error"
          ? "rgba(254,242,242,0.94)"
          : "rgba(239,246,255,0.92)",
    border:
      tone === "success"
        ? "1px solid rgba(16,185,129,0.20)"
        : tone === "error"
          ? "1px solid rgba(239,68,68,0.20)"
          : "1px solid rgba(59,130,246,0.20)",
    color:
      tone === "success"
        ? "rgba(6,95,70,0.92)"
        : tone === "error"
          ? "rgba(127,29,29,0.92)"
          : "rgba(30,64,175,0.92)",
  }),
} as const;

export default function ResetPasswordPage() {
  const nav = useNavigate();
  const lang = useChromeLanguage();

  const search = window.location.search || "";
  const hash = window.location.hash || "";

  const safeReturnPath = useMemo(() => safeParseReturnTo(search), [search]);
  const hashParams = useMemo(() => parseHashParams(hash), [hash]);

  const recoveryCode = useMemo(() => {
    try {
      return new URLSearchParams(search).get("code") || "";
    } catch {
      return "";
    }
  }, [search]);

  const recoveryType = hashParams.type;
  const accessToken = hashParams.access_token;
  const refreshToken = hashParams.refresh_token;

  const [booting, setBooting] = useState(true);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  // Stable per-instance ids for label/input pairing.
  const newPwInputId = useId();
  const confirmPwInputId = useId();

  // A51 — mirror LoginPage's A30 announcer: a single visually-hidden
  // polite live region so SR users hear "passwords don't match" /
  // success / error on this page (it had no live semantics at all).
  // Clear-then-set so an identical consecutive message is re-announced.
  const liveTimer = useRef<number | null>(null);
  const [liveMessage, setLiveMessage] = useState("");
  const announce = useCallback((raw: string) => {
    const m = raw.replace(/\s*\n\s*/g, " — ").trim();
    if (!m) return;
    if (liveTimer.current) window.clearTimeout(liveTimer.current);
    setLiveMessage("");
    liveTimer.current = window.setTimeout(() => setLiveMessage(m), 60);
  }, []);
  useEffect(
    () => () => {
      if (liveTimer.current) window.clearTimeout(liveTimer.current);
    },
    [],
  );
  useEffect(() => {
    if (status?.message) announce(status.message);
  }, [status, announce]);

  const routeAfterAuth = useCallback(async () => {
    const session = await ensureSessionOrThrow();
    const { isAdmin } = await fetchAdminFlagsSafe(session.user.id);
    const target = isAdmin ? "/admin" : safeReturnPath || "/";
    nav(target, { replace: true });
  }, [nav, safeReturnPath]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapRecovery() {
      setBooting(true);
      setStatus(null);

      try {
        if (recoveryCode) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(recoveryCode);
          if (error) throw error;
          if (!data?.session) throw new Error("Could not create a recovery session.");

          if (!cancelled) {
            setReady(true);
            setStatus({
              tone: "info",
              message: pickChrome(
                {
                  vi: "Đã sẵn sàng khôi phục. Hãy đặt mật khẩu mới bên dưới.",
                  en: "Recovery session ready. Set your new password below.",
                },
                lang,
              ),
            });
          }
          return;
        }

        if (accessToken && refreshToken && recoveryType === "recovery") {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;

          if (!cancelled) {
            setReady(true);
            setStatus({
              tone: "info",
              message: pickChrome(
                {
                  vi: "Đã sẵn sàng khôi phục. Hãy đặt mật khẩu mới bên dưới.",
                  en: "Recovery session ready. Set your new password below.",
                },
                lang,
              ),
            });
          }
          return;
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (data?.session) {
          if (!cancelled) {
            setReady(true);
            setStatus({
              tone: "info",
              message: pickChrome(
                {
                  vi: "Bạn đang có phiên đăng nhập hợp lệ. Hãy đặt mật khẩu mới bên dưới.",
                  en: "You already have a valid session. Set your new password below.",
                },
                lang,
              ),
            });
          }
          return;
        }

        throw new Error("Missing or invalid recovery link.");
      } catch (e: unknown) {
        if (!cancelled) {
          setReady(false);
          setStatus({ tone: "error", message: humanizeError(e) });
        }
      } finally {
        if (!cancelled) setBooting(false);
      }
    }

    void bootstrapRecovery();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" && session) {
        setReady(true);
        setBooting(false);
        setStatus({
          tone: "info",
          message: "Recovery session ready. Set your new password below.",
        });
      }
    });

    return () => {
      cancelled = true;
      sub?.subscription?.unsubscribe();
    };
  }, [recoveryCode, accessToken, refreshToken, recoveryType, lang]);

  const updatePassword = useCallback(async () => {
    if (busy || booting || !ready) return;

    setBusy(true);
    setStatus(null);

    try {
      const a = pw1.trim();
      const b = pw2.trim();

      if (!a || a.length < 6) {
        setStatus({
          tone: "error",
          message: pickChrome(
            { vi: "Mật khẩu phải có ít nhất 6 ký tự.", en: "Password must be at least 6 characters." },
            lang,
          ),
        });
        return;
      }

      if (a !== b) {
        setStatus({
          tone: "error",
          message: pickChrome(
            { vi: "Mật khẩu nhập lại không khớp.", en: "Passwords do not match." },
            lang,
          ),
        });
        return;
      }

      await ensureSessionOrThrow();

      const { error } = await supabase.auth.updateUser({ password: a });
      if (error) throw error;

      setStatus({
        tone: "success",
        message: pickChrome(
          { vi: "✅ Đã cập nhật mật khẩu. Đang chuyển hướng...", en: "✅ Password updated. Redirecting..." },
          lang,
        ),
      });
      await routeAfterAuth();
      clearRecoveryTokensFromUrl();
    } catch (e: unknown) {
      setStatus({ tone: "error", message: humanizeError(e) });
    } finally {
      setBusy(false);
    }
  }, [booting, busy, pw1, pw2, ready, routeAfterAuth, lang]);

  return (
    <div style={UI.page}>
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-testid="reset-live-region"
      >
        {liveMessage}
      </div>
      <main style={UI.card}>
        <h1 style={UI.title}>
          {pickChrome({ vi: "Đặt mật khẩu mới", en: "Set a new password" }, lang)}
        </h1>
        <p style={UI.subtitle}>
          {pickChrome(
            {
              vi: "Bạn vừa mở liên kết từ email đặt lại mật khẩu. Hãy chọn mật khẩu mới để hoàn tất đăng nhập.",
              en: "Opened from a password reset email. Choose a new password to finish signing in.",
            },
            lang,
          )}
        </p>

        <div style={{ marginTop: 18 }}>
          <label htmlFor={newPwInputId} style={UI.label}>
            {pickChrome({ vi: "Mật khẩu mới", en: "New password" }, lang)}
          </label>
          <div
            style={{
              position: "relative",
              width: "100%",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.14)",
              background: "white",
              overflow: "hidden",
              opacity: busy || booting || !ready ? 0.75 : 1,
            }}
          >
            <input
              id={newPwInputId}
              value={pw1}
              onChange={(e) => setPw1(e.target.value)}
              placeholder="••••••••"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              disabled={busy || booting || !ready}
              style={{
                width: "100%",
                minHeight: 46,
                padding: "11px 52px 11px 11px",
                fontSize: 16,
                border: "none",
                outline: "none",
                background: "transparent",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              disabled={busy || booting || !ready}
              aria-label={pickChrome(
                showPw
                  ? { vi: "Ẩn mật khẩu", en: "Hide password" }
                  : { vi: "Hiện mật khẩu", en: "Show password" },
                lang,
              )}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                width: 36,
                height: 36,
                border: "none",
                background: "transparent",
                cursor: busy || booting || !ready ? "not-allowed" : "pointer",
              }}
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label htmlFor={confirmPwInputId} style={UI.label}>
            {pickChrome({ vi: "Xác nhận mật khẩu", en: "Confirm password" }, lang)}
          </label>
          <input
            id={confirmPwInputId}
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            placeholder="••••••••"
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            disabled={busy || booting || !ready}
            style={UI.input(busy || booting || !ready)}
          />
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={updatePassword}
            disabled={busy || booting || !ready}
            style={{ ...UI.primaryBtn(busy || booting || !ready), flex: "1 1 240px" }}
          >
            {booting
              ? pickChrome({ vi: "Đang chuẩn bị...", en: "Preparing..." }, lang)
              : busy
                ? pickChrome({ vi: "Đang cập nhật...", en: "Updating..." }, lang)
                : pickChrome({ vi: "Cập nhật mật khẩu", en: "Update password" }, lang)}
          </button>

          <button
            type="button"
            onClick={() => nav("/signin", { replace: true })}
            disabled={busy}
            style={UI.ghostBtn(busy)}
          >
            {pickChrome({ vi: "Quay lại đăng nhập", en: "Back to sign in" }, lang)}
          </button>
        </div>

        {status && <div style={UI.status(status.tone)}>{status.message}</div>}
      </main>
    </div>
  );
}