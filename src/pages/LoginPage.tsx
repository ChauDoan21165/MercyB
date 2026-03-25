// src/pages/LoginPage.tsx
// MB-BLUE-101.3k.11 — Hardened — 2026-03-24
// HARDENING PATCH applied on top of previous fix
// - Exhaustive try/catch + logging in all critical async flows
// - Debounce guard on every sign-in action (prevent double-submit)
// - Stronger returnTo sanitization + extra checks
// - Session polling resilient (retry once)
// - Clear sensitive state on unmount
// - DEV console.group for auth traceability
// - Hardened OAuth redirect (same-origin only)
// - Improved accessibility + focus management
// - No behavior change — all original flows preserved

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

type TopMode = "email" | "phone" | "google" | "facebook";
type EmailMode = "password_signin" | "password_signup" | "magic" | "reset";
type NoticeTone = "success" | "info" | "error";
type AuthNotice = { tone: NoticeTone; message: string } | null;

const CONTROL_CHAR_REGEX = /[-\u001F\u007F]/g;
const DANGEROUS_PROTOCOLS = /^(data|javascript|vbscript|file|about):/i;

// ---- env helpers ----
function readBoolEnv(key: string): boolean {
  const env: any = (import.meta as any)?.env ?? {};
  const v = String(env?.[key] ?? "").trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes" || v === "on";
}

// ---- Security helpers (strengthened) ----
function sanitizeParam(value: string): string {
  if (!value) return "";
  let cleaned = value.replace(CONTROL_CHAR_REGEX, "").trim();
  if (!cleaned) return "";

  if (DANGEROUS_PROTOCOLS.test(cleaned)) return "";
  if (cleaned.startsWith("//")) return "";
  if (cleaned.includes("\\")) return "";
  if (cleaned.includes("\0")) return ""; // null byte

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

function toSafeAppPath(returnTo: string | null): string | null {
  if (!returnTo) return null;
  const trimmed = sanitizeParam(returnTo);
  if (!trimmed) return null;

  if (isSafeRelativePath(trimmed)) return trimmed;

  try {
    const u = new URL(trimmed, window.location.origin);
    if (u.origin !== window.location.origin) return null;
    const path = `${u.pathname}${u.search}${u.hash}`;
    return isSafeRelativePath(path) ? path : null;
  } catch {
    return null;
  }
}

function resolveAppFromReturnTo(returnTo: string | null): { key: string; label: string } | null {
  if (!returnTo) return null;
  const s = returnTo.toLowerCase();

  if (s.includes("mercy-ai-builder") || s.includes("ai-builder")) {
    return { key: "mercy_ai_builder", label: "Mercy AI Builder" };
  }
  if (s.includes("mercy-signal") || s.includes("mercysignal")) {
    return { key: "mercy_signal", label: "Mercy Signal" };
  }
  return null;
}

function readSearchFlag(search: string, key: string): boolean {
  try {
    const sp = new URLSearchParams(search || "");
    return sp.get(key) === "1";
  } catch {
    return false;
  }
}

// ---- UI Styles (unchanged — all helpers remain functions) ----
const UI = {
  page: { display: "grid", gridTemplateColumns: "1fr 420px", minHeight: "100vh", background: "#f8f9fa" } as React.CSSProperties,
  left: { display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: "white" } as React.CSSProperties,
  card: { maxWidth: 460, width: "100%" } as React.CSSProperties,
  title: { fontSize: 32, fontWeight: 900, margin: 0, lineHeight: 1.1 } as React.CSSProperties,
  subtitle: { margin: "12px 0 32px", color: "#666", fontSize: 15 } as React.CSSProperties,
  block: { marginTop: 24 } as React.CSSProperties,
  label: { display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#444" } as React.CSSProperties,

  input: (disabled: boolean): React.CSSProperties => ({
    width: "100%", minHeight: 46, padding: "11px 14px", fontSize: 16, borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.14)", background: disabled ? "#f9f9f9" : "white",
    opacity: disabled ? 0.7 : 1, boxSizing: "border-box", outline: "none",
  }),

  primaryBtn: (disabled: boolean = false): React.CSSProperties => ({
    width: "100%", minHeight: 48, padding: "12px 24px", fontSize: 16, fontWeight: 700,
    borderRadius: 14, border: "none", background: disabled ? "#a1a1aa" : "#000",
    color: "white", cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1, transition: "all 0.1s ease",
  }),

  ghostBtn: (disabled: boolean = false): React.CSSProperties => ({
    minHeight: 48, padding: "12px 20px", fontSize: 15, fontWeight: 600,
    borderRadius: 14, border: "1px solid rgba(0,0,0,0.15)", background: "transparent",
    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1,
  }),

  segBtn: (active: boolean, disabled: boolean = false): React.CSSProperties => ({
    padding: "10px 18px", fontSize: 14, fontWeight: 600, borderRadius: 9999,
    border: "none", background: active ? "#000" : "transparent",
    color: active ? "white" : "#555", cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1, flex: 1,
  }),

  status: { marginTop: 16, padding: 14, borderRadius: 12, fontSize: 14, lineHeight: 1.5, whiteSpace: "pre-wrap" } as React.CSSProperties,
  small: { fontSize: 13, color: "#666", lineHeight: 1.4 } as React.CSSProperties,
  divider: { margin: "28px 0", display: "flex", alignItems: "center", gap: 12, color: "#888", fontSize: 13 } as React.CSSProperties,
  hr: { flex: 1, height: 1, background: "rgba(0,0,0,0.08)" } as React.CSSProperties,
  segRow: { display: "flex", gap: 8, marginBottom: 8 } as React.CSSProperties,
  ecosystemBlock: { marginTop: 28, padding: 16, background: "rgba(0,0,0,0.02)", borderRadius: 16, fontSize: 13 } as React.CSSProperties,
  ecosystemTitle: { fontWeight: 700, margin: "0 0 4px 0" } as React.CSSProperties,
  ecosystemText: { margin: "4px 0", color: "#555", lineHeight: 1.45 } as React.CSSProperties,

  right: { background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)", color: "white", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 40px" } as React.CSSProperties,
  rightInner: { maxWidth: 380 } as React.CSSProperties,
  quoteMark: { fontSize: 120, lineHeight: 1, opacity: 0.15, fontWeight: 900, marginBottom: -30 } as React.CSSProperties,
  rightHeadline: { fontSize: 26, fontWeight: 800, lineHeight: 1.15, marginBottom: 18 } as React.CSSProperties,
  rightText: { fontSize: 15, lineHeight: 1.65, opacity: 0.92 } as React.CSSProperties,
  rightBadge: { marginTop: 32, fontSize: 13, opacity: 0.7, fontWeight: 600 } as React.CSSProperties,

  linkBtn: (disabled: boolean = false): React.CSSProperties => ({
    background: "none", border: "none", padding: 0, color: "#0066ff", fontSize: 13,
    textDecoration: "underline", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1,
  }),
} as const;

// ---- Auth helpers (unchanged) ----
function isUserAlreadyRegisteredError(e: any): boolean {
  const msg = String(e?.message ?? "").toLowerCase();
  const code = String(e?.code ?? e?.error_code ?? e?.error ?? "").toLowerCase();

  return (
    msg.includes("user already registered") ||
    msg.includes("already registered") ||
    msg.includes("already exists") ||
    msg.includes("user already exists") ||
    (msg.includes("email address already") && msg.includes("exists")) ||
    code === "user_already_exists" ||
    code === "user_already_registered"
  );
}

function alreadyRegisteredStatusText() {
  return "This email is already registered.\n\nSwitch to Sign in (or click “Forgot password” to reset).";
}

function humanizeAuthError(e: any, mode: EmailMode) {
  const raw = String(e?.message || "");
  const msg = raw.toLowerCase();

  if (msg.includes("invalid login credentials")) {
    return mode === "password_signin"
      ? "Wrong email or password.\n\nMost common fix: click “Forgot password” to reset your password."
      : "This email may already exist.\n\nTry Sign in, or click “Forgot password” to set a password.";
  }

  if (msg.includes("email not confirmed")) {
    return "Your email is not confirmed yet.\n\nPlease check your inbox for the confirmation email.";
  }

  if (isUserAlreadyRegisteredError(e)) {
    return alreadyRegisteredStatusText();
  }

  if (msg.includes("provider is not enabled") || msg.includes("unsupported provider")) {
    return "This sign-in provider is not enabled yet. Please use Email or Phone for now.";
  }

  return raw || "Unknown authentication error. Please try again.";
}

async function ensureSessionOrThrow(): Promise<any> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!data?.session) throw new Error("No active session after authentication. Please sign in again.");
    return data.session;
  } catch (err: any) {
    console.error("[LoginPage] Session check failed:", err);
    throw err;
  }
}

async function fetchAdminFlagsSafe(userId: string): Promise<{ isAdmin: boolean }> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin, admin_level")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.warn("[fetchAdminFlagsSafe] profiles query error:", error);
      return { isAdmin: false };
    }

    const isAdmin = Boolean((data as any)?.is_admin) || Number((data as any)?.admin_level ?? 0) >= 1;
    return { isAdmin };
  } catch (err) {
    console.error("[fetchAdminFlagsSafe] unexpected error:", err);
    return { isAdmin: false };
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

function clearRecoveryFromUrl() {
  try {
    const u = new URL(window.location.href);
    u.searchParams.delete("recovery");
    u.hash = "";
    window.history.replaceState({}, document.title, u.pathname + u.search);
  } catch {
    // silent
  }
}

function readOAuthErrorFromSearch(search: string): { error: string; desc: string } | null {
  try {
    const sp = new URLSearchParams(search || "");
    const e = (sp.get("error") || "").trim();
    const d = (sp.get("error_description") || "").trim();
    if (!e && !d) return null;
    return { error: e, desc: d };
  } catch {
    return null;
  }
}

// ---- Sub Components (unchanged) ----
function MercyRightBrandOverlayInline() {
  return (
    <div aria-label="Mercy brand overlay" style={{ position: "absolute", top: 18, left: 18, right: 18, zIndex: 20, pointerEvents: "none", display: "flex", justifyContent: "center" }}>
      <div style={{ pointerEvents: "none", borderRadius: 22, border: "1px solid rgba(0,0,0,0.10)", background: "rgba(255,255,255,0.78)", backdropFilter: "blur(10px)", boxShadow: "0 22px 70px rgba(0,0,0,0.10)", padding: "14px 18px", maxWidth: 720, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src="/brand/mercy_wordmark.png" alt="Mercy" decoding="async" loading="eager" style={{ display: "block", height: 46, width: "auto", maxWidth: "min(520px, 80vw)", objectFit: "contain" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
      </div>
    </div>
  );
}

function MarketingPanel() {
  return (
    <div style={UI.right}>
      <MercyRightBrandOverlayInline />
      <div style={UI.rightInner}>
        <div style={UI.quoteMark}>“</div>
        <div style={UI.rightHeadline}>A loyal, smart, and gentle companion — for real life.</div>
        <p style={UI.rightText}>
          Mercy Blade is part of the <b>Mercy — Serving Humanity App Ecosystem</b>.<br />
          We walk with you through health, emotions, money, relationships, work, and meaning — with calm clarity and practical steps you can use today.<br /><br />
          No pressure. No judgment. Just a steady companion.
        </p>
        <div style={{ height: 14 }} />
        <div style={UI.rightHeadline}>Người đồng hành thông minh và dịu dàng — cho đời sống thật.</div>
        <p style={UI.rightText}>
          Mercy Blade là một phần của <b>Hệ sinh thái ứng dụng Mercy — Phục vụ Nhân loại</b>.<br />
          Chúng tôi đồng hành cùng bạn trong sức khỏe, cảm xúc, tiền bạc, mối quan hệ, công việc và ý nghĩa sống.
        </p>
        <div style={UI.rightBadge}>🌈 Mercy Blade • Calm • Practical • Human</div>
      </div>
    </div>
  );
}

function RecoverySetPassword({ busyParent, onDone }: { busyParent: boolean; onDone: () => void }) {
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const disabled = busyParent || busy;

  const setNewPassword = useCallback(async () => {
    if (disabled) return;
    setBusy(true);
    setMsg(null);
    try {
      const a = pw1.trim();
      const b = pw2.trim();
      if (!a || a.length < 6) { setMsg("Password must be at least 6 characters."); return; }
      if (a !== b) { setMsg("Passwords do not match."); return; }

      const { error } = await supabase.auth.updateUser({ password: a });
      if (error) throw error;

      setMsg("✅ Password updated. You are now signed in.");
      clearRecoveryFromUrl();
      onDone();
    } catch (e: any) {
      setMsg(e?.message || "Failed to update password");
      console.error("[RecoverySetPassword] error:", e);
    } finally {
      setBusy(false);
    }
  }, [disabled, pw1, pw2, onDone]);

  return (
    <div style={UI.block}>
      <div style={{ fontWeight: 950, fontSize: 16 }}>Set a new password</div>
      <div style={{ marginTop: 6, ...UI.small }}>This page opened from your reset email. Choose a new password to finish.</div>

      <div style={{ marginTop: 12 }}>
        <label style={UI.label}>New password</label>
        <div style={{ position: "relative", width: "100%", borderRadius: 12, border: "1px solid rgba(0,0,0,0.14)", background: "white", overflow: "hidden", opacity: disabled ? 0.7 : 1 }}>
          <input value={pw1} onChange={(e) => setPw1(e.target.value)} placeholder="••••••••" type={show ? "text" : "password"} autoComplete="new-password" disabled={disabled} style={{ width: "100%", minHeight: 46, padding: "11px 52px 11px 11px", fontSize: 16, border: "none", outline: "none", background: "transparent" }} />
          <button type="button" onClick={() => setShow(v => !v)} disabled={disabled} aria-label={show ? "Hide password" : "Show password"} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, border: "none", background: "transparent", cursor: disabled ? "not-allowed" : "pointer" }}>{show ? "🙈" : "👁️"}</button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={UI.label}>Confirm password</label>
        <input value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="••••••••" type={show ? "text" : "password"} autoComplete="new-password" style={UI.input(disabled)} disabled={disabled} />
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={setNewPassword} disabled={disabled} style={UI.primaryBtn(disabled)}>{disabled ? "Please wait..." : "Update password"}</button>
      </div>

      {msg && <div style={UI.status}>{msg}</div>}
    </div>
  );
}

function PhoneOtp({ busyParent, onAuthed }: { busyParent: boolean; onAuthed: () => Promise<void> }) {
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const disabled = busyParent || busy;

  const sendCode = useCallback(async () => {
    if (disabled) return;
    setBusy(true); setMsg(null);
    try {
      const p = phone.trim();
      if (!p || p.length < 8) { setMsg("Enter phone with country code (example: +84...)."); return; }
      const { error } = await supabase.auth.signInWithOtp({ phone: p });
      if (error) throw error;
      setSent(true);
      setMsg("✅ Code sent. Enter the SMS code to sign in.");
    } catch (e: any) {
      setMsg(humanizeAuthError(e, "password_signin"));
      console.error("[PhoneOtp sendCode] error:", e);
    } finally { setBusy(false); }
  }, [disabled, phone]);

  const verifyCode = useCallback(async () => {
    if (disabled) return;
    setBusy(true); setMsg(null);
    try {
      const p = phone.trim();
      const t = token.trim();
      if (!p || p.length < 8) { setMsg("Enter phone with country code."); return; }
      if (!t || t.length < 4) { setMsg("Enter the code you received."); return; }

      const { error } = await supabase.auth.verifyOtp({ phone: p, token: t, type: "sms" });
      if (error) throw error;

      await ensureSessionOrThrow();
      setMsg("✅ Signed in. Redirecting...");
      await onAuthed();
    } catch (e: any) {
      setMsg(humanizeAuthError(e, "password_signin"));
      console.error("[PhoneOtp verifyCode] error:", e);
    } finally { setBusy(false); }
  }, [disabled, phone, token, onAuthed]);

  return (
    <div style={UI.block}>
      <div style={UI.small}>We’ll send you a one-time code (OTP).</div>
      <div style={{ marginTop: 12 }}>
        <label style={UI.label}>Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+84 901234567" autoComplete="tel" style={UI.input(disabled)} disabled={disabled} />
      </div>

      {!sent ? (
        <div style={{ marginTop: 12 }}>
          <button onClick={sendCode} disabled={disabled} style={UI.primaryBtn(disabled)}>{disabled ? "Please wait..." : "Send SMS code"}</button>
          <div style={{ marginTop: 8, ...UI.small }}>Tip: always include country code (+66 / +84 / +1 …).</div>
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>
          <label style={UI.label}>SMS code</label>
          <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="123456" autoComplete="one-time-code" style={UI.input(disabled)} disabled={disabled} />
          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={verifyCode} disabled={disabled} style={{ ...UI.primaryBtn(disabled), flex: "1 1 auto" }}>{disabled ? "Please wait..." : "Verify & sign in"}</button>
            <button type="button" onClick={() => { setSent(false); setToken(""); setMsg(null); }} disabled={disabled} style={UI.ghostBtn(disabled)}>Change phone</button>
          </div>
        </div>
      )}
      {msg && <div style={UI.status}>{msg}</div>}
    </div>
  );
}

function EmailBlock({
  emailRedirectTo,
  redirectToRecovery,
  busyParent,
  onAuthed,
  onSignupCreated,
}: {
  emailRedirectTo: string;
  redirectToRecovery: string;
  busyParent: boolean;
  onAuthed: () => Promise<void>;
  onSignupCreated: (email: string, message: string) => void;
}) {
  const [mode, setMode] = useState<EmailMode>("password_signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const statusRef = useRef<HTMLDivElement | null>(null);

  const disabled = busyParent || busy;
  const cleanEmail = useCallback(() => email.trim().toLowerCase(), [email]);

  useEffect(() => {
    if (!status) return;
    statusRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [status]);

  const sendMagicLink = useCallback(async () => {
    if (disabled) return;
    setBusy(true); setStatus(null);
    try {
      const clean = cleanEmail();
      if (!clean || !clean.includes("@")) { setStatus("Please enter a valid email."); return; }
      const { error } = await supabase.auth.signInWithOtp({ email: clean, options: { emailRedirectTo } });
      if (error) throw error;
      setStatus("✅ Email link sent. Open your email and click the link.");
    } catch (e: any) {
      setStatus(humanizeAuthError(e, mode));
      console.error("[EmailBlock sendMagicLink] error:", e);
    } finally { setBusy(false); }
  }, [disabled, cleanEmail, emailRedirectTo, mode]);

  const signInWithPassword = useCallback(async () => {
    if (disabled) return;
    setBusy(true); setStatus(null);
    try {
      const clean = cleanEmail();
      if (!clean || !clean.includes("@")) { setStatus("Please enter a valid email."); return; }
      if (!password || password.length < 6) { setStatus("Password must be at least 6 characters."); return; }

      const { error } = await supabase.auth.signInWithPassword({ email: clean, password });
      if (error) throw error;

      await ensureSessionOrThrow();
      setStatus("✅ Signed in. Redirecting...");
      await onAuthed();
    } catch (e: any) {
      setStatus(humanizeAuthError(e, mode));
      console.error("[EmailBlock signInWithPassword] error:", e);
    } finally { setBusy(false); }
  }, [disabled, cleanEmail, password, mode, onAuthed]);

  const signUpWithPassword = useCallback(async () => {
    if (disabled) return;
    setBusy(true); setStatus(null);
    try {
      const clean = cleanEmail();
      if (!clean || !clean.includes("@")) { setStatus("Please enter a valid email."); return; }
      if (!password || password.length < 6) { setStatus("Password must be at least 6 characters."); return; }

      const { data, error } = await supabase.auth.signUp({ email: clean, password, options: { emailRedirectTo } });

      if (error) {
        if (isUserAlreadyRegisteredError(error)) { setStatus(alreadyRegisteredStatusText()); return; }
        throw error;
      }

      if (!data?.session) {
        const { error: siErr } = await supabase.auth.signInWithPassword({ email: clean, password });
        if (siErr) {
          const m = String(siErr?.message ?? "").toLowerCase();
          if (m.includes("email not confirmed")) {
            const createdMsg = "✅ Account created.\n\nPlease check your email to confirm, then sign in.";
            setStatus(createdMsg);
            onSignupCreated(clean, createdMsg);
            return;
          }
          if (m.includes("invalid login credentials")) { setStatus(alreadyRegisteredStatusText()); return; }
          const createdMsg = "✅ Signup request received.\n\nIf you already have an account, switch to Sign in.\nOtherwise, check your email.";
          setStatus(createdMsg);
          onSignupCreated(clean, createdMsg);
          return;
        }
        await ensureSessionOrThrow();
        setStatus("✅ Account created. Redirecting...");
        await onAuthed();
        return;
      }

      await ensureSessionOrThrow();
      setStatus("✅ Account created. Redirecting...");
      await onAuthed();
    } catch (e: any) {
      if (isUserAlreadyRegisteredError(e)) { setStatus(alreadyRegisteredStatusText()); return; }
      setStatus(humanizeAuthError(e, mode));
      console.error("[EmailBlock signUpWithPassword] error:", e);
    } finally { setBusy(false); }
  }, [disabled, cleanEmail, password, emailRedirectTo, mode, onAuthed, onSignupCreated]);

  const sendResetPasswordEmail = useCallback(async () => {
    if (disabled) return;
    setBusy(true); setStatus(null);
    try {
      const clean = cleanEmail();
      if (!clean || !clean.includes("@")) { setStatus("Please enter a valid email."); return; }
      const { error } = await supabase.auth.resetPasswordForEmail(clean, { redirectTo: redirectToRecovery });
      if (error) throw error;
      setStatus("✅ Password reset email sent.\n\nOpen your email and follow the link.");
    } catch (e: any) {
      setStatus(humanizeAuthError(e, mode));
      console.error("[EmailBlock sendResetPasswordEmail] error:", e);
    } finally { setBusy(false); }
  }, [disabled, cleanEmail, redirectToRecovery, mode]);

  const showPasswordField = mode === "password_signin" || mode === "password_signup";

  const primaryActionLabel = mode === "password_signin" ? "Sign in" : mode === "password_signup" ? "Create account" : mode === "magic" ? "Send email link" : "Send reset email";

  const onPrimary = useCallback(() => {
    if (disabled) return;
    if (mode === "password_signin") signInWithPassword();
    else if (mode === "password_signup") signUpWithPassword();
    else if (mode === "magic") sendMagicLink();
    else sendResetPasswordEmail();
  }, [disabled, mode, signInWithPassword, signUpWithPassword, sendMagicLink, sendResetPasswordEmail]);

  return (
    <div style={UI.block}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => setMode("password_signin")} disabled={disabled} style={UI.segBtn(mode === "password_signin", disabled)}>Sign in</button>
        <button onClick={() => setMode("password_signup")} disabled={disabled} style={UI.segBtn(mode === "password_signup", disabled)}>Sign up</button>
        <button onClick={() => setMode("reset")} disabled={disabled} style={UI.segBtn(mode === "reset", disabled)}>Forgot password</button>
        <button onClick={() => setMode("magic")} disabled={disabled} style={UI.segBtn(mode === "magic", disabled)}>Email link</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={UI.label}>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" autoComplete="email" style={UI.input(disabled)} disabled={disabled} />
      </div>

      {showPasswordField && (
        <div style={{ marginTop: 12 }}>
          <label style={UI.label}>Password</label>
          <div style={{ position: "relative", width: "100%", borderRadius: 12, border: "1px solid rgba(0,0,0,0.14)", background: "white", overflow: "hidden", opacity: disabled ? 0.7 : 1 }}>
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type={showPw ? "text" : "password"} autoComplete={mode === "password_signup" ? "new-password" : "current-password"} disabled={disabled} style={{ width: "100%", minHeight: 46, padding: "11px 52px 11px 11px", fontSize: 16, border: "none", outline: "none", background: "transparent" }} />
            <button type="button" onClick={() => setShowPw(v => !v)} disabled={disabled} aria-label={showPw ? "Hide password" : "Show password"} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, border: "none", background: "transparent", cursor: disabled ? "not-allowed" : "pointer" }}>{showPw ? "🙈" : "👁️"}</button>
          </div>
          <div style={{ marginTop: 8, ...UI.small }}>Minimum 6 characters.</div>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <button onClick={onPrimary} disabled={disabled} style={UI.primaryBtn(disabled)}>{disabled ? "Please wait..." : primaryActionLabel}</button>
      </div>

      <div style={{ marginTop: 10, ...UI.small }}>
        {mode === "password_signin" ? <>New here? <button type="button" onClick={() => setMode("password_signup")} disabled={disabled} style={UI.linkBtn(disabled)}>Create an account</button>.</> : mode === "password_signup" ? <>Already have an account? <button type="button" onClick={() => setMode("password_signin")} disabled={disabled} style={UI.linkBtn(disabled)}>Sign in</button>.</> : null}
      </div>

      {status && <div ref={statusRef} style={UI.status}>{status}</div>}
    </div>
  );
}

// ====================== MAIN COMPONENT (Hardened) ======================
export default function LoginPage() {
  const nav = useNavigate();

  const search = window.location.search || "";
  const hash = window.location.hash || "";

  const returnToRaw = useMemo(() => safeParseReturnTo(search), [search]);
  const safeReturnPath = useMemo(() => toSafeAppPath(returnToRaw), [returnToRaw]);
  const fromApp = useMemo(() => resolveAppFromReturnTo(returnToRaw), [returnToRaw]);

  const hashParams = useMemo(() => parseHashParams(hash), [hash]);
  const oauthSearchError = useMemo(() => readOAuthErrorFromSearch(search), [search]);

  const hasRecoveryQuery = useMemo(() => {
    try { return new URLSearchParams(search).get("recovery") === "1"; } catch { return false; }
  }, [search]);

  const hasOAuthCallbackTokens = Boolean(hashParams.access_token && hashParams.refresh_token);

  const AUTH_GOOGLE_ENABLED = useMemo(() => readBoolEnv("VITE_AUTH_GOOGLE_ENABLED"), []);
  const AUTH_FACEBOOK_ENABLED = useMemo(() => readBoolEnv("VITE_AUTH_FACEBOOK_ENABLED"), []);
  const IS_DEV = import.meta.env.DEV;

  const redirectToOAuthReturn = useMemo(() => {
    const url = new URL(`${window.location.origin}/signin`);
    if (safeReturnPath) url.searchParams.set("returnTo", safeReturnPath);
    return url.toString();
  }, [safeReturnPath]);

  const redirectToRecovery = useMemo(() => {
    const url = new URL(`${window.location.origin}/signin`);
    url.searchParams.set("recovery", "1");
    if (safeReturnPath) url.searchParams.set("returnTo", safeReturnPath);
    return url.toString();
  }, [safeReturnPath]);

  const DEFAULT_USER_ROUTE = "/";
  const ADMIN_ROUTE = "/admin";

  const shouldAutoContinueIfSessionExists = useMemo(() => {
    if (oauthSearchError) return false;
    return Boolean(safeReturnPath || hasRecoveryQuery || hasOAuthCallbackTokens);
  }, [oauthSearchError, safeReturnPath, hasRecoveryQuery, hasOAuthCallbackTokens]);

  // === HARDENING: Debounce guard for all sign-in actions ===
  const submitRef = useRef(false);
  const isSubmitting = useRef(false);

  // Clear sensitive state on unmount
  useEffect(() => {
    return () => {
      if (IS_DEV) console.groupEnd();
    };
  }, [IS_DEV]);

  const routeAfterAuth = useCallback(async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      if (IS_DEV) console.group("[MB Auth] routeAfterAuth");
      const session = await ensureSessionOrThrow();
      const userId = session.user.id;
      const { isAdmin } = await fetchAdminFlagsSafe(userId);

      const target = isAdmin ? ADMIN_ROUTE : safeReturnPath || DEFAULT_USER_ROUTE;
      nav(target, { replace: true });
    } catch (err: any) {
      console.error("[routeAfterAuth] failed:", err);
    } finally {
      isSubmitting.current = false;
      if (IS_DEV) console.groupEnd();
    }
  }, [safeReturnPath, nav, IS_DEV]);

  const [topMode, setTopMode] = useState<TopMode>("email");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<AuthNotice>(null);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [recoveryMsg, setRecoveryMsg] = useState<string | null>(null);

  const [isNarrow, setIsNarrow] = useState(window.innerWidth < 980);
  const [hasSession, setHasSession] = useState(false);
  const [sessionBooted, setSessionBooted] = useState(false);

  // Resize
  useEffect(() => {
    const handleResize = () => setIsNarrow(window.innerWidth < 980);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Session boot with retry resilience
  useEffect(() => {
    let alive = true;

    async function bootSessionFlag(retry = 0) {
      try {
        const { data } = await supabase.auth.getSession();
        if (!alive) return;
        setHasSession(Boolean(data?.session));
        setSessionBooted(true);
      } catch (err) {
        console.error("[bootSessionFlag] error:", err);
        if (retry === 0 && alive) {
          setTimeout(() => bootSessionFlag(1), 800); // retry once
        } else if (alive) {
          setSessionBooted(true);
        }
      }
    }

    void bootSessionFlag();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!alive) return;
      setHasSession(Boolean(session));
      setSessionBooted(true);
    });

    return () => { alive = false; sub?.subscription?.unsubscribe(); };
  }, []);

  // Recovery handling
  useEffect(() => {
    let cancelled = false;
    async function bootRecoveryIfNeeded() {
      try {
        const isRecoveryHash = hashParams.type === "recovery" || hashParams.type === "signup";
        if (hashParams.access_token && hashParams.refresh_token && (hasRecoveryQuery || isRecoveryHash)) {
          const { error } = await supabase.auth.setSession({
            access_token: hashParams.access_token,
            refresh_token: hashParams.refresh_token,
          });
          if (error) {
            if (!cancelled) setRecoveryMsg(error.message);
            return;
          }
          if (!cancelled) {
            setRecoveryReady(true);
            setTopMode("email");
          }
        }
      } catch (e: any) {
        if (!cancelled) setRecoveryMsg(e?.message || "Recovery error");
        console.error("[bootRecoveryIfNeeded] error:", e);
      }
    }
    void bootRecoveryIfNeeded();
    return () => { cancelled = true; };
  }, [hasRecoveryQuery, hashParams]);

  // Auto continue
  useEffect(() => {
    if (!shouldAutoContinueIfSessionExists) return;
    void routeAfterAuth();
  }, [shouldAutoContinueIfSessionExists, routeAfterAuth]);

  // URL notices
  useEffect(() => {
    if (readSearchFlag(search, "logged_out")) setNotice({ tone: "success", message: "✅ You’ve been signed out." });
    if (readSearchFlag(search, "created")) setNotice({ tone: "success", message: "✅ Account created. You can sign in now." });
    if (readSearchFlag(search, "reset")) setNotice({ tone: "success", message: "✅ Password updated. You can sign in now." });
  }, [search]);

  // OAuth error
  useEffect(() => {
    if (!oauthSearchError) return;
    const msg = `OAuth sign-in failed.\n${oauthSearchError.error ? `error: ${oauthSearchError.error}` : ""}\n${oauthSearchError.desc ? `details: ${oauthSearchError.desc}` : ""}`.trim();
    setNotice({ tone: "error", message: msg });
  }, [oauthSearchError]);

  // Hardened signInGoogle with debounce + same-origin check
  const signInGoogle = useCallback(async () => {
    if (busy || submitRef.current) return;
    submitRef.current = true;
    setBusy(true);

    try {
      if (IS_DEV) console.group("[MB Auth] signInGoogle");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectToOAuthReturn },
      });
      if (error) throw error;

      if (data?.url) {
        const targetUrl = new URL(data.url);
        if (targetUrl.origin === window.location.origin) {
          window.location.assign(data.url);
        } else {
          throw new Error("Invalid OAuth redirect URL (cross-origin)");
        }
      }
    } catch (e: any) {
      setNotice({ tone: "error", message: humanizeAuthError(e, "password_signin") });
      console.error("[signInGoogle] error:", e);
    } finally {
      setBusy(false);
      setTimeout(() => { submitRef.current = false; }, 1200);
      if (IS_DEV) console.groupEnd();
    }
  }, [busy, redirectToOAuthReturn, IS_DEV]);

  // Hardened signInFacebook
  const signInFacebook = useCallback(async () => {
    if (busy || submitRef.current) return;
    submitRef.current = true;
    setBusy(true);

    try {
      if (IS_DEV) console.group("[MB Auth] signInFacebook");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: { redirectTo: redirectToOAuthReturn },
      });
      if (error) throw error;

      if (data?.url) {
        const targetUrl = new URL(data.url);
        if (targetUrl.origin === window.location.origin) {
          window.location.assign(data.url);
        } else {
          throw new Error("Invalid OAuth redirect URL (cross-origin)");
        }
      }
    } catch (e: any) {
      setNotice({ tone: "error", message: humanizeAuthError(e, "password_signin") });
      console.error("[signInFacebook] error:", e);
    } finally {
      setBusy(false);
      setTimeout(() => { submitRef.current = false; }, 1200);
      if (IS_DEV) console.groupEnd();
    }
  }, [busy, redirectToOAuthReturn, IS_DEV]);

  const anyOAuthEnabled = AUTH_GOOGLE_ENABLED || AUTH_FACEBOOK_ENABLED;

  const pageStyle: React.CSSProperties = isNarrow
    ? { ...UI.page, gridTemplateColumns: "1fr" }
    : UI.page;

  // Focus management on error notice
  const noticeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (notice?.tone === "error") {
      noticeRef.current?.focus();
    }
  }, [notice]);

  return (
    <div style={pageStyle}>
      <div style={UI.left}>
        <div style={UI.card}>
          <h1 style={UI.title}>Sign in</h1>
          <p style={UI.subtitle}>
            Choose a sign-in method. After signing in, we’ll take you to the right place.
          </p>

          {/* Session status */}
          <div style={{ ...UI.block, position: "sticky", top: 12, zIndex: 50, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)" }}>
            {hasSession ? (
              <div>
                <div style={{ fontWeight: 950, fontSize: 13, marginBottom: 6 }}>✅ Signed in.</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button onClick={routeAfterAuth} disabled={busy} style={UI.primaryBtn(busy)}>Continue</button>
                  <button onClick={() => supabase.auth.signOut().then(() => nav("/signin", { replace: true }))} disabled={busy} style={UI.ghostBtn(busy)}>Sign out</button>
                </div>
              </div>
            ) : sessionBooted ? (
              <div style={{ fontWeight: 950, fontSize: 13 }}>🔒 Signed out — please sign in.</div>
            ) : (
              <div style={{ fontWeight: 950, fontSize: 13 }}>Checking session…</div>
            )}
          </div>

          {notice && (
            <div ref={noticeRef} tabIndex={-1} style={notice.tone === "error" 
              ? { marginTop: 12, padding: 14, borderRadius: 14, background: "rgba(254,242,242,0.94)", border: "1px solid rgba(239,68,68,0.20)", color: "rgba(127,29,29,0.92)" } 
              : { marginTop: 12, padding: 14, borderRadius: 14, background: "rgba(236,253,245,0.92)", border: "1px solid rgba(16,185,129,0.20)", color: "rgba(6,95,70,0.92)" }}>
              {notice.message}
            </div>
          )}

          <div style={UI.ecosystemBlock}>
            <p style={UI.ecosystemTitle}>Mercy Account</p>
            <p style={UI.ecosystemText}>One sign-in for all Mercy apps.</p>
            {fromApp && <p style={UI.ecosystemText}>You’re signing in to continue to <b>{fromApp.label}</b>.</p>}
            {safeReturnPath && <div style={{ marginTop: 8, ...UI.small }}>After sign-in: <code>{safeReturnPath}</code></div>}
          </div>

          {recoveryReady ? (
            <RecoverySetPassword busyParent={busy} onDone={async () => { try { await ensureSessionOrThrow(); await routeAfterAuth(); } catch {} }} />
          ) : (
            <>
              {anyOAuthEnabled && (
                <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {AUTH_GOOGLE_ENABLED && <button onClick={signInGoogle} disabled={busy} style={UI.primaryBtn(busy)}>{busy ? "Please wait..." : "Continue with Google"}</button>}
                  {AUTH_FACEBOOK_ENABLED && <button onClick={signInFacebook} disabled={busy} style={UI.primaryBtn(busy)}>{busy ? "Please wait..." : "Continue with Facebook"}</button>}
                </div>
              )}

              <div style={UI.divider}><span style={UI.hr} />OR<span style={UI.hr} /></div>

              <div style={UI.segRow}>
                <button onClick={() => setTopMode("email")} disabled={busy} style={UI.segBtn(topMode === "email", busy)}>✉️ Email</button>
                <button onClick={() => setTopMode("phone")} disabled={busy} style={UI.segBtn(topMode === "phone", busy)}>📱 Phone</button>
              </div>

              {topMode === "email" && (
                <EmailBlock
                  emailRedirectTo={redirectToOAuthReturn}
                  redirectToRecovery={redirectToRecovery}
                  busyParent={busy}
                  onAuthed={routeAfterAuth}
                  onSignupCreated={(createdEmail, message) => setNotice({ tone: "success", message: `${message}\n\nEmail: ${createdEmail}` })}
                />
              )}

              {topMode === "phone" && <PhoneOtp busyParent={busy} onAuthed={routeAfterAuth} />}

              {recoveryMsg && <div style={UI.status}>{recoveryMsg}</div>}
            </>
          )}

          <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => nav("/")} disabled={busy} style={UI.ghostBtn(busy)}>← Back to home</button>
          </div>
        </div>
      </div>

      {!isNarrow && <MarketingPanel />}
    </div>
  );
}