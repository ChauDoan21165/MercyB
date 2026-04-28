/**
 * Path: src/pages/auth/RecoverWith2FA.tsx
 *
 * Route: /auth/recover
 *
 * The "lost my phone" flow. User submits email + password + one of
 * their 8 backup codes. On success, the server invalidates the code,
 * unenrolls their verified TOTP factor (so the aal=1 session passes
 * the RLS gate), and bounces them to /account/security with a prompt
 * to re-enroll MFA.
 *
 * Recovery model rationale (per design § Decision 1):
 *   Standard practice — GitHub, Google, GitLab, Stripe, 1Password,
 *   Authy all require password + backup code for recovery. Backup
 *   codes are a SECOND-factor replacement, never a first-factor
 *   replacement. Email + backup code alone (the original brief shape)
 *   would make the backup codes a single factor and bypass 2FA
 *   entirely if the codes leak via the user's own email.
 *
 * Flow:
 *   1. Form: email + password + backup_code
 *   2. supabase.auth.signInWithPassword({email, password}) — establishes
 *      aal=1 session (or fails)
 *   3. verifyBackupCode(backup_code) — if match, server unenrolls
 *      MFA factors and clears the lockout counter
 *   4. Navigate to /account/security with a notice to re-enable MFA
 */

import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, KeyRound } from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { verifyBackupCode } from "@/lib/security/mfaClient";

const wrap: React.CSSProperties = {
  width: "100%",
  minHeight: "calc(100vh - 72px)",
  padding: "24px 16px 80px",
  display: "flex",
  justifyContent: "center",
};

const column: React.CSSProperties = {
  width: "100%",
  maxWidth: 480,
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 18,
  padding: 22,
  background: "white",
  boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
};

const headingStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 900,
  letterSpacing: -0.3,
  margin: 0,
  color: "rgba(10,10,10,0.94)",
};

const headingViStyle: React.CSSProperties = {
  display: "block",
  marginTop: 2,
  fontSize: 13,
  fontWeight: 500,
  color: "rgba(0,0,0,0.55)",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "rgba(0,0,0,0.62)",
  display: "block",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  fontSize: 15,
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  outline: "none",
  fontFamily: "inherit",
};

const codeInputStyle: React.CSSProperties = {
  ...inputStyle,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  letterSpacing: 2,
  textTransform: "uppercase",
};

const primaryBtn: React.CSSProperties = {
  background: "#111827",
  color: "white",
  borderRadius: 9999,
  minHeight: 44,
  padding: "0 22px",
  fontWeight: 700,
  fontSize: 14,
  border: "none",
  cursor: "pointer",
};

const errorBox: React.CSSProperties = {
  marginTop: 14,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #fecaca",
  background: "#fef2f2",
  color: "#991b1b",
  fontSize: 13,
  lineHeight: 1.5,
};

type Step = "form" | "verifying" | "done";

export default function RecoverWith2FA(): React.ReactElement {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [errorBilingual, setErrorBilingual] =
    useState<{ en: string; vi: string } | null>(null);

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "verifying") return;

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;
    const cleanCode = code.trim();

    if (!cleanEmail || !cleanPassword || !cleanCode) {
      setErrorBilingual({
        en: "Email, password, and a backup code are all required.",
        vi: "Email, mật khẩu và một mã dự phòng đều bắt buộc.",
      });
      return;
    }

    setStep("verifying");
    setErrorBilingual(null);

    try {
      // Step 1: password sign-in. Establishes aal=1 session.
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });
      if (signInError) {
        setErrorBilingual({
          en: "Email or password didn't match.",
          vi: "Email hoặc mật khẩu không đúng.",
        });
        setStep("form");
        return;
      }

      // Step 2: verify backup code. On success the server unenrolls
      // the TOTP factor so the aal=1 session passes the RLS gate.
      try {
        await verifyBackupCode(cleanCode);
      } catch (err) {
        // Inspect error for known cases.
        const msg = err instanceof Error ? err.message : String(err);
        if (msg === "locked_out") {
          setErrorBilingual({
            en: "Account temporarily locked due to too many failed attempts. Try again later.",
            vi: "Tài khoản tạm khoá do nhập sai nhiều lần. Vui lòng thử lại sau.",
          });
        } else if (msg === "invalid_format") {
          setErrorBilingual({
            en: "Backup codes look like XXXX-XXXX (8 letters/numbers).",
            vi: "Mã dự phòng có dạng XXXX-XXXX (8 chữ cái/số).",
          });
        } else if (msg === "invalid_code") {
          setErrorBilingual({
            en: "That backup code didn't match. Each code is single-use — make sure you haven't used it before.",
            vi: "Mã dự phòng không đúng. Mỗi mã chỉ dùng được một lần — kiểm tra xem bạn đã dùng chưa.",
          });
        } else {
          setErrorBilingual({
            en: "Recovery failed. Please try again or contact admin@mercyblade.com.",
            vi: "Khôi phục không thành công. Vui lòng thử lại hoặc liên hệ admin@mercyblade.com.",
          });
        }
        // Sign back out so the failed-recovery session doesn't sit at
        // aal=1 with no MFA factor (which would defeat the gate).
        await supabase.auth.signOut().catch(() => undefined);
        setStep("form");
        return;
      }

      // Success. The user is signed in at aal=1, MFA is now disabled
      // server-side, and they can reach /account/security to re-enroll.
      setStep("done");
      // Tiny delay so they see the success state before redirect.
      window.setTimeout(() => {
        navigate("/account/security?recovery=1", { replace: true });
      }, 1200);
    } catch (err) {
      setErrorBilingual({
        en: "Something went wrong. Please try again.",
        vi: "Có lỗi xảy ra. Vui lòng thử lại.",
      });
      // Best-effort sign-out on unexpected errors.
      await supabase.auth.signOut().catch(() => undefined);
      setStep("form");
    }
  }, [email, password, code, step, navigate]);

  if (step === "done") {
    return (
      <div style={wrap}>
        <div style={column}>
          <section style={cardStyle} data-testid="recover-success">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <KeyRound size={22} color="#047857" aria-hidden />
              <h1 style={headingStyle}>
                Đã khôi phục
                <span style={headingViStyle}>Recovered</span>
              </h1>
            </div>
            <p style={{ marginTop: 12, fontSize: 14, color: "rgba(0,0,0,0.72)", lineHeight: 1.55 }}>
              Đăng nhập thành công. 2FA đã tạm tắt — đang chuyển bạn đến trang Bảo mật để bật lại.
            </p>
            <p style={{ marginTop: 4, fontSize: 12, color: "rgba(0,0,0,0.50)", lineHeight: 1.5 }}>
              Signed in. 2FA has been temporarily disabled — taking you to the Security page to re-enable it.
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={column}>
        <section style={cardStyle} data-testid="recover-form-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShieldAlert size={22} color="#0369a1" aria-hidden />
            <h1 style={headingStyle}>
              Khôi phục bằng mã dự phòng
              <span style={headingViStyle}>Recover with backup code</span>
            </h1>
          </div>

          <p style={{ marginTop: 12, fontSize: 14, color: "rgba(0,0,0,0.72)", lineHeight: 1.55 }}>
            Mất điện thoại? Nhập email, mật khẩu, và một trong 8 mã dự phòng bạn đã lưu khi bật 2FA.
          </p>
          <p style={{ marginTop: 4, fontSize: 12, color: "rgba(0,0,0,0.50)", lineHeight: 1.5 }}>
            Lost your phone? Enter your email, password, and one of the 8 backup codes you saved when 2FA was enabled.
          </p>

          <form onSubmit={onSubmit} style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={labelStyle} htmlFor="recover-email">
                Email
              </label>
              <input
                id="recover-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={step === "verifying"}
                style={inputStyle}
                data-testid="recover-email-input"
                required
              />
            </div>

            <div>
              <label style={labelStyle} htmlFor="recover-password">
                Mật khẩu · Password
              </label>
              <input
                id="recover-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={step === "verifying"}
                style={inputStyle}
                data-testid="recover-password-input"
                required
              />
            </div>

            <div>
              <label style={labelStyle} htmlFor="recover-code">
                Mã dự phòng · Backup code
              </label>
              <input
                id="recover-code"
                type="text"
                inputMode="text"
                autoComplete="one-time-code"
                placeholder="XXXX-XXXX"
                maxLength={9}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={step === "verifying"}
                style={codeInputStyle}
                data-testid="recover-code-input"
                required
              />
              <p style={{ marginTop: 6, fontSize: 11, color: "rgba(0,0,0,0.50)", lineHeight: 1.4 }}>
                Mỗi mã chỉ dùng được một lần. Nếu chưa dùng, mã có dạng 4-4 ký tự nối bằng dấu gạch ngang.
                <br />
                <span style={{ color: "rgba(0,0,0,0.42)" }}>
                  Each code is single-use. Codes look like 4 chars + dash + 4 chars.
                </span>
              </p>
            </div>

            {errorBilingual ? (
              <div role="alert" style={errorBox} data-testid="recover-error">
                {errorBilingual.en}
                <span style={{ display: "block", marginTop: 2, fontSize: 12, color: "#7f1d1d" }}>
                  {errorBilingual.vi}
                </span>
              </div>
            ) : null}

            <div style={{ marginTop: 4, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="submit"
                style={{ ...primaryBtn, opacity: step === "verifying" ? 0.6 : 1 }}
                disabled={step === "verifying"}
                data-testid="recover-submit"
              >
                {step === "verifying"
                  ? "Đang xác minh… · Verifying…"
                  : "Khôi phục · Recover"}
              </button>
            </div>
          </form>

          <p style={{ marginTop: 14, fontSize: 12, color: "rgba(0,0,0,0.45)", lineHeight: 1.5 }}>
            Mất cả mã dự phòng? Liên hệ
            <a
              href="mailto:admin@mercyblade.com"
              style={{ color: "#0369a1", marginLeft: 4, fontWeight: 700 }}
            >
              admin@mercyblade.com
            </a>{" "}
            — chúng tôi sẽ xác minh danh tính và tắt 2FA cho bạn.
            <br />
            <span style={{ color: "rgba(0,0,0,0.40)" }}>
              Lost all your backup codes too? Email admin@mercyblade.com — we'll verify your identity and disable 2FA manually.
            </span>
          </p>
        </section>
      </div>
    </div>
  );
}
