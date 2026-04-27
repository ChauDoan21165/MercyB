/**
 * Path: src/pages/auth/Enable2FA.tsx
 *
 * Route: /auth/security
 *
 * 3-step enrollment:
 *   1. Show QR code + manual-entry secret. User scans into their
 *      authenticator app of choice (Authy, Google Authenticator,
 *      1Password, Bitwarden — all support TOTP).
 *   2. User enters the 6-digit code from the app to verify.
 *   3. Success — return to /account/security.
 *
 * Phase 1 does NOT generate backup codes. The brief
 * (reports/2fa-design-decisions-2026-04-27.md § Decision 5)
 * intentionally splits backup codes into Phase 2. Until that ships,
 * a paid user who loses their phone needs support intervention to
 * disable MFA from the Supabase dashboard. Acceptable while we have
 * ~100 users.
 *
 * Email notification: on successful verify we POST to
 * /functions/v1/send-security-email with kind=`security_2fa_enabled`.
 * Failure is non-blocking — the user is enrolled either way; the
 * email is a confirmation aid, not a security boundary.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";
import { useUserAccess } from "@/hooks/useUserAccess";
import { supabase } from "@/lib/supabaseClient";
import {
  cancelEnrollment,
  enrollTotp,
  humanizeMfaError,
  verifyEnrollment,
  type EnrollResult,
} from "@/lib/security/mfaClient";

const wrap: React.CSSProperties = {
  width: "100%",
  minHeight: "calc(100vh - 72px)",
  padding: "24px 16px 80px",
  display: "flex",
  justifyContent: "center",
};

const column: React.CSSProperties = {
  width: "100%",
  maxWidth: 560,
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
  fontSize: 22,
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

const subheadingStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  margin: "0 0 6px",
  color: "rgba(0,0,0,0.78)",
};

const bodyStyle: React.CSSProperties = {
  fontSize: 14,
  color: "rgba(0,0,0,0.72)",
  lineHeight: 1.55,
  margin: "0 0 4px",
};

const bodyViStyle: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(0,0,0,0.50)",
  lineHeight: 1.5,
  margin: 0,
};

const qrWrap: React.CSSProperties = {
  marginTop: 14,
  padding: 14,
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 14,
  background: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 10,
};

const secretBoxStyle: React.CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  fontSize: 13,
  letterSpacing: 1,
  padding: "8px 10px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  color: "#0f172a",
  wordBreak: "break-all",
  textAlign: "center",
  width: "100%",
};

const codeInputStyle: React.CSSProperties = {
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

const ghostBtn: React.CSSProperties = {
  background: "white",
  color: "#475569",
  borderRadius: 9999,
  minHeight: 44,
  padding: "0 18px",
  fontWeight: 700,
  fontSize: 13,
  border: "1px solid rgba(0,0,0,0.12)",
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

const successBox: React.CSSProperties = {
  marginTop: 14,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #bbf7d0",
  background: "#ecfdf5",
  color: "#065f46",
  fontSize: 13,
  lineHeight: 1.5,
};

type Step = "loading" | "ineligible" | "show_qr" | "verifying" | "done";

async function notifySecurityEmail(kind: "security_2fa_enabled" | "security_2fa_disabled"): Promise<void> {
  // Fire-and-forget: the email is a confirmation aid. If the edge
  // function is misconfigured or briefly down, the user is still
  // enrolled — they just don't get the email. Log to console in
  // dev so we notice if it's broken locally.
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const jwt = sessionData?.session?.access_token;
    if (!jwt) return;

    const supabaseUrl = String(import.meta.env.VITE_SUPABASE_URL ?? "").replace(/\/$/, "");
    if (!supabaseUrl) return;

    await fetch(`${supabaseUrl}/functions/v1/send-security-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ kind }),
    });
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[mfa] security email send failed:", err);
    }
  }
}

export default function Enable2FA() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const access = useUserAccess();

  const [step, setStep] = useState<Step>("loading");
  const [enroll, setEnroll] = useState<EnrollResult | null>(null);
  const [code, setCode] = useState("");
  const [errorBilingual, setErrorBilingual] =
    useState<{ en: string; vi: string } | null>(null);

  // Track which factor we created so we can clean it up on unmount
  // (see the abort effect at the bottom of this component). A ref so
  // it's not re-read by the cleanup once state has settled.
  const pendingFactorIdRef = useRef<string | null>(null);

  // Step 1: when we have a paid user, kick off enrollment. We do this
  // inside the page (not a button) so the QR is the first thing the
  // user sees — no extra "begin" tap.
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      // RequireAuth wrapper redirects; this branch is just a guard
      // against a render-without-user race.
      return;
    }
    const isPaid = access.hasPremium || access.isHighAdmin;
    if (!isPaid) {
      setStep("ineligible");
      return;
    }
    if (step !== "loading") return;

    let alive = true;
    (async () => {
      try {
        const result = await enrollTotp("MercyBlade");
        if (!alive) {
          // User left the page mid-enroll — clean up the unverified factor.
          await cancelEnrollment(result.factorId).catch(() => undefined);
          return;
        }
        pendingFactorIdRef.current = result.factorId;
        setEnroll(result);
        setStep("show_qr");
      } catch (err) {
        if (!alive) return;
        setErrorBilingual(humanizeMfaError(err));
        setStep("ineligible"); // best fallback — hide the form, show the error
      }
    })();

    return () => {
      alive = false;
    };
  }, [authLoading, user, access.hasPremium, access.isHighAdmin, step]);

  // Cleanup on unmount: if the user navigates away without verifying,
  // unenroll the unverified factor so it doesn't sit forever in their
  // factor list.
  useEffect(() => {
    return () => {
      const pendingId = pendingFactorIdRef.current;
      if (!pendingId) return;
      // Only fire if we never advanced to "done" — once verified, the
      // factor is the user's MFA, not garbage to clean up.
      if (step !== "done") {
        void cancelEnrollment(pendingId).catch(() => undefined);
      }
    };
    // We deliberately don't include `step` in the dep array — the
    // cleanup runs on unmount only, reading the latest step via the
    // closure at unmount time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitCode = useCallback(async () => {
    if (!enroll) return;
    if (!/^\d{6}$/.test(code)) {
      setErrorBilingual({
        en: "Enter the 6-digit code from your authenticator app.",
        vi: "Nhập mã 6 số từ ứng dụng xác thực.",
      });
      return;
    }
    setStep("verifying");
    setErrorBilingual(null);
    try {
      await verifyEnrollment(enroll.factorId, code);
      // Success — clear the cleanup target so unmount doesn't unenroll
      // the verified factor.
      pendingFactorIdRef.current = null;
      void notifySecurityEmail("security_2fa_enabled");
      setStep("done");
    } catch (err) {
      setErrorBilingual(humanizeMfaError(err));
      setStep("show_qr");
    }
  }, [code, enroll]);

  // ── Renders ──────────────────────────────────────────────────────────

  if (authLoading || step === "loading") {
    return (
      <div style={wrap}>
        <div style={column}>
          <p style={{ color: "#64748b" }}>Đang tạo mã QR… · Generating QR…</p>
        </div>
      </div>
    );
  }

  if (step === "ineligible") {
    return (
      <div style={wrap}>
        <div style={column}>
          <header>
            <h1 style={headingStyle}>
              Bật 2FA
              <span style={headingViStyle}>Enable two-factor auth</span>
            </h1>
          </header>
          <section style={cardStyle}>
            <p style={bodyStyle}>
              2FA chỉ có sẵn cho tài khoản trả phí. Quay lại{" "}
              <a href="/account/security" style={{ color: "#0369a1", fontWeight: 700 }}>
                trang bảo mật
              </a>{" "}
              để xem chi tiết.
            </p>
            <p style={bodyViStyle}>
              2FA is available only on paid accounts. Return to{" "}
              <a href="/account/security" style={{ color: "#0369a1", fontWeight: 700 }}>
                Security settings
              </a>{" "}
              for details.
            </p>
            {errorBilingual ? (
              <div role="alert" style={errorBox}>
                {errorBilingual.en}
                <span style={{ display: "block", marginTop: 2, fontSize: 12, color: "#7f1d1d" }}>
                  {errorBilingual.vi}
                </span>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div style={wrap}>
        <div style={column}>
          <header>
            <h1 style={headingStyle}>
              2FA đã bật
              <span style={headingViStyle}>2FA enabled</span>
            </h1>
          </header>
          <section style={cardStyle} data-testid="mfa-enroll-success">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ShieldCheck size={24} color="#047857" aria-hidden />
              <strong style={{ color: "#047857", fontSize: 16 }}>
                Đã hoàn tất · All set
              </strong>
            </div>
            <p style={{ ...bodyStyle, marginTop: 12 }}>
              Tài khoản của bạn đã được bảo vệ bằng 2FA. Lần đăng nhập tiếp theo, bạn sẽ nhập mã 6 số từ ứng dụng sau khi nhập mật khẩu.
            </p>
            <p style={bodyViStyle}>
              Your account is now protected by 2FA. The next time you sign in, you'll enter a 6-digit code from your authenticator after your password.
            </p>
            <p
              style={{
                ...bodyViStyle,
                marginTop: 10,
                color: "rgba(0,0,0,0.40)",
              }}
            >
              Phase 2 (mã dự phòng / backup codes) đang được phát triển — sắp tới bạn sẽ có 8 mã dùng một lần phòng khi mất điện thoại.
              <br />
              Phase 2 (backup codes) is in progress — you'll soon have 8 single-use codes for the case where you lose your phone.
            </p>
            <div
              style={{
                marginTop: 18,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                style={primaryBtn}
                onClick={() => navigate("/account/security")}
                data-testid="mfa-enroll-success-back"
              >
                Quay lại bảo mật · Back to Security
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // step === "show_qr" or "verifying"
  return (
    <div style={wrap}>
      <div style={column}>
        <header>
          <button
            type="button"
            onClick={() => navigate("/account/security")}
            style={{
              ...ghostBtn,
              minHeight: 36,
              padding: "0 12px",
              marginBottom: 8,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <ArrowLeft size={14} aria-hidden /> Hủy · Cancel
          </button>
          <h1 style={headingStyle}>
            Bật 2FA — quét mã QR
            <span style={headingViStyle}>Enable 2FA — scan the QR</span>
          </h1>
        </header>

        <section style={cardStyle} data-testid="mfa-enroll-qr">
          <h2 style={subheadingStyle}>1. Mở ứng dụng xác thực</h2>
          <p style={bodyStyle}>
            Authy, Google Authenticator, 1Password, hoặc Bitwarden — bất kỳ ứng dụng nào hỗ trợ TOTP đều dùng được.
          </p>
          <p style={bodyViStyle}>
            Authy, Google Authenticator, 1Password, or Bitwarden — any TOTP-compatible app works.
          </p>

          <h2 style={{ ...subheadingStyle, marginTop: 18 }}>2. Quét mã QR</h2>
          <p style={bodyStyle}>
            Quét mã này bằng ứng dụng xác thực để thêm tài khoản MercyBlade.
          </p>
          <p style={bodyViStyle}>
            Scan this with your authenticator app to add your MercyBlade account.
          </p>

          {enroll ? (
            <div style={qrWrap}>
              <img
                src={enroll.qrCode}
                alt="MFA enrollment QR code"
                width={200}
                height={200}
                style={{ display: "block", maxWidth: 200 }}
                data-testid="mfa-enroll-qr-image"
              />
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(0,0,0,0.50)",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                Không quét được? Nhập tay mã bên dưới.
                <br />
                Can't scan? Enter the code below manually.
              </p>
              <div style={secretBoxStyle} data-testid="mfa-enroll-secret">
                {enroll.secret}
              </div>
            </div>
          ) : null}

          <h2 style={{ ...subheadingStyle, marginTop: 18 }}>3. Nhập mã 6 số</h2>
          <p style={bodyStyle}>
            Ứng dụng sẽ hiện mã 6 số mới mỗi 30 giây. Nhập mã hiện tại để xác nhận.
          </p>
          <p style={bodyViStyle}>
            The app shows a fresh 6-digit code every 30 seconds. Enter the current one to confirm.
          </p>

          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => {
              const next = e.target.value.replace(/\D/g, "").slice(0, 6);
              setCode(next);
              if (errorBilingual) setErrorBilingual(null);
            }}
            placeholder="123456"
            aria-label="6-digit code from your authenticator app"
            data-testid="mfa-enroll-code-input"
            style={{ ...codeInputStyle, marginTop: 12 }}
            disabled={step === "verifying"}
          />

          {errorBilingual ? (
            <div role="alert" style={errorBox} data-testid="mfa-enroll-error">
              {errorBilingual.en}
              <span style={{ display: "block", marginTop: 2, fontSize: 12, color: "#7f1d1d" }}>
                {errorBilingual.vi}
              </span>
            </div>
          ) : null}

          <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              style={primaryBtn}
              onClick={() => void onSubmitCode()}
              disabled={step === "verifying" || code.length !== 6}
              data-testid="mfa-enroll-verify-cta"
            >
              {step === "verifying"
                ? "Đang xác minh… · Verifying…"
                : "Xác nhận · Verify"}
            </button>
          </div>
        </section>

        <section style={{ ...cardStyle, ...successBox, padding: 14 }}>
          <p style={{ ...bodyStyle, color: "#065f46", margin: 0 }}>
            <strong>Lưu ý:</strong> Phiên đăng nhập hiện tại sẽ không bị đăng xuất. 2FA chỉ áp dụng cho lần đăng nhập tiếp theo.
          </p>
          <p style={{ ...bodyViStyle, color: "#047857", marginTop: 4 }}>
            <strong>Note:</strong> Your current session stays signed in. 2FA applies to your next sign-in.
          </p>
        </section>
      </div>
    </div>
  );
}
