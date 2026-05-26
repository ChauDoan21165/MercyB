// src/pages/contribute/ContributeSentencePage.tsx
//
// /contribute — submit a new EN↔VI sentence for admin review. Route
// is gated by <RequireAuth> in the router, but we still resolve the
// user id via the auth guard so the form has something to pass.

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ContributeSentenceForm } from '@/components/contribute/ContributeSentenceForm';
import { getCurrentUserIdOrError } from '@/lib/userContent/sentenceSubmission';

export default function ContributeSentencePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await getCurrentUserIdOrError();
      if (cancelled) return;
      if (!result.ok) {
        setAuthError(result.error);
        return;
      }
      setUserId(result.data);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="px-4 py-6 max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Đóng góp một câu</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Gửi một câu tiếng Anh kèm bản dịch tiếng Việt. Đội ngũ MercyBlade sẽ xét duyệt trước khi câu xuất hiện trong thư viện học.
        </p>
        <p className="text-sm mt-2">
          <Link to="/contribute/my-submissions" className="text-blue-700 dark:text-blue-300 underline">
            Xem những câu bạn đã gửi →
          </Link>
        </p>
      </header>

      {authError && (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">{authError}</p>
      )}

      {userId && <ContributeSentenceForm userId={userId} />}
    </main>
  );
}
