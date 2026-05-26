/**
 * Path: src/components/auth/MfaUpgradePrompt.tsx
 *
 * Free-tier users land on /account/security to find that 2FA is a
 * paid feature. This component is the upsell — bilingual, calm, and
 * honest about WHY 2FA matters (account theft prevention) rather
 * than dressing the gate up as a marketing flourish.
 *
 * Voice rules followed (docs/voice-guidelines-vn.md):
 *   - No loss-volunteering ("Don't get hacked!" — banned)
 *   - VN-first, EN follows
 *   - Concrete value, not abstract benefit
 */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

import { trackMfaEvent } from "@/lib/security/mfaTelemetry";

const wrap: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 18,
  padding: 22,
  background: "linear-gradient(150deg, rgba(244,247,255,0.96) 0%, rgba(238,251,247,0.94) 100%)",
  boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
};

const iconWrap: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 9999,
  background: "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)",
  display: "grid",
  placeItems: "center",
  boxShadow: "0 8px 20px rgba(14,165,233,0.20)",
};

const titleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 900,
  letterSpacing: -0.2,
  color: "rgba(7,89,133,0.92)",
  margin: "10px 0 0",
};

const titleViStyle: React.CSSProperties = {
  display: "block",
  marginTop: 2,
  fontSize: 12,
  fontWeight: 600,
  color: "rgba(7,89,133,0.55)",
};

const bodyStyle: React.CSSProperties = {
  marginTop: 12,
  fontSize: 14,
  fontWeight: 600,
  color: "rgba(0,0,0,0.78)",
  lineHeight: 1.55,
  maxWidth: 540,
};

const bodyViStyle: React.CSSProperties = {
  marginTop: 4,
  fontSize: 13,
  fontWeight: 500,
  color: "rgba(0,0,0,0.55)",
  lineHeight: 1.5,
  maxWidth: 540,
};

const ctaStyle: React.CSSProperties = {
  marginTop: 18,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 22px",
  borderRadius: 9999,
  background: "rgba(7,89,133,0.95)",
  color: "white",
  fontWeight: 800,
  fontSize: 14,
  letterSpacing: 0.2,
  border: "none",
  cursor: "pointer",
};

export type MfaUpgradePromptProps = {
  /** Override the upgrade target. Default is /pricing. */
  upgradeHref?: string;
};

export function MfaUpgradePrompt({
  upgradeHref = "/pricing",
}: MfaUpgradePromptProps) {
  const navigate = useNavigate();

  // Telemetry: log the impression so we can measure how many free
  // users hit this gate (and whether they convert). Fires once per
  // mount; React StrictMode in dev fires twice but that's a dev-only
  // quirk and we don't have StrictMode on in this app anyway.
  useEffect(() => {
    trackMfaEvent("mfa_upgrade_prompt_shown");
  }, []);

  return (
    <section
      style={wrap}
      aria-label="Two-factor authentication — paid feature"
      data-testid="mfa-upgrade-prompt"
    >
      <div style={iconWrap}>
        <ShieldCheck size={24} color="white" aria-hidden />
      </div>

      <h2 style={titleStyle}>
        Bảo mật cao hơn cho tài khoản trả phí
        <span style={titleViStyle}>Stronger security for paid accounts</span>
      </h2>

      <p style={bodyStyle}>
        Bật xác thực hai bước (2FA) để bảo vệ tài khoản khỏi bị chiếm đoạt.
        Ngoài mật khẩu, bạn sẽ cần thêm một mã 6 số từ điện thoại — kẻ
        gian không có điện thoại của bạn thì không vào được.
      </p>
      <p style={bodyViStyle}>
        Turn on two-factor authentication (2FA) to keep your account safe
        from takeover. After your password, you'll enter a 6-digit code
        from your phone. Without your phone, an attacker can't get in.
      </p>

      <button
        type="button"
        onClick={() => navigate(upgradeHref)}
        style={ctaStyle}
        data-testid="mfa-upgrade-cta"
      >
        Nâng cấp tài khoản · Upgrade
      </button>
    </section>
  );
}
