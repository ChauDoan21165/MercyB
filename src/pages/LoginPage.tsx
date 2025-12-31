// src/pages/LoginPage.tsx
// MB-BLUE-100.9 — 2025-12-31 (+0700)
//
// LOGIN (REAL):
// - Keeps existing Magic Link flow (signInWithOtp) ✅
// - Keeps GitHub OAuth button ✅ (still requires provider configured in Supabase)
// - Adds REAL Email+Password sign-in + sign-up + reset password ✅
// - Redirect target remains: `${origin}/admin`
//
// FIX (100.9):
// - Add 👁 show/hide toggle so users can see password while typing.
//
// NOTE:
// - To use password auth, enable Email provider + Password in Supabase Auth settings.

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

type Mode = "password_signin" | "password_signup" | "magic" | "reset";

export default function LoginPage() {
  const nav = useNavigate();

  const [mode, setMode] = useState<Mode>("password_signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Eye toggle (only affects password input UI)
  const [showPw, setShowPw] = useState(false);

  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const redirectTo = useMemo(() => {
    // after login, go to /admin
    // must match current origin (8080/8081 etc.)
    return `${window.location.origin}/admin`;
  }, []);

  const cleanEmail = () => email.trim().toLowerCase();

  async function sendMagicLink() {
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
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        setStatus(error.message);
        return;
      }

      setStatus("✅ Magic link sent. Open your email and click the link.");
    } catch (e: any) {
      setStatus(e?.message || "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  async function signInWithPassword() {
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

      if (error) {
        setStatus(error.message);
        return;
      }

      // session is set; go admin
      nav("/admin");
    } catch (e: any) {
      setStatus(e?.message || "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  async function signUpWithPassword() {
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
        options: {
          // if email confirmations are enabled, user must confirm
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        setStatus(error.message);
        return;
      }

      // If confirmations enabled, session may be null until confirmed
      if (!data.session) {
        setStatus("✅ Account created. Please check your email to confirm, then sign in.");
        return;
      }

      nav("/admin");
    } catch (e: any) {
      setStatus(e?.message || "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  async function sendResetPasswordEmail() {
    setBusy(true);
    setStatus(null);
    try {
      const clean = cleanEmail();
      if (!clean || !clean.includes("@")) {
        setStatus("Please enter a valid email.");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(clean, {
        redirectTo,
      });

      if (error) {
        setStatus(error.message);
        return;
      }

      setStatus("✅ Password reset email sent. Open your email and follow the link.");
    } catch (e: any) {
      setStatus(e?.message || "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  async function signInGithub() {
    setBusy(true);
    setStatus(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo,
        },
      });
      if (error) setStatus(error.message);
    } catch (e: any) {
      setStatus(e?.message || "Unknown error");
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
      ? "Send magic link"
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
    <div style={{ padding: 24, maxWidth: 520 }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>
        {mode === "password_signup"
          ? "Create account"
          : mode === "reset"
          ? "Reset password"
          : "Sign in"}
      </h1>

      <p style={{ marginTop: 0, opacity: 0.8 }}>Admin requires a logged-in session.</p>

      {/* MODE TABS */}
      <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={() => setMode("password_signin")}
          disabled={busy}
          style={{
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: mode === "password_signin" ? "rgba(0,0,0,0.06)" : "white",
            cursor: busy ? "not-allowed" : "pointer",
            fontWeight: 700,
          }}
        >
          Password sign-in
        </button>

        <button
          onClick={() => setMode("password_signup")}
          disabled={busy}
          style={{
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: mode === "password_signup" ? "rgba(0,0,0,0.06)" : "white",
            cursor: busy ? "not-allowed" : "pointer",
            fontWeight: 700,
          }}
        >
          Sign up
        </button>

        <button
          onClick={() => setMode("magic")}
          disabled={busy}
          style={{
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: mode === "magic" ? "rgba(0,0,0,0.06)" : "white",
            cursor: busy ? "not-allowed" : "pointer",
            fontWeight: 700,
          }}
        >
          Magic link
        </button>

        <button
          onClick={() => setMode("reset")}
          disabled={busy}
          style={{
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: mode === "reset" ? "rgba(0,0,0,0.06)" : "white",
            cursor: busy ? "not-allowed" : "pointer",
            fontWeight: 700,
          }}
        >
          Forgot password
        </button>
      </div>

      {/* EMAIL */}
      <div style={{ marginTop: 18 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          autoComplete="email"
          style={{
            width: "100%",
            padding: 10,
            fontSize: 16,
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        />
      </div>

      {/* PASSWORD */}
      {showPasswordField && (
        <div style={{ marginTop: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Password</label>

          {/* ✅ input + eye toggle */}
          <div style={{ position: "relative" }}>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type={showPw ? "text" : "password"}
              autoComplete={mode === "password_signup" ? "new-password" : "current-password"}
              style={{
                width: "100%",
                padding: "10px 44px 10px 10px",
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: 8,
              }}
            />

            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
              disabled={busy}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: busy ? "not-allowed" : "pointer",
                fontSize: 16,
                opacity: 0.75,
                padding: 6,
                lineHeight: 1,
              }}
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>

          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
            Minimum 6 characters.
          </div>
        </div>
      )}

      {/* PRIMARY ACTION */}
      <div style={{ marginTop: 14 }}>
        <button
          onClick={onPrimary}
          disabled={busy}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: busy ? "not-allowed" : "pointer",
            fontWeight: 800,
          }}
        >
          {busy ? "Please wait..." : primaryActionLabel}
        </button>
      </div>

      {/* OAUTH */}
      <div style={{ marginTop: 18 }}>
        <button
          onClick={signInGithub}
          disabled={busy}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: busy ? "not-allowed" : "pointer",
          }}
        >
          {busy ? "Please wait..." : "Sign in with GitHub"}
        </button>
        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
          If this errors, GitHub provider isn’t configured in Supabase (Client ID/Secret missing).
        </div>
      </div>

      {status && <p style={{ marginTop: 14, whiteSpace: "pre-wrap" }}>{status}</p>}

      <div style={{ marginTop: 22 }}>
        <button
          onClick={() => nav("/")}
          style={{
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        >
          Back to home
        </button>
      </div>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.65 }}>
        Redirect target: <code>{redirectTo}</code>
      </div>
    </div>
  );
}

/* New thing to learn:
   Password visibility toggles are best done by switching input type between
   "password" and "text" while keeping the value controlled. */
