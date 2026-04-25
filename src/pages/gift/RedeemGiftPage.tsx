// src/pages/gift/RedeemGiftPage.tsx
//
// Step 9 — /gift/redeem route. Auth-required.
// Accepts an optional `?code=XXXXXXXXXXXX` query param so the
// purchaser-shared link lands the recipient on a pre-filled preview.

import React from "react";
import { Link, useSearchParams } from "react-router-dom";

import RedeemGiftForm from "@/components/gift/RedeemGiftForm";
import { useAuth } from "@/providers/AuthProvider";

export default function RedeemGiftPage(): React.ReactElement {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const initialCode = params.get("code") ?? undefined;

  if (!user) {
    return (
      <main className="mx-auto max-w-md px-4 py-10 text-center">
        <p className="text-sm text-slate-500">Đang tải / Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-4 py-6">
      <RedeemGiftForm userId={user.id} initialCode={initialCode} />
      <p className="mt-4 text-center text-xs text-slate-500">
        Muốn tặng quà?{" "}
        <Link to="/gift" className="text-amber-600 underline">
          Tặng người khác / Send a gift
        </Link>
        .
      </p>
    </main>
  );
}
