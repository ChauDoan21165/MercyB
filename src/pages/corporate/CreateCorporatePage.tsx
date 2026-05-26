// src/pages/corporate/CreateCorporatePage.tsx
//
// /corporate/setup — admin creates the corporate account row. The
// route is auth-gated by <RequireAuth> in the router.

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { CorporateAccountForm } from "@/components/corporate/CorporateAccountForm";
import { requireAuth } from "@/lib/security/authGuard";

export default function CreateCorporatePage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ctx = await requireAuth();
        if (cancelled) return;
        setUserId(ctx.user?.id ?? null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "AUTHENTICATION_REQUIRED");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="px-4 py-6 max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Đăng ký gói tổ chức</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Dành cho trường, hội thánh, doanh nghiệp, và nhóm cộng đồng — từ 5 ghế trở lên.
          Sau khi tạo tài khoản, đội ngũ MercyBlade sẽ liên hệ để hoàn tất phần thanh toán Stripe.
        </p>
        <p className="text-sm mt-2">
          <Link to="/corporate" className="text-blue-700 dark:text-blue-300 underline">
            ← Quay lại bảng điều khiển
          </Link>
        </p>
      </header>

      {error && (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          {error}
        </p>
      )}
      {userId && (
        <CorporateAccountForm
          adminUserId={userId}
          onCreated={() => navigate("/corporate")}
        />
      )}
    </main>
  );
}
