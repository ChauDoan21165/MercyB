import React, { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  alreadyRegisteredStatusText,
  ensureSessionOrThrow,
  humanizeAuthError,
  type EmailMode,
} from "@/lib/authHelpers";
import { UI } from "@/components/auth/authUI";
import {
  challengeFactor,
  findFirstVerifiedTotp,
  humanizeMfaError,
  listMfaFactors,
  verifyChallenge,
} from "@/lib/security/mfaClient";

export default function EmailBlock({
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

  // 2FA Phase 1 — TOTP challenge state. After a successful password
  // step, if the user has any verified TOTP factors we hold them
  // here until they enter their 6-digit code. onAuthed() is NOT
  // called until the challenge verifies. See
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

  const sendMagicLink = useCallback(async () => {
    if (disabled) return;
    setBusy(true);
    setStatus(null);

    try {
      const clean = cleanEmail();
      if (!clean || !clean.includes("@")) {
        setStatus("Please enter a valid email.");
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: clean,
        options: {
          emailRedirectTo,
          shouldCreateUser: false,
        },
      });

      if (error) throw error;

      setStatus("✅ Email link sent. Open your email and click the link.");
    } catch (e) {
      setStatus(humanizeAuthError(e, mode));
    } finally {
      setBusy(false);
    }
  }, [cleanEmail, disabled, emailRedirectTo, mode]);

  const signInWithPassword = useCallback(async () => {
    if (disabled) return;
    setBusy(true);
    setStatus(null);

    try {
      const clean = cleanEmail();
      if (!clean || !clean.includes("@")) {
        setStatus("Please enter a valid email.");
        return;
      }
      if (!password || password.length < 6) {
        setStatus("Password must be at least 6 characters.");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: clean,
        password,
      });
      if (error) throw error;

      await ensureSessionOrThrow();

      // 2FA Phase 1 — does this user have a verified TOTP factor?
      // If yes, hold the redirect and prompt for a 6-digit code. The
      // session is already established (aal=1) but onAuthed() is the
      // post-redirect contract — we don't fire it until aal=2.
      try {
        const factors = await listMfaFactors();
        const totp = findFirstVerifiedTotp(factors);
        if (totp) {
          const { challengeId } = await challengeFactor(totp.id);
          setTotpStep({ factorId: totp.id, challengeId });
          setStatus(null);
          return; // Don't call onAuthed yet — wait for TOTP verify.
        }
      } catch (mfaErr) {
        // If the MFA list call fails we fall through to the no-MFA
        // path. The user is signed in regardless; the worst case is
        // they slip past a 2FA gate they enrolled but the API is
        // briefly unreachable. Log so we can find this in Sentry but
        // don't block sign-in on a transient API hiccup.
        if (import.meta.env.DEV) {
          console.warn("[mfa] listFactors failed during sign-in:", mfaErr);
        }
      }

      setStatus("✅ Signed in. Redirecting...");
      await onAuthed();
    } catch (e) {
      setStatus(humanizeAuthError(e, mode));
    } finally {
      setBusy(false);
    }
  }, [cleanEmail, disabled, mode, onAuthed, password]);

  // 2FA Phase 1 — TOTP challenge submit handler. Called from the
  // separate code-entry UI rendered below when totpStep is non-null.
  const verifyTotpStep = useCallback(async () => {
    if (!totpStep) return;
    if (!/^\d{6}$/.test(totpCode)) {
      setStatus("Enter the 6-digit code from your authenticator app.");
      return;
    }
    setTotpVerifying(true);
    setStatus(null);
    try {
      await verifyChallenge(totpStep.factorId, totpStep.challengeId, totpCode);
      // Success — session is now aal=2. Hand off to onAuthed().
      setStatus("✅ Signed in. Redirecting...");
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

  const signUpWithMagicLink = useCallback(async () => {
    if (disabled) return;
    setBusy(true);
    setStatus(null);

    try {
      const clean = cleanEmail();
      if (!clean || !clean.includes("@")) {
        setStatus("Please enter a valid email.");
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: clean,
        options: {
          emailRedirectTo,
          shouldCreateUser: true,
        },
      });

      if (error) throw error;

      const createdMsg =
        "✅ Check your email to create your account.\n\nWe sent you a sign-in link. Your Mercy account will only become usable after you open that email and click the link.";

      setStatus(createdMsg);
      onSignupCreated(clean, createdMsg);
    } catch (e) {
      setStatus(humanizeAuthError(e, mode));
    } finally {
      setBusy(false);
    }
  }, [cleanEmail, disabled, emailRedirectTo, mode, onSignupCreated]);

  const sendResetPasswordEmail = useCallback(async () => {
    if (disabled) return;
    setBusy(true);
    setStatus(null);

    try {
      const clean = cleanEmail();
      if (!clean || !clean.includes("@")) {
        setStatus("Please enter a valid email.");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(clean, {
        redirectTo: redirectToRecovery,
      });
      if (error) throw error;

      setStatus("✅ Password reset email sent.\n\nOpen your email and follow the link.");
    } catch (e) {
      setStatus(humanizeAuthError(e, mode));
    } finally {
      setBusy(false);
    }
  }, [cleanEmail, disabled, mode, redirectToRecovery]);

  const showPasswordField = mode === "password_signin";

  const primaryActionLabel =
    mode === "password_signin"
      ? "Sign in"
      : mode === "password_signup"
        ? "Create account with email link"
        : mode === "magic"
          ? "Send email link"
          : "Send reset email";

  const onPrimary = useCallback(() => {
    if (disabled) return;
    if (mode === "password_signin") void signInWithPassword();
    else if (mode === "password_signup") void signUpWithMagicLink();
    else if (mode === "magic") void sendMagicLink();
    else void sendResetPasswordEmail();
  }, [
    disabled,
    mode,
    sendMagicLink,
    sendResetPasswordEmail,
    signInWithPassword,
    signUpWithMagicLink,
  ]);

  // 2FA Phase 1 — when the password step succeeded but a TOTP factor
  // is enrolled, render ONLY the code-entry step. Hide the email/
  // password form so a confused user can't accidentally re-submit
  // their password while we're holding their session at aal=1.
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

  return (
    <div style={UI.block}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => setMode("password_signin")}
          disabled={disabled}
          style={UI.segBtn(mode === "password_signin", disabled)}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("password_signup")}
          disabled={disabled}
          style={UI.segBtn(mode === "password_signup", disabled)}
        >
          Sign up
        </button>
        <button
          type="button"
          onClick={() => setMode("reset")}
          disabled={disabled}
          style={UI.segBtn(mode === "reset", disabled)}
        >
          Forgot password
        </button>
        <button
          type="button"
          onClick={() => setMode("magic")}
          disabled={disabled}
          style={UI.segBtn(mode === "magic", disabled)}
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
            }}
          >
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
          <div style={{ marginTop: 8, ...UI.small }}>Minimum 6 characters.</div>
        </div>
      )}

      {mode === "password_signup" && (
        <div style={{ marginTop: 12, ...UI.small }}>
          New accounts use a verification email link. We only let the account become active after the link in the real inbox is clicked.
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <button type="button" onClick={onPrimary} disabled={disabled} style={UI.primaryBtn(disabled)}>
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

      {status && <div ref={statusRef} style={UI.status}>{status}</div>}
    </div>
  );
}