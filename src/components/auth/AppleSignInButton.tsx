/**
 * MercyBlade — Sign in with Apple button.
 *
 * Apple requires the button to use either pure-black + white-logo or
 * pure-white + black-logo styling. We use the black variant to fit the
 * existing LoginPage dark OAuth buttons.
 *
 * Rendering is gated by the parent — this component only renders its
 * button. The parent decides whether to show it (iOS native, web, etc.).
 *
 * Click delegates to the shared nativeOAuth helper owned by CC4:
 *   signInWithNativeOAuth({ provider: "apple" })
 *
 * which opens Supabase's Apple OAuth URL in SFSafariViewController
 * (iOS) or a new tab (web fallback). The deep-link listener already
 * registered by LoginPage handles the redirect + session hydration.
 *
 * Apple App Store guideline 4.8: apps offering Google/Facebook login
 * must also offer Sign in with Apple. This component fulfils that.
 */

import React from "react";

type Props = {
  onClick: () => void;
  disabled?: boolean;
  busy?: boolean;
  /** Optional override of the default label. */
  label?: string;
};

export function AppleSignInButton({
  onClick,
  disabled = false,
  busy = false,
  label,
}: Props) {
  const text = busy ? "Please wait..." : label ?? "Continue with Apple";

  const style: React.CSSProperties = {
    width: "100%",
    minHeight: 48,
    padding: "12px 24px",
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 14,
    border: "none",
    background: "#000",
    color: "white",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "all 0.1s ease",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={style}
      aria-label="Continue with Apple"
    >
      {/* Apple logo — inline SVG so we don't pull an asset. White on black per Apple HIG. */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
      {text}
    </button>
  );
}

export default AppleSignInButton;
