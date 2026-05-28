// src/pages/gift/PurchaseGiftPage.tsx
//
// Step 9 — /gift route. Auth-required (route guarded in AppRouter).

import React from "react";
import { Link } from "react-router-dom";

import PurchaseGiftForm from "@/components/gift/PurchaseGiftForm";
import { useAuth } from "@/providers/AuthProvider";

export default function PurchaseGiftPage(): React.ReactElement {
  const { user } = useAuth();

  if (!user) {
    return (
      <main className="mx-auto max-w-md px-4 py-10 text-center">
        <p className="text-sm text-slate-500">Đang tải / Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-4 py-6">
      <PurchaseGiftForm
        purchaserId={user.id}
        purchaserEmail={user.email ?? null}
      />
      <p className="mt-4 text-center text-xs text-slate-500">
        Đã có mã quà?{" "}
        <Link to="/gift/redeem" className="text-amber-600 underline">
          Kích hoạt tại đây / Redeem here
        </Link>
        .
      </p>
      <p className="mt-2 text-center text-xs text-slate-500">
        <Link to="/gift/my" className="underline">
          Xem lịch sử quà / My gifts
        </Link>
      </p>
    </main>
  );
}
