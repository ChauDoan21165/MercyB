// src/pages/corporate/JoinCorporatePage.tsx
//
// /corporate/join — learner-facing page. Pastes the 8-char invite
// code (or arrives via /corporate/join?code=…), redeems via the RPC,
// and confirms membership.

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { redeemSeatInvite } from "@/lib/corporate/corporateClient";
import { requireAuth } from "@/lib/security/authGuard";

export default function JoinCorporatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCode = (searchParams.get("code") ?? "").trim().toUpperCase();

  const [userId, setUserId] = useState<string | null>(null);
  const [code, setCode] = useState(initialCode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ctx = await requireAuth();
        if (cancelled) return;
        setUserId(ctx.user?.id ?? null);
      } catch (err) {
        if (cancelled) return;
        setAuthError(err instanceof Error ? err.message : "AUTHENTICATION_REQUIRED");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await redeemSeatInvite(code, userId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      navigate("/account?joined=corporate");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="px-4 py-6 max-w-xl mx-auto">
      <header className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Tham gia gói tổ chức</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Nhập mã 8 ký tự bạn nhận được từ trường, hội thánh, hoặc công ty của mình.
          Mã có hiệu lực 14 ngày.
        </p>
      </header>

      {authError && (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          {authError}
        </p>
      )}

      {userId && (
        <form
          onSubmit={onSubmit}
          className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm p-5 sm:p-6 space-y-4"
        >
          <div>
            <label htmlFor="join-code" className="block text-sm font-semibold mb-1">
              Mã mời
              <span className="text-slate-500 font-normal ml-2">Invite code</span>
            </label>
            <input
              id="join-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={8}
              required
              autoCapitalize="characters"
              spellCheck={false}
              pattern="^[A-HJ-NP-Z2-9]{8}$"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent p-3 text-lg font-mono tracking-widest text-center"
              placeholder="ABCD2345"
            />
            <p className="text-xs text-slate-500 mt-1">
              8 ký tự, không có chữ I/O và số 0/1.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-700 dark:text-red-300" role="alert">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between">
            <Link
              to="/account"
              className="text-sm text-slate-500 hover:underline"
            >
              ← Về trang cá nhân
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 font-medium"
            >
              {submitting ? "Đang xử lý…" : "Tham gia"}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
