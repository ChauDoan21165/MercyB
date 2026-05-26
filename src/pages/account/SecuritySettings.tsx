/**
 * Path: src/pages/account/SecuritySettings.tsx
 *
 * Route: /account/security
 *
 * Per the Phase-1 brief (reports/2fa-design-decisions-2026-04-27.md
 * § Decision 5):
 *   - Paid users see MFA status + enable/disable controls
 *   - Free users see <MfaUpgradePrompt /> with the upsell
 *   - All users see the page (no auth gate beyond RequireAuth)
 *
 * Disabling 2FA requires re-authentication via TOTP — Supabase
 * enforces this server-side (unenroll fails without aal=2). We
 * surface a clear status pill while the user is unenrolling.
 */

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ShieldOff, Loader2 } from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";
import { useUserAccess } from "@/hooks/useUserAccess";
import { MfaUpgradePrompt } from "@/components/auth/MfaUpgradePrompt";
import { supabase } from "@/lib/supabaseClient";
import {
  disableTotpFactor,
  findFirstVerifiedTotp,
  getBackupCodeStatus,
  hasVerifiedTotpFactor,
  humanizeMfaError,
  listMfaFactors,
  regenerateBackupCodes,
  type MfaFactor,
} from "@/lib/security/mfaClient";
import { canUseMfa } from "@/lib/security/mfaEligibility";

/**
 * Fire-and-forget security-email notification. The disable path
 * matters most — a user who didn't disable 2FA themselves needs to
 * see this in their inbox. Failure is non-blocking; the user is
 * already unenrolled by the time this is called.
 */
async function notifySecurityEmail(
  kind: "security_2fa_enabled" | "security_2fa_disabled",
): Promise<void> {
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

const wrap: React.CSSProperties = {
  width: "100%",
  minHeight: "calc(100vh - 72px)",
  padding: "24px 16px 80px",
  display: "flex",
  justifyContent: "center",
};

const column: React.CSSProperties = {
  width: "100%",
  maxWidth: 720,
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

const heading: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 900,
  letterSpacing: -0.4,
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

const statusPillBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "4px 10px",
  borderRadius: 9999,
  fontSize: 12,
  fontWeight: 800,
  lineHeight: 1.2,
  whiteSpace: "nowrap",
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

const dangerBtn: React.CSSProperties = {
  background: "white",
  color: "#991b1b",
  borderRadius: 9999,
  minHeight: 44,
  padding: "0 22px",
  fontWeight: 700,
  fontSize: 14,
  border: "1px solid #fecaca",
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

export default function SecuritySettings() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const access = useUserAccess();

  const [factors, setFactors] = useState<MfaFactor[]>([]);
  const [loadingFactors, setLoadingFactors] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorBilingual, setErrorBilingual] =
    useState<{ en: string; vi: string } | null>(null);

  // Phase 2 — backup-code status + just-regenerated codes (shown ONCE).
  const [backupUnusedCount, setBackupUnusedCount] = useState<number | null>(null);
  const [regeneratedCodes, setRegeneratedCodes] = useState<string[]>([]);

  // Initial load — fetch factor list once we have a session.
  useEffect(() => {
    if (authLoading || !user) {
      setLoadingFactors(false);
      return;
    }
    let alive = true;
    setLoadingFactors(true);
    listMfaFactors()
      .then((res) => {
        if (alive) setFactors(res);
      })
      .catch((err) => {
        if (alive) setErrorBilingual(humanizeMfaError(err));
      })
      .finally(() => {
        if (alive) setLoadingFactors(false);
      });
    return () => {
      alive = false;
    };
  }, [authLoading, user]);

  // Phase 2 — fetch backup-code count whenever we have a verified
  // factor. Skipped during loading to avoid the same access-loading
  // race the eligibility-helper PR (PR #214) fixed.
  useEffect(() => {
    if (loadingFactors) return;
    if (!hasVerifiedTotpFactor(factors)) {
      setBackupUnusedCount(null);
      return;
    }
    let alive = true;
    getBackupCodeStatus()
      .then((res) => {
        if (alive) setBackupUnusedCount(res.unused_count);
      })
      .catch(() => {
        // Non-fatal — UI just shows "—" instead of a count.
        if (alive) setBackupUnusedCount(null);
      });
    return () => {
      alive = false;
    };
  }, [factors, loadingFactors]);

  const refreshFactors = useCallback(async () => {
    try {
      const next = await listMfaFactors();
      setFactors(next);
    } catch (err) {
      setErrorBilingual(humanizeMfaError(err));
    }
  }, []);

  const onDisable = useCallback(async () => {
    const factor = findFirstVerifiedTotp(factors);
    if (!factor) return;
    setBusy(true);
    setErrorBilingual(null);
    try {
      await disableTotpFactor(factor.id);
      // Fire the security email AFTER the disable succeeded — sending
      // an "your 2FA was disabled" email when it actually wasn't is
      // worse than not sending one at all.
      void notifySecurityEmail("security_2fa_disabled");
      await refreshFactors();
    } catch (err) {
      setErrorBilingual(humanizeMfaError(err));
    } finally {
      setBusy(false);
    }
  }, [factors, refreshFactors]);

  // Phase 2 — regenerate backup codes. Requires aal=2; the route
  // guard already ensures the user is at aal=2 by the time they
  // reach this page (RequireAal2 forces the challenge upstream).
  const onRegenerateBackupCodes = useCallback(async () => {
    setBusy(true);
    setErrorBilingual(null);
    try {
      const result = await regenerateBackupCodes();
      setRegeneratedCodes(result.codes);
      setBackupUnusedCount(result.codes.length);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === "aal2_required") {
        setErrorBilingual({
          en: "Please verify your 2FA code first to confirm this change.",
          vi: "Vui lòng nhập mã 2FA để xác nhận thay đổi này.",
        });
      } else {
        setErrorBilingual(humanizeMfaError(err));
      }
    } finally {
      setBusy(false);
    }
  }, []);

  // ── Render gates ───────────────────────────────────────────────────

  if (authLoading) {
    return (
      <div style={wrap}>
        <div style={column}>
          <p style={{ color: "#64748b" }}>Đang tải… · Loading…</p>
        </div>
      </div>
    );
  }
  if (!user) return null;

  const enabled = hasVerifiedTotpFactor(factors);

  // Free-tier users see the upgrade prompt and nothing else.
  // We don't even fetch their factor list (they can't have any), so
  // the gate sits before the loader.
  //
  // Eligibility helper covers admin override + paid; both pages share
  // the same logic so /account/security and /auth/security cannot
  // disagree (smoke-test bug 2026-04-27).
  const eligibility = canUseMfa(access);

  // While access is still loading, render nothing rather than briefly
  // showing the upgrade prompt — the same access-loading flicker that
  // the smoke-test caught on /auth/security.
  if (!eligibility.resolved) {
    return (
      <div style={wrap}>
        <div style={column}>
          <p style={{ color: "#64748b" }}>Đang tải… · Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={column}>
        <header>
          <h1 style={heading}>
            Bảo mật tài khoản
            <span style={headingViStyle}>Account security</span>
          </h1>
        </header>

        {!eligibility.allowed ? (
          <MfaUpgradePrompt />
        ) : loadingFactors ? (
          <section style={cardStyle} aria-label="Loading 2FA status">
            <span style={{ color: "#64748b", display: "inline-flex", gap: 6, alignItems: "center" }}>
              <Loader2 size={14} aria-hidden />
              Đang kiểm tra trạng thái 2FA… · Checking 2FA status…
            </span>
          </section>
        ) : (
          <section
            style={cardStyle}
            aria-label="Two-factor authentication"
            data-testid="mfa-status-card"
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: -0.2,
                  margin: 0,
                  color: "rgba(10,10,10,0.92)",
                  flex: "1 1 auto",
                }}
              >
                Xác thực hai bước
                <span
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "rgba(0,0,0,0.55)",
                    marginTop: 2,
                  }}
                >
                  Two-factor authentication
                </span>
              </h2>
              <span
                style={{
                  ...statusPillBase,
                  background: enabled ? "#ecfdf5" : "#f1f5f9",
                  color: enabled ? "#047857" : "#475569",
                }}
                data-testid="mfa-status-pill"
              >
                {enabled ? (
                  <>
                    <ShieldCheck size={12} aria-hidden /> Đã bật · Enabled
                  </>
                ) : (
                  <>
                    <ShieldOff size={12} aria-hidden /> Chưa bật · Disabled
                  </>
                )}
              </span>
            </div>

            <p
              style={{
                marginTop: 12,
                fontSize: 14,
                color: "rgba(0,0,0,0.72)",
                lineHeight: 1.55,
              }}
            >
              {enabled
                ? "Tài khoản của bạn được bảo vệ bằng mã 6 số từ điện thoại. Mỗi lần đăng nhập, bạn sẽ nhập mã này sau mật khẩu."
                : "Bật 2FA để cần thêm một mã 6 số từ điện thoại mỗi khi đăng nhập. Chỉ mật khẩu là chưa đủ — nếu không có điện thoại của bạn, người khác sẽ không vào được."}
            </p>
            <p
              style={{
                marginTop: 4,
                fontSize: 12,
                color: "rgba(0,0,0,0.50)",
                lineHeight: 1.5,
              }}
            >
              {enabled
                ? "Your account is protected by a 6-digit code from your phone. After your password, you enter this code at every sign-in."
                : "Turn 2FA on to require a 6-digit code from your phone after your password. Without your phone, an attacker can't get in."}
            </p>

            {errorBilingual ? (
              <div role="alert" style={errorBox} data-testid="mfa-error">
                {errorBilingual.en}
                <span style={{ display: "block", marginTop: 2, fontSize: 12, color: "#7f1d1d" }}>
                  {errorBilingual.vi}
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
              {!enabled ? (
                <button
                  type="button"
                  style={primaryBtn}
                  onClick={() => navigate("/auth/security")}
                  data-testid="mfa-enable-cta"
                >
                  Bật 2FA · Enable 2FA
                </button>
              ) : (
                <button
                  type="button"
                  style={dangerBtn}
                  onClick={() => void onDisable()}
                  disabled={busy}
                  data-testid="mfa-disable-cta"
                >
                  {busy
                    ? "Đang tắt… · Disabling…"
                    : "Tắt 2FA · Disable 2FA"}
                </button>
              )}
            </div>

            {enabled ? (
              <p
                style={{
                  marginTop: 14,
                  fontSize: 12,
                  color: "rgba(0,0,0,0.45)",
                  lineHeight: 1.5,
                }}
              >
                Để tắt 2FA, bạn cần nhập một mã hợp lệ từ ứng dụng xác thực (Supabase yêu cầu xác thực hai bước trước khi đổi cài đặt bảo mật).
                <br />
                <span style={{ color: "rgba(0,0,0,0.40)" }}>
                  Disabling 2FA requires a valid code from your authenticator app first (Supabase enforces re-auth before changing security settings).
                </span>
              </p>
            ) : null}
          </section>
        )}

        {/* Phase 2 — backup codes section. Only shown when MFA is
            enabled. The page is RequireAal2-gated so the user is
            at aal=2 by the time they see this. */}
        {eligibility.allowed && enabled ? (
          <section
            style={cardStyle}
            aria-label="Backup codes"
            data-testid="mfa-backup-codes-card"
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: -0.2,
                margin: 0,
                color: "rgba(10,10,10,0.92)",
              }}
            >
              Mã dự phòng
              <span
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "rgba(0,0,0,0.55)",
                  marginTop: 2,
                }}
              >
                Backup codes
              </span>
            </h2>

            <p
              style={{
                marginTop: 12,
                fontSize: 14,
                color: "rgba(0,0,0,0.72)",
                lineHeight: 1.55,
              }}
            >
              {backupUnusedCount === null
                ? "—"
                : `${backupUnusedCount} / 8 mã chưa dùng. Nếu mất điện thoại, dùng một mã tại trang khôi phục /auth/recover.`}
            </p>
            <p
              style={{
                marginTop: 4,
                fontSize: 12,
                color: "rgba(0,0,0,0.50)",
                lineHeight: 1.5,
              }}
            >
              {backupUnusedCount === null
                ? "Status unavailable."
                : `${backupUnusedCount} / 8 unused codes. If you lose your phone, use one at /auth/recover.`}
            </p>

            {regeneratedCodes.length > 0 ? (
              <div
                style={{
                  marginTop: 14,
                  padding: 14,
                  borderRadius: 12,
                  border: "1px solid #fde68a",
                  background: "#fffbeb",
                }}
                data-testid="mfa-backup-codes-regenerated"
              >
                <strong style={{ color: "#92400e", fontSize: 14 }}>
                  Lưu 8 mã mới ngay · Save these 8 new codes NOW
                </strong>
                <p style={{ marginTop: 4, fontSize: 12, color: "#78350f", lineHeight: 1.45 }}>
                  Mã cũ đã bị huỷ. Mã mới chỉ hiện một lần — sao chép hoặc lưu cẩn thận.
                  <br />
                  <span style={{ color: "#92400e" }}>
                    Old codes are invalidated. New codes show ONCE — copy or save them carefully.
                  </span>
                </p>
                <ul
                  style={{
                    marginTop: 10,
                    listStyle: "none",
                    padding: 0,
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 6,
                  }}
                >
                  {regeneratedCodes.map((c) => (
                    <li
                      key={c}
                      style={{
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: 1,
                        padding: "6px 8px",
                        background: "white",
                        border: "1px solid #fde68a",
                        borderRadius: 6,
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
                      regeneratedCodes.join("\n");
                    void navigator.clipboard?.writeText(text).catch(() => undefined);
                  }}
                  style={{
                    marginTop: 10,
                    background: "white",
                    color: "#92400e",
                    borderRadius: 9999,
                    minHeight: 32,
                    padding: "0 12px",
                    fontWeight: 700,
                    fontSize: 12,
                    border: "1px solid #fde68a",
                    cursor: "pointer",
                  }}
                  data-testid="mfa-backup-codes-copy"
                >
                  Sao chép · Copy all
                </button>
              </div>
            ) : null}

            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                style={{
                  background: "white",
                  color: "#0f172a",
                  borderRadius: 9999,
                  minHeight: 40,
                  padding: "0 18px",
                  fontWeight: 700,
                  fontSize: 13,
                  border: "1px solid rgba(0,0,0,0.12)",
                  cursor: "pointer",
                }}
                onClick={() => void onRegenerateBackupCodes()}
                disabled={busy}
                data-testid="mfa-backup-codes-regenerate"
              >
                {busy ? "Đang tạo… · Generating…" : "Tạo mã mới · Regenerate codes"}
              </button>
            </div>

            <p
              style={{
                marginTop: 10,
                fontSize: 11,
                color: "rgba(0,0,0,0.45)",
                lineHeight: 1.4,
              }}
            >
              Tạo mới sẽ huỷ toàn bộ 8 mã cũ. Chỉ tạo mới khi bạn đã dùng vài mã hoặc nghi ngờ chúng bị lộ.
              <br />
              <span style={{ color: "rgba(0,0,0,0.40)" }}>
                Regenerating invalidates all 8 prior codes. Only do this after using some, or if you suspect a leak.
              </span>
            </p>
          </section>
        ) : null}
      </div>
    </div>
  );
}
