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
import { canUseMfa } from "@/lib/security/mfaEligibility";
import {
  cancelEnrollment,
  enrollTotp,
  generateBackupCodes,
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
  // Phase 2 — plaintext backup codes shown ONCE on the success
  // screen. Empty array if generation failed (the user can still
  // generate later from /account/security).
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [backupCodesError, setBackupCodesError] = useState<string | null>(null);

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

    // Eligibility check via shared helper. CRITICAL: returns
    // resolved=false while access.loading is true, so we MUST
    // wait — this is the bug that bit the 2026-04-27 smoke test.
    // An admin user (admin_level=10, no subscription row) was being
    // bounced to "ineligible" before access settled because the
    // earlier check used hasPremium/isHighAdmin directly while both
    // were still default-false.
    const eligibility = canUseMfa(access);
    if (!eligibility.resolved) return; // wait for access to load
    if (!eligibility.allowed) {
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
  }, [
    authLoading,
    user,
    access.loading,
    access.isAuthenticated,
    access.hasPremium,
    access.isHighAdmin,
    step,
  ]);

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

      // Phase 2 — generate 8 backup codes immediately. Verification
      // just minted an aal=2 JWT (Supabase advances assurance on
      // verifyEnrollment success), so the generate edge function's
      // aal=2 gate is satisfied. The codes are returned ONCE and
      // displayed on the success screen.
      try {
        const result = await generateBackupCodes();
        setBackupCodes(result.codes);
      } catch (genErr) {
        // Non-fatal — user can generate from /account/security later.
        const msg = genErr instanceof Error ? genErr.message : String(genErr);
        setBackupCodesError(msg);
      }

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

            {/* Phase 2 — backup codes display. Shown ONCE; once the
                user navigates away the only path to recover (lost
                phone) is one of these codes. We make this prominent
                with a yellow card + explicit save-warning copy. */}
            {backupCodes.length > 0 ? (
              <div
                style={{
                  marginTop: 18,
                  padding: 16,
                  borderRadius: 14,
                  border: "1px solid #fde68a",
                  background: "#fffbeb",
                }}
                data-testid="mfa-enroll-backup-codes"
              >
                <strong style={{ color: "#92400e", fontSize: 15 }}>
                  Lưu 8 mã dự phòng này NGAY · Save these 8 backup codes NOW
                </strong>
                <p style={{ marginTop: 6, fontSize: 13, color: "#78350f", lineHeight: 1.5 }}>
                  Mỗi mã chỉ dùng được một lần. Nếu mất điện thoại, một trong 8 mã này là cách duy nhất để khôi phục tài khoản.
                </p>
                <p style={{ marginTop: 4, fontSize: 12, color: "#92400e", lineHeight: 1.5 }}>
                  Each code is single-use. If you lose your phone, one of these 8 codes is the only way to recover your account. They will NOT be shown again.
                </p>
                <ul
                  style={{
                    marginTop: 12,
                    listStyle: "none",
                    padding: 0,
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 8,
                  }}
                >
                  {backupCodes.map((c) => (
                    <li
                      key={c}
                      style={{
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                        fontSize: 14,
                        fontWeight: 700,
                        letterSpacing: 1,
                        padding: "8px 10px",
                        background: "white",
                        border: "1px solid #fde68a",
                        borderRadius: 8,
                        textAlign: "center",
                        color: "#0f172a",
                      }}
                    >
                      {c}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    const text =
                      "MercyBlade 2FA Backup Codes — store securely:\n\n" +
                      backupCodes.join("\n");
                    void navigator.clipboard?.writeText(text).catch(() => undefined);
                  }}
                  style={{
                    marginTop: 12,
                    background: "white",
                    color: "#92400e",
                    borderRadius: 9999,
                    minHeight: 36,
                    padding: "0 16px",
                    fontWeight: 700,
                    fontSize: 13,
                    border: "1px solid #fde68a",
                    cursor: "pointer",
                  }}
                  data-testid="mfa-enroll-copy-codes"
                >
                  Sao chép · Copy all
                </button>
              </div>
            ) : backupCodesError ? (
              <div
                style={{
                  marginTop: 14,
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #fecaca",
                  background: "#fef2f2",
                  color: "#991b1b",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                Không tạo được mã dự phòng tự động. Vào trang Bảo mật để tạo thủ công.
                <br />
                <span style={{ fontSize: 12, color: "#7f1d1d" }}>
                  Couldn't generate backup codes automatically. Visit Security settings to generate them manually.
                </span>
              </div>
            ) : null}

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
