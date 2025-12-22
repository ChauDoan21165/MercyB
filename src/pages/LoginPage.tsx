// src/pages/LoginPage.tsx — v2025-12-22-87.2-LOGIN-PAGE-MAGICLINK
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const redirectTo = useMemo(() => {
    // after login, go to /admin
    // must match current origin (8080/8081 etc.)
    return `${window.location.origin}/admin`;
  }, []);

  async function sendMagicLink() {
    setBusy(true);
    setStatus(null);
    try {
      const clean = email.trim().toLowerCase();
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

  return (
    <div style={{ padding: 24, maxWidth: 520 }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Sign in</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Admin requires a logged-in session.
      </p>

      <div style={{ marginTop: 18 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          style={{
            width: "100%",
            padding: 10,
            fontSize: 16,
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        />
        <button
          onClick={sendMagicLink}
          disabled={busy}
          style={{
            marginTop: 10,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: busy ? "not-allowed" : "pointer",
          }}
        >
          {busy ? "Sending..." : "Send magic link"}
        </button>
      </div>

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
      </div>

      {status && (
        <p style={{ marginTop: 14, whiteSpace: "pre-wrap" }}>{status}</p>
      )}

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
    </div>
  );
}
