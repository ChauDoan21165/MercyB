// src/pages/admin/PendingSentencesPage.tsx
//
// /admin/pending-sentences — queue of user-submitted sentences awaiting
// review. Admin-gated via the existing <AdminRoute> wrapper; any
// non-admin traffic is stopped before this page mounts.
//
// Approved sentences stay in the DB with status = 'approved'. Export
// to public/data/bilingual-sentences.json is NOT part of this page —
// see the TODO note below; that's a deliberate daytime review step
// rather than an automated write.

import React, { useCallback, useEffect, useState } from 'react';

import { AdminPendingSentenceRow } from '@/components/contribute/AdminPendingSentenceRow';
import {
  getCurrentUserIdOrError,
  getPendingSubmissions,
  type SubmissionRow,
} from '@/lib/userContent/sentenceSubmission';

export default function PendingSentencesPage() {
  const [rows, setRows] = useState<SubmissionRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adminUserId, setAdminUserId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const result = await getPendingSubmissions();
    if (!result.ok) {
      setError(result.error);
      setRows([]);
      return;
    }
    setRows(result.data);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const idResult = await getCurrentUserIdOrError();
      if (cancelled) return;
      if (idResult.ok) setAdminUserId(idResult.data);
      await refresh();
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const onReviewed = useCallback(
    (id: string) => {
      // Optimistic: drop the row locally. Parent refetch is also safe,
      // but network latency isn't worth the flash.
      setRows((prev) => (prev ? prev.filter((r) => r.id !== id) : prev));
    },
    [],
  );

  return (
    <main className="px-4 py-6 max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Pending user sentences</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Duyệt / từ chối câu do người học gửi. Câu được duyệt ở lại DB; xuất sang <code>bilingual-sentences.json</code> sẽ làm trong phiên review tay (xem TODO).
        </p>
      </header>

      {error && (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">{error}</p>
      )}

      {rows === null && !error && <p className="text-sm text-slate-500">Đang tải…</p>}

      {rows && rows.length === 0 && !error && (
        <p className="text-sm text-slate-500">Không có câu nào đang chờ duyệt.</p>
      )}

      {rows && rows.length > 0 && adminUserId && (
        <div className="space-y-3">
          {rows.map((r) => (
            <AdminPendingSentenceRow
              key={r.id}
              row={r}
              adminUserId={adminUserId}
              onReviewed={onReviewed}
            />
          ))}
        </div>
      )}

      {/* TODO(step-6-export): Write a daytime-review script that reads
          rows with status = 'approved' and appends them to
          public/data/bilingual-sentences.json, assigning stable bs_<nnn>
          ids and running the schema validator. Deliberately out of scope
          for this PR — automated JSON writes are a risk the non-negotiables
          tell us to avoid. */}
    </main>
  );
}
