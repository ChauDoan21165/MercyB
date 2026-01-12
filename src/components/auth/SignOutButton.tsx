// FILE: SignOutButton.tsx
// PATH: src/components/auth/SignOutButton.tsx
// VERSION: MB-AUTH-SIGNOUT-000.1 — 2026-01-11 (+0700)
//
// Uses Supabase signOut() to correctly clear session + OAuth tokens.
// Then hard-navigates user back to /signin.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  className?: string;
};

export default function SignOutButton({ className }: Props) {
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);

  async function onSignOut() {
    if (busy) return;
    setBusy(true);
    try {
      await supabase.auth.signOut();
      nav("/signin", { replace: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onSignOut}
      disabled={busy}
      className={className ?? "rounded-full border px-4 py-2 text-sm hover:bg-gray-100"}
      title="Sign out"
    >
      {busy ? "Signing out... / Đang thoát..." : "Sign out / Đăng xuất"}
    </button>
  );
}
