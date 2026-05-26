import React, { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  ensureSessionOrThrow,
  humanizeAuthError,
  type EmailMode,
} from "@/lib/authHelpers";
import { UI, AUTH_FOCUS_RING, AUTH_FOCUS_RING_WITHIN } from "@/components/auth/authUI";
import {
  challengeFactor,
  findFirstVerifiedTotp,
  humanizeMfaError,
  listMfaFactors,
  verifyChallenge,
} from "@/lib/security/mfaClient";

type CodeStep = "email" | "code";

export default function EmailBlock({
  emailRedirectTo,
  redirectToRecovery,
  busyParent,
  onAuthed,
  onAnnounce,
  onSignupCreated,
}: {
  emailRedirectTo: string;
  redirectToRecovery: string;
  busyParent: boolean;
  onAuthed: () => Promise<void>;
  onAnnounce?: (message: string) => void;
  onSignupCreated: (email: string, message: string) => void;
}) {
  const [mode, setMode] = useState<EmailMode>("code_email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const statusRef = useRef<HTMLDivElement | null>(null);

  // Code-first email flow state. After the user submits their email and
  // we successfully send the OTP, step transitions to "code" and the
  // form swaps to a 6-digit code input. verifyOtp() then completes the
  // sign-in directly — no link click, no PKCE, no browser swap.
  const [codeStep, setCodeStep] = useState<CodeStep>("email");
  const [otpCode, setOtpCode] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [codeEmail, setCodeEmail] = useState("");

  // 2FA Phase 1 — TOTP challenge state. After a successful password
  // step (or verifyOtp), if the user has any verified TOTP factors we
  // hold them here until they enter their 6-digit code. onAuthed() is
  // NOT called until the challenge verifies. See
  // reports/2fa-design-decisions-2026-04-27.md § Decision 5.
  const [totpStep, setTotpStep] = useState<{
    factorId: string;
    challengeId: string;
  } | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [totpVerifying, setTotpVerifying] = useState(false);

  const disabled = busyParent || busy;
  const cleanEmail = useCallback(() => email.trim().toLowerCase(), [email]);

  useEffect(() => {
    if (!status) return;
    statusRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [status]);

  // A30 — announce status through the auth shell's single live region.
  // The code-entry and TOTP steps already render their status inside a
  // role="alert" container (announced natively); only skip those so we
  // don't double-speak. The primary form's status (line ~788) has no
  // live semantics of its own — this is the path audit A3 flagged.
  useEffect(() => {
    if (!status || !onAnnounce) return;
    const innerHasAlert =
      Boolean(totpStep) || (mode === "code_email" && codeStep === "code");
    if (innerHasAlert) return;
    onAnnounce(status);
  }, [status, totpStep, mode, codeStep, onAnnounce]);

  // After any successful primary auth (password or verifyOtp), check
  // whether the user has a verified TOTP factor and gate the redirect
  // on it. Returns true if MFA is required and the caller should NOT
  // call onAuthed yet; false if the user is fully authenticated.
  const maybeBeginTotpStep = useCallback(async (): Promise<boolean> => {
    try {
      const factors = await listMfaFactors();
      const totp = findFirstVerifiedTotp(factors);
      if (!totp) return false;
      const { challengeId } = await challengeFactor(totp.id);
      setTotpStep({ factorId: totp.id, challengeId });
      setStatus(null);
      return true;
    } catch (mfaErr) {
      // If the MFA list call fails we fall through to the no-MFA
      // path. The user is signed in regardless; the worst case is
      // they slip past a 2FA gate they enrolled but the API is
      // briefly unreachable. Log so we can find this in Sentry but
      // don't block sign-in on a transient API hiccup.
      if (import.meta.env.DEV) {
        console.warn("[mfa] listFactors failed during sign-in:", mfaErr);
      }
      return false;
    }
  }, []);

  // ── Code-first email flow: send code ───────────────────────────────
  const sendEmailCode = useCallback(async () => {
    if (disabled) return;
    setBusy(true);
    setStatus(null);

    try {
      const clean = cleanEmail();
      if (!clean || !clean.includes("@")) {
        setStatus("Vui lòng nhập email hợp lệ.\nPlease enter a valid email.");
        return;
      }

      // shouldCreateUser: true so the same path covers both new and
      // returning users — they receive a 6-digit code by email and type
      // it back in here. The PKCE link is still in the email and works
      // as a silent fallback if the user clicks it in the same browser
      // (detectSessionInUrl on the supabase client handles that path).
      const { error } = await supabase.auth.signInWithOtp({
        email: clean,
        options: {
          emailRedirectTo,
          shouldCreateUser: true,
        },
      });

      if (error) throw error;

      setCodeEmail(clean);
      setOtpCode("");
      setCodeStep("code");
      setStatus(
        "✅ Đã gửi mã 6 chữ số tới email của bạn. Hãy mở email và nhập mã vào ô bên dưới.\n6-digit code sent. Open your email and enter the code below.",
      );
      onSignupCreated(clean, "Đã gửi mã. Code sent.");
    } catch (e) {
      setStatus(humanizeAuthError(e, "code_email"));
    } finally {
      setBusy(false);
    }
  }, [cleanEmail, disabled, emailRedirectTo, onSignupCreated]);

  // ── Code-first email flow: verify code ────────────────────────────
  const verifyEmailCode = useCallback(async () => {
    if (disabled || otpVerifying) return;
    if (!/^\d{6}$/.test(otpCode)) {
      setStatus(
        "Nhập đủ 6 chữ số trong email.\nEnter the 6-digit code from your email.",
      );
      return;
    }
    setOtpVerifying(true);
    setStatus(null);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: codeEmail,
        token: otpCode,
        type: "email",
      });
      if (error) throw error;

      await ensureSessionOrThrow();

      const mfaPending = await maybeBeginTotpStep();
      if (mfaPending) return; // TOTP UI takes over.

      setStatus(
        "✅ Đã đăng nhập. Đang chuyển trang…\nSigned in. Redirecting…",
      );
      await onAuthed();
    } catch (e) {
      setStatus(humanizeAuthError(e, "code_email"));
    } finally {
      setOtpVerifying(false);
    }
  }, [
    codeEmail,
    disabled,
    maybeBeginTotpStep,
    onAuthed,
    otpCode,
    otpVerifying,
  ]);

  const resendEmailCode = useCallback(async () => {
    if (disabled) return;
    setBusy(true);
    setStatus(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: codeEmail,
        options: { emailRedirectTo, shouldCreateUser: true },
      });
      if (error) throw error;
      setOtpCode("");
      setStatus(
        "✅ Đã gửi lại mã. Kiểm tra email.\nNew code sent. Check your email.",
      );
    } catch (e) {
      setStatus(humanizeAuthError(e, "code_email"));
    } finally {
      setBusy(false);
    }
  }, [codeEmail, disabled, emailRedirectTo]);

  const cancelCodeStep = useCallback(() => {
    setCodeStep("email");
    setOtpCode("");
    setCodeEmail("");
    setStatus(null);
  }, []);

  const signInWithPassword = useCallback(async () => {
    if (disabled) return;
    setBusy(true);
    setStatus(null);

    try {
      const clean = cleanEmail();
      if (!clean || !clean.includes("@")) {
        setStatus("Vui lòng nhập email hợp lệ.\nPlease enter a valid email.");
        return;
      }
      if (!password || password.length < 6) {
        setStatus(
          "Mật khẩu cần tối thiểu 6 ký tự.\nPassword must be at least 6 characters.",
        );
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: clean,
        password,
      });
      if (error) throw error;

      await ensureSessionOrThrow();

      const mfaPending = await maybeBeginTotpStep();
      if (mfaPending) return; // Don't call onAuthed yet — wait for TOTP verify.

      setStatus(
        "✅ Đã đăng nhập. Đang chuyển trang…\nSigned in. Redirecting…",
      );
      await onAuthed();
    } catch (e) {
      setStatus(humanizeAuthError(e, mode));
    } finally {
      setBusy(false);
    }
  }, [cleanEmail, disabled, maybeBeginTotpStep, mode, onAuthed, password]);

  // 2FA Phase 1 — TOTP challenge submit handler. Called from the
  // separate code-entry UI rendered below when totpStep is non-null.
  const verifyTotpStep = useCallback(async () => {
    if (!totpStep) return;
    if (!/^\d{6}$/.test(totpCode)) {
      setStatus(
        "Nhập đủ 6 chữ số từ ứng dụng xác thực.\nEnter the 6-digit code from your authenticator app.",
      );
      return;
    }
    setTotpVerifying(true);
    setStatus(null);
    try {
      await verifyChallenge(totpStep.factorId, totpStep.challengeId, totpCode);
      // Success — session is now aal=2. Hand off to onAuthed().
      setStatus(
        "✅ Đã đăng nhập. Đang chuyển trang…\nSigned in. Redirecting…",
      );
      await onAuthed();
    } catch (err) {
      const friendly = humanizeMfaError(err);
      setStatus(friendly.en);
      // Stay on the TOTP step so the user can retry — Phase 2 will
      // add a 5-attempt server-side lockout in the rate_limits table
      // (see reports/2fa-design-decisions-2026-04-27.md § Decision 3).
    } finally {
      setTotpVerifying(false);
    }
  }, [onAuthed, totpCode, totpStep]);

  const cancelTotpStep = useCallback(async () => {
    // Cancelling the TOTP step means the user gives up on this
    // sign-in. Sign them out so a malicious bystander can't bypass
    // the second factor by just walking away from the prompt.
    setTotpStep(null);
    setTotpCode("");
    setStatus(null);
    try {
      await supabase.auth.signOut();
    } catch {
      // Best-effort. Even if signOut fails, the next page load
      // will see aal=1 and re-prompt for TOTP because the user has
      // a verified factor.
    }
  }, []);

  const sendResetPasswordEmail = useCallback(async () => {
    if (disabled) return;
    setBusy(true);
    setStatus(null);

    try {
      const clean = cleanEmail();
      if (!clean || !clean.includes("@")) {
        setStatus("Vui lòng nhập email hợp lệ.\nPlease enter a valid email.");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(clean, {
        redirectTo: redirectToRecovery,
      });
      if (error) throw error;

      setStatus(
        "✅ Đã gửi email đặt lại mật khẩu. Mở email và làm theo hướng dẫn.\nPassword reset email sent. Open your email and follow the link.",
      );
    } catch (e) {
      setStatus(humanizeAuthError(e, mode));
    } finally {
      setBusy(false);
    }
  }, [cleanEmail, disabled, mode, redirectToRecovery]);

  const showPasswordField = mode === "password_signin";

  const primaryActionLabel =
    mode === "password_signin"
      ? "Đăng nhập · Sign in"
      : mode === "code_email"
        ? "Gửi mã · Send code"
        : "Gửi email đặt lại · Send reset email";

  const onPrimary = useCallback(() => {
    if (disabled) return;
    if (mode === "password_signin") void signInWithPassword();
    else if (mode === "code_email") void sendEmailCode();
    else void sendResetPasswordEmail();
  }, [
    disabled,
    mode,
    sendEmailCode,
    sendResetPasswordEmail,
    signInWithPassword,
  ]);

  // 2FA Phase 1 — when the password / OTP step succeeded but a TOTP
  // factor is enrolled, render ONLY the code-entry step. Hide the
  // primary form so a confused user can't accidentally re-submit while
  // we're holding their session at aal=1.
  if (totpStep) {
    return (
      <div style={UI.block} data-testid="email-block-totp-step">
        <h3
          style={{
            fontSize: 16,
            fontWeight: 800,
            margin: "0 0 6px",
            color: "rgba(10,10,10,0.92)",
          }}
        >
          Nhập mã 2FA
          <span
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 500,
              color: "rgba(0,0,0,0.55)",
              marginTop: 2,
            }}
          >
            Enter your 2FA code
          </span>
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "rgba(0,0,0,0.62)",
            lineHeight: 1.5,
            margin: "8px 0 14px",
          }}
        >
          Mở ứng dụng xác thực và nhập mã 6 số hiện đang hiển thị.
          <br />
          <span style={{ color: "rgba(0,0,0,0.45)" }}>
            Open your authenticator app and enter the 6-digit code currently shown.
          </span>
        </p>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          maxLength={6}
          value={totpCode}
          onChange={(e) => {
            const next = e.target.value.replace(/\D/g, "").slice(0, 6);
            setTotpCode(next);
            if (status) setStatus(null);
          }}
          placeholder="123456"
          aria-label="6-digit code from your authenticator app"
          data-testid="signin-totp-input"
          className={AUTH_FOCUS_RING}
          disabled={totpVerifying}
          style={{
            width: "100%",
            padding: "12px 14px",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 4,
            textAlign: "center",
            borderRadius: 10,
            border: "1px solid #cbd5e1",
            outline: "none",
            fontVariantNumeric: "tabular-nums",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          }}
        />

        {status ? (
          <div
            ref={statusRef}
            role="alert"
            style={{
              marginTop: 12,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #fecaca",
              background: "#fef2f2",
              color: "#991b1b",
              fontSize: 13,
              lineHeight: 1.5,
            }}
            data-testid="signin-totp-error"
          >
            {status}
          </div>
        ) : null}

        <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => void verifyTotpStep()}
            disabled={totpVerifying || totpCode.length !== 6}
            data-testid="signin-totp-submit"
            style={{
              background: "#111827",
              color: "white",
              borderRadius: 9999,
              minHeight: 44,
              padding: "0 22px",
              fontWeight: 700,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
              opacity: totpVerifying || totpCode.length !== 6 ? 0.6 : 1,
            }}
          >
            {totpVerifying
              ? "Đang xác minh… · Verifying…"
              : "Xác nhận · Verify"}
          </button>
          <button
            type="button"
            onClick={() => void cancelTotpStep()}
            disabled={totpVerifying}
            data-testid="signin-totp-cancel"
            style={{
              background: "white",
              color: "#475569",
              borderRadius: 9999,
              minHeight: 44,
              padding: "0 18px",
              fontWeight: 700,
              fontSize: 13,
              border: "1px solid rgba(0,0,0,0.12)",
              cursor: "pointer",
            }}
          >
            Hủy đăng nhập · Cancel sign-in
          </button>
        </div>
      </div>
    );
  }

  // Code-first email flow — code entry step.
  if (mode === "code_email" && codeStep === "code") {
    return (
      <div style={UI.block} data-testid="email-block-code-step">
        <h3
          style={{
            fontSize: 16,
            fontWeight: 800,
            margin: "0 0 6px",
            color: "rgba(10,10,10,0.92)",
          }}
        >
          Nhập mã 6 chữ số
          <span
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 500,
              color: "rgba(0,0,0,0.55)",
              marginTop: 2,
            }}
          >
            Enter the 6-digit code
          </span>
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "rgba(0,0,0,0.62)",
            lineHeight: 1.5,
            margin: "8px 0 14px",
          }}
        >
          Mã đã được gửi tới <b>{codeEmail}</b>. Mở email và nhập 6 chữ số vào
          ô bên dưới.
          <br />
          <span style={{ color: "rgba(0,0,0,0.45)" }}>
            Code sent to <b>{codeEmail}</b>. Open your email and enter the 6
            digits below.
          </span>
        </p>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          maxLength={6}
          value={otpCode}
          onChange={(e) => {
            const next = e.target.value.replace(/\D/g, "").slice(0, 6);
            setOtpCode(next);
            if (status) setStatus(null);
          }}
          placeholder="123456"
          aria-label="6-digit code from your email"
          data-testid="signin-email-otp-input"
          className={AUTH_FOCUS_RING}
          disabled={otpVerifying || disabled}
          style={{
            width: "100%",
            padding: "12px 14px",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 4,
            textAlign: "center",
            borderRadius: 10,
            border: "1px solid #cbd5e1",
            outline: "none",
            fontVariantNumeric: "tabular-nums",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          }}
        />

        {status ? (
          <div
            ref={statusRef}
            role="alert"
            data-testid="signin-email-otp-status"
            style={UI.status}
          >
            {status}
          </div>
        ) : null}

        <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => void verifyEmailCode()}
            disabled={otpVerifying || disabled || otpCode.length !== 6}
            data-testid="signin-email-otp-submit"
            style={{
              background: "#111827",
              color: "white",
              borderRadius: 9999,
              minHeight: 44,
              padding: "0 22px",
              fontWeight: 700,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
              opacity:
                otpVerifying || disabled || otpCode.length !== 6 ? 0.6 : 1,
            }}
          >
            {otpVerifying
              ? "Đang xác minh… · Verifying…"
              : "Xác nhận · Verify"}
          </button>
          <button
            type="button"
            onClick={() => void resendEmailCode()}
            disabled={otpVerifying || disabled}
            data-testid="signin-email-otp-resend"
            style={{
              background: "white",
              color: "#1e3a8a",
              borderRadius: 9999,
              minHeight: 44,
              padding: "0 18px",
              fontWeight: 700,
              fontSize: 13,
              border: "1px solid rgba(0,0,0,0.12)",
              cursor: "pointer",
            }}
          >
            Gửi lại mã · Resend code
          </button>
          <button
            type="button"
            onClick={cancelCodeStep}
            disabled={otpVerifying}
            data-testid="signin-email-otp-cancel"
            style={{
              background: "white",
              color: "#475569",
              borderRadius: 9999,
              minHeight: 44,
              padding: "0 18px",
              fontWeight: 700,
              fontSize: 13,
              border: "1px solid rgba(0,0,0,0.12)",
              cursor: "pointer",
            }}
          >
            Đổi email · Change email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={UI.block}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => {
            setMode("code_email");
            setCodeStep("email");
          }}
          disabled={disabled}
          style={UI.segBtn(mode === "code_email", disabled)}
          data-testid="signin-mode-code-email"
        >
          Mã qua email · Email code
        </button>
        <button
          type="button"
          onClick={() => setMode("password_signin")}
          disabled={disabled}
          style={UI.segBtn(mode === "password_signin", disabled)}
        >
          Đăng nhập · Sign in
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={UI.label}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          aria-label="Email"
          autoComplete="email"
          data-clarity-mask="true"
          className={AUTH_FOCUS_RING}
          style={UI.input(disabled)}
          disabled={disabled}
        />
      </div>

      {showPasswordField && (
        <div style={{ marginTop: 12 }}>
          <label style={UI.label}>Mật khẩu · Password</label>
          <div
            className={AUTH_FOCUS_RING_WITHIN}
            style={{
              position: "relative",
              width: "100%",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.14)",
              background: "white",
              overflow: "hidden",
              opacity: disabled ? 0.7 : 1,
            }}
          >
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              aria-label="Mật khẩu · Password"
              // Clarity auto-masks type=password, but this field flips
              // to type=text on "show password" — mask explicitly so it
              // never leaks in that state.
              data-clarity-mask="true"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              disabled={disabled}
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
              disabled={disabled}
              aria-label={showPw ? "Hide password" : "Show password"}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                width: 36,
                height: 36,
                border: "none",
                background: "transparent",
                cursor: disabled ? "not-allowed" : "pointer",
              }}
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
          <div style={{ marginTop: 8, ...UI.small }}>
            Tối thiểu 6 ký tự. · Minimum 6 characters.
          </div>
          <div style={{ marginTop: 8, ...UI.small }}>
            <button
              type="button"
              onClick={() => setMode("reset")}
              disabled={disabled}
              style={UI.linkBtn(disabled)}
            >
              Quên mật khẩu? · Forgot password?
            </button>
          </div>
        </div>
      )}

      {mode === "code_email" && (
        <div style={{ marginTop: 12, ...UI.small }}>
          Chúng tôi sẽ gửi một mã 6 chữ số tới email của bạn. Bạn nhập mã ngay
          tại trang này — không cần bấm vào link trong email.
          <br />
          <span style={{ color: "rgba(0,0,0,0.45)" }}>
            We&apos;ll email you a 6-digit code. Type it in here — you don&apos;t
            need to click the link in the email.
          </span>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <button type="button" onClick={onPrimary} disabled={disabled} style={UI.primaryBtn(disabled)}>
          {disabled ? "Đang xử lý… · Please wait..." : primaryActionLabel}
        </button>
      </div>

      <div style={{ marginTop: 10, ...UI.small }}>
        {/* On password_signin we omit a "create an account" cross-link.
            The page-level heading already says
            "Đăng nhập hoặc tạo tài khoản · Sign in or create account"
            and the Email-code tab is right above this body, so a third
            CTA pointing at the same flow is redundant noise. We keep
            the reverse link below (code_email → password_signin) since
            "I already have a password" is a less obvious affordance. */}
        {mode === "code_email" ? (
          <>
            Đã có tài khoản? · Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("password_signin")}
              disabled={disabled}
              style={UI.linkBtn(disabled)}
            >
              Đăng nhập bằng mật khẩu · Sign in with password
            </button>
            .
          </>
        ) : null}
      </div>

      {status && <div ref={statusRef} style={UI.status}>{status}</div>}
    </div>
  );
}
