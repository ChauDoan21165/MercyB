// src/pages/gift/MyGiftsPage.tsx
//
// Step 9 — /gift/my route. Auth-required.

import React from "react";
import { Link } from "react-router-dom";

import MyGiftsList from "@/components/gift/MyGiftsList";
import { useAuth } from "@/providers/AuthProvider";

export default function MyGiftsPage(): React.ReactElement {
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
      <header className="mb-4 text-center">
        <h1 className="text-xl font-semibold text-slate-900">
          Quà MercyBlade / My MercyBlade gifts
        </h1>
        <p className="text-sm text-slate-500">
          Lịch sử mã quà bạn đã tặng và đã nhận.
        </p>
      </header>

      <MyGiftsList userId={user.id} />

      <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
        <Link to="/gift" className="text-amber-600 underline">
          Tặng quà / Send a gift
        </Link>
        <Link to="/gift/redeem" className="text-amber-600 underline">
          Nhập mã / Redeem a code
        </Link>
      </div>
    </main>
  );
}
