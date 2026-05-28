// src/pages/corporate/CorporateDashboardPage.tsx
//
// /corporate — admin's home view. If the user has no corporate
// account, redirect them to /corporate/setup. Otherwise show the
// account summary, the bulk-invite form, and the seat list.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { InviteSeatsForm } from "@/components/corporate/InviteSeatsForm";
import { SeatList } from "@/components/corporate/SeatList";
import { requireAuth } from "@/lib/security/authGuard";
import {
  getOwnedCorporateAccount,
  type CorporateAccount,
} from "@/lib/corporate/corporateClient";

export default function CorporateDashboardPage() {
  const [account, setAccount] = useState<CorporateAccount | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ctx = await requireAuth();
        if (cancelled) return;
        const userId = ctx.user?.id;
        if (!userId) {
          setError("AUTHENTICATION_REQUIRED");
          return;
        }
        const result = await getOwnedCorporateAccount(userId);
        if (cancelled) return;
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setAccount(result.data);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "AUTHENTICATION_REQUIRED");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <main className="px-4 py-6 max-w-3xl mx-auto">
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          {error}
        </p>
      </main>
    );
  }

  if (account === undefined) {
    return (
      <main className="px-4 py-6 max-w-3xl mx-auto">
        <p className="text-sm text-slate-500">Đang tải…</p>
      </main>
    );
  }

  if (account === null) {
    return (
      <main className="px-4 py-6 max-w-3xl mx-auto">
        <header className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Gói tổ chức</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Bạn chưa có tài khoản tổ chức nào. Tạo mới để bắt đầu mời thành viên.
          </p>
        </header>
        <Link
          to="/corporate/setup"
          className="inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium no-underline"
        >
          Đăng ký gói tổ chức
        </Link>
      </main>
    );
  }

  return (
    <main className="px-4 py-6 max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-xl sm:text-2xl font-bold">{account.organization_name}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          {account.organization_type ?? "—"} · {account.country} · {account.seat_count} ghế
        </p>
        {!account.stripe_subscription_id && (
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
            Tài khoản đã tạo. Đội ngũ sales sẽ liên hệ để gắn Stripe trước khi quyền truy cập kích hoạt cho thành viên.
          </p>
        )}
      </header>

      <InviteSeatsForm corporateAccountId={account.id} />

      <section
        className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm p-5 sm:p-6"
        aria-label="Seat list"
      >
        <h2 className="text-base font-semibold mb-3">
          Thành viên hiện có
          <span className="text-slate-500 font-normal ml-2">Members</span>
        </h2>
        <SeatList corporateAccountId={account.id} isAdmin />
      </section>
    </main>
  );
}
