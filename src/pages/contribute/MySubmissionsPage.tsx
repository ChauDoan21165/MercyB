// src/pages/contribute/MySubmissionsPage.tsx
//
// /contribute/my-submissions — list the current user's submissions
// with status badges. Route is auth-gated in the router.

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { MySubmissionsList } from '@/components/contribute/MySubmissionsList';
import { getCurrentUserIdOrError } from '@/lib/userContent/sentenceSubmission';

export default function MySubmissionsPage() {
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
        <h1 className="text-xl sm:text-2xl font-bold">Câu bạn đã gửi</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Trạng thái xét duyệt từng câu.
        </p>
        <p className="text-sm mt-2">
          <Link to="/contribute" className="text-blue-700 dark:text-blue-300 underline">
            ← Quay lại trang gửi câu mới
          </Link>
        </p>
      </header>

      {authError && (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">{authError}</p>
      )}

      {userId && <MySubmissionsList userId={userId} />}
    </main>
  );
}
