// src/components/parent-view/ParentNavEntry.tsx
//
// L6 — the single shared-shell nav entry for the Parent view. Self-gating:
// renders for any SIGNED-IN user and nothing otherwise, so the shell can mount
// it unconditionally (mirrors ReviewNavEntry).
//
// Visibility is deliberately visible-to-all-signed-in, NOT pro-only: ParentView
// itself enforces entitlement (useUserAccess().hasPremium → <ParentPaywallGate/>,
// locked by the golden test), so a free parent who taps this lands on the
// paywall — a conversion nudge, never the data. Signed-out users see the
// header's Sign-in instead. Style mirrors the header pill buttons.

import React from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";

export default function ParentNavEntry() {
  const nav = useNavigate();
  const { user, isLoading } = useAuth();
  if (isLoading || !user) return null;
  return (
    <button
      type="button"
      onClick={() => nav("/parent/me")}
      className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/5"
      aria-label="Phụ huynh — tiến bộ của con / Parent view"
    >
      <span className="inline-flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500" />
        <span>Phụ huynh / Parent</span>
      </span>
    </button>
  );
}
