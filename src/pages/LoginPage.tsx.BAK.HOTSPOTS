// src/pages/LoginPage.tsx
// MB-BLUE-101.3f — 2026-01-11 (+0700)
//
// FIX:
// - STOP forcing everyone to /admin after sign-in.
// - OAuth redirect returns to /signin (not /admin), then we route based on profile admin flags.
// - After sign-in/session established: admin -> /admin, normal -> returnTo (safe) or /
//
// NOTE:
// - This relies on public.profiles having is_admin/admin_level (your useUserAccess does).
// - If profiles row doesn't exist yet for a new OAuth user, we treat them as non-admin.
//
// PATCH (MB-BLUE-101.3g → MB-BLUE-101.3h):
// - Add ALWAYS-visible Session Status bar (Signed in / Signed out) + User ID for debugging.
// - Keep "Sign out" action.
// - Add "Log session" helper button (prints session to console).
// - Fix returnTo security: absolute URLs allowed ONLY if same-origin.
// - Keep OAuth non-silent: if signInWithOAuth returns data.url, force window.location.assign(data.url).
// - Fix typo: disdisabled -> disabled.
//
// PATCH (MB-BLUE-101.3h → MB-BLUE-101.3i):
// - Mount right-panel brand overlay from separate component (keep file sane).
// - Overlay sits in the EMPTY TOP SPACE above the rightInner card; high contrast; zIndex-proof.
//
// PATCH (MB-BLUE-101.3i → MB-BLUE-101.3j):
// - Fix password-eye “sticking out bar” by:
//   - Using a SINGLE border on the wrapper (input border removed)
//   - Clipping the wrapper (borderRadius + overflow hidden)
//   - Making the eye button transparent + borderless (no white pill extending past input)
//
// PATCH (MB-BLUE-101.3j → MB-BLUE-101.3k):
// - Fix remaining Safari/Chrome “eye pill / misalignment” by hard-resetting button appearance
//   + enforcing consistent input height (minHeight) so Password matches Email box.
//
// PATCH (MB-BLUE-101.3k → MB-BLUE-101.3k.1):
// - Use readBoolEnv() for OAuth flags (prevents unused helper + consistent parsing).
//
// PATCH (MB-BLUE-101.3k.1 → MB-BLUE-101.3k.2):
// - Replace MercyRightBrandOverlay text "Mercy" with an IMAGE wordmark.
// - Image name: public/brand/mercy_wordmark.png  (src="/brand/mercy_wordmark.png")
// - IMPORTANT: NO TEXT FALLBACK (per your request). If image missing, overlay shows nothing.

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

type TopMode = "email" | "phone" | "google" | "facebook";
type EmailMode = "password_signin" | "password_signup" | "magic" | "reset";

// ---- env helpers (Vite) ----
function readBoolEnv(key: string): boolean {
  const env: any = (import.meta as any)?.env ?? {};
  const v = String(env?.[key] ?? "").trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes" || v === "on";
}

/**
 * Trust UX helper:
 * - returnTo can be absolute (https://...) or relative (/...)
 * - For redirect, we ONLY allow:
 *   - relative path starting with "/"
 *   - OR same-origin absolute URL (converted to pathname+search+hash)
 */
function safeParseReturnTo(search: string): string | null {
  try {
    const sp = new URLSearchParams(search || "");
    const raw = sp.get("returnTo");
    if (!raw) return null;

    const trimmed = raw.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("/")) return trimmed;

    // ✅ absolute allowed only if same origin
    const u = new URL(trimmed);
    if (u.origin !== window.location.origin) return null;
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return null;
  }
}

function toSafeAppPath(returnTo: string | null): string | null {
  if (!returnTo) return null;
  const trimmed = returnTo.trim();
  if (!trimmed) return null;

  // relative allowed
  if (trimmed.startsWith("/")) return trimmed;

  // absolute allowed only if same origin
  try {
    const u = new URL(trimmed);
    if (u.origin !== window.location.origin) return null;
    const path = `${u.pathname}${u.search}${u.hash}`;
    return path.startsWith("/") ? path : null;
  } catch {
    return null;
  }
}

function resolveAppFromReturnTo(returnTo: string | null): { key: string; label: string } | null {
  if (!returnTo) return null;

  const s = returnTo.toLowerCase();

  // Minimal mapping for now (expand later)
  if (s.includes("mercy-ai-builder") || s.includes("ai-builder")) {
    return { key: "mercy_ai_builder", label: "Mercy AI Builder" };
  }
  if (s.includes("mercy-signal") || s.includes("mercysignal")) {
    return { key: "mercy_signal", label: "Mercy Signal" };
  }

  return null;
}

const UI = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "minmax(360px, 520px) 1fr",
    alignItems: "stretch",
    background:
      "radial-gradient(1000px 650px at 10% 10%, rgba(255, 105, 180, 0.14), transparent 55%)," +
      "radial-gradient(900px 520px at 90% 25%, rgba(0, 200, 255, 0.14), transparent 55%)," +
      "radial-gradient(900px 520px at 30% 90%, rgba(140, 255, 120, 0.14), transparent 55%)," +
      "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.92))",
  } as React.CSSProperties,

  left: {
    padding: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,

  card: {
    width: "100%",
    maxWidth: 520,
    borderRadius: 24,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.94)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.10)",
    padding: 22,
    backdropFilter: "blur(8px)",
  } as React.CSSProperties,

  right: {
    position: "relative",
    overflow: "hidden",
    padding: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderLeft: "1px solid rgba(0,0,0,0.06)",
    background:
      "radial-gradient(900px 540px at 25% 20%, rgba(255, 105, 180, 0.22), transparent 60%)," +
      "radial-gradient(900px 540px at 80% 30%, rgba(0, 200, 255, 0.22), transparent 62%)," +
      "radial-gradient(900px 540px at 45% 85%, rgba(140, 255, 120, 0.22), transparent 62%)," +
      "linear-gradient(180deg, rgba(16,16,16,0.04), rgba(16,16,16,0.02))",
  } as React.CSSProperties,

  rightInner: {
    width: "100%",
    maxWidth: 720,
    borderRadius: 28,
    padding: 26,
    background: "rgba(255,255,255,0.62)",
    border: "1px solid rgba(0,0,0,0.08)",
    boxShadow: "0 30px 90px rgba(0,0,0,0.08)",
    backdropFilter: "blur(10px)",
  } as React.CSSProperties,

  title: {
    fontSize: 40,
    lineHeight: 1.05,
    fontWeight: 950,
    letterSpacing: "-0.02em",
    margin: 0,
  } as React.CSSProperties,

  subtitle: {
    marginTop: 8,
    marginBottom: 0,
    opacity: 0.78,
    fontSize: 14,
    lineHeight: 1.5,
  } as React.CSSProperties,

  ecosystemBlock: {
    marginTop: 12,
    padding: 12,
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.70)",
  } as React.CSSProperties,

  ecosystemTitle: {
    fontWeight: 950,
    fontSize: 14,
    margin: 0,
  } as React.CSSProperties,

  ecosystemText: {
    marginTop: 6,
    marginBottom: 0,
    fontSize: 13,
    opacity: 0.85,
    lineHeight: 1.45,
  } as React.CSSProperties,

  segRow: {
    marginTop: 16,
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  } as React.CSSProperties,

  segBtn: (active: boolean, disabled: boolean) =>
    ({
      padding: "10px 12px",
      borderRadius: 14,
      border: "1px solid rgba(0,0,0,0.12)",
      background: active ? "rgba(0,0,0,0.06)" : "white",
      cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: 900,
      fontSize: 14,
    }) as React.CSSProperties,

  block: {
    marginTop: 16,
    padding: 14,
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.70)",
  } as React.CSSProperties,

  label: {
    display: "block",
    marginBottom: 6,
    fontWeight: 850,
    fontSize: 13,
  } as React.CSSProperties,

  input: (disabled: boolean) =>
    ({
      width: "100%",
      padding: 11,
      fontSize: 16,
      border: "1px solid rgba(0,0,0,0.14)",
      borderRadius: 12,
      outline: "none",
      opacity: disabled ? 0.7 : 1,
      boxSizing: "border-box",
      minHeight: 46, // keep consistent box height
    }) as React.CSSProperties,

  primaryBtn: (disabled: boolean) =>
    ({
      width: "100%",
      padding: "12px 14px",
      borderRadius: 14,
      border: "1px solid rgba(0,0,0,0.14)",
      cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: 950,
      fontSize: 15,
      background: "rgba(0,0,0,0.04)",
    }) as React.CSSProperties,

  ghostBtn: (disabled: boolean) =>
    ({
      padding: "10px 12px",
      borderRadius: 14,
      border: "1px solid rgba(0,0,0,0.12)",
      background: "white",
      cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: 850,
    }) as React.CSSProperties,

  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginTop: 14,
    opacity: 0.7,
    fontSize: 12,
    fontWeight: 850,
  } as React.CSSProperties,

  hr: { flex: "1 1 auto", height: 1, background: "rgba(0,0,0,0.12)" } as React.CSSProperties,

  linkBtn: (disabled: boolean) =>
    ({
      border: "none",
      background: "transparent",
      padding: 0,
      cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: 900,
      textDecoration: "underline",
    }) as React.CSSProperties,

  small: { fontSize: 12, opacity: 0.72, lineHeight: 1.45 } as React.CSSProperties,

  status: {
    marginTop: 12,
    whiteSpace: "pre-wrap",
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.9)",
    fontSize: 13,
  } as React.CSSProperties,

  quoteMark: {
    fontSize: 60,
    lineHeight: 1,
    opacity: 0.22,
    fontWeight: 950,
    margin: 0,
  } as React.CSSProperties,

  rightHeadline: {
    marginTop: 6,
    fontSize: 28,
    lineHeight: 1.18,
    fontWeight: 950,
    letterSpacing: "-0.02em",
    marginBottom: 10,
  } as React.CSSProperties,

  rightText: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.65,
    opacity: 0.9,
  } as React.CSSProperties,

  rightBadge: {
    display: "inline-flex",
    gap: 8,
    alignItems: "center",
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.70)",
    fontWeight: 900,
    fontSize: 12,
    marginTop: 14,
  } as React.CSSProperties,
};

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

  if (msg.includes("user already registered")) {
    return "This email is already registered.\n\nSwitch to Sign in (or click “Forgot password” to reset).";
  }

  if (msg.includes("provider is not enabled") || msg.includes("unsupported provider")) {
    return "This sign-in provider is not enabled yet. Please use Email or Phone for now.";
  }

  return raw || "Unknown error";
}

async function ensureSessionOrThrow() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!data?.session) throw new Error("No active session after sign-in. Please try again.");
  return data.session;
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
    // ignore
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

// ✅ INLINE brand overlay (IMAGE ONLY — NO TEXT)
//
// Image file name I want you to use:
//   public/brand/mercy_wordmark.png
// Then reference it like:
//   src="/brand/mercy_wordmark.png"
function MercyRightBrandOverlayInline() {
  return (
    <div
      aria-label="Mercy brand overlay"
      style={{
        position: "absolute",
        top: 18,
        left: 18,
        right: 18,
        zIndex: 20,
        pointerEvents: "none",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          pointerEvents: "none",
          borderRadius: 22,
          border: "1px solid rgba(0,0,0,0.10)",
          background: "rgba(255,255,255,0.78)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 22px 70px rgba(0,0,0,0.10)",
          padding: "14px 18px",
          maxWidth: 720,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/brand/mercy_wordmark.png"
          alt="Mercy"
          decoding="async"
          loading="eager"
          style={{
            display: "block",
            height: 46,
            width: "auto",
            maxWidth: "min(520px, 80vw)",
            objectFit: "contain",
          }}
          onError={(e) => {
            // NO TEXT FALLBACK (per user). If missing, hide the img so the overlay stays clean.
            e.currentTarget.style.display = "none";
          }}
        />
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
          Mercy Blade is part of the <b>Mercy — Serving Humanity App Ecosystem</b>.
          <br />
          We walk with you through health, emotions, money, relationships, work, and meaning — with calm clarity and
          practical steps you can use today.
          <br />
          <br />
          No pressure. No judgment. Just a steady companion that helps you move forward.
        </p>

        <div style={{ height: 14 }} />

        <div style={UI.rightHeadline}>Người đồng hành thông minh và dịu dàng — cho đời sống thật.</div>

        <p style={UI.rightText}>
          Mercy Blade là một phần của <b>Hệ sinh thái ứng dụng Mercy — Phục vụ Nhân loại</b>.
          <br />
          Chúng tôi đồng hành cùng bạn trong sức khỏe, cảm xúc, tiền bạc, mối quan hệ, công việc và ý nghĩa sống — bằng
          sự bình tĩnh, rõ ràng và những bước đi thực tế bạn có thể làm ngay hôm nay.
          <br />
          <br />
          Không áp lực. Không phán xét. Chỉ là một người bạn đồng hành vững chãi giúp bạn tiến lên.
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

  async function setNewPassword() {
    setBusy(true);
    setMsg(null);
    try {
      const a = pw1.trim();
      const b = pw2.trim();
      if (!a || a.length < 6) return setMsg("Password must be at least 6 characters.");
      if (a !== b) return setMsg("Passwords do not match.");

      const { error } = await supabase.auth.updateUser({ password: a });
      if (error) return setMsg(error.message);

      setMsg("✅ Password updated. You are now signed in.");
      clearRecoveryFromUrl();
      onDone();
    } catch (e: any) {
      setMsg(e?.message || "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={UI.block}>
      <div style={{ fontWeight: 950, fontSize: 16 }}>Set a new password</div>
      <div style={{ marginTop: 6, ...UI.small }}>
        This page opened from your reset email. Choose a new password to finish.
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={UI.label}>New password</label>

        <div
          style={{
            position: "relative",
            width: "100%",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.14)",
            background: "white",
            overflow: "hidden",
            opacity: disabled ? 0.7 : 1,
            boxSizing: "border-box",
            minHeight: 46,
          }}
        >
          <input
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
            placeholder="••••••••"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            disabled={disabled}
            style={{
              width: "100%",
              boxSizing: "border-box",
              minHeight: 46,
              padding: "11px 52px 11px 11px",
              fontSize: 16,
              border: "none",
              outline: "none",
              background: "transparent",
              margin: 0,
            }}
          />

          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            disabled={disabled}
            aria-label={show ? "Hide password" : "Show password"}
            title={show ? "Hide password" : "Show password"}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 36,
              height: 36,
              border: "none",
              background: "transparent",
              borderRadius: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: 0.75,
              padding: 0,
              lineHeight: 1,
              fontSize: 18,

              // ✅ kill browser “button chrome”
              appearance: "none",
              WebkitAppearance: "none",
              outline: "none",
              boxShadow: "none",
            }}
          >
            {show ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={UI.label}>Confirm password</label>
        <input
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
          placeholder="••••••••"
          type={show ? "text" : "password"}
          autoComplete="new-password"
          style={UI.input(disabled)}
          disabled={disabled}
        />
        <div style={{ marginTop: 8, ...UI.small }}>Minimum 6 characters.</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={setNewPassword} disabled={disabled} style={UI.primaryBtn(disabled)}>
          {disabled ? "Please wait..." : "Update password"}
        </button>
      </div>

      {msg && <div style={UI.status}>{msg}</div>}
    </div>
  );
}

async function fetchAdminFlagsSafe(userId: string): Promise<{ isAdmin: boolean }> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin, admin_level")
      .eq("id", userId)
      .maybeSingle();

    if (error) return { isAdmin: false };

    const isAdmin = Boolean((data as any)?.is_admin) || Number((data as any)?.admin_level ?? 0) >= 1;
    return { isAdmin };
  } catch {
    return { isAdmin: false };
  }
}

function PhoneOtp({
  redirectToOAuthReturn,
  busyParent,
  onAuthed,
}: {
  redirectToOAuthReturn: string;
  busyParent: boolean;
  onAuthed: () => Promise<void>;
}) {
  const [phone, setPhone] = React.useState("");
  const [token, setToken] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  const disabled = busyParent || busy;
  const cleanPhone = () => phone.trim();

  async function sendCode() {
    setBusy(true);
    setMsg(null);
    try {
      const p = cleanPhone();
      if (!p || p.length < 8) {
        setMsg("Enter phone with country code (example: +84...).");
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: p,
        options: { redirectTo: redirectToOAuthReturn },
      });

      if (error) {
        setMsg(error.message);
        return;
      }

      setSent(true);
      setMsg("✅ Code sent. Enter the SMS code to sign in.");
    } catch (e: any) {
      setMsg(e?.message || "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode() {
    setBusy(true);
    setMsg(null);
    try {
      const p = cleanPhone();
      const t = token.trim();

      if (!p || p.length < 8) return setMsg("Enter phone with country code.");
      if (!t || t.length < 4) return setMsg("Enter the code you received.");

      const { error } = await supabase.auth.verifyOtp({
        phone: p,
        token: t,
        type: "sms",
      });

      if (error) {
        setMsg(error.message);
        return;
      }

      await ensureSessionOrThrow();
      await onAuthed();
    } catch (e: any) {
      setMsg(e?.message || "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={UI.block}>
      <div style={UI.small}>We’ll send you a one-time code (OTP).</div>

      <div style={{ marginTop: 12 }}>
        <label style={UI.label}>Phone</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+84 901234567"
          autoComplete="tel"
          style={UI.input(disabled)}
          disabled={disabled}
        />
      </div>

      {!sent ? (
        <div style={{ marginTop: 12 }}>
          <button onClick={sendCode} disabled={disabled} style={UI.primaryBtn(disabled)}>
            {disabled ? "Please wait..." : "Send SMS code"}
          </button>
          <div style={{ marginTop: 8, ...UI.small }}>Tip: always include country code (+66 / +84 / +1 …).</div>
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>
          <label style={UI.label}>SMS code</label>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="123456"
            autoComplete="one-time-code"
            style={UI.input(disabled)}
            disabled={disabled}
          />

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={verifyCode} disabled={disabled} style={{ ...UI.primaryBtn(disabled), flex: "1 1 auto" }}>
              {disabled ? "Please wait..." : "Verify & sign in"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setToken("");
                setMsg(null);
              }}
              disabled={disabled}
              style={UI.ghostBtn(disabled)}
            >
              Change phone
            </button>
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
}: {
  emailRedirectTo: string;
  redirectToRecovery: string;
  busyParent: boolean;
  onAuthed: () => Promise<void>;
}) {
  const [mode, setMode] = useState<EmailMode>("password_signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const disabled = busyParent || busy;
  const cleanEmail = () => email.trim().toLowerCase();

  async function sendMagicLink() {
    setBusy(true);
    setStatus(null);
    try {
      const clean = cleanEmail();
      if (!clean || !clean.includes("@")) return setStatus("Please enter a valid email.");

      const { error } = await supabase.auth.signInWithOtp({
        email: clean,
        options: { emailRedirectTo },
      });

      if (error) return setStatus(humanizeAuthError(error, mode));
      setStatus("✅ Email link sent. Open your email and click the link.");
    } catch (e: any) {
      setStatus(humanizeAuthError(e, mode));
    } finally {
      setBusy(false);
    }
  }

  async function signInWithPassword() {
    setBusy(true);
    setStatus(null);
    try {
      const clean = cleanEmail();
      if (!clean || !clean.includes("@")) return setStatus("Please enter a valid email.");
      if (!password || password.length < 6) return setStatus("Password must be at least 6 characters.");

      const { error } = await supabase.auth.signInWithPassword({ email: clean, password });
      if (error) return setStatus(humanizeAuthError(error, mode));

      await ensureSessionOrThrow();
      await onAuthed();
    } catch (e: any) {
      setStatus(humanizeAuthError(e, mode));
    } finally {
      setBusy(false);
    }
  }

  async function signUpWithPassword() {
    setBusy(true);
    setStatus(null);
    try {
      const clean = cleanEmail();
      if (!clean || !clean.includes("@")) return setStatus("Please enter a valid email.");
      if (!password || password.length < 6) return setStatus("Password must be at least 6 characters.");

      const { data, error } = await supabase.auth.signUp({
        email: clean,
        password,
        options: { emailRedirectTo },
      });

      if (error) return setStatus(humanizeAuthError(error, mode));

      if (!data.session) {
        setStatus("✅ Account created.\n\nPlease check your email to confirm, then sign in.");
        return;
      }

      await ensureSessionOrThrow();
      await onAuthed();
    } catch (e: any) {
      setStatus(humanizeAuthError(e, mode));
    } finally {
      setBusy(false);
    }
  }

  async function sendResetPasswordEmail() {
    setBusy(true);
    setStatus(null);
    try {
      const clean = cleanEmail();
      if (!clean || !clean.includes("@")) return setStatus("Please enter a valid email.");

      const { error } = await supabase.auth.resetPasswordForEmail(clean, {
        redirectTo: redirectToRecovery,
      });
      if (error) return setStatus(humanizeAuthError(error, mode));

      setStatus("✅ Password reset email sent.\n\nOpen your email and follow the link.");
    } catch (e: any) {
      setStatus(humanizeAuthError(e, mode));
    } finally {
      setBusy(false);
    }
  }

  const showPasswordField = mode === "password_signin" || mode === "password_signup";

  const primaryActionLabel =
    mode === "password_signin"
      ? "Sign in"
      : mode === "password_signup"
        ? "Create account"
        : mode === "magic"
          ? "Send email link"
          : "Send reset email";

  const onPrimary =
    mode === "password_signin"
      ? signInWithPassword
      : mode === "password_signup"
        ? signUpWithPassword
        : mode === "magic"
          ? sendMagicLink
          : sendResetPasswordEmail;

  return (
    <div style={UI.block}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={() => setMode("password_signin")}
          disabled={disabled}
          style={UI.segBtn(mode === "password_signin", disabled)}
        >
          Sign in
        </button>
        <button
          onClick={() => setMode("password_signup")}
          disabled={disabled}
          style={UI.segBtn(mode === "password_signup", disabled)}
        >
          Sign up
        </button>
        <button onClick={() => setMode("reset")} disabled={disabled} style={UI.segBtn(mode === "reset", disabled)}>
          Forgot password
        </button>
        <button
          onClick={() => setMode("magic")}
          disabled={disabled}
          style={UI.segBtn(mode === "magic", disabled)}
          title="Optional: sign in without password"
        >
          Email link
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={UI.label}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          autoComplete="email"
          style={UI.input(disabled)}
          disabled={disabled}
        />
      </div>

      {showPasswordField && (
        <div style={{ marginTop: 12 }}>
          <label style={UI.label}>Password</label>

          <div
            style={{
              position: "relative",
              width: "100%",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.14)",
              background: "white",
              overflow: "hidden",
              opacity: disabled ? 0.7 : 1,
              boxSizing: "border-box",
              minHeight: 46,
            }}
          >
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type={showPw ? "text" : "password"}
              autoComplete={mode === "password_signup" ? "new-password" : "current-password"}
              disabled={disabled}
              style={{
                width: "100%",
                boxSizing: "border-box",
                minHeight: 46,
                padding: "11px 52px 11px 11px",
                fontSize: 16,
                border: "none",
                outline: "none",
                background: "transparent",
                margin: 0,
              }}
            />

            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
              disabled={disabled}
              title={showPw ? "Hide password" : "Show password"}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                width: 36,
                height: 36,
                border: "none",
                background: "transparent",
                borderRadius: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: 0.75,
                padding: 0,
                lineHeight: 1,
                fontSize: 18,

                // ✅ kill browser “button chrome”
                appearance: "none",
                WebkitAppearance: "none",
                outline: "none",
                boxShadow: "none",
              }}
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>

          <div style={{ marginTop: 8, ...UI.small }}>Minimum 6 characters.</div>

          {mode === "password_signin" && (
            <div style={{ marginTop: 10, ...UI.small }}>
              <button type="button" onClick={() => setMode("reset")} disabled={disabled} style={UI.linkBtn(disabled)}>
                Forgot password?
              </button>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <button onClick={onPrimary} disabled={disabled} style={UI.primaryBtn(disabled)}>
          {disabled ? "Please wait..." : primaryActionLabel}
        </button>
      </div>

      <div style={{ marginTop: 10, ...UI.small }}>
        {mode === "password_signin" ? (
          <>
            New here?{" "}
            <button
              type="button"
              onClick={() => setMode("password_signup")}
              disabled={disabled}
              style={UI.linkBtn(disabled)}
            >
              Create an account
            </button>
            .
          </>
        ) : mode === "password_signup" ? (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("password_signin")}
              disabled={disabled}
              style={UI.linkBtn(disabled)}
            >
              Sign in
            </button>
            .
          </>
        ) : null}
      </div>

      {status && <div style={UI.status}>{status}</div>}
    </div>
  );
}

export default function LoginPage() {
  const nav = useNavigate();

  const returnToRaw = useMemo(() => safeParseReturnTo(window.location.search || ""), []);
  const fromApp = useMemo(() => resolveAppFromReturnTo(returnToRaw), [returnToRaw]);

  // ✅ use helper (also prevents unused readBoolEnv)
  const AUTH_GOOGLE_ENABLED = useMemo(() => readBoolEnv("VITE_AUTH_GOOGLE_ENABLED"), []);
  const AUTH_FACEBOOK_ENABLED = useMemo(() => readBoolEnv("VITE_AUTH_FACEBOOK_ENABLED"), []);
  const IS_DEV = import.meta.env.DEV;

  useEffect(() => {
    if (!IS_DEV) return;
    // eslint-disable-next-line no-console
    console.log("[MB] OAuth flags from import.meta.env:", {
      google: import.meta.env.VITE_AUTH_GOOGLE_ENABLED,
      facebook: import.meta.env.VITE_AUTH_FACEBOOK_ENABLED,
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
    });
  }, [IS_DEV]);

  const redirectToOAuthReturn = useMemo(() => `${window.location.origin}/signin`, []);
  const redirectToRecovery = useMemo(() => `${window.location.origin}/signin?recovery=1`, []);

  const DEFAULT_USER_ROUTE = "/";
  const ADMIN_ROUTE = "/admin";

  const safeReturnPath = useMemo(() => toSafeAppPath(returnToRaw), [returnToRaw]);

  async function routeAfterAuth() {
    const session = await ensureSessionOrThrow();
    const userId = session.user.id;

    const { isAdmin } = await fetchAdminFlagsSafe(userId);

    const target = isAdmin ? ADMIN_ROUTE : safeReturnPath || DEFAULT_USER_ROUTE;
    nav(target, { replace: true });
  }

  const [topMode, setTopMode] = useState<TopMode>("email");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const [recoveryReady, setRecoveryReady] = useState(false);
  const [recoveryMsg, setRecoveryMsg] = useState<string | null>(null);

  const [isNarrow, setIsNarrow] = useState(false);

  const [hasSession, setHasSession] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);

  useEffect(() => {
    function onResize() {
      setIsNarrow(window.innerWidth < 980);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let alive = true;

    async function bootSessionFlag() {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      const s = data?.session;
      setHasSession(Boolean(s));
      setSessionEmail((s?.user?.email as string) || null);
      setSessionUserId((s?.user?.id as string) || null);
    }

    bootSessionFlag();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!alive) return;
      setHasSession(Boolean(session));
      setSessionEmail((session?.user?.email as string) || null);
      setSessionUserId((session?.user?.id as string) || null);
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  async function signOutNow() {
    setBusy(true);
    setStatus(null);
    try {
      await supabase.auth.signOut();
      nav("/signin", { replace: true });
    } catch (e: any) {
      setStatus(e?.message || "Sign out failed");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const oauthErr = readOAuthErrorFromSearch(window.location.search || "");
    if (!oauthErr) return;

    const lines = [
      "OAuth sign-in failed.",
      oauthErr.error ? `error: ${oauthErr.error}` : "",
      oauthErr.desc ? `details: ${oauthErr.desc}` : "",
    ].filter(Boolean);

    setStatus(lines.join("\n"));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootRecoveryIfNeeded() {
      try {
        const qp = new URLSearchParams(window.location.search || "");
        const wantRecovery = qp.get("recovery") === "1";

        const h = parseHashParams(window.location.hash || "");
        const isRecoveryHash = h.type === "recovery" || h.type === "signup";

        if (h.access_token && h.refresh_token && (h.type === "recovery" || wantRecovery || isRecoveryHash)) {
          const { error } = await supabase.auth.setSession({
            access_token: h.access_token,
            refresh_token: h.refresh_token,
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
      }
    }

    bootRecoveryIfNeeded();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let alive = true;

    async function bootIfAlreadySignedIn() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!alive) return;
        if (data?.session?.user?.id) {
          await routeAfterAuth();
        }
      } catch {
        // ignore
      }
    }

    bootIfAlreadySignedIn();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signInGoogle() {
    setBusy(true);
    setStatus(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectToOAuthReturn },
      });

      if (error) {
        setStatus(humanizeAuthError(error, "password_signin"));
        return;
      }

      if (data?.url) window.location.assign(data.url);
      else setStatus("Google sign-in did not return a redirect URL.");
    } catch (e: any) {
      setStatus(humanizeAuthError(e, "password_signin"));
    } finally {
      setBusy(false);
    }
  }

  async function signInFacebook() {
    setBusy(true);
    setStatus(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: { redirectTo: redirectToOAuthReturn },
      });

      if (error) {
        setStatus(humanizeAuthError(error, "password_signin"));
        return;
      }

      if (data?.url) window.location.assign(data.url);
      else setStatus("Facebook sign-in did not return a redirect URL.");
    } catch (e: any) {
      setStatus(humanizeAuthError(e, "password_signin"));
    } finally {
      setBusy(false);
    }
  }

  const pageStyle: React.CSSProperties = isNarrow ? { ...UI.page, gridTemplateColumns: "1fr" } : UI.page;
  const anyOAuthEnabled = AUTH_GOOGLE_ENABLED || AUTH_FACEBOOK_ENABLED;

  return (
    <div style={pageStyle}>
      <div style={UI.left}>
        <div style={UI.card}>
          <h1 style={UI.title}>Sign in</h1>
          <p style={UI.subtitle}>Choose a sign-in method. After signing in, we’ll take you to the right place.</p>

          <div style={UI.block}>
            {hasSession ? (
              <>
                <div style={{ fontWeight: 950, fontSize: 13, marginBottom: 6 }}>
                  ✅ Signed in{sessionEmail ? ` as ${sessionEmail}` : ""}.
                </div>

                {sessionUserId && (
                  <div style={{ ...UI.small, marginBottom: 10 }}>
                    User ID: <code>{sessionUserId}</code>
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    onClick={signOutNow}
                    disabled={busy}
                    style={{ ...UI.primaryBtn(busy), width: "auto", flex: "1 1 180px" }}
                  >
                    {busy ? "Please wait..." : "Sign out"}
                  </button>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                      const { data } = await supabase.auth.getSession();
                      // eslint-disable-next-line no-console
                      console.log("[MB] session:", data?.session);
                    }}
                    style={{ ...UI.ghostBtn(busy), flex: "1 1 180px" }}
                    title="Print session object in DevTools"
                  >
                    Log session
                  </button>
                </div>
              </>
            ) : (
              <div style={{ fontWeight: 950, fontSize: 13 }}>🔒 Signed out — please sign in.</div>
            )}
          </div>

          <div style={UI.ecosystemBlock}>
            <p style={UI.ecosystemTitle}>Mercy Account</p>
            <p style={UI.ecosystemText}>One sign-in for all Mercy apps.</p>

            {fromApp ? (
              <p style={UI.ecosystemText}>
                You’re signing in to continue to <b>{fromApp.label}</b>.
              </p>
            ) : null}

            <div style={UI.ecosystemText as React.CSSProperties}>
              Apps in the Mercy ecosystem (for now):
              <ul style={{ margin: "6px 0 0 18px" }}>
                <li>Mercy AI Builder</li>
                <li>Mercy Signal</li>
              </ul>
            </div>

            {safeReturnPath ? (
              <div style={{ marginTop: 8, ...UI.small }}>
                After sign-in you’ll continue to: <code>{safeReturnPath}</code>
              </div>
            ) : null}
          </div>

          {IS_DEV && (
            <div style={{ marginTop: 8, ...UI.small }}>
              OAuth flags: Google=<b>{String(AUTH_GOOGLE_ENABLED)}</b> • Facebook=<b>{String(AUTH_FACEBOOK_ENABLED)}</b>
            </div>
          )}

          {recoveryReady ? (
            <>
              <RecoverySetPassword
                busyParent={busy}
                onDone={async () => {
                  try {
                    await ensureSessionOrThrow();
                    await routeAfterAuth();
                  } catch {
                    // keep user on page
                  }
                }}
              />
              {recoveryMsg && <div style={UI.status}>{recoveryMsg}</div>}
            </>
          ) : (
            <>
              {anyOAuthEnabled && (
                <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {AUTH_GOOGLE_ENABLED && (
                    <button
                      onClick={signInGoogle}
                      disabled={busy}
                      style={{ ...UI.primaryBtn(busy), width: "auto", flex: "1 1 200px" }}
                    >
                      {busy ? "Please wait..." : "Continue with Google"}
                    </button>
                  )}

                  {AUTH_FACEBOOK_ENABLED && (
                    <button
                      onClick={signInFacebook}
                      disabled={busy}
                      style={{ ...UI.primaryBtn(busy), width: "auto", flex: "1 1 200px" }}
                    >
                      {busy ? "Please wait..." : "Continue with Facebook"}
                    </button>
                  )}
                </div>
              )}

              <div style={UI.divider}>
                <span style={UI.hr} />
                <span>OR</span>
                <span style={UI.hr} />
              </div>

              <div style={UI.segRow}>
                <button onClick={() => setTopMode("email")} disabled={busy} style={UI.segBtn(topMode === "email", busy)}>
                  ✉️ Email
                </button>
                <button onClick={() => setTopMode("phone")} disabled={busy} style={UI.segBtn(topMode === "phone", busy)}>
                  📱 Phone
                </button>
              </div>

              {topMode === "email" && (
                <EmailBlock
                  emailRedirectTo={redirectToOAuthReturn}
                  redirectToRecovery={redirectToRecovery}
                  busyParent={busy}
                  onAuthed={routeAfterAuth}
                />
              )}

              {topMode === "phone" && (
                <PhoneOtp redirectToOAuthReturn={redirectToOAuthReturn} busyParent={busy} onAuthed={routeAfterAuth} />
              )}

              {status && <div style={UI.status}>{status}</div>}
            </>
          )}

          <div
            style={{
              marginTop: 18,
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button onClick={() => nav("/")} style={UI.ghostBtn(busy)} disabled={busy}>
              ← Back to home
            </button>

            <div style={UI.small}>
              OAuth return: <code>{redirectToOAuthReturn}</code>
            </div>
          </div>
        </div>
      </div>

      {!isNarrow && <MarketingPanel />}
    </div>
  );
}

/** New thing to learn:
 * Anything inside /public is served from "/".
 * So: public/brand/mercy_wordmark.png  →  /brand/mercy_wordmark.png
 */
