import React, { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  alreadyRegisteredStatusText,
  ensureSessionOrThrow,
  humanizeAuthError,
  isUserAlreadyRegisteredError,
  type EmailMode,
} from "@/lib/authHelpers";
import { UI } from "@/components/auth/authUI";

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
        options: { emailRedirectTo },
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
      setStatus("✅ Signed in. Redirecting...");
      await onAuthed();
    } catch (e) {
      setStatus(humanizeAuthError(e, mode));
    } finally {
      setBusy(false);
    }
  }, [cleanEmail, disabled, mode, onAuthed, password]);

  const signUpWithPassword = useCallback(async () => {
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

      const { data, error } = await supabase.auth.signUp({
        email: clean,
        password,
        options: { emailRedirectTo },
      });

      if (error) {
        if (isUserAlreadyRegisteredError(error)) {
          setStatus(alreadyRegisteredStatusText());
          return;
        }
        throw error;
      }

      if (!data?.session) {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: clean,
          password,
        });

        if (signInErr) {
          const m = String(signInErr?.message ?? "").toLowerCase();

          if (m.includes("email not confirmed")) {
            const createdMsg =
              "✅ Account created.\n\nPlease check your email to confirm, then sign in.";
            setStatus(createdMsg);
            onSignupCreated(clean, createdMsg);
            return;
          }

          if (m.includes("invalid login credentials")) {
            setStatus(alreadyRegisteredStatusText());
            return;
          }

          const createdMsg =
            "✅ Signup request received.\n\nIf you already have an account, switch to Sign in.\nOtherwise, check your email.";
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
    } catch (e) {
      if (isUserAlreadyRegisteredError(e)) {
        setStatus(alreadyRegisteredStatusText());
        return;
      }
      setStatus(humanizeAuthError(e, mode));
    } finally {
      setBusy(false);
    }
  }, [cleanEmail, disabled, emailRedirectTo, mode, onAuthed, onSignupCreated, password]);

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

  const showPasswordField =
    mode === "password_signin" || mode === "password_signup";

  const primaryActionLabel =
    mode === "password_signin"
      ? "Sign in"
      : mode === "password_signup"
        ? "Create account"
        : mode === "magic"
          ? "Send email link"
          : "Send reset email";

  const onPrimary = useCallback(() => {
    if (disabled) return;
    if (mode === "password_signin") void signInWithPassword();
    else if (mode === "password_signup") void signUpWithPassword();
    else if (mode === "magic") void sendMagicLink();
    else void sendResetPasswordEmail();
  }, [
    disabled,
    mode,
    sendMagicLink,
    sendResetPasswordEmail,
    signInWithPassword,
    signUpWithPassword,
  ]);

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
              autoComplete={mode === "password_signup" ? "new-password" : "current-password"}
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