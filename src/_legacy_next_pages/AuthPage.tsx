/**
 * MercyBlade Blue — AuthPage (Legacy)
 * File: src/_legacy_next_pages/AuthPage.tsx
 * Version: MB-BLUE-93.7 — 2025-12-23 (+0700)
 *
 * PURPOSE:
 * - Email/password login + register UI
 * - Redirects user after successful auth
 */

import { useState } from "react";
import type React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signInWithEmail, signUpWithEmail } from "@/lib/authService";

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // where to go after login
  const redirectTo =
    (location.state as any)?.from ?? "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (mode === "register") {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }

      // ✅ redirect after successful auth
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <h1>{mode === "login" ? "Đăng nhập" : "Đăng ký"}</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Mật khẩu
          <input
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode((m) => (m === "login" ? "register" : "login"))}
      >
        {mode === "login" ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
      </button>
    </div>
  );
}
