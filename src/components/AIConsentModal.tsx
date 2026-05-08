// src/components/AIConsentModal.tsx
//
// One-time AI data consent screen for App Store compliance.
//
// Shown on first app launch (web + Capacitor iOS) before the user can
// interact with Mercy AI. Consent is persisted to localStorage under the
// key `mb.ai.consent.v1`. If the key exists with value 'accepted', the
// modal does not render at all on subsequent launches.
//
// "I Agree" → set `mb.ai.consent.v1='accepted'`, dismiss.
// "View Privacy Policy" → open mercyblade.com/privacy via Capacitor Browser
// (in-app SafariViewController on iOS) or window.open on web. Does NOT
// dismiss the modal — the user must explicitly agree.
//
// The overlay is full-screen and intentionally non-dismissible by tap-
// outside or Escape, because the App Review reviewer must see this
// screen on launch.

import React, { useEffect, useState } from "react";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";

const CONSENT_KEY = "mb.ai.consent.v1";
const PRIVACY_URL = "https://mercyblade.com/privacy";

function readConsent(): string | null {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function writeConsent(value: string): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Ignore — Safari Private Mode etc. The modal still dismisses for
    // this session via component state; on reload it will show again,
    // which is the conservative behaviour for App Store compliance.
  }
}

async function openPrivacyPolicy(): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      await Browser.open({
        url: PRIVACY_URL,
        presentationStyle: "popover",
      });
      return;
    }
  } catch {
    // Fall through to window.open
  }
  window.open(PRIVACY_URL, "_blank", "noopener,noreferrer");
}

export function AIConsentModal() {
  const [open, setOpen] = useState<boolean>(() => readConsent() !== "accepted");

  // Re-check on mount in case localStorage was hydrated late (Capacitor
  // can in rare cases mount React before storage is ready).
  useEffect(() => {
    if (readConsent() === "accepted") setOpen(false);
  }, []);

  if (!open) return null;

  const handleAgree = () => {
    writeConsent("accepted");
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-consent-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#fffaf2",
          borderRadius: 22,
          maxWidth: 460,
          width: "100%",
          padding: "24px 22px 20px",
          boxShadow: "0 18px 48px rgba(0,0,0,0.35)",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <h2
          id="ai-consent-title"
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            lineHeight: 1.35,
            color: "rgba(15,23,42,0.96)",
          }}
        >
          Mercy dùng AI để hỗ trợ bạn
          <span
            style={{
              display: "block",
              marginTop: 4,
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(0,0,0,0.55)",
            }}
          >
            Mercy uses AI to support you
          </span>
        </h2>

        <div
          style={{
            marginTop: 14,
            fontSize: 14,
            lineHeight: 1.55,
            color: "rgba(15,23,42,0.86)",
          }}
        >
          <p style={{ margin: "0 0 10px" }}>
            Để cung cấp phản hồi cá nhân hóa, Mercy Blade gửi nội dung cuộc
            trò chuyện của bạn đến Anthropic (nhà cung cấp AI). Anthropic xử
            lý dữ liệu theo chính sách bảo mật của họ tại{" "}
            <span style={{ fontWeight: 700 }}>anthropic.com/privacy</span>.
          </p>
          <p style={{ margin: 0, color: "rgba(0,0,0,0.62)", fontSize: 13 }}>
            To provide personalized feedback, Mercy Blade sends your
            conversation content to Anthropic (our AI provider). Anthropic
            processes this data under their privacy policy at{" "}
            <span style={{ fontWeight: 700 }}>anthropic.com/privacy</span>.
          </p>
        </div>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={handleAgree}
            style={{
              background: "#b8541b",
              color: "#fff",
              borderRadius: 14,
              minHeight: 50,
              padding: "12px 20px",
              fontSize: 15,
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
              width: "100%",
              boxShadow: "0 6px 14px rgba(184,84,27,0.28)",
            }}
          >
            Tôi đồng ý
            <span
              style={{
                display: "block",
                marginTop: 2,
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              I Agree
            </span>
          </button>

          <button
            type="button"
            onClick={openPrivacyPolicy}
            style={{
              background: "#fff",
              color: "rgba(15,23,42,0.86)",
              borderRadius: 14,
              minHeight: 48,
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 700,
              border: "1px solid rgba(0,0,0,0.14)",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Xem chính sách
            <span
              style={{
                display: "block",
                marginTop: 2,
                fontSize: 12,
                fontWeight: 500,
                color: "rgba(0,0,0,0.55)",
              }}
            >
              View Privacy Policy
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIConsentModal;
