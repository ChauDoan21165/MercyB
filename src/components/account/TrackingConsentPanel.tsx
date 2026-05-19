// src/components/account/TrackingConsentPanel.tsx
//
// Account-page panel that lets the user opt out of advertising +
// analytics tracking (Meta Pixel, Google Analytics 4, UTM capture).
//
// Backed by setMarketingConsent() in services/behaviorTrackingFlag.ts
// (localStorage, per-device — consent is not per-account). This panel
// is the *only* UI caller of that function; before it shipped the
// privacy policy's "you may opt out" statement was unenforceable
// (privacy-policy compliance audit, 2026-05-18, §8).
//
// This panel does NOT govern marketing email — that lives separately
// at /account/notifications. Default posture: tracking ON unless the
// user explicitly opts out (matches isMarketingTrackingEnabled()).
//
// Single per-flip persistence (localStorage write, synchronous, no
// network) — mirrors the instant-save pattern used by the email
// notification toggles.

import React, { useState } from "react";
import {
  isMarketingTrackingEnabled,
  setMarketingConsent,
} from "@/services/behaviorTrackingFlag";
import { useChromeLanguage } from "@/lib/i18n/chromeLanguage";

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.10)",
  borderRadius: 16,
  padding: 18,
  background: "white",
};

export function TrackingConsentPanel(): React.ReactElement {
  const lang = useChromeLanguage();
  // Lazy init from localStorage. isMarketingTrackingEnabled() returns
  // true unless the user has explicitly opted out (default-ON posture).
  const [enabled, setEnabled] = useState<boolean>(() =>
    isMarketingTrackingEnabled(),
  );

  const onToggle = (next: boolean) => {
    setMarketingConsent(next);
    setEnabled(next);
  };

  const title =
    lang === "en"
      ? "Allow advertising and analytics tracking"
      : "Cho phép theo dõi quảng cáo và phân tích";

  const helper =
    lang === "en"
      ? "Helps MercyBlade understand how you use the app. Off will stop sending usage data to Meta Pixel and Google Analytics."
      : "Giúp MercyBlade hiểu cách bạn dùng app. Tắt sẽ ngừng gửi dữ liệu sử dụng đến Meta Pixel và Google Analytics.";

  // When turned OFF, scripts already injected this session keep running
  // until the page reloads (see setMarketingConsent doc comment). Tell
  // the user so the control's effect isn't silently partial.
  const reloadHint =
    lang === "en"
      ? "Reload the page to fully apply this change for the current session."
      : "Tải lại trang để áp dụng đầy đủ thay đổi này cho phiên hiện tại.";

  return (
    <div style={cardStyle}>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: "rgba(10,10,10,0.94)",
            }}
          >
            {title}
          </div>
          <p
            style={{
              fontSize: 13,
              color: "#475569",
              margin: "8px 0 0",
              lineHeight: 1.5,
            }}
          >
            {helper}
          </p>
          {!enabled ? (
            <p
              style={{
                fontSize: 12,
                color: "#92400e",
                margin: "8px 0 0",
                lineHeight: 1.5,
              }}
            >
              {reloadHint}
            </p>
          ) : null}
        </div>
        <ToggleSwitch
          checked={enabled}
          onChange={onToggle}
          ariaLabel={title}
          testId="tracking-consent-toggle"
        />
      </div>
    </div>
  );
}

// Visual match for the toggle on /account/notifications so all
// privacy-style switches in /account look identical.
function ToggleSwitch({
  checked,
  onChange,
  ariaLabel,
  testId,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel: string;
  testId?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      data-testid={testId}
      onClick={() => onChange(!checked)}
      style={{
        flexShrink: 0,
        width: 48,
        height: 28,
        borderRadius: 9999,
        background: checked ? "#10b981" : "#cbd5e1",
        border: "none",
        cursor: "pointer",
        position: "relative",
        transition: "background 120ms ease",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          transition: "left 120ms ease",
        }}
      />
    </button>
  );
}
