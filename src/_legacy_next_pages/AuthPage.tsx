import { useState } from "react";
import {
  signInWithEmail,
  signUpWithEmail,
} from "@/lib/authService"; // adjust path

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (mode === "register") {
        await signUpWithEmail(email, password);
        // If you use email confirmation:
        // alert("Check your email to confirm your account");
        // If not using confirmation, you may redirect to / after sign up
        console.log("User registered");
      } else {
        await signInWithEmail(email, password);
        console.log("User logged in");
        // redirect user, e.g. navigate("/hub");
      }
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
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <button type="submit" disabled={loading}>
          {loading
            ? "Đang xử lý..."
            : mode === "login"
            ? "Đăng nhập"
            : "Tạo tài khoản"}
        </button>
      </form>

      <button
        type="button"
        onClick={() =>
          setMode((m) => (m === "login" ? "register" : "login"))
        }
      >
        {mode === "login"
          ? "Chưa có tài khoản? Đăng ký"
          : "Đã có tài khoản? Đăng nhập"}
      </button>
    </div>
  );
}
