// src/router/ChangeLanguageLink.tsx
//
// Header re-entry to the language picker for ANONYMOUS visitors who
// already picked a pair (PR 2/3). Clears the stored pair and routes
// back to /onboarding so they can re-choose.
//
// Visibility is deliberately narrow (one-owner-per-function):
//   - signed-in / auth loading → render nothing. A logged-in user
//     changes their pair in Settings (LanguagePairSettings at
//     /account); duplicating that control here would create two
//     owners of the same action.
//   - anonymous with NO stored pair → render nothing. They are either
//     in the picker already or about to be sent there by the `/` gate
//     (PR 1's AnonymousOnboardingGate) — no reset to offer.
//   - anonymous WITH a stored pair → show "Đổi ngôn ngữ".
//
// Vietnamese-first label + compact width (CLAUDE.md non-negotiables #1
// Vietnamese-first, #3 mobile-first 375px). EN is the hover title, not
// inline text, so the header doesn't overflow on a phone.

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import {
  hasAnonymousPair,
  clearAnonymousPair,
} from "@/lib/languagePair/anonymousPair";

const linkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  background: "none",
  border: "none",
  padding: "6px 8px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 700,
  color: "rgba(0,0,0,0.55)",
  whiteSpace: "nowrap",
};

export function ChangeLanguageLink() {
  const nav = useNavigate();
  const { user, isLoading } = useAuth();

  if (isLoading || user) return null;
  if (!hasAnonymousPair()) return null;

  return (
    <button
      type="button"
      onClick={() => {
        clearAnonymousPair();
        nav("/onboarding");
      }}
      style={linkStyle}
      aria-label="Đổi ngôn ngữ — Change language"
      title="Change language"
    >
      <span aria-hidden="true">🌐</span>
      Đổi ngôn ngữ
    </button>
  );
}
