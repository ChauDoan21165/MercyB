// src/pages/AdminLogin.tsx
/**
 * MercyBlade Blue Launch Map — v83.5 (AUTHORITATIVE)
 * Generated: 2025-12-22 (+0700)
 * Reporter: teacher GPT
 *
 * PURPOSE:
 * Minimal admin login page to create a Supabase session.
 * No styling work. No extra logic.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onLogin = async () => {
    setLoading(true);
    setMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setMsg(error.message);
        return;
      }

      if (!data?.session) {
        setMsg("Login succeeded but no session returned.");
        return;
      }

      setMsg("✅ Logged in. Redirecting to /admin ...");
      setTimeout(() => nav("/admin"), 300);
    } catch (e: any) {
      setMsg(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 520 }}>
      <h1 style={{ fontSize: 36, marginBottom: 8 }}>Admin Login</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Sign in to create a Supabase session, then open <code>/admin</code>.
      </p>

      <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
        <label>
          Email
          <input
            style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            autoComplete="current-password"
          />
        </label>

        <button onClick={onLogin} disabled={loading} style={{ padding: 10 }}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {msg ? <div style={{ marginTop: 8 }}>{msg}</div> : null}
      </div>
    </div>
  );
}
